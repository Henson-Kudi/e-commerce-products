import {
  CreateProductDTO,
  FindProductFilter,
  FindProductOptions,
  FindProductQuery,
  UpdateProductDTO,
} from '../../domain/dtos/product';
import MessageBroker from '../../infrastructure/providers/messageBroker';
import BrandsRepository from '../../infrastructure/repositories/brandsRepository';
import ProductsRepository from '../../infrastructure/repositories/productsRepository';
import CreateProductUseCase from '../use-cases/products/createProduct';
import DeleteProducts from '../use-cases/products/deleteManyProducts';
import DeleteProduct from '../use-cases/products/deleteProduct';
import FindProducts from '../use-cases/products/findProducts';
import GetProduct from '../use-cases/products/getProduct';
import Updateproduct from '../use-cases/products/updateProduct';

export class ProductsService {
  private readonly productRepository = new ProductsRepository();
  private readonly brandsRepository = new BrandsRepository();
  private readonly messageBroker = new MessageBroker();

  getProducts(params: FindProductQuery) {
    return new FindProducts(this.productRepository).execute(params);
  }

  getProduct(params: { id: string } & FindProductOptions) {
    return new GetProduct(this.productRepository).execute(params);
  }

  createProduct(params: CreateProductDTO) {
    return new CreateProductUseCase(
      {
        brandsRepo: this.brandsRepository,
        productsRepo: this.productRepository,
      },
      {
        messageBroker: this.messageBroker,
      }
    ).execute(params);
  }

  updateProduct(params: UpdateProductDTO) {
    return new Updateproduct(
      { productsRepo: this.productRepository },
      { messageBroker: this.messageBroker }
    ).execute(params);
  }

  deleteProduct(params: { id: string }) {
    return new DeleteProduct(this.productRepository, {
      messageBroker: this.messageBroker,
    }).execute(params);
  }

  deleteManyProducts(params: FindProductFilter) {
    return new DeleteProducts(this.productRepository, {
      messageBroker: this.messageBroker,
    }).execute(params);
  }
}

export default new ProductsService();
