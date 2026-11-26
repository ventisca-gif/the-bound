// 6.27 · Tripulación (ideas 5 y 8 que aprobó Sergio): misiones personales, ataques combinados, cartel de Sanji y
// periódico. Crossover aparte de la historia principal (docs/LORE.md › Escenario crossover): no toca CRON ni ERAS.
//  · Misiones (sistema normal de misiones, con su flecha en el mar): Luffy «El sombrero de paja» (Makino en Foosha),
//    Zoro «La promesa de Kuina» (Ipponmatsu en Loguetown), Usopp «Una carta para Kaya» (Villa Syrup), Sanji «El
//    sueño del All Blue» (Zeff en el Baratie) y Nami «Los mandarinos de Bell-mère» (Nojiko y Genzo en Conomi).
//  · Premio de Luffy, Zoro, Usopp y Sanji: su ataque combinado contigo (botón 🤝 cuando la barra de combo está llena
//    y ese tripulante te sigue en tierra). Premio de Nami: el Merry navega un 10 % más rápido y las tormentas
//    esquivadas pagan el doble.
//  · Sanji entra en las recompensas de la tripulación (cartel) y Baratie, Arlong Park y Loguetown cuentan para ellas.
//  · Periódico: una gaviota mensajera lo trae una vez al día en el Mar de Dawn; se lee en Lupa › Crossovers.
SAVEKEYS.push('crewCombo', 'crewComboE', 'newsDay', 'newsSeen');

// ---------- cartel de Sanji y jefes que cuentan para las recompensas ----------
if (typeof CREW_BTY !== 'undefined' && !CREW_BTY.some(c => c[0] === BAR_SANJI)) CREW_BTY.push([BAR_SANJI, 'Sanji', P => !!P.baratieSanji]);
if (typeof CREW_BTY_FIGHT !== 'undefined') Object.assign(CREW_BTY_FIGHT, {
  baratie_pearl: ['sanji', 'luffy'], baratie_gin: ['sanji', 'luffy'], baratie_krieg: ['luffy', 'sanji'],
  con_hatchan: ['zoro'], con_kuroobi: ['sanji'], con_chew: ['usopp'], con_arlong: ['luffy', 'zoro'], logue_arc_smoker: ['luffy']
});

// ---------- misiones ----------
const CQ_ISLAND = { foosha: [522, 267], logue: LOGUE_PIER, syrup: SYRUP_PIER, baratie: BARATIE_PIER, conomi: CON_MOOR };
const CQ = {
  cq_luffy: { who: SHELLS_CAST_IDS.luffy, k: 'luffy', ok: P => true, isle: 'foosha', isleN: 'Villa Foosha',
    n: L2('El sombrero de paja', 'The straw hat'), lv: 560,
    desc: L2('Luffy quiere que Makino vea que cumple su promesa a Shanks. Después, demostrad juntos que vais en serio.', 'Luffy wants Makino to see he is keeping his promise to Shanks. Then show together that you mean it.'),
    obj: [{ t: 'talk', npc: 'dawn_makino', txt: L2('Visita a Makino en Villa Foosha', 'Visit Makino in Foosha Village') }, { t: 'kill', m: 'dawn_marine', n: 30, txt: L2('Vence a 30 marines', 'Defeat 30 marines') }, { t: 'flag', f: 'cq_luffy_duelo', txt: L2('Gana un duelo a Luffy', 'Win a duel against Luffy') }],
    combo: L2('Bazuca combinada', 'Combined Bazooka') },
  cq_zoro: { who: SHELLS_CAST_IDS.zoro, k: 'zoro', ok: P => true, isle: 'logue', isleN: 'Loguetown',
    n: L2('La promesa de Kuina', 'Kuina’s promise'), lv: 600,
    desc: L2('Zoro te cuenta lo de Kuina y la Wadō Ichimonji. Quiere saber si su acero sigue a la altura de la promesa.', 'Zoro tells you about Kuina and the Wado Ichimonji. He wants to know if his steel still lives up to the promise.'),
    obj: [{ t: 'flag', f: 'cq_zoro_ent', txt: L2('Saca 10 o más en Cortes con Zoro (bajo cubierta del Merry)', 'Score 10 or more in Cuts with Zoro (below deck on the Merry)') }, { t: 'talk', npc: 'logue_ippon', txt: L2('Pregunta a Ipponmatsu por la Wadō (armería de Loguetown)', 'Ask Ipponmatsu about the Wado (Loguetown arms shop)') }, { t: 'flag', f: 'cq_zoro_duelo', txt: L2('Gana un duelo a Zoro', 'Win a duel against Zoro') }],
    combo: L2('Tornado de tres espadas', 'Three-sword tornado') },
  cq_usopp: { who: SYRUP_USOPP, k: 'usopp', ok: P => !!P.syrupUsopp, isle: 'syrup', isleN: L2('Villa Syrup', 'Syrup Village'),
    n: L2('Una carta para Kaya', 'A letter for Kaya'), lv: 580,
    desc: L2('Usopp ha escrito una carta para Kaya, pero le da vergüenza llevarla él mismo. ¿Se la llevas?', 'Usopp wrote a letter for Kaya but he’s too embarrassed to take it himself. Will you deliver it?'),
    obj: [{ t: 'talk', npc: 'syrup_kaya', txt: L2('Lleva la carta a Kaya (Villa Syrup)', 'Take the letter to Kaya (Syrup Village)') }, { t: 'flag', f: 'cq_usopp_ent', txt: L2('Saca 12 o más en Puntería con Usopp (bajo cubierta)', 'Score 12 or more in Aim with Usopp (below deck)') }],
    combo: L2('Estrella de fuego combinada', 'Combined fire star') },
  cq_sanji: { who: BAR_SANJI, k: 'sanji', ok: P => !!P.baratieSanji, isle: 'baratie', isleN: 'Baratie',
    n: L2('El sueño del All Blue', 'The All Blue dream'), lv: 590,
    desc: L2('Sanji quiere enseñarle a Zeff que en el barco sigue cocinando en serio… y con ingredientes del mar.', 'Sanji wants to show Zeff he still cooks seriously aboard… with ingredients from the sea.'),
    obj: [{ t: 'talk', npc: 'baratie_zeff', txt: L2('Habla con Zeff en el Baratie', 'Talk to Zeff at the Baratie') }, { t: 'job', job: 'pesca', n: 3, txt: L2('Pesca 3 peces', 'Catch 3 fish') }, { t: 'flag', f: 'cq_sanji_festin', txt: L2('Cocina el Festín del Rey Marino con Sanji', 'Cook the Sea King Feast with Sanji') }],
    combo: L2('Patada del cocinero', 'Cook’s kick') },
  cq_nami: { who: ORANGE_NAMI, k: 'nami', ok: P => !!P.dawnCrewJoined, isle: 'conomi', isleN: L2('Islas Conomi', 'Conomi Islands'),
    n: L2('Los mandarinos de Bell-mère', 'Bell-mère’s tangerine trees'), lv: 600,
    desc: L2('Nami quiere volver un momento a casa: el huerto de mandarinas de Bell-mère, Nojiko y Genzo.', 'Nami wants to go home for a moment: Bell-mère’s tangerine grove, Nojiko and Genzo.'),
    obj: [{ t: 'talk', npc: 'con_nojiko', txt: L2('Visita a Nojiko en los mandarinos (Islas Conomi)', 'Visit Nojiko at the tangerine grove (Conomi Islands)') }, { t: 'talk', npc: 'con_genzo', txt: L2('Habla con Genzo', 'Talk to Genzo') }, { t: 'flag', f: 'cq_nami_tormenta', txt: L2('Esquiva una tormenta siguiendo a Nami', 'Dodge a storm following Nami') }],
    combo: null }
};
for (const [id, D] of Object.entries(CQ)) {
  q(id, { n: '🏴‍☠️ ' + D.n, giver: D.who, turnin: D.who, lv: D.lv, desc: D.desc, obj: D.obj, rew: { xp: 0, gold: 60000 } });
  const N = NPCS[D.who]; if (N) { N.quests = N.quests || []; if (!N.quests.includes(id)) N.quests.push(id); }
}
// solo con ese tripulante ya en la tripulación
hookAfter('canOffer', (r, id) => { const D = CQ[id]; if (r && D && !D.ok(G.P)) return false; });
// flecha a la isla del siguiente paso al aceptar y al hablar con alguien de la misión
function cqMark(id) { const D = CQ[id], P = G.P; if (!D || !P || !P.quests.active[id]) return; const A = P.quests.active[id], i = D.obj.findIndex((o, k) => (A.p[k] || 0) < (o.n || 1));
  const o = D.obj[i]; if (!o || o.t !== 'talk') return; const at = CQ_ISLAND[D.isle]; if (at && typeof setWp === 'function') setWp({ loc: at.slice(), m: 'dawn', t: D.isleN }); }
hookAfter('questEvent', (_r, type) => { if (type === 'init' || type === 'talk') for (const id in CQ) cqMark(id); });
// marcas (flags) de los objetivos
const cqFlag = f => questEvent('flag', { f });
hookBefore('mbTrainEnd', () => { const A = ACT; if (A.k !== 'mbtrain') return; const sc = A.score - (A.tk === 'zoro' ? A.miss : 0);
  if (A.tk === 'zoro' && sc >= 10) cqFlag('cq_zoro_ent'); if (A.tk === 'usopp' && sc >= 12) cqFlag('cq_usopp_ent'); });
hookBefore('crewDuelEnd', win => { const R = CREW_DUEL; if (!R || win !== true) return; if (R.id === SHELLS_CAST_IDS.luffy) cqFlag('cq_luffy_duelo'); if (R.id === SHELLS_CAST_IDS.zoro) cqFlag('cq_zoro_duelo'); });
hookBefore('mbCookEnd', fail => { if (!fail && ACT.k === 'mbcook' && ACT.dish === 'festin') cqFlag('cq_sanji_festin'); });
let CQ_STORM = null;
V33_TICKS.push(() => { const S = typeof NV !== 'undefined' ? NV.storm : null; if (CQ_STORM && !S && !CQ_STORM.hit) cqFlag('cq_nami_tormenta'); CQ_STORM = S; });
// premios
hookAfter('completeQuest', (_r, id) => { const D = CQ[id], P = G.P; if (!D || !P) return; P.crewCombo = P.crewCombo || {};
  if (D.combo) { P.crewCombo[D.k] = 1; banner('🤝 ' + L2('Ataque combinado: ', 'Combined attack: ') + D.combo, L2('Llena la barra golpeando y pulsa 🤝 con ', 'Fill the bar by attacking and press 🤝 with ') + NPCS[D.who].n + L2(' en tierra.', ' ashore.')); }
  else { P.crewCombo.nami = 1; banner('🧭 ' + L2('Nami: viento a favor', 'Nami: tailwind'), L2('El Merry navega un 10 % más rápido y las tormentas esquivadas pagan el doble.', 'The Merry sails 10 % faster and dodged storms pay double.')); }
  markDirty(true); });
// premio de Nami: más velocidad al timón del Merry y tormentas esquivadas ×2
hookAround('updatePlayer', (next, dt) => { const P = G.P; if (!(P && P.crewCombo && P.crewCombo.nami && G.map && G.map.dawn && P.dawnHelm && P.dawnHelm.kind === 'skiff' && P.dawnCrewJoined) || (typeof merryDeck === 'function' && merryDeck())) return next(dt);
  const x0 = P.x, y0 = P.y, r = next(dt), M = G.map, nx = x0 + (P.x - x0) * 1.1, ny = y0 + (P.y - y0) * 1.1; if (dawnSurface(M, nx, ny, dawnShipRadius(P, P.dawnHelm))) { P.x = nx; P.y = ny; } return r; });
let CQ_G0 = 0; hookBefore('banner', a => { if (/Bien esquivada|Nicely dodged/.test(String(a || '')) && G.P && G.P.crewCombo && G.P.crewCombo.nami) { const g = 2500 + nvTier() * 800; G.P.gold += g; } });

// ---------- ataque combinado ----------
const COMBO_ATK = {
  luffy: { id: SHELLS_CAST_IDS.luffy, mode: 'rubber', tech: 2, k: 8, r: 70 },
  zoro: { id: SHELLS_CAST_IDS.zoro, mode: 'sweep', tech: 0, k: 9, r: 90 },
  usopp: { id: SYRUP_USOPP, mode: 'powder', tech: 0, k: 7, r: 110 },
  sanji: { id: BAR_SANJI, mode: 'kick', tech: 0, k: 8.5, r: 80 }
};
const COMBO_MAX = 30;   // golpes para llenar la barra
function comboMate() {   // tripulante con combo aprendido que te sigue ahora en tierra (o pelea contigo en una escena)
  const P = G.P, M = G.map; if (!P || !M || !P.crewCombo) return null;
  for (const [k, C] of Object.entries(COMBO_ATK)) { if (!P.crewCombo[k]) continue;
    const e = G.ents.find(e => e.type === 'npc' && e.id === C.id && e.map === M.id && !e.remove && e.hp !== 0 && Math.hypot(e.x - P.x, e.y - P.y) < 220); if (e) return [k, C, e]; }
  return null;
}
hookAfter('hitMob', (d, m, base, src) => { const P = G.P; if (!P || !P.crewCombo || !(d > 0) || (src && (src.summon || src.combo)) || !G.map || !G.map.dawn) return;
  P.crewComboE = Math.min(COMBO_MAX, (P.crewComboE || 0) + 1); });
function comboFire() {
  const P = G.P, mate = comboMate(); if (!mate || (P.crewComboE || 0) < COMBO_MAX || P.dead) return;
  const [k, C, e] = mate, tgt = (P.target && !P.target.dying && P.target.map === G.map.id) ? P.target : G.ents.filter(m => m.type === 'mob' && !m.dying && m.map === G.map.id).sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y))[0];
  if (!tgt || Math.hypot(tgt.x - P.x, tgt.y - P.y) > 200) { toast(L2('No hay enemigos cerca.', 'No enemies nearby.'), 'info'); return; }
  P.crewComboE = 0; G.hitstop = 0.12; G.shake = 10; sfx('crit');
  e.dir = dirFromVec(tgt.x - e.x, tgt.y - e.y); setAnim(e, 'atk'); e.actionUntil = G.t + 0.8; e.actionLength = 0.8; e.crewPose = { index: C.tech, start: G.t, end: G.t + 0.8 };
  P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y); setAnim(P, 'atk');
  for (let j = 0; j < 4; j++) addFx({ type: 'crewTechnique', x: e.x, y: e.y - 13, endX: tgt.x, endY: tgt.y - 12, angle: Math.atan2(tgt.y - e.y, tgt.x - e.x), mode: C.mode, col: (typeof CREW_TECH_COLORS !== 'undefined' && CREW_TECH_COLORS[C.mode]) || '#ffe08a', delay: 0.2 + j * 0.08, j, tech: C.tech, hits: 4, dur: 0.5 + j * 0.08 });
  addFx({ type: 'ring', x: tgt.x, y: tgt.y, r: C.r, dur: 0.6, col: '#ffd040' });
  const D = CQ['cq_' + k]; banner('🤝 ' + (D ? D.combo : ''), e.def && e.def.n ? e.def.n + ' + ' + (P.name || '') : '');
  setTimeout(() => { if (G.P !== P) return; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === G.map.id && Math.hypot(m.x - tgt.x, m.y - tgt.y) < C.r)
    hitMob(m, P.S.atk * C.k * (m.boss ? 0.6 : 1), { combo: 1, critB: 25 }); burst(tgt.x, tgt.y - 10, 26, { sp: 140, up: 60, life: 0.6, c: ['#ffd040', '#ffffff', '#ff8a3a'] }); }, 450);
  markDirty();
}
function comboBtn() {
  const acts = $('#acts'); if (!acts) return null; let b = $('#bCombo');
  if (!b) { b = document.createElement('button'); b.id = 'bCombo'; b.className = 'rb'; b.title = L2('Ataque combinado con la tripulación', 'Combined attack with the crew');
    b.style.cssText = 'position:absolute;right:13.2em;bottom:9.4em;width:3em;height:3em;font-size:1.1em;z-index:6;overflow:hidden';
    b.innerHTML = '<span style="position:relative;z-index:2">🤝</span><i style="position:absolute;left:0;right:0;bottom:0;background:rgba(255,208,64,.55);height:0"></i>';
    b.addEventListener('pointerdown', ev => { ev.stopPropagation(); ev.preventDefault(); comboFire(); }); acts.appendChild(b); }
  return b;
}
V33_TICKS.push(() => { const P = G.P; const mate = P && P.crewCombo && G.map && G.map.dawn && !P.dawnHelm && !ACT.k ? comboMate() : null; const b = mate ? comboBtn() : $('#bCombo');
  if (!b) return; b.hidden = !mate; if (!mate) return; const f = (P.crewComboE || 0) / COMBO_MAX, i = b.querySelector('i'); if (i) i.style.height = Math.round(f * 100) + '%';
  b.style.boxShadow = f >= 1 ? '0 0 0 3px #ffd040,0 0 14px 4px #ffd040' : ''; b.style.opacity = f >= 1 ? '1' : '.75'; });
window.addEventListener('keydown', e => { if (e.code === 'KeyC' && !e.repeat && G.P && !(document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName))) comboFire(); });

// ---------- periódico (gaviota mensajera, una vez al día en el Mar de Dawn) ----------
const NEWS_FLAVOR = [
  L2('Avistan un restaurante flotante con forma de pez que sigue abierto pese a los destrozos de una flota pirata.', 'A fish-shaped floating restaurant is still open despite damage from a pirate fleet.'),
  L2('Un payaso con la nariz roja jura venganza a «un tal sombrero de paja» desde una isla perdida.', 'A red-nosed clown swears revenge on “some straw hat” from a lost island.'),
  L2('Pescadores del Mar de Dawn piden prudencia: los Reyes Marinos se acercan a las rutas comerciales.', 'Dawn Sea fishermen urge caution: Sea Kings are coming close to trade routes.'),
  L2('La Marina refuerza la vigilancia en Loguetown tras los últimos disturbios en la plaza del patíbulo.', 'The Navy steps up patrols in Loguetown after the latest unrest in the execution square.'),
  L2('Una tormenta tropical obliga a cerrar el puerto de Orange Town durante dos días.', 'A tropical storm forces Orange Town’s port to close for two days.'),
  L2('Se busca a dos cazarrecompensas que «perdieron» su barco frente al Baratie.', 'Wanted: two bounty hunters who “lost” their ship near the Baratie.'),
  L2('El Pelirrojo, visto de nuevo en el Grand Line. Nadie sabe hacia dónde navega.', 'The Red-Haired, seen again in the Grand Line. Nobody knows where he is headed.'),
  L2('Villa Syrup celebra que su joven señora se ha recuperado y estudia para ser médica.', 'Syrup Village celebrates its young lady’s recovery: she is studying to become a doctor.')
];
function newsToday() { const P = G.P, d = typeof calDay === 'function' ? calDay() : Math.floor(Date.now() / 864e5); return { P, d }; }
function newsLines() {
  const { P, d } = newsToday(); const out = [];
  out.push('📰 ' + L2('Noticias del Mar de Dawn · día ', 'Dawn Sea News · day ') + d);
  if (P.bounty) out.push('📜 ' + L2('Tu recompensa: ', 'Your bounty: ') + bntFmt(P.bounty) + (bntTier() ? ' · ' + L2('peligro ', 'danger ') + bntTier() + '/7' : ''));
  try { const top = crewMet(P).map(c => [c[1], (P.crewBty || {})[crewKey(c[0])] || 0]).sort((a, b) => b[1] - a[1])[0]; if (top) out.push('🏴‍☠️ ' + L2('La más alta de tu tripulación: ', 'Highest in your crew: ') + top[0] + ' · ' + bntFmt(top[1])); } catch (e) { }
  const s = P.nvStats || {}; if (s.marina || s.pirata || s.rey) out.push('⚓ ' + L2('Hundidos: ', 'Sunk: ') + (s.marina || 0) + L2(' de la Marina, ', ' Navy, ') + (s.pirata || 0) + L2(' piratas, ', ' pirates, ') + (s.rey || 0) + L2(' Reyes Marinos', ' Sea Kings'));
  try { const I = crewPowerInfo(P); out.push('💪 ' + L2('Arcos completados: ', 'Arcs completed: ') + I.done + '/' + CREW_POW_ARCS.length); } catch (e) { }
  for (let k = 0; k < 2; k++) out.push('• ' + NEWS_FLAVOR[(d * 3 + k * 5) % NEWS_FLAVOR.length]);
  return out;
}
const NEWS_GULL = { t: -1, x: 0, y: 0 };
V33_TICKS.push(dt => { const P = G.P, M = G.map; if (!P || !M || !M.dawn || !P.dawnCrewJoined || ACT.k) return; const { d } = newsToday();
  if (P.newsDay === d || NEWS_GULL.t >= 0) { if (NEWS_GULL.t >= 0) { NEWS_GULL.t += dt || 0.016; if (NEWS_GULL.t > 3) { NEWS_GULL.t = -1; P.newsDay = d; P.newsSeen = 0;
      toast('📰 ' + L2('¡La gaviota mensajera trae el periódico! Léelo en Lupa › Crossovers › Periódico.', 'The News Coo brought the newspaper! Read it in Lupa › Crossovers › Newspaper.'), 'quest', 7); markDirty(); } } return; }
  NEWS_GULL.t = 0; });
WORLD_DRAW.push((cx, cy) => { if (NEWS_GULL.t < 0 || !G.map || !G.map.dawn) return; const k = NEWS_GULL.t / 3, P = G.P, x = P.x - cx - 260 + k * 520, y = P.y - cy - 120 + Math.sin(k * Math.PI) * 60;
  const w = Math.sin(G.t * 14) * 5; ctx.fillStyle = '#1a1220'; ctx.fillRect(x - 7, y - 3, 14, 6); ctx.fillStyle = '#f4f2ea'; ctx.fillRect(x - 6, y - 2, 12, 4); ctx.fillStyle = '#e8e4d8'; ctx.beginPath(); ctx.moveTo(x - 4, y - 1); ctx.lineTo(x - 12, y - 6 + w); ctx.lineTo(x - 2, y + 1); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 4, y - 1); ctx.lineTo(x + 12, y - 6 + w); ctx.lineTo(x + 2, y + 1); ctx.fill();
  ctx.fillStyle = '#f0b020'; ctx.fillRect(x + 6, y - 1, 3, 2); ctx.fillStyle = '#d8d0b8'; ctx.fillRect(x - 3, y + 3, 6, 4); ctx.fillStyle = '#5a5a5a'; ctx.fillRect(x - 2, y + 4, 4, 1); });

// ---------- Lupa › 🏴‍☠️ Crossovers ----------
if (typeof LUPA_DAWN !== 'undefined') {
  LUPA_DAWN.push(['cq627', () => '🤝 ' + L2('Misiones de la tripulación', 'Crew quests'), () => {
    const P = G.P; return [L2('Cada tripulante tiene su misión (se la pides hablando con él cuando ya está en tu tripulación). La flecha dorada te lleva a la isla de cada paso.', 'Each crewmate has a quest (ask them once they are in your crew). The golden arrow takes you to the island of each step.')]
      .concat(Object.entries(CQ).map(([id, D]) => { const st = P.quests.done[id] ? '✅ ' : P.quests.active[id] ? '▶ ' : '• '; return st + NPCS[D.who].n + ' · ' + D.n + ' (' + L2('nv. ', 'lv. ') + D.lv + '): ' + D.obj.map(o => typeof o.txt === 'function' ? o.txt() : o.txt).join(' → ') + '. ' + (D.combo ? L2('Premio: ataque combinado «', 'Reward: combined attack “') + D.combo + L2('».', '”.') : L2('Premio: el Merry navega un 10 % más rápido y las tormentas esquivadas pagan el doble.', 'Reward: the Merry sails 10 % faster and dodged storms pay double.')); }))
      .concat([L2('Ataque combinado: golpeando en el Mar de Dawn se llena la barra del botón 🤝 (30 golpes). Si un tripulante con combo te sigue en tierra, púlsalo (o la tecla C): gran golpe en área contigo (×7-9 tu ataque; jefes ×0,6).', 'Combined attack: hitting enemies in the Dawn Sea fills the 🤝 button’s bar (30 hits). If a crewmate with a combo follows you ashore, press it (or the C key): a big area hit together (×7-9 your attack; bosses ×0.6).')]); }, () => null]);
  LUPA_DAWN.push(['news627', () => '📰 ' + L2('Periódico', 'Newspaper'), () => { const P = G.P; if (P) P.newsSeen = 1;
    return [L2('Una gaviota mensajera trae el periódico una vez al día mientras estás en el Mar de Dawn con tu tripulación.', 'A News Coo brings the newspaper once a day while you are in the Dawn Sea with your crew.')].concat(P && P.newsDay != null ? newsLines() : [L2('Todavía no ha llegado ningún periódico.', 'No newspaper has arrived yet.')]); }, () => null]);
}

// el cartel nuevo de un tripulante se abría solo (ventana que pausa el juego) aunque estuvieras en mitad de un arco
// (p. ej. al vencer a Smoker, justo antes del patíbulo). En arcos, escenas y minijuegos solo queda el aviso.
hookBefore('crewPoster', (key, fresh) => { if (fresh && typeof nvCalm === 'function' && nvCalm()) return HOOK_SKIP; });
