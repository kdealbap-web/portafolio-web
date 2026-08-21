/**
 * Makes the Angular server bundle loadable by workerd.
 *
 * Angular emits every server bundle with a CommonJS interop shim:
 *
 *   import { createRequire as __ngCreateRequire } from 'node:module';
 *   var require = __ngCreateRequire(import.meta.url);
 *
 * In a Worker `import.meta.url` is undefined, so `createRequire` throws at
 * module load and the runtime never starts — the error is
 * "The argument 'path' must be a file URL object ... Received 'undefined'".
 *
 * The shim cannot be removed with the builder's `define` option: Angular adds
 * it after esbuild has run, so the substitution never sees it. Patching the
 * emitted files is therefore the intervention, and it is a narrow one — a
 * single expression replaced with a literal URL. Nothing in this application
 * calls `require`; the shim only has to be constructible.
 *
 *   node design/tools/patch-worker.mjs
 *
 * Run it after `ng build --configuration cloudflare`. `npm run build:cf` does
 * both. Re-check this file when upgrading Angular: if the shim disappears
 * upstream, so should this script.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not `.pathname`: the checkout can live under a directory with
// a space in its name and the raw pathname keeps it percent-encoded.
const root = fileURLToPath(new URL('../../dist/portafolio-web/server/', import.meta.url));

const NEEDLE = '__ngCreateRequire(import.meta.url)';
const PATCHED = '__ngCreateRequire("file:///worker.mjs")';

let files = 0;
let hits = 0;

for (const name of readdirSync(root)) {
  if (!name.endsWith('.mjs')) continue;
  const path = join(root, name);
  const source = readFileSync(path, 'utf8');
  if (!source.includes(NEEDLE)) continue;

  const count = source.split(NEEDLE).length - 1;
  writeFileSync(path, source.split(NEEDLE).join(PATCHED), 'utf8');
  files++;
  hits += count;
  console.log(`  patched ${name} (${count})`);
}

if (files === 0) {
  console.log('nothing to patch — the shim is gone, so this script can go too');
} else {
  console.log(`patched ${hits} call site(s) across ${files} file(s)`);
}
