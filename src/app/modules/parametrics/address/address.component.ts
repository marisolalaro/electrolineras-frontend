import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// cores
import { messages } from 'src/app/core/constants/messages';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { ValidaToken } from 'src/app/core/utils/verificarToken';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { buttons, parametricaAddress, titles, mainTitles } from 'src/app/core/constants/labels';
// primeNg
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
// moduls
import { AddressModule } from './address.module';
// modeles
import { Address } from 'src/app/core/model/address';
// services
import { AddressService } from './services/address.service';

@Component({
  standalone: true,
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  imports: [AddressModule, ReactiveFormsModule],
  providers: [
    ConfirmationService
  ],
})
export default class AddressComponent {

  // variables de control
  public previousState: boolean;
  public submitted: boolean = false;
  public loading: boolean = true;
  public serviceResponse: boolean = true;

  // variables propias del componente
  public addresses: Address[] = [];
  @ViewChild('dt1') dt!: Table;
  public address: Address = new Address();
  public mensaje: string = messages.noConexion;
  public formRegistro: FormGroup = this.createFormGroup();

  // variables Globales del Core
  public labelsGlobales = parametricaAddress;
  public titlesGlobales = titles;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;
  public componentTitle: any = mainTitles['direcciones'];

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
    private router: Router,
    public addressService: AddressService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    // TODO 
    if (ValidaToken()) {
      this.inicializaDatos()
      .then(datosInicializados => {
        if (datosInicializados) {
          this.getAllAddress()
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

  getAllAddress() {
    this.loading = true;
    this.addressService.getAll().subscribe(
      (resp: any) => {
        if (resp) {
          this.addresses = resp.data;
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

  selectedEdit(item: Address) {
    this.address = new Address();
    this.address = item;
    this.formRegistro.patchValue(JSON.parse(JSON.stringify(item)));
    this.actionDialog(true, 'edit')
  }

  confirmSwitchChange(event: any, item) {
    var texto = item.activo ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.activo;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `¿${texto} modelo ${item.modelCode} ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        item.activo = !this.previousState;
        // this.addressService.updateActivo(item.id, !item.activo).subscribe(
        //   (resp: any) => {
        //     this.getAllAddress();
        //   }
        // )
      },
      reject: () => {
        item.activo = !this.previousState;
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      city: new FormControl('', [Validators.required]),
      // country: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
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
    var registro: Address = {
      ...this.formRegistro.value,
    };
    registro.country = 'BOL';
    this.addressService.create(registro).subscribe(
      (resp: any) => {
        if (resp) {
          this.actionDialog(false, 'create');
          this.messageService.add({ severity: 'success', detail: messages.successCreate });
          this.getAllAddress();
        }
      }
    )
  }

  onUpdateRegistro() {
    this.address.city = this.formRegistro.get('city').value;
    this.address.district = this.formRegistro.get('district').value;
    this.addressService.update(this.address).subscribe(
      (resp: any) => {
        this.getAllAddress();
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
