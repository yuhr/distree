import Distree from "./Distree.ts"
import ancestors from "./ancestors.ts"
import from from "./from.ts"
import fromDirectory from "./fromDirectory.ts"
import insert from "./insert.ts"
import isDistree from "./isDistree.ts"
import locate from "./locate.ts"
import remove from "./remove.ts"
import transform from "./transform.ts"
import transformAsync from "./transformAsync.ts"

type index<T> = Distree<T>
const index = Object.freeze({
	ancestors,
	from,
	fromDirectory,
	insert,
	isDistree,
	locate,
	remove,
	transform,
	transformAsync,
})

export default index