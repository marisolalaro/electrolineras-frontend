import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { AdministratorModel } from 'src/app/core/model/administrators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorsService {

  private apiService: string;

  constructor(private http: HttpClient) { 
    this.apiService = EndPoins.apiUrl + EndPoins.api + EndPoins.customer + EndPoins.administration;
  }

  getAll(bodyFilter): Observable<AdministratorModel[]> {
    delete bodyFilter.search;
    return this.http.post<AdministratorModel[]>(this.apiService, bodyFilter);
  }

  create(adminitration: AdministratorModel) {
    return this.http.post(this.apiService,adminitration);
  }

  update(adminitration: AdministratorModel) {
    return this.http.put(this.apiService,adminitration)
  }
}
