import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';

@Injectable({
  providedIn: 'root'
})
export class ValidatePasswordService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.accessCode;
  }

  validate(password) {
    return this.http.get(this.apiService + EndPoins.validate + '/' + password);
  }
}
