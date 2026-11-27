// ================= 6.56 · Rendimiento en ciudades llenas y celulares lentos =================
// Medido con la CPU 4 veces más lenta (como un celular sencillo): España, Lima y México tienen 600-1.300 NPC y la
// Aldea de Albor ~230. Todo con ganchos (src/00h_hooks.js), sin envolturas nuevas y sin borrar nada.
const V656 = { crowd: 0, cnt: 0, frame: -1, curE: null, uiT: 0 };

// 1) Ticks de interfaz a 10 veces por segundo. Hay ~380 funciones en V33_TICKS que corren en cada fotograma; las que no
//    usan el tiempo (sin parámetro dt) y solo miran o cambian botones de la pantalla ($(...), document) no necesitan 60
//    pasadas por segundo. Las de juego (con dt, movimiento, efectos) siguen en cada fotograma, igual que antes.
const V656_UI = new WeakMap();
function v656IsUI(f) {
  let r = V656_UI.get(f); if (r !== undefined) return r;
  let s = ''; try { s = Function.prototype.toString.call(f); } catch (e) { }
  r = f.length === 0 && /\$\(|document\.|querySelector/.test(s) && !/requestAnimationFrame|G\.fx|G\.parts|moveEnt|stepAnim|setAnim|\bdt\b/.test(s);
  V656_UI.set(f, r); return r;
}
hookBefore('v33Tick', function (dt) {
  V656.uiT += dt || 0; const ui = V656.uiT >= 0.1; if (ui) V656.uiT = 0;
  for (const f of V33_TICKS) { if (!ui && v656IsUI(f)) continue; try { f(dt); } catch (e) { errOnce('tick', e); } }
  return HOOK_SKIP;
});

// 2) Cuántos NPC se ven en pantalla (se cuenta mientras se dibujan) y cuál se está dibujando ahora.
hookBefore('drawEnt', function (e) {
  if (G.frame !== V656.frame) { V656.crowd = V656.cnt; V656.cnt = 0; V656.frame = G.frame; }
  if (e && e.type === 'npc') V656.cnt++; V656.curE = e;
});
hookAfter('drawEnt', function () { V656.curE = null; });

// 3) Multitud lejana sin detalle HD («sin boca ni brillos finos»): con 18 o más NPC en pantalla, los que están a más
//    de ~10 casillas se dibujan con su sprite normal (misma ropa, pelo y colores) y el detalle HD queda para los de
//    cerca. Así no se generan y borran dibujos HD sin parar en las plazas llenas. Los que ya tienen el cuadro HD hecho,
//    los que te siguen, los de escenas, tu pareja, hijos y mascotas siguen en HD.
hookBefore('hdEnsure', function (A, col, row, force) {
  if (force) return; const e = V656.curE, P = G.P; if (!e || !P || e.type !== 'npc' || V656.crowd < 18) return;
  if (e.follow || e.scene || e.pet || e.kidOf || e.dawnCrew || e.crewReady) return;
  if (Math.abs(e.x - P.x) + Math.abs(e.y - P.y) < 160) return;
  if (A && A.hd && A.hdDone) { const N = A.hdDone.length / 4; if (A.hdDone[row * N + col]) return; }
  return HOOK_SKIP;   // devuelve undefined: atlasBlit dibuja el cuadro normal
});

// 4) NPC fuera de pantalla: antes cada uno pasaba en cada fotograma por updateNPC (unas 30 capas) solo para que el
//    gancho de la 6.14 dijera «todavía no». Ahora el bucle de update (src/53_maps.js) pregunta aquí primero y solo lo
//    llama cuando toca: 4 veces por segundo a más de 1,3 pantallas y 2 veces por segundo a más de 2,5. Se mueven igual
//    con el tiempo acumulado. Los que te siguen, de escenas, pareja, hijos y mascotas siguen en cada fotograma.
// Devuelve el tiempo con el que hay que actualizarlo, o -1 si este fotograma se salta.
function v656NpcDt(e, dt) {
  const P = G.P; if (!P || e.follow || e.dawnCrew || e.crewReady || e.kidOf || e.scene || e.pet || e === (typeof COMP !== 'undefined' && COMP && COMP.e)) return dt;
  const W = typeof VW !== 'undefined' ? VW : 480, H = typeof VH !== 'undefined' ? VH : 270, ax = Math.abs(e.x - P.x), ay = Math.abs(e.y - P.y);
  if (ax < W * 1.3 && ay < H * 1.3) { if (e._v656dt) { const d = e._v656dt; e._v656dt = 0; return Math.min(1, dt + d); } return dt; }
  e._v656dt = (e._v656dt || 0) + dt; if (e._v656dt < (ax > W * 2.5 || ay > H * 2.5 ? 0.5 : 0.25)) return -1;
  const d = Math.min(e._v656dt, 1); e._v656dt = 0; return d;
}

// 5) (Probado y descartado: filtrar los NPC lejanos en interactTarget no mejoraba la medida y rompía la fonda de
//    tests/v577.txt, que busca entidades lejos del jugador.)

// 6) Memoria al cambiar de mapa: los dibujos de personajes de la ciudad que dejas y los trozos de suelo ya pintados de
//    los mapas donde no estás se liberan a los 4 s (se vuelven a pintar solos si regresas). Antes esperaban hasta 25 s
//    y los trozos de suelo de Lima, México, España… se quedaban toda la sesión.
let V656_GCT = null;
hookAfter('setMap', function () {
  clearTimeout(V656_GCT);
  V656_GCT = setTimeout(() => { try {
    if (typeof optGC === 'function') optGC(true);
    const cur = G.map; for (const k in G.maps) { const M = G.maps[k]; if (M && M !== cur && M !== G.world && M.chunks && typeof M.chunks.clear === 'function' && M.chunks.size > 8) M.chunks.clear(); }
  } catch (e) { errOnce('v656 gc', e); } }, 4000);
});

// 7) Ciudades aparcadas: al salir de Lima, México, España… sus NPC (camareros, paelleros, puestos, multitud: más de
//    1.600 tras visitar tres ciudades) seguían en G.ents y TODO el juego los recorría en cada fotograma, también en la
//    Aldea de Albor. Ahora se guardan aparte (los mismos, con su estado) y vuelven a G.ents al regresar a esa ciudad.
//    No se aparcan los que te siguen, los de escenas, pareja, hijos, mascotas, ni los carritos de comida de Lima (salen
//    en el mapa de Lima aunque estés fuera).
function v656Parkable(e, id) {
  if (!e || e.type !== 'npc' || e.remove) return false;
  if (!(e.map === id || (e.map === 'hidden' && (e._v74h === id || e._v75h === id)))) return false;
  if (e.follow || e.kidOf || e.pet || e.scene || e.dawnCrew || e.crewReady || e === (typeof COMP !== 'undefined' && COMP && COMP.e)) return false;
  if (typeof dlg !== 'undefined' && dlg && dlg.npc === e) return false;
  return !/cart/.test(String(e.id || ''));
}
hookBefore('setMap', function (M) {
  try {
    const old = G.map; if (!M || old === M) return;
    if (old && old !== G.world && old.id && !old._v656park && G.ents.length > 300) {
      const id = old.id; let n = 0; for (const e of G.ents) if (v656Parkable(e, id)) n++;
      if (n >= 60) { const park = [], keep = []; for (const e of G.ents) (v656Parkable(e, id) ? park : keep).push(e); old._v656park = park; G.ents = keep; }
    }
    if (M._v656park) { const S = new Set(G.ents); for (const e of M._v656park) if (!e.remove && !S.has(e)) G.ents.push(e); M._v656park = null; }
  } catch (e) { errOnce('v656 park', e); }
});
