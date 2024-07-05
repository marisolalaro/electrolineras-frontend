import { Component } from '@angular/core';
import { DashboardModule } from './dashboard.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { NgFor, NgStyle } from '@angular/common';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { Router } from '@angular/router';
import { rutas } from 'src/app/core/constants/rutas';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [DashboardModule, NgStyle, NgFor],
})
export default class DashboardComponent {

  // variables propias del componente
  public electricStations: ElectricStationModel[] = [];

  // variables del paginador
  public page: number = 0;
  public itemsPerPage: number = 4;
  public totalRecords: number = 0;

  // variables globales
  public titleComponent: any = mainTitles['dashboard'];

  constructor(
    private router: Router,
    private electricStationsService: ElectricStationsService
  ) { }

  ngOnInit() {
    this.getFourElectricStations();
  }

  getFourElectricStations(): void {
    this.electricStationsService.getAll().subscribe(
      (resp: any) => {
        this.electricStations = resp.data.slice(0, 4);
      }
    )
  }

  onVerTodasElectrolineras() {
    // this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolineras + '/' + rutas.rutaOnlineElectricStation]);
    this.router.navigate([ '/' + rutas.rutaOnlineElectricStation]);
    // this.router.navigate(['/administration/customers']);
  }

}
