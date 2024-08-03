import categoriesService from '../../../../application/services/categoriesService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeleteCategoriesController
  implements IContoller<Promise<IReturnValue<{ count: number }>>>
{
  handle(request: RequestObject): Promise<IReturnValue<{ count: number }>> {
    return categoriesService.deleteManyCategories({
      ...(request.query?.filter ?? {}),
    });
  }
}

export default new DeleteCategoriesController();
