import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import deleteCategoryController from '../../../../http/controllers/categories-controller/deleteCategory';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, deleteCategoryController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
