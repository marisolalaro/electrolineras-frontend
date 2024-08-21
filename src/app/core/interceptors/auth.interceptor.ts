import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/modules/login/services/login.service';
LoginService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: LoginService, private router: Router) {}

  // interceptor para ajuntar el token en el HEADER de TOKEN AUTORIZACION cada vez que se llame a un servicio
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // TOKEN EXPIRADO
          this.authService.logout();
          this.router.navigate(['/']);
        }
        return throwError(error);
      })
    );
  }
  
}
