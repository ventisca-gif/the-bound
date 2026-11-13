// ================= v3.7: LA CASA DEL JUGADOR, NUEVA =================
// Solo las casas que son tuyas cambian: jardín con huerto y valla, paredes con profundidad, salón, dormitorio, cocina,
// cuarto de los niños y una planta alta con escalera. Todo lo de dentro son muebles de construcción: se arrastran con el dedo.
// Los huecos de "Decorar" siguen funcionando (la cama, la cuna, el armario…) y se colocan en su cuarto.
Object.assign(BW_TOP, { rosa: BW_TOP.wood, crema: BW_TOP.wood, azul: BW_TOP.wood, verde: BW_TOP.wood });
Object.assign(BW_FACE, { rosa: ['#b86a86', '#d888a4', '#f2b8cc', '#ffd8e6'], crema: ['#b8a070', '#d4be8a', '#f0e2b8', '#fff4d8'], azul: ['#1e3468', '#2a4686', '#3a5aa0', '#6a8ad0'], verde: ['#3a6a2e', '#4a8a3c', '#6aa05a', '#9ac88a'] });
const HMAT = ['wood', 'rosa', 'crema', 'ebony', 'azul', 'verde'];
for (const m of ['wood', 'stone', 'brick', 'ebony', 'crystal', 'rosa', 'crema', 'azul', 'verde']) {
  BK['hw_' + m] = { n: 'Pared', wall: m, sys: 1, cat: 'x', L: 1 }; BK['hwin_' + m] = { n: 'Ventana', wall: m, win: 1, sys: 1, cat: 'x', L: 1 }; BK['hdoor_' + m] = { n: 'Puerta', wall: m, door: 1, sys: 1, cat: 'x', L: 1 };
  BK_KEYS.push('hw_' + m, 'hwin_' + m, 'hdoor_' + m);
}
Object.assign(BK, { hfence: { n: 'Valla', fence: 'wood', sys: 1, cat: 'x', L: 1 }, hcounter: { n: 'Encimera', f: 'counter', fp: [[-2, 0], [-1, 0], [0, 0], [1, 0]], sys: 1, cat: 'x', L: 1 }, hcauldron: { n: 'Olla', f: 'cauldron', sys: 1, cat: 'x', L: 1 }, hpotshelf: { n: 'Alacena', f: 'potshelf', fp: [[0, 0], [1, 0]], sys: 1, cat: 'x', L: 1 }, hchest: { n: 'Baúl', f: 'chest', sys: 1, cat: 'x', L: 1 }, hdesk: { n: 'Escritorio', f: 'desk', sys: 1, cat: 'x', L: 1 }, hchair: { n: 'Silla', f: 'chair', sys: 1, cat: 'x', L: 1 }, htable: { n: 'Mesa', f: 'table', fp: [[0, 0], [1, 0]], sys: 1, cat: 'x', L: 1 }, hbarrels: { n: 'Barriles', f: 'barrels', sys: 1, cat: 'x', L: 1 } });
BK_KEYS.push('hfence', 'hcounter', 'hcauldron', 'hpotshelf', 'hchest', 'hdesk', 'hchair', 'htable', 'hbarrels');
// dónde va cada hueco de "Decorar" en la casa nueva
const HPOS = { bed: [6, 4], ward: [10, 4], mirror: [11, 5], deco3: [8, 4], crib: [9, 7], rug: [6, 8], fire: [19, 4], paint: [15, 4], table: [16, 6], deco1: [13, 8], deco2: [24, 8], kid1: [20, 11], kid2: [24, 12], deco4: [21, 14], deco5: [17, 14], rug2: [22, 12], paint2: [23, 10] };
const HW = 30, HH = 22, HX0 = 4, HX1 = 25, HY0 = 3, HY1 = 15;
function homeUpId(id) { return HOUSES[id + '_2'] ? id + '_2' : id + '_up'; }
function homeBaseOf(id) { if (!id) return null; if (/_up$/.test(id)) return id.slice(0, -3); const H = HOUSES[id]; return H && H.upper ? H.upper : id; }
function isUpper(id) { return !!id && homeBaseOf(id) !== id; }
{ const _ih = isHome; isHome = function (id) { if (isUpper(id)) return _ih(homeBaseOf(id)); return _ih(id); }; }
function hSlotsFor(cfg) { return cfg.lv >= 2 ? HSLOTS.concat(HSLOTS2) : HSLOTS; }
function hSlotCat(k) { return SLOT_CAT[k] || k; }
// mapa nuevo: planta baja (jardín + casa) o planta alta
function newHomeMap(id, upper) {
  const base = homeBaseOf(id), cfg = homeCfg(base), w = HW, h = HH, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(upper ? T.VOID : T.GRASS), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: upper ? 0.08 : 0.03, music: 'town', I, home: 1, bnew: 1, homeBase: base, inMask: new Uint8Array(N) };
  const fl = FLOORS[cfg.floor || 0] || FLOORS[0], liv = T[fl[1]] !== undefined ? T[fl[1]] : T.FLOOR, mat = HMAT[cfg.wall || 0] || 'wood';
  const fill = (x0, y0, x1, y1, t, m) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { M.ter[I(x, y)] = t; if (m) M.inMask[I(x, y)] = 1; } };
  const fixed = new Map(), add = (k, x, y, L) => fixed.set(bkey(id, x, y, L === undefined ? 1 : L), { m: id, x, y, L: L === undefined ? 1 : L, k, sys: 1 });
  fill(HX0, HY0, HX1, HY1, T.PLANK);
  if (!upper) {
    // jardín
    for (let y = HY1 + 1; y < h; y++) M.ter[I(14, y)] = T.DIRT; M.ter[I(13, h - 1)] = T.DIRT; M.ter[I(15, h - 1)] = T.DIRT;
    for (let x = 0; x < w; x++) { if (x < 13 || x > 15) add('hfence', x, h - 1); add('bhedge', x, 0); } for (let y = 1; y < h - 1; y++) { add('bhedge', 0, y); add('bhedge', w - 1, y); }
    for (const x of [5, 6, 7, 8, 9, 10, 18, 19, 20, 21, 22, 23]) add('hfence', x, 17);
    for (const [x, y] of [[2, 4], [2, 9], [2, 13], [27, 4], [27, 9], [27, 13], [2, 18], [27, 18], [12, 19], [16, 19]]) add(y === 18 || y === 19 ? 'flowers' : 'bhedge', x, y);
    // cuartos
    fill(13, 4, 24, 8, liv, 1); fill(13, 9, 18, 14, liv, 1); // salón
    fill(5, 4, 11, 9, T.CARPET); fill(5, 11, 11, 14, T.COBBLE); fill(20, 10, 24, 14, T.FLOOR);
    for (let x = HX0; x <= HX1; x++) { add('hw_' + mat, x, HY0); add([8, 11, 18, 22].includes(x) ? 'hwin_' + mat : x === 14 ? 'hdoor_' + mat : 'hw_' + mat, x, HY1); }
    for (let y = HY0 + 1; y < HY1; y++) { add('hw_' + mat, HX0, y); add('hw_' + mat, HX1, y); add(y === 7 || y === 12 ? 'hdoor_' + mat : 'hw_' + mat, 12, y); }
    for (let x = 5; x <= 11; x++) add('hw_' + mat, x, 10);
    for (let x = 19; x <= 24; x++) add(x === 22 ? 'hdoor_' + mat : 'hw_' + mat, x, 9); for (let y = 10; y <= 14; y++) add('hw_' + mat, 19, y);
    // cocina, baúl, escritorio de decorar y escalera
    add('hcounter', 7, 11); add('hcauldron', 10, 11); add('hpotshelf', 5, 13); add('htable', 8, 13); add('hchair', 7, 13); add('hchair', 10, 13); add('hbarrels', 11, 14);
    for (const x of [5, 6, 7, 8, 9, 10, 18, 19, 20, 21, 22, 23]) add('soil', x, 18);
    add('hchest', 13, 13); add('hdesk', 13, 11); add('stair_up', 24, 4);
    M.exit = { x: 14, y: h - 1 };
  } else {
    for (let x = HX0; x <= HX1; x++) { add('hw_' + mat, x, HY0); add([7, 10, 19, 22].includes(x) ? 'hwin_' + mat : 'hw_' + mat, x, HY1); }
    for (let y = HY0 + 1; y < HY1; y++) { add('hw_' + mat, HX0, y); add('hw_' + mat, HX1, y); add(y === 9 ? 'hdoor_' + mat : 'hw_' + mat, 15, y); }
    fill(5, 4, 14, 14, T.CARPET); fill(16, 4, 24, 14, liv, 1);
    add('stair_dn', 24, 4); M.exit = { x: -9, y: -9 }; M.upperOf = base;
  }
  M.fixed = fixed; M.hmat = mat; initMapObjs(M); return M;
}
// muebles de "Decorar" ↔ registros de construcción
function hRecsOf(base) { const up = homeUpId(base); return [...bldMine().values()].filter(r => r.m === base || r.m === up); }
function hOcc(M, extra) { const s = new Set(); const mark = r => { const b = BK[r.k]; if (!b || r.L !== 1) return; for (const [dx, dy] of b.fp || [[0, 0]]) s.add((r.x + dx) + ',' + (r.y + dy)); }; for (const r of M.fixed.values()) mark(r); for (const r of bldMine().values()) if (r.m === M.id && r !== extra) mark(r); return s; }
function hFits(M, k, x, y, occ) { const b = BK[k]; return (b.fp || [[0, 0]]).every(([dx, dy]) => { const xx = x + dx, yy = y + dy, i = tileAt(M, xx, yy); return i >= 0 && !SOLID_T[M.ter[i]] && !occ.has(xx + ',' + yy) && xx > HX0 && xx < HX1 && yy > HY0 && yy < HY1; }); }
function hFind(M, k, x0, y0, occ) { for (let r = 0; r < 14; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; if (hFits(M, k, x0 + dx, y0 + dy, occ)) return [x0 + dx, y0 + dy]; } return null; }
function homeSync(M) {
  const base = M.homeBase, cfg = homeCfg(base); if (!cfg) return; const P = G.P, slots = hSlotsFor(cfg), mine = hRecsOf(base); let ch = false;
  const slotNames = new Set(slots.map(s => s[0]));
  for (const r of mine) if (r.sl && r.sl !== 'gift' && !slotNames.has(r.sl) && !/^table_c/.test(r.sl)) { bldDel(r.m, r.x, r.y, r.L); ch = true; }
  for (const [k] of slots) {
    const want = cfg.f[k], cur = hRecsOf(base).find(r => r.sl === k);
    if (!want || !BK[want]) { if (cur) { bldDel(cur.m, cur.x, cur.y, cur.L); ch = true; } continue; }
    if (cur && cur.k === want) continue;
    if (cur) { bldDel(cur.m, cur.x, cur.y, cur.L); ch = true; }
    const adopt = hRecsOf(base).find(r => !r.sl && r.k === want); if (adopt) { adopt.sl = k; ch = true; continue; }
    if (M.upperOf) continue; const occ = hOcc(M), [px, py] = HPOS[k] || [16, 10], at = hFind(M, want, cur ? cur.x : px, cur ? cur.y : py, occ);
    if (at) { bldPut({ m: M.id, x: at[0], y: at[1], L: 1, k: want, sl: k }); ch = true; }
  }
  // sillas de la mesa
  homeChairs(M);
  // regalo de bienvenida en la planta alta
  P.homeV = P.homeV || {}; if (M.upperOf && !P.homeV[base]) { P.homeV[base] = 1; for (const [k, x, y] of [['bed', 6, 4], ['bed', 9, 4], ['plant', 5, 14], ['lamp', 12, 4], ['bookshelf', 17, 4], ['sofa', 19, 8], ['rugb', 20, 11], ['flowers', 23, 14]]) { const occ = hOcc(M); if (hFits(M, k, x, y, occ)) bldPut({ m: M.id, x, y, L: 1, k, sl: 'gift' }); } ch = true; }
  if (ch) bldSave();
}
function homeChairs(M) { if (!M || !M.fixed || M.upperOf) return; for (const [k, r] of [...M.fixed]) if (r.tc) M.fixed.delete(k);
  const t = hRecsOf(M.homeBase).find(r => r.sl === 'table' && r.k === 'table' && r.m === M.id); if (!t) return; const occ = hOcc(M);
  for (const dx of [-1, 2]) if (hFits(M, 'hchair', t.x + dx, t.y, occ)) M.fixed.set(bkey(M.id, t.x + dx, t.y, 1), { m: M.id, x: t.x + dx, y: t.y, L: 1, k: 'hchair', sys: 1, tc: 1 }); }
{ const _bm = bldMove; bldMove = function (o, x, y) { const r = _bm(o, x, y), M = G.map; if (r && M && M.bnew) { homeChairs(M); bldApply(M); } return r; }; }
{ const _br = bldRemoveAt; bldRemoveAt = function (x, y) { const r = _br(x, y), M = G.map; if (M && M.bnew) { homeChairs(M); bldApply(M); } return r; }; }
// cuando colocas un mueble de Decorar fabricado, ocupa su hueco (y ya lo tienes comprado)
function homeSlotAdopt(M, rec) {
  if (!M || !M.bnew) return; const base = M.homeBase, cfg = homeCfg(base), b = BK[rec.k]; if (!cfg || !b || !b.f || !FURN_CAT[b.f]) return;
  const cat = FURN_CAT[b.f].slot, slot = hSlotsFor(cfg).map(s => s[0]).find(s => hSlotCat(s) === cat && !cfg.f[s]); if (!slot) return;
  cfg.f[slot] = b.f; rec.sl = slot; const P = G.P; P.furn = P.furn || []; if (!P.furn.includes(b.f)) P.furn.push(b.f);
}
function homeSlotRemoved(M, rec) { if (!M || !M.bnew || !rec || !rec.sl) return; const cfg = homeCfg(M.homeBase); if (cfg && cfg.f[rec.sl]) delete cfg.f[rec.sl]; }
// el mapa nuevo sustituye al antiguo solo en las casas que son tuyas
function homePlaceEnts(M) {
  const P = G.P, free = (x, y) => { const i = tileAt(M, x, y); return i >= 0 && !SOLID_T[M.ter[i]] && M.objAt[i] < 0 && (M.inMask[i] || M.ter[i] === T.FLOOR || M.ter[i] === T.CARPET); };
  const near = (x0, y0) => { for (let r = 0; r < 10; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (free(x0 + dx, y0 + dy)) return [x0 + dx, y0 + dy]; return [x0, y0]; };
  let n = 0; for (const e of G.ents) { if (e.map !== M.id || e.remove || e.follow || (typeof COMP !== 'undefined' && COMP && COMP.e === e)) continue;
    const tgt = e.type === 'kid' ? [21 + (n++ % 3), 12] : e.type === 'hpet' ? [15, 11] : M.upperOf ? [20, 10] : [16, 9]; const [x, y] = near(tgt[0], tgt[1]);
    e.x = x * 16 + 8; e.y = y * 16 + 10; if (e.home) e.home = { x: e.x, y: e.y }; if (e.type === 'npc') e.wander = 3; }
}
{ const _mh = makeHome; makeHome = function (id) {
  const base = homeBaseOf(id), owned = base && homeCfg(base);
  if (!owned) return _mh(id);
  if (isUpper(id)) { const M = newHomeMap(id, true); G.ents = G.ents.filter(e => e.map !== id || e.follow); G.maps[id] = M; homeSync(M); bldApply(M); M.wdist = null; return M; }
  _mh(id); // familia, pareja y mascota se crean como siempre
  const M = newHomeMap(id, false); G.maps[id] = M; homeSync(M); bldApply(M); homePlaceEnts(M); M.wdist = null; return M; }; }
// escaleras
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.bnew && !P.dead) for (const o of M.objs) if (o.bstair !== undefined && o.bk && !o.hidden && dist2(o.px - 8, o.py, P.x, P.y) < 30 * 30) return { kind: 'bstair', o, label: o.bk === 'stair_dn' ? 'Bajar' : 'Subir', icon: 'run' }; return _it(); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(); if (t && t.kind === 'bstair') { const P = G.P, M = G.map, to = t.o.bk === 'stair_dn' ? M.upperOf : homeUpId(M.id); sfx('door'); transition(() => { const M2 = makeHome(to); P.inside = to; setMap(M2, 23 * 16 + 8, 5 * 16 + 10, 'down'); }); return; } return _di(); }; }
// en la planta alta no se decora (el escritorio está abajo)
{ const _d = FURN_ACT.desk[2]; FURN_ACT.desk[2] = () => { if (isUpper(G.P.inside)) { toast('El escritorio para decorar está en la planta baja', 'info'); return; } _d(); }; }
// suelos especiales de la boda en el salón
function homeFloorFx(M, cx, cy) { const cfg = homeCfg(M.homeBase); if (!cfg) return; const fl = FLOORS[cfg.floor || 0]; if (!fl || !fl[2]) return;
  const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(M.w - 1, Math.ceil((cx + VW) / 16)), y1 = Math.min(M.h - 1, Math.ceil((cy + VH) / 16));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (!M.inMask[M.I(x, y)]) continue; const sx = x * 16 - cx, sy = y * 16 - cy; ctx.globalAlpha = 0.85;
    if (fl[2] === 'marble') { ctx.fillStyle = (x + y) % 2 ? '#f4eef0' : '#e8d0dc'; ctx.fillRect(sx, sy, 16, 16); }
    else if (fl[2] === 'rose') { ctx.fillStyle = '#d8a0a8'; ctx.fillRect(sx, sy, 16, 16); ctx.fillStyle = '#c08890'; ctx.fillRect(sx, sy + (x % 2 ? 4 : 11), 16, 1); }
    else if (fl[2] === 'royal') { ctx.fillStyle = (x + y) % 2 ? '#2a3a7a' : '#d8b040'; ctx.fillRect(sx, sy, 16, 16); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(sx + 2, sy + 2, 4, 1); }
    ctx.globalAlpha = 1; } }
{ const _h = bldHookMap; bldHookMap = function (M) { if (M && M.bnew && !M._hfx) { M._hfx = 1; const prev = M.drawExtra; M.drawExtra = (cx, cy) => { if (prev) prev(cx, cy); homeFloorFx(M, cx, cy); }; } return _h(M); }; }
