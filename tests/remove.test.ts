// SPDX-License-Identifier: CC0-1.0

import { assertEquals } from "@std/assert"
import type Distree from "distree/Distree.ts"
import from from "distree/from.ts"
import remove from "distree/remove.ts"

Deno.test("remove", async () => {
	const init = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from(init)
	assertEquals(
		remove(distree, "foo/bar/baz"),
		from({ foo: { bar: {}, quux: { corge: "grault" } } }),
	)
	assertEquals(
		remove(distree["foo/bar"] as Distree<string>, "baz"),
		from({ foo: { bar: {}, quux: { corge: "grault" } } }),
	)
})