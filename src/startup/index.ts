import { BaseContext } from '../types';

const startups: any[] = [];

export default (function (this: any) {
  this.run = async (ctx: BaseContext) => {
    console.log('startup running...');
    startups.forEach(async (startup) => {
      await startup(ctx);
    });
  };

  return this;
})();
