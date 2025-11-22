import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { BookingMessagesComponent } from './components/booking-messages/booking-messages.component';

const routes: Routes = [
  // Default "messages" page shows the chat component
  { path: '', component: BookingMessagesComponent },
  { path: ':bookingId', component: ChatComponent }
  // Later, you can add routes like { path: 'conversation/:bookingId', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagingRoutingModule { }
