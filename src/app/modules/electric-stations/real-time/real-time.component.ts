import { Component } from '@angular/core';
import { ElectricStationsModule } from '../electric-stations.module';

@Component({
  standalone: true,
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.scss'],
  imports: [ElectricStationsModule],

})
export default class RealTimeComponent {

}
