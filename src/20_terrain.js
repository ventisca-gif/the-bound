// ================= TERRAIN ART =================
const GRASSP = {
  valle: ['#24501f', '#33702a', '#4a8e34', '#68ad40', '#93cc58'], costa: ['#335c25', '#4a7b2e', '#64963a', '#83b24c', '#a9cc66'],
  bosque: ['#183a1d', '#244f25', '#33672c', '#4a8236', '#679f44'], llanuras: ['#5d5a24', '#7c772d', '#9b9339', '#b9ad4b', '#d6c86c'],
  volcan: ['#1e5a2a', '#2a7a34', '#3a9a3e', '#5aba4e', '#86d86a'], colinas: ['#424d22', '#58652a', '#727f33', '#8e9a42', '#adb65a'], pantano: ['#233424', '#33452b', '#445833', '#586c3e', '#72844c'],
  arxar: ['#28532a', '#376f32', '#4d8b3a', '#6aa647', '#90c25c'], ruinas: ['#1f4236', '#2c5741', '#3c6e4c', '#538759', '#70a26c'],
  picos: ['#2e4a3c', '#3e5f48', '#527556', '#6a8d66', '#88a87c'], desierto: ['#5a4a22', '#7a6a30', '#9a8a40', '#b8a858', '#d6c87a'], selva: ['#0c3016', '#12461c', '#1c6026', '#2a7e32', '#46a046'], cristal: ['#1e3a4a', '#28526a', '#356e88', '#4c8ea8', '#78b8cc'], eclipse: ['#1a1024', '#261834', '#342246', '#46305c', '#5e4476'], nhar: ['#2a2422', '#3a312d', '#4b3f38', '#5e4f45', '#776455'], mar: ['#24501f', '#33702a', '#4a8e34', '#68ad40', '#93cc58']
};
const MATP = {
  [T.DIRT]: ['#5e3f27', '#7a5434', '#966c42', '#b08655', '#c9a36f'], [T.COBBLE]: ['#4e4944', '#6f6a62', '#8b857a', '#a69f92', '#c4bcad'],
  [T.SAND]: ['#a2834f', '#bd9d62', '#d3b679', '#e3cb94', '#f1e2b7'], [T.SNOW]: ['#7d8fae', '#9fb0ca', '#c2cfe2', '#dde6f1', '#f8fbff'],
  [T.MUD]: ['#2f271d', '#41362a', '#544636', '#675742', '#7c6a51'], [T.ASH]: ['#231d1c', '#332a27', '#443833', '#584840', '#715d50'],
  [T.STONE]: ['#3d3d46', '#53535e', '#6a6a75', '#82828c', '#9d9da6'], [T.FARM]: ['#3e281a', '#543722', '#6a472c', '#805937', '#986d45'],
  [T.PLANK]: ['#3f2717', '#593822', '#744b2d', '#8e5f39', '#aa7748'], [T.BRIDGE]: ['#3f2717', '#593822', '#744b2d', '#8e5f39', '#aa7748'],
  [T.FLOOR]: ['#4a2c18', '#653d22', '#7f512c', '#996537', '#b27b45'], [T.CARPET]: ['#3a0e14', '#5c1520', '#7e1f2b', '#a02c36', '#d2a24c'],
  [T.LAVA]: ['#5a0f08', '#a5210e', '#e34812', '#ff8a24', '#ffd85a'], [T.IWALL]: ['#3a2a22', '#56402f', '#77583e', '#96734f', '#e8d8b4'],
  [T.CWALL]: ['#3b3a40', '#55545c', '#6f6e76', '#8b8a92', '#a8a7ae'], [T.DUSK]: ['#120a18', '#1e1228', '#2c1c3a', '#3c2a4e', '#523c66'], [T.PALI]: ['#3a2414', '#553620', '#704a2c', '#8c6038', '#a87848'],
};
const ROCKP = ['#2e2824', '#463e36', '#5f554b', '#7a6f62', '#968a7b'], ROCKP_SNOW = ['#323a48', '#46505f', '#5e6a7c', '#7a8698', '#9aa6b8'], ROCKP_ASH = ['#1c1716', '#2c2422', '#3e3330', '#544541', '#6c5a54'];
const WATERP = ['#173462', '#1e4479', '#285c96', '#3a79b4', '#5c9ccc', '#bfe3f2'];
const WATERP_SW = ['#1d3230', '#25403a', '#2f5248', '#3d6658', '#507a68', '#a8c4b0'];
const GP = {}; for (const k in GRASSP) GP[k] = pal(GRASSP[k]); const MP = {}; for (const k in MATP) MP[k] = pal(MATP[k]);
const RKP = pal(ROCKP), RKPS = pal(ROCKP_SNOW), RKPA = pal(ROCKP_ASH), WP = pal(WATERP), WPS = pal(WATERP_SW);
const RKPD = pal(['#4a3218', '#6e4c26', '#946a38', '#b88a4e', '#d8ac6c']), RKPC = pal(['#20183a', '#342a5a', '#4c4280', '#6a62a6', '#9890d0']), WPE = pal(['#0e0618', '#1a0c2c', '#2a1442', '#3e2060', '#5a3484', '#b090e0']);
const SOFT = new Uint8Array(32);[T.DEEP, T.WATER, T.SAND, T.GRASS, T.DIRT, T.COBBLE, T.SNOW, T.MUD, T.ASH, T.STONE, T.FARM, T.LAVA, T.DUSK].forEach(t => SOFT[t] = 1);
// ---------- tileable textures (shade index maps) ----------
function tvn(x, y, P, s) { const xi = Math.floor(x), yi = Math.floor(y), u = smooth(x - xi), v = smooth(y - yi); const h = (a, b) => hash2(((a % P) + P) % P, ((b % P) + P) % P, s); return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v); }
const TEX = {}; const TX = 128;
function genTextures() {
  const S = TX, mk = () => new Uint8Array(S * S), R = new RNG(99);
  const noise = (sc, s, oct = 2) => { const a = new Float32Array(S * S); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let t = 0, am = 1, n = 0, f = 1; for (let o = 0; o < oct; o++) { t += tvn(x / sc * f, y / sc * f, Math.round(S / sc * f), s + o) * am; n += am; am *= 0.5; f *= 2; } a[y * S + x] = t / n; } return a; };
  TEX.n1 = noise(10, 1, 3); TEX.n2 = noise(4, 2, 2); TEX.n3 = noise(24, 3, 2); TEX.n4 = noise(6, 4, 2);
  const put = (a, x, y, v) => { a[((y % S + S) % S) * S + ((x % S + S) % S)] = v; };
  // grass: base + slanted blade strokes
  const g = mk(); g.fill(2);
  for (let k = 0; k < 700; k++) {
    const x = R.int(0, S - 1), y = R.int(0, S - 1), dirx = R.f() < 0.5 ? -1 : 1, len = R.int(2, 3), t = R.f();
    if (t < 0.78) { for (let j = 0; j < len; j++) put(g, x + (j === len - 1 ? dirx : 0), y - j, j === len - 1 && R.f() < 0.5 ? 4 : 3); put(g, x - dirx, y + 1, 1); }
    else if (t < 0.9) { put(g, x, y, 1); put(g, x + 1, y, 1); }
    else { put(g, x, y, 4); put(g, x, y + 1, 3); put(g, x + 1, y + 1, 1); }
  }
  TEX.grass = g;
  // dirt
  const d = mk(); for (let i = 0; i < S * S; i++) { const n = TEX.n1[i] * 0.6 + TEX.n2[i] * 0.4; d[i] = n > 0.64 ? 3 : n < 0.34 ? 1 : 2; }
  for (let k = 0; k < 260; k++) { const x = R.int(0, S - 1), y = R.int(0, S - 1); if (R.f() < 0.6) { put(d, x, y, 4); put(d, x + 1, y, 3); put(d, x, y + 1, 1); put(d, x + 1, y + 1, 1); } else put(d, x, y, 0); }
  TEX.dirt = d;
  // cobble: voronoi stones
  const cb = mk(); const seeds = []; const G = 6; for (let gy = 0; gy < S / G; gy++) for (let gx = 0; gx < S / G; gx++) seeds.push([gx * G + R.range(1, G - 1), gy * G + R.range(1, G - 1), R.int(1, 3)]);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let d1 = 1e9, d2 = 1e9, sb = null; for (const s of seeds) { let dx = Math.abs(x - s[0]); dx = Math.min(dx, S - dx); let dy = Math.abs(y - s[1]); dy = Math.min(dy, S - dy); const dd = Math.sqrt(dx * dx + dy * dy); if (dd < d1) { d2 = d1; d1 = dd; sb = s; } else if (dd < d2) d2 = dd; }
    let v = sb[2]; if (d2 - d1 < 0.9) v = 0; else { let rx = x - sb[0]; if (rx > S / 2) rx -= S; if (rx < -S / 2) rx += S; let ry = y - sb[1]; if (ry > S / 2) ry -= S; if (ry < -S / 2) ry += S; if (rx + ry < -2.5) v = Math.min(4, v + 1); else if (rx + ry > 2.2 && d2 - d1 < 2.4) v = Math.max(1, v - 1); }
    cb[y * S + x] = v; }
  TEX.cobble = cb;
  // sand
  const sd = mk(); for (let i = 0; i < S * S; i++) { const n = TEX.n1[i] * 0.5 + TEX.n4[i] * 0.5; sd[i] = n > 0.66 ? 3 : n < 0.3 ? 1 : 2; if (hash2(i, 3, 5) < 0.03) sd[i] = 4; if (hash2(i, 4, 5) < 0.02) sd[i] = 1; } TEX.sand = sd;
  // snow
  const sn = mk(); for (let i = 0; i < S * S; i++) { const n = TEX.n1[i] * 0.5 + TEX.n4[i] * 0.5; sn[i] = n > 0.7 ? 4 : n < 0.27 ? 2 : 3; if (hash2(i, 5, 5) < 0.008) sn[i] = 4; if (hash2(i, 6, 5) < 0.01) sn[i] = 2; } TEX.snow = sn;
  // mud / ash
  const md = mk(); for (let i = 0; i < S * S; i++) { const n = TEX.n1[i] * 0.6 + TEX.n2[i] * 0.4; md[i] = n > 0.7 ? 3 : n < 0.32 ? 0 : n < 0.45 ? 1 : 2; } TEX.mud = md;
  const as = mk(); for (let i = 0; i < S * S; i++) { const n = TEX.n1[i] * 0.5 + TEX.n2[i] * 0.5; as[i] = n > 0.68 ? 3 : n < 0.3 ? 1 : 2; if (TEX.n4[i] > 0.48 && TEX.n4[i] < 0.5) as[i] = 0; } TEX.ash = as;
  // flagstones
  const st = mk(); for (let y = 0; y < S; y++) { const row = Math.floor(y / 9); for (let x = 0; x < S; x++) { const off = (row % 2) * 7, col = Math.floor((x + off) / 14); const lx = (x + off) % 14, ly = y % 9; let v = 1 + Math.floor(hash2(col, row, 8) * 3); if (lx === 0 || ly === 0) v = 0; else if (ly === 1 || lx === 1) v = Math.min(4, v + 1); else if (ly === 8) v = Math.max(0, v - 1); if (hash2(x, y, 9) < 0.02) v = Math.max(0, v - 1); st[y * S + x] = v; } } TEX.stone = st;
  // farm furrows
  const fm = mk(); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const r = y % 5; let v = r === 0 ? 0 : r === 1 ? 1 : r === 2 ? 3 : 2; if (hash2(x, y, 10) < 0.06) v = Math.max(0, v - 1); fm[y * S + x] = v; } TEX.farm = fm;
  // planks (horizontal boards)
  const pk = mk(); for (let y = 0; y < S; y++) { const row = Math.floor(y / 5), ly = y % 5; for (let x = 0; x < S; x++) { const seam = (x + Math.floor(hash2(row, 1, 11) * 40)) % 32; let v = ly === 4 ? 0 : ly === 0 ? 3 : 2; if (seam === 0) v = 0; if (ly > 0 && ly < 4 && hash2(Math.floor(x / 3), y, 12) < 0.12) v = 1; if ((seam === 2 || seam === 29) && ly === 2) v = 4; pk[y * S + x] = v; } } TEX.plank = pk;
  // interior floor (vertical boards)
  const fl = mk(); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const col = Math.floor(x / 6), lx = x % 6; const seam = (y + Math.floor(hash2(col, 2, 13) * 50)) % 40; let v = lx === 5 ? 0 : lx === 0 ? 3 : 2; if (seam === 0) v = 0; if (lx > 0 && lx < 5 && hash2(x, Math.floor(y / 4), 14) < 0.1) v = 1; fl[y * S + x] = v; } TEX.floor = fl;
  // carpet
  const cp = mk(); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let v = ((x >> 2) + (y >> 2)) % 2 ? 2 : 3; if ((x % 8 === 0 && y % 8 === 0)) v = 4; cp[y * S + x] = v; } TEX.carpet = cp;
  // castle wall bricks
  const cw = mk(); for (let y = 0; y < S; y++) { const row = Math.floor(y / 6), ly = y % 6; for (let x = 0; x < S; x++) { const off = (row % 2) * 6, lx = (x + off) % 12; let v = 1 + Math.floor(hash2(Math.floor((x + off) / 12), row, 15) * 3); if (ly === 5 || lx === 11) v = 0; else if (ly === 0) v = Math.min(4, v + 1); cw[y * S + x] = v; } } TEX.cwall = cw;
  // rock chunks for cliffs
  const rk = mk(); const rs = []; for (let gy = 0; gy < S / 7; gy++) for (let gx = 0; gx < S / 11; gx++) rs.push([gx * 11 + R.range(0, 9), gy * 7 + R.range(0, 6), R.f() < 0.55 ? 3 : 2]);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let d1 = 1e9, d2 = 1e9, sb = null; for (const q of rs) { let dx = Math.abs(x - q[0]); dx = Math.min(dx, S - dx); let dy = Math.abs(y - q[1]); dy = Math.min(dy, S - dy); const dd = Math.sqrt(dx * dx * 0.45 + dy * dy * 1.3); if (dd < d1) { d2 = d1; d1 = dd; sb = q; } else if (dd < d2) d2 = dd; }
    let ry = y - sb[1]; if (ry > S / 2) ry -= S; if (ry < -S / 2) ry += S; let v = sb[2];
    if (d2 - d1 < 0.9) v = hash2(sb[0] | 0, sb[1] | 0, 22) < 0.25 ? v - 1 : 0; else if (ry < -2) v = Math.min(4, v + 1); else if (ry > 2.2) v = Math.max(1, v - 1);
    if (TEX.n2[y * S + x] > 0.74) v = Math.max(1, v - 1); rk[y * S + x] = clamp(v, 0, 4); }
  TEX.rock = rk;
}
const TEXOF = { [T.GRASS]: 'grass', [T.DIRT]: 'dirt', [T.COBBLE]: 'cobble', [T.SAND]: 'sand', [T.SNOW]: 'snow', [T.MUD]: 'mud', [T.ASH]: 'ash', [T.DUSK]: 'ash', [T.STONE]: 'stone', [T.FARM]: 'farm', [T.PLANK]: 'plank', [T.BRIDGE]: 'plank', [T.FLOOR]: 'floor', [T.CARPET]: 'carpet', [T.CWALL]: 'cwall', [T.PALI]: 'plank', [T.IWALL]: 'plank', [T.LAVA]: 'mud' };
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16);

// ---------- chunk renderer ----------
const CH = 8, CHP = CH * TS;
function mapData(M) {
  if (M._D) return M._D;
  M._D = { id: M.id, w: M.w, h: M.h, ter: M.ter, lvl: M.lvl, reg: M.reg, wdist: M.wdist || null, gpal: M.gpalF || null, mac: M.mac || null, ftop: M.ftop || null, fbot: M.fbot || null, regk: REGIONS.map(r => r.k) };
  return M._D;
}
// pure per-pixel terrain shading (also runs inside a Web Worker)
function chunkPixels(D, cx, cy) {
  const w = D.w, h = D.h, ter = D.ter, lvl = D.lvl, reg = D.reg, RK = D.regk, gpal = D.gpal, mac = D.mac, wdist = D.wdist;
  const P = 128, B = 3, PW = P + B * 2, ox = cx * P - B, oy = cy * P - B;
  const tx0 = (ox >> 4) - 2, ty0 = (oy >> 4) - 2, GW = ((ox + PW) >> 4) + 3 - tx0;
  const tg = new Int32Array(GW * GW); for (let j = 0; j < GW; j++) for (let i = 0; i < GW; i++) { const tx = clamp(tx0 + i, 0, w - 1), ty = clamp(ty0 + j, 0, h - 1); tg[j * GW + i] = ty * w + tx; }
  const TI = (tx, ty) => tg[(ty - ty0) * GW + (tx - tx0)];
  const cls = new Uint8Array(PW * PW);
  const n1 = TEX.n1, n2 = TEX.n2;
  for (let yy = 0; yy < PW; yy++) {
    const py = oy + yy, fy = py / 16 - 0.5, ty = Math.floor(fy), v = fy - ty, rowA = (ty - ty0) * GW - tx0, rowB = rowA + GW, ownRow = ((py >> 4) - ty0) * GW - tx0;
    for (let xx = 0; xx < PW; xx++) {
      const px = ox + xx; const to = ter[tg[ownRow + (px >> 4)]];
      let c = to;
      if (SOFT[to]) {
        const fx = px / 16 - 0.5, tx = Math.floor(fx), u = fx - tx;
        const i00 = tg[rowA + tx], i10 = tg[rowA + tx + 1], i01 = tg[rowB + tx], i11 = tg[rowB + tx + 1];
        const t00 = ter[i00], t10 = ter[i10], t01 = ter[i01], t11 = ter[i11];
        if (!(t00 === t10 && t00 === t01 && t00 === t11) && SOFT[t00] && SOFT[t10] && SOFT[t01] && SOFT[t11]) {
          const l0 = lvl[i00]; if (lvl[i11] === l0 && lvl[i10] === l0 && lvl[i01] === l0) {
            const ni = ((py & 127) << 7) | (px & 127);
            const ws0 = (1 - u) * (1 - v), ws1 = u * (1 - v), ws2 = (1 - u) * v, ws3 = u * v; let best = to, bs = -9;
            for (let k = 0; k < 4; k++) { const t = k === 0 ? t00 : k === 1 ? t10 : k === 2 ? t01 : t11; let s = (t00 === t ? ws0 : 0) + (t10 === t ? ws1 : 0) + (t01 === t ? ws2 : 0) + (t11 === t ? ws3 : 0);
              const crisp = (t === 5 || t === 9 || t === 10) ? 0.35 : 1; s += ((n1[(ni + t * 1031) & 16383] - 0.5) * 0.5 + (n2[(ni + t * 2053) & 16383] - 0.5) * 0.22) * crisp; if (s > bs) { bs = s; best = t; } }
            c = best;
          }
        }
      }
      cls[yy * PW + xx] = c;
    }
  }
  const out = new Uint32Array(P * P);
  const isLand = t => !(t === T.WATER || t === T.DEEP || t === T.FALL || t === T.LAVA);
  const MPG = MP[T.DIRT];
  for (let yy = 0; yy < P; yy++) for (let xx = 0; xx < P; xx++) {
    const px = cx * P + xx, py = cy * P + yy, k = (yy + B) * PW + (xx + B), c = cls[k], tX = px >> 4, tY = py >> 4, ti = TI(tX, tY), lx = px & 15, ly = py & 15;
    const L = lvl[ti], ni = ((py & 127) << 7) | (px & 127), rk = RK[reg[ti]];
    let col = 0;
    if (c === T.WATER || c === T.DEEP || c === T.LAVA) {
      const isL = c === T.LAVA, WPAL = isL ? MP[T.LAVA] : rk === 'pantano' || rk === 'selva' ? WPS : rk === 'eclipse' ? WPE : WP;
      let wd = 3; if (wdist) { const fx = px / 16 - 0.5, fy = py / 16 - 0.5, tx = Math.floor(fx), ty = Math.floor(fy), u = fx - tx, vv = fy - ty; wd = lerp(lerp(wdist[TI(tx, ty)], wdist[TI(tx + 1, ty)], u), lerp(wdist[TI(tx, ty + 1)], wdist[TI(tx + 1, ty + 1)], u), vv) + (n1[ni] - 0.5) * 1.4; }
      let idx = wd >= 4.2 ? 0 : wd >= 3 ? 1 : wd >= 2 ? 2 : 3;
      let near = 0; for (let r = 1; r <= 3 && !near; r++) { if (isLand(cls[k - r * PW])) near = r; else if (isLand(cls[k + r * PW]) || isLand(cls[k - r]) || isLand(cls[k + r])) near = r + 1; }
      if (near === 1 || near === 2) idx = isL ? 4 : 5; else if (near === 3) idx = Math.max(idx, 3); else if (near === 4) idx = Math.max(idx, 2);
      if (!isL && idx < 3 && n2[ni] > 0.7 && ((px + py * 3) % 7 === 0)) idx++;
      if (isL) idx = clamp(idx + (n1[ni] > 0.6 ? 1 : 0) - (n2[ni] < 0.3 ? 1 : 0), 0, 4);
      if (!isL && isLand(cls[k - PW]) && isLand(cls[k - 2 * PW]) && idx === 5) idx = 2;
      col = WPAL[Math.min(idx, WPAL.length - 1)];
    } else if (c === T.FACE || c === T.FALL || c === T.STAIRS) {
      const topY = D.ftop ? D.ftop[ti] : tY, botY = D.fbot ? D.fbot[ti] : tY; const fy = py - topY * 16, fh = (botY - topY + 1) * 16;
      const rp = rk === 'picos' ? RKPS : rk === 'nhar' || rk === 'eclipse' ? RKPA : rk === 'desierto' ? RKPD : rk === 'cristal' ? RKPC : RKP; const above = TI(tX, topY - 1), aboveT = ter[above];
      if (c === T.FALL) { const sv = ((px * 7 + (py >> 1) * 3) % 11 < 3) ? 4 : (px % 4 === 0 ? 3 : 2); col = WP[clamp(sv + (fy < 3 ? 2 : 0), 0, 5)]; }
      else if (c === T.STAIRS) { const sy = fy % 5; let v = sy === 0 ? 4 : sy === 4 ? 0 : sy === 3 ? 1 : 3; const lt = ter[TI(tX - 1, tY)], rt = ter[TI(tX + 1, tY)]; if ((lt !== T.STAIRS && lx < 2) || (rt !== T.STAIRS && lx > 13)) v = lx === 0 || lx === 15 ? 0 : 1; if (fy < 2 && aboveT !== T.STAIRS) v = 1; col = uMix(rp[v], MP[T.STONE][v], 0.45); }
      else {
        const lipN = 2 + Math.floor(n2[px & 127] * 3) + ((px * 13) % 5 === 0 ? 2 : 0);
        const grassy = aboveT === T.GRASS || aboveT === T.DIRT || aboveT === T.SAND || aboveT === T.MUD, snowy = aboveT === T.SNOW;
        const gp = gpal ? above * 5 : -1;
        if (fy < lipN && (grassy || snowy)) { const s2 = fy === lipN - 1 ? 1 : fy === 0 ? 3 : 2; col = snowy ? MP[T.SNOW][fy === lipN - 1 ? 2 : 4 - Math.min(fy, 1)] : gp >= 0 ? gpal[gp + s2] : (GP[rk] || GP.valle)[s2]; }
        else if (fy === lipN && (grassy || snowy)) col = rp[0];
        else {
          let v = TEX.rock[ni]; const depth = (fy - lipN) / (fh - lipN); v -= depth > 0.7 ? 1 : 0; if (fy >= fh - 2) v = 0;
          const lt = ter[TI(tX - 1, tY)], rtt = ter[TI(tX + 1, tY)]; const lEnd = !(lt === T.FACE || lt === T.FALL || lt === T.STAIRS), rEnd = !(rtt === T.FACE || rtt === T.FALL || rtt === T.STAIRS);
          if (lEnd && lx < 2) v = lx === 0 ? 0 : Math.min(v + 1, 4); if (rEnd && lx > 12) v = lx === 15 ? 0 : Math.max(v - 1, 0);
          col = rp[clamp(v, 0, 4)];
        }
      }
    } else if (c === T.CWALL || c === T.PALI || c === T.IWALL) {
      const abv = ter[TI(tX, tY - 1)], topEdge = abv !== c;
      if (c === T.PALI) { const lx2 = px % 5; let v = lx2 === 0 ? 0 : lx2 === 1 ? 3 : lx2 === 4 ? 1 : 2; if (topEdge && ly < 4) { const tip = Math.abs(lx2 - 2) * 1.6; if (ly < 4 - tip) v = -1; } if (ly === 10) v = 0; col = v < 0 ? (gpal ? gpal[ti * 5 + 2] : GP.valle[2]) : MP[T.PALI][v]; }
      else if (c === T.CWALL) { let v = TEX.cwall[ni]; if (topEdge && ly < 5) { const cr = (px >> 2) % 2; v = ly === 0 ? (cr ? 4 : 1) : ly < 3 ? (cr ? 3 : 0) : ly === 3 ? 4 : 2; } col = MP[T.CWALL][v]; }
      else {
        const bl = ter[TI(tX, tY + 1)], faceRoom = bl !== T.IWALL && bl !== T.VOID;
        if (faceRoom) { let v = ly > 10 ? (ly === 11 ? 4 : ly === 15 ? 0 : 2) : ((px % 6 === 0) ? 1 : (ly === 0 ? 0 : 3)); if (ly > 11 && px % 8 === 0) v = 1; col = MP[T.IWALL][v]; }
        else { const lt = ter[TI(tX - 1, tY)], rt = ter[TI(tX + 1, tY)], up = ter[TI(tX, tY - 1)]; const room = t2 => t2 !== T.IWALL && t2 !== T.VOID; let v = -1; if (room(rt) && lx >= 13) v = lx === 15 ? 3 : 1; else if (room(lt) && lx <= 2) v = lx === 0 ? 3 : 1; else if (room(up) && ly <= 2) v = ly === 0 ? 3 : 1; col = v < 0 ? 0xff0a0d14 : MP[T.IWALL][v]; }
      }
    } else {
      const isG = c === T.GRASS; const palA = isG ? null : (MP[c] || MPG);
      const tex = TEX[TEXOF[c] || 'dirt']; let v = tex[ni];
      if ((isG || c === T.SNOW || c === T.SAND || c === T.ASH || c === T.MUD || c === T.DUSK) && mac) { const fx = px / 16 - 0.5, fy = py / 16 - 0.5, tx = Math.floor(fx), ty = Math.floor(fy), u = fx - tx, vv = fy - ty; const m = lerp(lerp(mac[TI(tx, ty)], mac[TI(tx + 1, ty)], u), lerp(mac[TI(tx, ty + 1)], mac[TI(tx + 1, ty + 1)], u), vv) + (BAYER[(py & 3) * 4 + (px & 3)] - 0.5) * 0.08 + (n2[ni] - 0.5) * 0.06; if (m > 0.66) v = Math.min(4, v + 1); else if (m < 0.33) v = Math.max(0, v - 1); }
      const up1 = cls[k - PW], up2 = cls[k - 2 * PW], dn1 = cls[k + PW], dn2 = cls[k + 2 * PW], dn3 = cls[k + 3 * PW];
      if (!isG && (up1 === T.GRASS || up2 === T.GRASS)) v = Math.max(0, v - (up1 === T.GRASS ? 2 : 1));
      if (isG && dn1 !== T.GRASS && isLand(dn1) && dn1 !== T.FACE && dn1 !== T.STAIRS) v = Math.min(4, v + 1);
      if (c === T.BRIDGE) { let hc = 0, vc = 0; for (let d = -3; d <= 3; d++) { if (ter[TI(tX + d, tY)] === T.BRIDGE) hc++; if (ter[TI(tX, tY + d)] === T.BRIDGE) vc++; } if (hc >= vc) { const lx2 = px % 5; v = lx2 === 4 ? 0 : lx2 === 0 ? 3 : 2; if (hash2(Math.floor(px / 5), py, 21) < 0.1) v = 1; if ((py % 20) === 0) v = 0; } }
      if (isLand(c) && (!isLand(dn1) || !isLand(dn2) || !isLand(dn3)) && c !== T.BRIDGE && c !== T.PLANK) { const bp = rk === 'picos' ? RKPS : rk === 'desierto' ? RKPD : rk === 'cristal' ? RKPC : rk === 'eclipse' ? RKPA : RKP; const r = !isLand(dn1) ? 1 : !isLand(dn2) ? 2 : 3; col = bp[r === 1 ? 1 : r === 2 ? 2 : 3]; if (r === 3 && isG) col = gpal ? gpal[ti * 5 + 1] : GP.valle[1]; }
      if (!col) {
        const ltI = TI(tX - 1, tY), rtI = TI(tX + 1, tY), upI = TI(tX, tY - 1); const rimP = rk === 'picos' ? RKPS : rk === 'desierto' ? RKPD : rk === 'cristal' ? RKPC : rk === 'eclipse' ? RKPA : RKP;
        const gcol = s2 => isG ? (gpal ? gpal[ti * 5 + s2] : (GP[rk] || GP.valle)[s2]) : palA[s2];
        if (lvl[ltI] < L && ter[ltI] !== T.STAIRS && lx < 3) col = lx === 0 ? rimP[0] : rimP[lx === 1 ? 3 : 2];
        else if (lvl[rtI] < L && ter[rtI] !== T.STAIRS && lx > 12) col = lx === 15 ? rimP[0] : rimP[lx === 14 ? 1 : 2];
        else if (lvl[upI] < L && ter[upI] !== T.FACE && ly < 2) col = ly === 0 ? rimP[0] : gcol(Math.min(4, v + 1));
        else { if (lvl[ltI] > L && ter[ltI] !== T.FACE && lx < 4) v = Math.max(0, v - (lx < 2 ? 2 : 1)); if ((ter[upI] === T.FACE || ter[upI] === T.FALL) && ly < 5) v = Math.max(0, v - (ly < 2 ? 2 : 1)); col = gcol(clamp(v, 0, 4)); }
      }
    }
    out[yy * P + xx] = col;
  }
  return out;
}
function finishChunk(M, cx, cy, px) {
  const cv = mkCanvas(CHP, CHP), x = cv.getContext('2d'); const id = x.createImageData(CHP, CHP); new Uint32Array(id.data.buffer).set(px); x.putImageData(id, 0, 0);
  if (M.decorate) M.decorate(x, cx, cy); return cv;
}
function renderChunk(M, cx, cy) { return finishChunk(M, cx, cy, chunkPixels(mapData(M), cx, cy)); }
// ---------- chunk worker ----------
const CW = { w: null, pending: new Set(), sent: 0 };
function initChunkWorker(M) {
  try {
    const plain = a => Array.from(a); const pals = o => { const r = {}; for (const k in o) r[k] = plain(o[k]); return r; };
    const src = [`'use strict';`, `const clamp = ${clamp.toString()};`, `const lerp = ${lerp.toString()};`, hash2.toString(), rgbU.toString(), uR.toString(), uG.toString(), uB.toString(), uA.toString(), uMix.toString(),
      `const T = ${JSON.stringify(T)}; const SOFT = ${JSON.stringify(plain(SOFT))}; const MP = ${JSON.stringify(pals(MP))}; const GP = ${JSON.stringify(pals(GP))};`,
      `const RKP = ${JSON.stringify(plain(RKP))}, RKPS = ${JSON.stringify(plain(RKPS))}, RKPA = ${JSON.stringify(plain(RKPA))}, WP = ${JSON.stringify(plain(WP))}, WPS = ${JSON.stringify(plain(WPS))}, RKPD = ${JSON.stringify(plain(RKPD))}, RKPC = ${JSON.stringify(plain(RKPC))}, WPE = ${JSON.stringify(plain(WPE))};`,
      `const TEXOF = ${JSON.stringify(TEXOF)}; const BAYER = ${JSON.stringify(BAYER)}; let TEX = {}; const MAPS = {};`, chunkPixels.toString(),
      `onmessage = e => { const m = e.data; if (m.cmd === 'init') { MAPS[m.D.id] = m.D; if (m.TEX) TEX = m.TEX; return; } const D = MAPS[m.id]; if (!D) return; const out = chunkPixels(D, m.cx, m.cy); postMessage({ id: m.id, cx: m.cx, cy: m.cy, buf: out.buffer }, [out.buffer]); };`].join('\n');
    const w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    w.onmessage = e => { const { id, cx, cy, buf } = e.data; const key = id + ':' + cx + ':' + cy; CW.pending.delete(key); CW.sent = performance.now(); const MM = G.maps[id]; if (!MM) return; const kk = cy * 4096 + cx; if (MM.chunks.has(kk)) return; storeChunk(MM, kk, finishChunk(MM, cx, cy, new Uint32Array(buf))); };
    w.onerror = () => { CW.w = null; CW.pending.clear(); };
    const D = mapData(M); w.postMessage({ cmd: 'init', D: { id: D.id, w: D.w, h: D.h, ter: D.ter, lvl: D.lvl, reg: D.reg, wdist: D.wdist, gpal: D.gpal, mac: D.mac, ftop: D.ftop, fbot: D.fbot, regk: D.regk }, TEX });
    CW.w = w; CW.maps = { [M.id]: 1 };
  } catch (e) { CW.w = null; }
}
function requestChunk(M, cx, cy) {
  const key = M.id + ':' + cx + ':' + cy, t = performance.now();
  if (CW.pending.size && t - CW.sent > 5000) { try { CW.w.terminate(); } catch (e) { } CW.w = null; CW.pending.clear(); return; } // worker silent: fall back to main-thread chunks
  if (CW.pending.has(key) || CW.pending.size >= 4) return; if (!CW.pending.size) CW.sent = t; CW.pending.add(key); CW.w.postMessage({ cmd: 'chunk', id: M.id, cx, cy });
}
// per-tile smoothly blended grass palettes (avoids blocky region borders)
function prepPalettes(M) {
  const w = M.w, h = M.h, N = w * h, R = 4; const keys = REGIONS.map(r => r.k);
  const rgb = REGIONS.map(r => GRASSP[r.k] ? GRASSP[r.k].map(hexRGB) : GRASSP.valle.map(hexRGB));
  M.gpal = new Array(N); const cache = new Map();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const cnt = new Float32Array(REGIONS.length); let tot = 0;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const xx = clamp(x + dx, 0, w - 1), yy = clamp(y + dy, 0, h - 1); const wt = 1 / (1 + dx * dx + dy * dy); let r = M.reg[yy * w + xx]; if (keys[r] === 'mar') r = M.reg[y * w + x]; cnt[r] += wt; tot += wt; }
    let key = ''; for (let r = 0; r < cnt.length; r++) if (cnt[r] > 0) key += r + ':' + Math.round(cnt[r] / tot * 24) + ',';
    let p = cache.get(key);
    if (!p) { p = new Uint32Array(5); for (let s = 0; s < 5; s++) { let cr = 0, cg = 0, cb = 0; for (let r = 0; r < cnt.length; r++) if (cnt[r] > 0) { const f = cnt[r] / tot; cr += rgb[r][s][0] * f; cg += rgb[r][s][1] * f; cb += rgb[r][s][2] * f; } p[s] = rgbU(cr, cg, cb); } cache.set(key, p); }
    M.gpal[y * w + x] = p;
  }
  M.gpalF = new Uint32Array(N * 5); for (let i = 0; i < N; i++) M.gpalF.set(M.gpal[i], i * 5);
  const FC = t => t === T.FACE || t === T.FALL || t === T.STAIRS;
  M.ftop = new Int16Array(N); M.fbot = new Int16Array(N);
  for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) { const i = y * w + x, c = M.ter[i]; if (!FC(c)) continue; let t = y; while (t > 0 && (c === T.STAIRS ? M.ter[(t - 1) * w + x] === T.STAIRS : (M.ter[(t - 1) * w + x] === T.FACE || M.ter[(t - 1) * w + x] === T.FALL))) t--; let b = y; while (b < h - 1 && FC(M.ter[(b + 1) * w + x])) b++; M.ftop[i] = t; M.fbot[i] = b; }
  M.mac = new Float32Array(N); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) M.mac[y * w + x] = fbm(x / 7, y / 7, 77, 3);
}
