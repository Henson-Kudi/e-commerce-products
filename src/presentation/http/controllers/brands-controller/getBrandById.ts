import brandsService from '../../../../application/services/brandsService';
import { Brand } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetBrandByIdController
  implements IContoller<Promise<IReturnValue<Brand | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Brand | null>> {
    return brandsService.getBrand({
      id: request.params.id,
      withProducts: request.query.withProducts === 'true',
    });
  }
}

export default new GetBrandByIdController();
