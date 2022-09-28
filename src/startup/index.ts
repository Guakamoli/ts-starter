import { startup } from '../mod';
import config from '../config';
import createCollections from './createCollections';
import initCallbacks from './initCallbacks';

startup.set('initCallbacks', initCallbacks);
if (config.WORKER_ENABLE) {
  // 放置另一个工作容器中运行，代码一致
} else {
  startup.set('createCollections', createCollections);
}
