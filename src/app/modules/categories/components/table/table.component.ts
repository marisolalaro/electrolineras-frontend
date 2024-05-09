import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Category } from 'src/app/core/model/category';
import { CategoriesService } from '../../services/categories.service';
import { messages } from 'src/app/core/constants/messages';
import { labels,tooltip } from 'src/app/core/constants/labels';
import { mainTitles } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  @Input() categories!: Category[];
  @Output() rowSelectedEmitter = new EventEmitter<object>();
  @ViewChild('filter') filter!: ElementRef;
  
  public titleCategory: any = mainTitles['categories'];
  public selectedCategories: Category[] = [];
  public category!: Category;
  public visible: boolean = true;
  public firstPage = 0;
  public messages = messages;
  public labels = labels;
  public tooltip = tooltip;
  
  private data = new Category();

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.triggerTable.emit(this);
  }

  public onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  public clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  public reload(): void {
    this.categoriesService.setObjectFilterChange(this.data);
    this.firstPage = 0;
  }

  public onRowSelect(event: any) {
    this.sendSelectedCategory(event.data);
  }

  public onRowUnselect(event: any) {
    this.sendSelectedCategory(this.data);
  }

  private sendSelectedCategory(selectedCategory: Category) {
    this.categoriesService.setObjectSelectedChange(selectedCategory);
  }
}
