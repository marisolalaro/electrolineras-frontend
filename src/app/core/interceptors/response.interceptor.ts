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
import { MessageService } from 'primeng/api';
// import { ToastrService } from 'ngx-toastr';
// import { SettingsService } from '../auth/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private messageService: MessageService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No se encontró la página que estás buscando' });
        } else {
          //Credenciales incorrectas
          // if ("invalid_grant" == (error.error).error) {
          //   this.toastr.error('El correo y/o la contraseña son incorrectas', '', { timeOut: 3000 });
          // } else {
          // sessionStorage.setItem("mensaje_asfi_pendiente", JSON.stringify(error.error));
          //}
          return throwError(error);
        }
      }));
  }

  // cerrarSession() {
  //   this.sett.apikey = undefined;
  //   this.sett.entidad = {};
  //   this.sett.roles = [];
  //   this.sett.rolSistema = false;
  //   this.router.navigate(['login']);
  // }
}