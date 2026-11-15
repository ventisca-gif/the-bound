// ================= v4.69: LAS TIERRAS SIN PINTAR (continente del borde del mundo, nivel 300-350 + Trazos) =================
// El borde del mundo, donde la Ventisca todavía no ha pintado (referencia de Sergio: el pueblo con color se convierte en
// un boceto blanco sobre un vacío morado; en el cielo, una mano gigante con un pincel y un rostro blanco de ojos brillantes).
// - El suelo se ve sin color (boceto a lápiz) y recupera el color por zonas a medida que vences a sus criaturas y jefes.
// - Criaturas esbozadas (blancas con trazo gris, algunas a medio pintar o de tinta) hechas a partir de los dibujos del juego.
// - 4 jefes de zona y el súper jefe final, El Lienzo en Blanco. Misiones de Mael, la Pintora del Borde.
// - Trazos: al nivel máximo la experiencia sigue sumando Trazos (hasta 50, +0,4 % ataque/defensa/vida cada uno; no en duelos).
// Lore: el Lienzo en Blanco es el silencio de Nihil donde todavía no hay nada pintado (en el borde no es negro, es blanco).
// La mano del cielo es la Ventisca pintando. Ver docs/LORE.md.
SAVEKEYS.push('tsp', 'trz');

// ---------- criaturas esbozadas: se generan desde el atlas de cualquier criatura ----------
// art = ['tsp', variante, ...art original]; variante: 'w' boceto blanco, 'part' a medio pintar, 'ink' tinta, 'gold' marco dorado
function tspSketch(src, fw, fh, v) {
  const w = src.width, h = src.height, c = mkCanvas(w, h), x = c.getContext('2d'); x.drawImage(src, 0, 0); let im; try { im = x.getImageData(0, 0, w, h); } catch (e) { return c; }
  const d = im.data, o = new Uint8ClampedArray(d), A = (i, j) => (i < 0 || j < 0 || i >= w || j >= h) ? 0 : d[(j * w + i) * 4 + 3];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const k = (j * w + i) * 4; if (d[k + 3] < 20) continue;
    const L = (d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11) / 255, edge = !A(i - 1, j) || !A(i + 1, j) || !A(i, j - 1) || !A(i, j + 1);
    const fx = (i % fw) / fw, fy = (j % fh) / fh, keep = v === 'part' && fx + fy > 1.05;
    let r, g, b;
    if (keep) { r = d[k]; g = d[k + 1]; b = d[k + 2]; }
    else if (v === 'ink') { if (edge) { r = 40; g = 20; b = 70; } else { const s = 18 + L * 60; r = s * 0.7; g = s * 0.4; b = s; } }
    else if (edge || L < 0.18) { r = 74; g = 64; b = 96; }
    else { const s = 212 + L * 40 + ((i + j) % 5 === 0 && L < 0.5 ? -26 : 0); r = s; g = s - 4; b = s + 6; if (v === 'gold' && L > 0.45) { r = 236; g = 196; b = 96; } }
    o[k] = r; o[k + 1] = g; o[k + 2] = b; o[k + 3] = 255; }
  x.putImageData(new ImageData(o, w, h), 0, 0); return c; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (!art || art[0] !== 'tsp') return _ma(art);
    return getAtlas('M' + art.join(','), () => { const base = _ma(art.slice(2)); const out = Object.assign({}, base); out.img = tspSketch(base.img, base.fw, base.fh, art[1]); out.hdL = null; out.hd = null; return out; }); }; }

// ---------- zonas, criaturas y jefes ----------
const TSP_W = 220, TSP_H = 160, TSP_GATE = [20, 104];
const TSP_ZONES = [
  { k: 'orilla', n: L2('Orilla del Boceto', 'Sketch Shore'), c: [52, 100], r: [32, 26], ter: 'GRASS', lv: [300, 318], pool: ['tsp_slime', 'tsp_golemito'], boss: 'tsp_golem' },
  { k: 'llanura', n: L2('Llanura de los Trazos', 'Plain of Strokes'), c: [104, 52], r: [38, 26], ter: 'DIRT', lv: [316, 332], pool: ['tsp_esqueleto', 'tsp_lobo'], boss: 'tsp_rey' },
  { k: 'cienaga', n: L2('Ciénaga de los Borrones', 'Swamp of Smudges'), c: [168, 104], r: [34, 26], ter: 'MUD', lv: [330, 342], pool: ['tsp_borron', 'tsp_fantasma'], boss: 'tsp_borron_gran' },
  { k: 'marco', n: L2('El Marco Roto', 'The Broken Frame'), c: [176, 40], r: [28, 22], ter: 'FLOOR', lv: [340, 350], pool: ['tsp_caballero', 'tsp_golemito'], boss: 'tsp_marco' },
  { k: 'blanco', n: L2('El Lienzo en Blanco', 'The Blank Canvas'), c: [114, 132], r: [24, 17], ter: 'ASH', lv: [348, 350], pool: ['tsp_fantasma', 'tsp_caballero'], boss: 'lienzo_blanco' },
];
it('tinta_viva', { n: L2('Tinta Viva', 'Living Ink'), t: 'mat', stack: true, tier: 17, price: 3000, icon: ['drop', '#5a3a9a'], rar: 5, d: L2('Gotea de las criaturas sin pintar. Mael la cambia por Trazos.', 'Drips from unpainted creatures. Mael trades it for Strokes.') });
it('pigmento_puro', { n: L2('Pigmento Puro', 'Pure Pigment'), t: 'mat', stack: true, tier: 17, price: 6000, icon: ['gem', '#ff70c0'], rar: 5, d: L2('Color recién nacido. Lo sueltan los jefes del borde.', 'Newborn colour. Dropped by the bosses of the border.') });
const TSP_MOBS = [['tsp_slime', L2('Slime a Medio Pintar', 'Half-Painted Slime'), ['tsp', 'part', 'slime', 'purple'], 'aggro', [300, 316]], ['tsp_golemito', L2('Gólem de Boceto', 'Sketch Golem'), ['tsp', 'w', 'hum', 'golem'], 'aggro', [304, 348]],
  ['tsp_esqueleto', L2('Esqueleto Esbozado', 'Sketched Skeleton'), ['tsp', 'w', 'hum', 'esqueleto'], 'aggro', [316, 332]], ['tsp_lobo', L2('Lobo de Carboncillo', 'Charcoal Wolf'), ['tsp', 'w', 'quad', 'lobo'], 'charge', [318, 332]],
  ['tsp_borron', L2('Borrón de Tinta', 'Ink Smudge'), ['tsp', 'ink', 'slime', 'purple'], 'aggro', [330, 342]], ['tsp_fantasma', L2('Trazo Fantasma', 'Ghost Stroke'), ['tsp', 'w', 'ghost', ''], 'ranged', [332, 350]],
  ['tsp_caballero', L2('Caballero sin Colorear', 'Uncoloured Knight'), ['tsp', 'w', 'hum', 'caballero'], 'aggro', [340, 350]]];
for (const [id, n, art, ai, lv] of TSP_MOBS) MOBS[id] = { n, art, reg: ['sinpintar'], lv, hp: 1.6 + (lv[0] - 300) / 400, atk: 1.95 + (lv[0] - 300) / 500, def: 1.8, spd: ai === 'charge' ? 74 : ai === 'ranged' ? 50 : 56, ai, fam: 'sinpintar', fly: id === 'tsp_fantasma' ? 1 : 0, drops: [['tinta_viva', 0.18]] };
Object.assign(BOSSES, {
  tsp_golem: { n: L2('El Gólem Inacabado', 'The Unfinished Golem'), lv: 318, art: ['tsp', 'part', 'hum', 'golem'], scale: 2.1, hp: 32, atk: 2.75, def: 2.7, spd: 38, moves: ['slam', 'charge', 'summon'], minion: 'tsp_golemito', drops: [['pigmento_puro', 1, 3], ['tinta_viva', 1, 6]], r: 36 },
  tsp_rey: { n: L2('El Rey en Borrador', 'The Draft King'), lv: 332, art: ['tsp', 'w', 'hum', 'esqueleto'], scale: 2.1, hp: 33, atk: 2.8, def: 2.75, spd: 42, moves: ['slam', 'volley', 'summon', 'charge'], minion: 'tsp_esqueleto', drops: [['pigmento_puro', 1, 3], ['tinta_viva', 1, 6]], r: 36 },
  tsp_borron_gran: { n: L2('El Gran Borrón', 'The Great Smudge'), lv: 342, art: ['tsp', 'ink', 'slime', 'purple'], scale: 3.2, hp: 34, atk: 2.85, def: 2.8, spd: 34, moves: ['slam', 'field', 'summon', 'nova'], minion: 'tsp_borron', drops: [['pigmento_puro', 1, 4], ['tinta_viva', 1, 8]], r: 42 },
  tsp_marco: { n: L2('El Guardián del Marco', 'The Frame Warden'), lv: 348, art: ['tsp', 'gold', 'hum', 'caballero'], scale: 2.2, hp: 35, atk: 2.9, def: 2.9, spd: 44, moves: ['slam', 'charge', 'volley', 'blink'], minion: 'tsp_caballero', drops: [['pigmento_puro', 1, 4], ['tinta_viva', 1, 8]], r: 38 },
  lienzo_blanco: { n: L2('El Lienzo en Blanco', 'The Blank Canvas'), lv: 350, art: ['tsp', 'w', 'ghost', ''], scale: 3.4, fly: 1, hp: 38, atk: 3.0, def: 3.0, spd: 30, moves: ['blink', 'volley', 'summon'], minion: 'tsp_fantasma', drops: [['pigmento_puro', 1, 8], ['esencia_nihil', 1, 3]], r: 46 },
});
for (const id of ['tsp_golem', 'tsp_rey', 'tsp_borron_gran', 'tsp_marco', 'lienzo_blanco']) it('trofeo_' + id, { n: L2('Trofeo: ', 'Trophy: ') + BOSSES[id].n, t: 'mat', stack: true, tier: 1, price: 50, troph: id, icon: ['trophy', trophyCol(id)], rar: 3, d: L2('Expónlo en el museo de tu casa (Vitrina o Pedestal).', 'Display it in your house museum (Display case or Pedestal).') });

// ---------- mapa ----------
function makeSinPintar() {
  if (G.maps.sin_pintar) return G.maps.sin_pintar; const w = TSP_W, h = TSP_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'sin_pintar', w, h, ter: new Uint8Array(N).fill(T.VOID), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, sky: 1, _skyd: 1, tsp: 1, camps: [], bossAt: [], halos: [], temples: [] };
  const set = (x, y, t) => { if (x > 1 && y > 1 && x < w - 2 && y < h - 2) M.ter[I(x, y)] = T[t]; };
  const land = (cx, cy, rx, ry, t, seed) => { for (let y = cy - ry - 4; y <= cy + ry + 4; y++) for (let x = cx - rx - 4; x <= cx + rx + 4; x++) { const d = Math.hypot((x - cx) / rx, (y - cy) / ry) + (hash2(x, y, seed) - 0.5) * 0.28; if (d < 1) set(x, y, t); } };
  TSP_ZONES.forEach((Z, i) => land(Z.c[0], Z.c[1], Z.r[0], Z.r[1], Z.ter, 40 + i));
  land(TSP_GATE[0] + 6, TSP_GATE[1], 10, 8, 'GRASS', 3);
  // puentes de piedra sobre el vacío entre las islas
  const road = (x0, y0, x1, y1) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let k = 0; k <= n; k++) { const x = Math.round(x0 + (x1 - x0) * k / n), y = Math.round(y0 + (y1 - y0) * k / n); for (let d = -1; d <= 1; d++) { if (M.ter[I(x + d, y)] === T.VOID || d === 0) set(x + d, y, 'COBBLE'); if (M.ter[I(x, y + d)] === T.VOID || d === 0) set(x, y + d, 'COBBLE'); } } };
  road(TSP_GATE[0], TSP_GATE[1], 52, 100); road(52, 100, 104, 52); road(104, 52, 176, 40); road(104, 52, 168, 104); road(168, 104, 114, 132); road(52, 100, 114, 132);
  prepPalettes(M); M.exit = { x: -9, y: -9 }; initMapObjs(M);
  const R = new RNG(SEED + 4242), free = (x, y) => { const i = I(x, y); return M.ter[i] !== T.VOID && M.ter[i] !== T.COBBLE && M.objAt[i] < 0 && Math.hypot(x - TSP_GATE[0], y - TSP_GATE[1]) > 5; };
  const F = (f, x, y, o) => free(x, y) ? addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {})) : null;
  for (let k = 0; k < 420; k++) { const x = R.int(6, w - 6), y = R.int(6, h - 6), t = M.ter[I(x, y)]; if (t === T.VOID || t === T.COBBLE) continue; const r = R.f();
    F(r < 0.45 ? 'sp_arbol' : r < 0.65 ? 'sp_columna' : r < 0.8 ? 'sp_arco' : r < 0.9 ? 'sp_casa' : 'sp_caballete', x, y); }
  { const [cx, cy] = TSP_ZONES[3].c; F('sp_marco', cx, cy - 9, { fp: [[-1, 0], [0, 0], [1, 0]] }); }
  { const [cx, cy] = TSP_ZONES[4].c; F('sp_portal', cx, cy - 12, { fp: [[-1, 0], [0, 0], [1, 0]] }); }
  addObj(M, 'furn', TSP_GATE[0], TSP_GATE[1] + 3, { f: 'sp_puente', fp: [[0, 0]] });
  TSP_ZONES.forEach((Z, z) => { for (let j = 0; j < 7; j++) { const a = j / 7 * 6.28 + z, rr = 0.6; M.camps.push({ x: Math.round(Z.c[0] + Math.cos(a) * Z.r[0] * rr), y: Math.round(Z.c[1] + Math.sin(a) * Z.r[1] * rr), mob: Z.pool[j % Z.pool.length], lv: R.int(Z.lv[0], Z.lv[1]), n: 3, alive: [], isl: z }); }
    M.bossAt.push({ x: Z.c[0], y: Z.c[1] - 4, id: Z.boss, k: Z.k }); });
  spawnNPC('pintora_mael', (TSP_GATE[0] + 3) * 16 + 8, (TSP_GATE[1] - 2) * 16 + 8, 'sin_pintar', { face: 'down' });
  M.drawExtra = (cx, cy) => tspGround(M, cx, cy); M.drawPost = (cx, cy) => tspSky(M, cx, cy);
  M.wdist = null; G.maps.sin_pintar = M; return M;
}
function tspZoneAt(x, y) { return TSP_ZONES.findIndex(Z => Math.hypot((x / 16 - Z.c[0]) / Z.r[0], (y / 16 - Z.c[1]) / Z.r[1]) < 1.05); }
function tspPaint(z) { const P = G.P; P.tsp = P.tsp || {}; P.tsp.p = P.tsp.p || {}; return z >= 0 ? Math.min(1, P.tsp.p[TSP_ZONES[z].k] || 0) : 0; }
function tspAddPaint(z, n) { if (z < 0) return; const P = G.P; tspPaint(z); const k = TSP_ZONES[z].k, a = P.tsp.p[k] || 0; P.tsp.p[k] = Math.min(1, a + n);
  if (a < 1 && P.tsp.p[k] >= 1) banner(TSP_ZONES[z].n, L2('¡Zona pintada del todo!', 'Zone fully painted!')); markDirty(); }

// ---------- dibujo: el suelo sin color, el vacío morado y el cielo ----------
const TSP_HATCH = (() => { const c = mkCanvas(32, 32), x = c.getContext('2d'); x.strokeStyle = 'rgba(90,80,120,0.55)'; x.lineWidth = 1; for (let k = -32; k < 64; k += 6) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + 32, 32); x.stroke(); } return c; })();
let TSP_HPAT = null;
function tspGround(M, cx, cy) { const P = G.P, z = tspZoneAt(P.x, P.y), paint = tspPaint(z >= 0 ? z : 0), s = Math.max(0.12, 1 - paint * 0.88);
  ctx.save();
  ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = s; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, VW, VH);
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = s * 0.62; ctx.fillStyle = '#e4dcf0'; ctx.fillRect(0, 0, VW, VH);
  ctx.globalCompositeOperation = 'source-over'; if (!TSP_HPAT) TSP_HPAT = ctx.createPattern(TSP_HATCH, 'repeat'); ctx.globalAlpha = 0.1 * s; ctx.fillStyle = TSP_HPAT; ctx.translate(-cx % 32, -cy % 32); ctx.fillRect(0, 0, VW + 32, VH + 32); ctx.restore();
  // el vacío: morado con remolinos y, a veces, los ojos de Nihil
  const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(M.w - 1, Math.ceil((cx + VW) / 16)), y1 = Math.min(M.h - 1, Math.ceil((cy + VH) / 16));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (M.ter[M.I(x, y)] !== T.VOID) continue; const X = x * 16 - cx, Y = y * 16 - cy, hsh = hash2(x, y, 11);
    ctx.fillStyle = hsh < 0.5 ? '#1a0a2e' : '#22103a'; ctx.fillRect(X, Y, 16, 16); if ((x + y + Math.floor(G.t * 2)) % 9 === 0) { ctx.fillStyle = 'rgba(160,80,220,0.35)'; ctx.fillRect(X + 3, Y + 6, 9, 2); }
    if (y > 0 && M.ter[M.I(x, y - 1)] !== T.VOID) { ctx.fillStyle = '#d8d0e4'; for (let i = 0; i < 16; i += 3) ctx.fillRect(X + i, Y, 2, 3 + ((x * 7 + i) % 5)); } }
  { const ex = (Math.floor(G.t / 9) * 37) % (M.w - 20) + 10, ey = M.h - 10; if (Math.sin(G.t * 0.7) > 0.6) { const X = ex * 16 - cx, Y = ey * 16 - cy; if (X > -40 && X < VW + 40 && Y > -40 && Y < VH + 40) { ctx.fillStyle = 'rgba(230,140,255,0.85)'; ctx.beginPath(); ctx.ellipse(X - 12, Y, 6, 2.5, 0, 0, 7); ctx.ellipse(X + 12, Y, 6, 2.5, 0, 0, 7); ctx.fill(); } } }
}
const TSP_SKY = mkCanvas(480, 130);
{ const g = TSP_SKY.getContext('2d'), W = 480, H = 130; const s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#3a2a6a'); s.addColorStop(0.55, '#7a5aaa'); s.addColorStop(1, '#d8c8f0'); g.fillStyle = s; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 6; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(40 + k * 60, 20 + k * 14); g.bezierCurveTo(140 + k * 40, -10 + k * 10, 260 + k * 20, 70 - k * 6, 420, 30 + k * 12); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,0.25)'; for (let k = 0; k < 40; k++) g.fillRect(Math.floor(hash2(k, 4, 9) * W), Math.floor(hash2(k, 5, 9) * H * 0.8), 2, 1); }
function tspSky(M, cx, cy) {
  const H = Math.round(VH * (OPT && OPT.on ? 0.2 : 0.27)), boss = G.ents.find(e => e.mid === 'lienzo_blanco' && !e.dying && e.map === M.id);
  const off = -((cx * 0.08) % 480 + 480) % 480; for (let k = -1; k < Math.ceil(VW / 480) + 1; k++) ctx.drawImage(TSP_SKY, Math.round(off + k * 480), 0, 480, H);
  // el rostro blanco (el Lienzo en Blanco) con su arco dorado
  const fx = VW * 0.78, fy = H * 0.5, fr = H * 0.42; ctx.save(); ctx.globalAlpha = boss ? 0.85 : 0.5;
  const gr = ctx.createRadialGradient(fx, fy, 2, fx, fy, fr * 1.6); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(fx - fr * 2, fy - fr * 2, fr * 4, fr * 4);
  ctx.fillStyle = '#f4f0fa'; ctx.beginPath(); ctx.ellipse(fx, fy, fr * 0.62, fr * 0.8, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#ffd060'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, fr * 1.05, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  const eg = boss ? 1 : 0.7 + 0.3 * Math.sin(G.t); ctx.fillStyle = `rgba(255,255,255,${eg})`; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 8; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(fx + s * fr * 0.24, fy - fr * 0.05, fr * 0.09, 0, 7); ctx.fill(); }
  ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(200,190,230,0.7)'; ctx.lineWidth = 1; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(fx - fr * 0.5 + i * fr * 0.12, fy + fr * 0.6); ctx.quadraticCurveTo(fx - fr * 0.9 + i * fr * 0.2, fy + fr * 1.4, fx - fr * 1.4 + i * fr * 0.3, fy + fr * 2); ctx.stroke(); }
  ctx.restore();
  // la mano de la Ventisca con su pincel, pintando despacio
  const hx = VW * 0.34 + Math.sin(G.t * 0.25) * VW * 0.06, hy = H * 0.42 + Math.cos(G.t * 0.3) * H * 0.08; ctx.save(); ctx.globalAlpha = 0.78; ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#b8a8d8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(hx, hy, H * 0.22, H * 0.14, -0.5, 0, 7); ctx.fill(); ctx.stroke();
  for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.ellipse(hx + H * 0.12 + f * H * 0.05, hy - H * 0.12 + f * H * 0.02, H * 0.04, H * 0.11, -0.3, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.strokeStyle = '#e8e0f0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx + H * 0.05, hy - H * 0.05); ctx.lineTo(hx + H * 0.55, hy + H * 0.42); ctx.stroke(); ctx.fillStyle = '#ffd060'; ctx.fillRect(hx + H * 0.5, hy + H * 0.37, 6, 6);
  ctx.strokeStyle = 'rgba(255,240,180,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx + H * 0.56, hy + H * 0.44); ctx.quadraticCurveTo(hx + H, hy + H * 0.8, hx + H * 1.6, hy + H * 0.62); ctx.stroke(); ctx.restore();
  const lf = ctx.createLinearGradient(0, H * 0.9, 0, H * 1.25); lf.addColorStop(0, 'rgba(216,200,240,0.7)'); lf.addColorStop(1, 'rgba(216,200,240,0)'); ctx.fillStyle = lf; ctx.fillRect(0, H * 0.9, VW, H * 0.35);
  if (G.P && G.P.inkT > G.t) { ctx.fillStyle = 'rgba(10,0,20,0.55)'; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.arc((hash2(k, 1, Math.floor(G.P.inkT)) * VW), (hash2(k, 2, Math.floor(G.P.inkT)) * VH), 50 + k * 8, 0, 7); ctx.fill(); } }
  if (boss && boss.hp < boss.maxhp * 0.25) { ctx.fillStyle = `rgba(255,255,255,${0.12 + 0.06 * Math.sin(G.t * 3)})`; ctx.fillRect(0, 0, VW, VH); }
}

// ---------- objetos esbozados ----------
{ const _g2 = genFurn2; genFurn2 = function (kind) { if (!/^sp_/.test(kind)) return _g2(kind); const L = C('#4a4060'), W = C('#f2eef8'), G2 = C('#d8d0e4'), G3 = C('#b8b0c8'), Au = C('#ffd060'); let p, ax, ay, light;
    switch (kind) {
      case 'sp_arbol': { p = new Pix(36, 48); const br = (x0, y0, a, l, d) => { if (d > 4 || l < 2) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; p.line(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), d < 2 ? G3 : G2); br(x1, y1, a - 0.5, l * 0.7, d + 1); br(x1, y1, a + 0.45, l * 0.68, d + 1); }; p.rect(17, 30, 3, 17, G2); p.vl(17, 30, 17, G3); br(18, 31, -Math.PI / 2, 12, 0); ax = 18; ay = 46; break; }
      case 'sp_columna': { p = new Pix(14, 34); p.rect(3, 4, 8, 28, W); p.vl(3, 4, 28, G2); p.vl(10, 4, 28, G3); p.rect(1, 2, 12, 3, G2); p.rect(1, 31, 12, 3, G3); for (let y = 8; y < 30; y += 5) p.set(6, y, G3); ax = 7; ay = 33; break; }
      case 'sp_arco': { p = new Pix(36, 40); p.rect(2, 10, 7, 29, W); p.rect(27, 10, 7, 29, W); p.vl(2, 10, 29, G2); p.vl(33, 10, 29, G3); for (let a = 0; a <= 20; a++) { const t = Math.PI + a / 20 * Math.PI, x = 18 + Math.cos(t) * 14, y = 12 + Math.sin(t) * 10; p.rect(Math.round(x) - 2, Math.round(y) - 2, 4, 4, W); } p.rect(14, 2, 4, 3, G2); ax = 18; ay = 39; break; }
      case 'sp_casa': { p = new Pix(34, 34); p.rect(3, 14, 28, 19, W); p.poly([[1, 15], [17, 3], [33, 15]], G2); p.rect(13, 22, 8, 11, G3); p.rect(6, 18, 5, 5, G2); p.rect(23, 18, 5, 5, G2); for (let x = 3; x < 31; x += 4) p.set(x, 30, G3); ax = 17; ay = 33; break; }
      case 'sp_caballete': { p = new Pix(18, 30); p.line(4, 29, 9, 2, G3); p.line(14, 29, 9, 2, G3); p.line(9, 2, 9, 29, G3); p.rect(2, 6, 14, 12, W); p.rect(3, 7, 4, 4, C('#ff70c0')); p.rect(9, 10, 5, 3, C('#5ad0ff')); p.rect(5, 13, 6, 3, C('#ffd040')); ax = 9; ay = 29; break; }
      case 'sp_marco': { p = new Pix(60, 56); p.rect(2, 2, 56, 52, Au); p.rect(6, 6, 48, 44, C('#1a0a2e')); for (let i = 0; i < 18; i++) p.set(8 + (i * 7) % 44, 8 + (i * 11) % 40, C('#c080ff')); p.rect(0, 0, 60, 4, C('#ffe8a0')); p.rect(30, 0, 6, 56, C('#1a0a2e')); p.line(36, 0, 28, 56, Au); ax = 30; ay = 55; light = 1; break; }
      case 'sp_portal': { p = new Pix(44, 56); p.rect(2, 12, 8, 43, G2); p.rect(34, 12, 8, 43, G2); p.ell(22, 13, 20, 11, G2); p.ell(22, 15, 13, 8, C('#fffbe8')); p.rect(10, 15, 24, 40, C('#fffbe8')); p.rect(13, 18, 18, 37, C('#ffffff')); for (let y = 16; y < 54; y += 6) { p.set(5, y, Au); p.set(38, y, Au); } p.rect(16, 0, 12, 4, Au); ax = 22; ay = 55; light = 1; break; }
      case 'sp_puente': { p = new Pix(40, 46); p.rect(2, 10, 7, 35, C('#7a6a8a')); p.rect(31, 10, 7, 35, W); p.ell(20, 11, 18, 9, C('#9a8aaa')); p.ell(20, 13, 12, 7, C('#fff6d8')); p.rect(9, 13, 22, 32, C('#fff6d8')); for (let x = 2; x < 20; x += 3) p.set(x, 30, C('#5ad050')); p.rect(12, 18, 16, 26, C('#ffffff')); ax = 20; ay = 45; light = 1; break; }
      default: return _g2('table');
    }
    p.outline(L); return { c: p.canvas(), ax, ay, light }; }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl(M, cx, cy, list); for (const d of list) if (d.k === 'furn' && /^sp_(portal|puente|marco)$/.test(d.f) && !d.hidden) out.push({ x: d.px, y: d.py - 20, r: 70, c: 'rgba(255,250,220,0.5)' }); return out; }; }

// ---------- tick: carteles de zona, color que vuelve y las islas del cielo que no aplican aquí ----------
V33_TICKS.push(() => { const M = G.map, P = G.P; if (!M || !M.tsp || !P) return; const z = tspZoneAt(P.x, P.y); if (z !== P.tspZ) { P.tspZ = z; if (z >= 0) banner(TSP_ZONES[z].n, L2('Nivel ', 'Level ') + TSP_ZONES[z].lv[0] + ' - ' + TSP_ZONES[z].lv[1] + ' · ' + L2('pintado ', 'painted ') + Math.round(tspPaint(z) * 100) + ' %'); } });
{ const i = V33_TICKS.findIndex(f => /skyTick\(dt\)/.test(String(f))); if (i >= 0) { const f0 = V33_TICKS[i]; V33_TICKS[i] = function (dt) { const M = G.map, P = G.P; if (M && M.tsp && P) P.skyK = SKY_ISLES.findIndex(S => dist2(S.c[0] * 16, S.c[1] * 16, P.x, P.y) < (S.r * 22) * (S.r * 22)); return f0(dt); }; } }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && G.map && G.map.tsp && m.map === 'sin_pintar') { const z = tspZoneAt(m.x, m.y); tspAddPaint(z, m.boss ? 0.4 : 0.012); } } catch (e) { } return r; }; }

// ---------- mecánicas de los jefes ----------
const SHZ = [];   // círculos blancos que borran {x, y, r, ts, t0, dmg, done}
function shzAdd(x, y, r, warn, dmg) { SHZ.push({ x, y, r, ts: G.t, t0: G.t + warn, dmg }); }
WORLD_DRAW.push((cx, cy) => { if (!SHZ.length) return; for (const h of SHZ) { const k = Math.min(1, (G.t - h.ts) / Math.max(0.01, h.t0 - h.ts)), x = h.x - cx, y = h.y - cy; ctx.save(); ctx.globalAlpha = 0.25 + 0.4 * k; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(x, y, h.r, h.r * 0.72, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 0.9; ctx.strokeStyle = '#8a7ab0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, h.r * k, h.r * 0.72 * k, 0, 0, 7); ctx.stroke(); ctx.restore(); } });
V33_TICKS.push(() => { const P = G.P; if (!P || !SHZ.length) return; if (!G.map || !G.map.tsp) { SHZ.length = 0; return; }
  for (let i = SHZ.length - 1; i >= 0; i--) { const h = SHZ[i]; if (G.t < h.t0) continue; SHZ.splice(i, 1); burst(h.x, h.y, 14, { sp: 50, up: 40, g: 30, life: 0.6, c: ['#ffffff', '#d8d0e4'] });
    if (!P.dead && !(P.ifr > 0) && Math.hypot(P.x - h.x, (P.y - h.y) * 1.3) < h.r) { hurtPlayer(P.S.maxhp * h.dmg, { lv: 350 }); P.paleT = G.t + 6; floatText(P.x, P.y - 40, L2('¡BORRADO!', 'ERASED!'), '#ffffff'); } } });
// «borrado»: −15 % de ataque unos segundos
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); if (P && P === G.P && P.S && P.paleT > G.t) P.S.atk = Math.round(P.S.atk * 0.85); return r; }; }
V33_TICKS.push(() => { const P = G.P; if (P && P.paleT && P.paleT <= G.t) { P.paleT = 0; calcStats(P); } });
const tspMinions = (m, id, n) => { for (let k = 0; k < n; k++) { const s = spawnMob(id, Math.max(1, m.lv - 6), m.x + (k - n / 2) * 30, m.y + 30, m.L, null, false); if (s) { s.map = m.map; s.state = 'chase'; } } };
Object.assign(BMECH, {
  tsp_golem: { every: 8, name: L2('¡El Gólem Inacabado se dibuja de nuevo!', 'The Unfinished Golem redraws itself!'), fn: (m, P) => { tspMinions(m, 'tsp_golemito', 2); for (let i = 0; i < 3; i++) hzAdd(P.x + (Math.random() - 0.5) * (i ? 80 : 6), P.y + (Math.random() - 0.5) * (i ? 50 : 4), 20, 'root', 0.9, 0.6); } },
  tsp_rey: { every: 9, name: L2('¡El Rey en Borrador tacha el suelo! Rueda con la onda', 'The Draft King crosses out the ground! Roll with the wave'), fn: (m, P) => { for (let k = 0; k < 3; k++) HZ.push({ k: 'wave', x: m.x, y: m.y, r: 0, grow: 120, t0: G.t + 0.4 + k * 0.9, t1: G.t + 1.6 + k * 0.9, col: '#d8d0e4', ring: 1 }); tspMinions(m, 'tsp_esqueleto', 2); } },
  tsp_borron_gran: { every: 9, name: L2('¡El Gran Borrón salpica tinta! No veas lo que pisas…', 'The Great Smudge splashes ink! Watch your step…'), fn: (m, P) => { for (let i = 0; i < 4; i++) hzAdd(P.x + (Math.random() - 0.5) * (i ? 100 : 8), P.y + (Math.random() - 0.5) * (i ? 70 : 6), 22, 'slime', 0.9, 4); P.inkT = G.t + 3.5; } },
  tsp_marco: { every: 8, name: L2('¡El Guardián te enmarca! Rueda antes de que se cierre', 'The Warden frames you! Roll before it closes'), fn: (m, P) => { shzAdd(P.x, P.y, 24, 1.1, 0.16); hzAdd(P.x, P.y, 22, 'root', 1.1, 0.6); } },
  lienzo_blanco: { every: 6, name: '', fn: (m, P) => {
    const ph = m.hp / m.maxhp; if (ph < 0.6 && !m.lP2) { m.lP2 = 1; banner(L2('El Lienzo se extiende', 'The Canvas spreads'), L2('Borra más rápido y dibuja bocetos', 'It erases faster and draws sketches')); }
    if (ph < 0.25 && !m.lP3) { m.lP3 = 1; banner(L2('Todo se vuelve blanco', 'Everything turns white'), L2('Combina sus ataques. ¡Pinta tu camino!', 'It combines its attacks. Paint your way!')); }
    const atk = [() => { toast(L2('¡Borrar! Sal de los círculos blancos', 'Erase! Leave the white circles'), 'warn', 2); for (let i = 0; i < 6; i++) shzAdd(P.x + (Math.random() - 0.5) * (i ? 150 : 8), P.y + (Math.random() - 0.5) * (i ? 100 : 6), 22, 1.1 + i * 0.1, 0.14); },
      () => { toast(L2('¡Pincelada! La mano barre una franja', 'Brushstroke! The hand sweeps a strip'), 'warn', 2); const horiz = Math.random() < 0.5; for (let k = -6; k <= 6; k++) shzAdd(horiz ? P.x + k * 26 : P.x, horiz ? P.y : P.y + k * 20, 16, 0.9 + Math.abs(k) * 0.06, 0.2); },
      () => { toast(L2('¡Boceto! Dibuja criaturas', 'Sketch! It draws creatures'), 'warn', 2); tspMinions(m, pick(['tsp_fantasma', 'tsp_caballero', 'tsp_golemito']), m.lP2 ? 3 : 2); },
      () => { toast(L2('¡Lienzo en blanco! Rueda con cada onda', 'Blank canvas! Roll with each wave'), 'warn', 2); for (let k = 0; k < 3; k++) HZ.push({ k: 'wave', x: m.x, y: m.y, r: 0, grow: 140, t0: G.t + 0.5 + k * 0.8, t1: G.t + 1.7 + k * 0.8, col: '#ffffff', ring: 1 }); }];
    const a = Math.floor(Math.random() * atk.length); atk[a](); if (m.lP3) setTimeout(() => { if (!m.dying && !G.P.dead) atk[(a + 1 + Math.floor(Math.random() * 3)) % 4](); }, 1400);
    m.mech = m.lP3 ? 1.8 : m.lP2 ? 1.2 : 0; } },
});
SUPER_BOSS.lienzo_blanco = -1;   // el capítulo se asigna abajo

// ---------- Mael, el puente en el mundo y la entrada ----------
NPCS.pintora_mael = { n: 'Mael', title: L2('La Pintora del Borde', 'The Painter of the Border'), look: LK({ outfit: 'robe', hairStyle: 'long', hair: HAIRS.blanco, main: P5(['#5a5470', '#8a84a0', '#b8b2cc', '#dcd8ea', '#f6f4fc']), sec: CLOTH.rosa, g: 'f' }),
  lines: [L2('Sigo los trazos de la Ventisca. Donde ella todavía no ha llegado, todo está en blanco… y algo no quiere que se pinte.', 'I follow the Ventisca\'s strokes. Where she hasn\'t reached yet, everything is blank… and something doesn\'t want it painted.'), L2('Cada criatura que vences devuelve un poco de color al borde.', 'Every creature you defeat gives a little colour back to the border.')], quests: [] };
const TSP_WPOS = { gate: null };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
    const [gx, gy] = freeTileNear(W, 141, 152); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) W.flags[W.I(gx + dx, gy + dy)] |= 16; addObj(W, 'furn', gx, gy, { f: 'sp_puente', fp: [[0, 0]] }); TSP_WPOS.gate = [gx, gy];
    const [mx, my] = freeTileNear(W, gx + 2, gy + 2); W.npcDefs.push({ id: 'pintora_mael', x: mx, y: my, face: 'left' }); }; }
function goSinPintar() { const P = G.P, M = makeSinPintar(); transition(() => { P.inside = 'sin_pintar'; if (P.map === 'world') { P.retX = P.x; P.retY = P.y; } setMap(M, (TSP_GATE[0] + 4) * 16 + 8, TSP_GATE[1] * 16 + 8, 'right');
    P.tsp = P.tsp || {}; if (!P.tsp.seen) { P.tsp.seen = 1; banner(L2('Las Tierras sin Pintar', 'The Unpainted Lands'), L2('Donde la Ventisca todavía no ha llegado', 'Where the Ventisca has not reached yet')); if (typeof loreUnlock === 'function') loreUnlock(CH_SIN_PINTAR); } markDirty(); }); }
function backFromSinPintar() { const P = G.P, W = G.world, p = TSP_WPOS.gate || [141, 152]; transition(() => { P.inside = null; setMap(W, p[0] * 16 + 8, (p[1] + 2) * 16 + 8, 'down'); }); }
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && !P.dead) { const tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16); for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const i = tileAt(M, tx + dx, ty + dy); if (i < 0 || M.objAt[i] < 0) continue; const o = M.objs[M.objAt[i]];
      if (o.k === 'furn' && (o.f === 'sp_puente' || o.f === 'sp_portal')) return { kind: 'sp_gate', o, label: M.tsp ? (o.f === 'sp_portal' ? L2('La luz del Lienzo', 'The light of the Canvas') : L2('Volver al mundo pintado', 'Back to the painted world')) : L2('El puente al borde', 'The bridge to the border'), icon: ['ways'] }; } } return _it.apply(this, arguments); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(), P = G.P, M = G.map; if (!t || t.kind !== 'sp_gate') return _di();
    if (M.tsp) { if (t.o.f === 'sp_portal') { typeText(L2('Una puerta de luz blanca. Al otro lado no hay nada pintado todavía. Algún día la Ventisca llegará hasta aquí.', 'A door of white light. On the other side nothing is painted yet. Someday the Ventisca will reach this far.')); return; } backFromSinPintar(); return; }
    if (!(P.quests.done && P.quests.done.vr6)) { typeText(L2('Un puente que se pierde en el blanco. Más allá, el mundo no tiene color. Mael dice que solo quien venció a la Luna Sonriente aguantaría lo que hay al otro lado.', 'A bridge that fades into white. Beyond it, the world has no colour. Mael says only someone who defeated the Smiling Moon could endure what lies beyond.')); return; }
    goSinPintar(); }; }

// ---------- misiones ----------
const TSP_Q = [['tsp1', 'tsp_golem', L2('Lo inacabado', 'The Unfinished'), 315, 0, [L2('El primer boceto se levantó solo: un gólem a medio dibujar. Si cae, la orilla recupera su color.', 'The first sketch rose by itself: a half-drawn golem. If it falls, the shore gets its colour back.')]],
  ['tsp2', 'tsp_rey', L2('Un rey en borrador', 'A King in Draft'), 328, 1, [L2('Alguien dibujó a Varkhul de memoria, sin terminar. Es un eco: lo vencido no vuelve igual.', 'Someone drew Varkhul from memory, unfinished. It\'s an echo: what is defeated never returns the same.')]],
  ['tsp3', 'tsp_borron_gran', L2('La mancha que crece', 'The Spreading Stain'), 338, 2, [L2('En la ciénaga, la tinta se derramó y cobró vida. Ciega a quien la pisa.', 'In the swamp, ink spilled and came alive. It blinds whoever steps in it.')]],
  ['tsp4', 'tsp_marco', L2('El marco roto', 'The Broken Frame'), 345, 3, [L2('Hay un marco dorado partido en dos. Su guardián encierra a quien se acerca dentro de un cuadro sin pintar.', 'There is a golden frame split in two. Its warden traps anyone who comes near inside an unpainted picture.')]],
  ['tsp5', 'lienzo_blanco', L2('El Lienzo en Blanco', 'The Blank Canvas'), 350, 4, [L2('Ahí está. El silencio de Nihil, pero blanco: lo que queda donde nadie ha pintado. Quiere que el borde siga vacío para siempre.', 'There it is. Nihil\'s silence, but white: what remains where no one has painted. It wants the border to stay empty forever.'), L2('Vence y la Ventisca podrá seguir pintando.', 'Win and the Ventisca will be able to keep painting.')]]];
q('tsp0', { n: L2('El puente al borde', 'The Bridge to the Border'), giver: 'pintora_mael', lv: 300, pre: 'vr6', desc: L2('Mael, la Pintora del Borde, te espera junto al puente al este de Albor. Crúzalo y mira el mundo sin pintar.', 'Mael, the Painter of the Border, waits by the bridge east of Albor. Cross it and see the unpainted world.'),
  obj: [{ t: 'level', n: 300, txt: L2('Ten nivel 300 o más', 'Be level 300 or higher') }], rew: { xp: 2000000, gold: 200000 },
  offer: [L2('¿Ves dónde se acaba el color? Ahí se acaba el mundo… por ahora. La Ventisca pinta cada estación un poco más.', 'See where the colour ends? That\'s where the world ends… for now. The Ventisca paints a little more each season.'), L2('Pero algo borra lo que ella pinta. Cruza el puente y ayúdame.', 'But something erases what she paints. Cross the bridge and help me.')],
  prog: [L2('El puente está al este de Albor.', 'The bridge is east of Albor.')], done: [L2('Bienvenida al borde. Cada criatura que venzas le devolverá el color.', 'Welcome to the border. Every creature you defeat will give it back its colour.')] });
TSP_Q.forEach(([id, b, n, lv, z, off], i) => { const Z = TSP_ZONES[z]; q(id, { n, giver: 'pintora_mael', lv, pre: i ? TSP_Q[i - 1][0] : 'tsp0', desc: L2('Vence a ', 'Defeat ') + BOSSES[b].n + L2(' en ', ' in ') + Z.n + L2(' (Tierras sin Pintar).', ' (Unpainted Lands).'), obj: [{ t: 'boss', b, loc: [Z.c[0], Z.c[1] - 4] }], rew: { xp: 3000000 + i * 800000, gold: 250000 + i * 100000 },
  offer: off, prog: [Z.n], done: [L2('El color vuelve. Mira cómo tiembla el pincel del cielo: le has abierto camino.', 'The colour returns. Look how the brush in the sky trembles: you have cleared the way for it.')] }); });
NPCS.pintora_mael.quests.push('tsp0', ...TSP_Q.map(x => x[0]));
{ const _cq = completeQuest; completeQuest = function (id) { const r = _cq.apply(this, arguments); if (id === 'tsp5') { banner(L2('El borde respira', 'The border breathes'), L2('La Ventisca puede seguir pintando', 'The Ventisca can keep painting')); } return r; }; }
// Mael: cambiar Tinta Viva por Trazos
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'pintora_mael') return; opts.unshift({ label: '🖌 ' + L2('Pintar tu hilo (10 Tinta Viva → experiencia de Trazo)', 'Paint your thread (10 Living Ink → Stroke experience)'), icon: ['drop', '#5a3a9a'], fn: () => {
  if (countItem('tinta_viva') < 10) { typeText(L2('Necesito 10 gotas de Tinta Viva. La sueltan las criaturas sin pintar.', 'I need 10 drops of Living Ink. Unpainted creatures drop it.')); return; } takeItem('tinta_viva', 10); trzGain(trzNeed(trzLv()) * 0.25, true); typeText(L2('Ya está. Tu hilo tiene un poco más de color.', 'There. Your thread has a little more colour.')); } }); });

// ---------- Trazos: progreso después del nivel máximo ----------
const TRZ_MAX = 50;
function trzLv() { const P = G.P; return (P && P.trz && P.trz.lv) | 0; }
function trzNeed(l) { return Math.round(xpToNext(MAXLV - 1) * 0.6 * (1 + l * 0.06)); }
function trzGain(n, force) { const P = G.P; if (!P || (P.lv < MAXLV && !force)) return; P.trz = P.trz || { lv: 0, xp: 0 }; if (P.trz.lv >= TRZ_MAX) return; P.trz.xp += n;
  while (P.trz.lv < TRZ_MAX && P.trz.xp >= trzNeed(P.trz.lv)) { P.trz.xp -= trzNeed(P.trz.lv); P.trz.lv++; banner(L2('Trazo ', 'Stroke ') + P.trz.lv + '/' + TRZ_MAX, L2('+0,4 % de ataque, defensa y vida', '+0.4% attack, defence and HP')); sfx('level'); calcStats(P); } markDirty(); }
{ const _gx = gainXp; gainXp = function (n) { const P = G.P; if (P && P.lv >= MAXLV && n > 0) { let m = n; if (P.xpBT > 0) m = Math.round(m * 1.5); trzGain(m); } return _gx.apply(this, arguments); }; }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); if (P && P === G.P && P.S && P.trz && P.trz.lv && !(typeof DUEL !== 'undefined' && DUEL)) { const k = 1 + P.trz.lv * 0.004; P.S.atk = Math.round(P.S.atk * k); P.S.def = Math.round(P.S.def * k); P.S.maxhp = Math.round(P.S.maxhp * k); } return r; }; }

// ---------- lore, cinemática, pista y guía ----------
const CH_SIN_PINTAR = CRON.length;
CRON.push([L2('Las Tierras sin Pintar', 'The Unpainted Lands'), L2('El mundo no termina en el mar: termina donde se acaba el color. Más allá del último pueblo, la Ventisca todavía no ha pintado, y el suelo es un boceto blanco sobre el vacío. Allí el silencio de Nihil no es negro: es blanco, un lienzo vacío que no quiere que nada se pinte nunca. Lo llaman el Lienzo en Blanco. Dibuja de memoria ecos inacabados de lo que ya venciste y borra lo que la Ventisca pinta. Mael, una pintora que sigue sus trazos, dice que cada criatura que cae devuelve un poco de color al borde. Y en el cielo, una mano enorme sigue pintando.', 'The world doesn\'t end at the sea: it ends where colour runs out. Beyond the last village, the Ventisca has not painted yet, and the ground is a white sketch over the void. There Nihil\'s silence is not black: it is white, an empty canvas that wants nothing ever painted. They call it the Blank Canvas. It draws unfinished echoes of what you already defeated from memory and erases what the Ventisca paints. Mael, a painter who follows her strokes, says every creature that falls gives a little colour back to the border. And in the sky, an enormous hand keeps painting.')]);
ERAS[ERAS.length - 1][1].push(CH_SIN_PINTAR);
SUPER_BOSS.lienzo_blanco = CH_SIN_PINTAR;
if (typeof CLUES !== 'undefined') CLUES.p_sinpintar = ['lugar', L2('El borde del mundo', 'The edge of the world'), L2('Hay una franja donde el mundo no tiene color, como si nadie lo hubiera terminado.', 'There is a strip where the world has no colour, as if no one had finished it.'), CH_SIN_PINTAR];
{ const _gs = goSinPintar; goSinPintar = function () { try { clueUnlock('p_sinpintar', true); } catch (e) { } return _gs.apply(this, arguments); }; }
if (typeof CN_SC !== 'undefined') {
  CN_SC.sinpintar = (x, t, k) => { cnSky(x, '#3a2a6a', '#d8c8f0'); const split = 90 + k * 60; cnR(x, '#4caa4c', 0, 104, split, 40); cnR(x, '#f2eef8', split, 104, CN_W - split, 40); for (let i = 0; i < CN_W; i += 6) cnR(x, i < split ? '#5aba5a' : '#d8d0e4', i, 104, 3, 1);
    cnR(x, '#1a0a2e', split + 20, 120, CN_W, 24); cnEyes(x, split + 80, 132, t, 0.6, '#e070ff'); [20, 44].forEach((hx, i) => cnHouse(x, hx, 104, true)); x.strokeStyle = '#b8b0c8'; x.strokeRect(split + 30, 84, 14, 20); x.strokeRect(split + 70, 90, 20, 14);
    x.globalAlpha = 0.8; x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(70 + k * 60, 30, 18, 10, -0.4, 0, 7); x.fill(); x.strokeStyle = '#e8e0f0'; x.lineWidth = 3; x.beginPath(); x.moveTo(78 + k * 60, 34); x.lineTo(110 + k * 60, 70); x.stroke(); x.globalAlpha = 1; cnHero(x, split - 10, 106, t, true, 2); };
  { const _cc = cnChapterScenes; cnChapterScenes = function (ch) { return ch === CH_SIN_PINTAR ? ['sinpintar', 'corona'] : _cc(ch); }; }
}
if (typeof GSIS !== 'undefined') GSIS.push(['sin_pintar', '🖌 ' + L2('Las Tierras sin Pintar', 'The Unpainted Lands'), () => [
  L2('Continente del borde del mundo (nivel 300-350), después del Velo Roto. Se entra por el puente blanco al este de Albor cuando has vencido a la Luna Sonriente (misión «La Luna que sonríe»). Habla con Mael, la Pintora del Borde.', 'Continent at the edge of the world (level 300-350), after the Broken Veil. You enter through the white bridge east of Albor once you have defeated the Smiling Moon (quest "The Moon that Smiles"). Talk to Mael, the Painter of the Border.'),
  L2('Todo está sin color. Cada criatura que vences devuelve color a su zona y cada jefe, mucho más: al 100 % la zona queda pintada. Zonas: Orilla del Boceto, Llanura de los Trazos, Ciénaga de los Borrones, El Marco Roto y El Lienzo en Blanco.', 'Everything is colourless. Every creature you defeat gives colour back to its zone and every boss much more: at 100% the zone is painted. Zones: Sketch Shore, Plain of Strokes, Swamp of Smudges, The Broken Frame and The Blank Canvas.'),
  L2('Jefes: El Gólem Inacabado (se redibuja y llama gólems), El Rey en Borrador (ondas: rueda), El Gran Borrón (charcos pegajosos y te ciega con tinta), El Guardián del Marco (te enmarca: rueda) y el súper jefe El Lienzo en Blanco: círculos blancos que borran (−15 % de ataque unos segundos), pinceladas en franja, bocetos de criaturas y ondas. Al 60 % y al 25 % se vuelve más rápido y combina ataques.', 'Bosses: The Unfinished Golem (redraws itself and calls golems), The Draft King (waves: roll), The Great Smudge (sticky puddles and blinds you with ink), The Frame Warden (frames you: roll) and the super boss The Blank Canvas: white circles that erase (−15% attack for a few seconds), strip brushstrokes, creature sketches and waves. At 60% and 25% it gets faster and combines attacks.'),
  L2('Trazos: al nivel máximo, la experiencia suma Trazos (hasta 50; cada uno +0,4 % de ataque, defensa y vida, no cuenta en duelos). Mael cambia 10 Tinta Viva por un buen trozo de Trazo.', 'Strokes: at max level, experience adds Strokes (up to 50; each +0.4% attack, defence and HP, not in duels). Mael trades 10 Living Ink for a good chunk of Stroke.')],
  () => TSP_WPOS.gate ? { loc: [TSP_WPOS.gate[0], TSP_WPOS.gate[1]], t: L2('Puente al borde (este de Albor)', 'Bridge to the border (east of Albor)') } : null]);

// dificultad medida con tools/dev/jefes.py (continente 3-5 min, el Lienzo en Blanco 10 min en solitario)
if (typeof BOSS_TUNE !== 'undefined') Object.assign(BOSS_TUNE, { tsp_golem: 1.58, tsp_rey: 1.6, tsp_borron_gran: 1.57, tsp_marco: 1.56, lienzo_blanco: 2.83 });
