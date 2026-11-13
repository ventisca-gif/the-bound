// ================= ENVIRONMENT ART =================
const SPR = {};
function spr(key, fn) { let s = SPR[key]; if (!s) { s = fn(); SPR[key] = s; } return s; }
const OUTL = C('#120c10');
const LEAF = {
  roble: pal(['#13291a', '#1d4222', '#2a5d2a', '#3f7a33', '#5c9a40', '#86bd52']), pino: pal(['#0d2219', '#143424', '#1d4a2e', '#286338', '#387d44', '#559a55']),
  abedul: pal(['#26401a', '#375a21', '#4e7a2b', '#699a37', '#8cba4a', '#b8d76c']), sauce: pal(['#1b361d', '#284d27', '#386731', '#4f833b', '#6b9f48', '#92bd60']),
  ebano: pal(['#0d2124', '#143134', '#1d4645', '#295f59', '#3a7a6d', '#589a87']), cerezo: pal(['#4a1c2e', '#782b47', '#a64468', '#cd6c90', '#ea9aba', '#fbcfe1']),
  palma: pal(['#1b3912', '#28521a', '#3a6f24', '#518e2f', '#71ab3f', '#98c958']), ancestral: pal(['#10261a', '#183a24', '#245130', '#326b3c', '#46884a', '#64a65e']),
  bush: pal(['#14301a', '#1f4722', '#2c612b', '#417e34', '#5f9c42', '#88bc55']), swamp: pal(['#1a2a1a', '#263b23', '#344d2d', '#456238', '#5b7845', '#779355']),
};
const BARK = { std: pal(['#21140c', '#382213', '#50311d', '#694328', '#845735']), birch: pal(['#26201c', '#7d756b', '#ada598', '#d6cfc3', '#f1ece2']), dark: pal(['#120c0d', '#1f1518', '#2f2127', '#422f37', '#573e48']), palm: pal(['#3a2614', '#5a3c20', '#7a552e', '#9a6f3e', '#b88a52']), ash: pal(['#0b0909', '#181313', '#271f1e', '#372b29', '#ff7a1e']), dead: pal(['#1e1814', '#332a23', '#4a3d33', '#635345', '#7d6b5a']) };
const STONEP = pal(['#26262d', '#3d3d47', '#565663', '#727280', '#91919d', '#b8b8c2']), STONEW = pal(['#3a3328', '#564c3e', '#746653', '#93836b', '#b2a186', '#d4c5a6']);
const WOOD = pal(['#2a170c', '#432614', '#5e381e', '#7a4c29', '#986236', '#b67c48']), IRON = pal(['#16151a', '#2a2930', '#424149', '#5d5c66', '#7c7b86', '#a3a2ac']);
const GOLD = pal(['#4a2e0c', '#7a4f14', '#a8731e', '#d39e2e', '#f0c84a', '#fff0a0']);
function rngFor(k, v) { let h = 0; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) | 0; return new RNG((h ^ (v * 7919)) >>> 0); }
function leafBlob(p, b, P, seed) {
  for (let y = Math.floor(b.y - b.r); y <= Math.ceil(b.y + b.r); y++) for (let x = Math.floor(b.x - b.r); x <= Math.ceil(b.x + b.r); x++) {
    const dx = (x + 0.5 - b.x) / b.r, dy = (y + 0.5 - b.y) / (b.r * (b.sy || 1)), d2 = dx * dx + dy * dy; if (d2 > 1) continue;
    if (d2 > 0.72 && hash2(x, y, seed) < (d2 - 0.72) * 2.6) continue;
    let l = 0.56 + (-dx * 0.5 - dy * 0.86) * 0.4 - d2 * 0.1 + (b.l || 0);
    l += (hash2(x >> 1, y >> 1, seed + 1) - 0.5) * 0.24 + (hash2(x, y, seed + 2) - 0.5) * 0.08;
    if (d2 > 0.55 && dx * 0.55 + dy * 0.83 > 0.4) l -= 0.24;
    p.set(x, y, P[clamp(Math.floor(l * P.length), 0, P.length - 1)]);
  }
}
function canopy(p, blobs, P, seed, cy, R) { blobs.sort((a, b) => a.y - b.y); for (const b of blobs) { b.l = (b.l || 0) + (cy - b.y) / R * 0.12; leafBlob(p, b, P, seed); } }
function trunk(p, x, yb, yt, w0, w1, B, seed, birch) {
  for (let y = yt; y <= yb; y++) {
    const t = (y - yt) / Math.max(1, yb - yt), ww = Math.round(lerp(w1, w0, t * t)), x0 = Math.round(x - ww / 2);
    for (let i = 0; i < ww; i++) {
      let v = i === 0 ? 3 : i === 1 ? 4 : i >= ww - 1 ? 1 : 2; if (ww <= 3 && i === 1) v = 3;
      if (!birch && hash2(x0 + i, y >> 1, seed) < 0.18 && i > 0 && i < ww - 1) v = Math.max(0, v - 1);
      if (birch && hash2(y >> 1, i, seed) < 0.12 && hash2(y, 3, seed) < 0.5) v = 0;
      p.set(x0 + i, y, B[v]);
    }
  }
  // roots
  p.set(x - Math.ceil(w0 / 2) - 1, yb, B[2]); p.set(x + Math.floor(w0 / 2) + 1, yb, B[1]); p.set(x - Math.ceil(w0 / 2) - 2, yb, B[1]); p.set(x + Math.floor(w0 / 2) + 2, yb, B[0]);
}
function branch(p, x, y, a, len, wd, d, B, R, moss) {
  const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
  for (let k = 0; k < wd; k++) p.line(x + k * 0.6, y, x2 + k * 0.4, y2, B[k === 0 ? 3 : k === wd - 1 ? 1 : 2]);
  if (moss && R.f() < 0.5) { const ml = R.int(3, 7); for (let j = 0; j < ml; j++) p.set(Math.round(x2) + (j % 3 === 2 ? 1 : 0), Math.round(y2) + j, LEAF.swamp[R.int(2, 4)]); }
  if (d <= 0) return;
  branch(p, x2, y2, a - R.range(0.3, 0.7), len * R.range(0.55, 0.75), Math.max(1, wd - 1), d - 1, B, R, moss);
  branch(p, x2, y2, a + R.range(0.3, 0.7), len * R.range(0.55, 0.75), Math.max(1, wd - 1), d - 1, B, R, moss);
}
// returns {trunk, canopy, ax, ay, w, h, sh:[rx,ry]}
function genTree(sp, v) {
  const R = rngFor(sp, v), seed = R.int(1, 99999);
  if (sp === 'pino' || sp === 'pinonev') {
    const W = 38, H = 66, ax = 19, ay = 63, tp = new Pix(W, H), cp = new Pix(W, H), P = LEAF.pino, snow = sp === 'pinonev';
    const tiers = 4, sc = R.range(0.92, 1.08);
    trunk(tp, ax, ay, ay - 14, 5, 4, BARK.std, seed);
    for (let t = tiers - 1; t >= 0; t--) {
      const apex = 4 + t * 11 * sc, bot = apex + 17 + t * 1.5, hw = (5 + t * 4) * sc;
      for (let y = Math.floor(apex); y <= Math.ceil(bot); y++) {
        const f = (y - apex) / (bot - apex), half = hw * f + 1;
        for (let x = Math.floor(ax - half); x <= Math.ceil(ax + half); x++) {
          const rx = (x + 0.5 - ax) / half; if (Math.abs(rx) > 1) continue;
          const saw = (Math.abs(x - ax) % 4) * 0.7; if (y > bot - saw) continue;
          let l = 0.52 - rx * 0.3 + (1 - f) * 0.22 + (hash2(x, y, seed) - 0.5) * 0.2; if (y > bot - saw - 2) l -= 0.3;
          let col = P[clamp(Math.floor(l * 6), 0, 5)];
          if (snow && (f < 0.28 + hash2(x, 1, seed) * 0.2 || (rx < -0.5 && hash2(x, y, seed + 4) < 0.5))) col = (l > 0.5 ? C('#f4f8ff') : C('#c4d2e6'));
          cp.set(x, y, col);
        }
      }
    }
    cp.outline(C('#0a1810'), false); tp.outline(OUTL);
    return { trunk: tp.canvas(), canopy: cp.canvas(), ax, ay, w: W, h: H, sh: [12, 5] };
  }
  if (sp === 'palma') {
    const W = 52, H = 66, ax = 22, ay = 63, tp = new Pix(W, H), cp = new Pix(W, H), B = BARK.palm, P = LEAF.palma;
    const bend = R.range(4, 10) * (R.f() < 0.5 ? -1 : 1), topx = ax + bend, topy = 20;
    for (let k = 0; k <= 42; k++) { const t = k / 42, x = lerp(ax, topx, t * t) , y = lerp(ay, topy, t); const ww = Math.round(lerp(5, 3, t)); for (let i = 0; i < ww; i++) tp.set(Math.round(x - ww / 2 + i), Math.round(y), B[k % 4 === 0 ? 0 : i === 0 ? 3 : i === ww - 1 ? 1 : 2]); }
    const fr = 8; for (let f = 0; f < fr; f++) { const a = -Math.PI + (f / (fr - 1)) * Math.PI + R.range(-0.15, 0.15), len = R.range(15, 21);
      let px = topx, py = topy; for (let s = 0; s < len; s++) { const t = s / len, ang = a + (Math.cos(a) > 0 ? 1 : -1) * t * 0.9 * (Math.abs(Math.cos(a)) + 0.2); const sy = Math.sin(a) < -0.6 ? 0 : t * t * 6; px += Math.cos(ang); py += Math.sin(ang) * 0.75 + sy * 0.12; cp.set(Math.round(px), Math.round(py), P[3]);
        const lf = Math.round(3 * (1 - t) + 1); for (let q = 1; q <= lf; q++) { cp.set(Math.round(px), Math.round(py) + q, P[q === lf ? 1 : 2]); if (s % 2) cp.set(Math.round(px) + (Math.cos(a) > 0 ? -1 : 1), Math.round(py) + q, P[4]); } } }
    for (let k = 0; k < 3; k++) cp.ball(topx - 2 + k * 2, topy + 3, 2, 2, pal(['#3a2410', '#5a3a18', '#7a5226']));
    cp.outline(C('#0c1a08')); tp.outline(OUTL);
    return { trunk: tp.canvas(), canopy: cp.canvas(), ax, ay, w: W, h: H, sh: [11, 4] };
  }
  if (sp === 'muerto' || sp === 'ceniza' || sp === 'umbrio') {
    const W = 44, H = 58, ax = 22, ay = 55, tp = new Pix(W, H), cp = new Pix(W, H), B = sp === 'ceniza' ? BARK.ash : sp === 'umbrio' ? BARK.dark : BARK.dead;
    trunk(tp, ax, ay, ay - 22, 6, 4, B, seed);
    branch(cp, ax, ay - 22, -Math.PI / 2 + R.range(-0.2, 0.2), 12, 3, 3, B, R, sp === 'muerto');
    branch(cp, ax - 1, ay - 16, -Math.PI * 0.8, 9, 2, 2, B, R, sp === 'muerto'); branch(cp, ax + 1, ay - 18, -Math.PI * 0.2, 9, 2, 2, B, R, sp === 'muerto');
    if (sp === 'umbrio') for (let k = 0; k < 16; k++) { const y = R.int(ay - 40, ay - 10), x = ax + R.int(-12, 12); cp.set(x, y, R.f() < 0.5 ? C('#b070ff') : C('#f0c050')); }
    if (sp === 'ceniza') for (let k = 0; k < 22; k++) { const y = R.int(ay - 22, ay - 1); tp.set(ax + R.int(-2, 1), y, R.f() < 0.5 ? C('#ff6a1a') : C('#ffc04a')); }
    cp.outline(OUTL); tp.outline(OUTL);
    return { trunk: tp.canvas(), canopy: cp.canvas(), ax, ay, w: W, h: H, sh: [9, 4] };
  }
  if (sp === 'ancestral') {
    const W = 112, H = 124, ax = 56, ay = 120, tp = new Pix(W, H), cp = new Pix(W, H), P = LEAF.ancestral;
    trunk(tp, ax, ay - 4, ay - 50, 18, 12, BARK.std, seed);
    for (let k = 0; k < 6; k++) { const a = Math.PI * (0.1 + k * 0.16); branch(tp, ax + Math.cos(a) * 4, ay - 6, Math.PI - a + Math.PI, 18, 3, 0, BARK.std, R, false); }
    const blobs = []; const cy = 44; for (let k = 0; k < 18; k++) { const a = R.range(0, Math.PI * 2), rr = R.range(10, 30); blobs.push({ x: ax + Math.cos(a) * rr * 1.25, y: cy + Math.sin(a) * rr * 0.85, r: R.range(11, 17) }); }
    blobs.push({ x: ax, y: cy, r: 22 });
    canopy(cp, blobs, P, seed, cy, 40);
    for (let k = 0; k < 40; k++) { const x = R.int(10, W - 10), y = R.int(10, 80); if (uA(cp.get(x, y))) cp.set(x, y, R.f() < 0.5 ? C('#d8f070') : C('#a8e8a0')); }
    cp.outline(C('#08160c')); tp.outline(OUTL);
    return { trunk: tp.canvas(), canopy: cp.canvas(), ax, ay, w: W, h: H, sh: [36, 12] };
  }
  // round deciduous trees
  const P = LEAF[sp] || LEAF.roble, birch = sp === 'abedul' || sp === 'arbolcristal', willow = sp === 'sauce', big = sp === 'ebano' ? 1.1 : sp === 'caoba' ? 1.2 : sp === 'acacia' ? 0.9 : 1;
  const W = 52, H = 66, ax = 26, ay = 63, tp = new Pix(W, H), cp = new Pix(W, H);
  const cyc = 26 + R.int(-2, 2), Rx = (17 + R.range(-2, 2)) * big, Ry = 15 * big;
  trunk(tp, ax, ay, cyc + 6, 7, 4, birch ? BARK.birch : sp === 'ebano' ? BARK.dark : BARK.std, seed, birch);
  branch(tp, ax - 1, cyc + 12, -Math.PI * 0.72, 9, 2, 0, birch ? BARK.birch : BARK.std, R, false); branch(tp, ax + 1, cyc + 10, -Math.PI * 0.3, 8, 2, 0, birch ? BARK.birch : BARK.std, R, false);
  const blobs = [{ x: ax, y: cyc, r: Rx * 0.62 }]; const nb = R.int(7, 9);
  for (let k = 0; k < nb; k++) { const a = (k / nb) * Math.PI * 2 + R.range(-0.3, 0.3); blobs.push({ x: ax + Math.cos(a) * Rx * 0.55, y: cyc + Math.sin(a) * Ry * 0.55, r: R.range(0.42, 0.55) * Rx }); }
  blobs.push({ x: ax + R.range(-3, 3), y: cyc - Ry * 0.6, r: Rx * 0.48 });
  if (birch) blobs.forEach(b => b.r *= 0.9);
  canopy(cp, blobs, P, seed, cyc, Ry);
  if (willow) { for (let x = Math.round(ax - Rx * 0.95); x <= ax + Rx * 0.95; x += 2) { let y0 = cyc + Math.round(Math.sqrt(Math.max(0, 1 - ((x - ax) / Rx) ** 2)) * Ry * 0.75); const L = R.int(7, 17); for (let j = 0; j < L; j++) cp.set(x + (j > 6 && (x & 2) ? 1 : 0), y0 + j, P[clamp(3 - (j >> 2) + (hash2(x, j, 1) < 0.3 ? 1 : 0), 1, 5)]); } }
  if (sp === 'cerezo') for (let k = 0; k < 18; k++) { const x = R.int(4, W - 4), y = R.int(4, 50); if (uA(cp.get(x, y))) cp.set(x, y, C('#fff4f8')); }
  if (sp === 'roble' && R.f() < 0.3) for (let k = 0; k < 8; k++) { const x = R.int(10, W - 10), y = R.int(14, 40); if (uA(cp.get(x, y))) { cp.set(x, y, C('#c8302a')); cp.set(x, y - 1, C('#f06048')); } }
  cp.outline(uMix(P[0], C('#000000'), 0.55)); tp.outline(OUTL);
  return { trunk: tp.canvas(), canopy: cp.canvas(), ax, ay, w: W, h: H, sh: [Math.round(Rx * 0.8), 6] };
}
function genStump(sp) {
  const p = new Pix(18, 14), B = sp === 'abedul' ? BARK.birch : BARK.std;
  p.rect(5, 5, 8, 7, B[2]); p.vl(5, 5, 7, B[3]); p.vl(12, 5, 7, B[1]); p.set(4, 11, B[2]); p.set(13, 11, B[1]);
  p.ell(9, 5, 4.2, 2.2, C('#c8a070')); p.ell(9, 5, 2.6, 1.3, C('#a87e50')); p.set(9, 5, C('#c8a070'));
  p.outline(OUTL); return { c: p.canvas(), ax: 9, ay: 12 };
}
function shadowSprite(rx, ry) {
  return spr('sh' + rx + 'x' + ry, () => { const c = mkCanvas(rx * 2 + 2, ry * 2 + 2), x = c.getContext('2d'); const p = new Pix(rx * 2 + 2, ry * 2 + 2); p.ell(rx + 1, ry + 1, rx, ry, rgbU(8, 14, 10, 80)); p.ell(rx + 1, ry + 1, rx * 0.72, ry * 0.7, rgbU(8, 14, 10, 105)); return p.canvas(); });
}
// rocks & ores
const ORE = { 1: ['#b8622e', '#e08a48', '#ffb878'], 2: ['#6e5048', '#9a7a6c', '#c8aa98'], 3: ['#9aa6b4', '#d0dae6', '#ffffff'], 4: ['#b88a1e', '#f0c840', '#fff2a0'], 5: ['#2a8a9c', '#5ad0e0', '#c8fbff'], 6: ['#6a2a9c', '#a456e0', '#e0b8ff'], 7: ['#a01a48', '#ff4a80', '#ffc0d8'] };
function genRock(size, v, kind) {
  const R = rngFor('rock' + size + kind, v), dims = { s: [14, 11], m: [20, 16], l: [30, 24] }[size], W = dims[0] + 4, H = dims[1] + 4;
  const p = new Pix(W, H), Pp = kind === 'snow' || kind === 'ice' ? pal(['#2c3442', '#424e60', '#5c6a7e', '#7a889c', '#9eacc0', '#c8d4e4']) : kind === 'obs' ? pal(['#0e0a12', '#1a1420', '#2a2032', '#3c2e48', '#584466', '#8a76a0']) : kind === 'warm' ? STONEW : STONEP;
  const cx = W / 2, cy = H / 2 + 1, rx = dims[0] / 2, ry = dims[1] / 2;
  const bl = [{ x: cx, y: cy, rx, ry }, { x: cx - rx * 0.4, y: cy + ry * 0.15, rx: rx * 0.6, ry: ry * 0.8 }, { x: cx + rx * 0.35, y: cy - ry * 0.1, rx: rx * 0.65, ry: ry * 0.85 }];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let inside = false, best = 9, bb = null; for (const b of bl) { const dx = (x + 0.5 - b.x) / b.rx, dy = (y + 0.5 - b.y) / b.ry, d = dx * dx + dy * dy; if (d <= 1 && d < best) { best = d; bb = b; inside = true; } }
    if (!inside) continue; const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
    let l = 0.55 + (-dx * 0.45 - dy * 0.8) * 0.45 + (hash2(x >> 1, y >> 1, v + 3) - 0.5) * 0.18; if (dy < -0.35) l += 0.12; if (dy > 0.55) l -= 0.2;
    p.set(x, y, Pp[clamp(Math.floor(l * 6), 0, 5)]);
  }
  // cracks
  for (let k = 0; k < (size === 'l' ? 3 : 1); k++) { let x = R.int(cx - rx / 2, cx + rx / 2), y = R.int(cy - ry / 3, cy); for (let j = 0; j < R.int(2, 5); j++) { if (uA(p.get(x, y))) p.set(x, y, Pp[0]); x += R.int(-1, 1); y++; } }
  if (kind === 'moss') for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) { if (uA(p.get(x, y)) && !uA(p.get(x, y - 2)) && hash2(x, y, 5) < 0.75) { p.set(x, y, LEAF.roble[hash2(x, 1, 2) < 0.5 ? 3 : 4]); p.set(x, y + 1, LEAF.roble[2]); } }
  if (kind === 'snow') for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) { if (uA(p.get(x, y)) && !uA(p.get(x, y - 1))) { p.set(x, y, C('#f6faff')); if (hash2(x, y, 7) < 0.7) p.set(x, y + 1, C('#dce8f6')); if (hash2(x, y, 8) < 0.4) p.set(x, y + 2, C('#c4d4ea')); } }
  if (typeof kind === 'number') { // ore veins
    const oc = pal(ORE[kind]); const n = size === 'l' ? 6 : 4;
    for (let k = 0; k < n; k++) { const ox = R.int(Math.round(cx - rx * 0.6), Math.round(cx + rx * 0.6)), oy = R.int(Math.round(cy - ry * 0.4), Math.round(cy + ry * 0.45)); if (!uA(p.get(ox, oy))) continue;
      if (kind >= 5) { p.vl(ox, oy - 2, 4, oc[1]); p.vl(ox + 1, oy - 1, 3, oc[0]); p.set(ox, oy - 2, oc[2]); p.set(ox - 1, oy, oc[1]); }
      else { p.set(ox, oy, oc[1]); p.set(ox + 1, oy, oc[0]); p.set(ox, oy - 1, oc[2]); p.set(ox + 1, oy + 1, oc[0]); if (R.f() < 0.5) p.set(ox - 1, oy, oc[1]); } }
  }
  p.outline(OUTL); return { c: p.canvas(), ax: Math.round(cx), ay: Math.round(cy + ry) };
}
const HERB = { 1: ['Hierba Verde', '#2e6a24', '#5ea83a', '#a8e070'], 2: ['Flor Azul', '#2a5a2a', '#3a6ad8', '#9ac8ff'], 3: ['Raíz Roja', '#5a2a1a', '#c0302a', '#ff7a5a'], 4: ['Loto Gris', '#3a5a3a', '#c8b8c8', '#fff0ff'], 5: ['Flor de Luna', '#2a4a3a', '#e8f0ff', '#fff8b0'], 6: ['Flor de Nieve', '#3a5a6a', '#9ae0ff', '#ffffff'], 7: ['Hierba Ígnea', '#5a1a0a', '#ff6a1a', '#ffd84a'] };
function genHerb(t) {
  const p = new Pix(14, 14), h = HERB[t], c0 = C(h[1]), c1 = C(h[2]), c2 = C(h[3]), lv = LEAF.roble;
  if (t === 4) { p.ell(7, 10, 6, 2.6, C('#2f5a30')); p.ell(7, 9.6, 5, 1.8, C('#447a3c')); for (let k = 0; k < 5; k++) { p.set(5 + k, 7, c1); } p.set(6, 6, c2); p.set(7, 5, c2); p.set(8, 6, c2); p.set(7, 7, C('#ffe070')); }
  else if (t === 1) { for (let k = 0; k < 5; k++) { const x = 3 + k * 2; p.line(7, 12, x, 5 + (k % 2) * 2, k % 2 ? lv[3] : lv[4]); p.set(x, 5 + (k % 2) * 2, c2); } p.set(7, 12, lv[1]); }
  else if (t === 3) { p.ell(7, 11, 3, 2, C('#7a2a20')); p.set(6, 10, C('#c04a3a')); for (let k = 0; k < 4; k++) p.line(7, 10, 3 + k * 3, 4, k % 2 ? c0 : c1); p.set(4, 4, c2); p.set(10, 4, c2); }
  else { for (let k = 0; k < 3; k++) { const x = 3 + k * 4; p.line(7, 13, x, 6, lv[3]); p.set(x - 1, 9, lv[4]); p.set(x + 1, 10, lv[2]); } [[3, 5], [7, 3], [11, 5]].forEach(([x, y]) => { p.set(x, y, c1); p.set(x - 1, y, c1); p.set(x + 1, y, c1); p.set(x, y - 1, c1); p.set(x, y + 1, c0); p.set(x, y, c2); }); }
  p.outline(OUTL); return { c: p.canvas(), ax: 7, ay: 13 };
}
function genBush(v, kind) {
  const p = new Pix(22, 18), R = rngFor('bush' + kind, v), P = kind === 'swamp' ? LEAF.swamp : kind === 'snow' ? LEAF.pino : LEAF.bush;
  const bl = [{ x: 11, y: 10, r: 7 }, { x: 7, y: 11, r: 5 }, { x: 15, y: 11, r: 5 }, { x: 11, y: 7, r: 5 }];
  canopy(p, bl, P, R.int(1, 999), 10, 7);
  if (kind === 'berry') for (let k = 0; k < 7; k++) { const x = R.int(5, 17), y = R.int(5, 14); if (uA(p.get(x, y))) { p.set(x, y, C('#d02a3a')); p.set(x, y - 1, C('#ff7080')); } }
  if (kind === 'snow') for (let x = 0; x < 22; x++) for (let y = 0; y < 18; y++) if (uA(p.get(x, y)) && !uA(p.get(x, y - 1))) { p.set(x, y, C('#f4f8ff')); p.set(x, y + 1, C('#d0dcec')); }
  p.outline(uMix(P[0], C('#000'), 0.5)); return { c: p.canvas(), ax: 11, ay: 16 };
}
// ---------- props ----------
function woodPost(p, x, y0, y1, w = 2) { for (let y = y0; y <= y1; y++) for (let i = 0; i < w; i++) p.set(x + i, y, WOOD[i === 0 ? 4 : i === w - 1 ? 1 : 2 + ((y * 7) % 3 === 0 ? -1 : 0)]); }
function genLantern(kind) {
  const W = 18, H = 36, p = new Pix(W, H);
  if (kind === 'iron') { for (let y = 8; y < 34; y++) { p.set(8, y, IRON[3]); p.set(9, y, IRON[1]); } p.rect(6, 32, 6, 3, IRON[2]); p.rect(5, 2, 8, 2, IRON[2]); p.rect(6, 4, 6, 6, C('#ffd860')); p.rect(7, 5, 4, 4, C('#fff4c0')); p.vl(6, 4, 6, IRON[1]); p.vl(11, 4, 6, IRON[1]); p.rect(6, 10, 6, 1, IRON[2]); p.set(8, 1, IRON[3]); }
  else {
    woodPost(p, 3, 6, 33, 3); p.rect(1, 32, 7, 3, STONEP[2]); p.hl(1, 32, 7, STONEP[4]);
    p.hl(3, 6, 10, WOOD[3]); p.hl(3, 7, 10, WOOD[1]); p.line(5, 8, 8, 6, WOOD[2]);
    p.vl(11, 8, 2, IRON[2]);
    p.rect(9, 10, 6, 1, IRON[2]); p.rect(9, 11, 6, 6, C('#ffcf50')); p.rect(10, 12, 4, 4, C('#fff2b8')); p.vl(9, 11, 6, IRON[1]); p.vl(14, 11, 6, IRON[1]); p.vl(11, 11, 6, IRON[2]); p.rect(9, 17, 6, 1, IRON[2]); p.set(11, 18, IRON[1]); p.set(12, 18, IRON[1]); p.hl(10, 9, 4, IRON[3]);
  }
  p.outline(OUTL); return { c: p.canvas(), ax: kind === 'iron' ? 9 : 4, ay: 34, light: kind === 'iron' ? [9, 7] : [12, 14] };
}
function genBanner(col, f) {
  const W = 16, H = 34, p = new Pix(W, H), cc = C(col), cd = uMul(cc, 0.65), cl = uMix(cc, C('#ffffff'), 0.25);
  woodPost(p, 2, 1, 32, 2); p.hl(2, 3, 13, WOOD[3]); p.set(14, 2, GOLD[4]); p.set(2, 0, GOLD[4]);
  for (let y = 4; y < 26; y++) { const sway = f && y > 12 ? 1 : 0; for (let x = 5; x < 14; x++) { const xx = x + sway; if (y > 21 && Math.abs(x - 9.5) < (y - 21) * 1.1) continue; let c = x === 5 ? cl : x === 13 ? cd : cc; if ((x + y) % 7 === 0 && x > 6) c = cd; p.set(xx, y, c); } }
  // white cross emblem
  const ex = 9 + (f ? 0 : 0); const wc = C('#ece4d2'); for (let y = 8; y < 18; y++) p.set(ex, y, wc), p.set(ex + 1, y, wc); for (let x = 6; x < 13; x++) p.set(x, 11, wc), p.set(x, 12, wc); p.set(ex - 1, 8, wc); p.set(ex + 2, 8, wc); p.set(ex - 1, 17, wc); p.set(ex + 2, 17, wc);
  p.hl(5, 5, 9, GOLD[3]);
  p.outline(OUTL); return { c: p.canvas(), ax: 3, ay: 33 };
}
function genFence(o) {
  if (o === 'h') { const p = new Pix(16, 14); for (const x of [1, 12]) { woodPost(p, x, 2, 13, 3); p.set(x + 1, 1, WOOD[3]); } p.hl(0, 5, 16, WOOD[4]); p.hl(0, 6, 16, WOOD[2]); p.hl(0, 9, 16, WOOD[3]); p.hl(0, 10, 16, WOOD[1]); p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 13 }; }
  const p = new Pix(8, 22); woodPost(p, 3, 2, 21, 3); p.set(4, 1, WOOD[3]); p.vl(2, 0, 18, WOOD[1]); p.outline(OUTL); return { c: p.canvas(), ax: 4, ay: 21 };
}
function genBarrel() { const p = new Pix(14, 16); for (let y = 3; y < 15; y++) { const bulge = y > 5 && y < 13 ? 1 : 0; for (let x = 2 - bulge; x < 12 + bulge; x++) { let v = x < 4 ? 4 : x > 9 ? 1 : 2 + (x % 3 === 0 ? -1 : 0); if (y === 5 || y === 12) v = -1; p.set(x, y, v < 0 ? IRON[x < 5 ? 4 : 2] : WOOD[v]); } } p.ell(7, 3, 5, 2, WOOD[4]); p.ell(7, 3, 3.6, 1.2, WOOD[3]); p.outline(OUTL); return { c: p.canvas(), ax: 7, ay: 15 }; }
function genCrate() { const p = new Pix(16, 16); p.rect(1, 5, 14, 10, WOOD[2]); p.rect(1, 1, 14, 4, WOOD[4]); p.hl(1, 4, 14, WOOD[3]); for (const y of [5, 14]) p.hl(1, y, 14, WOOD[1]); p.vl(1, 5, 10, WOOD[3]); p.vl(14, 5, 10, WOOD[1]); p.line(2, 6, 13, 13, WOOD[1]); p.line(2, 7, 12, 13, WOOD[3]); p.hl(2, 2, 12, WOOD[5]); p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 15 }; }
function genSack() { const p = new Pix(12, 12); p.ball(6, 7, 5, 4.5, pal(['#6a5a3a', '#8a7650', '#a8946a', '#c4b088'])); p.rect(5, 1, 3, 3, C('#8a7650')); p.hl(4, 3, 5, C('#5a4a2a')); p.outline(OUTL); return { c: p.canvas(), ax: 6, ay: 11 }; }
function genSign() { const p = new Pix(22, 26); woodPost(p, 9, 4, 25, 3); const bd = (y, dir) => { p.rect(2, y, 18, 5, WOOD[3]); p.hl(2, y, 18, WOOD[5]); p.hl(2, y + 4, 18, WOOD[1]); if (dir > 0) { p.set(20, y + 1, WOOD[3]); p.set(20, y + 2, WOOD[3]); p.set(20, y + 3, WOOD[2]); p.set(21, y + 2, WOOD[2]); } else { p.set(1, y + 1, WOOD[3]); p.set(1, y + 2, WOOD[3]); p.set(1, y + 3, WOOD[2]); p.set(0, y + 2, WOOD[2]); } p.hl(5, y + 2, 12, WOOD[1]); }; bd(4, 1); bd(11, -1); p.outline(OUTL); return { c: p.canvas(), ax: 10, ay: 25 }; }
function genWaystone(f) {
  const p = new Pix(22, 40), S = pal(['#1e2232', '#2e3448', '#424a62', '#5a647e', '#7a86a0', '#a4b0c8']);
  p.rect(2, 33, 18, 6, S[2]); p.hl(2, 33, 18, S[4]); p.hl(2, 38, 18, S[1]);
  p.poly([[6, 34], [16, 34], [15, 8], [11, 2], [7, 8]], S[3]); p.poly([[11, 3], [15, 8], [16, 34], [12, 34]], S[2]); p.vl(7, 9, 24, S[4]);
  const g = f ? C('#8ff8ff') : C('#4ad8f0'), gd = C('#2a90b8'); [[10, 12], [11, 13], [10, 14], [12, 17], [11, 18], [10, 19], [11, 20], [10, 24], [12, 25], [11, 26], [10, 27], [11, 9]].forEach(([x, y]) => p.set(x, y, g)); p.set(12, 12, gd); p.set(9, 20, gd);
  p.outline(OUTL); return { c: p.canvas(), ax: 11, ay: 38, light: [11, 18] };
}
function genFountain(f) {
  const W = 44, H = 36, p = new Pix(W, H), S = STONEW;
  p.ell(22, 26, 20, 8, S[2]); p.ell(22, 25, 20, 8, S[4]); p.ell(22, 25, 17, 6.2, S[1]); p.ell(22, 25.5, 16, 5.5, C('#2a6aa8')); p.ell(22, 25.5, 13, 4, C('#3a86c4'));
  for (let x = 2; x < 42; x++) for (let y = 26; y < 34; y++) { const dx = (x + 0.5 - 22) / 20, dy = (y + 0.5 - 26) / 8; if (dx * dx + dy * dy <= 1 && y >= 26 + Math.sqrt(Math.max(0, 1 - dx * dx)) * 8 - 3) p.set(x, y, S[x < 16 ? 3 : x > 30 ? 1 : 2]); }
  p.rect(20, 10, 5, 15, S[3]); p.vl(20, 10, 15, S[4]); p.vl(24, 10, 15, S[1]); p.ell(22, 10, 6, 2, S[4]); p.ell(22, 10, 4.5, 1.2, C('#3a86c4'));
  const wc = C('#bfe6ff'); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.45; const x = 22 + Math.cos(a) * 4, y = 7 + (f + k) % 3; p.set(Math.round(x), Math.round(y), wc); p.set(Math.round(22 + Math.cos(a) * 7), 11 + ((f + k) % 2), wc); }
  p.set(22, 4 + f % 2, C('#ffffff')); for (let k = 0; k < 5; k++) p.set(10 + k * 6 + f, 25 + (k % 2), C('#d8f4ff'));
  p.outline(OUTL); return { c: p.canvas(), ax: 22, ay: 33 };
}
function genWell() { const p = new Pix(26, 34), S = STONEP; p.ell(13, 27, 10, 5, S[2]); p.ell(13, 26, 10, 5, S[4]); p.ell(13, 26, 7, 3, C('#101820')); for (let x = 3; x < 24; x++) for (let y = 27; y < 32; y++) p.set(x, y, S[(x + Math.floor(y / 2) * 2) % 5 === 0 ? 1 : x < 9 ? 3 : 2]); woodPost(p, 3, 6, 27, 2); woodPost(p, 21, 6, 27, 2); p.poly([[0, 8], [13, 1], [26, 8], [24, 10], [13, 4], [2, 10]], C('#8a3426')); p.line(1, 8, 13, 2, C('#c05a42')); p.hl(5, 13, 17, WOOD[2]); p.vl(13, 13, 6, C('#7a6a50')); p.rect(11, 18, 5, 4, WOOD[3]); p.outline(OUTL); return { c: p.canvas(), ax: 13, ay: 32 }; }
function genStall(col) { const W = 44, H = 40, p = new Pix(W, H), cc = C(col); woodPost(p, 3, 8, 38, 2); woodPost(p, 39, 8, 38, 2); p.rect(2, 26, 40, 12, WOOD[2]); p.hl(2, 26, 40, WOOD[5]); p.hl(2, 27, 40, WOOD[4]); p.hl(2, 37, 40, WOOD[1]); for (let x = 4; x < 40; x += 6) p.vl(x, 28, 9, WOOD[1]);
  const goods = [C('#e04a3a'), C('#f0c040'), C('#7ac04a'), C('#e08a3a')]; for (let k = 0; k < 9; k++) { const x = 5 + k * 4; p.ball(x, 24, 2, 2, [uMul(goods[k % 4], 0.6), goods[k % 4], uMix(goods[k % 4], C('#fff'), 0.4)]); }
  for (let y = 4; y < 14; y++) for (let x = 0; x < W; x++) { const st = Math.floor(x / 5) % 2; let c = st ? cc : C('#f0e8d8'); if (y > 11) c = uMul(c, 0.8); if (y === 13 && x % 5 === 2) continue; p.set(x, y, c); } p.hl(0, 4, W, uMix(cc, C('#fff'), 0.3)); p.outline(OUTL); return { c: p.canvas(), ax: 22, ay: 38 }; }
function genCart() { const p = new Pix(30, 22); p.rect(3, 7, 22, 7, WOOD[2]); p.hl(3, 7, 22, WOOD[4]); p.hl(3, 13, 22, WOOD[1]); for (let k = 0; k < 6; k++) p.ball(6 + k * 3.5, 6, 3, 2.5, pal(['#8a6a20', '#c0a040', '#e8d070'])); p.line(25, 11, 29, 14, WOOD[3]); for (const x of [8, 20]) { p.ell(x, 16, 4, 4, WOOD[1]); p.ell(x, 16, 3, 3, WOOD[3]); p.set(x, 16, IRON[2]); } p.outline(OUTL); return { c: p.canvas(), ax: 15, ay: 20 }; }
function genHay() { const p = new Pix(22, 18); p.ball(11, 10, 10, 7, pal(['#7a5a14', '#a8822a', '#cfa840', '#ead26a'])); for (let k = 0; k < 14; k++) p.set(2 + k * 1.4, 5 + (k * 5) % 9, C('#f4e090')); p.outline(OUTL); return { c: p.canvas(), ax: 11, ay: 17 }; }
function genBench() { const p = new Pix(22, 14); p.rect(1, 4, 20, 3, WOOD[4]); p.hl(1, 7, 20, WOOD[1]); woodPost(p, 3, 7, 12, 2); woodPost(p, 17, 7, 12, 2); p.rect(1, 0, 20, 2, WOOD[3]); p.outline(OUTL); return { c: p.canvas(), ax: 11, ay: 12 }; }
function genPot(col) { const p = new Pix(12, 14); p.poly([[2, 7], [10, 7], [9, 13], [3, 13]], C('#a0502e')); p.hl(2, 7, 9, C('#d07a4a')); p.vl(3, 8, 5, C('#c0683e')); const cc = C(col); p.ball(4, 5, 2, 2, LEAF.bush.slice(2)); p.ball(8, 4, 2.5, 2.5, LEAF.bush.slice(2)); p.set(4, 3, cc); p.set(8, 2, cc); p.set(6, 4, cc); p.set(9, 5, uMix(cc, C('#fff'), 0.4)); p.outline(OUTL); return { c: p.canvas(), ax: 6, ay: 13 }; }
function genStatue() { const p = new Pix(24, 46), S = STONEP; p.rect(3, 34, 18, 11, S[2]); p.hl(3, 34, 18, S[4]); p.vl(3, 34, 11, S[3]); p.vl(20, 34, 11, S[1]); p.ball(12, 9, 4, 4, S.slice(1)); p.rect(8, 13, 9, 12, S[3]); p.vl(8, 13, 12, S[4]); p.vl(16, 13, 12, S[1]); p.rect(9, 25, 3, 9, S[3]); p.rect(13, 25, 3, 9, S[2]); p.line(18, 4, 18, 30, S[5]); p.line(19, 4, 19, 30, S[2]); p.hl(16, 22, 5, S[3]); p.poly([[3, 15], [8, 14], [8, 26], [4, 24]], S[2]); p.outline(OUTL); return { c: p.canvas(), ax: 12, ay: 44 }; }
function genRail(o, f) {
  if (o === 'h') { const p = new Pix(16, 14); woodPost(p, 0, 3, 13, 2); const rope = C('#c8a870'), rs = C('#8a6a40'); for (let x = 0; x < 16; x++) { const y = 5 + Math.round(Math.sin((x / 16) * Math.PI) * 2); p.set(x, y, rope); p.set(x, y + 1, rs); } p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 13 }; }
  const p = new Pix(6, 22); woodPost(p, 2, 0, 12, 2); const rope = C('#c8a870'); for (let y = 2; y < 20; y++) p.set(1 + (y > 8 && y < 16 ? 1 : 0), y, rope); p.outline(OUTL); return { c: p.canvas(), ax: 3, ay: 14 };
}
function genCampfire(f) { const p = new Pix(18, 22); for (let k = 0; k < 3; k++) p.line(3 + k * 2, 19 - k, 15 - k * 2, 16 + k, WOOD[2 + k % 2]); p.ell(9, 19, 6, 2.2, STONEP[2]); for (let k = 0; k < 6; k++) { const x = 5 + k * 1.6, hgt = 6 + ((k * 5 + f * 3) % 6); for (let y = 0; y < hgt; y++) p.set(Math.round(x + Math.sin((y + f) * 0.8) * 0.8), 17 - y, y < 2 ? C('#fff2a0') : y < hgt * 0.5 ? C('#ffb02a') : C('#e8501a')); } p.outline(C('#3a1608')); return { c: p.canvas(), ax: 9, ay: 20, light: [9, 12] }; }
function genTent(col) { const W = 36, H = 30, p = new Pix(W, H), cc = C(col), cd = uMul(cc, 0.65), cl = uMix(cc, C('#fff'), 0.2); p.poly([[2, 28], [18, 3], [34, 28]], cc); p.poly([[18, 3], [34, 28], [22, 28]], cd); p.poly([[14, 28], [18, 12], [22, 28]], C('#1a1010')); p.line(18, 3, 2, 28, cl); woodPost(p, 17, 0, 4, 2); for (let k = 0; k < 4; k++) p.line(6 + k * 7, 26 - k, 9 + k * 7, 18 - k, cd); p.outline(OUTL); return { c: p.canvas(), ax: 18, ay: 28 }; }
function genTotem() { const p = new Pix(16, 36); woodPost(p, 6, 10, 34, 4); for (let k = 0; k < 3; k++) { const y = 12 + k * 7; p.rect(5, y, 6, 5, WOOD[3 - (k % 2)]); p.set(6, y + 1, C('#c0302a')); p.set(9, y + 1, C('#c0302a')); p.hl(6, y + 3, 4, WOOD[0]); } p.ball(8, 6, 4.5, 4, pal(['#8a8270', '#c8c0a8', '#ece4d0'])); p.set(6, 6, OUTL); p.set(10, 6, OUTL); p.hl(6, 9, 5, C('#5a5040')); p.line(3, 2, 1, 0, C('#ece4d0')); p.line(13, 2, 15, 0, C('#ece4d0')); p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 34 }; }
function genCactus(v) { const p = new Pix(20, 30), G_ = pal(['#1a3a14', '#2a5a1e', '#3e7a2a', '#5a9a38', '#8ac05a']); const h = 22 + v * 2; for (let y = 30 - h; y < 29; y++) for (let x = 7; x < 13; x++) { const i = x - 7; p.set(x, y, G_[i === 0 ? 1 : i === 5 ? 1 : i === 1 ? 4 : (x + y) % 3 === 0 ? 2 : 3]); } p.ell(10, 30 - h, 3, 1.6, G_[3]);
  const arm = (sx, y0, len) => { for (let k = 0; k < 4; k++) p.rect(sx > 0 ? 13 + k : 3 + k, y0, 1, 3, G_[2 + (k % 2)]); for (let y = y0 - len; y < y0 + 2; y++) for (let i = 0; i < 4; i++) p.set((sx > 0 ? 15 : 2) + i, y, G_[i === 0 ? 4 : i === 3 ? 1 : 3]); };
  arm(1, 14 + v, 6 + v); if (v !== 1) arm(-1, 18 - v, 5); for (let k = 0; k < 10; k++) p.set(8 + (k % 3) * 2, 30 - h + 3 + k * 2, C('#e8e0b0')); if (v === 2) { p.set(10, 30 - h - 1, C('#ff6aa0')); p.set(9, 30 - h - 2, C('#ffb0d0')); }
  p.outline(OUTL); return { c: p.canvas(), ax: 10, ay: 28 }; }
function genObelisk() { const p = new Pix(18, 44), S = pal(['#4a3218', '#6e4c26', '#946a38', '#b88a4e', '#d8ac6c']); for (let y = 6; y < 42; y++) { const half = Math.round(lerp(3, 6, (y - 6) / 36)); for (let x = 9 - half; x < 9 + half; x++) p.set(x, y, S[x < 9 - half + 2 ? 4 : x > 9 + half - 3 ? 1 : 3]); } p.poly([[6, 6], [12, 6], [9, 0]], S[4]); for (let k = 0; k < 5; k++) p.hl(7, 12 + k * 6, 4, S[0]); p.set(9, 14, C('#5ae0ff')); p.outline(OUTL); return { c: p.canvas(), ax: 9, ay: 42 }; }
function genBones() { const p = new Pix(18, 10), b = C('#e8e0c8'), bs = C('#a8a088'); p.ball(5, 4, 3, 3, [bs, b, C('#fff')]); p.set(4, 4, OUTL); p.set(6, 4, OUTL); p.line(9, 7, 16, 5, b); p.line(9, 8, 16, 6, bs); p.set(9, 6, b); p.set(16, 4, b); p.outline(OUTL); return { c: p.canvas(), ax: 9, ay: 9 }; }
function genPillar(broken, ivy, v) {
  const R = rngFor('pil', v), W = 18, H = 46, p = new Pix(W, H), S = STONEW;
  const top = broken ? R.int(14, 24) : 6;
  for (let y = top; y < 40; y++) for (let x = 4; x < 14; x++) { let c = x < 6 ? S[4] : x > 11 ? S[1] : (x - 4) % 3 === 0 ? S[2] : S[3]; if (broken && y < top + 2 && hash2(x, 1, v) < 0.5) continue; p.set(x, y, c); }
  p.rect(2, 40, 14, 5, S[2]); p.hl(2, 40, 14, S[4]); p.hl(2, 44, 14, S[1]);
  if (!broken) { p.rect(2, 2, 14, 4, S[3]); p.hl(2, 2, 14, S[5]); p.hl(2, 5, 14, S[1]); }
  if (ivy) for (let k = 0; k < 26; k++) { const x = R.int(3, 14), y = R.int(top, 42); if (uA(p.get(x, y))) p.set(x, y, LEAF.roble[R.int(2, 5)]); }
  p.outline(OUTL); return { c: p.canvas(), ax: 9, ay: 44 };
}
function genArch(v) {
  const W = 60, H = 62, p = new Pix(W, H), S = STONEW, R = rngFor('arch', v);
  for (const px0 of [4, 44]) { for (let y = 18; y < 56; y++) for (let x = px0; x < px0 + 12; x++) p.set(x, y, x === px0 ? S[4] : x === px0 + 11 ? S[1] : ((y >> 2) + (x >> 2)) % 3 === 0 ? S[2] : S[3]); for (let y = 18; y < 56; y += 6) p.hl(px0, y, 12, S[1]); p.rect(px0 - 1, 54, 14, 5, S[2]); p.hl(px0 - 1, 54, 14, S[4]); }
  for (let a = 0; a <= 180; a += 1) { const r0 = 18, r1 = 27; for (let r = r0; r <= r1; r++) { const x = 30 + Math.cos(a * Math.PI / 180) * r, y = 22 - Math.sin(a * Math.PI / 180) * r; const blk = Math.floor(a / 15) % 2; p.set(Math.round(x), Math.round(y), r === r1 ? S[4] : r === r0 ? S[1] : (a % 15 < 1.5) ? S[0] : blk ? S[3] : S[2]); } }
  if (R.f() < 0.6) for (let x = 20; x < 40; x++) for (let y = 0; y < 8; y++) if (hash2(x, y, v) < 0.6) p.set(x, y, 0);
  for (let k = 0; k < 60; k++) { const x = R.int(2, W - 3), y = R.int(0, 50); if (uA(p.get(x, y))) { p.set(x, y, LEAF.roble[R.int(2, 5)]); if (R.f() < 0.4) for (let j = 1; j < R.int(2, 7); j++) p.set(x, y + j, LEAF.roble[R.int(2, 4)]); } }
  p.outline(OUTL); return { c: p.canvas(), ax: 30, ay: 58 };
}
function genRuinWall(v) { const W = 40, H = 30, p = new Pix(W, H), S = STONEW, R = rngFor('rw', v); const tops = []; let t = R.int(4, 10); for (let x = 0; x < W; x++) { if (x % 4 === 0) t = clamp(t + R.int(-3, 3), 2, 16); tops.push(t); }
  for (let x = 2; x < W - 2; x++) for (let y = tops[x]; y < 28; y++) { const row = Math.floor(y / 5), off = (row % 2) * 4; let c = (y % 5 === 4 || (x + off) % 8 === 0) ? S[1] : ((x + off) >> 3) % 2 ? S[3] : S[2]; if (y === tops[x]) c = S[5]; p.set(x, y, c); }
  for (let k = 0; k < 40; k++) { const x = R.int(2, W - 3), y = R.int(2, 27); if (uA(p.get(x, y)) && R.f() < 0.7) p.set(x, y, LEAF.roble[R.int(2, 5)]); }
  p.outline(OUTL); return { c: p.canvas(), ax: 20, ay: 28 }; }
function genGrave(v) { const p = new Pix(12, 16), S = STONEP; p.rect(2, 4, 8, 11, S[3]); p.ell(6, 4, 4, 3, S[3]); p.vl(2, 3, 12, S[4]); p.vl(9, 3, 12, S[1]); p.hl(4, 7, 4, S[1]); p.vl(6, 5, 6, S[1]); p.outline(OUTL); return { c: p.canvas(), ax: 6, ay: 15 }; }
function genCrystal(v) { const p = new Pix(22, 28), R = rngFor('cry', v), P = pal(['#1e4a7a', '#3a7ac0', '#6ab4ec', '#a8e0ff', '#ffffff']); for (let k = 0; k < 4; k++) { const x = 5 + k * 4 + R.int(-1, 1), hgt = R.int(10, 24), w = 3; for (let y = 27 - hgt; y < 27; y++) for (let i = 0; i < w; i++) p.set(x + i, y, P[i === 0 ? 3 : i === w - 1 ? 1 : 2]); p.set(x + 1, 26 - hgt, P[4]); p.set(x, 27 - hgt, P[4]); } p.outline(C('#0a1a30')); return { c: p.canvas(), ax: 11, ay: 27, light: [11, 14] }; }
function genObsidian(v) { const p = new Pix(18, 26), R = rngFor('obs', v), P = pal(['#0c0810', '#1c1424', '#2e2238', '#46365a', '#6a5888']); for (let k = 0; k < 3; k++) { const x = 4 + k * 4, hgt = R.int(10, 22); p.poly([[x, 25], [x + 2, 25 - hgt], [x + 5, 25]], P[2]); p.line(x + 1, 24, x + 2, 26 - hgt, P[4]); } for (let k = 0; k < 4; k++) p.set(R.int(4, 14), R.int(16, 24), C('#ff6a2a')); p.outline(OUTL); return { c: p.canvas(), ax: 9, ay: 25 }; }
function genPortal(f) { const W = 52, H = 60, p = new Pix(W, H), S = pal(['#141018', '#241e2c', '#3a3044', '#544660', '#7a6888']); p.ell(26, 30, 22, 27, S[2]); p.ell(26, 30, 15, 21, 0); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const dx = (x - 26) / 15, dy = (y - 30) / 21, d = dx * dx + dy * dy; if (d < 1) { const a = Math.atan2(dy, dx) + d * 5 + f * 0.8; const v = (Math.sin(a * 3) * 0.5 + 0.5) * (1 - d); p.set(x, y, uMix(C('#1a0628'), C('#c050ff'), clamp(v * 1.3, 0, 1))); } }
  for (let a = 0; a < 360; a += 30) { const x = 26 + Math.cos(a * Math.PI / 180) * 19, y = 30 + Math.sin(a * Math.PI / 180) * 24; p.rect(Math.round(x) - 1, Math.round(y) - 1, 3, 3, C('#ff40a0')); } p.rect(8, 54, 36, 5, S[3]); p.hl(8, 54, 36, S[4]); p.outline(OUTL); return { c: p.canvas(), ax: 26, ay: 58, light: [26, 30] }; }
function genAnvil() { const p = new Pix(18, 12); p.rect(2, 1, 14, 4, IRON[3]); p.hl(2, 1, 14, IRON[5]); p.poly([[14, 1], [18, 2], [16, 4], [14, 4]], IRON[3]); p.rect(6, 5, 6, 3, IRON[2]); p.rect(4, 8, 10, 3, IRON[1]); p.outline(OUTL); return { c: p.canvas(), ax: 9, ay: 11 }; }
function genForge(f) { const p = new Pix(28, 30), B = pal(['#3a1a14', '#5a2a1e', '#7a3a28', '#9a4e34', '#b86844']); for (let y = 6; y < 29; y++) for (let x = 2; x < 26; x++) p.set(x, y, B[(y % 4 === 3 || (x + (Math.floor(y / 4) % 2) * 3) % 6 === 0) ? 0 : x < 6 ? 3 : 2]); p.rect(7, 16, 14, 9, C('#1a0a06')); for (let k = 0; k < 10; k++) p.set(8 + k * 1.3, 24 - ((k * 3 + f) % 5), k % 2 ? C('#ff9a2a') : C('#ffd84a')); p.rect(8, 22, 12, 3, C('#e8501a')); p.rect(10, 0, 8, 6, B[1]); p.outline(OUTL); return { c: p.canvas(), ax: 14, ay: 29, light: [14, 20] }; }
function genNets() { const p = new Pix(26, 22); woodPost(p, 2, 2, 21, 2); woodPost(p, 22, 2, 21, 2); p.hl(2, 3, 22, WOOD[3]); for (let x = 4; x < 22; x++) for (let y = 4; y < 17; y++) if ((x + y) % 3 === 0 || (x - y) % 3 === 0) p.set(x, y, C('#c8b890')); p.outline(OUTL); return { c: p.canvas(), ax: 13, ay: 21 }; }
function genMineEntrance() { const p = new Pix(44, 36), S = STONEW; p.ball(22, 20, 21, 16, S); p.ell(22, 24, 9, 11, C('#0a0806')); p.rect(13, 22, 18, 14, C('#0a0806')); woodPost(p, 12, 14, 35, 3); woodPost(p, 29, 14, 35, 3); p.rect(10, 12, 24, 3, WOOD[3]); p.hl(10, 12, 24, WOOD[5]); p.line(14, 35, 30, 35, IRON[2]); p.outline(OUTL); return { c: p.canvas(), ax: 22, ay: 35 }; }
function genReeds() { const p = new Pix(12, 16); for (let k = 0; k < 5; k++) { const x = 2 + k * 2; p.line(x, 15, x + (k % 2 ? 1 : -1), 3 + k % 3, LEAF.sauce[3 + k % 2]); if (k % 2 === 0) { p.vl(x, 2 + k % 3, 3, C('#6a4a2a')); } } p.outline(OUTL); return { c: p.canvas(), ax: 6, ay: 15 }; }
function genMushroom(v) { const p = new Pix(10, 10), col = v % 2 ? C('#c03a2a') : C('#b8823a'); p.rect(4, 5, 2, 4, C('#e8dcc0')); p.ell(5, 4, 4, 2.6, col); p.set(3, 3, C('#ffffff')); p.set(6, 2, C('#ffffff')); p.hl(2, 5, 7, uMul(col, 0.6)); p.outline(OUTL); return { c: p.canvas(), ax: 5, ay: 9 }; }
function genWitchHut() { const W = 56, H = 64, p = new Pix(W, H); for (const x of [10, 22, 34, 46]) woodPost(p, x, 40, 62, 3); p.rect(6, 24, 44, 18, WOOD[2]); for (let y = 24; y < 42; y += 4) p.hl(6, y, 44, WOOD[1]); p.vl(6, 24, 18, WOOD[4]); p.rect(24, 30, 8, 12, C('#140c08')); p.rect(38, 28, 7, 6, C('#7aff6a')); p.rect(39, 29, 5, 4, C('#c8ffb0')); p.poly([[2, 26], [28, 4], [54, 26]], C('#3a3a1e')); p.poly([[28, 4], [54, 26], [40, 26]], C('#2a2a14')); for (let k = 0; k < 20; k++) p.set(6 + k * 2, 25 - (k % 3), C('#5a5a2e')); p.rect(36, 6, 5, 10, STONEP[2]); p.outline(OUTL); return { c: p.canvas(), ax: 28, ay: 62, light: [41, 31] }; }
function genBoat() {
  const W = 92, H = 84, p = new Pix(W, H);
  p.poly([[6, 58], [86, 58], [78, 76], [16, 76]], WOOD[2]); p.hl(6, 58, 80, WOOD[5]); p.hl(8, 60, 76, WOOD[4]); for (let y = 63; y < 76; y += 4) p.hl(12, y, 70, WOOD[1]); p.hl(16, 75, 62, WOOD[0]); for (let k = 0; k < 5; k++) p.ell(26 + k * 10, 67, 1.6, 1.6, C('#2a1a10'));
  woodPost(p, 45, 6, 58, 3); woodPost(p, 26, 22, 58, 2);
  p.poly([[48, 8], [74, 14], [72, 48], [48, 46]], C('#ece4d2')); p.poly([[48, 8], [56, 10], [56, 46], [48, 46]], C('#d4ccba')); for (let y = 12; y < 46; y += 8) p.hl(48, y, 24, C('#c4bca8'));
  p.poly([[28, 22], [42, 26], [42, 50], [28, 50]], C('#ece4d2')); p.ell(62, 28, 5, 5, C('#a0202a')); p.vl(62, 24, 9, C('#ece4d2')); p.hl(58, 28, 9, C('#ece4d2'));
  p.line(46, 6, 88, 58, C('#8a7650')); p.line(45, 6, 6, 58, C('#8a7650')); p.rect(44, 2, 8, 4, C('#a0202a'));
  p.outline(OUTL); return { c: p.canvas(), ax: 46, ay: 76 };
}
function genLighthouse(f) { const W = 34, H = 96, p = new Pix(W, H); for (let y = 24; y < 92; y++) { const t = (y - 24) / 68, hw = lerp(7, 12, t); for (let x = Math.round(17 - hw); x < Math.round(17 + hw); x++) { const band = Math.floor((y - 24) / 12) % 2; let c = band ? C('#c0302a') : C('#ece4d8'); if (x < 17 - hw + 2) c = uMix(c, C('#fff'), 0.25); if (x > 17 + hw - 3) c = uMul(c, 0.75); p.set(x, y, c); } } p.rect(8, 14, 18, 10, C('#2a2a30')); p.rect(10, 15, 14, 8, f ? C('#fff2a0') : C('#ffd060')); p.vl(17, 15, 8, C('#2a2a30')); p.poly([[6, 14], [17, 4], [28, 14]], C('#a0202a')); p.rect(5, 23, 24, 2, C('#2a2a30')); p.rect(13, 80, 8, 12, C('#3a2a1e')); p.rect(4, 90, 26, 5, STONEP[2]); p.outline(OUTL); return { c: p.canvas(), ax: 17, ay: 94, light: [17, 19] }; }
function genDecor(kind, v) { // small baked decor (no outline-heavy)
  const p = new Pix(10, 10), R = rngFor(kind, v);
  if (kind === 'fw' || kind === 'fy' || kind === 'fp' || kind === 'fr' || kind === 'fb') { const col = { fw: ['#ffffff', '#d8e0f0'], fy: ['#ffe060', '#e0a020'], fp: ['#e070d0', '#a040a0'], fr: ['#ff5050', '#b02020'], fb: ['#80b0ff', '#4060c0'] }[kind]; const n = R.int(3, 5); for (let k = 0; k < n; k++) { const x = R.int(1, 8), y = R.int(2, 8); p.set(x, y + 1, LEAF.roble[2]); p.set(x, y, C(col[0])); p.set(x + 1, y, C(col[1])); p.set(x, y - 1, C(col[1])); } }
  else if (kind === 'tuft') { for (let k = 0; k < 4; k++) { const x = 3 + k * 1.5; p.line(5, 9, x, 3 + (k % 2) * 2, LEAF.roble[4 - (k % 2)]); } p.set(5, 9, LEAF.roble[1]); }
  else if (kind === 'gtuft') { for (let k = 0; k < 4; k++) { const x = 2 + k * 2; p.line(5, 9, x, 1 + (k % 2) * 2, C(k % 2 ? '#d8c860' : '#f0e08a')); } }
  else if (kind === 'peb') { p.ell(4, 6, 2.5, 1.8, STONEP[3]); p.set(3, 5, STONEP[5]); p.ell(7, 8, 1.5, 1, STONEP[2]); }
  else if (kind === 'shell') { p.ell(5, 6, 2, 1.5, C('#f8e8e0')); p.set(5, 5, C('#e0b0a0')); }
  else if (kind === 'fern') { for (let k = 0; k < 5; k++) { const a = -Math.PI * (0.15 + k * 0.17); p.line(5, 9, 5 + Math.cos(a) * 5, 9 + Math.sin(a) * 6, LEAF.pino[4 - (k % 2)]); } }
  else if (kind === 'ember') { p.set(3, 4, C('#ff6a1a')); p.set(4, 4, C('#ffb040')); p.set(6, 6, C('#ff6a1a')); p.line(2, 5, 7, 7, C('#1a1210')); }
  else if (kind === 'lily') { p.ell(5, 5, 3.5, 2.4, C('#3a7a3a')); p.set(5, 5, 0); p.set(6, 4, 0); p.set(4, 4, C('#5aa04a')); if (v % 3 === 0) { p.set(5, 3, C('#ffd0e8')); p.set(6, 3, C('#ff90c0')); } }
  else if (kind === 'snowpeb') { p.ell(4, 6, 2.5, 1.8, C('#9aaac0')); p.hl(3, 5, 3, C('#ffffff')); }
  else if (kind === 'crop') { for (let k = 0; k < 3; k++) { p.line(2 + k * 3, 9, 2 + k * 3, 3, C('#6a9a2a')); p.set(2 + k * 3, 2, C('#e8c840')); p.set(3 + k * 3, 3, C('#c8a830')); } }
  else if (kind === 'cabbage') { p.ball(5, 6, 3.5, 3, LEAF.abedul.slice(1)); }
  return p.canvas();
}
