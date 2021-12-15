import { Context, Next, Middleware } from 'koa';

export default function custom(): Middleware {
  return async (_: Context, next: Next): Promise<any> => {
    // 在这里干点什么
    await next();
  };
}
