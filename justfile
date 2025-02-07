@_:
	just --list

setup:
	chmod +x .githooks/*
	git config --local core.hooksPath .githooks
	corepack enable
	pnpm install

test:
	cd tests && deno test --allow-net --allow-read --unstable-unsafe-proto