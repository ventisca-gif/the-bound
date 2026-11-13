// ================= v4.13: LOS VIGÍAS DEL ALBA (campamento en la Costa Coral) =================
// Campamento al este de Albor (claro libre de 10x10 en 169-178, 168-177). Sus 8 miembros usan el dibujo de Sergio a
// tamaño original (6zyf_campamento_data.js), con su estilo propio. Ayudan y rescatan a la gente de los caminos.
// Si te unes (misión vig1) te dan su uniforme como cosmético (abrigo, pantalón y botas); se quita como cualquier otro.
// Lore: hace mil años el pescador Edrin Valcorde cuidó al primer portador del hilo vacío; sus descendientes son
// quienes te encontraron junto al río al empezar la historia.

// ---------- uniforme (cosmético, se ajusta solo a las 8 estructuras; en mujer lleva busto como toda la ropa) ----------
const VIG_PAL = {
  coat: P5(['#0a1c1c', '#12302e', '#1a443f', '#245a52', '#357566']), pad: P5(['#2a303a', '#4a5260', '#76808e', '#a2acba', '#cfd6e0']),
  pants: P5(['#1a1e24', '#2a3038', '#3c444e', '#525c68', '#6c7682']), boots: P5(['#1c100a', '#311e16', '#472c20', '#5e3c2c', '#7a543e']),
};
fitKind('body', 'vigcoat', (p, A, s) => {
  const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, P = s.s, m = s.m, belt = VIG_PAL.boots;
  const by = ty + th - 2;
  for (let x = tx0; x <= R; x++) { p.set(x, by, belt[x === cx || x === cx - 1 ? 1 : 2]); }   // cinturón marrón
  if (!up && !side) {
    for (let x = cx - 2; x <= cx + 1; x++) p.set(x, ty, m[1]);   // cuello alto
    for (let y = ty + 1; y < by; y++) p.set(cx, y, m[1]);        // cruce del abrigo
    for (const [bx, byy] of [[cx - 2, ty + 2], [cx + 2, ty + 2], [cx - 2, ty + 4], [cx + 2, ty + 4]]) if (byy < by) p.set(bx, byy, GOLD[4]);   // 4 botones dorados
    p.set(tx0 + 1, ty + 3, m[3]); p.set(R - 1, ty + 3, m[3]);
  } else if (side) {
    const fx = d > 0 ? R - 1 : tx0 + 1; for (const y of [ty + 2, ty + 4]) if (y < by) p.set(fx, y, GOLD[4]);
    p.set(d > 0 ? R : tx0, ty, m[1]);
  } else { for (let y = ty + 1; y < by; y++) p.set(cx, y, m[1]); }
  // hombreras grises (planas, sobre el hombro)
  if (!side) for (const sx of [tx0 - 1, R - 1]) { for (let i = 0; i < 3; i++) { p.set(sx + i, ty, P[i === 1 ? 4 : 3]); p.set(sx + i, ty + 1, P[2]); } p.set(sx + (sx < cx ? 0 : 2), ty + 2, P[1]); }
  else { for (let i = -1; i <= 1; i++) { p.set(cx + i, ty, P[i === 0 ? 4 : 3]); p.set(cx + i, ty + 1, P[2]); } }
  // faldón corto bajo el cinturón
  for (let x = tx0; x <= R; x++) if (!side || x !== (d > 0 ? R : tx0)) p.set(x, by + 2, m[(x + 1) % 4 ? 2 : 1]);
});
const VIG_SRC = L2('Vigías del Alba (al unirte a su campamento)', 'Dawn Wardens (when you join their camp)');
cosm('c_vig_abrigo', L2('Abrigo de los Vigías del Alba', 'Dawn Warden Coat'), 'body', () => ({ k: 'vigcoat', m: VIG_PAL.coat, s: VIG_PAL.pad }), { src: VIG_SRC });
cosm('c_vig_pantalon', L2('Pantalón de los Vigías', 'Dawn Warden Trousers'), 'legs', () => ({ k: 'pants', m: VIG_PAL.pants, s: VIG_PAL.pants }), { src: VIG_SRC });
cosm('c_vig_botas', L2('Botas de los Vigías', 'Dawn Warden Boots'), 'feet', () => ({ k: 'boots', m: VIG_PAL.boots }), { src: VIG_SRC });
const VIG_COS = ['c_vig_abrigo', 'c_vig_pantalon', 'c_vig_botas'];

// ---------- los 8 vigías (mismo orden que su dibujo) ----------
const VIG_IDS = ['vig_selene', 'vig_liora', 'vig_maren', 'vig_nim', 'vig_kael', 'vig_bram', 'vig_doran', 'vig_torvald'];
const VIG_LOOK = LK({ outfit: 'ranger' });
const vigN = (n, tes, ten, lines) => ({ n, title: L2(tes, ten), look: VIG_LOOK, vig: 1, lines: lines.map(l => L2(l[0], l[1])), quests: [] });
NPCS.vig_selene = vigN('Selene Valcorde', 'Comandante de los Vigías del Alba', 'Commander of the Dawn Wardens', [
  ['Este campamento no duerme del todo. Alguien siempre vigila el camino.', 'This camp never fully sleeps. Someone always watches the road.'],
  ['Mi familia lleva mil años esperando una marca como la tuya.', 'My family has waited a thousand years for a mark like yours.'],
  ['Fuimos nosotros quienes te sacamos del río. Mira solo te dio el primer abrigo.', 'We were the ones who pulled you out of the river. Mira only gave you the first coat.']]);
NPCS.vig_liora = vigN('Liora', 'Exploradora de los Vigías', 'Dawn Warden Scout', [
  ['Desde la loma veo toda la costa. Si alguien grita, llego antes que el eco.', 'From the ridge I see the whole coast. If someone shouts, I get there before the echo.'],
  ['Los cangrejos de la costa se vuelven locos con la marea alta.', 'The coast crabs go wild at high tide.']]);
NPCS.vig_maren = vigN('Maren', 'Sanadora de los Vigías', 'Dawn Warden Healer', [
  ['Vendas, hierbas y paciencia. Con eso se salva a casi todo el mundo.', 'Bandages, herbs and patience. That saves almost everyone.'],
  ['Si te hieres, no te hagas el valiente: ven a verme.', 'If you get hurt, don\'t play the hero: come see me.']]);
NPCS.vig_nim = vigN('Nim', 'Recluta de los Vigías', 'Dawn Warden Recruit', [
  ['¡Soy la más rápida del campamento! Llevo los mensajes a Albor en un suspiro.', 'I\'m the fastest in the camp! I carry messages to Albor in a heartbeat.'],
  ['Un día tendré hombreras de verdad, no de cartón.', 'One day I\'ll have real shoulder plates, not cardboard ones.']]);
NPCS.vig_kael = vigN('Kael', 'Instructor de espada', 'Sword Instructor', [
  ['Un vigía no lucha para ganar. Lucha para que los demás lleguen a casa.', 'A warden doesn\'t fight to win. He fights so the others get home.'],
  ['Pies firmes, hombros sueltos. Otra vez.', 'Firm feet, loose shoulders. Again.']]);
NPCS.vig_bram = vigN('Bram', 'Intendente', 'Quartermaster', [
  ['Cuento cada flecha y cada pan. Aquí nadie pasa hambre.', 'I count every arrow and every loaf. Nobody goes hungry here.'],
  ['¿Uniforme nuevo? Primero el juramento, luego la talla.', 'A new uniform? First the oath, then the size.']]);
NPCS.vig_doran = vigN('Doran', 'Rastreador', 'Tracker', [
  ['Las huellas no mienten. Los lobos han bajado del bosque.', 'Tracks don\'t lie. The wolves have come down from the forest.'],
  ['Si te pierdes, sigue el humo de nuestra hoguera.', 'If you get lost, follow the smoke of our campfire.']]);
NPCS.vig_torvald = vigN('Torvald', 'Veterano y cronista', 'Veteran and Chronicler', [
  ['He servido a tres comandantes Valcorde. Esta es la primera que ve la marca con sus propios ojos.', 'I\'ve served three Valcorde commanders. She is the first to see the mark with her own eyes.'],
  ['Pregúntame por Edrin cuando quieras. Es la historia que más me gusta contar.', 'Ask me about Edrin whenever you like. It\'s the story I love telling most.']]);
NPCS.vig_nina = { n: 'Lía', title: L2('Niña perdida', 'Lost Girl'), look: LK({ body: 'small', g: 'f', hair: HAIRS.castano, hairStyle: 'long', outfit: 'dress', main: P5(['#3a2a5a', '#5a4488', '#7a62b0', '#9a84d0', '#c0b0ec']) }), lines: [L2('Seguí a una mariposa azul… y ya no sé volver.', 'I followed a blue butterfly… and now I can\'t find my way back.')], quests: [] };
NPC_CAT.vig_selene = 'guild';
// sprites: el dibujo de Sergio a tamaño original (celdas de 64x64, pies en y = 60)
const VIG_CV = VIG_IDS.map(() => mkCanvas(CAMP_FW * 6, CAMP_FW * 4));
{ const im = new Image(); im.onload = () => VIG_CV.forEach((c, i) => c.getContext('2d').drawImage(im, 0, i * CAMP_FW * 4, CAMP_FW * 6, CAMP_FW * 4, 0, 0, CAMP_FW * 6, CAMP_FW * 4)); im.src = CAMP_SHEET; }
function vigAtlas(id) { const i = VIG_IDS.indexOf(id); return { img: VIG_CV[i], fw: CAMP_FW, fh: CAMP_FW, idx: { idle: 0, walk: 2 }, ax: CAMP_FW >> 1, ay: CAMP_FW - 4 }; }
{ const _na = npcAtlas; npcAtlas = function (id) { if (NPCS[id] && NPCS[id].vig) return vigAtlas(id); return _na(id); }; }

// ---------- el campamento en el mundo ----------
const VIG_CAMP = { x0: 169, y0: 168, x1: 178, y1: 177 }, VIG_NINA = [188, 183];
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  const { x0, y0, x1, y1 } = VIG_CAMP, L = (k, x, y, o) => addObj(W, k, x, y, o || {});
  for (let y = y0 - 1; y <= y1 + 1; y++) for (let x = x0 - 1; x <= x1 + 1; x++) if (W.inb(x, y)) { const i = W.I(x, y); W.flags[i] |= 4 | 16; if (W.ter[i] === T.GRASS && (x + y) % 3 === 0 && y > y0 + 2 && y < y1 - 1 && x > x0 + 1 && x < x1 - 1) W.ter[i] = T.DIRT; }
  L('tent', x0 + 1, y0 + 1, { col: '#1e4c44', fp: [[0, 0], [1, 0]] }); L('tent', x1 - 2, y0 + 1, { col: '#245a52', fp: [[0, 0], [1, 0]] }); L('tent', x0 + 1, y1 - 1, { col: '#1a443f', fp: [[0, 0], [1, 0]] });
  L('banner', x0 + 5, y0, { col: '#245a52' }); L('campfire', x0 + 5, y0 + 5); L('bench', x0 + 3, y0 + 5); L('bench', x0 + 7, y0 + 5);
  L('crate', x1 - 1, y1 - 1); L('barrel', x1, y1 - 1); L('crate', x1, y1); L('lantern', x0, y0 + 4); L('lantern', x1, y0 + 4);
  const at = (id, x, y, o) => { const [fx, fy] = freeTileNear(W, x, y); W.npcDefs.push(Object.assign({ id, x: fx, y: fy }, o || {})); };
  at('vig_selene', x0 + 5, y0 + 3, { face: 'down' }); at('vig_liora', x1 - 1, y0 + 3, { wander: 2 }); at('vig_maren', x0 + 2, y0 + 3, { face: 'right' });
  at('vig_nim', x0 + 4, y1 - 2, { wander: 3 }); at('vig_kael', x0 + 7, y1, { face: 'left' }); at('vig_bram', x1 - 2, y1 - 2, { face: 'down' });
  at('vig_doran', x1 - 1, y0 + 6, { wander: 2 }); at('vig_torvald', x0 + 3, y0 + 6, { face: 'right' });
  at('vig_nina', VIG_NINA[0], VIG_NINA[1], { face: 'down' });
}; }

// ---------- lore: un capítulo nuevo de las Crónicas, una pista y la historia de Edrin ----------
const CH_VIGIAS = CRON.length;
CRON.push([L2('Los Vigías del Alba', 'The Dawn Wardens'), L2('Hace mil años, en una noche de tormenta, un pescador de la Costa Coral llamado Edrin Valcorde encontró en la playa a un muchacho con una marca de luz en la mano. Era el primero que logró mover el hilo vacío del último Tejedor, pero el hilo todavía no estaba listo y se le escapaba entre los dedos. Edrin lo cuidó, lo acompañó contra los primeros siervos del Desatado y lo vio deshacerse en luz al amanecer. Antes de irse, el muchacho le dijo: «Volverá a moverse. Que alguien esté despierto cuando pase». Edrin reunió a los que le creyeron y fundó los Vigías del Alba: un campamento que nunca duerme del todo, que ayuda a quien se pierde en los caminos y que espera la marca. Mil años después, sus descendientes te sacaron del río y te llevaron con Mira.', 'A thousand years ago, on a stormy night, a Coral Coast fisherman named Edrin Valcorde found a boy on the beach with a mark of light on his hand. He was the first to move the last Weaver\'s empty thread, but the thread was not ready yet and kept slipping through his fingers. Edrin cared for him, stood with him against the first servants of the Unbound, and watched him dissolve into light at dawn. Before he left, the boy told him: "It will move again. Let someone be awake when it does." Edrin gathered those who believed him and founded the Dawn Wardens: a camp that never fully sleeps, that helps whoever gets lost on the roads and waits for the mark. A thousand years later, his descendants pulled you out of the river and carried you to Mira.')]);
ERAS[4][1].push(CH_VIGIAS);
CLUES.n_vigias = ['npc', L2('El juramento de Edrin', 'Edrin\'s oath'), L2('«Volverá a moverse. Que alguien esté despierto cuando pase.» Los Vigías del Alba llevan mil años despiertos por ti.', '"It will move again. Let someone be awake when it does." The Dawn Wardens have stayed awake for you for a thousand years.'), CH_VIGIAS];
const VIG_EDRIN = L2('Edrin no era soldado: era pescador. Una noche encontró a un muchacho en la playa con tu misma marca. Lo cuidó, peleó a su lado contra los siervos del Desatado y lo vio deshacerse en luz al amanecer. «Volverá a moverse», le dijo el chico. «Que alguien esté despierto cuando pase». Desde entonces, siempre hay un Valcorde de guardia. Y la noche que llegaste tú, Selene estaba despierta.', 'Edrin was no soldier: he was a fisherman. One night he found a boy on the beach with the same mark as yours. He cared for him, fought beside him against the servants of the Unbound and watched him dissolve into light at dawn. "It will move again," the boy told him. "Let someone be awake when it does." Ever since, there has always been a Valcorde on watch. And the night you arrived, Selene was awake.');

// ---------- misiones: unirse, ayudar y rescatar ----------
const VLOC = [173, 172];
q('vig1', { n: L2('El juramento del alba', 'The Dawn Oath'), giver: 'vig_selene', lv: 4, desc: L2('Selene quiere que conozcas a los Vigías antes de unirte. Escucha la historia de Torvald y habla con Maren.', 'Selene wants you to meet the Wardens before you join. Hear Torvald\'s story and talk to Maren.'),
  obj: [{ t: 'talk', npc: 'vig_torvald', loc: VLOC, txt: L2('Escucha a Torvald', 'Listen to Torvald') }, { t: 'talk', npc: 'vig_maren', loc: VLOC, txt: L2('Habla con Maren', 'Talk to Maren') }], rew: { xp: 300, gold: 80 },
  offer: [L2('Así que tú eres el de la marca. Te sacamos del río esa noche… y no te despertaste en dos días.', 'So you are the one with the mark. We pulled you out of the river that night… and you didn\'t wake for two days.'), L2('Los Vigías del Alba ayudamos a quien se pierde en los caminos. Si quieres ser uno de los nuestros, primero escucha por qué existimos.', 'We Dawn Wardens help whoever gets lost on the roads. If you want to be one of us, first hear why we exist.'), L2('Habla con Torvald y con Maren. Luego vuelve a mí.', 'Talk to Torvald and Maren. Then come back to me.')],
  prog: [L2('Torvald está junto a la hoguera y Maren junto a la tienda de la izquierda.', 'Torvald is by the campfire and Maren next to the left tent.')],
  done: [L2('Entonces lo juras: ayudar sin pedir nada y no dejar a nadie atrás.', 'Then you swear it: help without asking anything and leave no one behind.'), L2('Bienvenido a los Vigías del Alba. Toma tu uniforme. Si un día no quieres llevarlo, guárdalo; seguirás siendo de los nuestros.', 'Welcome to the Dawn Wardens. Take your uniform. If one day you don\'t want to wear it, put it away; you\'ll still be one of us.')] });
q('vig2', { n: L2('Pescadores atrapados', 'Trapped Fishermen'), giver: 'vig_liora', lv: 5, pre: 'vig1', desc: L2('La marea alta ha vuelto locos a los cangrejos y tienen rodeados a unos pescadores en la Costa Coral.', 'The high tide has driven the crabs wild and they have some fishermen surrounded on the Coral Coast.'),
  obj: [{ t: 'kill', m: 'cangrejo', n: 6, loc: [196, 160] }], rew: { xp: 500, gold: 120, items: [['pocion1', 3]] },
  offer: [L2('¡Recluta! Desde la loma he visto a tres pescadores subidos a una roca y cangrejos por todas partes.', 'Recruit! From the ridge I saw three fishermen up on a rock and crabs everywhere.'), L2('Aparta 6 cangrejos y los sacaré de ahí.', 'Clear 6 crabs and I\'ll get them out of there.')],
  prog: [L2('Los cangrejos están en la orilla, al noreste del campamento.', 'The crabs are on the shore, northeast of the camp.')],
  done: [L2('Ya están a salvo y secos. Uno de ellos quiere regalarte su mejor caña… le dije que la guarde para su hija.', 'They\'re safe and dry. One of them wants to give you his best rod… I told him to keep it for his daughter.')] });
q('vig3', { n: L2('Lobos en el sendero', 'Wolves on the Trail'), giver: 'vig_doran', lv: 7, pre: 'vig2', desc: L2('Una manada de lobos acecha el camino entre Albor y el campamento. Protege a los viajeros.', 'A wolf pack is stalking the road between Albor and the camp. Protect the travelers.'),
  obj: [{ t: 'kill', m: 'lobo', n: 6, loc: [150, 160] }], rew: { xp: 800, gold: 160 },
  offer: [L2('Huellas frescas: seis lobos, quizá más. Bajaron del bosque y esperan a los viajeros en el sendero de Albor.', 'Fresh tracks: six wolves, maybe more. They came down from the forest and wait for travelers on the Albor trail.'), L2('Ahuyéntalos antes de que pase la caravana de la tarde.', 'Drive them off before the afternoon caravan passes.')],
  prog: [L2('El sendero va hacia el oeste, hacia Albor.', 'The trail runs west, toward Albor.')],
  done: [L2('La caravana pasó sin un rasguño. Ni se enteraron de lo cerca que estuvieron.', 'The caravan passed without a scratch. They never knew how close it was.')] });
q('vig4', { n: L2('La niña perdida', 'The Lost Girl'), giver: 'vig_maren', lv: 9, pre: 'vig3', desc: L2('Lía, una niña de Albor, siguió a una mariposa y no ha vuelto. Encuéntrala al este del campamento.', 'Lía, a girl from Albor, followed a butterfly and hasn\'t come back. Find her east of the camp.'),
  obj: [{ t: 'talk', npc: 'vig_nina', loc: VIG_NINA, txt: L2('Encuentra a Lía', 'Find Lía') }, { t: 'kill', m: 'slime_a', n: 5, loc: VIG_NINA, txt: L2('Aparta a los slimes que la rodean', 'Clear the slimes around her') }], rew: { xp: 1100, gold: 200, items: [['pocion1', 4]] },
  offer: [L2('Su madre ha venido llorando. Lía tiene seis años y se fue detrás de una mariposa azul hacia el este.', 'Her mother came here crying. Lía is six and went after a blue butterfly to the east.'), L2('Encuéntrala, aparta lo que la asuste y dile que su madre la espera. Yo preparo mantas.', 'Find her, clear whatever scares her and tell her that her mother is waiting. I\'ll get blankets ready.')],
  prog: [L2('Lía está al este del campamento, cerca de la costa.', 'Lía is east of the camp, near the coast.')],
  done: [L2('Lía ya está con su madre, envuelta en dos mantas y comiendo pan con miel. Dice que eres su héroe… y que la mariposa era más bonita que tú.', 'Lía is with her mother now, wrapped in two blankets and eating bread with honey. She says you\'re her hero… and that the butterfly was prettier than you.')] });
q('vig5', { n: L2('Despierto cuando pase', 'Awake When It Happens'), giver: 'vig_selene', lv: 12, pre: 'vig4', desc: L2('Selene quiere hablar contigo de Edrin y del hilo. Antes, limpia los alrededores del campamento.', 'Selene wants to talk to you about Edrin and the thread. First, clear the area around the camp.'),
  obj: [{ t: 'kill', m: 'slime_a', n: 10, loc: [180, 165] }, { t: 'talk', npc: 'vig_torvald', loc: VLOC, txt: L2('Avisa a Torvald', 'Tell Torvald') }], rew: { xp: 1600, gold: 400 },
  offer: [L2('Has salvado pescadores, viajeros y a una niña en una semana. Edrin estaría orgulloso.', 'You\'ve saved fishermen, travelers and a little girl in one week. Edrin would be proud.'), L2('Esta noche haremos guardia contigo. Despeja los alrededores y avisa a Torvald: él encenderá la hoguera grande.', 'Tonight we keep watch with you. Clear the surroundings and tell Torvald: he\'ll light the big fire.')],
  prog: [L2('Slimes azules alrededor del campamento; luego habla con Torvald.', 'Blue slimes around the camp; then talk to Torvald.')],
  done: [L2('Mil años de guardia… y por fin no esperamos solos. Mientras haya un Vigía, nunca estarás perdido.', 'A thousand years on watch… and at last we don\'t wait alone. As long as there is a Warden, you will never be lost.')] });
for (const [qid, giver] of [['vig1', 'vig_selene'], ['vig2', 'vig_liora'], ['vig3', 'vig_doran'], ['vig4', 'vig_maren'], ['vig5', 'vig_selene']]) NPCS[giver].quests.push(qid);
SAVEKEYS.push('vig');
{ const _cq = completeQuest; completeQuest = function (id) { const r = _cq.apply(this, arguments); const P = G.P;
  if (id === 'vig1') { P.vig = 1; for (const c of VIG_COS) giveCosmetic(c, true); toast(L2('Te has unido a los Vigías del Alba. Su uniforme está en tu armario.', 'You joined the Dawn Wardens. Their uniform is in your wardrobe.'), 'quest', 5); clueUnlock('n_vigias'); }
  if (id === 'vig5') { P.vig = 2; if (typeof loreUnlock === 'function') { const U = P.loreU || []; if (!U.includes(CH_VIGIAS)) loreUnlock(CH_VIGIAS); } }
  return r; }; }
DLG_HOOKS.push((npc, opts) => {
  if (!npc.def || !(npc.def.vig || npc.id === 'vig_nina')) return;
  if (npc.id === 'vig_torvald') opts.push({ label: L2('La historia de Edrin', 'The story of Edrin'), icon: ['book'], fn: () => { typeText(VIG_EDRIN); clueUnlock('n_vigias'); } });
  if (npc.id === 'vig_bram' && G.P.vig && !VIG_COS.every(c => (G.P.wardrobe || []).includes(c))) opts.push({ label: L2('Pedir otro uniforme', 'Ask for another uniform'), icon: ['bag'], fn: () => { for (const c of VIG_COS) giveCosmetic(c, true); typeText(L2('Toma, vigía. Y esta vez no lo pierdas.', 'Here, warden. And don\'t lose it this time.')); } });
  if (npc.id === 'vig_nina' && G.P.quests && G.P.quests.done && G.P.quests.done.vig4) opts.unshift({ label: L2('¿Sabes volver?', 'Can you get back?'), icon: ['talk'], fn: () => typeText(L2('¡Sí! Sigo el humo de la hoguera de los Vigías. Doran me lo enseñó.', 'Yes! I follow the smoke of the Wardens\' campfire. Doran taught me.')) });
});
