import productsService from '../../../../application/services/productsService';
import { Product } from '../../../../domain/entities';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetProductBySlugController
  implements IContoller<Promise<IReturnValue<Product | null>>>
{
  async handle(request: RequestObject): Promise<IReturnValue<Product | null>> {
    if (!request.params.slug) {
      throw new Error('Slug is required');
    }

    const product = await productsService.getProductBySlug({
      slug: request.params.slug,
      withBrand: request.query?.withBrand === 'true',
      withTaxes: request?.query?.withTaxes === 'true',
      withCategories: request?.query?.withCategories === 'true',
      withDiscounts: request?.query?.withDiscounts === 'true',
    });

    return product;
  }
}

export default new GetProductBySlugController();
