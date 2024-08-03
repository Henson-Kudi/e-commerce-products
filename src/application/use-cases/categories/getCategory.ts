import { Category } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import ICategorysRepository from '../../repositories/categoriesRepository';
import IUseCase from '../protocols';

export default class GetCategory
  implements
    IUseCase<
      { id: string; withProducts?: boolean },
      Promise<IReturnValue<Category | null>>
    >
{
  constructor(private readonly repo: ICategorysRepository) {}

  async execute(params: {
    id: string;
    withProducts?: boolean;
  }): Promise<IReturnValue<Category | null>> {
    const result = await this.repo.getCategoryById(params.id, {
      withProducts: params.withProducts,
    });

    return {
      success: true,
      data: result,
    };
  }
}
