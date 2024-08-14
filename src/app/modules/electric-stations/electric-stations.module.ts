import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectricStationsRoutingModule } from './electric-stations-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ElectricStationsService } from './services/electric-stations.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PrimeModule } from 'src/app/prime.module';
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
