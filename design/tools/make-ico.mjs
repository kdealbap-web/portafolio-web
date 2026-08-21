/**
 * Packs the 16, 32 and 48 px PNGs into a single favicon.ico.
 *
 * An .ico is a directory of images, and since Vista the entries may be PNGs
 * rather than BMPs — so this is a header plus the files we already rendered,
 * with no re-encoding and no loss. Three sizes because that is what Windows
 * and older browsers actually pick between; everything modern takes the PNGs
 * declared in index.html instead.
 *
 *   node design/tools/make-ico.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SIZES = [16, 32, 48];
const dir = new URL('../../public/brand/', import.meta.url);

const images = SIZES.map((size) => ({
  size,
  data: readFileSync(new URL(`icon-${size}.png`, dir)),
}));

const HEADER = 6;
const ENTRY = 16;

const header = Buffer.alloc(HEADER);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // 1 = icon
header.writeUInt16LE(images.length, 4);

let offset = HEADER + ENTRY * images.length;
const entries = [];

for (const { size, data } of images) {
  const entry = Buffer.alloc(ENTRY);
  // 256 would be written as 0; we never go that big here.
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2); // palette size — none, it is truecolour
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += data.length;
}

const ico = Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
writeFileSync(new URL('../../public/favicon.ico', import.meta.url), ico);

console.log(
  `favicon.ico — ${images.length} sizes (${SIZES.join(', ')}), ${ico.length} bytes`,
);
