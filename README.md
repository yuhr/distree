<div align="center"><br><br>

# DISTREE

[![License](https://img.shields.io/github/license/yuhr/distree?color=%231e2327)](LICENSE)

Directory structure trees upon plain objects.

<br><br></div>

`distree` provides a convenient access to deep properties in plain objects, using POSIX path representation. It is similar to JSON Pointer, but quite naïver and less complicated implementation.

It's bundled with [`dnt`](https://github.com/denoland/dnt), so it should work in browsers, Deno and Node.js.

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
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import Distree from "https://deno.land/x/distree/index.ts"

const init = { foo: { bar: { baz: "qux" } } }
const distree = Distree.from<string>(init)

assertEquals(distree["/"], distree)
assertEquals(distree["."], distree)
assertEquals(distree[".."], distree)

const path = "/foo/bar/baz"
assertEquals(distree[path], "qux")
assertEquals(Distree.insert(distree)([path, "quux"])[path], "quux")
```

## Semver Policy

Only the default exports are public APIs and remain stable throughout minor version bumps. Named exports should be considered private and unstable. Any single release may randomly contain breaking changes to named exports, so users should avoid using them where possible.