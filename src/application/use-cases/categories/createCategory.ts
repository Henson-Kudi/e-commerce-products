import { Category } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import slugify from '../../../utils/slugify';
import ICategoriesRepository from '../../repositories/categoriesRepository';
import IUseCase from '../protocols';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import { categoryCreated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import { CreateCategoryDTO } from '../../../domain/dtos/category';
import { validateCreateCategory } from '../../../utils/joi/category';

export default class CreateCategoryUseCase
  implements IUseCase<CreateCategoryDTO, Promise<IReturnValue<Category>>>
{
  constructor(
    private readonly repositories: {
      categoriesRepo: ICategoriesRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(data: CreateCategoryDTO): Promise<IReturnValue<Category>> {
    const { categoriesRepo } = this.repositories;
    const { messageBroker } = this.providers;
    // Validate all params
    await validateCreateCategory(data);

    // Ensure that product with name does not already exist
    const found = await categoriesRepo.getCategoryBySlug(slugify(data.name));

    if (found) {
      throw new ErrorClass(
        'Category with name already exists',
        ResponseCodes.BadRequest
      );
    }

    // Attempt to create Category
    const newCategory = await categoriesRepo.createCategory({
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
        topic: categoryCreated,
        messages: [
          {
            value: JSON.stringify(newCategory),
          },
        ],
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: newCategory,
    };
  }
}
