// ================= 6.12: GANCHOS (sin apilar más capas) =================
// Hasta la 6.11 cada sistema nuevo envolvía una función global (`calcStats = function () { const r = _cs(...); ... }`).
// Funciona, pero algunas ya tienen 40-70 capas y cada cambio es más fácil que rompa algo. Desde la 6.12 lo nuevo se
// registra aquí y src/zz_hooks_fin.js instala UNA sola capa por función cuando ya ha cargado todo el juego, así que
// se comporta igual que una envoltura más añadida al final (la más externa), pero sin crecer la pila.
//
//   hookBefore('hbGather', (job) => { ...; return HOOK_SKIP; })   // HOOK_SKIP: no se ejecuta la función ni lo demás
//   hookAfter('calcStats', (S, P) => { S.atk *= 1.1; })            // recibe (resultado, ...argumentos); si devuelve
//                                                                  // algo distinto de undefined, sustituye el resultado
//   hookAround('pickFish', (next, hab) => Math.random() < .5 ? miPez() : next(hab))   // control total
//
// Orden: antes → alrededor (el primero registrado es el más externo) → función → después, en orden de registro.
// Un gancho que falla no rompe el juego: se avisa una vez (errOnce) y se sigue con el resto.
// Solo sirve para funciones globales declaradas con `function` (las `const f = () =>` no se pueden enganchar).
const HOOK_SKIP = Object.freeze({ hookSkip: true });
const HOOKS = {};
let HOOKS_LIVE = false;
function hookReg(kind, name, fn) {
  if (typeof fn !== 'function') throw new Error('hook ' + name + ': falta la función');
  const H = HOOKS[name] || (HOOKS[name] = { before: [], around: [], after: [], base: null });
  H[kind].push(fn); if (HOOKS_LIVE && !H.base) hookInstall(name); return fn;
}
const hookBefore = (name, fn) => hookReg('before', name, fn);
const hookAfter = (name, fn) => hookReg('after', name, fn);
const hookAround = (name, fn) => hookReg('around', name, fn);
function hookWarn(name, e) { try { if (typeof errOnce === 'function') errOnce('hook ' + name, e); else console.warn('hook ' + name, e); } catch (x) { } }
function hookInstall(name) {
  const H = HOOKS[name]; if (!H || H.base) return;
  const base = globalThis[name]; if (typeof base !== 'function') { hookWarn(name, new Error('no es una función global')); return; }
  H.base = base;
  const disp = function () {
    const self = this, a = arguments;
    for (let i = 0; i < H.before.length; i++) { let v; try { v = H.before[i].apply(self, a); } catch (e) { hookWarn(name, e); } if (v === HOOK_SKIP) return undefined; }
    let r;
    if (!H.around.length) r = base.apply(self, a);
    else { const call = (k, args) => k >= H.around.length ? base.apply(self, args) : (() => { try { return H.around[k].call(self, (...x) => call(k + 1, x), ...args); } catch (e) { hookWarn(name, e); return call(k + 1, args); } })(); r = call(0, Array.from(a)); }
    for (let i = 0; i < H.after.length; i++) { try { const v = H.after[i].call(self, r, ...a); if (v !== undefined) r = v; } catch (e) { hookWarn(name, e); } }
    return r;
  };
  disp.hookOf = name; globalThis[name] = disp;
}
function hooksInstallAll() { HOOKS_LIVE = true; for (const name in HOOKS) hookInstall(name); }
