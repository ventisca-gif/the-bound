// ================= v5.87: ROPA DE LOS MARES (cosméticos por piezas) · tienda en La Tortuga Glotona =================
// Sergio mandó fotos de 4 atuendos (espadachín, francotirador, navegante y cocinero) y pidió su ropa por piezas como
// cosméticos, «igualita, hasta el pañuelo de la cabeza». Se venden en La Tortuga Glotona (Modista Marea, recepción).
// Solo ropa (sin estadísticas). Todo con fitKind y los anclajes del motor: sirve para las 10 estructuras y 4 direcciones.
// También: el mapa ya no se rompe si un punto trae una categoría desconocida (la 5.86 usaba 'shop', que no existe).
{ const _dp = drawPOIs; drawPOIs = function (x, sc, pois, dimFn) { return _dp.call(this, x, sc, (pois || []).filter(q => q && MAPC[q.c]), dimFn); }; }

const RM = {
  zverde: P5(['#050806', '#0c120e', '#141e16', '#1e2c22', '#2e4232']), haramaki: P5(['#1e4a1a', '#2e6a24', '#46902e', '#62b03e', '#8ad05a']),
  blanco: P5(['#9a968c', '#c8c4b8', '#e8e4d8', '#f6f4ec', '#ffffff']), negro: P5(['#060608', '#101014', '#1a1a20', '#26262e', '#3a3a44']),
  marron: P5(['#2e1e12', '#4a3020', '#64442c', '#80583a', '#9e7250']), oliva: P5(['#3e3a1a', '#5e5626', '#7e7434', '#9e9248', '#c0b26a']),
  lona: P5(['#6a4a14', '#9a6e1e', '#c8962c', '#e0b850', '#f4d888']), marino: P5(['#0e1e46', '#1a3478', '#2a50a8', '#4a74cc', '#8ab0ea']),
  naranja: P5(['#7a3408', '#b0520e', '#e07818', '#f09a3a', '#ffc070']), celeste: P5(['#3a7a8a', '#5aa0b0', '#86c8d4', '#ace4ea', '#d4f6f8']),
  oro: P5(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), rojo: P5(['#4a0a0c', '#7a1418', '#a82028', '#d04048', '#f07a7a'])
};
const rmSkin = (A, s) => { const S = (s && s.sk) || A.sk || SKINS[0]; return Array.from(S).map(c => typeof c === 'string' ? C(c) : c); };

// ===================== CABEZA =====================
// pañuelo negro verdoso atado (cubre la coronilla; nudo y puntas en la nuca)
fitKind('head', 'rm_panuelo', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m;
  roEll(p, hx, hy - 3.5, 8.4, 6.2, m, true); roRow(p, hx - 8, hx + 8, hy - 3, m[1]); roRow(p, hx - 7, hx + 7, hy - 4, m[2]);
  for (const [x, y] of [[-4, -7], [1, -8], [4, -6]]) roSet(p, hx + x, hy + y, m[3]);
  const kx = up ? hx : side ? hx - d * 8 : null;
  if (kx !== null) { roRect(p, kx - 1, hy - 5, 3, 3, m[2]); roSet(p, kx, hy - 4, m[4]); for (let k = 0; k < 4; k++) { roSet(p, kx + (up ? -1 : -d) * (k >> 1) - (up ? 1 : 0), hy - 2 + k, m[k & 1 ? 1 : 2]); roSet(p, kx + (up ? 1 : -d) * ((k + 1) >> 1) + (up ? 1 : 0), hy - 2 + k, m[k & 1 ? 2 : 1]); } } });
// pañuelo oliva con rombos y gafas de francotirador encima
fitKind('head', 'rm_gafas', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m, M = RO_G || RM.negro;
  roEll(p, hx, hy - 3.5, 8.4, 6.4, m, true); roRow(p, hx - 8, hx + 8, hy - 3, m[1]);
  for (let y = Math.round(hy - 9); y <= hy - 4; y++) for (let x = Math.round(hx - 8); x <= hx + 8; x++) if (((x - hx + 40) + (y - hy + 40)) % 4 === 0 || ((x - hx + 40) - (y - hy + 40) + 80) % 4 === 0) { if (uA(p.get(x, y)) && m.includes(p.get(x, y))) p.set(x, y, m[0]); }
  if (up) { roRect(p, hx - 1, hy - 4, 3, 2, M[2]); return; }
  const lenses = side ? [hx + d * 3] : [hx - 3, hx + 3]; for (const lx of lenses) { roEll(p, lx, hy - 7, 2.6, 2.4, [M[1], M[2], M[3], M[4]]); roSet(p, lx, hy - 7, C('#5a8aa0')); roSet(p, lx - 1, hy - 8, C('#d8f4ff')); roSet(p, lx + 1, hy - 6, C('#2a4a5a')); }
  if (!side) roRow(p, hx - 1, hx + 1, hy - 7, M[3]); else roRow(p, hx - d * 6, hx - d * 8, hy - 6, M[1]); });

// ===================== CUERPO =====================
// camiseta blanca de botones con faja verde ancha (haramaki); manga corta con un pañuelo verde atado en un brazo
fitKind('body', 'rm_henley', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1, H = RM.haramaki, hy0 = ty + Math.max(3, Math.round(th * 0.5));
  for (let y = ty + 1; y < hy0; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  if (!up && !side) { p.set(Math.round(cx - 1), ty, m[1]); p.set(Math.round(cx), ty, m[1]); for (let y = ty + 1; y <= ty + 3 && y < hy0; y++) { p.set(Math.round(cx - 0.5), y, m[1]); if (y > ty + 1) p.set(Math.round(cx + 0.5), y, C('#d8d4c8')); } }
  if (side) p.set(Math.round(cx + d * (tw / 2 - 1)), ty, m[1]);
  for (let y = hy0; y < ty + th; y++) for (let x = tx0; x <= R; x++) p.set(x, y, H[(x - tx0) % 2 ? 2 : 3 - (x === tx0 ? 0 : x === R ? 2 : 0)]);
  p.hl(tx0, hy0, tw, H[4]); p.hl(tx0, ty + th - 1, tw, H[1]); }, { skin: true });
// peto marrón sobre el pecho, tirantes con hebillas doradas, faja blanca anudada y la correa de la bolsa en diagonal
fitKind('body', 'rm_peto', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, S = rmSkin(A, s), R = tx0 + tw - 1, waist = ty + th - 2, W = RM.blanco;
  if (!up && !side) { const b0 = Math.round(cx - tw * 0.28), b1 = Math.round(cx + tw * 0.28) - 1, top = ty + 2;
    for (let y = ty; y < top + 1; y++) for (let x = tx0; x <= R; x++) if (x < b0 || x > b1 || y < top) p.set(x, y, S[x === tx0 ? 1 : 2]);
    for (let y = top; y < waist; y++) { p.set(tx0, y, S[1]); p.set(R, y, S[1]); }
    p.vl(b0, ty, top - ty, m[1]); p.vl(b1, ty, top - ty, m[1]); p.set(b0, top, RM.oro[3]); p.set(b1, top, RM.oro[3]);
    p.rect(b0 + 1, top + 2, b1 - b0 - 1, 1, m[1]); p.vl(Math.round(cx), top + 2, Math.max(1, waist - top - 3), m[1]);
    for (let k = 0; k < th; k++) { const x = Math.round(R - 1 - k * (tw - 2) / th), y = ty + k; if (y < waist) p.set(x, y, C('#e8dcc0')); } }
  else if (side) { for (let y = ty; y < ty + 2; y++) for (let x = tx0; x <= R; x++) p.set(x, y, S[2]); p.vl(Math.round(cx), ty, 2, m[1]); }
  else { for (let y = ty; y < ty + 2; y++) for (let x = tx0; x <= R; x++) p.set(x, y, S[1]); p.line(tx0 + 1, ty, cx, ty + 4, m[1]); p.line(R - 1, ty, cx, ty + 4, m[1]); }
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, waist, W[3]); p.set(x, waist + 1, W[2]); }
  if (!up) { const kx = side ? Math.round(cx - d * 2) : tx0 + 1; for (let k = 0; k < 4; k++) p.set(kx - (side ? d : 1) * (k >> 1), waist + 2 + k, W[k & 1 ? 2 : 3]); } }, { skin: true });
// camiseta blanca con cuello en V azul y franjas azules (pecho, bajo y mangas)
fitKind('body', 'rm_marinera', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, S = rmSkin(A, s), R = tx0 + tw - 1, B = RM.marino;
  const st1 = ty + Math.max(3, Math.round(th * 0.36)), st2 = ty + th - 2;
  for (let x = tx0; x <= R; x++) { p.set(x, st1, B[2]); p.set(x, st1 + 1, B[1]); p.set(x, st1 + 3, B[3]); p.set(x, st2, B[2]); }
  if (!up && !side) { for (let y = ty; y < ty + 3; y++) { const w = 3 - (y - ty); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, S[2]); p.set(Math.round(cx - w - 1), y, B[3]); p.set(Math.round(cx + w), y, B[2]); } }
  else if (side) { p.set(Math.round(cx + d * (tw / 2 - 1)), ty, S[2]); p.set(Math.round(cx + d * (tw / 2 - 2)), ty, B[3]); }
  else p.hl(tx0 + 1, ty, tw - 2, B[2]); }, { skin: true });
// chaqueta negra cruzada con 6 botones dorados, camisa celeste y corbata blanca
fitKind('body', 'rm_traje', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1, Cc = RM.celeste, O = RM.oro;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  if (!up && !side) { const dep = Math.max(3, Math.round(th * 0.45));
    for (let y = ty; y < ty + dep; y++) { const w = Math.max(0, Math.round((1 - (y - ty) / dep) * (tw / 2 - 1.5))); for (let x = Math.round(cx - w - 0.5); x <= Math.round(cx + w - 0.5); x++) p.set(x, y, Cc[x < cx - w + 1 ? 2 : 3]); p.set(Math.round(cx - w - 1.5), y, m[4]); p.set(Math.round(cx + w + 0.5), y, m[3]); }
    for (let y = ty; y < ty + dep; y++) p.set(Math.round(cx - 0.5), y, W_(y === ty ? 2 : 4)); p.set(Math.round(cx - 0.5), ty + dep, RM.blanco[3]);
    for (let r = 0; r < 3; r++) { const y = ty + dep + 1 + r * 2; if (y >= ty + th - 1) break; p.set(Math.round(cx - 2.5), y, O[3]); p.set(Math.round(cx + 1.5), y, O[3]); } }
  else if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, Cc[3]); p.set(fx, ty + 1, RM.blanco[4]); p.set(fx - d, ty + 3, O[3]); p.set(fx - d, ty + 5, O[3]); }
  else { p.hl(tx0 + 2, ty, tw - 4, Cc[2]); p.vl(Math.round(cx - 0.5), ty + 3, th - 4, m[0]); } });
const W_ = k => RM.blanco[k];

// ===================== PIERNAS =====================
// pantalón largo (negro o marrón) con raya o dobladillo; marca el pliegue en cada pierna
fitKind('legs', 'rm_pantalon', (p, A, s) => { const m = s.m, cols = new Set(m); for (const [x, y] of roLegPix(p, A, cols, A.legTop, A.base - 3)) { const k = m.indexOf(p.get(x, y)); if (k === 3 && (y - A.legTop) % 3 === 1) p.set(x, y, m[4]); }
  if (s.cuff) for (const [x, y] of roLegPix(p, A, cols, A.base - 4, A.base - 4)) p.set(x, y, m[1]); });
// minifalda naranja con vuelo y un aro dorado; las piernas quedan a la vista
fitKind('legs', 'rm_minifalda', (p, A, s) => { const m = s.m, cols = new Set(m), S = rmSkin(A, s), lt = Math.round(A.legTop), end = lt + 2;
  for (const [x, y] of roLegPix(p, A, cols, lt, A.base - 1)) { const k = m.indexOf(p.get(x, y)); if (y > end) p.set(x, y, S[Math.min(S.length - 1, Math.max(0, k - 1))]); }
  const { tx0, tw, side, d, up } = A, x0 = Math.round(tx0) - 1, x1 = Math.round(tx0 + tw);
  for (let y = lt - 1; y <= end; y++) { const g = y - lt + 1, a = x0 - (g >> 1), b = x1 + (g >> 1); for (let x = a; x <= b; x++) p.set(x, y, m[x === a ? 3 : x === b ? 1 : y === end ? 1 : 2]); }
  if (!up && !side) { const rx = Math.round(tx0 + tw * 0.75), ry = lt + 1; p.set(rx, ry, RM.oro[3]); p.set(rx + 1, ry, RM.oro[2]); p.set(rx, ry + 1, RM.oro[2]); p.set(rx + 1, ry + 1, m[2]); } }, { skin: true });

// ===================== PIES =====================
fitKind('feet', 'rm_zapato', (p, A, s) => { const m = s.m, cols = new Set(m); for (const [x, y] of roLegPix(p, A, cols, A.base - 3, A.base)) if (m.indexOf(p.get(x, y)) >= 2 && (x + y) % 3 === 0) p.set(x, y, m[4]); });

// ===================== ESPALDA / CINTURA =====================
// tres katanas al cinto (blanca, negra y roja), en la cadera izquierda
fitKind('back', 'rm_katanas', (p, A) => { const { cx, tx0, tw, torsoTop: ty, th, side, up, d } = A, hy = ty + th - 1;
  const sw = [[RM.blanco, 0], [RM.negro, 2], [RM.rojo, 4]], sx = up ? Math.round(tx0 - 2) : side ? Math.round(cx - d * 2) : Math.round(tx0 + tw + 1);
  sw.forEach(([c, k], i) => { const dir = up ? -1 : side ? -d : 1, y0 = hy - 5 + i, len = 13 - i;
    for (let t = 0; t < len; t++) { const x = sx + dir * Math.round(t * 0.55) + (side ? 0 : dir * i * 2), y = y0 + t; p.set(x, y, t < 3 ? (t === 1 ? RM.oro[2] : RM.negro[3]) : c[t === len - 1 ? 1 : 2]); }
    const gx = sx + dir * (i + 1), gy = y0 + 3; p.set(gx, gy, RM.oro[3]); p.set(gx - dir, gy, RM.oro[2]);
    for (let t = 1; t <= 3; t++) p.set(sx - dir * t + (side ? 0 : dir * i * 2), y0 - t, t === 3 ? RM.oro[3] : RM.negro[t & 1 ? 2 : 4]); }); });
// bolsa de lona amarilla a la cadera
fitKind('back', 'rm_bolsa', (p, A) => { const { cx, tx0, tw, torsoTop: ty, th, side, up, d } = A, L = RM.lona, bx = up ? Math.round(tx0 - 2) : side ? Math.round(cx - d * 3) : Math.round(tx0 + tw + 1), by = ty + th + 2;
  p.ball(bx, by, 3.6, 3.2, L.slice(1)); p.hl(bx - 2, by - 3, 5, L[1]); p.set(bx, by - 4, L[2]); p.set(bx - 1, by + 1, L[2]); if (up) p.line(bx + 1, by - 4, Math.round(cx + tw / 2), ty, C('#e8dcc0')); });

// ---------- brazos: mangas cortas o sin mangas, pañuelo atado y muñequera ----------
const RM_ARM = { rm_henley: { sl: 3, cuff: 1, band: 'z' }, rm_peto: { sl: 0, wrist: 1 }, rm_marinera: { sl: 3, cuff: 2 } };
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments);
  try { const T = L && L.top, cfg = T && RM_ARM[T.k]; if (cfg && p.t && p.meta) { const A = p.meta, M = T.m, S = rmSkin(A, T), ty = A.torsoTop, ey = ty + cfg.sl, rows = {};
    for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3) { const y = (i / p.w) | 0, k = M.indexOf(p.d[i]); if (k < 0) continue; const x = i % p.w; (rows[y] = rows[y] || []).push(x);
      if (cfg.sl && y < ey) continue; if (cfg.cuff && y === ey) { p.d[i] = cfg.cuff === 2 ? RM.marino[2] : M[4]; continue; } p.d[i] = S[Math.min(S.length - 1, Math.max(0, k - 1))]; }
    if (cfg.band === 'z' && !A.up) { const y = ty + 1; for (const x of rows[y] || []) if (A.side || x > A.cx) p.set(x, y, RM.zverde[2]); }
    if (cfg.wrist && !A.up) { const ys = Object.keys(rows).map(Number).sort((a, b) => b - a); const yw = ys[2]; if (yw !== undefined) for (const x of rows[yw]) if (A.side || x > A.cx) { p.set(x, yw, RM.marino[3]); p.set(x, yw - 1, RM.blanco[4]); } } } } catch (e) { }
  return r; }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, o) { const L = _hl.apply(this, arguments);
  try { if (!L) return L; const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c);
    if (L.top && RM_ARM[L.top.k]) L.top = Object.assign({}, L.top, { sk: SK }); if (L.bot && L.bot.k === 'rm_minifalda') L.bot = Object.assign({}, L.bot, { sk: SK }); } catch (e) { } return L; }; }

// ---------- los cosméticos (por piezas) ----------
const RM_SRC = L2('Modista Marea · La Tortuga Glotona (Mar de Dawn)', 'Marea the dressmaker · The Gluttonous Turtle (Dawn Sea)');
const RM_SETS = [
  ['🗡 ' + L2('Espadachín', 'Swordsman'), [
    ['c_rm_esp_panuelo', L2('Pañuelo negro de espadachín', 'Swordsman\'s black headscarf'), 'head', () => ({ k: 'rm_panuelo', m: RM.zverde, cover: 'hat' }), 18000],
    ['c_rm_esp_camisa', L2('Camiseta de botones y faja verde', 'Button tee and green belly band'), 'body', () => ({ k: 'rm_henley', m: RM.blanco, s: RM.haramaki }), 24000],
    ['c_rm_esp_pantalon', L2('Pantalón negro de espadachín', 'Swordsman\'s black trousers'), 'legs', () => ({ k: 'rm_pantalon', m: RM.negro }), 18000],
    ['c_rm_esp_botas', L2('Botas negras de espadachín', 'Swordsman\'s black boots'), 'feet', () => ({ k: 'boots', m: RM.negro }), 15000],
    ['c_rm_esp_katanas', L2('Tres katanas al cinto', 'Three katanas at the hip'), 'back', () => ({ k: 'rm_katanas' }), 30000]]],
  ['🎯 ' + L2('Francotirador', 'Sharpshooter'), [
    ['c_rm_tir_panuelo', L2('Pañuelo con gafas de francotirador', 'Sharpshooter\'s headscarf and goggles'), 'head', () => ({ k: 'rm_gafas', m: RM.oliva, cover: 'hat' }), 18000],
    ['c_rm_tir_peto', L2('Peto marrón con faja blanca', 'Brown overall bib with white sash'), 'body', () => ({ k: 'rm_peto', m: RM.marron, s: RM.marron }), 22000],
    ['c_rm_tir_pantalon', L2('Pantalón de peto marrón', 'Brown overall trousers'), 'legs', () => ({ k: 'rm_pantalon', m: RM.marron, cuff: 1 }), 16000],
    ['c_rm_tir_bolsa', L2('Bolsa de lona del francotirador', 'Sharpshooter\'s canvas bag'), 'back', () => ({ k: 'rm_bolsa' }), 15000]]],
  ['🧭 ' + L2('Navegante', 'Navigator'), [
    ['c_rm_nav_camiseta', L2('Camiseta blanca de franjas azules', 'White tee with blue stripes'), 'body', () => ({ k: 'rm_marinera', m: RM.blanco, s: RM.marino }), 20000],
    ['c_rm_nav_falda', L2('Minifalda naranja de navegante', 'Navigator\'s orange miniskirt'), 'legs', () => ({ k: 'rm_minifalda', m: RM.naranja }), 18000],
    ['c_rm_nav_sandalias', L2('Sandalias de navegante', 'Navigator\'s sandals'), 'feet', () => ({ k: 'sandals', m: RM.marron }), 12000]]],
  ['🍳 ' + L2('Cocinero', 'Cook'), [
    ['c_rm_coc_traje', L2('Chaqueta negra cruzada con corbata', 'Black double-breasted jacket and tie'), 'body', () => ({ k: 'rm_traje', m: RM.negro, s: RM.negro }), 26000],
    ['c_rm_coc_pantalon', L2('Pantalón de traje negro', 'Black suit trousers'), 'legs', () => ({ k: 'rm_pantalon', m: RM.negro }), 18000],
    ['c_rm_coc_zapatos', L2('Zapatos negros de vestir', 'Black dress shoes'), 'feet', () => ({ k: 'rm_zapato', m: RM.negro }), 14000]]]
];
const RM_IDS = [];
for (const [set, pieces] of RM_SETS) for (const [id, n, slot, vis, price] of pieces) { cosm(id, n, slot, vis, { src: RM_SRC }); it('cosi_' + id, { n, t: 'cos', cos: id, price, icon: ['hanger'], rar: 4, d: set + ' · ' + L2('cosmético, se pone en el Armario. ', 'cosmetic, wear it from the Wardrobe. ') + RM_SRC + '.' }); RM_IDS.push(id); }
SHOPS.tgmoda = { tortuga: RM_IDS.map(id => 'cosi_' + id) };
{ const _sp = itemSources; itemSources = function (id) { if (RM_IDS.includes(String(id).replace(/^cosi_/, ''))) return [[RM_SRC, { loc: [229, 129], m: 'world', t: L2('Capitana Marina (bote a Dawn)', 'Captain Marina (boat to Dawn)') }]]; return _sp.apply(this, arguments); }; }

// ---------- la modista en la recepción de la tortuga ----------
TG_CAST.tg_modista = { n: L2('Modista Marea', 'Marea the dressmaker'), g: 'f', bt: 1, hair: 'turquesa_v', skin: 1, hs: 14, top: 'rosa', bot: 'blanco' };
DAWN_CAST.tg_modista = TG_CAST.tg_modista;
NPCS.tg_modista = { n: TG_CAST.tg_modista.n, title: TG_NAME, look: LK({}), quests: [], lines: [L2('Ropa de los mares, por piezas: el espadachín, el francotirador, la navegante y el cocinero. ¡Pruébatela!', 'Sea clothes, piece by piece: the swordsman, the sharpshooter, the navigator and the cook. Try them on!')] };
DLG_HOOKS.push((npc, opts) => { if (npc && npc.id === 'tg_modista') opts.unshift({ label: '👕 ' + L2('Ver la ropa de los mares', 'See the sea clothes'), icon: ['hanger'], fn: () => { closeDialog(); openShop('tgmoda', 'tortuga'); } }); });
{ const _mt = makeTortuga; makeTortuga = function () { const had = !!G.maps.tortuga, M = _mt.apply(this, arguments);
  if (!M.rmModa) { M.rmModa = 1; if (!G.ents.some(e => e.id === 'tg_modista' && e.map === 'tortuga')) spawnNPC('tg_modista', 27 * 16 + 8, 30 * 16 + 10, 'tortuga', { face: 'down', L: 0 });
    addObj(M, 'furn', 28, 31, { f: 'rm_maniqui', fp: [[0, 0]] }); addObj(M, 'furn', 26, 31, { f: 'rm_maniqui2', fp: [[0, 0]] }); } return M; }; }
// maniquíes con la ropa puesta (dibujados con el motor)
const rmMani = (cos, g) => () => { const L = heroLook('guerrero', Object.assign({}, DEF_APP, { g, hair: 'negro' }), {}, cos, {}); L.weapon = null; const A = buildHeroAtlas(L), c = mkCanvas(34, 44), x = c.getContext('2d'); x.drawImage(A.img, A.idx.idle * A.fw + 7, 3, 34, 44, 0, 0, 34, 44);
  const st = new Pix(34, 6); st.rect(14, 0, 6, 4, RM.marron[2]); st.rect(9, 4, 16, 2, RM.marron[1]); x.drawImage(st.canvas(), 0, 38); return { c, ax: 17, ay: 42 }; };
XSPR.rm_maniqui = rmMani({ head: 'c_rm_esp_panuelo', body: 'c_rm_esp_camisa', legs: 'c_rm_esp_pantalon', feet: 'c_rm_esp_botas', back: 'c_rm_esp_katanas' }, 'm');
XSPR.rm_maniqui2 = rmMani({ body: 'c_rm_nav_camiseta', legs: 'c_rm_nav_falda', feet: 'c_rm_nav_sandalias' }, 'f');
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); try { if (M && M.tortuga) out.push({ c: 'tailor', x: 27, y: 30, t: L2('Modista Marea · ropa de los mares', 'Marea the dressmaker · sea clothes') }); } catch (e) { } return out; }; }
if (typeof GSIS !== 'undefined') { const g = GSIS.find(x => x[0] === 'tortuga586'); if (g) { const f = g[2]; g[2] = () => f().concat([L2('👕 Modista Marea (recepción, junto a la puerta) vende la ropa de los mares por piezas, como cosméticos: Espadachín (pañuelo, camiseta con faja verde, pantalón, botas y tres katanas al cinto), Francotirador (pañuelo con gafas, peto, pantalón y bolsa), Navegante (camiseta de franjas, minifalda y sandalias) y Cocinero (chaqueta cruzada, pantalón y zapatos).', '👕 Marea the dressmaker (reception, by the door) sells the sea clothes piece by piece as cosmetics: Swordsman (headscarf, tee with green band, trousers, boots and three katanas), Sharpshooter (headscarf with goggles, bib, trousers and bag), Navigator (striped tee, miniskirt and sandals) and Cook (double-breasted jacket, trousers and shoes).')]); } }
// la tortuga no es un pueblo: precio normal (sin reputación, crimen ni festivales de pueblo)
{ const _tp = townPriceMul; townPriceMul = function (town) { if (town === 'tortuga') return 1; return _tp.apply(this, arguments); }; }
