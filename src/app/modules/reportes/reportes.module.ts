import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// services
import { ReportesService } from './services/reportes.service';
import { CrearExcelService } from './services/crear-excel.service';
// components
import { TableReportSimpleComponent } from './components/table-report-simple/table.component';
import { TableSuministroClienteComponent } from './components/table-suministro-cliente/table.component';
import { TableFacturaRelacionadaComponent } from './components/table-factura-relacionada/table.component';
import { TableTransaccionesClienteComponent } from './components/table-transacciones-cliente/table.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { TableReportOperacionComponent } from './components/table-report-operacion/table.component';
import { TableReportConsumoComponent } from './components/table-report-consumo/table.component';

@NgModule({
  declarations: [
    TableReportSimpleComponent,
    TableReportSimpleComponent,
    TableSuministroClienteComponent,
    TableFacturaRelacionadaComponent,
    TableTransaccionesClienteComponent,
    TableReportOperacionComponent,
    TableReportConsumoComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    NotFoundComponent,
  ],
  exports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    TableReportSimpleComponent,
    TableReportSimpleComponent,
    NotFoundComponent,
    TableSuministroClienteComponent,
    TableFacturaRelacionadaComponent,
    TableTransaccionesClienteComponent,
    TableReportOperacionComponent,
    TableReportConsumoComponent
  ],
  providers: [
    ReportesService,
    CrearExcelService,
  ]
})
export class ReportesModule { }
