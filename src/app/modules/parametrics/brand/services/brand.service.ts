import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { Model } from 'src/app/core/model/model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.models;
  }

  getAll() {
    return this.http.get(this.apiService + EndPoins.listar + EndPoins.todos);
  }

  getAllActives() {
    return this.http.get(this.apiService);
  }

  updateActivo(id, estado) {
    return this.http.get(this.apiService + EndPoins.reactivar +'/' + id + '/' + estado);
  }

  create(modelo: Model) {
    return this.http.post(this.apiService, modelo);
  }

  update(modelo: Model) {
    return this.http.put(this.apiService, modelo);
  }


}
