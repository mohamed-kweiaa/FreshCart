import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService, { optional: true });
  public readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit() {
    this.initForms();
    this.loadUserData();
  }

  private initForms() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required]]
    });
  }

  private loadUserData() {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.authService.updateUserData(this.profileForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.authService.currentUser.set(res.user);
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('freshUser', JSON.stringify(res.user));
            }
            this.toastr?.success('Profile updated successfully');
          }
        },
        error: (err) => {
          this.toastr?.error(err.error.message || 'Error updating profile');
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      if(this.passwordForm.value.password !== this.passwordForm.value.rePassword) {
        this.toastr?.error('Passwords do not match');
        return;
      }
      this.authService.changePassword(this.passwordForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.toastr?.success('Password changed successfully');
            this.passwordForm.reset();
          }
        },
        error: (err) => {
          this.toastr?.error(err.error.message || 'Error changing password');
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}


