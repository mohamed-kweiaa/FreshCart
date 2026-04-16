import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  
  isCodeSent = signal<boolean>(false);
  isLogged = signal<boolean>(false);
  currentUser = signal<any>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('freshToken');
      const user = localStorage.getItem('freshUser');
      if (token !== null) {
        this.isLogged.set(true);
      }
      if (user !== null) {
        this.currentUser.set(JSON.parse(user));
      }
    }
  }

  logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('freshToken');
      localStorage.removeItem('freshUser');
    }
    this.isLogged.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + environment.auth + '/signup', data);
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + environment.auth + '/signin', data).pipe(
      tap((res: any) => {
        if (res.message === 'success') {
          this.currentUser.set(res.user);
        }
      })
    );
  }

  forgotPassword(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + environment.auth + '/forgotPasswords', data);
  }

  verifyResetCode(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + environment.auth + '/verifyResetCode', data);
  }

  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + environment.auth + '/resetPassword', data);
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + '/api/v1/users/changeMyPassword', data);
  }

  updateUserData(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + '/api/v1/users/updateMe', data);
  }
}
