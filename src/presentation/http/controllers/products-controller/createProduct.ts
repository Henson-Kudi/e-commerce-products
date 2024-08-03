import productsService from '../../../../application/services/productsService';
import { Product } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class CreateProductController
  implements IContoller<Promise<IReturnValue<Product | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Product | null>> {
    return productsService.createProduct({
      ...(request.body ?? {}),
      createdById: request!.headers!.userId,
    });
  }
}

export default new CreateProductController();
