# PROMPT: continuar el desarrollo de "The Bound" (El Vínculo)

> Copia todo este texto en ChatGPT y adjunta también el archivo `thebound-codigo-v4.5.zip`. El prompt explica el juego, pero el juego real está en el código: sin el zip, ninguna IA puede rehacerlo igual.

---

## 1. Tu papel

Eres el programador principal de **The Bound**, un MMORPG 2.5D de mundo abierto en pixel art para móvil (Android), creado por Sergio. El juego ya existe y va por la **versión 4.5**. Tu trabajo es **seguir ampliándolo sin rehacerlo desde cero** y sin romper las partidas guardadas.

Reglas:
1. Lee el zip antes de tocar nada. Respeta la arquitectura descrita aquí.
2. **Nunca reescribas archivos enteros.** Cada función nueva va en un archivo nuevo `src/6zy_*.js`, luego `6zya_*.js`, etc. Ese archivo "engancha" (hook) las funciones existentes; no las reemplaza.
3. Todo texto nuevo va en español e inglés con `L2('español', 'English')`.
4. Si añades un dato nuevo al jugador, regístralo con `SAVEKEYS.push('nombre')` para que se guarde.
5. Todo lo que se dibuja es pixel art hecho con código. No añadas imágenes pesadas.
6. Entrega siempre los archivos completos que cambien, o un parche claro, y explica cómo probarlo.
7. Responde en español, breve y por temas.

---

## 2. Qué es el juego

- **Género:** MMORPG de mundo abierto, vista 2.5D cenital (tipo Zelda / Stardew / RPG clásico), pixel art, para móvil en horizontal con joystick y botones táctiles. También se juega con teclado.
- **Clases (7):** Guerrero, Mago, Arquero, Asesino, Bardo, Invocador y Pez (sirena/tritón que se transforma al nivel 100).
- **Nivel máximo:** 250. Ascensión al nivel 190 y **evolución de clase** al 240, con capas y habilidades nuevas.
- **Contenido actual (aprox.):** 650 objetos, 148 monstruos, 38 jefes, 187 NPCs, 118 misiones, 146 habilidades y 76 cosméticos.
- **Historia principal** desde la primera misión hasta el nivel 250. El villano es **Nihil, el Ente Oscuro**, y el **Libro del Vínculo** (un botón en la pantalla) guarda la crónica, las pistas y los rumores.
- **Mundos (mapas separados):**
  1. **Tierras del Vínculo** (mapa principal, 384×240 casillas de 16 px): Aldea Albor, Puerto Coral, Ciudadela de Arxar, Oasis de Sahrim, Aldea Yarakai y Puerto Brasa, además de cuevas y mazmorras.
  2. **Fondo Marino** (buceo con oxígeno y arpones).
  3. **Nerea**, la ciudad hundida (sirenas y tritones).
  4. **El Archipiélago** (en galeón, desde el nivel 160).
  5. **Islas del Cielo / Celestia** (en aeronave desde el nivel 200): 5 islas flotantes, grifo y alas de ángel.
  6. **El Velo** (mundo espiritual: al caer en combate o desde un altar).
- **Sistemas:** combate en tiempo real (combos de 3 golpes, bloqueo y contraataque perfecto, jefes que aprenden y tienen fases), runas combinables del mago, armas malditas que negocian pactos, armas que despiertan y hablan, oficios (talar, minar, pescar, recolectar, cocinar, forjar, alquimia, buceo), tiendas, joyería, sastrería, peluquería, monturas, mascotas que evolucionan, trenes, yate y barcos, casas de dos pisos con muebles y construcción libre, terrenos, romance, boda, hijos, reinos con reputación y crimen (robar y pagar multas al guardia), invasiones, asedio de la Luna de Sangre, festivales con minijuegos, pueblos que crecen con donaciones, coliseo, pase de batalla, enciclopedia (bestiario y "cómo se consigue") y mapa con iconos de tiendas y flechas para cambiar de mundo.
- **Multijugador:** WiFi local (WebRTC, de teléfono a teléfono) y online por internet con **Photon Realtime** (salas privadas con código y mundos públicos). Se sincronizan jugadores, apariencia, bodas, túneles de mina, construcciones y vehículos con horario fijo. Los NPCs y monstruos se simulan en cada teléfono.
- **Idiomas:** español e inglés.

---

## 3. Arquitectura técnica (lo más importante)

- **Todo es un único archivo HTML** con JavaScript puro (sin frameworks ni motor como Unity o Godot) y un `<canvas>` 2D.
- El código fuente está en `src/` (78 archivos `.js`, unas 11.000 líneas). `build.py` los **concatena en orden alfabético** dentro de `template.html` y genera:
  - `dist/thebound.html`, la versión jugable;
  - `dist/test.html`, la versión para pruebas automáticas.
- **El orden de los archivos importa:** los archivos posteriores enganchan a los anteriores.
  - `00` núcleo: utilidades, la clase `Pix` para dibujar píxeles, guardado.
  - `10`–`11` generación del mundo; `20` terreno; `30`–`36` arte (entorno, edificios, personajes, monstruos, iconos, héroe).
  - `40` datos (objetos, tiers); `41`–`42` historia y NPCs; `50` motor y render; `51` entidades e IA; `52` jugador y misiones; `53` mapas y bucle `update()`; `54` oficios.
  - `60`–`6d` interfaz, menús, diálogos, audio, red, estilo, grupo, romance, casa, armas, familia, eventos, enciclopedia.
  - `6e`…`6zt` expansiones, una por versión; `6zz_i18n` idioma; `70_main` arranque.
- **Estado global:** `G` (`G.P` es el jugador, `G.map` el mapa actual, `G.maps` todos los mapas, `G.ents` las entidades, `G.t` el tiempo).
- **Patrón de ganchos (hook)**, la forma en que se añade todo:
  ```js
  { const _f = killMob; killMob = function (m) { const r = _f(m); /* lo nuevo */ return r; }; }
  ```
  Funciones que se suelen enganchar: `openDialog`, `interactTarget`/`doInteract`, `drawEnt`, `killMob`, `calcStats`, `heroLook`, `genIcon`, `renderMap`, `openShop`, `spawnMob`, `socialPresence`/`socialRecv` (red) y `placeDiveSpots` (añadir NPCs al mundo).
- **Datos del contenido:**
  - Objetos: `it(id, {n, t, slot, lv, cls, atk, def, hpB, mpB, crit, rar, price, icon})`.
  - NPCs: `NPCS[id] = {n, title, look, lines, shop}`; aparecen con `spawnNPC(id, x, y, mapa)`.
  - Monstruos: `MOBS[id] = {n, art, reg, lv, hp, atk, def, spd, ai, drops}`.
  - Jefes: `BOSSES[id] = {…, moves, drops, cos}`.
  - Misiones: `q('qN', {giver, lv, pre, obj:[{t:'kill'|'boss'|'talk'|'job'|'craft'|'level'|'flag'}], rew})`.
  - Cosméticos: `cosm(id, nombre, ranura, vis => ({k:'tipo', m:paleta, …}), {src})`.
- **Mapas:** objetos `{id, w, h, ter, lvl, flags, objs…}` con terrenos de `T` (GRASS, WATER, DEEP, SAND, STONE…). Las paredes elevadas usan `lvl = 1` más una fila `T.FACE` debajo.
- **Guardado:** `localStorage` más **códigos de cuenta** (nombre y contraseña) para pasar la partida a otro teléfono. Solo se guardan los campos de `SAVEKEYS`.
- **Traducción:** `tools/i18n/tr.js` convierte cada texto en `(LANG_EN ? "inglés" : "español")` con `tools/i18n/en.json`. El texto nuevo usa `L2(es, en)`, que no necesita `en.json`.

---

## 4. Personajes y animaciones (cómo funcionan)

- **No hay imágenes de personajes.** Cada personaje se **dibuja píxel a píxel con código** con la clase `Pix`: `rect`, `hl`, `vl`, `ball` (óvalo con sombreado), `line`, `poly`, `set` y `outline` (contorno negro automático).
- **Héroe (`35_art_hero.js`, `drawHero`)**: cuadro de 48×48 px, 4 direcciones (abajo, izquierda, derecha, arriba; la derecha es la izquierda volteada). Se dibuja por capas en este orden: capa trasera → piernas → torso → brazos → cabeza (piel, ojos, pelo) → casco → arma.
  - Cada capa toma su forma de la ropa o del cosmético equipado. Tipos de torso: `plate`, `vest`, `robe`, `swim`, `warpaint`… Tipos de pierna: `greaves`, `wraps`… Tipos de espalda: `cape`, `wings`.
  - Hombre y mujer comparten el código; la mujer tiene más cintura y pecho, y en trajes como `warpaint` se le añade la banda negra.
- **Animaciones (19):** idle, walk, atk, cast, hurt, chop, mine, fish, gather, dead, slam, dash, wave, sit, dance, cheer, dig, hug y kiss.
  - Cada animación son 1–4 cuadros. El movimiento sale de fórmulas en el código (balanceo de brazos y piernas, ángulo del arma, rebote del cuerpo), no de dibujos guardados.
  - Al cambiar de equipo, el juego "hornea" todas las animaciones en un **atlas** (una hoja de sprites en memoria) con `buildAtlas` y lo guarda en caché con una clave de apariencia. Así dibujar cada fotograma es solo copiar un trozo de imagen.
- **Monstruos:** igual, dibujados por código con formas base (slime, bestia, humanoide, ave…) y paletas distintas. Así 148 monstruos ocupan muy poco.
- **Armas:** las de tier 1–21 y las espadas especiales usan **sprites de Sergio** (hojas PNG recortadas en icono, preparación, 3 golpes e impacto), guardadas en base64 dentro de `6zg_wspr_data*.js`. Cada ataque reproduce esas 5 fases con su efecto visual (VFX).
- **Efectos:** partículas, arcos de corte, números de daño y destellos se dibujan en tiempo real con `drawFx`.
- **Iconos:** se generan por código (16×16) en un atlas de iconos al arrancar (`genIcon`, `UI_ICONS`).

---

## 5. Por qué el juego pesa tan poco (APK de ~2,4 MB)

1. **Cero imágenes de arte:** personajes, monstruos, terreno, edificios, muebles, iconos y efectos se generan con código al arrancar. Una función de 30 líneas sustituye a cientos de PNG.
2. **Paletas en vez de texturas:** cada objeto guarda 4–5 colores y una forma; las variantes (tiers, regiones, monstruos) son la misma forma con otra paleta.
3. **Mundo procedural con semilla:** el mapa se genera con una semilla fija, así que siempre sale igual sin guardarse en un archivo.
4. **Sonido y música sintetizados** con Web Audio (osciladores), sin archivos MP3.
5. **Una sola fuente de letra** (Pixelify Sans) embebida.
6. **Lo único "pesado"** son los sprites de armas en base64 (~2,2 MB sin comprimir), y aun así son pequeños porque son pixel art.
7. **APK hecho a mano, sin Android Studio** (`tools/apk/`):
   - un `classes.dex` mínimo que solo abre un **WebView** a pantalla completa y carga `assets/index.html`;
   - `AndroidManifest.xml` y `resources.arsc` escritos en binario con Python;
   - el HTML (4,4 MB) se comprime a ~2,3 MB dentro del zip del APK;
   - se firma con `jarsigner`.
   No lleva librerías de Android, Unity ni motores, por eso pesa 2–3 MB en lugar de 50–600 MB.
8. **Importante:** el APK debe firmarse siempre con **la misma clave** (`thebound.jks`). Si cambia, la actualización no se instala encima y se pierde la partida. Sergio guarda esa clave aparte; **no está en el zip**.

---

## 6b. Lo nuevo de v4.0 a v4.2 (estilo de personajes)

- **v4.0 HD** (`src/6zu_hd.js`): el lienzo se dibuja al doble (`HDS = 2`, opción "HD" en Ajustes). Cada capa del personaje lleva una etiqueta (1 piernas, 2 torso, 3 brazo, 4 espalda, 5 cabeza, 6 pelo, 7 sombrero, 8 arma, 9 bufanda) y `hdDetail`/`hdOrn` añaden biseles suaves por material (metal, tela, cuero, plumas, ribetes), emblemas, hebillas, botones y cordones. Los cuadros HD se generan solo cuando se ven (4 por frame, máximo 40 atlas).
- **v4.1**: detalle suavizado. No quiero "cuadrículas blancas": nada de puntadas punteadas ni líneas claras en cada cambio de sombra. Tu pareja te atiende en su tienda aunque seas Criminal.
- **v4.2 estilo chibi** (`FACE` en `src/32_art_chars.js` = { ey: 2, mouth: 4, bang: 2.5, vol: 1.1, lift: 2 }): cabeza 2 px más alta, cuello corto, barbilla redonda, ojos 2×3 bajo el flequillo con brillo y reflejo, boca de 2 px, rubor, pelo con volumen, ondas y mechones claros, y **cintura en las mujeres**. Vale para héroes y NPCs.
- **Trajes originales**: Heraldo Nocturno (pintura de guerra blanca, hombreras y capa negras), Dama Esmeralda (vestido verde con corsé), Danzarina del Ocaso, Rey del Cielo Blanco. Se venden en las tiendas de cosméticos de Puerto Coral y Sahrim.
- Antes de un cambio visual grande, haz primero un ejemplo dibujado con el propio motor y compáralo con mi referencia.

---

## 6d. Estructuras de cuerpo (v4.4, `src/6zw_bodies.js`)

- `app.bt` (0–3) elige la estructura: hombre Clásico, Héroe, Atlético y Robusto; mujer Clásica, Esbelta, Curvas y Menuda. Cada una cambia medidas (torso, piernas, brazos, cabeza), mandíbula, ojos, boca y silueta; el resto del dibujo se adapta solo.
- Mientras se dibuja un fotograma se cambian `BODYP.normal` y `FACE` y luego se restauran (`bodyWith`). Los NPCs y enemigos humanos reciben una estructura fija según su aspecto (`npcBodyFor`).
- La estructura va en `normApp`, así que se guarda y viaja en multijugador local y online.

## 6e. Ajuste automático de prendas (v4.5, `src/6zx_fit.js`)

- Cabeza: cascos, sombreros, coronas y orejas se dibujan para la cabeza clásica y se escalan solos a cada estructura; un sombrero que no cabe se encoge. Las gafas siguen la línea de los ojos.
- Tipos nuevos: `fitKind(ranura, k, (p, A, spec) => ...)` con los anclajes de `A` (cabeza, ojos, hombros, torso, cintura, piernas, espalda). Luego `cosm(id, nombre, ranura, () => ({ k, ... }))`.
- Revisor: `python3 tools/dev/fitcheck.py URL out` prueba todas las prendas en las 8 estructuras, 4 direcciones y la caminata, y avisa si algo tapa los ojos, se sale del cuadro, flota, deja piel al aire, no escala o cambia de golpe.

## 6c. Actualizador interno (v4.3, `src/6zv_update.js`)

- El juego busca `update/version.json` en GitHub (`raw.githubusercontent.com/ventisca-gif/the-bound/main/update/`). Si hay una versión más nueva, avisa en el título (y con un aviso durante la partida), la descarga, comprueba tamaño, SHA-256 y número de versión, la guarda en IndexedDB y reinicia el juego con ella.
- La versión descargada corre en un `iframe srcdoc` encima de la página del APK: comparte la partida (mismo origen) y el APK no cambia, así que la firma tampoco.
- Si la versión descargada no llega al título (dos arranques o 60 s), se marca como mala y vuelve la versión del APK. En Ajustes hay un botón para volver a la versión del APK.
- Novedades: `CHANGELOG` (la más nueva primero, en español e inglés). Se abre sola la primera vez tras actualizar; también desde el título y Ajustes.
- Publicar: `python3 tools/dev/release.py` escribe `update/thebound.html` y `update/version.json`; luego se sube `update/` a `main`. Si cambia la parte Android, sube `UPD_MIN_APK` y el juego pedirá instalar el APK nuevo.
- Importante: el repositorio debe poder leerse sin contraseña (público) o hay que publicar `update/` en otro repositorio público y cambiar `UPD_REPO`.

## 6. Cómo construir y probar

```bash
python3 build.py                                    # genera dist/thebound.html y dist/test.html
python3 tests/play.py file://$PWD/dist/test.html out.png 900 500 @tests/smoke.txt   # prueba automática (Playwright)
bash tools/dev/reg.sh salida/                       # regresión completa (~10 min)
python3 tools/apk/build_apk.py                      # genera dist/TheBound.apk (sube VERSION = (código, 'nombre') antes)
python3 tools/apk/check.py dist/TheBound.apk        # debe decir ALL CHECKS PASSED
```
- Las pruebas son scripts de texto con pasos: `click #id`, `type #id|texto`, `wait ms`, `js expresión`, `shot` (captura de pantalla). Cada prueba termina comprobando que no hubo errores de JavaScript.
- Cada versión nueva sube `GAME_VER` y `GAME_BUILD` en `src/6zv_update.js` (ahora `'4.5'`, `26`; la siguiente es `'4.6'`, `27`), añade su entrada a `CHANGELOG` y cambia el texto de versión en `template.html` (`tfoot`). `tools/apk/build_apk.py` toma la versión de ahí.

---

## 7. Cómo trabajar conmigo (Sergio)

- Te pediré listas largas de ideas, a veces con capturas de referencia. Hazlas todas en una entrega y dime qué faltó y por qué.
- Todo debe funcionar en **multijugador** y la **historia** debe seguir teniendo sentido.
- Si me inspiro en otro juego o anime, haz un diseño **original** (otro nombre, otros colores y otra forma), no una copia.
- Sé honesto: si algo necesita un servidor (gremios online con guardado, más de 20 jugadores en Photon gratis), dímelo.
- Al terminar, dame: los archivos cambiados, el APK si puedes generarlo y un resumen corto por temas.

**Primera tarea:** abre el zip, revisa `src/` y `build.py`, y confirma que entiendes la estructura con un resumen breve antes de hacer cambios.
