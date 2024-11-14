import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { PasswordModel } from 'src/app/core/model/password';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private apiService: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.accessCode;
  }

  getAll() {
    return this.http.get(this.apiService);
  }

  create(password: PasswordModel) {
    return this.http.post(this.apiService, password);
  }

  update(passwordId: PasswordModel) {
    return this.http.put(this.apiService + EndPoins.restoreById + '/' + passwordId, {} );
  }
  
  delete(passwordId: PasswordModel) {
    return this.http.delete(this.apiService + '/' + passwordId);
  }


}
