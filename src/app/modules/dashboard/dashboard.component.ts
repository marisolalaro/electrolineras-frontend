// dasbboar despues de las pruebas en la electrolinera 12/12/2024

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
import { ValidaToken } from 'src/app/core/utils/verificarToken';
import { ParTasaCargaService } from '../par-tasa-carga/service/par-tasa-carga.service';
import { TasaCargaModel } from 'src/app/core/model/tasa-carga';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    TableModule,
    DashboardModule,
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
  private websocketStatusSubscription: Subscription;
  public isConnected: boolean = false;

  public heartbeat: any;
  public tiempo: number = 0; // Variable para el cronómetro
  public tiempo2: number = 0; // Variable para el cronómetro
  public tiempo3: number = 0; // Variable para el cronómetro
  public bootNotification: any;
  public statusElectrolinera0: any = { estado: estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion };
  public statusElectrolinera1: any = { estado: estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion };
  public statusElectrolinera2: any = { estado: estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion };
  private subscription: Subscription; // Para el cronómetro
  private maxHeartbeatTime = 100000; // 100 segundos en milisegundos
  private reconnectionInterval = 10000; // 10 segundos en milisegundos
  public estadoHeartbeat = { estado: estadosConectores.conectando, severity: estadosConectores.colorConectando }
  public estadoHeartbeat2 = { estado: estadosConectores.conectando, severity: estadosConectores.colorConectando };
  public estadoHeartbeat3 = { estado: estadosConectores.conectando, severity: estadosConectores.colorConectando };
  private subscriptions: Subscription[] = [];
  private heartbeatTimerSubscription: Subscription; // Para manejar el temporizador del heartbeat
  private reconnectionCheckSubscription: Subscription; // Temporizador para la verificación de reconexión
  private websocketUrl = EndPoins.apiUrlOcpp + EndPoins.websocket;

  public heartbeatMessage: Heartbeat = new Heartbeat();
  public heartbeatMessage2: Heartbeat = new Heartbeat();
  public heartbeatMessage3: Heartbeat = new Heartbeat();
  private heartbeatSubscription: Subscription;
  public escucho: boolean = true;

  public puertoCargando1: boolean = false;
  public puertoCargando2: boolean = false;

  public puertoCargando3: boolean = false;
  public puertoCargando4: boolean = false;

  private subscriptionEstados1: Subscription;
  private subscriptionEstados2: Subscription;
  private subscriptionEstados3: Subscription;
  private subscriptionAllES: Subscription;

  public tasaCargaSemiRapida: TasaCargaModel = new TasaCargaModel();
  public tasaCargaLenta: TasaCargaModel = new TasaCargaModel();
  public fechaActual: any;

  constructor(
    private router: Router,
    private websocketService: WebsocketService,
    private parTasaCargaService: ParTasaCargaService,
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
    if (this.interval2) {
      clearInterval(this.interval2);
    }
    if (this.interval3) {
      clearInterval(this.interval3);
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
    if (ValidaToken()) {
    this.inicializaDatos()
    } else {
      this.router.navigate(['']);
    }
  }

  inicializaDatos() {
    this.getElectricStation();
    this.getTasaCarga();
    this.getDateNow();
    this.conectaWebSocket()
      .then((servicioResponse) => {
        if (servicioResponse) {
          return this.getStatusConnectorES1();
        } else {
          return true;
        }
      })
      .then((servicioResponse) => {
        if (servicioResponse) {
          return this.getStatusConnectorES2();
        } else {
          return true;
        }
      })
      .then((servicioResponse) => {
        if (servicioResponse) {
          return this.getStatusConnectorES3();
        } else {
          return true;
        }
      })

      .then((servicioResponse) => {
        if (servicioResponse) {
          this.escucharHeartbeat();
          return true
        } else {
          return true;
        }
      })
      .then((conexionWs) => {
        if (this.isConnected) {
          if (this.puertoCargando1) {
            this.cambiarEstadoHeartbeat(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          } else {
            this.cambiarEstadoHeartbeat(estadosConectores.conectando, estadosConectores.colorConectando);
          }
          if (this.puertoCargando2) {
            this.cambiarEstadoHeartbeat2(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          } else {
            this.cambiarEstadoHeartbeat2(estadosConectores.conectando, estadosConectores.colorConectando);
          }
          if (this.puertoCargando3) {
            this.cambiarEstadoHeartbeat3(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          } else {
            this.cambiarEstadoHeartbeat3(estadosConectores.conectando, estadosConectores.colorConectando);
          }
          return true;
        } else {
          this.cambiarEstadoHeartbeat(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
          this.cambiarEstadoHeartbeat2(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
          this.cambiarEstadoHeartbeat3(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
        }
      })
  }

  ngAfterViewInit() {
    this.conectaWebSocket()
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
        if (error.status == 404) {
            this.serviceResponse = false;
          } else {
            this.serviceResponse = true;
          }
          this.loading = false
      }
    );
  }

  getTasaCarga() {
    this.parTasaCargaService.getCurrentRate().subscribe(
      (data: any) => {
        this.tasaCargaLenta = data.data.filter(item => (item.description == 'CARGA LENTA, ULTRA LENTA, Ba' || item.description == 'CARGA LENTA, ULTRA LENTA, Bb' || item.description == 'CARGA LENTA, ULTRA LENTA, Bm') )[0];
        this.tasaCargaSemiRapida = data.data.filter(item => (item.description == 'CARGA SEMI RAPIDA, Ba' || item.description == 'CARGA SEMI RAPIDA, Bb' || item.description == 'CARGA SEMI RAPIDA, Bm'))[0];
      },
      error => {
        console.error('Error al obtener los datos de las tasas de carga', error);
      });
  }

  getDateNow() {
    this.parTasaCargaService.getCurrentDate().subscribe(
      (data: any) => {
        this.fechaActual = data.data;
      },
      error => {
        console.error('Error al obtener los datos de las tasas de carga', error);
      });
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
            this.mapUsuarioEnConectores(0);
            resolve(true);
            this.serviceResponse = true;
          } else {
            resolve(false);
          }
        },
        error => {
          if (error.status == 404) {
            this.serviceResponse = false;
          } else {
            this.serviceResponse = true;
          }
          this.loading = false
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
            this.mapUsuarioEnConectores(1);
            resolve(true);
            this.serviceResponse = true;
          } else {
            resolve(false);
          }
        },
        error => {
          if (error.status == 404) {
            this.serviceResponse = false;
          } else {
            this.serviceResponse = true;
          }
          this.loading = false
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
            this.mapUsuarioEnConectores(2);
            resolve(true);
            this.serviceResponse = true;
          } else {
            resolve(false);
          }
        },
        error => {
          if (error.status == 404) {
            this.serviceResponse = false;
          } else {
            this.serviceResponse = true;
          }
          this.loading = false
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


  // Escuchar cuando llega el primer heartbeat

  escucharHeartbeat() {
    this.heartbeatSubscription = this.websocketService.heartbeatReceived$.subscribe((message: any) => {

      if (message) {
        this.escucho = true;
        this.heartbeatMessage = message.sessionIndex;
        if (this.heartbeatMessage == this.electricStations[0].sessionIndex) {
          this.cambiarEstadoHeartbeat(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          this.reiniciarTemporizadorHeartbeat();
        }
        if (this.heartbeatMessage == this.electricStations[1].sessionIndex) {
          this.cambiarEstadoHeartbeat2(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          this.reiniciarTemporizadorHeartbeat1();
        }
        if (this.heartbeatMessage == this.electricStations[2].sessionIndex) {
          this.cambiarEstadoHeartbeat3(estadosConectores.enLinea, estadosConectores.colorEnLinea);
          this.reiniciarTemporizadorHeartbeat2();
        }
      }
    });
    if (this.puertoCargando1) {
      this.cambiarEstadoHeartbeat(estadosConectores.enLinea, estadosConectores.colorEnLinea);
    }
    if (this.puertoCargando2) {
      this.cambiarEstadoHeartbeat2(estadosConectores.enLinea, estadosConectores.colorEnLinea);
    }
    if (this.puertoCargando3) {
      this.cambiarEstadoHeartbeat3(estadosConectores.enLinea, estadosConectores.colorEnLinea);
    }
    this.subscriptions.push(this.heartbeatSubscription);
  }

  // Cambiar el estado del heartbeat
  cambiarEstadoHeartbeat(estado: string, severety: string): void {
    if (estado === estadosConectores.sinConexion && this.isConnected) {
      this.estadoHeartbeat = { estado: estado, severity: severety };
    }
    if (estado === estadosConectores.sinConexion && !this.isConnected) {
      this.estadoHeartbeat = { estado: estado, severity: severety };
      this.escucho = false;
      this.verificarReconexión();
    }
    if (estado === estadosConectores.conectando && this.isConnected) {
      this.estadoHeartbeat = { estado: estado, severity: severety };
      this.reiniciarTemporizadorHeartbeat();
    }
    if (estado === estadosConectores.enLinea) {
      this.estadoHeartbeat = { estado: estado, severity: severety };
      // Detener la verificación de reconexión si ya está en línea
      this.detenerVerificacionReconexión();
    }
  }

  cambiarEstadoHeartbeat2(estado: string, severety: string): void {
    if (estado === estadosConectores.sinConexion && this.isConnected) {
      this.estadoHeartbeat2 = { estado: estado, severity: severety };
    }
    if (estado === estadosConectores.sinConexion && !this.isConnected) {
      this.estadoHeartbeat2 = { estado: estado, severity: severety };
      this.escucho = false;
      this.verificarReconexión();
    }
    if (estado === estadosConectores.conectando && this.isConnected) {
      this.estadoHeartbeat2 = { estado: estado, severity: severety };
      this.reiniciarTemporizadorHeartbeat1();
    }
    if (estado === estadosConectores.enLinea) {
      this.estadoHeartbeat2 = { estado: estado, severity: severety };
      // Detener la verificación de reconexión si ya está en línea
      this.detenerVerificacionReconexión();
    }
  }

  cambiarEstadoHeartbeat3(estado: string, severety: string): void {
    if (estado === estadosConectores.sinConexion && this.isConnected) {
      this.estadoHeartbeat3 = { estado: estado, severity: severety };
    }
    if (estado === estadosConectores.sinConexion && !this.isConnected) {
      this.estadoHeartbeat3 = { estado: estado, severity: severety };
      this.escucho = false;
      this.verificarReconexión();
    }
    if (estado === estadosConectores.conectando && this.isConnected) {
      this.estadoHeartbeat3 = { estado: estado, severity: severety };
      this.reiniciarTemporizadorHeartbeat2();
    }
    if (estado === estadosConectores.enLinea) {
      this.estadoHeartbeat3 = { estado: estado, severity: severety };
      // Detener la verificación de reconexión si ya está en línea
      this.detenerVerificacionReconexión();
    }
  }

  interval: any;
  reiniciarTemporizadorHeartbeat(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.tiempo = JSON.parse(JSON.stringify(0));
    this.interval = setInterval(() => {
      this.tiempo++;      
      if (this.tiempo >= 130) {
        this.tiempo = JSON.parse(JSON.stringify(0));
        if (this.websocketService.isConnected()) {
          this.cambiarEstadoHeartbeat(estadosConectores.conectando, estadosConectores.colorConectando);
        } else {
          this.conectaWebSocket();
          this.cambiarEstadoHeartbeat(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
        }
      }
    }, 1000); // Incrementar  cada 1 segundo
  }

  interval2: any;
  reiniciarTemporizadorHeartbeat1(): void {
    if (this.interval2) {
      clearInterval(this.interval2);
    }
    this.tiempo2 = JSON.parse(JSON.stringify(0));
    // Iniciar el cronómetro al cargar el componente
    this.interval2 = setInterval(() => {
      this.tiempo2++;
      if (this.tiempo2 >= 130) {
        this.tiempo2 = JSON.parse(JSON.stringify(0));
        if (this.websocketService.isConnected()) {
          this.cambiarEstadoHeartbeat2(estadosConectores.conectando, estadosConectores.colorConectando);
        } else {
          this.conectaWebSocket();
          this.cambiarEstadoHeartbeat2(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
        }
      }
    }, 1000);
  }

  interval3: any;
  reiniciarTemporizadorHeartbeat2(): void {
    if (this.interval3) {
      clearInterval(this.interval3);
    }
    this.tiempo3 = JSON.parse(JSON.stringify(0));
    // Iniciar el cronómetro al cargar el componente
    this.interval3 = setInterval(() => {
      this.tiempo3++;
      if (this.tiempo3 >= 130) {
        this.tiempo3 = JSON.parse(JSON.stringify(0));
        if (this.websocketService.isConnected()) {
          this.cambiarEstadoHeartbeat3(estadosConectores.conectando, estadosConectores.colorConectando);
        } else {
          this.conectaWebSocket();
          this.cambiarEstadoHeartbeat3(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
        }
      }
    }, 1000);
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
        this.cambiarEstadoHeartbeat2(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
        this.cambiarEstadoHeartbeat3(estadosConectores.sinConexion, estadosConectores.colorSinConexion);
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


  estadoElectrolinera(estados, id) {
    if (estados.length > 0 && estados.length < 3) {
      if (id == 1) {        
        this.statusElectrolinera0 = this.comparaEstados(estados[0].lastState, estados[1].lastState);
        if (estados[0].lastState == estadosConectores.cargando || estados[1].lastState == estadosConectores.cargando) {
          this.puertoCargando1 = true;
          this.estadoHeartbeat = { estado: estadosConectores.enLinea, severity: estadosConectores.colorEnLinea }
        } else {
          this.puertoCargando1 = false;
        }
        this.comparaEstados(estados[0], estados[1]);
      }
      if (id == 2) {
        this.statusElectrolinera1 = this.comparaEstados(estados[0].lastState, estados[1].lastState);
        if (estados[0].lastState == estadosConectores.cargando || estados[1].lastState == estadosConectores.cargando) {
          this.puertoCargando2 = true;
          this.estadoHeartbeat2 = { estado: estadosConectores.enLinea, severity: estadosConectores.colorEnLinea }
        } else {
          this.puertoCargando2 = false;
        }
      }
      if (id == 3) {
        this.statusElectrolinera2 = this.comparaEstados(estados[0].lastState, estados[1].lastState);
        if (estados[0].lastState == estadosConectores.cargando || estados[1].lastState == estadosConectores.cargando) {
          this.puertoCargando3 = true;
          this.estadoHeartbeat3 = { estado: estadosConectores.enLinea, severity: estadosConectores.colorEnLinea }
        } else {
          this.puertoCargando3 = false;
        }
      }
    }
  }

  mapUsuarioEnConectores(posicion) {
    if (this.electricStations[posicion]){
      if (posicion == 0) {
      this.conectorStatus0 = this.conectorStatus0.map(conector => {
        var usuario = '';
        if (this.electricStations[posicion].clients.length > 0) {
          if (this.electricStations[posicion].clients.filter(cliente => cliente.connetorOcpp === conector.connector)[0]) {
            usuario = this.electricStations[posicion].clients.filter(cliente => cliente.connetorOcpp == conector.connector)[0].userName
          }
        }
        return { ...conector, userName: usuario };
      });
    }

    if (posicion == 1) {
      this.conectorStatus1 = this.conectorStatus1.map(conector => {
        var usuario = '';
        if (this.electricStations[posicion].clients.length > 0) {
          if (this.electricStations[posicion].clients.filter(cliente => cliente.connetorOcpp === conector.connector)[0]) {
            usuario = this.electricStations[posicion].clients.filter(cliente => cliente.connetorOcpp == conector.connector)[0].userName
          }
        }
        return { ...conector, userName: usuario };
      });
    }

    if (posicion == 2) {
      this.conectorStatus2 = this.conectorStatus2.map(conector => {
        var usuario = '';
        if (this.electricStations[posicion].clients.length > 0) {
          if (this.electricStations[posicion].clients.filter(cliente => cliente.connetorOcpp === conector.connector)[0]) {
            usuario = this.electricStations[posicion].clients.filter(cliente => cliente.connetorOcpp == conector.connector)[0].userName
          }
        }
        return { ...conector, userName: usuario };
      });
    }
    }
    
  }

  onVerTodasElectrolineras(id) {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline, id]);
  }

  comparaEstados(estado1, estado2) {
    if (estado1 == estadosConectores.disponible || estado2 == estadosConectores.disponible) {
      return { estado: estadosConectores.disponible, severity: estadosConectores.colorEnLinea }
    } else {
      return { estado: estadosConectores.noDisponible, severity: estadosConectores.colorSinConexion }
    }
  }
}
