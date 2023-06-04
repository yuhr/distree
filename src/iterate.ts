import Distree from "./Distree.ts"
import isDistree from "./isDistree.ts"

const iterate = function* <T>(
	distree: Distree<T>,
	prefix?: string | undefined,
): Generator<[string, T]> {
	for (const [key, value] of Object.entries(distree)) {
		const path = prefix === undefined ? key : prefix + "/" + key
		if (value) {
			if (isDistree(value)) yield* iterate(value, path)
			else yield [path, value]
		}
	}
}

export default iterate