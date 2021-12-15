import { Context } from 'koa';
import Router from '@koa/router';

const router = new Router();

router.get('/', (ctx: Context) => {
  ctx.body = 'hello world 🤪';
});

/** k8s 检查 */
// 存活检查
router.get('/ping', (ctx: Context) => {
  ctx.body = 'pong';
});
// 就绪检查
router.get('/healthz', async (ctx: Context) => {
  if (ctx.db) {
    try {
      await ctx.db.collection('test').findOne({});
    } catch (err: any) {
      ctx.throw(500, err.message);
    }
  }
  ctx.body = 'ok';
});
/** k8s 检查 */

export default [router];
