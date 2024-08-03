import { FindProductOptions } from '../../domain/dtos/product';
import { Product } from '../../domain/entities';
import { Prisma } from '@prisma/client';

export default interface IProductsRepository {
  createProduct(data: Prisma.ProductCreateArgs): Promise<Product>;
  upsertProduct(data: Prisma.ProductUpsertArgs): Promise<Product>;

  getProducts(filter: Prisma.ProductFindManyArgs): Promise<Product[]>;
  getProductById(
    id: string,
    options?: FindProductOptions
  ): Promise<Product | null>;
  getProductBySlug(
    slug: string,
    ptions?: FindProductOptions
  ): Promise<Product | null>;
  getFirstProduct(filter: Prisma.ProductFindFirstArgs): Promise<Product | null>;

  countProducts(filter: Prisma.ProductCountArgs): Promise<number>;

  updateProduct(data: Prisma.ProductUpdateArgs): Promise<Product>;

  deleteProduct(filter: Prisma.ProductDeleteArgs): Promise<Product>;
  deleteProducts(
    filter: Prisma.ProductDeleteManyArgs
  ): Promise<Prisma.BatchPayload>;
}
