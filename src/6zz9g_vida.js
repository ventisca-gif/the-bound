// ================= v4.65: VIDA COTIDIANA, AMISTADES, FESTIVALES, ARMAS ANCESTRALES Y CRÓNICAS DEL MUNDO =================
SAVEKEYS.push('fr', 'tech', 'anc', 'fest', 'mg', 'guestDay');

// =====================================================================================
// JARDINERÍA MÁGICA: cultivos que reaccionan al clima y flores que brillan de noche
// =====================================================================================
// [id, nombre, en, color, crecimiento s, condición favorable, texto de la condición, nivel de agricultura (tier)]
const MCROPS = [
  ['flor_lunar', 'Flor Lunar', 'Moonflower', '#9ad0ff', 600, () => isNight(), L2('crece el triple de rápido de noche y brilla en la oscuridad', 'grows three times faster at night and glows in the dark'), 4],
  ['raiz_tormenta', 'Raíz de Tormenta', 'Storm Root', '#7a8aff', 700, () => /rain|storm/.test(curWx()), L2('crece el triple de rápido con lluvia o tormenta', 'grows three times faster in rain or storms'), 5],
  ['rosa_escarcha', 'Rosa de Escarcha', 'Frost Rose', '#c8f0ff', 700, () => /snow/.test(curWx()) || (G.P && G.P.cold > 0), L2('crece el triple de rápido con nieve o frío', 'grows three times faster in snow or cold'), 5],
  ['girasol_solar', 'Girasol Solar', 'Solar Sunflower', '#ffd040', 600, () => !isNight() && curWx() === 'clear', L2('crece el triple de rápido de día con el cielo despejado', 'grows three times faster on clear days'), 4],
  ['seta_velo', 'Seta del Velo', 'Veil Mushroom', '#c070ff', 800, () => G.map && /espiritu|velo|vr_|cripta|cueva|mina/.test(G.map.id), L2('crece el triple de rápido si estás en cuevas, el Velo o el Mundo Espiritual', 'grows three times faster while you are in caves, the Veil or the Spirit World'), 6],
  ['lirio_estelar', 'Lirio Estelar', 'Star Lily', '#fff0a0', 1200, () => isNight() && curWx() === 'clear', L2('solo brota bajo un cielo nocturno despejado (el triple de rápido); planta rara de alquimia', 'only sprouts under a clear night sky (three times faster); rare alchemy plant'), 7],
];
const MCROP = {};
for (const [id, n, en, col, grow, fav, txt, tier] of MCROPS) { MCROP[id] = { fav, txt, col };
  it(id, { n: L2(n, en), t: 'mat', crop: 1, stack: true, tier, price: 60 * tier, icon: ['flowerm', col], rar: 3, mcrop: 1, d: L2('Planta mágica para la alquimia.', 'Magic plant for alchemy.') });
  it('sem_' + id, { n: L2('Semilla mágica: ', 'Magic seed: ') + L2(n, en), t: 'mat', seed: id, grow, stack: true, tier, price: 40 * tier, icon: ['seedm', col], rar: 2, d: txt }); }
// el crecimiento acelera si se cumple su condición (se acumula mientras juegas)
V33_TICKS.push(() => { const P = G.P; if (!P || !P.farm) return; const now = Date.now(), dt = Math.min(5, (now - (P._mgT || now)) / 1000); P._mgT = now; if (dt <= 0) return;
  for (const pid in P.farm) { const F = P.farm[pid], C_ = MCROP[F.c]; if (!C_) continue; if (C_.fav()) F.t -= dt * 2000; } });
// flores que brillan de noche
WORLD_DRAW.push((cx, cy) => { const P = G.P, M = G.map; if (!P || !P.farm || !M || !M.objs || !isNight()) return;
  for (const o of M.objs) { if (o.k !== 'plot') continue; const F = P.farm[o.pid]; if (!F || !MCROP[F.c]) continue; const S = plotState(o); if (S.st < 2) continue;
    const x = o.px - cx, y = o.py - cy - 8; if (x < -20 || y < -20 || x > ctx.canvas.width + 20 || y > ctx.canvas.height + 20) continue; ctx.save(); ctx.globalAlpha = 0.35 + 0.15 * Math.sin(G.t * 2 + o.px); ctx.drawImage(glowSprite(18, [MCROP[F.c].col]), x - 18, y - 18); ctx.restore(); } });
// semillas mágicas: las vende el granjero y salen del macetero
function openPlanter() {
  const P = G.P; P.mg = P.mg || {}; const d = calDay(), done = P.mg.day === d;
  openModal(`<h2>🌱 ${L2('Macetero mágico', 'Magic planter')}</h2><p class="hint">${L2('Una vez al día el macetero da una semilla mágica. Plántalas en tierra de cultivo: cada una crece más rápido con su clima.', 'Once a day the planter gives a magic seed. Plant them in farm soil: each grows faster in its weather.')}</p>
    <div class="slist">${MCROPS.map(([id, n, en, col, g, fav, txt]) => `<div class="srow"><span class="ic">${iconHTML(['flowerm', col], 28)}</span><div class="sn"><b>${esc(L2(n, en))} ${fav() ? '✨' : ''}</b><small>${esc(txt)}</small></div><button class="btn sm" data-mbuy="${id}">${fmt(40 * ITEMS[id].tier * 3)} 🪙</button></div>`).join('')}</div>
    <div class="row">${done ? `<p class="hint">${L2('Hoy ya has recogido tu semilla.', 'You already collected today\'s seed.')}</p>` : `<button class="btn gold" id="mgGet">🌱 ${L2('Recoger la semilla de hoy', 'Collect today\'s seed')}</button>`}<button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; const g = $('#mgGet'); if (g) g.onclick = () => { P.mg.day = d; const s = pick(MCROPS)[0]; giveItem('sem_' + s, 1); sfx('pickup'); markDirty(); openPlanter(); };
  $$('#modal [data-mbuy]').forEach(b => b.onclick = () => { const id = b.dataset.mbuy, c = 40 * ITEMS[id].tier * 3; if (P.gold < c) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= c; giveItem('sem_' + id, 1); sfx('coin'); uiDirty.hud = true; markDirty(); }); }

// =====================================================================================
// ALQUIMIA Y TALLER
// =====================================================================================
const ALCH = [
  ['elixir_luna', 'Elixir Lunar', 'Lunar Elixir', '#9ad0ff', [['flor_lunar', 2]], { tonic: { defP: 25 }, dur: 600 }, L2('+25 % de defensa 10 min', '+25% defence for 10 min')],
  ['elixir_tormenta', 'Elixir de Tormenta', 'Storm Elixir', '#7a8aff', [['raiz_tormenta', 2]], { tonic: { atkP: 20 }, dur: 600 }, L2('+20 % de ataque 10 min', '+20% attack for 10 min')],
  ['elixir_escarcha', 'Elixir de Escarcha', 'Frost Elixir', '#c8f0ff', [['rosa_escarcha', 2]], { tonic: { defP: 15, atkP: 10 }, dur: 600 }, L2('+15 % defensa y +10 % ataque 10 min', '+15% defence and +10% attack for 10 min')],
  ['elixir_sol', 'Elixir Solar', 'Solar Elixir', '#ffd040', [['girasol_solar', 2]], { heal: 30000, cure: 1 }, L2('Cura mucho y quita venenos (cuenta como poción curativa)', 'Heals a lot and cures poison (counts as a healing potion)')],
  ['elixir_velo', 'Elixir del Velo', 'Veil Elixir', '#c070ff', [['seta_velo', 2]], { xpB: 60, dur: 900 }, L2('+60 % de experiencia 15 min', '+60% experience for 15 min')],
  ['elixir_estelar', 'Elixir Estelar', 'Star Elixir', '#fff0a0', [['lirio_estelar', 1], ['flor_lunar', 1], ['girasol_solar', 1]], { tonic: { atkP: 25, defP: 25 }, dur: 900 }, L2('+25 % ataque y defensa 15 min', '+25% attack and defence for 15 min')],
];
for (const [id, n, en, col, , eff, d] of ALCH) it(id, Object.assign({ n: L2(n, en), t: 'cons', stack: true, price: 1500, lv: 30, icon: ['potion2', col], rar: 3, d }, eff));
function craftList(title, list, after) {
  const P = G.P; const has = c => c.every(([id, q]) => countItem(id) >= q);
  openModal(`<h2>${title}</h2><div class="slist">${list.map(([id, n, en, col, cost, , d], i) => `<div class="srow"><span class="ic">${iconHTML(ITEMS[id].icon, 28)}</span><div class="sn"><b>${esc(ITEMS[id].n)}</b><small>${esc(d || ITEMS[id].d || '')}<br>${cost.map(([c, q]) => `${esc(ITEMS[c] ? ITEMS[c].n : c)} ${countItem(c)}/${q}`).join(' · ')}</small></div><button class="btn sm ${has(cost) ? 'gold' : ''}" data-cr="${i}">${L2('Hacer', 'Make')}</button></div>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  $$('#modal [data-cr]').forEach(b => b.onclick = () => { const L_ = list[+b.dataset.cr]; if (!has(L_[4])) { toast(L2('Te faltan materiales', 'Missing materials'), 'warn'); return; } L_[4].forEach(([c, q]) => takeItem(c, q)); giveItem(L_[0], 1); sfx('questdone'); markDirty(true); after(); }); }
function openAlchemy() { craftList('⚗ ' + L2('Mesa de alquimia', 'Alchemy table'), ALCH, openAlchemy); }
const WORK = [
  ['esencia_imb_fire', '', '', '', [['ore1', 3], ['polvo_arcano', 1]], '', ''], ['esencia_imb_ice', '', '', '', [['ore1', 3], ['rosa_escarcha', 1]], '', ''],
  ['esencia_imb_shock', '', '', '', [['ore1', 3], ['raiz_tormenta', 1]], '', ''], ['esencia_imb_wet', '', '', '', [['ore1', 3], ['flor_lunar', 1]], '', ''],
  ['bk_farol_flor', '', '', '', [['flor_lunar', 2], ['ore1', 1]], '', ''], ['bk_banderin', '', '', '', [['log', 2], ['ficha_festival', 2]], '', ''],
  ['bk_estatua_heroe', '', '', '', [['piedra', 20], ['trofeo_reyslime', 1]], '', ''], ['bk_cuadro_nihil', '', '', '', [['log', 2], ['esencia_nihil', 1]], '', ''],
];
function openWorkshop() { craftList('🔨 ' + L2('Taller del artesano', 'Artisan workshop'), WORK.filter(w => ITEMS[w[0]]), openWorkshop); }

// =====================================================================================
// AMISTADES, RIVALIDADES Y MENTORES
// =====================================================================================
// Charlar una vez al día da amistad. 20: puedes proponer una rivalidad amistosa (duelos; cada 3 victorias aprendes
// una técnica). 40: amigos (puedes invitarle a dormir en tu cama de invitados). 60 con un mentor: te enseña su técnica.
const TECH = {
  t_golpe: [L2('Golpe del rival', 'Rival\'s strike'), { atk: 0.04 }], t_guardia: [L2('Guardia del rival', 'Rival\'s guard'), { def: 0.05 }], t_aguante: [L2('Aguante del rival', 'Rival\'s stamina'), { hp: 0.05 }],
  m_brienne: [L2('Lección de Brienne: tajo firme', 'Brienne\'s lesson: steady cut'), { atk: 0.06 }], m_mira: [L2('Lección de Mira: hilo fuerte', 'Mira\'s lesson: strong thread'), { hp: 0.06 }],
  m_lys: [L2('Lección de Lys: telar interior', 'Lys\'s lesson: inner loom'), { atk: 0.03, def: 0.03, hp: 0.03 }], m_selma: [L2('Lección de Selma: ojo de arqueóloga', 'Selma\'s lesson: archaeologist\'s eye'), { def: 0.06 }],
  m_ysolde: [L2('Lección de Ysolde: ver el golpe', 'Ysolde\'s lesson: see the blow'), { def: 0.04, atk: 0.02 }],
};
const MENTORS = { maestro_armas: 'm_brienne', mira: 'm_mira', tejedora_ultima: 'm_lys', arqueologa: 'm_selma', oraculo: 'm_ysolde' };
const RIVAL_TECH = ['t_golpe', 't_guardia', 't_aguante'];
function frOf(id) { const P = G.P; P.fr = P.fr || {}; return P.fr[id] = P.fr[id] || { p: 0, t: '', w: 0, d: -1 }; }
function frLabel(f, id) { return f.t === 'rival' ? L2('Rival', 'Rival') : MENTORS[id] && f.p >= 60 ? L2('Mentor', 'Mentor') : f.p >= 40 ? L2('Amigo', 'Friend') : f.p >= 15 ? L2('Conocido', 'Acquaintance') : L2('Desconocido', 'Stranger'); }
function techLearn(k) { const P = G.P; P.tech = P.tech || []; if (P.tech.includes(k)) return false; P.tech.push(k); banner(L2('Técnica aprendida', 'Technique learned'), TECH[k][0]); sfx('level'); calcStats(P); markDirty(); return true; }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); if (P && P === G.P && P.S && P.tech) { let a = 0, d = 0, h = 0; for (const k of P.tech) { const T = TECH[k]; if (!T) continue; a += T[1].atk || 0; d += T[1].def || 0; h += T[1].hp || 0; }
    if (a) P.S.atk = Math.round(P.S.atk * (1 + a)); if (d) P.S.def = Math.round(P.S.def * (1 + d)); if (h) P.S.maxhp = Math.round(P.S.maxhp * (1 + h)); } return r; }; }
function frNpcOk(npc) { return npc && npc.def && npc.def.n && !npc.mon && !npc.hn && npc.id && !/^duel_|^acad_stu/.test(npc.id); }
DLG_HOOKS.push((npc, opts) => { if (!frNpcOk(npc)) return; const P = G.P, f = frOf(npc.id), d = calDay();
  opts.push({ label: '🤝 ' + L2('Amistad', 'Friendship') + ' · ' + frLabel(f, npc.id) + ' (' + Math.min(100, f.p) + ')', icon: ['heart:#ff5a8a'.split(':')[0], '#ff5a8a'], fn: () => {
    const can = f.d !== d; let msg = '';
    if (can) { f.d = d; f.p = Math.min(100, f.p + 8); msg = pick([L2('Gracias por pasarte. Me alegras el día.', 'Thanks for stopping by. You made my day.'), L2('¿Otra vez tú? Empiezo a acostumbrarme.', 'You again? I\'m getting used to it.'), L2('Cuéntame algo de tus viajes.', 'Tell me something about your travels.')]); markDirty(); }
    else msg = L2('Ya hemos charlado hoy. ¡Vuelve mañana!', 'We already talked today. Come back tomorrow!');
    typeText(msg + '  [' + frLabel(f, npc.id) + ' · ' + f.p + '/100]');
    const M = MENTORS[npc.id]; if (M && f.p >= 60 && techLearn(M)) typeText(L2('Has llegado lejos. Deja que te enseñe algo que solo sé yo.', 'You\'ve come far. Let me teach you something only I know.')); } });
  if (f.p >= 20 && f.t !== 'rival') opts.push({ label: '⚔ ' + L2('Proponer una rivalidad amistosa', 'Propose a friendly rivalry'), icon: ['sword', 3], fn: () => { f.t = 'rival'; markDirty(); typeText(L2('¿Rivales? Me encanta. Que gane el mejor… o sea, yo.', 'Rivals? I love it. May the best one win… meaning me.')); } });
  if (f.t === 'rival') opts.push({ label: '⚔ ' + L2('Duelo de rivales', 'Rival duel') + ' (' + f.w + ' ' + L2('victorias', 'wins') + ')', icon: ['sword', 3], fn: () => { closeDialog(); FR_DUEL = npc.id; duelStart({ name: npc.def.n, lv: Math.max(1, P.lv + 2), look: npc.def.look }); } });
});
let FR_DUEL = null;
{ const _de = duelEnd; duelEnd = function (won) { const id = FR_DUEL; FR_DUEL = null; const r = _de.apply(this, arguments);
    if (id && G.P) { const f = frOf(id); f.p = Math.min(100, f.p + (won ? 6 : 3)); if (won) { f.w++; if (f.w % 3 === 0) { const k = RIVAL_TECH.find(t => !(G.P.tech || []).includes(t)); if (k) techLearn(k); } } markDirty(); }
    return r; }; }
function openGuest() {
  const P = G.P, d = calDay(), fr = Object.keys(P.fr || {}).filter(k => NPCS[k] && P.fr[k].p >= 40);
  openModal(`<h2>🛏 ${L2('Cama de invitados', 'Guest bed')}</h2><p class="hint">${L2('Invita a un amigo (40 de amistad) a pasar la noche: +10 de amistad y por la mañana te deja un regalo. Una vez al día.', 'Invite a friend (40 friendship) to stay the night: +10 friendship and a gift in the morning. Once a day.')}</p>
    <div class="slist">${fr.map(k => `<div class="srow"><div class="sn"><b>${esc(NPCS[k].n)}</b><small>${frLabel(P.fr[k], k)} · ${P.fr[k].p}/100</small></div><button class="btn sm" data-gst="${k}" ${P.guestDay === d ? 'disabled' : ''}>${L2('Invitar', 'Invite')}</button></div>`).join('') || `<p class="hint">${L2('Aún no tienes amigos. Charla con los aldeanos cada día.', 'You have no friends yet. Chat with villagers every day.')}</p>`}</div>
    <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('#modal [data-gst]').forEach(b => b.onclick = () => { const k = b.dataset.gst; P.guestDay = d; P.fr[k].p = Math.min(100, P.fr[k].p + 10); giveItem(pick(['food8', 'pocion4', 'polvo_arcano', 'ficha_festival', 'sem_' + pick(MCROPS)[0]]), 1); sfx('questdone'); toast(NPCS[k].n + L2(' pasó la noche y te dejó un regalo', ' stayed the night and left you a gift'), 'quest'); markDirty(); openGuest(); }); }

// =====================================================================================
// FESTIVALES INTERACTIVOS (cada 3 días, en cualquier pueblo: habla con un aldeano)
// =====================================================================================
it('ficha_festival', { n: L2('Ficha del festival', 'Festival token'), t: 'mat', stack: true, tier: 1, price: 100, icon: ['coin'], rar: 1, d: L2('Se gana en los festivales. Sirve en el taller y para apostar.', 'Won at festivals. Used at the workshop and for betting.') });
const FEST_MEDALS = ['medalla_musica', 'medalla_cocina', 'medalla_baile', 'medalla_carrera'];
[['medalla_musica', 'Medalla del concurso musical', 'Music contest medal', '#ffd040'], ['medalla_cocina', 'Medalla del torneo de cocina', 'Cooking tournament medal', '#ff8a3a'], ['medalla_baile', 'Medalla del baile', 'Dance medal', '#ff70c0'], ['medalla_carrera', 'Medalla de la carrera', 'Race medal', '#5ad0ff']]
  .forEach(([id, n, en, col]) => it(id, { n: L2(n, en), t: 'mat', stack: true, tier: 1, price: 10, medal: 1, icon: ['medal', col], rar: 3, d: L2('Recuerdo de un festival. Exponlo en el museo.', 'A festival memory. Display it in the museum.') }));
function festToday() { return calDay() % 3 === 0; }
DLG_HOOKS.push((npc, opts) => { if (!npc.def || !npc.def.tf || !festToday()) return; opts.unshift({ label: '🎉 ' + L2('¡Hoy hay festival!', 'Festival today!'), icon: ['star', '#ffd040'], fn: () => { closeDialog(); openFestival(); } }); });
V33_TICKS.push(() => { const P = G.P; if (!P) return; const d = calDay(); if (P._festAnn === d) return; P._festAnn = d; if (festToday()) setTimeout(() => toast('🎉 ' + L2('Hoy hay festival en los pueblos: habla con cualquier aldeano', 'Festival today in the towns: talk to any villager'), 'quest', 5), 3000); });
function festDone(k) { const P = G.P; P.fest = P.fest || {}; return P.fest[k] === calDay(); }
function festWin(k, score, medal) { const P = G.P; P.fest = P.fest || {}; P.fest[k] = calDay(); const fichas = 1 + Math.floor(score / 34); giveItem('ficha_festival', fichas);
  if (score >= 70 && medal && !countItem(medal) && !(P.mus && P.mus.md && P.mus.md[medal])) giveItem(medal, 1); markDirty(); return fichas; }
function openFestival() {
  const done = k => festDone(k) ? ' ✓' : '';
  openModal(`<h2>🎉 ${L2('Festival del pueblo', 'Town festival')}</h2><p class="hint">${L2('Cada prueba se juega una vez por festival. Con 70 puntos o más ganas su medalla (para el museo). Las fichas sirven en el taller y para apostar.', 'Each event can be played once per festival. With 70 points or more you win its medal (for the museum). Tokens are used at the workshop and for betting.')} · ${L2('Fichas', 'Tokens')}: ${countItem('ficha_festival')}</p>
    <div class="slist">${[['musica', '🎵 ' + L2('Concurso musical', 'Music contest'), L2('Toca cuando la nota llegue a la línea dorada', 'Tap when the note reaches the golden line')], ['cocina', '🍲 ' + L2('Torneo de cocina', 'Cooking tournament'), L2('Elige 3 ingredientes que combinen', 'Pick 3 ingredients that go together')], ['baile', '💃 ' + L2('Baile', 'Dance'), L2('Repite los pasos que te marcan', 'Repeat the steps shown')], ['carrera', '🏃 ' + L2('Carrera', 'Race'), L2('Pulsa lo más rápido que puedas', 'Tap as fast as you can')], ['apuesta', '🎲 ' + L2('Apuestas de la carrera de caracoles', 'Snail race betting'), L2('Apuesta fichas a un caracol', 'Bet tokens on a snail')]]
      .map(([k, n, d]) => `<div class="srow"><div class="sn"><b>${n}${done(k)}</b><small>${d}</small></div><button class="btn sm gold" data-fe="${k}" ${festDone(k) && k !== 'apuesta' ? 'disabled' : ''}>${L2('Jugar', 'Play')}</button></div>`).join('')}</div>
    <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('#modal [data-fe]').forEach(b => b.onclick = () => FEST_GAMES[b.dataset.fe]());
}
function festResult(k, score, medal) { const f = festWin(k, score, medal); sfx(score >= 70 ? 'questdone' : 'ui'); openModal(`<h2>🎉 ${L2('Resultado', 'Result')}: ${score}/100</h2><p>${score >= 70 ? L2('¡Lo bordaste! El público aplaude.', 'You nailed it! The crowd cheers.') : score >= 40 ? L2('Nada mal. El año que viene, la medalla.', 'Not bad. Next time, the medal.') : L2('Bueno… al menos te divertiste.', 'Well… at least you had fun.')}</p><p class="hint">+${f} ${L2('fichas', 'tokens')}${score >= 70 && medal ? ' · ' + ITEMS[medal].n : ''}</p><div class="row"><button class="btn" id="feB">${L2('Volver al festival', 'Back to the festival')}</button></div>`, 'party'); $('#feB').onclick = openFestival; }
const FEST_GAMES = {
  musica: () => { let hits = 0, n = 0, t0 = performance.now(), raf; openModal(`<h2>🎵 ${L2('Concurso musical', 'Music contest')}</h2><canvas id="feC" width="240" height="60" style="width:100%;image-rendering:pixelated;background:#1a0e1a;border-radius:6px"></canvas><p class="hint" id="feT">0/8</p><div class="row"><button class="btn gold" id="feP">🎵 ${L2('¡Ahora!', 'Now!')}</button></div>`, 'party');
    const x = $('#feC').getContext('2d'), sp = 110; let pos = 0; const loop = () => { const t = (performance.now() - t0) / 1000; pos = (t * sp) % 240; x.fillStyle = '#1a0e1a'; x.fillRect(0, 0, 240, 60); x.fillStyle = '#ffd040'; x.fillRect(170, 0, 4, 60); x.fillStyle = '#ff70c0'; x.beginPath(); x.arc(pos, 30, 7, 0, 7); x.fill(); raf = requestAnimationFrame(loop); }; loop();
    $('#feP').onclick = () => { n++; const d = Math.abs(pos - 172); if (d < 14) hits += d < 6 ? 1 : 0.6; $('#feT').textContent = n + '/8'; if (n >= 8) { cancelAnimationFrame(raf); festResult('musica', Math.round(hits / 8 * 100), 'medalla_musica'); } }; },
  cocina: () => { const ING = [['🍅', 'tomate'], ['🥕', 'zanahoria'], ['🧅', 'cebolla'], ['🍄', 'seta'], ['🐟', 'pescado'], ['🍯', 'miel'], ['🌶', 'guindilla'], ['🧀', 'queso']], good = [[0, 2, 7], [1, 2, 3], [4, 0, 2], [5, 7, 3], [6, 0, 4]];
    const sel = []; const draw = () => { openModal(`<h2>🍲 ${L2('Torneo de cocina', 'Cooking tournament')}</h2><p class="hint">${L2('Elige 3. Pista del jurado: «hoy queremos algo de huerta»', 'Pick 3. Judges\' hint: "today we want something from the garden"')}</p><div class="row" style="flex-wrap:wrap">${ING.map(([e], i) => `<button class="btn ${sel.includes(i) ? 'gold' : ''}" data-ing="${i}" style="font-size:1.4em">${e}</button>`).join('')}</div>`, 'party');
      $$('#modal [data-ing]').forEach(b => b.onclick = () => { const i = +b.dataset.ing; if (sel.includes(i)) return; sel.push(i); if (sel.length < 3) return draw(); const best = Math.max(...good.map(g => g.filter(v => sel.includes(v)).length)); festResult('cocina', [20, 45, 70, 100][best], 'medalla_cocina'); }); }; draw(); },
  baile: () => { const A = ['⬅', '⬆', '⬇', '➡'], seq = Array.from({ length: 6 }, () => Math.floor(Math.random() * 4)); let i = 0, ok = 0; const show = () => { openModal(`<h2>💃 ${L2('Baile', 'Dance')} ${i + 1}/6</h2><p style="font-size:2.4em;text-align:center">${A[seq[i]]}</p><div class="row">${A.map((a, k) => `<button class="btn" data-ba="${k}" style="font-size:1.4em">${a}</button>`).join('')}</div>`, 'party'); const t0 = performance.now();
      $$('#modal [data-ba]').forEach(b => b.onclick = () => { if (+b.dataset.ba === seq[i] && performance.now() - t0 < 1600) ok++; i++; try { G.P && setAnim(G.P, 'dance'); } catch (e) { } if (i >= 6) festResult('baile', Math.round(ok / 6 * 100), 'medalla_baile'); else show(); }); }; show(); },
  carrera: () => { let taps = 0, t0 = 0; openModal(`<h2>🏃 ${L2('Carrera', 'Race')}</h2><p class="hint" id="feR">${L2('¡Pulsa sin parar durante 5 segundos!', 'Tap nonstop for 5 seconds!')}</p><div class="row"><button class="btn gold" id="feP" style="font-size:1.6em;padding:.6em 1.4em">🏃</button></div>`, 'party');
    $('#feP').onclick = () => { if (!t0) { t0 = performance.now(); setTimeout(() => festResult('carrera', Math.min(100, Math.round(taps / 40 * 100)), 'medalla_carrera'), 5000); } taps++; const r = $('#feR'); if (r) r.textContent = taps + ' ' + L2('pasos', 'steps'); }; },
  apuesta: () => { const S = ['🐌 Rayo', '🐌 Turrón', '🐌 Babosín', '🐌 Concha']; openModal(`<h2>🎲 ${L2('Carrera de caracoles', 'Snail race')}</h2><p class="hint">${L2('Apuesta 2 fichas. Si gana tu caracol, recibes 6.', 'Bet 2 tokens. If your snail wins, you get 6.')} (${countItem('ficha_festival')})</p><div class="slist">${S.map((s, i) => `<div class="srow"><div class="sn"><b>${s}</b></div><button class="btn sm" data-ap="${i}">${L2('Apostar', 'Bet')}</button></div>`).join('')}</div><div class="row"><button class="btn" id="feB">${L2('Volver', 'Back')}</button></div>`, 'party');
    $('#feB').onclick = openFestival; $$('#modal [data-ap]').forEach(b => b.onclick = () => { if (countItem('ficha_festival') < 2) { toast(L2('Necesitas 2 fichas', 'You need 2 tokens'), 'warn'); return; } takeItem('ficha_festival', 2); const w = Math.floor(Math.random() * 4), win = w === +b.dataset.ap; if (win) giveItem('ficha_festival', 6); sfx(win ? 'coin' : 'ui');
      openModal(`<h2>🏁 ${L2('Gana', 'Winner')}: ${S[w]}</h2><p>${win ? L2('¡Has acertado! +6 fichas', 'You got it! +6 tokens') : L2('Otra vez será.', 'Better luck next time.')}</p><div class="row"><button class="btn" id="feB">${L2('Volver', 'Back')}</button></div>`, 'party'); $('#feB').onclick = () => FEST_GAMES.apuesta(); markDirty(); }); },
};

// =====================================================================================
// ARMAS ANCESTRALES: no suben con experiencia, sino cumpliendo los objetivos de su historia
// =====================================================================================
// [clase, id, nombre, en, historia, estela del santuario, NPC que conoció a su portador, jefe creador]
const ANC = [
  ['guerrero', 'anc_guerrero', 'Hoja de Brasa', 'Ember Blade', L2('Ignaroth la forjó cuando aún era un Alado, antes de que el Sello lo convirtiera en dragón. La empuñó una guardiana de Arxar.', 'Ignaroth forged it while still one of the Winged, before the Seal turned it into a dragon. A warden of Arxar wielded it.'), 5, 'maestro_armas', 'ignaroth'],
  ['mago', 'anc_mago', 'Báculo del Silencio Roto', 'Staff of Broken Silence', L2('Morgana lo talló para no oír la voz de Nihil. No funcionó, pero el báculo aprendió a callar a otros.', 'Morgana carved it to stop hearing Nihil\'s voice. It didn\'t work, but the staff learned to silence others.'), 4, 'oraculo', 'morgana'],
  ['arquero', 'anc_arquero', 'Arco del Ent Anciano', 'Bow of the Elder Ent', L2('Hecho con una rama del Ent cuando aún no guardaba ningún fragmento. Su cuerda es una raíz que no se rompe.', 'Made from a branch of the Ent before it guarded any shard. Its string is a root that never snaps.'), 0, 'arqueologa', 'ent'],
  ['asesino', 'anc_asesino', 'Colmillo de Ámbar', 'Amber Fang', L2('Daga del faraón de Sahrim: con ella quiso cortar el hilo de los héroes. Atrapada en ámbar, todavía recuerda.', 'The Sahrim pharaoh\'s dagger: with it he tried to cut the heroes\' thread. Trapped in amber, it still remembers.'), 3, 'espiritu_guia', 'faraon'],
  ['bardo', 'anc_bardo', 'Laúd de las Mareas', 'Lute of the Tides', L2('El rey de Nerea tocaba este laúd antes de esconder su fragmento en el mar y volverse el Kraken.', 'The king of Nerea played this lute before hiding his shard in the sea and becoming the Kraken.'), 1, 'mira', 'kraken'],
  ['invocador', 'anc_invocador', 'Guadaña del Rey de Vael', 'Scythe of the King of Vael', L2('El rey de Vael la usaba para segar los días que no quería vivir. Sigue sentada a su lado, en el trono.', 'The king of Vael used it to reap the days he didn\'t want to live. It still rests beside him on the throne.'), 2, 'tejedora_ultima', 'vael'],
  ['pez', 'anc_pez', 'Aletas del Leviatán', 'Leviathan Fins', L2('Cuando el pueblo Pez era un solo clan, el Leviatán le regaló estas aletas. Luego el mar lo cambió.', 'When the Fish folk were a single clan, the Leviathan gifted them these fins. Then the sea changed it.'), 7, 'mira', 'leviatan'],
];
for (const [c, id, n, en, story] of ANC) { const b = ITEMS['w_' + c + '_14'] || ITEMS['w_' + c + '_10'] || Object.values(ITEMS).find(I => I.t === 'weapon' && I.cls === c); if (!b) continue;
  it(id, Object.assign({}, b, { id, n: L2(n, en), lv: Math.min(b.lv || 140, 140), rar: 5, price: (b.price || 1000) * 2, anc: 1, d: story })); }
const ANC_ST = [L2('Dormida', 'Dormant'), L2('Santuario restaurado', 'Shrine restored'), L2('Portador recordado', 'Bearer remembered'), L2('Creador vencido: despierta', 'Creator defeated: awakened')];
function ancDef(id) { return ANC.find(a => a[1] === id); }
function ancSt(id) { const P = G.P; P.anc = P.anc || {}; return P.anc[id] | 0; }
// +12 % de ataque por paso completado (hasta +36 %), solo con el arma equipada
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); if (P && P === G.P && P.S && P.equip && P.equip.weapon && ancDef(P.equip.weapon.id)) P.S.atk = Math.round(P.S.atk * (1 + 0.12 * ancSt(P.equip.weapon.id))); return r; }; }
function ancUp(id, to) { const P = G.P; P.anc = P.anc || {}; if ((P.anc[id] | 0) >= to) return; P.anc[id] = to; const D = ancDef(id); banner(ITEMS[id].n, ANC_ST[to] + ' (' + to + '/3)'); sfx('questdone'); calcStats(P); markDirty(true); }
// el arma la entrega el museo: con 8 trofeos expuestos recibes la de tu clase
function ancGrant() { const P = G.P, M = musData(), D = ANC.find(a => a[0] === P.cls); if (!D || !ITEMS[D[1]]) return; P.anc = P.anc || {}; if (P.anc['got_' + D[1]]) return;
  if (Object.keys(M.tr).length >= 8) { P.anc['got_' + D[1]] = 1; giveItem(D[1], 1); banner(L2('Arma ancestral', 'Ancestral weapon'), ITEMS[D[1]].n); markDirty(true); } }
{ const _om = openMuseum; openMuseum = function () { ancGrant(); return _om.apply(this, arguments); }; }
// paso 1: restaurar su santuario (la estela antigua) con el arma equipada
{ const _di = doInteract; doInteract = function () { const t = interactTarget(); const r = _di.apply(this, arguments);
    try { if (t && t.kind === 'estela') { const P = G.P, w = P.equip.weapon, D = w && ancDef(w.id); if (D && D[5] === t.o.estela && ancSt(D[1]) === 0) { const row = $('#modal .row'); if (row) { const b = document.createElement('button'); b.className = 'btn gold'; b.textContent = '✨ ' + L2('Restaurar el santuario (20 piedra, 5 polvo arcano)', 'Restore the shrine (20 stone, 5 arcane dust)');
      b.onclick = () => { if (countItem('piedra') < 20 || countItem('polvo_arcano') < 5) { toast(L2('Te faltan materiales', 'Missing materials'), 'warn'); return; } takeItem('piedra', 20); takeItem('polvo_arcano', 5); closeModal(); ancUp(D[1], 1); }; row.prepend(b); } } } } catch (e) { }
    return r; }; }
// paso 2: hablar con quien conoció a su portador
DLG_HOOKS.push((npc, opts) => { const P = G.P, w = P && P.equip && P.equip.weapon, D = w && ancDef(w.id); if (!D || D[6] !== npc.id || ancSt(D[1]) !== 1) return;
  opts.unshift({ label: '🗡 ' + L2('Preguntar por el arma ancestral', 'Ask about the ancestral weapon'), icon: ['book'], fn: () => { typeText(L2('Conozco esa arma… su último portador me habló de ella. Dijo que solo despertaría ante quien la creó. Ve y enfréntate a su creador.', 'I know that weapon… its last bearer told me about it. They said it would only awaken before whoever made it. Go and face its creator.')); ancUp(D[1], 2); } }); });
// paso 3: vencer a su creador con el arma equipada
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { const P = G.P, w = P && P.equip && P.equip.weapon, D = w && ancDef(w.id); if (D && m && m.mid === D[7] && ancSt(D[1]) === 2) ancUp(D[1], 3); } catch (e) { } return r; }; }
function ancText(P) { return ANC.filter(a => ITEMS[a[1]] && (P.anc || {})['got_' + a[1]]).map(a => { const s = ancSt(a[1]), st = STELAE[a[5]], who = NPCS[a[6]], boss = BOSSES[a[7]];
  const next = s === 0 ? L2('Restaura su santuario: la estela antigua ', 'Restore its shrine: ancient stele ') + (a[5] + 1) + (st ? ' (' + st[0] + ')' : '') : s === 1 ? L2('Habla con ', 'Talk to ') + (who ? who.n : a[6]) : s === 2 ? L2('Vence a su creador: ', 'Defeat its creator: ') + (boss ? boss.n : a[7]) : L2('Despierta', 'Awakened');
  return [ITEMS[a[1]].n, s, next, a[4]]; }); }

// =====================================================================================
// CRÓNICAS DEL MUNDO (Libro del Vínculo › Mundo y Biblioteca)
// =====================================================================================
{ const _ob = openBook; openBook = function (tab) { const r = _ob.apply(this, arguments);
    try { const M = $('#modal'); if (!M || M.hidden) return r; const chips = M.querySelector('.chips'); if (chips && !chips.querySelector('[data-bt="mundo"]')) { const b = document.createElement('button'); b.className = 'chip' + (bookTab === 'mundo' ? ' on' : ''); b.dataset.bt = 'mundo'; b.textContent = L2('Mundo', 'World'); b.onclick = () => openBook('mundo'); chips.appendChild(b); }
      if (bookTab === 'mundo') { const box = M.querySelector('.cron.book'); if (box) box.innerHTML = worldChron(); } } catch (e) { }
    return r; }; }
function worldChron() {
  const P = G.P, S = (t, items) => `<div class="era"><div class="eran">${t}</div>${items.length ? items.map(x => `<div class="rum">${x}</div>`).join('') : `<div class="cron-l">${L2('Nada todavía', 'Nothing yet')}</div>`}</div>`;
  const bk = Object.keys(P.bossKills || {}).filter(k => BOSSES[k]).map(k => `${SUPER_BOSS[k] !== undefined ? '⚠ ' : ''}<b>${esc(BOSSES[k].n)}</b> ×${P.bossKills[k]}`);
  const towns = (typeof TOWNS !== 'undefined' ? TOWNS : []).filter(t => P.wstate && P.wstate.towns && P.wstate.towns[t.k]).map(t => { const T = P.wstate.towns[t.k]; return `<b>${esc(t.n)}</b>${T.pros !== undefined ? ' · ' + L2('prosperidad', 'prosperity') + ' ' + Math.round(T.pros) : ''}`; });
  const fam = []; if (P.partner && NPCS[P.partner]) fam.push('💍 ' + L2('Pareja', 'Partner') + ': <b>' + esc(NPCS[P.partner].n) + '</b>'); (P.kids || []).forEach(k => fam.push('👶 <b>' + esc(k.name || '?') + '</b>')); if (P.kaela) fam.push('🐺 Kaela · ' + L2('nivel', 'level') + ' ' + (P.kaela.lv || 1));
  const fr = Object.keys(P.fr || {}).filter(k => NPCS[k] && (P.fr[k].p >= 40 || P.fr[k].t === 'rival')).map(k => `🤝 <b>${esc(NPCS[k].n)}</b> · ${frLabel(P.fr[k], k)}`);
  const disc = [L2('Capítulos del Libro', 'Book chapters') + `: ${(P.loreU || []).length}/${CRON.length}`, L2('Pistas', 'Clues') + `: ${(P.clues || []).length}/${Object.keys(CLUES).length}`, L2('Hallazgos en el museo', 'Finds in the museum') + `: ${Object.keys((P.mus || {}).fd || {}).length}/${FINDS.length}`, L2('Títulos', 'Titles') + `: ${(P.titles || []).length}`];
  const dec = []; if (P.vrW && P.vrW.path) dec.push(L2('Arma Velada: camino ', 'Veiled Weapon: path ') + (P.vrW.path === 'g' ? L2('Guardiana', 'Guardian') : L2('Devoradora', 'Devourer'))); if (P.sr) dec.push(L2('Subraza elegida: ', 'Chosen subrace: ') + P.sr); if (P.evo) dec.push(L2('Clase despertada', 'Awakened class')); if (P.vrEnd) dec.push(L2('Final del Velo Roto: ', 'Broken Veil ending: ') + P.vrEnd);
  (P.tech || []).forEach(k => TECH[k] && dec.push('🥋 ' + TECH[k][0]));
  const anc = ancText(P).map(([n, s, next]) => `🗡 <b>${esc(n)}</b> · ${s}/3 · ${esc(next)}`);
  let sec = []; try { if (typeof SECRETS !== 'undefined') sec = SECRETS.filter(s => !(s.done && s.done(P))).slice(0, 8).map(s => '❔ ' + esc(s.n || '???')); } catch (e) { }
  return `<p class="hint">${L2('Todo lo que has hecho en el mundo, apuntado por la Anciana Mira.', 'Everything you have done in the world, written down by Elder Mira.')}</p>`
    + S('⚔ ' + L2('Jefes derrotados', 'Bosses defeated') + ` (${bk.length}/${Object.keys(BOSSES).length})`, bk) + S('🏘 ' + L2('Pueblos que has ayudado', 'Towns you have helped'), towns) + S('👪 ' + L2('Familia', 'Family'), fam) + S('🤝 ' + L2('Amigos, rivales y mentores', 'Friends, rivals and mentors'), fr)
    + S('🔎 ' + L2('Descubrimientos', 'Discoveries'), disc) + S('⚖ ' + L2('Decisiones y técnicas', 'Decisions and techniques'), dec) + S('🗡 ' + L2('Armas ancestrales', 'Ancestral weapons'), anc) + S('❔ ' + L2('Secretos sin resolver', 'Unsolved secrets'), sec);
}

// =====================================================================================
// GUÍAS EN LA LUPA › SISTEMAS
// =====================================================================================
if (typeof GSIS !== 'undefined') {
  GSIS.push(['casa_util', '🏠 ' + L2('Casa útil: muebles con función', 'Useful house: furniture with functions'), () => [
    L2('En la Mesa de trabajo (Muebles, Decoración y Granja) hay muebles nuevos para tu casa. Colócalos dentro y tócalos:', 'At the Workbench (Furniture, Decoration and Farm) there is new furniture for your house. Place it inside and tap it:'),
    L2('Vitrina de trofeos y Pedestal: abren el Museo de aventuras. Taller del artesano: fabrica Esencias de imbuir, faroles y estatuas. Biblioteca: Crónicas del mundo y un libro al día con experiencia.', 'Trophy case and Pedestal: open the Adventure museum. Artisan workshop: makes Imbue essences, lanterns and statues. Library: World chronicles and one book a day with experience.'),
    L2('Trampilla del sótano: un sótano secreto con 40 huecos más. Cama de invitados: invita a un amigo a dormir (+amistad y un regalo). Macetero mágico: una semilla mágica al día. Mesa de alquimia: elixires con plantas mágicas.', 'Cellar trapdoor: a secret cellar with 40 more slots. Guest bed: invite a friend to sleep over (+friendship and a gift). Magic planter: one magic seed a day. Alchemy table: elixirs from magic plants.')], () => null]);
  GSIS.push(['museo', '🏛 ' + L2('Museo de aventuras y trofeos', 'Adventure museum and trophies'), () => [
    L2('Cada jefe suelta su trofeo la primera vez que lo vences (luego, un 10 %). Hay uno por jefe: ' + Object.keys(BOSSES).length + '.', 'Every boss drops its trophy the first time you defeat it (then, 10%). There is one per boss: ' + Object.keys(BOSSES).length + '.'),
    L2('En la Vitrina o el Pedestal de tu casa pulsa «Exponer lo que llevo»: se ven los trofeos con el dibujo del jefe, los hallazgos arqueológicos (salen excavando), las medallas de los festivales y tu primera arma de cada clase.', 'At the Display case or Pedestal in your house press "Display what I carry": you see trophies with the boss drawing, archaeological finds (from digging), festival medals and your first weapon of each class.'),
    L2('Cada día pasan aldeanos a ver tu colección y la comentan. Con 8 trofeos expuestos, el museo te entrega el arma ancestral de tu clase.', 'Every day villagers visit your collection and comment on it. With 8 trophies displayed, the museum gives you your class\'s ancestral weapon.')], () => null]);
  GSIS.push(['ancestral', '🗡 ' + L2('Armas ancestrales', 'Ancestral weapons'), () => [
    L2('No suben con experiencia: despiertan cumpliendo su historia, con el arma equipada. 1) Restaura su santuario en una estela antigua. 2) Habla con quien conoció a su antiguo portador. 3) Vence a su creador. Cada paso da +12 % de ataque.', 'They don\'t level with experience: they awaken by completing their story, with the weapon equipped. 1) Restore its shrine at an ancient stele. 2) Talk to whoever knew its former bearer. 3) Defeat its creator. Each step gives +12% attack.'),
    L2('Las ves en el Libro del Vínculo › Mundo, con el siguiente paso. Las forjaron los siete guardianes antes de que el Sello los torciera, y reyes de la Edad de los Reyes.', 'You see them in the Book of the Bond › World, with the next step. They were forged by the seven guardians before the Seal twisted them, and by kings of the Age of Kings.')], () => null]);
  GSIS.push(['amistad', '🤝 ' + L2('Amistades, rivales y mentores', 'Friendships, rivals and mentors'), () => [
    L2('Habla con cualquier personaje y pulsa «Amistad»: una charla al día da +8. Con 20 puedes proponer una rivalidad amistosa: duelos de rivales, y cada 3 victorias aprendes una técnica (+ataque, +defensa o +vida).', 'Talk to any character and press "Friendship": one chat a day gives +8. At 20 you can propose a friendly rivalry: rival duels, and every 3 wins you learn a technique (+attack, +defence or +HP).'),
    L2('Con 40 sois amigos y puedes invitarle a tu cama de invitados. Mentores: Brienne, la Anciana Mira, Lys, la Doctora Selma e Ysolde te enseñan su técnica propia al llegar a 60.', 'At 40 you are friends and can invite them to your guest bed. Mentors: Brienne, Elder Mira, Lys, Doctor Selma and Ysolde teach you their own technique at 60.')], () => null]);
  GSIS.push(['festival', '🎉 ' + L2('Festivales', 'Festivals'), () => [
    L2('Cada 3 días hay festival en los pueblos: habla con cualquier aldeano. Concurso musical, torneo de cocina, baile y carrera (una vez por festival; con 70 puntos ganas su medalla) y apuestas en la carrera de caracoles.', 'Every 3 days there is a festival in the towns: talk to any villager. Music contest, cooking tournament, dance and race (once per festival; with 70 points you win its medal) and snail race betting.'),
    L2('Las fichas del festival sirven en el Taller del artesano y para apostar. Las medallas van al museo.', 'Festival tokens are used at the Artisan workshop and for betting. Medals go to the museum.')], () => null]);
  GSIS.push(['jardin_magico', '🌙 ' + L2('Jardinería mágica', 'Magic gardening'), () => [
    L2('Semillas mágicas: del Macetero mágico de tu casa (una al día o comprándolas). Plántalas en tierra de cultivo.', 'Magic seeds: from the Magic planter in your house (one a day or by buying them). Plant them in farm soil.'),
    L2('Reaccionan al clima: Flor Lunar (noche, brilla en la oscuridad), Raíz de Tormenta (lluvia), Rosa de Escarcha (nieve o frío), Girasol Solar (día despejado), Seta del Velo (cuevas y el Velo) y Lirio Estelar (noche despejada, rara). Con su clima crecen el triple de rápido.', 'They react to the weather: Moonflower (night, glows in the dark), Storm Root (rain), Frost Rose (snow or cold), Solar Sunflower (clear day), Veil Mushroom (caves and the Veil) and Star Lily (clear night, rare). In their weather they grow three times faster.'),
    L2('En la Mesa de alquimia se convierten en elixires (ataque, defensa, experiencia, curación).', 'At the Alchemy table they become elixirs (attack, defence, experience, healing).')], () => null]);
  GSIS.push(['imbuir', '🔥 ' + L2('Armas imbuidas y reacciones', 'Imbued weapons and reactions'), () => [
    L2('Tu arma se ve imbuida (fuego, hielo, rayo o agua) al usar una habilidad de ese elemento, con una runa de la herrería o con una Esencia de imbuir (5 min, se hace en el Taller). Cada golpe lleva el elemento y provoca las reacciones: agua + rayo = descarga, agua + hielo = congelado, agua + fuego = apagado.', 'Your weapon looks imbued (fire, ice, lightning or water) when you use a skill of that element, with a blacksmith rune or with an Imbue essence (5 min, made at the Workshop). Every hit carries the element and triggers reactions: water + lightning = discharge, water + ice = frozen, water + fire = extinguished.'),
    L2('Pociones curativas: ahora esperan 8 segundos entre una y otra (el botón muestra la cuenta atrás). Maestría y arma despertada suben bastante más rápido.', 'Healing potions now have an 8 second cooldown (the button shows the countdown). Mastery and the awakened weapon level up much faster.')], () => null]);
  GSIS.push(['nihil_jefe', '⚠ ' + L2('Nihil, el Ente Oscuro', 'Nihil, the Dark Entity'), () => [
    L2('Súper jefe de la Corona del Cielo (nivel 250). Todos sus ataques se avisan en el suelo con un círculo morado que se llena: cuando está lleno, golpea.', 'Super boss of the Crown of the Sky (level 250). All its attacks are warned on the ground with a purple circle that fills up: when full, it hits.'),
    L2('Orbe Umbrío (orbes que te persiguen: sigue moviéndote), Garra del Vacío (sal del círculo), Pilar Oscuro (busca el hueco entre pilares), Lluvia de Cristales, Nova Nihil (aléjate o rueda justo al final) y Prisión Sombría (rueda antes de que se cierre o te atrapa).', 'Umbral Orb (orbs that chase you: keep moving), Void Claw (leave the circle), Dark Pillar (find the gap between pillars), Crystal Rain, Nihil Nova (get away or roll right at the end) and Shadow Prison (roll before it closes or it traps you).'),
    L2('Al 60 % se vuelve más rápido y llama sombras; al 25 % entra en «El Silencio» y combina dos ataques.', 'At 60% it gets faster and calls shadows; at 25% it enters "The Silence" and combines two attacks.')], () => null]);
}
