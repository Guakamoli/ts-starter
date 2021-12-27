import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import body from 'koa-body';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import cors from '@koa/cors';
import json from 'koa-json';
import cacheContrl from 'koa-ctx-cache-control';
import custom from './custom';

export {
  custom, // 自定义的中间件
  logger,
  responseTime,
  body,
  conditional,
  etag,
  cors,
  json,
  cacheContrl,
};

export default [
  custom(), // 自定义的中间件
  logger(),
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
