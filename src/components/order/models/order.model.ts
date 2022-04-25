import {hasMany, model, property} from '@loopback/repository';
import {Base} from '../../../common/models';
import {OrderStatus} from '../enums';
import {OrderItems} from './orderItems.model';

@model()
export class Order extends Base {
  @property({
    type: 'string',
    required: true,
  })
  customerId: string;

  @property({
    type: 'string',
    default: OrderStatus.Received,
    jsonSchema: {
      enum: Object.values(OrderStatus),
    },
  })
  status: string;

  @hasMany(() => OrderItems)
  orderItems?: OrderItems[];

  [key: string]: any;
  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {}

export type OrderWithRelations = Order & OrderRelations;
