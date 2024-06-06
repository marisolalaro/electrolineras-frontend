import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// librerias
import 'leaflet-routing-machine';
import { Table } from 'primeng/table';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
// cores
import { messages } from 'src/app/core/constants/messages';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { labels, mainTitles, buttons, titles } from 'src/app/core/constants/labels';
// modules
import { ElectricStationsModule } from './electric-stations.module';
// models
import { TasaCargaModel } from 'src/app/core/model/tasa-carga';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
import { HelpersService } from 'src/app/core/services/helpers.service';
import { ElectricStationsService } from './services/electric-stations.service';
import { ParTasaCargaService } from '../par-tasa-carga/service/par-tasa-carga.service';

// import * as Leaflet from 'leaflet';
// import * as L from 'leaflet';
// import { Input } from '@angular/core';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  standalone: true,
  selector: 'app-electric-stations',
  templateUrl: './electric-stations.component.html',
  styleUrls: ['./electric-stations.component.scss'],
  providers: [HelpersService, MessageService],
  imports: [ElectricStationsModule, NgFor, NgIf, PipesModule, ReactiveFormsModule, NgClass, NgSwitch, NgSwitchCase],
})
export default class ElectricStationsComponent implements OnInit {

  // variables de control
  public submitted: boolean = false;
  public mapaVisible: boolean = false;

  // variables Globales del Core
  public labelsGlobales = labels;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;
  public titlesGlobales = titles;

  // variables del paginador
  public page: number = 1;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables del Mapa
  public title: string;
  public latitude: number;
  public longitude: number;

  // variables dialog
  public dialogEdit: boolean = false;
  public dialogRegistro: boolean = false;

  // variables para el select
  public selectedCountry: any;
  public countries: any[] | undefined;
  public filteredCountries: any[] | undefined;

  // variables propias del componente
  public cols: any[] = [];
  @ViewChild('dt1') dt!: Table;
  public tasasCarga: TasaCargaModel[] = [];
  public electricStations: ElectricStationModel[] = [];
  public titleProduct: any = mainTitles['electrolineras'];
  public formRegistro: FormGroup = this.createFormGroup();
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  constructor(
    private helpersService: HelpersService,
    public tasaCargaService: ParTasaCargaService,
    public electricStationsService: ElectricStationsService,
  ) { }

  ngOnInit(): void {
    this.inicializaDatos();
    this.getAllElectricStations();
    this.getTasaDeCarga();
  }

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

  inicializaDatos() {
    this.cols = [
      { field: 'nameStation', header: 'Nombre' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'descripcion', header: 'Descripcón' },
      { field: 'latitude', header: 'Latitud' },
      { field: 'longitude', header: 'Longitud' },
      { field: '', header: 'Opciones' }
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
    this.electricStation = item;
    this.formRegistro.patchValue(item);
    this.selectedCountry = item.chargeRate;
    this.dialogEdit = true;
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
      id: new FormControl(''),
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
          this.openDialog(false, false, 'edit');
          this.helpersService.messageNotification('success', messages.successUpdate);
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
    this.mapaVisible = true;
    this.latitude = parseFloat(rowData.latitude);
    this.longitude = parseFloat(rowData.longitude);
    // this.title = rowData.nameStation; // O cualquier otro título relevante
  }

  openDialog(state: any, stateSubmitted?: any, tipo?: any) {
    if (tipo == 'crear') {
      this.dialogRegistro = state;
      this.formRegistro.reset();
    } else {
      this.dialogEdit = state;
    }
    this.submitted = stateSubmitted;
  }

  cerrarMapa(evet) {
    this.mapaVisible = false
  }
}
