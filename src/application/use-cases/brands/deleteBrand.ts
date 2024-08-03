import { Brand } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IUseCase from '../protocols';
import IBrandsRepository from '../../repositories/brandsRepository';
import ErrorClass from '../../../domain/valueObjects/error';
import { ResponseCodes } from '../../../domain/enums';
import IMessageBroker from '../../providers/messageBroker';
import { brandDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class DeleteBrand
  implements IUseCase<{ id: string }, Promise<IReturnValue<Brand | null>>>
{
  constructor(
    private readonly brandRepository: IBrandsRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(params: { id: string }): Promise<IReturnValue<Brand | null>> {
    const { messageBroker } = this.providers;

    const found = await this.brandRepository.getBrandById(params.id);

    if (!found) {
      return {
        success: false,
        error: new ErrorClass(
          'Brand does not exist with given id',
          ResponseCodes.BadRequest
        ),
      };
    }

    // Ensure that the categories to be deleted are not attached to a product
    const count = await this.brandRepository.countBrands({
      where: {
        id: params.id,
        products: { none: {} },
      },
    });

    if (count) {
      throw new ErrorClass(
        'Brand is attached to one or more products. Please update all product brands first',
        ResponseCodes.BadRequest
      );
    }

    const deletedBrand = await this.brandRepository.deleteBrand({
      where: { id: params.id },
    });

    if (!deletedBrand) {
      return {
        success: false,
        error: new ErrorClass(
          'Brand does not exist with given id',
          ResponseCodes.BadRequest
        ),
      };
    }

    // Publish message for other services
    try {
      await messageBroker.publish({
        topic: brandDeleted,
        messages: [
          {
            value: JSON.stringify(deletedBrand),
          },
        ],
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: deletedBrand,
    };
  }
}
