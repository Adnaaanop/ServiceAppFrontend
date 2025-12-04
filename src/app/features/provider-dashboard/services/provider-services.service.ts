import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';

export interface ProviderServiceItem {
  id: string;
  providerId: string;
  categoryId: string;
  description: string | null;
  pricingJson: string;
  availabilityScheduleJson: string | null;
  mediaUrlsJson: string | null;
  isApproved: boolean;
  totalBookings: number;
  averageRating: number;
  createdAt: string;
  isDeleted: boolean;
}

export interface ServiceCreatePayload {
  // ProviderId will be set on backend from user, so we don't send it
  categoryId: string;
  description: string;
  pricingJson: string;
  availabilityScheduleJson?: string;
  mediaFiles?: File[];
}

export interface ServiceUpdatePayload {
  categoryId: string;
  description: string;
  pricingJson: string;
  availabilityScheduleJson?: string;
  isApproved: boolean;
  mediaFiles?: File[];
}

@Injectable({ providedIn: 'root' })
export class ProviderServicesService {
  private baseUrl = `${environment.apiUrl}/Service`;

  constructor(private http: HttpClient) {}

  getMyServices(): Observable<ProviderServiceItem[]> {
    return this.http.get<ProviderServiceItem[]>(`${this.baseUrl}/my`);
  }

  createService(payload: ServiceCreatePayload): Observable<ProviderServiceItem> {
    const formData = new FormData();
    // names must match ServiceCreateDtoo
    formData.append('CategoryId', payload.categoryId);
    formData.append('Description', payload.description ?? '');
    formData.append('PricingJson', payload.pricingJson);
    formData.append('AvailabilityScheduleJson', payload.availabilityScheduleJson ?? '');

    (payload.mediaFiles || []).forEach(f =>
      formData.append('MediaFiles', f, f.name)
    );

    return this.http.post<ProviderServiceItem>(this.baseUrl, formData);
  }

  updateService(id: string, payload: ServiceUpdatePayload): Observable<ProviderServiceItem> {
    const formData = new FormData();
    // names must match ServiceUpdateDto
    formData.append('CategoryId', payload.categoryId);
    formData.append('Description', payload.description ?? '');
    formData.append('PricingJson', payload.pricingJson);
    formData.append('AvailabilityScheduleJson', payload.availabilityScheduleJson ?? '');
    formData.append('IsApproved', String(payload.isApproved));

    (payload.mediaFiles || []).forEach(f =>
      formData.append('MediaFiles', f, f.name)
    );

    return this.http.put<ProviderServiceItem>(`${this.baseUrl}/${id}`, formData);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
