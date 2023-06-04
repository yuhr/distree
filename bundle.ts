import { expandGlob } from "https://deno.land/std@0.108.0/fs/mod.ts"
import { fromFileUrl, relative, join, posix } from "https://deno.land/std@0.108.0/path/mod.ts"
import {
	rollup,
	RollupOptions,
	OutputOptions,
} from "https://deno.land/x/drollup@2.58.0+0.20.0/mod.ts"
import esquery from "https://esm.sh/esquery"
import { parse, print } from "https://x.nest.land/swc@0.1.4/mod.ts"

const pkg = await Deno.readTextFile("package.json").then(JSON.parse)
const { exports } = pkg
const cwd = Deno.cwd()

const sources = new Set<string>()
for (const variations of Object.values(exports) as {
	[key: string]: string
}[]) {
	const { source } = variations
	for await (const item of expandGlob(source))
		if (item.isFile) sources.add(posix.relative(cwd, item.path))
}

const outputs: OutputOptions[] = []
const defaults: OutputOptions = {
	sourcemap: true,
	exports: "named",
	dir: "dist",
}

outputs.push({ ...defaults, format: "cjs", entryFileNames: "[name].cjs" })
outputs.push({ ...defaults, format: "esm", entryFileNames: "[name].mjs" })

const options: RollupOptions = { input: [...sources], output: outputs }
const bundle = await rollup(options)
await Promise.all(outputs.map(bundle.write))
await bundle.close()

// Generate typings
const tsconfig = await Deno.readTextFile("tsconfig.json").then(JSON.parse)
const { files } = await Deno.emit("src/index.ts", {
	compilerOptions: tsconfig.compilerOptions,
})
console.log(files)
const typings = Object.fromEntries(
	Object.entries(files).filter(([key, value]) => key.endsWith(".d.ts")),
)

for (const url in typings) {
	const path = relative(join(cwd, "src"), fromFileUrl(url))
	const abs = join(cwd, "dist", path).replace(/\.ts\.d\.ts$/, ".d.ts")
	const content = typings[url]
	const ast = parse(content, {
		target: "es2021",
		syntax: "typescript",
		comments: true,
	})
	const nodes = esquery(ast as any, "[source.value=/\\.ts$/]")

	// Hacky workarounds
	for (const node of nodes as any) node.source.value = node.source.value + ".d.ts"
	const { code } = print(ast)
	const tmp = code.replaceAll(".ts.d.ts", "").replace(/^\/{3} <amd-module .+ \/>\n/u, "")

	await Deno.writeTextFile(abs, tmp)
}