import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);

  //! 1. Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  //! 2. Do not cache specific endpoints that require real-time updates
  const skipCacheUrls = ['/cart', '/wishlist', '/orders', '/auth', '/users'];
  if (skipCacheUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  //! 3. Check if we have a cached response in our Signal Map
  const cachedResponse = cacheService.get(req.urlWithParams);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  //! 4. Otherwise, continue with the request and cache the response
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.put(req.urlWithParams, event);
      }
    })
  );
};
