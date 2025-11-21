import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/Auth`;
  private usersUrl = `${environment.apiUrl}/Users`;
  private providerUrl = `${environment.apiUrl}/Provider`;

  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // --------------------
  // Auth endpoints
  // --------------------
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, data);
  }

  refreshToken(data: { refreshToken: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/refresh-token`, data);
  }

  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/forgot-password`, data);
  }

  verifyOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/verify-otp`, data);
  }

  resetPassword(data: { email: string; otp: string; newPassword: string; confirmPassword: string; }): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, data);
  }

  logout(): Observable<any> {
    localStorage.removeItem('access_token');
    return this.http.post(`${this.authUrl}/logout`, {});
  }

  // --------------------
  // User endpoints
  // --------------------
  registerUser(data: any): Observable<any> {
    return this.http.post(this.usersUrl, data);
  }

  getUserProfile(): Observable<any> {
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

  // --------------------
  // Provider endpoints
  // --------------------
  registerProvider(data: any): Observable<any> {
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

  // --------------------
  // Temporary admin endpoint
  // --------------------
  getAllProvidersForAdmin(): Observable<any> {
    return this.http.get(`${this.providerUrl}/all-admin`);
  }

  // ------------------------------------------------------
  // ADDED FOR STATE MANAGEMENT AND AUTH INFO ACCESS
  // ------------------------------------------------------

  /** Returns decoded userId from JWT token */
  getLoggedInUserId(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded['sub'] || decoded['userId'] || null; // adjust as per JWT claims
  }

  /** Returns decoded user role from JWT token */
  getLoggedInUserRole(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || decoded['role'] || null; // adjust as per JWT claims
  }

  /** Returns decoded user email from JWT token */
  getLoggedInUserEmail(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded['email'] || null;
  }

  /** Returns true if token exists and is not expired */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    return !this.jwtHelper.isTokenExpired(token);
  }
}
