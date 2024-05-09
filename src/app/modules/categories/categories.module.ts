import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { PrimeModule } from 'src/app/prime.module';
import { CategoryRoutingModule } from './categories-routing.module';
import { ModalFormsComponent } from './components/modal-forms/modal-forms.component';
import { PanelFilterComponent } from './components/panel-filter/panel-filter.component';
import { TableComponent } from './components/table/table.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FilterInformationComponent } from "../../shared/components/filter-information/filter-information.component";

@NgModule({
  declarations: [
    TableComponent,
    ToolbarComponent,
    PanelFilterComponent,
    ModalFormsComponent,
  ],
  exports: [
    TableComponent,
    ToolbarComponent,
    PanelFilterComponent,
    ModalFormsComponent,
  ],
  imports: [
    CommonModule,
    PrimeModule,
    CategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    FilterInformationComponent,
  ],
})
export class CategoriesModule {}
