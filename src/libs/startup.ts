import { BaseContext, Callback } from '../types';

class Startup {
  #stack: Map<string, Callback>;

  constructor() {
    this.#stack = new Map();
  }

  async run(ctx: BaseContext) {
    for (const [name, fn] of this.#stack) {
      console.log(`Running startup function "${name}"`);
      await fn(ctx);
    }
  }

  set(name: string, callback: any) {
    if (!this.#stack.has(name)) {
      this.#stack.set(name, callback);
    } else {
      console.warn(`A startup with the same name exists. name: "${name}"`);
    }
  }

  clear = () => this.#stack.clear();
}

export const startup = new Startup();
