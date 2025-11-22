import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  bookingId!: string;
  receiverId!: string; // for 1:1 booking chat

  messages: Message[] = [];
  newMessage = '';
  private sub?: Subscription;
  myUserId = '';

  constructor(
    private messagesService: MessagesService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.myUserId = this.auth.getLoggedInUserId() || '';

    // Get route and query params and assign to local vars—this is what you are missing!
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId') || '';
    });
    this.route.queryParamMap.subscribe(params => {
      this.receiverId = params.get('providerId') || '';
    });

    // Only fetch and subscribe if bookingId is present
    setTimeout(() => {
      if (!this.bookingId) {
        console.error('BookingId is not provided to ChatComponent.');
        return;
      }

      // Fetch message history for this bookingId
      this.messagesService.fetchMessageHistory(this.bookingId).subscribe(msgs => {
        this.messages = msgs;
        this.messagesService.setInitialMessages(msgs);
      });

      // Set up SignalR connection
      this.messagesService.startConnection();
      this.sub = this.messagesService.messages$.subscribe(msgs => {
        this.messages = msgs.filter(m => m.bookingId === this.bookingId);
      });
    });
  }

  send(): void {
    console.log('CHAT SEND:', {
      bookingId: this.bookingId,
      receiverId: this.receiverId,
      messageText: this.newMessage
    });

    if (!this.bookingId || !this.receiverId || !this.newMessage.trim()) {
      console.error('Cannot send: missing bookingId, receiverId, or messageText');
      return;
    }

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
