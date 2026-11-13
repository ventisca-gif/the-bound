// ================= NUEVA PAREJA: ALDARA, hija del Caballero Renegado (Ciudadela de Arxar) =================
const ALD_BLUE = P5(['#0a1638', '#14286a', '#2246a8', '#3a6ad8', '#78a4f0']), ALD_SILVER = P5(['#3a3e4c', '#6c7282', '#a0a8b8', '#d0d6e0', '#f4f7fb']);
const ALD_HS = { n: 'Aldara', cap: 'round', bang: 'messy', side: 3, back: 3, bw: 1.08, jag: 1 };
NPCS.aldara = { n: 'Aldara', title: 'Hija del Caballero Renegado', look: LK({ hair: HAIRS.castano, outfit: 'knight', skin: SKINS[1], eyes: 'cafe', main: ALD_SILVER, sec: ALD_BLUE, cape: { out: ALD_BLUE, in: ALD_BLUE }, weapon: { k: 'sword', tier: 6 } }),
  lines: ['Me llamo Aldara. Sí… la hija de Sir Aldric. Llevo su nombre, no su traición.', 'Entreno cada mañana en la plaza. Una espada no se oxida si la usas.', 'Algún día limpiaré el nombre de mi familia.'] };
ROM.aldara = { g: 'f', loves: ['ore', 'fang', 'food'], likes: ['gem', 'pelt', 'ring'], hates: ['bouquet', 'cloth'], taste: 'las buenas armas, los trofeos de batalla y la comida de campaña' };
ROM_WHERE.aldara = 'Ciudadela de Arxar (plaza)';
WED_SPOUSE_LINES.aldara = '¡La hija del Renegado se casa! Nadie lo diría al verla tan feliz.';
function aldaraLook(wed) {
  const app = normApp({ g: 'f', skin: 1, hair: 'castano', eyes: 'cafe', top: [0, 'azul'], bot: [0, 'marino'], shoe: [0, 'marron'] });
  const L = heroLook('guerrero', app, { weapon: 6, body: 7, legs: 7, feet: 7 }, {}, {}); L.hs = ALD_HS; L.scar = 1; L.head = null;
  if (wed) { L.top = { k: 'dress', m: P5(['#a8a0a8', '#d0c8d0', '#ece6ec', '#f8f4f8', '#ffffff']), s: ALD_BLUE }; L.bot = { k: 'skirt', m: P5(['#a8a0a8', '#d0c8d0', '#ece6ec', '#f8f4f8', '#ffffff']), s: ALD_BLUE }; L.feet = { k: 'shoes', m: CLOTH.blanco }; L.back = { k: 'cape', o: CLOTH.blanco, i: ALD_BLUE, tr: GOLD.slice(1) }; L.weapon = null; }
  else { L.top = { k: 'plate', m: ALD_SILVER, s: ALD_BLUE, t: 7 }; L.bot = { k: 'greaves', m: ALD_SILVER, s: ALD_BLUE }; L.feet = { k: 'sabatons', m: ALD_SILVER }; L.back = { k: 'cape', o: ALD_BLUE, i: ALD_BLUE, tr: ALD_SILVER }; }
  return L;
}
{ const _na = npcAtlas; npcAtlas = function (id) { if (id !== 'aldara') return _na(id); return getAtlas('Haldara', () => buildHeroAtlas(aldaraLook(false))); }; }
{ const _wa = wedAtlas; wedAtlas = function (id) { if (relKey(id) !== 'aldara') return _wa(id); return getAtlas('WEDaldara', () => buildHeroAtlas(aldaraLook(true))); }; }
// cicatriz en la mejilla (solo personajes con L.scar dibujados con el motor de héroes)
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { _dh(p, L, dir, anim, f); if (!L.scar || dir === 'up') return; const B = BODYP.normal, ps = heroPose(dir, anim, f, L), side = dir === 'left' || dir === 'right', d = dir === 'left' ? -1 : 1;
  const cx = p.w >> 1, base = p.h - 4 - (ps.jump || 0), legTop = base - B.lh + ps.crouch, torsoTop = legTop - B.th + ps.bob, hy = Math.round(torsoTop - B.hry + 1 - (B === BODYP.normal ? FACE.lift : 0)), hx = cx + (side ? -1 : 0) + (side ? d * (ps.lean || 0) : 0);
  const sx = side ? hx + d * 2 : hx - 5; p.set(sx, hy + 5, L.skin[0]); p.set(sx + 1, hy + 6, L.skin[0]); }; }
// vive en la plaza de la Ciudadela de Arxar
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); const t = TOWNS.find(t => t.k === 'arxar'); if (t) { const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 - 6, (t.y0 + t.y1) / 2 + 3); W.npcDefs.push({ id: 'aldara', x, y, face: 'down' }); } }; }
// su historia: el honor de los Aldric (después de derrotar a su padre)
q('s_aldara', { n: 'El Honor de los Aldric', giver: 'aldara', lv: 26, desc: 'Aldara quiere que su padre, Sir Aldric, deje de hacer daño. Derrótalo en su campamento al suroeste de la Ciudadela.', obj: [{ t: 'boss', b: 'renegado', loc: [96, 80] }], rew: { xp: 9000, gold: 2500, items: [['ramo', 1]] },
  offer: ['Mi padre fue el mejor caballero de Arxar. Ahora lidera bandidos.', 'No te pido que lo odies. Te pido que lo detengas… por favor.'], prog: ['Su campamento está al suroeste de la Ciudadela.'], done: ['Gracias. Por fin puedo llevar mi apellido con la cabeza alta.', 'Si alguna vez quieres entrenar conmigo… aquí estaré.'] });
NPCS.aldara.quests = NPCS.aldara.quests || []; NPCS.aldara.quests.push('s_aldara');
{ const _cq = completeQuest; completeQuest = function (id) { const r = _cq.apply(this, arguments); if (id === 's_aldara') { const R = rel('aldara'); R.t = Math.min(1000, R.t + 200); R.a = Math.min(1000, R.a + 80); toast('Aldara confía mucho más en ti (+2 ♥ confianza)', 'quest'); } return r; }; }
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'aldara') return; const P = G.P; opts.push({ label: 'Hablar de tu padre', icon: ['talk'], fn: () => typeText(P.quests && P.quests.done && P.quests.done.s_renegado ? 'Lo derrotaste… y aun así me miras a los ojos. Eso dice mucho de ti. Mi padre perdió el rumbo; yo no pienso perderlo.' : 'Sir Aldric, el Renegado. Su campamento está al suroeste de la Ciudadela. Cada día que sigue ahí es una mancha en nuestro nombre.') }); });
