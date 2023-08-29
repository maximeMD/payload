import { Response, NextFunction } from 'express';
import getExtractJWT from '../getExtractJWT.js';
import { PayloadRequest } from '../../express/types.js';
import refresh from '../operations/refresh.js';

export default async function refreshHandler(req: PayloadRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    let token;

    const extractJWT = getExtractJWT(req.payload.config);
    token = extractJWT(req);

    if (req.body.token) {
      token = req.body.token;
    }

    const result = await refresh({
      req,
      res,
      collection: req.collection,
      token,
    });

    return res.status(200).json({
      message: 'Token refresh successful',
      ...result,
    });
  } catch (error) {
    return next(error);
  }
}