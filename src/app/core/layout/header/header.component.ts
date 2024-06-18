import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';
import { rutas } from '../../constants/rutas';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, PrimeModule],
  standalone: true,
})
export class HeaderComponent implements OnInit {

  // variables del menu Lateral
  public sidebarVisible: boolean = false;
  public itemsLateral: MenuItem[] | undefined;

  // variables del menu horizontal
  public items: MenuItem[] | undefined;
  public activeItem: MenuItem | undefined;
  public activeItemLateral: MenuItem | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
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
    this.itemsLateral = [
      {
        label: mainTitles['electrolineras'].mainTitle,
        icon: 'pi pi-fw pi-bolt',
        routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolineras],
      },
      {
        label: mainTitles['transacciones'].mainTitle,
        icon: 'pi pi-fw pi-money-bill',
        routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaTransacciones],
      },
      {
        label: mainTitles['facturas'].mainTitle,
        icon: 'pi pi-fw pi-file',
        routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaFacturaTransferencias],
      },
      {
        label: mainTitles['facturasCargaEnergia'].mainTitle,
        icon: 'pi pi-fw pi-list',
        routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaFacturasCargasEnergia],
      },
    ]
    this.activeItem = this.items[0];
    this.activeItemLateral = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  activeMenu(event) {
    this.activeItemLateral = event;
  }

  salir() {
    var c = confirm("¿Salir del sitio web?");
    if (c == true) {
      localStorage.removeItem('token');
      this.router.navigate(['']);
    }
  }
}

