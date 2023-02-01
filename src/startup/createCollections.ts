import { collectionIndex } from '../mod';
import { BaseContext, BaseCollectionIndex } from '../types';
import mongodb from 'mongodb';

const collections: BaseCollectionIndex[] = [
  // {
  //   name: 'test',
  //   options: {},
  //   indexes: [
  //     {
  //       index: { log: 1, now: -1 },
  //       options: { name: 'c_log' },
  //     },
  //   ],
  // },
];

const getCollectionPromise = (
  db: mongodb.Db,
  collectionConfig: BaseCollectionIndex,
) => {
  return new Promise((resolve, reject) => {
    db.collection(
      collectionConfig.name,
      { strict: true },
      (error: any, collection: mongodb.Collection) => {
        if (error) {
          db.createCollection(
            collectionConfig.name,
            collectionConfig.options as mongodb.CollectionCreateOptions,
          )
            .then((newCollection: mongodb.Collection) => {
              resolve(newCollection);
            })
            .catch(reject);
        } else {
          db.command({
            collMod: collectionConfig.name,
            ...collectionConfig.options,
          })
            .then(() => {
              resolve(collection);
            })
            .catch(reject);
        }
      },
    );
  });
};

export default async function createCollections(ctx: BaseContext) {
  for (const collectionConfig of collections) {
    const db = ctx.db as mongodb.Db;
    const collection = (await getCollectionPromise(
      db,
      collectionConfig,
    )) as mongodb.Collection;

    if (Array.isArray(collectionConfig.indexes)) {
      const indexingPromises = collectionConfig.indexes.map((indexArgs: any) =>
        collectionIndex(collection, indexArgs.index, indexArgs.options || {}),
      );
      await Promise.all(indexingPromises);
    }
  }
}
