// SPDX-License-Identifier: CC0-1.0

import { assertEquals } from "@std/assert"
import from from "distree/from.ts"

Deno.test("iterator", async () => {
	const content = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from<string>(content)

	assertEquals(
		[...distree],
		[
			["foo/bar/baz", "qux"],
			["foo/quux/corge", "grault"],
		],
	)

	assertEquals(Object.keys(distree), ["foo"])
})