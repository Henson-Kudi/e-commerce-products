import { UpdateTaxDTO } from '../../../domain/dtos/tax';
import { Tax } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import { validateUpdateTax } from '../../../utils/joi/tax';
import slugify from '../../../utils/slugify';
import IMessageBroker from '../../providers/messageBroker';
import ITaxesRepository from '../../repositories/taxesRepository';
import IUseCase from '../protocols';
import { taxUpdated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class UpdateTax
  implements
    IUseCase<UpdateTaxDTO & { id: string }, Promise<IReturnValue<Tax>>>
{
  constructor(
    private readonly repos: {
      taxesRepo: ITaxesRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(
    data: UpdateTaxDTO & { id: string }
  ): Promise<IReturnValue<Tax>> {
    const { taxesRepo } = this.repos;
    const { messageBroker } = this.providers;
    // Validate data
    await validateUpdateTax(data);

    // We want to make sure that Tax name is not updated to a Tax that already exist in the db
    if (data?.name) {
      const found = await taxesRepo.getFirstTax({
        where: {
          slug: slugify(data.name),
          id: {
            not: data.id,
          },
        },
      });

      if (found) {
        throw new ErrorClass(
          `Tax already exist with name: ${data?.name}`,
          ResponseCodes.BadRequest
        );
      }
    }

    // Update Tax
    const updated = await taxesRepo.updateTax({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        slug: data.name ? slugify(data.name) : undefined,
      },
    });

    // Publish message of Tax updated for other services to act accordingly
    try {
      await messageBroker.publish({
        topic: taxUpdated,
        message: JSON.stringify(updated),
        key: updated.id,
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: updated,
    };
  }
}
