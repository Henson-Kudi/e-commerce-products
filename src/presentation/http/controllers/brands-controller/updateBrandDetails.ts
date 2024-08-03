import brandsService from '../../../../application/services/brandsService';
import { Brand } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class UpdateBrandController
  implements IContoller<Promise<IReturnValue<Brand | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Brand | null>> {
    return brandsService.updateBrand({
      ...(request.body ?? {}),
      id: request.params.id,
      lastModifiedById: request.headers!.userId,
    });
  }
}

export default new UpdateBrandController();
