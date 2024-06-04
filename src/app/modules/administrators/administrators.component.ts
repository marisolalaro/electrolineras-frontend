import { Component, ViewChild } from '@angular/core';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// librerias
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { catchError, of, tap } from 'rxjs';
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
import { HelpersService } from 'src/app/core/services/helpers.service';
import { AdministratorsService } from './services/administrators.service';

@Component({
  standalone: true,
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss'],
  providers: [HelpersService, MessageService],
  imports: [AdministratorsModule, PipesModule, ReactiveFormsModule,NgFor, NgClass, NgIf, NgSwitch, NgSwitchCase],
})
export default class AdministratorsComponent {

  // variables de control
  public submitted: boolean = false;

  // variables de dialog
  public dialogEdit: boolean = false;
  public dialogRegistro: boolean = false;

  // variables Globales del Core
  public labelsGlobales = labels;
  public titlesGlobales = titles;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;

  // Variables Paaginador
  public page: number = 1;
  public itemsPerPage: number = 9999;

  // variables propias del componete
  @ViewChild('dt1') dt!: Table;
  public cols: any[] = [];
  public administradors: AdministratorModel[] = [];
  public formRegistro: FormGroup = this.createFormGroup();
  public componentTitle: any = mainTitles['administradores'];
  public administrador: AdministratorModel = new AdministratorModel();
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  constructor(
    public administratorsService: AdministratorsService,
    private helpersService: HelpersService,
  ) { }

  ngOnInit(): void {
    this.getAllAdministrations();
    this.inicializaDatos();
  }

  inicializaDatos() {
    this.cols = [
      { field: 'username', header: 'Usuario' },
      { field: 'names', header: 'Nombres' },
      { field: 'lastName', header: 'Apellido Paterno' },
      { field: 'motherLastName', header: 'Apellido Materno' },
      { field: 'electronicMail', header: 'Email' },
      { field: 'cellPhoneNumber', header: 'Celular' },
      { field: '', header: 'Opciones' },
    ];
  }
  
  getAllAdministrations() {
    this.administratorsService.getAll(this.bodyFilter).subscribe(
      (resp: any) => {
        if (resp) {
          this.administradors = resp.data;
        }
      }
    )
  }

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      names: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      motherLastName: new FormControl('', [Validators.required]),
      identificationNumber: new FormControl('', [Validators.required]),
      cellPhoneNumber: new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(7), Validators.pattern(/^[0-9]\d*$/)]),
      phoneNumber: new FormControl('', [Validators.maxLength(8), Validators.minLength(7), Validators.pattern(/^[0-9]\d*$/)]),
      birthdate: new FormControl('', [Validators.required]),
      electronicMail: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
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
    this.formRegistro.controls['birthdate'].setValue(new Date (moment(item.birthdate).toString()));
    this.dialogEdit = true;
    // this.formRegistro.removeControl('password');
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
          this.helpersService.messageNotification('success', messages.successCreate);
          this.getAllAdministrations();
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
    var registro: AdministratorModel = {
      ...this.formRegistro.value,
    };
    this.administrador.names = this.formRegistro.get('names').value;
    this.administrador.lastName = this.formRegistro.get('lastName').value;
    this.administrador.motherLastName = this.formRegistro.get('motherLastName').value;
    this.administrador.identificationNumber = this.formRegistro.get('identificationNumber').value;
    this.administrador.cellPhoneNumber = this.formRegistro.get('cellPhoneNumber').value;
    this.administrador.phoneNumber = this.formRegistro.get('phoneNumber').value;
    this.administrador.electronicMail = this.formRegistro.get('electronicMail').value;
    this.administrador.username = this.formRegistro.get('username').value;
    this.administrador.birthdate = moment(this.formRegistro.get('birthdate').value).utc().format('YYYY-MM-DD');
    this.administrador.activationCode = '';
    this.administrador.idTypePhone = 1;
    this.administrador.accountStatus = 1;
    this.administrador.restoreCode = '';
    this.administrador.activationMethod = 'email';
    this.administrador.extension = '';
    this.administrador.complement = '';
    this.administrador.idTypeIdentification = 4;
    this.administrador.password = this.formRegistro.get('password').value;
    this.administrador.roles = [2];

    this.administratorsService.update(this.administrador)
      .pipe(
        tap(() => {
          this.helpersService.messageNotification('success', messages.successCreate);
          this.getAllAdministrations();
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

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 1;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    // this.getAllElectricStations();
  }

}
