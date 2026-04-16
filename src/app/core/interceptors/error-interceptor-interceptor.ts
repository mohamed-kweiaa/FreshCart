import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((err) => {
      //! Only show toasts in the browser to avoid SSR ReferenceErrors (window is not defined)
      if (isPlatformBrowser(platformId)) {
        const errorMessage = err?.error?.message || err?.message || 'An unexpected error occurred';
        toastrService.error(errorMessage, 'Fresh Cart', {
          progressBar: true,
          closeButton: true
        });
      } else {
        console.error('Server-side Error Intercepted:', err?.error?.message || err?.message);
      }

      return throwError(() => err);
    }),
  );
};
