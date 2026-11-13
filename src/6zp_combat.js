// ================= v3.8: COMBATE — bloqueo y contraataque perfecto, jefes que aprenden, runas del mago, armas malditas que negocian y armas que hablan =================
SAVEKEYS.push('runes', 'runeSpell', 'wsoul');
// ---------- seguimiento de tus ataques (para que los jefes aprendan) ----------
let ATK_ID = 0;
{ const _ba = basicAttack; basicAttack = function () { const P = G.P, cd0 = P.atkCd; const r = _ba.apply(this, arguments); if (P.atkCd > (cd0 || 0)) { ATK_ID++; P.lastAtk = 'basic'; P.lastAtkT = G.t; } return r; }; }
{ const _us = useSkill; useSkill = function (slot) { const P = G.P, id = P.slots[slot]; if (P.lockSlot === slot && id) { toast(L2('Tu arma maldita ha sellado esta habilidad', 'Your cursed weapon has sealed this skill'), 'warn'); return; } const cd0 = id ? (P.cds[id] || 0) : 0; const r = _us(slot); if (id && (P.cds[id] || 0) > cd0) { ATK_ID++; P.lastAtk = id; P.lastAtkT = G.t; } return r; }; }
function atkName(k) { return k === 'basic' ? L2('ataque básico', 'basic attack') : k && k.startsWith('rune:') ? (RUNE_COMBO[k.slice(5)] || {}).n || k : SK[k] ? SK[k].n : k; }
// ---------- 1. BLOQUEO Y CONTRAATAQUE PERFECTO ----------
// Pulsa «Bloquear» justo antes del golpe: los primeros 0,2 s son un bloqueo perfecto (contraataque y rompe la guardia del enemigo).
// El resto de la ventana (hasta 0,45 s) reduce el daño un 60 %. Tiene 3 s de recarga, así que hay que atinar.
const BLK = { win: 0.45, perfect: 0.2, cd: 3 };
function doBlock() { const P = G.P; if (!P || P.dead || P.job || P.fishing) return; if (G.t < (P.blockCd || 0)) return; P.blockStart = G.t; P.blockT = G.t + BLK.win; P.blockCd = G.t + BLK.cd; setAnim(P, 'idle'); addFx({ type: 'custom', x: P.x, y: P.y, dur: BLK.win, draw: (f, x, y, k) => { ctx.strokeStyle = `rgba(160,220,255,${(1 - k).toFixed(2)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 14, 14 + k * 4, 0, 7); ctx.stroke(); } }); sfx('equip'); }
{ const _hp = hurtPlayer; hurtPlayer = function (base, src = {}) { const P = G.P;
  if (P && !P.dead && P.blockT && G.t < P.blockT && !(src && src.noBlock)) {
    const perfect = G.t - P.blockStart <= BLK.perfect; P.blockT = 0;
    if (perfect) { perfectParry(); return; }
    floatText(P.x, P.y - 40, L2('BLOQUEO', 'BLOCK'), '#a0e0ff'); base *= 0.4; }
  if (P && P.curseAggro) base *= 1.2;
  return _hp(base, src); }; }
function perfectParry() {
  const P = G.P; let m = null, best = 110 * 110; for (const e of G.ents) if (e.type === 'mob' && !e.dying && e.map === P.map && !e.ghost) { const d = dist2(e.x, e.y, P.x, P.y); if (d < best) { best = d; m = e; } }
  P.ifr = Math.max(P.ifr || 0, 0.5); G.hitstop = Math.max(G.hitstop, 0.18); G.shake = Math.max(G.shake, 6); sfx('crit'); vibrate(40);
  floatText(P.x, P.y - 48, L2('¡CONTRAATAQUE!', 'COUNTER!'), '#ffd040', true);
  addFx({ type: 'ring', x: P.x, y: P.y - 10, r: 42, dur: 0.35, col: '#ffd040' }); burst(P.x, P.y - 14, 18, { sp: 120, up: 40, g: 60, life: 0.5, c: ['#ffd040', '#ffffff', '#a0e0ff'] });
  P.parries = (P.parries || 0) + 1; if (typeof passEvent === 'function') passEvent('parry');
  if (!m) return; P.dir = dirFromVec(m.x - P.x, m.y - P.y); setAnim(P, 'atk'); const a = Math.atan2(m.y - P.y, m.x - P.x);
  addFx({ type: 'slash', x: P.x, y: P.y - 10, ang: a, arc: 2.6, r: 46, dur: 0.3, col: 'rgba(255,220,90,0.9)' });
  addFx({ type: 'custom', x: m.x, y: m.y, dur: 0.5, draw: (f, x, y, k) => { ctx.strokeStyle = `rgba(255,240,180,${(1 - k).toFixed(2)})`; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { const an = i * 1.57 + k * 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * 6, y - 14 + Math.sin(an) * 6); ctx.lineTo(x + Math.cos(an) * (16 + k * 26), y - 14 + Math.sin(an) * (16 + k * 26)); ctx.stroke(); } } });
  m.guardBrk = G.t + 5; m.armorT = 0; floatText(m.x, m.y - (m.hgt || 30) - 12, L2('¡GUARDIA ROTA!', 'GUARD BROKEN!'), '#ff9a4a');
  hitMob(m, P.S.atk * (m.boss ? 2.2 : 3), { stun: 1.5, critB: 40, kb: 80 }); }
{ const _hm = hitMob; hitMob = function (m, base, src = {}) {
  const P = G.P;
  // guardia rota: +35 % de daño
  if (m && m.guardBrk > G.t) base *= 1.35;
  // jefes que aprenden: si repites mucho el mismo ataque, empiezan a esquivarlo
  if (m && m.boss && !m.dying && !src.summon && !src.noLearn) { const key = (P.lastAtkT && G.t - P.lastAtkT < 1.5) ? P.lastAtk : 'basic'; m.learn = m.learn || {}; const L = m.learn[key] = m.learn[key] || { n: 0, t: G.t, seen: -1 };
    L.n = Math.max(0, L.n - (G.t - L.t) / 5); L.t = G.t; if (L.seen !== ATK_ID) { L.seen = ATK_ID; L.n += 1; if (L.n >= 5 && !L.told) { L.told = 1; toast((m.name || m.def.n) + ' ' + L2('ha aprendido tu', 'has learned your') + ' ' + atkName(key) + L2(': ¡cambia de ataque!', ': switch it up!'), 'warn', 4); } }
    const ch = Math.min(0.45, Math.max(0, (L.n - 4) * 0.12)); if (ch > 0 && m.stun <= 0 && Math.random() < ch) { floatText(m.x, m.y - (m.hgt || 30), L2('ESQUIVA', 'DODGE'), '#c8a0ff'); const a = Math.atan2(m.y - P.y, m.x - P.x) + (Math.random() < 0.5 ? 1.57 : -1.57), nx = m.x + Math.cos(a) * 22, ny = m.y + Math.sin(a) * 16; if (!blockedFor(G.map, Math.floor(nx / 16), Math.floor(ny / 16), m.L)) { addFx({ type: 'ring', x: m.x, y: m.y - 10, r: 14, dur: 0.25, col: '#c8a0ff' }); m.x = nx; m.y = ny; } return 0; } }
  const d = _hm(m, base, src);
  if (m && m.boss && !m.dying && d > 0) bossPhaseCheck(m);
  if (P.equip && P.equip.weapon && P.equip.weapon.pact && !src.summon && m && m.hp <= 0) cursedKill();
  return d; }; }
// ---------- 2. JEFES CON INTELIGENCIA: fases y terreno roto ----------
const PHASE_MV = ['rain', 'field', 'nova', 'volley', 'hop'];
function bossPhaseCheck(m) {
  const f = m.hp / m.maxhp, ph = f < 0.33 ? 2 : f < 0.66 ? 1 : 0; if (ph <= (m.phase || 0)) return; m.phase = ph;
  banner((m.name || m.def.n) + ' · ' + L2('Fase ', 'Phase ') + (ph + 1), ph === 1 ? L2('¡Rompe el suelo! Cuidado con las grietas', 'It breaks the ground! Watch the cracks') : L2('¡Furia final! Ataca más rápido', 'Final fury! It attacks faster'));
  m.extraMv = (m.extraMv || []).concat([PHASE_MV[(m.mid || '').length % PHASE_MV.length], PHASE_MV[((m.mid || '').length + ph) % PHASE_MV.length]]);
  if (ph === 2) m.spd = Math.round(m.spd * 1.15);
  G.shake = Math.max(G.shake, 8); sfx('boom');
  // grietas: el terreno se rompe alrededor del jefe (avisan antes de hacer daño)
  const n = 4 + ph * 2; for (let k = 0; k < n; k++) { const a = k / n * 6.28 + Math.random() * 0.5, r = 40 + Math.random() * 70, x = m.x + Math.cos(a) * r, y = m.y + Math.sin(a) * r * 0.7; crackAt(x, y, 0.8 + k * 0.12, m); }
}
function crackAt(x, y, delay, m) {
  addFx({ type: 'custom', ground: true, x, y, dur: delay, draw: (f, sx, sy, k) => { ctx.strokeStyle = `rgba(40,20,10,${(0.4 + k * 0.5).toFixed(2)})`; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 5; i++) { const an = i * 1.26 + (x % 7); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(an) * 20 * k, sy + Math.sin(an) * 12 * k); } ctx.stroke(); } });
  setTimeout(() => { if (!m || m.dying) return; addFx({ type: 'field', ground: true, x, y, r: 22, dur: 5, col: '#3a1a0a', pc: '#ff7a2a', tick: 0.6, cbTick: f => { const P = G.P; if (dist2(P.x, P.y, f.x, f.y) < f.r * f.r) hurtPlayer(m.atk * 0.25, { burn: 1, noBlock: 1 }); } }); burst(x, y, 10, { sp: 70, up: 60, g: 140, life: 0.6, c: ['#5a3a20', '#8a6a4a', '#ff8a3a'] }); }, delay * 1000);
}
{ const _pb = pickBossMove; pickBossMove = function (m, d) { if (m.extraMv && m.extraMv.length && Math.random() < 0.3) return pick(m.extraMv); return _pb(m, d); }; }
// cuando el jefe esquiva, vuelve a «olvidar» si no repites el ataque
// ---------- 3. RUNAS COMBINABLES (mago) ----------
const RUNES2 = {
  fuego: [L2('Fuego', 'Fire'), '#ff6a2a', 'ᚠ'], hielo: [L2('Hielo', 'Ice'), '#8ad8ff', 'ᛁ'], rayo: [L2('Rayo', 'Lightning'), '#ffe85a', 'ᛋ'], viento: [L2('Viento', 'Wind'), '#a8ffd0', 'ᚹ'],
  cadena: [L2('Cadena', 'Chain'), '#c8c8d8', 'ᚲ'], explosion: [L2('Explosión', 'Explosion'), '#ff9a4a', 'ᛟ'], luz: [L2('Luz', 'Light'), '#fff4b0', 'ᛞ'], sombra: [L2('Sombra', 'Shadow'), '#9a6aff', 'ᛉ'],
};
const RUNE_COMBO = {
  'cadena+fuego': { n: L2('Látigo Ardiente', 'Burning Whip'), k: 'whip', m: 2.4, mp: 30, cd: 6, d: L2('Un látigo de fuego barre todo lo que tienes delante y lo deja ardiendo.', 'A whip of fire sweeps everything in front of you and leaves it burning.') },
  'explosion+hielo': { n: L2('Tormenta de Cristales', 'Crystal Storm'), k: 'shards', m: 0.9, mp: 45, cd: 10, d: L2('Llueven 10 cristales de hielo sobre la zona y congelan a los enemigos.', '10 ice crystals rain over the area and freeze enemies.') },
  'cadena+rayo': { n: L2('Cadena de Relámpagos', 'Chain Lightning'), k: 'chain', m: 1.8, mp: 35, cd: 7, d: L2('Un rayo salta entre 6 enemigos y los aturde.', 'A bolt jumps between 6 enemies and stuns them.') },
  'explosion+fuego': { n: L2('Meteoro', 'Meteor'), k: 'meteor', m: 4.2, mp: 60, cd: 14, d: L2('Un meteoro cae sobre tu objetivo con una explosión enorme.', 'A meteor falls on your target with a huge explosion.') },
  'hielo+viento': { n: L2('Ventisca', 'Blizzard'), k: 'vortex', m: 0.5, mp: 40, cd: 12, d: L2('Un remolino helado avanza arrastrando y ralentizando enemigos.', 'An icy whirlwind moves forward dragging and slowing enemies.') },
  'explosion+rayo': { n: L2('Nova Tronante', 'Thunder Nova'), k: 'nova', m: 2.2, mp: 40, cd: 9, d: L2('Una onda eléctrica a tu alrededor que aturde a todos.', 'An electric wave around you that stuns everyone.') },
  'cadena+viento': { n: L2('Garfio de Viento', 'Wind Hook'), k: 'pull', m: 1.2, mp: 25, cd: 8, d: L2('Atrae a los enemigos cercanos hasta ti.', 'Pulls nearby enemies to you.') },
  'explosion+luz': { n: L2('Estallido Solar', 'Solar Burst'), k: 'solar', m: 2, mp: 50, cd: 12, d: L2('Un sol en miniatura: daña a los enemigos y te cura.', 'A miniature sun: damages enemies and heals you.') },
  'cadena+sombra': { n: L2('Grilletes del Vacío', 'Void Shackles'), k: 'root', m: 1.4, mp: 35, cd: 10, d: L2('Cadenas de sombra inmovilizan a los enemigos 3 segundos.', 'Shadow chains pin enemies down for 3 seconds.') },
  'fuego+viento': { n: L2('Torbellino Ígneo', 'Fire Tornado'), k: 'firespin', m: 0.6, mp: 40, cd: 10, d: L2('Un torbellino de fuego gira a tu alrededor durante 4 segundos.', 'A fire tornado spins around you for 4 seconds.') },
  'cadena+hielo': { n: L2('Prisión Gélida', 'Frozen Prison'), k: 'prison', m: 3, mp: 35, cd: 9, d: L2('Encierra a tu objetivo en hielo y le hace mucho daño.', 'Locks your target in ice and deals heavy damage.') },
  'luz+viento': { n: L2('Alas de Luz', 'Wings of Light'), k: 'wings', m: 0, mp: 30, cd: 20, d: L2('Te salen alas de luz: más velocidad y un escudo durante 8 s.', 'Wings of light sprout from you: more speed and a shield for 8 s.') },
  'explosion+sombra': { n: L2('Implosión', 'Implosion'), k: 'implode', m: 3, mp: 55, cd: 12, d: L2('Un punto negro absorbe a los enemigos y luego estalla.', 'A black point sucks enemies in and then explodes.') },
  'fuego+hielo': { n: L2('Vapor Hirviente', 'Scalding Steam'), k: 'steam', m: 0.4, mp: 30, cd: 9, d: L2('Una nube de vapor que quema y ciega a los enemigos.', 'A cloud of steam that burns and blinds enemies.') },
  'luz+sombra': { n: L2('Equilibrio', 'Balance'), k: 'balance', m: 2.6, mp: 45, cd: 11, d: L2('Luz y sombra golpean juntas: daño en cruz que ignora la mitad de la defensa.', 'Light and shadow strike together: cross-shaped damage that ignores half the defense.') },
};
function runeKey(a, b) { return [a, b].sort().join('+'); }
function giveRune(k, quiet) { const P = G.P; P.runes = P.runes || []; if (P.runes.includes(k)) return false; P.runes.push(k); if (!quiet) { banner(L2('¡Runa descubierta!', 'Rune discovered!'), RUNES2[k][2] + ' ' + RUNES2[k][0] + ' · ' + L2('Combínala en el Grimorio de Runas', 'Combine it in the Rune Grimoire')); sfx('level'); } markDirty(); return true; }
{ const _km = killMob; killMob = function (m) { const r = _km(m); const P = G.P; if (P && P.cls === 'mago' && P.lv >= 15 && m) { const miss = Object.keys(RUNES2).filter(k => !(P.runes || []).includes(k)); if (miss.length && Math.random() < (m.boss ? 0.4 : 0.006)) giveRune(pick(miss)); } return r; }; }
V33_TICKS.push(() => { const P = G.P; if (P && P.cls === 'mago' && P.lv >= 15 && !(P.runes || []).length) { giveRune('fuego', true); giveRune('cadena', true); banner(L2('Grimorio de Runas', 'Rune Grimoire'), L2('Has descubierto Fuego y Cadena. Combínalas: ¡Látigo Ardiente!', 'You discovered Fire and Chain. Combine them: Burning Whip!')); } });
let runeSel = [];
function openRunes() {
  const P = G.P, R = P.runes || []; const k = runeSel.length === 2 ? runeKey(runeSel[0], runeSel[1]) : null, C_ = k && RUNE_COMBO[k];
  openModal(`<h2>${iconHTML(['book'], 22)} ${L2('Grimorio de Runas', 'Rune Grimoire')}</h2><p class="hint">${L2('Elige dos runas para inventar un hechizo. Descubres runas nuevas derrotando enemigos (sobre todo jefes).', 'Pick two runes to invent a spell. You discover new runes by defeating enemies (bosses especially).')} ${R.length}/8</p>
    <div class="runes">${Object.keys(RUNES2).map(r => R.includes(r) ? `<button class="rune ${runeSel.includes(r) ? 'on' : ''}" data-rn="${r}" style="--rc:${RUNES2[r][1]}"><b>${RUNES2[r][2]}</b><span>${esc(RUNES2[r][0])}</span></button>` : `<button class="rune off" disabled><b>?</b><span>???</span></button>`).join('')}</div>
    <div class="rres">${k ? (C_ ? `<b>${esc(C_.n)}</b><small>${esc(C_.d)} · ${C_.mp} ${L2('maná', 'mana')} · ${C_.cd} s</small><button class="btn gold sm" id="rEq">${L2('Usar este hechizo', 'Use this spell')}</button>` : `<small>${L2('Estas dos runas no reaccionan entre sí. Prueba otra combinación.', 'These two runes don\'t react with each other. Try another combination.')}</small>`) : `<small>${L2('Hechizo actual', 'Current spell')}: <b>${P.runeSpell && RUNE_COMBO[P.runeSpell] ? esc(RUNE_COMBO[P.runeSpell].n) : '—'}</b></small>`}</div>
    <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  $$('#modal [data-rn]').forEach(b => b.onclick = () => { const r = b.dataset.rn; if (runeSel.includes(r)) runeSel = runeSel.filter(x => x !== r); else { runeSel.push(r); if (runeSel.length > 2) runeSel.shift(); } sfx('ui'); openRunes(); });
  const eq = $('#rEq'); if (eq) eq.onclick = () => { P.runeSpell = k; runeSel = []; toast(L2('Hechizo de runas listo: ', 'Rune spell ready: ') + C_.n, 'quest'); markDirty(); closeModal(); };
}
let runeCdT = 0;
function castRune() {
  const P = G.P, k = P.runeSpell, C_ = RUNE_COMBO[k]; if (!C_ || P.dead || P.busy > 0) return; if (G.t < runeCdT) return; if (P.mp < C_.mp) { toast(L2('Maná insuficiente', 'Not enough mana'), 'warn'); return; }
  P.mp -= C_.mp; runeCdT = G.t + C_.cd; ATK_ID++; P.lastAtk = 'rune:' + k; P.lastAtkT = G.t; setAnim(P, 'atk'); sfx('cast');
  const atk = P.S.atk * (1 + (P.S.skillP || 0) / 100), tgt = nearestMob(P.x, P.y, 200), a = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : dirAng(P.dir);
  const [r1, r2] = k.split('+').map(r => RUNES2[r][1]); const mobsIn = (x, y, r) => G.ents.filter(e => e.type === 'mob' && !e.dying && e.map === P.map && dist2(e.x, e.y, x, y) < r * r);
  const sparks = (x, y, n, cols) => burst(x, y, n, { sp: 90, up: 40, g: 60, life: 0.6, c: cols });
  switch (C_.k) {
    case 'whip': { addFx({ type: 'custom', x: P.x, y: P.y, dur: 0.45, draw: (f, x, y, kk) => { ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.strokeStyle = i ? r1 : '#fff4c0'; ctx.globalAlpha = 1 - kk; ctx.beginPath(); for (let s = 0; s <= 12; s++) { const t = s / 12, rr = 20 + t * 110 * Math.min(1, kk * 3), an = a - 0.9 + kk * 1.8 * t + Math.sin(t * 9 + kk * 20) * 0.08; const px = x + Math.cos(an) * rr, py = y - 12 + Math.sin(an) * rr * 0.75; s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } ctx.globalAlpha = 1; } });
      for (const m of mobsIn(P.x, P.y, 130)) { const da = Math.abs(((Math.atan2(m.y - P.y, m.x - P.x) - a + 9.42) % 6.28) - 3.14); if (da < 1.1) { hitMob(m, atk * C_.m, { burn: 1, fire: 1 }); sparks(m.x, m.y - 12, 6, [r1, '#ffd040']); } } break; }
    case 'shards': { const cx_ = tgt ? tgt.x : P.x + Math.cos(a) * 80, cy_ = tgt ? tgt.y : P.y + Math.sin(a) * 60; for (let i = 0; i < 10; i++) { const x = cx_ + (Math.random() - 0.5) * 110, y = cy_ + (Math.random() - 0.5) * 70; setTimeout(() => telegraph({ shape: 'circle', x, y, r: 22, dur: 0.5, col: 'rgba(140,220,255,0.25)', cb: () => { addFx({ type: 'custom', x, y, dur: 0.4, draw: (f, sx, sy, kk) => { ctx.fillStyle = '#c8f0ff'; ctx.globalAlpha = 1 - kk; ctx.beginPath(); ctx.moveTo(sx, sy - 40 + kk * 40); ctx.lineTo(sx - 4, sy - 22 + kk * 22); ctx.lineTo(sx + 4, sy - 22 + kk * 22); ctx.fill(); ctx.globalAlpha = 1; } }); sparks(x, y, 8, ['#8ad8ff', '#ffffff']); for (const m of mobsIn(x, y, 24)) hitMob(m, atk * C_.m, { freeze: 1.2 }); }, enemy: false }), i * 90); } break; }
    case 'chain': { let cur = { x: P.x, y: P.y - 12 }; const hit = new Set(); const pts = [[cur.x, cur.y]]; for (let i = 0; i < 6; i++) { let best = null, bd = 140 * 140; for (const m of mobsIn(cur.x, cur.y, 140)) { if (hit.has(m)) continue; const d = dist2(m.x, m.y, cur.x, cur.y); if (d < bd) { bd = d; best = m; } } if (!best) break; hit.add(best); pts.push([best.x, best.y - 14]); hitMob(best, atk * C_.m * (1 - i * 0.08), { stun: 0.6 }); cur = { x: best.x, y: best.y }; }
      addFx({ type: 'custom', x: 0, y: 0, dur: 0.35, draw: (f, sx, sy, kk) => { const cx0 = G.cam.x, cy0 = G.cam.y; ctx.strokeStyle = kk < 0.5 ? '#ffffff' : r1; ctx.lineWidth = 2; ctx.beginPath(); pts.forEach(([x, y], i) => { const px = x - cx0 + (i ? (Math.random() - 0.5) * 4 : 0), py = y - cy0 + (i ? (Math.random() - 0.5) * 4 : 0); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); } }); break; }
    case 'meteor': { const x = tgt ? tgt.x : P.x + Math.cos(a) * 90, y = tgt ? tgt.y : P.y + Math.sin(a) * 70; telegraph({ shape: 'circle', x, y, r: 60, dur: 1, col: 'rgba(255,120,40,0.25)', enemy: false, cb: () => { G.shake = Math.max(G.shake, 7); sparks(x, y, 40, ['#ff6a2a', '#ffd040', '#5a2a1a']); addFx({ type: 'ring', x, y, r: 70, dur: 0.5, col: '#ff8a3a' }); for (const m of mobsIn(x, y, 60)) hitMob(m, atk * C_.m, { burn: 1, fire: 1, kb: 60 }); } });
      addFx({ type: 'custom', x, y, dur: 1, draw: (f, sx, sy, kk) => { const yy = sy - 160 * (1 - kk); ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.arc(sx + 60 * (1 - kk), yy, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(sx + 60 * (1 - kk), yy, 5, 0, 7); ctx.fill(); } }); break; }
    case 'vortex': { const v = { x: P.x, y: P.y, vx: Math.cos(a) * 60, vy: Math.sin(a) * 45 }; addFx({ type: 'custom', x: v.x, y: v.y, dur: 4, tick: 0, draw: (f, sx, sy, kk) => { f.x += v.vx / 60; f.y += v.vy / 60; ctx.strokeStyle = 'rgba(200,240,255,0.7)'; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(sx, sy - 10 - i * 8, 20 - i * 4, 7 - i, G.t * 6 + i, 0, 5); ctx.stroke(); } if (Math.random() < 0.5) part(f.x + (Math.random() - 0.5) * 30, f.y, { z: Math.random() * 20, vz: 10, life: 0.7, c: '#e0f6ff', s: 2 }); if ((f.tick = (f.tick || 0) + 1) % 20 === 0) for (const m of mobsIn(f.x, f.y, 40)) { hitMob(m, atk * C_.m, { slow: 2 }); if (!m.boss) { m.x += (f.x - m.x) * 0.3; m.y += (f.y - m.y) * 0.3; } } } }); break; }
    case 'nova': { addFx({ type: 'custom', x: P.x, y: P.y, dur: 0.5, draw: (f, sx, sy, kk) => { ctx.strokeStyle = r1; ctx.lineWidth = 3; ctx.globalAlpha = 1 - kk; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const an = i / 24 * 6.28, rr = 90 * kk + (i % 2 ? 6 : -6); i ? ctx.lineTo(sx + Math.cos(an) * rr, sy - 10 + Math.sin(an) * rr * 0.7) : ctx.moveTo(sx + Math.cos(an) * rr, sy - 10 + Math.sin(an) * rr * 0.7); } ctx.stroke(); ctx.globalAlpha = 1; } }); for (const m of mobsIn(P.x, P.y, 90)) hitMob(m, atk * C_.m, { stun: 1.4 }); G.shake = Math.max(G.shake, 4); break; }
    case 'pull': { for (const m of mobsIn(P.x, P.y, 150)) { if (!m.boss) { const d = Math.sqrt(dist2(m.x, m.y, P.x, P.y)) || 1; m.x += (P.x - m.x) * (1 - 26 / d); m.y += (P.y - m.y) * (1 - 26 / d); } hitMob(m, atk * C_.m, { slow: 1.5 }); sparks(m.x, m.y - 10, 5, [r1, '#ffffff']); } addFx({ type: 'ring', x: P.x, y: P.y - 8, r: 150, dur: 0.4, col: r1 }); break; }
    case 'solar': { addFx({ type: 'custom', x: P.x, y: P.y, dur: 0.8, light: 90, draw: (f, sx, sy, kk) => { ctx.fillStyle = `rgba(255,240,170,${(0.7 * (1 - kk)).toFixed(2)})`; ctx.beginPath(); ctx.arc(sx, sy - 20, 10 + kk * 70, 0, 7); ctx.fill(); } }); for (const m of mobsIn(P.x, P.y, 80)) hitMob(m, atk * C_.m, { burn: 1 }); P.hp = Math.min(P.S.maxhp, P.hp + Math.round(P.S.maxhp * 0.18)); floatText(P.x, P.y - 40, '+' + Math.round(P.S.maxhp * 0.18), '#7aff7a'); break; }
    case 'root': { for (const m of mobsIn(P.x, P.y, 140)) { hitMob(m, atk * C_.m, { root: 3 }); const mm = m; addFx({ type: 'custom', x: m.x, y: m.y, dur: 3, draw: (f, sx, sy, kk) => { sx = mm.x - G.cam.x; sy = mm.y - G.cam.y; ctx.strokeStyle = 'rgba(150,100,255,0.85)'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { const an = i * 1.57 + 0.6; ctx.beginPath(); ctx.moveTo(sx + Math.cos(an) * 18, sy + Math.sin(an) * 10); ctx.lineTo(sx, sy - 10); ctx.stroke(); } } }); } break; }
    case 'firespin': { addFx({ type: 'custom', x: P.x, y: P.y, dur: 4, draw: (f, sx, sy, kk) => { sx = G.P.x - G.cam.x; sy = G.P.y - G.cam.y; for (let i = 0; i < 8; i++) { const an = G.t * 7 + i * 0.785; ctx.fillStyle = i % 2 ? '#ff6a2a' : '#ffd040'; ctx.fillRect(sx + Math.cos(an) * 34 - 2, sy - 12 + Math.sin(an) * 22 - 2, 5, 5); } if ((f.tk = (f.tk || 0) + 1) % 15 === 0) for (const m of mobsIn(G.P.x, G.P.y, 44)) hitMob(m, atk * C_.m, { burn: 1, fire: 1 }); } }); break; }
    case 'prison': { if (!tgt) { toast(L2('No hay objetivo', 'No target'), 'warn'); P.mp += C_.mp; runeCdT = 0; return; } hitMob(tgt, atk * C_.m, { freeze: 3 }); const t2 = tgt; addFx({ type: 'custom', x: tgt.x, y: tgt.y, dur: 3, draw: (f, sx, sy) => { sx = t2.x - G.cam.x; sy = t2.y - G.cam.y; ctx.fillStyle = 'rgba(170,230,255,0.45)'; ctx.strokeStyle = '#e8f8ff'; ctx.beginPath(); ctx.moveTo(sx - 14, sy + 2); ctx.lineTo(sx - 10, sy - 34); ctx.lineTo(sx + 10, sy - 38); ctx.lineTo(sx + 14, sy + 2); ctx.closePath(); ctx.fill(); ctx.stroke(); } }); break; }
    case 'wings': { addBuff(P, 'alasluz', { spdP: 30 }, 8); P.shield = Math.max(P.shield || 0, Math.round(P.S.maxhp * 0.2)); addFx({ type: 'custom', x: P.x, y: P.y, dur: 8, draw: (f, sx, sy, kk) => { sx = G.P.x - G.cam.x; sy = G.P.y - G.cam.y; ctx.fillStyle = `rgba(255,250,210,${(0.6 * (1 - kk * 0.6)).toFixed(2)})`; const fl = Math.sin(G.t * 9) * 4; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx + s * 3, sy - 20); ctx.quadraticCurveTo(sx + s * 26, sy - 40 - fl, sx + s * 30, sy - 12); ctx.quadraticCurveTo(sx + s * 16, sy - 18, sx + s * 3, sy - 14); ctx.fill(); } } }); break; }
    case 'implode': { const x = tgt ? tgt.x : P.x + Math.cos(a) * 80, y = tgt ? tgt.y : P.y + Math.sin(a) * 60; addFx({ type: 'custom', x, y, dur: 1.2, draw: (f, sx, sy, kk) => { ctx.fillStyle = '#0a0014'; ctx.beginPath(); ctx.arc(sx, sy - 10, 4 + kk * 10, 0, 7); ctx.fill(); ctx.strokeStyle = r2; ctx.beginPath(); ctx.arc(sx, sy - 10, 60 * (1 - kk), 0, 7); ctx.stroke(); for (const m of mobsIn(x, y, 90)) if (!m.boss) { m.x += (x - m.x) * 0.05; m.y += (y - m.y) * 0.05; } } });
      setTimeout(() => { sparks(x, y, 30, ['#9a6aff', '#ff9a4a', '#000000']); addFx({ type: 'ring', x, y, r: 70, dur: 0.4, col: '#9a6aff' }); for (const m of mobsIn(x, y, 70)) hitMob(m, atk * C_.m, { stun: 1 }); G.shake = Math.max(G.shake, 6); }, 1200); break; }
    case 'steam': { const x = P.x + Math.cos(a) * 50, y = P.y + Math.sin(a) * 40; addFx({ type: 'field', ground: true, x, y, r: 46, dur: 5, col: '#c8d8e0', pc: '#ffffff', tick: 0.5, cbTick: f => { for (const m of mobsIn(f.x, f.y, f.r)) hitMob(m, atk * C_.m, { burn: 1, slow: 1, noLearn: 1 }); } }); break; }
    case 'balance': { addFx({ type: 'custom', x: P.x, y: P.y, dur: 0.5, draw: (f, sx, sy, kk) => { ctx.globalAlpha = 1 - kk; ctx.fillStyle = '#fff4b0'; ctx.fillRect(sx - 80 * kk, sy - 13, 160 * kk, 4); ctx.fillStyle = '#9a6aff'; ctx.fillRect(sx - 2, sy - 12 - 60 * kk, 4, 120 * kk); ctx.globalAlpha = 1; } }); for (const m of mobsIn(P.x, P.y, 90)) { const dx = Math.abs(m.x - P.x), dy = Math.abs(m.y - P.y); if (dx < 16 || dy < 14) { const df = m.df; m.df = Math.round(m.df * 0.5); hitMob(m, atk * C_.m, {}); m.df = df; } } break; }
  }
}
function dirAng(d) { return { right: 0, down: 1.57, left: 3.14, up: -1.57 }[d] || 0; }
// telegraph aliado: si el motor lo marca como enemigo, igualmente solo dibuja el aviso
// ---------- botones ----------
function combatMount() {
  const acts = $('#acts'); if (!acts || $('#bBlk')) return;
  const mk = (id, title, fn) => { const b = document.createElement('button'); b.className = 'rb'; b.id = id; b.title = title; b.setAttribute('aria-label', title); acts.appendChild(b); b.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); fn(); }); return b; };
  mk('bBlk', L2('Bloquear (justo antes del golpe = contraataque)', 'Block (right before the hit = counter)'), doBlock);
  const r = mk('bRune', L2('Hechizo de runas (mantén pulsado para el grimorio)', 'Rune spell (hold for the grimoire)'), () => { if (!G.P.runeSpell) openRunes(); else castRune(); }); r.hidden = true;
  let hold = null; r.addEventListener('pointerdown', () => { hold = setTimeout(() => { hold = null; openRunes(); }, 600); }); r.addEventListener('pointerup', () => { if (hold) clearTimeout(hold); });
  window.addEventListener('keydown', e => { if (e.repeat || !G.P || document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return; if (e.code === 'KeyF') doBlock(); if (e.code === 'KeyR' && G.P.cls === 'mago') castRune(); });
}
V33_TICKS.push(() => { const P = G.P; if (!P) return; const b = $('#bBlk'), r = $('#bRune');
  if (b) { if (!b.dataset.ic && ICON.keys['shield:#a0d0ff'] !== undefined) { b.innerHTML = iconHTML(['shield', '#a0d0ff'], 22) + '<i class="cdv"></i>'; b.dataset.ic = 1; } const cd = Math.max(0, (P.blockCd || 0) - G.t), v = b.querySelector('.cdv'); if (v) v.style.height = (100 * cd / BLK.cd).toFixed(0) + '%'; b.classList.toggle('blk', !!(P.blockT && G.t < P.blockT)); }
  if (r) { const on = P.cls === 'mago' && (P.runes || []).length >= 2; if (r.hidden === on) r.hidden = !on; if (on) { const C_ = RUNE_COMBO[P.runeSpell], s = C_ ? C_.n.slice(0, 1) : '+', sig = (P.runeSpell || '') + ':' + Math.ceil(Math.max(0, runeCdT - G.t)); if (r.dataset.sig !== sig) { r.dataset.sig = sig; const k = (P.runeSpell || '').split('+'); r.innerHTML = C_ ? `<span class="rg" style="color:${RUNES2[k[0]][1]}">${RUNES2[k[0]][2]}</span><span class="rg" style="color:${RUNES2[k[1]][1]}">${RUNES2[k[1]][2]}</span>${runeCdT > G.t ? `<em>${Math.ceil(runeCdT - G.t)}</em>` : ''}` : `<span class="rg">${s}</span>`; } } } });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', combatMount); else combatMount();
UI_ICONS.push('shield:#a0d0ff', 'star:#a01a2a', 'star:#fff4b0');
{ const _df = drawFx; drawFx = function (f, cx, cy) { if (f.type === 'custom' && f.draw) { const k = Math.min(1, f.t / f.dur); try { f.draw(f, f.x - cx, f.y - cy, k); } catch (e) { } return; } return _df(f, cx, cy); }; }
// ---------- 4. ARMAS MALDITAS QUE NEGOCIAN ----------
const WC_N = { guerrero: L2('Hoja Hambrienta', 'Hungering Blade'), mago: L2('Báculo del Susurro', 'Whispering Staff'), arquero: L2('Arco Sin Nombre', 'Nameless Bow'), asesino: L2('Dagas del Pacto', 'Pact Daggers'), bardo: L2('Laúd del Lamento', 'Lute of Lament'), invocador: L2('Guadaña Sedienta', 'Thirsting Scythe'), pez: L2('Aletas del Abismo', 'Abyssal Fins') };
for (const c in WBASE) { const b = ITEMS['w_' + c + '_15']; if (!b) continue; it('wc_' + c, Object.assign({}, b, { id: 'wc_' + c, n: WC_N[c] || b.n, lv: 140, atk: Math.round(b.atk * 1.08), price: 50000, rar: 5, cursedW: 1, curse: L2('Arma maldita: al equiparla te ofrece un pacto. Puedes purificarla con el Oráculo o dominar su maldición.', 'Cursed weapon: when equipped it offers you a pact. You can purify it with the Oracle or dominate its curse.') })); }
{ const _km = killMob; killMob = function (m) { const r = _km(m); const P = G.P; if (P && P.lv >= 120 && m && (m.boss || (m.def && m.def.fam === 'fantasma'))) { if (Math.random() < (m.boss ? 0.05 : 0.004) && ITEMS['wc_' + P.cls]) { giveItem('wc_' + P.cls, 1); toast(L2('Un arma maldita te susurra desde el suelo…', 'A cursed weapon whispers to you from the ground…'), 'quest', 5); } } return r; }; }
const PACTS = {
  def: [L2('Pacto de la Carne', 'Pact of Flesh'), L2('+45 % de ataque · −30 % de defensa', '+45% attack · −30% defense')],
  skill: [L2('Pacto del Silencio', 'Pact of Silence'), L2('+40 % de ataque y robo de vida · una habilidad queda sellada', '+40% attack and life steal · one skill is sealed')],
  aggro: [L2('Pacto de la Ira', 'Pact of Wrath'), L2('+50 % de ataque · los enemigos te detectan desde más lejos y pegan un 20 % más', '+50% attack · enemies spot you from farther away and hit 20% harder')],
};
function cursedOffer(w) {
  const P = G.P; openModal(`<h2>${iconHTML(['star', '#a01a2a'], 22)} ${esc(ITEMS[w.id].n)} ${L2('te habla', 'speaks to you')}</h2><p class="lorep">${L2('«Puedo darte un poder que no imaginas. Pero todo tiene un precio. Elige qué me das… o quítame de tus manos.»', '"I can give you power you can\'t imagine. But everything has a price. Choose what you give me… or take me off your hands."')}</p>
    <div class="slist">${Object.keys(PACTS).map(k => `<div class="srow"><div class="sn"><b>${esc(PACTS[k][0])}</b><small>${esc(PACTS[k][1])}</small></div><button class="btn sm" data-pact="${k}">${L2('Aceptar', 'Accept')}</button></div>`).join('')}</div>
    <p class="hint">${L2('Si derrotas 200 enemigos con el pacto activo, dominas la maldición: conservas casi todo el poder y desaparece el precio. El Oráculo Ysolde también puede purificarla.', 'If you defeat 200 enemies with the pact active, you dominate the curse: you keep most of the power and the price disappears. Oracle Ysolde can also purify it.')}</p>`, 'party');
  $$('#modal [data-pact]').forEach(b => b.onclick = () => { w.pact = b.dataset.pact; w.domK = 0; if (w.pact === 'skill') P.lockSlot = Math.floor(Math.random() * 4); toast(PACTS[w.pact][0] + L2(' sellado. Siente su poder.', ' sealed. Feel its power.'), 'quest'); sfx('boom'); closeModal(); calcStats(P); markDirty(true); });
}
{ const _ef = equipFromInv; equipFromInv = function (idx) { const P = G.P, s = P.inv[idx]; const r = _ef(idx); const w = P.equip.weapon; if (s && w && w.id === s.id && ITEMS[w.id].cursedW && !w.pact && !w.dom && !w.pur) setTimeout(() => cursedOffer(w), 200); return r; }; }
function cursedKill() { const P = G.P, w = P.equip.weapon; if (!w || !w.pact || w.dom) return; w.domK = (w.domK || 0) + 1; if (w.domK % 50 === 0 && w.domK < 200) toast(L2('Maldición dominada: ', 'Curse dominated: ') + w.domK + '/200', 'job'); if (w.domK >= 200) { w.dom = 1; w.pact = null; P.lockSlot = -1; banner(L2('¡Has dominado la maldición!', 'You dominated the curse!'), ITEMS[w.id].n + L2(' ahora te obedece', ' now obeys you')); sfx('level'); calcStats(P); markDirty(true); } }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs(P); if (P !== G.P || !P.S || !P.equip) return r; const w = P.equip.weapon; P.curseAggro = false; if (!w || !ITEMS[w.id] || !ITEMS[w.id].cursedW) { if (P.lockSlot >= 0) P.lockSlot = -1; return r; }
  if (w.pur) P.S.atk = Math.round(P.S.atk * 1.15); else if (w.dom) P.S.atk = Math.round(P.S.atk * 1.35);
  else if (w.pact === 'def') { P.S.atk = Math.round(P.S.atk * 1.45); P.S.def = Math.round(P.S.def * 0.7); }
  else if (w.pact === 'skill') { P.S.atk = Math.round(P.S.atk * 1.4); P.S.life = (P.S.life || 0) + 4; }
  else if (w.pact === 'aggro') { P.S.atk = Math.round(P.S.atk * 1.5); P.curseAggro = true; }
  return r; }; }
{ const _sm = spawnMob; spawnMob = function () { const m = _sm.apply(this, arguments); if (m && G.P && G.P.curseAggro && m.aggroR) m.aggroR = Math.round(m.aggroR * 1.6); return m; }; }
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'oraculo') return; const P = G.P, w = P.equip && P.equip.weapon; if (!w || !ITEMS[w.id] || !ITEMS[w.id].cursedW || w.pur) return;
  opts.unshift({ label: L2('Purificar mi arma maldita (50.000 oro)', 'Purify my cursed weapon (50,000 gold)'), icon: ['star', '#fff4b0'], fn: () => { if (P.gold < 50000) { typeText(L2('Purificar algo tan oscuro cuesta 50.000 de oro en ofrendas.', 'Purifying something so dark costs 50,000 gold in offerings.')); return; } P.gold -= 50000; w.pur = 1; w.pact = null; P.lockSlot = -1; calcStats(P); markDirty(true); typeText(L2('Ya está. El arma sigue siendo fuerte, pero ya no te pedirá nada a cambio.', 'Done. The weapon is still strong, but it won\'t ask you for anything in return.')); sfx('level'); } }); });
// ---------- 5. ARMAS VIVAS QUE HABLAN ----------
const WSOUL_N = ['Ysera', 'Korvan', 'Lirio', 'Tadeo', 'Mabel', 'Orión', 'Brisa', 'Garm', 'Nyx', 'Sol', 'Runa', 'Eco'];
const WTALK = {
  any: [L2('¿Lo has notado? Cada golpe nos une un poco más.', 'Did you notice? Every strike binds us a little more.'), L2('Antes de ti tuve otro dueño. No hablaba conmigo.', 'Before you I had another owner. They never talked to me.'), L2('Cuando duermes, sueño con el Telar.', 'When you sleep, I dream of the Loom.'), L2('Si alguna vez me cambias por otra… lo entenderé. Más o menos.', 'If you ever swap me for another… I\'ll understand. Sort of.')],
  low: [L2('¡Cuidado! Estás sangrando… y yo odio la sangre de mi dueño.', 'Careful! You\'re bleeding… and I hate my owner\'s blood.'), L2('¡Bebe una poción, por favor!', 'Drink a potion, please!')],
  boss: [L2('Ese es grande. Me encanta.', 'That one\'s big. I love it.'), L2('Bloquea justo antes del golpe. Confía en mí.', 'Block right before the hit. Trust me.'), L2('Si repites el mismo ataque, aprenderá. Cambia.', 'If you repeat the same attack, it will learn. Switch it up.')],
  night: [L2('De noche brillo un poco más. ¿Lo ves?', 'At night I shine a little more. See?')],
  streak: [L2('¡Eso es! ¡Otro más!', 'That\'s it! One more!'), L2('Siento cómo despierto…', 'I can feel myself waking up…')],
};
let wtT = 0, wStreak = 0, wStreakT = 0;
{ const _km = killMob; killMob = function (m) { const r = _km(m); if (G.t - wStreakT < 4) wStreak++; else wStreak = 1; wStreakT = G.t; return r; }; }
function weaponTalkTick(dt) {
  const P = G.P; if (!P || P.dead || !P.equip || !P.equip.weapon) return; const w = P.equip.weapon; if (wlvOf(w) < 1) return;
  if (!w.soul) { w.soul = pick(WSOUL_N); toast(L2('Tu arma ha despertado y tiene nombre: ', 'Your weapon has awakened and has a name: ') + w.soul, 'quest', 5); markDirty(); }
  wtT -= dt; if (wtT > 0) return; wtT = 50 + Math.random() * 60;
  const boss = G.ents.some(e => e.type === 'mob' && e.boss && !e.dying && e.map === P.map && dist2(e.x, e.y, P.x, P.y) < 200 * 200);
  const pool = P.hp < P.S.maxhp * 0.3 ? WTALK.low : boss ? WTALK.boss : wStreak >= 4 ? WTALK.streak : isNight() && Math.random() < 0.4 ? WTALK.night : WTALK.any;
  P.chat = '«' + w.soul + ': ' + pick(pool) + '»'; P.chatT = G.t - 1; if (pool === WTALK.low || pool === WTALK.boss) wtT = 20 + Math.random() * 20;
}
V33_TICKS.push(weaponTalkTick);
// el arma brilla más cuanto más despierta (evolución visual)
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { _de(e, cx, cy); if (e !== G.P || !e.equip || !e.equip.weapon) return; const lv = wlvOf(e.equip.weapon); if (lv < 3) return; const col = lv >= 10 ? '#ffe070' : lv >= 7 ? '#c8a0ff' : lv >= 5 ? '#8ad8ff' : '#ffffff';
  if (Math.random() < 0.08 + lv * 0.02) part(e.x + (e.dir === 'left' ? -10 : 10) + (Math.random() - 0.5) * 8, e.y - 6, { z: 10 + Math.random() * 10, vz: 12, life: 0.7, c: col, s: lv >= 7 ? 2 : 1 }); }; }

// animaciones propias de las armas despiertas (nivel 5, 7 y 10 del arma)
{ const _ba = basicAttack; basicAttack = function () { const P = G.P, cd0 = P.atkCd; const r = _ba.apply(this, arguments); const w = P.equip && P.equip.weapon, lv = w ? wlvOf(w) : 0;
  if (lv >= 5 && P.atkCd > (cd0 || 0)) { const a = dirAng(P.dir), col = lv >= 10 ? '#ffe070' : lv >= 7 ? '#c8a0ff' : '#8ad8ff';
    addFx({ type: 'custom', x: P.x, y: P.y, dur: 0.28, draw: (f, x, y, k) => { ctx.strokeStyle = col; ctx.globalAlpha = 1 - k; ctx.lineWidth = lv >= 10 ? 3 : 2; for (let i = 0; i < (lv >= 7 ? 2 : 1); i++) { ctx.beginPath(); ctx.arc(x, y - 12, 18 + i * 7 + k * 10, a - 1.1 + k * 0.6, a + 1.1 + k * 0.6); ctx.stroke(); } ctx.globalAlpha = 1; } });
    if (lv >= 10) for (let i = 0; i < 6; i++) part(P.x + Math.cos(a) * (14 + i * 4), P.y - 12 + Math.sin(a) * (10 + i * 3), { z: 6, vz: 20, life: 0.5, c: '#fff4c0', s: 1 }); }
  return r; }; }
