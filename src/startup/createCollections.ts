import { Db, Collection, collectionIndex } from '../mod';
import { BaseContext, BaseCollectionIndex } from '../types';

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

export default async (ctx: BaseContext) => {
  const db = ctx.db as Db;

  for (const collectionConfig of collections) {
    const getCollectionPromise = () => {
      return new Promise((resolve, reject) => {
        db.collection(
          collectionConfig.name,
          { strict: true },
          (error, collection) => {
            if (error) {
              db.createCollection(
                collectionConfig.name,
                collectionConfig.options,
              )
                .then((newCollection: Collection) => {
                  resolve(newCollection);
                  return null;
                })
                .catch(reject);
            } else {
              db.command({
                collMod: collectionConfig.name,
                ...collectionConfig.options,
              })
                .then(() => {
                  resolve(collection);
                  return null;
                })
                .catch(reject);
            }
          },
        );
      });
    };

    const collection = (await getCollectionPromise()) as Collection;

    if (Array.isArray(collectionConfig.indexes)) {
      const indexingPromises = collectionConfig.indexes.map((indexArgs: any) =>
        collectionIndex(collection, indexArgs.index, indexArgs.options || {}),
      );
      await Promise.all(indexingPromises);
    }
  }
};
