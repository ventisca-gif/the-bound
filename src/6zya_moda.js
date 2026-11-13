// ================= v4.7: BOUTIQUE, MODISTA, ROPA NUEVA Y MASCOTA BUFANDÍN =================

// ---------- ropa nueva (se ajusta sola a las 8 estructuras con fitKind, ver 6zx_fit) ----------
// Suéter de punto: negro, cuello alto con cuadrícula blanca, franja carmesí en pecho y mangas, puños y bajo rosas,
// botones dorados. Basado en el personaje de Sergio (segunda y tercera imagen).
fitKind('body', 'sweater', (p, A, s) => {
  const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, band = s.band, rib = s.r, W = C('#e8e4f0');
  const by0 = ty + Math.max(3, Math.round(th * 0.5)), by1 = by0 + 1;   // misma fila que la franja de las mangas (drawArm)
  for (let y = by0; y <= by1; y++) for (let x = tx0; x <= R; x++) if (uA(p.get(x, y))) p.set(x, y, band[y === by0 ? 3 : 2]);
  if (!up) for (let x = tx0 + 1; x < R; x += 3) p.set(x, by0, band[4]);   // puntadas claras de la franja
  for (let x = tx0; x <= R; x++) { p.set(x, ty + th - 1, rib[(x % 2) ? 2 : 3]); p.set(x, ty + th, rib[(x % 2) ? 1 : 2]); }   // bajo acanalado rosa (suéter holgado)
  // cuello alto con cuadrícula blanca
  const c0 = side ? cx - 3 : cx - 3, cw = side ? 5 : 6;
  for (let y = ty - 1; y <= ty + 1; y++) for (let x = c0; x < c0 + cw; x++) p.set(x, y, ((x - c0) % 2 === 1 && !up) || y === ty ? W : s.m[1]);
  if (!up && !side) { p.set(cx - 2, ty + 3, GOLD[4]); p.set(cx, ty + 3, GOLD[4]); p.set(cx - 1, ty + 4, GOLD[3]); p.set(cx + 1, ty + 4, GOLD[3]); }   // botones
  if (!up) { p.set(tx0 + 1, ty + 2, uMix(s.m[2], W, 0.4)); p.set(R - 1, by1 + 2, uMix(s.m[2], W, 0.3)); }   // brillos de lana
});
// zapatillas: suela blanca y cordón oscuro sobre el color del calzado
fitKind('feet', 'sneakers', (p, A, s) => {
  const sole = C('#f4f0f4'), lace = C('#1a1418'), cols = new Set(s.m), lo = {};
  for (let y = A.legTop; y < Math.min(p.h, A.base + 4); y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) lo[x] = y;
  for (const x in lo) { const y = lo[x]; p.set(+x, y, sole); if (uA(p.get(+x, y - 1)) && cols.has(p.get(+x, y - 1)) && (+x % 2 === 0) && !A.up) p.set(+x, y - 1, lace); }
});
// tirita en la mejilla (va pegada a la cara: sigue la línea de los ojos)
fitKind('head', 'bandage', (p, A, s) => {
  if (A.up) return; const y = A.ey + 3, x = A.side ? (A.dir === 'left' ? A.hx - 5 : A.hx + 3) : A.eyes[0] - 1;
  p.hl(x, y, 3, s.m[3]); p.hl(x, y + 1, 3, s.m[2]); p.set(x + 1, y, s.m[1]); p.set(x + 1, y + 1, s.m[1]);
}, { face: true });
// pantalón holgado largo: se arruga sobre el calzado
fitKind('legs', 'baggy', (p, A, s) => {
  if (!s.bunch) return; const cols = new Set([s.m[1], s.m[2], s.m[3]]), y0 = A.base - 5, y1 = A.base - 3;
  for (let y = y0; y <= y1; y++) { const row = []; for (let x = 1; x < p.w - 1; x++) if (cols.has(p.get(x, y))) row.push(x);   // primero se miran, luego se pintan (si no, se propaga)
    for (const x of row) { if (!uA(p.get(x - 1, y))) p.set(x - 1, y, s.m[1]); if (!uA(p.get(x + 1, y))) p.set(x + 1, y, s.m[1]); if ((x + y) % 3 === 0) p.set(x, y, s.m[0]); } }
});
const MODA_PAL = {
  sueter: P5(['#060408', '#0e0a12', '#18121e', '#241c2c', '#36293e']), franja: P5(['#4a0a14', '#7a1424', '#b0283a', '#d84a5a', '#f2a0b0']),
  rosa: P5(['#7a3a52', '#b05a7a', '#e08aa8', '#f8b8cc', '#ffe0ea']), cafe: P5(['#1e100a', '#3a2216', '#563422', '#6e4630', '#8a5e44']),
  zapa: P5(['#1a0c10', '#7a1424', '#c02a3a', '#e85a6a', '#ffa0b0']), tirita: P5(['#7a4a2a', '#b07a4a', '#d8a070', '#f0c49a', '#ffe8cc']),
  noche: P5(['#2a0410', '#4a0a1e', '#7a1430', '#a82848', '#d85a78']), cuero: P5(['#100c0c', '#1e1818', '#2e2626', '#423838', '#5a4e4e']),
};
const MODA_SRC = L2('Boutique de Valentina (todos los pueblos)', "Valentina's Boutique (every town)");
cosm('c_sueter_medianoche', L2('Suéter de Punto Medianoche', 'Midnight Knit Sweater'), 'body', () => ({ k: 'sweater', m: MODA_PAL.sueter, s: MODA_PAL.sueter, band: MODA_PAL.franja, r: MODA_PAL.rosa, cuff: MODA_PAL.rosa }), { src: MODA_SRC });
cosm('c_pantalon_holgado', L2('Pantalón Holgado Café', 'Baggy Brown Trousers'), 'legs', () => ({ k: 'baggy', m: MODA_PAL.cafe, s: uMulP(MODA_PAL.cafe, 0.8), bunch: 1 }), { src: MODA_SRC });
cosm('c_zapatillas_carmesi', L2('Zapatillas Carmesí', 'Crimson Sneakers'), 'feet', () => ({ k: 'sneakers', m: MODA_PAL.zapa }), { src: MODA_SRC });
cosm('c_tirita', L2('Tirita en la Mejilla', 'Cheek Bandage'), 'head', () => ({ k: 'bandage', m: MODA_PAL.tirita }), { src: MODA_SRC });
cosm('c_vestido_noche', L2('Vestido de Noche Carmesí', 'Crimson Evening Dress'), 'body', () => ({ k: 'dress', m: MODA_PAL.noche, s: GOLD.slice(1) }), { src: MODA_SRC });
cosm('c_chaqueta_cuero', L2('Chaqueta de Cuero', 'Leather Jacket'), 'body', () => ({ k: 'coat', m: MODA_PAL.cuero, s: MODA_PAL.franja }), { src: MODA_SRC });
const MODA_ITEMS = { c_sueter_medianoche: 9000, c_pantalon_holgado: 5000, c_zapatillas_carmesi: 3500, c_tirita: 800, c_vestido_noche: 14000, c_chaqueta_cuero: 11000 };
for (const id in MODA_ITEMS) { it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: MODA_ITEMS[id], icon: ['hanger'], rar: 3 }); COS_SHOP.push(id); }

// ---------- la modista y su boutique en cada pueblo ----------
NPCS.modista = { n: 'Valentina', title: L2('Modista de la Boutique', 'Boutique Designer'),
  look: Object.assign(LK({ g: 'f', hair: HAIRS.negro, hairStyle: 'long', outfit: 'dress', eyes: 'violeta', skin: SKINS[0], main: MODA_PAL.noche, sec: GOLD.slice(1), sash: GOLD[3] }), { bt: 2, btS: BODY_T.f[2] }),
  lines: [L2('Bienvenido, cariño. La moda también es una armadura.', 'Welcome, darling. Fashion is armor too.'), L2('Tengo prendas nuevas… te quedarían de maravilla.', 'I have new pieces… they would look wonderful on you.'), L2('Un buen suéter abriga más que mil hechizos de fuego.', 'A good sweater keeps you warmer than a thousand fire spells.')] };
const MODA_TOWNS = ['albor', 'puerto', 'arxar', 'sahrim', 'yarakai', 'brasa'];
SHOPS.moda = {}; for (const k of MODA_TOWNS) SHOPS.moda[k] = Object.keys(MODA_ITEMS).map(id => 'cosi_' + id).concat(['cosi_c_falda_plisada', 'cosi_c_botas_altas', 'cosi_c_sandalias'].filter(id => ITEMS[id]));
SIGNICON.dress = (p, x, y) => { p.hl(x + 3, y, 5, IRON[4]); p.set(x + 5, y + 1, IRON[4]); p.poly([[x + 3, y + 2], [x + 7, y + 2], [x + 9, y + 8], [x + 1, y + 8]], C('#d0406a')); p.hl(x + 3, y + 4, 5, C('#ffd0e0')); };
for (const k of MODA_TOWNS) INT_NPC['boutique_' + k] = 'modista';
if (typeof DOOR_CAT !== 'undefined') DOOR_CAT.unshift([/^boutique_/, 'tailor']);
{ const _to = townOfInterior; townOfInterior = function (id) { if (id && id.startsWith('boutique_')) return id.slice(9); return _to(id); }; }
// un hueco libre de 5x4 (más un margen) cerca del centro del pueblo, siempre el mismo en todos los teléfonos
function modaSpot(W, t) {
  const w = 5, h = 4, cx = Math.round((t.x0 + t.x1) / 2), cy = Math.round((t.y0 + t.y1) / 2);
  const okTile = (x, y) => { if (x < 1 || y < 1 || x >= W.w - 1 || y >= W.h - 1) return false; const i = W.I(x, y); return !SOLID_T[W.ter[i]] && W.ter[i] !== T.WATER && W.ter[i] !== T.DEEP && W.ter[i] !== T.STAIRS && W.ter[i] !== T.BRIDGE && W.objAt[i] < 0 && W.lvl[i] === W.lvl[W.I(cx, cy)] && !(W.flags[i] & 1); };
  for (let r = 2; r < 26; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const bx = cx + dx, by = cy + dy; let ok = true;
    for (let y = by - 1; y <= by + h + 1 && ok; y++) for (let x = bx - 1; x <= bx + w; x++) if (!okTile(x, y)) { ok = false; break; }
    if (ok) return [bx, by];
  }
  return null;
}
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  for (const k of MODA_TOWNS) { const t = TOWNS.find(t => t.k === k); if (!t) continue; const s = modaSpot(W, t); if (!s) continue;
    addBuilding(W, s[0], s[1], 5, 4, { style: WALLP[k] ? k : 'puerto', roof: 'purple', sign: 'dress', awning: '#c03a7a', v: 7 }, 'boutique_' + k); }
}; }
{ const _mi = makeInterior; makeInterior = function (id) {
  if (!id || !id.startsWith('boutique_')) return _mi(id);
  const w = 14, h = 10, M = { id, w, h, ter: new Uint8Array(w * h).fill(T.FLOOR), lvl: new Uint8Array(w * h), reg: new Uint8Array(w * h), flags: new Uint8Array(w * h), isWorld: false, chunks: new Map(), dark: 0.05, music: 'town', I: (x, y) => y * w + x };
  for (let x = 0; x < w; x++) { M.ter[x] = T.IWALL; M.ter[w + x] = T.IWALL; M.ter[(h - 1) * w + x] = T.IWALL; } for (let y = 0; y < h; y++) { M.ter[y * w] = T.IWALL; M.ter[y * w + w - 1] = T.IWALL; }
  const ex = w >> 1; M.ter[(h - 1) * w + ex] = T.FLOOR; M.exit = { x: ex, y: h - 1 };
  for (let y = 5; y < h - 1; y++) for (let x = 5; x <= 8; x++) M.ter[y * w + x] = T.CARPET;
  initMapObjs(M); const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  F('counter', 7, 4, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); F('armorstand', 2, 2); F('armorstand', 4, 2); F('armorstand', 10, 2); F('armorstand', 12, 2);
  F('shelf', 2, 6, [[0, 0], [1, 0]]); F('shelf', 11, 6, [[0, 0], [1, 0]]); F('plant', 1, 8); F('plant', 12, 8); F('rug', 7, 7, [], { solid: false });
  spawnNPC('modista', 7 * 16 + 8, 3 * 16 + 12, id, { face: 'down', L: 0 });
  M.wdist = null; G.maps[id] = M; return M;
}; }
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'modista') return; const P = G.P, tk = P.inside && P.inside.startsWith('boutique_') ? P.inside.slice(9) : 'puerto';
  opts.unshift({ label: L2('Ver la colección', 'Browse the collection'), icon: ['hanger'], fn: () => { closeDialog(); openShop('moda', tk); } }); });

// ---------- mascota: Bufandín, gato viajero con bufanda (diseño original inspirado en el gato de Sergio) ----------
PETS.bufandin = { n: L2('Bufandín, el Gato Viajero', 'Scarfy, the Wandering Cat'), d: L2('+6% de velocidad y +4% de crítico. Su bufanda ondea al correr.', '+6% speed and +4% crit. Its scarf flutters as it runs.'), price: 5500, look: { kind: 'scarfcat', b: '#3a58c8', b2: '#7aa0f0', eye: '#58e0a0' } };
{ const _ps = petStats; petStats = function (P, S) { _ps(P, S); if (P.pet === 'bufandin') { S.spd *= 1.06; S.crit = Math.min(70, S.crit + 4); } }; }
{ const _gp = genPet; genPet = function (k) { const L = PETS[k] && PETS[k].look; if (!L || L.kind !== 'scarfcat') return _gp(k);
  const body = C(L.b), hi = C(L.b2), dk = uMul(body, 0.5), mid = uMix(body, hi, 0.5), cream = C('#f4ecdc'), cream2 = C('#d8ccb8'), eye = C(L.eye), pink = C('#f0a0c0');
  const sc = pal(['#4a0810', '#8a1420', '#c8283a', '#ec5a62']), gold = C('#ffd060'), B4 = [dk, body, mid, hi];
  return mobAtlas(26, 24, (p, dir, a, f) => {
    const side = dir === 'left', up = dir === 'up', step = a === 'walk' ? [0, 1, 0, 1][f] : 0, bob = a === 'idle' ? f : a === 'walk' ? step : a === 'atk' ? [0, 1, 0][f] : 0;
    const by = 21 - bob, cx = 13, hy = by - 11, flap = a === 'walk' ? [0, 2, 1, 3][f] : f;
    // cola curva con punta clara
    const tx = side ? cx + 5 : cx + 5; if (up || side) { p.line(tx - 1, by - 3, tx + 2, by - 7, body); p.line(tx + 2, by - 7, tx + 1, by - 10 + (flap % 2), body); p.set(tx + 1, by - 11 + (flap % 2), cream); }
    // patitas y cuerpo pequeño
    for (const lx of side ? [-2, 1] : [-3, 2]) p.rect(cx + lx + (side && lx < 0 ? -step : 0), by - 2, 2, 2 + (lx < 0 ? step : 0), dk);
    p.ball(cx + (side ? -1 : 0), by - 5, 4.6, 3.6, B4); if (!up) p.ball(cx + (side ? -2 : 0), by - 4.5, 2.2, 2.2, [cream2, cream, cream, cream]);
    // cabeza grande
    const hx = side ? cx - 2 : cx; p.ball(hx, hy, 6.6, 5.6, B4);
    for (const s of side ? [1] : [-1, 1]) { const ex = hx + s * 4.2; p.poly([[ex - 2.2, hy - 3.5], [ex + s * 0.8, hy - 9], [ex + 2.2, hy - 3.5]], body); if (!up) { p.set(Math.round(ex + s * 0.4), hy - 6, pink); p.set(Math.round(ex + s * 0.4), hy - 5, pink); } }
    if (!up) {
      p.set(hx - 1, hy - 4, cream); p.set(hx, hy - 5, cream); p.set(hx + 1, hy - 4, cream); p.set(hx, hy - 3, uMix(cream, hi, 0.5));   // luna creciente en la frente
      const eyes = side ? [hx - 4] : [hx - 3, hx + 2];
      for (const ex of eyes) { p.set(ex, hy - 1, C('#101018')); p.set(ex + 1, hy - 1, C('#101018')); p.set(ex, hy, eye); p.set(ex + 1, hy, C('#ffffff')); p.set(ex, hy + 1, uMul(eye, 0.6)); p.set(ex + 1, hy + 1, eye); }
      p.ball(hx + (side ? -2 : 0), hy + 3, 2.4, 1.3, [cream2, cream, cream, cream]); p.set(hx + (side ? -3 : 0), hy + 2, pink);
    }
    // bufanda carmesí con raya dorada y flecos al viento
    for (let x = hx - 5; x <= hx + 5; x++) { p.set(x, hy + 5, sc[2]); p.set(x, hy + 6, sc[x % 2 ? 1 : 2]); } p.hl(hx - 4, hy + 5, 9, sc[3]); if (!up) p.hl(hx - 3, hy + 6, 7, sc[1]);
    const tail = side ? 1 : 1, fx = hx + (side ? 4 : 3);
    for (let k = 0; k < 5; k++) { const x = fx + tail * k + (k > 2 ? flap % 2 : 0), y = hy + 6 + Math.round(k * 0.6) - (a === 'walk' ? (k > 1 ? 1 : 0) : 0); p.set(x, y, sc[2]); p.set(x, y + 1, sc[1]); if (k === 2) p.set(x, y, gold); }
    p.set(fx + 5 + (flap % 2), hy + 9, sc[3]); p.set(fx + 4 + (flap % 2), hy + 10, sc[3]);
  });
}; }
