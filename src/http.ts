import Koa from 'koa';
import Router from '@koa/router';
import { HttpContext } from './interface';
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

  async start({}: HttpContext) {
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    this.app.listen(this.port, () => {
      console.log(`Listening on http://localhost:${this.port}`);
    });
  }
}
