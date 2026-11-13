// ================= LAND PLOTS, BUILDING YOUR OWN HOUSE (cabin, two floors, mansion), GARDENS & FAMILY STROLLS =================
SAVEKEYS.push('plots');
const HMODELS = {
  cabana: { n: 'Cabaña de madera', d: 'Una planta, acogedora. Jardín con flores.', w: 6, h: 4, price: 20000, logs: 20, style: 'albor', roof: 'brown', floors: 1, lv: 1 },
  dospisos: { n: 'Casa de dos pisos', d: 'Planta baja y dormitorios arriba para toda la familia. Jardín con huerto.', w: 7, h: 5, price: 70000, logs: 40, style: 'puerto', roof: 'blue', floors: 2, lv: 1, wallH: 62 },
  mansion: { n: 'Mansión', d: 'Dos plantas enormes, gran jardín, fuente y estatuas.', w: 9, h: 6, price: 220000, logs: 80, style: 'arxar', roof: 'red', floors: 2, lv: 2, wallH: 66 },
};
const PLOT_TOWNS = ['albor', 'puerto', 'arxar', 'sahrim'];
function findPlots(W) { const out = [], R = new RNG(SEED + 4242);
  for (const tk of PLOT_TOWNS) { const t = TOWNS.find(t => t.k === tk); if (!t) continue; let n = 0;
    for (let tries = 0; tries < 900 && n < 2; tries++) { const x0 = R.int(t.x0 - 12, t.x1 + 2), y0 = R.int(t.y0 - 10, t.y1 + 2); let ok = true; const L = W.inb(x0, y0) ? W.lvl[W.I(x0, y0)] : -1;
      for (let y = y0 - 1; y <= y0 + 8 && ok; y++) for (let x = x0 - 1; x <= x0 + 10 && ok; x++) { if (!W.inb(x, y)) { ok = false; break; } const i = W.I(x, y), te = W.ter[i]; if (W.objAt[i] >= 0 || W.lvl[i] !== L || SOLID_T[te] || te === T.STAIRS || te === T.BRIDGE || te === T.FARM || W.flags[i] & 32) ok = false; }
      if (!ok || out.some(p => Math.abs(p.x - x0) < 13 && Math.abs(p.y - y0) < 11) || (W.doors || []).some(d => d.x >= x0 - 2 && d.x <= x0 + 11 && d.y >= y0 - 2 && d.y <= y0 + 10)) continue;
      out.push({ id: 'lote_' + tk + '_' + n, town: tk, x: x0, y: y0, L }); n++; } }
  return out; }
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); W.plots = findPlots(W); for (const p of W.plots) for (let y = p.y; y < p.y + 8; y++) for (let x = p.x; x < p.x + 10; x++) W.flags[W.I(x, y)] |= 32; }; }
EXTRA_SPR.plotsign = () => spr('plotsign', () => { const p = new Pix(26, 26); p.rect(11, 12, 3, 14, WOOD[2]); p.rect(1, 2, 24, 12, WOOD[3]); p.rect(2, 3, 22, 10, C('#f0e2b8')); p.rect(5, 6, 16, 2, C('#c82a2a')); p.rect(5, 9, 10, 1, C('#5a4a3a')); return { c: p.canvas(), ax: 13, ay: 25 }; });
EXTRA_SPR.fencepost = o => spr('fpost' + (o.v || 0), () => { const p = new Pix(16, 14); p.rect(1, 2, 3, 12, WOOD[3]); p.rect(12, 2, 3, 12, WOOD[3]); p.rect(0, 5, 16, 2, WOOD[2]); p.rect(0, 10, 16, 2, WOOD[2]); return { c: p.canvas(), ax: 8, ay: 13 }; });
EXTRA_SPR.hedge = () => spr('hedge', () => { const p = new Pix(18, 14); p.ball(9, 8, 8, 6, pal(['#1a4a1a', '#2a6a2a', '#3a8a3a', '#6ab05a'])); for (let k = 0; k < 4; k++) p.set(4 + k * 3, 6 + (k % 2), C(FLOWC[k % 6])); return { c: p.canvas(), ax: 9, ay: 13 }; });
EXTRA_SPR.gfountain = () => spr('gfount', () => { const p = new Pix(30, 26); p.ball(15, 18, 13, 7, pal(['#5a5a64', '#7a7a86', '#9a9aa8', '#c8c8d4'])); p.ball(15, 17, 10, 5, pal(['#1a4a8a', '#2a6ac0', '#4a9ae0', '#8ad0ff'])); p.rect(13, 4, 4, 13, C('#9a9aa8')); p.ball(15, 4, 4, 2, pal(['#7a7a86', '#9a9aa8', '#c8c8d4', '#ffffff'])); return { c: p.canvas(), ax: 15, ay: 25 }; });
const PLOT_D = [];
function plotOwned(id) { const P = G.P; return P && P.plots && P.plots[id]; }
function buildPlotHouse(p, model) { const W = G.world, H = HMODELS[model]; if (!W || W.objs.some(o => o.plotOf === p.id)) return;
  const bx = p.x + Math.floor((10 - H.w) / 2), by = p.y + 1; const spec = { style: H.style, roof: H.roof, chimney: true, big: H.w >= 7, wallH: H.wallH, floors: H.floors, v: 3 };
  const o = addBuilding(W, bx, by, H.w, H.h, spec, p.id); o.plotOf = p.id;
  HOUSES[p.id] = { n: H.n + ' (' + townName(p.town) + ')', town: townName(p.town), price: 0, plot: 1, floors: H.floors };
  if (H.floors === 2) HOUSES[p.id + '_2'] = { n: H.n + ' · planta alta', town: townName(p.town), price: 0, plot: 1, upper: p.id };
  // garden
  const add = (k, x, y, pr) => { const e = Object.assign({ type: 'deco', k2: k, map: 'world', x: x * 16 + 8, y: y * 16 + 12, v: 0, plotDeco: p.id }, pr || {}); G.ents.push(e); PLOT_D.push(e); };
  for (let x = p.x; x < p.x + 10; x++) { if (x === bx + (H.w >> 1)) continue; add('fencepost', x, p.y + 7); }
  add('hedge', p.x, p.y + 6); add('hedge', p.x + 9, p.y + 6); add('flowerpot', p.x + 1, p.y + 6, { v: 1 }); add('flowerpot', p.x + 8, p.y + 6, { v: 2 });
  if (model !== 'cabana') { add('flowerpot', p.x, p.y + 3, { v: 3 }); add('hedge', p.x + 9, p.y + 3); }
  if (model === 'mansion') { add('gfountain', p.x + 2, p.y + 7.5); add('herostatue', p.x + 8, p.y + 7.4); }
  for (const e of G.ents) if (e.plotSign === p.id) e.remove = true; }
function plotTick() { const W = G.world, P = G.P; if (!W || !W.plots || !P) return; if (!W.plotsInit) { W.plotsInit = 1; for (const p of W.plots) { const m = plotOwned(p.id); if (m) buildPlotHouse(p, m); else { G.ents.push({ type: 'deco', k2: 'plotsign', map: 'world', x: (p.x + 5) * 16 + 8, y: (p.y + 7) * 16 + 12, plotSign: p.id, v: 0 }); } } } }
{ const _it = interactTarget; interactTarget = function () { const P = G.P; if (G.map && G.map.isWorld && !P.dead) for (const e of G.ents) if (e.plotSign && !e.remove && dist2(e.x, e.y, P.x, P.y) < 34 * 34) return { kind: 'plotsale', e, label: 'Terreno en venta', icon: 'talk' }; return _it(); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(); if (t && t.kind === 'plotsale') { openPlot(G.world.plots.find(p => p.id === t.e.plotSign)); return; } return _di(); }; }
function openPlot(p) { const P = G.P; openModal(`<h2>${iconHTML(['house'], 22)} Terreno en ${esc(townName(p.town))}</h2><p class="hint">Compra el terreno y elige qué casa construir. Necesitas oro y troncos para la obra. Tu pareja, tus hijos y tu mascota vivirán allí, y durante el día saldrán a pasear por el pueblo.</p><div class="slist">${Object.keys(HMODELS).map(k => { const H = HMODELS[k]; return `<div class="srow">${iconHTML(['house'], 26)}<div class="sn"><b>${esc(H.n)}</b><small>${esc(H.d)} · ${H.floors} planta${H.floors > 1 ? 's' : ''} · ${H.logs} troncos</small></div><button class="btn sm gold" data-hm="${k}">${iconHTML(['coin'], 12)} ${fmt(H.price)}</button></div>`; }).join('')}</div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('#modal [data-hm]').forEach(b => b.onclick = () => { const k = b.dataset.hm, H = HMODELS[k]; if (P.gold < H.price) { toast('No tienes suficiente oro', 'warn'); return; } if (logCount() < H.logs) { toast('Te faltan troncos para la obra (' + logCount() + '/' + H.logs + ')', 'warn'); return; } P.gold -= H.price; takeLogs(H.logs); P.plots = P.plots || {}; P.plots[p.id] = k; P.homes = P.homes || {}; P.homes[p.id] = { floor: 0, lv: H.lv, f: { bed: 'bigbed', table: 'table', deco1: 'plant', fire: 'fireplace' } }; if (H.floors === 2) P.homes[p.id + '_2'] = { floor: 1, lv: H.lv, f: { bed: 'bed', deco1: 'plant', rug: 'rugb' } }; closeModal();
    transition(() => { buildPlotHouse(p, k); for (let i = 0; i < 6; i++) setTimeout(() => burst((p.x + 5) * 16, (p.y + 4) * 16, 20, { sp: 70, up: 60, g: 80, life: 1, c: ['#c8a070', '#ffffff', '#ffd040'] }), i * 150); banner('¡Casa construida!', H.n + ' en ' + townName(p.town)); sfx('level'); markDirty(true); }); }); }
// two-floor interiors: stairs between the floors; the upper floor has no front door
{ const _mh = makeHome; makeHome = function (id) { const M = _mh(id), H = HOUSES[id]; if (!M || !H) return M;
  if (H.floors === 2) { addObj(M, 'furn', M.w - 3, 3, { f: 'ystair_up', fp: [[0, 0], [-1, 0]], stair: id + '_2' }); }
  if (H.upper) { M.ter[M.exit.y * M.w + M.exit.x] = T.IWALL; M.exit = { x: -9, y: -9 }; addObj(M, 'furn', M.w - 3, 3, { f: 'ystair_down', fp: [[0, 0], [-1, 0]], stair: H.upper }); M.upperOf = H.upper; }
  return M; }; }
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.home && !P.dead) for (const o of M.objs) if (o.stair && typeof o.stair === 'string' && dist2(o.px, o.py - 4, P.x, P.y) < 30 * 30) return { kind: 'hstair', o, label: M.upperOf ? 'Bajar' : 'Subir', icon: 'run' }; return _it(); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(); if (t && t.kind === 'hstair') { const to = t.o.stair, P = G.P; transition(() => { const M2 = makeHome(to); G.maps[to] = M2; P.inside = to; setMap(M2, (M2.w - 3) * 16 + 8, 4 * 16 + 10, 'down'); }); return; } return _di(); }; }
// two-floor exteriors: an extra row of windows
{ const _gb = genBuilding; genBuilding = function (spec) { const r = _gb(spec); if (spec.floors === 2 && r && r.c) { const x = r.c.getContext('2d'), W = spec.w * 16, OV = 4, H = r.c.height, wy = H - (spec.wallH || 34) + 8, n = Math.max(2, Math.round(W / 26)); for (let k = 0; k < n; k++) { const wx = OV + Math.round((k + 0.5) * W / n) - 6; x.fillStyle = '#3a2a1a'; x.fillRect(wx - 1, wy - 1, 14, 14); x.fillStyle = '#ffd890'; x.fillRect(wx, wy, 12, 12); x.fillStyle = '#7ab0d8'; x.fillRect(wx + 1, wy + 1, 10, 10); x.fillStyle = '#3a2a1a'; x.fillRect(wx + 5, wy, 2, 12); x.fillRect(wx, wy + 5, 12, 2); x.fillStyle = '#a03a3a'; x.fillRect(wx - 2, wy + 12, 16, 3); for (let f = 0; f < 4; f++) { x.fillStyle = FLOWC[(k + f) % 6]; x.fillRect(wx + f * 3 + 1, wy + 10, 2, 2); } } x.fillStyle = 'rgba(0,0,0,0.22)'; x.fillRect(OV, wy + 18, W, 2); } return r; }; }
// ---------- the family lives its own life: strolls in town by day, home at night ----------
const FAM_W = [];
function famHomeTown() { const P = G.P; for (const id of Object.keys(P.homes || {})) { const tk = HOUSES[id] && HOUSES[id].plot ? id.split('_')[1] : townOfInterior(id); if (tk && TOWNS.find(t => t.k === tk)) return tk; } return null; }
let _famT = 0; function familyTick(dt) { _famT += dt; if (_famT < 2) return; _famT = 0; const P = G.P; if (!P || P.ghost || !G.map) return; plotTick();
  const h = hourNow(), day = h >= 8 && h < 18, tk = famHomeTown(), t = tk && TOWNS.find(t => t.k === tk); const near = t && G.map.isWorld && P.x / 16 > t.x0 - 12 && P.x / 16 < t.x1 + 12 && P.y / 16 > t.y0 - 12 && P.y / 16 < t.y1 + 12;
  if (!(day && near)) { if (FAM_W.length) { for (const e of FAM_W) e.remove = true; FAM_W.length = 0; } return; }
  if (FAM_W.length) { if (Math.random() < 0.08) { const e = pick(FAM_W); e.chat = pick(['¡Qué buen día para pasear!', '¡Hola, cariño!', 'Volveré a casa al anochecer.', '¡Mira, el mercado!', '¿Comemos juntos luego?']); e.chatT = G.t - 2; } return; }
  const [px, py] = townPlaza(tk), X = px * 16 + 8, Y = py * 16 + 40, compId = COMP && COMP.e ? COMP.e.id : null;
  if (P.partner && NPCS[P.partner] && relKey(compId || '') !== P.partner) { const e = spawnNPC(P.partner, X + 30, Y, 'world', { wander: 6, L: t.lvl }); if (e) { e.famWalk = 1; FAM_W.push(e); } }
  for (const k of P.kids || []) { if (k.follow || kidStage(k) === 0) continue; const e = kidEnt(k, 'world', X - 20 + Math.random() * 40, Y + 16); e.famWalk = 1; FAM_W.push(e); } }
DLG_HOOKS.push((npc, opts) => { if (!npc.famWalk) return; opts.unshift({ label: 'Volvamos juntos a casa', icon: ['house'], fn: () => { typeText('¡Vale! Te espero allí ♥'); npc.goal = { x: npc.x + 120, y: npc.y + 80, then: 'vanish' }; } }); });
