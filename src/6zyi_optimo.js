// ================= v4.14: MODO OPTIMIZADO, LAG AUTOMÁTICO Y MEMORIA =================
// - Modo optimizado (Ajustes): sin lluvia ni clima, efectos simples, sin HD, como mucho 30 imágenes por segundo y
//   menos partículas. Se activa solo si el juego detecta lag seguido (y se puede quitar en Ajustes).
// - Ahorro en reposo: si no tocas la pantalla en 90 s y no estás en combate, el juego dibuja a 15 imágenes por segundo.
// - Memoria: los dibujos de personajes (atlas) ya no se acumulan toda la sesión: se borran los que nadie usa.
//   Antes, tras horas de juego (ropa probada, jugadores, atuendos de aldeanos), el celular podía cerrar el juego.
const OPT = { on: false, auto: false, lastIn: performance.now(), ema: 16, lagT: 0, bootT: performance.now(), prev: null };
try { OPT.on = localStorage.getItem('thebound.opt') === '1'; } catch (e) { }
const OPT_LOWMEM = (navigator.deviceMemory && navigator.deviceMemory <= 4) || /Android [4-8]\b/.test(navigator.userAgent);
function optApply(on, auto) {
  OPT.on = !!on; OPT.auto = !!auto; try { localStorage.setItem('thebound.opt', on ? '1' : '0'); } catch (e) { }
  if (on) { OPT.prev = OPT.prev || { q: SETTINGS.quality, w: SETTINGS.weather, hd: HDS > 1 }; SETTINGS.quality = 0; SETTINGS.weather = false; saveSettings(); if (HDS > 1) setHD(false); }
  else if (OPT.prev) { SETTINGS.quality = OPT.prev.q; SETTINGS.weather = OPT.prev.w; saveSettings(); if (OPT.prev.hd) setHD(true); OPT.prev = null; }
}
['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(ev => window.addEventListener(ev, () => { OPT.lastIn = performance.now(); }, { passive: true, capture: true }));
function optFpsCap(now) {
  const P = G.P, idle = now - OPT.lastIn > 90000 && !(P && P.combatT && G.t - P.combatT < 10) && !(typeof titleMode !== 'undefined' && titleMode);
  if (idle) return 15; if (OPT.on) return 30; return 0;
}
{ const _lp = loop; loop = function (ts) {
  const cap = optFpsCap(ts);
  if (cap && lastT && ts - lastT < 1000 / cap - 2) { requestAnimationFrame(loop); return; }
  if (lastT && !cap) { const d = ts - lastT; if (d < 250) OPT.ema = OPT.ema * 0.95 + d * 0.05;   // lag: media de los últimos fotogramas
    if (!OPT.on && ts - OPT.bootT > 20000 && !document.hidden) { OPT.lagT = OPT.ema > 45 ? OPT.lagT + d : 0; if (OPT.lagT > 8000) { optApply(true, true); OPT.lagT = 0; try { toast(L2('Se activó el modo optimizado porque el juego iba lento. Puedes quitarlo en Ajustes.', 'Optimized mode turned on because the game was lagging. You can turn it off in Settings.'), 'info', 6); } catch (e) { } } } }
  _lp(ts);
}; }
// menos partículas en modo optimizado
{ const _pt = part; part = function (x, y, o) { if (OPT.on && G.parts.length > 70) return; return _pt(x, y, o); }; }
// ---- memoria: atlas que nadie usa ----
{ const _ga = getAtlas; getAtlas = function (key, fn) { const a = _ga(key, fn); if (a && typeof a === 'object') a.lu = G.t; return a; }; }
let OPT_GCT = 0;
function optGC(force) {
  const lim = OPT.on || OPT_LOWMEM ? 90 : 160; if (!force && ATL.size <= lim) return 0;
  const use = new Set(); for (const e of G.ents) if (e.atlas) use.add(e.atlas); for (const r of G.remote.values()) if (r.atlas) use.add(r.atlas); if (G.P && G.P.atlas) use.add(G.P.atlas);
  const old = []; for (const [k, a] of ATL) if (!use.has(a)) old.push([k, a]); old.sort((p, q) => (p[1].lu || 0) - (q[1].lu || 0));
  let n = 0; const keep = Math.round(lim * 0.7);
  for (const [k, a] of old) { if (ATL.size <= keep) break; ATL.delete(k); const i = HD_LIVE.indexOf(a); if (i >= 0) HD_LIVE.splice(i, 1); a.hd = null; a.hdX = null; a.hdDone = null; n++; }
  return n;
}
// límite de dibujos HD más bajo en celulares con poca memoria (cada uno puede ocupar varios MB)
{ const _he = hdEnsure; hdEnsure = function (A, col, row, force) { const r = _he(A, col, row, force); const lim = OPT_LOWMEM ? 14 : 26;
  while (HD_LIVE.length > lim) { let k = 0; for (let j = 1; j < HD_LIVE.length; j++) if ((HD_LIVE[j].hdT || 0) < (HD_LIVE[k].hdT || 0)) k = j; const o = HD_LIVE.splice(k, 1)[0]; if (o === A) { HD_LIVE.push(o); break; } o.hd = null; o.hdX = null; o.hdDone = null; }
  return r; }; }
V33_TICKS.push(dt => { OPT_GCT += dt; if (OPT_GCT > 25) { OPT_GCT = 0; optGC(false); } });
// ---- Ajustes: casilla del modo optimizado ----
{ const _ro = renderOpts; renderOpts = function (B) { _ro(B); const q = $('#oQ'); if (!q || $('#oOpt')) return; const lb = q.closest('label');
  lb.insertAdjacentHTML('beforebegin', `<label class="tg"><input type="checkbox" id="oOpt" ${OPT.on ? 'checked' : ''}> ${L2('Modo optimizado: para celulares de pocos recursos o con lag (sin clima ni lluvia, efectos simples, sin HD, 30 imágenes por segundo)', 'Optimized mode: for low-end phones or lag (no weather or rain, simple effects, no HD, 30 frames per second)')}</label>`);
  $('#oOpt').onchange = e => { optApply(e.target.checked, false); renderPanel(); }; }; }
if (OPT.on) { try { SETTINGS.quality = 0; SETTINGS.weather = false; } catch (e) { } }
{ const _ls = loadSettings; loadSettings = function () { _ls(); if (OPT.on) { SETTINGS.quality = 0; SETTINGS.weather = false; G.quality = 0; } }; }
{ const _sh = setHD; setHD = function (on) { if (on && OPT.on) on = false; return _sh(on); }; }
if (OPT.on && typeof HDS !== 'undefined' && HDS > 1) { try { setHD(false); } catch (e) { } }
