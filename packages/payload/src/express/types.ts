import { Request } from 'express';
import type { i18n as Ii18n, TFunction } from 'i18next';
import DataLoader from 'dataloader';
import { UploadedFile } from 'express-fileupload';
import { Payload } from '../payload.js';
import { Collection, TypeWithID } from '../collections/config/types.js';
import { User } from '../auth/types.js';
import type { FindOneArgs } from '../database/types.js';

/** Express request with some Payload related context added */
export declare type PayloadRequest<U = any> = Request & {
  /** The global payload object */
  payload: Payload;
  /** Optimized document loader */
  payloadDataLoader: DataLoader<string, TypeWithID>;
  /**
   * The requested locale if specified
   * Only available for localised collections
   */
  locale?: string;
  /** The locale that should be used for a field when it is not translated to the requested locale */
  fallbackLocale?: string;
  /** Information about the collection that is being accessed
   * - Configuration from payload-config.ts
   * - MongoDB model for this collection
   * - GraphQL type metadata
   */
  collection?: Collection;
  /** What triggered this request */
  payloadAPI?: 'REST' | 'local' | 'GraphQL';
  /**
   * Identifier for the database transaction for interactions in a single, all-or-nothing operation.
   */
  transactionID?: string | number;
  /** context allows you to pass your own data to the request object as context
   * This is useful for, for example, passing data from a beforeChange hook to an afterChange hook.
   * payoadContext can also be fully typed using declare module
   * {@link https://payloadcms.com/docs/hooks/context More info in the Payload Documentation}.
   */
  context: RequestContext;
  /** Uploaded files */
  files?: {
    /**
     * This is the file that Payload will use for the file upload, other files are ignored.
     *
     */
    file: UploadedFile;
  };
  /** I18next instance */
  i18n: Ii18n;
  /** Get a translation for the admin screen */
  t: TFunction;
  /** The signed in user */
  user: (U & User) | null;
  /** Resized versions of the image that was uploaded during this request */
  payloadUploadSizes?: Record<string, Buffer>;
  /** Cache of documents related to the current request */
  findByID?: {
    [transactionID: string]: {
      [slug: string]: (q: FindOneArgs) => Promise<TypeWithID>;
    }
  };
};

export interface RequestContext {
  [key: string]: unknown;
}