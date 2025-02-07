// SPDX-License-Identifier: CC0-1.0

import { assertEquals } from "@std/assert"
import type Distree from "distree/Distree.ts"
import from from "distree/from.ts"
import locate from "distree/locate.ts"

Deno.test("locate", async () => {
	const content = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from<string>(content)

	assertEquals(locate(distree), "/")
	assertEquals(locate(distree["foo"] as Distree<string>), "/foo")
})