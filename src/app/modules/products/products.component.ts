import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { Product } from 'src/app/core/model/product';
import { ProductsService } from './services/products.service';
import { ProductsModule } from './products.module';
import { IProductInfo } from 'src/app/core/interfaces/product.interface';
import { ModalInfoComponent } from 'src/app/shared/components/modal-info/modal-info.component';
import { ModalDeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';
import { mainTitles } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductsModule, ModalInfoComponent, ModalDeleteComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export default class ProductsComponent {
  public titleProduct: any = mainTitles['products'];
  public products!: Product[];
  public product: Product;
  public selectedProductInfo: IProductInfo;
  public columns: string[] = [
    'name',
    'description',
    'price',
    'stock',
    'category'
  ];
  
  constructor(public productsService: ProductsService) {}

  ngOnInit() {
    this.createGrid();
    this.productsService.getObjectFilterChange().subscribe(() => {
      this.createGrid();
    });

    this.retrieveObjectSelection();
  }

  private retrieveObjectSelection() {
    this.productsService
      .getObjectSelectedChange()
      .subscribe((response: Product) => {
        this.product = response;
        if (this.product) {
          this.selectedProductInfo = this.buildProductInfo(
            this.product
          );
        }
      });
  }

  private buildProductInfo(product: Product): IProductInfo {
    const category = product.category;

    let productInfo: IProductInfo = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      active: product.active,
      createdBy: product.createdBy,
      updatedBy: product.updatedBy,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
      categoryName: `${product.name}`,
    };
    return productInfo;
  }

  private createGrid() {
    this.productsService
      .findAll()
      .pipe(tap((items: Product[]) => (this.products = items)))
      .subscribe();
  }
}
