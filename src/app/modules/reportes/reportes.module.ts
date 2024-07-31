import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { ReportesService } from './services/reportes.service';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from './services/excel.service';
import { FormatFieldTimeCargaPipe } from 'src/app/core/pipes/format-field-time-carga';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    CommonModule,
    PrimeModule,
    PipesModule
  ],
  providers:[
    ReportesService,
    ExcelService,
    FormatFieldTimeCargaPipe
  ]
})
export class ReportesModule { }
