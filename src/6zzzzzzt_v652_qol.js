// 6.52 · Calidad de vida de la interfaz (ideas que Sergio aprobó: «sí, haz todo eso»).
//  1) Avisos ordenados: los repetidos se juntan («×2»), los «+N objeto» del mismo objeto se suman, se ven como mucho 3
//     a la vez, nunca tapan la barra del jefe y quedan en un historial (Bitácora › 📜 Avisos, últimos 60).
//  2) Los compañeros del equipo (barras de la Torre/cazadores) se colocan debajo de la Bitácora y no tapan la misión.
//  3) El regalo diario espera a que no estés luchando (jefe, torre, duelo o enemigos persiguiéndote).
//  4) Opciones › Interfaz: «HUD compacto» (botones más pequeños) y «Nombres de NPC solo cerca» (los que tienen misión
//     siempre se ven).
const TOAST_MAX = 3, TOAST_LOG = [];
hookAround('toast', (next, msg, kind, rar) => {
  if (typeof msg !== 'string' || !msg) return next(msg, kind, rar);
  try { TOAST_LOG.push([Date.now(), msg, kind || '']); if (TOAST_LOG.length > 60) TOAST_LOG.shift(); } catch (e) { }
  // mismo aviso todavía en pantalla: se junta
  const base = s => String(s).replace(/ ×\d+$/, '');
  let t = toastQ.find(q => base(q.msg) === msg && (q.kind || '') === (kind || ''));
  if (t) { t.n = (t.n || 1) + 1; t.msg = msg + ' ×' + t.n; t.t = 0; renderToasts(); return; }
  // «+N Objeto» del mismo objeto: se suman
  const m = /^\+(\d+) (.+)$/.exec(msg);
  if (m) { t = toastQ.find(q => { const k = /^\+(\d+) (.+)$/.exec(q.msg); return k && k[2] === m[2]; }); if (t) { const k = /^\+(\d+) (.+)$/.exec(t.msg); t.msg = '+' + (+k[1] + +m[1]) + ' ' + m[2]; t.t = 0; renderToasts(); return; } }
  const r = next(msg, kind, rar);
  while (toastQ.length > TOAST_MAX) toastQ.shift(); renderToasts(); return r;
});
// la columna de avisos baja si hay barra de jefe (antes la tapaba)
V33_TICKS.push(() => { try { const tb = $('#toasts'), bb = $('#bossbar'); if (!tb || !bb) return; let v = ''; if (!bb.hidden) { const r = bb.getBoundingClientRect(), h = $('#hud').getBoundingClientRect(); if (r.height) v = Math.round(r.bottom - h.top + 4) + 'px'; } if (tb.style.top !== v) tb.style.top = v; } catch (e) { } });
// Bitácora › 📜 Avisos
if (typeof BIT_TABS !== 'undefined') { BIT_TABS.push(['avisos', '📜', L2('Avisos', 'Notices')]);
  BIT_RENDER.avisos = () => { const hm = t => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
    return TOAST_LOG.length ? `<p class="hint">${L2('Los últimos avisos de esta sesión (lo más nuevo arriba).', 'The latest notices of this session (newest first).')}</p><div class="slist">${TOAST_LOG.slice().reverse().map(([t, m, k]) => `<div class="srow"><small style="opacity:.7;min-width:3em">${hm(t)}</small><div class="sn"><span class="${k === 'warn' ? 'bad' : k === 'quest' || k === 'loot' ? 'good' : ''}">${esc(m)}</span></div></div>`).join('')}</div>` : `<p class="hint">${L2('Todavía no hay avisos.', 'No notices yet.')}</p>`; }; }
// barras de los compañeros del equipo: debajo de la Bitácora (y de ↩), como la lista del grupo
V33_TICKS.push(() => { try { const hb = $('#huntBars'); if (!hb) return; const h = $('#hud').getBoundingClientRect(); let bot = 0; for (const id of ['bBit', 'bLast', 'tracker', 'secChip']) { const el = $('#' + id); if (el && !el.hidden) { const r = el.getBoundingClientRect(); if (r.height && r.left < h.left + h.width * 0.4) bot = Math.max(bot, r.bottom); } } if (!bot) return; const v = Math.round(bot - h.top + 6) + 'px'; if (hb.style.top !== v) hb.style.top = v; } catch (e) { } });
// regalo diario: no en mitad de un combate
function qolBusy() { const P = G.P; if (!P) return true; if (typeof TI !== 'undefined' && TI) return true; if (G.bossBar) return true; if (typeof DUEL !== 'undefined' && DUEL) return true; if (P.dead) return true;
  for (const e of G.ents) if (e.type === 'mob' && !e.dying && e.map === P.map && e.state === 'chase' && dist2(e.x, e.y, P.x, P.y) < 220 * 220) return true; return false; }
hookBefore('dailyCheck', () => { if (qolBusy()) return HOOK_SKIP; });
// opciones de interfaz
function qolApply() { document.body.classList.toggle('hudc', !!SETTINGS.hudC); }
hookAfter('renderOpts', (_r, B) => { try { const box = B.querySelector('.opts'); if (!box || box.querySelector('#oHudC')) return; const h3 = [...box.querySelectorAll('h3')].find(h => /Partida|Save/.test(h.textContent)); const div = document.createElement('div');
  div.innerHTML = `<h3>${L2('Interfaz', 'Interface')}</h3><label class="tg"><input type="checkbox" id="oHudC" ${SETTINGS.hudC ? 'checked' : ''}> ${L2('HUD compacto (botones más pequeños)', 'Compact HUD (smaller buttons)')}</label><label class="tg"><input type="checkbox" id="oNpcN" ${SETTINGS.npcNear ? 'checked' : ''}> ${L2('Nombres de NPC solo cerca (los que tienen misión siempre se ven)', 'NPC names only when near (quest NPCs always shown)')}</label>`;
  if (h3) box.insertBefore(div, h3); else box.appendChild(div);
  $('#oHudC').onchange = e => { SETTINGS.hudC = e.target.checked ? 1 : 0; saveSettings(); qolApply(); }; $('#oNpcN').onchange = e => { SETTINGS.npcNear = e.target.checked ? 1 : 0; saveSettings(); }; } catch (e) { if (typeof errOnce === 'function') errOnce('qolOpts', e); } });
hookAround('drawEnt', (next, e, ...a) => { if (!SETTINGS.npcNear || !e || e.type !== 'npc' || e.noTag) return next(e, ...a); let mk = null; try { mk = npcMarker(e.id); } catch (er) { } if (mk) return next(e, ...a); e.noTag = 1; try { return next(e, ...a); } finally { e.noTag = undefined; } });
{ const st = document.createElement('style'); st.textContent = 'body.hudc #acts{transform:scale(.84);transform-origin:100% 100%}body.hudc .hb{transform:scale(.88)}body.hudc #toasts{font-size:.85em}body.hudc #tracker{font-size:.88em}'; document.head.appendChild(st); }
setTimeout(qolApply, 0);

// 5) Marcadores propios en el mapa (máx. 12 por partida): «📍 Marcar» y toca el mapa; cada marcador se puede seguir con
//    la flecha dorada o borrar. Funciona en cualquier mapa del selector (mundo, países y ciudades).
SAVEKEYS.push('mapMk');
let QOL_MK = false;
function qolMapCur() { const Wd = typeof MAPW_LIST !== 'undefined' && MAPW_LIST[MAPW]; const id = Wd ? Wd.id : 'world'; const M = id === 'world' ? G.world : G.maps[id]; return M ? { id, M } : null; }
function qolRegion(id, x, y) { try { if (id === 'world') { const R = REGIONS.filter(R => R.k !== 'mar').sort((a, b) => dist(a.c[0], a.c[1], x, y) - dist(b.c[0], b.c[1], x, y))[0]; if (R) return R.n; } } catch (e) { } const Wd = MAPW_LIST && MAPW_LIST[MAPW]; return (Wd && Wd.n) || L2('Mapa', 'Map'); }
hookAfter('renderMap', () => { try {
  const cvs = $('#wm'), C = qolMapCur(); if (!cvs || !C || !cvs.width) return; const P = G.P; P.mapMk = Array.isArray(P.mapMk) ? P.mapMk : [];
  const sc = cvs.width / C.M.w, x = cvs.getContext('2d'), mine = P.mapMk.filter(k => k.m === C.id);
  for (const k of mine) { const X = k.x * sc, Y = k.y * sc; x.fillStyle = '#ff5a8a'; x.strokeStyle = '#2a0a14'; x.lineWidth = 2; x.beginPath(); x.moveTo(X, Y); x.lineTo(X - 5, Y - 9); x.arc(X, Y - 10, 5, Math.PI, 0); x.lineTo(X, Y); x.closePath(); x.stroke(); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y - 10, 2, 0, 7); x.fill(); }
  const host = cvs.closest('.mapmain') || cvs.parentElement; if (!host || host.querySelector('.qolmk')) return;
  const bar = document.createElement('div'); bar.className = 'qolmk row wrap'; bar.style.cssText = 'gap:.3em;margin-top:.3em;align-items:center';
  bar.innerHTML = `<button class="btn sm ${QOL_MK ? 'gold' : ''}" id="qmkAdd">📍 ${QOL_MK ? L2('Toca el mapa…', 'Tap the map…') : L2('Marcar', 'Mark')} <small>(${P.mapMk.length}/12)</small></button>` + mine.map((k, i) => `<span class="chip" style="display:inline-flex;gap:.3em;align-items:center">📍 ${esc(k.n)} <button class="btn sm" data-mkg="${P.mapMk.indexOf(k)}">🧭</button><button class="btn sm" data-mkx="${P.mapMk.indexOf(k)}">✕</button></span>`).join('');
  host.appendChild(bar);
  $('#qmkAdd').onclick = () => { if (!QOL_MK && P.mapMk.length >= 12) { toast(L2('Máximo 12 marcadores: borra alguno.', 'Max 12 markers: remove one.'), 'warn'); return; } QOL_MK = !QOL_MK; renderPanel(); };
  bar.querySelectorAll('[data-mkg]').forEach(b => b.onclick = () => { const k = P.mapMk[+b.dataset.mkg]; if (!k) return; setWp({ loc: [k.x, k.y], m: k.m, t: '📍 ' + k.n }); closePanel(); toast('🧭 ' + L2('Siguiendo: ', 'Following: ') + k.n, 'info'); });
  bar.querySelectorAll('[data-mkx]').forEach(b => b.onclick = () => { P.mapMk.splice(+b.dataset.mkx, 1); markDirty(); renderPanel(); });
  const old = cvs.onclick; cvs.onclick = e => { if (!QOL_MK) return old && old.call(cvs, e); const r = cvs.getBoundingClientRect(), mx = (e.clientX - r.left) * (cvs.width / r.width) / sc, my = (e.clientY - r.top) * (cvs.height / r.height) / sc;
    QOL_MK = false; if (mx < 0 || my < 0 || mx > C.M.w || my > C.M.h) { renderPanel(); return; } const n = qolRegion(C.id, mx, my) + ' ' + (P.mapMk.filter(k => k.m === C.id).length + 1);
    P.mapMk.push({ m: C.id, x: Math.round(mx * 10) / 10, y: Math.round(my * 10) / 10, n: cleanStr(n, 30) }); markDirty(); toast('📍 ' + L2('Marcador añadido: ', 'Marker added: ') + n, 'info'); renderPanel(); };
} catch (e) { if (typeof errOnce === 'function') errOnce('qolMk', e); } });
