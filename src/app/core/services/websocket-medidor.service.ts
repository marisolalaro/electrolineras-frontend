import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Observable, Subject, BehaviorSubject, of} from 'rxjs';
import { Client, Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketMedidorService {
  private stompClient: Client;
  private meterValuesSubject: Subject<any> = new Subject<any>();

  constructor() { }

  initializeWebSocketConnection(websocketUrl) {
    const socket = new SockJS(websocketUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });
    this.stompClient.onConnect = (frame) => {
      // Suscribirse al canal
      this.stompClient.subscribe('/channel/meterValues', message => {
        const body = JSON.parse(message.body);
        this.meterValuesSubject.next(body);
      });
      return of({ resp: 'conectado' });
    };
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      return of({ resp: 'no-conectado' });
    };
    this.stompClient.activate();
  }

  // Método para recibir los mensajes
  getMeterValues(): Observable<any> {
    return this.meterValuesSubject.asObservable();
  }

  isConnected(): boolean {
    return this.stompClient && this.stompClient.connected;
  }
  
  // Método para desconectar el WebSocket
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
