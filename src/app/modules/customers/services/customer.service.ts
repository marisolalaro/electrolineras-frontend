import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from 'src/app/core/variables/globales';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { BodyFilterModel } from 'src/app/core/model/body-filter';

Global
@Injectable()

export class CustomerService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.customer;
  }

  getAllFilter(bodyFilter: BodyFilterModel) {
    return this.http.post(this.apiService + EndPoins.charges, bodyFilter);
  }
}
