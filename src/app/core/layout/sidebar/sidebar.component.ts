import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';
import { rutas } from '../../constants/rutas';
import { Global } from 'src/app/core/variables/globales';
import { ValidaToken } from '../../utils/verificarToken';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  // variables d econtrol
  public esSuperAdmin: boolean = false;

  @Output() itemClick = new EventEmitter<void>();
  public items: MenuItem[];

  constructor(
    public global: Global
  ) { }

  onItemClick() {
    this.itemClick.emit();
  }

  // preguntar que rtol tiene
  ngOnInit() {
    if (ValidaToken()) {
      this.esSuperAdmin = this.global.getEsSuperAdmin();
      if (this.esSuperAdmin) {
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
          },
          {
            label: mainTitles['parametricas'].mainTitle,
            separator: true,
            disabled: true
          },
          {
            label: mainTitles['modelos'].mainTitle,
            icon: 'pi pi-fw pi-verified',
            routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaParametricas + '/' + rutas.rutaModelo],
          },
          {
            label: mainTitles['tasaCarga'].mainTitle,
            icon: 'pi pi-fw pi-verified',
            routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaParametricas + '/' + rutas.rutaTasaCarga],
          },
          {
            label: mainTitles['direcciones'].mainTitle,
            icon: 'pi pi-fw pi-map',
            routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaParametricas + '/' + rutas.rutaAddress],
          },
          {
            label: mainTitles['contrasenias'].mainTitle,
            icon: 'pi pi-fw pi-key',
            routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaParametricas + '/' + rutas.rutaPassword],
          },
    
        ];
      } 
      else {
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
          },

        ];
      }
    }
  }


}
