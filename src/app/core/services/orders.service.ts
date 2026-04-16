import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);

  //! Cash on Delivery
  createCashOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}${environment.orders}/${cartId}`, data);
  }

  //! Online Payment via Stripe
  createOnlineOrder(cartId: string, data: object): Observable<any> {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
    return this.httpClient.post(`${environment.baseUrl}${environment.orders}/checkout-session/${cartId}?url=${origin}`, data);
  }

  //! Get User Orders
  getUserOrders(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}${environment.orders}/user/${userId}`);
  }
}
