import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
// librerias
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// cores
import { DashboardModule } from './dashboard.module';
import { rutas } from 'src/app/core/constants/rutas';
import { mainTitles } from 'src/app/core/constants/labels';
// models
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
import { WebsocketService } from 'src/app/core/services/websocket.service';
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

  public statusMessage: string = '';
  public bootNotificationMessage = {
    "chargePointVendor": "",
    "chargePointModel": "",
    "chargeBoxSerialNumber": "",
    "chargePointSerialNumber": "",
    "firmwareVersion": "",
    "iccid": "",
    "imsi": "",
    "meterSerialNumber": "",
    "meterType": ""
  };

  constructor(
    private router: Router,
    private electricStationsService: ElectricStationsService,
    private websocketService: WebsocketService,
  ) { }

  ngOnDestroy() {
    this.websocketService.closeAll();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.connectWs();
    this.getFourElectricStations();
  }

  connectWs() {
    this.websocketService.connect('ws://localhost:8051/ws/status', (data) => {
      this.statusMessage = data.replace(/['"]+/g, '');
    });

    this.websocketService.connect('ws://localhost:8051/ws/bootNotification', (data) => {
      this.bootNotificationMessage = JSON.parse(data);
    });
  }

  getFourElectricStations(): void {
    // llamar el servicio cada 2 segundos
    // this.electricStationsService.getForDashboard().subscribe(
    //   (resp: any) => {
    //     this.electricStations = resp.data;
    //   }
    // )
    // // Llama al servicio cada 5 segundos
    // this.subscription = interval(2000) // Intervalo de 2 segundos
    //   .pipe(
    //     switchMap(() => this.electricStationsService.getForDashboard()) // Llama al servicio cada 2 segundos
    //   )
    //   .subscribe(
    //     (response: any) => {
    //       this.electricStations = response.data;
    //     },
    //     error => {
    //       console.error('Error al obtener datos:', error);
    //     }
    //   );

    this.electricStationsService.getForDashboard().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
      }
    )
  }

  onVerTodasElectrolineras(id) {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline, id]);
  }

}
