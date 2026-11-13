// ================= v4.14: ATAQUES Y HABILIDADES VISIBLES PARA LOS DEMÁS JUGADORES =================
// Antes solo viajaba el nombre de la animación cada pocos instantes: un ataque dura 0,3 s y se perdía, y los efectos
// (cortes, anillos, rayos, proyectiles, partículas) nunca salían del teléfono. Ahora todo lo que dibuja tu ataque o tu
// habilidad se guarda como evento numerado y viaja en la presencia (sala, WiFi y Photon). Los demás lo repiten en
// su pantalla, con la pose y un salto si la habilidad lo tiene. Es solo visual: el daño sigue siendo de cada uno.
let NFX_ON = 0, NFX_SEQ = Math.floor(Date.now() / 100) % 1e9; const NFX_OUT = [];   // el número crece aunque se reinicie el juego
const NFX_KEYS_SKIP = new Set(['t', 'id', 'hit', 'e', 'm', 'tg', 'owner', 'follow', 'src', 'draw', 'remove']);
function nfxNum(v) { return Math.round(v * 10) / 10; }
function nfxPick(o) {
  const r = {}; let n = 0;
  for (const k in o) { if (NFX_KEYS_SKIP.has(k) || n > 24) continue; const v = o[k];
    if (typeof v === 'number') { if (isFinite(v)) { r[k] = nfxNum(v); n++; } }
    else if (typeof v === 'string') { if (v.length <= 40) { r[k] = v; n++; } }
    else if (typeof v === 'boolean') { r[k] = v ? 1 : 0; n++; }
    else if (Array.isArray(v) && v.length <= 8 && v.every(x => typeof x === 'string' || typeof x === 'number')) { r[k] = v.map(x => typeof x === 'number' ? nfxNum(x) : String(x).slice(0, 24)); n++; }
    else if (k === 'set' && v && typeof v.img !== 'undefined') { r.set = { img: String(v.img), row: v.row | 0, bow: v.bow ? 1 : 0, cw: v.cw | 0, ch: v.ch | 0, s: v.s | 0 }; n++; } }
  return r;
}
function nfxPush(e) { if (!netOnline() || !G.P) return; e.i = ++NFX_SEQ; e.m = G.P.map; NFX_OUT.push({ t: G.t, e }); while (NFX_OUT.length > 30) NFX_OUT.shift(); }
const nfxWrap = fn => function () { NFX_ON++; try { return fn.apply(this, arguments); } finally { NFX_ON--; } };
{ const _af = addFx; addFx = function (o) { _af(o); if (NFX_ON && o && o.type && o.type !== 'custom' && !o.net) nfxPush({ k: 'f', o: nfxPick(o) }); }; }
{ const _bu = burst; burst = function (x, y, n, o) { _bu(x, y, n, o); if (NFX_ON && n > 0 && !(o && o.net)) nfxPush({ k: 'b', x: nfxNum(x), y: nfxNum(y), n: Math.min(24, n | 0), o: nfxPick(o || {}) }); }; }
{ const _sp = spawnProj; spawnProj = function (owner, x, y, ang, o) { const e = _sp(owner, x, y, ang, o); if (NFX_ON && owner === 'p' && e) nfxPush({ k: 'p', x: nfxNum(x), y: nfxNum(y), a: nfxNum(ang), v: nfxNum(Math.hypot(e.vx, e.vy)), l: nfxNum(e.life), art: e.art || '', z: nfxNum(e.z || 12), set: e.wspr ? nfxPick({ set: e.wspr }).set : null }); return e; }; }
{ const _sa = setAnim; setAnim = function (e, a, ...r) { const res = _sa(e, a, ...r); if (NFX_ON && e === G.P && NET_ANIMS.includes(a) && a !== 'walk') nfxPush({ k: 'a', a }); return res; }; }
{ const _da = delayAct; delayAct = function (t, fn) { return _da(t, NFX_ON ? nfxWrap(fn) : fn); }; }
basicAttack = nfxWrap(basicAttack); useSkill = nfxWrap(useSkill); dodgeRoll = nfxWrap(dodgeRoll);
for (const nm of ['castRune', 'runeCast', 'castRuneCombo', 'parryCounter']) if (typeof window[nm] === 'function') window[nm] = nfxWrap(window[nm]);
// ---- envío: los eventos del último segundo y medio (cabe aunque Photon envíe 5 veces por segundo) ----
{ const _spz = socialPresence; socialPresence = function (o) { _spz(o); const P = G.P; if (!P) return;
  const now = NFX_OUT.filter(x => G.t - x.t < 1.6).map(x => x.e); let s = JSON.stringify(now); while (now.length && s.length > 2400) { now.shift(); s = JSON.stringify(now); }
  if (now.length) o.fx = now; if (P.z > 0.5) o.z = Math.round(P.z); }; }
// ---- recepción ----
const NFX_TYPES = new Set(['slash', 'ring', 'field', 'fall', 'bolt', 'beam', 'boom', 'line', 'note', 'tele', 'wspr']);
const nfxColor = s => typeof s === 'string' && /^[#a-z0-9(),.%\s]{1,40}$/i.test(s) ? s : undefined;
function nfxSafe(o, M) {
  const r = {}; for (const k in o) { const v = o[k];
    if (typeof v === 'number') r[k] = clamp(v, -99999, 99999);
    else if (typeof v === 'string') { const c = nfxColor(v); if (c !== undefined) r[k] = c; }
    else if (Array.isArray(v)) r[k] = v.filter(x => typeof x === 'number' || nfxColor(x) !== undefined).slice(0, 8); }
  if (M) { r.x = clamp(+r.x || 0, 0, M.w * 16); r.y = clamp(+r.y || 0, 0, M.h * 16); }
  return r;
}
function nfxSet(s) { if (!s || typeof s.img !== 'string' || !WSPR_IMG[s.img]) return null; return { img: s.img, row: clamp(s.row | 0, 0, 10), bow: s.bow ? 1 : 0, cw: s.cw ? clamp(s.cw | 0, 8, 200) : 0, ch: s.ch ? clamp(s.ch | 0, 8, 200) : 0, s: s.s ? clamp(s.s | 0, 1, 4) : 0 }; }
function nfxPlay(r, ev) {
  const M = G.map; if (!M || !ev || typeof ev !== 'object') return;
  if (ev.k === 'a') { if (ANIMS[ev.a] && NET_ANIMS.includes(ev.a)) { r.anim = ev.a; r.af = 0; r.at = 0; r.holdA = ev.a; r.holdT = G.t + (ev.a === 'cast' ? 0.5 : ev.a === 'slam' ? 0.55 : 0.35); } return; }
  if (ev.k === 'f' && ev.o && NFX_TYPES.has(ev.o.type)) { const o = nfxSafe(ev.o, M); o.type = ev.o.type; o.dur = clamp(+o.dur || 0.3, 0.05, 4); if (ev.o.set) { const s = nfxSet(ev.o.set); if (!s) return; o.set = s; } o.net = 1; addFx(o); return; }
  if (ev.k === 'b' && ev.o) { const o = nfxSafe(ev.o); o.net = 1; if (o.c && !o.c.length) delete o.c; burst(clamp(+ev.x || 0, 0, M.w * 16), clamp(+ev.y || 0, 0, M.h * 16), clamp(ev.n | 0, 1, 24), o); return; }
  if (ev.k === 'p') { const x = clamp(+ev.x || 0, 0, M.w * 16), y = clamp(+ev.y || 0, 0, M.h * 16), a = +ev.a || 0, v = clamp(+ev.v || 200, 20, 900), l = clamp(+ev.l || 0.9, 0.1, 3), art = typeof ev.art === 'string' && /^[a-z_]{0,16}$/.test(ev.art) ? ev.art : '', z = clamp(+ev.z || 12, 0, 40), set = ev.set ? nfxSet(ev.set) : null;
    addFx({ type: 'custom', net: 1, x, y, dur: l, draw(f, sx, sy) { const cx = f.x - sx, cy = f.y - sy, t = f.t; const e = { x: x + Math.cos(a) * v * t, y: y + Math.sin(a) * v * t, z, ang: a, art, t, vx: Math.cos(a) * v, vy: Math.sin(a) * v, wspr: set }; drawProj(e, cx, cy); } }); }
}
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr);
  r.z = clamp(+pr.z || 0, 0, 40);
  if (!Array.isArray(pr.fx)) { if (r.nfxLast === undefined) r.nfxLast = 0; return; } const evs = pr.fx.filter(e => e && typeof e.i === 'number').sort((a, b) => a.i - b.i); if (!evs.length) return;
  const last = evs[evs.length - 1].i;
  if (r.nfxLast === undefined) { r.nfxLast = last; return; }   // al conocerlo a mitad de un ataque no repite lo viejo
  const P = G.P; for (const e of evs) { if (e.i <= r.nfxLast) continue; r.nfxLast = e.i; if (P && r.map === P.map && e.m === P.map) { try { nfxPlay(r, e); } catch (err) { } } }
}; }
{ const _ur = upsertRemote; upsertRemote = function (p) { _ur(p); const r = G.remote.get(p.peer); if (r && r.holdT > G.t && (r.anim === 'idle' || r.anim === 'walk')) r.anim = r.holdA; }; }
{ const _df = drawFx; drawFx = function (f, cx, cy) { if (!f.net) return _df(f, cx, cy); try { _df(f, cx, cy); } catch (e) { f.t = f.dur; } }; }

// ---------- poses según el nombre de la habilidad: saltos, volteretas y bailes (se ven en red por la altura z) ----------
const SK_HOP = { g17: [0.42, 20, 'slam'], a9: [0.3, 9, null], d9: [0.36, 7, 'dance'], z17: [0.3, 6, null], s17: [0.25, 5, null], g9: [0.22, 4, null] };
for (const id in SKILLS_LEAP_EXTRA()) SK_HOP[id] = SKILLS_LEAP_EXTRA()[id];
function SKILLS_LEAP_EXTRA() { const o = {}; for (const k in SK) { const e = SK[k].eff; if (e && e.k === 'leap' && !SK_HOP[k]) o[k] = [0.42, 18, 'slam']; } return o; }
// efectos extra para que cada habilidad se parezca a su nombre (se envían igual que los demás)
const SK_EXTRA = {
  z15: (P, a) => { for (let i = 0; i < 3; i++) delayAct(0.1 + i * 0.12, () => { addFx({ type: 'ring', x: P.x, y: P.y, r: 30 + i * 22, dur: 0.5, col: '#3ad8ff' }); burst(P.x + Math.cos(a) * (20 + i * 18), P.y + Math.sin(a) * (14 + i * 12), 14, { sp: 70, up: 60, g: 160, life: 0.7, c: ['#e8fbff', '#5ad0ff', '#1a7ab0'] }); }); },
  z13: (P, a) => { for (const s of [-1, 1]) addFx({ type: 'slash', x: P.x + Math.cos(a) * 8, y: P.y + Math.sin(a) * 6, ang: a + s * 0.9, arc: 1.6, r: 30, dur: 0.28, col: 'rgba(230,250,255,0.95)' }); delayAct(0.14, () => burst(P.x + Math.cos(a) * 24, P.y + Math.sin(a) * 16, 16, { sp: 60, up: 20, g: 60, life: 0.5, c: ['#ffffff', '#9ae8ff', '#c03040'] })); },
  i16: (P, a) => { addFx({ type: 'slash', x: P.x, y: P.y, ang: a, arc: 3.6, r: 52, dur: 0.3, col: 'rgba(170,90,255,0.95)' }); delayAct(0.2, () => burst(P.x, P.y - 6, 22, { sp: 90, up: 40, g: 80, life: 0.7, c: ['#e0c0ff', '#9a50ff', '#3a1060'] })); },
  g4: (P, a) => { const x = P.x + Math.cos(a) * 26, y = P.y + Math.sin(a) * 18; addFx({ type: 'beam', x, y, dur: 0.4, col: '#fff2b0' }); delayAct(0.16, () => burst(x, y, 22, { sp: 80, up: 70, g: 120, life: 0.7, c: ['#ffffff', '#ffe080', '#d8a020'] })); },
  d9: (P) => { for (let i = 0; i < 6; i++) delayAct(i * 0.06, () => burst(P.x, P.y - 8, 3, { sp: 30, up: 40, g: -20, life: 0.6, c: ['#ffd040', '#ff80c0', '#80e0ff'] })); },
  a9: (P) => burst(P.x, P.y, 10, { sp: 50, up: 20, g: 80, life: 0.4, c: ['#c8b090', '#8a7a6a'] }),
};
{ const _us = useSkill; useSkill = nfxWrap(function (slot) {
  const P = G.P, id = P && P.slots[slot], cd0 = id ? (P.cds[id] || 0) : 0; const r = _us.apply(this, arguments);
  if (!id || !P || (P.cds[id] || 0) <= cd0) return r;   // no se lanzó
  const h = SK_HOP[id]; if (h) { P.hopT = 0; P.hopD = h[0]; P.hopH = h[1]; if (h[2]) setAnim(P, h[2]); }
  const ex = SK_EXTRA[id]; if (ex) { const a = Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]); try { ex(P, a); } catch (e) { } }
  return r; }); }
{ const _up = updatePlayer; updatePlayer = function (dt) { _up(dt); const P = G.P; if (!P || P.hopD === undefined) return; P.hopT += dt; const k = P.hopT / P.hopD; if (k >= 1) { P.z = 0; P.hopD = undefined; if (P.hopH >= 15) { addFx({ type: 'ring', x: P.x, y: P.y, r: 26, dur: 0.35, col: '#e0d0b0' }); } return; } P.z = Math.sin(k * Math.PI) * P.hopH; }; }
// arreglo: el online cortaba las armas y armaduras de tier 16-21 al tier 15 (los demás te veían con otro equipo)
cleanGear = function (g) { const o = {}; for (const k of ['weapon', 'head', 'body', 'legs', 'feet']) { const v = g && +g[k]; o[k] = isFinite(v) ? clamp(v | 0, 0, 26) : 0; } if (!o.weapon) o.weapon = 1; if (g && typeof g.ws === 'string' && typeof WS !== 'undefined' && WS[g.ws]) o.ws = g.ws; return o; };
