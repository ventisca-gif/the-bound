// ================= v4.82: JAPÓN (segunda parte) =================
// Pasto nuevo con tonos que se funden, matas, tréboles y florecitas · mapa de Japón propio (zonas, iconos, leyenda) ·
// calles como Akihabara y Shinjuku: edificios estrechos y altos pegados, carteles verticales, pantallas gigantes animadas,
// tiendas en la planta baja, cables entre postes, callejones (yokocho) con máquinas, bicis, cubos, linternas rojas,
// puestos de takoyaki y ramen, el gran cruce de Shibuya y taxis.

// ---------- pasto ----------
// Ruido suave en coordenadas del mundo (sin costuras entre casillas) + tramado 4×4 para que los tonos se mezclen en píxeles.
const JPG_PAL = { n: ['#3e7a2a', '#4a8c32', '#57a03b', '#66b044', '#78c052'], p: ['#4a7e30', '#579038', '#64a041', '#74ae4a', '#86bc56'] };
const JPG_BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
let JPG_ID = null, JPG_C = null;
function jpVN(x, y, s) { const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash2(x0, y0, s), b = hash2(x0 + 1, y0, s), c = hash2(x0, y0 + 1, s), d = hash2(x0 + 1, y0 + 1, s); return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy; }
function jpGrass(g, x, y, tx, ty, pink) {
  if (!JPG_C) JPG_C = { n: JPG_PAL.n.map(h => C(h)), p: JPG_PAL.p.map(h => C(h)) };
  if (!JPG_ID) JPG_ID = g.createImageData(16, 16); const d = new Uint32Array(JPG_ID.data.buffer), pal = pink ? JPG_C.p : JPG_C.n, ox = tx * 16, oy = ty * 16;
  for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const wx = ox + i, wy = oy + j;
    let v = jpVN(wx / 72, wy / 72, 401) * 0.62 + jpVN(wx / 22, wy / 22, 402) * 0.38; v += (JPG_BAY[(wy & 3) * 4 + (wx & 3)] / 16 - 0.47) * 0.13;
    d[j * 16 + i] = pal[v < 0.33 ? 0 : v < 0.45 ? 1 : v < 0.57 ? 2 : v < 0.68 ? 3 : 4]; }
  g.putImageData(JPG_ID, x, y);
  const h = hash2(tx, ty, 411), h2 = hash2(tx, ty, 412), h3 = hash2(tx, ty, 413), P = (px, py, c) => { g.fillStyle = c; g.fillRect(x + px, y + py, 1, 1); };
  // matas de hierba: base oscura y puntas claras
  const nt = 1 + ((h * 3) | 0); for (let k = 0; k < nt; k++) { const bx = 1 + ((hash2(tx * 3 + k, ty, 414) * 12) | 0), by = 4 + ((hash2(tx, ty * 3 + k, 415) * 11) | 0);
    g.fillStyle = '#2f6422'; g.fillRect(x + bx, y + by, 3, 1); g.fillStyle = '#3e7a2a'; g.fillRect(x + bx, y + by - 1, 1, 1); g.fillRect(x + bx + 2, y + by - 1, 1, 1); g.fillRect(x + bx + 1, y + by - 2, 1, 2);
    g.fillStyle = '#8cd062'; g.fillRect(x + bx, y + by - 2, 1, 1); g.fillRect(x + bx + 2, y + by - 3, 1, 1); g.fillRect(x + bx + 1, y + by - 4, 1, 2); }
  // trébol
  if (h2 < 0.12) { const bx = 3 + ((h3 * 9) | 0), by = 3 + ((h * 9) | 0); g.fillStyle = '#2f6a26'; g.fillRect(x + bx, y + by + 1, 4, 2); g.fillStyle = '#4e9a3a'; g.fillRect(x + bx, y + by, 2, 2); g.fillRect(x + bx + 2, y + by + 1, 2, 2); g.fillRect(x + bx + 1, y + by + 2, 2, 2); P(bx, by, '#7cc25a'); P(bx + 3, by + 1, '#7cc25a'); }
  // florecitas: blancas, amarillas, lilas (y más rosas bajo los cerezos)
  if (h3 < (pink ? 0.16 : 0.2)) { const bx = 2 + ((h2 * 11) | 0), by = 2 + ((h * 11) | 0), fc = pink ? ['#ffffff', '#ffd0e0', '#fff0a0'][(h * 3) | 0] : ['#ffffff', '#ffe04a', '#c8a8ff', '#ffffff', '#ffb0c8'][(h2 * 5) | 0];
    P(bx, by + 2, '#3a7428'); P(bx + 1, by, fc); P(bx - 1, by, fc); P(bx, by - 1, fc); P(bx, by + 1, uMulH(fc, 0.82)); P(bx, by, '#ffcc30');
    if (h < 0.5) { const b2 = (bx + 6) % 14 + 1, c2 = (by + 5) % 13 + 2; P(b2, c2, fc); P(b2, c2 + 1, '#3a7428'); } }
  // piedrecita
  if (h2 > 0.95) { const bx = 4 + ((h * 8) | 0), by = 6 + ((h3 * 7) | 0); g.fillStyle = '#8a8a7e'; g.fillRect(x + bx, y + by, 2, 1); P(bx, by - 1, '#b4b4a8'); P(bx + 1, by + 1, '#3a6026'); }
  // pétalos caídos bajo los cerezos
  if (pink) for (let k = 0; k < 6; k++) { const px = ((hash2(tx * 5 + k, ty, 416) * 15) | 0), py = ((hash2(tx, ty * 5 + k, 417) * 15) | 0); P(px, py, k % 3 ? '#ffc8d8' : '#f490b0'); if (k % 2) P(px + 1, py, '#ffe0ea'); }
}

// ---------- edificios estrechos y altos (jpb_slim_<ancho>_<v>) y pantallas gigantes (jpb_screen_<ancho>_<v>) ----------
JP_H_OF.slim = v => 112 + (v % 5) * 16; JP_H_OF.screen = v => 164 + (v % 3) * 8;
const JP_SLIM_W = ['居酒屋', 'カラオケ', '焼肉', 'ラーメン', '漫画', 'アニメ', 'ゲーム', '寿司', '薬', 'カフェ', '中古', '激安', '餃子', '焼鳥', '占い', '麻雀', '整体', '歯科', 'ネイル', 'バー', '古着', '眼鏡', '質屋', '酒', '本', '服', '靴', '茶', '肉', '湯'];
const JP_SIGNC = [['#c81e3a', '#ffffff'], ['#ffd040', '#1a1620'], ['#1a5ad8', '#ffffff'], ['#ff3a8a', '#ffffff'], ['#2ab868', '#ffffff'], ['#f4f4f4', '#c81e3a'], ['#1a1620', '#ffe040'], ['#ff7a1a', '#ffffff'], ['#8a3ad8', '#ffffff'], ['#1aa8c8', '#ffffff']];
const JP_SLIM_M = 9;   // margen a cada lado para los carteles verticales que sobresalen
function jpWord(r, maxCh) { const L = JP_SLIM_W.filter(t => t.length <= maxCh); return L.length ? L[(r * L.length) | 0] : '酒'; }
function jpSlim(w, v) { const W = w * 16, H = JP_H_OF.slim(v), M = JP_SLIM_M, [c, g] = XC(W + M * 2, H), r = n => hash2(w * 31 + n, v * 17 + 3, 993), R = (x, y, ww, hh, col) => { g.fillStyle = col; g.fillRect(M + x, y, ww, hh); };
  const facs = ['#d8d0c4', '#b8c0c8', '#e8e0d0', '#8a96a4', '#c8b49a', '#f0ece4', '#9aa4ae', '#d4c0b0', '#6a7480', '#e4d8e0', '#c8a890', '#a0a8a0'], fc = facs[(v * 5 + w * 3) % facs.length], glass = r(1) < 0.22, top = 12;
  R(0, top, W, H - top, fc); R(0, top, W, 3, uMulH(fc, 0.7)); R(0, top + 3, W, 1, uMulH(fc, 0.85)); R(0, top, 1, H - top - 3, uMulH(fc, 0.72)); R(W - 1, top, 1, H - top - 3, uMulH(fc, 0.84));
  // azotea: depósito de agua, aparatos de aire o un cartel en su marco
  const rt = (r(2) * 4) | 0;
  if (rt === 0) { R((W >> 1) - 4, 2, 8, 7, '#8a9098'); R((W >> 1) - 4, 2, 8, 1, '#b8bec6'); R((W >> 1) - 3, 9, 1, 3, '#5a5e66'); R((W >> 1) + 2, 9, 1, 3, '#5a5e66'); }
  else if (rt === 1) { for (let x = 2; x + 6 <= W - 2; x += 8) { R(x, top - 5, 6, 5, '#c8ccd0'); R(x + 2, top - 4, 2, 2, '#6a6e76'); } }
  else if (rt === 2 && W >= 32) { const [bc, tc] = JP_SIGNC[(v + w) % JP_SIGNC.length]; R(2, 0, W - 4, 10, bc); R(3, 10, 1, 2, '#3a3a40'); R(W - 4, 10, 1, 2, '#3a3a40'); g.save(); g.beginPath(); g.rect(M + 2, 0, W - 4, 10); g.clip(); jpText(g, jpWord(r(3), ((W - 6) / 10) | 0), M + 4, 0, tc, 10); g.restore(); }
  // pisos
  for (let y = top + 6, f = 0; y < H - 40; y += 15, f++) { const t = r(10 + f);
    if (glass) { R(1, y, W - 2, 13, '#3e5e7e'); R(1, y, W - 2, 2, 'rgba(200,230,255,0.45)'); for (let x = 1; x < W - 1; x += 8) R(x, y, 1, 13, '#2a3e52'); if (t < 0.3) R(2 + ((r(40 + f) * (W - 8)) | 0), y + 3, 5, 8, '#ffe8a0'); }
    else if (t < 0.42) { const [bc, tc] = JP_SIGNC[((r(20 + f) * JP_SIGNC.length) | 0)]; R(1, y, W - 2, 13, bc); R(1, y, W - 2, 1, 'rgba(255,255,255,0.45)'); R(1, y + 12, W - 2, 1, 'rgba(0,0,0,0.25)'); g.save(); g.beginPath(); g.rect(M + 1, y, W - 2, 13); g.clip(); const wd = jpWord(r(30 + f), Math.max(1, ((W - 4) / 10) | 0)); jpText(g, wd, M + ((W - jpW(wd, 10)) >> 1), y + 1, tc, 10); g.restore(); }
    else { const n = Math.max(1, (W / 16) | 0), ww = W >= 32 ? 10 : 9; for (let k = 0; k < n; k++) { const wx = ((W / n) * k + (W / n - ww) / 2) | 0; jpWin(g, M + wx, y + 2, ww, 9, r(50 + f * 3 + k) < 0.3, f + k); R(wx - 1, y + 11, ww + 2, 1, uMulH(fc, 0.78)); }
      if (r(60 + f) < 0.3) { const ax = r(61 + f) < 0.5 ? 1 : W - 7; R(ax, y + 6, 6, 5, '#d0d4d8'); R(ax + 1, y + 7, 3, 3, '#7a7e86'); R(ax, y + 11, 6, 1, '#8a8e94'); } } }
  // cartel vertical que sobresale (el sello de Akihabara y Shinjuku)
  if (r(70) < 0.8) { const right = r(71) < 0.55, wd = jpWord(r(72), 4), sh = wd.length * 11 + 8, sx = right ? W - 4 : -8, sy = top + 6 + ((r(73) * Math.max(1, H - 60 - sh)) | 0), [bc, tc] = JP_SIGNC[((r(74) * JP_SIGNC.length) | 0)];
    R(sx + (right ? -2 : 12), sy + 4, 2, 2, '#4a4a50'); R(sx + (right ? -2 : 12), sy + sh - 6, 2, 2, '#4a4a50'); R(sx, sy, 12, sh, bc); R(sx, sy, 12, 1, 'rgba(255,255,255,0.6)'); R(sx, sy, 1, sh, 'rgba(255,255,255,0.35)'); R(sx + 11, sy, 1, sh, 'rgba(0,0,0,0.3)');
    for (let k = 2; k < sh - 2; k += 3) { R(sx + 1, sy + k, 1, 1, '#fff4c0'); R(sx + 10, sy + k, 1, 1, '#fff4c0'); }
    jpText(g, wd, M + sx + 1, sy + 4, tc, 10, true); }
  // planta baja: tienda iluminada
  const gt = (r(80) * 4) | 0, [ac] = JP_SIGNC[((r(81) * JP_SIGNC.length) | 0)];
  R(0, H - 30, W, 3, ac); if (gt === 0) for (let x = 0; x < W; x += 6) R(x, H - 27, 3, 5, '#ffffff'), R(x + 3, H - 27, 3, 5, ac); else R(0, H - 27, W, 5, uMulH(ac, 0.8));
  if (gt === 1) { R(0, H - 22, W, 19, '#5a3a24'); const nx = Math.max(1, (W >> 1) - 7); R(nx, H - 22, 14, 9, ['#1e2a5a', '#5a1e1e', '#f4ecd8'][(v + w) % 3]); for (let k = 1; k < 3; k++) R(nx + k * 5, H - 22, 1, 9, '#e8dcc0'); R(nx + 1, H - 13, 12, 10, '#2a1a12'); }
  else { R(0, H - 22, W, 19, gt === 3 ? '#fff0f8' : '#fff6e0'); for (let x = 2; x < W - 2; x += 3) R(x, H - 18 + ((r(90 + x) * 4) | 0), 2, 6 + ((r(95 + x) * 6) | 0), ['#ff8a5a', '#5ab0ff', '#ffd040', '#8aff6a', '#ff5a8a', '#c08aff', '#ffffff'][(x + v) % 7]);
    R(0, H - 22, W, 19, 'rgba(180,220,255,0.18)'); R(0, H - 22, 1, 19, '#3a3a40'); R(W - 1, H - 22, 1, 19, '#3a3a40'); if (W >= 32) { R((W >> 1) - 5, H - 19, 10, 16, '#2a3a4a'); R((W >> 1) - 4, H - 18, 4, 15, 'rgba(160,210,255,0.5)'); } }
  R(0, H - 3, W, 3, '#5a5650');
  return { c, ax: M + W / 2, ay: H - 1 }; }
const JP_SCRN = { x: 5, y: 20, h: 60 };   // pantalla dentro del edificio
function jpScreenB(w, v) { const W = w * 16, H = JP_H_OF.screen(v), [c, g] = XC(W, H), R = (x, y, ww, hh, col) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
  const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#2a3446'); gr.addColorStop(1, '#1a2230'); g.fillStyle = gr; g.fillRect(0, 8, W, H - 8); R(0, 4, W, 5, '#3a4458'); R(6, 0, W - 12, 5, '#4a5468');
  for (let y = 90; y < H - 34; y += 8) for (let x = 3; x < W - 3; x += 6) R(x, y, 4, 5, hash2(x, y + v, 77) < 0.35 ? '#ffe8a0' : '#34506a');
  const S = JP_SCRN, sw = W - S.x * 2; R(S.x - 3, S.y - 3, sw + 6, S.h + 6, '#5a5e68'); R(S.x - 2, S.y - 2, sw + 4, S.h + 4, '#1a1a20'); R(S.x, S.y, sw, S.h, '#0a0a12');
  R(4, S.y + S.h + 4, W - 8, 9, '#0a0a12'); g.save(); g.beginPath(); g.rect(4, S.y + S.h + 4, W - 8, 9); g.clip(); jpText(g, ['ようこそ東京へ・新作アニメ・ライブ', '大人気・限定・ゲーム・カフェ', '渋谷・新宿・秋葉原・浅草'][v % 3], 6, S.y + S.h + 3, '#ffe040', 10); g.restore();
  R(0, H - 30, W, 3, '#ff3a8a'); R(0, H - 27, W, 24, '#fff4e0'); for (let x = 3; x < W - 3; x += 4) R(x, H - 22, 3, 7 + (x * 7) % 9, ['#ff5a8a', '#5ab0ff', '#ffd040', '#8aff6a'][x % 4]); R((W >> 1) - 7, H - 22, 14, 19, '#2a3a4a'); R((W >> 1) - 6, H - 21, 6, 18, 'rgba(160,210,255,0.5)'); R(0, H - 3, W, 3, '#5a5650');
  return { c, ax: W / 2, ay: H - 1 }; }
{ const _jb = jpBld; jpBld = function (key) { const [, kind, ws, vs] = key.split('_'); if (kind === 'slim') return jpSlim(+ws, +vs); if (kind === 'screen') return jpScreenB(+ws, +vs); return _jb.apply(this, arguments); }; }
{ const _bl = jpBldLights; jpBldLights = function (kind, w) { if (kind === 'slim') return [[0, -56, 44, ['rgba(255,110,170,0.5)', 'rgba(255,220,110,0.5)', 'rgba(110,200,255,0.45)'][w % 3]], [0, -12, 30, 'rgba(255,240,200,0.5)']]; if (kind === 'screen') return [[0, -120, 80, 'rgba(160,200,255,0.5)'], [0, -14, 40, 'rgba(255,230,200,0.5)']]; return _bl.apply(this, arguments); }; }
// contenido animado de las pantallas (anuncios que cambian cada pocos segundos)
let JP_ADS = 5; const JP_ADC = {};
function jpAd(k, sw, sh) { const key = k + '_' + sw; if (JP_ADC[key]) return JP_ADC[key]; const [c, g] = XC(sw, sh), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  if (k === 0) { R(0, 0, sw, sh, '#ffb8d8'); for (let i = 0; i < 14; i++) R(hash2(i, 1, 5) * sw, hash2(i, 2, 5) * sh, 2, 2, '#ffffff'); jpPortrait(g, sw - 54, 2, 3, 1.5); jpText(g, '新作', 3, 4, '#c81e5a', 12); jpText(g, 'アニメ', 3, 20, '#1a1a22', 10); R(3, sh - 12, 34, 9, '#c81e5a'); jpText(g, '限定', 5, sh - 13, '#ffffff', 10); }
  else if (k === 1) { const gr = g.createLinearGradient(0, 0, 0, sh); gr.addColorStop(0, '#1a8ad8'); gr.addColorStop(1, '#6ae0ff'); g.fillStyle = gr; g.fillRect(0, 0, sw, sh); R(sw - 26, 10, 14, 40, '#e8281e'); R(sw - 26, 10, 14, 4, '#c8ccd4'); R(sw - 26, 46, 14, 4, '#c8ccd4'); R(sw - 23, 20, 3, 22, 'rgba(255,255,255,0.6)'); jpText(g, 'ソーダ', 4, 8, '#ffffff', 12); jpText(g, '大人気', 4, 28, '#fff4a0', 10); for (let i = 0; i < 8; i++) R(6 + i * 5, sh - 8 - (i % 3) * 3, 2, 2, 'rgba(255,255,255,0.7)'); }
  else if (k === 2) { R(0, 0, sw, sh, '#2a0a4a'); for (let i = 0; i < 6; i++) { g.fillStyle = ['rgba(255,80,220,0.35)', 'rgba(80,200,255,0.35)'][i % 2]; g.beginPath(); g.moveTo(sw / 2, sh); g.lineTo(i * sw / 5 - 6, 0); g.lineTo(i * sw / 5 + 6, 0); g.fill(); } jpPortrait(g, (sw >> 1) - 26, 6, 11, 1.5); jpText(g, 'ライブ', 3, 3, '#ffe040', 12); }
  else if (k === 3) { R(0, 0, sw, sh, '#0e2a5a'); R(0, 0, sw, 14, '#c81e3a'); jpText(g, '東京', 3, 1, '#ffffff', 12); jpText(g, '天気', 3, 18, '#ffffff', 10); g.fillStyle = '#ffd040'; g.beginPath(); g.arc(sw - 20, 32, 9, 0, 7); g.fill(); jpText(g, '晴', sw - 26, 44, '#ffffff', 12); jpText(g, '25', 26, 30, '#ffe040', 12); }
  else { R(0, 0, sw, sh, '#101018'); for (let y = 0; y < sh; y += 6) for (let x = (y / 6) % 2 * 6; x < sw; x += 12) R(x, y, 6, 6, '#1a1a2a'); jpText(g, 'ゲーム', 4, 4, '#5affd0', 12); for (let i = 0; i < 5; i++) R(8 + i * 12, 34, 8, 8, ['#ff5ab8', '#ffd040', '#5ab0ff', '#8aff6a', '#ff7a1a'][i]); jpPortrait(g, sw - 40, sh - 30, 6, 1); }
  return (JP_ADC[key] = c); }
WORLD_DRAW.push((cx, cy) => { const M = G.map, P = G.P; if (!M || !M.jp || !M.jpScr) return; const S = JP_SCRN;
  for (const o of M.jpScr) { const W = o.ws * 16, H = JP_H_OF.screen(o.sv), sw = W - S.x * 2, x = Math.round(o.px - W / 2 + S.x - cx), y = Math.round(o.py - (H - 1) + S.y - cy); if (x > VW || y > VH || x + sw < 0 || y + S.h < 0) continue;
    const t = G.t / 3.4 + o.id * 0.37, k = Math.floor(t) % JP_ADS, f = t - Math.floor(t), behind = P.y < o.py - 4 && P.x > o.px - W / 2 + 4 && P.x < o.px + W / 2 - 4 && P.y > o.py - H + 6;
    ctx.save(); ctx.globalAlpha = behind ? 0.55 : 1; ctx.beginPath(); ctx.rect(x, y, sw, S.h); ctx.clip(); ctx.drawImage(jpAd(k, sw, S.h), x, y);
    if (f < 0.12) ctx.drawImage(jpAd((k + JP_ADS - 1) % JP_ADS, sw, S.h), x + Math.round(f / 0.12 * sw), y);   // barrido al cambiar
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; for (let yy = 0; yy < S.h; yy += 2) ctx.fillRect(x, y + yy, sw, 1); const sh = ((G.t * 40 + o.id * 30) % (sw + 40)) - 20; ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(x + sh, y, 6, S.h);
    ctx.restore(); } });

// ---------- callejones (yokocho) ----------
JP_G.ALLEY = 12;
function jpAlley(M, F, Fs, R, ax, y0, y1, zk) { const I = M.I; for (let y = y0; y <= y1; y++) for (let x = ax; x <= ax + 2; x++) M.jg[I(x, y)] = JP_G.ALLEY;
  F('jp_yokocho' + (zk === 'aki' ? 1 : 0), ax + 1, y1, [], { px: (ax + 1) * 16 + 8, py: (y1 + 1) * 16 + 2, solid: false, jl: [[0, -46, 56, 'rgba(255,80,60,0.55)']] });
  for (let y = y0 + 2; y < y1 - 1; y += 3) F('jp_chochin3', ax + 1, y, [], { px: (ax + 1) * 16 + 8, py: y * 16 + 6, solid: false, jl: [[0, -12, 30, 'rgba(255,90,60,0.5)']] });
  const my = y0 + ((y1 - y0) >> 1), side = R.f() < 0.5 ? ax : ax + 2; Fs(zk === 'aki' ? 'jp_takoyaki' : 'jp_yatai', side, my, { xact: zk === 'aki' ? 'jp_tako' : 'jp_yatai', jl: [[0, -20, 36, 'rgba(255,170,90,0.6)']] });
  const props = ['jp_maquina', 'jp_bici', 'jp_basura', 'jp_cajas', 'jp_maquina', 'jp_aire', 'jp_bici', 'jp_basura'];
  for (let y = y0 + 1; y < y1; y++) for (const x of [ax, ax + 2]) { if (y === my || R.f() > 0.38) continue; const p = props[(R.f() * props.length) | 0]; Fs(p, x, y, p === 'jp_maquina' ? { jl: [[0, -12, 26, 'rgba(200,230,255,0.5)']] } : null); } }
XSPR.jp_chochin3 = () => { const [c, g] = XC(52, 24); g.strokeStyle = '#1a1a1a'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 2); g.quadraticCurveTo(26, 8, 52, 2); g.stroke();
  for (let k = 0; k < 3; k++) { const x = 10 + k * 16, y = 4 + (k === 1 ? 2 : 0); g.fillStyle = '#e8281e'; g.beginPath(); g.ellipse(x, y + 8, 5, 7, 0, 0, 7); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(x - 3, y, 6, 2); g.fillRect(x - 3, y + 14, 6, 2); g.fillStyle = 'rgba(255,230,140,0.5)'; g.fillRect(x - 2, y + 4, 2, 7); jpText(g, '酒', x - 5, y + 3, 'rgba(26,26,26,0.85)', 10); }
  return { c, ax: 26, ay: 23 }; };
for (const [k, txt, bc] of [[0, '思い出横丁', '#c81e1e'], [1, '飲み屋横丁', '#1a3a7a']]) XSPR['jp_yokocho' + k] = () => { const [c, g] = XC(56, 64), tw = jpW(txt, 10); g.fillStyle = '#4a4a52'; g.fillRect(4, 16, 3, 48); g.fillRect(49, 16, 3, 48);
  g.fillStyle = bc; g.fillRect(0, 2, 56, 15); g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(0, 2, 56, 1); g.fillStyle = '#ffe8a0'; for (let x = 1; x < 56; x += 3) { g.fillRect(x, 3, 1, 1); g.fillRect(x, 15, 1, 1); } g.save(); g.beginPath(); g.rect(1, 3, 54, 13); g.clip(); jpText(g, txt, 28 - tw / 2, 4, '#ffffff', 10); g.restore(); return { c, ax: 28, ay: 63 }; };
XSPR.jp_basura = () => { const [c, g] = XC(18, 22); g.fillStyle = '#2a6ab8'; g.fillRect(1, 6, 8, 15); g.fillStyle = '#4a8ad8'; g.fillRect(1, 6, 8, 2); g.fillStyle = '#3a9a4a'; g.fillRect(10, 8, 7, 13); g.fillStyle = '#5aba6a'; g.fillRect(10, 8, 7, 2);
  g.fillStyle = 'rgba(240,240,240,0.9)'; g.beginPath(); g.ellipse(6, 4, 5, 4, 0, 0, 7); g.fill(); g.fillStyle = '#ffd040'; g.fillRect(4, 2, 3, 1); return { c, ax: 9, ay: 21 }; };
XSPR.jp_cajas = () => { const [c, g] = XC(18, 22); for (const [y, col] of [[12, '#e8c020'], [4, '#c81e1e']]) { g.fillStyle = col; g.fillRect(1, y, 16, 9); g.fillStyle = uMulH(col, 0.7); for (let x = 3; x < 16; x += 4) g.fillRect(x, y + 2, 2, 5); } for (let x = 3; x < 16; x += 4) { g.fillStyle = '#5a3418'; g.fillRect(x, 5, 2, 2); } return { c, ax: 9, ay: 21 }; };
XSPR.jp_aire = () => { const [c, g] = XC(20, 16); g.fillStyle = '#d4d8dc'; g.fillRect(1, 2, 18, 13); g.fillStyle = '#a8acb2'; g.fillRect(1, 13, 18, 2); g.fillStyle = '#5a5e66'; g.beginPath(); g.arc(8, 8, 4.5, 0, 7); g.fill(); g.fillStyle = '#8a8e96'; g.fillRect(7, 4, 2, 9); g.fillRect(4, 7, 9, 2); g.fillStyle = '#7a7e86'; for (let y = 4; y < 12; y += 2) g.fillRect(14, y, 4, 1); return { c, ax: 10, ay: 15 }; };
XSPR.jp_takoyaki = () => { const [c, g] = XC(36, 46); g.fillStyle = '#7a4a24'; g.fillRect(2, 14, 2, 32); g.fillRect(32, 14, 2, 32); for (let x = 0; x < 36; x += 6) { g.fillStyle = (x / 6) % 2 ? '#ffffff' : '#e8281e'; g.fillRect(x, 10, 6, 6); }
  g.fillStyle = '#1a1a1a'; g.fillRect(2, 0, 32, 11); jpText(g, 'たこ焼き', 3, 0, '#ffe040', 10); g.fillStyle = '#9a6a3a'; g.fillRect(0, 28, 36, 18); g.fillStyle = '#3a3a40'; g.fillRect(3, 24, 30, 5);
  for (let x = 5; x < 32; x += 5) { g.fillStyle = '#c88a3a'; g.fillRect(x, 24, 4, 3); g.fillStyle = '#5a2a12'; g.fillRect(x + 1, 24, 2, 1); } g.fillStyle = '#e8281e'; g.beginPath(); g.ellipse(18, 37, 5, 6, 0, 0, 7); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(15, 30, 6, 1); g.fillRect(15, 43, 6, 1); return { c, ax: 18, ay: 45 }; };
XSPR.jp_yatai = () => { const [c, g] = XC(40, 48); g.fillStyle = '#5a3418'; g.fillRect(3, 6, 3, 30); g.fillRect(34, 6, 3, 30); g.fillStyle = '#3a3a44'; g.fillRect(0, 2, 40, 6); g.fillStyle = '#c81e1e'; g.fillRect(4, 8, 32, 10); g.fillStyle = '#ffffff'; for (let k = 1; k < 4; k++) g.fillRect(4 + k * 8, 8, 1, 10); jpText(g, 'ラーメン', 4, 8, '#ffffff', 10);
  g.fillStyle = '#8a5a30'; g.fillRect(0, 30, 40, 14); g.fillStyle = '#b07a44'; g.fillRect(0, 28, 40, 3); g.fillStyle = '#3a3a3a'; g.beginPath(); g.arc(14, 46, 3, 0, 7); g.arc(28, 46, 3, 0, 7); g.fill(); g.fillStyle = '#e8281e'; g.beginPath(); g.ellipse(36, 24, 3, 4, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(16, 22, 2, 5); g.fillRect(22, 20, 2, 7); return { c, ax: 20, ay: 47 }; };
it('jp_takoyaki', { n: L2('Takoyaki', 'Takoyaki'), t: 'cons', stack: true, heal: 7000, price: 1200, icon: ['potion', '#c88a3a'], rar: 1, d: L2('Bolitas de pulpo recién hechas en un callejón de Akihabara. Cura 7.000 de vida.', 'Fresh octopus balls from an Akihabara alley. Heals 7,000 HP.') });
it('jp_yakitori', { n: L2('Yakitori', 'Yakitori'), t: 'cons', stack: true, heal: 9000, price: 1500, icon: ['potion', '#a8642a'], rar: 1, d: L2('Brochetas a la brasa de un puesto de Shinjuku. Cura 9.000 de vida.', 'Grilled skewers from a Shinjuku stall. Heals 9,000 HP.') });
const jpBuyFood = (id, line) => () => { const P = G.P, I = ITEMS[id]; if (P.gold < I.price) { xMsg('🏮', L2('Cuesta ', 'It costs ') + I.price.toLocaleString() + L2(' de oro.', ' gold.')); return; } P.gold -= I.price; giveItem(id, 1); sfx('coin'); xMsg('🏮', jlTxt(line)); markDirty(); };
XACT.jp_tako = [L2('🐙 Takoyaki (1.200 oro)', '🐙 Takoyaki (1,200 gold)'), 'food', jpBuyFood('jp_takoyaki', ['熱いから気をつけて！', 'Atsui kara ki o tsukete!', '¡Cuidado, que queman!', 'Careful, they\'re hot!'])];
XACT.jp_yatai = [L2('🍢 Yakitori del puesto (1.500 oro)', '🍢 Stall yakitori (1,500 gold)'), 'food', jpBuyFood('jp_yakitori', ['まいど！', 'Maido!', '¡Gracias, vuelva cuando quiera!', 'Thanks, come back any time!'])];

// ---------- taxis ----------
function jpTaxiSign(x, top, hz) { const y = top + (hz ? 2 : 9); ctx.fillStyle = '#c8a020'; ctx.fillRect(x - 4, y, 8, 4); ctx.fillStyle = '#fff4c0'; ctx.fillRect(x - 3, y + 1, 6, 2); }

// ---------- cruce de Shibuya (todos los peatones cruzan a la vez, también en diagonal) ----------
const JP_SCR = { x0: 263, x1: 266, y0: 53, y1: 56 };
JP_ZONES.unshift({ k: 'shibuya', n: L2('Cruce de Shibuya', 'Shibuya Crossing'), j: '渋谷', x0: 259, x1: 270, y0: 49, y1: 60 });
// marca 11: rayas diagonales del cruce
{ const _jp = jpPaint; jpPaint = function (M, g, cx, cy) { _jp.apply(this, arguments); const S = JP_SCR, x0 = cx * CH, y0 = cy * CH;
  for (let ty = y0; ty < y0 + CH && ty < M.h; ty++) for (let tx = x0; tx < x0 + CH && tx < M.w; tx++) { if (M.jg[ty * M.w + tx] !== JP_G.ALLEY) continue; const x = (tx - x0) * 16, y = (ty - y0) * 16, h = hash2(tx, ty, 431);
    g.fillStyle = h < 0.5 ? '#4e4a52' : '#524e56'; g.fillRect(x, y, 16, 16); g.fillStyle = '#5c5860'; g.fillRect(x + ((h * 90) | 0) % 12, y + ((h * 57) | 0) % 13, 3, 2); g.fillStyle = '#423e46'; g.fillRect(x + ((h * 33) | 0) % 13, y + ((h * 71) | 0) % 14, 2, 1);
    if ((tx + ty * 3) % 11 === 0) { g.fillStyle = '#3a3a40'; g.beginPath(); g.ellipse(x + 8, y + 8, 5, 4, 0, 0, 7); g.fill(); g.fillStyle = '#5a5a62'; g.fillRect(x + 5, y + 7, 6, 1); g.fillRect(x + 5, y + 9, 6, 1); }
    if (M.jg[ty * M.w + tx - 1] !== JP_G.ALLEY || M.jg[ty * M.w + tx + 1] !== JP_G.ALLEY) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(M.jg[ty * M.w + tx - 1] !== JP_G.ALLEY ? x : x + 13, y, 3, 16); } }
  if (S.x1 < x0 || S.x0 >= x0 + CH || S.y1 < y0 || S.y0 >= y0 + CH) return; const ox = (S.x0 - x0) * 16, oy = (S.y0 - y0) * 16, sz = (S.x1 - S.x0 + 1) * 16;
  g.save(); g.beginPath(); g.rect(ox, oy, sz, sz); g.clip(); g.fillStyle = '#ececec';
  for (const d of [1, -1]) { g.save(); g.translate(ox + sz / 2, oy + sz / 2); g.rotate(d * Math.PI / 4); for (let k = -sz * 0.7; k < sz * 0.7; k += 7) g.fillRect(k, -7, 4, 14); g.restore(); }
  g.restore(); }; }

// ---------- cables de luz entre postes ----------
function jpCables(M, cx, cy) { const L = M.jpPoles; if (!L) return; ctx.save(); ctx.strokeStyle = 'rgba(22,22,28,0.85)'; ctx.lineWidth = 1;
  for (let i = 0; i + 1 < L.length; i++) { const a = L[i], b = L[i + 1]; if (a.py !== b.py || b.px - a.px > 30 * 16) continue; if (b.px < cx - 20 || a.px > cx + VW + 20 || a.py - 70 > cy + VH || a.py < cy) continue;
    const sag = 6 + (b.px - a.px) * 0.018; for (const [ox, oy] of [[-12, 55], [-6, 55], [6, 55], [12, 55], [0, 45]]) { const x1 = a.px + ox - cx + 0.5, x2 = b.px + ox - cx + 0.5, y = a.py - oy - cy + 0.5 + (ox === 0 ? 0 : 0); ctx.beginPath(); ctx.moveTo(x1, y); ctx.quadraticCurveTo((x1 + x2) / 2, y + sag * 2 + (ox === 0 ? 3 : 0), x2, y); ctx.stroke(); } }
  ctx.restore(); }

// ---------- peatones de fondo (aceras de la ciudad y el gran cruce) ----------
const JP_PED = []; let jpPedT = 0, jpScrDone = -1;
function jpPedTick(dt) { const M = G.map, P = G.P; if (!M || !M.jp || !P) { JP_PED.length = 0; return; } const ptx = P.x / 16, pty = P.y / 16, z = jpZoneAt(P.x, P.y), city = z && ['aki', 'tokio', 'shinjuku', 'shibuya'].includes(z.k);
  jpPedT -= dt; const mk = (x, y, path) => { const i = (Math.random() * 16) | 0; JP_PED.push({ x, y, path, A: xwAtlas(i, JP_APPS_W), mv: 1, ph: Math.random() * 9, dir: 'down', sp: 26 + Math.random() * 14 }); };
  if (city && jpPedT <= 0 && JP_PED.length < 22) { jpPedT = 0.5 + Math.random() * 0.8;
    const hz = Math.random() < 0.6; if (hz) { const j = JP_HR.findIndex(v => Math.abs(v + 5 - pty) < 14); const rows = JP_HR.filter(v => Math.abs(v + 5 - pty) < 14); if (rows.length) { const y = rows[(Math.random() * rows.length) | 0] + 5, i = JP_VR.findIndex((v, k) => k + 1 < JP_VR.length && ptx >= v - 30 && ptx < JP_VR[k + 1] + 30 && Math.random() < 0.5), vi = i >= 0 ? i : Math.max(0, JP_VR.findIndex(v => v > ptx) - 1), xa = JP_VR[vi] + 6, xb = (JP_VR[vi + 1] || JP_W - 5) - 1, d = Math.random() < 0.5 ? 1 : -1, x0 = d > 0 ? xa : xb;
        if (M.jg[M.I(x0, y)] === JP_G.WALK) mk(x0 * 16 + 8, y * 16 + 8, [[(d > 0 ? xb : xa) * 16 + 8, y * 16 + 8]]); } }
    else { const cols = JP_VR.filter(v => Math.abs(v - ptx) < 22); if (cols.length) { const x = cols[(Math.random() * cols.length) | 0] + (Math.random() < 0.5 ? 0 : 5), hj = Math.max(0, JP_HR.findIndex(v => v > pty) - 1), ya = JP_HR[hj] + 6, yb = (JP_HR[hj + 1] || 154) - 1, d = Math.random() < 0.5 ? 1 : -1;
        if (M.jg[M.I(x, d > 0 ? ya : yb)] === JP_G.WALK) mk(x * 16 + 8, (d > 0 ? ya : yb) * 16 + 8, [[x * 16 + 8, (d > 0 ? yb : ya) * 16 + 8]]); } } }
  // el gran cruce: cuando todos los semáforos de coches están en rojo, sale la multitud de las cuatro esquinas
  const S = JP_SCR, scx = (S.x0 + S.x1 + 1) / 2, scy = (S.y0 + S.y1 + 1) / 2, Lt = jpLight(), cyc = Math.floor(G.t / 24);
  if (Lt.all && jpScrDone !== cyc && Math.abs(ptx - scx) < 26 && Math.abs(pty - scy) < 18) { jpScrDone = cyc; const C4 = [[S.x0 - 1, S.y0 - 1], [S.x1 + 1, S.y0 - 1], [S.x0 - 1, S.y1 + 1], [S.x1 + 1, S.y1 + 1]];
    for (let k = 0; k < 18; k++) { const a = C4[k % 4], b = C4[[3, 2, 1, 0][k % 4]], c2 = k % 3 === 0 ? C4[[1, 0, 3, 2][k % 4]] : k % 3 === 1 ? C4[[2, 3, 0, 1][k % 4]] : b, j = () => (Math.random() - 0.5) * 22;
      mk(a[0] * 16 + 8 + j(), a[1] * 16 + 8 + j(), [[c2[0] * 16 + 8 + j(), c2[1] * 16 + 8 + j()], [c2[0] * 16 + 8 + (c2[0] < scx ? -1 : 1) * 70, c2[1] * 16 + 8 + j()]]); JP_PED[JP_PED.length - 1].sp = 32 + Math.random() * 12; } }
  for (let k = JP_PED.length - 1; k >= 0; k--) { const w = JP_PED[k], tg = w.path[0]; if (!tg || Math.abs(w.x - P.x) > 700 || Math.abs(w.y - P.y) > 500) { JP_PED.splice(k, 1); continue; } const dx = tg[0] - w.x, dy = tg[1] - w.y, Ln = Math.hypot(dx, dy);
    if (Ln < 2) { w.path.shift(); continue; } const st = Math.min(Ln, w.sp * dt); w.x += dx / Ln * st; w.y += dy / Ln * st; w.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); } }
V33_TICKS.push(dt => jpPedTick(Math.min(0.05, dt || 0)));
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M || !M.jp) return; for (const w of JP_PED) if (w.x > cx - 40 && w.x < cx + VW + 40 && w.y > cy - 40 && w.y < cy + VH + 60) list.push({ type: 'xdraw', x: w.x, y: w.y, noShadow: true, draw: (e, a, b) => xwDraw(w, a, b) }); });

// ---------- al crear el mapa: pantallas, cables ----------
{ const _mj = makeJapan; makeJapan = function () { const had = G.maps.japon, M = _mj.apply(this, arguments); if (!had && M) {
  M.jpScr = M.objs.filter(o => typeof o.f === 'string' && o.f.startsWith('jpb_screen_')).map(o => { const [, , ws, vs] = o.f.split('_'); return { px: o.px, py: o.py, ws: +ws, sv: +vs, id: o.id }; });
  if (M.jpPoles) M.jpPoles.sort((a, b) => a.py - b.py || a.px - b.px); const dp = M.drawPost; M.drawPost = (cx, cy) => { if (dp) dp(cx, cy); jpCables(M, cx, cy); }; } return M; }; }

// ---------- mapa de Japón (panel del mapa, con flechas entre mundos) ----------
MAPC.jpfood = [L2('Comida (ramen, takoyaki, konbini)', 'Food (ramen, takoyaki, konbini)'), 'Food (ramen, takoyaki, konbini)', '#ff9a4a', 'food'];
MAPC.jpfun = [L2('Karaoke y recreativos', 'Karaoke & arcade'), 'Karaoke & arcade', '#ff5ad8', 'note'];
MAPC.jpsight = [L2('Monumentos', 'Landmarks'), 'Landmarks', '#ffd04a', 'star'];
MAPC.jpplane = [L2('Aeropuerto (vuelo a Albor)', 'Airport (flight to Albor)'), 'Airport (flight to Albor)', '#9ad8ff', 'mk:airship'];
const JP_MAPC = ['#5ca63e', '#4a4d56', '#c9c5bd', '#d6c296', '#2a64ac', '#3a84a8', '#a8a49c', '#e8d8a2', '#5ca63e', '#3a3c44', '#bba98a', '#e8a8c0', '#5a5258', '#5e5a6a'];
const JP_ROOF = { slim: ['#d8a0b0', '#a0c0d8', '#e0d0a0', '#b0b8c4', '#c8b0d8', '#e8c0a0'], aki: ['#f0c840', '#e86a5a', '#5aa0e8'], neon: ['#8a4a9a', '#b04a6a'], office: ['#9aa4b0', '#b8b4ac'], tower: ['#5a7a9a', '#4a6a88'], hotel: ['#c84a5a'], apt: ['#d8c8a8', '#c8d0d8'],
  shop: ['#e8d0b0', '#d8e0e8'], machiya: ['#4a5262', '#5a6272'], konbini: ['#3aa86a'], karaoke: ['#c84ab8'], ramen: ['#c86a3a'], arcade: ['#f0c020'], screen: ['#3a4a6a'] };
function jpOverview(M) { const K = 3, c = mkCanvas(M.w * K, M.h * K), x = c.getContext('2d');
  for (let ty = 0; ty < M.h; ty++) for (let tx = 0; tx < M.w; tx++) { const i = ty * M.w + tx, k = M.jg[i]; let col = JP_MAPC[k] || JP_MAPC[0];
    if (k === 0 || k === 11) { const v = jpVN(tx / 5, ty / 5, 403); col = k === 11 ? (v < 0.5 ? '#e8a8c0' : '#f0b8cc') : v < 0.33 ? '#4e9436' : v < 0.66 ? '#5ca63e' : '#68b046'; }
    if (k === 4 && M.jsh[i]) col = '#4a90cc'; x.fillStyle = col; x.fillRect(tx * K, ty * K, K, K);
    const m = M.jm[i]; if ((m === 1 && tx % 3 === 0) || (m === 2 && ty % 3 === 0) || m === 7) { x.fillStyle = '#e8e8e8'; x.fillRect(tx * K + 1, ty * K + 1, 1, 1); } else if (m === 3 || m === 4 || m === 11) { x.fillStyle = 'rgba(240,240,240,0.7)'; x.fillRect(tx * K, ty * K + (m === 4 ? 0 : 1), m === 4 ? K : K, 1); } }
  // tejados de los edificios, con sombra y borde
  for (const o of M.objs) { if (typeof o.f !== 'string') continue; const f = o.f;
    if (f.startsWith('jpb_')) { const [, kind, ws, vs] = f.split('_'), wd = +ws, dp = kind === 'machiya' ? 4 : kind === 'nhouse' ? 6 : 9, L = JP_ROOF[kind] || ['#a0a0a8'], col = L[(+vs + o.tx) % L.length], X = o.tx * K, Y = (o.ty - dp + 1) * K, W = wd * K, H = dp * K;
      x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(X + 1, Y + 1, W, H); x.fillStyle = col; x.fillRect(X, Y, W, H); x.fillStyle = 'rgba(255,255,255,0.3)'; x.fillRect(X, Y, W, 1); x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(X + W - 1, Y, 1, H); x.fillRect(X, Y + H - 1, W, 1); continue; }
    const blob = (r, col, col2) => { x.fillStyle = col; x.beginPath(); x.arc(o.tx * K + 1.5, o.ty * K - 1, r, 0, 7); x.fill(); if (col2) { x.fillStyle = col2; x.fillRect(o.tx * K, o.ty * K - 2, 1, 1); } };
    if (f === 'jp_sakura') blob(3.2, '#f4a8c4', '#ffe0ec'); else if (f === 'jp_pino' || f === 'tree') blob(2.8, '#2e6a3a', '#4a8a4a'); else if (f === 'jp_bambu') blob(1.8, '#5a9a3a');
    else if (f === 'jp_torii') { x.fillStyle = '#d8402a'; x.fillRect(o.tx * K - 2, o.ty * K, 7, 2); }
    else if (['jp_hondo', 'jp_kaminarimon', 'jp_hozomon', 'jp_pagoda', 'jp_kinkaku', 'jp_torre', 'jp_terminal', 'ae_hangar'].includes(f)) { const fp = o.fp || [[0, 0]]; x.fillStyle = f === 'jp_kinkaku' ? '#e8b830' : f === 'jp_torre' ? '#e8501e' : f === 'jp_terminal' || f === 'ae_hangar' ? '#c8ccd4' : '#c8282a'; for (const [dx, dy] of fp) x.fillRect((o.tx + dx) * K, (o.ty + dy) * K, K, K); x.fillStyle = 'rgba(40,30,30,0.6)'; for (const [dx, dy] of fp) if (dy === 0) x.fillRect((o.tx + dx) * K, (o.ty + dy) * K + K - 1, K, 1); } }
  // el Monte Fuji con su nieve
  const fx = 50 * K + 1, fy = 34 * K; x.fillStyle = '#5a64a0'; x.beginPath(); x.moveTo(fx - 24 * K, fy); x.lineTo(fx - 3 * K, fy - 13 * K); x.lineTo(fx + 3 * K, fy - 13 * K); x.lineTo(fx + 24 * K, fy); x.fill();
  x.fillStyle = '#3e4a80'; x.beginPath(); x.moveTo(fx, fy - 13 * K); x.lineTo(fx + 3 * K, fy - 13 * K); x.lineTo(fx + 24 * K, fy); x.lineTo(fx + 6 * K, fy); x.fill();
  x.fillStyle = '#f4f2fa'; x.beginPath(); x.moveTo(fx - 9 * K, fy - 8 * K); x.lineTo(fx - 3 * K, fy - 13 * K); x.lineTo(fx + 3 * K, fy - 13 * K); x.lineTo(fx + 9 * K, fy - 8 * K); for (let k = 9; k >= -9; k -= 2) x.lineTo(fx + k * K, fy - (k % 4 ? 7 : 9) * K); x.fill();
  return c; }
{ const _mo = mapOverview; mapOverview = function (M) { if (M && M.jp) { if (!MAP_OV[M.id]) MAP_OV[M.id] = { c: jpOverview(M), w: M.w }; return MAP_OV[M.id].c; } return _mo.apply(this, arguments); }; }
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); if (!M || !M.jp) return out;
  const IK = { karaoke: ['jpfun', L2('Karaoke de Kabukichō', 'Kabukichō karaoke')], arcade: ['jpfun', L2('Recreativos de Akihabara', 'Akihabara arcade')], ramen: ['jpfood', L2('Ramen de Kabukichō', 'Kabukichō ramen')], konbini: ['jpfood', 'Konbini (onigiri, ' + L2('té y bentō', 'tea and bento') + ')'] };
  for (const o of M.objs) { if (o.xact === 'jp_in' && IK[o.ik]) out.push({ c: IK[o.ik][0], x: o.tx, y: o.ty, t: IK[o.ik][1] }); else if (o.xact === 'jp_tako') out.push({ c: 'jpfood', x: o.tx, y: o.ty, t: L2('Puesto de takoyaki (callejón)', 'Takoyaki stall (alley)') }); else if (o.xact === 'jp_yatai') out.push({ c: 'jpfood', x: o.tx, y: o.ty, t: L2('Puesto de yakitori (callejón)', 'Yakitori stall (alley)') }); else if (o.xact === 'jp_aeropuerto') out.push({ c: 'jpplane', x: o.tx, y: o.ty, t: L2('Aeropuerto de Tokio: vuelo gratis a Albor', 'Tokyo Airport: free flight to Albor') }); }
  for (const [x, y, t] of [[50, 30, L2('Monte Fuji', 'Mount Fuji')], [92, 44, L2('Pagoda Chureito', 'Chureito Pagoda')], [38, 176, L2('Kinkaku-ji, el Pabellón Dorado', 'Kinkaku-ji, the Golden Pavilion')], [87, 180, L2('Sendero de los mil toriis', 'Path of a thousand torii')], [JP_ASK.lane, JP_ASK.y1, L2('Kaminarimon, la Puerta del Trueno', 'Kaminarimon, the Thunder Gate')], [JP_ASK.lane, JP_ASK.y0 + 13, L2('Templo Sensō-ji', 'Sensō-ji Temple')], [265, 55, L2('Cruce de Shibuya', 'Shibuya Crossing')], [276, 50, L2('Arco de Kabukichō', 'Kabukichō gate')]]) out.push({ c: 'jpsight', x: x + 0.5, y: y + 0.5, t });
  if (M.jpTower) out.push({ c: 'jpsight', x: M.jpTower[0] / 16, y: M.jpTower[1] / 16, t: L2('Torre de Tokio', 'Tokyo Tower') }); return out; }; }
if (typeof MAPW_LIST !== 'undefined') MAPW_LIST.push({ id: 'japon', n: L2('Japón', 'Japan'), mk: () => makeJapan(), how: L2('Avión desde el Aeródromo al sur de Albor (billete en el mostrador, nivel 400).', 'Plane from the Aerodrome south of Albor (ticket at the counter, level 400).') });
// nombres de las zonas sobre el mapa (como los pueblos en las Tierras del Vínculo)
{ const _rm = renderMap; renderMap = function (B) { _rm.apply(this, arguments); const Wd = MAPW_LIST[MAPW]; if (!Wd || Wd.id !== 'japon') return; const cvs = $('#wm'), M = G.maps.japon; if (!cvs || !M) return; const x = cvs.getContext('2d'), sc = cvs.width / M.w;
  x.textAlign = 'center'; for (const z of JP_ZONES) { if (z.k === 'shibuya') continue; const cx = (z.x0 + z.x1) / 2 * sc, cy = ((z.y0 + z.y1) / 2 + (z.k === 'fuji' ? 16 : z.k === 'tokio' ? -14 : 0)) * sc;
    x.font = `bold ${Math.round(9 + sc * 1.6)}px 'Pixelify Sans', monospace`; const nm = z.mn || z.n; x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.95)'; x.strokeText(nm, cx, cy); x.fillStyle = '#ffd23a'; x.fillText(nm, cx, cy);
    const jw = jpW(z.j, 12), jx = Math.round(cx - jw / 2), jy = Math.round(cy + 3); x.fillStyle = 'rgba(10,6,4,0.7)'; x.fillRect(jx - 2, jy, jw + 4, 13); jpText(x, z.j, jx, jy, '#fff4d0', 12); } }; }
if (typeof GSIS !== 'undefined') GSIS.push(['japon2', '🗾 ' + L2('Japón: calles, callejones y el gran cruce', 'Japan: streets, alleys and the great crossing'), () => [
  L2('Akihabara, Shinjuku y Tokio tienen calles como las de verdad: edificios estrechos y altos pegados unos a otros, carteles verticales que brillan de noche, tiendas en la planta baja, cables de luz entre los postes y gente paseando por las aceras.', 'Akihabara, Shinjuku and Tokyo have streets like the real ones: narrow, tall buildings packed together, vertical signs that glow at night, shops on the ground floor, power lines between the poles and people walking on the pavements.'),
  L2('Callejones (yokocho): pasillos estrechos entre los edificios con linternas rojas, máquinas expendedoras, bicis y cubos. En los de Akihabara hay puestos de takoyaki (1.200 oro, curan 7.000) y en los de Shinjuku de yakitori (1.500 oro, curan 9.000).', 'Alleys (yokocho): narrow passages between the buildings with red lanterns, vending machines, bikes and bins. Akihabara ones have takoyaki stalls (1,200 gold, heal 7,000) and Shinjuku ones yakitori (1,500 gold, heal 9,000).'),
  L2('Cruce de Shibuya (en Shinjuku, junto al arco de Kabukichō): tres pantallas gigantes con anuncios que cambian. Cuando todos los semáforos de coches se ponen en rojo, la gente cruza a la vez desde las cuatro esquinas, también en diagonal.', 'Shibuya Crossing (in Shinjuku, by the Kabukichō gate): three giant screens with changing adverts. When every car light turns red, people cross at once from all four corners, diagonally too.'),
  L2('Taxis amarillos y verdes con su luz en el techo. El mapa de Japón está en ▶ del panel del mapa, con los barrios, la comida, el ocio y los monumentos.', 'Yellow and green taxis with their roof light. Japan\'s map is under ▶ in the map panel, with the districts, food, fun and landmarks.')],
  () => ({ loc: [265, 58], t: L2('Cruce de Shibuya', 'Shibuya Crossing'), m: 'japon' })]);
