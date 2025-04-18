// SPDX-License-Identifier: MPL-2.0

import type Distree from "./Distree.ts"
import from from "./from.ts"
import transform from "./transform.ts"
import transformAsync from "./transformAsync.ts"

namespace fromDirectory {
	export type Ls = (url: URL) => AsyncIterable<LsEntry>
	export type LsEntry = {
		type: "file" | "directory"
		name: string
		url: URL
	}
}

type Directory = { [entry: string]: Directory | URL }

const enumerateFilesRecursively = async (
	url: URL,
	ls: fromDirectory.Ls,
	memo: Map<string, Directory> = new Map(),
): Promise<Directory> => {
	const existing = memo.get(url.href)
	if (existing) return existing
	const directory: Directory = Object.create(null)
	memo.set(url.href, directory)
	for await (const entry of ls(url)) {
		console.log(`Processing ${entry.type} ${entry.url.href}`)
		switch (entry.type) {
			case "file":
				{
					directory[entry.name] = entry.url
				}
				break
			case "directory":
				{
					const existing = memo.get(entry.url.href)
					if (existing) directory[entry.name] = existing
					else {
						const subdirectory = await enumerateFilesRecursively(entry.url, ls, memo)
						directory[entry.name] = subdirectory
						memo.set(entry.url.href, subdirectory)
					}
				}
				break
		}
	}
	return directory
}

const lsDefault: fromDirectory.Ls = async function* (url) {
	const { lstat, readdir, realpath } = await import("node:fs/promises")
	for await (const name of await readdir(url)) {
		let urlEntry = new URL(`${url.href}/${name}`)
		let entry = await lstat(urlEntry)
		while (entry.isSymbolicLink()) {
			urlEntry = new URL(await realpath(urlEntry), urlEntry)
			entry = await lstat(urlEntry)
		}
		const type = entry.isFile() ? "file" : entry.isDirectory() ? "directory" : undefined
		if (!type) throw new Error(`Unknown entry type of \`${urlEntry.href}\``)
		yield { url: urlEntry, type, name }
	}
}

const fromDirectory = async <T = URL>(
	url: URL,
	options: {
		filter?: string | RegExp | undefined
		transformer?:
			| ((
					value: URL,
					path: string,
			  ) => Promise<Distree.ItemInitializer<T>> | Distree.ItemInitializer<T>)
			| undefined
		ls?: fromDirectory.Ls | undefined
	} = {},
): Promise<Distree<T>> => {
	const { filter, transformer, ls } = options
	const directory: Distree.Initializer<URL> = await enumerateFilesRecursively(url, ls ?? lsDefault)
	const distreeRaw = from(directory)
	const distreeFiltered = filter
		? transform(distreeRaw, value => {
				if (value.href.match(filter)) return value
				else throw undefined
			})
		: distreeRaw
	const distreeTransformed = transformer
		? await transformAsync(distreeFiltered, transformer)
		: distreeFiltered
	return distreeTransformed as Distree<T>
}

export default fromDirectory