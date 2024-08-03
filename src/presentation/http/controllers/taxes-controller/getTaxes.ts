import taxesService from '../../../../application/services/taxesService';
import { Tax } from '../../../../domain/entities';
import { IReturnValueWithPagination } from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetTaxesController
  implements IContoller<Promise<IReturnValueWithPagination<Tax[]>>>
{
  handle(request: RequestObject): Promise<IReturnValueWithPagination<Tax[]>> {
    return taxesService.getTaxes({
      filter: request.query?.filter ?? {},
      options: {
        ...(request.query?.options ?? {}),
        withProducts: request.query?.options?.withProducts === 'true',
      },
    });
  }
}

export default new GetTaxesController();
