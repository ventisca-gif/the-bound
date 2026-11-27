# Reverse Mountain / Cabos Gemelos — pendiente de publicación

Base conservada: `main` 5ee9729 (6.62, build 284), incluidos Brasil y todas las novedades de Claude. Rama: `chatgpt/reverse-mountain-663`.

- La propuesta anterior coincidía con Shells Town. La zona se mueve a una extensión libre al sureste del mismo mapa Dawn (y=1052–1381), sin cambiar las islas existentes.
- Canales transitables con el radio de colisión real del Merry; muelle, faros, casa y Crocus con recursos originales. Terreno dibujado con las texturas nativas de Dawn.
- Las tres escenas usan el Merry y los atlas de los personajes y del jugador del motor original.
- Laboon conserva `rmDone`; recompensa y progreso se registran antes de la cinemática y no se pueden cobrar dos veces. Un encuentro interrumpido al salir de Dawn se puede reintentar.
- La primera isla del Grand Line no se añade. La futura salida solo informa de que el nuevo mar sigue cerrado.

Validación del 27/11/2026:

- `python3 build.py`: correcta (traducción con Acorn, SDK Photon presente).
- `node --check` sobre las fuentes concatenadas: correcto.
- `python3 tools/dev/capas.py`: 0 envolturas nuevas.
- `node tests/reverse_mountain.js`: 1210 muestras de canales, muelle, Crocus, amarre, conservación de terreno y generación idempotente, correctos.
- Navegador de vista previa: inicio y carga de partida correctos. Comprobación de canales, bloqueo/desbloqueo del desembarco, premio único, atlas de las tres escenas, guardado de `rmDone`, regreso al barco y salida futura cerrada: correctos.
- El ejecutable Chromium de las pruebas Python no está instalado (`/usr/bin/google-chrome` ausente; el lanzador `/usr/bin/chromium` apunta a un binario ausente). No se han podido completar `reg.sh`, `upd.py`, `saves.py` ni `xact_sitio.py` con su ejecutor original. El ensayo alternativo de regresión en un iframe no equivale a esas pruebas y no cuenta como aprobado.

**No publicar todavía**: no se modifica `update/`, `GAME_VER`, `GAME_BUILD` ni el pie de versión hasta pasar las pruebas pendientes. Antes de publicar, traer de nuevo `main`, resolver cualquier novedad de Claude sin sobrescribirla, repetir compilación/pruebas, elegir una versión libre y ejecutar `tools/dev/release.py`. Subir juntos HTML, gzip y manifest del actualizador.

Se añade `.github/workflows/reverse-mountain.yml` para ejecutar las comprobaciones completas en GitHub Actions. La ejecución no publica ni modifica el actualizador. Su resultado debe revisarse antes de fusionar.
