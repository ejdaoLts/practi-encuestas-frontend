import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpTimeoutInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = performance.now();
    return next.handle(req).pipe(
      tap(() => {
        const time: number = performance.now() - start;

        const url = environment.apiUrl;

        if (time > 5) console.log(req.url.replace(`${url}/`, '/'), time.toFixed() + 'ms');
      })
    );
  }
}
