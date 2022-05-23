import { MQOptions, Topic } from '../types';
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
  topics: Array<Topic>;

  client: any;
  consumers: Map<string, any>;

  constructor(options: MQOptions);
  genRocketmqMsgProps(key: string, props: Object): Object;
  getConsumer(topicId: string): any;
  send(
    topic: string,
    body: any,
    tag: string,
    messageKey: string,
    props: Object,
    retry: number,
  ): Promise<void>;
}
