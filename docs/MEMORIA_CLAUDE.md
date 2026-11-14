# The Bound: memoria para otra cuenta de Claude

Pega este archivo al empezar un chat nuevo (o di «lee `docs/MEMORIA_CLAUDE.md` y `docs/NOTAS.md`»).
Repositorio: **github.com/ventisca-gif/the-bound**. Versión actual: **4.42 (build 63)**.

## Quién es Sergio y cómo trabajar con él

- Sergio crea **The Bound**, un RPG 2D de mundo abierto en pixel art (estilo MMORPG para móvil, con online, PvP, romance, familia, oficios y muchos mapas). Juega en Android con una APK que se actualiza sola.
- Escribe en español, con listas largas, capturas del móvil y faltas de ortografía. Quiere que se haga **todo lo que pide de una vez**.
- Responde siempre en **español**, corto y concreto: qué se hizo, qué no y por qué. Sin jerga técnica.
- **Al terminar una versión: abre el pull request a `main` y fusiónalo tú mismo, sin preguntar.** Los teléfonos leen `update/version.json` de `main` y se actualizan solos.
- Si manda una referencia de otra franquicia, haz una versión original (otro nombre, colores y detalles) y díselo.
- Si manda pixel art, extrae los sprites de la imagen (cuadrícula con FFT, centro de cada celda, recortar fondo); no los redibujes.
- Antes de un cambio visual grande, haz una muestra con el propio motor. Si ya dijo «sí a todo», sigue.

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
- Reglas del repositorio: `AGENTS.md` (sprites, caminata, estilo HD, ajuste de prendas, PvP). Historial detallado de cada versión: `docs/NOTAS.md`.

## Qué tiene el juego (resumen)

- Mundo principal con pueblos (Albor, Puerto Coral, Arxar, Sahrim…), tren, barcos, yate, monturas, casas, construcción, mascotas, oficios, festivales, reinos, coliseo, eventos (luna de sangre con asedio del Devorador Carmesí), online con chat, grupos y PvP.
- Otros mapas: Fondo Marino y Nerea (buceo desde Isla Brasa), El Archipiélago (galeón, nivel 160), Islas del Cielo / Celestia (aeronave, nivel 200), Altavela (nivel 220), El Velo (mundo espiritual) y el Continente del Velo Roto (nivel 250-350, Nochebruma, subrazas lobo/fantasma/vampiro).
- Nivel máximo 350. Clases: guerrero, mago, arquero, asesino, bardo, invocador, pez. Ascensión y evoluciones.
- Romance con dos medidores (Confianza y Amor, 10 corazones), regalos, pasear de la mano, llevar en brazos o a hombros, besos (normal y francés), pareja (hasta dos), boda, casa, hijos (3 por pareja) y escena de la cama con corazones.

## Lo último (4.27 – 4.36)

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

## Pendiente o ideas abiertas

- En grupo, cada jugador ve su propio jefe (con sus ataques); se comparten el daño y las partes vulnerables.

- Lanzas, hachas y mazas solo las usa el guerrero.
- Personajes dark fantasy del Velo dibujados en código: si Sergio manda imágenes, extraerlos.
- «Cooperativo local» de la propuesta del Velo Roto (la captura venía cortada).
- Las expediciones de los hijos son una simulación por minutos; el hijo solo aparece en el mapa principal (en su campamento). Si Sergio quiere que viaje de verdad por otros mapas, hay que hacerlo.
- La APK no cambia desde la 4.11; todo llega por el actualizador interno.
