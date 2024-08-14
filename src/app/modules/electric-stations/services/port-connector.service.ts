import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { PortConnectionModel } from 'src/app/core/model/port-connection';

@Injectable({
  providedIn: 'root'
})
export class PortConnectionService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.portConnector;
  }

  create(portConnector: PortConnectionModel) {
    return this.http.post(this.apiService + EndPoins.portCreate, portConnector);
  }

}
