import {Component, CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {OrderController} from './controllers';
import {OrderItemsRepository, OrderRepository} from './repositories';
import {OrderService} from './services';

export class OrderComponent implements Component {
  controllers = [OrderController];
  services = [OrderService];
  repositories = [OrderItemsRepository, OrderRepository];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: RestApplication,
  ) {}
}
