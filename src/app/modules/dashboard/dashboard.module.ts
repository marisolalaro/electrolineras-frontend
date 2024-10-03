import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashborad-routing.module';
// services
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { ConnectorStatusService } from 'src/app/core/services/connector-status.service';

@NgModule({
  declarations: [
  ],
  imports: [
    DashboardRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    CommonModule,
  ],
  exports:[
    PrimeModule,
    PipesModule,
    CommonModule
  ],
  providers: [
    WebsocketService,
    ConnectorStatusService,
    ElectricStationsService,
  ]
})
export class DashboardModule { }
