import { Tax } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import slugify from '../../../utils/slugify';
import ITaxesRepository from '../../repositories/taxesRepository';
import IUseCase from '../protocols';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import { taxCreated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import { CreateTaxDTO } from '../../../domain/dtos/tax';
import { validateCreateTax } from '../../../utils/joi/tax';

export default class CreateTaxUseCase
  implements IUseCase<CreateTaxDTO, Promise<IReturnValue<Tax>>>
{
  constructor(
    private readonly repositories: {
      taxesRepo: ITaxesRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(data: CreateTaxDTO): Promise<IReturnValue<Tax>> {
    const { taxesRepo } = this.repositories;
    const { messageBroker } = this.providers;
    // Validate all params
    await validateCreateTax(data);

    // Ensure that product with name does not already exist
    const found = await taxesRepo.getTaxBySlug(slugify(data.name));

    if (found) {
      throw new ErrorClass(
        'Tax with name already exists',
        ResponseCodes.BadRequest
      );
    }

    // Attempt to create Tax
    const newTax = await taxesRepo.createTax({
      data: {
        ...data,
        slug: slugify(data.name),
        products: data?.products
          ? {
              connect: data.products.map((productId) => ({
                id: productId,
              })),
            }
          : undefined,
      },
    });

    // Publish product created message for other services to act accordingly
    try {
      await messageBroker.publish({
        topic: taxCreated,
        message: JSON.stringify(newTax),
        key: newTax.id,
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: newTax,
    };
  }
}
