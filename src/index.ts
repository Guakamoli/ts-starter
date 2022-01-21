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

export async function runApp() {
  let ctx = Context();

  if (config.MONGO_URL) {
    ctx.mongo = await mongoConnectWithRetry(config.MONGO_URL);
  }

  const http = new Http(config.PORT);
  http.withRouter(routes);

  ctx = withContext({
    ...ctx,
    http,
  });

  await startup.run(ctx);

  http.start(ctx);
}

if (!config.isTest && config.HTTP_ENABLE) {
  runApp().catch(console.error);
}
