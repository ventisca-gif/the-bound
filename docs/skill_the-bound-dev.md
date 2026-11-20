---
name: the-bound-dev
description: Continue developing Sergio's pixel-art mobile MMORPG "The Bound" (fix bugs, add features, release updates). Use whenever he mentions The Bound, mi juego/MMORPG, the APK or new game features.
---

# The Bound (versión corta)

El código vive en GitHub: **ventisca-gif/the-bound**. Esa es la fuente de verdad (ya no hay que restaurar copias de artefactos).

## Al empezar
1. Lee `AGENTS.md` (reglas) y la cabecera de `docs/NOTAS.md` (versión actual + cómo trabajar). Lee solo la sección de NOTAS del sistema que vayas a tocar. Antes de tocar historia/lore, `docs/LORE.md`.
2. `git fetch origin main` y trabaja sobre `origin/main` actualizado.
3. Falta `tools/i18n/vendor/acorn.js` (no está en git): `npm pack acorn@8.14.0`, copia `package/dist/acorn.js` ahí. Luego `python3 build.py`.
4. Pruebas con Python Playwright (`pip install playwright`); usan `/usr/bin/google-chrome` (enlázalo a `/opt/pw-browsers/chromium` si hace falta).

## Sergio
- Responde en español, corto y concreto. Quiere todo lo que pide de una vez. Nunca borrar nada: ampliar encima.
- Todo lo nuevo: visible en el online, en la Lupa › Sistemas (`GSIS`, ES/EN con `L2`) y en el mapa si tiene sitio.
- Oficios y actividades dentro del mapa (nada de minijuegos en ventana salvo lotería/piñata).
- Antes de un cambio visual grande, muestra hecha con el motor.
- Su correo es privado.

## Código
- `src/*.js` se concatenan en orden alfabético. Cada versión en su archivo nuevo al final (hoy `src/6zzz*`), envolviendo funciones: `{ const _f = f; f = function () { …; return _f.apply(this, arguments); }; }`.
- Campo nuevo de `G.P` → `SAVEKEYS.push('campo')`. Comprueba que un `const` global no exista ya.
- Ropa/armaduras: `fitKind` + `tools/dev/fitcheck.py` con 0 avisos. Daño/curas: `tools/dev/pvp.py` (0,9-1,1).
- Prueba: `python3 tests/play.py file://$PWD/dist/test.html out.png 1000 452 @tests/x.txt` (termina en `JS> []`). Regresión: `bash tools/dev/reg.sh <dir>` en segundo plano.

## Publicar
1. Sube `GAME_VER`/`GAME_BUILD` y añade la entrada al principio de `CHANGELOG` (es/en) en `src/6zv_update.js`; cambia el pie `tfoot` de `template.html`.
2. `python3 tools/dev/release.py`; añade una sección corta en `docs/NOTAS.md`.
3. Commit, push a la rama de trabajo, PR a `main` y **fusiónalo sin preguntar** (los teléfonos se actualizan solos desde `update/`).
4. APK nuevo solo si cambia `tools/apk/` (`UPD_MIN_APK`), firmado con la clave de siempre; nunca generar otra.
