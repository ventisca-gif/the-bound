// 6.31 · Romance con Nami (Sergio: «a Nami una opción de enamorarla con sus propios diálogos y todo el sistema de
// pareja hasta casarse, tener hijos que combinen el color del pelo… y todas las animaciones e interacciones existentes»).
// Nami entra en ROM como las demás parejas: Confianza y Amor, charlar, coquetear, regalos, abrazo, beso, paseo de la
// mano, pareja (Colgante de Promesa), vivir en tu casa, boda (Anillo de Bodas, en la plaza de un pueblo del mundo),
// cenar, bailar, regalo de aniversario e hijos (mezclan tu pelo, ojos y piel con los suyos: pelo naranja, ojos café).
// - Sus frases de charla, coqueteo y pareja son propias (le gustan el oro, los tesoros y las mandarinas).
// - Su sprite del Mar de Dawn no tiene abrazo ni beso: en esas escenas se usa un dibujo del motor con su ropa de
//   navegante (camiseta de rayas, falda naranja, sandalias; cosméticos de la 5.87) que sí tiene todas las animaciones.
// - Hablando con ella a bordo (sin cuerpo en el mapa), las escenas la ponen a tu lado en cubierta un momento.
// - En el Mar de Dawn ya navega contigo: el paseo de la mano y la boda son en tierra firme del mundo (o desde tu casa).
const NAMI_ID = ORANGE_NAMI;
ROM[NAMI_ID] = { g: 'f', loves: ['gem', 'relic', 'ring'], likes: ['crop', 'cake', 'bouquet', 'food'], hates: ['fang', 'bone', 'spore'], taste: L2('los tesoros, las joyas y las mandarinas', 'treasure, jewels and tangerines') };
ROM_WHERE[NAMI_ID] = L2('Going Merry (Mar de Dawn)', 'Going Merry (Dawn Sea)');
// aspecto para el motor (boda, hijos y retrato de pareja): pelo naranja, ojos café, piel clara
NPCS[NAMI_ID].look = LK({ hair: HAIRS.naranja, hairStyle: 'long', eyes: 'cafe', skin: SKINS[0], outfit: 'tunic', main: P5(['#3a5a8a', '#5a80b0', '#e8eef6', '#f6f8fc', '#ffffff']), sec: P5(['#7a3408', '#b0520e', '#e07818', '#f09a3a', '#ffc070']) });
if (typeof WED_SPOUSE_LINES === 'object') WED_SPOUSE_LINES[NAMI_ID] = L2('¡La navegante del Going Merry se casa! ¿Cobrará entrada?', 'The Going Merry’s navigator is getting married! Will she charge admission?');
function namiRomAtlas() {
  return getAtlas('nami:rom', () => {
    const app = normApp({ ...DEF_APP, g: 'f', bt: 1, hs: 6, hair: 'naranja', eyes: 'cafe', skin: 0, top: [0, 'blanco'], bot: [0, 'naranja'], shoe: [0, 'marron'] });
    const cos = {}; for (const [s, id] of [['body', 'c_rm_nav_camiseta'], ['legs', 'c_rm_nav_falda'], ['feet', 'c_rm_nav_sandalias']]) if (COSM[id]) cos[s] = id;
    const L = heroLook('guerrero', app, { weapon: 0 }, cos, {}); L.weapon = null; L.back = null;
    return buildHeroAtlas(L);
  });
}
const namiIs = npc => !!npc && relKey(npc.id) === NAMI_ID;
// abrazo, beso y propuesta: dibujo con todas las animaciones; si se habla a bordo, aparece a tu lado un momento
hookAround('romScene', (next, npc, kind, done) => {
  if (!namiIs(npc)) return next(npc, kind, done);
  const P = G.P; let e = npc, tmp = null;
  if (!Number.isFinite(npc.x) || npc.map !== (G.map && G.map.id)) { tmp = e = spawnNPC(NAMI_ID, P.x + 16, P.y, G.map.id, { face: 'left', hgt: 58, scene: 1, noTag: 1 }); }
  const old = e.atlas; e.atlas = namiRomAtlas();
  return next(e, kind, () => { e.atlas = old; if (tmp) tmp.remove = true; if (done) done(); });
});
hookBefore('coupleDance', npc => { if (namiIs(npc) && !Number.isFinite(npc.x)) { toast(L2('Nami: «En cubierta no, que se mueve. Bailemos en tierra o en casa.»', 'Nami: "Not on deck, it’s moving. Let’s dance on land or at home."'), 'info', 4); return HOOK_SKIP; } });
hookBefore('startComp', e => { if (!namiIs(e)) return; const M = G.map; if (!Number.isFinite(e.x) || !e.home || (M && (M.dawn || M.merryBajo))) { toast(L2('Nami: «Ya navego contigo. Paseemos de la mano en tierra firme (en tu casa o por el mundo).»', 'Nami: "I already sail with you. Let’s walk hand in hand on dry land (at home or around the world)."'), 'info', 5); return HOOK_SKIP; } });
hookBefore('startWedding', src => { if (!namiIs(src)) return; const M = G.map; if (M && (M.dawn || M.merryBajo || M.mhqHall || M.logueShop || M.tortuga)) { toast(L2('Nami: «¡Sí! Pero en una plaza de verdad: vuelve al mundo o pídemelo en casa.»', 'Nami: "Yes! But in a real town square: go back to the world or ask me at home."'), 'quest', 6); return HOOK_SKIP; } });
// a bordo no tiene cuerpo: las escenas que lo necesitan la colocan a tu lado (coordenadas de cortesía)
hookBefore('romanceMenu', npc => { if (namiIs(npc) && !Number.isFinite(npc.x) && G.P) { npc.x = G.P.x + 16; npc.y = G.P.y; } });

// ---------- sus frases ----------
const NAMI_TALK = [
  [L2('¿Tú otra vez? Si vienes a pedir dinero prestado, el interés es del 300 %.', 'You again? If you’re here to borrow money, the interest is 300%.'), L2('Estoy dibujando la costa de esta isla. No me muevas la mesa.', 'I’m drawing this island’s coastline. Don’t bump my table.'), L2('Si quieres caerme bien… los tesoros, las joyas y las mandarinas hablan por ti.', 'If you want to get on my good side… treasure, jewels and tangerines speak for you.')],
  [L2('Hoy el viento viene del suroeste. ¿Quieres que te enseñe a leer las nubes?', 'The wind’s coming from the southwest today. Want me to teach you to read the clouds?'), L2('Te dejo mirar mi mapa nuevo. Sin tocar, ¿eh?', 'I’ll let you look at my new map. No touching, okay?'), L2('Contigo a bordo hay menos problemas… bueno, un poco menos.', 'With you aboard there’s less trouble… well, a bit less.')],
  [L2('Los mandarinos de Bell-mère… algún día te llevo a verlos a Cocoyashi.', 'Bell-mère’s tangerine trees… someday I’ll take you to see them in Cocoyashi.'), L2('No se lo digas a Luffy, pero me alegra que estés en la tripulación.', 'Don’t tell Luffy, but I’m glad you’re on the crew.'), L2('He dibujado tu silueta en una esquina del mapa. Por si te pierdes.', 'I drew your silhouette in a corner of the map. In case you get lost.')],
  [L2('Eres el único tesoro que no pienso vender ♥', 'You’re the only treasure I’m not going to sell ♥'), L2('Cuando termine el mapa del mundo, quiero que tu nombre esté en él.', 'When I finish the map of the world, I want your name on it.'), L2('Prométeme que volverás de cada isla. Sin ti el Merry está demasiado tranquilo.', 'Promise me you’ll come back from every island. Without you the Merry is too quiet.')]];
const NAMI_FLIRT_OK = [
  [L2('¡Jaja! ¿Eso es un piropo o una deuda?', 'Haha! Is that a compliment or a debt?'), L2('Eres muy directo… me gusta.', 'You’re very direct… I like it.')],
  [L2('Tonto… ¡no me hagas sonrojar delante de Sanji!', 'Silly… don’t make me blush in front of Sanji!'), L2('Vale, eso ha valido por lo menos un berry.', 'Okay, that was worth at least one berry.')],
  [L2('Tú siempre sabes qué decir ♥', 'You always know what to say ♥'), L2('Ven aquí, navegante de mi corazón ♥', 'Come here, navigator of my heart ♥')]];
const NAMI_FLIRT_KO = [L2('Eso te costará 10.000 berries.', 'That’ll cost you 10,000 berries.'), L2('¿Perdona? Sigue con tus misiones, anda.', 'Excuse me? Get back to your missions.'), L2('Ahora no, que viene una tormenta.', 'Not now, a storm is coming.'), L2('Jaja, no. Inténtalo otro día.', 'Haha, no. Try another day.')];
hookAround('romTalk', (next, npc) => {
  if (!namiIs(npc)) return next(npc);
  const k = NAMI_ID, R = rel(k), h = hearts(R.t), line = pick(NAMI_TALK[h < 2 ? 0 : h < 5 ? 1 : h < 8 ? 2 : 3]);
  if (cdLeft(R, 'ct', 120) > 0) { romanceMenu(npc, line); return; }
  R.ct = Date.now(); addRel(k, 12, R.a >= 100 ? 3 : 0, npc.x, npc.y - 36); romanceMenu(npc, line);
});
hookAround('romFlirt', (next, npc) => {
  if (!namiIs(npc)) return next(npc);
  const P = G.P, k = NAMI_ID, R = rel(k), cd = cdLeft(R, 'cf', 150);
  if (cd > 0) { romanceMenu(npc, L2('Ya me lo has dicho antes… cóbratelo otro día.', 'You already told me that… cash it in another day.') + ' (' + fmtTime(cd) + ')'); return; }
  R.cf = Date.now(); const rich = Math.min(0.1, (P.gold || 0) / 2e7), ch = clamp(0.38 + R.t / 2200 + R.a / 2600 + rich, 0.1, 0.95), say = '«' + pick(FLIRTS) + '»\n';
  if (Math.random() < ch) { const g = 18 + Math.floor(Math.random() * 15); addRel(k, 4, g, npc.x, npc.y - 36); for (let i = 0; i < 4; i++) setTimeout(() => floatText(npc.x + (Math.random() - 0.5) * 12, npc.y - 40, '♥', '#ff7ab0'), i * 120); sfx('quest');
    romanceMenu(npc, say + pick(NAMI_FLIRT_OK[hearts(R.a) < 3 ? 0 : hearts(R.a) < 7 ? 1 : 2])); }
  else { addRel(k, 0, -5, npc.x, npc.y - 36); sfx('hurt'); romanceMenu(npc, say + pick(NAMI_FLIRT_KO)); }
});
hookAround('romPartnerTalk', (next, npc) => {
  if (!namiIs(npc)) return next(npc);
  const P = G.P, k = NAMI_ID, R = rel(k), cd = cdLeft(R, 'cp', 1200);
  if (cd > 0) { romanceMenu(npc, pick([L2('Yo también te quiero ♥ …y no te cobro por decirlo.', 'I love you too ♥ …and I won’t charge you for saying it.'), L2('¿Cenamos mandarinas en la popa esta noche?', 'Tangerines on the stern tonight?')])); return; }
  R.cp = Date.now(); const T = Math.min(5, 1 + Math.floor(P.lv / 30)), gift = pick(['pocion' + T, 'eter' + T, 'ramo', 'pastel']); if (ITEMS[gift]) giveItem(gift, 2); P.gold += 5000;
  addRel(k, 6, 8, npc.x, npc.y - 36); romanceMenu(npc, L2('Toma, para el camino… y 5.000 berries. No te acostumbres ♥', 'Here, for the road… and 5,000 berries. Don’t get used to it ♥'));
});
// en el comedor del Merry y en la tripulación que baja a tierra, la opción sale como con cualquier pareja
LUPA_DAWN.push(['nami631', () => '💕 ' + L2('Romance con Nami', 'Romance with Nami'), () => {
  const P = G.P || {}, R = (P.rel || {})[NAMI_ID] || { t: 0, a: 0 }; return [
    L2('Habla con Nami (a bordo, en el comedor del Merry o cuando baja contigo a tierra) y elige «Relación ♥».', 'Talk to Nami (aboard, in the Merry’s dining room or when she comes ashore with you) and choose "Relationship ♥".'),
    L2('Todo el sistema de pareja: charlar, coquetear, regalos (le encantan las joyas, los tesoros y los anillos; le gustan las mandarinas, los pasteles y las flores), abrazo, beso, paseo de la mano, pareja con un Colgante de Promesa, vivir en tu casa, boda con un Anillo de Bodas, cenar, bailar y aniversario.', 'The whole couple system: chat, flirt, gifts (she loves jewels, treasure and rings; likes tangerines, cakes and flowers), hug, kiss, hand-in-hand walk, couple with a Promise Pendant, living at your house, wedding with a Wedding Ring, dinner, dance and anniversary.'),
    L2('Hijos: en tu casa con cuna, con 9 corazones de amor. Mezclan tu pelo, tus ojos y tu piel con los de Nami (pelo naranja, ojos café).', 'Children: at your house with a crib, with 9 hearts of love. They mix your hair, eyes and skin with Nami’s (orange hair, brown eyes).'),
    L2('En el Mar de Dawn ya navega contigo: el paseo de la mano y la boda son en tierra firme (el mundo o tu casa).', 'In the Dawn Sea she already sails with you: the hand-in-hand walk and the wedding happen on dry land (the world or your house).'),
    '♥ ' + L2('Confianza ', 'Trust ') + hearts(R.t) + '/10 · ' + L2('Amor ', 'Love ') + hearts(R.a) + '/10' + (P.spouse === NAMI_ID ? ' · 💍 ' + L2('casados', 'married') : P.partner === NAMI_ID ? ' · ' + L2('pareja', 'partner') : '')];
}, () => null]);
