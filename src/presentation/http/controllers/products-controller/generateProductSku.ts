import productsService from '../../../../application/services/productsService';
import IReturnValue from '../../../../domain/valueObjects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GenerateProductSkuController
    implements IContoller<Promise<IReturnValue<{ sku: string }>>> {
    handle(request: RequestObject): Promise<IReturnValue<{ sku: string }>> {
        return productsService.generateProductSku({
            ...(request.body || {}),
        });
    }
}

export default new GenerateProductSkuController();
