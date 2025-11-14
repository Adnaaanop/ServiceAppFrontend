import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-provider-register',
  standalone: false,
  templateUrl: './provider-register.component.html',
  styleUrl: './provider-register.component.scss',
})
export class ProviderRegisterComponent {

   step = 1;
  maxStep = 6;
  loading = false;
  error = '';

  serviceCategoryList = [
    'Cleaning', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Landscaping', 'Moving',
    'Pest Control', 'Appliance Repair', 'Locksmith', 'Roofing', 'Flooring', 'Home Security', 'General Handyman'
  ];

  areaList = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA',
    'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
  ];

  daysList = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  providerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private authService: AuthService) {
    this.providerForm = this.fb.group({
      fullName: ['', Validators.required],
      businessName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      businessDescription: [''],
      serviceCategories: [[]],
      certificateUrls: [[]],
      licenseUrls: [[]],
      documentUrls: [[]],
      serviceAreas: [[]],
      availabilityJson: ['']
    });
  }

  get selectedDays(): string[] {
    try {
      return JSON.parse(this.providerForm.value.availabilityJson || '[]');
    } catch {
      return [];
    }
  }

  nextStep() {
    if (this.step < this.maxStep) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  toggleServiceCategory(category: string) {
    const categories: string[] = this.providerForm.value.serviceCategories || [];
    if (categories.includes(category)) {
      this.providerForm.patchValue({ serviceCategories: categories.filter(c => c !== category) });
    } else {
      this.providerForm.patchValue({ serviceCategories: [...categories, category] });
    }
  }

  toggleServiceArea(area: string) {
    const areas: string[] = this.providerForm.value.serviceAreas || [];
    if (areas.includes(area)) {
      this.providerForm.patchValue({ serviceAreas: areas.filter(a => a !== area) });
    } else {
      this.providerForm.patchValue({ serviceAreas: [...areas, area] });
    }
  }

  selectDay(day: string) {
    let days: string[] = [];
    try {
      days = JSON.parse(this.providerForm.value.availabilityJson) || [];
    } catch {
      days = [];
    }
    if (days.includes(day)) {
      days = days.filter(d => d !== day);
    } else {
      days.push(day);
    }
    this.providerForm.patchValue({ availabilityJson: JSON.stringify(days) });
  }

  handleFileUpload(event: Event, type: 'certificate' | 'license' | 'document') {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      urls.push(files[i].name);
    }
    if (type === 'certificate') {
      this.providerForm.patchValue({ certificateUrls: urls });
    } else if (type === 'license') {
      this.providerForm.patchValue({ licenseUrls: urls });
    } else {
      this.providerForm.patchValue({ documentUrls: urls });
    }
  }

submitRegistration() {
  this.loading = true;
  this.error = '';
  if (this.providerForm.invalid) {
    this.error = 'Please fill all required fields.';
    this.loading = false;
    return;
  }
  if (this.providerForm.value.password !== this.providerForm.value.confirmPassword) {
    this.error = "Passwords don't match.";
    this.loading = false;
    return;
  }
  
  const payload = this.providerForm.value;
  console.log('Submitting provider registration:', payload);  // Log payload

  this.authService.registerProvider(payload).subscribe({
    next: (res) => {
      this.loading = false;
      console.log('Registration response:', res);  // Log response
      alert('Registration successful! Your account is pending admin approval.');
      this.router.navigate(['/auth/login']);
    },
    error: (err) => {
      this.loading = false;
      console.error('Registration error', err);  // Log full error
      this.error = err?.error?.message || 'Registration failed. Please try again.';
    }
  });
}

}
