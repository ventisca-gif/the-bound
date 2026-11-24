// 6.01 · Mar de Dawn: nivel 700, materiales propios y armaduras de los mares (Sergio: «expande el nivel a 700; armaduras
// nuevas que no se repitan, como la ropa de estas imágenes; se consiguen con materiales de Dawn; minerales y árboles nuevos
// en las islas de Dawn que salgan cada 5 segundos»). Diseños inspirados en la moda de los mares, con nombres propios.

// =====================================================================================
// 1) MINERALES Y MADERAS DE DAWN (tiers de recurso 23-25)
// =====================================================================================
// [tier, mineral, colores, madera, especie, hojas, nivel de oficio]
const DW_RES = [
  [23, ['Coralita', 'Coralite'], ['#8a2a3a', '#f0708a', '#ffe0e8'], ['Tronco de Palma de Coral', 'Coral Palm Log'], 'palmacoral', ['#4a1a2a', '#7a2a48', '#b04a6a', '#e07a96', '#f8aac0', '#ffe0ea'], 140],
  [24, ['Nacarita', 'Nacrite Ore'], ['#3a4a6a', '#a8c8e8', '#ffffff'], ['Tronco de Árbol Frutal Raro', 'Rare Fruit Tree Log'], 'frutalraro', ['#1a3a12', '#2a5a1c', '#3e7e2a', '#5aa03c', '#88c85a', '#c0f08a'], 146],
  [25, ['Piedra del Mar', 'Seastone'], ['#1a3a3a', '#3a8a8a', '#a8fff0'], ['Tronco del Árbol Rey', 'King Tree Log'], 'arbolrey', ['#3a2a0a', '#6a4a10', '#a87a1a', '#e0b030', '#f4d870', '#fff4c0'], 152]];
for (const [t, on, oc, ln, sp, leaf, jl] of DW_RES) {
  ORE[t] = oc; OREN[t] = on[0]; LOGN[t] = ln[0].replace(/^Tronco (de |del )/, ''); WOODT[sp] = t; LEAF[sp] = pal(leaf); RESLV[t] = jl;
  it('ore' + t, { n: L2(on[0], on[1]), t: 'mat', stack: true, tier: t, price: 6 * t * t, icon: ['ore', t], rar: 5, d: L2('Mineral de las islas del Mar de Dawn. Sirve para forjar las armaduras de los mares (nivel 620-700).', 'Ore from the Dawn Sea islands. Used to forge the sea armours (level 620-700).') });
  it('log' + t, { n: L2(ln[0], ln[1]), t: 'mat', stack: true, tier: t, price: 5 * t * t, icon: ['log', t], rar: 5, d: L2('Madera de las islas del Mar de Dawn.', 'Wood from the Dawn Sea islands.') }); }
// herramientas: el pico de potencia p abre el mineral p+5 (18 → Coralita, 19 → Nacarita, 20 → Piedra del Mar)
[[18, 'Coralita', 'Coralite', 620, 22], [19, 'Nacarita', 'Nacrite', 650, 23], [20, 'Piedra del Mar', 'Seastone', 680, 24]].forEach(([p, es, en, lv, om], i) => {
  it('hacha' + p, { n: L2('Hacha de ' + es, en + ' Axe'), t: 'tool', tool: 'tala', power: p, lv, price: 4000 * p * p, icon: ['axe', 22], rar: 5 });
  it('pico' + p, { n: L2('Pico de ' + es, en + ' Pickaxe'), t: 'tool', tool: 'mineria', power: p, lv, price: 4000 * p * p, icon: ['pick', 22], rar: 5 });
  it('cana' + (p + 1), { n: L2('Caña de ' + es, en + ' Rod'), t: 'tool', tool: 'pesca', power: p + 1, lv, price: 4000 * p * p, icon: ['rod', 22], rar: 5 });
  const g = 600000 * (i + 1), m = [['ore' + om, 10], ['log' + om, 8]];
  RECIPES.push({ id: 'r_hacha' + p, job: 'herreria', out: 'hacha' + p, n: 1, lv, jlv: 75, gold: g, mats: [['ore' + om, 8], ['log' + om, 10]], cat: 'herramienta' });
  RECIPES.push({ id: 'r_pico' + p, job: 'herreria', out: 'pico' + p, n: 1, lv, jlv: 75, gold: g, mats: m, cat: 'herramienta' });
  RECIPES.push({ id: 'r_cana' + (p + 1), job: 'herreria', out: 'cana' + (p + 1), n: 1, lv, jlv: 75, gold: g, mats: m, cat: 'herramienta' }); });
// en cada isla a la que se puede desembarcar: vetas y árboles de Dawn (los más raros, más lejos de Foosha)
const DW_ISLES = [['foosha', 535, 255, 40, [23]], ['shells', null, null, 34, [23, 24]], ['orange', 615, 482, 34, [23, 24]], ['rare', 1270, 525, 90, [24, 25]], ['syrup', 975, 790, 80, [24, 25]]];
function dwLand(M, x, y) { if (x < 3 || y < 3 || x >= M.w - 3 || y >= M.h - 3) return false; const i = M.I(x, y), t = M.ter[i]; return !WATERY[t] && !SOLID_T[t] && t !== T.DEEP && !M.lvl[i] && M.objAt[i] < 0 && !(M.solidO && M.solidO[i]); }
function dwPlaceRes(M) { if (M.dwRes) return; M.dwRes = 1; const R = new RNG(SEED + 6010);
  for (const [k, x0, y0, r, tiers] of DW_ISLES) { let cx = x0, cy = y0; if (k === 'shells') { if (!M.shells) continue; cx = M.shells.start + 200; cy = 165; } if (k === 'orange' && !M.orange) continue; if (k === 'rare' && !M.rare) continue; if (k === 'syrup' && !M.syrup) continue;
    let ores = 0, trees = 0; for (let n = 0; n < 900 && (ores < 8 || trees < 8); n++) { const x = Math.round(cx + (R.f() * 2 - 1) * r), y = Math.round(cy + (R.f() * 2 - 1) * r * 0.75); if (!dwLand(M, x, y)) continue;
      const t = tiers[R.int(0, tiers.length - 1)];
      if (ores < 8 && (trees >= 8 || R.f() < 0.5)) { addObj(M, 'ore', x, y, { tier: t, v: R.int(0, 3), dwRes: 1 }); ores++; }
      else if (dwLand(M, x, y - 1)) { addObj(M, 'tree', x, y, { sp: DW_RES[t - 23][4], v: R.int(0, 3), dwRes: 1 }); trees++; } } } }
{ const _md = makeDawn; makeDawn = function () { const M = _md.apply(this, arguments); try { dwPlaceRes(M); } catch (e) { } return M; }; }
// reaparecen a los 5 segundos
V33_TICKS.push(() => { const M = G.map; if (!M || M.id !== 'dawn' || !M.objs) return; for (const o of M.objs) if (o.dwRes && o.respawn && o.respawn - G.t > 5) o.respawn = G.t + 5; });

// =====================================================================================
// 2) ARMADURAS DE LOS MARES (tiers 45-49, nivel 620-700, cualquier clase)
// =====================================================================================
const MS = {
  arena: P5(['#6a4a1a', '#a07a3a', '#d0a860', '#ecd090', '#fff0c8']), celeste: P5(['#1a4a6a', '#2a6a98', '#4a94c8', '#7ab8e4', '#b8e0f8']),
  oro: P5(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), morado: P5(['#2a0a3a', '#4a1a62', '#6e2a8e', '#9448b8', '#c080e0']),
  negro: P5(['#060608', '#101014', '#1a1a20', '#26262e', '#3a3a44']), rojo: P5(['#3a0a10', '#6a1420', '#a01e30', '#d03a4a', '#f07a80']),
  blanco: P5(['#9a968c', '#c8c4b8', '#e8e4d8', '#f6f4ec', '#ffffff']), rosa: P5(['#7a2a4a', '#b04a72', '#e0709a', '#f4a0c0', '#ffd0e4']),
  verde: P5(['#0e3a2a', '#18584a', '#24806a', '#3aa88a', '#6ad0b0'])
};
const msSkin = (A, s) => (s && s.sk) || rmSkin(A, s);
// T45 · top de bailarina con monedas doradas (vientre al aire)
fitKind('body', 'ms_danza', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, S = msSkin(A, s), m = s.m, bot = ty + Math.max(3, Math.round(th * 0.45));
  for (let y = bot; y < ty + th; y++) for (let x = tx0; x <= R; x++) p.set(x, y, S[x === tx0 ? 1 : x === R ? 1 : 2]);
  for (let x = tx0; x <= R; x++) { p.set(x, bot - 1, MS.oro[(x & 1) ? 3 : 4]); if (!up && (x & 1)) p.set(x, bot, MS.oro[2]); }
  if (!up && !side) { p.set(Math.round(cx - 0.5), ty + 2, S[2]); p.set(Math.round(cx - 0.5), ty + 1, m[1]); p.set(Math.round(cx - 0.5), ty + th - 2, S[0]); } }, { skin: true });
// T45 · pantalón bombacho con tobilleras doradas
fitKind('legs', 'ms_harem', (p, A, s) => { const cols = new Set(s.m); for (const [x, y] of roLegPix(p, A, cols, A.legTop, A.base - 1)) { if (y >= A.base - 3) p.set(x, y, MS.oro[y === A.base - 3 ? 4 : 2]); else if ((x + y) % 4 === 0) p.set(x, y, s.m[4]); } });
// T46 · vestido de emperatriz con escamas doradas y cuello alto
fitKind('body', 'ms_serpiente', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, m = s.m;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); for (let x = tx0 + 1; x < R; x++) if ((x + y * 2) % 5 === 0) p.set(x, y, MS.oro[3]); }
  for (let x = tx0; x <= R; x++) p.set(x, ty, MS.oro[x === tx0 || x === R ? 2 : 4]); if (!up && !side) p.set(Math.round(cx - 0.5), ty + 1, MS.rojo[3]); });
// T46 · falda larga con abertura (la pierna asoma por un lado)
fitKind('legs', 'ms_falda_raja', (p, A, s) => { const { legTop, base, tx0, tw, side, up, d } = A, m = s.m, S = msSkin(A, s), x0 = Math.round(tx0) - 1, x1 = Math.round(tx0 + tw);
  for (let y = legTop; y < base - 1; y++) { const g = (y - legTop) >> 2, a = x0 - g, b = x1 + g; for (let x = a; x <= b; x++) p.set(x, y, m[x === a ? 3 : x === b ? 1 : (x + y) % 6 ? 2 : 3]); }
  if (!up) { const sx = side ? Math.round(tx0 + tw / 2 + d * 2) : x1 - 1; for (let y = Math.round(legTop + (base - legTop) * 0.4); y < base - 1; y++) { p.set(sx, y, S[2]); p.set(sx + (side ? -d : -1), y, S[1]); } } }, { skin: true });
// T47 · camisa roja con abrigo negro de capitán y ribete dorado
fitKind('body', 'ms_capitan', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, K = MS.negro, Gd = MS.oro, Rr = MS.rojo;
  for (let y = ty; y < ty + th; y++) for (const x of [tx0, tx0 + 1, R - 1, R]) p.set(x, y, K[x === tx0 || x === R ? 1 : 2]); for (let y = ty; y < ty + th; y++) { p.set(tx0 + 2, y, Gd[3]); p.set(R - 2, y, Gd[2]); }
  if (!up && !side) for (let y = ty; y < ty + 3; y++) p.set(Math.round(cx - 0.5), y, Rr[1]); if (up) for (let y = ty + 1; y < ty + th; y++) for (let x = tx0 + 2; x <= R - 2; x++) p.set(x, y, K[(x + y) % 6 ? 2 : 3]); if (side) p.vl(Math.round(cx - d * (tw / 2 - 1)), ty, th, K[2]); });
// T47 · tricornio negro con pluma
fitKind('head', 'ms_tricornio', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m; roRow(p, hx - 10, hx + 10, hy - 4, m[1]); roRow(p, hx - 9, hx + 9, hy - 5, m[2]); roEll(p, hx, hy - 7, 6.5, 4.5, m, true);
  roSet(p, hx - 10, hy - 6, m[2]); roSet(p, hx + 10, hy - 6, m[2]); roRow(p, hx - 6, hx + 6, hy - 6, MS.oro[3]); if (!up) { const fx = side ? hx - d * 4 : hx + 4; for (let k = 0; k < 5; k++) roSet(p, fx + k * (side ? -d : 1) * 0.5, hy - 9 - k, MS.blanco[k < 2 ? 3 : 4]); } });
// T48 · kimono rojo con cuerda amarilla atada a la cintura
fitKind('body', 'ms_kimono', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = s.m, Y = MS.oro, W = MS.blanco;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  if (!up && !side) for (let y = ty; y < ty + Math.min(th - 2, 5); y++) { const k = y - ty; p.set(Math.round(cx - 1 + k * 0.5), y, W[4]); p.set(Math.round(cx - 2 + k * 0.5), y, W[3]); }
  const wy = ty + th - 2; for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, wy, Y[(x & 1) ? 3 : 4]); p.set(x, wy + 1, Y[(x & 1) ? 2 : 3]); }
  if (!up) { const kx = side ? Math.round(cx + d * 2) : Math.round(cx + 2); for (let k = 0; k < 4; k++) p.set(kx + (k & 1), wy + 2 + k, Y[k & 1 ? 2 : 4]); } });
// T49 · traje del futuro: mono blanco con franjas rosas y número en el pecho
fitKind('body', 'ms_futuro', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, Pk = MS.rosa;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, Pk[2]); p.set(R, y, Pk[1]); } p.hl(tx0, ty, tw, Pk[3]);
  if (!up && !side) { const x = Math.round(cx - 1.5), y = ty + 2; for (const [a, b] of [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3], [0, 4], [1, 4], [2, 4], [0, 3]]) p.set(x + a, y + b, Pk[2]); } });
fitKind('legs', 'ms_mallas', (p, A, s) => { const cols = new Set(s.m); for (const [x, y] of roLegPix(p, A, cols, A.legTop, A.base - 1)) if (s.m.indexOf(p.get(x, y)) <= 1) p.set(x, y, MS.rosa[2]); });
// botas grandes rosas del futuro
fitKind('feet', 'ms_botas', (p, A, s) => { const m = s.m, cols = new Set(m); for (const [x, y] of roLegPix(p, A, cols, A.base - 4, A.base)) p.set(x, y, m[y === A.base - 4 ? 4 : y === A.base ? 1 : 3]);
  const pts = roLegPix(p, A, new Set([m[4], m[3], m[1]]), A.base, A.base); for (const [x, y] of pts) { p.set(x - 1, y, m[1]); p.set(x + 1, y, m[1]); } });
// cascos de música con orejeras redondas
fitKind('head', 'ms_cascos', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m, hr = A.hrx || 7; roRow(p, hx - hr + 1, hx + hr - 1, A.headTop + 1, m[3]);
  for (const sg of side ? [-d] : [-1, 1]) { const x = Math.round(hx + sg * (hr - 1)); roRect(p, x - 1, hy - 4, 3, 4, m[2]); roSet(p, x, hy - 3, MS.blanco[4]); } });

const MS_SETS = {
  45: { lv: 620, n: ['de la Bailarina del Desierto', 'of the Desert Dancer'], parts: [['Turbante de Bailarina', 'Dancer’s Turban'], ['Top de Monedas', 'Coin Top'], ['Bombachos de Seda', 'Silk Harem Pants'], ['Sandalias de Bailarina', 'Dancer’s Sandals']],
    vis: { head: { k: 'of_headwrap', m: MS.celeste, s: MS.oro, cover: 'hat' }, body: { k: 'ms_danza', m: MS.celeste }, legs: { k: 'ms_harem', m: MS.celeste }, feet: { k: 'sandals', m: MS.arena } }, mats: [['ore23', 12], ['log23', 10]] },
  46: { lv: 640, n: ['de la Emperatriz Serpiente', 'of the Serpent Empress'], parts: [['Horquillas de la Emperatriz', 'Empress’s Hairpins'], ['Vestido de Escamas', 'Scaled Gown'], ['Falda de la Serpiente', 'Serpent Skirt'], ['Zapatos de Seda Morada', 'Purple Silk Shoes']],
    vis: { head: { k: 'id_kanzashi', m: MS.oro, p: MS.rojo }, body: { k: 'ms_serpiente', m: MS.morado }, legs: { k: 'ms_falda_raja', m: MS.morado }, feet: { k: 'rm_zapato', m: MS.morado } }, mats: [['ore23', 8], ['ore24', 8], ['log24', 8]] },
  47: { lv: 660, n: ['del Capitán del Abrigo Negro', 'of the Black-Coat Captain'], parts: [['Tricornio del Capitán', 'Captain’s Tricorn'], ['Abrigo de Capitán', 'Captain’s Greatcoat'], ['Pantalón de Capitán', 'Captain’s Trousers'], ['Botas de Capitán', 'Captain’s Boots']],
    vis: { head: { k: 'ms_tricornio', m: MS.negro, cover: 'hat' }, body: { k: 'ms_capitan', m: MS.rojo }, legs: { k: 'rm_pantalon', m: MS.negro }, feet: { k: 'boots', m: MS.negro } }, mats: [['ore24', 12], ['log24', 10]] },
  48: { lv: 680, n: ['del Kimono del Rey del Mar', 'of the Sea King’s Kimono'], parts: [['Sombrero Kasa del Mar', 'Sea Kasa Hat'], ['Kimono Rojo con Cuerda', 'Red Rope-Belted Kimono'], ['Hakama Blanca', 'White Hakama'], ['Geta del Mar', 'Sea Geta']],
    vis: { head: { k: 'of_kasa', m: MS.arena, cover: 'hat' }, body: { k: 'ms_kimono', m: MS.rojo }, legs: { k: 'baggy', m: MS.blanco }, feet: { k: 'of_geta', m: MS.negro } }, mats: [['ore25', 8], ['log24', 6], ['log25', 8]] },
  49: { lv: 700, n: ['del Traje del Futuro', 'of the Future Suit'], parts: [['Cascos del Futuro', 'Future Headphones'], ['Mono del Futuro', 'Future Bodysuit'], ['Mallas del Futuro', 'Future Leggings'], ['Botas del Futuro', 'Future Boots']],
    vis: { head: { k: 'ms_cascos', m: MS.rosa }, body: { k: 'ms_futuro', m: MS.blanco }, legs: { k: 'ms_mallas', m: MS.blanco }, feet: { k: 'ms_botas', m: MS.rosa } }, mats: [['ore25', 14], ['log25', 12]] } };
const MS_TIERS = Object.keys(MS_SETS).map(Number);
{ const _gv = gearVis; gearVis = function (cls, slot, t) { const S = MS_SETS[t]; if (S && slot !== 'weapon' && S.vis[slot]) return Object.assign({ t }, S.vis[slot]); return _gv.apply(this, arguments); }; }
{ const _cg = cleanGear; cleanGear = function (g) { const o = _cg.apply(this, arguments); for (const k of ['head', 'body', 'legs', 'feet']) { const v = g && +g[k]; if (MS_SETS[v]) o[k] = v; } return o; }; }
{ const _fi = fitItems; fitItems = function (only) { const out = _fi.apply(this, arguments); for (const t of MS_TIERS) for (const c of AP_CLASSES) for (const slot of ['head', 'body', 'legs', 'feet']) { const it_ = { id: `${c}:${slot}:${t}`, kind: 'gear', cls: c, slot, t }; if (!only || it_.id.includes(only)) out.push(it_); } return out; }; }
// la piel viaja con las prendas que la dejan ver
const MS_SKIN = new Set(['ms_danza', 'ms_falda_raja']);
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos) { const L = _hl.apply(this, arguments); try { if (!L) return L; if (gear && MS_SETS[+gear.body] && !(cos && cos.back && COSM[cos.back]) && !(app && app.evo)) { L.back = null; if (cls === 'asesino') L.scarf = null; } const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c);
  if (L.top && MS_SKIN.has(L.top.k)) L.top = Object.assign({}, L.top, { sk: SK }); if (L.bot && MS_SKIN.has(L.bot.k)) L.bot = Object.assign({}, L.bot, { sk: SK }); } catch (e) { } return L; }; }
for (const t of MS_TIERS) { const S = MS_SETS[t], nm = L2(S.n[0], S.n[1]), lv = S.lv; TIER[t] = { k: 'mar' + t, m: nm, f: nm, mp: nm, fp: nm, lv, p: t }; TIERP[t] = S.vis.body.m;
  const def = (3 + lv * 1.4 + t * 2) * 1.05, d = L2('Armadura de los mares (Mar de Dawn). Cualquier clase. Se forja con minerales y maderas de las islas de Dawn.', 'Sea armour (Dawn Sea). Any class. Forged with ores and woods from the Dawn islands.');
  [['h', 'head', 0.45, 1.5, ['helm', 15]], ['b', 'body', 1, 3.5, ['armor', 15]], ['l', 'legs', 0.6, 2, ['legs', 15]], ['f', 'feet', 0.35, 0, ['boots', 15]]].forEach(([s, slot, dm, hm, icon], k) => {
    const o = { n: L2(S.parts[k][0], S.parts[k][1]), t: 'armor', slot, lv, tier: t, def: Math.round(def * dm), price: Math.round(20 * Math.pow(t, 2.3) * dm), icon, rar: 5, d, ms: 1 };
    if (hm) o.hpB = Math.round(lv * hm * 1.05); else o.spdB = 12; it(`${s}_${t}`, o);
    RECIPES.push({ id: `r_${s}_${t}`, job: 'herreria', out: `${s}_${t}`, n: 1, lv, jlv: 1, gold: 400000 * (t - 40), mats: S.mats, cat: 'armadura' }); }); }

// ---------- Lupa ----------
if (typeof LUPA_DAWN !== 'undefined') LUPA_DAWN.push(['mares601', () => '⛏ ' + L2('Materiales y armaduras de los mares', 'Sea materials and armours'), () => [
  L2('Minerales y maderas nuevos en las islas de Dawn (reaparecen a los 5 segundos): Coralita y Palma de Coral (Foosha, Shells Town, Orange Town), Nacarita y Árbol Frutal Raro (Shells, Orange, Animales Raros, Villa Syrup), Piedra del Mar y Árbol Rey (Animales Raros y Villa Syrup).', 'New ores and woods on the Dawn islands (they respawn after 5 seconds): Coralite and Coral Palm (Foosha, Shells Town, Orange Town), Nacrite and Rare Fruit Tree (Shells, Orange, Rare Animals, Syrup Village), Seastone and King Tree (Rare Animals and Syrup Village).'),
  L2('Herramientas: Pico/Hacha de Coralita (620), de Nacarita (650) y de Piedra del Mar (680), en la Herrería.', 'Tools: Coralite (620), Nacrite (650) and Seastone (680) pickaxes and axes, at the Forge.'),
  L2('Armaduras de los mares (cualquier clase), en la Herrería: Bailarina del Desierto (620), Emperatriz Serpiente (640), Capitán del Abrigo Negro (660), Kimono del Rey del Mar (680) y Traje del Futuro (700).', 'Sea armours (any class), at the Forge: Desert Dancer (620), Serpent Empress (640), Black-Coat Captain (660), Sea King’s Kimono (680) and Future Suit (700).')], () => null]);
