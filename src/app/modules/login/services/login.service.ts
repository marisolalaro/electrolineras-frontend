import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/core/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private restUrlAutenticacion: string = '';
  private OAUTH_USER = environment.VITE_OAUTH_USER;
  private OAUTH_PASSWORD = environment.VITE_OAUTH_PASSWORD;
  private CONFIG = {
    BASIC_AUTH: "Basic " + window.btoa(`${this.OAUTH_USER}:${this.OAUTH_PASSWORD}`),
    GRANT_TYPE: "password",
  };

  constructor(private http: HttpClient) {
    this.restUrlAutenticacion = environment.apiUrl + '/oauth/token';
  }

  private getHttpHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': this.CONFIG.BASIC_AUTH,
    });
  }

  iniciaSesion(usuario: string, password: string) {
    const httpHeaders = this.getHttpHeader();
    let bodyString = 'username=' + usuario + '&password=' + password + '&grant_type=password';
    return this.http.post(this.restUrlAutenticacion, bodyString, { headers: httpHeaders });
  }
}
