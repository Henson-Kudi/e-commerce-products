import { Prisma } from '@prisma/client';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IUseCase from '../protocols';
import IProductDiscountRepository from '../../repositories/productDiscountRepository';
import IMessageBroker from '../../providers/messageBroker';
import { productDiscountsDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class DeleteProductDiscounts
  implements
    IUseCase<
      { discountIds: string[] },
      Promise<IReturnValue<Prisma.BatchPayload>>
    >
{
  constructor(
    private readonly repo: IProductDiscountRepository,
    private readonly providers: { messageBroker: IMessageBroker }
  ) {}

  async execute(params: {
    discountIds: string[];
  }): Promise<IReturnValue<Prisma.BatchPayload>> {
    const result = await this.repo.deleteMany({
      where: {
        id: {
          in: params.discountIds,
        },
      },
    });

    try {
      this.providers.messageBroker.publish({
        message: JSON.stringify(params),
        topic: productDiscountsDeleted,
      });
    } catch (err) {
      logger.error((err as Error).message, err);
    }

    return {
      success: true,
      data: result,
    };
  }
}
