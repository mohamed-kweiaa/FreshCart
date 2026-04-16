
import { Component, computed, inject, input, OnInit, signal, effect } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Products } from '../../core/models/products.interface';
import { RouterLink } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-shared',
  imports: [RouterLink, StarRatingComponent ],
  templateUrl: './products-shared.component.html',
  styleUrl: './products-shared.component.css',
})
export class ProductsSharedComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  readonly wishlistService = inject(WishlistService);
  readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  externalProducts = input<Products[] | null>(null);
  limit = input<number>(0);
  compactTitle = input<boolean>(false);
  productList = signal<Products[]>([]);

  displayedProducts = computed(() => {
    const list = this.productList();
    const lim = this.limit();
    return lim > 0 ? list.slice(0, lim) : list;
  });

  constructor() {
    effect(() => {
      const external = this.externalProducts();
      if (external) {
        this.productList.set(external);
      }
    });
  }

  ngOnInit(): void {
    if (!this.externalProducts()) {
      this.getProductsData();
    }
  }

  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleWishlist(productId: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.wishlistService.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: (res) => {
          this.toastrService.warning(res.message || 'Removed from Wishlist', 'FreshCart');
        },
        error: (err) => console.log('Remove from wishlist error:', err),
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: (res) => {
          this.toastrService.success(res.message || 'Added to Wishlist', 'FreshCart');
        },
        error: (err) => console.log('Add to wishlist error:', err),
      });
    }
  }

  addToCart(productId: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this.toastrService.success(res.message || 'Product added successfully', 'FreshCart', {
          progressBar: true,
          closeButton: true,
          timeOut: 2000,
          positionClass: 'toast-top-right',
        });
      },
    });
  }
}
