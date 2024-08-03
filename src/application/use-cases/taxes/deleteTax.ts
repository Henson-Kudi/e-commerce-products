import { Tax } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IUseCase from '../protocols';
import ITaxesRepository from '../../repositories/taxesRepository';
import ErrorClass from '../../../domain/valueObjects/error';
import { ResponseCodes } from '../../../domain/enums';
import IMessageBroker from '../../providers/messageBroker';
import { taxDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class DeleteTax
  implements IUseCase<{ id: string }, Promise<IReturnValue<Tax | null>>>
{
  constructor(
    private readonly taxRepository: ITaxesRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(params: { id: string }): Promise<IReturnValue<Tax | null>> {
    const { messageBroker } = this.providers;

    const found = await this.taxRepository.getTaxById(params.id);

    if (!found) {
      return {
        success: false,
        error: new ErrorClass(
          'Tax does not exist with given id',
          ResponseCodes.BadRequest
        ),
      };
    }

    const deletedTax = await this.taxRepository.deleteTax({
      where: { id: params.id },
    });

    if (!deletedTax) {
      return {
        success: false,
        error: new ErrorClass(
          'Tax does not exist with given id',
          ResponseCodes.BadRequest
        ),
      };
    }

    // Publish message for other services
    try {
      await messageBroker.publish({
        topic: taxDeleted,
        messages: [
          {
            value: JSON.stringify(deletedTax),
          },
        ],
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: deletedTax,
    };
  }
}
