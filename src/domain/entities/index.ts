// Define your schema entities
import {
  Brand as BrandEntity,
  Product as ProductEntity,
  Category as CategoryEntity,
  Tax as TaxEntity,
} from '@prisma/client';

export type Product = ProductEntity;

export type Brand = BrandEntity;

export type Category = CategoryEntity;
export type Tax = TaxEntity;
