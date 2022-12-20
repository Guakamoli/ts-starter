import { Context } from 'koa';
import Router from '@koa/router';
import config from '../config';

const router = new Router();

router.get('/', (ctx: Context) => {
  ctx.set('X-Power-By', config.NAME);
  ctx.body = 'hello world 🤪';
});

export default [router];
