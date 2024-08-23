import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
// models
import { BodyFilterModel } from 'src/app/core/model/body-filter';

@Injectable()

export class CustomerService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.customer;
  }

  getAllFilter(bodyFilter: BodyFilterModel) {
    return this.http.post(this.apiService + EndPoins.charges, bodyFilter);
  }

  enabledCustomer(idCustomer: number) {
    return this.http.get(this.apiService + EndPoins.enabled + '/' + idCustomer);
  }

  disabledCustomer(idCustomer: number) {
    return this.http.get(this.apiService + EndPoins.disabled + '/' + idCustomer);
  }
}
