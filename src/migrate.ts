import {
  UserCredentialsRepository,
  UserRepository,
} from '@loopback/authentication-jwt';
import {SchemaMigrationOptions} from '@loopback/repository';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {StoreTaskApplication} from './application';
import {ProductRepository} from './components/product/repositories';
import {MongoDataSource} from './datasources';
import Products from './static/product.json';
import Users from './static/user.json';

export async function migrate(
  app: StoreTaskApplication,
  options?: SchemaMigrationOptions,
) {
  const existingSchema = options?.existingSchema
    ? options.existingSchema
    : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);
  await app.migrateSchema(options);

  try {
    const ds = await app.get<MongoDataSource>('datasources.mongo');
    const DB = ds.connector?.db;
    await DB.dropDatabase();
    seedUsers(app);
    seedProducts(app);
    createShipmentView(app);
  } catch (err) {
    console.log(err);
  }
}

async function seedUsers(app: StoreTaskApplication) {
  Products;
  const userRepository = await app.getRepository(UserRepository);
  const userCredentialRepository = await app.getRepository(
    UserCredentialsRepository,
  );

  Users.map(async user => {
    const password = await hash(user.password, await genSalt());
    const savedUser = await userRepository.create(_.omit(user, 'password'));
    userRepository.userCredentials(savedUser.id).create({password});
  });
}

async function seedProducts(app: StoreTaskApplication) {
  const productRepository = await app.getRepository(ProductRepository);
  Products.map(async product => {
    productRepository.create(product);
  });
}

async function createShipmentView(app: StoreTaskApplication) {
  const ds = await app.get<MongoDataSource>('datasources.mongo');
  const DB = ds.connector?.db;

  if (DB) {
    const cursor = await DB.listCollections({name: 'ShipmentView'});
    const isCollectionExists = await cursor.hasNext();

    if (isCollectionExists) {
      await DB.collection('ShipmentView').drop();
    }

    await DB.createCollection('ShipmentView', {
      viewOn: 'Shipment',
      pipeline: [
        // Stage 1
        {
          $lookup: {
            from: 'Order',
            localField: 'orderId',
            foreignField: '_id',
            as: 'order',
          },
        },
        // Stage 2
        {
          $unwind: {
            path: '$order',
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
    });
  }
}
