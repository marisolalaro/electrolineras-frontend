import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ModalFormsComponent } from './components/modal-forms/modal-forms.component';
import { PanelFilterComponent } from './components/panel-filter/panel-filter.component';
import { TableComponent } from './components/table/table.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FilterInformationComponent } from "../../shared/components/filter-information/filter-information.component";

@NgModule({
    declarations: [
        ModalFormsComponent,
        PanelFilterComponent,
        TableComponent,
        ToolbarComponent
    ],
    exports: [
        ModalFormsComponent,
        PanelFilterComponent,
        TableComponent,
        ToolbarComponent
    ],
    imports: [
        CommonModule,
        ProductsRoutingModule,
        PrimeModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        FilterInformationComponent
    ]
})
export class ProductsModule { }
