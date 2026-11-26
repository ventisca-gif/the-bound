// 6.30 · Aldea Shimotsuki (Sergio: «la isla Shimotsuki, hazla mediana… que haya npcs con esa ropa y traje y un
// entrenador… Zoro niño y la chica de pelo azul igualitos, y los retratos para sus diálogos»).
// Isla mediana al suroeste del Mar de Dawn, en el mar libre bajo Orange Town (como Loguetown: dentro del mapa 'dawn').
// Aldea japonesa (tejados de teja gris, muros encalados, escaleras de piedra), muro con portón y el Dojo Isshin:
// Koshiro (el maestro), alumnos de gi gris entrenando con espadas de bambú, Zoro niño y Kuina (hojas de Sergio con su
// retrato), arrozales y vecinos en kimono. Con Koshiro: entrenamiento con los alumnos, duelo con Zoro niño y duelo con
// Kuina (la primera vez, la escena de la promesa). Se desembarca con la Fruta del Diablo, como en las demás islas.
const SHIMO_X = 70, SHIMO_Y = 730, SHIMO_W = 200, SHIMO_H = 180;
const shimoAt = (x, y) => [SHIMO_X + x, SHIMO_Y + y];
const SHIMO_PIER = shimoAt(100, 166), SHIMO_MOOR = shimoAt(100, 182), SHIMO_DOJO = shimoAt(100, 52), SHIMO_NAME = L2('Aldea Shimotsuki', 'Shimotsuki Village');
const SHIMO_PLACES = [
  [SHIMO_PIER, L2('Shimotsuki · muelle', 'Shimotsuki · pier')],
  [shimoAt(100, 66), L2('Portón del Dojo Isshin', 'Isshin Dojo gate')],
  [shimoAt(100, 40), L2('Dojo Isshin · maestro Koshiro', 'Isshin Dojo · master Koshiro')],
  [shimoAt(158, 112), L2('Arrozales', 'Rice paddies')],
  [shimoAt(64, 108), L2('Calle de las casas de teja', 'Street of tiled houses')]
];
function shimoTile(x, y) {
  if (x < 0 || y < 0 || x >= SHIMO_W || y >= SHIMO_H) return '';
  if (Math.abs(x - 100) <= 2 && y >= 160 && y <= 179) return 'dock';
  const d = 1 - Math.hypot((x - 100) / 92, (y - 90) / 80) + 0.025 * Math.sin(x * 0.21) + 0.025 * Math.cos(y * 0.17);
  if (d < 0) return '';
  if (d < 0.05) return 'sand';
  if (x >= 58 && x <= 142 && y >= 18 && y <= 64) {
    if (x === 58 || x === 142 || y === 18 || y === 64) return y === 64 && Math.abs(x - 100) <= 3 ? 'stone' : 'wall';
    if (Math.abs(x - 100) <= 2 && y > 44) return 'stone';
    if (x >= 70 && x <= 130 && y >= 46 && y <= 62) return 'yard';
    return 'garden';
  }
  if (Math.abs(x - 100) <= 3 && y > 64) return 'road';
  if ((Math.abs(y - 96) <= 2 || Math.abs(y - 128) <= 2) && x >= 34 && x <= 166) return 'road';
  if (x >= 140 && x <= 178 && y >= 86 && y <= 142) return (x - 140) % 9 === 0 || (y - 86) % 7 === 0 ? 'dike' : 'paddy';
  return 'grass';
}
const SHIMO_TERRAIN = { dock: T.BRIDGE, sand: T.SAND, wall: T.IWALL, stone: T.COBBLE, yard: T.SAND, garden: T.GRASS, road: T.DIRT, paddy: T.GRASS, dike: T.GRASS, grass: T.GRASS };
const SHIMO_COLORS = { dock: '#b48a5c', sand: '#e6d5a5', wall: '#e8e2d2', stone: '#b9b8ae', yard: '#e2cf9c', garden: '#7fae66', road: '#cdb88c', paddy: '#8fc49a', dike: '#79a85e', grass: '#86b46a' };

// ---------- arquitectura (Pix, en caché por tipo) ----------
function shimoSprite(o) {
  return spr('shimo:' + o.part + ':' + (o.style || 0), () => {
    const part = o.part, v = o.style || 0;
    const roof = pal(['#2c3036', '#3e444c', '#565e68', '#727c86', '#97a2ac']), wood = pal(['#3a2618', '#5a3c26', '#7a5636', '#9c744a']), plaster = pal(['#a8a090', '#cfc8b6', '#e8e2d2', '#f6f2e6']);
    if (part === 'gate') {
      const p = new Pix(128, 92);
      for (const x of [10, 110]) { p.rect(x, 30, 8, 60, wood[1]); p.vl(x + 1, 30, 60, wood[3]); p.rect(x - 3, 86, 14, 5, STONEW[2]); }
      p.rect(4, 24, 120, 8, wood[2]); p.hl(4, 24, 120, wood[3]);
      p.poly([[0, 24], [16, 6], [112, 6], [128, 24]], roof[2]); for (let y = 9; y < 24; y += 3) p.hl(8, y, 112, roof[1]); p.hl(14, 6, 100, roof[4]);
      p.rect(52, 12, 24, 10, wood[0]); p.rect(54, 14, 20, 6, C('#d8c8a0'));
      p.outline(C('#2a2a30'), false); return { c: p.canvas(), ax: 64, ay: 90 };
    }
    if (part === 'poste') {
      const p = new Pix(22, 40); p.rect(9, 8, 4, 30, wood[2]); p.rect(3, 14, 16, 3, wood[1]); p.ell(11, 8, 5, 5, C('#c8b07a')); p.hl(7, 26, 8, C('#d8d0b8')); p.outline(OUTL); return { c: p.canvas(), ax: 11, ay: 38 };
    }
    if (part === 'arroz') {
      const p = new Pix(16, 16); for (let i = 0; i < 4; i++) { p.vl(2 + i * 4, 6, 8, C('#4a8a3a')); p.set(2 + i * 4, 5, C('#c8c060')); p.set(3 + i * 4, 7, C('#6aa84a')); } return { c: p.canvas(), ax: 8, ay: 14 };
    }
    const big = part === 'dojo', W = big ? 248 : 116 + (v % 2) * 12, H = big ? 150 : 104, p = new Pix(W, H), base = H - 3;
    const wT = big ? 70 : 52, L = 8, R = W - 9;
    // muro encalado con vigas oscuras
    p.rect(L, wT, R - L, base - wT, plaster[2]); p.rect(L, base - 10, R - L, 10, wood[1]); p.hl(L, base - 10, R - L, wood[3]);
    for (let x = L; x <= R; x += big ? 30 : 26) { p.rect(x, wT, 4, base - wT, wood[1]); p.vl(x + 1, wT, base - wT, wood[2]); }
    p.hl(L, wT + Math.round((base - wT) * 0.42), R - L, wood[1]);
    // ventanas de celosía y puerta con cortina
    for (let x = L + 12; x < R - 14; x += big ? 30 : 26) { if (Math.abs(x + 6 - W / 2) < (big ? 26 : 16)) continue; p.rect(x, wT + 8, 12, 12, wood[0]); for (let i = 0; i < 4; i++) p.vl(x + 2 + i * 3, wT + 9, 10, plaster[1]); p.hl(x, wT + 14, 12, plaster[1]); }
    const dw = big ? 40 : 20; p.rect(W / 2 - dw / 2, base - (big ? 44 : 34), dw, big ? 44 : 34, C('#2a2018'));
    const nc = [C('#2a4a7a'), C('#3a5a8e'), C('#7a2a2a'), C('#2e5a3a')][v % 4]; p.rect(W / 2 - dw / 2, base - (big ? 44 : 34), dw, big ? 14 : 11, nc); for (let x = W / 2 - dw / 2 + 4; x < W / 2 + dw / 2; x += 6) p.vl(x, base - (big ? 44 : 34) + 2, big ? 12 : 9, C('#e8e2d2'));
    // tejado de teja gris con caballete y extremos levantados
    const rT = big ? 16 : 10;
    p.poly([[0, wT + 4], [L + 14, rT], [R - 14, rT], [W, wT + 4], [W - 6, wT + 8], [6, wT + 8]], roof[2]);
    for (let y = rT + 4; y < wT + 6; y += 4) { const t = (y - rT) / (wT + 4 - rT), x0 = Math.round(L + 14 - t * (L + 14)), x1 = Math.round(R - 14 + t * (W - R + 14)); p.hl(x0, y, x1 - x0, roof[1]); for (let x = x0 + (y >> 2) % 2 * 3; x < x1; x += 6) p.vl(x, y - 3, 3, roof[3]); }
    p.rect(L + 10, rT - 4, R - L - 20, 5, roof[0]); p.hl(L + 10, rT - 4, R - L - 20, roof[4]);
    p.poly([[L + 6, rT - 8], [L + 14, rT - 3], [L + 10, rT + 1]], roof[0]); p.poly([[R - 6, rT - 8], [R - 14, rT - 3], [R - 10, rT + 1]], roof[0]);
    p.hl(4, wT + 7, W - 8, roof[0]);
    if (big) {
      // tablilla del dojo y porche de madera
      p.rect(W / 2 - 34, wT - 2, 68, 14, wood[1]); p.rect(W / 2 - 31, wT + 1, 62, 8, C('#e8dcb8'));
      for (let i = 0; i < 4; i++) { const x = W / 2 - 24 + i * 14; p.vl(x, wT + 2, 6, C('#2a2018')); p.hl(x - 2, wT + 4, 5, C('#2a2018')); p.set(x + 2, wT + 6, C('#2a2018')); }
      p.rect(L - 4, base - 4, R - L + 8, 4, wood[2]); p.hl(L - 4, base - 4, R - L + 8, wood[3]);
      for (const x of [L + 4, R - 6]) { p.rect(x, wT, 5, base - wT, wood[2]); }
    }
    p.outline(C('#26282e'), false);
    return { c: p.canvas(), ax: W / 2, ay: H - 2 };
  });
}
EXTRA_SPR.shimo = shimoSprite;

// ---------- mapa ----------
hookAfter('makeDawn', M => {
  if (!M || M.shimo) return;
  M.shimo = {};
  for (let y = 0; y < SHIMO_H; y++) for (let x = 0; x < SHIMO_W; x++) { const t = shimoTile(x, y); if (!t) continue; const i = M.I(SHIMO_X + x, SHIMO_Y + y); M.ter[i] = SHIMO_TERRAIN[t]; M.lvl[i] = 0; }
  const add = (part, x, y, style = 0, wide = 7, deep = 3) => { const fp = orangeFootprint(wide, deep); if (fp.some(([dx, dy]) => { const t = shimoTile(x + dx, y + dy); return !t || t === 'sand' || t === 'road' || t === 'wall' || t === 'paddy'; })) return null; return addObj(M, 'shimo', ...shimoAt(x, y), { part, style, fp }); };
  add('dojo', 100, 42, 0, 15, 4); add('house', 76, 34, 1); add('house', 124, 34, 2);
  for (const y of [86, 110, 120, 144, 154]) for (const x of [46, 60, 74, 88, 112, 126, 140]) add('house', x, y, (x + y) % 4);
  addObj(M, 'shimo', ...shimoAt(100, 64), { part: 'gate', fp: [[-4, 0], [4, 0]] });
  for (const [x, y] of [[76, 50], [124, 50], [76, 58], [124, 58]]) addObj(M, 'shimo', ...shimoAt(x, y), { part: 'poste', fp: [[0, 0]] });
  for (let y = 88; y < 142; y += 3) for (let x = 142; x < 178; x += 3) if (shimoTile(x, y) === 'paddy') addObj(M, 'shimo', ...shimoAt(x, y), { part: 'arroz', fp: [], solid: false });
  for (let k = 0; k < 90; k++) { const x = 20 + ((k * 37) % 160), y = 14 + ((k * 53) % 150), t = shimoTile(x, y); if (t !== 'grass' && t !== 'garden') continue; const i = M.I(...shimoAt(x, y)); if (M.objAt[i] >= 0 || M.objAt[i + 1] >= 0) continue; addObj(M, 'tree', ...shimoAt(x, y), { sp: k % 3 ? 'roble' : 'ebano', v: k % 4 }); }
  for (const [at, title] of SHIMO_PLACES) { const key = 'shimo_info_' + at[0] + '_' + at[1];
    XACT[key] = [title, 'book', () => xMsg(title, L2('Shimotsuki, la aldea del Dojo Isshin. Desde el muelle, la calle sube hasta el portón del dojo, donde el maestro Koshiro entrena a los niños con espadas de bambú. Los arrozales están al este.', 'Shimotsuki, the village of the Isshin Dojo. From the pier, the street climbs to the dojo gate, where master Koshiro trains the children with bamboo swords. The rice paddies are to the east.'))];
    addObj(M, 'sign', at[0] + 4, at[1] + 1, { xact: key, solid: false, fp: [] }); }
  M.chunks.clear();
});
hookAfter('renderChunk', (c, M, cx, cy) => {
  const ox = cx * CH - SHIMO_X, oy = cy * CH - SHIMO_Y;
  if (!M || !M.shimo || ox + CH <= 0 || oy + CH <= 0 || ox >= SHIMO_W || oy >= SHIMO_H) return;
  const g = c.getContext('2d');
  for (let y = 0; y < CH; y++) for (let x = 0; x < CH; x++) {
    const tx = ox + x, ty = oy + y, t = shimoTile(tx, ty); if (!t) continue;
    const px = x * 16, py = y * 16; g.fillStyle = SHIMO_COLORS[t]; g.fillRect(px, py, 16, 16);
    if (t === 'grass' || t === 'garden' || t === 'dike') { g.fillStyle = '#6e9a58'; g.fillRect(px + (tx * 7 + ty * 3) % 13, py + 5, 2, 1); g.fillRect(px + (tx * 3 + ty * 11) % 13, py + 11, 1, 2); }
    else if (t === 'paddy') { g.fillStyle = '#a8d4b8'; g.fillRect(px + 2, py + 3 + (tx % 3) * 3, 9, 1); }
    else if (t === 'wall') { g.fillStyle = '#4a4e56'; g.fillRect(px, py, 16, 4); g.fillStyle = '#6a707a'; g.fillRect(px, py, 16, 1); g.fillStyle = '#cfc8b6'; g.fillRect(px, py + 14, 16, 2); g.fillStyle = '#8a8478'; g.fillRect(px, py + 12, 16, 1); }
    else if (t === 'stone') { g.fillStyle = '#a2a198'; g.fillRect(px, py + 15, 16, 1); g.fillRect(px + ((tx + ty) % 2) * 8, py, 1, 15); g.fillStyle = '#d0cfc6'; g.fillRect(px + 1, py, 15, 1); }
    else if (t === 'dock') { g.fillStyle = '#8a6844'; g.fillRect(px, py + 15, 16, 1); g.fillRect(px, py + 7, 16, 1); }
    else if (t === 'road' || t === 'yard' || t === 'sand') { g.fillStyle = t === 'sand' ? '#cfbc90' : '#b8a37a'; g.fillRect(px + (tx * 5 + ty * 7) % 13, py + (tx * 3 + ty) % 13, 2, 1); }
  }
  return c;
});
hookAfter('orangeOverviewColor', (color, M, x, y) => { const t = M.shimo && shimoTile(x - SHIMO_X, y - SHIMO_Y); if (t) return C(SHIMO_COLORS[t]); });
hookAfter('otherPOI', (out, M) => { if (M && M.shimo) for (const [at, t] of SHIMO_PLACES) out.push({ x: at[0], y: at[1], c: 'inn', t }); });
// ---------- muelle ----------
function shimoDockKey() {
  const P = G.P, M = G.map; if (!M || !M.shimo || !P || P.dead || G.fading) return null;
  if (P.dawnHelm && P.dawnHelm.kind !== 'swim' && conomiNear(P, SHIMO_MOOR, 60)) return dfHas() ? 'shimo_land' : 'shimo_locked';
  if (!P.dawnHelm && P.dawnBoat && P.dawnBoat.shimo && conomiNear(P, SHIMO_PIER, 44)) return 'shimo_sail';
  return null;
}
XACT.shimo_land = [L2('Desembarcar en Shimotsuki', 'Land at Shimotsuki'), 'ways', () => { if (shimoDockKey() === 'shimo_land') dawnIslandDock(true, 'shimo', SHIMO_PIER, SHIMO_MOOR, SHIMO_NAME, L2('La aldea del Dojo Isshin', 'The village of the Isshin Dojo')); }];
XACT.shimo_sail = [L2('Volver al barco', 'Return to your ship'), 'ways', () => { if (shimoDockKey() === 'shimo_sail') dawnIslandDock(false, 'shimo', SHIMO_PIER, SHIMO_MOOR, SHIMO_NAME, ''); }];
XACT.shimo_locked = [L2('Desembarco · necesitas una Fruta del Diablo', 'Landing · Devil Fruit required'), 'ways', () => toast(L2('Necesitas el permiso de desembarco de la Fruta del Diablo.', 'You need the Devil Fruit landing permit.'), 'info', 4)];
hookAround('interactTarget', next => { const key = shimoDockKey(); return key ? rareAction(key) : next(); });

// ---------- gente ----------
const SHIMO_GI = { k: 'kimono', m: CLOTH.gris, s: CLOTH.negro };
function shimoLook(app, gi, sword) { const L = heroLook('guerrero', { ...DEF_APP, ...app }, { weapon: sword ? 1 : 0 }, {}, {}); L.back = null; if (!sword) L.weapon = null; if (gi) L.top = Object.assign({}, gi); return L; }
const SHIMO_CAST = {
  shimo_koshiro: ['Koshiro', L2('Maestro del Dojo Isshin', 'Isshin Dojo master'), { g: 'm', bt: 2, hs: 10, hair: 'negro', skin: 0, top: [1, 'gris'], bot: [0, 'negro'] }, { k: 'kimono', m: CLOTH.beige || CLOTH.gris, s: CLOTH.negro }, 0, [
    L2('Bienvenido al Dojo Isshin. Aquí la espada se aprende con paciencia… y con muchos golpes de bambú.', 'Welcome to the Isshin Dojo. Here the sword is learned with patience… and many bamboo strikes.'),
    L2('Kuina es la mejor de mis alumnos. Zoro la ha retado más de dos mil veces y no le ha ganado ni una.', 'Kuina is my best student. Zoro has challenged her over two thousand times and hasn’t won once.')]]
};
const SHIMO_KIDS = [['Kenta', 1, 'negro'], ['Haru', 0, 'castano'], ['Sora', 2, 'negro'], ['Ichi', 1, 'castano'], ['Yuki', 0, 'negro'], ['Taro', 2, 'gris']];
SHIMO_KIDS.forEach(([n, skin, hair], i) => { SHIMO_CAST['shimo_alumno' + i] = [n, L2('Alumno del Dojo Isshin', 'Isshin Dojo student'), { g: i % 3 === 2 ? 'f' : 'm', bt: 1, hs: i % 3 === 2 ? 6 : 1, hair, skin, top: [1, 'gris'], bot: [0, 'negro'] }, SHIMO_GI, 1, [
  [L2('¡Uno, dos! ¡Uno, dos! El maestro dice que mil cortes al día.', 'One, two! One, two! Master says a thousand cuts a day.'), L2('Zoro entrena con dos espadas de bambú a la vez. ¡Está loco!', 'Zoro trains with two bamboo swords at once. He’s crazy!'), L2('Kuina nunca pierde. Nunca.', 'Kuina never loses. Never.')][i % 3]]]; });
const SHIMO_VEC = [['Vecina', 'f', 'rosa', 'negro'], ['Vecino', 'm', 'azul', 'gris'], ['Anciana', 'f', 'morado', 'blanco'], ['Pescador', 'm', 'marron', 'negro'], ['Campesina', 'f', 'verde', 'castano'], ['Vendedor', 'm', 'naranja', 'castano']];
SHIMO_VEC.forEach(([n, g, col, hair], i) => { SHIMO_CAST['shimo_v' + i] = [L2(n, ['Villager', 'Villager', 'Old woman', 'Fisherman', 'Farmer', 'Vendor'][i]), SHIMO_NAME, { g, bt: 1, hs: g === 'f' ? 4 + i % 3 : 2 + i % 3, hair, skin: i % 3, top: [1, col], bot: [0, 'negro'] }, { k: 'kimono', m: CLOTH[col] || CLOTH.azul, s: CLOTH.negro }, 0, [
  [L2('El arroz de Shimotsuki es el mejor del East Blue.', 'Shimotsuki rice is the best in the East Blue.'), L2('Cada mañana se oyen los gritos del dojo. ¡Kiai!', 'Every morning you hear the shouts from the dojo. Kiai!'), L2('Ese niño del pelo verde se pasa el día entrenando junto al río.', 'That green-haired boy spends all day training by the river.'), L2('Del muelle salen barcas hacia Loguetown de vez en cuando.', 'Now and then boats leave the pier for Loguetown.'), L2('Las escaleras de piedra suben hasta el portón del dojo.', 'The stone steps climb up to the dojo gate.'), L2('Té y dulces de arroz. ¡Pruébalos antes de entrenar!', 'Tea and rice sweets. Try them before training!')][i]]]; });
for (const [id, [n, title, app, gi, sword, lines]] of Object.entries(SHIMO_CAST)) {
  NPCS[id] = { n, title, look: LK({}), quests: [], lines, atlas: () => getAtlas('shimo:' + id, () => buildAtlas(shimoLook(app, gi, sword), ['idle', 'walk', 'atk'], drawHero)) };
}
NPCS.shimo_zoro = { n: 'Zoro', title: L2('Alumno del Dojo Isshin', 'Isshin Dojo student'), look: LK({}), quests: [], infArt: 'zoro', infPor: 'zoro', lines: [
  L2('Voy a ganarle a Kuina. Hoy sí.', 'I’m going to beat Kuina. Today for sure.'), L2('Dos espadas no bastan. Algún día usaré tres.', 'Two swords aren’t enough. Some day I’ll use three.')], atlas: () => infAtlas('zoro') || npcAtlas('shimo_alumno0') };
NPCS.shimo_kuina = { n: 'Kuina', title: L2('La mejor del Dojo Isshin', 'Best student of the Isshin Dojo'), look: LK({}), quests: [], infArt: 'kuina', infPor: 'kuina', lines: [
  L2('Dos mil y un combates, Zoro. ¿Quieres el dos mil dos?', 'Two thousand and one bouts, Zoro. Want number two thousand and two?'), L2('Dicen que una chica no puede ser la mejor espadachina del mundo. Ya veremos.', 'They say a girl can’t be the world’s greatest swordsman. We’ll see.')], atlas: () => infAtlas('kuina') || npcAtlas('shimo_alumno2') };
INF_WHO.zoro = { n: 'Zoro', t: L2('Dojo Isshin', 'Isshin Dojo'), por: 'zoro', atlas: () => infAtlas('zoro') };
INF_WHO.kuina = { n: 'Kuina', t: L2('Dojo Isshin', 'Isshin Dojo'), por: 'kuina', atlas: () => infAtlas('kuina') };
INF_WHO.koshiro = { n: 'Koshiro', t: L2('Maestro del Dojo Isshin', 'Isshin Dojo master'), atlas: () => npcAtlas('shimo_koshiro') };
hookAround('mobAtlasFor', (next, art) => art && art[0] === 'inf_actor' ? (infAtlas(art[1]) || next(['hum', 'pirata'])) : next(art));
MOBS.shimo_alumno = { ...MOBS.dawn_pirata, n: L2('Alumno del Dojo Isshin', 'Isshin Dojo student'), art: ['hum', 'shimo_alumno'], reg: [], drops: [] };
hookAround('mobAtlasFor', (next, art) => art && art[0] === 'hum' && art[1] === 'shimo_alumno' ? getAtlas('shimo:mob_alumno', () => buildAtlas(shimoLook({ g: 'm', bt: 1, hs: 1, hair: 'negro', skin: 1, top: [1, 'gris'], bot: [0, 'negro'] }, SHIMO_GI, 1), ['idle', 'walk', 'atk', 'hurt', 'dead'], drawHero)) : next(art));
BOSSES.shimo_zoro = { n: L2('Zoro niño', 'Young Zoro'), lv: 584, hp: 46, atk: 3.5, def: 3.4, spd: 80, r: 30, where: SHIMO_NAME, art: ['inf_actor', 'zoro'], moves: ['charge'], drops: [] };
BOSSES.shimo_kuina = { n: 'Kuina', lv: 592, hp: 52, atk: 3.7, def: 3.5, spd: 92, r: 30, where: SHIMO_NAME, art: ['inf_actor', 'kuina'], moves: ['charge', 'slam'], drops: [] };
if (typeof DAWN_RETO === 'object') Object.assign(DAWN_RETO, { shimo_zoro: 1.6, shimo_kuina: 1.8 });
SAVEKEYS.push('shimoIntro', 'shimoZoro', 'shimoKuina', 'shimoTrain');
const SHIMO_SPOTS = { shimo_koshiro: [100, 47, 'down', 0], shimo_zoro: [92, 56, 'right', 0], shimo_kuina: [108, 56, 'left', 0] };
for (let i = 0; i < 6; i++) SHIMO_SPOTS['shimo_alumno' + i] = [82 + (i % 3) * 8 + (i > 2 ? 22 : 0), 52 + (i > 2 ? 0 : 0) + (i % 2) * 6, 'up', 0];
for (let i = 0; i < 6; i++) SHIMO_SPOTS['shimo_v' + i] = [[60, 98], [130, 98], [80, 126], [100, 150], [150, 96], [120, 130]][i].concat(['down', 4]);
function shimoActive(P, M) { return !!(P && M && M.shimo && !P.dead && !P.dawnHelm && shimoTile((P.x >> 4) - SHIMO_X, (P.y >> 4) - SHIMO_Y)); }
function shimoLife(M, on) {
  if (!on) { if (M.shimoLife) for (const e of M.shimoLife) e.remove = true; M.shimoLife = null; return; }
  if (M.shimoLife) return; M.shimoLife = [];
  for (const [id, [x, y, face, wander]] of Object.entries(SHIMO_SPOTS)) {
    const at = freePxNear(M, ...dawnPx(shimoAt(x, y)), 3); if (!at) continue;
    const e = spawnNPC(id, at[0], at[1], M.id, { face, wander, hgt: /zoro|kuina/.test(id) ? 32 : 36, scene: /alumno/.test(id) }); if (e) { e.shimoTrain = /alumno/.test(id) ? 1 : 0; M.shimoLife.push(e); }
  }
}
// ---------- dojo: entrenamiento y duelos ----------
function shimoFightStart(kind) {
  const M = G.map, P = G.P; if (!M || !M.shimo || M.shimoFight || P.dead) return; closeDialog();
  const [cx, cy] = dawnPx(shimoAt(100, 55)), F = M.shimoFight = { kind, foes: [], t: G.t, hidden: [] };
  P.x = cx; P.y = cy + 50; P.dir = 'up'; updateCamera(0, true);
  if (kind === 'train') { const lv = Math.max(560, Math.min(P.lv || 600, 650) - 6);
    for (let i = 0; i < 4; i++) { const at = freePxNear(M, cx - 90 + i * 60, cy - 20, 3) || [cx, cy]; const m = spawnMob('shimo_alumno', lv, at[0], at[1], 0, null, false); m.map = 'dawn'; m.aggroT = 99; m.target = P; m.state = 'fight'; F.foes.push(m); }
    banner(L2('Entrenamiento del dojo', 'Dojo training'), L2('Vence a cuatro alumnos de Koshiro', 'Beat four of Koshiro’s students'));
  } else {
    const id = kind === 'zoro' ? 'shimo_zoro' : 'shimo_kuina';
    for (const e of M.shimoLife || []) if (e.id === id) { e.remove = true; F.hidden.push(id); }
    const m = spawnMob(id, BOSSES[id].lv, cx, cy - 30, 0, null, true); m.map = 'dawn'; m.state = 'fight'; m.cd = 1.2; F.foes.push(m); F.boss = m;
    showBoss(m); sfx('boss'); banner(m.name, L2('Duelo de práctica · Nivel ', 'Practice duel · Level ') + m.lv);
  }
}
function shimoFightTick(M, F) {
  const P = G.P;
  if (P.dead || !shimoActive(P, M)) { shimoFightEnd(M, false); return; }
  F.foes = F.foes.filter(f => !f.dying && !f.remove && f.hp > 0); if (F.foes.length) return;
  shimoFightEnd(M, true);
}
function shimoFightEnd(M, won) {
  const F = M.shimoFight, P = G.P; if (!F) return; M.shimoFight = null;
  for (const f of F.foes) if (!f.dying) f.remove = true; if (F.boss && G.bossBar === F.boss) showBoss(null);
  if (M.shimoLife) { for (const e of M.shimoLife) e.remove = true; M.shimoLife = null; }
  if (!won) { toast(L2('Koshiro: «Levántate. La espada empieza otra vez cada día.»', 'Koshiro: "Get up. The sword begins again every day."'), 'info', 5); return; }
  if (F.kind === 'train') { const first = !P.shimoTrain; P.shimoTrain = (P.shimoTrain || 0) + 1; const g = first ? 80000 : 30000; P.gold += g; toast('🥋 ' + L2('Entrenamiento superado · +', 'Training cleared · +') + g.toLocaleString() + ' ' + L2('oro', 'gold'), 'quest', 5); }
  if (F.kind === 'zoro') { const first = !P.shimoZoro; P.shimoZoro = (P.shimoZoro || 0) + 1; const g = first ? 100000 : 30000; P.gold += g;
    infTalk([['zoro', '¡Otra vez! ¡Una más! …No pienso perder contra nadie más que contra Kuina.', 'Again! One more! …I refuse to lose to anyone but Kuina.'], ['koshiro', 'Tienes buena espada. Ahora ve a por la mejor del dojo.', 'You have a fine sword arm. Now go face the best in the dojo.']], () => toast('+' + g.toLocaleString() + ' ' + L2('oro', 'gold'), 'quest', 4)); }
  if (F.kind === 'kuina') { const first = !P.shimoKuina; P.shimoKuina = (P.shimoKuina || 0) + 1; const g = first ? 150000 : 40000; P.gold += g;
    infTalk(first ? [
      ['kuina', '…Me has ganado. Bien. Pero ya me pasa con Zoro: los chicos crecen y se hacen más fuertes.', '…You beat me. Fine. But it already happens with Zoro: boys grow up and get stronger.'],
      ['zoro', '¡Eso no es excusa! ¡Prométemelo, Kuina! Uno de los dos será el mejor espadachín del mundo.', 'That’s no excuse! Promise me, Kuina! One of us will be the world’s greatest swordsman.'],
      ['kuina', '¿Y si soy yo, llorón? …Vale. Es una promesa.', 'And what if it’s me, crybaby? …Okay. It’s a promise.'],
      ['koshiro', 'La Wadō Ichimonji estará esperando a quien cumpla esa promesa.', 'The Wado Ichimonji will be waiting for whoever keeps that promise.']
    ] : [['kuina', 'Otra vez tú. Me gusta. Vuelve mañana.', 'You again. I like it. Come back tomorrow.']], () => toast('+' + g.toLocaleString() + ' ' + L2('oro', 'gold'), 'quest', 4)); }
  markDirty(true);
}
DLG_HOOKS.push((npc, opts) => {
  const M = G.map, P = G.P; if (!npc || !M || !M.shimo || M.shimoFight) return;
  if (npc.id === 'shimo_koshiro') {
    opts.unshift({ label: '🥋 ' + L2('Entrenamiento: cuatro alumnos', 'Training: four students') + (P.shimoTrain ? '' : ' · 80.000'), icon: ['sword'], fn: () => shimoFightStart('train') });
    opts.unshift({ label: '⚔ ' + L2('Duelo de práctica con Zoro niño', 'Practice duel with young Zoro') + ' · ' + L2('Nv. ', 'Lv. ') + BOSSES.shimo_zoro.lv, icon: ['sword'], fn: () => shimoFightStart('zoro') });
    if (P.shimoZoro) opts.unshift({ label: '⚔ ' + L2('Duelo con Kuina', 'Duel with Kuina') + ' · ' + L2('Nv. ', 'Lv. ') + BOSSES.shimo_kuina.lv, icon: ['sword'], fn: () => shimoFightStart('kuina') });
  }
  if (npc.id === 'shimo_zoro') opts.unshift({ label: '⚔ ' + L2('Duelo de práctica con Zoro niño', 'Practice duel with young Zoro'), icon: ['sword'], fn: () => shimoFightStart('zoro') });
  if (npc.id === 'shimo_kuina' && P.shimoZoro) opts.unshift({ label: '⚔ ' + L2('Duelo con Kuina', 'Duel with Kuina'), icon: ['sword'], fn: () => shimoFightStart('kuina') });
});
V33_TICKS.push(() => {
  const M = G.map, P = G.P; if (!M || !P || !M.shimo) return;
  if (M.shimoFight) { shimoFightTick(M, M.shimoFight); return; }
  const on = shimoActive(P, M); shimoLife(M, on); if (!on) return;
  // los alumnos cortan el aire con la espada de bambú, a compás
  for (const e of M.shimoLife || []) if (e.shimoTrain && !e.remove) { const k = Math.floor(G.t * 4 + e.x * 0.01) % 8; e.anim = k < 4 ? 'atk' : 'idle'; e.af = k < 4 ? k : 0; }
  if (!P.shimoIntro && conomiNear(P, SHIMO_DOJO, 220)) { P.shimoIntro = 1; markDirty();
    infTalk([['koshiro', '¡Kiai! …Vaya, un visitante. Bienvenido al Dojo Isshin.', 'Kiai! …Well, a visitor. Welcome to the Isshin Dojo.'],
      ['zoro', '¡Kuina! ¡Hoy te gano seguro!', 'Kuina! Today I’ll beat you for sure!'],
      ['kuina', 'Eso dijiste ayer. Y anteayer. Y los otros dos mil días.', 'That’s what you said yesterday. And the day before. And the other two thousand days.'],
      ['koshiro', 'Si quieres entrenar con nosotros, habla conmigo.', 'If you want to train with us, talk to me.']]); }
});
hookAfter('setMap', () => { const M = G.maps && G.maps.dawn; if (M && G.map !== M) { if (M.shimoFight) shimoFightEnd(M, false); if (M.shimoLife) shimoLife(M, false); } });
// ---------- Lupa ----------
LUPA_DAWN.push(['shimo630', () => '🥋 ' + SHIMO_NAME, () => {
  const P = G.P || {}; return [
    L2('Isla mediana al suroeste del Mar de Dawn, bajo Orange Town. Se desembarca en su muelle con la Fruta del Diablo.', 'Medium island in the southwest of the Dawn Sea, below Orange Town. Land at its pier with the Devil Fruit.'),
    L2('Aldea japonesa con tejados de teja, muro de piedra y el Dojo Isshin del maestro Koshiro. Los alumnos entrenan en el patio con espadas de bambú.', 'Japanese village with tiled roofs, a stone wall and master Koshiro’s Isshin Dojo. The students train in the yard with bamboo swords.'),
    (P.shimoTrain ? '✅ ' : '⬜ ') + L2('Entrenamiento con cuatro alumnos (80.000 de oro la primera vez, luego 30.000).', 'Training with four students (80,000 gold the first time, then 30,000).'),
    (P.shimoZoro ? '✅ ' : '⬜ ') + L2('Duelo de práctica con Zoro niño (584).', 'Practice duel with young Zoro (584).'),
    (P.shimoKuina ? '✅ ' : '⬜ ') + L2('Duelo con Kuina (592): la primera vez, la promesa de Zoro y Kuina.', 'Duel with Kuina (592): the first time, Zoro and Kuina’s promise.')]; },
  () => ({ loc: G.P && G.P.dawnHelm ? SHIMO_MOOR : SHIMO_DOJO, m: 'dawn', t: SHIMO_NAME })]);
