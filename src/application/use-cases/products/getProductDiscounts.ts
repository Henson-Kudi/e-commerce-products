import { ProductDiscount } from '@prisma/client';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IUseCase from '../protocols';
import IProductDiscountRepository from '../../repositories/productDiscountRepository';

export default class GetProductDiscounts
  implements IUseCase<string, Promise<IReturnValue<ProductDiscount[]>>>
{
  constructor(private readonly repo: IProductDiscountRepository) {}

  async execute(productId: string): Promise<IReturnValue<ProductDiscount[]>> {
    const result = await this.repo.findByProductId(productId);

    return {
      success: true,
      data: result,
    };
  }
}
