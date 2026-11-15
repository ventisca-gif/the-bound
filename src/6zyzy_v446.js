// =====================================================================================
// v4.46: cazadores estilo anime sacados de la referencia de Sergio (frente, espalda, perfil),
// Titán Carmesí detallado, y nieve de Navidad en el mundo.
// =====================================================================================

// ---------- hoja de cazadores: 26 modelos (15 de la referencia + 11 de mujer con pelo largo) ----------
// filas de 76 px: 0 frente, 1 espalda, 2 perfil (izquierda), 3 máscara de pelo; columnas de 72 px
const HNA = { img: null, ok: false, CW: 72, CH: 76, meta: 'mfmfmmmmmmmmmmmfffffffffff', body: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 4, 6, 8, 10, 14, 5, 7, 9, 11, 13], cache: {}, hairC: {} };
const HNA_CLS = { 0: ['asesino', 'mago'], 1: ['mago', 'bardo'], 2: ['guerrero'], 3: ['bardo', 'invocador', 'pez'], 4: ['asesino', 'arquero'], 5: ['asesino', 'guerrero'], 6: ['mago', 'guerrero'], 7: ['guerrero', 'arquero', 'pez'], 8: ['asesino', 'arquero'], 9: ['guerrero', 'asesino', 'arquero'], 10: ['invocador', 'bardo'], 11: ['mago', 'pez'], 12: ['invocador', 'arquero'], 13: ['mago', 'bardo'], 14: ['invocador', 'asesino'] };
const HNA_TINT = [null, '#ff7aa0', '#6ab0ff', '#ffd060', '#b07aff', '#ff5a3a', '#3a3a4c', '#6ae0b0', '#ffa040', '#e8f4ff'];
const HNA_SCALE = { normal: 1, tall: 1.1, big: 1.2, giant: 1.35 };
const HNA_MON = { mon_vaelor: { k: 14, hue: 0 }, mon_thorgar: { k: 2, hue: 25, hair: '#ffd060' }, mon_ilhan: { k: 5, hue: 0 }, mon_kiro: { k: 0, hue: 0 }, mon_seren: { k: 25, hue: 300, hair: '#ff5a3a' }, mon_brutus: { k: 12, hue: 200 } };
function hnaRGB(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function hnaHSL(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; if (mx === mn) return [0, 0, l]; const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [h * 60, s, l]; }
function hnaFromHSL(h, s, l) { h = ((h % 360) + 360) % 360 / 360; if (!s) { const v = Math.round(l * 255); return [v, v, v]; } const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }; return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)]; }
// color medio del pelo del modelo k (de su máscara) y si es gris/blanco (se puede teñir)
function hnaHair(k) { if (HNA.hairC[k]) return HNA.hairC[k]; const c = mkCanvas(72 * 2, 76), x = c.getContext('2d'); x.drawImage(HNA.img, k * 72, 0, 72, 76, 0, 0, 72, 76); x.drawImage(HNA.img, k * 72, 76 * 3, 72, 76, 72, 0, 72, 76);
  const d = x.getImageData(0, 0, 144, 76).data; let r = 0, g = 0, b = 0, n = 0; for (let y = 0; y < 76; y++) for (let i = 0; i < 72; i++) { const m = (y * 144 + 72 + i) * 4, p = (y * 144 + i) * 4; if (d[m + 3] > 0 && d[p + 3] > 0) { r += d[p]; g += d[p + 1]; b += d[p + 2]; n++; } }
  const col = n ? [r / n, g / n, b / n] : [80, 80, 90], hs = hnaHSL(col[0], col[1], col[2]); return HNA.hairC[k] = { col, grey: hs[1] < 0.18 && hs[2] > 0.45 }; }
// las tres vistas recoloreadas (tono de la ropa y tinte del pelo)
function hnaViews(k, hue, hair) {
  const key = k + '|' + hue + '|' + (hair || ''); if (HNA.cache[key]) return HNA.cache[key];
  const c = mkCanvas(216, 76), x = c.getContext('2d'); for (let v = 0; v < 3; v++) x.drawImage(HNA.img, k * 72, v * 76, 72, 76, v * 72, 0, 72, 76);
  if (hue || hair) { const H = hnaHair(k), tc = hair ? hnaRGB(hair) : null, im = x.getImageData(0, 0, 216, 76), d = im.data;
    for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const r = d[i], g = d[i + 1], b = d[i + 2], y = (i >> 2) / 216 | 0;
      const dh = Math.hypot(r - H.col[0], g - H.col[1], b - H.col[2]);
      if (tc && H.grey && y < 62 && dh < 150 && hnaHSL(r, g, b)[1] < 0.22 && (r + g + b) > 260) { const l = (r * 0.3 + g * 0.59 + b * 0.11) / 255, m = 0.3 + l * 1.05; d[i] = Math.min(255, tc[0] * m); d[i + 1] = Math.min(255, tc[1] * m); d[i + 2] = Math.min(255, tc[2] * m); continue; }
      if (!hue) continue; const [h, s, l] = hnaHSL(r, g, b); if (s < 0.22 || (h >= 8 && h <= 50) || l < 0.08) continue; const o = hnaFromHSL(h + hue, s, l); d[i] = o[0]; d[i + 1] = o[1]; d[i + 2] = o[2]; }
    x.putImageData(im, 0, 0); }
  return HNA.cache[key] = c; }
// atlas con las mismas animaciones que los humanos: idle 2, walk 4, atk 4, cast 2, hurt 1 (4 direcciones)
function hnaAtlas(spec) {
  const V = hnaViews(spec.k, spec.hue || 0, spec.hair), sc = spec.sc || 1, FW = Math.round(48 * sc), FH = Math.round(48 * sc), FWh = FW * 2, FHh = FH * 2;
  const set = ['idle', 'walk', 'atk', 'cast', 'hurt'], idx = {}; let N = 0; for (const a of set) { idx[a] = N; N += ANIMS[a][1]; }
  const hi = mkCanvas(FWh * N, FHh * 4), hx = hi.getContext('2d'); hx.imageSmoothingEnabled = false;
  const cw = Math.round(72 * sc), ch = Math.round(76 * sc), legY = Math.round(64 * sc), dirx = { down: 0, left: -1, right: 1, up: 0 }, diry = { down: 1, left: 0, right: 0, up: -1 };
  const tmp = mkCanvas(cw, ch), tx = tmp.getContext('2d'); tx.imageSmoothingEnabled = false;
  DIRS.forEach((dir, di) => {
    const vi = dir === 'down' ? 0 : dir === 'up' ? 1 : 2, flip = dir === 'right';
    tx.clearRect(0, 0, cw, ch); tx.save(); if (flip) { tx.translate(cw, 0); tx.scale(-1, 1); } tx.drawImage(V, vi * 72, 0, 72, 76, 0, 0, cw, ch); tx.restore();
    for (const a of set) for (let f = 0; f < ANIMS[a][1]; f++) {
      const ox = (idx[a] + f) * FWh, oy = di * FHh, bx = ox + (FWh - cw >> 1), by = oy + FHh - 8 - Math.round(74 * sc);
      let dx = 0, dy = 0, legL = 0, legR = 0;
      if (a === 'idle') dy = f ? -1 : 0;
      else if (a === 'walk') { dy = f % 2 ? -2 : 0; if (vi === 2) { legL = f === 1 ? 2 : f === 3 ? -2 : 0; } else { legL = f === 1 ? -2 : 0; legR = f === 3 ? -2 : 0; } }
      else if (a === 'atk') { const k = [0, 3, 6, 2][f]; dx = dirx[dir] * k; dy = diry[dir] * k * 0.6 - (f === 1 ? 2 : 0); }
      else if (a === 'cast') dy = -2 - f;
      else if (a === 'hurt') { dx = -dirx[dir] * 3; dy = -diry[dir] * 2; }
      dx = Math.round(dx); dy = Math.round(dy);
      // cuerpo sin piernas + piernas con su paso
      hx.drawImage(tmp, 0, 0, cw, legY, bx + dx, by + dy, cw, legY);
      if (vi === 2) hx.drawImage(tmp, 0, legY, cw, ch - legY, bx + dx + legL, by + dy + legY, cw, ch - legY);
      else { const hw = cw >> 1; hx.drawImage(tmp, 0, legY, hw, ch - legY, bx + dx, by + legY + Math.min(dy, 0) + legL, hw, ch - legY); hx.drawImage(tmp, hw, legY, cw - hw, ch - legY, bx + dx + hw, by + legY + Math.min(dy, 0) + legR, cw - hw, ch - legY); }
      if (a === 'hurt') { hx.save(); hx.globalCompositeOperation = 'source-atop'; hx.fillStyle = 'rgba(255,60,60,0.45)'; hx.fillRect(ox, oy, FWh, FHh); hx.restore(); }
      if (a === 'cast' || (a === 'atk' && f === 2)) { hx.save(); hx.globalCompositeOperation = 'source-atop'; hx.fillStyle = 'rgba(255,255,255,0.12)'; hx.fillRect(ox, oy, FWh, FHh); hx.restore(); }
    }
  });
  const img = mkCanvas(FW * N, FH * 4), ix = img.getContext('2d'); ix.imageSmoothingEnabled = true; ix.imageSmoothingQuality = 'high'; ix.drawImage(hi, 0, 0, img.width, img.height);
  return { img, hi, fw: FW, fh: FH, idx, ax: FW >> 1, ay: FH - 4, hna: 1 };
}
{ const _ab = atlasBlit; atlasBlit = function (c, A, col, row, x, y, w, h) { if (A.hi && HDS > 1) { c.drawImage(A.hi, col * A.fw * 2, row * A.fh * 2, A.fw * 2, A.fh * 2, x, y, w, h); return; } return _ab.apply(this, arguments); }; }
// reparto: cada cazador recibe un modelo de su sexo que encaje con su clase; los repetidos cambian de color
function hnaAssign() {
  const used = {};
  for (const h of HN) {
    const ks = []; for (let k = 0; k < HNA.meta.length; k++) if (HNA.meta[k] === h.g) ks.push(k);
    let c = ks.filter(k => (HNA_CLS[HNA.body[k]] || []).includes(h.cls)); if (!c.length) c = ks;
    c.sort((a, b) => (used[a] || 0) - (used[b] || 0) || ((a * 13 + h.i * 7) % 11) - ((b * 13 + h.i * 7) % 11));
    const k = c[0], n = used[k] = (used[k] || 0) + 1;
    const hue = n === 1 ? 0 : Math.round(((n * 97 + h.i * 41) % 300 + 30) / 15) * 15;
    const hair = (n > 1 || h.g === 'f') && h.i % 3 !== 0 ? HNA_TINT[1 + (h.i * 7 + n) % (HNA_TINT.length - 1)] : null;
    h.art = { k, hue, hair, sc: HNA_SCALE[h.body] || 1 };
  }
  for (const m of MON) { const s = HNA_MON[m.id]; if (s) m.art = Object.assign({ sc: HNA_SCALE[m.look.body] || 1 }, s); }
}
function hnaReady() {
  hnaAssign();
  for (const id in HN_ATL) delete HN_ATL[id];
  for (const e of G.ents) { const h = e.h || e.mon || (e.id && (HN.find(x => x.id === e.id) || MON.find(x => x.id === e.id))); if (h && h.art) e.atlas = hnAtlas(h); }
}
{ const _ha = hnAtlas; hnAtlas = function (h) { if (HNA.ok && h && h.art) return HN_ATL[h.id] || (HN_ATL[h.id] = hnaAtlas(h.art)); return _ha.apply(this, arguments); }; }
{ const im = new Image(); im.onload = () => { HNA.img = im; HNA.ok = true; try { hnaReady(); } catch (e) { console.warn(e); } }; im.src = HN_ART_SRC; }
// el rival del duelo usa el mismo dibujo
{ const _sm = spawnMob; spawnMob = function (id) { const m = _sm.apply(this, arguments); try { if (m && DUEL && id === DUEL.key) { const h = DUEL.o.h || MON.find(x => x.name === DUEL.o.name); if (h && HNA.ok && h.art) { m.atlas = hnAtlas(h); m.hum = true; } } } catch (e) { } return m; }; }

// ---------- Titán Carmesí detallado (referencia de Sergio) ----------
const TITAN = { img: null, atl: null };
function titanAtlas() {
  if (TITAN.atl) return TITAN.atl; const I = TITAN.img, W = I.width, H = I.height, FWh = W + 24, FHh = H + 24, FW = FWh >> 1, FH = FHh >> 1;
  const N = 10, hi = mkCanvas(FWh * N, FHh * 4), x = hi.getContext('2d'); x.imageSmoothingEnabled = false;
  const core = [W * 0.577, H * 0.405];
  for (let di = 0; di < 4; di++) for (const a in MOBANIM) for (let f = 0; f < MOBANIM[a][1]; f++) {
    const ox = (MOBANIM[a][0] + f) * FWh, oy = di * FHh; let dx = 0, dy = 0, sy = 1, glow = 0.25;
    if (a === 'idle') { dy = f ? -2 : 0; glow = f ? 0.55 : 0.3; }
    else if (a === 'walk') { dy = f % 2 ? -3 : 0; dx = [0, 2, 0, -2][f]; }
    else if (a === 'atk') { dy = [-6, 4, 0][f]; sy = [1.04, 0.94, 1][f]; glow = [0.7, 1, 0.4][f]; }
    else if (a === 'hurt') { dx = 3; glow = 0.1; }
    const h2 = Math.round(H * sy); x.drawImage(I, 0, 0, W, H, ox + 12 + dx, oy + FHh - 6 - h2 + dy, W, h2);
    const gx = ox + 12 + dx + core[0], gy = oy + FHh - 6 - h2 + dy + core[1] * sy;
    x.save(); x.globalCompositeOperation = 'lighter'; const g = x.createRadialGradient(gx, gy, 2, gx, gy, 30); g.addColorStop(0, `rgba(255,240,140,${glow})`); g.addColorStop(1, 'rgba(255,160,40,0)'); x.fillStyle = g; x.fillRect(gx - 32, gy - 32, 64, 64); x.restore();
    if (a === 'hurt') { x.save(); x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillRect(ox, oy, FWh, FHh); x.restore(); }
  }
  const img = mkCanvas(FW * N, FH * 4), ix = img.getContext('2d'); ix.imageSmoothingEnabled = true; ix.drawImage(hi, 0, 0, img.width, img.height);
  const idx = {}; for (const a in MOBANIM) idx[a] = MOBANIM[a][0];
  return TITAN.atl = { img, hi, fw: FW, fh: FH, idx, ax: FW >> 1, ay: FH - 4 };
}
{ const im = new Image(); im.onload = () => { TITAN.img = im; for (const e of G.ents) if (e.type === 'mob' && e.id === 'titan_carmesi') e.atlas = titanAtlas(); }; im.src = TITAN_ART_SRC; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[4] && art[4].hi === 'titan' && TITAN.img) return titanAtlas(); return _ma.apply(this, arguments); }; }
if (BOSSES.titan_carmesi) { BOSSES.titan_carmesi.art = BOSSES.titan_carmesi.art.slice(); BOSSES.titan_carmesi.art[4] = Object.assign({}, BOSSES.titan_carmesi.art[4], { hi: 'titan' }); BOSSES.titan_carmesi.r = 38; }

// ---------- Navidad con nieve: del día 1 al 7 del último mes y el 1 de Año Nuevo ----------
function xmasSnow() { if (!G.P || !G.P.cal) return false; const D = calDate(); return (D.m === 11) || (D.m === 0 && D.day <= 1); }
{ const _cw = curWx; curWx = function () { const w = _cw.apply(this, arguments); if (G.P && G.P.wstate && SETTINGS.weather && G.map && G.map.isWorld && xmasSnow()) { const r = regionWx('snow'); return r === 'snow' ? 'snow' : w; } return w; }; }
const SNOWCH = new WeakMap();
function snowChunk(cv) {
  let s = SNOWCH.get(cv); if (s) return s; s = mkCanvas(cv.width, cv.height); const x = s.getContext('2d'); x.drawImage(cv, 0, 0);
  const im = x.getImageData(0, 0, s.width, s.height), d = im.data, W = s.width;
  for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2]; if (!d[i + 3]) continue;
    if (b > r + 18 && b > g - 6) continue;                 // agua: se queda
    if (r > 150 && g < 110) continue;                       // lava, flores rojas
    const l = (r * 0.3 + g * 0.59 + b * 0.11) / 255, p = i >> 2, px = p % W, py = p / W | 0, n = ((px * 73856093) ^ (py * 19349663)) >>> 0;
    const m = 0.78 + ((n % 7) / 40), v = 200 + l * 70 + ((n >> 3) % 5 === 0 ? 6 : 0);
    d[i] = r * (1 - m) + (v - 14) * m; d[i + 1] = g * (1 - m) + (v - 6) * m; d[i + 2] = b * (1 - m) + Math.min(255, v + 10) * m; }
  x.putImageData(im, 0, 0); SNOWCH.set(cv, s); return s; }
{ const _gc = getChunk; let budget = 0, lastF = -1; getChunk = function (M, cx, cy) { const c = _gc.apply(this, arguments); if (!c || !M.isWorld || !xmasSnow()) return c; const s = SNOWCH.get(c); if (s) return s; if (G.frame !== lastF) { lastF = G.frame; budget = 3; } if (budget-- <= 0) return c; return snowChunk(c); }; }
let XMAS_WAS = false;
V33_TICKS.push(() => { const on = xmasSnow(); if (on !== XMAS_WAS) { XMAS_WAS = on; if (on && G.map && G.map.isWorld) toast(L2('❄ Nieva por Navidad: todo el mundo se cubre de blanco', '❄ Christmas snow: the whole world turns white'), 'quest', 5); } });
