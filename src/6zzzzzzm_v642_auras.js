// ================= 6.42: AURAS DE TRANSFORMACIÓN, DESTELLO AL TRANSFORMARSE Y POSE DEL ENGRANAJE 2 =================
// Sergio pidió un aura para cada forma y fusión (solo transformado), un destello de 0,45 s al transformarse que
// desaparece solo y un botón para apagar el aura. Referencias que mandó: Dorado = aura de llamas en punta con el centro
// blanco; Alado = aura angelical (alas de luz celeste y columna blanca); Fantasma = niebla espectral con fantasmitas;
// Engranaje 2 = al transformarse se agacha (piernas flexionadas, una mano en la rodilla y el puño en el suelo) con vapor.
// Después pidió que se vieran «más realistas, como las fotos, en pixel art avanzado y animado»: cada aura se PRE-RENDERIZA
// en TRB_N fotogramas que hacen un bucle de TRB_LOOP s (luz que se suma «lighter», brillo desenfocado y detalle nítido) y
// luego se pasa a pixel art (alfa en niveles con tramado Bayer, color en 16 tonos). En el juego solo se copia el
// fotograma: barato, en capa separada del sprite, DETRÁS del personaje. Caché limitada (TRB_MAX auras), fotograma a fotograma.
// 🌀 Transformaciones › «Aura: sí/no» la apaga (P.trAuraOff; también para los demás en el online, gear.na).
// Forma nueva: TR_AURA[clave] = { mode: 'lighter' | 'source-over', blur, glow(c, X, Y, p, F), det(c, X, Y, p, F) } con
// p ∈ [0, 1) del bucle (usa solo ciclos enteros de p para que el bucle no salte) y TR_FLASH[clave] = (x, y, u).
// Fusiones: 'fus_dh' (Dragón de Hielo), 'fus_bf' (Boceto de Fuego), 'fus_an' (Ángel de Niebla).
const TR_AURA = {}, TR_FLASH = {}, TRF_DUR = 0.45, TR_POSE_DUR = 1.1, TAU = Math.PI * 2;
const TRB_W = 128, TRB_H = 156, TRB_FY = 136, TRB_N = 20, TRB_LOOP = 2, TRB_MAX = 8;
const trR = Math.round, trPh = (p, k, n) => ((p * (n || 1) + k * 0.6180339) % 1 + 1) % 1, trS = (p, n, o) => Math.sin(TAU * (p * n + (o || 0)));
const trHash = k => { const s = Math.sin(k * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- ayudantes de dibujo (c = contexto: el del pre-render o el del mundo) ----------
function trGlowE(c, x, y, rx, ry, rgb, a, a0) { c.save(); c.translate(x, y); c.scale(rx / ry, 1); const g = c.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, `rgba(${rgb},${a0 === undefined ? a : a0})`); g.addColorStop(0.55, `rgba(${rgb},${a * 0.6})`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.beginPath(); c.arc(0, 0, ry, 0, TAU); c.fill(); c.restore(); }
function trColumn(c, x, y, h, rgb, a, w) { const g = c.createLinearGradient(x - w, 0, x + w, 0); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(0.5, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.fillRect(x - w, y - h, w * 2, h + 4); }
// silueta de llamas en punta (aura dorada): puntas más largas arriba, base estrecha
function trSpikePath(c, x, y, h, w, n, p, seed, sp) { const cy = y - h * 0.44; c.beginPath();
  for (let i = 0; i <= n * 2; i++) { const s = i / (n * 2), a = Math.PI / 2 + s * TAU, top = Math.max(0, -Math.sin(a)), tip = i % 2, fl = 0.7 + 0.3 * trS(p, sp || 3, trHash(i + seed)), spike = tip ? (0.1 + top * 0.6) * fl : 0, rr = 1 + spike;
    let px = x + Math.cos(a) * w * rr, py = cy + Math.sin(a) * h * 0.56 * rr; if (tip) { py -= spike * h * 0.38; px += Math.cos(a) * spike * 3; } if (Math.sin(a) > 0.55) px = x + (px - x) * (1 - (Math.sin(a) - 0.55) * 0.9); i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); }
function trBolt(c, px, py, dx, seed, n) { c.beginPath(); c.moveTo(px, py); for (let s = 0; s < n; s++) { px += dx + (trHash(seed + s) - 0.5) * 8; py += 4 + trHash(seed * 3 + s) * 4; c.lineTo(px, py); } c.stroke(); }
function trGhost(c, gx, gy, s, a, p, k) { const w = trS(p, 2, k * 0.3) * 1.3; c.fillStyle = `rgba(232,246,248,${a})`; c.beginPath(); c.arc(gx, gy, 3.6 * s, Math.PI, 0);
  c.lineTo(gx + 3.6 * s, gy + 4 * s); c.quadraticCurveTo(gx + 2.4 * s + w, gy + 7 * s, gx + 1 * s, gy + 5.2 * s); c.quadraticCurveTo(gx + w, gy + 8.5 * s, gx - 1 * s, gy + 5.6 * s); c.quadraticCurveTo(gx - 2.6 * s + w, gy + 7.4 * s, gx - 3.6 * s, gy + 4 * s); c.closePath(); c.fill();
  c.fillStyle = `rgba(232,246,248,${a * 0.3})`; c.beginPath(); c.ellipse(gx + w * 1.5, gy + 8.5 * s, 2.2 * s, 3 * s, 0, 0, TAU); c.fill();
  c.fillStyle = `rgba(36,18,56,${Math.min(1, a * 1.25)})`; c.beginPath(); c.ellipse(gx - 1.4 * s, gy - 0.2 * s, 0.75 * s, 1.15 * s, 0, 0, TAU); c.ellipse(gx + 1.4 * s, gy - 0.2 * s, 0.75 * s, 1.15 * s, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(gx, gy + 2.4 * s, 0.8 * s, 1.4 * s, 0, 0, TAU); c.fill(); }
function trBat(c, px, py, p, k, col) { const fl = trS(p, 6, k * 0.25); c.fillStyle = col; c.beginPath(); c.moveTo(px - 1, py); c.lineTo(px - 5.5, py - 2.4 * fl - 1); c.lineTo(px - 3.4, py + 1.2); c.lineTo(px - 1.6, py + 0.6); c.lineTo(px, py + 2.2); c.lineTo(px + 1.6, py + 0.6); c.lineTo(px + 3.4, py + 1.2); c.lineTo(px + 5.5, py - 2.4 * fl - 1); c.lineTo(px + 1, py); c.lineTo(px + 1, py - 1.6); c.lineTo(px - 1, py - 1.6); c.closePath(); c.fill(); }
function trFeather(c, px, py, a, al, c1, c2) { c.save(); c.translate(px, py); c.rotate(a); c.fillStyle = c1.replace('A', al); c.beginPath(); c.ellipse(0, 0, 1.8, 4.8, 0, 0, TAU); c.fill(); c.fillStyle = c2.replace('A', al); c.fillRect(-0.35, -4.2, 0.7, 9); c.restore(); }
function trCrystal(c, px, py, s, front) { c.fillStyle = front ? 'rgba(226,248,255,0.95)' : 'rgba(168,224,255,0.45)'; c.beginPath(); c.moveTo(px, py - s * 1.7); c.lineTo(px + s * 0.75, py); c.lineTo(px, py + s * 1.7); c.lineTo(px - s * 0.75, py); c.closePath(); c.fill();
  if (front) { c.fillStyle = 'rgba(110,180,236,0.9)'; c.beginPath(); c.moveTo(px, py - s * 1.7); c.lineTo(px + s * 0.75, py); c.lineTo(px, py + s * 1.7); c.closePath(); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(trR(px) - 1, trR(py - s), 1, 2); } }
function trSnow(c, px, py, a) { c.fillStyle = `rgba(255,255,255,${a})`; c.fillRect(px - 1, py, 3, 1); c.fillRect(px, py - 1, 1, 3); }
function trPuff(c, px, py, r, a, rgb) { c.fillStyle = `rgba(${rgb || '255,242,238'},${a})`; c.beginPath(); c.arc(px, py, r, 0, TAU); c.arc(px + r * 0.8, py + r * 0.2, r * 0.7, 0, TAU); c.arc(px - r * 0.7, py + r * 0.3, r * 0.6, 0, TAU); c.fill(); }
// lenguas de fuego realistas: cols = [exterior, medio, núcleo]; cada lengua sube, se estrecha y se suelta arriba
function trFire(c, x, y, p, n, hgt, wid, cols, ink) { for (let k = 0; k < n; k++) { const u = n > 1 ? k / (n - 1) : 0.5, sd = u < 0.5 ? -1 : 1, bx = x + sd * (7 + Math.abs(u - 0.5) * 2 * wid), mid = 1 - Math.abs(u - 0.5) * 2, fh = hgt * (0.55 + mid * 0.45) * (0.78 + 0.22 * trS(p, 4, trHash(k))), sw = trS(p, 3, trHash(k + 9)) * 2.6;
  for (let L = 0; L < 3; L++) { const s = [1, 0.68, 0.38][L]; c.fillStyle = cols[L]; c.beginPath(); c.moveTo(bx - 4.5 * s, y + 3); c.bezierCurveTo(bx - 5 * s, y - fh * s * 0.45, bx + sw * 0.5 - 2 * s, y - fh * s * 0.8, bx + sw, y - fh * s); c.bezierCurveTo(bx + sw * 0.5 + 2 * s, y - fh * s * 0.75, bx + 5 * s, y - fh * s * 0.4, bx + 4.5 * s, y + 3); c.fill(); if (ink && !L) { c.strokeStyle = ink; c.lineWidth = 1; c.stroke(); } }
  const ph = trPh(p, k, 2); c.fillStyle = cols[2]; c.beginPath(); c.ellipse(bx + sw, y - fh - ph * 10, 1.4 * (1 - ph), 2.2 * (1 - ph), 0, 0, TAU); c.fill(); } }
function trEmbers(c, x, y, p, n, h, w, colf, m) { for (let k = 0; k < n; k++) { const ph = trPh(p, k, m || 2), px = x + (trHash(k) - 0.5) * 2 * w + trS(p, 2, trHash(k + 3)) * 3 * ph; c.fillStyle = colf(k, ph); c.fillRect(trR(px), trR(y - 6 - ph * h), 1, ph < 0.5 ? 2 : 1); } }
// alas de luz: plumas de luz que salen de la espalda y se curvan hacia arriba (referencia angelical)
function trWingFill(c, x, y, sz, p, rgbA, rgbB, a) { for (const sd of [-1, 1]) { const ox = x + sd * 3, oy = y - 27, fl = trS(p, 1) * 2;
  const g = c.createLinearGradient(ox, oy, ox + sd * 34 * sz, oy - 22 * sz); g.addColorStop(0, `rgba(${rgbA},${a})`); g.addColorStop(1, `rgba(${rgbB},0)`); c.fillStyle = g; c.beginPath(); c.moveTo(ox, oy + 2);
  c.bezierCurveTo(ox + sd * 14 * sz, oy - 32 * sz - fl, ox + sd * 38 * sz, oy - 28 * sz - fl, ox + sd * 33 * sz, oy - 4 * sz); c.bezierCurveTo(ox + sd * 30 * sz, oy + 16 * sz, ox + sd * 17 * sz, oy + 28 * sz, ox + sd * 4, oy + 20); c.closePath(); c.fill(); } }
function trWingLines(c, x, y, sz, p, col1, col2, n) { c.lineWidth = 1; for (const sd of [-1, 1]) { const ox = x + sd * 3, oy = y - 27, fl = trS(p, 1) * 2;
  for (let k = 0; k < n; k++) { const q = k / (n - 1), ex = ox + sd * (10 + q * 25) * sz, ey = oy - (26 - q * 12) * sz - fl * (1 - q) + trS(p, 2, k * 0.13) * 1.5; c.strokeStyle = k % 2 ? col2 : col1; c.beginPath(); c.moveTo(ox, oy + 4 + q * 12); c.quadraticCurveTo(ox + sd * (6 + q * 11) * sz, oy - 20 * sz + q * 9, ex, ey); c.quadraticCurveTo(ex + sd * 3, ey + 9 + q * 7, ex - sd * (2 + q * 5), ey + 16 + q * 11); c.stroke(); } } }

// ---------- pre-render en pixel art ----------
const TRB_CACHE = new Map(), TRB_WK = mkCanvas(TRB_W, TRB_H), TRB_GL = mkCanvas(TRB_W, TRB_H), TRB_BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function trBake(key, F) { const id = key + '|' + F; let b = TRB_CACHE.get(id); if (b) { TRB_CACHE.delete(id); TRB_CACHE.set(id, b); return b; }
  if (TRB_CACHE.size >= TRB_MAX) TRB_CACHE.delete(TRB_CACHE.keys().next().value); b = { cv: mkCanvas(TRB_W * TRB_N, TRB_H), done: new Uint8Array(TRB_N) }; TRB_CACHE.set(id, b); return b; }
function trBakeFrame(D, b, i, F) { const p = i / TRB_N, X = TRB_W / 2, Y = TRB_FY, wc = TRB_WK.getContext('2d'), gc = TRB_GL.getContext('2d');
  wc.setTransform(1, 0, 0, 1, 0, 0); wc.globalCompositeOperation = 'source-over'; wc.globalAlpha = 1; wc.clearRect(0, 0, TRB_W, TRB_H);
  if (D.glow) { gc.setTransform(1, 0, 0, 1, 0, 0); gc.globalCompositeOperation = 'source-over'; gc.clearRect(0, 0, TRB_W, TRB_H); gc.globalCompositeOperation = D.mode; D.glow(gc, X, Y, p, F); gc.globalCompositeOperation = 'source-over';
    wc.globalCompositeOperation = D.mode; try { wc.filter = `blur(${D.blur || 3}px)`; } catch (e) { } wc.drawImage(TRB_GL, 0, 0); try { wc.filter = 'none'; } catch (e) { } wc.globalAlpha = 0.55; wc.drawImage(TRB_GL, 0, 0); wc.globalAlpha = 1; }
  wc.globalCompositeOperation = D.mode; if (D.det) D.det(wc, X, Y, p, F); wc.globalCompositeOperation = 'source-over';
  const im = wc.getImageData(0, 0, TRB_W, TRB_H), d = im.data, L = D.levels || 6;
  for (let y = 0, k = 0; y < TRB_H; y++) for (let x = 0; x < TRB_W; x++, k += 4) { const a = d[k + 3]; if (!a) continue; const q = Math.floor(a / 255 * L + TRB_BAYER[(y & 3) * 4 + (x & 3)] / 16); d[k + 3] = q <= 0 ? 0 : Math.min(255, q * 255 / L | 0); d[k] = d[k] & 0xf0 | 8; d[k + 1] = d[k + 1] & 0xf0 | 8; d[k + 2] = d[k + 2] & 0xf0 | 8; }
  b.cv.getContext('2d').putImageData(im, i * TRB_W, 0); b.done[i] = 1; }
function trAuraDraw(key, x, y, t, F) { const D = TR_AURA[key]; if (!D) return; const b = trBake(key, F), i = Math.floor((((t / TRB_LOOP) % 1) + 1) % 1 * TRB_N) % TRB_N; if (!b.done[i]) trBakeFrame(D, b, i, F);
  ctx.imageSmoothingEnabled = false; const add = D.mode === 'lighter' ? (D.add === undefined ? 0.4 : D.add) : 0, sx = i * TRB_W, dx = x - TRB_W / 2, dy = y - TRB_FY;
  if (add < 1) ctx.drawImage(b.cv, sx, 0, TRB_W, TRB_H, dx, dy, TRB_W, TRB_H); if (add > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = add; ctx.drawImage(b.cv, sx, 0, TRB_W, TRB_H, dx, dy, TRB_W, TRB_H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; } }

// ================= AURAS =================
// Despertar Dorado: llamas en punta (dos capas), núcleo blanco, chispas que suben; fases 2 y 3 con rayos azules
TR_AURA.dorado = { mode: 'lighter', add: 1, blur: 3, levels: 7,
  glow: (c, X, Y, p, F) => { const h = F === 3 ? 74 : F === 2 ? 64 : 52, w = F === 3 ? 23 : F === 2 ? 20 : 17, al = F === 1 ? 0.75 : 1;
    trGlowE(c, X, Y - h * 0.42, w * 1.9, h * 0.8, '255,190,30', 0.28 * al, 0.1);
    trSpikePath(c, X, Y, h * 1.1, w * 1.15, F === 3 ? 13 : 11, p, 0, 3); c.fillStyle = `rgba(255,196,24,${0.55 * al})`; c.fill();
    trSpikePath(c, X, Y, h * 0.95, w * 0.98, F === 3 ? 12 : 10, p, 5, 4); c.fillStyle = `rgba(255,236,110,${0.55 * al})`; c.fill();
    trGlowE(c, X, Y - h * 0.38, w * 0.9, h * 0.5, '255,255,230', 0.35 * al); },
  det: (c, X, Y, p, F) => { const h = F === 3 ? 74 : F === 2 ? 64 : 52, w = F === 3 ? 23 : F === 2 ? 20 : 17, al = F === 1 ? 0.75 : 1;
    trSpikePath(c, X, Y, h * 1.1, w * 1.15, F === 3 ? 13 : 11, p, 0, 3); c.strokeStyle = `rgba(255,232,90,${0.75 * al})`; c.lineWidth = 1; c.stroke();
    trSpikePath(c, X, Y, h * 0.95, w * 0.98, F === 3 ? 12 : 10, p, 5, 4); c.strokeStyle = `rgba(255,255,220,${0.7 * al})`; c.stroke();
    for (let k = 0; k < (F === 3 ? 16 : F === 2 ? 11 : 6); k++) { const ph = trPh(p, k, 3), px = X + (trHash(k) - 0.5) * w * 2.4; c.fillStyle = `rgba(255,252,220,${1 - ph})`; c.fillRect(trR(px), trR(Y - ph * h * 1.2), 1, 3 + (k % 2)); }
    c.strokeStyle = `rgba(255,255,240,${0.45 * al})`; for (let k = 0; k < (F === 3 ? 4 : 2); k++) { c.beginPath(); for (let u = 0; u <= 1.001; u += 0.07) { const yy = Y - u * h, xx = X + Math.sin(u * 9 + k * 2.1 + TAU * p * 2) * w * 0.75 * (1 - u * 0.4); u ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); }
    if (F >= 2) { const on = Math.floor(p * TRB_N); if (on % (F === 3 ? 2 : 4) === 0) { c.strokeStyle = 'rgba(200,244,255,0.95)'; c.lineWidth = 1.2; for (let k = 0; k < (F === 3 ? 3 : 1); k++) trBolt(c, X + ((on + k) % 2 ? 13 : -13), Y - 42 - k * 8, (on + k) % 2 ? 4 : -4, on * 7 + k, 5); } } } };
// Tejedor Primordial: bruma de tinta, hilos blancos en espiral, puntadas, manchas que suben y rueda del telar (plena)
TR_AURA.tejedor = { mode: 'source-over', blur: 4, levels: 6,
  glow: (c, X, Y, p, F) => { const h = F === 2 ? 60 : 48; trGlowE(c, X, Y - 22, h * 0.48, h * 0.75, '14,12,22', 0.5, 0.05); for (let k = 0; k < 4; k++) { const ph = trPh(p, k, 1); trGlowE(c, X + (trHash(k) - 0.5) * 40, Y - 10 - ph * 50, 6, 6, '10,8,16', 0.5 * (1 - ph)); } },
  det: (c, X, Y, p, F) => { const h = F === 2 ? 60 : 48, n = F === 2 ? 4 : 3; c.lineWidth = 1;
    for (let k = 0; k < n; k++) { let last = null; for (let u = 0; u <= 1.001; u += 0.035) { const a = u * 9 + TAU * p * 2 + k * (TAU / n), rx = h * 0.37 * (1 - u * 0.35), px = X + Math.cos(a) * rx, py = Y + 2 - u * h * 1.05 + Math.sin(a) * 3;
      if (last) { c.strokeStyle = Math.sin(a) > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(228,221,207,0.3)'; c.beginPath(); c.moveTo(last[0], last[1]); c.lineTo(px, py); c.stroke(); } last = [px, py]; } }
    for (let k = 0; k < (F === 2 ? 10 : 6); k++) { const ph = trPh(p, k, 1), px = trR(X + (trHash(k + 4) - 0.5) * h * 0.85), py = trR(Y - 4 - ph * h * 1.1); c.fillStyle = `rgba(255,255,255,${(1 - ph) * 0.9})`; c.fillRect(px, py, 1, 3); c.fillRect(px + 2, py + 1, 1, 2); }
    if (F === 2) for (let k = 0; k < 16; k++) { const a = TAU * p + k * TAU / 16; c.fillStyle = k % 2 ? 'rgba(246,242,234,0.9)' : 'rgba(216,184,72,0.85)'; c.fillRect(trR(X + Math.cos(a) * 18) - 1, trR(Y + 2 + Math.sin(a) * 6), 3, 1); } } };
// Mitad Lobo: luna detrás, halo plateado, viento que gira, zarpazos de luz, motas y polvo
TR_AURA.lobo = { mode: 'lighter', blur: 3, levels: 6,
  glow: (c, X, Y, p, F) => { const q = F === 2; trGlowE(c, X, Y - (q ? 14 : 22), q ? 30 : 22, q ? 24 : 34, '150,170,220', 0.35, 0.05); trGlowE(c, X + (q ? 14 : 10), Y - (q ? 36 : 52), 13, 13, '220,230,255', 0.55);
    for (let k = 0; k < 3; k++) { c.strokeStyle = 'rgba(190,206,240,0.5)'; c.lineWidth = 2; const a0 = TAU * p * (k + 1) + k * 2; c.beginPath(); c.ellipse(X, Y - 2 - k * 5, (q ? 30 : 20) + k * 2, 4 + k, 0, a0, a0 + 1.7); c.stroke(); } },
  det: (c, X, Y, p, F) => { const q = F === 2, w = q ? 30 : 20, mx = X + (q ? 14 : 10), my = Y - (q ? 36 : 52);
    c.fillStyle = 'rgba(246,248,255,0.95)'; c.beginPath(); c.arc(mx, my, 4.4, 0.75, 5.55, false); c.arc(mx + 2.2, my - 0.8, 3.4, 4.9, 1.2, true); c.closePath(); c.fill();
    c.lineWidth = 1; for (let k = 0; k < 5; k++) { const a0 = TAU * p * (1 + (k % 2)) + k * 1.26; c.strokeStyle = `rgba(232,238,252,${0.35 + 0.45 * (k % 2)})`; c.beginPath(); c.ellipse(X, Y - 1 - k * 4, w + k * 2, 4 + k, 0, a0, a0 + 1.5); c.stroke(); }
    const fr = Math.floor(p * TRB_N); if (fr % 10 < 3) { const v = (fr % 10) / 3, cxx = X + (fr < 10 ? 17 : -17); c.strokeStyle = `rgba(240,246,255,${1 - v * 0.6})`; c.lineWidth = 1; for (let s = 0; s < 3; s++) { c.beginPath(); c.moveTo(cxx - 5 + s * 3, Y - 36 + s); c.quadraticCurveTo(cxx + s * 3, Y - 25, cxx + 3 + s * 3, Y - 12 - v * 4); c.stroke(); } }
    for (let k = 0; k < 10; k++) { const ph = trPh(p, k, 1), px = trR(X + (trHash(k) - 0.5) * w * 2), py = trR(Y - 6 - ph * 48); c.fillStyle = `rgba(240,244,255,${1 - ph})`; c.fillRect(px, py, 1, 1); if (k % 3 === 0) { c.fillRect(px - 1, py + 1, 3, 1); c.fillRect(px, py + 2, 1, 1); } } } };
// Mitad Fantasma: niebla de luna verde azulada, estelas que suben y fantasmitas con cara que giran
TR_AURA.fantasma = { mode: 'source-over', blur: 4, levels: 6,
  glow: (c, X, Y, p, F) => { c.globalCompositeOperation = 'lighter'; trGlowE(c, X, Y - 22, 26, 40, '120,200,190', 0.5, 0.05);
    for (let k = 0; k < 8; k++) { const px = X + Math.sin(k * 2.3 + TAU * p) * 22, py = Y + 1 - (k % 3) * 2; trGlowE(c, px, py, 13 + (k % 3) * 2, 4, '190,236,230', 0.45); }
    for (let k = 0; k < 5; k++) { const ph = trPh(p, k, 1); trGlowE(c, X + (trHash(k) - 0.5) * 36, Y - 6 - ph * 52, 4, 8, '200,240,236', 0.35 * (1 - ph)); } },
  det: (c, X, Y, p, F) => { const n = 4; for (let k = 0; k < n; k++) { const a = TAU * p + k * TAU / n, front = Math.sin(a) > 0, gx = X + Math.cos(a) * 25, gy = Y - 30 + Math.sin(a) * 6 + trS(p, 3, k * 0.27) * 3, s = front ? 1.4 : 1;
      for (let q = 1; q < 5; q++) { const b = a - q * 0.16; c.fillStyle = `rgba(220,244,240,${(front ? 0.3 : 0.12) * (1 - q / 5)})`; c.beginPath(); c.arc(X + Math.cos(b) * 25, Y - 25 + Math.sin(b) * 6 + trS(p, 3, k * 0.27) * 3, 3.2 * s, 0, TAU); c.fill(); }
      trGhost(c, gx, gy, s, front ? 0.9 : 0.45, p, k); }
    for (let k = 0; k < 4; k++) { const ph = trPh(p, k, 1), px = X + (trHash(k + 7) - 0.5) * 34, py = Y - 6 - ph * 54; c.strokeStyle = `rgba(214,242,238,${0.45 * (1 - ph)})`; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py + 9); c.quadraticCurveTo(px + 4 * trS(p, 1, k * 0.2), py + 4, px, py); c.stroke(); } } };
// Mitad Vampiro: bruma carmesí, llamas oscuras, remolino de sangre, murciélagos de ojos rojos y gotas
TR_AURA.vampiro = { mode: 'source-over', blur: 3, levels: 6,
  glow: (c, X, Y, p, F) => { trGlowE(c, X, Y - 22, 28, 42, '120,8,28', 0.65, 0.06); trFire(c, X, Y, p, 8, 40, 16, ['rgba(70,4,18,0.6)', 'rgba(150,14,36,0.55)', 'rgba(230,50,70,0.6)']); },
  det: (c, X, Y, p, F) => { c.lineWidth = 1.2; for (let k = 0; k < 3; k++) { const a0 = -TAU * p * (k + 1) + k * 2.09; c.strokeStyle = k % 2 ? 'rgba(210,24,44,0.8)' : 'rgba(120,8,24,0.8)'; c.beginPath(); c.ellipse(X, Y + 1 - k * 2, 16 + k * 3, 4 + k, 0, a0, a0 + 2); c.stroke(); }
    for (let k = 0; k < 4; k++) { const a = TAU * p + k * TAU / 4, px = X + Math.cos(a) * (21 + (k % 2) * 4), py = Y - 34 - (k % 2) * 6 + Math.sin(a) * 5 + trS(p, 4, k * 0.3) * 2, fr = Math.sin(a) > 0; c.save(); c.translate(px, py); c.scale(1.4, 1.4); trBat(c, 0, 0, p, k, fr ? '#16040c' : 'rgba(40,8,20,0.5)'); c.restore(); if (fr) { c.fillStyle = '#ff3a4a'; c.fillRect(trR(px) - 1, trR(py) - 1, 1, 1); c.fillRect(trR(px) + 1, trR(py) - 1, 1, 1); } }
    for (let k = 0; k < 8; k++) { const ph = trPh(p, k, 1), px = trR(X + (trHash(k) - 0.5) * 32), py = trR(Y - ph * 54); c.fillStyle = `rgba(220,30,52,${1 - ph})`; c.fillRect(px, py, 1, 2); c.fillStyle = `rgba(255,120,130,${1 - ph})`; c.fillRect(px, py, 1, 1); } } };
// Mitad Dragón: fuego de verdad (tres capas), calor, brasas; 2.0 más grande y con chispas azules
TR_AURA.dragon = { mode: 'lighter', blur: 3, levels: 7,
  glow: (c, X, Y, p, F) => { const big = F >= 2; trGlowE(c, X, Y - 24, big ? 32 : 26, big ? 46 : 38, '230,60,0', 0.5, 0.05); trFire(c, X, Y, p, big ? 11 : 8, big ? 56 : 44, big ? 18 : 15, ['rgba(220,40,0,0.7)', 'rgba(255,120,10,0.65)', 'rgba(255,210,90,0.7)']); },
  det: (c, X, Y, p, F) => { const big = F >= 2; trFire(c, X, Y, p, big ? 11 : 8, big ? 50 : 40, big ? 18 : 15, ['rgba(240,70,0,0.45)', 'rgba(255,160,30,0.5)', 'rgba(255,240,170,0.75)']);
    trEmbers(c, X, Y, p, big ? 18 : 12, big ? 72 : 60, 22, (k, ph) => (big && k % 3 === 0) ? `rgba(150,215,255,${1 - ph})` : `rgba(255,${trR(220 - ph * 140)},70,${1 - ph})`); } };
// Alado Caído: aura angelical (alas de luz celeste, columna blanca, brillo del cuerpo, plumas y chispas)
TR_AURA.alado = { mode: 'lighter', blur: 4, levels: 7,
  glow: (c, X, Y, p, F) => { const sz = F === 2 ? 1.2 : 1; trColumn(c, X, Y + 4, 100 * sz, '230,252,255', 0.6, 8); trGlowE(c, X, Y - 26, 30 * sz, 48 * sz, '110,200,245', 0.5, 0.12); trWingFill(c, X, Y, sz, p, '190,238,255', '70,170,235', 0.75); trGlowE(c, X, Y - 18, 12, 22, '240,255,255', 0.6); },
  det: (c, X, Y, p, F) => { const sz = F === 2 ? 1.2 : 1; trWingLines(c, X, Y, sz, p, 'rgba(255,255,255,0.8)', 'rgba(130,220,250,0.75)', 8);
    for (let k = 0; k < (F === 2 ? 7 : 5); k++) { const ph = trPh(p, k, 1), px = X + (trHash(k) - 0.5) * 52 + trS(p, 1, k * 0.2) * 4, py = Y - 66 * sz + ph * 68 * sz; trFeather(c, px, py, trS(p, 1, k * 0.17) * 0.8, Math.min(1, (1 - ph) * 1.6), 'rgba(255,255,255,A)', 'rgba(140,210,235,A)'); }
    for (let k = 0; k < 8; k++) { const ph = trPh(p, k + 3, 2); c.fillStyle = `rgba(230,252,255,${1 - ph})`; c.fillRect(trR(X + (trHash(k + 9) - 0.5) * 22), trR(Y - ph * 76 * sz), 1, 2); } } };
// Eco sin Pintar: trazos de lápiz que se redibujan, rayado del suelo, manchas de tinta y pinceladas
TR_AURA.eco = { mode: 'source-over', blur: 3, levels: 5,
  glow: (c, X, Y, p, F) => { trGlowE(c, X, Y - 20, 24, 36, '200,198,190', 0.25, 0.02); },
  det: (c, X, Y, p, F) => { const fr = Math.floor(p * TRB_N / 2), n = F === 2 ? 3 : 2; c.lineWidth = 1;
    for (let k = 0; k < n; k++) { c.strokeStyle = k ? 'rgba(60,58,70,0.55)' : 'rgba(26,24,36,0.85)'; c.beginPath(); for (let s = 0; s <= 28; s++) { const a = s / 28 * 6.5 + k, j = (trHash(fr * 31 + s * 7 + k * 101) - 0.5) * 4.5, px = X + Math.cos(a) * (18 + k * 3 + j), py = Y - 20 + Math.sin(a) * (28 + k * 3 + j); s ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
    c.strokeStyle = 'rgba(40,38,50,0.4)'; for (let k = 0; k < 8; k++) { const hx = X - 20 + k * 5.5 + (fr % 2); c.beginPath(); c.moveTo(hx, Y + 5); c.lineTo(hx + 4, Y + 1); c.stroke(); }
    for (let k = 0; k < (F === 2 ? 6 : 4); k++) { const ph = trPh(p, k, 1); if (ph > 0.7) continue; const px = X + (trHash(k + Math.floor(p + k * 0.618)) - 0.5) * 50, py = Y - 22 + (trHash(k * 5 + 1) - 0.5) * 50, r = 1.5 + ph * 3.5;
      c.fillStyle = k % 2 ? `rgba(242,240,234,${0.95 - ph})` : `rgba(18,18,26,${0.95 - ph})`; c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill(); for (let q = 0; q < 5; q++) { const b = q * 1.3 + k; c.fillRect(trR(px + Math.cos(b) * (r + 2)), trR(py + Math.sin(b) * (r + 2)), 1, 1); } }
    for (let k = 0; k < (F === 2 ? 3 : 2); k++) { const ph = trPh(p, k, 1), px = X + (k % 2 ? 1 : -1) * (15 + ph * 6), py = Y - 10 - ph * 42; c.strokeStyle = `rgba(18,18,26,${0.85 * (1 - ph)})`; c.lineWidth = 2.5; c.beginPath(); c.moveTo(px - 4, py + 2); c.quadraticCurveTo(px, py - 2, px + 4, py + 1); c.stroke(); c.lineWidth = 1; } } };
// Guardián de Hielo: frío azul, copo de escarcha en el suelo, cristales con caras que giran, copos; 2.0 con picos
TR_AURA.hielo = { mode: 'lighter', blur: 3, levels: 7,
  glow: (c, X, Y, p, F) => { const big = F >= 2; trGlowE(c, X, Y - 22, big ? 28 : 24, big ? 42 : 36, '110,190,255', 0.6, 0.08); trGlowE(c, X, Y + 1, 24, 7, '180,235,255', 0.6); },
  det: (c, X, Y, p, F) => { const big = F >= 2; c.strokeStyle = 'rgba(210,244,255,0.7)'; c.lineWidth = 1; c.beginPath(); c.ellipse(X, Y + 1, 20, 6, 0, 0, TAU); c.stroke();
    for (let k = 0; k < 6; k++) { const a = k * TAU / 6 + TAU * p / 6, ex = X + Math.cos(a) * 20, ey = Y + 1 + Math.sin(a) * 6; c.beginPath(); c.moveTo(X + Math.cos(a) * 7, Y + 1 + Math.sin(a) * 2); c.lineTo(ex, ey); c.stroke(); const mx = X + Math.cos(a) * 14, my = Y + 1 + Math.sin(a) * 4.2; c.beginPath(); c.moveTo(mx + Math.cos(a + 1) * 3, my + Math.sin(a + 1)); c.lineTo(mx, my); c.lineTo(mx + Math.cos(a - 1) * 3, my + Math.sin(a - 1)); c.stroke(); }
    if (big) for (let k = 0; k < 8; k++) { const a = k * TAU / 8, px = X + Math.cos(a) * 22, py = Y + 1 + Math.sin(a) * 7, hh = 7 + (k % 2) * 3 + trS(p, 2, k * 0.12) * 1.5; c.fillStyle = 'rgba(200,240,255,0.8)'; c.beginPath(); c.moveTo(px - 2, py); c.lineTo(px, py - hh); c.lineTo(px + 2, py); c.closePath(); c.fill(); }
    const n = big ? 6 : 4; for (let k = 0; k < n; k++) { const a = TAU * p + k * TAU / n; trCrystal(c, X + Math.cos(a) * 21, Y - 22 + Math.sin(a) * 6 - (k % 2) * 10, 3.3, Math.sin(a) > 0); }
    for (let k = 0; k < 8; k++) { const ph = trPh(p, k, 1); trSnow(c, trR(X + (trHash(k) - 0.5) * 50 + trS(p, 1, k * 0.2) * 3), trR(Y - 60 + ph * 62), 1 - ph * 0.7); } } };
// Engranaje 2: vapor de verdad (bocanadas desenfocadas y chorros), calor rosado y nube a los pies
TR_AURA.vapor = { mode: 'source-over', blur: 2, levels: 6,
  glow: (c, X, Y, p, F) => { c.globalCompositeOperation = 'lighter'; trGlowE(c, X, Y - 20, 24, 34, '255,110,120', 0.32, 0.04); c.globalCompositeOperation = 'source-over';
    for (let k = 0; k < 11; k++) { const ph = trPh(p, k, 1), r = 2.5 + ph * 7, px = X + (trHash(k) - 0.5) * 30 + trS(p, 1, trHash(k + 2)) * 3 * ph, py = Y - 10 - ph * 58; trPuff(c, px, py, r, 0.6 * (1 - ph)); }
    for (let k = 0; k < 6; k++) trPuff(c, X + (k - 2.5) * 8 + trS(p, 1, k * 0.15) * 2, Y + 1, 4 + (k % 2), 0.45); },
  det: (c, X, Y, p, F) => { for (let k = 0; k < 6; k++) { const sx = X + (k - 2.5) * 5; c.strokeStyle = `rgba(255,248,246,${0.4 + (k % 2) * 0.25})`; c.lineWidth = 1; c.beginPath(); for (let u = 0; u <= 1.001; u += 0.06) { const yy = Y - 14 - u * 50, xx = sx + Math.sin(u * 8 + TAU * p * 2 + k * 1.3) * (2 + u * 6); u ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); }
    for (let k = 0; k < 6; k++) { const ph = trPh(p, k + 11, 2); c.fillStyle = `rgba(255,255,255,${0.8 * (1 - ph)})`; c.fillRect(trR(X + (trHash(k + 30) - 0.5) * 26), trR(Y - 12 - ph * 40), 1, 1); } } };
// --- fusiones ---
// Dragón de Hielo: fuego azul y blanco, cristales y copos
TR_AURA.fus_dh = { mode: 'lighter', blur: 3, levels: 7,
  glow: (c, X, Y, p, F) => { const big = F >= 2; trGlowE(c, X, Y - 22, 28, 40, '60,150,255', 0.4, 0.05); trFire(c, X, Y, p, big ? 11 : 8, big ? 54 : 42, 16, ['rgba(40,120,255,0.6)', 'rgba(140,210,255,0.6)', 'rgba(240,252,255,0.75)']); },
  det: (c, X, Y, p, F) => { const big = F >= 2; trFire(c, X, Y, p, big ? 11 : 8, big ? 48 : 38, 16, ['rgba(80,170,255,0.3)', 'rgba(200,240,255,0.45)', 'rgba(255,255,255,0.85)']);
    for (let k = 0; k < 4; k++) { const a = TAU * p + k * TAU / 4; trCrystal(c, X + Math.cos(a) * 22, Y - 28 + Math.sin(a) * 6, 2.9, Math.sin(a) > 0); }
    trEmbers(c, X, Y, p, 12, 54, 18, (k, ph) => k % 2 ? `rgba(255,255,255,${1 - ph})` : `rgba(140,220,255,${1 - ph})`);
    for (let k = 0; k < 5; k++) { const ph = trPh(p, k + 3, 1); trSnow(c, trR(X + (trHash(k + 40) - 0.5) * 50), trR(Y - 58 + ph * 60), 1 - ph * 0.7); } } };
// Boceto de Fuego: llamas dibujadas con borde de tinta (se redibujan a saltos), papelitos y brasas negras
TR_AURA.fus_bf = { mode: 'source-over', blur: 3, levels: 6,
  det: (c, X, Y, p, F) => { const big = F >= 2, fr = Math.floor(p * TRB_N / 2) / (TRB_N / 2); trFire(c, X, Y, fr, big ? 10 : 8, big ? 50 : 40, 16, ['rgba(255,110,30,0.75)', 'rgba(255,190,80,0.8)', 'rgba(255,240,200,0.9)'], 'rgba(18,14,22,0.95)');
    c.strokeStyle = 'rgba(18,14,22,0.65)'; c.lineWidth = 1; c.beginPath(); for (let s = 0; s <= 26; s++) { const a = s / 26 * 6.4, j = (trHash(fr * 97 + s * 13) - 0.5) * 4, px = X + Math.cos(a) * (21 + j), py = Y - 22 + Math.sin(a) * (30 + j); s ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
    for (let k = 0; k < 5; k++) { const ph = trPh(p, k, 1), px = X + (trHash(k + 50) - 0.5) * 42, py = Y - 8 - ph * 48; c.save(); c.translate(px, py); c.rotate(TAU * p * 2 + k); c.fillStyle = `rgba(250,244,230,${0.95 * (1 - ph)})`; c.fillRect(-2, -1.5, 4, 3); c.strokeStyle = `rgba(18,14,22,${0.8 * (1 - ph)})`; c.strokeRect(-2, -1.5, 4, 3); c.restore(); }
    trEmbers(c, X, Y, p, 9, 48, 16, (k, ph) => k % 3 ? `rgba(255,${trR(190 - ph * 110)},60,${1 - ph})` : `rgba(18,14,22,${1 - ph})`); } };
// Ángel de Niebla: alas de niebla gris azulada, columna pálida, aureola rota, niebla a los pies y plumas
TR_AURA.fus_an = { mode: 'lighter', blur: 4, levels: 6,
  glow: (c, X, Y, p, F) => { const sz = F >= 2 ? 1.15 : 1; trColumn(c, X, Y + 4, 86 * sz, '220,228,242', 0.4, 8); trGlowE(c, X, Y - 26, 28 * sz, 46 * sz, '150,165,200', 0.32, 0.06); trWingFill(c, X, Y, sz, p, '210,218,236', '140,155,185', 0.45);
    for (let k = 0; k < 7; k++) trGlowE(c, X + Math.sin(k * 2.3 + TAU * p) * 22, Y + 1 - (k % 3) * 2, 14, 4, '210,220,238', 0.45); },
  det: (c, X, Y, p, F) => { const sz = F >= 2 ? 1.15 : 1; trWingLines(c, X, Y, sz, p, 'rgba(240,244,252,0.7)', 'rgba(180,192,216,0.6)', 7);
    const hy = Y - 48 * sz + trS(p, 1) * 1; c.strokeStyle = 'rgba(240,244,252,0.9)'; c.lineWidth = 1.4; c.beginPath(); c.ellipse(X, hy, 7, 2, 0, 0.3, 2.7); c.stroke(); c.beginPath(); c.ellipse(X + 1, hy - 1, 7, 2, 0, 3.4, 5.9); c.stroke();
    for (let k = 0; k < 4; k++) { const ph = trPh(p, k, 1), px = X + (trHash(k + 60) - 0.5) * 50, py = Y - 62 * sz + ph * 64 * sz; trFeather(c, px, py, trS(p, 1, k * 0.2) * 0.8, Math.min(1, (1 - ph) * 1.4) * 0.85, 'rgba(232,236,246,A)', 'rgba(140,150,175,A)'); } } };

// ================= DESTELLOS (0,45 s, en tiempo real, delante del personaje) =================
function trFlashGen(rgb, ring, motif, dark) { const f = (x, y, u) => { const k = 1 - u; trColumn(ctx, x, y, 130, rgb, 0.75 * k, 6 + u * 20);
  ctx.strokeStyle = ring.replace('A', k); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 10 + u * 48, 4 + u * 17, 0, 0, TAU); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 18, 6 + u * 42, 8 + u * 48, 0, 0, TAU); ctx.stroke();
  if (u < 0.45) trGlowE(ctx, x, y - 18, 42, 42, rgb, 0.9 * (1 - u / 0.45));
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12 + 0.2, d = 10 + u * 50, px = x + Math.cos(a) * d, py = y - 18 + Math.sin(a) * d * 0.8; motif(px, py, k, i, a); } }; f.dark = !!dark; return f; }
TR_FLASH.dorado = (x, y, u) => { const k = 1 - u, w = 8 + u * 26; trColumn(ctx, x, y, 160, '255,236,140', 0.95 * k, w); trColumn(ctx, x, y, 160, '255,255,255', k * k, w * 0.35);
  trSpikePath(ctx, x, y, 52 + u * 54, 17 + u * 24, 12, G.t % 1, 1, 3); ctx.fillStyle = `rgba(255,220,80,${0.45 * k})`; ctx.fill(); ctx.strokeStyle = `rgba(255,255,220,${k})`; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = `rgba(255,212,64,${k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 10 + u * 52, 4 + u * 18, 0, 0, TAU); ctx.stroke(); if (u < 0.5) trGlowE(ctx, x, y - 18, 46, 46, '255,255,240', 0.95 * (1 - u * 2)); };
TR_FLASH.tejedor = (x, y, u) => { const k = 1 - u; ctx.lineWidth = 1; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + 0.3, r0 = 60 * (1 - Math.min(1, u * 1.6)), r1 = r0 + 22 * k; ctx.strokeStyle = `rgba(255,255,255,${k})`; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r1, y - 16 + Math.sin(a) * r1 * 0.8); ctx.lineTo(x + Math.cos(a) * r0, y - 16 + Math.sin(a) * r0 * 0.8); ctx.stroke(); }
  if (u > 0.35) { const v = (u - 0.35) / 0.65; ctx.strokeStyle = `rgba(12,10,18,${0.9 * (1 - v)})`; ctx.lineWidth = 4 * (1 - v) + 1; ctx.beginPath(); ctx.ellipse(x, y - 16, 8 + v * 50, 10 + v * 44, 0, 0, TAU); ctx.stroke(); ctx.strokeStyle = `rgba(246,242,234,${1 - v})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 16, 6 + v * 50, 8 + v * 44, 0, 0, TAU); ctx.stroke(); } };
TR_FLASH.tejedor.dark = true;
TR_FLASH.lobo = trFlashGen('220,230,255', 'rgba(220,228,250,A)', (px, py, k) => { ctx.fillStyle = `rgba(240,244,255,${k})`; ctx.fillRect(trR(px), trR(py), 2, 1); ctx.fillRect(trR(px), trR(py) + 2, 2, 1); });
TR_FLASH.fantasma = trFlashGen('170,236,228', 'rgba(190,236,230,A)', (px, py, k, i) => { if (i % 2) trGhost(ctx, px, py, 0.75, 0.8 * k, G.t % 1, i); });
TR_FLASH.vampiro = trFlashGen('200,30,50', 'rgba(200,20,40,A)', (px, py, k, i) => trBat(ctx, px, py, G.t % 1, i, `rgba(22,4,12,${k})`), true);
TR_FLASH.dragon = trFlashGen('255,150,40', 'rgba(255,120,30,A)', (px, py, k) => trGlowE(ctx, px, py, 3 + k * 2, 3 + k * 2, '255,200,80', k));
TR_FLASH.alado = trFlashGen('210,248,255', 'rgba(150,225,245,A)', (px, py, k, i, a) => trFeather(ctx, px, py, a + 1.57, k, 'rgba(255,255,255,A)', 'rgba(140,210,235,A)'));
TR_FLASH.eco = trFlashGen('235,233,226', 'rgba(24,22,32,A)', (px, py, k, i) => { ctx.fillStyle = i % 2 ? `rgba(20,20,28,${k})` : `rgba(245,243,238,${k})`; ctx.beginPath(); ctx.arc(px, py, 1.5 + k * 1.5, 0, TAU); ctx.fill(); }, true);
TR_FLASH.hielo = trFlashGen('170,230,255', 'rgba(170,225,255,A)', (px, py, k, i) => i % 2 ? trCrystal(ctx, px, py, 2 * k + 1, true) : trSnow(ctx, trR(px), trR(py), k));
TR_FLASH.vapor = trFlashGen('255,226,222', 'rgba(255,200,200,A)', (px, py, k) => trPuff(ctx, px, py, 2 + (1 - k) * 5, 0.75 * k), true);
TR_FLASH.fus_dh = trFlashGen('140,210,255', 'rgba(120,200,255,A)', (px, py, k, i) => i % 2 ? trCrystal(ctx, px, py, 2 * k + 1, true) : trSnow(ctx, trR(px), trR(py), k));
TR_FLASH.fus_bf = trFlashGen('255,170,80', 'rgba(20,16,24,A)', (px, py, k, i) => { ctx.fillStyle = i % 2 ? `rgba(255,140,40,${k})` : `rgba(20,16,24,${k})`; ctx.beginPath(); ctx.arc(px, py, 1.5 + k * 1.5, 0, TAU); ctx.fill(); }, true);
TR_FLASH.fus_an = trFlashGen('220,228,246', 'rgba(200,210,230,A)', (px, py, k, i, a) => i % 2 ? trFeather(ctx, px, py, a + 1.57, k, 'rgba(238,242,250,A)', 'rgba(140,150,175,A)') : trPuff(ctx, px, py, 2 + (1 - k) * 3, 0.5 * k, '220,228,240'));
function trFlashDraw(key, x, y, u) { const f = TR_FLASH[key]; if (!f) return; ctx.save(); ctx.globalCompositeOperation = f.dark ? 'source-over' : 'lighter'; try { f(x, y, u); } finally { ctx.restore(); } }

// ---------- clave de aura: forma o fusión, para ti y para los jugadores del online ----------
function trKeyP(P) { if (!P || !P.sr) return null; if (P.sr === 'dragon' && P.fus) return 'fus_dh'; if (typeof fus2On === 'function') { const f = fus2On(); if (f) return 'fus_' + f; } return P.sr; }
function trKeyG(g) { if (!g || !g.sr) return null; if (g.sr === 'dragon' && g.fu) return 'fus_dh'; if (g.f2) return 'fus_' + g.f2; return g.sr; }
// dibujo: el destello sale al pasar de forma normal a transformado (también al pasar de forma a fusión)
// el aura se dibuja DETRÁS del personaje (antes de drawEnt, como en las referencias); el destello va delante (WORLD_DRAW)
function trAuraEnt(e, key, F, off, cx, cy) { const on = key && F > 0; if (on && e._trSeen && (!(e._trF > 0) || e._trK !== key) && TR_FLASH[key]) { e._trFl = G.t; if (key === 'vapor') e._poseT = G.t + TR_POSE_DUR; }
  e._trF = on ? F : 0; e._trK = key; e._trOff = off; e._trSeen = 1; if (!on || !e._trFl) return;
  const u = (G.t - e._trFl) / TRF_DUR; if (u < 0 || u > 1) { e._trFl = 0; return; } const x = trR(e.x - cx), y = trR(e.y - cy); if (x > -90 && y > -40 && x < VW + 90 && y < VH + 160) trFlashDraw(key, x, y, u); }
hookBefore('drawEnt', (e, cx, cy) => { if (!e || !(e._trF > 0) || e._trOff || e.dead || e.invis || e._trAt === G.t || !TR_AURA[e._trK]) return; if (e !== G.P && e.type !== 'remote') return;
  const x = trR(e.x - cx), y = trR(e.y - cy); if (x < -90 || y < -40 || x > VW + 90 || y > VH + 160) return; e._trAt = G.t;
  try { ctx.save(); trAuraDraw(e._trK, x, y, G.t + (e.x || 0) * 0.01, e._trF); } finally { ctx.restore(); } });
WORLD_DRAW.push((cx, cy) => { const P = G.P; if (!P) return; trAuraEnt(P, trKeyP(P), P.srF | 0, !!P.trAuraOff, cx, cy);
  for (const r of G.remote.values()) if (r.map === P.map) trAuraEnt(r, trKeyG(r.gear), r.gear ? r.gear.sf | 0 : 0, !!(r.gear && r.gear.na), cx, cy); });
SAVEKEYS.push('trAuraOff');
hookAfter('gearTiers', (g, P) => { if (g && P && P.trAuraOff) g.na = 1; });
hookAfter('lkGear', (o, g) => { if (o && g && g.na) o.na = 1; });
function trAuraSet(off) { const P = G.P; if (!P) return; P.trAuraOff = off ? 1 : 0; markDirty(); try { refreshLook(); } catch (e) { } toast(off ? L2('Aura de transformación apagada', 'Transformation aura off') : L2('Aura de transformación encendida', 'Transformation aura on')); transOpen(); }
// botón en 🌀 Transformaciones (solo si tu forma tiene aura)
hookAfter('transOpen', () => { const P = G.P, fr = document.querySelector('#modal .frame'); if (!P || !fr || !TR_AURA[trKeyP(P)] || fr.querySelector('#trAuraBtn')) return;
  const d = document.createElement('div'); d.className = 'row'; d.innerHTML = `<span class="hint">✨ ${L2('Aura de transformación (solo transformado)', 'Transformation aura (only while transformed)')}</span> <button class="btn" id="trAuraBtn">${P.trAuraOff ? L2('Aura: no', 'Aura: off') : L2('Aura: sí', 'Aura: on')}</button>`;
  const h = fr.querySelector('.hint:not(.tut)') || fr.querySelector('h3'); if (h && h.parentNode) h.parentNode.insertBefore(d, h.nextSibling); else fr.appendChild(d); d.querySelector('#trAuraBtn').onclick = () => trAuraSet(!P.trAuraOff); });

// ---------- Engranaje 2: pose agachada al transformarse (1,1 s) ----------
// Piernas flexionadas y abiertas, inclinado hacia delante, una mano en la rodilla y el puño en el suelo.
ANIMS.st_g2 = [0, 2];
hookAround('heroPose', (next, dir, anim, f, L) => { if (anim !== 'st_g2') return next(dir, anim, f, L);
  const ps = poseFor(dir, 'idle', 0, L), side = dir === 'left' || dir === 'right', fx = dir === 'left' ? -1 : 1;
  ps.crouch = 3; ps.bob = f ? 1 : 0; ps.noWeapon = 1; ps.lean = side ? 3 : 0;
  if (side) { ps.lfx = -fx * 3; ps.rfx = fx * 3; ps.rax = fx * 4; ps.ray = 4; ps.lax = fx * 2; ps.lay = 1; }
  else { ps.lax = -4; ps.lay = 1; ps.rax = 1; ps.ray = 4; ps.lfy = 0; ps.rfy = 0; }
  return ps; });
hookAround('drawEnt', (next, e, cx, cy) => { if (!e || !(e._poseT > G.t) || !(e.type === 'player' || e.type === 'remote') || e.mount || e.dead || !e.cls || !e.app || typeof stanceAtlasFor !== 'function') return next(e, cx, cy);
  const A0 = e.atlas, an0 = e.anim, f0 = e.af; try { e.atlas = stanceAtlasFor(e, 'g2'); e.anim = 'st_g2'; e.af = Math.floor(G.t * 6) % 2; return next(e, cx, cy); } catch (err) { if (typeof errOnce === 'function') errOnce('g2pose', err); return next(e, cx, cy); } finally { e.atlas = A0; e.anim = an0; e.af = f0; } });
// Lupa › Sistemas
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_auras_tr', '✨ ' + L2('Auras de transformación', 'Transformation auras'), () => [L2('Cada forma y cada fusión tiene su aura animada detrás del personaje, solo mientras estás transformado, y un destello propio al transformarte que desaparece enseguida. El Engranaje 2 se agacha un momento echando vapor.', 'Every form and fusion has its own animated aura behind the character, only while transformed, and its own flash when you transform that fades right away. Gear 2 crouches for a moment letting off steam.'), L2('Si no te gusta, 🌀 Transformaciones › «Aura: sí / no» la apaga (los demás jugadores tampoco la ven).', 'If you don’t like it, 🌀 Transformations › «Aura: on / off» turns it off (other players won’t see it either).')], () => null]);
