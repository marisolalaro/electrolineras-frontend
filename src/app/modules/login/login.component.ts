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