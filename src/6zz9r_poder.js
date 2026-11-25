// ================= v4.74: LUPA › 💪 PODER (todas las formas de ganar poder) =================
// Pestaña propia en la lupa: tu poder ahora y qué te falta, la tabla medida a nivel 400 por clase y cada fuente de poder
// explicada (equipo, herrería, arma despertada, maestría, clase despertada, subrazas, Poder del Velo, Trazos, técnicas,
// armas ancestrales, accesorios, mascotas, comida, familia…). Las cifras son las medidas en el motor (v4.73).
let GPOW_SEL = 'tu';
const GPOW_TAB = [  // nivel 400, 70 % de atributos al principal; cada fila suma a la anterior (miles)
  [L2('Mejor equipo del Lienzo + Arma del Lienzo Eterno', 'Best Canvas gear + Eternal Canvas weapon'), [40, 40, 31, 30, 38, 38, 42]],
  [L2('+ todo a +10 y arma despertada al 10', '+ everything at +10 and weapon awakened to 10'), [58, 59, 44, 43, 55, 55, 61]],
  [L2('+ maestría 50', '+ mastery 50'), [63, 64, 48, 46, 60, 60, 65]],
  [L2('+ clase despertada', '+ awakened class'), [70, 71, 52, 50, 65, 71, 71]],
  [L2('+ subraza transformada (lobo)', '+ transformed subrace (wolf)'), [80, 83, 61, 58, 76, 83, 83]],
  [L2('+ 50 Trazos (máximo)', '+ 50 Strokes (max)'), [96, 100, 73, 70, 91, 99, 99]],
  [L2('+ todas las técnicas', '+ every technique'), [114, 119, 87, 83, 109, 118, 118]],
];
const GPOW_CLS = ['guerrero', 'mago', 'arquero', 'asesino', 'bardo', 'invocador', 'pez'];
const GPOW = [
  ['tu', '⭐ ' + L2('Tu poder ahora', 'Your power now'), () => gpowYou()],
  ['tabla', '📊 ' + L2('Tabla del poder máximo (nivel 400)', 'Max power table (level 400)'), () => gpowTable()],
  ['formula', '🧮 ' + L2('Qué es el Poder y las clases', 'What Power is and the classes'), () => [
    L2('Poder = ataque × 2 + defensa × 1,5 + vida ÷ 10. Lo ves en el menú del personaje, en el top y lo mide el cristal de la Torre.', 'Power = attack × 2 + defence × 1.5 + HP ÷ 10. You see it in the character menu, in the top and the Tower crystal measures it.'),
    L2('Premia la defensa y la vida, por eso el asesino y el arquero sacan menos poder aunque pegan muy fuerte. No dice quién gana un duelo.', 'It rewards defence and HP, which is why the assassin and archer show less power even though they hit very hard. It doesn\'t say who wins a duel.'),
    L2('Las clases siguen rivalizando: el PvP tiene su propio equilibrio (medido: todas entre 0,95 y 1,09, igualadas) y los Trazos no cuentan en duelos, para que no gane quien más horas juega.', 'Classes still rival each other: PvP has its own balance (measured: all between 0.95 and 1.09, even) and Strokes don\'t count in duels, so whoever plays more hours doesn\'t automatically win.')]],
  ['equipo', '🗡 ' + L2('Equipo (armas y armaduras)', 'Gear (weapons and armour)'), () => [
    L2('Es la base de todo. Busca siempre el tier de tu nivel: un arma que se queda más de 20 niveles atrás pierde como mucho un 10 % de daño.', 'It is the base of everything. Always look for your level\'s tier: a weapon more than 20 levels behind loses at most 10% damage.'),
    L2('Tiers 22-26 en el Velo Roto (niveles 262-344) y 27-30 en Las Tierras sin Pintar (360-396), en la herrería con los materiales de cada continente.', 'Tiers 22-26 in the Broken Veil (levels 262-344) and 27-30 in the Unpainted Lands (360-396), at the blacksmith with each continent\'s materials.'),
    L2('Las mejores armas: Arma Velada (nivel 350, El Sin Nombre) y el Arma del Lienzo Eterno (tier 31, nivel 400, solo la suelta El Lienzo en Blanco, 6 %).', 'The best weapons: the Veiled Weapon (level 350, the Nameless One) and the Eternal Canvas weapon (tier 31, level 400, only dropped by The Blank Canvas, 6%).'),
    L2('Armas ancestrales: despiertan con su historia (santuario, portador y creador) y dan +12 % de ataque por paso, hasta +36 %.', 'Ancestral weapons: they awaken through their story (shrine, bearer and creator) and give +12% attack per step, up to +36%.')]],
  ['herreria', '🔨 ' + L2('Herrería: mejorar a +10', 'Blacksmith: upgrade to +10'), () => [
    L2('Mejora arma y armaduras hasta +10 en la herrería. Es de lo que más sube: con todo a +10 y el arma despertada ganas un 45 % más de poder.', 'Upgrade weapon and armour up to +10 at the blacksmith. It is one of the biggest boosts: with everything at +10 and the awakened weapon you gain 45% more power.'),
    L2('Forja artesanal: núcleo (más ataque, vida o maná), temple y runas (fuego, hielo, rayo, vida, viento o tierra). Una runa por arma; se puede quitar.', 'Artisan forge: core (more attack, HP or mana), tempering and runes (fire, ice, lightning, life, wind or earth). One rune per weapon; it can be removed.')]],
  ['despierta', '✨ ' + L2('Arma despertada', 'Awakened weapon'), () => [
    L2('Tu arma gana experiencia con cada victoria (más con enemigos de tu nivel) y despierta hasta el nivel 10: brilla, habla, tiene nombre y sube su daño.', 'Your weapon gains experience with every win (more against enemies of your level) and awakens up to level 10: it glows, talks, has a name and deals more damage.'),
    L2('Cada arma despierta por separado: si la cambias, la nueva empieza de cero.', 'Each weapon awakens separately: if you switch, the new one starts from zero.')]],
  ['maestria', '🗡 ' + L2('Maestría de armas (50)', 'Weapon mastery (50)'), () => [
    L2('Cada tipo de arma tiene maestría propia hasta 50: +0,1 % de ataque por nivel y +5 % al llegar al 50, además de posturas, contraataque y técnica especial.', 'Each weapon type has its own mastery up to 50: +0.1% attack per level and +5% at 50, plus stances, counter and a special technique.'),
    L2('Sube venciendo enemigos (mucho más con enemigos de nivel alto), en duelos y con un libro al día de la biblioteca de tu casa.', 'It rises by defeating enemies (much more with high-level enemies), in duels and with one book a day from your house library.')]],
  ['clase', '🔥 ' + L2('Clase despertada', 'Awakened class'), () => [
    L2('Las tres pruebas de tu maestro de clase en la Isla del Telar (Celestia, nivel 240). Da +10 % de ataque y +8 % de vida y defensa, más el bonus propio de tu clase y 2 habilidades nuevas.', 'Your class master\'s three trials on the Isle of the Loom (Celestia, level 240). It gives +10% attack and +8% HP and defence, plus your class\'s own bonus and 2 new skills.')]],
  ['subraza', '🐺 ' + L2('Subrazas', 'Subraces'), () => [
    L2('Lobo, vampiro o fantasma (Velo Roto). Solo suman poder transformado: el lobo es el que más (unos +15 %), luego vampiro y fantasma.', 'Wolf, vampire or ghost (Broken Veil). They only add power while transformed: the wolf adds the most (about +15%), then vampire and ghost.'),
    L2('Sus habilidades no funcionan en duelos.', 'Their skills don\'t work in duels.')]],
  ['velo', '🌙 ' + L2('Poder del Velo (niveles 251-350)', 'Veil Power (levels 251-350)'), () => [
    L2('Cada nivel por encima del 250 da +0,5 % de ataque y vida, hasta +50 % al nivel 350. Es igual para todas las clases y sale solo al subir de nivel.', 'Every level above 250 gives +0.5% attack and HP, up to +50% at level 350. It is the same for every class and comes by itself as you level up.')]],
  ['trazos', '🖌 ' + L2('Trazos (después del nivel 400)', 'Strokes (after level 400)'), () => [
    L2('Qué son: cuando llegas al nivel máximo (400), la experiencia ya no sube de nivel; se guarda en Trazos, como si siguieras pintando tu hilo.', 'What they are: once you reach max level (400), experience no longer levels you up; it goes into Strokes, as if you kept painting your thread.'),
    L2('Límite: 50 Trazos. Cada uno da +0,4 % de ataque, defensa y vida (en total +20 %). Al llegar a 50 se paran.', 'Limit: 50 Strokes. Each gives +0.4% attack, defence and HP (+20% in total). They stop at 50.'),
    L2('Cómo: experiencia de enemigos y misiones a nivel 400 (los pergaminos de sabiduría también sirven) y Mael, la Pintora del Borde, cambia 10 Tinta Viva por un buen trozo de Trazo.', 'How: experience from enemies and quests at level 400 (wisdom scrolls also help), and Mael, the Painter of the Border, trades 10 Living Ink for a good chunk of Stroke.'),
    L2('No cuentan en duelos.', 'They don\'t count in duels.')]],
  ['tecnicas', '🥋 ' + L2('Técnicas: rivales, mentores y academia', 'Techniques: rivals, mentors and academy'), () => [
    L2('Amistad: habla con cualquier personaje y pulsa «Amistad» (una charla al día, +8). Con 20 propón una rivalidad: cada 3 victorias en duelos de rivales aprendes Golpe del rival (+4 % ataque), Guardia del rival (+5 % defensa) y Aguante del rival (+5 % vida).', 'Friendship: talk to any character and press "Friendship" (one chat a day, +8). At 20 propose a rivalry: every 3 rival duel wins you learn Rival\'s strike (+4% attack), Rival\'s guard (+5% defence) and Rival\'s stamina (+5% HP).'),
    L2('Mentores con 60 de amistad: Brienne (+6 % ataque), la Anciana Mira (+6 % vida), Lys (+3 % de todo), la Doctora Selma (+6 % defensa) e Ysolde (+4 % defensa, +2 % ataque).', 'Mentors at 60 friendship: Brienne (+6% attack), Elder Mira (+6% HP), Lys (+3% of everything), Doctor Selma (+6% defence) and Ysolde (+4% defence, +2% attack).'),
    L2('Academia Arcana: tras 3 lecciones, aprueba el examen de lore y aprendes la Técnica arcana (+4 % ataque y vida). Todas juntas suman un 19 % más de poder.', 'Arcane Academy: after 3 lessons, pass the lore exam and learn the Arcane technique (+4% attack and HP). All together add 19% more power.')]],
  ['extra', '💍 ' + L2('Accesorios, mascotas, comida y familia', 'Accessories, pets, food and family'), () => [
    L2('Anillos y amuletos: los sueltan los jefes (cada jefe su accesorio) y dan ataque, defensa o vida. Lleva los de tu nivel.', 'Rings and amulets: bosses drop them (each boss its own accessory) and they give attack, defence or HP. Wear the ones of your level.'),
    L2('Mascotas: te acompañan y luchan; las mejores (espectrales del Velo, Corvel) dan más.', 'Pets: they accompany you and fight; the best ones (Veil spectral pets, Corvel) give more.'),
    L2('Comida, tónicos y elixires: banquetes (+ataque), tónicos de fuerza y de hierro, y los elixires de alquimia (hasta +25 % ataque y defensa 15 min). Las pociones curativas esperan 8 s.', 'Food, tonics and elixirs: feasts (+attack), strength and iron tonics, and alchemy elixirs (up to +25% attack and defence for 15 min). Healing potions have an 8 s cooldown.'),
    L2('Familia: tu pareja, tus hijos adultos, Kaela y los compañeros luchan contigo (no suben el número de poder, pero ayudan mucho en combate).', 'Family: your partner, your adult children, Kaela and companions fight with you (they don\'t raise the power number, but they help a lot in combat).'),
    L2('Posturas y armas imbuidas: la postura ofensiva da +10 % de ataque y las Esencias de imbuir añaden reacciones elementales.', 'Stances and imbued weapons: the offensive stance gives +10% attack and Imbue essences add elemental reactions.')]],
];
function gpowYou() { const P = G.P; if (!P || !P.S) return [L2('Entra en una partida para ver tu poder.', 'Enter a game to see your power.')]; calcStats(P);
  const w = P.equip.weapon, I = w && ITEMS[w.id], ups = ['weapon', 'head', 'body', 'legs', 'feet'].map(s => (P.equip[s] && P.equip[s].up) || 0), up = Math.round(ups.reduce((a, b) => a + b, 0) / 5 * 10) / 10;
  const t = wmType(), ml = t ? wmLv(t) : 0, tech = (P.tech || []).length, ntech = Object.keys(TECH).length, trz = (P.trz && P.trz.lv) | 0;
  const ok = b => b ? '✅ ' : '⬜ ';
  return [L2('Tu poder: ', 'Your power: ') + fmt(P.S.power) + ' · ' + L2('nivel ', 'level ') + P.lv + '/' + MAXLV,
    ok(I && (I.lv || 0) >= P.lv - 20) + L2('Arma: ', 'Weapon: ') + (I ? I.n + ' (' + L2('nivel ', 'level ') + (I.lv || 1) + ')' : '—'),
    ok(up >= 10) + L2('Mejora media de la herrería: +', 'Average blacksmith upgrade: +') + up + ' / +10',
    ok(w && wlvOf(w) >= 10) + L2('Arma despertada: ', 'Awakened weapon: ') + (w ? wlvOf(w) : 0) + ' / 10',
    ok(ml >= 50) + L2('Maestría: ', 'Mastery: ') + ml + ' / 50',
    ok(!!P.evo) + L2('Clase despertada', 'Awakened class'),
    ok(!!P.sr) + L2('Subraza: ', 'Subrace: ') + (P.sr || '—') + (P.sr ? (P.srF ? L2(' (transformado)', ' (transformed)') : L2(' (sin transformar: no suma)', ' (untransformed: adds nothing)')) : ''),
    ok(P.lv >= 350) + L2('Poder del Velo: +', 'Veil Power: +') + Math.round(Math.max(0, Math.min(100, P.lv - 250)) * 0.5) + ' % / +50 %',
    ok(trz >= 50) + L2('Trazos: ', 'Strokes: ') + trz + ' / 50' + (P.lv < MAXLV ? L2(' (empiezan al nivel 400)', ' (they start at level 400)') : ''),
    ok(tech >= ntech) + L2('Técnicas: ', 'Techniques: ') + tech + ' / ' + ntech]; }
function gpowTable() { return null; }
function gpowTableHTML() {
  const head = `<tr><th></th>${GPOW_CLS.map(c => `<th>${esc((CLASSES[c] || {}).n || c)}</th>`).join('')}</tr>`;
  const rows = GPOW_TAB.map(([n, v]) => `<tr><td>${esc(n)}</td>${v.map(x => `<td>${x}k</td>`).join('')}</tr>`).join('');
  return `<div class="gsrc"><span>${L2('Medido en el motor a nivel 400 (70 % de los atributos al principal). Cada fila suma a la anterior. Con todo: 83.000-119.000 según la clase; sin contar mascotas, anillos, comida ni familia. A nivel 350 con lo mismo: 53.000-75.000.', 'Measured in the engine at level 400 (70% of attributes to the main one). Each row adds to the previous one. With everything: 83,000-119,000 depending on the class; not counting pets, rings, food or family. At level 350 with the same: 53,000-75,000.')}</span></div><div class="gpowT"><table>${head}${rows}</table></div>`; }
function guiaPower() {
  if (typeof GUIA !== 'undefined') GUIA.tab = 'pow';
  const list = GPOW.map(([k, t]) => `<button class="gitem ${GPOW_SEL === k ? 'sel' : ''}" data-gpw="${k}"><span>${esc(t)}</span></button>`).join('');
  const S = GPOW.find(s => s[0] === GPOW_SEL) || GPOW[0];
  const det = `<h4>${esc(S[1])}</h4>` + (S[0] === 'tabla' ? gpowTableHTML() : (S[2]() || []).map(t => `<div class="gsrc"><span>${esc(t)}</span></div>`).join(''));
  openModal(`<div class="frame guia"><h3>🔎 ${L2('Dónde conseguir', 'Where to get it')}</h3><div class="chips">${guiaChipsHTML('pow')}</div><div class="gcols"><div class="glist">${list}</div><div class="gdet gpowD">${det}</div></div><div class="row"><button class="btn" id="gClose">${L2('Cerrar', 'Close')}</button></div></div>`, 'guiamod');
  $('#gClose').onclick = closeModal; guiaBindChips(); $$('[data-gpw]').forEach(b => b.onclick = () => { GPOW_SEL = b.dataset.gpw; guiaPower(); });
}
{ const _gc = guiaChipsHTML; guiaChipsHTML = function (tab) { return `<button class="chip ${tab === 'pow' ? 'on' : ''}" data-gx="pow">💪 ${L2('Poder', 'Power')}</button>` + _gc.apply(this, arguments); }; }
{ const _gb = guiaBindChips; guiaBindChips = function () { _gb.apply(this, arguments); const b = $('.guia [data-gx="pow"]'); if (b) b.onclick = () => guiaPower(); }; }
{ const _rg = renderGuia; renderGuia = function () { if (typeof GUIA !== 'undefined' && GUIA.tab === 'pow') return guiaPower(); return _rg.apply(this, arguments); }; }
if (!document.getElementById('gpowCss')) { const st = document.createElement('style'); st.id = 'gpowCss'; st.textContent = '.gpowT{overflow-x:auto}.gpowT table{border-collapse:collapse;font-size:.78em;width:100%}.gpowT th,.gpowT td{border:1px solid rgba(232,192,112,.3);padding:.2em .3em;text-align:center}.gpowT td:first-child{text-align:left}.gpowT td{font-family:Verdana,Tahoma,sans-serif;font-weight:bold}.gpowT td:first-child{font-family:inherit;font-weight:normal}.gpowD .gsrc span{font-family:Verdana,Tahoma,sans-serif;font-size:.86em;line-height:1.4}'; document.head.appendChild(st); }
// la guía vieja «Camino al poder máximo» de Sistemas apunta a la pestaña nueva
{ const i = typeof GSIS !== 'undefined' ? GSIS.findIndex(x => x[0] === 'poder') : -1; if (i >= 0) GSIS[i][2] = () => [L2('Todo sobre el poder está ahora en su propia pestaña de la lupa: 💪 Poder (tu progreso, la tabla del nivel 400 y cada forma de ganar poder).', 'Everything about power now has its own magnifier tab: 💪 Power (your progress, the level 400 table and every way to gain power).')]; }
