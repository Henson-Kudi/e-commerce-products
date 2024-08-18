import { FindTaxFilter } from '../../../domain/dtos/tax';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import ITaxesRepository from '../../repositories/taxesRepository';
import IUseCase from '../protocols';
import { taxesDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import setupTaxesQuery from '../helpers/setupTaxesQuery';

export default class DeleteTaxes
  implements IUseCase<FindTaxFilter, Promise<IReturnValue<{ count: number }>>>
{
  constructor(
    private readonly repository: ITaxesRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(
    params: FindTaxFilter
  ): Promise<IReturnValue<{ count: number }>> {
    const query = setupTaxesQuery(params);

    const result = await this.repository.deleteTaxes({
      where: query,
    });

    // Publish Taxes deleted message message
    try {
      await this.providers.messageBroker.publish({
        topic: taxesDeleted,
        message: JSON.stringify({
          ...result,
          ids: params.id
            ? Array.isArray(params?.id)
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
