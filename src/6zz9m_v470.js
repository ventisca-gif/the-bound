// ================= v4.70: NIVEL 400, BESTIARIO Y JEFES DE LAS TIERRAS SIN PINTAR CON EL DIBUJO DE SERGIO =================
// - Nivel máximo 400 (40_data.js). Top mundial y sus reglas aceptan hasta 400 (hay que pegar docs/firebase_rules.json).
// - Criaturas del bestiario de Sergio (tools/dev/lienzo.py → 6zz9l_lienzo_data.js): Babosa Borrada, Lobo Inacabado, Araña de
//   Tiza, Caballero Vacío, Esqueleto Sin Tinta, Gólem de Cal, Espectro del Lienzo, Pez Pálido, Mimo del Silencio y Nihilito.
//   Se reutilizan los ids de la 4.69 (las misiones siguen valiendo) y se añaden araña, pez y mimo.
// - Jefes con su dibujo: Eco del Vencido (310), El Fragmento sin Color (320), La Sierpe de Tormenta (330) y El Lienzo en
//   Blanco (400, nuevo aspecto). Los jefes de la 4.69 se quedan como segundos jefes de zona con niveles nuevos.
// - Zonas de 300 a 400: Orilla 300-320, Llanura 320-345, Ciénaga 330-360, Marco 360-385, Lienzo en Blanco 385-400.

const LZ_CV = {};
for (const k in LZ_SHEET) { const [fw, fh] = LZ_SIZE[k], c = mkCanvas(fw * 10, fh * 4); LZ_CV[k] = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = LZ_SHEET[k]; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'lz' && LZ_CV[art[1]]) return getAtlas('Mlz' + art[1], () => { const [fw, fh] = LZ_SIZE[art[1]]; return { img: LZ_CV[art[1]], fw, fh, idx: { idle: 0, walk: 2, atk: 6, hurt: 9 }, ax: fw >> 1, ay: fh - 4 }; }); return _ma(art); }; }

// ---------- criaturas (nombres de Sergio) ----------
const LZ_MOBS = [
  ['tsp_slime', L2('Babosa Borrada', 'Erased Slug'), 'babosa', 'aggro', [300, 318]], ['tsp_golemito', L2('Gólem de Cal', 'Lime Golem'), 'golem', 'aggro', [306, 384]],
  ['tsp_arana', L2('Araña de Tiza', 'Chalk Spider'), 'arana', 'charge', [304, 344]], ['tsp_esqueleto', L2('Esqueleto Sin Tinta', 'Inkless Skeleton'), 'esqueleto', 'aggro', [320, 345]],
  ['tsp_lobo', L2('Lobo Inacabado', 'Unfinished Wolf'), 'lobo', 'charge', [322, 345]], ['tsp_borron', L2('Nihilito', 'Little Nihil'), 'nihilito', 'aggro', [330, 360]],
  ['tsp_pez', L2('Pez Pálido', 'Pale Fish'), 'pez', 'ranged', [334, 360]], ['tsp_fantasma', L2('Espectro del Lienzo', 'Canvas Specter'), 'espectro', 'ranged', [340, 400]],
  ['tsp_caballero', L2('Caballero Vacío', 'Hollow Knight'), 'caballero', 'aggro', [360, 400]], ['tsp_mimo', L2('Mimo del Silencio', 'Mime of Silence'), 'mimo', 'ranged', [360, 400]],
];
for (const [id, n, art, ai, lv] of LZ_MOBS) MOBS[id] = { n, art: ['lz', art], reg: ['sinpintar'], lv, hp: 1.6 + (lv[0] - 300) / 300, atk: 1.95 + (lv[0] - 300) / 400, def: 1.8 + (lv[0] - 300) / 500, spd: ai === 'charge' ? 74 : ai === 'ranged' ? 50 : 56, ai, fam: 'sinpintar', fly: /pez|fantasma/.test(id) ? 1 : 0, drops: [['tinta_viva', 0.18]] };
MOBS.tsp_eco_sombra = { n: L2('Sombra Repetida', 'Repeated Shadow'), art: ['lz', 'eco'], scale: 0.42, reg: ['sinpintar'], lv: [305, 315], hp: 1.2, atk: 1.9, def: 1.6, spd: 62, ai: 'aggro', fam: 'sinpintar', drops: [] };

// ---------- jefes ----------
Object.assign(BOSSES, {
  eco_vencido: { n: L2('Eco del Vencido', 'Echo of the Vanquished'), lv: 310, art: ['lz', 'eco'], scale: 1, hp: 32, atk: 2.75, def: 2.7, spd: 46, moves: ['charge', 'slam', 'summon'], minion: 'tsp_eco_sombra', drops: [['pigmento_puro', 1, 3], ['tinta_viva', 1, 6]], r: 40 },
  fragmento_sin_color: { n: L2('El Fragmento sin Color', 'The Colourless Fragment'), lv: 320, art: ['lz', 'fragmento'], scale: 1, fly: 1, hp: 33, atk: 2.8, def: 3.0, spd: 32, moves: ['slam', 'field', 'summon'], minion: 'tsp_golemito', drops: [['pigmento_puro', 1, 3], ['tinta_viva', 1, 6]], r: 42 },
  sierpe_lienzo: { n: L2('La Sierpe de Tormenta', 'The Storm Serpent'), lv: 330, art: ['lz', 'sierpe'], scale: 1, fly: 1, hp: 34, atk: 2.85, def: 2.8, spd: 50, moves: ['charge', 'volley', 'rain'], minion: 'tsp_pez', drops: [['pigmento_puro', 1, 4], ['tinta_viva', 1, 7]], r: 44 },
});
Object.assign(BOSSES.lienzo_blanco, { lv: 400, art: ['lz', 'lienzo'], scale: 1, hp: 40, atk: 3.1, def: 3.1 });
Object.assign(BOSSES.tsp_golem, { lv: 318 }); Object.assign(BOSSES.tsp_rey, { lv: 340 }); Object.assign(BOSSES.tsp_borron_gran, { lv: 355, minion: 'tsp_borron' }); Object.assign(BOSSES.tsp_marco, { lv: 380, minion: 'tsp_caballero' });
for (const id of ['eco_vencido', 'fragmento_sin_color', 'sierpe_lienzo']) { it('trofeo_' + id, { n: L2('Trofeo: ', 'Trophy: ') + BOSSES[id].n, t: 'mat', stack: true, tier: 1, price: 50, troph: id, icon: ['trophy', trophyCol(id)], rar: 3, d: L2('Expónlo en el museo de tu casa (Vitrina o Pedestal).', 'Display it in your house museum (Display case or Pedestal).') }); }

// ---------- zonas de 300 a 400 ----------
const LZ_ZONE = {
  orilla: { lv: [300, 320], pool: ['tsp_slime', 'tsp_golemito', 'tsp_arana'], boss: 'eco_vencido', boss2: 'tsp_golem' },
  llanura: { lv: [320, 345], pool: ['tsp_esqueleto', 'tsp_lobo', 'tsp_arana'], boss: 'fragmento_sin_color', boss2: 'tsp_rey' },
  cienaga: { lv: [330, 360], pool: ['tsp_borron', 'tsp_pez', 'tsp_fantasma'], boss: 'sierpe_lienzo', boss2: 'tsp_borron_gran' },
  marco: { lv: [360, 385], pool: ['tsp_caballero', 'tsp_mimo', 'tsp_golemito'], boss: 'tsp_marco' },
  blanco: { lv: [385, 400], pool: ['tsp_fantasma', 'tsp_mimo', 'tsp_caballero'], boss: 'lienzo_blanco' },
};
for (const Z of TSP_ZONES) Object.assign(Z, LZ_ZONE[Z.k] || {});
{ const _mk = makeSinPintar; makeSinPintar = function () { const fresh = !G.maps.sin_pintar, M = _mk.apply(this, arguments);
    if (fresh) TSP_ZONES.forEach(Z => { if (Z.boss2 && !M.bossAt.some(b => b.id === Z.boss2)) M.bossAt.push({ x: Z.c[0] + 10, y: Z.c[1] + 6, id: Z.boss2, k: Z.k + '2' }); });
    return M; }; }

// ---------- mecánicas ----------
Object.assign(BMECH, {
  eco_vencido: { every: 8, name: L2('¡Sombra repetida! El Eco se multiplica', 'Repeated shadow! The Echo multiplies'), fn: (m, P) => { tspMinions(m, 'tsp_eco_sombra', 3); const a = Math.atan2(P.y - m.y, P.x - m.x); for (let k = 1; k <= 7; k++) shzAdd(m.x + Math.cos(a) * k * 24, m.y + Math.sin(a) * k * 18, 16, 0.7 + k * 0.08, 0.12); } },
  fragmento_sin_color: { every: 8, name: L2('¡Cristales del límite! Busca el hueco', 'Crystals of the limit! Find the gap'), fn: (m, P) => { for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28 + Math.random() * 0.3; shzAdd(P.x + Math.cos(a) * 46, P.y + Math.sin(a) * 34, 18, 1.0, 0.14); } shzAdd(P.x, P.y, 20, 1.6, 0.18); if (Math.random() < 0.4) tspMinions(m, 'tsp_golemito', 2); } },
  sierpe_lienzo: { every: 7, name: L2('¡Rayos del Gran Telar!', 'Lightning of the Great Loom!'), fn: (m, P) => { for (let k = 0; k < 9; k++) shzAdd(P.x + (Math.random() - 0.5) * (k ? 170 : 6), P.y + (Math.random() - 0.5) * (k ? 110 : 4), 15, 0.7 + k * 0.1, 0.1);
    for (let k = 0; k < 3; k++) HZ.push({ k: 'wave', x: m.x, y: m.y, r: 0, grow: 130, t0: G.t + 1.2 + k * 0.8, t1: G.t + 2.4 + k * 0.8, col: '#e8e0ff', ring: 1 }); } },
});

// ---------- misiones nuevas de Mael (los tres jefes de su dibujo) ----------
const LZ_Q = [['tsp6', 'eco_vencido', L2('La sombra que se repite', 'The Shadow that Repeats'), 310, 'orilla', L2('En la orilla camina un caballero hecho de todos los que ya venciste. El Lienzo lo dibujó con tus recuerdos.', 'On the shore walks a knight made of everyone you already defeated. The Canvas drew it with your memories.')],
  ['tsp7', 'fragmento_sin_color', L2('El guardián del límite', 'The Guardian of the Limit'), 320, 'llanura', L2('Un fragmento de piedra sin color flota en la llanura. Marca dónde se acaba lo pintado.', 'A colourless stone fragment floats over the plain. It marks where the painted world ends.')],
  ['tsp8', 'sierpe_lienzo', L2('Los hilos sueltos', 'The Loose Threads'), 330, 'cienaga', L2('Los hilos sueltos del Gran Telar llegaron hasta aquí y el Lienzo los dibujó como una sierpe de tormenta. Es un eco de Vendaval.', 'The Great Loom\'s loose threads reached this far and the Canvas drew them as a storm serpent. It is an echo of Vendaval.')]];
LZ_Q.forEach(([id, b, n, lv, zk, off]) => { const Z = TSP_ZONES.find(z => z.k === zk); q(id, { n, giver: 'pintora_mael', lv, pre: 'tsp0', desc: L2('Vence a ', 'Defeat ') + BOSSES[b].n + L2(' en ', ' in ') + Z.n + L2(' (Tierras sin Pintar).', ' (Unpainted Lands).'), obj: [{ t: 'boss', b, loc: [Z.c[0], Z.c[1] - 4] }], rew: { xp: 3500000, gold: 280000 }, offer: [off], prog: [Z.n], done: [L2('Otro trozo del borde recupera el color.', 'Another piece of the border gets its colour back.')] }); NPCS.pintora_mael.quests.push(id); });
for (const [id, lv] of [['tsp2', 340], ['tsp3', 355], ['tsp4', 380], ['tsp5', 398]]) if (QUESTS[id]) QUESTS[id].lv = lv;
// trazos ahora empiezan al 400 (MAXLV) y la Tinta los sigue dando

// ---------- lupa: el continente completo, cómo llegar y su bestiario ----------
{ const i = GSIS.findIndex(x => x[0] === 'sin_pintar'); if (i >= 0) GSIS[i][2] = () => [
  L2('Cómo llegar: termina el Velo Roto (vence a la Luna Sonriente, misión «La Luna que sonríe»). Después ve al puente blanco al este de Albor (botón «Seguir» de abajo) y habla con Mael, la Pintora del Borde. Su primera misión pide nivel 300. Toca el puente para cruzar.', 'How to get there: finish the Broken Veil (defeat the Smiling Moon, quest "The Moon that Smiles"). Then go to the white bridge east of Albor ("Follow" button below) and talk to Mael, the Painter of the Border. Her first quest needs level 300. Tap the bridge to cross.'),
  L2('Nivel máximo 400. Zonas: Orilla del Boceto (300-320), Llanura de los Trazos (320-345), Ciénaga de los Borrones (330-360), El Marco Roto (360-385) y El Lienzo en Blanco (385-400). Cada criatura que vences devuelve el color a su zona.', 'Max level 400. Zones: Sketch Shore (300-320), Plain of Strokes (320-345), Swamp of Smudges (330-360), The Broken Frame (360-385) and The Blank Canvas (385-400). Every creature you defeat gives its zone its colour back.'),
  L2('Criaturas: Babosa Borrada, Gólem de Cal y Araña de Tiza (Orilla); Esqueleto Sin Tinta y Lobo Inacabado (Llanura); Nihilito, Pez Pálido y Espectro del Lienzo (Ciénaga); Caballero Vacío y Mimo del Silencio (Marco y Lienzo). Sueltan Tinta Viva.', 'Creatures: Erased Slug, Lime Golem and Chalk Spider (Shore); Inkless Skeleton and Unfinished Wolf (Plain); Little Nihil, Pale Fish and Canvas Specter (Swamp); Hollow Knight and Mime of Silence (Frame and Canvas). They drop Living Ink.'),
  L2('Jefes: Eco del Vencido (310, Orilla: se multiplica en sombras y lanza un tajo en línea), El Gólem Inacabado (318), El Fragmento sin Color (320, Llanura: anillo de cristales, busca el hueco), El Rey en Borrador (340), La Sierpe de Tormenta (330, Ciénaga: rayos y ondas, rueda), El Gran Borrón (355), El Guardián del Marco (380) y el súper jefe El Lienzo en Blanco (400): círculos blancos que borran (−15 % de ataque), pinceladas en franja, bocetos de criaturas y ondas; al 60 % y al 25 % combina ataques.', 'Bosses: Echo of the Vanquished (310, Shore: splits into shadows and throws a line slash), The Unfinished Golem (318), The Colourless Fragment (320, Plain: ring of crystals, find the gap), The Draft King (340), The Storm Serpent (330, Swamp: lightning and waves, roll), The Great Smudge (355), The Frame Warden (380) and the super boss The Blank Canvas (400): white circles that erase (−15% attack), strip brushstrokes, creature sketches and waves; at 60% and 25% it combines attacks.'),
  L2('Misiones de Mael: la cadena principal (Gólem → Rey → Borrón → Marco → Lienzo) y tres más para los jefes de su dibujo (Eco, Fragmento y Sierpe).', 'Mael\'s quests: the main chain (Golem → King → Smudge → Frame → Canvas) and three more for the bosses of her drawing (Echo, Fragment and Serpent).'),
  L2('Trazos: al nivel 400 la experiencia suma Trazos (hasta 50; cada uno +0,4 % de ataque, defensa y vida, no en duelos). Mael cambia 10 Tinta Viva por un buen trozo de Trazo.', 'Strokes: at level 400 experience adds Strokes (up to 50; each +0.4% attack, defence and HP, not in duels). Mael trades 10 Living Ink for a good chunk of Stroke.')]; }
// escala propia de algunas criaturas (la Sombra Repetida es un Eco pequeño)
{ const _sm = spawnMob; spawnMob = function (mid, lv, x, y, L, camp, boss) { const e = _sm.apply(this, arguments); if (e && !boss && MOBS[mid] && MOBS[mid].scale) e.scale = MOBS[mid].scale; return e; }; }
// dificultad medida con tools/dev/jefes.py (v4.70)
Object.assign(BOSS_TUNE, { lienzo_blanco: 2.21, eco_vencido: 1.55, fragmento_sin_color: 1.44, sierpe_lienzo: 1.52 });
