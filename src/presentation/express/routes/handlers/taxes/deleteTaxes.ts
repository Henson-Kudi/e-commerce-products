import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import deleteTaxesController from '../../../../http/controllers/taxes-controller/deleteTaxes';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function deleteTaxes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, deleteTaxesController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
