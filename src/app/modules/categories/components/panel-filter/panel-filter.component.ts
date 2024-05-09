import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccordionTab } from 'primeng/accordion';
import { Category } from 'src/app/core/model/category';
import { CategoriesService } from '../../services/categories.service';
import { getSelectedTags } from 'src/app/core/utils/filter';
import { labels, buttons, titles } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-panel-filter',
  templateUrl: './panel-filter.component.html',
  styleUrls: ['./panel-filter.component.scss'],
})
export class PanelFilterComponent {
  public categories!: Category[];
  public category!: Category;
  public formCategory: FormGroup;
  public selectedTags: Map<string, any> = new Map<string, any>();
  public submitted: boolean = false;
  public labels = labels;
  public buttons = buttons;
  public titles = titles;

  constructor(private categoriesService: CategoriesService) {
    this.formCategory = this.createFormGroup();
  }

  public search(tab: AccordionTab, event: MouseEvent | KeyboardEvent) {
    const data: Category = {
      ...this.formCategory.value,
    };
    this.categoriesService.setObjectFilterChange(data);
    this.selectedTags = getSelectedTags(document, 'formCategory');
    tab.toggle(event);
  }

  public clear() {
    this.formCategory.reset("");
    this.selectedTags.clear();
  }

  private createFormGroup() {
    return new FormGroup({
      name: new FormControl('', { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
    });
  }
}
