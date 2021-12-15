import Koa, { Middleware } from 'koa';

export default function logger(): Middleware {
  return async (ctx: Koa.Context, next: Koa.Next): Promise<any> => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  };
}