import { Category } from '../../../domain/entities';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IUseCase from '../protocols';
import ICategoriesRepository from '../../repositories/categoriesRepository';
import ErrorClass from '../../../domain/valueObjects/error';
import { ResponseCodes } from '../../../domain/enums';
import IMessageBroker from '../../providers/messageBroker';
import { categoryDeleted } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class DeleteCategory
  implements IUseCase<{ id: string }, Promise<IReturnValue<Category | null>>>
{
  constructor(
    private readonly categoryRepository: ICategoriesRepository,
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}

  async execute(params: {
    id: string;
  }): Promise<IReturnValue<Category | null>> {
    const { messageBroker } = this.providers;

    const found = await this.categoryRepository.getCategoryById(params.id);

    if (!found) {
      return {
        success: false,
        error: new ErrorClass(
          'Category does not exist with given id',
          ResponseCodes.BadRequest
        ),
      };
    }

    const deletedCategory = await this.categoryRepository.deleteCategory({
      where: { id: params.id },
    });

    if (!deletedCategory) {
      return {
        success: false,
        error: new ErrorClass(
          'Category does not exist with given id',
          ResponseCodes.BadRequest
        ),
      };
    }

    // Publish message for other services
    try {
      await messageBroker.publish({
        topic: categoryDeleted,
        message: JSON.stringify(deletedCategory),
        key: deletedCategory.id,
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: deletedCategory,
    };
  }
}
