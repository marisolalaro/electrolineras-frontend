import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Product } from 'src/app/core/model/product';
import { ProductsService } from '../../services/products.service';
import { Table } from 'primeng/table';
import { mainTitles } from 'src/app/core/constants/labels';
import { messages } from 'src/app/core/constants/messages';
import { labels, buttons, titles, tooltip } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() products!: Product[];
  @Output() rowSelectedEmiiter = new EventEmitter();
  @ViewChild('filter') filter!: ElementRef;
  
  public titleProduct: any = mainTitles['products'];
  public selectedProducts: Product[] = [];
  public firstPage = 0;
  public labels = labels;
  public titles = titles;
  public buttons = buttons;
  public messages = messages;
  public tooltip = tooltip;

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.productsService.triggerTable.emit(this);
  }

  public onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  public clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  public reload() {
    const data = new Product();
    this.productsService.setObjectFilterChange(data);
    this.firstPage = 0;
  }

  public onRowSelect(event: any) {
    this.sendSelectedProduct(event.data);
  }

  public onRowUnselect(event: any) {
    const data = new Product();
    this.sendSelectedProduct(data);
  }

  private sendSelectedProduct(selectedProduct: Product) {
    this.productsService.setObjectSelectedChange(selectedProduct);
  }
}
