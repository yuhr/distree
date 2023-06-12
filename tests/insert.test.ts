import { isDistree } from "../src/Distree.ts"
import from from "../src/from.ts"
import insert from "../src/insert.ts"

Deno.test("insert", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")
	const assertSeparateButSameShape = (a: unknown) => (b: unknown) => {
		assertEquals(a === b, false)
		assertEquals(a, b)
	}

	const original = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const updated = { foo: { bar: { baz: "quux" }, quux: { corge: "grault" } } }
	const distreeOriginal = from<string>(original)
	const distreeUpdated = from<string>(updated)
	const assertOriginal = assertSeparateButSameShape(distreeOriginal)
	const assertUpdated = assertSeparateButSameShape(distreeUpdated)
	const assert = (path: string) => {
		assertOriginal(insert(distreeOriginal, [path, "qux"]))
		assertUpdated(insert(distreeOriginal, [path, "quux"]))
	}
	assert("foo/bar/baz")
	assert("/foo/bar/baz")
	assert("./foo/bar/baz")
	assert("/foo/./bar/baz")
	assert("/foo/./../foo/bar/../bar/baz")
	assert("/foo/./../foo/bar/baz")

	assertEquals(insert(distreeOriginal, ["test", "hello"]), {
		...distreeOriginal,
		test: "hello",
	})
	assertEquals(insert(distreeOriginal, ["foo", undefined]), from({ foo: undefined }))
	assertEquals(
		insert(distreeOriginal, ["foo/bar/baz", undefined]),
		from<string | undefined>({ foo: { bar: { baz: undefined }, quux: { corge: "grault" } } }),
	)
	assertEquals(
		insert(distreeOriginal, ["foo/bar/baz/..", undefined]),
		from<string | undefined>({ foo: { bar: undefined, quux: { corge: "grault" } } }),
	)

	assertEquals(
		true,
		isDistree(insert(distreeOriginal, ["foo/bar/baz", { qux: "quux" }])["foo/bar/baz"]),
	)
})

Deno.test("prevent prototype pollution", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")

	let distree = from({})
	distree = insert(distree, ["__proto__", Object.prototype])
	distree = insert(distree, ["constructor/prototype", Object.prototype])

	distree = insert(distree, ["__proto__/polluted", 0])
	assertEquals(distree["__proto__/polluted"], 0)
	assertEquals(distree["polluted"], undefined)
	distree = insert(distree, ["constructor/prototype/polluted", 1])
	assertEquals(distree["constructor/prototype/polluted"], 1)
	assertEquals(distree["polluted"], undefined)

	assertEquals(
		Deno.inspect(distree),
		`{\n  ['__proto__']: { polluted: 0 },\n  constructor: { prototype: { polluted: 1 } }\n}`,
	)

	// @ts-expect-error: testing the prototype
	assertEquals({}.polluted, undefined)
})