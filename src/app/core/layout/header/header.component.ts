import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';
import { rutas } from '../../constants/rutas';
import { Global } from '../../variables/globales';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, PrimeModule],
  standalone: true,
})
export class HeaderComponent implements OnInit {

  public items: MenuItem[] | undefined;
  public user: any;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private router: Router,
    private global: Global
  ) { }

  ngOnInit() {
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
    ];
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  salir() {
    var c = confirm("¿Salir del sitio web?");
    if (c == true) {
      localStorage.removeItem('token');
      this.router.navigate(['']);
    }
  }

}

