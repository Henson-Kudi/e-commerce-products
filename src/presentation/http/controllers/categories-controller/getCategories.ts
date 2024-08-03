import categoriesService from '../../../../application/services/categoriesService';
import { Category } from '../../../../domain/entities';
import { IReturnValueWithPagination } from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetCategoriesController
  implements IContoller<Promise<IReturnValueWithPagination<Category[]>>>
{
  handle(
    request: RequestObject
  ): Promise<IReturnValueWithPagination<Category[]>> {
    return categoriesService.getCategories({
      filter: request.query?.filter ?? {},
      options: {
        ...(request.query?.options ?? {}),
        withProducts: request.query?.options?.withProducts === 'true',
      },
    });
  }
}

export default new GetCategoriesController();
