/**
 * Assembles the Pages deployment: the browser output, with the server bundle
 * placed inside it as `_worker.js`.
 *
 * Cloudflare Pages runs a Worker only if it finds one at `_worker.js` in the
 * build output directory — its "advanced mode". A Workers-style
 * wrangler configuration with `main` is not read by a Pages project; it logs
 * "does not appear to be valid ... pages_build_output_dir" and serves the
 * directory statically, which 404s at the root because Angular emits
 * index.csr.html rather than index.html.
 *
 * `_worker.js` may be a directory as well as a single file, which is what this
 * needs: the server bundle is several modules — the manifests, the polyfills,
 * the lazy chunks and the inlined assets — and they have to travel together.
 * The entry is renamed to index.js because that is the name Pages looks for
 * inside the directory.
 *
 *   node design/tools/assemble-pages.mjs
 *
 * Run it after the patch step. `npm run build:cf` does the whole sequence.
 */
import { cpSync, existsSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../../dist/portafolio-web/', import.meta.url));
const server = join(root, 'server');
const worker = join(root, 'browser', '_worker.js');

if (!existsSync(server)) {
  throw new Error(`No server output at ${server} — run the build first.`);
}

// Start clean: a stale entry from a previous shape of this directory would be
// bundled along with the current one.
rmSync(worker, { recursive: true, force: true });
cpSync(server, worker, { recursive: true });

const entry = join(worker, 'server.mjs');
if (!existsSync(entry)) {
  throw new Error('No server.mjs in the server output — did the entry name change?');
}
renameSync(entry, join(worker, 'index.js'));

console.log('assembled _worker.js from the server bundle (entry: index.js)');
