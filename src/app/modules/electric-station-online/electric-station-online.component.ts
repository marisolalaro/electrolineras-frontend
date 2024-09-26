import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// librerias
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// modules
import { ElectricStationOnlineModule } from './electric-station-online.module';
// models
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
// import { SocketService } from './services/socket.service';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { Base64ToImageService } from '../../core/services/base-64-to-image.service';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';

@Component({
  standalone: true,
  selector: 'app-electric-station-online',
  templateUrl: './electric-station-online.component.html',
  styleUrls: ['./electric-station-online.component.scss'],
  imports: [
    ElectricStationOnlineModule,
    NgStyle,
    NgFor
  ]
})

export default class ElectricStationOnlineComponent implements OnInit, OnDestroy {

  // variable para guardar respuesta del Socket
  public data: any;

  // variable para  la llamad al servicio
  private subscription: Subscription;

  // variables propias del componente
  public id: number;
  public imagenQR: string | null = null;
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public conectorStatus: ConnectorStatusModel[] = [];

  constructor(
    private route: ActivatedRoute,
    public base64ImageService: Base64ToImageService,
    private connectorStatusService: ConnectorStatusService,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.inicializaDatos()
    this.getOneElectricStation()
    // this.getOnline();
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.id = +this.route.snapshot.paramMap.get('id');
      resolve(true);
    })
  }

  getOneElectricStation() {
    // this.electricStationsService.getOne(this.id).subscribe(
    //   (resp: any) => {
    //     this.electricStation = resp.data;
    //     this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
    //   }
    // )
    // this.subscription = interval(3000)
    //   .pipe(
    //     switchMap(() => this.electricStationsService.getOne(this.id))
    //   )
    //   .subscribe(
    //     (response: any) => {
    //       this.electricStation = response.data;
    //     },
    //     error => {
    //       console.error('Error al obtener datos:', error);
    //     }
    //   );
    this.electricStationsService.getOne(this.id).subscribe((resp: any) => {
      this.electricStation = resp.data;
      this.getAllConnectorStatus()
      this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
    });
  }
  getAllConnectorStatus() {
    this.connectorStatusService.getAllConnectorByIdElectricStation(this.electricStation.id).subscribe((resp: any) => {
      this.conectorStatus = resp.data;
      this.statusEnElectrolinera()
      this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
    });
  }

  statusEnElectrolinera() {
    this.electricStation.chargingConnectors.forEach(connectorA => {
      let connectorNumber = connectorA.name.match(/\d+/)[0]; // Esto extrae el número del conector del nombre
      let correspondingConnectorB = this.conectorStatus.find(connectorB => connectorB.connector === connectorNumber);
      if (correspondingConnectorB) {
        connectorA.lastState = correspondingConnectorB.lastState;
      }
    });
  }

}
