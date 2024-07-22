import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { environment } from 'src/app/core/environments/environment.development';
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


  // servicio de prueba
  // TODO  probar si en verdad se sale de la app
  // token 
  // que esxpira 12 de Julio a las 12:39
  // eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbi5zeXMiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiZXhwIjoxNzIwODAyMzQyLCJ1c2VyIjp7ImlkIjoxLCJ1c2VyTmFtZSI6ImFkbWluLnN5cyIsImVsZWN0cm9uaWNNYWlsIjoiZGFuaWVsLm9yaWFzQGV0LmJvIiwibmFtZXMiOiJhZG1pbiIsImxhc3ROYW1lIjoic3lzIiwicm9sZXMiOlt7ImlkIjoxLCJuYW1lUm9sZSI6IlJPTEVfQURNSU5fU1lTIn1dfSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTl9TWVMiXSwianRpIjoiYUNlejdzY2pPUTN6dFRWZE9FQmN1RjhiajhnIiwiY2xpZW50X2lkIjoiZXBhZ29zIn0.nuqqsErWdPdzUnVKhnMeOlbrk_AW5Qr5V_Nmm1zeJS4E2kfX72IUgneKI0sBp2j02bl-wLm9PxG2MPPG4Lh01FL4SmB2bKJdigH_00-BwZ4BfVqR2RZzXljyZKV69xqiqKxVEQrudux28psWWliRj5myDSB7Fxq7TVAZZH8AHUCjhFTGO3MObqlfOHdA37ub9Ngd3ozqde5RBHvlIM4F3rcUrBQZ46NWmd2q32MhpUhltqXrZLq9FcBSPQvJWUuKJDQ0Ttfn3qfIHv0P41Wj4BVYDjYf9COsFF1uN29UIwRdN3SLqcxOXTUxTGnOQBMp-Pewq17qgJVgaZ8lNRWSnw

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
