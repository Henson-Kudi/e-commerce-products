import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import deleteCategoriesController from '../../../../http/controllers/categories-controller/deleteCategories';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function deleteCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, deleteCategoriesController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
