// SPDX-License-Identifier: CC0-1.0

import type Distree from "../Distree.ts"
import from from "../from.ts"
import locate from "../locate.ts"

Deno.test("locate", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")

	const content = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from<string>(content)

	assertEquals(locate(distree), "/")
	assertEquals(locate(distree["foo"] as Distree<string>), "/foo")
})