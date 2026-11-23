// ================= v5.81: TRANSFORMACIÓN ENGRANAJE 2 (vapor y piel roja pálida) =================
// Sergio aprobó la muestra (tools/art/muestras/muestra_vapor.js) y pidió: llamarla Engranaje 2, que se consiga con
// Shanks a nivel 600 (te dice si estás listo y te enfrentas a él, el enemigo más fuerte de momento). Shanks está en
// Villa Foosha, que sigue cerrada (hace falta la Fruta del Diablo), así que por ahora no se puede conseguir.
// Lore (LORE.md §33): al vencer a la Rueca Desbocada, el hilo del héroe aprende su giro desbocado (regla 30): late tan
// rápido que la sangre hierve y el vapor es la luz del hilo que se escapa. Shanks solo pone a prueba si lo controlas
// (escenario crossover, no cambia el canon).
// Dibujo: mitad = mejillas encendidas y un hilo de vapor; forma = piel roja pálida, mucho vapor y estela al correr.
// El vapor y la estela son efectos aparte (no tocan el sprite) y se ven también en los demás jugadores.
SAVEKEYS.push('vaporOk');
const VAP_LV = 600, SH_BOSS = 'dawn_shanks_boss';
const VAP_RED = C('#e8766c'), VAP_DEEP = C('#a03a3c');
const vapReady = () => { const P = G.P; return P && P.lv >= VAP_LV && (P.bossKills || {}).tj_rueca; };

// ---------- la forma ----------
SR.vapor = { n: L2('Engranaje 2', 'Gear 2'), f: L2('Engranaje 2', 'Gear 2'), ic: '♨', col: '#ff8a7a', cost: [['tj_engranaje', 3]], lv: VAP_LV,
  pas: L2('Mejillas encendidas y un hilo de vapor. +6 % de ataque, +6 % de velocidad y +4 % de vida. Engranaje 2: piel roja pálida, vapor que sale de todo el cuerpo y estela al correr, +45 % de ataque (la más fuerte, un poco por encima de las fusiones), +25 % de velocidad, +6 % de vida y +4 % de defensa. Con armas cuerpo a cuerpo, el brazo se estira con el arma y golpea a distancia. Nivel 600.', 'Flushed cheeks and a wisp of steam. +6% attack, +6% speed and +4% HP. Gear 2: pale red skin, steam rising from the whole body and an afterimage when running, +45% attack (the strongest, just above the fusions), +25% speed, +6% HP and +4% defence. With melee weapons, your arm stretches with the weapon and hits at range. Level 600.'),
  forms: () => [[1, L2('Engranaje 2', 'Gear 2')]],
  why: off => (G.P.lv < VAP_LV ? `<b>${L2('Requiere nivel ', 'Requires level ')}${VAP_LV}.</b> ` : '') + L2('Vence a la Rueca Desbocada (Tierras Tejidas) y a Shanks en Villa Foosha (aún cerrada: hace falta la Fruta del Diablo). Luego Shanks hace el ritual: ', 'Defeat the Runaway Spinning Wheel (Woven Lands) and Shanks in Foosha Village (still closed: the Devil Fruit is needed). Then Shanks performs the ritual: ') + off + '.' };
SRSK.vapor = ['srh1', 'srh2', 'srh3', 'srh4'];
for (const [id, n, cd, mp, icon, eff, d] of [
  ['srh1', L2('Puño Hirviente', 'Boiling Fist'), 3, 12, ['star', '#ff8a7a'], { k: 'vjet', m: 0.55, mr: 0.05 }, L2('Cinco puñetazos rapidísimos al frente: {m}% cada uno.', 'Five lightning-fast punches ahead: {m}% each.')],
  ['srh2', L2('Paso de Vapor', 'Steam Step'), 7, 16, ['dash', '#ffd8d0'], { k: 'phase', m: 1.8, mr: 0.15 }, L2('Desapareces en vapor y atraviesas a los enemigos: {m}% de daño.', 'You vanish into steam and pass through enemies: {m}% damage.')],
  ['srh3', L2('Lluvia de Puños', 'Rain of Fists'), 12, 28, ['star', '#ffb0a0'], { k: 'vrain', m: 0.4, mr: 0.04 }, L2('Diez golpes alrededor en un segundo: {m}% cada uno.', 'Ten hits around you in one second: {m}% each.')],
  ['srh4', L2('Estallido Hirviente', 'Boiling Burst'), 22, 40, ['star', '#ffffff'], { k: 'vburst', m: 2.8, mr: 0.2 }, L2('El vapor estalla: {m}% de daño alrededor y los enemigos quedan aturdidos 1 s.', 'The steam bursts: {m}% damage around you and enemies are stunned for 1 s.')]]) sk(id, 'sr_vapor', 0, 0, n, 'act', 1, null, { mp, cd, icon, eff, d, srk: eff.k, max: 10 });
{ const _sc = srCast; srCast = function (id) { const P = G.P, s = SK[id], e = s && s.eff; if (!e || !['vjet', 'vrain', 'vburst'].includes(e.k)) return _sc.apply(this, arguments);
  const r = P.skills[id] || 1, atk = P.S.atk * ((e.m || 1) + (e.mr || 0) * (r - 1)) * (1 + (P.S.skillP || 0) / 100), [dx, dy] = DIRV[P.dir] || [0, 1];
  setAnim(P, e.k === 'vburst' ? 'cast' : 'atk');
  if (e.k === 'vjet') { for (let k = 0; k < 5; k++) delayAct(0.07 * k, () => { const x = P.x + dx * 26, y = P.y - 6 + dy * 20; hitCircle(x, y, 26, atk); burst(x, y - 6, 5, { sp: 60, up: 20, g: 10, life: 0.3, c: ['#ffffff', '#ffd8d0'] }); sfx('swing'); }); }
  else if (e.k === 'vrain') { for (let k = 0; k < 10; k++) delayAct(0.1 * k, () => { const a = k * 2.4, x = P.x + Math.cos(a) * 34, y = P.y - 6 + Math.sin(a) * 24; hitCircle(x, y, 30, atk); burst(x, y, 4, { sp: 50, up: 20, g: 10, life: 0.3, c: ['#ffffff', '#ffb0a0'] }); if (k % 2) sfx('swing'); }); }
  else { P.busy = 0.4; delayAct(0.3, () => { hitCircle(P.x, P.y, 110, atk, { stun: 1 }); addFx({ type: 'ring', x: P.x, y: P.y, r: 110, dur: 0.5, col: '#ffd8d0' }); burst(P.x, P.y - 14, 40, { sp: 150, up: 60, g: 10, life: 1, c: ['#ffffff', '#f4eef0', '#ffb0a0'] }); G.shake = 4; sfx('boom'); }); } }; }
if (typeof FORM_POW !== 'undefined') FORM_POW.vapor = [['spd', 10, L2('Sangre que corre', 'Racing blood'), L2('+10 % de velocidad', '+10% speed')], ['crit', 6, L2('Golpe a destiempo', 'Off-beat strike'), L2('+6 de crítico', '+6 crit')], ['boss', 10, L2('Contra los más fuertes', 'Against the strongest'), L2('+10 % de daño a jefes', '+10% damage to bosses')]];
if (typeof KID_FORMS !== 'undefined') { const i = KID_FORMS.indexOf('vapor'); if (i >= 0) KID_FORMS.splice(i, 1); }
// fuerza (sobre tus estadísticas; no cuenta en duelos)
{ const _cs = calcStats; calcStats = function (P, ...a) { const S = _cs.call(this, P, ...a); if (!P || !S || P.sr !== 'vapor' || !srOk()) return S; const F = P.srF ? 1 : 0;
  S.atk = Math.round(S.atk * (F ? 1.45 : 1.06)); S.maxhp = Math.round(S.maxhp * (F ? 1.06 : 1.04)); S.def = Math.round(S.def * (F ? 1.04 : 1)); S.spd *= F ? 1.25 : 1.06;
  if (P.hp > S.maxhp) P.hp = S.maxhp; S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); P.S = S; return S; }; }
{ const _ts = transSet; transSet = function (f) { const r = _ts.apply(this, arguments); const P = G.P; if (P && P.sr === 'vapor' && P.srF) { burst(P.x, P.y - 14, 30, { sp: 70, up: 70, g: -10, life: 1, c: ['#ffffff', '#f4eef0', '#ffd8d0'] }); banner(SR.vapor.n, L2('+45 % de ataque y +25 % de velocidad', '+45% attack and +25% speed')); } return r; }; }
// solo se consigue con Shanks (después de vencerlo); en el ritual de Corvel sale bloqueada
{ const _sr = srRitual; srRitual = function () { const r = _sr.apply(this, arguments); try { const P = G.P, b = document.querySelector('#modal [data-sr="vapor"]'); if (b && !b.disabled && !(P.vaporOk && vapReady())) { b.disabled = true; b.textContent = '🔒 ' + L2('Vence a Shanks (nivel 600)', 'Defeat Shanks (level 600)'); b.onclick = null; } } catch (e) { } return r; }; }

// ---------- dibujo: piel, mejillas, vapor y estela ----------
{ const _hl = heroLook; heroLook = function (cls, app, gear, ...a) { const L = _hl.call(this, cls, app, gear, ...a); try { if (L && L.sr === 'vapor') { const st = L.srF ? 1 : 0, S0 = Array.from(L.skin).map(c => typeof c === 'string' ? C(c) : c), n = S0.length;
  L.skin = S0.map((c, i) => st ? uMix(c, i === 0 ? VAP_DEEP : VAP_RED, i === 0 ? 0.62 : i === n - 1 ? 0.45 : 0.66) : uMix(c, VAP_RED, 0.14)); } } catch (e) { } return L; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { const m = p.meta; if (L && L.sr === 'vapor' && m && !m.up && m.hrx !== undefined) { const ey = Math.round(m.ey) + 2, c = L.srF ? VAP_DEEP : VAP_RED, tg = p.tg; if (p.t) p.tg = 5;
  for (const x of m.side ? [m.eyes[0] - m.d] : [m.eyes[0] - 1, m.eyes[1] + 2]) { p.set(x, ey, c); p.set(x + 1, ey, c); } p.tg = tg; } } catch (e) { } return r; }; }
function vapState(e) { if (e.type === 'player' && e === G.P) return e.sr === 'vapor' ? (e.srF ? 1 : 0) : -1; if (e.type === 'remote' && e.gear && e.gear.sr === 'vapor') return e.gear.sf ? 1 : 0; return -1; }
// nubes de vapor en coordenadas del mundo (pies del personaje en e.x, e.y)
function vapSteam(e, cx, cy, st, front) { const d = e.dir, side = d === 'left' || d === 'right', sd = d === 'left' ? -1 : 1, X = e.x - cx, Y = e.y - cy - (e.z || 0), t = G.t + (e.vph || (e.vph = Math.random() * 9));
  const src = [[0, -34, 1.1, 0]]; if (side) src.push([-sd * 3, -22, 1, -sd], [sd, -17, 0.7, sd]); else src.push([-7, -23, 1, -1], [7, -23, 1, 1], [-9, -16, 0.7, -1], [9, -16, 0.7, 1]);
  const S = st ? src : src.slice(0, 3), N = st ? 6 : 3, life = st ? 1.1 : 1.7;
  S.forEach(([sx, sy, w, dx], si) => { for (let k = 0; k < N; k++) { if ((k + si) % 2 === (front ? 1 : 0)) continue; const ph = ((t / life) + k / N + si * 0.29) % 1;
    const r = (1.2 + ph * 3.2) * w * (st ? 1 : 0.75), x = sx + dx * ph * 4 + Math.sin(ph * 6 + si + k) * 1.2, y = sy - ph * (st ? 18 : 10), a = Math.pow(1 - ph, 1.4) * (st ? 0.8 : 0.5) * Math.min(1, ph / 0.1);
    if (a < 0.04) continue; const R = Math.max(1, Math.round(r));
    for (const [rr, aa, col] of [[R + 1, a * 0.45, '236,232,240'], [R, a, '255,250,250']]) { ctx.fillStyle = `rgba(${col},${aa.toFixed(3)})`; for (let yy = -rr; yy <= rr; yy++) { const w2 = Math.floor(Math.sqrt(rr * rr - yy * yy)); ctx.fillRect(Math.round(X + x - w2), Math.round(Y + y + yy), w2 * 2 + 1, 1); } } } }); }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { let st = -1; try { st = e && !e.dying ? vapState(e) : -1; } catch (er) { }
  if (st < 0) return _de.apply(this, arguments);
  try { // estela al correr (forma)
    const A = e.atlas; if (st && A && e.anim === 'walk' && !e.riding && !e.rd) { const a = A.idx.walk !== undefined ? 'walk' : 'idle', n = animN(e, a), col = A.idx[a] + Math.min(e.af, n - 1), row = DIRI[e.dir] || 0, [vx, vy] = DIRV[e.dir] || [0, 1];
      for (const [k, al] of [[2, 0.12], [1, 0.24]]) { ctx.globalAlpha = al; atlasBlit(ctx, A, col, row, Math.round(e.x - A.ax - cx - vx * 9 * k), Math.round(e.y - A.ay - cy - (e.z || 0) - vy * 7 * k), A.fw, A.fh); } ctx.globalAlpha = 1; }
    vapSteam(e, cx, cy, st, false); } catch (er) { ctx.globalAlpha = 1; }
  const r = _de.apply(this, arguments); try { vapSteam(e, cx, cy, st, true); } catch (er) { } return r; }; }

// ---------- Shanks: ¿estás listo? y el duelo ----------
BOSSES[SH_BOSS] = { n: L2('Shanks', 'Shanks'), lv: 600, art: ['hum', SH_BOSS], hp: 80, atk: 4.4, def: 4.0, spd: 66, r: 32, moves: ['charge', 'blink', 'slam', 'nova', 'sh_corte', 'sh_presion'], drops: [], where: L2('Villa Foosha (Dawn), al hablar con él a nivel 600', 'Foosha Village (Dawn), by talking to him at level 600') };
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'hum' && art[1] === SH_BOSS && typeof dawnLook === 'function') return getAtlas('Dawn:shanksBoss', () => { const L = dawnLook('dawn_shanks'); L.weapon = { k: 'sword', tier: 36 }; return buildAtlas(L, ['idle', 'walk', 'atk', 'hurt', 'dead'], drawHero); }); return _ma.apply(this, arguments); }; }
FAR.push('sh_corte', 'sh_presion'); NEAR.push('sh_presion');
{ const _bm = bossMove; bossMove = function (m, mv) { if (mv !== 'sh_corte' && mv !== 'sh_presion') return _bm.apply(this, arguments); const P = G.P, a = Math.atan2(P.y - m.y, P.x - m.x); setAnim(m, 'atk'); mobFace(m, P.x - m.x, P.y - m.y);
  if (mv === 'sh_corte') { telegraph({ shape: 'line', x: m.x, y: m.y, ang: a, len: 230, w: 26, dur: 0.7, cb: () => { const vx = P.x - m.x, vy = P.y - m.y, along = vx * Math.cos(a) + vy * Math.sin(a), perp = Math.abs(-vx * Math.sin(a) + vy * Math.cos(a)); if (along > 0 && along < 230 && perp < 15) hurtPlayer(m.atk * 2.1, { lv: m.lv }); burst(m.x + Math.cos(a) * 120, m.y + Math.sin(a) * 120, 18, { sp: 120, up: 20, g: 20, life: 0.5, c: ['#ffffff', '#c8e0ff'] }); } }); m.busyT = 0.9; }
  else { const r = 140; telegraph({ shape: 'circle', x: m.x, y: m.y, r, dur: 1.3, col: 'rgba(40,10,10,0.3)', cb: () => { if (dist2(P.x, P.y, m.x, m.y) < r * r) { hurtPlayer(m.atk * 1.5, { slow: 3, lv: m.lv }); floatText(P.x, P.y - 46, L2('¡Presión!', 'Pressure!'), '#ff5a5a', true); } G.shake = 8; } }); m.busyT = 1.3; } }; }
let SH_FIGHT = null;
function shNpc() { return G.ents.find(e => e.type === 'npc' && e.id === 'dawn_shanks' && (e.map === G.map.id || e.map === 'hidden')); }
function shStart() { const P = G.P, n = shNpc(); if (!n || SH_FIGHT) return; closeDialog();
  const b = spawnMob(SH_BOSS, 600, n.x + 22, n.y + 6, 0, null, true); b.map = G.map.id; b.home = { x: b.x, y: b.y }; b.state = 'fight'; b.cd = 0.8; n._shMap = n.map; n.map = 'hidden'; SH_FIGHT = { b, n };
  showBoss(b); sfx('boss'); banner('Shanks', L2('Demuéstrale que controlas tu sangre.', 'Show him you control your blood.')); }
function shEnd() { if (!SH_FIGHT) return; const { b, n } = SH_FIGHT; if (b && !b.dying) b.remove = true; if (n && n._shMap) { n.map = n._shMap; n._shMap = null; } SH_FIGHT = null; if (G.bossBar && G.bossBar.mid === SH_BOSS) showBoss(null); }
V33_TICKS.push(() => { if (!SH_FIGHT) return; const P = G.P, { b } = SH_FIGHT; if (!b || b.remove || (G.map && b.map !== G.map.id) || (P.dead && !b.dying)) { if (P.dead) toast(L2('Shanks: «Todavía no. Vuelve cuando estés listo.»', 'Shanks: "Not yet. Come back when you are ready."'), 'info', 4); if (!b || !b.dying) shEnd(); } });
{ const _bk = bossKilled; bossKilled = function (m) { const r = _bk.apply(this, arguments); try { if (m && m.mid === SH_BOSS) { const P = G.P; P.vaporOk = 1; markDirty(true); setTimeout(shEnd, 800);
  banner(L2('¡Estás listo!', 'You are ready!'), L2('Habla con Shanks para el ritual de Engranaje 2.', 'Talk to Shanks for the Gear 2 ritual.')); } } catch (e) { } return r; }; }
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (!P || npc.id !== 'dawn_shanks') return; const own = srOwned().includes('vapor');
  opts.unshift({ label: '♨ ' + L2('Engranaje 2 · ¿estoy listo?', 'Gear 2 · am I ready?'), icon: ['star', '#ff8a7a'], fn: () => {
    if (own) { typeText(L2('Ya lo controlas. No dejes que el vapor te nuble la vista.', 'You already control it. Don\'t let the steam cloud your sight.')); return; }
    if (P.lv < VAP_LV) { typeText(L2('Tu sangre aún no aguanta ese ritmo. Vuelve cuando seas nivel ', 'Your blood can\'t take that pace yet. Come back at level ') + VAP_LV + '.'); return; }
    if (!(P.bossKills || {}).tj_rueca) { typeText(L2('Tu hilo todavía no ha girado tan rápido. Dicen que en las Tierras Tejidas hay una rueca que no se detiene: vence a la Rueca Desbocada y vuelve.', 'Your thread hasn\'t spun that fast yet. They say there is a spinning wheel in the Woven Lands that never stops: defeat the Runaway Spinning Wheel and come back.')); return; }
    if (P.vaporOk) { closeDialog(); srRitual(); return; }
    typeText(L2('Lo noto: tu sangre ya hierve. Pero hervir no basta, hay que controlarlo. Demuéstramelo.', 'I can feel it: your blood is already boiling. But boiling is not enough, you have to control it. Show me.')); } });
  if (P.lv >= VAP_LV && (P.bossKills || {}).tj_rueca && !P.vaporOk && !own && !SH_FIGHT) opts.unshift({ label: '⚔ ' + L2('Duelo con Shanks (nivel 600)', 'Duel with Shanks (level 600)'), icon: ['sword'], fn: shStart }); });
{ const _sm = setMap; setMap = function (M) { if (SH_FIGHT && G.map && M && M.id !== G.map.id) shEnd(); return _sm.apply(this, arguments); }; }

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['engranaje2', '♨ ' + L2('Engranaje 2 (transformación, nivel 600)', 'Gear 2 (transformation, level 600)'), () => [
  L2('Mitad: mejillas encendidas y un hilo de vapor. Engranaje 2: piel roja pálida, vapor que sale de todo el cuerpo y estela al correr. Es la forma más fuerte de momento, un poco por encima de las fusiones: +45 % de ataque y +25 % de velocidad. Con espada, dagas o guadaña el brazo se estira con el arma y golpea a distancia.', 'Half: flushed cheeks and a wisp of steam. Gear 2: pale red skin, steam rising from the whole body and an afterimage when running. The strongest form for now, just above the fusions: +45% attack and +25% speed. With a sword, daggers or scythe your arm stretches with the weapon and hits at range.'),
  L2('Cómo se consigue: nivel 600, vencer a la Rueca Desbocada (Tierras Tejidas) y vencer a Shanks en Villa Foosha: él te dice si estás listo y luego hace el ritual (3 Engranajes de la Rueca y 200.000 de oro).', 'How to get it: level 600, defeat the Runaway Spinning Wheel (Woven Lands) and defeat Shanks in Foosha Village: he tells you if you are ready and then performs the ritual (3 Spinning Wheel Gears and 200,000 gold).'),
  L2('🔒 De momento no se puede conseguir: Villa Foosha sigue cerrada hasta que exista la Fruta del Diablo.', '🔒 It can\'t be obtained yet: Foosha Village stays closed until the Devil Fruit exists.'),
  L2('Habilidades: Puño Hirviente, Paso de Vapor, Lluvia de Puños y Estallido Hirviente.', 'Skills: Boiling Fist, Steam Step, Rain of Fists and Boiling Burst.')
], () => null]);

// ---------- brazo que se estira con el arma (Engranaje 2, armas cuerpo a cuerpo) ----------
const VAP_ARMS = [], VAP_WCV = {}; // { t, dur, ang, reach, w }
function vapWeaponCv(P) { const it = P.equip && P.equip.weapon && ITEMS[P.equip.weapon.id], key = it ? P.cls + '_' + (it.tier | 0) : null, px = key && typeof ARM_HPIX !== 'undefined' && ARM_HPIX[key];
  if (!px) return null; return VAP_WCV[key] || (VAP_WCV[key] = { cv: px.canvas(), piv: (ARM_PIVK16 && ARM_PIVK16[key]) || [3, 13] }); }
{ const _ba = basicAttack; basicAttack = function () { const P = G.P, cd0 = P ? P.atkCd : 1; const r = _ba.apply(this, arguments);
  try { const C_ = CLASSES[P.cls]; if (P.sr === 'vapor' && P.srF && srOk() && cd0 <= 0 && P.atkCd > 0 && ['sword', 'dagger', 'scythe'].includes(C_.weapon) || (P.sr === 'vapor' && P.srF && srOk() && cd0 <= 0 && P.atkCd > 0 && P.cls === 'pez')) {
      const tgt = nearestMob(P.x, P.y, 150), ang = tgt ? Math.atan2(tgt.y - 6 - (P.y - 14), tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]), reach = tgt ? clamp(Math.hypot(tgt.x - P.x, tgt.y - P.y) - 6, 40, 130) : 90;
      VAP_ARMS.push({ t: G.t, dur: 0.34, ang, reach, w: vapWeaponCv(P) });
      delayAct(0.12, () => { const x = P.x + Math.cos(ang) * reach, y = P.y - 8 + Math.sin(ang) * reach; const n = hitCircle(x, y, 22, P.S.atk * 0.8, { kb: 30 }); burst(x, y - 4, n ? 10 : 4, { sp: 70, up: 30, g: 20, life: 0.35, c: ['#ffffff', '#ffd8d0', '#ff8a7a'] }); }); } } catch (e) { } return r; }; }
if (typeof DL_HOOKS !== 'undefined') DL_HOOKS.push((list, cx, cy) => { const P = G.P; for (let i = VAP_ARMS.length - 1; i >= 0; i--) if (G.t - VAP_ARMS[i].t > VAP_ARMS[i].dur) VAP_ARMS.splice(i, 1); if (!P || !VAP_ARMS.length) return;
  list.push({ type: 'xdraw', x: P.x, y: P.y + 1, noShadow: true, draw: () => { for (const A of VAP_ARMS) { const k = Math.sin(Math.min(1, (G.t - A.t) / A.dur) * Math.PI), len = A.reach * k, sx = P.x - cx, sy = P.y - 14 - cy, ex = sx + Math.cos(A.ang) * len, ey = sy + Math.sin(A.ang) * len;
    ctx.lineCap = 'round'; ctx.strokeStyle = '#2a1214'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.strokeStyle = '#e8847a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,220,212,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, sy - 1); ctx.lineTo(ex, ey - 1); ctx.stroke();
    if (A.w) { ctx.save(); ctx.translate(Math.round(ex), Math.round(ey)); ctx.rotate(A.ang + Math.PI / 4); ctx.drawImage(A.w.cv, -A.w.piv[0], -A.w.piv[1]); ctx.restore(); }
    ctx.fillStyle = '#2a1214'; ctx.fillRect(Math.round(ex) - 3, Math.round(ey) - 3, 6, 6); ctx.fillStyle = '#e8847a'; ctx.fillRect(Math.round(ex) - 2, Math.round(ey) - 2, 4, 4); } } }); });
