import { FindProductOptions } from '../../../domain/dtos/product';
import { Product } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IProductsRepository from '../../repositories/productsRepository';
import IUseCase from '../protocols';

export default class GetProductBySlug
  implements
    IUseCase<
      FindProductOptions & { slug: string },
      Promise<IReturnValue<Product | null>>
    >
{
  constructor(private readonly repo: IProductsRepository) {}

  async execute(
    params: FindProductOptions & {
      slug: string;
    }
  ): Promise<IReturnValue<Product | null>> {
    const result = await this.repo.getProductBySlug(params.slug, {
      withBrand: !!params?.withBrand,
      withCategories: !!params?.withCategories,
      withTaxes: !!params?.withTaxes,
      withDiscounts: !!params?.withDiscounts,
    });

    return {
      success: true,
      data: result,
    };
  }
}
