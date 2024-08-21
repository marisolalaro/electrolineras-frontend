import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { responseMessages } from '../constants/responseMessages';

@Injectable({
  providedIn: 'root',

})
export class ResponseInterceptor implements HttpInterceptor {

  constructor(
    private messageService: MessageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        // MANEJO DE ERRORES
        if (error.status == 400) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera404,
            detail: responseMessages.mensaje404
          });
        }
        if (error.status == 401) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera401,
            detail: responseMessages.mensaje401
          });
        }
        if (error.status == 403) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera403,
            detail: responseMessages.mensaje403
          });
        }
        if (error.status == 404) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera404,
            detail: responseMessages.mensaje404
          });
        }
        if (error.status == 409) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera409,
            detail: responseMessages.mensaje409
          });
        } 
        if (error.status == 410) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera410,
            detail: responseMessages.mensaje410
          });
        } 
        if (error.status == 500) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera500,
            detail: responseMessages.mensaje500
          });
        }
        if (error.status == 0) {
          this.messageService.add({
            severity: 'error',
            summary: responseMessages.cabecera0,
            detail: responseMessages.mensaje0
          });
        }
        if (
          error.status != 400 && 
          error.status != 401 && 
          error.status != 403 && 
          error.status != 404 && 
          error.status != 409 && 
          error.status != 410 && 
          error.status != 0 && 
          error.status != 500 
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'error desconocido',
            detail: 'ERROR NO MANEJADO'
          });
        }
        return throwError(error);
      })
    );
  }
}
