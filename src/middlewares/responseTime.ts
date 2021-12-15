import { Context, Next, Middleware } from 'koa';

export default function responseTime(): Middleware {
  return async (ctx: Context, next: Next): Promise<any> => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  };
}
