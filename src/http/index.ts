import Koa from 'koa';
import Router from '@koa/router';
import { BaseContext } from '../types';
import compose from 'koa-compose';
import {
  logger,
  responseTime,
  body,
  conditional,
  custom,
  etag,
  cors,
  json,
  cacheContrl,
} from '../middlewares';

export class Http {
  app: Koa;

  port: number;

  constructor(port = 8080) {
    this.port = port;

    this.app = new Koa();

    cacheContrl(this.app);
    this.app.use(async (ctx, next) => {
      ctx.cacheControl(false);
      await next();
    });

    const middlewares = [
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
    this.app.use(compose(middlewares)); // 合并中间件
  }

  withRouter(routes: Array<Router>) {
    routes.forEach((router) => {
      this.app.use(router.routes());
      this.app.use(router.allowedMethods({ throw: true }));
    });
  }

  async start(context: BaseContext) {
    Object.entries(context).forEach(([key, value]) => {
      Object.defineProperty(this.app.context, key, {
        value,
        writable: false,
      });
    });

    this.app.listen(this.port, () => {
      console.log(`Listening on http://localhost:${this.port}`);
    });
  }
}
