import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// cores
import { messages } from 'src/app/core/constants/messages';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { buttons, labels, titles, mainTitles } from 'src/app/core/constants/labels';
// primeNg
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
// moduls
import { TasaCargaModule } from './tasa-carga.module';
// modeles
import { TasaCargaModel } from 'src/app/core/model/tasa-carga';
// services
import { TasaCargaService } from './services/tasa-carga.service';
import { ParTasaCargaService } from '../../par-tasa-carga/service/par-tasa-carga.service';

import { DatePipe } from '@angular/common';
import { ValidaToken } from 'src/app/core/utils/verificarToken';

@Component({
  selector: 'app-tasa-carga',
  templateUrl: './tasa-carga.component.html',
  styleUrls: ['./tasa-carga.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    TasaCargaModule,
    ReactiveFormsModule
  ],
  providers: [
    ConfirmationService
  ],
})
export default class TasaCargaComponent {

  // variables de control
  public previousState: boolean;
  public submitted: boolean = false;
  public loading: boolean = true;
  public serviceResponse: boolean = true;

  // variables propias del componente
  public brands: TasaCargaModel[] = [];
  @ViewChild('dt1') dt!: Table;
  public tasaCarga: TasaCargaModel = new TasaCargaModel();
  public mensaje: string = messages.noConexion;
  public formRegistro: FormGroup = this.createFormGroup();

  // variables Globales del Core
  public labelsGlobales = labels;
  public titlesGlobales = titles;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;
  public componentTitle: any = mainTitles['tasaCarga'];

  // variables para el filtro
  public vendor: string = '';
  public estado: string = '';
  public modelCode: string = '';
  public boxSerialNumber: string = '';
  public pointModel: string = '';
  public pointSerialNumber: string = '';
  public firmwareVersion: string = '';
  public startTime: string = '';
  public endTime: string = '';

  // variables del paginador
  public page: number = 0;
  public totalRecords: number = 0;
  public itemsPerPage: number = 9999;
  public bodyFilter: BodyFilterModel;

  // variables de dialog
  public dialogEdit: boolean = false;
  public dialogRegistro: boolean = false;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private parTasaCargaService: ParTasaCargaService
  ) { }

  ngOnInit(): void {
    if (ValidaToken()) {
      this.inicializaDatos()
        .then(datosInicializados => {
          if (datosInicializados) {
            this.getAllModels()
          }
        })
    }
    else {
      this.router.navigate(['']);
    }
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.bodyFilter = new BodyFilterModel(this.page, this.itemsPerPage, 2, decodeLocal().user.id);
      resolve(true);
    })
  }

  getAllModels() {
    this.loading = true;
    this.parTasaCargaService.getAll().subscribe(
      (resp: any) => {
        if (resp) {
          this.brands = resp.data;
          this.totalRecords = resp.data.length;
          this.loading = false
        } else {
          this.loading = false
        }
        this.serviceResponse = true;
      }, err => {
        if (err.status == 404) {
            this.serviceResponse = false;
          } else {
            this.serviceResponse = true;
          }
          this.loading = false
      }
    )
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

  clearFilters(table: Table) {
    table.clear();
    table.clearFilterValues();
    this.bodyFilter = new BodyFilterModel(
      this.page,
      this.itemsPerPage,
      decodeLocal().user.roles[0].id,
      decodeLocal().user.id
    );
    this.vendor = '';
    this.modelCode = '';
    this.estado = '';
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
  }

  public tiempoFinal = '';
  public tiempoInicial = '';

  selectedEdit(item: TasaCargaModel) {
    this.tasaCarga = new TasaCargaModel();
    this.tasaCarga = item;
    this.tasaCarga.amount = this.extractNumeric(this.tasaCarga.amount);
    this.tasaCarga.tiempoInicial = this.datePipe.transform(this.tasaCarga.startTime, 'HH:mm:ss');
    this.tasaCarga.tiempoFinal = this.datePipe.transform(this.tasaCarga.endTime, 'HH:mm:ss');
    this.formRegistro.patchValue(JSON.parse(JSON.stringify(item)));
    this.actionDialog(true, 'edit')
  }

  extractNumeric(value: string): string {
    const match = value.match(/[\d,]+/); // Busca solo números y comas
    return match ? match[0] : ''; // Devuelve el número encontrado o una cadena vacía
  }

  confirmSwitchChange(event: any, item) {
    var texto = item.enabled ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.enabled;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `¿${texto} tasa de carga ${item.amount} Bs/Kw?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        item.enabled = !this.previousState;
        this.parTasaCargaService.cambiarEstado(item.id, item.enabled).subscribe(
          (resp: any) => {
            this.getAllModels();
          }
        )
      },
      reject: () => {
        item.enabled = !this.previousState;
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      amount: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      description: new FormControl('', [Validators.required]),
      minimumCurrent: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      maximumCurrent: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      tiempoInicial: new FormControl(null),
      tiempoFinal: new FormControl(null),
    });
  }

  onValidaFormulario() {
    this.submitted = true;
    if (this.formRegistro.valid) {
      if (this.formRegistro.get('id').value) {
        this.onUpdateRegistro();
      } else {
        this.onCreateRegistro();
      }
    }
  }

  onCreateRegistro() {
    var registro: TasaCargaModel = {
      ...this.formRegistro.value,
    };
    registro.activo = true
    registro.amount = registro.amount +' Bs/Kw.'    
    this.parTasaCargaService.create(registro).subscribe(
      (resp: any) => {
        if (resp) {
          this.actionDialog(false, 'create');
          this.messageService.add({ severity: 'success', detail: messages.successCreate });
          this.getAllModels();
        }
      }
    )
  }

  onUpdateRegistro() {
    this.tasaCarga.amount = this.formRegistro.get('amount').value;
    this.tasaCarga.startTime = (this.formRegistro.get('tiempoInicial').value).length == 8 ? this.convertToISO(this.formRegistro.get('tiempoInicial').value): this.formRegistro.get('tiempoInicial').value;
    this.tasaCarga.endTime = (this.formRegistro.get('tiempoFinal').value).length == 8 ? this.convertToISO(this.formRegistro.get('tiempoFinal').value): this.formRegistro.get('tiempoFinal').value;
    this.tasaCarga.minimumCurrent = this.formRegistro.get('minimumCurrent').value;
    this.tasaCarga.maximumCurrent = this.formRegistro.get('maximumCurrent').value;
    this.tasaCarga.description = this.formRegistro.get('description').value;
    this.tasaCarga.activo = true;

    this.tasaCarga.amount = this.tasaCarga.amount +' Bs/Kw.'
    this.parTasaCargaService.update(this.tasaCarga).subscribe(
      (resp: any) => {
        this.getAllModels();
        this.actionDialog(false, 'edit');
        this.messageService.add({ severity: 'success', detail: messages.successUpdate });
      }
    )
  }

  convertToISO(hora: string): string {
    const currentDate = new Date(); // Usa la fecha actual
    const year = 2024; // Puedes especificar el año si es fijo
    const month = 11; // Diciembre (recuerda que los meses son base 0 en JS)
    const day = 12; // Día del mes

    // Combina la fecha fija con la hora proporcionada
    const [hours, minutes, seconds] = hora.split(':').map(Number);
    const fecha = new Date(year, month, day, hours, minutes, seconds);

    // Formato completo con zona horaria y milisegundos
    return fecha.toISOString(); // Esto genera '2024-12-12T11:50:51.000Z'

    // Ajuste de zona horaria manual (-4:00)
    const timezoneOffsetMs = 4 * 60 * 60 * 1000; // -4 horas
    return new Date(fecha.getTime() - timezoneOffsetMs).toISOString();
  }

  actionDialog(status, tipo) {
    tipo == 'create' ? this.dialogRegistro = status : this.dialogEdit = status;
  }

  openDialogCreate() {
    this.formRegistro.reset();
    this.formRegistro = this.createFormGroup();
    this.actionDialog(true, 'create')
  }
}