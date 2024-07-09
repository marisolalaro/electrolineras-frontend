import { Component } from '@angular/core';
import { ColorServiceService } from './modules/login/services/color-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'electrolineras-frontend';

  constructor(
    private colorService: ColorServiceService
  ) { }

  ngOnInit() {
    this.changePrimaryColor('#2980b9');
  }

  changePrimaryColor(newColor: string) {
    this.colorService.updateColors(newColor);
  }
}
