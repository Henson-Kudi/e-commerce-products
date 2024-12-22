import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import { ResponseCodes } from '../../../../../domain/enums';
import createProductDiscountsController from '../../../../http/controllers/products-controller/createProductDiscounts';

export default async function createProductDiscounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, createProductDiscountsController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
