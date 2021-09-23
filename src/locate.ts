import ancestors from "./ancestors.ts"
import Distree from "./Distree.ts"

/**
 * Locates the path where the distree is placed at in the entire distree. If `from` is provided, it returns the relative path from the `from` distree. Otherwise it returns the absolute path from the root.
 * @param distree The distree to locate its path.
 * @param from The distree to calculate the relative path from.
 */
const locate: {
  <T>(distree: Distree<T>): string
  <T>(distree: Distree<T>, from: Distree<T>): string
} = <T>(distree: Distree<T>, from?: Distree<T>) => {
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
  if (from === undefined) return absolute
  else {
    const absoluteOfFrom = locate(from)
    if (absolute === absoluteOfFrom) return "."
    const componentsOfSelf =
      absolute === "/" ? [] : absolute.slice(1).split("/")
    const componentsOfFrom =
      absoluteOfFrom === "/" ? [] : absoluteOfFrom.slice(1).split("/")
    while (componentsOfSelf[0] === componentsOfFrom[0]) {
      componentsOfSelf.shift()
      componentsOfFrom.shift()
    }
    componentsOfFrom.fill("..")
    const components = [...componentsOfFrom, ...componentsOfSelf]
    const relative = components.join("/")
    return relative
  }
}

export default locate