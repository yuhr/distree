import from from "../src/from.ts"
import isDistree from "../src/isDistree.ts"
import replace from "../src/replace.ts"

Deno.test("resolve", async () => {
  const { assertEquals } = await import("std/testing/asserts.ts")

  const init = { foo: { bar: { baz: "qux" } } }
  const distree = from<string>(init)
  assertEquals(distree["/"], distree)
  assertEquals(distree["."], distree)
  assertEquals(distree[".."], distree)

  const foo = (distree as any)["foo"]
  assertEquals(isDistree(foo), true)
  assertEquals(foo["."], foo)

  const path = "/foo/./../foo/bar//foo/bar/baz"
  assertEquals(distree[path], "qux")
  assertEquals(replace(distree)([path, "quux"])[path], "quux")
})