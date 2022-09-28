import { Cache } from '../types';
import { redisClient } from './redis';

export class MemoryCache extends Map implements Cache {
  addValue(key: any, value: any, ttl?: number) {
    if (typeof ttl !== 'number') {
      ttl = 60;
    }

    this.set(key, {
      value,
      createdAt: Date.now(),
      expired: ttl * 1000,
    });
  }

  getValue(key: string) {
    const value = this.get(key);
    if (value?.expired && this.hasExpired(key)) {
      this.delete(key);
      return undefined;
    }
    return value?.value;
  }

  hasExpired(key: string) {
    if (this.has(key)) {
      const value = this.get(key);
      if (value.createdAt + value.expired > Date.now()) {
        return false;
      }
    }
    return true;
  }

  deleteValue(key: string) {
    return this.delete(key);
  }
}

export class RedisCache implements Cache {
  async addValue(key: any, value: any, ttl?: number) {
    if (typeof ttl !== 'number') {
      ttl = 60;
    }

    await redisClient.set(key, value, { EX: ttl });
  }

  async getValue(key: string) {
    const value = await redisClient.get(key);
    if (value === null) {
      return undefined;
    }
    return value;
  }

  async hasExpired(key: string) {
    if (await redisClient.exists(key)) {
      if ((await redisClient.ttl(key)) <= 0) {
        return true;
      }
    }
    return false;
  }

  async deleteValue(key: string) {
    await redisClient.del(key);
  }
}

export const redisCache = new RedisCache();

export const memoryCache = new MemoryCache();
