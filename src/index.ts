// For named exports
export type { default as Distree } from "./Distree.ts"
export { default as ancestors } from "./ancestors.ts"
export { default as from } from "./from.ts"
export { default as isDistree } from "./isDistree.ts"
export { default as iterate } from "./iterate.ts"
export { default as locate } from "./locate.ts"
export { default as replace } from "./replace.ts"
export { default as resolve } from "./resolve.ts"
export { default as transform } from "./transform.ts"

// For default export
import ancestors from "./ancestors.ts"
import from from "./from.ts"
import isDistree from "./isDistree.ts"
import iterate from "./iterate.ts"
import locate from "./locate.ts"
import replace from "./replace.ts"
import resolve from "./resolve.ts"
import transform from "./transform.ts"

// @ts-expect-error
import * as Distree from "./Distree.ts"
type Distree<T> = Distree.Distree<T>
const Distree = {
  ancestors,
  from,
  isDistree,
  iterate,
  locate,
  replace,
  resolve,
  transform,
}

export default Distree