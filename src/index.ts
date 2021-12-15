import { Http } from './http';
import routes from './routes';
// import { connect, Db } from './mongo'; // mongodb 例子使用

async function main() {
  const http = new Http(Number(process.env.PORT ?? 8080));

  http.withRouter(routes);
  await http.start({});
}

main().catch(console.error);

// 需要 mongodb 的例子
// async function main(Db: Db) {
//   const http = new Http(Number(process.env.PORT ?? 8080));

//   const context = {
//     Db,
//     collection: (tableName: string) => {
//       return Db.collection(tableName);
//     },
//   };

//   http.withRouter(routes);
//   await http.start(context);
// }

// connect(process.env.MONGO_URL || '')
//   .then((db) => main(db as Db))
//   .catch(console.error);
