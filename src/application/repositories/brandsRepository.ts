import { Prisma } from '@prisma/client';
import { Brand } from '../../domain/entities';
import { FindBrandOptions } from '../../domain/dtos/brand';

export default interface IBrandsRepository {
  getBrands(filter: Prisma.BrandFindManyArgs): Promise<Brand[]>;
  getBrandById(id: string, options?: FindBrandOptions): Promise<Brand | null>;
  getBrandBySlug(
    slug: string,
    options?: FindBrandOptions
  ): Promise<Brand | null>;
  getFirstBrand(filter: Prisma.BrandFindFirstArgs): Promise<Brand | null>;
  countBrands(filter: Prisma.BrandCountArgs): Promise<number>;

  createBrand(data: Prisma.BrandCreateArgs): Promise<Brand>;
  upsertBrand(data: Prisma.BrandUpsertArgs): Promise<Brand>;

  updateBrand(data: Prisma.BrandUpdateArgs): Promise<Brand>;

  deleteBrand(filter: Prisma.BrandDeleteArgs): Promise<Brand>;
  deleteBrands(
    filter: Prisma.BrandDeleteManyArgs
  ): Promise<Prisma.BatchPayload>;
}
