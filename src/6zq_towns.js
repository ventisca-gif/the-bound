// ================= v3.8: ASEDIO DE LA LUNA DE SANGRE, NPCs QUE CAEN AL VELO, PUEBLOS QUE CRECEN Y FESTIVALES =================
SAVEKEYS.push('fest', 'festTok');
// ---------- NPCs derribados: caen 5 minutos, su alma va al Velo y luego se levantan ----------
const DOWNED = new Set();
function npcDown(e, why) {
  if (!e || e.downT > G.t || e.follow || e.remove) return; e.downT = G.t + 300; e.noTag0 = e.noTag; e.noTag = 1; DOWNED.add(e);
  e.chat = pick([L2('¡Ayuda…!', 'Help…!'), L2('No… puedo… levantarme…', 'I… can\'t… get up…'), L2('Veo una luz azul…', 'I see a blue light…'), L2('¡Mis hijos! ¡Que alguien los proteja!', 'My children! Someone protect them!')]); e.chatT = G.t;
  burst(e.x, e.y - 10, 10, { sp: 50, up: 40, g: 80, life: 0.6, c: ['#8ab0ff', '#ffffff'] });
  if (why !== 'quiet') toast((e.def ? e.def.n : '?') + L2(' ha caído. Su alma vaga por el Velo… se levantará en 5 minutos (o ayúdale tú).', ' has fallen. Their soul wanders the Veil… they\'ll get up in 5 minutes (or help them yourself).'), 'warn', 4);
}
function npcUp(e, helped) {
  if (!e.downT) return; e.downT = 0; e.noTag = e.noTag0; DOWNED.delete(e);
  e.chat = helped ? pick([L2('Gracias… creía que no volvía.', 'Thank you… I thought I wouldn\'t make it back.'), L2('¡Me has salvado! No lo olvidaré.', 'You saved me! I won\'t forget it.')]) : pick([L2('He visto el Velo… había mucha gente esperando.', 'I saw the Veil… there were so many people waiting.'), L2('Un guardián me ató el hilo otra vez. Qué raro sueño.', 'A guardian tied my thread again. What a strange dream.'), L2('Estuve en un sitio azul y frío… ya estoy bien.', 'I was somewhere blue and cold… I\'m fine now.')]); e.chatT = G.t;
  burst(e.x, e.y - 10, 12, { sp: 40, up: 60, g: -20, life: 0.8, c: ['#8ab0ff', '#ffffff', '#ffe08a'] });
}
{ const _un = updateNPC; updateNPC = function (e, dt) { if (e.downT) { if (G.t > e.downT) npcUp(e); else { setAnim(e, 'idle'); return; } } return _un(e, dt); }; }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e.type === 'npc' && e.downT > G.t) { const x = e.x - cx, y = e.y - cy; ctx.save(); ctx.translate(x, y); ctx.rotate(-1.45); ctx.translate(-x, -y + 6); ctx.globalAlpha = 0.8; try { _de(e, cx, cy); } finally { ctx.restore(); } if (Math.random() < 0.15) part(e.x + (Math.random() - 0.5) * 16, e.y - 4, { z: 4, vz: 16, life: 1.2, c: '#a8c8ff', s: 2 }); return; } return _de(e, cx, cy); }; }
{ const _it = interactTarget; interactTarget = function () { const P = G.P; if (!P.dead) for (const e of DOWNED) if (e.map === P.map && dist2(e.x, e.y, P.x, P.y) < 30 * 30) return { kind: 'npcup', e, label: L2('Ayudar a levantarse', 'Help them up'), icon: 'talk' }; return _it(); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(); if (t && t.kind === 'npcup') { npcUp(t.e, true); sfx('level'); const tk = (wedTownOf(t.e) || {}).k; if (tk) addRep(tk, 15, true); G.P.gold += 200; floatText(G.P.x, G.P.y - 34, '+200 ' + L2('oro', 'gold'), '#ffd040'); return; } return _di(); }; }
// ---------- el Devorador Carmesí (asedio de la Luna de Sangre) ----------
BOSSES.devorador_carmesi = { n: L2('Devorador Carmesí', 'Crimson Devourer'), lv: 60, art: ['bst', 'golem', ['#1a0004', '#4a0a10', '#8a1a20', '#d8403a'], 4, { core: '#ff2a2a' }], hp: 40, atk: 2.2, def: 2.2, spd: 26, moves: ['slam', 'nova', 'charge', 'summon'], minion: 'esqueleto', drops: [['hongo_sangre', 1, 4], ['diamante', 0.5, 2]], r: 46 };
const SIEGE_POOL = ['orco', 'goblin', 'esqueleto', 'bandido', 'demonio', 'lagarto'];
let SIEGE = null;
const SIEGE_R = 5;
function siegeStart(tk) { const W = G.P.wstate; W.bmSiege = calDay(); SIEGE = { town: tk, round: 0, left: 0, wait: G.t + 3 }; banner(L2('¡ASEDIO DE LA LUNA DE SANGRE!', 'BLOOD MOON SIEGE!'), townName(tk) + L2(' · 5 rondas · en la 4.ª llega algo enorme', ' · 5 rounds · in the 4th something huge arrives')); sfx('horn'); G.shake = 6;
  for (const e of G.ents) if (e.type === 'npc' && e.map === 'world' && e.def && e.def.tf && Math.random() < 0.4) { e.chat = pick([L2('¡La luna está roja! ¡Todos a casa!', 'The moon is red! Everyone inside!'), L2('¡Héroe, protégenos!', 'Hero, protect us!'), L2('Dicen que esta noche despierta el Devorador…', 'They say the Devourer wakes tonight…')]); e.chatT = G.t; } }
function siegeRound() {
  const S = SIEGE, tk = S.town, c = townCenter(tk), lv = evLevel(tk); S.round++; let n = 0;
  if (S.round === 4) { const s = freeSpot(c.x, c.y - 8, 6) || freeSpot(c.x, c.y, 12); if (s) { const b = spawnMob('devorador_carmesi', lv + 6, s.x, s.y, s.L, null, true); b.siege = 1; b.noSafe = 1; b.aggroR = 260; b.maxhp = b.hp = Math.round(b.hp * 1.4); S.boss = b; n = 1; b.stompT = G.t + 4; } banner(L2('Ronda 4 de 5 · ¡EL DEVORADOR CARMESÍ!', 'Round 4 of 5 · THE CRIMSON DEVOURER!'), L2('Está destrozando el pueblo: ¡detenlo!', 'It\'s wrecking the town: stop it!')); G.shake = 12; sfx('boom'); }
  else { const k = S.round === 5 ? 5 : 5 + S.round * 2; for (let i = 0; i < k; i++) { const s = freeSpot(c.x + (Math.random() - 0.5) * 18, c.y + (Math.random() - 0.5) * 14, 6) || freeSpot(c.x, c.y, 14); if (!s) continue; const m = spawnMob(pick(SIEGE_POOL.filter(x => MOBS[x])), lv + S.round, s.x, s.y, s.L, null, false); m.siege = 1; m.noSafe = 1; m.aggroR = 170; if (S.round === 5) { m.elite = 1; m.name = L2('Heraldo Carmesí', 'Crimson Herald'); m.maxhp = m.hp = m.hp * 3; } n++; } banner(L2('Ronda ', 'Round ') + S.round + L2(' de 5', ' of 5'), townName(tk)); sfx('horn'); }
  S.left = n;
}
function siegeEnd(won) {
  const S = SIEGE, tk = S.town, W = G.P.wstate; SIEGE = null; for (const m of G.ents) if (m.siege && !m.dying) m.remove = true; W.towns[tk] = W.towns[tk] || {};
  if (won) { banner(L2('¡Has salvado ', 'You saved ') + townName(tk) + '!', L2('La Luna de Sangre se retira', 'The Blood Moon retreats')); addRep(tk, 250); const P = G.P; P.gold += 20000 + P.lv * 500; giveItem('hongo_sangre', 3); if (giveCosmetic('c_capa_carmesi', true)) toast(L2('Cosmético exclusivo: Capa Carmesí', 'Exclusive cosmetic: Crimson Cape'), 'loot', 5); news(townName(tk) + L2(' resistió el asedio de la Luna de Sangre gracias a ti.', ' survived the Blood Moon siege thanks to you.'), 'good'); }
  else { W.towns[tk].ruin = calDay() + 3; ruinFlags(); news(L2('El Devorador Carmesí arrasó ', 'The Crimson Devourer razed ') + townName(tk) + L2('. Dona materiales para reconstruirlo.', '. Donate materials to rebuild it.'), 'bad'); }
}
// pisotones que destrozan casas y derriban vecinos
function devourerStomp(b) {
  const r = 70; telegraph({ shape: 'circle', x: b.x, y: b.y, r, dur: 1.1, col: 'rgba(255,40,40,0.25)', cb: () => { G.shake = Math.max(G.shake, 10); sfx('boom'); burst(b.x, b.y, 30, { sp: 140, up: 60, g: 160, life: 0.8, c: ['#5a2a1a', '#8a6a4a', '#ff4a2a'] });
    const P = G.P; if (dist2(P.x, P.y, b.x, b.y) < r * r) hurtPlayer(b.atk * 1.8, { stun: 1 });
    const W = G.world, tk = SIEGE && SIEGE.town, WT = G.P.wstate.towns, TS = tk ? (WT[tk] = WT[tk] || {}) : null; for (const o of W.objs) if (o.k === 'bld' && !o.ruin && dist2(o.px, o.py, b.x, b.y) < 175 * 175) { o.ruin = 1; if (TS) { TS.broken = TS.broken || []; if (!TS.broken.includes(o.id)) TS.broken.push(o.id); } for (let k = 0; k < 6; k++) setTimeout(() => part(o.px + (Math.random() - 0.5) * 40, o.py - 20, { z: 10, vz: 30, life: 1.5, c: pick(['#ff6a2a', '#ffd040', '#3a2a20']), s: 3 }), k * 120); }
    for (const e of G.ents) if (e.type === 'npc' && e.map === 'world' && !e.follow && dist2(e.x, e.y, b.x, b.y) < 100 * 100) npcDown(e); } });
}
{ const _rf = ruinFlags; ruinFlags = function () { _rf(); const W = G.world, WS = G.P && G.P.wstate; if (!W || !WS) return; for (const t of TOWNS) { const T_ = WS.towns[t.k]; if (!T_ || !T_.broken || !T_.broken.length) continue; for (const o of W.objs) if (T_.broken.includes(o.id)) o.ruin = 1; } }; }
let siegeT = 0;
function siegeTick(dt) {
  const P = G.P, W = P && P.wstate; if (!P || !W || !G.world) return; siegeT += dt; if (siegeT < 0.5) return; siegeT = 0;
  if (!SIEGE) { if (bloodMoon() && G.map === G.world && P.lv >= 20 && W.bmSiege !== calDay()) { const t = TOWNS.find(t => P.x / 16 > t.x0 - 12 && P.x / 16 < t.x1 + 12 && P.y / 16 > t.y0 - 12 && P.y / 16 < t.y1 + 12); if (t && !townRuined(t.k)) siegeStart(t.k); } return; }
  const S = SIEGE; if (!bloodMoon() && S.round < 5) { siegeEnd(S.round >= 5); return; }
  const alive = G.ents.filter(m => m.siege && m.type === 'mob' && !m.dying && !m.remove); S.left = alive.length;
  if (!alive.length && !S.next && S.round > 0 && G.t > S.wait) { if (S.round >= SIEGE_R) { siegeEnd(true); return; } S.wait = G.t + 6; toast(L2('¡Ronda superada! Prepárate para la siguiente…', 'Round cleared! Get ready for the next one…'), 'quest', 3); S.next = 1; }
  if (S.next && G.t > S.wait) { S.next = 0; siegeRound(); } else if (S.round === 0 && G.t > S.wait) siegeRound();
  if (S.boss && !S.boss.dying && G.t > S.boss.stompT) { S.boss.stompT = G.t + 5 + Math.random() * 2; devourerStomp(S.boss); }
  // los monstruos del asedio también derriban vecinos
  for (const m of alive) { if (Math.random() > 0.05) continue; const e = G.ents.find(e => e.type === 'npc' && e.map === 'world' && !e.downT && !e.follow && dist2(e.x, e.y, m.x, m.y) < 26 * 26); if (e) npcDown(e); }
}
V33_TICKS.push(siegeTick);
cosm('c_capa_carmesi', L2('Capa Carmesí', 'Crimson Cape'), 'back', () => ({ k: 'cape', o: P5(['#1a0004', '#4a0a10', '#8a1a20', '#c83a3a', '#ff6a5a']), i: P5(['#0a0002', '#1a0004', '#2a0a10', '#4a0a10', '#6a1a20']), tr: GOLD.slice(1) }), { src: L2('Sobrevivir al asedio de la Luna de Sangre', 'Survive the Blood Moon siege') });
// ---------- pueblos que crecen: donaciones, obras de los NPCs, calles y misiones nuevas ----------
const DEV_MAX = 5;
function devReq(lv) { return { log: 25 * (lv + 1), piedra: 20 * (lv + 1), gold: 4000 * (lv + 1) * (lv + 1) }; }
function townDev(tk) { const T_ = (G.P.wstate.towns || {})[tk] || {}; return T_.dev || 0; }
function devDonate(tk, what) {
  const P = G.P, W = P.wstate; W.towns[tk] = W.towns[tk] || {}; const T_ = W.towns[tk]; T_.don = T_.don || { log: 0, piedra: 0, gold: 0 }; const lv = T_.dev || 0; if (lv >= DEV_MAX) return; const R = devReq(lv);
  if (what === 'log') { const n = Math.min(10, logCount(), R.log - T_.don.log); if (n <= 0) { toast(L2('No tienes troncos (o ya no hacen falta)', 'You have no logs (or they\'re not needed)'), 'warn'); return; } takeLogs(n); T_.don.log += n; }
  if (what === 'piedra') { const n = Math.min(10, countItem('piedra'), R.piedra - T_.don.piedra); if (n <= 0) { toast(L2('No tienes piedra (o ya no hace falta)', 'You have no stone (or it\'s not needed)'), 'warn'); return; } takeItem('piedra', n); T_.don.piedra += n; }
  if (what === 'gold') { const n = Math.min(1000 * (lv + 1), P.gold, R.gold - T_.don.gold); if (n <= 0) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= n; T_.don.gold += n; }
  addRep(tk, 5, true); sfx('coin');
  if (T_.ruin > calDay() && T_.don.log >= 10) { T_.ruin = calDay(); T_.broken = []; ruinFlags(); for (const o of G.world.objs) if (o.k === 'bld' && o.ruin && !townRuined(tk)) o.ruin = 0; news(townName(tk) + L2(' ya está reconstruido gracias a las donaciones.', ' is rebuilt thanks to the donations.'), 'good'); }
  if (T_.don.log >= R.log && T_.don.piedra >= R.piedra && T_.don.gold >= R.gold) { T_.dev = lv + 1; T_.don = { log: 0, piedra: 0, gold: 0 }; T_.buildT = Date.now(); banner(townName(tk) + L2(' crece', ' grows'), L2('Nivel de pueblo ', 'Town level ') + T_.dev + ' · ' + DEV_TXT[T_.dev - 1]); sfx('level'); news(L2('Los vecinos de ', 'The people of ') + townName(tk) + L2(' empiezan obras nuevas con tus donaciones.', ' start new works with your donations.'), 'good'); devDecor(true); }
  markDirty(true);
}
const DEV_TXT = [L2('Los vecinos construyen una casa nueva', 'The villagers build a new house'), L2('Abre un puesto de mercado nuevo', 'A new market stall opens'), L2('Se empiedran las calles de la plaza', 'The plaza streets are paved'), L2('Otra casa y una tienda de artesanía', 'Another house and a craft shop'), L2('Un jardín con fuente y farolas', 'A garden with a fountain and lamps')];
function openDonate(tk) {
  const P = G.P, T_ = (P.wstate.towns[tk] = P.wstate.towns[tk] || {}), lv = T_.dev || 0, R = devReq(lv), D = T_.don || { log: 0, piedra: 0, gold: 0 }, bar = (a, b) => `<i class="dbar"><b style="width:${Math.min(100, 100 * a / b).toFixed(0)}%"></b></i>`;
  openModal(`<h2>${iconHTML(['house'], 22)} ${L2('Mejorar ', 'Improve ')}${esc(townName(tk))}</h2><p class="hint">${L2('Nivel de pueblo', 'Town level')} ${lv}/${DEV_MAX}. ${lv < DEV_MAX ? L2('Siguiente: ', 'Next: ') + esc(DEV_TXT[lv]) + '. ' + L2('Cada nivel desbloquea una misión nueva del capataz.', 'Each level unlocks a new quest from the foreman.') : L2('¡El pueblo está al máximo!', 'The town is maxed out!')}${townRuined(tk) ? ' <b>' + L2('Está destrozado: con 10 troncos donados se reconstruye.', 'It\'s wrecked: donating 10 logs rebuilds it.') + '</b>' : ''}</p>
    ${lv < DEV_MAX ? `<div class="slist"><div class="srow"><div class="sn"><b>${L2('Troncos', 'Logs')} ${D.log}/${R.log}</b>${bar(D.log, R.log)}</div><button class="btn sm" data-dn="log">+10</button></div><div class="srow"><div class="sn"><b>${L2('Piedra', 'Stone')} ${D.piedra}/${R.piedra}</b>${bar(D.piedra, R.piedra)}</div><button class="btn sm" data-dn="piedra">+10</button></div><div class="srow"><div class="sn"><b>${L2('Oro', 'Gold')} ${fmt(D.gold)}/${fmt(R.gold)}</b>${bar(D.gold, R.gold)}</div><button class="btn sm" data-dn="gold">+${fmt(1000 * (lv + 1))}</button></div></div>` : ''}
    <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('#modal [data-dn]').forEach(b => b.onclick = () => { devDonate(tk, b.dataset.dn); openDonate(tk); });
}
// capataz en cada pueblo (recibe donaciones y da misiones al subir el pueblo)
const DEV_TOWNS = ['albor', 'puerto', 'arxar', 'sahrim'];
for (const tk of DEV_TOWNS) NPCS['capataz_' + tk] = { n: { albor: 'Brunilda', puerto: 'Ezra', arxar: 'Hagen', sahrim: 'Zahir' }[tk], title: L2('Capataz de obras', 'Works foreman'), look: LK({ hair: pick([HAIRS.castano, HAIRS.negro, HAIRS.rojo]), outfit: 'smith', main: CLOTH.marron, sec: CLOTH.amarillo, hat: 'helmet', hatC: P5(['#7a5a0a', '#c8a020', '#ffd040', '#ffe880', '#ffffff']) }), lines: [L2('Con materiales, este pueblo puede ser una ciudad.', 'With materials, this town could become a city.'), L2('Troncos, piedra y oro. Nada más… y nada menos.', 'Logs, stone and gold. Nothing more… and nothing less.')], quests: [] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); for (const tk of DEV_TOWNS) { const t = TOWNS.find(t => t.k === tk); if (!t) continue; const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 + 4, (t.y0 + t.y1) / 2 + 6); W.npcDefs.push({ id: 'capataz_' + tk, x, y, face: 'down' }); } }; }
DLG_HOOKS.push((npc, opts) => { const tk = npc.id.startsWith('capataz_') ? npc.id.slice(8) : null; if (tk) opts.unshift({ label: L2('Donar para mejorar el pueblo', 'Donate to improve the town'), icon: ['house'], fn: () => { closeDialog(); openDonate(tk); } }); });
// misiones que se desbloquean con el nivel del pueblo
const DEV_Q = [
  [{ t: 'job', job: 'tala', n: 25, txt: L2('Tala madera para las obras', 'Chop wood for the works') }, L2('Las obras necesitan vigas. Tala 25 veces y te pago bien.', 'The works need beams. Chop 25 times and I\'ll pay you well.')],
  [{ t: 'job', job: 'mineria', n: 25, txt: L2('Mina piedra para el mercado', 'Mine stone for the market') }, L2('El puesto nuevo quiere suelo de piedra. Mina 25 veces.', 'The new stall wants a stone floor. Mine 25 times.')],
  [{ t: 'job', job: 'pesca', n: 15, txt: L2('Pesca para la inauguración', 'Fish for the opening') }, L2('Inauguramos las calles con una comida. Trae 15 capturas.', 'We\'re opening the streets with a feast. Bring 15 catches.')],
  [{ t: 'job', job: 'herbo', n: 15, txt: L2('Recoge hierbas para el artesano', 'Gather herbs for the artisan') }, L2('El artesano necesita tintes. Recoge 15 hierbas.', 'The artisan needs dyes. Gather 15 herbs.')],
  [{ t: 'job', job: 'tala', n: 40, txt: L2('Madera noble para el jardín', 'Fine wood for the garden') }, L2('El último gran proyecto: el jardín. Necesito 40 talas.', 'The last big project: the garden. I need 40 chops.')],
];
for (const tk of DEV_TOWNS) DEV_Q.forEach(([ob, desc], i) => { const id = 'dv_' + tk + '_' + (i + 1); q(id, { n: L2('Obras de ', 'Works in ') + { albor: 'Albor', puerto: 'Puerto Coral', arxar: 'Arxar', sahrim: 'Sahrim' }[tk] + ' ' + (i + 1), giver: 'capataz_' + tk, lv: 1 + i * 8, dev: i + 1, devTown: tk, desc, obj: [ob], rew: { xp: 400 + i * 1500, gold: 3000 * (i + 1), items: [['piedra', 10]] }, offer: desc, done: L2('¡Gracias! El pueblo te lo agradecerá.', 'Thanks! The town will remember this.') }); NPCS['capataz_' + tk].quests.push(id); });
{ const _co = canOffer; canOffer = function (id) { const Q = QUESTS[id]; if (Q && Q.dev && townDev(Q.devTown) < Q.dev) return false; return _co(id); }; }
// casas nuevas, puestos y calles (decoración del mundo según el nivel de cada pueblo)
EXTRA_SPR.nhouse = o => spr('nh' + (o.v || 0) + (o.scaf ? 's' : ''), () => { const p = new Pix(48, 52), W_ = WOOD, roof = pal([['#5a1a14', '#8a2a1a', '#b84a2a', '#e07a4a'], ['#1a2a4a', '#2a4a7a', '#3a6aa8', '#6a9ad0'], ['#2a3a1a', '#4a6a2a', '#6a8a3a', '#9ab85a']][(o.v || 0) % 3]);
  p.rect(6, 22, 36, 28, W_[3]); for (let y = 24; y < 50; y += 4) p.hl(6, y, 36, W_[2]); p.rect(20, 34, 8, 16, C('#2a1a10')); p.set(26, 42, C('#ffd040')); p.rect(10, 28, 7, 6, C('#8ad0ff')); p.rect(31, 28, 7, 6, C('#8ad0ff'));
  for (let k = 0; k < 14; k++) p.hl(2 + k, 22 - k, 44 - k * 2, roof[k < 3 ? 1 : 2]); p.hl(2, 22, 44, roof[0]);
  if (o.scaf) { for (const x of [3, 15, 30, 44]) p.vl(x, 4, 46, W_[1]); for (const y of [16, 30, 44]) p.hl(2, y, 44, W_[4]); }
  p.outline(OUTL); return { c: p.canvas(), ax: 24, ay: 50 }; });
EXTRA_SPR.nstall = o => spr('nstall' + (o.v || 0), () => { const p = new Pix(40, 34), cl = [C('#d83a3a'), C('#ffffff')]; p.rect(4, 18, 32, 14, WOOD[3]); p.hl(4, 18, 32, WOOD[4]); p.vl(5, 4, 28, WOOD[1]); p.vl(34, 4, 28, WOOD[1]); for (let x = 2; x < 38; x++) p.vl(x, 2, 7, cl[((x >> 2) + (o.v || 0)) % 2]); for (let k = 0; k < 4; k++) p.ball(10 + k * 7, 15, 2, 2, pal(['#6a3a0a', '#c87a2a', '#ffb04a', '#ffe08a'])); p.outline(OUTL); return { c: p.canvas(), ax: 20, ay: 32 }; });
EXTRA_SPR.nlamp = () => spr('nlamp', () => { const p = new Pix(10, 30); p.rect(4, 8, 2, 21, IRON[1]); p.rect(2, 2, 6, 7, IRON[2]); p.rect(3, 3, 4, 5, C('#ffe08a')); p.outline(OUTL); return { c: p.canvas(), ax: 5, ay: 29 }; });
let DEV_D = []; const DEV_FLOOR = [];
function devDecor(force) {
  if (!G.world || !G.P || !G.P.wstate) return; if (!force && DEV_D.length) return; for (const e of DEV_D) e.remove = true; DEV_D = []; DEV_FLOOR.length = 0;
  for (const tk of DEV_TOWNS) { const lv = townDev(tk), t = TOWNS.find(t => t.k === tk); if (!lv || !t) continue; const T_ = G.P.wstate.towns[tk], scaf = T_.buildT && Date.now() - T_.buildT < 180000, [px, py] = townPlaza(tk);
    const add = (k2, dx, dy, o) => { const [x, y] = freeTileNear(Object.assign({ npcDefs: [] }, G.world), px + dx, py + dy); const e = Object.assign({ type: 'deco', k2, map: 'world', x: x * 16 + 8, y: y * 16 + 14, solid: 1 }, o || {}); G.ents.push(e); DEV_D.push(e); return e; };
    const ox = (t.x1 - t.x0) / 2 + 3;
    if (lv >= 1) add('nhouse', -ox, -3, { v: 0, scaf: scaf && lv === 1 });
    if (lv >= 2) { add('nstall', 6, 4, { v: 1 }); const e = spawnNPC('mercader_obras', 0, 0, 'world', {}); if (e) { const s = DEV_D[DEV_D.length - 1]; e.x = s.x; e.y = s.y + 14; e.devTk = tk; DEV_D.push(e); } }
    if (lv >= 3) for (let dy = -3; dy <= 3; dy++) for (let dx = -5; dx <= 5; dx++) { const i = tileAt(G.world, px + dx, py + dy); if (i >= 0 && !SOLID_T[G.world.ter[i]] && G.world.ter[i] !== T.WATER && G.world.objAt[i] < 0 && Math.abs(dx) + Math.abs(dy) > 2) DEV_FLOOR.push([px + dx, py + dy]); }
    if (lv >= 4) { add('nhouse', ox, -4, { v: 1, scaf: scaf && lv === 4 }); add('nstall', -6, 5, { v: 2 }); }
    if (lv >= 5) { add('nhouse', -ox, 4, { v: 2, scaf: scaf && lv === 5 }); for (const [dx, dy] of [[-4, -2], [4, -2], [-4, 3], [4, 3]]) add('nlamp', dx, dy); }
    if (scaf) { const e = spawnNPC('albanil', 0, 0, 'world', {}); if (e) { const h = DEV_D.find(d => d.scaf); if (h) { e.x = h.x + 30; e.y = h.y + 6; e.chat = L2('¡Martillo y paciencia! Mañana estará lista.', 'Hammer and patience! It\'ll be ready tomorrow.'); e.chatT = G.t; DEV_D.push(e); } } } }
}
NPCS.mercader_obras = { n: L2('Mercader del Pueblo', 'Town Merchant'), title: L2('Puesto nuevo', 'New stall'), look: LK({ hair: HAIRS.rubio, outfit: 'apron', main: CLOTH.verde, sec: CLOTH.beige }), lines: [L2('¡Abierto gracias a tus donaciones!', 'Open thanks to your donations!')] };
NPCS.albanil = { n: L2('Albañil', 'Builder'), title: L2('Obras', 'Works'), look: LK({ hair: HAIRS.negro, outfit: 'smith', main: CLOTH.gris, sec: CLOTH.marron, hat: 'helmet', hatC: P5(['#7a5a0a', '#c8a020', '#ffd040', '#ffe880', '#ffffff']) }), lines: [L2('Esta casa la pagaste tú. ¡Gracias!', 'You paid for this house. Thanks!')] };
{ const _bf = bldDrawFloors; bldDrawFloors = function (M, cx, cy) { _bf(M, cx, cy); if (!M.isWorld || !DEV_FLOOR.length) return; for (const [x, y] of DEV_FLOOR) { const sx = x * 16 - cx, sy = y * 16 - cy; if (sx < -16 || sy < -16 || sx > VW || sy > VH) continue; ctx.drawImage(floorSpr('fl_stone', (x + y) % 2), sx, sy); } }; }
let devT = 0; V33_TICKS.push(dt => { devT += dt || 0; if (devT < 3) return; devT = 0; if (G.map === G.world) { bldHookMap(G.world); if (!DEV_D.length || DEV_D.some(d => d.scaf) && DEV_TOWNS.every(tk => { const T_ = (G.P.wstate.towns || {})[tk]; return !T_ || !T_.buildT || Date.now() - T_.buildT > 180000; })) devDecor(true); } });
// ---------- FESTIVALES: pesca, carrera, baile, linternas en equipo y tienda de cosméticos ----------
it('ficha_festival', { n: L2('Ficha de Festival', 'Festival Token'), t: 'mat', stack: true, price: 0, icon: ['coin'], rar: 2 });
const FEST_COS = [
  ['c_fest_capa', L2('Capa de Feria', 'Fair Cape'), 'back', () => ({ k: 'cape', o: CLOTH.rojo, i: CLOTH.amarillo, tr: GOLD.slice(1) }), 15],
  ['c_fest_juglar', L2('Traje de Juglar', 'Jester Outfit'), 'body', () => ({ k: 'coat', m: CLOTH.morado, s: GOLD.slice(1) }), 20],
  ['c_fest_yukata', L2('Yukata de Linternas', 'Lantern Yukata'), 'body', () => ({ k: 'kimono', m: CLOTH.marino, s: CLOTH.naranja }), 25],
  ['c_fest_rosa', L2('Chaqueta Rosa de Peluche', 'Pink Fluffy Jacket'), 'body', () => ({ k: 'coat', m: CLOTH.rosa, s: CLOTH.blanco }), 25],
  ['c_fest_campeon', L2('Sombrero de Campeón', 'Champion Hat'), 'head', () => ({ k: 'sunhat', m: GOLD.slice(0, 5), s: CLOTH.rojo, cover: 'hat' }), 30],
  ['c_fest_alas', L2('Alas de Farolillo', 'Lantern Wings'), 'back', () => ({ k: 'wings', o: P5(['#7a2a0a', '#c85a1a', '#ff9a3a', '#ffd070', '#fff4c0']) }), 40],
];
for (const [id, n, slot, vis] of FEST_COS) cosm(id, n, slot, vis, { src: L2('Tienda del Festival', 'Festival Shop') });
NPCS.ceremonias = { n: L2('Madame Confeti', 'Madame Confetti'), title: L2('Maestra de Ceremonias', 'Master of Ceremonies'), look: LK({ hair: HAIRS.rojo, hairStyle: 'long', outfit: 'royal', main: CLOTH.morado, sec: GOLD.slice(0, 5), hat: 'wizard', hatC: CLOTH.amarillo }), lines: [L2('¡Pasen y vean! ¡Concursos para todos!', 'Step right up! Contests for everyone!'), L2('En los festivales las fichas valen el doble.', 'During festivals tokens are worth double.')] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); for (const tk of DEV_TOWNS) { const t = TOWNS.find(t => t.k === tk); if (!t) continue; const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 - 3, (t.y0 + t.y1) / 2 - 5); W.npcDefs.push({ id: 'ceremonias', x, y, face: 'down' }); } }; }
let FEST = null;
function festMul() { const tk = (wedTownOf(G.P) || {}).k; return tk && evActive('festival', tk) ? 2 : 1; }
function festReward(n, what) { n = Math.max(0, Math.round(n * festMul())); if (n) { giveItem('ficha_festival', n); toast(what + ': +' + n + ' ' + L2('fichas de festival', 'festival tokens'), 'loot', 4); sfx('coin'); } markDirty(); }
function festStart(kind) {
  const P = G.P; if (FEST) { toast(L2('Ya estás en un concurso', 'You\'re already in a contest'), 'warn'); return; } closeDialog(); closeModal();
  if (kind === 'pesca') { FEST = { k: 'pesca', end: G.t + 120, n: 0, rival: 3 + Math.floor(Math.random() * 4) }; banner(L2('Concurso de pesca', 'Fishing contest'), L2('2 minutos: pesca todo lo que puedas · Récord rival: ', '2 minutes: catch as much as you can · Rival record: ') + FEST.rival); }
  if (kind === 'carrera') { const [px, py] = [Math.floor(P.x / 16), Math.floor(P.y / 16)], pts = []; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; const s = freeSpot(px + Math.cos(a) * 14, py + Math.sin(a) * 10, 3); if (s) pts.push({ x: s.x, y: s.y }); } FEST = { k: 'carrera', pts, i: 0, t0: G.t, end: G.t + 70 }; banner(L2('¡Carrera!', 'Race!'), L2('Pasa por los 6 aros en orden antes de 70 s', 'Go through the 6 rings in order within 70 s')); }
  if (kind === 'linternas') { const [px, py] = [P.x / 16, P.y / 16], L = []; for (let k = 0; k < 20; k++) { const s = freeSpot(px + (Math.random() - 0.5) * 36, py + (Math.random() - 0.5) * 26, 4); if (s) L.push({ x: s.x, y: s.y, got: 0 }); } FEST = { k: 'linternas', L, n: 0, end: G.t + 90, goal: 20 }; banner(L2('Linternas del festival (cooperativo)', 'Festival lanterns (co-op)'), L2('Entre todos los jugadores cercanos: 20 linternas en 90 s', 'Together with nearby players: 20 lanterns in 90 s')); }
  if (kind === 'baile') { danceGame(); return; }
  sfx('horn');
}
function festRemoteLanterns() { let n = 0; for (const r of G.remote.values()) if (r.map === G.P.map && r.fl && r.fl[0] === calDay() && dist2(r.x, r.y, G.P.x, G.P.y) < 600 * 600) n += clamp(r.fl[1] | 0, 0, 20); return n; }
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); if (FEST && FEST.k === 'linternas') o.fl = [calDay(), FEST.n]; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); r.fl = Array.isArray(pr.fl) ? pr.fl : null; }; }
{ const _fc = fishCaught; fishCaught = function (fish) { const r = _fc.apply(this, arguments); if (FEST && FEST.k === 'pesca') { FEST.n++; floatText(G.P.x, G.P.y - 50, L2('Capturas: ', 'Catches: ') + FEST.n, '#8ad8ff'); } return r; }; }
function festTick() {
  const F = FEST, P = G.P; if (!F || !P) return;
  if (F.k === 'carrera') { const p = F.pts[F.i]; if (p && dist2(P.x, P.y, p.x, p.y) < 22 * 22) { F.i++; sfx('coin'); burst(p.x, p.y - 10, 10, { sp: 60, up: 40, g: 40, life: 0.5, c: ['#ffd040', '#ffffff'] }); if (F.i >= F.pts.length) { const t = G.t - F.t0; FEST = null; P.fest = P.fest || {}; const best = P.fest.race || 999; if (t < best) P.fest.race = t; banner(L2('¡Meta! ', 'Finish! ') + t.toFixed(1) + ' s', t < best ? L2('¡Nuevo récord!', 'New record!') : L2('Récord: ', 'Record: ') + best.toFixed(1) + ' s'); festReward(t < 30 ? 8 : t < 45 ? 5 : 3, L2('Carrera', 'Race')); return; } } }
  if (F.k === 'linternas') { for (const l of F.L) if (!l.got && dist2(P.x, P.y, l.x, l.y) < 20 * 20) { l.got = 1; F.n++; sfx('coin'); } const tot = F.n + festRemoteLanterns(); if (tot >= F.goal) { FEST = null; banner(L2('¡Linternas encendidas!', 'Lanterns lit!'), L2('Lo habéis conseguido juntos', 'You did it together')); festReward(6, L2('Linternas', 'Lanterns')); return; } }
  if (G.t > F.end) { FEST = null; if (F.k === 'pesca') { const won = F.n > F.rival; banner(won ? L2('¡Ganas el concurso de pesca!', 'You win the fishing contest!') : L2('Fin del concurso', 'Contest over'), F.n + ' ' + L2('capturas', 'catches') + ' · ' + L2('rival', 'rival') + ' ' + F.rival); festReward(won ? 8 : F.n >= 2 ? 2 : 0, L2('Pesca', 'Fishing')); } else toast(L2('Se acabó el tiempo', 'Time\'s up'), 'warn'); }
}
V33_TICKS.push(festTick);
// aros de la carrera y linternas
{ const _r = render; render = function () { _r.apply(this, arguments); const F = FEST; if (!F || G.map !== G.world) return; const cx = Math.round(G.cam.x), cy = Math.round(G.cam.y);
  if (F.k === 'carrera') F.pts.forEach((p, i) => { if (i < F.i) return; ctx.strokeStyle = i === F.i ? '#ffd040' : 'rgba(255,255,255,0.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(p.x - cx, p.y - cy - 14, 10, 14, 0, 0, 7); ctx.stroke(); });
  if (F.k === 'linternas') for (const l of F.L) if (!l.got) { const y = l.y - cy - 16 + Math.sin(G.t * 3 + l.x) * 2; ctx.fillStyle = '#ff9a3a'; ctx.fillRect(l.x - cx - 3, y - 4, 7, 9); ctx.fillStyle = '#ffe08a'; ctx.fillRect(l.x - cx - 1, y - 2, 3, 5); }
  const left = Math.max(0, Math.ceil(F.end - G.t)); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(VW / 2 - 60, 26, 120, 14); const s = textSprite((F.k === 'linternas' ? (F.n + festRemoteLanterns()) + '/' + F.goal + ' · ' : F.k === 'pesca' ? F.n + ' · ' : (F.i + '/' + F.pts.length) + ' · ') + left + ' s', '#ffe08a'); ctx.drawImage(s, VW / 2 - (s.width >> 1), 29); }; }
// baile: pulsa las flechas a tiempo
function danceGame() {
  const seq = Array.from({ length: 14 }, () => Math.floor(Math.random() * 4)), AR = ['←', '↑', '↓', '→'], t0 = performance.now() + 1200, step = 650; let hit = 0, idx = 0, done = false;
  openModal(`<h2>${iconHTML(['note:#ffd040'], 22)} ${L2('Concurso de baile', 'Dance contest')}</h2><p class="hint">${L2('Pulsa la flecha cuando llegue a la línea dorada.', 'Tap the arrow when it reaches the golden line.')}</p><canvas id="dcv" width="240" height="200" style="width:100%;max-width:360px;image-rendering:pixelated;background:#140a10;border-radius:.5em"></canvas><div class="row">${AR.map((a, i) => `<button class="btn" data-da="${i}" style="font-size:1.4em;min-width:2.4em">${a}</button>`).join('')}</div><p class="hint" id="dsc">0</p>`, 'party');
  const cv = $('#dcv'), x = cv.getContext('2d');
  const press = i => { if (done) return; const now = performance.now(); let best = -1, bd = 1e9; seq.forEach((s, k) => { if (k < idx) return; const tk = t0 + k * step, d = Math.abs(now - tk); if (d < bd) { bd = d; best = k; } }); if (best >= 0 && seq[best] === i && bd < 220) { hit += bd < 100 ? 2 : 1; idx = best + 1; sfx('coin'); } else sfx('hurt'); const sc = $('#dsc'); if (sc) sc.textContent = hit; };
  $$('#modal [data-da]').forEach(b => b.onpointerdown = e => { e.preventDefault(); press(+b.dataset.da); });
  const key = e => { const m = { ArrowLeft: 0, ArrowUp: 1, ArrowDown: 2, ArrowRight: 3 }[e.code]; if (m !== undefined) { e.preventDefault(); press(m); } }; window.addEventListener('keydown', key);
  const loop = () => { if (done || !document.body.contains(cv)) { window.removeEventListener('keydown', key); return; } const now = performance.now(); x.clearRect(0, 0, 240, 200); x.fillStyle = '#ffd040'; x.fillRect(0, 160, 240, 3); x.font = '22px sans-serif'; x.textAlign = 'center';
    seq.forEach((s, k) => { if (k < idx) return; const y = 160 - (t0 + k * step - now) / 6; if (y < -20 || y > 210) return; x.fillStyle = ['#ff6a8a', '#8ad8ff', '#9aff6a', '#ffd040'][s]; x.fillText(AR[s], 30 + s * 60, y); });
    if (now > t0 + seq.length * step + 400) { done = true; window.removeEventListener('keydown', key); const pct = hit / (seq.length * 2); closeModal(); banner(L2('Puntuación de baile: ', 'Dance score: ') + Math.round(pct * 100) + '%', pct > 0.8 ? L2('¡El público enloquece!', 'The crowd goes wild!') : pct > 0.5 ? L2('¡Buen ritmo!', 'Nice rhythm!') : L2('Hay que practicar…', 'Needs practice…')); festReward(pct > 0.8 ? 7 : pct > 0.5 ? 4 : 1, L2('Baile', 'Dance')); return; } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}
function openFestShop() {
  const P = G.P, W_ = P.wardrobe || [], tok = countItem('ficha_festival');
  openModal(`<h2>${iconHTML(['coin'], 22)} ${L2('Tienda del Festival', 'Festival Shop')}</h2><p class="hint">${L2('Cosméticos exclusivos. Tienes ', 'Exclusive cosmetics. You have ')}${tok} ${L2('fichas', 'tokens')}.</p><div class="slist">${FEST_COS.map(([id, n, slot, v, price]) => `<div class="srow"><div class="sn"><b>${esc(n)}</b><small>${price} ${L2('fichas', 'tokens')}</small></div>${W_.includes(id) ? `<small>${L2('Ya lo tienes', 'Owned')}</small>` : `<button class="btn sm" data-fb="${id}" data-p="${price}" ${tok >= price ? '' : 'disabled'}>${L2('Comprar', 'Buy')}</button>`}</div>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('#modal [data-fb]').forEach(b => b.onclick = () => { takeItem('ficha_festival', +b.dataset.p); giveCosmetic(b.dataset.fb); openFestShop(); });
}
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'ceremonias') return;
  opts.unshift({ label: L2('Tienda del Festival', 'Festival Shop'), icon: ['coin'], fn: () => { closeDialog(); openFestShop(); } });
  opts.unshift({ label: L2('Linternas en equipo (cooperativo)', 'Team lanterns (co-op)'), icon: ['users'], fn: () => festStart('linternas') });
  opts.unshift({ label: L2('Concurso de baile', 'Dance contest'), icon: ['note:#ffd040'], fn: () => festStart('baile') });
  opts.unshift({ label: L2('Carrera por el pueblo', 'Race around town'), icon: ['run'], fn: () => festStart('carrera') });
  opts.unshift({ label: L2('Concurso de pesca (2 min)', 'Fishing contest (2 min)'), icon: ['rod:2'], fn: () => festStart('pesca') }); });

DLG_HOOKS.push((npc, opts) => { if (npc.id === 'mercader_obras') opts.unshift({ label: L2('Ver el puesto', 'Browse the stall'), icon: ['bag'], fn: () => { closeDialog(); openShop('store', npc.devTk || 'albor'); } }); });
