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
  logger,
  responseTime,
  body,
  conditional,
  custom,
  etag,
  cors,
  json,
  cacheContrl,
};
