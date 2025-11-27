import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-provider-register',
  templateUrl: './provider-register.component.html',
  styleUrls: ['./provider-register.component.scss'],
  standalone: false 
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

  // File arrays
  certificateFiles: File[] = [];
  licenseFiles: File[] = [];
  documentFiles: File[] = [];
  profilePhoto?: File;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.providerForm = this.fb.group({
      fullName: ['', Validators.required],
      businessName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      businessDescription: [''],
      serviceCategories: [[]],
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

  handleFileUpload(event: Event, type: 'certificate' | 'license' | 'document' | 'profilePhoto') {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);

    if (type === 'certificate') {
      this.certificateFiles = files;
    } else if (type === 'license') {
      this.licenseFiles = files;
    } else if (type === 'document') {
      this.documentFiles = files;
    } else if (type === 'profilePhoto' && files.length > 0) {
      this.profilePhoto = files[0];
    }
  }

  submitRegistration() {
    this.loading = true;
    this.error = '';
    const payload = this.providerForm.value;
    if (this.providerForm.invalid) {
      this.error = 'Please fill all required fields.';
      this.loading = false;
      return;
    }
    if (payload.password !== payload.confirmPassword) {
      this.error = "Passwords don't match.";
      this.loading = false;
      return;
    }

    // Assemble FormData for multipart POST
    const formData = new FormData();
    formData.append('FullName', payload.fullName);
    formData.append('BusinessName', payload.businessName);
    formData.append('Email', payload.email);
    formData.append('PhoneNumber', payload.phoneNumber);
    formData.append('Password', payload.password);
    formData.append('ConfirmPassword', payload.confirmPassword);
    formData.append('BusinessDescription', payload.businessDescription ?? '');
    (payload.serviceCategories ?? []).forEach((cat: string) => formData.append('ServiceCategories', cat));
    (payload.serviceAreas ?? []).forEach((area: string) => formData.append('ServiceAreas', area));
    formData.append('AvailabilityJson', payload.availabilityJson ?? '');

    // Append files
    this.certificateFiles.forEach(file => formData.append('CertificateFiles', file, file.name));
    this.licenseFiles.forEach(file => formData.append('LicenseFiles', file, file.name));
    this.documentFiles.forEach(file => formData.append('DocumentFiles', file, file.name));
    if (this.profilePhoto) formData.append('ProfilePhoto', this.profilePhoto, this.profilePhoto.name);

    this.authService.registerProvider(formData).subscribe({
      next: (res) => {
        this.loading = false;
        alert('Registration successful! Your account is pending admin approval.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
