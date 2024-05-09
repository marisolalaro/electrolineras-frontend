import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/core/model/category';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/app/core/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends HttpService<Category> {

  @Output() triggerForm: EventEmitter<any> = new EventEmitter();
  @Output() triggerInfo: EventEmitter<any> = new EventEmitter();
  @Output() triggerDelete: EventEmitter<any> = new EventEmitter();
  @Output() triggerTable: EventEmitter<any> = new EventEmitter();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.apiUrl}/categories`);
  }
}
