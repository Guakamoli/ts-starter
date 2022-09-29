import { RetryCallbackOptions } from '../types';
import { sleep } from './sleep';

/**
 * 回调重试函数
 * @param {any} callback 
 * @param {RetryCallbackOptions} options
 * @param {number} options.retry
 * @param {number} options.wait
 */
export async function retryCallback(callback: any, options?: RetryCallbackOptions) {
  let { retry = 3, wait } = options || {};

  let result;
  while (retry--) {
    try {
      result = await callback();
      break;
    } catch (err: any) {
      console.error('retryCallback error:', err);
    }

    if (wait) {
      await sleep(wait);
    }
  }
  return result;
};
