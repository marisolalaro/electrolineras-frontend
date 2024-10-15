import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
// modelo

@Injectable({
  providedIn: 'root'
})
export class ClientElectricStationsService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.clientElectricStations + EndPoins.findByChargingStation;
  }

  getClientCharging(idCharginStation) {
    return this.http.get(this.apiService + '/' + idCharginStation);
  }

}
