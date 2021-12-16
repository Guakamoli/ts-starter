import { BaseContext } from '../types';

export function withContext(obj: object = {}) {
  const ctx: BaseContext = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'db') {
      ctx.collection = (name: string) => value.collection(name);
    }
    ctx[key] = value;
  });

  return ctx;
}

export function Context() {
  return {} as BaseContext;
}
