import { FindCategoryQuery } from '../../../domain/dtos/category';
import { Category } from '../../../domain/entities';
import { IReturnValueWithPagination } from '../../../domain/valueObjects/returnValue';
import ICategoriesRepository from '../../repositories/categoriesRepository';
import setupPagination from '../helpers/setupPagination';
import setupCategoriesQuery from '../helpers/setupCategoriesQuery';
import IUseCase from '../protocols';

export default class FindCategorys
  implements
    IUseCase<
      FindCategoryQuery,
      Promise<IReturnValueWithPagination<Category[]>>
    >
{
  constructor(private readonly repo: ICategoriesRepository) {}

  async execute(
    params: FindCategoryQuery
  ): Promise<IReturnValueWithPagination<Category[]>> {
    const { filter, options } = params;

    const query = setupCategoriesQuery(filter);

    const pagination = setupPagination({
      page: options?.page,
      limit: options?.limit,
    });

    const total = await this.repo.countCategories({ where: query });

    const result = await this.repo.getCategories({
      where: query,
      include: { products: options?.withProducts },
      skip: pagination.skip,
      take: pagination.limit,
    });

    return {
      success: true,
      data: {
        ...pagination,
        data: result,
        total,
      },
    };
  }
}
