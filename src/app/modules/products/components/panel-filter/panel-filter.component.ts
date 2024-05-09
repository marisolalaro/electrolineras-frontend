import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Product } from 'src/app/core/model/product';
import { Category } from 'src/app/core/model/category';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from 'src/app/modules/categories/services/categories.service';
import { AccordionTab } from 'primeng/accordion';
import { getSelectedTags } from 'src/app/core/utils/filter';
import { messages } from 'src/app/core/constants/messages';
import { labels, titles, buttons } from 'src/app/core/constants/labels';
@Component({
  selector: 'app-panel-filter',
  templateUrl: './panel-filter.component.html',
  styleUrls: ['./panel-filter.component.scss']
})
export class PanelFilterComponent {
  public form: FormGroup = this.createFormGroup();
  public categories: Category[] = [];
  public selectedTags: Map<string, any> = new Map<string, any>();
  public labels = labels;
  public titles = titles;
  public buttons = buttons;
  public messages = messages;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  public clear() {
    this.form.reset();
    this.selectedTags.clear();
  }

  public search(tab: AccordionTab, event: MouseEvent | KeyboardEvent) {
    const data: Product = {
      ...this.form.value,
    };
    this.productsService.setObjectFilterChange(data);
    this.selectedTags = getSelectedTags(document, 'formProduct');
    tab.toggle(event);
  }

  private createFormGroup() {
    return new FormGroup({
      name: new FormControl('', { nonNullable: true }),
      categoryId: new FormControl('', { nonNullable: true })
    });
  }

  private loadCategories() {
    this.categoriesService
      .findAll()
      .subscribe({
        next: (response) => this.categories = response
      });
  }
}
