// SPDX-License-Identifier: CC0-1.0

import Distree from "../index.ts"

Deno.test("types", async () => {
	const distree: Distree<string> = Distree.from({ foo: { bar: { baz: "qux" } } })
})