import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
// models

@Injectable()

export class ChargingHistoryService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.chargingHistory;
  }

  getAllHistoryByIdclient(idClient: number) {
    return this.http.get(this.apiService + EndPoins.findByClientUser + '/' + idClient);
  }

}
