import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketMedidorService {
  private stompClient: Client;
  private meterValuesSubject: Subject<any> = new Subject<any>();
  private connectorStatusSubject = new Subject<any>(); // Nuevo Subject para el nuevo canal
  private clientChargingSubject = new Subject<any>(); // Nuevo Subject para el nuevo canal

  constructor() { }

  initializeWebSocketConnection(websocketUrl) {
    const socket = new SockJS(websocketUrl);

    //   this.stompClient.debug = (msg: string) => {
    // };

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {

      if (this.stompClient.connected) {

        this.stompClient.subscribe(
          '/channel/meterValues', message => {
          const body = JSON.parse(message.body);
          this.meterValuesSubject.next(body);
        });

        this.stompClient.subscribe(
          '/channel/connectorStatusOcppByChargingStation',
          (message) => {
            const body = JSON.parse(message.body);
            this.connectorStatusSubject.next(body);
          });

        this.stompClient.subscribe(
          '/channel/clientChargingStation',
          (message) => {
            const body = JSON.parse(message.body);
            this.clientChargingSubject.next(body);
          });

      }
    };

    this.stompClient.onStompError = (frame) => {
      // return of({ resp: 'no-conectado' });
      console.error('STOMP Error:', frame);
    };
    this.stompClient.activate();
  }

  getMeterValues(): Observable<any> {
    return this.meterValuesSubject.asObservable();
  }

  getConnectorStatus(): Observable<any> {
    return this.connectorStatusSubject.asObservable();
  }

  getClientCharging(): Observable<any> {
    return this.clientChargingSubject.asObservable();
  }

  isConnected(): boolean {
    return this.stompClient && this.stompClient.connected;
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
