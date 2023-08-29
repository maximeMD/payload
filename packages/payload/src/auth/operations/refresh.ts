import url from 'url';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Collection, BeforeOperationHook } from '../../collections/config/types.js';
import { Forbidden } from '../../errors/index.js';
import getCookieExpiration from '../../utilities/getCookieExpiration.js';
import { Document } from '../../types/index.js';
import { PayloadRequest } from '../../express/types.js';
import { buildAfterOperation } from '../../collections/operations/utils.js';
import { getFieldsToSign } from './getFieldsToSign.js';

export type Result = {
  exp: number,
  user: Document,
  refreshedToken: string
}

export type Arguments = {
  collection: Collection,
  token: string
  req: PayloadRequest
  res?: Response
}

async function refresh(incomingArgs: Arguments): Promise<Result> {
  let args = incomingArgs;

  // /////////////////////////////////////
  // beforeOperation - Collection
  // /////////////////////////////////////

  await args.collection.config.hooks.beforeOperation.reduce(async (priorHook: BeforeOperationHook | Promise<void>, hook: BeforeOperationHook) => {
    await priorHook;

    args = (await hook({
      args,
      operation: 'refresh',
      context: args.req.context,
    })) || args;
  }, Promise.resolve());

  // /////////////////////////////////////
  // Refresh
  // /////////////////////////////////////

  const {
    collection: {
      config: collectionConfig,
    },
    req: {
      payload: {
        secret,
        config,
      },
    },
  } = args;

  if (typeof args.token !== 'string') throw new Forbidden(args.req.t);

  const parsedURL = url.parse(args.req.url);
  const isGraphQL = parsedURL.pathname === config.routes.graphQL;

  const user = await args.req.payload.findByID({
    id: args.req.user.id,
    collection: args.req.user.collection,
    req: args.req,
    depth: isGraphQL ? 0 : args.collection.config.auth.depth,
  });

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    user: args?.req?.user,
    email: user?.email as string,
  });

  const refreshedToken = jwt.sign(
    fieldsToSign,
    secret,
    {
      expiresIn: collectionConfig.auth.tokenExpiration,
    },
  );

  const exp = (jwt.decode(refreshedToken) as Record<string, unknown>).exp as number;

  if (args.res) {
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),
      secure: collectionConfig.auth.cookies.secure,
      sameSite: collectionConfig.auth.cookies.sameSite,
      domain: undefined,
    };

    if (collectionConfig.auth.cookies.domain) cookieOptions.domain = collectionConfig.auth.cookies.domain;

    args.res.cookie(`${config.cookiePrefix}-token`, refreshedToken, cookieOptions);
  }

  let result: Result = {
    user,
    refreshedToken,
    exp,
  };

  // /////////////////////////////////////
  // After Refresh - Collection
  // /////////////////////////////////////

  await collectionConfig.hooks.afterRefresh.reduce(async (priorHook, hook) => {
    await priorHook;

    result = (await hook({
      req: args.req,
      res: args.res,
      exp,
      token: refreshedToken,
      context: args.req.context,
    })) || result;
  }, Promise.resolve());


  // /////////////////////////////////////
  // afterOperation - Collection
  // /////////////////////////////////////

  result = await buildAfterOperation({
    operation: 'refresh',
    args,
    result,
  });

  // /////////////////////////////////////
  // Return results
  // /////////////////////////////////////

  if (collectionConfig.auth.removeTokenFromResponses) {
    delete result.refreshedToken;
  }

  return result;
}

export default refresh;