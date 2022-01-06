import Koa from 'koa';
import Router from '@koa/router';
import { BaseContext } from '../types';
import compose from 'koa-compose';
import middlewares, { cacheContrl } from '../middlewares';
import { uuidv4 } from '../utils/random';

const PORT = 8080;
const HOST = '0.0.0.0';

export class Http {
  app: Koa;

  port: number;
  hostname: string;

  constructor(port = PORT, hostname = HOST) {
    this.port = port;
    this.hostname = hostname;

    this.app = new Koa();

    cacheContrl(this.app);
    this.app.use(async (ctx, next) => {
      ctx.cacheControl(false);
      await next();
    });
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

    this.app.context.json = function (data: any) {
      this.type = 'json';
      this.body = { ...data, requestId: uuidv4() };
    };

    this.app.context.success = function (data: any, message: string = 'ok') {
      this.type = 'json';
      this.body = { data, message, requestId: uuidv4() };
    };

    this.app.context.fail = function (error: any, code = 200) {
      this.status = code;
      let message = '';
      if (typeof error === 'object') {
        message = error.message;
        error = error.error;
      }
      this.body = { error, message, requestId: uuidv4() };
    };

    this.app.listen(this.port, this.hostname, () => {
      console.log(`Listening on http://${this.hostname}:${this.port}`);
    });
  }
}
