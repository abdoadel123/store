import {inject} from '@loopback/core';
import {BaseRepository} from '../../../common/repositories';
import {MongoDataSource} from '../../../datasources';
import {ShipmentView, ShipmentViewRelations} from '../models';

export class ShipmentViewRepository extends BaseRepository<
  ShipmentView,
  typeof ShipmentView.prototype.id,
  ShipmentViewRelations
> {
  constructor(
    @inject('datasources.mongo')
    dataSource: MongoDataSource,
  ) {
    super(ShipmentView, dataSource);
  }
}
