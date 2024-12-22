import { ProductDiscount } from '@prisma/client';
import productsService from '../../../../application/services/productsService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class CreateProductDiscountsController
  implements IContoller<Promise<IReturnValue<ProductDiscount[]>>>
{
  handle(request: RequestObject): Promise<IReturnValue<ProductDiscount[]>> {
    return productsService.createProductDiscounts({
      actor:
        request?.headers?.userId ??
        request?.headers?.['user-id'] ??
        request?.headers?.userid,
      ...(request.body || {}),
    });
  }
}

export default new CreateProductDiscountsController();
