import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap, catchError, of } from 'rxjs';
import { Category } from 'src/app/core/model/category';
import { CategoriesService } from '../../services/categories.service';
import { MessageService } from 'primeng/api';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TableComponent } from '../table/table.component';
import { messages } from 'src/app/core/constants/messages';
import { labels,titles,buttons } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-modal-forms',
  templateUrl: './modal-forms.component.html',
  styleUrls: ['./modal-forms.component.scss'],
  providers: [MessageService, HelpersService]
})
export class ModalFormsComponent {
  public formCategory: FormGroup = this.createFormGroup();
  public submitted: boolean = false;
  public dialog: boolean = false;
  public titleForm: string = "";
  public messages = messages;
  public labels = labels;
  public buttons = buttons;

  private category!: Category;
  private categoryResponse: any;
  private tableComponent!: TableComponent;

  constructor(
    private categoriesService: CategoriesService,
    private helpersService: HelpersService,
  ) { }

  ngOnInit() {
    this.categoriesService.getObjectSelectedChange().subscribe((response) => {
      this.categoryResponse = response;
    });
    this.categoriesService.triggerForm.emit(this);
    this.categoriesService.triggerTable.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  }

  public save() {
    this.submitted = true;
    if (this.formCategory.valid) {
      if (this.category.id) {
        this.submitUpdate(this.category.id);
      } else {
        this.submitCreate();
      }
    }
  }

  public openDialog(state: any, stateSubmitted?:any) {
    this.dialog = state;
    this.submitted= stateSubmitted;
  }

  public openCreate() {
    this.reset();
    this.submitted = false;
    this.titleForm = titles.create;
    this.openDialog(true);
  }

  public openEdit() {
    this.titleForm = titles.edit;
    if (this.categoryResponse && this.categoryResponse.id) {
      this.categoriesService
        .findById(parseInt(this.categoryResponse.id))
        .pipe(
          tap((category: any) => {
            this.category = category;
            this.updateFormValues(category);
            this.openDialog(true);
          })
        )
        .subscribe();
    } else {
      this.helpersService.messageNotification('info', messages.requiredSelection);
    }
  }

  private createFormGroup() {
    return new FormGroup({
      id: new FormControl('', { nonNullable: true }),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  private submitCreate() {
    const data: Category = {
      ...this.formCategory.value,
    };
    this.categoriesService
      .create(data)
      .pipe(
        tap(() => {
          this.openDialog(false);
          this.helpersService.messageNotification('success', messages.successCreate);
          this.tableComponent.reload();
          this.reset();
        }),
        catchError(err => of('error',
          err.map((message: any) => {
            this.helpersService.messageNotification('error', message);
          })
        ))
      )
      .subscribe();

  }

  private submitUpdate(idCategory: number): void {
    const data: Category = {
      ...this.formCategory.value,
    };

    this.categoriesService
      .update(idCategory, data)
      .pipe(
        tap(() => {
          this.openDialog(false);
          this.helpersService.messageNotification('success', messages.successUpdate);
          this.tableComponent.reload();
        }),
        catchError(err => of('error',
          err.map((message: any) => {
            this.helpersService.messageNotification('error', message);
          })
        ))
      )
      .subscribe();
  }

  private reset(): void {
    this.formCategory.reset();
    this.category = new Category();
  }

  private updateFormValues(category: Category) {
    this.formCategory.patchValue(category);
  }
}