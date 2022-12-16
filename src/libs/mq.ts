import { MQClient, MQConsumer, MQProducer, MessageProperties } from '@aliyunmq/mq-http-sdk';
import { MQOptions, Topic } from '../types';
import Ons20190214, * as $Ons20190214 from '@alicloud/ons20190214';
import * as $OpenApi from '@alicloud/openapi-client';

export class MQ {
  #instanceId: string;
  #topics: Array<Topic>;

  #client: MQClient;
  #consumers: Map<string, MQConsumer>;

  #manageClient: Ons20190214;

  constructor(options: MQOptions) {
    const { accessKeyId, accessKeySecret, endpoint, instanceId, topics, regionId } =
      options;

    this.#instanceId = instanceId;
    this.#topics = topics;

    this.#client = new MQClient(endpoint, accessKeyId, accessKeySecret);
    this.#consumers = new Map();

    const config = new $OpenApi.Config({ accessKeyId, accessKeySecret });
    config.endpoint = `ons.${regionId}.aliyuncs.com`;
    this.#manageClient = new Ons20190214(config);
  }

  getConsumer(topicId: string, groupId?: string) {
    if (this.#consumers.has(topicId)) {
      return this.#consumers.get(topicId) as MQConsumer;
    } else {
      const topic = this.#topics.find((topic) => topic.topicId === topicId);
      if (!topic) {
        throw new Error(`Topic not found. topicId: ${topicId}`);
      }
      const consumer = this.#client.getConsumer(
        this.#instanceId,
        topic.topicId,
        groupId ?? topic.groupId,
      ) as MQConsumer;
      this.#consumers.set(topicId, consumer);
      return consumer;
    }
  }

  /**
   * @param groupId 分组ID
   */
  async createGroup(groupId: string) {
    const request = new $Ons20190214.OnsGroupCreateRequest({
      groupId,
      instanceId: this.#instanceId,
    });
    try {
      await this.#manageClient.onsGroupCreate(request);
    } catch (err: any) {
      if (err.code) {
        switch (err.code) {
          case 'BIZ_SUBSCRIPTION_EXISTED':
            {
              console.warn(`[CreateGroup] 存在GroupId, 不需要重复创建. groupId: ${groupId}`);
            }
            break;
          default:
            {
              console.log(`[CreateGroup] 未知错误. groupId: ${groupId} errData:`, err.data);
            }
            break;
        }
      }
    }
  }

  /**
   * 
   * @param topicId 主题ID
   * @param groupId group前缀 GID_some_xxx
   * @param count 分区数量也就是 group 数量
   */
  async getConsumerShard(topicId: string, groupId: string, count: number = 4) {
    const consumers: { consumer: MQConsumer, groupId: string }[] = [];
    for (let i = 0; i < count; i++) {
      const preGroupId = `${groupId}_${i + 1}`;
      await this.createGroup(preGroupId);
      const consumer = this.getConsumer(topicId, preGroupId);
      consumers.push({ consumer, groupId: preGroupId });
    }
    return consumers;
  }

  /**
   * @description 构造消息的属性
   * @param {string} key MessageKey
   * @param {Object} props MessageProperties
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
   * @param topic 主题ID
   * @param body 消息体
   * @param tag 消息标签
   * @param messageKey 消息key
   * @param props 消息属性
   * @param retry 消息重试次数
   * @returns result
   */
  async send(
    topic: string,
    body: any,
    tag: string,
    messageKey: string = '',
    props: any = {},
    retry: number = 3,
  ): Promise<void> {
    if (!body) {
      return;
    }

    let msgProps = new MessageProperties();
    if (props) {
      msgProps = this.genRocketmqMsgProps(messageKey, props);
    }

    try {
      const producer = this.#client.getProducer(this.#instanceId, topic) as MQProducer;
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

export {
  MQClient, MQConsumer, MQProducer, MessageProperties
}
