import {inject} from '@loopback/core';
import {BaseRepository} from '../../../common/repositories';
import {MongoDataSource} from '../../../datasources';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends BaseRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Product, dataSource);
  }
}
