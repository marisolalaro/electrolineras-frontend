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
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { Heartbeat } from 'src/app/core/model/heartbeat';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';

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

  constructor(
    private router: Router,
    private websocketService: WebsocketService,
    private connectorStatusService: ConnectorStatusService,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.heartbeatTimerSubscription) {
      this.heartbeatTimerSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.getElectricStation();
    this.conectaWebSocket();
    this.escucharHeartbeat();
    this.getAllConnectorStatus(1);
    this.getAllConnectorStatus(2);
    this.getAllConnectorStatus(3);
  }

  // metodo ejecutar cada 10 segundos para poner directo offline 
  // veriicaConexionwbCada10segundos(){
  //   this.reconnectionCheckSubscription = interval(this.reconnectionInterval).subscribe(() => {
  //     if (this.websocketService.isConnected()) {
  //       this.cambiarEstadoHeartbeat('Conectando...');
  //     } else {
  //       // this.cambiarEstadoHeartbeat('Offline');
  //       this.cambiarEstadoHeartbeat('Offline');
  //       // this.conectaWebSocket();
  //       this.escucharHeartbeat()
  //     }
  //   });
  // }

  public heartbeatMessage: Heartbeat = new Heartbeat();
  public heartbeatMessage2: Heartbeat = new Heartbeat();
  public heartbeatMessage3: Heartbeat = new Heartbeat();
  private heartbeatSubscription: Subscription;
  public escucho: boolean = true;
  // Escuchar cuando llega el primer heartbeat

  escucharHeartbeat(): void {
    this.heartbeatSubscription = this.websocketService.heartbeatReceived$.subscribe((message: any) => {
      if (message) {
        this.escucho = true;
        this.heartbeatMessage = message.sessionIndex; // Almacenar el contenido del mensaje del heartbeat
        if (this.heartbeatMessage == this.electricStations[0].sessionIndex) {
          this.getElectricStation();
          this.cambiarEstadoHeartbeat('En línea'); // Cambiar el estado a 'En línea'
        }
        this.reiniciarTemporizadorHeartbeat();
      }
    });

    this.subscriptions.push(this.heartbeatSubscription);
  }



  // Cambiar el estado del heartbeat
  cambiarEstadoHeartbeat(estado: string): void {
    this.estadoHeartbeat = estado;
    // Si el estado es "Offline", comenzar a verificar la reconexión cada 10 segundos
    if (estado === 'Offline') {
      this.escucho = false;
      this.verificarReconexión();
    } else {
      // Detener la verificación de reconexión si ya está en línea
      this.detenerVerificacionReconexión();
    }
  }

  // Reiniciar el temporizador de heartbeat
  reiniciarTemporizadorHeartbeat(): void {
    // Cancelar el temporizador previo si está activo
    if (this.heartbeatTimerSubscription) {
      this.heartbeatTimerSubscription.unsubscribe();
    }
    // Reiniciar el temporizador, si no se recibe heartbeat en 100 segundos, cambia a Offline
    this.heartbeatTimerSubscription = interval(this.maxHeartbeatTime).subscribe(() => {
      this.cambiarEstadoHeartbeat('Offline');
    });
    this.subscriptions.push(this.heartbeatTimerSubscription);
  }

  // Verificar la reconexión cada 10 segundos
  verificarReconexión(): void {
    // Si ya hay un temporizador de verificación de reconexión corriendo, no iniciar otro
    if (this.reconnectionCheckSubscription) {
      return;
    }
    // Comenzar a verificar la reconexión cada 10 segundos
    this.reconnectionCheckSubscription = interval(this.reconnectionInterval).subscribe(() => {
      // TODO aqui solo verifica si manda heartberat
      if (this.websocketService.isConnected() && this.escucho) { // Supongamos que tienes una función para verificar el estado
        this.cambiarEstadoHeartbeat('En línea');
      } else {
        // this.cambiarEstadoHeartbeat('Offline');

        // this.conectaWebSocket();
        this.escucharHeartbeat()
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

  conectaWebSocket() {
    this.websocketService.initializeWebSocketConnection(this.websocketUrl);

    this.verificaConexionWebSocket = interval(this.maxHeartbeatTime).subscribe(() => {
      this.websocketService.isConnected() ? this.cambiarEstadoHeartbeat('Offline') : this.cambiarEstadoHeartbeat('Offline')
    });


  }

  // Iniciar cronómetro
  iniciarCronometro(): void {
    this.subscription = interval(1000).subscribe(() => {
      this.incrementarTiempo();
    });
  }

  // Incrementar tiempo cada segundo
  incrementarTiempo(): void {
    this.tiempo++;
  }

  getElectricStation(): void {
    // this.electricStationsService.getForDashboard().subscribe(
    this.electricStationsService.getAllnoCrud().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
        // aqui llamaria el servicio
      }
    )
  }

  getAllConnectorStatus(id) {
    this.connectorStatusService.getAllConnectorByIdElectricStation(id).subscribe((resp: any) => {
      if (id == 1) {
        this.conectorStatus0 = resp.data;
        this.estadoElectrolinera(this.conectorStatus0, id)
      }
      if (id == 2) {
        this.conectorStatus1 = resp.data;
        this.estadoElectrolinera(this.conectorStatus1, id)
      }
      if (id == 3) {
        this.conectorStatus2 = resp.data;
        this.estadoElectrolinera(this.conectorStatus2, id)
      }
    });
  }

  estadoElectrolinera(estados, id) {
    if (estados.length > 0 && estados.length < 3) {
      if (id == 1) {
        this.statusElectrolinera0 = this.comparaEstados(estados[0].lastState, estados[1].lastState);
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
    if (estado1 == "Available" && estado2 == "Available") {
      return "Available" 
    }
    if (estado1 == "Available" && estado2 == "Preparing") {
      return "Available"
    }
    if (estado1 == "Available" && estado2 == "Charging") {
      return "Available"
    }
    if (estado1 == "Available" && estado2 == "Finishing") {
      return "Available"
    }
    if (estado1 == "Available" && estado2 == "Unavailable") {
      return "Available"
    }
    if (estado1 == "Preparing " && estado2 == "Preparing ") {
      return "Unavailable"
    }
    if (estado1 == "Preparing " && estado2 == "Charging") {
      return "Unavailable"
    }
    if (estado1 == "Preparing " && estado2 == "Finishing") {
      return "Unavailable"
    }
    if (estado1 == "Preparing " && estado2 == "Unavailable") {
      return "Unavailable"
    }
    if (estado1 == "Charging " && estado2 == "Charging ") {
      return "Unavailable"
    }
    if (estado1 == "Charging " && estado2 == "Finishing") {
      return "Unavailable"
    }
    if (estado1 == "Charging " && estado2 == "Unavailable") {
      return "Unavailable"
    }
    if (estado1 == "Finishing " && estado2 == "Finishing ") {
      return "Unavailable"
    }
    if (estado1 == "Finishing " && estado2 == "Unavailable") {
      return "Unavailable"
    }
    if (estado1 == "Unavailable" && estado2 == "Unavailable") {
      return "Unavailable"
    }
  }
}
