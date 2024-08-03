import { UpdateCategoryDTO } from '../../../domain/dtos/category';
import { Category } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import { validateUpdateCategory } from '../../../utils/joi/category';
import slugify from '../../../utils/slugify';
import IMessageBroker from '../../providers/messageBroker';
import ICategoriesRepository from '../../repositories/categoriesRepository';
import IUseCase from '../protocols';
import { categoryUpdated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class UpdateCategory
  implements
    IUseCase<
      UpdateCategoryDTO & { id: string },
      Promise<IReturnValue<Category>>
    >
{
  constructor(
    private readonly repos: {
      categoriesRepo: ICategoriesRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(
    data: UpdateCategoryDTO & { id: string }
  ): Promise<IReturnValue<Category>> {
    const { categoriesRepo } = this.repos;
    const { messageBroker } = this.providers;
    // Validate data
    await validateUpdateCategory(data);

    // We want to make sure that Category name is not updated to a Category that already exist in the db
    if (data?.name) {
      const found = await categoriesRepo.getFirstCategory({
        where: {
          slug: slugify(data.name),
          id: {
            not: data.id,
          },
        },
      });

      if (found) {
        throw new ErrorClass(
          `Category already exist with name: ${data?.name}`,
          ResponseCodes.BadRequest
        );
      }
    }

    // Update Category
    const updated = await categoriesRepo.updateCategory({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        slug: data?.name ? slugify(data.name) : undefined,
      },
    });

    // Publish message of Category updated for other services to act accordingly
    try {
      await messageBroker.publish({
        topic: categoryUpdated,
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
