import process from 'node:process';
import {
  Http,
  Context,
  withContext,
  mongoConnectWithRetry,
  startup,
} from './mod';
import routes from './routes';
import config from './config';
import './startup';

async function exit(ctx: any, code = 0) {
  if (ctx.mongo) {
    await ctx.mongo.close();
  }
  process.exit(code);
}

export async function runApp() {
  let ctx = Context();

  if (config.MONGO_URL) {
    ctx.mongo = await mongoConnectWithRetry(config.MONGO_URL);
  }

  ctx = withContext({ ...ctx });

  try {
    await startup.run(ctx);
  } catch {
    await exit(1);
    return;
  }

  if (config.HTTP_ENABLE) {
    const http = new Http(config.PORT);
    http.withRouter(routes);
    await http.start(ctx);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.log(
    'Oops! Something went wrong.',
    'Unhandled Rejection at:',
    promise,
    'reason:',
    reason,
  );
});

if (!config.isTest) {
  runApp().catch(console.error);
}
