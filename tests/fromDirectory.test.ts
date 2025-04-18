// SPDX-License-Identifier: CC0-1.0

import { assertExists, assertEquals, assertFalse } from "@std/assert"
import fromDirectory from "distree/fromDirectory.ts"

Deno.test("fromDirectory", async () => {
	const distree = await fromDirectory(new URL(import.meta.resolve("../src")), {
		filter: /Distree/,
	})
	assertExists(distree["isDistree.ts"])
	assertExists(distree["Distree.ts"])
	assertFalse(distree["from.ts"])
})

Deno.test("handles recursive symbolic links", async () => {
	const distree = await fromDirectory(new URL(import.meta.resolve("./fromDirectory")))
	assertEquals(
		distree["linkToParent/fromDirectory/linkToCurrent/__proto__"]?.href,
		import.meta.resolve("./fromDirectory/__proto__"),
	)
})