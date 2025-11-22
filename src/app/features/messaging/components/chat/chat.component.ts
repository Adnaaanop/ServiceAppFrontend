// chat.component.ts
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class ChatComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() bookingId!: string;
  @Input() receiverId!: string;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  messages: Message[] = [];
  newMessage = '';
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  myUserId = '';

  private sub?: Subscription;
  private shouldScroll = false;

  constructor(
    private messagesService: MessagesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.myUserId = this.auth.getLoggedInUserId() || '';
    this.messagesService.startConnection();
    
    this.sub = this.messagesService.messages$.subscribe(msgs => {
      this.messages = msgs.filter(m => m.bookingId === this.bookingId);
      this.shouldScroll = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingId'] && this.bookingId) {
      this.loadMessages();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadMessages(): void {
    this.messagesService.fetchMessageHistory(this.bookingId).subscribe(msgs => {
      this.messages = msgs;
      this.messagesService.setInitialMessages(msgs);
      this.shouldScroll = true;
    });
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => this.photoPreview = reader.result as string;
    }
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.photoPreview = null;
  }

  send(): void {
    if (!this.bookingId || !this.receiverId || (!this.newMessage.trim() && !this.selectedFile)) {
      console.error('Cannot send: missing data');
      return;
    }

    if (this.selectedFile) {
      // Use REST for file + text message
      const formData = new FormData();
      formData.append('BookingId', this.bookingId);
      formData.append('SenderId', this.myUserId);
      formData.append('ReceiverId', this.receiverId);
      formData.append('MessageText', this.newMessage.trim());
      formData.append('MediaFile', this.selectedFile);

      this.messagesService.sendMessageWithFile(formData).subscribe(
        (msg) => {
          this.messages.push(msg);
          this.removePhoto();
          this.newMessage = '';
          this.shouldScroll = true;
        },
        (error) => console.error('File message send error:', error)
      );
    } else {
      // Use SignalR for text-only message
      this.messagesService.sendMessage({
        bookingId: this.bookingId,
        receiverId: this.receiverId,
        messageText: this.newMessage.trim()
      });
      this.newMessage = '';
      this.shouldScroll = true;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.messagesService.ngOnDestroy();
  }
}