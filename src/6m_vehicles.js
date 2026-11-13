// ================= WALKABLE VEHICLES: train carriages & the 4-deck yacht (shared map ids → synced in local multiplayer) =================
// ---------- furniture sprites ----------
const VFURN = {
  tseat: () => { const p = new Pix(14, 18), b = pal(['#1a2a4a', '#24406e', '#2e5a9a', '#4a7ac0']), f = pal(['#5a5a62', '#7a7a84', '#9a9aa4']); p.rect(1, 0, 12, 8, f[1]); p.rect(2, 1, 10, 6, b[2]); p.hl(2, 1, 10, b[3]); p.rect(1, 8, 12, 7, f[2]); p.rect(2, 8, 10, 5, b[1]); p.rect(0, 6, 2, 9, f[0]); p.rect(12, 6, 2, 9, f[0]); p.rect(2, 15, 2, 3, f[0]); p.rect(10, 15, 2, 3, f[0]); return { p, ax: 7, ay: 16 }; },
  tpanel: () => { const p = new Pix(30, 22), m = pal(['#1a1a20', '#2a2a32', '#3e3e48', '#5a5a66']); p.rect(0, 6, 30, 16, m[2]); p.hl(0, 6, 30, m[3]); p.rect(2, 0, 26, 8, m[1]); for (let k = 0; k < 5; k++) p.ball(5 + k * 5, 3, 1.5, 1.5, [m[0], C(['#ff4040', '#40ff60', '#ffd040', '#40c0ff', '#ff8a2a'][k]), C('#ffffff'), C('#ffffff')]); p.rect(12, 10, 6, 4, C('#2a4a2a')); p.vl(26, 9, 8, C('#c8c8d0')); p.ball(26, 9, 2, 2, [m[0], C('#c02020'), C('#ff5050'), C('#ffffff')]); return { p, ax: 15, ay: 21 }; },
  lounger: () => { const p = new Pix(14, 26); p.rect(2, 2, 10, 22, C('#e8e0d0')); for (let y = 3; y < 23; y += 3) p.hl(2, y, 10, C('#4a9ad8')); p.rect(2, 0, 10, 5, C('#ffffff')); p.rect(1, 23, 2, 3, WOOD[1]); p.rect(11, 23, 2, 3, WOOD[1]); return { p, ax: 7, ay: 24 }; },
  umbrella: () => { const p = new Pix(30, 36); p.vl(15, 10, 26, C('#e8e0d0')); for (let k = 0; k < 15; k++) { p.hl(15 - k, 4 + Math.round(k * 0.45), k * 2 + 1, C(k % 4 < 2 ? '#ff5a5a' : '#ffffff')); } return { p, ax: 15, ay: 34 }; },
  wheel: () => { const p = new Pix(20, 28); p.rect(8, 14, 4, 14, WOOD[1]); for (let a = 0; a < 8; a++) { const an = a * Math.PI / 4; p.line(10, 10, 10 + Math.cos(an) * 9, 10 + Math.sin(an) * 9, WOOD[4]); } p.ball(10, 10, 6, 6, [WOOD[1], WOOD[2], WOOD[3], WOOD[4]]); p.ball(10, 10, 1.6, 1.6, [GOLD[2], GOLD[3], GOLD[4], GOLD[5]]); return { p, ax: 10, ay: 27 }; },
  radar: () => { const p = new Pix(22, 22), m = pal(['#0a1a10', '#123a20', '#1a5a30', '#3aff7a']); p.rect(0, 4, 22, 18, C('#3a3a44')); p.ball(11, 12, 7, 7, [m[0], m[1], m[1], m[2]]); p.line(11, 12, 16, 8, m[3]); p.set(8, 14, m[3]); p.set(14, 15, m[3]); return { p, ax: 11, ay: 21 }; },
  telescope: () => { const p = new Pix(18, 26); p.line(9, 14, 3, 25, C('#3a3a44')); p.line(9, 14, 15, 25, C('#3a3a44')); p.line(9, 14, 9, 25, C('#3a3a44')); p.rect(2, 8, 14, 4, GOLD[3]); p.hl(2, 8, 14, GOLD[5]); p.rect(14, 7, 3, 6, GOLD[2]); return { p, ax: 9, ay: 25 }; },
  ystair_up: () => { const p = new Pix(32, 30); for (let k = 0; k < 6; k++) p.rect(2, 26 - k * 4, 28, 4, k % 2 ? WOOD[3] : WOOD[4]); p.rect(0, 0, 2, 30, GOLD[3]); p.rect(30, 0, 2, 30, GOLD[3]); p.poly([[16, 2], [22, 8], [10, 8]], C('#ffd040')); return { p, ax: 16, ay: 29 }; },
  ystair_down: () => { const p = new Pix(32, 30); p.rect(2, 4, 28, 24, C('#1a1210')); for (let k = 0; k < 5; k++) p.hl(4, 8 + k * 4, 24, WOOD[2 + (k % 2)]); p.rect(0, 0, 2, 30, GOLD[3]); p.rect(30, 0, 2, 30, GOLD[3]); p.poly([[16, 26], [22, 20], [10, 20]], C('#ffd040')); return { p, ax: 16, ay: 29 }; },
  bar: () => { const p = new Pix(64, 26); p.rect(0, 8, 64, 16, C('#3a1a10')); p.hl(0, 8, 64, C('#8a5a3a')); p.rect(0, 6, 64, 3, C('#c8a070')); for (let k = 0; k < 9; k++) { p.rect(4 + k * 7, 0, 3, 6, C(['#3a8a3a', '#8a2a2a', '#c8a030', '#5a3aa0'][k % 4])); p.set(5 + k * 7, 0, C('#ffffff')); } return { p, ax: 32, ay: 24 }; },
  piano: () => { const p = new Pix(36, 30); p.rect(0, 2, 36, 24, C('#0a0a0e')); p.hl(0, 2, 36, C('#3a3a44')); p.rect(2, 18, 32, 5, C('#f0f0f0')); for (let k = 0; k < 15; k++) if (k % 7 !== 2 && k % 7 !== 6) p.rect(3 + k * 2, 18, 1, 3, C('#0a0a0e')); p.rect(2, 26, 3, 4, C('#0a0a0e')); p.rect(31, 26, 3, 4, C('#0a0a0e')); return { p, ax: 18, ay: 29 }; },
  rail: () => { const p = new Pix(16, 14); p.hl(0, 2, 16, C('#e8e8f0')); p.hl(0, 3, 16, C('#9a9aa8')); for (const x of [1, 8, 15]) p.vl(x, 2, 11, C('#c8c8d4')); p.hl(0, 8, 16, C('#c8c8d4')); return { p, ax: 8, ay: 13 }; },
};
{ const _gf2 = genFurn2; genFurn2 = function (kind) { const f = VFURN[kind]; if (f) { const r = f(); r.p.outline(OUTL); return { c: r.p.canvas(), ax: r.ax, ay: r.ay }; } return _gf2(kind); }; }
// ---------- NPCs ----------
Object.assign(NPCS, {
  maquinista: { n: 'Maquinista Ramón', title: 'Conductor del tren', look: LK({ hair: HAIRS.gris, beard: HAIRS.gris, outfit: 'guard', main: CLOTH.marino, hat: 'helmet', hatC: CLOTH.marino }), lines: ['¡Bienvenido a la cabina! Desde aquí se ve todo el reino.', 'Treinta años conduciendo este tren y nunca me canso del paisaje.'] },
  mozo: { n: 'Mozo', title: 'Servicio de a bordo', look: LK({ hair: HAIRS.negro, outfit: 'apron', main: CLOTH.blanco, sec: CLOTH.granate }), lines: ['¿Le apetece algo de comer? ¡Tenemos el mejor menú sobre raíles!', 'Próxima parada en unos minutos, señor.'] },
  moza: { n: 'Moza', title: 'Servicio de a bordo', look: LK({ hair: HAIRS.rubio, hairStyle: 'long', outfit: 'apron', main: CLOTH.blanco, sec: CLOTH.granate }), lines: ['¡El pastel de hoy está delicioso!', 'Si se sienta junto a la ventana verá pasar todo el reino.'] },
  recepcion: { n: 'Recepcionista', title: 'Yate «Estrella del Sur»', look: LK({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'sailor', main: CLOTH.blanco }), lines: ['Bienvenido a bordo. Los camarotes están en esta cubierta.', 'El restaurante está arriba, y en la tercera cubierta tenemos piscina.'] },
  chef_yate: { n: 'Chef Marcel', title: 'Restaurante del yate', look: LK({ hair: HAIRS.negro, beard: HAIRS.negro, outfit: 'apron', main: CLOTH.blanco, hat: 'chef' }), lines: ['¡Cocina de alta mar! Pruebe el pescado del día.'] },
  socorrista: { n: 'Socorrista', title: 'Cubierta de la piscina', look: LK({ hair: HAIRS.rubio, outfit: 'tunic', main: CLOTH.rojo, skin: SKINS[1] }), lines: ['¡Nada de correr junto a la piscina!'] },
  oficial: { n: 'Primer Oficial Tomé', title: 'Puente de mando', look: LK({ hair: HAIRS.gris, outfit: 'sailor', main: CLOTH.blanco, hat: 'helmet', hatC: CLOTH.blanco }), lines: ['Rumbo fijo, mar en calma. La capitana estaría orgullosa.', 'Por el telescopio se ve el volcán de Brasa.'] },
});
for (let i = 0; i < 8; i++) NPCS['tpax' + i] = Object.assign({}, NPCS['pasajero' + i], { sit: 1 });
{ const _na = npcAtlas; npcAtlas = function (id) { const d = NPCS[id]; if (d && d.sit) return getAtlas('Nsit' + id, () => buildAtlas(Object.assign({}, d.look), ['idle', 'walk', 'sit'])); return _na(id); }; }
const FOOD_MENU = [['food1', 30], ['food2', 90], ['food3', 220], ['food4', 500], ['food5', 900]];
DLG_HOOKS.push((npc, opts) => { const P = G.P;
  if (npc.id === 'mozo' || npc.id === 'moza' || npc.id === 'chef_yate') opts.push({ label: 'Pedir comida', icon: ['food', 2], fn: () => { closeDialog(); openModal(`<h2>${iconHTML(['food', 2], 22)} Menú de a bordo</h2><div class="slist">${FOOD_MENU.filter(([id]) => ITEMS[id]).map(([id, pr]) => `<div class="srow">${iconHTML(ITEMS[id].icon, 24)}<div class="sn"><b>${esc(ITEMS[id].n)}</b><small>+${ITEMS[id].food}% ataque 3 min · cura ${fmt(ITEMS[id].heal)}</small></div><button class="btn sm gold" data-food="${id}" data-pr="${pr}">${iconHTML(['coin'], 12)} ${pr}</button></div>`).join('')}</div><div class="row"><button class="btn" id="mclose">Gracias</button></div>`, 'party'); $$('#modal [data-food]').forEach(b => b.onclick = () => { const pr = +b.dataset.pr; if (P.gold < pr) { toast('No tienes suficiente oro', 'warn'); return; } P.gold -= pr; giveItem(b.dataset.food, 1); sfx('coin'); }); const c = $('#mclose'); if (c) c.onclick = closeModal; } });
  if (npc.id === 'maquinista') { const tr = vehicleTrain(); if (tr) opts.push({ label: tr.state === 'stop' ? 'Parados en ' + tr.stopAt.n : '¿Cuál es la próxima parada?', icon: ['ways'], fn: () => typeText(tr.state === 'stop' ? 'Estamos en ' + tr.stopAt.n + '. Salimos en ' + Math.ceil(tr.left) + ' segundos.' : 'Próxima parada: ' + tr.next.n + '. Llegamos en unos ' + Math.ceil(tr.left) + ' segundos.') }); opts.push({ label: 'Tocar el silbato', icon: ['note', '#ffd040'], fn: () => { sfx(tr && tr.kind === 'steam' ? 'whistle' : 'horn'); typeText('¡Tuuu tuuu! Je, je, a todos les gusta.'); } }); }
  if (npc.id === 'oficial') opts.push({ label: '¿Cuándo llegamos?', icon: ['ways'], fn: () => { const Y = yachtState(); typeText(Y.dock ? 'Estamos atracados en ' + YPORT[Y.dock].n + '. Zarpamos en ' + Math.ceil(Y.left) + ' segundos.' : 'Navegamos hacia ' + YPORT[Y.to].n + '. Llegaremos en ' + Math.ceil(Y.left) + ' segundos.'); } });
});
// ---------- TRAIN interior ----------
const TCAR_W = 15;
function vehicleTrain() { const P = G.P; if (!P || !P.map.startsWith('tren_')) return null; return RAIL.trains[+P.map.slice(5)] || null; }
function makeTrainMap(tr) {
  const id = 'tren_' + tr.id; if (G.maps[id]) return G.maps[id];
  const nC = 4, w = 2 + 9 + nC * (TCAR_W + 1), h = 9, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.IWALL), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, vehicle: 'train', train: tr.id, windows: [], tdoors: [] };
  for (let y = 2; y <= 7; y++) for (let x = 1; x <= 9; x++) M.ter[I(x, y)] = T.FLOOR;
  const cars = []; for (let c = 0; c < nC; c++) { const x0 = 11 + c * (TCAR_W + 1); cars.push(x0); for (let y = 2; y <= 7; y++) for (let x = x0; x < x0 + TCAR_W; x++) M.ter[I(x, y)] = T.CARPET; for (const y of [4, 5]) M.ter[I(x0 - 1, y)] = T.FLOOR; const dx = x0 + 7; M.ter[I(dx, 8)] = T.FLOOR; M.tdoors.push(dx); for (let k = 0; k < 4; k++) M.windows.push({ x: (x0 + 1 + k * 3.6) * 16, y: 3, w: 40, h: 22 }); }
  M.windows.push({ x: 2 * 16, y: 3, w: 56, h: 22, front: 1 });
  M.exit = { x: -9, y: -9 }; M.cars = cars;
  initMapObjs(M);
  const F = (f, x, y, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {}));
  F('tpanel', 3, 3, { fp: [[0, 0], [-1, 0], [1, 0]] }); if (tr.kind === 'steam') F('fireplace', 7, 2, { fp: [[0, 0], [1, 0], [-1, 0]] }); else F('tpanel', 7, 2, { fp: [[0, 0], [-1, 0], [1, 0]] });
  for (const x0 of cars) for (let k = 0; k < 4; k++) { const sx = x0 + k * 4; for (const sy of [2, 3, 6, 7]) for (const dx of [0, 1]) { if (sx + dx >= x0 + TCAR_W) continue; if (sx + dx === x0 + 7) continue; F('tseat', sx + dx, sy, { seat: 1 }); } }
  M.wdist = null; G.maps[id] = M;
  spawnNPC('maquinista', 4 * 16 + 8, 5 * 16 + 12, id, { face: 'left' });
  spawnNPC('mozo', (cars[1] + 3) * 16 + 8, 4 * 16 + 12, id, { wander: 4 }); spawnNPC('moza', (cars[3] + 6) * 16 + 8, 5 * 16 + 12, id, { wander: 4 });
  const R = new RNG(tr.id * 31 + 7); for (const o of M.objs) if (o.seat && R.f() < 0.35) seatPax(M, o, R.int(0, 7));
  M.drawExtra = (cx, cy) => drawTrainWindows(M, tr, cx, cy);
  return M;
}
function seatPax(M, o, k) { if (o.taken) return null; const e = spawnNPC('tpax' + k, o.px, o.py - 2, M.id, { face: o.ty === 2 || o.ty === 6 ? 'down' : 'up' }); if (!e) return null; e.scene = 1; e.seatO = o; o.taken = e; setAnim(e, 'sit'); e.dir = 'down'; return e; }
function drawTrainWindows(M, tr, cx, cy) {
  const dk = darkness(), scroll = tr.s * 16 * 1.0, here = pathPos(tr.Ln.P, tr.s), W = G.world, ti = W.I(clamp(Math.round(here.x), 0, W.w - 1), clamp(Math.round(here.y), 0, W.h - 1)), wet = W.ter[ti] === T.BRIDGE, rk = REGIONS[W.reg[ti]].k;
  const ground = wet ? '#2a6ab8' : rk === 'desierto' ? '#d8c088' : rk === 'picos' ? '#e6eef8' : rk === 'volcan' || rk === 'nhar' ? '#5a4848' : rk === 'cristal' ? '#8a7ad8' : rk === 'eclipse' ? '#3a2a5a' : '#4a9a3a';
  for (const wd of M.windows) { const x = Math.round(wd.x - cx), y = Math.round(wd.y - cy); if (x > VW || x + wd.w < 0) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, wd.w, wd.h); ctx.clip();
    const sky = ctx.createLinearGradient(0, y, 0, y + wd.h); sky.addColorStop(0, dk > 0.6 ? '#0a1030' : '#6ab0ff'); sky.addColorStop(1, dk > 0.6 ? '#1a2048' : '#c8e8ff'); ctx.fillStyle = sky; ctx.fillRect(x, y, wd.w, wd.h);
    const far = (scroll * 0.15 + wd.x) % 60; ctx.fillStyle = dk > 0.6 ? '#1a2a3a' : '#6a8aa8'; for (let k = -1; k < 4; k++) { const hx = x - far + k * 60; ctx.beginPath(); ctx.moveTo(hx, y + wd.h); ctx.lineTo(hx + 30, y + 6); ctx.lineTo(hx + 60, y + wd.h); ctx.fill(); }
    ctx.fillStyle = ground; ctx.fillRect(x, y + wd.h - 8, wd.w, 8);
    if (wet) { ctx.fillStyle = '#9ad0ff'; for (let k = 0; k < 6; k++) ctx.fillRect(x + ((k * 13 - scroll * 0.8) % wd.w + wd.w) % wd.w, y + wd.h - 6 + (k % 2) * 3, 4, 1); }
    else if (tr.state === 'stop') { ctx.fillStyle = '#7a7a84'; ctx.fillRect(x, y + wd.h - 6, wd.w, 6); ctx.fillStyle = '#2a3e32'; for (let k = 0; k < 3; k++) ctx.fillRect(x + 6 + k * 16, y, 3, wd.h); }
    else { const near = (scroll * 1.2 + wd.x * 3) % 34; for (let k = -1; k < 3; k++) { const tx = x - near + k * 34; ctx.fillStyle = dk > 0.6 ? '#0e1a10' : '#2a6a2a'; ctx.beginPath(); ctx.arc(tx + 10, y + wd.h - 10, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#5a3a20'; ctx.fillRect(tx + 9, y + wd.h - 6, 2, 6); } ctx.fillStyle = '#8a7a6a'; const pole = (scroll * 1.6) % 70; ctx.fillRect(x + wd.w - pole, y + 2, 2, wd.h); }
    ctx.restore(); ctx.strokeStyle = '#d8d0c0'; ctx.lineWidth = 3; ctx.strokeRect(x, y, wd.w, wd.h); ctx.strokeStyle = '#6a5a4a'; ctx.lineWidth = 1; ctx.strokeRect(x - 2, y - 2, wd.w + 4, wd.h + 4); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x + 3, y + 3, 6, wd.h - 6); }
  if (tr.state === 'run' && Math.random() < 0.025) G.shake = Math.max(G.shake || 0, 1.3);
}
function boardTrainInterior(S, tr, dest) {
  const P = G.P, M = makeTrainMap(tr); P.retX = S.plat.x * 16 + 8; P.retY = S.plat.y * 16 + 8;
  transition(() => { P.trip = { tr, dest, last: tr.state === 'stop' ? tr.stopAt : null }; P.inside = M.id; setMap(M, (M.cars[1] + 7) * 16 + 8, 7 * 16 + 8, 'up'); rideUI(); toast(dest ? 'Te avisaremos al llegar a ' + dest.n : 'Disfruta del viaje', 'info'); });
}
function trainInteriorTick(dt) {
  const P = G.P, tr = vehicleTrain(); if (!tr) return; const M = G.map; if (!P.trip || P.trip.tr !== tr) P.trip = { tr, dest: P.trip && P.trip.dest, last: null };
  const R = P.trip; if (tr.state === 'stop' && R.last !== tr.stopAt) { R.last = tr.stopAt; P.retX = tr.stopAt.plat.x * 16 + 8; P.retY = tr.stopAt.plat.y * 16 + 8;
    if (R.dest === tr.stopAt) { banner('¡Hemos llegado a ' + tr.stopAt.n + '!', 'Baja por cualquier puerta del vagón'); sfx('quest'); vibrate(60); } else toast('Parada: ' + tr.stopAt.n + ' (' + Math.ceil(tr.left) + ' s)', 'info', 3);
    trainPaxSwap(M, tr); rideUI(); }
  if (tr.state === 'run' && R.last) { R.last = null; rideUI(); }
  // doors in the floor of each carriage
  const tx = Math.floor(P.x / 16), ty = Math.floor((P.y + 2) / 16);
  if (ty >= 8 && M.tdoors.includes(tx)) { if (tr.state === 'stop') { const S = tr.stopAt; P.trip = null; transition(() => { P.inside = null; setMap(G.world, S.plat.x * 16 + 8, S.plat.y * 16 + 8, 'down'); P.L = S.L; banner(S.n, stationArea(S)); rideUI(); markDirty(); }); } else { P.y = 7 * 16 + 6; if (G.t - (P.doorMsgT || 0) > 2) { P.doorMsgT = G.t; toast('Las puertas están cerradas: el tren está en marcha', 'warn'); } } }
}
function trainPaxSwap(M, tr) { const pax = G.ents.filter(e => e.map === M.id && e.seatO && !e.goal); const R = new RNG((Date.now() / 1000 | 0) + tr.id);
  for (const e of pax) if (R.f() < 0.3) { const dx = M.tdoors.reduce((a, b) => Math.abs(b * 16 - e.x) < Math.abs(a * 16 - e.x) ? b : a); e.seatO.taken = null; e.scene = 0; e.goal = { x: dx * 16 + 8, y: 8 * 16 + 10, then: 'vanish' }; }
  const free = M.objs.filter(o => o.seat && !o.taken); for (let k = 0; k < 3 && free.length; k++) { const o = free.splice((R.f() * free.length) | 0, 1)[0]; const dx = M.tdoors[(R.f() * M.tdoors.length) | 0]; const e = spawnNPC('tpax' + R.int(0, 7), dx * 16 + 8, 8 * 16 + 4, M.id, {}); if (!e) continue; o.taken = e; e.goal = { x: o.px, y: o.py - 2, then: 'sit', seatO: o }; } }
// people walking to a goal (boarding / alighting / finding a seat)
function walkGoal(e, dt) { const g = e.goal, dx = g.x - e.x, dy = g.y - e.y, L = Math.hypot(dx, dy); if (L < 3) { e.goal = null; if (g.then === 'vanish') e.remove = true; else if (g.then === 'hide') { e.hidden = 1; e.map = 'hidden'; if (g.back) setTimeout(() => { e.hidden = 0; e.map = g.back; e.x = g.bx; e.y = g.by; e.goal = { x: e.home.x, y: e.home.y, then: 'home' }; }, g.wait || 15000); } else if (g.then === 'sit') { e.seatO = g.seatO; e.scene = 1; setAnim(e, 'sit'); e.dir = 'down'; } else setAnim(e, 'idle'); return; }
  const sp = 34; e.x += dx / L * Math.min(L, sp * dt); e.y += dy / L * Math.min(L, sp * dt); e.dir = dirFromVec(dx, dy); setAnim(e, 'walk', true); stepAnim(e, dt, 7); }
{ const _un = updateNPC; updateNPC = function (e, dt) { if (e.goal) { walkGoal(e, dt); return; } return _un(e, dt); }; }
// station passengers on the world map walk to the train and get on/off
{ const _sa = stationArrive; stationArrive = function (S, tr) { _sa(S, tr); const pax = G.ents.filter(e => e.type === 'npc' && e.paxSt === S.k && !e.hidden && !e.goal), R = Math.random;
  for (const e of pax) if (R() < 0.5) { const c = carPos(tr, 2 + ((R() * 3) | 0)); e.goal = { x: c.x, y: c.y, then: 'hide', back: 'world', bx: c.x, by: c.y, wait: 12000 + R() * 25000 }; } }; }
// ---------- boarding menu (replaces the old one: no more instant arrival) ----------
boardMenu = function (S, tr) {
  const P = G.P, R = railCred(); if (!countItem('tarjeta_tren')) { toast('Necesitas una Tarjeta de Tren. Cómprala en la taquilla (500 oro).', 'warn', 4); return; }
  if (R.c < 100) { toast('Saldo insuficiente. Recarga tu tarjeta en la taquilla.', 'warn'); return; }
  const dests = RAIL.stations.filter(x => x !== S && x.stops[tr.line]);
  openModal(`<h2>${iconHTML(['card', '#ffd040'], 22)} ${esc(S.n)}</h2><p class="hint">Tren ${tr.kind === 'steam' ? 'a vapor' : 'diésel'} · Saldo: ${R.c} · Viaje: 100. Dentro puedes caminar por los vagones, sentarte, pedir comida y hablar con el maquinista. Te avisaremos al llegar.</p><div class="slist">${dests.map((d, i) => `<button class="srow" data-dst="${i}"><div class="sn"><b>${esc(d.n)}</b><small>${esc(stationArea(d))}</small></div></button>`).join('')}</div><div class="row"><button class="btn" id="mclose">Cancelar</button></div>`, 'party');
  $$('#modal [data-dst]').forEach(b => b.onclick = () => { const d = dests[+b.dataset.dst]; if (!stoppedTrainAt(S)) { closeModal(); toast('El tren ya ha salido…', 'warn'); return; } R.c -= 100; closeModal(); sfx('door'); passEvent('train', 1); boardTrainInterior(S, tr, d); markDirty(); });
  const c = $('#mclose'); if (c) c.onclick = closeModal;
};
rideTick = function () { };
rideUI = function () { const P = G.P; let el = document.getElementById('rideBar'); if (!el) { el = document.createElement('div'); el.id = 'rideBar'; document.getElementById('hud').appendChild(el); }
  const tr = vehicleTrain(), Y = P.map.startsWith('yate_') ? yachtState() : null; if (!tr && !Y) { el.hidden = true; return; } el.hidden = false;
  if (tr) { const R = P.trip || {}; el.innerHTML = `<b>${tr.kind === 'steam' ? 'Tren a vapor' : 'Tren diésel'}</b><span>${tr.state === 'stop' ? 'Parados en ' + esc(tr.stopAt.n) + ' · puertas abiertas' : 'Próxima parada: ' + esc(tr.next.n)}</span>${R.dest ? `<small>Tu destino: ${esc(R.dest.n)}</small>` : ''}`; }
  else el.innerHTML = `<b>Yate «Estrella del Sur»</b><span>${Y.dock ? 'Atracados en ' + esc(YPORT[Y.dock].n) + ' · baja por la pasarela (cubierta 1)' : 'Navegando hacia ' + esc(YPORT[Y.to].n)}</span>`; };
// ---------- YACHT: timetable between Puerto Coral and Isla Brasa ----------
const YPORT = { puerto: { n: 'Puerto Coral' }, brasa: { n: 'Isla Brasa' } }, Y_DOCK = 40, Y_SAIL = 80, Y_T = 2 * (Y_DOCK + Y_SAIL);
const YACHT_R = { path: null };
function yachtState() { const t = ((Date.now() / 1000) % Y_T + Y_T) % Y_T; if (t < Y_DOCK) return { dock: 'puerto', left: Y_DOCK - t, u: 0, to: 'brasa' }; if (t < Y_DOCK + Y_SAIL) return { dock: null, from: 'puerto', to: 'brasa', u: (t - Y_DOCK) / Y_SAIL, left: Y_DOCK + Y_SAIL - t }; if (t < 2 * Y_DOCK + Y_SAIL) return { dock: 'brasa', left: 2 * Y_DOCK + Y_SAIL - t, u: 1, to: 'puerto' }; return { dock: null, from: 'brasa', to: 'puerto', u: 1 - (t - 2 * Y_DOCK - Y_SAIL) / Y_SAIL, left: Y_T - t }; }
function yachtPath() {
  if (YACHT_R.path) return YACHT_R.path; const W = G.world, w = W.w, wet = (x, y) => W.inb(x, y) && (W.ter[W.I(x, y)] === T.DEEP || W.ter[W.I(x, y)] === T.WATER || W.ter[W.I(x, y)] === T.BRIDGE);
  const open = (x, y) => wet(x, y) && wet(x + 2, y) && wet(x - 2, y) && wet(x, y - 1) && wet(x, y + 1);
  const near = (x0, y0, ok) => { for (let r = 0; r < 40; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const x = x0 + dx, y = y0 + dy; if (open(x, y) && (!ok || ok(x, y))) return [x, y]; } return null; };
  const b = near(BRASA.dock[0] + 4, BRASA.dock[1] - 1) || [BRASA.dock[0] + 4, BRASA.dock[1] - 1];
  // flood the sea from the Brasa berth, then pick the closest reachable berth to Puerto Coral's marina
  const prev = new Int32Array(W.w * W.h).fill(-1), q = [b[1] * w + b[0]]; prev[q[0]] = q[0]; let qi = 0;
  while (qi < q.length) { const i = q[qi++], x = i % w, y = (i / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!wet(nx, ny)) continue; const j = ny * w + nx; if (prev[j] >= 0) continue; prev[j] = i; q.push(j); } }
  const roomy = (x, y) => { for (let dy = -3; dy <= 1; dy++) for (let dx = -7; dx <= 7; dx++) if (!wet(x + dx, y + dy) || W.ter[W.I(x + dx, y + dy)] === T.BRIDGE) return false; return true; };
  const a = near(234, 129, (x, y) => prev[y * w + x] >= 0 && roomy(x, y)) || near(233, 130, (x, y) => prev[y * w + x] >= 0) || [233, 130]; YPORT.puerto.berth = a; YPORT.brasa.berth = b;
  const pts = []; const st = a[1] * w + a[0]; if (prev[st] >= 0) { for (let i = st; i !== prev[i]; i = prev[i]) pts.push([i % w, (i / w) | 0]); pts.push(b); } else pts.push(a, b);
  const sm = pts.filter((p, i) => i % 4 === 0 || i === pts.length - 1); let L = 0; const seg = []; for (let i = 1; i < sm.length; i++) { const d = dist(sm[i][0], sm[i][1], sm[i - 1][0], sm[i - 1][1]); seg.push({ a: sm[i - 1], b: sm[i], s0: L, d }); L += d; }
  return YACHT_R.path = { pts: sm, seg, L };
}
function yachtPos() { const Y = yachtState(), P_ = yachtPath(); const s = Y.u * P_.L; let x = P_.pts[0][0], y = P_.pts[0][1], dir = 1; for (const g of P_.seg) if (s <= g.s0 + g.d || g === P_.seg[P_.seg.length - 1]) { const t = g.d ? clamp((s - g.s0) / g.d, 0, 1) : 0; x = lerp(g.a[0], g.b[0], t); y = lerp(g.a[1], g.b[1], t); dir = g.b[0] >= g.a[0] ? 1 : -1; break; } if (Y.from === 'brasa') dir = -dir; return { x: x * 16 + 8, y: y * 16 + 8, dir, Y }; }
// the world yacht now sails; tourists on deck travel with it
spawnYacht = function () { if (YACHT && G.ents.includes(YACHT)) return; YACHT = { type: 'deco', k2: 'yacht', map: 'world', x: 0, y: 0, dyOff: 70, noShadow: true, tour: [] }; G.ents.push(YACHT);
  [['turista1', -62, -46], ['turista2', -24, -46], ['turista3', 22, -46], ['turista4', 6, -64]].forEach(([id, dx, dy]) => { const e = spawnNPC(id, 0, 0, 'world', { face: 'down', L: -1 }); if (e) { e.scene = 1; e.yacht = 1; e.yo = [dx, dy]; YACHT.tour.push(e); } }); };
function yachtWorldTick(dt) { if (!G.world || !YACHT) return; const p = yachtPos(); YACHT.x = p.x; YACHT.y = p.y + 30 - 70; YACHT.flip = p.dir < 0; for (const e of YACHT.tour) { e.x = p.x + e.yo[0] * (p.dir < 0 ? -1 : 1); e.y = p.y + 30 + e.yo[1]; }
  if (!p.Y.dock && Math.random() < dt * 8) part(p.x - p.dir * 90 + (Math.random() - 0.5) * 10, p.y + 28, { vx: -p.dir * 20, vz: 4, g: 10, life: 0.8, c: '#e8f8ff', s: 2 });
  const P = G.P; if (P && P.map === 'world' && p.Y.dock && Math.random() < dt * 0.4) { const port = p.Y.dock, pier = port === 'brasa' ? BRASA.pier : [228, 129]; const e = spawnNPC('turista' + (1 + ((Math.random() * 3) | 0)), pier[0] * 16 + 8, pier[1] * 16 + 8, 'world', {}); if (e) { e.tmpPax = 1; e.goal = Math.random() < 0.5 ? { x: p.x, y: p.y, then: 'vanish' } : { x: pier[0] * 16 + 8 + (Math.random() - 0.5) * 80, y: pier[1] * 16 + 60, then: 'vanish' }; } } }
{ const _dd = drawDeco; drawDeco = function (e, cx, cy) { if (e.k2 !== 'yacht' || !e.flip) return _dd(e, cx, cy); const s = EXTRA_SPR.yacht(e); ctx.save(); ctx.translate(Math.round(e.x - cx), Math.round(e.y + e.dyOff - cy)); ctx.scale(-1, 1); ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore(); }; }
// ---------- YACHT interior: 4 decks ----------
const YDECKS = ['Cubierta 1 · Recepción y camarotes', 'Cubierta 2 · Restaurante y bar', 'Cubierta 3 · Piscina', 'Cubierta 4 · Puente de mando'];
function makeYachtDeck(n) {
  const id = 'yate_' + n; if (G.maps[id]) return G.maps[id];
  const w = 46, h = 16, N = w * h, I = (x, y) => y * w + x, open = n === 3;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.DEEP), lvl: new Uint8Array(N), reg: new Uint8Array(N).fill(RI.mar), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, vehicle: 'yacht', deck: n, windows: [] };
  const inHull = (x, y) => { const bow = x > 36 ? (x - 36) * 0.65 : 0; return x >= 2 && x <= 44 && y >= 2 + bow && y <= 13 - bow; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (inHull(x, y)) M.ter[I(x, y)] = open ? T.PLANK : n === 2 ? T.CARPET : T.FLOOR;
  if (!open) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (inHull(x, y) && (!inHull(x, y - 1) || !inHull(x - 1, y) || !inHull(x + 1, y) || !inHull(x, y - 2))) M.ter[I(x, y)] = T.IWALL;
  if (n === 1) { M.ter[I(22, 13)] = T.FLOOR; M.ter[I(23, 13)] = T.FLOOR; M.gang = [22, 23]; for (let x = 4; x <= 34; x++) if (x % 6 !== 1) M.ter[I(x, 7)] = T.IWALL; }
  if (n === 3) { for (let y = 5; y <= 9; y++) for (let x = 14; x <= 26; x++) M.ter[I(x, y)] = T.WATER; }
  if (!open) for (let x = 5; x < 40; x += 5) M.windows.push({ x: x * 16, y: 3 * 16 + 2, w: 30, h: 14, sea: 1 });
  M.exit = { x: -9, y: -9 }; initMapObjs(M);
  const F = (f, x, y, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {}));
  if (n < 4) F('ystair_up', 6, 9, { fp: [[0, 0], [-1, 0], [1, 0]], stair: 1 }); if (n > 1) F('ystair_down', 10, 9, { fp: [[0, 0], [-1, 0], [1, 0]], stair: -1 });
  if (n === 1) { F('counter', 22, 4, { fp: [[0, 0], [-1, 0], [1, 0], [2, 0]] }); spawnNPC('recepcion', 22 * 16 + 8, 3 * 16 + 14, id, { face: 'down' }); for (let c = 0; c < 5; c++) { const cx = 5 + c * 6; F('bed', cx, 9, { fp: [[0, 0], [0, 1]] }); F('plant', cx + 3, 11); } F('rug', 22, 10, { solid: false, fp: [] }); }
  if (n === 2) { F('bar', 30, 4, { fp: [[0, 0], [-1, 0], [-2, 0], [1, 0], [2, 0]] }); spawnNPC('chef_yate', 30 * 16 + 8, 3 * 16 + 12, id, { face: 'down' }); F('piano', 14, 4, { fp: [[0, 0], [1, 0], [-1, 0]] }); for (const [x, y] of [[16, 8], [21, 8], [26, 8], [16, 11], [21, 11], [26, 11], [32, 9]]) { F('table', x, y, { fp: [[0, 0], [1, 0]] }); F('chair', x - 1, y); F('chair', x + 2, y); } spawnNPC('mozo', 20 * 16, 10 * 16, id, { wander: 4 }); spawnNPC('moza', 28 * 16, 7 * 16, id, { wander: 4 }); }
  if (n === 3) { for (let x = 3; x < 40; x += 2) { const top = Math.ceil(2 + (x > 36 ? (x - 36) * 0.65 : 0)); F('rail', x, top, { solid: true }); } for (const [x, y] of [[8, 5], [8, 8], [31, 5], [31, 8], [34, 6]]) F('lounger', x, y, { fp: [[0, 0], [0, 1]], seat: 1 }); F('umbrella', 11, 4); F('umbrella', 29, 4); spawnNPC('socorrista', 20 * 16, 11 * 16, id, { face: 'up' }); }
  if (n === 4) { F('wheel', 38, 7); F('radar', 34, 4); F('telescope', 41, 7, { scope: 1 }); spawnNPC('oficial', 37 * 16, 9 * 16, id, { face: 'right' }); F('tpanel', 30, 4, { fp: [[0, 0], [-1, 0], [1, 0]] }); }
  const R = new RNG(n * 17); for (let k = 0; k < (n === 3 ? 5 : 3); k++) { const e = spawnNPC('turista' + (1 + (k % 3)), (12 + R.int(0, 22)) * 16 + 8, (n === 1 ? 5 : 10) * 16 + 8, id, { wander: 3 }); }
  if (n === 3) { const lo = M.objs.filter(o => o.seat); lo.slice(0, 3).forEach((o, k) => { const e = spawnNPC('tpax' + (k + 2), o.px, o.py - 4, id, {}); if (e) { e.scene = 1; setAnim(e, 'sit'); o.taken = e; } }); }
  M.wdist = null; G.maps[id] = M; M.drawExtra = (cx, cy) => drawYachtView(M, cx, cy); return M;
}
function drawYachtView(M, cx, cy) { const Y = yachtState(), t = G.t * (Y.dock ? 2 : 40);
  if (M.deck === 3) { for (let k = 0; k < 14; k++) { const x = ((k * 61 + t) % (M.w * 16 + 200)) - 100 - cx, y = (k % 2 ? 1 : M.h - 1) * 16 - cy + (k % 3) * 4; ctx.fillStyle = 'rgba(232,248,255,0.7)'; ctx.fillRect(Math.round(x), Math.round(y), 10, 2); } }
  for (const wd of M.windows) { const x = Math.round(wd.x - cx), y = Math.round(wd.y - cy); ctx.save(); ctx.beginPath(); ctx.rect(x, y, wd.w, wd.h); ctx.clip(); const dk = darkness(); ctx.fillStyle = dk > 0.6 ? '#0a1030' : '#8ac8ff'; ctx.fillRect(x, y, wd.w, wd.h); ctx.fillStyle = dk > 0.6 ? '#0e2a4a' : '#2a6ab8'; ctx.fillRect(x, y + wd.h / 2, wd.w, wd.h / 2); ctx.fillStyle = '#d8f0ff'; for (let k = 0; k < 3; k++) ctx.fillRect(x + ((k * 11 - t) % wd.w + wd.w) % wd.w, y + wd.h / 2 + 2 + k * 2, 4, 1); if (Y.dock) { ctx.fillStyle = '#6a5a4a'; ctx.fillRect(x, y + wd.h / 2 - 3, wd.w, 3); } ctx.restore(); ctx.fillStyle = '#c8a050'; ctx.strokeStyle = '#c8a050'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x + wd.w / 2, y + wd.h / 2, wd.w / 2, wd.h / 2, 0, 0, 7); ctx.stroke(); } }
function boardYacht(port) { const P = G.P, M = makeYachtDeck(1); const pier = port === 'brasa' ? BRASA.pier : [228, 129]; P.retX = pier[0] * 16 + 8; P.retY = pier[1] * 16 + 8; P.yacht = { from: port };
  transition(() => { P.inside = M.id; setMap(M, 22.5 * 16, 12 * 16 + 4, 'up'); toast('Bienvenido a bordo del «Estrella del Sur». Explora las 4 cubiertas.', 'info', 4); rideUI(); }); }
function yachtInteriorTick(dt) {
  const P = G.P, M = G.map; if (!M || M.vehicle !== 'yacht') return; const Y = yachtState(); P.yacht = P.yacht || {};
  if (Y.dock && P.yacht.lastDock !== Y.dock) { P.yacht.lastDock = Y.dock; const pier = Y.dock === 'brasa' ? BRASA.pier : [228, 129]; P.retX = pier[0] * 16 + 8; P.retY = pier[1] * 16 + 8; if (P.yacht.from !== Y.dock) { banner('¡Hemos llegado a ' + YPORT[Y.dock].n + '!', 'Baja por la pasarela de la cubierta 1'); sfx('quest'); } rideUI(); }
  if (!Y.dock && P.yacht.lastDock) { P.yacht.lastDock = null; toast('Zarpamos rumbo a ' + YPORT[Y.to].n, 'info'); sfx('horn'); rideUI(); }
  if (M.deck === 1 && M.gang) { const tx = Math.floor(P.x / 16), ty = Math.floor((P.y + 2) / 16); if (ty >= 13 && M.gang.includes(tx)) { if (Y.dock) { const pier = Y.dock === 'brasa' ? BRASA.pier : [228, 129]; P.yacht = null; transition(() => { P.inside = null; setMap(G.world, pier[0] * 16 + 8, (pier[1] + 1) * 16 + 8, 'down'); if (Y.dock === 'brasa') P.ws.brasa = 1; banner(YPORT[Y.dock].n, ''); rideUI(); markDirty(); }); } else { P.y = 12 * 16 + 6; if (G.t - (P.doorMsgT || 0) > 2) { P.doorMsgT = G.t; toast('Estamos en alta mar: la pasarela está cerrada', 'warn'); } } } }
}
function goDeck(n) { const P = G.P, M = makeYachtDeck(n); transition(() => { P.inside = M.id; setMap(M, (n > G.map.deck ? 10 : 6) * 16 + 8, 10 * 16 + 10, 'down'); banner(YDECKS[n - 1], ''); rideUI(); }); }
// interactions inside vehicles: seats, stairs, telescope
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.vehicle && !P.dead) { let best = null, bd = 30 * 30; for (const o of M.objs) { if (!(o.seat || o.stair || o.scope) || o.hidden) continue; const d = dist2(o.px, o.py - 4, P.x, P.y); if (d < bd) { bd = d; best = o; } } if (best) return { kind: 'vfurn', o: best, label: best.seat ? (best.taken ? 'Ocupado' : 'Sentarse') : best.stair ? (best.stair > 0 ? 'Subir' : 'Bajar') : 'Mirar', icon: best.seat ? 'talk' : 'run' }; } return _it(); }; }
{ const _di = doInteract; doInteract = function () { const P = G.P, M = G.map; if (M && M.vehicle && !P.dead) { const it = interactTarget(); if (it && it.kind === 'vfurn') { const o = it.o; if (o.seat) { if (o.taken) { toast('Ese asiento está ocupado', 'info'); return; } P.x = o.px; P.y = o.py - 2; P.dir = 'down'; doEmote('sit'); return; } if (o.stair) { goDeck(M.deck + o.stair); return; } if (o.scope) { const Y = yachtState(); banner(Y.dock ? 'Ves ' + YPORT[Y.dock].n + ' desde el puerto' : 'A lo lejos se ve ' + YPORT[Y.to].n, Y.to === 'brasa' ? 'El volcán echa humo en el horizonte' : 'Las velas de Puerto Coral brillan al sol'); return; } } } return _di(); }; }
// dialog: board the yacht at either pier
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'marina' && npc.id !== 'capitana') return; for (let i = opts.length - 1; i >= 0; i--) if (/yate|yacht/i.test(opts[i].label)) opts.splice(i, 1);
  const port = npc.id === 'marina' ? 'puerto' : 'brasa', P = G.P, Y = yachtState();
  opts.unshift({ label: Y.dock === port ? 'Subir al yate (300 oro)' : 'Yate «Estrella del Sur»: ' + (Y.dock ? 'atracado en ' + YPORT[Y.dock].n : 'navegando') + ' · llega en ' + Math.ceil(Y.dock === port ? 0 : Y.dock ? Y.left + Y_SAIL : Y.left) + ' s', icon: ['ways'], fn: () => { const Y2 = yachtState(); if (Y2.dock !== port) { typeText('El yate aún no ha llegado. Espera en el muelle, se ve venir desde lejos.'); return; } if (port === 'puerto' && P.lv < 140 && !(P.ws && P.ws.brasa)) { typeText('La Isla Brasa es peligrosa: vuelve cuando seas nivel 140.'); return; } if (P.gold < 300) { typeText('El pasaje cuesta 300 oro.'); return; } P.gold -= 300; closeDialog(); boardYacht(port); } }); });
function vehicleTick(dt) { trainInteriorTick(dt); yachtInteriorTick(dt); yachtWorldTick(dt); const M = G.map; if (M && !M.vehicle) { if (G.P.trip) G.P.trip = null; const el = document.getElementById('rideBar'); if (el && !el.hidden) el.hidden = true; } }
