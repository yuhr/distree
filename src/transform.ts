import Distree from "./Distree.ts"
import replace from "./replace.ts"

const transform = <T>(
	distree: Distree<T>,
	transformer: (oldValue: T, path: string) => Distree<T> | T | undefined,
) => {
	return [...distree].reduce((distree, [path, oldValue]) => {
		const newValue = transformer(oldValue, path)
		return oldValue !== newValue ? replace<T>(distree)([path, newValue]) : distree
	}, distree)
}

export default transform