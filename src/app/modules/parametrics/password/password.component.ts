import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// cores
import { messages } from 'src/app/core/constants/messages';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { buttons, titles, mainTitles, accessCode } from 'src/app/core/constants/labels';
// primeNg
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
// moduls
import { PasswordModule } from './password.module';
// modeles
import { PasswordModel } from 'src/app/core/model/password';
// services
import { PasswordService } from './services/password.service';
import { ValidaToken } from 'src/app/core/utils/verificarToken';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  standalone: true,
  imports: [
    PasswordModule,
    ReactiveFormsModule
  ],
  providers: [
    ConfirmationService
  ],
})
export default class PasswordComponent {

  // variables de control
  public previousState: boolean;
  public submitted: boolean = false;
  public loading: boolean = true;
  public serviceResponse: boolean = true;

  // variables propias del componente
  public passwords: PasswordModel[] = [];
  @ViewChild('dt1') dt!: Table;
  public password: PasswordModel = new PasswordModel();
  public mensaje: string = messages.noConexion;
  public formRegistro: FormGroup = this.createFormGroup();

  // variables Globales del Core
  public labelsGlobales = accessCode;
  public titlesGlobales = titles;
  public botonesGlobales = buttons;
  public messagesGlobales = messages;
  public componentTitle: any = mainTitles['contrasenias'];

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
    public passwordService: PasswordService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    if (ValidaToken()) {
      this.inicializaDatos()
        .then(datosInicializados => {
          if (datosInicializados) {
            this.getAllPasswords()
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

  getAllPasswords() {
    this.loading = true;
    this.passwordService.getAll().subscribe(
      (resp: any) => {
        if (resp) {
          this.passwords = resp.data;
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
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
  }

  selectedEdit(item: PasswordModel) {
    this.password = new PasswordModel();
    this.password = item;
    this.formRegistro.patchValue(JSON.parse(JSON.stringify(item)));
    this.actionDialog(true, 'edit')
  }

  generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  setAccessCode() {
    const generatedCode = this.generateAccessCode();
    this.formRegistro.get('accessCode')?.setValue(generatedCode);
    // Alternativamente, puedes usar patchValue:
    // this.form.patchValue({ accessCode: generatedCode });
  }

  confirmSwitchChange(event: any, item) {
    var texto = item.activo ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.activo;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      header: 'Confirmación',
      message: `¿${texto} contraseña de fecha ${item.fechaRegistro} ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        item.activo = !this.previousState;
        if (item.activo) {
          this.passwordService.delete(item.id).subscribe(
            (resp: any) => {
              this.getAllPasswords();
            }
          )
        } else {
          this.passwordService.update(item.id).subscribe(
            (resp: any) => {
              this.getAllPasswords();
            }
          )
        }

      },
      reject: () => {
        item.activo = !this.previousState;
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      accessCode: new FormControl('', [Validators.required]),
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
    var registro: PasswordModel = {
      ...this.formRegistro.value,
    };
    this.passwordService.create(registro).subscribe(
      (resp: any) => {
        if (resp) {
          this.actionDialog(false, 'create');
          this.messageService.add({ severity: 'success', detail: messages.successCreate });
          this.getAllPasswords();
        }
      }
    )
  }

  onUpdateRegistro() {
    this.password.accessCode = this.formRegistro.get('accessCode').value;
    this.passwordService.update(this.password).subscribe(
      (resp: any) => {
        this.getAllPasswords();
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