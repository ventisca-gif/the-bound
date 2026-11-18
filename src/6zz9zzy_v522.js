// ================= v5.22: ARREGLOS DE VIAJE Y CASA EN OTROS PAÍSES =================
// · Icono propio para el bus interprovincial (antes era el mismo que el Metropolitano) y cartel grande en las paradas.
// · En el mapa, tocar un lugar de la lista pone la flecha dorada hasta él.
// · Si vives en otro país (tienes casa allí) y saliste del juego en ese país, al volver apareces en tu casa de allí.
// · La trinchera del Metropolitano en Lima no se puede pisar (ni tú ni los vecinos): solo se cruza por los puentes.

// ---------- icono del bus interprovincial ----------
JOBX.busi = p => { p.rect(0, 3, 16, 9, C('#f4f0e8')); p.rect(0, 9, 16, 2, C('#c8302a')); p.rect(0, 3, 16, 1, C('#c8302a')); for (let x = 1; x < 14; x += 3) p.rect(x, 5, 2, 3, C('#3a5068')); p.rect(14, 5, 2, 4, C('#7ab0d8')); p.ball(3, 13, 1.7, 1.7, [C('#1a1a1e'), C('#3a3a40')]); p.ball(12, 13, 1.7, 1.7, [C('#1a1a1e'), C('#3a3a40')]); };
UI_ICONS.push('jobx:busi');
MAPC.pebus = [L2('Bus interprovincial (a Trujillo / a Lima)', 'Intercity bus (to Trujillo / to Lima)'), 'Intercity bus', '#ff6a3a', 'jobx:busi'];
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); for (const q of out) if (q.c === 'petrans' && /interprovincial|Terminal Terrestre|Bus Terminal|Intercity/.test(q.t || '')) q.c = 'pebus'; return out; }; }
XSPR.tru_cartel_bus = () => { const [c, g] = XC(70, 58); g.fillStyle = '#3a3a40'; g.fillRect(8, 22, 3, 36); g.fillRect(59, 22, 3, 36); g.fillStyle = '#c8302a'; g.fillRect(0, 0, 70, 24); g.fillStyle = '#f4f0e8'; g.fillRect(2, 2, 66, 20); g.fillStyle = '#c8302a'; g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.fillText(L2('BUS A', 'BUS TO'), 35, 11); g.fillText('TRUJILLO', 35, 20); return { c, ax: 35, ay: 57 }; };
XSPR.tru_cartel_lima = () => { const [c, g] = XC(70, 58); g.fillStyle = '#3a3a40'; g.fillRect(8, 22, 3, 36); g.fillRect(59, 22, 3, 36); g.fillStyle = '#c8302a'; g.fillRect(0, 0, 70, 24); g.fillStyle = '#f4f0e8'; g.fillRect(2, 2, 66, 20); g.fillStyle = '#c8302a'; g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.fillText(L2('BUS A', 'BUS TO'), 35, 11); g.fillText('LIMA', 35, 20); return { c, ax: 35, ay: 57 }; };
function trSign(M, kind) { const t = M.trTerm || (kind === 'lima' ? [TR_TERM.x, TR_TERM.y] : null); if (!t) return; const p = freePxNear(M, (t[0] - 3) * 16, (t[1] - 1) * 16, 4); if (!p) return; addObj(M, 'furn', Math.floor(p[0] / 16), Math.floor(p[1] / 16), { f: kind === 'lima' ? 'tru_cartel_lima' : 'tru_cartel_bus', fp: [[0, 0]] }); }
{ const _ml = makeLima; makeLima = function () { const had = G.maps.lima, M = _ml.apply(this, arguments); if (!had && M) try { trSign(M, 'tru'); lmTrenchBlock(M); } catch (e) { console.warn(e); } return M; }; }
{ const _mn = makeLimaNorte; makeLimaNorte = function () { const had = G.maps.lima_norte, M = _mn.apply(this, arguments); if (!had && M) try { trSign(M, 'tru'); } catch (e) { console.warn(e); } return M; }; }
{ const _mt = makeTrujillo; makeTrujillo = function () { const had = G.maps.trujillo, M = _mt.apply(this, arguments); if (!had && M) try { trSign(M, 'lima'); } catch (e) { console.warn(e); } return M; }; }
// la Lupa de Trujillo lleva a la parada real de Lima
GSIS.forEach(g => { if (g[0] === 'trujillo') g[3] = () => G.P && G.P.map === 'trujillo' ? { loc: [TR_TERM.x, TR_TERM.y], t: L2('Terminal Terrestre', 'Bus Terminal'), m: 'trujillo' } : G.P && G.P.map === 'lima_norte' ? { loc: (G.maps.lima_norte && G.maps.lima_norte.trTerm) || TR_LIMA_TERM.lima_norte, t: L2('Bus a Trujillo (Plaza Norte)', 'Bus to Trujillo (Plaza Norte)'), m: 'lima_norte' } : { loc: (G.maps.lima && G.maps.lima.trTerm) || TR_LIMA_TERM.lima, t: L2('Bus a Trujillo (La Victoria)', 'Bus to Trujillo (La Victoria)'), m: 'lima' }; });

// ---------- tocar un lugar de la lista del mapa pone la flecha ----------
{ const _rm = renderMap; renderMap = function (B) { _rm.apply(this, arguments); try { const Wd = MAPW_LIST[MAPW]; if (!Wd || Wd.id === 'world') return; const M = G.maps[Wd.id]; if (!M || M.peru || M.mxmap || M.esmap || !M.w) return;
  const pois = otherPOI(M).filter(q => !MAPF || q.c === MAPF), rows = [...document.querySelectorAll('#mwList .mreg')]; if (rows.length !== pois.length) return;
  rows.forEach((el, i) => { const q = pois[i]; el.style.cursor = 'pointer'; el.title = L2('Toca para seguirlo con la flecha', 'Tap to follow it with the arrow'); el.onclick = () => { setWp({ loc: [Math.round(q.x), Math.round(q.y)], m: Wd.id, t: q.t }); toast('➜ ' + q.t, 'info'); closePanel(); }; });
  const L = $('#mwList'); if (L && rows.length) L.insertAdjacentHTML('afterbegin', `<p class="hint" style="margin:.2em 0">${L2('Toca un lugar para ir con la flecha dorada.', 'Tap a place to go there with the golden arrow.')}</p>`); } catch (e) { console.warn(e); } }; }

// ---------- trinchera del Metropolitano: no se pisa ----------
function lmTrenchBlock(M) { const N = M.w * M.h; for (let i = 0; i < N; i++) if (M.lg[i] === LM_G2.TRENCH) M.ter[i] = T.IWALL; if (M.chunks && M.chunks.clear) M.chunks.clear();
  for (const e of G.ents) { if (e.map !== M.id || e.type !== 'npc') continue; const tx = Math.floor(e.x / 16), ty = Math.floor(e.y / 16); if (M.lg[M.I(tx, ty)] !== LM_G2.TRENCH) continue; const p = freePxNear(M, e.x, e.y, 20); if (p) { e.x = p[0]; e.y = p[1]; if (e.home) e.home = { x: p[0], y: p[1] }; } } }
V33_TICKS.push(() => { const P = G.P, M = G.map; if (!P || !M || !M.lima || !M.lg || P.ride || P.drv) return; const i = M.I(Math.floor(P.x / 16), Math.floor(P.y / 16)); if (M.lg[i] !== LM_G2.TRENCH) return; const p = freePxNear(M, P.x, P.y, 12); if (p) { P.x = p[0]; P.y = p[1]; } });

// ---------- vivir en otro país: al volver al juego apareces en tu casa de allí ----------
SAVEKEYS.push('abLast');
const AB_MAP_HOME = { japon: 'hogar_jp', lima: 'hogar_pe', lima_norte: 'hogar_pe', mexico: 'hogar_mx', espana: 'hogar_es', trujillo: 'hogar_tru' };
const abCountryOf = id => { if (AB_MAP_HOME[id]) return id; const base = id && homeBaseOf(id); return base && AB_HOUSES[base] ? AB_HOUSES[base][3] : null; };
{ const _sp = serializeP; serializeP = function (P) { const c = P && abCountryOf(P.inside || P.map); if (P) P.abLast = c || (P.map === 'world' ? null : P.abLast) || null; return _sp.apply(this, arguments); }; }
{ const _sg = startGame; startGame = function (save, isNew) { const r = _sg.apply(this, arguments); try { const P = G.P, c = !isNew && P && P.abLast, hid = c && AB_MAP_HOME[c]; if (hid && isHome(hid)) setTimeout(() => { try { const mk = { japon: makeJapan, lima: makeLima, lima_norte: makeLima, mexico: makeMexico, espana: makeEspana, trujillo: makeTrujillo }[c], D = mk(), d = D.abDoors && D.abDoors[hid];
    if (!d) return; P.retX = P.x; P.retY = P.y; P.abRet = { m: D.id, x: d[0] * 16 + 8, y: (d[1] + 1) * 16 + 8 }; P.inside = D.id; setMap(D, d[0] * 16 + 8, (d[1] + 1) * 16 + 8, 'down'); banner(HOUSES[hid].n, L2('Estás en tu casa de ', 'You are at your house in ') + HOUSES[hid].town); } catch (e) { console.warn(e); } }, 50); } catch (e) { console.warn(e); } return r; }; }
