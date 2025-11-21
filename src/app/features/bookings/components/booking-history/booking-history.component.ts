import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, BookingsService } from '../../services/bookings.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
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

  cancelBooking(id: string) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    this.bookingsService.cancelBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== id);
      },
      error: () => {
        this.error = 'Failed to cancel booking. Please try again.';
      }
    });
  }
}

}
