export function makeItemArray<
  T extends { [key: string]: unknown } | undefined
>({
  item,
  length,
  uniqueValueKey,
  uniqueValueExpression,
}: {
  item: T;
  length: number;
  uniqueValueKey?: string;
  uniqueValueExpression?:
    | ((item: T, uniqueValueKey: string, i: number) => string | number)
    | undefined;
}): T[] {
  const result = new Array(length);
  const itemClone = item && Object.assign({}, item);

  if (uniqueValueKey && uniqueValueExpression) {
    for (let i = 0; i < length; i++) {
      result[i] = Object.assign({}, itemClone, {
        [uniqueValueKey]: uniqueValueExpression(itemClone, uniqueValueKey, i),
      });
    }
  } else if (uniqueValueKey) {
    const initialValue = itemClone[uniqueValueKey]
      ? (itemClone[uniqueValueKey] as string | number) || ''
      : undefined;
    const initialValueIsNumber = typeof initialValue === 'number';
    const incrementValue = (i: number) =>
      initialValueIsNumber ? initialValue + (i - 1) : initialValue + ' ' + i;

    for (let i = 0; i < length; i++) {
      if (initialValue) {
        result[i] = Object.assign({}, itemClone, {
          [uniqueValueKey]: (initialValue satisfies string | number)
            ? (initialValue as any) + incrementValue(i)
            : initialValue,
        });
      }
    }
  } else {
    for (let i = 0; i < length; i++) {
      result[i] = itemClone;
    }
  }

  return result;
}
