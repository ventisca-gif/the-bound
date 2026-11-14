// ================= v4.32: TOP MUNDIAL (Firebase Realtime Database, plan gratis) =================
// Cada jugador sube su fila (nombre, minutos jugados, nivel máximo, clase) a /top/<id> y descarga los 50 primeros por
// horas y por nivel. Las reglas del servidor (docs/firebase_rules.json) validan los datos: las horas no pueden bajar
// ni subir más rápido que el tiempo real, nivel 1-350 y nombre de hasta 20 letras. Si TOP_URL está vacío, solo se usa
// el top compartido entre jugadores de la 4.31.
const TOP_URL = 'https://the-bound-3afef-default-rtdb.firebaseio.com';
const TOP = { pushAt: 0, getAt: 0, on: false, err: false, busy: false };

function topOk() { return !!TOP_URL && typeof fetch === 'function'; }
function topKey(id) { return String(id || '').replace(/[.#$\[\]\/]/g, '_').slice(0, 48); }
function topPush(force) {
  if (!topOk() || (!force && Date.now() - TOP.pushAt < 120000)) return; TOP.pushAt = Date.now();
  hrsSelfAll(); const id = hrsCurrent(), e = hrsList()[id]; if (!e || e.h < 60) return;
  const body = { n: cleanStr(e.n, 20) || '?', h: Math.floor(e.h / 60), lv: clamp(e.lv | 0, 1, 350), c: e.c || '', t: { '.sv': 'timestamp' } };
  fetch(TOP_URL + '/top/' + encodeURIComponent(topKey(id)) + '.json', { method: 'PUT', body: JSON.stringify(body) }).then(r => { TOP.on = r.ok || TOP.on; }).catch(() => { });
}
function topGet(force) {
  if (!topOk() || TOP.busy || (!force && Date.now() - TOP.getAt < 60000)) return; TOP.getAt = Date.now(); TOP.busy = true; hrsTopRefresh();
  const q = k => fetch(TOP_URL + '/top.json?orderBy=' + encodeURIComponent('"' + k + '"') + '&limitToLast=50', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(r.status));
  Promise.all([q('h'), q('lv')]).then(([a, b]) => {
    const arr = [], mine = new Set(hrsMine().map(topKey));
    for (const d of [a, b]) if (d && typeof d === 'object') for (const k in d) { const v = d[k]; if (!v || mine.has(k)) continue; arr.push(['w:' + k, v.n, v.h, v.lv, v.c]); }
    TOP.on = true; TOP.err = false; TOP.busy = false; hrsMerge(arr); hrsTopRefresh();
  }).catch(() => { TOP.err = true; TOP.busy = false; hrsTopRefresh(); });
}
// filas de la 4.31 (compartidas entre jugadores) pasan a usar la misma clave que el servidor
function topMigrate() { if (TOP.mig) return; TOP.mig = true; const L = hrsList(), mine = new Set(hrsMine()); let ch = false;
  for (const k of Object.keys(L)) if (!k.startsWith('w:') && !mine.has(k)) { const w = 'w:' + topKey(k), o = L[k]; delete L[k]; if (!L[w] || L[w].h < o.h) L[w] = o; ch = true; }
  if (ch) hrsStore(); }
// las filas del servidor llevan el prefijo w:; si ya teníamos a ese jugador por el online, no se repite
{ const _f = hrsMerge; hrsMerge = function (arr) {
    if (Array.isArray(arr) && topOk()) { const mine = new Set(hrsMine()); topMigrate();
      arr = arr.filter(e => !(Array.isArray(e) && mine.has(e[0]))).map(e => Array.isArray(e) && typeof e[0] === 'string' && !e[0].startsWith('w:') ? ['w:' + topKey(e[0])].concat(e.slice(1)) : e); }
    return _f.call(this, arr); }; }
setInterval(() => { if (!document.hidden) topPush(false); }, 10000);
{ const _f = showTitle; showTitle = function () { const r = _f.apply(this, arguments); setTimeout(() => { topPush(true); topGet(false); }, 2000); return r; }; }
{ const _f = hrsOpenTop; hrsOpenTop = function () { const r = _f.apply(this, arguments); topPush(true); topGet(true); return r; }; }
// texto de estado en la ventana del top
{ const _f = hrsTopRefresh; hrsTopRefresh = function () { const r = _f.apply(this, arguments); const box = $('#hrsTop'); if (!box || !topOk()) return r;
    const h = box.querySelector('h2'); if (h) h.textContent = '🌍 ' + L2('Top mundial', 'World top');
    const p = document.createElement('p'); p.className = 'hint';
    p.textContent = TOP.busy ? L2('Cargando el top mundial…', 'Loading the world top…') : TOP.err ? L2('Sin conexión con el servidor: se muestra la última lista guardada.', 'No connection to the server: showing the last saved list.') : '';
    if (p.textContent) { const ol = box.querySelector('ol'); if (ol) ol.after(p); }
    return r; }; }
