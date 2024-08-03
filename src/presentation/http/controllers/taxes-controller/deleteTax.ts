import taxesService from '../../../../application/services/taxesService';
import { Tax } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeleteTaxController
  implements IContoller<Promise<IReturnValue<Tax | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Tax | null>> {
    return taxesService.deleteTax({
      id: request.params.id,
    });
  }
}

export default new DeleteTaxController();
