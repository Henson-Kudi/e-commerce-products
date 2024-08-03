import brandsService from '../../../../application/services/brandsService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeleteBrandsController
  implements IContoller<Promise<IReturnValue<{ count: number }>>>
{
  handle(request: RequestObject): Promise<IReturnValue<{ count: number }>> {
    return brandsService.deleteManyBrands({
      ...(request.query?.filter ?? {}),
    });
  }
}

export default new DeleteBrandsController();
