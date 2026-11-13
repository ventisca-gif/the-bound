// ================= MONSTER ART =================
const SLIMEC = { green: ['#1e5a1a', '#3a9a2a', '#6ad04a', '#b8f890'], blue: ['#163a7a', '#2a6ad0', '#5aa0f8', '#c0e4ff'], red: ['#6a1408', '#c03010', '#ff7020', '#ffd080'], purple: ['#3a145a', '#7a2ab0', '#b060e8', '#e8c0ff'], ice: ['#3a6a8a', '#7ac0e0', '#b8ecff', '#ffffff'], gold: ['#6a4a08', '#c09018', '#f8d040', '#fff8c0'], dark: ['#140c1e', '#2e1e44', '#4e3870', '#8a70b0'] };
const MOBANIM = { idle: [0, 2], walk: [2, 4], atk: [6, 3], hurt: [9, 1] };
function mobAtlas(fw, fh, drawFn, nfr = 10) {
  const atlas = mkCanvas(fw * nfr, fh * 4), ax = atlas.getContext('2d');
  DIRS.forEach((dir, di) => { for (const a in MOBANIM) for (let f = 0; f < MOBANIM[a][1]; f++) { const p = new Pix(fw, fh); const d = dir === 'right' ? 'left' : dir; drawFn(p, d, a, f); if (dir === 'right') p.flipX(); p.outline(OUTL); p.toCtx(ax, (MOBANIM[a][0] + f) * fw, di * fh); } });
  const idx = {}; for (const a in MOBANIM) idx[a] = MOBANIM[a][0];
  return { img: atlas, fw, fh, idx, ax: fw >> 1, ay: fh - 3 };
}
function genSlime(color, scale = 1, crown = false) {
  const P = pal(SLIMEC[color] || SLIMEC.green), fw = Math.round(28 * scale), fh = Math.round(26 * scale);
  return mobAtlas(fw, fh, (p, dir, a, f) => {
    let sq = 0, lift = 0;
    if (a === 'idle') sq = f ? 0.12 : -0.05; if (a === 'walk') { sq = [0.2, -0.2, -0.1, 0.15][f]; lift = [0, 4, 3, 0][f]; }
    if (a === 'atk') { sq = [0.3, -0.35, 0][f]; lift = [0, 6, 1][f]; } if (a === 'hurt') sq = 0.35;
    const w = 13 * scale * (1 + sq * 0.5), h = 10.5 * scale * (1 - sq * 0.5), cx = fw / 2, by = fh - 3 - lift * scale;
    for (let y = Math.floor(by - h * 2); y <= by; y++) for (let x = Math.floor(cx - w); x <= Math.ceil(cx + w); x++) {
      const dx = (x + 0.5 - cx) / w, dy = (y + 0.5 - by) / (h * 2); if (dy > 0) continue; const r = dx * dx + Math.pow(Math.abs(dy) * 1.0, 1.6) * 1.0; if (r > 1 || dy < -1) continue;
      let l = 0.45 - dx * 0.3 + (-dy) * 0.35 - r * 0.15; if (y > by - 2) l -= 0.25; p.set(x, y, P[clamp(Math.floor(l * 4), 0, 3)]);
    }
    // highlight
    p.set(Math.round(cx - w * 0.45), Math.round(by - h * 1.45), C('#ffffff')); p.set(Math.round(cx - w * 0.45) + 1, Math.round(by - h * 1.45), uMix(P[3], C('#fff'), 0.5)); p.set(Math.round(cx - w * 0.45), Math.round(by - h * 1.45) + 1, uMix(P[3], C('#fff'), 0.5));
    if (dir !== 'up') { const ey = Math.round(by - h * 0.95), off = dir === 'left' ? -Math.round(w * 0.35) : 0, es = Math.max(1, Math.round(scale)); const eyesX = dir === 'left' ? [cx + off - 2 * es] : [cx - 4 * es, cx + 2 * es];
      for (const ex of eyesX) { if (a === 'hurt') { p.set(Math.round(ex), ey, C('#140a10')); p.set(Math.round(ex) + 1, ey + 1, C('#140a10')); continue; } p.rect(Math.round(ex), ey, 2 * es, 3 * es, C('#140a10')); p.set(Math.round(ex), ey, C('#ffffff')); }
      if (a === 'atk') p.rect(Math.round(cx - 2 + off * 0.5), ey + 4 * es, 3 * es, 2, C('#3a0a14')); }
    if (crown) { const cyy = Math.round(by - h * 2) - 2; const g = GOLD; p.rect(Math.round(cx - 6 * scale / 2), cyy, Math.round(6 * scale), 3, g[3]); for (let k = 0; k < 4; k++) { const x = Math.round(cx - 3 * scale + k * 2 * scale); p.vl(x, cyy - 3, 3, g[4]); p.set(x, cyy - 4, g[5]); } p.set(Math.round(cx), cyy + 1, C('#e02040')); }
  });
}
function genQuad(kind) {
  const PAL = { lobo: ['#2a2a32', '#4a4a58', '#6e6e7e', '#9898a8', '#c8c8d4'], lobohielo: ['#4a6a8a', '#8aaccc', '#b8d4ec', '#e0eefa', '#ffffff'], jabali: ['#2a1a10', '#4a3020', '#6e4a30', '#946a46', '#b88c62'], oso: ['#22150c', '#3e2816', '#5c3c22', '#7c5432', '#9c6e44'], sombra: ['#100818', '#20142e', '#342248', '#4c3466', '#6e5090'], ...QUADX }[kind];
  const P = pal(PAL), big = QSCALE[kind] || (kind === 'oso' ? 1.35 : 1), fw = Math.round(44 * big), fh = Math.round(36 * big), eyeC = kind === 'sombra' || kind === 'vacio' ? C('#ff3a6a') : kind === 'lobohielo' || kind === 'ciervo' ? C('#3ad0ff') : C('#ffd030');
  return mobAtlas(fw, fh, (p, dir, a, f) => {
    const cx = fw / 2, base = fh - 3, s = big; let lunge = a === 'atk' ? [0, 4, 1][f] : 0, bob = a === 'walk' ? (f % 2) : a === 'idle' ? f : 0;
    const leg = (x, y0, len, ph, back) => { const lift = ph > 0 ? 1 : 0; for (let y = y0; y < y0 + len - lift; y++) p.set(Math.round(x + ph), y, P[back ? 1 : 2]); p.set(Math.round(x + ph), y0 + len - lift - 1, P[0]); };
    if (dir === 'left') {
      const bx = cx + 2 - lunge, by = base - 9 * s + bob * 0.5; const ph = a === 'walk' ? [2, 0, -2, 0][f] : 0;
      leg(bx + 6 * s, by + 3, 7 * s, -ph, true); leg(bx - 6 * s, by + 3, 7 * s, ph, true);
      p.ball(bx, by, 11 * s, 5.5 * s, P.slice(1)); if (kind === 'jabali' || kind === 'jabali_rey') for (let x = -8; x < 6; x++) p.set(Math.round(bx + x * s), Math.round(by - 5 * s), P[0]);
      for (let k = 0; k < 6; k++) p.set(Math.round(bx + 10 * s + k * 0.7), Math.round(by - 3 + k * 0.6 - (kind === 'jabali' || kind === 'jabali_rey' ? 0 : 2)), P[k < 3 ? 2 : 3]);
      leg(bx + 7 * s, by + 3, 7 * s, ph, false); leg(bx - 5 * s, by + 3, 7 * s, -ph, false);
      const hx = bx - 11 * s, hy = by - 4 * s - (a === 'atk' && f === 1 ? 1 : 0); p.ball(hx, hy, 5.5 * s, 4.5 * s, P.slice(1));
      p.ball(hx - 5 * s, hy + 1.5 * s, 3.2 * s, 2.2 * s, P.slice(1)); p.set(Math.round(hx - 8 * s), Math.round(hy + 1 * s), P[0]);
      if (!kind.startsWith('jabali')) { p.poly([[hx + 0 * s, hy - 3 * s], [hx + 2 * s, hy - 8 * s], [hx + 4 * s, hy - 2 * s]], P[2]); p.set(Math.round(hx + 2 * s), Math.round(hy - 5 * s), P[4]); }
      else { p.set(Math.round(hx - 6 * s), Math.round(hy + 3 * s), C('#f0ead0')); p.set(Math.round(hx - 6 * s), Math.round(hy + 2 * s), C('#f0ead0')); p.poly([[hx + 1, hy - 3], [hx + 3, hy - 6], [hx + 4, hy - 2]], P[1]); }
      p.set(Math.round(hx - 2 * s), Math.round(hy - 1 * s), eyeC); if (a === 'atk' && f === 1) p.hl(Math.round(hx - 8 * s), Math.round(hy + 3 * s), Math.round(4 * s), C('#5a0a14'));
    } else {
      const fwd = dir === 'down', bx = cx, by = base - 9 * s + (fwd ? lunge * 0.5 : -lunge * 0.5) + bob * 0.5; const ph = a === 'walk' ? [1, 0, -1, 0][f] : 0;
      leg(bx - 6 * s, by + 2, 8 * s, 0, false); leg(bx + 5 * s, by + 2, 8 * s, 0, false);
      p.ball(bx, by, 8 * s, 6.5 * s, P.slice(1));
      leg(bx - 4 * s, by + 3 + ph, 7 * s, 0, false); leg(bx + 3 * s, by + 3 - ph, 7 * s, 0, false);
      if (fwd) { const hx = bx, hy = by - 3 * s + lunge; p.ball(hx, hy, 6 * s, 5 * s, P.slice(1)); p.ball(hx, hy + 3 * s, 3 * s, 2.5 * s, P.slice(1)); p.set(Math.round(hx), Math.round(hy + 2 * s), P[0]);
        if (!kind.startsWith('jabali')) { for (const sx of [-1, 1]) p.poly([[hx + sx * 2 * s, hy - 3 * s], [hx + sx * 5 * s, hy - 9 * s], [hx + sx * 6 * s, hy - 2 * s]], P[2]); } else { p.set(Math.round(hx - 3 * s), Math.round(hy + 4 * s), C('#f0ead0')); p.set(Math.round(hx + 3 * s), Math.round(hy + 4 * s), C('#f0ead0')); p.set(Math.round(hx - 3 * s), Math.round(hy + 3 * s), C('#f0ead0')); p.set(Math.round(hx + 3 * s), Math.round(hy + 3 * s), C('#f0ead0')); }
        p.set(Math.round(hx - 3 * s), Math.round(hy - 1), eyeC); p.set(Math.round(hx + 2 * s), Math.round(hy - 1), eyeC); if (a === 'atk' && f === 1) p.hl(Math.round(hx - 2 * s), Math.round(hy + 4 * s), Math.round(4 * s), C('#5a0a14')); }
      else { for (let k = 0; k < 6; k++) p.set(Math.round(bx + (k % 2)), Math.round(by + 4 * s + k), P[3]); p.ball(bx, by - 7 * s, 4.5 * s, 3.5 * s, P.slice(1)); for (const sx of [-1, 1]) p.poly([[bx + sx * 1 * s, by - 9 * s], [bx + sx * 4 * s, by - 14 * s], [bx + sx * 5 * s, by - 8 * s]], P[2]); }
    }
  });
}
function genBat(kind) {
  const BP = BATPAL[kind]; const P = pal(BP ? BP[0] : kind === 'fuego' ? ['#3a0a06', '#7a1a0a', '#c03a10', '#ff7a2a'] : ['#140c1c', '#2a1a3a', '#46305c', '#6a4e86']), eye = BP ? C(BP[1]) : kind === 'fuego' ? C('#ffe040') : C('#ff3050');
  return mobAtlas(32, 30, (p, dir, a, f) => {
    const cx = 16, cy = 12 + (a === 'idle' ? f : (f % 2)), flap = a === 'walk' || a === 'idle' ? [0, 1, 2, 1][f % 4] : a === 'atk' ? 2 : 0;
    p.ball(cx, cy, 4, 3.5, P.slice(1));
    for (const s of [-1, 1]) { const wy = [-5, -1, 3][flap]; p.poly([[cx + s * 3, cy - 1], [cx + s * 13, cy + wy], [cx + s * 11, cy + wy + 4], [cx + s * 8, cy + wy + 2], [cx + s * 6, cy + 3]], P[1]); p.line(cx + s * 3, cy - 1, cx + s * 13, cy + wy, P[2]); }
    p.poly([[cx - 3, cy - 2], [cx - 2, cy - 6], [cx - 1, cy - 2]], P[2]); p.poly([[cx + 1, cy - 2], [cx + 2, cy - 6], [cx + 3, cy - 2]], P[2]);
    if (dir !== 'up') { p.set(cx - 2, cy, eye); p.set(cx + 1, cy, eye); p.set(cx - 1, cy + 2, C('#ffffff')); p.set(cx + 1, cy + 2, C('#ffffff')); }
    p.ell(cx, 27, 4, 1.2, rgbU(0, 0, 0, 60));
  });
}
function genGhost(kind) {
  const P = pal(GHOSTPAL[kind] || (kind === 'fuego' ? ['#5a1a0a', '#c04a1a', '#ff8a3a', '#ffd08a'] : ['#3a4a6a', '#7a90b8', '#b0c8e8', '#e8f4ff']));
  return mobAtlas(30, 34, (p, dir, a, f) => {
    const cx = 15, cy = 13 + (a === 'idle' || a === 'walk' ? [0, 1, 2, 1][f % 4] : 0) - (a === 'atk' ? 2 : 0);
    for (let y = cy - 9; y < cy + 12; y++) for (let x = cx - 9; x <= cx + 9; x++) { const dx = (x + 0.5 - cx) / 8.5, dy = (y + 0.5 - cy) / 9; let ins = y < cy ? dx * dx + dy * dy <= 1 : Math.abs(dx) <= 1 - (y - cy) * 0.02; if (y > cy + 6) { const wv = Math.sin((x + f * 2) * 1.1) * 2; if (y > cy + 9 + wv) ins = false; } if (!ins) continue; let l = 0.6 - dx * 0.3 - dy * 0.2; p.set(x, y, uA(P[0]) ? (P[clamp(Math.floor(l * 4), 0, 3)] & 0x00ffffff | 0xd0000000) >>> 0 : 0); }
    if (dir !== 'up') { const off = dir === 'left' ? -3 : 0; p.rect(cx - 4 + off, cy - 2, 2, 3, C('#1a1030')); p.rect(cx + 2 + off, cy - 2, 2, 3, C('#1a1030')); p.ell(cx + off, cy + 4, 2, a === 'atk' ? 2.5 : 1.5, C('#1a1030')); }
    if (a === 'atk') for (const s of [-1, 1]) p.line(cx + s * 8, cy + 2, cx + s * 13, cy - 3, P[2]);
  });
}
function genMushroomMob(kind) {
  const cap = kind === 'veneno' ? ['#3a145a', '#7a2ab0', '#b060e8', '#e8c0ff'] : ['#5a0a0a', '#a01a1a', '#e03a2a', '#ff8a6a'];
  const P = pal(cap), stem = pal(['#8a7a5a', '#c8b890', '#ece0c0', '#fffaea']);
  return mobAtlas(28, 28, (p, dir, a, f) => {
    const cx = 14, hop = a === 'walk' ? [0, 2, 3, 1][f] : a === 'atk' ? [0, 3, 0][f] : 0, by = 25 - hop;
    p.ball(cx, by - 5, 5, 5.5, stem); if (dir !== 'up') { p.set(cx - 2, by - 5, C('#1a1010')); p.set(cx + 2, by - 5, C('#1a1010')); if (dir === 'left') { p.set(cx + 2, by - 5, stem[2]); p.set(cx - 3, by - 5, C('#1a1010')); } }
    p.ball(cx, by - 12, 10, 6, P); for (let k = 0; k < 5; k++) { const x = cx - 7 + k * 3.5, y = by - 14 + (k % 2) * 2; p.ell(x, y, 1.4, 1.1, C('#fff4e8')); }
    p.hl(cx - 9, by - 8, 18, P[0]); p.set(cx - 4, by, stem[1]); p.set(cx + 3, by, stem[1]);
  });
}
function genCrab(sc = 1) {
  const P = pal(sc > 1 ? ['#3a0a04', '#7a1a08', '#c03a14', '#f07a3a'] : ['#5a1408', '#a02a10', '#e04a20', '#ff8a5a']);
  return mobAtlas(Math.round(34 * sc), Math.round(26 * sc), (p0, dir, a, f) => {
    const p = sc > 1 ? new Pix(34, 26) : p0; const cx = 17, by = 21, sh = a === 'walk' ? [0, 1, 0, -1][f] : 0; p.ball(cx + sh, by - 5, 9, 5, P);
    for (const s of [-1, 1]) { for (let k = 0; k < 3; k++) p.line(cx + sh + s * (4 + k * 2), by - 3, cx + sh + s * (7 + k * 2), by + 2 - ((f + k) % 2), P[1]); const ca = a === 'atk' ? -3 : 0; p.ball(cx + sh + s * 12, by - 8 + ca, 3.5, 3, P); p.set(cx + sh + s * 13, by - 10 + ca, C('#2a0a04')); }
    if (dir !== 'up') { p.vl(cx + sh - 3, by - 12, 3, P[1]); p.vl(cx + sh + 2, by - 12, 3, P[1]); p.set(cx + sh - 3, by - 13, C('#101010')); p.set(cx + sh + 2, by - 13, C('#101010')); }
    if (sc > 1) { for (let y = 0; y < p0.h; y++) for (let x = 0; x < p0.w; x++) { const c = p.get(Math.floor(x / sc), Math.floor(y / sc)); if (c) p0.set(x, y, c); } if (dir !== 'up') { const gx = Math.round(17 * sc), gy = Math.round(4 * sc); p0.rect(gx - 5, gy, 11, 3, GOLD[3]); for (const k of [-5, -2, 1, 4]) p0.set(gx + k, gy - 1, GOLD[4]); } }
  });
}
function genTreant() {
  const fw = 88, fh = 96;
  return mobAtlas(fw, fh, (p, dir, a, f) => {
    const t = genTree('ancestral', 3); const sway = a === 'idle' || a === 'walk' ? (f % 2) : a === 'atk' ? [0, -3, 2][f] : 0;
    const cx = fw / 2, base = fh - 3;
    for (let k = 0; k < 4; k++) { const lx = cx - 14 + k * 9, ph = a === 'walk' ? ((k + f) % 2) * 2 : 0; for (let y = base - 14; y < base - ph; y++) for (let i = 0; i < 4; i++) p.set(lx + i + Math.round((y - base) * 0.1 * (k < 2 ? 1 : -1)), y, BARK.std[i === 0 ? 3 : 2]); }
    for (let y = base - 50; y < base - 10; y++) for (let x = cx - 10; x <= cx + 10; x++) { const i = x - (cx - 10); p.set(x, y, BARK.std[i < 3 ? 3 : i > 17 ? 1 : 2 + ((x * 3 + y) % 7 === 0 ? -1 : 0)]); }
    if (dir !== 'up') { const off = dir === 'left' ? -4 : 0; p.rect(cx - 7 + off, base - 38, 4, 3, C('#0a0806')); p.rect(cx + 3 + off, base - 38, 4, 3, C('#0a0806')); p.set(cx - 6 + off, base - 37, C('#ffd040')); p.set(cx + 4 + off, base - 37, C('#ffd040')); p.rect(cx - 4 + off, base - 30, 8, a === 'atk' ? 5 : 2, C('#0a0806')); }
    for (const s of [-1, 1]) { const ang = a === 'atk' ? [-0.4, -1.2, 0.8][f] * s : 0.3 * s; branch(p, cx + s * 9, base - 44, -Math.PI / 2 + s * 1.1 + ang, 18, 3, 2, BARK.std, rngFor('tb', 1), true); }
    const cp = new Pix(t.w, t.h); const ctx2 = t.canopy.getContext('2d'); const id = ctx2.getImageData(0, 0, t.w, t.h); cp.d = new Uint32Array(id.data.buffer.slice(0));
    for (let y = 0; y < 76; y++) for (let x = 0; x < t.w; x++) { const c = cp.get(x, y); if (uA(c) > 100) p.set(x - (t.w - fw) / 2 + sway, y - 8, c); }
  });
}
function genDragon() {
  const fw = 140, fh = 120, P = pal(['#2a0606', '#5a0e0a', '#8e1a10', '#c43a1c', '#f2763a']), B = pal(['#6a4a1a', '#a87a2a', '#e0b048', '#f8e08a']);
  return mobAtlas(fw, fh, (p, dir, a, f) => {
    const cx = fw / 2, base = fh - 6, flap = a === 'atk' ? 2 : [0, 1, 2, 1][f % 4], bob = [0, 2, 3, 2][f % 4] * (a === 'walk' || a === 'idle' ? 1 : 0);
    for (const s of [-1, 1]) { const wy = [-26, -16, -4][flap]; const pts = [[cx + s * 14, base - 60 + bob], [cx + s * 62, base - 64 + wy + bob], [cx + s * 66, base - 40 + wy * 0.5 + bob], [cx + s * 52, base - 34 + bob], [cx + s * 40, base - 40 + bob], [cx + s * 28, base - 30 + bob], [cx + s * 16, base - 36 + bob]]; p.poly(pts, P[1]); for (let k = 1; k < 4; k++) p.line(cx + s * 14, base - 60 + bob, pts[k][0], pts[k][1], P[3]); }
    for (let k = 0; k < 10; k++) p.ball(cx + Math.sin(k * 0.7 + f * 0.5) * 6 + (k * 3) * (dir === 'left' ? 1 : -1) * 0.2, base - 8 - k * 2 + 10, 7 - k * 0.5, 4, P.slice(1));
    p.ball(cx, base - 34 + bob, 20, 22, P.slice(1)); p.ball(cx, base - 26 + bob, 11, 15, B);
    for (let y = base - 46; y < base - 12; y += 4) p.hl(cx - 8, y + bob, 16, B[0]);
    for (const s of [-1, 1]) { p.ball(cx + s * 14, base - 8, 7, 7, P.slice(1)); for (let k = 0; k < 3; k++) p.set(cx + s * (10 + k * 4), base - 1, C('#f0ead0')); }
    const hy = base - 66 + bob + (a === 'atk' ? [0, 6, 3][f] : 0), hx = cx + (dir === 'left' ? -6 : 0);
    p.ball(hx, hy + 8, 7, 9, P.slice(1)); p.ball(hx, hy, 11, 9, P.slice(1)); p.ball(hx, hy + 7, 8, 5, P.slice(1));
    for (const s of [-1, 1]) { for (let k = 0; k < 9; k++) p.set(hx + s * (6 + k * 0.8), hy - 6 - k, B[2]); }
    if (dir !== 'up') { for (const s of [-1, 1]) { p.rect(hx + s * 5 - 1, hy - 2, 3, 2, C('#ffe040')); p.set(hx + s * 5, hy - 2, C('#ffffff')); } p.hl(hx - 6, hy + 9, 12, P[0]); if (a === 'atk') { p.rect(hx - 6, hy + 8, 12, 4, C('#3a0a04')); for (let k = 0; k < 5; k++) p.set(hx - 5 + k * 2.5, hy + 8, C('#ffffff')); } p.set(hx - 2, hy + 5, P[0]); p.set(hx + 2, hy + 5, P[0]); }
  }, 10);
}
// humanoid monsters via the paper-doll
const HLOOKS = {
  goblin: { body: 'small', skin: MSKIN.goblin, hair: null, eyes: 'dorado', ears: 'pointy', outfit: 'goblin', cloth: pal(['#2a1a0e', '#4a3018', '#6a4a26', '#8a6436', '#a87e48']), weapon: { k: 'club', tier: 0 }, blush: false },
  orco: { body: 'big', skin: MSKIN.orc, hair: HAIRS.negro, hairStyle: 'spiky', eyes: 'brillo', tusks: true, outfit: 'orc', cloth: pal(['#2a1a0e', '#4a3018', '#6a4a26', '#8a6436', '#a87e48']), armor: TIERP[3], weapon: { k: 'axe', tier: 3 }, blush: false },
  esqueleto: { body: 'normal', skin: MSKIN.bone, hair: null, eyes: 'brillo', outfit: 'skeleton', weapon: { k: 'sword', tier: 3 }, blush: false },
  bruja: { body: 'normal', skin: MSKIN.witch, hair: HAIRS.gris, hairStyle: 'long', eyes: 'verde', outfit: 'witch', main: pal(['#140c1e', '#24163a', '#3a2258', '#523278', '#6e4a9a']), sec: pal(['#0c2a14', '#1a4a24', '#2a7a3a', '#4aa85a', '#8ae08a']), hat: 'wizard', hatC: pal(['#140c1e', '#24163a', '#3a2258', '#523278', '#6e4a9a']), weapon: { k: 'staff', tier: 4, orb: ['#0a3a14', '#1a7a2a', '#3ac84a', '#9affa0', '#ffffff'] }, blush: false },
  yeti: { body: 'big', skin: MSKIN.fur, hair: HAIRS.blanco, hairStyle: 'spiky', eyes: 'hielo', outfit: 'orc', bare: true, cloth: pal(['#8a96aa', '#a8b4c8', '#c4ccd8', '#e8ecf2', '#ffffff']), weapon: null, blush: false, mono: true },
  golem: { body: 'big', skin: MSKIN.rock, hair: null, eyes: 'vacio', outfit: 'orc', bare: true, cloth: pal(['#3a3430', '#5f554b', '#7a6f62', '#968a7b', '#b0a494']), weapon: null, blush: false, mono: true },
  caballero: { body: 'normal', skin: MSKIN.dark, hair: null, eyes: 'brillo', outfit: 'darkknight', main: pal(['#0a080e', '#16121e', '#241e30', '#363046', '#4e4662']), sec: pal(['#2a0a3a', '#4a1468', '#6e2496', '#9a46c4', '#c88aee']), hat: 'helmet', hatC: pal(['#0a080e', '#16121e', '#241e30', '#363046', '#4e4662', '#6a6080']), cape: { out: pal(['#0a080e', '#160e20', '#24163a', '#341e52', '#46286a']), in: pal(['#2a0a3a', '#4a1468', '#6e2496', '#9a46c4', '#c88aee']) }, weapon: { k: 'sword', tier: 8 }, blush: false, mono: true },
  bandido: { body: 'normal', skin: SKINS[1], hair: HAIRS.castano, hairStyle: 'short', eyes: 'cafe', outfit: 'rogue', main: pal(['#2a1a10', '#3e2818', '#543822', '#6e4a2e', '#8a603c']), sec: pal(['#3a1010', '#5a1a1a', '#7a2a2a', '#9a3a3a', '#ba5050']), cloth: pal(['#1a1414', '#2a2020', '#3a2e2c', '#4e3e3a', '#66524c']), hat: 'bandana', mask: pal(['#2a0a0a', '#4a1414', '#6a2020', '#8a2a2a']), weapon: { k: 'dagger', tier: 3 } },
};
function bossLook(k) {
  if (k === 'gruk') return Object.assign({}, HLOOKS.orco, { body: 'huge', hat: 'horned', hatC: TIERP[3].concat([C('#c8ccd4')]), armor: TIERP[6], weapon: { k: 'bigaxe', tier: 6 }, cape: { out: pal(['#2a0a08', '#4a1410', '#6a2018', '#8a2c20', '#aa3a2a']), in: pal(['#2a0a08', '#4a1410', '#6a2018', '#8a2c20', '#aa3a2a']) } });
  if (k === 'morgana') return Object.assign({}, HLOOKS.bruja, { body: 'big' });
  if (k === 'vael') return Object.assign({}, HLOOKS.esqueleto, { body: 'big', hat: 'crown', weapon: { k: 'greatsword', tier: 9 }, cape: { out: pal(['#1a0a2a', '#2a1440', '#3e2058', '#562c74', '#704090']), in: pal(['#4a0a10', '#7a1420', '#a01e2e', '#c83444', '#e8606c']) } });
  if (k === 'golemhielo') return Object.assign({}, HLOOKS.golem, { body: 'huge', skin: pal(['#3a6a8a', '#7ac0e0', '#b8ecff', '#ffffff']), cloth: pal(['#2a5a7a', '#5aa0c8', '#8ad0f0', '#c8f0ff', '#ffffff']), eyes: 'brillo' });
  if (k === 'desatado') return Object.assign({}, HLOOKS.caballero, { body: 'huge', hat: 'horned', weapon: { k: 'greatsword', tier: 11 }, eyes: 'vacio' });
  return HLOOKS.goblin;
}
function humanoidMobAtlas(look) { const a = buildAtlas(look, ['idle', 'walk', 'atk', 'hurt']); return a; }
