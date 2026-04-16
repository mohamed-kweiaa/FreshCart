import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css',
})
export class ForgotComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  step = signal<number>(1);

  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  code: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  ]);

  isLoading = signal<boolean>(false);

  resendCode(): void {
    if (this.email.valid) {
      this.isLoading.set(true);
      this.authService.forgotPassword({ email: this.email.value }).subscribe({
        next: (res) => {
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
        }
      });
    }
  }

  changeEmail(): void {
    this.step.set(1);
  }

  submitEmail(event: Event): void {
    event.preventDefault();
    if (this.email.valid) {

      const data = {
        email: this.email.value,
      };
      //! Sending To Api
      this.authService.forgotPassword(data).subscribe({
        next : (res) => {
          this.step.set(2);
        }
      })
    }
  }

  submitCode(event: Event): void {
    event.preventDefault();
    if (this.code.valid) {

      const data = {
        resetCode: this.code.value,
      };
      //! Sending To Api
      this.authService.verifyResetCode(data).subscribe({
        next : (res) => {
          this.step.set(3);
        }
      })
    }
  }

  submitPassword(event: Event): void {
    event.preventDefault();
    if (this.password.valid) {
      const data = {
        email: this.email.value,
        newPassword: this.password.value,
      };
      //! Sending To Api
      this.authService.resetPassword(data).subscribe({
        next : (res) => {
          this.router.navigate(['/login']);
        }
      })
    }
  }
}
