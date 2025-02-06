// SPDX-License-Identifier: CC0-1.0

import { normalizePath } from "../../utils/normalizePath.ts"
import { assertEquals } from "@std/assert"

Deno.test("normalizePath", async () => {
	const assert = (a: string, b: string) => assertEquals(normalizePath(a), b)
	assert("/foo/bar/baz", "/foo/bar/baz")
	assert("./../hello", "../hello")
	assert("hello/../hello", "hello")
	assert("/", "/")
	assert("", ".")
	assert("hello/../hello/.", "hello")
	assert("hello/../world/.", "world")
	assert("../../hello/../..", "../../..")
	assert("../../.././././", "../../..")
	assert("/../../.././././", "/")
	assert("/../../../foo/bar/baz/", "/foo/bar/baz")
	assert("/../../../foo/bar/baz/../../", "/foo")
	assert("/foo/./../foo/bar///baz", "/foo/bar/baz")
})