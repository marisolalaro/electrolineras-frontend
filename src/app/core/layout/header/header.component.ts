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
import { ValidaToken } from '../../utils/verificarToken';

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
  
  // NUEVA VARIABLE: Controla si se ve el botón de las 3 rayitas
  public mostrarBotonSidebar: boolean = false; 

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
    if (ValidaToken()) {
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
        });
    }
  }

  // NUEVA FUNCIÓN: Traduce los roles del backend a texto para el frontend
  obtenerNombreRol(nombreRolBackend: string): string {
    switch (nombreRolBackend) {
      case 'ROLE_ADMIN_SYS':
        return 'Rol: Administrador';
      case 'ROLE_CLIENT':
        return 'Rol: Cliente';
      default:
        return 'Rol: ' + nombreRolBackend; // Por si agregas más roles en el futuro
    }
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.user = this.global.getUser();
      const rolUsuario = this.user.roles[0].nameRole;

      // NUEVO: Si el usuario NO es cliente, mostramos el botón del menú
      this.mostrarBotonSidebar = (rolUsuario !== 'ROLE_CLIENT');

      // 1. Opciones comunes que ven TODOS (Admin y Clientes)
      let menuBase: MenuItem[] = [
        {
          label: this.obtenerNombreRol(rolUsuario), // Llama a la función traductora
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

      // 2. Opciones EXCLUSIVAS que solo se agregan si es Administrador
      if (rolUsuario === 'ROLE_ADMIN_SYS') {
        let menuAdmin: MenuItem[] = [
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
          }
        ];
        
        // Unimos el menú de admin con el menú base
        this.items = [...menuAdmin, ...menuBase];
      } else {
        // Si es cliente u otro rol, solo ve el menú base
        this.items = menuBase;
      }

      resolve(true);
    })
  }

  verificaIcono() {
    return new Promise((resolve) => {
    if (localStorage.getItem('theme')) {
      if(localStorage.getItem('theme') == 'dark') {
        this.iconoActual = 'pi pi-fw pi-sun'
        this.themeService.enableDarkTheme();
      } else {
        this.iconoActual = 'pi pi-fw pi-moon'
        this.themeService.disableDarkTheme();
      }
    } else {
      this.iconoActual = 'pi pi-fw pi-moon';
      localStorage.setItem('theme', 'light');
    }
    resolve(true);
    })
  }

  cambiarModo() {
    if (this.themeService.isDarkThemeEnabled()) {
      this.themeService.disableDarkTheme();
      this.iconoActual = 'pi pi-fw pi-moon';
    } else{
      this.themeService.enableDarkTheme();
      this.iconoActual = 'pi pi-fw pi-sun';
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