import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Global } from 'src/app/core/variables/globales';
// modulos
import { LoginModule } from './login.module';
// servicios
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [LoginModule],
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {

  // variables de control
  private isLoggedIn: boolean = false;
  public showPassword: boolean = false;

  // variables de validacion
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  // variables propias dle componente
  private dataLogin: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public loginService: LoginService,
    private global: Global) { }

  ngOnInit() {
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

  validaCampos() {
    return new Promise((resolve) => {
      if (this.loginForm.valid) {
        
        resolve(true);
      } else {
        // console.log('llene los campos user and pass');
        resolve(false);
      }
    })
  }

  login() {
    return new Promise((resolve) => {
      let form = this.loginForm.value
      this.loginService.iniciaSesion(form.username, form.password)
        .toPromise()
        .then((data) => {
          this.dataLogin = JSON.parse(JSON.stringify(data));
          resolve(true);
        })
        .catch((err) => {
          // console.log("Error del servidor");
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
      this.global.setExpireTime();
      this.global.setToken(this.dataLogin.access_token);
      resolve(true);
    });
  }

  redireccionaRuta() {
    return new Promise((resolve) => {
      this.router.navigate(['/administration/customers']);
      resolve(true);
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
