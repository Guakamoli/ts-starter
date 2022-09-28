import { BaseContext } from '../types';
import { callbacks } from '../mod';

export default async function initCallbacks(_: BaseContext) {
  callbacks.add('hello', () => {
    console.log('hi');
  });
}
