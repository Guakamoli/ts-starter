import { Context } from 'koa';

// 存活检查
export const ping = () => {
  return async (ctx: Context, next: any) => {
    if (ctx.path === '/ping') {
      return (ctx.body = 'pong');
    }
    await next();
  };
};

// 就绪检查
export const healthz = () => {
  return async (ctx: Context, next: any) => {
    if (ctx.path === '/healthz') {
      if (ctx.db) {
        try {
          await ctx.db.collection('test').findOne({});
        } catch (err: any) {
          return ctx.fail(err, 500);
        }
      }
      return ctx.json({ message: 'ok' });
    }
    await next();
  };
};
