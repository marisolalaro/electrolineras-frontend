import { Component } from '@angular/core';
import { ElectricStationsModule } from '../electric-stations/electric-stations.module';
import { ElectricStationOnlineModule } from './electric-station-online.module';
import { mainTitles } from 'src/app/core/constants/labels';

@Component({
  standalone: true,
  selector: 'app-electric-station-online',
  templateUrl: './electric-station-online.component.html',
  styleUrls: ['./electric-station-online.component.scss'],
  imports: [ElectricStationOnlineModule]
})
export default class ElectricStationOnlineComponent {

  public titleComponent: any = mainTitles['electrolinerasOnline'];

  ngOnInit(): void {
    this.getOnline();
  }

  getOnline() {

  }
}
