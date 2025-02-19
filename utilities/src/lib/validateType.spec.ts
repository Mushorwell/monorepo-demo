import { expect, test } from 'vitest';

import { validateType } from './validateType';

test('Validating a basic object', () => {
  expect(
    validateType({ a: 5, b: 6, c: 8 }, { checkPropNames: ['a', 'b', 'c'] })
  ).toBe(true);
});
