import productsService from '../../../../application/services/productsService';
import { Product } from '../../../../domain/entities';
import { IReturnValueWithPagination } from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetProductsController
  implements IContoller<Promise<IReturnValueWithPagination<Product[]>>>
{
  handle(
    request: RequestObject
  ): Promise<IReturnValueWithPagination<Product[]>> {
    return productsService.getProducts({
      filter: request.query?.filter ?? {},
      options: {
        ...(request.query?.options ?? {}),
        withBrand: request.query?.options?.withBrand === 'true',
        withCategories: request.query?.options?.withCategories === 'true',
        withTaxes: request.query?.options?.withTaxes === 'true',
      },
    });
  }
}

export default new GetProductsController();
