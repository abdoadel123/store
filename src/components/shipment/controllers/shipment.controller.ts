import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, service} from '@loopback/core';
import {
  api,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Roles} from '../../../common/enums/roles.enum';
import {ShipmentDto} from '../dtos';
import {Shipment} from '../models';
import {ShipmentService} from '../services';

@authenticate('jwt')
@api({basePath: '/api/Shipments'})
export class ShipmentController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private user: any,

    @service(ShipmentService)
    private shipmentService: ShipmentService,
  ) {}

  @authorize({
    allowedRoles: [Roles.Admin, Roles.Carrier],
  })
  @post('/')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ShipmentDto),
        },
      },
    })
    shipment: ShipmentDto,

    @param.query.string('carrierId')
    carrierId: string,
  ): Promise<Shipment> {
    if (this.user.role == Roles.Admin && !carrierId) {
      throw new HttpErrors.BadRequest('carrier Id Required');
    } else if (this.user.role == Roles.Carrier) {
      carrierId = this.user.id;
    }
    return await this.shipmentService.create(shipment.orderId, carrierId);
  }

  @get('/')
  async findAll() {
    switch (this.user.role) {
      case Roles.Carrier:
        return await this.shipmentService.findCarrierShipments(this.user.id);
      case Roles.Customer:
        return await this.shipmentService.findCustomerShipments(this.user.id);
      default:
        return await this.shipmentService.findAll();
    }
  }

  @authorize({
    allowedRoles: [Roles.Carrier],
  })
  @patch('/{id}/deliver')
  async deliverShipment(
    @param.path.string('id')
    id: string,
  ) {
    return await this.shipmentService.deliveryShipment(id, this.user.id);
  }
}
