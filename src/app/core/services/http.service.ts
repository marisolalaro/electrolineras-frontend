import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Subject, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService<T> {
  private objectFilterChange: Subject<T> = new Subject<T>();
  private objectSelectedChange: Subject<T> = new Subject<T>();
  
  constructor(
    protected http: HttpClient,
    @Inject('url') protected url: string
  ) {}

  findAll() {
    return this.http.get<T[]>(this.url).pipe(catchError(this.handleError));
  }

  findById(id: number) {
    return this.http.get<T>(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  create(t: T) {
    return this.http.post(this.url, t).pipe(catchError(this.handleError));
  }

  update(id: number, t: T) {
    return this.http.put(`${this.url}/${id}`, t).pipe(catchError(this.handleError));
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  getObjectFilterChange() {
    return this.objectFilterChange.asObservable();
  }

  setObjectFilterChange(data: T) {
    this.objectFilterChange.next(data);
  }

  getObjectSelectedChange() { 
    return this.objectSelectedChange.asObservable();
  }

  setObjectSelectedChange(data: T) {
    this.objectSelectedChange.next(data);
  }

  public handleError(error: HttpErrorResponse) {
    let errorMessage: string[] = [];
    if (error.status === 500) {
      if (error.error && error.error.message) {
        errorMessage.push(error.error.message);
      }
    }
    if (error.status === 409) {
      if (error.error && error.error.error) {
        errorMessage.push(error.error.error);
      }
    }
    if (error.status === 400) {
      if (error.error && error.error.message) {
        errorMessage.push(error.error.message);
      }
      else if (error.error && error.error.errors) {
        error.error.errors.forEach((errorMessages: any) => {
          errorMessage.push(errorMessages.message);
        });
      }
    }
    return throwError(errorMessage);
  }
}
