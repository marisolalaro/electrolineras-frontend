import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
// models
import { Model } from 'src/app/core/model/model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.models;
  }

  getAll() {
    return this.http.get(this.apiService);
  }
}
