import { Component, ViewChild } from '@angular/core';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// librerías
import { tap } from 'rxjs';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
// cores
import { messages } from 'src/app/core/constants/messages';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { buttons, labels, titles, mainTitles } from 'src/app/core/constants/labels';
// modules
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AdministratorsModule } from './administrators.module';
// models
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { AdministratorModel } from 'src/app/core/model/administrators';
// services
import { ConfirmationService } from 'primeng/api';
import { Global } from 'src/app/core/variables/globales';
import { AdministratorsService } from './services/administrators.service';

@Component({
  standalone: true,
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss'],
  providers: [
    ConfirmationService
  ],
  imports: [
    AdministratorsModule,
    PipesModule,
    ReactiveFormsModule,
    NgFor,
    NgClass,
    NgIf,
    NgSwitch,
    NgSwitchCase],
})
export default class AdministratorsComponent {

  // variables de control
  public previousState: boolean;
  public submitted: boolean = false;
  public esSuperAdmin: boolean = false;
  public loading: boolean = true;
  public serviceResponse: boolean = true;

  // variables de dialog
  public dialogEdit: boolean = false;
  public dialogRegistro: boolean = false;

  // variables Globales del Core
  public labelsGlobales = labels;
  public titlesGlobales = titles;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;
  public componentTitle: any = mainTitles['administradores'];

  // Variables Paginador
  public page: number = 0;
  public itemsPerPage: number = 9999;
  public totalRecords: number = 0;

  // variables para el filtro
  public username: string = '';
  public names: string = '';
  public lastName: string = '';
  public motherLastName: string = '';
  public electronicMail: string = '';
  public cellPhoneNumber: string = '';

  // variables propias del componente
  @ViewChild('dt1') dt!: Table;
  public userLogin: any;
  public mensaje: string = messages.noConexion;
  public administradors: AdministratorModel[] = [];
  public formRegistro: FormGroup = this.createFormGroup();
  public administrador: AdministratorModel = new AdministratorModel();
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, 2, decodeLocal().user.id);

  constructor(
    public global: Global,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public administratorsService: AdministratorsService,
  ) { }

  ngOnInit(): void {
    this.inicializaDatos()
    this.getAllAdministrations();
  }

  inicializaDatos() {
    this.esSuperAdmin = this.global.getEsSuperAdmin();
    this.userLogin = this.global.getUser();
  }

  getAllAdministrations() {
    this.loading = true;
    this.administratorsService.getAll(this.bodyFilter).subscribe(
      (resp: any) => {
        if (resp) {
          this.administradors = resp.data;
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

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      // names: new FormControl('', [Validators.required]),
      // lastName: new FormControl('', [Validators.required]),
      // motherLastName: new FormControl('', [Validators.required]),
      // identificationNumber: new FormControl('', [Validators.required]),
      // cellPhoneNumber: new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(7), Validators.pattern(/^[0-9]\d*$/)]),
      // birthdate: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      electronicMail: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.maxLength(8), Validators.minLength(7), Validators.pattern(/^[0-9]\d*$/)]),
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
    } else {

    }
  }

  openDialog(state: any, stateSubmitted?: any, tipo?: any) {
    tipo == 'crear' ? this.dialogRegistro = state : this.dialogEdit = state;
    this.submitted = stateSubmitted;
    this.formRegistro.reset();
    this.formRegistro = this.createFormGroup();
  }

  onSelecetedEdit(item: AdministratorModel) {    
    this.administrador = new AdministratorModel();
    this.administrador = item;
    this.formRegistro.patchValue(JSON.parse(JSON.stringify(item)));
    this.formRegistro.controls['username'].setValue(item.username);
    this.formRegistro.controls['phoneNumber'].setValue(item.phoneNumber);
    // this.formRegistro.controls['birthdate'].setValue(new Date(moment(item.birthdate).toString()));
    this.dialogEdit = true;
  }

  onCreateRegistro() {
    var registro: AdministratorModel = {
      ...this.formRegistro.value,
    };
    registro.activationCode = '';
    registro.idTypePhone = 1;
    registro.accountStatus = 1;
    registro.restoreCode = '';
    registro.activationMethod = 'email';
    registro.extension = '';
    registro.complement = '';
    registro.idTypeIdentification = 4;
    registro.roles = [2];
    registro.birthdate = moment(registro.birthdate).utc().format('YYYY-MM-DD');
    registro.username = this.formRegistro.get('username').value

    this.administratorsService.create(registro)
      .pipe(
        tap(() => {
          this.openDialog(false, false, 'crear');
          this.messageService.add({ severity: 'success', detail: messages.successCreate });
          this.getAllAdministrations();
        })
      ).subscribe(
        (resp: any) => {
        }, err => {
          this.messageService.add({ severity: 'error', detail: err.error.message });
        }
      )
  }

  onUpdateRegistro() {
    // this.administrador.names = this.formRegistro.get('names').value;
    // this.administrador.lastName = this.formRegistro.get('lastName').value;
    // this.administrador.motherLastName = this.formRegistro.get('motherLastName').value;
    // this.administrador.identificationNumber = this.formRegistro.get('identificationNumber').value;
    // this.administrador.cellPhoneNumber = this.formRegistro.get('cellPhoneNumber').value;
    this.administrador.phoneNumber = this.formRegistro.get('phoneNumber').value;
    this.administrador.electronicMail = this.formRegistro.get('electronicMail').value;
    this.administrador.username = this.formRegistro.get('username').value;
    // this.administrador.birthdate = moment(this.formRegistro.get('birthdate').value).utc().format('YYYY-MM-DD');
    // this.administrador.activationCode = '';
    // this.administrador.idTypePhone = 1;
    // this.administrador.accountStatus = 1;
    // this.administrador.restoreCode = '';
    // this.administrador.activationMethod = 'email';
    // this.administrador.extension = '';
    // this.administrador.complement = '';
    // this.administrador.idTypeIdentification = 4;
    this.administrador.password = this.formRegistro.get('password').value;
    this.administrador.roles = [2];

    this.administratorsService.update(this.administrador)
      .pipe(
        tap(() => {
          this.getAllAdministrations();
          this.dialogEdit = false;
          this.messageService.add({ severity: 'success', detail: messages.successUpdate });
        })
      ).subscribe()
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
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

  confirmSwitchChange(event: any, item) {
    var texto = item.enabled ? 'Habilitar' : 'Deshabilitar';    
    this.previousState = item.enabled;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `¿${texto} a ${item.lastName} ${item.motherLastName} ${item.names} ?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {        
        item.enabled = !this.previousState;
        if (!item.enabled) {
          this.administratorsService.enabledCustomer(item.id).subscribe(
            (resp: any) => {
              this.getAllAdministrations();
            }
          )
        } else {
          this.administratorsService.disabledCustomer(item.id).subscribe(
            (resp: any) => {
              this.getAllAdministrations();
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
    this.username = '';
    this.names = '';
    this.lastName = '';
    this.motherLastName = '';
    this.electronicMail = '';
    this.cellPhoneNumber = '';
  }

}
