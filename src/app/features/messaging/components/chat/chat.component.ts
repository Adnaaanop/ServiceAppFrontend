// chat.component.ts - Improved Version
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
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  
  messages: Message[] = [];
  newMessage = '';
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  myUserId = '';
  modalImageUrl: string | null = null;
  isSending = false;

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
      const container = this.scrollContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch(err) { 
      console.error('Scroll error:', err);
    }
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
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  openImageModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal(): void {
    this.modalImageUrl = null;
    document.body.style.overflow = 'auto';
  }

  send(): void {
  if (!this.bookingId || !this.receiverId || (!this.newMessage.trim() && !this.selectedFile)) {
    console.error('Cannot send: missing data');
    return;
  }

  if (this.isSending) {
    return; // Prevent double sending
  }

  this.isSending = true;
  const messageText = this.newMessage.trim();

  if (this.selectedFile) {
    // Send message with file
    const formData = new FormData();
    formData.append('BookingId', this.bookingId);
    formData.append('SenderId', this.myUserId);
    formData.append('ReceiverId', this.receiverId);
    formData.append('MessageText', messageText);
    formData.append('MediaFile', this.selectedFile);

    // Create optimistic message
    const optimisticMessage: Message = {
      id: 'temp-' + Date.now(),
      bookingId: this.bookingId,
      senderId: this.myUserId,
      receiverId: this.receiverId,
      messageText: messageText,
      mediaUrl: this.photoPreview || undefined,
      timestamp: new Date().toISOString() // Changed here
    };

    // Add optimistic message to UI immediately
    this.messages.push(optimisticMessage);
    this.shouldScroll = true;
    
    // Clear inputs immediately
    this.newMessage = '';
    this.removePhoto();

    this.messagesService.sendMessageWithFile(formData).subscribe(
      (serverMessage) => {
        // Replace optimistic message with real one from server
        const index = this.messages.findIndex(m => m.id === optimisticMessage.id);
        if (index !== -1) {
          this.messages[index] = serverMessage;
        }
        this.isSending = false;
        this.shouldScroll = true;
        
        // Focus back on input
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      },
      (error) => {
        console.error('File message send error:', error);
        // Remove optimistic message on error
        const index = this.messages.findIndex(m => m.id === optimisticMessage.id);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
        this.isSending = false;
        alert('Failed to send message. Please try again.');
      }
    );
  } else {
    // Send text-only message
    const optimisticMessage: Message = {
      id: 'temp-' + Date.now(),
      bookingId: this.bookingId,
      senderId: this.myUserId,
      receiverId: this.receiverId,
      messageText: messageText,
      timestamp: new Date().toISOString() // Changed here too
    };

    // Add optimistic message immediately
    this.messages.push(optimisticMessage);
    this.shouldScroll = true;
    this.newMessage = '';
    
    // Send via SignalR
    this.messagesService.sendMessage({
      bookingId: this.bookingId,
      receiverId: this.receiverId,
      messageText: messageText
    });

    // SignalR will send back the real message through the subscription
    // The optimistic message will be replaced when the real one arrives
    setTimeout(() => {
      this.isSending = false;
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 500);
  }
}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.messagesService.ngOnDestroy();
    document.body.style.overflow = 'auto'; // Clean up modal overflow lock
  }
}