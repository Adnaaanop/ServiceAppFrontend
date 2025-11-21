import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: false
})
export class ForgotPasswordComponent implements OnInit {
  step: 1 | 2 | 3 = 1;
  loading = false;
  error = '';
  message = '';

  // Forms
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  resetForm!: FormGroup;

  sentEmail: string = '';
  
  // OTP Input Management
  otpDigits: string[] = ['', '', '', '', '', ''];
  
  // Resend OTP Timer
  canResendOtp = false;
  resendTimer = 60;
  private resendInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }

  // Step 1 — Send OTP
  sendOTP() {
    if (this.emailForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.message = '';
    const email = this.emailForm.value.email;
    
    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.loading = false;
        this.sentEmail = email;
        this.message = 'OTP sent! Check your email.';
        this.step = 2;
        this.startResendTimer();
        
        // Clear message after animation
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to send OTP. Please try again.';
      }
    });
  }

  // Resend OTP
  resendOTP() {
    if (!this.canResendOtp) return;
    this.loading = true;
    this.error = '';
    this.message = '';
    
    this.authService.forgotPassword({ email: this.sentEmail }).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'OTP resent successfully!';
        this.otpDigits = ['', '', '', '', '', ''];
        this.startResendTimer();
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to resend OTP. Please try again.';
      }
    });
  }

  // Start Resend Timer
  startResendTimer() {
    this.canResendOtp = false;
    this.resendTimer = 60;
    
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
    
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.canResendOtp = true;
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  // Handle OTP Input
  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      input.value = this.otpDigits[index];
      return;
    }

    // Update the digit
    this.otpDigits[index] = value.slice(-1);
    input.value = this.otpDigits[index];

    // Auto-focus next input
    if (this.otpDigits[index] && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all digits are filled
    if (index === 5 && this.otpDigits.every(d => d !== '')) {
      this.verifyOTP();
    }
  }

  // Handle OTP Keydown
  onOtpKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace') {
      if (this.otpDigits[index] === '' && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          this.otpDigits[index - 1] = '';
          prevInput.value = '';
        }
      } else {
        this.otpDigits[index] = '';
        input.value = '';
      }
    }

    // Handle arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  // Handle OTP Paste
  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    digits.forEach((digit, index) => {
      if (index < 6) {
        this.otpDigits[index] = digit;
        const input = document.getElementById(`otp-${index}`) as HTMLInputElement;
        if (input) input.value = digit;
      }
    });

    // Focus last filled input or first empty
    const lastFilledIndex = digits.length - 1;
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : lastFilledIndex;
    const focusInput = document.getElementById(`otp-${focusIndex}`) as HTMLInputElement;
    if (focusInput) focusInput.focus();

    // Auto-submit if all digits filled
    if (digits.length === 6) {
      setTimeout(() => this.verifyOTP(), 100);
    }
  }

  // Step 2 — Verify OTP
  verifyOTP() {
    const otp = this.otpDigits.join('');
    if (otp.length !== 6) {
      this.error = 'Please enter all 6 digits';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';
    
    this.authService.verifyOtp({ email: this.sentEmail, otp }).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'OTP verified successfully!';
        this.otpForm.patchValue({ otp });
        setTimeout(() => {
          this.step = 3;
          this.message = '';
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid or expired OTP. Please try again.';
        // Shake animation will be triggered by error message
      }
    });
  }

  // Step 3 — Reset Password
  resetPassword() {
    if (this.resetForm.invalid) return;
    
    const { newPassword, confirmPassword } = this.resetForm.value;
    
    if (newPassword !== confirmPassword) {
      this.error = "Passwords don't match.";
      return;
    }

    if (newPassword.length < 6) {
      this.error = "Password must be at least 6 characters long.";
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';
    const otp = this.otpDigits.join('');
    
    this.authService.resetPassword({
      email: this.sentEmail,
      otp,
      newPassword,
      confirmPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Password reset successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to reset password. Please try again.';
      }
    });
  }

  // Navigation
  goToStep(targetStep: 1 | 2 | 3) {
    this.step = targetStep;
    this.error = '';
    this.message = '';
    
    if (targetStep === 1) {
      this.otpDigits = ['', '', '', '', '', ''];
      if (this.resendInterval) {
        clearInterval(this.resendInterval);
      }
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}