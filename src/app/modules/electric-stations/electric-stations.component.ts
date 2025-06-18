import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { BrandService } from '../parametrics/brand/services/brand.service';
import { ElectricStationsService } from './services/electric-stations.service';
import { AddressService } from '../parametrics/address/services/address.service';
import { ParTasaCargaService } from '../par-tasa-carga/service/par-tasa-carga.service';
import { Base64ToImageService } from '../../core/services/base-64-to-image.service';
import { ConnectorStatusModel } from 'src/app/core/model/charging-connector-status';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';
import { ModelElectricStation } from 'src/app/core/model/model-electric-station';
import { Address } from 'src/app/core/model/address';
import { ValidaToken } from 'src/app/core/utils/verificarToken';

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
    NgSwitchCase,
  ],
})

export default class ElectricStationsComponent implements OnInit {

  // variables de control
  public previousState: boolean;
  public loading: boolean = true;
  public submitted: boolean = false;
  public mapaVisible: boolean = false;
  public esSuperAdmin: boolean = false;
  public serviceResponse: boolean = true;

  // variables Globales del Core
  public titlesGlobales = titles;
  public labelsGlobales = labels;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;

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
  public selectedModel: any;
  public selectedAddress: any;
  public selectedTasaCarga: any;
  public selectedNombrePuerto: any;
  public models: any[] | undefined;
  public tasasCargaSelect: any[] | undefined;
  public nombresPuertosSelect: any[] | undefined;
  public filteredModels: any[] | undefined;
  public filteredAddresses: any[] | undefined;
  public filteredTasaCarga: any[] | undefined;
  public filteredNombrePuerto: any[] | undefined;

  // variables propias del componente
  @ViewChild('dt1') dt!: Table;
  public imagenQR: string | null = null;
  public tasasCarga: TasaCargaModel[] = [];
  public mensaje: string = messages.noConexion;
  public conectorStatus: ConnectorStatusModel[] = [];
  public electricStations: ElectricStationModel[] = [];
  public addresses: Address[] = [];
  public formRegistro: FormGroup = this.createFormGroup();
  public componentTitle: any = mainTitles['electrolineras'];
  public formRegistroConector: FormGroup = this.createFormConector();
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public electricStationConnectors: ElectricStationModel = new ElectricStationModel();

  // variables para el filtro
  public nameStation: string = '';
  public direccion: string = '';
  public descripcion: string = '';
  public campoLatitude: string = '';
  public campoLongitude: string = '';
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, 0, 0);

  constructor(
    public global: Global,
    private router: Router,
    public brandService: BrandService,
    public addressService: AddressService,
    public tasaCargaService: ParTasaCargaService,
    public base64ImageService: Base64ToImageService,
    private confirmationService: ConfirmationService,
    public portConnectorService: PortConnectionService,
    private connectorStatusService: ConnectorStatusService,
    public electricStationsService: ElectricStationsService,
  ) { }

  ngOnInit(): void {
    if (ValidaToken()) {
      this.inizializaDatos();
      this.esSuperAdmin = this.global.getEsSuperAdmin();
      this.nombresPuertosSelect = [
        {nombre: "CONECTOR DE CARGA 1"},{nombre: "CONECTOR DE CARGA 2"},
      ]
      this.getAllElectricStations();
    } else {
      this.router.navigate(['']);
    }
    
  }

  inizializaDatos() {
    this.bodyFilter = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);
  }

  getAllElectricStations(): void {
    this.loading = true;
    this.electricStationsService.getAll().subscribe(
      (resp: any) => {
        if (resp) {
          this.loading = false
          this.electricStations = resp.data;
          this.totalRecords = resp.data.totalRecords ? resp.data.totalRecords : this.electricStations.length;
        } else {
          this.loading = false
        }
        this.serviceResponse = true;
      }, err => {
        this.loading = false
        this.serviceResponse = false;
      }
    )
  }

  filterTasaCarga(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.tasasCargaSelect as any[]).length; i++) {
      let tasaCarga = (this.tasasCargaSelect as any[])[i];
      if (tasaCarga.amount.indexOf(query.toLowerCase()) == 0) {
        filtered.push(tasaCarga);
      }
    }
    this.filteredTasaCarga = filtered;
  }

  filterNombrePuerto(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.nombresPuertosSelect as any[]).length; i++) {
      let nombrePuerto = (this.nombresPuertosSelect as any[])[i];
      if (nombrePuerto.nombre.indexOf(query.toLowerCase()) == 0) {
        filtered.push(nombrePuerto);
      }
    }
    this.filteredNombrePuerto = filtered;
  }

  filterModel(event: AutoCompleteCompleteEvent) {
    // aqui poner servicio no disponoble
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.models as any[]).length; i++) {
      let model = (this.models as any[])[i];
      if (model.modelCode.indexOf(query.toLowerCase()) == 0) {
        filtered.push(model);
      }
    }
    this.filteredModels = filtered;
  }

  filterAddress(event: AutoCompleteCompleteEvent) {
    // aqui poner servicio no disponoble
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.addresses as any[]).length; i++) {
      let addres = (this.addresses as any[])[i];
      if (addres.district.indexOf(query.toLowerCase()) == 0) {
        filtered.push(addres);
      }
    }
    this.filteredAddresses = filtered;
  }

  onSelecetedEdit(item) {
    this.electricStation = item;
    this.formRegistro.patchValue(item);
    this.selectedTasaCarga = item.chargeRate;
    this.selectedModel = item.model;
    this.selectedAddress = item.address;
    this.dialogEdit = true;
    this.getTasaDeCarga();
    this.getModels();
    this.getAddress();
  }
  
  getTasaDeCarga(): void {
    this.tasaCargaService.getAll().subscribe(
      (resp: any) => {
        this.tasasCargaSelect = resp.data;
      }
    )
  }

  getModels(): void {
    this.brandService.getAllActives().subscribe(
      (resp: any) => {
        this.models = resp.data;
      }
    )
  }

  getAddress(): void {
    this.addressService.getAll().subscribe(
      (resp: any) => {
        this.addresses = resp.data;
      }
    )
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
      address: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
      chargeRate: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
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
    registro.chargeRate = this.selectedTasaCarga.id;
    registro.model= this.selectedModel.id;
    registro.address = this.selectedAddress.id;
    this.electricStationsService.create(registro).subscribe(
      (resp: any) => {
        this.openDialog(false, false, 'crear');
        this.getAllElectricStations();
        this.submitted = false;
      }, error => {
      }
    )
  }

  onCreatePuerto() {
    var registro: PortConnectionModel = {
      ...this.formRegistroConector.value,
    };
    registro.name = this.selectedNombrePuerto.nombre
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
    registro.chargeRate = this.selectedTasaCarga.id;
    registro.model = this.selectedModel.id
    registro.direccion = this.selectedAddress.district
    registro.address = this.selectedAddress.id;
    registro.activo = true;
    registro.enabled = true;
    this.electricStationsService.update(registro).subscribe(
      (resp: any) => {
        this.openDialog(false, false, 'editar');
        this.getAllElectricStations();
        this.submitted = false;
      }, error => {

      }
    )
  }

  onDialogDetalles(electrolinera) {
    this.electricStation = new ElectricStationModel();
    this.electricStation = electrolinera; // tiene los modelos
    this.getOneElectricStation(electrolinera.id)
      .then(datosElectrolinera => {
        if (datosElectrolinera) {
          this.selectedTasaCarga = this.electricStation.chargeRate;
          return true;
        }
      }).then((datosConector) => {
        if (datosConector) {
         
          return true;
        }
      }).then((datosMapeado) => {
        if (datosMapeado) {
          this.dialogDetalleRegistro = true;
          return true;
        }
      })
  }
  
  getOneElectricStation(idElectricStation) {
    return new Promise((resolve) => {
      this.electricStationsService.getOne(idElectricStation).subscribe(
        (resp: any) => {
          this.electricStationConnectors = resp.data;
          this.imagenQR = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
          this.getAllConnectorStatus();
          resolve(true);
        }, err => {
          resolve(false);
        }
      )
    });
  }

  getAllConnectorStatus() {
    return new Promise((resolve) => {
      this.connectorStatusService.getAllConnectorByIdElectricStation(this.electricStation.id).subscribe(
        (resp: any) => {
          this.conectorStatus = resp.data;
           this.statusEnElectrolinera();
          resolve(true);
        });
    });
  }

  statusEnElectrolinera() {
    this.electricStationConnectors.chargingConnectors.forEach(connectorA => {
      let connectorNumber = connectorA.name.match(/\d+/)[0];
      let correspondingConnectorB = this.conectorStatus.find(connectorB => connectorB.connector === connectorNumber);
      if (correspondingConnectorB) {
        connectorA.lastState = correspondingConnectorB.lastState;
      }
    });
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
      header: 'Confirmación',
      acceptLabel: 'Sí',
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
