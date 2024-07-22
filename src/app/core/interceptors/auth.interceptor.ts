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
          // Token has expired or is invalid
          this.authService.logout();
          this.router.navigate(['/']);
        }
        return throwError(error);
      })
    );
  }
  
}
