import moment from 'moment';
import productsService from '../../../../application/services/productsService';
import { Product } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class UpdateProductController
  implements IContoller<Promise<IReturnValue<Product | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Product | null>> {
    return productsService.updateProduct({
      ...(request.body ?? {}),
      id: request.params.id,
      lastModifiedById: request.headers!.userId,
      discountStartDate:
        request.body?.discountStartDate &&
        moment.isDate(request.body?.discountStartDate)
          ? moment(request.body?.discountStartDate).toDate()
          : undefined,
      discountEndDate:
        request.body?.discountEndDate &&
        moment.isDate(request.body?.discountEndDate)
          ? moment(request.body?.discountEndDate).toDate()
          : undefined,
    });
  }
}

export default new UpdateProductController();
