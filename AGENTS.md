# The Bound

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
- Hay 4 estructuras de cuerpo por sexo (`BODY_T` en `src/6zw_bodies.js`; la 0 es la clásica). Ropa, armaduras, cosméticos, peinados y armas nuevos deben verse bien en todas: usa las medidas del dibujo (`tw`, `th`, `hx`, `hy`, `FACE.ey`, `B.*`), no números fijos. Revísalo con `tools/dev/grid.py` y `tools/dev/mock.py`.
- Ajuste automático (`src/6zx_fit.js`): lo que va en la cabeza se dibuja para la cabeza clásica y se escala solo a cada estructura (y se encoge si un sombrero alto no cabe en el cuadro); lo pegado a la cara (gafas) usa la línea de los ojos. Un cosmético nuevo que reutiliza un tipo existente (`k`) se adapta sin hacer nada.
- Para un tipo de prenda nuevo usa `fitKind(ranura, k, (p, A, spec) => ...)` y dibuja solo con los anclajes de `A` (`hx`, `hy`, `hrx`, `hry`, `headTop`, `ey`, `eyes`, `tx0`, `tw`, `torsoTop`, `th`, `waistY`, `shL`, `shR`, `shY`, `legTop`, `base`, `side`, `up`, `d`). Opciones `{ face }`, `{ float }` y `{ skin }`.
- Antes de publicar ropa, armaduras, cosméticos o alas nuevas, pasa `python3 tools/dev/fitcheck.py file://$PWD/dist/test.html out` (también corre en `tools/dev/reg.sh`). Debe decir 0 avisos en estructuras nuevas.
- No borres estructuras ni cambies la clásica. La estructura Héroe copia los ojos de la referencia de Sergio (ceja de 3 px del color del pelo, 1 fila de piel, ojo 2×2 con brillo arriba a la izquierda, boca de 1 px).

## Versiones y actualizador interno

- La versión del juego y del APK está en `src/6zv_update.js` (`GAME_VER`, `GAME_BUILD`). `tools/apk/build_apk.py` la lee de ahí.
- Para publicar una versión: sube `GAME_VER`/`GAME_BUILD`, añade su entrada al principio de `CHANGELOG` (español e inglés), actualiza el pie `tfoot` de `template.html` y ejecuta `python3 tools/dev/release.py`. Sube `update/` a la rama `main`: los teléfonos leen `update/version.json` en raw.githubusercontent.com.
- Sube `UPD_MIN_APK` solo si cambia la parte Android (`tools/apk/`). Entonces hay que instalar el APK nuevo a mano.
- Firma el APK siempre con la clave de siempre (`THEBOUND_KEYSTORE` y `THEBOUND_SIGNING_PASSWORD`). Nunca la subas al repositorio ni generes otra.
- Prueba del actualizador: `python3 tests/upd.py file://$PWD/dist/test.html out.png`.
