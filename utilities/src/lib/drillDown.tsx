// Define a type that can recursively handle nested objects and arrays
/**
 * A type that represents a nested object structure.
 * Can contain other nested objects, arrays, or primitive values.
 */
type NestedObject = {
  [key: string]: NestedObject | any[] | primitive;
};

type primitive = string | number | boolean | null | undefined;

/**
 * Type for handling dot notation path strings with a depth limit.
 *
 * @template T - The type of the object being traversed.
 * @template D - The maximum depth of the path (default is 5).
 */
type PathString<T, D extends number = 5> = D extends 0
  ? never
  : T extends primitive
  ? never
  : T extends any[]
  ? `${number}` | `${number}.${PathString<T[number], Prev[D]>}`
  : T extends object
  ?
      | (keyof T & string)
      | `${keyof T & string}.${PathString<T[keyof T], Prev[D]>}`
  : never;

/**
 * Helper type to decrement depth counter.
 */
type Prev = [never, 0, 1, 2, 3, 4, 5];

/**
 * Type to get the value type at a given path in a nested object.
 *
 * @template T - The type of the object being traversed.
 * @template P - The path string to the desired value.
 * @template D - The maximum depth of the path (default is 5).
 * @returns The type of the value at the specified path, or never if the path is invalid.
 */
type PathValue<T, P extends string, D extends number = 5> = D extends 0
  ? never
  : P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R, Prev[D]>
    : undefined
  : undefined;

/**
 * Function to get the type of value at a given path.
 *
 * @template T - The type of the object being traversed.
 * @template P - The path string to the desired value.
 * @template D - The maximum depth of the path (default is 5).
 * @param obj - The object to traverse.
 * @param path - The dot notation path string to the desired value.
 * @returns The value at the specified path, or undefined if not found.
 */
export function drillDown<T extends NestedObject, P extends PathString<T, 5>>(
  obj: T,
  path: P
): PathValue<T, P> {
  if (!obj || !path) return undefined as PathValue<T, P>;

  const keys = path.split('.');

  return keys.reduce((acc: any, key) => {
    if (acc === null || acc === undefined) return undefined;

    // Handle array indices
    if (Array.isArray(acc)) {
      const index = parseInt(key);
      if (!isNaN(index)) {
        return acc[index];
      }
    }

    return acc[key];
  }, obj) as PathValue<T, P>;
}
