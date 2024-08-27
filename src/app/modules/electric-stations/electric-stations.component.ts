import { Component, ViewChild, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// librerías
import 'leaflet-routing-machine';
import { Table } from 'primeng/table';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
// cores
import { Global } from 'src/app/core/variables/globales';
import { messages } from 'src/app/core/constants/messages';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { labels, mainTitles, buttons, titles } from 'src/app/core/constants/labels';
// modules
import { ElectricStationsModule } from './electric-stations.module';
// models
import { TasaCargaModel } from 'src/app/core/model/tasa-carga';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { PortConnectionModel } from 'src/app/core/model/port-connection';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
// services
import { PortConnectionService } from './services/port-connector.service';
import { ElectricStationsService } from './services/electric-stations.service';
import { ParTasaCargaService } from '../par-tasa-carga/service/par-tasa-carga.service';
import { Base64ToImageService } from '../../core/services/base-64-to-image.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  standalone: true,
  selector: 'app-electric-stations',
  templateUrl: './electric-stations.component.html',
  styleUrls: ['./electric-stations.component.scss'],
  providers: [
    MessageService, 
    ConfirmationService
  ],
  imports: [
    ElectricStationsModule, 
    NgFor, 
    NgIf, 
    PipesModule, 
    ReactiveFormsModule, 
    NgClass, 
    NgSwitch, 
    NgSwitchCase
  ],
})

export default class ElectricStationsComponent implements OnInit {

  // variables de control
  public previousState: boolean;
  public submitted: boolean = false;
  public mapaVisible: boolean = false;
  public esSuperAdmin: boolean = false;

  // variables Globales del Core
  public labelsGlobales = labels;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;
  public titlesGlobales = titles;

  // variables del paginador
  public page: number = 0;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables del Mapa
  public title: string;
  public latitude: number;
  public longitude: number;

  // variables dialog
  public dialogEdit: boolean = false;
  public dialogRegistro: boolean = false;
  public dialogConector: boolean = false;
  public dialogDetalleRegistro: boolean = false;

  // variables para el select
  public selectedCountry: any;
  public countries: any[] | undefined;
  public filteredCountries: any[] | undefined;

  // variables propias del componente
  @ViewChild('dt1') dt!: Table;
  public imagenQR: string | null = null;
  public tasasCarga: TasaCargaModel[] = [];
  public electricStations: ElectricStationModel[] = [];
  public formRegistro: FormGroup = this.createFormGroup();
  public componentTitle: any = mainTitles['electrolineras'];
  public formRegistroConector: FormGroup = this.createFormConector();
  public electricStation: ElectricStationModel = new ElectricStationModel();
  
  // variables para el filtro
  public nameStation: string = '';
  public direccion: string = '';
  public descripcion: string = '';
  public campoLatitude: string = '';
  public campoLongitude: string = '';
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  constructor(
    public global: Global,
    public tasaCargaService: ParTasaCargaService,
    public base64ImageService: Base64ToImageService,
    private confirmationService: ConfirmationService,
    public portConnectorService: PortConnectionService,
    public electricStationsService: ElectricStationsService,
  ) { }

  ngOnInit(): void {
    this.esSuperAdmin = this.global.getEsSuperAdmin();
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

  getAllElectricStations(): void {
    this.electricStationsService.getAll().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
        this.totalRecords = resp.data.totalRecords ? resp.data.totalRecords : this.electricStations.length;
      }
    )
  }

  getTasaDeCarga(): void {
    this.tasaCargaService.getAll().subscribe(
      (resp: any) => {
        this.countries = resp.data;
      }
    )
  }

  onSelecetedEdit(item) {
    this.electricStation = item;
    this.formRegistro.patchValue(item);
    this.selectedCountry = item.chargeRate;
    this.dialogEdit = true;
  }

  onDialogConnector(item) {
    this.electricStation = item;
    this.dialogConector = true;
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

  onValidaFormularioConector() {
    this.submitted = true;
    if (this.formRegistroConector.valid) {
      this.onCreatePuerto();
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

  private createFormConector() {
    return new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      maxAmperage: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      maxPower: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      maxVoltage: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
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
          this.getAllElectricStations();
          this.submitted = false;
        }),
        catchError((err) =>
          of(
            'error',
            err.map((message: any) => {
            })
          )
        )
      )
      .subscribe()
  }

  onCreatePuerto() {
    var registro: PortConnectionModel = {
      ...this.formRegistroConector.value,
    };
    registro.status = 1;
    registro.type = 'ELECTRICO';
    registro.chargingStation = this.electricStation.id;
    this.portConnectorService.create(registro)
      .pipe(
        tap(() => {
          this.openDialog(false, false, 'conector');
          this.getAllElectricStations();
          this.submitted = false;
        }),
        catchError((err) =>
          of(
            'error',
            err.map((message: any) => {
            })
          )
        )
      ).subscribe()
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
          this.getAllElectricStations();
          this.submitted = false;
        }),
        catchError((err) =>
          of(
            'error',
            err.map((message: any) => {
            })
          )
        )
      ).subscribe()
  }

  onOpenDetail(electricStation) {
    this.electricStation = electricStation;
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    this.getAllElectricStations();
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page;
    this.bodyFilter.size = event.rows;
    this.getAllElectricStations();
  }

  onVerMapa(rowData) {
    this.mapaVisible = true;
    this.latitude = parseFloat(rowData.latitude);
    this.longitude = parseFloat(rowData.longitude);
  }

  openDialog(state: any, stateSubmitted?: any, tipo?: any) {
    if (tipo == 'crear') {
      this.dialogRegistro = state;
      this.formRegistro.reset();
    }
    if (tipo == 'conector') {
      this.dialogConector = state;
    }
    if (tipo == 'editar') {
      this.dialogEdit = state;
    }
    if (tipo == 'detalle') {
      this.dialogDetalleRegistro = state;
    }
    this.submitted = stateSubmitted;
  }

  cerrarMapa(event) {
    this.mapaVisible = false
  }

  customSort(event) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      return event.order * result;
    });
  }

  confirm(event: any, item) {
    var texto = item.enabled ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.enabled;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `¿${texto} la electrolinera ${item.nameStation}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        if (item.enabled) {
          this.electricStationsService.enabledCustomer(item.id).subscribe(
            (resp: any) => {
              this.getAllElectricStations();
            }
          )
        } else {
          this.electricStationsService.disabledCustomer(item.id).subscribe(
            (resp: any) => {
              this.getAllElectricStations();
            }
          )
        }
      },
      reject: () => {
        item.enabled = !this.previousState;
      }
    });
  }

  onDialogDetalles(electrolinera) {
    this.getOneElectricStation(electrolinera.id)
    .then( datosElectrolinera=>{
      if (datosElectrolinera) {
        this.selectedCountry = this.electricStation.chargeRate;
        this.dialogDetalleRegistro = true;
      }
    })
  }

  getOneElectricStation(idElectricStation) {
    return new Promise((resolve) => {
    this.electricStationsService.getOne(idElectricStation).subscribe(
      (resp: any) => {
        this.electricStation = resp.data;
        this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
      }
    )
    resolve(true);
    });
  }

  clearFilters(table: Table) {
    table.clear();
    table.clearFilterValues();
    this.bodyFilter = new BodyFilterModel(
      this.page,
      this.itemsPerPage,
      decodeLocal().user.roles[0].id,
      decodeLocal().user.id
    );
    this.nameStation = '';
    this.direccion = '';
    this.descripcion = '';
    this.campoLatitude = '';
    this.campoLongitude = '';
  }
  
}
