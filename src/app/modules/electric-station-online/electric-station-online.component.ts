import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
// librerias
import { Subscription } from 'rxjs';
// cores
import { EndPoins } from 'src/app/core/constants/endPoints';
// modules
import { ElectricStationOnlineModule } from './electric-station-online.module';
// models
import { MeterValueModel } from 'src/app/core/model/meter-value-model';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';
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
    NgFor,
    NgClass
  ],
  providers: [
    ConfirmationService
  ],
})

export default class ElectricStationOnlineComponent implements OnInit, OnDestroy {

  // variables de control
  public previousState: boolean;
  public loading: boolean = true;
  public componenteVisible: boolean = false;

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
  public conector1: MeterValueModel[] = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
  public conector2: MeterValueModel[] = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];

  constructor(
    private route: ActivatedRoute,
    public base64ImageService: Base64ToImageService,
    private confirmationService: ConfirmationService,
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
        } else {
          return false
        }
      })
      .then((datosInicializados) => {
        if (datosInicializados) {
          return this.getMeterValues();
        } else {
          return false;
        }
      })
      .then((serviciosCargados) => {
        if (serviciosCargados) {
          this.loading = false;
          this.componenteVisible = true;
        } else {
          this.loading = false;
          this.componenteVisible = false;
        }
      })
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
            if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 1) {
              this.conector1 = JSON.parse(JSON.stringify(message.sampleValues));
              this.conector1.push(this.obtieneVelocidadCarga(this.conector1[0].value));
              this.conector1.push(this.obtienePotenciaActual(this.conector1[1].value));
            }
            if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 2) {
              this.conector2 = JSON.parse(JSON.stringify(message.sampleValues));
              this.conector2.push(this.obtieneVelocidadCarga(this.conector2[0].value));
              this.conector2.push(this.obtienePotenciaActual(this.conector2[1].value));
            }
          });
          // devolvemos true, poque puede no llegar servicio del websocket, o este en estado disponible y no necesita valores de meter
          resolve(true); 
    })
  }

  getOneElectricStation() {
    return new Promise((resolve) => {
      this.electricStationsService.getOne(this.id).subscribe((resp: any) => {
        if (resp) {
          this.electricStation = resp.data;
          this.getAllConnectorStatus()
          this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  obtieneVelocidadCarga(currentOffered: number) {
    let potencia = 230 * currentOffered;


    let carga: number = potencia / 1000;
    if (carga >= 0 && carga <= 2.3) {
      return {
        measurand: 'Carga Ultra Lenta',
        value: 0,
        unit: 'Kw',
        phases: '#808080'
      }
    }
    if (carga >= 3.7 && carga <= 7.4) {
      return {
        measurand: 'Carga Lenta',
        value: 0,
        unit: 'Kw',
        phases: '#32CD32'
      }
    }
    if (carga > 7.4 && carga <= 22) {
      return {
        measurand: 'Carga Semi Rápida',
        value: 0,
        unit: 'Kw',
        phases: '#00FF00'
      }
    }
    if (carga > 22 && carga <= 50) {
      return {
        measurand: 'Carga Rápida',
        value: 0,
        unit: 'Kw',
        phases: '#FF8C00'
      }
    }
    if (carga > 50 && carga <= 350) {
      return {
        measurand: 'Carga Ultra Rápida',
        value: 0,
        unit: 'Kw',
        phases: '#B22222'
      }
    }
    return {
      measurand: 'Carga no definida',
      value: 0,
      unit: 'Kw',
      phases: null
    }
  }

  obtienePotenciaActual(currentImport: number) {
    let potencia = 230 * currentImport;
    let carga: number = potencia / 1000;
    return {
      measurand: 'Potencia Actual',
      value: carga,
      unit: 'Kw',
      phases: null
    }
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

  confirmSwitchChange(event: any, item) {
    var texto = item.visibility ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.visibility;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `¿${texto} la visibilidad para los usuarios clientes ?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        item.visibility = !this.previousState;
        if (!item.visibility) {
          this.electricStationsService.updateVisibiliry(item.nameStation, true).subscribe(
            (resp: any) => {
              this.getOneElectricStation();
            }
          )
        } else {
          this.electricStationsService.updateVisibiliry(item.nameStation, false).subscribe(
            (resp: any) => {
              this.getOneElectricStation();
            }
          )
        }
      },
      reject: () => {
        item.visibility = !this.previousState;
      }
    });
  }

}
