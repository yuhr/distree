import { isPlainObject } from "./isPlainObject.ts"
import { normalizePath } from "./normalizePath.ts"

/**
 * A frozen plain object that accepts paths as index reference. It also supports `Symbol.iterator` interface that enumerates nested values.
 */
type Distree<T> = {
	readonly "/": Distree<T>
	readonly ".": Distree<T>
	readonly "..": Distree<T>
	readonly [key: string]: Distree<T> | T
	readonly [Symbol.iterator]: () => Iterator<[string, T]>
}

namespace Distree {
	export type Initializer<T> = Distree<T> | { readonly [key: string]: Initializer<T> | T }
	export type ItemInitializer<T> = Distree<T> | T | { readonly [key: string]: ItemInitializer<T> }
}

type DistreeInternal<T> = {
	"/": DistreeInternal<T>
	".": DistreeInternal<T>
	"..": DistreeInternal<T>
	[key: string]: DistreeInternal<T> | T
	[Symbol.iterator]: () => Iterator<[string, T]>
	[symbol]: Metadata<T>
}

namespace DistreeInternal {
	export type Initializer<T> = DistreeInternal<T> | { [key: string]: Initializer<T> | T }
	export type ItemInitializer<T> = DistreeInternal<T> | T | { [key: string]: ItemInitializer<T> }
}

type Metadata<T> = { root: DistreeInternal<T> }

const symbol: unique symbol = Symbol()

/**
 * Tests if a value is a distree.
 *
 * @param value The value to be tested.
 */
const isDistree = <T>(value: unknown): value is Distree<T> => {
	return isPlainObject(value) && Object.hasOwn(value, symbol)
}

const readonly = {
	configurable: false,
	enumerable: false,
	writable: false,
} as const satisfies PropertyDescriptor

const resolve = <T>(
	distree: DistreeInternal<T>,
	path: string,
): DistreeInternal<T> | T | undefined => {
	if (path === "/") return distree[symbol].root
	const components = normalizePath(path).split(/\/+/)
	let resolved: DistreeInternal<T> | T | undefined = distree
	for (const component of components) {
		if (isDistree(resolved)) {
			if (component === "") {
				resolved = resolved[symbol].root
			} else if (Object.hasOwn(resolved, component)) {
				resolved = resolved[component]
			} else return undefined
		} else return undefined
	}
	return resolved
}

const iterate = function* <T>(
	distree: DistreeInternal<T>,
	prefix: string | undefined,
): Generator<[string, T]> {
	for (const [key, value] of Object.entries(distree)) {
		const path = prefix === undefined ? key : prefix + "/" + key
		if (isDistree(value)) yield* iterate(value, path)
		else yield [path, value]
	}
}

const rec = <T>(
	content: DistreeInternal.Initializer<T>,
	parent: DistreeInternal<T> | undefined,
): DistreeInternal<T> => {
	const distree = new Proxy<DistreeInternal<T>>(Object.create(null) as DistreeInternal<T>, {
		get: (target, key, receiver) => {
			if (typeof key === "string") return resolve(target, key)
			else return Reflect.get(target, key, receiver)
		},
	})

	// Populate as a distree
	Object.defineProperties(distree, {
		[symbol]: { ...readonly, value: { root: parent?.[symbol].root ?? distree } },
		".": { ...readonly, value: distree },
		"..": { ...readonly, value: parent ?? distree },
		[Symbol.iterator]: {
			...readonly,
			*value() {
				yield* iterate(distree, undefined)
			},
		},
	})

	// Copy contents into the new distree
	for (const [key, value] of Object.entries(content)) {
		if (key.search(/\/+/) !== -1) throw new Error(`Keys are not allowed to contain slashes: ${key}`)
		if (isPlainObject(value)) distree[key] = rec(value, distree)
		else distree[key] = value
	}

	Object.setPrototypeOf(distree, Object.prototype)
	Object.freeze(distree)

	return distree
}

/**
 * Creates a distree from the provided content. It doesn't modify the passed object.
 *
 * @param content The initial content of the distree. Only enumerable own string keys are respected, and nested plain objects are recursively converted to distrees.
 * @returns A new distree.
 */
const from = <T>(content: Distree.Initializer<T>): Distree<T> => {
	if (isPlainObject(content)) return rec(content as DistreeInternal<T>, undefined)
	else throw new Error("Provided content is not a plain object.")
}

export default Distree
export { isDistree, from }