
(window as any).global = window;
import { Component } from '@angular/core';
import { ColorServiceService } from './core/services/color-service.service';
import { color } from './core/constants/colors';

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
    this.changePrimaryColor(color.sistema);
  }

  changePrimaryColor(newColor: string) {
    this.colorService.updateColors(newColor);
  }
}
