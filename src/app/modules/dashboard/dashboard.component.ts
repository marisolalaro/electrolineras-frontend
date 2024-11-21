import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
// librerias
import { switchMap } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { interval, Subscription } from 'rxjs';
// cores
import { DashboardModule } from './dashboard.module';
import { rutas } from 'src/app/core/constants/rutas';
import { messages } from 'src/app/core/constants/messages';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { TraducirEstado } from 'src/app/core/utils/translateStatus';
import { mainTitles, estadosConectores } from 'src/app/core/constants/labels';
// models
import { Heartbeat } from 'src/app/core/model/heartbeat';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';
// services
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';

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
  public conectorStatus0: ConnectorStatusModel[] = [];
  public conectorStatus1: ConnectorStatusModel[] = [];
  public conectorStatus2: ConnectorStatusModel[] = [];
  public data: any;
  public electricStations: ElectricStationModel[] = [];

  public heartbeat: any;
  public tiempo: number = 0; // Variable para el cronómetro
  public bootNotification: any;
  public statusElectrolinera0: any = {estado:estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion};
  public statusElectrolinera1: any = {estado:estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion};
  public statusElectrolinera2: any = {estado:estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion};
  private subscription: Subscription; // Para el cronómetro
  private maxHeartbeatTime = 100000; // 100 segundos en milisegundos
  private reconnectionInterval = 10000; // 10 segundos en milisegundos
  public estadoHeartbeat = {estado:estadosConectores.conectando, severity: estadosConectores.colorConectando}
  public estadoHeartbeat2 = {estado:estadosConectores.sinConexion, severity: estadosConectores.colorSinConexion};
  public estadoHeartbeat3 = {estado:estadosConectores.sinConexion, severity: estadosConectores.colorSinConexion};
  private subscriptions: Subscription[] = [];
  private heartbeatTimerSubscription: Subscription; // Para manejar el temporizador del heartbeat
  private reconnectionCheckSubscription: Subscription; // Temporizador para la verificación de reconexión
  private websocketUrl = EndPoins.apiUrlOcpp + EndPoins.websocket;

  public puertoCargando1: boolean = false;

  private subscriptionEstados1: Subscription;
  private subscriptionEstados2: Subscription;
  private subscriptionEstados3: Subscription;
  private subscriptionAllES: Subscription;

  constructor(
    private router: Router,
    private websocketService: WebsocketService,
    private connectorStatusService: ConnectorStatusService,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscriptionAllES) {
      this.subscriptionAllES.unsubscribe();
    }
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
    this.websocketService.disconnect();
  }

  ngOnInit() {
    this.getElectricStation();

      this.conectaWebSocket()
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
          this.escucharHeartbeat();
          return true
        } else {
          return false;
        }
      })
      .then((conexionWs) => {
        if (this.isConnected) {
          if (this.puertoCargando1) {
            this.cambiarEstadoHeartbeat(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          } else {
            this.cambiarEstadoHeartbeat(estadosConectores.conectando, estadosConectores.colorConectando);
          }
          return true;
        } else {
          this.cambiarEstadoHeartbeat(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
        }
      })
  }

  getElectricStation() {
    this.subscriptionAllES = interval(5000).pipe(
      switchMap(() => this.electricStationsService.getAllnoCrud()) // Llama al servicio
    ).subscribe(
      (resp: any) => {
        if (resp) {
          this.electricStations = resp.data;
        }
        this.serviceResponse = true;
      },
      error => {
        this.serviceResponse = false;
      }
    ); 
  }

  getStatusConnectorES1() {
    return new Promise((resolve) => {
      this.subscriptionEstados1 = interval(5000).pipe(
        switchMap(() => this.connectorStatusService.getAllConnectorByIdElectricStation(1)) // Llama al servicio
      ).subscribe(
        (resp: any) => {
          if (resp) {
            this.conectorStatus0 = resp.data.sort((a: any, b: any) => {
              return a.connector.localeCompare(b.connector);
            });
            this.conectorStatus0 = resp.data.map((item: any) => ({
              ...item,
              lastState: TraducirEstado(item.lastState)
            }));
            this.estadoElectrolinera(this.conectorStatus0, 1)
            this.mapUsuarioEnConectores();
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
            this.conectorStatus1 = resp.data.sort((a: any, b: any) => {
              return a.connector.localeCompare(b.connector);
            });
            this.conectorStatus1 = resp.data.map((item: any) => ({
              ...item,
              lastState: TraducirEstado(item.lastState)
            }));
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
            this.conectorStatus2 = resp.data.sort((a: any, b: any) => {
              return a.connector.localeCompare(b.connector);
            });
            this.conectorStatus2 = resp.data.map((item: any) => ({
              ...item,
              lastState: TraducirEstado(item.lastState)
            }));
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
      this.heartbeatSubscription = this.websocketService.heartbeatReceived$.subscribe((message: any) => {
        if (message) {
          // this.getElectricStationInicial(1);
          this.escucho = true;
          this.heartbeatMessage = message.sessionIndex; // Almacenar el contenido del mensaje del heartbeat
          // aqui poner Conectando... // porque se esta crendo nuevo sesion index
          this.cambiarEstadoHeartbeat(estadosConectores.conectando, estadosConectores.colorConectando);
          if (this.heartbeatMessage == this.electricStations[0].sessionIndex) {
            this.cambiarEstadoHeartbeat(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          }
          this.reiniciarTemporizadorHeartbeat();
        }
      });
      if (this.puertoCargando1) {
        this.cambiarEstadoHeartbeat(estadosConectores.enLinea, estadosConectores.colorEnLinea);
      }
      this.subscriptions.push(this.heartbeatSubscription);
  }

  // Cambiar el estado del heartbeat
  cambiarEstadoHeartbeat(estado: string, severety: string): void {
    if (estado === estadosConectores.sinConexion && !this.isConnected) {
      this.estadoHeartbeat = {estado:estado, severity: severety};
      this.escucho = false;
      this.verificarReconexión();
    }
    if (estado === estadosConectores.conectando && this.isConnected) {
      this.estadoHeartbeat = {estado:estado, severity: severety};
      this.reiniciarTemporizadorHeartbeat();
    }
    if (estado === estadosConectores.enLinea) {
      this.estadoHeartbeat = {estado:estado, severity: severety};
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
        this.cambiarEstadoHeartbeat(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
      } else {

      }
    }, 1000); // Incrementar  cada 1 segundo
  }

  reiniciarTemporizadorHeartbeat0(): void {
    if (this.heartbeatTimerSubscription) {
      this.heartbeatTimerSubscription.unsubscribe();
    }
    this.heartbeatTimerSubscription = interval(this.maxHeartbeatTime).subscribe((time) => {
      this.cambiarEstadoHeartbeat(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
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

        this.cambiarEstadoHeartbeat(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
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
        if (estados[0].lastState == estadosConectores.charging || estados[1].lastState == estadosConectores.charging) {
          this.puertoCargando1 = true;
          this.estadoHeartbeat = {estado:estadosConectores.enLinea, severity: estadosConectores.colorEnLinea}
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

  mapUsuarioEnConectores() {
    this.conectorStatus0 = this.conectorStatus0.map(conector => {
      var usuario = '';
      if (this.electricStations[0].clients.length > 0) {
        if (this.electricStations[0].clients.filter(cliente => cliente.connetorOcpp === conector.connector)[0]) {
          usuario = this.electricStations[0].clients.filter(cliente => cliente.connetorOcpp == conector.connector)[0].userName
        }
      }
      return { ...conector, userName: usuario };
    });
  }

  onVerTodasElectrolineras(id) {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline, id]);
  }

  comparaEstados(estado1, estado2) {
    if (estado1 == estadosConectores.disponible || estado2 == estadosConectores.disponible) {
      return {estado:estadosConectores.disponible, severity: estadosConectores.colorEnLinea}
    } else {
      return {estado:estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion}
    }
  }
}
