// SPDX-License-Identifier: CC0-1.0

import type Distree from "../Distree.ts"
import from from "../from.ts"
import remove from "../remove.ts"
import { assertEquals } from "@std/assert"

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