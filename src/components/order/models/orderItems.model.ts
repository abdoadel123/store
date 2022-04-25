import {belongsTo, model, property} from '@loopback/repository';
import {Base} from '../../../common/models';
import {Product} from '../../product/models';

@model()
export class OrderItems extends Base {
  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @belongsTo(() => Product)
  productId: string;

  @property({
    type: 'string',
  })
  orderId: string;

  [key: string]: any;
  constructor(data?: Partial<OrderItems>) {
    super(data);
  }
}

export interface OrderItemsRelations {}

export type OrderItemsWithRelations = OrderItems & OrderItemsRelations;
