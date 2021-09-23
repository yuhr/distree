import from from "../src/from.ts"
import replace from "../src/replace.ts"

Deno.test("replace", async () => {
  const { assertEquals } = await import("std/testing/asserts.ts")
  const assertSeparateButSameShape = (a: unknown) => (b: unknown) => {
    assertEquals(a === b, false)
    assertEquals(a, b)
  }

  const original = { foo: { bar: { baz: "qux" }, quux: { corge: "grault" } } }
  const updated = { foo: { bar: { baz: "quux" }, quux: { corge: "grault" } } }
  const fstreeOriginal = from<string>(original)
  const fstreeUpdated = from<string>(updated)
  const assertOriginal = assertSeparateButSameShape(fstreeOriginal)
  const assertUpdated = assertSeparateButSameShape(fstreeUpdated)
  const assert = (path: string) => {
    assertOriginal(replace(fstreeOriginal)([path, "qux"]))
    assertUpdated(replace(fstreeOriginal)([path, "quux"]))
  }
  assert("foo/bar/baz")
  assert("/foo/bar/baz")
  assert("./foo/bar/baz")
  assert("/foo/./bar/baz")
  assert("/foo/./../foo/bar/../bar/baz")
  assert("/foo/./../foo/bar//foo/bar/baz")

  // @ts-expect-error
  assertEquals(replace(fstreeOriginal)(["test", true]), {
    ...original,
    test: true,
  })
  assertEquals(replace(fstreeOriginal)(["foo", undefined]), {})
})

Deno.test("prevent prototype pollution", async () => {
  const { assertEquals, assertNotEquals } = await import(
    "std/testing/asserts.ts"
  )

  const init = {
    __proto__: { isAdmin: 1 },
    constructor: { prototype: { isAdmin: 1 } },
    prototype: { isAdmin: 1 },
  }

  let distree = from(init)
  distree = replace(distree)(["__proto__/isAdmin", 1])
  distree = replace(distree)(["constructor/prototype/isAdmin", 1])
  distree = replace(distree)(["prototype/isAdmin", 1])

  // @ts-expect-error
  assertNotEquals({}.isAdmin, 1)
})