import packageJson from "./package.json" assert { type: "json" }
import { build, emptyDir } from "x/dnt@0.37/mod.ts"

await emptyDir("./dist")

await build({
	entryPoints: ["./src/index.ts"],
	outDir: "./dist",
	shims: {
		// see JS docs for overview and more options
		deno: true,
	},
	package: packageJson,
	packageManager: "pnpm",
	typeCheck: false,
	test: false,
})

// post build steps
Deno.copyFileSync("LICENSE", "./dist/LICENSE")
Deno.copyFileSync("README.md", "./dist/README.md")