import { UpdateProductDTO } from '../../../domain/dtos/product';
import { Category, Product, Tax } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums';
import ErrorClass from '../../../domain/valueObjects/error';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import { validateUpdateProduct } from '../../../utils/joi/products';
import slugify from '../../../utils/slugify';
import IMessageBroker from '../../providers/messageBroker';
import IProductsRepository from '../../repositories/productsRepository';
import IUseCase from '../protocols';
import { productUpdated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class Updateproduct
  implements
    IUseCase<UpdateProductDTO & { id: string }, Promise<IReturnValue<Product>>>
{
  constructor(
    private readonly repos: {
      productsRepo: IProductsRepository;
    },
    private readonly providers: {
      messageBroker: IMessageBroker;
    }
  ) {}
  async execute(
    data: UpdateProductDTO & { id: string }
  ): Promise<IReturnValue<Product>> {
    const { productsRepo } = this.repos;
    const { messageBroker } = this.providers;
    // Validate data
    await validateUpdateProduct(data);

    const productToUpdate = (await productsRepo.getProductById(data.id, {
      withTaxes: true,
      withCategories: true,
    })) as unknown as Product & { categories: Category[]; taxes: Tax[] };

    if (!productToUpdate) {
      throw new ErrorClass('Product not found', ResponseCodes.NotFound);
    }

    let updateData: Record<string, unknown> = {};

    const findExistingQuery: Record<string, string>[] = [];

    // We want to make sure that product name is not updated to a product that already exist in the db
    if (data?.name) {
      findExistingQuery.push({ slug: slugify(data.name as string) });
    }

    // Ensure that sku is not duplicated if we want to update it
    if (data.SKU) {
      findExistingQuery.push({ SKU: data.SKU as string, mode: 'insensitive' });
    }

    if (findExistingQuery.length) {
      const found = await productsRepo.getFirstProduct({
        where: {
          OR: findExistingQuery,
          id: {
            not: data.id,
          },
        },
      });

      if (found) {
        throw new ErrorClass(
          `There is a product with same name or SKU. Please change`,
          ResponseCodes.BadRequest
        );
      }
    }

    if (data.taxes) {
      // Step 2: Determine taxids to keep, disconnect, and connect
      const idsToDisconnect = productToUpdate?.taxes?.filter(
        (tax) => !data?.taxes?.includes(tax.id)
      );

      const idsToConnect = data.taxes.filter(
        (id) => !productToUpdate?.taxes?.map((item) => item.id)?.includes(id)
      );

      updateData.taxes = {
        disconnect: idsToDisconnect?.map((tax) => ({ id: tax.id })),
        connect: idsToConnect?.map((id) => ({ id })),
      };

      delete data.taxes;
    }

    if (data.categories) {
      // Step 2: Determine taxids to keep, disconnect, and connect
      const idsToDisconnect = productToUpdate?.categories?.filter(
        (tax) => !data?.categories?.includes(tax.id)
      );

      const idsToConnect = data.categories.filter(
        (id) =>
          !productToUpdate?.categories?.map((item) => item.id)?.includes(id)
      );

      updateData.categories = {
        disconnect: idsToDisconnect?.map((tax) => ({ id: tax.id })),
        connect: idsToConnect?.map((id) => ({ id })),
      };

      delete data.categories;
    }

    updateData = {
      ...data,
      ...updateData,
      slug: data?.name ? slugify(data.name as string) : undefined,
    };

    // Update product
    const updated = await productsRepo.updateProduct({
      where: {
        id: data.id,
      },
      data: updateData,
    });

    // Publish message of product updated for other services to act accordingly
    try {
      await messageBroker.publish({
        topic: productUpdated,
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
