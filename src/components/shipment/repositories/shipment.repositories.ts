import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {BaseRepository} from '../../../common/repositories';
import {MongoDataSource} from '../../../datasources';
import {Order} from '../../order/models';
import {OrderRepository} from '../../order/repositories';
import {Shipment, ShipmentRelations} from '../models';

export class ShipmentRepository extends BaseRepository<
  Shipment,
  typeof Shipment.prototype.id,
  ShipmentRelations
> {
  public readonly order: BelongsToAccessor<Order, typeof Shipment.prototype.id>;

  constructor(
    @inject('datasources.mongo')
    dataSource: MongoDataSource,

    @repository.getter('OrderRepository')
    orderRepositoryGetter: Getter<OrderRepository>,
  ) {
    super(Shipment, dataSource);

    this.order = this.createBelongsToAccessorFor(
      'order',
      orderRepositoryGetter,
    );

    this.registerInclusionResolver('order', this.order.inclusionResolver);
  }
}
