// 6.02 · Armaduras de clase de los mares (nivel 700, cada clase con su diseño, de la muestra aprobada por Sergio) y
// combinaciones de las armaduras de los mares (piezas de dos conjuntos con colores nuevos, nivel 630-690).
const X7 = {
  blanco: P5(['#9a968c', '#c8c4b8', '#e8e4d8', '#f6f4ec', '#ffffff']), marino: P5(['#0a1230', '#16204a', '#223068', '#344690', '#5068b8']),
  oro: P5(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), negro: P5(['#060608', '#101014', '#1a1a20', '#26262e', '#3a3a44']),
  tormenta: P5(['#0a1838', '#14306a', '#1e4aa0', '#3a74d0', '#7ab0f0']), cuero: P5(['#2a160c', '#4a2a16', '#6a4022', '#8a5a32', '#b07a4a']),
  rojo: P5(['#3a0a10', '#6a1420', '#a01e30', '#d03a4a', '#f07a80']), rosa: P5(['#6a2a4a', '#a0406a', '#d0608a', '#ec90b0', '#fcc8da']),
  gris: P5(['#2a2a30', '#44444c', '#62626c', '#85858e', '#acacb4']), verde: P5(['#0e2a1a', '#18462a', '#24663a', '#3a8a52', '#62b078']),
  pelo: P5(['#b8b0a8', '#d8d0c8', '#ece6e0', '#f8f4f0', '#ffffff'])
};
// Guerrero · abrigo blanco de vicealmirante sobre los hombros, traje marino y charreteras doradas
fitKind('body', 'x7_almirante', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, W = X7.blanco, Gd = X7.oro;
  for (let y = ty; y < ty + th; y++) { p.set(tx0, y, W[3]); p.set(tx0 + 1, y, W[2]); p.set(R, y, W[2]); p.set(R - 1, y, W[1]); }
  for (const x of [tx0, tx0 + 1, R - 1, R]) { p.set(x, ty, Gd[3]); p.set(x, ty + 1, Gd[2]); }
  if (!up && !side) { for (let y = ty; y < ty + 3; y++) { p.set(Math.round(cx - 0.5), y, W[4]); } p.set(Math.round(cx - 0.5), ty + 3, X7.rojo[2]); for (let r = 0; r < 3; r++) p.set(Math.round(cx + 1.5), ty + 4 + r * 2, Gd[3]); }
  if (up) { for (let y = ty + 1; y < ty + th; y++) for (let x = tx0 + 2; x <= R - 2; x++) p.set(x, y, W[(x + y) % 7 ? 3 : 2]); const k = Math.round(cx - 1); p.set(k, ty + 3, X7.negro[1]); p.set(k + 1, ty + 3, X7.negro[1]); p.set(k, ty + 4, X7.negro[1]); p.set(k + 1, ty + 5, X7.negro[1]); }
  if (side) for (let y = ty; y < ty + th; y++) p.set(Math.round(cx - d * (tw / 2 - 1)), y, W[3]); });
// Mago · gabán de tormenta con rayos dorados y ribete de nube
fitKind('body', 'x7_tormenta', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, Gd = X7.oro, W = X7.blanco;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty + th - 1, W[(x & 1) ? 3 : 4]); }
  for (let y = ty + 1; y < ty + th - 1; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  const bolt = (x0) => { const pts = [[0, 0], [1, 1], [0, 2], [1, 3], [2, 4], [1, 5]]; for (const [dx, dy] of pts) if (ty + 1 + dy < ty + th - 1) p.set(x0 + dx, ty + 1 + dy, Gd[dx & 1 ? 3 : 4]); };
  if (!up && !side) { bolt(Math.round(cx - tw * 0.3)); bolt(Math.round(cx + tw * 0.12)); p.hl(Math.round(cx - 1.5), ty, 3, W[4]); } else if (up) bolt(Math.round(cx - 1)); else bolt(Math.round(cx - d));
  });
// Arquero · gabán de tirador con bandolera de balas cruzada
fitKind('body', 'x7_tirador', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, Gd = X7.oro, K = X7.negro;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!side) for (let k = 0; k < th; k++) { const x = Math.round((up ? R - 1 - k * (tw - 2) / th : tx0 + 1 + k * (tw - 2) / th)), y = ty + k; p.set(x, y, K[2]); p.set(x + 1, y, K[3]); if (k % 2 === 0 && !up) p.set(x, y - 1, Gd[3]); }
  else p.vl(Math.round(cx), ty, th, K[2]);
  if (!up && !side) { p.hl(Math.round(cx - 2), ty, 4, X7.blanco[3]); } p.hl(tx0, ty + th - 2, tw, X7.cuero[1]); p.set(Math.round(cx - 0.5), ty + th - 2, Gd[3]); });
// Asesino · traje negro de agente con cuello alto, corbata y cadena plateada
fitKind('body', 'x7_agente', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, W = X7.blanco, S = X7.gris;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!up && !side) { const dep = Math.max(3, Math.round(th * 0.45)); for (let y = ty; y < ty + dep; y++) { const w = Math.max(0, Math.round((1 - (y - ty) / dep) * 2)); for (let x = Math.round(cx - w - 0.5); x <= Math.round(cx + w - 0.5); x++) p.set(x, y, W[4]); p.set(Math.round(cx - 0.5), y, s.m[0]); }
    p.set(tx0 + 1, ty, s.m[4]); p.set(R - 1, ty, s.m[4]); for (let k = 0; k < 4; k++) p.set(Math.round(cx + 1.5 + (k >> 1)), ty + dep + k, S[k & 1 ? 3 : 4]); }
  else if (up) { p.hl(tx0 + 1, ty, tw - 2, s.m[4]); } else { p.set(Math.round(cx + d * (tw / 2 - 1)), ty, W[4]); p.set(Math.round(cx + d * (tw / 2 - 1)), ty + 1, s.m[0]); } });
// Bardo · frac del barco fantasma con chorrera blanca y flor roja en la solapa
fitKind('body', 'x7_fantasma', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, W = X7.blanco, Rr = X7.rojo;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!up && !side) { for (let y = ty; y < ty + Math.min(th - 1, 5); y++) { const w = y === ty ? 1 : 2; for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, W[(x + y) & 1 ? 3 : 4]); }
    p.set(Math.round(cx - tw / 2 + 2), ty + 2, Rr[3]); p.set(Math.round(cx - tw / 2 + 3), ty + 2, Rr[2]); p.set(Math.round(cx - tw / 2 + 2), ty + 3, Rr[1]); }
  else if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty + 1, W[4]); p.set(fx, ty + 2, W[3]); } else p.vl(Math.round(cx - 0.5), ty + Math.round(th * 0.5), Math.round(th * 0.5), s.m[0]); });
// Invocador · abrigo largo de médica de invierno con cuello de piel
fitKind('body', 'x7_invierno', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, F = X7.pelo;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty, F[(x & 1) ? 3 : 4]); p.set(x, ty + 1, F[(x & 1) ? 2 : 3]); }
  for (let y = ty + 2; y < ty + th; y++) { p.set(tx0, y, F[2]); p.set(R, y, F[1]); }
  if (!up && !side) { p.vl(Math.round(cx - 0.5), ty + 2, th - 2, F[3]); for (let r = 0; r < 3; r++) p.set(Math.round(cx + 0.5), ty + 3 + r * 2, X7.oro[3]); } });
// Hombre-pez · gi de karate cruzado con cinturón negro (piel en el escote)
fitKind('body', 'x7_gi', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, K = X7.negro, S = rmSkin(A, s);
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!up && !side) for (let y = ty; y < ty + Math.min(th - 3, 5); y++) { const w = 2 - ((y - ty) >> 1); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) if (w > 0) p.set(x, y, S[2]); p.set(Math.round(cx - w - 1), y, s.m[1]); }
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty + th - 2, K[2]); p.set(x, ty + th - 1, K[1]); } if (!up) { const kx = side ? Math.round(cx - d) : Math.round(cx + 2); for (let k = 0; k < 3; k++) p.set(kx + (k & 1), ty + th + k, K[2]); } }, { skin: true });
// sombrero de copa alto con cinta (bardo: negro y rojo; invocador: rosa con cruz blanca)
fitKind('head', 'x7_chistera', (p, A, s) => { const { hx, hy, side } = A, m = s.m, b = s.b || X7.rojo;
  roRow(p, hx - 9, hx + 9, hy - 4, m[1]); roRow(p, hx - 8, hx + 8, hy - 5, m[2]); roRect(p, hx - 5, hy - 13, 11, 8, m[2]); roRow(p, hx - 5, hx + 5, hy - 13, m[3]); for (let y = hy - 12; y < hy - 5; y++) { roSet(p, hx - 5, y, m[3]); roSet(p, hx + 5, y, m[1]); }
  roRow(p, hx - 5, hx + 5, hy - 7, b[2]); roRow(p, hx - 5, hx + 5, hy - 6, b[1]);
  if (s.cross && !side) { roRow(p, hx - 2, hx + 2, hy - 10, X7.blanco[4]); roRect(p, hx, hy - 12, 1, 5, X7.blanco[4]); roRow(p, hx - 2, hx + 2, hy - 10, X7.blanco[4]); } });
// cinta de karate en la frente con las puntas al viento
fitKind('head', 'x7_cinta', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m; roRow(p, hx - 8, hx + 8, hy - 6, m[3]); roRow(p, hx - 8, hx + 8, hy - 5, m[2]);
  const kx = up ? hx : side ? hx - d * 8 : hx + 7; if (side || up) for (let k = 0; k < 4; k++) { roSet(p, kx - (side ? d : 1) * k, hy - 5 + (k >> 1), m[k & 1 ? 2 : 3]); roSet(p, kx - (side ? d : -1) * k, hy - 4 + k, m[2]); } });

// ---------- tier 50: cada clase lleva su conjunto (nivel 700) ----------
const X7_T = 50, X7_LV = 700;
const X7_CLS = {
  guerrero: [L2('Vicealmirante del Mar Blanco', 'White Sea Vice Admiral'), { head: { k: 'mr_gorra', m: X7.blanco, cover: 'hat' }, body: { k: 'x7_almirante', m: X7.marino }, legs: { k: 'rm_pantalon', m: X7.marino }, feet: { k: 'boots', m: X7.negro } }, { k: 'cape', o: X7.blanco, i: X7.marino, tr: X7.oro.slice(1) }],
  mago: [L2('Navegante de Tormentas', 'Storm Navigator'), { head: { k: 'of_strawwide', m: X7.tormenta, s: X7.oro, cover: 'hat' }, body: { k: 'x7_tormenta', m: X7.tormenta }, legs: { k: 'rm_pantalon', m: X7.marino }, feet: { k: 'sandals', m: X7.cuero } }, null],
  arquero: [L2('Francotirador de Ultramar', 'Overseas Sharpshooter'), { head: { k: 'rm_gafas', m: X7.verde, cover: 'hat' }, body: { k: 'x7_tirador', m: X7.cuero }, legs: { k: 'of_cargo', m: X7.verde }, feet: { k: 'boots', m: X7.cuero } }, null],
  asesino: [L2('Agente de la Sombra Blanca', 'White Shadow Agent'), { head: { k: 'of_fedora', m: X7.gris, s: X7.negro, cover: 'hat' }, body: { k: 'x7_agente', m: X7.negro }, legs: { k: 'rm_pantalon', m: X7.negro }, feet: { k: 'rm_zapato', m: X7.negro } }, null],
  bardo: [L2('Caballero del Barco Fantasma', 'Ghost Ship Gentleman'), { head: { k: 'x7_chistera', m: X7.negro, b: X7.rojo, cover: 'hat' }, body: { k: 'x7_fantasma', m: X7.negro }, legs: { k: 'sy_rayas', m: X7.gris, s: X7.negro }, feet: { k: 'rm_zapato', m: X7.negro } }, { k: 'cape', o: X7.negro, i: X7.rojo, tr: X7.oro.slice(1) }],
  invocador: [L2('Doctora del Invierno', 'Winter Doctor'), { head: { k: 'x7_chistera', m: X7.rosa, b: X7.marino, cross: 1, cover: 'hat' }, body: { k: 'x7_invierno', m: X7.rosa }, legs: { k: 'rm_pantalon', m: X7.marino }, feet: { k: 'boots', m: X7.blanco } }, null],
  pez: [L2('Maestro del Karate Marino', 'Sea Karate Master'), { head: { k: 'x7_cinta', m: X7.rojo }, body: { k: 'x7_gi', m: X7.blanco }, legs: { k: 'baggy', m: X7.blanco }, feet: { k: 'sandals', m: X7.cuero } }, null] };

// ---------- tiers 51-55: combinaciones de las armaduras de los mares ----------
// [tier, nivel, nombre, piezas, aspecto, conjuntos que mezcla (sus materiales)]
const X8_SETS = {
  51: [630, ['de la Pirata del Desierto', 'of the Desert Pirate'], [['Tricornio de Arena', 'Sand Tricorn'], ['Top de Monedas Rojo', 'Red Coin Top'], ['Bombachos Negros', 'Black Harem Pants'], ['Botas de Arena', 'Sand Boots']],
    { head: { k: 'ms_tricornio', m: MS.arena, cover: 'hat' }, body: { k: 'ms_danza', m: MS.rojo }, legs: { k: 'ms_harem', m: MS.negro }, feet: { k: 'boots', m: MS.arena } }, [45, 47]],
  52: [645, ['de la Emperatriz del Kimono', 'of the Kimono Empress'], [['Horquillas de Jade', 'Jade Hairpins'], ['Kimono Morado con Cuerda', 'Purple Rope Kimono'], ['Falda Roja con Abertura', 'Slit Red Skirt'], ['Geta Lacada', 'Lacquered Geta']],
    { head: { k: 'id_kanzashi', m: MS.verde, p: MS.oro }, body: { k: 'ms_kimono', m: MS.morado }, legs: { k: 'ms_falda_raja', m: MS.rojo }, feet: { k: 'of_geta', m: MS.negro } }, [46, 48]],
  53: [660, ['del Capitán del Futuro', 'of the Future Captain'], [['Cascos Dorados', 'Golden Headphones'], ['Abrigo de Capitán Estelar', 'Star Captain’s Coat'], ['Mallas Negras', 'Black Leggings'], ['Botas Negras del Futuro', 'Black Future Boots']],
    { head: { k: 'ms_cascos', m: MS.oro }, body: { k: 'ms_capitan', m: MS.rojo }, legs: { k: 'ms_mallas', m: MS.negro }, feet: { k: 'ms_botas', m: MS.negro } }, [47, 49]],
  54: [675, ['de la Bailarina del Rey del Mar', 'of the Sea King’s Dancer'], [['Kasa Rosa', 'Pink Kasa'], ['Top de Monedas de Jade', 'Jade Coin Top'], ['Hakama Roja', 'Red Hakama'], ['Sandalias del Mar', 'Sea Sandals']],
    { head: { k: 'of_kasa', m: MS.rosa, cover: 'hat' }, body: { k: 'ms_danza', m: MS.verde }, legs: { k: 'baggy', m: MS.rojo }, feet: { k: 'sandals', m: MS.arena } }, [45, 48]],
  55: [690, ['de la Serpiente del Futuro', 'of the Future Serpent'], [['Cascos Morados', 'Purple Headphones'], ['Vestido de Escamas Blancas', 'White Scaled Gown'], ['Falda Blanca con Abertura', 'Slit White Skirt'], ['Botas Moradas del Futuro', 'Purple Future Boots']],
    { head: { k: 'ms_cascos', m: MS.morado }, body: { k: 'ms_serpiente', m: MS.blanco }, legs: { k: 'ms_falda_raja', m: MS.blanco }, feet: { k: 'ms_botas', m: MS.morado } }, [46, 49]] };
const X8_TIERS = Object.keys(X8_SETS).map(Number);

// ---------- aspecto ----------
{ const _gv = gearVis; gearVis = function (cls, slot, t) { if (slot !== 'weapon') { if (t === X7_T) { const C_ = X7_CLS[cls] || X7_CLS.guerrero; if (C_[1][slot]) return Object.assign({ t }, C_[1][slot]); }
  const S = X8_SETS[t]; if (S && S[3][slot]) return Object.assign({ t }, S[3][slot]); } return _gv.apply(this, arguments); }; }
{ const _cg = cleanGear; cleanGear = function (g) { const o = _cg.apply(this, arguments); for (const k of ['head', 'body', 'legs', 'feet']) { const v = g && +g[k]; if (v === X7_T || X8_SETS[v]) o[k] = v; } return o; }; }
{ const _fi = fitItems; fitItems = function (only) { const out = _fi.apply(this, arguments); for (const t of [X7_T].concat(X8_TIERS)) for (const c of AP_CLASSES) for (const slot of ['head', 'body', 'legs', 'feet']) { const it_ = { id: `${c}:${slot}:${t}`, kind: 'gear', cls: c, slot, t }; if (!only || it_.id.includes(only)) out.push(it_); } return out; }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos) { const L = _hl.apply(this, arguments); try { if (!L || !gear) return L; const bt = +gear.body, freeBack = !(cos && cos.back && COSM[cos.back]) && !(app && app.evo);
  if (bt === X7_T && freeBack) { const C_ = X7_CLS[cls] || X7_CLS.guerrero; L.back = C_[2] ? Object.assign({}, C_[2]) : null; if (cls === 'asesino') L.scarf = null; }
  if (X8_SETS[bt] && freeBack) { L.back = null; if (cls === 'asesino') L.scarf = null; }
  const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c); if (L.top && (L.top.k === 'x7_gi' || L.top.k === 'ms_danza')) L.top = Object.assign({}, L.top, { sk: SK }); if (L.bot && L.bot.k === 'ms_falda_raja') L.bot = Object.assign({}, L.bot, { sk: SK }); } catch (e) { } return L; }; }

// ---------- objetos y recetas ----------
const X_PARTS = [['h', 'head', 0.45, 1.5, ['helm', 15]], ['b', 'body', 1, 3.5, ['armor', 15]], ['l', 'legs', 0.6, 2, ['legs', 15]], ['f', 'feet', 0.35, 0, ['boots', 15]]];
function xArmor(t, lv, nm, partNames, d, mats, gold, mul) { TIER[t] = { k: 'mar' + t, m: nm, f: nm, mp: nm, fp: nm, lv, p: t }; const def = (3 + lv * 1.4 + t * 2) * mul;
  X_PARTS.forEach(([s, slot, dm, hm, icon], k) => { const o = { n: partNames[k], t: 'armor', slot, lv, tier: t, def: Math.round(def * dm), price: Math.round(20 * Math.pow(t, 2.3) * dm), icon, rar: 5, d, ms: 1 };
    if (hm) o.hpB = Math.round(lv * hm * mul); else o.spdB = 12; it(`${s}_${t}`, o); RECIPES.push({ id: `r_${s}_${t}`, job: 'herreria', out: `${s}_${t}`, n: 1, lv, jlv: 1, gold, mats, cat: 'armadura' }); }); }
{ const nm = L2('de Clase de los Mares', 'of the Sea Classes'), looks = AP_CLASSES.map(c => CLASSES[c].n + ': ' + (X7_CLS[c] || X7_CLS.guerrero)[0]).join(' · ');
  const P_ = [L2('Tocado de Clase de los Mares', 'Sea Class Headpiece'), L2('Traje de Clase de los Mares', 'Sea Class Garb'), L2('Pantalón de Clase de los Mares', 'Sea Class Trousers'), L2('Calzado de Clase de los Mares', 'Sea Class Footwear')];
  xArmor(X7_T, X7_LV, nm, P_, L2('Armadura de los mares de nivel 700. Cada clase la lleva con su propio diseño. ', 'Level 700 sea armour. Each class wears it with its own design. ') + looks, [['ore25', 18], ['log25', 16], ['ore24', 10]], 4000000, 1.1);
  TIERP[X7_T] = X7.marino; }
for (const t of X8_TIERS) { const [lv, n, parts, vis, mix] = X8_SETS[t], nm = L2(n[0], n[1]), mixN = mix.map(m => MS_SETS[m] ? L2(MS_SETS[m].n[0], MS_SETS[m].n[1]).replace(/^(de la |del |of the )/, '') : m).join(' + ');
  const mats = []; for (const m of mix) for (const [id, q] of MS_SETS[m].mats) { const e = mats.find(x => x[0] === id); if (e) e[1] += Math.ceil(q / 2); else mats.push([id, Math.ceil(q / 2)]); }
  xArmor(t, lv, nm, parts.map(p => L2(p[0], p[1])), L2('Combinación de armaduras de los mares: ', 'Sea armour combination: ') + mixN + L2('. Cualquier clase.', '. Any class.'), mats, 450000 * (t - 45), 1.07); TIERP[t] = vis.body.m; }

// ---------- Lupa ----------
if (typeof LUPA_DAWN !== 'undefined') { const g = LUPA_DAWN.find(x => x[0] === 'mares601'); if (g) { const f = g[2]; g[2] = () => f().concat([
  L2('Combinaciones (Herrería, mitad de los materiales de cada conjunto que mezclan): Pirata del Desierto (630), Emperatriz del Kimono (645), Capitán del Futuro (660), Bailarina del Rey del Mar (675) y Serpiente del Futuro (690).', 'Combinations (Forge, half the materials of each set they mix): Desert Pirate (630), Kimono Empress (645), Future Captain (660), Sea King’s Dancer (675) and Future Serpent (690).'),
  L2('Armadura de Clase de los Mares (nivel 700): cada clase con su diseño — Guerrero Vicealmirante, Mago Navegante de Tormentas, Arquero Francotirador, Asesino Agente de la Sombra Blanca, Bardo Caballero del Barco Fantasma, Invocador Doctora del Invierno y Hombre-pez Maestro del Karate Marino.', 'Sea Class armour (level 700): each class with its own design — Warrior Vice Admiral, Mage Storm Navigator, Archer Sharpshooter, Assassin White Shadow Agent, Bard Ghost Ship Gentleman, Summoner Winter Doctor and Fishfolk Sea Karate Master.')]); } }

// Lupa › Sistemas: también allí (Sergio: «la guía de armaduras y materiales nuevos en Sistemas»)
if (typeof GSIS !== 'undefined') GSIS.unshift(['mares602', '⚓ ' + L2('Nivel 700: materiales y armaduras de los mares', 'Level 700: sea materials and armours'), () => [
  L2('Nivel máximo 700. Las armaduras nuevas se forjan en la Herrería con minerales y maderas de las islas del Mar de Dawn (reaparecen a los 5 segundos).', 'Level cap 700. The new armours are forged at the Forge with ores and woods from the Dawn Sea islands (they respawn after 5 seconds).'),
  L2('Materiales: Coralita y Palma de Coral (Foosha, Shells Town, Orange Town) · Nacarita y Árbol Frutal Raro (Shells, Orange, Animales Raros, Villa Syrup) · Piedra del Mar y Árbol Rey (Animales Raros, Villa Syrup). Herramientas de Coralita (620), Nacarita (650) y Piedra del Mar (680).', 'Materials: Coralite and Coral Palm (Foosha, Shells Town, Orange Town) · Nacrite and Rare Fruit Tree (Shells, Orange, Rare Animals, Syrup Village) · Seastone and King Tree (Rare Animals, Syrup Village). Coralite (620), Nacrite (650) and Seastone (680) tools.'),
  L2('Armaduras de los mares (cualquier clase): Bailarina del Desierto 620 · Emperatriz Serpiente 640 · Capitán del Abrigo Negro 660 · Kimono del Rey del Mar 680 · Traje del Futuro 700.', 'Sea armours (any class): Desert Dancer 620 · Serpent Empress 640 · Black-Coat Captain 660 · Sea King’s Kimono 680 · Future Suit 700.'),
  L2('Combinaciones (mitad de los materiales de los dos conjuntos): Pirata del Desierto 630 · Emperatriz del Kimono 645 · Capitán del Futuro 660 · Bailarina del Rey del Mar 675 · Serpiente del Futuro 690.', 'Combinations (half the materials of both sets): Desert Pirate 630 · Kimono Empress 645 · Future Captain 660 · Sea King’s Dancer 675 · Future Serpent 690.'),
  L2('Armadura de Clase de los Mares (700, la más fuerte): Guerrero Vicealmirante · Mago Navegante de Tormentas · Arquero Francotirador · Asesino Agente de la Sombra Blanca · Bardo Caballero del Barco Fantasma · Invocador Doctora del Invierno · Hombre-pez Maestro del Karate Marino.', 'Sea Class armour (700, the strongest): Warrior Vice Admiral · Mage Storm Navigator · Archer Sharpshooter · Assassin White Shadow Agent · Bard Ghost Ship Gentleman · Summoner Winter Doctor · Fishfolk Sea Karate Master.')],
  () => null]);
