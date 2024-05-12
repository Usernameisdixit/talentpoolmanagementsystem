import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HideIdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Modify the URL to hide sensitive information like email or ID
    const modifiedReq = req.clone({
     // url: this.modifyUrl(req.url)
    });
    console.log(modifiedReq);
    
    return next.handle(modifiedReq);
  }

  // private modifyUrl(url: string): string {
  //   debugger;
  //   // Replace email or ID with a placeholder value in the URL
  //   // For example, replace email addresses with 'hidden' or remove them completely
  //   console.log(url);
  //   return url.replace(/\/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '/hidden');
    
  // }
}
