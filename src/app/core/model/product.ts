import { Base } from './base';
import { Category } from './category';

export class Product extends Base {
  id: number = null;
  name: string = '';
  description: string = '';
  price: number = null;
  stock: number = null;
  category: Category;
}
