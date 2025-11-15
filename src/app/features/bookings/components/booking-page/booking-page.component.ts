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

  // Form fields
  location = '';
  bookingDate = '';
  selectedTimeSlot = '';
  notes = '';

  // Time slots for selection
  timeSlots = [
    { label: '09:00 - 10:00', start: '09:00', end: '10:00' },
    { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
    { label: '11:00 - 12:00', start: '11:00', end: '12:00' },
    { label: '12:00 - 13:00', start: '12:00', end: '13:00' },
    { label: '14:00 - 15:00', start: '14:00', end: '15:00' },
    { label: '15:00 - 16:00', start: '15:00', end: '16:00' },
    { label: '16:00 - 17:00', start: '16:00', end: '17:00' }
  ];

  loading = true;
  error = '';
  successMessage = '';
  submitting = false;

  // Get minimum date (today)
  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in (has valid access token)
    if (!localStorage.getItem('access_token')) {
      this.error = 'Please login to book a service';
      this.router.navigate(['/login']);
      return;
    }

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
    if (!this.location || !this.bookingDate || !this.selectedTimeSlot) {
      this.error = 'Please fill all required fields';
      return;
    }

    this.error = '';
    this.submitting = true;

    // Parse the selected time slot
    const selectedSlot = this.timeSlots.find(slot => slot.label === this.selectedTimeSlot);
    if (!selectedSlot) {
      this.error = 'Invalid time slot selected';
      this.submitting = false;
      return;
    }

    // Create ISO datetime strings for timeSlotStart and timeSlotEnd
    const timeSlotStart = new Date(`${this.bookingDate}T${selectedSlot.start}:00`);
    const timeSlotEnd = new Date(`${this.bookingDate}T${selectedSlot.end}:00`);

    // Build payload according to backend schema
    const payload = {
      userId: this.getUserId(),
      providerId: this.service?.providerId || '00000000-0000-0000-0000-000000000000',
      serviceId: this.serviceId,
      timeSlotStart: timeSlotStart.toISOString(),
      timeSlotEnd: timeSlotEnd.toISOString(),
      location: this.location,
      estimatedCost: this.getEstimatedCost()
    };

    this.bookingsService.createBooking(payload).subscribe({
      next: () => {
        this.successMessage = 'Booking confirmed successfully!';
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/services', this.serviceId]), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Booking failed. Please try again later.';
        this.submitting = false;
      }
    });
  }

  // Helper method to get current user ID from JWT token in localStorage
  private getUserId(): string {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Decode JWT token (without verification - just parsing)
        const payload = this.parseJwt(token);
        
        // Common JWT claim names for user ID
        return payload.sub || 
               payload.userId || 
               payload.id || 
               payload.nameid || 
               payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
               '00000000-0000-0000-0000-000000000000';
      }
    } catch (error) {
      console.error('Error parsing user ID from token:', error);
    }
    return '00000000-0000-0000-0000-000000000000';
  }

  // Helper method to parse JWT token
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return {};
    }
  }

  // Helper method to get estimated cost
  private getEstimatedCost(): number {
    // Since your Service interface doesn't have a price field,
    // you can either parse it from pricingJson or return 0
    try {
      if (this.service?.pricingJson) {
        const pricing = JSON.parse(this.service.pricingJson);
        return pricing.basePrice || pricing.price || 0;
      }
    } catch (error) {
      console.error('Error parsing pricing:', error);
    }
    return 0;
  }

  cancel() {
    this.router.navigate(['/services', this.serviceId]);
  }
}