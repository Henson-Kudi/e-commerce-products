import { ProductDiscount } from '@prisma/client';
import IReturnValue from '../../../domain/valueObjects/returnValue';
import IUseCase from '../protocols';
import { ICreateProductDiscountDTO } from '../../../domain/dtos/product';
import IProductDiscountRepository from '../../repositories/productDiscountRepository';
import IMessageBroker from '../../providers/messageBroker';
import { productsDiscountCreated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';
import { validateCreateProductDiscount } from '../../../utils/joi/products';
import IProductsRepository from '../../repositories/productsRepository';
import { DiscountStrategy } from '../../../utils/types/others';
import { Product } from '../../../domain/entities';

export default class CreateProductsDiscountUseCase
  implements
    IUseCase<
      ICreateProductDiscountDTO,
      Promise<IReturnValue<ProductDiscount[]>>
    >
{
  constructor(
    private readonly repo: IProductDiscountRepository,
    private readonly productsRepo: IProductsRepository,
    private readonly providers: { messageBroker: IMessageBroker }
  ) {}

  async execute(data: ICreateProductDiscountDTO) {
    await validateCreateProductDiscount(data);
    const products = (await this.productsRepo.getProducts({
      where: {
        id: {
          in: data.productIds,
        },
      },
      include: {
        discounts: {
          where: {
            isActive: true,
            endDate: {
              gt: new Date(),
            },
          },
        },
      },
    })) as (Product & { discounts: ProductDiscount[] })[];

    // If strategy is overwrite, we want to deactivate all
    if (data.strategy === DiscountStrategy.OVERRIDE) {
      await this.repo.updateMany({
        where: {
          productId: {
            in: data.productIds,
          },
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    // if strategy is SKIP, then we want to only create discount on products that do not have a current running discount
    if (data.strategy === DiscountStrategy.SKIP_EXISTING) {
      const filteredProducts = products.filter(
        (product) => !product.discounts?.length
      );
      data.productIds = filteredProducts.map((product) => product.id);
    }

    const response = await Promise.all(
      data?.productIds?.map((id) => {
        return this.repo.create({
          data: {
            productId: id,
            discountId: data.discountId,
            discountType: data.discountType,
            discountValue: data.discountValue,
            endDate: new Date(data.endDate),
            startDate: new Date(data.startDate),
            isActive: data.isActive ?? true,
            discountName: data.discountName,
            autoApply: data.autoApply ?? true,
          },
        });
      })
    );

    try {
      this.providers.messageBroker.publish({
        message: JSON.stringify(data),
        topic: productsDiscountCreated,
      });
    } catch (err) {
      logger.error((err as Error).message, err);
    }

    return {
      success: true,
      data: response,
    };
  }
}
