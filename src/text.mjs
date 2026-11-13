// Turns text into SVG paths so the images look the same on every machine.
// GitHub serves README images through a proxy, and an SVG loaded as an <img>
// can't fetch web fonts, so live <text> would fall back to the viewer's fonts.

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import opentype from "opentype.js";

const require = createRequire(import.meta.url);
const cache = new Map();

export function font(pkg, file) {
  const key = `${pkg}/${file}`;
  if (!cache.has(key)) {
    const path = require.resolve(`@fontsource/${pkg}/files/${file}`);
    const buf = readFileSync(path);
    cache.set(key, opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)));
  }
  return cache.get(key);
}

// The smallest text in any image renders at 20px or more once GitHub scales it.
// `minScale` is the narrowest width we expect an image to be shown at, divided
// by its viewBox width. Every call checks itself against that floor.
export function makeText({ minScale }) {
  return function text(f, str, { x, y, size, anchor = "start", tracking = 0 }) {
    const rendered = size * minScale;
    if (rendered < 20) {
      throw new Error(`"${str}" would render at ${rendered.toFixed(1)}px. Keep in-image text at 20px or more.`);
    }
    const width = measure(f, str, size, tracking);
    const left = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
    if (!tracking) return { d: pathData(f.getPath(str, left, y, size)), width };
    let cursor = left;
    const parts = [];
    for (const ch of str) {
      parts.push(pathData(f.getPath(ch, cursor, y, size)));
      cursor += f.getAdvanceWidth(ch, size) + tracking;
    }
    return { d: parts.join(""), width };
  };
}

// opentype.js 2.0's toPathData() can print "NaN" for some Figtree curves, which
// makes browsers stop drawing the rest of the path. Format the commands ourselves.
function pathData(path) {
  const n = (v) => {
    if (!Number.isFinite(v)) throw new Error("Glyph outline has a non-finite point");
    return (Math.round(v * 100) / 100).toString();
  };
  return path.commands
    .map((c) => {
      switch (c.type) {
        case "M": case "L": return `${c.type}${n(c.x)} ${n(c.y)}`;
        case "Q": return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
        case "C": return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
        default: return "Z";
      }
    })
    .join("");
}

export function measure(f, str, size, tracking = 0) {
  if (!tracking) return f.getAdvanceWidth(str, size);
  return [...str].reduce((w, ch) => w + f.getAdvanceWidth(ch, size) + tracking, -tracking);
}
