import { Component, OnInit } from '@angular/core';
import {
  ProviderServicesService,
  ProviderServiceItem,
  ServiceCreatePayload,
  ServiceUpdatePayload
} from '../../services/provider-services.service';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.scss'],
  standalone: false
})
export class MyServicesComponent implements OnInit {
  services: ProviderServiceItem[] = [];
  loading = false;
  error: string | null = null;

  showForm = false;
  editingService: ProviderServiceItem | null = null;

  formModel: {
    categoryId: string;
    description: string;
    pricingJson: string;
    availabilityScheduleJson: string;
    isApproved: boolean;
    mediaFiles: File[];
  } = {
    categoryId: '',
    description: '',
    pricingJson: '',
    availabilityScheduleJson: '',
    isApproved: false,
    mediaFiles: []
  };

  constructor(private providerServices: ProviderServicesService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.error = null;
    this.providerServices.getMyServices().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load services.';
        this.loading = false;
      }
    });
  }

  getMediaUrls(item: ProviderServiceItem): string[] {
    try {
      return item.mediaUrlsJson ? JSON.parse(item.mediaUrlsJson) : [];
    } catch {
      return [];
    }
  }

  // ===== Form helpers =====

  openCreateForm() {
    this.editingService = null;
    this.formModel = {
      categoryId: '',
      description: '',
      pricingJson: '',
      availabilityScheduleJson: '',
      isApproved: false,
      mediaFiles: []
    };
    this.showForm = true;
  }

  openEditForm(s: ProviderServiceItem) {
    this.editingService = s;
    this.formModel = {
      categoryId: s.categoryId,
      description: s.description || '',
      pricingJson: s.pricingJson,
      availabilityScheduleJson: s.availabilityScheduleJson || '',
      isApproved: s.isApproved,
      mediaFiles: []
    };
    this.showForm = true;
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.formModel.mediaFiles = Array.from(input.files);
  }

  cancelForm() {
    this.showForm = false;
    this.editingService = null;
  }

  saveService() {
    this.loading = true;
    this.error = null;

    if (this.editingService) {
      const payload: ServiceUpdatePayload = {
        categoryId: this.formModel.categoryId,
        description: this.formModel.description,
        pricingJson: this.formModel.pricingJson,
        availabilityScheduleJson: this.formModel.availabilityScheduleJson,
        isApproved: this.formModel.isApproved,
        mediaFiles: this.formModel.mediaFiles
      };

      this.providerServices.updateService(this.editingService.id, payload).subscribe({
        next: () => {
          this.showForm = false;
          this.editingService = null;
          this.loadServices();
        },
        error: () => {
          this.error = 'Failed to update service.';
          this.loading = false;
        }
      });
    } else {
      const payload: ServiceCreatePayload = {
        categoryId: this.formModel.categoryId,
        description: this.formModel.description,
        pricingJson: this.formModel.pricingJson,
        availabilityScheduleJson: this.formModel.availabilityScheduleJson,
        mediaFiles: this.formModel.mediaFiles
      };

      this.providerServices.createService(payload).subscribe({
        next: () => {
          this.showForm = false;
          this.loadServices();
        },
        error: () => {
          this.error = 'Failed to create service.';
          this.loading = false;
        }
      });
    }
  }

  deleteService(s: ProviderServiceItem) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    this.loading = true;
    this.error = null;
    this.providerServices.deleteService(s.id).subscribe({
      next: () => this.loadServices(),
      error: () => {
        this.error = 'Failed to delete service.';
        this.loading = false;
      }
    });
  }
}
