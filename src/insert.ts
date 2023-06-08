import Distree from "./Distree.ts"
import from from "./from.ts"
import isDistree from "./isDistree.ts"
import { isPlainObject } from "./isPlainObject.ts"
import locate from "./locate.ts"
import { normalizePath } from "./normalizePath.ts"

const rec = <T>(
	components: string[],
	resolved: Distree<T> | T | undefined,
	value: Distree.ItemInitializer<T>,
): Distree<T> | T => {
	if (components.length === 0) return isPlainObject(value) ? from(value) : value
	else {
		const [component, ...rest] = components as [string, ...string[]]
		const distree = isDistree(resolved) ? resolved : from<T>({})
		const content = { ...distree, [component]: rec(rest, distree[component], value) }
		return from<T>(content)
	}
}

/**
 * Insert a new value at the specified path. It does not modify the given distree, and instead returns a new distree.
 *
 * @param distree The distree the result is based on.
 * @param path The location the new value is placed at.
 * @param value The new value.
 * @returns A new root distree.
 */
const insert = <T>(
	distree: Distree<T>,
	[path, value]: readonly [string, Distree.ItemInitializer<T>],
): Distree<T> => {
	const current = locate(distree)
	const absolute = normalizePath(current + "/" + path)
	const components = absolute.split(/\/+/).slice(1)
	return rec(components, distree["/"], value) as Distree<T>
}

export default insert