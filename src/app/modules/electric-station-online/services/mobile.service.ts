import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
// modelo

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.mobile;
  }

  detenerCargaElectrolinera(electrolinera) {
    return this.http.get(this.apiService + EndPoins.chargingStations + EndPoins.stopTransaction + '?' +  'sessionIndex=' + electrolinera.sessionIndex + '&transactionId=' + electrolinera.transactionId);
  }
  
  liberarTransaccionUsuario(electrolinera) {
    return this.http.get(this.apiService + EndPoins.chargingStations + EndPoins.stopTransactionCliente + '?' +  'sessionIndex=' + electrolinera.sessionIndex + '&transactionId=' + electrolinera.transactionId);
  }
}
