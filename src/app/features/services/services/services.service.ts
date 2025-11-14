import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';

export interface Service {
  id: string;
  providerId: string;
  categoryId: string;
  description: string;
  pricingJson: string;
  availabilityScheduleJson: string;
  mediaUrlsJson: string;
  isApproved: boolean;
  totalBookings: number;
  averageRating: number;
  createdAt: string;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private apiUrl = `${environment.apiUrl}/Service`;

  constructor(private http: HttpClient) {}

  getServiceItems(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }
}
