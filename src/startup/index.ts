import { startup } from '../mod';

// 一个简单的 startup
startup.set('hello', () => {
  console.log('hello world');
});
