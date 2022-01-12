import { MQClient, MessageProperties } from '@aliyunmq/mq-http-sdk';
import { MQOptions } from '../types';

export class MQ {
  instanceId: string;
  topicId: string;

  client: any;
  consumer: any;

  constructor(options: MQOptions) {
    const {
      accessKeyId,
      accessKeySecret,
      endpoint,
      instanceId,
      topicId,
      groupId,
    } = options;

    this.instanceId = instanceId;
    this.topicId = topicId;

    this.client = new MQClient(endpoint, accessKeyId, accessKeySecret);
    this.consumer = this.client.getConsumer(instanceId, topicId, groupId);
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
   * @param {string} body 消息体
   * @param {string} tag 消息标签
   * @param {string} messageKey 消息key
   * @param {Object} props 消息属性
   * @param {number} retry 消息重试次数
   * @returns {Promise<void>} result
   */
  async send(body: string, tag: string, messageKey = '', props = {}, retry = 3) {
    if (!body) {
      return;
    }

    let msgProps = new MessageProperties();
    if (props) {
      msgProps = this.genRocketmqMsgProps(messageKey, props);
    }

    try {
      const producer = this.client.getProducer(this.instanceId, this.topicId);
      await producer.publishMessage(body, tag, msgProps);
      console.log('send message success');
    } catch (error) {
      console.log('send message error', error);
      if (retry > 0) {
        // 消息发送失败，需要进行重试处理，可重新发送这条消息或持久化这条数据进行补偿处理。
        await this.send(body, tag, messageKey, props, retry - 1);
      }
    }
  }
}
