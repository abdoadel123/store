import {
  DataObject,
  DefaultCrudRepository,
  Filter,
  juggler,
  Where,
} from '@loopback/repository';
import {Count} from '@loopback/repository/src/common-types';
import {Options} from 'loopback-datasource-juggler';
import {Base} from '../models';

export abstract class BaseRepository<
  T extends Base,
  ID,
  Relations extends object = {},
> extends DefaultCrudRepository<T, ID, Relations> {
  modelClass = this.definePersistedModel(this.entityClass);

  constructor(
    entityClass: typeof Base & {
      prototype: T;
    },
    dataSource: juggler.DataSource,
  ) {
    super(entityClass, dataSource);
  }

  find(filter?: Filter<T>, options?: Options): Promise<(T & Relations)[]> {
    // Filter out soft deleted entries
    filter = filter || {};
    filter.where = filter.where || {};
    (filter.where as any).isDeleted = false;

    // Now call super
    return super.find(filter, options);
  }

  findOne(
    filter?: Filter<T>,
    options?: Options,
  ): Promise<(T & Relations) | null> {
    // Filter out soft deleted entries
    filter = filter || {};
    filter.where = filter.where || {};
    (filter.where as any).isDeleted = false;

    // Now call super
    return super.findOne(filter, options);
  }

  findById(
    id: ID,
    filter?: Filter<T>,
    options?: Options,
  ): Promise<T & Relations> {
    // Filter out soft deleted entries
    filter = filter || {};
    filter.where = filter.where || {};
    (filter.where as any).isDeleted = false;

    // Now call super
    return super.findById(id, filter, options);
  }

  updateAll(
    data: DataObject<T>,
    where?: Where<T>,
    options?: Options,
  ): Promise<Count> {
    // Filter out soft deleted entries
    where = where || {};
    (where as any).isDeleted = false;
    (data as any).updatedAt = new Date();

    // Now call super
    return super.updateAll(data, where, options);
  }

  updateById(id: ID, data: DataObject<T>, options?: Options): Promise<void> {
    (data as any).updatedAt = new Date();
    return super.updateById(id, data, options);
  }

  replaceById(id: ID, data: DataObject<T>, options?: Options): Promise<void> {
    (data as any).updatedAt = new Date();
    return super.replaceById(id, data, options);
  }

  save(entity: T, options?: Options): Promise<T> {
    entity.updatedAt = new Date();
    return super.save(entity);
  }

  update(entity: T, options?: Options): Promise<void> {
    entity.updatedAt = new Date();
    return super.update(entity);
  }

  count(where?: Where<T>, options?: Options): Promise<Count> {
    // Filter out soft deleted entries
    where = where || {};
    (where as any).isDeleted = false;

    // Now call super
    return super.count(where, options);
  }

  softDelete(entity: T, options?: Options): Promise<void> {
    // Do soft delete, no hard delete allowed
    (entity as any).isDeleted = true;
    (entity as any).updatedAt = new Date();
    return super.update(entity, options);
  }

  softDeleteAll(where?: Where<T>, options?: Options): Promise<Count> {
    // Do soft delete, no hard delete allowed
    return this.updateAll(
      {
        isDeleted: true,
        updatedAt: new Date(),
      } as any,
      where,
      options,
    );
  }

  softDeleteById(id: ID, options?: Options): Promise<void> {
    // Do soft delete, no hard delete allowed
    return super.updateById(
      id,
      {
        isDeleted: true,
        updatedAt: new Date(),
      } as any,
      options,
    );
  }

  delete(entity: T, options?: Options): Promise<void> {
    return super.delete(entity, options);
  }

  deleteAll(where?: Where<T>, options?: Options): Promise<Count> {
    return super.deleteAll(where, options);
  }

  deleteById(id: ID, options?: Options): Promise<void> {
    return super.deleteById(id, options);
  }

  upsertWithWhere(where: Where<T>, data: DataObject<T>, options?: Options) {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.isDeleted = false;

    return this.modelClass.upsertWithWhere(where, data, options);
  }
}
