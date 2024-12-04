import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgStyle } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// librerias
import { Subscription } from 'rxjs';
// cores
import { EndPoins } from 'src/app/core/constants/endPoints';
import { messages } from 'src/app/core/constants/messages';
// modules
import { ElectricStationOnlineModule } from './electric-station-online.module';
// models
import { MeterValueModel } from 'src/app/core/model/meter-value-model';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';
import { ClientChargingStatusModel } from 'src/app/core/model/client-charging-station';
// services
import { Base64ToImageService } from '../../core/services/base-64-to-image.service';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';
import { WebsocketMedidorService } from 'src/app/core/services/websocket-medidor.service';
import { ClientElectricStationsService } from './services/client-electric-stations.service';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { MobileService } from './services/mobile.service';
import { Global } from 'src/app/core/variables/globales';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidatePasswordService } from './services/validate-password.service';
import { ChargingConnector } from 'src/app/core/model/charging-connector';

@Component({
  standalone: true,
  selector: 'app-electric-station-online',
  templateUrl: './electric-station-online.component.html',
  styleUrls: ['./electric-station-online.component.scss'],
  imports: [
    ElectricStationOnlineModule,
    NgStyle,
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
})

export default class ElectricStationOnlineComponent implements OnInit, OnDestroy {

  // variables que se reciben de la ruta
  public id: number;

  // variables de control
  public previousState: boolean;
  public loading: boolean = true;
  public detalle: boolean = true;
  public esSuperAdmin: boolean = false;
  public serviceResponse: boolean = true;
  public componenteVisible: boolean = false;
  public habilitaMasOpciones: boolean = false;
  public visibleDialogPassword: boolean = false;

  // variables propias del componente
  public items: MenuItem[];
  public conectores: any[] = [];
  public messages: string[] = [];
  public passwordAdminGral!: string;
  public imagenQR: string | null = null;
  public iconClass: string = 'pi pi-eye-slash';
  public mensaje: string = messages.noConexion;
  public conectorStatus: ConnectorStatusModel[] = [];
  private websocketUrl = EndPoins.apiUrl + EndPoins.websocket;
  public conector: ChargingConnector = new ChargingConnector();
  public clientChargingStation: ClientChargingStatusModel[] = [];
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public cliente1: ClientChargingStatusModel = new ClientChargingStatusModel();
  public cliente2: ClientChargingStatusModel = new ClientChargingStatusModel();
  public clienteAuxiliar: ClientChargingStatusModel = new ClientChargingStatusModel();
  public conector1: MeterValueModel[] = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
  public conector2: MeterValueModel[] = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];

  // subscripciones para la ejecucion de los estados cada n segundos
  private subscriptionMeterValues: Subscription;
  private subscriptionConectorStatus: Subscription;
  private subscriptionClientCharging: Subscription;
  private subscriptionReconnectionCheck: Subscription;

  constructor(
    private global: Global,
    private route: ActivatedRoute,
    private mobileService: MobileService,
    private messageService: MessageService,
    private base64ImageService: Base64ToImageService,
    private confirmationService: ConfirmationService,
    private websocketService: WebsocketMedidorService,
    private connectorStatusService: ConnectorStatusService,
    private validatePasswordService: ValidatePasswordService,
    private electricStationsService: ElectricStationsService,
    private clientElectricStationsService: ClientElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscriptionMeterValues) {
      this.subscriptionMeterValues.unsubscribe();
    }
    if (this.subscriptionConectorStatus) {
      this.subscriptionConectorStatus.unsubscribe();
    }
    if (this.subscriptionClientCharging) {
      this.subscriptionClientCharging.unsubscribe();
    }
    if (this.subscriptionReconnectionCheck) {
      this.subscriptionReconnectionCheck.unsubscribe();
    }
    this.websocketService.disconnect();
  }

  async ngOnInit() {
    this.websocketService.initializeWebSocketConnection(this.websocketUrl);

    this.subscriptionConectorStatus = this.websocketService.getConnectorStatus()
      .subscribe((data) => {
        if (data[0].connector = '1') {
          this.conectores[0].lastState = data[0].lastState;
          this.conectores[0].id = data[0].connector;
        }
        if (data[1].connector = '2') {
          this.conectores[1].lastState = data[1].lastState
          this.conectores[1].id = data[1].connector;
        }
      });
    // TODO debo revisar esta parte
    this.subscriptionClientCharging = this.websocketService.getClientCharging()
      .subscribe((data) => {
        this.clientChargingStation = data;
        this.clienteCargando();
        this.armaTablaConector();
      });

    this.subscriptionMeterValues = this.websocketService.getMeterValues()
      .subscribe((messages) => {

        // var message = JSON.parse(messages);
        var message = messages;
        // var message = messages;
        if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 1) {
          this.transaccionid1 = message.connectorId = 1 ? message.transactionId : 0
          this.conector1 = JSON.parse(JSON.stringify(message.sampleValues));
          this.conector1.push(this.obtieneVelocidadCarga(this.conector1[0].value));
          this.conector1.push(this.obtienePotenciaActual(this.conector1[1].value));
        }
        if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 2) {
          this.transaccionid2 = message.connectorId == 2 ? message.transactionId : 0
          this.conector2 = JSON.parse(JSON.stringify(message.sampleValues));
          this.conector2.push(this.obtieneVelocidadCarga(this.conector2[0].value));
          this.conector2.push(this.obtienePotenciaActual(this.conector2[1].value));
        }
        this.armaTablaConector();
      });

    try {
      await this.inicializaDatos();
      await this.getClienteCharging();
      await this.getAllConnectorStatus();
      await this.getOneElectricStation();
      await this.armaTablaConector();
      this.componenteVisible = true;
      this.loading = false;
    } catch (error) {
      console.error('Ocurrió un error en la inicialización:', error);
    }
  }

  transaccionid1 = 0;
  transaccionid2 = 0;

  inicializaDatos(): Promise<void> {
    return new Promise((resolve) => {
      this.id = +this.route.snapshot.paramMap.get('id');
      this.esSuperAdmin = this.global.getEsSuperAdmin();
      this.items = [
        {
          label: 'Detener Carga',
          command: () => {
            this.onDesvinculaUsuarioElectrolinera(this.conector);
          }
        },
        {
          label: 'Desvincular Usuario ',
          command: () => {
            this.onDetieneCargaElectrolinera(this.conector);
          }
        },
        { separator: true },
      ];
      resolve();
    })
  }

  getAllConnectorStatus() {
    this.connectorStatusService.getAllConnectorByIdElectricStation(this.id).subscribe(
      (data: any) => {
        this.conectorStatus = data.data;
        this.armaTablaConector();
      },
      error => {
        console.error('Error al obtener los datos de las estaciones', error);
      });
  }

  getClienteCharging() {
    this.clientElectricStationsService.getClientCharging(this.id).subscribe(
      (resp: any) => {
        this.clientChargingStation = resp.data;
        this.clienteCargando();
        this.armaTablaConector();
      },
      error => {
        console.error('Error al obtener los datos de las estaciones', error);
      }
    );
  }

  itemSeleccionado(item) {
    this.conector = JSON.parse(JSON.stringify(item))
  }

  getValoresMedidor() {
    return new Promise((resolve) => {
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);
      this.subscriptionMeterValues = this.websocketService.getMeterValues()
        .subscribe(messages => {

          var message = JSON.parse(messages);
          var message = messages;
          // var message = messages;
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
          this.armaTablaConector();
        }, err => {
        });
      resolve(true);
    })
  }

  verificarReconexión() {
    if (this.subscriptionReconnectionCheck) {
      return;
    }
    this.subscriptionReconnectionCheck = interval(10000).subscribe(() => {
      if (!this.websocketService.isConnected()) {
        // this.conectaWebSocket();
      }
    });
  }

  armaTablaConector(): Promise<void> {
    return new Promise((resolve) => {
      this.conectores = [{
        nombre: 'CONECTOR DE CARGA 1',
        maxVoltaje: '230',
        maxAmperaje: this.conector1.filter(item => item.measurand == 'Current.Offered')[0] ? this.conector1.filter(item => item.measurand == 'Current.Offered')[0].value : 0,
        velocidadCarga: this.conector1.filter(item => item.measurand.includes("Carga"))[0] ? this.conector1.filter(item => item.measurand.includes("Carga"))[0].measurand : '-',
        corrienteActual: this.conector1.filter(item => item.measurand == 'Current.Import')[0] ? this.conector1.filter(item => item.measurand == 'Current.Import')[0].value : 0,
        potenciaActual: this.conector1.filter(item => item.measurand == 'Potencia Actual')[0] ? this.conector1.filter(item => item.measurand == 'Potencia Actual')[0].value : 0,
        cargaEnergia: this.conector1.filter(item => item.measurand == 'Energy.Active.Import.Register')[0] ? this.conector1.filter(item => item.measurand == 'Energy.Active.Import.Register')[0].value : 0,
        clienteCarga: this.cliente1.userName || '-',
        montoConsumido: this.conector1.filter(item => item.measurand == 'Amount.Consumed')[0] ? this.conector1.filter(item => item.measurand == 'Amount.Consumed')[0].value : 0,
        lastState: this.conectorStatus.filter(item => item.connector == "1")[0] ? this.conectorStatus.filter(item => item.connector == "1")[0].lastState : 'Unavailable'
      }, {
        nombre: 'CONECTOR DE CARGA 2',
        maxVoltaje: '230',
        maxAmperaje: this.conector2.filter(item => item.measurand == 'Current.Offered')[0] ? this.conector2.filter(item => item.measurand == 'Current.Offered')[0].value : 0,
        velocidadCarga: this.conector2.filter(item => item.measurand.includes("Carga"))[0] ? this.conector2.filter(item => item.measurand.includes("Carga"))[0].measurand : '-',
        corrienteActual: this.conector2.filter(item => item.measurand == 'Current.Import')[0] ? this.conector2.filter(item => item.measurand == 'Current.Import')[0].value : 0,
        potenciaActual: this.conector2.filter(item => item.measurand == 'Potencia Actual')[0] ? this.conector2.filter(item => item.measurand == 'Potencia Actual')[0].value : 0,
        cargaEnergia: this.conector2.filter(item => item.measurand == 'Energy.Active.Import.Register')[0] ? this.conector2.filter(item => item.measurand == 'Energy.Active.Import.Register')[0].value : 0,
        clienteCarga: this.cliente2.userName || '-',
        montoConsumido: this.conector2.filter(item => item.measurand == 'Amount.Consumed')[0] ? this.conector2.filter(item => item.measurand == 'Amount.Consumed')[0].value : 0,
        lastState: this.conectorStatus.filter(item => item.connector == "2")[0] ? this.conectorStatus.filter(item => item.connector == "2")[0].lastState : 'Unavailable'
      }]
      resolve();
    })
  }

  getOneElectricStation(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.electricStationsService.getOne(this.id).subscribe((resp: any) => {
        if (resp) {
          this.electricStation = resp.data;
          this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
          resolve();
        } else {
          reject();
        }
        this.serviceResponse = true;
      }, err => {
        reject();
        this.loading = false
        this.serviceResponse = false;
      });
    });
  }


  // TODO
  clienteCargando() {
    return new Promise((resolve) => {
      if (this.clientChargingStation.length > 0) {
        var usuariosConector1 = this.clientChargingStation.filter(i => i.connetorOcpp == "1").length > 0 ? this.clientChargingStation.filter(i => i.connetorOcpp == "1") : [];
        var usuariosConector2 = this.clientChargingStation.filter(i => i.connetorOcpp == "2").length > 0 ? this.clientChargingStation.filter(i => i.connetorOcpp == "2") : [];
        this.cliente1 = usuariosConector1.length > 0 ? usuariosConector1[usuariosConector1.length - 1] : new ClientChargingStatusModel();
        this.cliente2 = usuariosConector2.length > 0 ? usuariosConector2[usuariosConector2.length - 1] : new ClientChargingStatusModel();
        resolve(true)
      } else {
        this.cliente1 = new ClientChargingStatusModel();
        this.cliente2 = new ClientChargingStatusModel();
        resolve(true)
      }
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
      phases: '#8e44ad'
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

  statusEnElectrolinera() {
    this.electricStation.chargingConnectors.forEach(connectorA => {
      let connectorNumber = connectorA.name.match(/\d+/)[0];
      let correspondingConnectorB = this.conectorStatus.find(connectorB => connectorB.connector === connectorNumber);
      if (correspondingConnectorB) {
        connectorA.lastState = correspondingConnectorB.lastState;
      }
      // if (connectorA.lastState == "Preparing" || connectorA.lastState == "Preparing") {
      //   this.conector1 = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
      //   this.conector2 = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
      // }
      if (connectorA.lastState != "Charging") {
        this.conectores = [];
        // this.conector1 = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
        // this.conector2 = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
      }
    });
  }

  // CASO2
  // Detener Carga
  onDesvinculaUsuarioElectrolinera(itemConector) {
    var datoselectrolinera = {
      "sessionIndex": this.electricStation.sessionIndex,
      // "transactionId": itemConector.id // aqui el ide puede ser solo 1 y 2
      "transactionId": itemConector.nombre == 'CONECTOR DE CARGA 1' ? 1 : 2// aqui el ide puede ser solo 1 y 2
    }
    var cliente: ClientChargingStatusModel = itemConector.nombre == 'CONECTOR DE CARGA 1' ? this.cliente1 : this.cliente2;
    this.clienteAuxiliar = cliente;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Detener la transacción del ' + itemConector.nombre + '?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.mobileService.liberarTransaccionUsuario(datoselectrolinera)
          .subscribe((resp: any) => {
            if (resp) {
              this.messageService.add({ severity: 'info', detail: resp.message });
            }
          }, err => {
            this.messageService.add({ severity: 'error', detail: messages.resp.message });
          });
      },
      reject: () => {
      }
    });
  }

  // CASO3
  onDetieneCargaElectrolinera(itemConector) {
    var cliente = this.clienteAuxiliar;
    var datoselectrolinera = {
      "sessionIndex": this.electricStation.sessionIndex,
      // "transactionId": itemConector.id
      "transactionId": itemConector.nombre == 'CONECTOR DE CARGA 1' ? 1 : 2
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Liberar ' + itemConector.nombre + ' y liberar usuario ' + cliente.userName + '?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.clientElectricStationsService.detenerCargaClient(cliente.idClientUser)
          .subscribe((resp: any) => {
            if (resp) {
              if (resp.message == "Recurso no encontrado") {
                this.messageService.add({ severity: 'error', detail: messages.sinUsuario });
              } else if (resp.message == "cliente en estacion de carga El registro fue actualizado") {
                this.messageService.add({ severity: 'success', detail: messages.detenerCarga });
              } else if (resp.message == "cliente en estacion de carga El registro fue actualizado Historial de carga  El registro fue actualizado") {
                this.messageService.add({ severity: 'success', detail: messages.detenerCarga });
              } else {
                this.messageService.add({ severity: 'error', detail: messages.noList });
              }
            }
          }, err => {
            this.messageService.add({ severity: 'error', detail: messages.resp.message });
          });
      },
      reject: () => {
      }
    });
  }

  // CASO1
  // Detener la carga del usuario
  // el itemConector.id no tiene solo tiene el nombre
  onDetieneCargaPorUsuario(event: Event, itemConector) {
    var cliente: ClientChargingStatusModel = itemConector.nombre == 'CONECTOR DE CARGA 1' ? this.cliente1 : this.cliente2;
    var transaccionid = itemConector.nombre == 'CONECTOR DE CARGA 1' ? this.transaccionid1 : this.transaccionid2;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Detener la carga del usuario ' + cliente.userName + '?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.mobileService.detieneTransacionCredit(this.electricStation.sessionIndex, transaccionid, cliente.idClientUser)
          .subscribe((resp: any) => {
            if (resp) {
              this.messageService.add({ severity: 'info', detail: resp.message });
            }
          }, err => {
            if (err.status == 200) {
              this.messageService.add({ severity: 'info', detail: 'se detuvo la carga de usuario correctamente' });
            }
          });

      },
      reject: () => {
      }
    });
  }

  dialogPassword() {
    this.visibleDialogPassword = true;
  }

  onValidaPassword() {
    return new Promise((resolve) => {
      this.validatePasswordService.validate(this.passwordAdminGral)
        .subscribe((resp: any) => {
          if (resp) {
            if (resp.message == 'Acceso concedido') {
              resolve(true);
            } else {
              this.messageService.add({ severity: 'info', detail: 'Acceso Denegado' });
              resolve(false);
            }
          } else {
            resolve(false);
          }
        }, err => {
          resolve(false);
        });
    });
  }

  verificaContrasenia() {
    return new Promise((resolve) => {
      if (this.passwordAdminGral.trim() != '') {
        resolve(true)
      } else {
        resolve(false)
      }
    });
  }

  confirmarCerrarOpciones(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deshabilitar mas Opciones?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.habilitaMasOpciones = false;
      },
      reject: () => {
      }
    });
  }

  // ADMIN GRAL
  validaformulariodialog() {
    this.verificaContrasenia()
      .then((verificado) => {
        if (verificado) {
          return this.onValidaPassword();
        } else {
          return false;
        }
      })
      .then((verificado) => {
        if (verificado) {
          this.habilitaMasOpciones = true;
          this.visibleDialogPassword = false;
        }
      })
  }

  // DETALLES
  confirmSwitchChange(event: any, item) {
    var texto = item.visibility ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.visibility;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `¿${texto} la visibilidad para los usuarios clientes ?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
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

  // DETALLES
  cambiaEstadoVer() {
    this.detalle = !this.detalle;
    this.iconClass = this.iconClass === 'pi pi-eye-slash' ? 'pi pi-eye' : 'pi pi-eye-slash';
  }

}
