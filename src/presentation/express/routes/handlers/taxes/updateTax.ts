import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import updateTaxController from '../../../../http/controllers/taxes-controller/updateTaxDetails';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function updateTax(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, updateTaxController);

    if (!result.success) {
      throw result.error;
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (err) {
    next(err);
  }
}
