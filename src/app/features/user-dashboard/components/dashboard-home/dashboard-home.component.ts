import { Component } from '@angular/core';

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

interface Booking {
  id: number;
  service: string;
  provider: string;
  time: string;
  location: string;
  status: 'Confirmed' | 'Pending';
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

interface Service {
  id: number;
  name: string;
  price: string;
  rating: number;
  category: string;
  emoji: string;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  standalone: false
})
export class DashboardHomeComponent {
  userName = 'User';

  quickActions: QuickAction[] = [
    {
      id: 1,
      title: 'Book Service',
      description: 'Find & book',
      icon: 'calendar',
      color: 'bg-blue-500',
      route: '/dashboard/services'
    },
    {
      id: 2,
      title: 'My Bookings',
      description: 'View history',
      icon: 'list',
      color: 'bg-purple-500',
      route: '/dashboard/bookings'
    },
    {
      id: 3,
      title: 'Messages',
      description: 'Chat now',
      icon: 'message',
      color: 'bg-green-500',
      route: '/dashboard/messages'
    },
    {
      id: 4,
      title: 'Payments',
      description: 'Manage funds',
      icon: 'wallet',
      color: 'bg-orange-500',
      route: '/dashboard/payments'
    },
    {
      id: 5,
      title: 'Profile',
      description: 'Edit details',
      icon: 'user',
      color: 'bg-pink-500',
      route: '/dashboard/profile'
    }
  ];

  upcomingBookings: Booking[] = [
    {
      id: 1,
      service: 'House Cleaning',
      provider: 'CleanPro Services',
      time: 'Today, 2:00 PM',
      location: '123 Main St',
      status: 'Confirmed'
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      provider: 'QuickFix Plumbers',
      time: 'Tomorrow, 10:00 AM',
      location: '456 Oak Ave',
      status: 'Pending'
    }
  ];

  recentNotifications: Notification[] = [
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your house cleaning service has been confirmed for today.',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'New Message',
      message: 'CleanPro Services sent you a message about your booking.',
      time: '5 hours ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'Payment Due',
      message: 'Payment for electrical work is due in 2 days.',
      time: '1 day ago',
      type: 'warning'
    }
  ];

  recommendedServices: Service[] = [
    { id: 1, name: 'House Cleaning', price: '$120', rating: 4.8, category: 'Cleaning', emoji: '🏠' },
    { id: 2, name: 'AC Repair', price: '$100', rating: 4.9, category: 'Repair', emoji: '❄️' },
    { id: 3, name: 'Interior Painting', price: '$200', rating: 4.7, category: 'Painting', emoji: '🎨' },
    { id: 4, name: 'Electrical Work', price: '$150', rating: 4.8, category: 'Electrical', emoji: '⚡' },
    { id: 5, name: 'Plumbing Services', price: '$80', rating: 4.6, category: 'Plumbing', emoji: '🔧' },
    { id: 6, name: 'Carpet Cleaning', price: '$90', rating: 4.9, category: 'Cleaning', emoji: '🧼' }
  ];

  getNotificationClass(type: string): string {
    const classes = {
      success: 'bg-green-50 border-green-200',
      info: 'bg-blue-50 border-blue-200',
      warning: 'bg-orange-50 border-orange-200'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-50 border-gray-200';
  }

  getNotificationIconClass(type: string): string {
    const classes = {
      success: 'text-green-600',
      info: 'text-blue-600',
      warning: 'text-orange-600'
    };
    return classes[type as keyof typeof classes] || 'text-gray-600';
  }
}