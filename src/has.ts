// SPDX-License-Identifier: MPL-2.0

import type Distree from "./Distree.ts"
import isDistree from "./isDistree.ts"
import locate from "./locate.ts"
import { normalizePath } from "./utils/normalizePath.ts"

const rec = <T>(components: string[], resolved: Distree<T> | T): boolean => {
	if (!isDistree(resolved)) return false
	if (components.length === 1) {
		const [component] = components as [string]
		if (component === "") return true
		return Object.hasOwn(resolved, component)
	} else {
		const [component, ...rest] = components as [string, ...string[]]
		return rec(rest, resolved[component])
	}
}

/**
 * Checks whether the value exists at the specified path.
 *
 * @param distree The distree the result is based on.
 * @param path The location to check existence, relative to `distree`.
 * @returns Whether the value exists.
 */
const has = <T>(distree: Distree<T>, path: string): boolean => {
	const current = locate(distree)
	const absolute = normalizePath(current + "/" + path)
	const components = absolute.split(/\/+/).slice(1)
	console.log(current, absolute, components)
	return rec(components, distree["/"])
}

export default has