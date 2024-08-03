import { FindTaxOptions } from '../../../domain/dtos/tax';
import { Tax } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import ITaxesRepository from '../../repositories/taxesRepository';
import IUseCase from '../protocols';

export default class GetTax
  implements
    IUseCase<
      { id: string } & FindTaxOptions,
      Promise<IReturnValue<Tax | null>>
    >
{
  constructor(private readonly repo: ITaxesRepository) {}

  async execute(
    params: {
      id: string;
    } & FindTaxOptions
  ): Promise<IReturnValue<Tax | null>> {
    const result = await this.repo.getTaxById(params.id, {
      withProducts: params.withProducts,
    });

    return {
      success: true,
      data: result,
    };
  }
}
