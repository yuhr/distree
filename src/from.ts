import Distree, { symbol, isPlainObject } from "./Distree.ts"
import resolve from "./resolve.ts"
import iterate from "./iterate.ts"

export const readonly: PropertyDescriptor = {
  configurable: false,
  enumerable: false,
  writable: false,
} as const

const rec = <T>(
  content: Distree<T> | { [key: string]: typeof content | T | undefined },
  parent: Distree<T> | undefined,
): Distree<T> => {
  type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
  }
  const distree: Mutable<Distree<T>> = new Proxy({} as any, {
    get: (target, key, receiver) => {
      if (typeof key === "string") return resolve(target)(key)
      else return Reflect.get(target, key, receiver)
    },
  })

  // Populate as a distree
  Object.defineProperties(distree, {
    [symbol]: { ...readonly, value: undefined },
    "": { ...readonly, value: (parent && parent[""]) ?? distree },
    ".": { ...readonly, value: distree },
    "..": { ...readonly, value: parent ?? distree },
    [Symbol.iterator]: {
      ...readonly,
      *value() {
        yield* iterate(distree, undefined)
      },
    },
  })

  // Copy contents into the new distree
  if (content) {
    for (const [key, value] of Object.entries(content)) {
      if (isPlainObject(value)) {
        distree[key] = rec(value, distree)
      } else {
        distree[key] = value
      }
    }
  }

  return Object.freeze(distree)
}

/**
 * Creates a distree from the provided content. It doesn't modify the passed object.
 *
 * @param content The initial content of the distree. Only enumerable own string keys are respected, and nested plain objects are recursively converted to distrees.
 */
const from = <T>(
  content: Distree<T> | { [key: string]: typeof content | T | undefined },
): Distree<T> => {
  return rec(content, undefined)
}

export default from