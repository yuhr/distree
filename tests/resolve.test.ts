import Distree from "../src/Distree.ts"
import from from "../src/from.ts"
import isDistree from "../src/isDistree.ts"

Deno.test("resolve", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")

	const init = { foo: { bar: { baz: "qux" } } }
	const distree = from<string>(init)
	assertEquals(distree["/"], distree)
	assertEquals(distree[""], distree)
	assertEquals(distree["."], distree)
	assertEquals(distree[".."], distree)

	const foo = distree["foo"] as Distree<string>
	assertEquals(isDistree(foo), true)
	assertEquals(foo["/"], distree)
	assertEquals(foo[""], foo)
	assertEquals(foo["."], foo)
	assertEquals(foo[".."], distree)
	assertEquals(foo["../.."], distree)

	const bar = distree["foo/bar"] as Distree<string>
	assertEquals(isDistree(bar), true)
	assertEquals(bar["/"], distree)
	assertEquals(bar[""], bar)
	assertEquals(bar["."], bar)
	assertEquals(bar[".."], foo)
	assertEquals(bar["../.."], distree)

	assertEquals(distree["foo/bar/baz"], "qux")
	assertEquals(distree["/foo/bar/baz"], "qux")
	assertEquals(distree["/foo/./../foo/bar///baz"], "qux")
})