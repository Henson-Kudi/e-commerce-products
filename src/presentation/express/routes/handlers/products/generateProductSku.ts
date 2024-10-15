import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../../adapters/expressAdapter';
import generateProductSkuController from '../../../../http/controllers/products-controller/generateProductSku';
import { ResponseCodes } from '../../../../../domain/enums';

export default async function generateProductSku(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result = await expressAdapter(req, generateProductSkuController);

        if (!result.success) {
            throw result.error;
        }

        return res.status(ResponseCodes.Success).json(result);
    } catch (err) {
        next(err);
    }
}
