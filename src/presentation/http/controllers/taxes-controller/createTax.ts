import taxesService from '../../../../application/services/taxesService';
import { Tax } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class CreateTaxController
  implements IContoller<Promise<IReturnValue<Tax | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Tax | null>> {
    return taxesService.createTax({
      ...(request.body ?? {}),
      createdById: request!.headers!.userId,
    });
  }
}

export default new CreateTaxController();
