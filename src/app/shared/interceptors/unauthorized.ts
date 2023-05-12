import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export class UnauthorizedInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if ([401].indexOf(err.status) !== -1) {
          if (!window.location.href.includes('access-control/login')) {
            localStorage.clear();
            document.location.reload();
          }
        }
        return throwError(() => err);
      })
    );
  }
}
