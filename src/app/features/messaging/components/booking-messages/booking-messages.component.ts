import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, BookingsService } from '../../../bookings/services/bookings.service';

@Component({
  selector: 'app-booking-messages',
  templateUrl: './booking-messages.component.html',
  standalone: false
})
export class BookingMessagesComponent implements OnInit {
  acceptedBookings: Booking[] = [];
  loading = true;

  constructor(private bookingsService: BookingsService, private router: Router) {}

  ngOnInit() {
    this.bookingsService.getUserBookings().subscribe(bookings => {
      this.acceptedBookings = bookings.filter(b => b.status === 'Accepted');
      this.loading = false;
    });
  }

  openChat(booking: Booking) {
    this.router.navigate(['/dashboard/messages', booking.id], {
      queryParams: { providerId: booking.providerId }
    });
  }
}
