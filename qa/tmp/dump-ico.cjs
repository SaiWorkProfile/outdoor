'use strict';
/* scratch: ASCII render of src/app/favicon.ico for visual QA */
const fs = require('node:fs');
const b = fs.readFileSync(require('node:path').join(__dirname, '..', '..', 'src', 'app', 'favicon.ico'));
const off = b.readUInt32LE(18);
const w = b.readInt32LE(off + 4);
const h = b.readInt32LE(off + 8) / 2;
let out = '';
for (let y = h - 1; y >= 0; y--) {
  let row = '';
  for (let x = 0; x < w; x++) {
    const i = off + 40 + (y * w + x) * 4;
    const a = b[i + 3], r = b[i + 2], g = b[i + 1], bl = b[i];
    const lum = (r + g + bl) / 3;
    row += a < 128 ? ' ' : lum > 200 ? '#' : lum > 75 ? '+' : '.';
  }
  out += row + '\n';
}
console.log(out);
