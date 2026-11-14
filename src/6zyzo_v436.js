// ================= v4.36: SUEÑOS, ALTURAS Y LEGADO =================
// Mundo de los Sueños (al dormir de madrugada: un Albor distorsionado con 3 pruebas y la tienda de Oniria), exploración
// vertical (puntos de escalada en los acantilados, puentes de hielo y las Profundidades bajo cada cueva) y legado familiar
// (hijos adultos con oficio, boda, casa propia en un pueblo con marca en el mapa, nietos e historias familiares).
SAVEKEYS.push('drm', 'leg');

// =====================================================================================
// MUNDO DE LOS SUEÑOS
// =====================================================================================
it('hierba_sueno', { n: L2('Hierba del sueño', 'Dream herb'), t: 'mat', stack: true, tier: 3, price: 300, icon: ['herb', 5] });
it('polvo_sueno', { n: L2('Polvo de sueño', 'Dream dust'), t: 'mat', stack: true, tier: 5, price: 80, icon: ['crystal', '#c8a0ff'] });
it('acc_sonador', { n: L2('Amuleto del Soñador', 'Dreamer\'s Amulet'), t: 'acc', slot: 'acc', lv: 40, hpB: 300, def: 20, mpB: 100, price: 6000, icon: ['ring', 3], rar: 3 });
const DRM_SHOP = [['elixir', 6], ['pocion4', 3], ['ax_sabio', 4], ['hierba_sueno', 2], ['eter4', 3]];
function drm() { const P = G.P; const o = P.drm = P.drm || {}; return o; }
let SUENO = null;
function dreamOk() { const h = ((G.time || 0) % 1440) / 60, o = drm(); return (h >= 22 || h < 4) && o.day !== calDay(); }
{ const _sh = sleepHome; sleepHome = function () { const P = G.P; if (dreamOk() && (countItem('hierba_sueno') > 0 || Math.random() < 0.3)) { if (countItem('hierba_sueno') > 0) takeItem('hierba_sueno', 1); closeDialog(); dreamEnter(); return; } return _sh.apply(this, arguments); }; }
function makeDream() {
  if (G.maps.sueno) return G.maps.sueno; const W = G.world, t = TOWNS.find(t => t.k === 'albor'), x0 = t.x0 - 8, y0 = t.y0 - 6, w = (t.x1 - t.x0) + 17, h = (t.y1 - t.y0) + 13, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'sueno', w, h, ter: new Uint8Array(N), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0.32, music: 'cave', I, camps: [], dream: 1, noSave: 1 };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sx = x0 + (w - 1 - x), sy = y0 + y, j = W.I(sx, sy), i = I(x, y); let tt = W.inb(sx, sy) ? W.ter[j] : T.VOID; if (tt === T.STAIRS || tt === T.BRIDGE) tt = T.COBBLE; M.ter[i] = tt; M.lvl[i] = W.inb(sx, sy) ? W.lvl[j] : 0; M.reg[i] = W.inb(sx, sy) ? W.reg[j] : 0; if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) M.ter[i] = T.VOID; }
  // aplana los desniveles para que todo sea accesible
  for (let i = 0; i < N; i++) { if (M.ter[i] === T.FACE) M.ter[i] = T.DUSK; M.lvl[i] = 0; }
  prepPalettes(M); initMapObjs(M);
  const keep = new Set(['tree', 'rock', 'bush', 'flower', 'fountain', 'well', 'lamp', 'lantern', 'bench', 'crate', 'barrel']);
  for (const o of W.objs) { if (o.tx < x0 || o.ty < y0 || o.tx >= x0 + w || o.ty >= y0 + h) continue; const nx = w - 1 - (o.tx - x0), ny = o.ty - y0;
    if (o.k === 'bld') { const i = I(nx, ny); if (M.objAt[i] < 0) addObj(M, 'furn', nx, ny, { f: 'dr_casa', v: (o.tx + o.ty) % 3, fp: [[0, 0], [-1, 0], [1, 0]] }); continue; }
    if (!keep.has(o.k) || (o.fp && o.fp.length > 1)) continue; const i = I(nx, ny); if (i < 0 || i >= N || M.objAt[i] >= 0) continue; const c = Object.assign({}, o); delete c.id; delete c.fp; c.tx = nx; c.ty = ny; c.px = nx * 16 + 8; c.py = ny * 16 + 14; addObj(M, o.k, nx, ny, c); }
  const cx = w >> 1, cy = h >> 1, put = (f, x, y, o) => putNear(M, f, x, y, [[0, 0]], o);
  M.spawn = put('bed', cx, cy, { xact: 'dr_wake' }); put('dr_cristal', cx - 9, cy - 5, { xact: 'dr_trial', tr: 'mirror' }); put('dr_cristal', cx + 9, cy - 5, { xact: 'dr_trial', tr: 'echo' }); put('dr_cristal', cx, cy + 8, { xact: 'dr_trial', tr: 'shadow' });
  spawnNPC('oniria', (cx + 2) * 16 + 8, cy * 16 + 12, 'sueno', { face: 'down' }); G.maps.sueno = M; return M;
}
NPCS.oniria = { n: L2('Oniria', 'Oniria'), title: L2('Tejedora de Sueños', 'Dream Weaver'), look: LK({ hair: P5(['#2a1a4a', '#4a2a7a', '#6a4aa8', '#9a7ad0', '#c8a8f0']), hairStyle: 'long', outfit: 'robe', main: P5(['#1a1a3a', '#2a2a5a', '#3a3a8a', '#5a5ab0', '#8a8ad8']), sec: GOLD.slice(1) }), lines: [L2('Bienvenido al sueño. Aquí Albor está al revés… y tú también.', 'Welcome to the dream. Here Albor is backwards… and so are you.'), L2('Supera las pruebas de los cristales antes de despertar.', 'Pass the crystal trials before you wake.')] };
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'oniria') opts.unshift({ label: L2('Tienda de sueños', 'Dream shop'), icon: ['crystal', '#c8a0ff'], fn: () => { closeDialog(); drShop(); } }); });
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = C;
  if (kind === 'dr_casa') { const p = new Pix(48, 46), Wl = pal(['#2a1a4a', '#4a2a7a', '#6a4aa8']); p.poly([[6, 44], [8, 18], [42, 14], [44, 44]], Wl[1]); p.poly([[2, 20], [24, 2], [46, 16]], D('#1a3a5a')); for (const [x, y] of [[13, 26], [31, 24]]) { p.rect(x, y, 6, 7, D('#ffe08a')); p.set(x + 1, y + 1, D('#ffffff')); } p.rect(21, 32, 7, 12, Wl[0]); p.outline(D('#120a24')); return { c: p.canvas(), ax: 24, ay: 45, light: 1 }; }
  if (kind === 'dr_cristal') { const p = new Pix(20, 34), A = pal(['#4a2a8a', '#7a4ad0', '#b08aff', '#e8d8ff']); p.poly([[10, 1], [17, 12], [10, 31], [3, 12]], A[1]); p.poly([[10, 1], [13, 12], [10, 28]], A[2]); p.set(9, 6, A[3]); p.set(8, 8, A[3]); p.ell(10, 32, 6, 2, D('#2a1a4a')); p.outline(D('#140a28')); return { c: p.canvas(), ax: 10, ay: 33, light: 1 }; }
  if (kind === 'dr_espejo') { const p = new Pix(18, 30); p.rect(2, 2, 14, 26, D('#c8a050')); p.rect(4, 4, 10, 22, D('#a8d8f0')); p.line(5, 8, 9, 5, D('#ffffff')); p.outline(D('#2a1a08')); return { c: p.canvas(), ax: 9, ay: 29 }; }
  if (kind === 'dr_esquirla') { const p = new Pix(12, 14), A = pal(['#c8a0ff', '#ffffff']); p.poly([[6, 0], [11, 6], [6, 13], [1, 6]], A[0]); p.set(5, 4, A[1]); p.outline(D('#3a2a6a')); return { c: p.canvas(), ax: 6, ay: 13 }; }
  if (kind === 'cl_cuerda') { const p = new Pix(16, 34); p.vl(7, 0, 32, D('#c8a060')); p.vl(8, 0, 32, D('#a8803a')); for (let y = 4; y < 32; y += 6) p.hl(5, y, 6, D('#e8c880')); p.rect(5, 0, 6, 2, IRON[2]); p.outline(D('#2a1a08')); return { c: p.canvas(), ax: 8, ay: 33 }; }
  if (kind === 'cl_anclaje') { const p = new Pix(16, 14); p.rect(3, 6, 10, 6, IRON[1]); p.rect(6, 2, 4, 5, IRON[2]); p.vl(8, 10, 4, D('#c8a060')); p.outline(D('#1a1010')); return { c: p.canvas(), ax: 8, ay: 13 }; }
  if (kind === 'cl_hoyo') { const p = new Pix(30, 20); p.ell(15, 11, 14, 8, D('#3a2e24')); p.ell(15, 11, 11, 6, D('#0a0604')); p.vl(15, 3, 9, D('#c8a060')); p.rect(13, 1, 5, 3, WOOD[3]); p.outline(D('#120a04')); return { c: p.canvas(), ax: 15, ay: 18 }; }
  return _ge.apply(this, arguments); }; }
function dreamEnter() {
  const P = G.P, M = makeDream(), o = drm(); o.day = calDay(); SUENO = { t: 0, dur: 480, done: {}, ret: { m: G.map.id, x: P.x, y: P.y }, echo: null, shadow: null };
  for (const ob of M.objs) if (ob.xact === 'dr_trial') ob.used = 0;
  transition(() => { P.inside = null; setMap(M, M.spawn.px, M.spawn.py + 18, 'down'); banner(L2('Mundo de los Sueños', 'Dream World'), L2('Albor, pero no como lo recuerdas', 'Albor, but not as you remember it')); sfx('buff');
    if (!o.seen) { o.seen = 1; toast(L2('Estás soñando. Supera las 3 pruebas de los cristales y despierta en la cama antes de 8 minutos.', 'You are dreaming. Pass the 3 crystal trials and wake in the bed within 8 minutes.'), 'info', 7); } });
}
function dreamWake(early) {
  const P = G.P, R = SUENO && SUENO.ret; if (!SUENO) return; SUENO = null; for (const e of G.ents) if (e.map === 'sueno' && e.type === 'mob') e.remove = true;
  transition(() => { const M = HOUSES[R.m] ? makeInterior(R.m) : (G.maps[R.m] || G.world); P.inside = HOUSES[R.m] ? R.m : P.inside; setMap(M, R.x, R.y, 'down'); P.hp = P.S.maxhp; P.mp = P.S.maxmp; G.time = 7 * 60; toast(early ? L2('Despiertas descansado. Vida y maná al máximo.', 'You wake up rested. HP and mana full.') : L2('El sueño se desvanece… Despiertas en tu cama.', 'The dream fades… You wake up in your bed.'), 'quest'); saveGame(true); });
}
XACT.dr_wake = [L2('Despertar', 'Wake up'), 'talk', () => dreamWake(true)];
XACT.dr_trial = [o => o.used ? L2('Cristal apagado', 'Dim crystal') : { mirror: L2('Prueba de los Espejos', 'Mirror Trial'), echo: L2('Prueba de los Ecos', 'Echo Trial'), shadow: L2('Prueba de tu Sombra', 'Shadow Trial') }[o.tr], 'star', o => drTrial(o)];
function drReward(k) { const P = G.P; SUENO.done[k] = 1; const n = 3 + Math.floor(Math.random() * 3); giveItem('polvo_sueno', n); gainXp(Math.round(xpToNext(P.lv) * 0.1)); sfx('level'); banner(L2('¡Prueba superada!', 'Trial passed!'), '+' + n + ' ' + L2('polvo de sueño', 'dream dust'));
  if (SUENO.done.mirror && SUENO.done.echo && SUENO.done.shadow) { const o = drm(); o.all = (o.all || 0) + 1; if (!o.amu) { o.amu = 1; giveItem('acc_sonador', 1); toast(L2('¡Has superado las tres pruebas! Oniria te regala el Amuleto del Soñador.', 'You passed all three trials! Oniria gives you the Dreamer\'s Amulet.'), 'quest', 6); } } markDirty(); }
function drTrial(o) {
  if (o.used || !SUENO) return; const P = G.P, M = G.map;
  if (o.tr === 'mirror') { const ok = Math.floor(Math.random() * 4), clues = [L2('La verdadera no te mira', 'The true one does not look at you'), L2('La verdadera tiembla al acercarte', 'The true one trembles as you approach'), L2('La verdadera está fría', 'The true one is cold')]; o.used = 1;
    openModal(`<h2>🪞 ${L2('Prueba de los Espejos', 'Mirror Trial')}</h2><p class="hint">${L2('Cuatro espejos, una sola salida. Pista de Oniria', 'Four mirrors, a single way out. Oniria\'s hint')}: «${esc(pick(clues))}».</p><div class="row">${[0, 1, 2, 3].map(i => `<button class="btn" data-dm="${i}" style="height:4.5em;${i === ok ? 'animation:none' : ''}">🪞 ${i + 1}${i === ok ? '<br><small style="opacity:.55">❄</small>' : ''}</button>`).join('')}</div>`, 'party');
    $$('#modal [data-dm]').forEach(b => b.onclick = () => { closeModal(); if (+b.dataset.dm === ok) drReward('mirror'); else { P.hp = Math.max(1, P.hp - P.S.maxhp * 0.2); toast(L2('El espejo se rompe en mil pedazos. La prueba se apaga.', 'The mirror shatters into a thousand pieces. The trial goes dark.'), 'warn'); sfx('hurt'); } }); return; }
  if (o.tr === 'echo') { o.used = 1; SUENO.echo = { t: 45, left: [] }; for (let k = 0; k < 6; k++) { const a = Math.random() * 6.28, r = 5 + Math.random() * 8; const s = putNear(M, 'dr_esquirla', Math.round(o.tx + Math.cos(a) * r), Math.round(o.ty + Math.sin(a) * r), [[0, 0]], { solid: false }); if (s) { s.solid = false; M.solidO[M.I(s.tx, s.ty)] = 0; SUENO.echo.left.push(s); } }
    toast(L2('¡Recoge las 6 esquirlas de eco antes de 45 segundos!', 'Collect the 6 echo shards within 45 seconds!'), 'quest', 4); return; }
  if (o.tr === 'shadow') { o.used = 1; const m = spawnMob('bandido', P.lv, o.px, o.py + 30, 0, null, false); if (!m) return; m.elite = 0; m.role = null; m.map = 'sueno'; m.shadow = 1; m.name = L2('Sombra de ', 'Shadow of ') + P.name; m.hp = m.maxhp = Math.round(m.maxhp * 2.5); m.atk = Math.round(m.atk * 1.2); m.state = 'chase'; m.aggroR = 400; m.xp = 0; SUENO.shadow = m; banner(m.name, L2('Derrota a tu propia sombra', 'Defeat your own shadow')); sfx('boss'); }
}
function drShop() { const P = G.P;
  openModal(`<h2>✨ ${L2('Tienda de sueños', 'Dream shop')}</h2><p class="hint">${L2('Polvo de sueño', 'Dream dust')}: ${countItem('polvo_sueno')}. ${L2('La Hierba del sueño te asegura soñar si duermes de madrugada (22:00-4:00).', 'Dream herb guarantees a dream if you sleep late at night (22:00-4:00).')}</p><div class="slist">${DRM_SHOP.filter(([id]) => ITEMS[id]).map(([id, c]) => `<div class="srow">${iconHTML(ITEMS[id].icon, 28)}<div class="sn"><b>${esc(ITEMS[id].n)}</b></div><button class="btn sm" data-ds="${id}" ${countItem('polvo_sueno') >= c ? '' : 'disabled'}>${c} ✨</button></div>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('#modal [data-ds]').forEach(b => b.onclick = () => { const [id, c] = DRM_SHOP.find(x => x[0] === b.dataset.ds); if (countItem('polvo_sueno') < c) return; if (giveItem(id, 1)) { takeItem('polvo_sueno', c); sfx('coin'); } drShop(); }); }
let drT = 0; V33_TICKS.push(dt => { if (!SUENO || !G.P) return; dt = dt || 0; const P = G.P; SUENO.t += dt;
  if (G.map && G.map.id === 'sueno') SUENO.in = 1; else { if (SUENO.in) SUENO = null; return; }
  const E = SUENO.echo; if (E) { E.t -= dt; for (const s of E.left.slice()) if (!s.hidden && dist2(s.px, s.py - 6, P.x, P.y) < 18 * 18) { s.hidden = true; E.left = E.left.filter(x => x !== s); sfx('coin'); floatText(s.px, s.py - 20, (6 - E.left.length) + '/6', '#c8a0ff'); }
    if (!E.left.length) { SUENO.echo = null; drReward('echo'); } else if (E.t <= 0) { for (const s of E.left) s.hidden = true; SUENO.echo = null; toast(L2('Los ecos se desvanecen. Prueba fallida.', 'The echoes fade. Trial failed.'), 'warn'); } }
  if (SUENO.shadow && (SUENO.shadow.dying || SUENO.shadow.remove)) { const won = SUENO.shadow.hp <= 0; SUENO.shadow = null; if (won) drReward('shadow'); }
  if (P.dead && SUENO) { P.dead = false; P.hp = 1; dreamWake(false); return; }
  if (SUENO.t > SUENO.dur) dreamWake(false);
  drT += dt; if (drT > 1 && SUENO.dur - SUENO.t < 60 && SUENO.dur - SUENO.t > 59) toast(L2('El sueño empieza a desvanecerse… (1 minuto)', 'The dream begins to fade… (1 minute)'), 'warn'); });
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || !M.dream) return; ctx.fillStyle = 'rgba(90,40,160,0.18)'; ctx.fillRect(0, 0, VW, VH);
  for (let k = 0; k < 26; k++) { const x = (hash2(k, 1, 9) * VW + G.t * (6 + k % 5)) % VW, y = (hash2(k, 2, 9) * VH - G.t * (4 + k % 3) * 2 + VH * 10) % VH; ctx.fillStyle = k % 3 ? 'rgba(220,200,255,0.7)' : 'rgba(255,240,180,0.7)'; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); }
  if (SUENO) { const left = Math.max(0, SUENO.dur - SUENO.t); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(VW / 2 - 46, 6, 92, 14); ctx.fillStyle = '#e8d8ff'; ctx.font = '10px monospace'; ctx.textAlign = 'center'; ctx.fillText('☾ ' + Math.floor(left / 60) + ':' + String(Math.floor(left % 60)).padStart(2, '0') + (SUENO.echo ? '  ✦' + (6 - SUENO.echo.left.length) + '/6 ' + Math.ceil(SUENO.echo.t) + 's' : ''), VW / 2, 16); ctx.textAlign = 'left'; } });
// la sombra se dibuja oscura
{ const _de = drawEnt; drawEnt = function (e) { if (e && e.shadow) { ctx.save(); ctx.filter = 'brightness(0.25) saturate(0)'; try { return _de.apply(this, arguments); } finally { ctx.restore(); } } return _de.apply(this, arguments); }; }
if (typeof PV_RUM !== 'undefined') PV_RUM.push(['Dicen que quien duerme de madrugada sueña con un Albor al revés.', 'They say whoever sleeps late at night dreams of a backwards Albor.']);

// =====================================================================================
// EXPLORACIÓN VERTICAL: escalada, puentes de hielo y las Profundidades
// =====================================================================================
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  const spots = [], far = (x, y) => spots.every(s => Math.abs(s[0] - x) + Math.abs(s[1] - y) > 22), walk = i => !SOLID_T[W.ter[i]] && W.ter[i] !== T.STAIRS && W.objAt[i] < 0 && W.ter[i] !== T.BRIDGE;
  for (let y = 3; y < W.h - 6 && spots.length < 40; y += 1) for (let x = 3; x < W.w - 3 && spots.length < 40; x += 3) { const i = W.I(x, y); if (W.ter[i] !== T.FACE || W.ter[W.I(x, y - 1)] === T.FACE) continue;
    let y1 = y; while (y1 < y + 5 && W.ter[W.I(x, y1 + 1)] === T.FACE) y1++; if (y1 - y > 3) continue; const top = W.I(x, y - 1), bot = W.I(x, y1 + 1);
    if (!walk(top) || !walk(bot) || W.lvl[top] <= W.lvl[bot] || !far(x, y)) continue; if (TOWNS.some(t => x >= t.x0 - 2 && x <= t.x1 + 2 && y >= t.y0 - 2 && y <= t.y1 + 2)) continue;
    spots.push([x, y]); addObj(W, 'furn', x, y1 + 1, { f: 'cl_cuerda', xact: 'cl_up', to: [x, y - 1], solid: false }); W.solidO[bot] = 0; addObj(W, 'furn', x, y - 1, { f: 'cl_anclaje', xact: 'cl_down', to: [x, y1 + 1], solid: false }); W.solidO[top] = 0; } }; }
XACT.cl_up = [L2('Escalar', 'Climb'), 'run', o => clClimb(o, -1)];
XACT.cl_down = [L2('Descender por la cuerda', 'Rope down'), 'run', o => clClimb(o, 1)];
let CLIMB = null;
function clClimb(o, dir) { const P = G.P; if (CLIMB || P.dead || P.mount) { if (P.mount) toast(L2('Baja de la montura para escalar', 'Dismount to climb'), 'warn'); return; } const tx = o.to[0] * 16 + 8, ty = o.to[1] * 16 + (dir < 0 ? 10 : 8); CLIMB = { x0: P.x, y0: P.y, x1: tx, y1: ty, t: 0, dur: Math.max(0.8, Math.abs(ty - P.y) / 40), dir }; P.dir = dir < 0 ? 'up' : 'down'; sfx('dash'); }
{ const _up = updatePlayer; updatePlayer = function (dt) { if (CLIMB && G.P) { const P = G.P, C_ = CLIMB; C_.t += dt; const k = Math.min(1, C_.t / C_.dur); P.x = C_.x0 + (C_.x1 - C_.x0) * k; P.y = C_.y0 + (C_.y1 - C_.y0) * k; P.z = Math.sin(k * Math.PI) * 3; setAnim(P, 'walk'); stepAnim(P, dt, 6); if (Math.random() < 0.1) burst(P.x, P.y, 2, { sp: 20, up: 10, g: 120, life: 0.4, c: '#8a7a64' });
    if (k >= 1) { CLIMB = null; P.z = 0; const i = tileAt(G.map, Math.floor(P.x / 16), Math.floor(P.y / 16)); if (i >= 0) P.L = G.map.lvl[i]; setAnim(P, 'idle'); G.P.climbs = (G.P.climbs || 0) + 1; if (G.P.climbs === 1) toast(L2('¡Has escalado! Hay puntos de escalada por los acantilados de todo el mundo: abren atajos y rutas nuevas.', 'You climbed! There are climbing spots on cliffs all over the world: they open shortcuts and new routes.'), 'quest', 5); } return; } return _up.apply(this, arguments); }; }
// ---------- puentes de hielo: una habilidad de hielo congela el agua delante de ti (25 s) ----------
const ICEB = new Map();
{ const _bf = blockedFor; blockedFor = function (M, tx, ty, L) { if (ICEB.size && M && M.isWorld) { const e = ICEB.get(ty * 4096 + tx); if (e && e > G.t) return false; } return _bf.apply(this, arguments); }; }
function iceBridge() { const P = G.P, M = G.map; if (!M || !M.isWorld) return; const [dx, dy] = DIRV[P.dir]; let x = Math.floor(P.x / 16), y = Math.floor(P.y / 16), n = 0, started = false;
  for (let s = 1; s <= 12; s++) { const xx = x + Math.round(dx) * s, yy = y + Math.round(dy) * s; const i = tileAt(M, xx, yy); if (i < 0) break; const t = M.ter[i]; if (t === T.WATER || t === T.DEEP) { started = true; ICEB.set(yy * 4096 + xx, G.t + 25); n++; } else if (started) break; else if (s > 2) break; }
  if (n) { floatText(P.x, P.y - 40, L2('¡Puente de hielo!', 'Ice bridge!'), '#c8f0ff'); sfx('ice'); } }
{ const _bdf = bldDrawFloors; bldDrawFloors = function (M, cx, cy) { _bdf.apply(this, arguments); if (!ICEB.size || !M || !M.isWorld) return; for (const [k, e] of ICEB) { if (e < G.t) { ICEB.delete(k); continue; } const x = k % 4096, y = Math.floor(k / 4096), sx = x * 16 - cx, sy = y * 16 - cy; if (sx < -16 || sy < -16 || sx > VW || sy > VH) continue;
    const a = e - G.t < 4 ? 0.4 + 0.3 * Math.sin(G.t * 12) : 0.85; ctx.fillStyle = `rgba(200,240,255,${a.toFixed(2)})`; ctx.fillRect(sx, sy, 16, 16); ctx.fillStyle = `rgba(255,255,255,${(a * 0.8).toFixed(2)})`; ctx.fillRect(sx + 2, sy + 3, 6, 1); ctx.fillRect(sx + 9, sy + 10, 5, 1); } }; }
// si el puente se derrite contigo encima, vuelves a la orilla
let icT = 0; V33_TICKS.push(dt => { icT += dt || 0; if (icT < 0.3 || !G.P || !G.map || !G.map.isWorld) return; icT = 0; const P = G.P, tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16), i = tileAt(G.map, tx, ty); if (i < 0) return; const t = G.map.ter[i];
  if ((t === T.WATER || t === T.DEEP) && !(ICEB.get(ty * 4096 + tx) > G.t) && !P.boat && !P.swim && P.lastDry) { P.x = P.lastDry[0]; P.y = P.lastDry[1]; toast(L2('El hielo se derrite: vuelves a la orilla.', 'The ice melts: you go back to shore.'), 'info'); }
  else if (t !== T.WATER && t !== T.DEEP) P.lastDry = [P.x, P.y]; });
{ const _us = useSkill; useSkill = function (slot) { const P = G.P, id = P && P.slots[slot], cd0 = id ? (P.cds[id] || 0) : 0; const r = _us.apply(this, arguments); if (id && (P.cds[id] || 0) > cd0 && SK[id] && SK[id].eff && /ice|frost|snow/.test(SK[id].eff.art || '')) iceBridge(); return r; }; }
// ---------- las Profundidades: un pozo con cuerda en cada cueva baja a 5 niveles más difíciles ----------
const DEEP_MAX = 5;
function deepId(base, d) { return 'prof_' + base + '_' + d; }
function deepDef(base, d) { const id = deepId(base, d); if (CAVES[id]) return id; const B = CAVES[base]; CAVES[id] = Object.assign({}, B, { n: B.n + ' · ' + L2('Profundidad ', 'Depth ') + d, lv: [B.lv[0] + d * 8, B.lv[1] + d * 8], dark: Math.min(0.9, (B.dark || 0.6) + d * 0.05), seed: B.seed + d * 977, ores: B.ores.map(([t, n]) => [Math.min(11, t + Math.ceil(d / 2)), n + d]), deep: d, deepBase: base, d: L2('Cada nivel de las Profundidades es más oscuro y peligroso… y más rico.', 'Each level of the Depths is darker and more dangerous… and richer.') }); return id; }
{ const _mc = makeCave; makeCave = function (id) { const fresh = !G.maps[id], M = _mc.apply(this, arguments); const D = CAVES[id]; if (fresh && M && D && (D.deep || 0) < DEEP_MAX) { const base = D.deepBase || id, d = (D.deep || 0) + 1, c = M.bossAt || [M.w >> 1, M.h >> 1]; putNear(M, 'cl_hoyo', c[0] + 3, c[1] + 3, [[0, 0]], { xact: 'deep_go', base, d }); }
    if (fresh && M && D && D.deep) { putNear(M, 'tr_cofre', (M.w >> 1) + 3, M.h - 9, [[0, 0]], { xact: 'deep_chest', did: id }); M.depth = D.deep; } return M; }; }
XACT.deep_go = [o => L2('Bajar a la profundidad ', 'Go down to depth ') + o.d, 'run', o => { const P = G.P, id = deepDef(o.base, o.d), D = CAVES[id]; if (P.lv < D.lv[0] - 15) { toast(L2('Es demasiado peligroso. Necesitas nivel ', 'Too dangerous. You need level ') + (D.lv[0] - 15), 'warn'); return; } const M = makeCave(id);
  transition(() => { setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); enterCaveBanner(id); }); }];
XACT.deep_chest = [L2('Cofre de las profundidades', 'Chest of the depths'), 'bag', o => { const P = G.P; P.deepC = P.deepC || {}; if (P.deepC[o.did] === calDay()) { toast(L2('Ya lo abriste hoy.', 'Already opened today.'), 'info'); return; } P.deepC[o.did] = calDay(); const d = (CAVES[o.did] || {}).deep || 1, g = Math.round(1500 * d * (1 + P.lv / 30)); P.gold += g; floatText(o.px, o.py - 30, '+' + fmt(g), '#ffd040'); giveItem('diamante', d); if (Math.random() < 0.2 * d) giveItem('elixir', 1); sfx('coin'); markDirty(true); }];
// el jefe de las profundidades es más fuerte
{ const _cs = caveSpawns; caveSpawns = function () { const r = _cs.apply(this, arguments); const M = G.map, rt = M && CAVE_RT[M.id]; if (M && M.depth && rt && rt.boss && !rt.boss.dScaled) { const b = rt.boss, k = 1 + M.depth * 0.3; b.dScaled = 1; b.hp = b.maxhp = Math.round(b.maxhp * k); b.atk = Math.round(b.atk * (1 + M.depth * 0.12)); b.xp = Math.round(b.xp * k); b.name += ' ' + '✦'.repeat(M.depth); } return r; }; }

// =====================================================================================
// LEGADO FAMILIAR
// =====================================================================================
const LEG_ADULT = 20;   // días del calendario para ser adulto
const LEG_JOBS = [['pesca', L2('Pescador/a', 'Fisher'), 'sardina'], ['tala', L2('Leñador/a', 'Woodcutter'), 'log1'], ['mineria', L2('Minero/a', 'Miner'), 'ore2'], ['herbo', L2('Herborista', 'Herbalist'), 'herb2'], ['cocina', L2('Cocinero/a', 'Cook'), 'pl_estofado'], ['comercio', L2('Comerciante', 'Trader'), null], ['alquimia', L2('Alquimista', 'Alchemist'), 'pocion2']];
const LEG_NAMES = { m: ['Iker', 'Mateo', 'Dante', 'Leo', 'Bruno', 'Thiago', 'Gael', 'Nico', 'Ulises', 'Ramiro'], f: ['Inti', 'Sofía', 'Alma', 'Vera', 'Luna', 'Mía', 'Ainhoa', 'Killa', 'Nara', 'Celeste'] };
function kidAdult(k) { return k && calDay() - (k.born || 0) >= LEG_ADULT; }
function legKidTown(k) { const d = k.house && G.world && G.world.doors.find(d => d.to === k.house); return d ? (TOWNS.find(t => d.x >= t.x0 && d.x <= t.x1 && d.y >= t.y0 && d.y <= t.y1) || {}).k || '' : ''; }
function legRandApp(g) { return { g, skin: Math.floor(Math.random() * 5), hair: pick(Object.keys(HAIRS)), eyes: pick(['cafe', 'azul', 'verde', 'gris']), hs: Math.floor(Math.random() * 15), top: [Math.floor(Math.random() * 3), pick(CLOTH_ORDER)], bot: [g === 'f' ? pick([0, 2]) : pick([0, 1]), pick(CLOTH_ORDER)], shoe: [0, 'marron'] }; }
function legMix(A, B, g) { A = normApp(A); B = normApp(B); const r = () => Math.random() < 0.5; return { g, skin: [A.skin, B.skin, Math.round((A.skin + B.skin) / 2)][Math.floor(Math.random() * 3)], hair: r() ? A.hair : B.hair, eyes: r() ? A.eyes : B.eyes, hs: Math.floor(Math.random() * 15), top: [Math.floor(Math.random() * 3), pick(CLOTH_ORDER)], bot: [g === 'f' ? pick([0, 2]) : pick([0, 1]), pick(CLOTH_ORDER)], shoe: [0, 'marron'] }; }
// un hijo adulto casado vive en su casa: no aparece en la tuya
{ const _hf = homeFamily; homeFamily = function (M) { const P = G.P, keep = P.kids; P.kids = (keep || []).filter(k => !k.house); try { return _hf.apply(this, arguments); } finally { P.kids = keep; } }; }
// panel del hijo: oficio, boda, casa, nietos
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); const k = e && e.kid; if (!k || e.fam || !(G.P.kids || []).includes(k)) return r; const body = $('#mbody'); if (!body) return r;
    const box = document.createElement('div'); box.className = 'legBox';
    if (!kidAdult(k)) { box.innerHTML = `<p class="hint">👪 ${L2('Será adulto dentro de', 'Will be an adult in')} ${Math.max(0, LEG_ADULT - (calDay() - (k.born || 0)))} ${L2('días: podrá aprender un oficio, casarse y tener su propia casa.', 'days: they can learn a job, marry and have their own home.')}</p>`; }
    else { const J = LEG_JOBS.find(j => j[0] === k.ljob), sp = k.spouse;
      box.innerHTML = `<h3>👪 ${L2('Vida adulta', 'Adult life')}</h3>
        <div class="srow"><div class="sn"><b>${L2('Oficio', 'Job')}: ${J ? esc(J[1]) : L2('ninguno', 'none')}</b><small>${L2('Cada día deja algo de su oficio en tu buzón de casa.', 'Every day they leave something from their job in your home mailbox.')}</small></div><button class="btn sm" id="lgJob">${L2('Elegir', 'Choose')}</button></div>
        <div class="srow"><div class="sn"><b>${sp ? '💍 ' + L2('Casado/a con ', 'Married to ') + esc(sp.name) : L2('Soltero/a', 'Single')}</b><small>${sp ? (k.house ? L2('Vive en ', 'Lives in ') + esc(townName(legKidTown(k))) + ' · ' + L2('marcado en el mapa', 'marked on the map') : '') : L2('Puedes presentarle a alguien y organizar la boda.', 'You can introduce them to someone and arrange the wedding.')}</small><small>${(k.gkids || []).length ? '👶 ' + L2('Nietos', 'Grandchildren') + ': ' + k.gkids.map(g => esc(g.name)).join(', ') : ''}</small></div>${sp ? '' : `<button class="btn gold sm" id="lgWed">${L2('Buscar pareja', 'Find a partner')}</button>`}</div>`; }
    body.appendChild(box);
    const on = (s, f) => { const b = $(s); if (b) b.onclick = f; };
    on('#lgJob', () => { openModal(`<h2>${L2('Oficio de ', 'Job for ') + esc(k.name)}</h2><div class="slist">${LEG_JOBS.map(j => `<div class="srow"><div class="sn"><b>${esc(j[1])}</b><small>${j[2] && ITEMS[j[2]] ? L2('Trae: ', 'Brings: ') + esc(ITEMS[j[2]].n) : L2('Trae oro', 'Brings gold')}</small></div><button class="btn sm" data-lj="${j[0]}">${L2('Aprender', 'Learn')}</button></div>`).join('')}</div>`, 'party');
      $$('#modal [data-lj]').forEach(b => b.onclick = () => { k.ljob = b.dataset.lj; closeModal(); toast(k.name + L2(' aprende el oficio. ¡Qué orgullo!', ' learns the job. So proud!'), 'quest'); markDirty(true); }); });
    on('#lgWed', () => legMatch(k));
    return r; }; }
function legMatch(k) { const g = k.g === 'f' ? 'm' : 'f', C_ = [0, 1, 2].map(() => { const gg = Math.random() < 0.85 ? g : k.g; return { name: pick(LEG_NAMES[gg]), g: gg, app: legRandApp(gg), town: pick(PV_TOWNS || ['albor']) }; });
  openModal(`<h2>💞 ${L2('Pareja para ', 'A partner for ') + esc(k.name)}</h2><p class="hint">${L2('Tres vecinos quieren conocer a tu hijo/a. Elige con quién organizar la boda (cuesta 5.000 de oro).', 'Three villagers want to meet your child. Choose who to arrange the wedding with (costs 5,000 gold).')}</p><div class="slist">${C_.map((c, i) => `<div class="srow"><div class="sn"><b>${esc(c.name)}</b><small>${esc(townName(c.town))}</small></div><button class="btn sm" data-lw="${i}">${L2('Boda', 'Wedding')}</button></div>`).join('')}</div>`, 'party');
  $$('#modal [data-lw]').forEach(b => b.onclick = () => { const P = G.P; if (P.gold < 5000) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= 5000; const c = C_[+b.dataset.lw]; k.spouse = { name: c.name, g: c.g, app: c.app, id: 'sp' + Date.now().toString(36) };
    const used = new Set(Object.keys(P.homes || {}).concat((P.kids || []).map(x => x.house).filter(Boolean))), t = TOWNS.find(t => t.k === c.town) || TOWNS[0];
    const doors = G.world.doors.filter(d => HOUSES[d.to] && !used.has(d.to)); doors.sort((a, b) => dist2(a.x, a.y, (t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2) - dist2(b.x, b.y, (t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2)); if (doors[0]) k.house = doors[0].to;
    closeModal(); banner('💍 ' + k.name + ' & ' + c.name, L2('¡Se han casado! Vivirán en ', 'They got married! They will live in ') + townName(legKidTown(k) || c.town)); sfx('level'); for (let q = 0; q < 30; q++) part(P.x + (Math.random() - 0.5) * 60, P.y - Math.random() * 40, { vz: 30, g: -10, life: 1.4, c: ['#ff8ab0', '#ffffff', '#ffd040'][q % 3], s: 2 });
    if (typeof pvLog === 'function') pvLog(L2('Boda: ', 'Wedding: ') + k.name + ' (' + L2('hijo/a de ', 'child of ') + P.name + ') ' + L2('y ', 'and ') + c.name + '.', c.town, 'good'); k.wedDay = calDay(); k.follow = false; markDirty(true); }); }
// cada día: oficio de los hijos, nietos y pequeñas historias familiares
{ const _nd = newDay; newDay = function () { const r = _nd.apply(this, arguments); try { legDay(); } catch (e) { console.warn(e); } return r; }; }
function legDay() { const P = G.P; if (!P || !P.kids) return; const o = P.leg = P.leg || {}; o.box = o.box || [];
  for (const k of P.kids) { if (!kidAdult(k)) continue; const J = LEG_JOBS.find(j => j[0] === k.ljob); if (J) o.box.push(J[2] ? [J[2], 1 + Math.floor(Math.random() * 3), k.name] : ['gold', Math.round(300 * (1 + P.lv / 30)), k.name]);
    if (k.spouse && (k.gkids || []).length < 2 && calDay() - (k.wedDay || 0) >= 5 && Math.random() < 0.25) { k.gkids = k.gkids || []; const g = Math.random() < 0.5 ? 'f' : 'm', nm = pick(LEG_NAMES[g]); k.gkids.push({ id: 'g' + Date.now().toString(36) + k.gkids.length, name: nm, g, app: legMix(k.app, k.spouse.app, g), born: calDay() }); banner('👶 ' + L2('¡Eres abuelo/a!', 'You are a grandparent!'), k.name + L2(' ha tenido a ', ' had ') + nm); sfx('level'); } }
  o.box = o.box.slice(-30);
  if (!o.story && Math.random() < 0.35) legStory(); markDirty(); }
// buzón: lo recoges al entrar en tu casa
{ const _hf = homeFamily; homeFamily = function (M) { const r = _hf.apply(this, arguments); const o = G.P.leg; if (o && o.box && o.box.length) { const B = o.box; o.box = []; const names = new Set(); for (const [id, n, who] of B) { names.add(who); if (id === 'gold') G.P.gold += n; else if (ITEMS[id]) giveItem(id, n, true); } toast('📬 ' + L2('Tus hijos te han dejado regalos en el buzón: ', 'Your kids left gifts in the mailbox: ') + [...names].join(', '), 'loot', 6); markDirty(true); } return r; }; }
// la casa del hijo: él, su pareja y los nietos
{ const _sm = setMap; setMap = function (M) { const r = _sm.apply(this, arguments); try { const P = G.P; for (const e of G.ents) if (e.fam && e.map !== (M && M.id)) e.remove = true;
    const k = M && (P.kids || []).find(k => k.house === M.id); if (k) { const cx = (M.w >> 1) * 16, cy = ((M.h >> 1) - 1) * 16; const mk = (kk, dx, dy, sc) => { const e = kidEnt(kk, M.id, cx + dx, cy + dy); e.fam = 1; e.famOf = k; if (sc) e.scale = sc; return e; };
      if (!k.follow) mk(k, -16, 0, 1); if (k.spouse) mk({ id: k.spouse.id, name: k.spouse.name, g: k.spouse.g, app: k.spouse.app, born: -999, cls: 'guerrero', equip: {} }, 16, 0, 1);
      toast('🏠 ' + L2('Casa de ', 'Home of ') + k.name + (k.spouse ? ' & ' + k.spouse.name : ''), 'info'); } } catch (e) { console.warn(e); } return r; }; }
{ const _ki = doInteract; doInteract = function (it) { it = it || interactTarget(); if (it && it.kind === 'npc' && it.e && it.e.fam && it.e.kid !== it.e.famOf) { const e = it.e; e.chat = pick([L2('¡Qué alegría verte!', 'So happy to see you!'), L2('Quédate a cenar, he hecho ceviche.', 'Stay for dinner, I made ceviche.'), L2('¿Me cuentas una aventura?', 'Will you tell me an adventure?'), L2('¡Abuelo/a!', 'Grandpa/Grandma!')]); e.chatT = G.t; sfx('ui'); return; } return _ki.apply(this, arguments); }; }
// marca de la casa del hijo en el mapa
MAPC.kidhome = [L2('Casa de tus hijos', 'Your kids\' home'), 'Your kids\' home', '#ff9ad8', 'house'];
{ const _wp = worldPOI; worldPOI = function () { const out = _wp.apply(this, arguments); const P = G.P; for (const k of P.kids || []) { if (!k.house) continue; const d = G.world.doors.find(d => d.to === k.house); if (d) { for (let i = out.length - 1; i >= 0; i--) if (out[i].x === d.x && out[i].y === d.y) out.splice(i, 1); out.push({ c: 'kidhome', x: d.x, y: d.y, t: L2('Casa de ', 'Home of ') + k.name + (k.spouse ? ' & ' + k.spouse.name : '') }); } } return out; }; }
// historias familiares: pequeñas misiones con flecha dorada
const LEG_ST = [
  ['pesca', L2('{n} quiere aprender a pescar: llévale al agua y pesca 3 peces con él/ella', '{n} wants to learn to fish: take them to the water and catch 3 fish together'), 'fish', 3],
  ['perdido', L2('{n} se ha perdido cerca de {w}. ¡Ve a buscarle!', '{n} got lost near {w}. Go find them!'), 'go', 1],
  ['cumple', L2('¡Es el cumpleaños de {n}! Regálale un plato cocinado por ti', 'It\'s {n}\'s birthday! Give them a dish you cooked'), 'dish', 1],
  ['monstruo', L2('{n} dice que hay un monstruo bajo su cama… derrota 10 enemigos para que se sienta seguro/a', '{n} says there is a monster under their bed… defeat 10 enemies so they feel safe'), 'kill', 10],
];
function legStory() { const P = G.P, o = P.leg, ks = (P.kids || []).filter(k => kidStage(k) >= 1); if (!ks.length) return; const k = pick(ks), S = pick(LEG_ST), w = pick(WAYSTONES.slice(0, 10));
  o.story = { k: k.id, s: S[0], n: 0, need: S[3], w: [w.x, w.y], wn: w.n }; toast('📖 ' + L2('Historia familiar: ', 'Family story: ') + legStTxt(), 'quest', 7); if (S[0] === 'perdido' && P.wp !== undefined) P.wp = { x: w.x, y: w.y, t: k.name, m: 'world' }; }
function legStTxt() { const P = G.P, o = P.leg && P.leg.story; if (!o) return ''; const k = (P.kids || []).find(k => k.id === o.k), S = LEG_ST.find(s => s[0] === o.s); return S[1].replace('{n}', k ? k.name : '?').replace('{w}', o.wn) + (o.need > 1 ? ' (' + o.n + '/' + o.need + ')' : ''); }
function legStProg(kind, n) { const P = G.P, o = P.leg && P.leg.story; if (!o) return; const S = LEG_ST.find(s => s[0] === o.s); if (!S || S[2] !== kind) return; o.n += n || 1; if (o.n >= o.need) { const k = (P.kids || []).find(k => k.id === o.k); P.leg.story = null; const g = Math.round(2000 * (1 + P.lv / 30)); P.gold += g; gainXp(Math.round(xpToNext(P.lv) * 0.15)); banner('📖 ' + L2('Historia familiar completada', 'Family story complete'), (k ? k.name : '') + ' ♥ +' + fmt(g) + ' ' + L2('oro', 'gold')); sfx('questdone'); if (k) k.love = (k.love || 0) + 1; } else toast('📖 ' + legStTxt(), 'info', 3); markDirty(); }
{ const _fc = fishCaught; fishCaught = function () { const r = _fc.apply(this, arguments); legStProg('fish', 1); return r; }; }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); if (m && m.type === 'mob') legStProg('kill', 1); return r; }; }
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P.inv[idx], I = s && ITEMS[s.id], o = P.leg && P.leg.story; if (I && I.plato && o && o.s === 'cumple') { takeItem(s.id, 1); legStProg('dish', 1); return; } return _ui.apply(this, arguments); }; }
let lgT = 0; V33_TICKS.push(dt => { lgT += dt || 0; if (lgT < 1) return; lgT = 0; const P = G.P, o = P && P.leg && P.leg.story; if (!o || o.s !== 'perdido' || !G.map || !G.map.isWorld) return; if (dist2(P.x / 16, P.y / 16, o.w[0], o.w[1]) < 6 * 6) { legStProg('go', 1); if (P.wp && P.wp.x === o.w[0]) P.wp = null; } });
// la historia familiar se ve en el panel de misiones como recordatorio
{ const st = document.createElement('style'); st.textContent = '.legBox{margin-top:.5em;border-top:1px solid rgba(255,255,255,.12);padding-top:.4em}'; document.head.appendChild(st); }
// la casa del hijo está amueblada y no se vende
function legKidOf(id) { const P = G.P; return P && (P.kids || []).find(k => k.house === id); }
{ const _mh = makeHome; makeHome = function (id) { const M = _mh.apply(this, arguments); if (M && legKidOf(id) && !homeCfg(id)) { for (const o of M.objs) if (o.f === 'salesign' || o.k === 'crate') { o.hidden = true; M.solidO[M.I(o.tx, o.ty)] = 0; }
    const F = (f, x, y, fp) => addObj(M, 'furn', x, y, { f, fp: fp || [[0, 0]] }); F('bed', 2, 3); F('table', 9, 6, [[0, 0], [1, 0]]); F('plant', 12, 2); F('bookshelf', 5, 2, [[0, 0], [1, 0]]); M.dark = 0.05; } return M; }; }
{ const _t = toast; toast = function (msg) { if (typeof msg === 'string' && /^¡Casa en venta|^House for sale/.test(msg) && G.map && legKidOf(G.map.id)) return; return _t.apply(this, arguments); }; }
