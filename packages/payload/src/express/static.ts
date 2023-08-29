import express from 'express';
import passport from 'passport';
import path from 'path';
import getExecuteStaticAccess from '../auth/getExecuteStaticAccess.js';
import authenticate from './middleware/authenticate.js';
import { Payload } from '../payload.js';
import corsHeaders from './middleware/corsHeaders.js';

function initStatic(ctx: Payload): void {
  Object.entries(ctx.collections).forEach(([_, collection]) => {
    const { config } = collection;

    if (config.upload && config.upload.staticURL.startsWith('/')) {
      const router = express.Router();

      router.use(corsHeaders(ctx.config));
      router.use(passport.initialize());
      router.use(authenticate(ctx.config));

      router.use(getExecuteStaticAccess(config));

      if (Array.isArray(config.upload?.handlers)) {
        router.get('/:filename*', config.upload.handlers);
      }

      const staticPath = path.resolve(ctx.config.paths.configDir, config.upload.staticDir);

      router.use(express.static(staticPath, config.upload.staticOptions || {}));

      ctx.express.use(`${config.upload.staticURL}`, router);
    }
  });
}

export default initStatic;