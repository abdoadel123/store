import {model, property} from '@loopback/repository';
import {Base} from '../../../common/models';
import {Order} from '../../order/models';

@model({settings: {strict: false}})
export class ShipmentView extends Base {
  @property({
    type: 'string',
  })
  carrierId: string;

  @property({
    type: Order,
  })
  order: Order;

  [key: string]: any;

  constructor(data?: Partial<ShipmentView>) {
    super(data);
  }
}

export interface ShipmentViewRelations {}

export type ShipmentViewRelationsWithRelations = ShipmentView &
  ShipmentViewRelations;
