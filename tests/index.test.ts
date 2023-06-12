import Distree from "../src/index.ts"

Deno.test("types", async () => {
	const distree: Distree<string> = Distree.from({ foo: { bar: { baz: "qux" } } })
})