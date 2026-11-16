// ================= v4.81: JAPÓN (primera parte) =================
// Tierra nueva que pintó la Ventisca con un recuerdo de su propio mundo (ver docs/LORE.md). Se llega en avión desde el
// Aeródromo de Albor (nivel 400). Mapa de 320×220 (el doble de las Tierras sin Pintar, el mayor hasta ahora):
//   Monte Fuji con la pagoda Chureito y los cerezos · Kioto (machiyas, Kinkaku-ji, sendero de toriis, geishas) ·
//   Akihabara (carteles de anime, recreativos) · Tokio centro con la Torre de Tokio · Shinjuku/Kabukichō (neones,
//   karaoke, ramen) · Asakusa (Kaminarimon, Hōzōmon, templo, pagoda, Nakamise) · Aeropuerto de Tokio · playa.
// Calles con aceras, pasos de cebra, semáforos y coches que paran en rojo y ante el jugador. NPCs sin nombre propio
// (Japonés 1, Japonesa 2…). Carteles en japonés con los glifos de 6zz9w_jp_glyphs.js (jpText).
const JP_W = 320, JP_H = 300;
const JP_VR = [118, 142, 166, 190, 214, 238, 262, 286], JP_HR = [4, 28, 52, 76, 100, 124, 148];
const JP_ZONES = [
  { k: 'fuji', n: L2('Monte Fuji', 'Mount Fuji'), j: '富士山', x0: 3, x1: 117, y0: 3, y1: 82 },
  { k: 'kioto', n: L2('Kioto', 'Kyoto'), j: '京都', x0: 3, x1: 117, y0: 83, y1: 216 },
  { k: 'aki', n: 'Akihabara', j: '秋葉原', x0: 118, x1: 237, y0: 3, y1: 75 },
  { k: 'tokio', n: L2('Tokio · Torre de Tokio', 'Tokyo · Tokyo Tower'), j: '東京タワー', x0: 118, x1: 237, y0: 76, y1: 153 },
  { k: 'shinjuku', n: 'Shinjuku · Kabukichō', j: '新宿', x0: 238, x1: 316, y0: 3, y1: 153 },
  { k: 'aeropuerto', n: L2('Aeropuerto de Tokio', 'Tokyo Airport'), j: '東京国際空港', x0: 244, x1: 316, y0: 154, y1: 216 },
  { k: 'asakusa', n: 'Asakusa', j: '浅草', x0: 118, x1: 243, y0: 154, y1: 216 },
];
const JP_Q = { term: { x: 262, y: 160, w: 19, h: 4, door: 271 }, park: { x0: 258, x1: 291, y0: 164, y1: 170 }, apron: { x0: 248, x1: 312, y0: 172, y1: 176 }, run: { x0: 246, x1: 314, y0: 180, y1: 183 }, taxiE: 309, taxiW: 251, gates: [274, 290], side: 284, liv: 1 };
const JP_ASK = { x0: 126, x1: 180, y0: 156, y1: 204, lane: 150 };   // recinto de Asakusa
const JP_KIN = { x0: 12, x1: 64, y0: 160, y1: 204 };                  // jardín del Kinkaku-ji
const JP_G = { GRASS: 0, ROAD: 1, WALK: 2, PATH: 3, SEA: 4, POND: 5, STONE: 6, SAND: 7, RUN: 9, LANE: 10, PINK: 11, ROCK: 13 };

// ---------- suelo propio de Japón (se pinta en los trozos del mapa) ----------
{ const _rc = renderChunk; renderChunk = function (M, cx, cy) { if (!M || !M.jp) return _rc.apply(this, arguments); const [c, g] = XC(CHP, CHP); jpPaint(M, g, cx, cy); return c; }; }
function jpPaint(M, g, cx, cy) { const Q = JP_Q;
  for (let ty = cy * CH; ty < cy * CH + CH; ty++) for (let tx = cx * CH; tx < cx * CH + CH; tx++) { if (tx >= M.w || ty >= M.h) continue; const i = ty * M.w + tx, k = M.jg[i], m = M.jm[i], x = (tx - cx * CH) * 16, y = (ty - cy * CH) * 16, h = hash2(tx, ty, 71), h2 = hash2(tx, ty, 72);
    switch (k) {
      case 1: g.fillStyle = h < 0.5 ? '#3c3f47' : '#40434b'; g.fillRect(x, y, 16, 16); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(x + ((h * 97) | 0) % 14, y + ((h2 * 53) | 0) % 14, 2, 1); break;
      case 2: g.fillStyle = '#c9c5bd'; g.fillRect(x, y, 16, 16); g.fillStyle = '#b3afa7'; g.fillRect(x, y + 7, 16, 1); g.fillRect(x + (ty % 2 ? 4 : 12), y, 1, 7); g.fillRect(x + (ty % 2 ? 12 : 4), y + 8, 1, 8); g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(x, y, 16, 1); break;
      case 3: g.fillStyle = '#d6c296'; g.fillRect(x, y, 16, 16); g.fillStyle = '#c0aa7c'; for (let k2 = 0; k2 < 4; k2++) g.fillRect(x + ((h * 31 + k2 * 7) | 0) % 15, y + ((h2 * 17 + k2 * 5) | 0) % 15, 1, 1); break;
      case 4: { const sh = M.jsh && M.jsh[i]; g.fillStyle = sh ? '#3a86c8' : '#2a64ac'; g.fillRect(x, y, 16, 16); g.fillStyle = 'rgba(255,255,255,0.18)'; if (h < 0.4) g.fillRect(x + ((h * 70) | 0) % 10, y + ((h2 * 90) | 0) % 13, 5, 1); if (sh) { g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x, y + 2, 16, 1); } break; }
      case 5: g.fillStyle = h < 0.5 ? '#2e6e86' : '#327490'; g.fillRect(x, y, 16, 16); g.fillStyle = 'rgba(200,240,255,0.18)'; if (h < 0.3) g.fillRect(x + 3, y + ((h2 * 12) | 0), 6, 1); break;
      case 6: g.fillStyle = h < 0.5 ? '#aba79e' : '#a39f96'; g.fillRect(x, y, 16, 16); g.fillStyle = '#8c887f'; g.fillRect(x, y + 15, 16, 1); g.fillRect(x + 15, y, 1, 16); g.fillStyle = 'rgba(255,255,255,0.2)'; g.fillRect(x, y, 15, 1); break;
      case 7: g.fillStyle = h < 0.5 ? '#e8d8a2' : '#e2d098'; g.fillRect(x, y, 16, 16); g.fillStyle = '#d0bc84'; g.fillRect(x + ((h * 40) | 0) % 14, y + ((h2 * 40) | 0) % 14, 1, 1); break;
      case 9: g.fillStyle = h < 0.5 ? '#34373e' : '#383b42'; g.fillRect(x, y, 16, 16); break;
      case 10: g.fillStyle = h < 0.5 ? '#bba98a' : '#b4a283'; g.fillRect(x, y, 16, 16); g.fillStyle = '#9c8a6c'; for (let k2 = 0; k2 < 3; k2++) g.fillRect(x + ((h * 23 + k2 * 9) | 0) % 14, y + ((h2 * 29 + k2 * 6) | 0) % 14, 2, 1); break;
      case 13: g.fillStyle = h < 0.5 ? '#5e5a6a' : '#666274'; g.fillRect(x, y, 16, 16); break;
      default: jpGrass(g, x, y, tx, ty, k === 11);
    }
    // marcas: 1 línea central (abajo), 2 línea central (derecha), 3 paso de cebra en calle horizontal, 4 en calle vertical, 5/6 bordes de pista, 7 eje de pista, 8 cabecera, 9/10 líneas amarillas de rodaje
    if (m === 1 && tx % 2) { g.fillStyle = '#f0f0f0'; g.fillRect(x + 2, y + 15, 12, 2); }
    else if (m === 2 && ty % 2) { g.fillStyle = '#f0f0f0'; g.fillRect(x + 15, y + 2, 2, 12); }
    else if (m === 3) { g.fillStyle = '#ececec'; for (const k2 of [1, 6, 11]) g.fillRect(x + 1, y + k2, 14, 3); }
    else if (m === 4) { g.fillStyle = '#ececec'; for (const k2 of [1, 6, 11]) g.fillRect(x + k2, y + 1, 3, 14); }
    else if (m === 5) { g.fillStyle = '#e8e8e8'; g.fillRect(x, y + 1, 16, 1); } else if (m === 6) { g.fillStyle = '#e8e8e8'; g.fillRect(x, y + 14, 16, 1); }
    else if (m === 7 && tx % 3 === 0) { g.fillStyle = '#f4f4f4'; g.fillRect(x + 2, y + 15, 12, 2); } else if (m === 8) { g.fillStyle = '#f0f0f0'; for (let k2 = 2; k2 < 16; k2 += 4) g.fillRect(x + 4, y + k2, 8, 2); }
    else if (m === 9) { g.fillStyle = '#ffd040'; g.fillRect(x, y + 7, 16, 2); } else if (m === 10) { g.fillStyle = '#ffd040'; g.fillRect(x + 7, y, 2, 16); }
  } }
// de noche, Japón también oscurece (como el mundo) y se encienden los neones
{ const _dk = darkness; darkness = function () { const M = G.map; if (M && M.jp) { const h = (G.time / 60) % 24; let d; if (h >= 20 || h < 5) d = 1; else if (h >= 18) d = (h - 18) / 2; else if (h < 7) d = 1 - (h - 5) / 2; else d = 0; return d * 0.6; } return _dk.apply(this, arguments); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl.apply(this, arguments); if (M && M.jp) for (const d of list) if (d && d.k === 'furn' && d.jl) for (const L of d.jl) out.push({ x: d.px + L[0], y: d.py + L[1], r: L[2], c: L[3] }); return out; }; }

// ---------- edificios: jpb_<tipo>_<ancho>_<variante> (se generan al verlos y se guardan) ----------
const JP_AKI_W = ['アニメ', 'ゲーム', 'フィギュア', '漫画', 'ガチャ', '新作', '限定', 'ロボ'], JP_NEON_W = ['焼肉', '居酒屋', 'カラオケ', '寿司', '酒', '餃子', '焼鳥', '定食', 'ホテル', '激安'];
const JP_SHOP_W = ['薬', '本屋', '服', '時計', 'カフェ', '弁当', 'うどん', 'そば', '天ぷら', '和菓子', '甘味', '団子'];
const JP_H_OF = { office: v => 96 + v * 12, tower: v => 168 + v * 12, aki: v => 104 + (v % 3) * 12, neon: v => 92 + (v % 3) * 12, apt: v => 76 + (v % 3) * 14, shop: v => 56 + (v % 2) * 12, machiya: v => 52 + (v % 2) * 12,
  konbini: () => 56, karaoke: () => 112, ramen: () => 64, arcade: () => 108, hotel: v => 120 + (v % 2) * 8 };
{ const _x = genFurn2; genFurn2 = function (kind) { if (typeof kind === 'string' && kind.startsWith('jpb_')) { try { return jpBld(kind); } catch (e) { console.warn(kind, e); } } return _x.apply(this, arguments); }; }
function jpPortrait(g, x, y, i, sc) { try { const A = xwAtlas(i, JP_APPS), col = A.idx.idle; g.save(); g.imageSmoothingEnabled = false; g.drawImage(A.img, col * A.fw + 7, 2, 34, 30, x, y, 34 * sc, 30 * sc); g.restore(); } catch (e) { } }
function jpWin(g, x, y, w, h, lit, v) { g.fillStyle = lit ? (v % 3 ? '#ffe8a0' : '#fff4d0') : '#3a5878'; g.fillRect(x, y, w, h); g.fillStyle = lit ? 'rgba(255,255,255,0.5)' : 'rgba(170,210,255,0.55)'; g.fillRect(x, y, 1, Math.max(1, h - 2)); g.fillRect(x, y, Math.max(1, w - 2), 1); }
function jpBld(key) { const [, kind, ws, vs] = key.split('_'), w = +ws, v = +vs, W = w * 16, H = JP_H_OF[kind] ? JP_H_OF[kind](v) : 96, [c, g] = XC(W, H), r = n => hash2(w * 13 + n, v * 7 + kind.length, 991);
  const R = (x, y, ww, hh, col) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
  const door = (x, col) => { R(x, H - 22, 14, 22, '#1e2e40'); R(x + 1, H - 21, 6, 21, 'rgba(160,210,255,0.5)'); R(x + 7, H - 21, 6, 21, 'rgba(160,210,255,0.4)'); R(x - 1, H - 24, 16, 2, col || '#e8ecf2'); };
  const base = (col) => { R(0, H - 3, W, 3, '#5a5650'); };
  if (kind === 'office' || kind === 'hotel') { const pal = ['#b8b4ac', '#8a96a4', '#c8c0b0', '#9aa0a8', '#a89888', '#d0ccc4'], fc = pal[(v + w) % pal.length]; R(0, 6, W, H - 6, fc); R(0, 0, W, 7, uMulH(fc, 0.75)); R(0, 6, W, 1, uMulH(fc, 1.12 > 1 ? 1 : 1));
    for (let y = 12; y < H - 30; y += 14) { for (let x = 4; x < W - 6; x += 10) jpWin(g, x, y, 7, 9, r(x * 3 + y) < 0.18, x + y); R(0, y + 11, W, 1, uMulH(fc, 0.85)); }
    R(0, H - 28, W, 25, '#2a3a4a'); for (let x = 2; x < W - 2; x += 12) { R(x, H - 26, 10, 22, 'rgba(150,200,240,0.45)'); } door((W >> 1) - 7); base();
    if (kind === 'hotel') { R(W - 12, 10, 10, 54, '#c81e3a'); jpText(g, 'ホテル', W - 12, 12, '#fff4d0', 10, true); } else if (v % 2) { R(W - 20, -0, 12, 6, '#7a8090'); R(W - 18, 0, 8, 2, '#9aa0b0'); } }
  else if (kind === 'tower') { const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, ['#3a6a98', '#2a5a7a', '#4a6a88', '#3a5a6a'][v % 4]); gr.addColorStop(1, ['#1e3a5a', '#16304a', '#2a3a52', '#1e3438'][v % 4]); g.fillStyle = gr; g.fillRect(0, 14, W, H - 14);
    g.fillStyle = 'rgba(200,230,255,0.22)'; for (let x = 0; x < W; x += 6) g.fillRect(x, 14, 1, H - 14); g.fillStyle = 'rgba(0,0,0,0.18)'; for (let y = 18; y < H; y += 6) g.fillRect(0, y, W, 1);
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.beginPath(); g.moveTo(0, 60 + v * 10); g.lineTo(W * 0.6, 14); g.lineTo(W * 0.8, 14); g.lineTo(0, 100 + v * 10); g.fill();
    for (let k = 0; k < 18; k++) if (r(k) < 0.5) jpWin(g, 2 + ((r(k + 40) * (W - 6)) | 0), 20 + ((r(k + 80) * (H - 50)) | 0), 4, 4, true, k);
    R(4, 6, W - 8, 9, '#2a3448'); R(8, 0, W - 16, 7, '#3a4458'); R((W >> 1) - 1, -0, 2, 6, '#c8ccd4'); R(0, H - 24, W, 21, '#1a2430'); for (let x = 2; x < W - 2; x += 10) R(x, H - 22, 8, 18, 'rgba(160,210,255,0.5)'); door((W >> 1) - 7); base(); }
  else if (kind === 'aki') { const fcs = ['#e8e4dc', '#f0d040', '#e85a3a', '#3a8ad8', '#f4f4f4', '#d84a8a'], fc = fcs[(v + w) % fcs.length]; R(0, 4, W, H - 4, fc); R(0, 0, W, 5, uMulH(fc, 0.7));
    // carteles de anime con personajes del propio juego
    const bw = Math.min(W - 18, 52), bh = 40, bx = 4, by = 10; R(bx - 2, by - 2, bw + 4, bh + 4, '#1a1a22'); const bg = ['#ffb8d8', '#a8d8ff', '#fff0a0', '#c8a8ff', '#a8ffd0'][(v + w) % 5]; R(bx, by, bw, bh, bg);
    for (let k = 0; k < 6; k++) R(bx + ((r(k) * bw) | 0), by + ((r(k + 9) * bh) | 0), 3, 3, '#ffffff'); jpPortrait(g, bx + (bw >> 1) - 17, by + 2, (v * 3 + w) % 8, 1); g.save(); g.beginPath(); g.rect(bx, by, bw, bh); g.clip(); jpText(g, JP_AKI_W[(v + w) % JP_AKI_W.length], bx + 2, by + bh - 11, '#1a1a22', 10); g.restore();
    const sx = W - 14; R(sx, 6, 13, H - 40, ['#c81e3a', '#1a5ad8', '#1a1a22', '#ff7a1a'][(v + w * 2) % 4]); g.save(); g.beginPath(); g.rect(sx, 6, 13, H - 40); g.clip(); jpText(g, JP_AKI_W[(v * 3 + w + 2) % JP_AKI_W.length], sx + 2, 9, '#ffffff', 10, true); g.restore();
    if (H > 100) { R(4, by + bh + 6, W - 22, 20, '#1a1a22'); jpPortrait(g, 6, by + bh + 6, (v * 5 + w + 7) % 8, 0.66); g.save(); g.beginPath(); g.rect(4, by + bh + 6, W - 22, 20); g.clip(); jpText(g, JP_AKI_W[(w + v + 4) % JP_AKI_W.length], 30, by + bh + 11, '#ffe040', 10); g.restore(); }
    for (let y = H - 34; y > by + bh + 30; y -= 14) for (let x = 4; x < W - 18; x += 10) jpWin(g, x, y, 7, 8, true, x);
    R(0, H - 30, W, 4, '#ff3a8a'); R(0, H - 26, W, 23, '#fff4e0'); for (let x = 3; x < W - 3; x += 7) R(x, H - 22, 5, ((r(x) * 8) | 0) + 6, ['#ff5a8a', '#5ab0ff', '#ffd040', '#8aff6a'][x % 4]); door((W >> 1) - 7, '#ff3a8a'); base(); }
  else if (kind === 'neon') { const fc = ['#2a2430', '#302830', '#24283a', '#3a2a2a'][v % 4]; R(0, 4, W, H - 4, fc); R(0, 0, W, 5, '#1a1620');
    const cols = ['#c81e3a', '#e8a020', '#1a8ad8', '#d83ab8', '#2ab868', '#f0e040']; let y = 10; for (let k = 0; y < H - 40; k++, y += 16) { const cc = cols[(k + v + w) % cols.length], ww = W - 18 - ((k % 2) * 8); R(3, y, ww, 13, cc); R(3, y, ww, 1, 'rgba(255,255,255,0.5)'); jpText(g, JP_NEON_W[(k * 3 + v + w) % JP_NEON_W.length], 6, y + 1, k % 3 === 2 ? '#1a1620' : '#ffffff', 10); }
    R(W - 13, 8, 11, H - 46, '#ff2a6a'); R(W - 12, 9, 9, H - 48, '#1a1620'); jpText(g, JP_NEON_W[(v + w + 5) % JP_NEON_W.length], W - 12, 11, '#ff7ab0', 10, true);
    R(0, H - 28, W, 25, '#4a2a1a'); R(2, H - 26, W - 4, 4, '#1a3a7a'); jpText(g, '営業中', 4, H - 22, '#ffffff', 10); for (const x of [3, W - 11]) { g.fillStyle = '#e8281e'; g.beginPath(); g.ellipse(x + 4, H - 11, 4, 6, 0, 0, 7); g.fill(); R(x + 1, H - 17, 6, 1, '#1a1a1a'); R(x + 1, H - 6, 6, 1, '#1a1a1a'); } door((W >> 1) - 7, '#e8281e'); base(); }
  else if (kind === 'apt') { const fc = ['#e8dcc4', '#d8c8a8', '#c8d0d8', '#e4d4d4'][v % 4]; R(0, 4, W, H - 4, fc); R(0, 0, W, 5, uMulH(fc, 0.72));
    for (let y = 10; y < H - 22; y += 14) { for (let x = 3; x < W - 3; x += 16) { R(x, y, 12, 9, '#4a6a8a'); R(x + 1, y + 1, 4, 7, 'rgba(180,220,255,0.5)'); if (r(x + y) < 0.3) R(x + 2, y + 2, 8, 3, ['#ff8aa8', '#8ad0ff', '#fff4a0'][(x + y) % 3]); } R(0, y + 9, W, 3, '#9aa0a8'); for (let x = 0; x < W; x += 3) R(x, y + 9, 1, 3, '#7a8088'); }
    R(0, H - 22, W, 19, uMulH(fc, 0.85)); door((W >> 1) - 7); base(); }
  else if (kind === 'shop') { const fc = ['#f0e8d8', '#e8d0b0', '#d8e0e8', '#f4e4e4'][v % 4], aw = ['#c81e3a', '#1a7a4a', '#1a4a9a', '#e88a1a'][(v + w) % 4]; R(0, 4, W, H - 4, fc); R(0, 0, W, 5, '#6a5a50');
    R(3, 9, W - 6, 13, '#1a1a22'); jpText(g, JP_SHOP_W[(v * 2 + w) % JP_SHOP_W.length], 6, 10, '#ffe8a0', 10); for (let x = 4; x < W - 6; x += 12) jpWin(g, x, 25, 8, 8, false, x);
    for (let x = 0; x < W; x += 8) { R(x, H - 30, 8, 6, (x / 8) % 2 ? aw : '#ffffff'); } R(0, H - 24, W, 21, '#fff8e8'); for (let x = 3; x < W - 3; x += 6) R(x, H - 14, 4, 8, ['#ff8a5a', '#5ab0ff', '#ffd040', '#8aff6a', '#c08aff'][x % 5]); door((W >> 1) - 7, aw); base(); }
  else if (kind === 'machiya') { const wd = '#4a2e1e', wd2 = '#5e3a26', rf = '#4a5262'; R(0, 14, W, H - 14, wd2);
    for (let x = 1; x < W; x += 3) R(x, H - 30, 1, 26, wd); R(0, H - 31, W, 2, wd); g.fillStyle = rf; g.beginPath(); g.moveTo(-2, 16); g.lineTo(W + 2, 16); g.lineTo(W - 4, 2); g.lineTo(4, 2); g.fill(); R(-2, 15, W + 4, 3, '#2e3440'); for (let x = 2; x < W; x += 4) R(x, 4, 1, 11, '#5a6272');
    if (H > 56) { R(4, 22, W - 8, 10, '#e8dcc0'); for (let x = 6; x < W - 6; x += 4) R(x, 22, 1, 10, wd); R(-1, 34, W + 2, 3, rf); }
    const nc = ['#1e2a5a', '#5a1e1e', '#1e4a3a'][(v + w) % 3], nx = (W >> 1) - 10; R(nx, H - 28, 20, 12, nc); for (let k = 1; k < 4; k++) R(nx + k * 5, H - 28, 1, 12, '#e8dcc0'); jpText(g, ['茶', '酒', '本', '和'][(v + w) % 4], nx + 5, H - 27, '#ffffff', 10);
    R(nx + 2, H - 16, 16, 13, '#2a1a12'); g.fillStyle = '#f4ecd8'; g.beginPath(); g.ellipse(W - 6, H - 22, 3, 5, 0, 0, 7); g.fill(); R(W - 9, H - 28, 6, 1, '#1a1a1a'); base(); }
  else if (kind === 'konbini') { const st = [['#1a9a4a', '#2a6ad8'], ['#e8501e', '#2a9a4a'], ['#1a4ad8', '#4ac8f0']][v % 3]; R(0, 4, W, H - 4, '#f4f4f4'); R(0, 0, W, 5, '#c8ccd4'); R(0, 8, W, 4, st[0]); R(0, 12, W, 4, st[1]);
    R((W >> 1) - 30, 18, 60, 12, '#ffffff'); jpText(g, 'コンビニ', (W >> 1) - 26, 19, st[0], 10); jpText(g, '24', W - 18, 19, st[1], 10);
    R(2, H - 24, W - 4, 21, '#2a3a4a'); for (let x = 4; x < W - 4; x += 3) R(x, H - 21, 2, 4 + ((r(x) * 10) | 0), ['#ff8a5a', '#5ab0ff', '#ffd040', '#8aff6a', '#ff5a8a', '#ffffff'][x % 6]); R(2, H - 24, W - 4, 21, 'rgba(200,230,255,0.25)'); door((W >> 1) - 7, st[0]); base(); }
  else if (kind === 'karaoke') { R(0, 4, W, H - 4, '#2a1a3a'); R(0, 0, W, 5, '#1a0e24'); R(4, 8, 16, H - 40, '#ff3ab8'); R(5, 9, 14, H - 42, '#2a0a2a'); jpText(g, 'カラオケ', 7, 12, '#ff9ae0', 10, true);
    R(24, 12, W - 28, 20, '#ffe040'); R(25, 13, W - 30, 18, '#3a1a5a'); jpText(g, 'カラオケ', 28, 16, '#ffe040', 10); for (let y = 40; y < H - 32; y += 12) for (let x = 26; x < W - 4; x += 10) jpWin(g, x, y, 7, 7, true, x + y);
    for (let x = 0; x < W; x += 6) R(x, H - 30, 3, 2, ['#ff3ab8', '#3ad8ff', '#ffe040'][(x / 6) % 3]); R(0, H - 28, W, 25, '#4a2a6a'); door((W >> 1) - 7, '#ff3ab8'); base(); }
  else if (kind === 'ramen') { R(0, 10, W, H - 10, '#6a4a2a'); g.fillStyle = '#3a3a44'; g.beginPath(); g.moveTo(-2, 12); g.lineTo(W + 2, 12); g.lineTo(W - 4, 0); g.lineTo(4, 0); g.fill();
    R(4, 16, W - 8, 13, '#1a1a1a'); jpText(g, 'ラーメン', 8, 17, '#ffd040', 10); const nx = (W >> 1) - 14; R(nx, H - 30, 28, 13, '#c81e1e'); for (let k = 1; k < 4; k++) R(nx + k * 7, H - 30, 1, 13, '#ffffff'); jpText(g, '麺', nx + 9, H - 29, '#ffffff', 10);
    for (const x of [4, W - 12]) { g.fillStyle = '#e8281e'; g.beginPath(); g.ellipse(x + 4, H - 22, 4, 6, 0, 0, 7); g.fill(); } R(nx + 4, H - 17, 20, 14, '#2a1a12'); base(); }
  else if (kind === 'arcade') { R(0, 4, W, H - 4, '#f0c020'); R(0, 0, W, 5, '#c89010'); for (let x = 0; x < W; x += 10) R(x, 8, 5, H - 40, 'rgba(255,60,60,0.35)');
    R(4, 12, W - 8, 26, '#c81e3a'); R(6, 14, W - 12, 22, '#1a1a22'); jpText(g, 'ゲーム', (W >> 1) - 20, 15, '#ffe040', 12); for (let k = 0; k < 8; k++) R(8 + k * ((W - 16) / 8), 32, 3, 2, ['#ff3ab8', '#3ad8ff', '#8aff6a'][k % 3]);
    jpPortrait(g, 6, 44, (v + 3) % 8, 1); jpPortrait(g, W - 42, 44, (v + 9) % 8, 1); R(0, H - 30, W, 27, '#1a1a2a'); for (let x = 4; x < W - 4; x += 14) { R(x, H - 26, 10, 18, '#3a3a5a'); R(x + 2, H - 24, 6, 6, ['#5ad0ff', '#ff5ab8', '#8aff6a'][x % 3]); } door((W >> 1) - 7, '#ffe040'); base(); }
  return { c, ax: W / 2, ay: H - 1 }; }
// luces de noche de cada tipo de edificio (relativas a px, py)
function jpBldLights(kind, w) { const W = w * 16, a = [];
  if (kind === 'neon' || kind === 'aki' || kind === 'karaoke' || kind === 'arcade') a.push([0, -50, 64, kind === 'neon' ? 'rgba(255,90,160,0.55)' : kind === 'aki' ? 'rgba(255,230,120,0.5)' : kind === 'karaoke' ? 'rgba(255,80,220,0.6)' : 'rgba(255,220,60,0.55)']);
  else if (kind === 'konbini') a.push([0, -10, 54, 'rgba(220,240,255,0.6)']); else if (kind === 'ramen' || kind === 'machiya') a.push([0, -16, 40, 'rgba(255,170,90,0.55)']); else if (kind === 'tower') a.push([0, -90, 46, 'rgba(200,230,255,0.35)']);
  return a; }

// ---------- monumentos y decorado ----------
XSPR.jp_vacio = () => { const [c] = XC(2, 2); return { c, ax: 1, ay: 1 }; };
XSPR.jp_fuji = () => { const W = 640, H = 300, [c, g0_] = XC(W, H); let g = g0_;
  const body = new Path2D(); body.moveTo(0, H); body.quadraticCurveTo(160, 210, 262, 34); body.lineTo(300, 26); body.lineTo(338, 30); body.lineTo(378, 34); body.quadraticCurveTo(480, 210, W, H); body.closePath();
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#5a64a0'); gr.addColorStop(0.6, '#4a5690'); gr.addColorStop(1, '#3e5a7a'); g.fillStyle = gr; g.fill(body);
  g.save(); g.clip(body); const sh = g.createLinearGradient(0, 0, W, 0); sh.addColorStop(0, 'rgba(255,255,255,0.12)'); sh.addColorStop(0.45, 'rgba(255,255,255,0)'); sh.addColorStop(0.55, 'rgba(0,0,30,0.1)'); sh.addColorStop(1, 'rgba(0,0,30,0.22)'); g.fillStyle = sh; g.fillRect(0, 0, W, H);
  // nieve con borde irregular y chorreones
  const [sc, sg] = XC(W, H), g0 = g; g = sg; g.save(); g.clip(body);
  g.fillStyle = '#f4f2fa'; g.beginPath(); g.moveTo(240, 70); for (let x = 240; x <= 400; x += 6) { const y = 100 + Math.sin(x * 0.21) * 10 + (hash2(x, 3, 5) * 26) + (Math.abs(x - 320) < 60 ? 14 : 0); g.lineTo(x, y); if (hash2(x, 7, 5) < 0.35) { g.lineTo(x + 2, y + 18 + hash2(x, 8, 5) * 30); g.lineTo(x + 4, y); } } g.lineTo(400, 0); g.lineTo(240, 0); g.fill();
  g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(255,215,232,0.35)'; g.fillRect(240, 0, 70, 160); g.fillStyle = 'rgba(150,160,205,0.42)'; g.fillRect(328, 0, 90, 170); g.globalCompositeOperation = 'source-over'; g.restore(); g = g0; g.drawImage(sc, 0, 0);
  const hz = g.createLinearGradient(0, H - 70, 0, H); hz.addColorStop(0, 'rgba(140,170,210,0)'); hz.addColorStop(1, 'rgba(140,170,210,0.55)'); g.fillStyle = hz; g.fillRect(0, H - 70, W, 70); g.restore();
  g.fillStyle = '#2a4a2a'; for (let x = 0; x < W; x += 9) { const hh = 10 + hash2(x, 2, 9) * 16; g.beginPath(); g.moveTo(x - 6, H); g.lineTo(x, H - hh); g.lineTo(x + 6, H); g.fill(); }
  const [c2, g2] = XC(400, 188); g2.imageSmoothingEnabled = false; g2.drawImage(c, 0, 0, 400, 188); return { c: c2, ax: 200, ay: 187 }; };
XSPR.jp_pagoda = () => { const W = 80, H = 156, [c, g] = XC(W, H), red = '#c8302a', red2 = '#a02420', rf = '#384848', rf2 = '#4e6060', cx = W / 2;
  g.fillStyle = '#8a867e'; g.fillRect(8, H - 10, W - 16, 10); g.fillStyle = '#a8a49c'; g.fillRect(8, H - 10, W - 16, 2);
  let y = H - 10; for (let k = 0; k < 5; k++) { const bw = 40 - k * 5, rw = 74 - k * 9, bh = 16; g.fillStyle = red; g.fillRect(cx - bw / 2, y - bh, bw, bh); g.fillStyle = red2; g.fillRect(cx - bw / 2, y - 3, bw, 3); g.fillStyle = '#f0e8d8'; g.fillRect(cx - bw / 2 + 3, y - bh + 4, bw - 6, 5); for (let x = cx - bw / 2 + 5; x < cx + bw / 2 - 4; x += 5) g.fillStyle = red2, g.fillRect(x, y - bh + 4, 1, 5);
    y -= bh; g.fillStyle = rf; g.beginPath(); g.moveTo(cx - rw / 2 - 3, y - 1); g.quadraticCurveTo(cx - rw / 4, y - 3, cx - bw / 2 + 2, y - 9); g.lineTo(cx + bw / 2 - 2, y - 9); g.quadraticCurveTo(cx + rw / 4, y - 3, cx + rw / 2 + 3, y - 1); g.lineTo(cx + rw / 2, y + 2); g.lineTo(cx - rw / 2, y + 2); g.fill(); g.fillStyle = rf2; g.fillRect(cx - rw / 2 + 2, y - 2, rw - 4, 2); y -= 9; }
  g.fillStyle = '#2a2a30'; g.fillRect(cx - 1, y - 30, 3, 30); g.fillStyle = '#c8a040'; for (let k = 0; k < 7; k++) g.fillRect(cx - 3, y - 6 - k * 4, 7, 2); g.fillRect(cx - 1, y - 34, 3, 4); return { c, ax: cx, ay: H - 1 }; };
XSPR.jp_kinkaku = () => { const W = 116, H = 104, [c, g] = XC(W, H), au = '#e8b830', au2 = '#c89418', au3 = '#ffe080', rf = '#2a2220', cx = W / 2;
  const roof = (y, w) => { g.fillStyle = rf; g.beginPath(); g.moveTo(cx - w / 2 - 4, y + 2); g.quadraticCurveTo(cx - w / 3, y - 1, cx - w / 2 + 8, y - 8); g.lineTo(cx + w / 2 - 8, y - 8); g.quadraticCurveTo(cx + w / 3, y - 1, cx + w / 2 + 4, y + 2); g.fill(); g.fillStyle = au; g.fillRect(cx - w / 2 - 3, y + 1, w + 6, 1); };
  g.fillStyle = '#6a6a62'; g.fillRect(4, H - 6, W - 8, 6); g.fillStyle = '#7a5a3a'; g.fillRect(10, H - 30, W - 20, 24); g.fillStyle = '#efe6cc'; for (let x = 14; x < W - 14; x += 9) g.fillRect(x, H - 27, 7, 18); g.fillStyle = '#5a3e26'; for (let x = 12; x < W - 10; x += 9) g.fillRect(x, H - 30, 2, 24);
  roof(H - 30, W - 12); g.fillStyle = au; g.fillRect(16, H - 56, W - 32, 18); g.fillStyle = au2; for (let x = 18; x < W - 16; x += 8) g.fillRect(x, H - 56, 2, 18); g.fillStyle = au3; g.fillRect(16, H - 56, W - 32, 1); g.fillStyle = au2; g.fillRect(14, H - 40, W - 28, 2);
  roof(H - 56, W - 26); g.fillStyle = au; g.fillRect(30, H - 78, W - 60, 14); g.fillStyle = au2; for (let x = 32; x < W - 30; x += 7) g.fillRect(x, H - 78, 2, 14); g.fillStyle = au3; g.fillRect(30, H - 78, W - 60, 1);
  roof(H - 78, W - 46); g.fillStyle = rf; g.beginPath(); g.moveTo(cx - 24, H - 84); g.lineTo(cx, H - 96); g.lineTo(cx + 24, H - 84); g.fill(); g.fillStyle = au; g.fillRect(cx - 2, H - 102, 4, 6); g.fillRect(cx - 5, H - 99, 3, 2); g.fillRect(cx + 2, H - 101, 4, 2);
  return { c, ax: cx, ay: H - 1 }; };
function jpGate(W, H, two, sign) { const [c, g] = XC(W, H), red = '#c8282a', red2 = '#9a1e1e', rf = '#3a3c44', rf2 = '#565a64', cx = W / 2;
  g.fillStyle = '#8a867e'; g.fillRect(0, H - 6, W, 6); // base
  // cuerpos laterales
  for (const x0 of [4, W - 40]) { g.fillStyle = red; g.fillRect(x0, H - (two ? 70 : 60), 36, two ? 64 : 54); g.fillStyle = '#2a1e1a'; g.fillRect(x0 + 6, H - (two ? 56 : 48), 24, two ? 44 : 38); g.fillStyle = red2; for (let x = x0 + 8; x < x0 + 30; x += 5) g.fillRect(x, H - (two ? 56 : 48), 1, two ? 44 : 38); }
  g.fillStyle = red; for (const x of [40, W - 46]) g.fillRect(x, H - (two ? 76 : 64), 6, two ? 70 : 58);
  if (two) { g.fillStyle = '#f0ece0'; g.fillRect(8, H - 104, W - 16, 22); g.fillStyle = red; for (let x = 8; x < W - 8; x += 14) g.fillRect(x, H - 104, 3, 22); g.fillStyle = rf; g.fillRect(2, H - 82, W - 4, 6); g.fillStyle = rf2; g.fillRect(2, H - 82, W - 4, 2); }
  const ry = H - (two ? 104 : 64); g.fillStyle = rf; g.beginPath(); g.moveTo(-4, ry + 4); g.quadraticCurveTo(W * 0.15, ry - 2, 14, ry - 18); g.lineTo(W - 14, ry - 18); g.quadraticCurveTo(W * 0.85, ry - 2, W + 4, ry + 4); g.lineTo(W, ry + 7); g.lineTo(0, ry + 7); g.fill();
  g.fillStyle = rf2; for (let x = 16; x < W - 16; x += 5) g.fillRect(x, ry - 16, 1, 18); g.fillStyle = '#26282e'; g.fillRect(10, ry - 22, W - 20, 5); g.fillStyle = '#c8a040'; g.fillRect(8, ry - 22, 4, 4); g.fillRect(W - 12, ry - 22, 4, 4);
  // el gran farol rojo
  const ly = H - (two ? 70 : 58), lh = two ? 34 : 40, lw = two ? 26 : 34; g.fillStyle = '#1a1a1a'; g.fillRect(cx - lw / 2 + 2, ly - 3, lw - 4, 4); g.fillRect(cx - lw / 2 + 2, ly + lh - 1, lw - 4, 4);
  g.fillStyle = '#c81e1e'; g.beginPath(); g.ellipse(cx, ly + lh / 2, lw / 2, lh / 2, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 4; k < lh; k += 4) g.fillRect(cx - lw / 2 + 2, ly + k, lw - 4, 1); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(cx - lw / 2 + 4, ly + 4, 3, lh - 8);
  jpText(g, sign, cx - 6, ly + 4, '#1a1a1a', 12, true); return { c, ax: cx, ay: H - 1 }; }
XSPR.jp_kaminarimon = () => jpGate(150, 112, false, '雷門'); XSPR.jp_hozomon = () => jpGate(168, 146, true, '浅草');
XSPR.jp_hondo = () => { const W = 184, H = 132, [c, g] = XC(W, H), red = '#c8282a', rf = '#3a3c44', rf2 = '#565a64', cx = W / 2;
  g.fillStyle = '#8a867e'; g.fillRect(0, H - 10, W, 10); for (let k = 0; k < 3; k++) { g.fillStyle = k % 2 ? '#a8a49c' : '#9a968e'; g.fillRect(cx - 30 + k * 4, H - 10 - k * 3, 60 - k * 8, 3); }
  g.fillStyle = '#f0ece0'; g.fillRect(14, H - 60, W - 28, 50); g.fillStyle = red; for (let x = 14; x < W - 10; x += 20) g.fillRect(x, H - 62, 6, 52); g.fillStyle = '#2a1e1a'; g.fillRect(cx - 24, H - 50, 48, 40); g.fillStyle = '#c8a040'; g.fillRect(cx - 18, H - 46, 36, 3);
  g.fillStyle = rf; g.beginPath(); g.moveTo(-6, H - 58); g.quadraticCurveTo(W * 0.12, H - 66, 22, H - 100); g.lineTo(W - 22, H - 100); g.quadraticCurveTo(W * 0.88, H - 66, W + 6, H - 58); g.lineTo(W, H - 54); g.lineTo(0, H - 54); g.fill();
  g.fillStyle = rf2; for (let x = 24; x < W - 24; x += 5) g.fillRect(x, H - 98, 1, 40); g.fillStyle = rf; g.fillRect(30, H - 118, W - 60, 20); g.fillStyle = '#26282e'; g.fillRect(24, H - 124, W - 48, 7); g.fillStyle = '#c8a040'; g.fillRect(22, H - 124, 4, 5); g.fillRect(W - 26, H - 124, 4, 5);
  g.fillStyle = '#c81e1e'; g.beginPath(); g.ellipse(cx, H - 70, 10, 13, 0, 0, 7); g.fill(); jpText(g, '寺', cx - 5, H - 76, '#1a1a1a', 10); return { c, ax: cx, ay: H - 1 }; };
XSPR.jp_incienso = () => { const [c, g] = XC(36, 46); g.fillStyle = '#3a3428'; g.fillRect(6, 30, 24, 14); g.fillStyle = '#5a4e38'; g.fillRect(4, 26, 28, 6); g.fillStyle = '#2a2420'; g.fillRect(8, 44, 4, 2); g.fillRect(24, 44, 4, 2);
  g.fillStyle = '#4a4232'; g.fillRect(10, 12, 2, 14); g.fillRect(24, 12, 2, 14); g.fillStyle = '#3a3428'; g.beginPath(); g.moveTo(2, 14); g.lineTo(18, 2); g.lineTo(34, 14); g.fill(); g.fillStyle = '#c8a040'; g.fillRect(16, 0, 4, 3); return { c, ax: 18, ay: 45 }; };
XSPR.jp_torre = () => { const W = 76, H = 214, [c, g] = XC(W, H), O = '#e8501e', Wt = '#f4f0ec', cx = W / 2;
  const half = y => 3 + Math.pow(y / H, 1.8) * 33;
  for (let y = 40; y < H; y++) { const hw = half(y), band = Math.floor((H - y) / 18) % 2 ? Wt : O; g.fillStyle = band; g.fillRect(cx - hw, y, 3, 1); g.fillRect(cx + hw - 3, y, 3, 1); }
  g.strokeStyle = 'rgba(200,60,20,0.9)'; g.lineWidth = 1; for (let y = 44; y < H - 22; y += 9) { const a = half(y), b = half(y + 9); g.beginPath(); g.moveTo(cx - a, y); g.lineTo(cx + b, y + 9); g.moveTo(cx + a, y); g.lineTo(cx - b, y + 9); g.stroke(); }
  g.fillStyle = '#c84018'; for (let y = 58; y < H; y += 18) { const hw = half(y); g.fillRect(cx - hw, y, hw * 2, 2); }
  g.clearRect(cx - 18, H - 20, 36, 20); g.fillStyle = O; g.beginPath(); g.ellipse(cx, H - 1, 20, 18, 0, Math.PI, 0); g.lineTo(cx + 15, H - 1); g.ellipse(cx, H - 1, 15, 14, 0, 0, Math.PI, true); g.fill();
  for (const [y, w, h] of [[H - 82, 24, 13], [74, 14, 8]]) { g.fillStyle = '#e8ecf2'; g.fillRect(cx - w, y, w * 2, h); g.fillStyle = '#3a5a7a'; g.fillRect(cx - w + 2, y + 3, w * 2 - 4, h - 6); g.fillStyle = 'rgba(180,220,255,0.6)'; for (let x = cx - w + 3; x < cx + w - 3; x += 4) g.fillRect(x, y + 3, 2, h - 6); g.fillStyle = O; g.fillRect(cx - w - 2, y - 2, w * 2 + 4, 3); }
  g.fillStyle = Wt; g.fillRect(cx - 2, 6, 4, 36); g.fillStyle = O; for (let y = 8; y < 40; y += 8) g.fillRect(cx - 2, y, 4, 4); g.fillStyle = '#c8ccd4'; g.fillRect(cx - 1, 0, 2, 8);
  return { c, ax: cx, ay: H - 1 }; };
XSPR.jp_torii = () => { const [c, g] = XC(52, 58), V = '#d8402a', V2 = '#b03020'; g.fillStyle = V; g.fillRect(9, 12, 6, 46); g.fillRect(37, 12, 6, 46); g.fillStyle = V2; g.fillRect(13, 12, 2, 46); g.fillRect(41, 12, 2, 46);
  g.fillStyle = '#1a1a1a'; g.fillRect(9, 52, 6, 6); g.fillRect(37, 52, 6, 6); g.fillStyle = V; g.fillRect(4, 18, 44, 5); g.fillStyle = '#1a1a1a'; g.beginPath(); g.moveTo(0, 6); g.quadraticCurveTo(26, 12, 52, 6); g.lineTo(52, 10); g.quadraticCurveTo(26, 16, 0, 10); g.fill();
  g.fillStyle = V; g.fillRect(2, 10, 48, 4); g.fillRect(24, 14, 4, 5); return { c, ax: 26, ay: 57 }; };
XSPR.jp_farol = () => { const [c, g] = XC(18, 32), S = ['#5a5c66', '#7c7e88', '#a2a4ae']; g.fillStyle = S[1]; g.fillRect(6, 18, 6, 12); g.fillRect(3, 28, 12, 4); g.fillStyle = S[2]; g.fillRect(4, 10, 10, 8); g.fillStyle = '#fff0b0'; g.fillRect(7, 12, 4, 4);
  g.fillStyle = S[0]; g.beginPath(); g.moveTo(0, 11); g.lineTo(9, 3); g.lineTo(18, 11); g.fill(); g.fillStyle = S[1]; g.fillRect(8, 0, 2, 4); return { c, ax: 9, ay: 31, light: [9, 14] }; };
XSPR.jp_sakura = () => { const [c, g] = XC(56, 62); g.fillStyle = '#4a2e22'; g.fillRect(25, 34, 6, 28); g.fillRect(20, 40, 6, 3); g.fillRect(30, 38, 8, 3); g.fillStyle = '#3a2218'; g.fillRect(29, 34, 2, 28);
  const blob = (x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }; for (const [x, y, r] of [[16, 28, 12], [40, 26, 13], [28, 16, 14], [14, 16, 9], [44, 14, 9], [28, 32, 10]]) blob(x, y, r, '#e890b0');
  for (const [x, y, r] of [[16, 25, 10], [40, 23, 11], [28, 13, 12], [15, 13, 7], [43, 11, 7]]) blob(x, y, r, '#f4b4cc'); for (const [x, y, r] of [[25, 9, 6], [36, 17, 5], [13, 20, 4], [44, 20, 4]]) blob(x, y, r, '#ffd8e6');
  g.fillStyle = '#ffffff'; for (let k = 0; k < 14; k++) g.fillRect(4 + ((hash2(k, 1, 5) * 48) | 0), 4 + ((hash2(k, 2, 5) * 34) | 0), 1, 1); return { c, ax: 28, ay: 61 }; };
XSPR.jp_pino = () => { const [c, g] = XC(48, 50); g.fillStyle = '#4a3428'; g.beginPath(); g.moveTo(22, 50); g.quadraticCurveTo(14, 34, 26, 22); g.lineTo(30, 24); g.quadraticCurveTo(20, 34, 28, 50); g.fill(); g.fillRect(26, 22, 12, 3);
  const cl = (x, y, w, h) => { g.fillStyle = '#1e3a24'; g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.fill(); g.fillStyle = '#2e5a34'; g.beginPath(); g.ellipse(x - 1, y - 1, w - 2, h - 2, 0, 0, 7); g.fill(); g.fillStyle = '#4a7a4a'; g.fillRect(x - w + 3, y - h + 2, w, 1); };
  cl(14, 30, 12, 5); cl(38, 22, 10, 5); cl(24, 12, 13, 6); cl(36, 34, 8, 4); return { c, ax: 24, ay: 49 }; };
XSPR.jp_bambu = () => { const [c, g] = XC(20, 60); for (const [x, h] of [[3, 58], [9, 52], [14, 56]]) { g.fillStyle = '#5a9a3a'; g.fillRect(x, 60 - h, 3, h); g.fillStyle = '#7aba4a'; g.fillRect(x, 60 - h, 1, h); g.fillStyle = '#3a6a2a'; for (let y = 64 - h; y < 60; y += 9) g.fillRect(x, y, 3, 1);
    g.fillStyle = '#6aaa3a'; g.fillRect(x - 3, 62 - h + 6, 4, 1); g.fillRect(x + 2, 62 - h + 12, 4, 1); } return { c, ax: 10, ay: 59 }; };
XSPR.jp_roca = () => ({ c: xPix(22, 14, p => { p.ell(11, 8, 10, 6, C('#6a6a72')); p.ell(9, 6, 7, 4, C('#8a8a92')); p.set(6, 5, C('#a8a8b0')); p.set(14, 10, C('#4a7a3a')); }), ax: 11, ay: 13 });
XSPR.jp_maquina = () => { const [c, g] = XC(18, 32), col = ['#e8ecf2', '#c8102e', '#1a5ad8'][0]; g.fillStyle = '#c8102e'; g.fillRect(1, 2, 16, 30); g.fillStyle = '#e8ecf2'; g.fillRect(2, 4, 14, 14);
  for (let r2 = 0; r2 < 3; r2++) for (let k = 0; k < 4; k++) { g.fillStyle = ['#2a8a4a', '#e8a020', '#1a5ad8', '#c81e3a'][(k + r2) % 4]; g.fillRect(3 + k * 3, 5 + r2 * 4, 2, 3); } g.fillStyle = '#1a1a22'; g.fillRect(3, 21, 12, 5); g.fillStyle = '#3aff6a'; g.fillRect(4, 22, 3, 1); g.fillStyle = '#5a5a62'; g.fillRect(2, 27, 14, 3); return { c, ax: 9, ay: 31, light: [9, 10] }; };
XSPR.jp_poste = () => { const [c, g] = XC(30, 64); g.fillStyle = '#9a9a9e'; g.fillRect(13, 4, 4, 60); g.fillStyle = '#b8b8bc'; g.fillRect(13, 4, 1, 60); g.fillStyle = '#5a5a5e'; g.fillRect(2, 10, 26, 2); g.fillRect(6, 18, 18, 2); g.fillStyle = '#7a7a80'; g.fillRect(17, 24, 7, 9);
  g.fillStyle = '#2a2a2e'; for (const x of [3, 9, 21, 27]) g.fillRect(x, 8, 1, 3); g.fillStyle = 'rgba(30,30,30,0.6)'; g.fillRect(0, 9, 3, 1); g.fillRect(27, 9, 3, 1); return { c, ax: 15, ay: 63 }; };
XSPR.jp_semaforo = () => { const [c, g] = XC(16, 46); g.fillStyle = '#6a6e78'; g.fillRect(7, 10, 2, 36); g.fillStyle = '#3a3e48'; g.fillRect(0, 2, 16, 8); g.fillStyle = '#1a1c22'; for (const x of [2, 7, 12]) g.fillRect(x, 4, 3, 4); return { c, ax: 8, ay: 45 }; };
function jpStall(v) { const [c, g] = XC(48, 42), aw = [['#c81e3a', '#ffffff'], ['#1a4a9a', '#ffffff'], ['#1a7a4a', '#f4ecd8'], ['#e88a1a', '#ffffff']][v]; for (let x = 0; x < 48; x += 6) { g.fillStyle = aw[(x / 6) % 2]; g.fillRect(x, 13, 6, 8); } g.fillStyle = '#7a4a24'; g.fillRect(2, 21, 2, 21); g.fillRect(44, 21, 2, 21);
  g.fillStyle = '#9a6a3a'; g.fillRect(0, 30, 48, 4); for (let x = 4; x < 44; x += 4) { g.fillStyle = ['#ff8ab0', '#ffd040', '#8ad0ff', '#c8102e', '#ffffff', '#8aff6a'][(x / 4 + v) % 6]; g.fillRect(x, 26, 3, 4); } g.fillStyle = '#5a3418'; g.fillRect(0, 34, 48, 8);
  const t = ['団子', '扇子', '和菓子', '風鈴'][v], tw = jpW(t, 10); g.fillStyle = '#1a1a1a'; g.fillRect(24 - tw / 2 - 3, 0, tw + 6, 13); jpText(g, t, 24 - tw / 2, 1, '#ffffff', 10); return { c, ax: 24, ay: 41 }; }
for (let v = 0; v < 4; v++) XSPR['jp_puesto' + v] = () => jpStall(v);
XSPR.jp_chochin = () => { const [c, g] = XC(64, 26); g.strokeStyle = '#1a1a1a'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 3); g.quadraticCurveTo(32, 9, 64, 3); g.stroke();
  for (let k = 0; k < 5; k++) { const x = 6 + k * 13, y = 6 + Math.sin(k / 4 * Math.PI) * 2; g.fillStyle = '#e8281e'; g.beginPath(); g.ellipse(x, y + 8, 5, 7, 0, 0, 7); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(x - 3, y, 6, 2); g.fillRect(x - 3, y + 14, 6, 2); g.fillStyle = 'rgba(255,230,140,0.45)'; g.fillRect(x - 2, y + 4, 2, 7); }
  return { c, ax: 32, ay: 25 }; };
XSPR.jp_kabuki = () => { const W = 70, H = 84, [c, g] = XC(W, H); g.fillStyle = '#5a5a62'; g.fillRect(16, 22, 4, 62); g.fillRect(W - 20, 22, 4, 62); g.fillStyle = '#c81e1e'; g.fillRect(0, 4, W, 22); g.fillStyle = '#ff5a3a'; g.fillRect(0, 4, W, 2);
  for (let x = 2; x < W; x += 5) { g.fillStyle = x % 10 ? '#fff4a0' : '#ffd040'; g.fillRect(x, 1, 2, 2); g.fillRect(x, 27, 2, 2); } jpText(g, '歌舞伎町', (W - jpW('歌舞伎町', 12)) / 2, 9, '#ffffff', 12); return { c, ax: W / 2, ay: H - 1 }; };
XSPR.jp_banco = () => { const [c, g] = XC(30, 16); g.fillStyle = '#7a5030'; g.fillRect(1, 4, 28, 3); g.fillRect(1, 8, 28, 3); g.fillStyle = '#4a4a50'; g.fillRect(3, 11, 2, 5); g.fillRect(25, 11, 2, 5); return { c, ax: 15, ay: 15 }; };
XSPR.jp_bici = () => { const [c, g] = XC(26, 18); g.strokeStyle = '#2a2a30'; g.lineWidth = 1.5; g.beginPath(); g.arc(6, 12, 5, 0, 7); g.arc(20, 12, 5, 0, 7); g.stroke(); g.strokeStyle = ['#c8102e', '#1a5ad8', '#e8ecf2'][Math.floor(Math.random() * 3)]; g.beginPath(); g.moveTo(6, 12); g.lineTo(11, 5); g.lineTo(18, 5); g.lineTo(20, 12); g.moveTo(11, 5); g.lineTo(13, 12); g.lineTo(6, 12); g.stroke(); return { c, ax: 13, ay: 17 }; };
XSPR.jp_terminal = () => { const r = XSPR.ae_terminal(), g = r.c.getContext('2d'), W = r.c.width, base = r.c.height - 64; g.fillStyle = '#1a2a40'; g.fillRect(W / 2 - 80, base - 21, 160, 17); const s = '東京国際空港'; jpText(g, s, Math.round(W / 2 - jpW(s, 12) / 2), base - 19, '#ffe8a0', 12); return r; };
XSPR.jp_cartel = () => { const [c, g] = XC(60, 40); g.fillStyle = '#4a3a2a'; g.fillRect(8, 20, 3, 20); g.fillRect(49, 20, 3, 20); g.fillStyle = '#1a3a6a'; g.fillRect(0, 2, 60, 20); g.fillStyle = '#e8ecf2'; g.fillRect(1, 3, 58, 1); return { c, ax: 30, ay: 39 }; };

// ---------- gente de Japón: aspectos (dibujo de héroe), frases y nombres numerados ----------
const jpHF = k => Math.max(0, HS_F.findIndex(h => h.ah === k)), jpHM = k => Math.max(0, HS_M.findIndex(h => h.ah === k));
const JP_LOOKS = [
  ['m', { skin: 0, hair: 'negro', hs: 0, top: [1, 'blanco'], bot: [0, 'negro'], shoe: [1, 'negro'] }, { body: 'c_traje_gala' }, 'p'], ['f', { skin: 0, hair: 'negro', hs: () => jpHF('bob_recto'), top: [1, 'blanco'], bot: [2, 'negro'], shoe: [1, 'negro'] }, {}, 'p'],
  ['f', { skin: 4, hair: 'negro', hs: () => jpHF('coletas_largas'), top: [1, 'blanco'], bot: [2, 'marino'], shoe: [1, 'marron'] }, { legs: 'c_falda_plisada' }, 'p'], ['m', { skin: 0, hair: 'negro', hs: () => jpHM('despeinado'), top: [5, 'negro'], bot: [0, 'negro'], shoe: [1, 'negro'] }, {}, 'p'],
  ['f', { skin: 0, hair: 'gris', hs: () => jpHF('mono_suelto'), top: [4, 'morado'], bot: [2, 'morado'], shoe: [2, 'marron'] }, {}, 'p'], ['m', { skin: 1, hair: 'gris', hs: 5, top: [4, 'gris'], bot: [0, 'gris'], shoe: [2, 'marron'] }, {}, 'p'],
  ['f', { skin: 4, hair: 'rosa', hs: () => jpHF('cebollas'), top: [3, 'rosa'], bot: [2, 'blanco'], shoe: [1, 'rosa'] }, {}, 'p'], ['m', { skin: 0, hair: 'negro', hs: () => jpHM('principe'), top: [1, 'azul'], bot: [0, 'gris'], shoe: [1, 'blanco'] }, {}, 'p'],
  ['f', { skin: 0, hair: 'castano', hs: () => jpHF('lisa_raya'), top: [5, 'amarillo'], bot: [0, 'azul'], shoe: [1, 'blanco'] }, {}, 'p'], ['m', { skin: 1, hair: 'castano', hs: () => jpHM('lobo'), top: [2, 'verde'], bot: [0, 'marron'], shoe: [1, 'negro'] }, {}, 'p'],
  ['f', { skin: 4, hair: 'azul', hs: () => jpHF('coletas_largas'), top: [3, 'negro'], bot: [2, 'negro'], shoe: [1, 'negro'] }, {}, 'p'], ['m', { skin: 0, hair: 'rubio', hs: () => jpHM('puntas'), top: [5, 'negro'], bot: [0, 'negro'], shoe: [0, 'negro'] }, {}, 'p'],
  ['f', { skin: 0, hair: 'castano', hs: () => jpHF('corto_liso'), top: [1, 'blanco'], bot: [2, 'marino'], shoe: [1, 'marron'] }, { legs: 'c_falda_plisada' }, 'p'], ['m', { skin: 0, hair: 'negro', hs: 4, top: [1, 'blanco'], bot: [0, 'gris'], shoe: [1, 'negro'] }, { body: 'c_traje_gala' }, 'p'],
  ['f', { skin: 1, hair: 'negro', hs: () => jpHF('media_coleta'), top: [0, 'verde'], bot: [2, 'gris'], shoe: [1, 'blanco'] }, {}, 'p'], ['m', { skin: 1, hair: 'rubio', hs: 0, top: [1, 'rojo'], bot: [1, 'azul'], shoe: [2, 'marron'] }, {}, 'p'],
  ['f', { skin: 4, pale: 1, lip: 2, hair: 'negro', hs: () => jpHF('cebollas'), top: [4, 'rojo'], bot: [2, 'rojo'], shoe: [2, 'negro'] }, {}, 'maiko'], ['f', { skin: 4, pale: 1, lip: 2, hair: 'negro', hs: () => jpHF('mono_suelto'), top: [4, 'azul'], bot: [2, 'azul'], shoe: [2, 'negro'] }, {}, 'geisha'],
  ['f', { skin: 4, pale: 1, lip: 2, hair: 'negro', hs: () => jpHF('cebollas'), top: [4, 'turquesa'], bot: [2, 'turquesa'], shoe: [2, 'negro'] }, {}, 'maiko'], ['f', { skin: 4, pale: 1, lip: 2, hair: 'negro', hs: () => jpHF('mono_suelto'), top: [4, 'rosa'], bot: [2, 'rosa'], shoe: [2, 'negro'] }, { body: 'c_kimono_sakura' }, 'geisha'],
  ['m', { skin: 1, hair: 'negro', hs: 14, top: [4, 'naranja'], bot: [0, 'naranja'], shoe: [2, 'marron'] }, {}, 'monje'], ['f', { skin: 4, hair: 'negro', hs: () => jpHF('liso_largo'), top: [4, 'blanco'], bot: [2, 'rojo'], shoe: [2, 'blanco'] }, {}, 'miko'],
];
const jpApp = i => { const [g, a, cos] = JP_LOOKS[i % JP_LOOKS.length], o = Object.assign({ g, eyes: i % 3 ? 'cafe' : 'negro', bt: i % 4 }, a); if (typeof o.hs === 'function') o.hs = o.hs(); return [o, cos]; };
const JP_APPS = []; JP_APPS.tag = 'P'; for (let i = 0; i < JP_LOOKS.length; i++) Object.defineProperty(JP_APPS, i, { get: () => jpApp(i), enumerable: true }); JP_APPS.length = JP_LOOKS.length;
const JP_APPS_W = []; JP_APPS_W.tag = 'J'; for (let i = 0; i < 16; i++) Object.defineProperty(JP_APPS_W, i, { get: () => jpApp(i), enumerable: true }); JP_APPS_W.length = 16;
const JL = [['こんにちは！ようこそ日本へ。', 'Konnichiwa! Yōkoso Nihon e.', '¡Hola! Bienvenido a Japón.', 'Hello! Welcome to Japan.'],
  ['電車はいつも時間通りです。', 'Densha wa itsumo jikan-dōri desu.', 'Los trenes siempre llegan a su hora.', 'Trains are always on time.'], ['秋葉原でフィギュアを買いました！', 'Akihabara de figyua o kaimashita!', '¡He comprado figuras en Akihabara!', 'I bought figures in Akihabara!'],
  ['カラオケに行きませんか？', 'Karaoke ni ikimasen ka?', '¿Vamos al karaoke? Hay uno en Kabukichō.', 'Shall we go to karaoke? There is one in Kabukichō.'], ['ラーメンは豚骨が一番！', 'Rāmen wa tonkotsu ga ichiban!', '¡El mejor ramen es el de tonkotsu!', 'Tonkotsu is the best ramen!'],
  ['桜がきれいですね。', 'Sakura ga kirei desu ne.', 'Los cerezos son preciosos, ¿verdad?', 'The cherry blossoms are beautiful, aren\'t they?'], ['富士山に登ったことがありますか？', 'Fujisan ni nobotta koto ga arimasu ka?', '¿Has subido alguna vez al monte Fuji? Está al noroeste.', 'Have you ever climbed Mount Fuji? It is to the northwest.'],
  ['すみません、駅はどこですか？', 'Sumimasen, eki wa doko desu ka?', 'Perdone, ¿dónde está la estación?', 'Excuse me, where is the station?'], ['いただきます！', 'Itadakimasu!', '¡Que aproveche! (se dice antes de comer)', 'Let\'s eat! (said before eating)'],
  ['がんばって！', 'Ganbatte!', '¡Ánimo!', 'Good luck!'], ['お疲れ様です。', 'Otsukaresama desu.', 'Buen trabajo (se dice al terminar la jornada).', 'Good work (said at the end of the day).'],
  ['金閣寺は京都にあります。', 'Kinkakuji wa Kyōto ni arimasu.', 'El Pabellón Dorado está en Kioto, al suroeste.', 'The Golden Pavilion is in Kyoto, to the southwest.'], ['雷門の提灯はとても大きいです。', 'Kaminarimon no chōchin wa totemo ōkii desu.', 'El farol de la Puerta del Trueno (Asakusa) es enorme.', 'The lantern of the Thunder Gate (Asakusa) is huge.'],
  ['東京タワーの夜景は最高！', 'Tōkyō Tawā no yakei wa saikō!', '¡De noche la Torre de Tokio se ve preciosa!', 'Tokyo Tower looks amazing at night!'], ['コンビニのおにぎりが好き。', 'Konbini no onigiri ga suki.', 'Me encantan los onigiri de la konbini.', 'I love konbini onigiri.'],
  ['新作のゲーム、もう買った？', 'Shinsaku no gēmu, mō katta?', '¿Ya te compraste el juego nuevo?', 'Did you already buy the new game?'], ['ありがとうございます！', 'Arigatō gozaimasu!', '¡Muchas gracias!', 'Thank you very much!'],
  ['気をつけてね。', 'Ki o tsukete ne.', 'Ten cuidado con los coches.', 'Watch out for the cars.'], ['よろしくお願いします。', 'Yoroshiku onegaishimasu.', 'Encantado de conocerte.', 'Nice to meet you.'], ['また会いましょう！', 'Mata aimashō!', '¡Nos vemos!', 'See you!']];
const JL_MAIKO = [['おおきに。', 'Ōkini.', 'Gracias (en el dialecto de Kioto).', 'Thank you (in Kyoto dialect).'], ['祇園へようこそ。', 'Gion e yōkoso.', 'Bienvenido a Gion, el barrio de las geishas.', 'Welcome to Gion, the geisha district.'], ['お座敷に行くところどす。', 'Ozashiki ni iku tokoro dosu.', 'Voy de camino a una fiesta de té.', 'I am on my way to a tea gathering.']];
const jlTxt = l => '「' + l[0] + '」 ' + l[1] + ' — ' + L2(l[2], l[3]);
const JP_NPC_N = 78, JP_NPC_LOOK = {};
{ const cnt = { m: 0, f: 0, maiko: 0, geisha: 0, monje: 0, miko: 0 };
  for (let n = 1; n <= JP_NPC_N; n++) { const li = n <= 66 ? (n * 7) % 16 : 16 + ((n - 67) % 6), [g, , , kind] = JP_LOOKS[li], kk = kind === 'p' ? g : kind; cnt[kk]++;
    const base = { m: L2('Japonés', 'Japanese man'), f: L2('Japonesa', 'Japanese woman'), maiko: 'Maiko', geisha: 'Geisha', monje: L2('Monje', 'Monk'), miko: 'Miko' }[kk];
    const lines = kind === 'maiko' || kind === 'geisha' ? [jlTxt(JL_MAIKO[n % 3]), jlTxt(JL[(n * 3) % JL.length])] : [jlTxt(JL[n % JL.length]), jlTxt(JL[(n * 7 + 3) % JL.length])];
    NPCS['jp_' + n] = { n: base + ' ' + cnt[kk], title: { maiko: L2('Aprendiz de geisha', 'Apprentice geisha'), geisha: L2('Geisha de Kioto', 'Kyoto geisha'), monje: L2('Monje del templo', 'Temple monk'), miko: L2('Doncella del santuario', 'Shrine maiden') }[kk] || L2('Vecino de Tokio', 'Tokyo local'), look: LK({ g }), lines, quests: [], umb: (kind === 'maiko' || kind === 'geisha') && n % 2 === 0 };
    JP_NPC_LOOK['jp_' + n] = li; } }
const JP_STAFF = { jp_taquilla: [L2('Azafata de tierra', 'Ground staff'), 1, ['ご搭乗ありがとうございます。', 'Gotōjō arigatō gozaimasu.', 'Gracias por volar con nosotros. El vuelo de vuelta a Albor es gratis.', 'Thank you for flying with us. The return flight to Albor is free.']],
  jp_cafetera: [L2('Camarera del café', 'Café waitress'), 14, ['コーヒーはいかがですか？', 'Kōhī wa ikaga desu ka?', '¿Le apetece un café?', 'Would you like a coffee?']],
  jp_chef: [L2('Maestro del ramen', 'Ramen master'), 5, ['いらっしゃいませ！', 'Irasshaimase!', '¡Bienvenido! El caldo lleva dieciocho horas al fuego.', 'Welcome! The broth has been simmering for eighteen hours.']],
  jp_cajero: [L2('Dependiente de la konbini', 'Konbini clerk'), 7, ['いらっしゃいませ！', 'Irasshaimase!', '¡Bienvenido! Abierto las veinticuatro horas.', 'Welcome! Open twenty-four hours.']],
  jp_kara_st: [L2('Recepción del karaoke', 'Karaoke reception'), 6, ['何時間歌いますか？', 'Nan-jikan utaimasu ka?', '¿Cuántas horas va a cantar? Toque la pantalla para elegir canción.', 'How many hours will you sing? Touch the screen to pick a song.']],
  jp_gamer: [L2('Jugón de los recreativos', 'Arcade gamer'), 7, ['このゲーム、難しい！', 'Kono gēmu, muzukashii!', '¡Este juego es dificilísimo! Prueba la máquina de peluches.', 'This game is so hard! Try the plushie machine.']] };
for (const id in JP_STAFF) { const [t, li, l] = JP_STAFF[id]; NPCS[id] = { n: t, title: L2('Japón', 'Japan'), look: LK({ g: JP_LOOKS[li][0] }), lines: [jlTxt(l)], quests: [] }; JP_NPC_LOOK[id] = li; }
NPCS.jp_taquilla.n = L2('Azafata de tierra', 'Ground staff'); NPCS.jp_cafetera.n = L2('Camarera del café', 'Café waitress');
{ const _na = npcAtlas; npcAtlas = function (id) { const li = JP_NPC_LOOK[id]; if (li !== undefined) return getAtlas('JPN' + li, () => { const [a, cos] = jpApp(li), L = heroLook('guerrero', a, { weapon: 0 }, cos, {}); L.weapon = null; return buildAtlas(L, ['idle', 'walk'], drawHero); }); return _na.apply(this, arguments); }; }
// sombrilla de papel (wagasa) de algunas maikos y geishas
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const r = _de.apply(this, arguments); if (e && e.type === 'npc' && e.def && e.def.umb) { const x = Math.round(e.x - cx + 5), y = Math.round(e.y - cy - 46); ctx.fillStyle = '#5a3a20'; ctx.fillRect(x, y + 2, 1, 26); ctx.fillStyle = '#c81e2a'; ctx.beginPath(); ctx.ellipse(x, y + 2, 15, 6, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#e84a4a'; ctx.beginPath(); ctx.ellipse(x - 3, y, 8, 3, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = 'rgba(80,20,20,0.7)'; ctx.lineWidth = 1; for (const a of [-10, -5, 0, 5, 10]) { ctx.beginPath(); ctx.moveTo(x, y - 3); ctx.lineTo(x + a * 1.4, y + 2); ctx.stroke(); } ctx.fillStyle = '#ffd040'; ctx.fillRect(x, y - 5, 1, 2); } return r; }; }

// ---------- el mapa ----------
const jpFp = (w, d, skip) => { const a = []; for (let y = -d + 1; y <= 0; y++) for (let x = 0; x < w; x++) if (!skip || !skip(x, y)) a.push([x, y]); return a; };
function makeJapan() { if (G.maps.japon) return G.maps.japon; const w = JP_W, h = JP_H, N = w * h, I = (x, y) => y * w + x, J = JP_G;
  const M = { id: 'japon', w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], bossAt: [], halos: [], temples: [], jp: 1,
    jg: new Uint8Array(N), jm: new Uint8Array(N), jsh: new Uint8Array(N), aeQ: JP_Q, aeApps: JP_APPS_W };
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h, S = (x, y, k) => { if (inb(x, y)) M.jg[I(x, y)] = k; }, RG = (x0, y0, x1, y1, k) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) S(x, y, k); };
  const ell = (cx, cy, rx, ry, k) => { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) S(x, y, k); };
  // tierra, playa y mar
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sea = x < 3 + ((hash2(y >> 2, 1, 31) * 2) | 0) || y < 3 || x > w - 4 - ((hash2(y >> 2, 2, 31) * 2) | 0) || y > h - 5 + ((hash2(x >> 2, 3, 31) * 2) | 0) - 1; S(x, y, sea ? J.SEA : y > h - 10 ? J.SAND : J.GRASS); }
  RG(118, 4, w - 5, 153, J.WALK);
  // carreteras con aceras, línea central, cruces y pasos de cebra
  const hc = new Uint8Array(N), vc = new Uint8Array(N);
  const road = (x0, y0, x1, y1, hz) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (!inb(x, y)) continue; const i = I(x, y), al = hz ? y - y0 : x - x0; if (al === 0 || al === 5) { if (M.jg[i] !== J.ROAD) S(x, y, J.WALK); continue; } S(x, y, J.ROAD); (hz ? hc : vc)[i] = 1; if (al === 2) M.jm[i] = hz ? 1 : 2; } };
  for (const y0 of JP_HR) road(118, y0, w - 5, y0 + 5, true); road(6, 100, 117, 105, true); road(70, 76, 117, 81, true); road(6, 206, w - 5, 211, true);
  for (const x0 of JP_VR) road(x0, 4, x0 + 5, 153, false); road(118, 154, 123, 205, false); road(238, 154, 243, 205, false); road(286, 154, 291, 170, false);
  for (let i = 0; i < N; i++) { if (hc[i] && vc[i]) M.jm[i] = 0; }
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = I(x, y); if (hc[i] && !vc[i] && (vc[i - 1] || vc[i + 1])) M.jm[i] = 3; else if (vc[i] && !hc[i] && (hc[i - w] || hc[i + w])) M.jm[i] = 4; }
  for (let y = JP_SCR.y0; y <= JP_SCR.y1; y++) for (let x = JP_SCR.x0; x <= JP_SCR.x1; x++) M.jm[I(x, y)] = 11;
  // aeropuerto
  const Q = JP_Q; RG(Q.park.x0, Q.park.y0, Q.park.x1, Q.park.y1, J.WALK); RG(Q.apron.x0, Q.apron.y0, Q.apron.x1, Q.apron.y1, J.RUN); RG(Q.run.x0, Q.run.y0, Q.run.x1, Q.run.y1, J.RUN);
  for (const tx of [Q.taxiE, Q.taxiW]) { RG(tx - 1, Q.apron.y1, tx + 1, Q.run.y0, J.RUN); for (let y = Q.apron.y1 + 1; y < Q.run.y0; y++) M.jm[I(tx, y)] = 10; }
  for (let x = Q.run.x0; x <= Q.run.x1; x++) { M.jm[I(x, Q.run.y0)] = 5; M.jm[I(x, Q.run.y1)] = 6; M.jm[I(x, Q.run.y0 + 1)] = x <= Q.run.x0 + 2 || x >= Q.run.x1 - 2 ? 8 : 7; if (x <= Q.run.x0 + 2 || x >= Q.run.x1 - 2) M.jm[I(x, Q.run.y0 + 2)] = 8; }
  for (let x = Q.taxiW; x <= Q.taxiE; x++) M.jm[I(x, Q.apron.y0 + 2)] = 9;
  // Asakusa
  const A = JP_ASK; RG(A.x0, A.y0, A.x1, A.y1, J.GRASS); RG(A.lane - 2, A.y0 + 10, A.lane + 2, A.y1, J.STONE); RG(A.x0 + 6, A.y0 + 1, A.x1 - 6, A.y0 + 14, J.STONE); ell(A.lane + 18, 174, 4, 3, J.STONE);
  ell(212, 182, 12, 7, J.POND); RG(180, 156, 236, 204, J.PINK); ell(212, 182, 12, 7, J.POND);
  // Kioto: callejuelas, avenida, sendero de toriis y jardín del Kinkaku-ji
  const KV = [10, 22, 34, 46, 58, 70, 82, 94, 106], KH = [118, 130, 142, 154]; for (const x of KV) RG(x, 106, x + 1, 155, J.LANE); for (const y of KH) RG(6, y, 112, y + 1, J.LANE);
  RG(86, 158, 88, 205, J.STONE); const K = JP_KIN; ell(38, 186, 18, 10, J.POND); ell(30, 188, 2.5, 1.6, J.GRASS); for (let a = 0; a < 6.28; a += 0.02) { const x = Math.round(38 + Math.cos(a) * 22), y = Math.round(186 + Math.sin(a) * 13.5); S(x, y, J.PATH); S(x + 1, y, J.PATH); } RG(37, 199, 39, 205, J.PATH);
  // Fuji: montaña (no se pisa), lago, arboleda de cerezos y escalera a la pagoda
  for (let y = 22; y <= 33; y++) for (let x = 30; x <= 70; x++) if (Math.abs(x - 50) < (y - 21) * 0.95) M.ter[I(x, y)] = T.IWALL;
  ell(34, 52, 22, 7, J.POND); RG(70, 24, 114, 72, J.PINK); RG(91, 46, 93, 75, J.STONE);
  // colisiones del agua y orillas
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = I(x, y), k = M.jg[i]; if (k === J.SEA || k === J.POND) { M.ter[i] = T.WATER; for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { if (inb(x + dx, y + dy) && M.jg[I(x + dx, y + dy)] !== J.SEA && M.jg[I(x + dx, y + dy)] !== J.POND) { M.jsh[i] = 1; break; } } } }
  M.exit = { x: -9, y: -9 }; prepPalettes(M); initMapObjs(M);
  const R = new RNG(SEED + 8101), occ = (x, y) => !inb(x, y) || M.objAt[I(x, y)] >= 0 || SOLID_T[M.ter[I(x, y)]];
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  const Fs = (f, x, y, o) => { if (occ(x, y) || jpReserved(x, y)) return null; return F(f, x, y, null, o); };
  const doors = new Set(), bld = (kind, x, by, wd, v, extra) => { const H = JP_H_OF[kind] ? JP_H_OF[kind](v) : 96; return F('jpb_' + kind + '_' + wd + '_' + v, x, by, jpFp(wd, 9), Object.assign({ px: x * 16 + wd * 8, py: (by + 1) * 16 - 1, jpb: 1, jl: jpBldLights(kind, wd) }, extra || {})); };
  const door = (ik, x, y) => { doors.add(I(x, y)); F('jp_vacio', x, y, null, { solid: false, xact: 'jp_in', ik }); };
  // manzanas de la ciudad
  const ZK = { aki: ['slim', 'slim', 'aki', 'slim', 'slim', 'shop', 'slim', 'aki', 'neon', 'slim'], tokio: ['office', 'tower', 'apt', 'office', 'hotel', 'slim', 'tower', 'office', 'slim', 'shop'], shinjuku: ['slim', 'neon', 'slim', 'slim', 'hotel', 'slim', 'neon', 'slim', 'shop'] };
  const SPEC = { '0,1': [['comics', 6]], '2,1': [['nekocafe', 6]], '1,2': [['live', 10]], '1,1': [['arcade', 6]], '3,0': [['konbini', 5]], '0,3': [['konbini', 5]], '6,4': [['konbini', 5]], '2,5': [['konbini', 5]], '5,2': [['konbini', 5]], '7,3': [['ramen', 4], ['konbini', 5]] };
  for (let i = 0; i < JP_VR.length; i++) for (let j = 0; j < JP_HR.length - 1; j++) { const bx0 = JP_VR[i] + 6, bx1 = i + 1 < JP_VR.length ? JP_VR[i + 1] - 1 : w - 6, by0 = JP_HR[j] + 6, by1 = JP_HR[j + 1] - 1;
    const z = jpZoneAt(((bx0 + bx1) >> 1) * 16, ((by0 + by1) >> 1) * 16), kinds = ZK[z && z.k] || ZK.tokio;
    if (i === 3 && j === 4) { jpPark(M, F, Fs, R, bx0, bx1, by0, by1); continue; }
    const row = (by, maxH, segs, special) => { let x = segs[0]; const x1 = segs[1]; const sp = (special || []).slice();
      while (x <= x1) { const rem = x1 - x + 1; const s = sp.shift(); let kind, wd; if (s) { kind = s[0]; wd = Math.min(s[1], rem); } else { kind = rem < 3 ? 'slim' : kinds[(R.f() * kinds.length) | 0]; if (kind === 'slim') { const q = R.f(); wd = Math.min(rem, q < 0.28 ? 1 : q < 0.9 ? 2 : 3); } else { wd = Math.min(rem, 3 + ((R.f() * 4) | 0)); } }
        let v = (R.f() * (kind === 'slim' ? 16 : 4)) | 0; if (maxH) { if (kind === 'tower') kind = 'office'; while (v > 0 && JP_H_OF[kind](v) > maxH) v--; if (JP_H_OF[kind](v) > maxH) kind = 'shop'; }
        bld(kind, x, by, wd, v); if (!maxH && ['arcade', 'konbini', 'ramen', 'karaoke', 'live', 'nekocafe', 'comics'].includes(kind)) door(kind, x + (wd >> 1), by + 1); x += wd; } };
    if (i === 6 && j === 1) { // callejón de Kabukichō con su arco
      const ax = 276; RG(ax, by0, ax + 1, by1, J.WALK); row(by1, 0, [bx0, ax - 1], [['ramen', 4]]); row(by1, 0, [ax + 2, bx1], [['karaoke', 5]]); row(by0 + 8, 128, [bx0, ax - 1]); row(by0 + 8, 128, [ax + 2, bx1]);
      F('jp_kabuki', ax, by1, [], { px: (ax + 1) * 16, py: (by1 + 1) * 16 + 2, solid: false, jl: [[0, -60, 70, 'rgba(255,60,60,0.6)']] }); for (let y = by0 + 2; y < by1 - 1; y += 4) F('jp_chochin', ax, y, [], { px: (ax + 1) * 16, py: y * 16 + 10, solid: false, jl: [[0, -14, 34, 'rgba(255,90,60,0.5)']] }); continue; }
    const fr = SPEC[i + ',' + j], scr = { '5,1': 'fe', '5,2': 'be', '6,2': 'bs' }[i + ',' + j], zk = z && z.k;
    if (scr === 'fe') { row(by1, 0, [bx0, bx1 - 5], fr); bld('screen', bx1 - 4, by1, 5, 0); row(by0 + 8, 128, [bx0, bx1]); continue; }
    if (scr === 'be') { row(by1, 0, [bx0, bx1], fr); row(by0 + 8, 128, [bx0, bx1 - 5]); bld('screen', bx1 - 4, by0 + 8, 5, 1); continue; }
    if (scr === 'bs') { row(by1, 0, [bx0, bx1], fr); bld('screen', bx0, by0 + 8, 5, 2); row(by0 + 8, 128, [bx0 + 5, bx1]); continue; }
    if (!fr && (zk === 'aki' || zk === 'shinjuku') && R.f() < 0.6) { const ax = bx0 + 5 + R.int(0, bx1 - bx0 - 12); jpAlley(M, F, Fs, R, ax, by0, by1, zk); row(by1, 0, [bx0, ax - 1]); row(by1, 0, [ax + 3, bx1]); row(by0 + 8, 128, [bx0, ax - 1]); row(by0 + 8, 128, [ax + 3, bx1]); continue; }
    row(by1, 0, [bx0, bx1], fr); row(by0 + 8, 128, [bx0, bx1]); }
  // decorado de aceras y semáforos
  for (const y0 of JP_HR) for (let x = 120; x < w - 6; x++) { const y = y0; if (M.jg[I(x, y)] !== J.WALK || doors.has(I(x, y)) || vc[I(x, y)] || x % 7) continue; if (JP_VR.some(v => x >= v - 1 && x <= v + 6)) continue; if (x % 14 === 0) { const o = Fs('jp_poste', x, y); if (o) (M.jpPoles = M.jpPoles || []).push(o); continue; } const r2 = R.f(); Fs(r2 < 0.45 ? 'ae_farola' : r2 < 0.75 ? 'jp_maquina' : 'jp_bici', x, y, { jl: r2 < 0.45 ? [[4, -36, 40, 'rgba(255,240,190,0.5)']] : r2 < 0.75 ? [[0, -12, 26, 'rgba(200,230,255,0.5)']] : null }); }
  for (const x0 of JP_VR) for (const y0 of JP_HR) Fs('jp_semaforo', x0 + 5, y0 + 5, { sem: 1 });
  // Asakusa: Kaminarimon, Nakamise, Hōzōmon, templo, pagoda e incienso
  F('jp_kaminarimon', A.lane, A.y1, [[-4, 0], [-3, 0], [3, 0], [4, 0]], { px: A.lane * 16 + 8, jl: [[0, -40, 60, 'rgba(255,90,60,0.55)']] });
  for (let y = A.y0 + 30; y <= A.y1 - 3; y += 4) { F('jp_puesto' + ((y >> 2) % 4), A.lane - 4, y, [[-1, 0], [0, 0], [1, 0]]); F('jp_puesto' + (((y >> 2) + 2) % 4), A.lane + 4, y, [[-1, 0], [0, 0], [1, 0]]); }
  F('jp_hozomon', A.lane, A.y0 + 26, [[-5, 0], [-4, 0], [-3, 0], [3, 0], [4, 0], [5, 0]], { px: A.lane * 16 + 8, jl: [[0, -50, 60, 'rgba(255,90,60,0.5)']] });
  F('jp_incienso', A.lane, A.y0 + 19, null, { incienso: 1 }); F('jp_hondo', A.lane, A.y0 + 13, jpFp(11, 4).map(([x, y]) => [x - 5, y]), { px: A.lane * 16 + 8 });
  F('jp_pagoda', A.lane + 18, A.y0 + 18, jpFp(5, 3).map(([x, y]) => [x - 2, y]), { px: (A.lane + 18) * 16 + 8 });
  for (let y = A.y0 + 28; y < A.y1 - 2; y += 6) { Fs('jp_farol', A.lane - 2, y - 1, { jl: [[0, -16, 26, 'rgba(255,220,140,0.5)']] }); Fs('jp_farol', A.lane + 2, y - 1, { jl: [[0, -16, 26, 'rgba(255,220,140,0.5)']] }); }
  for (let k = 0; k < 60; k++) { const x = R.int(A.x0 + 1, A.x1 - 1), y = R.int(A.y0 + 1, A.y1 - 1); if (M.jg[I(x, y)] !== J.GRASS) continue; Fs(R.f() < 0.7 ? 'jp_sakura' : 'jp_farol', x, y); }
  for (let k = 0; k < 110; k++) { const x = R.int(182, 236), y = R.int(157, 203); if (M.jg[I(x, y)] !== J.PINK) continue; const r2 = R.f(); Fs(r2 < 0.75 ? 'jp_sakura' : r2 < 0.9 ? 'jp_banco' : 'jp_farol', x, y); }
  // Kioto
  for (let a = 0; a + 1 < KV.length; a++) { const x0 = KV[a] + 2, x1 = KV[a + 1] - 1; for (const by of [99, ...KH.map(y => y - 1)]) { let x = x0; while (x <= x1) { const rem = x1 - x + 1; if (rem < 3) break; let wd = Math.min(rem, 3 + ((R.f() * 2) | 0)); if (rem - wd > 0 && rem - wd < 3) wd = rem;
      F('jpb_machiya_' + wd + '_' + ((R.f() * 4) | 0), x, by, jpFp(wd, 4), { px: x * 16 + wd * 8, py: (by + 1) * 16 - 1, jl: jpBldLights('machiya', wd) }); x += wd; } }
    for (const y of [...KH.map(v => v - 6), 90]) { const x = R.int(x0, x1); Fs(R.f() < 0.5 ? 'jp_sakura' : 'jp_pino', x, y); } }
  for (const y of KH) for (const x of KV) Fs('jp_farol', x + 2, y - 1, { jl: [[0, -16, 26, 'rgba(255,220,140,0.5)']] });
  F('jp_kinkaku', 38, 176, jpFp(7, 3).map(([x, y]) => [x - 3, y]), { px: 38 * 16 + 8, jl: [[0, -40, 70, 'rgba(255,220,100,0.45)']] }); M.kinkaku = [38 * 16 + 8, 177 * 16];
  for (let k = 0; k < 70; k++) { const x = R.int(K.x0, K.x1), y = R.int(K.y0, K.y1); if (M.jg[I(x, y)] !== J.GRASS || (y <= 177 && Math.abs(x - 38) < 6)) continue; const r2 = R.f(); Fs(r2 < 0.5 ? 'jp_pino' : r2 < 0.75 ? 'jp_roca' : r2 < 0.88 ? 'jp_farol' : 'jp_sakura', x, y); }
  Fs('jp_pino', 30, 188);
  for (let y = 160; y <= 202; y += 3) F('jp_torii', 87, y, [[-1, 0], [1, 0]], { px: 87 * 16 + 8 });
  for (let k = 0; k < 260; k++) { const x = R.int(66, 113), y = R.int(158, 204); if (Math.abs(x - 87) < 3 || M.jg[I(x, y)] !== J.GRASS) continue; Fs(R.f() < 0.85 ? 'jp_bambu' : 'jp_farol', x, y); }
  // Fuji
  F('jp_fuji', 50, 33, [], { px: 50 * 16 + 8, py: 34 * 16 - 1, solid: false });
  F('jp_pagoda', 92, 44, jpFp(5, 3).map(([x, y]) => [x - 2, y]), { px: 92 * 16 + 8 }); F('jp_torii', 92, 74, [[-1, 0], [1, 0]], { px: 92 * 16 + 8 });
  for (let y = 50; y < 74; y += 5) { Fs('jp_farol', 90, y); Fs('jp_farol', 94, y); }
  for (let k = 0; k < 170; k++) { const x = R.int(70, 114), y = R.int(24, 72); if (M.jg[I(x, y)] !== J.PINK) continue; Fs('jp_sakura', x, y); }
  for (let k = 0; k < 120; k++) { const x = R.int(5, 116), y = R.int(36, 98); if (M.jg[I(x, y)] !== J.GRASS) continue; const r2 = R.f(); Fs(r2 < 0.45 ? 'jp_pino' : r2 < 0.7 ? 'tree' : r2 < 0.85 ? 'jp_sakura' : 'jp_roca', x, y); }
  for (const o of M.objs) if (o.f === 'tree') { o.k = 'tree'; o.sp = 'pino'; o.v = 0; }
  // aeropuerto de Tokio
  const TM = Q.term; F('jp_terminal', TM.x, TM.y + TM.h - 1, jpFp(TM.w, TM.h, (x, y) => x === TM.door - TM.x && y === 0), { px: TM.x * 16 + TM.w * 8, py: (TM.y + TM.h) * 16 - 1 });
  F('jp_vacio', TM.door, TM.y + TM.h, null, { solid: false, xact: 'jp_aeropuerto' }); F('ae_torre', 283, 163, jpFp(2, 2), { px: 283 * 16 + 16, py: 164 * 16 - 1 }); F('ae_hangar', 296, 163, jpFp(9, 6), { px: 296 * 16 + 72, py: 164 * 16 - 1 });
  for (let x = Q.apron.x0; x <= Q.apron.x1; x++) if (Math.abs(x - Q.side) > 1) F('ae_valla', x, Q.apron.y0 - 1);
  for (const [x, c] of [[260, 0], [263, 2], [266, 3], [276, 1], [279, 4]]) F('ae_coche' + c, x, Q.park.y1, [[0, 0], [1, 0]]); F('ae_bus', 270, Q.park.y1, [[0, 0], [1, 0], [2, 0]]);
  F('ae_escalera', 274, Q.apron.y0 + 1, null, { solid: false }); F('ae_escalera', 290, Q.apron.y0 + 1, null, { solid: false });
  for (let x = Q.run.x0; x <= Q.run.x1; x += 6) { F('ae_luz', x, Q.run.y0 - 1, null, { solid: false }); F('ae_luz', x, Q.run.y1 + 1, null, { solid: false }); }
  for (let x = 6; x < w - 6; x += 9) { if (M.jg[I(x, h - 9)] === J.SAND) Fs('jp_pino', x, h - 9); }
  // gente
  const spots = [[150, 30, 'aki', 14], [200, 58, 'aki', 8], [260, 30, 'sh', 10], [300, 90, 'sh', 6], [278, 45, 'sh', 6], [170, 110, 'tk', 8], [205, 126, 'tk', 6], [150, 190, 'as', 8], [210, 175, 'as', 4], [50, 120, 'ky', 6], [80, 140, 'ky', 4], [92, 60, 'fj', 4], [271, 167, 'ae', 4]];
  let n = 1; const geish = []; for (let k = 67; k <= JP_NPC_N; k++) geish.push(k);
  const put = (id, cx, cy, rr) => { for (let t = 0; t < 40; t++) { const x = cx + R.int(-rr, rr), y = cy + R.int(-rr, rr); if (!inb(x, y) || occ(x, y) || M.jg[I(x, y)] === J.ROAD) continue; spawnNPC(id, x * 16 + 8, y * 16 + 8, 'japon', { wander: 5, face: 'down' }); return; } };
  for (const [x, y, , c] of spots) for (let k = 0; k < c && n <= 66; k++) put('jp_' + n++, x, y, 7);
  geish.forEach((k, i) => put('jp_' + k, i % 3 === 0 ? A.lane : 20 + (i * 13) % 80, i % 3 === 0 ? 190 : 118 + (i % 4) * 12, 4));
  M.drawExtra = (cx, cy) => jpExtra(M, cx, cy);
  jpCarsInit(M); G.maps.japon = M; return M; }
function jpPark(M, F, Fs, R, x0, x1, y0, y1) { const I = M.I; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) M.jg[I(x, y)] = (x === ((x0 + x1) >> 1) || y === y1 - 2) ? JP_G.PATH : JP_G.GRASS;
  const cx = (x0 + x1) >> 1; M.jpTower = [cx * 16 + 16, (y0 + 13) * 16]; F('jp_torre', cx - 1, y0 + 12, jpFp(4, 3), { px: cx * 16 + 16, py: (y0 + 13) * 16 - 1, jl: [[0, -30, 80, 'rgba(255,140,60,0.6)'], [0, -90, 60, 'rgba(255,170,80,0.5)'], [0, -150, 50, 'rgba(255,200,120,0.5)']] });
  for (let k = 0; k < 30; k++) { const x = R.int(x0, x1), y = R.int(y0, y1); if (M.jg[I(x, y)] !== JP_G.GRASS || Math.abs(x - cx) < 4 && y > y0 + 6) continue; Fs(R.f() < 0.6 ? 'jp_sakura' : 'jp_banco', x, y); } }
function jpZoneAt(px, py) { const x = px / 16, y = py / 16; return JP_ZONES.find(z => x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) || null; }
// reflejo del Pabellón Dorado en el estanque
function jpExtra(M, cx, cy) { if (!M.kinkaku) return; const [kx, ky] = M.kinkaku; if (kx < cx - 120 || kx > cx + VW + 120 || ky < cy - 60 || ky > cy + VH + 160) return; const S = objSprite({ k: 'furn', f: 'jp_kinkaku' });
  ctx.save(); ctx.beginPath(); ctx.ellipse(38 * 16 + 8 - cx, 186 * 16 + 8 - cy, 18 * 16, 10 * 16, 0, 0, 7); ctx.clip(); ctx.globalAlpha = 0.35 + Math.sin(G.t * 1.5) * 0.04; ctx.translate(Math.round(kx - cx), Math.round(ky - cy)); ctx.scale(1, -0.8); ctx.drawImage(S.c, -S.ax, -S.c.height); ctx.restore(); }

// ---------- coches con carril por la izquierda, semáforos y paradas ante el jugador ----------
const JP_CARS = [], JP_CCOL = ['#e8ecf2', '#1a1c24', '#c8102e', '#2a5ad8', '#ffd040', '#8a8e98', '#3aa04a', '#e8ecf2', '#1a1c24', '#2a8a5a'];
const jpLight = () => { const t = G.t % 24; return { h: t < 7 ? 'g' : t < 8.5 ? 'y' : 'r', v: t >= 8.5 && t < 15.5 ? 'g' : t >= 15.5 && t < 17 ? 'y' : 'r', all: t >= 17.5 && t < 23.5 }; };
function jpCarsInit(M) { JP_CARS.length = 0; const R = new RNG(SEED + 8202);
  for (let k = 0; k < 56; k++) { const hz = R.f() < 0.55, d = R.f() < 0.5 ? 1 : -1, ri = hz ? R.int(0, JP_HR.length - 1) : R.int(0, JP_VR.length - 1); const span = hz ? [(JP_VR[0] + 3) * 16, (JP_VR[JP_VR.length - 1] + 3) * 16] : [(JP_HR[0] + 3) * 16, (JP_HR[JP_HR.length - 1] + 3) * 16];
    const tx = R.f() < 0.38; JP_CARS.push({ hz, d, ri, s: span[0] + R.f() * (span[1] - span[0]), col: tx ? (R.f() < 0.5 ? 4 : 9) : R.int(0, 8), taxi: tx, v: 0 }); } }
const jpCarXY = c => c.hz ? [c.s, (JP_HR[c.ri] + (c.d > 0 ? 2 : 4)) * 16] : [(JP_VR[c.ri] + (c.d > 0 ? 4 : 2)) * 16, c.s];
function jpCarsTick(dt) { const M = G.map, P = G.P; if (!M || !M.jp || !P) return; const L = jpLight(), V = 70;
  for (const c of JP_CARS) { const [x, y] = jpCarXY(c), cross = c.hz ? JP_VR.map(v => (v + 3) * 16) : JP_HR.map(v => (v + 3) * 16);
    let next = null; for (const q of cross) if ((q - c.s) * c.d > 0 && (next === null || Math.abs(q - c.s) < Math.abs(next - c.s))) next = q; const dn = next === null ? 1e9 : Math.abs(next - c.s);
    let stop = false; const myL = c.hz ? L.h : L.v; if (myL !== 'g' && dn > 50 && dn < 66) stop = true;
    const px = P.x - x, py = P.y - y; if (c.hz ? (px * c.d > 0 && px * c.d < 40 && Math.abs(py) < 16) : (py * c.d > 0 && py * c.d < 44 && Math.abs(px) < 14)) stop = true;
    if (!stop) for (const o of JP_CARS) { if (o === c || o.hz !== c.hz || o.ri !== c.ri || o.d !== c.d) continue; const ds = (o.s - c.s) * c.d; if (ds > 0 && ds < 46) { stop = true; break; } }
    c.v += ((stop ? 0 : V) - c.v) * Math.min(1, dt * (stop ? 8 : 2)); const ns = c.s + c.d * c.v * dt;
    if (next !== null && (next - c.s) * c.d > 0 && (next - ns) * c.d <= 0) { // en el cruce: seguir, girar o dar la vuelta al final
      const idx = cross.indexOf(next), last = idx === 0 || idx === cross.length - 1, turn = last || Math.random() < 0.3;
      if (turn) { const onRoad = c.ri, hz = !c.hz, nri = idx; const pos = c.hz ? (JP_HR[onRoad] + 3) * 16 : (JP_VR[onRoad] + 3) * 16, maxI = (hz ? JP_HR : JP_VR).length - 1; let nd = Math.random() < 0.5 ? 1 : -1; if (onRoad === 0) nd = 1; if (onRoad === maxI) nd = -1;
        c.hz = hz; c.ri = nri; c.d = nd; c.s = pos + nd * 2; continue; } }
    c.s = ns; } }
V33_TICKS.push(dt => jpCarsTick(Math.min(0.05, dt || 0)));
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M || !M.jp) return; const night = darkness() > 0.25;
  for (const c of JP_CARS) { const [x, y] = jpCarXY(c); if (x < cx - 40 || x > cx + VW + 40 || y < cy - 40 || y > cy + VH + 40) continue; const dir = c.hz ? (c.d > 0 ? 'right' : 'left') : (c.d > 0 ? 'down' : 'up'), col = JP_CCOL[c.col];
    list.push({ type: 'xdraw', x, y: y + 6, noShadow: true, draw: (e, a, b) => { const S = spr('jpcar' + c.col + dir, () => ({ c: carSprite(col, dir), ax: c.hz ? 17 : 10, ay: c.hz ? 16 : 24 })); ctx.drawImage(S.c, Math.round(x - S.ax - a), Math.round(y - S.ay - b)); if (c.taxi) jpTaxiSign(Math.round(x - a), Math.round(y - S.ay - b), c.hz); },
      light: night ? { x: x + (c.hz ? c.d * 22 : 0), y: y + (c.hz ? -4 : c.d * 20), r: 30, c: 'rgba(255,240,190,0.5)' } : null }); } });
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || !M.jp) return; const L = jpLight(); for (const o of M.objs) { if (!o.sem || o.px < cx - 20 || o.px > cx + VW + 20 || o.py < cy - 60 || o.py > cy + VH + 20) continue;
    const x = Math.round(o.px - cx), y = Math.round(o.py - cy - 41); ctx.fillStyle = L.h === 'g' ? '#3aff9a' : '#1a3a2a'; ctx.fillRect(x - 6, y, 3, 4); ctx.fillStyle = L.h === 'y' ? '#ffd040' : '#3a3410'; ctx.fillRect(x - 1, y, 3, 4); ctx.fillStyle = L.h === 'r' ? '#ff3a3a' : '#3a1010'; ctx.fillRect(x + 4, y, 3, 4); } });

// ---------- ambiente: carteles de barrio, pétalos, incienso y luces ----------
let jpZT = 0; V33_TICKS.push(dt => { const M = G.map, P = G.P; if (!M || !M.jp || !P) return; jpZT += dt || 0;
  if (jpZT > 0.25) { jpZT = 0; const z = jpZoneAt(P.x, P.y); if (z && z.k !== P._jpZ) { P._jpZ = z.k; banner(z.n, z.j); } }
  const z = jpZoneAt(P.x, P.y); if (z && (z.k === 'fuji' || z.k === 'kioto' || z.k === 'asakusa') && Math.random() < 0.35) part(G.cam.x + Math.random() * VW, G.cam.y + Math.random() * 30, { z: 40, vz: -6, vx: 10 + Math.random() * 14, g: 2, life: 4, c: pick(['#ffc8d8', '#ffb0c8', '#ffffff']), s: 1 });
  for (const o of M.objs) if (o.incienso && Math.abs(o.px - P.x) < 220 && Math.abs(o.py - P.y) < 160 && Math.random() < 0.3) part(o.px + (Math.random() - 0.5) * 8, o.py - 30, { vz: 10, g: -4, life: 2.5, c: pick(['rgba(230,230,230,0.6)', 'rgba(200,200,210,0.5)']), s: 2 }); });

// ---------- viajar ----------
function goJapan() { const P = G.P, M = makeJapan(), Q = JP_Q; if (P.map === 'world' || !P.retX) { P.retX = SA.term.door * 16 + 8; P.retY = (SA.term.y + SA.term.h + 1) * 16 + 8; }
  P.retX = SA.term.door * 16 + 8; P.retY = (SA.term.y + SA.term.h + 1) * 16 + 8;
  transition(() => { P.inside = 'japon'; setMap(M, Q.term.door * 16 + 8, (Q.term.y + Q.term.h + 2) * 16, 'down'); P._jpZ = null; P.jp = P.jp || {}; if (!P.jp.seen) { P.jp.seen = 1; banner('日本へようこそ', L2('Bienvenido a Japón', 'Welcome to Japan')); } else banner('東京国際空港', L2('Aeropuerto de Tokio', 'Tokyo Airport')); markDirty(true); }); }
const AE_JP = { k: 'jp', jp: true, clerk: 'jp_taquilla', cafe: 'jp_cafetera', travellers: ['jp_9', 'ae_us', 'jp_21', 'ae_fr', 'jp_14', 'ae_kr', 'jp_33', 'ae_br', 'jp_40', 'ae_ca'] };
XACT.jp_aeropuerto = [L2('Entrar al aeropuerto', 'Enter the airport'), 'run', o => { const P = G.P, M = makeTerminal('jp_terminal', AE_JP); P.jpRet = { x: o.px, y: o.py + 18 }; transition(() => { P.inside = 'jp_terminal'; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner('東京国際空港', L2('Vuelos a Albor', 'Flights to Albor')); }); }];
{ const _ei = exitInterior; exitInterior = function () { const M = G.map, P = G.P; if (M && (M.jpIn || M.aeIn === 'jp')) { const R = P.jpRet || { x: JP_Q.term.door * 16 + 8, y: (JP_Q.term.y + JP_Q.term.h + 2) * 16 }; transition(() => { P.inside = 'japon'; setMap(makeJapan(), R.x, R.y, 'down'); }); return; } return _ei.apply(this, arguments); }; }

// ---------- interiores: karaoke, ramen, konbini y recreativos ----------
it('jp_onigiri', { n: L2('Onigiri', 'Onigiri'), t: 'cons', stack: true, heal: 5000, price: 800, icon: ['potion', '#f4f4f4'], rar: 1, d: L2('Bola de arroz de la konbini. Cura 5.000 de vida.', 'Konbini rice ball. Heals 5,000 HP.') });
it('jp_te', { n: L2('Té verde', 'Green tea'), t: 'cons', stack: true, heal: 2000, mana: 600, price: 500, icon: ['drop', '#6ab84a'], rar: 1, d: L2('Té verde en botella. Cura vida y maná.', 'Bottled green tea. Restores HP and mana.') });
it('jp_bento', { n: L2('Bentō', 'Bento'), t: 'cons', stack: true, food: 15, heal: 3000, price: 1500, icon: ['potion2', '#e8a020'], rar: 2, d: L2('Caja de comida japonesa: +15 % de ataque durante 3 minutos.', 'Japanese lunch box: +15% attack for 3 minutes.') });
for (const [k, n, en, col] of [['neko', 'Peluche de gato', 'Cat plushie', '#f4d0a0'], ['fuji', 'Peluche del Fuji', 'Fuji plushie', '#7a8ad8'], ['sushi', 'Peluche de sushi', 'Sushi plushie', '#ff8a6a'], ['tanuki', 'Peluche de tanuki', 'Tanuki plushie', '#8a6a4a']])
  it('jp_peluche_' + k, { n: L2(n, en), t: 'mat', stack: true, price: 3000, icon: ['heart', col], rar: 3, d: L2('Premio de la máquina de peluches de Akihabara. ¡Qué blandito!', 'Prize from the Akihabara claw machine. So soft!') });
const JP_IN = {
  karaoke: { n: L2('Karaoke', 'Karaoke'), j: 'カラオケ', floor: ['#3a1a4a', '#42204e'], wall: '#1a0e24', dark: 0.25, staff: 'jp_kara_st' },
  ramen: { n: L2('Casa de ramen', 'Ramen shop'), j: 'ラーメン', floor: ['#7a5a3a', '#6e5032'], wall: '#4a3020', dark: 0.05, staff: 'jp_chef' },
  konbini: { n: L2('Konbini', 'Konbini'), j: 'コンビニ', floor: ['#eef0f4', '#e2e6ec'], wall: '#c8ccd4', dark: 0, staff: 'jp_cajero' },
  arcade: { n: L2('Recreativos', 'Arcade'), j: 'ゲーム', floor: ['#1a1a3a', '#22224a'], wall: '#0e0e24', dark: 0.3, staff: 'jp_gamer' } };
function makeJpIn(k) { const id = 'jp_' + k + '_in'; if (G.maps[id]) return G.maps[id]; const D = JP_IN[k], w = 16, h = 12, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: D.dark, music: 'town', I, camps: [], jpIn: k };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (y < 3 || x === 0 || x === w - 1 || y === h - 1) M.ter[I(x, y)] = T.IWALL; M.ter[I(w >> 1, h - 1)] = T.FLOOR; M.exit = { x: w >> 1, y: h - 1 }; prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  const sp = (nid, x, y, o) => spawnNPC(nid, x * 16 + 8, y * 16 + 8, id, Object.assign({ face: 'down' }, o || {}));
  if (k === 'karaoke') { F('jp_pantalla', 6, 2, [[0, 0], [1, 0], [2, 0], [3, 0]]); F('jp_vacio', 8, 4, null, { solid: false, xact: 'jp_kara' }); F('jp_sofa', 2, 8, [[0, 0], [1, 0], [2, 0], [3, 0]]); F('jp_sofa', 10, 8, [[0, 0], [1, 0], [2, 0], [3, 0]]); F('jp_mesa', 7, 6, [[0, 0], [1, 0]]); sp('jp_kara_st', 13, 4); sp('jp_6', 3, 7, {}); sp('jp_10', 11, 7, {}); }
  if (k === 'ramen') { F('jp_barra', 3, 5, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]]); for (let x = 4; x <= 12; x += 2) F('jp_taburete', x, 6, null, { solid: false }); F('jp_menu', 3, 2, [[0, 0], [1, 0]]); F('jp_menu', 10, 2, [[0, 0], [1, 0]]); F('jp_olla', 12, 3, [[0, 0]]); sp('jp_chef', 8, 4); sp('jp_1', 5, 7, {}); sp('jp_13', 11, 7, {}); }
  if (k === 'konbini') { for (const [x, y] of [[3, 5], [8, 5], [3, 8], [8, 8]]) F('jp_estante', x, y, [[0, 0], [1, 0], [2, 0]]); for (let y = 3; y <= 9; y += 2) F('jp_nevera', 14, y, [[0, 0]]); F('jp_caja', 2, 3, [[0, 0], [1, 0], [2, 0]]); sp('jp_cajero', 3, 2); sp('jp_15', 12, 7, { wander: 2 }); }
  if (k === 'arcade') { for (let x = 2; x <= 13; x += 2) F('jp_maquinita', x, 3, null, { xact: 'jp_arcade' }); for (const x of [3, 7, 11]) F('jp_ufo', x, 7, [[0, 0], [1, 0]], { xact: 'jp_ufo' }); sp('jp_gamer', 6, 5, {}); sp('jp_7', 10, 5, {}); sp('jp_16', 4, 9, { wander: 2 }); }
  M.drawExtra = (cx, cy) => { const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(w - 1, Math.ceil((cx + VW) / 16)), y1 = Math.min(h - 1, Math.ceil((cy + VH) / 16));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const X = x * 16 - cx, Y = y * 16 - cy; if (M.ter[I(x, y)] === T.FLOOR) { ctx.fillStyle = D.floor[(x + y) % 2]; ctx.fillRect(X, Y, 16, 16); } else { ctx.fillStyle = D.wall; ctx.fillRect(X, Y, 16, 16); if (y === 2) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(X, Y + 14, 16, 2); } } }
    if (k === 'karaoke' || k === 'arcade') for (let q = 0; q < 6; q++) { const a = G.t * 0.7 + q, X = (w * 8 + Math.cos(a) * 80) - cx, Y = (h * 9 + Math.sin(a * 1.3) * 40) - cy; ctx.fillStyle = ['rgba(255,80,200,0.25)', 'rgba(80,200,255,0.25)', 'rgba(255,230,80,0.25)'][q % 3]; ctx.beginPath(); ctx.ellipse(X, Y, 14, 6, 0, 0, 7); ctx.fill(); }
    if (k === 'karaoke') jpText(ctx, 'カラオケ', 2 * 16 - cx, 0 - cy + 8, '#ff9ae0', 12); if (k === 'ramen') jpText(ctx, 'ラーメン', 6 * 16 - cx, 4 - cy, '#ffd040', 12); if (k === 'konbini') jpText(ctx, 'コンビニ 24', 6 * 16 - cx, 8 - cy, '#1a9a4a', 12); if (k === 'arcade') jpText(ctx, 'ゲーム', 6 * 16 - cx, 4 - cy, '#ffe040', 12); };
  G.maps[id] = M; return M; }
XACT.jp_in = [o => '🚪 ' + (JP_IN[o.ik] ? JP_IN[o.ik].n : ''), 'run', o => { const P = G.P, M = makeJpIn(o.ik), D = JP_IN[o.ik]; P.jpRet = { x: o.px, y: o.py + 14 }; transition(() => { P.inside = M.id; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner(D.n, D.j); }); }];
// muebles de los interiores
XSPR.jp_pantalla = () => { const [c, g] = XC(64, 40); g.fillStyle = '#1a1a22'; g.fillRect(0, 0, 64, 36); g.fillStyle = '#3a1a6a'; g.fillRect(3, 3, 58, 28); g.fillStyle = '#ff9ae0'; g.fillRect(6, 22, 30, 2); g.fillStyle = '#ffffff'; g.fillRect(36, 22, 18, 2); jpText(g, '歌', 26, 6, '#ffe040', 12); g.fillStyle = '#5a5a62'; g.fillRect(28, 36, 8, 4); return { c, ax: 8, ay: 39 }; };
XSPR.jp_sofa = () => { const [c, g] = XC(64, 24); g.fillStyle = '#7a1a5a'; g.fillRect(0, 2, 64, 14); g.fillStyle = '#9a2a7a'; g.fillRect(0, 12, 64, 10); g.fillStyle = '#b84a9a'; g.fillRect(2, 13, 60, 1); g.fillStyle = '#4a0e3a'; g.fillRect(0, 22, 64, 2); return { c, ax: 8, ay: 23 }; };
XSPR.jp_mesa = () => { const [c, g] = XC(32, 18); g.fillStyle = '#2a2a32'; g.fillRect(0, 4, 32, 8); g.fillStyle = '#4a4a52'; g.fillRect(0, 4, 32, 1); g.fillRect(4, 12, 2, 6); g.fillRect(26, 12, 2, 6); g.fillStyle = '#c8ccd4'; g.fillRect(12, 0, 2, 5); g.fillStyle = '#ffd040'; g.fillRect(20, 1, 4, 3); return { c, ax: 8, ay: 17 }; };
XSPR.jp_barra = () => { const [c, g] = XC(160, 24); g.fillStyle = '#8a5a30'; g.fillRect(0, 4, 160, 20); g.fillStyle = '#b07a44'; g.fillRect(0, 2, 160, 4); g.fillStyle = '#5a3418'; g.fillRect(0, 22, 160, 2); for (let x = 12; x < 150; x += 32) { g.fillStyle = '#f4f4f4'; g.fillRect(x, 0, 8, 3); g.fillStyle = '#c84a1a'; g.fillRect(x + 1, 0, 6, 1); } return { c, ax: 8, ay: 23 }; };
XSPR.jp_taburete = () => { const [c, g] = XC(12, 14); g.fillStyle = '#c81e1e'; g.fillRect(1, 2, 10, 4); g.fillStyle = '#5a5a62'; g.fillRect(5, 6, 2, 8); g.fillRect(2, 12, 8, 2); return { c, ax: 6, ay: 13 }; };
XSPR.jp_menu = () => { const [c, g] = XC(32, 30); g.fillStyle = '#2a1a12'; g.fillRect(0, 0, 32, 28); g.fillStyle = '#f4ecd8'; g.fillRect(2, 2, 28, 24); for (let k = 0; k < 3; k++) jpText(g, ['麺', '餃子', '定食'][k], 4 + k * 9, 4, '#1a1a1a', 10, true); return { c, ax: 8, ay: 29 }; };
XSPR.jp_olla = () => { const [c, g] = XC(20, 24); g.fillStyle = '#8a8e98'; g.fillRect(2, 8, 16, 14); g.fillStyle = '#b8bcc6'; g.fillRect(2, 8, 16, 2); g.fillStyle = '#c84a1a'; g.fillRect(0, 22, 20, 2); return { c, ax: 10, ay: 23 }; };
XSPR.jp_estante = () => { const [c, g] = XC(48, 32); g.fillStyle = '#d8dce4'; g.fillRect(0, 0, 48, 32); for (let y = 3; y < 30; y += 9) { g.fillStyle = '#9aa0ac'; g.fillRect(0, y + 6, 48, 2); for (let x = 2; x < 46; x += 4) { g.fillStyle = ['#ff8a5a', '#5ab0ff', '#ffd040', '#8aff6a', '#ff5a8a', '#ffffff', '#c08aff'][(x + y) % 7]; g.fillRect(x, y, 3, 6); } } return { c, ax: 8, ay: 31 }; };
XSPR.jp_nevera = () => { const [c, g] = XC(16, 34); g.fillStyle = '#c8ccd4'; g.fillRect(0, 0, 16, 34); g.fillStyle = 'rgba(160,220,255,0.6)'; g.fillRect(2, 2, 12, 28); for (let y = 4; y < 28; y += 6) for (let x = 3; x < 13; x += 3) { g.fillStyle = ['#2a8a4a', '#e8a020', '#1a5ad8', '#c81e3a'][(x + y) % 4]; g.fillRect(x, y, 2, 4); } return { c, ax: 8, ay: 33 }; };
XSPR.jp_caja = () => { const [c, g] = XC(48, 26); g.fillStyle = '#e8ecf2'; g.fillRect(0, 6, 48, 20); g.fillStyle = '#1a9a4a'; g.fillRect(0, 10, 48, 3); g.fillStyle = '#2a2e38'; g.fillRect(30, 0, 12, 8); g.fillStyle = '#5ad0ff'; g.fillRect(32, 2, 8, 4); return { c, ax: 8, ay: 25 }; };
XSPR.jp_maquinita = () => { const [c, g] = XC(16, 36); const col = ['#c81e3a', '#1a5ad8', '#1a9a4a', '#e8a020'][Math.floor(Math.random() * 4)]; g.fillStyle = col; g.fillRect(0, 2, 16, 34); g.fillStyle = '#1a1a22'; g.fillRect(2, 6, 12, 10); g.fillStyle = '#5affd0'; g.fillRect(3, 7, 10, 8); g.fillStyle = '#ff5ab8'; g.fillRect(5, 9, 3, 3); g.fillStyle = '#ffffff'; g.fillRect(4, 20, 2, 2); g.fillStyle = '#ffd040'; g.fillRect(9, 20, 2, 2); g.fillRect(12, 20, 2, 2); return { c, ax: 8, ay: 35 }; };
XSPR.jp_ufo = () => { const [c, g] = XC(32, 44); g.fillStyle = '#ff5ab8'; g.fillRect(0, 0, 32, 6); g.fillRect(0, 32, 32, 12); g.fillStyle = 'rgba(180,230,255,0.5)'; g.fillRect(1, 6, 30, 26); g.fillStyle = '#c8ccd4'; g.fillRect(15, 6, 2, 8); g.fillRect(12, 14, 8, 2); for (let k = 0; k < 5; k++) { g.fillStyle = ['#f4d0a0', '#7a8ad8', '#ff8a6a', '#8a6a4a', '#ffd0e0'][k]; g.beginPath(); g.arc(5 + k * 5.5, 28, 3, 0, 7); g.fill(); } g.fillStyle = '#ffd040'; g.fillRect(4, 36, 6, 4); return { c, ax: 8, ay: 43 }; };
// tiendas: ramen y konbini
DLG_HOOKS.push((npc, opts) => { const P = G.P;
  if (npc.id === 'jp_chef') for (const [n, en, cost, st, txt] of [['Shōyu ramen', 'Shoyu ramen', 3000, { atkP: 10 }, L2('+10 % de ataque', '+10% attack')], ['Tonkotsu ramen', 'Tonkotsu ramen', 3000, { spdP: 10 }, L2('+10 % de velocidad', '+10% speed')], ['Miso ramen', 'Miso ramen', 3000, { atkP: 6, spdP: 6 }, L2('+6 % de ataque y velocidad', '+6% attack and speed')]])
    opts.unshift({ label: '🍜 ' + L2(n, en) + ' · ' + cost.toLocaleString() + L2(' oro · ', ' gold · ') + txt + L2(' (10 min)', ' (10 min)'), icon: ['coin'], fn: () => { if (P.gold < cost) { typeText(L2('No te llega el oro.', 'Not enough gold.')); return; } P.gold -= cost; addBuff(P, 'ramen', st, 600); P.hp = P.S.maxhp; sfx('coin'); for (let q = 0; q < 10; q++) part(P.x + (Math.random() - 0.5) * 16, P.y - 20, { vz: 18, g: -6, life: 1.2, c: 'rgba(255,255,255,0.6)', s: 2 }); typeText(jlTxt(['いただきます！', 'Itadakimasu!', '¡Que aproveche! Te sientes lleno de energía.', 'Enjoy your meal! You feel full of energy.'])); } });
  if (npc.id === 'jp_cajero') for (const id of ['jp_bento', 'jp_te', 'jp_onigiri']) { const I = ITEMS[id]; opts.unshift({ label: '🏪 ' + I.n + ' · ' + I.price.toLocaleString() + L2(' oro', ' gold'), icon: I.icon, fn: () => { if (P.gold < I.price) { typeText(L2('No te llega el oro.', 'Not enough gold.')); return; } P.gold -= I.price; giveItem(id, 1); sfx('coin'); typeText(jlTxt(['ありがとうございました！', 'Arigatō gozaimashita!', '¡Muchas gracias! Vuelva pronto.', 'Thank you very much! Come again.'])); } }); } });
// ---------- minijuegos (karaoke, peluches y máquina de reflejos) ----------
function mgOverlay(btnTxt, G_) { const d = document.createElement('div'); d.id = 'jpMg'; d.style.cssText = 'position:fixed;inset:0;z-index:98;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6em';
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; cv.style.cssText = 'width:min(96vw,160vh);image-rendering:pixelated;border:3px solid #ffd040;border-radius:.4em'; const b = document.createElement('button'); b.className = 'btn gold big'; b.textContent = btnTxt; b.style.minWidth = '9em';
  d.appendChild(cv); d.appendChild(b); document.body.appendChild(d); const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; let done = false, t0 = performance.now(), last = t0;
  const tap = e => { if (e) e.preventDefault(); if (!done) G_.tap && G_.tap(); }; b.onpointerdown = tap; cv.onpointerdown = tap; const kd = e => { if (e.code === 'Space' || e.code === 'Enter') tap(e); }; window.addEventListener('keydown', kd);
  const end = () => { if (done) return; done = true; window.removeEventListener('keydown', kd); d.remove(); G_.end && G_.end(); };
  const step = () => { if (done) return; const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; if (G_.step(g, (now - t0) / 1000, dt) === false) { end(); return; } requestAnimationFrame(step); }; step(); return { end }; }
const JP_SONGS = [['桜 SAKURA', L2('Sakura (fácil)', 'Sakura (easy)'), 84, ['SAKURA SAKURA', 'HANA GA SAKU', 'HARU NO KAZE', 'SAKURA SAKURA']], ['ネオン NEON TOKYO', L2('Neón Tokio (normal)', 'Neon Tokyo (normal)'), 112, ['NEON NO MACHI', 'YORU WA HIKARU', 'TOKYO TOKYO', 'MOTTO UTAOU']], ['光 HILO DE LUZ', L2('Hilo de luz (difícil)', 'Thread of light (hard)'), 136, ['HIKARI NO ITO', 'TSUNAGU KOKORO', 'ALBOR KARA', 'NIHON MADE']]];
XACT.jp_kara = [L2('🎤 Cantar en el karaoke', '🎤 Sing karaoke'), 'run', () => xMsg('🎤 ' + L2('Elige canción', 'Pick a song'), L2('Toca el botón (o espacio) cuando cada nota llegue al círculo. ¡Cuanto mejor cantes, más premio!', 'Tap the button (or space) when each note reaches the circle. The better you sing, the bigger the prize!'), JP_SONGS.map((s, i) => [s[1], () => jpKaraoke(i)]))];
function jpKaraoke(si) { const S = JP_SONGS[si], beat = 60 / S[2], notes = []; let t = 2; for (let k = 0; k < 26; k++) { notes.push({ t, hit: 0 }); t += beat * ((k * 7 + si) % 5 === 0 ? 0.5 : (k % 4 === 3 ? 2 : 1)); } const END = t + 1.5, HX = 52, SP = 110;
  let score = 0, combo = 0, fb = '', fbT = 0; const P = G.P, pi = (P.app && P.app.hs || 0) % 8;
  mgOverlay('♪', { tap: () => { const now = G_t; let best = null, bd = 9; for (const n of notes) if (!n.hit && Math.abs(n.t - now) < bd) { bd = Math.abs(n.t - now); best = n; } if (best && bd < 0.22) { best.hit = bd < 0.1 ? 2 : 1; score += best.hit === 2 ? 100 : 55; combo++; fb = best.hit === 2 ? L2('¡PERFECTO!', 'PERFECT!') : L2('¡BIEN!', 'GOOD!'); } else { combo = 0; fb = L2('¡FALLO!', 'MISS!'); } fbT = 0.5; sfx('ui'); },
    step: (g, tt, dt) => { G_t = tt; if (tt > END) return false; const bg = g.createLinearGradient(0, 0, 0, 180); bg.addColorStop(0, '#2a0a4a'); bg.addColorStop(1, '#0a0a2a'); g.fillStyle = bg; g.fillRect(0, 0, 320, 180);
      for (let q = 0; q < 6; q++) { g.fillStyle = ['rgba(255,80,200,0.18)', 'rgba(80,200,255,0.18)', 'rgba(255,230,80,0.18)'][q % 3]; g.beginPath(); g.moveTo(40 + q * 50, 0); g.lineTo(20 + q * 50 + Math.sin(tt * 2 + q) * 40, 120); g.lineTo(60 + q * 50 + Math.sin(tt * 2 + q) * 40, 120); g.fill(); }
      jpText(g, S[0], 160 - jpW(S[0], 12) / 2, 8, '#ffe040', 12); const li = Math.floor(tt / (END / S[3].length)) % S[3].length; jpText(g, S[3][li], 160 - jpW(S[3][li], 10) / 2, 28, '#ffffff', 10);
      g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(0, 96, 320, 28); g.strokeStyle = '#ffd040'; g.lineWidth = 2; g.beginPath(); g.arc(HX, 110, 11, 0, 7); g.stroke();
      for (const n of notes) { const x = HX + (n.t - tt) * SP; if (x < -20 || x > 340) continue; if (n.hit) { g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.arc(x, 110 - (tt - n.t) * 40, 6, 0, 7); g.fill(); continue; } if (tt - n.t > 0.22 && !n.miss) { n.miss = 1; combo = 0; }
        g.fillStyle = n.miss ? '#5a5a6a' : '#ff5ab8'; g.beginPath(); g.arc(x, 110, 8, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.fillRect(x - 1, 104, 2, 8); g.fillRect(x - 1, 104, 5, 2); }
      jpPortrait(g, 230, 128, pi, 1.3); jpText(g, 'COMBO ' + combo, 10, 140, '#8affd0', 10); jpText(g, 'SCORE ' + score, 10, 156, '#ffffff', 10); if (fbT > 0) { fbT -= dt; jpText(g, fb, 160 - jpW(fb, 12) / 2, 72, '#ffe040', 12); } },
    end: () => { const pct = Math.round(score / (notes.length * 100) * 100), gold = Math.round(pct * 400); P.gold += gold; P.jp = P.jp || {}; P.jp.kara = Math.max(P.jp.kara || 0, pct); if (pct >= 75) addBuff(P, 'estrella', { atkP: 6, spdP: 6 }, 600);
      xMsg('🎤 ' + L2('Resultado', 'Result'), `<b style="font-size:1.6em">${pct} %</b><br>${pct >= 90 ? L2('¡Eres una estrella del karaoke!', 'You are a karaoke star!') : pct >= 75 ? L2('¡Muy bien cantado!', 'Very well sung!') : pct >= 50 ? L2('No está mal.', 'Not bad.') : L2('Hay que practicar más…', 'You need more practice…')}<br>+${gold.toLocaleString()} ${L2('de oro', 'gold')}${pct >= 75 ? '<br>' + L2('+6 % de ataque y velocidad durante 10 minutos', '+6% attack and speed for 10 minutes') : ''}<br><small>${L2('Mejor puntuación: ', 'Best score: ')}${P.jp.kara} %</small>`); sfx('quest'); markDirty(); } }); }
let G_t = 0;
XACT.jp_ufo = [L2('🧸 Máquina de peluches (1.000 oro)', '🧸 Claw machine (1,000 gold)'), 'run', () => { const P = G.P; if (P.gold < 1000) { xMsg('🧸', L2('Cuesta 1.000 de oro.', 'It costs 1,000 gold.')); return; } P.gold -= 1000;
  const prizes = ['neko', 'fuji', 'sushi', 'tanuki'].map((k, i) => ({ k, x: 70 + i * 60 + Math.random() * 20, c: ['#f4d0a0', '#7a8ad8', '#ff8a6a', '#8a6a4a'][i] })); let st = 'move', cx = 40, cy = 30, dropT = 0, got = null;
  mgOverlay(L2('¡SOLTAR!', 'DROP!'), { tap: () => { if (st === 'move') { st = 'down'; sfx('ui'); } },
    step: (g, tt, dt) => { g.fillStyle = '#ff5ab8'; g.fillRect(0, 0, 320, 180); g.fillStyle = '#c8eaff'; g.fillRect(10, 10, 300, 160); g.fillStyle = '#ffd0e0'; g.fillRect(10, 150, 300, 20);
      for (const p of prizes) if (p !== got) { g.fillStyle = p.c; g.beginPath(); g.arc(p.x, 140, 12, 0, 7); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(p.x - 5, 136, 2, 2); g.fillRect(p.x + 3, 136, 2, 2); g.fillStyle = p.c; g.beginPath(); g.arc(p.x - 8, 130, 4, 0, 7); g.arc(p.x + 8, 130, 4, 0, 7); g.fill(); }
      if (st === 'move') cx = 40 + (Math.sin(tt * 1.7) * 0.5 + 0.5) * 240; else if (st === 'down') { cy += 90 * dt; if (cy > 122) { st = 'up'; const near = prizes.reduce((a, p) => Math.abs(p.x - cx) < Math.abs(a.x - cx) ? p : a); if (Math.abs(near.x - cx) < 11 && Math.random() < 0.8) got = near; } } else if (st === 'up') { cy -= 70 * dt; if (cy < 30) { st = 'end'; dropT = tt; } }
      g.fillStyle = '#8a8e98'; g.fillRect(cx - 1, 10, 2, cy - 10); g.fillRect(cx - 9, cy, 18, 3); g.fillRect(cx - 9, cy, 2, 10); g.fillRect(cx + 7, cy, 2, 10); if (got) { g.fillStyle = got.c; g.beginPath(); g.arc(cx, cy + 14, 10, 0, 7); g.fill(); }
      jpText(g, 'UFO CATCHER', 160 - jpW('UFO CATCHER', 12) / 2, 14, '#c81e3a', 12); if (st === 'end' && tt - dropT > 0.8) return false; },
    end: () => { if (got) { giveItem('jp_peluche_' + got.k, 1); P.jp = P.jp || {}; P.jp.plush = (P.jp.plush || 0) + 1; xMsg('🧸 ' + L2('¡Premio!', 'Prize!'), ITEMS['jp_peluche_' + got.k].n + '<br><small>' + L2('Peluches conseguidos: ', 'Plushies won: ') + P.jp.plush + '</small>'); sfx('quest'); } else xMsg('🧸', L2('¡Casi! Se escapó de la pinza.', 'So close! It slipped from the claw.')); markDirty(); } }); }];
XACT.jp_arcade = [L2('🕹 Jugar (500 oro)', '🕹 Play (500 gold)'), 'run', () => { const P = G.P; if (P.gold < 500) { xMsg('🕹', L2('Cuesta 500 de oro.', 'It costs 500 gold.')); return; } P.gold -= 500;
  let round = 0, st = 'wait', tGo = 1 + Math.random() * 2, tShow = 0, res = [], msg = L2('ESPERA…', 'WAIT…'), tx = 160, ty = 90;
  mgOverlay(L2('¡DISPARA!', 'SHOOT!'), { tap: () => { if (st === 'wait') { res.push(999); msg = L2('¡DEMASIADO PRONTO!', 'TOO EARLY!'); st = 'pause'; tShow = G_t; } else if (st === 'go') { const r = Math.round((G_t - tShow) * 1000); res.push(r); msg = r + ' MS'; st = 'pause'; tShow = G_t; sfx('ui'); } },
    step: (g, tt) => { G_t = tt; g.fillStyle = '#0a0a24'; g.fillRect(0, 0, 320, 180); for (let k = 0; k < 40; k++) { g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect((k * 53 + tt * 30) % 320, (k * 37) % 180, 1, 1); }
      jpText(g, 'ROBO SHOOTER', 160 - jpW('ROBO SHOOTER', 12) / 2, 8, '#5affd0', 12); jpText(g, (round + 1) + '/5', 280, 8, '#ffffff', 10);
      if (st === 'wait' && tt > tGo) { st = 'go'; tShow = tt; tx = 60 + Math.random() * 200; ty = 60 + Math.random() * 70; }
      if (st === 'go') { g.fillStyle = '#ff3a3a'; g.beginPath(); g.arc(tx, ty, 14, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(tx, ty, 9, 0, 7); g.fill(); g.fillStyle = '#ff3a3a'; g.beginPath(); g.arc(tx, ty, 4, 0, 7); g.fill(); if (tt - tShow > 1.5) { res.push(1500); msg = L2('¡LENTO!', 'TOO SLOW!'); st = 'pause'; tShow = tt; } }
      jpText(g, msg, 160 - jpW(msg, 12) / 2, 156, '#ffe040', 12);
      if (st === 'pause' && tt - tShow > 1) { round++; if (round >= 5) return false; st = 'wait'; tGo = tt + 0.8 + Math.random() * 2; msg = L2('ESPERA…', 'WAIT…'); } },
    end: () => { const ok = res.filter(r => r < 999), avg = ok.length ? Math.round(ok.reduce((a, b) => a + b, 0) / ok.length) : 0, gold = Math.max(0, Math.round((ok.length * 600) * (avg ? Math.min(2, 400 / avg) : 0)));
      P.gold += gold; xMsg('🕹 ' + L2('Fin de la partida', 'Game over'), L2('Aciertos: ', 'Hits: ') + ok.length + '/5<br>' + L2('Reflejos medios: ', 'Average reaction: ') + (avg ? avg + ' ms' : '-') + '<br>+' + gold.toLocaleString() + ' ' + L2('de oro', 'gold')); markDirty(); } }); }];

// cámara: se levanta un poco cerca del Fuji y de la Torre de Tokio para que se vean enteros
let JP_BIAS = 0;
{ const _uc = updateCamera; updateCamera = function (dt, snap) { const M = G.map, P = G.P; if (!M || !M.jp || !P) { JP_BIAS = 0; return _uc.apply(this, arguments); }
    const tx = P.x / 16, ty = P.y / 16; let b = 0; if (tx > 22 && tx < 80 && ty < 48) b = 100; else if (M.jpTower && Math.abs(P.x - M.jpTower[0]) < 180 && P.y > M.jpTower[1] - 10 && P.y < M.jpTower[1] + 140) b = 90;
    JP_BIAS += (b - JP_BIAS) * (snap ? 1 : Math.min(1, (dt || 0.016) * 2)); const y0 = P.y; P.y -= JP_BIAS; try { return _uc.apply(this, arguments); } finally { P.y = y0; } }; }

// ---------- guía (lupa › Sistemas) ----------
if (typeof GSIS !== 'undefined') {
  GSIS.push(['camposanto', '🕯 ' + L2('Camposanto del Alba', 'Dawn Graveyard'), () => [
    L2('Al sur de Albor (baja por el camino de piedra y cruza la vía del tren) el mapa creció: allí está el Camposanto del Alba, donde descansan los Vigías del Alba y los vecinos cuyo hilo se terminó.', 'South of Albor (follow the stone path and cross the railway) the map has grown: there lies the Dawn Graveyard, where the Dawn Watchers and the neighbours whose thread ended rest.'),
    L2('Toca el monumento para rendir tributo a los caídos: una vez al día da +8 % de ataque y velocidad durante 10 minutos. Las lápidas cuentan quién fue cada uno.', 'Touch the monument to pay tribute to the fallen: once a day it gives +8% attack and speed for 10 minutes. The headstones tell who each one was.'),
    L2('Cuando un hijo, nieto o bisnieto muere de viejo, su tumba aparece aquí con su nombre. Puedes dejarle flores cada día. Odila, la cuidadora, te cuenta la historia del lugar.', 'When a child, grandchild or great-grandchild dies of old age, their grave appears here with their name. You can leave them flowers every day. Odila, the keeper, tells you the story of the place.')],
    () => ({ loc: [SA.cem.gate, SA.cem.y1 - 1], t: L2('Camposanto del Alba', 'Dawn Graveyard'), m: 'world' })]);
  GSIS.push(['familia_edad', '🌳 ' + L2('Edad de la familia y árbol genealógico', 'Family age and family tree'), () => [
    L2('Tus hijos, nietos y bisnietos cumplen años: unos 9 años cada 10 días del calendario (un día dura 5 minutos). A los 18 son adultos, a los 65 se jubilan y mueren de viejos entre los 82 y los 98.', 'Your children, grandchildren and great-grandchildren grow older: about 9 years every 10 calendar days (a day lasts 5 minutes). At 18 they are adults, at 65 they retire and they die of old age between 82 and 98.'),
    L2('Jubilados: ya no luchan, no trabajan ni van de expedición; se quedan en casa. Puedes jubilarlos antes (desde los 55) en su ficha. Los que ya tenías empiezan con 30 años como mucho.', 'Retired: they no longer fight, work or go on expeditions; they stay at home. You can retire them earlier (from 55) on their sheet. The ones you already had start at 30 at most.'),
    L2('En ❤ Familia › 🌳 Árbol genealógico ves todas las generaciones, su edad y quién se fue. Tú y tus parejas no envejecéis: vuestro hilo es de héroe.', 'In ❤ Family › 🌳 Family tree you see every generation, their age and who has passed. You and your partners do not age: your thread is a hero\'s.')]]);
  GSIS.push(['japon', '✈ ' + L2('Aeródromo de Albor y Japón', 'Albor Aerodrome and Japan'), () => [
    L2('El Aeródromo está al sur de Albor, junto al Camposanto. Fuera verás aterrizar, embarcar y despegar los aviones y a los pasajeros entrando. Dentro hay viajeros de muchos países, un café y la Puerta 1.', 'The Aerodrome is south of Albor, by the Graveyard. Outside you will see planes land, board and take off and passengers walking in. Inside there are travellers from many countries, a café and Gate 1.'),
    L2('Billete a Japón: en el mostrador de la izquierda, ' + AE_TICKET.toLocaleString() + ' de oro y nivel 400. Luego espera en la sala: cuando un avión llega a la puerta (cada 40 segundos) se puede embarcar por la Puerta 1. La vuelta desde Tokio es gratis.', 'Ticket to Japan: at the counter on the left, ' + AE_TICKET.toLocaleString() + ' gold and level 400. Then wait in the lounge: when a plane reaches the gate (every 40 seconds) you can board at Gate 1. The return from Tokyo is free.'),
    L2('Japón es el mapa más grande del juego: Monte Fuji con la pagoda y los cerezos (noroeste), Kioto con el Pabellón Dorado, el sendero de toriis y las geishas (suroeste), Akihabara (norte), Tokio y su torre (centro), Shinjuku y Kabukichō (este), Asakusa con la Puerta del Trueno (sur) y el aeropuerto (sureste).', 'Japan is the largest map in the game: Mount Fuji with the pagoda and cherry trees (northwest), Kyoto with the Golden Pavilion, the torii path and the geishas (southwest), Akihabara (north), Tokyo and its tower (centre), Shinjuku and Kabukichō (east), Asakusa with the Thunder Gate (south) and the airport (southeast).'),
    L2('Se puede entrar al karaoke y al ramen (Kabukichō), a los recreativos (Akihabara) y a las konbinis. Karaoke: canta tocando a tiempo (premio de oro y +6 % de ataque y velocidad). Recreativos: máquina de peluches y juego de reflejos. Ramen: +10 % durante 10 minutos. Konbini: onigiri, té verde y bentō.', 'You can enter the karaoke and the ramen shop (Kabukichō), the arcade (Akihabara) and the konbinis. Karaoke: sing by tapping on time (gold prize and +6% attack and speed). Arcade: claw machine and reflex game. Ramen: +10% for 10 minutes. Konbini: onigiri, green tea and bento.'),
    L2('Los coches circulan por la izquierda, paran en los semáforos en rojo y ante ti. Si guardas en Japón, al volver apareces en el Aeródromo de Albor.', 'Cars drive on the left, stop at red lights and in front of you. If you save in Japan, you come back at the Albor Aerodrome.')],
    () => ({ loc: [SA.term.door, SA.term.y + SA.term.h + 1], t: L2('Aeródromo de Albor', 'Albor Aerodrome'), m: 'world' })]);
}
