import taxesService from '../../../../application/services/taxesService';
import { Tax } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class UpdateTaxController
  implements IContoller<Promise<IReturnValue<Tax | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Tax | null>> {
    return taxesService.updateTax({
      ...(request.body ?? {}),
      id: request.params.id,
      lastModifiedById: request.headers!.userId,
    });
  }
}

export default new UpdateTaxController();
