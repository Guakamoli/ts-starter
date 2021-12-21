import { BaseContext } from '../types';

function initStartup(this: any) {
  const startup = new Map();

  // 默认的startup
  startup.set('hello', () => {
    console.log('hello world');
  });

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
