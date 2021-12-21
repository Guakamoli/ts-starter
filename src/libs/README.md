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
MQ_ACCESS_KEY_ID=CHANGEME
MQ_ACCESS_KEY_SECRET=CHANGEME
MQ_ENDPOINT=CHANGEME
MQ_INSTANCE_ID=CHANGEME
MQ_TOPIC_ID=CHANGEME
MQ_GROUP_ID=CHANGEME
```
