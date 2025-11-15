import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';

// Request payload - matches your backend POST schema
export interface BookingPayload {
  userId: string;
  providerId: string;
  serviceId: string;
  timeSlotStart: string; // ISO datetime string
  timeSlotEnd: string;   // ISO datetime string
  location: string;
  estimatedCost: number;
}

// Response interface - what you get back from the API
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

  createBooking(payload: BookingPayload): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, payload);
  }

  getUserBookings(): Observable<Booking[]> {
    // Assumes backend returns bookings for logged-in user
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${bookingId}`);
  }

  updateBooking(bookingId: string, payload: Partial<BookingPayload>): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${bookingId}`, payload);
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }
}