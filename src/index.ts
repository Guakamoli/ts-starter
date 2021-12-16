import { Http } from './http';
import { Context, withContext } from './http/context';
import routes from './routes';
import { connect, Db } from './mongo';
import config from './config';

async function runApp() {
  const ctx = Context();

  if (config.MONGO_ENABLE) {
    ctx.db = (await connect(config.MONGO_URL)) as Db;
  }

  const http = new Http(config.PORT);
  http.withRouter(routes);
  http.start(withContext(ctx));
}

if (!config.isTest && config.HTTP_ENABLE) {
  runApp().catch(console.error);
}

// 这是给测试用的
export const foo = '芜湖~';
