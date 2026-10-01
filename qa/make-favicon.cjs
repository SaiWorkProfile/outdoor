/**
 * Generates src/app/favicon.ico (32x32, 32bpp BGRA) matching src/app/icon.svg —
 * the MeasureToBuild mark: rounded green tile, subtle project grid, white geometric
 * "M" and a ruler baseline with graduation ticks.
 * Run once: node qa/make-favicon.cjs
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const S = 32;
const px = Buffer.alloc(S * S * 4);
const BG = [0x23, 0x62, 0x3d]; // #23623d (--brand)
const GRID = [0x1b, 0x54, 0x34]; // #1b5434 — subtle construction grid
const FG = [0xff, 0xff, 0xff];

function set(x, y, [r, g, b]) {
  if (x < 0 || y < 0 || x >= S || y >= S) return;
  const i = (y * S + x) * 4;
  px[i] = b; px[i + 1] = g; px[i + 2] = r; px[i + 3] = 255;
}
const inRoundRect = (x, y, rx0, ry0, rx1, ry1, r) => {
  if (x < rx0 || x > rx1 || y < ry0 || y > ry1) return false;
  const cx = Math.min(Math.max(x, rx0 + r), rx1 - r);
  const cy = Math.min(Math.max(y, ry0 + r), ry1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r + 0.6;
};

/* Abstract M: the fill polygon used by icon.svg / logo-mark.svg. */
const M_POLY = [
  [6.5, 22.5], [6.5, 6], [10.5, 6], [16, 13.2], [21.5, 6], [25.5, 6],
  [25.5, 22.5], [21.5, 22.5], [21.5, 13.4], [16, 20.6], [10.5, 13.4], [10.5, 22.5],
];
function inPolygon(px_, py_, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > py_) !== (yj > py_) && px_ < ((xj - xi) * (py_ - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* Ruler graduation ticks (1.4 x 1.4, centres at x = 8, 16, 24) and baseline (6.5..25.5). */
const TICKS = [8, 16, 24];
const inTick = (x, y) => TICKS.some((cx) => x >= cx - 0.7 && x <= cx + 0.7) && y >= 23.2 && y <= 24.6;
const inBar = (x, y) => inRoundRect(x, y, 6.5, 25.2, 25.5, 27.0, 0.9);

/* 2x2 sub-samples per pixel: the grid {0.25, 0.75} is mirror-symmetric about x=16, so a
   mirror-symmetric design rasterizes to a mirror-symmetric bitmap (boundary pixels no
   longer depend on edge direction). A sample set is "in" at >= 50% coverage. */
const SUB = [0.25, 0.75];
const inWhite = (x, y) => {
  let hits = 0;
  for (const sx of SUB) for (const sy of SUB) {
    const cx = x + sx;
    const cy = y + sy;
    if (inPolygon(cx, cy, M_POLY) || inTick(cx, cy) || inBar(cx, cy)) hits++;
  }
  return hits * 2 >= SUB.length * SUB.length;
};

for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    if (!inRoundRect(x, y, 0, 0, S - 1, S - 1, 7)) { set(x, y, [0, 0, 0]); px[(y * S + x) * 4 + 3] = 0; continue; }
    // subtle project grid: columns/rows 7, 16, 24 (mirror-symmetric: 7 <-> 24)
    const color = (x === 7 || x === 16 || x === 24 || y === 7 || y === 16 || y === 24) ? GRID : BG;
    set(x, y, inWhite(x, y) ? FG : color);
  }
}

// BITMAPINFOHEADER (height doubled: XOR image + AND mask)
const header = Buffer.alloc(40);
header.writeUInt32LE(40, 0);
header.writeInt32LE(S, 4);
header.writeInt32LE(S * 2, 8);
header.writeUInt16LE(1, 12);
header.writeUInt16LE(32, 14);
header.writeUInt32LE(0, 16);
header.writeUInt32LE(px.length, 20);

// BMP rows are bottom-up
const xorRows = Buffer.alloc(px.length);
for (let y = 0; y < S; y++) px.copy(xorRows, (S - 1 - y) * S * 4, y * S * 4, (y + 1) * S * 4);
const andMask = Buffer.alloc(S * 4); // 32 rows x 4 bytes, all "opaque" (0 = use XOR pixel)
const image = Buffer.concat([header, xorRows, andMask]);

const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0); dir.writeUInt16LE(1, 2); dir.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry[0] = S; entry[1] = S; entry[2] = 0; entry[3] = 0;
entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(image.length, 8); entry.writeUInt32LE(22, 12);

const out = path.join(__dirname, '..', 'src', 'app', 'favicon.ico');
fs.writeFileSync(out, Buffer.concat([dir, entry, image]));
console.log(`wrote ${out} (${22 + image.length} bytes)`);
