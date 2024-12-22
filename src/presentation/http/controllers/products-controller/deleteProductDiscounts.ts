import { Prisma } from '@prisma/client';
import productsService from '../../../../application/services/productsService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeleteProductDiscountsController
  implements IContoller<Promise<IReturnValue<Prisma.BatchPayload | null>>>
{
  handle(
    request: RequestObject
  ): Promise<IReturnValue<Prisma.BatchPayload | null>> {
    return productsService.deleteProductDiscounts({
      actor:
        request?.headers?.userId ??
        request?.headers?.['user-id'] ??
        request?.headers?.userid,
      ...(request.body || {}),
    });
  }
}

export default new DeleteProductDiscountsController();
