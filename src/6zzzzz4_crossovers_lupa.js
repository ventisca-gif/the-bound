// 6.09 · Lupa › 🏴‍☠️ Crossovers (Sergio: «en la lupa pon crossovers: toda la historia y arcos del Mar de Dawn, qué
// enfrentar en orden, las armaduras que hay, los minerales y dónde talar»).
// - La ruta tenía dos fallos: no salía Conomi / Arlong Park, y después de Baratie la flecha no llevaba a ningún sitio.
// - Piedra del Mar y Árbol Rey (tier 25) piden oficio 152, pero el máximo era 150 (75 + 45 + 30 de Gran Maestro):
//   nadie podía minarlos ni talarlos y las armaduras de 680-700 no se podían forjar. Sergio: «el nivel de oficio
//   auméntalo para que puedan talar». Tala, Minería y Pesca suben de 120 a 130 (160 con Gran Maestro).
// - Lupa › Sistemas › 🏴‍☠️ Crossovers: todo el Mar de Dawn en una sección (ruta, armaduras, materiales).

for (const k of ['tala', 'mineria', 'pesca']) JOB_EXT[k] = 55;
const cxMats = t => { const r = RECIPES.find(r => r.out === 'b_' + t); return r ? r.mats.map(([id, q]) => (ITEMS[id] ? ITEMS[id].n : id) + ' ×' + q).join(' + ') : ''; };

const cxWon = id => !!((G.P && G.P.bossKills) || {})[id];
const cxMark = ok => ok ? '✅ ' : '⬜ ';
const cxBoss = id => (cxWon(id) ? '✅ ' : '⚔ ') + (BOSSES[id] ? BOSSES[id].n + ' (' + BOSSES[id].lv + ')' : id);
const cxConomiDone = P => !!P && (P.conomiCleared || (P.conomiChapter || 0) >= 7 || cxWon('con_arlong'));
const CX_SHANKS_AT = [527, 252];

// ---------- 🧭 ruta completa, con cada jefe en orden ----------
{
  const route = LUPA_DAWN.find(([id]) => id === 'ruta'), prevNext = route[3];
  route[1] = () => '🧭 ' + L2('Historia y arcos en orden', 'Story arcs in order');
  route[2] = () => { const P = G.P || {}; return [
    L2('Haz los arcos en este orden. ✅ = hecho, ⚔ = jefe por vencer. «Seguir» te pone la flecha en el siguiente paso.', 'Play the arcs in this order. ✅ = done, ⚔ = boss to beat. "Follow" puts the arrow on the next step.'),
    cxMark(cxWon(ALVIDA_BOSS)) + L2('1. Nivel 500 · Galeón de Alvida: bote con la Capitana Marina. ', '1. Level 500 · Alvida’s galleon: boat from Captain Marina. ') + cxBoss(ALVIDA_BOSS),
    cxMark(dfHas()) + L2('2. Fruta del Diablo (llave de los desembarcos): la suelta la Hilandera Muda (600, Tierras Tejidas).', '2. Devil Fruit (landing key): dropped by the Mute Spinner (600, Woven Lands).'),
    cxMark(cxWon(MORGAN_ID)) + L2('3. Shells Town: rescata a Zoro y vence con Luffy y Zoro a ', '3. Shells Town: rescue Zoro and, with Luffy and Zoro, beat ') + cxBoss(MORGAN_ID),
    cxMark(cxWon(ORANGE_CABAJI) && cxWon(ORANGE_BUGGY)) + L2('4. Orange Town: ', '4. Orange Town: ') + cxBoss(ORANGE_CABAJI) + ' → ' + cxBoss(ORANGE_BUGGY) + L2('. Nami se une y el bote pasa a ser el Going Merry.', '. Nami joins and the boat becomes the Going Merry.'),
    cxMark(P.rareDone) + L2('5. Isla de los Animales Raros: ayuda a Gaimon con los cinco cofres.', '5. Island of Rare Animals: help Gaimon with the five chests.'),
    cxMark(P.syrupUsopp) + L2('6. Villa Syrup: ', '6. Syrup Village: ') + cxBoss('syrup_sham') + ' + ' + cxBoss('syrup_buchi') + L2(' (con Zoro) → ', ' (with Zoro) → ') + cxBoss('syrup_jango') + L2(' (con Nami y Usopp) → ', ' (with Nami and Usopp) → ') + cxBoss('syrup_kuro') + L2(' (con Luffy). Usopp se une.', ' (with Luffy). Usopp joins.'),
    cxMark(P.baratieSanji) + L2('7. Baratie: duelo de Zoro con Mihawk y defensa del restaurante: ', '7. Baratie: Zoro’s duel with Mihawk and defence of the restaurant: ') + cxBoss('baratie_pearl') + ' → ' + cxBoss('baratie_gin') + ' → ' + cxBoss('baratie_krieg') + L2('. Sanji se une.', '. Sanji joins.'),
    cxMark(cxWon(SH_BOSS)) + L2('8. Nivel 600 · Villa Foosha: duelo con ', '8. Level 600 · Foosha Village: duel with ') + cxBoss(SH_BOSS) + L2(' (Engranaje 2, conjunto de Pirata de Paja y su ropa).', ' (Gear 2, Straw Pirate set and his clothes).'),
    cxMark(cxConomiDone(P)) + L2('9. Islas Conomi · Arlong Park: ', '9. Conomi Islands · Arlong Park: ') + cxBoss('con_hatchan') + L2(' (Zoro) → ', ' (Zoro) → ') + cxBoss('con_kuroobi') + L2(' (Sanji) → ', ' (Sanji) → ') + cxBoss('con_chew') + L2(' (Usopp) → ', ' (Usopp) → ') + cxBoss('con_arlong') + L2(' (tú y Luffy). Es el jefe más fuerte del Mar de Dawn.', ' (you and Luffy). The strongest boss of the Dawn Sea.'),
    cxMark((P.logueArcN || 0) >= 1) + L2('10. Loguetown (612, repetible): habla con Luffy en la plaza (o con Smoker). Tú y Luffy contra Smoker → Smoker sube a Luffy al patíbulo con Buggy → aguanta 2 minutos a la Marina con la tripulación → el rayo. Zoro, Ipponmatsu y Tashigi están en la armería; Smoker también da 3 desafíos del puerto.', '10. Loguetown (612, repeatable): talk to Luffy in the square (or Smoker). You and Luffy versus Smoker → Smoker takes Luffy up the scaffold with Buggy → hold off the Navy for 2 minutes with the crew → the lightning. Zoro, Ipponmatsu and Tashigi are in the arms shop; Smoker also gives 3 harbor challenges.'),
    L2('Puedes repetir cada arco hablando con su personaje al terminarlo (por ejemplo, Nojiko en Cocoyashi).', 'You can replay each arc by talking to its character once it is done (for example, Nojiko in Cocoyashi).')]; };
  route[3] = () => { const P = G.P; if (!P) return null;
    if (!P.baratieSanji) return prevNext();
    if (!cxWon(SH_BOSS)) return { loc: CX_SHANKS_AT, m: 'dawn', t: 'Shanks · Villa Foosha' };
    if (!cxConomiDone(P)) { let d = null; try { d = G.map && G.map.conomi ? conomiNavigate(G.map, P, false) : null; } catch (e) { } return { loc: d ? d[0] : CON_MOOR, m: 'dawn', t: CONOMI_NAME }; }
    if (typeof LOGUE_MOOR !== 'undefined' && !(P.logueArcN > 0)) { const on = G.map && G.map.logue && typeof logueActive === 'function' && logueActive(P, G.map); return { loc: on ? logueAt(104, 122) : LOGUE_MOOR, m: 'dawn', t: L2('Luffy · plaza de Loguetown', 'Luffy · Loguetown square') }; }
    return null; };
}

// ---------- 🛡 todas las armaduras de nivel 600+ ----------
const CX_ARMOR = [
  [43, () => L2('Aurora Divina (600): ', 'Divine Aurora (600): ') + cxMats(43) + L2(' (Tierras Tejidas).', ' (Woven Lands).')],
  [44, L2('Pirata de Paja (600, cualquier clase, un 5 % más fuerte que la Aurora): premio del duelo con Shanks. No se forja.', 'Straw Pirate (600, any class, 5% stronger than the Aurora): reward from the Shanks duel. Not forged.')],
  [45, L2('Bailarina del Desierto (620): Coralita ×12 + Palma de Coral ×10.', 'Desert Dancer (620): Coralite ×12 + Coral Palm ×10.')],
  [51, L2('Pirata del Desierto (630, combinación).', 'Desert Pirate (630, combination).')],
  [46, L2('Emperatriz Serpiente (640): Coralita ×8 + Nacarita ×8 + Árbol Frutal Raro ×8.', 'Serpent Empress (640): Coralite ×8 + Nacrite ×8 + Rare Fruit Tree ×8.')],
  [52, L2('Emperatriz del Kimono (645, combinación).', 'Kimono Empress (645, combination).')],
  [47, L2('Capitán del Abrigo Negro (660): Nacarita ×12 + Árbol Frutal Raro ×10.', 'Black-Coat Captain (660): Nacrite ×12 + Rare Fruit Tree ×10.')],
  [53, L2('Capitán del Futuro (660, combinación).', 'Future Captain (660, combination).')],
  [54, L2('Bailarina del Rey del Mar (675, combinación).', 'Sea King’s Dancer (675, combination).')],
  [48, L2('Kimono del Rey del Mar (680): Piedra del Mar ×8 + Árbol Frutal Raro ×6 + Árbol Rey ×8.', 'Sea King’s Kimono (680): Seastone ×8 + Rare Fruit Tree ×6 + King Tree ×8.')],
  [55, L2('Serpiente del Futuro (690, combinación).', 'Future Serpent (690, combination).')],
  [49, L2('Traje del Futuro (700): Piedra del Mar ×14 + Árbol Rey ×12.', 'Future Suit (700): Seastone ×14 + King Tree ×12.')],
  [50, L2('Armadura de Clase de los Mares (700, la más fuerte; cada clase con su diseño): Piedra del Mar ×18 + Árbol Rey ×16 + Nacarita ×10.', 'Sea Class armour (700, the strongest; each class with its own design): Seastone ×18 + King Tree ×16 + Nacrite ×10.')]];
const cxOwnsTier = t => { const P = G.P; if (!P) return false; const has = id => (P.inv || []).some(s => s && s.id === id) || Object.values(P.equip || {}).some(e => e && e.id === id); return ['h', 'b', 'l', 'f'].some(s => has(s + '_' + t)); };
LUPA_DAWN.push(['cx_armor', () => '🛡 ' + L2('Armaduras (600-700)', 'Armours (600-700)'), () => [
  L2('Todas son de cualquier clase y se forjan en la Herrería (salvo Pirata de Paja). Cada pieza: casco, cuerpo, piernas y pies. Las combinaciones usan la mitad de los materiales de los dos conjuntos que mezclan. ✅ = tienes alguna pieza.', 'All are for any class and are forged at the Forge (except Straw Pirate). Each piece: head, body, legs and feet. Combinations use half the materials of the two sets they mix. ✅ = you have a piece.')]
  .concat(CX_ARMOR.map(([t, s]) => (cxOwnsTier(t) ? '✅ ' : '• ') + (typeof s === 'function' ? s() : s)))
  .concat([L2('Herramientas para los materiales: Pico/Hacha/Caña de Coralita (620), Nacarita (650) y Piedra del Mar (680), en la Herrería con oficio 75.', 'Tools for the materials: Coralite (620), Nacrite (650) and Seastone (680) pickaxe/axe/rod, at the Forge with job level 75.')]), () => null]);

// ---------- ⛏ minerales, maderas y dónde talar / minar ----------
{ const g = LUPA_DAWN.find(x => x[0] === 'mares601'); if (g) { const f = g[2];
  g[1] = () => '⛏ ' + L2('Minerales, maderas y dónde talar', 'Ores, woods and where to chop');
  g[2] = () => [
    L2('Dónde (vetas y árboles que reaparecen a los 5 segundos; nada en Baratie ni en Conomi):', 'Where (veins and trees that respawn after 5 seconds; none at Baratie or Conomi):'),
    '🪸 ' + L2('Coralita y Palma de Coral: Villa Foosha, Shells Town y Orange Town.', 'Coralite and Coral Palm: Foosha Village, Shells Town and Orange Town.'),
    '🐚 ' + L2('Nacarita y Árbol Frutal Raro: Shells Town, Orange Town, Isla de los Animales Raros y Villa Syrup.', 'Nacrite and Rare Fruit Tree: Shells Town, Orange Town, Island of Rare Animals and Syrup Village.'),
    '🌊 ' + L2('Piedra del Mar y Árbol Rey: Isla de los Animales Raros y Villa Syrup.', 'Seastone and King Tree: Island of Rare Animals and Syrup Village.'),
    L2('Qué necesitas (Minería para vetas, Tala para árboles):', 'What you need (Mining for veins, Woodcutting for trees):'),
    '• ' + L2(`Coralita / Palma de Coral: oficio ${RESLV[23]} y Pico/Hacha de Coralita.`, `Coralite / Coral Palm: job ${RESLV[23]} and Coralite pickaxe/axe.`),
    '• ' + L2(`Nacarita / Árbol Frutal Raro: oficio ${RESLV[24]} y Pico/Hacha de Nacarita.`, `Nacrite / Rare Fruit Tree: job ${RESLV[24]} and Nacrite pickaxe/axe.`),
    '• ' + L2(`Piedra del Mar / Árbol Rey: oficio ${RESLV[25]} y Pico/Hacha de Piedra del Mar.`, `Seastone / King Tree: job ${RESLV[25]} and Seastone pickaxe/axe.`),
    L2('Tala, Minería y Pesca llegan a 130; con la maestría (Aprendiz → Gran Maestro) suben 10 por rango, hasta 160. Los maestros están en las ciudades (Sauce la Leñadora, Brok Picahondo, Nerina Anzuelo).', 'Woodcutting, Mining and Fishing reach 130; mastery (Apprentice → Grand Master) adds 10 per rank, up to 160. The masters are in the towns (Sauce la Leñadora, Brok Picahondo, Nerina Anzuelo).'),
    L2('La primera herramienta de Coralita se hace con Sedalita y Ceiba de Seda de las Tierras Tejidas; cada herramienta siguiente, con el material anterior.', 'The first Coralite tool is made with Silkite and Silk Ceiba from the Woven Lands; each next tool, with the previous material.')]
; } }

// ---------- orden de la pestaña ----------
{ const order = ['ruta', 'cx_armor', 'mares601', 'syrup598', 'baratie', 'conomi', 'equipo', 'frutas']; const pick = id => LUPA_DAWN.findIndex(x => x[0] === id);
  const head = []; for (const id of order) { const i = pick(id); if (i >= 0) head.push(LUPA_DAWN.splice(i, 1)[0]); } LUPA_DAWN.unshift(...head); }

// ---------- Lupa › Sistemas › 🏴‍☠️ Crossovers: todo junto ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['crossovers', '🏴‍☠️ ' + L2('Crossovers · Mar de Dawn', 'Crossovers · Dawn Sea'), () => {
  const sec = (id, ic) => { const g = LUPA_DAWN.find(x => x[0] === id); if (!g) return []; let L = []; try { L = g[2](); } catch (e) { } return ['— ' + g[1]() + ' —'].concat(L); };
  return [L2('Todo el crossover del Mar de Dawn. También en 🔎 › 🏴‍☠️ Crossovers, con una página por arco.', 'The whole Dawn Sea crossover. Also in 🔎 › 🏴‍☠️ Crossovers, with one page per arc.')]
    .concat(sec('ruta'), sec('cx_armor'), sec('mares601'), sec('equipo'), sec('frutas')); },
  () => { const g = LUPA_DAWN.find(x => x[0] === 'ruta'); try { return g ? g[3]() : null; } catch (e) { return null; } }]);
