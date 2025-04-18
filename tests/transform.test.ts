// SPDX-License-Identifier: CC0-1.0

import { assertEquals } from "@std/assert"
import from from "distree/from.ts"
import transform from "distree/transform.ts"

Deno.test("transform", async () => {
	const init = { foo: { bar: { baz: "qux" } } }

	const distree = from<string>(init)
	assertEquals(
		transform(distree, value => value),
		distree,
	)

	const transformed = transform(distree, value => "quux")
	assertEquals(transformed["foo/bar/baz"], "quux")
})

Deno.test("prevent prototype pollution", async () => {
	const distree = transform(
		from({
			["__proto__"]: undefined,
			"Hello, World!": undefined,
			constructor: { prototype: undefined },
		}),
		() => ({
			polluted: true,
		}),
	)

	assertEquals(
		Deno.inspect(distree),
		`{\n  ['__proto__']: { polluted: true },\n  "Hello, World!": { polluted: true },\n  constructor: { prototype: { polluted: true } }\n}`,
	)

	// @ts-expect-error: testing the prototype
	assertEquals({}.polluted, undefined)
})