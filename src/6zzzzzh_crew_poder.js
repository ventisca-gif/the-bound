// 6.20 · Poder de la tripulación y duelos con la tripulación (Sergio: «revisa que con cada batalla aumente su poder,
// o sea si completas el arco una vez, y agrega una opción al hablarles para desafiarlos con su poder actual» + «no borres nada»
// + «que en las luchas amistosas salgan sus animaciones de caminata y de ataque que ya existen» + «repetir el arco no sube,
// estaría muy OP»).
// Antes: syrupCrewStats solo contaba la PRIMERA victoria sobre 7 jefes (Morgan … Kuro). Baratie, Arlong Park, Loguetown
// y repetir un arco no los hacían más fuertes. Ahora:
//  1) La PRIMERA victoria sobre cada jefe de la historia y la PRIMERA vez que completas cada arco suben el poder de toda
//     la tripulación (vida, defensa y daño de sus técnicas). Repetir un arco no sube nada. Gancho sobre syrupCrewStats.
//  2) Al hablar con Luffy, Zoro, Usopp o Sanji (Nami no pelea): «Desafiar» con su poder actual. Duelo amistoso en el sitio:
//     nadie muere (al llegar a 0 el duelo termina), no da XP ni botín y no cuenta como batalla para el poder.
//     Premio en oro solo la primera vez que le ganas con un poder nuevo (no se puede repetir para sacar oro).

// ---------- 1) poder que sube con cada batalla y cada arco ----------
const CREW_POW_ARCS = [
  ['shells', 'Shells Town', P => crewBk(P, MORGAN_ID)],
  ['orange', 'Orange Town', P => crewBk(P, ORANGE_BUGGY)],
  ['syrup', L2('Villa Syrup', 'Syrup Village'), P => crewBk(P, SYRUP_CAPTAIN)],
  ['baratie', 'Baratie', P => crewBk(P, 'baratie_krieg')],
  ['conomi', 'Arlong Park', P => crewBk(P, 'con_arlong')],
  ['logue', 'Loguetown', P => P.logueArcN || 0],
  ['bellhaven', L2('Puerto de las Campanas','Bellhaven'), P => P.glPortQuest?.done ? Math.max(1,P.glPortQuest.runs || 0) : 0]
];
// jefes de la historia: la primera victoria sobre cada uno cuenta una vez (repetir no suma)
const CREW_POW_BOSSES = [MORGAN_ID, ORANGE_CABAJI, ORANGE_BUGGY, SYRUP_SHAM, SYRUP_BUCHI, SYRUP_JANGO, SYRUP_CAPTAIN,
  'baratie_pearl', 'baratie_gin', 'baratie_krieg', 'con_hatchan', 'con_kuroobi', 'con_chew', 'con_arlong',
  'logue_arc_smoker', 'logue_smuggler', 'logue_guard', 'logue_captain'];
const CREW_POW = { arc1: 0.15, battle: 0.02, max: 1.5 };
function crewBk(P, id) { return Math.max(0, (P && P.bossKills && P.bossKills[id]) | 0); }
function crewPowerInfo(P) {
  P = P || G.P;
  const arcs = CREW_POW_ARCS.map(([k, n, f]) => ({ k, n, runs: Math.max(0, f(P) | 0) }));
  const done = arcs.filter(a => a.runs > 0).length;
  const battles = CREW_POW_BOSSES.filter(id => crewBk(P, id) > 0).length;
  const bonus = Math.min(CREW_POW.max, done * CREW_POW.arc1 + battles * CREW_POW.battle);
  return { arcs, done, battles, bonus };
}
// se suma a lo que ya daba la 5.96-6.04 (victorias de Morgan a Kuro y el nivel), sin quitar nada
hookAfter('syrupCrewStats', (r, P, id) => {
  if (!r || !P) return;
  const b = crewPowerInfo(P).bonus; if (!(b > 0)) return;
  r.hp = Math.round(r.hp * (1 + b)); r.def = Math.round(r.def * (1 + b * 0.6)); r.boost = r.boost * (1 + b * 0.5); r.crewBonus = b;
  return r;
});
// número que se enseña: 100 = como al unirse; sube con la historia
function crewPowerNum(P, id) {
  try { const s = syrupCrewStats(P, id, Math.min(700, P.lv || 600)); return Math.round(100 * s.boost); } catch (e) { return 100; }
}

// ---------- 2) duelo con un tripulante ----------
const CREW_RIVAL = {
  [SHELLS_CAST_IDS.luffy]: { k: 'luffy', n: 'Luffy', hp: 52, atk: 3.9, def: 3.7, spd: 86, r: 30 },
  [SHELLS_CAST_IDS.zoro]: { k: 'zoro', n: 'Zoro', hp: 58, atk: 4.0, def: 3.9, spd: 80, r: 32 },
  [SYRUP_USOPP]: { k: 'usopp', n: 'Usopp', hp: 46, atk: 3.7, def: 3.5, spd: 84, r: 40 },
  [BAR_SANJI]: { k: 'sanji', n: 'Sanji', hp: 54, atk: 4.0, def: 3.8, spd: 96, r: 30 }
};
// Nami no pelea (Sergio): no se la puede desafiar; sigue al timón como siempre.
for (const [id, d] of Object.entries(CREW_RIVAL)) {
  BOSSES['crew_rival_' + d.k] = { n: d.n, lv: 600, hp: d.hp, atk: d.atk, def: d.def, spd: d.spd, r: d.r, where: L2('Duelo con la tripulación', 'Crew duel'), art: ['crew_rival', id], moves: [], drops: [] };
  if (typeof DAWN_RETO === 'object') DAWN_RETO['crew_rival_' + d.k] = 1.0;
}
hookAround('mobAtlasFor', (next, art) => art && art[0] === 'crew_rival' && NPCS[art[1]] ? npcAtlas(art[1]) : next(art));
SAVEKEYS.push('crewDuel', '_cdAshore');
const crewHas = (P, id) => id === SHELLS_CAST_IDS.luffy || id === SHELLS_CAST_IDS.zoro ? !!crewBk(P, MORGAN_ID)
  : id === SYRUP_USOPP ? !!P.syrupUsopp : id === BAR_SANJI ? !!P.baratieSanji : false;
let CREW_DUEL = null;
// duelo amistoso: ~4 min con el poder inicial y ~8 min con el máximo (modelo de tools/dev/jefes.py, héroe típico de su nivel)
const CREW_DUEL_HP = 0.35, CREW_DUEL_ATK = 0.6;
function crewDuelBusy(M, P) {
  return !!(CREW_DUEL || !M || M.id !== 'dawn' || !P || P.dead || P.dawnHelm || G.bossBar || G.fading || (typeof CINE !== 'undefined' && CINE.on) ||
    M.syrup?.run || M.baratie?.run || M.conomi?.run || M.conomi?.scene || M.orange?.run || M.shellsRescue?.run || M.logueArc || M.logueActors?.trial);
}
function crewDuelStats(P, id) {
  const s = syrupCrewStats(P, id, Math.min(700, Math.max(600, P.lv || 600)));
  const f = Math.max(0, s.boost - 1) / 0.52; // crecimiento total (historia + poder nuevo) en la misma escala que syrupCrewStats
  return { lv: Math.max(600, Math.min(700, P.lv || 600)), f, pow: Math.round(100 * s.boost) };
}
function crewDuelStart(id, src) {
  const M = G.map, P = G.P, D = CREW_RIVAL[id];
  if (!D || !crewHas(P, id)) return;
  if (P.dawnHelm) { toast(L2('Baja a tierra para el duelo: en cubierta no hay sitio.', 'Go ashore for the duel: there’s no room on deck.'), 'info', 4); return; }
  if (crewDuelBusy(M, P)) { toast(L2('Ahora no: termina antes la pelea o la escena que está en marcha.', 'Not now: finish the current fight or scene first.'), 'info', 4); return; }
  const st = crewDuelStats(P, id), def = BOSSES['crew_rival_' + D.k];
  def.lv = st.lv; def.hp = +(D.hp * CREW_DUEL_HP * (1 + st.f * 0.3)).toFixed(2); def.atk = +(D.atk * CREW_DUEL_ATK * (1 + st.f * 0.12)).toFixed(3); def.def = +(D.def * (1 + st.f * 0.08)).toFixed(3);
  // el que te sigue se aparta mientras dura el duelo (se devuelve aunque guardes a mitad)
  const bit = DAWN_CREW.findIndex(c => c[0] === id);
  if (bit >= 0 && P._cdAshore == null) { P._cdAshore = { v: P.dawnCrewAshore == null ? null : P.dawnCrewAshore }; P.dawnCrewAshore = dawnCrewMask(P) & ~(1 << bit); }
  let hidden = null;
  if (src && src.type === 'npc' && !src.dawnCrew && /^logue_c_/.test(src.id || '') && G.ents.includes(src)) { hidden = { id: src.id, x: src.x, y: src.y, wander: src.wander }; src.remove = true; }
  const at = freePxNear(M, P.x, P.y - 56, 3) || [P.x, P.y - 56];
  const m = spawnMob('crew_rival_' + D.k, st.lv, at[0], at[1], P.L || 0, null, true);
  if (!m) { crewDuelRestore(P); return; }
  Object.assign(m, { state: 'fight', cd: 1.4, hgt: id === SYRUP_USOPP ? 57 : 62, crewRival: id, name: D.n + ' · ' + L2('Poder ', 'Power ') + st.pow });
  CREW_DUEL = { id, m, map: M.id, owner: P, pow: st.pow, start: G.t, next: G.t + 2.2, hit: null, hidden };
  showBoss(m); sfx('boss'); banner(L2('Duelo: ', 'Duel: ') + D.n, L2('Nivel ', 'Level ') + st.lv + ' · ' + L2('Poder ', 'Power ') + st.pow);
  const say = { luffy: ['¡Shishishi! ¡No pienso perder, eh!', 'Shishishi! I’m not gonna lose, okay?'], zoro: ['Saca tu arma. No voy a contenerme.', 'Draw your weapon. I won’t hold back.'],
usopp: ['¡El gran capitán Usopp acepta tu desafío! …Más o menos.', 'The great Captain Usopp accepts your challenge! …Sort of.'],
    sanji: ['Las piernas de un cocinero son para luchar. Las manos, para cocinar.', 'A cook’s legs are for fighting. His hands are for cooking.'] }[D.k];
  if (typeof shellsRescueSpeak === 'function') shellsRescueSpeak(m, say[0], say[1]);
}
function crewDuelRestore(P) {
  if (P && P._cdAshore) { P.dawnCrewAshore = P._cdAshore.v; P._cdAshore = null; }
}
function crewDuelEnd(win) {
  const R = CREW_DUEL; if (!R) return; CREW_DUEL = null;
  const P = R.owner, m = R.m, D = CREW_RIVAL[R.id];
  if (m && !m.remove) { burst(m.x, m.y - 20, 16, { sp: 70, up: 40, life: 0.6, c: ['#ffe08a', '#ffffff'] }); m.remove = true; }
  if (G.bossBar === m) showBoss(null);
  crewDuelRestore(P);
  if (R.hidden && G.map && G.map.id === R.map) { const e = spawnNPC(R.hidden.id, R.hidden.x, R.hidden.y, R.map, { wander: R.hidden.wander, hgt: 60, face: 'down' });
    const L = G.map.logueLife; if (Array.isArray(L)) L.push(e); }
  if (win === null) return; // cancelado (cambio de mapa, te alejaste)
  P.crewDuel = P.crewDuel || {}; const rec = P.crewDuel[D.k] || (P.crewDuel[D.k] = { w: 0, l: 0, best: 0 });
  if (win) {
    rec.w++;
    let txt = D.n + L2(' se rinde. ¡Ganaste el duelo!', ' gives up. You won the duel!');
    if (R.pow > (rec.best || 0)) { const gold = Math.round(R.m.lv * 120 * (R.pow / 100)); rec.best = R.pow; P.gold = (P.gold || 0) + gold;
      txt += ' +' + fmt(gold) + ' ' + L2('oro', 'gold'); }
    toast(txt, 'quest', 6); sfx('quest');
    const say = { luffy: ['¡Qué fuerte eres! ¡Otra vez, otra vez!', 'You’re so strong! Again, again!'], zoro: ['…Bien. La próxima vez no será igual.', '…Fine. Next time won’t go the same way.'],
usopp: ['¡Me he dejado ganar! …Por supuesto.', 'I let you win! …Obviously.'],
      sanji: ['Buen combate. Te prepararé algo para recuperar fuerzas.', 'Good fight. I’ll make you something to get your strength back.'] }[D.k];
    setTimeout(() => toast(D.n + ': ' + L2(say[0], say[1]), 'info', 5), 900);
  } else {
    rec.l++;
    toast(D.n + L2(' gana el duelo. Vuelve cuando seas más fuerte.', ' wins the duel. Come back when you’re stronger.'), 'info', 6);
  }
  if (typeof markDirty === 'function') markDirty(true);
}
// nadie muere: al llegar a 0 termina el duelo (sin XP, botín ni contar como batalla)
hookBefore('killMob', m => { if (m && m.crewRival && CREW_DUEL && CREW_DUEL.m === m) { m.hp = 1; crewDuelEnd(true); return HOOK_SKIP; } });
hookBefore('playerDie', () => { const P = G.P; if (CREW_DUEL && P && CREW_DUEL.owner === P) { P.hp = Math.max(1, Math.round(P.S.maxhp * 0.25)); P.ifr = Math.max(P.ifr || 0, 1.5); crewDuelEnd(false); return HOOK_SKIP; } });
// el resto de la tripulación no ataca a su compañero
hookBefore('crewTechniqueAttack', (M, e, m) => { if (m && m.crewRival) return HOOK_SKIP; });
// al cargar: devolver al que se apartó si se guardó a mitad del duelo
hookAfter('setMap', () => { const P = G.P; if (!CREW_DUEL && P && P._cdAshore) crewDuelRestore(P); if (CREW_DUEL && G.map && G.map.id !== CREW_DUEL.map) crewDuelEnd(null); });
// técnicas del tripulante contra ti: aviso en el suelo y golpe 0,6 s después (se puede esquivar)
V33_TICKS.push(() => { try {
  const R = CREW_DUEL; if (!R) return;
  const P = G.P, M = G.map, m = R.m;
  if (P !== R.owner || !M || M.id !== R.map || !G.ents.includes(m) || m.remove || P.dawnHelm || d2(P, m) > 420 ** 2) { crewDuelEnd(null); return; }
  if (P.dead) { crewDuelEnd(false); return; }
  m.state = 'fight';
  if (R.hit && G.t >= R.hit.at) {
    const h = R.hit; R.hit = null;
    if (dist2(P.x, P.y, h.x, h.y) < h.r ** 2) hurtPlayer(m.atk * h.pow, { lv: m.lv, dawnReto: m });
    burst(h.x, h.y - 10, 12, { sp: 80, up: 20, g: 60, life: 0.35, c: [h.col, '#fff4d9'] });
  }
  if (R.hit || G.t < R.next || m.stun > 0 || m.freeze > 0) return;
  const list = CREW_TECHNIQUES[R.id] || []; if (!list.length) { R.next = G.t + 3; return; }
  const dd = Math.sqrt(d2(P, m)), ok = list.filter(s => s[2] + 20 >= dd); if (!ok.length) { R.next = G.t + 0.5; return; }
  const pick = ok[(Math.random() * ok.length) | 0], tech = list.indexOf(pick);
  const [es, en, , hits, power, cd, mode] = pick, col = CREW_TECH_COLORS[mode] || '#ffe08a';
  const x = P.x, y = P.y, r = mode === 'sweep' || mode === 'powder' ? 46 : 34;
  // misma animación de ataque que en las peleas de la historia: fotogramas de ataque del atlas y, de lado, la pose
  // de la técnica (CREW_SIDE_POSES); el rival se queda quieto mientras la hace (gancho de updateBoss más abajo)
  const dur = hits > 3 ? 0.83 : 0.64;
  m.dir = dirFromVec(x - m.x, y - m.y); setAnim(m, 'atk', true); m.actionUntil = G.t + dur; m.actionLength = dur;
  m.crewPose = { index: tech, start: G.t, end: G.t + dur }; floatText(m.x, m.y - 72, L2(es, en), col, true);
  addFx({ type: 'ring', x, y, r, dur: 0.6, col });
  for (let j = 0; j < Math.min(4, hits); j++) { const delay = 0.3 + j * 0.3 / hits;
    addFx({ type: 'crewTechnique', x: m.x, y: m.y - 13, endX: x, endY: y - 12, angle: Math.atan2(y - m.y, x - m.x), mode, col, delay, j, tech, hits, dur: delay + 0.25 }); }
  R.hit = { at: G.t + 0.6, x, y, r, col, pow: 0.6 + power * 0.25 };
  R.next = G.t + Math.max(2.6, cd * 0.9) + Math.random();
} catch (e) { if (typeof errOnce === 'function') errOnce('crewDuel', e); } });

// mientras hace una técnica se queda quieto y avanza sus fotogramas de ataque (como baratiePose en la historia)
hookBefore('updateBoss', m => { if (m && m.crewRival && m.actionUntil > G.t) { baratiePose(m); return HOOK_SKIP; } });
// de lado, la pose de la técnica (la misma imagen que dibuja 6zzzzx1 para el NPC; allí se busca por e.id y el rival es un mob)
hookAround('drawEnt', (next, e, cx, cy) => {
  const pose = e && e.crewRival && e.crewPose, img = pose && typeof CREW_SIDE_POSES !== 'undefined' && CREW_SIDE_POSES[e.crewRival];
  if (!pose || !img || !img.naturalWidth || e.anim !== 'atk' || G.t < pose.start + 0.16 || G.t > pose.end - 0.12 || (e.dir !== 'left' && e.dir !== 'right')) return next(e, cx, cy);
  const w = 120, h = 80; ctx.save(); ctx.translate(Math.round(e.x - cx), Math.round(e.y - cy - (e.z || 0))); if (e.dir === 'left') ctx.scale(-1, 1);
  ctx.drawImage(img, pose.index * 240, 0, 240, 160, -w / 2, -h + 2, w, h); ctx.restore();
});

// ---------- opción al hablarles ----------
function crewIdOf(npc) {
  if (!npc) return null;
  if (CREW_RIVAL[npc.id]) return npc.id;
  const lc = typeof LOGUE_CREW !== 'undefined' && LOGUE_CREW.find(c => c[0] === npc.id);
  return lc ? lc[1] : null;
}
function crewPowerSheet() {
  const P = G.P, I = crewPowerInfo(P);
  const rows = DAWN_CREW.filter(([id]) => CREW_RIVAL[id] && crewHas(P, id)).map(([id, n]) => {
    const rec = (P.crewDuel || {})[CREW_RIVAL[id].k];
    return [n + ' · ' + L2('Poder ', 'Power ') + crewPowerNum(P, id) + (rec ? ' · ' + rec.w + '-' + rec.l : ''), () => { closeModal(); crewDuelStart(id, null); }];
  });
  const arcs = I.arcs.map(a => (a.runs ? '✅ ' : '⬜ ') + a.n).join(' · ');
  xMsg(L2('Poder de la tripulación', 'Crew power'),
    L2('Sube la primera vez que vencéis a cada jefe de la historia y la primera vez que completáis cada arco (repetirlo no suma): más vida, defensa y daño en sus técnicas. ',
      'It rises the first time you beat each story boss and the first time you complete each arc (replays don’t count): more HP, defense and technique damage. ') +
    L2('Batallas: ', 'Battles: ') + I.battles + ' · ' + L2('Arcos: ', 'Arcs: ') + I.done + '/' + CREW_POW_ARCS.length + ' · ' + L2('Extra: +', 'Bonus: +') + Math.round(I.bonus * 100) + ' %<br>' + arcs + '<br>' + L2('Toca a un tripulante para desafiarlo.', 'Tap a crew member to challenge them.'),
    rows);
}
DLG_HOOKS.push((npc, opts) => { try {
  const P = G.P, id = crewIdOf(npc); if (!id || !P || !crewHas(P, id) || !G.map || G.map.id !== 'dawn') return;
  const D = CREW_RIVAL[id], pow = crewPowerNum(P, id);
  opts.push({ label: L2('Desafiar a ', 'Challenge ') + D.n + ' · ' + L2('Poder ', 'Power ') + pow, icon: ['atk'], fn: () => { closeDialog(); crewDuelStart(id, npc); } });
  opts.push({ label: L2('Poder de la tripulación', 'Crew power'), icon: ['book'], fn: () => { closeDialog(); crewPowerSheet(); } });
} catch (e) { } });

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.push(['crew_poder', L2('Poder de la tripulación y duelos', 'Crew power and duels'), () => [
  L2('La tripulación (Luffy, Zoro, Nami, Usopp y Sanji) se hace más fuerte la primera vez que vencéis a cada jefe de la historia del Mar de Dawn y la primera vez que completáis cada arco. Repetir un arco no la sube.', 'The crew (Luffy, Zoro, Nami, Usopp and Sanji) gets stronger the first time you beat each Dawn Sea story boss and the first time you complete each arc. Replaying an arc does not raise it.'),
  L2('Cada arco completado da +15 % y cada jefe vencido +2 % (los 6 arcos y los 18 jefes: +126 %): más vida, defensa y daño en sus técnicas.', 'Each completed arc gives +15 % and each boss beaten +2 % (all 6 arcs and 18 bosses: +126 %): more HP, defense and technique damage.'),
  L2('Habla con Luffy, Zoro, Usopp o Sanji en tierra y elige «Desafiar» para un duelo con su poder actual (Nami no pelea). Nadie muere; si ganas con un poder nuevo te llevas oro.', 'Talk to Luffy, Zoro, Usopp or Sanji ashore and choose “Challenge” for a duel at their current power (Nami doesn’t fight). Nobody dies; beating a new power level earns gold.')
]]);
