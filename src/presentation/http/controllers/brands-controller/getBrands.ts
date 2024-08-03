import brandsService from '../../../../application/services/brandsService';
import { Brand } from '../../../../domain/entities';
import { IReturnValueWithPagination } from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetBrandsController
  implements IContoller<Promise<IReturnValueWithPagination<Brand[]>>>
{
  handle(request: RequestObject): Promise<IReturnValueWithPagination<Brand[]>> {
    return brandsService.getBrands({
      filter: request.query?.filter ?? {},
      options: {
        ...(request.query?.options ?? {}),
        withProducts: request.query?.options?.withProducts === 'true',
      },
    });
  }
}

export default new GetBrandsController();
