import { IBase } from './base.interface';

export interface IProductInfo extends IBase {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
}
