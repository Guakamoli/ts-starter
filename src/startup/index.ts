import { startup } from '../mod';
import createCollections from './createCollections';

// 一个简单的 startup
startup.set('hello', () => {
  console.log('hello world');
});

startup.set('createCollections', createCollections);
