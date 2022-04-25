import {HttpErrors} from '@loopback/rest';
import {StoreTaskApplication} from '../../../application';
import {ProductRepository} from '../repositories';

export class ProductHelper {
  constructor(private app: StoreTaskApplication) {}

  async findById(productId: string) {
    const productRepository = await this.app.getRepository(ProductRepository);

    return await productRepository.findById(productId);
  }

  async reserveQuantity(productId: string, quantity: number) {
    const productRepository = await this.app.getRepository(ProductRepository);

    const product = await productRepository.findById(productId);

    if (quantity > product.quantity)
      throw new HttpErrors.BadRequest(
        `can't reserve this product as exist quantity is ${product.quantity}`,
      );

    product.reservedQuantity += quantity;
    product.quantity -= quantity;

    return await productRepository.updateById(productId, product);
  }

  async removeReserved(productId: string, quantity: number) {
    const productRepository = await this.app.getRepository(ProductRepository);

    const product = await productRepository.findById(productId);

    product.reservedQuantity -= quantity;

    return await productRepository.updateById(productId, product);
  }
}
