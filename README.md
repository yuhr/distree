<!--
SPDX-License-Identifier: CC0-1.0
-->

<div align="center"><br><br>

# DISTREE

[![License](https://img.shields.io/github/license/yuhr/distree?color=%231e2327)](LICENSE)

Directory structure trees upon plain objects.

<br><br></div>

`distree` provides a convenient access to deep properties in plain objects, using POSIX path representation. It is similar to JSON Pointer, but quite naïver and less complicated implementation.

- Zero external dependencies (except `fromDirectory` whose default filesystem access implementation depends on `lstat`, `readdir`, and `realpath` from `node:fs/promises` which is supported also on Deno and Bun nowadays)
- Full immutability (every (sub-)distree is `Object.freeze`'d; any single “update” operation to a (sub-)distree returns an entire new distree up to the root)

## Usage

```ts
import { assertEquals } from "https://esm.sh/jsr/@std/assert@1.0.11"
import Distree from "https://deno.land/x/distree/index.ts"

const init = { foo: { bar: { baz: "qux" } } }
const distree = Distree.from<string>(init)

assertEquals(distree["/"], distree)
assertEquals(distree["."], distree)
assertEquals(distree[".."], distree)

const path = "/foo/bar/baz"
assertEquals(distree[path], "qux")
assertEquals(Distree.insert(distree, [path, "quux"])[path], "quux")
```

## Semver Policy

Only the items accessible from the default exports of published modules are meant to be public APIs and remain stable throughout minor version bumps. Named exports should be considered private and unstable. Any single release may randomly contain breaking changes to named exports, so users should avoid using them where possible.