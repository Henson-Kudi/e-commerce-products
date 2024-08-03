import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import deleteBrandsController from '../../../../http/controllers/brands-controller/deleteBrands';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function deleteBrands(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, deleteBrandsController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
