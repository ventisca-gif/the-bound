// ================= v4.35: COMBATE PROFUNDO =================
// Maestría de armas (experiencia por tipo de arma: posturas, contraataque maestro y técnica especial sin subir de nivel),
// Campo de Entrenamiento en Arxar (muñecos, dianas, armeros y Maestro de Armas), reacciones elementales (mojado, rayo,
// hielo y fuego) con raíces que se queman, partes vulnerables en algunos jefes, enemigos que trabajan en equipo
// (guardianes y curanderos) y técnicas combinadas entre clases en el online.
SAVEKEYS.push('wm', 'wpos');

// =====================================================================================
// MAESTRÍA DE ARMAS
// =====================================================================================
const WM_T = { sword: [L2('Espada', 'Sword'), '#d8e0f0'], staff: [L2('Báculo', 'Staff'), '#a080ff'], bow: [L2('Arco', 'Bow'), '#8ad040'], dagger: [L2('Dagas', 'Daggers'), '#d84a4a'], lute: [L2('Laúd', 'Lute'), '#ffd040'],
  scythe: [L2('Guadaña', 'Scythe'), '#8ab0c8'], fins: [L2('Aletas', 'Fins'), '#4ac8f0'], lanza: [L2('Lanza', 'Spear'), '#c8c8a0'], hacha: [L2('Hacha', 'Axe'), '#c87a3a'], maza: [L2('Maza', 'Mace'), '#a0a0a8'] };
const WM_MAX = 50;
const WM_UNL = [[5, 'of'], [10, 'counter'], [15, 'de'], [20, 'tech'], [30, 've'], [40, 'tech2'], [50, 'master']];
const WM_POS = { of: [L2('Postura ofensiva', 'Offensive stance'), '#ff6a3a', L2('+10 % de ataque, −10 % de defensa', '+10% attack, −10% defence')], de: [L2('Postura defensiva', 'Defensive stance'), '#5aa0ff', L2('+15 % de defensa, −8 % de ataque', '+15% defence, −8% attack')], ve: [L2('Postura veloz', 'Swift stance'), '#8aff8a', L2('+10 % de vel. de ataque, −5 % de ataque', '+10% attack speed, −5% attack')] };
const WM_TECH = { sword: [L2('Tajo Cruzado', 'Cross Slash'), 'arc', 3.2, 62], lanza: [L2('Estocada Larga', 'Long Thrust'), 'line', 3.5, 130], hacha: [L2('Hachazo Giratorio', 'Whirling Chop'), 'spin', 2.6, 56], maza: [L2('Martillazo', 'Hammer Blow'), 'slam', 3.0, 72],
  staff: [L2('Orbe Arcano', 'Arcane Orb'), 'nova', 2.8, 82], bow: [L2('Flecha Perforante', 'Piercing Arrow'), 'line', 3.4, 220], dagger: [L2('Danza de Hojas', 'Blade Dance'), 'multi', 0.8, 70], lute: [L2('Acorde Sísmico', 'Seismic Chord'), 'slam', 2.2, 92],
  scythe: [L2('Siega', 'Reap'), 'spin', 3.0, 66], fins: [L2('Ola Marina', 'Sea Wave'), 'line', 3.0, 150] };
function wmType(P) { P = P || G.P; const e = P && P.equip && P.equip.weapon; if (P && P.cls === 'pez') return 'fins'; if (!e) return null; if (/^av_/.test(e.id)) { const k = e.id.split('_')[1]; return WM_T[k] ? k : 'sword'; } const I = ITEMS[e.id], c = (I && I.cls) || P.cls; return WBASE[c] ? WBASE[c][2] : null; }
function wmNeed(lv) { return Math.round(20 * Math.pow(lv, 1.6)); }
function wmLv(t) { const P = G.P, xp = ((P.wm || {})[t] || 0); let lv = 0; while (lv < WM_MAX && xp >= wmCum(lv + 1)) lv++; return lv; }
function wmCum(lv) { let s = 0; for (let k = 1; k <= lv; k++) s += wmNeed(k); return s; }
function wmHas(t, what) { const lv = wmLv(t); return WM_UNL.some(([l, w]) => w === what && lv >= l); }
function wmGain(n) { const P = G.P, t = wmType(); if (!t || !n) return; P.wm = P.wm || {}; const a = wmLv(t); P.wm[t] = (P.wm[t] || 0) + n; const b = wmLv(t);
  if (b > a) { const u = WM_UNL.find(([l]) => l === b); banner(L2('Maestría de ', 'Mastery: ') + WM_T[t][0] + ' ' + b, u ? wmUnlTxt(u[1]) : L2('+0,1 % de ataque con esta arma', '+0.1% attack with this weapon')); sfx('level'); wmHud(); calcStats(P); } }
function wmUnlTxt(w) { return { of: L2('Desbloqueas la postura ofensiva', 'Offensive stance unlocked'), counter: L2('Contraataque maestro: un segundo golpe tras el contraataque', 'Master counter: a second strike after a counter'), de: L2('Desbloqueas la postura defensiva', 'Defensive stance unlocked'), tech: L2('Desbloqueas la técnica especial', 'Special technique unlocked'), ve: L2('Desbloqueas la postura veloz', 'Swift stance unlocked'), tech2: L2('Técnica especial mejorada (+50 %)', 'Improved special technique (+50%)'), master: L2('¡Gran Maestro! +5 % de daño con esta arma', 'Grand Master! +5% damage with this weapon') }[w] || ''; }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); if (m && m.type === 'mob' && !m.part) wmGain(m.boss ? 25 : m.elite ? 4 : 1); return r; }; }
// bonos: +0,1 % de ataque por nivel de maestría del arma equipada y la postura
{ const _cs = calcStats; calcStats = function (P) { const r = _cs(P); if (P && P === G.P && P.S) { const S = P.S, t = wmType(P); if (t) { const lv = wmLv(t); S.atk = Math.round(S.atk * (1 + lv * 0.001 + (lv >= 50 ? 0.05 : 0))); }
    const ps = P.wpos; if (ps === 'of') { S.atk = Math.round(S.atk * 1.1); S.def = Math.round(S.def * 0.9); } else if (ps === 'de') { S.def = Math.round(S.def * 1.15); S.atk = Math.round(S.atk * 0.92); } else if (ps === 've') { if (S.aspd) S.aspd = S.aspd / 1.1; S.atk = Math.round(S.atk * 0.95); } } return r; }; }
function wmPosList() { const t = wmType(); return t ? ['of', 'de', 've'].filter(k => wmHas(t, k)) : []; }
function wmCyclePos() { const P = G.P, L = [''].concat(wmPosList()); if (L.length < 2) { toast(L2('Sube la maestría de tu arma a 5 para desbloquear posturas (Campo de Entrenamiento de Arxar).', 'Raise your weapon mastery to 5 to unlock stances (Arxar Training Grounds).'), 'info'); return; }
  const i = L.indexOf(P.wpos || ''); P.wpos = L[(i + 1) % L.length]; calcStats(P); wmHud(); sfx('equip'); toast(P.wpos ? WM_POS[P.wpos][0] + ': ' + WM_POS[P.wpos][2] : L2('Sin postura', 'No stance'), 'info'); markDirty(); }
let wmTechCd = 0;
function wmTechUse() {
  const P = G.P, t = wmType(); if (!P || P.dead || !t) return; if (!wmHas(t, 'tech')) { toast(L2('La técnica especial se desbloquea con maestría 20.', 'The special technique unlocks at mastery 20.'), 'info'); return; } if (G.t < wmTechCd) return;
  const T_ = WM_TECH[t], lv = wmLv(t), mul = T_[2] * (wmHas(t, 'tech2') ? 1.5 : 1), R = T_[3], tg = nearestMob(P.x, P.y, R + 60), ang = tg ? Math.atan2(tg.y - P.y, tg.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]);
  wmTechCd = G.t + (lv >= 40 ? 14.4 : 18); P.dir = dirFromVec(Math.cos(ang), Math.sin(ang)); setAnim(P, T_[1] === 'slam' ? 'slam' : 'atk'); const col = WM_T[t][1], atk = P.S.atk;
  const hitM = (m, k) => { if (!m || m.dying || m.type !== 'mob' || m.map !== P.map) return; hitMob(m, atk * k, { critB: 10, kb: 40, stun: T_[1] === 'slam' ? 1.2 : 0 }); if (t === 'fins') elSet(m, 'wet', 4); if (t === 'scythe') P.hp = Math.min(P.S.maxhp, P.hp + atk * 0.05); };
  const mobs = G.ents.filter(m => m.type === 'mob' && !m.dying && m.map === P.map && !m.ghost);
  if (T_[1] === 'arc') { addFx({ type: 'slash', x: P.x, y: P.y - 10, ang, arc: 3.2, r: R, dur: 0.35, col }); for (const m of mobs) { const d = Math.hypot(m.x - P.x, m.y - P.y); if (d < R + (m.rad || 8) && Math.abs(angDiff(Math.atan2(m.y - P.y, m.x - P.x), ang)) < 1.6) hitM(m, mul); } }
  else if (T_[1] === 'line') { addFx({ type: 'bolt', x: P.x, y: P.y - 12, x2: P.x + Math.cos(ang) * R, y2: P.y - 12 + Math.sin(ang) * R, dur: 0.3, col }); for (let k = 1; k < 8; k++) part(P.x + Math.cos(ang) * R * k / 8, P.y - 12 + Math.sin(ang) * R * k / 8, { life: 0.35, c: col, s: 3 }); for (const m of mobs) { const dx = m.x - P.x, dy = m.y - P.y, along = dx * Math.cos(ang) + dy * Math.sin(ang), side = Math.abs(-dx * Math.sin(ang) + dy * Math.cos(ang)); if (along > 0 && along < R && side < 18 + (m.rad || 8)) hitM(m, mul); } }
  else if (T_[1] === 'spin' || T_[1] === 'nova' || T_[1] === 'slam') { addFx({ type: 'ring', x: P.x, y: P.y - 8, r: R, dur: 0.4, col }); burst(P.x, P.y - 8, 18, { sp: 110, up: 30, g: 60, life: 0.5, c: [col, '#ffffff'] }); if (T_[1] === 'slam') G.shake = Math.max(G.shake, 6);
    for (const m of mobs) if (Math.hypot(m.x - P.x, m.y - P.y) < R + (m.rad || 8)) { hitM(m, mul); if (T_[1] === 'spin') delayAct(0.25, () => hitM(m, mul * 0.4)); } }
  else if (T_[1] === 'multi') { for (let k = 0; k < 6; k++) delayAct(0.06 + k * 0.08, () => { const m = nearestMob(P.x, P.y, R); if (m) { hitM(m, mul); addFx({ type: 'slash', x: m.x, y: m.y - 12, ang: Math.random() * 6.28, arc: 1.4, r: 22, dur: 0.18, col }); } }); }
  floatText(P.x, P.y - 52, T_[0], col, true); sfx('crit'); wmHud();
}
function angDiff(a, b) { let d = a - b; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; }
// contraataque maestro: un segundo golpe
{ const _pp = perfectParry; perfectParry = function () { const r = _pp.apply(this, arguments); const P = G.P, t = wmType(); if (t && wmHas(t, 'counter')) delayAct(0.22, () => { const m = nearestMob(P.x, P.y, 90); if (m) { hitMob(m, P.S.atk * (m.boss ? 1.4 : 2), { critB: 30 }); addFx({ type: 'slash', x: P.x, y: P.y - 10, ang: Math.atan2(m.y - P.y, m.x - P.x) + 0.6, arc: 2.2, r: 44, dur: 0.25, col: 'rgba(160,224,255,0.9)' }); floatText(P.x, P.y - 60, L2('¡Contraataque maestro!', 'Master counter!'), '#a0e0ff'); } }); return r; }; }
wmTechUse = typeof nfxWrap === 'function' ? nfxWrap(wmTechUse) : wmTechUse;
// botones: postura (mantén pulsado = panel de maestría) y técnica
function wmHud() {
  const acts = $('#acts'); if (!acts || !G.P) return; let bp = $('#bPos'), bt = $('#bTec');
  if (!bp) { const mk = (id, fn) => { const b = document.createElement('button'); b.className = 'rb'; b.id = id; acts.appendChild(b); b.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); fn(); }); return b; };
    bp = mk('bPos', () => { }); let hold = null; bp.addEventListener('pointerdown', () => { hold = setTimeout(() => { hold = null; wmOpen(); }, 550); }); bp.addEventListener('pointerup', () => { if (hold) { clearTimeout(hold); hold = null; wmCyclePos(); } });
    bt = mk('bTec', wmTechUse); }
  const P = G.P, t = wmType(), ps = P.wpos; bp.innerHTML = `<b style="color:${ps ? WM_POS[ps][1] : '#d8d0c0'}">${ps === 'of' ? '⚔' : ps === 'de' ? '🛡' : ps === 've' ? '💨' : '◇'}</b>`; bp.title = L2('Postura (mantén pulsado: maestría)', 'Stance (hold: mastery)');
  bt.hidden = !(t && wmHas(t, 'tech')); bt.innerHTML = `<b style="color:${t ? WM_T[t][1] : '#fff'}">✦</b>${G.t < wmTechCd ? `<i class="cdv" style="height:${Math.round(100 * (wmTechCd - G.t) / 18)}%"></i>` : ''}`; bt.title = t ? WM_TECH[t][0] : '';
}
{ const st = document.createElement('style'); st.textContent = '#bPos{right:17.3em;bottom:.3em;width:3em;height:3em;font-size:1em;overflow:hidden}#bTec{right:17.2em;bottom:3.9em;width:3em;height:3em;font-size:1.1em;overflow:hidden}#bTec .cdv{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.55);pointer-events:none}'; document.head.appendChild(st); }
let wmHudT = 0; V33_TICKS.push(dt => { wmHudT += dt || 0; if (wmHudT < 0.25) return; wmHudT = 0; if (G.P && !titleMode) wmHud(); });
function wmOpen() {
  const P = G.P, cur = wmType(); P.wm = P.wm || {};
  const rows = Object.keys(WM_T).filter(t => t === cur || (P.wm[t] || 0) > 0 || (t === 'fins') === (P.cls === 'pez')).map(t => { const lv = wmLv(t), xp = P.wm[t] || 0, a = wmCum(lv), b = wmCum(Math.min(WM_MAX, lv + 1)), pc = lv >= WM_MAX ? 100 : Math.round(100 * (xp - a) / Math.max(1, b - a));
    return `<div class="srow"><div class="sn"><b style="color:${WM_T[t][1]}">${esc(WM_T[t][0])} · ${L2('maestría', 'mastery')} ${lv}/${WM_MAX}${t === cur ? ' ◀' : ''}</b><i class="dbar"><b style="width:${pc}%"></b></i><small>${WM_UNL.map(([l, w]) => `<span style="color:${lv >= l ? '#c8ffb0' : '#8a8070'}">${l}: ${esc(wmUnlTxt(w).replace(/^Desbloqueas la |^Desbloqueas |unlocked$/g, ''))}</span>`).join(' · ')}</small>${WM_TECH[t] ? `<small>✦ ${esc(WM_TECH[t][0])}</small>` : ''}</div></div>`; }).join('');
  openModal(`<h2>⚔ ${L2('Maestría de armas', 'Weapon mastery')}</h2><p class="hint">${L2('Cada tipo de arma tiene su propia experiencia: la ganas derrotando enemigos y golpeando los muñecos del Campo de Entrenamiento de Arxar. Desbloquea posturas, el contraataque maestro y una técnica especial sin subir de nivel.', 'Each weapon type has its own experience: earn it defeating enemies and hitting the dummies at the Arxar Training Grounds. Unlock stances, the master counter and a special technique without levelling up.')}</p><div class="pvBody">${rows}</div>
    <p class="hint">${Object.keys(WM_POS).map(k => `<b style="color:${WM_POS[k][1]}">${esc(WM_POS[k][0])}</b>: ${esc(WM_POS[k][2])}`).join('<br>')}</p><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal;
}
// la postura se ve como un aro en el suelo (también la de los demás jugadores)
{ const _ep = extraPresence; extraPresence = function (o) { const r = _ep.apply(this, arguments); if (G.P && G.P.wpos) o.wp = G.P.wpos; return r; }; }
{ const _ur = upsertRemote; upsertRemote = function (p) { const r = _ur.apply(this, arguments); const R = G.remote.get(p.peer), pr = p.presence || {}; if (R) R.wpos = WM_POS[pr.wp] ? pr.wp : ''; return r; }; }

// =====================================================================================
// CAMPO DE ENTRENAMIENTO (Arxar)
// =====================================================================================
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = C;
  if (kind === 'tr_rack') { const p = new Pix(40, 34); p.rect(2, 30, 36, 3, WOOD[1]); for (const x of [3, 36]) p.rect(x, 4, 2, 27, WOOD[2]); for (const y of [9, 20]) p.rect(2, y, 36, 2, WOOD[3]);
    p.vl(9, 3, 26, D('#c8d0e0')); p.poly([[8, 3], [9, 0], [10, 3]], D('#e8f0ff')); p.rect(7, 22, 5, 1, D('#8a6a2a')); p.vl(17, 1, 29, WOOD[4]); p.poly([[15, 4], [17, 0], [19, 4], [17, 7]], D('#a8b0c0')); p.vl(25, 6, 24, WOOD[4]); p.poly([[22, 6], [26, 3], [29, 8], [25, 11]], D('#a8b0c0')); p.vl(32, 8, 22, WOOD[4]); p.ball(32, 7, 3, 3, pal(['#4a4a52', '#7a7a86', '#a8a8b4']));
    p.outline(D('#1a1008')); return { c: p.canvas(), ax: 20, ay: 33 }; }
  if (kind === 'tr_target') { const p = new Pix(26, 34); p.line(6, 33, 12, 18, WOOD[2]); p.line(20, 33, 14, 18, WOOD[2]); p.ell(13, 13, 11, 11, D('#f4f0e8')); p.ell(13, 13, 8.5, 8.5, D('#d83a3a')); p.ell(13, 13, 6, 6, D('#f4f0e8')); p.ell(13, 13, 3.5, 3.5, D('#d83a3a')); p.ell(13, 13, 1.2, 1.2, D('#ffd040')); p.line(16, 9, 20, 5, WOOD[4]); p.set(20, 5, D('#ffffff'));
    p.outline(D('#2a1408')); return { c: p.canvas(), ax: 13, ay: 33 }; }
  if (kind === 'tr_dummy') { const p = new Pix(22, 36), S = pal(['#8a6a2a', '#b89a4a', '#d8c070', '#f0e0a0']); p.vl(11, 20, 15, WOOD[2]); p.rect(9, 33, 5, 2, WOOD[1]); p.ball(11, 18, 6, 7, S); p.rect(3, 15, 16, 3, S[1]); p.ball(11, 7, 4.5, 4.5, S); p.hl(5, 22, 12, D('#7a4a2a')); p.set(9, 6, D('#3a2a1a')); p.set(13, 6, D('#3a2a1a')); p.hl(9, 9, 5, D('#3a2a1a'));
    p.outline(D('#2a1a08')); return { c: p.canvas(), ax: 11, ay: 35 }; }
  if (kind === 'tr_shields') { const p = new Pix(36, 26); p.rect(1, 22, 34, 3, WOOD[1]); p.rect(2, 4, 32, 2, WOOD[3]); for (const [x, c] of [[7, '#5a8ad0'], [18, '#c84a3a'], [29, '#5a8ad0']]) { p.poly([[x - 5, 6], [x + 5, 6], [x + 5, 14], [x, 21], [x - 5, 14]], D(c)); p.vl(x, 7, 13, D('#e8e0c8')); p.hl(x - 4, 11, 9, D('#e8e0c8')); }
    p.outline(D('#1a1008')); return { c: p.canvas(), ax: 18, ay: 25 }; }
  if (kind === 'tr_rope') { const p = new Pix(18, 18); p.vl(8, 3, 14, WOOD[2]); p.vl(9, 3, 14, WOOD[3]); p.hl(0, 7, 18, D('#e8d0a0')); p.hl(0, 12, 18, D('#c8b080')); p.outline(D('#1a1008')); return { c: p.canvas(), ax: 9, ay: 17 }; }
  if (kind === 'tr_raiz') { const p = new Pix(18, 22), R = pal(['#2a1a10', '#4a2e1a', '#6a4426', '#3a5a1a']); for (let k = 0; k < 6; k++) { const x = 2 + k * 3; p.line(x, 21, x + (k % 2 ? 3 : -2), 3 + (k % 3) * 3, R[1 + (k % 2)]); } for (const [x, y] of [[4, 6], [12, 9], [8, 13], [14, 4]]) p.set(x, y, D('#c8ffa0')); p.line(1, 15, 16, 12, R[2]);
    p.outline(D('#120a04')); return { c: p.canvas(), ax: 9, ay: 21 }; }
  if (kind === 'tr_cofre') { const p = new Pix(18, 16); p.rect(1, 5, 16, 10, WOOD[3]); p.rect(1, 3, 16, 4, WOOD[4]); p.hl(1, 7, 16, IRON[2]); p.rect(8, 6, 2, 3, D('#ffd040')); p.vl(1, 3, 12, IRON[1]); p.vl(16, 3, 12, IRON[1]); p.outline(D('#1a1008')); return { c: p.canvas(), ax: 9, ay: 15 }; }
  return _ge.apply(this, arguments); }; }
const TR = { x: 0, y: 0, ok: false };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  const t = TOWNS.find(t => t.k === 'arxar'); if (!t) return; const w = 15, h = 10; let best = null;
  for (let r = 0; r < 26 && !best; r++) for (const [ox, oy] of [[0, r], [r, 0], [-r, 0], [0, -r], [r, r], [-r, r]]) { const x0 = Math.round((t.x0 + t.x1) / 2) - 7 + ox, y0 = t.y1 + 3 + oy; let ok = true;
    for (let y = y0; y < y0 + h && ok; y++) for (let x = x0; x < x0 + w && ok; x++) { if (!W.inb(x, y)) { ok = false; break; } const i = W.I(x, y); if (W.objAt[i] >= 0 || SOLID_T[W.ter[i]] || W.ter[i] === T.WATER || W.ter[i] === T.DEEP || W.ter[i] === T.STAIRS || W.ter[i] === T.BRIDGE) ok = false; }
    if (ok) { best = [x0, y0]; break; } }
  if (!best) return; const [x0, y0] = best; TR.x = x0; TR.y = y0; TR.ok = true;
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const i = W.I(x, y); W.ter[i] = T.SAND; if (W.flags) W.flags[i] |= 4 | 16; }
  const A = (f, x, y, o) => addObj(W, 'furn', x, y, Object.assign({ f }, o || {}));
  for (let x = x0; x < x0 + w; x += 2) { A('tr_rope', x, y0); if (x !== x0 + 6 && x !== x0 + 8) A('tr_rope', x, y0 + h - 1); }
  A('tr_rack', x0 + 2, y0 + 2, { fp: [[0, 0], [1, 0]] }); A('tr_rack', x0 + 2, y0 + 5, { fp: [[0, 0], [1, 0]] }); A('tr_shields', x0 + 2, y0 + 7, { fp: [[0, 0], [1, 0]] });
  for (let k = 0; k < 3; k++) A('tr_target', x0 + 6 + k * 2, y0 + 2, { xact: 'tr_tgt' });
  for (const [dx, dy] of [[5, 6], [7, 7], [9, 6]]) A('tr_dummy', x0 + dx, y0 + dy, { xact: 'tr_dum' });
  addObj(W, 'banner', x0 + 12, y0 + 1, { col: '#8a2a2a' }); addObj(W, 'bench', x0 + 12, y0 + 7);
  W.npcDefs.push({ id: 'maestro_armas', x: x0 + 12, y: y0 + 4, face: 'left' }, { id: 'aprendiz_a', x: x0 + 10, y: y0 + 4, face: 'right' }, { id: 'aprendiz_b', x: x0 + 13, y: y0 + 6, face: 'left' }); }; }
NPCS.maestro_armas = { n: L2('Maestra Brienne', 'Master Brienne'), title: L2('Maestra de Armas', 'Weapons Master'), look: LK({ hair: HAIRS.rojo, outfit: 'guard', hairStyle: 'long', main: CLOTH.gris, sec: CLOTH.rojo }), lines: [L2('Un arma no se domina con fuerza, sino con miles de golpes bien dados.', 'A weapon is not mastered with strength, but with thousands of well-placed strikes.'), L2('Golpea los muñecos y las dianas: tu maestría subirá aunque no subas de nivel.', 'Hit the dummies and targets: your mastery will grow even if your level does not.')] };
NPCS.aprendiz_a = { n: L2('Aprendiz Tomás', 'Apprentice Tomás'), title: L2('Entrenando', 'Training'), look: LK({ hair: HAIRS.castano, outfit: 'tunic', main: CLOTH.azul, sec: CLOTH.marron }), lines: [L2('¡Uno, dos, giro! ¡Uno, dos, giro!', 'One, two, spin! One, two, spin!')] };
NPCS.aprendiz_b = { n: L2('Aprendiza Lía', 'Apprentice Lía'), title: L2('Entrenando', 'Training'), look: LK({ hair: HAIRS.rubio, outfit: 'dress', hairStyle: 'long', main: CLOTH.verde, sec: CLOTH.marron }), lines: [L2('Mi postura defensiva aguanta lo que le echen.', 'My defensive stance can take anything.')] };
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'maestro_armas') opts.unshift({ label: L2('Maestría de armas', 'Weapon mastery'), icon: ['sword', 3], fn: () => { closeDialog(); wmOpen(); } }); });
// los aprendices practican golpes
{ const _un = updateNPC; updateNPC = function (e, dt) { const r = _un.apply(this, arguments); if (e && (e.id === 'aprendiz_a' || e.id === 'aprendiz_b')) { e.trT = (e.trT || 0) - dt; if (e.trT <= 0) { e.trT = 1.1 + Math.random(); setAnim(e, 'atk'); e.loopAnim = false; } } return r; }; }
XACT.tr_dum = [L2('Golpear el muñeco', 'Hit the dummy'), 'atk', o => trHit(o, 1)];
XACT.tr_tgt = [L2('Practicar puntería', 'Practice aim'), 'atk', o => trHit(o, 1)];
let trLast = 0;
function trHit(o, n) { const P = G.P; if (G.t - trLast < 0.45) return; trLast = G.t; P.dir = dirFromVec(o.px - P.x, o.py - P.y); setAnim(P, 'atk'); const d = Math.round(P.S.atk * (0.9 + Math.random() * 0.2)); floatText(o.px, o.py - 34, fmt(d), '#ffffff'); burst(o.px, o.py - 18, 6, { sp: 40, up: 30, g: 100, life: 0.4, c: ['#e8d0a0', '#b89a4a'] }); sfx('hit'); wmGain(n); }
// golpear de verdad cerca de un muñeco también cuenta
{ const _ba = basicAttack; basicAttack = function () { const P = G.P, cd0 = P && P.atkCd; const r = _ba.apply(this, arguments); if (P && G.map && G.map.isWorld && TR.ok && P.atkCd > (cd0 || 0)) { const o = G.map.objs.find(o => (o.xact === 'tr_dum' || o.xact === 'tr_tgt') && dist2(o.px, o.py, P.x, P.y) < (o.xact === 'tr_tgt' ? 140 * 140 : 40 * 40)); if (o) { trLast = 0; trHit(o, 1); } } return r; }; }

// =====================================================================================
// REACCIONES ELEMENTALES
// =====================================================================================
function elSet(m, k, s) { m.el = m.el || {}; m.el[k] = Math.max(m.el[k] || 0, G.t + s); }
function elHas(m, k) { return m.el && m.el[k] > G.t; }
function elClr(m, k) { if (m.el) m.el[k] = 0; }
const EL_ART = a => { a = String(a || ''); return /fire|meteor|lava|flame|ember/.test(a) ? 'fire' : /ice|frost|snow/.test(a) ? 'ice' : /bolt|light|thunder|storm|spark|volt|arcane/.test(a) ? 'shock' : /water|wave|bubble|tide/.test(a) ? 'wet' : ''; };
{ const _us = useSkill; useSkill = function (slot) { const P = G.P, id = P && P.slots[slot], cd0 = id ? (P.cds[id] || 0) : 0, prev = P && P._el;
    if (id && SK[id] && cd0 <= 0) { const e = SK[id].eff || {}; P._el = { k: e.fire ? 'fire' : EL_ART(e.art) || (P.cls === 'pez' ? 'wet' : ''), t: G.t, id }; }
    const r = _us.apply(this, arguments);
    if (id && (P.cds[id] || 0) > cd0) { if (P._el && P._el.k === 'fire') elBurnRoots(P.x, P.y, 110); cmbMine(id); } else if (P) P._el = prev; return r; }; }
let elBusy = false;
const EL_RX = { descarga: [L2('¡Descarga!', 'Discharge!'), '#8ad8ff'], congelado: [L2('¡Congelado!', 'Frozen!'), '#c8f0ff'], vapor: [L2('¡Vapor!', 'Steam!'), '#e0e0e0'], sobrecarga: [L2('¡Sobrecarga!', 'Overload!'), '#ffb040'], apagado: [L2('¡Apagado!', 'Doused!'), '#8ab0c8'] };
{ const _hm = hitMob; hitMob = function (m, base, src) { src = src || {}; if (elBusy || !m || m.dying) return _hm.apply(this, arguments); const P = G.P;
    // partes de jefe y guardianes modifican el daño antes de aplicarlo
    base = bpMod(m, base, src); base = tmMod(m, base);
    const b0 = m.burn || 0, s0 = m.slow || 0, f0 = m.freeze || 0; const d = _hm.call(this, m, base, src); if (!d || m.dying && m.hp <= 0) { bpHit(m, d, src); return d; }
    let k = src.fire ? 'fire' : ''; if (!k && P._el && G.t - P._el.t < 2.5) k = P._el.k; if (!k && P.cls === 'pez') k = 'wet';
    if (!k && (m.burn || 0) > b0) k = 'fire'; if (!k && ((m.slow || 0) > s0 || (m.freeze || 0) > f0)) k = 'ice';
    if (!k) { const w = fgW && fgW(); if (w && w.fg && w.fg.rune === 'rayo' && Math.random() < 0.25) k = 'shock'; if (w && w.fg && w.fg.rune === 'fuego' && Math.random() < 0.2) k = 'fire'; if (w && w.fg && w.fg.rune === 'hielo') k = 'ice'; }
    if (!k && P.buff && P.buff.cmbShock) k = 'shock';
    elBusy = true; try { elReact(m, k, d); bpHit(m, d, src, k); } finally { elBusy = false; } return d; }; }
function elReact(m, k, d) {
  if (!k) return; const show = (rx) => { floatText(m.x, m.y - (m.hgt || 30) - 18, EL_RX[rx][0], EL_RX[rx][1], true); addFx({ type: 'ring', x: m.x, y: m.y - 10, r: 30, dur: 0.3, col: EL_RX[rx][1] }); }, P = G.P;
  const wet = elHas(m, 'wet'), burn = (m.burn || 0) > 0, chill = (m.slow || 0) > 0 || (m.freeze || 0) > 0, shock = elHas(m, 'shock');
  if (k === 'shock' && wet) { show('descarga'); elClr(m, 'wet'); m.stun = Math.max(m.stun || 0, 1); hitMob(m, d * 0.6, {}); for (const o of G.ents) if (o !== m && o.type === 'mob' && !o.dying && o.map === m.map && elHas(o, 'wet') && dist2(o.x, o.y, m.x, m.y) < 80 * 80) { hitMob(o, d * 0.4, {}); o.stun = Math.max(o.stun || 0, 0.6); addFx({ type: 'bolt', x: m.x, y: m.y - 12, x2: o.x, y2: o.y - 12, dur: 0.25, col: '#8ad8ff' }); } return; }
  if (k === 'ice' && wet) { show('congelado'); elClr(m, 'wet'); m.freeze = Math.max(m.freeze || 0, 2.5); return; }
  if ((k === 'ice' && burn) || (k === 'fire' && chill)) { show('vapor'); m.burn = 0; m.slow = 0; m.freeze = 0; hitMob(m, d * 0.5, {}); burst(m.x, m.y - 14, 14, { sp: 50, up: 60, g: -30, life: 0.9, c: ['#ffffff', '#d8e0e8'] }); return; }
  if ((k === 'shock' && burn) || (k === 'fire' && shock)) { show('sobrecarga'); m.burn = 0; elClr(m, 'shock'); burst(m.x, m.y - 10, 22, { sp: 120, up: 40, g: 80, life: 0.5, c: ['#ffb040', '#ffe060', '#ffffff'] }); for (const o of G.ents) if (o.type === 'mob' && !o.dying && o.map === m.map && dist2(o.x, o.y, m.x, m.y) < 70 * 70) hitMob(o, d * 0.5, {}); return; }
  if (k === 'wet' && burn) { show('apagado'); m.burn = 0; m.stun = Math.max(m.stun || 0, 0.6); return; }
  if (k === 'wet') elSet(m, 'wet', 5); if (k === 'shock') elSet(m, 'shock', 4);
}
// la lluvia y el agua mojan a los enemigos
let elWxT = 0; V33_TICKS.push(dt => { elWxT += dt || 0; if (elWxT < 0.5) return; elWxT = 0; const M = G.map; if (!M || !G.P) return; const rain = M.isWorld && ['rain', 'storm'].includes(curWx()), storm = M.isWorld && curWx() === 'storm';
  for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== M.id && !(M.isWorld && m.map === 'world')) continue; if (Math.abs(m.x - G.P.x) > 400 || Math.abs(m.y - G.P.y) > 300) continue;
    if (rain) elSet(m, 'wet', 2); else { const i = M.I ? M.I(Math.floor(m.x / 16), Math.floor(m.y / 16)) : -1; if (i >= 0 && M.ter[i] === T.WATER) elSet(m, 'wet', 2); }
    if (storm && m.state === 'chase' && Math.random() < 0.01) { elSet(m, 'shock', 3); addFx({ type: 'bolt', x: m.x, y: m.y - 160, x2: m.x, y2: m.y - 10, dur: 0.25, col: '#e0f0ff' }); if (elHas(m, 'wet')) { elBusy = false; elReact(m, 'shock', Math.round(m.maxhp * 0.04)); } } } });
// gotas y chispas sobre los enemigos mojados o electrizados
WORLD_DRAW.push((cx, cy) => { if (!G.P) return; for (const m of G.ents) { if (m.type !== 'mob' || m.dying || !m.el || m.map !== G.P.map && !(G.map.isWorld && m.map === 'world')) continue; const x = m.x - cx, y = m.y - cy - (m.hgt || 28) - 6; if (x < -20 || x > VW + 20 || y < -20 || y > VH + 20) continue;
    if (elHas(m, 'wet')) { ctx.fillStyle = '#5ab0ff'; ctx.fillRect(Math.round(x - 6), Math.round(y + ((G.t * 20) % 6)), 2, 3); ctx.fillRect(Math.round(x + 4), Math.round(y + ((G.t * 20 + 3) % 6)), 2, 3); }
    if (elHas(m, 'shock')) { ctx.fillStyle = '#ffe860'; ctx.fillRect(Math.round(x - 2 + Math.sin(G.t * 30) * 3), Math.round(y - 2), 2, 2); } } });

// ---------- raíces espinosas que el fuego quema (tapan cofres) ----------
const RZ_SITES = ['bosque', 'pantano', 'selva', 'ruinas', 'colinas', 'cristal'];
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  for (const k of RZ_SITES) { const w = WAYSTONES.find(w => w.k === k); if (!w) continue;
    for (let r = 4; r < 14; r++) { const cx = w.x + r, cy = w.y - 3; let ok = true; for (let dy = -1; dy <= 1 && ok; dy++) for (let dx = -1; dx <= 1 && ok; dx++) { if (!W.inb(cx + dx, cy + dy)) { ok = false; break; } const i = W.I(cx + dx, cy + dy); if (W.objAt[i] >= 0 || SOLID_T[W.ter[i]] || [T.WATER, T.DEEP, T.STAIRS, T.BRIDGE, T.COBBLE].includes(W.ter[i])) ok = false; }
      if (!ok) continue; addObj(W, 'furn', cx, cy, { f: 'tr_cofre', xact: 'rz_chest', rz: k }); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) addObj(W, 'furn', cx + dx, cy + dy, { f: 'tr_raiz', xact: 'rz_root', rz: k }); break; } } }; }
XACT.rz_root = [L2('Raíces espinosas: quémalas con fuego', 'Thorny roots: burn them with fire'), 'atk', o => { const P = G.P, w = fgW(); if (w && w.fg && w.fg.rune === 'fuego') { elBurnRoots(o.px, o.py, 30); return; } toast(L2('Necesitas fuego: una habilidad de fuego, un arma con runa de fuego o una poción explosiva.', 'You need fire: a fire skill, a weapon with a fire rune or an explosive potion.'), 'info'); }];
XACT.rz_chest = [L2('Abrir el cofre', 'Open the chest'), 'bag', o => { const P = G.P; P.rzD = P.rzD || {}; if (P.rzD[o.rz] === calDay()) { toast(L2('Ya lo abriste hoy. Las raíces vuelven a crecer cada día.', 'You already opened it today. The roots grow back every day.'), 'info'); return; }
  P.rzD[o.rz] = calDay(); const g = Math.round(800 * (1 + P.lv / 25)); P.gold += g; floatText(o.px, o.py - 30, '+' + fmt(g) + ' ' + L2('oro', 'gold'), '#ffd040'); const t = clamp(Math.ceil(P.lv / 15), 1, 7); giveItem('ore' + t, 3); giveItem('herb' + t, 3); if (Math.random() < 0.3) giveItem('elixir', 1); sfx('coin'); markDirty(true); }];
function elBurnRoots(x, y, r) { const M = G.map; if (!M || !M.isWorld) return; let n = 0; for (const o of M.objs) { if (o.xact !== 'rz_root' || o.hidden || dist2(o.px, o.py, x, y) > r * r) continue; o.hidden = true; o.burnD = calDay(); const i = M.I(o.tx, o.ty); M.solidO[i] = 0; n++; burst(o.px, o.py - 10, 10, { sp: 40, up: 60, g: -20, life: 0.8, c: ['#ff6a1a', '#ffd040', '#3a2a1a'] }); }
  if (n) { floatText(x, y - 40, L2('¡Las raíces arden!', 'The roots burn!'), '#ff8a2a'); sfx('boom'); } }
let rzT = 0; V33_TICKS.push(dt => { rzT += dt || 0; if (rzT < 3) return; rzT = 0; const W = G.world; if (!W || !G.P) return; for (const o of W.objs) if (o.xact === 'rz_root' && o.hidden && o.burnD !== calDay() && dist2(o.px, o.py, G.P.x, G.P.y) > 80 * 80) { o.hidden = false; W.solidO[W.I(o.tx, o.ty)] = 1; } });
// la poción explosiva también quema raíces
{ const _ax = axApply; axApply = function (P, a) { if (a && a[4] && a[4].boom) elBurnRoots(P.x, P.y, 100); return _ax.apply(this, arguments); }; }

// =====================================================================================
// PARTES VULNERABLES DE JEFES (no todos)
// =====================================================================================
const BP = {
  golemhielo: { n: L2('Cristal de escarcha', 'Frost crystal'), col: '#8ad8ff', share: 0.35, fire: 2, d: L2('Mientras brille, el gólem se regenera.', 'While it glows, the golem regenerates.'), brk: L2('¡Cristal destruido! El gólem ya no se regenera y recibe más daño.', 'Crystal destroyed! The golem no longer regenerates and takes more damage.'), dy: 0.55 },
  vael: { n: L2('Escudo real', 'Royal shield'), col: '#ffd040', share: 0.5, red: 0.4, parry: 1, d: L2('Bloquea gran parte del daño. Un contraataque perfecto lo rompe.', 'Blocks much of the damage. A perfect counter breaks it.'), brk: L2('¡Escudo roto! Vael se enfurece: más rápido y más fuerte.', 'Shield broken! Vael is enraged: faster and stronger.'), dy: 0.45 },
  gruk: { n: L2('Tambor de guerra', 'War drum'), col: '#c87a3a', share: 0.4, d: L2('Mientras suene, llegan refuerzos orcos.', 'While it sounds, orc reinforcements arrive.'), brk: L2('¡Tambor roto! Ya no llegan refuerzos y Gruk queda aturdido.', 'Drum broken! No more reinforcements and Gruk is stunned.'), dy: 0.4 },
  ent: { n: L2('Raíz corazón', 'Heart root'), col: '#6ad04a', share: 0.35, fire: 3, red: 0.3, nofire: 1, d: L2('Lo protege del daño que no sea de fuego.', 'Protects it from non-fire damage.'), brk: L2('¡Raíz corazón quemada! El Ent queda atrapado unos segundos.', 'Heart root burnt! The Ent is stuck for a few seconds.'), dy: 0.6 },
  reyslime: { n: L2('Corona pegajosa', 'Sticky crown'), col: '#ffe040', share: 0.4, d: L2('Mientras la lleve, sus saltos aturden más.', 'While he wears it, his jumps stun longer.'), brk: L2('¡Corona caída! El Rey Slime se ralentiza.', 'Crown knocked off! The Slime King slows down.'), dy: 0.85 },
};
{ const _sm = spawnMob; spawnMob = function (mid, lv, x, y, L, camp, boss) { const e = _sm.apply(this, arguments); if (e && boss && BP[mid]) { e.bp = { hp: Math.round(e.maxhp * 0.12), max: Math.round(e.maxhp * 0.12), on: true }; e.bpT = 0; } return e; }; }
function bpMod(m, base, src) { const B = m.boss && m.bp && m.bp.on && BP[m.mid]; if (!m.boss || !m.bp) return base; if (!B) return m.bp.broken && m.mid === 'golemhielo' ? base * 1.15 : base;
  if (B.red && !(B.nofire && (src.fire || (G.P._el && G.P._el.k === 'fire' && G.t - G.P._el.t < 2.5)))) base *= 1 - B.red; return base; }
function bpHit(m, d, src, k) { const B = m && m.boss && m.bp && m.bp.on && BP[m.mid]; if (!B || !d) return; const fire = k === 'fire' || src && src.fire; m.bp.hp -= d * B.share * (fire && B.fire ? B.fire : 1); if (m.bp.hp <= 0) bpBreak(m); }
function bpBreak(m) { const B = BP[m.mid]; if (!m.bp || !m.bp.on) return; m.bp.on = false; m.bp.broken = true; banner(B.n, B.brk); sfx('boom'); G.shake = Math.max(G.shake, 8); burst(m.x, m.y - (m.hgt || 40) * B.dy, 26, { sp: 140, up: 50, g: 90, life: 0.7, c: [B.col, '#ffffff'] });
  if (m.mid === 'vael') { m.spd *= 1.3; m.atk = Math.round(m.atk * 1.15); } if (m.mid === 'gruk') m.stun = Math.max(m.stun || 0, 2.5); if (m.mid === 'ent') m.root = Math.max(m.root || 0, 4); if (m.mid === 'reyslime') m.spd *= 0.75; }
{ const _pp = perfectParry; perfectParry = function () { const r = _pp.apply(this, arguments); const P = G.P; for (const m of G.ents) if (m.boss && m.bp && m.bp.on && BP[m.mid] && BP[m.mid].parry && dist2(m.x, m.y, P.x, P.y) < 130 * 130) bpBreak(m); return r; }; }
let bpTick = 0; V33_TICKS.push(dt => { bpTick += dt || 0; if (bpTick < 1) return; bpTick = 0; for (const m of G.ents) { if (!m.boss || !m.bp || !m.bp.on || m.dying) continue;
    if (m.mid === 'golemhielo' && m.hp < m.maxhp) { m.hp = Math.min(m.maxhp, m.hp + m.maxhp * 0.006); }
    if (m.mid === 'gruk' && m.state !== 'idle' && (m.bpT = (m.bpT || 0) + 1) % 12 === 0 && typeof spawnMob === 'function' && MOBS.orco) { for (let k = 0; k < 2; k++) { const e = spawnMob('orco', Math.max(1, m.lv - 4), m.x + (k ? 30 : -30), m.y + 20, m.L, null, false); if (e) { e.state = 'chase'; e.summoned = 1; } } floatText(m.x, m.y - 70, L2('¡BUM, BUM!', 'BOOM, BOOM!'), '#c87a3a'); }
    if (m.mid === 'reyslime' && G.P.stun > 0) G.P.stun += 0.3; } });
WORLD_DRAW.push((cx, cy) => { for (const m of G.ents) { if (!m.boss || !m.bp || !m.bp.on || m.dying || m.map !== G.P.map && !(G.map.isWorld && m.map === 'world')) continue; const B = BP[m.mid]; if (!B) continue; const x = m.x - cx, y = m.y - cy - (m.hgt || 40) * B.dy; if (x < -40 || x > VW + 40) continue;
    const pulse = 0.6 + 0.4 * Math.sin(G.t * 5); ctx.globalAlpha = pulse; ctx.fillStyle = B.col; ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x + 5, y); ctx.lineTo(x, y + 6); ctx.lineTo(x - 5, y); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke();
    const w = 34, f = Math.max(0, m.bp.hp / m.bp.max); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(Math.round(x - w / 2), Math.round(y + 10), w, 4); ctx.fillStyle = B.col; ctx.fillRect(Math.round(x - w / 2), Math.round(y + 10), Math.round(w * f), 4); } });
// al aparecer un jefe con parte vulnerable, se explica
let bpSeen = new Set(); V33_TICKS.push(() => { for (const m of G.ents) if (m.boss && m.bp && m.bp.on && !bpSeen.has(m) && G.P && dist2(m.x, m.y, G.P.x, G.P.y) < 200 * 200) { bpSeen.add(m); toast('🎯 ' + BP[m.mid].n + ': ' + BP[m.mid].d, 'quest', 6); } });

// =====================================================================================
// ENEMIGOS QUE TRABAJAN EN EQUIPO: guardianes (protegen) y curanderos (curan). Los arqueros ya se alejan.
// =====================================================================================
const TM_ROLE = { guard: [L2('Guardián', 'Guardian'), '#5aa0ff'], healer: [L2('Curandero', 'Healer'), '#6aff6a'] };
{ const _sm = spawnMob; spawnMob = function (mid, lv, x, y, L, camp, boss) { const e = _sm.apply(this, arguments); if (e && !boss && !e.summoned && e.def && e.def.ai !== 'passive' && lv >= 8) { const r = Math.random(); if (r < 0.07) e.role = 'guard'; else if (r < 0.12) e.role = 'healer'; if (e.role) { e.name = TM_ROLE[e.role][0] + ' ' + e.name; if (e.role === 'guard') { e.hp = Math.round(e.hp * 1.6); e.maxhp = e.hp; } } } return e; }; }
function tmGuarded(m) { for (const g of G.ents) if (g !== m && g.role === 'guard' && !g.dying && g.type === 'mob' && g.map === m.map && dist2(g.x, g.y, m.x, m.y) < 70 * 70) return g; return null; }
function tmMod(m, base) { if (m.role === 'guard' || m.boss) return base; const g = tmGuarded(m); if (g) { if (Math.random() < 0.3) floatText(m.x, m.y - (m.hgt || 28) - 10, '🛡', '#5aa0ff'); return base * 0.5; } return base; }
{ const _um = updateMob; updateMob = function (m, dt) { const r = _um.apply(this, arguments); if (!m.role || m.dying || m.stun > 0 || m.freeze > 0) return r;
    if (m.role === 'healer') { m.hlT = (m.hlT || 0) - dt; if (m.hlT <= 0 && m.state !== 'idle') { m.hlT = 4; let best = null; for (const o of G.ents) if (o !== m && o.type === 'mob' && !o.dying && o.map === m.map && o.hp < o.maxhp * 0.9 && dist2(o.x, o.y, m.x, m.y) < 100 * 100 && (!best || o.hp / o.maxhp < best.hp / best.maxhp)) best = o;
        if (best) { const h = Math.round(best.maxhp * 0.1); best.hp = Math.min(best.maxhp, best.hp + h); floatText(best.x, best.y - (best.hgt || 28) - 8, '+' + fmt(h), '#6aff6a'); addFx({ type: 'bolt', x: m.x, y: m.y - 14, x2: best.x, y2: best.y - 14, dur: 0.35, col: '#6aff6a' }); setAnim(m, 'atk'); } }
      const P = G.P, d = Math.hypot(P.x - m.x, P.y - m.y); if (m.state === 'chase' && d < 55) moveEnt(G.map, m, -(P.x - m.x) / d * m.spd * 0.7 * dt, -(P.y - m.y) / d * m.spd * 0.7 * dt); }
    return r; }; }
WORLD_DRAW.push((cx, cy) => { if (!G.P) return; for (const m of G.ents) { if (!m.role || m.dying || m.type !== 'mob' || m.map !== G.P.map && !(G.map.isWorld && m.map === 'world')) continue; const x = Math.round(m.x - cx), y = Math.round(m.y - cy - (m.hgt || 28) - 14); if (x < -20 || x > VW + 20 || y < -20 || y > VH + 20) continue;
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x - 5, y - 5, 10, 10); ctx.fillStyle = TM_ROLE[m.role][1];
    if (m.role === 'healer') { ctx.fillRect(x - 1, y - 4, 2, 8); ctx.fillRect(x - 4, y - 1, 8, 2); } else { ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y - 4); ctx.lineTo(x + 4, y); ctx.lineTo(x, y + 4); ctx.lineTo(x - 4, y); ctx.closePath(); ctx.fill(); }
    if (m.role === 'guard') for (const o of G.ents) if (o !== m && o.type === 'mob' && !o.dying && o.map === m.map && dist2(o.x, o.y, m.x, m.y) < 70 * 70) { ctx.strokeStyle = 'rgba(90,160,255,.35)'; ctx.beginPath(); ctx.moveTo(m.x - cx, m.y - cy - 10); ctx.lineTo(o.x - cx, o.y - cy - 10); ctx.stroke(); } }
  // aros de postura (tú y los demás jugadores)
  const ring = (x, y, c) => { ctx.strokeStyle = c; ctx.globalAlpha = 0.55 + 0.2 * Math.sin(G.t * 4); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(Math.round(x - cx), Math.round(y - cy + 1), 11, 4, 0, 0, 6.29); ctx.stroke(); ctx.globalAlpha = 1; };
  if (G.P.wpos && WM_POS[G.P.wpos]) ring(G.P.x, G.P.y, WM_POS[G.P.wpos][1]); for (const r of G.remote.values()) if (r.wpos && r.map === G.P.map) ring(r.x, r.y, WM_POS[r.wpos][1]); });

// =====================================================================================
// TÉCNICAS COMBINADAS ENTRE CLASES (online y WiFi local): dos jugadores cerca usan una habilidad casi a la vez
// =====================================================================================
const CMB = { 'guerrero+mago': [L2('Espada Electrificada', 'Electrified Blade'), { atkP: 25, cmbShock: 1 }, 0], 'bardo+invocador': [L2('Sinfonía de Almas', 'Symphony of Souls'), { atkP: 30 }, 0], 'arquero+mago': [L2('Lluvia Ígnea', 'Fire Rain'), { atkP: 10 }, 4, 'fire'],
  'bardo+guerrero': [L2('Himno de Guerra', 'War Hymn'), { atkP: 20, defP: 20 }, 0], 'arquero+asesino': [L2('Emboscada Cruzada', 'Cross Ambush'), { pcrit: 25 }, 0], 'mago+pez': [L2('Tormenta Marina', 'Sea Storm'), { atkP: 10 }, 3, 'storm'],
  'guerrero+invocador': [L2('Legión', 'Legion'), { atkP: 15 }, 3], 'asesino+mago': [L2('Sombras Ardientes', 'Burning Shadows'), { atkP: 15, pcrit: 10 }, 2, 'fire'], 'bardo+pez': [L2('Canto de Sirena', 'Siren Song'), { pregen: 1.5, defP: 15 }, 0] };
const CMB_DEF = [L2('Vínculo de Batalla', 'Battle Bond'), { atkP: 15 }, 2];
let cmbMyT = -99, cmbCd = 0;
function cmbPair(a, b) { return [a, b].sort().join('+'); }
function cmbNear() { const P = G.P, out = []; for (const r of G.remote.values()) if (r.map === P.map && dist2(r.x, r.y, P.x, P.y) < 150 * 150 && CLASSES[r.cls || r.c]) out.push(r); return out; }
function cmbTry(r) { const P = G.P; if (G.t < cmbCd || !r) return; const cls = r.cls || r.c, C_ = CMB[cmbPair(P.cls, cls)] || CMB_DEF; cmbCd = G.t + 12;
  addBuff(P, 'combo', Object.assign({}, C_[1]), 8); const mx = (P.x + r.x) / 2, my = (P.y + r.y) / 2;
  banner('✦ ' + C_[0], L2('Técnica combinada con ', 'Combined technique with ') + (r.name || '?')); sfx('level'); addFx({ type: 'ring', x: mx, y: my - 10, r: 70, dur: 0.6, col: '#ffd040' }); burst(mx, my - 14, 30, { sp: 140, up: 60, g: 60, life: 0.8, c: ['#ffd040', '#ffffff', '#ff8af0'] });
  if (C_[2]) for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === P.map && dist2(m.x, m.y, mx, my) < 110 * 110) { if (C_[3] === 'storm') elSet(m, 'wet', 4); hitMob(m, P.S.atk * C_[2], C_[3] === 'fire' ? { fire: 1 } : {}); if (C_[3] === 'storm') { elBusy = false; elReact(m, 'shock', P.S.atk); } } }
function cmbMine(id) { cmbMyT = G.t; if (typeof nfxPush === 'function') nfxPush({ k: 'sk' }); for (const r of cmbNear()) if (G.t - (r.skT || -99) < 1.5) { cmbTry(r); break; } }
{ const _np = nfxPlay; nfxPlay = function (r, ev) { if (ev && ev.k === 'sk') { r.skT = G.t; const P = G.P; if (P && r.map === P.map && G.t - cmbMyT < 1.5 && dist2(r.x, r.y, P.x, P.y) < 150 * 150) cmbTry(r); return; } return _np.apply(this, arguments); }; }
