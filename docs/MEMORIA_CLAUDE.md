# The Bound: memoria para otra cuenta de Claude

Pega este archivo al empezar un chat nuevo (o di «lee `docs/MEMORIA_CLAUDE.md` y `docs/NOTAS.md`»).
Repositorio: **github.com/ventisca-gif/the-bound**. Versión actual: **5.50 (build 171)** (19-11-2026). Lo de cada versión, en `docs/NOTAS.md` (al principio, la lista de versiones; al final, una sección por versión). La 5.13 añadió Perú (Lima), la 5.14 Lima Norte, la 5.15 México y el nivel 500, la 5.16 España (`src/6zz9zzs_espana.js`, `src/6zz9zzt_espana2.js`), la bahía de Acapulco y criaturas con dibujo propio. El detalle de cada versión está en `docs/NOTAS.md` y el lore en `docs/LORE.md`.

## Quién es Sergio y cómo trabajar con él

- Sergio crea **The Bound**, un RPG 2D de mundo abierto en pixel art (estilo MMORPG para móvil, con online, PvP, romance, familia, oficios y muchos mapas). Juega en Android con una APK que se actualiza sola.
- Escribe en español, con listas largas, capturas del móvil y faltas de ortografía. Quiere que se haga **todo lo que pide de una vez**.
- Responde siempre en **español**, corto y concreto: qué se hizo, qué no y por qué. Sin jerga técnica.
- **Al terminar una versión: abre el pull request a `main` y fusiónalo tú mismo, sin preguntar.** Los teléfonos leen `update/version.json` de `main` y se actualizan solos.
- Si manda pixel art, extrae los sprites de la imagen (cuadrícula con FFT, centro de cada celda, recortar fondo); no los redibujes.
- Antes de un cambio visual grande, haz una muestra con el propio motor. Si ya dijo «sí a todo», sigue.
- **Contenido nuevo (lo pidió en la 4.96):** prefiere actividades interactivas y oficios/trabajos (dan oro, objetos para vender o decorar, experiencia de oficio) en vez de más poder; nada de buffs de fuerza nuevos salvo que lo pida. Zonas nuevas con **mucha gente** (japonesas y japoneses, en kimono si encaja), con **subidas y bajadas** (terrazas, muros, escaleras), que **salgan en el mapa con sus puntos** y que el mapa se pueda **ampliar y mover** si la zona no entra.
- Lo que Sergio añadió por su cuenta en otras versiones (personajes de otras franquicias) **no se toca**: es su juego. Claude no crea personajes de otras franquicias; propone una versión original.

## Lo que Sergio pidió recordar (5.03-5.07 y después)

- **Transformaciones (5.41):** todas las formas conseguidas (lobo, fantasma, vampiro, dragón…) se guardan en `P.srOwn` y se elige cuál usar en 🌀 Transformaciones. El porcentaje de cada forma es fijo (no sube), pero se aplica sobre las estadísticas finales: con mejor armadura, espada o nivel da más fuerza. Una forma nueva debe entrar en ese sistema, con misión, materiales y guía en la Lupa › Subrazas. Antes de añadir una forma, hacer muestra con el motor. Dragón (5.42): Mitad +6 %, Híbrida +16 %, Híbrido 2.0 +26 % (rango 5), Dragón +32 %; todo del color del pelo.
- **Pelo y escamas encima de la ropa (5.45/5.47):** en cualquier transformación con pelo, escamas o cristales (lobo, dragón, hielo…) esos detalles se pintan ENCIMA de la armadura y los cosméticos, y las orejas/cuernos no los tapa ningún casco. Hacerlo así en las formas nuevas. Gremios online (5.47) en Atajos: Firebase `cl/cm/cc`; si se cambian las reglas, Sergio tiene que pegarlas en la consola.
- **Fusiones y maestría (5.49):** las fusiones van en 🌀 Transformaciones › Fusiones y piden maestría 12 en cada forma (rango máx. 12; 150 puntos por rango, 2 por monstruo). Una fusión tiene colores fijos (el pelo no cambia). Cada forma tiene 3 poderes (`FORM_POW`). El lore de toda forma nueva: «el hilo aprende el patrón de otro ser» (LORE §30). Comprobar siempre que las formas se ven en el online (`lkGear` en `upsertRemote`).
- **Oficios (5.43):** dan solo +0,1 % de crítico y +0,1 % de defensa, y a cambio cosas nuevas por nivel: marcos de retrato con diseño, mascotas y monturas del país (Japón: `JP_REW`). Antes de añadir algo, comprobar que no exista (el fotógrafo con álbum y el mercado entre jugadores ya estaban). **5.44** Alado Caído (nivel 230, Brisa/Seraviel) y Eco sin Pintar (nivel 360, Mael/Eco del Vencido), a 1-2 % del dragón. Regla de Sergio: el nivel de una forma nueva = el de la zona donde se consigue; su fuerza se compara con el dragón. **5.45** escamas de las formas híbridas encima de cualquier ropa (pedido de Sergio: las transformaciones deben verse sobre la ropa). Lista pendiente en NOTAS § 5.45.

- **No borrar nada nunca.** Ampliar encima de lo que hay; si algo se rediseña, mismos ids y objetos.
- **Ropa nueva que no se repita** con la existente: cada prenda con forma propia (`fitKind`), no solo otro color. Comprobarlo comparando con todos los `COSM` antes de publicar (ver 5.05). Muestra del motor antes de publicar ropa.
- **Todo lo nuevo debe verse en el multijugador** (WiFi y online): armaduras, ropa, peinados, habilidades, fans… Probar con `tests/net501` y una prueba de dos páginas por WebRTC.
- **Todo sistema nuevo va también a la Lupa › Sistemas** (arriba de la lista) y, si tiene sitio, al **mapa con su icono**.
- **Mapas de todos los mundos bonitos** y con todo lo que hay (ciudades, castillos, volcanes, árboles, nombres de zonas), no solo colores. Se deben poder **deslizar hasta todos los bordes**.
- **Las ventanas no deben volver arriba** al elegir algo: conservar el desplazamiento (ver `6zz9zz9a_scroll.js`).
- **Oficios**: que den cosas con sentido (productos, muebles, ropa, platos, oro) y no tarden demasiado; la fuerza que dan es pequeña (máximo +1 % en total).
- **Iconos**: dibujos claros por habilidad; nada de manchas marrones.
- **Trabajos y juegos sin ventanas (5.24-5.25):** los oficios y actividades se juegan **dentro del mapa**, moviéndote con el joystick y usando ⚔, con NPCs, objetos y efectos en el mundo (sandboard bajando la duna, partido real de fútbol, vóley en la cancha, bailes en la tarima, taquero, cajero, Tomatina, golf). **Nada de minijuegos en ventana/modal.** Excepciones que Sergio aceptó: lotería y piñata. Cada mecánica nueva debe ser propia (no reutilizar la misma). Los oficios de los países deben subir rápido (×3 de experiencia, `COUNTRY_JOBS`).
- Cuando dice «si quieres», propón y hazlo si encaja; si no está claro qué quiere, pregunta en una línea.

## Cómo se trabaja en el código

- Todo el juego está en `src/*.js` (se concatenan en orden alfabético con `python3 build.py` → `dist/test.html`). Cada versión nueva va en su propio archivo al final (`src/6zyz…`), envolviendo funciones existentes: `{ const _f = f; f = function () { … return _f.apply(this, arguments); }; }`.
- Antes de crear un nombre global (`const X`), comprueba que no exista ya (`grep -n "^const X\b" src/*.js`): si se repite, `build.py` falla.
- Textos nuevos con `L2('español', 'english')`.
- En una sesión nueva falta `tools/i18n/vendor/acorn.js` (no está en git): `npm pack acorn@8.14.0`, descomprime y copia `package/dist/acorn.js` ahí.
- Pruebas: `python3 tests/play.py file://$PWD/dist/test.html out.png 1000 452 @tests/<nombre>.txt` → debe terminar en `JS> []`. Pruebas de las últimas versiones: `tests/v427.txt`, `v428.txt`, `v429.txt`, `v429b.txt`, `v429c.txt`, `v430.txt`, `v431.txt`, `family.txt`, `v424.txt`.
- Ropa, armaduras y cosméticos nuevos: `fitKind(...)` y `python3 tools/dev/fitcheck.py file://$PWD/dist/test.html out` con **0 avisos**. Hay 4 estructuras de cuerpo por sexo; nunca números fijos de píxel.
- Si tocas daño, vida, curas, armas o accesorios: `python3 tools/dev/pvp.py file://$PWD/dist/test.html` (fuerza de cada clase entre 0,9 y 1,1). Si se sale, `--solve` y copia el `PVP_CLS sugerido` en `src/6zyb_pvp.js`. Ojo: un accesorio sin clase muy fuerte rompe el PvP (pasó en la 4.29).
- Publicar una versión: sube `GAME_VER`/`GAME_BUILD` en `src/6zv_update.js`, añade la entrada al principio de `CHANGELOG` (es y en), cambia el pie `tfoot` en `template.html`, `python3 tools/dev/release.py`, commit, push a la rama de trabajo, PR a `main` y fusionar.
- La APK se firma con la clave de siempre (`THEBOUND_KEYSTORE`, `THEBOUND_SIGNING_PASSWORD`); nunca la subas ni generes otra. Solo hace falta APK nueva si cambia `tools/apk/` (`UPD_MIN_APK`).
- **Guardado**: `serializeP` solo guarda los campos de `SAVEKEYS` (52_player.js). Todo campo nuevo de `G.P` necesita `SAVEKEYS.push('campo')` o se pierde al recargar (pasó con los títulos en la 4.53).
- **Lupa**: todo lo nuevo que se consigue (ropa, sistemas, jefes…) se explica en la lupa › Sistemas (`GSIS.push([clave, título, () => [líneas], () => null])`) en español e inglés con `L2`.
- **Números**: la letra pixelada confunde el 8 con la S. Si Sergio pide «números más grandes» quiere letra más grande y clara (Verdana negrita), no cambiar el cálculo (error de la 4.55).
- **Rendimiento**: nunca usar `ctx.filter` en cada fotograma (tiñe una copia en caché, ver `tintAtlas` de la 4.54). Medir con Playwright y `Emulation.setCPUThrottlingRate` 6 (simula un móvil).
- **Sprites desde imágenes de Sergio**: `tools/art/sheet_extract.py` (`find`/`cut`/`shrink`/`pack`), `tools/art/make_v447.py`, `tools/art/make_hd.sh`; originales en `tools/art/ref`. Se incrustan como PNG en base64 en `src/6zyz*0_art*.js`.
- **Pruebas recientes**: `tests/v441.txt` … `tests/v457.txt` (todas deben acabar en `JS> []`).
- Reglas del repositorio: `AGENTS.md` (sprites, caminata, estilo HD, ajuste de prendas, PvP). Historial detallado de cada versión: `docs/NOTAS.md`.

## Qué tiene el juego (resumen)

- Tierras de la Ventisca (sin monstruos, se llega en avión desde el Aeródromo de Albor): Japón, Perú (Lima, Lima Norte, Trujillo, Cusco y Machu Picchu), México (Acapulco incluido) y España.
- Mundo principal con pueblos (Albor, Puerto Coral, Arxar, Sahrim…), tren, barcos, yate, monturas, casas, construcción, mascotas, oficios, festivales, reinos, coliseo, eventos (luna de sangre con asedio del Devorador Carmesí), online con chat, grupos y PvP.
- Otros mapas: Fondo Marino y Nerea (buceo desde Isla Brasa), El Archipiélago (galeón, nivel 160), Islas del Cielo / Celestia (aeronave, nivel 200), Altavela (nivel 220), El Velo (mundo espiritual) y el Continente del Velo Roto (nivel 250-350, Nochebruma, subrazas lobo/fantasma/vampiro).
- Nivel máximo 500 (400 desde la 4.70; 500 desde la 5.15, con el Desierto de las Lomas, Monte Osore y Desierto de las Ánimas de nivel 410-500). Clases: guerrero, mago, arquero, asesino, bardo, invocador, pez. Ascensión y evoluciones.
- Romance con dos medidores (Confianza y Amor, 10 corazones), regalos, pasear de la mano, llevar en brazos o a hombros, besos (normal y francés), pareja (hasta dos), boda, casa, hijos (3 por pareja) y escena de la cama con corazones.

## Versiones 5.08 – 5.32 (una línea cada una; detalle en `docs/NOTAS.md`)

- **5.08-5.09** Ado en Japón y su peinado nativo. **5.10** misiones separadas por tipo. **5.11** Bitácora, logros y juegos. **5.12** trenes de Japón, avión caminable.
- **5.13** Lima · **5.14** Lima Norte, Metropolitano y Tren Eléctrico · **5.15** México, Gamarra y nivel 500 · **5.16** España, Acapulco, criaturas y comidas.
- **5.17** botón «Mapas secundarios» (`MAPW_MAIN` en `src/6zt_v39.js`). **5.18** botón ▦ Atajos (`src/6zz9zzu_atajos.js`) y 🌀 Transformaciones.
- **5.19** fiestas y trabajos en México, Perú y España. **5.20** armaduras de los tres países, minerales y ropa de marinera. **5.21** Trujillo, bus interprovincial y casas en otros países. **5.22** arreglos de viaje y casa. **5.23** monturas, mascotas y fiestas de los países.
- **5.24-5.25** juegos y oficios de los países dentro del mapa (sandboard, fútbol, vóley, bailes, taquero, cajero, Tomatina, golf). **5.26-5.27** rendimiento de Lima (Plaza de Armas, peatones, procesión). **5.28** 20 oficios en Lima, Trujillo, México y España.
- **5.29** Cusco y Machu Picchu (historia extra real en el Libro), llama, superdeportivo, mascotas con bono. **5.30** juego a prueba de errores, cobrador de combi con interior, clientes que hablan.
- **5.31** arreglo del personaje invisible (Avatar de Guerra + poncho/blusas). **5.32** historias de Velmira, Escalera de Nubes y eco de Aurel; Nilo, el joven aprendiz que avisa y guía a cada historia.
- **5.33** «📋 Para qué sirve» al tocar cualquier objeto del inventario y Lupa › 🎒 Objetos con buscador (`src/6zz9zzzzzzzzzz_usos.js`). Todo sistema nuevo que gaste objetos debe añadirse a `usoBuild` o `USO_X`. **5.34** también copia lo que dice la Lupa (Sistemas/Oficios) de cada objeto: Sergio dijo que la Lupa es la referencia («ahí dice todo»), así que explica bien cada sistema nuevo en la Lupa nombrando sus objetos. **5.35** todos los objetos tienen «Dónde conseguir» (`usoSrcExtra`/`USO_SRC`): un objeto nuevo debe tener fuente (`tests/v533.txt` → «sin fuente» 0).
- **5.36** ordenar y favoritos (★ = `s.lock`), lista de la compra, baúl compartido entre héroes y 3 oficios en Japón (jardinero del Kinkaku-ji, pescador de barca en Asakusa, mensajero en bici en Tokio), en `src/6zz9zzzzzzzzzzz_v536.js`. Sergio ahora llama «transformaciones» a las subrazas (lobo, vampiro, fantasma).
- **5.37** 27 accesorios de cara con hueco propio (`P.app.fa`, Armario › 👓 Cara), +0,1 % crítico y defensa. Sergio quiere ventajas mínimas (0,1 %) en oficios y ropa nueva. **5.38** se lleva uno de cada tipo a la vez (ojos, nariz, boca, orejas, mejillas), 40 accesorios, Rastreador propio (no copiar objetos de otras franquicias: se hace versión original).
- **5.39** cuarta transformación **Mitad Dragón** (nivel 450, brasa de Ignaroth, color del pelo, la más fuerte). Muestra previa aprobada por Sergio. **5.40** se consigue con misiones (Nilo → Corvel: brasas y escamas) y la Lupa › Subrazas explica cómo conseguir cada forma y su historia. Sergio quiere que todo lo que se consiga tenga misión/materiales y guía en la Lupa.

## Versiones 4.79 – 4.96

- **4.79-4.80** 30 peinados anime (`src/6zz9u_pelo_anime.js` y `6zz9v_v480.js`, marca `ah` en `HS_F`/`HS_M`, pincel de mechones `ahLock`/`ahCap`). Nevadas cortas (30-75 s).
- **4.81** sur de Albor con el **Camposanto del Alba** y el **Aeródromo** (aviones animados, terminal, billete a Japón nivel 400); los descendientes **envejecen, se jubilan a los 65 y mueren de viejos** (tumba en el camposanto, árbol genealógico); **Japón** (`src/6zz9y_japon.js`, mapa 320×220: Fuji, Kioto, Akihabara, Tokio, Shinjuku, Asakusa, aeropuerto; coches, semáforos, 78 NPCs sin nombre, karaoke, ramen, konbini, recreativos). Sergio dijo que esto es **la primera parte de Japón**: después pedirá más (más edificios en los que entrar, más cosas japonesas).
- **4.82** Japón, segunda parte (`src/6zz9z_japon2.js`): pasto nuevo con tonos, matas y flores; mapa de Japón en el panel (flechas); calles de Akihabara/Shinjuku con edificios estrechos y altos pegados, carteles verticales, cables entre postes, callejones con puestos de takoyaki y yakitori, cruce de Shibuya con pantallas gigantes y multitud, taxis y peatones. Siguiente: más edificios en los que entrar y más cosas japonesas (lo que pida Sergio).
- **4.83** Japón, tercera parte (`src/6zz9za_japon3.js`): mapa 320×300 con Osaka (Dōtonbori), Okinawa (Acuario Churaumi), Cuesta de Nagasaki y Fushimi Inari; idols STELLA☆LINK con sala de conciertos, wotagei, carrera de idol propia con rangos y títulos, tienda de recuerdos; rally de 10 sellos; omikuji; paseo en barco.
- **4.84** 8 trajes de idol (`src/6zz9zb_idol_moda.js`) de las referencias de Sergio, para todas las estructuras; los vende la estilista Mio en la sala STELLA☆LINK. Lupa con Japón por partes e ideas pendientes (onsen, café de gatos, kimonos, historia y romance de idols).
- **4.85** (`src/6zz9zc_japon4.js`) onsen del Fuji, café de gatos y tienda de kimonos con interior; romance con las 13 idols (STELLA☆LINK + grupo nuevo PRISM8 en Shibuya); peinado «Lobo en capas»; Diva Virtual en turquesa; 9 looks más y 6 kimonos.
- **4.86** (`src/6zz9ze_japon5.js`) Ruri (PRISM9, sprite extraído del dibujo de Sergio con beso y abrazo), Melena de Ruri, pelo Turquesa vivo, tienda de cómics con mangas legibles, mapa de las Tierras sin Pintar.
- **4.87** peinado «Melena de puntas» para chicos y chicas (`src/6zz9zf_pelo_puntas.js`).
- **4.94–4.96** peinados de referencia arreglados (perfil y espalda, sin cortes), puntas bicolor, y Japón al este (`src/6zz9zq_japon6.js`): Takayama (pueblo Edo) e Higashiyama (Kioto antiguo en cuesta), oficios rickshaw, sakero, té y cerámica, mapa de otros mundos ampliable y desplazable.
- Carteles japoneses: `python3 tools/dev/jp_glyphs.py` regenera `src/6zz9w_jp_glyphs.js` (añade el texto nuevo a `JP_TEXTS` o úsalo en los archivos que escanea).
- La pantalla del móvil mide unas 24×13 casillas: un dibujo más alto que ~12 casillas no se ve entero (por eso el Fuji y la torre son más pequeños y la cámara sube cerca).

## Versiones antiguas (4.27 – 4.62)

- **4.27** escena de la cama siempre visible (la cámara se centra en la cama).
- **4.28** hijos con nivel propio hasta 350 y fuerza relativa a la tuya (50 % de tu daño), barra de vida siempre visible, los enemigos los atacan, esquivan, PvP con hijos, máximo 2 acompañando, expediciones (exploran solos, mochila propia que solo se mira, se equipan solos), cama con la familia completa, botones de Montar y armario de la pareja en la fila de iconos de arriba, lupa 🔎 → ⚒ Oficios con flecha.
- **4.29** cielo: pueblos Céfira (arpías), Aurelia (ángeles) y Lumen (acertijos); romance con Aelis, Nimiel, Caelith y Kiri; beso francés; piedras de acertijos diarias; prueba de memoria; oficios Carrera de Ángeles y Olimpiadas Angelicales. Archipiélago: Puerto Esmeralda con isleños en bikini y ropa de verano, oficios Surf y Arte (pixel art que se vende solo), Ixtal con puzle de estatuas y dos mazmorras de nivel 300. XP de monstruos de nivel >250 ×1,4 (unos 50 enemigos por nivel en todo el juego; de 1 a 350 son unas 31 horas de combate). Fondo marino: almejas gigantes, perlas rosas/doradas/de luna, 30 perlas perdidas, sirena Perlina, tortugas y ballena.
- **4.30** los monstruos de eventos (marcados `noSafe`) por fin atacan dentro de los pueblos; el asedio de la luna de sangre ya no se pierde cuando acaba la noche (se pierde si cae el 60 % de las casas o si te alejas del pueblo), el Devorador pisa cada 10-14 s y rompe una casa por pisotón; los hijos tienen tu misma vida a su nivel y reciben un 40 % menos de daño, descansan 2 min si caen, vienen solos a ayudarte en asedios y ataques al pueblo, hablan con globos (llegada, combate, poca vida, victoria, charla), y salen en el minimapa (rosa contigo, naranja de expedición, con flecha en el borde) y en el mapa grande. Los enemigos atacan a quien tengan más cerca (tú o tus hijos).
- **4.31** tiempo jugado en el menú principal (por cuenta, cuenta también en el menú; cada héroe muestra el suyo) y botón 🏆 Top jugadores (horas y nivel máximo). No hay servidor con base de datos: el top se comparte entre jugadores al conectarse (mundos online y sala oculta de Photon al abrir el menú).
- **4.32** top mundial en Firebase (Realtime Database gratis del proyecto `the-bound-3afef` de Sergio; reglas en `docs/firebase_rules.json`).
- **4.33** pueblos vivos: tablón en cada plaza (periódico, rumores, mercado, ayuntamiento, bazar), prosperidad, casas abandonadas, alcalde con impuestos, Día del Tributo, oficio Comercio y vecinos que te ayudan.
- **4.34** oficios: hogueras con 50 platos (peruanos incluidos) y plato perfecto, 12 peces legendarios y colección de peces dibujados, alquimia experimental, arqueología (oficio nuevo) y forja artesanal con runas.
- **4.35** combate: maestría por tipo de arma con posturas y técnica especial, Campo de Entrenamiento en Arxar, reacciones elementales, raíces que se queman, partes vulnerables en 5 jefes, guardianes y curanderos enemigos, técnicas combinadas entre clases en el online.
- **4.36** Mundo de los Sueños (dormir de madrugada), escalada, puentes de hielo, Profundidades bajo cada cueva y legado familiar (hijos adultos con oficio, boda, casa propia en el mapa, nietos e historias).
- **4.37** posturas con pose del cuerpo, pueblos vivos en cielo/archipiélago/Velo Roto, botón ❤ Familia para llamar a hijos y nietos, nietos con todos los sistemas, grupo online sincronizado en más mapas.
- **4.38** armas: la de tu nivel +10 % y las viejas pierden hasta 55 %; lupa › Sistemas con todo explicado; las dos parejas te acompañan a la vez; llamar a la familia la une al equipo (visible online, máx. 2); casa de 4 pisos; fiesta familiar.
- **4.39** arreglo del bloqueo al salir de casa en la fiesta; llamar a la familia que está de expedición.
- **4.40** hijos con 4 habilidades elegibles, invocadores con almas e invocaciones, equipo propio (pueden superarte), jefes que atacan a los hijos, escalado de jefes por equipo, jefes 200+ con menos vida.
- **4.41** Torre de los Portales: Selene, prueba de poder y rangos, ranking, 40 cazadores con poderes, retransmisiones, botón ⛩ con 8 mazmorras (solas o en equipo de 4 con cazadores), enemigos y jefes nuevos.
- **4.42** ropa de cazador (chaquetas, ropa negra, capuchas, capas), anillos de cazador, 6 peinados emo, maquillaje de ojos y 8 aspectos de arma.
- **4.43** arreglo del bloqueo al salir de mazmorras y de la retransmisión; cazadores pegan según su nivel; los de mucho más nivel te rechazan; jefes menos inflados.
- **4.44** cazadores variados (cuerpos alto y gigante), poderes animados, 6 legendarios de rango Nacional/Mundial, duelos de entrenamiento, modo espectador, ojeras y labial.
- **4.45** cuerpos Esbelto/Atlética para el jugador, 5 NPCs góticas (tienda gótica de Morwenna en Albor), fiestas por calendario (Semana Santa, Sol, Mes Morado, Ánimas, Navidad, Año Nuevo).
- **4.46** cazadores estilo anime extraídos de la imagen de Sergio (15 diseños + 11 cazadoras, recoloreados), Titán Carmesí extraído de su imagen, nieve en Navidad. Hojas para que Sergio mejore: `docs/sprites/goticas.png`, `enemigos_mazmorra.png`, `jefes_mazmorra.png`.
- **4.47** cazadores con estadísticas propias (como jugadores) e IA mejor, mazmorras sin reaparición, espectador sin ataques, 12 enemigos + Alfa + Tormentas + 5 góticos sacados de imágenes de Sergio; góticos enamorables.
- **4.48** Torre ampliada (Antesala, Coliseo con torneos/apuestas/espectador, Salón de Pruebas con misión diaria), 30 cazadores nuevos de estilo clásico, medidor de poder = poder del menú, cazadores máx. nv. 350.
- **4.49** misión diaria = 1 nivel al día (nada de puntos de atributo extra: desbalancea).
- **4.50** ropa gótica nueva con tipos propios (`gt_*`), pelucas, gafas, piel blanca (`app.pale`), chaquetas de cazador rediseñadas (`hn_*`), dash de los cazadores (`aiDash`), combate online en el Coliseo (`CARENA`).
- **4.51** ropa gótica y de cazador en la lupa (cómo conseguirla, ES/EN). Regla: todo lo nuevo que se consigue va a la lupa en los dos idiomas.
- **4.52** poder siempre con todos los bonus; clase despertada +10 % atk/+8 % vida y def. Poder a nivel 350 (medido en el juego, 70 % atributos al principal): mejor equipo ~20.500–22.000; +10, arma despertada 10 y maestría 50 ~37.700–41.000; + clase despertada ~41.300–45.700; + subraza transformada: lobo ~47.500–52.900, vampiro ~46.000–51.000, fantasma ~45.000–50.000 (sin transformar la subraza no suma poder). Sin contar mascotas, anillos, comida ni familia.
- **4.53** títulos (26, por poder y logros, Armario › Títulos, se ven online) y guías de poder en la lupa.
- **4.54** equipo de los hijos bloqueado si no lo conseguiste ni tienes el nivel; menos curación de enemigos/jefes; optimización (nunca usar `ctx.filter` por fotograma).
- **4.55** títulos guardados (regla: campos nuevos de G.P → `SAVEKEYS.push`), equipo de la familia no se puede quitar.
- **4.56** poder como antes (el ×10 fue un malentendido); números de la ficha grandes y en letra clara. Si Sergio dice «números más grandes» se refiere al tamaño de la letra.
- **4.57** ropa desgarrada según la vida (cualquier prenda, pecho femenino protegido, raspones de sangre, se ve online).
- **4.58** la ropa de mujer se rasga un poco más (pecho protegido).
- **4.59** Devorador Carmesí nuevo, top al destrozarse la ropa de mujer, frío con antorchas, enfermedades, lesiones (cojear/gatear) y médica Iris enamorable en Albor.
- **4.60** Academia Arcana en el Velo Roto (profesores, lecciones, biblioteca), libros mágicos voladores, escobas voladoras, top más pequeño. Ojo: al repintar píxeles de un sprite de héroe, marca también su capa en `p.t` o el HD dibuja rayas.
- **4.61** castillo-escuela por dentro, ropa rasgada sin top (Sergio prefiere jirones en la propia ropa), Kaela la chica loba (pareja más fuerte, se transforma, montable, hijos híbridos).
- **4.62** ropa rasgada de mujer = ropa con jirones + top oscuro debajo visible por los rotos del pecho (lo definitivo).

## Pendiente o ideas abiertas

- En grupo, cada jugador ve su propio jefe (con sus ataques); se comparten el daño y las partes vulnerables.

- Lanzas, hachas y mazas solo las usa el guerrero.
- Personajes dark fantasy del Velo dibujados en código: si Sergio manda imágenes, extraerlos.
- «Cooperativo local» de la propuesta del Velo Roto (la captura venía cortada).
- Las expediciones de los hijos son una simulación por minutos; el hijo solo aparece en el mapa principal (en su campamento). Si Sergio quiere que viaje de verdad por otros mapas, hay que hacerlo.
- La APK no cambia desde la 4.11; todo llega por el actualizador interno.

## Al empezar en otra cuenta (actualizado en la 5.33)

1. Lee `AGENTS.md`, `docs/NOTAS.md` (estado y cómo trabajar) y, si tocas historia, `docs/LORE.md` (canon + reglas).
2. Preparar la sesión: `mkdir -p tools/i18n/vendor && npm pack acorn@8.14.0 && tar xzf acorn-8.14.0.tgz && cp package/dist/acorn.js tools/i18n/vendor/` (añade `tools/i18n/vendor/` a `.git/info/exclude`). `pip install playwright` y usa `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` delante de `tests/play.py`, `fitcheck.py`, `pvp.py`…
3. `python3 build.py` → `dist/test.html`. En los guiones de `tests/play.py` cada `js (...)` debe ir **en una sola línea**; `shot` hace capturas intermedias.
4. Publicar: `GAME_VER`/`GAME_BUILD` + `CHANGELOG` (es/en) en `src/6zv_update.js`, pie `tfoot` de `template.html`, `python3 tools/dev/release.py`, `python3 tests/upd.py file://$PWD/dist/test.html out.png`, commit, push, PR a `main` y fusionar sin preguntar.

## Lecciones recientes

- **Historias nuevas**: Sergio quiere que un **NPC joven** (como Nilo en Albor) te avise al llegar al nivel y te mande al sitio con flecha; no esconder el inicio de una historia. Y los **objetos nuevos se hacen partiendo de sprites que ya existen** en el juego (pedestales, postes, madera `WOOD`), no con un estilo nuevo.

- **5.31 · personaje invisible**: la barra roja da archivo y línea de `dist/test.html` (`about:srcdoc:LÍNEA` = misma línea de `dist/test.html`). Las habilidades con pose especial (`sv_skill`) dan anclajes **con decimales**; una prenda que use `y` o `x` como índice de paleta (`pal[(x + y) % n]`) debe redondear antes (`Math.round(A.torsoTop)`). `fitKind` ya atrapa errores (`errOnce`) para que el personaje nunca desaparezca, pero la barra roja sigue saliendo: arréglalo en la prenda.
- **Lupa › Sistemas** (`GSIS`): el texto se escapa (no uses `<b>`); el 4.º elemento es una función que devuelve `null` o `{ loc: [x, y], t, m }` para la flecha dorada.
- **Historia**: capítulos nuevos solo al final de `CRON`; las pistas (`CLUES[id][3]`) abren su capítulo al descubrirse, así que apunta a un capítulo ya existente si no quieres adelantar la historia.
- Sergio preguntó qué significaba «Nihil podría despertar»: en el canon Nihil **duerme y sueña**; sus sueños se cuelan por las grietas (Velo Roto, Lienzo en Blanco, ecos del borde). No despierta mientras alguien mire (juegue). Es un gancho para el futuro, no un jefe nuevo.

## Ideas de historia pendientes (propuestas a Sergio en la 5.31, aún sin hacer)

- **El Calco**: Nihil imita el pincel de la Ventisca y pinta copias falsas y sin color de Lima, México o España, llenas de ecos; hay que distinguir la ciudad real de la falsa.
- **Los fragmentos huérfanos**: dónde acabaron los 7 fragmentos del Sello; cada uno torció a alguien nuevo (búsqueda en 7 partes).
- **El hilo de tus hijos**: un descendiente nace con una chispa de luz (sin ser otro «elegido»: regla 3 del lore). Casa, Camposanto y Telar.

