// SPDX-License-Identifier: CC0-1.0

import { assertThrows, assertEquals } from "@std/assert"
import type Distree from "distree/Distree.ts"
import from from "distree/from.ts"

Deno.test("from", async () => {
	const init = { foo: { bar: { baz: "qux" } } }

	const distree = from<string>(init)
	assertEquals(distree["."], distree[".."])
	assertEquals(distree[""], distree["."])
	assertEquals(distree[".."], distree[""])

	assertEquals(distree["foo/"], distree["foo"])
	assertEquals(distree["foo/bar/"], distree["foo/bar"])
	assertEquals((distree["foo/bar/"] as Distree<string>)["/"], distree)

	assertThrows(
		() => from({ "quux/corge": "grault" }),
		"Keys are not allowed to contain slashes: quux/corge",
	)
	assertThrows(() => {
		// @ts-expect-error: testing if it's frozen
		distree["foo"] = "bar"
	})
	assertThrows(() => {
		// @ts-expect-error: testing if it's frozen
		delete distree["foo"]
	})
})

Deno.test("prevent prototype pollution", async () => {
	from({
		constructor: { prototype: { polluted: 1 } },
		prototype: { polluted: 2 },
	})

	// @ts-expect-error: testing the prototype
	assertEquals({}.polluted, undefined)
})

Deno.test("rejects non plain objects", async () => {
	assertThrows(() => from({ __proto__: { polluted: 0 } }))
})

Deno.test("accepts null prototype objects", async () => {
	from(Object.create(null))
})