import { Product } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IUseCase from '../protocols';
import IProductsRepository from '../../repositories/productsRepository';
import ErrorClass from '../../../domain/valueObjects/error';
import { ResponseCodes } from '../../../domain/enums';
import IMessageBroker from '../../providers/messageBroker';
import { productDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class DeleteProduct
  implements IUseCase<{ id: string }, Promise<IReturnValue<Product | null>>>
{
  constructor(
    private readonly productRepository: IProductsRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(params: { id: string }): Promise<IReturnValue<Product | null>> {
    const { messageBroker } = this.providers;

    // find product
    const foundProduct = await this.productRepository.getProductById(params.id);

    if (!foundProduct) {
      return {
        success: false,
        error: new ErrorClass(
          'Product does not exist with given id',
          ResponseCodes.BadRequest
        ),
      };
    }

    const deletedProduct = await this.productRepository.deleteProduct({
      where: { id: params.id },
    });

    // Publish message for other services
    try {
      await messageBroker.publish({
        topic: productDeleted,
        messages: [
          {
            value: JSON.stringify(deletedProduct),
          },
        ],
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: deletedProduct,
    };
  }
}
