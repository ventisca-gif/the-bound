# The Bound · Guía de escalado de enemigos del nivel 600 al 700

Para cualquier IA o persona que añada enemigos, jefes y transformaciones entre el nivel 600 y el 700.
Lee antes `AGENTS.md`, `docs/NOTAS.md` (estado y cómo trabajar) y `docs/LORE.md` si el enemigo cuenta historia.
Los números de esta guía se midieron con el propio juego (versión 6.02, `MAXLV = 700`).

## 1. Dónde se definen

| Qué | Dónde | Formato |
|---|---|---|
| Monstruo normal | `MOBS[id]` en un archivo nuevo `src/6zzzz…_vXXX.js` | `{ n, art, reg, lv: [min, max], hp, atk, def, spd, ai, fam, drops }` |
| Jefe | `BOSSES[id]` | `{ n, lv, art, hp, atk, def, spd, moves, minion, drops, r }` |
| Estadísticas reales | `mobStats(def, lv, boss)` en `src/40_data.js` | ver § 2 |
| Ajuste de vida por jefe | `BOSS_TUNE[id]` (`src/6zz9j_v468.js`) | multiplicador de vida |
| Daño extra al jugador (jefes del Mar de Dawn) | `DAWN_RETO[id]` (`src/6zzzzb_dawn_reto.js`) | multiplica solo el daño que el jefe hace al jugador |
| Mazmorras de portal | `DG`, `DG_MOBS`, `DG_BOSS`, `DG_LAYOUT` (`src/6zzzzo_v599_portales.js`) | ver ese archivo |

Reglas del proyecto:
- No se edita el archivo de otra versión salvo para arreglar un fallo. Lo nuevo va en un archivo nuevo, envolviendo funciones (`const _f = f; f = function () { … }`).
- Los textos van con `L2('español', 'English')`.
- Cada sistema nuevo lleva su entrada en la Lupa (`GSIS` o `LUPA_DAWN`).
- No se toca el daño contra monstruos para equilibrar el PvP: el PvP tiene sus propios ajustes en `src/6zyzb_pvp.js`.

## 2. Fórmula base (`mobStats`)

```
vida    = (20 + 12·L + 0,45·L²) × def.hp
ataque  = (6 + 3,2·L + 0,06·L²) × def.atk
defensa = (2 + 1,3·L) × def.def
```

`def.hp`, `def.atk` y `def.def` son los **multiplicadores** que escribes en `MOBS`/`BOSSES`. Valores con multiplicador 1:

| Nivel | Vida | Ataque | Defensa | Experiencia |
|---|---|---|---|---|
| 500 | 118.520 | 16.606 | 652 | 5.342 |
| 600 | 169.220 | 23.526 | 782 | 6.585 |
| 650 | 197.945 | 27.436 | 847 | 7.219 |
| 700 | 228.920 | 31.646 | 912 | 7.862 |

Jefes: a partir del nivel 200 el juego les quita un 20 % de vida, y después aplica `BOSS_TUNE`. Con `hp 30`, `atk 2,2 + L/400` y `def 2 + L/400` (la fórmula de los jefes de portal) salen, ya en el juego:

| Jefe de nivel | Vida | Ataque | Defensa |
|---|---|---|---|
| 600 | 4.061.280 | 87.046 | 2.737 |
| 650 | 4.750.680 | 104.943 | 3.070 |
| 700 | 5.494.080 | 125.002 | 3.420 |

## 3. Contra quién peleas (héroe de referencia)

Mejor equipo de su nivel +10, pasivas al máximo, ascensión, evolución y Mitad Dragón (forma plena):

| Héroe | Vida | Ataque | Defensa | Poder | Armadura | Arma |
|---|---|---|---|---|---|---|
| Guerrero 600 | 75.908 | 34.701 | 10.860 | 93.283 | tier 44 | tier 43 |
| Guerrero 700 | 89.621 | 38.562 | 13.102 | 105.739 | tier 50 | tier 43 |
| Mago 600 | 45.902 | 39.615 | 6.451 | 93.497 | tier 44 | tier 43 |
| Mago 700 | 54.339 | 44.064 | 7.803 | 105.266 | tier 50 | tier 43 |

**Pendiente:** no hay armas por encima del nivel 600 (la mejor es la de tier 43), por eso el ataque casi no sube del 600 al 700. Hacen falta armas de nivel 650 y 700 para cada clase, que suban el ataque ~+15 % y ~+30 %.

Reducción de daño del jugador: `dmgRedP(def, nivelDelAtacante) = K / (K + def·1,1)` con `K = 100 + (nivel − 40)`. A nivel 700, un guerrero con 13.000-16.000 de defensa solo recibe el 3-4 % del ataque bruto. **Por eso, a estos niveles, el ataque del enemigo tiene que ser alto** (`atk` 3,5-5 en jefes) o llevar `DAWN_RETO`.

## 4. Objetivos de dificultad

Medidos contra el héroe de referencia de su mismo nivel, con despertares y transformación:

| Tipo | % de vida que quita un golpe normal (guerrero / mago) | Tiempo para matarlo solo |
|---|---|---|
| Monstruo normal 600-700 | 2-4 % / 6-10 % | 4-8 s |
| Élite de mazmorra | 4-6 % / 12-18 % | 15-30 s |
| Jefe de zona o portal | 6-9 % / 18-27 % | 3-6 min |
| Súper jefe (como Shanks) | 8-12 % / 25-35 % | 6-10 min |
| Ataque especial con aviso (`telegraph`) | ×1,6 a ×2,1 del golpe normal | — |

Referencias que ya están en el juego:
- **Shanks (600):** `hp 80, atk 4,4, def 4,0`, `DAWN_RETO` ×1,7 → guerrero 8 %, mago 26 %. Es el enemigo más fuerte por ahora.
- **Kuro (580):** `hp 53, atk 3,86, def 3,43`, ×1,92.
- **Monstruos de portal 560-610:** `hp 1,2-2,5`, `atk 1,8-1,9`, `def 1,1-2,2`.

Multiplicadores recomendados del 600 al 700:

| Tipo | hp | atk | def | spd |
|---|---|---|---|---|
| Normal rápido (lobo, arpía) | 1,2-1,4 | 1,8-2,0 | 1,0-1,2 | 70-80 |
| Normal tanque (gólem, escarabajo) | 2,2-2,6 | 1,7-1,9 | 2,0-2,4 | 30-40 |
| A distancia (espectro, mago) | 1,1-1,3 | 1,9-2,1 | 1,0 | 60 |
| Jefe 650 | 40-60 | 3,6-4,2 | 3,4-3,8 | 48-56 |
| Jefe 700 (final) | 70-100 | 4,4-5,0 | 4,0-4,6 | 56-66 |

El nivel del monstruo en `lv: [min, max]` decide su experiencia y su color. Un jefe de 700 nunca debe ser más débil que Shanks (`hp 80, atk 4,4`).

## 5. Transformaciones de los enemigos

Patrón que ya usa el juego (`hnFormOn`, en `src/6zz9zzzzzzzzzzzzzzzzzzzzzzzzzz_v552.js`): al bajar del 60 % de vida, el enemigo se transforma una vez:

```js
// envoltura de hitMob: comprueba la vida después de cada golpe
{ const _hm = hitMob; hitMob = function (m, base, src) { const d = _hm.apply(this, arguments);
  if (m && m.mid === 'mi_jefe' && !m.fase2 && !m.dying && m.hp > 0 && m.hp < m.maxhp * 0.6) {
    m.fase2 = 1; m.atk = Math.round(m.atk * 1.32); m.df = Math.round(m.df * 1.15); m.spd *= 1.1;
    m.hp = Math.min(m.maxhp, m.hp + Math.round(m.maxhp * 0.12));      // se cura un 12 %
    m.atlas = miAtlasTransformado();                                     // sprite nuevo (capa aparte, no tocar el original)
    banner(m.name + ': ' + L2('Forma liberada', 'Unleashed form'), ''); G.shake = 6; sfx('boss'); }
  return d; }; }
```

Escalas recomendadas:
- **Fase 2 (60 %):** ataque ×1,30-1,35, defensa ×1,15, velocidad ×1,1, se cura un 10-12 %, y uno o dos movimientos nuevos en `moves`.
- **Fase 3 (25 %), solo jefes de 680-700:** ataque ×1,2 más, recarga de ataques ×0,7 (`m.cd`) y un ataque de zona grande con aviso. No vuelve a curarse.
- El aura o el efecto de la transformación se dibujan en una capa aparte (`WORLD_DRAW` o `DL_HOOKS`), nunca en el sprite. Ejemplo: el aura de `hnFormOn`.

## 6. Cómo comprobarlo

1. `python3 build.py` → crea `dist/test.html`.
2. `python3 tools/dev/jefes.py file://$PWD/dist/test.html` → tiempo para matar cada jefe y aguante. `--solve` sugiere `BOSS_TUNE`.
3. Medir el daño real: crea un héroe del nivel del jefe y llama a `hurtPlayer(m.atk, { lv: m.lv })` muchas veces, comparando la vida antes y después. Ese método es el que dio las tablas de esta guía.
4. Si añades ropa, armaduras o sprites humanos: `python3 tools/dev/fitcheck.py file://$PWD/dist/test.html out` debe dar 0 avisos.
5. Para publicar, sigue el apartado «Versiones» de `AGENTS.md`: sube la versión, el CHANGELOG, el `tfoot` y `release.py`.
