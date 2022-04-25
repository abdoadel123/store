import {Component, CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {UserController} from './controllers';
import {UserService} from './services';

export class CustomAuthenticationComponent implements Component {
  controllers = [UserController];
  services = [UserService];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: RestApplication,
  ) {}
}
