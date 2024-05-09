import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ModalFormsComponent } from '../modal-forms/modal-forms.component';
import { ModalInfoComponent } from 'src/app/shared/components/modal-info/modal-info.component';
import { ModalDeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  
  private modalFormsComponent!: ModalFormsComponent;
  private modalInfoComponent!: ModalInfoComponent;
  private modalDeleteComponent!: ModalDeleteComponent;
  private tableComponent!: TableComponent;

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.productsService.triggerForm.subscribe((modalFormsComponent) => {
      this.modalFormsComponent = modalFormsComponent;
    });

    this.productsService.triggerInfo.subscribe((modalInfoComponent) => {
      this.modalInfoComponent = modalInfoComponent;
    });

    this.productsService.triggerDelete.subscribe((modalDeleteComponent) => {
      this.modalDeleteComponent = modalDeleteComponent;
    });

    this.productsService.triggerTable.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  }

  public info() {
    this.modalInfoComponent.openInfo();
  }

  public deleteSelectedProducts() {
    this.modalDeleteComponent.openConfirm();
  }

  public create() {
    this.modalFormsComponent.openCreate();
  }

  public edit() {
    this.modalFormsComponent.openEdit();
  }
}
