import { Component } from '@angular/core';
import { AdministratorsModule } from './administrators.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  standalone: true,
  imports: [AdministratorsModule, PipesModule, NgxPaginationModule],
  styleUrls: ['./administrators.component.scss']
})
export default class AdministratorsComponent {

}
