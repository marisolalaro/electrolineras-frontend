import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { Category } from 'src/app/core/model/category';
import { CategoriesModule } from './categories.module';
import { CategoriesService } from './services/categories.service';
import { ModalInfoComponent } from 'src/app/shared/components/modal-info/modal-info.component';
import { ModalDeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';
import { mainTitles } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [CategoriesModule, ModalInfoComponent, ModalDeleteComponent],
})
export default class CategoriesComponent implements OnInit {
  public titleCategory: any = mainTitles['categories'];
  public categories!: Category[];
  public category!: Category;
  public columns: string[] = [
    'name',
    'description'
  ];
  constructor(public categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.createGrid();
    this.categoriesService.getObjectFilterChange().subscribe(() => {
      this.createGrid();
    });
    this.retrieveObjectSelection();
  }

  private retrieveObjectSelection() {
    this.categoriesService
      .getObjectSelectedChange()
      .subscribe((response: Category) => {
        this.category = response;
      });
  }

  private createGrid() {
    this.categoriesService
      .findAll()
      .pipe(tap((items: Category[]) => (this.categories = items)))
      .subscribe();
  }
}
