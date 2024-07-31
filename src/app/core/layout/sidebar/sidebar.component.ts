import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';
import { rutas } from '../../constants/rutas';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  @Output() itemClick = new EventEmitter<void>();
  public items: MenuItem[];

  onItemClick() {
    this.itemClick.emit();
  }

  ngOnInit() {
    this.items = [
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
      },
      {
        label: mainTitles['reportes'].mainTitle,
        icon: 'pi pi-fw pi-file-excel',
        routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaReportes],
      }
    ];
  }


}

