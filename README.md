<div align="center"><br><br>

# DISTREE

[![GitHub](https://img.shields.io/github/license/yuhr/distree?color=%231e2327)](LICENSE)

Directory structure trees upon plain objects.

<br><br></div>

`distree` provides a convenient access to deep properties in plain objects based on POSIX path representation. It is similar to JSON Pointer, but quite naïver and less complicated implementation.

It does not depend on any other packages nor platform-specific JavaScript features, so it should work in browsers, Deno and Node.js.

## Installation

For Deno, pick your favorite registry from the following:

- `import Distree from "https://nest.land/package/distree/index.ts"`
- `import Distree from "https://deno.land/x/distree/index.ts"`
- `import Distree from "https://esm.sh/distree"`

For Node.js, just install `distree` from the npm registry:

- `npm install distree`
- `pnpm add distree`
- `yarn add distree`

## Usage

```ts
const { assertEquals } = await import("https://deno.land/std/testing/asserts.ts")

const init = { foo: { bar: { baz: "qux" } } }
const distree = from<string>(init)

assertEquals(distree["/"], distree)
assertEquals(distree["."], distree)
assertEquals(distree[".."], distree)

const path = "/foo/./../foo/bar//foo/bar/baz"
assertEquals(distree[path], "qux")
assertEquals(replace(distree)([path, "quux"])[path], "quux")
```