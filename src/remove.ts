import Distree from "./Distree.ts"
import from from "./from.ts"
import isDistree from "./isDistree.ts"
import locate from "./locate.ts"
import { normalizePath } from "./normalizePath.ts"

const rec = <T>(components: string[], resolved: Distree<T> | T): Distree<T> => {
	if (components.length === 1) {
		const [component] = components
		const distree = isDistree(resolved) ? resolved : from<T>({})
		const content = { ...distree }
		delete content[component!]
		return from<T>(content)
	} else {
		const [component, ...rest] = components
		const distree = isDistree(resolved) ? resolved : from<T>({})
		const content = { ...distree, [component!]: rec(rest, distree[component!]!) }
		return from<T>(content)
	}
}

/**
 * Removes the value at the specified path. It does not modify the given distree, and instead returns a new distree.
 *
 * @param distree The distree the result is based on.
 * @param path The location of the value to remove, relative to `distree`.
 * @returns A new root distree.
 */
const remove = <T>(distree: Distree<T>, path: string): Distree<T> => {
	const current = locate(distree)
	const absolute = normalizePath(current + "/" + path)
	const components = absolute.split(/\/+/).slice(1)
	return rec(components, distree["/"])
}

export default remove