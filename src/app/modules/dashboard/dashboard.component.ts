import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
// librerias
import { interval, Subscription } from 'rxjs';
// cores
import { DashboardModule } from './dashboard.module';
import { rutas } from 'src/app/core/constants/rutas';
import { mainTitles } from 'src/app/core/constants/labels';
import { EndPoins } from 'src/app/core/constants/endPoints';
// models
import { Heartbeat } from 'src/app/core/model/heartbeat';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';
// services
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { messages } from 'src/app/core/constants/messages';

import { switchMap } from 'rxjs/operators';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    TableModule,
    DashboardModule,
    NgStyle,
    NgFor,
    NgIf
  ]
})

export default class DashboardComponent implements OnInit, OnDestroy {

  // variables de control
  public loading: boolean = false;
  public serviceResponse: boolean = true;

  // variables globales
  public titleComponent: any = mainTitles['dashboard'];

  // variables propias del componente
  public mensaje: string = messages.noConexion;
  public conectorStatus0: ConnectorStatusModel = new ConnectorStatusModel();
  public conectorStatus1: ConnectorStatusModel = new ConnectorStatusModel();
  public conectorStatus2: ConnectorStatusModel = new ConnectorStatusModel();
  public data: any;
  public electricStations: ElectricStationModel[] = [];

  // variable del websocket
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
  public heartbeat: any;
  public tiempo: number = 0; // Variable para el cronómetro
  public bootNotification: any;
  public statusElectrolinera0: string = 'Unavailable';
  public statusElectrolinera1: string = 'Unavailable';
  public statusElectrolinera2: string = 'Unavailable';
  private subscription: Subscription; // Para el cronómetro
  private maxHeartbeatTime = 100000; // 100 segundos en milisegundos
  private reconnectionInterval = 10000; // 10 segundos en milisegundos
  public estadoHeartbeat = 'Conectando...';
  public estadoHeartbeat2 = 'Offline';
  public estadoHeartbeat3 = 'Offline';
  private subscriptions: Subscription[] = [];
  private heartbeatTimerSubscription: Subscription; // Para manejar el temporizador del heartbeat
  private reconnectionCheckSubscription: Subscription; // Temporizador para la verificación de reconexión
  private verificaConexionWebSocket: Subscription; // Temporizador para la verificación de reconexión
  private websocketUrl = EndPoins.apiUrlOcpp + EndPoins.websocket;

  public puertoCargando1: boolean = false;

  private subscriptionEstados1: Subscription;
  private subscriptionEstados2: Subscription;
  private subscriptionEstados3: Subscription;

  constructor(
    private router: Router,
    private websocketService: WebsocketService,
    private connectorStatusService: ConnectorStatusService,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.heartbeatTimerSubscription) {
      this.heartbeatTimerSubscription.unsubscribe();
    }
    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe();
    }
    if (this.reconnectionCheckSubscription) {
      this.reconnectionCheckSubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.websocketStatusSubscription) {
      this.websocketStatusSubscription.unsubscribe();
    }

    if (this.subscriptionEstados1) {
      this.subscriptionEstados1.unsubscribe();
    }
    if (this.subscriptionEstados2) {
      this.subscriptionEstados2.unsubscribe();
    }
    if (this.subscriptionEstados3) {
      this.subscriptionEstados3.unsubscribe();
    }
  }

  ngOnInit() {
    this.getElectricStation()
      .then((servicioResponse) => {
        if (servicioResponse) {

          return this.conectaWebSocket();
        } else {
          return false;
        }
      })
      .then((servicioResponse) => {
        if (servicioResponse) {
          return this.getStatusConnectorES1();
        } else {
          return false;
        }
      })
      .then((servicioResponse) => {
        if (servicioResponse) {
          return this.getStatusConnectorES2();
        } else {
          return false;
        }
      })
      .then((servicioResponse) => {
        if (servicioResponse) {
          return this.getStatusConnectorES3();
        } else {
          return false;
        }
      })

      .then((servicioResponse) => {
        if (servicioResponse) {
          return this.escucharHeartbeat();
        } else {
          return false;
        }
      })
      .then((conexionWs) => {
        if (this.isConnected) {
          if (this.puertoCargando1) {
            this.cambiarEstadoHeartbeat('En línea');
          } else {
            this.cambiarEstadoHeartbeat('Conectando...');
          }
          return true;
        } else {
          this.cambiarEstadoHeartbeat('Offline');
        }
      })
  }

  getElectricStation() {
    return new Promise((resolve) => {
      // this.loading = true;
      this.electricStationsService.getAllnoCrud().subscribe(
        (resp: any) => {
          if (resp) {
            this.electricStations = resp.data;
            // this.loading = false
          } else {
            // this.loading = false
          }
          this.serviceResponse = true;
          resolve(true);
        }, err => {
          // this.loading = false
          this.serviceResponse = false;
          resolve(false);
        }
      )
    })
  }

  getStatusConnectorES1() {
    return new Promise((resolve) => {
      this.subscriptionEstados1 = interval(5000).pipe(
        switchMap(() => this.connectorStatusService.getAllConnectorByIdElectricStation(1)) // Llama al servicio
      ).subscribe(
        (resp: any) => {
          if (resp) {
              this.conectorStatus0 = resp.data;
              this.estadoElectrolinera(this.conectorStatus0, 1)
            resolve(true);
            this.serviceResponse = true;
          } else {
            resolve(false);
          }
        },
        error => {
          this.loading = false
          this.serviceResponse = false;
          resolve(false);
        }
      );
    })
  }

  getStatusConnectorES2() {
    return new Promise((resolve) => {
      this.subscriptionEstados2 = interval(5000).pipe(
        switchMap(() => this.connectorStatusService.getAllConnectorByIdElectricStation(2)) // Llama al servicio
      ).subscribe(
        (resp: any) => {
          if (resp) {
              this.conectorStatus1 = resp.data;
              this.estadoElectrolinera(this.conectorStatus1, 2)
            resolve(true);
            this.serviceResponse = true;
          } else {
            resolve(false);
          }
        },
        error => {
          this.loading = false
          this.serviceResponse = false;
          resolve(false);
        }
      );
    })
  }

  getStatusConnectorES3() {
    return new Promise((resolve) => {
      this.subscriptionEstados3 = interval(5000).pipe(
        switchMap(() => this.connectorStatusService.getAllConnectorByIdElectricStation(3)) // Llama al servicio
      ).subscribe(
        (resp: any) => {
          if (resp) {
              this.conectorStatus2 = resp.data;
              this.estadoElectrolinera(this.conectorStatus2, 3)
            resolve(true);
            this.serviceResponse = true;
          } else {
            resolve(false);
          }
        },
        error => {
          this.loading = false
          this.serviceResponse = false;
          resolve(false);
        }
      );
    })
  }

  conectaWebSocket() {
    // TODO FALTA ENVIAR EL DATO CORRECTO
    return new Promise((resolve) => {
      // Suscribirse al estado de la conexión
      this.websocketService.initializeWebSocketConnection(this.websocketUrl);
      this.websocketStatusSubscription = this.websocketService.connectionStatus$.subscribe(
        (status: boolean) => {
          this.isConnected = status;
        }
      );
      resolve(true)
    })
  }

  public heartbeatMessage: Heartbeat = new Heartbeat();
  public heartbeatMessage2: Heartbeat = new Heartbeat();
  public heartbeatMessage3: Heartbeat = new Heartbeat();
  private heartbeatSubscription: Subscription;
  public escucho: boolean = true;
  // Escuchar cuando llega el primer heartbeat

  escucharHeartbeat() {
    return new Promise((resolve) => {
      this.heartbeatSubscription = this.websocketService.heartbeatReceived$.subscribe((message: any) => {
        if (message) {
          this.getElectricStation();
          this.escucho = true;
          this.heartbeatMessage = message.sessionIndex; // Almacenar el contenido del mensaje del heartbeat
          // aqui poner Conectando... // porque se esta crendo nuevo sesion index
          this.cambiarEstadoHeartbeat('Conectando...');
          if (this.heartbeatMessage == this.electricStations[0].sessionIndex) {
            this.cambiarEstadoHeartbeat('En línea');
          }
          this.reiniciarTemporizadorHeartbeat();
        }
      });
      if (this.puertoCargando1) {
        this.cambiarEstadoHeartbeat('En línea');
      }
      this.subscriptions.push(this.heartbeatSubscription);
      resolve(true);
    })
  }

  // Cambiar el estado del heartbeat
  cambiarEstadoHeartbeat(estado: string): void {

    this.estadoHeartbeat = estado;
    // Si el estado es "Offline", comenzar a verificar la reconexión cada 10 segundos
    if (estado === 'Offline' && this.isConnected) {

    }
    if (estado === 'Offline' && !this.isConnected) {
      this.escucho = false;
      this.verificarReconexión();
    }
    // metodo se adiciono para ver si hay ws pero no hay hb
    if (estado === 'Conectando...' && this.isConnected) {
      this.reiniciarTemporizadorHeartbeat();
    }
    if (estado === 'En línea') {
      // Detener la verificación de reconexión si ya está en línea
      this.detenerVerificacionReconexión();
    }
  }

  interval: any;

  // Iniciar cronómetro
  reiniciarTemporizadorHeartbeat(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.tiempo = JSON.parse(JSON.stringify(0));
    // Iniciar el cronómetro al cargar el componente
    this.interval = setInterval(() => {
      this.tiempo++;
      if (this.tiempo >= 130) {
        this.cambiarEstadoHeartbeat('Offline');
      } else {

      }
    }, 1000); // Incrementar  cada 1 segundo
  }

  reiniciarTemporizadorHeartbeat0(): void {
    if (this.heartbeatTimerSubscription) {
      this.heartbeatTimerSubscription.unsubscribe();
    }
    this.heartbeatTimerSubscription = interval(this.maxHeartbeatTime).subscribe((time) => {
      this.cambiarEstadoHeartbeat('Offline');
    });
    this.subscriptions.push(this.heartbeatTimerSubscription);
  }

  // Verificar la reconexión cada 10 segundos
  verificarReconexión(): void {
    if (this.reconnectionCheckSubscription) {
      return;
    }
    // Comenzar a verificar la reconexión cada 10 segundos
    this.reconnectionCheckSubscription = interval(this.reconnectionInterval).subscribe(() => {
      if (this.websocketService.isConnected()) {

        this.cambiarEstadoHeartbeat('Offline');
      } else {
        this.conectaWebSocket();
      }
    });
    this.subscriptions.push(this.reconnectionCheckSubscription);
  }

  // Detener la verificación de reconexión
  detenerVerificacionReconexión(): void {
    if (this.reconnectionCheckSubscription) {
      this.reconnectionCheckSubscription.unsubscribe();
      this.reconnectionCheckSubscription = null;
    }
  }

  private websocketStatusSubscription: Subscription;
  public isConnected: boolean = false;

  estadoElectrolinera(estados, id) {
    if (estados.length > 0 && estados.length < 3) {
      if (id == 1) {
        this.statusElectrolinera0 = this.comparaEstados(estados[0].lastState, estados[1].lastState);
        if (estados[0].lastState == "Charging" || estados[1].lastState == "Charging") {
          this.puertoCargando1 = true;
          this.estadoHeartbeat = 'En línea'; 
        } else {
          this.puertoCargando1 = false;
        }
      }
      if (id == 2) {
        this.statusElectrolinera1 = this.comparaEstados(estados[0].lastState, estados[1].lastState);
      }
      if (id == 3) {
        this.statusElectrolinera2 = this.comparaEstados(estados[0].lastState, estados[1].lastState);
      }
      this.comparaEstados(estados[0], estados[1]);
    }
  }

  onVerTodasElectrolineras(id) {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline, id]);
  }

  comparaEstados(estado1, estado2) {
    if (estado1 == "Available" || estado2 == "Available") {
      return "Available"
    } else {
      return "Unavailable"
    }
  }
}
