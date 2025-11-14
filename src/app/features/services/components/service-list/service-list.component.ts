import { Component, OnInit } from '@angular/core';
import { Service, ServicesService } from '../../services/services.service';

interface Category {
  id: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  standalone: false,
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  error = '';

  searchQuery = '';
  selectedCategory = 'all';

  categories: Category[] = [
    { id: 'all', name: 'All Services', color: 'text-blue-600' },
    { id: 'cleaning', name: 'Cleaning', color: 'text-purple-600' },
    { id: 'plumbing', name: 'Plumbing', color: 'text-blue-600' },
    { id: 'electrical', name: 'Electrical', color: 'text-yellow-600' },
    { id: 'repair', name: 'Repair', color: 'text-red-600' },
    { id: 'painting', name: 'Painting', color: 'text-green-600' },
    { id: 'beauty', name: 'Beauty', color: 'text-pink-600' },
  ];

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.servicesService.getServiceItems().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load services.';
        this.loading = false;
      },
    });
  }

  get filteredServices(): Service[] {
    return this.services.filter(s =>
      (this.selectedCategory === 'all' || s.categoryId === this.selectedCategory) &&
      (!this.searchQuery || s.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  selectCategory(catId: string) {
    this.selectedCategory = catId;
  }
}
