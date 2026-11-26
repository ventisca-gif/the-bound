// 6.30 · Cuartel General de la Marina (Sergio: «una isla de marina, mírala así, donde podrás entrar; también por los
// costados verás zonas con marines muy fuertes»).
// Isla al sur del Mar de Dawn, entre Shimotsuki y Villa Syrup. Fortaleza blanca redonda con los dos grandes arcos detrás,
// barcos de la Marina amarrados delante y un muro con dos pasos laterales que llevan a las zonas restringidas, donde
// patrullan marines de élite muy fuertes (nivel 690-700, reaparecen). Por el portón central se entra al vestíbulo
// (mapa 'marina_hq'): marines, la recepción y Garp, que acepta un duelo de puños (nivel 700).
// Escenario crossover del Mar de Dawn: no cambia CRON ni ERAS.
const MHQ_X = 420, MHQ_Y = 730, MHQ_W = 240, MHQ_H = 236;
const mhqAt = (x, y) => [MHQ_X + x, MHQ_Y + y];
const MHQ_PIER = mhqAt(120, 214), MHQ_MOOR = mhqAt(120, 236), MHQ_DOOR = mhqAt(120, 96), MHQ_NAME = L2('Cuartel General de la Marina', 'Navy Headquarters');
const MHQ_ZONES = [[18, 70, 74, 150], [166, 70, 222, 150]];
const MHQ_PLACES = [
  [MHQ_PIER, L2('Cuartel de la Marina · muelle', 'Navy HQ · pier')],
  [mhqAt(120, 104), L2('Portón del Cuartel General', 'Headquarters gate')],
  [mhqAt(46, 110), L2('Zona restringida oeste · marines de élite', 'West restricted zone · elite marines')],
  [mhqAt(194, 110), L2('Zona restringida este · marines de élite', 'East restricted zone · elite marines')]
];
function mhqTile(x, y) {
  if (x < 0 || y < 0 || x >= MHQ_W || y >= MHQ_H) return '';
  if (Math.abs(x - 120) <= 3 && y >= 196 && y <= 233) return 'dock';
  const d = 1 - Math.hypot((x - 120) / 112, (y - 112) / 100) + 0.02 * Math.sin(x * 0.19);
  if (d < 0) return '';
  if (d < 0.05) return 'sand';
  // muro: rodea la fortaleza; portón al sur y pasos a los costados
  const inW = x >= 80 && x <= 160 && y >= 26 && y <= 100;
  if (inW && (x === 80 || x === 160 || y === 26 || y === 100)) { if (y === 100 && Math.abs(x - 120) <= 5) return 'plaza'; if ((x === 80 || x === 160) && y >= 84 && y <= 92) return 'plaza'; return 'wall'; }
  if (inW) return 'plaza';
  for (const [x0, y0, x1, y1] of MHQ_ZONES) if (x >= x0 && x <= x1 && y >= y0 && y <= y1) return 'zone';
  if (Math.abs(y - 88) <= 2 && (x > 70 && x < 80 || x > 160 && x < 170)) return 'plaza';
  if (Math.abs(x - 120) <= 6 && y > 100) return 'plaza';
  if (y > 150 && y < 196 && Math.abs(x - 120) < 40) return 'plaza';
  return 'grass';
}
const MHQ_TERRAIN = { dock: T.BRIDGE, sand: T.SAND, wall: T.IWALL, plaza: T.COBBLE, zone: T.COBBLE, grass: T.GRASS };
const MHQ_COLORS = { dock: '#b8b0a0', sand: '#ece0b8', wall: '#dfe6ea', plaza: '#cfd6da', zone: '#a8b4bc', grass: '#88b86c' };

// ---------- arquitectura ----------
function mhqFortArt() {
  const W = 400, H = 300, p = new Pix(W, H), base = H - 4;
  const st = pal(['#6e7f90', '#93a4b2', '#b8c6d0', '#d8e2e8', '#f2f6f8']), bl = pal(['#173a66', '#22528a', '#3a6eaa', '#6a9ad0']);
  // los dos grandes arcos blancos detrás
  for (const cx of [130, 270]) for (let a = 0; a <= Math.PI; a += 0.004) { for (let r = 112; r < 128; r++) { const x = Math.round(cx + Math.cos(a) * r * 0.62), y = Math.round(150 - Math.sin(a) * r); p.set(x, y, r < 115 ? st[1] : r > 124 ? st[4] : st[3]); } }
  // alas laterales con columnas
  for (const [x0, x1] of [[20, 140], [260, 380]]) { p.rect(x0, base - 70, x1 - x0, 70, st[2]); p.hl(x0, base - 70, x1 - x0, st[4]); for (let x = x0 + 6; x < x1 - 4; x += 14) { p.rect(x, base - 58, 6, 52, st[3]); p.vl(x, base - 58, 52, st[4]); p.rect(x + 1, base - 50, 4, 14, bl[0]); }
    for (let x = x0; x < x1; x += 8) p.rect(x, base - 76, 5, 6, st[3]); }
  // torre redonda central en tres cuerpos
  const tiers = [[base - 150, base, 92], [base - 205, base - 150, 74], [base - 248, base - 205, 54]];
  for (const [y0, y1, rw] of tiers) { for (let y = y0; y < y1; y++) for (let x = -rw; x <= rw; x++) { const t = x / rw; p.set(200 + x, y, t < -0.6 ? st[1] : t < -0.2 ? st[2] : t < 0.4 ? st[3] : t < 0.8 ? st[2] : st[1]); }
    p.hl(200 - rw, y0, rw * 2, st[4]); for (let x = -rw; x <= rw; x += 9) p.rect(200 + x, y0 - 6, 5, 6, st[3]);
    for (let y = y0 + 10; y < y1 - 10; y += 16) for (let x = -rw + 10; x < rw - 6; x += 16) { p.rect(200 + x, y, 5, 8, bl[0]); p.set(200 + x, y, bl[3]); } }
  // tejadito de pagoda arriba y la bandera
  p.poly([[200 - 40, base - 248], [200, base - 270], [200 + 40, base - 248]], C('#c8d0d8')); p.hl(160, base - 248, 80, st[0]);
  p.rect(198, base - 296, 3, 30, st[0]); p.rect(201, base - 296, 22, 12, C('#f2f6f8')); p.ell(212, base - 290, 4, 3, bl[2]);
  // rótulo «MARINE» y gaviota azul
  p.rect(150, base - 132, 100, 22, st[4]); p.rect(152, base - 130, 96, 18, C('#eef3f6'));
  p.rect(150, base - 180, 100, 26, st[3]);
  // portón
  p.rect(180, base - 60, 40, 60, C('#3a4250')); p.rect(183, base - 57, 34, 57, C('#56606e')); p.vl(200, base - 57, 57, C('#3a4250'));
  p.poly([[176, base - 60], [200, base - 78], [224, base - 60]], st[3]); p.rect(176, base - 4, 48, 4, st[0]);
  p.outline(C('#4a5868'), false);
  const c = p.canvas(), g = c.getContext('2d');
  g.font = 'bold 15px monospace'; g.fillStyle = '#26507e'; g.fillText('MARINE', 172, base - 116);
  g.fillStyle = '#26507e'; g.fillRect(186, base - 172, 4, 14); g.fillRect(180, base - 166, 16, 3); g.fillRect(206, base - 172, 3, 14); g.fillRect(212, base - 170, 3, 12); g.fillRect(204, base - 162, 14, 3);
  return { c, ax: W / 2, ay: H - 2 };
}
// se dibuja a 3/4 para que la fortaleza quepa casi entera en la pantalla del móvil
XSPR.mhq_fort = () => spr('mhq:fort', () => { const s = mhqFortArt(), k = 0.75, c = mkCanvas(Math.round(s.c.width * k), Math.round(s.c.height * k)), g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(s.c, 0, 0, c.width, c.height); return { c, ax: s.ax * k, ay: s.ay * k }; });
XSPR.mhq_barco = () => spr('mhq:barco', () => { const s = XSPR.mr_barco(), k = 2.4, c = mkCanvas(Math.round(s.c.width * k), Math.round(s.c.height * k)), g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(s.c, 0, 0, c.width, c.height); return { c, ax: s.ax * k, ay: s.ay * k }; });
XSPR.mhq_aviso = () => spr('mhq:aviso', () => { const p = new Pix(28, 34); p.rect(12, 14, 4, 18, WOOD[2]); p.rect(2, 2, 24, 14, C('#c83a32')); p.rect(4, 4, 20, 10, C('#f4e8d8')); p.rect(13, 5, 2, 6, C('#c83a32')); p.rect(13, 12, 2, 1, C('#c83a32')); p.outline(OUTL); return { c: p.canvas(), ax: 14, ay: 32 }; });

// ---------- mapa ----------
hookAfter('makeDawn', M => {
  if (!M || M.mhq) return;
  M.mhq = {};
  for (let y = 0; y < MHQ_H; y++) for (let x = 0; x < MHQ_W; x++) { const t = mhqTile(x, y); if (!t) continue; const i = M.I(MHQ_X + x, MHQ_Y + y); M.ter[i] = MHQ_TERRAIN[t]; M.lvl[i] = 0; }
  addObj(M, 'furn', ...mhqAt(120, 92), { f: 'mhq_fort', fp: orangeFootprint(19, 5), xact: 'mhq_in' });
  for (const [x, y] of [[96, 232], [144, 232], [80, 222], [160, 222]]) addObj(M, 'furn', ...mhqAt(x, y), { f: 'mhq_barco', fp: [], solid: false });
  for (const [x0, y0, x1, y1] of MHQ_ZONES) { addObj(M, 'furn', ...mhqAt(x0 === 18 ? x1 + 1 : x0 - 1, 86), { f: 'mhq_aviso', fp: [], solid: false, xact: 'mhq_zona' }); }
  for (let k = 0; k < 60; k++) { const x = 14 + ((k * 41) % 212), y = 16 + ((k * 29) % 190), t = mhqTile(x, y); if (t !== 'grass') continue; const i = M.I(...mhqAt(x, y)); if (M.objAt[i] >= 0) continue; addObj(M, 'tree', ...mhqAt(x, y), { sp: 'palma', v: k % 4 }); }
  for (const [at, title] of MHQ_PLACES) { const key = 'mhq_info_' + at[0] + '_' + at[1];
    XACT[key] = [title, 'book', () => xMsg(title, L2('El Cuartel General de la Marina vigila el East Blue. Por el portón se entra al vestíbulo; por los pasos de los costados se llega a las zonas restringidas, donde patrullan marines de élite muy fuertes.', 'Navy Headquarters watches over the East Blue. The gate leads into the hall; the side passages lead to the restricted zones, patrolled by very strong elite marines.'))];
    addObj(M, 'sign', at[0] + 4, at[1] + 1, { xact: key, solid: false, fp: [] }); }
  M.chunks.clear();
});
hookAfter('renderChunk', (c, M, cx, cy) => {
  const ox = cx * CH - MHQ_X, oy = cy * CH - MHQ_Y;
  if (!M || !M.mhq || ox + CH <= 0 || oy + CH <= 0 || ox >= MHQ_W || oy >= MHQ_H) return;
  const g = c.getContext('2d');
  for (let y = 0; y < CH; y++) for (let x = 0; x < CH; x++) {
    const tx = ox + x, ty = oy + y, t = mhqTile(tx, ty); if (!t) continue;
    const px = x * 16, py = y * 16; g.fillStyle = MHQ_COLORS[t]; g.fillRect(px, py, 16, 16);
    if (t === 'grass') { g.fillStyle = '#76a85c'; g.fillRect(px + (tx * 7 + ty * 3) % 13, py + 5, 2, 1); }
    else if (t === 'wall') { g.fillStyle = '#9aa8b2'; g.fillRect(px, py + 12, 16, 4); g.fillStyle = '#f4f8fa'; g.fillRect(px, py, 16, 2); if (tx % 2) { g.fillStyle = '#c4ced4'; g.fillRect(px + 4, py - 4, 8, 4); } }
    else if (t === 'plaza' || t === 'zone') { g.fillStyle = t === 'zone' ? '#93a0a8' : '#b8c2c8'; g.fillRect(px, py + 15, 16, 1); g.fillRect(px + ((tx + ty) % 2) * 8, py, 1, 15); if (t === 'zone' && (tx + ty) % 6 === 0) { g.fillStyle = '#c8a040'; g.fillRect(px + 2, py + 7, 12, 2); } }
    else if (t === 'dock') { g.fillStyle = '#9a9284'; g.fillRect(px, py + 15, 16, 1); g.fillRect(px, py + 7, 16, 1); }
    else if (t === 'sand') { g.fillStyle = '#d8cc9e'; g.fillRect(px + (tx * 5 + ty * 7) % 13, py + 6, 2, 1); }
  }
  return c;
});
hookAfter('orangeOverviewColor', (color, M, x, y) => { const t = M.mhq && mhqTile(x - MHQ_X, y - MHQ_Y); if (t) return C(MHQ_COLORS[t]); });
hookAfter('otherPOI', (out, M) => { if (M && M.mhq) for (const [at, t] of MHQ_PLACES) out.push({ x: at[0], y: at[1], c: 'inn', t }); });
// ---------- muelle ----------
function mhqDockKey() {
  const P = G.P, M = G.map; if (!M || !M.mhq || !P || P.dead || G.fading) return null;
  if (P.dawnHelm && P.dawnHelm.kind !== 'swim' && conomiNear(P, MHQ_MOOR, 64)) return dfHas() ? 'mhq_land' : 'mhq_locked';
  if (!P.dawnHelm && P.dawnBoat && P.dawnBoat.mhq && conomiNear(P, MHQ_PIER, 44)) return 'mhq_sail';
  return null;
}
XACT.mhq_land = [L2('Desembarcar en el Cuartel de la Marina', 'Land at Navy HQ'), 'ways', () => { if (mhqDockKey() === 'mhq_land') dawnIslandDock(true, 'mhq', MHQ_PIER, MHQ_MOOR, MHQ_NAME, L2('Aquí vigila la Justicia del East Blue', 'Where the East Blue’s Justice keeps watch')); }];
XACT.mhq_sail = [L2('Volver al barco', 'Return to your ship'), 'ways', () => { if (mhqDockKey() === 'mhq_sail') dawnIslandDock(false, 'mhq', MHQ_PIER, MHQ_MOOR, MHQ_NAME, ''); }];
XACT.mhq_locked = [L2('Desembarco · necesitas una Fruta del Diablo', 'Landing · Devil Fruit required'), 'ways', () => toast(L2('Necesitas el permiso de desembarco de la Fruta del Diablo.', 'You need the Devil Fruit landing permit.'), 'info', 4)];
XACT.mhq_zona = [L2('Aviso · zona restringida', 'Notice · restricted zone'), 'book', () => xMsg(L2('Zona restringida', 'Restricted zone'), L2('«Prohibido el paso. Marines de élite de guardia.» Patrullan marines de nivel 690-700 que reaparecen al rato: solo para los más fuertes. Dan mucha experiencia, oro y recompensa.', '"No entry. Elite marines on guard." Level 690-700 marines patrol here and come back after a while: only for the strongest. They give lots of experience, gold and bounty.'))];
hookAround('interactTarget', next => { const key = mhqDockKey(); return key ? rareAction(key) : next(); });
function mhqActive(P, M) { return !!(P && M && M.mhq && !P.dead && !P.dawnHelm && mhqTile((P.x >> 4) - MHQ_X, (P.y >> 4) - MHQ_Y)); }

// ---------- marines de élite en las zonas de los costados ----------
MOBS.mhq_elite = Object.assign({}, MOBS.dawn_marine_cap, { n: L2('Marine de élite del Cuartel', 'HQ elite marine'), reg: [], drops: [] });
MOBS.mhq_guardia = Object.assign({}, MOBS.dawn_marine, { n: L2('Guardia del Cuartel', 'HQ guard'), reg: [], drops: [] });
const MHQ_ELITE_N = 5, MHQ_RESPAWN = 25;
function mhqZoneAt(x, y) { for (let k = 0; k < MHQ_ZONES.length; k++) { const [x0, y0, x1, y1] = MHQ_ZONES[k]; if (x >= x0 && x <= x1 && y >= y0 && y <= y1) return k; } return -1; }
function mhqElites(M, P) {
  const S = M.mhqElite || (M.mhqElite = MHQ_ZONES.map(() => ({ alive: [], next: 0 })));
  S.forEach((z, k) => {
    z.alive = z.alive.filter(m => !m.remove && m.hp > 0 && !m.dying);
    const [x0, y0, x1, y1] = MHQ_ZONES[k], [cx, cy] = dawnPx(mhqAt((x0 + x1) / 2, (y0 + y1) / 2)), far = dist2(P.x, P.y, cx, cy) > 900 ** 2;
    if (far) { for (const m of z.alive) m.remove = true; z.alive = []; return; }
    if (z.alive.length >= MHQ_ELITE_N || G.t < z.next) return;
    z.next = G.t + (z.alive.length < 3 ? 0.5 : MHQ_RESPAWN / MHQ_ELITE_N);
    const at = freePxNear(M, ...dawnPx(mhqAt(x0 + 4 + Math.random() * (x1 - x0 - 8), y0 + 4 + Math.random() * (y1 - y0 - 8))), 4); if (!at) return;
    const cap = Math.random() < 0.45, m = spawnMob(cap ? 'mhq_elite' : 'mhq_guardia', 690 + Math.floor(Math.random() * 11), at[0], at[1], 0, null, false);
    if (m) { m.map = 'dawn'; m.home = { x: at[0], y: at[1] }; m.mhqZone = k; m.name = (cap ? '★ ' : '') + m.name; z.alive.push(m); }
  });
}
// no salen de su zona: si persiguen demasiado lejos, vuelven
hookAfter('updateMob', (r, m) => { if (m && m.mhqZone !== undefined && m.home && dist2(m.x, m.y, m.home.x, m.home.y) > 420 ** 2) { m.x = m.home.x; m.y = m.home.y; m.state = 'idle'; m.target = null; } });
V33_TICKS.push(() => {
  const M = G.map, P = G.P; if (!M || !P || !M.mhq) return;
  if (!mhqActive(P, M)) { if (M.mhqElite) { for (const z of M.mhqElite) { for (const m of z.alive) m.remove = true; z.alive = []; } } if (M.mhqLife) { for (const e of M.mhqLife) e.remove = true; M.mhqLife = null; } return; }
  mhqElites(M, P);
  if (!M.mhqLife) { M.mhqLife = []; for (const [x, y, face] of [[112, 106, 'down'], [128, 106, 'down'], [100, 160, 'down'], [140, 170, 'left'], [120, 190, 'up']]) { const at = freePxNear(M, ...dawnPx(mhqAt(x, y)), 3); if (!at) continue; const e = spawnNPC('mhq_guardia_npc', at[0], at[1], M.id, { face, wander: y > 150 ? 3 : 0, hgt: 36 }); if (e) M.mhqLife.push(e); } }
  if (!P.mhqSeen) { P.mhqSeen = 1; banner('⚓ ' + MHQ_NAME, L2('Los pasos de los costados llevan a zonas de marines de élite', 'The side passages lead to elite marine zones')); markDirty(); }
});
NPCS.mhq_guardia_npc = { n: L2('Marine de guardia', 'Navy guard'), title: MHQ_NAME, look: LK({}), quests: [], lines: [
  L2('Bienvenido al Cuartel General. Por el portón se entra al vestíbulo.', 'Welcome to Headquarters. The gate leads into the hall.'),
  L2('No te acerques a los costados: allí están los marines de élite.', 'Stay away from the sides: that’s where the elite marines are.'),
  L2('El vicealmirante Garp está de visita. Dicen que le gustan las galletas de arroz.', 'Vice Admiral Garp is visiting. They say he likes rice crackers.')], atlas: () => getAtlas('MR:logue_guard', () => buildAtlas(mrLook('dawn_marine'), ['idle', 'walk'], drawHero)) };
SAVEKEYS.push('mhqSeen', 'mhqGarp');

// ---------- vestíbulo (mapa interior) ----------
const MHQ_IN_W = 30, MHQ_IN_H = 20;
function mhqInTile(x, y) {
  if (y === MHQ_IN_H - 1 && (x === 14 || x === 15)) return 'door';
  if (x <= 0 || x >= MHQ_IN_W - 1 || y >= MHQ_IN_H - 1) return 'rim';
  if (y <= 2) return 'wall';
  if ((x === 6 || x === 23) && y >= 4 && y <= 15 && y % 4 === 0) return 'col';
  return 'floor';
}
function makeMhqHall() {
  if (G.maps.marina_hq) return G.maps.marina_hq;
  const w = MHQ_IN_W, h = MHQ_IN_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'marina_hq', w, h, I, ter: new Uint8Array(N), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', camps: [], exit: { x: -9, y: -9 }, hudName: MHQ_NAME, mhqHall: 1 };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = mhqInTile(x, y); M.ter[I(x, y)] = t === 'floor' || t === 'door' ? T.FLOOR : T.IWALL; }
  prepPalettes(M); initMapObjs(M);
  addObj(M, 'furn', 14, 18, { f: 'lg_puerta', fp: [], solid: false, xact: 'mhq_out' });
  addObj(M, 'furn', 15, 6, { f: 'lg_mostrador', fp: [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]] });
  for (const x of [4, 8, 21, 25]) addObj(M, 'furn', x, 3, { f: 'lg_armadura', fp: [[0, 0]] });
  G.maps.marina_hq = M; return M;
}
function mhqHallPaint(M, cx, cy) {
  const c = mkCanvas(CHP, CHP), g = c.getContext('2d'), t0x = cx * CH, t0y = cy * CH;
  for (let ty = 0; ty < CH; ty++) for (let tx = 0; tx < CH; tx++) {
    const x = t0x + tx, y = t0y + ty, X = tx * 16, Y = ty * 16, t = mhqInTile(x, y);
    if (x >= MHQ_IN_W || y >= MHQ_IN_H) { g.fillStyle = '#000'; g.fillRect(X, Y, 16, 16); continue; }
    if (t === 'rim') { g.fillStyle = '#5a6a7a'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#7a8a9a'; g.fillRect(X, Y + 3, 16, 2); continue; }
    if (t === 'wall') { g.fillStyle = '#e6ecf0'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#2a5a8e'; g.fillRect(X, Y + 11, 16, 3); if (y === 1 && x % 7 === 3) { g.fillStyle = '#2a5a8e'; g.fillRect(X + 2, Y - 2, 12, 12); g.fillStyle = '#f2f6f8'; g.fillRect(X + 5, Y + 1, 6, 6); } continue; }
    if (t === 'col') { g.fillStyle = '#c8d2d8'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#f2f6f8'; g.fillRect(X + 3, Y, 10, 16); continue; }
    g.fillStyle = (x + y) % 2 ? '#dfe5e8' : '#cfd7dc'; g.fillRect(X, Y, 16, 16);
    if (x >= 13 && x <= 16 && y > 6) { g.fillStyle = '#8a2a2a'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#c8a040'; if (x === 13) g.fillRect(X, Y, 2, 16); if (x === 16) g.fillRect(X + 14, Y, 2, 16); }
    if (t === 'door') { g.fillStyle = '#6a5a4a'; g.fillRect(X, Y, 16, 16); }
  }
  return c;
}
hookAround('renderChunk', (next, M, cx, cy) => M && M.mhqHall ? mhqHallPaint(M, cx, cy) : next(M, cx, cy));
const MHQ_HALL_CAST = [['mhq_garp', 15, 9, 'down'], ['mhq_recep', 15, 5, 'down'], ['mhq_guardia_npc', 9, 12, 'right'], ['mhq_guardia_npc', 21, 12, 'left'], ['mhq_guardia_npc', 12, 16, 'up'], ['mhq_guardia_npc', 18, 16, 'up']];
NPCS.mhq_garp = { n: 'Monkey D. Garp', title: L2('Vicealmirante · Héroe de la Marina', 'Vice Admiral · Navy Hero'), look: LK({}), quests: [], infArt: 'garp', infPor: 'garp', lines: [
  L2('¡Bwahahaha! ¿Vienes a alistarte? ¡Te haré un marine de verdad con mi Puño del Amor!', 'Bwahahaha! Here to enlist? I’ll make a real marine of you with my Fist of Love!'),
  L2('Mi nieto quiere ser pirata. ¡PIRATA! …Bueno, al menos es fuerte.', 'My grandson wants to be a pirate. A PIRATE! …Well, at least he’s strong.'),
  L2('¿Galletas de arroz? ¡Siempre llevo unas en el bolsillo!', 'Rice crackers? I always keep some in my pocket!')], atlas: () => infAtlas('garp') || npcAtlas('dawn_pirata') };
NPCS.mhq_recep = { n: L2('Recepcionista de la Marina', 'Navy receptionist'), title: MHQ_NAME, look: LK({}), quests: [], lines: [
  L2('Cuartel General de la Marina. Las zonas de los costados están restringidas: allí entrenan los marines de élite.', 'Navy Headquarters. The side zones are restricted: that’s where the elite marines train.'),
  L2('El vicealmirante Garp acepta duelos de entrenamiento… si te atreves.', 'Vice Admiral Garp accepts training duels… if you dare.')], atlas: () => getAtlas('MR:mhq_recep', () => buildAtlas(mrLook('dawn_marine'), ['idle', 'walk'], drawHero)) };
BOSSES.mhq_garp = { n: 'Monkey D. Garp', lv: 700, hp: 90, atk: 4.6, def: 4.2, spd: 92, r: 36, where: MHQ_NAME, art: ['inf_actor', 'garp'], moves: ['charge', 'slam', 'nova'], drops: [] };
if (typeof DAWN_RETO === 'object') DAWN_RETO.mhq_garp = 2.2;
function mhqHallCast(M) { if (M.mhqCast) for (const e of M.mhqCast) e.remove = true; M.mhqCast = MHQ_HALL_CAST.map(([id, x, y, face]) => spawnNPC(id, x * 16 + 8, y * 16 + 10, M.id, { face, hgt: id === 'mhq_garp' ? 46 : 36 })); }
XACT.mhq_in = [L2('Entrar al Cuartel General', 'Enter Headquarters'), 'ways', () => {
  const P = G.P; if (G.fading || P.dead) return;
  transition(() => { P._mhq = { x: P.x, y: P.y, boat: P.dawnBoat }; P.inside = 'marina_hq'; const M = makeMhqHall(); setMap(M, 15 * 16, 17 * 16 + 8, 'up'); mhqHallCast(M); banner(MHQ_NAME, L2('Vestíbulo', 'Main hall')); });
}];
XACT.mhq_out = [L2('Salir al patio', 'Go out to the courtyard'), 'ways', () => {
  const P = G.P; if (G.fading || P.dead) return;
  if (G.map && G.map.mhqDuel) mhqDuelEnd(G.map, false);
  transition(() => { const S = P._mhq || {}, [mx, my] = dawnPx(MHQ_MOOR), boat = S.boat || { x: mx, y: my, dir: 'down', h: { kind: 'skiff' }, mhq: true };
    P.inside = null; const M = makeDawn(); const [x, y] = dawnPx(MHQ_DOOR);
    // se entra al mapa por el amarre (el barco solo puede aparecer en el agua) y luego se pone al jugador en la puerta
    P.dawnHelm = boat.h || { kind: 'skiff' }; const ok = setMap(M, mx, my, 'down'); P.dawnHelm = null; P.dawnBoat = boat; P.x = x; P.y = y + 40; P.dir = 'down'; updateCamera(0, true);
    if (ok !== false) P._mhq = null; });
}];
// duelo con Garp en el vestíbulo
function mhqDuelStart() {
  const M = G.map, P = G.P; if (!M || !M.mhqHall || M.mhqDuel || P.dead) return; closeDialog();
  if (P.lv < 680) { toast(L2('Garp: «Vuelve cuando seas más fuerte. ¡Nivel 680 como mínimo!»', 'Garp: "Come back when you’re stronger. Level 680 at least!"'), 'info', 5); return; }
  for (const e of M.mhqCast || []) if (e.id === 'mhq_garp') e.remove = true;
  const m = spawnMob('mhq_garp', 700, 15 * 16 + 8, 9 * 16, 0, null, true); m.map = M.id; m.state = 'fight'; m.cd = 1.4; M.mhqDuel = { m };
  P.x = 15 * 16 + 8; P.y = 14 * 16; P.dir = 'up'; updateCamera(0, true);
  showBoss(m); sfx('boss'); banner('Monkey D. Garp', L2('Duelo de puños · Nivel 700', 'Fist duel · Level 700'));
}
function mhqDuelEnd(M, won) {
  const D = M.mhqDuel; if (!D) return; M.mhqDuel = null; if (!D.m.dying) D.m.remove = true; if (G.bossBar === D.m) showBoss(null);
  mhqHallCast(M); const P = G.P;
  if (!won) { toast(L2('Garp: «¡Bwahaha! Buen intento. Come algo y vuelve.»', 'Garp: "Bwahaha! Nice try. Eat something and come back."'), 'info', 5); return; }
  const first = !P.mhqGarp; P.mhqGarp = (P.mhqGarp || 0) + 1; const g = first ? 500000 : 80000; P.gold += g; markDirty(true);
  infTalk([['garp', first ? '¡BWAHAHA! ¡Me has ganado! ¡Tienes los puños de un vicealmirante! …No se lo digas a Sengoku.' : '¡Otra vez tú! ¡Me encantan los jóvenes con ganas de pelea!', first ? 'BWAHAHA! You beat me! You have the fists of a vice admiral! …Don’t tell Sengoku.' : 'You again! I love youngsters who like a good fight!']], () => toast('+' + g.toLocaleString() + ' ' + L2('oro', 'gold'), 'quest', 4));
}
V33_TICKS.push(() => {
  const M = G.map, P = G.P; if (!M || !M.mhqHall || !P) return;
  if (!M.mhqCast || M.mhqCast.every(e => e.remove)) mhqHallCast(M);
  const D = M.mhqDuel; if (!D) return;
  if (P.dead) { mhqDuelEnd(M, false); return; }
  if (D.m.dying || D.m.remove || D.m.hp <= 0) mhqDuelEnd(M, true);
});
DLG_HOOKS.push((npc, opts) => { if (npc && npc.id === 'mhq_garp' && G.map && G.map.mhqHall && !G.map.mhqDuel) opts.unshift({ label: '👊 ' + L2('Duelo de puños con Garp', 'Fist duel with Garp') + ' · ' + L2('Nv. ', 'Lv. ') + 700 + (G.P.mhqGarp ? '' : ' · 500.000'), icon: ['sword'], fn: mhqDuelStart }); });
hookAfter('setMap', () => { const H = G.maps && G.maps.marina_hq; if (H && G.map !== H) { if (H.mhqDuel) mhqDuelEnd(H, false); if (H.mhqCast) { for (const e of H.mhqCast) e.remove = true; H.mhqCast = null; } } });
// ---------- Lupa ----------
LUPA_DAWN.push(['mhq630', () => '⚓ ' + MHQ_NAME, () => [
  L2('Isla al sur del Mar de Dawn, entre Shimotsuki y Villa Syrup. Se desembarca en su muelle con la Fruta del Diablo.', 'Island in the south of the Dawn Sea, between Shimotsuki and Syrup Village. Land at its pier with the Devil Fruit.'),
  L2('Fortaleza blanca con los dos grandes arcos y barcos de la Marina. Por el portón se entra al vestíbulo (recepción, marines y Garp).', 'White fortress with the two great arches and Navy ships. The gate leads into the hall (reception, marines and Garp).'),
  L2('Zonas restringidas a los costados (por los pasos del muro): marines de élite de nivel 690-700 que reaparecen. Mucha experiencia, oro y recompensa.', 'Restricted zones on the sides (through the wall passages): level 690-700 elite marines who respawn. Lots of experience, gold and bounty.'),
  ((G.P && G.P.mhqGarp) ? '✅ ' : '⬜ ') + L2('Duelo de puños con Garp (700, desde nivel 680): 500.000 de oro la primera vez, luego 80.000.', 'Fist duel with Garp (700, from level 680): 500,000 gold the first time, then 80,000.')],
  () => ({ loc: G.P && G.P.dawnHelm ? MHQ_MOOR : MHQ_DOOR, m: 'dawn', t: MHQ_NAME })]);
