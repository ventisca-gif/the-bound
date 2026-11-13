// ================= WORLD GENERATION =================
const WW = 384, WH = 240, SEED = 7331;
const VOLC = { cx: 160, cy: 216, rx: 47, ry: 20, mx: 192, my: 207 };
const T = { DEEP: 0, WATER: 1, SAND: 2, GRASS: 3, DIRT: 4, COBBLE: 5, SNOW: 6, MUD: 7, ASH: 8, STONE: 9, FARM: 10, PLANK: 11, LAVA: 12, FACE: 13, STAIRS: 14, FALL: 15, CWALL: 16, FLOOR: 17, IWALL: 18, VOID: 19, CARPET: 20, BRIDGE: 21, PALI: 22, DUSK: 23 };
const SOLID_T = new Uint8Array(32);[T.DEEP, T.WATER, T.LAVA, T.FACE, T.FALL, T.CWALL, T.IWALL, T.VOID, T.PALI].forEach(t => SOLID_T[t] = 1);
const WATERY = new Uint8Array(32);[T.DEEP, T.WATER, T.FALL].forEach(t => WATERY[t] = 1);
const REGIONS = [
  { k: 'valle', n: 'Valle de Albor', lv: [1, 8], c: [118, 154], music: 'field' },
  { k: 'costa', n: 'Costa Coral', lv: [4, 12], c: [206, 140], music: 'field' },
  { k: 'bosque', n: 'Bosque Susurrante', lv: [8, 18], c: [44, 152], music: 'forest' },
  { k: 'llanuras', n: 'Llanuras Doradas', lv: [12, 22], c: [124, 104], music: 'field' },
  { k: 'colinas', n: 'Colinas Orcas', lv: [26, 38], c: [200, 84], music: 'wild' },
  { k: 'pantano', n: 'Pantano Gris', lv: [36, 48], c: [40, 92], music: 'forest' },
  { k: 'arxar', n: 'Tierras de Arxar', lv: [18, 28], c: [128, 52], music: 'field' },
  { k: 'ruinas', n: 'Ruinas de Vael', lv: [46, 60], c: [44, 32], music: 'wild' },
  { k: 'picos', n: 'Picos Helados', lv: [58, 74], c: [206, 28], music: 'wild' },
  { k: 'nhar', n: 'Isla de Nhar', lv: [72, 100], c: [229, 171], music: 'wild' },
  { k: 'mar', n: 'Mar de Coral', lv: [1, 1], c: [0, 0], music: 'field' },
  { k: 'desierto', n: 'Desierto de Sahrim', lv: [96, 110], c: [302, 150], music: 'wild', isle: 1 },
  { k: 'selva', n: 'Selva de Yarakai', lv: [106, 122], c: [352, 146], music: 'forest', isle: 1 },
  { k: 'cristal', n: 'Valle Cristalino', lv: [118, 136], c: [306, 54], music: 'wild', isle: 1 },
  { k: 'eclipse', n: 'Tierras del Eclipse', lv: [130, 150], c: [354, 42], music: 'wild', isle: 1 },
  { k: 'volcan', n: 'Isla Brasa', lv: [150, 160], c: [162, 214], music: 'wild' },
];
const RI = {}; REGIONS.forEach((r, i) => RI[r.k] = i);
const TOWNS = [
  { k: 'albor', n: 'Aldea Albor', x0: 100, y0: 138, x1: 137, y1: 165, lvl: 0, reg: 'valle' },
  { k: 'puerto', n: 'Puerto Coral', x0: 189, y0: 117, x1: 226, y1: 143, lvl: 0, reg: 'costa' },
  { k: 'arxar', n: 'Ciudadela de Arxar', x0: 104, y0: 26, x1: 152, y1: 72, lvl: 1, reg: 'arxar' },
  { k: 'sahrim', n: 'Oasis de Sahrim', x0: 282, y0: 134, x1: 314, y1: 160, lvl: 0, reg: 'desierto' },
  { k: 'yarakai', n: 'Aldea Yarakai', x0: 332, y0: 152, x1: 358, y1: 172, lvl: 0, reg: 'selva' },
  { k: 'brasa', n: 'Puerto Brasa', x0: 120, y0: 201, x1: 172, y1: 227, lvl: 0, reg: 'volcan' },
];
const WAYSTONES = [
  { k: 'albor', n: 'Aldea Albor', x: 123, y: 147 }, { k: 'puerto', n: 'Puerto Coral', x: 203, y: 127 }, { k: 'arxar', n: 'Ciudadela de Arxar', x: 124, y: 47 },
  { k: 'bosque', n: 'Bosque Susurrante', x: 58, y: 150 }, { k: 'llanuras', n: 'Llanuras Doradas', x: 126, y: 104 }, { k: 'colinas', n: 'Colinas Orcas', x: 182, y: 94 },
  { k: 'pantano', n: 'Pantano Gris', x: 58, y: 98 }, { k: 'ruinas', n: 'Ruinas de Vael', x: 68, y: 40 }, { k: 'picos', n: 'Picos Helados', x: 184, y: 38 }, { k: 'nhar', n: 'Isla de Nhar', x: 221, y: 168 },
  { k: 'sahrim', n: 'Oasis de Sahrim', x: 298, y: 139 }, { k: 'yarakai', n: 'Aldea Yarakai', x: 345, y: 156 }, { k: 'desierto', n: 'Desierto de Sahrim', x: 312, y: 112 },
  { k: 'selva', n: 'Selva de Yarakai', x: 356, y: 128 }, { k: 'cristal', n: 'Valle Cristalino', x: 306, y: 62 }, { k: 'eclipse', n: 'Tierras del Eclipse', x: 350, y: 52 },
];
WAYSTONES.push({ k: 'brasa', n: 'Puerto Brasa', x: 146, y: 206 });
// flat pads (field waystones, boss arenas, docks) keep their spots walkable
const PADS = [[312, 112, 3], [356, 128, 3], [306, 62, 3], [350, 52, 3], [322, 172, 6], [368, 112, 6], [288, 26, 6], [366, 22, 6], [214, 152, 6], [150, 98, 5], [96, 80, 6]];

function genWorld() {
  const w = WW, h = WH, N = w * h, I = (x, y) => y * w + x;
  const ter = new Uint8Array(N), lvl = new Uint8Array(N), reg = new Uint8Array(N), flags = new Uint8Array(N), wdist = new Uint8Array(N);
  // flags: 1 road, 2 town, 4 safe(no spawn), 8 bridge, 16 noDecor, 32 object, 64 explored
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  const ISL = [229, 171];
  const isVolcIsle = (x, y) => { const dx = (x - VOLC.cx) / VOLC.rx, dy = (y - VOLC.cy) / VOLC.ry; return dx * dx + dy * dy < 1 + (fbm(x / 7, y / 7, 71, 3) - 0.5) * 0.5; };
  const isIsland = (x, y) => dist(x, y, ISL[0], ISL[1]) < 11.5 + (fbm(x / 6, y / 6, 16, 2) - 0.5) * 5;
  const land = new Uint8Array(N);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let east = 238 + (fbm(y / 22, 3.3, 11, 3) - 0.5) * 14;
    const pw = clamp(1 - Math.abs(y - 130) / 18, 0, 1); east = lerp(east, 226.6 + (fbm(y / 8, 1, 17, 2) - 0.5) * 1.5, pw);
    const south = 185 + (fbm(x / 22, 7.7, 12, 3) - 0.5) * 10, west = 4 + (fbm(y / 25, 1.1, 13, 3) - 0.5) * 7, north = 4 + (fbm(x / 25, 5.5, 14, 3) - 0.5) * 7;
    let l = !(x < west || x > east || y > south || y < north);
    if (l && dist(x, y, ISL[0], ISL[1]) < 23 + (fbm(x / 9, y / 9, 18, 2) - 0.5) * 6) l = false;
    if (isIsland(x, y)) l = true;
    if (isVolcIsle(x, y)) l = true;
    if (x > 252) { const cw = 273 + (fbm(y / 20, 9.1, 61, 3) - 0.5) * 16, ce = 377 + (fbm(y / 18, 2.2, 62, 3) - 0.5) * 8, cn = 9 + (fbm(x / 22, 4.4, 63, 3) - 0.5) * 10, cs = 183 + (fbm(x / 22, 6.6, 64, 3) - 0.5) * 10; l = x > cw && x < ce && y > cn && y < cs; }
    land[I(x, y)] = l ? 1 : 0;
  }
  // regions
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = I(x, y);
    if (!land[i]) { reg[i] = RI.mar; continue; }
    if (dist(x, y, ISL[0], ISL[1]) < 20) { reg[i] = RI.nhar; continue; }
    if (y > 190) { reg[i] = RI.volcan; continue; }
    const wx = x + (fbm(x / 26, y / 26, 21, 3) - 0.5) * 56 + (fbm(x / 6, y / 6, 23, 2) - 0.5) * 18, wy = y + (fbm(x / 26, y / 26, 22, 3) - 0.5) * 56 + (fbm(x / 6, y / 6, 24, 2) - 0.5) * 18;
    let best = 0, bd = 1e9;
    const far = x > 252; for (let r = 0; r < REGIONS.length; r++) { const R = REGIONS[r]; if (R.k === 'mar' || R.k === 'nhar' || R.k === 'volcan' || !!R.isle !== far) continue; const d = dist2(wx, wy, R.c[0], R.c[1]) * (R.k === 'valle' ? 0.8 : 1); if (d < bd) { bd = d; best = r; } }
    reg[i] = best;
  }
  // elevation
  const bias = { valle: -0.06, costa: -0.22, bosque: -0.02, llanuras: -0.12, colinas: 0.16, pantano: -0.4, arxar: 0.02, ruinas: 0.02, picos: 0.2, nhar: -0.05, mar: -1, desierto: -0.02, selva: -0.1, cristal: 0.12, volcan: -0.5, eclipse: 0.1 };
  const blobs = [[144, 132, 9, 0.32], [86, 128, 8, 0.25], [160, 104, 10, 0.2]];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = I(x, y); if (!land[i]) continue;
    let e = fbm(x / 34, y / 34, 41, 4) + bias[REGIONS[reg[i]].k];
    for (const b of blobs) e += b[3] * clamp(1 - dist(x, y, b[0], b[1]) / b[2], 0, 1);
    lvl[i] = e > 0.6 ? (REGIONS[reg[i]].k === 'picos' && e > 0.8 ? 2 : 1) : 0;
  }
  const majority = () => {
    const o = new Uint8Array(lvl);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = I(x, y); if (!land[i]) continue; const cnt = [0, 0, 0];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) cnt[lvl[I(x + dx, y + dy)]]++;
      let b = lvl[i]; for (let k = 0; k < 3; k++) if (cnt[k] >= 5) b = k; o[i] = b;
    }
    lvl.set(o);
  };
  majority(); majority();
  // towns flatten (with margin) + Arxar plateau
  const townAt = new Int8Array(N).fill(-1);
  TOWNS.forEach((t, ti) => {
    const m = t.k === 'arxar' ? 5 : 3;
    for (let y = t.y0 - m - 3; y <= t.y1 + m + 3; y++) for (let x = t.x0 - m - 3; x <= t.x1 + m + 3; x++) if (inb(x, y)) {
      const i = I(x, y); const ex = Math.max(t.x0 - x, x - t.x1, t.y0 - y, y - t.y1); const mm = m + (vnoise(x / 4, y / 4, 33 + ti) - 0.5) * 6;
      if (ex > mm) continue; lvl[i] = t.lvl; if (ex <= 0) land[i] = 1; if (reg[i] === RI.mar && land[i]) reg[i] = RI[t.reg];
    }
    for (let y = t.y0; y <= t.y1; y++) for (let x = t.x0; x <= t.x1; x++) { const i = I(x, y); townAt[i] = ti; flags[i] |= 2 | 4; }
  });
  // Arxar plateau extension south to give room for stairs
  for (let y = 70; y <= 82; y++) for (let x = 112; x <= 144; x++) { const i = I(x, y); const f = Math.abs(x - 128) < 16 - (y - 70) * 0.6 + (hash2(x, y, 5) - 0.5) * 2; if (f) lvl[i] = 1; }
  // remove small components
  const comp = new Int32Array(N).fill(-1); let cid = 0;
  for (let s = 0; s < N; s++) {
    if (comp[s] >= 0 || !land[s]) continue; const L = lvl[s], st = [s], cells = []; comp[s] = cid;
    while (st.length) { const i = st.pop(); cells.push(i); const x = i % w, y = (i / w) | 0;[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (!inb(nx, ny)) return; const j = I(nx, ny); if (comp[j] < 0 && land[j] && lvl[j] === L) { comp[j] = cid; st.push(j); } }); }
    if (cells.length < 60 && L > 0) for (const i of cells) lvl[i] = L - 1;
    cid++;
  }
  // base terrain
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = I(x, y);
    if (!land[i]) { ter[i] = T.WATER; continue; }
    const rk = REGIONS[reg[i]].k; let t = T.GRASS;
    if (rk === 'picos') t = fbm(x / 10, y / 10, 51, 3) > 0.36 ? T.SNOW : T.GRASS;
    else if (rk === 'nhar') t = T.ASH;
    else if (rk === 'volcan') { const dv = dist(x, y, VOLC.mx, VOLC.my); t = dv < 15 + (fbm(x / 5, y / 5, 72, 2) - 0.5) * 6 ? T.ASH : fbm(x / 8, y / 8, 73, 3) > 0.62 ? T.SAND : T.GRASS; }
    else if (rk === 'pantano' && fbm(x / 7, y / 7, 52, 3) > 0.56) t = T.MUD;
    else if (rk === 'colinas' && fbm(x / 8, y / 8, 53, 3) > 0.64) t = T.DIRT;
    else if (rk === 'ruinas' && fbm(x / 9, y / 9, 54, 3) > 0.66) t = T.STONE;
    else if (rk === 'desierto') t = fbm(x / 8, y / 8, 55, 3) > 0.68 ? T.DIRT : T.SAND;
    else if (rk === 'selva' && fbm(x / 7, y / 7, 56, 3) > 0.6) t = T.MUD;
    else if (rk === 'cristal' && fbm(x / 9, y / 9, 57, 3) > 0.65) t = T.STONE;
    else if (rk === 'eclipse') t = fbm(x / 8, y / 8, 58, 3) > 0.66 ? T.ASH : T.DUSK;
    ter[i] = t;
  }
  // lakes
  const lakeTh = { volcan: 0.99, valle: 0.74, costa: 0.8, bosque: 0.7, llanuras: 0.79, colinas: 0.8, pantano: 0.6, arxar: 0.8, ruinas: 0.74, picos: 0.72, nhar: 0.71, desierto: 0.84, selva: 0.69, cristal: 0.72, eclipse: 0.74 };
  const ponds = [[96, 131, 3.6], [64, 132, 5], [176, 60, 4], [86, 64, 3.5], [36, 106, 4.5]];
  for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) {
    const i = I(x, y); if (!land[i] || townAt[i] >= 0) continue;
    const rk = REGIONS[reg[i]].k; let isl = fbm(x / 13, y / 13, 31, 3) > lakeTh[rk];
    for (const p of ponds) if (dist(x, y, p[0], p[1]) < p[2] + (hash2(x, y, 9) - 0.5)) isl = true;
    if (!isl) continue;
    let ok = true; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (lvl[I(x + dx, y + dy)] !== lvl[i] || townAt[I(x + dx, y + dy)] >= 0) ok = false;
    if (ok) ter[i] = rk === 'nhar' ? T.LAVA : T.WATER;
  }
  // pads: flatten & dry
  for (const [px0, py0, r] of PADS) { const c0 = I(px0, py0); const L0 = lvl[c0]; for (let y = py0 - r - 1; y <= py0 + r + 1; y++) for (let x = px0 - r - 1; x <= px0 + r + 1; x++) { if (!inb(x, y) || dist(x, y, px0, py0) > r + 0.5) continue; const i = I(x, y); land[i] = 1; lvl[i] = L0; if (WATERY[ter[i]] || ter[i] === T.LAVA) { const rk = REGIONS[reg[i]].k; ter[i] = rk === 'desierto' ? T.SAND : rk === 'eclipse' ? T.DUSK : rk === 'nhar' ? T.ASH : T.GRASS; if (reg[i] === RI.mar) reg[i] = reg[c0]; } } }
  // ---------- A* ----------
  function astar(sx, sy, tx, ty, cost, allowDiag = false) {
    const g = new Float32Array(N).fill(1e9), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N), hp = new Heap();
    const s = I(sx, sy), t = I(tx, ty); g[s] = 0; hp.push(s, 0);
    while (hp.size) {
      const c = hp.pop(); if (c === t) break; if (closed[c]) continue; closed[c] = 1;
      const cx = c % w, cy = (c / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy; if (!inb(nx, ny)) continue; const n = I(nx, ny); if (closed[n]) continue;
        const k = cost(c, n, dx, dy); if (k >= 1e8) continue;
        const ng = g[c] + k; if (ng < g[n]) { g[n] = ng; came[n] = c; hp.push(n, ng + (Math.abs(nx - tx) + Math.abs(ny - ty)) * 0.7); }
      }
    }
    if (came[t] < 0 && s !== t) return null;
    const path = []; let c = t; while (c !== s && c >= 0) { path.push(c); c = came[c]; } path.push(s); return path.reverse();
  }
  // ---------- rivers ----------
  const rivers = [[[196, 34], [236, 104]], [[70, 44], [36, 104]], [[166, 80], [152, 186]], [[334, 92], [352, 190]], [[322, 24], [264, 38]]];
  const nearTown = (x, y, m) => TOWNS.some(t => x >= t.x0 - m && x <= t.x1 + m && y >= t.y0 - m && y <= t.y1 + m);
  const riverMask = new Uint8Array(N);
  const rrng = new RNG(SEED + 5);
  rivers.forEach(([a, b], ri) => {
    const wps = [a]; const L = dist(a[0], a[1], b[0], b[1]), nx0 = -(b[1] - a[1]) / L, ny0 = (b[0] - a[0]) / L, nw = Math.max(2, Math.floor(L / 22));
    for (let k = 1; k < nw; k++) { const t = k / nw; for (let tries = 0; tries < 8; tries++) { const off = rrng.range(-11, 11); const px = Math.round(lerp(a[0], b[0], t) + nx0 * off), py = Math.round(lerp(a[1], b[1], t) + ny0 * off); if (inb(px, py) && land[I(px, py)] && !nearTown(px, py, 7)) { wps.push([px, py]); break; } } }
    wps.push(b);
    let p = [];
    for (let k = 0; k + 1 < wps.length; k++) {
      const A = wps[k], B = wps[k + 1];
      const seg = astar(A[0], A[1], B[0], B[1], (c, n, dx, dy) => {
        const nx = n % w, ny = (n / w) | 0; if (nearTown(nx, ny, 6)) return 1e9;
        let kk = 1 + Math.pow(vnoise(nx / 5, ny / 5, 60 + ri), 2) * 22;
        if (lvl[n] > lvl[c]) kk += 60; if (lvl[n] < lvl[c] && dy <= 0) kk += 30;
        if (!land[n]) kk = dist(nx, ny, b[0], b[1]) < 5 ? 0.5 : 1e9; return kk;
      });
      if (seg) p = p.concat(seg);
    }

    for (const c of p) { const cx = c % w, cy = (c / w) | 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (Math.abs(dx) + Math.abs(dy) > 1 && hash2(cx + dx, cy + dy, 3) < 0.6) continue; const nx = cx + dx, ny = cy + dy; if (!inb(nx, ny)) continue; const j = I(nx, ny); if (townAt[j] >= 0) continue; riverMask[j] = 1; if (ter[j] !== T.LAVA) ter[j] = T.WATER; } }
  });
  // ---------- faces ----------
  for (let x = 0; x < w; x++) for (let y = 0; y < h - 1; y++) {
    const i = I(x, y), L = lvl[i], B = lvl[I(x, y + 1)];
    if (L > B && land[i]) {
      const rows = 2 * (L - B);
      for (let k = 0; k < rows; k++) { const yy = y - k; if (yy < 0) break; const j = I(x, yy); if (lvl[j] !== L) break; ter[j] = WATERY[ter[j]] || riverMask[j] ? T.FALL : T.FACE; }
    }
  }
  // water distance for depth shading
  {
    const q = []; for (let i = 0; i < N; i++) { if (!WATERY[ter[i]] && ter[i] !== T.LAVA) { wdist[i] = 0; q.push(i); } else wdist[i] = 255; }
    let qi = 0; while (qi < q.length) { const c = q[qi++]; const cx = c % w, cy = (c / w) | 0;[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = cx + dx, ny = cy + dy; if (!inb(nx, ny)) return; const j = I(nx, ny); if (wdist[j] > wdist[c] + 1) { wdist[j] = wdist[c] + 1; q.push(j); } }); }
    for (let i = 0; i < N; i++) if (ter[i] === T.WATER && !land[i] && wdist[i] > 3) ter[i] = T.DEEP;
  }
  // beaches
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = I(x, y); if (ter[i] !== T.GRASS && ter[i] !== T.DIRT) continue; if (lvl[i] !== 0 || townAt[i] >= 0) continue;
    const rk = REGIONS[reg[i]].k; const rad = rk === 'costa' ? 3 : rk === 'valle' || rk === 'llanuras' || rk === 'bosque' ? 2 : 1;
    let near = 9; for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) { if (!inb(x + dx, y + dy)) continue; const j = I(x + dx, y + dy); if (!land[j]) near = Math.min(near, Math.max(Math.abs(dx), Math.abs(dy))); }
    if (near <= rad + (hash2(x, y, 4) < 0.3 ? -1 : 0)) ter[i] = T.SAND;
  }
  // ---------- roads ----------
  const roadCost = (c, n, dx, dy) => {
    const tn = ter[n], tc = ter[c];
    if (tn === T.DEEP || tn === T.FALL || tn === T.LAVA) return 1e9;
    if (townAt[n] >= 0 && !(flags[n] & 1)) return 1e9;
    let k = 1 + vnoise((n % w) / 6, ((n / w) | 0) / 6, 70) * 0.8;
    if (flags[n] & 1) k = 0.35;
    if (tn === T.WATER) k += 14;
    if (tn === T.FACE || tn === T.STAIRS) { if (dx !== 0) return 1e9; k += 10; }
    const lc = lvl[c], ln = lvl[n];
    if (lc !== ln && !((tc === T.FACE || tc === T.STAIRS || tn === T.FACE || tn === T.STAIRS) && dx === 0)) return 1e9;
    if (tn === T.MUD) k += 1; if (tn === T.SAND) k += 0.4;
    return k;
  };
  const pts = {};
  WAYSTONES.forEach(s => pts[s.k] = [s.x, s.y + 2]);
  Object.assign(pts, { sahE: [315, 147], sahN: [298, 133], yarW: [331, 162], yarN: [345, 151], sahrak: [322, 170], yarak: [366, 112], coloso: [290, 28], eclipsor: [364, 24], albN: [118, 137], albE: [138, 151], albW: [99, 151], albS: [118, 166], puW: [188, 130], puN: [205, 116], arS: [128, 84], arW: [102, 50], arE: [154, 50], kslime: [96, 170], ent: [28, 160], gruk: [210, 86], morg: [26, 96], vael: [44, 36], golem: [214, 30], mine: [176, 50] });
  const roadSegs = [['albN', 'llanuras'], ['llanuras', 'arS'], ['albE', 'puW'], ['albW', 'bosque'], ['bosque', 'ent'], ['albS', 'kslime'], ['llanuras', 'pantano'], ['pantano', 'morg'], ['llanuras', 'colinas'], ['colinas', 'gruk'], ['puN', 'colinas'], ['arW', 'ruinas'], ['ruinas', 'vael'], ['arE', 'picos'], ['picos', 'golem'], ['picos', 'mine'], ['sahE', 'yarW'], ['sahE', 'desierto'], ['desierto', 'sahrak'], ['yarN', 'selva'], ['selva', 'yarak'], ['sahN', 'cristal'], ['cristal', 'coloso'], ['cristal', 'eclipse'], ['selva', 'eclipse'], ['eclipse', 'eclipsor']];
  // town streets first
  const roadLine = (x0, y0, x1, y1, wd, t) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let k = 0; k < wd; k++) { const xx = x0 === x1 ? x + k : x, yy = x0 === x1 ? y : y + k; if (!inb(xx, yy)) continue; const j = I(xx, yy); flags[j] |= 1; ter[j] = t; } };
  const roadPaths = [];
  roadSegs.forEach(([a, b]) => {
    const A = pts[a], B = pts[b]; const p = astar(A[0], A[1], B[0], B[1], roadCost); if (!p) { console.warn('no road', a, b); return; }
    roadPaths.push(p);
    for (let k = 0; k < p.length; k++) {
      const c = p[k], cx = c % w, cy = (c / w) | 0; const nxt = p[Math.min(k + 1, p.length - 1)], prv = p[Math.max(k - 1, 0)];
      const vert = Math.abs(((nxt / w) | 0) - ((prv / w) | 0)) > Math.abs((nxt % w) - (prv % w));
      const cells = [c]; const ex = vert ? I(cx + 1, cy) : I(cx, cy + 1); if (inb(vert ? cx + 1 : cx, vert ? cy : cy + 1)) cells.push(ex);
      for (const j of cells) {
        if (townAt[j] >= 0) continue; const tj = ter[j];
        if (tj === T.WATER) { ter[j] = T.BRIDGE; flags[j] |= 8 | 1; continue; }
        if (tj === T.FACE) { ter[j] = T.STAIRS; flags[j] |= 1; continue; }
        if (tj === T.DEEP || tj === T.FALL || tj === T.LAVA || tj === T.STAIRS || tj === T.BRIDGE) continue;
        if (j === ex && lvl[j] !== lvl[c]) continue;
        flags[j] |= 1; ter[j] = REGIONS[reg[j]].k === 'picos' && tj === T.SNOW ? T.SNOW : T.DIRT; if (REGIONS[reg[j]].k === 'nhar' || REGIONS[reg[j]].k === 'eclipse' || REGIONS[reg[j]].k === 'cristal') ter[j] = T.STONE;
      }
    }
  });
  // stairs must span whole face columns: extend
  for (let pass = 0; pass < 4; pass++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = I(x, y); if (ter[i] !== T.STAIRS) continue;[[0, -1], [0, 1]].forEach(([dx, dy]) => { const j = I(x + dx, y + dy); if (ter[j] === T.FACE) { ter[j] = T.STAIRS; flags[j] |= 1; } }); }
  // extra stairs along long face runs
  for (let y = 1; y < h - 1; y++) {
    let run = [];
    const flush = () => {
      if (run.length >= 12) { const nS = run.length >= 34 ? 2 : 1; for (let s = 0; s < nS; s++) { const at = run[Math.floor(run.length * (s + 1) / (nS + 1))]; for (const xx of [at, at + 1]) { let yy = y; if (!WATERY[ter[I(xx, y + 1)]] && ter[I(xx, y + 1)] !== T.FACE) { while (yy >= 0 && ter[I(xx, yy)] === T.FACE) { ter[I(xx, yy)] = T.STAIRS; yy--; } } } } }
      run = [];
    };
    for (let x = 0; x < w; x++) { const i = I(x, y), b = I(x, y + 1); if (ter[i] === T.FACE && ter[b] !== T.FACE && !SOLID_T[ter[b]] && ter[I(x + 1, y)] === T.FACE && !SOLID_T[ter[I(x + 1, y + 1)]]) run.push(x); else flush(); }
    flush();
  }
  // Arxar approach: road from stairs to the south road point
  for (let y = 72; y <= 86; y++) for (let x = 127; x <= 129; x++) { const i = I(x, y); if (ter[i] === T.FACE) { ter[i] = T.STAIRS; } else if (ter[i] !== T.STAIRS) { ter[i] = T.DIRT; } flags[i] |= 1; }
  // Arxar grand staircase
  for (let y = 60; y < 90; y++) for (let x = 125; x <= 131; x++) { const i = I(x, y); if (ter[i] === T.FACE) { ter[i] = T.STAIRS; flags[i] |= 1; } }
  // safe zone around roads
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (flags[I(x, y)] & 1) for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) if (inb(x + dx, y + dy)) flags[I(x + dx, y + dy)] |= 4;
  const world = { w, h, ter, lvl, reg, flags, land, townAt, wdist, riverMask, objs: [], objAt: new Int32Array(N).fill(-1), solid: new Uint8Array(N), I, inb, roadPaths, pts, camps: [], bosses: [], npcs: [], doors: [], isWorld: true, id: 'world' };
  return world;
}
