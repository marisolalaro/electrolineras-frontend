import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { setTitlesForPanelFilter } from 'src/app/core/utils/filter';
import { PrimeModule } from 'src/app/prime.module';

@Component({
  selector: 'app-filter-information',
  templateUrl: './filter-information.component.html',
  styleUrls: ['./filter-information.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PrimeModule],
})
export class FilterInformationComponent implements OnChanges {
  @Input() filterData: Map<string, any>;
  public filterInformation: string = 'Filtrar por: ';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if ('filterData' in changes) {
      this.updateFilterInformation();
    }
  }

  private updateFilterInformation() {
    if (this.filterData) {
      this.filterInformation = setTitlesForPanelFilter(this.filterData);
    }
  }
}