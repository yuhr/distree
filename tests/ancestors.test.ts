// SPDX-License-Identifier: CC0-1.0

import type Distree from "../Distree.ts"
import ancestors from "../ancestors.ts"
import from from "../from.ts"
import { assertEquals } from "@std/assert"

Deno.test("ancestors", async () => {
	const content = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from<string>(content)

	assertEquals([...ancestors(distree["foo"] as Distree<string>)], [content["foo"], content])
	assertEquals(
		[...ancestors(distree["foo/bar"] as Distree<string>)],
		[content["foo"]["bar"], content["foo"], content],
	)
})