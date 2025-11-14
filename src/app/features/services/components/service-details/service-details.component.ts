import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service, ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  standalone: false,
})
export class ServiceDetailsComponent implements OnInit {
  service?: Service;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.servicesService.getServiceById(id).subscribe({
        next: (data) => {
          this.service = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load service details.';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Invalid service ID.';
      this.loading = false;
    }
  }
  bookNow() {
  if (!this.service) return;
  this.router.navigate(['/bookings', this.service.id, 'book']);
}
}
