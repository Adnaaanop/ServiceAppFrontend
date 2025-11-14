import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';

export interface BookingPayload {
  serviceId: string;
  address: string;
  phone: string;
  bookingDate: string;
  timeSlot: string;
  notes?: string;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  timeSlotStart: string;
  timeSlotEnd: string;
  status: string;
  location: string;
  estimatedCost: number;
  actualCost: number | null;
  createdAt: string;
  isDeleted: boolean;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private apiUrl = `${environment.apiUrl}/Booking`;

  constructor(private http: HttpClient) {}

  createBooking(payload: BookingPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
  getUserBookings(): Observable<Booking[]> {
    // Assumes backend returns bookings for logged-in user
    return this.http.get<Booking[]>(this.apiUrl);
  }
}
