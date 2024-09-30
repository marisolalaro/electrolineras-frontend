import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// librerias
import { Subscription } from 'rxjs';
// cores
import { EndPoins } from 'src/app/core/constants/endPoints';
// modules
import { ElectricStationOnlineModule } from './electric-station-online.module';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';
// models
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
import { Base64ToImageService } from '../../core/services/base-64-to-image.service';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';
import { WebsocketMedidorService } from 'src/app/core/services/websocket-medidor.service';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';

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
  private websocketUrl = EndPoins.apiUrl + EndPoins.websocket;

  // websocket
  public messages: string[] = [];
  private meterValuesSubscription: Subscription;
  private respMeter: any[] = [];
  public meterConector1: number = 0;
  public meterConector2: number = 0;

  constructor(
    private route: ActivatedRoute,
    public base64ImageService: Base64ToImageService,
    private websocketService: WebsocketMedidorService,
    private connectorStatusService: ConnectorStatusService,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.meterValuesSubscription) {
      this.meterValuesSubscription.unsubscribe();
    }
    this.websocketService.disconnect();
  }

  ngOnInit(): void {
    this.inicializaDatos()
      .then((conexionSocket) => {
        if (conexionSocket) {
          return this.getOneElectricStation()
        } else { return false }
      })
      .then((datosInicializados) => {
        if (datosInicializados) {
          return this.getMeterValues();
        } else {
          return false;
        }
      });
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.id = +this.route.snapshot.paramMap.get('id');
      resolve(true);
    })
  }

  getMeterValues() {
    return new Promise((resolve) => {
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);
      this.meterValuesSubscription = this.websocketService.getMeterValues()
        .subscribe(message => {
          this.messages.push(JSON.stringify(message, null, 2));
          if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 1) {
            this.meterConector1 = message.sampleValues.filter(item => item.measurand == "Energy.Active.Import.Register")[0].value;
          }
          if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 2) {
            this.meterConector2 = message.sampleValues.filter(item => item.measurand == "Energy.Active.Import.Register")[0].value;
          }
        });
      resolve(true);
    })
  }

  getOneElectricStation() {
    return new Promise((resolve) => {
      this.electricStationsService.getOne(this.id).subscribe((resp: any) => {
        this.electricStation = resp.data;
        this.getAllConnectorStatus()
        this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
        resolve(true);
      });
    });
  }

  getAllConnectorStatus() {
    this.connectorStatusService.getAllConnectorByIdElectricStation(this.electricStation.id).subscribe((resp: any) => {
      this.conectorStatus = resp.data;
      this.statusEnElectrolinera();
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

  verificaSesionIndex() {
    this.electricStation.sessionIndex
  }

}
