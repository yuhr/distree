@_:
  just --list

test:
  deno test --import-map=tests/import-map.json --allow-net tests

bundle:
  deno run --allow-read='./' --allow-write='./dist' --allow-net --allow-env --unstable --no-check bundle.ts

pack: bundle
  npm pack