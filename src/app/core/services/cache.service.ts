import { Injectable, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  //! Signal to hold our cached HTTP responses
  private cache = signal<Map<string, HttpResponse<any>>>(new Map());

  //! Get a cached response by URL
  get(reqUrl: string): HttpResponse<any> | undefined {
    return this.cache().get(reqUrl);
  }

  //! Cache a new response
  put(reqUrl: string, response: HttpResponse<any>): void {
    this.cache.update(map => {
      const newMap = new Map(map);
      newMap.set(reqUrl, response);
      return newMap;
    });
  }

  //! Clear the entire cache
  invalidateCache(): void {
    this.cache.set(new Map());
  }

  //! Remove a specific URL from cache
  invalidateUrl(reqUrl: string): void {
    this.cache.update(map => {
      const newMap = new Map(map);
      newMap.delete(reqUrl);
      return newMap;
    });
  }
}
