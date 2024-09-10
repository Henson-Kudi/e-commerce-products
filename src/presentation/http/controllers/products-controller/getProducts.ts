import productsService from '../../../../application/services/productsService';
import { Product } from '../../../../domain/entities';
import { IReturnValueWithPagination } from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetProductsController
  implements IContoller<Promise<IReturnValueWithPagination<Product[]>>> {
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
        page: request.query?.options?.page && !isNaN(Number(request.query?.options?.page)) ? Number(request.query?.options?.page) : 1,
        limit: request.query?.options?.limit && !isNaN(Number(request.query?.options?.limit)) ? Number(request.query?.options?.limit) : 10,
      },
    });
  }
}

export default new GetProductsController();
