import { Brand } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import slugify from '../../../utils/slugify';
import IBrandsRepository from '../../repositories/brandsRepository';
import IUseCase from '../protocols';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import { brandCreated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import { CreateBrandDTO } from '../../../domain/dtos/brand';
import { validateCreateBrand } from '../../../utils/joi/brand';

export default class CreateBrandUseCase
  implements IUseCase<CreateBrandDTO, Promise<IReturnValue<Brand>>>
{
  constructor(
    private readonly repositories: {
      brandsRepo: IBrandsRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(data: CreateBrandDTO): Promise<IReturnValue<Brand>> {
    const { brandsRepo } = this.repositories;
    const { messageBroker } = this.providers;
    // Validate all params
    await validateCreateBrand(data);

    // Ensure that product with name does not already exist
    const found = await brandsRepo.getBrandBySlug(slugify(data.name));

    if (found) {
      throw new ErrorClass(
        'Brand with name already exists',
        ResponseCodes.BadRequest
      );
    }

    // Attempt to create brand
    const newbrand = await brandsRepo.createBrand({
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
        topic: brandCreated,
        message: JSON.stringify(newbrand),
        key: newbrand.id.toString(),
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: newbrand,
    };
  }
}
