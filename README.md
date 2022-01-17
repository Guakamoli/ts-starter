# ts-starter

一个 typescript 的样板房

> 默认允许编写 js 代码，具体可自行修改 [tsconfig.json](./tsconfig.json)

## 特性

- 更快更安全的包管理器 **[pnpm](https://github.com/pnpm/pnpm)**
- 打包 **[tsup](https://github.com/egoist/tsup)**
- 测试 **[uvu](https://github.com/lukeed/uvu)**
- 集成 **[mongodb](https://github.com/mongodb/node-mongodb-native)** ([document](https://mongodb.github.io/node-mongodb-native/4.2/))
- 支持构建镜像(优化过大小)

## 可选类库

- 网络请求库 [node-fetch](https://github.com/node-fetch/node-fetch) `npx pnpm add node-fetch@^2.6.6`
- 模式验证匹配库 [simpl-schema](https://github.com/longshotlabs/simpl-schema) `npx pnpm add simpl-schema`
- 字符串ID生成器 [nanoid](https://github.com/ai/nanoid) (小巧、快速、安全、URL友好、唯一) `npx pnpm add nanoid`

## 环境变量

```bash
# 自带的一些环境变量
NODE_ENV=development
PORT=8080
HTTP_ENABLE=true
WORKER_ENABLE=false
MONGO_DIRECT_CONNECTION=true
MONGO_USE_NEW_URL_PARSER=true
MONGO_USE_UNIFIED_TOPOLOGY=true
MONGO_URL=mongodb://localhost:27017/example
```

## 一些简单例子

> 如果你想用 js 的形式，我相信你可以的

### router (路由)

新建一个路由文件，放到 `routes/hello.ts`

```js
// routes/hello.ts

import { Context } from 'koa';
import Router from '@koa/router';

const router = new Router({
  prefix: '/hello',
});

// 简单的中间件例子
router.use('/say', async (_: Context, next: any) => {
  console.log('我看见了一个美女');
  await next();
  console.log('美女hi了声转身走掉');
});

router.get('/say', (ctx: Context) => {
  ctx.body = '👩🏻hi';
});

export default router;
```

> 注意需要导入到 `routes/index.ts`

```js
// routes/index.ts
import hello from './hello';

// ... 中间其他的逻辑

export default [router, hello];
```

### middleware (中间件)

```js
import { Context } from 'koa';

// 这里的例子是比较提交的 token 不一致
export default async function verifyToken() {
  const TOKEN = '12345678';

  return async (ctx: Context, next: any) => {
    // 一些逻辑  
    const { token1 = '', token2 = '' } = ctx.request.body;

    // 直接抛出错误的例子
    if (token1 !== TOKEN) {
      ctx.fail(new Error('Invalid token'), 401);
      return;
    }

    // 如果不想直接返回错误，可以这样
    if (token2 !== TOKEN) {
      const result = {
        message: 'ok',
      };

      // 几种返回结果的方式
      ctx.body = result;
      // ctx.success({});
      // ctx.json(result);
      return;
    }

    console.log('before 真正的逻辑执行前');
    await next();
    console.log('after 真正的逻辑执行后');
  };
}
```

### startup (启动程序)

#### 一般的

```js
import { BaseContext } from '../types';
import { Db, MQ } from '../mod';
import { sleep } from '../utils/sleep';

export default async function hello(ctx: BaseContext) {
  // 等待 3s
  await sleep(3000);
  console.log('❤️hello');

  // 如果你启用了 Mongodb
  // const db = ctx.db as Db;
  // await db.collection('test').findOne({});

  /**
   * 如果你启用了 MQ
   * 1. 使用前请 `pnpm add @aliyunmq/mq-http-sdk`
   * 2. 在 `mod.ts` 中解开注释
   */
  // const mq = ctx.mq as MQ;
  // await mq.send(JSON.stringify({ hello: 'world' }), 'thisTagName', 'thisKey');
}
```

#### 只有worker启用的

```js
import { BaseContext } from '../types';
import { Db, MQ } from '../mod';
import { sleep } from '../utils/sleep';

export default async function workman(ctx: BaseContext) {
  const listener = Promise.resolve();
  listener.then(async () => {
    while (true) {
      // 等待 3s
      await sleep(3000);
      console.log('👷🏻‍♂️workman start');

      // 如果你启用了 Mongodb
      // const db = ctx.db as Db;
      // await db.collection('test').findOne({});

      /**
       * 如果你启用了 MQ
       * 1. 使用前请 `pnpm add @aliyunmq/mq-http-sdk`
       * 2. 在 `mod.ts` 中解开注释
       */
      // const mq = ctx.mq as MQ;
      // await mq.send(JSON.stringify({ hello: 'world' }), 'thisTagName', 'thisKey');
    }
  });
}
```

### mongodb

使用事务

```js
async function(ctx) {
  await ctx.transaction(async (session: ClientSession) => {
    const result = await ctx.collection('test')
      .insertOne(
        { id: 'test-id', createdAt: new Date() },
        { session }
      );
    
    if (!result.result.ok) {
        throw new Error('Create address failed');
    }

    // 主动抛错，将导致写入不成果，最外层的 updateOne 也将会更新出错
    // throw new Error('Create address failed');

    console.log({ _id: result.insertedId });
  });

  const result = await ctx.collection('test')
      .updateOne({ id: 'test-id', updatedAt: new Date() });
  console.log(result);
}
```
