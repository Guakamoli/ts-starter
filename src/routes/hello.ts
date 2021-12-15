import Koa from 'koa';
import Router from '@koa/router';

const router = new Router({
  prefix: '/',
});

router.all('/', async (ctx: Koa.Context) => {
  ctx.body = 'hello world ☺️';
});

export default router;
