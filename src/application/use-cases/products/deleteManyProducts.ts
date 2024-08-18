import { FindProductFilter } from '../../../domain/dtos/product';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import IProductsRepository from '../../repositories/productsRepository';
import setupProductsQuery from '../helpers/setupProductsQuery';
import IUseCase from '../protocols';
import { productsDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class DeleteProducts
  implements
    IUseCase<FindProductFilter, Promise<IReturnValue<{ count: number }>>>
{
  constructor(
    private readonly repository: IProductsRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(
    params: FindProductFilter
  ): Promise<IReturnValue<{ count: number }>> {
    const query = setupProductsQuery(params);

    const result = await this.repository.deleteProducts({
      where: query,
    });

    // Publish products deleted message message
    try {
      await this.providers.messageBroker.publish({
        topic: productsDeleted,
        message: JSON.stringify({
          ...result,
          ids: params.id
            ? Array.isArray(params.id)
              ? params.id
              : [params.id]
            : undefined,
        }),
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: result,
    };
  }
}
