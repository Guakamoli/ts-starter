import { BaseContext } from '../types';

function initStartup(this: any) {
  const startup = new Map();

  this.run = async function (ctx: BaseContext) {
    for (const [name, fn] of startup) {
      console.log(`Running startup function "${name}"`);
      await fn(ctx);
    }
  };

  this.set = async function (name: string, callback: any) {
    if (!startup.has(name)) {
      startup.set(name, callback);
    } else {
      console.warn(`A startup with the same name exists. name: "${name}"`);
    }
  };

  this.clear = async function () {
    startup.clear();
  };

  return this;
}

export default initStartup();
