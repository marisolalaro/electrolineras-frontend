import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { BodyFilterModel } from 'src/app/core/model/body-filter';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.transaction;
   }

  getAllFilter(bodyFilter: BodyFilterModel) {
    return this.http.post(this.apiService + EndPoins.transactionCharges, bodyFilter);
  }
}
