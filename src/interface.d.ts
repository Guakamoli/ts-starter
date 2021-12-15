import { Db, Collection, Document } from 'mongodb';
import Koa from 'koa';

export interface MongoContext {
  Db?: Db;
  collection?: (greeting: string) => Collection<Document>;
}

export type HttpContext = MongoContext;

export type HttpMethod = 'all' | 'get' | 'post' | 'put' | 'del';
