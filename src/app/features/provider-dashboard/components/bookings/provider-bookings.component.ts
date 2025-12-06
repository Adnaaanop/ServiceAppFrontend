import { Component, OnInit } from '@angular/core';
import {
  ProviderBookingsService,
  ProviderBookingItem
} from '../../services/provider-bookings.service';

@Component({
  selector: 'app-provider-bookings',
  templateUrl: './provider-bookings.component.html',
  styleUrls: ['./provider-bookings.component.scss'],
  standalone: false
})
export class ProviderBookingsComponent implements OnInit {
  bookings: ProviderBookingItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(private bookingsService: ProviderBookingsService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.error = null;
    this.bookingsService.getMyBookings().subscribe({
      next: (data) => {
        // hide soft-deleted
        this.bookings = data.filter(b => !b.isDeleted);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bookings.';
        this.loading = false;
      }
    });
  }

  changeStatus(b: ProviderBookingItem, status: string) {
    this.loading = true;
    this.error = null;
    this.bookingsService.updateStatus(b.id, status).subscribe({
      next: () => this.loadBookings(),
      error: () => {
        this.error = 'Failed to update booking status.';
        this.loading = false;
      }
    });
  }

  delete(b: ProviderBookingItem) {
    if (!confirm('Delete this booking?')) return;
    this.loading = true;
    this.error = null;
    this.bookingsService.deleteBooking(b.id).subscribe({
      next: () => this.loadBookings(),
      error: () => {
        this.error = 'Failed to delete booking.';
        this.loading = false;
      }
    });
  }

  // helpers
  isPending(b: ProviderBookingItem) { return b.status === 'Pending'; }
  isAccepted(b: ProviderBookingItem) { return b.status === 'Accepted'; }
  isCompleted(b: ProviderBookingItem) { return b.status === 'Completed'; }
}
