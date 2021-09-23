/**
 * A frozen plain object that accepts paths as index reference. It also supports `Symbol.iterator` interface that enumerates nested leaves with the keys being paths.
 */
export type Distree<T> = {
  readonly [key: string]: Distree<T> | T | undefined
  [Symbol.iterator](): Iterator<[string, T]>
}

export const symbol: unique symbol = Symbol()

export const isPlainObject = (value: unknown): value is object => {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

/**
 * Tests if a value is a distree.
 *
 * @param value The value to be tested.
 */
export const isDistree = <T>(value: unknown): value is Distree<T> => {
  return isPlainObject(value) && symbol in value
}

/**
 * Tests if a value should be treaded as empty in a distree. An empty value is automatically removed from a distree when set. A value is empty when:
 *
 * 1. The value is `undefined`
 * 2. The value is a plain object or array and it has no enumerable own string keys.
 *
 * @param value The value to be tested.
 */
export const isEmpty = <T>(value: Distree<T> | T | undefined): boolean => {
  return (
    value === undefined ||
    ((isPlainObject(value) || Array.isArray(value)) &&
      Object.keys(value).length === 0)
  )
}

export default Distree