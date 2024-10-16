import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { Router, RouterModule } from '@angular/router';
// core
import { rutas } from '../../constants/rutas';
import { Global } from '../../variables/globales';
import { mainTitles } from '../../constants/labels';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, PrimeModule],
  standalone: true,
})

export class HeaderComponent implements OnInit {

  // variables de control
  public componenteVisible: boolean = false;

  // variables propias del componente
  public user: any;
  public items: MenuItem[] | undefined;

  // Nueva variable para controlar el icono
  public iconoActual: string = 'pi pi-fw pi-sun';

  // variables de salida
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private router: Router,
    private global: Global,
    public themeService: ThemeService
  ) { }

  ngOnInit() {

    this.verificaIcono()
      .then((datosInicializados) => {
        if (datosInicializados) {
          return this.inicializaDatos();
        } else {
          return false
        }
      })
      .then((datosInicializados) => {
        if (datosInicializados) {
          this.componenteVisible = true;
        }
      })
      ;
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.user = this.global.getUser();
      this.items = [
        {
          label: mainTitles['administradores'].mainTitle,
          icon: 'pi pi-fw pi-user',
          routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaAdministradores],
        },
        {
          label: mainTitles['clientes'].mainTitle,
          icon: 'pi pi-fw pi-users',
          routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaClientes],
        },
        {
          separator: true
        },
        {
          label: this.user.roles[0].nameRole == 'ROLE_ADMIN_SYS' ? 'Rol: Administrador' : 'Rol: General',
          icon: 'pi pi-id-card',
          disabled: true,

        },
        {
          label: this.user.electronicMail,
          icon: 'pi pi-user',
          disabled: true,
        },
        {
          icon: this.iconoActual,
          command: () => this.cambiarModo()
        }
      ];
      resolve(true);
    })
  }

  verificaIcono() {
    return new Promise((resolve) => {
    if (localStorage.getItem('theme')) {
      if(localStorage.getItem('theme') == 'dark') {
        this.iconoActual = 'pi pi-fw pi-sun'
      } else {
        this.iconoActual = 'pi pi-fw pi-moon'
      }
    } else {
      this.iconoActual = 'pi pi-fw pi-moon';
      localStorage.setItem('theme', 'light');
    }
    resolve(true);
    })
  }

  cambiarModo() {
    if (localStorage.getItem('theme') == 'light') {
      this.themeService.enableDarkTheme();
      this.iconoActual = 'pi pi-fw pi-sun';
    } else {
      this.themeService.disableDarkTheme();
      this.iconoActual = 'pi pi-fw pi-moon';
    }
    this.inicializaDatos()
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  salir() {
    var c = confirm("¿Salir del sitio web?");
    if (c == true) {
      localStorage.removeItem('token');
      localStorage.removeItem('theme');
      this.router.navigate(['']);
    }
  }

}

