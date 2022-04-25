import {belongsTo, model, property} from '@loopback/repository';
import {Base} from '../../../common/models';
import {Order} from '../../order/models';
import {ShipmentStatus} from '../enums';

@model()
export class Shipment extends Base {
  @property({
    type: 'string',
    required: true,
  })
  carrierId: string;

  @property({
    type: 'string',
    default: ShipmentStatus.Picked,
    jsonSchema: {
      enum: Object.values(ShipmentStatus),
    },
  })
  status: string;

  @belongsTo(() => Order)
  orderId: string;

  [key: string]: any;
  constructor(data?: Partial<Shipment>) {
    super(data);
  }
}

export interface ShipmentRelations {}

export type ShipmentWithRelations = Shipment & ShipmentRelations;
