// 6.17 · Arco de Loguetown (Sergio: «Smoker trata de atrapar a Luffy… la tripulación en la ciudad… Zoro en la tienda de
// espadas con Ipponmatsu y Tashigi… primero luchamos el jugador y Luffy contra Smoker… Smoker atrapa a Luffy y lo sube donde
// estaba Roger, también Buggy… toda la tripulación aguanta 2 minutos a la Marina en la plaza… gente viendo la ejecución…
// un rayo y por un segundo vemos a Dragon… gente, pescadores, movimiento… el arco se puede repetir siempre»).
// - Ciudad viva: vecinos, pescadores, vendedores y piratas (dibujados con el motor); la tripulación pasea por las tiendas.
// - Armería de Ipponmatsu por dentro (mapa 'logue_armeria'): Ipponmatsu, Zoro y Tashigi con su escena.
// - Arco repetible: hablar con Luffy en la plaza (o con Smoker) → pelea con Smoker (tú + Luffy) → Smoker atrapa a Luffy y lo
//   sube al patíbulo con Buggy → la tripulación aguanta 2 minutos a la Marina → rayo y Dragon → Luffy libre.

// ---------- personajes con hoja propia que no caminan (Tashigi habla con gestos) ----------
function logueTalkAtlas(id) {
  const im = LOGUE_SHEETS[id], cw = LOGUE_CELL.w, ch = LOGUE_CELL.h;
  if (!im || !im.naturalWidth) return null;
  return getAtlas('logue_talk_' + id, () => {
    const order = [0, 1, 0, 2];
    const a = dawnPixelAtlas(cw / 2, ch / 2, { idle: 0, walk: 0, hurt: 0, dead: 0 }, 4, (g, c, r) => g.drawImage(im, order[c] * cw, r * ch, cw, ch, 0, 0, cw, ch));
    a.frames = { idle: 4, walk: 4, hurt: 1, dead: 1 }; return a;
  });
}
const LOGUE_CREW = [
  // [id propio, id del motor, nombre, condición, sitio, deambula, frase es, frase en]
  ['logue_c_luffy', SHELLS_CAST_IDS.luffy, 'Luffy', P => !!(P.bossKills || {})[MORGAN_ID], [104, 120], 2, '¡Así que aquí murió el Rey de los Piratas! Quiero ver la ciudad desde arriba de eso.', 'So this is where the Pirate King died! I want to see the town from up there.'],
  ['logue_c_nami', ORANGE_NAMI, 'Nami', P => !!P.dawnCrewJoined, [133, 166], 4, 'Ropa nueva, mapas nuevos… y alguien va a pagar todo esto, ¿verdad?', 'New clothes, new charts… and someone is paying for all this, right?'],
  ['logue_c_usopp', SYRUP_USOPP, 'Usopp', P => !!P.syrupUsopp, [118, 180], 6, 'Esta tienda tiene pólvora, aquella tiene gomas para mi tirachinas… ¡necesito ver todas!', 'This shop has gunpowder, that one has rubber for my slingshot… I need to see them all!'],
  ['logue_c_sanji', BAR_SANJI, 'Sanji', P => !!P.baratieSanji, [126, 205], 4, 'Pescado fresco del puerto. Esta noche el Merry come como un restaurante.', 'Fresh fish from the harbor. Tonight the Merry eats like a restaurant.']
];
for (const [id, base, n, , , , es, en] of LOGUE_CREW) NPCS[id] = { n, title: L2('Tripulación · Loguetown', 'Crew · Loguetown'), look: LK({}), quests: [], lines: [L2(es, en)], atlas: () => npcAtlas(base) };
NPCS.logue_zoro = { n: 'Zoro', title: L2('Armería de Ipponmatsu', 'Ipponmatsu’s arms shop'), look: LK({}), quests: [], lines: [L2('Solo me quedan cien mil berries. Me basta con dos espadas que no se rompan.', 'I only have a hundred thousand berries left. Two swords that won’t break will do.')], atlas: () => npcAtlas(SHELLS_CAST_IDS.zoro) };
NPCS.logue_tashigi = { n: 'Tashigi', title: L2('Sargento de la Marina', 'Navy sergeant'), look: LK({}), quests: [], lines: [
  L2('Perdón, ¿te he pisado? Sin mis gafas no distingo a nadie.', 'Sorry, did I step on you? Without my glasses I can’t tell anyone apart.'),
  L2('Ese espadachín lleva una espada de grado superior. No quiero que las espadas famosas acaben en manos de criminales.', 'That swordsman carries a top-grade sword. I don’t want famous swords to end up in criminals’ hands.'),
  L2('El capitán Smoker vigila la ciudad. Si hay piratas aquí, no saldrán por el puerto.', 'Captain Smoker is watching the town. If there are pirates here, they won’t leave through the harbor.')], atlas: () => logueTalkAtlas('tashigi') || npcAtlas('dawn_marine_spy') };
NPCS.logue_ippon = { n: 'Ipponmatsu', title: L2('Armería de Ipponmatsu', 'Ipponmatsu’s arms shop'), look: LK({}), quests: [], lines: [
  L2('¡Bienvenido! Espadas, sables y armaduras. Lo del barril es barato… por algo será.', 'Welcome! Swords, sabres and armour. The barrel ones are cheap… for a reason.'),
  L2('Ese chico lanzó la Kitetsu al aire y la espada no quiso cortarle. Nunca vi nada igual.', 'That boy threw the Kitetsu in the air and the sword refused to cut him. I’d never seen anything like it.')], atlas: () => logueActorAtlas('merchant') };
NPCS.logue_buggy = { n: 'Buggy', title: L2('Capitán pirata', 'Pirate captain'), look: LK({}), quests: [], lines: [L2('¡Jajaja! ¡Hoy la plaza es mía!', 'Hahaha! Today the square is mine!')], atlas: () => mobAtlasFor(BOSSES[ORANGE_BUGGY].art) };
NPCS.logue_dragon = { n: '???', title: '', look: LK({}), quests: [], lines: [''], atlas: () => logueActorAtlas('dragon') };
NPCS.logue_smoker_s = { n: 'Smoker', title: L2('Capitán de la Marina', 'Navy captain'), look: LK({}), quests: [], lines: [''], atlas: () => logueActorAtlas('smoker') };

// ---------- vecinos: pescadores, vendedores, piratas y gente de la ciudad (motor) ----------
const LOGUE_TOWN = [
  // [id, nombre, apariencia, sitio, deambula, caña, es, en]
  ['logue_v_pesc1', L2('Pescador', 'Fisherman'), { g: 'm', hs: 1, hair: 'gris', top: [1, 'azul'], skin: 1 }, [101, 226], 0, 1, 'Los peces huyen cuando llegan barcos piratas. Hoy hay muchos.', 'The fish flee when pirate ships arrive. There are many today.'],
  ['logue_v_pesc2', L2('Pescadora', 'Fisherwoman'), { g: 'f', hs: 6, hair: 'castano', top: [1, 'verde'], skin: 0 }, [106, 229], 0, 1, 'Dicen que Smoker cerró el puerto. Ni los pescadores salimos sin permiso.', 'They say Smoker closed the harbor. Not even fishermen leave without leave.'],
  ['logue_v_pesc3', L2('Pescador', 'Fisherman'), { g: 'm', hs: 3, hair: 'negro', top: [1, 'marron'], skin: 2 }, [84, 212], 2, 1, 'Mi abuelo vio la ejecución de Roger desde ese muelle.', 'My grandfather watched Roger’s execution from that pier.'],
  ['logue_v_merc1', L2('Vendedora', 'Vendor'), { g: 'f', hs: 4, hair: 'rubio', top: [1, 'rojo'], skin: 0 }, [132, 160], 2, 0, '¡Fruta, telas y brújulas! Todo lo que un pirata necesita antes del Grand Line.', 'Fruit, cloth and compasses! Everything a pirate needs before the Grand Line.'],
  ['logue_v_merc2', L2('Vendedor', 'Vendor'), { g: 'm', hs: 2, hair: 'castano', top: [1, 'amarillo'], skin: 1 }, [124, 150], 2, 0, 'Los piratas pagan bien… cuando pagan.', 'Pirates pay well… when they pay.'],
  ['logue_v_civ1', L2('Vecina', 'Townswoman'), { g: 'f', hs: 7, hair: 'negro', top: [1, 'rosa'], skin: 1 }, [90, 140], 5, 0, 'Loguetown es la ciudad del principio y del fin. Muchos empiezan aquí su viaje.', 'Loguetown is the town of the beginning and the end. Many start their voyage here.'],
  ['logue_v_civ2', L2('Vecino', 'Townsman'), { g: 'm', hs: 5, hair: 'rojo', top: [1, 'turquesa'], skin: 0 }, [118, 138], 5, 0, 'Si ves humo blanco por la calle, corre: es el capitán Smoker.', 'If you see white smoke in the street, run: it’s Captain Smoker.'],
  ['logue_v_civ3', L2('Niño', 'Kid'), { g: 'm', hs: 1, hair: 'castano', top: [1, 'naranja'], skin: 1, bt: 1 }, [98, 132], 6, 0, '¡Cuando sea grande voy a ser pirata como Roger!', 'When I grow up I’m going to be a pirate like Roger!'],
  ['logue_v_civ4', L2('Anciana', 'Old woman'), { g: 'f', hs: 2, hair: 'blanco', top: [1, 'morado'], skin: 0 }, [70, 182], 3, 0, 'Yo estaba en la plaza aquel día. Roger sonreía.', 'I was in the square that day. Roger was smiling.'],
  ['logue_v_civ5', L2('Paseante', 'Passer-by'), { g: 'f', hs: 3, hair: 'azul', top: [1, 'beige'], skin: 2 }, [146, 120], 6, 0, 'La torre del reloj marca la hora de todas las ejecuciones.', 'The clock tower marks the hour of every execution.'],
  ['logue_v_pir1', L2('Pirata', 'Pirate'), { g: 'm', hs: 4, hair: 'negro', top: [1, 'negro'], bot: [0, 'rojo'], skin: 1 }, [112, 182], 4, 0, '¿Viste el cartel del Sombrero de Paja? ¡Treinta millones!', 'Did you see Straw Hat’s poster? Thirty million!'],
  ['logue_v_pir2', L2('Pirata', 'Pirate'), { g: 'm', hs: 6, hair: 'verde', top: [1, 'granate'], skin: 2 }, [94, 190], 4, 0, 'Todos los que quieren el One Piece pasan por aquí.', 'Everyone who wants the One Piece passes through here.'],
  ['logue_v_pir3', L2('Pirata', 'Pirate'), { g: 'f', hs: 5, hair: 'rosa', top: [1, 'marino'], skin: 0 }, [140, 186], 4, 0, 'La Marina está nerviosa hoy. Algo va a pasar en la plaza.', 'The Navy is jumpy today. Something is going to happen in the square.'],
  ['logue_v_guard', L2('Marine de guardia', 'Navy guard'), null, [146, 90], 2, 0, 'Base de la Marina. Circule.', 'Navy base. Move along.']
];
for (const [id, n, app, , , rod, es, en] of LOGUE_TOWN) {
  let look = null;
  if (app) { look = heroLook('guerrero', { ...DEF_APP, ...app }, {}, {}, {}); look.weapon = rod ? { k: 'rod', tier: 2 } : null; }
  NPCS[id] = { n, title: 'Loguetown', look: look || LK({}), quests: [], lines: [L2(es, en)], atlas: app ? undefined : () => getAtlas('MR:logue_guard', () => buildAtlas(mrLook('dawn_marine'), ['idle', 'walk'], drawHero)) };
}

// ---------- estado del arco ----------
SAVEKEYS.push('logueArcN', '_lgAshore');   // _lgAshore: quién te seguía antes del arco (se devuelve aunque guardes a mitad)
const LOGUE_ARC_LV = 612, LOGUE_HORDE_S = 120;
BOSSES.logue_arc_smoker = { n: 'Smoker', lv: LOGUE_ARC_LV, hp: 70, atk: 4.3, def: 3.85, spd: 88, r: 36, where: 'Loguetown', art: ['logue_actor', 'smoker'], moves: [], drops: [] };
if (typeof DAWN_RETO === 'object') DAWN_RETO.logue_arc_smoker = 1.95;
const logueCrewHas = P => LOGUE_CREW.filter(c => c[3](P));
const logueArcReady = P => !!(P && (P.bossKills || {})[MORGAN_ID]);
function logueSpot(x, y) { return dawnPx(logueAt(x, y)); }
function logueScaffoldPx() { const [x, y] = logueSpot(104, 111); return [x, y]; }
function logueArcClear(M) {
  const A = M && M.logueArc; if (!A) return;
  for (const e of [...A.cast, ...A.crew, ...A.foes]) if (e && !e.dying) e.remove = true;
  if (A.boss && G.bossBar === A.boss) showBoss(null);
  M.logueArc = null; logueTimerUi(null);
  const P = G.P; if (P && P._lgAshore) { P.dawnCrewAshore = P._lgAshore.v; P._lgAshore = null; }
}
function logueLife(M) {
  const S = M.logueLife; if (S) for (const e of S) if (e) e.remove = true;
  M.logueLife = null;
}
function logueLifeSpawn(M, P) {
  logueLife(M); const out = [];
  for (const [id, , , at, wander] of LOGUE_TOWN) out.push(spawnNPC(id, ...logueSpot(at[0], at[1]), M.id, { wander, hgt: 46, face: 'down' }));
  let follow = new Set(); try { const mask = dawnCrewMask(P); follow = new Set(DAWN_CREW.filter((c, i) => mask & (1 << i)).map(c => c[0])); } catch (e) { }
  for (const [id, base, , cond, at, wander] of LOGUE_CREW) if (cond(P) && !follow.has(base)) out.push(spawnNPC(id, ...logueSpot(at[0], at[1]), M.id, { wander, hgt: 60, face: id === 'logue_c_luffy' ? 'up' : 'down' }));
  M.logueLife = out;
}
function logueTimerUi(left) {
  let el = document.getElementById('logueTimer');
  if (left === null) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'logueTimer'; el.style.cssText = 'position:fixed;top:calc(3.2em + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:30;padding:.25em .9em;border-radius:.6em;background:rgba(18,16,28,.82);border:1px solid #e8c070;color:#f1e7d3;font-size:.95em;text-shadow:0 1px 0 #000;pointer-events:none'; document.body.appendChild(el); }
  const s = Math.max(0, Math.ceil(left));
  el.textContent = '⚓ ' + L2('Aguanta a la Marina', 'Hold off the Navy') + ' · ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
const logueSay = (e, es, en) => { if (e) shellsRescueSpeak(e, es, en); };
function logueActor(M, id, x, y, dir, o) { return spawnNPC(id, x, y, M.id, Object.assign({ face: dir || 'down', scene: true, noTalk: true, hgt: 62 }, o || {})); }
function logueAlly(M, P, id, x, y) {
  const e = logueActor(M, id, x, y, 'up'), a = syrupCrewStats(P, id, LOGUE_ARC_LV);
  Object.assign(e, { hp: a.hp, maxhp: a.hp, shellsDefense: a.def, lv: a.lv, syrupReach: a.reach, syrupBoost: a.boost, nextAssist: G.t + 0.8 });
  return e;
}
function logueArcStart() {
  const M = G.map, P = G.P;
  if (!M || !M.logue || M.logueArc || P.dead || P.dawnHelm || !logueArcReady(P)) return;
  if (P.lv < 600) { toast(L2('Necesitas nivel 600 para el arco de Loguetown.', 'You need level 600 for the Loguetown arc.'), 'info'); return; }
  transition(() => {
    const [px, py] = logueSpot(104, 132); P.x = px; P.y = py; P.dir = 'up'; updateCamera(0, true);
    if (M.logueLife) for (const e of M.logueLife) if (/^logue_c_/.test(e.id)) e.remove = true;
    P._lgAshore = { v: P.dawnCrewAshore }; P.dawnCrewAshore = 0;   // la tripulación que te sigue se esconde: el arco la coloca
    const luffy = logueAlly(M, P, SHELLS_CAST_IDS.luffy, px - 30, py);
    const smoker = logueActor(M, 'logue_smoker_s', px, py - 130, 'down', { hgt: 66 });
    M.logueArc = { owner: P, phase: 'meet', t: G.t, beat: 0, cast: [smoker], crew: [luffy], foes: [], luffy, smoker, boss: null };
    banner(L2('Arco de Loguetown', 'Loguetown arc'), L2('Smoker quiere atrapar a Luffy', 'Smoker wants to catch Luffy'));
  });
}
// ---------- golpes de Smoker: humo blanco en círculo y la porra en línea ----------
function logueSmokerStrike(A, m, mode, target) {
  const M = G.map, dx = target.x - m.x, dy = target.y - m.y, a = Math.atan2(dy, dx), dist = Math.hypot(dx, dy);
  const travel = mode === 'humo' ? 130 : 70, r = mode === 'humo' ? 58 : 30, t = mode === 'humo' ? 0.85 : 0.6;
  const x = m.x + Math.cos(a) * Math.min(travel, dist), y = m.y + Math.sin(a) * Math.min(travel, dist);
  m.dir = dirFromVec(dx, dy); setAnim(m, 'atk'); m.actionUntil = G.t + t + 0.3;
  telegraph({ shape: 'circle', x, y, r, dur: t, col: mode === 'humo' ? '#e8eef055' : '#c8d0d855' });
  addFx({ type: 'custom', x, y: y - 8, dur: t + 0.5, draw: (f, sx, sy, k) => {
    if (f.t < t) return; const q = (f.t - t) / 0.5;
    ctx.fillStyle = `rgba(240,244,246,${(0.75 * (1 - q)).toFixed(2)})`;
    for (let i = 0; i < 9; i++) { const an = i * 0.7 + q * 2, rr = r * (0.3 + q * 0.75) * (0.6 + (i % 3) * 0.2); ctx.beginPath(); ctx.arc(sx + Math.cos(an) * rr, sy + Math.sin(an) * rr * 0.6, 7 + q * 9, 0, 7); ctx.fill(); }
    if (!f.fired) { f.fired = true;
      if (!A || G.map.logueArc !== A || m.dying || m.remove) return;
      for (const e of [G.P, ...A.crew]) { if (!(e.hp > 0) || dist2(e.x, e.y, x, y) > r * r) continue;
        const dmg = m.atk * (mode === 'humo' ? 1.05 : 1.2);
        if (e === G.P) hurtPlayer(dmg, { lv: m.lv, dawnReto: m }); else shellsHurtAlly(e, dmg * (e.hp < e.maxhp / 2 ? 0.4 : 0.62), m.lv); }
      if (mode === 'porra') for (let j = 0; j < 6; j++) moveEnt(M, m, Math.cos(a) * Math.min(60, dist) / 6, Math.sin(a) * Math.min(60, dist) / 6);
    }
  } });
}
hookAround('updateBoss', (next, m, dt, d, dh, spd, moveTo) => {
  if (!m || m.mid !== 'logue_arc_smoker') return next(m, dt, d, dh, spd, moveTo);
  const M = G.map, A = M && M.logueArc; if (!A || A.boss !== m || A.phase !== 'fight') return;
  if (m.actionUntil > G.t) return;
  const n = m.lgTurns || 0, e = A.luffy, target = n % 3 === 1 && e && e.hp > 0 ? e : G.P;
  const dx = target.x - m.x, dy = target.y - m.y, dist = Math.hypot(dx, dy), mode = n % 2 ? 'porra' : 'humo';
  const reach = mode === 'humo' ? 140 : 80;
  if ((m.cd || 0) <= 0 && dist < reach) { m.lgTurns = n + 1; m.cd = m.hp < m.maxhp * 0.4 ? 1.7 : 2.4; logueSmokerStrike(A, m, mode, target); return; }
  if (dist > 44) { m.dir = dirFromVec(dx, dy); moveEnt(M, m, dx / dist * spd * dt, dy / dist * spd * dt); setAnim(m, 'walk', true); }
  else setAnim(m, 'idle', true);
});
hookAfter('bossKilled', (r, m) => {
  const M = G.map, A = M && M.logueArc; if (!A || A.boss !== m) return;
  A.boss = null; A.phase = 'capture'; A.t = G.t; A.beat = 0;
  const [x, y] = [m.x, m.y]; A.smoker = logueActor(M, 'logue_smoker_s', x, y, 'down', { hgt: 66 }); A.cast.push(A.smoker); setAnim(A.smoker, 'hurt');
});
// ---------- escena y horda ----------
function logueCrowdGather(M) {
  const [sx, sy] = logueScaffoldPx(); let k = 0;
  for (const e of M.logueLife || []) { if (/^logue_c_/.test(e.id) || e.id === 'logue_v_guard') continue;
    const side = k % 2 ? 1 : -1, row = Math.floor(k / 2); k++;
    e.x = sx + side * (110 + (row % 3) * 18); e.y = sy + 30 + Math.floor(row / 3) * 26 + (row % 3) * 6; e.home = { x: e.x, y: e.y }; e.wander = 0; e.scene = true; e.noTalk = true;
    e.dir = side < 0 ? 'right' : 'left'; setAnim(e, 'idle', true); e.lgWatch = 1; }
}
function logueCrowdRelease(M) { for (const e of M.logueLife || []) if (e.lgWatch) { e.scene = false; e.noTalk = false; e.lgWatch = 0; } }
function logueHordeSpawn(M, A) {
  const alive = A.foes.filter(f => !f.dying && !f.remove); A.foes = alive;
  if (alive.length >= 9 || G.t < (A.nextWave || 0)) return;
  A.nextWave = G.t + 2.6;
  const [cx, cy] = logueSpot(104, 124), lv = Math.max(560, Math.min(G.P.lv || 600, 615) - 6);
  for (let k = 0; k < 2; k++) {
    const side = Math.random() < 0.5 ? -1 : 1, at = freePxNear(M, cx + side * 300, cy + (Math.random() - 0.5) * 160, 3) || [cx + side * 260, cy];
    const cap = Math.random() < 0.15, m = spawnMob(cap ? 'dawn_marine_cap' : 'dawn_marine', lv + (cap ? 6 : 0), at[0], at[1], 0, null, false);
    if (m) { m.mrHunt = 1; m.aggroT = 99; m.target = G.P; m.logueHorde = 1; A.foes.push(m); }
  }
}
function logueAllyFight(M, A, e, dt) {
  if (!(e.hp > 0)) return;
  if (e.actionUntil > G.t) { if (typeof baratiePose === 'function') baratiePose(e); return; }
  let best = null, bd = 1e9; for (const f of A.foes) { if (f.dying || f.remove) continue; const d = dist2(f.x, f.y, e.x, e.y); if (d < bd) { bd = d; best = f; } }
  if (!best) { shellsActorMove(M, e, G.P.x + (e.lgOff || 0), G.P.y + 24, dt); return; }
  if (crewTechniqueAttack(M, e, best, A.foes, () => G.map.logueArc === A, e.syrupBoost || 1, 0)) return;
  const an = Math.atan2(e.y - best.y, e.x - best.x); shellsActorMove(M, e, best.x + Math.cos(an) * 34, best.y + Math.sin(an) * 34, dt);
}
function logueLightning(x, y) {
  addFx({ type: 'custom', x, y, dur: 0.7, draw: (f, sx, sy, k) => {
    ctx.save(); ctx.fillStyle = `rgba(255,255,255,${Math.max(0, 0.85 - k * 2.2).toFixed(2)})`; ctx.fillRect(0, 0, VW, VH);
    ctx.strokeStyle = `rgba(250,248,200,${(1 - k).toFixed(2)})`; ctx.lineWidth = 3; ctx.beginPath(); let px = sx + 18, py = -10; ctx.moveTo(px, py);
    for (let i = 1; i <= 9; i++) { px = sx + Math.sin(i * 2.3 + f.seed) * 16 * (1 - i / 9); py = -10 + (sy - 100 + 10) * i / 9; ctx.lineTo(px, py); }
    ctx.stroke(); ctx.strokeStyle = `rgba(160,190,255,${(0.6 * (1 - k)).toFixed(2)})`; ctx.lineWidth = 7; ctx.stroke(); ctx.restore();
  }, seed: Math.random() * 9 });
  burst(x, y - 100, 26, { sp: 130, up: 50, g: 80, life: 0.6, c: ['#fff8c0', '#a8c0ff', '#ffffff'] });
}
function logueStorm(dur) {
  addFx({ type: 'custom', x: G.P.x, y: G.P.y, dur, draw: (f, sx, sy, k) => {
    const a = Math.min(1, f.t / 0.6, (dur - f.t) / 0.8);
    ctx.save(); ctx.fillStyle = `rgba(14,18,40,${(0.42 * a).toFixed(2)})`; ctx.fillRect(0, 0, VW, VH);
    ctx.strokeStyle = `rgba(190,210,240,${(0.55 * a).toFixed(2)})`; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i < 70; i++) { const rx = (i * 97 + f.t * 300) % (VW + 40) - 20, ry = (i * 53 + f.t * 520) % (VH + 20) - 10; ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 9); }
    ctx.stroke(); ctx.restore();
  } });
}
function logueArcTick(M, A, dt) {
  const P = G.P, t = G.t - A.t, [sx, sy] = logueScaffoldPx();
  if (P.dead) { logueArcClear(M); toast(L2('La Marina ha ganado esta vez. Habla con Luffy para intentarlo de nuevo.', 'The Navy won this time. Talk to Luffy to try again.'), 'info', 6); logueCrowdRelease(M); return; }
  if (dist2(P.x, P.y, sx, sy) > 620 ** 2) { logueArcClear(M); logueCrowdRelease(M); return; }
  if (A.phase === 'meet') {
    const s = A.smoker, l = A.luffy;
    if (A.beat === 0) { A.beat++; logueSay(s, 'Sombrero de Paja. En mi ciudad ningún pirata vuelve a zarpar.', 'Straw Hat. In my town no pirate sets sail again.'); }
    if (A.beat === 1 && t > 2.6) { A.beat++; logueSay(l, '¡Solo vine a ver el patíbulo del Rey de los Piratas!', 'I only came to see the Pirate King’s scaffold!'); }
    if (A.beat === 2 && t > 5) { A.beat++; logueSay(s, 'Entonces lo verás desde arriba. ¡Humo blanco!', 'Then you’ll see it from the top. White smoke!'); }
    if (s && t < 4.5) shellsActorMove(M, s, P.x, P.y - 70, dt);
    if (t > 7) {
      s.remove = true; A.cast = A.cast.filter(e => e !== s);
      const m = spawnMob('logue_arc_smoker', LOGUE_ARC_LV, s.x, s.y, 0, null, true);
      m.hgt = 70; m.state = 'fight'; m.cd = 1.2; A.boss = m; A.phase = 'fight'; A.t = G.t;
      showBoss(m); sfx('boss'); banner('Smoker', L2('Nivel ', 'Level ') + LOGUE_ARC_LV);
    }
    return;
  }
  if (A.phase === 'fight') { const l = A.luffy, m = A.boss;
    if (l && l.hp > 0 && m && !m.dying) { if (l.actionUntil > G.t) { if (typeof baratiePose === 'function') baratiePose(l); }
      else if (!crewTechniqueAttack(M, l, m, [m], () => G.map.logueArc === A, l.syrupBoost, 0.22)) { const d = Math.atan2(P.y - m.y, P.x - m.x) + 1.45; shellsActorMove(M, l, m.x + Math.cos(d) * l.syrupReach * 0.73, m.y + Math.sin(d) * l.syrupReach * 0.73, dt); } }
    return; }
  if (A.phase === 'capture') {
    const s = A.smoker, l = A.luffy;
    if (A.beat === 0) { A.beat++; logueSay(s, 'Ganaste la pelea… pero esta ciudad es mía.', 'You won the fight… but this town is mine.'); }
    if (A.beat === 1 && t > 2.2) { A.beat++; setAnim(s, 'atk'); logueSay(s, '¡Humo blanco!', 'White smoke!');
      addFx({ type: 'custom', x: l.x, y: l.y - 10, dur: 1.2, draw: (f, x, y, k) => { ctx.fillStyle = `rgba(240,244,246,${(0.85 * (1 - k * 0.6)).toFixed(2)})`; for (let i = 0; i < 10; i++) { const an = i * 0.63 + k * 3; ctx.beginPath(); ctx.arc(x + Math.cos(an) * (10 + k * 14), y + Math.sin(an) * (6 + k * 8), 8 + k * 6, 0, 7); ctx.fill(); } } }); }
    if (A.beat === 2 && t > 3.6) { A.beat++;
      transition(() => {
        for (const e of A.crew) e.remove = true; A.crew = [];
        const luf = logueActor(M, SHELLS_CAST_IDS.luffy, sx - 6, sy + 3, 'down', { z: 108, noTag: true, hgt: 170 }); setAnim(luf, 'hurt');
        const bug = logueActor(M, 'logue_buggy', sx + 26, sy + 4, 'left', { z: 108, hgt: 180 });
        s.x = sx - 60; s.y = sy + 70; s.dir = 'up'; setAnim(s, 'idle');
        A.cast.push(luf, bug); A.luffyUp = luf; A.buggy = bug;
        logueCrowdGather(M);
        P.x = sx + 44; P.y = sy + 14; P.dir = 'up'; updateCamera(0, true);
      });
    }
    if (A.beat === 3 && t > 5) { A.beat++; logueSay(A.buggy, '¡Ciudadanos de Loguetown! ¡Contemplen la ejecución pública del Sombrero de Paja!', 'Citizens of Loguetown! Behold the public execution of Straw Hat!'); setAnim(A.buggy, 'atk'); }
    if (A.beat === 4 && t > 8) { A.beat++; logueSay(A.luffyUp, '¡Zoro! ¡Sanji! ¡Usopp! ¡Nami! ¡Lo siento… creo que aquí me muero!', 'Zoro! Sanji! Usopp! Nami! Sorry… I think I die here!'); }
    if (A.beat === 5 && t > 10.5) { A.beat++;
      const ids = [SHELLS_CAST_IDS.zoro, BAR_SANJI, SYRUP_USOPP, ORANGE_NAMI].filter(id => id === SHELLS_CAST_IDS.zoro || (id === BAR_SANJI && P.baratieSanji) || (id === SYRUP_USOPP && P.syrupUsopp) || (id === ORANGE_NAMI && P.dawnCrewJoined));
      ids.forEach((id, i) => { const e = logueAlly(M, P, id, P.x + (i - (ids.length - 1) / 2) * 34, P.y + 40); e.lgOff = (i - 1.5) * 26; A.crew.push(e); });
      logueSay(A.crew[0], '¡Ni lo sueñes! ¡Bajen a nuestro capitán de ahí!', 'Not a chance! Get our captain down from there!');
      if (A.crew[1]) logueSay(A.crew[1], '¡Aguanta, capitán! ¡La Marina viene por todas partes!', 'Hold on, captain! The Navy is coming from everywhere!');
      A.phase = 'horde'; A.t = G.t; A.nextWave = 0;
      banner('⚓ ' + L2('¡La Marina rodea la plaza!', 'The Navy surrounds the square!'), L2('Aguanta 2 minutos con tu tripulación', 'Hold out for 2 minutes with your crew'));
    }
    return;
  }
  if (A.phase === 'horde') {
    const left = LOGUE_HORDE_S - t; logueTimerUi(left);
    if (A.buggy && Math.floor(t) % 9 === 0 && Math.floor(t) !== A.lastTaunt) { A.lastTaunt = Math.floor(t); logueSay(A.buggy, ['¡Más rápido, marines inútiles!', '¡Este es el lugar donde murió Roger! ¡Y donde muere el Sombrero de Paja!', '¡Jajaja! ¡Nadie llega a tiempo!'][A.lastTaunt % 3], ['Faster, useless marines!', 'This is where Roger died! And where Straw Hat dies!', 'Hahaha! Nobody makes it in time!'][A.lastTaunt % 3]); }
    logueHordeSpawn(M, A);
    for (const e of A.crew) logueAllyFight(M, A, e, dt);
    if (left <= 0) {
      logueTimerUi(null); A.phase = 'dragon'; A.t = G.t; A.beat = 0;
      for (const f of A.foes) if (!f.dying) { f.remove = true; burst(f.x, f.y - 12, 6, { sp: 60, up: 20, life: 0.4, c: ['#f0f4f6', '#c8d0d8'] }); }
      A.foes = []; logueStorm(9);
    }
    return;
  }
  if (A.phase === 'dragon') {
    if (A.beat === 0) { A.beat++; logueSay(A.buggy, '¿Últimas palabras, Sombrero de Paja?', 'Any last words, Straw Hat?'); setAnim(A.buggy, 'atk'); }
    if (A.beat === 1 && t > 2.4) { A.beat++; logueSay(A.luffyUp, '¡Voy a ser el Rey de los Piratas!', 'I’m going to be King of the Pirates!'); }
    if (A.beat === 2 && t > 4.2) { A.beat++; logueLightning(sx, sy); try { sfx('boss'); } catch (e) { }
      const [dx, dy] = logueSpot(114, 105); A.dragon = logueActor(M, 'logue_dragon', dx, dy, 'left', { hgt: 70, noTag: true }); A.cast.push(A.dragon);
      setAnim(A.buggy, 'dead'); A.buggy.z = 0; A.buggy.y = sy + 22; A.buggy.x = sx + 40; logueSay(A.buggy, '¡¿Un rayo?!', 'Lightning?!'); }
    if (A.beat === 3 && t > 5.4) { A.beat++; if (A.dragon) { A.dragon.remove = true; burst(A.dragon.x, A.dragon.y - 30, 10, { sp: 40, up: 10, life: 0.5, c: ['#4a6a3a', '#20283a'] }); A.dragon = null; }
      const l = A.luffyUp; l.z = 0; l.y = sy + 26; l.x = sx - 18; setAnim(l, 'idle'); logueSay(l, '¡Jajaja! ¡Sigo vivo! ¡Qué suerte!', 'Hahaha! I’m still alive! Lucky!'); }
    if (A.beat === 4 && t > 8.6) { A.beat++; logueArcEnd(M, A); }
  }
}
function logueArcEnd(M, A) {
  const P = G.P, first = !(P.logueArcN > 0);
  P.logueArcN = (P.logueArcN || 0) + 1; const gold = first ? 150000 : 40000; P.gold = (P.gold || 0) + gold;
  try { for (const k of ['luffy', 'zoro', 'nami', 'usopp']) crewBtyGain(k, LOGUE_ARC_LV * (k === 'luffy' ? 9000 : 3000)); } catch (e) { }
  if (typeof markDirty === 'function') markDirty(true);
  logueArcClear(M); logueCrowdRelease(M); logueLifeSpawn(M, P);
  xMsg(L2('La ciudad del principio y del fin', 'The town of the beginning and the end'), [
    L2('Zoro: ¿Ese rayo cayó justo ahí por suerte?', 'Zoro: Did that lightning strike right there by luck?'),
    L2('Nami: ¡Viene una tormenta enorme! Si no zarpamos ya, la Marina cierra el puerto.', 'Nami: A huge storm is coming! If we don’t sail now, the Navy will close the harbor.'),
    L2('Sanji: Entre la lluvia vi a alguien con una capa verde… y desapareció.', 'Sanji: In the rain I saw someone in a green cloak… and then he was gone.'),
    L2('Luffy: ¡Jajaja! ¡Rumbo al Grand Line!', 'Luffy: Hahaha! Course for the Grand Line!'),
    '<b>+' + gold.toLocaleString() + ' ' + L2('oro', 'gold') + '</b> · ' + L2('Puedes repetir el arco hablando con Luffy en la plaza.', 'You can replay the arc by talking to Luffy in the square.')
  ].join('<br><br>'));
}
// ---------- armería por dentro ----------
const LG_SHOP_W = 22, LG_SHOP_H = 15, LG_SHOP_DOOR = [76, 157];
function lgShopTile(x, y) {
  if (y === LG_SHOP_H - 1 && (x === 10 || x === 11)) return 'door';
  if (x <= 0 || x >= LG_SHOP_W - 1 || y >= LG_SHOP_H - 1) return 'rim';
  if (y <= 2) return 'wall';
  return 'floor';
}
const LG_FURN = {
  lg_mostrador: () => { const p = new Pix(84, 30); p.rect(2, 4, 80, 24, WOOD[2]); p.rect(2, 4, 80, 5, WOOD[4]); p.hl(2, 9, 80, WOOD[1]); for (let x = 6; x < 80; x += 13) p.vl(x, 11, 16, WOOD[1]);
    p.line(14, 6, 56, 3, C('#d8dde0')); p.line(14, 7, 56, 4, C('#9aa4a8')); p.rect(10, 5, 6, 3, C('#3a2a1a')); p.outline(OUTL); return { c: p.canvas(), ax: 42, ay: 28 }; },
  lg_armero: () => { const p = new Pix(40, 52); p.rect(4, 4, 4, 46, WOOD[1]); p.rect(32, 4, 4, 46, WOOD[1]); p.rect(2, 46, 36, 4, WOOD[2]);
    for (let i = 0; i < 6; i++) { const y = 8 + i * 6; p.hl(6, y, 28, C(['#2a2a30', '#5a3a22', '#3a3a48'][i % 3])); p.hl(6, y + 1, 28, C('#c8ccd0')); p.set(6, y, C('#d8b040')); }
    p.outline(OUTL); return { c: p.canvas(), ax: 20, ay: 50 }; },
  lg_estante: () => { const p = new Pix(44, 46); p.rect(2, 2, 40, 42, WOOD[1]); p.rect(4, 4, 36, 38, WOOD[3]);
    for (const y of [16, 30]) p.hl(4, y, 36, WOOD[1]);
    p.line(8, 12, 22, 6, C('#d0d6da')); p.line(24, 12, 36, 7, C('#d0d6da')); p.ell ? p.ell(14, 24, 5, 5, C('#c8ccd0')) : p.rect(9, 20, 10, 8, C('#c8ccd0')); p.rect(26, 20, 10, 9, C('#9aa4a8'));
    p.rect(8, 33, 8, 6, C('#6a4a2a')); p.rect(22, 33, 12, 6, C('#5a6a78')); p.outline(OUTL); return { c: p.canvas(), ax: 22, ay: 44 }; },
  lg_armadura: () => { const p = new Pix(28, 50); const m = pal(['#5a6670', '#8a98a2', '#b8c4cc', '#e2e8ec']);
    p.rect(12, 40, 4, 8, WOOD[1]); p.rect(6, 46, 16, 3, WOOD[2]); p.rect(7, 18, 14, 22, m[1]); p.rect(9, 20, 10, 16, m[2]); p.rect(3, 18, 5, 12, m[1]); p.rect(20, 18, 5, 12, m[1]);
    p.rect(9, 5, 10, 12, m[2]); p.rect(10, 9, 8, 2, m[0]); p.hl(9, 5, 10, m[3]); p.outline(OUTL); return { c: p.canvas(), ax: 14, ay: 48 }; },
  lg_barril: () => { const p = new Pix(24, 40); p.rect(3, 18, 18, 20, WOOD[2]); p.hl(3, 22, 18, C('#3a3a40')); p.hl(3, 33, 18, C('#3a3a40')); p.hl(3, 18, 18, WOOD[4]);
    for (let i = 0; i < 5; i++) { const x = 6 + i * 3; p.vl(x, 4 + (i % 2) * 3, 14, C(i === 2 ? '#6a1a1a' : '#2a2430')); p.rect(x - 1, 14, 3, 2, C('#c8a040')); }
    p.outline(OUTL); return { c: p.canvas(), ax: 12, ay: 38 }; },
  lg_vitrina: () => { const p = new Pix(52, 28); p.rect(2, 6, 48, 20, WOOD[2]); p.rect(4, 6, 44, 10, C('#bcd6dc')); for (let x = 7; x < 46; x += 9) { p.line(x, 13, x + 6, 9, C('#e0e4e8')); p.set(x, 13, C('#c8a040')); }
    p.hl(2, 5, 48, WOOD[4]); p.outline(OUTL); return { c: p.canvas(), ax: 26, ay: 26 }; },
  lg_puerta: () => { const p = new Pix(34, 14); p.rect(1, 3, 32, 9, C('#7a3a2a')); p.rect(3, 5, 28, 5, C('#a85a3a')); p.hl(5, 7, 24, C('#e0b060')); p.outline(OUTL); return { c: p.canvas(), ax: 17, ay: 12 }; }
};
hookAround('genFurn2', (next, kind) => LG_FURN[kind] ? LG_FURN[kind]() : next(kind));
function makeLogueShop() {
  if (G.maps.logue_armeria) return G.maps.logue_armeria;
  const w = LG_SHOP_W, h = LG_SHOP_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'logue_armeria', w, h, I, ter: new Uint8Array(N), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', camps: [], exit: { x: -9, y: -9 }, hudName: L2('Armería de Ipponmatsu', 'Ipponmatsu’s arms shop'), logueShop: 1 };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = lgShopTile(x, y); M.ter[I(x, y)] = t === 'floor' || t === 'door' ? T.FLOOR : T.IWALL; }
  prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  F('lg_mostrador', 16, 8, [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]]);
  F('lg_armero', 4, 3, [[0, 0], [1, 0]]); F('lg_armero', 7, 3, [[0, 0], [1, 0]]);
  F('lg_estante', 11, 3, [[0, 0], [1, 0]]); F('lg_estante', 14, 3, [[0, 0], [1, 0]]);
  F('lg_armadura', 18, 3); F('lg_armadura', 20, 3);
  F('lg_barril', 2, 9); F('lg_vitrina', 3, 12, [[-1, 0], [0, 0], [1, 0]]); F('lg_vitrina', 19, 12, [[-1, 0], [0, 0], [1, 0]]);
  F('lg_puerta', 10, 13, [], { solid: false, xact: 'logue_shop_out' });
  G.maps.logue_armeria = M; return M;
}
function lgShopPaint(M, cx, cy) {
  const c = mkCanvas(CHP, CHP), g = c.getContext('2d'), t0x = cx * CH, t0y = cy * CH;
  for (let ty = 0; ty < CH; ty++) for (let tx = 0; tx < CH; tx++) {
    const x = t0x + tx, y = t0y + ty, X = tx * 16, Y = ty * 16, t = lgShopTile(x, y);
    if (x >= LG_SHOP_W || y >= LG_SHOP_H) { g.fillStyle = '#000'; g.fillRect(X, Y, 16, 16); continue; }
    if (t === 'rim') { g.fillStyle = '#5a3a24'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#7a5032'; g.fillRect(X, Y + 3, 16, 2); continue; }
    if (t === 'wall') { g.fillStyle = '#cfdcb4'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#b8c89c'; g.fillRect(X, Y + 12, 16, 4);
      if (x % 5 === 0) { g.fillStyle = '#8a5a34'; g.fillRect(X + 5, Y, 6, 16); }
      if (y === 0) { g.fillStyle = '#8a5a34'; g.fillRect(X, Y, 16, 5); } continue; }
    const k = (x + (y % 2) * 3) % 6; g.fillStyle = k === 0 ? '#d49a8a' : (y % 2 ? '#e8b4a4' : '#eebcac'); g.fillRect(X, Y, 16, 16);
    g.fillStyle = '#c8887a'; g.fillRect(X, Y + 15, 16, 1); if (k === 0) g.fillRect(X, Y, 1, 15);
    if ((x * 7 + y * 3) % 9 === 0) { g.fillStyle = 'rgba(255,240,230,.35)'; g.fillRect(X + 3, Y + 5, 9, 3); }
    if (t === 'door') { g.fillStyle = '#a86a3e'; g.fillRect(X, Y, 16, 16); }
  }
  return c;
}
hookAround('renderChunk', (next, M, cx, cy) => M && M.logueShop ? lgShopPaint(M, cx, cy) : next(M, cx, cy));
function logueShopScene(M) {
  const S = M.lgScene; if (S) for (const e of S.cast) e.remove = true;
  const px = (x, y) => [x * 16 + 8, y * 16 + 10];
  const ip = spawnNPC('logue_ippon', ...px(16, 7), M.id, { face: 'down', hgt: 56 });
  const zo = spawnNPC('logue_zoro', ...px(15, 10), M.id, { face: 'up', hgt: 60 });
  const ta = spawnNPC('logue_tashigi', ...px(9, 9), M.id, { face: 'right', hgt: 58 });
  M.lgScene = { cast: [ip, zo, ta], t: G.t, beat: 0, ip, zo, ta };
}
const LG_LINES = [
  [0.6, 'ip', '¿Solo cien mil berries? Con eso no te llevas una espada de verdad, muchacho.', 'Only a hundred thousand berries? That won’t buy you a real sword, lad.'],
  [4.2, 'zo', 'Me basta con dos que aguanten. ¿Y las de ese barril?', 'Two that hold up will do. What about the ones in that barrel?'],
  [7.8, 'ip', '¡Esa no! Es la Sandai Kitetsu. Todos sus dueños acabaron muertos.', 'Not that one! It’s the Sandai Kitetsu. Every one of its owners ended up dead.'],
  [11.4, 'zo', 'Entonces probemos mi suerte: la lanzo al aire y pongo el brazo debajo.', 'Then let’s test my luck: I throw it up and hold my arm under it.'],
  [15, 'ta', '¡Está loco! …Pero esa espada blanca que lleva, ¿es la Wadō Ichimonji? Es de grado superior.', 'He’s crazy! …But that white sword of his, is it the Wado Ichimonji? It’s top grade.'],
  [19, 'zo', 'La espada no quiso cortarme. Me la llevo.', 'The sword didn’t want to cut me. I’m taking it.'],
  [22.4, 'ip', 'Llévatela gratis… y también esta, la Yubashiri. Hace años que no veía a un espadachín así.', 'Take it for free… and this one too, the Yubashiri. I haven’t seen a swordsman like you in years.'],
  [26.4, 'ta', 'Perdón… sin mis gafas no distingo a nadie. Me recuerdas a alguien.', 'Sorry… without my glasses I can’t tell anyone apart. You remind me of someone.'],
  [29.8, 'zo', '…No me mires así.', '…Don’t look at me like that.']
];
function logueShopTick(M, dt) {
  const S = M.lgScene; if (!S) return; const t = G.t - S.t;
  while (S.beat < LG_LINES.length && t > LG_LINES[S.beat][0]) { const [, who, es, en] = LG_LINES[S.beat]; logueSay(S[who], es, en); S.beat++;
    if (who === 'zo' && S.beat === 4) { const z = S.zo; addFx({ type: 'custom', x: z.x, y: z.y, dur: 1.6, draw: (f, x, y, k) => { const h = Math.sin(k * Math.PI) * 54; ctx.save(); ctx.translate(x + 8, y - 24 - h); ctx.rotate(k * 12); ctx.fillStyle = '#d8dde0'; ctx.fillRect(-9, -1, 18, 2); ctx.fillStyle = '#6a1a1a'; ctx.fillRect(-12, -1, 4, 2); ctx.restore(); } }); } }
}
XACT.logue_shop_in = [L2('Entrar en la armería', 'Enter the arms shop'), 'ways', () => {
  const P = G.P; if (G.fading || P.dead) return;
  transition(() => { P._lgShop = { x: P.x, y: P.y, boat: P.dawnBoat }; P.inside = 'logue_armeria'; const M = makeLogueShop(); setMap(M, 10.5 * 16 + 8, 12 * 16 + 8, 'up'); logueShopScene(M); banner(L2('Armería de Ipponmatsu', 'Ipponmatsu’s arms shop'), 'Loguetown'); });
}];
XACT.logue_shop_out = [L2('Salir a la calle', 'Go out to the street'), 'ways', () => {
  const P = G.P; if (G.fading || P.dead) return;
  transition(() => { const S = P._lgShop || {}, [mx, my] = dawnPx(LOGUE_MOOR), boat = S.boat || { x: mx, y: my, dir: 'down', h: { kind: 'skiff' }, logue: true };
    P.inside = null; const M = makeDawn(); const [x, y] = dawnPx(LG_SHOP_DOOR);
    P.dawnHelm = boat.h || { kind: 'skiff' }; const ok = setMap(M, x, y + 12, 'down'); P.dawnHelm = null; P.dawnBoat = boat; P.x = x; P.y = y + 12; updateCamera(0, true);
    if (ok !== false) P._lgShop = null; });
}];
hookAfter('makeDawn', M => {
  if (!M.logue || M.logueDoor) return; M.logueDoor = 1;
  addObj(M, 'furn', LG_SHOP_DOOR[0], LG_SHOP_DOOR[1], { f: 'lg_puerta', fp: [], solid: false, xact: 'logue_shop_in' });
  M.chunks.clear();
});
// ---------- diálogos: empezar el arco ----------
DLG_HOOKS.push((npc, opts) => {
  if (!npc || !G.map || !G.map.logue || G.map.logueArc) return;
  if (npc.id !== 'logue_c_luffy' && npc.id !== 'logue_officer' && !(npc.id === SHELLS_CAST_IDS.luffy && npc.dawnCrew)) return;
  const P = G.P; if (!logueArcReady(P)) return;
  opts.unshift({ label: (P.logueArcN ? '🔁 ' : '⚓ ') + L2('Arco de Loguetown: Smoker contra Luffy', 'Loguetown arc: Smoker versus Luffy') + ' · ' + L2('Nv. ', 'Lv. ') + LOGUE_ARC_LV, icon: ['talk'], fn: () => { closeDialog(); logueArcStart(); } });
});
// ---------- tick: ciudad viva, arco y tienda ----------
V33_TICKS.push(dt => {
  const M = G.map, P = G.P; if (!M || !P) return;
  if (P._lgAshore && !(M.logueArc)) { P.dawnCrewAshore = P._lgAshore.v; P._lgAshore = null; }
  if (M.logueShop) { logueShopTick(M, dt); return; }
  if (!M.logue) return;
  const on = logueActive(P, M) || (M.logueArc && !P.dead);
  if (!on) { if (M.logueArc) logueArcClear(M); if (M.logueLife) logueLife(M); return; }
  if (!M.logueLife || M.logueLifeOwner !== P) { M.logueLifeOwner = P; logueLifeSpawn(M, P); }
  if (M.logueArc) { logueMarinePause(); logueArcTick(M, M.logueArc, Math.min(dt || 0.016, 0.1)); }
});
hookAfter('setMap', () => { for (const M of Object.values(G.maps || {})) if (M !== G.map) { if (M.logueArc) logueArcClear(M); if (M.logueLife) logueLife(M); if (M.lgScene) { for (const e of M.lgScene.cast) e.remove = true; M.lgScene = null; } } });
// la patrulla de la Marina no interrumpe el arco
// (mrTick va por referencia en V33_TICKS, así que no admite ganchos: se limpia aquí)
function logueMarinePause() {
  if (MR.spy) { MR.spy.remove = true; MR.spy = null; }
  if (MR.hunt) { for (const m of MR.hunt.mobs) if (!m.dying) m.remove = true; MR.hunt = null; }
  MR.nextLand = Math.max(MR.nextLand || 0, G.t + 30);
}
// cámara: durante el patíbulo se ve a Luffy arriba y al jugador abajo
hookAfter('updateCamera', () => {
  const M = G.map, A = M && M.logueArc; if (!A || !A.luffyUp) return;
  const [, sy] = logueScaffoldPx(), P = G.P;
  G.cam.y = Math.max(P.y + 22 - VH, Math.min(G.cam.y, sy - 205));
});
