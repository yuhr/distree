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