/**
 * @private
 */
const normalizePath = (path: string) => {
	const pathSlashesCollapsed = path.replaceAll(/\/+/g, "/")
	const isAbsolute = pathSlashesCollapsed.startsWith("/")
	const components = pathSlashesCollapsed.replace(/^\/?(.*?)\/?$/, "$1").split("/")
	const stack: string[] = []
	for (const component of components) {
		switch (component) {
			case ".":
				break
			case "..":
				if (stack.length === 0 || stack[stack.length - 1] === "..") stack.push("..")
				else stack.pop()
				break
			default:
				stack.push(component)
				break
		}
	}
	const normalized = isAbsolute
		? ("/" + stack.join("/")).replace(/^(\/\.\.)+\/?/, "/")
		: stack.join("/")
	if (normalized === "/") return "/"
	else if (normalized === "") return "."
	else return normalized.replace(/\/+$/, "")
}

export { normalizePath }