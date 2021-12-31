import {
  MongoClient,
  Db,
  Collection,
  CollectionCreateOptions,
  IndexOptions,
} from 'mongodb';

export { MongoClient, Db, Collection, CollectionCreateOptions, IndexOptions };

const mongoOpts = {
  minPoolSize: 2,
  maxPoolSize: 5,
  directConnection: true,
  useUnifiedTopology: true,
};

/**
 * @summary 连接 mongodb
 * @description 部署环境为 k8s，只链接一次，不自动重连，依赖于 k8s 的 pod 维护机制存活
 * @param {string} url mongodb 数据库连接字符串
 * @param {Object} opts mongodb 配置
 * @returns {Promise<MongoClient>} 返回一个 Promise，如果成功，返回一个 Db 对象，如果失败，返回一个 Error 对象
 */
export async function connect(
  url: string,
  opts?: Object,
): Promise<MongoClient> {
  return new Promise((resolve, reject) => {
    console.log('Connecting to MongoDB...');
    new MongoClient(url, { ...mongoOpts, ...opts }).connect((err, client) => {
      console.log('Connected to MongoDB.');
      if (err) {
        reject(err);
      }
      resolve(client as MongoClient);
    });
  });
}

/**
 * @name collectionIndex
 * @summary Sets up necessary indexes on a collection. A wrapper around `createIndex`
 * @param {Collection} collection the collection
 * @param {any} index field or fields to index
 * @param {IndexOptions} [options] createIndex options. `background: true` is added automatically
 * @returns {Promise<undefined>} Promise that resolves with undefined
 */
export async function collectionIndex(
  collection: Collection,
  index: any,
  options: IndexOptions = {},
) {
  try {
    await collection.createIndex(index, { background: true, ...options });
  } catch (error: any) {
    if (error.codeName === 'IndexOptionsConflict') {
      console.warn(
        `${error.errmsg}. Compare the index options in your database with those in the plugin code,` +
          ' and alter or drop and recreate your index if necessary.',
      );
    } else {
      console.error(error);
    }
  }
}
