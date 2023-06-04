import Distree, { isEmpty } from "./Distree.ts"
import from from "./from.ts"
import isDistree from "./isDistree.ts"
import locate from "./locate.ts"

const rec = <T>(
	components: string[],
	resolved: Distree<T> | T | undefined,
	parent: Distree<T>,
	value: Distree<T> | T | undefined,
): Distree<T> | T | undefined => {
	if (components.length === 0) return value
	else {
		const [component, ...rest] = components
		const distree = isDistree(resolved) ? resolved : from<T>({})
		switch (component) {
			case "":
			case ".":
			case "..": {
				const tmp = rec(rest, distree[component], parent, value) as Distree<T>
				const ancestor = from<T>(tmp)
				const relative = locate(distree, distree[component] as Distree<T>)
				const self = ancestor[relative]
				return self
			}
			default: {
				const tmp = rec(rest, distree[component!], parent, value)
				if (isEmpty(tmp)) {
					const content = { ...distree }
					delete content[component!]
					return from<T>(content)
				} else {
					const content = { ...distree, [component!]: tmp }
					return from<T>(content)
				}
			}
		}
	}
}

/**
 * Replaces the specified property value by a new value. It does not modify the passed distree, and instead returns a new distree with the updated property. The property will be removed if:
 *
 * 1. The value is `undefined`
 * 2. The value is a plain object or array and it has no enumerable own string keys.
 *
 * @param distree The distree the result based on.
 * @param path The location the new value is placed at.
 * @param value The new value .
 */
const replace =
	<T>(distree: Distree<T>) =>
	([path, value]: [string, Distree<T> | T | undefined]): Distree<T> => {
		const components = path.split("/")
		return rec(components, distree, distree, value) as Distree<T>
	}

export default replace