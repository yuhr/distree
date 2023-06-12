import Distree from "./Distree.ts"
import from from "./from.ts"
import transform from "./transform.ts"
import transformAsync from "./transformAsync.ts"

const rec = async (path: string): Promise<typeof content> => {
	const content: { [key: string]: typeof content | string } = Object.create(null)
	for await (const item of Deno.readDir(path)) {
		const pathItem = path + "/" + item.name
		if (item.isDirectory) {
			const [key, value] = [item.name, await rec(pathItem)]
			content[key] = value
		} else if (item.isFile) {
			const [key, value] = [item.name, pathItem]
			content[key] = value
		} else {
			// TODO: handle symlinks (breaking change)
		}
	}

	Object.setPrototypeOf(content, Object.prototype)
	return content
}

const fromDirectory: {
	(path: string): Promise<Distree<string>>
	(path: string, filter: string | RegExp): Promise<Distree<string>>
	<T>(
		path: string,
		transform: (value: string, path: string) => Promise<Distree.ItemInitializer<T>>,
	): Promise<Distree<T>>
} = async <
	T,
	F extends
		| string
		| RegExp
		| undefined
		| ((value: string, path: string) => Promise<Distree.ItemInitializer<T>>),
>(
	path: string,
	filter?: F,
): Promise<Distree<F extends string | RegExp | undefined ? string : T>> => {
	const distree = from(await rec(path)) as Distree<string>
	return (
		filter === undefined
			? distree
			: typeof filter === "function"
			? await transformAsync(distree, filter)
			: transform(distree, value => {
					if (value.match(filter)) return value
					else throw undefined
			  })
	) as Distree<F extends string | RegExp | undefined ? string : T>
}

export default fromDirectory