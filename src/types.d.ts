import { Db, Collection, CollectionCreateOptions } from './mod';

export interface BaseContext extends Record<T> {
  [key: string | number]: any;
  [index: number]: any;
}

export type HttpMethod = 'all' | 'get' | 'post' | 'put' | 'del';

export type MQOptions = {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
  instanceId: string;
  topics: Array<Topic>;
};

export type Topic = {
  topicId: string;
  groupId: string;
};

export type MPushOptions = {
  accessKeyId: string;
  accessKeySecret: string;
};

export type BaseCollectionIndexesItem = {
  index: Record<string>;
  options?: Record<string>;
};

export type BaseCollectionIndex = {
  name: string;
  options: CollectionCreateOptions;
  indexes: BaseCollectionIndexesItem[];
};

export type ConnectionCursor = string;
export type ConnectionLimitInt = number;

export interface Pagination {
  after?: ConnectionCursor;
  before?: ConnectionCursor;
  first?: ConnectionLimitInt;
  last?: ConnectionLimitInt;
  offset?: number;
  sortOrder?: 'asc' | 'desc';
  sortBy?: string;
  query?: Record<string>;
}

export interface FetchOptions {
  internal?: boolean;
  output?: 'json' | 'text';
  interceptor?: boolean;
}

export type Callback = (...args: any[]) => any;

export interface Cache {
  addValue(key: any, value: any, ttl?: number): void | Promise<void>;
  getValue(key: any): Promise<T>;
  hasExpired(key: string): boolean | Promise<boolean>;
  deleteValue(key: string): T | Promise<T>;
}

export type RetryCallbackOptions = {
  retry?: number;
  wait?: number;
}
