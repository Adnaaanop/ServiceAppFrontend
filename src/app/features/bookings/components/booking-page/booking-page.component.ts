import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service, ServicesService } from '../../../services/services/services.service';
import { BookingsService } from '../../services/bookings.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  standalone: false
})
export class BookingPageComponent implements OnInit {
  serviceId!: string;
  service?: Service;

  address = '';
  phone = '';
  bookingDate = '';
  timeSlot = '';
  notes = '';

  timeSlots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '14:00 - 15:00'];

  loading = true;
  error = '';
  successMessage = '';
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.serviceId) {
      this.error = 'Invalid Service ID';
      this.loading = false;
      return;
    }

    this.servicesService.getServiceById(this.serviceId).subscribe({
      next: (svc) => {
        this.service = svc;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load service details';
        this.loading = false;
      }
    });
  }

  submitBooking() {
    if (!this.address || !this.phone || !this.bookingDate || !this.timeSlot) {
      this.error = 'Please fill all required fields';
      return;
    }
    this.error = '';
    this.submitting = true;

    const payload = {
      serviceId: this.serviceId,
      address: this.address,
      phone: this.phone,
      bookingDate: this.bookingDate,
      timeSlot: this.timeSlot,
      notes: this.notes
    };

    this.bookingsService.createBooking(payload).subscribe({
      next: () => {
        this.successMessage = 'Booking successful!';
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/services', this.serviceId]), 3000);
      },
      error: () => {
        this.error = 'Booking failed. Please try again later.';
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/services', this.serviceId]);
  }
}
