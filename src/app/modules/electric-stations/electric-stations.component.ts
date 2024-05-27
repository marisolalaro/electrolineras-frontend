import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ElectricStationsModule } from './electric-stations.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ElectricStationsService } from './services/electric-stations.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { labels, mainTitles } from 'src/app/core/constants/labels';
import { messages } from 'src/app/core/constants/messages';
import { catchError, of, tap } from 'rxjs';


import { HelpersService } from 'src/app/core/services/helpers.service';
import { MessageService } from 'primeng/api';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { Table } from 'primeng/table';

import { buttons } from 'src/app/core/constants/labels';
import { ParTasaCargaService } from '../par-tasa-carga/service/par-tasa-carga.service';
import { TasaCargaModel } from 'src/app/core/model/tasa-carga';
import * as Leaflet from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Input } from '@angular/core';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-electric-stations',
  standalone: true,
  templateUrl: './electric-stations.component.html',
  styleUrls: ['./electric-stations.component.scss'],
  imports: [ ElectricStationsModule, NgFor, NgIf, PipesModule, ReactiveFormsModule, NgClass, NgSwitch, NgSwitchCase],
  providers: [HelpersService, MessageService],
})
export default class ElectricStationsComponent implements OnInit  {

  // variables de control
  public submitted: boolean = false;

  // variables Globales del Core
  public labelsGlobales = labels;
  public messagesGlobales = messages;
  public botonesGlobales = buttons;

  // variables del paginador
  public page: number = 1;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables del Mapa
  public latitude: number;
  public longitude: number;
  public title: string;

  // variables dialog
  public visible: boolean = false;
  public dialogRegistro: boolean = false;
  public dialogEdit: boolean = false;

  // variables propias del componente
  public cols: any[] = [];
  public electricStations: ElectricStationModel[] = [];
  public titleProduct: any = mainTitles['electrolineras'];
  public formRegistro: FormGroup = this.createFormGroup();
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  public tasasCarga: TasaCargaModel[] = [];
  @ViewChild('dt1') dt!: Table;

  constructor(
    public electricStationsService: ElectricStationsService,
    private helpersService: HelpersService,
    public tasaCargaService: ParTasaCargaService,
  ) { }

  countries: any[] | undefined;

  selectedCountry: any;

  filteredCountries: any[] | undefined;


  filterCountry(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.countries as any[]).length; i++) {
      let country = (this.countries as any[])[i];
      if (country.amount.indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.filteredCountries = filtered;
  }

  ngOnInit(): void {
    this.inicializaDatos();
    this.getAllElectricStations();
    this.getTasaDeCarga();
  }

  inicializaDatos() {
    this.cols = [
      { field: 'nameStation', header: 'Nombre' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'descripcion', header: 'Descripcón' },
      { field: '', header: 'Opciones' },
    ];
  }

  getAllElectricStations(): void {
    this.electricStationsService.getAll().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
        this.totalRecords = resp.data.totalRecords;
      }
    )
  }

  getTasaDeCarga(): void {
    this.tasaCargaService.getAll().subscribe(
      (resp: any) => {
        this.countries = resp.data;
        // this.tasasCarga = resp.data;
      }
    )
  }

  onSelecetedEdit(item) {
    this.formRegistro.patchValue(item);
    this.selectedCountry = item.chargeRate
    this.dialogEdit = true;
  }

  seleccionaSizeList(event) {
    this.itemsPerPage = event.target.value;
  }

  onValidaFormulario() {
    this.submitted = true;
    if (this.formRegistro.valid) {
      if (this.electricStation.id) {
        this.onUpdateRegistro();
      } else {
        this.onCreateRegistro();
      }
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
      chargeRate: new FormControl('', [Validators.required]),
      codeStationQr: new FormControl('', [Validators.required]),
    });
  }

  onCreateRegistro() {
    var registro: ElectricStationModel = {
      ...this.formRegistro.value,
    };
    registro.chargeRate = {
      id: this.selectedCountry.id
    };
    registro.activo = true;
    this.electricStationsService.create(registro)
      .pipe(
        tap(() => {
          this.openDialog(false, false, 'crear');
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

  onUpdateRegistro() {
    var registro: ElectricStationModel = {
      ...this.formRegistro.value,
    };
    registro.chargeRate = {
      id: this.selectedCountry.id
    };
    registro.activo = true;
    this.electricStationsService.update(registro)
      .pipe(
        tap(() => {
          this.helpersService.messageNotification('success', messages.successCreate);
          this.getAllElectricStations();
          this.dialogEdit = false;
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

  onOpenDetail(electricStation) {
    this.electricStation = electricStation;
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 1;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    this.getAllElectricStations();
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page + 1;
    this.bodyFilter.size = event.rows;
    this.getAllElectricStations();
  }

  onVerMapa(rowData) {
    this.visible = true;
    this.latitude=-16.504334;
    this.longitude=-68.130453;
    this.title = "vivi";
  }

  public openDialog(state: any, stateSubmitted?: any, tipo?: any) {
    tipo == 'crear' ? this.dialogRegistro = state : this.dialogEdit = state;
    this.submitted = stateSubmitted;
  }

  cerrarMapa(evet) {
    this.visible = false
  }
}
