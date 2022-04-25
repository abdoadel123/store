import {model, property} from '@loopback/repository';
import {Base} from '../../../common/models';

@model()
export class Product extends Base {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    default: 0,
  })
  reservedQuantity: number;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  [key: string]: any;
  constructor(data?: Partial<Product>) {
    super(data);
  }
}
export interface ProductRelations {}

export type ProductWithRelations = Product & ProductRelations;
