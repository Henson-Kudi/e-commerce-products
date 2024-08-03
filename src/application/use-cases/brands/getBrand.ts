import { Brand } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IBrandsRepository from '../../repositories/brandsRepository';
import IUseCase from '../protocols';

export default class GetBrand
  implements
    IUseCase<
      { id: string; withProducts?: boolean },
      Promise<IReturnValue<Brand | null>>
    >
{
  constructor(private readonly repo: IBrandsRepository) {}

  async execute(params: {
    id: string;
    withProducts?: boolean;
  }): Promise<IReturnValue<Brand | null>> {
    const result = await this.repo.getBrandById(params.id, {
      withProducts: params.withProducts,
    });

    return {
      success: true,
      data: result,
    };
  }
}
