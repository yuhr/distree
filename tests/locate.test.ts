import Distree from "../src/Distree.ts"
import from from "../src/from.ts"
import locate from "../src/locate.ts"

Deno.test("locate", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")

	const content = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from<string>(content)

	assertEquals(locate(distree), "/")
	assertEquals(locate(distree["foo"] as Distree<string>), "/foo")
})