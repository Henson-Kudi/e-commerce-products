import { Prisma, ProductDiscount } from '@prisma/client';
import IProductDiscountRepository from '../../application/repositories/productDiscountRepository';
import database from '../database';

export default class ProductDiscountsRepository
  implements IProductDiscountRepository
{
  update(params: Prisma.ProductDiscountUpdateArgs): Promise<ProductDiscount> {
    return database.productDiscount.update(params);
  }
  delete(params: Prisma.ProductDiscountDeleteArgs): Promise<ProductDiscount> {
    return database.productDiscount.delete(params);
  }
  updateMany(
    params: Prisma.ProductDiscountUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    return database.productDiscount.updateMany(params);
  }
  create(params: Prisma.ProductDiscountCreateArgs): Promise<ProductDiscount> {
    return database.productDiscount.create(params);
  }
  deleteMany(
    params: Prisma.ProductDiscountDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return database.productDiscount.deleteMany(params);
  }
  findByProductId(productId: string): Promise<ProductDiscount[]> {
    return database.productDiscount.findMany({
      where: {
        productId,
        isActive: true,
        endDate: {
          gte: new Date(),
        },
      },
    });
  }
}
