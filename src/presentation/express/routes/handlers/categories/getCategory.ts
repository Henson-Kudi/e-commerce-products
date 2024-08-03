import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import getCategoryController from '../../../../http/controllers/categories-controller/getCategoryById';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function getCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, getCategoryController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
