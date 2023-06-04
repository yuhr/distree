import from from "../src/from.ts"

Deno.test("from", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")

	const init = {
		foo: { bar: { baz: "qux" } },
	}

	const distree = from<string>(init)
	assertEquals(distree["."], distree[".."])
	assertEquals(distree[""], distree["."])
	assertEquals(distree[".."], distree[""])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	assertEquals((distree as any)["foo"][""], distree)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	assertEquals((distree as any)["foo"]["bar"][""], distree)
})

Deno.test("prevent prototype pollution", async () => {
	const { assertEquals, assertNotEquals } = await import("std/testing/asserts.ts")

	const init = {
		__proto__: { isAdmin: 1 },
		constructor: { prototype: { isAdmin: 1 } },
		prototype: { isAdmin: 1 },
	}

	const distree = from(init)

	// @ts-expect-error: testing the prototype
	assertNotEquals({}.isAdmin, 1)
})