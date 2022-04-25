import {Filter, repository} from '@loopback/repository';
import {ProductDto} from '../dtos';
import {Product} from '../models/product.model';
import {ProductRepository} from '../repositories';

export class ProductService {
  constructor(
    @repository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async create(product: ProductDto) {
    return await this.productRepository.create(product);
  }

  async createMany(product: ProductDto[]) {
    return await this.productRepository.createAll(product);
  }

  async find(filter?: Filter<Product>) {
    return await this.productRepository.find(filter);
  }

  async findById(id: string) {
    return await this.productRepository.findById(id);
  }

  async updateById(id: string, product: ProductDto) {
    return await this.productRepository.updateById(id, product);
  }

  async softDeleteById(id: string) {
    return await this.productRepository.softDeleteById(id);
  }

  async softDeleteAll() {
    return await this.productRepository.softDeleteAll();
  }
}
