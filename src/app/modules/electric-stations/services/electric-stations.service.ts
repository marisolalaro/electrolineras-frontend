import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
// modelo
import { ElectricStationModel } from 'src/app/core/model/electric-station';

@Injectable({
  providedIn: 'root'
})
export class ElectricStationsService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.electricStations;
  }

  getAll() {
    return this.http.get(this.apiService);
  }

  create(electricStation: ElectricStationModel) {
    return this.http.post(this.apiService,electricStation);
  }

  update(electricStation: ElectricStationModel) {
    return this.http.put(this.apiService,electricStation)
  }

  getForDashboard() {
    return this.http.get(this.apiService + EndPoins.cardElectricStations);
  }

  getOne(id: number) {
    return this.http.get(this.apiService + EndPoins.cardElectricStationsId + '/' + id);
  }

  enabledCustomer(idStation: number) {
    return this.http.get(this.apiService + EndPoins.enabledStation + '/' + idStation);
  }

  disabledCustomer(idStation: number) {
    return this.http.get(this.apiService + EndPoins.disableStation + '/' + idStation);
  }
}
