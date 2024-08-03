import taxesService from '../../../../application/services/taxesService';
import { Tax } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetTaxByIdController
  implements IContoller<Promise<IReturnValue<Tax | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Tax | null>> {
    return taxesService.getTax({
      id: request.params.id,
      withProducts: request.query.withProducts === 'true',
    });
  }
}

export default new GetTaxByIdController();
