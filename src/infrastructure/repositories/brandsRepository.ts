import { Prisma } from '@prisma/client';
import { Brand } from '../../domain/entities';
import database from '../database';
import IBrandsRepository from '../../application/repositories/brandsRepository';
import { FindBrandOptions } from '../../domain/dtos/brand';

export default class BrandsRepository implements IBrandsRepository {
  createBrand(data: Prisma.BrandCreateArgs): Promise<Brand> {
    return database.brand.create(data);
  }
  upsertBrand(data: Prisma.BrandUpsertArgs): Promise<Brand> {
    return database.brand.upsert(data);
  }
  getBrands(filter: Prisma.BrandFindManyArgs): Promise<Brand[]> {
    return database.brand.findMany(filter);
  }
  getBrandById(id: string, options?: FindBrandOptions): Promise<Brand | null> {
    return database.brand.findUnique({
      where: { id },
      include: {
        products: options?.withProducts,
      },
    });
  }
  getBrandBySlug(
    slug: string,
    options?: FindBrandOptions
  ): Promise<Brand | null> {
    return database.brand.findUnique({
      where: { slug },
      include: { products: options?.withProducts },
    });
  }
  getFirstBrand(filter: Prisma.BrandFindFirstArgs): Promise<Brand | null> {
    return database.brand.findFirst(filter);
  }
  countBrands(filter: Prisma.BrandCountArgs): Promise<number> {
    return database.brand.count(filter);
  }
  updateBrand(data: Prisma.BrandUpdateArgs): Promise<Brand> {
    return database.brand.update(data);
  }
  deleteBrand(filter: Prisma.BrandDeleteArgs): Promise<Brand> {
    return database.brand.delete(filter);
  }
  deleteBrands(
    filter: Prisma.BrandDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return database.brand.deleteMany(filter);
  }
}
