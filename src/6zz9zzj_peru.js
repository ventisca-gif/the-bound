// ================= v5.13: PERÚ · LIMA =================
// La Ventisca pintó su propia ciudad (docs/LORE.md §19). Vuelo desde el Aeródromo de Albor por 1.000 de oro, sin nivel.
// Mapa de Lima 480×360 (más grande que Japón, 460×336): Aeropuerto Jorge Chávez (Callao), Río Rímac y Cerro San Cristóbal,
// Centro Histórico con la Plaza de Armas (Palacio de Gobierno, Catedral, Palacio Arzobispal, Municipalidad, portales,
// pileta de bronce, palmeras, faroles, cambio de guardia, palomas), Jirón de la Unión, Plaza San Martín, San Francisco,
// San Isidro (El Olivar), Huaca Pucllana, Miraflores (Parque Kennedy con sus gatos, Virgen Milagrosa, torres), el malecón
// (Parque del Amor, faro, parapente, Puente Villena), la Costa Verde (acantilados, bajadas, Circuito de Playas, playa, surf,
// Rosa Náutica) y Larcomar (terraza en el acantilado y centro comercial con interior).
// Suelo propio pintado por casilla (M.lg tipo, M.lm marcas, M.ld profundidad), edificios lmb_<tipo>_<ancho>_<variante>.
// Peruanos sin nombre propio (Limeño 1, Limeña 2…), salvo los oficios (guía, guardias, vendedores).
const PE_TICKET = 1000;
const LM_W = 720, LM_H = 360;   // 5.14: ampliado al este (Gamarra, San Borja, Surquillo, Surco)
const LM_G = { GRASS: 0, ROAD: 1, WALK: 2, PLAZA: 3, SEA: 4, SAND: 5, CLIFF: 6, PATH: 7, RUN: 8, RIVER: 9, FLOWER: 10, STEP: 11, HILL: 12, TILE: 13, BRIDGE: 14, ADOBE: 15, COBBLE: 16, RAV: 17 };
const LM_COAST = [[0, 128], [30, 170], [70, 222], [120, 262], [170, 282], [230, 292], [719, 292]];
function lmCoast(x) { const C_ = LM_COAST; if (x <= C_[0][0]) return C_[0][1]; for (let i = 1; i < C_.length; i++) if (x <= C_[i][0]) { const [x0, y0] = C_[i - 1], [x1, y1] = C_[i]; return Math.round(y0 + (y1 - y0) * (x - x0) / (x1 - x0)); } return C_[C_.length - 1][1]; }
const LM_HR = [20, 38, 66, 111, 129, 147, 180, 210, 236, 258], LM_VR = [24, 60, 96, 130, 166, 206, 240, 274, 296, 349, 384, 418, 452, 490, 526, 562, 598, 634, 670, 706];
const LM_Q = { term: { x: 40, y: 30, w: 19, h: 4, door: 49 }, park: { x0: 36, x1: 70, y0: 34, y1: 40 }, apron: { x0: 22, x1: 122, y0: 44, y1: 48 }, run: { x0: 14, x1: 128, y0: 54, y1: 57 }, taxiE: 118, taxiW: 26, gates: [52, 68], side: 62, liv: 2 };
const LM_PLAZA = { x0: 302, x1: 348, y0: 72, y1: 110, cx: 325, cy: 91 };
const LM_RAV = { x0: 372, x1: 381, y0: 264, by0: 282, by1: 285 };   // quebrada bajo el Puente Villena
const LM_LARCO = { x0: 298, x1: 338, door: 318 };
const LM_STAIRS = [160, 250, 430];
const LM_PIER = { x0: 344, x1: 346 };
const lmD = (x, y) => y - lmCoast(x);   // <0 tierra, 0..12 acantilado, 13..17 Circuito de Playas, 18 acera, 19..27 playa, 28+ mar

const LM_ZONES = [
  { k: 'larcomar', n: 'Larcomar', s: L2('Centro comercial en el acantilado', 'Cliffside shopping centre'), t: (x, y) => x >= LM_LARCO.x0 && x <= LM_LARCO.x1 && lmD(x, y) >= -3 && lmD(x, y) <= 8 },
  { k: 'costa', n: 'Costa Verde', s: L2('Playas bajo los acantilados', 'Beaches below the cliffs'), t: (x, y) => lmD(x, y) >= 0 },
  { k: 'malecon', n: L2('Malecón de Miraflores', 'Miraflores Boardwalk'), s: L2('Parques sobre el acantilado', 'Parks on the cliff top'), t: (x, y) => lmD(x, y) >= -12 && x >= 110 },
  { k: 'aeropuerto', n: L2('Aeropuerto Jorge Chávez', 'Jorge Chávez Airport'), s: 'Callao', t: (x, y) => x <= 129 && y >= 18 && y <= 65 },
  { k: 'rimac', n: L2('Río Rímac', 'Rímac River'), s: L2('Cerro San Cristóbal', 'San Cristóbal Hill'), t: (x, y) => y <= 19 },
  { k: 'plaza', n: L2('Plaza de Armas de Lima', 'Lima Main Square'), s: L2('Plaza Mayor · fundada en 1535', 'Plaza Mayor · founded in 1535'), t: (x, y) => x >= 278 && x <= 383 && y >= 40 && y <= 116 },
  { k: 'union', n: L2('Jirón de la Unión', 'Jirón de la Unión'), s: L2('Calle peatonal de tiendas', 'Pedestrian shopping street'), t: (x, y) => x >= 316 && x <= 333 && y >= 117 && y <= 146 },
  { k: 'sanmartin', n: L2('Plaza San Martín', 'San Martín Square'), s: L2('Centro de Lima', 'Downtown Lima'), t: (x, y) => x >= 296 && x <= 354 && y >= 147 && y <= 185 },
  { k: 'kennedy', n: L2('Parque Kennedy', 'Kennedy Park'), s: L2('El parque de los gatos', 'The park of the cats'), t: (x, y) => x >= 296 && x <= 354 && y >= 236 && y <= 263 },
  { k: 'olivar', n: L2('Bosque El Olivar', 'El Olivar Grove'), s: 'San Isidro', t: (x, y) => x >= 166 && x <= 245 && y >= 180 && y <= 210 },
  { k: 'huaca', n: 'Huaca Pucllana', s: L2('Pirámide de adobe · año 500', 'Adobe pyramid · year 500'), t: (x, y) => x >= 206 && x <= 245 && y >= 210 && y <= 235 },
  { k: 'centro', n: L2('Centro Histórico de Lima', 'Historic Centre of Lima'), s: L2('Ciudad de los Reyes', 'City of the Kings'), t: (x, y) => x >= 130 && y <= 152 },
  { k: 'miraflores', n: 'Miraflores', s: L2('Torres frente al mar', 'Towers by the sea'), t: (x, y) => y >= 236 && x >= 110 },
  { k: 'sanisidro', n: 'San Isidro', s: L2('Oficinas y parques', 'Offices and parks'), t: (x, y) => x >= 130 },
  { k: 'callao', n: 'Callao', s: L2('Primer puerto', 'First port'), t: () => true },
];
function lmZoneAt(px, py) { const x = px / 16, y = py / 16; return LM_ZONES.find(z => z.t(x, y)) || null; }

// ---------- suelo de Lima ----------
const LMG_PAL = ['#2c7a22', '#38902c', '#44a236', '#52b240', '#64c24c', '#7ad05e'];
let LMG_ID = null, LMG_C = null;
function lmGrass(g, x, y, tx, ty, mown) {
  if (!LMG_C) LMG_C = LMG_PAL.map(h => C(h));
  if (!LMG_ID) LMG_ID = g.createImageData(16, 16); const d = new Uint32Array(LMG_ID.data.buffer), ox = tx * 16, oy = ty * 16;
  for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const wx = ox + i, wy = oy + j;
    let v = jpVN(wx / 64, wy / 64, 501) * 0.5 + jpVN(wx / 18, wy / 18, 502) * 0.32 + hash2(wx, wy, 503) * 0.18;
    if (mown) v += ((wx >> 5) & 1) ? 0.09 : -0.06; v += (JPG_BAY[(wy & 3) * 4 + (wx & 3)] / 16 - 0.47) * 0.1;
    d[j * 16 + i] = LMG_C[v < 0.3 ? 0 : v < 0.4 ? 1 : v < 0.5 ? 2 : v < 0.6 ? 3 : v < 0.7 ? 4 : 5]; }
  g.putImageData(LMG_ID, x, y);
  const h = hash2(tx, ty, 511), h2 = hash2(tx, ty, 512), P_ = (px, py, c) => { g.fillStyle = c; g.fillRect(x + px, y + py, 1, 1); };
  for (let k = 0; k < 4; k++) { const bx = 1 + ((hash2(tx * 5 + k, ty, 513) * 14) | 0), by = 2 + ((hash2(tx, ty * 5 + k, 514) * 13) | 0); P_(bx, by, '#24661c'); P_(bx, by - 1, mown ? '#5cb848' : '#8ad866'); }
  if (!mown && h < 0.07) { const bx = 3 + ((h2 * 10) | 0), by = 3 + ((h * 90) | 0) % 10, fc = ['#ffffff', '#ffe04a', '#ff8ab0'][(h2 * 3) | 0]; P_(bx, by, fc); P_(bx - 1, by, fc); P_(bx + 1, by, fc); P_(bx, by - 1, fc); P_(bx, by, '#ffcc30'); } }
{ const _rc = renderChunk; renderChunk = function (M, cx, cy) { if (!M || !M.lima) return _rc.apply(this, arguments); const [c, g] = XC(CHP, CHP); lmPaint(M, g, cx, cy); return c; }; }
let LMC_ID = null; const LMC_ROCK = ['#5e5040', '#6e5e4a', '#7e6c56', '#8e7c64', '#9e8a70'], LMC_VEG = ['#2e5e22', '#3e6e2a', '#4e8a34', '#62a042'], LMC_C = {};
function lmCliff(g, x, y, tx, ty, dd, side) { if (!LMC_C.r) { LMC_C.r = LMC_ROCK.map(h => C(h)); LMC_C.v = LMC_VEG.map(h => C(h)); } if (!LMC_ID) LMC_ID = g.createImageData(16, 16); const d = new Uint32Array(LMC_ID.data.buffer), ox = tx * 16, oy = ty * 16;
  for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const wx = ox + i, wy = oy + j, n = jpVN(wx / 18, wy / 12, 601) * 0.7 + hash2(wx, wy, 605) * 0.3, st = hash2(wx >> 1, 0, 603), dep = side ? (side === 1 ? i / 16 : 1 - i / 16) : (dd * 16 + j) / 208;
    const veg = jpVN(wx / 24, wy / 20, 602) + (1 - dep) * 0.32 - (side ? 0.1 : 0); let col;
    if (veg > 0.72) col = LMC_C.v[Math.max(0, Math.min(3, ((n - 0.2) * 5) | 0))]; else { let k = Math.max(0, Math.min(4, (n * 5) | 0)); if (st < 0.12) k = Math.max(0, k - 2); if (dep > 0.85) k = Math.max(0, k - 1); col = LMC_C.r[k]; }
    d[j * 16 + i] = col; }
  g.putImageData(LMC_ID, x, y); }
function lmPaint(M, g, cx, cy) { const J = LM_G;
  for (let ty = cy * CH; ty < cy * CH + CH; ty++) for (let tx = cx * CH; tx < cx * CH + CH; tx++) { if (tx >= M.w || ty >= M.h) continue;
    const i = ty * M.w + tx, k = M.lg[i], m = M.lm[i], dd = M.ld[i], x = (tx - cx * CH) * 16, y = (ty - cy * CH) * 16, h = hash2(tx, ty, 81), h2 = hash2(tx, ty, 82), R = (a, b, w, hh, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, hh); };
    switch (k) {
      case J.ROAD: R(0, 0, 16, 16, h < 0.5 ? '#45464c' : '#494a50'); R(((h * 97) | 0) % 14, ((h2 * 53) | 0) % 14, 2, 1, 'rgba(255,255,255,0.07)'); if (h2 < 0.08) R(3, 9, 5, 2, 'rgba(0,0,0,0.12)'); break;
      case J.WALK: R(0, 0, 16, 16, '#c6c0b6'); R(0, 7, 16, 1, '#ada79d'); R(7, 0, 1, 16, '#ada79d'); R(15, 0, 1, 16, '#b4aea4'); R(0, 15, 16, 1, '#b4aea4'); R(0, 0, 16, 1, 'rgba(255,255,255,0.3)'); break;
      case J.PLAZA: { R(0, 0, 16, 16, h < 0.85 ? '#d9cfc2' : '#cfc3b4'); R(0, 15, 16, 1, '#b9ad9e'); R(15, 0, 1, 16, '#b9ad9e'); R(0, 0, 15, 1, 'rgba(255,255,255,0.35)'); if ((tx + ty) % 2 === 0) R(5, 5, 6, 6, 'rgba(160,120,100,0.12)'); break; }
      case J.SEA: { const c = dd < 2 ? '#3e93ae' : dd < 6 ? '#2f7aa0' : '#24618c'; R(0, 0, 16, 16, c); if (h < 0.45) R(((h * 70) | 0) % 10, ((h2 * 90) | 0) % 13, 5, 1, 'rgba(255,255,255,0.18)');
        if (dd === 0) { R(0, 0, 16, 3, 'rgba(255,255,255,0.75)'); R(((h * 9) | 0), 3, 6, 1, 'rgba(255,255,255,0.55)'); } else if (dd === 1) R(((h2 * 9) | 0), 6, 7, 1, 'rgba(255,255,255,0.4)'); break; }
      case J.SAND: { R(0, 0, 16, 16, h < 0.5 ? '#a89e8f' : '#a39888'); for (let q = 0; q < 6; q++) { const px = ((hash2(tx * 7 + q, ty, 83) * 15) | 0), py = ((hash2(tx, ty * 7 + q, 84) * 15) | 0); R(px, py, 2, 1, ['#7e766a', '#c8beb0', '#8e8678', '#d8d0c2'][q % 4]); } break; }
      case J.CLIFF: lmCliff(g, x, y, tx, ty, dd, 0); if (dd === 0) { R(0, 0, 16, 3, '#3e7a2a'); R(0, 3, 16, 1, '#2e5a20'); } if (dd === 12) R(0, 13, 16, 3, 'rgba(30,20,14,0.3)'); break;
      case J.RAV: lmCliff(g, x, y, tx, ty, 4, m === 31 ? 1 : 2); break;
      case J.PATH: { R(0, 0, 16, 16, '#b8664a'); for (let r = 0; r < 4; r++) { R(0, r * 4 + 3, 16, 1, '#9a5038'); R((r % 2) * 4 + 2, r * 4, 1, 3, '#9a5038'); R((r % 2) * 4 + 10, r * 4, 1, 3, '#9a5038'); } R(0, 0, 16, 1, 'rgba(255,255,255,0.18)'); break; }
      case J.RUN: R(0, 0, 16, 16, h < 0.5 ? '#36373d' : '#3a3b41'); break;
      case J.RIVER: { R(0, 0, 16, 16, h < 0.5 ? '#7c6e56' : '#80725a'); if (h < 0.5) R(((h * 60) | 0) % 10, ((h2 * 50) | 0) % 13, 6, 1, 'rgba(230,220,190,0.25)'); if (dd === 1) R(0, 0, 16, 3, '#5e5240'); if (dd === 2) R(0, 13, 16, 3, '#5e5240'); break; }
      case J.FLOWER: { R(0, 0, 16, 16, '#2e6e22'); for (let q = 0; q < 14; q++) { const px = ((hash2(tx * 13 + q, ty, 87) * 15) | 0), py = ((hash2(tx, ty * 13 + q, 88) * 15) | 0), fc = [['#e8283a', '#ff5a6a'], ['#ffd040', '#fff08a'], ['#ff6ab0', '#ffb0d8'], ['#ffffff', '#ffe8f0']][m || 0]; R(px, py, 2, 2, fc[0]); R(px, py, 1, 1, fc[1]); } break; }
      case J.STEP: { for (let r = 0; r < 4; r++) { R(0, r * 4, 16, 2, '#c4beb2'); R(0, r * 4 + 2, 16, 2, '#948e82'); } R(0, 0, 1, 16, '#7a746a'); R(15, 0, 1, 16, '#7a746a'); break; }
      case J.HILL: { R(0, 0, 16, 16, h < 0.5 ? '#a27e5a' : '#9a7654'); if (h2 < 0.8) { const hc = ['#e8c868', '#7ab0d8', '#e88a6a', '#f0f0e0', '#9ad08a', '#d8a0d0', '#f0b050'][(h * 7) | 0], px = ((h * 40) | 0) % 9, py = ((h2 * 40) | 0) % 9; R(px, py, 7, 6, hc); R(px, py, 7, 1, 'rgba(0,0,0,0.25)'); R(px + 1, py + 2, 2, 2, '#3a3040'); R(px + 4, py + 2, 2, 2, '#3a3040'); }
        if (hash2(tx, ty, 89) < 0.5) R(((h2 * 70) | 0) % 12, ((h * 70) | 0) % 12, 4, 3, ['#d8d0b8', '#c8a080', '#88b0c8'][(h2 * 3) | 0]); break; }
      case J.TILE: R(0, 0, 16, 16, h < 0.9 ? '#ebe6dc' : '#e2dccf'); R(0, 7, 16, 1, '#d6d0c4'); R(7, 0, 1, 16, '#d6d0c4'); R(0, 15, 16, 1, '#d0cabe'); R(15, 0, 1, 16, '#d0cabe'); break;
      case J.BRIDGE: R(0, 0, 16, 16, '#c4c0b6'); R(0, 7, 16, 1, '#aeaaa0'); R(((tx * 5) % 12), 2, 3, 1, 'rgba(255,255,255,0.3)'); break;
      case J.ADOBE: { R(0, 0, 16, 16, '#b88a5c'); for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) R(q * 4 + (r % 2 ? 2 : 0), r * 4, 3, 3, (q + r + tx) % 3 ? '#c4966a' : '#a87c50'); break; }
      case J.COBBLE: { R(0, 0, 16, 16, '#cdb79a'); for (let r = 0; r < 4; r++) { R(0, r * 4 + 3, 16, 1, '#b09a7c'); R((r % 2) * 4, r * 4, 1, 3, '#b09a7c'); R((r % 2) * 4 + 8, r * 4, 1, 3, '#b09a7c'); } if ((tx + ty * 3) % 7 === 0) R(4, 4, 8, 8, 'rgba(180,70,60,0.22)'); break; }
      default: lmGrass(g, x, y, tx, ty, m === 20);
    }
    if (m === 1 && tx % 2) R(2, 15, 12, 2, '#f0f0f0'); else if (m === 2 && ty % 2) R(15, 2, 2, 12, '#f0f0f0');
    else if (m === 3) { for (const q of [1, 6, 11]) R(1, q, 14, 3, '#ececec'); } else if (m === 4) { for (const q of [1, 6, 11]) R(q, 1, 3, 14, '#ececec'); }
    else if (m === 5) R(0, 1, 16, 1, '#e8e8e8'); else if (m === 6) R(0, 14, 16, 1, '#e8e8e8'); else if (m === 7 && tx % 3 === 0) R(2, 15, 12, 2, '#f4f4f4'); else if (m === 8) { for (let q = 2; q < 16; q += 4) R(4, q, 8, 2, '#f0f0f0'); }
    else if (m === 9) R(0, 7, 16, 2, '#ffd040'); else if (m === 10) R(7, 0, 2, 16, '#ffd040');
    else if (m === 12) { R(0, 12, 16, 2, '#f4f4f0'); R(0, 14, 16, 1, '#9a9a96'); for (const q of [1, 9]) R(q, 8, 2, 6, '#f4f4f0'); }   // baranda blanca del malecón
    else if (m === 32) R(0, 0, 16, 16, 'rgba(0,0,0,0.22)'); else if (m === 40) { R(0, 0, 16, 3, '#e8ecf0'); R(0, 3, 16, 1, '#8a8e96'); } else if (m === 41) { R(0, 12, 16, 1, '#8a8e96'); R(0, 13, 16, 3, '#e8ecf0'); }
    else if (m === 13) { R(0, 11, 16, 1, 'rgba(200,240,255,0.8)'); R(0, 4, 16, 8, 'rgba(170,220,255,0.28)'); R(0, 4, 16, 1, '#e0f4ff'); }   // baranda de cristal (Larcomar)
  } }
// de noche Lima también oscurece y se encienden los faroles y las ventanas
{ const _dk = darkness; darkness = function () { const M = G.map; if (M && M.lima) { const hh = (G.time / 60) % 24; let d; if (hh >= 20 || hh < 5) d = 1; else if (hh >= 18) d = (hh - 18) / 2; else if (hh < 7) d = 1 - (hh - 5) / 2; else d = 0; return d * 0.58; } return _dk.apply(this, arguments); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl.apply(this, arguments); if (M && M.lima) for (const d of list) if (d && d.k === 'furn' && d.jl) for (const L of d.jl) out.push({ x: d.px + L[0], y: d.py + L[1], r: L[2], c: L[3] }); return out; }; }

// ---------- edificios: lmb_<tipo>_<ancho>_<variante> (se generan al verlos y se guardan) ----------
const lmSh = (hex, f) => { const n = parseInt(hex.slice(1), 16), c = v => Math.max(0, Math.min(255, Math.round(v * f))); return '#' + ((1 << 24) | (c((n >> 16) & 255) << 16) | (c((n >> 8) & 255) << 8) | c(n & 255)).toString(16).slice(1); };
const LM_COL = ['#e8b830', '#d88f32', '#4f7fbf', '#e6d6b4', '#c8643c', '#d9878a', '#7aa86a', '#f0ece0', '#3e9ab0', '#e8c86a', '#b84a4a'];
const LM_H_OF = { col: v => 72 + (v % 3) * 10, portal: () => 92, muni: () => 116, palacio: () => 170, catedral: () => 236, arzob: () => 118, sanfran: () => 196, torre: v => 160 + (v % 4) * 26, depa: v => 112 + (v % 4) * 22, casa: v => 58 + (v % 3) * 10, ofi: v => 128 + (v % 3) * 22, iglesia: () => 150, larco: () => 120, huaca: () => 96, rosa: () => 86 };
{ const _x = genFurn2; genFurn2 = function (kind) { if (typeof kind === 'string' && kind.startsWith('lmb_')) { try { return lmBld(kind); } catch (e) { console.warn(kind, e); } } return _x.apply(this, arguments); }; }
// balcón limeño: caja de madera cerrada con celosía, cornisa y ménsulas
function lmBalcon(g, x, y, w, h) { const R = (a, b, c, d, e) => { g.fillStyle = e; g.fillRect(a, b, c, d); }, up = Math.round(h * 0.56);
  R(x - 3, y - 4, w + 6, 4, '#3a200e'); R(x - 3, y - 4, w + 6, 1, '#8a5a30'); R(x - 1, y, w + 2, h, '#4a2810');
  const np = Math.max(2, Math.round(w / 9)), pw = (w - 2) / np;
  for (let k = 0; k < np; k++) { const px = Math.round(x + 1 + k * pw), ww = Math.max(3, Math.round(pw) - 1);
    R(px, y + 1, ww, up - 2, '#a8743e'); for (let yy = y + 2; yy < y + up - 2; yy++) for (let xx = px; xx < px + ww; xx++) if ((xx + yy) % 3 === 0 || (xx - yy + 99) % 3 === 0) R(xx, yy, 1, 1, '#5a3218');
    R(px, y + 1, ww, 1, '#c89058'); R(px, y + up - 1, ww, 2, '#3a200e');
    R(px, y + up + 1, ww, h - up - 4, '#6e4020'); R(px + 1, y + up + 2, ww - 2, h - up - 6, '#7e4e28'); R(px + 1, y + up + 2, ww - 2, 1, '#9a6a3a'); }
  R(x - 2, y + h - 3, w + 4, 3, '#3a200e'); R(x - 2, y + h - 3, w + 4, 1, '#7a4a24'); g.fillStyle = '#3a200e'; for (let k = 0; k <= 3; k++) { const bx = Math.round(x + k * (w - 4) / 3); g.beginPath(); g.moveTo(bx, y + h); g.lineTo(bx + 4, y + h); g.lineTo(bx + 2, y + h + 5); g.fill(); } }
function lmWin(g, x, y, w, h, lit, bars, arch) { const R = (a, b, c, d, e) => { g.fillStyle = e; g.fillRect(a, b, c, d); };
  R(x - 1, y - 1, w + 2, h + 2, '#f4f0e6'); R(x, y, w, h, lit ? '#ffe2a0' : '#2e4258'); R(x, y, 1, h, lit ? 'rgba(255,255,255,0.5)' : 'rgba(170,210,255,0.35)');
  if (arch) { g.fillStyle = '#f4f0e6'; g.beginPath(); g.ellipse(x + w / 2, y, w / 2 + 1, 4, 0, Math.PI, 0); g.fill(); g.fillStyle = lit ? '#ffe2a0' : '#2e4258'; g.beginPath(); g.ellipse(x + w / 2, y, w / 2, 3, 0, Math.PI, 0); g.fill(); }
  if (bars) { for (let k = x + 2; k < x + w; k += 3) R(k, y, 1, h, '#1a1a1e'); R(x, y + (h >> 1), w, 1, '#1a1a1e'); } else R(x + (w >> 1), y, 1, h, '#f4f0e6'); R(x - 1, y + h + 1, w + 2, 1, 'rgba(0,0,0,0.2)'); }
function lmDoor(g, x, y, w, h, col) { const R = (a, b, c, d, e) => { g.fillStyle = e; g.fillRect(a, b, c, d); }; R(x - 2, y - 2, w + 4, h + 2, '#f2eee4'); g.fillStyle = '#f2eee4'; g.beginPath(); g.ellipse(x + w / 2, y, w / 2 + 2, 6, 0, Math.PI, 0); g.fill();
  R(x, y, w, h, col || '#4a2a14'); g.fillStyle = col || '#4a2a14'; g.beginPath(); g.ellipse(x + w / 2, y, w / 2, 5, 0, Math.PI, 0); g.fill(); R(x + (w >> 1), y - 4, 1, h + 4, '#2a160a'); for (let yy = y + 3; yy < y + h; yy += 5) for (const xx of [x + 2, x + w - 3]) R(xx, yy, 1, 1, '#c8a050'); }
function lmBld(key) { const [, kind, ws, vs] = key.split('_'), w = +ws, v = +vs, W = w * 16, H = LM_H_OF[kind] ? LM_H_OF[kind](v) : 96, [c, g] = XC(W, H), r = n => hash2(w * 17 + n, v * 11 + kind.length, 1301);
  const R = (x, y, ww, hh, col) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); }, txt = (s, x, y, col, sz) => jpText(g, s, Math.round(x), Math.round(y), col, sz || 10), tw = (s, sz) => jpW(s, sz || 10);
  const cornice = (y, col) => { R(0, y, W, 5, '#f2eee4'); R(0, y + 5, W, 1, col); R(0, y - 2, W, 2, '#e2dccf'); for (let x = 2; x < W - 2; x += 6) R(x, y - 6, 3, 4, '#e8e2d4'); R(0, y - 7, W, 1, '#f2eee4'); };
  if (kind === 'col') { const fc = LM_COL[(v * 3 + w) % LM_COL.length], dk = lmSh(fc, 0.78); R(0, 12, W, H - 12, fc); cornice(8, dk); R(0, 12, 3, H - 12, '#f2eee4'); R(W - 3, 12, 3, H - 12, '#f2eee4');
    const fl = Math.round(H * 0.5); R(0, fl, W, 3, '#f2eee4'); R(0, fl + 3, W, 1, dk); R(0, H - 4, W, 4, '#8a8478');
    const nb = W >= 96 ? 2 : 1, bw = Math.min(W - 16, nb === 2 ? (W >> 1) - 14 : Math.max(28, W - 26)), bxs = nb === 2 ? [10, W - 10 - bw] : [(W - bw) >> 1];
    const upFree = []; for (let x = 8; x < W - 14; x += 18) if (!bxs.some(b => x + 10 > b - 4 && x < b + bw + 4)) upFree.push(x); for (const x of upFree) lmWin(g, x, 18, 10, fl - 24, r(x) < 0.12, false, true);
    for (const b of bxs) lmBalcon(g, b, 17, bw, fl - 20);
    const dw = 16, dx = (W - dw) >> 1; lmDoor(g, dx, H - 28, dw, 24); for (let x = 8; x < W - 12; x += 22) { if (x + 12 > dx - 4 && x < dx + dw + 4) continue; lmWin(g, x, fl + 10, 11, H - fl - 20, r(x + 7) < 0.15, true, false); }
    if (r(3) < 0.4) { R(dx - 6, H - 33, dw + 12, 4, ['#c81e3a', '#1a5a3a', '#1a3a6a'][v % 3]); } }
  else if (kind === 'portal') { const fc = '#ecbc38', dk = '#c8982a'; R(0, 10, W, H - 10, fc); cornice(6, dk); const fl = 50; R(0, fl, W, 3, '#f4f0e6');
    for (let bx = 4; bx + 40 <= W; bx += 48) lmBalcon(g, bx, 16, 40, fl - 20);
    for (let x = 0; x < W; x += 24) { R(x, fl + 3, 5, H - fl - 3, '#f4f0e6'); R(x + 5, fl + 12, 19, H - fl - 12, '#3a2a1e'); g.fillStyle = fc; g.beginPath(); g.moveTo(x + 5, fl + 3); g.lineTo(x + 24, fl + 3); g.lineTo(x + 24, fl + 12); g.ellipse(x + 14.5, fl + 12, 9.5, 8, 0, 0, Math.PI, true); g.lineTo(x + 5, fl + 3); g.fill();
      R(x + 8, fl + 18, 13, H - fl - 22, ['#ffd890', '#f0c070', '#ffe8b0'][(x / 24) % 3 | 0]); R(x + 8, fl + 18, 13, 3, ['#c81e3a', '#1a6a8a', '#2a8a4a', '#8a3ab8'][(x / 24 + v) % 4 | 0]); R(x + 10, H - 12, 3, 8, '#8a5a30'); R(x + 16, H - 14, 3, 10, '#5a8ab0'); }
    R(0, H - 3, W, 3, '#8a8478'); }
  else if (kind === 'muni') { const fc = '#ecc04a', dk = '#c89a30'; R(0, 16, W, H - 16, fc); cornice(12, dk); const fl = 60; R(0, fl, W, 3, '#f4f0e6'); R(0, H - 5, W, 5, '#8a8478');
    const cw = 44, cx0 = (W - cw) >> 1; R(cx0, 4, cw, H - 4, '#f2ecdc'); R(cx0 + 4, 4, 2, H - 4, '#d8d0bc'); R(cx0 + cw - 6, 4, 2, H - 4, '#d8d0bc'); g.fillStyle = '#f2ecdc'; g.beginPath(); g.moveTo(cx0 - 2, 6); g.lineTo(W / 2, -4); g.lineTo(cx0 + cw + 2, 6); g.fill();
    g.fillStyle = '#c8102e'; g.beginPath(); g.moveTo(W / 2 - 7, 14); g.lineTo(W / 2 + 7, 14); g.lineTo(W / 2 + 7, 24); g.lineTo(W / 2, 30); g.lineTo(W / 2 - 7, 24); g.fill(); R(W / 2 - 5, 16, 10, 3, '#ffd040'); R(W / 2 - 1, 19, 2, 8, '#ffd040');
    lmDoor(g, cx0 + 10, H - 40, cw - 20, 36, '#3a2010'); lmWin(g, cx0 + 12, 36, cw - 24, 18, false, false, true);
    for (const [a0, a1] of [[4, cx0 - 4], [cx0 + cw + 4, W - 4]]) { const n = Math.max(1, Math.floor((a1 - a0 + 6) / 46)), bw = Math.floor((a1 - a0 - (n - 1) * 6) / n); for (let k = 0; k < n; k++) lmBalcon(g, a0 + k * (bw + 6), 24, bw, fl - 28); } for (let x = 8; x < W - 10; x += 20) { if (x + 12 > cx0 - 2 && x < cx0 + cw + 2) continue; lmWin(g, x, fl + 12, 11, H - fl - 24, false, true, true); } }
  else if (kind === 'palacio') { const fc = '#d8d1c3', st = '#ece7dc', sh = '#bdb4a4', sl = '#4c535c';
    R(0, 46, W, H - 46, fc); for (let y = H - 44; y < H - 4; y += 6) R(0, y, W, 1, sh); R(0, H - 4, W, 4, '#9a9284');
    R(0, 30, W, 16, sl); for (let x = 12; x < W - 12; x += 26) { R(x, 32, 10, 12, st); R(x + 2, 34, 6, 10, '#2e3a48'); } R(0, 44, W, 3, st); for (let x = 2; x < W; x += 5) R(x, 38, 2, 6, 'rgba(255,255,255,0.0)');
    for (let x = 0; x < W; x += 4) R(x, 46, 2, 5, st); R(0, 46, W, 1, st); R(0, 51, W, 2, st);
    for (let x = 14; x < W - 14; x += 24) { lmWin(g, x, 64, 11, 24, false, false, true); R(x - 2, 89, 15, 2, st); lmWin(g, x, H - 36, 11, 20, false, true, true); }
    for (const px of [0, W - 70]) { R(px, 18, 70, H - 18, lmSh(fc, 1.04)); g.fillStyle = sl; g.beginPath(); g.moveTo(px + 4, 22); g.quadraticCurveTo(px + 35, -4, px + 66, 22); g.fill(); R(px + 4, 20, 62, 4, st); R(px + 33, 0, 4, 8, '#3a3a40'); for (let x = px + 10; x < px + 64; x += 18) { lmWin(g, x, 64, 11, 24, false, false, true); lmWin(g, x, H - 36, 11, 20, false, true, true); } }
    const cw = 190, c0 = (W - cw) >> 1; R(c0, 10, cw, H - 10, '#e4ddd0'); g.fillStyle = sl; g.beginPath(); g.moveTo(c0 + 6, 14); g.quadraticCurveTo(W / 2, -10, c0 + cw - 6, 14); g.fill(); R(c0, 12, cw, 5, st); for (let x = c0 + 2; x < c0 + cw; x += 5) R(x, 17, 2, 5, st); R(c0, 22, cw, 2, st);
    for (let k = 0; k < 8; k++) { const x = c0 + 12 + k * 24; R(x, 28, 7, 70, '#f6f2ea'); R(x + 5, 28, 2, 70, sh); R(x - 2, 26, 11, 3, st); R(x - 2, 97, 11, 3, st); if (k < 7) lmWin(g, x + 11, 44, 10, 26, false, false, true); }
    g.fillStyle = '#2a2a30'; g.beginPath(); g.moveTo(W / 2 - 22, H - 4); g.lineTo(W / 2 - 22, H - 42); g.ellipse(W / 2, H - 42, 22, 16, 0, Math.PI, 0); g.lineTo(W / 2 + 22, H - 4); g.fill(); for (let x = W / 2 - 20; x < W / 2 + 20; x += 4) R(x, H - 56, 1, 52, '#4a4a54'); R(W / 2 - 22, H - 30, 44, 2, '#c8a040');
    g.fillStyle = '#f6f2ea'; g.beginPath(); g.ellipse(W / 2, 108, 18, 14, 0, 0, 7); g.fill(); g.fillStyle = '#c8102e'; g.beginPath(); g.moveTo(W / 2 - 9, 100); g.lineTo(W / 2 + 9, 100); g.lineTo(W / 2 + 9, 112); g.lineTo(W / 2, 120); g.lineTo(W / 2 - 9, 112); g.fill(); R(W / 2 - 9, 100, 9, 6, '#7ab0e0'); R(W / 2, 100, 9, 6, '#f4f4f4'); R(W / 2 - 3, 103, 6, 3, '#2a8a3a'); R(W / 2 - 2, 108, 4, 6, '#ffd040'); R(W / 2 - 14, 98, 3, 16, '#3a8a3a'); R(W / 2 + 11, 98, 3, 16, '#3a8a3a');
    R(W / 2 - 1, -0, 2, 10, '#3a3a40'); const t0 = tw('PALACIO DE GOBIERNO'); R(W / 2 - t0 / 2 - 4, 130, t0 + 8, 12, '#2a2a30'); txt('PALACIO DE GOBIERNO', W / 2 - t0 / 2, 131, '#ffe8a0'); }
  else if (kind === 'catedral') { const st = '#e6dbc2', sd = '#d2c4a6', sh = '#b8a888', sl = '#58626e', TW = 72;
    const cx0 = TW - 6, cw = W - 2 * TW + 12; R(cx0, 92, cw, H - 92, sd); for (let y = 100; y < H; y += 7) R(cx0, y, cw, 1, 'rgba(120,100,70,0.15)');
    g.fillStyle = sd; g.beginPath(); g.moveTo(cx0 + 10, 96); g.lineTo(cx0 + cw / 2 - 24, 64); g.quadraticCurveTo(W / 2, 40, cx0 + cw / 2 + 24, 64); g.lineTo(cx0 + cw - 10, 96); g.fill(); R(W / 2 - 2, 34, 4, 14, '#c8a040'); R(W / 2 - 6, 38, 12, 3, '#c8a040');
    R(W / 2 - 66, 66, 132, H - 74, '#c8b894'); R(W / 2 - 66, 66, 132, 3, '#efe6d2'); R(W / 2 - 66, 118, 132, 3, '#efe6d2'); for (let yy = 72; yy < H - 10; yy += 6) R(W / 2 - 64, yy, 128, 1, 'rgba(110,90,60,0.15)');
    for (const k of [-1, 1]) for (let j = 0; j < 3; j++) { const x = W / 2 + k * (30 + j * 12) - 3; R(x, 72 + j * 6, 6, H - 80 - j * 6, '#efe6d2'); R(x + 4, 72 + j * 6, 2, H - 80 - j * 6, sh); R(x - 2, 70 + j * 6, 10, 3, '#f4ecdc'); }
    for (const k of [-1, 1]) for (const yy of [88, 124]) { const x = W / 2 + k * 48 - 6; R(x, yy, 12, 22, '#8a7a60'); R(x + 3, yy + 4, 6, 16, '#c8bca6'); R(x + 4, yy + 2, 4, 4, '#d8ccb6'); }
    g.fillStyle = '#3a2414'; g.beginPath(); g.moveTo(W / 2 - 18, H - 8); g.lineTo(W / 2 - 18, H - 56); g.ellipse(W / 2, H - 56, 18, 16, 0, Math.PI, 0); g.lineTo(W / 2 + 18, H - 8); g.fill(); R(W / 2, H - 70, 1, 62, '#1e1208'); for (let yy = H - 50; yy < H - 10; yy += 8) { R(W / 2 - 14, yy, 10, 1, '#5a3a1e'); R(W / 2 + 4, yy, 10, 1, '#5a3a1e'); }
    R(W / 2 - 22, H - 84, 44, 10, '#efe6d2'); g.fillStyle = '#9ad0e8'; g.beginPath(); g.arc(W / 2, H - 98, 9, 0, 7); g.fill(); g.strokeStyle = '#efe6d2'; g.lineWidth = 2; g.stroke(); g.lineWidth = 1;
    for (const k of [-1, 1]) { const x = W / 2 + k * 76 - 9; g.fillStyle = '#3a2414'; g.beginPath(); g.moveTo(x, H - 8); g.lineTo(x, H - 36); g.ellipse(x + 9, H - 36, 9, 9, 0, Math.PI, 0); g.lineTo(x + 18, H - 8); g.fill(); }
    for (const tx0 of [0, W - TW]) { const tcx = tx0 + TW / 2; R(tx0, 96, TW, H - 96, st); R(tx0, 96, 4, H - 96, sh); R(tx0 + TW - 4, 96, 4, H - 96, sh); for (let y = 110; y < H; y += 8) R(tx0, y, TW, 1, 'rgba(120,100,70,0.12)'); R(tx0 - 2, 94, TW + 4, 4, '#f4ecdc');
      R(tx0 + 6, 52, TW - 12, 44, st); R(tx0 + 4, 50, TW - 8, 4, '#f4ecdc'); for (const ox of [-14, 0, 14]) { g.fillStyle = '#2a2420'; g.beginPath(); g.moveTo(tcx + ox - 5, 88); g.lineTo(tcx + ox - 5, 66); g.ellipse(tcx + ox, 66, 5, 5, 0, Math.PI, 0); g.lineTo(tcx + ox + 5, 88); g.fill(); } R(tcx - 4, 72, 8, 6, '#a88a3a');
      R(tx0 + 14, 28, TW - 28, 24, st); for (const ox of [-8, 8]) { g.fillStyle = '#2a2420'; g.beginPath(); g.moveTo(tcx + ox - 3, 48); g.lineTo(tcx + ox - 3, 36); g.ellipse(tcx + ox, 36, 3, 3, 0, Math.PI, 0); g.lineTo(tcx + ox + 3, 48); g.fill(); } R(tx0 + 12, 26, TW - 24, 3, '#f4ecdc');
      g.fillStyle = sl; g.beginPath(); g.ellipse(tcx, 26, TW / 2 - 16, 16, 0, Math.PI, 0); g.fill(); g.fillStyle = '#6e7a88'; g.beginPath(); g.ellipse(tcx - 5, 22, 6, 9, 0, Math.PI, 0); g.fill(); R(tcx - 3, 4, 6, 8, '#e8e0cc'); g.fillStyle = sl; g.beginPath(); g.ellipse(tcx, 5, 4, 3, 0, Math.PI, 0); g.fill(); R(tcx - 1, -0, 2, 4, '#c8a040'); R(tcx - 3, 1, 6, 1, '#c8a040');
      lmWin(g, tcx - 6, 124, 12, 20, false, false, true); lmWin(g, tcx - 5, H - 40, 10, 16, false, true, true); }
    R(TW - 12, H - 6, W - 2 * TW + 24, 6, '#bab2a2'); R(TW - 12, H - 3, W - 2 * TW + 24, 1, '#9a9282'); }
  else if (kind === 'arzob') { const fc = '#ebe2cf', dk = '#cbbfa6'; R(0, 14, W, H - 14, fc); cornice(10, dk); for (let x = 10; x < W; x += 34) { R(x, 0, 4, 6, '#f2eee4'); R(x - 1, -0, 6, 2, '#e2dccf'); }
    for (const bx of [16, W - 16 - 128]) { R(bx - 4, 18, 136, 44, '#2a160a'); lmBalcon(g, bx, 22, 128, 40); for (let k = 0; k < 4; k++) R(bx + 8 + k * 32, 26, 18, 4, '#9a6a3a'); }
    const cw = 64, c0 = (W - cw) >> 1; R(c0, 18, cw, H - 18, '#f2ecdc'); for (const x of [c0 + 4, c0 + cw - 12]) { R(x, 30, 8, H - 34, '#faf6ee'); R(x + 6, 30, 2, H - 34, dk); } lmDoor(g, c0 + 18, H - 46, cw - 36, 42, '#3a2010'); lmWin(g, c0 + 20, 30, cw - 40, 22, false, false, true);
    for (let x = 12; x < W - 12; x += 22) { if (x + 12 > c0 - 2 && x < c0 + cw + 2) continue; lmWin(g, x, H - 40, 11, 28, false, true, true); } R(0, H - 4, W, 4, '#8a8478'); }
  else if (kind === 'sanfran') { const fc = '#e8b440', st = '#f4f0e4', TW = 60; R(TW - 6, 70, W - 2 * TW + 12, H - 70, fc); g.fillStyle = fc; g.beginPath(); g.moveTo(TW, 74); g.lineTo(W / 2, 46); g.lineTo(W - TW, 74); g.fill(); R(W / 2 - 1, 32, 2, 14, '#5a5a60'); R(W / 2 - 5, 36, 10, 2, '#5a5a60');
    const cw = 76, c0 = (W - cw) >> 1; R(c0, 64, cw, H - 64, '#a49c8c'); for (let y = 70; y < H; y += 10) for (let x = c0 + 4; x < c0 + cw - 4; x += 12) R(x, y, 8, 6, '#8a8272'); g.fillStyle = '#3a2414'; g.beginPath(); g.moveTo(W / 2 - 13, H - 6); g.lineTo(W / 2 - 13, H - 40); g.ellipse(W / 2, H - 40, 13, 11, 0, Math.PI, 0); g.lineTo(W / 2 + 13, H - 6); g.fill(); g.fillStyle = '#9ad0e8'; g.beginPath(); g.arc(W / 2, H - 76, 8, 0, 7); g.fill();
    for (const tx0 of [0, W - TW]) { const tcx = tx0 + TW / 2; R(tx0, 74, TW, H - 74, fc); R(tx0, 74, 3, H - 74, st); R(tx0 + TW - 3, 74, 3, H - 74, st); R(tx0 - 2, 72, TW + 4, 4, st); R(tx0 + 6, 34, TW - 12, 40, fc); R(tx0 + 4, 32, TW - 8, 3, st);
      for (const ox of [-10, 10]) { R(tcx + ox - 5, 42, 10, 26, st); g.fillStyle = '#2a2420'; g.beginPath(); g.moveTo(tcx + ox - 3, 66); g.lineTo(tcx + ox - 3, 48); g.ellipse(tcx + ox, 48, 3, 3, 0, Math.PI, 0); g.lineTo(tcx + ox + 3, 66); g.fill(); }
      g.fillStyle = st; g.beginPath(); g.ellipse(tcx, 32, TW / 2 - 10, 14, 0, Math.PI, 0); g.fill(); g.fillStyle = '#e0d8c4'; g.beginPath(); g.ellipse(tcx + 4, 30, 8, 8, 0, Math.PI, 0); g.fill(); R(tcx - 1, 6, 2, 12, '#5a5a60'); R(tcx - 4, 9, 8, 2, '#5a5a60'); lmWin(g, tcx - 6, 100, 12, 22, false, false, true); }
    R(TW - 10, H - 5, W - 2 * TW + 20, 5, '#bab2a2'); }
  else if (kind === 'torre') { const gl = [['#4a8ab8', '#1e4a78'], ['#3aa0a8', '#1a5a68'], ['#7aa4c8', '#3a5a80'], ['#5a7a9a', '#2a3a58']][v % 4], gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, gl[0]); gr.addColorStop(1, gl[1]); g.fillStyle = gr; g.fillRect(0, 10, W, H - 10);
    if (v % 2) { for (let y = 16; y < H - 24; y += 9) { R(0, y, W, 2, '#e8ecf0'); R(0, y + 2, W, 1, 'rgba(0,0,0,0.2)'); } } else { g.fillStyle = 'rgba(220,240,255,0.25)'; for (let x = 0; x < W; x += 6) g.fillRect(x, 10, 1, H - 10); }
    g.fillStyle = 'rgba(255,255,255,0.2)'; g.beginPath(); g.moveTo(0, 50 + v * 6); g.lineTo(W * 0.7, 10); g.lineTo(W * 0.9, 10); g.lineTo(0, 90 + v * 6); g.fill();
    for (let k = 0; k < 14; k++) if (r(k) < 0.5) R(2 + ((r(k + 40) * (W - 8)) | 0), 18 + ((r(k + 80) * (H - 50)) | 0), 4, 3, '#ffe8a8');
    R(2, 4, W - 4, 7, '#d8dce2'); R(W / 2 - 1, 0, 2, 5, '#c8ccd4'); R(0, H - 22, W, 19, '#2a3440'); for (let x = 2; x < W - 2; x += 10) R(x, H - 20, 8, 16, 'rgba(160,210,255,0.5)'); R(0, H - 3, W, 3, '#6a6660'); }
  else if (kind === 'depa') { const fc = ['#ece6da', '#d8cdb8', '#c4c8cc', '#f2f0ea', '#d8b898'][v % 5]; R(0, 6, W, H - 6, fc); R(0, 0, W, 7, lmSh(fc, 0.8));
    for (let y = 12; y < H - 24; y += 13) { for (let x = 3; x < W - 3; x += 14) { R(x, y, 11, 8, r(x * 5 + y) < 0.15 ? '#ffe2a0' : '#3e5870'); R(x, y, 1, 8, 'rgba(255,255,255,0.4)'); } R(0, y + 8, W, 2, '#f8f8f6'); R(0, y + 10, W, 1, 'rgba(0,0,0,0.18)'); if (v % 3 === 0) R(0, y + 5, W, 3, 'rgba(180,220,240,0.35)'); }
    R(0, H - 22, W, 19, lmSh(fc, 0.86)); R((W >> 1) - 9, H - 20, 18, 17, '#2a3a4a'); R((W >> 1) - 8, H - 19, 7, 16, 'rgba(160,210,255,0.45)'); R(0, H - 3, W, 3, '#6a6660'); if (r(2) < 0.3) R(W - 22, 0, 14, 6, '#3a8a5a'); }
  else if (kind === 'ofi') { const fc = ['#b8b4ac', '#c8c0b0', '#8a96a4', '#d0ccc4'][v % 4]; R(0, 6, W, H - 6, fc); R(0, 0, W, 7, lmSh(fc, 0.75));
    for (let y = 12; y < H - 30; y += 12) { R(2, y, W - 4, 7, '#3a5a78'); R(2, y, W - 4, 2, 'rgba(180,220,255,0.4)'); for (let x = 2; x < W - 2; x += 12) R(x, y, 1, 7, fc); }
    R(0, H - 26, W, 23, '#2a3a4a'); for (let x = 2; x < W - 2; x += 12) R(x, H - 24, 10, 20, 'rgba(150,200,240,0.45)'); R(0, H - 3, W, 3, '#6a6660'); }
  else if (kind === 'casa') { const fc = LM_COL[(v * 5 + w * 3) % LM_COL.length], dk = lmSh(fc, 0.8); R(0, 8, W, H - 8, fc); R(0, 4, W, 5, '#f2eee4'); R(0, 9, W, 1, dk); for (let x = 3; x < W - 3; x += 8) R(x, 0, 4, 4, '#e8e2d4');
    for (let y = 14; y < H - 28; y += 18) for (let x = 5; x < W - 10; x += 16) lmWin(g, x, y, 10, 11, r(x + y) < 0.15, false, false);
    if (v % 2) { const aw = ['#c81e3a', '#1a7a4a', '#1a4a9a', '#e88a1a'][(v + w) % 4]; for (let x = 0; x < W; x += 8) R(x, H - 30, 8, 6, (x / 8) % 2 ? aw : '#ffffff'); R(0, H - 24, W, 21, '#fff2dc'); for (let x = 3; x < W - 3; x += 6) R(x, H - 14, 4, 8, ['#ff8a5a', '#5ab0ff', '#ffd040', '#8aff6a', '#c08aff'][x % 5]); R((W >> 1) - 6, H - 22, 12, 19, '#3a2a1e'); }
    else { lmDoor(g, (W >> 1) - 7, H - 24, 14, 20); for (let x = 4; x < W - 8; x += 16) { if (Math.abs(x + 5 - W / 2) < 14) continue; lmWin(g, x, H - 22, 10, 12, false, true, false); } } R(0, H - 3, W, 3, '#8a8478'); }
  else if (kind === 'iglesia') { const st = '#f4f2ec', sh = '#d8d4ca', rf = '#b8503a'; R(40, 60, W - 40, H - 60, st); g.fillStyle = rf; g.beginPath(); g.moveTo(36, 64); g.lineTo((W + 40) / 2, 30); g.lineTo(W + 2, 64); g.fill(); R(40, 62, W - 40, 3, lmSh(rf, 0.8));
    R(0, 30, 44, H - 30, st); R(40, 30, 4, H - 30, sh); for (const ox of [10, 26]) { g.fillStyle = '#3a3430'; g.beginPath(); g.moveTo(ox - 3, 64); g.lineTo(ox - 3, 46); g.ellipse(ox, 46, 4, 4, 0, Math.PI, 0); g.lineTo(ox + 5, 64); g.fill(); }
    g.fillStyle = '#e8e4dc'; g.beginPath(); g.ellipse(22, 30, 20, 16, 0, Math.PI, 0); g.fill(); g.fillStyle = sh; g.beginPath(); g.ellipse(28, 28, 8, 12, 0, Math.PI, 0); g.fill(); R(21, 4, 2, 12, '#7a7470'); R(18, 8, 8, 2, '#7a7470');
    const cx = (W + 40) / 2; g.fillStyle = '#5a3a24'; g.beginPath(); g.moveTo(cx - 12, H - 4); g.lineTo(cx - 12, H - 34); g.ellipse(cx, H - 34, 12, 10, 0, Math.PI, 0); g.lineTo(cx + 12, H - 4); g.fill(); g.fillStyle = '#7ab8e0'; g.beginPath(); g.arc(cx, 82, 9, 0, 7); g.fill(); g.strokeStyle = sh; g.stroke();
    for (const x of [52, W - 22]) lmWin(g, x, 92, 10, 22, false, false, true); R(0, H - 4, W, 4, '#a8a094'); }
  else if (kind === 'larco') { const wh = '#f2f2ee', gl = 'rgba(170,220,255,0.35)';
    R(0, 0, W, 10, '#4a8a34'); for (let x = 0; x < W; x += 6) R(x + 1, 2, 4, 4, '#5aa040'); R(0, 10, W, 4, wh); for (let x = 0; x < W; x += 8) R(x, 6, 2, 6, wh);
    R(0, 14, W, 50, '#e4e2dc'); for (let x = 6; x < W - 40; x += 46) { R(x, 22, 40, 34, '#2a3440'); R(x + 1, 23, 38, 32, 'rgba(255,230,170,0.55)'); R(x, 18, 40, 6, ['#c81e3a', '#1a5a8a', '#2a2a30', '#e8a020', '#3a8a5a', '#8a3ab8'][((x / 46) | 0) % 6]); }
    R(0, 56, W, 4, wh); R(0, 52, W, 4, gl); R(0, 52, W, 1, '#e0f4ff');
    R(0, 60, W, H - 60, '#efeeea'); for (let x = 4; x < W - 50; x += 58) { R(x, 70, 52, H - 76, '#22303c'); const gr = g.createLinearGradient(0, 70, 0, H); gr.addColorStop(0, 'rgba(255,236,190,0.75)'); gr.addColorStop(1, 'rgba(255,200,130,0.5)'); g.fillStyle = gr; g.fillRect(x + 1, 71, 50, H - 78); R(x, 66, 52, 5, ['#2a2a30', '#c81e3a', '#1a5a8a', '#e8e4dc'][((x / 58) | 0) % 4]); for (let q = 0; q < 4; q++) R(x + 6 + q * 11, H - 22, 6, 14, ['#ff8aa8', '#5ab0ff', '#ffd040', '#8aff6a'][(q + x) % 4]); }
    g.strokeStyle = '#4ac8ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(W - 120, H - 6); g.lineTo(W - 70, 62); g.stroke(); g.strokeStyle = '#bff0ff'; g.lineWidth = 1; g.beginPath(); g.moveTo(W - 118, H - 6); g.lineTo(W - 68, 62); g.stroke();
    const dx = (W >> 1) - 22; R(dx, 74, 44, H - 74, '#2a3440'); R(dx + 2, 76, 19, H - 78, 'rgba(160,220,255,0.55)'); R(dx + 23, 76, 19, H - 78, 'rgba(160,220,255,0.45)');
    const t0 = tw('LARCOMAR', 12); R((W - t0) / 2 - 6, 26, t0 + 12, 18, '#ffffff'); jpText(g, 'LARCOMAR', Math.round((W - t0) / 2), 29, '#c81e3a', 12); R(0, H - 2, W, 2, '#c8c4bc'); }
  else if (kind === 'huaca') { const st = ['#c99a6a', '#c09060', '#b8885a', '#ae7e52', '#a47448'];
    for (let k = 0; k < 5; k++) { const x0 = 8 + k * 30, x1 = W - 8 - k * 26, y1 = H - k * 17, y0 = y1 - 18; R(x0, y0, x1 - x0, 18, st[k]); for (let yy = y0 + 2; yy < y1; yy += 3) for (let xx = x0 + ((yy >> 1) % 2) * 2; xx < x1; xx += 5) R(xx, yy, 1, 2, 'rgba(90,60,30,0.35)'); R(x0, y0, x1 - x0, 2, '#dcb488'); R(x1 - 6, y0, 6, 18, 'rgba(60,40,20,0.25)'); }
    g.strokeStyle = '#e4c49a'; g.lineWidth = 3; g.beginPath(); g.moveTo(40, H - 2); g.lineTo(90, H - 36); g.lineTo(150, H - 52); g.lineTo(200, H - 80); g.stroke(); g.lineWidth = 1;
    for (const [x, y] of [[120, H - 38], [210, H - 72], [300, H - 21]]) { R(x, y - 8, 4, 8, '#3a5a8a'); R(x, y - 11, 4, 3, '#c89070'); R(x - 2, y - 13, 8, 2, '#e8e0c0'); } }
  else if (kind === 'rosa') { const wh = '#f6f4ee'; R(0, H - 10, W, 10, '#7a6a5a'); for (let x = 4; x < W; x += 14) R(x, H - 10, 3, 10, '#5a4a3a'); R(8, 30, W - 16, H - 40, wh);
    for (let x = 14; x < W - 20; x += 16) lmWin(g, x, 42, 10, 14, true, false, true); for (let x = 14; x < W - 20; x += 16) lmWin(g, x, 62, 10, 10, true, false, false);
    for (const [tx0, tw0] of [[8, 34], [W - 42, 34], [W / 2 - 20, 40]]) { R(tx0, 22, tw0, 12, wh); g.fillStyle = '#c8303a'; g.beginPath(); g.moveTo(tx0 - 3, 24); g.lineTo(tx0 + tw0 / 2, tx0 === W / 2 - 20 ? 0 : 6); g.lineTo(tx0 + tw0 + 3, 24); g.fill(); }
    g.fillStyle = '#c8303a'; g.beginPath(); g.moveTo(4, 32); g.lineTo(W - 4, 32); g.lineTo(W - 12, 26); g.lineTo(12, 26); g.fill(); R(8, 76, W - 16, 2, '#c8303a'); }
  return { c, ax: W / 2, ay: H - 1 }; }
function lmBldLights(kind, w) { const a = []; if (kind === 'torre' || kind === 'depa' || kind === 'ofi') a.push([0, -60, 46, 'rgba(255,230,170,0.35)']); else if (kind === 'larco') a.push([0, -30, 140, 'rgba(255,220,150,0.55)'], [-150, -30, 70, 'rgba(255,220,150,0.45)'], [150, -30, 70, 'rgba(255,220,150,0.45)']);
  else if (kind === 'catedral' || kind === 'palacio') a.push([0, -80, 120, 'rgba(255,230,170,0.45)']); else if (kind === 'portal' || kind === 'col' || kind === 'casa') a.push([0, -14, 40, 'rgba(255,200,120,0.45)']); else if (kind === 'rosa') a.push([0, -40, 80, 'rgba(255,220,150,0.55)']); return a; }

// ---------- decorado ----------
XSPR.lm_vacio = () => { const [c] = XC(2, 2); return { c, ax: 1, ay: 1 }; };
function lmPalm(H) { const W = 76, [c, g] = XC(W, H), cx = 38; g.strokeStyle = '#8e887e'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, H); g.quadraticCurveTo(cx + 3, H * 0.5, cx, 20); g.stroke(); g.strokeStyle = '#b4aea2'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - 1, H); g.quadraticCurveTo(cx + 2, H * 0.5, cx - 1, 20); g.stroke();
  g.fillStyle = 'rgba(70,60,50,0.35)'; for (let y = 24; y < H; y += 5) g.fillRect(cx - 1, y, 3, 1); g.fillStyle = '#7a9a4a'; g.fillRect(cx - 2, 14, 5, 10);
  for (let k = 0; k < 15; k++) { const a = -Math.PI - 0.25 + (k / 14) * (Math.PI + 0.5), len = 25 + (k % 3) * 5, ex = cx + Math.cos(a) * len, ey = 16 + Math.sin(a) * len * 0.5 + len * 0.45; g.strokeStyle = k % 2 ? '#2e6e26' : '#3e8a30'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx, 15); g.quadraticCurveTo((cx + ex) / 2, 15 + Math.sin(a) * len * 0.4 - 6, ex, ey); g.stroke();
    g.strokeStyle = '#6ab84a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx, 14); g.quadraticCurveTo((cx + ex) / 2, 14 + Math.sin(a) * len * 0.4 - 6, ex, ey - 1); g.stroke(); }
  return { c, ax: cx, ay: H - 1 }; }
XSPR.lm_palmera0 = () => lmPalm(86); XSPR.lm_palmera1 = () => lmPalm(108); XSPR.lm_palmera2 = () => lmPalm(126);
XSPR.lm_farol = () => { const [c, g] = XC(26, 58), R = (a, b, w, h, col) => { g.fillStyle = col; g.fillRect(a, b, w, h); }; R(11, 14, 3, 40, '#1a1a1e'); R(8, 52, 9, 5, '#2a2a30'); R(9, 30, 7, 2, '#2a2a30');
  for (const [x, y] of [[3, 10], [20, 10], [11, 2], [6, 18], [17, 18]]) { R(x, y, 5, 6, '#2a2a30'); R(x + 1, y + 1, 3, 4, '#fff0b0'); R(x + 1, y - 1, 3, 1, '#1a1a1e'); } R(5, 14, 16, 1, '#1a1a1e'); return { c, ax: 13, ay: 57 }; };
XSPR.lm_poste = () => { const [c, g] = XC(20, 60); g.fillStyle = '#5a5e66'; g.fillRect(9, 8, 2, 52); g.fillRect(9, 6, 9, 2); g.fillStyle = '#e8ecf0'; g.fillRect(14, 8, 5, 2); return { c, ax: 10, ay: 59 }; };
XSPR.lm_pila = () => { const W = 156, H = 136, [c, g] = XC(W, H), cx = 78, R = (a, b, w, h, col) => { g.fillStyle = col; g.fillRect(a, b, w, h); }, E = (x, y, rx, ry, col, a0, a1) => { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, 0, a0 || 0, a1 || 7); g.fill(); };
  const bz = '#5e5230', bz2 = '#7a6a3c', pt = '#4e7a5e', wa = '#3a86b0', wl = 'rgba(210,240,255,0.85)';
  E(cx, H - 16, 76, 18, '#a89e8c'); E(cx, H - 20, 76, 18, '#ddd5c4'); E(cx, H - 20, 70, 14, wa); R(cx - 76, H - 20, 152, 6, '#c8bfae'); E(cx, H - 14, 76, 4, '#a89e8c', 0, Math.PI);
  for (let k = 0; k < 9; k++) R(cx - 60 + k * 14, H - 24 + (k % 2) * 5, 8, 1, 'rgba(255,255,255,0.4)');
  R(cx - 9, 76, 18, H - 96, bz); R(cx - 9, 76, 4, H - 96, bz2); R(cx + 5, 76, 4, H - 96, '#4a4026'); for (const yy of [92, 104]) R(cx - 11, yy, 22, 3, bz2);
  for (const s_ of [-1, 1]) { const lx = cx + s_ * 9; E(lx, 100, 4, 4, '#8a7440'); R(lx - 1, 99, 2, 2, '#3a3020'); g.strokeStyle = wl; g.lineWidth = 1.2; g.beginPath(); g.moveTo(lx, 101); g.quadraticCurveTo(lx + s_ * 22, 98, lx + s_ * 34, H - 22); g.stroke(); }
  E(cx, 78, 42, 11, bz); E(cx, 74, 40, 8, bz2); E(cx, 74, 35, 6, wa); for (let k = -36; k <= 36; k += 8) { R(cx + k, 80, 3, 3, bz); R(cx + k, 83, 1, 2, wl); } E(cx, 80, 42, 3, pt, 0, Math.PI);
  R(cx - 6, 44, 12, 32, bz); R(cx - 6, 44, 3, 32, bz2); E(cx, 46, 22, 6, bz); E(cx, 43, 20, 4, bz2); E(cx, 43, 16, 3, wa); E(cx, 48, 22, 2, pt, 0, Math.PI);
  g.strokeStyle = wl; g.lineWidth = 1; for (const s_ of [-1, 1]) { g.beginPath(); g.moveTo(cx + s_ * 21, 47); g.quadraticCurveTo(cx + s_ * 27, 54, cx + s_ * 30, 72); g.stroke(); g.beginPath(); g.moveTo(cx + s_ * 40, 80); g.quadraticCurveTo(cx + s_ * 50, 90, cx + s_ * 54, H - 24); g.stroke(); }
  R(cx - 3, 26, 6, 18, bz); R(cx - 5, 22, 10, 4, bz2); R(cx - 3, 10, 6, 13, '#6a5a34'); E(cx, 8, 3, 3, '#6a5a34'); R(cx - 9, 12, 6, 3, '#6a5a34'); R(cx - 12, 9, 4, 3, '#6a5a34'); R(cx + 3, 9, 9, 2, '#8a7440'); R(cx + 11, 7, 3, 5, '#8a7440'); R(cx - 1, 11, 1, 10, bz2);
  return { c, ax: cx, ay: H - 8 }; };
XSPR.lm_banca = () => { const [c, g] = XC(30, 18); g.fillStyle = '#2e5a32'; g.fillRect(1, 3, 28, 3); g.fillRect(1, 8, 28, 3); g.fillStyle = '#4a7a4a'; g.fillRect(1, 3, 28, 1); g.fillStyle = '#1a1a1e'; g.fillRect(3, 11, 2, 7); g.fillRect(25, 11, 2, 7); g.fillRect(2, 1, 2, 10); g.fillRect(26, 1, 2, 10); return { c, ax: 15, ay: 17 }; };
XSPR.lm_arbusto = () => { const [c, g] = XC(22, 20); g.fillStyle = '#245e1e'; g.beginPath(); g.ellipse(11, 12, 10, 7, 0, 0, 7); g.fill(); g.fillStyle = '#3a8a2e'; g.beginPath(); g.ellipse(10, 10, 8, 5, 0, 0, 7); g.fill(); g.fillStyle = '#5aae42'; g.fillRect(6, 7, 5, 2); return { c, ax: 11, ay: 18 }; };
XSPR.lm_reja = () => { const [c, g] = XC(16, 24); g.fillStyle = '#1a1a1e'; g.fillRect(0, 6, 16, 2); g.fillRect(0, 18, 16, 2); for (let x = 1; x < 16; x += 3) { g.fillRect(x, 4, 1, 20); g.fillStyle = '#c8a040'; g.fillRect(x, 2, 1, 2); g.fillStyle = '#1a1a1e'; } g.fillStyle = '#c8a040'; g.fillRect(0, 12, 16, 1); return { c, ax: 8, ay: 23 }; };
XSPR.lm_bandera = () => { const [c, g] = XC(30, 84); g.fillStyle = '#d8d8dc'; g.fillRect(3, 4, 2, 80); g.fillStyle = '#c8a040'; g.fillRect(2, 0, 4, 4); g.fillStyle = '#d8102e'; g.fillRect(5, 6, 8, 16); g.fillRect(21, 6, 8, 16); g.fillStyle = '#f4f4f4'; g.fillRect(13, 6, 8, 16); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(5, 18, 24, 4); return { c, ax: 4, ay: 83 }; };
XSPR.lm_beso = () => { const [c, g] = XC(72, 50), R = (a, b, w, h, col) => { g.fillStyle = col; g.fillRect(a, b, w, h); }; g.fillStyle = '#8a7a6a'; g.beginPath(); g.ellipse(36, 42, 34, 8, 0, 0, 7); g.fill();
  g.fillStyle = '#a65a36'; g.beginPath(); g.ellipse(26, 30, 22, 9, -0.25, 0, 7); g.fill(); g.beginPath(); g.ellipse(44, 26, 20, 10, 0.3, 0, 7); g.fill(); g.fillStyle = '#c47448'; g.beginPath(); g.arc(36, 16, 7, 0, 7); g.fill(); g.beginPath(); g.arc(46, 18, 7, 0, 7); g.fill(); g.fillStyle = '#8a4426'; g.fillRect(40, 16, 2, 4); R(10, 36, 10, 4, '#8a4426'); R(56, 34, 10, 4, '#8a4426'); return { c, ax: 36, ay: 48 }; };
XSPR.lm_mosaico = () => { const [c, g] = XC(56, 24), cols = ['#e83a3a', '#ffd040', '#3a8ad8', '#3ab86a', '#ff8ab0', '#ffffff', '#ff8a3a']; for (let x = 0; x < 56; x += 4) { const y = 6 + Math.round(Math.sin(x / 9) * 4); for (let yy = y; yy < y + 14; yy += 4) { g.fillStyle = cols[(x / 4 + yy) % cols.length | 0]; g.fillRect(x, yy, 3, 3); } } g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(0, 22, 56, 2); return { c, ax: 28, ay: 23 }; };
XSPR.lm_faro = () => { const [c, g] = XC(30, 112); for (let y = 30; y < 106; y += 12) { g.fillStyle = (y / 12) % 2 < 1 ? '#c8202e' : '#f4f4f0'; g.fillRect(8 + (y - 30) / 20, y, 14 - (y - 30) / 10, 12); } g.fillStyle = '#e8e8e0'; g.fillRect(3, 104, 24, 8); g.fillStyle = '#2a2a30'; g.fillRect(7, 26, 16, 4); g.fillStyle = '#ffe890'; g.fillRect(9, 14, 12, 12); g.fillStyle = '#2a2a30'; g.fillRect(9, 14, 1, 12); g.fillRect(20, 14, 1, 12); g.fillStyle = '#c8202e'; g.beginPath(); g.moveTo(7, 14); g.lineTo(15, 4); g.lineTo(23, 14); g.fill(); g.fillRect(14, 0, 2, 5); return { c, ax: 15, ay: 111 }; };
XSPR.lm_salvavidas = () => { const [c, g] = XC(30, 48); g.fillStyle = '#8a6a44'; g.fillRect(4, 18, 2, 30); g.fillRect(24, 18, 2, 30); g.fillRect(4, 34, 22, 2); g.fillStyle = '#f4f4f0'; g.fillRect(2, 8, 26, 12); g.fillStyle = '#e83a2a'; g.fillRect(2, 2, 26, 7); g.fillRect(13, 10, 4, 8); g.fillRect(11, 12, 8, 4); return { c, ax: 15, ay: 47 }; };
for (let k = 0; k < 4; k++) XSPR['lm_sombrilla' + k] = () => { const [c, g] = XC(28, 30), cols = [['#e83a3a', '#ffffff'], ['#3a8ad8', '#ffd040'], ['#3ab86a', '#ffffff'], ['#ff8a3a', '#3a3a8a']][k]; g.fillStyle = cols[1]; g.fillRect(4, 22, 18, 7); g.fillStyle = cols[0]; g.fillRect(4, 22, 18, 2); g.fillStyle = '#d8d0c0'; g.fillRect(13, 6, 2, 22); for (let a = 0; a < 6; a++) { g.fillStyle = cols[a % 2]; g.beginPath(); g.moveTo(14, 2); g.lineTo(1 + a * 4.4, 10); g.lineTo(5.4 + a * 4.4, 10); g.fill(); } return { c, ax: 14, ay: 29 }; };
XSPR.lm_tabla = () => { const [c, g] = XC(28, 34); for (const [x, col] of [[4, '#ff8a3a'], [12, '#3ac8e8'], [20, '#ffd040']]) { g.fillStyle = col; g.beginPath(); g.ellipse(x + 3, 15, 3, 14, 0, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.fillRect(x + 2, 6, 1, 18); } return { c, ax: 14, ay: 32 }; };
const LM_CART = { emoliente: ['#3a8a4a', L2('EMOLIENTE', 'EMOLIENTE')], anticuchos: ['#8a3a1a', 'ANTICUCHOS'], picarones: ['#d8903a', 'PICARONES'], ceviche: ['#2a6aa8', 'CEVICHE'], helados: ['#f0d040', L2('HELADOS', 'ICE CREAM')], chicha: ['#5a1a6a', 'CHICHA'] };
for (const k in LM_CART) XSPR['lm_carrito_' + k] = () => { const [col, t] = LM_CART[k], TW_ = jpW(t) + 8, CW = Math.max(40, TW_), [c, g] = XC(CW, 54), ox = (CW - 40) >> 1, R = (a, b, w, h, cc) => { g.fillStyle = cc; g.fillRect(a + ox, b + 14, w, h); };
  g.fillStyle = '#e8e4dc'; g.fillRect(ox + 18, 10, 2, 8); g.fillStyle = col; g.fillRect((CW - TW_) >> 1, 0, TW_, 12); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect((CW - TW_) >> 1, 0, TW_, 1); jpText(g, t, ((CW - TW_) >> 1) + 4, 1, '#ffffff', 10);
  R(2, 14, 34, 16, col); R(2, 14, 34, 2, lmSh(col, 1.3)); R(0, 12, 38, 3, '#e8e4dc'); g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(ox + 9, 47, 5, 0, 7); g.arc(ox + 29, 47, 5, 0, 7); g.fill(); g.fillStyle = '#8a8a90'; g.beginPath(); g.arc(ox + 9, 47, 2, 0, 7); g.arc(ox + 29, 47, 2, 0, 7); g.fill();
  if (k === 'emoliente') for (let q = 0; q < 4; q++) { R(5 + q * 8, 4, 6, 9, ['#e8d890', '#8ad070', '#d87050', '#f0f0e8'][q]); R(5 + q * 8, 4, 6, 2, 'rgba(255,255,255,0.5)'); }
  else if (k === 'anticuchos') { R(4, 8, 30, 4, '#2a2a2a'); for (let q = 0; q < 6; q++) R(6 + q * 5, 6, 2, 6, '#a8401a'); } else if (k === 'helados') { R(4, 2, 30, 11, '#f8f8f0'); R(4, 2, 30, 2, '#c81e3a'); }
  else { R(4, 8, 30, 5, '#d8d0c0'); for (let q = 0; q < 4; q++) R(6 + q * 8, 6, 5, 3, k === 'picarones' ? '#c87a2a' : k === 'chicha' ? '#5a1a6a' : '#f4f0e8'); }
  return { c, ax: CW >> 1, ay: 53 }; };
XSPR.lm_olivo = () => { const [c, g] = XC(40, 46); g.fillStyle = '#6a5a4a'; g.fillRect(18, 22, 4, 24); g.fillRect(14, 30, 4, 3); g.fillRect(22, 27, 5, 3); g.fillStyle = '#5e6e48'; g.beginPath(); g.ellipse(20, 18, 18, 14, 0, 0, 7); g.fill(); g.fillStyle = '#7e8e5e'; for (let k = 0; k < 16; k++) g.fillRect(6 + ((k * 37) % 28), 6 + ((k * 23) % 20), 3, 2); g.fillStyle = '#3a2a3a'; for (let k = 0; k < 5; k++) g.fillRect(8 + k * 6, 14 + (k % 2) * 5, 1, 1); return { c, ax: 20, ay: 45 }; };
XSPR.lm_arbol = () => { const [c, g] = XC(40, 52); g.fillStyle = '#5a4030'; g.fillRect(18, 28, 4, 24); g.fillStyle = '#1e5a22'; g.beginPath(); g.ellipse(20, 20, 18, 17, 0, 0, 7); g.fill(); g.fillStyle = '#2e7a2e'; g.beginPath(); g.ellipse(17, 16, 13, 12, 0, 0, 7); g.fill(); g.fillStyle = '#4a9a3a'; for (let k = 0; k < 10; k++) g.fillRect(8 + ((k * 31) % 22), 8 + ((k * 17) % 16), 3, 2); return { c, ax: 20, ay: 51 }; };
XSPR.lm_cruz = () => { const [c, g] = XC(34, 60); g.fillStyle = '#f4f4f0'; g.fillRect(15, 4, 4, 56); g.fillRect(3, 16, 28, 4); g.fillStyle = '#c8c8c0'; for (let y = 6; y < 58; y += 4) g.fillRect(16, y, 2, 1); for (let x = 5; x < 30; x += 4) g.fillRect(x, 17, 1, 2); return { c, ax: 17, ay: 59 }; };
XSPR.lm_sanmartin = () => { const [c, g] = XC(64, 96), R = (a, b, w, h, col) => { g.fillStyle = col; g.fillRect(a, b, w, h); }; R(12, 50, 40, 46, '#bab2a4'); R(8, 88, 48, 8, '#a8a092'); R(16, 56, 32, 4, '#cfc8ba'); R(14, 46, 36, 6, '#cfc8ba'); R(22, 66, 20, 14, '#3a5a3a');
  const bz = '#3e4a3a'; g.fillStyle = bz; g.beginPath(); g.ellipse(32, 36, 18, 7, 0, 0, 7); g.fill(); R(16, 38, 3, 9, bz); R(22, 38, 3, 9, bz); R(40, 38, 3, 9, bz); R(46, 36, 3, 9, bz); g.beginPath(); g.moveTo(46, 32); g.lineTo(56, 18); g.lineTo(60, 22); g.lineTo(50, 36); g.fill(); R(28, 18, 8, 14, bz); R(29, 12, 6, 6, bz); R(35, 20, 12, 2, bz); R(46, 14, 2, 8, '#c8a040'); return { c, ax: 32, ay: 95 }; };
XSPR.lm_kiosko = () => { const [c, g] = XC(36, 40); g.fillStyle = '#2a6a3a'; g.fillRect(2, 10, 32, 30); g.fillStyle = '#3a8a4a'; g.fillRect(0, 6, 36, 5); for (let k = 0; k < 6; k++) { g.fillStyle = ['#ff5a5a', '#5ab0ff', '#ffd040', '#ffffff', '#ff8ad0', '#8aff6a'][k]; g.fillRect(4 + k * 5, 14, 4, 6); g.fillRect(4 + ((k + 3) % 6) * 5, 22, 4, 6); } return { c, ax: 18, ay: 39 }; };
XSPR.lm_maceta = () => { const [c, g] = XC(22, 34); g.fillStyle = '#f4f4f0'; g.fillRect(4, 22, 14, 12); g.fillStyle = '#d8d8d0'; g.fillRect(4, 31, 14, 3); g.strokeStyle = '#3a8a30'; g.lineWidth = 2; for (const a of [-1.2, -0.6, 0, 0.6, 1.2]) { g.beginPath(); g.moveTo(11, 22); g.quadraticCurveTo(11 + a * 6, 10, 11 + a * 9, 6 + Math.abs(a) * 6); g.stroke(); } return { c, ax: 11, ay: 33 }; };
XSPR.lm_mesa = () => { const [c, g] = XC(36, 42); g.fillStyle = '#c81e2a'; g.beginPath(); g.moveTo(18, 2); g.lineTo(2, 14); g.lineTo(34, 14); g.fill(); g.fillStyle = '#e83a3a'; g.fillRect(2, 14, 32, 3); g.fillStyle = '#ffffff'; for (let x = 4; x < 34; x += 6) g.fillRect(x, 15, 3, 2); g.fillStyle = '#d8d8d0'; g.fillRect(17, 16, 2, 18); g.fillStyle = '#f4f4f0'; g.fillRect(8, 30, 20, 3); g.fillStyle = '#8a8a90'; g.fillRect(4, 32, 4, 9); g.fillRect(28, 32, 4, 9); return { c, ax: 18, ay: 41 }; };
XSPR.lm_puesto = () => { const [c, g] = XC(42, 40), cols = ['#e83a3a', '#ffd040', '#3a8ad8', '#3ab86a', '#ff8ab0', '#8a3ab8', '#ff8a3a']; g.fillStyle = '#7a5a3a'; g.fillRect(3, 6, 2, 34); g.fillRect(37, 6, 2, 34); for (let x = 0; x < 42; x += 6) { g.fillStyle = cols[(x / 6) % cols.length | 0]; g.fillRect(x, 2, 6, 6); }
  g.fillStyle = '#8a6a44'; g.fillRect(2, 24, 38, 4); for (let k = 0; k < 6; k++) { g.fillStyle = cols[(k * 3) % cols.length]; g.fillRect(5 + k * 5, 12, 4, 12); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(5 + k * 5, 14, 4, 1); } return { c, ax: 21, ay: 39 }; };
XSPR.lm_parapente = () => { const [c, g] = XC(30, 56); g.fillStyle = '#d8d8dc'; g.fillRect(4, 4, 2, 52); g.fillStyle = '#ff7a1a'; g.beginPath(); g.moveTo(6, 6); g.lineTo(26, 10); g.lineTo(26, 14); g.lineTo(6, 16); g.fill(); g.fillStyle = '#ffffff'; g.fillRect(12, 7, 4, 8); g.fillRect(20, 9, 3, 5); return { c, ax: 5, ay: 55 }; };
XSPR.lm_cartel = () => { const [c, g] = XC(64, 40); g.fillStyle = '#4a3a2a'; g.fillRect(8, 20, 3, 20); g.fillRect(53, 20, 3, 20); g.fillStyle = '#c8102e'; g.fillRect(0, 2, 64, 20); g.fillStyle = '#f4f4f4'; g.fillRect(21, 2, 22, 20); return { c, ax: 32, ay: 39 }; };
XSPR.lm_panel = () => { const [c, g] = XC(56, 36); g.fillStyle = '#121418'; g.fillRect(0, 0, 56, 30); g.fillStyle = '#4a4e58'; g.fillRect(26, 30, 4, 6); g.fillStyle = '#ffd040'; g.fillRect(0, 0, 56, 9); jpText(g, 'SALIDAS', 3, 0, '#121418', 10); jpText(g, 'ALBOR 13:40', 3, 10, '#ffffff', 10); jpText(g, 'TOKIO 18:15', 3, 20, '#7ad0ff', 10); return { c, ax: 8, ay: 35 }; };
XSPR.ae_panel = () => { const [c, g] = XC(56, 36); g.fillStyle = '#121418'; g.fillRect(0, 0, 56, 30); g.fillStyle = '#4a4e58'; g.fillRect(26, 30, 4, 6); g.fillStyle = '#ffd040'; g.fillRect(0, 0, 56, 9); jpText(g, 'SALIDAS', 3, 0, '#121418', 10); jpText(g, 'TOKIO 13:40', 3, 10, '#ffffff', 10); jpText(g, 'LIMA 14:10', 3, 20, '#ff8a8a', 10); return { c, ax: 8, ay: 35 }; };
XSPR.lm_terminal = () => { const r = XSPR.ae_terminal(), g = r.c.getContext('2d'), W = r.c.width, base = r.c.height - 64, s = 'AEROPUERTO JORGE CHAVEZ · LIMA', w0 = jpW(s); g.fillStyle = '#1a2a40'; g.fillRect(W / 2 - w0 / 2 - 6, base - 21, w0 + 12, 17); jpText(g, s, Math.round(W / 2 - w0 / 2), base - 18, '#ffe8a0', 10); g.fillStyle = '#d8102e'; g.fillRect(W / 2 - w0 / 2 - 6, base - 5, (w0 + 12) / 3, 2); g.fillRect(W / 2 + w0 / 6 + 2, base - 5, (w0 + 12) / 3, 2); return r; };

// ---------- comida de Lima (los platos peruanos pl_* ya existen desde la 4.34) ----------
it('pe_emoliente', { n: 'Emoliente', t: 'cons', stack: true, heal: 2000, mana: 600, price: 300, icon: ['drop', '#c8a040'], rar: 1, d: L2('Bebida caliente de hierbas de los carritos de Lima. Cura vida y maná.', 'Hot herbal drink from the Lima street carts. Restores HP and mana.') });
it('pe_helado', { n: L2('Helado de lúcuma', 'Lúcuma ice cream'), t: 'cons', stack: true, heal: 3000, price: 600, icon: ['potion', '#e8b060'], rar: 1, d: L2('El sabor de helado favorito de Lima. Cura 3.000 de vida.', 'Lima\'s favourite ice cream flavour. Heals 3,000 HP.') });
it('pe_chicharron', { n: L2('Pan con chicharrón', 'Chicharrón sandwich'), t: 'cons', stack: true, heal: 5000, price: 900, icon: ['potion', '#c87a3a'], rar: 1, d: L2('Desayuno limeño con camote frito y salsa criolla. Cura 5.000 de vida.', 'Lima breakfast with fried sweet potato and salsa criolla. Heals 5,000 HP.') });
it('pe_alfajor', { n: 'Alfajor', t: 'cons', stack: true, heal: 1500, price: 200, icon: ['potion', '#f4e8d0'], rar: 0, d: L2('Dos galletas con manjar blanco y azúcar en polvo. Cura 1.500 de vida.', 'Two cookies with dulce de leche and powdered sugar. Heals 1,500 HP.') });
it('pe_cafe', { n: L2('Café pasado', 'Drip coffee'), t: 'cons', stack: true, heal: 1000, mana: 1500, price: 500, icon: ['drop', '#5a3418'], rar: 1, d: L2('Café peruano de la selva, pasado gota a gota. Cura maná.', 'Peruvian jungle coffee, dripped slowly. Restores mana.') });
const PE_SELL = { pe_cart_emoliente: ['pe_emoliente', 'pe_alfajor'], pe_cart_anticuchos: ['pl_anticuchos', 'pl_chicha'], pe_cart_picarones: ['pl_picarones', 'pl_mazamorra'], pe_cart_ceviche: ['pl_ceviche', 'pl_causa'], pe_cart_helados: ['pe_helado'], pe_cart_chicha: ['pl_chicha', 'pe_chicharron'],
  pe_larco_comida: ['pl_ceviche', 'pl_lomo', 'pl_causa', 'pl_ajigallina', 'pl_arrozmariscos', 'pl_suspiro'], pe_larco_cafe: ['pe_cafe', 'pe_alfajor', 'pe_chicharron'], pe_larco_helado: ['pe_helado', 'pl_picarones'], pe_rosa: ['pl_chupe', 'pl_tiradito', 'pl_ceviche', 'pl_suspiro'], pe_cafetera: ['pe_cafe', 'pe_alfajor'] };

// ---------- peruanos: aspectos (dibujo de héroe), sombreros, frases y nombres numerados ----------
const PE_LOOKS = [   // [sexo, aspecto, cosméticos, tipo, sombrero]
  ['m', { skin: 1, hair: 'negro', hs: 0, top: [1, 'blanco'], bot: [0, 'azul'], shoe: [1, 'negro'] }, {}, 'p'], ['f', { skin: 1, hair: 'negro', hs: () => jpHF('liso_largo'), top: [1, 'rojo'], bot: [0, 'azul'], shoe: [1, 'blanco'] }, {}, 'p'],
  ['m', { skin: 2, hair: 'negro', hs: () => jpHM('despeinado'), top: [5, 'negro'], bot: [0, 'gris'], shoe: [1, 'negro'] }, {}, 'p', 'gorra'], ['f', { skin: 2, hair: 'negro', hs: () => jpHF('dos_trenzas'), top: [0, 'rojo'], bot: [2, 'rosa'], shoe: [2, 'negro'] }, {}, 'andina', 'bombin'],
  ['m', { skin: 2, hair: 'negro', hs: 1, top: [5, 'rojo'], bot: [0, 'negro'], shoe: [2, 'marron'] }, {}, 'andino', 'chullo'], ['f', { skin: 1, hair: 'castano', hs: () => jpHF('ondas_lado'), top: [3, 'amarillo'], bot: [2, 'amarillo'], shoe: [1, 'marron'] }, {}, 'p'],
  ['m', { skin: 3, hair: 'negro', hs: () => jpHM('puntas'), top: [1, 'turquesa'], bot: [1, 'azul'], shoe: [2, 'negro'] }, {}, 'surf'], ['f', { skin: 1, hair: 'negro', hs: () => jpHF('coletas_bajas'), top: [1, 'blanco'], bot: [2, 'gris'], shoe: [1, 'negro'] }, {}, 'escolar'],
  ['m', { skin: 1, hair: 'negro', hs: 4, top: [5, 'marino'], bot: [0, 'gris'], shoe: [1, 'negro'] }, { body: 'c_traje_gala' }, 'ofi'], ['f', { skin: 2, hair: 'negro', hs: () => jpHF('mono_suelto'), top: [3, 'verde'], bot: [2, 'verde'], shoe: [1, 'negro'] }, {}, 'p'],
  ['m', { skin: 2, hair: 'castano', hs: () => jpHM('lobo'), top: [1, 'blanco'], bot: [1, 'rojo'], shoe: [1, 'blanco'] }, {}, 'hincha'], ['f', { skin: 3, hair: 'negro', hs: () => jpHF('rizos_flequillo'), top: [1, 'naranja'], bot: [0, 'blanco'], shoe: [1, 'blanco'] }, {}, 'p'],
  ['m', { skin: 0, hair: 'castano', hs: 0, top: [1, 'amarillo'], bot: [1, 'marron'], shoe: [2, 'marron'] }, {}, 'turista', 'paja'], ['f', { skin: 2, hair: 'negro', hs: () => jpHF('dos_trenzas'), top: [5, 'morado'], bot: [2, 'naranja'], shoe: [2, 'negro'] }, {}, 'andina', 'bombin'],
  ['m', { skin: 2, hair: 'negro', hs: 5, top: [2, 'verde'], bot: [0, 'marron'], shoe: [1, 'negro'] }, {}, 'p'], ['f', { skin: 1, hair: 'castano', hs: () => jpHF('bob_capas'), top: [1, 'rosa'], bot: [1, 'azul'], shoe: [2, 'blanco'] }, {}, 'surf'],
  ['m', { skin: 1, hair: 'negro', hs: 2, top: [1, 'blanco'], bot: [0, 'gris'], shoe: [1, 'negro'] }, {}, 'escolar'], ['f', { skin: 1, hair: 'negro', hs: () => jpHF('lisa_raya'), top: [5, 'gris'], bot: [0, 'negro'], shoe: [1, 'negro'] }, {}, 'ofi'],
  ['m', { skin: 3, hair: 'gris', hs: 1, top: [5, 'marron'], bot: [0, 'gris'], shoe: [1, 'marron'] }, {}, 'p', 'paja'], ['f', { skin: 2, hair: 'gris', hs: () => jpHF('mono_suelto'), top: [0, 'azul'], bot: [2, 'azul'], shoe: [2, 'negro'] }, {}, 'andina', 'bombin'],
  ['m', { skin: 2, hair: 'negro', hs: 0, top: [5, 'rojo'], bot: [0, 'marino'], shoe: [0, 'negro'] }, {}, 'guardia', 'casco'],
];
const PE_GUARD_LOOK = PE_LOOKS.length - 1, PE_WALK_N = PE_LOOKS.length - 1;
const peApp = i => { const [g, a, cos] = PE_LOOKS[i % PE_LOOKS.length], o = Object.assign({ g, eyes: i % 3 ? 'cafe' : 'negro', bt: i === PE_GUARD_LOOK ? 0 : i % 4 }, a); if (typeof o.hs === 'function') o.hs = o.hs(); return [o, cos]; };
const PE_APPS_W = []; PE_APPS_W.tag = 'PE'; for (let i = 0; i < PE_WALK_N; i++) Object.defineProperty(PE_APPS_W, i, { get: () => peApp(i), enumerable: true }); PE_APPS_W.length = PE_WALK_N;
const PE_L = [['¡Habla, causa! ¿Primera vez en Lima?', 'Hey, buddy! First time in Lima?'], ['La Plaza de Armas se fundó en 1535. Aquí nació la Ciudad de los Reyes.', 'The Main Square was founded in 1535. The City of the Kings was born here.'],
  ['¿Ya probaste el ceviche? Con su leche de tigre está para chuparse los dedos.', 'Have you tried ceviche yet? With its tiger\'s milk it is finger-licking good.'], ['¡Pucha, qué tráfico! Mejor me voy caminando.', 'Man, what traffic! I\'d better walk.'],
  ['En Miraflores hay un parque lleno de gatos: el Parque Kennedy.', 'In Miraflores there is a park full of cats: Kennedy Park.'], ['La garúa de Lima no moja, pero te deja el pelo como esponja.', 'Lima drizzle does not soak you, but it leaves your hair like a sponge.'],
  ['Al mediodía cambian la guardia en el Palacio de Gobierno. ¡Con banda y todo!', 'At noon they change the guard at Government Palace. With a band and everything!'], ['Desde el malecón se ve el mar y los parapentes. ¡Bacán!', 'From the boardwalk you can see the sea and the paragliders. Awesome!'],
  ['Un emoliente bien calientito en la mañana y quedas como nuevo.', 'A nice hot emoliente in the morning and you are good as new.'], ['¿Larcomar? Baja al malecón de Miraflores: está metido en el acantilado.', 'Larcomar? Go to the Miraflores boardwalk: it is built into the cliff.'],
  ['Los picarones con miel de chancaca son lo máximo.', 'Picarones with chancaca syrup are the best.'], ['¡Arriba Perú! Ese gol del domingo fue de otro planeta.', 'Go Peru! That goal on Sunday was out of this world.'],
  ['Chévere tu ropa. ¿De dónde eres? ¿De Albor? Nunca lo había oído.', 'Cool outfit. Where are you from? Albor? Never heard of it.'], ['En la Costa Verde las olas son buenazas para correr tabla.', 'The waves on the Costa Verde are great for surfing.'],
  ['La Catedral tiene casi quinientos años. Los terremotos la tumbaron y la volvieron a levantar.', 'The Cathedral is almost five hundred years old. Earthquakes knocked it down and it was rebuilt.'], ['Los balcones de madera del centro son de la época del virreinato.', 'The wooden balconies downtown date from the viceroyalty.'],
  ['Una chicha morada bien heladita, por favor.', 'A nice cold chicha morada, please.'], ['Allá arriba está el Cerro San Cristóbal con su cruz. De noche se ve iluminada.', 'Up there is San Cristóbal Hill with its cross. At night it lights up.'],
  ['Dicen que la Ventisca pintó Lima de memoria, porque es su casa. Por eso huele a mar y a anticucho.', 'They say the Ventisca painted Lima from memory, because it is home. That is why it smells of sea and anticuchos.'], ['¡Ya, nos vemos! Cuídate, ¿ya?', 'Okay, see you! Take care, alright?'],
  ['La Huaca Pucllana es más antigua que los incas. ¡Toda de adobe!', 'Huaca Pucllana is older than the Incas. All made of adobe!'], ['Mi abuela hace un ají de gallina que te mueres.', 'My grandma makes an ají de gallina to die for.'],
  ['En el Parque del Amor hay una estatua de una pareja dándose un beso.', 'In the Park of Love there is a statue of a couple kissing.'], ['¡Al fondo hay sitio! ¡Arequipa, Larco, Miraflores! ¡Sube, sube!', 'There is room at the back! Arequipa, Larco, Miraflores! Hop on!'],
  ['Por el Jirón de la Unión se llega caminando hasta la Plaza San Martín.', 'Walk down Jirón de la Unión and you reach San Martín Square.'], ['El Puente Villena cruza la quebrada. Abajo pasan los carros hacia la playa.', 'Villena Bridge spans the ravine. Below, cars drive down to the beach.']];
const PE_LA = [['Allillanchu! (¡hola!, en quechua). Vengo del Cusco a vender mis tejidos.', 'Allillanchu! (hello, in Quechua). I came from Cusco to sell my weavings.'], ['Este chullo lo tejí yo con lana de alpaca. Abriga harto.', 'I knitted this chullo myself with alpaca wool. It is really warm.'], ['Sulpayki (gracias, en quechua).', 'Sulpayki (thank you, in Quechua).']];
const peTx = l => L2(l[0], l[1]);
const PE_NPC_N = 120, PE_NPC_LOOK = {};
{ const cnt = {}; const BASE = { m: L2('Limeño', 'Limeño'), f: L2('Limeña', 'Limeña'), andina: L2('Señora andina', 'Andean woman'), andino: L2('Señor andino', 'Andean man'), surf: L2('Tablista', 'Surfer'), escolar: L2('Escolar', 'Schoolkid'), ofi: L2('Oficinista', 'Office worker'), hincha: L2('Hincha', 'Football fan'), turista: L2('Turista', 'Tourist') };
  for (let n = 1; n <= PE_NPC_N; n++) { const li = (n * 7) % PE_WALK_N, [g, , , kind] = PE_LOOKS[li], kk = kind === 'p' ? g : kind; cnt[kk] = (cnt[kk] || 0) + 1;
    const lines = kind === 'andina' || kind === 'andino' ? [peTx(PE_LA[n % 3]), peTx(PE_L[(n * 3) % PE_L.length])] : [peTx(PE_L[n % PE_L.length]), peTx(PE_L[(n * 7 + 3) % PE_L.length])];
    NPCS['pe_' + n] = { n: BASE[kk] + ' ' + cnt[kk], title: L2('Vecino de Lima', 'Lima local'), look: LK({ g }), lines, quests: [], hat: PE_LOOKS[li][4] }; PE_NPC_LOOK['pe_' + n] = li; } }
const PE_STAFF = {
  pe_taquilla: [L2('Azafata de tierra', 'Ground staff'), 1, L2('Bienvenido al Aeropuerto Jorge Chávez. El vuelo de vuelta a Albor es gratis.', 'Welcome to Jorge Chávez Airport. The flight back to Albor is free.')],
  pe_cafetera: [L2('Barista del aeropuerto', 'Airport barista'), 9, L2('¿Un cafecito pasado antes de volar? Es de la selva central.', 'A drip coffee before your flight? It comes from the central jungle.')],
  pe_guia: [L2('Guía de la Plaza', 'Square guide'), 5, L2('¡Bienvenido a la Plaza de Armas! Pregúntame lo que quieras de Lima.', 'Welcome to the Main Square! Ask me anything about Lima.')],
  pe_guardia: [L2('Guardia del Palacio', 'Palace guard'), PE_GUARD_LOOK, L2('Prohibido el paso. El cambio de guardia es a las doce en punto.', 'No entry. The changing of the guard is at twelve sharp.')],
  pe_guardia2: [L2('Guardia del Palacio', 'Palace guard'), PE_GUARD_LOOK, L2('Firmes. No puedo conversar durante la guardia.', 'Standing to attention. I cannot chat while on guard.')],
  pe_cart_emoliente: [L2('Emolientera', 'Emoliente seller'), 3, L2('¡Emoliente calientito, casero! Con linaza, cebada y uña de gato.', 'Nice hot emoliente! With flaxseed, barley and cat\'s claw.')],
  pe_cart_anticuchos: [L2('Anticuchera', 'Anticucho seller'), 13, L2('Anticuchos de corazón a la parrilla, con su papita y su ají.', 'Grilled heart skewers, with potato and chili.')],
  pe_cart_picarones: [L2('Picaronera', 'Picarones seller'), 19, L2('Picarones de zapallo y camote, recién fritos. ¿Con harta miel?', 'Squash and sweet potato picarones, freshly fried. With lots of syrup?')],
  pe_cart_ceviche: [L2('Cevichero', 'Ceviche seller'), 14, L2('Ceviche de carretilla, pescado del día. ¡Bien picante!', 'Cart ceviche, catch of the day. Nice and spicy!')],
  pe_cart_helados: [L2('Heladero', 'Ice-cream seller'), 12, L2('¡Heladitos! Lúcuma, chirimoya y fresa. ¡Pruébalo, casero!', 'Ice cream! Lúcuma, custard apple and strawberry. Try it!')],
  pe_cart_chicha: [L2('Vendedora de chicha', 'Chicha seller'), 9, L2('Chicha morada de maíz morado con su piña y su canela.', 'Purple-corn chicha with pineapple and cinnamon.')],
  pe_lustra: [L2('Lustrabotas', 'Shoe shiner'), 2, L2('¿Una lustradita, joven? Te dejo los zapatos como espejo.', 'A shoe shine? I will leave your shoes like a mirror.')],
  pe_pintor: [L2('Pintor del parque', 'Park painter'), 5, L2('Pinto el Parque Kennedy todos los días. Los gatos nunca se quedan quietos.', 'I paint Kennedy Park every day. The cats never stay still.')],
  pe_gatera: [L2('Cuidadora de gatos', 'Cat keeper'), 19, L2('A estos michis los cuidamos entre todos los vecinos. Acarícialos con cariño.', 'All the neighbours look after these kitties. Pet them gently.')],
  pe_piloto: [L2('Piloto de parapente', 'Paragliding pilot'), 6, L2('¿Vuelas conmigo sobre la Costa Verde? Aterrizamos en la playa.', 'Fly with me over the Costa Verde? We land on the beach.')],
  pe_surfista: [L2('Instructora de surf', 'Surf instructor'), 15, L2('Las olas de la Costa Verde son de izquierda. ¡Mira a los tablistas!', 'The Costa Verde waves break left. Watch the surfers!')],
  pe_arqueologa: [L2('Arqueóloga de la huaca', 'Huaca archaeologist'), 9, L2('Los Lima hicieron esta pirámide con millones de adobes, como libros en un estante.', 'The Lima people built this pyramid with millions of adobes, like books on a shelf.')],
  pe_larco_comida: [L2('Cocinero del patio de comidas', 'Food court cook'), 0, L2('Comida peruana, la mejor del mundo. ¿Qué te sirvo?', 'Peruvian food, the best in the world. What can I get you?')],
  pe_larco_cafe: [L2('Barista de Larcomar', 'Larcomar barista'), 7, L2('Café con vista al mar. Es lo mejor de Lima al atardecer.', 'Coffee with a sea view. It is the best of Lima at sunset.')],
  pe_larco_helado: [L2('Heladera de Larcomar', 'Larcomar ice-cream seller'), 15, L2('Lúcuma es el sabor de Lima. Si no lo pruebas, no has venido.', 'Lúcuma is the flavour of Lima. If you do not try it, you have not been here.')],
  pe_rosa: [L2('Mozo de la Rosa Náutica', 'Rosa Náutica waiter'), 8, L2('Bienvenido al restaurante sobre el mar. ¿Mesa junto a la ventana?', 'Welcome to the restaurant over the sea. Table by the window?')],
};
for (const id in PE_STAFF) { const [t, li, l] = PE_STAFF[id]; NPCS[id] = { n: t, title: L2('Lima', 'Lima'), look: LK({ g: PE_LOOKS[li][0] }), lines: [l], quests: [], hat: PE_LOOKS[li][4] }; PE_NPC_LOOK[id] = li; }
NPCS.pe_lustra.hat = 'gorra'; NPCS.pe_cart_helados.hat = 'paja'; NPCS.pe_piloto.hat = 'gorra';
{ const _na = npcAtlas; npcAtlas = function (id) { const li = PE_NPC_LOOK[id]; if (li !== undefined) return getAtlas('PEN' + li, () => { const [a, cos] = peApp(li), L = heroLook('guerrero', a, { weapon: 0 }, cos, {}); L.weapon = null; return buildAtlas(L, ['idle', 'walk'], drawHero); }); return _na.apply(this, arguments); }; }
// sombreros pintados encima de la cabeza (bombín andino, chullo, casco de la guardia, gorra, sombrero de paja)
const LM_HATC = ['#c81e3a', '#ffd040', '#2a8a5a', '#e87a1a', '#2a5ad8', '#ffffff'];
function lmHat(kind, x, y, dir, seed) { const R = (a, b, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + a, y + b, w, h); };
  if (kind === 'bombin') { R(-7, 2, 14, 2, '#2a1e16'); R(-4, -4, 8, 6, '#3a2a1e'); R(-3, -5, 6, 1, '#3a2a1e'); R(-4, 0, 8, 1, '#c81e3a'); R(-3, -4, 1, 3, 'rgba(255,255,255,0.18)'); }
  else if (kind === 'chullo') { const c1 = LM_HATC[seed % LM_HATC.length], c2 = LM_HATC[(seed + 2) % LM_HATC.length]; R(-6, -3, 12, 6, c1); R(-5, -5, 10, 2, c1); R(-6, -1, 12, 1, c2); R(-6, 1, 12, 1, '#ffffff'); for (let k = -5; k < 6; k += 3) R(k, -3, 1, 1, c2); R(-1, -8, 2, 3, c2); R(-2, -9, 4, 2, '#ffffff');
    if (dir !== 'right') { R(-7, 2, 2, 6, c1); R(-7, 8, 1, 3, c2); } if (dir !== 'left') { R(5, 2, 2, 6, c1); R(6, 8, 1, 3, c2); } }
  else if (kind === 'casco') { R(-6, -4, 12, 7, '#1a1a1e'); R(-6, 1, 12, 2, '#c8a040'); R(-1, -4, 2, 5, '#c8a040'); R(-2, -11, 4, 7, '#d81e2e'); R(-1, -12, 2, 1, '#ff5a5a'); R(dir === 'left' ? -8 : 5, 2, 3, 1, '#1a1a1e'); }
  else if (kind === 'gorra') { const c1 = LM_HATC[(seed + 1) % LM_HATC.length]; R(-6, -3, 12, 5, c1); R(-5, -4, 10, 1, c1); R(-6, 1, 12, 1, 'rgba(0,0,0,0.25)'); if (dir === 'down') R(-5, 2, 10, 2, lmSh(c1, 0.7)); else if (dir === 'left') R(-10, 1, 5, 2, lmSh(c1, 0.7)); else if (dir === 'right') R(5, 1, 5, 2, lmSh(c1, 0.7)); }
  else if (kind === 'paja') { R(-10, 0, 20, 3, '#3a2a14'); R(-9, 1, 18, 1, '#e8cc78'); R(-6, -5, 12, 6, '#3a2a14'); R(-5, -4, 10, 4, '#f0d888'); R(-5, -1, 10, 1, '#1a1a1e'); R(-9, 3, 18, 1, 'rgba(0,0,0,0.2)'); } }
const LM_HTOP = {};
function lmHatOn(A, kind, sx, sy, dir, seed) { if (!A) return; const k = A.key || ('' + A.fw + 'x' + A.fh + (A.img && A.img.width)); let top = LM_HTOP[k]; if (top === undefined) top = LM_HTOP[k] = atlasHeadTop(A); if (!top) return; lmHat(kind, Math.round(sx), Math.round(sy - top + 4), dir, seed); }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const r = _de.apply(this, arguments); if (e && e.type === 'npc' && e.def && e.def.hat && G.map && (G.map.lima || G.map.peIn)) { try { lmHatOn(npcAtlas(e.id), e.def.hat, e.x - cx, e.y - cy, e.dir || e.face || 'down', (e.id.length * 7 + (+e.id.replace(/\D/g, '') || 0))); } catch (er) { } } return r; }; }

// ---------- el mapa de Lima ----------
const LM_DEPTH = { col: 3, portal: 3, muni: 5, palacio: 8, catedral: 9, arzob: 5, sanfran: 8, torre: 4, depa: 4, ofi: 4, casa: 3, iglesia: 5, larco: 1, huaca: 7, rosa: 3 };
const LM_RES = [[0, 18, 129, 65], [278, 40, 383, 116], [302, 117, 348, 122], [320, 117, 329, 152], [390, 44, 417, 65], [302, 153, 348, 179], [172, 186, 239, 209], [212, 216, 239, 235], [302, 242, 348, 257], [LM_RAV.x0 - 1, 258, LM_RAV.x1 + 1, 359]];
const lmReserved = (x, y) => LM_RES.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d) || lmD(x, y) >= -13;
function makeLima() { if (G.maps.lima) return G.maps.lima; const w = LM_W, h = LM_H, N = w * h, I = (x, y) => y * w + x, J = LM_G;
  const M = { id: 'lima', w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], bossAt: [], halos: [], temples: [], lima: 1,
    lg: new Uint8Array(N), lm: new Uint8Array(N), ld: new Uint8Array(N), aeQ: LM_Q, aeApps: PE_APPS_W };
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h, S = (x, y, k) => { if (inb(x, y)) M.lg[I(x, y)] = k; }, SM = (x, y, m) => { if (inb(x, y)) M.lm[I(x, y)] = m; }, RG = (x0, y0, x1, y1, k) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) S(x, y, k); };
  // cerro, río, tierra, malecón, acantilado, Circuito de Playas, playa y mar
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = I(x, y), d = lmD(x, y); let k = J.GRASS, dd = 0;
    if (y <= 8) { k = J.HILL; dd = y; } else if (y <= 12) k = J.WALK; else if (y <= 17) { k = J.RIVER; dd = y === 13 ? 1 : y === 17 ? 2 : 0; }
    else if (d < 0) { k = x <= 2 ? J.SEA : J.GRASS; if (x <= 2) dd = 3; } else if (d <= 12) { k = J.CLIFF; dd = d; } else if (d <= 17) { k = J.ROAD; if (d === 15) M.lm[i] = 1; } else if (d === 18) k = J.WALK; else if (d <= 27) k = J.SAND; else { k = J.SEA; dd = Math.min(250, d - 28); }
    M.lg[i] = k; M.ld[i] = dd;
    if (d < 0 && d >= -12 && y > 18) { if (x >= 110) { const off = -8; if (d >= -3) { M.lg[i] = J.TILE; if (d === -1) M.lm[i] = 12; } else if (d === off || d === off + 1) M.lg[i] = J.PATH; else M.lm[i] = 20; }
      else if (d >= -3) { M.lg[i] = J.WALK; if (d === -1) M.lm[i] = 12; } } }
  // calles con aceras, línea central y pasos de cebra (se conduce por la derecha)
  const hc = new Uint8Array(N), vc = new Uint8Array(N);
  const road = (x0, y0, x1, y1, hz) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (!inb(x, y) || y < 18 || lmD(x, y) > -13) continue; const i = I(x, y), al = hz ? y - y0 : x - x0; if (al === 0 || al === 5) { if (M.lg[i] !== J.ROAD) M.lg[i] = J.WALK; M.lm[i] = 0; continue; } M.lg[i] = J.ROAD; M.lm[i] = 0; (hz ? hc : vc)[i] = 1; if (al === 2) M.lm[i] = hz ? 1 : 2; } };
  for (const y0 of LM_HR) road(y0 <= 38 ? 130 : 4, y0, w - 6, y0 + 5, true);
  for (const x0 of LM_VR) road(x0, x0 < 130 ? 66 : 18, x0 + 5, h - 1, false);
  road(70, 34, 135, 39, true);   // avenida del aeropuerto
  for (let i = 0; i < N; i++) if (hc[i] && vc[i]) M.lm[i] = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = I(x, y); if (hc[i] && !vc[i] && (vc[i - 1] || vc[i + 1])) M.lm[i] = 3; else if (vc[i] && !hc[i] && (hc[i - w] || hc[i + w])) M.lm[i] = 4; }
  // aeropuerto (mismo reloj de aviones que Albor y Tokio)
  const Q = LM_Q; RG(4, 18, 129, 65, J.GRASS); RG(Q.park.x0, Q.park.y0, Q.park.x1, Q.park.y1, J.WALK); RG(Q.apron.x0, Q.apron.y0, Q.apron.x1, Q.apron.y1, J.RUN); RG(Q.run.x0, Q.run.y0, Q.run.x1, Q.run.y1, J.RUN); for (let y = 18; y <= 65; y++) for (let x = 4; x <= 129; x++) M.lm[I(x, y)] = M.lg[I(x, y)] === J.GRASS ? 20 : 0;
  road(70, 34, 135, 39, true); for (let x = 130; x <= 135; x++) for (let y = 34; y <= 39; y++) M.lm[I(x, y)] = 0;
  for (const tx of [Q.taxiE, Q.taxiW]) { RG(tx - 1, Q.apron.y1, tx + 1, Q.run.y0, J.RUN); for (let y = Q.apron.y1 + 1; y < Q.run.y0; y++) SM(tx, y, 10); }
  for (let x = Q.run.x0; x <= Q.run.x1; x++) { SM(x, Q.run.y0, 5); SM(x, Q.run.y1, 6); SM(x, Q.run.y0 + 1, x <= Q.run.x0 + 2 || x >= Q.run.x1 - 2 ? 8 : 7); if (x <= Q.run.x0 + 2 || x >= Q.run.x1 - 2) SM(x, Q.run.y0 + 2, 8); }
  for (let x = Q.taxiW; x <= Q.taxiE; x++) SM(x, Q.apron.y0 + 2, 9);
  // puentes sobre el Rímac
  for (const bx of [324, 420]) RG(bx, 13, bx + 4, 17, J.BRIDGE);
  // Plaza de Armas: jardines con caminos en cruz y en diagonal, flores rojas y amarillas junto a los caminos
  const PZ = LM_PLAZA, sl = (PZ.y1 - PZ.y0) / (PZ.x1 - PZ.x0);
  const pzPath = (x, y) => { const dx = x - PZ.cx, dy = y - PZ.cy; return x <= PZ.x0 + 1 || x >= PZ.x1 - 1 || y <= PZ.y0 + 1 || y >= PZ.y1 - 1 || Math.abs(dx) <= 1 || Math.abs(dy) <= 1 || Math.abs(Math.abs(dy) - Math.abs(dx) * sl) <= 1.1 || dx * dx + dy * dy <= 49; };
  for (let y = PZ.y0; y <= PZ.y1; y++) for (let x = PZ.x0; x <= PZ.x1; x++) { const i = I(x, y); if (pzPath(x, y)) { M.lg[i] = J.PLAZA; M.lm[i] = 0; continue; } M.lg[i] = J.GRASS; M.lm[i] = 20; const pzMain = (a, b) => { const dx = a - PZ.cx, dy = b - PZ.cy; return a <= PZ.x0 + 1 || a >= PZ.x1 - 1 || b <= PZ.y0 + 1 || b >= PZ.y1 - 1 || Math.abs(dx) <= 1 || Math.abs(dy) <= 1 || dx * dx + dy * dy <= 49; }; if (pzMain(x - 1, y) || pzMain(x + 1, y) || pzMain(x, y - 1) || pzMain(x, y + 1)) { M.lg[i] = J.FLOWER; M.lm[i] = Math.abs(x - PZ.cx) + Math.abs(y - PZ.cy) < 12 ? 1 : 0; } }
  RG(302, 44, 348, 64, J.GRASS); for (let y = 44; y <= 64; y++) for (let x = 302; x <= 348; x++) M.lm[I(x, y)] = 20; RG(302, 63, 348, 65, J.PLAZA); RG(323, 54, 327, 65, J.PLAZA);
  RG(355, 93, 383, 98, J.PLAZA); RG(280, 95, 295, 99, J.PLAZA); RG(302, 117, 348, 119, J.WALK); RG(390, 63, 417, 65, J.PLAZA);
  // Jirón de la Unión (peatonal) y Plaza San Martín
  for (let y = 117; y <= 152; y++) for (let x = 322; x <= 327; x++) { const i = I(x, y); if (M.lg[i] === J.ROAD) { M.lm[i] = 3; continue; } M.lg[i] = J.COBBLE; M.lm[i] = 0; }
  RG(302, 153, 348, 179, J.PLAZA); for (const [x0, y0] of [[306, 156], [331, 156], [306, 170], [331, 170]]) { RG(x0, y0, x0 + 12, y0 + 7, J.GRASS); for (let y = y0; y <= y0 + 7; y++) for (let x = x0; x <= x0 + 12; x++) { M.lm[I(x, y)] = 20; if (y === y0 || y === y0 + 7 || x === x0 || x === x0 + 12) { M.lg[I(x, y)] = J.FLOWER; M.lm[I(x, y)] = 2; } } }
  // El Olivar, Huaca Pucllana y Parque Kennedy
  for (let y = 186; y <= 209; y++) for (let x = 172; x <= 239; x++) { const i = I(x, y); if (vc[i] || M.lg[i] === J.ROAD) continue; M.lg[i] = Math.abs(y - 197 - Math.round(Math.sin(x / 7) * 4)) <= 0 ? J.PATH : J.GRASS; M.lm[i] = 0; }
  RG(212, 216, 239, 235, J.ADOBE);
  for (let y = 242; y <= 257; y++) for (let x = 302; x <= 348; x++) { const i = I(x, y), dx = x - 330, dy = y - 249.5; M.lg[i] = Math.abs(dx) <= 0.5 || Math.abs(dy) <= 0.5 || Math.abs(Math.abs(dy) - Math.abs(dx) * 0.45) <= 0.6 || y === 242 || y === 257 || x === 315 || x === 348 ? J.PATH : J.GRASS; M.lm[i] = M.lg[i] === J.GRASS ? 20 : 0; }
  RG(302, 242, 314, 257, J.PLAZA);
  // quebrada de Armendáriz bajo el Puente Villena, con su bajada de carros a la playa
  const RV = LM_RAV; for (let x = RV.x0; x <= RV.x1; x++) for (let y = RV.y0; y <= lmCoast(x) + 12; y++) { const i = I(x, y), side = x <= RV.x0 + 1 || x >= RV.x1 - 1; M.lg[i] = side ? J.RAV : J.ROAD; M.lm[i] = side ? (x <= RV.x0 + 1 ? 31 : 0) : (x === 376 && y % 2 ? 2 : 32); M.ld[i] = 0; }
  for (let x = RV.x0 - 2; x <= RV.x1 + 2; x++) for (let y = RV.by0; y <= RV.by1; y++) { M.lg[I(x, y)] = J.BRIDGE; M.lm[I(x, y)] = y === RV.by0 ? 40 : y === RV.by1 ? 41 : 0; }
  // bajadas a la playa por escaleras, con paso de cebra en el Circuito de Playas
  for (const sx of LM_STAIRS) for (let x = sx; x <= sx + 2; x++) { const c0 = lmCoast(x); for (let y = c0; y <= c0 + 12; y++) { M.lg[I(x, y)] = J.STEP; M.lm[I(x, y)] = 0; } for (let y = c0 + 13; y <= c0 + 17; y++) M.lm[I(x, y)] = 3; }
  for (let x = RV.x0 + 2; x <= RV.x1 - 2; x++) { const c0 = lmCoast(x); for (let y = c0 + 13; y <= c0 + 17; y++) M.lm[I(x, y)] = 0; }
  // Larcomar: terraza tallada en el acantilado, con baranda de cristal
  for (let x = LM_LARCO.x0; x <= LM_LARCO.x1; x++) { const c0 = lmCoast(x); for (let y = c0; y <= c0 + 8; y++) { M.lg[I(x, y)] = (x <= LM_LARCO.x0 + 2 || x >= LM_LARCO.x1 - 2) && y <= c0 + 2 ? J.STEP : J.TILE; M.lm[I(x, y)] = y === c0 + 8 ? 13 : 0; } }
  // muelle de la Rosa Náutica
  for (let x = LM_PIER.x0; x <= LM_PIER.x1; x++) { const c0 = lmCoast(x); for (let y = c0 + 18; y <= c0 + 41; y++) { M.lg[I(x, y)] = J.BRIDGE; M.lm[I(x, y)] = 0; } }
  if (typeof lmGround2 === 'function') lmGround2(M, { I, J, S, SM, RG, road, hc, vc, inb });
  // colisiones
  for (let i = 0; i < N; i++) { const k = M.lg[i]; if (k === J.SEA || k === J.RIVER) M.ter[i] = T.WATER; else if (k === J.CLIFF || k === J.RAV || k === J.HILL) M.ter[i] = T.IWALL; }
  M.exit = { x: -9, y: -9 }; prepPalettes(M); initMapObjs(M);
  lmBuild(M); G.maps.lima = M; return M; }
function lmBuild(M) { const I = M.I, J = LM_G, w = M.w, h = M.h, inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h, R = new RNG(SEED + 9131);
  const occ = (x, y) => !inb(x, y) || M.objAt[I(x, y)] >= 0 || SOLID_T[M.ter[I(x, y)]];
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  const Fs = (f, x, y, o) => { if (occ(x, y)) return null; return F(f, x, y, null, o); };
  const bld = (kind, x, by, wd, v, skip) => F('lmb_' + kind + '_' + wd + '_' + v, x, by, jpFp(wd, LM_DEPTH[kind] || 3, skip), { px: x * 16 + wd * 8, py: (by + 1) * 16 - 1, jpb: 1, jl: lmBldLights(kind, wd) });
  const free = (x0, y0, x1, y1, res) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (occ(x, y) || (res && lmReserved(x, y))) return false; const k = M.lg[I(x, y)]; if (k === J.ROAD || k === J.WALK || k === J.COBBLE || k === J.PLAZA || k === J.PATH) return false; } return true; };
  const sp = (id, x, y, o) => spawnNPC(id, x * 16 + 8, y * 16 + 8, 'lima', Object.assign({ face: 'down' }, o || {}));
  // aeropuerto
  const Q = LM_Q, TM = Q.term; F('lm_terminal', TM.x, TM.y + TM.h - 1, jpFp(TM.w, TM.h, (x, y) => x === TM.door - TM.x && y === 0), { px: TM.x * 16 + TM.w * 8, py: (TM.y + TM.h) * 16 - 1 });
  F('lm_vacio', TM.door, TM.y + TM.h, null, { solid: false, xact: 'lm_aeropuerto' }); F('ae_torre', 76, 31, jpFp(2, 2), { px: 76 * 16 + 16, py: 32 * 16 - 1 }); F('ae_hangar', 92, 31, jpFp(9, 6), { px: 92 * 16 + 72, py: 32 * 16 - 1 });
  for (const x of [34, 72]) F('lm_bandera', x, 35, null, { px: x * 16 + 8 }); for (let x = 38; x <= 68; x += 6) Fs('lm_palmera0', x, 41);
  // Cerro San Cristóbal y el río
  F('lm_cruz', 330, 5, null, { px: 330 * 16 + 8, jl: [[0, -40, 60, 'rgba(255,255,230,0.5)']] }); for (let x = 140; x < 470; x += 9) { Fs(x % 2 ? 'lm_banca' : 'lm_poste', x, 18); Fs('lm_arbol', x + 4, 10); }
  // Palacio de Gobierno, rejas, banderas y patio
  bld('palacio', 305, 62, 40, 0); for (let x = 302; x <= 348; x++) if (x < 323 || x > 327) F('lm_reja', x, 65); F('lm_bandera', 303, 64); F('lm_bandera', 347, 64);
  for (const x of [304, 346]) for (let y = 45; y <= 60; y += 5) Fs('lm_palmera1', x, y);
  // Catedral, Palacio Arzobispal, Municipalidad, portales y San Francisco
  bld('catedral', 358, 92, 23, 0); bld('arzob', 358, 108, 23, 0); bld('muni', 280, 94, 16, 0); bld('col', 280, 108, 16, 4);
  bld('portal', 302, 122, 20, 0); bld('portal', 328, 122, 21, 1); bld('sanfran', 394, 62, 20, 0);
  for (const x of [356, 382]) Fs('lm_farol', x, 95, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] });
  // la plaza: pileta, palmeras, faroles, bancas
  const PZ = LM_PLAZA; F('lm_pila', PZ.cx - 2, PZ.cy + 1, jpFp(5, 3), { px: PZ.cx * 16 + 8, py: (PZ.cy + 2) * 16 - 2 });
  for (let y = PZ.y0; y <= PZ.y1; y++) for (let x = PZ.x0; x <= PZ.x1; x++) { const k = M.lg[I(x, y)]; if (k !== J.GRASS) continue; const hh = hash2(x, y, 931); if (hh < 0.045) Fs('lm_palmera' + ((x + y) % 3), x, y); else if (hh < 0.06) Fs('lm_arbusto', x, y); }
  for (let k = 0; k < 4; k++) for (const d of [8, 14]) { const a = Math.PI / 4 + k * Math.PI / 2, x = Math.round(PZ.cx + Math.cos(a) * d * 1.15), y = Math.round(PZ.cy + Math.sin(a) * d); Fs('lm_farol', x + (Math.cos(a) > 0 ? 2 : -2), y, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); }
  for (let x = PZ.x0 + 4; x < PZ.x1 - 2; x += 7) { Fs('lm_farol', x, PZ.y0, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); Fs('lm_farol', x, PZ.y1, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); Fs('lm_banca', x + 3, PZ.y0 + 2); Fs('lm_banca', x + 3, PZ.y1 - 2); }
  for (let y = PZ.y0 + 5; y < PZ.y1 - 3; y += 7) { Fs('lm_farol', PZ.x0, y, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); Fs('lm_farol', PZ.x1, y, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); }
  for (const [x, y] of [[PZ.cx - 7, PZ.cy - 2], [PZ.cx + 7, PZ.cy - 2], [PZ.cx - 7, PZ.cy + 3], [PZ.cx + 7, PZ.cy + 3]]) Fs('lm_banca', x, y);
  F('lm_kiosko', 300, 118); 
  // Plaza San Martín
  F('lm_sanmartin', 324, 167, jpFp(3, 2), { px: 325 * 16 + 8, py: 168 * 16 - 1 }); for (const [x, y] of [[312, 160], [337, 160], [312, 173], [337, 173]]) Fs('lm_palmera1', x, y); for (let x = 304; x <= 346; x += 7) { Fs('lm_farol', x, 154, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); Fs('lm_farol', x, 178, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); }
  // Jirón de la Unión: faroles a los lados
  for (let y = 120; y <= 150; y += 6) { if (M.lg[I(322, y)] !== J.COBBLE) continue; Fs('lm_farol', 322, y, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); Fs('lm_farol', 327, y + 3, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); }
  // El Olivar, Huaca Pucllana, Parque Kennedy e iglesia
  for (let y = 186; y <= 209; y++) for (let x = 172; x <= 239; x++) if (M.lg[I(x, y)] === J.GRASS && hash2(x, y, 941) < 0.16) Fs('lm_olivo', x, y);
  bld('huaca', 213, 233, 26, 0); bld('iglesia', 302, 255, 11, 0);
  for (let y = 243; y <= 256; y++) for (let x = 316; x <= 347; x++) if (M.lg[I(x, y)] === J.GRASS && hash2(x, y, 951) < 0.1) Fs(hash2(x, y, 952) < 0.5 ? 'lm_arbol' : 'lm_palmera0', x, y);
  for (let x = 318; x <= 346; x += 6) Fs('lm_puesto', x, 243); for (let x = 317; x < 348; x += 8) Fs('lm_banca', x, 256);
  M.cats = []; for (let k = 0; k < 16; k++) { for (let t = 0; t < 30; t++) { const x = R.int(316, 347), y = R.int(244, 256); if (occ(x, y)) continue; M.cats.push({ x: x * 16 + 8, y: y * 16 + 10, i: k % 8, sit: k % 3 !== 0, ph: R.f() * 6, vx: 0 }); F('lm_vacio', x, y, null, { solid: false, xact: 'lm_gato', cat: M.cats.length - 1 }); break; } }
  // Larcomar, Rosa Náutica y Puente Villena
  const c0 = lmCoast(302); bld('larco', 302, c0 + 1, 33, 0, (x, y) => x === LM_LARCO.door - 302); F('lm_vacio', LM_LARCO.door, c0 + 2, null, { solid: false, xact: 'lm_larcomar' });
  for (let x = LM_LARCO.x0 + 4; x <= LM_LARCO.x1 - 4; x += 6) { if (Math.abs(x - LM_LARCO.door) < 3) continue; Fs('lm_mesa', x, c0 + 5); Fs('lm_maceta', x + 3, c0 + 7); }
  bld('rosa', 340, lmCoast(340) + 45, 11, 0);
  // el malecón: palmeras, bancas, faroles, el Parque del Amor, el faro y el parapente
  for (let x = 112; x < 476; x++) { const c = lmCoast(x); if (x >= LM_RAV.x0 - 2 && x <= LM_RAV.x1 + 2) continue; if (x >= LM_LARCO.x0 && x <= LM_LARCO.x1) { if (x % 6 === 0) Fs('lm_palmera0', x, c - 11); continue; }
    if (x % 7 === 0) Fs('lm_palmera' + (x % 3), x, c - 11 + (x % 2)); if (x % 9 === 4) Fs('lm_banca', x, c - 3); if (x % 12 === 6) Fs('lm_poste', x, c - 2, { jl: [[0, -50, 40, 'rgba(255,240,200,0.5)']] }); if (x % 11 === 2) Fs('lm_arbusto', x, c - 5); }
  { const c = lmCoast(206); F('lm_beso', 206, c - 8, jpFp(3, 1), { px: 207 * 16 + 8 }); for (const [dx, dy] of [[-8, -10], [-5, -5], [5, -5], [8, -10], [0, -12]]) Fs('lm_mosaico', 206 + dx, c + dy); }
  { const c = lmCoast(236); F('lm_faro', 236, c - 7, null, { jl: [[0, -100, 90, 'rgba(255,240,180,0.6)']] }); }
  { const c = lmCoast(190); F('lm_parapente', 188, c - 6); F('lm_vacio', 190, c - 3, null, { solid: false, xact: 'lm_parapente' }); }
  // playa: sombrillas, salvavidas y tablas
  for (let x = 120; x < 476; x++) { const c = lmCoast(x); if (x >= LM_PIER.x0 - 1 && x <= LM_PIER.x1 + 1) continue; const hh = hash2(x, 3, 961); if (hh < 0.12) Fs('lm_sombrilla' + (x % 4), x, c + 20 + ((hh * 60) | 0) % 5); else if (x % 70 === 10) Fs('lm_salvavidas', x, c + 21); else if (hh > 0.96) Fs('lm_tabla', x, c + 22); }
  // carritos de comida con su vendedor
  const carts = [['emoliente', 312, 112], ['anticuchos', 320, 138], ['picarones', 346, 245], ['ceviche', 262, lmCoast(262) + 19], ['helados', 286, lmCoast(286) - 3], ['chicha', 310, 177]];
  for (const [k, x, y] of carts) { F('lm_carrito_' + k, x, y); sp('pe_cart_' + k, x + 1, y + 1); }
  // árboles y postes de las calles, edificios de cada manzana
  for (const y0 of LM_HR) for (let x = 6; x < 474; x += 11) { const y = y0 + 5; if (!inb(x, y) || M.lg[I(x, y)] !== J.WALK || lmReserved(x, y + 1) && y > 112) continue; Fs(y0 >= 180 ? (x % 22 < 11 ? 'lm_arbol' : 'lm_poste') : 'lm_poste', x, y, { jl: [[0, -50, 40, 'rgba(255,240,200,0.45)']] }); }
  const VR = LM_VR.concat([w - 5]), HR = LM_HR.concat([999]);
  for (let i = 0; i < VR.length - 1; i++) for (let j = 0; j < HR.length - 1; j++) { const bx0 = VR[i] + 6, bx1 = VR[i + 1] - 1; let by0 = HR[j] + 6, by1 = HR[j + 1] - 1; if (bx0 < 4 || bx1 > w - 6) continue;
    let cmin = 999; for (let x = bx0; x <= bx1; x++) cmin = Math.min(cmin, lmCoast(x) - 14); by1 = Math.min(by1, cmin); if (by1 - by0 < 3) continue;
    const zc = bx0 >= 480 ? (by1 <= 152 ? 'gamarra' : by0 >= 236 ? (bx0 < 590 ? 'surq' : 'surco') : 'si') : by1 <= 152 && bx0 >= 130 ? 'centro' : bx1 < 130 ? 'callao' : by0 >= 236 ? 'mira' : 'si';
    const KS = { gamarra: ['gama', 'gama', 'casa', 'ofi', 'gama', 'chifa', 'bodega'], surq: ['casa', 'casa', 'depa', 'casa', 'pollo', 'bodega', 'chifa'], surco: ['depa', 'casa', 'torre', 'casa', 'depa', 'pollo'], centro: ['col'], callao: ['casa', 'casa', 'col'], mira: ['torre', 'depa', 'depa', 'casa', 'torre', 'ofi'], si: ['ofi', 'depa', 'casa', 'casa', 'col', 'pollo', 'bodega'] }[zc] || (M.blockKinds && M.blockKinds(zc, bx0, by0)) || ['casa'];
    const row = (by, res) => { let x = bx0; while (x <= bx1) { let wd = R.int(zc === 'centro' ? 5 : 4, zc === 'mira' ? 6 : 8); if (x + wd - 1 > bx1) { if (bx1 - x + 1 >= 3) wd = bx1 - x + 1; else break; } const kind = KS[R.int(0, KS.length - 1)], dp = LM_DEPTH[kind];
        if (free(x, by - dp + 1, x + wd - 1, by, true)) { bld(kind, x, by, wd, R.int(0, 15)); x += wd + (zc !== 'centro' && R.f() < 0.3 ? 1 : 0); } else x++; } };
    { const step = zc === 'mira' ? 7 : zc === 'centro' ? 5 : 6; for (let by = by1; by - 2 >= by0; by -= step) row(by); }
    for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) { const i = I(x, y); if (M.lg[i] !== J.GRASS || lmReserved(x, y)) continue; if (zc === 'centro' || zc === 'callao') { M.lg[i] = J.WALK; M.lm[i] = 0; if (hash2(x, y, 973) < 0.03) Fs('lm_maceta', x, y); } else if (hash2(x, y, 971) < 0.06) Fs(zc === 'mira' && hash2(x, y, 972) < 0.4 ? 'lm_palmera0' : 'lm_arbol', x, y); } }
  // gente de Lima
  const walkable = (x, y) => { if (occ(x, y)) return false; const k = M.lg[I(x, y)]; return k !== J.ROAD && k !== J.RUN && k !== J.SEA && k !== J.RIVER; };
  const put = (id, cx, cy, rr) => { for (let t = 0; t < 60; t++) { const x = cx + R.int(-rr, rr), y = cy + R.int(-rr, rr); if (!inb(x, y) || !walkable(x, y)) continue; sp(id, x, y, { wander: 4 }); return; } };
  const SPOTS = [[PZ.cx, PZ.cy, 18, 34], [324, 135, 8, 10], [325, 166, 12, 8], [250, 120, 30, 6], [420, 100, 30, 6], [350, 40, 30, 4], [205, 197, 18, 8], [226, 236, 8, 2], [330, 250, 14, 10], [250, lmCoast(250) - 6, 20, 6], [320, lmCoast(320) - 6, 18, 5], [420, lmCoast(420) - 6, 20, 3], [260, lmCoast(260) + 22, 25, 6], [400, lmCoast(400) + 22, 25, 4], [70, 100, 30, 4], [300, 10, 30, 4], [320, lmCoast(320) + 3, 12, 0]];
  let n = 1; for (const [x, y, r, c] of SPOTS) for (let k = 0; k < c && n <= PE_NPC_N; k++) put('pe_' + n++, x, y, r); while (n <= PE_NPC_N) put('pe_' + n++, PZ.cx, PZ.cy, 20);
  sp('pe_taquilla', TM.door - 4, TM.y + TM.h + 2); sp('pe_guia', PZ.cx - 3, PZ.cy + 6, { wander: 1 }); sp('pe_guardia', 322, 66); sp('pe_guardia2', 328, 66); sp('pe_lustra', 312, 118);
  sp('pe_pintor', 333, 251, { wander: 1 }); sp('pe_gatera', 322, 247, { wander: 2 }); { const c = lmCoast(190); sp('pe_piloto', 191, c - 4); } { const c = lmCoast(300); sp('pe_surfista', 300, c + 23, { wander: 2 }); } sp('pe_arqueologa', 226, 235, { wander: 1 }); { const c = lmCoast(345); sp('pe_rosa', 345, c + 40); }
  // guardias que desfilan en el patio y palomas junto a la pileta
  M.guards = []; for (let k = 0; k < 8; k++) M.guards.push({ k, x: (308 + k * 4.5) * 16 + 8, y: 63 * 16 + 10, A: null, dir: 'down', mv: 0, ph: k });
  M.doves = []; for (let k = 0; k < 22; k++) { const a = R.f() * 6.28, d = 4 + R.f() * 8; M.doves.push({ hx: (PZ.cx + Math.cos(a) * d * 1.2) * 16, hy: (PZ.cy + Math.sin(a) * d) * 16, x: 0, y: 0, z: 0, fly: 0, ph: R.f() * 6 }); }
  for (const d of M.doves) { d.x = d.hx; d.y = d.hy; }
  if (typeof lmBuild2 === 'function') lmBuild2(M, { F, Fs, bld, sp, put, occ, free, R });
  lmCarsInit(M); }

// ---------- tráfico: autos, taxis y combis (por la derecha; paran ante el jugador y ante el de delante) ----------
const LM_CARS = [], LM_LANES = [], LM_CCOL = ['#e8ecf2', '#1a1c24', '#c8102e', '#2a5ad8', '#8a8e98', '#3aa04a', '#e8ecf2', '#7a1a2a', '#d8d0c0'];
function lmCarsInit(M) { const LM_CARS = M.lcars = [], LM_LANES = M.llanes = [], HRs = M.HR || LM_HR, VRs = M.VR || LM_VR; const R = new RNG(SEED + 9202), I = M.I, J = LM_G, isR = (x, y) => x >= 0 && y >= 0 && x < M.w && y < M.h && M.lg[I(x, y)] === J.ROAD;
  const runs = (n, get) => { const out = []; let a = -1; for (let k = 0; k <= n; k++) { const ok = k < n && get(k); if (ok && a < 0) a = k; else if (!ok && a >= 0) { if (k - a > 12) out.push([a, k - 1]); a = -1; } } return out; };
  for (const y0 of HRs) for (const [a, b] of runs(M.w, x => isR(x, y0 + 2) && isR(x, y0 + 3))) LM_LANES.push({ hz: 1, c: [(y0 + 2) * 16 + 4, (y0 + 4) * 16 - 2], a: a * 16 + 8, b: b * 16 + 8 });
  for (const x0 of VRs) for (const [a, b] of runs(M.h, y => isR(x0 + 2, y) && isR(x0 + 3, y))) LM_LANES.push({ hz: 0, c: [(x0 + 4) * 16 - 2, (x0 + 2) * 16 + 2], a: a * 16 + 8, b: b * 16 + 8 });
  if (M.id === 'lima') LM_LANES.push({ hz: 1, coast: 1, c: [0, 0], a: 234 * 16, b: 714 * 16 });
  const tot = LM_LANES.reduce((s, L) => s + (L.b - L.a), 0);
  for (let k = 0; k < (M.nCars || 96); k++) { let r = R.f() * tot, L = LM_LANES[0]; for (const q of LM_LANES) { r -= q.b - q.a; if (r <= 0) { L = q; break; } } const t = R.f();
    LM_CARS.push({ L, d: R.f() < 0.5 ? 1 : -1, s: L.a + R.f() * (L.b - L.a), v: 0, combi: t < 0.2, taxi: t >= 0.2 && t < 0.42, col: R.int(0, LM_CCOL.length - 1), rc: R.int(0, 4), hb: 0 }); } }
const lmCarXY = c => { const L = c.L; if (L.coast) { const cc = lmCoast(Math.round(c.s / 16)); return [c.s, (cc + (c.d > 0 ? 16 : 14)) * 16 + (c.d > 0 ? -2 : 4)]; } return L.hz ? [c.s, L.c[c.d > 0 ? 1 : 0]] : [L.c[c.d > 0 ? 1 : 0], c.s]; };
function lmCarsTick(dt) { const M = G.map, P = G.P; if (!M || !M.lima || !P || !M.lcars) return; const LM_CARS = M.lcars;
  for (const c of LM_CARS) { const [x, y] = lmCarXY(c), hz = c.L.hz; let stop = false; const px = P.x - x, py = P.y - y;
    if (hz ? (px * c.d > 0 && px * c.d < 44 && Math.abs(py) < 15) : (py * c.d > 0 && py * c.d < 48 && Math.abs(px) < 13)) stop = true;
    if (!stop) for (const o of LM_CARS) { if (o === c || o.L !== c.L || o.d !== c.d) continue; const ds = (o.s - c.s) * c.d; if (ds > 0 && ds < (c.combi || o.combi ? 60 : 46)) { stop = true; break; } }
    const V = c.combi ? 66 : c.taxi ? 84 : 76; c.v += ((stop ? 0 : V) - c.v) * Math.min(1, dt * (stop ? 8 : 2)); c.s += c.d * c.v * dt;
    if (stop && c.v < 4) { c.hb += dt; if (c.hb > 2.5) { c.hb = -6 - Math.random() * 6; c.honk = G.t; } } else if (c.hb > 0) c.hb = 0; else c.hb = Math.min(0, c.hb + dt);
    if (c.s > c.L.b) { c.s = c.L.b; c.d = -1; } else if (c.s < c.L.a) { c.s = c.L.a; c.d = 1; } } }
V33_TICKS.push(dt => lmCarsTick(Math.min(0.05, dt || 0)));
function lmCombi(dir, rc) { return spr('lmcombi' + dir + rc, () => { const hz = dir === 'left' || dir === 'right', st = ['#c81e3a', '#1a7a4a', '#2a5ad8', '#e88a1a', '#8a3ab8'][rc], [c, g] = hz ? XC(52, 28) : XC(26, 46), R = (a, b, w, h, col) => { g.fillStyle = col; g.fillRect(a, b, w, h); };
  if (hz) { R(2, 22, 48, 4, 'rgba(0,0,0,0.3)'); R(2, 6, 48, 17, '#f2f2ec'); R(3, 4, 44, 3, '#ffffff'); R(2, 15, 48, 3, st); for (let x = 6; x < 40; x += 8) R(x, 8, 6, 5, '#2a3a4a'); R(42, 8, 7, 7, '#3a5a7a'); R(44, 9, 4, 2, '#ffd040'); g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(11, 23, 4, 0, 7); g.arc(41, 23, 4, 0, 7); g.fill(); R(49, 17, 2, 3, '#fff4c0'); R(1, 17, 2, 3, '#e83a2a');
    if (dir === 'left') { const [c2, g2] = XC(52, 28); g2.translate(52, 0); g2.scale(-1, 1); g2.drawImage(c, 0, 0); return { c: c2, ax: 26, ay: 25 }; } return { c, ax: 26, ay: 25 }; }
  R(3, 40, 20, 5, 'rgba(0,0,0,0.3)'); R(3, 4, 20, 38, '#f2f2ec'); R(3, 4, 3, 38, st); R(20, 4, 3, 38, st); R(6, dir === 'down' ? 32 : 6, 14, 7, '#3a5a7a'); R(6, 12, 14, 18, '#e8e8e2'); if (dir === 'down') { R(8, 34, 10, 2, '#ffd040'); R(4, 41, 3, 2, '#fff4c0'); R(19, 41, 3, 2, '#fff4c0'); } else { R(4, 3, 3, 2, '#e83a2a'); R(19, 3, 3, 2, '#e83a2a'); } return { c, ax: 13, ay: 43 }; }); }
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M || !M.lima || !M.lcars) return; const night = darkness() > 0.25;
  for (const c of M.lcars) { const [x, y] = lmCarXY(c); if (x < cx - 60 || x > cx + VW + 60 || y < cy - 60 || y > cy + VH + 60) continue; const hz = c.L.hz, dir = hz ? (c.d > 0 ? 'right' : 'left') : (c.d > 0 ? 'down' : 'up');
    list.push({ type: 'xdraw', x, y: y + 6, noShadow: true, draw: (e, a, b) => { if (c.moto && typeof lmMoto === 'function') { const S = lmMoto(dir, c.rc); ctx.drawImage(S.c, Math.round(x - S.ax - a), Math.round(y - S.ay - b)); } else if (c.combi) { const S = lmCombi(dir, c.rc); ctx.drawImage(S.c, Math.round(x - S.ax - a), Math.round(y - S.ay - b)); }
      else { const col = c.taxi ? '#ffd040' : LM_CCOL[c.col], S = spr('lmcar' + col + dir, () => ({ c: carSprite(col, dir), ax: hz ? 17 : 10, ay: hz ? 16 : 24 })); ctx.drawImage(S.c, Math.round(x - S.ax - a), Math.round(y - S.ay - b)); if (c.taxi) { ctx.fillStyle = '#1a1a1e'; ctx.fillRect(Math.round(x - a - 5), Math.round(y - S.ay - b - 2), 10, 4); ctx.fillStyle = '#ffd040'; ctx.fillRect(Math.round(x - a - 4), Math.round(y - S.ay - b - 1), 8, 2); } }
      if (c.honk && G.t - c.honk < 1.2) { ctx.font = 'bold 8px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 2; const t = c.combi ? L2('¡Sube, sube! ¡Larco!', 'Hop on! Larco!') : '¡Piii!'; ctx.strokeText(t, x - a, y - b - 30); ctx.fillText(t, x - a, y - b - 30); } },
      light: night ? { x: x + (hz ? c.d * 22 : 0), y: y + (hz ? -4 : c.d * 20), r: 30, c: 'rgba(255,240,190,0.5)' } : null }); } });

// ---------- gente que pasea por veredas, plazas, malecón y playa ----------
const LM_PED = [], LM_PEDOK = new Set([LM_G.WALK, LM_G.PLAZA, LM_G.COBBLE, LM_G.PATH, LM_G.TILE, LM_G.SAND, LM_G.BRIDGE]), LM_DV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
function lmPedOk(M, x, y) { const tx = Math.floor(x / 16), ty = Math.floor(y / 16); if (tx < 0 || ty < 0 || tx >= M.w || ty >= M.h) return false; const i = ty * M.w + tx; return LM_PEDOK.has(M.lg[i]) && M.objAt[i] < 0 && !SOLID_T[M.ter[i]]; }
let lmPedT = 0;
function lmPedTick(dt) { const M = G.map, P = G.P; if (!M || !M.lima || !P) { LM_PED.length = 0; return; }
  for (let k = LM_PED.length - 1; k >= 0; k--) { const w = LM_PED[k]; if (Math.abs(w.x - P.x) > 560 || Math.abs(w.y - P.y) > 380) LM_PED.splice(k, 1); }
  lmPedT -= dt; if (lmPedT <= 0 && LM_PED.length < 36) { lmPedT = 0.12; const side = Math.random() < 0.5, sx = side ? P.x + (Math.random() < 0.5 ? -1 : 1) * (VW / 2 + 24 + Math.random() * 160) : P.x + (Math.random() - 0.5) * (VW + 300), sy = side ? P.y + (Math.random() - 0.5) * (VH + 200) : P.y + (Math.random() < 0.5 ? -1 : 1) * (VH / 2 + 30 + Math.random() * 120);
    if (lmPedOk(M, sx, sy)) { const AP = M.pedApps || PE_APPS_W, LKS = M.pedLooks || PE_LOOKS, i = Math.floor(Math.random() * (M.pedApps ? AP.length : PE_WALK_N)), dirs = Object.keys(LM_DV).filter(d => lmPedOk(M, sx + LM_DV[d][0] * 16, sy + LM_DV[d][1] * 16)); if (dirs.length) LM_PED.push({ x: Math.floor(sx / 16) * 16 + 8, y: Math.floor(sy / 16) * 16 + 10, A: xwAtlas(i, AP), hat: LKS[i][4], seed: i * 5 + 3, dir: pick(dirs), ph: Math.random() * 4, sp: 22 + Math.random() * 12, mv: 1, wait: 0, bag: Math.random() < 0.25 ? pick(['#c8102e', '#2a5ad8', '#1a1c24', '#ffd040', '#8a5a3a']) : null }); } }
  for (const w of LM_PED) { if (w.wait > 0) { w.wait -= dt; w.mv = 0; continue; } w.mv = 1; const [dx, dy] = LM_DV[w.dir];
    if (Math.hypot(P.x - w.x, P.y - w.y) < 16) { w.wait = 0.6; continue; }
    const nx = w.x + dx * w.sp * dt, ny = w.y + dy * w.sp * dt, ahead = lmPedOk(M, nx + dx * 8, ny + dy * 8);
    const cx = Math.floor(w.x / 16) * 16 + 8, cy = Math.floor(w.y / 16) * 16 + 10, atC = Math.abs(w.x - cx) < 1.2 && Math.abs(w.y - cy) < 1.2;
    if (!ahead || (atC && Math.random() < 0.012)) { w.x = cx; w.y = cy; const opts = Object.keys(LM_DV).filter(d => lmPedOk(M, cx + LM_DV[d][0] * 16, cy + LM_DV[d][1] * 16) && !(LM_DV[d][0] === -dx && LM_DV[d][1] === -dy)); w.dir = opts.length ? pick(opts) : Object.keys(LM_DV).find(d => LM_DV[d][0] === -dx && LM_DV[d][1] === -dy); if (Math.random() < 0.25) w.wait = 0.8 + Math.random() * 2.5; continue; }
    w.x = nx; w.y = ny; if (dx) w.y += (cy - w.y) * Math.min(1, dt * 6); else w.x += (cx - w.x) * Math.min(1, dt * 6); } }
V33_TICKS.push(dt => lmPedTick(Math.min(0.05, dt || 0)));
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M || !M.lima) return; for (const w of LM_PED) if (w.x > cx - 40 && w.x < cx + VW + 40 && w.y > cy - 40 && w.y < cy + VH + 60) list.push({ type: 'xdraw', x: w.x, y: w.y, noShadow: true, draw: (e, a, b) => { xwDraw(w, a, b); if (w.hat) lmHatOn(w.A, w.hat, w.x - a, w.y - b, w.dir, w.seed); } }); });

// ---------- Plaza de Armas: cambio de guardia (11:45-12:45) y palomas; gatos del Parque Kennedy ----------
const lmHour = () => (G.time / 60) % 24, lmGuardOn = () => { const hh = lmHour(); return hh >= 11.75 && hh < 12.75; };
V33_TICKS.push(dt => { const M = G.map, P = G.P; if (!M || !M.lima || !P) return; dt = Math.min(0.05, dt || 0); const on = lmGuardOn();
  if (M.guards) { const span = 160, ph = (G.t * 18) % (span * 2), off = ph < span ? ph : span * 2 - ph, dir = ph < span ? 'right' : 'left';
    for (const g of M.guards) { const bx = (308 + g.k * 4.5) * 16 + 8; if (on) { g.x = bx - 80 + off; g.dir = dir; g.mv = 1; } else { g.x += (bx - g.x) * Math.min(1, dt * 2); g.mv = Math.abs(bx - g.x) > 1 ? 1 : 0; g.dir = g.mv ? (bx > g.x ? 'right' : 'left') : 'down'; } }
    if (on && !M._gOn && P.y < 130 * 16 && Math.abs(P.x - 325 * 16) < 40 * 16) banner('🎺 ' + L2('Cambio de guardia', 'Changing of the guard'), L2('Palacio de Gobierno', 'Government Palace')); M._gOn = on; }
  if (M.doves) for (const d of M.doves) { const dist = Math.hypot(P.x - d.x, P.y - d.y); if (!d.fly && dist < 44) { d.fly = 1; d.vx = (d.x - P.x) / (dist || 1) * 70 + (Math.random() - 0.5) * 30; d.vy = (d.y - P.y) / (dist || 1) * 40; d.t = 3 + Math.random() * 3; if (Math.random() < 0.3) sfx && sfx('hit'); }
    if (d.fly) { d.t -= dt; if (d.t > 0) { d.x += d.vx * dt; d.y += d.vy * dt; d.z = Math.min(60, d.z + 50 * dt); } else { d.x += (d.hx - d.x) * dt * 1.2; d.y += (d.hy - d.y) * dt * 1.2; d.z = Math.max(0, d.z - 30 * dt); if (d.z <= 0 && Math.hypot(d.hx - d.x, d.hy - d.y) < 4) d.fly = 0; } } }
  if (M.cats) for (const c of M.cats) if (!c.sit) { c.ph += dt; c.x += Math.cos(c.ph * 0.4) * 6 * dt; } });
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M || !M.lima) return;
  if (M.guards && Math.abs(cy + VH / 2 - 63 * 16) < VH) { const A = npcAtlas('pe_guardia'); for (const g of M.guards) { g.A = A; if (g.x < cx - 40 || g.x > cx + VW + 40) continue; list.push({ type: 'xdraw', x: g.x, y: g.y, noShadow: true, draw: (e, a, b) => { xwDraw(g, a, b); lmHatOn(A, 'casco', g.x - a, g.y - b, g.dir, 1); } }); } }
  if (M.doves) for (const d of M.doves) { if (d.x < cx - 20 || d.x > cx + VW + 20 || d.y < cy - 80 || d.y > cy + VH + 20) continue; list.push({ type: 'xdraw', x: d.x, y: d.fly ? d.y + 200 : d.y, noShadow: true, draw: (e, a, b) => { const X = Math.round(d.x - a), Y = Math.round(d.y - b - d.z); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(X - 2, Math.round(d.y - b), 5, 1);
      if (d.fly) { const f = Math.floor(G.t * 14 + d.ph) % 2; ctx.fillStyle = '#8a8e9a'; ctx.fillRect(X - 1, Y - 1, 3, 2); ctx.fillStyle = '#b4b8c4'; if (f) { ctx.fillRect(X - 5, Y - 3, 4, 1); ctx.fillRect(X + 2, Y - 3, 4, 1); } else { ctx.fillRect(X - 5, Y, 4, 1); ctx.fillRect(X + 2, Y, 4, 1); } }
      else { const pk = Math.floor(G.t * 3 + d.ph) % 3 === 0; ctx.fillStyle = '#7a7e8a'; ctx.fillRect(X - 3, Y - 4, 6, 3); ctx.fillStyle = '#9a9eaa'; ctx.fillRect(X - 2, Y - 4, 3, 1); ctx.fillStyle = '#5a8a7a'; ctx.fillRect(X + 2, Y - (pk ? 3 : 6), 2, 2); ctx.fillStyle = '#c8603a'; ctx.fillRect(X + 4, Y - (pk ? 2 : 5), 1, 1); ctx.fillStyle = '#c86a5a'; ctx.fillRect(X - 1, Y - 1, 1, 1); ctx.fillRect(X + 1, Y - 1, 1, 1); } } }); }
  if (M.cats) for (const c of M.cats) { if (c.x < cx - 20 || c.x > cx + VW + 20 || c.y < cy - 20 || c.y > cy + VH + 20) continue; list.push({ type: 'xdraw', x: c.x, y: c.y, noShadow: true, draw: (e, a, b) => { const S = nekoSprite(c.i, c.sit, c.sit ? 0 : Math.floor(G.t * 4 + c.ph) % 2); ctx.save(); if (!c.sit && Math.cos(c.ph * 0.4) < 0) { ctx.translate(Math.round(c.x - a), 0); ctx.scale(-1, 1); ctx.drawImage(S.c, -S.ax, Math.round(c.y - S.ay - b)); } else ctx.drawImage(S.c, Math.round(c.x - S.ax - a), Math.round(c.y - S.ay - b)); ctx.restore(); } }); } });
XACT.lm_gato = [L2('Acariciar al gato', 'Pet the cat'), ['heart'], o => { const M = G.map, c = M && M.cats && M.cats[o.cat], P = G.P; if (!c) return; for (let k = 0; k < 6; k++) part(c.x + (Math.random() - 0.5) * 10, c.y - 10, { vz: 20 + Math.random() * 20, g: -2, life: 1.2, c: '#ff6a9a', s: 2 });
  P.pe = P.pe || {}; P.pe.cats = P.pe.cats || {}; const first = !P.pe.cats[o.cat]; P.pe.cats[o.cat] = 1; const n = Object.keys(P.pe.cats).length; toast('😺 ' + L2('¡Miau! Ronronea feliz.', 'Meow! It purrs happily.') + (first ? ' (' + n + '/' + M.cats.length + ')' : ''), 'info'); sfx('coin');
  if (first && n === M.cats.length) { P.gold += 2000; toast('🐈 ' + L2('¡Acariciaste a todos los gatos del Parque Kennedy! +2.000 de oro', 'You petted every cat in Kennedy Park! +2,000 gold'), 'quest', 4); } markDirty(); }];

// ---------- cielo y mar de la Costa Verde: parapentes, gaviotas, tablistas; Puente Villena ----------
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || M.id !== 'lima') return; const t = G.t;
  for (let k = 0; k < 4; k++) { const x = (250 + Math.sin(t * 0.025 + k * 1.7) * 110 + k * 30) * 16, c = lmCoast(Math.round(x / 16)), y = (c + 4 + Math.sin(t * 0.07 + k) * 6) * 16, alt = 90 + Math.sin(t * 0.3 + k * 2) * 10, X = Math.round(x - cx), Y = Math.round(y - cy - alt); if (X < -60 || X > VW + 60 || Y < -60 || Y > VH + 40) continue;
    const col = ['#ff7a1a', '#e83a8a', '#3ab8e8', '#ffd040'][k]; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(X, Y, 18, 6, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; for (let q = -12; q <= 12; q += 6) ctx.fillRect(X + q, Y - 4, 1, 4); ctx.strokeStyle = 'rgba(40,40,40,0.6)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(X - 16, Y); ctx.lineTo(X, Y + 16); ctx.lineTo(X + 16, Y); ctx.stroke(); ctx.fillStyle = '#2a2a30'; ctx.fillRect(X - 2, Y + 15, 4, 5); ctx.fillStyle = '#e8b890'; ctx.fillRect(X - 1, Y + 13, 3, 2); }
  for (let k = 0; k < 6; k++) { const x = cx + ((t * (14 + k * 3) + k * 160) % (VW + 80)) - 40, y = cy + 20 + k * 22 + Math.sin(t + k) * 6, X = Math.round(x - cx), Y = Math.round(y - cy), wy = lmCoast(Math.round(x / 16)) * 16; if (y < wy) continue; const f = Math.floor(t * 6 + k) % 2; ctx.fillStyle = '#f4f4f4'; ctx.fillRect(X - 3, Y - f, 3, 1); ctx.fillRect(X + 1, Y - f, 3, 1); ctx.fillRect(X, Y, 1, 1); }
  const RV = LM_RAV, x0 = (RV.x0 - 2) * 16 - cx, x1 = (RV.x1 + 3) * 16 - cx, y0 = RV.by0 * 16 - cy, y1 = (RV.by1 + 1) * 16 - cy; if (x1 > 0 && x0 < VW && y1 > -40 && y0 < VH) { ctx.fillStyle = 'rgba(235,245,255,0.38)'; ctx.fillRect(x0, y0 - 26, x1 - x0, 22); ctx.fillStyle = 'rgba(235,245,255,0.12)'; ctx.fillRect(x0, y0 - 4, x1 - x0, y1 - y0 + 4); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(x0, y0 - 26, x1 - x0, 2); ctx.fillRect(x0, y0 - 5, x1 - x0, 1);
    for (let x = x0; x <= x1; x += 12) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(x, y0 - 26, 1, 22); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x, y0 - 4, 1, y1 - y0 + 2); } } });
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M || M.id !== 'lima') return; const t = G.t;
  for (let k = 0; k < 9; k++) { const x = (180 + k * 32 + Math.sin(t * 0.05 + k) * 6) * 16, c = lmCoast(Math.round(x / 16)), ride = (t * 0.08 + k * 0.37) % 1, y = (c + 34 - (ride > 0.7 ? (ride - 0.7) * 16 : 0)) * 16, X = x, Y = y + Math.sin(t * 2 + k) * 2; if (X < cx - 30 || X > cx + VW + 30 || Y < cy - 30 || Y > cy + VH + 30) continue;
    list.push({ type: 'xdraw', x: X, y: Y, noShadow: true, draw: (e, a, b) => { const sx = Math.round(X - a), sy = Math.round(Y - b), up = ride > 0.7; ctx.fillStyle = up ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)'; ctx.fillRect(sx - 12, sy + 2, 24, up ? 3 : 1); ctx.fillStyle = ['#ff8a3a', '#3ac8e8', '#ffd040', '#ffffff'][k % 4]; ctx.beginPath(); ctx.ellipse(sx, sy, 9, 2.5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#1a1a22'; if (up) { ctx.fillRect(sx - 2, sy - 9, 4, 8); ctx.fillRect(sx - 5, sy - 7, 3, 1); ctx.fillRect(sx + 2, sy - 7, 3, 1); } else ctx.fillRect(sx - 3, sy - 3, 6, 3); ctx.fillStyle = '#b07a50'; ctx.fillRect(sx - 1, up ? sy - 12 : sy - 6, 3, 3); } }); } });
// columnas del Puente Villena en la quebrada (bajo los personajes)
{ const _mk = makeLima; makeLima = function () { const had = G.maps.lima, M = _mk.apply(this, arguments); if (!had && M) M.drawExtra = (cx, cy) => { const RV = LM_RAV; for (const bx of [RV.x0 + 3, RV.x1 - 3]) { const X = bx * 16 - cx, Y = (RV.by1 + 1) * 16 - cy; if (X < -40 || X > VW + 40 || Y < -60 || Y > VH + 200) continue; ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(X - 2, Y, 16, 70); ctx.fillStyle = '#a8a298'; ctx.fillRect(X, Y, 12, 64); ctx.fillStyle = '#c4beb2'; ctx.fillRect(X, Y, 3, 64); } }; return M; }; }

// ---------- barrios: cartel al entrar ----------
let lmZT = 0; V33_TICKS.push(dt => { const M = G.map, P = G.P; if (!M || !M.lima || !P) return; lmZT += dt || 0; if (lmZT < 0.3) return; lmZT = 0; const z = M.zoneAt ? M.zoneAt(P.x, P.y) : lmZoneAt(P.x, P.y); if (z && z.k !== P._lmZ) { P._lmZ = z.k; banner(z.n, z.s); } });

// ---------- parapente sobre la Costa Verde (300 de oro, 24 s, aterriza en la playa; los demás ven la vela) ----------
let LM_PG = null; const PG_COST = 300, PG_T = 24;
XACT.lm_parapente = [() => L2('Volar en parapente (', 'Paraglide (') + PG_COST + L2(' de oro)', ' gold)'), 'run', () => { const P = G.P; if (LM_PG) return; if (P.gold < PG_COST) { toast(L2('Te falta oro para el vuelo.', 'Not enough gold for the flight.'), 'warn'); return; }
  P.gold -= PG_COST; sfx('coin'); LM_PG = { t: 0, x0: P.x, y0: P.y, x1: 236 * 16 + 8, y1: (lmCoast(236) + 22) * 16 + 8 }; P.pg = 1; banner('🪂 ' + L2('¡A volar!', 'Take off!'), L2('Costa Verde', 'Costa Verde')); if (typeof stampAdd === 'function') stampAdd('pe_parapente'); markDirty(); }];
const lmPgPos = u => { const G_ = LM_PG, e = u * u * (3 - 2 * u), x = G_.x0 + (G_.x1 - G_.x0) * e + Math.sin(u * Math.PI * 2) * 200, y = G_.y0 + (G_.y1 - G_.y0) * e + Math.sin(u * Math.PI) * 120; return [x, y, Math.sin(Math.min(1, u * 1.15) * Math.PI) * 80]; };
{ const _up = updatePlayer; updatePlayer = function (dt) { const r = _up.apply(this, arguments); const P = G.P; if (LM_PG && P) { if (!G.map || G.map.id !== 'lima') { LM_PG = null; P.pg = 0; return r; } LM_PG.t += dt; const u = Math.min(1, LM_PG.t / PG_T), [x, y, alt] = lmPgPos(u); P.x = x; P.y = y; P.pgAlt = alt; P.dir = 'down';
    if (u >= 1) { LM_PG = null; P.pg = 0; P.pgAlt = 0; banner('🏖 ' + L2('¡Aterrizaje perfecto!', 'Perfect landing!'), 'Costa Verde'); } } return r; }; }
function lmDrawGlider(x, y, alt, k) { const X = Math.round(x), Y = Math.round(y - alt - 52); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(X, Math.round(y + alt * 0.3), 16, 4, 0, 0, 7); ctx.fill();
  ctx.fillStyle = ['#ff7a1a', '#e83a8a', '#3ab8e8'][k % 3]; ctx.beginPath(); ctx.ellipse(X, Y, 26, 9, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.55)'; for (let q = -18; q <= 18; q += 9) ctx.fillRect(X + q, Y - 7, 2, 7); ctx.strokeStyle = 'rgba(30,30,30,0.6)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(X - 24, Y); ctx.lineTo(X, Y + 34); ctx.lineTo(X + 24, Y); ctx.stroke(); }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const P = G.P; if (e && (e === P && P.pg || e.pg && e.type !== 'npc' && e !== P)) { const alt = e === P ? (P.pgAlt || 0) : 60; ctx.save(); ctx.translate(0, -alt); const r = _de.apply(this, arguments); ctx.restore(); lmDrawGlider(e.x - cx, e.y - cy, alt, (e.peer || '').length); return r; } return _de.apply(this, arguments); }; }
{ const _sp = socialPresence; socialPresence = function (o) { _sp.apply(this, arguments); if (G.P && G.P.pg) o.pg = 1; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr.apply(this, arguments); r.pg = !!pr.pg; }; }

// ---------- aeropuerto: billete en Albor (1.000 de oro, sin nivel), vuelo, terminal de Lima y vuelta gratis ----------
const AE_PE = { k: 'pe', clerk: 'pe_taquilla', cafe: 'pe_cafetera', travellers: ['pe_3', 'ae_us', 'pe_14', 'ae_fr', 'pe_25', 'ae_br', 'pe_36', 'ae_ar', 'pe_47', 'ae_kr'] };
function goLima() { const P = G.P, M = makeLima(), Q = LM_Q; if (P.map === 'world' || !P.retX) { P.retX = SA.term.door * 16 + 8; P.retY = (SA.term.y + SA.term.h + 1) * 16 + 8; }
  transition(() => { P.inside = 'lima'; setMap(M, Q.term.door * 16 + 8, (Q.term.y + Q.term.h + 2) * 16, 'down'); P._lmZ = null; P.pe = P.pe || {}; if (!P.pe.seen) { P.pe.seen = 1; banner(L2('¡Bienvenido a Lima!', 'Welcome to Lima!'), L2('Aeropuerto Internacional Jorge Chávez', 'Jorge Chávez International Airport')); } else banner('Lima', L2('Aeropuerto Jorge Chávez', 'Jorge Chávez Airport')); if (typeof stampAdd === 'function') stampAdd('m_lima'); markDirty(true); }); }
XACT.lm_aeropuerto = [L2('Entrar al aeropuerto', 'Enter the airport'), 'run', o => { const P = G.P, M = makeTerminal('pe_terminal', AE_PE); for (const ob of M.objs) if (ob.f === 'ae_panel') { ob.f = 'lm_panel'; } P.peRet = { x: o.px, y: o.py + 18 }; transition(() => { P.inside = 'pe_terminal'; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner('Jorge Chávez', L2('Vuelos a Albor', 'Flights to Albor')); }); }];
{ const _ei = exitInterior; exitInterior = function () { const M = G.map, P = G.P; if (M && (M.aeIn === 'pe' || M.peIn)) { const Rt = M.peIn === 'larco' ? { x: LM_LARCO.door * 16 + 8, y: (lmCoast(LM_LARCO.door) + 3) * 16 + 8 } : (P.peRet || { x: LM_Q.term.door * 16 + 8, y: (LM_Q.term.y + LM_Q.term.h + 2) * 16 }); transition(() => { P.inside = 'lima'; setMap(makeLima(), Rt.x, Rt.y, 'down'); }); return; } return _ei.apply(this, arguments); }; }
DLG_HOOKS.push((npc, opts) => { const P = G.P;
  if (npc.id === 'ae_taquilla') opts.splice(1, 0, { label: '🎫 ' + L2('Billete a Perú (Lima) · ', 'Ticket to Peru (Lima) · ') + PE_TICKET.toLocaleString() + L2(' de oro', ' gold'), icon: ['coin'], fn: () => {
    if (P.aeTk === 'pe') { typeText(L2('Ya tienes tu billete a Lima. Espera en la sala y embarca por la Puerta 1 cuando llegue el avión.', 'You already have your ticket to Lima. Wait in the lounge and board at Gate 1 when the plane arrives.')); return; }
    if (P.gold < PE_TICKET) { typeText(L2('No te llega el oro. El billete a Lima cuesta ', 'You don\'t have enough gold. The ticket to Lima costs ') + PE_TICKET.toLocaleString() + '.'); return; }
    P.gold -= PE_TICKET; P.aeTk = 'pe'; sfx('coin'); markDirty(true); const b = aeBoarding(); typeText(L2('¡Aquí tienes tu billete a Lima, Perú! ', 'Here is your ticket to Lima, Peru! ') + (b.open ? L2('Ahora mismo se está embarcando: ve a la Puerta 1.', 'Boarding right now: go to Gate 1.') : L2('El próximo embarque empieza en unos ', 'Next boarding starts in about ') + b.wait + L2(' segundos.', ' seconds.'))); } });
  if (npc.id === 'pe_taquilla') opts.unshift({ label: '🎫 ' + L2('Billete de vuelta a Albor (gratis)', 'Return ticket to Albor (free)'), icon: ['coin'], fn: () => { P.aeTk = 'al'; markDirty(true); const b = aeBoarding(); typeText(L2('¡Buen viaje! ', 'Have a good trip! ') + (b.open ? L2('Embarque abierto en la Puerta 1.', 'Boarding open at Gate 1.') : L2('Embarque en unos ', 'Boarding in about ') + b.wait + L2(' segundos.', ' seconds.'))); } });
  const L = PE_SELL[npc.id]; if (L) for (const id of L.slice().reverse()) { const I = ITEMS[id]; if (!I) continue; opts.unshift({ label: '🛒 ' + I.n + ' · ' + I.price.toLocaleString() + L2(' oro', ' gold'), icon: I.icon, fn: () => { if (P.gold < I.price) { typeText(L2('No te alcanza, casero.', 'Not enough gold, friend.')); return; } P.gold -= I.price; giveItem(id, 1); sfx('coin'); typeText(L2('¡Gracias, vuelve pronto!', 'Thanks, come back soon!')); } }); }
  if (npc.id === 'pe_lustra') opts.unshift({ label: '👞 ' + L2('Lustrar los zapatos (50 de oro)', 'Shine your shoes (50 gold)'), icon: ['coin'], fn: () => { if (P.gold < 50) { typeText(L2('Otro día será, joven.', 'Some other day.')); return; } P.gold -= 50; sfx('coin'); for (let k = 0; k < 10; k++) part(P.x + (Math.random() - 0.5) * 12, P.y - 2, { vz: 14, g: 4, life: 0.8, c: '#ffffff', s: 1 }); typeText(L2('¡Listo! Brillan como espejo. ¡Que te vaya bonito!', 'Done! They shine like a mirror. Take care!')); } });
  if (npc.id === 'pe_guia') opts.unshift({ label: '📜 ' + L2('Cuéntame de Lima', 'Tell me about Lima'), icon: ['book'], fn: () => xMsg('🇵🇪 ' + L2('Lima, Ciudad de los Reyes', 'Lima, City of the Kings'), PE_GUIA.map(l => '<p>' + esc(L2(l[0], l[1])) + '</p>').join('')) });
  if (npc.id === 'pe_piloto') opts.unshift({ label: '🪂 ' + L2('Volar en parapente (', 'Paraglide (') + PG_COST + L2(' de oro)', ' gold)'), icon: ['coin'], fn: () => { closeDialog && closeDialog(); XACT.lm_parapente[2]({}); } }); });
const PE_GUIA = [['Francisco Pizarro fundó Lima el 18 de enero de 1535 junto al río Rímac. La llamó Ciudad de los Reyes.', 'Francisco Pizarro founded Lima on 18 January 1535 by the Rímac River. He called it the City of the Kings.'],
  ['Al norte de la plaza está el Palacio de Gobierno. Todos los días, a mediodía, la guardia cambia de turno con banda de música.', 'North of the square is Government Palace. Every day at noon the guard changes with a marching band.'],
  ['La Catedral, con sus dos torres, se reconstruyó varias veces después de los terremotos. A su lado está el Palacio Arzobispal, con los balcones de madera más bonitos de la ciudad.', 'The Cathedral and its two towers were rebuilt several times after earthquakes. Next to it is the Archbishop\'s Palace, with the city\'s finest wooden balconies.'],
  ['La pileta de bronce del centro es de 1651. Es lo más antiguo de la plaza.', 'The bronze fountain in the middle dates from 1651. It is the oldest thing in the square.'],
  ['Por el Jirón de la Unión llegas a la Plaza San Martín. Más al sur está Miraflores, con el malecón, el Parque Kennedy y Larcomar, metido en el acantilado.', 'Jirón de la Unión takes you to San Martín Square. Further south is Miraflores, with the boardwalk, Kennedy Park and Larcomar, built into the cliff.'],
  ['Desde el malecón bajan escaleras a la Costa Verde. Allí hay playas de piedritas, tablistas y la Rosa Náutica, un restaurante sobre el mar.', 'Stairs go down from the boardwalk to the Costa Verde: pebble beaches, surfers and the Rosa Náutica, a restaurant over the sea.'],
  ['Dicen que esta Lima la pintó la Ventisca de memoria: es su propia ciudad, al otro lado del cristal. Por eso aquí no hay monstruos, solo gente, comida y mar.', 'They say the Ventisca painted this Lima from memory: it is her own city, on the other side of the glass. That is why there are no monsters here, only people, food and sea.']];
XACT.ae_embarcar[2] = (orig => o => { const P = G.P, M = G.map, b = aeBoarding();
  const peHere = M && M.aeIn === 'pe', toPe = M && M.aeIn === 'albor' && P.aeTk === 'pe'; if (!peHere && !toPe) return orig(o);
  if (peHere && P.aeTk !== 'al') { xMsg('✈ ' + L2('Puerta 1', 'Gate 1'), L2('Necesitas un billete. Pídelo gratis en el mostrador de la izquierda.', 'You need a ticket. Ask for a free one at the counter on the left.')); return; }
  if (!b.open) { xMsg('✈ ' + L2('Puerta 1', 'Gate 1'), L2('El avión todavía no ha llegado a la puerta. Embarque en ', 'The plane has not reached the gate yet. Boarding in ') + b.wait + L2(' segundos.', ' seconds.')); return; }
  P.aeTk = null; markDirty(true); flightCine(peHere ? 'LIMA · ALBOR' : 'ALBOR · LIMA', () => { if (peHere) aeArriveAlbor(); else goLima(); }); })(XACT.ae_embarcar[2]);
let peHT = 0; V33_TICKS.push(dt => { peHT += dt || 0; if (peHT < 0.5) return; peHT = 0; const M = G.map, P = G.P; if (!M || !P) return; const on = (M.aeIn === 'albor' && P.aeTk === 'pe') || (M.aeIn === 'pe' && P.aeTk === 'al');
  if (on) { const b = aeBoarding(); mgHud('✈ ' + (M.aeIn === 'pe' ? 'LIMA → ALBOR · ' : 'ALBOR → LIMA · ') + (b.open ? L2('¡Embarcando! Puerta 1', 'Boarding! Gate 1') : L2('Embarque en ', 'Boarding in ') + b.wait + ' s')); P._peHud = 1; } else if (P._peHud) { P._peHud = 0; if (!P._aeHud) mgHud(null); } });

// ---------- Larcomar por dentro: tiendas, patio de comidas y ventanales al mar ----------
function makeLarcomar() { const id = 'larcomar_in'; if (G.maps[id]) return G.maps[id]; const w = 40, h = 22, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], peIn: 'larco' };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (y < 5 || x === 0 || x === w - 1 || y === h - 1) M.ter[I(x, y)] = T.IWALL; const ex = w >> 1; M.ter[I(ex, h - 1)] = T.FLOOR; M.exit = { x: ex, y: h - 1 }; prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {})), sp = (nid, x, y, o) => spawnNPC(nid, x * 16 + 8, y * 16 + 8, id, Object.assign({ face: 'down' }, o || {}));
  const shops = [['comida', 3, L2('COMIDA PERUANA', 'PERUVIAN FOOD'), '#c81e3a', 'pe_larco_comida'], ['cafe', 10, L2('CAFÉ', 'CAFÉ'), '#5a3418', 'pe_larco_cafe'], ['helado', 30, L2('HELADOS', 'ICE CREAM'), '#e8a030', 'pe_larco_helado']];
  for (const [k, x, t, col, nid] of shops) { XSPR['lmi_tienda_' + k] = () => { const W = 96, H = 52, [c, g] = XC(W, H); g.fillStyle = '#e8e6e0'; g.fillRect(0, 0, W, H); g.fillStyle = col; g.fillRect(0, 0, W, 12); jpText(g, t, Math.max(2, Math.round(W / 2 - jpW(t) / 2)), 1, '#ffffff', 10); g.fillStyle = '#2a3440'; g.fillRect(4, 16, W - 8, 34); g.fillStyle = 'rgba(255,230,180,0.7)'; g.fillRect(5, 17, W - 10, 32); for (let q = 0; q < 6; q++) { g.fillStyle = ['#ff8aa8', '#5ab0ff', '#ffd040', '#8aff6a', '#ffffff', '#c08aff'][q]; g.fillRect(10 + q * 13, 36, 8, 10); } g.fillStyle = '#8a7a6a'; g.fillRect(4, 44, W - 8, 6); return { c, ax: 8, ay: H - 1 }; };
    F('lmi_tienda_' + k, x, 5, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]); sp(nid, x + 2, 7); }
  for (const [x, y] of [[13, 11], [18, 11], [23, 11], [13, 15], [18, 15], [23, 15], [8, 14], [30, 14]]) F('lm_mesa', x, y);
  for (const [x, y] of [[1, 6], [38, 6], [1, 19], [38, 19], [17, 6], [22, 6]]) F('lm_maceta', x, y);
  const PEOPLE = ['pe_5', 'pe_12', 'pe_19', 'pe_26', 'pe_33', 'pe_40', 'pe_57', 'pe_64', 'pe_71', 'pe_88'], LP = []; for (let k = 0; k < PEOPLE.length; k++) { const nid = 'pe_lc' + k; NPCS[nid] = Object.assign({}, NPCS[PEOPLE[k]], { title: 'Larcomar' }); PE_NPC_LOOK[nid] = PE_NPC_LOOK[PEOPLE[k]]; LP.push(nid); }
  LP.forEach((nid, i) => sp(nid, [14, 19, 24, 12, 26, 9, 31, 16, 21, 34][i], [12, 12, 12, 16, 16, 10, 10, 18, 18, 12][i], { wander: i % 2 ? 2 : 0 }));
  M.drawExtra = (cx, cy) => { const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(w - 1, Math.ceil((cx + VW) / 16)), y1 = Math.min(h - 1, Math.ceil((cy + VH) / 16));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const X = x * 16 - cx, Y = y * 16 - cy, t = M.ter[I(x, y)];
      if (t === T.FLOOR) { ctx.fillStyle = (x + y) % 2 ? '#f0eee8' : '#e6e3dc'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(X + 2, Y + 2, 4, 1); continue; }
      if (y < 5 && x > 0 && x < w - 1) { const hh = (G.time / 60) % 24, sun = hh > 17 && hh < 19.5; const sky = ctx.createLinearGradient(0, -cy, 0, 5 * 16 - cy); sky.addColorStop(0, sun ? '#6a4a9a' : hh > 19.5 || hh < 6 ? '#1a1a3a' : '#9ac8f0'); sky.addColorStop(0.55, sun ? '#ff9a6a' : hh > 19.5 || hh < 6 ? '#2a2a5a' : '#d8ecff'); sky.addColorStop(0.56, '#2a6a96'); sky.addColorStop(1, '#3a86b0'); ctx.fillStyle = sky; ctx.fillRect(X, Y, 16, 16);
        if (y === 2 && (x + Math.floor(G.t)) % 9 === 0) { ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(X + 2, Y + 12, 8, 1); } ctx.fillStyle = '#f4f4f0'; if (x % 4 === 0) ctx.fillRect(X, Y, 2, 16); if (y === 4) { ctx.fillStyle = '#d8d8d0'; ctx.fillRect(X, Y + 12, 16, 4); ctx.fillStyle = 'rgba(170,220,255,0.35)'; ctx.fillRect(X, Y + 4, 16, 8); } continue; }
      ctx.fillStyle = '#c8c4bc'; ctx.fillRect(X, Y, 16, 16); }
    const hh = (G.time / 60) % 24; if (hh > 17 && hh < 19.5) { ctx.fillStyle = '#ffd070'; ctx.beginPath(); ctx.arc(26 * 16 - cx, 2.6 * 16 - cy, 10, Math.PI, 0); ctx.fill(); } };
  G.maps[id] = M; return M; }
XACT.lm_larcomar = [L2('Entrar a Larcomar', 'Enter Larcomar'), 'run', () => { const P = G.P, M = makeLarcomar(); transition(() => { P.inside = 'larcomar_in'; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner('Larcomar', L2('Tiendas, comida y vista al mar', 'Shops, food and a sea view')); if (typeof stampAdd === 'function') stampAdd('pe_larcomar'); }); }];

// ---------- mapas: Perú (imagen de Sergio) con Lima marcada, y el mapa de Lima con sus lugares ----------
const PE_IMG = (() => { try { const im = new Image(); im.onload = () => { try { if (typeof MAPW_LIST !== 'undefined' && MAPW_LIST[MAPW] && MAPW_LIST[MAPW].id === 'peru' && !$('#panel').hidden) renderPanel(); } catch (e) { } }; im.src = PE_MAP_PNG; return im; } catch (e) { return null; } })();
const PE_K = 1, PE_LIMA = [74, 151];   // Lima en la imagen (píxeles de la imagen original)
const PE_MAPM = { id: 'peru', w: 203 * PE_K, h: 248 * PE_K, objs: [], peru: 1 };
const LM_GCOL = ['#4a9e36', '#45464c', '#c6c0b6', '#d9cfc2', '#2f7aa0', '#a89e8f', '#7a7a52', '#b8664a', '#36373d', '#7c6e56', '#d8283a', '#b0aa9e', '#a27e5a', '#ebe6dc', '#b4b0a6', '#b88a5c', '#cdb79a', '#5c8a3c'];
function lmOverview(M) { const K = 2, W = M.w, H = M.h, c = mkCanvas(W * K, H * K), x = c.getContext('2d'), id = x.createImageData(W * K, H * K), d = new Uint32Array(id.data.buffer), pal = LM_GCOL.map(h => C(h));
  for (let ty = 0; ty < H; ty++) for (let tx = 0; tx < W; tx++) { const i = ty * W + tx, k = M.lg[i]; let col = pal[k] || pal[0]; if (k === LM_G.SEA && M.ld[i] > 5) col = C('#24618c'); if (k === LM_G.HILL && hash2(tx, ty, 5) < 0.6) col = C(['#e8c868', '#7ab0d8', '#e88a6a', '#f0f0e0', '#9ad08a'][(hash2(tx, ty, 6) * 5) | 0]);
    for (let py = 0; py < K; py++) for (let px = 0; px < K; px++) { const r = hash2(tx * K + px, ty * K + py, 9); let p = col; if (r < 0.08) p = uMul(col, 0.88); else if (r > 0.95) p = uMix(col, C('#ffffff'), 0.14); if (k === LM_G.SEA && M.ld[i] === 0 && py === 0) p = C('#e8f4ff'); d[(ty * K + py) * W * K + tx * K + px] = p; } }
  x.putImageData(id, 0, 0); x.imageSmoothingEnabled = true; const s = K / 16, list = (M.objs || []).filter(o => o && !o.hidden && o.f !== 'lm_vacio' && o.f !== 'lm_reja').sort((a, b) => (a.py || a.ty * 16) - (b.py || b.ty * 16));
  for (const o of list) { let sp = null; try { sp = objSprite(o); } catch (e) { sp = null; } if (!sp || !sp.c || !sp.c.width) continue; const big = sp.c.width >= 44 || sp.c.height >= 56, f = big ? 1.6 : 1.3, ss = s * f, ox = o.px != null ? o.px : o.tx * 16 + 8, oy = o.py != null ? o.py : o.ty * 16 + 15;
    try { x.drawImage(sp.c, ox * s - (sp.ax || 0) * ss, oy * s - (sp.ay || 0) * ss, sp.c.width * ss, sp.c.height * ss); } catch (e) { } }
  return c; }
{ const _mo = mapOverview; mapOverview = function (M) { if (M && M.peru) { const c = mkCanvas(M.w, M.h), x = c.getContext('2d'); x.fillStyle = '#2a64ac'; x.fillRect(0, 0, M.w, M.h); if (PE_IMG && PE_IMG.complete && PE_IMG.naturalWidth) { x.imageSmoothingEnabled = false; x.drawImage(PE_IMG, 0, 0, M.w, M.h); } return c; }
  if (M && M.lima) { if (!MAP_OV[M.id] || MAP_OV[M.id].w !== M.w) MAP_OV[M.id] = { c: lmOverview(M), w: M.w }; return MAP_OV[M.id].c; } return _mo.apply(this, arguments); }; }
MAPC.pesight = [L2('Lugares famosos', 'Landmarks'), 'Landmarks', '#ffd04a', 'star']; MAPC.pefood = [L2('Comida peruana', 'Peruvian food'), 'Peruvian food', '#ff9a4a', 'food']; MAPC.peplane = [L2('Aeropuerto (vuelo a Albor)', 'Airport (flight to Albor)'), 'Airport (flight to Albor)', '#9ad8ff', 'mk:airship'];
MAPC.pefun = [L2('Actividades (parapente, gatos, playa)', 'Activities (paragliding, cats, beach)'), 'Activities', '#ff5ad8', 'note']; MAPC.pecity = [L2('Ciudad (toca para ver su mapa)', 'City (tap to see its map)'), 'City', '#ff4a4a', 'star'];
const LM_POI = () => [['peplane', LM_Q.term.door, LM_Q.term.y + 3, L2('Aeropuerto Jorge Chávez · vuelo a Albor', 'Jorge Chávez Airport · flight to Albor')], ['pesight', 325, 91, L2('Plaza de Armas y pileta de 1651', 'Main Square and 1651 fountain')], ['pesight', 325, 58, L2('Palacio de Gobierno (cambio de guardia a las 12)', 'Government Palace (changing of the guard at 12)')],
  ['pesight', 369, 86, L2('Catedral de Lima', 'Lima Cathedral')], ['pesight', 369, 105, L2('Palacio Arzobispal', 'Archbishop\'s Palace')], ['pesight', 288, 91, L2('Municipalidad de Lima', 'Lima City Hall')], ['pesight', 404, 57, L2('Iglesia de San Francisco', 'San Francisco Church')], ['pesight', 330, 4, L2('Cerro San Cristóbal', 'San Cristóbal Hill')],
  ['pesight', 325, 135, L2('Jirón de la Unión', 'Jirón de la Unión')], ['pesight', 325, 166, L2('Plaza San Martín', 'San Martín Square')], ['pesight', 205, 197, L2('Bosque El Olivar', 'El Olivar Grove')], ['pesight', 226, 228, 'Huaca Pucllana'], ['pefun', 330, 250, L2('Parque Kennedy (acaricia a los gatos)', 'Kennedy Park (pet the cats)')],
  ['pesight', 307, 252, L2('Iglesia Virgen Milagrosa', 'Virgen Milagrosa Church')], ['pesight', 206, lmCoast(206) - 8, L2('Parque del Amor', 'Park of Love')], ['pesight', 236, lmCoast(236) - 7, L2('Faro de la Marina', 'Marina Lighthouse')], ['pefun', 190, lmCoast(190) - 4, L2('Parapente (300 de oro)', 'Paragliding (300 gold)')],
  ['pesight', 376, LM_RAV.by0, L2('Puente Villena', 'Villena Bridge')], ['pefun', LM_LARCO.door, lmCoast(LM_LARCO.door) + 3, L2('Larcomar (centro comercial)', 'Larcomar (shopping centre)')], ['pefood', 345, lmCoast(345) + 40, L2('Rosa Náutica (restaurante sobre el mar)', 'Rosa Náutica (restaurant over the sea)')],
  ...LM_STAIRS.map(x => ['pefun', x + 1, lmCoast(x) + 6, L2('Bajada a la playa', 'Stairs down to the beach')]), ['pefun', 300, lmCoast(300) + 23, L2('Playa y tablistas', 'Beach and surfers')]];
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); if (M && M.peru) return [{ c: 'pecity', x: PE_LIMA[0] * PE_K, y: PE_LIMA[1] * PE_K, t: L2('Lima · toca para ver su mapa', 'Lima · tap to see its map') }]; if (!M || M.id !== 'lima') return out;
  for (const [c, x, y, t] of LM_POI()) out.push({ c, x, y, t }); for (const e of G.ents) if (e.type === 'npc' && e.map === 'lima' && /^pe_cart_/.test(e.id)) out.push({ c: 'pefood', x: e.x / 16, y: e.y / 16, t: e.def.n }); return out; }; }
if (typeof MAPW_LIST !== 'undefined') { MAPW_LIST.push({ id: 'peru', n: L2('Perú', 'Peru'), mk: () => PE_MAPM, how: L2('Avión desde el Aeródromo de Albor (1.000 de oro). Toca Lima para ver su mapa.', 'Plane from Albor Aerodrome (1,000 gold). Tap Lima to see its map.') });
  MAPW_LIST.push({ id: 'lima', n: L2('Lima, Perú', 'Lima, Peru'), mk: () => makeLima(), how: L2('Avión desde el Aeródromo de Albor: billete a Lima por 1.000 de oro.', 'Plane from Albor Aerodrome: ticket to Lima for 1,000 gold.') }); }
const LM_LABELS = () => [[L2('PLAZA DE ARMAS', 'MAIN SQUARE'), 325, 80], [L2('CENTRO HISTÓRICO', 'HISTORIC CENTRE'), 220, 60], [L2('RÍO RÍMAC', 'RÍMAC RIVER'), 200, 15], ['CERRO SAN CRISTÓBAL', 400, 5], [L2('AEROPUERTO', 'AIRPORT'), 70, 28], ['CALLAO', 60, 100], ['SAN ISIDRO', 380, 200], ['MIRAFLORES', 400, 250], ['LARCOMAR', 318, lmCoast(318) + 11], ['COSTA VERDE', 200, lmCoast(200) + 16], [L2('OCÉANO PACÍFICO', 'PACIFIC OCEAN'), 300, 345], [L2('PARQUE KENNEDY', 'KENNEDY PARK'), 332, 240]];
{ const _rm = renderMap; renderMap = function (B) { _rm.apply(this, arguments); const Wd = MAPW_LIST[MAPW]; if (!Wd || (Wd.id !== 'peru' && Wd.id !== 'lima')) return; const cvs = $('#wm'); if (!cvs) return; const x = cvs.getContext('2d');
  if (Wd.id === 'lima') { const M = G.maps.lima; if (!M) return; const sc = cvs.width / M.w; x.textAlign = 'center'; x.font = `bold ${Math.round(8 + sc * 1.6)}px 'Pixelify Sans', monospace`; for (const [n, zx, zy] of LM_LABELS()) { x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.95)'; x.strokeText(n, zx * sc, zy * sc); x.fillStyle = '#ffd23a'; x.fillText(n, zx * sc, zy * sc); } return; }
  const M = PE_MAPM, sc = cvs.width / M.w, lx = PE_LIMA[0] * PE_K * sc, ly = PE_LIMA[1] * PE_K * sc, pul = 0.5 + 0.5 * Math.sin(Date.now() / 300);
  x.textAlign = 'center'; x.font = `bold ${Math.round(12 + sc * 4)}px 'Pixelify Sans', monospace`; x.lineWidth = 4; x.strokeStyle = 'rgba(10,6,4,0.9)'; x.strokeText(L2('PERÚ', 'PERU'), cvs.width * 0.62, cvs.height * 0.4); x.fillStyle = '#fff4c0'; x.fillText(L2('PERÚ', 'PERU'), cvs.width * 0.62, cvs.height * 0.4);
  x.font = `italic ${Math.round(9 + sc * 2)}px 'Pixelify Sans', monospace`; x.fillStyle = 'rgba(220,240,255,0.85)'; x.fillText(L2('Océano Pacífico', 'Pacific Ocean'), cvs.width * 0.2, cvs.height * 0.82);
  x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.beginPath(); x.arc(lx, ly, 10 + pul * 5, 0, 7); x.stroke(); x.fillStyle = '#d8102e'; x.beginPath(); x.moveTo(lx, ly); x.arc(lx, ly - 16, 8, Math.PI * 0.8, Math.PI * 2.2); x.closePath(); x.fill(); x.fillStyle = '#ffffff'; x.beginPath(); x.arc(lx, ly - 16, 3, 0, 7); x.fill();
  x.font = `bold ${Math.round(11 + sc * 3)}px 'Pixelify Sans', monospace`; x.lineWidth = 4; x.strokeStyle = 'rgba(10,6,4,0.95)'; x.textAlign = 'left'; x.strokeText('LIMA', lx + 14, ly - 12); x.fillStyle = '#ffd23a'; x.fillText('LIMA', lx + 14, ly - 12);
  const prev = cvs.onclick; cvs.onclick = e => { const r = cvs.getBoundingClientRect(), mx = (e.clientX - r.left) * (cvs.width / r.width), my = (e.clientY - r.top) * (cvs.height / r.height); if (Math.hypot(mx - lx, my - (ly - 8)) < 34 + sc * 6 || (mx > lx && mx < lx + 90 && Math.abs(my - ly + 12) < 18)) { const k = MAPW_LIST.findIndex(w => w.id === 'lima'); if (k >= 0) { MAPW = k; MAPF = null; renderPanel(); } return; } if (prev) prev(e); };
  const L = $('#mwList'); if (L) { L.insertAdjacentHTML('afterbegin', `<button class="btn gold" id="peGoLima" style="margin:.3em 0">📍 ${L2('Ver el mapa de Lima', 'Open the map of Lima')}</button>`); $('#peGoLima').onclick = () => { const k = MAPW_LIST.findIndex(w => w.id === 'lima'); if (k >= 0) { MAPW = k; MAPF = null; renderPanel(); } }; } }; }

// ---------- guía (lupa › sistemas), sellos de viaje y guardado ----------
SAVEKEYS.push('pe');
if (typeof STAMPS !== 'undefined') STAMPS.push(['m_lima', L2('Lima, Perú', 'Lima, Peru'), '#d8102e', 'PE'], ['pe_larcomar', 'Larcomar', '#c81e3a', 'LC'], ['pe_parapente', L2('Parapente en la Costa Verde', 'Paragliding on the Costa Verde'), '#ff7a1a', '🪂']);
if (typeof GSIS !== 'undefined') GSIS.unshift(['peru', '🇵🇪 ' + L2('Perú: Lima', 'Peru: Lima'), () => [
  L2('En el Aeródromo de Albor (al sur de Albor) la taquillera vende el billete a Lima por ' + PE_TICKET.toLocaleString() + ' de oro, sin nivel mínimo. Espera en la sala y embarca por la Puerta 1. La vuelta desde Lima es gratis.', 'At Albor Aerodrome (south of Albor) the ticket agent sells the ticket to Lima for ' + PE_TICKET.toLocaleString() + ' gold, with no minimum level. Wait in the lounge and board at Gate 1. The flight back from Lima is free.'),
  L2('Mapa › flechas › Perú: toca Lima para abrir el mapa de la ciudad, con todos sus lugares marcados.', 'Map › arrows › Peru: tap Lima to open the city map with all its places marked.'),
  L2('Lima es el mapa más grande del juego (más que Japón). Centro Histórico: Plaza de Armas con la pileta de bronce, palmeras y faroles; Palacio de Gobierno con cambio de guardia a mediodía (11:45-12:45); Catedral; Palacio Arzobispal; Municipalidad; portales; palomas que se espantan; Jirón de la Unión; Plaza San Martín; San Francisco; Cerro San Cristóbal y el río Rímac.', 'Lima is the largest map in the game (bigger than Japan). Historic Centre: Main Square with the bronze fountain, palms and lamps; Government Palace with the changing of the guard at noon (11:45-12:45); Cathedral; Archbishop\'s Palace; City Hall; arcades; pigeons that scatter; Jirón de la Unión; San Martín Square; San Francisco; San Cristóbal Hill and the Rímac River.'),
  L2('Miraflores: Parque Kennedy con 16 gatos (acarícialos a todos: +2.000 de oro), malecón con palmeras, Parque del Amor, faro, parapente (300 de oro) y Puente Villena. Bajan escaleras a la Costa Verde: Circuito de Playas, playa de piedritas, tablistas y la Rosa Náutica. Larcomar está en el acantilado y se puede entrar: comida peruana, café y helados.', 'Miraflores: Kennedy Park with 16 cats (pet them all: +2,000 gold), boardwalk with palms, Park of Love, lighthouse, paragliding (300 gold) and Villena Bridge. Stairs go down to the Costa Verde: beach road, pebble beach, surfers and the Rosa Náutica. Larcomar is in the cliff and you can go inside: Peruvian food, coffee and ice cream.'),
  L2('Hay unos 120 limeños y limeñas con ropa de diario, señoras y señores andinos con bombín y chullo, escolares, tablistas, guardias y vendedores de emoliente, anticuchos, picarones, ceviche, helados y chicha. También autos, taxis y combis que pitan. Todo lo ves igual con tus amigos en el online (mismo mapa).', 'There are about 120 Lima locals in everyday clothes, Andean women and men with bowler hats and chullos, schoolkids, surfers, guards and sellers of emoliente, anticuchos, picarones, ceviche, ice cream and chicha. Also cars, taxis and honking minibuses. Your friends see the same map online.')],
  () => G.P && G.P.map === 'lima' ? { loc: [325, 91], t: L2('Plaza de Armas', 'Main Square'), m: 'lima' } : { loc: [SA.term.door, SA.term.y + SA.term.h + 1], t: L2('Aeródromo de Albor', 'Albor Aerodrome'), m: 'world' }]);

// ---------- minimapa de Lima y nombre del barrio junto a la hora ----------
{ const _dm = drawMinimap; drawMinimap = function () { _dm.apply(this, arguments); const P = G.P, M = G.map; if (!P || !M || !M.lima || P.map !== M.id) return; const cvs = $('#mm'), x = cvs.getContext('2d'), S = cvs.width, tx = P.x / 16, ty = P.y / 16, ov = mapOverview(M);
  x.fillStyle = '#24618c'; x.fillRect(0, 0, S, S); x.imageSmoothingEnabled = false; x.drawImage(ov, Math.round(-tx * 3 + S / 2), Math.round(-ty * 3 + S / 2), ov.width * 1.5, ov.height * 1.5);
  for (const r of G.remote.values()) { if (r.map !== M.id) continue; x.fillStyle = PARTY.id && r.pt === PARTY.id ? '#7aff8a' : '#5ae0ff'; x.fillRect(Math.round((r.x / 16 - tx) * 3 + S / 2) - 1, Math.round((r.y / 16 - ty) * 3 + S / 2) - 1, 3, 3); }
  x.fillStyle = '#ffffff'; x.fillRect(S / 2 - 2, S / 2 - 2, 4, 4); x.strokeStyle = '#1a1010'; x.strokeRect(S / 2 - 2.5, S / 2 - 2.5, 5, 5); }; }
{ const _uh = updateHUD; updateHUD = function () { const r = _uh.apply(this, arguments); const P = G.P, M = G.map; if (P && M && M.lima && P.map === M.id) { const z = M.zoneAt ? M.zoneAt(P.x, P.y) : lmZoneAt(P.x, P.y), el = $('#zone'); if (z && el) { const t = el.textContent.replace(/ · [^·]*$/, ' · ' + z.n); if (t !== el.textContent) el.textContent = t; } } return r; }; }
