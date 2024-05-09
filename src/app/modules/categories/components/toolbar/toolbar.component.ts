import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Category } from 'src/app/core/model/category';
import { CategoriesService } from '../../services/categories.service';
import { ModalFormsComponent } from '../modal-forms/modal-forms.component';
import { TableComponent } from '../table/table.component';
import { ModalInfoComponent } from 'src/app/shared/components/modal-info/modal-info.component';
import { ModalDeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';
import { buttons } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  public items: MenuItem[] = [];
  public cardMenu: MenuItem[] = [];
  public categorySelectedTable: any;
  public categoryDialog: boolean = false;
  public categoryDialogDelete: boolean = false;
  public categoryDialogInfo: boolean = false;
  public submitted: boolean = false;
  public category = new Category();
  public data: object = {};
  public date: Date | undefined;
  public buttons = buttons;

  private modalFormsComponent!: ModalFormsComponent;
  private modalInfoComponent!: ModalInfoComponent;
  private modalDeleteComponent!: ModalDeleteComponent;
  private tableComponent!: TableComponent;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.triggerForm.subscribe((modalFormsComponent) => {
      this.modalFormsComponent = modalFormsComponent;
    });

    this.categoriesService.triggerInfo.subscribe((modalInfoComponent) => {
      this.modalInfoComponent = modalInfoComponent;
    });

    this.categoriesService.triggerDelete.subscribe((modalDeleteComponent) => {
      this.modalDeleteComponent = modalDeleteComponent;
    });

    this.categoriesService.triggerTable.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  }

  public create() {
    this.modalFormsComponent.openCreate();
  }
  public edit() {
    this.modalFormsComponent.openEdit();
  }
  public deleteSelected() {
    this.modalDeleteComponent.openConfirm();
  }
  public info() {
    this.modalInfoComponent.openInfo();
  }
}
