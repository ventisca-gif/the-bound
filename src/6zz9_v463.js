// ================= v4.63: TOP CON EL ASPECTO DEL HÉROE Y TOP DE MODA =================
// - Cada fila del top muestra al héroe con la ropa, armadura, arma y cosméticos que llevaba la última vez que se jugó.
//   El aspecto se guarda por cuenta en 'thebound.lk.<cuenta>' cada 15 s mientras juegas, así cambia si te cambias.
// - Pestaña 👗 Moda: cuenta las prendas distintas que tiene el jugador (cosméticos del armario + armaduras conseguidas).
// - Servidor: además de /top/<id>, cada jugador sube /lk/<id> {n, lv, c, m, k, t} (k = aspecto en JSON). Hay que pegar
//   las reglas nuevas de docs/firebase_rules.json en la consola de Firebase; sin ellas solo se ve tu propio aspecto.
// - Online: el aspecto viaja con la lista del top cada 20 s (presencia 'rkk') y el número de prendas en cada fila (índice 5).

const LKT = { port: new Map(), q: [], busy: false, pushK: '', pushAt: 0, getAt: 0, one: {}, cache: {} };

// ---------- prendas ----------
let MODA_TOT = 0;
function modaTotal() {
  if (!MODA_TOT) { let n = Object.keys(COSM).length; for (const k in ITEMS) if (ITEMS[k].t === 'armor') n++; MODA_TOT = n; }
  return MODA_TOT;
}
function modaCount(s) {
  if (!s) return 0; const set = new Set();
  const add = id => { const it = ITEMS[id]; if (!it) return; if (it.t === 'armor') set.add('i:' + id); else if (it.t === 'cos' && COSM[it.cos]) set.add('c:' + it.cos); };
  for (const c of s.wardrobe || []) if (COSM[c]) set.add('c:' + c);
  if (s.seen && typeof s.seen === 'object') for (const k in s.seen) add(k);
  for (const x of s.inv || []) if (x && x.id) add(x.id);
  for (const sl in s.equip || {}) { const x = s.equip[sl]; if (x && x.id) add(x.id); }
  for (const x of Array.isArray(s.store) ? s.store : []) if (x && x.id) add(x.id);
  return set.size;
}

// ---------- aspecto ----------
function lkOf(P) {
  try { return JSON.stringify({ c: P.cls, a: normApp(P.app), g: gearTiers(P), cs: cleanCos(P.cos || {}), hh: P.hideHelm ? 1 : 0 }); } catch (e) { return ''; }
}
function lkParse(s) {
  if (typeof s !== 'string' || !s || s.length > 1500) return null;
  try { const o = JSON.parse(s); return o && typeof o === 'object' && CLASSES[o.c] ? o : null; } catch (e) { return null; }
}
function lkClean(s) { return lkParse(s) ? s : ''; }
function lkGear(g) {
  const o = cleanGear(g); if (!g || typeof g !== 'object') return o;
  if (typeof g.av === 'string' && /^[a-z0-9_]{1,24}$/.test(g.av)) o.av = g.av;
  if (typeof SR !== 'undefined' && typeof g.sr === 'string' && SR[g.sr]) { o.sr = g.sr; if (g.sf) o.sf = 1; if (typeof g.sc === 'string' && HAIRS[g.sc]) o.sc = g.sc; }
  return o;
}
function lkStoreKey(acc) { return 'thebound.lk.' + (acc ? accId(acc) : '_guest'); }
function lkSaved(acc) { try { const o = JSON.parse(storage.get(lkStoreKey(acc)) || 'null'); return o && typeof o === 'object' ? o : null; } catch (e) { return null; } }

// dibujo: fotograma de reposo de frente, en HD si se puede, recortado a lo que ocupa el personaje
function lkPortrait(s) {
  if (LKT.port.has(s)) return LKT.port.get(s);
  const o = lkParse(s); let url = '';
  if (o) {
    const r = { cls: o.c, app: normApp(o.a), gear: lkGear(o.g), cos: cleanCos(o.cs), hh: o.hh ? 1 : 0 };
    let A = null; try { A = remoteAtlas(r); } catch (e) { try { delete r.gear.av; delete r.gear.sr; A = remoteAtlas(r); } catch (e2) { A = null; } }
    if (A && A.img) {
      const col = A.idx && A.idx.idle !== undefined ? A.idx.idle : 0; let src = A.img, k = 1;
      try { if (hdEnsure(A, col, 0, true) && A.hd) { src = A.hd; k = 2; } } catch (e) { }
      const w = A.fw * k, h = A.fh * k, c = mkCanvas(w, h), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      x.drawImage(src, col * w, 0, w, h, 0, 0, w, h);
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      try { const d = x.getImageData(0, 0, w, h).data; for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) if (d[(y * w + xx) * 4 + 3] > 8) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; } } catch (e) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
      if (x1 >= x0) { const cw = x1 - x0 + 1, ch = y1 - y0 + 1, S = Math.max(cw, ch) + 2 * k, o2 = mkCanvas(S, S), y2 = o2.getContext('2d'); y2.imageSmoothingEnabled = false;
        y2.drawImage(c, x0, y0, cw, ch, Math.floor((S - cw) / 2), S - ch - k, cw, ch); try { url = o2.toDataURL(); } catch (e) { url = ''; } }
    }
  }
  if (LKT.port.size > 120) LKT.port.delete(LKT.port.keys().next().value);
  LKT.port.set(s, url); return url;
}
function lkQueue(s) {
  if (!s || LKT.port.has(s) || LKT.q.includes(s)) return; LKT.q.push(s);
  if (LKT.busy) return; LKT.busy = true;
  const step = () => { const t = LKT.q.shift(); if (!t) { LKT.busy = false; return; } const url = lkPortrait(t);
    $$('#hrsTop img[data-lk]').forEach(im => { if (LKT.cache[im.dataset.lk] === t) { if (url) im.src = url; else im.remove(); } });
    setTimeout(step, 16); };
  setTimeout(step, 30);
}

// ---------- tu fila: aspecto y prendas ----------
function lkSelf(acc) {
  const cur = acc === ACC || (!acc && !ACC); let m = 0, k = '';
  const slots = acc ? accSlots(acc) : accSlots('');
  const key = slots.map(v => v ? v.length : 0).join(',');
  const C = LKT.one['s:' + (acc || '')];
  if (C && C.key === key) { m = C.m; k = C.k; }
  else { let best = null;
    for (const v of slots) { if (!v) continue; let s; try { s = JSON.parse(v); } catch (e) { continue; } m = Math.max(m, modaCount(s)); if (s && (!best || (s.lv | 0) > (best.lv | 0))) best = s; }
    if (best) k = lkOf(Object.assign({ equip: {}, cos: {} }, best));
    LKT.one['s:' + (acc || '')] = { key, m, k }; }
  const sv = lkSaved(acc); if (sv) { if (lkParse(sv.k)) k = sv.k; m = Math.max(m, sv.m | 0); }
  const P = G.P; if (cur && !titleMode && P && !P.ghost && P.S) { const lk = lkOf(P), mc = modaCount(P); if (lk) k = lk; m = Math.max(m, mc);
    const nv = JSON.stringify({ k, m: mc }); if (storage.get(lkStoreKey(acc)) !== nv) storage.set(lkStoreKey(acc), nv); }
  return { m, k };
}
{ const _f = hrsSelfAll; hrsSelfAll = function () { const r = _f.apply(this, arguments);
    try { const L = hrsList(), acc = accList(); let ch = false;
      const put = a => { const e = hrsSelfEntry(a); if (!e || !L[e.id]) return; const s = lkSelf(a); const o = L[e.id]; if (o.m !== s.m || o.k !== s.k) { o.m = s.m; o.k = s.k; ch = true; } };
      for (const k in acc) put(acc[k].n || k); put('');
      if (ch) storage.set('thebound.rank', JSON.stringify(L)); } catch (e) { }
    return r; }; }

// ---------- mezclar filas de otros (índice 5 = prendas, 6 = aspecto) ----------
function lkId(id) { return topOk() && typeof id === 'string' && !id.startsWith('w:') ? 'w:' + topKey(id) : id; }
{ const _f = hrsMerge; hrsMerge = function (arr) {
    const extra = []; if (Array.isArray(arr)) for (const e of arr.slice(0, 60)) if (Array.isArray(e) && typeof e[0] === 'string' && (e.length > 5)) extra.push([lkId(cleanStr(e[0], 48)), clamp(Math.floor(+e[5] || 0), 0, 9999), lkClean(e[6])]);
    const r = _f.apply(this, arguments);
    if (extra.length) { const L = hrsList(), mine = new Set(hrsMine()); let ch = false;
      for (const [id, m, k] of extra) { const o = L[id]; if (!o || mine.has(id) || o.me) continue; if (m > (o.m | 0)) { o.m = m; ch = true; } if (k && k !== o.k) { o.k = k; ch = true; } }
      if (ch) { hrsStore(); hrsTopRefresh(); } }
    return r; }; }
{ const _f = hrsPack; hrsPack = function (o, id) { const a = _f.apply(this, arguments); a.push(o.m | 0); return a; }; }
{ const _f = extraPresence; extraPresence = function (o) { const r = _f.apply(this, arguments);
    if (o.rkl && o.rk) { const e = hrsList()[hrsCurrent()]; if (e && e.k) o.rkk = e.k; }
    return r; }; }
{ const _f = upsertRemote; upsertRemote = function (p) { const pr = p && p.presence;
    if (pr && typeof pr === 'object' && Array.isArray(pr.rk) && typeof pr.rkk === 'string') { const k = lkClean(pr.rkk); if (k) { const a = pr.rk.slice(0, 6); while (a.length < 6) a.push(0); a[6] = k; pr.rk = a; } }
    return _f.apply(this, arguments); }; }

// ---------- servidor (/lk) ----------
function lkPush(force) {
  if (!topOk()) return; hrsSelfAll(); const id = hrsCurrent(), e = hrsList()[id]; if (!e || !e.k || e.h < 60) return;
  const body = { n: cleanStr(e.n, 20) || '?', lv: clamp(e.lv | 0, 1, MAXLV), c: e.c || '', m: clamp(e.m | 0, 0, 9999), k: e.k };
  const sig = JSON.stringify(body); if (!force && sig === LKT.pushK && Date.now() - LKT.pushAt < 600000) return; if (Date.now() - LKT.pushAt < 20000 && sig === LKT.pushK) return;
  LKT.pushK = sig; LKT.pushAt = Date.now(); body.t = { '.sv': 'timestamp' };
  fetch(TOP_URL + '/lk/' + encodeURIComponent(topKey(id)) + '.json', { method: 'PUT', body: JSON.stringify(body) }).catch(() => { });
}
function lkRows(d) {
  const arr = [], mine = new Set(hrsMine().map(topKey));
  if (d && typeof d === 'object') for (const k in d) { const v = d[k]; if (!v || typeof v !== 'object' || mine.has(k)) continue; arr.push(['w:' + k, v.n, 0, v.lv, v.c, v.m, v.k]); }
  return arr;
}
function lkGet(force) {
  if (!topOk() || (!force && Date.now() - LKT.getAt < 60000)) return; LKT.getAt = Date.now();
  fetch(TOP_URL + '/lk.json?orderBy=' + encodeURIComponent('"m"') + '&limitToLast=50', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(d => { if (d) hrsMerge(lkRows(d)); }).catch(() => { });
}
// aspecto de las filas visibles que aún no lo tienen (una petición por jugador, como mucho cada 10 min)
function lkFill(ids) {
  if (!topOk()) return;
  for (const id of ids) { if (!id.startsWith('w:')) continue; const t = LKT.one['f:' + id] || 0; if (Date.now() - t < 600000) continue; LKT.one['f:' + id] = Date.now();
    const k = id.slice(2); fetch(TOP_URL + '/lk/' + encodeURIComponent(k) + '.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(v => { if (v && typeof v === 'object') { const o = {}; o[k] = v; hrsMerge(lkRows(o)); } }).catch(() => { }); }
}
setInterval(() => { if (!document.hidden) lkPush(false); }, 30000);
{ const _f = hrsOpenTop; hrsOpenTop = function () { const r = _f.apply(this, arguments); lkPush(true); lkGet(true); return r; }; }
{ const _f = showTitle; showTitle = function () { const r = _f.apply(this, arguments); setTimeout(() => { lkPush(true); }, 2500); return r; }; }

// ---------- ventana: pestaña Moda y retratos ----------
{ const _f = hrsRows; hrsRows = function (tab) {
    if (tab !== 'm') return _f.apply(this, arguments);
    const res = _f.call(this, 'lv'); res.arr = res.arr.filter(e => (e.m | 0) > 0).sort((a, b) => (b.m | 0) - (a.m | 0) || b.lv - a.lv); return res; }; }
{ const _f = hrsTopRefresh; hrsTopRefresh = function () { const r = _f.apply(this, arguments); const box = $('#hrsTop'); if (!box || $('#modal').hidden) return r;
    try { lkDecorate(box); } catch (e) { }
    return r; }; }
function lkDecorate(box) {
  const tab = HRS.tab, tabs = box.querySelector('.tabs');
  if (tabs && !tabs.querySelector('[data-ht="m"]')) { const b = document.createElement('button'); b.className = 'chip' + (tab === 'm' ? ' on' : ''); b.dataset.ht = 'm'; b.textContent = '👗 ' + L2('Moda', 'Fashion'); b.onclick = () => { HRS.tab = 'm'; lkGet(false); hrsTopRefresh(); }; tabs.appendChild(b); }
  const { arr, cur } = hrsRows(tab), lis = [...box.querySelectorAll('ol li')], mi = arr.findIndex(e => e.id === cur);
  const rows = arr.slice(0, 20); if (mi >= 20) rows.push(arr[mi]);
  if (tab === 'm' && !arr.length) { const ol = box.querySelector('ol'); if (ol) ol.innerHTML = `<p class="hint">${L2('Nadie tiene prendas todavía. Consigue cosméticos y armaduras.', 'Nobody has clothes yet. Get cosmetics and armour.')}</p>`; }
  const need = [];
  lis.forEach((li, i) => { const e = rows[i]; if (!e) return;
    const pf = document.createElement('span'); pf.className = 'pf';
    if (e.k) { const tag = 'r' + i; LKT.cache[tag] = e.k; const url = LKT.port.get(e.k);
      if (url !== '') { const im = document.createElement('img'); im.dataset.lk = tag; im.alt = ''; if (url) im.src = url; else lkQueue(e.k); pf.appendChild(im); } }
    else need.push(e.id);
    li.insertBefore(pf, li.children[1] || null);
    if (tab === 'm') { const sm = li.querySelector('small'), val = li.querySelector('.val');
      if (sm) sm.textContent = (e.c && CLASSES[e.c] ? CLASSES[e.c].n + ' · ' : '') + L2('Nivel', 'Level') + ' ' + e.lv;
      if (val) val.innerHTML = '👗 ' + (e.m | 0) + `<small>/ ${modaTotal()}</small>`; } });
  if (need.length) lkFill(need);
  if (tab === 'm') { const h = box.querySelector('.hint'); if (h && !box.querySelector('.lkHint')) { const p = document.createElement('p'); p.className = 'hint lkHint'; p.textContent = L2(`Cuenta las prendas distintas que tienes: cosméticos del armario y armaduras conseguidas (${modaTotal()} en total).`, `Counts the different clothes you own: wardrobe cosmetics and armour you got (${modaTotal()} in total).`); h.before(p); } }
}
if (!document.getElementById('lkCss')) { const st = document.createElement('style'); st.id = 'lkCss';
  st.textContent = '.hrsTop ol li{grid-template-columns:2.2em 3.8em 1fr auto}.hrsTop ol li .pf{width:3.8em;height:3.8em;display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(ellipse at 50% 85%,rgba(232,192,112,.18),rgba(0,0,0,0) 70%);border-radius:6px}'
    + '.hrsTop ol li .val{font-family:Verdana,Tahoma,sans-serif;font-weight:bold}.hrsTop ol li .pf img{width:100%;height:100%;object-fit:contain;image-rendering:pixelated;image-rendering:crisp-edges}.hrsTop ol li .val small{display:block;font-size:.72em;opacity:.7;text-align:right}.hrsTop .tabs{flex-wrap:wrap}';
  document.head.appendChild(st); }

// ---------- guía en la lupa ----------
if (typeof GSIS !== 'undefined') GSIS.push(['top_moda', '🏆 ' + L2('Top de jugadores y de moda', 'Player and fashion top'), () => [
  L2('En el menú principal, «Top jugadores» muestra el top mundial con tres pestañas: horas jugadas, nivel máximo y 👗 Moda.', 'On the main menu, "Top players" shows the world top with three tabs: hours played, highest level and 👗 Fashion.'),
  L2('Cada fila enseña a tu héroe tal como iba vestido la última vez que jugaste: ropa, armadura, arma, cosméticos, estructura de cuerpo y subraza. Si te cambias, cambia también en el top.', 'Each row shows your hero dressed as the last time you played: clothes, armour, weapon, cosmetics, body type and subrace. If you change, the top changes too.'),
  L2(`Moda cuenta las prendas distintas que tienes: los cosméticos del armario y todas las armaduras que has conseguido (cascos, pecheras, grebas y botas). Hay ${modaTotal()} en total.`, `Fashion counts the different clothes you own: wardrobe cosmetics and every armour piece you have got (helmets, chests, greaves and boots). There are ${modaTotal()} in total.`)], () => null]);
