import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
// import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    // private messageService: MessageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        // Handle the error here
        if (error.status == 404) {
          // this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No se encontró la página que estás buscando' });
          // console.log('error de interceptor');
          
        }

        console.error('error occurred:', error);
        //throw error as per requirement
        return throwError(error);
      })
    );
  }
}
