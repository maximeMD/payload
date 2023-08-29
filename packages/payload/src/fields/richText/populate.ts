/* eslint-disable @typescript-eslint/no-use-before-define */
import { Collection } from '../../collections/config/types.js';
import { Field, RichTextField } from '../config/types.js';
import { PayloadRequest } from '../../express/types.js';

type Arguments = {
  data: unknown
  overrideAccess?: boolean
  key: string | number
  depth: number
  currentDepth?: number
  field: RichTextField
  req: PayloadRequest
  showHiddenFields: boolean
}

export const populate = async ({
  id,
  collection,
  data,
  key,
  overrideAccess,
  depth,
  currentDepth,
  req,
  showHiddenFields,
}: Omit<Arguments, 'field'> & {
  id: string,
  field: Field
  collection: Collection
}): Promise<void> => {
  const dataRef = data as Record<string, unknown>;

  const doc = await req.payloadDataLoader.load(JSON.stringify([
    req.transactionID,
    collection.config.slug,
    id,
    depth,
    currentDepth + 1,
    req.locale,
    req.fallbackLocale,
    typeof overrideAccess === 'undefined' ? false : overrideAccess,
    showHiddenFields,
  ]));

  if (doc) {
    dataRef[key] = doc;
  } else {
    dataRef[key] = null;
  }
};