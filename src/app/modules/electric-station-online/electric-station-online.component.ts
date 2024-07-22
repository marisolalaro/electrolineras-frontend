import { Component } from '@angular/core';
import { ElectricStationsModule } from '../electric-stations/electric-stations.module';
import { ElectricStationOnlineModule } from './electric-station-online.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { SocketService } from './services/socket.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { NgFor, NgStyle } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Base64ToImageService } from '../invoice-electric-stations/services/base-64-to-image.service';

@Component({
  standalone: true,
  selector: 'app-electric-station-online',
  templateUrl: './electric-station-online.component.html',
  styleUrls: ['./electric-station-online.component.scss'],
  imports: [ElectricStationOnlineModule, NgStyle, NgFor]
})
export default class ElectricStationOnlineComponent {

  public id: number;
  public data: any;
  public electricStation: ElectricStationModel = new ElectricStationModel();
  public titleComponent: any = mainTitles['electrolinerasOnline'];
  public puertos: any[] = [];
  public imageUrl: string | null = null;
  public page: number = 0;
  public itemsPerPage: number = 4;
  value: string | undefined;

  cities!: any[];

    selectedCity!: any;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    public base64ImageService: Base64ToImageService,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnInit(): void {
    this.inicializaDatos()
      .then(datosInicializados => {
        if (datosInicializados) {
          return this.getOneElectricStation()
        } else {
          return false;
        }
      })
      .then(oneElectricStation => {
        if (oneElectricStation) {
          return this.getOnline();
        } else {
          return false;
        }
      });
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.id = +this.route.snapshot.paramMap.get('id');

      this.cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

      resolve(true);
    })
  }

  getOneElectricStation() {
    return new Promise((resolve) => {
      this.electricStationsService.getOne(this.id).subscribe(
        (resp: any) => {
          this.electricStation = resp.data;
          this.imageUrl = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
        }
      )
      resolve(true);
    })
  }

  getOnline() {
    return new Promise((resolve) => {
      this.socketService.listen('data').subscribe((data: any) => {
        this.data = data;
      });
      resolve(true);
    })
  }

}
