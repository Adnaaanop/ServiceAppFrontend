import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';

export interface ProviderProfile {
  businessName: string;
  businessDescription: string | null;
  serviceCategories: string[];
  certificateUrls: string[];
  licenseUrls: string[];
  documentUrls: string[];
  serviceAreas: string[];
  availabilityJson: string | null;
  isApproved: boolean;
  profilePhotoUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProviderProfileService {
  private baseUrl = `${environment.apiUrl}/Provider`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<ProviderProfile> {
    return this.http.get<ProviderProfile>(`${this.baseUrl}/profile/me`);
  }
}
