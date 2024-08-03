import categoriesService from '../../../../application/services/categoriesService';
import { Category } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class UpdateCategoryController
  implements IContoller<Promise<IReturnValue<Category | null>>>
{
  handle(request: RequestObject): Promise<IReturnValue<Category | null>> {
    return categoriesService.updateCategory({
      ...(request.body ?? {}),
      id: request.params.id,
      lastModifiedById: request.headers!.userId,
    });
  }
}

export default new UpdateCategoryController();
