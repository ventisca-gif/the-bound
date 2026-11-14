# The Bound: notas para continuar en otro chat

Versión actual: **4.22 (build 43)**, publicada en `main` el 2026-11-14. La skill `the-bound-dev` está desactualizada (habla de la v4.2): manda lo que dicen este archivo y `AGENTS.md`.

## Cómo trabajar (lo que Sergio pidió)

- Responde siempre en español, corto y concreto. Él manda listas largas con capturas y quiere todo hecho de una vez.
- **Al terminar una versión, abre el pull request a `main` y fusiónalo sin preguntar.** Los teléfonos se actualizan solos desde `update/` en `main`.
- Antes de un cambio visual grande, haz una muestra con el propio motor y espera su visto bueno. Si ya dijo «sí a todo», sigue.
- Cuando manda una imagen en pixel art, extrae los sprites de la imagen (no los redibujes): detecta la cuadrícula con FFT, muestrea el centro de cada celda y recorta el fondo. Así salieron idénticos las armas de cobre, el campamento, las criaturas de Altavela y las armas dark fantasy.
- Ropa y armaduras nuevas: `fitKind` + `python3 tools/dev/fitcheck.py file://$PWD/dist/test.html out` con 0 avisos (cubre tiers hasta el 26). En mujer llevan busto solas.
- Tras tocar daño, vida o curas: `python3 tools/dev/pvp.py file://$PWD/dist/test.html` (fuerza 0,9-1,1; hoy 0,99-1,01) y `tools/dev/balance.py` (niveles hasta 350).
- `tools/i18n/vendor/acorn.js` no está en git (está en `.git/info/exclude`): en una sesión nueva, `npm pack acorn@8.14.0` y copia `package/dist/acorn.js` ahí, o `build.py` falla al traducir. Textos nuevos con `L2('es', 'en')`.
- Pruebas: `python3 tests/play.py file://$PWD/dist/test.html out.png 900 500 @tests/<nombre>.txt` (debe terminar en `JS> []`).

## Qué se añadió de la 4.12 a la 4.22 (archivos `src/6zw…6zyx`)

- **4.12** busto en cuerpos femeninos y NPCs (`bodyBust` en `6zw_bodies.js`; Esbelta/Menuda 1, Clásica 2, Curvas 3).
- **4.13** armas tier 1-6 de la hoja de cobre (`tools/dev/armas.py` → `6zyd_armas_data.js`, motor `6zye_armas.js`: icono 16, mano 16/32 HD, atlas de ataque HD; dagas en ambas manos, aletas del pez). Campamento de los **Vigías del Alba** en la Costa Coral (169-178, 168-177) con 8 NPCs de su dibujo (`tools/dev/campamento.py`), 5 misiones, uniforme cosmético y lore de Edrin Valcorde (`6zyg_vigias.js`).
- **4.14** `6zyh_netfx.js`: ataques y habilidades visibles en el online (eventos en la presencia), saltos/poses por nombre, tiers hasta 26 en red. `6zyi_optimo.js`: modo optimizado, lag automático, 15 fps en reposo, limpieza de atlas. `6zyj_inv.js`: seleccionar varios, tirar objetos de misión, tarjeta de tren repetida a saldo, scroll que no salta. `6zyk_velo.js`: armas superadas pierden hasta 30 % (más de 20 niveles por debajo) y el Velo onírico blanco acolchado.
- **4.15** Altavela, el Continente Celestial (`6zyl_celeste.js`, nivel 220+, puerta en la Isla de los Vientos) e investigación en grupo (`6zym_investiga.js`: mapas rotos, estelas, tumbas).
- **4.16** criaturas de Altavela con su dibujo (`tools/dev/criaturas.py`), lupa 🔎 «Dónde conseguir» con flecha dorada (`P.wp`) y auras de color por habilidad (`6zyo_v416.js`).
- **4.17** jefes del mundo con mecánicas y zoom del mapa (`6zyp_jefes.js`; peligros `HZ`, `BMECH[id]`).
- **4.18** **Continente del Velo Roto** (`6zys_velo_roto.js`): nivel máximo 350, tiers 22-26 con las armas dark fantasy (`tools/dev/armas_vr.py`), portal antiguo al oeste de Arxar (Fenrik el lobo → Malvia la bruja → 3 Esencias de Nihil), 5 regiones, cielo visible con la Luna Sonriente. Personajes dark fantasy dibujados en código en `6zyr_velo_art.js` (`VR_ART`) y `VR_KIND` en `6zys`.
- **4.19** `6zyt_velo2.js`: armaduras propias tiers 22-26 (Lobo Nocturno, Sepulcrales, Velo Roto, Eclipsadas, Luna Sonriente), Poder del Velo (+0,5 % ataque/vida por nivel desde 251), linterna y puentes espectrales, tienda del eclipse nocturna, decisión de la campana, símbolos + Imitador, altares de la catedral, mirada de la Luna y dos finales.
- **4.20** `6zyu_velo3.js`: El Hombre sin Rostro y 7 jefes nuevos (12 en el continente), Corrupción del Velo (`P.vrCor`, Grito del Velo, muros), jefes con memoria (`P.vrMem`), lunas de sangre, Heredero del Eclipse, Jardín de la Sonrisa (0:00-3:00) con el Tendero Imposible y El Sin Nombre (nombre: **Velmira**), Arma Velada (`wv_<clase>`, Guardiana/Devoradora) y tres finales.
- **4.21** `6zyw_velo4.js` (datos de imagen en `6zyv_velo4_data.js`, generados con `tools/dev/velo4.py` desde `tools/dev/velo4_ref/hoja.png`): 24 lanzas/hachas/mazas del guerrero (`av_<tipo>_<0-7>`, `gear.av`, atlas de ataque `WSPR_IMG.av`), 6 mascotas espectrales (`PETV`, las vende Corvel), región **Bosque de la Torre Hueca** (`VR_ZONES[VR4_ZI]`, torre, Biblioteca Anegada, caldera), jefe Ossaryn (`rey_rosas`, humanoide que camina), 6 enemigos con mecánicas (`VR4_MOBS`), +35 % de XP en el Velo, **subrazas** (`P.sr` lobo/fantasma/vampiro, `P.srF` transformado, `P.srC` pelaje; botón 🐺/👻/🦇; lobo a cuatro patas dibujado al doble en `drawWolf`; 4 habilidades `srl*/srf*/srv*` que sustituyen las ranuras; desactivadas en duelos; Poción de Sangre Limpia), NPCs Corvel, Ilvaine (romance, conjuros 🔮 `CJ`, marca `c_tercer_ojo`) y Grizzla, detalles de cara para NPCs (`L.xf`: tercer ojo, labios, nariz, aretes, dientes) y la pestaña 🗝 Secretos de la guía (`SECRETS`, pistas una a una en `P.secH`).

- **4.22** `6zyx_velo5.js`: flecha dorada en cualquier mapa (`P.wp.m` = mapa del destino, `wpRoute` lleva al portal/puerta; `WP_M` recuerda el mapa de cada botón «Seguir»), sitio exacto por paso en cada secreto (`SEC_WHERE`, `VRP`), aviso 📍 «Siguiente» bajo la misión (`secNext`, `#secChip`), pestañas 👹 Enemigos y 🐺 Subrazas en la lupa (`guiaX`), lobo híbrido (`P.srF` 1 = híbrido, 2 = cuatro patas; `wolfHybrid`) y Agarre de Sangre del vampiro (`srv1`, tipo `vgrab`: el tipo `grab` ya lo usa el pez), que también chupa a jugadores con PvP.
## Pendiente o ideas que dejó abiertas

- Lanzas, hachas y mazas solo las usa el guerrero; si las quiere para otras clases, hay que darles agarre y atlas por clase.
- El demonio, el brujo sapo y los demás personajes dark fantasy siguen dibujados en código: si manda los personajes sobre fondo liso, extraerlos igual que las criaturas.
- «Cooperativo local» de la propuesta del Velo Roto (la captura venía cortada).
- Confirmar qué quiso decir con «que las razas puedan rivalizar» (se interpretó como clases igualadas en PvP).
- APK: no ha cambiado la parte Android desde la 4.11; las versiones llegan por el actualizador interno.

## Sprites

Las hojas de todo lo creado están en `docs/sprites/` (personajes del Velo Roto, criaturas de Altavela, campamento, armas tier 1-6 y 22-26, ataques, armaduras y uniforme). Las imágenes de referencia ya recortadas están en `tools/dev/*_ref/`.
