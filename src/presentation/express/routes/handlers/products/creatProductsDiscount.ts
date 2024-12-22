import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import { ResponseCodes } from '../../../../../domain/enums';
import createProductsDiscountController from '../../../../http/controllers/products-controller/createProductsDiscount';

export default async function createProductsDiscount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, createProductsDiscountController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
