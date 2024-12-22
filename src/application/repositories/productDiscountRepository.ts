import { Prisma, ProductDiscount } from '@prisma/client';

export default interface IProductDiscountRepository {
  findByProductId(productId: string): Promise<ProductDiscount[]>;
  deleteMany(
    params: Prisma.ProductDiscountDeleteManyArgs
  ): Promise<Prisma.BatchPayload>;
  create(params: Prisma.ProductDiscountCreateArgs): Promise<ProductDiscount>;
  update(params: Prisma.ProductDiscountUpdateArgs): Promise<ProductDiscount>;
  delete(params: Prisma.ProductDiscountDeleteArgs): Promise<ProductDiscount>;
  updateMany(
    params: Prisma.ProductDiscountUpdateManyArgs
  ): Promise<Prisma.BatchPayload>;
}
