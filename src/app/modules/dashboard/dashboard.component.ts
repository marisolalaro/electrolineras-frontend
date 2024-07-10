import { Component } from '@angular/core';
import { DashboardModule } from './dashboard.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { NgFor, NgStyle } from '@angular/common';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { Router } from '@angular/router';
import { rutas } from 'src/app/core/constants/rutas';
import { SocketService } from '../electric-station-online/services/socket.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [DashboardModule, NgStyle, NgFor],
})
export default class DashboardComponent {

  // variables propias del componente
  public data: any;
  public electricStations: ElectricStationModel[] = [];

  // variables del paginador
  public page: number = 0;
  public itemsPerPage: number = 4;
  public totalRecords: number = 0;

  // variables globales
  public titleComponent: any = mainTitles['dashboard'];

  constructor(
    private router: Router,
    private electricStationsService: ElectricStationsService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.inicializaDatos();
    this.getFourElectricStations();
    this.getOnline();
  }

  inicializaDatos() {
    // this.data.value = '0.00';
  }
  getOnline() {
    this.socketService.listen('data').subscribe((data: any) => {
      this.data = data;
    });
  }

  getFourElectricStations(): void {
    this.electricStationsService.getAll().subscribe(
      (resp: any) => {
        this.electricStations = resp.data.slice(0, 4);
      }
    )
  }

  onVerTodasElectrolineras() {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline]);
  }

}
