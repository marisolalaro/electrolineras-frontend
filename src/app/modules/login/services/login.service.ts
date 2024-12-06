import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { environment } from 'src/app/core/environments/environment.prod';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private customHttpClient: HttpClient;
  private restUrlAutenticacion: string = '';
  private OAUTH_USER = environment.VITE_OAUTH_USER;
  private OAUTH_PASSWORD = environment.VITE_OAUTH_PASSWORD;
  private CONFIG = {
    BASIC_AUTH: "Basic " + window.btoa(`${this.OAUTH_USER}:${this.OAUTH_PASSWORD}`),
    GRANT_TYPE: "password",
  };

  constructor(
      private http: HttpClient,
      backend: HttpBackend,
      private router: Router) 
    {
      this.customHttpClient = new HttpClient(backend);
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
    return this.customHttpClient.post(this.restUrlAutenticacion, bodyString, { headers: httpHeaders });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // Aquí agregar más lógica para verificar si el token es válido
    return token !== null;
  }
}
