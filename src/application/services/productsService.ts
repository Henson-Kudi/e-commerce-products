import { ProductStatus } from '../../domain/constants';
import {
  CreateProductDTO,
  FindProductFilter,
  FindProductOptions,
  FindProductQuery,
  ICreateProductDiscountDTO,
  ICreateProductDiscountsDTO,
  UpdateProductDTO,
} from '../../domain/dtos/product';
import messageBroker from '../../infrastructure/providers/messageBroker';
import BrandsRepository from '../../infrastructure/repositories/brandsRepository';
import ProductDiscountsRepository from '../../infrastructure/repositories/productDiscountsRepository';
import ProductsRepository from '../../infrastructure/repositories/productsRepository';
import { DiscountStrategy } from '../../utils/types/others';
import setupProductsQuery from '../use-cases/helpers/setupProductsQuery';
import CreateProductUseCase from '../use-cases/products/createProduct';
import CreateProductsDiscountUseCase from '../use-cases/products/createProductsDiscount';
import DeleteProducts from '../use-cases/products/deleteManyProducts';
import DeleteProduct from '../use-cases/products/deleteProduct';
import DeleteProductDiscounts from '../use-cases/products/deleteProductDiscounts';
import FindProducts from '../use-cases/products/findProducts';
import GenerateProductSku from '../use-cases/products/generateProductSku';
import GetProduct from '../use-cases/products/getProduct';
import GetProductBySlug from '../use-cases/products/getProductBySlug';
import GetProductDiscounts from '../use-cases/products/getProductDiscounts';
import Updateproduct from '../use-cases/products/updateProduct';

export class ProductsService {
  private readonly productRepository = new ProductsRepository();
  private readonly brandsRepository = new BrandsRepository();
  private readonly productDiscountsRepository =
    new ProductDiscountsRepository();

  getProducts(params: FindProductQuery) {
    return new FindProducts(this.productRepository).execute(params);
  }

  getProduct(params: { id: string } & FindProductOptions) {
    return new GetProduct(this.productRepository).execute(params);
  }

  getProductBySlug(params: { slug: string } & FindProductOptions) {
    return new GetProductBySlug(this.productRepository).execute(params);
  }

  getProductDiscounts(productId: string) {
    return new GetProductDiscounts(this.productDiscountsRepository).execute(
      productId
    );
  }

  deleteProductDiscounts(params: { discountIds: string[] }) {
    return new DeleteProductDiscounts(this.productDiscountsRepository, {
      messageBroker,
    }).execute(params);
  }

  createProductsDiscount(params: ICreateProductDiscountDTO) {
    return new CreateProductsDiscountUseCase(
      this.productDiscountsRepository,
      this.productRepository,
      { messageBroker }
    ).execute(params);
  }

  async createProductDiscounts(params: ICreateProductDiscountsDTO) {
    const filter = params?.filterRules
      ? setupProductsQuery(params?.filterRules)
      : {};
    const products = await this.productRepository.getProducts({
      where: {
        ...filter,
        status: ProductStatus.ACTIVE,
      },
      select: { id: true },
    });

    return await new CreateProductsDiscountUseCase(
      this.productDiscountsRepository,
      this.productRepository,
      { messageBroker }
    ).execute({
      productIds: products.map((item) => item.id),
      autoApply: true,
      discountName: params.name,
      discountType: params.type,
      discountValue: params.value,
      endDate: new Date(params.endDate),
      startDate: new Date(params.startDate),
      isActive: params.isActive ?? true,
      strategy: params.bulkDiscountStrategy ?? DiscountStrategy.OVERRIDE,
    });
  }

  createProduct(params: CreateProductDTO) {
    return new CreateProductUseCase(
      {
        brandsRepo: this.brandsRepository,
        productsRepo: this.productRepository,
      },
      {
        messageBroker: messageBroker,
      }
    ).execute(params);
  }

  updateProduct(params: UpdateProductDTO) {
    return new Updateproduct(
      { productsRepo: this.productRepository },
      { messageBroker: messageBroker }
    ).execute(params);
  }

  deleteProduct(params: { id: string }) {
    return new DeleteProduct(this.productRepository, {
      messageBroker: messageBroker,
    }).execute(params);
  }

  deleteManyProducts(params: FindProductFilter) {
    return new DeleteProducts(this.productRepository, {
      messageBroker: messageBroker,
    }).execute(params);
  }

  generateProductSku(params: { name: string; brandName?: string }) {
    return new GenerateProductSku(this.productRepository).execute(params);
  }
}

export default new ProductsService();
