import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
const SockJS = require('sockjs-client');
import { BehaviorSubject, of , Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  private stompClient: Client;
  private messagesSubject: { [channel: string]: BehaviorSubject<any[]> } = {};
  private timeTracker: { [channel: string]: number } = {};
  public heartbeatReceived$ = new Subject<boolean>(); 

  constructor() { }

  initializeWebSocketConnection(url: string) {
    const socket = new SockJS(url);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Reconectar en 5 segundos si se pierde la conexión
    });
    this.stompClient.onConnect = (frame) => {
      this.subscribeToChannel('/channel/authorize');
      this.subscribeToChannel('/channel/bootNotification');
      this.subscribeToChannel('/channel/dataTransfer');
      this.subscribeToChannel('/channel/heartbeat');
      this.subscribeToChannel('/channel/meterValues');
      this.subscribeToChannel('/channel/startTransaction');
      this.subscribeToChannel('/channel/statusNotification');
      this.subscribeToChannel('/channel/stopTransaction');
      return of({ resp: 'conectado' });
    };
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      return of({ resp: 'no-conectado' });
    };
    this.stompClient.activate();
  }

  private subscribeToChannel(channel: string): void {
    this.stompClient.subscribe(channel, (message: Message) => {
      if (channel === '/channel/heartbeat') {
        this.heartbeatReceived$.next(true);
      }
    });
  }

  sendHeartbeat(): void {
    // Registrar el tiempo de envío
    this.timeTracker['/channel/heartbeat'] = Date.now();
    
    // Enviar el mensaje (aquí puedes enviar tu mensaje de heartbeat)
    this.stompClient.publish({
      destination: '/channel/heartbeat',
      body: JSON.stringify({ /* Tu contenido */ }),
    });
  }

  getMessages(channel: string): BehaviorSubject<any[]> {
    if (!this.messagesSubject[channel]) {
      this.messagesSubject[channel] = new BehaviorSubject<any[]>([]);
    }
    return this.messagesSubject[channel];
  }

  isConnected(): boolean {
    return this.stompClient && this.stompClient.connected;
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
