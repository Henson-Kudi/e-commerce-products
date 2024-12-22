import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import getProductDiscountsController from '../../../../http/controllers/products-controller/getProductDiscounts';
import { ResponseCodes } from '../../../../../domain/enums';
import ErrorClass from '../../../../../domain/valueObjects/error';

export default async function getProductDiscounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, getProductDiscountsController);

    if (!result.success) {
      throw (
        result.error ||
        new ErrorClass('Unexpected Server error', ResponseCodes.ServerError)
      );
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
