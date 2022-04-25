import {Component, CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {ShipmentController} from './controllers';
import {ShipmentRepository, ShipmentViewRepository} from './repositories';
import {ShipmentService} from './services';

export class ShipmentComponent implements Component {
  controllers = [ShipmentController];
  services = [ShipmentService];
  repositories = [ShipmentRepository, ShipmentViewRepository];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: RestApplication,
  ) {}
}
