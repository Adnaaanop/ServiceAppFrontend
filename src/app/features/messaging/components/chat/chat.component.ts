import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { Message } from '../../models/message.model';
import { AuthService } from '../../../authentication/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() bookingId!: string;
  @Input() receiverId!: string; // for 1:1 booking chat

  messages: Message[] = [];
  newMessage = '';
  private sub?: Subscription;
  myUserId = '';

  constructor(
    private messagesService: MessagesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.myUserId != this.auth.getLoggedInUserId();

    // Fetch message history
    this.messagesService.fetchMessageHistory(this.bookingId).subscribe(msgs => {
      this.messages = msgs;
      this.messagesService.setInitialMessages(msgs);
    });

    // Set up SignalR connection
    this.messagesService.startConnection();
    this.sub = this.messagesService.messages$.subscribe(msgs => {
      this.messages = msgs.filter(m => m.bookingId === this.bookingId);
    });
  }

  send(): void {
    if (!this.newMessage.trim()) return;
    this.messagesService.sendMessage({
      bookingId: this.bookingId,
      receiverId: this.receiverId,
      messageText: this.newMessage.trim()
    });
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.messagesService.ngOnDestroy();
  }
}
