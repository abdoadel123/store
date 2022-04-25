import {CoreBindings, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {StoreTaskApplication} from '../../../application';
import {Roles} from '../../../common/enums/roles.enum';
import {UserHelper} from '../../authentication/helpers';
import {OrderStatus} from '../../order/enums';
import {OrderHelper} from '../../order/helpers';
import {ShipmentStatus} from '../enums';
import {ShipmentRepository, ShipmentViewRepository} from '../repositories';

export class ShipmentService {
  private orderHelper: OrderHelper;
  private userHelper: UserHelper;

  constructor(
    @repository(ShipmentRepository)
    private shipmentRepository: ShipmentRepository,

    @repository(ShipmentViewRepository)
    private shipmentViewRepository: ShipmentViewRepository,

    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: StoreTaskApplication,
  ) {
    this.orderHelper = new OrderHelper(app);
    this.userHelper = new UserHelper(app);
  }

  async create(orderId: string, carrierId: string) {
    const user = await this.userHelper.findOne(carrierId, Roles.Carrier);
    if (!user) {
      throw new HttpErrors.NotFound(
        `Entity not found: User with id ${carrierId} not found`,
      );
    }

    const order = await this.orderHelper.findById(orderId);

    if (!order) throw new HttpErrors.NotFound('Order not found');

    if (order.status != OrderStatus.QuantityReserved)
      throw new HttpErrors.BadRequest('Order Status must be QuantityReserved');

    const createdShipment = await this.shipmentRepository.create({
      carrierId,
      orderId,
    });

    this.orderHelper.nextStatus(orderId);

    return createdShipment;
  }

  async findAll() {
    return await this.shipmentViewRepository.find();
  }

  async findCarrierShipments(carrierId: string) {
    return await this.shipmentViewRepository.find({
      where: {carrierId},
    });
  }

  async findCustomerShipments(customerId: string) {
    return await this.shipmentViewRepository.find({
      where: {
        'order.customerId': customerId,
      },
    });
  }

  async deliveryShipment(shipmentId: string, carrierId: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: {
        id: shipmentId,
        carrierId,
      },
    });

    if (!shipment) throw new HttpErrors.NotFound('Shipment not found');

    shipment.status = ShipmentStatus.Shipped;
    this.orderHelper.nextStatus(shipment.orderId);
    await this.shipmentRepository.updateById(shipmentId, shipment);
  }
}
