import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Add this!
import { ChatComponent } from './components/chat/chat.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { RouterModule } from '@angular/router';
import { BookingMessagesComponent } from './components/booking-messages/booking-messages.component';

@NgModule({
  declarations: [ChatComponent,BookingMessagesComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, 
    MessagingRoutingModule    
  ],
  exports: [ChatComponent,BookingMessagesComponent]
})
export class MessagingModule {} 
