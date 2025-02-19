import { expect, test } from 'vitest';
import { drillDown } from './drillDown';

const data = { id: 1, name: 'Tendaishe' };
test('Drilling down a simple object to obtain a value', () => {
  expect(drillDown(data, 'name')).toEqual('Tendaishe');
});

describe('drillDown', () => {
  const testObject = {
    a: {
      b: {
        c: 42,
        d: [1, 2, 3],
      },
    },
    x: [10, 20, { y: 'hello' }],
  };

  it('should return the correct value for a valid path', () => {
    expect(drillDown(testObject, 'a.b.c')).toBe(42);
    expect(drillDown(testObject, 'x.2.y')).toBe('hello');
  });

  it('should return undefined for an invalid path', () => {
    expect(drillDown(testObject, 'x.3')).toBeUndefined();
  });

  it('should handle array indices correctly', () => {
    expect(drillDown(testObject, 'x.0')).toBe(10);
    expect(drillDown(testObject, 'x.2.y')).toBe('hello');
  });
});
