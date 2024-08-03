import { Prisma } from '@prisma/client';
import ICategoriesRepository from '../../application/repositories/categoriesRepository';
import { Category } from '../../domain/entities';
import database from '../database';
import { FindCategoryOptions } from '../../domain/dtos/category';

export default class CategoriesRepository implements ICategoriesRepository {
  getCategories(filter: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return database.category.findMany(filter);
  }
  getCategoryById(
    id: string,
    options?: FindCategoryOptions
  ): Promise<Category | null> {
    return database.category.findUnique({
      where: { id },
      include: { products: options?.withProducts },
    });
  }
  getCategoryBySlug(
    slug: string,
    options?: FindCategoryOptions
  ): Promise<Category | null> {
    return database.category.findUnique({
      where: { slug },
      include: { products: options?.withProducts },
    });
  }
  getFirstCategory(
    filter: Prisma.CategoryFindFirstArgs
  ): Promise<Category | null> {
    return database.category.findFirst(filter);
  }
  countCategories(filter: Prisma.CategoryCountArgs): Promise<number> {
    return database.category.count(filter);
  }
  createCategory(data: Prisma.CategoryCreateArgs): Promise<Category> {
    return database.category.create(data);
  }
  upsertCategory(data: Prisma.CategoryUpsertArgs): Promise<Category> {
    return database.category.upsert(data);
  }
  updateCategory(data: Prisma.CategoryUpdateArgs): Promise<Category> {
    return database.category.update(data);
  }
  deleteCategory(filter: Prisma.CategoryDeleteArgs): Promise<Category> {
    return database.category.delete(filter);
  }
  deleteCategories(
    filter: Prisma.CategoryDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return database.category.deleteMany(filter);
  }
}
