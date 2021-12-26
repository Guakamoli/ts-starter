import {
  Http,
  Context,
  withContext,
  connect,
  MongoClient,
  startup,
} from './mod';
import routes from './routes';
import config from './config';
import './startup';

async function runApp() {
  let ctx = Context();

  if (config.MONGO_ENABLE) {
    ctx.mongo = (await connect(config.MONGO_URL)) as MongoClient;
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

// 这是给测试用的
export const foo = '芜湖~';
