declare module '@aliyunmq/mq-http-sdk' {
  export function MQConsumer();
  export function MessageProperties();

  export type MQClient = {
    constructor();
    getConsumer(instanceId: string, topicId: string, groupId: string): any;
  };
}

declare class MQ {
  instanceId: string;
  topicId: string;
  groupId: string;

  client: any;
  consumer: any;

  constructor();
  genRocketmqMsgProps(key: string, props: Object): Object;
  send(
    body: any,
    tag: string,
    messageKey: string,
    props: Object,
    retry: number,
  ): Promise<void>;
}
