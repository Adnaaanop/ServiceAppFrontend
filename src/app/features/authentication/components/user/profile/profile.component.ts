import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone:false
})
export class ProfileComponent {
  userProfile: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('access_token');  // Remove stored access token
        this.router.navigate(['/auth/login']);   // Redirect to login page
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }
}
