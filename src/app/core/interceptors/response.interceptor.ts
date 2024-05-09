import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { SettingsService } from '../auth/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    // private toastr: ToastrService,
    // private sett: SettingsService
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    throw new Error('Method not implemented.');
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status == 401 && (error.error).error == "invalid_token") {
  //         sessionStorage.clear();
  //         this.toastr.error('Vuelva a iniciar sesión', 'Su sesión expiró', { timeOut: 3000 });
  //         this.router.navigate(['/login']);
  //       } else if (error.status == 401 && error.statusText == "Unauthorized" && error.error == "Unauthorized") {
  //         sessionStorage.clear();
  //         this.toastr.error('Vuelva a iniciar sesión', 'Su sesión expiró', { timeOut: 3000 });
  //         this.cerrarSession();
  //       } else if (error.status == 401) {
  //         this.toastr.error('Error de permisos', '', { timeOut: 3000 });
  //       } else if (error.status == 404 || error.status == 0) {
  //         this.toastr.error('No se encontró la página que estás buscando', '', { timeOut: 3000 });
  //       } else {
  //         //Credenciales incorrectas
  //         // if ("invalid_grant" == (error.error).error) {
  //         //   this.toastr.error('El correo y/o la contraseña son incorrectas', '', { timeOut: 3000 });
  //         // } else {
  //         sessionStorage.setItem("mensaje_asfi_pendiente", JSON.stringify(error.error));
  //         //}
  //         return throwError(error);
  //       }
  //     }));
  // }

  // cerrarSession() {
  //   this.sett.apikey = undefined;
  //   this.sett.entidad = {};
  //   this.sett.roles = [];
  //   this.sett.rolSistema = false;
  //   this.router.navigate(['login']);
  // }
}