import me from '../../operations/me.js';
import { Collection } from '../../../collections/config/types.js';

function meResolver(collection: Collection): any {
  async function resolver(_, args, context) {
    const options = {
      collection,
      req: context.req,
      depth: 0,
    };
    return me(options);
  }
  return resolver;
}

export default meResolver;