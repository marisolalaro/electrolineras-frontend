import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardModule } from './dashboard.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { Router } from '@angular/router';
import { rutas } from 'src/app/core/constants/rutas';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [DashboardModule, NgStyle, NgFor, NgIf],
})
export default class DashboardComponent implements OnInit, OnDestroy{

  // variables propias del componente
  public data: any;
  public electricStations: ElectricStationModel[] = [];

  // variables globales
  public titleComponent: any = mainTitles['dashboard'];

  private subscription: Subscription;

  constructor(
    private router: Router,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Limpia la suscripción cuando el componente se destruya
    }
  }

  ngOnInit() {
    this.inicializaDatos();
    this.getFourElectricStations();
  }

  inicializaDatos() {
    // this.data.value = '0.00';
  }

  getFourElectricStations(): void {
    this.electricStationsService.getForDashboard().subscribe(
        (resp: any) => {
          this.electricStations = resp.data;
        }
      )

    // Llama al servicio cada 5 segundos
    this.subscription = interval(2000) // Intervalo de 5 segundos
      .pipe(
        switchMap(() => this.electricStationsService.getForDashboard()) // Llama al servicio cada 5 segundos
      )
      .subscribe(
        (response:any) => {
          this.electricStations = response.data;
        },
        error => {
          console.error('Error al obtener datos:', error);
        }
      );

    // llama al servicio 1 ves al iniciar el componente
    // this.electricStationsService.getForDashboard().subscribe(
    //   (resp: any) => {
    //     this.electricStations = resp.data;
    //   }
    // )
  }

  onVerTodasElectrolineras(id) {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline, id]);
  }

}
