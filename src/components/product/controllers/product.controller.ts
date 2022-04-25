import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {service} from '@loopback/core';
import {Count, Filter} from '@loopback/repository';
import {
  api,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Roles} from '../../../common/enums/roles.enum';
import {ProductDto} from '../dtos';
import {Product} from '../models';
import {ProductService} from '../services';

@authenticate('jwt')
@api({basePath: '/api/products'})
export class ProductController {
  constructor(
    @service(ProductService)
    private productService: ProductService,
  ) {}

  @authorize({allowedRoles: [Roles.Admin]})
  @post('/')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductDto),
        },
      },
    })
    product: ProductDto,
  ): Promise<Product> {
    return await this.productService.create(product);
  }

  @authorize({
    allowedRoles: [Roles.Admin, Roles.Customer],
  })
  @get('/')
  async findAll(
    @param.filter(Product)
    filter?: Filter<Product>,
  ): Promise<Product[]> {
    return await this.productService.find(filter);
  }

  @authorize({
    allowedRoles: [Roles.Admin, Roles.Customer],
  })
  @get('/{id}')
  async findById(
    @param.path.string('id')
    id: string,
  ): Promise<Product> {
    return await this.productService.findById(id);
  }

  @authorize({
    allowedRoles: [Roles.Admin],
  })
  @patch('/{id}')
  async updateById(
    @param.path.string('id')
    id: string,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
  ): Promise<void> {
    return await this.productService.updateById(id, product);
  }

  @authorize({
    allowedRoles: [Roles.Admin],
  })
  @del('/{id}')
  async deleteById(
    @param.path.string('id')
    id: string,
  ): Promise<void> {
    return await this.productService.softDeleteById(id);
  }

  @authorize({
    allowedRoles: [Roles.Admin],
  })
  @del('/')
  async deleteAll(): Promise<Count> {
    return await this.productService.softDeleteAll();
  }
}
