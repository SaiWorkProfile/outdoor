'use strict';
/** Contrast sampling in page context. */
const CONTRAST = (samples) => {
  const rgb = (c) => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (fg, bg) => { const a = lum(fg), b = lum(bg); const hi = Math.max(a, b), lo = Math.min(a, b); return (hi + 0.05) / (lo + 0.05); };
  const bgOf = (el) => { let n = el; while (n && n !== document.documentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && c.a > 0.6) return c; n = n.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const out = [];
  for (const sel of samples) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const cs = getComputedStyle(el);
    const fg = rgb(cs.color);
    if (!fg) continue;
    const bg = bgOf(el);
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const r = ratio(fg, bg);
    out.push({ sel, ratio: Number(r.toFixed(2)), size, large, pass: r >= (large ? 3 : 4.5), color: cs.color, bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})` });
  }
  return { checked: out.length, failures: out.filter((c) => !c.pass), warnings: out.filter((c) => c.pass && c.ratio < 5) };
};

module.exports = { CONTRAST };
