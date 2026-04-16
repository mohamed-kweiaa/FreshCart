import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  loginForm = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
    }
  );

  apiError = signal<string>('');
  isLoading = signal<boolean>(false);

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.apiError.set('');
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.message === 'success') {
            if (isPlatformBrowser(this.platformId)) {
              //! save token and user data in local storage
              localStorage.setItem('freshToken', res.token);
              localStorage.setItem('freshUser', JSON.stringify(res.user));
            }

            this.authService.isLogged.set(true);

            //! Sync anonymous data to user account
            this.wishlistService.syncWishlist();
            this.cartService.syncCart();

            //! navigate to home page
            this.router.navigate(['/']);
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
