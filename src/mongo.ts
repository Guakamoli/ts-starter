import mongo, { MongoClient, Db } from 'mongodb';

export { MongoClient, Db };

const mongoOpts = {
  minPoolSize: 3,
  maxPoolSize: 10,
  directConnection: true,
};

export async function connect(url: string): Promise<Db | Error> {
  return new Promise((resolve, reject) => {
    console.log('Connecting to MongoDB...');
    const mongoClient = new MongoClient(url, mongoOpts);
    mongoClient.connect((err, client) => {
      console.log('Connected to MongoDB.');
      if (err) {
        reject(err);
      }
      resolve((client as MongoClient).db());
    });
  });
}
