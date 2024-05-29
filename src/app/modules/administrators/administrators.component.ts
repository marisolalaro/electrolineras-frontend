import { Component } from '@angular/core';
import { AdministratorsModule } from './administrators.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { buttons, labels, mainTitles } from 'src/app/core/constants/labels';
import { AdministratorModel } from 'src/app/core/model/administrators';
import { AdministratorsService } from './services/administrators.service';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { messages } from 'src/app/core/constants/messages';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  standalone: true,
  imports: [AdministratorsModule, PipesModule, ReactiveFormsModule, NgClass, NgIf],
  styleUrls: ['./administrators.component.scss'],
  providers: [HelpersService, MessageService],
})
export default class AdministratorsComponent {

  // variables de control
  public submitted: boolean = false;

  // variables de dialog
  public dialogRegistro: boolean = false;
  public dialogEdit: boolean = false;

  // variables Globales del Core
  public labelsGlobales = labels;
  public messagesGlobales = messages;
  public botonesGlobales = buttons;

  // Variables Paaginador
  public page: number = 1;
  public itemsPerPage: number = 9999;

  // variables propias del componete
  public administradors: AdministratorModel[] = [];
  public administrador: AdministratorModel = new AdministratorModel();
  public componentTitle: any = mainTitles['administradores'];
  public formRegistro: FormGroup = this.createFormGroup();
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  constructor(
    public administratorsService: AdministratorsService,
    private helpersService: HelpersService,
  ) { }

  ngOnInit(): void {
    this.getAllAdministrations();
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

  onSelecetedEdit(item: AdministratorModel) {

  }

  createFormGroup() {
    return new FormGroup({
      // id: new FormControl(null),
      names: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      motherLastName: new FormControl('', [Validators.required]),
      identificationNumber: new FormControl('', [Validators.required]),
      // TODO VER LA VALIDACIONE DE LOS NUMEROS
      cellPhoneNumber: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      birthdate: new FormControl('', [Validators.required]),
      electronicMail: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onValidaFormulario() {
    this.submitted = true;
    if (this.formRegistro.valid) {
      if (this.administrador.id) {
        this.onUpdateRegistro();
      } else {
        this.onCreateRegistro();
      }
    }
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
    registro.roles = [2]

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

  openDialog(state: any, stateSubmitted?: any, tipo?: any) {
    tipo == 'crear' ? this.dialogRegistro = state : this.dialogEdit = state;
    this.submitted = stateSubmitted;
  }

  onUpdateRegistro() {
    var registro: AdministratorModel = {
      ...this.formRegistro.value,
    };
    this.administratorsService.update(registro)
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

}
