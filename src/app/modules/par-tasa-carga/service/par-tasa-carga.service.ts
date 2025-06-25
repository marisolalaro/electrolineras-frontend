import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';

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

  cambiarEstado(id, estado) {
    if (estado) {
      return this.http.put(this.apiService + EndPoins.disable + '/' + id, {});
    } else {
      return this.http.put(this.apiService + EndPoins.enable + '/' + id, {});
    }
  }

  create(tasaCarga) {
    return this.http.post(this.apiService, tasaCarga);
  }
  
  update(tasaCarga) {
    return this.http.post(this.apiService, tasaCarga);
  }

  getCurrentRate() {
    return this.http.get(this.apiService + '/currentRate' );
  }

  getCurrentDate() {
    return this.http.get(this.apiService + '/currentDate' );
  }
}
