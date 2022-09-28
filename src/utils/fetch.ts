import _fetch, { RequestInit } from 'node-fetch';
import config from '../config';
import { FetchOptions } from '../types';

export async function fetch(url: string): Promise<any>;
export async function fetch(
  url: string,
  init: RequestInit & FetchOptions,
): Promise<any>;
export async function fetch(url: string, init?: RequestInit & FetchOptions) {
  const {
    method = 'GET',
    body,
    headers = {},
    output = 'json',
    internal = false,
  } = init || {};

  const response = await _fetch(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(internal ? { 'x-secret': config.INTERNAL_X_SECRET } : {}),
      ...headers,
    },
    body,
  });

  if (!response.ok)
    throw new Error(`HTTP Request faild status: ${response.status}`);

  if (output !== 'json') {
    return response.text();
  }
  return response.json();
}
