import { makeItemArray } from './makeItemArray';

describe('makeItemArray', () => {
  // Test case 1: Basic functionality with a single item
  it('should create an array of objects with a unique value based on a key and expression', () => {
    const item = { id: 1, name: 'Item' };
    const length = 3;
    const uniqueValueKey = 'id';
    const uniqueValueExpression = (item: any, key: string, i: number) =>
      item[key] + i;

    const result = makeItemArray({
      item,
      length,
      uniqueValueKey,
      uniqueValueExpression,
    });
    expect(result).toEqual([
      { id: 1, name: 'Item' },
      { id: 2, name: 'Item' },
      { id: 3, name: 'Item' },
    ]);
  });

  // Test case 2: Using a unique value key without an expression
  it('should create an array with incremented unique values', () => {
    const item = { id: 1 };
    const length = 3;
    const uniqueValueKey = 'id';

    const result = makeItemArray({ item, length, uniqueValueKey });
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  // Test case 3: No unique value key or expression
  it('should create an array of identical objects', () => {
    const item = { id: 1, name: 'Item' };
    const length = 3;

    const result = makeItemArray({ item, length });
    expect(result).toEqual([
      { id: 1, name: 'Item' },
      { id: 1, name: 'Item' },
      { id: 1, name: 'Item' },
    ]);
  });

  // Test case 4: Undefined item
  it('should handle undefined item gracefully', () => {
    const item = undefined;
    const length = 3;

    const result = makeItemArray({ item, length });
    expect(result).toEqual([undefined, undefined, undefined]);
  });

  // Test case 5: Unique value expression returning a string
  it('should handle unique value expression returning a string', () => {
    const item = { id: 1 };
    const length = 3;
    const uniqueValueKey = 'id';
    const uniqueValueExpression = (item: any, key: string, i: number) =>
      `Item ${i + 1}`;

    const result = makeItemArray({
      item,
      length,
      uniqueValueKey,
      uniqueValueExpression,
    });
    expect(result).toEqual([
      { id: 'Item 1' },
      { id: 'Item 2' },
      { id: 'Item 3' },
    ]);
  });

  // Test case 6: Non-numeric initial value
  it('should handle non-numeric initial values correctly', () => {
    const item = { id: 'Item', name: 'Sample' };
    const length = 3;
    const uniqueValueKey = 'id';
    const uniqueValueExpression = (item: any, key: string, i: number) =>
      item[key] + ' ' + (i + 1);

    const result = makeItemArray({
      item,
      length,
      uniqueValueKey,
      uniqueValueExpression,
    });
    expect(result).toEqual([
      { id: 'Item 1', name: 'Sample' },
      { id: 'Item 2', name: 'Sample' },
      { id: 'Item 3', name: 'Sample' },
    ]);
  });
});
