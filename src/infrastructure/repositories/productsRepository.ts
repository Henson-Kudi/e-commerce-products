import { Prisma } from '@prisma/client';
import IProductsRepository from '../../application/repositories/productsRepository';
import { Product } from '../../domain/entities';
import database from '../database';
import { FindProductOptions } from '../../domain/dtos/product';

export default class ProductsRepository implements IProductsRepository {
  createProduct(data: Prisma.ProductCreateArgs): Promise<Product> {
    return database.product.create(data);
  }

  upsertProduct(data: Prisma.ProductUpsertArgs): Promise<Product> {
    return database.product.upsert(data);
  }

  getProducts(filter: Prisma.ProductFindManyArgs): Promise<Product[]> {
    return database.product.findMany(filter);
  }

  getProductById(
    id: string,
    options?: FindProductOptions
  ): Promise<Product | null> {
    return database.product.findUnique({
      where: { id },
      include: {
        brand: options?.withBrand,
        categories: options?.withCategories,
        taxes: options?.withTaxes,
      },
    });
  }

  getProductBySlug(
    slug: string,
    options?: FindProductOptions
  ): Promise<Product | null> {
    return database.product.findUnique({
      where: { slug },
      include: {
        brand: options?.withBrand,
        categories: options?.withCategories,
        taxes: options?.withTaxes,
      },
    });
  }

  getFirstProduct(
    filter: Prisma.ProductFindFirstArgs
  ): Promise<Product | null> {
    return database.product.findFirst(filter);
  }

  countProducts(filter: Prisma.ProductCountArgs): Promise<number> {
    return database.product.count(filter);
  }

  updateProduct(data: Prisma.ProductUpdateArgs): Promise<Product> {
    return database.product.update(data);
  }

  deleteProduct(filter: Prisma.ProductDeleteArgs): Promise<Product> {
    return database.product.delete(filter);
  }

  deleteProducts(
    filter: Prisma.ProductDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return database.product.deleteMany(filter);
  }
}
