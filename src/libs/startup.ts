import { BaseContext } from '../types';

function initStartup(this: any) {
  const startup = new Map();

  this.run = async function (ctx: BaseContext) {
    for await (const [name, fn] of startup) {
      console.log(`Running startup function "${name}"`);
      await fn(ctx);
    }
  };

  this.set = async function (name: string, callback: any) {
    startup.set(name, callback);
  };

  return this;
}

export default initStartup();
