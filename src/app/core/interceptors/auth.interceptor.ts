import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Global } from '../variables/globales';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private sett: Global,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apikey = this.sett.getToken();
    if (apikey) {
      var headersAuthorization: string = apikey;
      const clone = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${headersAuthorization}`)
        // setHeaders: { 'Authorization': `Bearer ${headersAuthorization}` }
      });
      return next.handle(clone);
    } 
    
    return next.handle(req);
  }

  // validarUrlsPermitidos(url: string): boolean {
  //   const URL_PERMITIDOS = ["/users/forgotPassword/", "/cuentasClausuradas/personas/"];
  //   URL_PERMITIDOS.forEach(element => {
  //     if (url.indexOf(element) > 0) {
  //       return true;
  //     }
  //   });
  //   return false;
  // }

}
