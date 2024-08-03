import { FindTaxQuery } from '../../../domain/dtos/tax';
import { Tax } from '../../../domain/entities';
import { IReturnValueWithPagination } from '../../../domain/valueObjects/returnValue';
import ITaxesRepository from '../../repositories/taxesRepository';
import setupPagination from '../helpers/setupPagination';
import setupTaxesQuery from '../helpers/setupTaxesQuery';
import IUseCase from '../protocols';

export default class FindTaxs
  implements IUseCase<FindTaxQuery, Promise<IReturnValueWithPagination<Tax[]>>>
{
  constructor(private readonly repo: ITaxesRepository) {}

  async execute(
    params: FindTaxQuery
  ): Promise<IReturnValueWithPagination<Tax[]>> {
    const { filter, options } = params;

    const query = setupTaxesQuery(filter);

    const pagination = setupPagination({
      page: options?.page,
      limit: options?.limit,
    });

    const total = await this.repo.countTaxes({ where: query });

    const result = await this.repo.getTaxes({
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
