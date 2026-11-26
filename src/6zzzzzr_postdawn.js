// 6.29 · Mar de Dawn después de la historia (ideas 14-16 que aprobó Sergio). Crossover aparte (docs/LORE.md).
// 14) Mapas del tesoro de Buggy: trozos que sueltan los barcos piratas, los Reyes Marinos y los buscados de Johnny y
//     Yosaku. Nami lo lee → flecha a una isla → una ✗ en el suelo → cavas con ⚔ → cofre con premio al azar.
// 15) La Marina te persigue más fuerte: con recompensa de peligro 3+, a veces sale un buque de guerra de un
//     vicealmirante (mucha vida, andanadas de 3 proyectiles). Hundirlo sube tu recompensa.
// 16) Asaltos semanales (cambian con la semana del calendario del juego; los anuncian Johnny y Yosaku): la venganza de
//     Buggy (Orange Town), la flota de Don Krieg (en el mar, junto al Baratie) y los hombres-pez sueltos (Conomi).
//     Premio grande la primera vez cada semana. Se juegan en tu partida (en el multijugador cada uno ve los suyos).
SAVEKEYS.push('tmMap', 'tmDug', 'raidOn', 'raidWeek', 'raidN');
it('tm_mapa', { n: L2('Trozo del mapa de Buggy', 'Piece of Buggy’s map'), t: 'mat', stack: true, price: 5000, icon: ['scroll', 3], rar: 4,
  d: L2('Un trozo del mapa del tesoro que Buggy robó. Nami sabe leerlo: pídeselo y la flecha te llevará hasta la ✗.', 'A piece of the treasure map Buggy stole. Nami can read it: ask her and the arrow will take you to the ✗.') });
const PD = { raid: null, marks: [] };
const pdDay = () => (typeof calDay === 'function' ? calDay() : Math.floor(Date.now() / 864e5));
const pdWeek = () => Math.floor(pdDay() / 7);
const pdHas = id => (G.P.inv || []).some(s => s && s.id === id);

// ---------- 14) mapas del tesoro ----------
const TM_ISLES = [['shells', 'Shells Town', SHELL_PIER], ['orange', 'Orange Town', ORANGE_QUAY], ['rare', L2('Isla de los Animales Raros', 'Island of Rare Animals'), RARE_PIER], ['syrup', L2('Villa Syrup', 'Syrup Village'), SYRUP_PIER], ['conomi', L2('Islas Conomi', 'Conomi Islands'), CON_MOOR], ['logue', 'Loguetown', LOGUE_PIER]];
function tmDrop(ch) { if (Math.random() < ch) { giveItem('tm_mapa', 1); toast('🗺 ' + L2('¡Un trozo del mapa de Buggy! Nami puede leerlo.', 'A piece of Buggy’s map! Nami can read it.'), 'quest', 5); } }
hookAfter('nvKill', (_r, f) => { if (!f || f.onKill) return; if (f.k === 'pirata') tmDrop(0.35); else if (f.k === 'rey') tmDrop(0.2); });
hookAfter('killMob', (_r, m) => { if (m && m.jy) tmDrop(0.4); });
function tmRead() {
  const P = G.P; if (P.tmMap) { toast(L2('Ya tienes un mapa abierto: ', 'You already have an open map: ') + P.tmMap.isleN, 'info'); tmMark(); return; }
  if (!pdHas('tm_mapa')) { toast(L2('No tienes trozos del mapa de Buggy.', 'You have no pieces of Buggy’s map.'), 'info'); return; }
  takeItem('tm_mapa', 1); const I = TM_ISLES[(Math.random() * TM_ISLES.length) | 0];
  P.tmMap = { isle: I[0], isleN: I[1], at: I[2].slice() }; tmMark(); markDirty(true); closeDialog();
  banner('🗺 ' + L2('Nami: «El tesoro está en ', 'Nami: “The treasure is on ') + I[1] + '»', L2('Sigue la flecha y busca la ✗ en el suelo.', 'Follow the arrow and look for the ✗ on the ground.'));
}
function tmMark() { const T = G.P.tmMap; if (!T || typeof setWp !== 'function') return; setWp({ loc: (T.tx != null ? [T.tx, T.ty] : T.at).slice(), m: 'dawn', t: '🗺 ' + T.isleN }); }
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== ORANGE_NAMI || !G.P.dawnCrewJoined) return; if (!pdHas('tm_mapa') && !G.P.tmMap) return;
  opts.unshift({ label: '🗺 ' + (G.P.tmMap ? L2('¿Dónde estaba el tesoro?', 'Where was the treasure?') : L2('Leer un trozo del mapa de Buggy', 'Read a piece of Buggy’s map')), icon: ['map'], fn: tmRead }); });
// el ✗ se coloca en tierra al llegar a la isla; al pisarlo empieza la excavación (⚔ 6 veces)
V33_TICKS.push(dt => { const P = G.P, T = P && P.tmMap, M = G.map; if (!T || !M || !M.dawn || P.dawnHelm || P.dead || ACT.k) return;
  const [ax, ay] = dawnPx(T.at); if (T.x == null && Math.hypot(P.x - ax, P.y - ay) < 360) { const at = freePxNear(M, P.x, P.y, 9); if (at) { T.x = at[0]; T.y = at[1]; T.tx = at[0] >> 4; T.ty = at[1] >> 4; tmMark(); toast('🗺 ' + L2('¡Ahí está la ✗! Acércate y cava.', 'There’s the ✗! Get close and dig.'), 'quest', 4); markDirty(); } }
  if (T.x != null && Math.hypot(P.x - T.x, P.y - T.y) < 18) { Object.assign(ACT, { k: 'tmdig', n: 0, onAtk: () => { ACT.n++; setAnim(P, 'atk'); sfx('hit'); burst(T.x, T.y, 8, { sp: 60, up: 40, life: 0.4, c: ['#a87a4a', '#d8b080'] }); if (ACT.n >= 6) tmOpen(); return true; } });
    banner('⛏ ' + L2('¡Cava!', 'Dig!'), L2('Pulsa el botón de la espada 6 veces.', 'Press the sword button 6 times.')); } });
V33_TICKS.push(() => { if (ACT.k !== 'tmdig') return; const T = G.P.tmMap; if (!T || Math.hypot(G.P.x - T.x, G.P.y - T.y) > 40) { actEnd(); return; } mgHud('⛏ ' + ACT.n + '/6'); });
const TM_LOOT = [[30, () => ['gold', 50000 + ((Math.random() * 25) | 0) * 10000]], [16, () => ['ore23', 6]], [14, () => ['ore24', 5]], [10, () => ['ore25', 4]], [8, () => ['log25', 5]],
  [8, () => ['perla_dorada', 2]], [6, () => ['perla_luna', 1]], [5, () => ['nv_carne_rey', 2]], [3, () => ['wi_escama', 1]]];
function tmOpen() {
  const P = G.P, T = P.tmMap; actEnd(); P.tmMap = null; P.wp = null; P.tmDug = (P.tmDug || 0) + 1;
  let r = Math.random() * TM_LOOT.reduce((a, l) => a + l[0], 0), got = TM_LOOT[0][1]();
  for (const [w, f] of TM_LOOT) { r -= w; if (r <= 0) { got = f(); break; } }
  const g2 = 20000 + ((Math.random() * 6) | 0) * 5000; P.gold += g2;
  let txt = '+' + fmt(g2) + ' ' + L2('oro', 'gold');
  if (got[0] === 'gold') { P.gold += got[1]; txt = '+' + fmt(got[1] + g2) + ' ' + L2('oro', 'gold'); } else if (ITEMS[got[0]]) { giveItem(got[0], got[1]); txt += ' · ' + got[1] + '× ' + ITEMS[got[0]].n; }
  burst(T.x, T.y - 10, 24, { sp: 90, up: 80, life: 0.8, c: ['#ffd040', '#fff4b0', '#c89a30'] }); sfx('quest');
  banner('💰 ' + L2('¡Cofre de Buggy!', 'Buggy’s chest!'), txt); markDirty(true);
}
WORLD_DRAW.push((cx, cy) => { const T = G.P && G.P.tmMap; if (!T || T.x == null || !G.map || !G.map.dawn) return; const x = T.x - cx, y = T.y - cy;
  ctx.strokeStyle = '#c0302c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 7, y - 5); ctx.lineTo(x + 7, y + 5); ctx.moveTo(x + 7, y - 5); ctx.lineTo(x - 7, y + 5); ctx.stroke(); });

// ---------- 15) buque de guerra de la Marina (peligro 3+) ----------
let PD_NEXTBUQUE = 0;
V33_TICKS.push(dt => { const P = G.P, M = G.map; if (!P || !M || !M.dawn || !nvOn() || nvCalm() || (typeof merryDeck === 'function' && merryDeck())) return;
  const t = nvTier(); if (t < 3) return; if (!PD_NEXTBUQUE) PD_NEXTBUQUE = G.t + 200;
  if (G.t > PD_NEXTBUQUE && !ARC.foes.some(f => f.k === 'buque')) { PD_NEXTBUQUE = G.t + 360 + Math.random() * 180; if (Math.random() < 0.4) { const at = nvFreeSpot(M, P, 560, 680); if (at) {
    ARC.foes.push({ k: 'buque', x: at[0], y: at[1], hp: 14 + t * 2, maxhp: 14 + t * 2, cd: 3, vx: 0, vy: 0, dir: 1, n: L2('Buque del vicealmirante', 'Vice admiral’s warship'),
      onKill: f => { ARC.foes = ARC.foes.filter(x => x !== f); const g = 20000 * t; P.gold += g; if (typeof bntGain === 'function') bntGain(3000000 + t * 1000000); P.nvStats = P.nvStats || {}; P.nvStats.buque = (P.nvStats.buque || 0) + 1; tmDrop(0.5);
        banner('⚓ ' + L2('¡Buque de guerra hundido!', 'Warship sunk!'), '+' + fmt(g) + ' ' + L2('oro · tu recompensa se dispara', 'gold · your bounty soars')); markDirty(true); } });
    toast('⚓ ' + L2('¡Un buque de guerra de la Marina! Un vicealmirante viene a por tu cabeza.', 'A Navy warship! A vice admiral is coming for your head.'), 'warn', 7); sfx('boss'); } } }
  for (const f of ARC.foes) { if (f.k !== 'buque') continue; dt = Math.min(0.05, dt || 0.016); const dx = P.x - f.x, dy = P.y - f.y, d = Math.hypot(dx, dy) || 1, ox = f.x, oy = f.y;
    if (d > 300) { const nx = f.x + dx / d * 110 * dt, ny = f.y + dy / d * 110 * dt; if (dawnSurface(M, nx, ny, 20)) { f.x = nx; f.y = ny; } } f.vx = (f.x - ox) / dt; f.vy = (f.y - oy) / dt; f.dir = dx < 0 ? -1 : 1;
    if (d > 1300) { ARC.foes = ARC.foes.filter(x => x !== f); toast(L2('El buque de guerra te ha perdido de vista.', 'The warship lost sight of you.'), 'info', 4); break; }
    f.cd -= dt; if (f.cd <= 0 && d < 460) { f.cd = 3.2; for (let k = -1; k <= 1; k++) nvMark(P.x + k * 36, P.y + (k ? 10 : 0), 28, 1.0 + Math.abs(k) * 0.15, 9 + nvTier()); } } });
DL_HOOKS.push(list => { if (!G.map || !G.map.dawn) return; for (const f of ARC.foes) { if (f.dead || f.k !== 'buque') continue;
  list.push({ type: 'xdraw', x: f.x, y: f.y + 10, draw: (e, cx, cy) => { const s = spr('mr:barco', XSPR.mr_barco); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(f.x - cx), Math.round(f.y - cy + 10)); ctx.scale(f.dir < 0 ? -2.8 : 2.8, 2.8); ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore(); nvBar(f, cx, cy, 150); } }); } });

// ---------- 16) asaltos semanales ----------
const RAIDS = [
  { k: 'buggy', n: L2('La venganza de Buggy', 'Buggy’s revenge'), isleN: 'Orange Town', at: ORANGE_QUAY, land: true, need: P => !!crewBkSafe(ORANGE_BUGGY),
    d: L2('Buggy vuelve a Orange Town con su banda. Sus manos y cuchillos vuelan solos (Bara Bara): sal de los círculos.', 'Buggy returns to Orange Town with his crew. His hands and knives fly on their own (Chop-Chop): leave the circles.') },
  { k: 'krieg', n: L2('La flota de Don Krieg', 'Don Krieg’s fleet'), isleN: 'Baratie', at: BARATIE_PIER, land: false, need: P => !!crewBkSafe('baratie_krieg'),
    d: L2('Lo que queda de la flota de Krieg ataca el Baratie desde el mar: hunde el buque insignia y sus barcos con los cañones del Merry.', 'What remains of Krieg’s fleet attacks the Baratie from the sea: sink the flagship and its ships with the Merry’s cannons.') },
  { k: 'gyojin', n: L2('Hombres-pez sueltos', 'Fish-men on the loose'), isleN: L2('Islas Conomi', 'Conomi Islands'), at: CON_MOOR, land: true, need: P => !!crewBkSafe('con_arlong'),
    d: L2('Hatchan, Kuroobi y Chew se escaparon del barco de la Marina y vuelven a Conomi. Esta vez, los tres a la vez.', 'Hatchan, Kuroobi and Chew escaped from the Navy ship and are back in Conomi. This time, all three at once.') }
];
const raidNow = () => RAIDS[pdWeek() % RAIDS.length];
function raidStart() { const P = G.P, R = raidNow(); if (!R.need(P)) { toast(L2('Todavía no: primero completa ese arco de la historia.', 'Not yet: finish that story arc first.'), 'info', 5); return; }
  P.raidOn = { k: R.k, w: pdWeek() }; closeDialog(); setWp({ loc: R.at.slice(), m: 'dawn', t: '⚔ ' + R.n }); banner('⚔ ' + R.n, R.d); markDirty(true); }
DLG_HOOKS.push((npc, opts) => { if (!npc || !/^(baratie|con)_(johnny|yosaku)$/.test(npc.id)) return; const P = G.P, R = raidNow(), done = P.raidWeek === pdWeek();
  opts.splice(1, 0, { label: '⚔ ' + L2('Asalto de la semana: ', 'Raid of the week: ') + R.n + (done ? ' ✓' : ''), icon: ['talk'], fn: raidStart }); });
function raidLv(P) { return clamp((P.lv || 600) + 5, 610, 705); }
V33_TICKS.push(dt => { const P = G.P, M = G.map, O = P && P.raidOn; if (!O || !M || !M.dawn || P.dead) return; const R = RAIDS.find(r => r.k === O.k); if (!R) { P.raidOn = null; return; }
  if (O.w !== pdWeek()) { P.raidOn = null; toast(L2('El asalto de la semana pasada ya terminó.', 'Last week’s raid is over.'), 'info'); return; }
  const [x, y] = dawnPx(R.at), near = Math.hypot(P.x - x, P.y - y) < (R.land ? 380 : 650);
  if (!PD.raid && near && (R.land ? !P.dawnHelm : nvOn())) raidSpawn(R, M, P);
  const S = PD.raid; if (!S) return;
  if (R.k === 'krieg') { if (S.foes.every(f => f.dead) && S.ships.every(f => f.dead || !NV.foes.includes(f))) raidWin(R); return; }
  if (S.mobs.every(m => m.dying || m.remove || !G.ents.includes(m))) { raidWin(R); return; }
  // Bara Bara: manos y cuchillos que vuelan hacia ti
  if (R.k === 'buggy' && S.boss && !S.boss.dying && (S.t -= dt || 0.016) <= 0) { S.t = 3.6; for (let k = 0; k < 4; k++) { const a = Math.random() * 6.28; PD.knives = (PD.knives || 0) + 1; PD.marks.push({ x: P.x + Math.cos(a) * 30, y: P.y + Math.sin(a) * 22, t: 0.9, t0: 0.9, src: S.boss }); } }
});
function raidSpawn(R, M, P) { const lv = raidLv(P), S = PD.raid = { k: R.k, mobs: [], foes: [], ships: [], t: 2 };
  if (R.k === 'buggy') { const at = freePxNear(M, P.x, P.y - 70, 4) || [P.x, P.y - 70], b = spawnMob(ORANGE_BUGGY, lv, at[0], at[1], 0, null, true); if (b) { b.state = 'fight'; b.hgt = 66; S.boss = b; S.mobs.push(b); showBoss(b); shellsRescueSpeak(b, '¡¿Quién se ríe de mi nariz?! ¡Bara Bara: cuchillos voladores!', 'Who’s laughing at my nose?! Chop-Chop: flying knives!'); }
    for (let k = 0; k < 6; k++) { const a2 = freePxNear(M, P.x, P.y - 40, 6); if (a2) { const m = spawnMob(k % 2 ? 'dawn_boarder' : 'dawn_pirata', lv - 5, a2[0], a2[1], 0, null, false); if (m) { m.aggroT = 99; m.target = P; m.state = 'chase'; S.mobs.push(m); } } } }
  else if (R.k === 'gyojin') { ['con_hatchan', 'con_kuroobi', 'con_chew'].forEach((id, i) => { const a2 = freePxNear(M, P.x + (i - 1) * 60, P.y - 70, 3) || [P.x + (i - 1) * 60, P.y - 70]; const m = spawnMob(id, lv, a2[0], a2[1], 0, null, true); if (m) { m.state = 'fight'; m.hgt = 70; m.hp = m.maxhp = Math.round(m.maxhp * 0.6); S.mobs.push(m); } });
    if (S.mobs[0]) { showBoss(S.mobs[0]); shellsRescueSpeak(S.mobs[0], '¡Seis espadas otra vez! ¡Y esta vez somos tres!', 'Six swords again! And this time there are three of us!'); } }
  else { for (let k = 0; k < 2; k++) nvSpawnPirate(M, P); S.ships = NV.foes.filter(f => f.k === 'pirata' && !f.dead);
    const at = nvFreeSpot(M, P, 560, 680) || [P.x + 560, P.y]; const f = { k: 'buque', kk: 'krieg', x: at[0], y: at[1], hp: 26, maxhp: 26, cd: 3, vx: 0, vy: 0, dir: 1, n: L2('Buque insignia de Krieg', 'Krieg’s flagship'), onKill: f2 => { ARC.foes = ARC.foes.filter(x => x !== f2); } };
    ARC.foes.push(f); S.foes.push(f); toast('🏴‍☠️ ' + L2('¡El buque insignia de Don Krieg! Hunde la flota.', 'Don Krieg’s flagship! Sink the fleet.'), 'warn', 6); }
  sfx('boss'); banner('⚔ ' + R.n, L2('¡Empieza el asalto!', 'The raid begins!')); }
function raidWin(R) { const P = G.P, first = P.raidWeek !== pdWeek(); PD.raid = null; P.raidOn = null; P.wp = null; P.raidN = (P.raidN || 0) + 1;
  const g = first ? 400000 : 50000; P.gold += g; PD.lastPrize = g; if (first) { P.raidWeek = pdWeek(); giveItem('tm_mapa', 2); giveItem(['ore25', 'perla_luna', 'wi_escama'][(Math.random() * 3) | 0], 1); }
  setTimeout(() => banner('🏆 ' + R.n + L2(': ¡victoria!', ': victory!'), '+' + fmt(g) + ' ' + L2('oro', 'gold') + (first ? ' · ' + L2('premio semanal: 2 trozos de mapa y un material raro', 'weekly prize: 2 map pieces and a rare material') : ' · ' + L2('premio semanal ya cobrado', 'weekly prize already claimed'))), 600); markDirty(true); }
V33_TICKS.push(dt => { dt = Math.min(0.05, dt || 0.016); const P = G.P; if (!PD.marks.length || !P) return;
  PD.marks = PD.marks.filter(m => { m.t -= dt; if (m.t > 0) return true; burst(m.x, m.y - 8, 8, { sp: 70, up: 30, life: 0.35, c: ['#e8e8f0', '#c0302c'] }); if (Math.hypot(P.x - m.x, P.y - m.y) < 22) hurtPlayer((m.src && m.src.atk || 1000) * 0.7, m.src || {}); return false; }); });
WORLD_DRAW.push((cx, cy) => { for (const m of PD.marks) { const k = 1 - m.t / m.t0, x = m.x - cx, y = m.y - cy; ctx.strokeStyle = 'rgba(255,60,60,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 22, 14, 0, 0, 7); ctx.stroke();
  ctx.save(); ctx.translate(x, y - 30 * (1 - k)); ctx.rotate(G.t * 8); ctx.fillStyle = '#e8e8f0'; ctx.fillRect(-6, -1, 12, 2); ctx.fillStyle = '#5a3a22'; ctx.fillRect(-8, -1, 3, 2); ctx.restore(); } });
hookAfter('setMap', () => { if (PD.raid && G.map && !G.map.dawn) { for (const m of PD.raid.mobs) if (!m.dying) m.remove = true; PD.raid = null; } });

// ---------- Lupa › 🏴‍☠️ Crossovers ----------
if (typeof LUPA_DAWN !== 'undefined') LUPA_DAWN.push(['post629', () => '🏆 ' + L2('Tesoros, buques y asaltos', 'Treasures, warships and raids'), () => { const P = G.P || {}, R = raidNow();
  return [
    '🗺 ' + L2('Mapas de Buggy: los barcos piratas (35 %), los Reyes Marinos (20 %), los buscados de Johnny y Yosaku (40 %) y los buques de guerra (50 %) sueltan trozos. Pídele a Nami que lo lea: la flecha te lleva a la isla, verás una ✗ roja; ponte encima y pulsa el botón de la espada 6 veces. Cofres: oro, Coralita, Nacarita, Piedra del Mar, Árbol Rey, perlas, carne de Rey Marino o una escama del dragón.', 'Buggy’s maps: pirate ships (35 %), Sea Kings (20 %), Johnny and Yosaku’s wanted pirates (40 %) and warships (50 %) drop pieces. Ask Nami to read one: the arrow takes you to the island and you’ll see a red ✗; stand on it and press the sword button 6 times. Chests: gold, Coralite, Nacrite, Seastone, King Tree, pearls, Sea King meat or a dragon scale.') + (P.tmMap ? ' ▶ ' + P.tmMap.isleN : '') + ' · ' + L2('cofres abiertos: ', 'chests opened: ') + (P.tmDug || 0),
    '⚓ ' + L2('Con recompensa de peligro 3 o más, a veces te persigue un buque de guerra de un vicealmirante: mucha vida y andanadas de 3 proyectiles. Hundirlo da mucho oro, dispara tu recompensa y puede soltar un trozo de mapa.', 'With a bounty of danger 3 or more, a vice admiral’s warship sometimes chases you: lots of HP and 3-shot volleys. Sinking it gives lots of gold, sends your bounty soaring and may drop a map piece.'),
    '⚔ ' + L2('Asalto de esta semana: ', 'This week’s raid: ') + R.n + ' (' + R.isleN + '). ' + R.d + ' ' + L2('Pídeselo a Johnny o Yosaku. Primera victoria de la semana: 400.000 de oro, 2 trozos de mapa y un material raro; después, 50.000. Cambia cada semana del calendario del juego (Buggy → Krieg → hombres-pez).', 'Ask Johnny or Yosaku. First win of the week: 400,000 gold, 2 map pieces and a rare material; after that, 50,000. It changes every week of the game calendar (Buggy → Krieg → fish-men).') + (P.raidWeek === pdWeek() ? ' ✅' : '')
  ]; }, () => { const P = G.P; if (P && P.tmMap) return { m: 'dawn', loc: (P.tmMap.tx != null ? [P.tmMap.tx, P.tmMap.ty] : P.tmMap.at).slice(), t: P.tmMap.isleN }; if (P && P.raidOn) { const R = RAIDS.find(r => r.k === P.raidOn.k); if (R) return { m: 'dawn', loc: R.at.slice(), t: R.n }; } return null; }]);
