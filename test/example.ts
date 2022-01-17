import { test } from 'uvu';
import assert from 'uvu/assert';
import { runApp } from '../dist';

test('simple', () => {
  assert.instance(runApp, Function);
});

test.run();
