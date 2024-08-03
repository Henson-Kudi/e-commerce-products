import { FindProductOptions } from '../../../domain/dtos/product';
import { Product } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IProductsRepository from '../../repositories/productsRepository';
import IUseCase from '../protocols';

export default class GetProduct
  implements
    IUseCase<
      FindProductOptions & { id: string },
      Promise<IReturnValue<Product | null>>
    >
{
  constructor(private readonly repo: IProductsRepository) {}

  async execute(
    params: FindProductOptions & {
      id: string;
    }
  ): Promise<IReturnValue<Product | null>> {
    const result = await this.repo.getProductById(params.id, {
      withBrand: params?.withBrand !== false,
      withCategories: params.withCategories !== false,
      withTaxes: params.withTaxes !== false,
    });

    return {
      success: true,
      data: result,
    };
  }
}
