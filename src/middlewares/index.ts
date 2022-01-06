import config from '../config';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import body from 'koa-body';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import cors from '@koa/cors';
import json from 'koa-json';
import cacheContrl from 'koa-ctx-cache-control';

export {
  logger,
  responseTime,
  body,
  conditional,
  etag,
  cors,
  json,
  cacheContrl,
};

const middlewares = [
  responseTime({
    hrtime: true,
  }),
  body({
    jsonLimit: '10mb',
    formLimit: '100kb',
    textLimit: '100kb',
  }),
  conditional(),
  etag(),
  cors(),
  json({ pretty: false, param: 'x-json-pretty' }),
];

if (!config.WORKER_ENABLE) {
  middlewares.push(logger());
}

export default middlewares;
