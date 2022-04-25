import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {BaseRepository} from '../../../common/repositories';
import {MongoDataSource} from '../../../datasources';
import {Product} from '../../product/models';
import {ProductRepository} from '../../product/repositories';
import {OrderItems, OrderItemsRelations} from '../models';

export class OrderItemsRepository extends BaseRepository<
  OrderItems,
  typeof OrderItems.prototype.id,
  OrderItemsRelations
> {
  public readonly product: BelongsToAccessor<
    Product,
    typeof OrderItems.prototype.id
  >;

  constructor(
    @inject('datasources.mongo')
    dataSource: MongoDataSource,

    @repository.getter('ProductRepository')
    productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(OrderItems, dataSource);

    this.product = this.createBelongsToAccessorFor(
      'product',
      productRepositoryGetter,
    );

    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
