import setupProductsQuery from '../../../../../application/use-cases/helpers/setupProductsQuery';
import logger from '../../../../../utils/logger';
import { KafkaMessageControllerHandler } from '../../../../../utils/types/others';
import messageBroker from '../../../../../infrastructure/providers/messageBroker';
import { discountApplied } from '../../../../../utils/kafkaTopics.json';
import database from '../../../../../infrastructure/database';
import { ProductStatus } from '../../../../../domain/constants';

const discountCreatedHandler: KafkaMessageControllerHandler<any> = async (
  data: any
) => {
  logger.info(`Discount created event received for product ${data.id}`);

  // Only update the product if the discount is autoapplicable
  if (data?.autoApply) {
    const { product, productDiscount } = database;
    const query = setupProductsQuery(data?.filterRules ?? {});
    const pdts = await product.findMany({
      where: {
        ...query,
        status: ProductStatus.ACTIVE,
      },
      include: {
        discounts: true,
      },
    });

    let appliedList: string[] = [];

    switch (data?.bulkDiscountStrategy) {
      case 'OVERRIDE':
        // We want to update all existing product discounts with existing filter rules to inactive, then create a new product discount that adds this current discount id

        await productDiscount.updateMany({
          where: {
            productId: {
              in: pdts.map((p) => p.id),
            },
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });

        await productDiscount.createMany({
          data: pdts.map((item) => ({
            productId: item.id,
            discountId: data.id,
            isActive: true,
            discountType: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            discountValue: data.value,
            autoApply: Boolean(data.autoApply),
            discountName: data?.name,
          })),
        });
        appliedList = pdts.map((item) => item.id);
        break;
      case 'STACK':
        // We want to create a new product discount that adds this current discount id
        await productDiscount.createMany({
          data: pdts.map((item) => ({
            productId: item.id,
            discountId: data.id,
            isActive: true,
            discountType: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            discountValue: data.value,
            autoApply: Boolean(data.autoApply),
            discountName: data?.name,
          })),
        });

        appliedList = pdts.map((item) => item.id);

        break;
      case 'SKIP_EXISTING':
        // We want to create a new product discount that adds this current discount id but ignores products with existing discount
        await productDiscount.createMany({
          data: pdts
            ?.filter((item) => !item.discounts?.length)
            .map((item) => ({
              productId: item.id,
              discountId: data.id,
              isActive: true,
              discountType: data.type,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
              discountValue: data.value,
              autoApply: Boolean(data.autoApply),
              discountName: data?.name,
            })),
        });

        appliedList = pdts
          .filter((item) => !item.discounts.length)
          .map((item) => item.id);

        break;

      default:
        logger.warn(
          `Unknown bulk discount strategy: ${data?.bulkDiscountStrategy}`
        );
        break;
    }

    appliedList.length &&
      messageBroker.publish({
        topic: discountApplied,
        message: JSON.stringify({
          products: appliedList,
          discountId: data.id,
        }),
      });
  }
};

export default discountCreatedHandler;
