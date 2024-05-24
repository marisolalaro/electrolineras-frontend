import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { TasaCargaModel } from 'src/app/core/model/tasa-carga';

@Injectable({
  providedIn: 'root'
})
export class ParTasaCargaService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.chargeRate;
  }

  getAll() {
    return this.http.get(this.apiService);
  }
}
