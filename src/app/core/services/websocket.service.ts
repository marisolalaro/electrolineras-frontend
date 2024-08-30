import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private sockets: { [key: string]: WebSocket } = {};

  constructor() { }

  public connect(url: string, onMessage: (data: any) => void): void {
    if (!this.sockets[url]) {
      const socket = new WebSocket(url);
      this.sockets[url] = socket;

      socket.onopen = () => {
        // console.log(`WebSocket connection opened to ${url}`);
      };

      socket.onmessage = (event) => {
        // console.log(`Message received from server on ${url}: ${event.data}`);
        onMessage(event.data);
      };

      socket.onerror = (error) => {
        console.error(`WebSocket error on ${url}: ${(error as any).message}`);
      };

      socket.onclose = (event) => {
        // console.log(`WebSocket connection closed on ${url}: ${event.reason}`);
        delete this.sockets[url];
      };
    }
  }

  public close(url: string): void {
    if (this.sockets[url]) {
      this.sockets[url].close();
      delete this.sockets[url];
    }
  }

  public closeAll(): void {
    for (const url in this.sockets) {
      this.sockets[url].close();
      delete this.sockets[url];
    }
  }
}
