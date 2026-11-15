// ================= v4.42: RECOMPENSAS DE PORTALES — chaquetas, ropa negra, capuchas, anillos, peinados emo, maquillaje y aspectos de armas =================

// ---------- ropa (todo con tipos que ya se ajustan solos a las 8 estructuras de cuerpo, con busto en mujer) ----------
const NEG = P5(['#06060a', '#101016', '#1a1a24', '#282834', '#3a3a4c']), NEGR = P5(['#3a0610', '#6a0c1e', '#9a1430', '#c82a48', '#f05a74']), NEGM = P5(['#14082a', '#24104a', '#381a6a', '#52288e', '#7040b4']), PLA = P5(['#5a5a6a', '#8a8a9c', '#b8b8c8', '#dcdce8', '#ffffff']), GRI = P5(['#1a1a20', '#2c2c36', '#40404c', '#585866', '#747484']);
const DG_COSMS = [
  ['c_chaq_cazador', L2('Chaqueta de Cazador', 'Hunter Jacket'), 'body', () => ({ k: 'coat', m: NEG, s: NEGR })],
  ['c_chaq_cuero', L2('Chaqueta de Cuero Negra', 'Black Leather Jacket'), 'body', () => ({ k: 'leather', m: NEG, s: PLA })],
  ['c_gabardina', L2('Gabardina Nocturna', 'Night Trench Coat'), 'body', () => ({ k: 'coat', m: GRI, s: NEGM })],
  ['c_chaq_astral', L2('Chaqueta Astral', 'Astral Jacket'), 'body', () => ({ k: 'coat', m: NEGM, s: GOLD.slice(1) })],
  ['c_ropa_negra', L2('Ropa Negra', 'Black Clothes'), 'body', () => ({ k: 'tunic', m: NEG, s: GRI })],
  ['c_sudadera', L2('Sudadera Oscura', 'Dark Hoodie'), 'body', () => ({ k: 'shadow', m: GRI, s: NEGR })],
  ['c_capucha_negra', L2('Capucha Negra', 'Black Hood'), 'head', () => ({ k: 'hood', m: NEG, s: NEGR, cover: 'hood' })],
  ['c_capucha_gris', L2('Capucha de Sudadera', 'Hoodie Hood'), 'head', () => ({ k: 'hood', m: GRI, s: PLA, cover: 'hood' })],
  ['c_capucha_astral', L2('Capucha Astral', 'Astral Hood'), 'head', () => ({ k: 'hood', m: NEGM, s: GOLD.slice(1), cover: 'hood' })],
  ['c_pant_negro', L2('Pantalón Negro', 'Black Trousers'), 'legs', () => ({ k: 'pants', m: NEG, s: GRI })],
  ['c_pant_cargo', L2('Pantalón Cargo Negro', 'Black Cargo Pants'), 'legs', () => ({ k: 'baggy', m: GRI, s: NEG })],
  ['c_falda_negra', L2('Falda Negra', 'Black Skirt'), 'legs', () => ({ k: 'skirt', m: NEG, s: NEGR })],
  ['c_botas_negras', L2('Botas Negras', 'Black Boots'), 'feet', () => ({ k: 'boots', m: NEG, s: PLA })],
  ['c_zapas_negras', L2('Zapatillas Negras', 'Black Sneakers'), 'feet', () => ({ k: 'sneakers', m: NEG, s: PLA })],
  ['c_capa_cazador', L2('Capa de Cazador', 'Hunter Cape'), 'back', () => ({ k: 'cape', o: NEG, i: NEGR, tr: NEGR })],
  ['c_capa_astral', L2('Capa Astral', 'Astral Cape'), 'back', () => ({ k: 'cape', o: NEGM, i: NEG, tr: GOLD.slice(1) })],
];
for (const [id, n, slot, vis] of DG_COSMS) { cosm(id, n, slot, vis, { src: L2('Portales (Torre de los Portales)', 'Portals (Portal Tower)') }); it('cosi_' + id, { n, t: 'cos', cos: id, price: 2500, icon: ['hanger'], rar: 3 }); DG_COS.push('cosi_' + id); }

// ---------- anillos de cazador (como los mejores accesorios de su nivel) ----------
const RINGS = [[50, L2('Anillo de Cazador de Hierro', 'Iron Hunter Ring')], [100, L2('Anillo de Cazador de Plata', 'Silver Hunter Ring')], [150, L2('Anillo de Cazador de Oro', 'Gold Hunter Ring')], [250, L2('Anillo de Cazador de Platino', 'Platinum Hunter Ring')], [340, L2('Anillo de Cazador Astral', 'Astral Hunter Ring')]];
RINGS.forEach(([lv, n], i) => { let best = null; for (const id in ITEMS) { const it_ = ITEMS[id]; if (it_.slot === 'acc' && !it_.cls && (it_.lv || 0) <= lv && (!best || (it_.lv || 0) > (best.lv || 0))) best = it_; }
  const st = {}; if (best) for (const k of ['atk', 'def', 'hpB', 'mpB', 'crit', 'spdB']) if (best[k]) st[k] = Math.round(best[k] * 0.95 * 10) / 10; it('anillo_cazador_' + (i + 1), Object.assign({ n, t: 'acc', slot: 'acc', lv, price: 40 * lv * 3, icon: ['ring', Math.min(4, i)], rar: Math.min(4, 2 + (i >> 1)) }, st)); });

// ---------- peinados emo (chicas y chicos): flequillo largo que tapa un ojo ----------
HS_F.push({ n: L2('Emo flequillo largo', 'Emo long fringe'), cap: 'volume', bang: 'long', side: 9, back: 8, jag: 1, emo: 1 }, { n: L2('Emo corto', 'Emo short'), cap: 'round', bang: 'long', side: 5, back: 4, jag: 1, emo: 1 }, { n: L2('Emo coletas', 'Emo pigtails'), cap: 'round', bang: 'long', side: 4, back: 0, tail: 'twin', emo: 1 });
HS_M.push({ n: L2('Emo', 'Emo'), cap: 'volume', bang: 'long', side: 4, back: 5, jag: 1, emo: 1 }, { n: L2('Emo erizado', 'Emo spiky'), cap: 'spiky', bang: 'long', side: 3, back: 4, emo: 1 }, { n: L2('Emo lacio', 'Emo straight'), cap: 'round', bang: 'long', side: 6, back: 6, emo: 1 });

// ---------- maquillaje de ojos (en la creación, la peluquería y el estilo de los hijos) ----------
const MK = [[L2('Sin maquillaje', 'No makeup'), null], [L2('Delineado negro', 'Black eyeliner'), '#0a0a12'], [L2('Sombra morada', 'Purple shadow'), '#8a3ac8'], [L2('Sombra roja', 'Red shadow'), '#c82a48'], [L2('Sombra azul', 'Blue shadow'), '#3a7ae0'], [L2('Pestañas largas', 'Long lashes'), '#101018'], [L2('Ojos ahumados', 'Smoky eyes'), '#2a2a3a']];
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && a.mk) o.mk = clamp(a.mk | 0, 0, MK.length - 1); return o; }; }
{ const _hk = heroKey; heroKey = function (cls, app, gear, cos, hh) { const k = _hk.apply(this, arguments); return app && app.mk ? k + '|mk' + app.mk : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, o) { const L = _hl.apply(this, arguments); if (L && app && app.mk) L.mk = app.mk | 0; return L; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { const m = p.meta; if (!L || !L.mk || !m || !MK[L.mk] || !MK[L.mk][1] || dir === 'up' || !m.eyes || m.ey === undefined) return r; const c = C(MK[L.mk][1]), ey = Math.round(m.ey), side = dir === 'left' || dir === 'right';
      for (const ex0 of m.eyes) { const ex = Math.round(ex0), outer = side ? (dir === 'left' ? -1 : 1) : (ex < m.hx ? -1 : 1);
        if (L.mk === 1 || L.mk === 5) { p.set(ex, ey - 1, c); p.set(ex + 1, ey - 1, c); p.set(ex + (outer > 0 ? 2 : -1), ey - 1 - (L.mk === 5 ? 1 : 0), c); if (L.mk === 5) p.set(ex + (outer > 0 ? 2 : -1), ey - 2, c); }
        else if (L.mk === 6) { for (const [dx, dy] of [[0, -1], [1, -1], [-1, 0], [2, 0]]) p.blend ? p.blend(ex + dx, ey + dy, c, 0.75) : p.set(ex + dx, ey + dy, c); }
        else { p.blend ? (p.blend(ex, ey - 1, c, 0.7), p.blend(ex + 1, ey - 1, c, 0.7), p.blend(ex + (outer > 0 ? 2 : -1), ey - 1, c, 0.55)) : (p.set(ex, ey - 1, c), p.set(ex + 1, ey - 1, c)); } } } catch (e) { } return r; }; }
{ const _ae = appEditorHTML; appEditorHTML = function (app, tabs) { const h = _ae.apply(this, arguments); if (edTab !== 'pelo') return h; return h + `<div class="edextra"><h4>${L2('Maquillaje de ojos', 'Eye makeup')}</h4><div class="chips">${MK.map(([n], i) => `<button class="chip ${(app.mk | 0) === i ? 'on' : ''}" data-emk="${i}">${esc(n)}</button>`).join('')}</div></div>`; }; }
{ const _ba = bindAppEditor; bindAppEditor = function (root, app, onChange) { const r = _ba.apply(this, arguments); $$('[data-emk]', root).forEach(b => b.onclick = () => { app.mk = +b.dataset.emk; sfx('ui'); onChange(true); }); return r; }; }

// ---------- aspectos de arma: cambian solo el dibujo de tu arma (no el daño); los demás jugadores también lo ven ----------
SAVEKEYS.push('wskin', 'wskins');
const WSKINS = [[3, L2('Acero Pulido', 'Polished Steel'), 6], [9, L2('Plata Lunar', 'Lunar Silver'), 8], [12, L2('Oro Real', 'Royal Gold'), 10], [15, L2('Mithril Azur', 'Azure Mithril'), 12], [18, L2('Obsidiana', 'Obsidian'), 14], [21, L2('Cristal Celeste', 'Celestial Crystal'), 16], [23, L2('Sombra Eclipsada', 'Eclipsed Shadow'), 20], [26, L2('Luna Sonriente', 'Smiling Moon'), 26]];
{ const _gt = gearTiers; gearTiers = function (P) { const g = _gt.apply(this, arguments); if (P && P === G.P && P.wskin && (P.wskins || []).includes(P.wskin)) { g.weapon = P.wskin; g.ws = undefined; } return g; }; }
function wskinSet(t) { const P = G.P; P.wskin = t; refreshLook(); markDirty(true); }
// ---------- tienda del portal: cosméticos, anillos y aspectos ----------
{ const _ts = tpShop; tpShop = function () { _ts.apply(this, arguments); const P = G.P, body = $('#mbody .slist'); if (!body) return; P.wskins = P.wskins || [];
    const cos = DG_COSMS.map(([id, n]) => { const own = (P.wardrobe || []).includes(id); return `<div class="srow">${iconHTML(['hanger'], 24)}<div class="sn"><b>${esc(n)}</b><small>${own ? L2('ya lo tienes', 'owned') : L2('cosmético', 'cosmetic')}</small></div><button class="btn sm" data-tc="${id}" ${own || countItem('esencia_portal') < 12 ? 'disabled' : ''}>12 ✦</button></div>`; }).join('');
    const rings = RINGS.map((_, i) => { const id = 'anillo_cazador_' + (i + 1), I = ITEMS[id], c = 10 + i * 8; return `<div class="srow">${iconHTML(I.icon, 24)}<div class="sn"><b>${esc(I.n)}</b><small>${L2('Nv. ', 'Lv. ')}${I.lv}</small></div><button class="btn sm" data-tr="${id}" data-c="${c}" ${countItem('esencia_portal') < c ? 'disabled' : ''}>${c} ✦</button></div>`; }).join('');
    const sk = WSKINS.map(([t, n, c]) => { const own = P.wskins.includes(t), on = P.wskin === t; return `<div class="srow"><div class="sn"><b>⚔ ${esc(n)}</b><small>${L2('Aspecto de arma (solo el dibujo)', 'Weapon look (art only)')}</small></div>${own ? `<button class="btn sm ${on ? 'gold' : ''}" data-tw="${t}">${on ? L2('Quitar', 'Remove') : L2('Usar', 'Use')}</button>` : `<button class="btn sm" data-twb="${t}" data-c="${c}" ${countItem('esencia_portal') < c ? 'disabled' : ''}>${c} ✦</button>`}</div>`; }).join('');
    body.insertAdjacentHTML('beforeend', `<h3>${L2('Ropa de cazador', 'Hunter clothes')}</h3>${cos}<h3>${L2('Anillos', 'Rings')}</h3>${rings}<h3>${L2('Aspectos de arma', 'Weapon looks')}</h3>${sk}`);
    $$('#modal [data-tc]').forEach(b => b.onclick = () => { if (countItem('esencia_portal') < 12) return; takeItem('esencia_portal', 12); giveCosmetic(b.dataset.tc); sfx('coin'); markDirty(true); tpShop(); });
    $$('#modal [data-tr]').forEach(b => b.onclick = () => { const c = +b.dataset.c; if (countItem('esencia_portal') < c) return; if (giveItem(b.dataset.tr, 1)) { takeItem('esencia_portal', c); sfx('coin'); } tpShop(); });
    $$('#modal [data-twb]').forEach(b => b.onclick = () => { const c = +b.dataset.c, t = +b.dataset.twb; if (countItem('esencia_portal') < c) return; takeItem('esencia_portal', c); P.wskins.push(t); sfx('coin'); wskinSet(t); toast('⚔ ' + WSKINS.find(w => w[0] === t)[1], 'quest'); tpShop(); });
    $$('#modal [data-tw]').forEach(b => b.onclick = () => { const t = +b.dataset.tw; wskinSet(P.wskin === t ? null : t); tpShop(); }); }; }
// los cofres de los portales también dan anillos y aspectos de arma
{ const _r = XACT.dg_reward[2]; XACT.dg_reward[2] = function (o) { const was = o.opened; const r = _r.apply(this, arguments); if (was) return r; const P = G.P;
    if (Math.random() < (o.team ? 0.3 : 0.15)) { const i = RINGS.reduce((b, [lv], k) => lv <= o.lv + 10 ? k : b, 0); giveItem('anillo_cazador_' + (i + 1), 1); }
    if (Math.random() < (o.team ? 0.2 : 0.1)) { P.wskins = P.wskins || []; const opts = WSKINS.filter(w => !P.wskins.includes(w[0]) && w[0] <= Math.ceil(o.lv / 12)); if (opts.length) { const w = pick(opts); P.wskins.push(w[0]); toast('⚔ ' + L2('Aspecto de arma: ', 'Weapon look: ') + w[1], 'quest', 5); } }
    markDirty(true); return r; }; }
if (typeof GSIS !== 'undefined') GSIS.push(['estilo', '🖤 ' + L2('Ropa de cazador, maquillaje y aspectos', 'Hunter clothes, makeup and looks'), () => [L2('Los cofres de los portales y la Tienda del Portal (esencias) dan chaquetas, ropa negra, capuchas, capas, anillos y aspectos de arma (cambian solo el dibujo de tu arma; los demás lo ven).', 'Portal chests and the Portal Shop (essences) give jackets, black clothes, hoods, capes, rings and weapon looks (they only change your weapon art; others see it).'), L2('En la peluquería (pestaña Pelo) hay 6 peinados emo nuevos y el maquillaje de ojos: delineado, sombras morada, roja y azul, pestañas largas y ojos ahumados.', 'At the hairdresser (Hair tab) there are 6 new emo hairstyles and eye makeup: eyeliner, purple, red and blue shadow, long lashes and smoky eyes.')], () => null]);
