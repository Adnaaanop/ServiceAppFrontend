import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, BookingsService } from '../../services/bookings.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  standalone: false,
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = '';

  constructor(private bookingsService: BookingsService, private router: Router) {}

  ngOnInit(): void {
    this.bookingsService.getUserBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load booking history.';
        this.loading = false;
      },
    });
  }

  viewBookingDetails(id: string) {
    this.router.navigate(['/bookings', id]);
  }
}
