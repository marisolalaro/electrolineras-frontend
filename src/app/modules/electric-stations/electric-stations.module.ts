import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectricStationsRoutingModule } from './electric-stations-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ElectricStationsService } from './services/electric-stations.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    ElectricStationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    LeafletModule
  ],
  providers: [
    ElectricStationsService,
  ]
})
export class ElectricStationsModule { }
