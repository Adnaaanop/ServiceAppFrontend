import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private authUrl = `${environment.apiUrl}/Auth`;
  private usersUrl = `${environment.apiUrl}/Users`;
  private providerUrl = `${environment.apiUrl}/Provider`;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, data);
  }

  refreshToken(data: { refreshToken: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/refresh-token`, data);
  }

  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/forgot-password`, data);
  }

resetPassword(data: { email: string; otp: string; newPassword: string; confirmPassword: string; }): Observable<any> {
  return this.http.post(`${this.authUrl}/reset-password`, data);
}

  // User endpoints
  registerUser(data: any): Observable<any> {
    // Accepts user registration data
    return this.http.post(this.usersUrl, data);
  }

  getUserProfile(): Observable<any> {
    // Gets info about the currently authenticated user
    return this.http.get(`${this.usersUrl}/me`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.usersUrl}/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.usersUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${id}`);
  }

  // Provider endpoints
  registerProvider(data: any): Observable<any> {
    // Accepts provider-specific registration data
    return this.http.post(`${this.providerUrl}/register`, data);
  }

  getProviderProfile(userId: string): Observable<any> {
    return this.http.get(`${this.providerUrl}/profile/${userId}`);
  }

  updateProviderProfile(userId: string, data: any): Observable<any> {
    return this.http.put(`${this.providerUrl}/profile/${userId}`, data);
  }

  approveProviderByAdmin(data: any): Observable<any> {
    return this.http.post(`${this.providerUrl}/approve-admin`, data);
  }


  // SHould be moved to features/admin secction temporarily placed here
  getAllProvidersForAdmin(): Observable<any> {
  return this.http.get(`${this.providerUrl}/all-admin`);
}
  
}
