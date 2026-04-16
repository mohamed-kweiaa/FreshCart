import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Products } from '../../core/models/products.interface';
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";
import { ToastrService } from 'ngx-toastr';
import { ProductsSharedComponent } from '../../shared/products-shared/products-shared.component';

@Component({
  selector: 'app-details',
  imports: [StarRatingComponent, RouterLink, ProductsSharedComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  readonly wishlistService = inject(WishlistService);
  readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  productDetails = signal<Products | null>(null);
  relatedProducts = signal<Products[]>([]);
  activeImage = signal<string>('');
  quantity = signal<number>(1);
  activeTab = signal<'details' | 'reviews' | 'shipping'>('details');

  totalPrice = computed(() => {
    const product = this.productDetails();
    if (!product) return 0;
    return product.price * this.quantity();
  });
  
  ratingBreakdown = [
    { star: 5, percentage: 5 },
    { star: 4, percentage: 5 },
    { star: 3, percentage: 25 },
    { star: 2, percentage: 40 },
    { star: 1, percentage: 25 },
  ];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProductDetails(id);
      }
    });
  }

  getProductDetails(id: string): void {
    this.productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        this.productDetails.set(res.data);
        this.activeImage.set(res.data.imageCover);
        this.quantity.set(1);
        if (res.data.category?._id) {
          this.getRelatedProducts(res.data.category._id);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getRelatedProducts(categoryId: string): void {
    this.productsService.getProductsByCategory(categoryId).subscribe({
      next: (res) => {
        this.relatedProducts.set(res.data);
      }
    });
  }

  changeImage(img: string): void {
    this.activeImage.set(img);
  }

  increaseQuantity(): void {
    const product = this.productDetails();
    if (product && this.quantity() < product.quantity) {
      this.quantity.update(q => q + 1);
    } else if (product) {
      this.toastrService.info(`Only ${product.quantity} items available`);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const product = this.productDetails();
    if (!product) return;
    const id = product.id || product._id;
    const qtyToAdd = this.quantity();

    this.cartService.getLoggedUserCart().subscribe({
      next: (cartRes) => {
        const cartProducts = cartRes.data?.products || [];
        const existingItem = cartProducts.find((item: any) => 
          (item.product?._id || item.product?.id || item.productId) === id
        );

        if (existingItem) {
          const newTotalCount = existingItem.count + qtyToAdd;
          this.cartService.updateCartProductQuantity(id, newTotalCount).subscribe({
            next: () => {
              this.toastrService.success(`${qtyToAdd} x ${product.title} added to cart`, 'FreshCart');
            }
          });
        } else {
          this.cartService.addProductToCart(id).subscribe({
            next: () => {
              if (qtyToAdd > 1) {
                this.cartService.updateCartProductQuantity(id, qtyToAdd).subscribe({
                  next: () => {
                    this.toastrService.success(`${qtyToAdd} x ${product.title} added to cart`, 'FreshCart');
                  }
                });
              } else {
                this.toastrService.success(`${qtyToAdd} x ${product.title} added to cart`, 'FreshCart');
              }
            }
          });
        }
      }
    });
  }

  buyNow(): void {
    const product = this.productDetails();
    if (!product) return;
    const id = product.id || product._id;
    const qtyToAdd = this.quantity();
    
    this.cartService.getLoggedUserCart().subscribe({
      next: (cartRes) => {
        const cartProducts = cartRes.data?.products || [];
        const existingItem = cartProducts.find((item: any) => 
          (item.product?._id || item.product?.id || item.productId) === id
        );

        const navigateToCart = () => this.router.navigate(['/cart']);

        if (existingItem) {
          const newTotalCount = existingItem.count + qtyToAdd;
          this.cartService.updateCartProductQuantity(id, newTotalCount).subscribe({ next: navigateToCart });
        } else {
          this.cartService.addProductToCart(id).subscribe({
            next: () => {
              if (qtyToAdd > 1) {
                this.cartService.updateCartProductQuantity(id, qtyToAdd).subscribe({ next: navigateToCart });
              } else {
                navigateToCart();
              }
            }
          });
        }
      }
    });
  }

  toggleWishlist(): void {
    const product = this.productDetails();
    if (!product) return;
    const id = product.id || product._id;

    if (this.wishlistService.isInWishlist(id)) {
      this.wishlistService.removeFromWishlist(id).subscribe({
        next: () => this.toastrService.warning('Removed from Wishlist', 'FreshCart'),
        error: (err) => console.log('Remove from wishlist error:', err),
      });
    } else {
      this.wishlistService.addToWishlist(id).subscribe({
        next: () => this.toastrService.success('Added to Wishlist', 'FreshCart'),
        error: (err) => console.log('Add to wishlist error:', err),
      });
    }
  }
}
