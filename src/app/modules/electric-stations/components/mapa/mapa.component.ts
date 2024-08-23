import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit, OnChanges {

  private map: any;
  private marker: L.Marker;
  @Input() lat: number ;
  @Input() lon: number  ;
  @Input() titulo: string ;
  @Output() newItemEvent = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    if (this.map) { 
      this.map = this.map.off(); 
      this.map = this.map.remove(); 
    }
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lat'] || changes['lon']) {
      if (!this.map) {
        this.initMap();
      } else {
        this.updateMap();
      }
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      attributionControl: false,
      zoom: 17
    });
    var iconDefault = L.icon({
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://1938.com.es">Web Inteligencia Artificial</a>'
    });
    tiles.addTo(this.map);
    this.addMarkers();
  }

  private addMarkers(): void {
    if (this.marker) {
      this.map.removeLayer(this.marker); // Remover el marcador anterior
    }
    this.marker = L.marker([this.lat, this.lon]).bindPopup(this.titulo);
    this.marker.addTo(this.map);
  }

  private updateMap(): void {
    if (this.map) {
      this.map.setView(new L.LatLng(this.lat, this.lon), 14);
      this.addMarkers(); // Actualizar el marcador
    }
  }

  cerrar() {
    this.map = this.map.off(); this.map = this.map.remove();
    this.newItemEvent.emit(true);
  }
}
