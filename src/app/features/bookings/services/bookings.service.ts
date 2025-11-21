import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { AuthService } from '../../authentication/services/auth.service'; // Adjust path if needed

export interface BookingPayload {
  userId: string;
  providerId: string;
  serviceId: string;
  timeSlotStart: string;
  timeSlotEnd: string;
  location: string;
  estimatedCost: number;
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

  constructor(private http: HttpClient, private auth: AuthService) {}

  createBooking(payload: BookingPayload): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, payload);
  }

  /** Returns only bookings for the logged-in user */
  getUserBookings(): Observable<Booking[]> {
  const userId = this.auth.getLoggedInUserId();
  return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
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
