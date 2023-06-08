import Distree from "../src/Distree.ts"
import from from "../src/from.ts"

Deno.test("from", async () => {
	const { assertThrows, assertEquals } = await import("std/testing/asserts.ts")

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
	const { assertEquals } = await import("std/testing/asserts.ts")

	from({
		constructor: { prototype: { polluted: 1 } },
		prototype: { polluted: 2 },
	})

	// @ts-expect-error: testing the prototype
	assertEquals({}.polluted, undefined)
})

Deno.test("reject non plain objects", async () => {
	const { assertThrows } = await import("std/testing/asserts.ts")
	assertThrows(() => from({ __proto__: { polluted: 0 } }))
	assertThrows(() => from(Object.create(null)))
})