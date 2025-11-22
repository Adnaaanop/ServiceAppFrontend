import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../authentication/services/auth.service';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService implements OnDestroy {
  private hubConnection!: signalR.HubConnection;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/Messages`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  /** Start SignalR connection, subscribe for the given user. Call on entering chat */
  startConnection(): void {
    const userId = this.auth.getLoggedInUserId();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api','')}/chathub`, {
        accessTokenFactory: () => this.auth.getAccessToken() || ""
      })
      .build();

    this.hubConnection.start().catch(err => console.error('SignalR connection error:', err));

    this.hubConnection.on('ReceiveMessage', (msg: Message) => {
      this.messagesSubject.next([...this.messagesSubject.value, msg]);
    });
  }

  /** Send a new chat message */
  sendMessage(msg: { bookingId: string, messageText: string, receiverId: string }): void {
    const senderId = this.auth.getLoggedInUserId();
    this.hubConnection.invoke('SendMessage',
      senderId, 
      msg.messageText,
      msg.bookingId,
      senderId,
      msg.receiverId
    ).catch(err => console.error('SignalR send error:', err));
  }

  /** Fetch chat history for a given booking via REST */
  fetchMessageHistory(bookingId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/booking/${bookingId}`);
  }

  setInitialMessages(messages: Message[]): void {
    this.messagesSubject.next(messages);
  }

  ngOnDestroy() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
