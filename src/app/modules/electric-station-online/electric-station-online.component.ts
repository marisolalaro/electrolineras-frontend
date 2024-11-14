import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmEventType } from 'primeng/api';
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
    NgFor,
    NgClass
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
})

export default class ElectricStationOnlineComponent implements OnInit, OnDestroy {

  // variables de control
  public previousState: boolean;
  public loading: boolean = true;
  public detalle: boolean = true;
  public esSuperAdmin: boolean = false;
  public serviceResponse: boolean = true;
  public componenteVisible: boolean = false;

  // variable para guardar respuesta del Socket
  public data: any;

  // variable para  la llamad al servicio
  private subscription: Subscription;

  // variables propias del componente
  public id: number;
  public value!: string;
  public imagenQR: string | null = null;
  // usuariosConector1 = [];
  // usuariosConector2 = [];
  public conector: ChargingConnector = new ChargingConnector()
  public habilitaMasOpciones: boolean = false;
  public visibleDialogPassword: boolean = false;
  public mensaje: string = messages.noConexion;
  public conectorStatus: ConnectorStatusModel[] = [];
  private websocketUrl = EndPoins.apiUrl + EndPoins.websocket;
  public clientChargingStation: ClientChargingStatusModel[] = [];
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public cliente1: ClientChargingStatusModel = new ClientChargingStatusModel();
  public cliente2: ClientChargingStatusModel = new ClientChargingStatusModel();

  // para la ejeccion de los estados cada 5 segundos
  private subscriptionEstados: Subscription;
  private subscriptionClientCharging: Subscription;

  // websocket
  public messages: string[] = [];
  private meterValuesSubscription: Subscription;
  public conector1: MeterValueModel[] = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
  public conector2: MeterValueModel[] = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
  public iconClass: string = 'pi pi-eye-slash';
  items: MenuItem[];

  constructor(
    public global: Global,
    private route: ActivatedRoute,
    private mobileService: MobileService,
    private messageService: MessageService,
    public base64ImageService: Base64ToImageService,
    private confirmationService: ConfirmationService,
    private websocketService: WebsocketMedidorService,
    private connectorStatusService: ConnectorStatusService,
    private validatePasswordService: ValidatePasswordService,
    private electricStationsService: ElectricStationsService,
    private clientElectricStationsService: ClientElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.meterValuesSubscription) {
      this.meterValuesSubscription.unsubscribe();
    }
    if (this.subscriptionEstados) {
      this.subscriptionEstados.unsubscribe();
    }
    if (this.subscriptionClientCharging) {
      this.subscriptionClientCharging.unsubscribe();
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
      .then((meterValues) => {
        if (meterValues) {
          return this.getClienteCharging();
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
          this.componenteVisible = true;
        }
      })
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.id = +this.route.snapshot.paramMap.get('id');
      this.esSuperAdmin = this.global.getEsSuperAdmin();
      this.items = [
        {
            label: 'Desvincular Usuario',
            command: () => {
                this.onDesvinculaUsuarioElectrolinera(this.conector);
            }
        },
        {
            label: 'Detener Carga',
            command: () => {
                this.onDetieneCargaElectrolinera(this.conector);
            }
        },
        { separator: true },
    ];

      resolve(true);
    })
  }

  itemSeleccionado(item) {
    this.conector = JSON.parse(JSON.stringify(item))
  }
  getMeterValues() {
    // console.log(1);
    return new Promise((resolve) => {
      // console.log(2);
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);
      this.meterValuesSubscription = this.websocketService.getMeterValues()
        .subscribe(messages => {
          var message = JSON.parse(messages);
          // var message = messages;
          // console.log(JSON.stringify(message) );
          // console.log('ES sesion index ', this.electricStation.sessionIndex);
          // console.log('Meter value sesion index ', message.sessionIndex);
          this.conector1 = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
          this.conector2 = [new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel(), new MeterValueModel()];
          if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 1) {
            // console.log('ingreso a valores del conector 1');
            this.conector1 = JSON.parse(JSON.stringify(message.sampleValues));
            this.conector1.push(this.obtieneVelocidadCarga(this.conector1[0].value));
            this.conector1.push(this.obtienePotenciaActual(this.conector1[1].value));
          }
          if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 2) {
            // console.log('ingreso a valores del conector 2');
            this.conector2 = JSON.parse(JSON.stringify(message.sampleValues));
            this.conector2.push(this.obtieneVelocidadCarga(this.conector2[0].value));
            this.conector2.push(this.obtienePotenciaActual(this.conector2[1].value));
          }
        }, err => {
          // console.log(err);
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
        this.serviceResponse = true;
      }, err => {
        this.loading = false
        this.serviceResponse = false;
      });
    });
  }

  getClienteCharging() {
    this.subscriptionClientCharging = interval(5000).pipe(
      switchMap(() => this.clientElectricStationsService.getClientCharging(this.id)) // Llama al servicio
    ).subscribe(
      (resp: any) => {
        this.clientChargingStation = resp.data;
        this.clienteCargando();
      },
      error => {
        console.error('Error al obtener los datos de las estaciones', error);
      }
    );
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

  getAllConnectorStatus() {
    this.subscriptionEstados = interval(5000).pipe(
      switchMap(() => this.connectorStatusService.getAllConnectorByIdElectricStation(this.electricStation.id)) // Llama al servicio
    ).subscribe(
      (data: any) => {
        this.conectorStatus = data.data;
        this.statusEnElectrolinera();
      },
      error => {
        console.error('Error al obtener los datos de las estaciones', error);
      }
    );
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

  cambiaEstado() {
    this.detalle = !this.detalle;
    this.iconClass = this.iconClass === 'pi pi-eye-slash' ? 'pi pi-eye' : 'pi pi-eye-slash';
  }

  // CASO2
  onDesvinculaUsuarioElectrolinera(itemConector) {
    var datoselectrolinera = {
      "sessionIndex": this.electricStation.sessionIndex,
      "transactionId": itemConector.id
    }
    var cliente: ClientChargingStatusModel = itemConector.id == 1 ? this.cliente1 : this.cliente2;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Liberar conector ' + itemConector.id + ' y liberar usuario ' + cliente.userName + '?',
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
    var datoselectrolinera = {
      "sessionIndex": this.electricStation.sessionIndex,
      "transactionId": itemConector.id
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Detener la transacción del conector ' + itemConector.id + '?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.mobileService.detenerCargaElectrolinera(datoselectrolinera)
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

  // CASO1
  onDetieneCargaPorUsuario(event: Event, itemConector) {
    var cliente: ClientChargingStatusModel = itemConector.id == 1 ? this.cliente1 : this.cliente2;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Detener la carga del usuario ' + cliente.userName + '?',
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
          });
      },
      reject: () => {
      }
    });
  }

  dialogPassword() {
    this.visibleDialogPassword = true;
  }

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

  onValidaPassword() {
    return new Promise((resolve) => {
      this.validatePasswordService.validate(this.value)
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
      if (this.value.trim() != '') {
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
}
