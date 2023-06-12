import fromDirectory from "../src/fromDirectory.ts"
import transform from "../src/transform.ts"
import { assertExists, assertEquals, assertFalse } from "std/testing/asserts.ts"

Deno.test("fromDirectory", async () => {
	const distree = await fromDirectory("src", /Distree/)
	assertExists(distree["isDistree.ts"])
	assertExists(distree["Distree.ts"])
	assertFalse(distree["from.ts"])
})

Deno.test("prevent prototype pollution", async () => {
	const distree = transform(await fromDirectory("tests/fromDirectory"), () => ({ polluted: true }))

	assertEquals(
		Deno.inspect(distree),
		`{\n  ['__proto__']: { polluted: true },\n  "Hello, World!": { polluted: true },\n  constructor: { prototype: { polluted: true } }\n}`,
	)

	// @ts-expect-error: testing the prototype
	assertEquals({}.polluted, undefined)
})