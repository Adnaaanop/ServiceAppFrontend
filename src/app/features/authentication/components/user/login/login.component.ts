// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../../services/auth.service';
// import { Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';

// @Component({
//   selector: 'app-login',
//   standalone: false,
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginComponent implements OnInit {
// loginForm!: FormGroup;
//   loading = false;
//   error: string | null = null;

//   // Forgot/reset password UI state
//   pageMode: 'login' | 'forgot' | 'reset' = 'login';
//   forgotPasswordForm!: FormGroup;
//   resetPasswordForm!: FormGroup;
//   forgotEmail: string = '';
//   otpSent: boolean = false;
//   resetSuccess: boolean = false;
//   message: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router,
//     private jwtHelper: JwtHelperService
//   ) {}

//   ngOnInit(): void {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//     });

//     this.forgotPasswordForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//     });

//     this.resetPasswordForm = this.fb.group({
//       email: [{value: '', disabled: false}, [Validators.required, Validators.email]], // Will be set after OTP sent
//       otp: ['', Validators.required],
//       newPassword: ['', Validators.required],
//       confirmPassword: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.invalid) return;
//     this.loading = true;
//     this.error = null;
//     this.message = '';
//     this.authService.login(this.loginForm.value).subscribe({
//       next: (res) => {
//         this.loading = false;
//         localStorage.setItem('access_token', res.token);
//         localStorage.setItem('refresh_token', res.refreshToken);
//         const decodedToken = this.jwtHelper.decodeToken(res.token);
//         const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
//         if (userRole === 'Provider') {
//           this.router.navigate(['/auth/provider/profile']);
//         } else if (userRole === 'User') {
//           this.router.navigate(['/auth/profile']);
//         } else {
//           this.router.navigate(['/profile']);
//         }
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = 'Invalid email or password';
//         console.error('Login error', err);
//       },
//     });
//   }

//   // UI navigation handlers
//   goToForgotPassword(): void {
//     this.pageMode = 'forgot';
//     this.error = '';
//     this.message = '';
//     this.forgotPasswordForm.reset();
//   }

//   goToResetPassword(email: string): void {
//     this.pageMode = 'reset';
//     this.otpSent = true;
//     this.resetSuccess = false;
//     // pre-fill/reset the email field (keep disabled for integrity)
//     this.resetPasswordForm.reset();
//     this.resetPasswordForm.patchValue({ email: email });
//     this.resetPasswordForm.controls['email'].disable();
//     this.error = '';
//     this.message = '';
//   }

//   backToLogin(): void {
//     this.pageMode = 'login';
//     this.error = '';
//     this.message = '';
//     this.otpSent = false;
//     this.resetSuccess = false;
//     this.resetPasswordForm.reset();
//   }

//   sendForgotPassword(): void {
//     if (this.forgotPasswordForm.invalid) return;
//     this.loading = true;
//     this.error = '';
//     this.message = '';
//     const email = this.forgotPasswordForm.value.email;
//     this.authService.forgotPassword({ email }).subscribe({
//       next: () => {
//         this.loading = false;
//         this.message = 'OTP sent! Check your email for the code.';
//         this.goToResetPassword(email);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = 'Failed to send OTP. Please try again.';
//       },
//     });
//   }

//   resetPassword(): void {
//     if (this.resetPasswordForm.invalid) return;
//     const { newPassword, confirmPassword, otp } = this.resetPasswordForm.getRawValue();
//     const email = this.resetPasswordForm.getRawValue().email || this.forgotPasswordForm.value.email;

//     if (newPassword !== confirmPassword) {
//       this.error = "Passwords don't match.";
//       return;
//     }
//     this.loading = true;
//     this.error = '';
//     this.message = '';
//     // Use your backend's expected DTO structure
//     this.authService.resetPassword({
//       email,
//       otp,
//       newPassword,
//       confirmPassword
//     }).subscribe({
//       next: () => {
//         this.loading = false;
//         this.resetSuccess = true;
//         this.message = 'Password reset successful! You can now log in.';
//         setTimeout(() => this.backToLogin(), 1500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = 'Failed to reset password. Check your OTP and try again.';
//       }
//     });
//   }


// }


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
        localStorage.setItem('access_token', res.token);
        const decodedToken = this.jwtHelper.decodeToken(res.token);
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (role === 'Provider') {
          this.router.navigate(['/auth/provider/profile']);
        } else {
          this.router.navigate(['/auth/profile']);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid email or password';
      }
    });
  }

  goToForgotPassword() {
    this.pageMode = 'forgot';
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }

  registerAsProvider() {
    this.router.navigate(['/auth/provider/register']);
  }
}
