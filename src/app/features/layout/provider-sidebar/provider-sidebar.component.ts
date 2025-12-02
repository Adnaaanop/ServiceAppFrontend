import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ProviderMenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-provider-sidebar',
  templateUrl: './provider-sidebar.component.html',
  styleUrls: ['./provider-sidebar.component.scss'],
  standalone: false
})
export class ProviderSidebarComponent {

  menuItems: ProviderMenuItem[] = [
    { label: 'Dashboard',      icon: 'home',    route: '/provider/dashboard' },
    { label: 'My Services',    icon: 'brief',   route: '/provider/dashboard/services' },
    { label: 'Bookings',       icon: 'calendar',route: '/provider/dashboard/bookings' },
    { label: 'Messages',       icon: 'chat',    route: '/provider/dashboard/messages' },
    { label: 'Payouts',        icon: 'wallet',  route: '/provider/dashboard/payouts' },
    { label: 'Profile',        icon: 'user',    route: '/provider/dashboard/profile' },
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
