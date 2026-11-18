// ================= 5.26: RENDIMIENTO EN LIMA Y LOS PAÍSES =================
// - Limpieza de dibujos (optGC): antes borraba los atlas de los peatones, la gente del aeropuerto, los fans… porque no
//   están en G.ents. Seguían en pantalla y, al salir el siguiente peatón, se volvía a dibujar entero (tirones cada pocos
//   segundos en la Plaza de Armas). Ahora todo atlas dibujado en los últimos 45 s cuenta como en uso.
{ const _ab = atlasBlit; atlasBlit = function (c, A) { if (A) A.lu = G.t; return _ab.apply(this, arguments); }; }
optGC = function (force) {
  const lim = OPT.on || OPT_LOWMEM ? 90 : 160; if (!force && ATL.size <= lim) return 0;
  const use = new Set(); for (const e of G.ents) if (e.atlas) use.add(e.atlas); for (const r of G.remote.values()) if (r.atlas) use.add(r.atlas); if (G.P && G.P.atlas) use.add(G.P.atlas);
  const now = G.t, old = []; for (const [k, a] of ATL) if (!use.has(a) && !(a && a.lu > now - 45)) old.push([k, a]); old.sort((p, q) => (p[1].lu || 0) - (q[1].lu || 0));
  let n = 0; const keep = Math.round(lim * 0.7);
  for (const [k, a] of old) { if (ATL.size <= keep) break; ATL.delete(k); const i = HD_LIVE.indexOf(a); if (i >= 0) HD_LIVE.splice(i, 1); a.hd = null; a.hdX = null; a.hdDone = null; n++; }
  return n;
};
// - Detalle HD: con mucha gente en pantalla (Plaza de Armas, procesión, estaciones) había más personajes visibles que
//   dibujos HD permitidos, así que se borraban y rehacían en bucle. Ahora solo se libera un dibujo HD que no se haya
//   visto en 2 s; si todos están en pantalla, el personaje nuevo se ve normal (sin HD) hasta que haya hueco.
{ const _he = hdEnsure; hdEnsure = function (A, col, row, force) {
  if (A && A.hdL && !A.hd && !force) { const lim = OPT_LOWMEM ? 14 : 26; if (HD_LIVE.length >= lim) { const t0 = G.t - 2; let free = false; for (const o of HD_LIVE) if ((o.hdT || 0) < t0) { free = true; break; } if (!free) return false; } }
  return _he.apply(this, arguments); }; }
// - Peatones de Lima y los países: sus dibujos se preparan durante la transición al entrar (pantalla negra), no al
//   aparecer cada uno (cada dibujo nuevo costaba ~70 ms en un celular lento: un tirón por peatón distinto).
{ const _sm = setMap; setMap = function (M) { if (M && M.lima) { try { const AP = M.pedApps || PE_APPS_W, n = M.pedApps ? AP.length : PE_WALK_N; for (let i = 0; i < n; i++) xwAtlas(i, AP); } catch (e) { } } return _sm.apply(this, arguments); }; }
// - Procesión de la Plaza de Armas: los 12 devotos llevaban cada uno su cartel «Devoto de octubre» todo el rato; ahora
//   el nombre sale solo cuando estás al lado (como los parroquianos de la taberna). Sigue el letrero del anda.
V33_TICKS.push(() => { if (typeof PROC === 'undefined' || !PROC.ents.length || PROC._tag) return; for (const e of PROC.ents) e.noTag = 1; PROC._tag = 1; });
