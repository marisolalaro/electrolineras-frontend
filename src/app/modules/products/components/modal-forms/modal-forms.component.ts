import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { Product } from 'src/app/core/model/product';
import { Category } from 'src/app/core/model/category';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from 'src/app/modules/categories/services/categories.service';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { MessageService } from 'primeng/api';
import { TableComponent } from '../table/table.component';
import { messages } from 'src/app/core/constants/messages';
import { labels,titles,buttons } from 'src/app/core/constants/labels';
@Component({
  selector: 'app-modal-forms',
  templateUrl: './modal-forms.component.html',
  styleUrls: ['./modal-forms.component.scss'],
  providers: [MessageService, HelpersService],
})
export class ModalFormsComponent {
  public formProduct: FormGroup = this.createFormGroup();
  public categories: Category[] = [];
  public submitted: boolean = false;
  public dialog: boolean = false;
  public titleForm: string = '';
  public labels = labels;
  public buttons = buttons;
  public messages = messages;

  private product: Product;
  private productResponse: Product;
  private tableComponent!: TableComponent;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private helpersService: HelpersService
  ) { }

  ngOnInit() {
    this.productsService.getObjectSelectedChange().subscribe((response) => {
      this.productResponse = response;
    });
    this.productsService.triggerForm.emit(this);
    this.productsService.triggerTable.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  }

  public hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  public openCreate() {
    this.reset();
    this.submitted = false;
    this.titleForm = titles.create;
    this.loadCategories();
    this.dialog = true;
  }

  public openEdit() {
    this.titleForm = titles.edit;
    if (this.productResponse && this.productResponse.id) {
      this.productsService
        .findById(this.productResponse.id)
        .pipe(
          tap((product: any) => {
            this.product = product;
            this.loadCategories();
            this.updateFormValues(product);
            this.dialog = true;
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
        .subscribe();
    } else {
      this.helpersService.messageNotification('info', 'Seleccione un equipo.');
    }
  }

  public save() {
    this.submitted = true;
    if (this.formProduct.valid) {
      if (this.product.id) {
        this.submitUpdate(this.product.id);
      } else {
        this.submitCreate();
      }
    }
  }

  private createFormGroup() {
    return new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
    });
  }

  private reset(): void {
    this.formProduct.reset();
    this.product = new Product();
  }

  private submitCreate() {
    const data: Product = {
      ...this.formProduct.value,
    };
    this.productsService
      .create(data)
      .pipe(
        tap(() => {
          this.dialog = false;
          this.helpersService.messageNotification(
            'success',
            messages.successCreate
          );
          this.tableComponent.reload();
          this.reset();
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
      .subscribe();
  }

  private submitUpdate(productId: number): void {
    const data: Product = {
      ...this.formProduct.value,
    };
    this.productsService
      .update(productId, data)
      .pipe(
        tap(() => {
          this.dialog = false;
          this.helpersService.messageNotification(
            'success',
            messages.successUpdate
          );
          this.tableComponent.reload();
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
      .subscribe();
  }

  private loadCategories() {
    this.categoriesService.findAll().subscribe({
      next: (response) => (this.categories = response),
    });
  }

  private updateFormValues(product: Product) {
    this.formProduct.patchValue(product);
    this.formProduct.patchValue({
      categoryId: product.category.id
    });
  }
}
