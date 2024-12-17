// example.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EndPoins } from '../constants/endPoints';

@Injectable({
  providedIn: 'root',
})
export class ForzarDetencionService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrlOcpp + EndPoins.apisv + EndPoins.chargePoint;
  }

  onForzarDetencion(conector) {
    return this.http.post(this.apiService + EndPoins.stopTransactionOcppForce, conector);
  }

}