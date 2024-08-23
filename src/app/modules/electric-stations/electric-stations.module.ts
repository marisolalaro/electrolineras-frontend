import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// modules
import { ElectricStationsRoutingModule } from './electric-stations-routing.module';
// services
import { ElectricStationsService } from './services/electric-stations.service';
// components
import { MapaComponent } from './components/mapa/mapa.component';

@NgModule({
  declarations: [
    MapaComponent
  ],
  imports: [
    ElectricStationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    LeafletModule,
    CommonModule,
    PrimeModule
  ],
  exports: [
    PrimeModule,
    MapaComponent,
    PipesModule
  ],
  providers: [
    ElectricStationsService,
  ]
})
export class ElectricStationsModule { }
