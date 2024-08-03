import moment from 'moment';
import { CreateProductDTO } from '../../../domain/dtos/product';
import { Product } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import { validateCreateProduct } from '../../../utils/joi/products';
import slugify from '../../../utils/slugify';
import IBrandsRepository from '../../repositories/brandsRepository';
import IProductsRepository from '../../repositories/productsRepository';
import IUseCase from '../protocols';
import { ProductStatus, StockStatus } from '../../../domain/constants';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IMessageBroker from '../../providers/messageBroker';
import { productCreated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import { validateCreateBrand } from '../../../utils/joi/brand';

export default class CreateProductUseCase
  implements IUseCase<CreateProductDTO, Promise<IReturnValue<Product>>>
{
  constructor(
    private readonly repositories: {
      productsRepo: IProductsRepository;
      brandsRepo: IBrandsRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(data: CreateProductDTO): Promise<IReturnValue<Product>> {
    const { brandsRepo, productsRepo } = this.repositories;
    const { messageBroker } = this.providers;
    // Validate all params
    await validateCreateProduct(data);

    // Ensure that product with name does not already exist
    const found = await productsRepo.getFirstProduct({
      where: {
        OR: [
          {
            slug: slugify(data.name),
          },
          {
            SKU: data.SKU,
          },
        ],
      },
    });

    if (found) {
      throw new ErrorClass(
        'Product with name OR SKU already exists!',
        ResponseCodes.BadRequest
      );
    }

    // If no brand and no brandId, throw error
    if (!data.brand && !data.brandId) {
      throw new ErrorClass('Brand is required', ResponseCodes.ValidationError);
    }

    // if brand is passed, create a new brand and attach id to data
    if (data.brand) {
      // If brand already exist with that name, then use that brand
      const brand = await brandsRepo.getBrandBySlug(slugify(data.brand.name));

      if (brand) {
        data.brandId = brand.id;
        delete data.brand;
      } else {
        // Validate data to create new brand
        await validateCreateBrand({
          ...data.brand,
          createdById: data.createdById,
        });

        const newBrand = await brandsRepo.createBrand({
          data: {
            createdById: data.createdById,
            name: data.brand.name,
            slug: slugify(data.brand.name),
            description: data.brand.description,
            image: data.brand.image,
          },
        });

        delete data.brand;

        data.brandId = newBrand.id;
      }
    }

    // Attempt to create product
    const product = await productsRepo.createProduct({
      data: {
        ...data,
        brandId: data.brandId!,
        discountStartDate:
          data.discountStartDate && moment.isDate(data.discountStartDate)
            ? moment(data.discountStartDate).toDate()
            : undefined,
        discountEndDate:
          data.discountEndDate && moment.isDate(data.discountEndDate)
            ? moment(data.discountEndDate).toDate()
            : undefined,
        brand: undefined,
        slug: slugify(data.name),
        status: data.status || ProductStatus.ACTIVE,
        stockStatus: data.stockStatus || StockStatus.IN_STOCK,
        taxes: data.taxes
          ? {
              connect: data.taxes.map((tax) => ({
                id: tax,
              })),
            }
          : undefined,
        categories: data?.categories
          ? {
              connect: data.categories.map((category) => ({
                id: category,
              })),
            }
          : undefined,
      },
      include: {
        brand: true,
      },
    });

    // Publish product created message for other services to act accordingly
    try {
      await messageBroker.publish({
        topic: productCreated,
        messages: [
          {
            value: JSON.stringify(product),
          },
        ],
      });
    } catch (error) {
      logger.error((error as Error).message, error);
    }

    return {
      success: true,
      data: product,
    };
  }
}
