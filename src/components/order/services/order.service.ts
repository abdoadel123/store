import {CoreBindings, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {StoreTaskApplication} from '../../../application';
import {Roles} from '../../../common/enums/roles.enum';
import {UserHelper} from '../../authentication/helpers';
import {ProductHelper} from '../../product/helpers';
import {OrderItemsDto} from '../dtos';
import {OrderStatus} from '../enums';
import {OrderRepository} from '../repositories';

export class OrderService {
  private productHelper: ProductHelper;
  private userHelper: UserHelper;

  constructor(
    @repository(OrderRepository)
    private orderRepository: OrderRepository,

    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: StoreTaskApplication,
  ) {
    this.productHelper = new ProductHelper(app);
    this.userHelper = new UserHelper(app);
  }

  async create(orderItems: OrderItemsDto[], customerId: string) {
    const user = await this.userHelper.findOne(customerId, Roles.Customer);
    if (!user) {
      throw new HttpErrors.NotFound(
        `Entity not found: User with id ${customerId} not found`,
      );
    }

    await Promise.all(
      orderItems.map(async item => {
        await this.productHelper.findById(item.productId);
      }),
    );

    const order = await this.orderRepository.create({
      customerId: customerId,
    });

    Promise.all(
      orderItems.map(item => {
        this.orderRepository.orderItems(order.id).create(item);
      }),
    );

    return order;
  }

  async find(customerId?: string) {
    return await this.orderRepository.find({
      where: {customerId},
      include: [
        {
          relation: 'orderItems',
          scope: {
            include: ['product'],
          },
        },
      ],
    });
  }

  async reserveOrder(orderId: string) {
    const order = await this.orderRepository.findById(orderId, {
      include: ['orderItems'],
    });

    if (!order.orderItems) return;

    return await Promise.all([
      ...order.orderItems.map(item => {
        return this.productHelper.reserveQuantity(
          item.productId,
          item.quantity,
        );
      }),
      this.orderRepository.updateById(orderId, {
        status: OrderStatus.QuantityReserved,
      }),
    ]);
  }
}
