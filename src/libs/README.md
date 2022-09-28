# 环境变量

```js
const ctx = Context({
  mpush: new MPush({
    accessKeyId: config.MPUSH_ACCESS_KEY_ID,
    accessKeySecret: config.MPUSH_ACCESS_KEY_SECRET,
  }),
  mq: new MQ({
    accessKeyId: config.MQ_ACCESS_KEY_ID,
    accessKeySecret: config.MQ_ACCESS_KEY_SECRET,
    endpoint: config.MQ_ENDPOINT,
    instanceId: config.MQ_INSTANCE_ID,
    topicId: config.MQ_TOPIC_ID,
    groupId: config.MQ_GROUP_ID,
  }),
});

console.log(ctx);
```

## mq.ts

> 使用前请 `pnpm add @aliyunmq/mq-http-sdk`
> 在 `mod.ts` 中解开注释

```bash
MQ_ACCESS_KEY_ID=CHANGEME
MQ_ACCESS_KEY_SECRET=CHANGEME
MQ_ENDPOINT=CHANGEME
MQ_INSTANCE_ID=CHANGEME
MQ_TOPIC_ID=CHANGEME
MQ_GROUP_ID=CHANGEME
```

## startup.ts

在应用启动时，会创建执行一系列方法，例如一个循环监听消息的队列；检查数据库监听；创建文件临时存储目录；等等

### 添加启动函数

```js
import { BaseContext } from '../types';

startup.set('createCollections', async (ctx: BaseContext) => {
  // context 基础属性，更多属性在 index.ts 自行添加
  const { db, collection, transaction } = ctx;

  
});
```

## callbacks.ts

### 添加事件

> 可以添加多个相同事件

```js
callbacks.add('事件名称', async (...args: any[]) => {
  console.log(args);
  // output: [true, '2', 3]
  return '第一个callback';
});

// 可以添加多个相同事件
callbacks.add('事件名称', async (...args: any[]) => {
  console.log(args);
  // output: [true, '2', 3]
  return '第二个callback';
});
```

### 发射一下

```js
// 不会等待完成返回结果
callbacks.emit('事件名称', true, '2', 3);
```

### 返回值 (可异步)

```js
// 是否 await 要看事件的回调
const result = await callbacks.run('事件名称', true, '2', 3);
console.log(result);
// output: "第二个callback"
```

## cache.ts

> 使用前请 `pnpm add redis@4`
> 在 `mod.ts` 中解开注释

### 内存缓存

```js
// 写入内存缓存。ttl默认60s后过期
memoryCache.addValue('some_1', '12345678');

// 读取缓存
memoryCache.getValue('some_1');
// output: "12345678"

// 检查缓存过期
memoryCache.hasExpired('some_1');
// output: false

// 过 60s 后
memoryCache.getValue('some_1');
// output: undefined

memoryCache.hasExpired('some_1');
// output: true

// 设置缓存存活时间的演示
// 添加缓存，10s 后过期
memoryCache.addValue('some_2', '87654321', 10);

// 删除缓存
memoryCache.deleteValue('some_2');
// output: "87654321"

// 读取缓存
memoryCache.getValue('some_2');
// output: undefined
```

### redis

与内存缓存类似
