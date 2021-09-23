import Distree from "./Distree.ts"
import isDistree from "./isDistree.ts"

const resolve =
  <T>(distree: Distree<T>) =>
  (path: string): Distree<T> | T | undefined => {
    const components = path.split("/")
    let resolved: Distree<T> | T | undefined = distree
    for (const component of components)
      if (isDistree(resolved)) resolved = resolved[component]
      else return undefined
    return resolved
  }

export default resolve