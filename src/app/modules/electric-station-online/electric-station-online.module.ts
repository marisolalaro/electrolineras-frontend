import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// modules
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// service
import { ElectricStationOnlineService } from './services/electric-station-online.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { NotFoundComponent } from '../not-found/not-found.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    PrimeModule,
    NotFoundComponent
  ],
  exports: [
    PrimeModule,
    PipesModule,
    CommonModule,
    NotFoundComponent
  ],
  providers: [
    ElectricStationOnlineService,
    WebsocketService
  ]
})
export class ElectricStationOnlineModule { }
