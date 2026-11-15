// ================= v4.31: TIEMPO JUGADO Y TOP DE JUGADORES =================
// - Cuenta el tiempo con el juego abierto (también en el menú principal) por cuenta, y por héroe dentro de la partida.
// - Top de horas jugadas y de nivel máximo. No hay servidor con base de datos: cada jugador guarda la lista y la comparte
//   con los demás al conectarse (en los mundos online y unos segundos en el menú con Photon), así se va propagando.

const HRS_CAP = 400 * 24 * 3600, HRS_MAXN = 200, HRS_SEND = 15;
const HRS = { s: 0, k: '', last: Date.now(), saveT: 0, top: null, tab: 'h', sync: '', syncAt: 0, c2: null };
SAVEKEYS.push('playT');

function hrsDevice() { let d = storage.get('thebound.dev'); if (!d) { d = Math.random().toString(36).slice(2, 10); storage.set('thebound.dev', d); } return d; }
function hrsShort(s) { let h = 7; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(36).slice(0, 5); }
function hrsKey(acc) { return 'thebound.pt.' + (acc ? accId(acc) : '_guest'); }
function hrsLoad() { const k = hrsKey(ACC); if (HRS.k !== k) { HRS.k = k; HRS.s = +storage.get(k) || 0; } }
function hrsSave() { if (HRS.k) storage.set(HRS.k, String(Math.floor(HRS.s))); }
function hrsFmt(s) { s = Math.max(0, Math.floor(s || 0)); const m = Math.floor(s / 60), h = Math.floor(m / 60); return h ? h + ' h ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min'; }

// ---------- reloj ----------
function hrsTick() {
  const now = Date.now(); let d = (now - HRS.last) / 1000; HRS.last = now;
  if (document.hidden || !(d > 0)) return; d = Math.min(d, 5);
  hrsLoad(); HRS.s += d;
  const P = G.P; if (!titleMode && P && !P.ghost) P.playT = (P.playT || 0) + d;
  HRS.saveT += d; if (HRS.saveT >= 15) { HRS.saveT = 0; hrsSave(); hrsSelfAll(); }
  hrsUI();
}
setInterval(hrsTick, 1000);
document.addEventListener('visibilitychange', () => { if (document.hidden) { hrsTick(); hrsSave(); } else HRS.last = Date.now(); });
window.addEventListener('pagehide', () => { hrsSave(); });
{ const _f = accLogin; accLogin = function () { hrsTick(); hrsSave(); const r = _f.apply(this, arguments); hrsLoad(); hrsSelfAll(); hrsUI(); return r; }; }

// ---------- lista del top (guardada en el móvil) ----------
function hrsList() { if (!HRS.top) { try { HRS.top = JSON.parse(storage.get('thebound.rank') || '{}') || {}; } catch (e) { HRS.top = {}; } } return HRS.top; }
function hrsStore() {
  const L = hrsList(), ids = Object.keys(L);
  if (ids.length > HRS_MAXN) { const mine = hrsMine(); const keep = new Set(mine);
    ids.slice().sort((a, b) => L[b].h - L[a].h).slice(0, HRS_MAXN / 2).forEach(i => keep.add(i));
    ids.slice().sort((a, b) => L[b].lv - L[a].lv).slice(0, HRS_MAXN / 2).forEach(i => keep.add(i));
    for (const i of ids) if (!keep.has(i)) delete L[i]; }
  storage.set('thebound.rank', JSON.stringify(L));
}
function hrsClean(e) {
  if (!Array.isArray(e)) return null; const id = cleanStr(e[0], 40), n = cleanStr(e[1], 20).trim();
  const h = Math.min(HRS_CAP, Math.max(0, (+e[2] || 0) * 60)), lv = clamp(Math.floor(+e[3] || 1), 1, MAXLV), c = CLASSES[e[4]] ? e[4] : '';
  if (!id || !n || !isFinite(h)) return null; return { id, n, h, lv, c };
}
function hrsMerge(arr) {
  if (!Array.isArray(arr)) return; const L = hrsList(), mine = new Set(hrsMine()); let ch = false;
  for (const raw of arr.slice(0, 40)) { const e = hrsClean(raw); if (!e || mine.has(e.id)) continue; const o = L[e.id];
    if (!o) { L[e.id] = { n: e.n, h: e.h, lv: e.lv, c: e.c, t: Date.now() }; ch = true; continue; }
    if (e.h > o.h || e.lv > o.lv || e.n !== o.n) { o.h = Math.max(o.h, e.h); if (e.lv >= o.lv) { o.lv = e.lv; o.c = e.c || o.c; } o.n = e.n; o.t = Date.now(); ch = true; } }
  if (ch) { hrsStore(); hrsTopRefresh(); }
}
// tus cuentas de este móvil (y el invitado si tiene héroes)
function hrsSelfEntry(acc) {
  let best = null, n = acc;
  const slots = acc ? accSlots(acc) : accSlots('');
  for (const v of slots) { if (!v) continue; let s; try { s = JSON.parse(v); } catch (e) { continue; } if (s && (!best || (s.lv | 0) > (best.lv | 0))) best = s; }
  if (!acc) { if (!best) return null; n = best.name; }
  const A = acc ? accList()[accId(acc)] : null;
  const id = acc ? 'a:' + accId(acc) + ':' + hrsShort(A && A.s) : 'g:' + hrsDevice();
  const h = acc === ACC || (!acc && !ACC) ? Math.max(HRS.s, +storage.get(hrsKey(acc)) || 0) : (+storage.get(hrsKey(acc)) || 0);
  return { id, n: cleanStr(n, 20), h: Math.min(HRS_CAP, h), lv: best ? clamp(best.lv | 0, 1, MAXLV) : 1, c: best && CLASSES[best.cls] ? best.cls : '', me: 1 };
}
function hrsMine() { const L = accList(), out = []; for (const k in L) { const A = L[k]; out.push('a:' + accId(A.n || k) + ':' + hrsShort(A.s)); } out.push('g:' + hrsDevice()); return out; }
function hrsSelfAll() {
  const L = hrsList(), acc = accList();
  for (const k in acc) { const e = hrsSelfEntry(acc[k].n || k); if (e) L[e.id] = { n: e.n, h: e.h, lv: e.lv, c: e.c, t: Date.now(), me: 1 }; }
  const g = hrsSelfEntry(''); if (g) L[g.id] = { n: g.n, h: g.h, lv: g.lv, c: g.c, t: Date.now(), me: 1 };
  // el héroe en juego puede tener más nivel que su partida guardada
  const P = G.P; if (!titleMode && P && !P.ghost) { const id = ACC ? 'a:' + accId(ACC) + ':' + hrsShort((acc[accId(ACC)] || {}).s) : 'g:' + hrsDevice(); const o = L[id]; if (o && (P.lv | 0) > o.lv) { o.lv = clamp(P.lv | 0, 1, MAXLV); o.c = P.cls; } }
  storage.set('thebound.rank', JSON.stringify(L));
}
function hrsPack(o, id) { return [id, o.n, Math.floor(o.h / 60), o.lv, o.c]; }
function hrsCurrent() { const acc = accList(); const id = ACC ? 'a:' + accId(ACC) + ':' + hrsShort((acc[accId(ACC)] || {}).s) : 'g:' + hrsDevice(); return id; }
function hrsOut() {
  hrsSelfAll(); const L = hrsList(), ids = Object.keys(L), pick = new Set();
  ids.slice().sort((a, b) => L[b].h - L[a].h).slice(0, HRS_SEND).forEach(i => pick.add(i));
  ids.slice().sort((a, b) => L[b].lv - L[a].lv || L[b].h - L[a].h).slice(0, HRS_SEND).forEach(i => pick.add(i));
  const cur = hrsCurrent(); if (L[cur]) pick.add(cur);
  return [...pick].map(i => hrsPack(L[i], i));
}

// ---------- compartir dentro del juego (presencia del online: WiFi, Photon y nube) ----------
let hrsPresT = -99;
{ const _f = extraPresence; extraPresence = function (o) { const r = _f.apply(this, arguments);
    if (G.t - hrsPresT > 20) { hrsPresT = G.t; o.rkl = hrsOut(); }
    const L = hrsList(), cur = hrsCurrent(); if (L[cur]) o.rk = hrsPack(L[cur], cur);
    return r; }; }
{ const _f = upsertRemote; upsertRemote = function (p) { const pr = p && p.presence; if (pr && typeof pr === 'object') { if (Array.isArray(pr.rkl)) hrsMerge(pr.rkl); if (Array.isArray(pr.rk)) hrsMerge([pr.rk]); } return _f.apply(this, arguments); }; }

// ---------- compartir desde el menú: entra unos segundos en una sala oculta de Photon ----------
function hrsTitleSync(force) {
  if (typeof phnAvailable !== 'function' || !phnAvailable() || PHN.c || HRS.c2) return;
  if (!force && Date.now() - HRS.syncAt < 180000) return; HRS.syncAt = Date.now();
  let c; const LBC = Photon.LoadBalancing.LoadBalancingClient, S = LBC.State;
  try { c = new LBC(Photon.ConnectionProtocol.Wss, PHN_APPID, PHN_VER); } catch (e) { return; }
  HRS.c2 = c; HRS.sync = 'on'; hrsTopRefresh();
  const send = () => { try { c.raiseEvent(7, JSON.stringify({ rkl: hrsOut() })); } catch (e) { } };
  const end = st => { if (HRS.c2 !== c) return; HRS.c2 = null; HRS.sync = st; clearTimeout(c._tmo); try { c.disconnect(); } catch (e) { } hrsTopRefresh(); };
  try { if (c.setLogLevel) c.setLogLevel(Photon.LogLevel.ERROR); } catch (e) { }
  c.onStateChange = st => { if (HRS.c2 !== c) return;
    if (st === S.JoinedLobby) { try { c.joinRoom('tb_top', { createIfNotExists: true }, { isVisible: false, isOpen: true, maxPlayers: 0 }); } catch (e) { end('err'); } }
    else if (st === S.Disconnected || st === S.Error) end(HRS.sync === 'on' ? 'err' : HRS.sync); };
  c.onError = () => end('err');
  c.onJoinRoom = () => send();
  c.onActorJoin = a => { if (a && !a.isLocal) send(); };
  c.onEvent = (code, content) => { if (code !== 7 || typeof content !== 'string' || content.length > 12000) return; try { const d = JSON.parse(content); if (d && Array.isArray(d.rkl)) hrsMerge(d.rkl); } catch (e) { } };
  c._tmo = setTimeout(() => end('ok'), 25000);
  try { c.connectToRegionMaster(PHN.region); } catch (e) { end('err'); }
}
function hrsTitleStop() { const c = HRS.c2; if (!c) return; HRS.c2 = null; HRS.sync = 'ok'; clearTimeout(c._tmo); try { c.disconnect(); } catch (e) { } }
{ const _f = startGame; startGame = function () { hrsTitleStop(); return _f.apply(this, arguments); }; }
{ const _f = phnConnect; phnConnect = function () { hrsTitleStop(); return _f.apply(this, arguments); }; }

// ---------- menú principal ----------
function hrsUI() {
  const T = $('#title'); if (!T) return; let b = $('#tPlay');
  if (!b) {
    if (!document.getElementById('hrsCss')) { const st = document.createElement('style'); st.id = 'hrsCss';
      st.textContent = '#tPlay{position:absolute;top:calc(3.4em + env(safe-area-inset-top,0px));right:max(.8em,env(safe-area-inset-right,0px));display:flex;flex-direction:column;align-items:flex-end;gap:.35em;z-index:2}'
        + '#tPlay .hrsBox{background:rgba(20,10,8,.78);border:2px solid #c8963c;border-radius:8px;padding:.3em .7em;text-align:right;color:#f1e7d3;text-shadow:0 1px 0 #000;box-shadow:0 2px 0 rgba(0,0,0,.5)}'
        + '#tPlay .hrsBox small{display:block;font-size:.72em;color:#e8c070}#tPlay .hrsBox b{font-size:1.05em;letter-spacing:.02em}#tPlay .btn{font-size:.85em}#title.creating #tPlay{display:none}'
        + '.modal.hrsmodal{z-index:60}.hrsTop{max-width:30em;width:100%}.hrsTop h2{text-align:center;margin:.1em 0 .4em}.hrsTop .tabs{display:flex;gap:.4em;justify-content:center;margin-bottom:.5em}.hrsTop ol{list-style:none;margin:0;padding:0;max-height:52vh;overflow-y:auto}'
        + '.hrsTop li{display:grid;grid-template-columns:2.2em 1fr auto;gap:.5em;align-items:center;padding:.3em .5em;border-radius:6px;background:rgba(255,255,255,.04);margin-bottom:.2em}'
        + '.hrsTop li.me{background:rgba(232,192,112,.22);outline:1px solid #e8c070}.hrsTop li .pos{text-align:center;font-weight:bold}.hrsTop li small{display:block;opacity:.75;font-size:.78em}.hrsTop li .val{font-weight:bold;color:#e8c070;text-align:right}'
        + '.hrsTop .sep{text-align:center;opacity:.6;margin:.2em 0}.hrsTop .hint{text-align:center}';
      document.head.appendChild(st); }
    b = document.createElement('div'); b.id = 'tPlay'; T.appendChild(b);
    b.innerHTML = `<div class="hrsBox"><small>⏱ ${L2('Tiempo jugado', 'Time played')}</small><b id="tPlayT"></b></div><button class="btn gold sm" id="tTop">🏆 ${L2('Top jugadores', 'Top players')}</button>`;
    $('#tTop').onclick = () => { audioUnlock(); hrsOpenTop(); };
  }
  const t = $('#tPlayT'); hrsLoad(); const v = hrsFmt(HRS.s); if (t && t.textContent !== v) t.textContent = v;
}
{ const _f = showTitle; showTitle = function () { const r = _f.apply(this, arguments); hrsLoad(); hrsSelfAll(); hrsUI(); setTimeout(() => { if (titleMode) hrsTitleSync(false); }, 1500); return r; }; }
// tiempo de cada héroe en su botón
{ const _f = refreshTitle; refreshTitle = function () { const r = _f.apply(this, arguments);
    $$('#tslots [data-slot]').forEach(btn => { const s = loadLocal(+btn.dataset.slot), sm = btn.querySelector('small'); if (s && sm && s.playT >= 60 && !sm.dataset.pt) { sm.dataset.pt = 1; sm.textContent += ' · ⏱ ' + hrsFmt(s.playT); } });
    hrsUI(); return r; }; }

// ---------- ventana del top ----------
function hrsRows(tab) {
  hrsSelfAll(); const L = hrsList(), cur = hrsCurrent();
  const arr = Object.keys(L).map(id => Object.assign({ id }, L[id])).filter(e => tab === 'h' ? e.h >= 60 : true);
  arr.sort(tab === 'h' ? (a, b) => b.h - a.h || b.lv - a.lv : (a, b) => b.lv - a.lv || b.h - a.h);
  return { arr, cur };
}
function hrsOpenTop() { HRS.tab = HRS.tab || 'h'; openModal('<div class="hrsTop" id="hrsTop"></div>', 'hrsmodal'); hrsTopRefresh(); hrsTitleSync(true); }
function hrsTopRefresh() {
  const box = $('#hrsTop'); if (!box || $('#modal').hidden) return; const tab = HRS.tab, { arr, cur } = hrsRows(tab);
  const med = ['🥇', '🥈', '🥉'], li = (e, i) => `<li class="${e.me || e.id === cur ? 'me' : ''}"><span class="pos">${med[i] || (i + 1)}</span><span>${esc(e.n)}${e.id === cur ? ' <b>(' + L2('tú', 'you') + ')</b>' : ''}<small>${e.c && CLASSES[e.c] ? esc(CLASSES[e.c].n) + ' · ' : ''}${tab === 'h' ? L2('Nivel', 'Level') + ' ' + e.lv : '⏱ ' + hrsFmt(e.h)}</small></span><span class="val">${tab === 'h' ? hrsFmt(e.h) : L2('Nv.', 'Lv.') + ' ' + e.lv}</span></li>`;
  let rows = arr.slice(0, 20).map(li).join(''); const mi = arr.findIndex(e => e.id === cur);
  if (mi >= 20) rows += `<div class="sep">…</div>` + li(arr[mi], mi);
  if (!arr.length) rows = `<p class="hint">${L2('Aún no hay nadie en el top. ¡Juega un rato!', 'Nobody in the top yet. Play for a while!')}</p>`;
  const st = HRS.sync === 'on' ? L2('Sincronizando con los jugadores conectados…', 'Syncing with online players…') : HRS.sync === 'err' ? L2('Sin conexión: se muestra la lista guardada en este móvil.', 'Offline: showing the list saved on this phone.') : '';
  box.innerHTML = `<h2>🏆 ${L2('Top jugadores', 'Top players')}</h2><div class="tabs"><button class="chip ${tab === 'h' ? 'on' : ''}" data-ht="h">⏱ ${L2('Horas jugadas', 'Hours played')}</button><button class="chip ${tab === 'lv' ? 'on' : ''}" data-ht="lv">⭐ ${L2('Nivel máximo', 'Highest level')}</button></div><ol>${rows}</ol>`
    + `<p class="hint">${ACC ? L2('Sales con tu cuenta', 'You appear with your account') + ' <b>' + esc(ACC) + '</b>.' : L2('Inicia sesión para salir en el top con tu nombre de cuenta.', 'Log in to appear in the top with your account name.')} ${L2('El top se comparte entre jugadores al conectarse online.', 'The top is shared between players when they go online.')}</p>${st ? `<p class="hint">${st}</p>` : ''}<div class="row" style="justify-content:center"><button class="btn" id="hrsX">${L2('Cerrar', 'Close')}</button></div>`;
  $$('[data-ht]', box).forEach(b => b.onclick = () => { HRS.tab = b.dataset.ht; hrsTopRefresh(); });
  $('#hrsX').onclick = () => closeModal();
}
