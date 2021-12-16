import { Db, Collection, Document } from 'mongodb';
import Koa from 'koa';

export interface BaseContext extends Record<T> {
  [key: string | number]: any;
  [index: number]: any;
}

export type HttpMethod = 'all' | 'get' | 'post' | 'put' | 'del';
