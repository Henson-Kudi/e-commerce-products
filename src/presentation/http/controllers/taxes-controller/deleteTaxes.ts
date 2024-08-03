import taxesService from '../../../../application/services/taxesService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeleteTaxesController
  implements IContoller<Promise<IReturnValue<{ count: number }>>>
{
  handle(request: RequestObject): Promise<IReturnValue<{ count: number }>> {
    return taxesService.deleteManyTaxes({
      ...(request.query ?? {}),
    });
  }
}

export default new DeleteTaxesController();
