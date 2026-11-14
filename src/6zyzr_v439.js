// ================= v4.39: arreglo de la fiesta (al salir de casa) y llamar a hijos de expedición =================
// 1) La fiesta siempre deja la salida en la puerta de tu casa; si alguna vez la posición de vuelta no es válida,
//    sales en la puerta de tu casa o en Albor en vez de bloquear el juego.
function homeDoorPos(id) { const d = id && G.world && G.world.doors.find(d => d.to === id); return d ? [d.x * 16 + 8, (d.y + 1) * 16 + 8] : null; }
function safeRet() { const P = G.P, W = G.world; if (isFinite(P.retX) && isFinite(P.retY) && P.retX > 0 && P.retY > 0 && P.retX < W.w * 16 && P.retY < W.h * 16) return;
  const h = homeDoorPos(P.inside) || homeDoorPos(Object.keys(P.homes || {})[0]); if (h) { P.retX = h[0]; P.retY = h[1]; return; } const t = TOWNS[0]; P.retX = ((t.x0 + t.x1) >> 1) * 16 + 8; P.retY = ((t.y0 + t.y1) >> 1) * 16 + 8; }
{ const _fp = famParty; famParty = function () { const P = G.P, home = Object.keys(P.homes || {})[0], h = homeDoorPos(home); if (h) { P.retX = h[0]; P.retY = h[1]; } return _fp.apply(this, arguments); }; }
{ const _ei = exitInterior; exitInterior = function () { try { safeRet(); } catch (e) { } return _ei.apply(this, arguments); }; }
{ const _sm = setMap; setMap = function (M, x, y) { if (M && M.isWorld && (!isFinite(x) || !isFinite(y))) { safeRet(); arguments[1] = G.P.retX; arguments[2] = G.P.retY; } return _sm.apply(this, arguments); }; }
{ const _cm = currentMusic; currentMusic = function () { try { const P = G.P; if (P && P.map === 'world' && (!isFinite(P.x) || !isFinite(P.y))) { safeRet(); P.x = P.retX; P.y = P.retY; } return _cm.apply(this, arguments); } catch (e) { return 'field'; } }; }
// 2) Llamar a un hijo, nieto o bisnieto que está de expedición: vuelve y se une a tu equipo (si hay hueco)
{ const _fc = famCall; famCall = function (k) { if (k && k.explore) { const join = folCount() < KID_FOL_MAX; kidRecall(k, join); if (!join) toast(L2('Ya te acompañan 2: ', 'Already 2 with you: ') + k.name + L2(' vuelve de la expedición y espera en casa.', ' returns from the expedition and waits at home.'), 'info', 5); markDirty(true); return; } return _fc.apply(this, arguments); }; }
{ const _fo = famOpen; famOpen = function () { const r = _fo.apply(this, arguments); const P = G.P; $$('#modal .pvBody .srow').forEach(row => { if (row.querySelector('button')) return; const b = row.querySelector('b'); const name = b && b.textContent.replace(/^👶\s*/, '').split(' · ')[0].trim(); const k = (P.kids || []).find(k => k.explore && k.name === name); if (!k) return;
    const btn = document.createElement('button'); btn.className = 'btn sm'; btn.textContent = L2('Llamar', 'Call'); btn.onclick = () => { closeModal(); famCall(k); }; row.appendChild(btn); }); return r; }; }
