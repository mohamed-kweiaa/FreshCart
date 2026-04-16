import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly productsService = inject(ProductsService);
  private readonly platformId = inject(PLATFORM_ID);

  cartCount = signal<number>(0);
  cartProductIds = signal<Set<string>>(new Set());

  getLoggedUserCart(): Observable<any> {
    const isBrowser = isPlatformBrowser(this.platformId);
    const token = isBrowser ? localStorage.getItem('freshToken') : null;

    if (!token && isBrowser) {
      //! Anonymous Mode: Read from localStorage
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const ids = new Set<string>(localCart.map((item: any) => item.productId));
      this.cartProductIds.set(ids);
      if (localCart.length === 0) {
        this.cartCount.set(0);
        this.cartProductIds.set(new Set());
        return of({ data: { products: [], totalCartPrice: 0 } });
      }

      //! Fetch details for each product in local cart
      const detailRequests = localCart.map((item: any) =>
        this.productsService.getSpecificProduct(item.productId).pipe(
          map(res => ({
            count: item.count,
            price: res.data.price,
            product: res.data
          }))
        )
      );

      return forkJoin(detailRequests).pipe(
        map((products: any) => {
          const total = products.reduce((acc: number, curr: any) => acc + (curr.price * curr.count), 0);
          const count = products.reduce((acc: number, curr: any) => acc + curr.count, 0);
          this.cartCount.set(count);
          return { data: { products, totalCartPrice: total } };
        })
      );
    }

    if (!isBrowser) {
      return of({ data: { products: [], totalCartPrice: 0 } });
    }

    return this.httpClient.get(environment.baseUrl + environment.cart).pipe(
      tap((res: any) => {
        this.cartCount.set(res.numOfCartItems || 0);

        let products = [];
        if (res.data && res.data.products) {
          products = res.data.products;
        } else if (res.data && Array.isArray(res.data)) {
          products = res.data;
        } else if (Array.isArray(res)) {
          products = res;
        }

        const ids = new Set<string>();
        products.forEach((item: any) => {
          const id = item.product?._id || item.product?.id || item.product || item._id || item.id;
          if (typeof id === 'string') ids.add(id);
        });
        this.cartProductIds.set(ids);
      })
    );
  }

  addProductToCart(productId: string): Observable<any> {
    const isBrowser = isPlatformBrowser(this.platformId);
    const token = isBrowser ? localStorage.getItem('freshToken') : null;

    if (!token && isBrowser) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const index = localCart.findIndex((item: any) => item.productId === productId);

      if (index > -1) {
        localCart[index].count++;
      } else {
        localCart.push({ productId, count: 1 });
      }

      localStorage.setItem('localCart', JSON.stringify(localCart));
      const totalCount = localCart.reduce((acc: number, item: any) => acc + item.count, 0);
      this.cartCount.set(totalCount);
      this.cartProductIds.update(ids => new Set([...ids, productId]));
      return of({ message: 'Product added to local cart', data: localCart });
    }

    return this.httpClient.post(environment.baseUrl + environment.cart, { productId }).pipe(
      switchMap((res: any) => {
        this.cartCount.set(res.numOfCartItems || 0);
        return this.getLoggedUserCart().pipe(map(() => res));
      })
    );
  }

  isInCart(productId: string): boolean {
    return this.cartProductIds().has(productId);
  }

  syncCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      if (localCart.length > 0) {
        const syncRequests: Observable<any>[] = [];
        localCart.forEach((item: any) => {
          for (let i = 0; i < item.count; i++) {
             syncRequests.push(this.addProductToCart(item.productId));
          }
        });

        forkJoin(syncRequests).subscribe({
          next: () => {
            localStorage.removeItem('localCart');
            this.getLoggedUserCart().subscribe();
          }
        });
      }
    }
  }

  updateCartProductQuantity(productId: string, newCount: number): Observable<any> {
    const isBrowser = isPlatformBrowser(this.platformId);
    const token = isBrowser ? localStorage.getItem('freshToken') : null;

    if (!token && isBrowser) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const index = localCart.findIndex((item: any) => item.productId === productId);
      if (index > -1) {
        localCart[index].count = newCount;
        localStorage.setItem('localCart', JSON.stringify(localCart));
        const totalCount = localCart.reduce((acc: number, item: any) => acc + item.count, 0);
        this.cartCount.set(totalCount);
      }
      return this.getLoggedUserCart();
    }

    return this.httpClient.put(`${environment.baseUrl}${environment.cart}/${productId}`, {
      count: newCount,
    }).pipe(
      switchMap((res: any) => {
        this.cartCount.set(res.numOfCartItems || 0);
        return this.getLoggedUserCart().pipe(map(() => res));
      })
    );
  }

  removeSpecificCartItem(productId: string): Observable<any> {
    const isBrowser = isPlatformBrowser(this.platformId);
    const token = isBrowser ? localStorage.getItem('freshToken') : null;

    if (!token && isBrowser) {
      let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      localCart = localCart.filter((item: any) => item.productId !== productId);
      localStorage.setItem('localCart', JSON.stringify(localCart));
      const totalCount = localCart.reduce((acc: number, item: any) => acc + item.count, 0);
      this.cartCount.set(totalCount);
      return this.getLoggedUserCart();
    }

    return this.httpClient.delete(`${environment.baseUrl}${environment.cart}/${productId}`).pipe(
      switchMap((res: any) => {
        this.cartCount.set(res.numOfCartItems || 0);
        return this.getLoggedUserCart().pipe(map(() => res));
      })
    );
  }

  clearCart(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('localCart');
    }
    this.cartProductIds.set(new Set());
    this.cartCount.set(0);
    return this.httpClient.delete(environment.baseUrl + environment.cart).pipe(
      tap(() => {
        this.cartCount.set(0);
        this.cartProductIds.set(new Set());
      })
    );
  }
}
