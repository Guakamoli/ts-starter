import { Http, Context, withContext } from './http';
import routes from './routes';
import { connect, Db } from './mongo';

async function runApp() {
  const ctx = Context();

  if (Boolean(process.env.MONGO_ENABLE)) {
    ctx.db = (await connect(process.env.MONGO_URL || '')) as Db;
  }

  const http = new Http(Number(process.env.PORT ?? 8080));
  http.withRouter(routes);
  http.start(withContext(ctx));
}

if (process.env.HTTP_ENABLE) {
  runApp().catch(console.error);
}

// 这是给测试用的
export const foo = '芜湖~';
