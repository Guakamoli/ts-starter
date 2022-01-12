/**
 * @summary 睡眠函数
 * @param {number} ms 毫秒数，默认 1000
 * @returns {Promise<void>} -
 */
export const sleep = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
