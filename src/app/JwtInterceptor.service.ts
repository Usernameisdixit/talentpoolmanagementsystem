// jwt-interceptor.service.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userToken = localStorage.getItem('token');

    if (userToken != undefined && userToken != '') {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${userToken}`,
          
        },
      });
    }
    console.log("header value at JwtInterceptor",request);
    
    return next.handle(request);
  }
}
