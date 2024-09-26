// example.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { Model } from 'src/app/core/model/model';

@Injectable({
  providedIn: 'root',
})
export class ConnectorStatusService {

  private apiService: string;

  constructor(private http: HttpClient) { 
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.connectorStatus;
  }

  getAllConnectorByIdElectricStation(idElectricStation) {
    return this.http.get(this.apiService + EndPoins.byIdChargingStation + "/" + idElectricStation);
  }

}