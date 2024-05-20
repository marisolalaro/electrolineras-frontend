import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
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
}
