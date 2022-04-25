import {model, property} from '@loopback/repository';

@model()
export class ShipmentDto {
  @property({
    type: 'string',
    required: true,
  })
  orderId: string;
}
