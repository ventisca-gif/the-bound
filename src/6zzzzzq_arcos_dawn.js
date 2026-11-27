// 6.28 · Arcos nuevos del Mar de Dawn (ideas 9-13 que aprobó Sergio). Crossover aparte de la historia principal
// (docs/LORE.md): no toca CRON ni ERAS. Todo se juega en el mapa (sin ventanas salvo cinemáticas).
//  9) Alvida, revancha (muelle de Loguetown, tras vencerla en su galeón): ahora tiene la fruta Sube Sube. Cada pocos
//     segundos se vuelve resbaladiza y los golpes le resbalan; después de embestir se marea y recibe más daño.
// 10) Nezumi (Islas Conomi, tras Arlong): vuelve con sus marines al huerto de Nojiko. Nami le da su merecido.
// 11) Johnny y Yosaku: encargos de cazarrecompensas (3 al día): un pirata buscado aparece en una isla; la flecha
//     te lleva. Se reparten el premio contigo.
// 12) La Montaña del Revés y Laboon (tras el arco de Loguetown, al noreste del mar): cinemática de la subida, Laboon
//     embiste el Merry (cálmalo a cañonazos) y la promesa de Luffy. Premio: Log Pose. El Grand Line aún no está
//     pintado: la Ventisca lo pintará más adelante.
// 13) La Isla del Barco de Guerra (tras Conomi, navegando): la balsa de Apis huye de la Marina; escóltala hundiendo 3
//     barcos y aparece el dragón milenario.
SAVEKEYS.push('arcAlvida', 'arcNezumi', 'jyJob', 'jyDay', 'jyDone', 'rmDone', 'wiDone', 'wiTry');
const ARC = { foes: [], raft: null, wi: null, rm: null, nextWi: 0 };
const arcBk = id => crewBkSafe(id);

// ---------- objetos ----------
it('acc_sube', { n: L2('Espejo Sube Sube', 'Slip-Slip Mirror'), t: 'acc', slot: 'neck', lv: 615, price: 90000, icon: ['amulet', 6], rar: 5, atk: 1400, def: 950, hpB: 6000, crit: 10,
  d: L2('El espejo de mano de Alvida. Dicen que lo que se refleja en él resbala.', 'Alvida’s hand mirror. They say whatever it reflects slips away.') });
it('rm_logpose', { n: 'Log Pose', t: 'quest', stack: false, price: 0, icon: ['gem', '#8ad0ff'], rar: 5,
  d: L2('Regalo de Crocus en el Cabo Gemelo. En el Grand Line las brújulas no sirven: el Log Pose apunta de isla en isla. La Ventisca todavía no ha pintado el Grand Line.', 'Crocus’s gift at Twin Cape. In the Grand Line compasses don’t work: the Log Pose points from island to island. The Ventisca hasn’t painted the Grand Line yet.') });
it('wi_escama', { n: L2('Escama del dragón milenario', 'Thousand-year dragon scale'), t: 'mat', stack: true, price: 60000, icon: ['gem', '#6ad08a'], rar: 5,
  d: L2('Se le cayó al dragón milenario al despedirse de Apis. Brilla como el mar al amanecer.', 'The thousand-year dragon shed it when saying goodbye to Apis. It shines like the sea at dawn.') });

// ---------- 9) Alvida, revancha ----------
BOSSES.alvida_sube = { n: L2('Alvida (Sube Sube)', 'Alvida (Slip-Slip)'), lv: 618, hp: 74, atk: 4.4, def: 3.9, spd: 96, r: 34, where: 'Loguetown', art: ['logue_actor', 'alvida'], moves: ['charge', 'slam'], drops: [] };
if (typeof DAWN_RETO === 'object') DAWN_RETO.alvida_sube = 1.9;
DLG_HOOKS.push((npc, opts) => {
  if (!npc || npc.id !== 'logue_alvida' || !G.map || !G.map.logue) return; const P = G.P;
  if (!arcBk('dawn_alvida')) return;
  if (ARC.alvida) return;
  opts.unshift({ label: (P.arcAlvida ? '🔁 ' : '⚔ ') + L2('Revancha: Alvida con la fruta Sube Sube', 'Rematch: Alvida with the Slip-Slip Fruit') + ' · ' + L2('Nv. ', 'Lv. ') + 618, icon: ['talk'], fn: () => {
    closeDialog(); if (P.lv < 610) { toast(L2('Necesitas nivel 610.', 'You need level 610.'), 'info'); return; }
    const at = freePxNear(G.map, P.x, P.y - 50, 4) || [P.x, P.y - 50], m = spawnMob('alvida_sube', 618, at[0], at[1], 0, null, true);
    if (!m) return; Object.assign(m, { state: 'fight', cd: 1.2, hgt: 66, slick: G.t + 4, slickOn: false, dizzy: 0 }); ARC.alvida = m; showBoss(m); sfx('boss');
    shellsRescueSpeak(m, '¿Quién es la más hermosa de todos los mares? ¡Ahora mi piel resbala hasta los golpes!', 'Who is the most beautiful in all the seas? Now even punches slide off my skin!');
    banner(L2('Alvida · fruta Sube Sube', 'Alvida · Slip-Slip Fruit'), L2('Cuando brilla, los golpes resbalan: espera a que se maree tras embestir.', 'When she shines, hits slide off: wait until she gets dizzy after charging.')); } });
});
hookAround('hitMob', (next, m, base, src) => {
  if (!m || m !== ARC.alvida || m.dying) return next(m, base, src);
  if (m.dizzy > G.t) return next(m, base * 1.5, src);
  if (m.slickOn && Math.random() < 0.7) { floatText(m.x, m.y - (m.hgt || 40), L2('¡Resbala!', 'Slips!'), '#ffb0e0'); burst(m.x, m.y - 20, 6, { sp: 70, up: 30, life: 0.3, c: ['#ffd0f0', '#ffffff'] }); return 0; }
  return next(m, base, src);
});
hookAfter('bossMove', (_r, m, mv) => { if (m && m === ARC.alvida && mv === 'charge') { m.dizzy = G.t + 1.6 + 2.5; setTimeout(() => { if (ARC.alvida === m && !m.dying) floatText(m.x, m.y - 70, L2('¡Mareada!', 'Dizzy!'), '#ffe08a', true); }, 1600); } });
hookBefore('killMob', m => { if (!m || m !== ARC.alvida) return; const P = G.P, first = !P.arcAlvida; ARC.alvida = null; P.arcAlvida = (P.arcAlvida || 0) + 1;
  const gold = first ? 150000 : 40000; P.gold += gold; if (first) giveItem('acc_sube', 1);
  setTimeout(() => banner('🪞 ' + L2('¡Alvida vencida otra vez!', 'Alvida defeated again!'), '+' + fmt(gold) + ' ' + L2('oro', 'gold') + (first ? ' · ' + L2('Espejo Sube Sube', 'Slip-Slip Mirror') : '')), 600); markDirty(true); });
V33_TICKS.push(() => { const m = ARC.alvida; if (!m) return; if (m.remove || !G.ents.includes(m) || G.P.dead || !G.map || !G.map.logue) { if (!m.dying) m.remove = true; ARC.alvida = null; return; }
  if (G.t > m.slick) { m.slickOn = !m.slickOn; m.slick = G.t + (m.slickOn ? 3.2 : 4.5); if (m.slickOn) floatText(m.x, m.y - 72, '✨ ' + L2('Sube Sube', 'Slip-Slip'), '#ffb0e0'); }
  if (m.slickOn && Math.random() < 0.3) part(m.x + (Math.random() - 0.5) * 24, m.y - 10 - Math.random() * 40, { vz: 10, vx: 0, g: -10, life: 0.4, c: '#ffe0f4', s: 2 }); });

// ---------- 10) Nezumi ----------
BOSSES.nezumi_boss = { n: L2('Capitán Nezumi', 'Captain Nezumi'), lv: 606, hp: 58, atk: 4.1, def: 3.7, spd: 70, r: 30, where: L2('Islas Conomi', 'Conomi Islands'), art: ['crew_rival', 'con_nazumi'], moves: ['volley'], drops: [] };
if (typeof DAWN_RETO === 'object') DAWN_RETO.nezumi_boss = 1.7;
DLG_HOOKS.push((npc, opts) => {
  if (!npc || npc.id !== 'con_nojiko' || !G.map || !G.map.dawn || G.P.dawnHelm) return; const P = G.P;
  if (!arcBk('con_arlong') || ARC.nez) return;
  if (P.arcNezumi) { opts.push({ label: L2('Hablar de Nezumi', 'Talk about Nezumi'), icon: ['talk'], fn: () => typeText(L2('Desde que Nami le dio con el bastón, Nezumi no ha vuelto a pisar el huerto.', 'Since Nami hit him with her staff, Nezumi hasn’t set foot in the grove again.')) }); return; }
  opts.unshift({ label: '⚓ ' + L2('Nezumi ha vuelto al huerto', 'Nezumi is back at the grove') + ' · ' + L2('Nv. ', 'Lv. ') + 606, icon: ['talk'], fn: () => {
    closeDialog(); const M = G.map, mobs = [];
    for (let k = 0; k < 5; k++) { const at = freePxNear(M, P.x, P.y - 40, 5); if (at) { const m = spawnMob('dawn_marine', 600, at[0], at[1], 0, null, false); if (m) { m.aggroT = 99; m.target = P; m.state = 'chase'; mobs.push(m); } } }
    const at = freePxNear(M, P.x, P.y - 70, 3) || [P.x, P.y - 70], b = spawnMob('nezumi_boss', 606, at[0], at[1], 0, null, true); if (b) { b.state = 'fight'; b.hgt = 60; mobs.push(b); showBoss(b); }
    ARC.nez = { mobs, boss: b }; sfx('boss');
    if (b) shellsRescueSpeak(b, '¡Chu chu chu! Ese dinero de Arlong es propiedad de la Marina. ¡Confiscado!', 'Chu chu chu! Arlong’s money belongs to the Navy. Confiscated!');
    banner(L2('Nezumi vuelve a Cocoyashi', 'Nezumi returns to Cocoyasi'), L2('Vence a sus marines y a Nezumi.', 'Defeat his marines and Nezumi.')); } });
});
V33_TICKS.push(() => { const R = ARC.nez; if (!R) return; const P = G.P; if (P.dead || !G.map || !G.map.dawn) { for (const m of R.mobs) if (!m.dying) m.remove = true; ARC.nez = null; if (G.bossBar && R.mobs.includes(G.bossBar)) showBoss(null); return; }
  if (R.mobs.every(m => m.dying || m.remove)) { ARC.nez = null; P.arcNezumi = 1; const g = 120000; P.gold += g; try { crewBtyGain('nami', 606 * 6000); } catch (e) { }
    banner('🍊 ' + L2('Nezumi huye con un chichón', 'Nezumi flees with a bump'), '+' + fmt(g) + ' ' + L2('oro · la recompensa de Nami sube', 'gold · Nami’s bounty rises'));
    toast(L2('Nami: «¡Y que no se te ocurra volver a tocar los mandarinos de Bell-mère!»', 'Nami: “And don’t you dare touch Bell-mère’s tangerine trees again!”'), 'quest', 6); markDirty(true); } });

// ---------- 11) Johnny y Yosaku: encargos de cazarrecompensas ----------
const JY_ISLES = [['shells', 'Shells Town', SHELL_PIER], ['orange', 'Orange Town', ORANGE_QUAY], ['syrup', L2('Villa Syrup', 'Syrup Village'), SYRUP_PIER], ['conomi', L2('Islas Conomi', 'Conomi Islands'), CON_MOOR], ['logue', 'Loguetown', LOGUE_PIER]];
const JY_NAMES = ['«Diente de Sierra» Bako', '«Ojo de Pez» Morio', '«Barba Roja» Tanta', '«Doble Hacha» Grum', '«La Sombra» Kirra', '«Cuchilla» Benz'];
BOSSES.jy_buscado = { n: L2('Pirata buscado', 'Wanted pirate'), lv: 600, hp: 30, atk: 3.6, def: 3.4, spd: 80, r: 28, where: L2('Mar de Dawn', 'Dawn Sea'), art: ['hum', 'dawn_boarder'], moves: ['charge'], drops: [] };
function jyDay() { return typeof calDay === 'function' ? calDay() : Math.floor(Date.now() / 864e5); }
function jyLeft(P) { if (P.jyDay !== jyDay()) { P.jyDay = jyDay(); P.jyDone = 0; } return 3 - (P.jyDone || 0); }
function jyOffer() {
  const P = G.P; if (P.jyJob) { toast(L2('Ya tienes un encargo: ', 'You already have a job: ') + P.jyJob.n + ' · ' + P.jyJob.isleN, 'info', 5); jyMark(); return; }
  if (jyLeft(P) <= 0) { typeText(L2('Johnny: ¡Por hoy ya está, aniki! Mañana tendremos más carteles.', 'Johnny: That’s it for today, boss! We’ll have more posters tomorrow.')); return; }
  const isle = JY_ISLES[(Math.random() * JY_ISLES.length) | 0], n = JY_NAMES[(Math.random() * JY_NAMES.length) | 0], lv = clamp(P.lv, 600, 700);
  P.jyJob = { isle: isle[0], isleN: isle[1], at: isle[2].slice(), n, lv, prize: 60000 + (lv - 600) * 800 }; jyMark(); markDirty(true);
  closeDialog(); banner('📜 ' + L2('Se busca: ', 'Wanted: ') + n, L2('Visto cerca de ', 'Seen near ') + isle[1] + ' · ' + fmt(P.jyJob.prize) + ' ' + L2('oro', 'gold'));
}
function jyMark() { const J = G.P.jyJob; if (J && typeof setWp === 'function') setWp({ loc: J.at.slice(), m: 'dawn', t: J.isleN + ' · ' + J.n }); }
DLG_HOOKS.push((npc, opts) => { if (!npc || !/^(baratie|con)_(johnny|yosaku)$/.test(npc.id)) return; const P = G.P;
  opts.unshift({ label: '📜 ' + L2('Encargo de cazarrecompensas', 'Bounty hunting job') + ' · ' + Math.max(0, jyLeft(P)) + '/3 ' + L2('hoy', 'today'), icon: ['talk'], fn: jyOffer }); });
V33_TICKS.push(() => { const P = G.P, J = P && P.jyJob, M = G.map; if (!J || !M || !M.dawn || P.dawnHelm || P.dead) return;
  const [tx, ty] = dawnPx(J.at);
  if (!ARC.jy && Math.hypot(P.x - tx, P.y - ty) < 420) { const at = freePxNear(M, P.x, P.y - 60, 5) || [P.x, P.y - 60]; const m = spawnMob('jy_buscado', J.lv, at[0], at[1], 0, null, true);
    if (m) { m.state = 'fight'; m.name = J.n; m.jy = 1; ARC.jy = m; showBoss(m); shellsRescueSpeak(m, '¿Cazarrecompensas? ¡Ja! Mi cabeza vale más de lo que crees.', 'Bounty hunters? Ha! My head is worth more than you think.'); } }
  const m = ARC.jy; if (m && (m.remove || !G.ents.includes(m))) ARC.jy = null; });
hookBefore('killMob', m => { if (!m || m !== ARC.jy) return; const P = G.P, J = P.jyJob; ARC.jy = null; if (!J) return; P.jyJob = null; P.jyDone = (P.jyDone || 0) + 1; P.gold += J.prize; P.wp = null;
  setTimeout(() => banner('📜 ' + J.n + ' ' + L2('capturado', 'captured'), '+' + fmt(J.prize) + ' ' + L2('oro · Johnny y Yosaku se quedan su parte', 'gold · Johnny and Yosaku keep their share')), 500); markDirty(true); });

// ---------- 12) La Montaña del Revés y Laboon ----------
const RM_AT = [1532, 1290];   // bahía de Cabos Gemelos (noreste); conserva rmDone de partidas anteriores
XSPR.rm_montana = () => { const p = new Pix(160, 120);
  p.poly([[0, 118], [56, 10], [80, 2], [104, 10], [160, 118]], C('#8a2a1a')); p.poly([[20, 118], [62, 26], [80, 18], [98, 26], [140, 118]], C('#b83a22'));
  p.poly([[70, 118], [76, 20], [84, 20], [90, 118]], C('#4a9ae0')); for (let y = 24; y < 118; y += 6) p.hl(76 + ((y / 6) % 2), y, 8, C('#bfe6ff'));
  p.poly([[60, 4], [80, 0], [100, 4], [92, 14], [68, 14]], C('#f4f2ea')); p.outline(OUTL); return { c: p.canvas(), ax: 80, ay: 116 }; };
const rmLaboonSpr = mark => () => { const p = new Pix(160, 76), B = pal(['#1e3460', '#2e4a80', '#3e62a0', '#5a84c0']), W = pal(['#8aa0bc', '#b0c4d8', '#d4e2ee', '#f2f6fa']);
  p.poly([[132, 34], [158, 18], [152, 38], [158, 58], [132, 44]], B[1]);                         // aletas de la cola
  p.ell(78, 40, 62, 26, B[2]); p.ell(46, 38, 40, 30, B[2]); p.ell(46, 30, 34, 20, B[3]);          // cuerpo y cabezota
  p.ell(70, 56, 52, 10, W[2]); for (let x = 30; x < 120; x += 6) p.vl(x, 50, 12, W[1]);          // vientre con rayas
  p.line(12, 46, 52, 50, B[0]); p.line(12, 47, 52, 51, B[0]);                                   // boca
  p.rect(22, 38, 3, 3, C('#0e0e14')); p.set(22, 38, C('#ffffff'));                               // ojo
  if (mark) { p.ell(54, 20, 13, 9, C('#f2f2ec')); p.rect(49, 18, 3, 3, C('#0e0e14')); p.rect(57, 18, 3, 3, C('#0e0e14'));   // la promesa pintada en la frente
    p.line(42, 27, 66, 31, C('#f2f2ec')); p.line(42, 31, 66, 27, C('#f2f2ec')); p.ell(54, 13, 10, 3, C('#e8c040')); }
  else for (let k = 0; k < 6; k++) p.set(44 + k * 3, 14 + (k % 2) * 3, B[0]);   // cicatrices de golpear la montaña
  p.poly([[60, 52], [76, 66], [80, 54]], B[1]); p.outline(OUTL); return { c: p.canvas(), ax: 80, ay: 70 }; };
XSPR.rm_laboon = rmLaboonSpr(false); XSPR.rm_laboonp = rmLaboonSpr(true);
DL_HOOKS.push(list => { const M = G.map; if (!M || !M.dawn || M.rmCape) return; const [x, y] = dawnPx([1600, 110]);
  list.push({ type: 'xdraw', x, y, draw: (e, cx, cy) => { const s = spr('rm:montana', XSPR.rm_montana); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(x - cx), Math.round(y - cy)); ctx.scale(3, 3); ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore(); } }); });
const cnSpr = (x, k, X, Y, W, H) => { const d = spr('cn:' + k, XSPR[k]); x.imageSmoothingEnabled = false; x.drawImage(d.c, Math.round(X), Math.round(Y), Math.round(W), Math.round(H)); };
Object.assign(CN_SC, {
  rm_subida: (x, t, k) => { cnSky(x, '#2a3a6a', '#e88a5a'); cnSpr(x, 'rm_montana', 28, 4, 200, 150);
    for (let i = 0; i < 10; i++) cnR(x, '#e8f6ff', 122 + (i % 2) * 6, ((i * 19 - t * 140) % 150 + 150) % 150, 3, 7);   // la corriente que sube
    const sy = 128 - k * 104; cnR(x, '#7a502c', 116, sy, 24, 7); cnR(x, '#f4f2ea', 124, sy - 16, 9, 16); cnR(x, '#1a1a1e', 127, sy - 12, 3, 3); },
  rm_laboon: (x, t) => { cnSky(x, '#5a8ac0', '#bfe6ff'); cnR(x, '#2a6ab0', 0, 92, CN_W, 52); for (let i = 0; i < 12; i++) cnR(x, '#7ab0e0', (i * 37 + t * 14) % 270 - 10, 100 + (i % 4) * 10, 14, 1);
    cnSpr(x, 'rm_laboon', 30, 38 + Math.sin(t * 1.5) * 2, 200, 95); cnR(x, '#ffffff', 196 + Math.sin(t * 3) * 3, 24, 3, 18); },
  rm_promesa: (x, t) => { cnSky(x, '#5a8ac0', '#ffd8a0'); cnR(x, '#2a6ab0', 0, 92, CN_W, 52); cnSpr(x, 'rm_laboonp', 20, 34, 220, 104);
    cnR(x, '#e8c040', 60, 20 + Math.sin(t * 4) * 2, 18, 5); cnR(x, '#c84a2a', 60, 24 + Math.sin(t * 4) * 2, 18, 2); cnR(x, '#f0c8a0', 64, 26 + Math.sin(t * 4) * 2, 10, 8); }   // Luffy sobre la cabeza
});
function rmCanStart(P) { return !!(P && !P.rmDone && P.dawnCrewJoined && (P.logueArcN || 0) >= 1 && P.dawnHelm && P.dawnHelm.kind === 'skiff' && !ARC.rm && !nvCalm()); }
V33_TICKS.push(() => { const P = G.P, M = G.map; if (!P || !M || !M.dawn) return; const [x, y] = dawnPx(M.rmCape ? RM_AT : [1600, 110]);
  if (rmCanStart(P) && Math.hypot(P.x - x, P.y - y) < 520) {
    ARC.rm = { ph: 'cine' };
    cinePlay([
      { s: 'rm_subida', title: L2('La Montaña del Revés', 'Reverse Mountain'), txt: L2('Las corrientes de los cuatro mares suben por la montaña y se juntan en la cima. El Going Merry sube con ellas, río arriba, hasta el cielo… y cae al otro lado: el Grand Line.', 'The currents of the four seas run up the mountain and meet at the top. The Going Merry climbs with them, upstream, into the sky… and falls down the other side: the Grand Line.') },
      { s: 'rm_laboon', title: L2('El Cabo Gemelo', 'Twin Cape'), txt: L2('Al pie de la montaña, una ballena enorme golpea su cabeza contra la roca. Crocus, el farero, cuenta que lleva cincuenta años esperando a unos piratas que prometieron volver.', 'At the foot of the mountain, an enormous whale slams its head against the rock. Crocus, the lighthouse keeper, says it has been waiting fifty years for some pirates who promised to come back.') }
    ], () => { const at = nvFreeSpot(M, G.P, 260, 320) || [G.P.x + 260, G.P.y];
      ARC.rm = { ph: 'fight' }; ARC.foes.push({ k: 'laboon', x: at[0], y: at[1], hp: 20, maxhp: 20, cd: 2.5, n: 'Laboon', vx: 0, vy: 0, onKill: rmCalm });
      banner('🐋 Laboon', L2('Laboon embiste el Merry: dispárale con el botón de la espada para calmarlo y aparta el barco de sus golpes.', 'Laboon rams the Merry: fire with the sword button to calm it and move the ship away from its blows.')); });
  } });
function rmCalm(f) {
  const P = G.P; if (!P || P.rmDone || !f || f.k !== 'laboon' || !ARC.foes.includes(f)) return;
  ARC.foes = ARC.foes.filter(x => x !== f); ARC.rm = null;
  // Commit reward and completion together before a skippable/interrupted scene.
  giveItem('rm_logpose', 1); P.gold += 250000; P.rmDone = 1; markDirty(true);
  cinePlay([{ s: 'rm_promesa', title: L2('Una promesa', 'A promise'), txt: L2('Luffy le pinta en la cabeza la bandera de su tripulación: «Cuando demos la vuelta al Grand Line, volveremos a pelear. Así que deja de golpear la montaña». Laboon llora… y espera.', 'Luffy paints his crew’s flag on its head: “When we sail around the Grand Line, we’ll come back to fight again. So stop hitting the mountain.” Laboon cries… and waits.') },
    { s: 'rm_promesa', title: 'Log Pose', txt: L2('Crocus os da un Log Pose: en el Grand Line la brújula no sirve. Ese mar ya se puede navegar y tiene una ruta de regreso, aunque sus primeras islas todavía están por llegar.', 'Crocus gives you a Log Pose: in the Grand Line the compass is useless. You can now sail that sea and return, although its first islands are still to come.') }],
    () => { const g = 250000; banner('🐋 ' + L2('Laboon espera vuestra vuelta', 'Laboon awaits your return'), '+' + fmt(g) + ' ' + L2('oro · Log Pose', 'gold · Log Pose')); markDirty(true); });
}

// ---------- 13) La Isla del Barco de Guerra: escolta a Apis ----------
NPCS.wi_apis = { n: 'Apis', title: L2('Niña de la Isla del Barco de Guerra', 'Girl from Warship Island'), look: LK({ g: 'f', hair: HAIRS.castano || HAIRS.negro, hairStyle: 'short', eyes: 'marron', skin: SKINS[1], outfit: 'tunic', main: pal(['#6a2a1a', '#a04a2a', '#d07a4a', '#f0a87a']) }), lines: [L2('¡Gracias por ayudarme!', 'Thank you for helping me!')] };
XSPR.wi_balsa = () => { const p = new Pix(40, 22), W = TGP.madera; for (let k = 0; k < 6; k++) p.rect(2 + k * 6, 8, 5, 12, W[k % 2 ? 2 : 3]); p.hl(2, 12, 36, W[1]); p.vl(20, 0, 10, W[1]); p.poly([[21, 0], [32, 4], [21, 8]], C('#f4f2ea')); p.outline(OUTL); return { c: p.canvas(), ax: 20, ay: 18 }; };
XSPR.wi_dragon = () => { const p = new Pix(150, 70), G_ = pal(['#145a34', '#227a4a', '#3aa066', '#7ad09a']);
  for (let k = 0; k <= 28; k++) { const x = 6 + k * 4.4, y = 40 + Math.sin(k * 0.42) * 14, r = 4 + Math.sin(k / 28 * Math.PI) * 5; p.ball(x, y, r, r, G_.slice(0)); if (k % 3 === 0) p.set(Math.round(x), Math.round(y - r - 1), C('#ffd040')); }   // cuerpo ondulado y crin
  for (const [x, y] of [[40, 50], [86, 46]]) { p.line(x, y, x - 4, y + 10, G_[0]); p.line(x - 4, y + 10, x - 8, y + 11, G_[0]); }   // patas
  p.ball(136, 30, 10, 8, G_.slice(0)); p.rect(140, 30, 9, 5, G_[2]); p.set(134, 27, C('#ff4a2a')); p.set(135, 27, C('#ffffff'));   // cabeza y ojo
  p.line(132, 22, 124, 8, C('#e8dcb8')); p.line(138, 22, 136, 6, C('#e8dcb8'));                  // cuernos
  p.line(146, 34, 150, 46, C('#f4e8c0')); p.line(144, 35, 140, 50, C('#f4e8c0'));                  // bigotes
  p.outline(OUTL); return { c: p.canvas(), ax: 75, ay: 58 }; };
Object.assign(CN_SC, {
  wi_isla: (x, t) => { cnSky(x, '#3a6aa0', '#ffc890'); cnR(x, '#2a6ab0', 0, 92, CN_W, 52); cnR(x, '#6a8a3a', 40, 70, 176, 26); cnR(x, '#8aaa4a', 60, 62, 136, 12);
    cnR(x, '#7a7a80', 150, 40, 40, 32); cnR(x, '#5a5a60', 150, 40, 40, 4); cnR(x, '#9a9aa0', 156, 30, 8, 12);   // el viejo barco de guerra encallado
    const d = spr('wi:dragon', XSPR.wi_dragon); x.imageSmoothingEnabled = false; x.drawImage(d.c, 30, 60 + Math.sin(t * 2) * 2, 110, 52); },
  wi_vuelo: (x, t, k) => { cnSky(x, '#ffb070', '#ffe8c0'); cnR(x, '#2a6ab0', 0, 104, CN_W, 40); for (let i = 0; i < 9; i++) cnR(x, '#ffffff', (i * 41 + t * 20) % 270 - 10, 30 + (i % 3) * 14, 18, 3);
    const d = spr('wi:dragon', XSPR.wi_dragon); x.imageSmoothingEnabled = false; x.drawImage(d.c, 20 + k * 160, 70 - k * 50 + Math.sin(t * 3) * 3, 150 - k * 60, 70 - k * 28); }
});
function wiCanStart(P) { return !!(P && !P.wiDone && arcBk('con_arlong') && P.dawnCrewJoined && P.dawnHelm && P.dawnHelm.kind === 'skiff' && !ARC.wi && !ARC.rm && !nvCalm() && !NV.foes.some(f => !f.dead)); }
V33_TICKS.push(dt => { const P = G.P, M = G.map; if (!P || !M || !M.dawn) return; dt = Math.min(0.05, dt || 0.016);
  if (!ARC.nextWi) ARC.nextWi = G.t + 150;
  if (wiCanStart(P) && G.t > ARC.nextWi) { ARC.nextWi = G.t + 240; const at = nvFreeSpot(M, P, 200, 260); if (at) {
    ARC.wi = { raft: { x: at[0], y: at[1], hp: 60 }, wave: 0, sunk: 0, next: G.t + 3 };
    toast('🛶 ' + L2('¡Una niña en una balsa pide ayuda! La persigue la Marina. Escóltala hundiendo a sus barcos.', 'A girl on a raft is calling for help! The Navy is chasing her. Escort her by sinking their ships.'), 'warn', 7); } }
  const W = ARC.wi; if (!W) return; const R = W.raft;
  if (!P.dawnHelm || P.dead) { ARC.wi = null; ARC.foes = ARC.foes.filter(f => f.k !== 'wimarina'); return; }
  // la balsa sigue al Merry
  const gx = P.x - 140, gy = P.y + 70, d = Math.hypot(gx - R.x, gy - R.y); if (d > 4) { const st = Math.min(d, 220 * dt); const nx = R.x + (gx - R.x) / d * st, ny = R.y + (gy - R.y) / d * st; if (dawnSurface(M, nx, ny, 10)) { R.x = nx; R.y = ny; } else { R.x = gx; R.y = gy; } }
  if (W.sunk + ARC.foes.filter(f => f.k === 'wimarina').length < 3 && G.t > W.next) { W.next = G.t + 6; const at = nvFreeSpot(M, P, 420, 520); if (at) ARC.foes.push({ k: 'wimarina', x: at[0], y: at[1], hp: 7, maxhp: 7, cd: 2.5, n: L2('Barco de la Marina', 'Navy ship'), vx: 0, vy: 0, onKill: f => { ARC.foes = ARC.foes.filter(x => x !== f); W.sunk++; floatText(f.x, f.y - 40, W.sunk + '/3', '#ffd040', true); } }); }
  for (const f of ARC.foes) { if (f.k !== 'wimarina') continue; const dx = R.x - f.x, dy = R.y - f.y, dd = Math.hypot(dx, dy) || 1, ox = f.x, oy = f.y;
    if (dd > 230) { const nx = f.x + dx / dd * 140 * dt, ny = f.y + dy / dd * 140 * dt; if (dawnSurface(M, nx, ny, 14)) { f.x = nx; f.y = ny; } } f.vx = (f.x - ox) / dt; f.vy = (f.y - oy) / dt; f.dir = dx < 0 ? -1 : 1;
    f.cd -= dt; if (f.cd <= 0 && dd < 420) { f.cd = 2.6; ARC.marks = ARC.marks || []; ARC.marks.push({ x: R.x, y: R.y, t: 1.1, t0: 1.1 }); } }
  ARC.marks = (ARC.marks || []).filter(m => { m.t -= dt; if (m.t > 0) return true; if (Math.hypot(R.x - m.x, R.y - m.y) < 30) { R.hp -= 12; floatText(R.x, R.y - 30, '-12 🛶', '#ff8a6a'); } else floatText(R.x, R.y - 30, L2('¡Fallan!', 'Missed!'), '#8aff8a'); burst(m.x, m.y, 10, { sp: 60, up: 50, life: 0.4, c: ['#a8d8ff', '#ffffff'] }); return false; });
  if (!ACT.k) mgHud('🛶 Apis ' + Math.max(0, R.hp) + '/60 · ⚓ ' + W.sunk + '/3');
  if (R.hp <= 0) { ARC.wi = null; ARC.foes = ARC.foes.filter(f => f.k !== 'wimarina'); ARC.marks = []; P.wiTry = (P.wiTry || 0) + 1; mgHud(null); toast(L2('La Marina ha atrapado la balsa de Apis… Volverá a intentarlo otro día.', 'The Navy caught Apis’s raft… She’ll try again another day.'), 'warn', 6); return; }
  if (W.sunk >= 3) { ARC.wi = null; ARC.marks = []; mgHud(null); P.wiDone = 1;
    cinePlay([{ s: 'wi_isla', title: L2('La Isla del Barco de Guerra', 'Warship Island'), txt: L2('Apis os lleva a su isla. Allí espera Ryuji, el dragón milenario, viejo y cansado: quiere volver a la Isla Perdida de los dragones. Apis no quiere que la Marina lo encuentre primero.', 'Apis takes you to her island. Ryuji, the thousand-year dragon, waits there, old and tired: he wants to return to the Lost Island of dragons. Apis doesn’t want the Navy to find him first.') },
      { s: 'wi_vuelo', title: 'Ryuji', txt: L2('Con la Marina hundida, Ryuji alza el vuelo por última vez hacia el horizonte. Antes de irse, deja caer una escama brillante a los pies de Apis… y de su nueva amiga.', 'With the Navy sunk, Ryuji takes flight one last time toward the horizon. Before leaving, he drops a shining scale at the feet of Apis… and her new friend.') }],
      () => { giveItem('wi_escama', 1); const g = 180000; P.gold += g; banner('🐉 ' + L2('Ryuji vuela libre', 'Ryuji flies free'), '+' + fmt(g) + ' ' + L2('oro · Escama del dragón milenario', 'gold · Thousand-year dragon scale')); markDirty(true); }); }
});

// ---------- blancos, muerte y dibujo de estos enemigos en el combate naval ----------
hookAfter('nvTargets', L => Array.isArray(L) ? L.concat(ARC.foes.filter(f => !f.dead)) : L);
hookBefore('nvKill', f => { if (f && f.onKill) { f.dead = 1; burst(f.x, f.y - 10, 20, { sp: 120, up: 60, life: 0.8, c: ['#ffb040', '#ffffff', '#6aa8e0'] }); sfx('kill'); f.onKill(f); return HOOK_SKIP; } });
V33_TICKS.push(dt => { dt = Math.min(0.05, dt || 0.016); const P = G.P, M = G.map; if (!P || !M || !M.dawn) { ARC.foes = []; ARC.rm = null; return; }
  for (const f of ARC.foes) { if (f.k !== 'laboon') continue; const dx = P.x - f.x, dy = P.y - f.y, d = Math.hypot(dx, dy) || 1; f.cd -= dt;
    if (d > 300) { const nx = f.x + dx / d * 90 * dt, ny = f.y + dy / d * 90 * dt; if (dawnSurface(M, nx, ny, 30)) { f.x = nx; f.y = ny; } }
    if (f.cd <= 0) { f.cd = 2.2; nvMark(P.x, P.y, 40, 1.0, 10); } } });
DL_HOOKS.push(list => { const M = G.map; if (!M || !M.dawn) return;
  const R = ARC.wi && ARC.wi.raft; if (R) list.push({ type: 'xdraw', x: R.x, y: R.y, draw: (e, cx, cy) => { const s = spr('wi:balsa', XSPR.wi_balsa); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(R.x - cx), Math.round(R.y - cy)); ctx.scale(2, 2); ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore();
    try { const A = npcAtlas('wi_apis'); ctx.drawImage(A.img, (A.idx.idle || 0) * A.fw, 0, A.fw, A.fh, Math.round(R.x - cx - A.ax), Math.round(R.y - cy - A.ay - 10), A.fw, A.fh); } catch (e2) { } } });
  for (const f of ARC.foes) { if (f.dead) continue;
    if (f.k === 'wimarina') list.push({ type: 'xdraw', x: f.x, y: f.y + 10, draw: (e, cx, cy) => { const s = spr('mr:barco', XSPR.mr_barco); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(f.x - cx), Math.round(f.y - cy + 10)); ctx.scale(f.dir < 0 ? -2.2 : 2.2, 2.2); ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore(); nvBar(f, cx, cy, 120); } });
    if (f.k === 'laboon') list.push({ type: 'xdraw', x: f.x, y: f.y + 10, draw: (e, cx, cy) => { const s = spr('rm:laboon', XSPR.rm_laboon); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(f.x - cx), Math.round(f.y - cy + 10)); ctx.scale(f.x > G.P.x ? -2 : 2, 2); ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore(); nvBar(f, cx, cy, 130); } });
  } });
WORLD_DRAW.push((cx, cy) => { if (!G.map || !G.map.dawn) return; for (const m of (ARC.marks || [])) { const k = 1 - m.t / m.t0, x = m.x - cx, y = m.y - cy; ctx.strokeStyle = 'rgba(255,60,60,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 30, 22, 0, 0, 7); ctx.stroke(); ctx.fillStyle = `rgba(255,60,60,${0.12 + k * 0.35})`; ctx.beginPath(); ctx.ellipse(x, y, 30 * k, 22 * k, 0, 0, 7); ctx.fill(); } });

// ---------- Lupa › 🏴‍☠️ Crossovers ----------
if (typeof LUPA_DAWN !== 'undefined') LUPA_DAWN.push(['arcos628', () => '🗺 ' + L2('Más arcos del Mar de Dawn', 'More Dawn Sea arcs'), () => { const P = G.P || {}; const ok = v => v ? '✅ ' : '• ';
  return [
    ok(P.arcAlvida) + L2('Alvida, revancha (nv. 618): habla con Alvida en el muelle de Loguetown (tras vencerla en su galeón). Cuando brilla («Sube Sube»), el 70 % de los golpes resbala; tras embestir se marea 2,5 s y recibe un 50 % más. Primera vez: 150.000 de oro y el Espejo Sube Sube (accesorio).', 'Alvida rematch (lv. 618): talk to Alvida at the Loguetown pier (after beating her on her galleon). When she shines (“Slip-Slip”), 70 % of hits slip off; after charging she is dizzy for 2.5 s and takes 50 % more. First time: 150,000 gold and the Slip-Slip Mirror (accessory).'),
    ok(P.arcNezumi) + L2('Nezumi (nv. 606): habla con Nojiko en Conomi tras vencer a Arlong. Vence a sus marines y a Nezumi: 120.000 de oro y la recompensa de Nami sube.', 'Nezumi (lv. 606): talk to Nojiko in Conomi after beating Arlong. Defeat his marines and Nezumi: 120,000 gold and Nami’s bounty rises.'),
    '📜 ' + L2('Johnny y Yosaku (Baratie y Conomi): 3 encargos al día. La flecha te lleva a la isla del pirata buscado; al acercarte aparece. Oro según tu nivel.', 'Johnny and Yosaku (Baratie and Conomi): 3 jobs a day. The arrow takes you to the wanted pirate’s island; it appears when you get close. Gold by your level.') + (P.jyJob ? ' ▶ ' + P.jyJob.n + ' · ' + P.jyJob.isleN : ''),
    ok(P.rmDone) + L2('La Montaña del Revés (tras el arco de Loguetown): navega con el Merry al extremo sureste del mar. Calma a Laboon a cañonazos. Premio: Log Pose y 250.000 de oro. El Grand Line ya tiene mar navegable y regreso, sin islas por ahora.', 'Reverse Mountain (after the Loguetown arc): sail the Merry to the far south-east of the sea. Calm Laboon with cannon fire. Reward: Log Pose and 250,000 gold. The Grand Line now has a navigable sea and a return route, with no islands yet.'),
    ok(P.wiDone) + L2('La Isla del Barco de Guerra (tras Arlong): navegando, a veces aparece la balsa de Apis perseguida por la Marina. Hunde 3 barcos sin que hundan la balsa. Premio: Escama del dragón milenario y 180.000 de oro.', 'Warship Island (after Arlong): while sailing, Apis’s raft sometimes appears, chased by the Navy. Sink 3 ships before they sink the raft. Reward: Thousand-year dragon scale and 180,000 gold.')
  ]; }, () => { const P = G.P; return P && !P.rmDone && (P.logueArcN || 0) >= 1 ? { m: 'dawn', loc: RM_AT.slice(), t: L2('Montaña del Revés', 'Reverse Mountain') } : null; }]);
