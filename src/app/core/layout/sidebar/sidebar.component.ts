import { Component, OnInit} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';
import { rutas } from '../../constants/rutas';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  public items: MenuItem[];

  ngOnInit() {
    this.items = [{
      label: 'Menu',
      items: [
        {
          label: mainTitles['dashboard'].mainTitle,
          icon: 'pi pi-fw pi-home',
          routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaDashboard],
        },
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
        }
      ]
    }];
  }

}

