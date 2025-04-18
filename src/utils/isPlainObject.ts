// SPDX-License-Identifier: CC0-1.0

/**
 * @private
 * @internal
 */
const isPlainObject = (value: unknown): value is object => {
	if (typeof value === "object" && value !== null) {
		const prototype = Object.getPrototypeOf(value)
		switch (prototype) {
			case Object.prototype:
			case null:
				return true
		}
	}
	return false
}

export { isPlainObject }