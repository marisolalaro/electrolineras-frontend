import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// modules
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// service
import { ElectricStationOnlineService } from './services/electric-station-online.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    PrimeModule,
  ],
  exports: [
    PrimeModule,
    PipesModule,
    CommonModule,
  ],
  providers: [
    ElectricStationOnlineService,
  ]
})
export class ElectricStationOnlineModule { }
