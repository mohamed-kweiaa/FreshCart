import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../../core/services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly ordersService = inject(OrdersService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  cartId: string | null = null;
  isLoading = signal<boolean>(false);

  checkoutForm = this.formBuilder.group({
    details: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required]],
    payment_method: ['cash', [Validators.required]]
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.cartId = params.get('cartId');
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && this.cartId) {
      this.isLoading.set(true);

      const shippingAddress = {
        details: this.checkoutForm.value.details,
        phone: this.checkoutForm.value.phone,
        city: this.checkoutForm.value.city
      };

      const paymentMethod = this.checkoutForm.value.payment_method;

      if (paymentMethod === 'cash') {
        this.ordersService.createCashOrder(this.cartId, { shippingAddress }).subscribe({
          next: (res) => {
            if (res.status === 'success') {
               this.toastrService.success('Order placed successfully!', 'FreshCart');
               this.cartService.cartCount.set(0);
               this.router.navigate(['/orders']);
            }
            this.isLoading.set(false);
          },
          error: (err) => {
            this.toastrService.error('Failed to place order', 'FreshCart');
            this.isLoading.set(false);
          }
        });
      } else {
        //! Online payment (Stripe)
        this.ordersService.createOnlineOrder(this.cartId, { shippingAddress }).subscribe({
          next: (res) => {
            if (res.status === 'success') {
               //! Redirect to Stripe checkout
               window.open(res.session.url, '_self');
            }
            this.isLoading.set(false);
          },
          error: (err) => {
            this.toastrService.error('Failed to initiate secure payment', 'FreshCart');
            this.isLoading.set(false);
          }
        });
      }
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
