import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import deleteProductController from '../../../../http/controllers/products-controller/deleteProduct';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, deleteProductController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
