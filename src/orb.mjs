// The glass orb from Lecivo, drawn with gradients instead of video.
// Returns { defs, body } so several orbs can share one <svg>.

export function orb(id, { cx, cy, r, tone }) {
  const t = TONES[tone];
  // Bands of light that spiral around a dark eye, like the swirl in Lecivo's orb.
  // Each band is part of a tilted ellipse, so the glass reads as a sphere.
  const ex = cx + r * 0.08, ey = cy + r * 0.06;
  const band = (rho, squash, tilt, from, sweep) => {
    const rx = r * rho, ry = r * rho * squash, t = (tilt * Math.PI) / 180;
    const pt = (deg) => {
      const a = (deg * Math.PI) / 180, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
      return `${(ex + x * Math.cos(t) - y * Math.sin(t)).toFixed(1)} ${(ey + x * Math.sin(t) + y * Math.cos(t)).toFixed(1)}`;
    };
    return `M ${pt(from)} A ${rx.toFixed(1)} ${ry.toFixed(1)} ${tilt} ${sweep > 180 ? 1 : 0} 1 ${pt(from + sweep)}`;
  };
  const ribbons = [
    { d: band(0.82, 0.62, -28, 200, 230), w: 0.13, o: 0.8 },
    { d: band(0.6, 0.78, 18, 20, 250), w: 0.09, o: 0.85 },
    { d: band(0.4, 0.9, -50, 250, 220), w: 0.07, o: 0.75 },
    { d: band(0.95, 0.45, 12, 10, 150), w: 0.05, o: 0.55 },
    { d: band(0.22, 1, 30, 90, 200), w: 0.045, o: 0.6 },
  ];

  const defs = `
    <radialGradient id="${id}-body" cx="50%" cy="58%" r="62%">
      <stop offset="0" stop-color="${t.core}"/>
      <stop offset="0.72" stop-color="${t.mid}"/>
      <stop offset="1" stop-color="${t.edge}"/>
    </radialGradient>
    <radialGradient id="${id}-shade" cx="42%" cy="38%" r="62%">
      <stop offset="0.6" stop-color="${t.mid}" stop-opacity="0"/>
      <stop offset="1" stop-color="${t.mid}" stop-opacity="${t.shade}"/>
    </radialGradient>
    <radialGradient id="${id}-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0.55" stop-color="${t.glow}" stop-opacity="0.38"/>
      <stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.rim}" stop-opacity="0.9"/>
      <stop offset="0.45" stop-color="${t.rim}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="${t.rim}" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="${id}-swirl" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="${t.swirlB}" stop-opacity="0.1"/>
      <stop offset="0.45" stop-color="${t.swirlA}" stop-opacity="1"/>
      <stop offset="1" stop-color="${t.swirlB}" stop-opacity="0.25"/>
    </linearGradient>
    <clipPath id="${id}-clip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <filter id="${id}-crisp" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(r * 0.012).toFixed(2)}"/></filter>
    <filter id="${id}-bloom" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${(r * 0.06).toFixed(2)}"/></filter>`;

  const strokes = (filter, k) =>
    ribbons.map((b) => `<path d="${b.d}" fill="none" stroke="url(#${id}-swirl)" stroke-width="${(r * b.w * k).toFixed(1)}" stroke-linecap="round" opacity="${(b.o / k).toFixed(2)}" filter="url(#${id}-${filter})"/>`).join("");

  const body = `
    <circle class="glow" cx="${cx}" cy="${cy}" r="${r * 1.45}" fill="url(#${id}-glow)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-body)"/>
    <g clip-path="url(#${id}-clip)">
      <g class="swirl" style="transform-origin:${cx}px ${cy}px">${strokes("bloom", 2.2)}${strokes("crisp", 1)}</g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-shade)"/>
      <circle cx="${cx + r * 0.55}" cy="${cy + r * 0.6}" r="${r * 0.55}" fill="${t.rim}" opacity="0.28" filter="url(#${id}-bloom)"/>
      <ellipse cx="${cx - r * 0.36}" cy="${cy - r * 0.48}" rx="${r * 0.3}" ry="${r * 0.13}" transform="rotate(-34 ${cx - r * 0.36} ${cy - r * 0.48})" fill="#fff" opacity="0.8" filter="url(#${id}-crisp)"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="${r - 1}" fill="none" stroke="url(#${id}-rim)" stroke-width="2.5"/>`;

  return { defs, body };
}

// Tick marks around the orb, like the dial on Lecivo's landing page.
export function dial({ cx, cy, r, count = 72, color }) {
  const ticks = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const major = i % 6 === 0;
    const r0 = r, r1 = r + (major ? 14 : 7);
    const fade = 0.15 + 0.55 * Math.pow(Math.cos(a - Math.PI * 0.85) * 0.5 + 0.5, 2);
    ticks.push(
      `<line x1="${(cx + Math.cos(a) * r0).toFixed(1)}" y1="${(cy + Math.sin(a) * r0).toFixed(1)}" x2="${(cx + Math.cos(a) * r1).toFixed(1)}" y2="${(cy + Math.sin(a) * r1).toFixed(1)}" stroke="${color}" stroke-width="${major ? 2.2 : 1.4}" stroke-linecap="round" opacity="${fade.toFixed(2)}"/>`,
    );
  }
  return `<g class="dial" style="transform-origin:${cx}px ${cy}px">${ticks.join("")}</g>`;
}

const TONES = {
  // Lecivo: near-black glass with a lavender rim.
  night: { core: "#221b38", mid: "#0B0A10", edge: "#2c2350", glow: "#CDBEFF", rim: "#CDBEFF", swirlA: "#ffffff", swirlB: "#CDBEFF", shade: 0.85 },
  // Pip: a light, pearly orb in mint, sky and lilac.
  pearl: { core: "#fbfaff", mid: "#d6ccff", edge: "#9fe3dc", glow: "#9fd9ff", rim: "#ffffff", swirlA: "#ffffff", swirlB: "#a993ff", shade: 0.35 },
};
