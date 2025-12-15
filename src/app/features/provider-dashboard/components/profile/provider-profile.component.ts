// provider-dashboard/components/profile/provider-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ProviderProfile, ProviderProfileService } from '../../services/provider-profile.service';


@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.scss'],
  standalone: false
})
export class ProviderProfileComponent implements OnInit {
  profile: ProviderProfile | null = null;
  loading = false;
  error: string | null = null;

  constructor(private profileService: ProviderProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = null;

    this.profileService.getMyProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }
}
