// ================= v4.3: ACTUALIZADOR INTERNO Y NOVEDADES =================
// El juego busca en GitHub (update/version.json) si hay una versión nueva. Si la hay, avisa, descarga el juego nuevo
// (update/thebound.html), lo guarda en el teléfono (IndexedDB) y se reinicia con él. El APK instalado no cambia, así que
// la firma sigue siendo la misma y la partida (localStorage) es compartida: la versión descargada corre en un iframe
// srcdoc, que tiene el mismo origen que la página del APK.
// Seguridad: se comprueban tamaño, SHA-256 y número de versión. Si la versión descargada no llega al título dos veces
// seguidas (o en 60 s), se marca como mala y se vuelve a la versión del APK.
// Publicar una versión nueva: subir GAME_VER/GAME_BUILD, añadir su entrada al principio de CHANGELOG y ejecutar
// python3 tools/dev/release.py (escribe update/thebound.html y update/version.json). Luego subirlo a la rama main.
const GAME_VER = '4.23', GAME_BUILD = 44;
const UPD_MIN_APK = 24;   // primer APK con actualizador; súbelo solo si cambia la parte Android (tools/apk)
const UPD_REPO = 'ventisca-gif/the-bound';
const UPD_BASE_DEF = 'https://raw.githubusercontent.com/' + UPD_REPO + '/main/update/';
const UPD_APK_PAGE = 'https://github.com/' + UPD_REPO + '/releases/latest';
// Novedades: la más nueva primero. JSON estricto entre las marcas (tools/dev/release.py lo lee).
const CHANGELOG = /*CL*/[
  {"b": 44, "v": "4.23", "d": "2026-11-14", "es": ["Subrazas en el PvP: en un duelo funcionan las 4 habilidades de cada subraza (zarpazo, aullido, salto, almas heladas, atravesar, poseer, lamento, agarre de sangre, murciélagos, sed de sangre…) y el rival ve tu transformación, tus efectos y tus proyectiles en su teléfono.", "Las subrazas están igualadas entre sí y no importa tu clase: contra jugadores, el daño de una habilidad de subraza depende de tu nivel y de la habilidad, no del ataque de tu clase. Lobo, fantasma y vampiro hacen el mismo daño por segundo (el vampiro cuenta lo que se cura).", "En duelo, Poseer se mete en el rival y le arranca el alma en 4 golpes; Vuelo Nocturno da esquiva.", "Rocas de minería (todos los minerales), árboles, hierbas, montículos y puntos de buceo reaparecen a los 5 segundos en el mismo sitio."], "en": ["Subraces in PvP: in a duel all 4 skills of each subrace work (claw rake, howl, pounce, icy souls, phase through, possess, wail, blood grip, bats, bloodthirst…) and your opponent sees your transformation, effects and projectiles on their phone.", "Subraces are balanced against each other regardless of your class: against players, a subrace skill's damage depends on your level and the skill, not your class's attack. Wolf, ghost and vampire deal the same damage per second (the vampire counts its healing).", "In a duel, Possess slips into the opponent and tears out their soul in 4 hits; Night Flight gives dodge.", "Mining rocks (every ore), trees, herbs, mounds and diving spots respawn after 5 seconds in the same place."]},
  {"b": 43, "v": "4.22", "d": "2026-11-14", "es": ["La lupa 🔎 te guía en todo: la flecha dorada funciona también dentro del Velo Roto y del Jardín de la Sonrisa, y si el sitio está en otro mapa te lleva primero al portal o a la puerta.", "Cada secreto de 🗝 Secretos apunta al sitio exacto del paso en el que vas (Fenrik, Malvia, el islote, los pedestales, el altar que falta, los trozos del nombre…).", "Nuevo aviso 📍 bajo la misión: te dice cuál es el siguiente secreto y dónde ir. Tócalo para encender la flecha.", "Pestañas nuevas en la lupa: 👹 Enemigos (todos, con nivel, botín, dónde salen y flecha al campamento más cercano) y 🐺 Subrazas (pasivas, habilidades, ofrenda y dónde está Corvel).", "Lobo: el botón 🐺 pasa ahora por la forma híbrida (pelaje en la cara y el cuerpo, hocico, colmillos y ojos dorados, con tu ropa y tus cosméticos) y luego por el lobo a cuatro patas.", "Vampiro: Agarre de Sangre sustituye a Mordisco. Sujeta a un enemigo y le chupa la sangre 2,5 s mientras te curas; también funciona con jugadores online que tengan el PvP activado (en duelo es la única habilidad de subraza que se puede usar)."], "en": ["The 🔎 guide leads you everywhere: the golden arrow also works inside the Broken Veil and the Garden of the Smile, and if the place is on another map it first takes you to the portal or door.", "Each secret in 🗝 Secrets points to the exact place of the step you are on (Fenrik, Malvia, the islet, the pedestals, the missing altar, the pieces of the name…).", "New 📍 notice under the quest: it tells you the next secret and where to go. Tap it to turn on the arrow.", "New guide tabs: 👹 Enemies (all of them, with level, loot, where they appear and an arrow to the nearest camp) and 🐺 Subraces (passives, skills, offering and where Corvel is).", "Wolf: the 🐺 button now goes through the hybrid form (fur on face and body, snout, fangs and golden eyes, with your clothes and cosmetics) and then the four-legged wolf.", "Vampire: Blood Grip replaces Bite. It holds an enemy and drinks its blood for 2.5 s while you heal; it also works on online players with PvP on (in a duel it is the only subrace skill you can use)."]},
  {"b": 42, "v": "4.21", "d": "2026-11-14", "es": ["Lanzas, hachas y mazas para el guerrero (24, sacadas de la hoja de Sergio, tiers 22 a 26) con su propia animación de ataque: la lanza llega más lejos, el hacha da más crítico y la maza aturde.", "6 mascotas espectrales con su dibujo: Sapo Fúngico, Babosa de Ectoplasma, Búho de las Almas, Polilla Calavera, Lobo de Niebla y Rape Farolillo. Las vende Corvel.", "Nueva región del Velo Roto: el Bosque de la Torre Hueca, con niebla azul, la torre de Corvel el Encapuchado, la Biblioteca Anegada de la hechicera Ilvaine y la caldera de la bruja Grizzla.", "Nuevo jefe: Ossaryn, el Rey de las Rosas Azules (calavera coronada). Te señala y caen estrellas, hace florecer rosas que atrapan y levanta a sus caballeros.", "6 enemigos nuevos con mecánicas: Bruja de la Caldera (charcos de veneno), Espectro de la Niebla (se vuelve intangible y aparece detrás), Huargo Espectral (aullido de manada), Caballero de las Rosas (escudo de espinas), Bibliotecario Ahogado (páginas) y Polilla Calavera Gigante (polvo que ralentiza). En el Velo Roto se gana un 35 % más de experiencia.", "Subrazas: Mitad Lobo, Mitad Fantasma o Mitad Vampiro (ritual de Corvel). Cambian tu aspecto en todas las estructuras de cuerpo y tienen pasivas. El botón 🐺/👻/🦇 te transforma cuando quieras: lobo a cuatro patas con el pelaje del color que elijas, fantasma blanco y transparente con tu ropa, o vampiro con alas. Cada una trae 4 habilidades propias (zarpazo, aullido, poseer, mordisco, enjambre de murciélagos, vuelo...). La Poción de Sangre Limpia la quita.", "Ilvaine, la Hechicera del Ojo: conjuros nuevos con su botón 🔮 (Ojo del Abismo, Velas Flotantes, Marea de Tinta y Páginas Cortantes), lectura diaria del Ojo, su marca del tercer ojo con labios negros, y se la puede enamorar.", "La guía 🔎 tiene una pestaña nueva, 🗝 Secretos: explica paso a paso todas las misiones y mundos secretos del Velo Roto, con pistas que se piden una a una.", "Las novedades largas ya no se cortan en la ventana de actualización."], "en": ["Spears, axes and maces for the warrior (24, taken from Sergio's sheet, tiers 22 to 26) with their own attack animation: the spear reaches further, the axe crits more and the mace stuns.", "6 spectral pets with their drawing: Fungus Toad, Ectoplasm Slug, Owl of Souls, Skull Moth, Mist Wolf and Lantern Angler. Corvel sells them.", "New Broken Veil region: the Hollow Tower Woods, with blue mist, the tower of Corvel the Hooded, the Flooded Library of the sorceress Ilvaine and the cauldron of the witch Grizzla.", "New boss: Ossaryn, King of the Blue Roses (a crowned skull). He points at you and stars fall, makes roses bloom that trap you and raises his knights.", "6 new enemies with mechanics: Cauldron Hag (poison puddles), Mist Wraith (turns intangible and appears behind you), Spectral Warg (pack howl), Knight of the Roses (thorn shield), Drowned Librarian (pages) and Giant Skull Moth (slowing dust). In the Broken Veil you earn 35% more experience.", "Subraces: Half-Wolf, Half-Ghost or Half-Vampire (Corvel's ritual). They change your look on every body type and have passives. The 🐺/👻/🦇 button transforms you whenever you want: a four-legged wolf with the fur color you choose, a white see-through ghost with your outfit, or a winged vampire. Each brings 4 skills of its own (claw rake, howl, possess, bite, bat swarm, flight...). The Clean Blood Potion removes it.", "Ilvaine, the Sorceress of the Eye: new spells with their 🔮 button (Eye of the Abyss, Floating Candles, Ink Tide and Cutting Pages), a daily Reading of the Eye, her third-eye mark with black lips, and she can be romanced.", "The 🔎 guide has a new tab, 🗝 Secrets: it explains step by step every secret quest and world of the Broken Veil, with hints you ask for one at a time.", "Long patch notes are no longer cut off in the update window."]},
  {"b": 41, "v": "4.20", "d": "2026-11-14",
   "es": ["Historia principal del Velo Roto con El Hombre sin Rostro: 7 jefes nuevos con diseño y mecánica propios (Ghorm el Gran Brujo Sapo te atrapa con la lengua, Cornaviva embiste, Lady Morwen se divide en reflejos que explotan, Lady Sanguia se cura con tu vida, Baalzor lanza anillos de fuego, el Reflejo Eclipsado copia tu aspecto y alterna inmunidad a habilidades o ataques, y Risotto el bufón salta y deja trampas). Ya son 12 jefes en el continente.", "Corrupción del Velo: sube mientras exploras. Con 30 % ves el mundo distinto y salen enemigos corruptos; con 60 % se abren muros secretos, aprendes el Grito del Velo (toca el contador) y algunos personajes te cuentan secretos. Oren la purifica.", "Jefes con memoria: si vences a un jefe casi siempre con habilidades o con ataques normales, la próxima vez resiste ese tipo de daño y te da otra recompensa.", "Luna de sangre: los jefes del Velo salen en versión Sangrienta, más fuertes y con más botín.", "Heredero del Eclipse: al vencer a la Luna Sonriente recibes una corona de eclipse y +8 % de daño de noche.", "Bioma secreto: el Jardín de la Sonrisa, solo cuando la luna sonríe (de medianoche a las 3). Criaturas adorables de nivel 350 que abrazan muy fuerte, el Tendero Imposible (Reloj sin Manecillas, Sombra Embotellada, Una Mañana, Mapa de Ninguna Parte) y El Sin Nombre, que no se vence luchando: hay que descubrir su nombre verdadero.", "Arma Velada con voluntad propia: habla, crece con cada criatura del Velo y a las 300 te deja elegir entre Guardiana (escudos para ti y tu grupo) o Devoradora (daño y robo de vida contra criaturas malditas).", "Tres finales según tus decisiones: El Amanecer, La Nueva Luna o El Heredero Corrupto. Nuevo capítulo de las Crónicas.", "Las clases siguen igualadas a nivel 350."],
   "en": ["Main story of the Broken Veil with the Faceless Man: 7 new bosses with their own design and mechanic (Ghorm the Great Toad Warlock grabs you with his tongue, Cornaviva charges, Lady Morwen splits into exploding reflections, Lady Sanguia heals from your life, Baalzor casts rings of fire, the Eclipsed Reflection copies your look and switches immunity between skills and attacks, and Risotto the jester blinks and leaves traps). The continent now has 12 bosses.", "Veil Corruption: it rises while you explore. At 30% the world looks different and corrupted enemies appear; at 60% secret walls open, you learn the Veil Scream (tap the meter) and some characters tell you secrets. Oren purifies it.", "Bosses with memory: if you beat a boss mostly with skills or with basic attacks, next time it resists that damage type and gives a different reward.", "Blood moon: Veil bosses appear in a Bloody version, stronger and with more loot.", "Eclipse Heir: defeating the Smiling Moon gives you an eclipse crown and +8% damage at night.", "Secret biome: the Garden of the Smile, only while the moon smiles (midnight to 3). Adorable level 350 creatures that hug very hard, the Impossible Shopkeeper (Handless Clock, Bottled Shadow, A Morning, Map of Nowhere) and the Nameless One, who cannot be beaten by fighting: you must discover its true name.", "Veiled Weapon with a will of its own: it talks, grows with every Veil creature and at 300 lets you choose Guardian (shields for you and your group) or Devourer (damage and lifesteal against cursed creatures).", "Three endings based on your choices: The Dawn, The New Moon or The Corrupted Heir. New Chronicles chapter.", "Classes remain balanced at level 350."]},
  {"b": 40, "v": "4.19", "d": "2026-11-13",
   "es": ["Armaduras dark fantasy propias para los tiers 22 a 26, adaptadas a todos los cuerpos: Lobo Nocturno (cuello de pelo y capucha de lobo), Sepulcrales (placas con vidriera de luz y corona), Velo Roto (corsé carmesí, gorguera y velo), Eclipsadas (sol eclipsado, hombreras doradas y casco de cuernos) y Luna Sonriente (traje de bufón con la sonrisa de la luna y cascabeles).", "Poder del Velo: desde el nivel 251, cada nivel da +0,5 % de ataque y vida (hasta +50 % a nivel 350). Igual para todas las clases.", "Pantano de las Almas Perdidas: nuevo botón de linterna. Apagada, aparecen puentes espectrales hacia un islote con cofres de Esencia Espectral.", "Aldea de las Campanas Muertas: Nocturna, la Mercader del Eclipse, solo vende de noche (Elixir del Eclipse y más). Oren te pide decidir: tocar o romper la última campana, y la aldea lo recuerda.", "Bosque de los Susurros: lee las 3 estelas y toca los pedestales en orden para disipar las ilusiones que protegen a Varkhul. Si te equivocas, aparece un Imitador con tu propio aspecto.", "Catedral del Eclipse: enciende los 3 altares para abrir la reja del Rey de las Campanas.", "Castillo de la Luna Sonriente: la Luna te mira y, si te ve, los enemigos se vuelven más rápidos. Al vencerla eliges entre dos finales, cada uno con su recompensa.", "Enemigos nuevos: Lancero Sepulcral y Acólito del Velo. Nuevas mecánicas: la cruz de luz del Obispo Hueco y los lanceros de Varkhul.", "La guía 🔎 muestra todo lo del Velo Roto: en qué región sale cada material y cómo llegar."],
   "en": ["Unique dark fantasy armor for tiers 22 to 26, fitted to every body: Night Wolf (fur collar and wolf hood), Sepulchral (plates with a stained-glass glow and crown), Broken Veil (crimson corset, ruff and veil), Eclipsed (eclipsed sun, gold pauldrons and horned helm) and Smiling Moon (jester suit with the moon's grin and bells).", "Veil Power: from level 251, each level gives +0.5% attack and health (up to +50% at level 350). Same for every class.", "Swamp of Lost Souls: new lantern button. With it off, spectral bridges appear leading to an islet with Spectral Essence chests.", "Village of the Dead Bells: Nocturna, the Eclipse Merchant, only sells at night (Eclipse Elixir and more). Oren asks you to choose: ring or break the last bell, and the village remembers.", "Forest of Whispers: read the 3 stelae and touch the pedestals in order to dispel the illusions guarding Varkhul. If you get it wrong, a Mimic with your own look appears.", "Cathedral of the Eclipse: light the 3 altars to open the King of Bells' gate.", "Castle of the Smiling Moon: the Moon watches you and, if it sees you, enemies get faster. After defeating it you choose between two endings, each with its own reward.", "New enemies: Sepulchral Lancer and Veil Acolyte. New mechanics: the Hollow Bishop's cross of light and Varkhul's lancers.", "The 🔎 guide shows everything in the Broken Veil: which region drops each material and how to get there."]},
  {"b": 39, "v": "4.18", "d": "2026-11-13",
   "es": ["Nuevo: el Continente del Velo Roto, dark fantasy, niveles 255 a 350. Por primera vez se ve el cielo: noche, nubes magenta, niebla y la Luna Sonriente.", "Para abrir el portal antiguo (al oeste de la Ciudadela de Arxar) habla con Fenrik, el Lobo Viejo, en el Bosque Susurrante y con la bruja Malvia, cerca del Pantano Gris.", "Cinco regiones: Pantano de las Almas Perdidas (agua luminosa), Aldea de las Campanas Muertas, Bosque de los Susurros, Catedral del Eclipse y Castillo de la Luna Sonriente.", "Enemigos nuevos: Brujo Sapo, Alce Velado, Hechicera Violeta, Hechicera Carmesí, Demonio Cornudo, Soldado Hueco, Diácono del Eclipse y Heraldo Lunar.", "Jefes con mecánicas: el Obispo Hueco reza y levanta a sus muertos; los soldados de Varkhul, el Rey Esqueleto, lo cubren hasta que caen; el Rey de las Campanas avisa cada ataque con campanadas, apaga la catedral y se encierra tras tres sellos; la Luna Sonriente lanza rayos, abre los ojos y enfurece a todos.", "Nivel máximo 350. Tiers 22 a 26 con las armas dark fantasy de Sergio: mandoble y Espada de la Dama para el guerrero, violín para el bardo, guadaña lunar para el invocador, y armaduras del Lobo Nocturno, Sepulcrales, del Velo Roto, Eclipsadas y de la Luna Sonriente.", "Capucha y manto del Lobo Nocturno, materiales nuevos (salen en la lupa 🔎) y un capítulo nuevo de las Crónicas.", "PvP reequilibrado para el nivel 350."],
   "en": ["New: the Broken Veil Continent, dark fantasy, levels 255 to 350. For the first time you see the sky: night, magenta clouds, fog and the Smiling Moon.", "To open the ancient portal (west of the Arxar Citadel), talk to Fenrik, the Old Wolf, in the Whispering Forest and to the witch Malvia, near the Gray Swamp.", "Five regions: Swamp of Lost Souls (glowing water), Village of the Dead Bells, Forest of Whispers, Cathedral of the Eclipse and Castle of the Smiling Moon.", "New enemies: Toad Warlock, Veiled Elk, Violet Sorceress, Crimson Sorceress, Horned Fiend, Hollow Soldier, Eclipse Deacon and Lunar Herald.", "Bosses with mechanics: the Hollow Bishop prays and raises his dead; the soldiers of Varkhul, the Skeleton King, shield him until they fall; the King of Bells announces each attack with tolls, darkens the cathedral and locks himself behind three seals; the Smiling Moon fires beams, opens its eyes and enrages everyone.", "Max level 350. Tiers 22 to 26 with Sergio's dark fantasy weapons: greatsword and Lady's Sword for the warrior, violin for the bard, lunar scythe for the summoner, and Night Wolf, Sepulchral, Broken Veil, Eclipsed and Smiling Moon armor.", "Night Wolf hood and mantle, new materials (shown in the 🔎 guide) and a new Chronicles chapter.", "PvP rebalanced for level 350."]},
  {"b": 38, "v": "4.17", "d": "2026-11-13",
   "es": ["Los jefes del mundo tienen mecánicas nuevas, siempre avisadas en el suelo: el Rey Slime escupe slime que te deja pegado (rueda para soltarte), el Ent hace brotar raíces, Gruk toca su tambor de guerra (rueda cuando llegue la onda) y se enfurece, Morgana te lanza un maleficio que invierte tus pasos, el Gólem de Hielo congela el suelo, Volcanus hace erupciones de lava y Vael llama a sus soldados y, a mitad de vida, se vuelve inmune hasta que actives 3 sellos dorados.", "Mapa: acércalo o aléjalo con dos dedos, arrástralo con uno, o usa los botones + − ⟲."],
   "en": ["World bosses have new mechanics, always warned on the ground: the Slime King spits slime that sticks you in place (roll to break free), the Ent makes roots burst out, Gruk beats his war drum (roll when the wave arrives) and enrages, Morgana casts a hex that reverses your steps, the Ice Golem freezes the ground, Volcanus erupts lava and Vael calls his soldiers and, at half health, becomes immune until you activate 3 golden seals.", "Map: zoom in or out with two fingers, drag it with one, or use the + − ⟲ buttons."]},
  {"b": 37, "v": "4.16", "d": "2026-11-13",
   "es": ["Nuevo botón 🔎 «Dónde conseguir» junto al Libro: cada material, arma, armadura, cosmético y jefe con dónde se consigue (monstruos, jefes, minería, tala, tiendas y recetas con sus materiales). «Seguir» enciende la flecha dorada hasta el sitio; vuelve a tocar para apagarla.", "Las habilidades de mejora pintan a tu personaje del color de su nombre mientras duran (Furia en rojo, Escarcha en hielo, Invisibilidad en sombra, Fortaleza en oro…) y los escudos muestran una burbuja. Cada habilidad lanza un destello del color de su elemento. Funciona con todos los cuerpos y se ve en el online.", "Las criaturas de Altavela usan el dibujo de Sergio, con el mismo detalle que en su imagen.", "Las armas superadas pierden como mucho un 30 % de daño (antes 55 %)."],
   "en": ["New 🔎 \"Where to get it\" button next to the Book: every material, weapon, armor, cosmetic and boss with where to get it (monsters, bosses, mining, woodcutting, shops and recipes with their materials). \"Follow\" turns on the golden arrow to the place; tap again to turn it off.", "Buff skills paint your character in the color of their name while they last (Fury red, Frost icy, Invisibility shadow, Fortress gold…) and shields show a bubble. Every skill casts a flash in its element color. Works with every body and is seen online.", "Altavela's creatures use Sergio's drawing, with the same detail as his image.", "Outgrown weapons lose at most 30% damage (was 55%)."]},
  {"b": 36, "v": "4.15", "d": "2026-11-13",
   "es": ["Nuevo: Altavela, el Continente Celestial (nivel 220+). Puerta en la Isla de los Vientos de Celestia.", "La capital de los Alados que sobrevivieron, las Llanuras de Nimbo, el Templo de Aeris, los Campos de Tormenta e islotes flotantes que se recorren volando.", "Criaturas nuevas: Arpía Maligna, Medusa de Nube, Manta del Viento, Centinela de Aeris y Chispa Errante. Jefes: Kaelyra la Reina de las Arpías, el Coloso de Aeris y Vendaval la Sierpe de Tormenta (voladores).", "Tormentas mágicas que cruzan el continente: el cielo se oscurece y caen rayos que avisan antes de caer.", "Investigación en grupo con el Archivista Orelio: une fragmentos de mapa roto, descifra las estelas en la lengua de los Vientos y abre las tumbas de los Reyes del Aire. Lo que descubre cada miembro del grupo suma.", "3 misiones de la Reina Lyssandra, capa nueva y 2 capítulos de las Crónicas en español e inglés."],
   "en": ["New: Altavela, the Celestial Continent (level 220+). Gate on Celestia's Isle of Winds.", "The capital of the surviving Winged, the Nimbus Plains, the Temple of Aeris, the Storm Fields and floating islets you reach by flying.", "New creatures: Malign Harpy, Cloud Jellyfish, Wind Manta, Aeris Sentinel and Wandering Spark. Bosses: Kaelyra the Harpy Queen, the Colossus of Aeris and Vendaval the Storm Wyrm (flying).", "Magic storms sweep across the continent: the sky darkens and lightning strikes after a warning.", "Group research with Orelio the Archivist: join broken map fragments, decipher the stelae in the Wind tongue and open the tombs of the Sky Kings. What each group member discovers adds up.", "3 quests from Queen Lyssandra, a new cape and 2 Chronicle chapters in Spanish and English."]},
  {"b": 35, "v": "4.14", "d": "2026-11-13",
   "es": ["Online: ahora se ven los ataques y las habilidades de los demás jugadores (pose, cortes, anillos, rayos, proyectiles y partículas), por sala, WiFi e internet. Los saltos se ven en el aire.", "Habilidades más fieles a su nombre: Salto Devastador salta de verdad, Voltereta y Paso de Baile dan un brinco, y Tsunami, Fauces del Megalodón, Cosecha Final y Juicio Final tienen efectos nuevos.", "Modo optimizado en Ajustes (sin clima ni lluvia, efectos simples, sin HD, 30 imágenes por segundo). Se activa solo si el juego va con lag.", "Menos consumo con el juego quieto y limpieza de memoria para que el juego no se cierre tras mucho rato.", "Inventario: botón Seleccionar para tirar varios objetos de una vez, los objetos de misión que ya no necesitas se pueden tirar y una Tarjeta de Tren repetida se convierte en 100 de saldo.", "Al equipar o comprar ropa, las listas ya no vuelven arriba.", "Las armas de más de 20 niveles por debajo del tuyo pierden fuerza (hasta un 55 %): ya no sirve la espada de cobre hasta el final.", "El Velo (mundo espiritual) es ahora un mundo de sueño blanco y acolchado, con árboles de algodón, lago de leche, tumbas y urnas de llama fría.", "Arreglo: en el online, las armas y armaduras de tier 16 a 21 se veían como tier 15."],
   "en": ["Online: you now see other players' attacks and skills (pose, slashes, rings, beams, projectiles and particles), over room, WiFi and internet. Jumps are seen in the air.", "Skills closer to their names: Devastating Leap really jumps, Roll and Dance Step hop, and Tsunami, Megalodon Jaws, Final Harvest and Final Judgment have new effects.", "Optimized mode in Settings (no weather or rain, simple effects, no HD, 30 frames per second). It turns on by itself if the game lags.", "Lower usage while standing still and memory cleanup so the game doesn't close after a long session.", "Inventory: Select button to drop several items at once, quest items you no longer need can be dropped and a duplicate Train Card becomes 100 credit.", "When equipping or buying clothes, lists no longer jump back to the top.", "Weapons more than 20 levels below yours lose strength (up to 55%): the copper sword no longer works until the end.", "The Veil (spirit world) is now a white, quilted dream world with cotton trees, a milk lake, graves and cold-flame urns.", "Fix: online, tier 16 to 21 weapons and armor showed as tier 15."]},
  {"b": 34, "v": "4.13", "d": "2026-11-13",
   "es": ["Armas nuevas de madera, cobre, hierro, acero, plata y oro para todas las clases, con el dibujo de cobre de Sergio: más detalle en la mano (en HD se dibujan al doble) y ataques nuevos en 5 tiempos con su impacto.", "Las dagas van una en cada mano, el arco apunta bien y el pez lleva sus aletas en las manos.", "Campamento de los Vigías del Alba al este de Albor, en la Costa Coral: 8 miembros con su propio estilo y 5 misiones para ayudar y rescatar gente.", "Al unirte te dan su uniforme (abrigo, pantalón y botas) como cosmético; te lo puedes quitar cuando quieras.", "Lore nuevo: Edrin Valcorde, el pescador que hace mil años cuidó al primer portador del hilo vacío. Capítulo y pista nuevos en el Libro del Vínculo."],
   "en": ["New wood, copper, iron, steel, silver and gold weapons for every class, based on Sergio's copper drawing: more detail in hand (drawn at double size in HD) and new 5-step attacks with their impact.", "Daggers go one in each hand, the bow aims properly and the Fish class holds its fins in its hands.", "Dawn Wardens camp east of Albor, on the Coral Coast: 8 members with their own style and 5 quests to help and rescue people.", "Joining gives you their uniform (coat, trousers and boots) as a cosmetic; take it off whenever you like.", "New lore: Edrin Valcorde, the fisherman who cared for the first bearer of the empty thread a thousand years ago. New chapter and clue in the Book of the Bond."]},
  {"b": 33, "v": "4.12", "d": "2026-11-13",
   "es": ["Los cuerpos femeninos tienen busto: Esbelta y Menuda pequeño, Clásica mediano y Curvas grande.", "Se ve con cualquier ropa, armadura o cosmético, de frente y de perfil, y también en las NPCs femeninas."],
   "en": ["Female bodies now have a bust: small for Slender and Petite, medium for Classic and large for Curvy.", "It shows with any clothes, armor or cosmetic, from the front and in profile, and on female NPCs too."]},
  {"b": 32, "v": "4.11", "d": "2026-11-13",
   "es": ["Los árboles nunca se extinguen: al talarlos, el tocón se convierte en un retoño y luego vuelve a ser un árbol.", "Árboles, arbustos y hierbas quitados con el martillo de construcción vuelven a crecer a los 15 minutos, salvo que hayas construido encima. Las rocas y menas quitadas no vuelven.", "Los retoños no se pueden talar hasta que crecen."],
   "en": ["Trees never go extinct: after chopping, the stump becomes a sapling and then grows back into a tree.", "Trees, bushes and herbs removed with the building hammer grow back after 15 minutes unless you built on that spot. Removed rocks and ores do not come back.", "Saplings can't be chopped until they grow."]},
  {"b": 31, "v": "4.10", "d": "2026-11-13",
   "es": ["Valentina vende tres trajes por oro: Plata y Azul, Carmesí y Oro, y Marcas Rojas y Oro. Se ajustan a las ocho estructuras en las cuatro direcciones."],
   "en": ["Valentina sells three outfits for gold: Silver and Blue, Crimson and Gold, and Red Markings and Gold. They fit all eight builds in all four directions."]},
  {"b": 30, "v": "4.9", "d": "2026-11-13",
   "es": ["Bufandín estrena el sprite del gatito azul con bufanda roja y cuatro fotogramas de caminata por dirección."],
   "en": ["Scarfy gets a new blue cat sprite with a red scarf and four walking frames per direction."]},
  {"b": 29, "v": "4.8", "d": "2026-11-13",
   "es": ["Bufandín redibujado en HD: el doble de resolución, ojos con brillo, orejas rosas, mejillas con mechones, luna en la frente, hocico, cola rizada y una bufanda carmesí con franja dorada y flecos que ondea al caminar."],
   "en": ["Scarfy redrawn in HD: double resolution, shiny eyes, pink ears, fluffy cheeks, a crescent moon on its forehead, muzzle, curled tail and a crimson scarf with a gold stripe and fringe that flutters as it walks."]},
  {"b": 28, "v": "4.7", "d": "2026-11-13",
   "es": ["Nueva boutique en cada pueblo, con tejado morado: Valentina, la modista, vende la colección nueva.", "Ropa nueva: Suéter de Punto Medianoche (cuello de cuadrícula, franja carmesí, puños rosas), Pantalón Holgado Café, Zapatillas Carmesí, Tirita en la Mejilla, Vestido de Noche Carmesí y Chaqueta de Cuero. Se ajustan a las 8 estructuras.", "Nueva mascota: Bufandín, el Gato Viajero (+6% de velocidad y +4% de crítico).", "PvP equilibrado a nivel máximo: todas las clases pueden hacerse frente. En duelo las curas y escudos rinden menos, y cada clase tiene un ajuste de daño solo para PvP.", "Las invocaciones del Invocador ahora también atacan al rival en un duelo."],
   "en": ["New boutique in every town, with a purple roof: Valentina, the designer, sells the new collection.", "New clothes: Midnight Knit Sweater (grid collar, crimson stripe, pink cuffs), Baggy Brown Trousers, Crimson Sneakers, Cheek Bandage, Crimson Evening Dress and Leather Jacket. They fit all 8 builds.", "New pet: Scarfy, the Wandering Cat (+6% speed and +4% crit).", "PvP balanced at max level: every class can stand up to the others. In duels heals and shields are weaker, and each class has a PvP-only damage adjustment.", "Summoner spirits now also attack your opponent in a duel."]},
  {"b": 27, "v": "4.6", "d": "2026-11-13",
   "es": ["Multas: todos los guardias cobran, también el Guardia Rolf en Albor y el Capitán Darius en Arxar, y cualquiera acepta las multas de cualquier pueblo (así se pagan las de Yarakai y Puerto Brasa).", "Nuevo panel «Multas y antecedentes» al hablar con un guardia: lo que debes en cada pueblo, pagar una o todas.", "Si eres Criminal en un pueblo sin multa registrada, puedes pagar para limpiar tu nombre.", "Si no debes nada, el guardia te lo dice.", "El Colgante de Promesa ya no pide nivel de Joyería."],
   "en": ["Fines: every guard collects them, including Guard Rolf in Albor and Captain Darius in Arxar, and any guard accepts fines from any town (so Yarakai and Puerto Brasa fines can be paid).", "New \"Fines and record\" panel when talking to a guard: what you owe in each town, pay one or all.", "If you are a Criminal in a town with no recorded fine, you can pay to clear your name.", "If you owe nothing, the guard tells you.", "The Promise Pendant no longer needs a Jewelry level."]},
  {"b": 26, "v": "4.5", "d": "2026-11-13",
   "es": ["Ajuste automático: cascos, sombreros, coronas, orejas y cuernos se adaptan solos a la cabeza de cada estructura; los sombreros muy altos se encogen para no salirse.", "Las prendas nuevas que se añadan al juego se colocarán solas en las 8 estructuras.", "Arreglo: el casco del guerrero tapaba un poco el ojo derecho.", "Arreglo: las capuchas del asesino y el invocador tapaban el borde del ojo en la estructura Robusto.", "Los sombreros de los NPCs también se ajustan a su cabeza."],
   "en": ["Automatic fit: helmets, hats, crowns, ears and horns adapt to the head of every build; very tall hats shrink so they stay on screen.", "New gear added to the game will fit all 8 builds on its own.", "Fix: the warrior helmet slightly covered the right eye.", "Fix: assassin and summoner hoods covered the edge of the eye on the Sturdy build.", "NPC hats also fit their heads."]},
  {"b": 25, "v": "4.4", "d": "2026-11-13",
   "es": ["3 estructuras nuevas de cuerpo y cabeza por sexo, además de la clásica: Héroe, Atlético y Robusto; Esbelta, Curvas y Menuda. Se eligen en «Estructura» al crear el personaje o en la peluquería.", "La estructura Héroe tiene los ojos de la referencia: ceja del color del pelo, ojo 2×2 con brillo y boca pequeña.", "Ropa, armaduras, cosméticos, pelo y armas se ajustan a cada estructura en las cuatro direcciones.", "Los NPCs y los enemigos humanos tienen estructuras variadas.", "Los demás jugadores ven tu estructura por WiFi local y por internet.", "Arreglo: las gafas de sol se ponían sobre la frente; ahora tapan los ojos."],
   "en": ["3 new body and head builds per gender besides the classic one: Hero, Athletic and Sturdy; Slender, Curvy and Petite. Pick them under \"Build\" when creating your character or at the stylist.", "The Hero build has the reference eyes: brows in the hair colour, 2×2 eyes with a highlight and a small mouth.", "Clothes, armor, cosmetics, hair and weapons fit every build in all four directions.", "NPCs and human enemies have varied builds.", "Other players see your build over local WiFi and online.", "Fix: sunglasses sat on the forehead; they now cover the eyes."]},
  {"b": 24, "v": "4.3", "d": "2026-11-13",
   "es": ["Actualizador interno: el juego busca versiones nuevas en GitHub, te avisa y se reinicia con el contenido nuevo sin reinstalar el APK.", "Botón «Buscar actualización» en el título y en Ajustes › Actualizaciones.", "Sección de Novedades con los cambios de cada versión; se abre sola la primera vez tras actualizar.", "Si una versión descargada falla al arrancar, el juego vuelve solo a la versión instalada."],
   "en": ["Built-in updater: the game checks GitHub for new versions, lets you know and restarts with the new content without reinstalling the APK.", "\"Check for updates\" button on the title screen and in Settings › Updates.", "What's New section with the changes of every version; it opens by itself the first time after an update.", "If a downloaded version fails to start, the game goes back to the installed version on its own."]},
  {"b": 23, "v": "4.2", "d": "2026-11-12",
   "es": ["Nuevo estilo chibi para todos los personajes y NPCs: cabeza más alta, ojos 2×3 con brillo, boca pequeña y rubor.", "Pelo con más volumen, ondas y mechones claros.", "Cintura marcada en los personajes femeninos."],
   "en": ["New chibi style for every character and NPC: higher head, 2×3 eyes with highlights, small mouth and blush.", "Hair with more volume, waves and light strands.", "Defined waist on female characters."]},
  {"b": 22, "v": "4.1", "d": "2026-11-12",
   "es": ["Detalle HD suavizado: sin cuadrículas blancas en la ropa.", "Tu pareja te atiende en su tienda aunque seas Criminal en ese pueblo."],
   "en": ["Softer HD detail: no more white grids on clothes.", "Your partner serves you in their shop even if you are a Criminal in that town."]},
  {"b": 21, "v": "4.0", "d": "2026-11-12",
   "es": ["Gráficos HD: el juego se dibuja al doble y la ropa, armaduras y NPCs tienen detalle fino (se puede desactivar en Ajustes).", "Cara más alta en todos los personajes.", "Trajes Dama Esmeralda, Danzarina del Ocaso y Rey del Cielo Blanco en las tiendas de cosméticos."],
   "en": ["HD graphics: the game is drawn at double resolution and clothes, armor and NPCs get fine detail (can be turned off in Settings).", "Higher face on every character.", "Emerald Lady, Dusk Dancer and White Sky King outfits in the cosmetics shops."]},
  {"b": 20, "v": "3.9", "d": "2026-11-11",
   "es": ["Mapa con iconos y leyenda de tiendas y servicios, y flechas para ver los 6 mundos.", "Accesorios ajustados a su límite y accesorios de clase del cielo.", "Set cosmético del Heraldo Nocturno.", "Espadas nuevas de las hojas 4 y 5."],
   "en": ["Map with icons and a legend for shops and services, plus arrows to see all 6 worlds.", "Accessories capped to their limit and sky class accessories.", "Night Herald cosmetic set.", "New swords from sheets 4 and 5."]},
  {"b": 0, "v": "3.8", "d": "",
   "es": ["Libro del Vínculo con lore, pistas y rumores; Nihil, el Ente Oscuro.", "Bloqueo y contraataque perfecto, jefes que aprenden, runas del mago, armas malditas y armas que hablan.", "Asedio de la Luna de Sangre, pueblos que crecen con donaciones y festivales con minijuegos.", "Islas del Cielo: nivel 250, aeronave, grifo, alas, tiers 19–21 y evolución de clase."],
   "en": ["Book of the Bond with lore, clues and rumors; Nihil, the Dark Entity.", "Block and perfect counter, bosses that learn, mage runes, cursed weapons and talking weapons.", "Blood Moon siege, towns that grow with donations and festivals with minigames.", "Sky Islands: level 250, airship, griffin, wings, tiers 19–21 and class evolution."]},
  {"b": 0, "v": "3.7", "d": "",
   "es": ["Construcción libre: mesa de trabajo, paredes, suelos, puertas, ventanas, vallas y muebles, sincronizada en multijugador.", "Casa nueva con jardín, cuartos y planta alta.", "3 cuevas de nivel 150–178, maestros de oficio y Crónicas del Vínculo."],
   "en": ["Free building: workbench, walls, floors, doors, windows, fences and furniture, synced in multiplayer.", "New home with a garden, rooms and an upper floor.", "3 caves for levels 150–178, job masters and the Chronicles of the Bond."]},
  {"b": 0, "v": "3.6", "d": "",
   "es": ["Sprites de armas Estelares, Primordiales y Divinas.", "Logo nuevo, interfaz dorada con atardecer y fuente pixel.", "Juego completo en inglés."],
   "en": ["Stellar, Primordial and Divine weapon sprites.", "New logo, golden sunset interface and pixel font.", "Full English translation."]},
  {"b": 0, "v": "3.5", "d": "",
   "es": ["Sprites de armas de tier 7–15, espadas con estilo y legendarias.", "Vista animada del ataque en la enciclopedia."],
   "en": ["Weapon sprites for tiers 7–15, styled swords and legendaries.", "Animated attack preview in the encyclopedia."]},
  {"b": 0, "v": "3.4", "d": "",
   "es": ["Armas de tier 1–6 con sprites propios.", "Llevar a tu pareja en brazos, hijos con vida y mascota en casa."],
   "en": ["Tier 1–6 weapons with their own sprites.", "Carry your partner, kids with HP and a pet at home."]},
  {"b": 0, "v": "3.3", "d": "",
   "es": ["Clase Pez, Aldara, peluquería y Ascensión al nivel 190.", "Inventario de 200, gestos y grupos de 6 con monstruos sincronizados."],
   "en": ["Fish class, Aldara, barber and Ascension at level 190.", "200-slot inventory, emotes and parties of 6 with synced monsters."]},
  {"b": 0, "v": "3.2", "d": "",
   "es": ["Online por internet: salas privadas con código y 5 mundos públicos."],
   "en": ["Internet online: private rooms with a code and 5 public worlds."]}
]/*CL_END*/;

const UPD = { base: UPD_BASE_DEF, latest: null, busy: false, auto: false, newsShown: false, err: '' };
try { const m = /[?&]upd=([^&#]+)/.exec(location.search); if (m) UPD.base = decodeURIComponent(m[1]); } catch (e) { }
if (window.__TB_UPDBASE) UPD.base = window.__TB_UPDBASE;
// APK instalado: dentro de una versión descargada lo indica la página del APK
const APK_BUILD = window.__TB_OTA ? (window.__TB_APK || 0) : GAME_BUILD;
function updEnabled() { return location.protocol === 'file:' || !!window.__TB_OTA || UPD.base !== UPD_BASE_DEF; }
function updMeta() { try { return JSON.parse(localStorage.getItem('thebound.ota') || 'null'); } catch (e) { return null; } }
function updSetMeta(m) { try { if (m) localStorage.setItem('thebound.ota', JSON.stringify(m)); else localStorage.removeItem('thebound.ota'); } catch (e) { } }
function updIdb() {
  return new Promise((ok, no) => { const r = indexedDB.open('thebound-upd', 1); r.onupgradeneeded = () => r.result.createObjectStore('b'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
}
async function updIdbDo(mode, fn) { const db = await updIdb(); return new Promise((ok, no) => { const t = db.transaction('b', mode); const st = t.objectStore('b'); let res; const rq = fn(st); if (rq) rq.onsuccess = () => res = rq.result; t.oncomplete = () => { db.close(); ok(res); }; t.onerror = t.onabort = () => { db.close(); no(t.error); }; }); }
const updIdbGet = k => updIdbDo('readonly', st => st.get(k));
const updIdbPut = (k, v) => updIdbDo('readwrite', st => st.put(v, k));
async function updClear() { const m = updMeta(); updSetMeta(m && m.bad ? { bad: m.bad } : null); try { await updIdbDo('readwrite', st => st.delete('cur')); } catch (e) { } }

// ---- arranque: si hay una versión descargada más nueva que el APK, se ejecuta esa ----
function tbStart(go) {
  if (window.__TB_OTA) { go(); return; }
  const m = updMeta();
  if (!m || !m.b) { go(); return; }
  if (m.b <= GAME_BUILD) { updClear(); go(); return; }            // el APK ya trae esta versión o una más nueva
  if (m.b === m.bad) { go(); return; }
  if ((m.fails || 0) >= 2) { m.bad = m.b; updSetMeta(m); go(); setTimeout(() => updFailNote(m.v), 4000); return; }
  updIdbGet('cur').then(rec => {
    if (!rec || rec.build !== m.b || typeof rec.html !== 'string') { updClear(); go(); return; }
    m.fails = (m.fails || 0) + 1; updSetMeta(m); updMount(rec, m, go);
  }, () => go());
}
function updMount(rec, m, go) {
  const f = document.createElement('iframe'); let ok = false;
  f.id = 'otaFrame'; f.setAttribute('allow', 'autoplay; fullscreen; clipboard-write');
  f.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;margin:0;padding:0;z-index:2147483647;background:#0b0807;display:block';
  const inj = '<script>window.__TB_OTA=' + (rec.build | 0) + ';window.__TB_APK=' + GAME_BUILD + (UPD.base !== UPD_BASE_DEF ? ';window.__TB_UPDBASE=' + JSON.stringify(UPD.base).replace(/</g, '\\u003c') : '') + ';<\/script>';
  f.srcdoc = /<head>/i.test(rec.html) ? rec.html.replace(/<head>/i, '<head>' + inj) : inj + rec.html;
  window.__tbOtaOk = () => { ok = true; const mm = updMeta(); if (mm && mm.b === rec.build) { mm.fails = 0; updSetMeta(mm); } };
  window.onAndroidBack = () => { try { const w = f.contentWindow; if (w && w.onAndroidBack) w.onAndroidBack(); } catch (e) { } };
  const ld = document.getElementById('loading'); if (ld) ld.hidden = true;
  document.body.appendChild(f);
  setTimeout(() => {   // la versión descargada no arrancó: se vuelve a la del APK en esta misma sesión
    if (ok) return; const mm = updMeta() || m; mm.bad = rec.build; mm.fails = 0; updSetMeta(mm);
    f.remove(); window.onAndroidBack = null; if (ld) ld.hidden = false; go(); setTimeout(() => updFailNote(rec.ver), 4000);
  }, 60000);
}
function updFailNote(v) { try { toast(L2(`La versión ${v} descargada no arrancó: se usa la versión instalada.`, `The downloaded version ${v} failed to start: using the installed version.`), 'info'); } catch (e) { } }
function updBootOk() { if (!window.__TB_OTA) return; try { if (window.parent && window.parent !== window && window.parent.__tbOtaOk) window.parent.__tbOtaOk(); } catch (e) { } }

// ---- buscar y descargar ----
function updValid(j) {
  if (!j || typeof j !== 'object') return null;
  const b = j.build | 0, size = +j.size;
  if (!(b > 0) || typeof j.ver !== 'string' || j.ver.length > 12 || !/^[\w.-]{1,64}$/.test(j.file || '') || !(size > 1000 && size < 40e6) || !/^[0-9a-f]{64}$/.test(j.sha256 || '')) return null;
  const notes = a => Array.isArray(a) ? a.filter(s => typeof s === 'string').slice(0, 20).map(s => s.slice(0, 700)) : [];
  const n = j.notes || {};
  return { build: b, ver: j.ver, date: typeof j.date === 'string' ? j.date.slice(0, 10) : '', file: j.file, size, sha256: j.sha256, minApk: j.minApk | 0, apk: typeof j.apk === 'string' && /^https:\/\/github\.com\//.test(j.apk) ? j.apk : UPD_APK_PAGE, es: notes(n.es), en: notes(n.en) };
}
async function updCheck() {
  if (!updEnabled()) throw new Error('noapp');
  const r = await fetch(UPD.base + 'version.json?t=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = updValid(await r.json()); if (!j) throw new Error('bad');
  UPD.latest = j; return j;
}
const updNewer = j => !!(j && j.build > GAME_BUILD);
const updNeedsApk = j => !!(j && j.minApk > APK_BUILD);
async function updDownload(j, prog) {
  const r = await fetch(UPD.base + j.file + '?b=' + j.build, { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  let buf;
  if (r.body && r.body.getReader) {
    const rd = r.body.getReader(), parts = []; let got = 0;
    for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; if (got > j.size) throw new Error('size'); prog(got / j.size); }
    buf = new Uint8Array(got); let o = 0; for (const p of parts) { buf.set(p, o); o += p.length; }
  } else buf = new Uint8Array(await r.arrayBuffer());
  if (buf.length !== j.size) throw new Error('size');
  if (window.crypto && crypto.subtle) {
    const h = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buf)), x => x.toString(16).padStart(2, '0')).join('');
    if (h !== j.sha256) throw new Error('sha');
  }
  const html = new TextDecoder().decode(buf);
  const mb = /GAME_BUILD\s*=\s*(\d+)/.exec(html);
  if (!mb || +mb[1] !== j.build) throw new Error('build');
  await updIdbPut('cur', { build: j.build, ver: j.ver, html });
  const m = updMeta() || {}; updSetMeta({ b: j.build, v: j.ver, fails: 0, bad: m.bad && m.bad !== j.build ? m.bad : 0 });
}
function updRestart() {
  try { if (G.P && !G.P.ghost) saveGame(true); } catch (e) { }
  setTimeout(() => { try { (window.top || window).location.reload(); } catch (e) { location.reload(); } }, 400);
}
function updErrText(e) {
  const m = (e && e.message) || '';
  if (m === 'noapp') return L2('Las actualizaciones automáticas funcionan en la app de Android.', 'Automatic updates work in the Android app.');
  if (m === 'HTTP 404') return L2('No se encontró la información de versiones en GitHub.', 'Version info not found on GitHub.');
  if (m === 'sha' || m === 'size' || m === 'build' || m === 'bad') return L2('La descarga llegó dañada. Inténtalo otra vez.', 'The download arrived damaged. Try again.');
  return L2('No se pudo conectar. Revisa tu internet.', 'Could not connect. Check your internet.');
}
const updFmtMB = n => (n / 1048576).toFixed(1).replace('.', LANG_EN ? '.' : ',') + ' MB';

// ---- interfaz: título, ajustes, aviso y novedades ----
(function () {
  const st = document.createElement('style');
  st.textContent = '#tupd{position:absolute;top:calc(.6em + env(safe-area-inset-top,0px));left:max(.8em,env(safe-area-inset-left,0px));display:flex;flex-direction:column;align-items:flex-start;gap:.35em;z-index:2}'
    + '#tupd .row{display:flex;gap:.4em}#tupd .btn{font-size:.85em}#tUpdMsg{font-size:.8em;color:rgba(241,231,211,.8);text-shadow:0 1px 0 #000;max-width:20em;text-align:left}'
    + '#tUpdMsg.new{color:#ffe08a;cursor:pointer;animation:updGlow 1.4s ease-in-out infinite}@keyframes updGlow{50%{text-shadow:0 0 8px #ffb030,0 1px 0 #000}}'
    + '.modal.updmodal,.modal.newsmodal{z-index:60}.updm,.newsm{max-width:34em;width:100%;text-align:left}.updm h2,.newsm h2{margin:.1em 0 .4em;text-align:center}.newsm .nlist{max-height:min(60vh,26em);overflow:auto;padding-right:.4em}'
    + '.newsm .nv{margin:.5em 0 .2em;color:var(--gold-hi)}.newsm .nv small{color:var(--muted);font-weight:400;margin-left:.5em}.newsm .nv.cur::after{content:"\\25C6";color:#7fd07f;margin-left:.4em;font-size:.8em}'
    + '.updm ul,.newsm ul{margin:.2em 0 .4em;padding-left:1.2em}.updm li,.newsm li{margin:.15em 0}.updm .row,.newsm .row{display:flex;gap:.5em;justify-content:center;flex-wrap:wrap;margin-top:.6em}'
    + '.updbar{height:.7em;border:2px solid var(--gold);border-radius:.4em;background:#140c08;overflow:hidden;margin:.5em 0}.updbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#d9a030,#ffe08a)}'
    + '.updlink{display:block;font-size:.8em;overflow-wrap:anywhere;user-select:all;-webkit-user-select:all;background:#140c08;padding:.3em .5em;border-radius:.3em;margin:.3em 0}';
  document.head.appendChild(st);
})();
function updNotes(e) { return (LANG_EN ? e.en : e.es) || e.es || []; }
function openNews() {
  const L = UPD.latest, li = a => `<ul>${a.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
  let html = '';
  if (updNewer(L)) html += `<h3 class="nv">${L2('Disponible', 'Available')}: ${esc(L.ver)}<small>${esc(L.date)}</small></h3>${li(updNotes(L))}`;
  for (const e of CHANGELOG) html += `<h3 class="nv ${e.v === GAME_VER ? 'cur' : ''}">${esc(e.v)}${e.v === GAME_VER ? ' · ' + L2('instalada', 'installed') : ''}<small>${esc(e.d)}</small></h3>${li(updNotes(e))}`;
  openModal(`<div class="newsm"><h2>${L2('Novedades', "What's New")}</h2><div class="nlist">${html}</div><div class="row">${updNewer(L) ? `<button class="btn gold" id="nwUpd">${L2('Actualizar a la', 'Update to')} ${esc(L.ver)}</button>` : ''}<button class="btn" id="nwOk">${L2('Cerrar', 'Close')}</button></div></div>`, 'newsmodal');
  $('#nwOk').onclick = () => closeModal();
  const u = $('#nwUpd'); if (u) u.onclick = () => openUpdate(L);
}
function openUpdate(j) {
  if (!j) return;
  if (updNeedsApk(j)) {
    openModal(`<div class="updm"><h2>${L2('Nueva versión', 'New version')} ${esc(j.ver)}</h2><p>${L2('Esta versión necesita instalar el APK nuevo (cambió la parte de Android). Descárgalo desde el navegador e instálalo encima: tu partida se conserva porque usa la misma firma.', 'This version needs the new APK (the Android part changed). Download it in your browser and install it over the old one: your save is kept because it uses the same signature.')}</p><span class="updlink">${esc(j.apk)}</span><p class="hint" id="updMsg"></p><div class="row"><button class="btn gold" id="updCopy">${L2('Copiar enlace', 'Copy link')}</button><button class="btn" id="updLater">${L2('Cerrar', 'Close')}</button></div></div>`, 'updmodal');
    $('#updLater').onclick = () => closeModal();
    $('#updCopy').onclick = () => { try { navigator.clipboard.writeText(j.apk).then(() => $('#updMsg').textContent = L2('Enlace copiado.', 'Link copied.'), () => $('#updMsg').textContent = L2('Mantén pulsado el enlace para copiarlo.', 'Long-press the link to copy it.')); } catch (e) { $('#updMsg').textContent = L2('Mantén pulsado el enlace para copiarlo.', 'Long-press the link to copy it.'); } };
    return;
  }
  openModal(`<div class="updm"><h2>¡${L2('Nueva versión', 'New version')} ${esc(j.ver)}!</h2><p class="hint" style="text-align:center">${L2('Tienes la', 'You have')} ${esc(GAME_VER)} · ${L2('Descarga', 'Download')}: ${updFmtMB(j.size)}</p><ul>${updNotes(j).map(s => `<li>${esc(s)}</li>`).join('')}</ul><div class="updbar" id="updBar" hidden><i></i></div><p class="hint" id="updMsg">${L2('Tu partida se guarda antes de reiniciar.', 'Your game is saved before restarting.')}</p><div class="row"><button class="btn gold" id="updGo">${L2('Actualizar ahora', 'Update now')}</button><button class="btn" id="updLater">${L2('Más tarde', 'Later')}</button></div></div>`, 'updmodal');
  $('#updLater').onclick = () => { if (!UPD.busy) closeModal(); };
  $('#updGo').onclick = async () => {
    if (UPD.busy) return; UPD.busy = true; $('#updGo').disabled = true; $('#updLater').disabled = true;
    const bar = $('#updBar'); bar.hidden = false; const msg = $('#updMsg'); msg.textContent = L2('Descargando…', 'Downloading…');
    try {
      await updDownload(j, p => { bar.firstChild.style.width = Math.round(Math.min(1, p) * 100) + '%'; });
      bar.firstChild.style.width = '100%'; msg.textContent = L2('¡Listo! Reiniciando con la versión nueva…', 'Done! Restarting with the new version…');
      try { localStorage.setItem('thebound.seen', String(GAME_BUILD)); } catch (e) { }
      updRestart();
    } catch (e) { UPD.busy = false; msg.textContent = updErrText(e); $('#updGo').disabled = false; $('#updLater').disabled = false; $('#updGo').textContent = L2('Reintentar', 'Retry'); }
  };
}
function updTitleMsg(t, isNew) { const el = $('#tUpdMsg'); if (!el) return; el.textContent = t; el.classList.toggle('new', !!isNew); el.onclick = isNew ? () => openUpdate(UPD.latest) : null; }
async function updRun(manual, quiet) {
  if (UPD.busy) return; const out = s => { if (!quiet) updTitleMsg(s); const o = $('#oUpdMsg'); if (o) o.textContent = s; };
  if (manual) out(L2('Buscando…', 'Checking…'));
  try {
    const j = await updCheck();
    if (updNewer(j)) {
      const t = L2(`¡Nueva versión ${j.ver} disponible! Toca para actualizar.`, `New version ${j.ver} available! Tap to update.`);
      updTitleMsg(t, true); const o = $('#oUpdMsg'); if (o) o.textContent = t;
      if (manual || (titleMode && $('#modal').hidden)) openUpdate(j);
      else if (!titleMode) toast(L2(`Nueva versión ${j.ver} disponible: Ajustes › Actualizaciones`, `New version ${j.ver} available: Settings › Updates`), 'info');
    } else out(L2('Tienes la última versión', 'You have the latest version') + ` (${GAME_VER}).`);
  } catch (e) { if (manual) out(updErrText(e)); else if (!quiet) updTitleMsg(''); }
}
function updTitleUi() {
  const T = $('#title'); if (!T || $('#tupd')) return;
  T.insertAdjacentHTML('beforeend', `<div id="tupd"><div class="row"><button class="btn sm" id="tNews">${L2('Novedades', "What's New")}</button>${updEnabled() ? `<button class="btn sm" id="tChk">${L2('Buscar actualización', 'Check for updates')}</button>` : ''}</div><small id="tUpdMsg"></small></div>`);
  $('#tNews').onclick = () => { audioUnlock(); openNews(); };
  const c = $('#tChk'); if (c) c.onclick = () => { audioUnlock(); updRun(true); };
}
function updHasSaves() { try { for (let i = 0; i < NSLOTS; i++) if (loadLocal(i)) return true; } catch (e) { } return false; }
{ const _st = showTitle; showTitle = function (...a) {
  const r = _st(...a); updBootOk(); updTitleUi();
  if (!UPD.newsShown) { UPD.newsShown = true; let seen = 0; try { seen = +localStorage.getItem('thebound.seen') || 0; } catch (e) { }
    if (seen < GAME_BUILD) { try { localStorage.setItem('thebound.seen', String(GAME_BUILD)); } catch (e) { } if (seen > 0 || updHasSaves()) setTimeout(() => { if (titleMode && $('#modal').hidden) openNews(); }, 600); } }
  if (!UPD.auto && updEnabled()) { UPD.auto = true; setTimeout(() => updRun(false), 2500); setInterval(() => { if (!UPD.busy && !updNewer(UPD.latest)) updRun(false, true); }, 30 * 60000); }
  return r; }; }
{ const _sg = startGame; startGame = function (...a) { updBootOk(); return _sg(...a); }; }
{ const _ro = renderOpts; renderOpts = function (B) { _ro(B);
  const h = [...B.querySelectorAll('h3')].find(x => /En línea|Online/.test(x.textContent)); if (!h || $('#oUpd')) return;
  const L = UPD.latest, nw = updNewer(L);
  h.insertAdjacentHTML('beforebegin', `<h3 id="oUpd">${L2('Actualizaciones', 'Updates')}</h3><p class="hint">${L2('Versión', 'Version')} ${esc(GAME_VER)}${window.__TB_OTA ? ' · ' + L2('descargada', 'downloaded') + ` (APK ${APK_BUILD})` : ''}</p><div class="row">${updEnabled() ? `<button class="btn ${nw ? 'gold' : ''}" id="oChk">${nw ? L2('Actualizar a la', 'Update to') + ' ' + esc(L.ver) : L2('Buscar actualización', 'Check for updates')}</button>` : ''}<button class="btn" id="oNews">${L2('Novedades', "What's New")}</button>${window.__TB_OTA ? `<button class="btn" id="oRb">${L2('Volver a la versión del APK', 'Back to the APK version')}</button>` : ''}</div><p class="hint" id="oUpdMsg">${updEnabled() ? '' : L2('Las actualizaciones automáticas funcionan en la app de Android.', 'Automatic updates work in the Android app.')}</p>`);
  $('#oNews').onclick = () => openNews();
  const c = $('#oChk'); if (c) c.onclick = () => nw ? openUpdate(L) : updRun(true, true);
  const rb = $('#oRb'); if (rb) { let k = 0; rb.onclick = async () => { if (!k++) { rb.textContent = L2('Toca otra vez para confirmar', 'Tap again to confirm'); return; } const m = updMeta(); await updClear(); updSetMeta({ bad: m && m.b }); updRestart(); }; }
}; }
