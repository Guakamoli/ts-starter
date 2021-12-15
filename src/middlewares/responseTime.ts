import Koa, { Middleware } from 'koa';

export default function responseTime(): Middleware {
  return async (ctx: Koa.Context, next: Koa.Next): Promise<any> => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  };
}
