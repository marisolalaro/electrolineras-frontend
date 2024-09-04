import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
// librerias
import { switchMap } from 'rxjs/operators';
// import { Subscription } from 'rxjs';
// cores
import { DashboardModule } from './dashboard.module';
import { rutas } from 'src/app/core/constants/rutas';
import { mainTitles } from 'src/app/core/constants/labels';
// models
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { Subscription } from 'rxjs';

import { Message } from '@stomp/stompjs';

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
  // private subscription: Subscription;
  public electricStations: ElectricStationModel[] = [];

  public statusMessage: string = '';
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
  
  private websocketUrl = 'http://localhost:8051/websocket';
  public messages: { [channel: string]: any[] } = {};
  private subscriptions: Subscription[] = [];

  public heartbeat: any;
  public bootNotification: any[];

  constructor(
    private router: Router,
    private electricStationsService: ElectricStationsService,
    private websocketService: WebsocketService,
  ) { }

  ngOnDestroy() {
    // this.websocketService.closeAll();
    this.websocketService.disconnect();
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
  }
  
  ngOnInit() {
    this.getFourElectricStations();
    this.websocketService.initializeWebSocketConnection(this.websocketUrl);
    this.subscribeToChannel('/channel/authorize');
    this.subscribeToChannel('/channel/bootNotification');
    this.subscribeToChannel('/channel/heartbeat');
    // console.log(JSON.stringify(this.websocketService.getMessages('/channel/heartbeat')));
    
  }
  
  private subscribeToChannel(channel: string): void {
    const subscription = this.websocketService.getMessages(channel).subscribe(
      (messages:any) => {
        // this.messages[channel] = messages;
        if(channel == '/channel/heartbeat' && messages) {
          this.heartbeat = messages.map(item => JSON.parse(item))
          this.heartbeat = this.heartbeat[this.heartbeat.length - 1];
          console.log(this.heartbeat.sessionIndex);
          console.log(JSON.stringify(this.heartbeat));
          // aqui controlar si llega en ada 2 minutos
        }
        if(channel == '/channel/bootNotification') {
          this.bootNotification = messages
          console.log(this.bootNotification);
        }
        
      }
    );
    this.subscriptions.push(subscription);
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
