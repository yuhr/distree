import Distree from "./Distree.ts"
import ancestors from "./ancestors.ts"
import { normalizePath } from "./normalizePath.ts"

/**
 * Locates the path where the distree is placed at in the entire distree.
 *
 * @param distree The distree to locate its path.
 * @returns The path where the distree is placed at.
 */
const locate = <T>(distree: Distree<T>): string => {
	const components: string[] = []
	for (const ancestor of ancestors(distree)) {
		const parent = ancestor[".."] as Distree<T>
		if (parent === ancestor) {
			components.unshift("")
			break
		} else {
			for (const [key, value] of Object.entries(parent)) {
				if (value === ancestor) {
					components.unshift(key)
					break
				} else continue
			}
		}
	}
	const absolute = components.length === 1 ? "/" : components.join("/")
	return normalizePath(absolute)
}

export default locate