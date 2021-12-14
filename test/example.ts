import { test } from 'uvu';
import assert from 'uvu/assert';
import { foo } from '../dist';

test('simple', () => {
  assert.equal(foo, '芜湖~');
});

test.run();
