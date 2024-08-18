import { FindBrandFilter } from '../../../domain/dtos/brand';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import IBrandsRepository from '../../repositories/brandsRepository';
import setupBrandsQuery from '../helpers/setupBrandsQuery';
import IUseCase from '../protocols';
import { brandsDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import ErrorClass from '../../../domain/valueObjects/error';
import { ResponseCodes } from '../../../domain/enums';

export default class DeleteBrands
  implements
    IUseCase<FindBrandFilter, Promise<IReturnValue<{ count: number }>>>
{
  constructor(
    private readonly repository: IBrandsRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(
    params: FindBrandFilter
  ): Promise<IReturnValue<{ count: number }>> {
    const query = setupBrandsQuery(params);

    // Ensure that the brands to be deleted are not attached to a product
    const count = await this.repository.countBrands({
      where: {
        ...query,
        products: { none: {} },
      },
    });

    if (count) {
      throw new ErrorClass(
        'Brands are attached to one or more products. Please update all product brands first!',
        ResponseCodes.BadRequest
      );
    }

    const result = await this.repository.deleteBrands({
      where: query,
    });

    // Publish Brands deleted message message
    try {
      await this.providers.messageBroker.publish({
        topic: brandsDeleted,
        message: JSON.stringify({
          ...result,
          ids: params?.id
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
