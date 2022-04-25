import {model, property} from '@loopback/repository';

@model()
export class OrderItemsDto {
  @property({
    type: 'string',
    required: true,
  })
  productId: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;
}
