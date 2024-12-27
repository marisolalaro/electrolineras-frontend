import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
// models
import { BodyFilterModel } from 'src/app/core/model/body-filter';

@Injectable()

export class ProcessService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.processelectrolinera;
  }

  getInquiryElectrolinera(idCliente) {
    var cuerpo = {
      "idCliente": idCliente
    }
    return this.http.post(this.apiService + EndPoins.inquiryElectrolinera, cuerpo);
  }
}
