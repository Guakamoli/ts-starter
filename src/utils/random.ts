import crypto from 'crypto';

/**
 * @description 生成uuid第四版
 * @returns {String} -
 */
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @description 生成md5
 * @param {String} content -
 * @returns {String | Null} -
 */
export function md5(content: string): string | null {
  if (!content) return null;
  const hash = crypto.createHash('md5');
  return hash.update(content).digest('hex');
}
