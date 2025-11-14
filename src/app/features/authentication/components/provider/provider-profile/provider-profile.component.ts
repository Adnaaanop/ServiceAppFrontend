import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-provider-profile',
  standalone: false,
  templateUrl: './provider-profile.component.html',
  styleUrl: './provider-profile.component.scss',
})
export class ProviderProfileComponent implements OnInit {

  profile: any = null;
  loading = true;
  error = '';

  constructor(private authService: AuthService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    const decodedToken = this.jwtHelper.decodeToken(token || '');
    const userId = decodedToken['sub']; // 'sub' contains user ID in UUID format

    if (!userId) {
      this.error = 'User not logged in.';
      this.loading = false;
      return;
    }

    this.authService.getProviderProfile(userId).subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load provider profile.';
        this.loading = false;
        console.error('Provider profile error', err);
      },
    });
  }

  parseJsonString(str: string): string[] {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }
}
