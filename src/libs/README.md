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

```bash
MQ_ACCESS_KEY_ID=
MQ_ACCESS_KEY_SECRET=
MQ_ENDPOINT=
MQ_INSTANCE_ID=
MQ_TOPIC_ID=
MQ_GROUP_ID=
```
