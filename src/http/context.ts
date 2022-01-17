import { BaseContext } from '../types';

export function withContext(obj: object = {}) {
  const ctx: BaseContext = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'mongo') {
      ctx.db = value.db();
      ctx.collection = (name: string, dbName?: string) => {
        return (dbName ? value.db(dbName) : value.db()).collection(name);
      };
      ctx.transaction = async (callback: any) => {
        let response;
        const session = value.startSession();
        await session.startTransaction({ readPreference: 'primary' });
        try {
          response = await callback(session);
          await session.commitTransaction();
          await session.endSession();
        } catch (err: any) {
          await session.abortTransaction();
          await session.endSession();
          throw err;
        }
        return response;
      };
    }
    ctx[key] = value;
  });

  return ctx;
}

export function Context(base: BaseContext = {}) {
  return { ...base } as BaseContext;
}
