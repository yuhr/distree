import from from "../src/from.ts"

Deno.test("iterator", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")

	const content = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from<string>(content)

	assertEquals(
		[...distree],
		[
			["foo/bar/baz", "qux"],
			["foo/quux/corge", "grault"],
		],
	)

	assertEquals(Object.keys(distree), ["foo"])
})