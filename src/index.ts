import { Http, Context, withContext, connect, Db } from './mod';
import routes from './routes';
import config from './config';
import startup from './startup';

async function runApp() {
  const ctx = Context();

  if (config.MONGO_ENABLE) {
    ctx.db = (await connect(config.MONGO_URL)) as Db;
  }

  await startup.run(ctx);

  const http = new Http(config.PORT);
  http.withRouter(routes);
  http.start(withContext(ctx));
}

if (!config.isTest && config.HTTP_ENABLE) {
  runApp().catch(console.error);
}

// 这是给测试用的
export const foo = '芜湖~';
