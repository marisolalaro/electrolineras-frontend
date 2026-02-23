import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
// core
import { rutas } from 'src/app/core/constants/rutas';
import { color } from 'src/app/core/constants/colors';
import { Global } from 'src/app/core/variables/globales';
import { messages } from 'src/app/core/constants/messages';
// modulos
import { LoginModule } from './login.module';
// servicios
import { LoginService } from './services/login.service';
import { ColorServiceService } from '../../core/services/color-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    LoginModule
  ],
  providers: [
    MessageService
  ]
})

export default class LoginComponent {

  // variables de control
  public loading: boolean = false;
  public showPassword: boolean = false;

  // variables de validación
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  // variables propias del componente
  private dataLogin: any;
  public iconClass: string = 'pi pi-eye-slash';
  // public iniciaSinToken = localStorage.removeItem('token');


  constructor(
    private router: Router,
    private global: Global,
    private fb: FormBuilder,
    public loginService: LoginService,
    private messageService: MessageService,
    private colorService: ColorServiceService
  ) { }

  ngOnInit() {
    this.changePrimaryColor(color.sistema);
    localStorage.setItem('theme', 'light');
    localStorage.removeItem('token');
  }

  onIniciaSesion(): void {
    this.validaCampos()
      .then(camposValidados => {
        if (camposValidados) {
          return this.login();
        } else {
          return false;
        }
      }).then(logueado => {
        if (logueado) {
          return this.saveLoginStorage();

        } else {
          return false;
        }
      }).then(savedStorage => {
        if (savedStorage) {
          return this.addVariablesGlobales();
        } else {
          return false;
        }
      }).then(savedVariables => {
        if (savedVariables) {
          
          return this.redireccionaRuta();
        } else {
          return false;
        }
      });
  }

  changePrimaryColor(newColor: string) {
    this.colorService.updateColors(newColor);
  }

  validaCampos() {
    return new Promise((resolve) => {
      if (this.loginForm.valid) {
        resolve(true);
      } else {
        this.loading = false;
        this.messageService.add({ severity: 'info', summary: messages.obligatorios, detail: messages.camposRequeridos });
        resolve(false);
      }
    })
  }

  login() {
    
    this.loading = true;
    return new Promise((resolve) => {
      let form = this.loginForm.value
      this.loginService.iniciaSesion(form.username, form.password)
        .toPromise()
        .then((data) => {
          this.dataLogin = JSON.parse(JSON.stringify(data));
          this.loading = false;
          resolve(true);
        })
        .catch((err) => {
          this.messageService.add({ severity: 'error', summary: messages.error, detail: messages.datosIncorrectos });
          this.loading = false;
          resolve(false);
        });
    });
  }

/*login() {
    this.loading = true;
    return new Promise((resolve) => {
      
      // SIMULACIÓN: Datos de ejemplo para pruebas
      setTimeout(() => {
        const mockData = {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbi5zeXMiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiZXhwIjoxNzcxODI0MTAzLCJ1c2VyIjp7ImlkIjoxLCJ1c2VyTmFtZSI6ImFkbWluLnN5cyIsImVsZWN0cm9uaWNNYWlsIjoiYWRtaW4uc3lzQGVuZGVzeWMuYm8iLCJuYW1lcyI6bnVsbCwibGFzdE5hbWUiOm51bGwsInJvbGVzIjpbeyJpZCI6MSwibmFtZVJvbGUiOiJST0xFX0FETUlOX1NZUyJ9XX0sImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU5fU1lTIl0sImp0aSI6Il9IQzVjcDZnTnl6dGR6LURWM3lMVkJncjA3TSIsImNsaWVudF9pZCI6ImVwYWdvcyJ9.HEI8fQySaJgiev-tfieA2z60LqX3oPow_FH2rssM5DkqJ510cWPGQlzEGoUshrY8T_3CwnI9ThSrbZPPRzb8c2b2usBcOMduQLoLJwVeiCstExIGMesp0NtOCXUiXhGxGuC1w7NU83U742czEyOvPRTUXyjVsKXI92N117_mg9xWr5s-wWX93y9Q5EVBnPwnX9KbE5PWSlMQ_G5Bix5w5m2nWK4GETgZ1u5b-_8T5QV_qJHFY-58WOy0lr8ndxEuTBxKfa0IYp0pgAA3XhDLRtH0FZcTqMxAkykIzWkTd-v1jzFMRalE2Fj7l0-28sFA-KgZ_a4GD_RKcB3IGA-zRw",
    "token_type": "bearer",
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbi5zeXMiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiYXRpIjoiX0hDNWNwNmdOeXp0ZHotRFYzeUxWQmdyMDdNIiwiZXhwIjoxNzcxNzM0MTAzLCJ1c2VyIjp7ImlkIjoxLCJ1c2VyTmFtZSI6ImFkbWluLnN5cyIsImVsZWN0cm9uaWNNYWlsIjoiYWRtaW4uc3lzQGVuZGVzeWMuYm8iLCJuYW1lcyI6bnVsbCwibGFzdE5hbWUiOm51bGwsInJvbGVzIjpbeyJpZCI6MSwibmFtZVJvbGUiOiJST0xFX0FETUlOX1NZUyJ9XX0sImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU5fU1lTIl0sImp0aSI6InNwZDZIRzltNlN3ZFFZRkNfaVZIa2xZVWdOQSIsImNsaWVudF9pZCI6ImVwYWdvcyJ9.N5urL8a3CPOiRo2vB9rSNPWd_78S1SSlIsOjTecF6OKGIBBS-eZWIakMTvtF92Yus26x6ZnpaCNF330KchfOCRLpWGONhBHp-C8xBTOvDOVTgrtlYoJd4CaD0vgTkHClkrHn9YuNPQy2_TthQOi4po_P2k5ngPpvuvpYWPwTBFwAh7wHyK-R6slzbVYqY4RmN2tLJMyr7AEtIaJIn9xiNaoeeSLvJrk-iqUliRx2YG8wOIMEkTU1zkz7MW8RdnzgP-GtFmSazUl-TOKPHRUY9io24RWOxVHftnyZ7CrbtEDn-NPDzMdEHWvGkHTnXWRccBmAM6wbmw8YxIh6TK0Ttg",
    "expires_in": 99999,
    "scope": "read write",
    "user": {
        "id": 1,
        "userName": "admin.sys",
        "electronicMail": "admin.sys@endesyc.bo",
        "names": null,
        "lastName": null,
        "roles": [
            {
                "id": 1,
                "nameRole": "ROLE_ADMIN_SYS"
            }
        ]
    },
    "jti": "_HC5cp6gNyztdz-DV3yLVBgr07M"
};
        
        this.dataLogin = mockData;
        this.loading = false;
        resolve(true);
      }, 1500); // Simula tiempo de respuesta
      
    });
  }*/

  saveLoginStorage() {
    return new Promise((resolve) => {
      localStorage.setItem('token', this.dataLogin.access_token);
      resolve(true);
    });
  }

  addVariablesGlobales() {
    return new Promise((resolve) => {
      this.global.setDataLogin(this.dataLogin);
      this.global.setDecode();
      this.global.setExpireTime();
      this.global.setToken(this.dataLogin.access_token);
      this.global.setUser();
      resolve(true);
    });
  }

  redireccionaRuta() {
    return new Promise((resolve) => {
      this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaClientes]);
      resolve(true);
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.iconClass = this.iconClass === 'pi pi-eye-slash' ? 'pi pi-eye' : 'pi pi-eye-slash';
  }

}