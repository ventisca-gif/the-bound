# The Bound

> **Al empezar un chat nuevo, lee `docs/NOTAS.md`**: estado actual, qué se hizo en cada versión, pendientes y cómo trabajar con Sergio.
> **Antes de tocar la historia, NPCs que cuenten lore, jefes de la historia o cinemáticas, lee `docs/LORE.md`**: el lore oficial y las reglas para ampliarlo sin contradicciones.

The Bound es un RPG 2D de mundo abierto con movimiento en cuatro direcciones.

## Sprites, ropa y efectos de ataque

- Usa el sprite original como base para conservar la cara, el pelo, las proporciones y la cuadrícula de píxeles.
- Cada atuendo terminado debe verse en todos los fotogramas de caminata. Muestra el frente al bajar, la espalda al subir y el perfil correspondiente al ir a izquierda o derecha.
- Comprueba la posición de capas, bolsillos, adornos y otros accesorios asimétricos en cada vista. Conserva su lado al adaptar las animaciones.
- Mantén la animación del personaje y los efectos visuales de ataque en capas separadas para combinarlos durante el juego.

## Animación de caminata

- Prepara un ciclo de caminata para cada dirección: abajo (frente), arriba (espalda), izquierda y derecha. Usa la caminata original como base y conserva la cantidad, el orden y la duración de sus fotogramas cuando ya estén definidos.
- Alterna el apoyo de los pies y acompaña cada paso con el movimiento de los brazos. Adapta la ropa, el pelo y los accesorios a la pose de cada fotograma. Si el personaje lleva un arma, mantenla alineada con la mano que la sostiene.
- Conserva el tamaño de celda y el punto de anclaje del sprite original. Revisa en bucle las cuatro caminatas y su transición a reposo para detectar saltos de posición o cambios de ropa entre fotogramas.
- Toma como referencia la caminata del juego: pasos cortos, poco rebote vertical y cambios de dirección ágiles. Al crear un atuendo, adapta la ropa a los fotogramas originales de cada dirección para conservar ese movimiento.

## Estilo HD de referencia (desde v4.0–4.2)

- Toma siempre como base los sprites HD actuales del juego (personajes chibi de v4.2 dibujados con `drawHero`/`drawHumanoid` y el detalle HD de `src/6zu_hd.js`) para crear sprites, ropa, NPCs y criaturas nuevas. No partas de estilos anteriores a la v4.0.
- Respeta `FACE` en `src/32_art_chars.js` (cabeza 2 px más alta, ojos 2×3 bajo el flequillo, boca de 2 px, pelo con volumen y cintura en las mujeres) y las etiquetas de capa `TG(n)` para que el detalle HD se aplique.
- Mantén el detalle HD suave y continuo: sin puntadas punteadas ni líneas claras en cada cambio de sombra (nada de "cuadrículas blancas").
- Antes de un cambio visual grande, haz una muestra dibujada con el propio motor y compárala con la referencia.
- Hay 10 estructuras de cuerpo de hombre y 12 de mujer (`BODY_T` en `src/6zw_bodies.js`, ampliado en `src/6zyzx_v445.js` y `src/6zzzzzk_cuerpos.js`; la 0 es la clásica). Se añaden siempre al final (los índices viejos no cambian) y `FIT_BODIES` las incluye todas. La forma de ojos se elige aparte (`app.eyst`, `src/6zzzzzl_ojos.js`). Ropa, armaduras, cosméticos, peinados y armas nuevos deben verse bien en todas: usa las medidas del dibujo (`tw`, `th`, `hx`, `hy`, `FACE.ey`, `B.*`), no números fijos. Revísalo con `tools/dev/grid.py` y `tools/dev/mock.py`.
- Ajuste automático (`src/6zx_fit.js`): lo que va en la cabeza se dibuja para la cabeza clásica y se escala solo a cada estructura (y se encoge si un sombrero alto no cabe en el cuadro); lo pegado a la cara (gafas) usa la línea de los ojos. Un cosmético nuevo que reutiliza un tipo existente (`k`) se adapta sin hacer nada.
- Para un tipo de prenda nuevo usa `fitKind(ranura, k, (p, A, spec) => ...)` y dibuja solo con los anclajes de `A` (`hx`, `hy`, `hrx`, `hry`, `headTop`, `ey`, `eyes`, `tx0`, `tw`, `torsoTop`, `th`, `waistY`, `shL`, `shR`, `shY`, `legTop`, `base`, `side`, `up`, `d`). Opciones `{ face }`, `{ float }` y `{ skin }`.
- Antes de publicar ropa, armaduras, cosméticos o alas nuevas, pasa `python3 tools/dev/fitcheck.py file://$PWD/dist/test.html out` (también corre en `tools/dev/reg.sh`). Debe decir 0 avisos en estructuras nuevas.
- No borres estructuras ni cambies la clásica. La estructura Héroe copia los ojos de la referencia de Sergio (ceja de 3 px del color del pelo, 1 fila de piel, ojo 2×2 con brillo arriba a la izquierda, boca de 1 px).

## Versiones y actualizador interno

- La versión del juego y del APK está en `src/6zv_update.js` (`GAME_VER`, `GAME_BUILD`). `tools/apk/build_apk.py` la lee de ahí.
- Para publicar una versión: sube `GAME_VER`/`GAME_BUILD`, añade su entrada al principio de `CHANGELOG` (español e inglés), actualiza el pie `tfoot` de `template.html` y ejecuta `python3 tools/dev/release.py`. Sube `update/` a la rama `main`: los teléfonos leen `update/version.json` en raw.githubusercontent.com.
- Sergio autoriza fusionar siempre: al terminar una versión, abre el pull request a `main` y fusiónalo tú mismo sin preguntar.
- Sube `UPD_MIN_APK` solo si cambia la parte Android (`tools/apk/`). Entonces hay que instalar el APK nuevo a mano.
- Firma el APK siempre con la clave de siempre (`THEBOUND_KEYSTORE` y `THEBOUND_SIGNING_PASSWORD`). Nunca la subas al repositorio ni generes otra.
- Prueba del actualizador: `python3 tests/upd.py file://$PWD/dist/test.html out.png`.

## PvP

- El equilibrio entre clases a nivel máximo se mide con `python3 tools/dev/pvp.py file://$PWD/dist/test.html` (`--raw` sin ajustes, `--solve` sugiere multiplicadores).
- Los ajustes solo de PvP están en `src/6zyb_pvp.js`: `PVP_CLS` (daño por clase), `PVP_HEAL` y `PVP_HEALC` (curas y escudos durante un duelo). No toques el daño contra monstruos para equilibrar el PvP.
- Al añadir habilidades, armas o pasivas que cambien el daño, la vida o las curas, vuelve a pasar `pvp.py --solve` y actualiza `PVP_CLS`. La fuerza media de cada clase debe quedar entre 0,9 y 1,1.

## Trabajos y actividades

- Los oficios y actividades se juegan dentro del mapa (joystick, ⚔, NPCs y objetos en el mundo), nunca en ventanas/modales. Solo la lotería y la piñata pueden usar ventana. Usa el estado `ACT` de `src/6zz9zzzz_enjuego.js`.

## Regla permanente de Ventisca: cuerpos, pelo y auras

- Todo personaje, cosmético, pelo y aura debe seguir las **estructuras femeninas y masculinas (todas las de `BODY_T`)**, en cuatro direcciones, con el motor original (`drawHero`, `hdDetail`, atlas y anclajes). No sustituir caras, proporciones ni sprites por figuras genéricas.
- Las auras cosméticas usan el fotograma final del atlas y sus medidas; no hacer una máscara fija por peinado. Los peinados futuros deben adaptarse sin registrar otra aura. Mantener VFX y sprite en capas separadas, cachés limitadas y modo optimizado.
- Guardar auras cosméticas en `cosAuraOwn`/`cosAura`. **No reutilizar `P.auras`**: contiene efectos temporales de habilidades. Usar el oro existente; no añadir otra moneda ni modificar estadísticas para estas auras.

## Herramientas y barra de abajo (desde 5.64)

- Hachas, picos y cañas se equipan en el inventario (`P.tEq`) y se usan con su casilla de la barra (🪓 `hbAxe`, ⛏ `hbPick`, 🎣 `hbRod`); ⚔ no recolecta. Toda herramienta nueva debe ser `it(id, { t: 'tool', tool: 'tala' | 'mineria' | 'pesca', power, lv, icon })` para que funcione sola con su casilla. Recursos de nivel 12+ piden `toolNeed(job, tier)`.
- Al añadir oficios, aparecen solos en ▦ Atajos › ¿Qué hago ahora? (sección de oficios, `src/6zzz8_v567.js`); dales `JOB_GUIDE[k]` con `how` y `find` para que salga cómo y la flecha.


## Ciudades y vida diaria (desde 5.74-5.76)

- Lo de las ciudades (Lima, Lima Norte, Trujillo, Cusco, Machu Picchu, México, España), la familia y la vida diaria se explica en Lupa › 🏙 Ciudades y vida (`LUPA_CIU` en `src/6zzzk_v576_barrios.js`). Todo evento o sistema nuevo de ese tipo debe tener su entrada ahí y, si pasa hoy, salir en «Hoy en las ciudades».
- Horarios y multitud: `V74_CITY` y `v74Dens` (`src/6zzzi_v574_vida.js`); un mapa de ciudad nuevo se añade a `V74_CITY` con la expresión de sus NPCs de multitud y su NPC ancla. Las entidades nuevas que no sean objetos del mapa no deben tener el campo `k` (el render lo trata como objeto).

## Código sin apilar: ganchos (desde 6.12)

- No añadas envolturas nuevas del tipo `calcStats = function () { const r = _cs(...) ... }`. Muchas funciones ya tienen 40-70 capas (`drawEnt`, `killMob`, `calcStats`, `interactTarget`…).
- Usa los ganchos de `src/00h_hooks.js`: `hookBefore(nombre, f)` (devuelve `HOOK_SKIP` para no ejecutar la función), `hookAfter(nombre, (resultado, ...args) => …)` (si devuelve algo, sustituye el resultado) y `hookAround(nombre, (next, ...args) => …)`. `src/zz_hooks_fin.js` los instala en una sola capa al final; se comportan como la envoltura más externa. Un gancho que falla no rompe el juego (avisa con `errOnce`).
- Solo sirven para funciones globales declaradas con `function`. No cambies envolturas antiguas que funcionan solo por cambiarlas.
- `python3 tools/dev/capas.py` (también en `tools/dev/reg.sh`) avisa si una función gana envolturas sobre `tools/dev/capas_ref.json`.

## Pruebas antes de publicar (desde 6.12)

- `bash tools/dev/reg.sh out` (regresión, ropa, capas y doble toque: `tests/doble_toque.py` busca recompensas de diálogo que se cobran dos veces) y `python3 tests/upd.py file://$PWD/dist/test.html out.png`.
- Partidas antiguas: `python3 tests/saves.py file://$PWD/dist/test.html` carga partidas de versiones viejas (de `update/thebound.html` del historial) y comprueba que se juegan y se vuelven a guardar.
- Acciones del mapa en su sitio: `python3 tests/xact_sitio.py file://$PWD/dist/test.html` va a cada objeto con acción de cada mapa y la usa.
