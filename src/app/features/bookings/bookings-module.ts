import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingsRoutingModule } from './bookings-routing-module';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';

@NgModule({
  declarations: [
    BookingPageComponent,
    BookingHistoryComponent

  ],
  imports: [CommonModule, FormsModule, BookingsRoutingModule],
  providers: [DatePipe,CurrencyPipe]
})
export class BookingsModule {}
