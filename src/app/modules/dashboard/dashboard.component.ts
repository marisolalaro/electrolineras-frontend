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
import { VerificaTiempoService } from 'src/app/core/services/verifica-tiempo.service';

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
  public statusMessage: string = '';
  private subscription: Subscription; // Para el cronómetro
  private maxHeartbeatTime = 100000; // 100 segundos en milisegundos
  private reconnectionInterval = 10000; // 10 segundos en milisegundos
  public estadoHeartbeat = 'Conectando...';
  private subscriptions: Subscription[] = [];
  private heartbeatTimerSubscription: Subscription; // Para manejar el temporizador del heartbeat
  private reconnectionCheckSubscription: Subscription; // Temporizador para la verificación de reconexión
  private websocketUrl = EndPoins.apiUrlOcpp + EndPoins.websocket;

  constructor(
    private router: Router,
    private electricStationsService: ElectricStationsService,
    private websocketService: WebsocketService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.heartbeatTimerSubscription) {
      this.heartbeatTimerSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.getFourElectricStations();
    this.conectaWebSocket();
    this.escucharHeartbeat();
  }

  // Escuchar cuando llega el primer heartbeat
  escucharHeartbeat(): void {
    const heartbeat$ = this.websocketService.heartbeatReceived$;
    const heartbeatSubscription = heartbeat$.subscribe(() => {
      this.cambiarEstadoHeartbeat('En línea');
      this.reiniciarTemporizadorHeartbeat();
    });
    this.subscriptions.push(heartbeatSubscription);
  }

  // Cambiar el estado del heartbeat
  cambiarEstadoHeartbeat(estado: string): void {
    this.estadoHeartbeat = estado;
    // Si el estado es "Offline", comenzar a verificar la reconexión cada 10 segundos
    if (estado === 'Offline') {
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
      if (this.websocketService.isConnected()) { // Supongamos que tienes una función para verificar el estado
        this.cambiarEstadoHeartbeat('En línea');
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

  getFourElectricStations(): void {
    this.electricStationsService.getForDashboard().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
      }
    )
  }

  onVerTodasElectrolineras(id) {
    this.router.navigate(['/' + rutas.rutaPrincipal + '/' + rutas.rutaElectrolinerasOnline, id]);
  }

}
