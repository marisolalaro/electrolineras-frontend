import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { Address } from 'src/app/core/model/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiService: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.address;
  }

  getAll() {
    return this.http.get(this.apiService);
  }

  create(address: Address) {
    return this.http.post(this.apiService, address);
  }

  update(address: Address) {
    return this.http.put(this.apiService, address);
  }

}
