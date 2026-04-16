import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient)

  getAllProducts():Observable<any>{
    return this.httpClient.get(environment.baseUrl+environment.products)
  }

  getSpecificProduct(id:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl+environment.products+`/${id}`)
  }

  getProductsBySubcategory(subcategoryId:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}${environment.products}?subcategory[in]=${subcategoryId}`)
  }

  getProductsPaginated(page: number = 1, limit: number = 20):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}${environment.products}?page=${page}&limit=${limit}`)
  }

  getProductsByCategory(categoryId:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}${environment.products}?category[in]=${categoryId}`)
  }

  getProductsByBrand(brandId:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}${environment.products}?brand[in]=${brandId}`)
  }
}
