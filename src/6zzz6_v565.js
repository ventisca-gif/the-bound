// ================= v5.65: ELEGIR MONTURA, RECURSOS NUEVOS CADA 3 S =================
// Sergio (5.65): «en el botón montura saldrán tus monturas compradas: ahora solo te pones la mejor (la última);
// que puedas elegir la que quieras y que se vea en el online». La montura elegida ya viaja en la presencia (o.mt).
// Las vetas y árboles de nivel 12-18 (5.64) vuelven a salir a los 3 s en el mismo sitio.

// ---------- selector de montura ----------
function mountList() { const P = G.P; return [...new Set((P.mounts || []).filter(k => MOUNTS[k] && k !== 'loba_kaela'))]; }
function mountRide(k) { const P = G.P; if (!MOUNTS[k] || !(P.mounts || []).includes(k)) return;
  if (P.mount && P.mount !== 'loba_kaela') { P.mount = k; P.lastMount = k; calcStats(P); mountBtn(); try { netPresence(true); } catch (e) { } sfx(MOUNTS[k].fly ? 'cast' : 'horn'); toast(L2('Montas: ', 'Riding: ') + MOUNTS[k].n, 'info'); markDirty(); return; }
  P.lastMount = k; toggleMount(); markDirty(); }
function mountPicker() { const P = G.P, L = mountList(), cur = P.mount;
  openModal(`<div class="frame"><h3>🐴 ${L2('Tus monturas', 'Your mounts')}</h3><p class="hint">${L2('Elige con cuál montar. Los demás jugadores ven la que llevas.', 'Choose which one to ride. Other players see the one you ride.')}</p>
    <div class="slist">${L.map(k => { const D = MOUNTS[k]; return `<div class="srow"><div class="sn"><b>${esc(D.n)}${cur === k ? ' ✓' : ''}</b><small>${L2('Velocidad', 'Speed')} ×${(D.sp || 1).toFixed(1)}${D.fly ? ' · ' + L2('vuela', 'flies') : ''}${D.car ? ' · ' + L2('vehículo', 'vehicle') : ''}</small></div><button class="btn sm ${cur === k ? 'gold' : ''}" data-mride="${k}">${cur === k ? L2('Montado', 'Riding') : L2('Montar', 'Ride')}</button></div>`; }).join('')}</div>
    <div class="row">${cur ? `<button class="btn danger" id="mDown">${L2('Desmontar', 'Dismount')}</button>` : ''}<button class="btn" id="mX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#mX').onclick = closeModal; const d = $('#mDown'); if (d) d.onclick = () => { closeModal(); toggleMount(); };
  $$('#modal [data-mride]').forEach(b => b.onclick = () => { const k = b.dataset.mride; closeModal(); if (P.mount === k) return; mountRide(k); }); }
{ const _tm = toggleMount; toggleMount = function () { const P = G.P; if (!P || P.mount === 'loba_kaela' || mountList().length < 2) return _tm.apply(this, arguments);
  if (window._mPick) { window._mPick = 0; return _tm.apply(this, arguments); }
  mountPicker(); }; }
// desde el selector, montar/desmontar usa la función de siempre (con sus comprobaciones de terreno)
{ const _mr = mountRide; mountRide = function (k) { window._mPick = 1; try { return _mr.apply(this, arguments); } finally { window._mPick = 0; } }; }
{ const _p = mountPicker; mountPicker = function () { const r = _p.apply(this, arguments); const d = $('#mDown'); if (d) d.onclick = () => { closeModal(); window._mPick = 1; try { toggleMount(); } finally { window._mPick = 0; } }; return r; }; }

// ---------- vetas y árboles de nivel alto: vuelven a salir a los 3 s ----------
{ const _rr = respawnResources; respawnResources = function (M) { if (M && M._nv && M.objs) for (const o of M.objs) if (o.nv && o.respawn && o.respawn - G.t > 3.05) o.respawn = G.t + 3; return _rr.apply(this, arguments); }; }

if (typeof GSIS !== 'undefined') GSIS.unshift(['monturas565', '🐴 ' + L2('Elegir montura', 'Choose a mount'), () => [
  L2('🐴 Si tienes varias monturas, el botón de montura abre la lista: elige la que quieras (o cambia de una a otra sin bajarte). Los demás jugadores ven la que llevas.', '🐴 If you own several mounts, the mount button opens the list: pick the one you want (or switch without getting off). Other players see the one you ride.'),
  L2('🧪 Pociones: 30 s de espera y curan como mucho el 40 % de tu vida (elixir 60 %). Platos y bebidas: 20 s de espera y como mucho el 25 %.', '🧪 Potions: 30 s cooldown and heal at most 40% of your HP (elixir 60%). Dishes and drinks: 20 s cooldown and at most 25%.'),
  L2('⛏ Las vetas y árboles de nivel alto vuelven a salir a los 3 s en el mismo sitio.', '⛏ High-level veins and trees grow back after 3 s in the same spot.')
], () => null]);
