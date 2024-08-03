import { FindCategoryFilter } from '../../../domain/dtos/category';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import ICategoriesRepository from '../../repositories/categoriesRepository';
import IUseCase from '../protocols';
import { categoriesDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import setupCategoriesQuery from '../helpers/setupCategoriesQuery';

export default class DeleteCategorys
  implements
    IUseCase<FindCategoryFilter, Promise<IReturnValue<{ count: number }>>>
{
  constructor(
    private readonly repository: ICategoriesRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(
    params: FindCategoryFilter
  ): Promise<IReturnValue<{ count: number }>> {
    const query = setupCategoriesQuery(params);

    const result = await this.repository.deleteCategories({
      where: query,
    });

    // Publish Categories deleted message message
    try {
      await this.providers.messageBroker.publish({
        topic: categoriesDeleted,
        messages: [{ value: JSON.stringify(result) }],
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
