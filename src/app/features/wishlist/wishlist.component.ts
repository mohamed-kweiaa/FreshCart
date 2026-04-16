import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, LoadingComponent, HeroComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  readonly wishlistService = inject(WishlistService);
  readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  isLoading = signal<boolean>(true);

  wishlistBreadcrumbs: Breadcrumb[] = [
    { label: 'My Wishlist' }
  ];

  ngOnInit(): void {
    // If we already have data (e.g. from navbar load), show it immediately
    if (this.wishlistService.wishlistItems().length > 0) {
      this.isLoading.set(false);
    }

    this.loadWishlist();
    this.cartService.getLoggedUserCart().subscribe();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        error: (err) => {
          console.log('Failed to load wishlist:', err);
        },
      });
  }

  addToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Product added to cart');
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to add product');
      }
    });
  }

  removeItem(productId: string): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      error: (err) => console.log('Remove error:', err),
    });
  }
}
