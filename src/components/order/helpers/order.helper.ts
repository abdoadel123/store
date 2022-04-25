import {StoreTaskApplication} from '../../../application';
import {ProductHelper} from '../../product/helpers';
import {OrderStatus} from '../enums';
import {OrderRepository} from '../repositories';

export class OrderHelper {
  private productHelper: ProductHelper;
  constructor(private app: StoreTaskApplication) {
    this.productHelper = new ProductHelper(app);
  }

  async findById(orderId: string) {
    const orderRepository = await this.app.getRepository(OrderRepository);

    return await orderRepository.findById(orderId);
  }

  async nextStatus(orderId: string) {
    const statusOrder = ['Received', 'QuantityReserved', 'Picked', 'Delivered'];
    const orderRepository = await this.app.getRepository(OrderRepository);

    const order = await orderRepository.findById(orderId, {
      include: ['orderItems'],
    });

    const currentStatusIndex = statusOrder.indexOf(order.status);

    if (order.status == OrderStatus.Picked) {
      if (!order.orderItems) return;

      Promise.all(
        order.orderItems.map(item => {
          return this.productHelper.removeReserved(
            item.productId,
            item.quantity,
          );
        }),
      );
    }
    return await orderRepository.updateById(orderId, {
      status: statusOrder[currentStatusIndex + 1],
    });
  }
}
