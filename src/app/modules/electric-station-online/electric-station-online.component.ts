import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElectricStationsModule } from '../electric-stations/electric-stations.module';
import { ElectricStationOnlineModule } from './electric-station-online.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { SocketService } from './services/socket.service';
import { ElectricStationModel } from 'src/app/core/model/electric-station';
import { ElectricStationsService } from '../electric-stations/services/electric-stations.service';
import { NgFor, NgStyle } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Base64ToImageService } from '../invoice-electric-stations/services/base-64-to-image.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-electric-station-online',
  templateUrl: './electric-station-online.component.html',
  styleUrls: ['./electric-station-online.component.scss'],
  imports: [ElectricStationOnlineModule, NgStyle, NgFor]
})
export default class ElectricStationOnlineComponent implements OnInit, OnDestroy {

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
  private subscription: Subscription;


  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    public base64ImageService: Base64ToImageService,
    private electricStationsService: ElectricStationsService,
  ) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Limpia la suscripción cuando el componente se destruya
    }
  }

  ngOnInit(): void {
    this.inicializaDatos()
    this.getOneElectricStation()
    this.getOnline();
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

    this.electricStationsService.getOne(this.id).subscribe(
      (resp: any) => {
        this.electricStation = resp.data;
        this.imageUrl = this.base64ImageService.base64ToImageUrl(this.electricStation.imageQr);
      }
    )
    this.subscription = interval(3000)
      .pipe(
        switchMap(() => this.electricStationsService.getOne(this.id))
      )
      .subscribe(
        (response: any) => {
          this.electricStation = response.data;
        },
        error => {
          console.error('Error al obtener datos:', error);
        }
      );
  }

  getOnline() {
    this.socketService.listen('data').subscribe((data: any) => {
      this.data = data;
    });
  }

}
