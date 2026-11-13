// ================= v4.11: LOS ÁRBOLES NUNCA SE EXTINGUEN =================
// - Árboles talados: el tocón se convierte en retoño y luego vuelve a ser árbol (no se puede talar el retoño).
// - Árboles, arbustos y hierbas quitados con el martillo de construcción vuelven a crecer al cabo de un tiempo,
//   salvo que hayas construido algo en esa casilla (suelo, pared, mueble o tierra de cultivo): así puedes despejar
//   terreno para construir sin que el bosque desaparezca para siempre. Las rocas y menas quitadas no vuelven.
// - El tiempo cuenta en horas reales (sigue contando con el juego cerrado) y se sincroniza en multijugador porque
//   el registro de «quitado» desaparece para todos.
const FOREST = { sapling: 40, regrowMs: 15 * 60 * 1000, plants: new Set(['tree', 'bush', 'herb']) };
SAVEKEYS.push('clrT');
// el tocón pasa a retoño y el retoño a árbol
{ const _rr = respawnResources; respawnResources = function (M) {
  if (M && M.objs) for (const o of M.objs) if (o.k === 'tree' && o.st === 'stump' && o.respawn && G.t > o.respawn) { o.st = 'sapling'; o.respawn = G.t + FOREST.sapling; }
  return _rr(M);
}; }
// sprite del retoño: tronquito y copa pequeña con el color de hojas de su especie
function genSapling(sp) {
  const W = 18, H = 22, tp = new Pix(W, H), cp = new Pix(W, H), L = LEAF[sp] || (sp === 'pinonev' ? LEAF.pino : LEAF.roble), B = sp === 'abedul' ? BARK.birch : BARK.std;
  tp.rect(8, 12, 2, 8, B[2]); tp.vl(8, 12, 8, B[3]); tp.ell(9, 20, 3, 1, B[1]);
  const n = L.length; cp.ball(9, 10, 5.2, 4.6, [L[0], L[Math.min(1, n - 1)], L[Math.min(2, n - 1)], L[Math.min(3, n - 1)]]); cp.ball(6, 8, 2.6, 2.2, [L[1], L[2], L[Math.min(3, n - 1)], L[Math.min(4, n - 1)]]); cp.set(11, 6, L[n - 1]);
  if (sp === 'pinonev') { cp.hl(6, 6, 6, C('#f0f6ff')); cp.hl(7, 5, 4, C('#ffffff')); }
  tp.outline(OUTL); cp.outline(OUTL);
  return { trunk: tp.canvas(), canopy: cp.canvas(), ax: 9, ay: 21, w: W, h: H, sh: [5, 2] };
}
{ const _os = objSprite; objSprite = function (o) { if (o && o.k === 'tree' && o.st === 'sapling') return spr('sapling' + o.sp, () => genSapling(o.sp)); return _os(o); }; }
// lo quitado con el martillo vuelve a crecer si no construiste encima
function forestBusy(m, x, y) { for (const L of [0, 1]) if (bldGet(m, x, y, L)) return true; const P = G.P; if (P && P.map === m && Math.abs(Math.floor(P.x / 16) - x) <= 1 && Math.abs(Math.floor(P.y / 16) - y) <= 1) return true;
  for (const r of G.remote.values()) if (r.map === m && Math.abs(Math.floor(r.x / 16) - x) <= 1 && Math.abs(Math.floor(r.y / 16) - y) <= 1) return true; return false; }
let forestT = 0;
function forestTick(dt) {
  forestT += dt; if (forestT < 10) return; forestT = 0; const P = G.P; if (!P || P.ghost || typeof bldMine !== 'function') return;
  P.clrT = P.clrT || {}; const now = Date.now(); let changed = false;
  for (const r of [...bldMine().values()]) {
    if (r.k !== 'clr') continue; const key = bkey(r.m, r.x, r.y, r.L);
    if (!P.clrT[key]) { P.clrT[key] = now; continue; }
    const M = G.maps[r.m], ent = M && M.bobj && M.bobj.get(key), o = ent && ent.o && ent.o.clr; if (!o) continue;   // se revisa cuando ese mapa está cargado
    if (!FOREST.plants.has(o.k)) { delete P.clrT[key]; continue; }   // rocas y menas: para siempre
    if (now - P.clrT[key] < FOREST.regrowMs || forestBusy(r.m, r.x, r.y)) continue;
    bldDel(r.m, r.x, r.y, r.L); delete P.clrT[key]; changed = true; bldApply(M);
    if (o.k === 'tree') { o.st = 'sapling'; o.respawn = G.t + FOREST.sapling; }
    if (M === G.map) burst(o.px, o.py - 6, 8, { sp: 25, up: 30, g: -10, life: 0.8, c: ['#8aff6a', '#5ac04a', '#ffffff'] });
  }
  for (const k in P.clrT) if (!bldMine().has(k)) delete P.clrT[k];
  if (changed) bldSave();
}
V33_TICKS.push(forestTick);
