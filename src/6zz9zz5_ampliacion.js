// ================= v5.04: AMPLIACIÓN DE LA VIDA DE OFICIO =================
// - Granja en casa: gallinero, establo, corral de ovejas, colmena, caseta del perro trufero, estanque e invernadero.
//   Cada uno da sus productos una vez por día de juego (más con nivel de Agricultura).
// - Tienda en casa: un mostrador donde pones productos a la venta; los vecinos compran solos con el tiempo (también sin jugar).
// - Museo de Albor: la curadora recibe donaciones para 5 colecciones; completarlas da oro, un título y una estatua.
// - Caravanas: el Caravanero lleva tus productos a otros reinos y vuelve con más oro y a veces algo raro.
// - Mercado entre jugadores (WiFi y online): pones ofertas y tus amigos te las compran desde el Gremio.
// - Torneo de oficios: reto diario de 2 minutos contra rivales del gremio y contra tus amigos conectados.
// Todo es vida cotidiana: no añade historia ni poder de combate.

// ---------- materiales nuevos ----------
it('ofm_lana', { n: L2('Lana', 'Wool'), t: 'mat', stack: true, tier: 2, price: 120, icon: ['ofp', 'wool', '#f0f0e8', '#c8a070'], rar: 1 });
it('ofm_miel', { n: L2('Tarro de miel', 'Honey jar'), t: 'mat', stack: true, tier: 2, price: 150, icon: ['ofp', 'honey', '#f0a020', '#c8a070'], rar: 1 });
it('ofm_trufa', { n: L2('Trufa negra', 'Black truffle'), t: 'mat', stack: true, tier: 4, price: 900, icon: ['ofp', 'cheese', '#3a2a2a', '#8a6a4a'], rar: 3 });
it('ofm_medalla', { n: L2('Medalla del gremio', 'Guild medal'), t: 'mat', stack: true, tier: 3, price: 600, icon: ['ofp', 'medal', '#ffd040', '#3a6ad0'], rar: 3 });
RECIPES.push({ id: 'r_ofm_lana', job: 'sastreria', out: 'tela_fina', n: 3, lv: 1, jlv: 5, gold: 10, mats: [['ofm_lana', 2]], cat: 'oficio' },
 { id: 'r_ofm_hidromiel', job: 'cocina', out: 'ofp_mermelada', n: 3, lv: 1, jlv: 5, gold: 10, mats: [['ofm_miel', 1], ['uva', 1]], cat: 'oficio' });

// ---------- granja en casa ----------
// [clave, es, en, nivel de Agricultura, coste, oro, producto(s)]
const FARM = [
 ['gallinero', 'Gallinero', 'Henhouse', 10, [['log', 8]], 1500, () => [['ig_huevo', 2]]],
 ['establo', 'Establo con vaca', 'Cow stable', 20, [['log', 12], ['piedra', 4]], 3000, () => [['ig_leche', 2], ['ig_queso', 1]]],
 ['corral', 'Corral de ovejas', 'Sheep pen', 30, [['log', 10]], 4000, () => [['ofm_lana', 2]]],
 ['colmena', 'Colmena', 'Beehive', 40, [['log4', 4]], 5000, () => [['ofm_miel', 2]]],
 ['caseta', 'Caseta del perro trufero', 'Truffle dog kennel', 50, [['log5', 4]], 8000, () => [['ofm_trufa', 1]]],
 ['estanque', 'Estanque de peces', 'Fish pond', 55, [['piedra', 20]], 9000, () => [[pick(['carpa', 'trucha', 'perca', 'koi', 'pezluna']), 2]]],
 ['invernadero', 'Invernadero', 'Greenhouse', 65, [['log6', 6], ['ore3', 4]], 15000, () => [[pick(['tomate', 'zanahoria', 'calabaza', 'uva', 'melon']), 3]]],
];
function farmPaint(k) {
 const W_ = WOOD, D = C, wh = D('#f4f4ec'), rd = D('#c83a3a'); let p, ax = 8, ay;
 const animal = (x, y, body, head, sc = 1) => { p.ell(x, y, 4 * sc, 2.6 * sc, body); p.ball(x + 4 * sc, y - 2 * sc, 1.8 * sc, 1.8 * sc, [head, head]); p.vl(Math.round(x - 2 * sc), Math.round(y + 2 * sc), 2, D('#3a2a1a')); p.vl(Math.round(x + 2 * sc), Math.round(y + 2 * sc), 2, D('#3a2a1a')); };
 switch (k) {
  case 'gallinero': p = new Pix(32, 30); p.poly([[1, 10], [16, 1], [31, 10]], rd); p.rect(3, 10, 26, 14, W_[3]); for (let x = 3; x < 29; x += 4) p.vl(x, 10, 14, W_[2]); p.rect(12, 15, 7, 9, W_[0]); p.ball(15, 13, 2, 2, [D('#ffd040'), D('#fff0a0')]);
   for (const [x, y] of [[6, 27], [24, 27]]) { p.ell(x, y, 3, 2.2, wh); p.ball(x + 3, y - 2, 1.5, 1.5, [wh, wh]); p.set(x + 4, y - 2, D('#ff8a2a')); p.set(x + 3, y - 3, rd); } ay = 29; break;
  case 'establo': p = new Pix(34, 32); p.poly([[1, 12], [17, 2], [33, 12]], D('#8a3a2a')); p.rect(3, 12, 28, 14, D('#b04a3a')); p.rect(11, 15, 12, 11, W_[0]); p.line(11, 15, 22, 25, wh); p.line(22, 15, 11, 25, wh);
   animal(25, 28, wh, wh, 1.3); p.ell(24, 28, 2, 1.2, D('#2a2a2a')); p.set(31, 25, D('#f0a0a0')); ay = 31; break;
  case 'corral': p = new Pix(34, 26); for (let x = 1; x < 33; x += 6) woodPost(p, x, 8, 24, 2); p.hl(1, 11, 32, W_[4]); p.hl(1, 18, 32, W_[4]);
   for (const [x, y] of [[9, 16], [22, 18]]) { p.ball(x, y, 5, 3.5, [D('#d8d8d0'), wh, wh, wh]); p.ball(x + 5, y - 2, 1.8, 1.8, [D('#3a3a3a'), D('#3a3a3a')]); p.vl(x - 2, y + 3, 3, D('#3a3a3a')); p.vl(x + 2, y + 3, 3, D('#3a3a3a')); } ay = 25; break;
  case 'colmena': p = new Pix(18, 26); p.rect(5, 18, 8, 7, W_[2]); woodPost(p, 7, 18, 25, 2); for (let i = 0; i < 4; i++) { p.rect(2, 4 + i * 4, 14, 4, i % 2 ? D('#e0b030') : D('#c8902a')); p.hl(2, 4 + i * 4, 14, D('#f0d060')); } p.rect(4, 1, 10, 3, W_[3]); p.rect(7, 14, 4, 2, D('#2a1a0a'));
   for (const [x, y] of [[1, 3], [16, 8], [15, 1]]) { p.set(x, y, D('#ffd040')); p.set(x + 1, y, D('#2a2a2a')); } ay = 25; break;
  case 'caseta': p = new Pix(26, 26); p.poly([[1, 9], [13, 1], [25, 9]], D('#3a6ad0')); p.rect(3, 9, 20, 12, W_[3]); p.ell(13, 17, 4, 5, D('#2a1a0a')); p.rect(9, 17, 8, 4, D('#2a1a0a'));
   p.ell(19, 23, 4, 2.4, D('#b07a3a')); p.ball(23, 20, 2.2, 2, [D('#b07a3a'), D('#c8904a')]); p.set(25, 20, D('#2a1a1a')); p.vl(21, 18, 2, D('#7a4a1a')); ay = 25; break;
  case 'estanque': p = new Pix(34, 22); p.ell(17, 12, 16, 9, D('#7a7a86')); p.ell(17, 12, 14, 7.5, D('#3a8ad0')); p.ell(17, 11, 12, 6, D('#5ab0e8')); p.hl(9, 9, 6, D('#c8f0ff'));
   p.ell(12, 13, 2.5, 1.2, D('#ff8a3a')); p.ell(22, 11, 2.5, 1.2, D('#f4f4ec')); p.ball(27, 7, 2.5, 1.5, [D('#3a9a3a'), D('#5ab04a')]); p.set(27, 6, D('#ff8ab0')); ay = 21; break;
  case 'invernadero': p = new Pix(34, 30); p.poly([[2, 12], [17, 2], [32, 12]], D('#bfe8ff')); p.rect(3, 12, 28, 16, D('#a8d8f0')); for (let x = 3; x < 31; x += 7) p.vl(x, 4, 24, D('#e8f8ff')); p.hl(3, 20, 28, D('#e8f8ff'));
   for (const [x, c] of [[7, '#e83a3a'], [14, '#ff8a2a'], [21, '#5ab04a'], [27, '#c070ff']]) { p.ball(x, 24, 2.4, 2.4, [D('#3a8a3a'), D('#5ab04a')]); p.set(x, 23, D(c)); p.set(x + 1, 24, D(c)); } p.rect(3, 27, 28, 2, W_[2]); ay = 29; break;
 }
 p.outline(D('#1a1010')); return { c: p.canvas(), ax, ay };
}
for (const [k, es, en, lv, cost, gold] of FARM) { const key = 'of_' + k; BK[key] = { n: L2(es, en), f: 'of_' + key, fp: [[0, 0], [1, 0]], cost, gold, tool: 'tala', tier: 1, cat: 'granja', L: 1, farm: k, ofjob: 'agricultura', ofjlv: lv }; BK_KEYS.push(key); it('bk_' + key, { n: BK[key].n, t: 'mat', bk: key, stack: true, tier: 1, price: 5, icon: ['bk', key] }); }
{ const _gf = genFurn2; genFurn2 = function (kind) { const b = /^of_of_/.test(kind) && BK[kind.slice(3)]; if (b && b.farm) return farmPaint(b.farm); return _gf.apply(this, arguments); }; }
function farmCollect(k) { const P = G.P, O = ofx(), D = FARM.find(f => f[0] === k); O.farm = O.farm || {}; const day = calDay();
 if (O.farm[k] === day) { toast(L2('Ya has recogido hoy. Vuelve mañana.', 'Already collected today. Come back tomorrow.'), 'warn'); return; }
 O.farm[k] = day; const bonus = Math.floor(((P.jobs.agricultura || { lv: 1 }).lv) / 25), got = [];
 for (const [id, n] of D[6]()) { giveItem(id, n + bonus); got.push((n + bonus) + ' ' + ITEMS[id].n); }
 gainJobXp('agricultura', 40 + D[3] * 4); sfx('coin'); toast('🧺 ' + got.join(', '), 'loot', 3); markDirty(true); }
for (const [k, es, en] of FARM) FURN_ACT['of_of_' + k] = [L2('Recoger: ', 'Collect: ') + L2(es, en), 'herb:1', () => farmCollect(k)];

// ---------- tienda en casa ----------
BK.of_tienda = { n: L2('Mostrador de tu tienda', 'Your shop counter'), f: 'of_of_tienda', fp: [[0, 0], [1, 0]], cost: [['log', 10]], gold: 2500, tool: 'tala', tier: 1, cat: 'mueble', L: 1, ofs: ['display', '#c8a040', '#e85a8a'] };
BK_KEYS.push('of_tienda'); it('bk_of_tienda', { n: BK.of_tienda.n, t: 'mat', bk: 'of_tienda', stack: true, tier: 1, price: 5, icon: ['bk', 'of_tienda'] });
const SHOP_SLOTS = 8, SHOP_EVERY = 150; // segundos reales por venta (más rápido con Comercio)
function homeShopState() { const O = ofx(); O.shop = O.shop || { s: [], g: 0, t: Date.now(), n: 0 }; return O.shop; }
function shopTick() { const S = homeShopState(), now = Date.now(), lvC = ((G.P.jobs.comercio || { lv: 1 }).lv), every = SHOP_EVERY * 1000 / (1 + lvC / 50);
 let k = Math.min(200, Math.floor((now - S.t) / every)); if (k <= 0) return 0; S.t += k * every; let sold = 0;
 while (k-- > 0) { const live = S.s.filter(s => s.n > 0); if (!live.length) { S.t = now; break; } const s = live[Math.floor(Math.random() * live.length)]; s.n--; S.g += s.p; S.n = (S.n || 0) + 1; sold++; }
 S.s = S.s.filter(s => s.n > 0); return sold; }
function shopPrice(id) { const I = ITEMS[id]; return Math.max(1, Math.round(I.price * (I.ofjob || I.plato ? 0.9 : 0.6))); }
function openHomeShop() { const P = G.P, S = homeShopState(), sold = shopTick();
 const sellable = P.inv.map((s, i) => [s, i]).filter(([s]) => { const I = ITEMS[s.id]; return I && I.t !== 'quest' && I.t !== 'cos' && (I.ofjob || I.plato || I.t === 'mat' || I.t === 'cons'); });
 openModal(`<h2>${iconHTML(['coin'], 22)} ${L2('Tu tienda', 'Your shop')}</h2><p class="hint">${L2('Pon productos a la venta: los vecinos pasan y compran solos, aunque no estés jugando. Los productos de oficio y los platos se venden a casi todo su valor (el resto, al 60 %). Comercio vende más rápido.', 'Put goods on sale: neighbours come by and buy on their own, even while you are away. Crafted goods and dishes sell at nearly full value (the rest at 60%). Trading sells faster.')}</p>
  ${sold ? `<p class="hint">🛒 ${L2('Has vendido', 'You sold')} ${sold} ${L2('cosas desde tu última visita.', 'items since your last visit.')}</p>` : ''}
  <div class="goldline">${iconHTML(['coin'], 16)} ${L2('En la caja', 'In the till')}: <b>${fmt(S.g)}</b> <button class="btn sm gold" id="shG" ${S.g ? '' : 'disabled'}>${L2('Cobrar', 'Collect')}</button></div>
  <h4>${L2('A la venta', 'On sale')} (${S.s.length}/${SHOP_SLOTS})</h4><div class="slist">${S.s.map((s, i) => `<div class="srow">${iconHTML(ITEMS[s.id].icon, 26)}<div class="sn"><b>${s.n} × ${esc(ITEMS[s.id].n)}</b><small>${fmt(s.p)} ${L2('cada uno', 'each')}</small></div><button class="btn sm" data-shr="${i}">${L2('Retirar', 'Remove')}</button></div>`).join('') || `<p class="hint">${L2('Nada a la venta.', 'Nothing on sale.')}</p>`}</div>
  <h4>${L2('Tu inventario', 'Your inventory')}</h4><div class="slist">${sellable.slice(0, 40).map(([s, i]) => `<div class="srow">${iconHTML(ITEMS[s.id].icon, 26)}<div class="sn"><b>${esc(ITEMS[s.id].n)} ×${s.q || 1}</b><small>${fmt(shopPrice(s.id))} ${L2('cada uno', 'each')}</small></div><button class="btn sm" data-sha="${i}" ${S.s.length >= SHOP_SLOTS && !S.s.find(x => x.id === s.id) ? 'disabled' : ''}>${L2('Poner', 'Stock')}</button></div>`).join('')}</div>
  <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = closeModal;
 const g = $('#shG'); if (g) g.onclick = () => { P.gold += S.g; floatText(P.x, P.y - 40, '+' + fmt(S.g) + ' ' + L2('ORO', 'GOLD'), '#ffd040'); S.g = 0; sfx('coin'); markDirty(true); openHomeShop(); };
 $$('#modal [data-shr]').forEach(b => b.onclick = () => { const s = S.s[+b.dataset.shr]; if (s) { giveItem(s.id, s.n); S.s.splice(+b.dataset.shr, 1); } markDirty(true); openHomeShop(); });
 $$('#modal [data-sha]').forEach(b => b.onclick = () => { const st = P.inv[+b.dataset.sha]; if (!st) return; const id = st.id, n = st.q || 1; let slot = S.s.find(x => x.id === id); if (!slot) { if (S.s.length >= SHOP_SLOTS) return; slot = { id, n: 0, p: shopPrice(id) }; S.s.push(slot); }
  if (!S.s.some(x => x.n > 0)) S.t = Date.now(); takeItem(id, n); slot.n += n; markDirty(true); openHomeShop(); }); }
FURN_ACT.of_of_tienda = [L2('Tu tienda', 'Your shop'), 'coin', () => openHomeShop()];

// ---------- títulos nuevos ----------
const OF_TITLES = [
 ['t_artesano', L2('Artesano', 'Artisan'), 'natural', P => Object.keys(JOBS).some(k => (P.jobs[k] || {}).lv >= 50), L2('Sube un oficio a nivel 50.', 'Raise a job to level 50.')],
 ['t_gran_maestro', L2('Gran Maestro Artesano', 'Grand Master Artisan'), 'oro', P => Object.keys(JOBS).some(k => (P.jobs[k] || {}).lv >= 75), L2('Sube un oficio a nivel 75.', 'Raise a job to level 75.')],
 ['t_gremio', L2('Orgullo del Gremio', 'Pride of the Guild'), 'astral', P => Object.keys(JOBS).filter(k => (P.jobs[k] || {}).lv >= 50).length >= 10, L2('Ten 10 oficios a nivel 50.', 'Have 10 jobs at level 50.')],
 ['t_tendero', L2('Tendero del Barrio', 'Neighbourhood Grocer'), 'plata', P => ((P.ofx || {}).shop || {}).n >= 100, L2('Vende 100 cosas en tu tienda.', 'Sell 100 items in your shop.')],
 ['t_curador', L2('Mecenas del Museo', 'Museum Patron'), 'hielo', P => Object.keys((P.ofx || {}).musDone || {}).length >= 1, L2('Completa una colección del Museo de Albor.', 'Complete an Albor Museum collection.')],
 ['t_campeon_of', L2('Campeón de Oficios', 'Crafts Champion'), 'fuego', P => ((P.ofx || {}).torW || 0) >= 5, L2('Gana 5 torneos de oficios.', 'Win 5 crafts tournaments.')],
];
for (const t of OF_TITLES) { TITLES.push(t); TIT_ID[t[0]] = t; }

// ---------- Museo de Albor ----------
const MUSEUM = [
 ['peces', L2('Peces de los reinos', 'Fish of the realms'), ['sardina', 'trucha', 'carpa', 'lubina', 'salmon', 'perca', 'pezglobo', 'anguila', 'lucio', 'pezespada', 'truchadorada', 'pezluna', 'pezhielo', 'pezlinterna', 'atunreal', 'koi', 'pezdragon', 'pezoasis', 'piranha', 'arapaima'], 20000],
 ['hallazgos', L2('Hallazgos y reliquias', 'Finds and relics'), ['moneda_antigua', 'reliquia1', 'reliquia2', 'reliquia3', 'reliquia4', ...FINDS.map(f => f[0])], 40000],
 ['gemas', L2('Gemas y tesoros del mar', 'Gems and sea treasures'), ['rubi', 'zafiro', 'esmeralda', 'amatista', 'diamante', 'opalo', 'perla', 'perla_negra', 'coral', 'concha'], 30000],
 ['obras', L2('Obras maestras de oficio', 'Craft masterpieces'), Object.keys(OF_PROD).filter(id => /^ofp_obra_/.test(id)), 80000],
 ['granja', L2('Despensa de la granja', 'Farm pantry'), ['trigo', 'zanahoria', 'tomate', 'calabaza', 'uva', 'melon', 'frutaestelar', 'ig_huevo', 'ig_leche', 'ig_queso', 'ofm_lana', 'ofm_miel', 'ofm_trufa'], 25000],
];
for (const [k, n] of MUSEUM) { const key = 'of_mus_' + k; BK[key] = { n: L2('Estatua del museo: ', 'Museum statue: ') + n, f: 'of_' + key, cost: [['piedra', 2]], gold: 0, tool: 'tala', tier: 1, cat: 'deco', L: 1, ofs: ['statue', '#ffd040', '#5a8ad0'], musOnly: 1 }; BK_KEYS.push(key); it('bk_' + key, { n: BK[key].n, t: 'mat', bk: key, stack: true, tier: 1, price: 5, icon: ['bk', key] }); }
{ const _cc = bkCanCraft; bkCanCraft = function (b, n) { if (b && b.musOnly) return false; return _cc.apply(this, arguments); }; }
NPCS.curadora_museo = { n: L2('Curadora Elvira', 'Curator Elvira'), title: L2('Museo de Albor', 'Albor Museum'), look: LK({ hair: HAIRS.blanco, hairStyle: 'long', outfit: 'robe', main: CLOTH.marino, sec: CLOTH.beige, eyes: 'azul' }), lines: [L2('Albor fue un observatorio. Ahora guardamos lo que el mundo hace con sus manos.', 'Albor was an observatory. Now we keep what the world makes with its hands.'), L2('Cada pieza que donas la verá alguien mañana.', 'Someone will see every piece you donate tomorrow.')] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); const t = TOWNS.find(t => t.k === 'albor'); if (t) { const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 - 7, (t.y0 + t.y1) / 2 - 4); W.npcDefs.push({ id: 'curadora_museo', x, y, face: 'down' }); } }; }
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'curadora_museo') opts.unshift({ label: L2('Colecciones del museo', 'Museum collections'), icon: ['book'], fn: () => { closeDialog(); openAlborMuseum(); } }); });
function openAlborMuseum() { const P = G.P, O = ofx(); O.mus2 = O.mus2 || {}; O.musDone = O.musDone || {};
 openModal(`<h2>${iconHTML(['book'], 22)} ${L2('Museo de Albor', 'Albor Museum')}</h2><p class="hint">${L2('Dona una pieza de cada para completar una colección. Al completarla: oro, un título y una estatua para tu casa.', 'Donate one of each piece to complete a collection. When complete: gold, a title and a statue for your home.')}</p>
  ${MUSEUM.map(([k, n, ids, gold]) => { const have = O.mus2[k] || {}, c = ids.filter(id => have[id]).length;
   return `<h4>${esc(n)} · ${c}/${ids.length}${O.musDone[k] ? ' ✓' : ''}</h4><div class="chips">${ids.map(id => { const I = ITEMS[id]; if (!I) return ''; const can = !have[id] && countItem(id) > 0;
    return `<button class="chip ${have[id] ? 'on' : ''}" ${can ? `data-mud="${k}:${id}"` : 'disabled'} title="${esc(I.n)}" style="${have[id] ? '' : can ? 'border-color:#ffd040' : 'opacity:.45'}">${iconHTML(I.icon, 20)}</button>`; }).join('')}</div>
    <small class="hint">${L2('Premio', 'Reward')}: ${fmt(gold)} ${L2('oro', 'gold')}</small>`; }).join('')}
  <p class="hint">${L2('Borde dorado: lo tienes en el inventario y puedes donarlo.', 'Gold border: you have it and can donate it.')}</p><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = closeModal;
 $$('#modal [data-mud]').forEach(b => b.onclick = () => { const [k, id] = b.dataset.mud.split(':'), M = MUSEUM.find(m => m[0] === k); if (!M || countItem(id) < 1) return; takeItem(id, 1); (O.mus2[k] = O.mus2[k] || {})[id] = 1; sfx('coin');
  if (!O.musDone[k] && M[2].every(x => O.mus2[k][x])) { O.musDone[k] = 1; P.gold += M[3]; giveItem('bk_of_mus_' + k, 1); banner('🏛 ' + L2('¡Colección completa!', 'Collection complete!'), M[1]); }
  markDirty(true); openAlborMuseum(); }); }

// ---------- caravanas comerciales ----------
const CARAVAN_ROUTES = [['corta', L2('Ruta corta (Albor - Puerto)', 'Short route (Albor - Port)'), 10, 1.35, 0.05], ['media', L2('Ruta del desierto', 'Desert route'), 30, 1.6, 0.12], ['larga', L2('Ruta de los cinco reinos', 'Five realms route'), 90, 2, 0.25]];
const CARAVAN_RARE = ['perla', 'esmeralda', 'diamante', 'ofm_trufa', 'reliquia2', 'seda', 'pluma_alba'];
function openCaravan() { const P = G.P, O = ofx(), C_ = O.car;
 if (C_) { const left = C_.end - Date.now();
  if (left > 0) { openModal(`<h2>🐫 ${L2('Caravana en camino', 'Caravan on the road')}</h2><p class="hint">${L2('Vuelve en', 'Back in')} ${Math.ceil(left / 60000)} ${L2('minutos (cuenta aunque no juegues).', 'minutes (it counts even while you are away).')}</p><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party'); $('#mclose').onclick = closeModal; return; }
  const R = CARAVAN_ROUTES.find(r => r[0] === C_.r) || CARAVAN_ROUTES[0], gold = Math.round(C_.v * R[3]); P.gold += gold; let extra = '';
  if (Math.random() < R[4]) { const id = pick(CARAVAN_RARE); giveItem(id, 1); extra = ' + ' + ITEMS[id].n; }
  gainJobXp('comercio', 30 + Math.round(C_.v / 200)); delete O.car; markDirty(true); sfx('coin');
  openModal(`<h2>🐫 ${L2('¡La caravana ha vuelto!', 'The caravan is back!')}</h2><p class="hint">${L2('Has ganado', 'You earned')} <b>${fmt(gold)}</b> ${L2('oro', 'gold')}${esc(extra)}.</p><div class="row"><button class="btn gold" id="mclose">${L2('Genial', 'Great')}</button></div>`, 'party'); $('#mclose').onclick = closeModal; return; }
 const goods = P.inv.map((s, i) => [s, i]).filter(([s]) => ITEMS[s.id] && (ITEMS[s.id].ofjob || ITEMS[s.id].plato || /^ofm_/.test(s.id)));
 const sel = openCaravan.sel = openCaravan.sel || {}; const val = goods.reduce((a, [s, i]) => a + (sel[i] ? ITEMS[s.id].price * (s.q || 1) : 0), 0);
 openModal(`<h2>🐫 ${L2('Caravana comercial', 'Trade caravan')}</h2><p class="hint">${L2('Elige productos de oficio, platos o productos de granja y una ruta. La caravana los vende lejos y vuelve con más oro; en las rutas largas, a veces con algo raro.', 'Choose crafted goods, dishes or farm goods and a route. The caravan sells them far away and comes back with more gold; on long routes, sometimes with something rare.')}</p>
  <div class="chips">${goods.map(([s, i]) => `<button class="chip ${sel[i] ? 'on' : ''}" data-cvs="${i}">${iconHTML(ITEMS[s.id].icon, 16)} ${esc(ITEMS[s.id].n)} ×${s.q || 1}</button>`).join('') || `<span class="hint">${L2('No tienes productos.', 'You have no goods.')}</span>`}</div>
  <p class="hint">${L2('Valor de la carga', 'Cargo value')}: <b>${fmt(val)}</b></p>
  <div class="slist">${CARAVAN_ROUTES.map(r => `<div class="srow"><div class="sn"><b>${esc(r[1])}</b><small>${r[2]} min · ×${r[3]} · ${Math.round(r[4] * 100)} % ${L2('de rareza', 'rare chance')}</small></div><button class="btn sm gold" data-cvr="${r[0]}" ${val ? '' : 'disabled'}>${L2('Enviar', 'Send')}</button></div>`).join('')}</div>
  <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = () => { openCaravan.sel = {}; closeModal(); };
 $$('#modal [data-cvs]').forEach(b => b.onclick = () => { const i = +b.dataset.cvs; sel[i] = !sel[i]; openCaravan(); });
 $$('#modal [data-cvr]').forEach(b => b.onclick = () => { const R = CARAVAN_ROUTES.find(r => r[0] === b.dataset.cvr); let v = 0; const take = goods.filter(([s, i]) => sel[i]).map(([s]) => [s.id, s.q || 1]);
  for (const [id, n] of take) { v += ITEMS[id].price * n; takeItem(id, n); } openCaravan.sel = {}; O.car = { r: R[0], v, end: Date.now() + R[2] * 60000 }; markDirty(true); toast('🐫 ' + L2('¡La caravana ha salido!', 'The caravan has left!'), 'quest'); closeModal(); }); }
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'caravanero' || /^gremio_/.test(npc.id || '')) opts.push({ label: L2('Caravana comercial', 'Trade caravan'), icon: ['coin'], fn: () => { closeDialog(); openCaravan(); } }); });

// ---------- mercado entre jugadores ----------
// Presencia: o.mk = ofertas [[id, n, precio total]]; o.mkb = petición de compra [para, id, n, precio, nonce]; o.mkd = entregas [[para, nonce, ok, id, n]].
const MKT = { pend: null, done: [], seen: new Set() };
function mkOffers() { const O = ofx(); O.mk = (O.mk || []).filter(o => ITEMS[o[0]] && countItem(o[0]) >= 1); return O.mk; }
function mkValid(id, n, p) { const I = ITEMS[id]; return !!I && I.t !== 'quest' && !I.bound && Number.isInteger(n) && n >= 1 && n <= 999 && Number.isFinite(p) && p >= 1 && p <= 1e9; }
{ const _sp = socialPresence; socialPresence = function (o) { _sp.apply(this, arguments); try { const of = mkOffers(); if (of.length) o.mk = of.slice(0, 8);
  if (MKT.pend && Date.now() - MKT.pend.t0 < 25000) o.mkb = [MKT.pend.to, MKT.pend.id, MKT.pend.n, MKT.pend.p, MKT.pend.k];
  MKT.done = MKT.done.filter(d => Date.now() - d.t < 30000); if (MKT.done.length) o.mkd = MKT.done.map(d => [d.to, d.k, d.ok, d.id, d.n]); } catch (e) { } }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr.apply(this, arguments); try {
  r.mk = Array.isArray(pr.mk) ? pr.mk.filter(o => Array.isArray(o) && mkValid(o[0], o[1] | 0, +o[2])).slice(0, 8).map(o => [o[0], o[1] | 0, +o[2]]) : [];
  // alguien me compra
  const b = pr.mkb; if (Array.isArray(b) && b[0] === NET.myId && typeof b[4] === 'string' && !MKT.seen.has(r.id + b[4])) { MKT.seen.add(r.id + b[4]);
   const [, id, n, p, k] = b, O = ofx(), off = (O.mk || []).find(o => o[0] === id && o[1] >= n && Math.round(o[2] * n / o[1]) === p), ok = !!off && mkValid(id, n, p) && countItem(id) >= n;
   if (ok) { takeItem(id, n); G.P.gold += p; off[1] -= n; off[2] = Math.round(off[2] * off[1] / (off[1] + n)); O.mk = O.mk.filter(o => o[1] > 0); toast('🛒 ' + r.name + L2(' te ha comprado ', ' bought ') + n + ' ' + ITEMS[id].n + ' (+' + fmt(p) + ')', 'loot', 4); markDirty(true); }
   MKT.done.push({ to: r.id, k, ok: ok ? 1 : 0, id, n, t: Date.now() }); netPresence(true); }
  // me entregan lo que compré
  if (Array.isArray(pr.mkd) && MKT.pend) for (const d of pr.mkd) if (Array.isArray(d) && d[0] === NET.myId && d[1] === MKT.pend.k && r.id === MKT.pend.to) { const q = MKT.pend; MKT.pend = null;
   if (d[2] === 1) { giveItem(q.id, q.n); toast('📦 ' + L2('Compra recibida: ', 'Purchase received: ') + q.n + ' ' + ITEMS[q.id].n, 'loot', 4); } else { G.P.gold += q.p; toast(L2('La oferta ya no estaba. Te devolvemos el oro.', 'The offer was gone. Your gold is refunded.'), 'warn'); }
   markDirty(true); break; }
 } catch (e) { } }; }
V33_TICKS.push(() => { if (MKT.pend && Date.now() - MKT.pend.t0 > 25000) { G.P.gold += MKT.pend.p; MKT.pend = null; toast(L2('El vendedor no respondió. Te devolvemos el oro.', 'The seller did not answer. Your gold is refunded.'), 'warn'); } });
function openMarket() { const P = G.P, O = ofx(), mine = mkOffers(), others = [...G.remote.values()].filter(r => r.id && (r.mk || []).length);
 const sellable = P.inv.map((s, i) => [s, i]).filter(([s]) => { const I = ITEMS[s.id]; return I && I.t !== 'quest' && I.t !== 'cos' && !I.bound; });
 openModal(`<h2>🛒 ${L2('Mercado entre jugadores', 'Player market')}</h2><p class="hint">${L2('Pon ofertas y los jugadores conectados contigo (WiFi u online) te las compran. El oro se cobra solo cuando el vendedor entrega.', 'Post offers and players connected with you (WiFi or online) can buy them. Gold changes hands only when the seller delivers.')}</p>
  ${netOnline() ? '' : `<p class="hint" style="color:#ffb0a0">${L2('No estás conectado con nadie: tus ofertas se verán cuando te conectes.', 'You are not connected to anyone: your offers will show once you connect.')}</p>`}
  <h4>${L2('Ofertas de otros jugadores', 'Other players’ offers')}</h4><div class="slist">${others.map(r => r.mk.map((o, i) => `<div class="srow">${iconHTML(ITEMS[o[0]].icon, 26)}<div class="sn"><b>${o[1]} × ${esc(ITEMS[o[0]].n)}</b><small>${esc(r.name)} · ${fmt(o[2])} ${L2('oro', 'gold')}</small></div><button class="btn sm gold" data-mkb="${esc(r.peer)}|${i}" ${MKT.pend || P.gold < o[2] ? 'disabled' : ''}>${L2('Comprar', 'Buy')}</button></div>`).join('')).join('') || `<p class="hint">${L2('Nadie vende nada ahora mismo.', 'Nobody is selling right now.')}</p>`}</div>
  <h4>${L2('Tus ofertas', 'Your offers')} (${mine.length}/8)</h4><div class="slist">${mine.map((o, i) => `<div class="srow">${iconHTML(ITEMS[o[0]].icon, 26)}<div class="sn"><b>${o[1]} × ${esc(ITEMS[o[0]].n)}</b><small>${fmt(o[2])} ${L2('oro', 'gold')}</small></div><button class="btn sm" data-mkr="${i}">${L2('Quitar', 'Remove')}</button></div>`).join('')}</div>
  <h4>${L2('Ofrecer', 'Offer')}</h4><div class="slist">${sellable.slice(0, 30).map(([s, i]) => { const I = ITEMS[s.id], n = s.q || 1; return `<div class="srow">${iconHTML(I.icon, 24)}<div class="sn"><b>${esc(I.n)} ×${n}</b><small>${L2('Precio justo', 'Fair price')}: ${fmt(I.price * n)}</small></div><button class="btn sm" data-mka="${i}" ${mine.length >= 8 ? 'disabled' : ''}>${L2('Ofrecer', 'Offer')}</button></div>`; }).join('')}</div>
  <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = closeModal;
 $$('#modal [data-mkr]').forEach(b => b.onclick = () => { O.mk.splice(+b.dataset.mkr, 1); netPresence(true); markDirty(true); openMarket(); });
 $$('#modal [data-mka]').forEach(b => b.onclick = () => { const s = P.inv[+b.dataset.mka]; if (!s) return; const n = s.q || 1, I = ITEMS[s.id]; O.mk = mkOffers(); O.mk.push([s.id, n, Math.max(1, I.price * n)]); netPresence(true); markDirty(true); openMarket(); });
 $$('#modal [data-mkb]').forEach(b => b.onclick = () => { const [peer, i] = b.dataset.mkb.split('|'), r = G.remote.get(peer), o = r && r.mk[+i]; if (!o || MKT.pend || P.gold < o[2]) return;
  P.gold -= o[2]; MKT.pend = { to: r.id, id: o[0], n: o[1], p: o[2], k: Math.random().toString(36).slice(2, 10), t0: Date.now() }; netPresence(true); toast(L2('Pedido enviado al vendedor…', 'Order sent to the seller…'), 'quest'); closeModal(); }); }
DLG_HOOKS.push((npc, opts) => { if (/^gremio_/.test(npc.id || '')) opts.push({ label: L2('Mercado entre jugadores', 'Player market'), icon: ['users'], fn: () => { closeDialog(); openMarket(); } }); });

// ---------- torneo de oficios ----------
const TOR_JOBS = ['tala', 'mineria', 'pesca', 'herbo'], TOR_TIME = 120;
const TOR = { on: false, t: 0, n: 0, job: null };
function torJob() { return TOR_JOBS[calDay() % TOR_JOBS.length]; }
function torRivals() { const d = calDay(); return [[L2('Sauce la Leñadora', 'Willow the Woodcutter'), 9 + d % 4], [L2('Brok Picahondo', 'Brok Deepdelve'), 6 + (d * 3) % 5], [L2('Aprendiz Tomi', 'Apprentice Tomi'), 3 + d % 3]]; }
{ const _gj = gainJobXp; gainJobXp = function (job, n) { if (TOR.on && job === TOR.job) { TOR.n++; mgHud(`🏆 ${esc(JOBS[job].n)}: <b>${TOR.n}</b> · ${Math.ceil(TOR_TIME - TOR.t)} s`); } return _gj.apply(this, arguments); }; }
V33_TICKS.push(dt => { if (!TOR.on) return; TOR.t += dt || 0; if (Math.floor(TOR.t * 4) !== Math.floor((TOR.t - (dt || 0)) * 4)) mgHud(`🏆 ${esc(JOBS[TOR.job].n)}: <b>${TOR.n}</b> · ${Math.max(0, Math.ceil(TOR_TIME - TOR.t))} s`); if (TOR.t >= TOR_TIME) torEnd(); });
function torEnd() { const P = G.P, O = ofx(); TOR.on = false; mgHud(''); const day = calDay(); O.tor = O.tor && O.tor.d === day ? O.tor : { d: day, j: TOR.job, b: 0 };
 const best = Math.max(O.tor.b, TOR.n); O.tor.b = best; const rivals = torRivals(), beat = rivals.filter(r => TOR.n > r[1]).length;
 const prize = [100, 600, 1500, 4000][beat]; P.gold += prize; if (beat === 3) { O.torW = (O.torW || 0) + 1; giveItem('ofm_medalla', 1); }
 gainJobXp(TOR.job, 50 * (beat + 1)); markDirty(true); netPresence(true);
 openModal(`<h2>🏆 ${L2('Fin del torneo', 'Tournament over')}</h2><p class="hint">${L2('Tu marca', 'Your score')}: <b>${TOR.n}</b> · ${L2('Premio', 'Prize')}: ${fmt(prize)} ${L2('oro', 'gold')}${beat === 3 ? ' + ' + ITEMS.ofm_medalla.n : ''}</p><div class="row"><button class="btn gold" id="mclose">OK</button></div>`, 'party'); $('#mclose').onclick = closeModal; }
{ const _sp = socialPresence; socialPresence = function (o) { _sp.apply(this, arguments); const T = (G.P && G.P.ofx || {}).tor; if (T && T.d === calDay()) o.tor = [T.d, T.j, T.b]; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr.apply(this, arguments); r.tor = Array.isArray(pr.tor) && TOR_JOBS.includes(pr.tor[1]) ? [pr.tor[0] | 0, pr.tor[1], clamp(pr.tor[2] | 0, 0, 999)] : null; }; }
function openTournament() { const P = G.P, O = ofx(), job = torJob(), day = calDay(), mine = O.tor && O.tor.d === day ? O.tor.b : 0;
 const board = torRivals().map(([n, s]) => [n, s, 0]).concat([...G.remote.values()].filter(r => r.tor && r.tor[0] === day && r.tor[1] === job).map(r => [r.name, r.tor[2], 1]), [[P.name, mine, 2]]).sort((a, b) => b[1] - a[1]);
 openModal(`<h2>🏆 ${L2('Torneo de oficios', 'Crafts tournament')}</h2><p class="hint">${L2('Reto de hoy', "Today's challenge")}: <b>${esc(JOBS[job].n)}</b>. ${L2('Tienes 2 minutos para trabajar todo lo que puedas en ese oficio. Gana a los tres rivales del gremio para llevarte la medalla; tus amigos conectados también salen en la tabla.', 'You have 2 minutes to work as much as you can at that job. Beat the three guild rivals to win the medal; your connected friends also appear on the board.')}</p>
  <div class="slist">${board.map(([n, s, me], i) => `<div class="srow"><div class="sn"><b>${i + 1}. ${esc(n)}${me === 2 ? ' ★' : me ? ' 🌐' : ''}</b></div><b>${s}</b></div>`).join('')}</div>
  <div class="row"><button class="btn gold" id="torGo" ${TOR.on ? 'disabled' : ''}>${L2('¡Empezar!', 'Start!')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = closeModal; $('#torGo').onclick = () => { Object.assign(TOR, { on: true, t: 0, n: 0, job }); closeModal(); toast('🏆 ' + L2('¡Ya! Trabaja en ', 'Go! Work at ') + JOBS[job].n, 'quest', 3); }; }
DLG_HOOKS.push((npc, opts) => { if (/^gremio_/.test(npc.id || '')) opts.push({ label: L2('Torneo de oficios', 'Crafts tournament'), icon: ['star', '#ffd040'], fn: () => { closeDialog(); openTournament(); } }); });
