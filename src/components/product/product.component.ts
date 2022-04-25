import {Component, CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {ProductController} from './controllers';
import {ProductRepository} from './repositories';
import {ProductService} from './services';

export class ProductComponent implements Component {
  controllers = [ProductController];
  services = [ProductService];
  repositories = [ProductRepository];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: RestApplication,
  ) {}
}
