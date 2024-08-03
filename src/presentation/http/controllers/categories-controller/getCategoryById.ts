import categoriesService from '../../../../application/services/categoriesService';
import { Category } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetCategoryByIdController
  implements IContoller<Promise<IReturnValue<Category | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Category | null>> {
    return categoriesService.getCategory({
      id: request.params.id,
      withProducts: request.query.withProducts === 'true',
    });
  }
}

export default new GetCategoryByIdController();
