import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FilterInformationComponent } from 'src/app/shared/components/filter-information/filter-information.component';
import { DashboardRoutingModule } from './dashborad-routing.module';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';

@NgModule({
  declarations: [
    
  ],
  imports: [
    DashboardRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    FilterInformationComponent,
    CommonModule,
  ],
  exports:[
    PrimeModule
  ],
  providers: [
    ElectricStationsService
  ]
})
export class DashboardModule { }
