// SPDX-License-Identifier: MPL-2.0

/* eslint-disable consistent-default-export-name/default-export-match-filename */

import type _Distree from "./Distree.ts"
import _ancestors from "./ancestors.ts"
import _from from "./from.ts"
import _fromDirectory from "./fromDirectory.ts"
import _has from "./has.ts"
import _insert from "./insert.ts"
import _isDistree from "./isDistree.ts"
import _locate from "./locate.ts"
import _remove from "./remove.ts"
import _transform from "./transform.ts"
import _transformAsync from "./transformAsync.ts"

namespace Distree {
	export const ancestors = _ancestors
	export const from = _from
	export const fromDirectory = _fromDirectory
	export const has = _has
	export const insert = _insert
	export const isDistree = _isDistree
	export const locate = _locate
	export const remove = _remove
	export const transform = _transform
	export const transformAsync = _transformAsync
}

type Distree<T> = _Distree<T>

export default Distree