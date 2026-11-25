// ================= v4.3: ACTUALIZADOR INTERNO Y NOVEDADES =================
// El juego busca en GitHub (update/version.json) si hay una versión nueva. Si la hay, avisa, descarga el juego nuevo
// (update/thebound.html), lo guarda en el teléfono (IndexedDB) y se reinicia con él. El APK instalado no cambia, así que
// la firma sigue siendo la misma y la partida (localStorage) es compartida: la versión descargada corre en un iframe
// srcdoc, que tiene el mismo origen que la página del APK.
// Seguridad: se comprueban tamaño, SHA-256 y número de versión. Si la versión descargada no llega al título dos veces
// seguidas (o en 60 s), se marca como mala y se vuelve a la versión del APK.
// Publicar una versión nueva: subir GAME_VER/GAME_BUILD, añadir su entrada al principio de CHANGELOG y ejecutar
// python3 tools/dev/release.py (escribe update/thebound.html y update/version.json). Luego subirlo a la rama main.
const GAME_VER = '6.14', GAME_BUILD = 235;
const UPD_MIN_APK = 24;   // primer APK con actualizador; súbelo solo si cambia la parte Android (tools/apk)
const UPD_REPO = 'ventisca-gif/the-bound';
const UPD_BASE_DEF = 'https://raw.githubusercontent.com/' + UPD_REPO + '/main/update/';
const UPD_APK_PAGE = 'https://github.com/' + UPD_REPO + '/releases/latest';
// Novedades: la más nueva primero. JSON estricto entre las marcas (tools/dev/release.py lo lee).
const CHANGELOG = /*CL*/
[
{
 "v": "6.14",
 "b": 235,
 "d": "2026-11-25",
 "es": [
  "Más fluido en celulares de gama baja y media: el juego ya no prepara en segundo plano los 2.300 dibujos de personajes y enemigos mientras juegas (frenaba cada imagen durante minutos al entrar). Los personajes fuera de pantalla gastan mucho menos.",
  "Modo optimizado (Ajustes): además, menos multitud de fondo en las ciudades y la interfaz se refresca 15 veces por segundo.",
  "Robo de vida (Sed de Sangre, armas de guerrero, vampiro…): cura como mucho un 5 % de tu vida por golpe y un 12 % por segundo. Antes, Juicio Final con Sed de Sangre llenaba toda la vida de una vez.",
  "Inventario de 900 casillas (antes 200).",
  "Familia: como mucho 30 familiares vivos; si llegas, no nacen más nietos hasta que haya hueco."
 ],
 "en": [
  "Smoother on low- and mid-range phones: the game no longer pre-builds the 2,300 character and enemy sprites in the background while you play (it slowed every frame for minutes after starting). Off-screen characters cost much less.",
  "Optimized mode (Settings): also fewer background crowds in towns and the interface refreshes 15 times per second.",
  "Life steal (Bloodthirst, warrior weapons, vampire…): heals at most 5% of your HP per hit and 12% per second. Before, Final Judgement with Bloodthirst refilled all your HP at once.",
  "900-slot inventory (was 200).",
  "Family: at most 30 living relatives; once you reach it, no more grandchildren are born until there is room."
 ]
},
{
 "v": "6.13",
 "b": 234,
 "d": "2026-11-25",
 "es": [
  "La enciclopedia se abre al instante (antes 2 segundos) y tocar un enemigo ya no la congela. Los retratos se dibujan poco a poco sin parar la ventana.",
  "Los mapas grandes cargan mucho más rápido: Japón, México, Lima y Trujillo unas 4 veces más rápido; España y Dawn, el doble.",
  "Enciclopedia: pestañas por nivel (1-99 hasta 600+) y del Mar de Dawn, con Alvida, Buggy, Kuro, Baratie, Shanks y Arlong. Ahora todos los enemigos salen en alguna pestaña, no solo en «Todos».",
  "Inglés: descripciones de todas las habilidades, ventajas de los oficios, recuerdos y trofeos de oficio y la ayuda de Misiones."
 ],
 "en": [
  "The encyclopedia opens instantly (it took 2 seconds) and tapping an enemy no longer freezes it. Portraits are drawn bit by bit without stalling the window.",
  "Big maps load much faster: Japan, Mexico, Lima and Trujillo about 4 times faster; Spain and Dawn, twice as fast.",
  "Encyclopedia: level tabs (1-99 up to 600+) and a Dawn Sea tab with Alvida, Buggy, Kuro, Baratie, Shanks and Arlong. Every enemy now shows up in some tab, not only in \"All\".",
  "English: descriptions of every skill, job perks, job keepsakes and trophies, and the Quests help."
 ]
},
{
 "v": "6.12",
 "b": 233,
 "d": "2026-11-25",
 "es": [
  "Mejoras por dentro para que el juego pueda seguir creciendo (más niveles y más crossovers) sin romperse: lo nuevo ya no se apila encima de lo anterior.",
  "Revisión completa: más de 200 actividades y minijuegos probados en su sitio, partidas de versiones antiguas, 10 minutos de juego seguido y toda la Lupa, sin errores."
 ],
 "en": [
  "Under-the-hood improvements so the game can keep growing (more levels and more crossovers) without breaking: new content no longer stacks on top of the old.",
  "Full review: over 200 activities and minigames tested in place, saves from old versions, 10 minutes of continuous play and the whole Magnifier, with no errors."
 ]
},
{
 "v": "6.11",
 "b": 232,
 "d": "2026-11-25",
 "es": [
  "Árboles, vetas (rocas con mineral), hierbas, puntos de buceo y montículos reaparecen a los 5 segundos en todo el mundo.",
  "Las herramientas piden menos nivel de personaje: un 25 % menos desde la potencia 5, y las de Dawn 500 (Coralita), 520 (Nacarita) y 540 (Piedra del Mar).",
  "Avisos claros: si te falta nivel de oficio por encima de tu tope, te dice qué maestro te entrena y dónde; si te falta herramienta, cuál es y qué nivel de personaje pide. Al llegar al tope te avisa y pone la flecha al maestro.",
  "Lupa › Oficios: «Siguiente paso» con tu tope real, el tier al que llegas, la herramienta que te falta y la maestría."
 ],
 "en": [
  "Trees, ore veins, herbs, dive spots and dig mounds respawn after 5 seconds everywhere.",
  "Tools need a lower character level: 25% less from power 5, and the Dawn ones 500 (Coralite), 520 (Nacrite) and 540 (Seastone).",
  "Clear warnings: if you need a job level above your cap, it tells you which master trains you and where; if you need a tool, which one and its character level. When you reach the cap it warns you and points the arrow at the master.",
  "Magnifier › Jobs: \"Next step\" with your real cap, the tier you reach, the tool you are missing and the mastery."
 ]
},
{
 "v": "6.10",
 "b": 231,
 "d": "2026-11-25",
 "es": [
  "Peces del Mar de Dawn: se pesca en cualquier orilla de Dawn. Salen los peces de mar de siempre y seis nuevos: Pez Coralino y Barracuda del Este (caña de Coralita), Pez de Nácar y Pez Espada Rayado (caña de Nacarita), Anguila de Piedra del Mar y Cría de Rey del Mar (caña de Piedra del Mar).",
  "Lupa › Crossovers › Minerales, maderas y dónde talar: ahora también dice dónde y con qué se pesca."
 ],
 "en": [
  "Dawn Sea fish: you can fish from any Dawn shore. You get the usual sea fish and six new ones: Coral Fish and East Barracuda (Coralite rod), Nacre Fish and Striped Swordfish (Nacrite rod), Seastone Eel and Sea King Hatchling (Seastone rod).",
  "Magnifier › Crossovers › Ores, woods and where to chop: now also says where and with what to fish."
 ]
},
{
 "v": "6.09",
 "b": 230,
 "d": "2026-11-25",
 "es": [
  "Lupa › 🏴‍☠️ Crossovers (antes Mar de Dawn) y nueva sección Crossovers en Sistemas: todos los arcos en orden con cada jefe, Baratie y Arlong Park incluidos, y la flecha te lleva al siguiente paso.",
  "Lista completa de armaduras de nivel 600 a 700 con sus materiales, y dónde minar y talar cada mineral y madera de Dawn.",
  "Tala, Minería y Pesca llegan a nivel 130 (160 con Gran Maestro): ya se pueden recoger la Piedra del Mar y el Árbol Rey."
 ],
 "en": [
  "Magnifier › 🏴‍☠️ Crossovers (was Dawn Sea) and a new Crossovers section in Systems: every arc in order with each boss, Baratie and Arlong Park included, and the arrow takes you to the next step.",
  "Full list of level 600-700 armours with their materials, and where to mine and chop each Dawn ore and wood.",
  "Woodcutting, Mining and Fishing reach level 130 (160 as Grand Master): Seastone and King Tree can now be gathered."
 ]
},
{
 "v": "6.08",
 "b": 229,
 "d": "2026-11-25",
 "es": [
  "Las armas superadas pierden como mucho un 10 % de daño (antes 55 %), en todas las armas de nivel 1 a 700."
 ],
 "en": [
  "Outgrown weapons lose at most 10% damage (was 55%), for every weapon from level 1 to 700."
 ]
},
{
 "v": "6.07",
 "b": 228,
 "d": "2026-11-24",
 "es": [
  "Islas Conomi después de Baratie. Explora Cocoyashi y Arlong Park y enfréntate a Arlong de nivel 605.",
  "El hachazo de Luffy atraviesa cuatro pisos. Tras la victoria quedan las ruinas y se abren nuevos diálogos con la tripulación.",
  "Puedes repetir los arcos del Mar de Dawn."
 ],
 "en": [
  "Conomi Islands after Baratie. Explore Cocoyashi and Arlong Park and fight level 605 Arlong.",
  "Luffy’s axe kick breaks through four floors. After the victory, revisit the ruins and talk to the crew for new dialogue.",
  "Replay the Dawn Sea story arcs."
 ]
},
{
 "v": "6.06",
 "b": 227,
 "d": "2026-11-24",
 "es": [
  "Cinco técnicas para Luffy, Zoro, Usopp y Sanji. Habla con ellos para elegir una técnica prioritaria.",
  "El Going Merry tiene una cubierta más ancha y caminable. Nami puede mantener el rumbo mientras paseas.",
  "Nuevas poses de ataque y diálogos. Usopp conserva la ropa de Villa Syrup."
 ],
 "en": [
  "Five techniques each for Luffy, Zoro, Usopp and Sanji. Talk to them to select a preferred technique.",
  "The Going Merry has a wider walkable deck. Nami can hold course while you explore.",
  "New attack poses and dialogue. Usopp retains his Syrup Village outfit."
 ]
},
{
 "v": "6.05",
 "b": 226,
 "d": "2026-11-24",
 "es": [
  "Pearl, Gin y Don Krieg sueltan 13 piezas para el Armario y cuatro armas de nivel 600–605 para todas las clases.",
  "Cada pieza y arma tiene su propia garantía a las 10 victorias contra su jefe. Habla con Zeff para repetir los combates tras reclutar a Sanji."
 ],
 "en": [
  "Pearl, Gin and Don Krieg drop 13 Wardrobe pieces and four level 600–605 weapons for all classes.",
  "Each piece and weapon has its own guarantee after 10 wins against its boss. Talk to Zeff for rematches after recruiting Sanji."
 ]
},
{
 "v": "6.04",
 "b": 225,
 "d": "2026-11-24",
 "es": [
  "Nuevo restaurante marítimo Baratie después de Villa Syrup. Defiende la cubierta contra Pearl (590), Gin (592) y Don Krieg (595), y recluta a Sanji.",
  "Duelo de 40 segundos entre Zoro y Mihawk. Mihawk tiene un sprite de proporciones adultas, caminata en cuatro direcciones y ataques con cuchillo y espada."
 ],
 "en": [
  "The Baratie floating restaurant opens after Syrup Village. Defend the deck against Pearl (590), Gin (592) and Don Krieg (595), then recruit Sanji.",
  "Zoro and Mihawk’s 40-second duel. Mihawk has an adult-proportioned sprite, four-direction movement and dagger and sword attacks."
 ]
},
{
 "v": "6.03",
 "b": 224,
 "d": "2026-11-24",
 "es": [
  "Los 12 enemigos y los 5 jefes de los portales 400-600 de la Torre ya usan los dibujos nuevos del bestiario: en las 4 direcciones, andando y atacando.",
  "Lupa › Sistemas: guía de los materiales y armaduras nuevas del nivel 700."
 ],
 "en": [
  "The 12 enemies and 5 bosses of the Tower’s 400-600 portals now use the new bestiary drawings: in 4 directions, walking and attacking.",
  "Magnifier › Systems: guide to the new level-700 materials and armours."
 ]
},
{
 "v": "6.02",
 "b": 223,
 "d": "2026-11-24",
 "es": [
  "Armadura de Clase de los Mares (nivel 700, la más fuerte): cada clase con su diseño — Vicealmirante del Mar Blanco, Navegante de Tormentas, Francotirador de Ultramar, Agente de la Sombra Blanca, Caballero del Barco Fantasma, Doctora del Invierno y Maestro del Karate Marino.",
  "5 combinaciones de las armaduras de los mares (nivel 630-690): Pirata del Desierto, Emperatriz del Kimono, Capitán del Futuro, Bailarina del Rey del Mar y Serpiente del Futuro. Se forjan con la mitad de los materiales de los dos conjuntos que mezclan."
 ],
 "en": [
  "Sea Class armour (level 700, the strongest): each class with its own design — White Sea Vice Admiral, Storm Navigator, Overseas Sharpshooter, White Shadow Agent, Ghost Ship Gentleman, Winter Doctor and Sea Karate Master.",
  "5 sea armour combinations (level 630-690): Desert Pirate, Kimono Empress, Future Captain, Sea King’s Dancer and Future Serpent. Forged with half the materials of the two sets they mix."
 ]
},
{
 "v": "6.01",
 "b": 222,
 "d": "2026-11-24",
 "es": [
  "Nivel máximo 700.",
  "Minerales y maderas nuevos en las islas del Mar de Dawn que reaparecen a los 5 segundos: Coralita y Palma de Coral, Nacarita y Árbol Frutal Raro, Piedra del Mar y Árbol Rey. Con sus picos, hachas y cañas (620-680).",
  "5 armaduras de los mares para cualquier clase, en la Herrería con materiales de Dawn: Bailarina del Desierto (620), Emperatriz Serpiente (640), Capitán del Abrigo Negro (660), Kimono del Rey del Mar (680) y Traje del Futuro (700).",
  "Ranking mundial: acepta niveles hasta 700 (antes el servidor rechazaba más de 500)."
 ],
 "en": [
  "Level cap 700.",
  "New ores and woods on the Dawn Sea islands that respawn after 5 seconds: Coralite and Coral Palm, Nacrite and Rare Fruit Tree, Seastone and King Tree. With their pickaxes, axes and rods (620-680).",
  "5 sea armours for any class, at the Forge with Dawn materials: Desert Dancer (620), Serpent Empress (640), Black-Coat Captain (660), Sea King’s Kimono (680) and Future Suit (700).",
  "World ranking: accepts levels up to 700 (the server used to reject anything above 500)."
 ]
},
{
 "v": "6.00",
 "b": 221,
 "d": "2026-11-24",
 "es": [
  "Cazadores de élite: van con su forma normal y se transforman en batalla (en las mazmorras cuando hay enemigos cerca, +15 % de ataque; en los duelos al bajar del 60 % de vida).",
  "Valeria, Taro y Dorian llevaban formas que aún no se pueden conseguir (Despertar Dorado y Tejedor Primordial, sin estadísticas): ahora usan Mitad Dragón, Alado Caído y Eco sin Pintar."
 ],
 "en": [
  "Elite hunters: they walk in their normal look and transform in battle (in dungeons when enemies are near, +15% attack; in duels below 60% HP).",
  "Valeria, Taro and Dorian had forms that cannot be obtained yet (Golden Awakening and Primordial Weaver, no stats): they now use Half-Dragon, Fallen Winged and Unpainted Echo."
 ]
},
{
 "v": "5.99",
 "b": 220,
 "d": "2026-11-24",
 "es": [
  "Torre de los Portales: 5 portales nuevos de nivel alto con más enemigos — Fortaleza de Obsidiana (400), Jardín de Cristal Negro (450), Ciudad Hundida del Portal (500), Forja del Dios Caído (550) y Trono del Último Portal (600), con 12 enemigos y 5 jefes nuevos.",
  "Las mazmorras ya no son todas la misma cueva: fortaleza de salas, anillo con cámara central, gran salón de columnas, catedral con capillas y sala del trono.",
  "Los cazadores suben de nivel hasta el máximo: peleando contigo, al cerrar portales y entrenando solos cada día.",
  "14 cazadores de élite (nivel 400-600) con armaduras de los tiers altos y transformaciones te esperan en la Antesala."
 ],
 "en": [
  "Portal Tower: 5 new high-level portals with more enemies — Obsidian Fortress (400), Black Crystal Garden (450), Sunken Portal City (500), Fallen God’s Forge (550) and Throne of the Last Portal (600), with 12 new enemies and 5 new bosses.",
  "Dungeons are no longer all the same cave: hall fortress, ring with a central chamber, pillared great hall, cathedral with chapels and throne room.",
  "Hunters level up to the cap: fighting with you, closing portals and training on their own every day.",
  "14 elite hunters (level 400-600) with high-tier armour and transformations wait in the Antechamber."
 ]
},
{
 "v": "5.98",
 "b": 219,
 "d": "2026-11-24",
 "es": [
  "Minijuegos: en todos los que se juegan con ⚔, mantenerlo pulsado ya no cuenta como muchos toques (igual que se arregló la pesca en el hielo).",
  "Kuro suelta su botín: Garras del Gato (arma para todas las clases a nivel 580: dos zarpazos por golpe y cada cuarto golpe «Paso sin sonido», un tajo en línea sin recibir daño), sus gafas redondas y su frac, pantalón y zapatos. Revancha: habla con Kaya al terminar la historia.",
  "Villa Syrup: todos sus personajes hablan del arco según el momento de la historia (antes, durante y después del ataque).",
  "Merry vende la ropa de toda la isla por piezas como cosméticos: Dama de la Mansión, Hipnotista del Péndulo, Mayordomo Carnero, Gato Ligero, Gato Pesado y Piratas Pequeños (y el conjunto de Kuro cuando ya lo venciste). Gafas de corazón del hipnotista en Armario › 👓 Cara."
 ],
 "en": [
  "Minigames: in every one played with ⚔, holding it no longer counts as many taps (like the ice fishing fix).",
  "Kuro drops his loot: Cat Claws (all-class weapon at level 580: two swipes per attack and every fourth attack “Silent Step”, a line slash while untouchable), his round glasses and his tailcoat, trousers and shoes. Rematch: talk to Kaya after the story.",
  "Syrup Village: every character talks about the arc depending on the story moment (before, during and after the attack).",
  "Merry sells the whole island’s clothes piece by piece as cosmetics: Lady of the Manor, Pendulum Hypnotist, Ram Steward, Nimble Cat, Heavy Cat and Little Pirates (and Kuro’s set once you have beaten him). Hypnotist’s heart glasses in Wardrobe › 👓 Face."
 ]
},
{
 "v": "5.97",
 "b": 218,
 "d": "2026-11-24",
 "es": [
  "Arreglo: en la pesca en el hielo, mantener pulsado ⚔ retrasaba al pez para siempre («esperando…») y no se podía salir. Ahora cuenta un solo toque, el pez pica más tiempo con aviso y vibración, y moviendo el joystick dejas de pescar.",
  "Arreglo: Zoltan el Errante se duplicaba cada 2 segundos durante el evento del mercader ambulante.",
  "Goma + Engranaje 2: si tienes la fruta de goma y usas Engranaje 2, +12 % de crítico y +30 % de daño crítico.",
  "Bara Bara: 4 técnicas nuevas (Cañón, Festival, Pies Saltarines y Cuchillas Voladoras): te partes en pedazos y tus pedazos atacan.",
  "Fruta Transparente: 2 técnicas nuevas (Golpe Fantasma y Velo Espejo), 3 en total.",
  "Destino de tu familia: cada hijo, nieto o bisnieto tiene el suyo. Unos nunca llegan al 500, otros aceptan su destino, otros encuentran la cura de la vejez (viven hasta 300 años) y otros te acompañan hasta el 500. Ninguno pasa del 500, y desde el 300 solo suben peleando contigo.",
  "En el Mar de Dawn no puedes llamar a tu familia: te espera en casa."
 ],
 "en": [
  "Fix: in ice fishing, holding ⚔ delayed the fish forever (“waiting…”) and you could not leave. Now it counts as one tap, the fish bites for longer with a notice and vibration, and moving the joystick ends fishing.",
  "Fix: Zoltan the Wanderer duplicated every 2 seconds during the travelling merchant event.",
  "Rubber + Gear 2: with the rubber fruit and Gear 2 active, +12% crit and +30% crit damage.",
  "Chop-Chop: 4 new techniques (Cannon, Festival, Hopping Feet and Flying Blades): you split into pieces and your pieces attack.",
  "Clear Fruit: 2 new techniques (Phantom Strike and Mirror Veil), 3 in total.",
  "Your family’s fate: every child, grandchild or great-grandchild has their own. Some never reach 500, some accept their fate, some find the cure for old age (living up to 300 years) and some follow you to 500. None go past 500, and from 300 they only level up fighting with you.",
  "You cannot call your family in the Dawn Sea: they wait at home."
 ]
},
{
 "v": "5.96",
 "b": 217,
 "d": "2026-11-24",
 "es": [
  "Tripulación: si Luffy, Zoro, Nami o Usopp caen en una pelea de la historia, se levantan a los 15 s con un tercio de su vida.",
  "Recompensas de la tripulación: Luffy, Zoro, Nami y Usopp tienen su cartel de «se busca». Sube al vencer juntos a los jefes de la historia (más quien lleva la pelea) y con cada enemigo de Dawn si van contigo. Míralos en Habilidades › Voluntad o en tu cartel › 🏴‍☠️ Tripulación.",
  "Lupa › 🏴‍☠️ Mar de Dawn: la ruta de la historia paso a paso con ✅ y flecha, la tripulación, las frutas y todo el crossover.",
  "Arreglo: en Atajos, tocar las pestañas ⚔ 🌐 🔍 cerraba el panel y parecía que desaparecían los botones."
 ],
 "en": [
  "Crew: if Luffy, Zoro, Nami or Usopp fall in a story fight, they get back up after 15 s with a third of their HP.",
  "Crew bounties: Luffy, Zoro, Nami and Usopp have their own wanted posters. They rise when you beat the story bosses together (more for whoever leads the fight) and with every Dawn enemy while they sail with you. See them in Skills › Will or in your poster › 🏴‍☠️ Crew.",
  "Magnifier › 🏴‍☠️ Dawn Sea: the story route step by step with ✅ and an arrow, the crew, the fruits and the whole crossover.",
  "Fix: in Shortcuts, tapping the ⚔ 🌐 🔍 tabs closed the panel, so the buttons seemed to vanish."
 ]
},
{
 "v": "5.95",
 "b": 216,
 "d": "2026-11-24",
 "es": [
  "Nueva pestaña 🍇 Frutas en el menú: todas las Frutas del Diablo del juego (Goma, Transparente, Bara Bara, Mera Mera y Hana Hana) con su icono, su poder, sus técnicas, dónde aparecen, su probabilidad y cuántas victorias te faltan como mucho. Con «Marcar en el mapa» te lleva hasta ellas.",
  "Arreglo: cuando una fruta del Mar de Dawn desaparecía a los 4 minutos, la flecha seguía apuntando a ese sitio."
 ],
 "en": [
  "New 🍇 Fruits tab in the menu: every Devil Fruit in the game (Rubber, Clear, Chop-Chop, Flame-Flame and Flower-Flower) with its icon, power, techniques, where it appears, its chance and how many wins you need at most. “Mark on the map” guides you there.",
  "Fix: when a Dawn Sea fruit vanished after 4 minutes, the arrow kept pointing at that spot."
 ]
},
{
 "v": "5.94",
 "b": 215,
 "d": "2026-11-24",
 "es": [
  "El inventario bloquea comer una segunda Fruta del Diablo mientras tienes un poder. La fruta permanece en tu bolsa. Shanks puede retirar el poder en Foosha.",
  "Mera Mera y Hana Hana tienen sprites animados propios en sus nueve técnicas. El fuego, la Logia, los brazos y los pétalos se dibujan con fotogramas pixel art en el motor."
 ],
 "en": [
  "The bag blocks eating a second Devil Fruit while you have a power. The fruit stays in your bag. Shanks can remove your power in Foosha.",
  "Flame-Flame and Flower-Flower have custom animated sprites across all nine techniques. Fire, Logia, arms and petals use pixel art frames in the game engine."
 ]
},
{
 "v": "5.93",
 "b": 214,
 "d": "2026-11-24",
 "es": [
  "Mera Mera de Ace: Puño de Fuego, Pistolas de Fuego, Pilar de Fuego, Gran Entei y Cuerpo de Fuego. La Logia dura 6 segundos y evita hasta 3 golpes físicos de monstruos comunes.",
  "Hana Hana de Robin: Clutch, Seis Fleur, Ochenta Fleur y Cien Fleur. Usa brazos a distancia, control de grupos y una barrera temporal. Las dos frutas usan la sección Habilidades › Fruta y progresan con el nivel.",
  "Aparecen ocasionalmente en el Mar de Dawn. El aviso indica la isla y deja un marcador durante 4 minutos. Shanks retira Hana Hana con Voluntad 1 y Mera Mera con Voluntad 2, o cualquiera si ganaste su duelo."
 ],
 "en": [
  "Ace’s Flame-Flame Fruit: Fire Fist, Fire Gun, Flame Pillar, Great Flame Emperor and Flame Body. Logia lasts 6 seconds and disperses up to 3 physical hits from ordinary monsters.",
  "Robin’s Flower-Flower Fruit: Clutch, Seis Fleur, Ochenta Fleur and Cien Fleur. Use arms at a distance, crowd control and a temporary barrier. Both fruits use Skills › Fruit and scale with your level.",
  "They occasionally appear in the Dawn Sea. The alert names the island and marks the spot for 4 minutes. Shanks removes Flower-Flower at Will rank 1 and Flame-Flame at Will rank 2, or either after you win his duel."
 ]
},
{
 "v": "5.92",
 "b": 213,
 "d": "2026-11-24",
 "es": [
  "Villa Syrup se conecta al sur del Mar de Dawn. Tras terminar la historia de Gaimon, desembarca, habla con Usopp y avisa a Kaya en su mansión.",
  "Zoro te ayuda contra Sham y Buchi (nivel 572). Enfrenta a Jango (572) con Nami y Usopp, y a Kuro (580) con Luffy.",
  "Recluta a Usopp como tirador de nivel 580. Nuevos sprites proporcionados a la referencia, con caminata y tirachinas en cuatro direcciones. Alterna proyectiles normales con la Estrella de Pólvora.",
  "Habla con Luffy, Zoro, Nami y Usopp en tierra y en el Going Merry. Hay temas nuevos sobre su pasado, la navegación, el combate y lo que pasó en Villa Syrup."
 ],
 "en": [
  "Syrup Village joins the southern Dawn Sea. Finish Gaimon’s story, go ashore, talk to Usopp and warn Kaya at her manor.",
  "Zoro helps you fight Sham and Buchi (level 572). Face Jango (572) with Nami and Usopp, then fight Kuro (580) with Luffy.",
  "Recruit Usopp as a level 580 sharpshooter. New reference-proportioned sprites with four-direction walking and slingshot attacks. He mixes regular projectiles with Gunpowder Star.",
  "Talk to Luffy, Zoro, Nami and Usopp on land or aboard the Going Merry. New topics cover their past, navigation, combat and what happened at Syrup Village."
 ]
},
{
 "v": "5.91",
 "b": 212,
 "d": "2026-11-24",
 "es": [
  "Los jefes del Mar de Dawn ahora pegan de verdad: Alvida, Morgan, Cabaji, Buggy y Shanks hacen bastante más daño, incluso con despertares, transformación y oficios. Esquiva sus ataques marcados y lleva pociones.",
  "Solo sube el daño que te hacen a ti: Luffy, Zoro y Nami, los piratas, la Marina, la vida de los jefes y los duelos PvP no cambian."
 ],
 "en": [
  "Dawn Sea bosses now hit for real: Alvida, Morgan, Cabaji, Buggy and Shanks deal much more damage, even with awakenings, transformations and jobs. Dodge their marked attacks and bring potions.",
  "Only the damage they deal to you goes up: Luffy, Zoro and Nami, pirates, the Navy, boss HP and PvP duels are unchanged."
 ]
},
{
 "v": "5.90",
 "b": 211,
 "d": "2026-11-24",
 "es": [
  "Tras derrotar a Morgan en Shells Town, navega a Orange Town y lucha junto a Luffy y Zoro contra Cabaji (nivel 567) y Buggy (nivel 570), en ese orden.",
  "Buggy se divide en varios fragmentos que persiguen al grupo y vuelve a ensamblarse tras los cortes. Su botín incluye la Fruta Bara Bara, que da 10 % de probabilidad de esquivar ataques, las Garras de Buggy para todas las clases y su vestuario por piezas, con intentos garantizados.",
  "Recluta a Nami tras vencer a Buggy y el bote se convierte en el Going Merry. Habla con la tripulación en tierra o a bordo y pídele a Nami que marque el rumbo.",
  "Desembarca en la Isla de los Animales Raros, ayuda a Gaimon a buscar cinco cofres y elige a quién llevar contigo o dejar en el barco. Luffy, Zoro y Nami se quedan en el Mar de Dawn y tienen nuevos pasos de frente y de espaldas."
 ],
 "en": [
  "After defeating Morgan in Shells Town, sail to Orange Town and fight alongside Luffy and Zoro against Cabaji (level 567) and Buggy (level 570), in that order.",
  "Buggy splits into pieces that chase the party and reassembles after sword strikes. His drops include the Chop-Chop Fruit, which grants a 10% chance to dodge attacks, Buggy's Claws for all classes, and individual costume pieces, with guaranteed drops after enough attempts.",
  "Recruit Nami after beating Buggy to turn the small boat into the Going Merry. Talk to the crew on land or aboard and ask Nami to set a waypoint.",
  "Land on the Island of Rare Animals, help Gaimon search five chests, and choose who goes ashore or stays on the ship. Luffy, Zoro and Nami stay in the Dawn Sea and have new walking frames for facing forward and backward."
 ]
},
{
 "v": "5.89",
 "b": 210,
 "d": "2026-11-24",
 "es": [
  "Rescata a Zoro en el patio de la Base 153 de Shells Town y lucha con él y Luffy contra Morgan Mano de Hacha, jefe de nivel 550.",
  "Luffy, Zoro y Morgan tienen sprites nuevos y caminatas en cuatro direcciones. Morgan llama a dos marines cuando le queda el 65 % de vida."
 ],
 "en": [
  "Rescue Zoro in the courtyard of the 153rd Branch Base in Shells Town and fight alongside him and Luffy against Axe-Hand Morgan, a level 550 boss.",
  "Luffy, Zoro and Morgan have new sprites and four-direction walking cycles. Morgan calls two marines at 65% health."
 ]
},
{
 "v": "5.88",
 "b": 209,
 "d": "2026-11-24",
 "es": [
  "👑 Voluntad: sube al vencer enemigos (+1, jefes +25) con 10 rangos. Con el rango 1 despiertas el Aura del Conquistador (ponla en una casilla en Habilidades): onda roja con rayos negros que desmaya a los enemigos según tu rango y tumba a los muy débiles. Los jefes aguantan hasta el rango 8.",
  "😵 Shanks ahora usa su aura: si tu voluntad es menor que rango 6, te desmayas unos segundos en el duelo.",
  "📜 Recompensa y carteles de búsqueda: sube al vencer cualquier enemigo; cada nivel de peligro saca un cartel «Se busca · vivo o muerto» con tu cara. Lo ves en Habilidades y en carteles de Foosha y La Tortuga Glotona.",
  "⚓ La Marina en el Mar de Dawn: sus barcos te persiguen y, si te alcanzan, te abordan y peleas en su cubierta. En las islas un marine pregunta por ti: puedes mentir o pelear; con mucho peligro hay emboscadas. Si te derrotan pagas una multa.",
  "🛠 Arreglo: el botón de nadar mostraba un texto raro en vez de «Nadar»."
 ],
 "en": [
  "👑 Will: rises by defeating enemies (+1, bosses +25) with 10 ranks. At rank 1 you awaken the Conqueror's Aura (put it in a slot in Skills): a red wave with black lightning that knocks enemies out depending on your rank and drops very weak ones. Bosses resist until rank 8.",
  "😵 Shanks now uses his aura: if your will is below rank 6, you faint for a few seconds in the duel.",
  "📜 Bounty and wanted posters: it rises with any defeated enemy; each danger level brings a 'Wanted · dead or alive' poster with your face. See it in Skills and on posters in Foosha and the Gluttonous Turtle.",
  "⚓ The Navy in the Dawn Sea: their ships chase you and, if they catch you, they board you and you fight on their deck. On the islands a marine asks about you: you can lie or fight; with high danger there are ambushes. If they beat you, you pay a fine.",
  "🛠 Fix: the swim button showed odd text instead of 'Swim'."
 ]
},
{
 "v": "5.87",
 "b": 208,
 "d": "2026-11-24",
 "es": [
  "🛠 Arreglo: el mapa del Mar de Dawn daba un error rojo y no dejaba cambiar de mapa con las flechas (un punto de La Tortuga Glotona tenía una categoría que no existía). Ahora el mapa ignora cualquier punto así.",
  "👕 Ropa de los mares (cosméticos por piezas) en La Tortuga Glotona: la Modista Marea, en la recepción, la vende y hay maniquíes con la ropa puesta.",
  "🗡 Espadachín: pañuelo negro atado, camiseta de botones con faja verde (y pañuelo en el brazo), pantalón negro, botas negras y tres katanas al cinto. 🎯 Francotirador: pañuelo con gafas, peto marrón con faja blanca, correa y muñequera de rayas, pantalón y bolsa de lona.",
  "🧭 Navegante: camiseta blanca de franjas azules, minifalda naranja y sandalias. 🍳 Cocinero: chaqueta negra cruzada con botones dorados, camisa celeste y corbata, pantalón de traje y zapatos negros. Todo se ve en las 10 estructuras de cuerpo."
 ],
 "en": [
  "🛠 Fix: the Dawn Sea map showed a red error and the arrows stopped switching maps (a Gluttonous Turtle marker had a category that did not exist). The map now ignores any such marker.",
  "👕 Sea clothes (cosmetics, piece by piece) at the Gluttonous Turtle: Marea the dressmaker sells them at the reception, with mannequins wearing them.",
  "🗡 Swordsman: tied black headscarf, button tee with green belly band (and an arm scarf), black trousers, black boots and three katanas at the hip. 🎯 Sharpshooter: headscarf with goggles, brown bib with white sash, strap and striped wristband, trousers and canvas bag.",
  "🧭 Navigator: white tee with blue stripes, orange miniskirt and sandals. 🍳 Cook: black double-breasted jacket with gold buttons, light blue shirt and tie, suit trousers and black shoes. Everything fits all 10 body builds."
 ]
},
{
 "v": "5.86",
 "b": 207,
 "d": "2026-11-23",
 "es": [
  "🐢 La Tortuga Glotona: restaurante flotante sobre una tortuga gigante, cerca de Foosha en el Mar de Dawn. Acércate con el bote al muelle de popa y sube (no hace falta la Fruta del Diablo).",
  "🍽 Por dentro: Bar Pirata, Jardín del Caparazón con fuente, Terraza con sombrillas, Gran Comedor, Recepción con una vitrina de comida gigante y Cocina. Piratas y clientes comiendo, meseros que llevan platos a las mesas, cocineros y la chef Brígida.",
  "🧑‍🍳 Turno de mesero con Madame Perla (90 s, dentro del mapa): coge platos en el pase con ⚔ y llévalos a las mesas que piden. Da oro, propinas y experiencia del oficio Restaurante. La chef sirve el plato del día (vida y maná al máximo).",
  "🏊 Nadar en el Mar de Dawn: tírate al agua desde el bote (⚔) o desde la orilla. Vuelve a tu bote, sube a la tortuga o sal en la costa de Foosha (pide la Fruta del Diablo). Si comiste una fruta, el mar te hunde y te rescatan con un salvavidas."
 ],
 "en": [
  "🐢 The Gluttonous Turtle: a floating restaurant on a giant turtle near Foosha in the Dawn Sea. Bring your boat to the stern dock and board (no Devil Fruit needed).",
  "🍽 Inside: Pirate Bar, Shell Garden with a fountain, Terrace with parasols, Great Dining Room, Reception with a giant food showcase and Kitchen. Pirates and diners eating, waiters carrying plates to the tables, cooks and Chef Brígida.",
  "🧑‍🍳 Waiter shift with Madame Perla (90 s, on the map): take plates at the pass with ⚔ and bring them to the tables ordering. Gives gold, tips and Restaurant job experience. The chef serves the dish of the day (full health and mana).",
  "🏊 Swimming in the Dawn Sea: jump in from the boat (⚔) or from the shore. Get back to your boat, climb onto the turtle or come ashore on Foosha's coast (needs the Devil Fruit). If you ate a fruit, the sea drags you down and you get rescued with a lifebuoy."
 ]
},
{
 "v": "5.85",
 "b": 206,
 "d": "2026-11-23",
 "es": [
  "🧥 Ropa del Pelirrojo (cosméticos): Camisa Abierta con botones y mangas remangadas, Pantalón Corto malva con enredaderas y estrellas, y Capa Negra sobre los hombros con el cuello levantado. Se ven en las 5 estructuras de hombre y de mujer y en las 4 direcciones.",
  "⚔ Caen al vencer a Shanks (duelo o revancha): 30 % por cada prenda que te falte, y cada una es segura a las 15 victorias sin ella. La barra de Shanks enseña cuántas faltan. Se ponen en el Armario."
 ],
 "en": [
  "🧥 Red Hair's clothes (cosmetics): Open Shirt with buttons and rolled sleeves, mauve Knee Shorts with vines and stars, and a Black Cloak over the shoulders with a raised collar. They fit the 5 male and 5 female builds in all 4 directions.",
  "⚔ They drop when you beat Shanks (duel or rematch): 30% for each piece you are missing, and each one is guaranteed by the 15th win without it. Shanks's bar shows how many are left. Wear them from the Wardrobe."
 ]
},
{
 "v": "5.84",
 "b": 205,
 "d": "2026-11-23",
 "es": [
  "👒 Conjunto de Pirata de Paja (tier 44, nivel 600, cualquier clase): sombrero de paja, chaleco rojo abierto sin mangas, faja amarilla, pantalón corto azul y sandalias. Un 5 % más fuerte que la Aurora Divina.",
  "⚔ Es el premio del duelo con Shanks en Foosha: 10 % por victoria y seguro a las 15. Después del primer duelo puedes pedirle la revancha. La barra de Shanks enseña cuántas victorias faltan."
 ],
 "en": [
  "👒 Straw Pirate set (tier 44, level 600, any class): straw hat, open sleeveless red vest, yellow sash, blue shorts and sandals. 5% stronger than the Divine Aurora.",
  "⚔ It is the reward for the duel with Shanks in Foosha: 10% per win and guaranteed by the 15th. After the first duel you can ask him for a rematch. Shanks's bar shows how many wins are left."
 ]
},
{
 "v": "5.83",
 "b": 204,
 "d": "2026-11-23",
 "es": [
  "🍇 La Fruta del Diablo de Goma (Hilandera Muda: 5 %, segura a los 20 intentos) sigue abriendo las islas de Dawn y ahora se puede comer: cuerpo de goma con 5 técnicas animadas en Habilidades › Fruta (Pistola, Ametralladora, Hacha, Bazuca y Globo) y tus golpes cuerpo a cuerpo estiran el brazo con el arma.",
  "🍐 Fruta Transparente: aparece a veces en las islas de Dawn con aviso y flecha. Comida: invisibilidad 6 s, los enemigos no te ven.",
  "⚠ Con una fruta no puedes nadar (pierdes vida en el Fondo Marino y en Nerea). Solo puedes tener una: si te comes otra, mueres. Shanks te la puede quitar.",
  "🎁 Todos los jefes enseñan encima de su barra de vida lo que sueltan y con qué probabilidad.",
  "🔍 Lupa › Sistemas: Progresión crossover (Dawn, frutas y Engranaje 2)."
 ],
 "en": [
  "🍇 The Rubber Devil Fruit (Mute Spinner: 5%, guaranteed by the 20th try) still opens the Dawn islands and can now be eaten: a rubber body with 5 animated techniques in Skills › Fruit (Pistol, Gatling, Axe, Bazooka and Balloon), and your melee hits stretch your arm with the weapon.",
  "🍐 Clear Fruit: it sometimes appears on the Dawn islands with a warning and an arrow. Eaten: 6 s invisibility, enemies cannot see you.",
  "⚠ With a fruit you cannot swim (you lose HP on the Seabed and in Nerea). You can only have one: eat another and you die. Shanks can remove it.",
  "🎁 Every boss shows above its health bar what it drops and how likely it is.",
  "🔍 Magnifier › Systems: Crossover progression (Dawn, fruits and Gear 2)."
 ]
},
{
 "v": "5.82",
 "b": 203,
 "d": "2026-11-23",
 "es": [
  "🍇 La Fruta del Diablo ya se puede conseguir: la suelta la Hilandera Muda (nivel 600, Tierras Tejidas) con un 10 %. No se come: llévala en la mochila.",
  "⛵ Con la fruta puedes desembarcar en Foosha (muelle del puerto) y en Shells Town desde tu bote del Mar de Dawn. Little Garden aún no tiene desembarco.",
  "♨ Así ya se llega a Shanks y a Engranaje 2: duelo en Foosha y luego el ritual."
 ],
 "en": [
  "🍇 The Devil Fruit can now be obtained: the Mute Spinner (level 600, Woven Lands) drops it with a 10% chance. It is not eaten: carry it in your bag.",
  "⛵ With the fruit you can land at Foosha (harbour pier) and Shells Town from your Dawn Sea boat. Little Garden has no landing yet.",
  "♨ This opens the way to Shanks and Gear 2: a duel in Foosha and then the ritual."
 ]
},
{
 "v": "5.81",
 "b": 202,
 "d": "2026-11-23",
 "es": [
  "♨ Transformación nueva: Engranaje 2 (nivel 600). Piel roja pálida, vapor que sale de todo el cuerpo y estela al correr. Es la forma más fuerte, un poco por encima de las fusiones: +45 % de ataque y +25 % de velocidad. Con espada, dagas o guadaña el brazo se estira con el arma y golpea a distancia.",
  "⚔ Se consigue con Shanks en Villa Foosha: te dice si estás listo (nivel 600 y haber vencido a la Rueca Desbocada) y te enfrentas a él, el enemigo más fuerte de momento. 🔒 Foosha sigue cerrada, así que por ahora no se puede conseguir.",
  "Habilidades: Puño Hirviente, Paso de Vapor, Lluvia de Puños y Estallido Hirviente. Todo en la Lupa › Sistemas."
 ],
 "en": [
  "♨ New transformation: Gear 2 (level 600). Pale red skin, steam rising from the whole body and an afterimage when running. The strongest form, just above the fusions: +45% attack and +25% speed. With a sword, daggers or scythe your arm stretches with the weapon and hits at range.",
  "⚔ Obtained from Shanks in Foosha Village: he tells you if you are ready (level 600 and the Runaway Spinning Wheel defeated) and you fight him, the strongest enemy for now. 🔒 Foosha is still closed, so it can't be obtained yet.",
  "Skills: Boiling Fist, Steam Step, Rain of Fists and Boiling Burst. All in the Magnifier › Systems."
 ]
},
{
 "v": "5.80",
 "b": 201,
 "d": "2026-11-23",
 "es": [
  "🐺 Transformaciones con las armaduras de nivel 505-600: orejas, cuernos, pelaje, escamas, alas y cristales siempre por encima de la armadura. Las capuchas nuevas ya no tapan el pelo de la forma (por ejemplo, el pelo dorado del Despertar Dorado)."
 ],
 "en": [
  "🐺 Transformations with level 505-600 armour: ears, horns, fur, scales, wings and crystals always on top of the armour. The new hoods no longer hide the form's hair (for example, the Golden Awakening's golden hair)."
 ]
},
{
 "v": "5.79",
 "b": 200,
 "d": "2026-11-23",
 "es": [
  "🎨 Las 15 criaturas y los 4 jefes de las Tierras Tejidas tienen sus dibujos nuevos (las mismas mecánicas).",
  "⚔ Las 49 armas de nivel 505 a 600 tienen sus dibujos nuevos, cada una con el tema de su tier.",
  "🎵 Música propia en las Tierras Tejidas (caja de música) y otra para sus jefes.",
  "🎣 Cuatro peces nuevos en los estanques de tinte: Pez Hilo, Carpa de Tinte, Anguila de Huso y Koi de Seda (cañas 15 a 18).",
  "🧭 ▦ Atajos › ¿Qué hago ahora? › Tierras Tejidas: te dice qué pico, hacha o caña forjar, te lleva a la veta, árbol o estanque que ya puedes usar, al siguiente jefe y a la forja.",
  "🔍 Lupa › Sistemas: Tierras Tejidas (jefes, recursos y herramientas, forja), cada uno con flecha."
 ],
 "en": [
  "🎨 The 15 creatures and 4 bosses of the Woven Lands have their new artwork (same mechanics).",
  "⚔ The 49 level 505-600 weapons have their new artwork, each matching its tier's theme.",
  "🎵 Own music in the Woven Lands (music box) and another for its bosses.",
  "🎣 Four new fish in the dye ponds: Thread Fish, Dye Carp, Spindle Eel and Silk Koi (rods 15 to 18).",
  "🧭 ▦ Shortcuts › What do I do now? › Woven Lands: tells you which pickaxe, axe or rod to forge, takes you to the vein, tree or pond you can already use, to the next boss and to the forge.",
  "🔍 Magnifier › Systems: Woven Lands (bosses, resources and tools, forge), each with an arrow."
 ]
},
{
 "v": "5.78",
 "b": 199,
 "d": "2026-11-23",
 "es": [
  "🧶 Las Tierras del Vínculo crecen: al sur de Sahrim y Yarakai (y al este de Nhar) hay una región nueva, las Tierras Tejidas, con un bioma nuevo de algodón rosado, ovillos gigantes, carretes y ciénagas de tinte. Se llega por los andenes de las estaciones Sahrim y Yarakai.",
  "⬆ El nivel máximo sube a 600. Cuatro zonas: Pradera de Algodón, Bosque de Ovillos, Ciénaga de Tinte e Hilandería Rota (nivel 500 a 600).",
  "👾 15 criaturas nuevas, cada una con su mecánica (se deshacen en ovillitos, se recosen, lanzan telarañas, aparecen a tu espalda, curan a las demás, te arrastran…) y 4 jefes: la Reina Polilla, el Nudo Ciego, la Rueca Desbocada y la Hilandera Muda.",
  "🏕 Campamento de las Hebras con 6 NPCs: Ovidia, Maese Hilario (forja), Cora, Fray Lino, Pip y Brígida. Piedra de viaje nueva.",
  "⛏ Minerales nuevos (Hebrita, Tintolita, Plata de Huso y Sedalita), cuatro maderas nuevas y picos, hachas y cañas 14 a 17.",
  "🛡 7 tiers de equipo de nivel 505 a 600: armaduras con un diseño distinto para cada clase (49 aspectos) y 49 armas nuevas. Todo en la Lupa › Sistemas."
 ],
 "en": [
  "🧶 The Lands of the Bound grow: south of Sahrim and Yarakai (and east of Nhar) there is a new region, the Woven Lands, with a new biome of pink cotton, giant yarnballs, spools and dye marshes. Reach it from the Sahrim and Yarakai station platforms.",
  "⬆ The level cap rises to 600. Four zones: Cotton Meadow, Yarnball Wood, Dye Marsh and Broken Spinning Mill (level 500 to 600).",
  "👾 15 new creatures, each with its own mechanic (they unravel into small yarnballs, sew themselves back up, shoot webs, appear behind you, heal the others, drag you…) and 4 bosses: the Moth Queen, the Blind Knot, the Runaway Spinning Wheel and the Mute Spinner.",
  "🏕 Thread Camp with 6 NPCs: Ovidia, Master Hilario (forge), Cora, Brother Lino, Pip and Brígida. New waystone.",
  "⛏ New ores (Threadite, Dyestone, Spindle Silver and Silkstone), four new woods and pickaxes, axes and rods 14 to 17.",
  "🛡 7 tiers of level 505-600 gear: armour with a different design for each class (49 looks) and 49 new weapons. All in the Magnifier › Systems."
 ]
},
{
 "v": "5.77",
 "b": 198,
 "d": "2026-11-23",
 "es": [
  "▦ Atajos por páginas: los botones se acomodan en páginas con ◀ ▶ (o deslizando a los lados) y ya no se salen de la pantalla.",
  "🚕 Taxi por app (▦ Atajos, solo dentro de una ciudad): eliges una zona, el taxi te recoge y te deja allí.",
  "🎤 Conciertos en la plaza algunas noches (⚔ para bailar). 🚚 Vecinos nuevos que se mudan cada semana. 🪧 Huelgas de combis.",
  "🗿 Con 25 de reputación el alcalde te nombra Vecino Ilustre: título y estatua de bronce en la plaza.",
  "🔍 Un misterio en cada ciudad: pistas, testigo y sospechosos (marco «Detective»). 👻 Leyendas urbanas de madrugada: la Llorona, la Santa Compaña, el duende de Chan Chan…",
  "📷 Álbum de fauna con el modo foto. 🍽 Tu fonda a la hora del almuerzo: sirve tus platos a los vecinos. 🐾 Michi y Firulais aprenden trucos (traer cosas y buscar tesoros)."
 ],
 "en": [
  "▦ Shortcuts in pages: buttons are arranged in pages with ◀ ▶ (or swipe sideways) and no longer go off screen.",
  "🚕 Taxi app (▦ Shortcuts, only inside a city): pick an area, the taxi picks you up and drops you there.",
  "🎤 Concerts in the square some nights (⚔ to dance). 🚚 New neighbours moving in every week. 🪧 Combi strikes.",
  "🗿 With 25 reputation the mayor names you Distinguished Neighbour: title and a bronze statue in the square.",
  "🔍 A mystery in each city: clues, a witness and suspects («Detective» frame). 👻 Late-night urban legends: La Llorona, the Holy Company, the goblin of Chan Chan…",
  "📷 Wildlife album with photo mode. 🍽 Your eatery at lunch time: serve your dishes to the neighbours. 🐾 Kitty and Firulais learn tricks (fetching and digging for treasure)."
 ]
},
{
 "v": "5.76",
 "b": 197,
 "d": "2026-11-23",
 "es": [
  "🔎 Lupa › 🏙 Ciudades y vida: nueva pestaña con todo lo de las ciudades, la familia y la vida diaria explicado, y «Hoy en las ciudades» (fiestas, mercado, cumpleaños, partidos, apagones y bodas de hoy).",
  "🚐 Súbete a una combi en la calle (5 de oro): el cobrador vocea las paradas y bajas con ⚔ donde quieras. 👛 De día, carteristas: atrápalos antes de 40 s.",
  "🏘 Barrios con personalidad: corredores al amanecer, pintores y músicos de noche, mariachis en el Zócalo, flamenco en Andalucía. Al almuerzo, colas y humito en los puestos de comida.",
  "⚡ Apagones algunas noches (velas en las ventanas y más loquitos). ⚽ Partidos de la selección con goles en toda la ciudad y caravana si gana. 📰 Canillita con el periódico del día.",
  "🏖 Bañistas en verano y chubascos de verano. 💒 Bodas y bautizos en la plaza. 🧺 Abre tu propio puesto en el mercado de los sábados.",
  "🏫 Recreo en la escuela de Albor: ve a ver a tus hijos al patio. 🐓 Gallos al amanecer, grillos y luciérnagas de noche, mariposas de día."
 ],
 "en": [
  "🔎 Magnifier › 🏙 Cities & life: a new tab explaining everything about cities, family and daily life, plus «Today in the cities» (today's festivals, market, birthdays, matches, power cuts and weddings).",
  "🚐 Hop on a combi in the street (5 gold): the conductor shouts the stops and you get off with ⚔ wherever you like. 👛 Pickpockets by day: catch them within 40 s.",
  "🏘 Neighbourhoods with character: dawn joggers, painters and musicians at night, mariachis in the Zócalo, flamenco in Andalusia. At lunch, queues and steam at the food stalls.",
  "⚡ Power cuts some nights (candles in the windows and more nutters). ⚽ National team matches with goals across the city and a caravan if they win. 📰 Newspaper boy with the daily paper.",
  "🏖 Summer beachgoers and summer showers. 💒 Weddings and christenings in the square. 🧺 Open your own stall at the Saturday market.",
  "🏫 Break time at the Albor school: visit your children in the yard. 🐓 Roosters at dawn, crickets and fireflies at night, butterflies by day."
 ]
},
{
 "v": "5.75",
 "b": 196,
 "d": "2026-11-23",
 "es": [
  "▦ Atajos se desliza hacia abajo: ya se pueden tocar los últimos botones (un brillo abajo avisa de que hay más).",
  "☔ Las ciudades tienen clima: con lluvia la gente se refugia y saca paraguas (en Lima es garúa). 🚗 Hora punta con combis voceando y calles vacías de madrugada.",
  "🎉 Fiestas de cada país con guirnaldas, más gente y un regalo diario: Día de Muertos, Inti Raymi, Fiestas Patrias, Concurso de Marinera, San Fermín y Feria de Abril.",
  "🗓 Vecinos con nombre y rutina (casa, trabajo, almuerzo en la plaza) y sus cumpleaños con fiesta. 👮 Serenos y policías de noche que te ayudan con los loquitos y te dan recompensa.",
  "🔒 Los puestos cierran de noche (algunos abren 24 horas). 🌅 Surfistas y pescadores al amanecer. 🧺 Mercado de los sábados.",
  "🐾 Adopta al gato o al perro de la calle que acaricias 3 días. 💼 Los hijos mayores trabajan en un oficio y te traen oro y materiales. 😊 Reputación por ciudad: te saludan por tu nombre y te hacen descuento."
 ],
 "en": [
  "▦ Shortcuts now scroll down: the last buttons can be tapped (a glow at the bottom shows there is more).",
  "☔ Cities have weather: when it rains people take shelter and open umbrellas (in Lima it is drizzle). 🚗 Rush hour with shouting combis and empty streets late at night.",
  "🎉 Each country's festivals with garlands, more people and a daily gift: Day of the Dead, Inti Raymi, National Holidays, Marinera Contest, San Fermín and April Fair.",
  "🗓 Named neighbours with a routine (home, work, lunch in the square) and birthday parties. 👮 Night watchmen and police who help you with the nutters and pay a reward.",
  "🔒 Stalls close at night (some are open 24 hours). 🌅 Surfers and fishermen at dawn. 🧺 Saturday market.",
  "🐾 Adopt the street cat or dog you pet on 3 days. 💼 Grown-up children work a job and bring you gold and materials. 😊 Reputation per city: people greet you by name and give you a discount."
 ]
},
{
 "v": "5.74",
 "b": 195,
 "d": "2026-11-23",
 "es": [
  "🌆 Lima, Lima Norte, Trujillo, Cusco, Machu Picchu, México y España siguen la hora: de día las calles están llenas, al anochecer la gente se va a casa y de madrugada casi no queda nadie. Los domingos sale todo el mundo; España tiene siesta y cena tarde.",
  "🌙 Vendedores que solo abren de noche (anticuchos, picarones, emoliente, tacos, churros…) y, de 22:00 a 5:00, loquitos que buscan pleito. Su fuerza se adapta a la tuya.",
  "👂 La gente comenta lo que de verdad has hecho («¿Qué se dice por aquí?») y a veces cuchichea cuando pasas. 🤝 Cada día un vecino te pide un favor, y a veces te visitan en casa con un regalo.",
  "🐾 Gatos, perros y palomas por las calles: acarícialos con ⚔; las palomas vuelan si te acercas y el gato te sigue si le das pescado.",
  "🌸 Huerto por estaciones: 8 cultivos de temporada. Al cosechar un huerto se cosechan todos los que están listos y se vuelven a sembrar.",
  "🏡 Rutina de los hijos (escuela, jardín, cena y cama), cena en familia, diario de cada hijo y fotos de familia en la pared del salón.",
  "🏠 Volver a casa (▦ Atajos), buscador y filtro de oficio en el inventario, 🧺 Vida diaria (lista de compra con flecha, Bolsa de rescate cuando la mochila está llena, favor del día y avisos) y temporizador de 3 s en el modo foto."
 ],
 "en": [
  "🌆 Lima, North Lima, Trujillo, Cusco, Machu Picchu, Mexico and Spain follow the clock: streets are busy by day, people go home at dusk and hardly anyone is left late at night. On Sundays everyone is out; Spain has a siesta and late dinners.",
  "🌙 Vendors who only open at night (anticuchos, picarones, emoliente, tacos, churros…) and, from 22:00 to 5:00, nutters looking for a fight. Their strength adapts to yours.",
  "👂 People talk about what you have really done («What is the word around here?») and sometimes whisper as you pass. 🤝 Every day a neighbour asks you a favour, and sometimes they visit your house with a gift.",
  "🐾 Cats, dogs and pigeons on the streets: pet them with ⚔; pigeons fly off if you get close and the cat follows you if you give it fish.",
  "🌸 Seasonal garden: 8 seasonal crops. Harvesting one plot harvests every ripe plot and replants them.",
  "🏡 Children's routine (school, garden, dinner and bed), family dinner, a diary for each child and family photos on the living room wall.",
  "🏠 Go home (▦ Shortcuts), search and jobs filter in the bag, 🧺 Daily life (shopping list with arrow, Rescue bag when your bag is full, favour of the day and alerts) and a 3 s timer in photo mode."
 ]
},
{
 "v": "5.73",
 "b": 194,
 "d": "2026-11-21",
 "es": [
  "El desembarco en Foosha, Little Garden y Shells Town requiere una Fruta del Diablo, que aún no se puede conseguir.",
  "Desde nivel 500 sigue disponible la navegación por el Mar de Dawn."
 ],
 "en": [
  "Landing at Foosha, Little Garden and Shells Town requires a Devil Fruit, which cannot be obtained yet.",
  "Sailing the Dawn Sea remains available from level 500."
 ]
},
{
 "v": "5.72",
 "b": 193,
 "d": "2026-11-21",
 "es": [
  "Shells Town abre al este de Little Garden, en el mismo Mar de Dawn de 1.648 × 360 casillas.",
  "Desembarca en el muelle central y explora las calles de adoquín y el exterior de la Base 153. Puedes volver a tu embarcación desde el mismo muelle."
 ],
 "en": [
  "Shells Town opens east of Little Garden on the same 1,648 × 360 tile Dawn Sea map.",
  "Land at the central pier to explore the cobbled streets and the outside of the 153rd Branch Base. Return to your ship from the same pier."
 ]
},
{
 "v": "5.71",
 "b": 192,
 "d": "2026-11-21",
 "es": [
  "Luffy niño usa su nuevo sprite en Foosha y saluda cuando te acercas.",
  "En Ajustes → Sprites de Dawn puedes alternar entre los dos sprites de Alvida."
 ],
 "en": [
  "Young Luffy has a new sprite in Foosha and waves when you approach.",
  "Switch between Alvida’s two sprites in Settings → Dawn sprites."
 ]
},
{
 "v": "5.70",
 "b": 191,
 "d": "2026-11-21",
 "es": [
  "Mar de Dawn ampliado a 1.168 × 360 casillas. Little Garden aparece en el mapa con el desembarco cerrado.",
  "Desde nivel 500, Marina te da acceso a un bote que puedes manejar. Localiza el galeón, aborda y vence a la tripulación y a Alvida.",
  "Gana el mazo de Alvida para guerrero, registra a la tripulación en el bestiario y toma el timón del galeón."
 ],
 "en": [
  "The Dawn Sea covers 1,168 × 360 tiles. Little Garden is on the map with its landing closed.",
  "At level 500, Marina grants access to a boat you can steer. Find the galleon, board and defeat the crew and Alvida.",
  "Earn Alvida’s warrior mace, register the crew in the bestiary and take the galleon’s helm."
 ]
},
{
 "v": "5.69",
 "b": 190,
 "d": "2026-11-21",
 "es": [
  "🛠 Selva peruana: arreglado el error rojo «reading 'y'» al caminar, que congelaba el juego y parecía teletransportarte. El juego ya no se rompe en ningún mapa sin salida a pie."
 ],
 "en": [
  "🛠 Peruvian jungle: fixed the red error «reading 'y'» while walking, which froze the game and looked like teleporting. The game no longer breaks on any map without a walk-out exit."
 ]
},
{
 "v": "5.68",
 "b": 189,
 "d": "2026-11-20",
 "es": [
  "Selva peruana de 720 × 360 casillas: río, bosque de lupunas, cascada, aguajal, cocha y dos comunidades conectadas por senderos.",
  "Compra el billete de 10.000 de oro en Jorge Chávez, embarca por la Puerta 2 y regresa gratis con Daniela.",
  "Aprende y practica shipibo-konibo y asháninka con Luz y Elena."
 ],
 "en": [
  "720 × 360 Peruvian Amazon map: river, lupuna forest, waterfall, aguaje palms, oxbow lake and two communities connected by trails.",
  "Buy the 10,000 gold ticket at Jorge Chávez, board at Gate 2 and fly back free with Daniela.",
  "Learn and practice Shipibo-Konibo and Ashaninka with Luz and Elena."
 ]
},
{
 "v": "5.67",
 "b": 188,
 "d": "2026-11-20",
 "es": [
  "⚒ ▦ Atajos › ¿Qué hago ahora?: nueva sección de oficios. Primero Tala, Minería y Pesca (con tu herramienta equipada y sus casillas); al terminarlas te va mostrando el siguiente oficio, uno a uno, hasta los 68.",
  "➜ «Llévame» pone la flecha dorada donde practicar y «Ver en la Lupa» abre la guía de ese oficio."
 ],
 "en": [
  "⚒ ▦ Shortcuts › What do I do now?: new jobs section. First Woodcutting, Mining and Fishing (with your equipped tool and its slots); once done it shows the next job, one by one, up to all 68.",
  "➜ «Take me» sets the golden arrow where to practise and «See in Magnifier» opens that job's guide."
 ]
},
{
 "v": "5.66",
 "b": 187,
 "d": "2026-11-20",
 "es": [
  "▦ Barra de abajo más limpia: se quitan la casilla ＋ y el libro. Quedan hacha, poción, pico, caña, mochila y tu arma.",
  "💃 Bailes: los brazos se dibujan encima de la ropa con contorno y se aclaran con prendas negras, así se ve el movimiento con cualquier atuendo.",
  "✦ Armario › Auras: 5 auras nuevas con oro: Escarcha cristalina, Pacto carmesí, Humo de sombra, Prisma arcoíris y Fuegos fatuos."
 ],
 "en": [
  "▦ Cleaner bottom bar: the ＋ slot and the book are gone. Axe, potion, pickaxe, rod, bag and your weapon remain.",
  "💃 Dances: arms are drawn over clothes with an outline and brightened on black outfits, so the movement shows with any outfit.",
  "✦ Wardrobe › Auras: 5 new auras for gold: Crystal frost, Crimson pact, Shadow smoke, Rainbow prism and Will-o'-wisps."
 ]
},
{
 "v": "5.65",
 "b": 186,
 "d": "2026-11-20",
 "es": [
  "🐴 El botón de montura abre tus monturas compradas: elige la que quieras o cambia sin bajarte. En el online se ve la que llevas.",
  "🧪 Curas equilibradas: pociones como mucho el 40 % de tu vida (elixir 60 %); platos y bebidas como mucho el 25 % y con 20 s de espera (antes se podían comer sin parar y curaban miles).",
  "⛏ Las vetas y árboles nuevos de nivel alto vuelven a salir a los 3 s en el mismo sitio."
 ],
 "en": [
  "🐴 The mount button opens your purchased mounts: pick any or switch without getting off. Online players see the one you ride.",
  "🧪 Balanced healing: potions heal at most 40% of your HP (elixir 60%); dishes and drinks at most 25% with a 20 s cooldown (before they could be spammed for thousands).",
  "⛏ The new high-level veins and trees grow back after 3 s in the same spot."
 ]
},
{
 "v": "5.64",
 "b": 185,
 "d": "2026-11-20",
 "es": [
  "🛠 Arreglado el error rojo «id is not defined» al usar el Tónico de Fuerza (y cualquier tónico).",
  "🧪 Las pociones tienen 30 s de espera (curar, maná y tónicos por separado). La poción rápida puede ser cualquiera.",
  "🪓 Hachas, picos y cañas ahora se equipan en el inventario (Equipar). Talar, picar y pescar ya no es automático con ⚔: se pulsa su casilla.",
  "▦ Barra de abajo nueva: hacha · poción · pico · caña · ★ casilla libre (pon lo que quieras; mantén pulsado para cambiarla) · mochila · tu arma · misiones. La casilla brilla si tienes un árbol, una veta o agua al lado.",
  "⛏ 7 minerales y 7 maderas nuevas de nivel alto en Celestia, Altavela, el Velo Roto, Lima Norte, Cusco (Vinicunca) y México, con su icono en el mapa.",
  "⚒ 7 hachas, 7 picos y 7 cañas nuevas (nivel 170-450). Tala, Minería y Pesca suben hasta el nivel 120 (+30 con maestría).",
  "🐟 40 peces nuevos (bestiario y acuario), también en Perú, México y Japón. 🎣 Don Anselmo, el cebero de Puerto Coral: lombrices y cebo dorado para pescar más rápido y peces por oro o lombrices.",
  "🔎 Todo en la Lupa › Sistemas y en «Dónde conseguir» con flecha."
 ],
 "en": [
  "🛠 Fixed the red error «id is not defined» when using the Strength Tonic (and any tonic).",
  "🧪 Potions have a 30 s cooldown (healing, mana and tonics separately). The quick potion can be any of them.",
  "🪓 Axes, pickaxes and rods are now equipped in the bag (Equip). Chopping, mining and fishing are no longer automatic with ⚔: tap their slot.",
  "▦ New bottom bar: axe · potion · pickaxe · rod · ★ free slot (put anything; long-press to change) · bag · your weapon · quests. A slot glows when a tree, vein or water is next to you.",
  "⛏ 7 new high-level ores and 7 woods in Celestia, Altavela, the Broken Veil, North Lima, Cusco (Vinicunca) and Mexico, with their map icon.",
  "⚒ 7 new axes, 7 pickaxes and 7 rods (level 170-450). Woodcutting, Mining and Fishing go up to level 120 (+30 with mastery).",
  "🐟 40 new fish (bestiary and aquarium), also in Peru, Mexico and Japan. 🎣 Old Anselmo, Puerto Coral's bait seller: worms and golden bait to fish faster, and fish for gold or worms.",
  "🔎 Everything in Magnifier › Systems and «Where to get it» with an arrow."
 ]
},
{
 "v": "5.63",
 "b": 184,
 "d": "2026-11-20",
 "es": [
  "💃 Armario › Bailes: diez bailes nuevos con vista previa gratuita y compra permanente con el oro existente.",
  "🎭 Se usan en el botón de gestos y bailes de siempre. Animación de 32 cuadros, diez cuerpos y cuatro direcciones; se ven online y conservan tu pelo, ropa y aura."
 ],
 "en": [
  "💃 Wardrobe › Dances: ten new dances with free preview and permanent purchases using existing gold.",
  "🎭 Use the existing gestures and dances button. 32-frame animation, ten bodies and four directions; visible online, preserving your hair, clothing and aura."
 ]
},
 {
 "v": "5.62",
 "b": 183,
 "d": "2026-11-20",
 "es": [
  "⚓ Dawn / Villa Foosha: mapa de 720 × 360, pasto suave, molinos, Partys Bar, palmeras y tripulación de Shanks con cuerpos y animaciones nativas.",
  "🔒 La Capitana Marina de Puerto Coral explica el futuro requisito de una fruta del diablo. Viaje todavía cerrado: no cobra oro ni consume objetos.",
  "⚔ Piratas pendencieros de nivel 500 fuera del pueblo, con vida, EXP, oro y furia del equilibrio existente. Nivel máximo: 500. Escenario preparado para Romance Dawn; el capítulo completo llegará después."
 ],
 "en": [
  "⚓ Dawn / Foosha Village: 720 × 360 map, soft grass, windmills, Partys Bar, coastal palms and Shanks’s crew with native bodies and animation.",
  "🔒 Captain Marina in Puerto Coral explains the future Devil Fruit requirement. Voyage still closed: no gold charged or items consumed.",
  "⚔ Level-500 brawling pirates outside the village, using existing health, XP, gold and fury balance. Level cap: 500. Romance Dawn setting prepared; the full chapter comes later."
 ]
},
 {
  "v": "5.61",
  "b": 182,
  "d": "2026-11-20",
  "es": [
   "✦ Armario › Auras: seis auras de energía grandes. Prueba gratis, compra con oro, equipa o quita; colección permanente por personaje.",
   "🎨 Adaptadas al motor original, las cinco estructuras femeninas y cinco masculinas, los peinados y las cuatro direcciones. Visibles en multijugador; sin cambiar estadísticas."
  ],
  "en": [
   "✦ Wardrobe › Auras: six large energy auras. Preview for free, buy with gold, equip or remove; permanent collection per character.",
   "🎨 Fitted to the original engine, all five female and five male bodies, hairstyles and four directions. Visible in multiplayer; no stat changes."
  ]
 },
 {
  "v": "5.60",
  "b": 181,
  "d": "2026-11-20",
  "es": [
   "📔 El Diario del héroe ahora es un libro de verdad: portada de cuero con tu héroe dibujado, páginas de papel (dos a la vez en horizontal) y pasas página con las flechas, tocando el borde o deslizando el dedo, con animación de hoja."
  ],
  "en": [
   "📔 The Hero's diary is now a real book: leather cover with your hero drawn, paper pages (two at a time in landscape) and you turn pages with the arrows, by tapping the edge or swiping, with a page-flip animation."
  ]
 },
 {
  "v": "5.59",
  "b": 180,
  "d": "2026-11-20",
  "es": [
   "📔 Diario del héroe (▦ Atajos): un libro que se escribe solo con tus hazañas reales (jefes vencidos, cada 50 niveles, pareja, hijos, formas, fusiones y marcos). Tus amigos online pueden leer tus últimas páginas."
  ],
  "en": [
   "📔 Hero's diary (▦ Shortcuts): a book that writes itself with your real deeds (bosses defeated, every 50 levels, partner, children, forms, fusions and frames). Your online friends can read your latest pages."
  ]
 },
 {
  "v": "5.58",
  "b": 179,
  "d": "2026-11-20",
  "es": [
   "🧭 ¿Qué hago ahora? (▦ Atajos): tu misión, dónde subir de nivel y qué pasa ahora en el mundo.",
   "▦ Atajos por pestañas: Todo, Combate, Online y social, Ayuda y menús.",
   "🔴 Puntito rojo en lo que tiene algo nuevo (correo, cofre de la isla, impuesto, invitaciones, linterna, hilos para tejer).",
   "💡 Explicación corta la primera vez que abres cada sistema.",
   "🎁 Regalo diario (racha de 7 días) y regalo semanal."
  ],
  "en": [
   "🧭 What do I do now? (▦ Shortcuts): your quest, where to level up and what is happening in the world now.",
   "▦ Shortcuts in tabs: All, Combat, Online & social, Help & menus.",
   "🔴 Red dot on whatever has something new (mail, island chest, tax, invitations, lantern, threads to weave).",
   "💡 Short explanation the first time you open each system.",
   "🎁 Daily gift (7-day streak) and weekly gift."
  ]
 },
 {
  "v": "5.57",
  "b": 178,
  "d": "2026-11-20",
  "es": [
   "⚡ Despertar Dorado guardado en 🌀 Transformaciones (próximamente): Fase 1 · Despertar (pelo dorado y erizado), Fase 2 · Chispa del Hilo (puntas altas, aura dorada con hilos de luz y chispas) y Fase 3 · Corona de Luz (pelo hasta la cintura y mucha electricidad). Aún no se puede conseguir; sus poderes y su fuerza son un misterio.",
   "🔎 Lupa › Sistemas: entrada del Despertar Dorado."
  ],
  "en": [
   "⚡ Golden Awakening stored in 🌀 Transformations (coming soon): Phase 1 · Awakening (golden spiky hair), Phase 2 · Spark of the Thread (tall spikes, golden aura with threads of light and sparks) and Phase 3 · Crown of Light (waist-long hair and lots of electricity). It cannot be obtained yet; its powers and strength are a mystery.",
   "🔎 Magnifier › Systems: Golden Awakening entry."
  ]
 },
 {
  "v": "5.56",
  "b": 177,
  "d": "2026-11-20",
  "es": [
   "🌐 Modos online: 10 modos nuevos repartidos en Competir, Juntos y Visitar y escribir.",
   "🧵 Telar de recuerdos: cada jefe vencido deja un hilo; en el telar de tu casa tejes un tapiz con tu historia, que tus amigos pueden visitar.",
   "🌙 Sueños de cada noche: el Mundo de los Sueños cambia cada noche (al revés, rosa, de estrellas o de papel); tu mascota habla y hay 5 estrellas que recoger.",
   "🌑 Tu sombra ladrona: a veces tu sombra se despega, se lleva oro y huye. Atrápala y te lo devuelve con propina.",
   "🎨 Colores perdidos: cada día el Lienzo en Blanco borra 3 zonas del mundo; repíntalas caminando por ellas. Tinta, la aprendiz de Mael, cambia los pigmentos.",
   "🕰 Recuerdo del Velo: visita Albor recién fundada hace 5.000 años, ayuda a Miren a plantar el primer árbol y aparece el Árbol de los Fundadores en el presente.",
   "🍾 Cartas en botella: tira un mensaje al mar; le llega a otro jugador en una playa y puede contestarte.",
   "🎲 Pueblo del día: un reto distinto cada día en un pueblo (lluvia de monedas, día del baile o día del verso).",
   "🐾 Mascota con oficio: tu mascota aprende el oficio que haces con ella y te ayuda en él.",
   "🏮 Linternas de deseos: cada semana sueltas una linterna; el deseo más pedido se cumple para todos.",
   "🌉 Puentes entre islas: entre todos los jugadores se construyen el Puente de Nhar y el Puente de Brasa.",
   "🏇 Jinetes del correo: relevos de 1 a 4 jugadores de Albor a Puerto Coral, con ranking semanal.",
   "🎭 Teatro en vivo: representa una obra con otros jugadores en el escenario de Albor; el público vota.",
   "🏖 Esculturas de arena en la playa de Puerto Coral, con concurso semanal votado.",
   "🐉 Torneo de dragones: la Carrera de Dragones con ranking semanal online.",
   "🍳 Duelo de cocina contra otro jugador o el chef Bruno, con jurado.",
   "🔎 Lupa › Sistemas: una entrada para cada novedad."
  ],
  "en": [
   "🌐 Online modes: 10 new modes spread over Compete, Together and Visit and write.",
   "🧵 Loom of memories: each defeated boss leaves a thread; on your house loom you weave a tapestry of your story, which your friends can visit.",
   "🌙 A dream every night: the Dream World changes each night (upside-down, pink, starry or paper); your pet talks and there are 5 stars to collect.",
   "🌑 Your thieving shadow: sometimes your shadow comes loose, takes gold and runs away. Catch it and it returns it with a tip.",
   "🎨 Lost colours: every day the Blank Canvas erases 3 zones of the world; repaint them by walking through. Tinta, Mael's apprentice, trades the pigments.",
   "🕰 Veil memory: visit Albor newly founded 5,000 years ago, help Miren plant the first tree and the Founders' Tree appears in the present.",
   "🍾 Messages in a bottle: throw a message into the sea; it washes up for another player, who can reply.",
   "🎲 Town of the day: a different challenge each day in one town (coin rain, dance day or verse day).",
   "🐾 Pet with a job: your pet learns the job you do with it and helps you in it.",
   "🏮 Wish lanterns: each week you release a lantern; the most requested wish comes true for everyone.",
   "🌉 Bridges between islands: all players together build the Nhar Bridge and the Brasa Bridge.",
   "🏇 Relay riders: 1 to 4 player relays from Albor to Puerto Coral, with a weekly ranking.",
   "🎭 Live theatre: perform a play with other players on the Albor stage; the audience votes.",
   "🏖 Sand sculptures on the Puerto Coral beach, with a weekly voted contest.",
   "🐉 Dragon tournament: the Dragon Race with a weekly online ranking.",
   "🍳 Cooking duel against another player or chef Bruno, with a jury.",
   "🔎 Magnifier › Systems: one entry for each new feature."
  ]
 },
 {
  "v": "5.55",
  "b": 176,
  "d": "2026-11-20",
  "es": [
   "🌐 Modos online reunidos en ▦ Atajos › 🌐 en tres grupos (Competir, Juntos, Visitar y escribir), con todos los modos nuevos.",
   "🏳 Conquista de territorios: un estandarte en cada pueblo. Sábados y domingos los gremios lo asaltan (60 s junto al estandarte contra 4 oleadas). El gremio con más puntos es el dueño la semana siguiente: su bandera sale en el mapa y sus miembros cobran el impuesto del mercado cada día.",
   "🐫 Caravanas online: la caravana que escoltas se ve en el online y los jugadores en modo bandido 🏴 pueden asaltarla con ⚔ (si la vacían, se llevan el botín). Los escoltas pueden golpear a los bandidos.",
   "🏮 Festival en vivo cada sábado a las 20:00 de Lima en Asakusa (Japón): torre yagura, gente bailando en corro, fuegos artificiales, Bon Odori con el taiko y concurso de disfraces votado por los jugadores.",
   "🍜 Restaurante compartido en Aldea Albor: ábrelo con hasta 2 socios online, cocina en los fogones y sirve en las mesas; sube a nivel 5 con más mesas y decoración. En equipo, más rápido y +50 % de propinas.",
   "📬 Correo con regalos: cartas, oro y objetos a quien hayas visto online o a tu gremio, aunque no esté conectado. Las trae el Cartero del cielo volando.",
   "🎟 Apuestas en el Coliseo: apuesta Fichas del Coliseo por un jugador que pelea en PvP; si derriba a otro ganas el doble. Mientras apuestas eres espectador.",
   "🐾 Cazar a la presa: un jugador se convierte en la Bestia del Telar y los demás (hasta 8) la cazan con ⚔ durante 150 s.",
   "🚢 Oficio nuevo: Pescador de altura (Capitán Orza, Puerto Coral). Barco con el joystick, red para los bancos de peces y pulso con peces gigantes. 8 peces nuevos.",
   "⛏ Oficio nuevo: Arqueólogo en Chan Chan (Trujillo) y Chichén Itzá (México): pala, pincel y mesa de restauración. 8 piezas para tu museo, que los jugadores online pueden visitar.",
   "🔎 Misterio en el tren nocturno: en el tren bala de noche, busca 3 pistas, interroga a 4 pasajeros y acusa al culpable.",
   "🌸 Estaciones del año: cada estación trae un pez de temporada, un plato y un accesorio (orejeras, sombrilla wagasa, máscara de zorro, orejas de tanuki) en el puesto de Tsubaki, y su paisaje en Japón.",
   "🔎 Lupa › Sistemas: una entrada para cada novedad."
  ],
  "en": [
   "🌐 Online modes gathered in ▦ Shortcuts › 🌐 in three groups (Compete, Together, Visit and write), with all the new modes.",
   "🏳 Territory conquest: a banner in every town. On Saturdays and Sundays guilds assault it (60 s by the banner against 4 waves). The guild with the most points owns it the following week: its flag shows on the map and its members collect the market tax every day.",
   "🐫 Online caravans: the caravan you escort shows online and players in bandit mode 🏴 can raid it with ⚔ (if they empty it, they take the loot). Escorts can hit the bandits.",
   "🏮 Live festival every Saturday at 20:00 Lima time in Asakusa (Japan): yagura tower, people dancing in a ring, fireworks, Bon Odori with the taiko and a costume contest voted by the players.",
   "🍜 Shared restaurant in Albor Village: open it with up to 2 online partners, cook at the stoves and serve at the tables; it reaches level 5 with more tables and decoration. As a team, faster and +50% tips.",
   "📬 Mail with gifts: letters, gold and items to anyone you have seen online or to your guild, even if they are offline. The Sky Courier flies them over.",
   "🎟 Coliseum bets: bet Coliseum tokens on a player fighting in PvP; if they down another you win double. While betting you are a spectator.",
   "🐾 Hunt the prey: one player becomes the Loom Beast and the others (up to 8) hunt it with ⚔ for 150 s.",
   "🚢 New job: Deep-sea fisher (Captain Orza, Puerto Coral). Boat with the joystick, net for the schools of fish and a tug-of-war with giant fish. 8 new fish.",
   "⛏ New job: Archaeologist at Chan Chan (Trujillo) and Chichén Itzá (Mexico): shovel, brush and restoration table. 8 pieces for your museum, which online players can visit.",
   "🔎 Night train mystery: on the bullet train at night, find 3 clues, question 4 passengers and accuse the culprit.",
   "🌸 Seasons of the year: each season brings a seasonal fish, a dish and an accessory (earmuffs, wagasa parasol, fox mask, tanuki ears) at Tsubaki's stall, and its landscape in Japan.",
   "🔎 Magnifier › Systems: one entry for each new feature."
  ]
 },
 {
  "v": "5.54",
  "b": 175,
  "d": "2026-11-19",
  "es": [
   "⭐ La «clase avanzada» pasa a ser el Tercer despertar (nivel 500), después de la Ascensión (190) y la Evolución de clase (240). Tiene nombres nuevos (Guardián del Telar, Tejedor de Runas, Filo Invisible…) y pide la evolución hecha. Se ve en ▦ Atajos › 📚 Pasivas con los tres pasos.",
   "🔎 Lupa › Sistemas ordenada: una entrada para cada novedad (facciones, isla, eclipse, fusiones, árbol, Coloso, carrera, pesca en hielo, cazadores…), con flecha dorada cuando hay un sitio al que ir."
  ],
  "en": [
   "⭐ The «advanced class» becomes the Third awakening (level 500), after the Ascension (190) and the Class evolution (240). It has new names (Loom Guardian, Rune Weaver, Invisible Edge…) and needs the evolution done. Shown in ▦ Shortcuts › 📚 Passives with the three steps.",
   "🔎 Magnifier › Systems tidied: one entry for each new feature (factions, island, eclipse, fusions, tree, Colossus, race, ice fishing, hunters…), with a golden arrow when there is a place to go."
  ]
 },
 {
  "v": "5.53",
  "b": 174,
  "d": "2026-11-19",
  "es": [
   "🌐 Modos online en ▦ Atajos: gremios, guerra de facciones, torneo de formas, Coloso, isla flotante y hermandad de sangre en un solo sitio.",
   "⚔ Guerra de facciones: Vigías del Alba contra Hijos del Lienzo en Blanco. Tus monstruos suman a tu bando y a su región; el mapa se pinta del color de quien domina. El bando ganador de la semana recibe marco, 400.000 de oro y +5 % de experiencia.",
   "🩸 Hermandad de sangre con otro jugador: juntos, +15 % de daño y un ataque doble cada 8 s.",
   "🏝 Isla flotante propia (nivel 200): 5 niveles, cofre diario, y tus amigos online la pueden visitar.",
   "🌑 Eclipse del Telar: algunos días durante una hora todos los monstruos entran en Furia y dan ×2,5 de experiencia, oro y botín.",
   "⭐ Clases avanzadas (nivel 500): cada clase elige una de dos ramas. 📚 Biblioteca del Telar: 24 libros con pasivas para todas las formas (▦ Atajos › 📚 Pasivas).",
   "👪 Herencia de formas: tus hijos heredan tu forma y, al crecer, la fusionan con la suya si forman una fusión.",
   "🐉 Carrera de dragones en Altavela (juez Ignis): 10 anillos en el cielo; bajar de 60 s da el marco «Jinete del cielo»."
  ],
  "en": [
   "🌐 Online modes in ▦ Shortcuts: guilds, faction war, forms tournament, Colossus, floating island and blood brotherhood in one place.",
   "⚔ Faction war: Dawn Watchers vs Children of the Blank Canvas. Your monsters add to your side and their region; the map is painted the colour of whoever dominates. The week's winning side gets a frame, 400,000 gold and +5% experience.",
   "🩸 Blood brotherhood with another player: together, +15% damage and a double attack every 8 s.",
   "🏝 Your own floating island (level 200): 5 levels, daily chest, and your online friends can visit it.",
   "🌑 Loom Eclipse: some days for an hour all monsters enter Fury and give ×2.5 experience, gold and loot.",
   "⭐ Advanced classes (level 500): each class chooses one of two branches. 📚 Loom Library: 24 books with passives for all forms (▦ Shortcuts › 📚 Passives).",
   "👪 Form inheritance: your children inherit your form and, as they grow, fuse it with theirs if they make a fusion.",
   "🐉 Dragon race in Altavela (judge Ignis): 10 rings in the sky; under 60 s gives the «Sky rider» frame."
  ]
 },
 {
  "v": "5.52",
  "b": 173,
  "d": "2026-11-19",
  "es": [
   "🧵 Nueva transformación a la vista en 🌀 Transformaciones: Tejedor Primordial (nivel 1000, aún no se puede conseguir). El cuerpo se vuelve negro como el Lienzo, el pelo es hilo blanco como una nube, sonrisa blanca y la rueca de los Tejedores como escudo."
  ],
  "en": [
   "🧵 New transformation in sight in 🌀 Transformations: Primordial Weaver (level 1000, cannot be obtained yet). The body turns black like the Canvas, the hair is white thread like a cloud, a white grin and the Weavers' spinning wheel as a shield."
  ]
 },
 {
  "v": "5.51",
  "b": 172,
  "d": "2026-11-19",
  "es": [
   "🖌🐉 Fusión Boceto de Fuego (eco + dragón): el dragón dibujado a tinta con llamas. +11 / +25 / +35 / +43 % de ataque (un 1 % más que el Dragón de Hielo), 5 poderes y ataque «Trazo de Fuego».",
   "🪽👻 Fusión Ángel de Niebla (alado + fantasma): alas pálidas, aureola rota y cuerpo de niebla. +10 / +30 / +42 % de ataque y ataque «Diluvio de Plumas».",
   "🌳 Cada fusión tiene su propia maestría (1-12) y su árbol de poderes. Piden las dos formas en maestría 12 y nivel 500, y se ven en el online.",
   "🔥 Furia: los enemigos de nivel 400 o más se transforman al bajar de la mitad de vida (los jefes al 60 %): aura roja, más ataque y defensa.",
   "⚔ Los cazadores de portales se transforman en los duelos: Furia Desatada, Forma Rocosa, Forma Maga, Glacial, Ciclón, Marea, Sombría o Tormenta.",
   "👪 Cada hijo (y nieto, bisnieto…) elige su propia forma al hacerse mayor y se transforma al pelear a tu lado."
  ],
  "en": [
   "🖌🐉 Fire Sketch fusion (echo + dragon): the dragon drawn in ink with flames. +11 / +25 / +35 / +43% attack (1% more than the Ice Dragon), 5 powers and «Fire Stroke» attack.",
   "🪽👻 Mist Angel fusion (winged + ghost): pale wings, a broken halo and a mist body. +10 / +30 / +42% attack and «Feather Deluge» attack.",
   "🌳 Each fusion has its own mastery (1-12) and power tree. They need both forms at mastery 12 and level 500, and they show online.",
   "🔥 Fury: level 400+ enemies transform when below half HP (bosses at 60%): red aura, more attack and defence.",
   "⚔ Portal hunters transform in duels: Unleashed Fury, Rock Form, Mage Form, Glacial, Cyclone, Tide, Shadow or Storm.",
   "👪 Each child (and grandchild, great-grandchild…) chooses their own form when they grow up and transforms when fighting beside you."
  ]
 },
 {
  "v": "5.50",
  "b": 171,
  "d": "2026-11-19",
  "es": [
   "🌳 Árbol de poderes (▦ Atajos › 🌳): cada rango de maestría desde el 3 da un punto. Sube los 3 poderes de cada forma y aprende su poder de ataque con dibujo propio, que salta solo al golpear: Garras de la Luna, Cadenas del Velo, Enjambre de Murciélagos, Aliento de Brasa, Lanza del Alba, Trazo Final, Estacas de Hielo y Aliento Glacial.",
   "🌐 Jefe mundial: el Coloso del Telar aparece sábados y domingos en las Llanuras Doradas. Ranking semanal online de daño (Ulrich, el heraldo); el top 10 gana marco, título «Rompehilos» y 1.000.000 de oro.",
   "🏆 Torneo de transformaciones (🌀 Transformaciones › Torneo de formas): duelos PvP online en los que los dos vais transformados. Temporada mensual; el top 3 gana marco, título y 2.000.000 de oro.",
   "🏚 Sótano en tu casa: taller (banco de trabajo y herrería) y sala de trofeos con cada jefe que has vencido.",
   "🎣 Pesca en el hielo en los Picos Helados: 6 peces nuevos, el Pez Escarcha Dorado es muy raro.",
   "🗺 Diario de viaje (Bitácora › Diario): una postal por país y mundo; al completarlo, título «Trotamundos», marco «Postal» y 1.000.000 de oro. Nuevos sellos de Perú, México y España.",
   "✨ Mascotas: nueva evolución Mítico (vínculo 600) con aura dorada y corona."
  ],
  "en": [
   "🌳 Power tree (▦ Shortcuts › 🌳): each mastery rank from 3 gives a point. Raise each form's 3 powers and learn its attack power with its own drawing, which triggers on hit: Moon Claws, Veil Chains, Bat Swarm, Ember Breath, Dawn Spear, Final Stroke, Ice Stakes and Glacial Breath.",
   "🌐 World boss: the Loom Colossus appears on Saturdays and Sundays in the Golden Plains. Online weekly damage ranking (Ulrich, the herald); the top 10 win a frame, the «Threadbreaker» title and 1,000,000 gold.",
   "🏆 Transformation tournament (🌀 Transformations › Forms tournament): online PvP duels where both of you are transformed. Monthly season; the top 3 win a frame, title and 2,000,000 gold.",
   "🏚 Basement in your house: workshop (workbench and smithing) and a trophy room with every boss you have defeated.",
   "🎣 Ice fishing in the Frozen Peaks: 6 new fish; the Golden Frost Fish is very rare.",
   "🗺 Travel diary (Logbook › Diary): one postcard per country and world; complete it for the «Globetrotter» title, «Postcard» frame and 1,000,000 gold. New stamps for Peru, Mexico and Spain.",
   "✨ Pets: new Mythic evolution (bond 600) with a golden aura and crown."
  ]
 },
 {
  "v": "5.49",
  "b": 170,
  "d": "2026-11-19",
  "es": [
   "🐉❄ Fusión Dragón de Hielo en 🌀 Transformaciones › Fusiones: necesitas el dragón y el Guardián de Hielo en maestría 12 y nivel 500. Mitad +10 %, Híbrida +24 %, 2.0 +34 %, Plena +42 % de ataque: la forma más fuerte. El pelo y el dragón son siempre celestes, uses el pelo que uses.",
   "📈 Maestría hasta el rango 12 y el doble de rápida: 2 puntos por monstruo, 4 por élite y 15 por jefe (150 por rango).",
   "⚡ Cada transformación tiene 3 poderes propios mientras estás transformado (por ejemplo, el lobo: Olfato de presa, Furia de la manada y Regeneración lunar).",
   "★ Cazadores de recompensas también en Lima, Trujillo, México, España y Japón, con carteles propios de cada país. Las marcas se juntan con las de Vera.",
   "🌐 Arreglo: los demás jugadores del online ahora ven tu transformación (antes no se veía).",
   "📖 Nivel 500: nuevo capítulo de las Crónicas del Vínculo, «El hilo que aprende»."
  ],
  "en": [
   "🐉❄ Ice Dragon fusion in 🌀 Transformations › Fusions: you need the dragon and the Ice Guardian at mastery 12 and level 500. Half +10%, Hybrid +24%, 2.0 +34%, Full +42% attack: the strongest form. Hair and dragon are always sky-blue, whatever hair you use.",
   "📈 Mastery up to rank 12 and twice as fast: 2 points per monster, 4 per elite and 15 per boss (150 per rank).",
   "⚡ Every transformation has 3 powers of its own while transformed (e.g. the wolf: Prey scent, Pack fury and Lunar regeneration).",
   "★ Bounty hunters also in Lima, Trujillo, Mexico, Spain and Japan, with each country's own posters. Marks add up with Vera's.",
   "🌐 Fix: other online players now see your transformation (it did not show before).",
   "📖 Level 500: new Chronicles of the Bond chapter, «The thread that learns»."
  ]
 },
 {
  "v": "5.48",
  "b": 169,
  "d": "2026-11-19",
  "es": [
   "🛡 Sede del gremio (Atajos › Gremios › «Ir a la sede»): un salón que decoran todos los miembros, con el estandarte de tu gremio y un tablón con misiones semanales comunes.",
   "⚔ Guerra semanal de gremios: 1 punto por monstruo y 25 por jefe. El gremio ganador de la semana recibe el marco «Gremio campeón», el Estandarte del gremio campeón y 500.000 de oro por miembro.",
   "❄🐉 Monturas nuevas: Lobo de Escarcha (Guardián de Hielo en rango 10) y Draco de Brasa volador (dragón en rango 10).",
   "📷 Oficio nuevo en Machu Picchu: Fotógrafo de fauna. Acércate despacio a los animales y haz la foto con ⚔. Álbum de 10 especies (2 raras); al completarlo, montura Cóndor dorado. Marco, colibrí y título.",
   "🌦 El clima cambia el combate: la nieve refuerza el hielo, el sol el fuego, la tormenta el rayo y la lluvia el agua (+10 % de daño con tu elemento).",
   "★ Cazador de recompensas: Vera (Aldea Albor) cuelga 3 carteles de «se busca» al día. Objetivos élite con flecha roja; marcas de cazador para marco, halcón, sombrero y corcel.",
   "🍲 Cocina en familia: en tu casa, con tu pareja o tus hijos, usa los fogones. Platos más fuertes que la comida normal (30 min)."
  ],
  "en": [
   "🛡 Guild hall (Shortcuts › Guilds › «Go to the hall»): a hall every member decorates, with your guild banner and a board with shared weekly missions.",
   "⚔ Weekly guild war: 1 point per monster and 25 per boss. The week's winning guild gets the «Champion guild» frame, the Champion guild banner and 500,000 gold per member.",
   "❄🐉 New mounts: Frost Wolf (Ice Guardian at rank 10) and flying Ember Drake (dragon at rank 10).",
   "📷 New job in Machu Picchu: Wildlife photographer. Approach animals slowly and take the photo with ⚔. Album of 10 species (2 rare); complete it for the Golden condor mount. Frame, hummingbird and title.",
   "🌦 Weather changes combat: snow strengthens ice, sun fire, storm lightning and rain water (+10% damage with your element).",
   "★ Bounty hunter: Vera (Albor Village) hangs 3 «wanted» posters a day. Elite targets with a red arrow; hunter marks for a frame, falcon, hat and steed.",
   "🍲 Family cooking: at home, with your partner or kids, use the stove. Dishes stronger than normal food (30 min)."
  ]
 },
 {
  "v": "5.47",
  "b": 168,
  "d": "2026-11-19",
  "es": [
   "❄ Transformación nueva: Guardián de Hielo (nivel 450), igual de fuerte que el dragón. Nilo te avisa → Hilde, Vigía del Glaciar (Gruta Congelada, Picos Helados) → 8 Núcleos de Escarcha del Gólem de Escarcha → vence al Rey del Invierno Eterno y trae 20 Hielo Eterno y 5 Cristales Rúnicos → ritual de la escarcha.",
   "❄ Mitad (+6 %) → Forma de Hielo con corona y placas de hielo (+16 %) → Forma de Cristal 2.0 con esquirlas en la espalda (+26 %, rango 5) → Forma plena con escarcha que cae (+32 %). 4 habilidades: Lanzas de Hielo, Ventisca, Deslizamiento Helado y Prisión de Escarcha.",
   "🐺🐉 El pelo, las escamas y los cristales de las transformaciones ahora se ven encima de tu armadura o cosmético: el lobo híbrido lleva melena y mechones sobre la ropa y sus orejas ya no las tapa ningún casco ni sombrero.",
   "🛡 Gremios online en ▦ Atajos: funda uno (nombre, sigla y emblema), busca y únete (hasta 30), chat del gremio, lista de miembros y donaciones para subir de nivel (+1 % de experiencia y oro de monstruos por nivel, hasta 10 %). Tu sigla sale junto a tu nombre en el online. Necesitan internet (wifi o datos)."
  ],
  "en": [
   "❄ New transformation: Ice Guardian (level 450), as strong as the dragon. Nilo alerts you → Hilde, Glacier Watcher (Frozen Grotto, Frozen Peaks) → 8 Frost Cores from the Frost Golem → defeat the Eternal Winter King and bring 20 Eternal Ice and 5 Rune Crystals → frost ritual.",
   "❄ Half (+6%) → Ice Form with crown and ice plates (+16%) → Crystal Form 2.0 with shards on the back (+26%, rank 5) → Full form with falling frost (+32%). 4 skills: Ice Lances, Blizzard, Ice Slide and Frost Prison.",
   "🐺🐉 Transformation fur, scales and crystals now show over your armour or cosmetic: the hybrid wolf has a mane and tufts over the clothes and no helmet or hat covers its ears anymore.",
   "🛡 Online guilds in ▦ Shortcuts: found one (name, tag and emblem), search and join (up to 30), guild chat, member list and donations to level up (+1% monster experience and gold per level, up to 10%). Your tag shows next to your name online. They need internet (wifi or data)."
  ]
 },
 {
  "v": "5.46",
  "b": 167,
  "d": "2026-11-19",
  "es": [
   "🐎 Oficio nuevo en Trujillo: Domador de caballos de paso. Entra al corral, acércate al potrillo y sigue sus señales ◀ ▶ para ganarte su confianza; doma 3 antes de que acabe el tiempo.",
   "✉ Oficio nuevo en Celestia (Isla del Alba): Cartero del cielo. Métete en la corriente de viento del color de la carta, vuela sobre el vacío recogiendo plumas (propina), entrega con ⚔ en el buzón y vuelve por la corriente blanca.",
   "🎁 Recompensas nuevas: marcos Marinera y Correo celeste, mascotas Potrillo de paso y Nube mensajera, y los títulos Domador de Oro y Mensajero de las Nubes (nivel 50). Además +0,1 % de defensa y +0,1 % de crítico."
  ],
  "en": [
   "🐎 New job in Trujillo: Paso horse tamer. Enter the corral, get close to the colt and follow its ◀ ▶ cues to win its trust; tame 3 before time runs out.",
   "✉ New job in Celestia (Isle of Dawn): Sky courier. Step into the wind current of the letter colour, fly over the void collecting feathers (tips), deliver with ⚔ at the mailbox and come back on the white current.",
   "🎁 New rewards: Marinera and Sky mail frames, Paso foal and Messenger cloud pets, and the Golden Tamer and Messenger of the Clouds titles (level 50). Plus +0.1% defence and +0.1% crit."
  ]
 },
 {
  "v": "5.45",
  "b": 166,
  "d": "2026-11-19",
  "es": [
   "🐉 Las escamas del dragón ahora salen encima de tu ropa o armadura, sea cual sea: en la Forma Híbrida en brazos y hombros, y en el Híbrido 2.0 también en el pecho y las piernas, del color de tu pelo."
  ],
  "en": [
   "🐉 Dragon scales now appear over your clothes or armour, whatever you wear: in the Hybrid Form on arms and shoulders, and in Hybrid 2.0 also on the chest and legs, in your hair colour."
  ]
 },
 {
  "v": "5.44",
  "b": 165,
  "d": "2026-11-19",
  "es": [
   "🪽 Transformación Alado Caído (nivel 230): Nilo te avisa → Brisa → 12 Plumas del Alba y 8 Aureolas Rotas → vence a Seraviel → ritual de las plumas. Mitad (aureola rota y alitas) → Forma (alas de plumas, una gris) → Forma plena (alas grandes y plumas que caen).",
   "🖌 Transformación Eco sin Pintar (nivel 360): Nilo te avisa → Mael → 12 Tintas Vivas y 4 Pigmentos Puros → vence al Eco del Vencido → ritual del pincel. Mitad (gotas de tinta) → Forma (piel de boceto) → Forma plena (todo en blanco y negro como un dibujo).",
   "💪 Casi tan fuertes como el dragón (1-2 % menos): Alado +24 % / +30 % de ataque y velocidad; Eco +25 % / +31 % de ataque y esquiva. 4 habilidades propias cada una. Se guardan con tus demás formas; guía e historia en la Lupa › Subrazas."
  ],
  "en": [
   "🪽 Fallen Winged transformation (level 230): Nilo alerts you → Brisa → 12 Dawn Feathers and 8 Broken Halos → defeat Seraviel → feather ritual. Half (broken halo, little wings) → Form (feathered wings, one grey) → Full form (big wings, falling feathers).",
   "🖌 Unpainted Echo transformation (level 360): Nilo alerts you → Mael → 12 Living Inks and 4 Pure Pigments → defeat the Echo of the Vanquished → brush ritual. Half (ink drops) → Form (sketch skin) → Full form (all black and white like a drawing).",
   "💪 Almost as strong as the dragon (1-2% less): Winged +24% / +30% attack and speed; Echo +25% / +31% attack and dodge. 4 skills each. Saved with your other forms; guide and story in Magnifier › Subraces."
  ]
 },
 {
  "v": "5.43",
  "b": 164,
  "d": "2026-11-19",
  "es": [
   "🐙 Oficio nuevo Takoyakero (Dōtonbori, Osaka): plancha de 9 huecos, masa → vuelta → al plato, con clientes que esperan. 🎆 Oficio nuevo Pirotécnico del río (Asakusa): carcasa del color pedido al tubo que brilla, y fuegos en el cielo.",
   "🎁 Los 5 oficios de Japón dan +0,1 % de defensa, +0,1 % de crítico y recompensas: 7 marcos de retrato con diseño (Sakura, Gran Ola, Neón de Tokio, Farolillo rojo, Hanabi, Koi dorado, Dragón de oro), 5 mascotas japonesas (kitsune blanca, grulla, shiba, tanuki, maneki-neko) y 2 monturas (Ciervo de Nara, Kirin dorado).",
   "🌳 Bonsái en casa: pódalo una vez al día; crece y da muebles zen. 🏆 Torneo de pesca en barca en Asakusa contra 3 pescadores.",
   "🎂 Cumpleaños de tus hijos y parejas: aviso, felicitación con tarta y regalos que les encantan. 🐉 Montar en tu dragón: tu pareja e hijos que te acompañan suben a tu lomo."
  ],
  "en": [
   "🐙 New job Takoyaki cook (Dōtonbori, Osaka): 9-hole griddle, batter → flip → plate, with waiting customers. 🎆 New job River fireworks master (Asakusa): shell of the asked colour to the glowing tube, and fireworks in the sky.",
   "🎁 The 5 Japan jobs give +0.1% defense, +0.1% crit and rewards: 7 designed portrait frames (Sakura, Great Wave, Tokyo Neon, Red lantern, Hanabi, Golden koi, Golden dragon), 5 Japanese pets (white kitsune, crane, shiba, tanuki, maneki-neko) and 2 mounts (Nara deer, Golden kirin).",
   "🌳 Bonsai at home: prune it once a day; it grows and gives zen furniture. 🏆 Boat fishing tournament in Asakusa against 3 fishers.",
   "🎂 Birthdays for your kids and partners: a notice, congratulations with cake and gifts they love. 🐉 Dragon riding: your partner and kids who are with you ride on your back."
  ]
 },
 {
  "v": "5.42",
  "b": 163,
  "d": "2026-11-19",
  "es": [
   "🐉 Dragón Híbrido 2.0: escamas en toda la cara (mezcladas con tu piel), el cuerpo y el torso, ojos encendidos, colmillos, cresta de púas y cuernos largos, todo del color de tu pelo. +26 % de ataque (20 % más que la Mitad Dragón), +10 % de vida y +8 % de defensa.",
   "Se desbloquea con la forma de dragón en rango 5 (venciendo enemigos transformado). Toca 🐉: normal → híbrida → híbrido 2.0 → dragón a cuatro patas. Guía en la Lupa › Subrazas y Sistemas."
  ],
  "en": [
   "🐉 Dragon Hybrid 2.0: scales on the whole face (blended with your skin), body and torso, glowing eyes, fangs, a spiked crest and long horns, all in your hair colour. +26% attack (20% more than Half-Dragon), +10% HP and +8% defense.",
   "Unlocks with the dragon form at rank 5 (defeating enemies while transformed). Tap 🐉: normal → hybrid → hybrid 2.0 → four-legged dragon. Guide in Magnifier › Subraces and Systems."
  ]
 },
 {
  "v": "5.41",
  "b": 162,
  "d": "2026-11-19",
  "es": [
   "🌀 Tus formas se guardan: lobo, fantasma, vampiro y dragón que consigas se quedan para siempre. Elige cuál usar en 🌀 Transformaciones; cada una guarda su rango. Corvel te hace el ritual de las que te faltan aunque ya tengas otra. La Poción de Sangre Limpia solo te quita la que llevas.",
   "🐉 Forma Híbrida del dragón: escamas en la piel y alas grandes, +16 % de ataque (10 % más que la Mitad Dragón). Toca 🐉: normal → híbrida → dragón a cuatro patas.",
   "🐺 Arreglado: el lobo a cuatro patas no se veía (se quedaba en híbrido). Ahora se ve, también en el online.",
   "💪 El porcentaje de cada forma es fijo (el dragón siempre +32 %), pero se calcula sobre tus estadísticas: con mejor armadura, espada o nivel, da más fuerza."
  ],
  "en": [
   "🌀 Your forms are saved: every wolf, ghost, vampire and dragon form you get stays forever. Choose which to use in 🌀 Transformations; each keeps its rank. Corvel performs the ritual for the ones you lack even if you already have one. The Clean Blood Potion only removes the one you wear.",
   "🐉 Dragon Hybrid Form: scales on the skin and big wings, +16% attack (10% more than Half-Dragon). Tap 🐉: normal → hybrid → four-legged dragon.",
   "🐺 Fixed: the four-legged wolf did not show (it stayed hybrid). Now it shows, online too.",
   "💪 Each form's percentage is fixed (the dragon always +32%), but it is calculated on your stats: with better armour, sword or level, it gives more strength."
  ]
 },
 {
  "v": "5.40",
  "b": 161,
  "d": "2026-11-19",
  "es": [
   "🐉 Misión de la Mitad Dragón (nivel 450): Nilo te avisa en Albor → «Una brasa que no se apaga» (habla con Corvel) → «Las brasas de Ignaroth» (8 brasas) → «Escamas para el hilo» (20 Escamas de Dragón y 5 Cristales Rúnicos) → ritual de la brasa con Corvel.",
   "🐺 Lupa › Subrazas: cada transformación con «Cómo conseguirla» (pasos marcados ✅), la ofrenda y dónde sale, «Por qué (historia)» y «Cómo suma».",
   "💪 Las transformaciones se suman encima de tu nivel, armadura, armas y accesorios: cuanto más fuerte seas, más dan."
  ],
  "en": [
   "🐉 Half-Dragon quest (level 450): Nilo alerts you in Albor → «An ember that will not go out» (talk to Corvel) → «Ignaroth's embers» (8 embers) → «Scales for the thread» (20 Dragon Scales and 5 Rune Crystals) → ember ritual with Corvel.",
   "🐺 Magnifier › Subraces: each transformation with «How to get it» (steps ticked ✅), the offering and where it drops, «Why (story)» and «How it adds up».",
   "💪 Transformations add on top of your level, armour, weapons and accessories: the stronger you are, the more they give."
  ]
 },
 {
  "v": "5.39",
  "b": 160,
  "d": "2026-11-19",
  "es": [
   "🐉 Transformación nueva: Mitad Dragón (bloqueada hasta el nivel 450). Ritual con Corvel: 8 Brasas de Ignaroth (las suelta Ignaroth, el Dragón Carmesí) + 200.000 de oro.",
   "Mitad Dragón (siempre): cuernos, escamas, ojos dorados, alas pequeñas y cola, todo del color de tu pelo. +6 % de ataque, +6 % de vida, +3 % de crítico.",
   "Forma de Dragón: dragón a cuatro patas con alas de membrana, del color de tu pelo. La más fuerte: +32 % de ataque, +15 % de defensa, +15 % de vida y +12 % de velocidad. Habilidades: Aliento de Brasa, Garras de Dragón, Aleteo y Vuelo de Dragón.",
   "📖 Historia: la brasa de Ignaroth (que fue un Alado) quedó en tu hilo. Explicado en la Lupa › Sistemas."
  ],
  "en": [
   "🐉 New transformation: Half-Dragon (locked until level 450). Ritual with Corvel: 8 Ignaroth's Embers (dropped by Ignaroth, the Crimson Dragon) + 200,000 gold.",
   "Half-Dragon (always): horns, scales, golden eyes, small wings and a tail, all in your hair colour. +6% attack, +6% HP, +3% crit.",
   "Dragon Form: four-legged dragon with membrane wings, in your hair colour. The strongest: +32% attack, +15% defense, +15% HP and +12% speed. Skills: Ember Breath, Dragon Claws, Wing Gust and Dragon Flight.",
   "📖 Story: Ignaroth's ember (he was once a Winged One) stayed in your thread. Explained in Magnifier › Systems."
  ]
 },
 {
  "v": "5.38",
  "b": 159,
  "d": "2026-11-19",
  "es": [
   "👓 Accesorios de cara combinables: lleva uno de cada tipo a la vez (ojos y gafas, nariz, boca/bigotes/barbas, orejas y mejillas). Ponerte uno solo cambia el de su mismo tipo.",
   "🐶 Nuevos (40 en total, con oro): hocico de perrito, nariz de gatito con bigotes, nariz de Pinocho, nariz de cerdito, tirita en la nariz, rubor anime, rasguños de batalla, pintura de guerra, pintura deportiva, corazones bajo los ojos, calcomanías brillantes y tirita en la mejilla.",
   "📡 Rastreador: auricular blanco con botón rojo y lente celeste sobre un ojo (6.000 oro)."
  ],
  "en": [
   "👓 Combinable face accessories: wear one of each type at once (eyes and glasses, nose, mouth/moustaches/beards, ears and cheeks). Putting one on only replaces the one of its type.",
   "🐶 New (40 in total, for gold): puppy snout, kitty nose and whiskers, long wooden nose, piggy nose, nose bandage, anime blush, battle scratches, war paint, eye black, hearts under the eyes, glitter stickers and cheek bandage.",
   "📡 Tracker: white earpiece with a red button and a cyan lens over one eye (6,000 gold)."
  ]
 },
 {
  "v": "5.37",
  "b": 158,
  "d": "2026-11-19",
  "es": [
   "👓 Accesorios de cara (27) en Armario › 👓 Cara o con un sastre: 10 gafas (pasta, aviador, corazón, estrella, media luna, ojo de gato, visor cibernético, 3D, monóculo, antifaz), 6 bigotes y barbas (clásico, enroscado, morsa, perilla, barba de mago, gafas con nariz y bigote), 4 pendientes y piercings y 7 de cara (lunar, pecas, estrellas, parche, mascarilla, nariz de payaso, piruleta).",
   "Tienen su propio hueco: se combinan con cualquier sombrero, casco o peinado, se ven en las 4 estructuras de cuerpo y en el online. Llevar uno da +0,1 % de crítico y +0,1 % de defensa.",
   "🇯🇵 Los oficios de Japón ahora solo dan +0,1 % de defensa (nivel 20) y +0,1 % de crítico (nivel 40), además de la paga."
  ],
  "en": [
   "👓 Face accessories (27) in Wardrobe › 👓 Face or at a tailor: 10 glasses (thick-rim, aviator, heart, star, half-moon, cat-eye, cyber visor, 3D, monocle, masquerade), 6 moustaches and beards (classic, handlebar, walrus, goatee, wizard beard, nose-and-moustache glasses), 4 earrings and piercings and 7 face items (beauty mark, freckles, stars, eye patch, face mask, clown nose, lollipop).",
   "They have their own slot: they go with any hat, helmet or hairstyle, look right on all 4 body types and online. Wearing one gives +0.1% crit and +0.1% defense.",
   "🇯🇵 Japan jobs now only give +0.1% defense (level 20) and +0.1% crit (level 40), plus pay."
  ]
 },
 {
  "v": "5.36",
  "b": 157,
  "d": "2026-11-19",
  "es": [
   "⇅ Inventario: botón «Ordenar» (tipo, valor o nivel) y ☆ Favorito: los objetos con ★ van primero, no se venden con «Vender basura» y no se pueden tirar.",
   "📝 Lista de la compra: en la Lupa › 🎒 Objetos o en el inventario, apunta lo que quieres fabricar; ves cuánto te falta y un globito te avisa cuando lo tienes todo.",
   "🏦 Baúl compartido: en el baúl de tu casa, un baúl de 60 huecos que comparten todos tus héroes.",
   "🇯🇵 Oficios nuevos en Japón, dentro del mapa: 🪷 Jardinero del templo (Kinkaku-ji: rastrilla la arena zen y poda bonsáis), 🛶 Pescador de barca (estanque de Asakusa: rema, pesca en las ondas, lucha con los peces grandes y vende en la lonja) y 🚲 Mensajero en bici (Tokio: reparte 3 paquetes esquivando coches). Salen en el mapa de Japón y en la Lupa; los demás jugadores ven tu barca y tu bici."
  ],
  "en": [
   "⇅ Bag: «Sort» button (type, value or level) and ☆ Favourite: ★ items go first, are not sold with «Sell junk» and can't be dropped.",
   "📝 Shopping list: in Magnifier › 🎒 Items or the bag, note what you want to craft; see what you still need and a bubble tells you when you have it all.",
   "🏦 Shared chest: in your house chest, a 60-slot chest shared by all your heroes.",
   "🇯🇵 New jobs in Japan, played on the map: 🪷 Temple gardener (Kinkaku-ji: rake the zen sand and prune bonsais), 🛶 Boat fisher (Asakusa pond: row, fish the ripples, fight the big ones and sell at the market) and 🚲 Bike courier (Tokyo: deliver 3 parcels dodging cars). They are on the Japan map and in the Magnifier; other players see your boat and bike."
  ]
 },
 {
  "v": "5.35",
  "b": 156,
  "d": "2026-11-19",
  "es": [
   "🔎 Todos los objetos (1768) dicen ya dónde se consiguen: peces (dónde pescar, nivel y caña), peces legendarios (agua, clima y hora), accesorios y fragmentos de cada jefe, platos de la hoguera con sus ingredientes, piezas de construcción con su coste, ropa, cultivos, flores y ramos del vivero, excavación, granja, armas malditas y del Lienzo, anillos de cazador, tiendas del Coliseo, la Torre, Oniria y el Tendero Imposible, fiestas, recompensas de misiones y fenómenos (aurora, lluvia, meteoritos, eclipse, niebla maldita).",
   "📋 En el inventario, debajo de «Para qué sirve», sale «Dónde conseguir» con hasta 6 formas; la Lupa › 🎒 Objetos las muestra todas con flecha dorada."
  ],
  "en": [
   "🔎 Every item (1768) now says where to get it: fish (where to fish, level and rod), legendary fish (water, weather and time), each boss's accessories and fragments, campfire dishes with their ingredients, building pieces with their cost, clothes, crops, nursery flowers and bouquets, digging, farm, cursed and Canvas weapons, hunter rings, Colosseum, Tower, Oniria and Impossible Shopkeeper shops, festivals, quest rewards and phenomena (aurora, rain, meteors, eclipse, cursed fog).",
   "📋 In the bag, under «What it's for», «Where to get it» lists up to 6 ways; Magnifier › 🎒 Items shows them all with the golden arrow."
  ]
 },
 {
  "v": "5.34",
  "b": 155,
  "d": "2026-11-19",
  "es": [
   "📘 «Para qué sirve» ahora también copia lo que explica la Lupa (Sistemas y Oficios) sobre cada objeto: por ejemplo, la Hierba del sueño o el Polvo Arcano dicen lo mismo que su guía.",
   "🔎 En el inventario sale también «Dónde conseguir» y un botón «Ver en la Lupa» que abre la Lupa con ese objeto marcado (con flecha dorada)."
  ],
  "en": [
   "📘 «What it's for» now also copies what the Magnifier (Systems and Jobs) explains about each item: for example, Dream herb or Arcane Dust say the same as their guide.",
   "🔎 The bag also shows «Where to get it» and an «Open in the Magnifier» button that opens it with that item selected (with the golden arrow)."
  ]
 },
 {
  "v": "5.33",
  "b": 154,
  "d": "2026-11-19",
  "es": [
   "📋 Para qué sirve cada objeto: toca cualquier cosa del inventario y al lado salen TODOS sus usos (fabricar en cada oficio, cocinar en la hoguera, alquimia, taller, construir, forja artesanal, maestría, subrazas, conjuros, monturas, misiones que lo piden, museo, acuario, regalos, tu tienda y cuánto vale).",
   "🎒 Lupa › Objetos: nueva pestaña con buscador para todo lo que se puede guardar (materiales, comida, pociones, picos, runas y gemas, piezas de construcción, objetos de misión y equipo), con «Para qué sirve» y «Dónde conseguir» con flecha dorada. ✓ = ya lo tienes.",
   "🔎 En las pestañas Materiales y Equipo de la Lupa también sale para qué sirve. Explicado en Lupa › Sistemas."
  ],
  "en": [
   "📋 What each item is for: tap anything in your bag and ALL its uses appear next to it (crafting in each job, campfire cooking, alchemy, workshop, building, artisan forge, mastery, subraces, spells, mounts, quests that need it, museum, aquarium, gifts, your shop and how much it is worth).",
   "🎒 Magnifier › Items: new tab with a search box for everything you can keep (materials, food, potions, picks, runes and gems, building pieces, quest items and gear), with «What it's for» and «Where to get it» with the golden arrow. ✓ = you have it.",
   "🔎 The Magnifier's Materials and Gear tabs also show what each thing is for. Explained in Magnifier › Systems."
  ]
 },
 {
  "v": "5.32",
  "b": 153,
  "d": "2026-11-19",
  "es": [
   "🎭 Historia nueva «Las caras prestadas» (nivel 345, tras decir el nombre de Velmira): Velmira se queda como luz en el Camposanto del Alba. Devuelve sus 4 máscaras en altares del mundo y di su nombre ante la tumba de Edrin. Premio: Media máscara de Velmira.",
   "☁ Historia nueva «La Escalera de Nubes» (nivel 230): Brisa, arquitecta alada, espera al norte de Albor. Pide los planos a Serafina, canta a 3 nidos de arpía sin pelear y teje 5 tramos que se ven subir al cielo. Al terminar, la escalera te sube a la Isla del Alba. Premio: Diadema de la Canción.",
   "✨ Historia nueva «El eco de Aurel» (nivel 247, tras vencer a Nihil): el Telar recuerda a Aurel antes de su caída. Toca sus 3 recuerdos en las islas del cielo y descubre la frase entera de Nihil y por qué aparecen ecos donde la Ventisca pinta. Premio: Capa de Hilos de Aurel.",
   "🧒 Nilo, joven aprendiz de los Vigías (en Albor, junto a la casa de Mira), te avisa al llegar al nivel de cada historia y te manda al sitio con la flecha dorada. Altares, nidos y recuerdos hechos con los sprites del juego (pedestal de piedra y poste de las aureolas).",
   "📖 3 capítulos nuevos en el Libro del Vínculo (época «Hoy») con cinemáticas propias, pistas y personajes. Guía paso a paso en la Lupa › Sistemas › 📜 Historias."
  ],
  "en": [
   "🎭 New story «The borrowed faces» (level 345, after saying Velmira's name): Velmira stays as light in the Dawn Graveyard. Return his 4 masks at altars around the world and say his name at Edrin's grave. Reward: Velmira's half mask.",
   "☁ New story «The Cloud Stairway» (level 230): Brisa, a winged architect, waits north of Albor. Get the plans from Serafina, sing to 3 harpy nests without fighting and weave 5 sections you can see rising to the sky. When finished, the stairway takes you up to the Isle of Dawn. Reward: Diadem of the Song.",
   "✨ New story «The echo of Aurel» (level 247, after defeating Nihil): the Loom remembers Aurel before his fall. Touch his 3 memories on the sky isles and learn Nihil's whole sentence and why echoes appear wherever Ventisca paints. Reward: Aurel's Thread Cape.",
   "🧒 Nilo, a young Watchers apprentice (in Albor, next to Mira's house), alerts you when you reach each story's level and sends you to the place with the golden arrow. Altars, nests and memories built from the game's own sprites (stone pedestal and halo post).",
   "📖 3 new chapters in the Book of the Bond (era «Today») with their own cutscenes, clues and characters. Step-by-step guide in the Magnifier › Systems › 📜 Stories."
  ]
 },
 {
  "v": "5.31",
  "b": 152,
  "d": "2026-11-19",
  "es": [
   "🛠 Arreglado: al usar Avatar de Guerra (y otras habilidades con pose especial) con el poncho de Cusco, las blusas de marinera o la blusa de Chiapas puestas, tu personaje se volvía invisible y salía la barra roja.",
   "🛡 Si una prenda falla al dibujarse, ahora se salta solo esa prenda: tu personaje nunca vuelve a quedar invisible."
  ],
  "en": [
   "🛠 Fixed: using War Avatar (and other skills with a special pose) while wearing the Cusco poncho, the marinera blouses or the Chiapas blouse made your character invisible and showed the red bar.",
   "🛡 If a garment fails to draw, only that garment is skipped now: your character never turns invisible again."
  ]
 },
 {
  "v": "5.30",
  "b": 151,
  "d": "2026-11-19",
  "es": [
   "🛡 El juego ya no se congela si algo falla: se salta ese fotograma y sigue. La barra roja ahora dice dónde fue el error, para poder arreglarlo.",
   "🚐 Cobrador de combi nuevo: 12 paraderos y unos 5.000 de oro. Afuera vas en la puerta y gritas «¡Sube, sube!» en los paraderos; con ⚔ entras a la combi y cobras asiento por asiento (te hablan: «busco sencillo…», «¿pasa por San Martín?»). En la puerta, ⚔ te saca otra vez. ¡Que nadie se baje sin pagar!",
   "🛺 Mototaxi y vocho taxi: el cliente te habla durante el viaje y le respondes. Una buena respuesta te da propina.",
   "🦙 Arriero de llamas más claro: banderas rojas numeradas en el camino, tus llamas van atadas con una cuerda, se cansan más despacio y el aviso dice qué hacer.",
   "⭐ Los oficios de los países suben el doble de rápido (×6 de experiencia)."
  ],
  "en": [
   "🛡 The game no longer freezes if something fails: it skips that frame and keeps going. The red bar now says where the error happened, so it can be fixed.",
   "🚐 New combi fare collector: 12 stops and about 5,000 gold. Outside you ride the door and shout «Get on, get on!» at the stops; with ⚔ you go into the combi and charge seat by seat (they talk to you: «looking for change…», «do you go by San Martín?»). At the door, ⚔ takes you back out. Don't let anyone get off without paying!",
   "🛺 Mototaxi and Beetle taxi: the customer talks to you during the ride and you answer. A good answer earns a tip.",
   "🦙 Clearer llama muleteer: numbered red flags on the path, your llamas are tied with a rope, they tire more slowly and the hint says what to do.",
   "⭐ Country jobs level up twice as fast (×6 experience)."
  ]
 },
 {
  "v": "5.29",
  "b": 150,
  "d": "2026-11-18",
  "es": [
   "🦙 ¡Cusco! Llegas en el Tren Andino desde Trujillo (Lima → bus a Trujillo → tren a Cusco). Plaza de Armas con la Catedral, la Compañía, la fuente del Inca y los portales; San Blas con sus puertas azules; la piedra de los 12 ángulos; Qorikancha; Mercado de San Pedro; Sacsayhuamán y el Cristo Blanco.",
   "⛰ Valle Sagrado y más: Pisac con su mercado de tejidos y andenes, Moray con sus andenes circulares, Ollantaytambo y la Montaña de Siete Colores (Vinicunca). Andenes con muros y escaleras de verdad, gente con chullo y montera, y gente que va montada en llama.",
   "🏯 Machu Picchu: tren a Aguas Calientes, camino en zigzag, andenes, casas de piedra con techo de paja, plaza, Templo del Sol, Tres Ventanas, Intihuatana y la escalada al Huayna Picchu entre nubes. Cuidado con el soroche: el mate de coca lo quita.",
   "🧭 Oficios de Cusco que no dan fuerza: guía de Machu Picchu (llevas un grupo y cuentas la historia), arriero de llamas y tintorera de Pisac. Dan ropa andina nueva y ventajas de crítico, esquiva, vida y velocidad.",
   "🧶 Ropa andina nueva para ti y para todos los cuerpos y peinados: chullos, montera, ponchos, lliclla, polleras y chaleco bordado (tienda de San Blas y premios de los oficios).",
   "📜 Historia extra de Perú en el Libro (aparte del lore principal): Cusco, los incas, el Valle Sagrado y Machu Picchu.",
   "🏎 Monturas cada vez más rápidas: llama de Cusco (2,0×) y el Superdeportivo «Toro Bravo» de Madrid (2,4×), el auto más caro. 🐾 Las mascotas de Perú, México y España ahora dan un bono pequeño."
  ],
  "en": [
   "🦙 Cusco! You arrive on the Andean Train from Trujillo (Lima → bus to Trujillo → train to Cusco). Main Square with the Cathedral, the Society of Jesus church, the Inca fountain and the arcades; San Blas with its blue doors; the twelve-angled stone; Qorikancha; San Pedro Market; Sacsayhuamán and the White Christ.",
   "⛰ Sacred Valley and more: Pisac with its textile market and terraces, Moray with its circular terraces, Ollantaytambo and the Rainbow Mountain (Vinicunca). Terraces with real walls and stairs, people in chullos and monteras, and people riding llamas.",
   "🏯 Machu Picchu: train to Aguas Calientes, zigzag path, terraces, stone houses with thatched roofs, plaza, Temple of the Sun, Three Windows, Intihuatana and the climb up Huayna Picchu among the clouds. Beware of altitude sickness: coca tea cures it.",
   "🧭 Cusco jobs that give no strength: Machu Picchu guide (lead a group and tell the story), llama muleteer and Pisac dyer. They give new Andean clothes and crit, dodge, HP and speed perks.",
   "🧶 New Andean clothes for you, fitting every body and hairstyle: chullos, montera, ponchos, lliclla, pollera skirts and an embroidered vest (San Blas shop and job rewards).",
   "📜 Peru extra story in the Book (apart from the main lore): Cusco, the Incas, the Sacred Valley and Machu Picchu.",
   "🏎 Ever faster mounts: Cusco llama (2.0×) and the «Toro Bravo» supercar in Madrid (2.4×), the most expensive car. 🐾 Peru, Mexico and Spain pets now give a small bonus."
  ]
 },
 {
  "v": "5.28",
  "b": 149,
  "d": "2026-11-18",
  "es": [
   "🇵🇪 Lima: lustrabotas en la Plaza de Armas (frota con el joystick y pule a tiempo), muralista de Barranco (pinta la pared copiando el boceto), cevichero (cortes al punto y limones exprimidos), cobrador de combi (¡sube, sube! y cobra antes de que se bajen) y lonja de Chorrillos (sube las cajas y subasta). Además, el Puente de los Suspiros: crúzalo sin pararte y pide un deseo.",
   "🏜 Trujillo: restaurador de la Huaca de la Luna (quieto para limpiar, apártate si cruje), chalán de caballo de paso (conos y paso llano), corso de la primavera (flores desde el carro), pesca con red en caballito de totora y gruista del puerto de Salaverry.",
   "🇲🇽 México: clavadista de La Quebrada (escala, salta con la ola y haz piruetas), juego de pelota maya (cadera y aro de piedra), voladores de Papantla (gira el joystick con la cuerda), mariachi en Garibaldi (balcón correcto, ¡ajúa! y monedas) y platero de Taxco (martilla la plata caliente).",
   "🇪🇸 España: castells en Barcelona (equilibra la torre humana), paella gigante en Valencia (ingredientes en orden y despega lo que se pega), vareo de aceitunas en Andalucía, farolero de la Feria de Abril (enciende farolillos y esquiva coches de caballos) y pastor trashumante en Extremadura (lleva el rebaño al corral con tu perro).",
   "💪 Los 20 son oficios: oro, experiencia de oficio ×3 y ventajas pequeñas que suman (+0,1 % de daño, +0,2 % de defensa, vida, crítico, esquiva o velocidad).",
   "🗺 Todo se juega en el mapa, sin ventanas; cada puesto sale en su mapa (Trabajos) y en la Lupa › Sistemas hay una guía por país con flecha. Los demás jugadores ven a qué trabajas."
  ],
  "en": [
   "🇵🇪 Lima: shoeshiner in the Plaza de Armas (rub with the joystick and polish on time), Barranco muralist (paint the wall copying the sketch), ceviche cook (precise cuts and squeezed limes), combi fare collector (get on, get on! and charge before they get off) and the Chorrillos fish market (carry the crates and auction them). Plus the Bridge of Sighs: cross it without stopping and make a wish.",
   "🏜 Trujillo: Huaca de la Luna restorer (keep still to clean, step away if it creaks), Paso horse rider (cones and smooth gait), spring parade (flowers from the float), reed-boat net fishing and Salaverry port crane operator.",
   "🇲🇽 Mexico: La Quebrada cliff diver (climb, jump with the wave and spin), Maya ballgame (hip and stone ring), Papantla flyers (spin the joystick with the rope), Garibaldi mariachi (right balcony, ajúa! and coins) and Taxco silversmith (hammer the hot silver).",
   "🇪🇸 Spain: castells in Barcelona (balance the human tower), giant paella in Valencia (ingredients in order and loosen what sticks), olive harvest in Andalusia, April Fair lamplighter (light lanterns and dodge horse carriages) and transhumant shepherd in Extremadura (take the flock to the pen with your dog).",
   "💪 All 20 are jobs: gold, ×3 job experience and small stacking perks (+0.1% damage, +0.2% defense, HP, crit, dodge or speed).",
   "🗺 Everything is played on the map, no windows; each stall shows on its map (Jobs) and Magnifier › Systems has a guide per country with an arrow. Other players see what job you are doing."
  ]
 },
 {
  "v": "5.27",
  "b": 148,
  "d": "2026-11-18",
  "es": [
   "🚶 Sin tirones al caminar entre la gente de Lima y los países: el limpiador de memoria borraba los dibujos de los peatones que seguían en pantalla y se volvían a crear cada pocos segundos. Ahora además se preparan al entrar al país.",
   "🕯️ Procesión de la Plaza de Armas: los devotos ya no llenan la pantalla de carteles; su nombre sale al acercarte.",
   "🏷️ Entre la multitud, los nombres de los NPCs cercanos ya no se montan unos sobre otros.",
   "📈 Medido en un celular lento simulado tras 1 minuto en la Plaza de Armas: unas 45 imágenes por segundo (eran ~15 antes de la 5.26)."
  ],
  "en": [
   "🚶 No more stutter walking through crowds in Lima and the countries: the memory cleaner was deleting pedestrian sprites still on screen and they were rebuilt every few seconds. They are now also prepared when you enter the country.",
   "🕯️ Plaza de Armas procession: the devotees no longer fill the screen with name tags; their name shows when you get close.",
   "🏷️ In crowds, nearby NPC names no longer pile on top of each other.",
   "📈 Measured on a simulated slow phone after 1 minute in the Plaza de Armas: about 45 frames per second (it was ~15 before 5.26)."
  ]
 },
 {
  "v": "5.26",
  "b": 147,
  "d": "2026-11-18",
  "es": [
   "⚡ Arreglado el lag de la Plaza de Armas: el suelo de los escenarios de baile se volvía a dibujar cada vez más veces por fotograma (miles por segundo a los pocos minutos). Pasaba también en Guadalajara y Sevilla.",
   "⚡ Multitudes: con muchos personajes en pantalla, el modo HD ya no borra y vuelve a crear sus dibujos sin parar; los que no caben se dibujan en calidad normal.",
   "📈 En un celular lento la Plaza pasa de ~11–16 fps a ~23–28 fps y ya no empeora con el tiempo."
  ],
  "en": [
   "⚡ Fixed lag at Lima's Plaza de Armas: the dance stage floor was being redrawn more and more times per frame (thousands per second after a few minutes). It also happened in Guadalajara and Seville.",
   "⚡ Crowds: with many characters on screen, HD mode no longer deletes and rebuilds their drawings non-stop; the ones that don't fit are drawn in normal quality.",
   "📈 On a slow phone the Plaza goes from ~11–16 fps to ~23–28 fps and no longer gets worse over time."
  ]
 },
 {
  "v": "5.25",
  "b": 146,
  "d": "2026-11-18",
  "es": [
   "🌮 Taquero en el mapa: plancha con 5 estaciones de relleno y un «con todo». Los clientes llegan con su pedido en un globo; toma el relleno con ⚔ y entrégalo antes de que se cansen.",
   "💳 Cajero en el mapa: los productos pasan por la cinta y los escaneas con ⚔ en el lector; luego te pones en la bandeja con el vuelto correcto.",
   "🍅 Tomatina en la calle de Valencia: la gente corre, les lanzas tomates con ⚔ y te los tiran de vuelta. La calle se va manchando de rojo.",
   "⛳ Golf en el campo de El Golf: apunta, mide la fuerza y la bola rueda de verdad; los búnkeres la frenan y si sale del campo es +1 golpe.",
   "🎴 La lotería y la piñata siguen en su ventana."
  ],
  "en": [
   "🌮 Taco cook on the map: a grill with 5 filling stations and a «with everything». Customers arrive with their order in a bubble; grab the filling with ⚔ and hand it over before they get tired.",
   "💳 Cashier on the map: items move along the belt and you scan them with ⚔ at the scanner; then stand on the tray with the right change.",
   "🍅 La Tomatina on a Valencia street: people run around, you throw tomatoes with ⚔ and they throw them back. The street turns red.",
   "⛳ Golf on the El Golf course: aim, judge the power and the ball really rolls; bunkers slow it down and going out of bounds is +1 stroke.",
   "🎴 Lotería and piñata stay in their window."
  ]
 },
 {
  "v": "5.24",
  "b": 145,
  "d": "2026-11-18",
  "es": [
   "🏂 Sandboard de verdad: en la cima del Cerro Carretas te pones la tabla y bajas la duna en el mapa, girando con el joystick entre banderas y piedras.",
   "⚽ Partido real 3 contra 3 en el Gran Estadio de Madrid (2 minutos, con portero): conduce el balón y chuta con ⚔. Habla con el Entrenador.",
   "🏐 Vóley en la plaza de Comas, 3 contra 3: corre hasta la sombra de la pelota para devolverla. Gana el primero en llegar a 7.",
   "💃 Los bailes (Ballet Folklórico, marinera, flamenco y Concurso Nacional) se bailan en la tarima: las flechas caen sobre tu cabeza, sin ventanas.",
   "📈 Los oficios de México, Perú y España dan el triple de experiencia."
  ],
  "en": [
   "🏂 Real sandboarding: at the top of Cerro Carretas you strap on the board and ride down the dune on the map, steering with the joystick between flags and rocks.",
   "⚽ Real 3-a-side match at Madrid's Great Stadium (2 minutes, with goalkeepers): dribble and shoot with ⚔. Talk to the Coach.",
   "🏐 Volleyball on the Comas square, 3-a-side: run to the ball's shadow to return it. First to 7 wins.",
   "💃 The dances (Folk Ballet, marinera, flamenco and the National Contest) are danced on the stage: the arrows fall above your head, with no windows.",
   "📈 Mexico, Peru and Spain jobs give triple experience."
  ]
 },
 {
  "v": "5.23",
  "b": 144,
  "d": "2026-11-18",
  "es": [
   "🐴 Monturas: caballo charro y vocho propio (México), caballo de paso (Lima y Trujillo), caballo andaluz y Vespa (España).",
   "🐾 Mascotas: xoloitzcuintle, chihuahua con sombrerito, ajolote, alpaca, perro peruano sin pelo, cuy con chullo, pelícano, lince ibérico, torito de peluche y gato madrileño.",
   "🇲🇽 Día de Muertos con ofrenda en el Zócalo (de noche se llena de velas) y maquillaje de catrina y catrín; lucha libre en la Arena con 4 máscaras; paseo en trajinera por Xochimilco con mariachi.",
   "🇵🇪 Procesión de octubre en la Plaza de Armas con turrón de doña Pepa; Circuito Mágico del Agua; vóley y pollada bailable en Comas (aprendes cumbia).",
   "🏜 Trujillo: rema en caballito de totora, surf en Huanchaco, Concurso Nacional de Marinera en el Coliseo y el misterio nocturno de Chan Chan.",
   "🇪🇸 Fallas en Valencia, San Fermín con gigantes y cabezudos, cine de verano y verbena con chotis, y el Camino de Santiago con su Compostela.",
   "📔 Tiendas de recuerdos en Japón, México, Lima, Trujillo y España con muebles típicos para tu casa, y un álbum de recuerdos."
  ],
  "en": [
   "🐴 Mounts: charro horse and your own Beetle (Mexico), Paso horse (Lima and Trujillo), Andalusian horse and Vespa (Spain).",
   "🐾 Pets: xoloitzcuintle, chihuahua with a tiny sombrero, axolotl, alpaca, Peruvian hairless dog, guinea pig in a chullo, pelican, Iberian lynx, plush little bull and Madrid cat.",
   "🇲🇽 Day of the Dead altar in the Zócalo (full of candles at night) with catrina and catrín make-up; lucha libre at the Arena with 4 masks; trajinera ride through Xochimilco with mariachi.",
   "🇵🇪 October procession in the Plaza de Armas with Doña Pepa nougat; Magic Water Circuit; volleyball and dance pollada in Comas (learn cumbia).",
   "🏜 Trujillo: paddle a reed boat, surf in Huanchaco, the National Marinera Contest at the Coliseum and the night mystery of Chan Chan.",
   "🇪🇸 Las Fallas in Valencia, San Fermín with giants and big-heads, summer cinema and verbena with chotis, and the Camino de Santiago with its Compostela.",
   "📔 Souvenir shops in Japan, Mexico, Lima, Trujillo and Spain with typical furniture for your house, and a souvenir album."
  ]
 },
 {
  "v": "5.22",
  "b": 143,
  "d": "2026-11-18",
  "es": [
   "🚌 El bus interprovincial tiene icono propio en el mapa (ya no es el del Metropolitano) y un cartel grande «BUS A TRUJILLO» en La Victoria (Lima) y en Plaza Norte (Lima Norte), y «BUS A LIMA» en Trujillo.",
   "➜ En el mapa, toca cualquier lugar de la lista y la flecha dorada te lleva hasta él.",
   "🏠 Si vives en otro país (tienes casa en Japón, Lima, México, España o Trujillo) y sales del juego allí, al volver apareces en tu casa de ese país.",
   "🚇 La trinchera del Metropolitano ya no se puede pisar: ni tú ni los vecinos. Se cruza por los puentes."
  ],
  "en": [
   "🚌 The intercity bus has its own map icon (no longer the Metropolitano one) and a big «BUS TO TRUJILLO» sign in La Victoria (Lima) and Plaza Norte (North Lima), and «BUS TO LIMA» in Trujillo.",
   "➜ On the map, tap any place in the list and the golden arrow takes you there.",
   "🏠 If you live in another country (you own a house in Japan, Lima, Mexico, Spain or Trujillo) and quit the game there, you come back at your house in that country.",
   "🚇 The Metropolitano trench can no longer be walked on, by you or by locals. Cross it over the bridges."
  ]
 },
 {
  "v": "5.21",
  "b": 142,
  "d": "2026-11-18",
  "es": [
   "🏜 ¡Trujillo (La Libertad, Perú)! Mapa más grande que Lima: Plaza de Armas con la catedral amarilla y el Monumento a la Libertad, casonas de colores con rejas, Jirón Pizarro, Huanchaco con su muelle y caballitos de totora, Chan Chan, El Golf, Salaverry con su glorieta y puerto, y las dunas del Cerro Carretas.",
   "🚌 Bus interprovincial (5.000 de oro) desde Lima (La Victoria) y Lima Norte (Plaza Norte): vas sentado y ves el mar y el desierto por la ventana. Trujillo aparece en el mapa de Perú.",
   "🏂 Oficio de sandboard en las dunas de Salaverry y ⛳ golf de 3 hoyos en El Golf (los dos dan sello cultural).",
   "🏠 Ya te puedes mudar: casas en Japón, Lima (Miraflores), Ciudad de México, Madrid y Trujillo. Funcionan como tu casa de siempre.",
   "🎨 Los oficios de los países tienen icono propio (fútbol, baile, carrito, combi, mototaxi, caja, taco, vocho, sandboard) y dicen dónde se trabajan.",
   "⚔ Habilidades revisadas: Lluvia de Runas (mago) y Tormenta de Plumas (arquero) ahora caen 3 y 4 veces como dicen, y la Lluvia del Fénix concentra sus flechas en el objetivo."
  ],
  "en": [
   "🏜 Trujillo (La Libertad, Peru)! A map bigger than Lima: Main Square with the yellow cathedral and the Liberty Monument, colourful mansions with grilles, Jirón Pizarro, Huanchaco with its pier and reed boats, Chan Chan, El Golf, Salaverry with its gazebo and port, and the Cerro Carretas dunes.",
   "🚌 Intercity bus (5,000 gold) from Lima (La Victoria) and North Lima (Plaza Norte): you ride seated and see the sea and the desert through the window. Trujillo appears on the Peru map.",
   "🏂 Sandboarding job on the Salaverry dunes and ⛳ 3-hole golf in El Golf (both give a cultural seal).",
   "🏠 You can now move: houses in Japan, Lima (Miraflores), Mexico City, Madrid and Trujillo. They work like your usual house.",
   "🎨 The country jobs have their own icons (football, dance, cart, minibus, mototaxi, till, taco, Beetle, sandboard) and say where they are worked.",
   "⚔ Skills reviewed: Rune Rain (mage) and Feather Storm (archer) now fall 3 and 4 times as described, and Phoenix Rain focuses its arrows on the target."
  ]
 },
 {
  "v": "5.20",
  "b": 141,
  "d": "2026-11-18",
  "es": [
   "🛡 Seis armaduras nuevas para todas las clases: Heraldo de Castilla (nivel 400), Señor de Sipán (430), Guerrero Inca (440), Guerrero del Sol (460), Guerrero Jaguar (470) y Tercio de Toledo (490).",
   "⛏ Minerales nuevos: Mineral de Inti (vetas del Desierto de las Lomas, Perú), Mineral de Tonatiuh (vetas del Desierto de las Ánimas, México) y Mena de Toledo (vetas de Castilla-La Mancha, España), más el Cordobán del curtidor de Córdoba. Las criaturas de esas zonas también sueltan el mineral.",
   "⚒ Todas las armas y armaduras de la herrería se fabrican sin nivel de Herrería.",
   "👹 Lupa › Enemigos: las criaturas de nivel 410-500 tienen flecha hasta su zona.",
   "🤍 Ropa de marinera con la Profesora Milagros en la Plaza de Armas de Lima: vestido azul bordado, falda roja plisada, vestido celeste con encaje, flores para el moño, terno a rayas y sombrero de paja. Con ella ganas un 50 % más en el concurso. Los bailarines de la tarima ya la llevan.",
   "🔎 Lupa › Sistemas: entradas nuevas de Atajos y mapas, marinera y armaduras de Perú, México y España.",
   "⚖ Equilibrio PvP ajustado a nivel 500."
  ],
  "en": [
   "🛡 Six new armour sets for every class: Herald of Castile (level 400), Lord of Sipán (430), Inca Warrior (440), Sun Warrior (460), Jaguar Warrior (470) and Toledo Tercio (490).",
   "⛏ New ores: Inti Ore (veins in the Desert of the Lomas, Peru), Tonatiuh Ore (veins in the Desert of the Souls, Mexico) and Toledo Ore (veins in Castile-La Mancha, Spain), plus Cordovan from the Córdoba tanner. Creatures in those areas also drop the ore.",
   "⚒ Every weapon and armour at the blacksmith can be made without a Smithing level.",
   "👹 Magnifier › Enemies: level 410-500 creatures have an arrow to their area.",
   "🤍 Marinera clothing from Teacher Milagros in Lima's Plaza de Armas: embroidered blue dress, pleated red skirt, sky-blue lace dress, bun flowers, pinstripe suit and straw hat. It earns 50% more in the contest. The stage dancers now wear it.",
   "🔎 Magnifier › Systems: new entries for Shortcuts and maps, marinera and Peru, Mexico and Spain armour.",
   "⚖ PvP balance adjusted for level 500."
  ]
 },
 {
  "v": "5.19",
  "b": 140,
  "d": "2026-11-18",
  "es": [
   "👗 Trajes Típicos de Doña Chayo en Guadalajara (México): Adelita (blusa blanca con faja, falda negra de cintas y rosa), Jalisco (blusa de cintas y falda de vuelo de colores), Chiapaneca (blusa y falda de flores bordadas y corona de flores), charro (sombrero rojo, sarape y pantalón), zapatos de baile y camiseta de México con el calendario.",
   "💃 Ballet Folklórico en la tarima de Guadalajara con 6 bailarines: nuevo oficio de bailarín folklórico (juego de ritmo, aprendes el Jarabe Tapatío). Con ropa típica ganas un 50 % más.",
   "🎴 Lotería mexicana con Don Chencho en el Zócalo y 🪅 piñata con Doña Mary en Cuernavaca.",
   "🛍 Perú: oficio de vendedor ambulante en Gamarra. Alquila a Doña Rosa un puesto de ropa o un carrito de comida, la gente se acerca a comprarte, regateas el precio y recoges rápido cuando llega el serenazgo.",
   "🤍 Concurso de marinera en la Plaza de Armas de Lima (aprendes la Marinera).",
   "👏 España: tablao flamenco en la Plaza de España de Sevilla (aprendes el Flamenco y hay traje de flamenca a la venta) y 🍅 la Tomatina en Valencia.",
   "⚔ Sellos culturales: la primera vez que trabajas en un oficio de México, Perú o España o ganas uno de sus eventos, +0,5 % de daño para siempre (13 sellos, hasta +6,5 %). No cuenta en duelos. Míralos en la Lupa › Sistemas › Fiestas y trabajos."
  ],
  "en": [
   "👗 Doña Chayo's Folk Costumes in Guadalajara (Mexico): Adelita (white blouse with sash, black ribbon skirt and a rose), Jalisco (ribbon blouse and colourful full skirt), Chiapaneca (embroidered flower blouse and skirt with a flower crown), charro (red sombrero, sarape and trousers), dance shoes and a Mexico shirt with the calendar.",
   "💃 Folk Ballet on the Guadalajara stage with 6 dancers: new folk dancer job (rhythm game, you learn the Jarabe Tapatío). In traditional clothing you earn 50% more.",
   "🎴 Mexican lotería with Don Chencho in the Zócalo and 🪅 a piñata with Doña Mary in Cuernavaca.",
   "🛍 Peru: street vendor job in Gamarra. Rent a clothes stall or food cart from Doña Rosa, people come to buy, you haggle and pack up fast when the inspectors arrive.",
   "🤍 Marinera contest in Lima's Plaza de Armas (you learn the Marinera).",
   "👏 Spain: flamenco tablao in Seville's Plaza de España (you learn Flamenco and a flamenca dress is on sale) and 🍅 La Tomatina in Valencia.",
   "⚔ Cultural seals: the first time you work a job in Mexico, Peru or Spain or win one of their events, +0.5% damage forever (13 seals, up to +6.5%). Not in duels. See them in Magnifier › Systems › Festivals and jobs."
  ]
 },
 {
  "v": "5.18",
  "b": 139,
  "d": "2026-11-18",
  "es": [
   "▦ Botón «Atajos» arriba a la derecha: junta en uno solo Mazmorras, Familia, Montura, Jugadores, Lupa, Libro, Mapa, Menú y demás. Tócalo para abrirlo; brilla si algo dentro tiene aviso.",
   "🌀 Botón «Transformaciones» dentro de Atajos (sustituye al botón de subraza): elige Normal, Forma Híbrida, Lobo a cuatro patas o la forma de tu subraza. Las que no tienes salen bloqueadas 🔒 y dicen cómo conseguirlas.",
   "🗺 México pasa a los mapas principales."
  ],
  "en": [
   "▦ «Shortcuts» button at the top right: Dungeons, Family, Mount, Players, Magnifier, Book, Map, Menu and more are now inside one button. Tap it to open; it glows if something inside needs attention.",
   "🌀 «Transformations» button inside Shortcuts (replaces the subrace button): choose Normal, Hybrid Form, four-legged Wolf or your subrace's form. The ones you don't have are locked 🔒 and say how to get them.",
   "🗺 Mexico is now one of the main maps."
  ]
 },
 {
  "v": "5.17",
  "b": 138,
  "d": "2026-11-18",
  "es": [
   "🗺 Mapa: botón nuevo «Mapas secundarios». Las flechas ahora solo pasan por los 6 mapas principales: Tierras del Vínculo, Japón, Perú, España, Velo Roto y el Archipiélago.",
   "📚 Los otros 15 mapas (Fondo Marino, Nerea, Islas del Cielo, Lima, México y demás) están en «Mapas secundarios». El mismo botón te devuelve a los principales y recuerda el último mapa que viste."
  ],
  "en": [
   "🗺 Map: new «Secondary maps» button. The arrows now only cycle through the 6 main maps: Lands of the Bound, Japan, Peru, Spain, the Broken Veil and the Archipelago.",
   "📚 The other 15 maps (Seabed, Nerea, Sky Isles, Lima, Mexico and more) are under «Secondary maps». The same button takes you back to the main ones and remembers the last map you viewed."
  ]
 },
 {
  "v": "5.16",
  "b": 137,
  "d": "2026-11-18",
  "es": [
   "🇪🇸 ¡España! Billete en Albor, Lima o México (2.000 de oro). Mapa de España con 10 comunidades y un mapa grande más grande que Perú y México. Entre comunidades se viaja en el AVE.",
   "🏛 Madrid: la Cibeles con el Palacio de Comunicaciones y el Banco de España, la Gran Vía con el edificio Metrópolis y su estatua alada. Barcelona: Plaza de España, torres venecianas, fuentes y el Palacio Nacional. Sevilla: Plaza de España con canal, puentes de azulejos y torres.",
   "🏰 También la Giralda, la Alhambra, Santiago, Bilbao, el acueducto de Segovia, el Pilar, Valencia, Mérida, Toledo, los molinos de La Mancha y playas.",
   "⚽ Trabajo de futbolista: tanda de penaltis en el Gran Estadio de Madrid, con su estacionamiento. Camisetas de España y de México. Comida española: paella, tortilla, churros, jamón, gazpacho y más.",
   "🏖 Acapulco crece: bahía con playa dorada, la Costera con palmeras y hoteles altos, cerros verdes, letras de colores, La Roqueta en lancha, Pie de la Cuesta y Puerto Marqués.",
   "🥸 Botarga del Doctor Bonachón: cabezota con gafas y un bigotón. Las 18 criaturas de nivel 410-500 tienen dibujo propio y ahora pegan con toda su fuerza. Iconos propios para la comida de Perú, México, Japón y España."
  ],
  "en": [
   "🇪🇸 Spain! Ticket at Albor, Lima or Mexico (2,000 gold). Map of Spain with 10 regions and a big map larger than Peru and Mexico. Travel between regions on the AVE train.",
   "🏛 Madrid: Cibeles with the Palace of Communications and the Bank of Spain, Gran Vía with the Metrópolis building and its winged statue. Barcelona: Plaza de España, Venetian towers, fountains and the National Palace. Seville: Plaza de España with the canal, tiled bridges and towers.",
   "🏰 Also the Giralda, the Alhambra, Santiago, Bilbao, the Segovia aqueduct, the Pilar, Valencia, Mérida, Toledo, the La Mancha windmills and beaches.",
   "⚽ Footballer job: penalty shoot-out at the Great Stadium of Madrid, with its car park. Spain and Mexico shirts. Spanish food: paella, tortilla, churros, ham, gazpacho and more.",
   "🏖 Acapulco grows: bay with a golden beach, the Costera with palm trees and tall hotels, green hills, colourful letters, La Roqueta by boat, Pie de la Cuesta and Puerto Marqués.",
   "🥸 Doctor Bonachón mascot head: a big head with glasses and a huge moustache. The 18 level 410-500 creatures have their own art and now hit with full strength. Own icons for Peruvian, Mexican, Japanese and Spanish food."
  ]
 },
 {
  "v": "5.15",
  "b": 136,
  "d": "2026-11-18",
  "es": [
   "🇲🇽 ¡México! Billete en Albor o en Lima (1.500 de oro). Mapa de México con 10 estados: toca uno y se abre el mapa grande.",
   "🏛 Ciudad de México: Zócalo con la Catedral, el Palacio Nacional y la bandera gigante, Bellas Artes, Torre Latinoamericana, mariachis y el Paseo de la Reforma con el Ángel.",
   "🌵 Guadalajara y los agaves, Taxco (calles empedradas, Santa Prisca y vochos), Acapulco y La Quebrada, Chichén Itzá, Cancún, Monterrey, Puebla, Veracruz, Cuernavaca, Oaxaca y Chihuahua. Central de Autobuses para ir de un estado a otro.",
   "🌮 Trabajos: taquero y taxista de vocho. Comida mexicana y Farmacias del Doctor Bonachón con su mascota bailando y su disfraz (te pone panzón).",
   "👕 Gamarra: ambulantes de ropa en el suelo y de comida, y la tienda «Ropa Peruana» con la camiseta de Perú (blanca y negra) y el polo «PERÚ».",
   "⚔ Nivel máximo 500: Desierto de las Lomas (Lima Norte, 410-448), Monte Osore (Japón, 420-468) y Desierto de las Ánimas (México, 470-500), con 15 criaturas y 3 jefes."
  ],
  "en": [
   "🇲🇽 Mexico! Ticket at Albor or Lima (1,500 gold). Map of Mexico with 10 states: tap one to open the big map.",
   "🏛 Mexico City: Zócalo with the Cathedral, the National Palace and the giant flag, Bellas Artes, the Latin American Tower, mariachis and Paseo de la Reforma with the Angel.",
   "🌵 Guadalajara and the agave fields, Taxco (cobbled streets, Santa Prisca and Beetle taxis), Acapulco and La Quebrada, Chichén Itzá, Cancún, Monterrey, Puebla, Veracruz, Cuernavaca, Oaxaca and Chihuahua. Bus station to travel between states.",
   "🌮 Jobs: taco cook and Beetle taxi driver. Mexican food and Doctor Bonachón pharmacies with their dancing mascot and his costume (makes you chubby).",
   "👕 Gamarra: street sellers with clothes on the ground and food, and the «Peruvian Clothes» shop with the Peru shirt (white and black) and the «PERÚ» T-shirt.",
   "⚔ Level cap 500: Desert of the Lomas (North Lima, 410-448), Mount Osore (Japan, 420-468) and Desert of the Souls (Mexico, 470-500), with 15 creatures and 3 bosses."
  ]
 },
 {
  "v": "5.14",
  "b": 135,
  "d": "2026-11-18",
  "es": [
   "🏙 Lima crece al este: Gamarra, San Borja, Surquillo con su mercado y Surco con el Óvalo Higuereta.",
   "🚌 Metropolitano: buses articulados por la Vía Expresa. Compra la tarjeta en la estación, sube y viaja por dentro del bus hasta donde quieras.",
   "🚆 Tren Eléctrico (Línea 1) elevado sobre la Av. Aviación, de Cabitos a Grau y hasta Bayóvar.",
   "🧱 Lima Norte nueva: Comas, Independencia, Los Olivos, Carabayllo y San Juan de Lurigancho, con casas de ladrillo, cerros con casitas, mototaxis y las letras de COMAS.",
   "🛒 Supermercados MERCAPLAZA y VERDEMÁS por dentro, Mega Centro, mercados, pollerías, chifas y bodegas con comida nueva.",
   "🚐 Trabajos: chofer de combi (grita «¡sube, sube!» y cobra el pasaje), mototaxista y cajero. Las monturas ya funcionan en Lima y Japón, y el mapa se ve entero."
  ],
  "en": [
   "🏙 Lima grows east: Gamarra, San Borja, Surquillo with its market and Surco with the Higuereta Roundabout.",
   "🚌 Metropolitano: articulated buses along the Vía Expresa. Buy the card at the station, board and ride inside the bus wherever you want.",
   "🚆 Electric Train (Line 1) elevated above Aviación Avenue, from Cabitos to Grau and on to Bayóvar.",
   "🧱 New North Lima: Comas, Independencia, Los Olivos, Carabayllo and San Juan de Lurigancho, with brick houses, hills full of houses, mototaxis and the COMAS letters.",
   "🛒 MERCAPLAZA and VERDEMÁS supermarkets with interiors, Mega Centro, markets, chicken shops, chifas and corner shops with new food.",
   "🚐 Jobs: minibus driver (shout «hop on!» and collect fares), mototaxi driver and cashier. Mounts now work in Lima and Japan, and the map shows whole."
  ]
 },
 {
  "v": "5.13",
  "b": 134,
  "d": "2026-11-18",
  "es": [
   "🇵🇪 ¡Perú! En el Aeródromo de Albor ya se vende el billete a Lima por solo 1.000 de oro (sin nivel mínimo). La vuelta es gratis.",
   "🗺 Mapa nuevo de Perú (tu imagen) con Lima marcada: tócala y se abre el mapa de la ciudad con todos sus lugares.",
   "🏛 Lima, el mapa más grande del juego: Plaza de Armas con la pileta de bronce, palmeras, faroles y palomas; Palacio de Gobierno con cambio de guardia a mediodía; Catedral, Palacio Arzobispal, Municipalidad, portales y balcones de madera; Jirón de la Unión, Plaza San Martín, San Francisco, Cerro San Cristóbal y el Rímac.",
   "🌴 Miraflores: Parque Kennedy con 16 gatos para acariciar, malecón con el Parque del Amor, el faro y el Puente Villena; escaleras a la Costa Verde con playa, tablistas y la Rosa Náutica; parapente sobre el acantilado (300 de oro).",
   "🛍 Larcomar en el acantilado, con terraza al mar y por dentro: comida peruana, café y helados de lúcuma.",
   "👥 Unos 120 limeños y limeñas, señoras y señores andinos con bombín y chullo, guardias, escolares, tablistas y carritos de emoliente, anticuchos, picarones, ceviche, helados y chicha. Autos, taxis y combis. Todo visible en el online."
  ],
  "en": [
   "🇵🇪 Peru! Albor Aerodrome now sells tickets to Lima for only 1,000 gold (no minimum level). The flight back is free.",
   "🗺 New map of Peru (your picture) with Lima marked: tap it to open the city map with all its places.",
   "🏛 Lima, the largest map in the game: Main Square with the bronze fountain, palms, lamps and pigeons; Government Palace with the changing of the guard at noon; Cathedral, Archbishop's Palace, City Hall, arcades and wooden balconies; Jirón de la Unión, San Martín Square, San Francisco, San Cristóbal Hill and the Rímac.",
   "🌴 Miraflores: Kennedy Park with 16 cats to pet, the boardwalk with the Park of Love, the lighthouse and Villena Bridge; stairs down to the Costa Verde with beach, surfers and the Rosa Náutica; paragliding over the cliff (300 gold).",
   "🛍 Larcomar in the cliff, with a sea terrace and an inside: Peruvian food, coffee and lúcuma ice cream.",
   "👥 About 120 Lima locals, Andean women and men with bowler hats and chullos, guards, schoolkids, surfers and carts selling emoliente, anticuchos, picarones, ceviche, ice cream and chicha. Cars, taxis and minibuses. All visible online."
  ]
 },
 {
  "v": "5.12",
  "b": 133,
  "d": "2026-11-18",
  "es": [
   "🚄 Japón crece: Bahía del Shinkansen al este y al sur con 6 puentes, y dos trenes bala dando la vuelta a toda la isla.",
   "🚇 13 bocas de metro: baja al andén, espera entre la gente y sube al tren bala (5.000). Dentro paseas por los vagones y te avisa en cada estación.",
   "🚝 Metro elevado sobre Tokio: ves la ciudad desde arriba y el interior del vagón. ✈ El avión ahora es una cabina con pasajeros y azafatas.",
   "🏮 Mercadillo nocturno, cometas, cofres en la niebla, Pez de Crecida, animales domesticables, libro de sellos, acuario y jardín zen en casa.",
   "📦 Oficios: cartero, fotógrafo, florista y restaurante en casa. 👥 Cartas entre jugadores, fiestas en casa, caza del tesoro en grupo y relevos.",
   "📔 Tres historias de vecinos y el misterio del Cáliz de Arxar. Arreglado: el aviso «Siguiente» ya no tapa la Bitácora."
  ],
  "en": [
   "🚄 Japan grows: Shinkansen Bay to the east and south with 6 bridges, and two bullet trains circling the whole island.",
   "🚇 13 metro entrances: go down to the platform, wait among the crowd and board the bullet train (5,000). Inside you walk the carriages and it asks at every station.",
   "🚝 Elevated metro over Tokyo: see the city from above and the inside of the carriage. ✈ The plane is now a cabin with passengers and attendants.",
   "🏮 Night market, kites, fog chests, Flood Fish, tameable animals, stamp book, aquarium and zen garden at home.",
   "📦 Jobs: postal worker, photographer, florist and home restaurant. 👥 Player cards, house parties, group treasure hunt and relays.",
   "📔 Three neighbour stories and the Arxar Chalice mystery. Fixed: the «Next» notice no longer covers the Logbook."
  ]
 },
 {
  "v": "5.11",
  "b": 132,
  "d": "2026-11-17",
  "es": [
   "📖 Bitácora (botón a la izquierda): lo más importante de hoy, 30 logros con títulos, marcos para el retrato y muebles, álbum de fotos en grupo, mascota exploradora y buzón.",
   "📜 Misiones: filtros Historia/Secundarias/Trabajo/Hechas, grupos plegables, «Ir a entregar», disponibles ordenadas por cercanía y historial de lo completado.",
   "🎲 Salón de juegos en los 6 pueblos: cartas coleccionables de enemigos y jefes, concurso de cocina con votos de jugadores, carrera de monturas y pesca por equipos.",
   "🙈 Escondite en Higashiyama, 3 encargos en cadena de oficio, Pez Tormenta, muñecos de nieve y estrellas fugaces en Altavela.",
   "🏠 Visita la casa de otros jugadores, mándales notas y regalos. 🛒 Tu tienda: precios y clientes que regatean. 🧹 «Vender basura» y botón ↩ de última ventana."
  ],
  "en": [
   "📖 Logbook (button on the left): today’s key info, 30 achievements with titles, portrait frames and furniture, group photo album, exploring pet and mailbox.",
   "📜 Quests: Story/Side/Work/Done filters, foldable groups, «Go turn in», available quests sorted by distance and a history of completed ones.",
   "🎲 Game hall in all 6 towns: collectible enemy and boss cards, cooking contest with player votes, mount race and team fishing.",
   "🙈 Hide-and-seek in Higashiyama, 3 chained job commissions, Storm Fish, snowmen and shooting stars in Altavela.",
   "🏠 Visit other players’ houses, send them notes and gifts. 🛒 Your shop: prices and haggling customers. 🧹 «Sell junk» and ↩ last-window button."
  ]
 },
 {
  "v": "5.10",
  "b": 131,
  "d": "2026-11-17",
  "es": [
   "📜 Misiones ordenadas en tres grupos con su color: Historia (principal), Secundarias y Trabajo (tablón del gremio y encargos de oficio). También en «Disponibles»."
  ],
  "en": [
   "📜 Quests sorted into three colour-coded groups: Story (main), Side and Work (guild board and trade jobs). Also under «Available»."
  ]
 },
 {
  "v": "5.09",
  "b": 130,
  "d": "2026-11-17",
  "es": [
   "💇 Peinado Ado corregido: melena y flequillo propios, cuatro direcciones y anclajes de cabeza en los cinco cuerpos femeninos y cinco masculinos. Sin compresión vertical ni restos del recorte.",
   "🎨 Conserva el tinte original/personalizado, los índices guardados y la apariencia multijugador."
  ],
  "en": [
   "💇 Fixed Ado hairstyle: native layered hair and fringe, four directions and head anchors for all five female and five male bodies. No vertical squeezing or extraction debris.",
   "🎨 Original/custom dye, saved hairstyle indexes and multiplayer appearance preserved."
  ]
 },
 {
  "v": "5.08",
  "b": 129,
  "es": [
   "🎤 Ado llega a STELLA☆LINK, Japón: concierto propio en la sala existente, aspecto detallado y estilo pequeño en el armario de pareja.",
   "💙 Romance, paseos, besos, abrazos, cargar en brazos y familia con Ado. Poses sociales y dibujo HD en brazos también para Miku y Teto.",
   "💇 Peinado de Ado extraído del diseño aprobado: cinco cuerpos por sexo, tinte original/personalizado e hijos que heredan ojos y pelo de sus padres."
  ],
  "en": [
   "🎤 Ado arrives at STELLA☆LINK, Japan: her own show in the existing hall, detailed appearance and small style in the partner wardrobe.",
   "💙 Romance, walks, kisses, hugs, carrying and family with Ado. Social poses and HD carried rendering also for Miku and Teto.",
   "💇 Ado hairstyle extracted from the approved design: five bodies per sex, original/custom dye and children inheriting their parents eyes and hair."
  ]
 },
 {
  "b": 128,
  "v": "5.07",
  "d": "2026-11-17",
  "es": [
   "🗺 Los 11 mapas son ahora bonitos y muestran todo lo que hay: casas, castillos, torres, árboles, lápidas, cristales, corales, relieve, agua, lava y los nombres de las zonas (Velo Roto, Tierras sin Pintar, Altavela…).",
   "📜 Las ventanas ya no vuelven arriba al elegir algo: la Lupa, el inventario, las tiendas y los demás paneles se quedan donde estabas.",
   "✍ Si eres idol, los fans se te acercan en los pueblos y en Japón, te piden autógrafos (+fans), algunos te siguen un rato y se van. Cuanto más famoso, más fans. En el online los demás también los ven."
  ],
  "en": [
   "🗺 All 11 maps now look great and show everything: houses, castles, towers, trees, gravestones, crystals, corals, relief, water, lava and zone names (Broken Veil, Unpainted Lands, Altavela…).",
   "📜 Windows no longer jump back to the top when you pick something: the Magnifier, inventory, shops and other panels stay where you were.",
   "✍ If you are an idol, fans come up to you in towns and in Japan, ask for autographs (+fans), some follow you for a while and leave. The more famous, the more fans. Online, other players see them too."
  ]
 },
 {
  "b": 127,
  "v": "5.06",
  "d": "2026-11-17",
  "es": [
   "🗺 Mapa: ya se puede deslizar hasta todos los bordes (antes se cortaba abajo y a la derecha) y también sin zoom. Nuevos iconos: Gremio de Oficios en los 6 pueblos y Museo de Albor.",
   "🔎 Lupa › Sistemas: arriba del todo, explicado paso a paso con flecha dorada: Gremio, desbloqueos de oficio, granja, tienda en casa, Museo de Albor, caravanas, mercado entre jugadores, torneo, historia de las idols y ropa de oficio.",
   "🔎 Lupa: la pestaña «Poder» ya no desaparece al entrar en Materiales, Equipo, Cosméticos o Jefes."
  ],
  "en": [
   "🗺 Map: you can now drag to every edge (it used to cut off at the bottom and right), even without zoom. New icons: Crafters Guild in all 6 towns and the Albor Museum.",
   "🔎 Magnifier › Systems: at the very top, explained step by step with the golden arrow: Guild, job unlocks, farm, home shop, Albor Museum, caravans, player market, tournament, the idols' story and job clothing.",
   "🔎 Magnifier: the «Power» tab no longer disappears when you open Materials, Gear, Cosmetics or Bosses."
  ]
 },
 {
  "b": 126,
  "v": "5.05",
  "d": "2026-11-17",
  "es": [
   "👕 Las 69 prendas de oficio tienen ahora forma propia y ya no repiten ropa que existía: gorro de trampero, casco con linterna, gorro alto de chef, salacot, máscara con tubo, sombrero cónico, haori con blasones, aletas, geta, sandalias de gladiador y muchas más.",
   "Se adaptan a todas las estructuras de cuerpo, a las 4 direcciones y a la caminata. Si ya tenías alguna, la conservas con su dibujo y nombre nuevos."
  ],
  "en": [
   "👕 All 69 job clothing pieces now have their own shapes and no longer repeat existing clothes: trapper hat, lamp hard hat, tall chef toque, pith helmet, mask and snorkel, conical kasa, crested haori, fins, geta, gladiator sandals and many more.",
   "They fit every body structure, all 4 directions and the walk cycle. If you already had one, you keep it with its new look and name."
  ]
 },
 {
  "b": 125,
  "v": "5.04",
  "d": "2026-11-17",
  "es": [
   "⛏ Oficios más rápidos: del nivel 50 al 75 hace falta la mitad de experiencia, y las 30 primeras acciones de cada oficio al día dan +50 %.",
   "🎁 Los 23 oficios desbloquean algo cada 5 niveles: 114 productos para vender o regalar, 58 muebles y decoraciones, 69 prendas de ropa del oficio, 9 platos de hoguera nuevos (Cocina 55-85) y ventajas de oro y experiencia.",
   "⚔ Cada oficio en nivel 50 da +0,1 % de ataque, como mucho +1 %: ningún oficio es obligatorio.",
   "🏛 Gremio de Oficios en los 6 pueblos: pedidos diarios bien pagados, Taller de oficios, maestrías para todos los oficios (hasta nivel 105), mercado entre jugadores y torneo diario de oficios.",
   "🐔 Granja en casa: gallinero, establo, corral, colmena, perro trufero, estanque e invernadero. Además, tienda propia: los vecinos te compran aunque no estés jugando.",
   "🐫 Caravanas comerciales con el Caravanero, Museo de Albor con 6 colecciones y 7 títulos nuevos.",
   "🎤 Historia de las idols: 3 misiones con cada una de las 13 idols de STELLA☆LINK y PRISM9, con foto firmada y el título «Amigo de las Idols»."
  ],
  "en": [
   "⛏ Faster jobs: levels 50 to 75 need half the experience, and the first 30 actions of each job per day give +50%.",
   "🎁 All 23 jobs unlock something every 5 levels: 114 goods to sell or gift, 58 furniture and decorations, 69 job clothing pieces, 9 new campfire dishes (Cooking 55-85) and gold and XP perks.",
   "⚔ Each job at level 50 gives +0.1% attack, at most +1%: no job is mandatory.",
   "🏛 Crafters Guild in all 6 towns: well-paid daily orders, Crafts workshop, masteries for every job (up to level 105), player market and a daily crafts tournament.",
   "🐔 Home farm: henhouse, stable, sheep pen, beehive, truffle dog, fish pond and greenhouse. Plus your own shop: neighbours buy from you even while you are away.",
   "🐫 Trade caravans with the Caravaneer, the Albor Museum with 6 collections and 7 new titles.",
   "🎤 The idols' story: 3 quests with each of the 13 idols of STELLA☆LINK and PRISM9, with a signed photo and the title «Friend of the Idols»."
  ]
 },
 {
  "b": 124,
  "v": "5.03",
  "d": "2026-11-17",
  "es": [
   "🎨 Iconos de habilidad dibujados de nuevo: espadas, escudos, llamas, copos, flechas, notas, calaveras, guadañas, olas y más, con el color de cada elemento. Ya no salen manchas marrones en el árbol ni en los botones.",
   "✨ Quitado el bloque marrón que tapaba al personaje en Grito, Muro, Avatar, Fortaleza, Égida, Coro y otras: ahora son ondas y contornos brillantes. Los ataques del guerrero pasan de marrón a acero y oro.",
   "🌐 Revisado en multijugador local y online: las 125 armaduras rediseñadas, los 255 cosméticos, los 149 peinados (85 femeninos y 64 masculinos, ninguno borrado) y las 122 habilidades se ven igual en el otro teléfono."
  ],
  "en": [
   "🎨 Skill icons redrawn: swords, shields, flames, snowflakes, arrows, notes, skulls, scythes, waves and more, in each element's colours. No more brown blobs in the tree or the buttons.",
   "✨ Removed the brown block that covered the character in Shout, Wall, Avatar, Fortress, Aegis, Choir and others: now they are waves and glowing outlines. Warrior skills go from brown to steel and gold.",
   "🌐 Checked in local and online multiplayer: the 125 redesigned armours, 255 cosmetics, 149 hairstyles (85 female and 64 male, none removed) and 122 skills look the same on the other phone."
  ]
 },
 {
  "b": 123,
  "v": "5.02",
  "d": "2026-11-17",
  "es": [
   "✨ Las 122 habilidades activas de las siete clases reciben poses y efectos propios, en cuatro direcciones y sobre los cinco cuerpos originales de cada sexo.",
   "🎨 Iconos nuevos para las 146 habilidades, incluidas las 24 pasivas. Los demás jugadores también ven los nuevos ataques.",
   "Se conservan daño, costes, recargas, estados, invocaciones, movimiento y tiempos de golpe. Los nuevos gráficos usan cachés limitadas."
  ],
  "en": [
   "✨ All 122 active skills across seven classes receive their own poses and effects in four directions on the five original bodies of each sex.",
   "🎨 New icons for all 146 skills, including 24 passives. Other players can see the new attacks too.",
   "Damage, costs, cooldowns, statuses, summons, movement and hit timings are preserved. New graphics use bounded caches."
  ]
 },
 {
  "b": 122,
  "v": "5.01",
  "d": "2026-11-17",
  "es": [
   "🛡 Armaduras pulidas en los 30 niveles de equipo: placas, cuero, telas, emblemas y capas propios, sobre los cinco cuerpos masculinos y femeninos originales.",
   "🎨 Iconos nuevos para las 125 piezas en Armaduras del bestiario, inventario, herrería y tiendas, con vista de la pieza equipada en cuatro direcciones.",
   "Se conservan las estadísticas, el progreso, las animaciones y la cobertura del pelo de cada casco."
  ],
  "en": [
   "🛡 Polished armor across all 30 gear tiers: plates, leather, cloth, emblems and capes on the five original male and female bodies.",
   "🎨 New icons for all 125 pieces in the bestiary Armor tab, inventory, smithy and shops, plus a four-direction equipped preview.",
   "Stats, progress, animations and each helmet’s hair coverage are preserved."
  ]
 },
 {
  "b": 121,
  "v": "5.00",
  "d": "2026-11-17",
  "es": [
   "🎨 Los 143 enemigos y jefes aprobados reciben sus dibujos detallados, cuatro vistas, caminata, un ataque animado y VFX separados.",
   "🛡️ Se conservan personajes, NPCs, vida, daño, estadísticas y mecánicas. Excluidos: Slime Verde, Slime Azul, Imitador, Nihil y Lienya. El Reflejo Eclipsado sigue copiando tu aspecto."
  ],
  "en": [
   "🎨 The 143 approved enemies and bosses receive detailed artwork, four views, walking, an animated attack and separate VFX.",
   "🛡️ Player/NPC sprites, health, damage, stats and mechanics are preserved. Green Slime, Blue Slime, Mimic, Nihil and Lienya are excluded. The Eclipsed Reflection still copies your appearance."
  ]
 },
 {
  "b": 120,
  "v": "4.99",
  "d": "2026-11-16",
  "es": [
   "🎨 Rediseño visual de los 119 enemigos y 14 jefes seleccionados del bestiario, con cuatro vistas, caminata, animaciones de ataque y VFX en capa separada.",
   "⚔️ Se conservan vida, daño, estadísticas, alcance, colisiones, IA, botín y cadencias originales. El bestiario muestra los nuevos dibujos con detalle HD."
  ],
  "en": [
   "🎨 Visual redesign of the selected 119 enemies and 14 bosses, with four views, walking, attack animations and separate-layer VFX.",
   "⚔️ Original health, damage, stats, reach, collision, AI, loot and attack timing are preserved. Bestiary portraits use the new HD artwork."
  ]
 },
 {
  "b": 119,
  "v": "4.98",
  "d": "2026-11-16",
  "es": [
   "🥋 Gi naranja sin mangas, emblema y fajín azul: chaqueta, pantalón y pies descalzos para las cinco estructuras femeninas y las cinco masculinas, conservando el busto existente.",
   "📖 Lo vende el tendero de cómics al oeste de Akihabara (Japón) por 24.000 de oro. Las tres piezas van a Vestuario y solo cambian el aspecto."
  ],
  "en": [
   "🥋 Sleeveless orange gi, emblem and blue sash: jacket, trousers and bare feet for all five female and five male structures, preserving existing body shapes.",
   "📖 Sold by the comic shopkeeper in western Akihabara (Japan) for 24,000 gold. All three pieces go to Wardrobe and change appearance only."
  ]
 },
 {
  "b": 118,
  "v": "4.97",
  "d": "2026-11-16",
  "es": [
   "💇 Ocho peinados detallados extraídos de las láminas aprobadas: Zero Two, Kanna, Sailor Moon, Senku, Yuichiro, Frieren, 2B y Lina, con sus accesorios y cuatro vistas. También se incluyen las ocho variantes de la primera muestra.",
   "🎨 Tinte original recupera los colores del diseño; Personalizado utiliza los colores y mechas del estilista. Los accesorios conservan sus colores. Compatible con todas las estructuras de cuerpo."
  ],
  "en": [
   "💇 Eight detailed hairstyles extracted from the approved boards, with accessories and four views: Zero Two, Kanna, Sailor Moon, Senku, Yuichiro, Frieren, 2B and Lina. Includes the eight first-preview variants.",
   "🎨 Original dye restores design colors; Custom uses the stylist colors and highlights. Accessories keep their colors. Supports all body builds."
  ]
 },
 {
  "b": 117,
  "v": "4.96",
  "d": "2026-11-17",
  "es": [
   "🏯 Japón crece hacia el este, al otro lado del río: Takayama, un pueblo de la era Edo (casas de madera con celosías, acequias, linternas, hortensias, sakagura con bola de cedro, mercado de la mañana y puente rojo), e Higashiyama, el Kioto antiguo (una cuesta con terrazas, muros de piedra y escaleras que sube hasta la pagoda, cerezos llorones, sombrillas rojas y casas de té).",
   "👘 54 vecinos nuevos, la mayoría paseando en kimono, y cerezos a los lados de la calle Nakamise de Asakusa.",
   "🛺 Trabajos nuevos (dan oro y objetos, no poder): Conductor de rickshaw (lleva turistas siguiendo la flecha; propina si llegas rápido), Maestro sakero (remueve el arroz en la sakagura), Maestro del té (bate el matcha al ritmo) y Ceramista (centra el barro en el torno). Mercado de la mañana con manzanas, miso y muñecos sarubobo.",
   "🗺 El mapa de Japón (y de los otros mundos) se puede ampliar con + y − y mover con el dedo."
  ],
  "en": [
   "🏯 Japan grows east, across the river: Takayama, an Edo-era town (wooden lattice houses, gutters, lanterns, hydrangeas, cedar-ball sake breweries, a morning market and a red bridge), and Higashiyama, old Kyoto (a slope with terraces, stone walls and stairs climbing to the pagoda, weeping cherries, red parasols and teahouses).",
   "👘 54 new locals, most of them strolling in kimono, and cherry trees along Asakusa's Nakamise street.",
   "🛺 New jobs (gold and items, no power): Rickshaw puller (carry tourists following the arrow; tip if you're quick), Sake brewer (stir the rice at the sakagura), Tea master (whisk matcha to the beat) and Potter (centre the clay on the wheel). Morning market with apples, miso and sarubobo dolls.",
   "🗺 Japan's map (and the other worlds') can be zoomed with + and − and moved with your finger."
  ]
 },
 {
  "b": 116,
  "v": "4.95",
  "d": "2026-11-17",
  "es": [
   "💇 Puntas bicolor: de perfil y de espaldas ahora también se ve el segundo color arriba, como de frente."
  ],
  "en": [
   "💇 Two-tone spikes: from the side and from behind the second colour now shows on top too, like from the front."
  ]
 },
 {
  "b": 115,
  "v": "4.94",
  "d": "2026-11-17",
  "es": [
   "💇 Arreglados los 13 peinados nuevos: de perfil y de espaldas ahora tienen su propia forma (capas, largo, coleta, trenzas, coletas o moño) igual que de frente, en todas las estructuras de chica y chico.",
   "💇 Seis de ellos (Puntas bicolor, Coleta alta rizada, Ondas largas abiertas, Moño lateral y los dos bobs) se cortaban por arriba: ahora caben enteros."
  ],
  "en": [
   "💇 Fixed the 13 new hairstyles: from the side and from behind they now have their own shape (layers, length, ponytail, braids, twintails or bun) matching the front, on every female and male body structure.",
   "💇 Six of them (Two-tone spikes, High curly ponytail, Long open waves, Side bun and both bobs) were cut off at the top: now they fit whole."
  ]
 },
 {
  "b": 114,
  "v": "4.93",
  "d": "2026-11-16",
  "es": [
   "Miku y Teto pueden ser tu pareja, acompañarte y cambiarse de atuendo. Se añadieron 13 peinados recoloreables."
  ],
  "en": [
   "Miku and Teto can become your partner, walk with you, and change outfits. Added 13 recolorable hairstyles."
  ]
 },
 {
  "b": 113,
  "v": "4.92",
  "d": "2026-11-16",
  "es": [
   "Neru pasea por Akihabara y regala su traje. Miku y Teto estrenan trajes de concierto, pasos y retratos. Nuevo peinado recoloreable."
  ],
  "en": [
   "Neru walks around Akihabara and gifts her outfit. Miku and Teto have new concert outfits, moves and portraits. New recolorable hairstyle."
  ]
 },
 {
  "b": 112,
  "v": "4.91",
  "d": "2026-11-16",
  "es": [
   "Compra el traje de Kasane Teto hablando con ella en STELLA☆LINK. El set se guarda en tu Armario y se adapta a todos los cuerpos."
  ],
  "en": [
   "Buy Kasane Teto’s outfit by talking to her at STELLA☆LINK. The set is saved in your Wardrobe and fits every body type."
  ]
 },
 {
  "b": 111,
  "v": "4.90",
  "d": "2026-11-16",
  "es": [
   "Diez criaturas renovadas con cuatro direcciones. Los gólems de Piedra y Escarcha tienen sprites más grandes."
  ],
  "en": [
   "Ten redesigned creatures with four directions. The Stone and Frost Golems have larger sprites."
  ]
 },
 {
  "b": 110,
  "v": "4.89",
  "d": "2026-11-16",
  "es": [
   "Kasane Teto visita STELLA☆LINK. Habla con Akane para ver su concierto con Hatsune Miku."
  ],
  "en": [
   "Kasane Teto visits STELLA☆LINK. Speak to Akane to watch her concert with Hatsune Miku."
  ]
 },
 {
  "b": 109,
  "v": "4.88",
  "d": "2026-11-16",
  "es": [
   "Hatsune Miku visita STELLA☆LINK en Akihabara. Puedes verla caminar y hablar con ella."
  ],
  "en": [
   "Hatsune Miku visits STELLA☆LINK in Akihabara. You can see her walk and talk to her."
  ]
 },
 {
  "b": 108,
  "v": "4.87",
  "d": "2026-11-17",
  "es": [
   "💇 Peinado nuevo para chicas y chicos: Melena de puntas (larga hasta media espalda, mechones en pico, puntas en la coronilla y flequillo desfilado). En el editor y la peluquería, con cualquier color."
  ],
  "en": [
   "💇 New hairstyle for girls and boys: Spiky long mane (down to mid-back, pointed locks, spikes on the crown and a choppy fringe). In the editor and the barber, in any colour."
  ]
 },
 {
  "b": 107,
  "v": "4.86",
  "d": "2026-11-16",
  "es": [
   "💙 Ruri, la novena integrante de PRISM9 (antes PRISM8), con el sprite de tu dibujo: pasea por el Cruce de Shibuya, se puede enamorar (beso y abrazo con su propio sprite) y baila con el grupo en la sala de Akihabara. La estilista Mio vende su Corsé Azul.",
   "💇 Peinado nuevo para chicas: Melena de Ruri. Color de pelo nuevo para chicas y chicos: Turquesa vivo.",
   "📖 Tienda de cómics en Akihabara: 8 mangas que se leen desde la mochila (viñetas con las idols, el héroe, los gatos y la Ventisca) y un dependiente otaku que te cuenta historias y curiosidades del mundo.",
   "🗺 El mapa de las Tierras sin Pintar (Lienzo Blanco) ya sale en el panel del mapa."
  ],
  "en": [
   "💙 Ruri, the ninth member of PRISM9 (formerly PRISM8), with the sprite from your drawing: she hangs around Shibuya Crossing, can be romanced (kiss and hug with her own sprite) and dances with the group at the Akihabara hall. Stylist Mio sells her Blue Corset.",
   "💇 New hairstyle for girls: Ruri's mane. New hair colour for girls and boys: Bright turquoise.",
   "📖 Comic shop in Akihabara: 8 manga you read from your bag (panels with the idols, the hero, the cats and the Ventisca) and an otaku shopkeeper who tells you stories and trivia about the world.",
   "🗺 The Unpainted Lands (White Canvas) map now shows in the map panel."
  ]
 },
 {
  "b": 106,
  "v": "4.85",
  "d": "2026-11-16",
  "es": [
   "💗 Romance con las idols: las 5 de STELLA☆LINK (te esperan en la sala de Akihabara cuando no actúan) y un grupo nuevo, PRISM8, con 8 idols (Kira, Umi, Sena, Hana, Ryo, Mika, Jun y Nene) que pasean por el Cruce de Shibuya. Regalos, citas, pareja, boda e hijos como con cualquier pareja.",
   "🎤 PRISM8 actúa en la sala de Akihabara un concierto sí y otro no, con sus 8 idols bailando en el escenario.",
   "💇 Peinado nuevo: Lobo en capas (melena a capas con flequillo desfilado), el de Kira. También en el editor y la peluquería.",
   "♨ Onsen del Fuji: ryokan al suroeste del lago del Fuji con baño termal (vida y maná al máximo, +8 % de ataque y velocidad), mural del Fuji, leche con café y huevos de onsen.",
   "🐱 Café de gatos en Akihabara: entra, acaricia a los 9 gatos (+5 % de ataque y velocidad) y pide un neko latte.",
   "👘 Tienda de kimonos en Asakusa: 6 kimonos y yukatas con flores, obi, sandalias y horquilla kanzashi.",
   "👗 La estilista Mio vende 9 looks más: los 8 de PRISM8 (corsé vaquero, estrellas de mar, vestido boho, tirantes con shorts, gabardina, chaqueta universitaria, peto vaquero y Y2K) y el Traje de Diva Virtual en turquesa."
  ],
  "en": [
   "💗 Romance with the idols: the 5 of STELLA☆LINK (they wait for you in the Akihabara hall when not performing) and a new group, PRISM8, with 8 idols (Kira, Umi, Sena, Hana, Ryo, Mika, Jun and Nene) who hang around Shibuya Crossing. Gifts, dates, partner, wedding and children like any partner.",
   "🎤 PRISM8 performs at the Akihabara hall every other concert, with its 8 idols dancing on stage.",
   "💇 New hairstyle: Layered wolf cut (Kira's). Also in the editor and the barber.",
   "♨ Fuji Onsen: a ryokan southwest of Fuji's lake with a hot spring bath (full HP and mana, +8% attack and speed), a Fuji mural, coffee milk and onsen eggs.",
   "🐱 Cat café in Akihabara: go in, pet the 9 cats (+5% attack and speed) and order a neko latte.",
   "👘 Kimono shop in Asakusa: 6 kimonos and yukatas with flowers, obi, sandals and a kanzashi hairpin.",
   "👗 Stylist Mio sells 9 more looks: PRISM8's 8 (denim corset, starfish tee, boho dress, tank top with shorts, trench coat, varsity jacket, denim overalls and Y2K) and the Virtual Diva Outfit in turquoise."
  ]
 },
 {
  "b": 105,
  "v": "4.84",
  "d": "2026-11-16",
  "es": [
   "👗 8 trajes de idol nuevos, sacados de tus referencias, que se adaptan a todas las estructuras de cuerpo (chica y chico) y a las 4 direcciones: Uniforme Escolar de Idol, Vestido Blanco de Escenario, Chaqueta Peluda de Pop, Traje de Diva Virtual (en violeta), Top de Estrella Plateada (con horquillas de estrella), Conjunto Rosa Peluche (con calentadores), Armadura de Idol Robot y Vestido Maid de Estrellas.",
   "🛍 Los vende la estilista Mio en la sala STELLA☆LINK de Akihabara (junto a la salida). Cada traje trae parte de arriba, falda y botas, y va directo al armario.",
   "🔎 Lupa › Sistemas: Japón explicado por partes (idols y carrera de idol, Osaka/Okinawa/Nagasaki/Fushimi Inari, rally de sellos, ropa de idol) y una lista con las ideas para las próximas versiones (onsen, café de gatos, tienda de kimonos, historia y romance de las idols)."
  ],
  "en": [
   "👗 8 new idol outfits, made from your references, that fit every body structure (female and male) and all 4 directions: Idol School Uniform, White Stage Dress, Fluffy Pop Jacket, Virtual Diva Outfit (in violet), Silver Star Top (with star hair clips), Pink Fluffy Set (with leg warmers), Robot Idol Armour and Starry Maid Dress.",
   "🛍 Stylist Mio sells them in the STELLA☆LINK hall in Akihabara (by the exit). Each outfit has a top, skirt and boots, and goes straight to your wardrobe.",
   "🔎 Magnifier › Systems: Japan explained in parts (idols and idol career, Osaka/Okinawa/Nagasaki/Fushimi Inari, stamp rally, idol clothes) and a list of ideas for the next versions (onsen, cat café, kimono shop, idol story and romance)."
  ]
 },
 {
  "b": 104,
  "v": "4.83",
  "d": "2026-11-16",
  "es": [
   "🗾 Japón crece hacia el sur: Osaka, Okinawa y Nagasaki nuevas, y el túnel de toriis de Fushimi Inari en Kioto.",
   "🎤 Idols STELLA☆LINK (Hikari, Sora, Mei, Rin y Yuzu) con su sala de conciertos en Akihabara: concierto cada 2 minutos y medio con escenario, luces, pantalla LED y fans con barras de luz. Anima con wotagei (minijuego de ritmo) y gana oro y +5 % de ataque y velocidad.",
   "🌟 Hazte idol: pasa la audición de la productora Akane, da conciertos para ganar fans y oro y sube de rango (Aprendiz → Debut → Idol en ascenso → Idol popular → Top idol → Leyenda de Hoshizora). Títulos nuevos: Idol en Debut, Top Idol y Leyenda de Hoshizora.",
   "🛍 Tienda de recuerdos: cromos de las 5 idols (colección completa = título «Fan número uno»), barra de luz (+10 % en el wotagei), trajes de idol de cada color y botas de plataforma.",
   "🐙 Osaka · Dōtonbori: canal con barcos, puente, carteles gigantes con pulpo, cangrejo y dragón, pantallas, reflejos de neón por la noche, paseo en barco (2.000 oro, +8 % de velocidad) y puestos de takoyaki, okonomiyaki y kushikatsu.",
   "🦈 Okinawa: playa con palmeras, sombrillas, hibiscos y shisas, y el Acuario Churaumi con su tanque gigante, tiburón ballena y mantas (+6 % de ataque y velocidad al contemplarlo). Peluche de tiburón ballena.",
   "🏘 Cuesta de Nagasaki: terrazas con casitas, muros de piedra, escaleras, postes con cables, señales y espejos, hortensias, mirador y puerto con barcos.",
   "⛩ Fushimi Inari: túnel de toriis uno tras otro, zorros de piedra, tablillas ema y omikuji diaria (hasta +10 % de ataque y velocidad).",
   "📮 Rally de 10 sellos por todo Japón (salen en el mapa). Completo: 50.000 de oro, 5 bentōs y el título «Viajero de Japón». 28 vecinos nuevos que hablan en su dialecto."
  ],
  "en": [
   "🗾 Japan grows south: new Osaka, Okinawa and Nagasaki, and the Fushimi Inari torii tunnel in Kyoto.",
   "🎤 STELLA☆LINK idols (Hikari, Sora, Mei, Rin and Yuzu) with their concert hall in Akihabara: a concert every two and a half minutes with stage, lights, LED screen and fans with penlights. Cheer with wotagei (rhythm minigame) for gold and +5% attack and speed.",
   "🌟 Become an idol: pass producer Akane's audition, give concerts to win fans and gold and rank up (Trainee → Debut → Rising idol → Popular idol → Top idol → Hoshizora legend). New titles: Debut Idol, Top Idol and Hoshizora Legend.",
   "🛍 Merch stand: photo cards of the 5 idols (full collection = title «Number one fan»), penlight (+10% wotagei score), idol outfits in each colour and platform boots.",
   "🐙 Osaka · Dotonbori: canal with boats, bridge, giant octopus, crab and dragon signs, screens, neon reflections at night, boat ride (2,000 gold, +8% speed) and takoyaki, okonomiyaki and kushikatsu stalls.",
   "🦈 Okinawa: beach with palm trees, umbrellas, hibiscus and shisa, and the Churaumi Aquarium with its giant tank, whale shark and mantas (+6% attack and speed when you gaze at it). Whale shark plushie.",
   "🏘 Nagasaki Slopes: terraces with little houses, stone walls, stairs, poles with wires, signs and mirrors, hydrangeas, a viewpoint and a harbour with boats.",
   "⛩ Fushimi Inari: a tunnel of torii one after another, stone foxes, ema boards and a daily omikuji (up to +10% attack and speed).",
   "📮 A rally of 10 stamps across Japan (shown on the map). Complete: 50,000 gold, 5 bentos and the title «Japan Traveller». 28 new locals who speak their dialect."
  ]
 },
 {
  "b": 103,
  "v": "4.82",
  "d": "2026-11-16",
  "es": [
   "🌱 Japón con pasto nuevo: tonos que se funden, matas de hierba, tréboles, florecitas de colores, piedrecitas y pétalos caídos bajo los cerezos.",
   "🗾 Mapa de Japón en el panel del mapa (flecha ▶ hasta «Japón»): barrios con su nombre en español y en japonés, tejados de colores, el Fuji nevado, cerezos, templos y leyenda con comida, karaoke y recreativos, monumentos y aeropuerto.",
   "🏙 Calles como Akihabara y Shinjuku: edificios estrechos y altos pegados unos a otros, cada uno con su fachada, carteles verticales que sobresalen y brillan de noche, carteles por piso, aparatos de aire, depósitos en la azotea y tiendas iluminadas en la planta baja.",
   "⚡ Cables de luz entre los postes de todas las aceras de la ciudad.",
   "🏮 Callejones (yokocho) entre los edificios con linternas rojas, máquinas expendedoras, bicis, cubos y cajas. Puestos de takoyaki en Akihabara y de yakitori en Shinjuku (comida que cura).",
   "🚦 Cruce de Shibuya con tres pantallas gigantes de anuncios animados: cuando todos los semáforos se ponen en rojo, la gente cruza a la vez desde las cuatro esquinas, también en diagonal.",
   "🚕 Taxis amarillos y verdes con luz en el techo, más coches y gente paseando por las aceras."
  ],
  "en": [
   "🌱 Japan has new grass: blending tones, grass tufts, clovers, little coloured flowers, pebbles and fallen petals under the cherry trees.",
   "🗾 Japan map in the map panel (arrow ▶ to «Japan»): districts named in English and Japanese, coloured roofs, snowy Fuji, cherry trees, temples and a legend with food, karaoke and arcade, landmarks and airport.",
   "🏙 Streets like Akihabara and Shinjuku: narrow, tall buildings packed together, each with its own facade, vertical signs that stick out and glow at night, signs on every floor, air conditioners, rooftop tanks and lit shops on the ground floor.",
   "⚡ Power lines between the poles on every city pavement.",
   "🏮 Alleys (yokocho) between the buildings with red lanterns, vending machines, bikes, bins and crates. Takoyaki stalls in Akihabara and yakitori stalls in Shinjuku (food that heals).",
   "🚦 Shibuya Crossing with three giant screens of animated adverts: when every light turns red, people cross at once from all four corners, diagonally too.",
   "🚕 Yellow and green taxis with a roof light, more cars and people walking on the pavements."
  ]
 },
 {
  "b": 102,
  "v": "4.81",
  "d": "2026-11-16",
  "es": [
   "🗺 El mapa del principio crece: al sur de Albor hay tierra nueva con el Camposanto del Alba (tributo a los caídos, tumbas y la cuidadora Odila) y el Aeródromo de Albor.",
   "✈ Aeródromo: pista, terminal, torre y hangar con 4 aviones que aterrizan, embarcan y despegan, y pasajeros entrando. Dentro, viajeros de 12 países, café, billete a Japón (nivel 400) y espera en la sala hasta embarcar.",
   "🗾 Japón, el mapa más grande del juego: Monte Fuji con la pagoda y los cerezos, Kioto con el Pabellón Dorado, el sendero de toriis y geishas, Akihabara con carteles de anime, Tokio y su torre, Shinjuku y Kabukichō con neones, Asakusa con la Puerta del Trueno y el aeropuerto. Calles con semáforos y coches, y 78 japoneses (sin nombre: Japonés 1, Japonesa 2…).",
   "🎤 Se puede entrar al karaoke (minijuego de cantar), al ramen, a los recreativos (máquina de peluches y juego de reflejos) y a las konbinis.",
   "👴 Tus hijos, nietos y bisnietos cumplen años, se jubilan a los 65 y mueren de viejos (despacio). Sus tumbas aparecen en el Camposanto. Nuevo 🌳 árbol genealógico en ❤ Familia."
  ],
  "en": [
   "🗺 The starting map grows: south of Albor there is new land with the Dawn Graveyard (tribute to the fallen, graves and Odila the keeper) and the Albor Aerodrome.",
   "✈ Aerodrome: runway, terminal, tower and hangar with 4 planes that land, board and take off, and passengers walking in. Inside, travellers from 12 countries, a café, a ticket to Japan (level 400) and a wait in the lounge until boarding.",
   "🗾 Japan, the largest map in the game: Mount Fuji with the pagoda and cherry trees, Kyoto with the Golden Pavilion, the torii path and geishas, Akihabara with anime billboards, Tokyo and its tower, Shinjuku and Kabukichō with neon, Asakusa with the Thunder Gate and the airport. Streets with traffic lights and cars, and 78 Japanese people (unnamed: Japanese man 1, Japanese woman 2…).",
   "🎤 You can enter the karaoke (singing minigame), the ramen shop, the arcade (claw machine and reflex game) and the konbinis.",
   "👴 Your children, grandchildren and great-grandchildren grow older, retire at 65 and die of old age (slowly). Their graves appear in the Graveyard. New 🌳 family tree in ❤ Family."
  ]
 },
 {
  "b": 101,
  "v": "4.80",
  "d": "2026-11-16",
  "es": [
   "💇 20 peinados anime nuevos sacados de tus láminas. Chica: Lisa con raya, Coleta anime, Lisa tapando un ojo, Rizos con flequillo, Ondas de lado, Dos trenzas, Coletitas bajas, Moño despeinado, Media coleta, Bob en capas, Bob con flequillo recto, Corto rizado, Corto liso, Cuadrado largo delante, Lisa larga con flequillo, Cebollas, Cuadrado ondulado, Coletas largas y Ondas largas anime. Chico: Despeinado anime.",
   "❄ Las nevadas duran mucho menos (de 30 a 75 segundos) y en la nieve de fin de año solo nieva 1 minuto de cada 3, así el frío sube menos."
  ],
  "en": [
   "💇 20 new anime hairstyles taken from your sheets. Female: Straight side part, Anime ponytail, Straight over one eye, Curls with bangs, Side waves, Two braids, Low pigtails, Messy bun, Half-up, Layered bob, Blunt bob, Short curly, Short straight, Angled bob, Long straight with bangs, Space buns, Wavy bob, Long twintails and Long anime waves. Male: Messy anime.",
   "❄ Snowfalls are much shorter (30 to 75 seconds) and during the end-of-year snow it only snows 1 minute out of 3, so you get less cold."
  ]
 },
 {
  "b": 100,
  "v": "4.79",
  "d": "2026-11-16",
  "es": [
   "💇 10 peinados anime nuevos al estilo del pelo de Lienya, por mechones con rizos en espiral, flequillo en punta y brillo. Chica: Rizos de diosa, Seda anime, Coletas taladro, Nube rizada y Cola rizada. Chico: Puntas de héroe, Rizos revueltos, Melena salvaje, Flequillo de príncipe y Lobo rebelde. Se ven en las 8 estructuras de cuerpo, con cualquier color y mechas.",
   "Los peinados emo vuelven a salir en la creación y la peluquería (estaban ocultos por error)."
  ],
  "en": [
   "💇 10 new anime hairstyles in the style of Lienya's hair, drawn lock by lock with spiral curls, pointed fringes and shine. Female: Goddess curls, Anime silk, Drill twintails, Curly cloud and Curly ponytail. Male: Hero spikes, Tousled curls, Wild mane, Prince fringe and Rebel wolf. They fit all 8 body types, with any colour and highlights.",
   "Emo hairstyles show up again in character creation and at the hairdresser (they were hidden by mistake)."
  ]
 },
 {
  "b": 99,
  "v": "4.78",
  "d": "2026-11-16",
  "es": [
   "🌸 Lienya, después de vencerla, usa exactamente el dibujo de Sergio: pelo lila enorme y rizado, cara oscura y vestido, de frente, de perfil y de espaldas."
  ],
  "en": [
   "🌸 After you defeat her, Lienya uses exactly Sergio's drawing: huge curly lilac hair, dark face and dress, from the front, side and back."
  ]
 },
 {
  "b": 98,
  "v": "4.77",
  "d": "2026-11-16",
  "es": [
   "🌸 Lienya, después de vencerla, vuelve a ser un personaje como los del juego, ahora con un pelo nuevo como el de su dibujo: lila, salvaje y rizado, con volumen arriba y mechones que ondean hasta la cintura. Antes de vencerla se ve su dibujo pequeño."
  ],
  "en": [
   "🌸 After you defeat her, Lienya is a game-style character again, now with new hair like her drawing: lilac, wild and curly, with volume on top and locks waving down to her waist. Before you defeat her, her small drawing is shown."
  ]
 },
 {
  "b": 97,
  "v": "4.76",
  "d": "2026-11-16",
  "es": [
   "🌸 Lienya ahora se ve con su propio dibujo también en su forma de persona (cuando te vigila, cuando habla y después de vencerla): pelo salvaje, cara y ojos brillantes."
  ],
  "en": [
   "🌸 Lienya now uses her own drawing in her person form too (when she watches you, talks and after you defeat her): wild hair, face and glowing eyes."
  ]
 },
 {
  "b": 96,
  "v": "4.75",
  "d": "2026-11-15",
  "es": [
   "🌸 Descubrimiento en Las Tierras sin Pintar: Lienya, la Diosa sin Pintar. Al principio solo te vigila desde lejos y desaparece si te acercas.",
   "Después de vencer a El Lienzo en Blanco te espera junto a la puerta de luz: pregúntale quién es y revelará su forma verdadera (con el dibujo de Sergio). Súper jefe de nivel 410, muy difícil, con 5 ataques: Ráfaga del Vacío, Círculo de Olvido, Tentáculos Incoloros, Lluvia Sin Color y Desvanecer.",
   "🎨 Al vencerla te enseña el oficio de Artista: pinta los caballetes del borde para devolverle el color (bonos de ataque, defensa, vida y experiencia).",
   "💕 Se queda junto a Mael y la puedes enamorar y casarte con ella. Capítulo nuevo en el Libro del Vínculo con cinemática, y su guía en la lupa con flecha."
  ],
  "en": [
   "🌸 A discovery in the Unpainted Lands: Lienya, the Unpainted Goddess. At first she only watches you from afar and vanishes if you get close.",
   "After defeating The Blank Canvas she waits by the door of light: ask her who she is and she will reveal her true form (with Sergio's drawing). A very hard level 410 super boss with 5 attacks: Void Burst, Circle of Oblivion, Colourless Tentacles, Colourless Rain and Vanish.",
   "🎨 Once defeated she teaches you the Artist job: paint the border's easels to bring its colour back (attack, defence, HP and experience bonuses).",
   "💕 She stays next to Mael and you can win her heart and marry her. New chapter in the Book of the Bond with a cutscene, and her guide in the magnifier with an arrow."
  ]
 },
 {
  "b": 95,
  "v": "4.74",
  "d": "2026-11-15",
  "es": [
   "💪 Nueva pestaña Poder en la lupa: tu poder ahora y qué te falta (arma, herrería, arma despertada, maestría, clase, subraza, Poder del Velo, Trazos y técnicas), la tabla del poder máximo a nivel 400 por clase y cada forma de ganar poder explicada: equipo, armas ancestrales, herrería, Trazos (límite 50), técnicas de rivales, mentores y academia, anillos, mascotas, comida y familia."
  ],
  "en": [
   "💪 New Power tab in the magnifier: your power now and what you're missing (weapon, blacksmith, awakened weapon, mastery, class, subrace, Veil Power, Strokes and techniques), the level 400 max power table by class and every way to gain power explained: gear, ancestral weapons, blacksmith, Strokes (limit 50), rival, mentor and academy techniques, rings, pets, food and family."
  ]
 },
 {
  "b": 94,
  "v": "4.73",
  "d": "2026-11-15",
  "es": [
   "El número de Poder ahora cuenta los Trazos, las técnicas (amistades, mentores y academia) y las armas ancestrales. Antes daban su bono en combate pero no salían en el Poder."
  ],
  "en": [
   "The Power number now counts Strokes, techniques (friendships, mentors and academy) and ancestral weapons. They already gave their bonus in combat but didn't show in Power."
  ]
 },
 {
  "b": 93,
  "v": "4.72",
  "d": "2026-11-15",
  "es": [
   "🛡 Armaduras de Las Tierras sin Pintar con los conceptos de Sergio (tiers 27-30): abrigo crema y bufanda morada del bardo, túnica con ribetes de oro y colgante del mago, placas de cal agrietadas y capa morada del guerrero, manto de escamas con perla del pez, correas y bufanda del ninja, círculo morado y talismanes del invocador, y túnica crema para el arquero.",
   "Se ajustan a las 8 estructuras de cuerpo (revisión automática sin avisos) y cambian de tono por tier: tiza, trazo, cal y lienzo. Van con la cabeza descubierta, como en los dibujos.",
   "Ya no sale el manto celeste de Celestia con estas armaduras."
  ],
  "en": [
   "🛡 Unpainted Lands armour with Sergio's concepts (tiers 27-30): the bard's cream coat and purple scarf, the mage's gold-trimmed robe and pendant, the warrior's cracked lime plates and purple cape, the fish's scale mantle with a pearl, the ninja's straps and scarf, the summoner's purple circle and talismans, and a cream tunic for the archer.",
   "They fit all 8 body types (automatic check with no warnings) and change tone by tier: chalk, stroke, lime and canvas. Worn bareheaded, like in the drawings.",
   "Celestia's sky-blue mantle no longer appears with this armour."
  ]
 },
 {
  "b": 92,
  "v": "4.71",
  "d": "2026-11-15",
  "es": [
   "🗡 Armas de Las Tierras sin Pintar con el dibujo de Sergio: cinco por clase (laúd-espada, cetro-pincel, espadón del vacío blanco, tridente perlado, katana pálida, bastón de sellos…). Tiers 27 (nivel 360), 28 (372), 29 (384) y 30 (396) en la herrería con Tinta Viva y Pigmento Puro.",
   "✨ El arma del Lienzo Eterno (tier 31, nivel 400): solo la suelta El Lienzo en Blanco.",
   "Armaduras de tiza, trazo, cal y lienzo (27-30). Su aspecto propio, como en los conceptos de Sergio, llega en la próxima versión.",
   "El arquero no salía en la hoja: lleva arcos de tiza en blanco y lila.",
   "Dificultad y PvP medidos de nuevo con el equipo nuevo."
  ],
  "en": [
   "🗡 Unpainted Lands weapons with Sergio's drawing: five per class (lute-sword, brush-sceptre, white void greatsword, pearl trident, pale katana, seal staff…). Tiers 27 (level 360), 28 (372), 29 (384) and 30 (396) at the blacksmith with Living Ink and Pure Pigment.",
   "✨ The Eternal Canvas weapon (tier 31, level 400): only dropped by The Blank Canvas.",
   "Chalk, stroke, lime and canvas armour (27-30). Their own look, like Sergio's concepts, comes in the next version.",
   "The archer wasn't on the sheet: it carries chalk bows in white and lilac.",
   "Difficulty and PvP measured again with the new gear."
  ]
 },
 {
  "b": 91,
  "v": "4.70",
  "d": "2026-11-15",
  "es": [
   "⭐ Nivel máximo 400. Las Tierras sin Pintar ahora van del 300 al 400: Orilla del Boceto, Llanura de los Trazos, Ciénaga de los Borrones, El Marco Roto y El Lienzo en Blanco (385-400).",
   "🖌 Criaturas con el dibujo de Sergio: Babosa Borrada, Lobo Inacabado, Araña de Tiza, Caballero Vacío, Esqueleto Sin Tinta, Gólem de Cal, Espectro del Lienzo, Pez Pálido, Mimo del Silencio y Nihilito.",
   "⚔ Jefes nuevos con su dibujo: Eco del Vencido (310), El Fragmento sin Color (320) y La Sierpe de Tormenta (330), cada uno con su misión de Mael; El Lienzo en Blanco tiene su nuevo aspecto y es de nivel 400.",
   "Lupa › Sistemas › «Las Tierras sin Pintar»: cómo llegar, zonas, criaturas, jefes, misiones y Trazos (ahora desde el nivel 400).",
   "Dificultad medida otra vez: los 72 jefes dentro de su objetivo. Próximamente: las armas y armaduras del Lienzo (tiers 27-30)."
  ],
  "en": [
   "⭐ Max level 400. The Unpainted Lands now go from 300 to 400: Sketch Shore, Plain of Strokes, Swamp of Smudges, The Broken Frame and The Blank Canvas (385-400).",
   "🖌 Creatures with Sergio's drawing: Erased Slug, Unfinished Wolf, Chalk Spider, Hollow Knight, Inkless Skeleton, Lime Golem, Canvas Specter, Pale Fish, Mime of Silence and Little Nihil.",
   "⚔ New bosses with their drawing: Echo of the Vanquished (310), The Colourless Fragment (320) and The Storm Serpent (330), each with a quest from Mael; The Blank Canvas has its new look and is level 400.",
   "Magnifier › Systems › \"The Unpainted Lands\": how to get there, zones, creatures, bosses, quests and Strokes (now from level 400).",
   "Difficulty measured again: all 72 bosses within target. Coming soon: the Canvas weapons and armour (tiers 27-30)."
  ]
 },
 {
  "b": 90,
  "v": "4.69",
  "d": "2026-11-15",
  "es": [
   "🖌 Nuevo continente: Las Tierras sin Pintar (nivel 300-350), el borde del mundo donde la Ventisca todavía no ha pintado. Se entra por el puente blanco al este de Albor después de vencer a la Luna Sonriente; habla con Mael, la Pintora del Borde.",
   "Todo se ve como un boceto sin color sobre un vacío morado, y en el cielo una mano gigante pinta con su pincel. Cada criatura que vences devuelve el color a su zona.",
   "Criaturas esbozadas (slimes a medio pintar, gólems de boceto, esqueletos, lobos de carboncillo, borrones de tinta…), 4 jefes nuevos y el súper jefe El Lienzo en Blanco, con 6 misiones y su capítulo y cinemática en el Libro del Vínculo.",
   "Trazos: al nivel máximo la experiencia sigue sumando (hasta 50 Trazos, +0,4 % de ataque, defensa y vida cada uno). Mael cambia Tinta Viva por Trazos.",
   "Todos los jefes nuevos pasan la medición de dificultad. Explicado en la lupa › Sistemas, con flecha al puente."
  ],
  "en": [
   "🖌 New continent: The Unpainted Lands (level 300-350), the edge of the world where the Ventisca has not painted yet. Enter through the white bridge east of Albor after defeating the Smiling Moon; talk to Mael, the Painter of the Border.",
   "Everything looks like a colourless sketch over a purple void, and in the sky a giant hand paints with its brush. Every creature you defeat gives its zone its colour back.",
   "Sketched creatures (half-painted slimes, sketch golems, skeletons, charcoal wolves, ink smudges…), 4 new bosses and the super boss The Blank Canvas, with 6 quests and its chapter and cutscene in the Book of the Bond.",
   "Strokes: at max level experience keeps adding up (up to 50 Strokes, +0.4% attack, defence and HP each). Mael trades Living Ink for Strokes.",
   "All new bosses pass the difficulty measurement. Explained in the magnifier › Systems, with an arrow to the bridge."
  ]
 },
 {
  "b": 89,
  "v": "4.68",
  "d": "2026-11-15",
  "es": [
   "⚖ Dificultad de los 64 jefes medida y ajustada: antes caían en segundos. Ahora, en solitario y con buen equipo, un jefe de zona dura de 1 a 3 minutos, uno de continente de 3 a 5 y los súper jefes de 6 a 10 (Nihil 9, El Sin Nombre 10).",
   "Con 4 amigos se tarda unos 2/3 de eso y con 2 hijos, un poco menos que solo: siempre se puede pasar solo, con familia o con amigos.",
   "Solo cambia la vida de los jefes; el PvP no se toca."
  ],
  "en": [
   "⚖ The difficulty of all 64 bosses was measured and adjusted: they used to fall in seconds. Now, solo with good gear, a zone boss lasts 1-3 minutes, a continent boss 3-5 and super bosses 6-10 (Nihil 9, the Nameless One 10).",
   "With 4 friends it takes about 2/3 of that and with 2 kids a bit less than solo: it can always be beaten solo, with family or with friends.",
   "Only boss HP changes; PvP is untouched."
  ]
 },
 {
  "b": 88,
  "v": "4.67",
  "d": "2026-11-15",
  "es": [
   "Lupa › Sistemas › «Nihil, el Ente Oscuro»: ahora dice dónde está (Corona del Cielo, en Celestia), el camino de misiones para llegar, cómo vencer cada ataque, sus fases y qué suelta. Con flecha dorada para ir."
  ],
  "en": [
   "Magnifier › Systems › \"Nihil, the Dark Entity\": it now says where it is (Crown of the Sky, in Celestia), the quest path to get there, how to beat each attack, its phases and its drops. With a golden arrow to go there."
  ]
 },
 {
  "b": 87,
  "v": "4.66",
  "d": "2026-11-15",
  "es": [
   "Arreglado el fuego que se quedaba pegado al héroe con la runa de fuego: ahora el aura de la runa solo aparece un instante al golpear a un monstruo, más pequeña y en el arma.",
   "Opciones › «Aura de armas imbuidas» para apagar todas las auras.",
   "En la forja puedes quitar la runa del arma, y tocar otra vez la misma Esencia de imbuir la cancela."
  ],
  "en": [
   "Fixed the fire stuck to the hero with the fire rune: the rune's aura now only flashes for a moment when you hit a monster, smaller and on the weapon.",
   "Options › \"Imbued weapon aura\" to turn all auras off.",
   "At the forge you can remove the weapon's rune, and tapping the same Imbue essence again cancels it."
  ]
 },
 {
  "b": 86,
  "v": "4.65",
  "d": "2026-11-15",
  "es": [
   "⚠ Nihil renovado con tu dibujo: flota, se ve en las 4 direcciones y tiene 6 ataques nuevos con sus sprites (Orbe Umbrío, Garra del Vacío, Pilar Oscuro, Lluvia de Cristales, Nova Nihil y Prisión Sombría). Todo se avisa en el suelo; al 60 % llama sombras y al 25 % combina ataques. Solo aparece en la Corona del Cielo.",
   "🔥 Armas imbuidas: fuego, hielo, rayo y agua se ven en tu arma (con tu dibujo) al usar habilidades de ese elemento, con runas o con las nuevas Esencias de imbuir (5 min).",
   "⚔ Maestría de armas mucho más rápida (sube más con enemigos de nivel alto) y el arma despierta antes.",
   "🧪 Las pociones curativas esperan 8 s entre una y otra; el botón muestra la cuenta atrás.",
   "🏛 Museo de aventuras: trofeos de los 64 jefes con su dibujo, hallazgos arqueológicos, medallas de festivales y tus primeras armas. Los aldeanos lo visitan y lo comentan.",
   "🏠 Casa útil: vitrina, pedestal, taller del artesano, biblioteca, sótano secreto (40 huecos), cama de invitados, macetero mágico, mesa de alquimia y decoración nueva.",
   "🌙 Jardinería mágica: 6 plantas que crecen con su clima (la Flor Lunar brilla de noche) y elixires de alquimia.",
   "🤝 Amistades, rivales y mentores: charla cada día, duelos de rivales y técnicas que te enseñan.",
   "🎉 Festivales cada 3 días: concurso musical, cocina, baile, carrera y apuestas de caracoles.",
   "🗡 Armas ancestrales con historia: despiertan restaurando su santuario, hablando con quien conoció a su portador y venciendo a su creador.",
   "📜 Crónicas del mundo en el Libro del Vínculo: jefes, pueblos, familia, descubrimientos, decisiones y secretos sin resolver. 📝 Examen de la Academia con técnica exclusiva.",
   "Más de 120 objetos nuevos con sprite. Todo explicado en la lupa › Sistemas."
  ],
  "en": [
   "⚠ Nihil remade with your drawing: it floats, shows in all 4 directions and has 6 new attacks with their sprites (Umbral Orb, Void Claw, Dark Pillar, Crystal Rain, Nihil Nova and Shadow Prison). Everything is warned on the ground; at 60% it calls shadows and at 25% it combines attacks. It only appears in the Crown of the Sky.",
   "🔥 Imbued weapons: fire, ice, lightning and water show on your weapon (with your drawing) when using skills of that element, with runes or with the new Imbue essences (5 min).",
   "⚔ Much faster weapon mastery (more from high-level enemies) and the weapon awakens sooner.",
   "🧪 Healing potions have an 8 s cooldown; the button shows the countdown.",
   "🏛 Adventure museum: trophies from the 64 bosses with their drawing, archaeological finds, festival medals and your first weapons. Villagers visit and comment on it.",
   "🏠 Useful house: display case, pedestal, artisan workshop, library, secret cellar (40 slots), guest bed, magic planter, alchemy table and new decoration.",
   "🌙 Magic gardening: 6 plants that grow with their weather (the Moonflower glows at night) and alchemy elixirs.",
   "🤝 Friendships, rivals and mentors: chat every day, rival duels and techniques they teach you.",
   "🎉 Festivals every 3 days: music contest, cooking, dance, race and snail betting.",
   "🗡 Ancestral weapons with a story: they awaken by restoring their shrine, talking to whoever knew their bearer and defeating their creator.",
   "📜 World chronicles in the Book of the Bond: bosses, towns, family, discoveries, decisions and unsolved secrets. 📝 Academy exam with an exclusive technique.",
   "Over 120 new items with sprites. Everything explained in the magnifier › Systems."
  ]
 },
 {
  "b": 85,
  "v": "4.64",
  "d": "2026-11-15",
  "es": [
   "🎬 Cinemáticas en pixel art: el pasado del mundo se ve con escenas animadas y tu propio héroe aparece en ellas.",
   "Prólogo con toda la historia: en el Libro del Vínculo («🎬 Ver el prólogo») y hablando con la Anciana Mira («Ver el pasado»).",
   "Cada capítulo tiene su cinemática: se ve al descubrirlo hablando con un aldeano y desde el Libro con el botón 🎬 (los siete guardianes, Vael y el Kraken, el Eclipse, el ámbar, el invierno, la Ventisca, los reyes…).",
   "⚠ Súper jefes: el Desatado, el Señor del Eclipse, Nihil, la Luna Sonriente y El Sin Nombre son jefes de la historia: barra dorada, aviso al aparecer y cinemática al vencerlos.",
   "Tejedores más grandes y detallados en las escenas."
  ],
  "en": [
   "🎬 Pixel art cutscenes: the world's past is shown with animated scenes and your own hero appears in them.",
   "Prologue with the whole story: in the Book of the Bond (\"🎬 Watch the prologue\") and talking to Elder Mira (\"See the past\").",
   "Every chapter has its cutscene: it plays when a villager tells it to you and from the Book with the 🎬 button (the seven guardians, Vael and the Kraken, the Eclipse, the amber, the winter, Ventisca, the kings…).",
   "⚠ Super bosses: the Unbound, the Lord of the Eclipse, Nihil, the Smiling Moon and the Nameless One are story bosses: golden bar, warning when they appear and a cutscene when you defeat them.",
   "Bigger, more detailed Weavers in the scenes."
  ]
 },
 {
  "b": 84,
  "v": "4.63",
  "d": "2026-11-15",
  "es": [
   "🏆 Top con tu héroe: cada fila del top muestra al personaje tal como iba la última vez que jugó (ropa, armadura, arma, cosméticos, cuerpo y subraza). Si te cambias, cambia en el top.",
   "👗 Nueva pestaña Moda: ranking de quién tiene más prendas distintas, contando cosméticos del armario y todas las armaduras conseguidas.",
   "Explicado en la lupa › Sistemas."
  ],
  "en": [
   "🏆 Top with your hero: every row of the top shows the character as they were dressed the last time they played (clothes, armour, weapon, cosmetics, body and subrace). If you change, the top changes too.",
   "👗 New Fashion tab: ranking of who owns the most different clothes, counting wardrobe cosmetics and every armour piece obtained.",
   "Explained in the magnifier › Systems."
  ]
 },
 {
  "b": 83,
  "v": "4.62",
  "d": "2026-11-15",
  "es": [
   "Ropa rasgada de mujer: la ropa sigue puesta y rasgada, y debajo lleva un top que se ve por los rotos del pecho; por los rotos del vientre se ve la piel."
  ],
  "en": [
   "Torn women's clothes: the clothes stay on and torn, with a top underneath visible through the rips on the chest; skin shows through the rips on the belly."
  ]
 },
 {
  "b": 82,
  "v": "4.61",
  "d": "2026-11-15",
  "es": [
   "El castillo de la Academia Arcana se abre: acércate al portón. Dentro hay un gran salón con alfombra morada, vidrieras, la directora y tres aulas (Fuego, Hielo y Runas) con 18 alumnos que van a clase y salen al recreo. Los profesores enseñan en voz alta. Siéntate en un pupitre durante la clase: Polvo Arcano y experiencia.",
   "Ropa rasgada de mujer: ya no queda un top; la ropa sigue puesta con jirones y agujeros en el vientre y el bajo en picos (el pecho siempre protegido). Los rotos de chico y chica usan siempre el color de tu piel.",
   "Kaela, la Loba del Velo (Velo Roto, cerca de la llegada): chica loba de pelo negro, orejas, cola y colmillos, vestido de jirones, medias de pelaje y boina roja. Se puede enamorar y casar.",
   "Kaela es la pareja más fuerte: lucha a tu lado sin armadura con su propio nivel (sube hasta 350), tiene vida, aúlla para curarte y habla según lo que pase. Con 6 corazones se transforma en loba y puedes subirte a su lomo (se ve online). También te regala su ropa.",
   "Hijos con Kaela: nacen híbridos (orejas, cola y colmillos del color de su pelo) y de jóvenes pueden pasar a forma híbrida con pelaje y hocico."
  ],
  "en": [
   "The Arcane Academy castle opens: walk up to the gate. Inside there's a great hall with a purple carpet, stained glass, the headmistress and three classrooms (Fire, Ice and Runes) with 18 students who go to class and out to break. Professors teach out loud. Sit at a desk during class: Arcane Dust and experience.",
   "Torn women's clothes: no more top; the clothes stay on with rips and holes over the belly and a jagged hem (the chest is always protected). Rips on men and women always use your skin colour.",
   "Kaela, the Veil She-Wolf (Broken Veil, near the arrival point): a wolf girl with black hair, ears, tail and fangs, a tattered dress, fur stockings and a red beret. She can be romanced and married.",
   "Kaela is the strongest partner: she fights by your side without armour at her own level (up to 350), has HP, howls to heal you and talks about what's happening. At 6 hearts she turns into a wolf and you can ride on her back (visible online). She also gives you her clothes.",
   "Children with Kaela: born hybrids (ears, tail and fangs in their hair colour) and as young adults they can switch to a hybrid form with fur and snout."
  ]
 },
 {
  "b": 81,
  "v": "4.60",
  "d": "2026-11-15",
  "es": [
   "Academia Arcana en el Velo Roto (runa azul junto a la llegada): castillo bajo un cielo de estrellas en espiral, camino de piedra azul con faroles, la Archimaga Ondine, los profesores Ignar (fuego), Nevia (hielo) y Orvel (arcano), alumnos y biblioteca.",
   "Lecciones diarias con cada profesor (toca 10 runas en 35 s): Polvo Arcano, experiencia y oro. La biblioteca tiene libros con historias que también dan Polvo Arcano.",
   "Libros mágicos (Librera Folia): vuelan a tu lado 1 minuto y lanzan hechizos con tu fuerza: Fuego, Hielo, Trueno, Arcano, Sanación y Escudo. Se gastan; se compran en packs de 3. Los demás jugadores los ven online.",
   "Escobas voladoras (Maese Ramas): Escoba voladora y Escoba astral con estela de estrellas. Son monturas y se ven online.",
   "Túnica y Sombrero de la Academia.",
   "El top que queda al destrozarse la ropa de mujer ahora es más pequeño: solo una banda sobre el pecho, con hombros, vientre y brazos al aire."
  ],
  "en": [
   "Arcane Academy in the Broken Veil (blue rune by the arrival point): a castle under a spiralling starry sky, a blue stone path with lanterns, Archmage Ondine, professors Ignar (fire), Nevia (ice) and Orvel (arcane), students and a library.",
   "Daily lessons with each professor (touch 10 runes in 35 s): Arcane Dust, experience and gold. The library has storybooks that also give Arcane Dust.",
   "Magic books (Librarian Folia): they fly by your side for 1 minute and cast spells with your power: Fire, Ice, Thunder, Arcane, Healing and Shield. They're consumed; sold in packs of 3. Online players see them.",
   "Flying brooms (Master Twig): Flying broom and Astral broom with a star trail. They're mounts and visible online.",
   "Academy Robe and Hat.",
   "The top left when women's clothes are torn apart is now smaller: just a band over the chest, with shoulders, belly and arms bare."
  ]
 },
 {
  "b": 80,
  "v": "4.59",
  "d": "2026-11-15",
  "es": [
   "Nuevo Devorador Carmesí (Luna de Sangre) con el diseño de Sergio: boca llena de colmillos, garras y núcleo de luz, con frente, perfil y espalda, caminata y ataque.",
   "Ropa de mujer muy dañada (menos de un cuarto de vida): la tela del vientre se destroza y queda un top oscuro que cubre el pecho.",
   "Frío: en los Picos Helados o cuando nieva sube tu medidor ❄. Las 14 antorchas nuevas de los Picos, las hogueras y estar bajo techo te calientan. Si llega al 100 % te resfrías.",
   "Enfermedades: Resfriado, Gripe, Fiebre del pantano, Intoxicación (picaduras venenosas) e Infección (heridas). Cada una baja algo (velocidad, ataque, vida o maná), tiene sus síntomas y se cura sola en unos días.",
   "Lesiones: los golpes de enemigos mucho más fuertes pueden darte una Contusión, un Esguince (cojeas) o romperte la pierna (vas gateando). Se ve en cualquier ropa, cuerpo y clase, también online.",
   "Médica Iris en Albor (con uniforme de enfermería y cofia): cura enfermedades y lesiones a cambio de oro, vende su uniforme y cofia y se puede enamorar.",
   "Todo explicado en la lupa › Sistemas › Enfermedades, lesiones y frío."
  ],
  "en": [
   "New Crimson Devourer (Blood Moon) with Sergio's design: a mouth full of fangs, claws and a light core, with front, side and back views, walking and attacking.",
   "Badly damaged women's clothes (below a quarter of HP): the fabric over the belly is torn away, leaving a dark top that covers the chest.",
   "Cold: in the Frozen Peaks or when it snows your ❄ meter rises. The 14 new torches in the Peaks, campfires and being indoors warm you up. At 100% you catch a cold.",
   "Illnesses: Cold, Flu, Swamp fever, Poisoning (venomous bites) and Infection (wounds). Each lowers something (speed, attack, HP or mana), has symptoms and heals by itself in a few days.",
   "Injuries: hits from much stronger enemies can give you a Bruise, a Sprain (you limp) or a broken leg (you crawl). It shows on any clothes, body and class, also online.",
   "Doctor Iris in Albor (in a nurse uniform and cap): cures illnesses and injuries for gold, sells her uniform and cap, and can be romanced.",
   "All explained in the magnifier › Systems › Illness, injuries and cold."
  ]
 },
 {
  "b": 79,
  "v": "4.58",
  "d": "2026-11-15",
  "es": [
   "La ropa de los cuerpos femeninos se rasga un poco más con poca vida: más rotos y más grandes en cintura, costados, brazos y piernas (el pecho sigue protegido)."
  ],
  "en": [
   "Clothes on female bodies tear a bit more at low health: more and bigger rips at the waist, sides, arms and legs (the chest stays protected)."
  ]
 },
 {
  "b": 78,
  "v": "4.57",
  "d": "2026-11-15",
  "es": [
   "Ropa desgarrada según tu vida: con menos de la mitad aparecen rotos en la ropa, la armadura y los cosméticos, y raspones rojos; con menos de un cuarto, más rotos, bordes deshilachados y gotas de sangre. Funciona con todas las prendas y estructuras de cuerpo, protege el pecho de los cuerpos femeninos y se arregla al curarte por encima del 60 %. Se ve online."
  ],
  "en": [
   "Torn clothes based on your health: below half, rips appear in your clothes, armour and cosmetics, plus red scratches; below a quarter, more rips, frayed edges and drops of blood. It works with every item and body type, protects the chest on female bodies and is fixed when you heal above 60%. Visible online."
  ]
 },
 {
  "b": 77,
  "v": "4.56",
  "d": "2026-11-15",
  "es": [
   "El poder vuelve a calcularse como antes (sin el ×10). Los rangos de la Torre, los títulos y la guía vuelven a sus números.",
   "Números grandes y claros en la ficha del personaje: el poder sale grande y dorado, y la vida, el maná, el ataque, la experiencia y los atributos usan una letra que se lee bien (la pixelada confundía el 8 con la S). El cristal de la Torre también."
  ],
  "en": [
   "Power is calculated as before again (no ×10). Tower ranks, titles and the guide go back to their numbers.",
   "Big, clear numbers in the character sheet: power is shown big and golden, and HP, mana, attack, experience and attributes use an easy-to-read font (the pixel font made 8 look like S). The Tower crystal too."
  ]
 },
 {
  "b": 76,
  "v": "4.55",
  "d": "2026-11-15",
  "es": [
   "Arreglado: los títulos, el título equipado y otros datos nuevos no se guardaban; por eso volvía a salir «Nuevo título: Aprendiz». Ahora se guardan (los ganados antes de esta versión se recuperan solos al cumplir su condición).",
   "El poder ahora se muestra ×10 para que los números se lean mejor (antes ~4.000, ahora ~40.000). Los rangos de la Torre, los títulos y la guía de la lupa usan la escala nueva. Vuelve a medir tu poder en el cristal.",
   "El equipo de tus hijos, nietos y bisnietos es suyo: ya no se lo puedes quitar. Sí puedes darles algo mejor; lo que llevaban se queda en su propia mochila."
  ],
  "en": [
   "Fixed: titles, the equipped title and other new data weren't saved; that's why \"New title: Apprentice\" kept appearing. Now they are saved (titles earned before this version come back on their own when their condition is met).",
   "Power is now shown ×10 so the numbers read better (before ~4,000, now ~40,000). Tower ranks, titles and the magnifier guide use the new scale. Measure your power at the crystal again.",
   "Your children's, grandchildren's and great-grandchildren's gear is theirs: you can no longer take it. You can give them something better; what they wore stays in their own bag."
  ]
 },
 {
  "b": 75,
  "v": "4.54",
  "d": "2026-11-15",
  "es": [
   "Hijos, nietos y bisnietos: ya no puedes quitarles armas, armaduras o herramientas de más nivel que el tuyo si tú nunca las conseguiste. Si alguna vez la tuviste o ya tienes el nivel, sí.",
   "Menos curación enemiga: las invocaciones de los jefes ya no salen como Curandero, el Curandero cura un 8 % cada 5 s (a un jefe solo un 1,5 %) y ningún jefe puede recuperar más de un 0,6 % de vida por segundo mientras luchas (Devorador Carmesí, Obispo Hueco y todos los demás).",
   "Mucho más fluido con muchos enemigos: los enemigos de la Luna de Sangre, corruptos y sombras ya no se tiñen en cada fotograma (era lo que más lag daba), el velo rojo se prepara una vez, los sonidos de golpe no se amontonan y las partículas y números se reducen solo cuando hay demasiados."
  ],
  "en": [
   "Children, grandchildren and great-grandchildren: you can no longer take weapons, armour or tools above your level from them if you never got them yourself. If you had it before or have the level, you can.",
   "Less enemy healing: boss summons no longer spawn as Healers, Healers heal 8% every 5 s (only 1.5% to a boss) and no boss can recover more than 0.6% HP per second while you fight (Crimson Devourer, Hollow Bishop and all the others).",
   "Much smoother with lots of enemies: Blood Moon, corrupted and shadow enemies are no longer tinted every frame (the biggest cause of lag), the red veil is prepared once, hit sounds don't pile up, and particles and numbers are reduced only when there are too many."
  ]
 },
 {
  "b": 74,
  "v": "4.53",
  "d": "2026-11-15",
  "es": [
   "Títulos: 26 títulos que se ganan por tu poder (Aprendiz, Veterano, Élite, Héroe, Leyenda, Mito Inmortal) y por logros (nivel máximo, clase despertada, Arma Velada, +10, arma despertada, maestría 50, rangos de la Torre, subrazas, boda, Coliseo, misiones diarias, ropa gótica, oro…).",
   "Se equipan en el Armario › Títulos y salen encima de tu personaje con letras de colores, borde, adornos y brillo animado. Los demás jugadores los ven online encima de tu nombre.",
   "Lupa › Sistemas: guías nuevas de Camino al poder máximo, Arma Velada (cómo conseguirla), Herrería (+10), Arma despertada, Maestría 50, Clase despertada y Títulos."
  ],
  "en": [
   "Titles: 26 titles earned by your power (Apprentice, Veteran, Elite, Hero, Legend, Immortal Myth) and by achievements (max level, awakened class, Veiled Weapon, +10, awakened weapon, mastery 50, Tower ranks, subraces, wedding, Coliseum, daily quests, gothic clothes, gold…).",
   "Equip them in Wardrobe › Titles; they show above your character with coloured letters, outline, ornaments and animated shine. Other players see them online above your name.",
   "Magnifier › Systems: new guides for Road to max power, Veiled Weapon (how to get it), Blacksmith (+10), Awakened weapon, Mastery 50, Awakened class and Titles."
  ]
 },
 {
  "b": 73,
  "v": "4.52",
  "d": "2026-11-15",
  "es": [
   "Arreglado: el número de poder no contaba todos tus bonus (maestría, arma despertada, clase despertada…) si no tenías subraza. Ahora el poder del menú y el del cristal de la Torre incluyen todo.",
   "La clase despertada ahora fortalece a todas las clases: +10 % de ataque, +8 % de vida y +8 % de defensa, además de su bonus propio."
  ],
  "en": [
   "Fixed: the power number didn't count all your bonuses (mastery, awakened weapon, awakened class…) unless you had a subrace. Now the menu power and the Tower crystal include everything.",
   "Awakened class now strengthens every class: +10% attack, +8% HP and +8% defence, on top of its own bonus."
  ]
 },
 {
  "b": 72,
  "v": "4.51",
  "d": "2026-11-15",
  "es": [
   "Lupa › Sistemas › Ropa gótica y de cazador: dónde conseguir cada prenda gótica (con su precio), las pelucas, las gafas, el maquillaje blanco y la ropa de cazador."
  ],
  "en": [
   "Magnifier › Systems › Gothic and hunter clothes: where to get each gothic item (with its price), the wigs, the glasses, the white makeup and the hunter clothes."
  ]
 },
 {
  "b": 71,
  "v": "4.50",
  "d": "2026-11-15",
  "es": [
   "Taller de Morwenna renovado con ropa gótica nueva y distinta: Vestido de Campana con Corsé (cadenas y cruz ansada), Vestido Romántico de Encaje, Top de Malla y Gargantilla, Chaleco de Tachas y Encaje, Top de Hombros Caídos y Rosario, Top de Tiras y Malla, Vestido de Campana Vino, Falda de Cuero con Cadenas, Falda Tutú y Medias Rotas, Pantalón de Cuero con Cordones y Botas de Plataforma.",
   "Pelucas góticas (Bob con Flequillo, Cardada, Larga Ondulada Morada, Melena Ondulada) y Gafas Redondas. Se ajustan a todos los cuerpos.",
   "Nueva opción en el editor (Pelo): Maquillaje blanco gótico en la piel. Se ve online, igual que el labial.",
   "La ropa de cazador de la Torre ya no es una copia en negro: la Chaqueta de Cazador tiene cuello alto, cremallera e insignia; la de Cuero, cremallera cruzada y tachas; la Sudadera, bolsillo y cordones; y la Ropa Negra es ahora un chaleco táctico con bolsillos.",
   "Los cazadores esquivan con dash: en los duelos detectan tus habilidades y se apartan, en el Coliseo esquivan el poder del rival y en las mazmorras salen de las zonas rojas.",
   "Combate online en el Coliseo: desde el menú de torneos invita a un jugador conectado; si acepta, los dos aparecéis en la arena, cuenta atrás y a luchar. Quien cae pierde el combate (sin quedar derribado)."
  ],
  "en": [
   "Morwenna's workshop renewed with new, distinct gothic clothes: Bell-Sleeve Corset Dress (chains and ankh), Romantic Lace Dress, Mesh Top and Choker, Studded Vest and Lace, Off-Shoulder Top and Rosary, Strappy Mesh Top, Wine Bell-Sleeve Dress, Chained Leather Skirt, Tutu Skirt and Ripped Tights, Lace-Up Leather Pants and Platform Boots.",
   "Gothic wigs (Bob with Bangs, Teased, Long Wavy Purple, Wavy Shoulder Hair) and Round Glasses. They fit every body.",
   "New editor option (Hair): white gothic skin makeup. Visible online, like lipstick.",
   "Tower hunter clothes are no longer black copies: the Hunter Jacket has a high collar, zip and badge; the Leather one a cross zip and studs; the Hoodie a pocket and strings; and Black Clothes is now a tactical vest with pouches.",
   "Hunters dodge with a dash: in duels they sense your skills and jump aside, in the Coliseum they dodge the rival's power and in dungeons they dash out of red zones.",
   "Online Coliseum fights: from the tournament menu invite an online player; if they accept, you both appear in the arena, countdown and fight. Whoever falls loses the fight (without being downed)."
  ]
 },
 {
  "b": 70,
  "v": "4.49",
  "d": "2026-11-15",
  "es": [
   "La Misión diaria del Sistema ahora te sube 1 nivel al día (más esencias y oro) en vez de dar puntos de atributo, para no romper el equilibrio. En el nivel máximo da esencias y oro extra."
  ],
  "en": [
   "The System Daily Quest now gives you 1 level a day (plus essences and gold) instead of attribute points, to keep the balance. At max level it gives extra essences and gold."
  ]
 },
 {
  "b": 69,
  "v": "4.48",
  "d": "2026-11-15",
  "es": [
   "La Torre de los Portales crece: tres puertas nuevas en el vestíbulo.",
   "Antesala de los Portales: un gran salón con alfombra roja, columnas, estatuas, braseros y las 8 puertas gigantes con su nombre y nivel (rojas si aún no puedes), guardias y el tablón de puertas.",
   "Coliseo de Cazadores: torneos de duelos (8 cazadores), por parejas y batalla real de 6. Se ven en vivo en la arena desde las gradas, con el público animando, o de cerca en modo espectador. Puedes apostar al campeón y retarlo después.",
   "Salón de Pruebas: prueba de fuerza (daño en 10 s), de resistencia (aguanta oleadas 45 s), de velocidad (recoge 10 luces), examen de ascenso de rango contra un examinador y la Misión diaria del Sistema (+2 puntos de atributo al día).",
   "30 cazadores nuevos con el estilo del juego: capuchas, capas, máscaras, armaduras y bufandas. Conviven con los de estilo anime.",
   "El medidor de poder ahora da el mismo número que el menú del personaje. Los cazadores ya no pasan del nivel 350."
  ],
  "en": [
   "The Portal Tower grows: three new doors in the lobby.",
   "Portal Antechamber: a great hall with a red carpet, pillars, statues, braziers and the 8 giant gates with their name and level (red if you can't enter yet), guards and the gate board.",
   "Hunters' Coliseum: duel tournaments (8 hunters), pairs and a 6-way battle royale. Watch live in the arena from the stands, with a cheering crowd, or up close in spectator mode. Bet on the champion and challenge them afterwards.",
   "Trial Hall: strength trial (damage in 10 s), endurance (survive waves for 45 s), speed (collect 10 lights), a rank-up exam against an examiner and the System Daily Quest (+2 attribute points a day).",
   "30 new hunters in the game's style: hoods, capes, masks, armour and scarves. They live alongside the anime-style ones.",
   "The power meter now shows the same number as the character menu. Hunters no longer go above level 350."
  ]
 },
 {
  "b": 68,
  "v": "4.47",
  "d": "2026-11-15",
  "es": [
   "Cazadores con poder propio, como jugadores: estadísticas de su nivel y clase, mejor equipo de su nivel, pasivas, rango y maestría de arma que sube matando enemigos.",
   "Cazadores más listos: cada uno elige un enemigo distinto, se reparten alrededor, priorizan al jefe y a los heridos, esquivan las zonas rojas, usan la técnica de su arma, beben pociones y los bardos y los de agua curan al equipo.",
   "Mazmorras de verdad: los enemigos ya no vuelven a salir ni el jefe reaparece. Te avisa de cuántos quedan y cuando el portal está limpio.",
   "Modo espectador: los compañeros siguen al líder y exploran juntos hasta el jefe. Tú solo miras: no puedes atacar ni ganar maestría ni experiencia.",
   "Los 12 enemigos de las mazmorras, el Alfa Nocturno y el Señor de las Tormentas se ven como en las imágenes de Sergio. Los jefes tienen 4 direcciones.",
   "Morwenna, Lilith, Nyx, Raven y Dorian con su nuevo diseño gótico en 4 direcciones y con caminata. Ahora se pueden enamorar: regalos, citas, besos y boda."
  ],
  "en": [
   "Hunters with their own power, like players: stats for their level and class, best gear for their level, passives, rank and weapon mastery that grows by killing enemies.",
   "Smarter hunters: each picks a different enemy, they spread out, focus the boss and wounded foes, dodge red zones, use their weapon technique, drink potions, and bards and water users heal the team.",
   "Real dungeons: enemies no longer respawn and the boss doesn't come back. You're told how many are left and when the portal is clear.",
   "Spectator mode: teammates follow the leader and explore together to the boss. You only watch: no attacking, no mastery or experience.",
   "The 12 dungeon enemies, the Night Alpha and the Lord of Storms look like Sergio's images. Bosses have 4 directions.",
   "Morwenna, Lilith, Nyx, Raven and Dorian with their new gothic design in 4 directions with walking. They can now be romanced: gifts, dates, kisses and wedding."
  ]
 },
 {
  "b": 67,
  "v": "4.46",
  "d": "2026-11-15",
  "es": [
   "Cazadores nuevos estilo anime, sacados de la imagen de Sergio: 15 diseños (capas, abrigos, garras, bastones, gemas) y 11 cazadoras de pelo largo, con frente, espalda y perfil, caminata y ataque.",
   "Cada cazador tiene su propio color de ropa y de pelo (rosa, azul, violeta, menta, rubio…), así no hay dos iguales. Los gigantes se ven más grandes. Los 6 legendarios también tienen su diseño nuevo.",
   "El Titán Carmesí de la Cripta del Gólem Rojo se ve como en la imagen: armadura roja agrietada, garras doradas, ojos amarillos y núcleo de luz que late.",
   "Navidad con nieve: durante todo el último mes y el día de Año Nuevo nieva y el suelo de todo el mundo se cubre de blanco (menos el desierto y el volcán)."
  ],
  "en": [
   "New anime-style hunters taken from Sergio's image: 15 designs (capes, coats, claws, staves, gems) and 11 long-haired huntresses, with front, back and side views, walking and attacking.",
   "Every hunter has their own clothing and hair color (pink, blue, violet, mint, blond…), so no two look the same. Giants look bigger. The 6 legendaries also have their new design.",
   "The Crimson Titan in the Red Golem Crypt looks like the image: cracked red armor, golden claws, yellow eyes and a pulsing light core.",
   "Snowy Christmas: during the whole last month and on New Year's Day it snows and the ground of the whole world turns white (except desert and volcano)."
  ]
 },
 {
  "b": 66,
  "v": "4.45",
  "d": "2026-11-15",
  "es": [
   "Dos cuerpos nuevos al crear o cambiar tu personaje: Esbelto (hombre) y Atlética (mujer). Toda la ropa, armaduras y cosméticos se ajustan a ellos.",
   "NPCs góticas: Morwenna en Albor (costurera con tienda de ropa gótica: vestido, corsé, velo, capa de encaje, guantes, gargantilla y botas), Lilith en el puerto, Nyx en Arxar, Raven en Sahrim y Dorian en Yarakai.",
   "Fiestas en los pueblos según el calendario del juego: Semana Santa (alfombras de flores, palmas y procesión), Fiesta del Sol, Mes Morado (procesión morada con anda, velas y turrón), Día de las Ánimas (altar y pan de ánimas), Navidad (árbol con regalo, nacimiento y panetón) y Año Nuevo (fuegos artificiales).",
   "Las comidas de cada fiesta dan una bendición especial. Todo está en la lupa › Sistemas › Fiestas."
  ],
  "en": [
   "Two new bodies when creating or changing your character: Slim (male) and Athletic (female). All clothes, armor and cosmetics fit them.",
   "Gothic NPCs: Morwenna in Albor (seamstress with a gothic clothing shop: dress, corset, veil, lace cape, gloves, choker and boots), Lilith at the port, Nyx in Arxar, Raven in Sahrim and Dorian in Yarakai.",
   "Town festivals following the game calendar: Holy Week (flower carpets, palms and procession), Sun Festival, Purple Month (purple procession with float, candles and turrón), Day of Souls (altar and souls bread), Christmas (tree with a gift, nativity and panettone) and New Year (fireworks).",
   "Each festival's food gives a special blessing. Everything is in the magnifier › Systems › Festivals."
  ]
 },
 {
  "b": 65,
  "v": "4.44",
  "d": "2026-11-15",
  "es": [
   "Cazadores mucho más variados: cuerpos normales, altos, robustos y gigantes, capas del color de su poder, armaduras, máscaras, bufandas, barbas, ojos brillantes y armas según su clase.",
   "Poderes con animación propia: pilares de fuego, cristales de hielo, picos de roca, tornados, olas de agua, runas mentales y, nuevos, sombras y rayos.",
   "Rangos por encima de Astral: Nacional y Mundial. Seis cazadores legendarios en la Torre (Vaelor, el Monarca de las Sombras; Thorgar, la Bestia Dorada; Ilhan, el Sabueso Carmesí; Kiro, el de la Máscara de Gas; la Doctora Seren y Brutus, el Muro), de nivel 430 a 520: no se unen a nadie.",
   "Duelos de entrenamiento en la Torre: reta a cualquier cazador (o a un legendario, imposible por ahora). Notas la diferencia de poder en vida, daño y poderes; a 1 de vida el duelo termina y no mueres. Ganar da maestría y esencias.",
   "Modo espectador: en las retransmisiones pulsa «Ver en directo» y entra a ver al cazador (o a su equipo) recorrer la mazmorra y luchar. Tú eres invisible; sales desde el botón ⛩.",
   "Maquillaje nuevo: ojeras y ojeras con delineado. Labial negro, rojo, granate, morado, rosa y azul (pestaña Pelo). Se ve en el online."
  ],
  "en": [
   "Much more varied hunters: normal, tall, burly and giant bodies, capes in their power's colour, armour, masks, scarves, beards, glowing eyes and weapons by class.",
   "Powers with their own animation: fire pillars, ice crystals, rock spikes, tornadoes, water waves, mind runes and, new, shadows and lightning.",
   "Ranks above Astral: National and World. Six legendary hunters in the Tower (Vaelor, the Shadow Monarch; Thorgar, the Golden Beast; Ilhan, the Crimson Hound; Kiro, the Gas Mask; Doctor Seren and Brutus, the Wall), level 430 to 520: they team up with nobody.",
   "Training duels in the Tower: challenge any hunter (or a legendary one, impossible for now). You feel the power gap in HP, damage and powers; at 1 HP the duel ends and you don't die. Winning gives mastery and essences.",
   "Spectator mode: in the broadcasts press \"Watch live\" and go in to watch the hunter (or their team) explore the dungeon and fight. You are invisible; leave from the ⛩ button.",
   "New makeup: dark circles and dark circles with eyeliner. Black, red, burgundy, purple, pink and blue lipstick (Hair tab). Visible online."
  ]
 },
 {
  "b": 64,
  "v": "4.43",
  "d": "2026-11-15",
  "es": [
   "Arreglado: el error rojo «Maximum call stack size exceeded» al salir de una mazmorra (pasaba si se pisaba otra vez la salida mientras cargaba). Ahora siempre sales bien, aunque falte el punto de vuelta.",
   "Arreglado: en la Torre de los Portales la ventana de retransmisiones se abría sola al caminar.",
   "Cazadores mucho más útiles: pegan según su propio nivel y rango (uno de más nivel pega mucho más) y aguantan más.",
   "Los cazadores de más de 20 niveles por encima del tuyo no aceptan ir contigo.",
   "Jefes menos inflados: los cazadores cuentan medio y los hijos un tercio para el escalado del equipo, y los jefes de las mazmorras tienen un 30 % menos de vida."
  ],
  "en": [
   "Fixed: the red error \"Maximum call stack size exceeded\" when leaving a dungeon (it happened if you stepped on the exit again while loading). You now always get out, even if the return point is missing.",
   "Fixed: in the Portal Tower the broadcast window opened by itself while walking.",
   "Hunters are much more useful: they hit based on their own level and rank (a higher-level one hits much harder) and are tougher.",
   "Hunters more than 20 levels above you refuse to go with you.",
   "Less bloated bosses: hunters count as half and kids as a third for team scaling, and dungeon bosses have 30% less HP."
  ]
 },
 {
  "b": 63,
  "v": "4.42",
  "d": "2026-11-14",
  "es": [
   "Ropa de cazador (cofres de los portales y Tienda del Portal): Chaqueta de Cazador, Chaqueta de Cuero Negra, Gabardina Nocturna, Chaqueta Astral, Ropa Negra, Sudadera Oscura, tres capuchas, pantalones y falda negros, botas y zapatillas negras y dos capas. Se ajustan a las 8 estructuras de cuerpo (con busto en mujer).",
   "Anillos de Cazador (Hierro, Plata, Oro, Platino y Astral), tan buenos como los mejores accesorios de su nivel.",
   "6 peinados emo nuevos (3 para chicas y 3 para chicos) con flequillo largo que tapa un ojo.",
   "Maquillaje de ojos en la creación, la peluquería y el estilo de los hijos (pestaña Pelo): delineado negro, sombras morada, roja y azul, pestañas largas y ojos ahumados.",
   "Aspectos de arma: 8 aspectos (Acero Pulido, Plata Lunar, Oro Real, Mithril Azur, Obsidiana, Cristal Celeste, Sombra Eclipsada y Luna Sonriente) que cambian solo el dibujo de tu arma, no el daño. Los demás jugadores también lo ven."
  ],
  "en": [
   "Hunter clothes (portal chests and Portal Shop): Hunter Jacket, Black Leather Jacket, Night Trench Coat, Astral Jacket, Black Clothes, Dark Hoodie, three hoods, black trousers and skirt, black boots and sneakers and two capes. They fit all 8 body builds (with bust on women).",
   "Hunter Rings (Iron, Silver, Gold, Platinum and Astral), as good as the best accessories of their level.",
   "6 new emo hairstyles (3 for girls and 3 for boys) with a long fringe covering one eye.",
   "Eye makeup in character creation, the hairdresser and kids' style (Hair tab): black eyeliner, purple, red and blue shadow, long lashes and smoky eyes.",
   "Weapon looks: 8 looks (Polished Steel, Lunar Silver, Royal Gold, Azure Mithril, Obsidian, Celestial Crystal, Eclipsed Shadow and Smiling Moon) that only change your weapon's art, not its damage. Other players see it too."
  ]
 },
 {
  "b": 62,
  "v": "4.41",
  "d": "2026-11-14",
  "es": [
   "Torre de los Portales: un gran centro de cazadores blanco con Selene (la recepcionista de azul), el cristal que mide tu poder y te da rango (Cobre, Hierro, Plata, Oro, Platino y Astral), el ranking, pantallas para ver en directo a los cazadores dentro de los portales y la tienda de esencias.",
   "40 cazadores vivos con nombre, aspecto, clase, poder (fuego, hielo, roca, aire, agua o mente), rango y nivel propios, algunos robustos y grandes. Entran solos en portales, suben de nivel y de rango y tienen sus diálogos.",
   "Botón ⛩ Mazmorras (desde nivel 50): las mazmorras del mundo en el que estás. Mundo principal: nivel 50, 100, 150, 250 y 340. También en el Archipiélago (170), las Islas del Cielo (210) y el Velo Roto (300).",
   "Mazmorras en solitario o en equipo de 4: vas con 3 cazadores (invítalos hablando con ellos). Luchan con sus poderes, los enemigos van a por todos y ves la vida del equipo arriba a la izquierda, como en el online.",
   "Enemigos nuevos en el bestiario: Gólem Rojo, Elemental de Roca, Araña del Portal, Lobo Nocturno, Cazador Corrupto, Lagarto Ígneo, Elementales de Fuego y de Hielo, Escarabajo de Acero, Sapo Abisal, Espectro del Portal y Gólem del Vacío. Jefes: Titán Carmesí, Alfa Nocturno, Reina Arácnida, Rey Sapo Abisal, Señor de las Tormentas, Señor Elemental, El Cazador Caído y el Monarca del Vacío.",
   "Al cerrar un portal sale un cofre con oro, experiencia, esencias de portal y equipo de tu nivel (más en equipo)."
  ],
  "en": [
   "Portal Tower: a large white hunters' hub with Selene (the receptionist in blue), the crystal that measures your power and gives you a rank (Copper, Iron, Silver, Gold, Platinum and Astral), the ranking, screens to watch hunters live inside portals and the essence shop.",
   "40 living hunters with their own name, look, class, power (fire, ice, rock, air, water or mind), rank and level, some of them big and burly. They go into portals alone, level up, rank up and have their own dialogue.",
   "⛩ Dungeons button (from level 50): the dungeons of the world you are in. Main world: level 50, 100, 150, 250 and 340. Also in the Archipelago (170), Sky Isles (210) and Broken Veil (300).",
   "Dungeons solo or as a team of 4: you go with 3 hunters (invite them by talking to them). They fight with their powers, enemies go for everyone and you see the team's HP at the top left, like online.",
   "New enemies in the bestiary: Red Golem, Rock Elemental, Portal Spider, Night Wolf, Corrupted Hunter, Igneous Lizard, Fire and Ice Elementals, Steel Beetle, Abyssal Toad, Portal Wraith and Void Golem. Bosses: Crimson Titan, Night Alpha, Portal Spider Queen, Abyssal Toad King, Lord of Storms, Elemental Lord, The Fallen Hunter and the Void Monarch.",
   "Closing a portal drops a chest with gold, experience, portal essences and gear for your level (more as a team)."
  ]
 },
 {
  "b": 61,
  "v": "4.40",
  "d": "2026-11-14",
  "es": [
   "Hijos, nietos y bisnietos usan 4 habilidades de su clase como tú (según su nivel). En su panel eliges cuáles y las cambias cuando quieras; las nuevas se añaden solas si hay hueco.",
   "Hijos invocadores: capturan almas al derrotar enemigos (hasta 8), invocan espíritus que luchan por ellos (1, 2 desde nivel 60 y 3 desde nivel 150) y en su panel marcas con ★ las que quieres o borras las que no.",
   "Se equipan lo mejor que encuentran o forjan en sus expediciones, aunque supere a tu equipo, y pueden llegar a ser más fuertes que tú (hasta 1,5 veces).",
   "Los jefes también van a por tus hijos: cambian de objetivo cada pocos segundos entre tú y los que te acompañan.",
   "Escalado por equipo: con más jugadores del grupo cerca o con hijos acompañándote, los jefes ganan vida (+55 % por miembro) y algo de daño, y los enemigos normales también un poco. Solo, todo queda igual.",
   "Jefes de nivel 200 o más: un 20 % menos de vida (el informe de equilibrio daba de 2 a 6 minutos en solitario).",
   "Armas: la penalización del arma vieja cuenta desde la mejor arma que existe para tu nivel (entre los niveles 250 y 300 no hay armas nuevas y antes perdías la mitad del ataque)."
  ],
  "en": [
   "Kids, grandkids and great-grandkids use 4 skills of their class like you (by level). In their panel you choose which and change them anytime; new ones are added automatically if there is room.",
   "Summoner kids: they capture souls when defeating enemies (up to 8), summon spirits that fight for them (1, 2 from level 60 and 3 from level 150) and in their panel you ★ the ones you want or delete the rest.",
   "They equip the best they find or forge on expeditions, even if it beats your gear, and can become stronger than you (up to 1.5 times).",
   "Bosses also go for your kids: they switch targets every few seconds between you and the kids with you.",
   "Team scaling: with more party players nearby or kids following you, bosses gain HP (+55% per member) and some damage, and normal enemies a little. Solo, nothing changes.",
   "Bosses of level 200+: 20% less HP (the balance report gave 2 to 6 minutes solo).",
   "Weapons: the old-weapon penalty now counts from the best weapon that exists for your level (there are no new weapons between levels 250 and 300 and you used to lose half your attack)."
  ]
 },
 {
  "b": 60,
  "v": "4.39",
  "d": "2026-11-14",
  "es": [
   "Arreglado: al salir de casa durante la fiesta familiar el juego se congelaba con un error rojo. Ahora la fiesta siempre te deja en la puerta de tu casa y, si la posición de vuelta fallara, sales igualmente sin bloquearse.",
   "En el panel ❤ Familia ya puedes llamar también a los hijos, nietos y bisnietos que están de expedición: vuelven y se unen a tu equipo si hay hueco (si no, esperan en casa)."
  ],
  "en": [
   "Fixed: leaving the house during the family party froze the game with a red error. The party now always leaves you at your house door and, if the return position ever failed, you still get out without freezing.",
   "In the ❤ Family panel you can now also call kids, grandkids and great-grandkids who are on an expedition: they come back and join your team if there is room (otherwise they wait at home)."
  ]
 },
 {
  "b": 59,
  "v": "4.38",
  "d": "2026-11-14",
  "es": [
   "Armas: un arma de tu nivel (hasta 10 niveles por debajo) da +10 % de ataque, y un arma vieja pierde más: desde 12 niveles por debajo, un 2,5 % por nivel (hasta −55 %). Ya no sirve llevar la espada de cobre todo el juego.",
   "Lupa › 📘 Sistemas: explica paso a paso armas, maestría, posturas, elementos, puntos débiles de jefes, enemigos en equipo, combos, pueblos y alcalde, forja, alquimia, sueños, escalada y profundidades, familia y top, con flecha dorada cuando hay un sitio.",
   "Tus dos parejas a la vez: con una acompañándote, pídele a la otra «Acompáñame tú también ♥». Te siguen las dos (la segunda da +5 % de ataque y defensa) y los demás jugadores las ven.",
   "Al llamar a un hijo, nieto o bisnieto desde el botón ❤ se une a tu equipo si hay hueco (como mucho 2 a la vez), así que los demás jugadores también lo ven. Desde ese panel también llamas a tus parejas.",
   "Casa de hasta 4 pisos: escaleras en el rincón de tu casa. Piso 2: dormitorios de la familia (ahí duermen tus hijos y nietos), piso 3: salón de fiestas y piso 4: terraza mirador.",
   "Fiesta familiar (botón ❤): toda tu familia, las parejas de tus hijos y tus parejas en tu casa (en el salón si lo tienes), con baile, confeti y globos de diálogo. Da Alegría familiar: +10 % de experiencia y +5 % de ataque durante 30 minutos."
  ],
  "en": [
   "Weapons: a weapon at your level (up to 10 levels below) gives +10% attack, and an old weapon loses more: from 12 levels below, 2.5% per level (up to −55%). Carrying the copper sword all game no longer works.",
   "Magnifier › 📘 Systems: step-by-step explanations of weapons, mastery, stances, elements, boss weak points, teamwork enemies, combos, towns and mayor, forge, alchemy, dreams, climbing and depths, family and top, with the golden arrow when there is a place.",
   "Both partners at once: with one following you, ask the other \"Come with me too ♥\". Both follow you (the second gives +5% attack and defence) and other players see them.",
   "Calling a kid, grandkid or great-grandkid from the ❤ button makes them join your team if there is room (2 at most), so other players see them too. You can also call your partners from that panel.",
   "Houses up to 4 floors: stairs in the corner of your house. Floor 2: family bedrooms (your kids and grandkids sleep there), floor 3: party hall and floor 4: lookout terrace.",
   "Family party (❤ button): your whole family, your kids' partners and your partners at your home (in the hall if you have it), with dancing, confetti and chat bubbles. Gives Family joy: +10% experience and +5% attack for 30 minutes."
  ]
 },
 {
  "b": 58,
  "v": "4.37",
  "d": "2026-11-14",
  "es": [
   "Posturas con cuerpo: la postura ofensiva (agachado, arma alzada), la defensiva (arma cruzada en guardia) y la veloz (de puntillas, arma atrás) cambian la pose de tu personaje en las 4 direcciones, con todas las clases, armas y estructuras de cuerpo. Los demás jugadores también la ven.",
   "Pueblos vivos también en Céfira, Aurelia y Lumen (cielo), Puerto Esmeralda (archipiélago) y Nochebruma (Velo Roto): tablón, periódico, mercado con sus propias mercancías, alcalde, impuestos, bazar y casas abandonadas.",
   "Familia: nuevo botón ❤ arriba con toda tu familia. Llama a cualquier hijo o nieto desde cualquier sitio: viene a tu lado y puedes hacer que te acompañe, mandarle de expedición o equiparle, aunque ya viva en su casa con su pareja.",
   "Los nietos ya tienen todo: crecen, eligen clase, suben de nivel, te acompañan, van de expedición, se casan y pueden tener sus propios hijos. No gastan los hijos que puedes tener con tu pareja.",
   "Grupo online más sincronizado: los monstruos del líder se comparten también en el cielo, el Velo Roto, Altavela, el Jardín de la Sonrisa, Ixtal y las Profundidades; se ven sus papeles (guardián/curandero) y si están mojados, electrizados, quemados o congelados; y si alguien rompe la parte vulnerable de un jefe, se rompe para todos."
  ],
  "en": [
   "Stances with body poses: offensive (crouched, weapon raised), defensive (weapon crossed on guard) and swift (on tiptoes, weapon back) change your character's pose in all 4 directions, with every class, weapon and body build. Other players see it too.",
   "Living towns also in Cefira, Aurelia and Lumen (sky), Emerald Port (archipelago) and Nochebruma (Broken Veil): board, newspaper, market with their own goods, mayor, taxes, bazaar and abandoned houses.",
   "Family: new ❤ button at the top with your whole family. Call any kid or grandkid from anywhere: they come to you and you can have them follow you, send them on an expedition or equip them, even if they already live at their own home with their partner.",
   "Grandkids now have everything: they grow, choose a class, level up, follow you, go on expeditions, marry and can have their own kids. They don't use up the kids you can have with your partner.",
   "More synced online party: the leader's monsters are now also shared in the sky, the Broken Veil, Altavela, the Smile Garden, Ixtal and the Depths; you see their roles (guardian/healer) and whether they are wet, electrified, burning or frozen; and if someone breaks a boss weak point, it breaks for everyone."
  ]
 },
 {
  "b": 57,
  "v": "4.36",
  "d": "2026-11-14",
  "es": [
   "Mundo de los Sueños: si duermes en tu cama de madrugada (22:00-4:00) a veces sueñas (con Hierba del sueño, siempre). Apareces en un Albor al revés, de noche y morado, con 3 pruebas: los Espejos, los Ecos (6 esquirlas en 45 s) y tu propia Sombra. Ganas polvo de sueño para la tienda de Oniria y, al superar las tres, el Amuleto del Soñador.",
   "Escalada: 40 puntos de escalada con cuerda en los acantilados del mundo para subir y bajar sin dar la vuelta.",
   "Puentes de hielo: una habilidad de hielo congela el agua que tienes delante durante 25 segundos y puedes cruzarla.",
   "Las Profundidades: cada cueva tiene un pozo con cuerda junto al jefe que baja a 5 niveles más, cada uno más oscuro, con enemigos más fuertes, mejores minerales, un jefe más duro y un cofre diario.",
   "Legado familiar: a los 20 días tus hijos son adultos. Pueden aprender un oficio (te dejan regalos cada día en el buzón de casa), casarse (eliges entre 3 pretendientes), vivir en su propia casa en un pueblo (marcada en el mapa) y tener hasta 2 nietos que mezclan sus rasgos.",
   "Historias familiares: de vez en cuando un hijo te pide algo (pescar juntos, buscarle si se pierde, un plato por su cumpleaños o vencer al monstruo de debajo de su cama)."
  ],
  "en": [
   "Dream World: if you sleep in your bed late at night (22:00-4:00) you sometimes dream (always with Dream herb). You appear in a backwards, purple, night-time Albor with 3 trials: the Mirrors, the Echoes (6 shards in 45 s) and your own Shadow. Earn dream dust for Oniria's shop and, after all three, the Dreamer's Amulet.",
   "Climbing: 40 rope climbing spots on cliffs around the world to go up and down without going around.",
   "Ice bridges: an ice skill freezes the water in front of you for 25 seconds so you can cross it.",
   "The Depths: every cave has a rope pit next to the boss that goes down 5 more levels, each darker, with stronger enemies, better ore, a tougher boss and a daily chest.",
   "Family legacy: after 20 days your kids are adults. They can learn a job (leaving gifts in your home mailbox every day), marry (choose among 3 suitors), live in their own house in a town (marked on the map) and have up to 2 grandchildren who mix their features.",
   "Family stories: now and then a kid asks you for something (fishing together, finding them when lost, a dish for their birthday or beating the monster under their bed)."
  ]
 },
 {
  "b": 56,
  "v": "4.35",
  "d": "2026-11-14",
  "es": [
   "Maestría de armas: cada tipo de arma (espada, lanza, hacha, maza, báculo, arco, dagas, laúd, guadaña y aletas) tiene su propia experiencia hasta 50, sin subir de nivel. Desbloquea posturas, contraataque maestro, una técnica especial y +5 % de daño como Gran Maestro.",
   "Posturas ofensiva, defensiva y veloz con el botón ◇ (mantén pulsado para ver tu maestría). Se ven como un aro de color en el suelo, también en el online. Técnica especial con el botón ✦.",
   "Campo de Entrenamiento al sur de Arxar: muñecos, dianas, armeros, escudos, la Maestra Brienne y dos aprendices que practican. Golpear muñecos y dianas sube la maestría.",
   "Reacciones elementales: los enemigos se mojan con la lluvia, en el agua o con el pez. Rayo + mojado = Descarga en cadena; hielo + mojado = Congelado; fuego + hielo = Vapor; fuego + rayo = Sobrecarga; agua + fuego = Apagado. En las tormentas caen rayos.",
   "Raíces espinosas junto a 6 piedras de viaje tapan cofres: quémalas con una habilidad de fuego, un arma con runa de fuego o una poción explosiva. Vuelven a crecer cada día.",
   "Partes vulnerables en algunos jefes: cristal del Gólem de Escarcha (se regenera), escudo del Rey Vael (lo rompe un contraataque perfecto), tambor de Gruk (refuerzos), raíz corazón del Ent (solo el fuego) y corona del Rey Slime. Al romperlas cambian sus ataques.",
   "Enemigos en equipo: guardianes (🛡, protegen a los de al lado: la mitad de daño) y curanderos (✚, curan a sus aliados y se alejan de ti). Los arqueros siguen alejándose. Decide a quién atacar primero.",
   "Técnicas combinadas (online y WiFi local): si tú y otro jugador cercano usáis una habilidad casi a la vez, sale una técnica según vuestras clases (Espada Electrificada, Sinfonía de Almas, Lluvia Ígnea, Himno de Guerra, Tormenta Marina…)."
  ],
  "en": [
   "Weapon mastery: each weapon type (sword, spear, axe, mace, staff, bow, daggers, lute, scythe and fins) has its own experience up to 50, without levelling up. Unlocks stances, master counter, a special technique and +5% damage as Grand Master.",
   "Offensive, defensive and swift stances with the ◇ button (hold to see your mastery). They show as a coloured ring on the ground, online too. Special technique with the ✦ button.",
   "Training Grounds south of Arxar: dummies, targets, weapon racks, shields, Master Brienne and two apprentices practising. Hitting dummies and targets raises mastery.",
   "Elemental reactions: enemies get wet in the rain, in water or from the fish. Lightning + wet = chain Discharge; ice + wet = Frozen; fire + ice = Steam; fire + lightning = Overload; water + fire = Doused. Lightning strikes during storms.",
   "Thorny roots next to 6 waystones block chests: burn them with a fire skill, a fire-rune weapon or an explosive potion. They grow back every day.",
   "Weak points on some bosses: the Frost Golem's crystal (regenerates), King Vael's shield (a perfect counter breaks it), Gruk's drum (reinforcements), the Ent's heart root (only fire) and the Slime King's crown. Breaking them changes their attacks.",
   "Teamwork enemies: guardians (🛡, protect those next to them: half damage) and healers (✚, heal allies and keep away from you). Archers still keep their distance. Choose who to hit first.",
   "Combined techniques (online and local WiFi): if you and a nearby player use a skill almost at the same time, a technique triggers based on your classes (Electrified Blade, Symphony of Souls, Fire Rain, War Hymn, Sea Storm…)."
  ]
 },
 {
  "b": 55,
  "v": "4.34",
  "d": "2026-11-14",
  "es": [
   "Cocina en hogueras: 14 hogueras (fuera de cada pueblo y junto a piedras de viaje) con despensa de ingredientes. 50 platos dibujados, cada uno con su efecto: ataque, defensa, velocidad, vel. de ataque, crítico, vida, regeneración, experiencia, oro u oficios.",
   "Recetas de cada reino: solo se cocinan en las hogueras de su región. Incluye platos peruanos: ceviche, tiradito, causa limeña, lomo saltado, ají de gallina, anticuchos, picarones, pachamanca, rocoto relleno, juane, tacacho con cecina, papa a la huancaína, suspiro limeño, mazamorra y chicha morada, y más.",
   "Plato perfecto: sirve el plato cuando la marca pase por la zona dorada y sale ★ con un 50 % más de efecto y más duración.",
   "Pesca legendaria: 12 peces legendarios que solo pican con cierto clima, estación y hora (Rey de la Tormenta, Koi Lunar, Paiche Ancestral…). Sirven para recetas o se liberan para que su espíritu te bendiga 20 minutos.",
   "Bestiario › Peces: todos los peces del juego tienen dibujo nuevo, con récord de tamaño y cuántos has pescado.",
   "Alquimia experimental (con el alquimista): mezcla 2 o 3 ingredientes y descubre 16 pociones, algunas con efectos inesperados (gigante, pluma, explosiva, arcoíris…). Las recetas se guardan en tu grimorio.",
   "Oficio nuevo Arqueología (en la lupa): 8 yacimientos con minijuego de pincel. Reúne las piezas y reconstruye 8 historias del mundo.",
   "Forja artesanal (con el herrero): elige el núcleo de mineral de tu arma, témplalo (hasta 3 estrellas) y grábale una runa de fuego, hielo, rayo, vida, viento o tierra."
  ],
  "en": [
   "Campfire cooking: 14 campfires (outside each town and next to waystones) with an ingredient pantry. 50 drawn dishes, each with its own effect: attack, defence, speed, attack speed, crit, HP, regeneration, experience, gold or jobs.",
   "Kingdom recipes: they can only be cooked at campfires in their region. Includes Peruvian dishes: ceviche, tiradito, causa limeña, lomo saltado, ají de gallina, anticuchos, picarones, pachamanca, rocoto relleno, juane, tacacho, papa a la huancaína, suspiro limeño, mazamorra and chicha morada, and more.",
   "Perfect dish: serve when the marker crosses the golden zone to get a ★ dish with 50% more effect and longer duration.",
   "Legendary fishing: 12 legendary fish that only bite in certain weather, season and hour (Storm King, Moon Koi, Ancestral Paiche…). Use them in recipes or release them so their spirit blesses you for 20 minutes.",
   "Bestiary › Fish: every fish in the game has a new drawing, with size record and how many you caught.",
   "Experimental alchemy (at the alchemist): mix 2 or 3 ingredients and discover 16 potions, some with unexpected effects (giant, feather, explosive, rainbow…). Recipes are saved in your grimoire.",
   "New Archaeology job (in the magnifier): 8 dig sites with a brushing minigame. Gather the pieces and rebuild 8 stories of the world.",
   "Artisan forge (at the blacksmith): choose your weapon's ore core, temper it (up to 3 stars) and engrave a fire, ice, lightning, life, wind or earth rune."
  ]
 },
 {
  "b": 54,
  "v": "4.33",
  "d": "2026-11-14",
  "es": [
   "Pueblos vivos: cada plaza (Albor, Puerto Coral, Arxar, Sahrim, Yarakai y Puerto Brasa) tiene un Tablón del pueblo con periódico, rumores, mercado, ayuntamiento y bazar.",
   "El Pregonero: noticias generadas con lo que pasa en el juego (jefes derrotados, asedios, eventos, alcaldes, vecinos que salvaste) y un rumor nuevo cada día.",
   "Prosperidad de cada pueblo: sube si haces encargos, defiendes el pueblo, donas o vendes lo que necesita; baja si ignoras asaltos y hordas. Por debajo de 25 hay casas abandonadas (tapiadas); desde 75 abre un bazar más barato.",
   "Alcalde: si eres Héroe del pueblo puedes presentarte. Eliges impuestos bajos, normales o altos, cobras las arcas e inviertes en el pueblo. Si tu opinión baja de Neutral, te quitan el cargo.",
   "Día del Tributo cada 7 días (no se puede desactivar): los vecinos pagan al alcalde y, si tienes casa en un pueblo donde no eres alcalde, pagas un pequeño impuesto.",
   "Oficio nuevo Comercio (en la lupa): compra mercancías donde se producen y véndelas donde escasean. 8 mercancías con precios que cambian cada día, con la estación y con los eventos. Al entrar en un pueblo te avisa de lo que pagan bien.",
   "Los vecinos que ayudaste a levantarse te recuerdan: una vez al día, si estás en apuros, uno te lanza una poción."
  ],
  "en": [
   "Living towns: every plaza (Albor, Coral Port, Arxar, Sahrim, Yarakai and Ember Port) has a Town board with newspaper, rumors, market, town hall and bazaar.",
   "The Herald: news generated from what happens in the game (bosses defeated, sieges, events, mayors, villagers you saved) and a new rumor every day.",
   "Town prosperity: rises if you do jobs, defend the town, donate or sell what it needs; drops if you ignore raids and hordes. Below 25 there are abandoned (boarded) houses; from 75 a cheaper bazaar opens.",
   "Mayor: if you are a Hero of the town you can run. Choose low, normal or high taxes, collect the coffers and invest in the town. If your standing drops below Neutral, you lose the post.",
   "Tribute Day every 7 days (can't be turned off): citizens pay the mayor and, if you own a house in a town where you aren't mayor, you pay a small tax.",
   "New Trade job (in the magnifier): buy goods where they are made and sell them where they are scarce. 8 goods with prices that change daily, with the season and with events. Entering a town tells you what pays well.",
   "Villagers you helped up remember you: once a day, if you are in trouble, one throws you a potion."
  ]
 },
 {
  "b": 53,
  "v": "4.32",
  "d": "2026-11-14",
  "es": [
   "🌍 Top mundial: el botón del menú ahora muestra los 50 primeros de todo el mundo en horas jugadas y en nivel máximo, guardados en un servidor.",
   "Tu fila se sube sola cada 2 minutos mientras juegas y al abrir el menú.",
   "Protección contra trampas: las horas no pueden bajar ni subir más rápido que el tiempo real, y el nivel va de 1 a 350.",
   "Sin internet se muestra la última lista guardada."
  ],
  "en": [
   "🌍 World top: the menu button now shows the world's top 50 in hours played and highest level, stored on a server.",
   "Your row uploads by itself every 2 minutes while you play and when the menu opens.",
   "Anti-cheat: hours can't go down or rise faster than real time, and level goes from 1 to 350.",
   "Offline, the last saved list is shown."
  ]
 },
 {
  "b": 52,
  "v": "4.31",
  "d": "2026-11-14",
  "es": [
   "Tiempo jugado en el menú principal (arriba a la derecha): cuenta los minutos y las horas con el juego abierto, también en el menú. Va por cuenta y empieza a contar desde esta versión.",
   "Cada héroe muestra en su botón cuánto tiempo lleva jugado.",
   "Nuevo botón 🏆 Top jugadores: top de horas jugadas y de nivel máximo. Si inicias sesión sales con tu nombre de cuenta.",
   "El top se comparte entre jugadores al conectarse: en los mundos online y unos segundos al abrir el menú."
  ],
  "en": [
   "Time played on the main menu (top right): counts minutes and hours with the game open, menu included. It is per account and starts counting from this version.",
   "Each hero shows its play time on its button.",
   "New 🏆 Top players button: top hours played and highest level. Log in to appear with your account name.",
   "The top is shared between players when they go online: in online worlds and for a few seconds when the menu opens."
  ]
 },
 {
  "b": 51,
  "v": "4.30",
  "d": "2026-11-14",
  "es": [
   "Luna de sangre y eventos: los monstruos ya te atacan dentro del pueblo (antes se quedaban quietos).",
   "Asedio de la luna de sangre más justo: ya no se pierde cuando acaba la noche. Solo se pierde si cae el 60 % de las casas o si te alejas del pueblo. El Devorador Carmesí pisa cada 10-14 segundos y rompe una casa por pisotón.",
   "Hijos más resistentes: tienen tu misma vida a su nivel y reciben un 40 % menos de daño. Si caen, descansan 2 minutos.",
   "En un asedio o ataque a tu pueblo, tus hijos mayores vienen solos a ayudarte y vuelven a casa al terminar.",
   "Los hijos hablan con globos de texto: al llegar, en combate, con poca vida, al ganar y de paseo.",
   "Los enemigos atacan a quien tengan más cerca: a ti o a tus hijos.",
   "Tus hijos salen en el minimapa (rosa si van contigo, naranja si están de expedición, con flecha en el borde si están lejos) y en el mapa grande."
  ],
  "en": [
   "Blood moon and events: monsters now attack you inside towns.",
   "Fairer blood moon siege: it is no longer lost when the night ends; only if 60% of houses fall or you leave town. The Devourer stomps every 10-14 s and breaks one house per stomp.",
   "Tougher kids: same HP as you at their level and 40% less damage taken. They rest 2 minutes if they fall.",
   "During a siege or town attack your grown kids come to help and go home afterwards.",
   "Kids talk with speech bubbles.",
   "Enemies attack whoever is closest: you or your kids.",
   "Your kids show on the minimap and the big map."
  ]
 },
 {
  "b": 50,
  "v": "4.29",
  "d": "2026-11-14",
  "es": [
   "Islas del Cielo: tres pueblos nuevos. Céfira (arpías con alas de colores y nidos gigantes), Aurelia (la última ciudad de los ángeles) y Lumen (ciudad de los acertijos). Allí no entran los monstruos.",
   "Romance con alas: Aelis (ángel guerrera), Nimiel (ángel sanadora), Caelith (lectora de estrellas) y Kiri (arpía cantora), con todo el sistema: corazones, regalos, pasear, besos, pareja, boda e hijos.",
   "Beso francés (Amor 8 y Confianza 6): más largo y cercano; el más bajo se pone de puntillas para que las caras queden a la misma altura con cualquier cuerpo.",
   "Piedras de acertijos en todas las islas del cielo (una pregunta distinta cada día) y la Prueba de la Memoria del Oráculo Vespera en Lumen.",
   "Oficios nuevos: Carrera de Ángeles (vuela por los aros contra tres rivales) y Olimpiadas Angelicales (Tiro celeste y Lluvia de plumas, con medallas). 10 ventajas cada uno.",
   "Archipiélago: Puerto Esmeralda, un gran pueblo en el centro con isleños en bikini y ropa de verano, palmeras, antorchas tiki y más historia. Ailani vende 5 bikinis, camisas hawaianas, bermudas y pareos.",
   "Oficios nuevos: Surf (minijuego de trucos y combos con tabla) y Arte (pinta lo que quieras en pixel art y véndelo en tu galería: se vende solo mientras juegas). 10 ventajas cada uno.",
   "Ixtal, la Ciudad Perdida: un templo al sur de Puerto Esmeralda con un puzle de cuatro estatuas. Dentro, dos mazmorras de nivel 300 (Templo Hundido y Cripta del Sol), 10 enemigos nuevos y 2 jefes con armas y armaduras de tier 23-24.",
   "Experiencia revisada: del nivel 251 al 350 los enemigos dan un 40 % más (ahora hacen falta unos 50 por nivel en todo el juego, como antes del 250).",
   "Fondo Marino: 12 almejas gigantes con minijuego, perlas rosas, doradas y de luna, 30 perlas perdidas escondidas (premio final: Lágrima de Luna), la sirena Perlina que compra perlas y ensarta el Collar de Perlas Doradas, tortugas marinas y la ballena del abismo.",
   "Las ventajas de los oficios nuevos salen en el panel de oficios y en la lupa ⚒."
  ],
  "en": [
   "Sky Isles: three new towns. Cefira (harpies), Aurelia (angels) and Lumen (riddles). No monsters there.",
   "Winged romance: Aelis, Nimiel, Caelith and Kiri with the full system.",
   "French kiss (Love 8, Trust 6): longer and closer; the shorter one goes on tiptoe so faces line up with any body.",
   "Riddle stones on every sky island (new question each day) and Oracle Vespera's Memory Trial in Lumen.",
   "New jobs: Angel Race and Angelic Olympics, 10 perks each.",
   "Archipelago: Emerald Port, a big central town with islanders in bikinis and summer clothes. Ailani sells bikinis, Hawaiian shirts, shorts and sarongs.",
   "New jobs: Surfing (trick and combo minigame) and Art (paint pixel art and sell it in your gallery). 10 perks each.",
   "Ixtal, the Lost City: a statue puzzle and two level 300 dungeons with 10 new enemies and 2 bosses (tier 23-24 gear).",
   "Experience: level 251-350 enemies give 40% more (about 50 kills per level across the game).",
   "Seabed: giant clam minigame, pink, golden and moon pearls, 30 hidden lost pearls, Perlina the mermaid, sea turtles and the abyss whale.",
   "New job perks show in the jobs panel and the ⚒ magnifier tab."
  ]
 },
 {
  "b": 49,
  "v": "4.28",
  "d": "2026-11-14",
  "es": [
   "Hijos equilibrados: a su mismo nivel hacen la mitad de tu daño (nunca más) y tienen el 60 % de tu vida y tu defensa (más con armadura). Tienen su propio nivel, hasta el 350, y ganan experiencia contigo.",
   "Los enemigos también atacan a tus hijos (y los ataques de área de los jefes les alcanzan). Ellos esquivan las zonas rojas.",
   "Barra de vida pequeña siempre visible sobre tus hijos, también en el online.",
   "PvP: tus hijos luchan contra el otro jugador (con daño reducido para no romper el duelo) y él puede golpearlos.",
   "Te acompañan como mucho 2 hijos a la vez. Puedes tener 3 hijos con cada pareja (6 con dos parejas).",
   "Expediciones: manda a un hijo a explorar solo. Viaja en tren, yate, galeón o aeronave, lucha, sube de nivel, guarda lo que encuentra en su mochila (la puedes mirar) y se equipa solo. Si pasas cerca de su campamento, le verás luchando. Puedes formar equipo con él cuando quieras.",
   "Con la familia completa puedes seguir yendo a la cama con tu pareja (escena de corazones).",
   "Los botones de Montar y del armario de tu pareja ya no tapan nada: están en la fila de iconos de arriba (caballo y percha).",
   "Lupa 🔎 → ⚒ Oficios: tu nivel en cada oficio, cómo se hace, para qué sirve y la flecha dorada al sitio más cercano para tu nivel."
  ],
  "en": [
   "Balanced kids: at the same level they deal half your damage (never more) and have 60% of your HP and defence (more with armour). They have their own level, up to 350.",
   "Enemies also attack your kids (boss area attacks hit them too). Kids dodge red zones.",
   "Small HP bar always visible over your kids, online too.",
   "PvP: your kids fight the other player (reduced damage) and can be hit.",
   "At most 2 kids follow you at once. 3 kids per partner (6 with two partners).",
   "Expeditions: send a kid exploring alone. They travel, fight, level up, keep loot in their own bag (view only) and gear up. Pass by their camp to see them. Team up any time.",
   "With a full family you can still go to bed with your partner (heart scene).",
   "Mount and partner wardrobe buttons no longer cover anything: they are in the top icon row.",
   "Magnifier 🔎 → ⚒ Jobs: your level, how it works, what it's for and the golden arrow to the nearest place."
  ]
 },
 {
  "b": 48,
  "v": "4.27",
  "d": "2026-11-14",
  "es": [
   "La escena de la cama al tener un hijo ya se ve siempre: la cámara se centra en la cama (antes quedaba tapada por el panel de misiones), la pareja se dibuja encima de los muebles y la cama matrimonial se elige primero."
  ],
  "en": [
   "The bed scene when having a child is always visible now: the camera centres on the bed (it used to be hidden under the quest panel), the couple is drawn above the furniture and the double bed is picked first."
  ]
 },
 {
  "b": 47,
  "v": "4.26",
  "d": "2026-11-14",
  "es": [
   "El Colgante de Promesa ahora te lo regala la persona cuando llegáis a 10 corazones de Confianza y de Amor (una vez por persona). Con él ya puedes pedirle que sea tu pareja.",
   "Al besaros o abrazaros ya no se ve la línea rara de las manos cogidas.",
   "Tu pareja habla: de vez en cuando dice cosas en un globo de texto según lo que pasa (de noche, en combate, si tienes poca vida, a caballo, en el Velo Roto, en Nochebruma, en brazos, de la mano…). Los demás jugadores también ven sus globos.",
   "Al montar, tu pareja sube detrás de ti y te agarra de la cintura, con cualquier montura (caballos, grifo y dragón) y cualquier cuerpo. Se baja a tu lado al desmontar y también se ve online."
  ],
  "en": [
   "The Promise Pendant is now given to you when you reach 10 hearts of Trust and Love with someone (once per person). With it you can ask them to be your partner.",
   "The odd line of held hands no longer shows while you kiss or hug.",
   "Your partner talks: now and then they say something in a speech bubble depending on what is happening (night, combat, low health, riding, the Broken Veil, Nochebruma, being carried, holding hands…). Other players see the bubbles too.",
   "When you ride, your partner climbs on behind you and holds your waist, on any mount (horses, griffin and dragon) and with any body. They get off beside you when you dismount, and it shows online too."
  ]
 },
 {
  "b": 46,
  "v": "4.25",
  "d": "2026-11-14",
  "es": [
   "Música nueva en todo el Velo Roto (y el Jardín de la Sonrisa): suenan las dos canciones de los vídeos de Sergio, una detrás de otra y en bucle. Sigue el volumen de música de Opciones.",
   "La pareja que te acompaña se ve en el online con la ropa que le hayas puesto en su armario (antes los demás la veían con su ropa de siempre). También se ve en brazos o sobre tus hombros."
  ],
  "en": [
   "New music across the Broken Veil (and the Garden of the Smile): the two songs from Sergio's videos play one after the other, looping. It follows the music volume in Options.",
   "The partner who travels with you is shown online wearing the outfit you chose in their wardrobe (others used to see their default clothes). Also when carried in your arms or on your shoulders."
  ]
 },
 {
  "b": 45,
  "v": "4.24",
  "d": "2026-11-14",
  "es": [
   "Herrería: las armas ya no piden nivel de Herrería en ninguna forja; solo tu nivel, oro y materiales.",
   "Todos los oficios suben 2,5 veces más rápido.",
   "Con tu pareja al lado ya puedes hablar con los demás: «Hablar» elige al otro personaje que tengas delante.",
   "Puedes tener hasta dos parejas. La que tratas pasa a ser la principal, así que boda, casa, cambio de ropa, llevarla en brazos e hijos funcionan con las dos. Las dos viven en tu casa.",
   "Ilvaine, la hechicera del Velo Roto, entra en todo el sistema de pareja: noviazgo, boda e hijos, que pueden heredar su piel lavanda.",
   "Nueva forma de llevar a tu pareja: sobre los hombros (además de en brazos y besarla). Los demás jugadores lo ven.",
   "Al decidir tener un hijo os metéis en la cama y salen corazones durante unos segundos (los demás jugadores ven los corazones).",
   "Nochebruma: un pueblo dark fantasy nevado en el centro del Velo Roto, con nieve azul, luna pálida, faroles en espiral con coronas, árbol de luces, carrusel, trineo de regalos y el Vigilante de Piedra asomando tras la torre. Allí no atacan los monstruos y 6 vecinos te cuentan cómo es su mundo. El Vigilante te quita algo de corrupción."
  ],
  "en": [
   "Smithing: weapons no longer require a Smithing level at any forge; only your level, gold and materials.",
   "Every profession levels up 2.5 times faster.",
   "With your partner next to you, you can now talk to others: \"Talk\" picks the other character in front of you.",
   "You can have up to two partners. The one you interact with becomes the main one, so wedding, home, outfits, carrying and children work with both. Both live in your house.",
   "Ilvaine, the Broken Veil sorceress, joins the whole partner system: dating, wedding and children, who can inherit her lavender skin.",
   "New way to carry your partner: on your shoulders (besides in your arms and kissing). Other players see it.",
   "When you decide to have a child you both get into bed and hearts pop out for a few seconds (other players see the hearts).",
   "Nochebruma: a snowy dark fantasy town in the middle of the Broken Veil, with blue snow, a pale moon, spiral lamps with wreaths, a tree of lights, a carousel, a sleigh full of gifts and the Stone Watcher peering from behind the tower. Monsters do not attack there and 6 villagers tell you about their world. The Watcher removes some corruption."
  ]
 },
 {
  "b": 44,
  "v": "4.23",
  "d": "2026-11-14",
  "es": [
   "Subrazas en el PvP: en un duelo funcionan las 4 habilidades de cada subraza (zarpazo, aullido, salto, almas heladas, atravesar, poseer, lamento, agarre de sangre, murciélagos, sed de sangre…) y el rival ve tu transformación, tus efectos y tus proyectiles en su teléfono.",
   "Las subrazas están igualadas entre sí y no importa tu clase: contra jugadores, el daño de una habilidad de subraza depende de tu nivel y de la habilidad, no del ataque de tu clase. Lobo, fantasma y vampiro hacen el mismo daño por segundo (el vampiro cuenta lo que se cura).",
   "En duelo, Poseer se mete en el rival y le arranca el alma en 4 golpes; Vuelo Nocturno da esquiva.",
   "Rocas de minería (todos los minerales), árboles, hierbas, montículos y puntos de buceo reaparecen a los 5 segundos en el mismo sitio."
  ],
  "en": [
   "Subraces in PvP: in a duel all 4 skills of each subrace work (claw rake, howl, pounce, icy souls, phase through, possess, wail, blood grip, bats, bloodthirst…) and your opponent sees your transformation, effects and projectiles on their phone.",
   "Subraces are balanced against each other regardless of your class: against players, a subrace skill's damage depends on your level and the skill, not your class's attack. Wolf, ghost and vampire deal the same damage per second (the vampire counts its healing).",
   "In a duel, Possess slips into the opponent and tears out their soul in 4 hits; Night Flight gives dodge.",
   "Mining rocks (every ore), trees, herbs, mounds and diving spots respawn after 5 seconds in the same place."
  ]
 },
 {
  "b": 43,
  "v": "4.22",
  "d": "2026-11-14",
  "es": [
   "La lupa 🔎 te guía en todo: la flecha dorada funciona también dentro del Velo Roto y del Jardín de la Sonrisa, y si el sitio está en otro mapa te lleva primero al portal o a la puerta.",
   "Cada secreto de 🗝 Secretos apunta al sitio exacto del paso en el que vas (Fenrik, Malvia, el islote, los pedestales, el altar que falta, los trozos del nombre…).",
   "Nuevo aviso 📍 bajo la misión: te dice cuál es el siguiente secreto y dónde ir. Tócalo para encender la flecha.",
   "Pestañas nuevas en la lupa: 👹 Enemigos (todos, con nivel, botín, dónde salen y flecha al campamento más cercano) y 🐺 Subrazas (pasivas, habilidades, ofrenda y dónde está Corvel).",
   "Lobo: el botón 🐺 pasa ahora por la forma híbrida (pelaje en la cara y el cuerpo, hocico, colmillos y ojos dorados, con tu ropa y tus cosméticos) y luego por el lobo a cuatro patas.",
   "Vampiro: Agarre de Sangre sustituye a Mordisco. Sujeta a un enemigo y le chupa la sangre 2,5 s mientras te curas; también funciona con jugadores online que tengan el PvP activado (en duelo es la única habilidad de subraza que se puede usar)."
  ],
  "en": [
   "The 🔎 guide leads you everywhere: the golden arrow also works inside the Broken Veil and the Garden of the Smile, and if the place is on another map it first takes you to the portal or door.",
   "Each secret in 🗝 Secrets points to the exact place of the step you are on (Fenrik, Malvia, the islet, the pedestals, the missing altar, the pieces of the name…).",
   "New 📍 notice under the quest: it tells you the next secret and where to go. Tap it to turn on the arrow.",
   "New guide tabs: 👹 Enemies (all of them, with level, loot, where they appear and an arrow to the nearest camp) and 🐺 Subraces (passives, skills, offering and where Corvel is).",
   "Wolf: the 🐺 button now goes through the hybrid form (fur on face and body, snout, fangs and golden eyes, with your clothes and cosmetics) and then the four-legged wolf.",
   "Vampire: Blood Grip replaces Bite. It holds an enemy and drinks its blood for 2.5 s while you heal; it also works on online players with PvP on (in a duel it is the only subrace skill you can use)."
  ]
 },
 {
  "b": 42,
  "v": "4.21",
  "d": "2026-11-14",
  "es": [
   "Lanzas, hachas y mazas para el guerrero (24, sacadas de la hoja de Sergio, tiers 22 a 26) con su propia animación de ataque: la lanza llega más lejos, el hacha da más crítico y la maza aturde.",
   "6 mascotas espectrales con su dibujo: Sapo Fúngico, Babosa de Ectoplasma, Búho de las Almas, Polilla Calavera, Lobo de Niebla y Rape Farolillo. Las vende Corvel.",
   "Nueva región del Velo Roto: el Bosque de la Torre Hueca, con niebla azul, la torre de Corvel el Encapuchado, la Biblioteca Anegada de la hechicera Ilvaine y la caldera de la bruja Grizzla.",
   "Nuevo jefe: Ossaryn, el Rey de las Rosas Azules (calavera coronada). Te señala y caen estrellas, hace florecer rosas que atrapan y levanta a sus caballeros.",
   "6 enemigos nuevos con mecánicas: Bruja de la Caldera (charcos de veneno), Espectro de la Niebla (se vuelve intangible y aparece detrás), Huargo Espectral (aullido de manada), Caballero de las Rosas (escudo de espinas), Bibliotecario Ahogado (páginas) y Polilla Calavera Gigante (polvo que ralentiza). En el Velo Roto se gana un 35 % más de experiencia.",
   "Subrazas: Mitad Lobo, Mitad Fantasma o Mitad Vampiro (ritual de Corvel). Cambian tu aspecto en todas las estructuras de cuerpo y tienen pasivas. El botón 🐺/👻/🦇 te transforma cuando quieras: lobo a cuatro patas con el pelaje del color que elijas, fantasma blanco y transparente con tu ropa, o vampiro con alas. Cada una trae 4 habilidades propias (zarpazo, aullido, poseer, mordisco, enjambre de murciélagos, vuelo...). La Poción de Sangre Limpia la quita.",
   "Ilvaine, la Hechicera del Ojo: conjuros nuevos con su botón 🔮 (Ojo del Abismo, Velas Flotantes, Marea de Tinta y Páginas Cortantes), lectura diaria del Ojo, su marca del tercer ojo con labios negros, y se la puede enamorar.",
   "La guía 🔎 tiene una pestaña nueva, 🗝 Secretos: explica paso a paso todas las misiones y mundos secretos del Velo Roto, con pistas que se piden una a una.",
   "Las novedades largas ya no se cortan en la ventana de actualización."
  ],
  "en": [
   "Spears, axes and maces for the warrior (24, taken from Sergio's sheet, tiers 22 to 26) with their own attack animation: the spear reaches further, the axe crits more and the mace stuns.",
   "6 spectral pets with their drawing: Fungus Toad, Ectoplasm Slug, Owl of Souls, Skull Moth, Mist Wolf and Lantern Angler. Corvel sells them.",
   "New Broken Veil region: the Hollow Tower Woods, with blue mist, the tower of Corvel the Hooded, the Flooded Library of the sorceress Ilvaine and the cauldron of the witch Grizzla.",
   "New boss: Ossaryn, King of the Blue Roses (a crowned skull). He points at you and stars fall, makes roses bloom that trap you and raises his knights.",
   "6 new enemies with mechanics: Cauldron Hag (poison puddles), Mist Wraith (turns intangible and appears behind you), Spectral Warg (pack howl), Knight of the Roses (thorn shield), Drowned Librarian (pages) and Giant Skull Moth (slowing dust). In the Broken Veil you earn 35% more experience.",
   "Subraces: Half-Wolf, Half-Ghost or Half-Vampire (Corvel's ritual). They change your look on every body type and have passives. The 🐺/👻/🦇 button transforms you whenever you want: a four-legged wolf with the fur color you choose, a white see-through ghost with your outfit, or a winged vampire. Each brings 4 skills of its own (claw rake, howl, possess, bite, bat swarm, flight...). The Clean Blood Potion removes it.",
   "Ilvaine, the Sorceress of the Eye: new spells with their 🔮 button (Eye of the Abyss, Floating Candles, Ink Tide and Cutting Pages), a daily Reading of the Eye, her third-eye mark with black lips, and she can be romanced.",
   "The 🔎 guide has a new tab, 🗝 Secrets: it explains step by step every secret quest and world of the Broken Veil, with hints you ask for one at a time.",
   "Long patch notes are no longer cut off in the update window."
  ]
 },
 {
  "b": 41,
  "v": "4.20",
  "d": "2026-11-14",
  "es": [
   "Historia principal del Velo Roto con El Hombre sin Rostro: 7 jefes nuevos con diseño y mecánica propios (Ghorm el Gran Brujo Sapo te atrapa con la lengua, Cornaviva embiste, Lady Morwen se divide en reflejos que explotan, Lady Sanguia se cura con tu vida, Baalzor lanza anillos de fuego, el Reflejo Eclipsado copia tu aspecto y alterna inmunidad a habilidades o ataques, y Risotto el bufón salta y deja trampas). Ya son 12 jefes en el continente.",
   "Corrupción del Velo: sube mientras exploras. Con 30 % ves el mundo distinto y salen enemigos corruptos; con 60 % se abren muros secretos, aprendes el Grito del Velo (toca el contador) y algunos personajes te cuentan secretos. Oren la purifica.",
   "Jefes con memoria: si vences a un jefe casi siempre con habilidades o con ataques normales, la próxima vez resiste ese tipo de daño y te da otra recompensa.",
   "Luna de sangre: los jefes del Velo salen en versión Sangrienta, más fuertes y con más botín.",
   "Heredero del Eclipse: al vencer a la Luna Sonriente recibes una corona de eclipse y +8 % de daño de noche.",
   "Bioma secreto: el Jardín de la Sonrisa, solo cuando la luna sonríe (de medianoche a las 3). Criaturas adorables de nivel 350 que abrazan muy fuerte, el Tendero Imposible (Reloj sin Manecillas, Sombra Embotellada, Una Mañana, Mapa de Ninguna Parte) y El Sin Nombre, que no se vence luchando: hay que descubrir su nombre verdadero.",
   "Arma Velada con voluntad propia: habla, crece con cada criatura del Velo y a las 300 te deja elegir entre Guardiana (escudos para ti y tu grupo) o Devoradora (daño y robo de vida contra criaturas malditas).",
   "Tres finales según tus decisiones: El Amanecer, La Nueva Luna o El Heredero Corrupto. Nuevo capítulo de las Crónicas.",
   "Las clases siguen igualadas a nivel 350."
  ],
  "en": [
   "Main story of the Broken Veil with the Faceless Man: 7 new bosses with their own design and mechanic (Ghorm the Great Toad Warlock grabs you with his tongue, Cornaviva charges, Lady Morwen splits into exploding reflections, Lady Sanguia heals from your life, Baalzor casts rings of fire, the Eclipsed Reflection copies your look and switches immunity between skills and attacks, and Risotto the jester blinks and leaves traps). The continent now has 12 bosses.",
   "Veil Corruption: it rises while you explore. At 30% the world looks different and corrupted enemies appear; at 60% secret walls open, you learn the Veil Scream (tap the meter) and some characters tell you secrets. Oren purifies it.",
   "Bosses with memory: if you beat a boss mostly with skills or with basic attacks, next time it resists that damage type and gives a different reward.",
   "Blood moon: Veil bosses appear in a Bloody version, stronger and with more loot.",
   "Eclipse Heir: defeating the Smiling Moon gives you an eclipse crown and +8% damage at night.",
   "Secret biome: the Garden of the Smile, only while the moon smiles (midnight to 3). Adorable level 350 creatures that hug very hard, the Impossible Shopkeeper (Handless Clock, Bottled Shadow, A Morning, Map of Nowhere) and the Nameless One, who cannot be beaten by fighting: you must discover its true name.",
   "Veiled Weapon with a will of its own: it talks, grows with every Veil creature and at 300 lets you choose Guardian (shields for you and your group) or Devourer (damage and lifesteal against cursed creatures).",
   "Three endings based on your choices: The Dawn, The New Moon or The Corrupted Heir. New Chronicles chapter.",
   "Classes remain balanced at level 350."
  ]
 },
 {
  "b": 40,
  "v": "4.19",
  "d": "2026-11-13",
  "es": [
   "Armaduras dark fantasy propias para los tiers 22 a 26, adaptadas a todos los cuerpos: Lobo Nocturno (cuello de pelo y capucha de lobo), Sepulcrales (placas con vidriera de luz y corona), Velo Roto (corsé carmesí, gorguera y velo), Eclipsadas (sol eclipsado, hombreras doradas y casco de cuernos) y Luna Sonriente (traje de bufón con la sonrisa de la luna y cascabeles).",
   "Poder del Velo: desde el nivel 251, cada nivel da +0,5 % de ataque y vida (hasta +50 % a nivel 350). Igual para todas las clases.",
   "Pantano de las Almas Perdidas: nuevo botón de linterna. Apagada, aparecen puentes espectrales hacia un islote con cofres de Esencia Espectral.",
   "Aldea de las Campanas Muertas: Nocturna, la Mercader del Eclipse, solo vende de noche (Elixir del Eclipse y más). Oren te pide decidir: tocar o romper la última campana, y la aldea lo recuerda.",
   "Bosque de los Susurros: lee las 3 estelas y toca los pedestales en orden para disipar las ilusiones que protegen a Varkhul. Si te equivocas, aparece un Imitador con tu propio aspecto.",
   "Catedral del Eclipse: enciende los 3 altares para abrir la reja del Rey de las Campanas.",
   "Castillo de la Luna Sonriente: la Luna te mira y, si te ve, los enemigos se vuelven más rápidos. Al vencerla eliges entre dos finales, cada uno con su recompensa.",
   "Enemigos nuevos: Lancero Sepulcral y Acólito del Velo. Nuevas mecánicas: la cruz de luz del Obispo Hueco y los lanceros de Varkhul.",
   "La guía 🔎 muestra todo lo del Velo Roto: en qué región sale cada material y cómo llegar."
  ],
  "en": [
   "Unique dark fantasy armor for tiers 22 to 26, fitted to every body: Night Wolf (fur collar and wolf hood), Sepulchral (plates with a stained-glass glow and crown), Broken Veil (crimson corset, ruff and veil), Eclipsed (eclipsed sun, gold pauldrons and horned helm) and Smiling Moon (jester suit with the moon's grin and bells).",
   "Veil Power: from level 251, each level gives +0.5% attack and health (up to +50% at level 350). Same for every class.",
   "Swamp of Lost Souls: new lantern button. With it off, spectral bridges appear leading to an islet with Spectral Essence chests.",
   "Village of the Dead Bells: Nocturna, the Eclipse Merchant, only sells at night (Eclipse Elixir and more). Oren asks you to choose: ring or break the last bell, and the village remembers.",
   "Forest of Whispers: read the 3 stelae and touch the pedestals in order to dispel the illusions guarding Varkhul. If you get it wrong, a Mimic with your own look appears.",
   "Cathedral of the Eclipse: light the 3 altars to open the King of Bells' gate.",
   "Castle of the Smiling Moon: the Moon watches you and, if it sees you, enemies get faster. After defeating it you choose between two endings, each with its own reward.",
   "New enemies: Sepulchral Lancer and Veil Acolyte. New mechanics: the Hollow Bishop's cross of light and Varkhul's lancers.",
   "The 🔎 guide shows everything in the Broken Veil: which region drops each material and how to get there."
  ]
 },
 {
  "b": 39,
  "v": "4.18",
  "d": "2026-11-13",
  "es": [
   "Nuevo: el Continente del Velo Roto, dark fantasy, niveles 255 a 350. Por primera vez se ve el cielo: noche, nubes magenta, niebla y la Luna Sonriente.",
   "Para abrir el portal antiguo (al oeste de la Ciudadela de Arxar) habla con Fenrik, el Lobo Viejo, en el Bosque Susurrante y con la bruja Malvia, cerca del Pantano Gris.",
   "Cinco regiones: Pantano de las Almas Perdidas (agua luminosa), Aldea de las Campanas Muertas, Bosque de los Susurros, Catedral del Eclipse y Castillo de la Luna Sonriente.",
   "Enemigos nuevos: Brujo Sapo, Alce Velado, Hechicera Violeta, Hechicera Carmesí, Demonio Cornudo, Soldado Hueco, Diácono del Eclipse y Heraldo Lunar.",
   "Jefes con mecánicas: el Obispo Hueco reza y levanta a sus muertos; los soldados de Varkhul, el Rey Esqueleto, lo cubren hasta que caen; el Rey de las Campanas avisa cada ataque con campanadas, apaga la catedral y se encierra tras tres sellos; la Luna Sonriente lanza rayos, abre los ojos y enfurece a todos.",
   "Nivel máximo 350. Tiers 22 a 26 con las armas dark fantasy de Sergio: mandoble y Espada de la Dama para el guerrero, violín para el bardo, guadaña lunar para el invocador, y armaduras del Lobo Nocturno, Sepulcrales, del Velo Roto, Eclipsadas y de la Luna Sonriente.",
   "Capucha y manto del Lobo Nocturno, materiales nuevos (salen en la lupa 🔎) y un capítulo nuevo de las Crónicas.",
   "PvP reequilibrado para el nivel 350."
  ],
  "en": [
   "New: the Broken Veil Continent, dark fantasy, levels 255 to 350. For the first time you see the sky: night, magenta clouds, fog and the Smiling Moon.",
   "To open the ancient portal (west of the Arxar Citadel), talk to Fenrik, the Old Wolf, in the Whispering Forest and to the witch Malvia, near the Gray Swamp.",
   "Five regions: Swamp of Lost Souls (glowing water), Village of the Dead Bells, Forest of Whispers, Cathedral of the Eclipse and Castle of the Smiling Moon.",
   "New enemies: Toad Warlock, Veiled Elk, Violet Sorceress, Crimson Sorceress, Horned Fiend, Hollow Soldier, Eclipse Deacon and Lunar Herald.",
   "Bosses with mechanics: the Hollow Bishop prays and raises his dead; the soldiers of Varkhul, the Skeleton King, shield him until they fall; the King of Bells announces each attack with tolls, darkens the cathedral and locks himself behind three seals; the Smiling Moon fires beams, opens its eyes and enrages everyone.",
   "Max level 350. Tiers 22 to 26 with Sergio's dark fantasy weapons: greatsword and Lady's Sword for the warrior, violin for the bard, lunar scythe for the summoner, and Night Wolf, Sepulchral, Broken Veil, Eclipsed and Smiling Moon armor.",
   "Night Wolf hood and mantle, new materials (shown in the 🔎 guide) and a new Chronicles chapter.",
   "PvP rebalanced for level 350."
  ]
 },
 {
  "b": 38,
  "v": "4.17",
  "d": "2026-11-13",
  "es": [
   "Los jefes del mundo tienen mecánicas nuevas, siempre avisadas en el suelo: el Rey Slime escupe slime que te deja pegado (rueda para soltarte), el Ent hace brotar raíces, Gruk toca su tambor de guerra (rueda cuando llegue la onda) y se enfurece, Morgana te lanza un maleficio que invierte tus pasos, el Gólem de Hielo congela el suelo, Volcanus hace erupciones de lava y Vael llama a sus soldados y, a mitad de vida, se vuelve inmune hasta que actives 3 sellos dorados.",
   "Mapa: acércalo o aléjalo con dos dedos, arrástralo con uno, o usa los botones + − ⟲."
  ],
  "en": [
   "World bosses have new mechanics, always warned on the ground: the Slime King spits slime that sticks you in place (roll to break free), the Ent makes roots burst out, Gruk beats his war drum (roll when the wave arrives) and enrages, Morgana casts a hex that reverses your steps, the Ice Golem freezes the ground, Volcanus erupts lava and Vael calls his soldiers and, at half health, becomes immune until you activate 3 golden seals.",
   "Map: zoom in or out with two fingers, drag it with one, or use the + − ⟲ buttons."
  ]
 },
 {
  "b": 37,
  "v": "4.16",
  "d": "2026-11-13",
  "es": [
   "Nuevo botón 🔎 «Dónde conseguir» junto al Libro: cada material, arma, armadura, cosmético y jefe con dónde se consigue (monstruos, jefes, minería, tala, tiendas y recetas con sus materiales). «Seguir» enciende la flecha dorada hasta el sitio; vuelve a tocar para apagarla.",
   "Las habilidades de mejora pintan a tu personaje del color de su nombre mientras duran (Furia en rojo, Escarcha en hielo, Invisibilidad en sombra, Fortaleza en oro…) y los escudos muestran una burbuja. Cada habilidad lanza un destello del color de su elemento. Funciona con todos los cuerpos y se ve en el online.",
   "Las criaturas de Altavela usan el dibujo de Sergio, con el mismo detalle que en su imagen.",
   "Las armas superadas pierden como mucho un 30 % de daño (antes 55 %)."
  ],
  "en": [
   "New 🔎 \"Where to get it\" button next to the Book: every material, weapon, armor, cosmetic and boss with where to get it (monsters, bosses, mining, woodcutting, shops and recipes with their materials). \"Follow\" turns on the golden arrow to the place; tap again to turn it off.",
   "Buff skills paint your character in the color of their name while they last (Fury red, Frost icy, Invisibility shadow, Fortress gold…) and shields show a bubble. Every skill casts a flash in its element color. Works with every body and is seen online.",
   "Altavela's creatures use Sergio's drawing, with the same detail as his image.",
   "Outgrown weapons lose at most 30% damage (was 55%)."
  ]
 },
 {
  "b": 36,
  "v": "4.15",
  "d": "2026-11-13",
  "es": [
   "Nuevo: Altavela, el Continente Celestial (nivel 220+). Puerta en la Isla de los Vientos de Celestia.",
   "La capital de los Alados que sobrevivieron, las Llanuras de Nimbo, el Templo de Aeris, los Campos de Tormenta e islotes flotantes que se recorren volando.",
   "Criaturas nuevas: Arpía Maligna, Medusa de Nube, Manta del Viento, Centinela de Aeris y Chispa Errante. Jefes: Kaelyra la Reina de las Arpías, el Coloso de Aeris y Vendaval la Sierpe de Tormenta (voladores).",
   "Tormentas mágicas que cruzan el continente: el cielo se oscurece y caen rayos que avisan antes de caer.",
   "Investigación en grupo con el Archivista Orelio: une fragmentos de mapa roto, descifra las estelas en la lengua de los Vientos y abre las tumbas de los Reyes del Aire. Lo que descubre cada miembro del grupo suma.",
   "3 misiones de la Reina Lyssandra, capa nueva y 2 capítulos de las Crónicas en español e inglés."
  ],
  "en": [
   "New: Altavela, the Celestial Continent (level 220+). Gate on Celestia's Isle of Winds.",
   "The capital of the surviving Winged, the Nimbus Plains, the Temple of Aeris, the Storm Fields and floating islets you reach by flying.",
   "New creatures: Malign Harpy, Cloud Jellyfish, Wind Manta, Aeris Sentinel and Wandering Spark. Bosses: Kaelyra the Harpy Queen, the Colossus of Aeris and Vendaval the Storm Wyrm (flying).",
   "Magic storms sweep across the continent: the sky darkens and lightning strikes after a warning.",
   "Group research with Orelio the Archivist: join broken map fragments, decipher the stelae in the Wind tongue and open the tombs of the Sky Kings. What each group member discovers adds up.",
   "3 quests from Queen Lyssandra, a new cape and 2 Chronicle chapters in Spanish and English."
  ]
 },
 {
  "b": 35,
  "v": "4.14",
  "d": "2026-11-13",
  "es": [
   "Online: ahora se ven los ataques y las habilidades de los demás jugadores (pose, cortes, anillos, rayos, proyectiles y partículas), por sala, WiFi e internet. Los saltos se ven en el aire.",
   "Habilidades más fieles a su nombre: Salto Devastador salta de verdad, Voltereta y Paso de Baile dan un brinco, y Tsunami, Fauces del Megalodón, Cosecha Final y Juicio Final tienen efectos nuevos.",
   "Modo optimizado en Ajustes (sin clima ni lluvia, efectos simples, sin HD, 30 imágenes por segundo). Se activa solo si el juego va con lag.",
   "Menos consumo con el juego quieto y limpieza de memoria para que el juego no se cierre tras mucho rato.",
   "Inventario: botón Seleccionar para tirar varios objetos de una vez, los objetos de misión que ya no necesitas se pueden tirar y una Tarjeta de Tren repetida se convierte en 100 de saldo.",
   "Al equipar o comprar ropa, las listas ya no vuelven arriba.",
   "Las armas de más de 20 niveles por debajo del tuyo pierden fuerza (hasta un 55 %): ya no sirve la espada de cobre hasta el final.",
   "El Velo (mundo espiritual) es ahora un mundo de sueño blanco y acolchado, con árboles de algodón, lago de leche, tumbas y urnas de llama fría.",
   "Arreglo: en el online, las armas y armaduras de tier 16 a 21 se veían como tier 15."
  ],
  "en": [
   "Online: you now see other players' attacks and skills (pose, slashes, rings, beams, projectiles and particles), over room, WiFi and internet. Jumps are seen in the air.",
   "Skills closer to their names: Devastating Leap really jumps, Roll and Dance Step hop, and Tsunami, Megalodon Jaws, Final Harvest and Final Judgment have new effects.",
   "Optimized mode in Settings (no weather or rain, simple effects, no HD, 30 frames per second). It turns on by itself if the game lags.",
   "Lower usage while standing still and memory cleanup so the game doesn't close after a long session.",
   "Inventory: Select button to drop several items at once, quest items you no longer need can be dropped and a duplicate Train Card becomes 100 credit.",
   "When equipping or buying clothes, lists no longer jump back to the top.",
   "Weapons more than 20 levels below yours lose strength (up to 55%): the copper sword no longer works until the end.",
   "The Veil (spirit world) is now a white, quilted dream world with cotton trees, a milk lake, graves and cold-flame urns.",
   "Fix: online, tier 16 to 21 weapons and armor showed as tier 15."
  ]
 },
 {
  "b": 34,
  "v": "4.13",
  "d": "2026-11-13",
  "es": [
   "Armas nuevas de madera, cobre, hierro, acero, plata y oro para todas las clases, con el dibujo de cobre de Sergio: más detalle en la mano (en HD se dibujan al doble) y ataques nuevos en 5 tiempos con su impacto.",
   "Las dagas van una en cada mano, el arco apunta bien y el pez lleva sus aletas en las manos.",
   "Campamento de los Vigías del Alba al este de Albor, en la Costa Coral: 8 miembros con su propio estilo y 5 misiones para ayudar y rescatar gente.",
   "Al unirte te dan su uniforme (abrigo, pantalón y botas) como cosmético; te lo puedes quitar cuando quieras.",
   "Lore nuevo: Edrin Valcorde, el pescador que hace mil años cuidó al primer portador del hilo vacío. Capítulo y pista nuevos en el Libro del Vínculo."
  ],
  "en": [
   "New wood, copper, iron, steel, silver and gold weapons for every class, based on Sergio's copper drawing: more detail in hand (drawn at double size in HD) and new 5-step attacks with their impact.",
   "Daggers go one in each hand, the bow aims properly and the Fish class holds its fins in its hands.",
   "Dawn Wardens camp east of Albor, on the Coral Coast: 8 members with their own style and 5 quests to help and rescue people.",
   "Joining gives you their uniform (coat, trousers and boots) as a cosmetic; take it off whenever you like.",
   "New lore: Edrin Valcorde, the fisherman who cared for the first bearer of the empty thread a thousand years ago. New chapter and clue in the Book of the Bond."
  ]
 },
 {
  "b": 33,
  "v": "4.12",
  "d": "2026-11-13",
  "es": [
   "Los cuerpos femeninos tienen busto: Esbelta y Menuda pequeño, Clásica mediano y Curvas grande.",
   "Se ve con cualquier ropa, armadura o cosmético, de frente y de perfil, y también en las NPCs femeninas."
  ],
  "en": [
   "Female bodies now have a bust: small for Slender and Petite, medium for Classic and large for Curvy.",
   "It shows with any clothes, armor or cosmetic, from the front and in profile, and on female NPCs too."
  ]
 },
 {
  "b": 32,
  "v": "4.11",
  "d": "2026-11-13",
  "es": [
   "Los árboles nunca se extinguen: al talarlos, el tocón se convierte en un retoño y luego vuelve a ser un árbol.",
   "Árboles, arbustos y hierbas quitados con el martillo de construcción vuelven a crecer a los 15 minutos, salvo que hayas construido encima. Las rocas y menas quitadas no vuelven.",
   "Los retoños no se pueden talar hasta que crecen."
  ],
  "en": [
   "Trees never go extinct: after chopping, the stump becomes a sapling and then grows back into a tree.",
   "Trees, bushes and herbs removed with the building hammer grow back after 15 minutes unless you built on that spot. Removed rocks and ores do not come back.",
   "Saplings can't be chopped until they grow."
  ]
 },
 {
  "b": 31,
  "v": "4.10",
  "d": "2026-11-13",
  "es": [
   "Valentina vende tres trajes por oro: Plata y Azul, Carmesí y Oro, y Marcas Rojas y Oro. Se ajustan a las ocho estructuras en las cuatro direcciones."
  ],
  "en": [
   "Valentina sells three outfits for gold: Silver and Blue, Crimson and Gold, and Red Markings and Gold. They fit all eight builds in all four directions."
  ]
 },
 {
  "b": 30,
  "v": "4.9",
  "d": "2026-11-13",
  "es": [
   "Bufandín estrena el sprite del gatito azul con bufanda roja y cuatro fotogramas de caminata por dirección."
  ],
  "en": [
   "Scarfy gets a new blue cat sprite with a red scarf and four walking frames per direction."
  ]
 },
 {
  "b": 29,
  "v": "4.8",
  "d": "2026-11-13",
  "es": [
   "Bufandín redibujado en HD: el doble de resolución, ojos con brillo, orejas rosas, mejillas con mechones, luna en la frente, hocico, cola rizada y una bufanda carmesí con franja dorada y flecos que ondea al caminar."
  ],
  "en": [
   "Scarfy redrawn in HD: double resolution, shiny eyes, pink ears, fluffy cheeks, a crescent moon on its forehead, muzzle, curled tail and a crimson scarf with a gold stripe and fringe that flutters as it walks."
  ]
 },
 {
  "b": 28,
  "v": "4.7",
  "d": "2026-11-13",
  "es": [
   "Nueva boutique en cada pueblo, con tejado morado: Valentina, la modista, vende la colección nueva.",
   "Ropa nueva: Suéter de Punto Medianoche (cuello de cuadrícula, franja carmesí, puños rosas), Pantalón Holgado Café, Zapatillas Carmesí, Tirita en la Mejilla, Vestido de Noche Carmesí y Chaqueta de Cuero. Se ajustan a las 8 estructuras.",
   "Nueva mascota: Bufandín, el Gato Viajero (+6% de velocidad y +4% de crítico).",
   "PvP equilibrado a nivel máximo: todas las clases pueden hacerse frente. En duelo las curas y escudos rinden menos, y cada clase tiene un ajuste de daño solo para PvP.",
   "Las invocaciones del Invocador ahora también atacan al rival en un duelo."
  ],
  "en": [
   "New boutique in every town, with a purple roof: Valentina, the designer, sells the new collection.",
   "New clothes: Midnight Knit Sweater (grid collar, crimson stripe, pink cuffs), Baggy Brown Trousers, Crimson Sneakers, Cheek Bandage, Crimson Evening Dress and Leather Jacket. They fit all 8 builds.",
   "New pet: Scarfy, the Wandering Cat (+6% speed and +4% crit).",
   "PvP balanced at max level: every class can stand up to the others. In duels heals and shields are weaker, and each class has a PvP-only damage adjustment.",
   "Summoner spirits now also attack your opponent in a duel."
  ]
 },
 {
  "b": 27,
  "v": "4.6",
  "d": "2026-11-13",
  "es": [
   "Multas: todos los guardias cobran, también el Guardia Rolf en Albor y el Capitán Darius en Arxar, y cualquiera acepta las multas de cualquier pueblo (así se pagan las de Yarakai y Puerto Brasa).",
   "Nuevo panel «Multas y antecedentes» al hablar con un guardia: lo que debes en cada pueblo, pagar una o todas.",
   "Si eres Criminal en un pueblo sin multa registrada, puedes pagar para limpiar tu nombre.",
   "Si no debes nada, el guardia te lo dice.",
   "El Colgante de Promesa ya no pide nivel de Joyería."
  ],
  "en": [
   "Fines: every guard collects them, including Guard Rolf in Albor and Captain Darius in Arxar, and any guard accepts fines from any town (so Yarakai and Puerto Brasa fines can be paid).",
   "New \"Fines and record\" panel when talking to a guard: what you owe in each town, pay one or all.",
   "If you are a Criminal in a town with no recorded fine, you can pay to clear your name.",
   "If you owe nothing, the guard tells you.",
   "The Promise Pendant no longer needs a Jewelry level."
  ]
 },
 {
  "b": 26,
  "v": "4.5",
  "d": "2026-11-13",
  "es": [
   "Ajuste automático: cascos, sombreros, coronas, orejas y cuernos se adaptan solos a la cabeza de cada estructura; los sombreros muy altos se encogen para no salirse.",
   "Las prendas nuevas que se añadan al juego se colocarán solas en las 8 estructuras.",
   "Arreglo: el casco del guerrero tapaba un poco el ojo derecho.",
   "Arreglo: las capuchas del asesino y el invocador tapaban el borde del ojo en la estructura Robusto.",
   "Los sombreros de los NPCs también se ajustan a su cabeza."
  ],
  "en": [
   "Automatic fit: helmets, hats, crowns, ears and horns adapt to the head of every build; very tall hats shrink so they stay on screen.",
   "New gear added to the game will fit all 8 builds on its own.",
   "Fix: the warrior helmet slightly covered the right eye.",
   "Fix: assassin and summoner hoods covered the edge of the eye on the Sturdy build.",
   "NPC hats also fit their heads."
  ]
 },
 {
  "b": 25,
  "v": "4.4",
  "d": "2026-11-13",
  "es": [
   "3 estructuras nuevas de cuerpo y cabeza por sexo, además de la clásica: Héroe, Atlético y Robusto; Esbelta, Curvas y Menuda. Se eligen en «Estructura» al crear el personaje o en la peluquería.",
   "La estructura Héroe tiene los ojos de la referencia: ceja del color del pelo, ojo 2×2 con brillo y boca pequeña.",
   "Ropa, armaduras, cosméticos, pelo y armas se ajustan a cada estructura en las cuatro direcciones.",
   "Los NPCs y los enemigos humanos tienen estructuras variadas.",
   "Los demás jugadores ven tu estructura por WiFi local y por internet.",
   "Arreglo: las gafas de sol se ponían sobre la frente; ahora tapan los ojos."
  ],
  "en": [
   "3 new body and head builds per gender besides the classic one: Hero, Athletic and Sturdy; Slender, Curvy and Petite. Pick them under \"Build\" when creating your character or at the stylist.",
   "The Hero build has the reference eyes: brows in the hair colour, 2×2 eyes with a highlight and a small mouth.",
   "Clothes, armor, cosmetics, hair and weapons fit every build in all four directions.",
   "NPCs and human enemies have varied builds.",
   "Other players see your build over local WiFi and online.",
   "Fix: sunglasses sat on the forehead; they now cover the eyes."
  ]
 },
 {
  "b": 24,
  "v": "4.3",
  "d": "2026-11-13",
  "es": [
   "Actualizador interno: el juego busca versiones nuevas en GitHub, te avisa y se reinicia con el contenido nuevo sin reinstalar el APK.",
   "Botón «Buscar actualización» en el título y en Ajustes › Actualizaciones.",
   "Sección de Novedades con los cambios de cada versión; se abre sola la primera vez tras actualizar.",
   "Si una versión descargada falla al arrancar, el juego vuelve solo a la versión instalada."
  ],
  "en": [
   "Built-in updater: the game checks GitHub for new versions, lets you know and restarts with the new content without reinstalling the APK.",
   "\"Check for updates\" button on the title screen and in Settings › Updates.",
   "What's New section with the changes of every version; it opens by itself the first time after an update.",
   "If a downloaded version fails to start, the game goes back to the installed version on its own."
  ]
 },
 {
  "b": 23,
  "v": "4.2",
  "d": "2026-11-12",
  "es": [
   "Nuevo estilo chibi para todos los personajes y NPCs: cabeza más alta, ojos 2×3 con brillo, boca pequeña y rubor.",
   "Pelo con más volumen, ondas y mechones claros.",
   "Cintura marcada en los personajes femeninos."
  ],
  "en": [
   "New chibi style for every character and NPC: higher head, 2×3 eyes with highlights, small mouth and blush.",
   "Hair with more volume, waves and light strands.",
   "Defined waist on female characters."
  ]
 },
 {
  "b": 22,
  "v": "4.1",
  "d": "2026-11-12",
  "es": [
   "Detalle HD suavizado: sin cuadrículas blancas en la ropa.",
   "Tu pareja te atiende en su tienda aunque seas Criminal en ese pueblo."
  ],
  "en": [
   "Softer HD detail: no more white grids on clothes.",
   "Your partner serves you in their shop even if you are a Criminal in that town."
  ]
 },
 {
  "b": 21,
  "v": "4.0",
  "d": "2026-11-12",
  "es": [
   "Gráficos HD: el juego se dibuja al doble y la ropa, armaduras y NPCs tienen detalle fino (se puede desactivar en Ajustes).",
   "Cara más alta en todos los personajes.",
   "Trajes Dama Esmeralda, Danzarina del Ocaso y Rey del Cielo Blanco en las tiendas de cosméticos."
  ],
  "en": [
   "HD graphics: the game is drawn at double resolution and clothes, armor and NPCs get fine detail (can be turned off in Settings).",
   "Higher face on every character.",
   "Emerald Lady, Dusk Dancer and White Sky King outfits in the cosmetics shops."
  ]
 },
 {
  "b": 20,
  "v": "3.9",
  "d": "2026-11-11",
  "es": [
   "Mapa con iconos y leyenda de tiendas y servicios, y flechas para ver los 6 mundos.",
   "Accesorios ajustados a su límite y accesorios de clase del cielo.",
   "Set cosmético del Heraldo Nocturno.",
   "Espadas nuevas de las hojas 4 y 5."
  ],
  "en": [
   "Map with icons and a legend for shops and services, plus arrows to see all 6 worlds.",
   "Accessories capped to their limit and sky class accessories.",
   "Night Herald cosmetic set.",
   "New swords from sheets 4 and 5."
  ]
 },
 {
  "b": 0,
  "v": "3.8",
  "d": "",
  "es": [
   "Libro del Vínculo con lore, pistas y rumores; Nihil, el Ente Oscuro.",
   "Bloqueo y contraataque perfecto, jefes que aprenden, runas del mago, armas malditas y armas que hablan.",
   "Asedio de la Luna de Sangre, pueblos que crecen con donaciones y festivales con minijuegos.",
   "Islas del Cielo: nivel 250, aeronave, grifo, alas, tiers 19–21 y evolución de clase."
  ],
  "en": [
   "Book of the Bond with lore, clues and rumors; Nihil, the Dark Entity.",
   "Block and perfect counter, bosses that learn, mage runes, cursed weapons and talking weapons.",
   "Blood Moon siege, towns that grow with donations and festivals with minigames.",
   "Sky Islands: level 250, airship, griffin, wings, tiers 19–21 and class evolution."
  ]
 },
 {
  "b": 0,
  "v": "3.7",
  "d": "",
  "es": [
   "Construcción libre: mesa de trabajo, paredes, suelos, puertas, ventanas, vallas y muebles, sincronizada en multijugador.",
   "Casa nueva con jardín, cuartos y planta alta.",
   "3 cuevas de nivel 150–178, maestros de oficio y Crónicas del Vínculo."
  ],
  "en": [
   "Free building: workbench, walls, floors, doors, windows, fences and furniture, synced in multiplayer.",
   "New home with a garden, rooms and an upper floor.",
   "3 caves for levels 150–178, job masters and the Chronicles of the Bond."
  ]
 },
 {
  "b": 0,
  "v": "3.6",
  "d": "",
  "es": [
   "Sprites de armas Estelares, Primordiales y Divinas.",
   "Logo nuevo, interfaz dorada con atardecer y fuente pixel.",
   "Juego completo en inglés."
  ],
  "en": [
   "Stellar, Primordial and Divine weapon sprites.",
   "New logo, golden sunset interface and pixel font.",
   "Full English translation."
  ]
 },
 {
  "b": 0,
  "v": "3.5",
  "d": "",
  "es": [
   "Sprites de armas de tier 7–15, espadas con estilo y legendarias.",
   "Vista animada del ataque en la enciclopedia."
  ],
  "en": [
   "Weapon sprites for tiers 7–15, styled swords and legendaries.",
   "Animated attack preview in the encyclopedia."
  ]
 },
 {
  "b": 0,
  "v": "3.4",
  "d": "",
  "es": [
   "Armas de tier 1–6 con sprites propios.",
   "Llevar a tu pareja en brazos, hijos con vida y mascota en casa."
  ],
  "en": [
   "Tier 1–6 weapons with their own sprites.",
   "Carry your partner, kids with HP and a pet at home."
  ]
 },
 {
  "b": 0,
  "v": "3.3",
  "d": "",
  "es": [
   "Clase Pez, Aldara, peluquería y Ascensión al nivel 190.",
   "Inventario de 200, gestos y grupos de 6 con monstruos sincronizados."
  ],
  "en": [
   "Fish class, Aldara, barber and Ascension at level 190.",
   "200-slot inventory, emotes and parties of 6 with synced monsters."
  ]
 },
 {
  "b": 0,
  "v": "3.2",
  "d": "",
  "es": [
   "Online por internet: salas privadas con código y 5 mundos públicos."
  ],
  "en": [
   "Internet online: private rooms with a code and 5 public worlds."
  ]
 }
]
/*CL_END*/;

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
