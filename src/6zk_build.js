// ================= v3.7: CONSTRUCCIÓN (modo sandbox) =================
// Mesa de trabajo en cada pueblo: con troncos, piedra y oro fabricas suelos, paredes con profundidad, puertas, ventanas,
// vallas, muebles, antorchas y tierra de cultivo. Se colocan arrastrando con el dedo cerca de los pueblos y en tu casa.
// Cada bloque tiene dueño: nadie puede romper lo que construyó otro jugador. Para quitar hace falta hacha o pico del nivel del material.
// En multijugador (WiFi y online) los demás ven tus construcciones del mundo y chocan con tus paredes.
it('piedra', { n: 'Piedra', t: 'mat', stack: true, tier: 1, price: 3, icon: ['gem', '#9a96a0'] });
const BK = {
  // suelos (capa 0)
  fl_wood: { n: 'Suelo de madera', L: 0, cost: [['log', 1]], tool: 'tala', tier: 1, cat: 'suelo' },
  fl_dark: { n: 'Tarima oscura', L: 0, cost: [['log', 2]], tool: 'tala', tier: 1, cat: 'suelo' },
  fl_stone: { n: 'Suelo de piedra', L: 0, cost: [['piedra', 2]], tool: 'mineria', tier: 1, cat: 'suelo' },
  fl_tile: { n: 'Baldosas', L: 0, cost: [['piedra', 2]], gold: 30, tool: 'mineria', tier: 1, cat: 'suelo' },
  fl_red: { n: 'Moqueta roja', L: 0, cost: [], gold: 90, tool: 'tala', tier: 1, cat: 'suelo' },
  fl_blue: { n: 'Moqueta azul', L: 0, cost: [], gold: 90, tool: 'tala', tier: 1, cat: 'suelo' },
  fl_path: { n: 'Camino de grava', L: 0, cost: [['piedra', 1]], tool: 'mineria', tier: 1, cat: 'suelo' },
  // estructura (capa 1)
  w_wood: { n: 'Pared de madera', wall: 'wood', cost: [['log', 2]], tool: 'tala', tier: 1, cat: 'pared' },
  w_woodwin: { n: 'Ventana de madera', wall: 'wood', win: 1, cost: [['log', 2], ['piedra', 1]], tool: 'tala', tier: 1, cat: 'pared' },
  w_stone: { n: 'Pared de piedra', wall: 'stone', cost: [['piedra', 3]], tool: 'mineria', tier: 1, cat: 'pared' },
  w_brick: { n: 'Pared de ladrillo', wall: 'brick', cost: [['piedra', 2], ['ore1', 1]], tool: 'mineria', tier: 2, cat: 'pared' },
  w_ebony: { n: 'Pared de ébano', wall: 'ebony', cost: [['log4', 2]], tool: 'tala', tier: 3, cat: 'pared' },
  w_crystal: { n: 'Pared de cristal', wall: 'crystal', win: 1, cost: [['piedra', 2], ['ore7', 1]], tool: 'mineria', tier: 3, cat: 'pared' },
  door_wood: { n: 'Puerta de madera', wall: 'wood', door: 1, cost: [['log', 3]], tool: 'tala', tier: 1, cat: 'pared' },
  door_stone: { n: 'Puerta de piedra', wall: 'stone', door: 1, cost: [['piedra', 3], ['log', 1]], tool: 'mineria', tier: 1, cat: 'pared' },
  fence_wood: { n: 'Valla de madera', fence: 'wood', cost: [['log', 1]], tool: 'tala', tier: 1, cat: 'pared' },
  fence_stone: { n: 'Muro bajo de piedra', fence: 'stone', cost: [['piedra', 2]], tool: 'mineria', tier: 1, cat: 'pared' },
  // muebles
  bed: { n: 'Cama', f: 'bed', fp: [[0, 0], [0, 1]], cost: [['log', 4]], gold: 200, tool: 'tala', tier: 1, cat: 'mueble' },
  bigbed: { n: 'Cama matrimonial', f: 'bigbed', fp: [[0, 0], [1, 0], [0, 1], [1, 1]], cost: [['log', 6]], gold: 900, tool: 'tala', tier: 1, cat: 'mueble' },
  kidbed: { n: 'Cama infantil', f: 'kidbed', fp: [[0, 0], [0, 1]], cost: [['log', 3]], gold: 150, tool: 'tala', tier: 1, cat: 'mueble' },
  crib: { n: 'Cuna', f: 'crib', fp: [[0, 0], [1, 0]], cost: [['log', 3]], gold: 150, tool: 'tala', tier: 1, cat: 'mueble' },
  table: { n: 'Mesa', f: 'table', fp: [[0, 0], [1, 0]], cost: [['log', 3]], tool: 'tala', tier: 1, cat: 'mueble' },
  chair: { n: 'Silla', f: 'chair', cost: [['log', 1]], tool: 'tala', tier: 1, cat: 'mueble' },
  sofa: { n: 'Sofá', f: 'sofa', fp: [[0, 0], [1, 0]], cost: [['log', 2]], gold: 400, tool: 'tala', tier: 1, cat: 'mueble' },
  bookshelf: { n: 'Estantería', f: 'bookshelf', fp: [[0, 0], [1, 0]], cost: [['log', 4]], tool: 'tala', tier: 1, cat: 'mueble' },
  wardrobe: { n: 'Armario', f: 'wardrobe', cost: [['log', 5]], gold: 500, tool: 'tala', tier: 1, cat: 'mueble' },
  mirror: { n: 'Espejo', f: 'mirror', cost: [['piedra', 1]], gold: 400, tool: 'mineria', tier: 1, cat: 'mueble' },
  fireplace: { n: 'Chimenea', f: 'fireplace', fp: [[0, 0], [1, 0], [-1, 0]], cost: [['piedra', 6], ['log', 2]], tool: 'mineria', tier: 1, cat: 'mueble' },
  chest: { n: 'Baúl', f: 'chest', cost: [['log', 4]], tool: 'tala', tier: 1, cat: 'mueble' },
  toybox: { n: 'Caja de juguetes', f: 'toybox', cost: [['log', 2]], gold: 80, tool: 'tala', tier: 1, cat: 'mueble' },
  desk: { n: 'Escritorio (decorar)', f: 'desk', cost: [['log', 3]], tool: 'tala', tier: 1, cat: 'mueble' },
  workbench: { n: 'Mesa de trabajo', f: 'workbench', fp: [[0, 0], [1, 0]], cost: [['log', 4]], tool: 'tala', tier: 1, cat: 'mueble' },
  rug: { n: 'Alfombra roja', f: 'rug', solid: false, cost: [], gold: 250, tool: 'tala', tier: 1, cat: 'deco' },
  rugb: { n: 'Alfombra azul', f: 'rugb', solid: false, cost: [], gold: 250, tool: 'tala', tier: 1, cat: 'deco' },
  painting: { n: 'Cuadro del valle', f: 'painting', solid: false, cost: [], gold: 500, tool: 'tala', tier: 1, cat: 'deco' },
  painting2: { n: 'Retrato estelar', f: 'painting2', solid: false, cost: [], gold: 900, tool: 'tala', tier: 1, cat: 'deco' },
  plant: { n: 'Planta', f: 'plant', cost: [], gold: 60, tool: 'tala', tier: 1, cat: 'deco' },
  flowers: { n: 'Jarrón de flores', f: 'flowers', cost: [], gold: 90, tool: 'tala', tier: 1, cat: 'deco' },
  lamp: { n: 'Lámpara', f: 'lamp', cost: [['ore1', 1]], gold: 150, tool: 'mineria', tier: 1, cat: 'deco' },
  torch: { n: 'Antorcha', f: 'btorch', cost: [['log', 1]], tool: 'tala', tier: 1, cat: 'deco' },
  // granja
  soil: { n: 'Tierra de cultivo', plot: 1, solid: false, cost: [], gold: 15, tool: 'tala', tier: 1, cat: 'granja' },
  // escaleras de la casa (no se fabrican)
  stair_up: { n: 'Escalera', f: 'ystair_up', fp: [[0, 0], [-1, 0]], sys: 1, cat: 'x' },
  stair_dn: { n: 'Escalera', f: 'ystair_down', fp: [[0, 0], [-1, 0]], sys: 1, cat: 'x' },
  hedge: { n: 'Seto', f: 'bhedge', sys: 1, cat: 'x' },
};
const BK_KEYS = Object.keys(BK);
const BK_CAT = [['suelo', 'Suelos'], ['pared', 'Paredes y puertas'], ['mueble', 'Muebles'], ['deco', 'Decoración'], ['granja', 'Granja']];
for (const k of BK_KEYS) { const b = BK[k]; b.L = b.L === 0 ? 0 : 1; if (b.cat === 'x') continue; it('bk_' + k, { n: b.n, t: 'mat', bk: k, stack: true, tier: 1, price: 5, icon: ['bk', k] }); }
SAVEKEYS.push('builds', 'homeV');
const CLR_K = new Set(['tree', 'rock', 'bush', 'ore', 'herb', 'mound']);
// ---------- sprites ----------
const BW_TOP = { wood: ['#2a180c', '#4a2e18', '#6a4426', '#8a5c34'], stone: ['#2a2a32', '#4a4a56', '#6a6a76', '#8e8e9a'], brick: ['#3a1a14', '#5a2a22', '#7a3a2e', '#9a5040'], ebony: ['#120a10', '#22141e', '#34202e', '#4a3042'], crystal: ['#1a3a5a', '#2a5a8a', '#4a8ac0', '#8ad0ff'] };
const BW_FACE = { wood: ['#4a2c14', '#6e4424', '#8e5a30', '#b07a44'], stone: ['#3e3e48', '#5e5e6a', '#7e7e8a', '#a2a2ae'], brick: ['#5a2018', '#8a3426', '#b04a34', '#d0705a'], ebony: ['#1e121a', '#30202a', '#46303e', '#5e4456'], crystal: ['#2a5a8a', '#4a8ac0', '#7ab8e8', '#c8ecff'] };
function genBWall(mat, mask, kind) { // mask: 1 N, 2 E, 4 S, 8 W (vecinos que son pared)
  const p = new Pix(16, 28), T4 = BW_TOP[mat].map(h => C(h)), F = BW_FACE[mat].map(h => C(h)), S = mask & 4;
  if (kind === 'door' && S) { // hueco de puerta en una pared vertical: dintel arriba y el suelo se ve
    p.rect(0, 0, 16, 12, T4[2]); p.hl(0, 0, 16, T4[3]); p.hl(0, 11, 16, T4[0]); p.rect(0, 12, 2, 16, T4[1]); p.rect(14, 12, 2, 16, T4[1]); p.rect(3, 12, 10, 2, C('#1a0e08'));
    return { c: p.canvas(), ax: 8, ay: 26 }; }
  p.rect(0, 0, 16, S ? 28 : 16, T4[2]);
  for (let y = 3; y < (S ? 28 : 16); y += 6) p.hl(0, y, 16, T4[1]);
  if (mat === 'stone' || mat === 'brick') for (let k = 0; k < 6; k++) p.set((k * 5 + mask) % 15, (k * 7) % (S ? 27 : 15), T4[3]);
  if (!(mask & 1)) { p.hl(0, 0, 16, T4[0]); p.hl(0, 1, 16, T4[3]); }
  if (!(mask & 8)) { p.vl(0, 0, S ? 28 : 16, T4[0]); p.vl(1, 1, S ? 27 : 15, T4[3]); }
  if (!(mask & 2)) { p.vl(15, 0, S ? 28 : 16, T4[0]); p.vl(14, 1, S ? 27 : 15, T4[1]); }
  if (!S) {
    p.hl(0, 15, 16, T4[0]); p.rect(0, 16, 16, 12, F[2]); p.hl(0, 16, 16, F[3]); p.hl(0, 27, 16, F[0]);
    if (mat === 'wood' || mat === 'ebony') { for (let x = 3; x < 16; x += 4) p.vl(x, 17, 10, F[1]); }
    else if (mat === 'crystal') { for (let k = 0; k < 4; k++) p.set(3 + k * 3, 18 + k * 2, F[3]); }
    else for (let y = 19; y < 27; y += 4) { p.hl(0, y, 16, F[1]); for (let x = ((y >> 2) & 1) * 4; x < 16; x += 8) p.vl(x, y - 3, 3, F[1]); }
    if (!(mask & 8)) p.vl(0, 16, 12, F[0]); if (!(mask & 2)) p.vl(15, 16, 12, F[0]);
    if (kind === 'win') { p.rect(4, 18, 8, 7, C('#2a1a10')); p.rect(5, 19, 6, 5, C('#8ac8f0')); p.set(6, 20, C('#e8f8ff')); p.set(7, 20, C('#e8f8ff')); p.vl(8, 19, 5, C('#2a1a10')); }
    if (kind === 'door') { p.rect(3, 16, 10, 12, C('#1a0e08')); p.rect(4, 17, 8, 11, F[1]); p.vl(8, 17, 11, F[0]); p.set(10, 22, C('#ffd040')); p.hl(3, 16, 10, T4[0]); }
  }
  return { c: p.canvas(), ax: 8, ay: 26 };
}
function genBFence(mat, mask) {
  const p = new Pix(16, 16), F = BW_FACE[mat].map(h => C(h)), stone = mat === 'stone';
  if (stone) { p.rect(3, 6, 10, 9, F[2]); p.hl(3, 6, 10, F[3]); if (mask & 8) p.rect(0, 8, 4, 6, F[1]); if (mask & 2) p.rect(12, 8, 4, 6, F[1]); if (mask & 1) p.rect(5, 0, 6, 7, F[2]); }
  else { p.rect(6, 4, 4, 11, F[2]); p.vl(6, 4, 11, F[3]); p.hl(6, 4, 4, F[3]); if (mask & 8) { p.hl(0, 7, 7, F[2]); p.hl(0, 11, 7, F[2]); } if (mask & 2) { p.hl(9, 7, 7, F[2]); p.hl(9, 11, 7, F[2]); } if (mask & 1) p.rect(7, 0, 2, 5, F[1]); }
  p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 14 };
}
const BFL = {};
function floorSpr(k, v) {
  const key = k + v; if (BFL[key]) return BFL[key]; const p = new Pix(16, 16);
  const P4 = { fl_wood: ['#6a4426', '#8a5a32', '#a87444', '#c08c58'], fl_dark: ['#2e1c12', '#46301e', '#5c3e28', '#744e34'], fl_stone: ['#4e4e58', '#6a6a76', '#84848e', '#a4a4ae'], fl_tile: ['#8a7a6a', '#c8b8a0', '#e8dcc4', '#f6eedc'], fl_red: ['#5a1018', '#8a2030', '#b03040', '#d8b040'], fl_blue: ['#101a4a', '#203a8a', '#3050b0', '#d8b040'], fl_path: ['#6a6058', '#8a8076', '#a69c90', '#c4bcb0'] }[k].map(h => C(h));
  if (k === 'fl_wood' || k === 'fl_dark') { p.rect(0, 0, 16, 16, P4[2]); for (let y = 0; y < 16; y += 4) { p.hl(0, y, 16, P4[1]); p.hl(0, y + 1, 16, P4[3]); const sx = ((y >> 2) * 5 + v * 7) % 16; p.vl(sx, y + 1, 3, P4[0]); } }
  else if (k === 'fl_stone') { p.rect(0, 0, 16, 16, P4[2]); p.hl(0, 0, 16, P4[0]); p.vl(0, 0, 16, P4[0]); p.hl(0, 8, 16, P4[1]); p.vl(v ? 5 : 11, 0, 8, P4[1]); p.vl(v ? 11 : 5, 8, 8, P4[1]); p.set(3, 3, P4[3]); p.set(12, 11, P4[3]); }
  else if (k === 'fl_tile') { for (let y = 0; y < 16; y += 8) for (let x = 0; x < 16; x += 8) p.rect(x, y, 8, 8, ((x + y) >> 3) % 2 ? P4[2] : P4[3]); p.hl(0, 0, 16, P4[1]); p.vl(0, 0, 16, P4[1]); }
  else if (k === 'fl_path') { p.rect(0, 0, 16, 16, P4[1]); for (let n = 0; n < 14; n++) p.set(Math.floor(hash2(n, v, 5) * 16), Math.floor(hash2(v, n, 6) * 16), n % 2 ? P4[3] : P4[0]); }
  else { p.rect(0, 0, 16, 16, P4[1]); for (let y = 1; y < 16; y += 3) for (let x = (y % 2); x < 16; x += 3) p.set(x, y, P4[2]); if (v) p.set(7, 7, P4[3]); }
  return (BFL[key] = p.canvas());
}
{ const _g2 = genFurn2; genFurn2 = function (kind) {
  if (kind === 'workbench') { const p = new Pix(32, 24), W_ = WOOD; p.rect(1, 6, 30, 7, W_[3]); p.hl(1, 6, 30, W_[5]); woodPost(p, 3, 13, 23, 3); woodPost(p, 26, 13, 23, 3); p.rect(4, 2, 8, 5, IRON[2]); p.hl(4, 2, 8, IRON[3]); p.rect(16, 3, 2, 4, W_[1]); p.rect(14, 2, 6, 2, IRON[3]); p.rect(22, 4, 6, 3, C('#c8a070')); p.rect(23, 1, 1, 3, IRON[3]); p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 22 }; }
  if (kind === 'btorch') { const p = new Pix(10, 26); p.rect(4, 8, 2, 17, WOOD[2]); p.vl(4, 8, 17, WOOD[4]); p.rect(3, 6, 4, 3, IRON[2]); p.ball(5, 4, 3, 3.5, [C('#c83a10'), C('#ff8a20'), C('#ffd060'), C('#fff4c0')]); p.outline(OUTL); return { c: p.canvas(), ax: 5, ay: 24 }; }
  if (kind === 'bhedge') { const p = new Pix(16, 18); p.ball(8, 10, 8, 7, pal(['#143a14', '#225a22', '#327a32', '#5aa04a'])); p.set(4, 7, C('#ff8ab0')); p.set(11, 9, C('#ffe060')); p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 16 }; }
  return _g2(kind); }; }
// ---------- datos: los míos y los de otros jugadores ----------
const BLD = { P: null, mine: new Map(), rem: new Map(), dirty: true, ver: 0, worldList: null, on: false, mode: 'move', sel: null, drag: null, ghost: null };
const bkey = (m, x, y, L) => m + '|' + x + '|' + y + '|' + L;
function bldMine() {
  const P = G.P; if (BLD.P !== P) { BLD.P = P; BLD.mine = new Map(); BLD.worldList = null; BLD.dirty = true; if (P) for (const r of P.builds || []) if (Array.isArray(r) && BK[r[4]] || (r && r[4] === 'clr')) BLD.mine.set(bkey(r[0], r[1], r[2], r[3]), { m: r[0], x: r[1], y: r[2], L: r[3], k: r[4], sl: r[5] || undefined, sys: r[6] || undefined }); }
  return BLD.mine;
}
function bldSave() { const P = G.P; P.builds = [...BLD.mine.values()].map(r => [r.m, r.x, r.y, r.L, r.k, r.sl || 0, r.sys || 0]); BLD.ver++; BLD.worldList = null; BLD.dirty = true; markDirty(); }
function bldPut(r) { bldMine().set(bkey(r.m, r.x, r.y, r.L), r); }
function bldDel(m, x, y, L) { bldMine().delete(bkey(m, x, y, L)); }
function bldGet(m, x, y, L) { return bldMine().get(bkey(m, x, y, L)); }
// todos los registros (míos y remotos) de un mapa
function bldRecs(mid) { const out = new Map(), MM = G.maps && G.maps[mid]; if (MM && MM.fixed) for (const [k, r] of MM.fixed) out.set(k, r); for (const st of BLD.rem.values()) for (const r of st.act.values()) if (r.m === mid) out.set(bkey(r.m, r.x, r.y, r.L), Object.assign({ remote: st.id }, r)); for (const r of bldMine().values()) if (r.m === mid) out.set(bkey(r.m, r.x, r.y, r.L), r); return out; }
// ---------- aplicar al mapa ----------
function bldTileFree(M, x, y, ignore) { const i = tileAt(M, x, y); if (i < 0) return false; const oi = M.objAt[i]; return oi < 0 || (ignore && oi === ignore.id); }
function bldAddObj(M, r) {
  const b = BK[r.k];
  if (r.k === 'clr') { const i = tileAt(M, r.x, r.y); if (i < 0) return null; const oi = M.objAt[i]; const o = oi >= 0 ? M.objs[oi] : null; if (!o || !CLR_K.has(o.k)) return null; bldHideObj(M, o); o.respawn = 0; return { clr: o }; }
  if (!b || b.L === 0) return null;
  const base = { bk: r.k, bmine: !r.remote, bremote: r.remote || null, bsys: r.sys || 0 };
  if (b.wall) return addObj(M, 'bwall', r.x, r.y, Object.assign(base, { mat: b.wall, wk: b.door ? 'door' : b.win ? 'win' : '', solid: !b.door }));
  if (b.fence) return addObj(M, 'bfence', r.x, r.y, Object.assign(base, { mat: b.fence }));
  if (b.plot) return addObj(M, 'plot', r.x, r.y, Object.assign(base, { pid: 'b_' + M.id + '_' + r.x + '_' + r.y, solid: false }));
  let f = b.f; if (f === 'crib' && M.home && typeof babyInCrib === 'function' && babyInCrib(M.id)) f = 'cribbaby';
  const o = addObj(M, 'furn', r.x, r.y, Object.assign(base, { f, fp: b.fp || [[0, 0]], solid: b.solid !== false }));
  if (r.k === 'stair_up' || r.k === 'stair_dn') o.bstair = 1;
  return o;
}
function bldHideObj(M, o) { o.hidden = true; for (const [dx, dy] of o.fp || [[0, 0]]) { const i = tileAt(M, o.tx + dx, o.ty + dy); if (i >= 0 && M.objAt[i] === o.id) { M.objAt[i] = -1; M.solidO[i] = 0; } } }
function bldShowObj(M, o) { o.hidden = false; for (const [dx, dy] of o.fp || [[0, 0]]) { const i = tileAt(M, o.tx + dx, o.ty + dy); if (i >= 0 && M.objAt[i] < 0) { M.objAt[i] = o.id; if (o.solid !== false) M.solidO[i] = 1; } } }
function bldApply(M) {
  if (!M || !M.objs) return; M.bobj = M.bobj || new Map(); const want = bldRecs(M.id), cur = M.bobj;
  for (const [k, ent] of cur) { const r = want.get(k); if (r && r.k === ent.k && !!r.remote === !!ent.remote) continue; if (ent.o) { if (ent.o.clr) bldShowObj(M, ent.o.clr); else bldHideObj(M, ent.o); } cur.delete(k); }
  for (const [k, r] of want) { if (cur.has(k)) continue; if (r.L === 0) { cur.set(k, { k: r.k, remote: r.remote, o: null, r }); continue; }
    // no tapar objetos del mundo (salvo los míos, que se movieron)
    const b = BK[r.k]; if (b && r.L === 1 && !(b.fp || [[0, 0]]).every(([dx, dy]) => bldTileFree(M, r.x + dx, r.y + dy))) continue;
    cur.set(k, { k: r.k, remote: r.remote, o: bldAddObj(M, r), r }); }
  M.bfl = [...cur.values()].filter(e => e.r && e.r.L === 0).map(e => e.r);
}
function bldAt(M, x, y, L) { const e = M && M.bobj && M.bobj.get(bkey(M.id, x, y, L)); return e || null; }
// ---------- dibujo ----------
function bldMask(M, x, y, fence) { let m = 0; const is = (xx, yy) => { const e = bldAt(M, xx, yy, 1); if (!e) return false; const b = BK[e.k]; return fence ? !!(b && (b.fence || b.wall)) : !!(b && b.wall); };
  if (is(x, y - 1)) m |= 1; if (is(x + 1, y)) m |= 2; if (is(x, y + 1)) m |= 4; if (is(x - 1, y)) m |= 8; return m; }
{ const _os = objSprite; objSprite = function (o) {
  if (o.k === 'bwall') { const m = bldMask(G.map, o.tx, o.ty); return spr('bw' + o.mat + o.wk + m, () => genBWall(o.mat, m, o.wk)); }
  if (o.k === 'bfence') { const m = bldMask(G.map, o.tx, o.ty, 1); return spr('bf' + o.mat + m, () => genBFence(o.mat, m)); }
  return _os(o); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl(M, cx, cy, list); for (const d of list) if (d.k === 'furn' && (d.f === 'btorch' || d.f === 'lamp') && !d.hidden) out.push({ x: d.px, y: d.py - 18, r: d.f === 'btorch' ? 56 : 48, c: 'rgba(255,170,70,0.5)' }); return out; }; }
function bldDrawFloors(M, cx, cy) {
  const L = M.bfl; if (!L || !L.length) return;
  for (const r of L) { const x = r.x * 16 - cx, y = r.y * 16 - cy; if (x < -16 || y < -16 || x > VW || y > VH) continue; ctx.drawImage(floorSpr(r.k, (r.x * 7 + r.y * 3) % 2), x, y); }
}
function bldHookMap(M) { if (!M || M._bde === M.drawExtra && M._bde) return; const prev = M.drawExtra; const f = (cx, cy) => { if (prev) prev(cx, cy); bldDrawFloors(M, cx, cy); }; M.drawExtra = f; M._bde = f; }
// ---------- dónde se puede construir ----------
const BLD_TOWN_R = 16;
function bldHomeBase(id) { const H = HOUSES[id]; return H && H.upper ? H.upper : id; }
function bldZone(M, x, y) {
  if (!M) return false; if (M.bnew) return isHome(bldHomeBase(M.id)) && x > 0 && y > 0 && x < M.w - 1 && y < M.h - 1;
  if (!M.isWorld) return false; const i = tileAt(M, x, y); if (i < 0) return false;
  for (const t of TOWNS) if (x >= t.x0 - BLD_TOWN_R && x <= t.x1 + BLD_TOWN_R && y >= t.y0 - BLD_TOWN_R && y <= t.y1 + BLD_TOWN_R) return true;
  return false;
}
function bldGroundOk(M, x, y, floor) {
  const i = tileAt(M, x, y); if (i < 0) return false; const t = M.ter[i];
  if (SOLID_T[t] || t === T.WATER || t === T.DEEP || t === T.LAVA || t === T.STAIRS || t === T.BRIDGE || t === T.FALL) return false;
  if (M.isWorld) { if (t === T.COBBLE || (M.flags[i] & 1) || (M.rail && M.rail[i]) || (M.doors || []).some(d => Math.abs(d.x - x) <= 1 && (d.y === y || d.y + 1 === y))) return false; }
  if (M.bnew && M.exit && x === M.exit.x && y >= M.exit.y - 1) return false;
  return true;
}
function bldCanPlace(M, k, x, y, moving) {
  const b = BK[k]; if (!b || !bldZone(M, x, y)) return false;
  if (b.L === 0) return bldGroundOk(M, x, y, true) && !bldAt(M, x, y, 0);
  const P = G.P, ptx = Math.floor(P.x / 16), pty = Math.floor(P.y / 16);
  for (const [dx, dy] of b.fp || [[0, 0]]) { const xx = x + dx, yy = y + dy; if (!bldZone(M, xx, yy) || !bldGroundOk(M, xx, yy)) return false; if (!bldTileFree(M, xx, yy, moving)) return false; if (b.solid !== false && !b.door && xx === ptx && yy === pty) return false; }
  return true;
}
// ---------- acciones ----------
function bkCount(k) { return countItem('bk_' + k); }
function toolOk(b) { const need = b.tier || 1, have = bestTool(b.tool || 'tala'); if (need <= 1 || have >= need) return true; toast((b.tool === 'mineria' ? 'Necesitas un pico de nivel ' : 'Necesitas un hacha de nivel ') + need + ' o mejor', 'warn'); return false; }
function bldPlace(k, x, y) {
  const M = G.map, P = G.P; if (!bkCount(k)) { toast('No te quedan: ' + BK[k].n + '. Fabrícalos en una mesa de trabajo.', 'warn'); return false; }
  if (!bldCanPlace(M, k, x, y)) { sfx('hurt'); return false; }
  if (M.isWorld && [...bldMine().values()].filter(r => r.m === 'world').length >= 1500) { toast('Has llegado al máximo de 1500 bloques en el mundo', 'warn'); return false; }
  takeItem('bk_' + k, 1); const rec = { m: M.id, x, y, L: BK[k].L, k }; if (typeof homeSlotAdopt === 'function') homeSlotAdopt(M, rec); bldPut(rec); bldSave(); bldApply(M); sfx('equip'); burst(x * 16 + 8, y * 16 + 10, 6, { sp: 30, up: 30, g: 80, life: 0.4, c: ['#c8a070', '#ffffff'] }); return true;
}
function bldRemoveAt(x, y) {
  const M = G.map, P = G.P; if (!bldZone(M, x, y)) return;
  // primero el objeto de arriba, luego el suelo
  const i = tileAt(M, x, y), oi = i >= 0 ? M.objAt[i] : -1, o = oi >= 0 ? M.objs[oi] : null;
  if (o && o.bk) {
    if (o.bremote) { toast('Esto lo construyó otro jugador: no puedes romperlo', 'warn'); sfx('hurt'); return; }
    if (o.bsys || BK[o.bk].sys) { toast('Esto no se puede quitar', 'warn'); return; }
    if (!toolOk(BK[o.bk])) return;
    if (o.k === 'plot' && P.farm && P.farm[o.pid]) delete P.farm[o.pid];
    const rr = bldGet(M.id, o.tx, o.ty, 1); if (typeof homeSlotRemoved === 'function') homeSlotRemoved(M, rr); bldDel(M.id, o.tx, o.ty, 1); giveItem('bk_' + o.bk, 1, true); bldSave(); bldApply(M); sfx(BK[o.bk].tool === 'mineria' ? 'mine' : 'chop'); return;
  }
  if (o && CLR_K.has(o.k) && !o.bk) { // árboles y rocas: se quitan para siempre
    const need = o.k === 'tree' ? (WOODT[o.sp] || 1) : o.k === 'ore' ? Math.max(1, Math.min(4, Math.ceil((o.tier || 1) / 3))) : 1, tool = o.k === 'tree' || o.k === 'bush' ? 'tala' : o.k === 'herb' ? 'tala' : 'mineria';
    if (o.k !== 'herb' && o.k !== 'bush' && bestTool(tool) < Math.min(4, need)) { toast((tool === 'mineria' ? 'Necesitas un pico de nivel ' : 'Necesitas un hacha de nivel ') + Math.min(4, need) + ' o mejor', 'warn'); return; }
    bldPut({ m: M.id, x: o.tx, y: o.ty, L: 2, k: 'clr' }); bldSave(); bldApply(M);
    if (o.k === 'tree') giveItem('log' + Math.min(11, WOODT[o.sp] || 1), 2, true); else if (o.k === 'rock') giveItem('piedra', 3, true); else if (o.k === 'ore') { giveItem('piedra', 2, true); if (ITEMS['ore' + (o.tier || 1)]) giveItem('ore' + (o.tier || 1), 1, true); }
    sfx(tool === 'mineria' ? 'mine' : 'chop'); burst(o.px, o.py - 8, 10, { sp: 50, up: 50, g: 90, life: 0.6, c: ['#8a6a4a', '#5a8a3a', '#c8c0b0'] }); toast('Quitado para siempre', 'job'); return;
  }
  const f = bldAt(M, x, y, 0); if (f && f.r && !f.remote) { if (!toolOk(BK[f.k])) return; bldDel(M.id, x, y, 0); giveItem('bk_' + f.k, 1, true); bldSave(); bldApply(M); sfx('hit'); return; }
  if (f && f.remote) { toast('Esto lo construyó otro jugador: no puedes romperlo', 'warn'); return; }
}
function bldMove(o, x, y) {
  const M = G.map; if (!o || !o.bk || o.bremote || o.bsys) return false; if (o.tx === x && o.ty === y) return false;
  if (!bldCanPlace(M, o.bk, x, y, o)) { sfx('hurt'); return false; }
  const r = bldGet(M.id, o.tx, o.ty, 1); if (!r) return false; bldDel(M.id, o.tx, o.ty, 1); r.x = x; r.y = y; bldPut(r); bldSave(); bldApply(M); sfx('equip'); return true;
}
// ---------- mesa de trabajo ----------
function bkCostTxt(b) { const parts = (b.cost || []).map(([id, n]) => `${n} ${id === 'log' ? 'troncos' : esc(ITEMS[id] ? ITEMS[id].n : id)}`); if (b.gold) parts.push(fmt(b.gold) + ' oro'); return parts.join(' · ') || 'gratis'; }
function bkHave(id) { return id === 'log' ? logCount() : countItem(id); }
function bkCanCraft(b, n) { const P = G.P; return (b.cost || []).every(([id, q]) => bkHave(id) >= q * n) && P.gold >= (b.gold || 0) * n; }
function bkCraft(k, n) { const b = BK[k], P = G.P; if (!bkCanCraft(b, n)) { toast('Te faltan materiales', 'warn'); return; } for (const [id, q] of b.cost || []) { if (id === 'log') takeLogs(q * n); else takeItem(id, q * n); } P.gold -= (b.gold || 0) * n; giveItem('bk_' + k, n); sfx('forge'); gainJobXp('herreria', 2 * n); markDirty(true); }
let wbCat = 'pared';
function openWorkbench() {
  const P = G.P, list = BK_KEYS.filter(k => BK[k].cat === wbCat);
  openModal(`<h2>${iconHTML(['hammer'], 22)} Mesa de trabajo</h2><p class="hint">Fabrica bloques y muebles. Luego pulsa el <b>martillo</b> cerca de un pueblo o en tu casa y arrástralos con el dedo para colocarlos. Tienes ${logCount()} troncos · ${countItem('piedra')} piedra · ${fmt(P.gold)} oro.</p>
    <div class="chips">${BK_CAT.map(([k, n]) => `<button class="chip ${wbCat === k ? 'on' : ''}" data-wbc="${k}">${n}</button>`).join('')}</div>
    <div class="slist">${list.map(k => { const b = BK[k]; return `<div class="srow"><span class="ic">${iconHTML(['bk', k], 28)}</span><div class="sn"><b>${esc(b.n)}</b><small>${bkCostTxt(b)} · ${b.tool === 'mineria' ? 'pico' : 'hacha'} ${b.tier || 1}+ para quitarlo · tienes ${bkCount(k)}</small></div><button class="btn sm" data-wb="${k}" data-n="1" ${bkCanCraft(b, 1) ? '' : 'disabled'}>×1</button><button class="btn sm" data-wb="${k}" data-n="10" ${bkCanCraft(b, 10) ? '' : 'disabled'}>×10</button></div>`; }).join('')}</div>
    <div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('#modal [data-wbc]').forEach(b => b.onclick = () => { wbCat = b.dataset.wbc; openWorkbench(); });
  $$('#modal [data-wb]').forEach(b => b.onclick = () => { bkCraft(b.dataset.wb, +b.dataset.n); openWorkbench(); });
}
FURN_ACT.workbench = ['Mesa de trabajo', 'hammer', () => openWorkbench()];
// una mesa de trabajo en cada pueblo, junto a la plaza
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); for (const t of TOWNS) { const f = W.objs.find(o => (o.k === 'fountain' || o.k === 'well') && o.tx >= t.x0 && o.tx <= t.x1 && o.ty >= t.y0 && o.ty <= t.y1), w = WAYSTONES.find(x => x.k === t.k); const [px, py] = f ? [f.tx, f.ty + 3] : w ? [w.x, w.y + 4] : [(t.x0 + t.x1) >> 1, (t.y0 + t.y1) >> 1]; const [x, y] = freeTileNear(W, px - 4, py + 3); addObj(W, 'furn', x, y, { f: 'workbench', fp: [[0, 0], [1, 0]], townWB: 1 }); } }; }
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.isWorld && !P.dead) { const tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16); for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const i = tileAt(M, tx + dx, ty + dy); if (i < 0) continue; const oi = M.objAt[i]; if (oi < 0) continue; const o = M.objs[oi]; if (o.k === 'furn' && o.f === 'workbench' && !o.hidden && dist2(o.px, o.py - 4, P.x, P.y) < 30 * 30) return { kind: 'wbench', o, label: 'Mesa de trabajo', icon: 'hammer' }; } }
  const r = _it(); if (r && r.o && r.o.bremote && r.kind === 'plot') return null; return r; }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(); if (t && t.kind === 'wbench') { openWorkbench(); return; } return _di(); }; }
// piedra al minar
{ const _gi = giveItem; giveItem = function (id, n, quiet) { const r = _gi.apply(this, arguments); if (/^ore\d+$/.test(id) && G.P && G.P.job && G.P.job.kind === 'mineria' && Math.random() < 0.6) _gi('piedra', 1, true); return r; }; }
// ---------- iconos ----------
function pixFromCanvas(c, S) { const s = Math.min(1, S / Math.max(c.width, c.height)), w = Math.max(1, Math.round(c.width * s)), h = Math.max(1, Math.round(c.height * s)), t = mkCanvas(w, h), x = t.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(c, 0, 0, w, h); const d = x.getImageData(0, 0, w, h).data, p = new Pix(16, 16), ox = (16 - w) >> 1, oy = (16 - h) >> 1; for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { const k = (yy * w + xx) * 4; if (d[k + 3] > 100) p.set(ox + xx, oy + yy, rgbU(d[k], d[k + 1], d[k + 2])); } return p; }
{ const _gi = genIcon; genIcon = function (spec) {
  if (spec[0] === 'hammer') { const p = new Pix(16, 16); p.line(3, 13, 10, 6, WOOD[3]); p.line(4, 13, 11, 6, WOOD[2]); p.rect(8, 1, 7, 5, IRON[2]); p.hl(8, 1, 7, IRON[3]); p.rect(6, 2, 2, 3, IRON[1]); p.outline(OUTL); return p; }
  if (spec[0] !== 'bk') return _gi(spec); const k = spec[1], b = BK[k]; if (!b) return new Pix(16, 16);
  if (b.L === 0) { const p = new Pix(16, 16), c = floorSpr(k, 0), x = c.getContext('2d').getImageData(0, 0, 16, 16).data; for (let y = 2; y < 14; y++) for (let xx = 2; xx < 14; xx++) { const q = (y * 16 + xx) * 4; p.set(xx, y, rgbU(x[q], x[q + 1], x[q + 2])); } p.outline(OUTL); return p; }
  if (b.wall) return pixFromCanvas(genBWall(b.wall, 0, b.door ? 'door' : b.win ? 'win' : '').c, 15);
  if (b.fence) return pixFromCanvas(genBFence(b.fence, 10).c, 15);
  if (b.plot) return pixFromCanvas(genPlot(2, 'trigo').c, 15);
  const s = objSprite({ k: 'furn', f: b.f, tx: 0, ty: 0 }); return pixFromCanvas(s.c, 16); }; }
UI_ICONS.push('hammer');
// ---------- interfaz: martillo y barra de construcción ----------
function bldHere() { const P = G.P, M = G.map; if (!P || !M || P.dead || P.ghost) return false; return bldZone(M, Math.floor(P.x / 16), Math.floor(P.y / 16)); }
function bldMount() {
  const acts = $('#acts'); if (!acts || $('#bBld')) return;
  const b = document.createElement('button'); b.className = 'rb'; b.id = 'bBld'; b.hidden = true; b.title = 'Construir'; b.setAttribute('aria-label', 'Construir'); acts.appendChild(b);
  b.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); bldToggle(); });
  const bar = document.createElement('div'); bar.id = 'bldBar'; bar.hidden = true; document.body.appendChild(bar);
  const cv = $('#game');
  const tileOf = e => { const R = cv.getBoundingClientRect(), wx = (e.clientX - R.left) / R.width * VW + G.cam.x, wy = (e.clientY - R.top) / R.height * VH + G.cam.y; return [Math.floor(wx / 16), Math.floor(wy / 16)]; };
  cv.addEventListener('pointerdown', e => { if (!BLD.on || !G.P) return; e.preventDefault(); const [x, y] = tileOf(e); const M = G.map, P = G.P;
    if (Math.hypot(x * 16 + 8 - P.x, y * 16 + 8 - P.y) > (M.bnew ? 400 : 150)) { toast('Acércate más para construir ahí', 'warn'); return; }
    try { cv.setPointerCapture(e.pointerId); } catch (er) { }
    if (BLD.mode === 'remove') { bldRemoveAt(x, y); return; }
    if (BLD.mode === 'move') { const i = tileAt(M, x, y), o = i >= 0 && M.objAt[i] >= 0 ? M.objs[M.objAt[i]] : null; if (o && o.bk && o.bmine && !o.bsys) { BLD.drag = { o, x: o.tx, y: o.ty, dx: x - o.tx, dy: y - o.ty }; } else if (o && o.bremote) toast('Esto es de otro jugador', 'warn'); return; }
    if (BLD.mode === 'place' && BLD.sel) BLD.drag = { place: BLD.sel, x, y }; });
  cv.addEventListener('pointermove', e => { if (!BLD.on || !BLD.drag) return; const [x, y] = tileOf(e); if (BLD.drag.o) { BLD.drag.x = x - BLD.drag.dx; BLD.drag.y = y - BLD.drag.dy; } else { BLD.drag.x = x; BLD.drag.y = y; } });
  const up = () => { const d = BLD.drag; BLD.drag = null; if (!d) return; if (d.o) bldMove(d.o, d.x, d.y); else if (d.place) bldPlace(d.place, d.x, d.y); bldBarRender(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', () => { BLD.drag = null; });
}
function bldToggle(force) { BLD.on = force !== undefined ? force : !BLD.on; BLD.drag = null; const bar = $('#bldBar'); if (bar) bar.hidden = !BLD.on; if (BLD.on) { sfx('ui'); bldBarRender(); toast('Modo construcción: arrastra con el dedo para colocar o mover', 'info'); } document.body.classList.toggle('building', BLD.on); }
function bldBarRender() {
  const bar = $('#bldBar'); if (!bar || !BLD.on) return; const P = G.P;
  const items = P.inv.filter(s => ITEMS[s.id] && ITEMS[s.id].bk).map(s => [ITEMS[s.id].bk, s.q]);
  if (BLD.sel && !items.some(([k]) => k === BLD.sel)) BLD.sel = null;
  bar.innerHTML = `<button class="bbm ${BLD.mode === 'move' ? 'on' : ''}" data-bm="move">${iconHTML(['house'], 18)}<span>Mover</span></button><button class="bbm ${BLD.mode === 'remove' ? 'on' : ''}" data-bm="remove">${iconHTML(['pick', 2], 18)}<span>Quitar</span></button><div class="bbits">${items.length ? items.map(([k, q]) => `<button class="bbi ${BLD.mode === 'place' && BLD.sel === k ? 'on' : ''}" data-bs="${k}" title="${esc(BK[k].n)}">${iconHTML(['bk', k], 24)}<em>${q}</em></button>`).join('') : `<small>Fabrica bloques en una mesa de trabajo</small>`}</div><button class="bbm" data-bm="close">✕</button>`;
  $$('[data-bm]', bar).forEach(b => b.onclick = () => { const m = b.dataset.bm; if (m === 'close') { bldToggle(false); return; } BLD.mode = m; bldBarRender(); });
  $$('[data-bs]', bar).forEach(b => b.onclick = () => { BLD.mode = 'place'; BLD.sel = b.dataset.bs; bldBarRender(); });
}
// fantasma del bloque mientras arrastras
{ const _r = render; render = function () { _r.apply(this, arguments); const d = BLD.drag, M = G.map; if (!BLD.on || !d || !M) return;
  const k = d.o ? d.o.bk : d.place, b = BK[k]; if (!b) return; const ok = bldCanPlace(M, k, d.x, d.y, d.o), cx = Math.round(G.cam.x), cy = Math.round(G.cam.y);
  ctx.globalAlpha = 0.65; let s;
  if (b.L === 0) { ctx.drawImage(floorSpr(k, 0), d.x * 16 - cx, d.y * 16 - cy); }
  else { s = b.wall ? genBWall(b.wall, 0, b.door ? 'door' : b.win ? 'win' : '') : b.fence ? genBFence(b.fence, 10) : b.plot ? genPlot(0) : objSprite({ k: 'furn', f: b.f, tx: d.x, ty: d.y }); ctx.drawImage(s.c, d.x * 16 + 8 - s.ax - cx, d.y * 16 + 14 - s.ay - cy); }
  ctx.globalAlpha = 1; ctx.strokeStyle = ok ? 'rgba(90,255,120,0.9)' : 'rgba(255,70,70,0.9)'; ctx.lineWidth = 1;
  for (const [dx, dy] of b.fp || [[0, 0]]) ctx.strokeRect(d.x * 16 + dx * 16 - cx + 0.5, d.y * 16 + dy * 16 - cy + 0.5, 15, 15); }; }
// ---------- multijugador: mando mis construcciones del mundo poco a poco ----------
let bldPresN = 0, bldPresI = 0;
function bldWorldList() { if (!BLD.worldList) BLD.worldList = [...bldMine().values()].filter(r => r.m === 'world').map(r => [r.x, r.y, r.L, r.k === 'clr' ? -1 : BK_KEYS.indexOf(r.k)]); return BLD.worldList; }
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); const P = G.P; if (!P || P.map !== 'world') return; const L = bldWorldList(); if (!L.length) return; if (++bldPresN % 2) return;
  if (bldPresI >= L.length) bldPresI = 0; const n = 40, part = L.slice(bldPresI, bldPresI + n); o.bd = [BLD.ver, L.length, bldPresI, part]; bldPresI += n; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); const bd = pr.bd; if (!Array.isArray(bd) || !r.id) return;
  const [ver, total, start, part] = bd; if (!Array.isArray(part) || !(total >= 0 && total <= 1500) || !(start >= 0)) return;
  let st = BLD.rem.get(r.id); if (!st) { st = { id: r.id, ver: -1, total: 0, got: new Map(), act: new Map() }; BLD.rem.set(r.id, st); }
  if (st.ver !== ver) { st.ver = ver; st.total = total; st.got = new Map(); }
  part.slice(0, 60).forEach((q, j) => { if (!Array.isArray(q)) return; const x = q[0] | 0, y = q[1] | 0, L = q[2] | 0, ki = q[3] | 0; const k = ki === -1 ? 'clr' : BK_KEYS[ki]; if (!k || L < 0 || L > 2 || (k !== 'clr' && BK[k].sys)) return;
    const rec = { m: 'world', x, y, L, k }; st.got.set(start + j, rec); const key = bkey('world', x, y, L); if (!st.act.has(key)) { st.act.set(key, rec); BLD.dirty = true; } });
  if (st.got.size >= st.total) { const nw = new Map(); for (const rec of st.got.values()) nw.set(bkey('world', rec.x, rec.y, rec.L), rec); if (nw.size !== st.act.size || [...nw.keys()].some(k => !st.act.has(k))) { st.act = nw; BLD.dirty = true; } st.got = new Map(); } }; }
// ---------- tick ----------
let bldT = 0, bldLastMap = null;
function bldTick(dt) {
  const P = G.P, M = G.map; if (!P || !M) return; bldMine();
  if (M !== bldLastMap) { bldLastMap = M; BLD.dirty = true; if (BLD.on && !bldHere()) bldToggle(false); }
  bldT += dt; if (bldT > 1) { bldT = 0; for (const id of [...BLD.rem.keys()]) if (![...G.remote.values()].some(r => r.id === id)) { BLD.rem.delete(id); BLD.dirty = true; } }
  if (BLD.dirty) { BLD.dirty = false; bldApply(M); }
  bldHookMap(M);
  const b = $('#bBld'); if (b) { const here = bldHere(); if (b.hidden === here) b.hidden = !here; if (!b.dataset.ic && ICON.keys.hammer !== undefined) { b.innerHTML = iconHTML(['hammer'], 24); b.dataset.ic = 1; } if (!here && BLD.on) bldToggle(false); }
}
V33_TICKS.push(bldTick);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bldMount); else bldMount();
