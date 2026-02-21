import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// librerias
import { Subscription } from 'rxjs';
// cores
import { messages } from 'src/app/core/constants/messages';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { ValidaToken } from 'src/app/core/utils/verificarToken';
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
import { ValidatePasswordService } from './services/validate-password.service';
import { ChargingConnector } from 'src/app/core/model/charging-connector';
import { estadosConectores } from 'src/app/core/constants/labels';
import { ForzarDetencionService } from 'src/app/core/services/forzar-detencion.service';

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
  
  // Variables de control de limpieza
  private ultimoStopConector1: number = 0;
  private ultimoStopConector2: number = 0;
  private forzarLimpieza1: boolean = false;
  private forzarLimpieza2: boolean = false;
  private ultimoEstado1: string = '';
  private ultimoEstado2: string = '';

  // variables propias del componente
  public items: MenuItem[];
  public conectores: any[] = [];
  public messages: string[] = [];
  public status1: string = '';
  public status2: string = '';
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

  public meterValues1 : any;
  public meterValues2 : any;

  // subscripciones para la ejecucion de los estados cada n segundos
  private subscriptionMeterValues: Subscription;
  private subscriptionConectorStatus: Subscription;
  private subscriptionClientCharging: Subscription;
  private subscriptionReconnectionCheck: Subscription;
  private subscriptionPolling: Subscription;

  constructor(
    private global: Global,
    private router: Router,
    private route: ActivatedRoute,
    private mobileService: MobileService,
    private forzarDetencionService: ForzarDetencionService,
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
    
    if (this.subscriptionPolling) {
      this.subscriptionPolling.unsubscribe();
    }
    
    this.websocketService.disconnect();
  }

  async ngOnInit() {
    if (ValidaToken()) {
      await this.inicializaDatos();
      await this.getClienteCharging();
      await this.getAllConnectorStatus();
      await this.getOneElectricStation();
      
      // 🔴 SOLUCIÓN 3: Inicializar conectores ANTES de armar tabla
      this.inicializarConectores();
      
      this.componenteVisible = true;
      this.loading = false;
      this.verificarReconexión();
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);

      this.subscriptionConectorStatus = this.websocketService.getConnectorStatus()
        .subscribe((data) => {
          if (data[0].connector == '1') {
            // 🔴 SOLUCIÓN 2: Evitar cambios rápidos de estado
            this.procesarCambioEstado(1, data[0].lastState);
          }
          if (data[1].connector == '2') {
            this.procesarCambioEstado(2, data[1].lastState);
          }
        });

      this.subscriptionClientCharging = this.websocketService.getClientCharging()
        .subscribe((data) => {
          this.clientChargingStation = data;
          this.clienteCargando();
          this.armaTablaConector();
        });

      // LLAMAMOS AL MÉTODO CORREGIDO DE METER VALUES
      this.getValoresMedidor();

      try {
      } catch (error) {
        console.error('Ocurrió un error en la inicialización:', error);
      }

      // POLLING
      this.subscriptionPolling = interval(5000).subscribe(() => {
         this.refrescarDatosCiclo();
      });

    } else {
      this.router.navigate(['']);
    }
  }

  // 🔴 SOLUCIÓN 2: Método para procesar cambios de estado con debounce
 procesarCambioEstado(connectorId: number, nuevoEstado: string) {
    // CORRECCIÓN 2: Lógica de desbloqueo de limpieza
    // Si el estado vuelve a Disponible o Finalizando, permitimos nuevos datos
    if (nuevoEstado === 'Available' || nuevoEstado === 'Finishing' || nuevoEstado === 'Faulted') {
       if (connectorId === 1) this.forzarLimpieza1 = false;
       if (connectorId === 2) this.forzarLimpieza2 = false;
    }

    if (connectorId === 1) {
      if (nuevoEstado !== this.ultimoEstado1) {
        this.ultimoEstado1 = nuevoEstado;
        this.conectores[0].lastState = nuevoEstado;
        this.status1 = nuevoEstado;
        
        // Si pasa a disponible, nos aseguramos de limpiar visualmente por si acaso
        if (nuevoEstado === 'Available') {
           this.limpiarInterfazVisual(1);
        }
        
        this.armaTablaConector();
      }
    } else if (connectorId === 2) {
      if (nuevoEstado !== this.ultimoEstado2) {
        this.ultimoEstado2 = nuevoEstado;
        this.conectores[1].lastState = nuevoEstado;
        this.status2 = nuevoEstado;

        if (nuevoEstado === 'Available') {
           this.limpiarInterfazVisual(2);
        }

        this.armaTablaConector();
      }
    }
  }
  // Método auxiliar para limpiar variables visuales sin activar el bloqueo permanente
  limpiarInterfazVisual(conectorId: number) {
    if (conectorId === 1) {
      this.conector1 = this.resetMeterValues();
      this.cliente1 = new ClientChargingStatusModel();
      this.cliente1.userName = null;
      this.transaccionid1 = 0;
    } else {
      this.conector2 = this.resetMeterValues();
      this.cliente2 = new ClientChargingStatusModel();
      this.cliente2.userName = null;
      this.transaccionid2 = 0;
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
        {
          label: 'Forzar Detención',
          icon: 'pi pi-exclamation-triangle',
          styleClass: 'custom-menu-item',
          command: () => {
            this.onForzarDetencion(this.conector);
          }
        },
        { separator: true },
      ];
      resolve();
    })
  }

  // 🔴 SOLUCIÓN 3: Inicializar conectores
  inicializarConectores() {
    this.conectores = [
      {
        nombre: 'CONECTOR DE CARGA 1',
        maxVoltaje: '230',
        maxAmperaje: 0,
        velocidadCarga: '-',
        corrienteActual: 0,
        potenciaActual: 0,
        cargaEnergia: 0,
        clienteCarga: '-',
        montoConsumido: 0,
        lastState: 'Available'
      },
      {
        nombre: 'CONECTOR DE CARGA 2',
        maxVoltaje: '230',
        maxAmperaje: 0,
        velocidadCarga: '-',
        corrienteActual: 0,
        potenciaActual: 0,
        cargaEnergia: 0,
        clienteCarga: '-',
        montoConsumido: 0,
        lastState: 'Available'
      }
    ];
  }

  getAllConnectorStatus() {
    this.connectorStatusService.getAllConnectorByIdElectricStation(this.id).subscribe(
      (data: any) => {
        const sorted = data.data.sort(
          (a, b) => Number(a.connector) - Number(b.connector)
        );
        this.conectorStatus = sorted;

        // -------- CONECTOR 1 --------
        const nuevoEstado1 = this.conectorStatus[0]?.lastState || 'Available';
        
        // 🔴 SOLUCIÓN 2: Solo actualizar si realmente cambió
        if (nuevoEstado1 !== this.ultimoEstado1) {
          this.ultimoEstado1 = nuevoEstado1;
          this.status1 = nuevoEstado1;
          if (this.conectores[0]) {
            this.conectores[0].lastState = nuevoEstado1;
          }
        }

        // -------- CONECTOR 2 --------
        const nuevoEstado2 = this.conectorStatus[1]?.lastState || 'Available';
        
        if (nuevoEstado2 !== this.ultimoEstado2) {
          this.ultimoEstado2 = nuevoEstado2;
          this.status2 = nuevoEstado2;
          if (this.conectores[1]) {
            this.conectores[1].lastState = nuevoEstado2;
          }
        }

        this.armaTablaConector();
      },
      error => {
        console.error('Error al obtener los datos de las estaciones', error);
      }
    );
  }

  getClienteCharging() {
    this.clientElectricStationsService.getClientCharging(this.id).subscribe(
      (resp: any) => {
        this.clientChargingStation = resp.data;
        this.clienteCargando();
        this.armaTablaConector();
      },
      error => {
      }
    );
  }

  getEstadosConectores() {
    this.websocketService.initializeWebSocketConnection(this.websocketUrl);
    this.subscriptionConectorStatus = this.websocketService.getConnectorStatus()
      .subscribe((data) => {
        if (data[0].connector == '1') {
          this.conectores[0].lastState = data[0].lastState;
          this.conectores[0].id = data[0].connector;
          this.status1 = data[0].lastState;
        }
        if (data[1].connector == '2') {
          this.conectores[1].lastState = data[1].lastState;
          this.conectores[1].id = data[1].connector;
          this.status2 = data[1].lastState;
        }
      });
  }
  
  itemSeleccionado(item) {
    this.conector = JSON.parse(JSON.stringify(item))
  }

getValoresMedidor() {
    return new Promise((resolve) => {
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);
      
      this.subscriptionMeterValues = this.websocketService.getMeterValues()
        .subscribe(message => {
          
          // --- CONECTOR 1 ---
          if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 1) {
            
            if (this.forzarLimpieza1) { return; }

            this.transaccionid1 = message.transactionId;
            this.conector1 = JSON.parse(JSON.stringify(message.sampleValues));
            this.conector1.push(this.obtieneVelocidadCarga(this.conector1[0].value));
            this.conector1.push(this.obtienePotenciaActual(this.conector1[1].value));
            this.meterValues1 = message;
            
            // CORRECCIÓN TYPESCRIPT: Usamos String() para asegurar que sea texto antes de parseFloat
            // O alternativamente usamos Number() que es más flexible.
            // Aquí aseguro que sea string para parseFloat:
            const valorCorriente = this.conector1[1]?.value;
            const corriente = parseFloat(String(valorCorriente || '0'));
            
            if (corriente > 0.1 && this.status1 !== 'Charging') {
               this.status1 = 'Charging';
               this.conectores[0].lastState = 'Charging';
               this.getAllConnectorStatus(); 
            }
          }

          // --- CONECTOR 2 ---
          if (message.sessionIndex == this.electricStation.sessionIndex && message.connectorId == 2) {
            
            if (this.forzarLimpieza2) { return; }

            this.transaccionid2 = message.transactionId;
            this.conector2 = JSON.parse(JSON.stringify(message.sampleValues));
            this.conector2.push(this.obtieneVelocidadCarga(this.conector2[0].value));
            this.conector2.push(this.obtienePotenciaActual(this.conector2[1].value));
            this.meterValues2 = message;
            
            // CORRECCIÓN TYPESCRIPT: Misma corrección para el conector 2
            const valorCorriente = this.conector2[1]?.value;
            const corriente = parseFloat(String(valorCorriente || '0'));
            
            if (corriente > 0.1 && this.status2 !== 'Charging') {
               this.status2 = 'Charging';
               this.conectores[1].lastState = 'Charging';
               this.getAllConnectorStatus();
            }
          }
          
          this.armaTablaConector();
        }, err => {
          console.error('Error en meter values:', err);
        });
      resolve(true);
    });
  }
  
  getClientes() {
    return new Promise((resolve) => {
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);
      this.subscriptionClientCharging = this.websocketService.getClientCharging()
        .subscribe((data) => {
          this.clientChargingStation = data;
          this.clienteCargando();
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
        this.conectaWebSocket();
      } else {
      }
    });
  }

  conectaWebSocket() {
    return new Promise((resolve) => {
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);
      resolve(true)
    })
  }

 armaTablaConector(): Promise<void> {
    return new Promise((resolve) => {
      
      // Si forzamos limpieza, reseteamos el array de datos
      if (this.forzarLimpieza1) { this.conector1 = this.resetMeterValues(); }
      if (this.forzarLimpieza2) { this.conector2 = this.resetMeterValues(); }
      
      // ... resto de tu lógica de corrientes ...
      const corriente1 = this.conector1.find(item => item.measurand == 'Current.Import')?.value;
      const hayCorriente1 = Number(corriente1) > 0;
      
      const corriente2 = this.conector2.find(item => item.measurand == 'Current.Import')?.value;
      const hayCorriente2 = Number(corriente2) > 0;

      // CORRECCIÓN 3: Condición visual estricta
      // Mostramos datos SI NO estamos limpiando Y (Está Cargando O Hay Corriente)
      const mostrarDatos1 = !this.forzarLimpieza1 && (this.status1 === 'Charging' || hayCorriente1);
      const mostrarDatos2 = !this.forzarLimpieza2 && (this.status2 === 'Charging' || hayCorriente2);

      this.conectores = [{
        nombre: 'CONECTOR DE CARGA 1',
        maxVoltaje: '230',
        maxAmperaje: mostrarDatos1 ? (this.conector1.filter(item => item.measurand == 'Current.Offered')[0]?.value || 0) : 0,
        velocidadCarga: mostrarDatos1 ? (this.conector1.filter(item => item.measurand.includes("Carga"))[0]?.measurand || '-') : '-',
        corrienteActual: mostrarDatos1 ? (this.conector1.filter(item => item.measurand == 'Current.Import')[0]?.value || 0) : 0,
        potenciaActual: mostrarDatos1 ? (this.conector1.filter(item => item.measurand == 'Potencia Actual')[0]?.value || 0) : 0,
       cargaEnergia: mostrarDatos1 ? (this.conector1.filter(item => item.measurand == 'Energy.Active.Import.Register')[0]?.value || 0) : 0,
        // IMPORTANTE: Si forzamos limpieza, el cliente debe ser '-'
        clienteCarga: (this.cliente1.userName && !this.forzarLimpieza1) ? this.cliente1.userName : '-',
        // ...
        montoConsumido: mostrarDatos1 ? (this.conector1.filter(item => item.measurand == 'Amount.Consumed')[0]?.value || 0) : 0,
        lastState: this.status1
      }, {
        nombre: 'CONECTOR DE CARGA 2',
        maxVoltaje: '230',
        maxAmperaje: mostrarDatos2 ? (this.conector2.filter(item => item.measurand == 'Current.Offered')[0]?.value || 0) : 0,
        velocidadCarga: mostrarDatos2 ? (this.conector2.filter(item => item.measurand.includes("Carga"))[0]?.measurand || '-') : '-',
        corrienteActual: mostrarDatos2 ? (this.conector2.filter(item => item.measurand == 'Current.Import')[0]?.value || 0) : 0,
        potenciaActual: mostrarDatos2 ? (this.conector2.filter(item => item.measurand == 'Potencia Actual')[0]?.value || 0) : 0,
        cargaEnergia: mostrarDatos2 ? (this.conector2.filter(item => item.measurand == 'Energy.Active.Import.Register')[0]?.value || 0) : 0,
        clienteCarga: (this.cliente2.userName && !this.forzarLimpieza2) ? this.cliente2.userName : '-',
        // ...
        montoConsumido: mostrarDatos2 ? (this.conector2.filter(item => item.measurand == 'Amount.Consumed')[0]?.value || 0) : 0,
        lastState: this.status2
      }];
      
      resolve();
    });
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
        if (err.status == 404) {
          this.serviceResponse = false;
        } else {
          this.serviceResponse = true;
        }
        this.loading = false;
      });
    });
  }

  clienteCargando() {
    return new Promise((resolve) => {
      if (this.clientChargingStation.length > 0) {
        var usuariosConector1 = this.clientChargingStation.filter(i => i.connetorOcpp == "1").length > 0 ? this.clientChargingStation.filter(i => i.connetorOcpp == "1") : [];
        var usuariosConector2 = this.clientChargingStation.filter(i => i.connetorOcpp == "2").length > 0 ? this.clientChargingStation.filter(i => i.connetorOcpp == "2") : [];
        this.cliente1 = usuariosConector1.length > 0 ? usuariosConector1[usuariosConector1.length - 1] : new ClientChargingStatusModel();
        this.cliente2 = usuariosConector2.length > 0 ? usuariosConector2[usuariosConector2.length - 1] : new ClientChargingStatusModel();
        this.armaTablaConector();
        resolve(true);
      } else {
        this.cliente1 = new ClientChargingStatusModel();
        this.cliente2 = new ClientChargingStatusModel();
        this.armaTablaConector();
        resolve(true);
      }
    });
  }

  obtieneVelocidadCarga(currentOffered: number) {
    let potencia = 230 * currentOffered;
    if (currentOffered >= 0 && currentOffered <= 31.99) {
      return { measurand: 'Carga Lenta', value: 0, unit: 'Kw', phases: '#32CD32' }
    }
    if (currentOffered >= 32 && currentOffered <= 96) {
      return { measurand: 'Carga Semi Rápida', value: 0, unit: 'Kw', phases: '#00FF00' }
    }
    return { measurand: 'Carga no definida', value: 0, unit: 'Kw', phases: '#8e44ad' }
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
      if (connectorA.lastState != "Charging") {
        this.conectores = [];
      }
    });
  }

  // CASO1: Detener Carga Por Usuario
  onDetieneCargaPorUsuario(event: Event, itemConector) {
    const esConector1 = itemConector.nombre === 'CONECTOR DE CARGA 1';
    const cliente = esConector1 ? this.cliente1 : this.cliente2;
    const transactionId = esConector1 ? this.transaccionid1 : this.transaccionid2;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Detener la carga del usuario ${cliente.userName}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mobileService
          .detieneTransacionCredit(
            this.electricStation.sessionIndex,
            transactionId,
            cliente.idClientUser
          )
          .subscribe(() => {
            // 🔴 SOLUCIÓN 4: Limpieza COMPLETA
            this.limpiarConectorCompleto(esConector1);
            this.messageService.add({ severity: 'success', detail: 'Carga detenida correctamente' });
          });
      }
    });
  }

  // CASO2: Detener Carga
  onDesvinculaUsuarioElectrolinera(itemConector) {
    var datoselectrolinera = {
      "sessionIndex": this.electricStation.sessionIndex,
      "transactionId": itemConector.nombre == 'CONECTOR DE CARGA 1' ? 1 : 2
    }
    const esConector1 = itemConector.nombre == 'CONECTOR DE CARGA 1'; 

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Detener la transacción del ' + itemConector.nombre + '?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación',
      accept: () => {
        this.mobileService.liberarTransaccionUsuario(datoselectrolinera)
          .subscribe((resp: any) => {
            if (resp) {
              this.messageService.add({ severity: 'info', detail: resp.message });
              
              // 🔴 SOLUCIÓN 4: Limpieza COMPLETA
              this.limpiarConectorCompleto(esConector1); 
            }
          }, err => {
             this.messageService.add({ severity: 'error', detail: messages.resp.message });
          });
      },
      reject: () => { }
    });
  }

  // CASO3: Desvincular Usuario
  onDetieneCargaElectrolinera(itemConector) {
    var cliente = this.clienteAuxiliar;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Liberar ' + itemConector.nombre + ' y liberar usuario ' + cliente.userName + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientElectricStationsService.detenerCargaClient(cliente.idClientUser)
          .subscribe((resp: any) => {
            if (resp) {
               this.messageService.add({ severity: 'success', detail: messages.detenerCarga });
            }
          }, err => {
            this.messageService.add({ severity: 'error', detail: messages.resp.message });
          });
      },
      reject: () => { }
    });
  }

  // CASO4: Forzar Detención
  onForzarDetencion(itemConector) {    
    var cliente: ClientChargingStatusModel = itemConector.nombre == 'CONECTOR DE CARGA 1' ? this.cliente1 : this.cliente2;
    var metervalues = itemConector.nombre == 'CONECTOR DE CARGA 1' ? this.meterValues1 : this.meterValues2;
    let conector = {
      sessionIndex: this.electricStation.sessionIndex || '',
      transactionId: metervalues?.transactionId || ''
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Forzar la Detención de carga del usuario ' + cliente.userName + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.forzarDetencionService.onForzarDetencion(conector).subscribe((resp: any) => {
          if (resp) {
            this.messageService.add({ severity: 'info', detail: resp.message });
          }
        }, err => {
          if (err.status == 200) {
            this.messageService.add({ severity: 'info', detail: 'Se detuvo forzosamente la conexión' });
          }
        });
      },
      reject: () => { }
    });
  }

  // Métodos auxiliares
  dialogPassword() { this.visibleDialogPassword = true; }
  onValidaPassword() { return new Promise(r => r(true)); }
  verificaContrasenia() { return new Promise(r => r(true)); }
  confirmarCerrarOpciones(event) { this.habilitaMasOpciones = false; }
  validaformulariodialog() { }
  confirmSwitchChange(event, item) { }
  cambiaEstadoVer() { 
    this.detalle = !this.detalle; 
    this.iconClass = this.iconClass === 'pi pi-eye-slash' ? 'pi pi-eye' : 'pi pi-eye-slash'; 
  }
  reiniciarDatosCero(data) { }

  // 🔴 SOLUCIÓN 4: MÉTODO LIMPIAR CONECTOR COMPLETO
  limpiarConectorCompleto(esConector1: boolean) {
    if (esConector1) {
      // 1. Activar bandera de limpieza
      this.forzarLimpieza1 = true;
      
      // 2. Limpiar TODOS los datos locales
      this.conector1 = this.resetMeterValues();
      this.cliente1 = new ClientChargingStatusModel();
      this.cliente1.userName = null;
      this.status1 = 'Available';
      this.ultimoEstado1 = 'Available';
      this.transaccionid1 = null;
      this.meterValues1 = null;
      
      // 3. También limpiar en el arreglo conectores
      if (this.conectores[0]) {
        this.conectores[0] = {
          ...this.conectores[0],
          maxAmperaje: 0,
          velocidadCarga: '-',
          corrienteActual: 0,
          potenciaActual: 0,
          cargaEnergia: 0,
          clienteCarga: '-',
          montoConsumido: 0,
          lastState: 'Available'
        };
      }
    } else {
      this.forzarLimpieza2 = true;
      
      this.conector2 = this.resetMeterValues();
      this.cliente2 = new ClientChargingStatusModel();
      this.cliente2.userName = null;
      this.status2 = 'Available';
      this.ultimoEstado2 = 'Available';
      this.transaccionid2 = null;
      this.meterValues2 = null;
      
      if (this.conectores[1]) {
        this.conectores[1] = {
          ...this.conectores[1],
          maxAmperaje: 0,
          velocidadCarga: '-',
          corrienteActual: 0,
          potenciaActual: 0,
          cargaEnergia: 0,
          clienteCarga: '-',
          montoConsumido: 0,
          lastState: 'Available'
        };
      }
    }
    
    this.armaTablaConector();
  }

  resetMeterValues(): MeterValueModel[] {
    // Crear un array con 8 MeterValueModel vacíos (6 originales + velocidad + potencia)
    return Array(8).fill(0).map(() => new MeterValueModel());
  }

  refrescarDatosCiclo() {
    this.getAllConnectorStatus(); 
    this.getClienteCharging();
  }
}