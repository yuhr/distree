// SPDX-License-Identifier: MPL-2.0

import type Distree from "./Distree.ts"
import from from "./from.ts"
import transform from "./transform.ts"
import transformAsync from "./transformAsync.ts"

const rec = async (path: string): Promise<typeof content> => {
	const { lstat } = await import("https://esm.sh/jsr/@cross/fs@0.1.11/stat")
	const { readdir } = await import("https://esm.sh/jsr/@cross/fs@0.1.11/ops")
	const { resolve } = await import("https://esm.sh/jsr/@std/path@1.0.8/resolve")
	const content: { [key: string]: typeof content | string } = Object.create(null)
	for (const pathItemRelative of await readdir(path)) {
		const pathItem = resolve(path, pathItemRelative)
		const item = await lstat(pathItem, {})
		if (item.isFile()) {
			const [key, value] = [pathItemRelative, pathItem]
			content[key] = value
		} else if (item.isDirectory()) {
			const [key, value] = [pathItemRelative, await rec(pathItem)]
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