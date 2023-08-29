import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { Config as GeneratedTypes } from 'payload/generated-types';
import { PayloadRequest } from '../../express/types.js';
import findOne from '../operations/findOne.js';

export default async function findOneHandler(req: PayloadRequest, res: Response, next: NextFunction): Promise<Response<GeneratedTypes['collections']['_preference']> | void> {
  try {
    const result = await findOne({
      req,
      user: req.user,
      key: req.params.key,
    });

    return res.status(httpStatus.OK).json(result || { message: req.t('general:notFound'), value: null });
  } catch (error) {
    return next(error);
  }
}