import from from "../src/from.ts"
import transform from "../src/transform.ts"

Deno.test("transform", async () => {
	const { assertEquals } = await import("std/testing/asserts.ts")

	const init = {
		foo: { bar: { baz: "qux" } },
	}

	const distree = from<string>(init)
	assertEquals(
		transform(distree, value => value),
		distree,
	)

	const transformed = transform(distree, value => "quux")
	assertEquals(transformed["foo/bar/baz"], "quux")
})