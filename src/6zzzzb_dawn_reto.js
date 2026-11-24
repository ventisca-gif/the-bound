// 5.91 · Jefes del Mar de Dawn que pesan por su daño (Sergio: «que los enemigos sean un reto también por el daño»).
// A su mismo nivel, con despertares y transformación, la defensa quitaba el 93-97 % de sus golpes.
// Solo se multiplica el daño que el jefe hace AL JUGADOR: Luffy, Zoro y Nami (shellsHurtAlly), los monstruos
// normales, los refuerzos, la vida del jefe y el PvP no cambian. Pensado para pelear con la tripulación.
const DAWN_RETO = { dawn_alvida: 2.2, shells_morgan: 2.0, orange_cabaji: 2.0, orange_buggy: 2.0, dawn_shanks_boss: 1.7 };
let DAWN_RETO_SRC = null; // jefe cuyo turno, aviso o proyectil se está resolviendo
function dawnRetoWrap(f, b) { return function () { const prev = DAWN_RETO_SRC; DAWN_RETO_SRC = b; try { return f.apply(this, arguments); } finally { DAWN_RETO_SRC = prev; } }; }
{ const old = updateBoss; updateBoss = function (m) { return DAWN_RETO[m && m.mid] ? dawnRetoWrap(old, m).apply(this, arguments) : old.apply(this, arguments); }; }
// golpes con retraso: avisos en el suelo, efectos y temporizadores creados durante el turno del jefe
{ const old = addFx; addFx = function (o) { const b = DAWN_RETO_SRC; if (b && o) for (const k of ['cb', 'cbTick']) if (typeof o[k] === 'function') o[k] = dawnRetoWrap(o[k], b); return old.apply(this, arguments); }; }
{ const old = spawnProj; spawnProj = function () { const e = old.apply(this, arguments); if (e && DAWN_RETO_SRC) e.dawnReto = DAWN_RETO_SRC; return e; }; }
{ const old = window.setTimeout; window.setTimeout = function (f, ...a) { const b = DAWN_RETO_SRC; return old.call(window, b && typeof f === 'function' ? dawnRetoWrap(f, b) : f, ...a); }; }
{ const old = hurtPlayer; hurtPlayer = function (base, src) { const b = (src && (src.dawnReto || src.orangeBoss)) || DAWN_RETO_SRC, k = b && b.boss && DAWN_RETO[b.mid];
  return old.call(this, k && typeof base === 'number' ? base * k : base, ...Array.prototype.slice.call(arguments, 1)); }; }
