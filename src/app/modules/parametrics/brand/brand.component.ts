import { Component, ViewChild } from '@angular/core';
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
import { BrandModule } from './brand.module';
// modeles
import { Model } from 'src/app/core/model/model';
// services
import { BrandService } from './services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
  standalone: true,
  imports: [
    BrandModule,
    ReactiveFormsModule
  ],
  providers: [
    ConfirmationService
  ],
})
export default class BrandComponent {

  // variables de control
  public previousState: boolean;
  public submitted: boolean = false;
  public loading: boolean = true;
  public serviceResponse: boolean = true;

  // variables propias del componente
  public brands: Model[] = [];
  @ViewChild('dt1') dt!: Table;
  public model: Model = new Model();
  public mensaje: string = messages.noConexion;
  public formRegistro: FormGroup = this.createFormGroup();

  // variables Globales del Core
  public labelsGlobales = labels;
  public titlesGlobales = titles;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;
  public componentTitle: any = mainTitles['modelos'];

  // variables para el filtro
  public vendor: string = '';
  public estado: string = '';
  public modelCode: string = '';
  public boxSerialNumber: string = '';
  public pointModel: string = '';
  public pointSerialNumber: string = '';
  public firmwareVersion: string = '';

  // variables del paginador
  public page: number = 0;
  public totalRecords: number = 0;
  public itemsPerPage: number = 9999;
  public bodyFilter: BodyFilterModel;

  // variables de dialog
  public dialogEdit: boolean = false;
  public dialogRegistro: boolean = false;

  constructor(
    public brandservice: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.inicializaDatos()
      .then(datosInicializados => {
        if (datosInicializados) {
          this.getAllModels()
        }
      })
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.bodyFilter = new BodyFilterModel(this.page, this.itemsPerPage, 2, decodeLocal().user.id);
      resolve(true);
    })
  }

  getAllModels() {
    this.loading = true;
    this.brandservice.getAll().subscribe(
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
        this.loading = false
        this.serviceResponse = false;
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

  selectedEdit(item: Model) {
    this.model = new Model();
    this.model = item;
    this.formRegistro.patchValue(JSON.parse(JSON.stringify(item)));
    this.actionDialog(true, 'edit')
  }

  confirmSwitchChange(event: any, item) {
    var texto = item.activo ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.activo;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `¿${texto} modelo ${item.modelCode} ?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        item.activo = !this.previousState;
        this.brandservice.updateActivo(item.id, !item.activo).subscribe(
          (resp: any) => {
            this.getAllModels();
          }
        )
      },
      reject: () => {
        item.activo = !this.previousState;
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      vendor: new FormControl('', [Validators.required]),
      modelCode: new FormControl('', [Validators.required]),
      boxSerialNumber: new FormControl('', [Validators.required]),
      pointModel: new FormControl('', [Validators.required]),
      pointSerialNumber: new FormControl('', [Validators.required]),
      firmwareVersion: new FormControl('', [Validators.required]),
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
    var registro: Model = {
      ...this.formRegistro.value,
    };
    this.brandservice.create(registro).subscribe(
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
    this.model.vendor = this.formRegistro.get('vendor').value;
    this.model.modelCode = this.formRegistro.get('modelCode').value;
    this.model.boxSerialNumber = this.formRegistro.get('boxSerialNumber').value;
    this.model.pointModel = this.formRegistro.get('pointModel').value;
    this.model.pointSerialNumber = this.formRegistro.get('pointSerialNumber').value;
    this.model.firmwareVersion = this.formRegistro.get('firmwareVersion').value;
    this.brandservice.update(this.model).subscribe(
      (resp: any) => {
        this.getAllModels();
        this.actionDialog(false, 'edit');
        this.messageService.add({ severity: 'success', detail: messages.successUpdate });
      }
    )
  }

  openDialogCreate() {
    this.formRegistro.reset();
    this.formRegistro = this.createFormGroup();
    this.actionDialog(true, 'create')
  }

  actionDialog(status, tipo) {
    tipo == 'create' ? this.dialogRegistro = status : this.dialogEdit = status;
  }

}