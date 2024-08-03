import { UpdateBrandDTO } from '../../../domain/dtos/brand';
import { Brand } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import { validateUpdateBrand } from '../../../utils/joi/brand';
import slugify from '../../../utils/slugify';
import IMessageBroker from '../../providers/messageBroker';
import IBrandsRepository from '../../repositories/brandsRepository';
import IUseCase from '../protocols';
import { brandUpdated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class UpdateBrand
  implements
    IUseCase<UpdateBrandDTO & { id: string }, Promise<IReturnValue<Brand>>>
{
  constructor(
    private readonly repos: {
      brandsRepo: IBrandsRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(
    data: UpdateBrandDTO & { id: string }
  ): Promise<IReturnValue<Brand>> {
    const { brandsRepo } = this.repos;
    const { messageBroker } = this.providers;
    // Validate data
    await validateUpdateBrand(data);

    // We want to make sure that Brand name is not updated to a Brand that already exist in the db
    if (data?.name) {
      const found = await brandsRepo.getFirstBrand({
        where: {
          slug: slugify(data.name),
          id: {
            not: data.id,
          },
        },
      });

      if (found) {
        throw new ErrorClass(
          `Brand already exist with name: ${data?.name}`,
          ResponseCodes.BadRequest
        );
      }
    }

    // Update Brand
    const updated = await brandsRepo.updateBrand({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        slug: data?.name ? slugify(data.name) : undefined,
      },
    });

    // Publish message of Brand updated for other services to act accordingly
    try {
      await messageBroker.publish({
        topic: brandUpdated,
        messages: [
          {
            value: JSON.stringify(updated),
          },
        ],
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
