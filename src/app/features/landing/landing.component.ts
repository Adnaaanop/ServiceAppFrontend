import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: false
})
export class LandingComponent {
  searchQuery: string = '';

  serviceCategories = [
    { name: 'Plumbing', icon: '🔧' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Carpentry', icon: '🪚' },
    { name: 'House Cleaning', icon: '🧹' },
    { name: 'Hair Dressing', icon: '💇' },
    { name: 'Beauty Services', icon: '💅' },
    { name: 'Painting', icon: '🎨' },
    { name: 'Gardening', icon: '🌱' },
    { name: 'AC Repair', icon: '❄️' },
    { name: 'Appliance Repair', icon: '🔌' },
    { name: 'Pest Control', icon: '🐛' },
    { name: 'Moving Services', icon: '📦' }
  ];

  trustedCompanies = [
    'HomeDepot', 'Lowe\'s', 'TaskRabbit', 'Angie\'s List', 'HomeAdvisor', 'Thumbtack'
  ];

  howItWorks = [
    {
      step: '1',
      icon: '🔍',
      title: 'Find the right service',
      desc: 'Browse home services or search for specific needs. Review ratings, prices, and availability to find your perfect match.'
    },
    {
      step: '2',
      icon: '💬',
      title: 'Book & schedule',
      desc: 'Message providers directly, discuss your requirements, and schedule a convenient time for the service.'
    },
    {
      step: '3',
      icon: '✅',
      title: 'Get it done',
      desc: 'Professional service at your doorstep. Pay securely after the work is completed to your satisfaction.'
    }
  ];

  features = [
    {
      icon: '⭐',
      title: 'Verified Professionals',
      desc: 'All service providers are background-checked and verified with real customer reviews.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      desc: 'See upfront pricing with no hidden fees. Compare rates and choose what fits your budget.'
    },
    {
      icon: '🚀',
      title: 'Same-Day Service',
      desc: 'Need urgent help? Many providers offer same-day or next-day service availability.'
    },
    {
      icon: '🛡️',
      title: 'Secure Booking',
      desc: 'Safe and secure payment processing with satisfaction guarantee on all services.'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      desc: 'Our customer support team is always available to help with any questions or concerns.'
    },
    {
      icon: '🏠',
      title: 'Local Experts',
      desc: 'Connect with skilled professionals in your area who understand local needs and regulations.'
    }
  ];

  popularSearches = [
    'Plumber near me',
    'House Cleaning',
    'Electrician',
    'Carpenter'
  ];

  constructor(private router: Router) {}

  handleSearch(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    console.log('Search:', this.searchQuery);
    // Navigate to search results or services page
    // this.router.navigate(['/services'], { queryParams: { q: this.searchQuery } });
  }

  searchPopular(term: string) {
    this.searchQuery = term;
    this.handleSearch();
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }

  navigateToProviderRegister() {
    this.router.navigate(['/auth/provider/register']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}