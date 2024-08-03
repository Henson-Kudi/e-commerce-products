import { Prisma } from '@prisma/client';
import { Category } from '../../domain/entities';
import { FindCategoryOptions } from '../../domain/dtos/category';

export default interface ICategoriesRepository {
  getCategories(filter: Prisma.CategoryFindManyArgs): Promise<Category[]>;
  getCategoryById(
    id: string,
    options?: FindCategoryOptions
  ): Promise<Category | null>;
  getCategoryBySlug(
    slug: string,
    options?: FindCategoryOptions
  ): Promise<Category | null>;
  getFirstCategory(
    filter: Prisma.CategoryFindFirstArgs
  ): Promise<Category | null>;

  countCategories(filter: Prisma.CategoryCountArgs): Promise<number>;

  createCategory(data: Prisma.CategoryCreateArgs): Promise<Category>;
  upsertCategory(data: Prisma.CategoryUpsertArgs): Promise<Category>;

  updateCategory(data: Prisma.CategoryUpdateArgs): Promise<Category>;

  deleteCategory(filter: Prisma.CategoryDeleteArgs): Promise<Category>;
  deleteCategories(
    filter: Prisma.CategoryDeleteManyArgs
  ): Promise<Prisma.BatchPayload>;
}
