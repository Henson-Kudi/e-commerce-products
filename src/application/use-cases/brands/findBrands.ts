import { FindBrandQuery } from '../../../domain/dtos/brand';
import { Brand } from '../../../domain/entities';
import { IReturnValueWithPagination } from '../../../domain/valueObjects/returnValue';
import IBrandsRepository from '../../repositories/brandsRepository';
import setupPagination from '../helpers/setupPagination';
import setupBrandsQuery from '../helpers/setupBrandsQuery';
import IUseCase from '../protocols';

export default class FindBrands
  implements
    IUseCase<FindBrandQuery, Promise<IReturnValueWithPagination<Brand[]>>>
{
  constructor(private readonly repo: IBrandsRepository) {}

  async execute(
    params: FindBrandQuery
  ): Promise<IReturnValueWithPagination<Brand[]>> {
    const { filter, options } = params;

    const query = setupBrandsQuery(filter);

    const pagination = setupPagination({
      page: options?.page,
      limit: options?.limit,
    });

    const total = await this.repo.countBrands({ where: query });

    const result = await this.repo.getBrands({
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
