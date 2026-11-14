// ================= v4.33: PUEBLOS VIVOS =================
// Tablón del pueblo en cada plaza (periódico, rumores, mercado de mercancías, ayuntamiento y bazar), prosperidad que sube
// si ayudas y baja si ignoras los ataques (casas abandonadas / tienda nueva), alcalde con impuestos, Día del Tributo
// (no se puede desactivar), oficio Comercio y vecinos que recuerdan que los salvaste.
SAVEKEYS.push('pv');
const PV_TOWNS = ['albor', 'puerto', 'arxar', 'sahrim', 'yarakai', 'brasa'];
// mercancías: [id, es, en, precio base, color]
const PV_GOODS = [['sal', 'Sal', 'Salt', 30, '#f0f0f8'], ['especias', 'Especias', 'Spices', 80, '#d8602a'], ['seda', 'Seda', 'Silk', 140, '#d860c0'], ['cafe', 'Café', 'Coffee', 60, '#6a3a1a'],
  ['cacao', 'Cacao', 'Cocoa', 70, '#9a5a2a'], ['vino', 'Vino', 'Wine', 90, '#8a1a3a'], ['pieles', 'Pieles', 'Furs', 110, '#b08a5a'], ['cristal', 'Cristales', 'Crystals', 180, '#8ad8ff']];
const PV_TRADE = { albor: [['vino'], ['especias', 'seda']], puerto: [['sal', 'seda'], ['pieles', 'cafe']], arxar: [['pieles'], ['vino', 'cacao']],
  sahrim: [['especias'], ['sal', 'vino']], yarakai: [['cafe', 'cacao'], ['cristal', 'sal']], brasa: [['cristal'], ['cafe', 'pieles']] };
const PV_TAX = [['bajo', 'Bajos', 'Low', 0.6, 3, 1], ['normal', 'Normales', 'Normal', 1, 0, 0], ['alto', 'Altos', 'High', 1.5, -4, -1]]; // [id, es, en, ingreso, reputación/día, prosperidad/día]
const PV_BAZAR = ['pocion3', 'pocion4', 'elixir', 'food3', 'food4'];

function pv() { const P = G.P; const o = P.pv = P.pv || {}; o.pros = o.pros || {}; o.mayor = o.mayor || {}; o.tr = o.tr || {}; o.saved = o.saved || []; o.log = o.log || []; return o; }
function pvPros(tk) { const v = pv().pros[tk]; return v === undefined ? 50 : v; }
function pvAddPros(tk, d, why) { if (!tk || !PV_TOWNS.includes(tk)) return; const o = pv(), a = pvPros(tk), b = clamp(a + d, 0, 100); o.pros[tk] = b;
  if (a >= 25 && b < 25) pvLog(L2('Varias familias abandonan ', 'Several families leave ') + townName(tk) + L2(': hay casas vacías.', ': there are empty houses.'), tk, 'bad', 1);
  if (a < 25 && b >= 25) pvLog(L2('Las familias vuelven a ', 'Families return to ') + townName(tk) + '.', tk, 'good', 1);
  if (a < 75 && b >= 75) pvLog(L2('¡Abre un bazar nuevo en ', 'A new bazaar opens in ') + townName(tk) + L2('! Búscalo en el tablón de la plaza.', '! Find it on the plaza board.'), tk, 'good', 1);
  if (why && Math.abs(d) >= 5) floatText(G.P.x, G.P.y - 52, (d > 0 ? '+' : '') + d + ' ' + L2('prosperidad', 'prosperity'), d > 0 ? '#8aff8a' : '#ff8a6a'); }
function pvLog(txt, tk, kind, loud) { const o = pv(); o.log.unshift({ d: calDay(), txt, tk: tk || '', kind: kind || '' }); o.log = o.log.slice(0, 40); if (loud) toast(txt, kind === 'bad' ? 'warn' : 'quest', 6); }
function pvTownAt(x, y) { if (!G.map || !G.map.isWorld) return null; const tx = x / 16, ty = y / 16; const t = TOWNS.find(t => PV_TOWNS.includes(t.k) && tx >= t.x0 - 1 && tx <= t.x1 + 1 && ty >= t.y0 - 1 && ty <= t.y1 + 1); return t ? t.k : null; }
function pvTier(tk) { return 1 + (TOWN_LV[tk] !== undefined ? TOWN_LV[tk] : 60) / 40; }

// ---------- mercancías ----------
function pvGood(id) { return PV_GOODS.find(g => g[0] === id); }
function pvCap() { return 30 + jobPerkSum('trCap'); }
function pvLoad() { const t = pv().tr; let n = 0; for (const k in t) n += t[k] | 0; return n; }
function pvPrice(tk, id) {
  const g = pvGood(id), gi = PV_GOODS.indexOf(g), T_ = PV_TRADE[tk] || [[], []], day = calDay(), s = calDate().season, P = G.P;
  let p = g[3] * (1 + P.lv / 50) * (T_[0].includes(id) ? 0.6 : T_[1].includes(id) ? 1.6 : 1) * (0.8 + 0.4 * hash2(day, gi, PV_TOWNS.indexOf(tk) + 3));
  if ((s === 0 && id === 'pieles') || (s === 2 && id === 'vino') || (s === 3 && id === 'cafe') || (s === 1 && id === 'seda')) p *= 1.25;
  if (evActive('festival', tk) && (id === 'vino' || id === 'cacao')) p *= 1.4; if (evActive('asalto', tk) || evActive('horda', tk)) p *= 1.15;
  return Math.max(1, Math.round(p));
}
function pvSell(tk, id) { return Math.round(pvPrice(tk, id) * (1 + jobPerkSum('trPrice') / 100)); }
function pvBuy(tk, id) { return Math.round(pvPrice(tk, id) * 1.2); }
function pvMult(tk, id) { const g = pvGood(id); return pvPrice(tk, id) / (g[3] * (1 + G.P.lv / 50)); }
function pvBest(tk, n) { return PV_GOODS.map(g => [g, pvMult(tk, g[0])]).sort((a, b) => b[1] - a[1]).slice(0, n || 2); }
function pvTrade(tk, id, buy, q) {
  const P = G.P, o = pv(), have = o.tr[id] | 0; q = q | 0; if (q <= 0) return;
  if (buy) { const room = pvCap() - pvLoad(), price = pvBuy(tk, id); q = Math.min(q, room, Math.floor(P.gold / price)); if (q <= 0) { toast(room <= 0 ? L2('Tu carga está llena', 'Your cargo is full') : L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; }
    P.gold -= q * price; o.tr[id] = have + q; sfx('coin'); }
  else { q = Math.min(q, have); if (q <= 0) return; const price = pvSell(tk, id), m = pvMult(tk, id); P.gold += q * price; o.tr[id] = have - q; if (!o.tr[id]) delete o.tr[id]; sfx('coin');
    floatText(P.x, P.y - 40, '+' + fmt(q * price) + ' ' + L2('oro', 'gold'), '#ffd040');
    if (P.jobs && P.jobs.comercio) gainJobXp('comercio', Math.max(1, Math.round(q * (m >= 1.4 ? 3 : m >= 1.1 ? 2 : 0.5))));
    o.sold = (o.sold || 0) + q; if (m >= 1.3) { o.trSold = (o.trSold || {}); o.trSold[tk] = (o.trSold[tk] || 0) + q; if (o.trSold[tk] >= 10) { o.trSold[tk] -= 10; pvAddPros(tk, 2); } } }
  markDirty();
}
UI_ICONS.push(...PV_GOODS.map(g => 'pvg:' + g[0]), 'pvg:tablon', 'pvg:alcalde');
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'pvg') return _gi(spec); const p = new Pix(16, 16), k = spec[1], g = pvGood(k), D = C, OUTC = D('#2a1a10');
  if (k === 'tablon') { p.rect(2, 2, 12, 9, WOOD[3]); p.rect(3, 3, 5, 6, D('#f4ecd8')); p.rect(9, 3, 4, 4, D('#f4ecd8')); p.hl(4, 4, 3, D('#6a5a4a')); p.hl(4, 6, 3, D('#6a5a4a')); p.vl(4, 11, 4, WOOD[2]); p.vl(11, 11, 4, WOOD[2]); p.set(11, 4, D('#d83a3a')); }
  else if (k === 'alcalde') { p.rect(3, 8, 10, 6, D('#d8d0c0')); for (const x of [4, 7, 10]) p.vl(x, 8, 6, D('#a8a090')); p.poly([[2, 8], [8, 3], [14, 8]], D('#c83a2a')); p.rect(7, 1, 1, 3, D('#ffd040')); p.rect(8, 1, 3, 2, D('#ffd040')); }
  else if (k === 'sal') { p.ell(8, 11, 5, 3, D('#c8c8d8')); p.ell(8, 9, 4, 3, D('#f8f8ff')); p.rect(4, 11, 9, 3, D('#8a6a4a')); }
  else if (k === 'especias') { p.rect(4, 6, 8, 8, D('#a07a4a')); p.ell(8, 6, 4, 2, D('#d8602a')); p.set(7, 5, D('#ffb040')); p.set(9, 6, D('#a02a1a')); p.hl(4, 10, 8, D('#7a5a2a')); }
  else if (k === 'seda') { p.rect(3, 4, 10, 8, D('#d860c0')); p.hl(3, 6, 10, D('#f8a0e8')); p.hl(3, 9, 10, D('#a03a90')); p.ell(3, 8, 1.5, 4, D('#8a2a7a')); }
  else if (k === 'cafe') { p.rect(4, 4, 8, 10, D('#c8a070')); p.hl(4, 7, 8, D('#8a6a3a')); p.ell(7, 10, 1.5, 1, D('#4a2a10')); p.ell(10, 11, 1.5, 1, D('#4a2a10')); p.ell(8, 4, 4, 1.5, D('#a07a4a')); }
  else if (k === 'cacao') { p.ell(8, 8, 4, 6, D('#9a5a2a')); p.vl(8, 3, 11, D('#6a3a1a')); p.vl(6, 4, 9, D('#c87a3a')); p.set(8, 1, D('#3a6a1a')); }
  else if (k === 'vino') { p.rect(6, 2, 4, 3, D('#2a4a2a')); p.rect(5, 5, 6, 9, D('#3a5a3a')); p.rect(6, 8, 4, 4, D('#f0e8c8')); p.set(7, 9, D('#8a1a3a')); p.vl(6, 6, 2, D('#6a8a6a')); }
  else if (k === 'pieles') { p.poly([[3, 4], [13, 4], [12, 13], [8, 11], [4, 13]], D('#b08a5a')); p.hl(5, 6, 6, D('#d8b080')); p.set(6, 9, D('#7a5a3a')); p.set(10, 8, D('#7a5a3a')); }
  else if (k === 'cristal') { p.poly([[8, 1], [12, 6], [8, 15], [4, 6]], D('#5ab0e8')); p.poly([[8, 1], [10, 6], [8, 13]], D('#a8e8ff')); p.set(7, 4, D('#ffffff')); }
  else if (g) p.ball(8, 8, 5, 5, pal([g[4], g[4], g[4], '#ffffff']));
  p.outline(OUTC); return p; }; }

// ---------- tablón en cada plaza ----------
{ const _ge = genFurn2; genFurn2 = function (kind) { if (kind !== 'pv_tablon') return _ge.apply(this, arguments);
  const p = new Pix(30, 38), Wd = WOOD, D = C; for (const x of [4, 24]) { p.rect(x, 12, 3, 25, Wd[1]); p.vl(x + 1, 12, 25, Wd[2]); }
  p.rect(2, 10, 26, 18, Wd[2]); p.rect(3, 11, 24, 16, Wd[3]); p.poly([[0, 10], [15, 2], [30, 10]], D('#8a2a1a')); p.hl(1, 10, 28, D('#5a1a10'));
  p.rect(5, 13, 9, 11, D('#f4ecd8')); p.hl(6, 14, 7, D('#2a2a2a')); for (let y = 16; y < 23; y += 2) p.hl(6, y, 7, D('#8a8070')); p.rect(16, 13, 9, 6, D('#f0e0a0')); p.hl(17, 15, 7, D('#6a5a3a')); p.rect(16, 20, 9, 5, D('#e0f0ff')); p.hl(17, 22, 6, D('#5a6a8a'));
  p.set(9, 13, D('#d83a3a')); p.set(20, 13, D('#3a7ad8')); p.set(20, 20, D('#3ad83a')); p.outline(D('#2a1408')); return { c: p.canvas(), ax: 15, ay: 37 }; }; }
function pvPlazaW(W, t) { const f = W.objs.find(o => (o.k === 'fountain' || o.k === 'well') && o.tx >= t.x0 && o.tx <= t.x1 && o.ty >= t.y0 && o.ty <= t.y1); return f ? [f.tx, f.ty] : [Math.round((t.x0 + t.x1) / 2), Math.round((t.y0 + t.y1) / 2)]; }
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  for (const tk of PV_TOWNS) { const t = TOWNS.find(t => t.k === tk); if (!t) continue; const [x, y] = pvPlazaW(W, t); putNear(W, 'pv_tablon', x + 3, y + 2, [[0, 0]], { xact: 'pv_board', tk }); } }; }
XACT.pv_board = [L2('Tablón del pueblo', 'Town board'), 'board', o => pvOpen(o.tk)];
function pvBoardLoc(tk) { const W = G.world; const o = W && W.objs.find(o => o.xact === 'pv_board' && (!tk || o.tk === tk)); return o ? [o.tx, o.ty] : null; }

// ---------- ventana del tablón ----------
let PV_TAB = 'news';
function pvOpen(tk, tab) {
  if (tab) PV_TAB = tab; const P = G.P, o = pv(), pr = pvPros(tk), M = o.mayor[tk], tabs = [['news', '📰 ' + L2('Noticias', 'News')], ['market', '⚖ ' + L2('Mercado', 'Market')], ['town', '🏛 ' + L2('Ayuntamiento', 'Town hall')]];
  if (pr >= 75) tabs.push(['bazar', '🛍 ' + L2('Bazar', 'Bazaar')]); if (!tabs.some(t => t[0] === PV_TAB)) PV_TAB = 'news';
  const prBar = `<i class="dbar"><b style="width:${pr}%;background:${pr < 25 ? '#d84a3a' : pr >= 75 ? '#ffd040' : '#6ad84a'}"></b></i>`;
  let body = '';
  if (PV_TAB === 'news') {
    const D = calDate(), rows = pvNews(tk).map(n => `<div class="news ${n.kind || ''}"><small>${n.d !== undefined ? esc(calDate(n.d).day + ' ' + calDate(n.d).mon.slice(0, 3)) : '·'}</small> ${esc(n.txt)}</div>`).join('');
    body = `<div class="pvPaper"><b>${L2('EL PREGONERO DE', 'THE HERALD OF')} ${esc(townName(tk).toUpperCase())}</b><small>${esc(D.wd)}, ${D.day} ${esc(D.mon)} · ${esc(D.sn)}</small></div>${rows}`;
  } else if (PV_TAB === 'market') {
    const rows = PV_GOODS.map(g => { const id = g[0], have = o.tr[id] | 0, m = pvMult(tk, id), tag = m >= 1.3 ? `<span style="color:#8aff8a">▲ ${L2('lo pagan bien', 'pays well')}</span>` : m <= 0.75 ? `<span style="color:#8ad0ff">▼ ${L2('se produce aquí', 'made here')}</span>` : '';
      return `<div class="srow">${iconHTML(['pvg', id], 28)}<div class="sn"><b>${esc(L2(g[1], g[2]))}</b><small>${L2('Compra', 'Buy')} ${fmt(pvBuy(tk, id))} · ${L2('Venta', 'Sell')} ${fmt(pvSell(tk, id))} · ${L2('llevas', 'carrying')} ${have} ${tag}</small></div><button class="btn sm" data-pvb="${id}">+5</button><button class="btn sm" data-pvs="${id}" ${have ? '' : 'disabled'}>${L2('Vender', 'Sell')}</button></div>`; }).join('');
    const tips = PV_TOWNS.filter(k => k !== tk).map(k => [k, pvBest(k, 1)[0]]).sort((a, b) => b[1][1] - a[1][1]).slice(0, 3).map(([k, [g, m]]) => `${esc(townName(k))}: ${esc(L2(g[1], g[2]))} ×${m.toFixed(1)}`).join(' · ');
    body = `<p class="hint">${L2('Carga', 'Cargo')} ${pvLoad()}/${pvCap()} · ${L2('Compra barato donde se produce y vende caro donde escasea. Los precios cambian cada día, con la estación y con los eventos.', 'Buy cheap where it is made and sell high where it is scarce. Prices change every day, with the season and with events.')}</p><p class="hint">💬 ${L2('Hoy pagan bien en', 'Paying well today in')}: ${tips}</p><div class="slist">${rows}</div>`;
  } else if (PV_TAB === 'town') {
    const rep = repOf(tk), can = rep >= 600 && pr >= 40, nM = Object.keys(o.mayor).length;
    if (M) { const inc = pvIncome(tk), rate = PV_TAX.find(r => r[0] === M.rate) || PV_TAX[1];
      body = `<p>${iconHTML(['pvg', 'alcalde'], 22)} <b>${L2('Eres el alcalde de', 'You are the mayor of')} ${esc(townName(tk))}</b> (${L2('desde el día', 'since day')} ${M.since + 1}).</p>
        <p class="hint">${L2('Impuestos', 'Taxes')}: <b>${esc(L2(rate[1], rate[2]))}</b> · ${L2('los vecinos pagan unos', 'citizens pay about')} ${fmt(inc)} ${L2('de oro al día', 'gold a day')}. ${L2('Impuestos bajos suben la opinión; altos la bajan. Si tu opinión baja de Neutral pierdes el cargo.', 'Low taxes raise opinion; high taxes lower it. If your opinion drops below Neutral you lose the post.')}</p>
        <div class="row">${PV_TAX.map(r => `<button class="chip ${r[0] === M.rate ? 'on' : ''}" data-pvr="${r[0]}">${esc(L2(r[1], r[2]))}</button>`).join('')}</div>
        <div class="srow"><div class="sn"><b>${L2('Arcas del pueblo', 'Town coffers')}: ${fmt(M.coffer | 0)} ${L2('oro', 'gold')}</b><small>${L2('Se llenan cada día (hasta 7 días). El Día del Tributo (cada 7 días) pagan medio día extra.', 'They fill every day (up to 7 days). On Tribute Day (every 7 days) they pay half a day extra.')}</small></div><button class="btn gold sm" id="pvCol" ${M.coffer ? '' : 'disabled'}>${L2('Cobrar', 'Collect')}</button></div>
        <div class="srow"><div class="sn"><b>${L2('Invertir en el pueblo', 'Invest in the town')}</b><small>${L2('Mejora calles y mercado: +6 de prosperidad', 'Improve streets and market: +6 prosperity')}</small></div><button class="btn sm" id="pvInv">${fmt(pvInvCost(tk))}</button></div>
        <div class="row"><button class="btn sm" id="pvDon">${L2('Obras y donaciones', 'Works and donations')}</button><button class="btn sm" id="pvRes">${L2('Dimitir', 'Resign')}</button></div>`; }
    else body = `<p class="hint">${L2('Tu opinión en este pueblo', 'Your standing in this town')}: <b style="color:${repStatus(tk).c || '#fff'}">${esc(repStatus(tk).n)}</b> (${rep}). ${L2('Para ser alcalde necesitas ser Héroe del pueblo (600) y que la prosperidad sea al menos 40. Puedes gobernar 2 pueblos.', 'To become mayor you must be a Hero of the town (600) and prosperity must be at least 40. You can govern 2 towns.')}</p>
      <div class="row"><button class="btn ${can && nM < 2 ? 'gold' : ''}" id="pvRun" ${can && nM < 2 ? '' : 'disabled'}>${iconHTML(['pvg', 'alcalde'], 18)} ${L2('Presentarte a alcalde', 'Run for mayor')}</button>${townDev(tk) !== undefined && DEV_TOWNS.includes(tk) ? `<button class="btn sm" id="pvDon">${L2('Obras y donaciones', 'Works and donations')}</button>` : ''}</div>`;
    body += `<p class="hint">${L2('La prosperidad sube si completas encargos aquí, defiendes el pueblo, donas o vendes las mercancías que necesita. Baja si ignoras los asaltos y las hordas. Por debajo de 25 hay casas abandonadas; a partir de 75 abre un bazar.', 'Prosperity rises if you complete jobs here, defend the town, donate or sell the goods it needs. It drops if you ignore raids and hordes. Below 25 houses are abandoned; from 75 a bazaar opens.')}</p>`;
  } else if (PV_TAB === 'bazar') {
    body = `<p class="hint">${L2('Abierto gracias a la prosperidad del pueblo. Un 10 % más barato.', 'Open thanks to the town\'s prosperity. 10% cheaper.')}</p><div class="slist">${PV_BAZAR.filter(id => ITEMS[id]).map(id => `<div class="srow">${iconHTML(ITEMS[id].icon, 28)}<div class="sn"><b>${esc(ITEMS[id].n)}</b></div><button class="btn sm" data-pvz="${id}">${fmt(Math.round(ITEMS[id].price * 0.9))}</button></div>`).join('')}</div>`;
  }
  openModal(`<h2>${iconHTML(['pvg', 'tablon'], 22)} ${esc(townName(tk))}</h2><div class="sn"><small>${L2('Prosperidad', 'Prosperity')} ${pr}/100${M ? ' · ' + L2('alcalde: tú', 'mayor: you') : ''}</small>${prBar}</div>
    <div class="row" style="flex-wrap:wrap">${tabs.map(t => `<button class="chip ${t[0] === PV_TAB ? 'on' : ''}" data-pvt="${t[0]}">${t[1]}</button>`).join('')}</div><div class="pvBody">${body}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; const on = (s, f) => { const b = $(s); if (b) b.onclick = f; };
  $$('#modal [data-pvt]').forEach(b => b.onclick = () => pvOpen(tk, b.dataset.pvt));
  $$('#modal [data-pvb]').forEach(b => b.onclick = () => { pvTrade(tk, b.dataset.pvb, true, 5); pvOpen(tk); });
  $$('#modal [data-pvs]').forEach(b => b.onclick = () => { pvTrade(tk, b.dataset.pvs, false, 999); pvOpen(tk); });
  $$('#modal [data-pvr]').forEach(b => b.onclick = () => { o.mayor[tk].rate = b.dataset.pvr; markDirty(); pvOpen(tk); });
  $$('#modal [data-pvz]').forEach(b => b.onclick = () => { const id = b.dataset.pvz, c = Math.round(ITEMS[id].price * 0.9); if (P.gold < c) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } if (giveItem(id, 1)) { P.gold -= c; sfx('coin'); } pvOpen(tk); });
  on('#pvCol', () => { const c = M.coffer | 0; P.gold += c; M.coffer = 0; floatText(P.x, P.y - 40, '+' + fmt(c) + ' ' + L2('oro', 'gold'), '#ffd040'); sfx('coin'); markDirty(true); pvOpen(tk); });
  on('#pvInv', () => { const c = pvInvCost(tk); if (P.gold < c) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= c; pvAddPros(tk, 6, 1); addRep(tk, 10, true); sfx('level'); pvLog(L2('El alcalde invierte en calles y mercado de ', 'The mayor invests in the streets and market of ') + townName(tk) + '.', tk, 'good'); markDirty(true); pvOpen(tk); });
  on('#pvDon', () => { closeModal(); if (DEV_TOWNS.includes(tk)) openDonate(tk); });
  on('#pvRes', () => { delete o.mayor[tk]; pvLog(G.P.name + L2(' deja la alcaldía de ', ' steps down as mayor of ') + townName(tk) + '.', tk, '', 1); markDirty(true); pvOpen(tk); });
  on('#pvRun', () => { o.mayor[tk] = { since: calDay(), rate: 'normal', coffer: 0 }; banner(L2('¡Alcalde de ', 'Mayor of ') + townName(tk) + '!', L2('Los vecinos te han elegido', 'The citizens have elected you')); sfx('level'); pvLog(L2('¡', '') + G.P.name + L2(' es el nuevo alcalde de ', ' is the new mayor of ') + townName(tk) + '!', tk, 'good'); markDirty(true); pvOpen(tk); });
}
function pvIncome(tk) { const M = pv().mayor[tk]; if (!M) return 0; const r = PV_TAX.find(r => r[0] === M.rate) || PV_TAX[1]; return Math.round((200 + (TOWN_LV[tk] !== undefined ? TOWN_LV[tk] : 60) * 40) * r[3] * (0.5 + pvPros(tk) / 100) * (1 + (DEV_TOWNS.includes(tk) ? townDev(tk) : 0) * 0.2) * (1 + G.P.lv / 40)); }
function pvInvCost(tk) { return Math.round(1500 * pvTier(tk) * (1 + G.P.lv / 60)); }

// ---------- periódico y rumores ----------
const PV_RUM = [
  ['Dicen que de noche los peces grandes muerden más cerca de la orilla.', 'They say big fish bite closer to shore at night.'],
  ['Un viajero juró haber visto luces azules en las ruinas.', 'A traveler swore he saw blue lights in the ruins.'],
  ['La taberna se llena cuando llueve: nadie quiere trabajar mojado.', 'The tavern fills up when it rains: nobody wants to work wet.'],
  ['Los guardias se quejan de que los bandidos vuelven cada luna llena.', 'The guards complain the bandits come back every full moon.'],
  ['El herrero busca minerales raros y paga sin regatear.', 'The blacksmith is looking for rare ore and pays without haggling.'],
  ['Una anciana asegura que el Velo está más cerca que nunca.', 'An old woman insists the Veil is closer than ever.'],
  ['Han subido los precios del pan: la cosecha fue corta.', 'Bread prices went up: the harvest was short.'],
  ['Los niños juegan a ser héroes con espadas de madera.', 'The children play at being heroes with wooden swords.'],
];
function pvNews(tk) {
  const o = pv(), W = G.P.wstate, day = calDay(), out = [], h = (k) => hash2(day, PV_TOWNS.indexOf(tk) + 11, k);
  for (const e of W.ev) out.push({ d: e.start !== undefined ? e.start : day, txt: (EVDEF[e.type] ? EVDEF[e.type].n(townName(e.town || tk)) + '. ' + EVDEF[e.type].d : ''), kind: EVDEF[e.type] && EVDEF[e.type].bad ? 'bad' : 'good' });
  const bt = PV_TOWNS.filter(k => k !== tk)[Math.floor(h(1) * (PV_TOWNS.length - 1))], bg = pvBest(bt, 1)[0];
  out.push({ txt: L2('Mercaderes: en ', 'Traders: in ') + townName(bt) + L2(' pagan muy bien ', ' they pay very well for ') + L2(bg[0][1], bg[0][2]).toLowerCase() + ' (×' + bg[1].toFixed(1) + ').', kind: '' });
  const pr = pvPros(tk); out.push({ txt: pr < 25 ? L2('Malos tiempos: varias casas están vacías y la gente se marcha.', 'Hard times: several houses are empty and people are leaving.') : pr >= 75 ? L2('El pueblo vive su mejor época: hay trabajo y fiesta.', 'The town is living its best days: there is work and celebration.') : L2('La vida sigue tranquila en el pueblo.', 'Life goes on quietly in town.'), kind: pr < 25 ? 'bad' : pr >= 75 ? 'good' : '' });
  const R = PV_RUM[Math.floor(h(2) * PV_RUM.length)]; out.push({ txt: '💬 ' + L2('Rumor: ', 'Rumor: ') + L2(R[0], R[1]), kind: '' });
  for (const n of o.log) if (!n.tk || n.tk === tk || out.length < 14) out.push(n);
  for (const n of W.news.slice(0, 6)) out.push(n);
  return out.slice(0, 18);
}
// sucesos que salen en el periódico
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && m.boss && m.def) { const tk = pvNearTown(m.x, m.y); pvLog(L2('Un ', 'A ') + (CLASSES[G.P.cls] ? CLASSES[G.P.cls].n.toLowerCase() : L2('aventurero', 'adventurer')) + L2(' llamado ', ' named ') + G.P.name + L2(' ha derrotado a ', ' has defeated ') + (m.def.n || L2('un jefe', 'a boss')) + '.', tk, 'good'); if (tk) pvAddPros(tk, 3); } } catch (e) { } return r; }; }
function pvNearTown(x, y) { if (!G.map || !G.map.isWorld) return ''; let b = '', bd = 1e9; for (const tk of PV_TOWNS) { const t = TOWNS.find(t => t.k === tk); if (!t) continue; const d = dist2(x / 16, y / 16, (t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2); if (d < bd) { bd = d; b = tk; } } return bd < 60 * 60 ? b : ''; }
{ const _ee = endEvent; endEvent = function (ev, won) { const r = _ee.apply(this, arguments); try { const bad = EVDEF[ev.type] && EVDEF[ev.type].bad; if (ev.town && bad) pvAddPros(ev.town, won ? 10 : -15); } catch (e) { } return r; }; }
{ const _se = siegeEnd; siegeEnd = function (won) { const tk = SIEGE && SIEGE.town; const r = _se.apply(this, arguments); if (tk) { pvAddPros(tk, won ? 15 : -20); pvLog(won ? L2('¡El asedio de la Luna de Sangre fue rechazado en ', 'The Blood Moon siege was repelled in ') + townName(tk) + '!' : townName(tk) + L2(' cayó ante el asedio de la Luna de Sangre.', ' fell to the Blood Moon siege.'), tk, won ? 'good' : 'bad'); } return r; }; }
{ const _cq = completeQuest; completeQuest = function () { const tk = G.P && pvTownAt(G.P.x, G.P.y); const r = _cq.apply(this, arguments); if (tk) pvAddPros(tk, 2); return r; }; }
{ const _dd = devDonate; devDonate = function (tk) { const r = _dd.apply(this, arguments); pvAddPros(tk, 1); return r; }; }

// ---------- cada día: impuestos, Día del Tributo y prosperidad ----------
{ const _nd = newDay; newDay = function () { const r = _nd.apply(this, arguments); try { pvDay(); } catch (e) { console.warn(e); } return r; }; }
function pvDay() {
  const P = G.P; if (!P || P.ghost) return; const o = pv(), day = calDay(), trib = day % 7 === 0;
  for (const tk of PV_TOWNS) { const v = pvPros(tk); if (v > 52) o.pros[tk] = v - 1; else if (v < 48 && !townRuled(tk)) o.pros[tk] = v + 1; if (townRuled(tk)) pvAddPros(tk, -2); }
  for (const tk in o.mayor) { const M = o.mayor[tk], rate = PV_TAX.find(r => r[0] === M.rate) || PV_TAX[1], inc = pvIncome(tk);
    M.coffer = Math.min(inc * 7, (M.coffer | 0) + inc + (trib ? Math.round(inc / 2) : 0)); if (rate[4]) addRep(tk, rate[4], true); if (rate[5]) pvAddPros(tk, rate[5]);
    if (repOf(tk) < 200) { delete o.mayor[tk]; pvLog(L2('Los vecinos de ', 'The citizens of ') + townName(tk) + L2(' te han quitado la alcaldía: tu opinión es demasiado baja.', ' have removed you as mayor: your standing is too low.'), tk, 'bad', 1); } }
  // Día del Tributo: siempre ocurre (no depende de los eventos activados)
  if (trib) { const mine = Object.keys(o.mayor); if (mine.length) toast('🏛 ' + L2('Día del Tributo: los vecinos de ', 'Tribute Day: the citizens of ') + mine.map(townName).join(', ') + L2(' han pagado sus impuestos. Cóbralos en el tablón.', ' have paid their taxes. Collect them at the board.'), 'quest', 7);
    let paid = 0; for (const h in P.homes || {}) { const d = G.world && G.world.doors.find(d => d.to === h); const tk = d && pvTownAt(d.x * 16 + 8, d.y * 16 + 8); if (!tk || o.mayor[tk]) continue; const fee = Math.min(P.gold, Math.round((100 + (TOWN_LV[tk] || 40) * 8) * (1 + P.lv / 100))); if (fee > 0) { P.gold -= fee; paid += fee; } else addRep(tk, -10, true); }
    if (paid) toast('🏛 ' + L2('Día del Tributo: pagas ', 'Tribute Day: you pay ') + fmt(paid) + L2(' de oro de impuestos por tu casa.', ' gold in taxes for your house.'), 'info', 6);
    pvLog(L2('Día del Tributo en todos los pueblos.', 'Tribute Day in every town.'), '', ''); }
  markDirty();
}

// ---------- casas abandonadas (prosperidad < 25) ----------
EXTRA_SPR.pv_tablas = () => spr('pv_tablas', () => { const p = new Pix(18, 22), W_ = WOOD; p.line(1, 3, 16, 18, W_[3]); p.line(1, 4, 16, 19, W_[2]); p.line(16, 3, 1, 18, W_[3]); p.line(16, 4, 1, 19, W_[2]); p.rect(4, 0, 10, 5, C('#efe4c8')); p.hl(5, 2, 8, C('#8a2a1a')); p.outline(OUTL); return { c: p.canvas(), ax: 9, ay: 21 }; });
let PV_AB = [], PV_ABSET = new Set(), pvAbKey = '';
function pvAbandon() {
  if (!G.world || !G.P) return; const key = PV_TOWNS.map(tk => pvPros(tk) < 25 ? 1 : 0).join(''); if (key === pvAbKey && PV_AB.every(e => !e.remove)) return; pvAbKey = key;
  for (const e of PV_AB) e.remove = true; PV_AB = []; PV_ABSET = new Set();
  PV_TOWNS.forEach(tk => { if (pvPros(tk) >= 25) return; const t = TOWNS.find(t => t.k === tk); if (!t) return;
    const ds = G.world.doors.filter(d => /^casa_[a-z]\d$/.test(d.to) && !(G.P.homes || {})[d.to] && d.x >= t.x0 && d.x <= t.x1 && d.y >= t.y0 && d.y <= t.y1).sort((a, b) => hash2(a.x, a.y, 5) - hash2(b.x, b.y, 5)).slice(0, 2);
    for (const d of ds) { PV_ABSET.add(d.to); const e = { type: 'deco', k2: 'pv_tablas', map: 'world', x: d.x * 16 + 8, y: d.y * 16 + 15, dyOff: -1 }; G.ents.push(e); PV_AB.push(e); } });
}
{ const _ei = enterInterior; enterInterior = function (door) { if (door && PV_ABSET.has(door.to)) { toast(L2('La casa está abandonada. Si el pueblo prospera, volverán sus vecinos.', 'The house is abandoned. If the town prospers, its people will come back.'), 'warn'); G.P.y += 10; return; } return _ei.apply(this, arguments); }; }

// ---------- vecinos que recuerdan que los salvaste ----------
{ const _nu = npcUp; npcUp = function (e, helped) { if (helped && e && e.def && G.P) { const o = pv(), n = e.def.n; if (n && !o.saved.includes(n)) { o.saved.push(n); o.saved = o.saved.slice(-12); } pvLog(G.P.name + L2(' ayudó a ', ' helped ') + n + L2(' a levantarse.', ' get back up.'), pvNearTown(e.x, e.y), 'good'); } return _nu.apply(this, arguments); }; }
function pvRescueTick() {
  const P = G.P, o = P && P.pv; if (!o || !o.saved || !o.saved.length || P.dead || !P.S || !G.map || G.map.isWorld !== true) return;
  if (o.rescue === calDay() || P.hp > P.S.maxhp * 0.3 || G.t - (P.combatT || -99) > 3) return;
  o.rescue = calDay(); const n = pick(o.saved), h = Math.round(P.S.maxhp * 0.35); P.hp = Math.min(P.S.maxhp, P.hp + h);
  floatText(P.x, P.y - 40, '+' + fmt(h), '#6aff6a', true); burst(P.x, P.y - 12, 14, { sp: 40, up: 50, g: -10, life: 0.8, c: ['#8aff8a', '#ffffff', '#ffe08a'] }); sfx('potion');
  toast('💚 ' + n + ': ' + L2('«¡Me salvaste una vez! Ahora me toca a mí.» Te lanza una poción.', '"You saved me once! Now it\'s my turn." Throws you a potion.'), 'quest', 6);
}

// ---------- aviso al entrar en un pueblo ----------
function pvEnterTick() {
  const P = G.P; if (!P || P.ghost) return; const tk = pvTownAt(P.x, P.y), o = pv(); if (tk === o.here) return; o.here = tk; if (!tk) return;
  const b = pvBest(tk, 2).filter(([, m]) => m >= 1.15).map(([g, m]) => L2(g[1], g[2]) + ' ×' + m.toFixed(1)).join(', ');
  toast('🏘 ' + townName(tk) + ' · ' + L2('prosperidad', 'prosperity') + ' ' + pvPros(tk) + (o.mayor[tk] ? ' · ' + L2('eres el alcalde', 'you are the mayor') : '') + (b ? ' · ' + L2('pagan bien', 'paying well') + ': ' + b : ''), 'info', 5);
}
let pvT = 0; V33_TICKS.push(dt => { if (!G.P || !G.P.S) return; pvRescueTick(); pvT += dt || 0; if (pvT < 1) return; pvT = 0; pvEnterTick(); if (G.map === G.world) pvAbandon(); });

// ---------- oficio Comercio (en la lupa) ----------
addJob('comercio', L2('Comercio', 'Trade'), 'coin', L2('Compra mercancías donde abundan y véndelas donde escasean. Los precios cambian con los días, las estaciones y los eventos.', 'Buy goods where they are plentiful and sell them where they are scarce. Prices change with the days, seasons and events.'),
  { how: [L2('Abre el tablón de la plaza de cualquier pueblo, pestaña «Mercado». Compra lo que se produce allí y véndelo en otro pueblo que lo pague bien (▲).', 'Open the plaza board of any town, "Market" tab. Buy what is made there and sell it in another town that pays well (▲).'), 'Open the plaza board of any town, "Market" tab.'],
    ben: [L2('Más carga, mejores precios de venta, oro y experiencia.', 'More cargo, better sell prices, gold and experience.'), 'More cargo, better prices.'],
    find: () => { const P = G.P, L = PV_TOWNS.map(tk => [tk, pvBoardLoc(tk)]).filter(x => x[1]); if (!L.length) return null; L.sort((a, b) => dist2(a[1][0], a[1][1], P.x / 16, P.y / 16) - dist2(b[1][0], b[1][1], P.x / 16, P.y / 16)); return { loc: L[0][1], t: L2('Tablón de ', 'Board of ') + townName(L[0][0]), m: 'world' }; } },
  [[3, '+5 de carga', '+5 cargo', { trCap: 5 }], [6, 'Vendes un 3 % más caro', 'Sell 3% higher', { trPrice: 3 }], [10, '+10 de carga', '+10 cargo', { trCap: 10 }], [15, 'Vendes un 3 % más caro', 'Sell 3% higher', { trPrice: 3 }], [20, '+2 % de oro de los enemigos', '+2% gold from enemies', { goldP: 2 }],
    [25, '+15 de carga', '+15 cargo', { trCap: 15 }], [30, 'Vendes un 4 % más caro', 'Sell 4% higher', { trPrice: 4 }], [40, '+20 de carga', '+20 cargo', { trCap: 20 }], [50, 'Vendes un 5 % más caro', 'Sell 5% higher', { trPrice: 5 }], [60, '+2 % de experiencia', '+2% experience', { xpP: 2 }]], ['coin', 0]);

{ const st = document.createElement('style'); st.textContent = '.pvmodal .pvPaper{text-align:center;border-bottom:2px double #c8a060;margin:.3em 0 .4em;padding-bottom:.2em}.pvmodal .pvPaper b{display:block;letter-spacing:.08em;font-size:1.05em;color:#f0d890}.pvmodal .pvPaper small{opacity:.75}.pvmodal .pvBody{max-height:52vh;overflow-y:auto;margin:.3em 0}.pvmodal .news{padding:.25em .3em;border-bottom:1px solid rgba(255,255,255,.08)}.pvmodal .news.bad{color:#ffb0a0}.pvmodal .news.good{color:#c8ffb0}.pvmodal .row{display:flex;gap:.4em;justify-content:center;margin:.35em 0}'; document.head.appendChild(st); }
