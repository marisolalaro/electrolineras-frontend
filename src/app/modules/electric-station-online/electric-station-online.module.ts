import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ElectricStationOnlineService } from './services/electric-station-online.service';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    CommonModule,
    PrimeModule,
    PipesModule
  ],
  exports: [
    PrimeModule,
  ],
  providers: [
    ElectricStationOnlineService,
  ]
})
export class ElectricStationOnlineModule { }
