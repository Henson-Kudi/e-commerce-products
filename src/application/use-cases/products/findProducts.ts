import { FindProductQuery } from '../../../domain/dtos/product';
import { Product } from '../../../domain/entities';
import { IReturnValueWithPagination } from '../../../domain/valueObjects/returnValue';
import IProductsRepository from '../../repositories/productsRepository';
import setupPagination from '../helpers/setupPagination';
import setupProductsQuery from '../helpers/setupProductsQuery';
import IUseCase from '../protocols';

export default class FindProducts
  implements
    IUseCase<FindProductQuery, Promise<IReturnValueWithPagination<Product[]>>>
{
  constructor(private readonly repo: IProductsRepository) {}

  async execute(
    params: FindProductQuery
  ): Promise<IReturnValueWithPagination<Product[]>> {
    const { filter, options } = params;

    const query = setupProductsQuery(filter);

    const queryOptions: Record<string, boolean> = {};

    const pagination = setupPagination({
      page: options?.page,
      limit: options?.limit,
    });

    // Setup query options
    if (options?.withBrand) {
      queryOptions.brand = true;
    }

    if (options?.withCategories) {
      queryOptions.categories = true;
    }

    if (options?.withTaxes) {
      queryOptions.taxes = true;
    }

    const total = await this.repo.countProducts({ where: query });

    const result = await this.repo.getProducts({
      where: query,
      include: queryOptions,
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
