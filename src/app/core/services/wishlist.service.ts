import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  private readonly productsService = inject(ProductsService);
  private readonly platformId = inject(PLATFORM_ID);

  //! Shared state — accessible from navbar, product cards, wishlist page
  wishlistItems = signal<any[]>([]);
  wishlistProductIds = signal<Set<string>>(new Set());
  wishlistCount = signal<number>(0);

  //! Get the user's wishlist
  getWishlist(): Observable<any> {
    const isBrowser = isPlatformBrowser(this.platformId);
    const token = isBrowser ? localStorage.getItem('freshToken') : null;

    if (!token && isBrowser) {
      //! Anonymous Mode: Get details from localStorage IDs
      const localIds = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      if (localIds.length === 0) {
        this.wishlistItems.set([]);
        this.wishlistCount.set(0);
        this.wishlistProductIds.set(new Set());
        return of({ data: [] });
      }

      //! Fetch details for each ID
      const detailRequests = localIds.map((id: string) => 
        this.productsService.getSpecificProduct(id).pipe(map(res => res.data))
      );

      return forkJoin(detailRequests).pipe(
        tap((products: any) => {
          this.wishlistItems.set(products);
          this.wishlistCount.set(products.length);
          this.wishlistProductIds.set(new Set(localIds));
        }),
        map(products => ({ data: products }))
      );
    }

    if (!isBrowser) {
      return of({ data: [] });
    }

    return this.httpClient.get(environment.baseUrl + environment.wishlist).pipe(
      tap((res: any) => {
        if (res && res.data) {
          this.wishlistItems.set(res.data);
          this.wishlistCount.set(res.count || res.data.length);
          const ids = new Set<string>(res.data.map((item: any) => item.id || item._id));
          this.wishlistProductIds.set(ids);
        }
      })
    );
  }

  //! Add a product to the wishlist
  addToWishlist(productId: string): Observable<any> {
    const isBrowser = isPlatformBrowser(this.platformId);
    const token = isBrowser ? localStorage.getItem('freshToken') : null;

    if (!token && isBrowser) {
      //! Anonymous Mode: Save to localStorage
      const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      if (!localWishlist.includes(productId)) {
        localWishlist.push(productId);
        localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
      }
      
      this.wishlistProductIds.update(ids => {
        const newIds = new Set(ids);
        newIds.add(productId);
        return newIds;
      });
      this.wishlistCount.set(this.wishlistProductIds().size);
      
      return of({ message: 'Added to local wishlist', data: localWishlist });
    }

    return this.httpClient.post(environment.baseUrl + environment.wishlist, { productId }).pipe(
      tap((res: any) => {
        const ids = new Set<string>(res.data);
        this.wishlistProductIds.set(ids);
        this.wishlistCount.set(ids.size);
      })
    );
  }

  //! Sync local wishlist to server after login
  syncWishlist(): void {
    if (isPlatformBrowser(this.platformId)) {
      const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      if (localWishlist.length > 0) {
        const syncRequests = localWishlist.map((id: string) => this.addToWishlist(id));
        forkJoin(syncRequests).subscribe({
          next: () => {
             localStorage.removeItem('localWishlist');
             this.getWishlist().subscribe();
          }
        });
      }
    }
  }

  //! Remove a product from the wishlist
  removeFromWishlist(productId: string): Observable<any> {
    const isBrowser = isPlatformBrowser(this.platformId);
    const token = isBrowser ? localStorage.getItem('freshToken') : null;

    if (!token && isBrowser) {
      let localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      localWishlist = localWishlist.filter((id: string) => id !== productId);
      localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
      
      this.wishlistProductIds.set(new Set(localWishlist));
      this.wishlistCount.set(localWishlist.length);
      this.wishlistItems.update(items => items.filter(item => (item.id || item._id) !== productId));
      
      return of({ message: 'Removed from local wishlist', data: localWishlist });
    }

    return this.httpClient.delete(`${environment.baseUrl}${environment.wishlist}/${productId}`).pipe(
      tap((res: any) => {
        const ids = new Set<string>(res.data);
        this.wishlistProductIds.set(ids);
        this.wishlistCount.set(ids.size);
        this.wishlistItems.update(items => items.filter(item => (item.id || item._id) !== productId));
      })
    );
  }

  //! Check if a product is in the wishlist
  isInWishlist(productId: string): boolean {
    const ids = this.wishlistProductIds();
    if (ids.has(productId)) return true;

    //! Check local storage as well for anonymous users (Browser only)
    if (isPlatformBrowser(this.platformId)) {
      const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      return localWishlist.includes(productId);
    }
    
    return false;
  }
}
