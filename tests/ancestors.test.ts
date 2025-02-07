// SPDX-License-Identifier: CC0-1.0

import { assertEquals } from "@std/assert"
import type Distree from "distree/Distree.ts"
import ancestors from "distree/ancestors.ts"
import from from "distree/from.ts"

Deno.test("ancestors", async () => {
	const content = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from<string>(content)

	assertEquals([...ancestors(distree["foo"] as Distree<string>)], [content["foo"], content])
	assertEquals(
		[...ancestors(distree["foo/bar"] as Distree<string>)],
		[content["foo"]["bar"], content["foo"], content],
	)
})