import { Config as GeneratedTypes } from 'payload/generated-types';
import { PayloadRequest } from '../../../express/types.js';
import { Payload } from '../../../payload.js';
import unlock from '../unlock.js';
import { getDataLoader } from '../../../collections/dataloader.js';
import { i18nInit } from '../../../translations/init.js';
import { APIError } from '../../../errors/index.js';
import { setRequestContext } from '../../../express/setRequestContext.js';

export type Options<T extends keyof GeneratedTypes['collections']> = {
  collection: T
  data: {
    email
  }
  req?: PayloadRequest
  overrideAccess: boolean
}

async function localUnlock<T extends keyof GeneratedTypes['collections']>(
  payload: Payload,
  options: Options<T>,
): Promise<boolean> {
  const {
    collection: collectionSlug,
    data,
    overrideAccess = true,
    req = {} as PayloadRequest,
  } = options;
  setRequestContext(options.req);

  const collection = payload.collections[collectionSlug];

  if (!collection) {
    throw new APIError(`The collection with slug ${String(collectionSlug)} can't be found. Unlock Operation.`);
  }

  req.payload = payload;
  req.payloadAPI = req.payloadAPI || 'local';
  req.i18n = i18nInit(payload.config.i18n);

  if (!req.t) req.t = req.i18n.t;
  if (!req.payloadDataLoader) req.payloadDataLoader = getDataLoader(req);

  return unlock({
    data,
    collection,
    overrideAccess,
    req,
  });
}

export default localUnlock;