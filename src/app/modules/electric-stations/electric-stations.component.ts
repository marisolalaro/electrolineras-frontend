import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ViewChild,OnInit } from '@angular/core';
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
import { DBAttributeName } from 'src/app/core/constants/dbAttributeName';

@Component({
  standalone: true,
  selector: 'app-electric-stations',
  templateUrl: './electric-stations.component.html',
  imports: [ElectricStationsModule, NgFor, NgIf, PipesModule, NgxPaginationModule, ReactiveFormsModule, NgClass, NgSwitch, NgSwitchCase],
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
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables del Mapa
  public latitude: number;
  public longitude: number;

  // variables dialog
  public visible: boolean = false;

  // variables propias del componente
  public cols: any[] = [];
  public electricStations: ElectricStationModel[] = [];
  public titleProduct: any = mainTitles['electrolineras'];
  public formRegistro: FormGroup = this.createFormGroup();
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  @ViewChild('dt1') dt!: Table;

  constructor(
    public electricStationsService: ElectricStationsService,
    private helpersService: HelpersService
  ) { }

  ngOnInit():void {
    this.inicializaDatos()
    this.getAllElectricStations();
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

  onSelecetedEdit(item) {
    this.formRegistro.patchValue(item);
  }

  //
  seleccionaSizeList(event) {
    this.itemsPerPage = event.target.value;
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

  onOpenDetail(electricStation) {
    this.electricStation = electricStation;
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 1;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    // TODO cambiar a los nombres de la base de datos
    if (field == 'nameStation') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribName;
    }
    if (field == 'direccion') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribLastName;
    }
    if (field == 'descripcion') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribMotherLastName;
    }
    this.bodyFilter.search.value = value;
    this.getAllElectricStations();
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page + 1;
    this.bodyFilter.size = event.rows;
    this.getAllElectricStations();
  }

  onVerMapa(rowData) {
    this.visible = true;
  }
}
