import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export async function redisConnectWithRetry(
  url: string,
): Promise<RedisClientType> {
  console.log('Connecting to Redis...');

  redisClient = createClient({ url });
  redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
  await redisClient.connect();
  console.log('Connected to Redis.');
  return redisClient;
}

export { redisClient };
