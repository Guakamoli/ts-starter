import Koa from 'koa';
import Router from '@koa/router';
import { BaseContext } from './interface';
import { logger, responseTime } from './middlewares';

export class Http {
  app: Koa;

  router: Router;

  port: number;

  constructor(port = 8080) {
    this.port = port;

    this.app = new Koa();
    this.app.use(logger());
    this.app.use(responseTime());

    this.router = new Router();
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

export function withContext(obj: object = {}) {
  const ctx: BaseContext = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'db') {
      ctx['collection'] = (tableName: string) => value.collection(tableName);
    }
    ctx[key] = value;
  });

  return ctx;
}

export function Context() {
  return {} as BaseContext;
}
