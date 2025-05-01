import { assertEquals } from "@std/assert"
import from from "distree/from.ts"
import has from "distree/has.ts"

Deno.test("has", async () => {
	const distree = from({ foo: { bar: { baz: "qux" } } })
	assertEquals(has(distree, "foo/bar/baz"), true)
	assertEquals(has(distree, "foo/bar/quux"), false)
	assertEquals(has(distree, "foo/bar/qux"), false)
	assertEquals(has(distree, "foo/bar/"), true)
	assertEquals(has(distree, "foo/"), true)
	assertEquals(has(distree, "foo"), true)
	assertEquals(has(distree, ""), true)
	assertEquals(has(distree, "."), true)
	assertEquals(has(distree, ".."), true)
	assertEquals(has(distree, "/"), true)
})