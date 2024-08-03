import productsService from '../../../../application/services/productsService';
import { Product } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetProductByIdController
  implements IContoller<Promise<IReturnValue<Product | null>>>
{
  async handle(request: RequestObject): Promise<IReturnValue<Product | null>> {
    const product = await productsService.getProduct({
      id: request.params.id,
      withBrand: request.query?.withBrand === 'true',
      withTaxes: request?.query?.withTaxes === 'true',
      withCategories: request?.query?.withCategories === 'true',
    });

    return product;
  }
}

export default new GetProductByIdController();
