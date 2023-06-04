@_:
	just --list

setup:
	chmod +x .githooks/*
	git config --local core.hooksPath .githooks

test:
	deno test --import-map=tests/import-map.json --allow-net tests

bundle:
	deno run -A bundle.ts

pack: bundle
	cd dist && pnpm pack