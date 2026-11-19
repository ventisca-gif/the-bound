// ================= v5.36: INVENTARIO CÓMODO Y TRES OFICIOS EN JAPÓN =================
// Sergio eligió de las ideas:
//  1) Ordenar el inventario (tipo, valor, nivel) y favoritos ★ que no se venden con «Vender basura» ni se tiran.
//  2) Lista de la compra en la Lupa: marcas lo que quieres fabricar y un globito te avisa cuando tienes todo.
//  3) Baúl compartido entre todos tus héroes (en el baúl de casa).
//  4) Oficios de Japón dentro del mapa (sistema V8 de la 5.28): jardinero del templo (Kinkaku-ji, Kioto),
//     pescador de barca (estanque de Asakusa) y mensajero en bici (calles de Tokio). Cada uno con mecánica propia.

// =====================================================================================
// 1) ORDENAR Y FAVORITOS
// =====================================================================================
const INV_SORT = [['tipo', L2('tipo', 'type')], ['valor', L2('valor', 'value')], ['nivel', L2('nivel', 'level')]];
SAVEKEYS.push('invSortK');
const INV_TORD = { weapon: 0, armor: 1, acc: 2, tool: 3, cons: 4, mat: 5, quest: 6, cos: 7 };
function invSortNow(k) { const P = G.P, I = s => ITEMS[s.id] || {};
  const f = { tipo: (a, b) => (INV_TORD[I(a).t] ?? 9) - (INV_TORD[I(b).t] ?? 9) || String(I(a).n).localeCompare(String(I(b).n)),
    valor: (a, b) => (I(b).price || 0) * (b.q || 1) - (I(a).price || 0) * (a.q || 1),
    nivel: (a, b) => (I(b).lv || I(b).tier || 0) - (I(a).lv || I(a).tier || 0) || String(I(a).n).localeCompare(String(I(b).n)) }[k];
  P.inv.sort((a, b) => (b.lock ? 1 : 0) - (a.lock ? 1 : 0) || f(a, b)); invSel = -1; uiDirty.inv = true; markDirty(); }
{ const _ri = renderInv; renderInv = function (B) { const r = _ri.apply(this, arguments); try { const P = G.P, root = B || document;
  const chips = root.querySelector('.invL .chips');
  if (chips && !chips.querySelector('#invSort')) { const k = P.invSortK || 'tipo', n = (INV_SORT.find(x => x[0] === k) || INV_SORT[0])[1];
    chips.insertAdjacentHTML('beforeend', `<button class="chip" id="invSort">⇅ ${L2('Ordenar', 'Sort')}: ${n}</button>`);
    root.querySelector('#invSort').onclick = () => { const i = INV_SORT.findIndex(x => x[0] === (P.invSortK || 'tipo')), cur = P.invSortK ? INV_SORT[i][0] : 'tipo';
      // primer toque ordena por el modo actual; los siguientes cambian de modo
      if (P._sorted === cur) P.invSortK = INV_SORT[(i + 1) % INV_SORT.length][0]; else P.invSortK = cur; P._sorted = P.invSortK; invSortNow(P.invSortK); sfx('ui'); renderPanel(); }; }
  // estrella en las casillas favoritas
  root.querySelectorAll('.slot[data-i]').forEach(b => { const s = P.inv[+b.dataset.i]; if (s && s.lock && !b.querySelector('.fav')) b.insertAdjacentHTML('beforeend', '<i class="fav">★</i>'); });
  // botón favorito + no se puede tirar
  const s = P.inv[invSel], R = root.querySelector('.invR');
  if (s && R && ITEMS[s.id] && !R.querySelector('#invFav')) { const row = R.querySelector('.row') || R;
    row.insertAdjacentHTML('afterbegin', `<button class="btn ${s.lock ? 'gold' : ''}" id="invFav">${s.lock ? '★ ' + L2('Favorito', 'Favourite') : '☆ ' + L2('Favorito', 'Favourite')}</button>`);
    R.querySelector('#invFav').onclick = () => { s.lock = s.lock ? 0 : 1; if (!s.lock) delete s.lock; sfx('ui'); markDirty(); toast(s.lock ? L2('★ Favorito: no se vende con «Vender basura» ni se puede tirar.', '★ Favourite: not sold with «Sell junk» and can\'t be dropped.') : L2('Ya no es favorito.', 'No longer a favourite.'), 'info'); renderPanel(); };
    if (s.lock) { for (const id of ['#idrop', '#idropq']) { const d = R.querySelector(id); if (d) d.remove(); } row.insertAdjacentHTML('beforeend', `<small class="hint">${L2('★ Quita la estrella para tirarlo.', '★ Remove the star to drop it.')}</small>`); } }
  // selección múltiple: los favoritos no se marcan
  if (typeof INV_MS !== 'undefined' && INV_MS.on) { for (const i of [...INV_MS.sel]) if (P.inv[i] && P.inv[i].lock) INV_MS.sel.delete(i);
    root.querySelectorAll('.slot[data-i]').forEach(b => { const i = +b.dataset.i; if (P.inv[i] && P.inv[i].lock) { b.classList.add('mlock'); b.classList.remove('msel'); b.onclick = () => toast(L2('★ Es favorito: quita la estrella para tirarlo.', '★ It is a favourite: remove the star to drop it.'), 'warn'); } }); }
  } catch (e) { console.warn(e); } return r; }; }
{ const st = document.createElement('style'); st.textContent = '.slot{position:relative}.slot .fav{position:absolute;top:1px;left:3px;color:#ffd040;font-style:normal;font-size:12px;text-shadow:0 1px 0 #000;pointer-events:none}'; document.head.appendChild(st); }
// en tiendas tampoco se venden por error
if (typeof junkList === 'function') { const _jl = junkList; junkList = function () { return _jl.apply(this, arguments).filter(i => G.P.inv[i] && !G.P.inv[i].lock); }; }

// =====================================================================================
// 2) LISTA DE LA COMPRA (Lupa › 🎒 Objetos › 📝 Mi lista)
// =====================================================================================
SAVEKEYS.push('shopL', 'shopN');
function usoRecipe(id) { const T = f => { try { return f(); } catch (e) { return null; } };
  return T(() => { const r = RECIPES.find(r => r.out === id); return r && { where: usoJob(r.job) + (r.jlv > 1 ? ' ' + r.jlv : ''), mats: r.mats, gold: r.gold || 0 }; })
    || T(() => { const L_ = ALCH.find(a => a[0] === id); return L_ && { where: L2('Mesa de alquimia', 'Alchemy table'), mats: L_[4], gold: 0 }; })
    || T(() => { const L_ = WORK.find(a => a[0] === id); return L_ && { where: L2('Taller del artesano', 'Artisan workshop'), mats: L_[4], gold: 0 }; })
    || T(() => { const m = /^plp?_(.+)$/.exec(id), d = m && PL.find(d => d[0] === m[1]); return d && { where: L2('Hoguera', 'Campfire'), mats: d[8], gold: 0 }; })
    || T(() => { const m = /^bk_(.+)$/.exec(id), b = m && BK[m[1]]; return b && (b.cost || []).length && { where: L2('Modo construcción', 'Build mode'), mats: b.cost, gold: b.gold || 0 }; }) || null; }
const usoHave = id => id === 'log' ? (typeof logCount === 'function' ? logCount() : 0) : countItem(id);
const usoMatN = id => id === 'log' ? L2('troncos', 'logs') : usoN(id);
function usoReady(id) { const R = usoRecipe(id); return !!R && R.mats.every(([m, n]) => usoHave(m) >= n) && G.P.gold >= R.gold; }
function shopToggle(id) { const P = G.P; P.shopL = P.shopL || []; const i = P.shopL.indexOf(id); if (i >= 0) P.shopL.splice(i, 1); else { P.shopL.push(id); if (P.shopL.length > 20) P.shopL.shift(); } if (P.shopN) delete P.shopN[id]; markDirty(); }
let SHOP_T = 0;
V33_TICKS.push(dt => { const P = G.P; if (!P || !P.shopL || !P.shopL.length) return; SHOP_T += dt || 0.016; if (SHOP_T < 2) return; SHOP_T = 0; P.shopN = P.shopN || {};
  for (const id of P.shopL) { if (!ITEMS[id]) continue; const ok = usoReady(id); if (ok && !P.shopN[id]) { P.shopN[id] = 1; toast('🛒 ' + L2('¡Ya tienes todo para fabricar ', 'You have everything to craft ') + usoN(id) + '!', 'quest', 5); floatText(P.x, P.y - 50, L2('¡Lista! ', 'Ready! ') + usoN(id), '#8aff8a', true); sfx('questdone'); }
    else if (!ok && P.shopN[id]) delete P.shopN[id]; } });
function usoListHTML(id) { const R = usoRecipe(id); if (!R) return ''; const P = G.P, on = (P.shopL || []).includes(id);
  return `<div class="usos"><b>📝 ${L2('Lista de la compra', 'Shopping list')} · ${esc(R.where)}</b>${R.mats.map(([m, n]) => { const h = usoHave(m); return `<div>${h >= n ? '✅' : '⬜'} ${esc(usoMatN(m))}: ${Math.min(h, n)}/${n}</div>`; }).join('')}${R.gold ? `<div>${P.gold >= R.gold ? '✅' : '⬜'} ${fmt(R.gold)} ${L2('oro', 'gold')}</div>` : ''}
    <button class="btn sm ${on ? 'gold' : ''}" data-shopl="${id}">${on ? '✓ ' + L2('En tu lista (quitar)', 'In your list (remove)') : '📝 ' + L2('Añadir a mi lista: te aviso cuando lo tengas todo', 'Add to my list: I\'ll tell you when you have everything')}</button></div>`; }
USO_F.push(['list', '📝 ' + L2('Mi lista', 'My list')]);
{ const _um = usoMatch; usoMatch = function (it, f) { if (f === 'list') return (G.P.shopL || []).includes(it.id); return _um.apply(this, arguments); }; }
{ const _go = guiaObj; guiaObj = function () { const r = _go.apply(this, arguments); try { const id = USO_G.sel, d = $('.guia .gdet'); if (id && d && ITEMS[id]) { const h = usoListHTML(id); if (h) { const first = d.querySelector('.usos'); if (first) first.insertAdjacentHTML('beforebegin', h); else d.insertAdjacentHTML('beforeend', h); }
    const b = d.querySelector('[data-shopl]'); if (b) b.onclick = () => { shopToggle(b.dataset.shopl); sfx('ui'); guiaObj(); }; }
  if (USO_G.f === 'list' && !(G.P.shopL || []).length) { const gl = $('.guia .glist'); if (gl) gl.innerHTML = `<p class="hint">${L2('Tu lista está vacía. Elige algo que se fabrique y pulsa «📝 Añadir a mi lista».', 'Your list is empty. Pick something craftable and press «📝 Add to my list».')}</p>`; } } catch (e) { console.warn(e); } return r; }; }
// en el inventario también: si el objeto se fabrica, se puede apuntar
{ const _ri = renderInv; renderInv = function (B) { const r = _ri.apply(this, arguments); try { const s = G.P.inv[invSel], R = (B || document).querySelector('.invR'); if (s && R && usoRecipe(s.id) && !R.querySelector('[data-shopl]')) { const at = R.querySelector('.usos'); const h = usoListHTML(s.id); if (at) at.insertAdjacentHTML('beforebegin', h); const b = R.querySelector('[data-shopl]'); if (b) b.onclick = () => { shopToggle(b.dataset.shopl); sfx('ui'); renderPanel(); }; } } catch (e) { } return r; }; }

// =====================================================================================
// 3) BAÚL COMPARTIDO ENTRE TUS HÉROES
// =====================================================================================
const BANK_MAX = 60;
const bankKey = () => 'thebound.bank.' + (typeof ACC !== 'undefined' && ACC ? accId(ACC) : 'local');
function bankGet() { try { const a = JSON.parse(storage.get(bankKey()) || '[]'); return Array.isArray(a) ? a.filter(s => s && ITEMS[s.id]) : []; } catch (e) { return []; } }
function bankSet(a) { storage.set(bankKey(), JSON.stringify(a)); }
function openBank() { const P = G.P, B = bankGet();
  const cell = (s, i, from) => { const it = ITEMS[s.id], no = from === 'i' && (it.t === 'quest' || s.lock); return `<button class="srow" data-bk="${from}:${i}" ${no ? 'style="opacity:.45"' : ''}>${iconHTML(it.icon, 24)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${s.up ? '+' + s.up + ' ' : ''}${esc(it.n)}</b><small>${s.q > 1 ? '×' + s.q : ''}${s.lock ? ' ★' : ''}</small></div></button>`; };
  openModal(`<h2>🏦 ${L2('Baúl compartido', 'Shared chest')}</h2><p class="hint">${L2('Lo comparten todos tus héroes de esta cuenta en este teléfono. Toca un objeto para moverlo (máx. ', 'Shared by all your heroes on this account on this phone. Tap an item to move it (max. ') + BANK_MAX + L2('). Los objetos de misión y los favoritos ★ no entran. Se guarda al momento.', '). Quest items and ★ favourites can\'t go in. It saves instantly.')}</p>
    <div class="upwrap"><div><h3>${L2('Mochila', 'Bag')} ${P.inv.length}/${INV_MAX}</h3><div class="slist">${P.inv.map((s, i) => cell(s, i, 'i')).join('') || `<p class="hint">${L2('Vacía', 'Empty')}</p>`}</div></div><div><h3>${L2('Baúl compartido', 'Shared chest')} ${B.length}/${BANK_MAX}</h3><div class="slist">${B.map((s, i) => cell(s, i, 'b')).join('') || `<p class="hint">${L2('Vacío', 'Empty')}</p>`}</div></div></div>
    <div class="row"><button class="btn" id="bkBack">↩ ${L2('Baúl de la casa', 'House chest')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $('#bkBack').onclick = () => openStorage();
  $$('[data-bk]').forEach(b => b.onclick = () => { const [from, i] = b.dataset.bk.split(':'), A = bankGet(), src = from === 'i' ? P.inv : A, dst = from === 'i' ? A : P.inv, cap = from === 'i' ? BANK_MAX : INV_MAX, s = src[+i]; if (!s) return; const it = ITEMS[s.id];
    if (from === 'i' && (it.t === 'quest' || s.lock)) { toast(it.t === 'quest' ? L2('Los objetos de misión no entran.', 'Quest items can\'t go in.') : L2('Quita la estrella ★ primero.', 'Remove the ★ star first.'), 'warn'); return; }
    const same = it.stack ? dst.find(d => d.id === s.id && !d.up) : null; if (same) same.q = (same.q || 1) + (s.q || 1); else { if (dst.length >= cap) { toast(from === 'i' ? L2('El baúl compartido está lleno', 'The shared chest is full') : L2('Inventario lleno', 'Bag full'), 'warn'); return; } dst.push(Object.assign({}, s)); }
    src.splice(+i, 1); bankSet(A); uiDirty.inv = true; try { saveGame(true); } catch (e) { } sfx('pickup'); openBank(); }); }
{ const _os = openStorage; openStorage = function () { const r = _os.apply(this, arguments); try { const row = $('#modal .row'); if (row && !$('#bkOpen')) { row.insertAdjacentHTML('afterbegin', `<button class="btn gold" id="bkOpen">🏦 ${L2('Baúl compartido (todos tus héroes)', 'Shared chest (all your heroes)')}</button>`); $('#bkOpen').onclick = () => openBank(); } } catch (e) { } return r; }; }

// =====================================================================================
// 4) OFICIOS DE JAPÓN (dentro del mapa)
// =====================================================================================
const JP7 = [];
const jp7Li = (pred, d) => { const i = JP_LOOKS.findIndex(pred); return i >= 0 ? i : d; };
function jp7Job(k, e, ne, nn, at, wh, li, le, ln, he, hn, we, wn, pi) { const g = JP_LOOKS[li][0];
  v8Job(k, 'japon', e, ne, nn, at, wh, ['es', g, 0, null], le, ln, he, hn, we, wn, pi); const id = 'v8_' + k;
  delete FS_LOOK[id]; JP_NPC_LOOK[id] = li; NPCS[id].title = L2('Japón', 'Japan'); NPCS[id].look = LK({ g }); JP7.push(k); }
function jp7Free(M, x, y, w, h) { const J = JP_G, ok = (X, Y) => { if (X < 1 || Y < 1 || X >= M.w - 1 || Y >= M.h - 1) return false; const i = M.I(X, Y); if (M.objAt[i] >= 0 || SOLID_T[M.ter[i]]) return false; const g = M.jg[i]; return g !== J.ROAD && g !== J.SEA && g !== J.POND && g !== J.CANAL && g !== J.RUN; };
  for (let d = 0; d <= 45; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue; const x0 = x + dx, y0 = y + dy; let good = true; for (let Y = y0 - h + 1; Y <= y0 && good; Y++) for (let X = x0; X < x0 + w && good; X++) if (!ok(X, Y)) good = false; if (good) return [x0, y0]; } return null; }
function jp7Place(M) { for (const k of JP7) { const J = V8J[k]; try { const [tx, ty] = J.at(M), [w, h] = J.wh, p = jp7Free(M, tx, ty, w, h); if (!p) { console.warn('jp7 sin sitio', k); continue; }
    const x0 = p[0], y1 = p[1], y0 = y1 - h + 1, A = { x0, y0, w, h, cx: x0 + (w >> 1), cy: y0 + (h >> 1) }; A.px = A.cx * 16 + 8; A.py = A.cy * 16 + 8; V8.at[k] = A;
    XSPR['v8s_' + k] = XSPR['v8s_' + k] || v8Sign(k); ipObj(M, 'v8s_' + k, x0, y0, { solid: false, xact: 'v8_' + k }); ipSp(M, 'v8_' + k, x0 + 1, y0, { face: 'down' });
    ipPoi(M, 'pejob', x0, y0, J.e + ' ' + J.n); if (V8_PLACE[k]) V8_PLACE[k](M, A); } catch (e) { console.warn('jp7', k, e); } } }
{ const _mj = makeJapan; makeJapan = function () { const M = _mj.apply(this, arguments); try { if (M && !M._jp7) { M._jp7 = 1; jp7Place(M); } } catch (e) { console.warn(e); } return M; }; }
const jp7Tile = (M, px, py) => { const x = Math.floor(px / 16), y = Math.floor(py / 16); return x >= 0 && y >= 0 && x < M.w && y < M.h ? M.jg[M.I(x, y)] : -1; };

// ---------- JARDINERO DEL TEMPLO (Kinkaku-ji) ----------
jp7Job('jardinero', '🪷', 'Jardinero del templo', 'Temple gardener', M => [JP_KIN.x1 - 8, JP_KIN.y0 + 6], [10, 7], jp7Li(l => l[3] === 'monje', 0),
  'La arena se rastrilla como el agua: en líneas tranquilas y en círculos alrededor de las piedras.', 'Sand is raked like water: in calm lines and in circles around the stones.',
  'Primero rastrillas el jardín de arena: camina por cada casilla en la dirección del dibujo (de lado = líneas horizontales, de arriba abajo = líneas verticales). Junto a las piedras pulsa ⚔ para hacer los círculos. Luego poda los 3 bonsáis: cuando les salga una rama, acércate y pulsa ⚔ (si cortas sin rama, lo estropeas).', 'First rake the sand garden: walk across each cell in the direction of the pattern (sideways = horizontal lines, up and down = vertical lines). Next to the stones press ⚔ to make the circles. Then prune the 3 bonsais: when a branch sprouts, walk up and press ⚔ (cutting with no branch damages it).',
  'Jardín del Kinkaku-ji (Kioto)', 'Kinkaku-ji garden (Kyoto)', 1);
V8_GO.jardinero = A => { const cols = 8, rows = 4, gx = A.x0 * 16 + 8, gy = A.y0 * 16 + 30, stones = [[2, 1], [5, 2]], v = Math.floor(Math.random() * 3), goal = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (stones.some(([sc, sr]) => sc === c && sr === r)) goal.push('s'); else if (stones.some(([sc, sr]) => Math.abs(sc - c) <= 1 && Math.abs(sr - r) <= 1)) goal.push('o'); else goal.push(v === 0 ? 'h' : v === 1 ? (r < 2 ? 'h' : 'v') : (c < 4 ? 'v' : 'h')); }
  const bons = [0, 1, 2].map(i => ({ x: gx + 22 + i * 42, y: gy - 6, br: 0, t: 1 + Math.random() * 2, over: 0 })), P = G.P; P.x = gx + 4; P.y = gy + 8;
  Object.assign(ACT, { k: 'v8_jardinero', gx, gy, cols, rows, goal, cell: goal.map(g => g === 's' ? 's' : ''), ph: 'rake', t: 55, bons, cuts: 0, bad: 0, lx: P.x, ly: P.y,
    onAtk: () => { const B = ACT, P = G.P; setAnim(P, 'atk'); if (B.ph === 'rake') { const c = Math.floor((P.x - B.gx) / 16), r = Math.floor((P.y - B.gy) / 16), i = r * B.cols + c; if (c >= 0 && r >= 0 && c < B.cols && r < B.rows && B.goal[i] === 'o') { B.cell[i] = 'o'; sfx('ui'); part(P.x, P.y, { vz: 15, vx: 0, g: 50, life: 0.4, c: '#d8ccb0', s: 2 }); } else floatText(P.x, P.y - 40, L2('Los círculos, junto a las piedras', 'Circles go next to the stones'), '#ffe08a'); return true; }
      const b = B.bons.find(b => Math.hypot(P.x - b.x, P.y - b.y) < 26); if (!b) return true; if (b.br > 0) { B.cuts += b.br; b.br = 0; b.t = 1.5 + Math.random() * 2.5; sfx('hit'); floatText(b.x, b.y - 30, L2('¡Podado!', 'Pruned!'), '#8aff8a'); for (let k = 0; k < 6; k++) part(b.x, b.y - 14, { vz: 30, vx: (Math.random() - 0.5) * 60, g: 90, life: 0.6, c: '#3a8a3a', s: 2 }); } else { B.bad++; sfx('hurt'); floatText(b.x, b.y - 30, L2('¡Cortaste de más!', 'Cut too much!'), '#ff8a8a'); } return true; } });
  banner('🪷 ' + L2('Jardín zen', 'Zen garden'), L2('Camina en la dirección del dibujo; ⚔ junto a las piedras para los círculos.', 'Walk in the pattern\'s direction; ⚔ next to the stones for circles.')); };
V33_TICKS.push(dt => { if (ACT.k !== 'v8_jardinero') return; dt = Math.min(0.05, dt || 0.016); const B = ACT, P = G.P; B.t -= dt;
  P.x = Math.max(B.gx - 6, Math.min(B.gx + B.cols * 16 + 6, P.x)); P.y = Math.max(B.gy - 14, Math.min(B.gy + B.rows * 16 + 8, P.y));
  // las piedras no se pisan
  for (const [sc, sr] of [[2, 1], [5, 2]]) { const sx = B.gx + sc * 16 + 8, sy = B.gy + sr * 16 + 8; if (Math.abs(P.x - sx) < 8 && Math.abs(P.y - sy) < 8) { P.x = B.lx; P.y = B.ly; } }
  const dx = P.x - B.lx, dy = P.y - B.ly; if (B.ph === 'rake' && Math.hypot(dx, dy) > 0.6) { const c = Math.floor((P.x - B.gx) / 16), r = Math.floor((P.y - B.gy) / 16), i = r * B.cols + c; if (c >= 0 && r >= 0 && c < B.cols && r < B.rows && B.cell[i] !== 's') B.cell[i] = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v'; }
  B.lx = P.x; B.ly = P.y; const n = B.goal.filter(g => g !== 's').length, ok = B.cell.filter((v, i) => B.goal[i] !== 's' && v === B.goal[i]).length;
  if (B.ph === 'rake') { v8Hud(`${L2('Arena', 'Sand')} ${ok}/${n} · ${Math.ceil(B.t)} s`); if (B.t <= 0 || ok === n) { B.raked = ok; B.rn = n; B.ph = 'bonsai'; B.t = 25; banner('🌳 ' + L2('¡Ahora los bonsáis!', 'Now the bonsais!'), L2('Cuando salga una rama, acércate y pulsa ⚔.', 'When a branch sprouts, walk up and press ⚔.')); } return; }
  for (const b of B.bons) { b.t -= dt; if (b.t <= 0) { if (b.br < 3) b.br++; else { b.over++; } b.t = 2 + Math.random() * 2.5; } }
  v8Hud(`🌳 ✂ ${B.cuts} · ${L2('de más', 'too much')} ${B.bad} · ${Math.ceil(B.t)} s`);
  if (B.t <= 0) { const over = B.bons.reduce((a, b) => a + b.over + b.br, 0), score = B.raked + B.cuts - B.bad - over, P_ = G.P; let extra = '';
    if (B.raked >= B.rn * 0.85 && Math.random() < 0.3) { const id = v8Pick(['bk_zen_arena', 'bk_zen_bonsai', 'bk_zen_farol']); if (ITEMS[id] && giveItem(id, 1, true)) extra = ' · 🎁 ' + usoN(id); }
    v8Pay('jardinero', 80 + B.raked * 12 + B.cuts * 18 - (B.bad + over) * 8, 24 + Math.max(0, score) * 3, B.raked + '/' + B.rn + L2(' de arena · ', ' sand · ') + B.cuts + L2(' ramas', ' branches') + extra); } });
V8_UNDER.push((cx, cy) => { if (ACT.k !== 'v8_jardinero') return; const B = ACT; ctx.fillStyle = '#8a8a8e'; ctx.fillRect(B.gx - 3 - cx, B.gy - 3 - cy, B.cols * 16 + 6, B.rows * 16 + 6); ctx.fillStyle = '#ece0c4'; ctx.fillRect(B.gx - cx, B.gy - cy, B.cols * 16, B.rows * 16);
  for (let r = 0; r < B.rows; r++) for (let c = 0; c < B.cols; c++) { const i = r * B.cols + c, x = B.gx + c * 16 - cx, y = B.gy + r * 16 - cy, g = B.goal[i], v = B.cell[i];
    if (g === 's') { ctx.fillStyle = '#6a6a70'; ctx.beginPath(); ctx.ellipse(x + 8, y + 9, 7, 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#9a9aa0'; ctx.fillRect(x + 4, y + 5, 5, 2); ctx.fillStyle = '#5a8a4a'; ctx.fillRect(x + 9, y + 11, 4, 2); continue; }
    const draw = (k, col) => { ctx.fillStyle = col; if (k === 'h') for (let q = 3; q < 16; q += 4) ctx.fillRect(x + 1, y + q, 14, 1); else if (k === 'v') for (let q = 3; q < 16; q += 4) ctx.fillRect(x + q, y + 1, 1, 14); else if (k === 'o') { ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x + 8, y + 8, 6, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 8, y + 8, 3, 0, 7); ctx.stroke(); } };
    if (v && v === g) draw(v, '#b8a880'); else { if (v) draw(v, 'rgba(160,120,90,0.8)'); ctx.globalAlpha = 0.35; draw(g, '#8a7a5a'); ctx.globalAlpha = 1; } } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'v8_jardinero') return; const B = ACT, P = G.P; ctx.fillStyle = '#7a5a32'; ctx.fillRect(P.x - cx + 7, P.y - cy - 22, 2, 18); ctx.fillRect(P.x - cx + 3, P.y - cy - 5, 10, 2);
  if (B.ph !== 'bonsai') return; for (const b of B.bons) { const x = b.x - cx, y = b.y - cy; ctx.fillStyle = '#5a3a2a'; ctx.fillRect(x - 8, y - 6, 16, 6); ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x - 1, y - 16, 3, 10); ctx.fillStyle = '#3a8a3a'; ctx.beginPath(); ctx.ellipse(x, y - 20, 11, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#5ab05a'; ctx.fillRect(x - 6, y - 24, 6, 2);
    for (let k = 0; k < b.br; k++) { ctx.fillStyle = '#2a6a2a'; const ax = x + (k % 2 ? 9 : -12) + k, ay = y - 26 - k * 3; ctx.fillRect(ax, ay, 5, 2); ctx.fillRect(ax + (k % 2 ? 4 : 0), ay - 3, 2, 3); }
    if (b.br) drawTxt('✂', x, y - 34, '#ffe08a', 9); } });

// ---------- PESCADOR DE BARCA (estanque de Asakusa) ----------
jp7Job('barquero', '🛶', 'Pescador de barca', 'Boat fisher', M => [212, 170], [5, 3], jp7Li((l, i) => l[0] === 'm' && i > 2, 3),
  'Remar despacio, mirar las ondas y tener paciencia. Los grandes tiran fuerte.', 'Row slowly, watch the ripples and be patient. The big ones pull hard.',
  'Te subes a la barca y remas con el joystick (la barca sigue avanzando un poco al soltar). Busca las ondas del agua y quédate quieto encima: el corcho baja solo. Cuando se hunda (¡!), pulsa ⚔. Si es un pez grande tira de la barca: empuja el joystick al lado contrario de la flecha hasta llenar la barra. Vuelve al muelle y pulsa ⚔ para vender en la lonja antes de que cierre.', 'Get in the boat and row with the joystick (it keeps gliding a bit when you let go). Look for ripples and stay still on top: the float drops by itself. When it sinks (!), press ⚔. A big fish pulls the boat: push the joystick against the arrow until the bar fills. Row back to the pier and press ⚔ to sell at the fish market before it closes.',
  'Estanque de Asakusa (Tokio)', 'Asakusa pond (Tokyo)', 2);
V8_PLACE.barquero = (M, A) => { let best = null, bd = 1e9; for (let y = A.cy - 30; y <= A.cy + 30; y++) for (let x = A.cx - 30; x <= A.cx + 30; x++) { if (x < 1 || y < 1 || x >= M.w - 1 || y >= M.h - 1 || M.jg[M.I(x, y)] !== JP_G.POND) continue; const d = (x - A.cx) ** 2 + (y - A.cy) ** 2; if (d < bd) { bd = d; best = [x, y]; } } A.dock = best; };
function jp7Ripple(M, A) { for (let k = 0; k < 60; k++) { const x = A.dock[0] * 16 + 8 + v8Rnd(-260, 260), y = A.dock[1] * 16 + 8 + v8Rnd(-200, 200); if (jp7Tile(M, x, y) === JP_G.POND) return { x, y, t: 10 + Math.random() * 6 }; } return { x: A.dock[0] * 16 + 8, y: A.dock[1] * 16 + 8, t: 8 }; }
V8_GO.barquero = A => { if (!A.dock) { toast(L2('No encuentro el agua del estanque.', 'I can\'t find the pond water.'), 'warn'); return; } const M = G.map, P = G.P, dx = A.dock[0] * 16 + 8, dy = A.dock[1] * 16 + 8; P.x = dx; P.y = dy;
  Object.assign(ACT, { k: 'v8_barquero', dx, dy, vx: 0, vy: 0, rip: [0, 1, 2, 3].map(() => jp7Ripple(M, A)), st: 'row', bob: null, small: 0, big: 0, lost: 0, t: 90, fight: null,
    onAtk: () => { const B = ACT, P = G.P; if (B.st === 'bite') { if (Math.random() < 0.32) { B.st = 'fight'; const a = Math.random() * 6.28; B.fight = { px: Math.cos(a), py: Math.sin(a), p: 25, t: 0, turn: 1.5 }; banner('🐟 ' + L2('¡Uno grande!', 'A big one!'), L2('Empuja el joystick contra la flecha.', 'Push the joystick against the arrow.')); sfx('hit'); } else { B.small++; B.st = 'row'; B.bob = null; sfx('coin'); floatText(P.x, P.y - 44, L2('¡Pez! +1', 'Fish! +1'), '#ffd040'); } return true; }
      if (B.st === 'wait') { B.st = 'row'; B.bob = null; floatText(P.x, P.y - 44, L2('¡Muy pronto!', 'Too early!'), '#ff8a8a'); sfx('hurt'); return true; }
      if (Math.hypot(P.x - B.dx, P.y - B.dy) < 24) { jp7BoatSell(false); return true; } return true; } });
  banner('🛶 ' + L2('¡A remar!', 'Row!'), L2('Quieto sobre las ondas; ⚔ cuando se hunda el corcho. Vende en el muelle.', 'Stay still on the ripples; ⚔ when the float sinks. Sell at the pier.')); };
function jp7BoatSell(late) { const B = ACT, P = G.P, A = V8.at.barquero; if (!B.small && !B.big) { if (late) { P.x = A.px; P.y = A.py; v8Off(); banner('🛶 ' + L2('La lonja cerró', 'The market closed'), L2('Hoy no picó nada.', 'Nothing bit today.')); } else toast(L2('Aún no has pescado nada.', 'You haven\'t caught anything yet.'), 'info'); return; }
  let gold = B.small * 45 + B.big * 170; if (late) gold = Math.round(gold / 2); let extra = ''; const id = B.big ? 'koi' : 'carpa'; if (ITEMS[id] && giveItem(id, 1, true)) extra = ' · 🎁 ' + usoN(id);
  P.x = A.px; P.y = A.py; v8Pay('barquero', gold, 22 + B.small * 4 + B.big * 12, B.small + L2(' pequeños · ', ' small · ') + B.big + L2(' grandes', ' big') + (late ? L2(' (lonja cerrada: mitad)', ' (market closed: half)') : '') + extra); }
V33_TICKS.push(dt => { if (ACT.k !== 'v8_barquero') return; dt = Math.min(0.05, dt || 0.016); const B = ACT, P = G.P, M = G.map, j = v8Joy(); B.t -= dt;
  if (B.st === 'fight') { const F = B.fight; F.t += dt; F.turn -= dt; if (F.turn <= 0) { const a = Math.random() * 6.28; F.px = Math.cos(a); F.py = Math.sin(a); F.turn = 1.2 + Math.random(); }
    B.vx += F.px * 60 * dt; B.vy += F.py * 60 * dt; const against = -(j[0] * F.px + j[1] * F.py); F.p += (against > 0.5 ? 34 : -14) * dt;
    if (F.p >= 100) { B.big++; B.st = 'row'; B.bob = null; B.fight = null; sfx('quest'); floatText(P.x, P.y - 48, L2('¡Pez grande!', 'Big fish!'), '#ffd040'); } else if (F.p <= 0 || F.t > 12) { B.lost++; B.st = 'row'; B.bob = null; B.fight = null; sfx('hurt'); floatText(P.x, P.y - 48, L2('Se escapó…', 'It got away…'), '#ff8a8a'); } }
  else { B.vx += j[0] * 90 * dt; B.vy += j[1] * 90 * dt; }
  const drag = Math.pow(0.45, dt); B.vx *= drag; B.vy *= drag; const sp = Math.hypot(B.vx, B.vy); if (sp > 70) { B.vx *= 70 / sp; B.vy *= 70 / sp; }
  const nx = P.x + B.vx * dt, ny = P.y + B.vy * dt; if (jp7Tile(M, nx, ny) === JP_G.POND) { P.x = nx; P.y = ny; } else { B.vx *= -0.3; B.vy *= -0.3; if (jp7Tile(M, P.x, P.y) !== JP_G.POND) { P.x = B.dx; P.y = B.dy; } }
  if (Math.abs(B.vx) > Math.abs(B.vy)) { if (Math.abs(B.vx) > 4) P.dir = B.vx > 0 ? 'right' : 'left'; } else if (Math.abs(B.vy) > 4) P.dir = B.vy > 0 ? 'down' : 'up';
  for (let i = 0; i < B.rip.length; i++) { const r = B.rip[i]; r.t -= dt; if (r.t <= 0) B.rip[i] = jp7Ripple(M, V8.at.barquero); }
  if (B.st === 'row') { const r = B.rip.find(r => Math.hypot(r.x - P.x, r.y - P.y) < 22); if (r && Math.hypot(B.vx, B.vy) < 14) { B.st = 'wait'; B.bob = { x: r.x, y: r.y, t: 1.2 + Math.random() * 2, r }; } }
  else if (B.st === 'wait') { if (Math.hypot(B.vx, B.vy) > 22) { B.st = 'row'; B.bob = null; } else { B.bob.t -= dt; if (B.bob.t <= 0) { B.st = 'bite'; B.bob.t = 0.9; sfx('ui'); } } }
  else if (B.st === 'bite') { B.bob.t -= dt; if (B.bob.t <= 0) { B.st = 'row'; B.bob = null; B.lost++; floatText(P.x, P.y - 44, L2('Se llevó el cebo', 'It took the bait'), '#ff8a8a'); } }
  const atDock = Math.hypot(P.x - B.dx, P.y - B.dy) < 24;
  v8Hud(`🐟 ${B.small} · 🐠 ${B.big} · ${Math.max(0, Math.ceil(B.t))} s${atDock && (B.small || B.big) ? ' · ⚔ ' + L2('vender', 'sell') : ''}`);
  if (B.t <= 0) jp7BoatSell(!atDock); });
V8_UNDER.push((cx, cy) => { if (ACT.k !== 'v8_barquero') return; const B = ACT, P = G.P;
  for (const r of B.rip) { const x = r.x - cx, y = r.y - cy; if (x < -40 || x > VW + 40 || y < -40 || y > VH + 40) continue; for (let k = 0; k < 2; k++) { const rr = 4 + ((G.t * 10 + k * 7) % 14); ctx.strokeStyle = 'rgba(230,245,255,' + (0.7 - rr / 22) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.5, 0, 0, 7); ctx.stroke(); } }
  ctx.fillStyle = '#7a4a22'; ctx.fillRect(B.dx - 10 - cx, B.dy - 14 - cy, 20, 6); ctx.fillStyle = '#5a3418'; ctx.fillRect(B.dx - 10 - cx, B.dy - 8 - cy, 3, 6); ctx.fillRect(B.dx + 7 - cx, B.dy - 8 - cy, 3, 6);
  const x = P.x - cx, y = P.y - cy + 2, side = P.dir === 'left' || P.dir === 'right'; ctx.fillStyle = '#6a3a1a'; ctx.beginPath(); ctx.ellipse(x, y, side ? 20 : 11, side ? 7 : 13, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#9a6030'; ctx.beginPath(); ctx.ellipse(x, y - 1, side ? 16 : 8, side ? 4.5 : 10, 0, 0, 7); ctx.fill();
  const ph = Math.sin(G.t * (Math.hypot(B.vx, B.vy) > 6 ? 9 : 2)) * 5; ctx.fillStyle = '#c8a060'; if (side) { ctx.fillRect(x - 3, y - 9 + ph, 2, 14); ctx.fillRect(x + 2, y - 9 - ph, 2, 14); } else { ctx.fillRect(x - 15 + ph, y - 2, 12, 2); ctx.fillRect(x + 3 - ph, y - 2, 12, 2); }
  if (B.bob) { const bx = B.bob.x - cx, by = B.bob.y - cy + (B.st === 'bite' ? 3 : Math.sin(G.t * 4)); ctx.strokeStyle = 'rgba(240,240,240,0.7)'; ctx.beginPath(); ctx.moveTo(x + 6, y - 22); ctx.lineTo(bx, by - 3); ctx.stroke(); ctx.fillStyle = '#e83a3a'; ctx.fillRect(bx - 2, by - 5, 4, 3); ctx.fillStyle = '#ffffff'; ctx.fillRect(bx - 2, by - 2, 4, 2); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'v8_barquero') return; const B = ACT, P = G.P;
  if (B.st === 'bite') drawTxt('¡!', B.bob.x - cx, B.bob.y - cy - 14, '#ffe040', 12);
  if (B.st === 'fight') { const F = B.fight, x = P.x - cx, y = P.y - cy - 62; ctx.strokeStyle = '#ff5a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P.x - cx, P.y - cy - 20); ctx.lineTo(P.x - cx + F.px * 34, P.y - cy - 20 + F.py * 34); ctx.stroke(); ctx.lineWidth = 1;
    ctx.fillStyle = '#1a1a1e'; ctx.fillRect(x - 26, y, 52, 6); ctx.fillStyle = F.p > 60 ? '#3ac04a' : '#ffd040'; ctx.fillRect(x - 25, y + 1, 50 * Math.max(0, Math.min(1, F.p / 100)), 4); drawTxt(L2('¡Tira al revés!', 'Pull back!'), x, y - 3, '#ffffff', 8); } });

// ---------- MENSAJERO EN BICI (Tokio) ----------
jp7Job('mensajero', '🚲', 'Mensajero en bici', 'Bike courier', M => [178, 112], [5, 3], jp7Li((l, i) => l[0] === 'm' && i > 5, 5),
  'Tres paquetes, tres puertas y un reloj. Y cuidado con los taxis: no frenan por ti.', 'Three parcels, three doors and a clock. And watch out for taxis: they won\'t brake for you.',
  'Te dan una bici y 3 paquetes. Las flechas del borde de la pantalla y las cajas que brillan marcan las puertas: llega hasta cada una para entregar (en el orden que quieras). Si te choca un coche te caes, pierdes tiempo y el paquete se abolla (menos propina). Cuanto más tiempo te sobre, más propina.', 'You get a bike and 3 parcels. The arrows at the screen edge and the glowing boxes mark the doors: reach each one to deliver (in any order). If a car hits you, you fall, lose time and the parcel gets dented (smaller tip). The more time left, the bigger the tip.',
  'Oficina de mensajería (Tokio)', 'Courier office (Tokyo)', 3);
V8_GO.mensajero = A => { const M = G.map, P = G.P, doors = M.objs.filter(o => o.xact === 'jp_in' && o.tx >= 118 && o.tx <= 237 && o.ty >= 3 && o.ty <= 153).map(o => ({ x: o.tx * 16 + 8, y: o.ty * 16 + 22 })).filter(d => { const k = Math.hypot(d.x - A.px, d.y - A.py) / 16; return k > 10 && k < 70; });
  if (doors.length < 3) { toast(L2('Hoy no hay paquetes.', 'No parcels today.'), 'info'); return; } const tg = []; while (tg.length < 3 && doors.length) tg.push(Object.assign(doors.splice(Math.floor(Math.random() * doors.length), 1)[0], { done: 0, dent: 0 }));
  P.x = A.px; P.y = A.py + 20; Object.assign(ACT, { k: 'v8_mensajero', tg, t: 85, stun: 0, inv: 0, gold: 0, crash: 0, onAtk: () => true }); calcStats(P);
  banner('🚲 ' + L2('¡A repartir!', 'Deliver!'), L2('Sigue las flechas hasta las puertas. ¡Cuidado con los coches!', 'Follow the arrows to the doors. Watch the cars!')); };
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { if (P && P === G.P && P.S && ACT.k === 'v8_mensajero') { P.S.spd = Math.round(P.S.spd * 1.7); P._bike = 1; } } catch (e) { } return r; }; }
V33_TICKS.push(() => { const P = G.P; if (P && P._bike && ACT.k !== 'v8_mensajero') { P._bike = 0; calcStats(P); } });
V33_TICKS.push(dt => { if (ACT.k !== 'v8_mensajero') return; dt = Math.min(0.05, dt || 0.016); const B = ACT, P = G.P; B.t -= dt; B.inv = Math.max(0, B.inv - dt);
  if (B.stun > 0) { B.stun -= dt; P.x = B.sx; P.y = B.sy; }
  else if (!B.inv && typeof JP_CARS !== 'undefined') for (const c of JP_CARS) { const [x, y] = jpCarXY(c); if (Math.abs(x - P.x) < 18 && Math.abs(y - P.y) < 14) { B.stun = 1.1; B.inv = 2.5; B.sx = P.x; B.sy = P.y; B.t -= 6; B.crash++; const left = B.tg.find(t => !t.done); if (left) left.dent++; G.shake = 5; sfx('hurt'); floatText(P.x, P.y - 46, L2('¡Pum! −6 s', 'Bam! −6 s'), '#ff8a8a'); break; } }
  for (const t of B.tg) if (!t.done && Math.hypot(P.x - t.x, P.y - t.y) < 24) { t.done = 1; const tip = Math.max(0, Math.round(B.t * 2.5) - t.dent * 40), g = 110 + tip; B.gold += g; sfx('coin'); floatText(P.x, P.y - 46, L2('¡Entregado! +', 'Delivered! +') + g, '#ffd040'); }
  const left = B.tg.filter(t => !t.done).length; v8Hud(`📦 ${3 - left}/3 · ${Math.max(0, Math.ceil(B.t))} s${B.crash ? ' · 💥 ' + B.crash : ''}`);
  if (!left || B.t <= 0) v8Pay('mensajero', B.gold, 25 + (3 - left) * 14 - B.crash * 3, (3 - left) + L2('/3 paquetes entregados', '/3 parcels delivered') + (B.crash ? ' · 💥 ' + B.crash : '')); });
V8_UNDER.push((cx, cy) => { if (ACT.k !== 'v8_mensajero') return; const P = G.P, x = P.x - cx, y = P.y - cy + 2, side = P.dir === 'left' || P.dir === 'right'; ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 2;
  if (side) { ctx.beginPath(); ctx.arc(x - 9, y, 5, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 9, y, 5, 0, 7); ctx.stroke(); ctx.strokeStyle = '#2a8ae8'; ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x, y - 6); ctx.lineTo(x + 9, y); ctx.moveTo(x - 4, y - 6); ctx.lineTo(x + 5, y - 6); ctx.stroke(); }
  else { ctx.fillStyle = '#1a1a1e'; ctx.fillRect(x - 2, y - 6, 4, 12); ctx.strokeStyle = '#2a8ae8'; ctx.beginPath(); ctx.moveTo(x - 7, y - 4); ctx.lineTo(x + 7, y - 4); ctx.stroke(); } ctx.lineWidth = 1;
  for (const t of ACT.tg) if (!t.done) { const tx = t.x - cx, ty = t.y - cy - 6 + Math.sin(G.t * 4) * 2; if (tx < -20 || tx > VW + 20 || ty < -20 || ty > VH + 20) continue; ctx.fillStyle = 'rgba(255,230,120,' + (0.35 + 0.25 * Math.sin(G.t * 6)) + ')'; ctx.beginPath(); ctx.ellipse(tx, ty + 8, 14, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#c8904a'; ctx.fillRect(tx - 6, ty - 6, 12, 10); ctx.fillStyle = '#8a5a2a'; ctx.fillRect(tx - 6, ty - 2, 12, 2); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'v8_mensajero') return; const P = G.P; ctx.fillStyle = '#c8904a'; ctx.fillRect(P.x - cx - 5, P.y - cy - 30, 10, 8); ctx.fillStyle = '#8a5a2a'; ctx.fillRect(P.x - cx - 5, P.y - cy - 27, 10, 2);
  if (ACT.stun > 0) drawTxt('💫', P.x - cx, P.y - cy - 46, '#ffffff', 12);
  for (const t of ACT.tg) { if (t.done) continue; const dx = t.x - P.x, dy = t.y - P.y, d = Math.hypot(dx, dy); if (d < 120) continue; const ux = dx / d, uy = dy / d, ex = VW / 2 + ux * (VW / 2 - 24), ey = VH / 2 + uy * (VH / 2 - 24); ctx.save(); ctx.translate(ex, ey); ctx.rotate(Math.atan2(uy, ux)); ctx.fillStyle = '#ffd040'; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-6, -7); ctx.lineTo(-6, 7); ctx.fill(); ctx.restore(); drawTxt('📦 ' + Math.round(d / 16) + 'm', ex - ux * 20, ey - uy * 20 + 3, '#ffffff', 8); } });

// =====================================================================================
// LUPA › SISTEMAS
// =====================================================================================
if (typeof GSIS !== 'undefined') {
  GSIS.unshift(['inv536', '🎒 ' + L2('Inventario: ordenar, favoritos, lista y baúl compartido', 'Bag: sort, favourites, list and shared chest'), () => [
    L2('⇅ Ordenar (arriba del inventario): el primer toque ordena; los siguientes cambian entre tipo, valor y nivel. Los favoritos van siempre primero.', '⇅ Sort (top of the bag): the first tap sorts; the next ones switch between type, value and level. Favourites always go first.'),
    L2('☆ Favorito (al tocar un objeto): le pone una estrella ★. Los favoritos no se venden con «Vender basura», no se marcan al seleccionar varios y no se pueden tirar.', '☆ Favourite (when you tap an item): gives it a ★ star. Favourites are not sold with «Sell junk», are not selected in multi-select and can\'t be dropped.'),
    L2('📝 Lista de la compra: en la Lupa › 🎒 Objetos (o en el inventario), elige algo que se fabrique y pulsa «Añadir a mi lista». Ves cuánto te falta de cada material y un globito te avisa cuando lo tienes todo. Filtro «📝 Mi lista».', '📝 Shopping list: in Magnifier › 🎒 Items (or the bag), pick something craftable and press «Add to my list». You see how much of each material you still need and a bubble tells you when you have it all. Filter «📝 My list».'),
    L2('🏦 Baúl compartido: abre el baúl de tu casa y pulsa «Baúl compartido». Lo comparten todos tus héroes de la cuenta en este teléfono (60 huecos). Los objetos de misión y los favoritos no entran.', '🏦 Shared chest: open your house chest and press «Shared chest». All your heroes on this account share it on this phone (60 slots). Quest items and favourites can\'t go in.')], () => null]);
  GSIS.unshift(['jp536', '🇯🇵 ' + L2('Oficios nuevos de Japón', 'New jobs in Japan'), () => [
    L2('🪷 Jardinero del templo (jardín del Kinkaku-ji, Kioto): rastrilla la arena caminando en la dirección del dibujo, haz círculos junto a las piedras con ⚔ y poda los bonsáis cuando les salga una rama. A veces te regalan arena, bonsái o farol para tu casa.', '🪷 Temple gardener (Kinkaku-ji garden, Kyoto): rake the sand by walking in the pattern\'s direction, make circles next to the stones with ⚔ and prune the bonsais when a branch sprouts. Sometimes you get sand, a bonsai or a lantern for your home.'),
    L2('🛶 Pescador de barca (estanque de Asakusa, Tokio): rema con el joystick, quédate quieto sobre las ondas, ⚔ cuando se hunda el corcho y tira al revés de la flecha con los grandes. Vende en el muelle con ⚔ antes de que cierre la lonja.', '🛶 Boat fisher (Asakusa pond, Tokyo): row with the joystick, stay still on the ripples, ⚔ when the float sinks and pull against the arrow with the big ones. Sell at the pier with ⚔ before the market closes.'),
    L2('🚲 Mensajero en bici (Tokio): 3 paquetes, sigue las flechas del borde hasta las puertas y esquiva los coches. Con la bici vas un 70 % más rápido.', '🚲 Bike courier (Tokyo): 3 parcels, follow the edge arrows to the doors and dodge the cars. On the bike you go 70% faster.'),
    L2('Son oficios de país: suben rápido y dan oro, experiencia de oficio y ventajas pequeñas. Están en el mapa de Japón (categoría Trabajos) y en la Lupa › Oficios con flecha.', 'They are country jobs: they level fast and give gold, job experience and small perks. They are on the Japan map (Jobs category) and in Magnifier › Jobs with the arrow.')], () => { const A = V8.at.jardinero; return A ? { loc: [A.cx, A.cy], t: L2('Jardín del Kinkaku-ji', 'Kinkaku-ji garden'), m: 'japon' } : null; }]); }
// en multijugador: los demás ven tu barca o tu bici (el nombre del oficio ya viaja en la presencia, o.v8)
V8_UNDER.push((cx, cy) => { const P = G.P; if (!G.remote) return; for (const r of G.remote.values()) { if (r.map !== P.map || (r.v8 !== 'barquero' && r.v8 !== 'mensajero')) continue; const x = r.x - cx, y = r.y - cy + 2; if (x < -40 || x > VW + 40 || y < -40 || y > VH + 40) continue;
  const side = r.dir === 'left' || r.dir === 'right';
  if (r.v8 === 'barquero') { ctx.fillStyle = '#6a3a1a'; ctx.beginPath(); ctx.ellipse(x, y, side ? 20 : 11, side ? 7 : 13, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#9a6030'; ctx.beginPath(); ctx.ellipse(x, y - 1, side ? 16 : 8, side ? 4.5 : 10, 0, 0, 7); ctx.fill(); }
  else { ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 2; if (side) { ctx.beginPath(); ctx.arc(x - 9, y, 5, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 9, y, 5, 0, 7); ctx.stroke(); ctx.strokeStyle = '#2a8ae8'; ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x, y - 6); ctx.lineTo(x + 9, y); ctx.stroke(); } else { ctx.fillStyle = '#1a1a1e'; ctx.fillRect(x - 2, y - 6, 4, 12); } ctx.lineWidth = 1; } } });
