// ================= v4.41: TORRE DE LOS PORTALES — cazadores, rangos, prueba de poder y mazmorras (solas y en equipo de 4) =================
// Idea original inspirada en historias de cazadores y portales: nombres, rangos (Cobre → Astral), diseños y diálogos propios.
SAVEKEYS.push('hunt');
function hunt() { const P = G.P; const o = P.hunt = P.hunt || {}; o.hn = o.hn || {}; o.cleared = o.cleared || {}; o.log = o.log || []; return o; }
const HN_RK = [['Cobre', 'Copper', '#c87a3a'], ['Hierro', 'Iron', '#a0a0b0'], ['Plata', 'Silver', '#e0e0f0'], ['Oro', 'Gold', '#ffd040'], ['Platino', 'Platinum', '#8af0f0'], ['Astral', 'Astral', '#c8a0ff']];
const HN_RKSC = [0, 2000, 6000, 14000, 22000, 30000];
const HN_PW = { fuego: [L2('Fuego', 'Fire'), '#ff6a2a', 'fire'], hielo: [L2('Hielo', 'Ice'), '#8ad8ff', 'ice'], roca: [L2('Roca', 'Rock'), '#b89a6a', 'soul'], aire: [L2('Aire', 'Air'), '#c8f0e0', 'arrow'], agua: [L2('Agua', 'Water'), '#4aa0ff', 'soul'], mente: [L2('Mente', 'Mind'), '#e070ff', 'soul'] };
function hnRankOfLv(lv) { return lv >= 300 ? 5 : lv >= 230 ? 4 : lv >= 160 ? 3 : lv >= 100 ? 2 : lv >= 50 ? 1 : 0; }
function rkName(i) { const r = HN_RK[clamp(i, 0, 5)]; return L2(r[0], r[1]); }

// =====================================================================================
// CAZADORES (40, cada uno con nombre, aspecto, clase, poder, rango y nivel propios)
// =====================================================================================
const HN_NAMES = { m: ['Kael', 'Doran', 'Riku', 'Tadeo', 'Bastian', 'Ozren', 'Varo', 'Joaquín', 'Lisandro', 'Hugo', 'Ruben', 'Teo', 'Amaru', 'Yusei', 'Brann', 'Corvo', 'Nilo', 'Sigurd', 'Ilan', 'Mauro'], f: ['Nadia', 'Yara', 'Mika', 'Sienna', 'Valka', 'Irene', 'Kiara', 'Ayla', 'Noa', 'Tamsin', 'Rhea', 'Cusi', 'Lune', 'Dafne', 'Brisa', 'Selka', 'Ivet', 'Zuri', 'Marlen', 'Ada'] };
const HN_LINES = [
  [L2('Hoy cierro tres portales antes de la cena. Apuesta lo que quieras.', 'I\'ll close three portals before dinner. Bet anything.'), L2('El ranking no miente: el que entrena, sube.', 'The ranking doesn\'t lie: whoever trains, climbs.')],
  [L2('No me gusta entrar sola… pero los monstruos no esperan.', 'I don\'t like going in alone… but monsters don\'t wait.'), L2('Si ves una grieta roja, aléjate. Esas no las cierra cualquiera.', 'If you see a red crack, stay away. Not just anyone closes those.')],
  [L2('Mi poder despertó a los quince años. Casi quemo la escuela.', 'My power awoke at fifteen. I almost burned the school down.'), L2('Los de rango Astral ni comen aquí. Viven dentro de los portales.', 'Astral rankers don\'t even eat here. They live inside the portals.')],
  [L2('¿Formamos equipo? Tú atraes y yo remato.', 'Team up? You pull, I finish.'), L2('Un buen curandero vale más que diez espadas.', 'A good healer is worth more than ten swords.')],
  [L2('La recepcionista Selene sabe el rango de todos… incluso el tuyo.', 'Receptionist Selene knows everyone\'s rank… even yours.'), L2('He visto cosas en los portales del Velo que no te contaría ni borracho.', 'I\'ve seen things in the Veil portals I wouldn\'t tell you even drunk.')],
];
const HN = [];
{ const R = new RNG(SEED + 4141), cls = Object.keys(CLASSES), pws = Object.keys(HN_PW), outf = ['tunic', 'robe', 'guard', 'sailor', 'smith', 'rogue', 'dress'], cl = Object.keys(CLOTH), hs = Object.keys(HAIRS);
  for (let i = 0; i < 40; i++) { const g = R.f() < 0.5 ? 'f' : 'm', big = R.f() < 0.22, lv = Math.round(30 + Math.pow(R.f(), 1.6) * 320), c = cls[R.int(0, cls.length - 1)], pw = pws[R.int(0, pws.length - 1)];
    let name = HN_NAMES[g][(i * 7 + R.int(0, 19)) % 20]; if (HN.some(x => x.name === name)) name = HN_NAMES[g].find(n => !HN.some(x => x.name === n)) || name + ' ' + (i + 1); const id = 'hn_' + i; HN.push({ i, id, name, g, big, lv, cls: c, pw, pers: R.int(0, HN_LINES.length - 1) });
    NPCS[id] = { n: name, title: '', look: LK(Object.assign({ hair: HAIRS[hs[R.int(0, hs.length - 1)]], hairStyle: g === 'f' ? 'long' : 'short', outfit: g === 'f' && R.f() < 0.4 ? 'dress' : outf[R.int(0, outf.length - 1)], main: CLOTH[cl[R.int(0, cl.length - 1)]], sec: CLOTH[cl[R.int(0, cl.length - 1)]], skin: SKINS[R.int(0, Math.min(4, SKINS.length - 1))] }, big ? { body: 'big' } : {})), lines: HN_LINES[i % HN_LINES.length] }; } }
function hnState(h) { const o = hunt().hn; const s = o[h.i] = o[h.i] || { lv: h.lv, xp: 0 }; return s; }
function hnLv(h) { return hnState(h).lv; }
function hnRank(h) { return hnRankOfLv(hnLv(h)); }
function hnTitle(h) { return CLASSES[h.cls].n + ' · ' + L2('Rango ', 'Rank ') + rkName(hnRank(h)) + ' · ' + HN_PW[h.pw][0] + ' · ' + L2('Nv. ', 'Lv. ') + hnLv(h); }
for (const h of HN) Object.defineProperty(NPCS[h.id], 'title', { get: () => hnTitle(h), configurable: true });

// =====================================================================================
// ENEMIGOS Y JEFES NUEVOS (en el bestiario)
// =====================================================================================
HLOOKS.cazador_caido = Object.assign({}, HLOOKS.bandido, { main: pal(['#0a0a12', '#14141e', '#20202e', '#2e2e40', '#3e3e56']), sec: pal(['#3a0a1a', '#6a1430', '#9a1e44', '#c83a5a', '#f06a8a']), cloth: pal(['#08080c', '#121218', '#1c1c24', '#282834', '#363646']), eyes: 'brillo' });
HLOOKS.cazador_corrupto = Object.assign({}, HLOOKS.bandido, { main: pal(['#1a0a2a', '#2a1440', '#3e1e5a', '#5a2e7a', '#7a44a0']), cloth: pal(['#140a1a', '#201028', '#2e1838', '#40224c', '#563066']), eyes: 'brillo' });
const DG_MOBS = {
  golem_rojo: [L2('Gólem Rojo', 'Red Golem'), ['bst', 'golem', ['#2a0604', '#6a140c', '#b82a1a', '#ff6a3a'], 1.3, { core: '#ffd040' }], [48, 62], 2.0, 1.3, 1.6, 34, 'aggro'],
  elemental_roca: [L2('Elemental de Roca', 'Rock Elemental'), ['bst', 'golem', ['#2a2018', '#5a4632', '#8a6e4e', '#c8a878'], 1.0, { core: '#ffb040' }], [48, 64], 1.5, 1.1, 1.5, 38, 'aggro'],
  arana_portal: [L2('Araña del Portal', 'Portal Spider'), ['bst', 'spider2', ['#14081e', '#2e1448', '#5a2a8a', '#b07aff'], 1.0], [50, 160], 1.0, 1.3, 1.0, 62, 'aggro'],
  lobo_nocturno: [L2('Lobo Nocturno', 'Night Wolf'), ['quad', 'vacio'], [96, 112], 1.2, 1.35, 1.0, 74, 'aggro'],
  cazador_corrupto: [L2('Cazador Corrupto', 'Corrupted Hunter'), ['hum', 'cazador_corrupto'], [96, 350], 1.2, 1.4, 1.1, 58, 'ranged'],
  lagarto_igneo: [L2('Lagarto Ígneo', 'Igneous Lizard'), ['bst', 'lizard', ['#2a0a04', '#7a1e0a', '#d8501a', '#ffb040'], 1.1], [145, 175], 1.3, 1.4, 1.2, 56, 'charge'],
  elemental_fuego: [L2('Elemental de Fuego', 'Fire Elemental'), ['bst', 'wisp', ['#4a0a00', '#c83a0a', '#ff8a2a', '#ffe08a'], 1.2], [245, 300], 1.1, 1.5, 1.0, 50, 'ranged'],
  elemental_hielo: [L2('Elemental de Hielo', 'Ice Elemental'), ['bst', 'wisp', ['#0a2a4a', '#2a6aa8', '#8ad8ff', '#ffffff'], 1.2], [245, 300], 1.1, 1.4, 1.2, 46, 'ranged'],
  escarabajo_acero: [L2('Escarabajo de Acero', 'Steel Beetle'), ['bst', 'beetle', ['#1a1a24', '#3a3a4a', '#7a7a90', '#c8c8e0'], 1.2], [160, 220], 1.6, 1.2, 1.8, 40, 'charge'],
  sapo_abisal: [L2('Sapo Abisal', 'Abyssal Toad'), ['bst', 'toad', ['#0a1a14', '#1a4a3a', '#2a8a6a', '#8affc8'], 1.2], [160, 220], 1.4, 1.2, 1.2, 44, 'aggro'],
  espectro_portal: [L2('Espectro del Portal', 'Portal Wraith'), ['bst', 'wisp', ['#05000a', '#2a0a3a', '#6a2a9a', '#ff6ae0'], 1.1], [280, 350], 1.1, 1.6, 1.0, 60, 'ranged'],
  golem_vacio: [L2('Gólem del Vacío', 'Void Golem'), ['bst', 'golem', ['#05000a', '#1a0a2a', '#3a1a5a', '#8a5aff'], 1.4, { core: '#ff3a8a' }], [330, 350], 2.2, 1.5, 1.8, 32, 'aggro'],
};
for (const id in DG_MOBS) { const [n, art, lv, hp, atk, def, spd, ai] = DG_MOBS[id]; MOBS[id] = { n, art, reg: ['portal'], lv, hp, atk, def, spd, ai, fam: id, drops: [['esencia_portal', 0.2]], dg: 1 }; }
const DG_BOSS = {
  titan_carmesi: [L2('Titán Carmesí', 'Crimson Titan'), 56, ['bst', 'golem', ['#2a0604', '#6a140c', '#c82a1a', '#ff8a4a'], 3.2, { core: '#ffe040' }], ['slam', 'nova', 'charge', 'summon'], 'golem_rojo'],
  alfa_nocturno: [L2('Alfa Nocturno', 'Night Alpha'), 106, ['bst', 'lizard', ['#05000a', '#1a0a2a', '#3a2a5a', '#ff4a6a'], 2.6], ['charge', 'hop', 'summon', 'nova'], 'lobo_nocturno'],
  reina_aracnida: [L2('Reina Arácnida del Portal', 'Portal Spider Queen'), 156, ['bst', 'spider2', ['#14081e', '#3e1460', '#8a2ac0', '#ffb0ff'], 2.6], ['volley', 'summon', 'field', 'charge'], 'arana_portal'],
  sapo_rey: [L2('Rey Sapo Abisal', 'Abyssal Toad King'), 172, ['bst', 'toad', ['#0a1a14', '#1a4a3a', '#2aa07a', '#c8ffe8'], 3], ['hop', 'slam', 'summon', 'rain'], 'sapo_abisal'],
  senor_tormentas: [L2('Señor de las Tormentas', 'Lord of Storms'), 212, ['bst', 'wisp', ['#0a1a3a', '#2a4aa0', '#8ac8ff', '#ffffff'], 3], ['volley', 'rain', 'blink', 'nova'], 'elemental_hielo'],
  senor_elemental: [L2('Señor Elemental', 'Elemental Lord'), 256, ['bst', 'wisp', ['#3a0a00', '#c83a0a', '#ffb040', '#fff0c0'], 3.2], ['rain', 'nova', 'volley', 'summon', 'field'], 'elemental_fuego'],
  cazador_caido: [L2('El Cazador Caído', 'The Fallen Hunter'), 302, ['hum', 'cazador_caido'], ['charge', 'blink', 'volley', 'slam', 'summon'], 'cazador_corrupto'],
  monarca_vacio: [L2('Monarca del Vacío', 'Void Monarch'), 346, ['bst', 'golem', ['#05000a', '#1a0a2a', '#4a1a8a', '#c88aff'], 3.6, { core: '#ff3a8a' }], ['slam', 'nova', 'rain', 'summon', 'blink'], 'golem_vacio'],
};
for (const id in DG_BOSS) { const [n, lv, art, moves, minion] = DG_BOSS[id]; BOSSES[id] = { n, lv, art, hp: 30, atk: 2.2 + lv / 400, def: 2 + lv / 400, spd: 46, moves, minion, drops: [['esencia_portal', 1, 6], ['diamante', 0.6, 3]], r: 30, cave: 1, dg: 1 }; }
it('esencia_portal', { n: L2('Esencia de portal', 'Portal essence'), t: 'mat', stack: true, tier: 6, price: 120, icon: ['crystal', '#c8a0ff'], rar: 2 });

// =====================================================================================
// MAZMORRAS: [id, mundo, nivel, nombre, enemigos, jefe, suelo, región de colores]
// =====================================================================================
const DG = [
  ['d50', 'world', 50, L2('Cripta del Gólem Rojo', 'Red Golem Crypt'), ['golem_rojo', 'elemental_roca', 'arana_portal'], 'titan_carmesi', 'ASH', 'nhar'],
  ['d100', 'world', 100, L2('Bosque de los Lobos Nocturnos', 'Night Wolf Forest'), ['lobo_nocturno', 'cazador_corrupto', 'arana_portal'], 'alfa_nocturno', 'DIRT', 'bosque'],
  ['d150', 'world', 150, L2('Nido de la Reina Arácnida', 'Spider Queen\'s Nest'), ['arana_portal', 'lagarto_igneo', 'cazador_corrupto'], 'reina_aracnida', 'DUSK', 'cristal'],
  ['d250', 'world', 250, L2('Santuario Elemental', 'Elemental Sanctuary'), ['elemental_fuego', 'elemental_hielo', 'cazador_corrupto'], 'senor_elemental', 'ASH', 'nhar'],
  ['d340', 'world', 340, L2('Abismo del Monarca', 'Monarch\'s Abyss'), ['golem_vacio', 'espectro_portal', 'cazador_corrupto'], 'monarca_vacio', 'DUSK', 'eclipse'],
  ['a170', 'archipielago', 170, L2('Gruta del Sapo Abisal', 'Abyssal Toad Grotto'), ['sapo_abisal', 'escarabajo_acero', 'lagarto_igneo'], 'sapo_rey', 'DIRT', 'selva'],
  ['c210', 'cielo', 210, L2('Torre de las Tormentas', 'Storm Tower'), ['elemental_hielo', 'escarabajo_acero', 'arana_portal'], 'senor_tormentas', 'DUSK', 'picos'],
  ['v300', 'velo_roto', 300, L2('Catedral del Cazador Caído', 'Fallen Hunter Cathedral'), ['espectro_portal', 'cazador_corrupto', 'elemental_fuego'], 'cazador_caido', 'DUSK', 'eclipse'],
];
function dgDef(D, team) { const id = 'mz_' + D[0] + (team ? '_eq' : ''); if (!CAVES[id]) { CAVES[id] = { n: D[3] + (team ? ' · ' + L2('Equipo', 'Team') : ''), reg: D[7], lv: [D[2], D[2] + 8], floor: T[D[6]] || T.DUSK, dark: 0.62, mobs: D[4], boss: D[5], ores: [[Math.min(11, Math.ceil(D[2] / 32)), 4]], deco: 'crystal', seed: 9000 + D[2] * 7 + (team ? 3 : 0), d: L2('Una mazmorra dentro de un portal. Derrota al jefe para cerrarla.', 'A dungeon inside a portal. Defeat the boss to close it.'), dg: D[0], team: !!team }; if (typeof SYNC_MAPS !== 'undefined') SYNC_MAPS.add(id); } return id; }
function dgUnlocked(D) { return G.P.lv >= D[2] - 10; }
let HUNT = { allies: [], dg: null };
function dgEnter(D, team) { const P = G.P; if (!dgUnlocked(D)) { toast(L2('Necesitas nivel ', 'You need level ') + (D[2] - 10), 'warn'); return; } const id = dgDef(D, team);
  const M0 = G.map; P.dgRet = { m: M0.id, x: P.x, y: P.y, inside: P.inside }; delete G.maps[id]; const M = makeCave(id);
  for (const o of M.objs) if (o.xact === 'deep_go' || o.xact === 'deep_chest') { o.hidden = true; M.solidO[M.I(o.tx, o.ty)] = 0; }
  if (team) for (const c of M.camps) c.n += 1;
  HUNT.dg = { id, D, team, t0: Date.now() };
  transition(() => { P.inside = null; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner(D[3], (team ? L2('Equipo de 4', 'Team of 4') : L2('En solitario', 'Solo')) + ' · ' + L2('Nivel ', 'Level ') + D[2]); sfx('boss'); if (team) huntAlliesSpawn(M); }); }
function dgLeave() { const P = G.P, R = P.dgRet; huntAlliesClear(); HUNT.dg = null; if (!R) return exitInterior(); P.dgRet = null;
  transition(() => { const M = R.m === 'world' ? G.world : R.m === 'torre_portales' ? makeTower() : (G.maps[R.m] || (R.m === 'cielo' ? makeSky() : R.m === 'archipielago' ? makeArchi() : R.m === 'velo_roto' ? makeVelo() : G.world)); P.inside = R.inside || null; setMap(M, R.x, R.y, 'down'); }); }
{ const _ei = exitInterior; exitInterior = function () { const M = G.map; if (M && CAVES[M.id] && CAVES[M.id].dg) { dgLeave(); return; } return _ei.apply(this, arguments); }; }
// al vencer al jefe, aparece el cofre de recompensa y la mazmorra se cierra
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { const M = G.map, D = M && CAVES[M.id]; if (m && m.boss && D && D.dg && m.map === M.id) { const H = hunt(), key = D.dg + (D.team ? '_eq' : ''); H.cleared[key] = (H.cleared[key] || 0) + 1;
      putNear(M, 'tr_cofre', Math.round(m.x / 16), Math.round(m.y / 16) + 1, [[0, 0]], { xact: 'dg_reward', dgk: key, team: D.team, lv: D.lv[0] }); banner(L2('¡Portal cerrado!', 'Portal closed!'), D.n); sfx('questdone');
      hnLog(G.P.name + L2(' cerró ', ' closed ') + D.n + (D.team ? L2(' con su equipo', ' with their team') : L2(' en solitario', ' solo')) + '.'); if (typeof pvLog === 'function') pvLog(G.P.name + L2(' cerró el portal: ', ' closed the portal: ') + D.n + '.', '', 'good'); } } catch (e) { console.warn(e); } return r; }; }
const DG_COS = []; // recompensas cosméticas (se llenan en la 4.42)
XACT.dg_reward = [L2('Abrir el cofre del portal', 'Open the portal chest'), 'bag', o => { if (o.opened) return; o.opened = 1; o.hidden = true; const P = G.P, k = o.team ? 1.6 : 1, g = Math.round(3000 * (1 + o.lv / 25) * k); P.gold += g; giveItem('esencia_portal', Math.round((3 + o.lv / 40) * k)); gainXp(Math.round(xpToNext(P.lv) * 0.35 * k));
  const gear = Object.keys(ITEMS).filter(id => { const it = ITEMS[id]; return it.slot && (it.lv || 1) <= P.lv && (it.lv || 1) >= o.lv - 10 && (!it.cls || it.cls === P.cls) && !it.quest && !it.cos && it.price > 0; }); if (gear.length) giveItem(pick(gear), 1);
  if (DG_COS.length && Math.random() < (o.team ? 0.45 : 0.25)) { const c = pick(DG_COS); giveItem(c, 1); toast('🎁 ' + ITEMS[c].n, 'quest', 5); }
  floatText(o.px, o.py - 30, '+' + fmt(g) + ' ' + L2('oro', 'gold'), '#ffd040'); sfx('coin'); markDirty(true); toast(L2('Sal por la salida del sur para volver.', 'Leave by the south exit to go back.'), 'info', 4); }];

// =====================================================================================
// EQUIPO DE 4: 3 cazadores te acompañan en las mazmorras de equipo (luchan, usan su poder y los enemigos van a por todos)
// =====================================================================================
function huntPick() { const P = G.P, sel = (hunt().team || []).map(i => HN[i]).filter(Boolean); const pool = HN.filter(h => !sel.includes(h) && !hnBusy(h)).sort((a, b) => Math.abs(hnLv(a) - P.lv) - Math.abs(hnLv(b) - P.lv)); while (sel.length < 3 && pool.length) sel.push(pool.shift()); return sel.slice(0, 3); }
function huntAlliesSpawn(M) { huntAlliesClear(); const P = G.P; huntPick().forEach((h, i) => { const rf = 0.8 + hnRank(h) * 0.1, a = { type: 'hunter', h, id: h.id, def: NPCS[h.id], x: P.x + (i - 1) * 18, y: P.y + 14, L: P.L, map: M.id, dir: 'up', anim: 'idle', af: 0, at: 0, hum: true, cd: 0.5, pcd: 3 + i, rf, scale: h.big ? 1 : 1, name: h.name };
    a.atlas = npcAtlas(h.id); a.maxhp = Math.round((P.S ? P.S.maxhp : 1000) * 0.85 * rf); a.hp = a.maxhp; G.ents.push(a); HUNT.allies.push(a); }); huntBars(); }
function huntAlliesClear() { for (const a of HUNT.allies) a.remove = true; HUNT.allies = []; huntBars(); }
function huntAtk(a) { const P = G.P; return Math.max(1, Math.round((P.S ? P.S.atk : 100) * 0.45 * a.rf)); }
function huntPower(a, tgt) { const h = a.h, W = HN_PW[h.pw], P = G.P, cx = tgt ? tgt.x : a.x, cy = tgt ? tgt.y : a.y, R = 56, d = huntAtk(a) * 2.6;
  addFx({ type: 'ring', x: cx, y: cy - 8, r: R, dur: 0.45, col: W[1] }); burst(cx, cy - 10, 22, { sp: 90, up: 50, g: h.pw === 'aire' ? -20 : 80, life: 0.7, c: [W[1], '#ffffff'] }); setAnim(a, 'cast'); floatText(a.x, a.y - 44, W[0] + '!', W[1]);
  if (h.pw === 'agua') { for (const q of HUNT.allies.concat([{ isP: 1 }])) { if (q.isP) { if (P.S && !P.dead) P.hp = Math.min(P.S.maxhp, P.hp + P.S.maxhp * 0.1); } else if (!q.down) q.hp = Math.min(q.maxhp, q.hp + q.maxhp * 0.15); } }
  for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== a.map || dist2(m.x, m.y, cx, cy) > R * R) continue; hitMob(m, d, { fire: h.pw === 'fuego' ? 1 : 0 });
    if (h.pw === 'fuego') { m.burn = Math.max(m.burn || 0, 3); m.burnD = d * 0.08; } if (h.pw === 'hielo') m.freeze = Math.max(m.freeze || 0, 1.4); if (h.pw === 'roca') m.stun = Math.max(m.stun || 0, 1); if (h.pw === 'aire') { const L = Math.hypot(m.x - cx, m.y - cy) || 1; m.kbx = (m.x - cx) / L * 160; m.kby = (m.y - cy) / L * 160; }
    if (h.pw === 'agua' && typeof elSet === 'function') elSet(m, 'wet', 5); if (h.pw === 'mente') { m.stun = Math.max(m.stun || 0, 2); m.confT = G.t + 4; floatText(m.x, m.y - 30, '?!', '#e070ff'); } } }
function huntUpdate(a, dt) { const P = G.P; if (a.map !== P.map) { a.remove = true; return; } a.cd -= dt; a.pcd -= dt;
  if (a.down) { a.downT -= dt; if (a.downT <= 0) { a.down = false; a.hp = Math.round(a.maxhp * 0.5); floatText(a.x, a.y - 40, L2('¡De vuelta!', 'Back up!'), '#8aff8a'); } return; }
  let tgt = null, bd = 210 * 210; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === a.map) { const d = dist2(m.x, m.y, P.x, P.y); if (d < bd) { bd = d; tgt = m; } }
  const C = CLASSES[a.h.cls] || CLASSES.guerrero, ranged = C.range > 60; let tx, ty;
  if (tgt) { const ang = Math.atan2(a.y - tgt.y, a.x - tgt.x), rr = ranged ? 80 : 18; tx = tgt.x + Math.cos(ang) * rr; ty = tgt.y + Math.sin(ang) * rr * 0.7; } else { const i = HUNT.allies.indexOf(a), dv = DIRV[P.dir] || [0, 1]; tx = P.x - dv[0] * 26 + (i - 1) * 18; ty = P.y - dv[1] * 22 + 8; }
  const dx = tx - a.x, dy = ty - a.y, L = Math.hypot(dx, dy); if (L > 280) { a.x = P.x; a.y = P.y + 10; } else if (L > 2) { const sp = Math.min(L * 6, (P.S ? P.S.spd : 70) * 1.25); if (!moveEnt(G.map, a, dx / L * sp * dt, dy / L * sp * dt) && L > 50) { a.x = tx; a.y = ty; } }
  if (tgt) { a.dir = dirFromVec(tgt.x - a.x, tgt.y - a.y); const d = Math.hypot(tgt.x - a.x, tgt.y - a.y);
    if (a.pcd <= 0 && d < 150) { a.pcd = 6 + Math.random() * 3; huntPower(a, tgt); }
    else if (a.cd <= 0 && d < (ranged ? 160 : 32)) { a.cd = C.aspd * 1.3; setAnim(a, 'atk'); a.loopAnim = false; const W = HN_PW[a.h.pw];
      if (ranged) spawnProj('p', a.x, a.y - 8, Math.atan2(tgt.y - a.y, tgt.x - a.x), { spd: 260, dmg: huntAtk(a), art: W[2], life: 0.9 }); else { hitMob(tgt, huntAtk(a), { kb: 12 }); addFx({ type: 'slash', x: a.x, y: a.y - 8, ang: Math.atan2(tgt.y - a.y, tgt.x - a.x), arc: 2, r: 24, dur: 0.18, col: W[1] }); } } }
  else if (L > 3) a.dir = dirFromVec(dx, dy);
  if (a.anim === 'atk' || a.anim === 'cast') { if (a.af < animN(a, a.anim) - 1) stepAnim(a, dt, 10); else setAnim(a, 'idle'); } else { setAnim(a, L > 4 ? 'walk' : 'idle', true); stepAnim(a, dt, L > 4 ? 9 : 2); }
  if (Math.random() < 0.03) part(a.x + (Math.random() - 0.5) * 12, a.y - Math.random() * 20, { vz: 20, g: -10, life: 0.6, c: HN_PW[a.h.pw][1], s: 1 }); }
V33_TICKS.push(dt => { if (!HUNT.allies.length) return; for (const a of HUNT.allies) if (!a.remove) huntUpdate(a, dt || 0); HUNT.allies = HUNT.allies.filter(a => !a.remove); huntBarsT(dt || 0); });
// los enemigos (y los jefes) también van a por los cazadores
let HUNT_AGGRO = null;
function huntHurt(a, base, lv) { if (!a || a.down) return; const d = Math.round(base * dmgRedP((G.P.S ? G.P.S.def : 50) * a.rf, lv || G.P.lv) * (0.9 + Math.random() * 0.2)); a.hp -= d; floatText(a.x, a.y - 36, d, '#ff8a8a'); a.flash = 0.1; if (a.hp <= 0) { a.hp = 0; a.down = true; a.downT = 15; setAnim(a, 'idle'); floatText(a.x, a.y - 44, L2('¡Caído!', 'Down!'), '#ff6a6a'); } }
{ const _hp = hurtPlayer; hurtPlayer = function (base, src) { if (HUNT_AGGRO) { huntHurt(HUNT_AGGRO, base, CUR_MOB && CUR_MOB.lv); return; } return _hp.apply(this, arguments); }; }
{ const _um = updateMob; updateMob = function (m, dt) { if (!HUNT.allies.length || !m || m.dying || m.ghost) return _um.apply(this, arguments);
    m.hgT = (m.hgT || 0) - dt; if (m.hgT <= 0) { m.hgT = m.boss ? 4 + Math.random() * 2 : 1.2; m.htg = null; const P = G.P, dp = dist2(m.x, m.y, P.x, P.y); const al = HUNT.allies.filter(a => !a.down && !a.remove && a.map === m.map);
      if (m.boss) { if (al.length && Math.random() < al.length / (al.length + 1.3)) m.htg = pick(al); } else for (const a of al) { const d = dist2(m.x, m.y, a.x, a.y); if (d < dp && d < 140 * 140) { m.htg = a; break; } } }
    if (m.htg && (m.htg.down || m.htg.remove)) m.htg = null;
    if (m.htg) { const RP = G.P; G.P = kidProxy(m.htg); HUNT_AGGRO = m.htg; try { return _um.apply(this, arguments); } finally { G.P = RP; HUNT_AGGRO = null; } }
    return _um.apply(this, arguments); }; }
{ const _tg = telegraph; telegraph = function (o) { const m = CUR_MOB; if (m && o && typeof o.cb === 'function' && HUNT.allies.length) { const cb = o.cb, f0 = Object.assign({ type: 'tele' }, o); o.cb = f => { const r = cb(f); for (const a of HUNT.allies) if (!a.down && !a.remove && teleHas(Object.assign(f0, f || {}, { type: 'tele' }), a.x, a.y, 4)) huntHurt(a, m.atk * 1.4, m.lv); return r; }; } return _tg(o); }; }
// barra de vida del equipo (como en el online)
function huntBars() { let d = $('#huntBars'); if (!HUNT.allies.length) { if (d) d.remove(); return; } if (!d) { d = document.createElement('div'); d.id = 'huntBars'; d.style.cssText = 'position:absolute;left:max(.6em,env(safe-area-inset-left,0px));top:calc(14.2em + env(safe-area-inset-top,0px));z-index:6;display:flex;flex-direction:column;gap:.25em;pointer-events:none;font-size:.78em'; document.getElementById('hud').appendChild(d); }
  d.innerHTML = HUNT.allies.map(a => `<div style="background:rgba(10,6,12,.7);border:1px solid ${HN_RK[hnRank(a.h)][2]};border-radius:5px;padding:.15em .4em;min-width:10em;color:#f1e7d3"><b style="color:${HN_RK[hnRank(a.h)][2]}">${esc(a.h.name)}</b> <small>${esc(CLASSES[a.h.cls].n)} · ${HN_PW[a.h.pw][0]}</small><div style="height:5px;background:#2a1a1a;border-radius:3px;margin-top:2px"><i style="display:block;height:100%;width:${a.down ? 0 : Math.round(100 * a.hp / a.maxhp)}%;background:${a.down ? '#555' : '#4ad04a'};border-radius:3px"></i></div></div>`).join(''); }
let hbT = 0; function huntBarsT(dt) { hbT += dt; if (hbT > 0.3) { hbT = 0; huntBars(); } }
WORLD_DRAW.push((cx, cy) => { for (const a of HUNT.allies) { if (a.remove || a.map !== G.P.map) continue; const x = Math.round(a.x - cx), y = Math.round(a.y - cy - 44); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - 12, y, 24, 3); ctx.fillStyle = a.down ? '#666' : '#4ad04a'; ctx.fillRect(x - 12, y, Math.round(24 * (a.down ? 0 : a.hp / a.maxhp)), 3); if (a.down) { ctx.fillStyle = '#ffffff'; ctx.font = '8px monospace'; ctx.fillText('z', x + 8, y - 2); } } });

// =====================================================================================
// LA TORRE DE LOS PORTALES (sala blanca enorme)
// =====================================================================================
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = C;
  if (kind === 'tp_portal') { const p = new Pix(40, 52), S = pal(['#5a5a6a', '#9a9aae', '#d8d8e8', '#ffffff']); p.rect(2, 4, 6, 46, S[1]); p.rect(32, 4, 6, 46, S[1]); p.rect(2, 2, 36, 6, S[2]); p.hl(2, 2, 36, S[3]); p.ell(20, 28, 12, 20, D('#1a0a3a')); p.ell(20, 28, 9, 16, D('#3a1a8a')); p.ell(20, 28, 5, 10, D('#8a5aff')); p.outline(D('#2a2a3a')); return { c: p.canvas(), ax: 20, ay: 51, light: 1 }; }
  if (kind === 'tp_cristal') { const p = new Pix(24, 40), A = pal(['#2a6ab0', '#4aa0f0', '#9ad8ff', '#ffffff']); p.rect(4, 32, 16, 7, D('#d8d8e8')); p.hl(4, 32, 16, D('#ffffff')); p.poly([[12, 1], [20, 14], [12, 31], [4, 14]], A[1]); p.poly([[12, 1], [15, 14], [12, 28]], A[2]); p.set(10, 8, A[3]); p.outline(D('#1a2a4a')); return { c: p.canvas(), ax: 12, ay: 39, light: 1 }; }
  if (kind === 'tp_pantalla') { const p = new Pix(44, 34); p.rect(2, 2, 40, 24, D('#1a1a24')); p.rect(4, 4, 36, 20, D('#2a4a8a')); for (let k = 0; k < 4; k++) p.hl(6, 7 + k * 4, 14 + (k * 7) % 18, D(['#8af0ff', '#ffd040', '#ff8a8a', '#8aff8a'][k])); p.rect(20, 26, 4, 7, D('#5a5a6a')); p.outline(D('#0a0a12')); return { c: p.canvas(), ax: 22, ay: 33 }; }
  if (kind === 'tp_mostrador') { const p = new Pix(64, 24); p.rect(0, 6, 64, 16, D('#e8e8f4')); p.hl(0, 6, 64, D('#ffffff')); p.rect(0, 18, 64, 4, D('#2a4a8a')); p.rect(26, 2, 12, 5, D('#8ab0e8')); p.outline(D('#3a3a50')); return { c: p.canvas(), ax: 32, ay: 23 }; }
  if (kind === 'tp_ranking') { const p = new Pix(36, 40); p.rect(2, 2, 32, 30, D('#1a1a2a')); for (let k = 0; k < 6; k++) { p.rect(5, 5 + k * 4, 4, 3, D(HN_RK[5 - k][2])); p.hl(11, 6 + k * 4, 18 - k * 2, D('#e0e0f0')); } p.rect(16, 32, 4, 7, D('#5a5a6a')); p.outline(D('#0a0a12')); return { c: p.canvas(), ax: 18, ay: 39 }; }
  return _ge.apply(this, arguments); }; }
NPCS.selene = { n: L2('Selene', 'Selene'), title: L2('Recepcionista de la Torre', 'Tower Receptionist'), look: LK({ hair: HAIRS.negro, hairStyle: 'long', outfit: 'dress', main: P5(['#0a1a4a', '#1a3a8a', '#2a5ac8', '#5a8ae8', '#9ac0ff']), sec: P5(['#c8c8d8', '#e0e0ec', '#f0f0f8', '#ffffff', '#ffffff']) }), lines: [L2('Bienvenido a la Torre de los Portales. ¿Midió ya su poder?', 'Welcome to the Portal Tower. Have you measured your power yet?'), L2('Los portales cambian cada día. Elija uno de su nivel.', 'Portals change every day. Choose one at your level.')] };
NPCS.tp_tendero = { n: L2('Bram', 'Bram'), title: L2('Tienda del Portal', 'Portal Shop'), look: LK({ hair: HAIRS.blanco, outfit: 'apron', main: CLOTH.gris, sec: CLOTH.azul, body: 'big' }), lines: [L2('Esencias de portal a cambio de cosas buenas. Así funciona.', 'Portal essences in exchange for good things. That\'s how it works.')] };
function makeTower() { if (G.maps.torre_portales) return G.maps.torre_portales; const w = 48, h = 32, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'torre_portales', w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, tower: 1 };
  for (let x = 0; x < w; x++) { M.ter[x] = T.IWALL; M.ter[w + x] = T.IWALL; M.ter[(h - 1) * w + x] = T.IWALL; } for (let y = 0; y < h; y++) { M.ter[y * w] = T.IWALL; M.ter[y * w + w - 1] = T.IWALL; }
  const ex = w >> 1; M.ter[(h - 1) * w + ex] = T.FLOOR; M.exit = { x: ex, y: h - 1 };
  prepPalettes(M); initMapObjs(M); const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  F('tp_mostrador', ex, 8, [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]], { xact: 'tp_rec' }); F('tp_cristal', ex - 8, 12, null, { xact: 'tp_test' }); F('tp_ranking', ex + 8, 12, null, { xact: 'tp_rank' });
  DG.forEach((D, i) => F('tp_portal', 6 + i * 5, 4, [[0, 0], [-1, 0], [1, 0]], { xact: 'tp_portal', dgi: i }));
  for (const [x, y] of [[6, 20], [ex, 20], [w - 7, 20]]) F('tp_pantalla', x, y, [[0, 0], [-1, 0], [1, 0]], { xact: 'tp_watch' });
  F('counter', w - 8, 26, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); for (const [x, y] of [[3, 3], [w - 4, 3], [3, h - 4], [w - 4, h - 4], [12, 26], [36, 14]]) F('plant', x, y);
  for (const [x, y] of [[10, 16], [16, 16], [30, 16], [36, 16], [10, 24], [36, 24]]) addObj(M, 'bench', x, y);
  spawnNPC('selene', ex * 16 + 8, 7 * 16 + 8, 'torre_portales', { face: 'down' }); spawnNPC('tp_tendero', (w - 8) * 16 + 8, 25 * 16 + 8, 'torre_portales', { face: 'down' });
  const R = new RNG(SEED + 77); for (const h_ of HN) { let x, y, t = 0; do { x = R.int(3, w - 4); y = R.int(10, h - 4); t++; } while (t < 40 && M.objAt[I(x, y)] >= 0); const e = spawnNPC(h_.id, x * 16 + 8, y * 16 + 8, 'torre_portales', { wander: 3, face: pick(['down', 'left', 'right', 'up']) }); if (e) e.hn = h_; }
  G.maps.torre_portales = M; return M; }
// suelo de mármol blanco y torbellino de los portales
{ const _bdf = bldDrawFloors; bldDrawFloors = function (M, cx, cy) { _bdf.apply(this, arguments); if (!M || !M.tower) return; for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) { const sx = x * 16 - cx, sy = y * 16 - cy; if (sx < -16 || sy < -16 || sx > VW || sy > VH) continue; ctx.fillStyle = (x + y) % 2 ? '#f4f4fa' : '#e6e6f0'; ctx.fillRect(sx, sy, 16, 16); ctx.fillStyle = 'rgba(160,170,200,.25)'; ctx.fillRect(sx, sy + 15, 16, 1); if ((x * 7 + y * 3) % 11 === 0) { ctx.fillStyle = 'rgba(180,180,210,.35)'; ctx.fillRect(sx + 3, sy + 5, 6, 1); } } }; }
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || !M.tower) return; for (const o of M.objs) { if (o.xact !== 'tp_portal' || o.hidden) continue; const x = o.px - cx, y = o.py - cy - 23; for (let k = 0; k < 6; k++) { const a = G.t * 2 + k * 1.05, r = 4 + k * 1.5; ctx.fillStyle = ['#c8a0ff', '#8a5aff', '#ffffff', '#5a3aff', '#e0d0ff', '#a07aff'][k]; ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 1.6), 2, 2); } const D = DG[o.dgi]; if (D) { ctx.fillStyle = dgUnlocked(D) ? '#ffffff' : '#8a8a9a'; ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.fillText(L2('Nv.', 'Lv.') + D[2], x, y - 26); ctx.textAlign = 'left'; } }
  for (const e of G.ents) if (e.hn && e.map === 'torre_portales' && !e.hidden && Math.random() < 0.04) part(e.x + (Math.random() - 0.5) * 10, e.y - Math.random() * 22, { vz: 14, g: -8, life: 0.7, c: HN_PW[e.hn.pw][1], s: 1 }); });
XACT.tp_rec = [L2('Hablar con Selene', 'Talk to Selene'), 'talk', () => tpRecepcion()];
XACT.tp_test = [L2('Medir tu poder', 'Measure your power'), 'star', () => tpTest()];
XACT.tp_rank = [L2('Ranking de cazadores', 'Hunter ranking'), 'board', () => tpRanking()];
XACT.tp_portal = [o => { const D = DG[o.dgi]; return D ? D[3] + ' · ' + L2('Nv. ', 'Lv. ') + D[2] : ''; }, 'run', o => tpPortal(DG[o.dgi])];
XACT.tp_watch = [L2('Ver retransmisiones', 'Watch broadcasts'), 'board', () => tpWatch()];
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'selene') opts.unshift({ label: L2('Recepción', 'Reception'), icon: ['star', '#ffd040'], fn: () => { closeDialog(); tpRecepcion(); } });
  if (npc.id === 'tp_tendero') opts.unshift({ label: L2('Tienda del Portal', 'Portal Shop'), icon: ['crystal', '#c8a0ff'], fn: () => { closeDialog(); tpShop(); } });
  if (npc.hn) opts.unshift({ label: L2('Invitar a tu equipo de portales', 'Invite to your portal team'), icon: ['users'], fn: () => { closeDialog(); tpInvite(npc.hn); } }); });
function tpGo() { const P = G.P; if (G.map && G.map.tower) return; P.tpRet = { m: G.map.id, x: P.x, y: P.y, inside: P.inside }; const M = makeTower(); transition(() => { setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner(L2('Torre de los Portales', 'Portal Tower'), L2('Centro de cazadores', 'Hunters\' hub')); }); }
{ const _ei = exitInterior; exitInterior = function () { const M = G.map, P = G.P; if (M && M.tower) { const R = P.tpRet || { m: 'world', x: G.world.w * 8, y: G.world.h * 8 }; P.tpRet = null; transition(() => { const T_ = R.m === 'world' ? G.world : (G.maps[R.m] || G.world); P.inside = R.inside || null; setMap(T_, R.x, R.y, 'down'); }); return; } return _ei.apply(this, arguments); }; }
function tpRecepcion() { const P = G.P, H = hunt(), rk = H.rank || 0;
  openModal(`<h2>🏛 ${L2('Recepción de la Torre', 'Tower Reception')}</h2><p><b>Selene:</b> «${L2('Su rango actual es ', 'Your current rank is ')}<b style="color:${HN_RK[rk][2]}">${esc(rkName(rk))}</b>${H.score ? ' (' + fmt(H.score) + ' ' + L2('de poder', 'power') + ')' : ''}. ${L2('Puede entrar solo o con un equipo de 4: tres cazadores le acompañarán.', 'You can go in alone or with a team of 4: three hunters will go with you.')}»</p>
    <div class="slist">${DG.map((D, i) => `<div class="srow"><div class="sn"><b>${esc(D[3])}</b><small>${L2('Nivel ', 'Level ')}${D[2]} · ${{ world: L2('Mundo principal', 'Main world'), cielo: L2('Islas del Cielo', 'Sky Isles'), archipielago: L2('Archipiélago', 'Archipelago'), velo_roto: L2('Velo Roto', 'Broken Veil') }[D[1]]} · ${L2('cerrada', 'cleared')} ${(H.cleared[D[0]] || 0) + (H.cleared[D[0] + '_eq'] || 0)}</small></div><button class="btn sm" data-tps="${i}" ${dgUnlocked(D) ? '' : 'disabled'}>${L2('Solo', 'Solo')}</button><button class="btn gold sm" data-tpe="${i}" ${dgUnlocked(D) ? '' : 'disabled'}>${L2('Equipo', 'Team')}</button></div>`).join('')}</div>
    <p class="hint">${L2('Tu equipo: ', 'Your team: ')}${huntPick().map(h => `<b style="color:${HN_RK[hnRank(h)][2]}">${esc(h.name)}</b> (${esc(CLASSES[h.cls].n)}, ${HN_PW[h.pw][0]})`).join(', ')}. ${L2('Habla con un cazador para invitarle.', 'Talk to a hunter to invite them.')}</p><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; $$('#modal [data-tps]').forEach(b => b.onclick = () => { closeModal(); dgEnter(DG[+b.dataset.tps], false); }); $$('#modal [data-tpe]').forEach(b => b.onclick = () => { closeModal(); dgEnter(DG[+b.dataset.tpe], true); }); }
function tpPortal(D) { if (!D) return; openModal(`<h2>🌀 ${esc(D[3])}</h2><p class="hint">${L2('Nivel ', 'Level ')}${D[2]}. ${L2('Enemigos: ', 'Enemies: ')}${D[4].map(m => esc(MOBS[m].n)).join(', ')}. ${L2('Jefe: ', 'Boss: ')}${esc(BOSSES[D[5]].n)}.</p><div class="row"><button class="btn" id="tpS" ${dgUnlocked(D) ? '' : 'disabled'}>${L2('Entrar solo', 'Enter solo')}</button><button class="btn gold" id="tpE" ${dgUnlocked(D) ? '' : 'disabled'}>${L2('Entrar en equipo de 4', 'Enter as a team of 4')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; const s = $('#tpS'), e = $('#tpE'); if (s) s.onclick = () => { closeModal(); dgEnter(D, false); }; if (e) e.onclick = () => { closeModal(); dgEnter(D, true); }; }
function tpInvite(h) { const H = hunt(); H.team = (H.team || []).filter(i => i !== h.i); H.team.unshift(h.i); H.team = H.team.slice(0, 3); markDirty(); toast(h.name + ' (' + rkName(hnRank(h)) + L2(') se une a tu equipo de portales.', ') joins your portal team.'), 'quest'); }
function tpPower() { const S = G.P.S || {}; return Math.round((S.atk || 0) + (S.def || 0) * 1.5 + (S.maxhp || 0) * 0.15); }
function tpTest() { const sc = tpPower(), H = hunt(); let rk = 0; for (let i = 0; i < HN_RKSC.length; i++) if (sc >= HN_RKSC[i]) rk = i; let t = 0;
  openModal(`<h2>💎 ${L2('Medidor de poder', 'Power meter')}</h2><p class="hint">${L2('Pon la mano sobre el cristal…', 'Put your hand on the crystal…')}</p><div style="height:22px;background:#1a1a2a;border-radius:6px;overflow:hidden;margin:.6em 0"><i id="tpBar" style="display:block;height:100%;width:0;background:linear-gradient(90deg,#4aa0f0,#c8a0ff)"></i></div><p id="tpRes" class="hint" style="text-align:center;font-size:1.2em"></p><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; const iv = setInterval(() => { const b = $('#tpBar'); if (!b) { clearInterval(iv); return; } t += 0.05; b.style.width = Math.min(100, t * 100 * Math.min(1, sc / HN_RKSC[5])) + '%'; if (t >= 1) { clearInterval(iv); const was = H.rank || 0; H.rank = rk; H.score = sc; $('#tpRes').innerHTML = `${fmt(sc)} ${L2('de poder', 'power')} · ${L2('Rango ', 'Rank ')}<b style="color:${HN_RK[rk][2]}">${esc(rkName(rk))}</b>`; sfx(rk > was ? 'level' : 'quest'); if (rk > was) { banner(L2('¡Nuevo rango!', 'New rank!'), rkName(rk)); hnLog(G.P.name + L2(' alcanzó el rango ', ' reached rank ') + rkName(rk) + '.'); } markDirty(true); } }, 60); }
function tpRanking() { const H = hunt(), list = HN.map(h => ({ n: h.name, lv: hnLv(h), rk: hnRank(h), c: h.cls, pw: h.pw })).concat([{ n: G.P.name + ' (' + L2('tú', 'you') + ')', lv: G.P.lv, rk: H.rank || 0, c: G.P.cls, pw: null, me: 1 }]).sort((a, b) => b.lv - a.lv);
  openModal(`<h2>🏆 ${L2('Ranking de cazadores', 'Hunter ranking')}</h2><div class="pvBody">${list.map((x, i) => `<div class="news ${x.me ? 'good' : ''}"><b>${i + 1}.</b> <b style="color:${HN_RK[x.rk][2]}">[${esc(rkName(x.rk))}]</b> ${esc(x.n)} · ${esc(CLASSES[x.c].n)}${x.pw ? ' · ' + HN_PW[x.pw][0] : ''} · ${L2('Nv. ', 'Lv. ')}${x.lv}</div>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal'); $('#mclose').onclick = closeModal; }
// ---------- tienda del portal (se amplía con los cosméticos de la 4.42) ----------
const TP_SHOP = [['elixir', 8], ['pocion4', 3], ['eter4', 3], ['diamante', 6], ['hierba_sueno', 4]];
function tpShop() { const P = G.P; openModal(`<h2>🛒 ${L2('Tienda del Portal', 'Portal Shop')}</h2><p class="hint">${L2('Esencias de portal', 'Portal essences')}: ${countItem('esencia_portal')}</p><div class="slist">${TP_SHOP.filter(([id]) => ITEMS[id]).map(([id, c]) => `<div class="srow">${iconHTML(ITEMS[id].icon, 28)}<div class="sn"><b style="color:${typeof RARC !== 'undefined' ? RARC[ITEMS[id].rar || 0] : '#fff'}">${esc(ITEMS[id].n)}</b></div><button class="btn sm" data-tb="${id}" ${countItem('esencia_portal') >= c ? '' : 'disabled'}>${c} ✦</button></div>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; $$('#modal [data-tb]').forEach(b => b.onclick = () => { const [id, c] = TP_SHOP.find(x => x[0] === b.dataset.tb); if (countItem('esencia_portal') < c) return; if (giveItem(id, 1)) { takeItem('esencia_portal', c); sfx('coin'); } tpShop(); }); }

// =====================================================================================
// LOS CAZADORES VIVEN: entran solos en portales, suben de nivel y puedes ver sus combates en directo
// =====================================================================================
const HN_RUNS = [];
function hnBusy(h) { return HN_RUNS.some(r => r.h === h); }
function hnLog(t) { const H = hunt(); H.log.unshift([calDay(), t]); H.log = H.log.slice(0, 30); }
function hnStartRun() { const free = HN.filter(h => !hnBusy(h) && !(hunt().team || []).includes(h.i)); if (!free.length || HN_RUNS.length >= 4) return; const h = pick(free), L = hnLv(h), opts = DG.filter(D => D[2] <= L + 15); const D = opts.length ? opts[opts.length - 1 - Math.floor(Math.random() * Math.min(2, opts.length))] : DG[0];
  HN_RUNS.push({ h, D, t: 0, dur: 50 + Math.random() * 60, ok: Math.random() < clamp(0.55 + (L - D[2]) / 80, 0.15, 0.95), ev: [L2('Entra en ', 'Enters ') + D[3]] }); const e = G.ents.find(q => q.hn === h); if (e) e.hidden = true; }
const HN_EV = [L2('esquiva un golpe por los pelos', 'dodges a hit by a hair'), L2('usa su poder: ¡los enemigos salen volando!', 'uses their power: enemies go flying!'), L2('encuentra un cofre escondido', 'finds a hidden chest'), L2('se cura y sigue adelante', 'heals and keeps going'), L2('llega a la sala del jefe', 'reaches the boss room'), L2('derrota a un grupo de enemigos', 'defeats a group of enemies')];
let hnT = 0; V33_TICKS.push(dt => { if (!G.P || titleMode) return; hnT += dt || 0; if (hnT < 1) return; hnT = 0;
  if (Math.random() < 0.03) hnStartRun();
  for (const r of HN_RUNS.slice()) { r.t += 1; if (Math.random() < 0.12) r.ev.push(r.h.name + ' ' + pick(HN_EV)); if (r.t < r.dur) continue; HN_RUNS.splice(HN_RUNS.indexOf(r), 1); const s = hnState(r.h), e = G.ents.find(q => q.hn === r.h); if (e) e.hidden = false;
    if (r.ok) { s.xp = (s.xp || 0) + 1; if (s.xp >= 2 && s.lv < MAXLV) { s.xp = 0; const before = hnRankOfLv(s.lv); s.lv = Math.min(MAXLV, s.lv + 1 + Math.floor(Math.random() * 3)); if (hnRankOfLv(s.lv) > before) hnLog(r.h.name + L2(' sube al rango ', ' rises to rank ') + rkName(hnRankOfLv(s.lv)) + '!'); } hnLog(r.h.name + L2(' cerró ', ' closed ') + r.D[3] + '.'); }
    else hnLog(r.h.name + L2(' tuvo que huir de ', ' had to flee from ') + r.D[3] + '.'); } if (G.map && G.map.tower && !$('#modal').hidden && $('#tpWatch')) tpWatch(); });
function tpWatch() { const H = hunt(); openModal(`<div id="tpWatch"><h2>📺 ${L2('Retransmisiones en directo', 'Live broadcasts')}</h2>${HN_RUNS.length ? HN_RUNS.map(r => `<div class="srow"><div class="sn"><b style="color:${HN_RK[hnRank(r.h)][2]}">${esc(r.h.name)}</b> <small>${esc(CLASSES[r.h.cls].n)} · ${HN_PW[r.h.pw][0]} · ${L2('Nv. ', 'Lv. ')}${hnLv(r.h)}</small><small>${esc(r.D[3])}</small><i class="dbar"><b style="width:${Math.round(100 * r.t / r.dur)}%"></b></i><small>${esc(r.ev.slice(-2).join(' · '))}</small></div></div>`).join('') : `<p class="hint">${L2('Ahora mismo nadie está dentro de un portal. Vuelve en un rato.', 'Nobody is inside a portal right now. Come back in a bit.')}</p>`}
    <h3>${L2('Últimas noticias', 'Latest news')}</h3><div class="pvBody" style="max-height:24vh">${H.log.map(([d, t]) => `<div class="news">${esc(t)}</div>`).join('') || `<p class="hint">—</p>`}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div></div>`, 'party pvmodal'); $('#mclose').onclick = closeModal; }

// =====================================================================================
// BOTÓN ⛩ MAZMORRAS (desde nivel 50): las del mundo en el que estás y la Torre
// =====================================================================================
function dgBtn() { const tr = $('#tr .trbtns'), P = G.P; if (!tr || !P) return; let b = $('#dgBtn'); if (!b) { b = document.createElement('button'); b.id = 'dgBtn'; b.className = 'mini'; b.title = L2('Mazmorras', 'Dungeons'); b.textContent = '⛩'; b.style.fontSize = '1.25em'; b.onclick = () => dgOpen(); tr.insertBefore(b, tr.firstChild); } b.hidden = P.lv < 50; }
let dgbT = 0; V33_TICKS.push(dt => { dgbT += dt || 0; if (dgbT < 1) return; dgbT = 0; if (G.P && !titleMode) dgBtn(); });
function dgWorld() { const M = G.map; if (!M) return 'world'; if (M.isWorld) return 'world'; if (['cielo', 'archipielago', 'velo_roto'].includes(M.id)) return M.id; if (M.tower && G.P.tpRet) return G.P.tpRet.m; return 'world'; }
function dgOpen() { const w = dgWorld(), list = DG.filter(D => D[1] === w), H = hunt(), inDg = G.map && CAVES[G.map.id] && CAVES[G.map.id].dg;
  openModal(`<h2>⛩ ${L2('Mazmorras', 'Dungeons')}</h2><p class="hint">${L2('Portales de este mundo. Se desbloquean 10 niveles antes de su nivel. En la Torre de los Portales están todas, los cazadores y tu rango.', 'Portals of this world. They unlock 10 levels before their level. The Portal Tower has all of them, the hunters and your rank.')}</p>
    <div class="slist">${(list.length ? list : DG.filter(D => D[1] === 'world')).map(D => { const i = DG.indexOf(D); return `<div class="srow"><div class="sn"><b>${esc(D[3])}</b><small>${L2('Nivel ', 'Level ')}${D[2]} · ${L2('Jefe: ', 'Boss: ')}${esc(BOSSES[D[5]].n)}</small></div><button class="btn sm" data-dgs="${i}" ${dgUnlocked(D) && !inDg ? '' : 'disabled'}>${L2('Solo', 'Solo')}</button><button class="btn gold sm" data-dge="${i}" ${dgUnlocked(D) && !inDg ? '' : 'disabled'}>${L2('Equipo', 'Team')}</button></div>`; }).join('')}</div>
    <div class="row">${inDg ? `<button class="btn" id="dgOut">${L2('Salir de la mazmorra', 'Leave the dungeon')}</button>` : `<button class="btn gold" id="dgTower">🏛 ${L2('Ir a la Torre de los Portales', 'Go to the Portal Tower')}</button>`}<button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; const t = $('#dgTower'); if (t) t.onclick = () => { closeModal(); tpGo(); }; const o = $('#dgOut'); if (o) o.onclick = () => { closeModal(); dgLeave(); };
  $$('#modal [data-dgs]').forEach(b => b.onclick = () => { closeModal(); dgEnter(DG[+b.dataset.dgs], false); }); $$('#modal [data-dge]').forEach(b => b.onclick = () => { closeModal(); dgEnter(DG[+b.dataset.dge], true); }); }
// la lupa lo explica
if (typeof GSIS !== 'undefined') GSIS.push(['portales', '⛩ ' + L2('Torre de los Portales y mazmorras', 'Portal Tower and dungeons'), () => [L2('Desde nivel 50 aparece el botón ⛩ arriba: mazmorras del mundo en el que estás (nivel 50, 100, 150, 250 y 340 en el mundo principal; también en el cielo, el archipiélago y el Velo Roto) y la Torre de los Portales.', 'From level 50 the ⛩ button appears at the top: dungeons of the world you are in (level 50, 100, 150, 250 and 340 in the main world; also in the sky, archipelago and Broken Veil) and the Portal Tower.'), L2('En la Torre: Selene (recepción), el cristal que mide tu poder y te da rango (Cobre, Hierro, Plata, Oro, Platino, Astral), el ranking, las pantallas para ver a los cazadores en directo y la tienda de esencias.', 'In the Tower: Selene (reception), the crystal that measures your power and gives you a rank (Copper, Iron, Silver, Gold, Platinum, Astral), the ranking, the screens to watch hunters live and the essence shop.'), L2('Mazmorra de equipo: vas con 3 cazadores (invítalos hablando con ellos). Luchan con sus poderes y los enemigos van a por todos; arriba a la izquierda ves su vida.', 'Team dungeon: you go with 3 hunters (invite them by talking to them). They fight with their powers and enemies go for everyone; their HP is shown at the top left.')], () => null]);
// guardar dentro de la Torre o de una mazmorra te deja donde entraste
{ const _sp = serializeP; serializeP = function (P) { const o = _sp.apply(this, arguments); const R = (P.map === 'torre_portales' && P.tpRet) || (CAVES[P.map] && CAVES[P.map].dg && P.dgRet); if (R && R.m === 'world' && isFinite(R.x)) { o.x = R.x; o.y = R.y; } return o; }; }
