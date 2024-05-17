import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ElectricStationsModule } from './electric-stations.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ElectricStationsService } from './services/electric-stations.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { mainTitles } from 'src/app/core/constants/labels';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { icon, Marker } from 'leaflet';
import { Inject, Input, OnInit } from '@angular/core';

// export const TITULO = 'Proyecto';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

@Component({
  selector: 'app-electric-stations',
  standalone: true,
  templateUrl: './electric-stations.component.html',
  imports: [ElectricStationsModule, NgFor, PipesModule, NgxPaginationModule],
  styleUrls: ['./electric-stations.component.scss']
})
export default class ElectricStationsComponent implements OnInit {

  public page: number = 1;
  public itemsPerPage: number = 10;
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public electricStations: ElectricStationModel[] = [];
  public titleProduct: any = mainTitles['electrolineras'];

  public latitude: number;
  public longitude: number;

  private map: any;
  // @Input() lat: number = -16.499273;
  // @Input() lon: number = -68.133352;
  // @Input() titulo: string = TITULO;

  constructor(
    public electricStationsService: ElectricStationsService,
  ) { }

  ngOnInit() {
    // this.initMap();
    this.getAllElectricStations();
  }

  getAllElectricStations(): void {
    this.electricStationsService.getAll().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
      }
    )
  }

  onSelecetedItem(item): void {
    this.electricStations = JSON.parse(JSON.stringify(item));
  }

  seleccionaSizeList(event) {
    this.itemsPerPage = event.target.value;
  }

  onVerMapa(item): void {
    this.electricStation = JSON.parse(JSON.stringify(item));
    if (this.map) { this.map = this.map.off(); this.map = this.map.remove(); }
    this.initMap(+this.electricStation.latitude, +this.electricStation.longitude)
    // this.map.remove();
  }
  
  public initMap( latitude, longitude): void {
    //configuración del mapa
    this.map = L.map('map', {
      center: [latitude, longitude],
      attributionControl: false,
      zoom: 17
    });

    //iconos personalizados
    var iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41], // Tamaño de tu icono
      iconAnchor: [12, 41], // Punto de anclaje del icono
      popupAnchor: [1, -34], // Punto de anclaje del popup
      shadowSize: [41, 41], // Tamaño de la sombra
      tooltipAnchor: [16, -28],
    });

    L.Marker.prototype.options.icon = iconDefault;

    //titulo
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://1938.com.es">Web Inteligencia Artificial</a>'
    });
    tiles.addTo(this.map);

    //marca con pop up
    const mark = L.marker([latitude, longitude]).bindPopup('');
    mark.addTo(this.map);
  }

}
