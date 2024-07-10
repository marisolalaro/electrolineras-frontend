import { Component } from '@angular/core';
import { ElectricStationsModule } from '../electric-stations/electric-stations.module';
import { ElectricStationOnlineModule } from './electric-station-online.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { SocketService } from './services/socket.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-electric-station-online',
  templateUrl: './electric-station-online.component.html',
  styleUrls: ['./electric-station-online.component.scss'],
  imports: [ElectricStationOnlineModule, NgStyle, NgFor]
})
export default class ElectricStationOnlineComponent {

  public data: any;
  public electricStations: ElectricStationModel[] = [];
  public titleComponent: any = mainTitles['electrolinerasOnline'];

  public page: number = 0;
  public itemsPerPage: number = 4;

  constructor(
    private socketService: SocketService,
    private electricStationsService: ElectricStationsService,
  ) {}

  ngOnInit(): void {
    this.getOnline();
    this.getElectricStations();
  }

  getOnline() {
    this.socketService.listen('data').subscribe((data: any) => {
      this.data = data;
    });
  }

  getElectricStations(): void {
    this.electricStationsService.getAll().subscribe(
      (resp: any) => {
        this.electricStations = resp.data;
      }
    )
  }
}
