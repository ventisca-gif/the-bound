// 6.31 · Vida a bordo del Going Merry (ideas 10-14 que eligió Sergio):
//  10. Historias de Usopp: te cuenta algo y adivinas si es verdad o mentira (oro si aciertas).
//  11. Pesca en la popa con Luffy y Usopp: minijuego en el propio mar (⚔ cuando pica el corcho), sin ventanas.
//  12. Banquete de la tripulación: al terminar un arco por primera vez (y una vez al día), todos bailan en el comedor
//      de bajo cubierta; Sanji sirve carne y da el bono de comida 20 min.
//  13. Mapas de Nami: Nami dibuja el mapa de cada isla del Mar de Dawn cuando pasas por todos sus lugares (Nami no pelea).
//  14. Den Den Mushi: el caracol teléfono del Merry suena y te llaman Garp, Makino, Zeff, Johnny, Gaimon, Kaya o Smoker
//      con encargos (ir a un sitio, llevar peces de Dawn o vencer enemigos).
// Se empieza todo desde el menú del barco (Hablar con la tripulación) o hablando con cada tripulante.
SAVEKEYS.push('usoppDay', 'usoppBest', 'mpescaN', 'feastSeen', 'feastReady', 'feastDay', 'namiMap', 'namiDone', 'ddm', 'ddmDay', 'ddmN');
const v631OnMerry = () => { const P = G.P; return !!(G.map && G.map.dawn && P && P.dawnCrewJoined && P.dawnHelm && P.dawnHelm.kind === 'skiff' && !P.dead && !G.fading); };
const v631Day = () => (typeof calDay === 'function' ? calDay() : 0);

// ===================== 10 · HISTORIAS DE USOPP =====================
const USOPP_TALES = [
  [1, 'Mi padre, Yasopp, navega con el Pelirrojo Shanks. Dicen que puede darle a una hormiga en el ojo a cien metros.', 'My father, Yasopp, sails with Red-Haired Shanks. They say he can hit an ant in the eye from a hundred metres.'],
  [1, 'Kaya nos regaló el Going Merry. Lo diseñó Merry, su mayordomo.', 'Kaya gave us the Going Merry. Merry, her butler, designed it.'],
  [1, 'Zoro estuvo atado en el patio de Shells Town casi un mes sin comer.', 'Zoro was tied up in the Shells Town courtyard for almost a month without eating.'],
  [1, 'Sanji era el subchef del Baratie, un restaurante que flota en el mar.', 'Sanji was the sous-chef of the Baratie, a restaurant floating on the sea.'],
  [1, 'Nami quiere dibujar un mapa de todo el mundo. ¡Todo, todo!', 'Nami wants to draw a map of the whole world. All of it!'],
  [1, 'Luffy se comió una Fruta del Diablo de niño y ahora su cuerpo es de goma.', 'Luffy ate a Devil Fruit as a kid and now his body is made of rubber.'],
  [1, 'En Villa Syrup gritaba cada mañana que venían los piratas. Un día vinieron de verdad.', 'In Syrup Village I shouted every morning that pirates were coming. One day they really came.'],
  [1, 'En la Montaña del Revés hay una ballena enorme, Laboon, que espera a unos piratas.', 'At Reverse Mountain there’s a huge whale, Laboon, waiting for some pirates.'],
  [0, 'Tengo ochenta mil hombres a mis órdenes. Están de vacaciones.', 'I have eighty thousand men under my command. They’re on holiday.'],
  [0, 'Una vez me tragó un pez dorado del tamaño de una isla y salí por su nariz.', 'Once a golden fish the size of an island swallowed me and I came out through its nose.'],
  [0, 'Derroté a un Rey Marino con una sola estrella de plomo. Ni pestañeé.', 'I beat a Sea King with a single lead star. I didn’t even blink.'],
  [0, 'En mi isla natal hay hormigas tan grandes como elefantes. Yo las domaba.', 'On my home island there are ants as big as elephants. I used to tame them.'],
  [0, 'Puedo aguantar la respiración tres días en el fondo del mar.', 'I can hold my breath for three days at the bottom of the sea.'],
  [0, 'El capitán Kuro me pidió perdón de rodillas y me regaló su gato.', 'Captain Kuro begged my forgiveness on his knees and gave me his cat.'],
  [0, 'Fui yo quien le enseñó a Zoro a usar tres espadas. Antes usaba una cuchara.', 'I’m the one who taught Zoro to use three swords. He used to use a spoon.'],
  [0, 'Sanji me pide mis recetas. Todo lo que sabe se lo enseñé yo.', 'Sanji asks me for my recipes. Everything he knows, I taught him.']
];
const USOPP_FULL = 5, USOPP_GOLD = 20000;
function usoppNpc() { return { id: SYRUP_USOPP, type: 'npc', map: G.map ? G.map.id : 'dawn', dawnCrew: true, aboard: true, atlas: npcAtlas(SYRUP_USOPP), def: { ...NPCS[SYRUP_USOPP], title: L2('Tirador', 'Sniper'), lines: [L2('¿Quieres oír una historia? Esta es verdad… creo.', 'Want to hear a story? This one’s true… I think.')] } }; }
function usoppStory(streak) {
  const P = G.P; if (!P || !P.syrupUsopp) return;
  if (!dlg) openDialog(usoppNpc());
  let i; do { i = Math.floor(Math.random() * USOPP_TALES.length); } while (USOPP_TALES.length > 1 && i === usoppStory.last); usoppStory.last = i;
  const [truth, es, en] = USOPP_TALES[i]; setOpts([]);
  typeText('«' + L2(es, en) + '»', () => setOpts([
    { label: '✅ ' + L2('¡Es verdad!', 'It’s true!'), fn: () => usoppAnswer(truth === 1, streak || 0, truth) },
    { label: '🤥 ' + L2('¡Mentira!', 'That’s a lie!'), fn: () => usoppAnswer(truth === 0, streak || 0, truth) },
    { label: L2('Adiós', 'Bye'), cls: 'bye', fn: closeDialog }]));
}
function usoppAnswer(ok, streak, truth) {
  const P = G.P, d = v631Day(); if (!P.usoppDay || P.usoppDay.d !== d) P.usoppDay = { d, n: 0 };
  let txt;
  if (ok) { streak++; const full = P.usoppDay.n < USOPP_FULL, g = full ? USOPP_GOLD : 2000; P.usoppDay.n++; P.gold += g; P.usoppBest = Math.max(P.usoppBest || 0, streak); sfx('coin');
    txt = (truth ? L2('¡Pues sí! Era verdad. A veces digo la verdad, ¿eh?', 'Well, yes! It was true. Sometimes I tell the truth, you know?') : L2('¡Me pillaste! El gran Usopp… exagera un poquito.', 'You caught me! The great Usopp… exaggerates a tiny bit.')) + ' +' + g.toLocaleString() + ' ' + L2('oro', 'gold') + ' · ' + L2('racha ', 'streak ') + streak; }
  else { txt = (truth ? L2('¡Que era verdad! Nadie me cree nunca…', 'But it was true! Nobody ever believes me…') : L2('¡Jajaja! ¡Te lo creíste! El capitán Usopp ataca de nuevo.', 'Hahaha! You believed it! Captain Usopp strikes again.')) + ' · ' + L2('racha a cero', 'streak reset'); streak = 0; }
  markDirty(); setOpts([]);
  typeText(txt, () => setOpts([{ label: '🤥 ' + L2('Otra historia', 'Another story'), fn: () => usoppStory(streak) }, { label: L2('Adiós', 'Bye'), cls: 'bye', fn: closeDialog }]));
}
DLG_HOOKS.push((npc, opts) => { if (npc && npc.id === SYRUP_USOPP && (npc.aboard || (G.map && G.map.merryBajo))) opts.unshift({ label: '🤥 ' + L2('Historias de Usopp: ¿verdad o mentira?', 'Usopp’s stories: true or lie?'), icon: ['talk'], fn: () => usoppStory(0) }); });

// ===================== 11 · PESCA EN LA POPA =====================
const MP_CATCH = [['pz_dw_coralino', 22], ['pz_dw_barracuda', 18], ['pz_dw_nacar', 14], ['pz_dw_espada', 12], ['pz_dw_marea', 8], ['pz_dw_rey', 6], ['bota', 12], ['reymarino', 4]];
function mpRoll() { const tot = MP_CATCH.reduce((a, c) => a + c[1], 0); let r = Math.random() * tot; for (const [id, w] of MP_CATCH) { if ((r -= w) < 0) return id; } return MP_CATCH[0][0]; }
function mpRodders() { const P = G.P, side = P.dir === 'left' ? -1 : 1, out = [{ id: SHELLS_CAST_IDS.luffy, x: P.x - 65 * side, y: P.y + 7, bx: P.x - 186 * side, by: P.y + 34 }]; if (P.syrupUsopp) out.push({ id: SYRUP_USOPP, x: P.x - 116 * side, y: P.y + 11, bx: P.x - 224 * side, by: P.y + 14 }); return out; }
function mpStart() {
  const P = G.P; if (!v631OnMerry() || actBusy()) return; closeModal(); closeDialog();
  if (P.dawnHelm.deck) delete P.dawnHelm.deck;
  Object.assign(ACT, { k: 'mpesca', casts: 0, max: 6, ph: 'wait', t: G.t + 2 + Math.random() * 3, who: 0, got: [], onAtk: mpAtk, x0: P.x, y0: P.y });
  banner('🎣 ' + L2('Pesca en la popa', 'Fishing off the stern'), L2('Pulsa ⚔ cuando pique un corcho (6 lances)', 'Press ⚔ when a float bites (6 casts)'));
  mpSay(0, '¡A pescar! ¡Quiero un pez tan grande como el barco!', 'Let’s fish! I want a fish as big as the ship!');
}
function mpSay(k, es, en) { const r = mpRodders()[k] || mpRodders()[0]; floatText(r.x, r.y - 44, L2(es, en).slice(0, 46), '#fff2c0'); }
function mpNext(A) { A.casts++; if (A.casts >= A.max) { mpEnd(); return; } A.ph = 'wait'; A.t = G.t + 2 + Math.random() * 3.5; A.who = mpRodders().length > 1 ? Math.floor(Math.random() * 2) : 0; }
function mpAtk() {
  const A = ACT, P = G.P; if (A.k !== 'mpesca') return false;
  if (A.ph === 'bite') {
    const id = mpRoll(), r = mpRodders()[A.who] || mpRodders()[0];
    if (id === 'bota') { floatText(r.bx, r.by - 20, L2('¡Una bota vieja!', 'An old boot!'), '#c8b08a'); mpSay(1, '¡Es la bota del capitán de mi historia!', 'It’s the captain’s boot from my story!'); }
    else if (id === 'reymarino') { const g = 100000; P.gold += g; A.got.push(id); G.shake = 8; sfx('boss'); floatText(r.bx, r.by - 30, L2('¡UN REY MARINO BEBÉ!', 'A BABY SEA KING!'), '#ffd040'); mpSay(0, '¡Jajaja! ¡Es enorme! …Lo soltamos, que es un bebé.', 'Hahaha! It’s huge! …Let’s let it go, it’s a baby.'); floatText(P.x, P.y - 60, '+' + g.toLocaleString() + ' ' + L2('oro', 'gold'), '#ffd040'); }
    else if (ITEMS[id] && giveItem(id, 1)) { A.got.push(id); sfx('coin'); floatText(r.bx, r.by - 24, ITEMS[id].n, '#bff0ff'); for (let i = 0; i < 8; i++) part(r.bx, r.by, { vz: 40 + Math.random() * 40, vx: (Math.random() - 0.5) * 60, g: 120, life: 0.6, c: '#d8f4ff', s: 2 }); }
    mpNext(A); return true;
  }
  if (A.ph === 'wait') { floatText(P.x, P.y - 50, L2('¡Demasiado pronto! Se asustó.', 'Too soon! It got scared.'), '#ff9a8a'); mpNext(A); return true; }
  return true;
}
function mpEnd() {
  const A = ACT, P = G.P, n = A.got.length; actEnd(); P.mpescaN = (P.mpescaN || 0) + n;
  const g = 3000 + n * 4000; P.gold += g; markDirty(true);
  banner('🎣 ' + L2('Fin de la pesca', 'Fishing done') + ' · ' + n + '/6', '+' + g.toLocaleString() + ' ' + L2('oro', 'gold') + (P.baratieSanji ? L2(' · Sanji cocinará lo pescado', ' · Sanji will cook the catch') : ''));
}
hookAround('updatePlayer', (next, dt) => { if (ACT.k !== 'mpesca') return next(dt); const P = G.P; setAnim(P, 'idle', true); });
hookBefore('basicAttack', () => { if (ACT.k === 'mpesca') { mpAtk(); return HOOK_SKIP; } });
// mientras se pesca, ⚔ no dispara los cañones del Merry
hookAround('nvOn', next => ACT.k === 'mpesca' ? false : next());
// la cámara mira hacia la popa para que se vean los corchos en el agua
hookAfter('updateCamera', () => { if (ACT.k !== 'mpesca' || !G.map || !G.map.dawn) return; const P = G.P, side = P.dir === 'left' ? -1 : 1; G.cam.x = Math.round(P.x - VW / 2 - 90 * side); G.cam.y = Math.round(P.y - VH / 2 + 10); });
V33_TICKS.push(() => {
  const A = ACT; if (A.k !== 'mpesca') return;
  if (!v631OnMerry()) { actEnd(); return; }
  if (A.ph === 'wait' && G.t >= A.t) { A.ph = 'bite'; A.t = G.t + 0.8; sfx('ui'); }
  else if (A.ph === 'bite' && G.t >= A.t) { floatText(G.P.x, G.P.y - 50, L2('Se escapó…', 'It got away…'), '#c8c8d0'); mpNext(A); }
  if (ACT.k === 'mpesca') mgHud(`🎣 ${L2('Lance', 'Cast')} ${Math.min(A.casts + 1, A.max)}/${A.max} · 🐟 ${A.got.length}${A.ph === 'bite' ? ' · <b style="color:#ffd040">¡' + L2('PICA', 'BITE') + '! ⚔</b>' : ''}`);
});
DL_HOOKS.push((list, cx, cy) => {
  if (ACT.k !== 'mpesca' || !G.map || !G.map.dawn) return; const P = G.P, side = P.dir === 'left' ? -1 : 1;
  mpRodders().forEach((r, k) => list.push({ type: 'xdraw', x: r.bx, y: r.by + 40, noShadow: true, draw: () => {
    const bite = ACT.ph === 'bite' && ACT.who === k, dip = bite ? 3 + Math.sin(G.t * 30) * 2 : Math.sin(G.t * 3 + k) * 1.2;
    const hx = r.x - cx - 6 * side, hy = r.y - cy - 22, tx = hx - 22 * side, ty = hy - 14, bx = r.bx - cx, by = r.by - cy + dip;
    ctx.strokeStyle = '#6a4a26'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.strokeStyle = 'rgba(240,240,240,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo((tx + bx) / 2, Math.max(ty, by) + 10, bx, by - 2); ctx.stroke();
    ctx.fillStyle = '#e83a32'; ctx.fillRect(Math.round(bx - 2), Math.round(by - 4), 5, 3); ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(bx - 2), Math.round(by - 1), 5, 2);
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(bx, by + 2, 6 + (bite ? 4 : 0), 2, 0, 0, 7); ctx.stroke();
    if (bite) { ctx.fillStyle = '#ffd040'; ctx.font = 'bold 14px monospace'; ctx.fillText('!', Math.round(r.x - cx - 3), Math.round(r.y - cy - 52)); }
  } }));
});

// ===================== 12 · BANQUETE DE LA TRIPULACIÓN =====================
const FEAST_ARCS = { shells_morgan: 'Shells Town', orange_buggy: 'Orange Town', syrup_kuro: L2('Villa Syrup', 'Syrup Village'), baratie_krieg: 'Baratie', con_arlong: 'Arlong Park', logue_arc_smoker: 'Loguetown', dawn_shanks_boss: 'Shanks', inf_bluejam: L2('Recuerdo de los hermanos', 'Memory of the brothers'), shimo_kuina: 'Shimotsuki', mhq_garp: 'Garp' };
hookAfter('bossKilled', (r, m) => {
  const P = G.P; if (!P || !m || !FEAST_ARCS[m.mid] || !P.dawnCrewJoined) return;
  P.feastSeen = P.feastSeen || {}; if (P.feastSeen[m.mid]) return; P.feastSeen[m.mid] = 1; P.feastReady = (P.feastReady || 0) + 1; markDirty();
  setTimeout(() => toast('🍖 ' + L2('¡Banquete pendiente en el Going Merry por ', 'Feast waiting on the Going Merry for ') + FEAST_ARCS[m.mid] + '!', 'quest', 6), 4000);
});
const feastCan = P => !!P && (P.feastReady > 0 || P.feastDay !== v631Day());
function feastGo() { const P = G.P; if (!v631OnMerry() || !feastCan(P)) return; closeModal(); P._feastGo = 1; mbGoDown(); }
function feastStart() {
  const M = G.map, P = G.P; if (!M || !M.merryBajo || actBusy() || !feastCan(P)) return; closeDialog();
  const arc = P.feastReady > 0; if (arc) P.feastReady--; else P.feastDay = v631Day();
  const crew = (M.mbCrew || []).filter(e => !e.remove);
  crew.forEach((e, i) => { const a = i / Math.max(1, crew.length) * Math.PI * 2; e._fs = { x: e.x, y: e.y, scene: e.scene }; e.x = 14 * 16 + 8 + Math.cos(a) * 46; e.y = 9 * 16 + 8 + Math.sin(a) * 30; e.scene = true; });
  P.x = 14 * 16 + 8; P.y = 12 * 16; P.dir = 'up'; updateCamera(0, true);
  Object.assign(ACT, { k: 'feast', t: G.t, end: G.t + 22, arc, cheers: 0, crew, onAtk: () => { ACT.cheers++; floatText(G.P.x, G.P.y - 48, ['🍖', '🍻', '🎶', '¡Kanpai!'][ACT.cheers % 4], '#ffd040'); return true; } });
  banner('🍖 ' + L2('¡Banquete!', 'Feast!'), L2('La tripulación baila · pulsa ⚔ para brindar', 'The crew dances · press ⚔ to toast'));
  const say = (id, es, en) => { const e = crew.find(c => c.id === id); if (e) shellsRescueSpeak(e, es, en); };
  say(SHELLS_CAST_IDS.luffy, '¡¡CARNE!! ¡Sanji, más carne!', 'MEAT!! Sanji, more meat!');
  setTimeout(() => say(BAR_SANJI, 'Primero las damas. Nami, tu postre de mandarina.', 'Ladies first. Nami, your tangerine dessert.'), 3500);
  setTimeout(() => say(SYRUP_USOPP, '¡Y ahora el baile de los palillos del gran Usopp!', 'And now the great Usopp’s chopstick dance!'), 7500);
  setTimeout(() => say(SHELLS_CAST_IDS.zoro, '…Pásame otra botella.', '…Pass me another bottle.'), 11500);
  setTimeout(() => say(ORANGE_NAMI, '¡Qué tripulación! Ni un berry ahorrado… pero bueno, hoy toca.', 'What a crew! Not a single berry saved… but fine, today we celebrate.'), 15000);
}
function feastEnd() {
  const A = ACT, P = G.P; actEnd();
  for (const e of A.crew || []) if (e._fs && !e.remove) { e.x = e._fs.x; e.y = e._fs.y; e.scene = e._fs.scene; e.z = 0; setAnim(e, 'idle', true); delete e._fs; }
  const g = (A.arc ? 50000 : 10000) + A.cheers * 500; P.gold += g;
  P.mbMeal = { k: 'carne', q: 3, until: Date.now() + 20 * 60 * 1000 }; addBuff(P, 'mb_comida', MB_DISH.carne.st(3), 20 * 60);
  banner('🍖 ' + L2('¡Qué banquete!', 'What a feast!'), '+' + g.toLocaleString() + ' ' + L2('oro · carne del capitán ★★★ 20 min', 'gold · captain’s meat ★★★ 20 min')); markDirty(true);
}
V33_TICKS.push(() => {
  const M = G.map, P = G.P; if (!M || !P) return;
  if (M.merryBajo && P._feastGo && M.mbCrew && !ACT.k && !G.fading) { P._feastGo = 0; feastStart(); }
  if (ACT.k !== 'feast') return; const A = ACT;
  if (!M.merryBajo || P.dead) { feastEnd(); return; }
  A.crew.forEach((e, i) => { if (e.remove) return; e.z = Math.abs(Math.sin(G.t * 6 + i)) * 7; e.dir = ['down', 'left', 'up', 'right'][Math.floor(G.t * 2 + i) % 4]; e.anim = 'walk'; e.af = Math.floor(G.t * 8 + i) % 4; });
  if (Math.random() < 0.35) part(14 * 16 + (Math.random() - 0.5) * 160, 7 * 16 + Math.random() * 60, { vz: 30 + Math.random() * 30, vx: (Math.random() - 0.5) * 30, g: 40, life: 1.2, c: ['#ff6a8a', '#ffd040', '#6ad0ff', '#8aff8a'][Math.floor(Math.random() * 4)], s: 2 });
  if (Math.random() < 0.04) floatText(14 * 16 + (Math.random() - 0.5) * 120, 7 * 16, '♪', '#fff2c0');
  mgHud(`🍖 ${L2('Banquete', 'Feast')} · ${Math.ceil(A.end - G.t)} s · 🍻 ${A.cheers}`);
  if (G.t >= A.end) feastEnd();
});
DLG_HOOKS.push((npc, opts) => { const M = G.map; if (!npc || !M || !M.merryBajo || ACT.k) return; if ((npc.id === SHELLS_CAST_IDS.luffy || npc.id === BAR_SANJI) && feastCan(G.P)) opts.unshift({ label: '🍖 ' + L2('¡Banquete de la tripulación!', 'Crew feast!') + (G.P.feastReady > 0 ? ' · ' + L2('fin de arco', 'arc cleared') : ' · ' + L2('hoy', 'today')), icon: ['talk'], fn: feastStart }); });

// ===================== 13 · MAPAS DE NAMI =====================
const NAMI_ISLES = [
  ['foosha', L2('Villa Foosha y Goa', 'Foosha Village and Goa'), 100, 20, 660, 330], ['lgarden', 'Little Garden', 790, 40, 1090, 270], ['shells', 'Shells Town', 1240, 30, 1570, 270],
  ['orange', 'Orange Town', 320, 410, 810, 630], ['rare', L2('Isla de los Animales Raros', 'Island of Rare Animals'), 1140, 460, 1380, 610], ['logue', 'Loguetown', 1424, 416, 1632, 672],
  ['syrup', L2('Villa Syrup', 'Syrup Village'), 700, 700, 1210, 990], ['conomi', L2('Islas Conomi', 'Conomi Islands'), 1264, 768, 1456, 923],
  ['shimo', L2('Aldea Shimotsuki', 'Shimotsuki Village'), 70, 730, 270, 910], ['mhq', L2('Cuartel de la Marina', 'Navy HQ'), 420, 730, 660, 966]];
const NAMI_GOLD = 60000, NAMI_ALL = 300000;
function namiPoints(M, isle) {
  const [, , x0, y0, x1, y1] = isle; let pois = []; try { pois = otherPOI(M) || []; } catch (e) { }
  const seen = new Set();
  return pois.filter(q => { if (!q || q.c === 'boss' || q.x < x0 || q.x > x1 || q.y < y0 || q.y > y1) return false; const tx = Math.round(q.x), ty = Math.round(q.y), t = M.ter[M.I(tx, ty)]; if (t === T.DEEP || t === T.WATER) return false; const k = tx + ',' + ty; if (seen.has(k)) return false; seen.add(k); return true; })
    .map(q => ({ k: Math.round(q.x) + ',' + Math.round(q.y), x: q.x, y: q.y, t: q.t }));
}
let namiT = 0;
V33_TICKS.push(dt => {
  namiT += dt || 0.016; if (namiT < 1) return; namiT = 0;
  const M = G.map, P = G.P; if (!M || !M.dawn || !P || P.dead || P.dawnHelm || !P.dawnCrewJoined) return;
  const tx = P.x / 16, ty = P.y / 16, isle = NAMI_ISLES.find(i => tx >= i[2] && tx <= i[4] && ty >= i[3] && ty <= i[5]); if (!isle) return;
  P.namiMap = P.namiMap || {}; P.namiDone = P.namiDone || {}; if (P.namiDone[isle[0]]) return;
  const pts = namiPoints(M, isle); if (!pts.length) return; const got = P.namiMap[isle[0]] = P.namiMap[isle[0]] || [];
  for (const q of pts) { if (got.includes(q.k) || (q.x - tx) ** 2 + (q.y - ty) ** 2 > 36) continue; got.push(q.k); markDirty();
    toast('🗺 ' + L2('Nami apunta en su mapa: ', 'Nami notes on her map: ') + q.t + ' (' + pts.filter(p => got.includes(p.k)).length + '/' + pts.length + ')', 'info', 4); }
  if (pts.every(p => got.includes(p.k))) { P.namiDone[isle[0]] = 1; P.gold += NAMI_GOLD; sfx('quest'); markDirty(true);
    banner('🗺 ' + L2('Mapa terminado: ', 'Map finished: ') + isle[1], L2('Nami: «¡Precioso! Otra isla en mi mapa del mundo.» +', 'Nami: "Beautiful! Another island on my world map." +') + NAMI_GOLD.toLocaleString() + ' ' + L2('oro', 'gold'));
    if (NAMI_ISLES.every(i => P.namiDone[i[0]])) setTimeout(() => { P.gold += NAMI_ALL; banner('🗺 ' + L2('¡El mapa del Mar de Dawn está completo!', 'The Dawn Sea map is complete!'), '+' + NAMI_ALL.toLocaleString() + ' ' + L2('oro', 'gold')); markDirty(true); }, 3500); }
});
function namiMapText() { const P = G.P || {}, M = G.maps && G.maps.dawn; return NAMI_ISLES.map(i => { const pts = M ? namiPoints(M, i) : [], got = ((P.namiMap || {})[i[0]] || []).filter(k => pts.some(p => p.k === k)).length; return ((P.namiDone || {})[i[0]] ? '✅ ' : '⬜ ') + i[1] + ' · ' + ((P.namiDone || {})[i[0]] ? pts.length : got) + '/' + (pts.length || '?'); }); }
DLG_HOOKS.push((npc, opts) => { if (npc && npc.id === ORANGE_NAMI && (npc.aboard || (G.map && G.map.merryBajo))) opts.unshift({ label: '🗺 ' + L2('Mapas de Nami', 'Nami’s maps'), icon: ['talk'], fn: () => { setOpts([{ label: L2('Volver', 'Back'), fn: () => dialogMenu() }]); typeText(L2('Pasa por todos los lugares de cada isla y la dibujo entera. ', 'Visit every place on each island and I’ll draw all of it. ') + namiMapText().join(' · ')); } }); });

// ===================== 14 · DEN DEN MUSHI =====================
const DDM_CALLS = [
  ['garp', 'Garp', '¡Bwahaha! ¿Sigues navegando con mi nieto? Ven al Cuartel de la Marina, que te invito a galletas.', 'Bwahaha! Still sailing with my grandson? Come to Navy HQ, I’ll treat you to crackers.', 'go', () => typeof mhqAt === 'function' ? mhqAt(120, 112) : [540, 842], L2('Cuartel de la Marina', 'Navy HQ'), 0, 80000],
  ['makino', 'Makino', '¡Hola! ¿Me traes 3 peces del Mar de Dawn a Partys Bar? Los clientes los piden mucho.', 'Hi! Could you bring 3 Dawn Sea fish to Partys Bar? Customers keep asking for them.', 'fish', () => [526, 252], 'Partys Bar · Foosha', 3, 70000],
  ['zeff', 'Zeff', 'Aquí el Baratie. Me faltan 4 peces de Dawn para el menú de hoy. Tráelos, mocoso.', 'Baratie here. I’m 4 Dawn fish short for today’s menu. Bring them, brat.', 'fish', () => typeof BARATIE_X !== 'undefined' ? [BARATIE_X, BARATIE_Y] : [936, 638], 'Baratie', 4, 90000],
  ['johnny', 'Johnny', '¡Aniki! Hay piratas por todo el Mar de Dawn. ¡Acaba con 12 y nos repartimos la recompensa!', 'Aniki! There are pirates all over the Dawn Sea. Take down 12 and we’ll split the bounty!', 'kill', null, '', 12, 90000],
  ['gaimon', 'Gaimon', '¡Oye! Los animales raros están nerviosos. ¿Puedes pasar por mi isla a ver qué pasa?', 'Hey! The rare animals are nervous. Could you stop by my island and see what’s up?', 'go', () => typeof RARE_PIER !== 'undefined' ? RARE_PIER : [1244, 459], L2('Isla de los Animales Raros', 'Island of Rare Animals'), 0, 60000],
  ['kaya', 'Kaya', 'Soy Kaya. ¿Cómo está Usopp? Pasa por Villa Syrup cuando puedas, tengo algo para la tripulación.', 'It’s Kaya. How is Usopp? Stop by Syrup Village when you can, I have something for the crew.', 'go', () => typeof SYRUP_PIER !== 'undefined' ? SYRUP_PIER : [950, 735], L2('Villa Syrup', 'Syrup Village'), 0, 70000],
  ['smoker', 'Smoker', '…Te tengo localizado. Mis hombres van a por ti. A ver cuántos tumbas.', '…I’ve got you located. My men are coming for you. Let’s see how many you take down.', 'marine', null, '', 6, 110000]];
const DDM_PER_DAY = 3, DDM_FISH = ['pz_dw_coralino', 'pz_dw_barracuda', 'pz_dw_nacar', 'pz_dw_espada', 'pz_dw_marea', 'pz_dw_rey'];
const ddmFishN = () => DDM_FISH.reduce((a, id) => a + (ITEMS[id] ? countItem(id) : 0), 0);
const ddmCall = k => DDM_CALLS.find(c => c[0] === k);
function ddmLeft() { const P = G.P, d = v631Day(); return P.ddmDay && P.ddmDay.d === d ? Math.max(0, DDM_PER_DAY - P.ddmDay.n) : DDM_PER_DAY; }
function ddmRinging() { const P = G.P; return !!P && !P.ddm && ddmLeft() > 0; }
function ddmOpen() {
  const P = G.P; closeModal();
  if (P.ddm) { const C = ddmCall(P.ddm.k); xMsg('🐌 Den Den Mushi', L2('Encargo de ', 'Task from ') + '<b>' + C[1] + '</b>: ' + ddmGoal(P.ddm), [[L2('Cancelar encargo', 'Cancel task'), () => { P.ddm = null; if (P.wp && P.wp.ddm) P.wp = null; closeModal(); markDirty(); }], [L2('Cerrar', 'Close'), closeModal]]); return; }
  if (!ddmLeft()) { xMsg('🐌 Den Den Mushi', L2('El caracol duerme. Hoy ya no llama nadie más (3 llamadas al día).', 'The snail is asleep. Nobody else will call today (3 calls a day).')); return; }
  let C; do { C = DDM_CALLS[Math.floor(Math.random() * DDM_CALLS.length)]; } while (C[0] === ddmOpen.last && DDM_CALLS.length > 1); ddmOpen.last = C[0];
  xMsg('🐌 ' + L2('¡Purupuru! Llama ', 'Purupuru! Call from ') + C[1], '«' + L2(C[2], C[3]) + '»<br><br>' + L2('Premio: ', 'Reward: ') + C[8].toLocaleString() + ' ' + L2('oro', 'gold'), [
    [L2('Aceptar', 'Accept'), () => { const d = v631Day(); if (!P.ddmDay || P.ddmDay.d !== d) P.ddmDay = { d, n: 0 }; P.ddmDay.n++;
      P.ddm = { k: C[0], have: 0, need: C[7] }; if (C[5]) { setWp({ loc: C[5](), m: 'dawn', t: '🐌 ' + C[6] }); if (P.wp) P.wp.ddm = 1; } closeModal(); markDirty(); toast('🐌 ' + ddmGoal(P.ddm), 'quest', 5); }],
    [L2('Colgar', 'Hang up'), closeModal]]);
}
function ddmGoal(T) { const C = ddmCall(T.k); if (!C) return ''; if (C[4] === 'go') return L2('Ve a ', 'Go to ') + C[6] + '.'; if (C[4] === 'fish') return L2('Lleva ', 'Bring ') + C[7] + L2(' peces de Dawn a ', ' Dawn fish to ') + C[6] + ' (' + Math.min(ddmFishN(), C[7]) + '/' + C[7] + ').'; if (C[4] === 'kill') return L2('Vence a ', 'Defeat ') + C[7] + L2(' enemigos en el Mar de Dawn', ' enemies in the Dawn Sea') + ' (' + T.have + '/' + C[7] + ').'; return L2('Vence a ', 'Defeat ') + C[7] + L2(' marines', ' marines') + ' (' + T.have + '/' + C[7] + ').'; }
function ddmDone() { const P = G.P, C = ddmCall(P.ddm.k); P.ddm = null; if (P.wp && P.wp.ddm) P.wp = null; P.ddmN = (P.ddmN || 0) + 1; P.gold += C[8]; sfx('quest'); markDirty(true); banner('🐌 ' + L2('Encargo cumplido: ', 'Task done: ') + C[1], '+' + C[8].toLocaleString() + ' ' + L2('oro', 'gold')); }
hookAfter('killMob', (r, m) => { const P = G.P; if (!P || !P.ddm || !m || m.map !== 'dawn' || m.boss) return; const C = ddmCall(P.ddm.k); if (!C) return; const marine = /marine|mhq_/.test(m.mid || ''); if (C[4] === 'kill' || (C[4] === 'marine' && marine)) { P.ddm.have++; if (P.ddm.have >= C[7]) ddmDone(); else if (P.ddm.have % 3 === 0) toast('🐌 ' + ddmGoal(P.ddm), 'info', 3); } });
let ddmT = 0, ddmRang = -1;
V33_TICKS.push(dt => {
  ddmT += dt || 0.016; if (ddmT < 1) return; ddmT = 0; const P = G.P, M = G.map; if (!P || !M || !M.dawn) return;
  if (P.ddm) { const C = ddmCall(P.ddm.k); if (!C) { P.ddm = null; return; } if ((C[4] === 'go' || C[4] === 'fish') && C[5]) { const [x, y] = C[5](); if ((P.x / 16 - x) ** 2 + (P.y / 16 - y) ** 2 < 14 * 14) { if (C[4] === 'go') ddmDone(); else if (ddmFishN() >= C[7]) { let n = C[7]; for (const id of DDM_FISH) while (n > 0 && ITEMS[id] && countItem(id) > 0) { takeItem(id, 1); n--; } ddmDone(); } } } }
  else if (v631OnMerry() && ddmRinging() && ddmRang !== v631Day()) { ddmRang = v631Day(); toast('🐌 ' + L2('¡Purupuru! El Den Den Mushi del Merry está sonando (menú del barco).', 'Purupuru! The Merry’s Den Den Mushi is ringing (ship menu).'), 'quest', 6); }
});

// ===================== MENÚ DEL BARCO =====================
hookBefore('xMsg', (title, html, btns) => {
  if (typeof DAWN_MERRY_NAME === 'undefined' || title !== DAWN_MERRY_NAME || !Array.isArray(btns) || !v631OnMerry() || btns.some(b => b && b.v631)) return;
  const P = G.P, add = (label, fn) => { const b = [label, fn]; b.v631 = 1; btns.push(b); };
  add('🎣 ' + L2('Pescar en la popa con Luffy', 'Fish off the stern with Luffy') + (P.syrupUsopp ? L2(' y Usopp', ' and Usopp') : ''), mpStart);
  if (P.syrupUsopp) add('🤥 ' + L2('Historias de Usopp', 'Usopp’s stories'), () => { closeModal(); usoppStory(0); });
  if (feastCan(P)) add('🍖 ' + L2('Banquete en el comedor', 'Feast in the dining room') + (P.feastReady > 0 ? ' · ' + L2('¡fin de arco!', 'arc cleared!') : ''), feastGo);
  add('🐌 Den Den Mushi' + (P.ddm ? ' · ' + L2('encargo', 'task') : ddmRinging() ? ' · ¡' + L2('suena', 'ringing') + '!' : ''), ddmOpen);
  add('🗺 ' + L2('Mapas de Nami', 'Nami’s maps'), () => { closeModal(); xMsg('🗺 ' + L2('Mapas de Nami', 'Nami’s maps'), L2('Pasa por todos los lugares de cada isla (a pie) y Nami la dibuja: 60.000 de oro por isla y 300.000 al completar el Mar de Dawn.', 'Visit every place on each island (on foot) and Nami draws it: 60,000 gold per island and 300,000 for completing the Dawn Sea.') + '<br><br>' + namiMapText().join('<br>')); });
});

// ===================== MAPA Y LUPA =====================
{ const e = MAPW_LIST.find(m => m.id === 'dawn'); if (e) e.n = L2('Mar de Dawn · todas las islas (Foosha, Shells Town, Orange Town, Syrup, Baratie, Conomi, Loguetown, Shimotsuki, la Marina…)', 'Dawn Sea · every island (Foosha, Shells Town, Orange Town, Syrup, Baratie, Conomi, Loguetown, Shimotsuki, the Navy…)'); }
LUPA_DAWN.push(['merry631', () => '⛵ ' + L2('Vida a bordo del Merry', 'Life aboard the Merry'), () => {
  const P = G.P || {}, S = dawnSky(); return [
    L2('Todo desde el menú del barco (Hablar con la tripulación) o hablando con cada tripulante.', 'Everything from the ship menu (Talk to the crew) or by talking to each crewmate.'),
    '🎣 ' + L2('Pesca en la popa con Luffy y Usopp: 6 lances, pulsa ⚔ cuando pique un corcho (el «!»). Peces de Dawn, botas viejas y, a veces, un Rey Marino bebé (100.000 de oro). Peces pescados: ', 'Fishing off the stern with Luffy and Usopp: 6 casts, press ⚔ when a float bites (the "!"). Dawn fish, old boots and sometimes a baby Sea King (100,000 gold). Fish caught: ') + (P.mpescaN || 0),
    '🤥 ' + L2('Historias de Usopp: ¿verdad o mentira? Las 5 primeras que aciertes cada día dan 20.000 de oro. Mejor racha: ', 'Usopp’s stories: true or lie? Your first 5 right answers each day give 20,000 gold. Best streak: ') + (P.usoppBest || 0),
    '🍖 ' + L2('Banquete: al terminar cada arco por primera vez (y una vez al día) la tripulación baila en el comedor. 50.000 de oro (10.000 el diario) y carne del capitán ★★★ 20 min. Pendientes: ', 'Feast: after clearing each arc for the first time (and once a day) the crew dances in the dining room. 50,000 gold (10,000 the daily one) and captain’s meat ★★★ 20 min. Pending: ') + (P.feastReady || 0),
    '🗺 ' + L2('Mapas de Nami (a pie, Nami no pelea): ', 'Nami’s maps (on foot, Nami doesn’t fight): ') + namiMapText().join(' · '),
    '🐌 ' + L2('Den Den Mushi: 3 llamadas al día (Garp, Makino, Zeff, Johnny, Gaimon, Kaya, Smoker). Encargos cumplidos: ', 'Den Den Mushi: 3 calls a day (Garp, Makino, Zeff, Johnny, Gaimon, Kaya, Smoker). Tasks done: ') + (P.ddmN || 0) + (P.ddm ? ' · ' + L2('Ahora: ', 'Now: ') + ddmGoal(P.ddm) : ''),
    '🌅 ' + L2('Día, tarde y noche: el Mar de Dawn sigue el reloj de arriba. Ahora: ', 'Day, afternoon and night: the Dawn Sea follows the clock at the top. Now: ') + S.part];
}, () => { const P = G.P; if (P && P.ddm) { const C = ddmCall(P.ddm.k); if (C && C[5]) return { loc: C[5](), m: 'dawn', t: '🐌 ' + C[6] }; } return null; }]);
