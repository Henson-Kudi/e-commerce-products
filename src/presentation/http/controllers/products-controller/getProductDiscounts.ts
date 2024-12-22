import { ProductDiscount } from '@prisma/client';
import productsService from '../../../../application/services/productsService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';
import ErrorClass from '../../../../domain/valueObjects/error';
import { ResponseCodes } from '../../../../domain/enums';

export class GetProductDiscountsController
  implements IContoller<Promise<IReturnValue<ProductDiscount[]>>>
{
  async handle(
    request: RequestObject
  ): Promise<IReturnValue<ProductDiscount[]>> {
    if (!request.params?.id) {
      throw new ErrorClass('Product id is required', ResponseCodes.BadRequest);
    }

    const productDiscount = await productsService.getProductDiscounts(
      request.params?.id
    );

    return productDiscount;
  }
}

export default new GetProductDiscountsController();
