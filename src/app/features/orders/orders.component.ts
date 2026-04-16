import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { DatePipe, isPlatformBrowser, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, RouterLink, SlicePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly platformId = inject(PLATFORM_ID);

  orders = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('freshToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id;

          this.ordersService.getUserOrders(userId).subscribe({
            next: (res) => {
              const ordersData = Array.isArray(res) ? res : res.data;
              const sorted = ordersData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              this.orders.set(sorted);
              this.isLoading.set(false);
            },
            error: (err) => {
              console.error('Failed to load orders', err);
              this.isLoading.set(false);
            }
          });
        } catch (e) {
          console.error('Invalid token structure', e);
          this.isLoading.set(false);
        }
      } else {
        this.isLoading.set(false);
      }
    }
  }
}
