import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent {
  userName: string = 'User Name'; // Replace with dynamic user data as needed

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth']);
  }

  goToSettings() {
    this.router.navigate(['/dashboard/settings']);
  }
}
