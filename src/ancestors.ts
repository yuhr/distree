import Distree from "./Distree.ts"

/**
 * Generates over ancestors of a distree. Note that it yields the passed distree at first.
 *
 * @param distree The initial distree the generator iterates from.
 */
const ancestors = function* <T>(distree: Distree<T>): Generator<Distree<T>, void, undefined> {
	yield distree
	const parent = distree[".."] as Distree<T>
	if (parent !== distree) yield* ancestors(parent)
}

export default ancestors