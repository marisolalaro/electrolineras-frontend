import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { ReportesService } from './services/reportes.service';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from './services/excel.service';
import { FormatFieldTimeCargaPipe } from 'src/app/core/pipes/format-field-time-carga';
import { TableSuministroClienteComponent } from './components/table-suministro-cliente/table.component';
import { TableReportSimpleComponent } from './components/table-report-simple/table.component';
import { TableTransaccionesClienteComponent } from './components/table-transacciones-cliente/table.component';
import { TableFacturaRelacionadaComponent } from './components/table-factura-relacionada/table.component';

@NgModule({
  declarations: [
    TableReportSimpleComponent,
    TableReportSimpleComponent,
    TableSuministroClienteComponent,
    TableFacturaRelacionadaComponent,
    TableTransaccionesClienteComponent,
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    TableReportSimpleComponent,
    TableReportSimpleComponent,
    TableSuministroClienteComponent,
    TableFacturaRelacionadaComponent,
    TableTransaccionesClienteComponent,
  ],
  providers: [
    ReportesService,
    ExcelService,
    FormatFieldTimeCargaPipe,
  ]
})
export class ReportesModule { }
