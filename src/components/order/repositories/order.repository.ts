import {Getter, inject} from '@loopback/core';
import {HasManyRepositoryFactory, repository} from '@loopback/repository';
import {BaseRepository} from '../../../common/repositories';
import {MongoDataSource} from '../../../datasources';
import {Order, OrderItems, OrderRelations} from '../models';
import {OrderItemsRepository} from './orderItems.repositories';

export class OrderRepository extends BaseRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  public readonly orderItems: HasManyRepositoryFactory<
    OrderItems,
    typeof Order.prototype.id
  >;
  constructor(
    @inject('datasources.mongo')
    dataSource: MongoDataSource,

    @repository.getter('OrderItemsRepository')
    orderItemsRepositoryGetter: Getter<OrderItemsRepository>,
  ) {
    super(Order, dataSource);

    this.orderItems = this.createHasManyRepositoryFactoryFor(
      'orderItems',
      orderItemsRepositoryGetter,
    );

    this.registerInclusionResolver(
      'orderItems',
      this.orderItems.inclusionResolver,
    );
  }
}
