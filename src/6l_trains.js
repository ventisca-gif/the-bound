// ================= RAILWAY: double track around the whole map + a central line, steam & diesel trains, stations =================
const RAIL = { lines: [], stations: [], trains: [], ready: false };
it('tarjeta_tren', { n: 'Tarjeta de Tren', t: 'quest', price: 500, icon: ['card', '#ffd040'], rar: 2, d: 'Tarjeta recargable para viajar en tren. Cada viaje cuesta 100 de saldo.' });
const STRUCT_K = new Set(['bld', 'castle', 'magetower', 'gatetower', 'lighthouse', 'witchhut', 'fountain', 'well', 'statue', 'waystone', 'portal', 'volcano', 'mine', 'cave', 'boat', 'forge', 'stall', 'tent', 'windmill']);
// ---------- world placement (called from buildWorld, before nature) ----------
function placeRails(W) {
  const w = W.w, h = W.h, rail = W.rail = new Uint8Array(w * h); RAIL.lines = []; RAIL.stations = [];
  const mark = (x, y, dir) => { if (!W.inb(x, y)) return; const i = W.I(x, y); rail[i] |= dir; };
  const loop = (pts) => { const segs = []; let L = 0; for (let k = 0; k < pts.length; k++) { const a = pts[k], b = pts[(k + 1) % pts.length], len = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]); segs.push({ a, b, s0: L, len }); L += len; } return { pts, segs, L }; };
  // ring: outer track clockwise, inner track counter-clockwise
  const I0 = 5, I1 = 6, x0 = I0, x1 = w - 1 - I0, y0 = I0, y1 = h - 1 - I0, ix0 = I1, ix1 = w - 1 - I1, iy0 = I1, iy1 = h - 1 - I1;
  RAIL.lines.push({ id: 'A', ring: 1, P: loop([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) });
  RAIL.lines.push({ id: 'B', ring: 1, P: loop([[ix0, iy0], [ix0, iy1], [ix1, iy1], [ix1, iy0]]) });
  // central line: pick the row with the fewest obstacles
  let best = 176, bc = 1e9; for (let yy = 168; yy <= 184; yy++) { let c = 0; for (let x = 8; x <= w - 9; x++) for (let dy = -1; dy <= 5; dy++) { const i = W.I(x, yy + dy); if (W.townAt[i] >= 0) c += 50; const oi = W.objAt[i]; if (oi >= 0 && STRUCT_K.has(W.objs[oi].k)) c += 100; } for (const b of W.bosses) if (Math.abs(b.y - yy) < 5) c += 30; if (c < bc) { bc = c; best = yy; } }
  const cy = best; RAIL.crossY = cy;
  RAIL.lines.push({ id: 'C', P: loop([[9, cy], [w - 10, cy], [w - 10, cy + 1], [9, cy + 1]]) });
  for (const Ln of RAIL.lines) for (const sg of Ln.P.segs) { const [ax, ay] = sg.a, [bx, by] = sg.b, dir = ay === by ? 1 : 2, n = sg.len; for (let k = 0; k <= n; k++) mark(ax + Math.sign(bx - ax) * k, ay + Math.sign(by - ay) * k, dir); }
  // clear the corridor: hide small objects, water & cliffs become a trestle bridge
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = W.I(x, y); if (!rail[i]) continue;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!W.inb(x + dx, y + dy)) continue; const j = W.I(x + dx, y + dy); W.flags[j] |= 16 | 4; const oi = W.objAt[j]; if (oi >= 0 && (dx === 0 && dy === 0 || !STRUCT_K.has(W.objs[oi].k))) hideObj(W, W.objs[oi]); }
    if (SOLID_T[W.ter[i]] || W.ter[i] === T.STAIRS) { W.ter[i] = T.BRIDGE; W.flags[i] |= 8; } }
  // stations
  const ST = [['norte', 'Estación Norte', 'A', 128, y0, 'h', 1], ['cristal', 'Estación Cristal', 'A', 300, y0, 'h', 1], ['oeste', 'Estación Oeste', 'A', x0, 100, 'v', 1], ['este', 'Estación Selva', 'A', x1, 140, 'v', -1], ['brasa', 'Estación Brasa', 'A', 146, y1, 'h', -1],
    ['bosque', 'Estación Bosque', 'C', 40, cy, 'h', 1], ['albor', 'Estación Albor', 'C', 118, cy, 'h', 1], ['costa', 'Estación Costa', 'C', 205, cy, 'h', 1], ['sahrim', 'Estación Sahrim', 'C', 298, cy, 'h', 1], ['yarakai', 'Estación Yarakai', 'C', 345, cy, 'h', 1]];
  for (const [k, n, line, sx, sy, o, side] of ST) {
    // platform on the inner side: 3 rows/cols beyond both tracks
    const pf = []; const off = line === 'C' ? 2 : 2; for (let a = -5; a <= 5; a++) for (let b = 0; b < 3; b++) { const px = o === 'h' ? sx + a : sx + side * (off + b), py = o === 'h' ? sy + side * (off + b) + (line === 'C' ? 0 : 0) : sy + a; pf.push([px, py]); }
    let L0 = 0; { const ax = o === 'h' ? sx : sx + side * 6, ay = o === 'h' ? sy + side * 6 : sy; if (W.inb(ax, ay)) L0 = W.lvl[W.I(ax, ay)]; }
    for (const [px, py] of pf) { if (!W.inb(px, py)) continue; const i = W.I(px, py); if (rail[i]) continue; W.ter[i] = T.COBBLE; W.lvl[i] = L0; W.flags[i] |= 16 | 4 | 1; const oi = W.objAt[i]; if (oi >= 0) hideObj(W, W.objs[oi]); }
    // a little ramp so the platform always connects to the land behind it
    for (let d = 3; d <= 8; d++) for (let a = -1; a <= 1; a++) { const px = o === 'h' ? sx + a : sx + side * (off + d), py = o === 'h' ? sy + side * (off + d) : sy + a; if (!W.inb(px, py)) continue; const i = W.I(px, py); if (rail[i]) continue; if (WATERY[W.ter[i]] || SOLID_T[W.ter[i]]) W.ter[i] = T.COBBLE; if (W.lvl[i] !== L0) { if (d < 6) { W.lvl[i] = L0; if (W.ter[i] === T.FACE) W.ter[i] = T.COBBLE; } else W.ter[i] = T.STAIRS; } W.flags[i] |= 16 | 1; const oi = W.objAt[i]; if (oi >= 0 && !STRUCT_K.has(W.objs[oi].k)) hideObj(W, W.objs[oi]); }
    const plat = { x: o === 'h' ? sx : sx + side * (off + 1), y: o === 'h' ? sy + side * (off + 1) : sy };
    RAIL.stations.push({ k, n, line, x: sx, y: sy, o, side, plat, L: L0 });
    // benches & ticket booth
    const bx = o === 'h' ? [sx - 4, plat.y + side] : [plat.x + side, sy - 4]; addObj(W, 'bench', bx[0], bx[1]); const bx2 = o === 'h' ? [sx + 4, plat.y + side] : [plat.x + side, sy + 4]; addObj(W, 'bench', bx2[0], bx2[1]);
    W.npcDefs.push({ id: 'taquilla', x: o === 'h' ? sx + 2 : plat.x + side, y: o === 'h' ? plat.y + side : sy + 2, face: o === 'h' ? (side > 0 ? 'up' : 'down') : (side > 0 ? 'left' : 'right') });
    for (let q = 0; q < 3; q++) W.npcDefs.push({ id: 'pasajero' + ((RAIL.stations.length * 3 + q) % 8), x: o === 'h' ? sx - 2 + q * 2 : plat.x, y: o === 'h' ? plat.y : sy - 2 + q * 2, wander: 1, st: k });
  }
  // station stop points (where the locomotive halts) for every line passing by
  for (const S of RAIL.stations) { S.stops = {}; for (const Ln of RAIL.lines) { if (Ln.id === 'C' ? S.line !== 'C' : S.line === 'C') continue; const pts = Ln.id === 'C' ? [[S.x, S.y], [S.x, S.y + 1]] : [[S.x, S.y]]; const arr = []; for (const [px, py] of pts) { const s = nearestS(Ln.P, px, py); if (s.d < 3) arr.push(s.s); } if (arr.length) S.stops[Ln.id] = arr; } }
}
function hideObj(W, o) { if (!o || o.hidden) return; o.hidden = true; o.gone = 1; for (const [dx, dy] of o.fp || [[0, 0]]) { const x = o.tx + dx, y = o.ty + dy; if (!W.inb(x, y)) continue; const i = W.I(x, y); if (W.objAt[i] === o.id) { W.objAt[i] = -1; W.solidO[i] = 0; } } }
function pathPos(P_, s) { s = ((s % P_.L) + P_.L) % P_.L; for (const sg of P_.segs) if (s <= sg.s0 + sg.len) { const t = sg.len ? (s - sg.s0) / sg.len : 0; return { x: lerp(sg.a[0], sg.b[0], t), y: lerp(sg.a[1], sg.b[1], t), dx: Math.sign(sg.b[0] - sg.a[0]), dy: Math.sign(sg.b[1] - sg.a[1]) }; } const sg = P_.segs[0]; return { x: sg.a[0], y: sg.a[1], dx: 1, dy: 0 }; }
function nearestS(P_, x, y) { let best = { s: 0, d: 1e9 }; for (const sg of P_.segs) { for (let k = 0; k <= sg.len; k++) { const px = sg.a[0] + Math.sign(sg.b[0] - sg.a[0]) * k, py = sg.a[1] + Math.sign(sg.b[1] - sg.a[1]) * k, d = Math.abs(px - x) + Math.abs(py - y); if (d < best.d) best = { s: sg.s0 + k, d }; } } return best; }
// ---------- trains ----------
const CAR_LEN = 3.2;
function initTrains() {
  if (RAIL.ready || !G.world || !G.world.rail) return; RAIL.ready = true; RAIL.trains = []; stationDecos();
  // timetable per line: every stop on the loop, sorted along the path
  for (const Ln of RAIL.lines) { const L = Ln.P.L, st = []; for (const S of RAIL.stations) for (const ss of (S.stops[Ln.id] || [])) st.push({ S, s: ss }); st.sort((a, b) => a.s - b.s);
    const legs = []; let T = 0; for (let k = 0; k < st.length; k++) { const a = st[k], b = st[(k + 1) % st.length], D = ((b.s - a.s) % L + L) % L || L; const dur = travelTime(D); legs.push({ from: a, to: b, D, t0: T, dwell: TR_DWELL, dur }); T += TR_DWELL + dur; } Ln.legs = legs; Ln.T = T; }
  const add = (line, kind, frac) => { const Ln = RAIL.lines.find(l => l.id === line); const cars = kind === 'steam' ? ['steam', 'tender', 'coachr', 'coachr', 'coachr'] : ['diesel', 'diesel2', 'coachr', 'coachr', 'coachr']; RAIL.trains.push({ id: RAIL.trains.length, line, Ln, kind, cars, phase: frac * Ln.T, s: 0, v: 0, state: 'run', stopAt: null, chuff: 0 }); };
  add('A', 'steam', 0); add('A', 'diesel', 0.5); add('B', 'diesel', 0.13); add('B', 'steam', 0.63); add('C', 'steam', 0.05); add('C', 'diesel', 0.55);
}
const TR_VMAX = 17, TR_ACC = 3.2, TR_DWELL = 12;
function travelTime(D) { const ta = TR_VMAX / TR_ACC, da = TR_VMAX * TR_VMAX / (2 * TR_ACC); return D > 2 * da ? 2 * ta + (D - 2 * da) / TR_VMAX : 2 * Math.sqrt(D / TR_ACC); }
function travelPos(D, t) { const ta = TR_VMAX / TR_ACC, da = TR_VMAX * TR_VMAX / (2 * TR_ACC); if (D > 2 * da) { const T = 2 * ta + (D - 2 * da) / TR_VMAX; if (t < ta) return [0.5 * TR_ACC * t * t, TR_ACC * t]; if (t < T - ta) return [da + (t - ta) * TR_VMAX, TR_VMAX]; const r = T - t; return [D - 0.5 * TR_ACC * r * r, TR_ACC * r]; } const T = 2 * Math.sqrt(D / TR_ACC), h = T / 2; if (t < h) return [0.5 * TR_ACC * t * t, TR_ACC * t]; const r = T - t; return [D - 0.5 * TR_ACC * r * r, TR_ACC * r]; }
function trainClock() { return Date.now() / 1000; }
function trainState(tr, now) { const Ln = tr.Ln, L = Ln.P.L; let t = ((now + tr.phase) % Ln.T + Ln.T) % Ln.T; for (const g of Ln.legs) { if (t < g.t0 + g.dwell) return { s: g.from.s, v: 0, stop: g.from.S, next: g.to.S, left: g.t0 + g.dwell - t }; if (t < g.t0 + g.dwell + g.dur) { const [d, v] = travelPos(g.D, t - g.t0 - g.dwell); return { s: (g.from.s + d) % L, v, stop: null, next: g.to.S, left: g.t0 + g.dwell + g.dur - t }; } } const g = Ln.legs[0]; return { s: g.from.s, v: 0, stop: g.from.S, next: g.to.S, left: 1 }; }
function trainTick(dt) {
  if (!RAIL.ready) initTrains(); if (!RAIL.ready) return; const P = G.P, now = trainClock();
  for (const tr of RAIL.trains) {
    const Ln = tr.Ln, L = Ln.P.L, st = trainState(tr, now), was = tr.stopAt;
    tr.s = st.s; tr.v = st.v; tr.next = st.next; tr.left = st.left; tr.state = st.stop ? 'stop' : 'run'; tr.stopAt = st.stop;
    if (st.stop && was !== st.stop) stationArrive(st.stop, tr); if (!st.stop && was) { stationDepart(was, tr); if (P && P.map === 'world' && dist(was.x * 16, was.y * 16, P.x, P.y) < 400) sfx(tr.kind === 'steam' ? 'whistle' : 'horn'); }
    // sounds near the player
    if (P && P.map === 'world') { const h = pathPos(Ln.P, tr.s), dd = dist(h.x * 16, h.y * 16, P.x, P.y); if (dd < 320 && tr.state === 'run') { tr.chuff -= dt * tr.v / 6; if (tr.chuff <= 0) { tr.chuff = 0.5; sfx(tr.kind === 'steam' ? 'chuff' : 'rumble'); } } if (dd < 260 && tr.state === 'run' && !tr.honk) { tr.honk = 1; sfx(tr.kind === 'steam' ? 'whistle' : 'horn'); } if (dd > 400) tr.honk = 0;
      if (tr.kind === 'steam' && tr.state === 'run' && dd < 600 && Math.random() < dt * 14) { const c = carPos(tr, 0); part(c.x + (c.h ? -c.dir * 8 : 0), c.y - 26, { vx: -c.dx * tr.v * 4 + (Math.random() - 0.5) * 6, vy: -c.dy * tr.v * 4, vz: 20, g: -4, life: 1.6, c: Math.random() < 0.5 ? '#e8e8ec' : '#bcbcc4', s: 3 }); } }
  }
  trainHazard(dt); rideTick(dt);
}
function stationDepart(S, tr) { }
function carPos(tr, i) { const p = pathPos(tr.Ln.P, tr.s - i * CAR_LEN - 1.2); const h = p.dy === 0; return { x: p.x * 16 + 8, y: p.y * 16 + 8, h, dx: p.dx, dy: p.dy, dir: h ? p.dx || 1 : p.dy || 1 }; }
function trainHazard(dt) {
  const P = G.P; if (!P || P.dead || P.riding || P.map !== 'world' || P.ghost) return;
  for (const tr of RAIL.trains) { if (tr.v < 0.6) continue; for (let i = 0; i < tr.cars.length; i++) { const c = carPos(tr, i); const hw = c.h ? 26 : 11, hh = c.h ? 10 : 26; if (Math.abs(P.x - c.x) < hw && Math.abs(P.y - 4 - c.y) < hh) { G.shake = 10; sfx('boom'); vibrate(80); burst(P.x, P.y - 10, 30, { sp: 120, up: 60, g: 140, life: 0.8, c: ['#ff5a5a', '#ffffff', '#8a8a8a'] }); toast('¡Te ha atropellado el tren! No te quedes en las vías.', 'warn', 4); P.hp = 0; playerDie(true); return; } }
    for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== 'world' || m.boss) continue; const c = carPos(tr, 0); if (Math.abs(m.x - c.x) < 28 && Math.abs(m.y - c.y) < 18) { const a = c.h ? Math.sign(m.y - c.y) || 1 : Math.sign(m.x - c.x) || 1; if (c.h) m.y += a * 24; else m.x += a * 24; m.stun = 1; } } }
}
// ---------- drawing ----------
const TRC = { steamG: pal(['#0a1a0e', '#163a1e', '#22602e', '#358a42', '#5ab060']), black: pal(['#08080a', '#141418', '#222228', '#34343c', '#4a4a54']), maroon: pal(['#2a060a', '#4a0e14', '#6e1a20', '#8e2a2e', '#b04a48']), yellow: pal(['#5a4206', '#9a7410', '#d8a820', '#f0cc40', '#fff090']), dgreen: pal(['#06180e', '#0e2a18', '#163e22', '#22582e', '#3a7a44']) };
function genCar(kind, horiz) {
  const W = horiz ? 54 : 26, H = horiz ? 40 : 58, p = new Pix(W, H);
  const body = kind === 'steam' || kind === 'tender' ? TRC.steamG : kind === 'coachr' ? TRC.maroon : kind === 'coachg' ? TRC.dgreen : TRC.yellow, roof = kind === 'coachr' || kind === 'coachg' ? pal(['#1a1a1e', '#2a2a30', '#3e3e46', '#56565e', '#707078']) : TRC.black;
  if (horiz) { // side view, facing left
    const by = 33; for (const wx of [10, 22, 34, 44]) { p.ball(wx, by, 4, 4, [TRC.black[0], TRC.black[2], TRC.black[3], TRC.black[4]]); p.set(wx, by, kind === 'steam' ? TRC.steamG[4] : C('#c8c8d0')); }
    p.rect(3, by - 5, 48, 3, TRC.black[1]);
    if (kind === 'steam') { p.rect(4, 12, 30, 16, TRC.black[2]); p.hl(4, 12, 30, TRC.black[4]); for (let x = 8; x < 32; x += 6) p.vl(x, 12, 16, TRC.black[1]); p.rect(0, 14, 4, 12, TRC.black[3]); p.rect(1, 26, 6, 3, C('#c02020')); p.ball(2, 20, 2, 2, [C('#ffe080'), C('#fff0b0'), C('#ffffff'), C('#ffffff')]); p.rect(8, 4, 5, 9, TRC.black[2]); p.hl(7, 4, 7, TRC.black[4]); p.ball(20, 10, 3, 2.4, [TRC.steamG[1], TRC.steamG[2], TRC.steamG[3], TRC.steamG[4]]); p.rect(34, 6, 16, 22, body[2]); p.hl(34, 6, 16, body[4]); p.rect(37, 10, 7, 7, C('#ffe0a0')); p.rect(34, 4, 17, 3, TRC.black[3]); p.hl(34, 24, 16, C('#d8a820')); }
    else if (kind === 'tender') { p.rect(4, 14, 46, 14, body[2]); p.hl(4, 14, 46, body[4]); p.rect(6, 10, 42, 5, TRC.black[1]); for (let x = 8; x < 46; x += 3) p.set(x, 11, TRC.black[3]); p.hl(4, 24, 46, C('#d8a820')); }
    else if (kind === 'diesel' || kind === 'diesel2') { p.rect(2, 8, 50, 20, body[2]); p.hl(2, 8, 50, body[4]); p.rect(2, 22, 50, 3, TRC.dgreen[3]); p.line(2, 24, 14, 18, TRC.dgreen[3]); if (kind === 'diesel') { p.rect(2, 10, 12, 12, body[3]); p.rect(4, 12, 7, 5, C('#2a3a4a')); p.ball(3, 20, 1.6, 1.6, [C('#fff0b0'), C('#ffffff'), C('#ffffff'), C('#ffffff')]); } for (let x = 18; x < 48; x += 8) p.rect(x, 12, 5, 6, C('#2a3a4a')); p.rect(20, 5, 20, 3, TRC.black[2]); p.rect(0, 26, 4, 3, C('#c02020')); }
    else { p.rect(3, 9, 48, 19, body[2]); p.hl(3, 9, 48, body[4]); p.rect(3, 5, 48, 5, roof[2]); p.hl(3, 5, 48, roof[4]); for (let x = 7; x < 48; x += 7) { p.rect(x, 12, 5, 7, C('#f0e0a0')); p.set(x, 12, C('#fff8d0')); } p.hl(3, 22, 48, C('#d8a820')); p.rect(25, 12, 4, 14, body[1]); }
    return { c: p.canvas(), ax: W / 2, ay: H - 2 };
  }
  // vertical: seen from the front/top, facing down
  for (const wy of [10, 46]) for (const sx of [2, W - 3]) p.rect(sx - 1, wy, 3, 6, TRC.black[1]);
  if (kind === 'steam') { p.rect(5, 6, 16, 34, TRC.black[2]); p.vl(5, 6, 34, TRC.black[4]); p.ball(13, 40, 8, 8, [TRC.black[1], TRC.black[2], TRC.black[3], TRC.black[4]]); p.ball(13, 42, 2.4, 2.4, [C('#ffe080'), C('#fff0b0'), C('#ffffff'), C('#ffffff')]); p.rect(4, 48, 18, 4, C('#c02020')); p.ball(13, 22, 3, 3, TRC.black.slice(1)); p.rect(4, 2, 18, 8, body[2]); p.hl(4, 2, 18, body[4]); }
  else if (kind === 'diesel' || kind === 'diesel2') { p.rect(3, 4, 20, 46, body[2]); p.vl(3, 4, 46, body[4]); p.rect(3, 4, 20, 3, TRC.black[2]); if (kind === 'diesel') { p.rect(4, 36, 18, 12, body[3]); p.rect(6, 38, 14, 5, C('#2a3a4a')); for (const x of [8, 17]) p.ball(x, 47, 1.4, 1.4, [C('#fff0b0'), C('#ffffff'), C('#ffffff'), C('#ffffff')]); p.rect(4, 50, 18, 3, C('#c02020')); } p.vl(13, 8, 26, TRC.dgreen[3]); }
  else { p.rect(3, 3, 20, 50, body[2]); p.rect(5, 3, 16, 50, roof[2]); p.vl(5, 3, 50, roof[4]); for (let y = 8; y < 50; y += 8) p.hl(5, y, 16, roof[1]); p.vl(3, 3, 50, body[4]); p.vl(22, 3, 50, body[1]); }
  return { c: p.canvas(), ax: W / 2, ay: H - 4 };
}
function trainDrawList(list, cx, cy) {
  if (!RAIL.ready) return; const P = G.P;
  for (const tr of RAIL.trains) for (let i = 0; i < tr.cars.length; i++) { const c = carPos(tr, i); if (c.x < cx - 80 || c.x > cx + VW + 80 || c.y < cy - 80 || c.y > cy + VH + 80) continue;
    list.push({ type: 'tcar', x: c.x, y: c.y + (c.h ? 10 : 24), cx: c.x, cy: c.y, kind: tr.cars[i], c, tr, noShadow: true, glow: i === 0 && darkness() > 0.3 ? 60 : 0, glowC: 'rgba(255,240,180,0.6)', rider: P.riding && P.riding.tr === tr && i === 2 }); }
}
function drawTrainCar(e, cx, cy) {
  const c = e.c, s = spr('car' + e.kind + (c.h ? 'h' : 'v'), () => genCar(e.kind, c.h)); const x = Math.round(e.cx - cx), y = Math.round(e.cy - cy) + (c.h ? 8 : 20);
  ctx.save(); ctx.translate(x, y); if (c.h && c.dx > 0) ctx.scale(-1, 1); if (!c.h && c.dy < 0) ctx.scale(1, -1); const bob = e.tr.state === 'run' ? (Math.floor(G.t * 12 + e.cx) % 2) : 0; ctx.drawImage(s.c, -s.ax, -s.ay - bob - (!c.h && c.dy < 0 ? -s.c.height + 8 : 0)); ctx.restore();
  if (e.rider) { const t = textSprite(G.P.name, '#ffe8a0', '#120a0e'); ctx.drawImage(t, x - t.width / 2, y - 46); }
}
// rails painted on top of the cached terrain chunks
function railChunk(M, k, cv) {
  if (!M.isWorld || !M.rail) return; const cx = k % 4096, cy = Math.floor(k / 4096), x0 = cx * CH, y0 = cy * CH, g = cv.getContext('2d');
  for (let ty = y0; ty < y0 + CH; ty++) for (let tx = x0; tx < x0 + CH; tx++) { if (tx >= M.w || ty >= M.h) continue; const r = M.rail[M.I(tx, ty)]; if (!r) continue; const px = (tx - x0) * 16, py = (ty - y0) * 16, wet = M.ter[M.I(tx, ty)] === T.BRIDGE;
    if (wet) { g.fillStyle = '#2a1a10'; for (const ox of [2, 12]) g.fillRect(px + ox, py + 10, 2, 6); }
    g.fillStyle = wet ? 'rgba(60,40,24,0.9)' : 'rgba(96,88,80,0.85)'; if (r & 1) g.fillRect(px, py + 2, 16, 12); if (r & 2) g.fillRect(px + 2, py, 12, 16);
    g.fillStyle = '#5a3a20'; if (r & 1) for (let k2 = 0; k2 < 16; k2 += 4) g.fillRect(px + k2, py + 3, 2, 10); if (r & 2) for (let k2 = 0; k2 < 16; k2 += 4) g.fillRect(px + 3, py + k2, 10, 2);
    g.fillStyle = '#3a3a42'; if (r & 1) { g.fillRect(px, py + 5, 16, 2); g.fillRect(px, py + 10, 16, 2); } if (r & 2) { g.fillRect(px + 5, py, 2, 16); g.fillRect(px + 10, py, 2, 16); }
    g.fillStyle = '#c8c8d4'; if (r & 1) { g.fillRect(px, py + 5, 16, 1); g.fillRect(px, py + 10, 16, 1); } if (r & 2) { g.fillRect(px + 5, py, 1, 16); g.fillRect(px + 10, py, 1, 16); } }
}
// station roofs (iron & glass, inspired by big old train halls)
function genStationRoof(o) { const horiz = o === 'h', W = horiz ? 192 : 104, H = horiz ? 128 : 208, p = new Pix(W, H); const iron = pal(['#0e1a14', '#1a2a22', '#2a3e32', '#3e5646', '#58745e']), glass = C('#bfe6ff', 120), glass2 = C('#e8f6ff', 150);
  if (horiz) { const top = 16, bot = H - 4; for (let x = 6; x < W - 6; x++) for (let y = top; y < bot - 54; y++) p.set(x, y, (x + y) % 9 === 0 ? glass2 : glass); for (let x = 6; x < W - 6; x += 12) { p.vl(x, top, bot - 54 - top, iron[2]); } for (let y = top; y < bot - 54; y += 10) p.hl(6, y, W - 12, iron[3]);
    for (let a = 0; a <= 40; a++) { const t = a / 40 * Math.PI, x = W / 2 - Math.cos(t) * (W / 2 - 6), y = top + 4 - Math.sin(t) * 14; p.rect(Math.round(x), Math.round(y), 2, 2, iron[4]); }
    for (const x of [8, W / 2 - 1, W - 10]) { p.rect(x, bot - 54, 3, 54, iron[1]); p.vl(x, bot - 54, 54, iron[3]); } p.hl(6, bot - 55, W - 12, iron[4]); p.rect(6, bot - 57, W - 12, 3, iron[2]);
    p.ball(W / 2, top + 20, 7, 7, [iron[1], C('#f4f0e0'), C('#f4f0e0'), C('#ffffff')]); p.line(W / 2, top + 20, W / 2, top + 15, C('#1a1a1a')); p.line(W / 2, top + 20, W / 2 + 4, top + 21, C('#1a1a1a')); }
  else { for (let y = 8; y < H - 8; y++) for (let x = 6; x < W - 6; x++) p.set(x, y, (x + y) % 9 === 0 ? glass2 : glass); for (let y = 8; y < H - 8; y += 12) p.hl(6, y, W - 12, iron[2]); for (let x = 6; x < W - 6; x += 16) p.vl(x, 8, H - 16, iron[3]); p.rect(4, 6, 3, H - 12, iron[4]); p.rect(W - 7, 6, 3, H - 12, iron[1]); for (const y of [10, H / 2, H - 12]) p.rect(4, y, W - 8, 3, iron[3]); }
  return { c: p.canvas(), ax: W / 2, ay: H - 2 }; }
function stationDecos() {
  for (const S of RAIL.stations) { if (S.deco) continue; const h = S.o === 'h', cxp = h ? S.x * 16 + 8 : (S.x + S.side * 2) * 16 + 8, cyp = h ? (S.y + S.side * 1.5) * 16 + 8 : S.y * 16 + 8;
    S.deco = { type: 'deco', k2: 'roof_' + S.o, map: 'world', x: cxp, y: h ? cyp + 52 : cyp + 104, dyOff: 0, noShadow: true, st: S, roof: 1 }; G.ents.push(S.deco); }
}
EXTRA_SPR.roof_h = () => spr('roofh', () => genStationRoof('h'));
EXTRA_SPR.roof_v = () => spr('roofv', () => genStationRoof('v'));
{ const _dd = drawDeco; drawDeco = function (e, cx, cy) { if (!e.roof) return _dd(e, cx, cy); const P = G.P, s = EXTRA_SPR[e.k2](e); const x0 = e.x - s.ax, y0 = e.y - s.ay; const under = P.x > x0 && P.x < x0 + s.c.width && P.y > y0 && P.y < e.y + 10; ctx.globalAlpha = under ? 0.35 : 0.9; ctx.drawImage(s.c, Math.round(x0 - cx), Math.round(y0 - cy)); ctx.globalAlpha = 1;
  const t = textSprite(e.st.n, '#ffe8a0', '#120a0e'); ctx.drawImage(t, Math.round(e.x - cx - t.width / 2), Math.round(y0 - cy + (e.st.o === 'h' ? 2 : 0))); }; }
// ---------- stations: NPCs, tickets, boarding ----------
const PAX = [['Viajera', 'Una vez me dormí y di tres vueltas al mundo entero en este tren.'], ['Comerciante', 'Llevo especias de Sahrim a Arxar. El tren es más rápido que cualquier caravana.'], ['Abuela', 'Cuando era niña, el tren a vapor era la gran novedad. ¡Aún me emociona!'], ['Estudiante', 'Voy a la Torre de los Magos. Leo en el tren, es muy tranquilo.'], ['Aventurero', 'Desde la ventanilla vi al Gólem de Escarcha. ¡Enorme!'], ['Pescador', 'Cruzar el mar en tren sobre el puente es precioso al atardecer.'], ['Turista', '¿Sabías que el tren cruza toda la isla de Brasa? Se ve el volcán.'], ['Revisor jubilado', 'Nunca te quedes en las vías. El tren no frena para nadie.']];
const PAXLOOK = [{ hair: HAIRS.rubio, hairStyle: 'long', outfit: 'dress', main: CLOTH.azul }, { hair: HAIRS.negro, beard: HAIRS.negro, outfit: 'apron', main: CLOTH.naranja }, { hair: HAIRS.blanco, hairStyle: 'long', outfit: 'dress', main: CLOTH.morado }, { hair: HAIRS.castano, outfit: 'tunic', main: CLOTH.verde }, { hair: HAIRS.rojo, outfit: 'ranger', main: CLOTH.marron || CLOTH.beige }, { hair: HAIRS.gris, outfit: 'sailor', hat: 'straw' }, { hair: HAIRS.rosa, hairStyle: 'long', outfit: 'tunic', main: CLOTH.amarillo }, { hair: HAIRS.gris, beard: HAIRS.gris, outfit: 'guard', main: CLOTH.marino }];
PAX.forEach(([n, line], i) => { NPCS['pasajero' + i] = { n, title: 'Pasajero', look: LK(Object.assign({ skin: SKINS[i % 4] }, PAXLOOK[i])), lines: [line, 'Estoy esperando el próximo tren.'] }; });
NPCS.taquilla = { n: 'Taquillera', title: 'Ferrocarril del Reino', look: LK({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'guard', main: CLOTH.marino, hat: 'helmet', hatC: CLOTH.marino }), lines: ['¡Bienvenido al ferrocarril! La tarjeta cuesta 500 oro y cada viaje 100 de saldo.', 'Por seguridad, no camines por las vías.'] };
function railCred() { const P = G.P; P.rail = P.rail || { c: 0 }; return P.rail; }
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'taquilla') return; const P = G.P, R = railCred(), has = countItem('tarjeta_tren') > 0;
  if (!has) opts.push({ label: 'Comprar Tarjeta de Tren (500 oro)', icon: ['card', '#ffd040'], fn: () => { if (P.gold < 500) { typeText('No tienes suficiente oro.'); return; } P.gold -= 500; giveItem('tarjeta_tren', 1); R.c += 100; sfx('coin'); typeText('¡Aquí tienes tu tarjeta! Te regalo 100 de saldo para tu primer viaje.'); markDirty(); } });
  else for (const n of [100, 500, 1000]) opts.push({ label: `Recargar ${n} (saldo: ${R.c})`, icon: ['coin'], fn: () => { if (P.gold < n) { typeText('No tienes suficiente oro.'); return; } P.gold -= n; R.c += n; sfx('coin'); typeText('Recargado. Saldo: ' + R.c + '. Cada viaje cuesta 100.'); markDirty(); } }); });
function stationAt(x, y) { for (const S of RAIL.stations) { const h = S.o === 'h', dx = x / 16 - S.x, dy = y / 16 - S.y; if (h ? Math.abs(dx) <= 6.5 && dy * S.side >= -0.5 && dy * S.side <= 5 : Math.abs(dy) <= 6.5 && dx * S.side >= -0.5 && dx * S.side <= 5) return S; } return null; }
function stationArrive(S, tr) {
  // passengers come and go
  const pax = G.ents.filter(e => e.type === 'npc' && e.paxSt === S.k); const P = G.P;
  if (pax.length && Math.random() < 0.7) { const e = pax[(Math.random() * pax.length) | 0]; if (!e.hidden) { e.hidden = 1; e.map = 'hidden'; setTimeout(() => { e.hidden = 0; e.map = 'world'; e.x = e.home.x; e.y = e.home.y; }, 9000 + Math.random() * 20000); } }
  if (P && P.map === 'world' && stationAt(P.x, P.y) === S && !P.riding) toast('El tren ha llegado a ' + S.n + '. Pulsa Acción para subir.', 'info', 3);
}
function stoppedTrainAt(S) { return RAIL.trains.find(tr => tr.state === 'stop' && tr.stopAt === S); }
{ const _it = interactTarget; interactTarget = function () { const P = G.P; if (P.map === 'world' && !P.dead && !P.riding && RAIL.ready) { const S = stationAt(P.x, P.y); if (S && stoppedTrainAt(S)) return { kind: 'train', S, label: 'Subir al tren', icon: 'run' }; } return _it(); }; }
{ const _di = doInteract; doInteract = function () { const P = G.P; if (!P.dead && !P.riding && P.map === 'world' && RAIL.ready) { const S = stationAt(P.x, P.y), tr = S && stoppedTrainAt(S); if (tr && !P.job && !P.fishing) { boardMenu(S, tr); return; } } return _di(); }; }
function boardMenu(S, tr) {
  const P = G.P, R = railCred(); if (!countItem('tarjeta_tren')) { toast('Necesitas una Tarjeta de Tren. Cómprala en la taquilla (500 oro).', 'warn', 4); return; }
  if (R.c < 100) { toast('Saldo insuficiente. Recarga tu tarjeta en la taquilla.', 'warn'); return; }
  const dests = RAIL.stations.filter(x => x !== S && x.stops[tr.line]);
  openModal(`<h2>${iconHTML(['card', '#ffd040'], 22)} ${esc(S.n)}</h2><p class="hint">Tren ${tr.kind === 'steam' ? 'a vapor' : 'diésel'} · Saldo: ${R.c} · Viaje: 100</p><div class="slist">${dests.map((d, i) => `<button class="srow" data-dst="${i}"><div class="sn"><b>${esc(d.n)}</b><small>${esc(stationArea(d))}</small></div></button>`).join('')}</div><div class="row"><button class="btn" id="mclose">Cancelar</button></div>`, 'party');
  $$('#modal [data-dst]').forEach(b => b.onclick = () => { const d = dests[+b.dataset.dst]; if (!stoppedTrainAt(S)) { closeModal(); toast('El tren ya ha salido…', 'warn'); return; } R.c -= 100; closeModal(); P.riding = { tr, dest: d, from: S }; P.job = null; setAnim(P, 'idle'); sfx('door'); toast('Has subido al tren rumbo a ' + d.n, 'info'); passEvent('train', 1); rideUI(); markDirty(); });
  const c = $('#mclose'); if (c) c.onclick = closeModal;
}
function stationArea(S) { const W = G.world, ax = S.o === 'h' ? S.x : S.x + S.side * 8, ay = S.o === 'h' ? S.y + S.side * 8 : S.y; const i = W.I(clamp(ax, 0, W.w - 1), clamp(ay, 0, W.h - 1)); return W.townAt[i] >= 0 ? TOWNS[W.townAt[i]].n : REGIONS[W.reg[i]].n; }
function rideTick(dt) {
  const P = G.P, R = P && P.riding; if (!R) return; const c = carPos(R.tr, 2); P.x = c.x; P.y = c.y + 2; P.map = 'world'; P.ifr = 1; P.dir = c.h ? (c.dx > 0 ? 'right' : 'left') : (c.dy > 0 ? 'down' : 'up');
  if (R.tr.state === 'stop' && R.tr.stopAt === R.dest) alight(R.dest);
}
function alight(S) { const P = G.P; P.riding = null; const p = S.plat; P.x = p.x * 16 + 8; P.y = p.y * 16 + 8; P.L = S.L; setAnim(P, 'idle'); sfx('door'); banner(S.n, stationArea(S)); rideUI(); markDirty(); }
let _rideEl = null;
function rideUI() { const P = G.P; if (!_rideEl) { _rideEl = document.createElement('div'); _rideEl.id = 'rideBar'; document.getElementById('hud').appendChild(_rideEl); }
  if (!P.riding) { _rideEl.hidden = true; return; } _rideEl.hidden = false; _rideEl.innerHTML = `<b>En tren</b><span>Destino: ${esc(P.riding.dest.n)}</span><div class="row"><button class="btn sm" id="rideNext">Bajar en la próxima</button><button class="btn sm gold" id="rideSkip">Llegar ya</button></div>`;
  $('#rideNext').onclick = () => { const tr = P.riding.tr, L = tr.Ln.P.L; let nd = 1e9, ns = null; for (const S of RAIL.stations) { const sa = S.stops[tr.line]; if (!sa || S === tr.stopAt) continue; for (const ss of sa) { const d = ((ss - tr.s) % L + L) % L; if (d < nd) { nd = d; ns = S; } } } if (ns) { P.riding.dest = ns; rideUI(); toast('Bajarás en ' + ns.n, 'info'); } };
  $('#rideSkip').onclick = () => { const d = P.riding.dest; transition(() => alight(d)); }; }
{ const _hp = hurtPlayer; hurtPlayer = function () { if (G.P && G.P.riding) return; return _hp.apply(this, arguments); }; }
// ---------- map overlay ----------
function railMap(x, sc) { if (!RAIL.lines.length) return; x.save(); x.strokeStyle = 'rgba(40,30,24,0.9)'; x.lineWidth = Math.max(2, sc * 1.6); for (const Ln of RAIL.lines) { x.beginPath(); Ln.P.pts.forEach((p, i) => i ? x.lineTo(p[0] * sc, p[1] * sc) : x.moveTo(p[0] * sc, p[1] * sc)); x.closePath(); x.stroke(); }
  x.strokeStyle = 'rgba(220,210,190,0.8)'; x.lineWidth = 1; x.setLineDash([3, 3]); for (const Ln of RAIL.lines) { x.beginPath(); Ln.P.pts.forEach((p, i) => i ? x.lineTo(p[0] * sc, p[1] * sc) : x.moveTo(p[0] * sc, p[1] * sc)); x.closePath(); x.stroke(); } x.setLineDash([]);
  for (const S of RAIL.stations) { x.fillStyle = '#ffd040'; x.strokeStyle = '#1a1010'; x.lineWidth = 2; x.fillRect(S.x * sc - 3, S.y * sc - 3, 6, 6); x.strokeRect(S.x * sc - 3, S.y * sc - 3, 6, 6); }
  for (const tr of RAIL.trains) { const c = carPos(tr, 0); x.fillStyle = tr.kind === 'steam' ? '#5ab060' : '#f0cc40'; x.beginPath(); x.arc(c.x / 16 * sc, c.y / 16 * sc, 3, 0, 7); x.fill(); } x.restore(); }
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'card') return _gi(spec); const p = new Pix(16, 16), c = C(spec[1] || '#ffd040'); p.rect(1, 4, 14, 9, uMul(c, 0.55)); p.rect(1, 4, 14, 8, c); p.hl(1, 6, 14, C('#2a1a10')); p.rect(3, 9, 5, 2, C('#ffffff')); p.rect(11, 8, 3, 3, C('#c02020')); return p; }; }
UI_ICONS.push('card:#ffd040');
