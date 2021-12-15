import { MongoClient, Db } from 'mongodb';

export { MongoClient, Db };

const mongoOpts = {
  minPoolSize: 2,
  maxPoolSize: 5,
  directConnection: true,
};

/**
 * @summary 连接 mongodb
 * @description 部署环境为 k8s，只链接一次，不自动重连，依赖于 k8s 的 pod 维护机制存活
 * @param {string} url mongodb 数据库连接字符串
 * @returns {Promise<Db|Error>} 返回一个 Promise，如果成功，返回一个 Db 对象，如果失败，返回一个 Error 对象
 */
export async function connect(url: string): Promise<Db | Error> {
  return new Promise((resolve, reject) => {
    console.log('Connecting to MongoDB...');
    new MongoClient(url, mongoOpts).connect((err, client) => {
      console.log('Connected to MongoDB.');
      if (err) {
        reject(err);
      }
      resolve((client as MongoClient).db());
    });
  });
}
