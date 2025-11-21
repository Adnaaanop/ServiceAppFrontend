import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  pageMode: 'login' | 'forgot' | 'reset' = 'login';
  loginMethod: 'email' | 'phone' = 'email';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  setLoginMethod(method: 'email' | 'phone') {
    this.loginMethod = method;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('access_token', res.data.token);
        const decodedToken = this.jwtHelper.decodeToken(res.data.token);
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (role === 'Provider') {
  this.router.navigate(['/dashboard']); // or to a provider-specific dashboard if you have one
} else {
  this.router.navigate(['/dashboard']);
}

      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid email or password';
      }
    });
  }

  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);

  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }

  registerAsProvider() {
    this.router.navigate(['/auth/provider/register']);
  }
}
