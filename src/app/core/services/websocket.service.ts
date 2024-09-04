import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';
const SockJS = require('sockjs-client');
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  private stompClient: Client;
  private messagesSubject: { [channel: string]: BehaviorSubject<any[]> } = {};

  constructor() { }

  initializeWebSocketConnection(url: string): void {
    const socket = new SockJS(url);  // Aquí usamos la URL pasada como parámetro
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Reconectar en 5 segundos si se pierde la conexión
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);

      this.subscribeToChannel('/channel/authorize');
      this.subscribeToChannel('/channel/bootNotification');
      this.subscribeToChannel('/channel/dataTransfer');
      this.subscribeToChannel('/channel/heartbeat');
      this.subscribeToChannel('/channel/meterValues');
      this.subscribeToChannel('/channel/startTransaction');
      this.subscribeToChannel('/channel/statusNotification');
      this.subscribeToChannel('/channel/stopTransaction');

      // this.stompClient.subscribe('/channel/authorize', (message: Message) => {
      //   console.log('Authorize message received: ' + message.body);
      // });

      // this.stompClient.subscribe('/channel/bootNotification', (message: Message) => {
      //   console.log('BootNotification message received: ' + message.body);
      // });

      // this.stompClient.subscribe('/channel/dataTransfer', (message: Message) => {
      //   const data = JSON.parse(message.body);
      //   console.log('DataTransfer message received:');
      //   console.log('SessionIndex: ' + data.sessionIndex);
      //   console.log('DataTransferRequest: ', data.dataTransferRequest);
      //   console.log('DataTransferConfirmation: ', data.dataTransferConfirmation);
      // });

      // this.stompClient.subscribe('/channel/heartbeat', (message: Message) => {
      //   console.log('Heartbeat message received: ' + message.body);
      // });

      // this.stompClient.subscribe('/channel/meterValues', (message: Message) => {
      //   const data = JSON.parse(message.body);
      //   console.log('MeterValues message received:');
      //   console.log('SessionIndex: ' + data.sessionIndex);
      //   console.log('MeterValuesRequest: ', data.meterValuesRequest);
      //   console.log('MeterValuesConfirmation: ', data.meterValuesConfirmation);
      // });

      // this.stompClient.subscribe('/channel/startTransaction', (message: Message) => {
      //   console.log('StartTransaction message received: ' + message.body);
      // });

      // this.stompClient.subscribe('/channel/statusNotification', (message: Message) => {
      //   const data = JSON.parse(message.body);
      //   console.log('StatusNotification message received:');
      //   console.log('SessionIndex: ' + data.sessionIndex);
      //   console.log('StatusNotificationRequest: ', data.statusNotificationRequest);
      //   console.log('StatusNotificationConfirmation: ', data.statusNotificationConfirmation);
      // });

      // this.stompClient.subscribe('/channel/stopTransaction', (message: Message) => {
      //   console.log('StopTransaction message received: ' + message.body);
      // });

    };
    // ,(error) => {
    //   console.error('Error connecting to WebSocket:', error);
    // };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  private subscribeToChannel(channel: string): void {
    if (!this.messagesSubject[channel]) {
      this.messagesSubject[channel] = new BehaviorSubject<any[]>([]);
    }

    this.stompClient.subscribe(channel, (message: Message) => {
      console.log(`${channel} message received: ${message.body}`);
      const currentMessages = this.messagesSubject[channel].value;
      this.messagesSubject[channel].next([...currentMessages, message.body]);
    });
  }

 getMessages(channel: string): BehaviorSubject<any[]> {
    if (!this.messagesSubject[channel]) {
      this.messagesSubject[channel] = new BehaviorSubject<any[]>([]);
    }
    return this.messagesSubject[channel];
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('Disconnected');
    }
  }
}
