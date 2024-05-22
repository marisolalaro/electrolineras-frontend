import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ElectricStationsModule } from './electric-stations.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ElectricStationsService } from './services/electric-stations.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { labels, mainTitles } from 'src/app/core/constants/labels';
import { messages } from 'src/app/core/constants/messages';
import { catchError, of, tap } from 'rxjs';


import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { icon, Marker } from 'leaflet';
import { Inject, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { MessageService } from 'primeng/api';
// export const TITULO = 'Proyecto';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

@Component({
  standalone: true,
  selector: 'app-electric-stations',
  templateUrl: './electric-stations.component.html',
  imports: [ElectricStationsModule, NgFor, NgIf, PipesModule, NgxPaginationModule, ReactiveFormsModule, NgClass],
  styleUrls: ['./electric-stations.component.scss'],
  providers: [HelpersService, MessageService],
})
export default class ElectricStationsComponent implements OnInit {

  // variables de control
  public submitted: boolean = false;

  // variables Globales del Core
  public labelsGlobales = labels;
  public messagesGlobales = messages;

  // variables del paginador
  public page: number = 1;
  public itemsPerPage: number = 10;
  public titleProduct: any = mainTitles['electrolineras'];

  // variables del Mapa
  private map: any;
  public latitude: number;
  public longitude: number;

  // variables modal
  public crearModal = document.getElementById('crearModal')
  @ViewChild('childModal') public childModal: ElementRef;

  // variables propias del componente
  public electricStations: ElectricStationModel[] = [];
  public formRegistro: FormGroup = this.createFormGroup();
  public electricStation: ElectricStationModel = new ElectricStationModel();

  constructor(
    public electricStationsService: ElectricStationsService,
    private helpersService: HelpersService
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

  onSelecetedEdit(item) {
    // delete[item.activo];
    this.formRegistro.patchValue(item);
    // this.formRegistro = JSON.parse(JSON.stringify(item));
    // console.log(JSON.stringify(this.formRegistro));


    // var registro: ElectricStationModel = item;

    // this.electricStations = JSON.parse(JSON.stringify(item));
  }

  seleccionaSizeList(event) {
    this.itemsPerPage = event.target.value;
  }

  onVerMapa(item): void {
    this.electricStation = JSON.parse(JSON.stringify(item));
    if (this.map) { this.map = this.map.off(); this.map = this.map.remove(); }
    this.initMap(+this.electricStation.latitude, +this.electricStation.longitude)
  }

  onValidaFormulario() {
    this.submitted = true;
    if (this.formRegistro.valid) {
      if (this.electricStation.id) {
        this.onUpdateRegistro(this.electricStation.id);
      } else {
        this.onCreateRegistro();
      }
    }
  }

  onValidaFormularioEdit() {
    this.submitted = true;
    if (this.formRegistro.valid) {
        this.onUpdateRegistro(this.electricStation.id);
    }
  }

  private createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      nameStation: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
    });
  }

  onCreateRegistro() {
    var registro: ElectricStationModel = {
      ...this.formRegistro.value,
    };
    this.electricStationsService.create(registro)
      .pipe(
        tap(() => {
          // this.crearModal.addEventListener('hidden.bs.modal', event => {
          //   console.log("se cierra el modal");
          // })
          // this.childModal.nativeElement.click()
          this.helpersService.messageNotification('success', messages.successCreate);
          this.getAllElectricStations();
        }),
        catchError((err) =>
          of(
            'error',
            err.map((message: any) => {
              this.helpersService.messageNotification('error', message);
            })
          )
        )
      )
      .subscribe()
  }

  onUpdateRegistro(id: number) {

  }

  public initMap(latitude, longitude): void {
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
