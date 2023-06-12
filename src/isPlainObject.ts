/**
 * @private
 */
const isPlainObject = (value: unknown): value is object => {
	return (
		typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype
	)
}

export { isPlainObject }