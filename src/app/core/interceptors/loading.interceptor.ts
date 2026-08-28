import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingService = inject(LoadingService);
  if (request.headers.has('X-Finlex-Silent')) {
    return next(request.clone({ headers: request.headers.delete('X-Finlex-Silent') }));
  }

  loadingService.show();

  return next(request).pipe(finalize(() => loadingService.hide()));
};
