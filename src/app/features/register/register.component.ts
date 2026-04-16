import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    },
    { validators: [this.confirmPasswordMatch] },
  );

  apiError = signal<string>('');
  isLoading = signal<boolean>(false);

  confirmPasswordMatch(group: AbstractControl) {
    const password = group.get('password');
    const rePassword = group.get('rePassword');
    if (password?.value !== rePassword?.value && rePassword?.value !== '') {
      rePassword?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.apiError.set('');
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          console.log(res);
          if (res.message === 'success') {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.apiError.set(err.error.message || 'An error occurred during registration.');
          console.log(err);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
