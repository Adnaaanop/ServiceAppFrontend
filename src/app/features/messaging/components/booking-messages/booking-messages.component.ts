import { Component, OnInit } from '@angular/core';
import { Booking, BookingsService } from '../../../bookings/services/bookings.service';

@Component({
  selector: 'app-booking-messages',
  templateUrl: './booking-messages.component.html',
  styleUrls: ['./booking-messages.component.scss'],
  standalone: false
})
export class BookingMessagesComponent implements OnInit {
  acceptedBookings: Booking[] = [];
  loading = true;
  searchQuery = '';
  selectedBookingId: string | null = null;
  selectedReceiverId: string | null = null;

  constructor(private bookingsService: BookingsService) {}

  ngOnInit() {
    this.bookingsService.getUserBookings().subscribe(bookings => {
      this.acceptedBookings = bookings.filter(b => b.status === 'Accepted');
      this.loading = false;
    });
  }

  openChat(booking: Booking) {
    this.selectedBookingId = booking.id;
    this.selectedReceiverId = booking.providerId;
    // Don't navigate, just update local properties!
  }
}
