import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, service} from '@loopback/core';
import {
  api,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Roles} from '../../../common/enums/roles.enum';
import {OrderItemsDto} from '../dtos';
import {Order} from '../models';
import {OrderService} from '../services';

@authenticate('jwt')
@authorize({allowedRoles: [Roles.Admin, Roles.Customer]})
@api({basePath: '/api/orders'})
export class OrderController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private user: any,

    @service(OrderService)
    private orderService: OrderService,
  ) {}

  @authorize({
    allowedRoles: [Roles.Admin, Roles.Customer],
  })
  @post('/')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(OrderItemsDto),
          },
        },
      },
    })
    orderItems: OrderItemsDto[],

    @param.query.string('customerId')
    customerId: string,
  ): Promise<Order> {
    if (this.user.role == Roles.Admin && !customerId) {
      throw new HttpErrors.BadRequest('customer Id Required');
    } else if (this.user.role == Roles.Customer) {
      customerId = this.user.id;
    }
    return await this.orderService.create(orderItems, customerId);
  }

  @authorize({
    allowedRoles: [Roles.Customer],
  })
  @get('/')
  async findAll(): Promise<Order[]> {
    return await this.orderService.find(this.user.id);
  }

  @authorize({
    allowedRoles: [Roles.Admin],
  })
  @patch('/{id}/reserve-quantity')
  async reserveQuantity(
    @param.path.string('id')
    id: string,
  ) {
    return await this.orderService.reserveOrder(id);
  }
}
