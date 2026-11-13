// Builds the images in assets/ for the profile README.
// Run: npm run build

import { mkdirSync, writeFileSync } from "node:fs";
import { font, makeText, measure } from "./text.mjs";
import { orb, dial } from "./orb.mjs";

const OUT = new URL("../assets/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// Lecivo's palette
const NIGHT = "#0B0A10";
const LAVENDER = "#CDBEFF";
const MIST = "#F4F0FF";

const fraunces = font("fraunces", "fraunces-latin-400-normal.woff");
const geist = font("geist-sans", "geist-sans-latin-400-normal.woff");
const unbounded = font("unbounded", "unbounded-latin-600-normal.woff");
const figtree = font("figtree", "figtree-latin-500-normal.woff");

const MOTION = `
  .swirl { animation: spin 28s linear infinite; }
  .dial { animation: spin 120s linear infinite reverse; }
  .glow { animation: breathe 6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .bar { transform-box: fill-box; transform-origin: 50% 100%; animation: wave 1.8s ease-in-out infinite alternate; }
  .rise { animation: rise 1.1s cubic-bezier(.16,1,.3,1) both; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes breathe { 0%, 100% { opacity: .7; transform: scale(.97); } 50% { opacity: 1; transform: scale(1.03); } }
  @keyframes wave { from { transform: scaleY(.45); } to { transform: scaleY(1); } }
  @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`;

function svg({ w, h, title, defs = "", body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">
<title id="t">${title}</title>
<style>${MOTION}</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

// A waveform that breathes, the way Lecivo's player bar does while recording.
function waveform({ x, baseline, width, bars, maxH, color }) {
  const gap = width / bars;
  const out = [];
  for (let i = 0; i < bars; i++) {
    // Deterministic shape: louder in the middle of each phrase, quieter between.
    const phrase = Math.sin((i / bars) * Math.PI * 3.2) * 0.5 + 0.5;
    const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const h = Math.max(4, maxH * (0.25 + 0.75 * phrase * (0.6 + 0.4 * Math.abs(jitter))));
    const dur = (1.2 + Math.abs(jitter) * 1.3).toFixed(2);
    const delay = (-(i % 7) * 0.23).toFixed(2);
    out.push(
      `<rect class="bar" x="${(x + i * gap).toFixed(1)}" y="${(baseline - h).toFixed(1)}" width="${(gap * 0.42).toFixed(1)}" height="${h.toFixed(1)}" rx="${(gap * 0.21).toFixed(1)}" fill="${color}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`,
    );
  }
  return out.join("");
}

// ---------- Header: 1000 x 320, shown full width (about 830px or wider) ----------
{
  const W = 1000, H = 320;
  const text = makeText({ minScale: 0.8 });
  const name = text(fraunces, "Brayden Scuffham", { x: 64, y: 134, size: 64 });
  const l1 = text(geist, "I design and build AI products", { x: 66, y: 190, size: 28 });
  const lead = "end to end, in ";
  const l2a = text(geist, lead, { x: 66, y: 228, size: 28 });
  const l2b = text(geist, "Claude Code.", { x: 66 + measure(geist, lead, 28), y: 228, size: 28 });
  const o = orb("h", { cx: 850, cy: 160, r: 88, tone: "night" });

  const defs = `${o.defs}
    <radialGradient id="h-bg" cx="85%" cy="50%" r="60%">
      <stop offset="0" stop-color="#1d1733"/>
      <stop offset="1" stop-color="${NIGHT}"/>
    </radialGradient>`;

  const body = `
  <rect width="${W}" height="${H}" rx="28" fill="url(#h-bg)"/>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="27.25" fill="none" stroke="${LAVENDER}" stroke-opacity="0.14" stroke-width="1.5"/>
  ${dial({ cx: 850, cy: 160, r: 112, color: LAVENDER })}
  ${o.body}
  <g class="rise"><path d="${name.d}" fill="${MIST}"/></g>
  <g class="rise" style="animation-delay:.15s">
    <path d="${l1.d}" fill="${MIST}" fill-opacity="0.72"/>
    <path d="${l2a.d}" fill="${MIST}" fill-opacity="0.72"/>
    <path d="${l2b.d}" fill="${LAVENDER}"/>
  </g>
  <g opacity="0.75">${waveform({ x: 66, baseline: 282, width: 430, bars: 46, maxH: 26, color: LAVENDER })}</g>`;

  writeFileSync(new URL("header.svg", OUT), svg({ w: W, h: H, title: "Brayden Scuffham. I design and build AI products end to end, in Claude Code.", defs, body }));
}

// ---------- Product cards: 600 x 300, shown two across (about 400px each) ----------
function card({ file, title, bg, border, nameFont, name, nameColor, lines, lineFont, lineColor, tone, withDial }) {
  const W = 600, H = 300;
  const text = makeText({ minScale: 0.66 });
  const n = text(nameFont, name, { x: 44, y: 120, size: 60 });
  const ls = lines.map((l, i) => text(lineFont, l, { x: 46, y: 184 + i * 42, size: 32 }));
  const o = orb(file, { cx: 476, cy: 150, r: 70, tone });
  const body = `
  <rect width="${W}" height="${H}" rx="26" fill="${bg}"/>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="25.25" fill="none" stroke="${border}" stroke-width="1.5"/>
  ${withDial ? dial({ cx: 476, cy: 150, r: 90, count: 60, color: LAVENDER }) : ""}
  ${o.body}
  <path d="${n.d}" fill="${nameColor}"/>
  ${ls.map((l) => `<path d="${l.d}" fill="${lineColor}"/>`).join("")}`;
  writeFileSync(new URL(`${file}.svg`, OUT), svg({ w: W, h: H, title, defs: o.defs, body }));
}

card({
  file: "card-pip",
  title: "Pip: an AI analyst for local businesses",
  bg: "#FFFFFF",
  border: "#E2E5F3",
  nameFont: unbounded,
  name: "Pip",
  nameColor: "#12132B",
  lines: ["An AI analyst for", "local businesses"],
  lineFont: figtree,
  lineColor: "#4A4E6E",
  tone: "pearl",
  withDial: false,
});

card({
  file: "card-lecivo",
  title: "Lecivo: lectures into notes and flashcards",
  bg: NIGHT,
  border: "rgba(205,190,255,0.16)",
  nameFont: fraunces,
  name: "Lecivo",
  nameColor: MIST,
  lines: ["Lectures into notes", "and flashcards"],
  lineFont: geist,
  lineColor: "rgba(244,240,255,0.72)",
  tone: "night",
  withDial: true,
});

console.log("Built assets/header.svg, assets/card-pip.svg, assets/card-lecivo.svg");
