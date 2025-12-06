import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../enviroments/enviroment';

export interface ProviderBookingItem {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  timeSlotStart: string;
  timeSlotEnd: string | null;
  status: string;
  location: string;
  estimatedCost: number | null;
  actualCost: number | null;
  createdAt: string;
  isDeleted: boolean;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProviderBookingsService {
  private baseUrl = `${environment.apiUrl}/Booking`;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  private getProviderId(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    // same claim you used earlier for services
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier'] 
           || decoded['sub'] 
           || null;
  }

  getMyBookings(): Observable<ProviderBookingItem[]> {
    const providerId = this.getProviderId();
    return this.http.get<ProviderBookingItem[]>(`${this.baseUrl}/provider/${providerId}`);
  }

  updateStatus(id: string, status: string): Observable<ProviderBookingItem> {
    // backend expects raw string body
    return this.http.put<ProviderBookingItem>(`${this.baseUrl}/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
