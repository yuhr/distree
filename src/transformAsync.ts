import Distree from "./Distree.ts"
import from from "./from.ts"
import insert from "./insert.ts"

/**
 * Transforms the values of the given distree. It does not modify the passed distree, and instead returns a new distree with the transformed values.
 *
 * If `transformer` rejects with `undefined`, the value will be filtered out from the result.
 *
 * @param distree The distree the result based on.
 * @param transformer The function that transforms the values.
 * @returns A new distree with the transformed values.
 */
const transformAsync = async <T, U>(
	distree: Distree<T>,
	transformer: (value: T, path: string) => Promise<Distree.ItemInitializer<U>>,
): Promise<Distree<U>> => {
	return (
		await Promise.all(
			[...distree].map(async ([path, value]) => {
				try {
					return [[path, await transformer(value, path)] as const]
				} catch (error) {
					if (error === undefined) return []
					else throw error
				}
			}),
		)
	)
		.flat()
		.reduce(insert, from({}))
}

export default transformAsync