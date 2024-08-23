import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
// librerias
import { switchMap } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
// cores
import { DashboardModule } from './dashboard.module';
import { rutas } from 'src/app/core/constants/rutas';
import { mainTitles } from 'src/app/core/constants/labels';
// models
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    DashboardModule,
    NgStyle,
    NgFor,
    NgIf
  ],
})

export default class DashboardComponent implements OnInit, OnDestroy {

  // variables globales
  public titleComponent: any = mainTitles['dashboard'];

  // variables propias del componente
  public data: any;
  private subscription: Subscription;
  public electricStations: ElectricStationModel[] = [];

  constructor(
    private router: Router,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.getFourElectricStations();
  }

  getFourElectricStations(): void {
    this.electricStationsService.getForDashboard().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
      }
    )
    // Llama al servicio cada 5 segundos
    this.subscription = interval(2000) // Intervalo de 2 segundos
      .pipe(
        switchMap(() => this.electricStationsService.getForDashboard()) // Llama al servicio cada 2 segundos
      )
      .subscribe(
        (response: any) => {
          this.electricStations = response.data;
        },
        error => {
          console.error('Error al obtener datos:', error);
        }
      );
  }

  onVerTodasElectrolineras(id) {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline, id]);
  }

}
