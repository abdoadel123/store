import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  CustomAuthenticationComponent,
  OrderComponent,
  ProductComponent,
  ShipmentComponent,
} from './components';
import {JWTService} from './components/authentication/services';
import {MongoDataSource} from './datasources';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class StoreTaskApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.loadLocalComponents();

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.dataSource(MongoDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }

  loadLocalComponents(): void {
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(RestExplorerComponent);
    this.component(AuthorizationComponent);

    this.component(CustomAuthenticationComponent);
    this.component(ProductComponent);
    this.component(OrderComponent);
    this.component(ShipmentComponent);
  }
}
