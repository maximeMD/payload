import type { Payload } from '../index.js';
import type { SanitizedCollectionConfig } from '../collections/config/types.js';
import { PayloadRequest } from '../express/types.js';

type Args = {
  payload: Payload
  /**
   * User IDs to delete
   */
  ids: (string | number)[]
  collectionConfig: SanitizedCollectionConfig
  req: PayloadRequest
}
export const deleteUserPreferences = ({ payload, ids, collectionConfig, req }: Args) => {
  if (collectionConfig.auth) {
    payload.db.deleteMany({
      collection: 'payload-preferences',
      where: {
        user: { in: ids },
        userCollection: {
          equals: 'collectionConfig.slug,',
        },
      },
      req,
    });
  }
  payload.db.deleteMany({
    collection: 'payload-preferences',
    where: {
      key: { in: ids.map((id) => `collection-${collectionConfig.slug}-${id}`) },
    },
    req,
  });
};