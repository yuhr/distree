// SPDX-License-Identifier: CC0-1.0

import fromDirectory from "../fromDirectory.ts"
import transform from "../transform.ts"
import { assertExists, assertEquals, assertFalse } from "std/testing/asserts.ts"

Deno.test("fromDirectory", async () => {
	const distree = await fromDirectory("..", /Distree/)
	assertExists(distree["isDistree.ts"])
	assertExists(distree["Distree.ts"])
	assertFalse(distree["from.ts"])
})

Deno.test("prevent prototype pollution", async () => {
	const distree = transform(await fromDirectory("fromDirectory"), () => ({ polluted: true }))

	assertEquals(
		Deno.inspect(distree),
		`{\n  ['__proto__']: { polluted: true },\n  "Hello, World!": { polluted: true },\n  constructor: { prototype: { polluted: true } }\n}`,
	)

	// @ts-expect-error: testing the prototype
	assertEquals({}.polluted, undefined)
})