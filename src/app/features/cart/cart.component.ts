import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CartService } from '../../core/services/cart.service';
import { Products } from '../../core/models/products.interface';
import { ProductsService } from '../../core/services/products.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';

import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, HeroComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);

  cartDetails = signal<any>(null);

  cartBreadcrumbs: Breadcrumb[] = [
    { label: 'Shopping Cart' }
  ];

  totalItems = computed(() => {
    return this.cartDetails()?.products?.reduce((acc: number, item: any) => acc + item.count, 0) || 0;
  });

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeItem(id: string): void {
    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
      },
    });
  }

  updateCount(id: string, count: number): void {
    if (count <= 0) {
      this.removeItem(id);
      return;
    }
    this.cartService.updateCartProductQuantity(id, count).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
      },
    });
  }

  clearAll(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.cartDetails.set(null);
        }
      },
    });
  }
}
