// SPDX-License-Identifier: CC0-1.0

/**
 * @private
 * @internal
 */
const isPlainObject = (value: unknown): value is object => {
	return (
		typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype
	)
}

export { isPlainObject }