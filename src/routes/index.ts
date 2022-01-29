import { Context } from 'koa';
import Router from '@koa/router';

const router = new Router();

router.get('/', (ctx: Context) => {
  ctx.body = 'hello world 🤪';
});

export default [router];
