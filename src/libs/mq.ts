import { MQClient, MessageProperties } from '@aliyunmq/mq-http-sdk';
import { MQOptions, Topic } from '../types';

export class MQ {
  instanceId: string;
  topics: Array<Topic>;

  client: any;
  consumers = new Map();

  constructor(options: MQOptions) {
    const { accessKeyId, accessKeySecret, endpoint, instanceId, topics } =
      options;

    this.instanceId = instanceId;
    this.topics = topics;

    this.client = new MQClient(endpoint, accessKeyId, accessKeySecret);
  }

  getConsumer(topicId: string) {
    if (this.consumers.has(topicId)) {
      return this.consumers.get(topicId);
    } else {
      const topic = this.topics.find((topic) => topic.topicId === topicId);
      if (!topic) {
        throw new Error(`Topic not found. topicId: ${topicId}`);
      }
      const consumer = this.client.getConsumer(
        this.instanceId,
        topic.topicId,
        topic.groupId,
      );
      this.consumers.set(topicId, consumer);
      return consumer;
    }
  }

  /**
   * @description 构造消息的属性
   * @param {string} key MessageKey
   * @param {Object} props MessageProperties
   * @returns {Object} result
   */
  genRocketmqMsgProps(key: string, props: Object) {
    const msgProps = new MessageProperties();
    Object.entries(props).forEach(([key, value]) => {
      msgProps.putProperty(key, value);
    });

    if (key) {
      msgProps.messageKey(key);
    }

    return msgProps;
  }

  /**
   * @description 发送RockerMQ消息
   * @param {string} topic 主题ID
   * @param {Object} body 消息体
   * @param {string} tag 消息标签
   * @param {string} messageKey 消息key
   * @param {Object} props 消息属性
   * @param {number} retry 消息重试次数
   * @returns {Promise<void>} result
   */
  async send(
    topic: string,
    body: any,
    tag: string,
    messageKey = '',
    props = {},
    retry = 3,
  ) {
    if (!body) {
      return;
    }

    let msgProps = new MessageProperties();
    if (props) {
      msgProps = this.genRocketmqMsgProps(messageKey, props);
    }

    try {
      const producer = this.client.getProducer(this.instanceId, topic);
      await producer.publishMessage(body, tag, msgProps);
      console.log('send message success');
    } catch (error) {
      console.log('send message error', error);
      if (retry > 0) {
        // 消息发送失败，需要进行重试处理，可重新发送这条消息或持久化这条数据进行补偿处理。
        await this.send(topic, body, tag, messageKey, props, retry - 1);
      }
    }
  }
}
