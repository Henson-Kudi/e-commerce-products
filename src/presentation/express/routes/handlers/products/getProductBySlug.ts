import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import getProductBySlugController from '../../../../http/controllers/products-controller/getProductBySlug';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, getProductBySlugController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
