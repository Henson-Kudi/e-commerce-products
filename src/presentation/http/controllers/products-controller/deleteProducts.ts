import productsService from '../../../../application/services/productsService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeleteProductsController
  implements IContoller<Promise<IReturnValue<{ count: number }>>>
{
  handle(request: RequestObject): Promise<IReturnValue<{ count: number }>> {
    return productsService.deleteManyProducts({
      ...(request.query || {}),
    });
  }
}

export default new DeleteProductsController();
