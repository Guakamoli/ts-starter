import {
  MongoClient,
  Db,
  Collection,
  CollectionCreateOptions,
  IndexOptions,
  ObjectID,
} from 'mongodb';
import config from '../config';

export {
  MongoClient,
  Db,
  Collection,
  CollectionCreateOptions,
  IndexOptions,
  ObjectID,
};

const mongoOpts = {
  minPoolSize: 2,
  maxPoolSize: 5,
  directConnection: config.MONGO_DIRECT_CONNECTION,
  useNewUrlParser: config.MONGO_USE_NEW_URL_PARSER,
  useUnifiedTopology: config.MONGO_USE_UNIFIED_TOPOLOGY,
};

const mongoInitialConnectRetries = 5;

/**
 * @summary 连接 mongodb
 * @description 部署环境为 k8s，只链接一次，不自动重连，依赖于 k8s 的 pod 维护机制存活
 * @param {string} url mongodb 数据库连接字符串
 * @param {Object} [opts={}] mongodb 配置
 * @param {number} [retries=10] 重连次数
 * @returns {Promise<MongoClient>} 返回一个 Promise，如果成功，返回一个 Db 对象，如果失败，返回一个 Error 对象
 */
export async function mongoConnectWithRetry(
  url: string,
  opts: Object = {},
  number: number = 0,
): Promise<MongoClient> {
  if (number > 1) {
    console.log(
      `Retrying connect to MongoDB... (${number} of ${mongoInitialConnectRetries})`,
    );
  } else {
    console.log('Connecting to MongoDB...');
  }

  let client;
  try {
    client = await MongoClient.connect(url, { ...mongoOpts, ...opts });
    console.log(
      `Connected to MongoDB. Database name: ${client.db().databaseName}`,
    );
  } catch (error: any) {
    if (error.name === 'MongoNetworkError') {
      // 如果是网络错误，则重试
      client = await mongoConnectWithRetry(url, opts, number + 1);
    } else {
      throw error;
    }
  }
  return client;
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
