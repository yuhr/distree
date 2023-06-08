import Distree from "../src/Distree.ts"
import from from "../src/from.ts"
import remove from "../src/remove.ts"

Deno.test("remove", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")
	const init = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
	const distree = from(init)
	assertEquals(
		remove(distree, "foo/bar/baz"),
		from({
			foo: { bar: {}, quux: { corge: "grault" } },
		}),
	)
	assertEquals(
		remove(distree["foo/bar"] as Distree<string>, "baz"),
		from({
			foo: { bar: {}, quux: { corge: "grault" } },
		}),
	)
})