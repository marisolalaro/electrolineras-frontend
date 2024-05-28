import { Component } from '@angular/core';
import { AdministratorsModule } from './administrators.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { AdministratorModel } from 'src/app/core/model/administrators';
import { AdministratorsService } from './services/administrators.service';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { decodeLocal } from 'src/app/core/utils/decodeToken';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  standalone: true,
  imports: [AdministratorsModule, PipesModule, NgxPaginationModule],
  styleUrls: ['./administrators.component.scss']
})
export default class AdministratorsComponent {

  // variables de dialog
  public dialogRegistro: boolean = false;

  // Variables Paaginador
  public page: number = 1;
  public itemsPerPage: number = 5;
  
  // variables propias del componete
  public administradors: AdministratorModel [] = [];
  public componentTitle: any = mainTitles['administradores'];
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  constructor(
    public administratorsService: AdministratorsService,
  ) { }

  ngOnInit(): void {
    this.getAllAdministrations();
  }

  getAllAdministrations() {
    this.administratorsService.getAll(this.bodyFilter).subscribe(
      (resp: any) => {
        if (resp) {
          this.administradors = resp.data;
        }
      }
    )
  }

  onSelecetedEdit(item: AdministratorModel) {

  }
}
