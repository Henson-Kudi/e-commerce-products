import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import deleteProductDiscountsController from '../../../../http/controllers/products-controller/deleteProductDiscounts';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function deleteProductDiscounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, deleteProductDiscountsController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
