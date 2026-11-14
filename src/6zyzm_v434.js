// ================= v4.34: OFICIOS MÁS ÚTILES =================
// Cocina en hogueras (50 platos con dibujo, recetas de cada reino, platos peruanos, plato perfecto), pesca legendaria
// (12 peces según clima, estación y hora) con colección de peces dibujados en el bestiario, alquimia experimental,
// arqueología (oficio nuevo) y forja artesanal (núcleo, temple y runa).
SAVEKEYS.push('ofi');
function ofi() { const P = G.P; const o = P.ofi = P.ofi || {}; o.fish = o.fish || {}; o.cook = o.cook || {}; o.alq = o.alq || {}; o.arq = o.arq || {}; o.arqT = o.arqT || {}; return o; }
const OF_REG = { valle: L2('Valle de Albor', 'Albor Valley'), costa: L2('Costa Coral', 'Coral Coast'), arxar: L2('Arxar', 'Arxar'), desierto: L2('Desierto de Sahrim', 'Sahrim Desert'), selva: L2('Selva de Yarakai', 'Yarakai Jungle'), volcan: L2('Tierras de Brasa', 'Ember Lands') };
const OF_TOWNREG = { albor: 'valle', puerto: 'costa', arxar: 'arxar', sahrim: 'desierto', yarakai: 'selva', brasa: 'volcan' };
function ofHour() { return Math.floor(((G.time || 0) % 1440) / 60); }

// =====================================================================================
// INGREDIENTES (los vende la despensa de cada hoguera)
// =====================================================================================
const IG = [['papa', 'Papa', 'Potato', '#c8a060'], ['aji', 'Ají amarillo', 'Yellow chili', '#ffb020'], ['limon', 'Limón', 'Lime', '#8ad040'], ['maiz', 'Maíz', 'Corn', '#ffe040'], ['camote', 'Camote', 'Sweet potato', '#e8803a'],
  ['cebolla', 'Cebolla morada', 'Red onion', '#a03a8a'], ['arroz', 'Arroz', 'Rice', '#f4f4ec'], ['carne', 'Carne', 'Meat', '#a83a2a'], ['pollo', 'Pollo', 'Chicken', '#f0c890'], ['queso', 'Queso', 'Cheese', '#ffe8a0'],
  ['huevo', 'Huevo', 'Egg', '#fff8e8'], ['leche', 'Leche', 'Milk', '#ffffff'], ['azucar', 'Azúcar', 'Sugar', '#f8f0ff'], ['platano', 'Plátano', 'Plantain', '#e8d040'], ['hoja', 'Hoja de bijao', 'Bijao leaf', '#3a8a3a'], ['maizmorado', 'Maíz morado', 'Purple corn', '#5a1a6a']];
for (const [id, es, en, c] of IG) it('ig_' + id, { n: L2(es, en), t: 'mat', stack: true, tier: 1, price: 6, icon: ['ofi', 'ig_' + id], ing: 1 });

// =====================================================================================
// 50 PLATOS: [id, es, en, región ('' = en cualquier hoguera), plantilla, colores, efecto, nivel 1-5, ingredientes]
// efectos: atk def spd aspd crit hp regen xp gold job
// =====================================================================================
const PL = [
  // Perú (Sergio es de Perú): reales, repartidos por la región que más se parece
  ['ceviche', 'Ceviche', 'Ceviche', 'costa', 'ceviche', ['#f4f0e8', '#a03a8a', '#ffe040'], 'crit', 3, [['lubina', 1], ['ig_limon', 2], ['ig_cebolla', 1], ['ig_aji', 1], ['ig_camote', 1]]],
  ['tiradito', 'Tiradito', 'Tiradito', 'costa', 'fishplate', ['#f8d8c8', '#ffb020', '#8ad040'], 'crit', 2, [['salmon', 1], ['ig_limon', 1], ['ig_aji', 1]]],
  ['chupe', 'Chupe de camarones', 'Shrimp chowder', 'costa', 'bowl', ['#f0903a', '#fff8e8', '#ff5a3a'], 'hp', 3, [['perca', 1], ['ig_leche', 1], ['ig_papa', 1], ['ig_huevo', 1]]],
  ['arrozmariscos', 'Arroz con mariscos', 'Seafood rice', 'costa', 'plate', ['#f0a040', '#ff6a4a', '#8ad040'], 'regen', 3, [['sardina', 2], ['ig_arroz', 2], ['ig_aji', 1]]],
  ['causa', 'Causa limeña', 'Causa limeña', 'costa', 'layer', ['#ffd040', '#f4f0e8', '#8ad040'], 'def', 2, [['ig_papa', 2], ['ig_aji', 1], ['ig_limon', 1], ['ig_pollo', 1]]],
  ['suspiro', 'Suspiro limeño', 'Suspiro limeño', 'costa', 'cup', ['#f0c870', '#fff8f0', '#c87a3a'], 'xp', 2, [['ig_leche', 2], ['ig_azucar', 2], ['ig_huevo', 1]]],
  ['lomo', 'Lomo saltado', 'Lomo saltado', '', 'saltado', ['#7a2a1a', '#ffd870', '#f4f4ec'], 'atk', 3, [['ig_carne', 2], ['ig_papa', 1], ['ig_cebolla', 1], ['ig_arroz', 1]]],
  ['ajigallina', 'Ají de gallina', 'Ají de gallina', 'valle', 'plate', ['#ffc830', '#f4f4ec', '#3a2a1a'], 'hp', 2, [['ig_pollo', 1], ['ig_aji', 2], ['ig_leche', 1], ['ig_arroz', 1]]],
  ['anticuchos', 'Anticuchos', 'Anticuchos', 'valle', 'skewer', ['#8a2a1a', '#c84a2a', '#ffd040'], 'atk', 2, [['ig_carne', 2], ['ig_aji', 1], ['ig_papa', 1]]],
  ['picarones', 'Picarones', 'Picarones', 'valle', 'rings', ['#d8903a', '#7a3a0a', '#ffd870'], 'spd', 1, [['ig_camote', 1], ['ig_azucar', 1], ['trigo', 1]]],
  ['mazamorra', 'Mazamorra morada', 'Purple corn pudding', 'valle', 'cup', ['#5a1a5a', '#8a3a8a', '#f0c870'], 'regen', 1, [['ig_maizmorado', 2], ['ig_azucar', 1]]],
  ['chicha', 'Chicha morada', 'Chicha morada', '', 'drink', ['#4a0a4a', '#8a2a8a', '#8ad040'], 'aspd', 1, [['ig_maizmorado', 2], ['ig_limon', 1]]],
  ['huancaina', 'Papa a la huancaína', 'Huancaína potatoes', 'arxar', 'plate', ['#ffd040', '#e8c890', '#3a2a1a'], 'def', 1, [['ig_papa', 2], ['ig_queso', 1], ['ig_aji', 1]]],
  ['pachamanca', 'Pachamanca', 'Pachamanca', 'arxar', 'pot', ['#8a5a2a', '#c8a060', '#3a8a3a'], 'hp', 4, [['ig_carne', 2], ['ig_papa', 2], ['ig_camote', 1], ['ig_maiz', 1], ['herb3', 1]]],
  ['rocoto', 'Rocoto relleno', 'Stuffed rocoto', 'arxar', 'plate', ['#e02a1a', '#ffe8a0', '#c8a060'], 'atk', 4, [['ig_aji', 2], ['ig_carne', 1], ['ig_queso', 1], ['ig_huevo', 1]]],
  ['juane', 'Juane', 'Juane', 'selva', 'leaf', ['#3a8a3a', '#c8a050', '#ffd040'], 'regen', 2, [['ig_hoja', 1], ['ig_arroz', 2], ['ig_pollo', 1], ['ig_huevo', 1]]],
  ['tacacho', 'Tacacho con cecina', 'Tacacho with cecina', 'selva', 'plate', ['#d8b040', '#a83a2a', '#8ad040'], 'atk', 3, [['ig_platano', 2], ['ig_carne', 1]]],
  ['patarashca', 'Patarashca', 'Patarashca', 'selva', 'leaf', ['#2a7a2a', '#e8a070', '#ffb020'], 'crit', 4, [['arapaima', 1], ['ig_hoja', 1], ['ig_aji', 1]]],
  ['arrozpollo', 'Arroz con pollo', 'Chicken rice', '', 'plate', ['#4a9a3a', '#f0c890', '#ffe040'], 'job', 2, [['ig_arroz', 2], ['ig_pollo', 1], ['ig_maiz', 1]]],
  ['chicharron', 'Chicharrón con camote', 'Chicharrón with sweet potato', '', 'plate', ['#c8702a', '#e8803a', '#a03a8a'], 'atk', 2, [['ig_carne', 2], ['ig_camote', 1], ['ig_cebolla', 1]]],
  ['seco', 'Seco con frejoles', 'Seco with beans', '', 'plate', ['#3a6a2a', '#7a4a2a', '#f4f4ec'], 'def', 3, [['ig_carne', 2], ['ig_arroz', 1], ['herb2', 1]]],
  ['tamal', 'Tamal', 'Tamal', '', 'leaf', ['#c8b060', '#ffd040', '#a83a2a'], 'regen', 1, [['ig_maiz', 2], ['ig_hoja', 1], ['ig_pollo', 1]]],
  ['alfajor', 'Alfajor', 'Alfajor', '', 'cake', ['#e8c890', '#c87a3a', '#ffffff'], 'gold', 1, [['trigo', 1], ['ig_azucar', 1], ['ig_leche', 1]]],
  ['papasrellenas', 'Papa rellena', 'Stuffed potato', '', 'pie', ['#d8a050', '#a83a2a', '#ffd040'], 'hp', 1, [['ig_papa', 2], ['ig_carne', 1], ['ig_huevo', 1]]],
  // Valle de Albor
  ['estofado', 'Estofado de Albor', 'Albor stew', 'valle', 'pot', ['#8a4a2a', '#e8803a', '#6ad040'], 'hp', 1, [['ig_carne', 1], ['ig_papa', 1], ['herb1', 1]]],
  ['panmiel', 'Pan de miel', 'Honey bread', 'valle', 'bread', ['#d8a050', '#ffc030', '#fff0c0'], 'xp', 1, [['trigo', 2], ['ig_azucar', 1]]],
  ['pastelmanzana', 'Pastel de manzana', 'Apple pie', 'valle', 'cake', ['#d8a050', '#c83a2a', '#fff0c0'], 'gold', 2, [['trigo', 2], ['ig_azucar', 1], ['ig_huevo', 1]]],
  // Costa Coral
  ['sopacoral', 'Sopa coral', 'Coral soup', 'costa', 'bowl', ['#ff7a5a', '#ffd0c0', '#3a8ad0'], 'regen', 1, [['sardina', 1], ['ig_cebolla', 1], ['herb1', 1]]],
  ['brocheta', 'Brocheta marina', 'Sea skewer', 'costa', 'skewer', ['#e8a070', '#8ad040', '#ff6a4a'], 'aspd', 2, [['lubina', 1], ['ig_cebolla', 1], ['ig_aji', 1]]],
  ['paella', 'Paella del puerto', 'Port paella', 'costa', 'pan', ['#f0c030', '#ff6a4a', '#8ad040'], 'gold', 4, [['pezespada', 1], ['ig_arroz', 2], ['ig_pollo', 1], ['ig_limon', 1]]],
  // Arxar
  ['asado', 'Asado real', 'Royal roast', 'arxar', 'roast', ['#a8501a', '#ffe0a0', '#3a8a3a'], 'atk', 5, [['ig_carne', 3], ['ig_papa', 2], ['herb5', 1]]],
  ['sopamontana', 'Sopa de montaña', 'Mountain soup', 'arxar', 'bowl', ['#c8a060', '#f4f4ec', '#6ad040'], 'def', 2, [['ig_papa', 1], ['ig_queso', 1], ['ig_maiz', 1]]],
  ['pastelciudadela', 'Pastel de la Ciudadela', 'Citadel cake', 'arxar', 'cake', ['#f0e0c0', '#8a2a8a', '#ffd040'], 'xp', 4, [['trigo', 2], ['ig_azucar', 2], ['ig_leche', 1], ['ig_huevo', 2]]],
  // Desierto de Sahrim
  ['cuscus', 'Cuscús del oasis', 'Oasis couscous', 'desierto', 'plate', ['#e8c870', '#e8803a', '#6ad040'], 'regen', 3, [['trigo', 2], ['ig_carne', 1], ['herb2', 1]]],
  ['tementa', 'Té de menta', 'Mint tea', 'desierto', 'drink', ['#6aa040', '#c8e8a0', '#ffffff'], 'spd', 2, [['herb1', 2], ['ig_azucar', 1]]],
  ['datiles', 'Dátiles con miel', 'Honey dates', 'desierto', 'plate', ['#7a3a1a', '#ffc030', '#f4f4ec'], 'aspd', 3, [['ig_azucar', 2], ['herb3', 1]]],
  ['kebab', 'Kebab de Sahrim', 'Sahrim kebab', 'desierto', 'skewer', ['#a8501a', '#ffe0a0', '#e02a1a'], 'atk', 4, [['ig_carne', 2], ['ig_cebolla', 1], ['ig_aji', 1]]],
  // Selva de Yarakai
  ['frutatropical', 'Bol de frutas tropicales', 'Tropical fruit bowl', 'selva', 'bowl', ['#ff8a3a', '#ffe040', '#e03a6a'], 'spd', 1, [['ig_platano', 1], ['melon', 1]]],
  ['cacaocaliente', 'Cacao caliente', 'Hot cocoa', 'selva', 'drink', ['#5a2a10', '#a8603a', '#ffffff'], 'xp', 3, [['ig_leche', 1], ['ig_azucar', 1], ['herb4', 1]]],
  ['pescadohoja', 'Pescado en hoja', 'Leaf-baked fish', 'selva', 'leaf', ['#2a7a2a', '#f8d8b8', '#ffb020'], 'def', 3, [['pezoasis', 1], ['ig_hoja', 1], ['ig_limon', 1]]],
  // Tierras de Brasa
  ['guisolava', 'Guiso de lava', 'Lava stew', 'volcan', 'pot', ['#e0401a', '#ffb020', '#3a1a10'], 'atk', 3, [['ig_carne', 1], ['ig_aji', 3]]],
  ['costillas', 'Costillas de brasa', 'Ember ribs', 'volcan', 'roast', ['#8a2a10', '#ff8a2a', '#ffe0a0'], 'hp', 4, [['ig_carne', 3], ['ig_aji', 1], ['ig_azucar', 1]]],
  ['pimientos', 'Pimientos de fuego', 'Fire peppers', 'volcan', 'plate', ['#e02a1a', '#ffb020', '#3a8a3a'], 'crit', 2, [['ig_aji', 2], ['ig_queso', 1]]],
  // de cualquier hoguera
  ['sopaverduras', 'Sopa de verduras', 'Vegetable soup', '', 'bowl', ['#8ac050', '#e8803a', '#ffe040'], 'regen', 1, [['ig_papa', 1], ['ig_maiz', 1], ['herb1', 1]]],
  ['tortilla', 'Tortilla de papa', 'Potato omelette', '', 'cake', ['#ffd060', '#c8902a', '#fff0c0'], 'def', 1, [['ig_huevo', 2], ['ig_papa', 1]]],
  ['empanada', 'Empanada', 'Empanada', '', 'pie', ['#e0a050', '#a83a2a', '#ffd040'], 'job', 1, [['trigo', 1], ['ig_carne', 1], ['ig_cebolla', 1]]],
  ['sandwich', 'Pan con chicharrón', 'Chicharrón sandwich', '', 'bread', ['#e0b060', '#c8702a', '#a03a8a'], 'atk', 1, [['trigo', 1], ['ig_carne', 1], ['ig_camote', 1]]],
  ['guisoaventurero', 'Guiso del aventurero', 'Adventurer stew', '', 'pot', ['#7a5a3a', '#e8c070', '#6ad040'], 'job', 3, [['ig_carne', 1], ['ig_papa', 1], ['ig_maiz', 1], ['herb2', 1]]],
  // con peces legendarios
  ['festinlegendario', 'Festín legendario', 'Legendary feast', '', 'roast', ['#3a6ad0', '#ffd040', '#ff6a4a'], 'xp', 5, [['leg_rey', 1], ['ig_arroz', 2], ['ig_limon', 2]]],
  ['cevicheimperial', 'Ceviche imperial', 'Imperial ceviche', '', 'ceviche', ['#ffe8f0', '#ffd040', '#a03a8a'], 'crit', 5, [['leg_koi', 1], ['ig_limon', 3], ['ig_aji', 1], ['ig_cebolla', 1]]],
];
const PL_FX = { atk: ['atkP', 3, L2('ataque', 'attack')], def: ['defP', 4, L2('defensa', 'defence')], spd: ['spdP', 4, L2('velocidad', 'speed')], aspd: ['aspdP', 3, L2('vel. de ataque', 'attack speed')], crit: ['pcrit', 2, L2('crítico', 'crit')],
  hp: ['phpP', 4, L2('vida máx.', 'max HP')], regen: ['pregen', 0.4, L2('vida por segundo (% vida)', 'HP per second (% HP)')], xp: ['pxp', 5, L2('experiencia', 'experience')], gold: ['pgold', 6, L2('oro de enemigos', 'gold from enemies')], job: ['pjob', 6, L2('exp. de oficios', 'job experience')] };
const PL_JLV = [0, 1, 10, 22, 36, 50];
function plFxVal(d, perfect) { const f = PL_FX[d[6]]; return +(f[1] * d[7] * (perfect ? 1.5 : 1)).toFixed(1); }
function plTxt(d, perfect) { const f = PL_FX[d[6]]; return '+' + plFxVal(d, perfect) + (d[6] === 'regen' ? '' : '%') + ' ' + f[2]; }
for (const d of PL) { const [id, es, en, reg, , , , t] = d; for (const pf of [0, 1]) it((pf ? 'plp_' : 'pl_') + id, { n: L2(es, en) + (pf ? ' ★' : ''), t: 'cons', stack: true, tier: t, heal: 80 * t * t + 40, plato: id, perfect: pf, price: 30 * t * t + 20, icon: ['ofi', 'pl_' + id], rar: pf ? Math.min(4, t) : t >= 4 ? 2 : t >= 3 ? 1 : 0 }); }
function plDef(id) { return PL.find(d => d[0] === id); }
// el efecto se aplica como mejora "plato" (una a la vez)
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P.inv[idx], it_ = s && ITEMS[s.id]; const r = _ui.apply(this, arguments);
    if (it_ && it_.plato) { const d = plDef(it_.plato), f = PL_FX[d[6]], st = {}; st[f[0]] = plFxVal(d, it_.perfect); addBuff(P, 'plato', st, it_.perfect ? 480 : 300); toast('🍽 ' + it_.n + ': ' + plTxt(d, it_.perfect) + ' (' + (it_.perfect ? 8 : 5) + ' min)', 'quest'); }
    return r; }; }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs(P); const b = P && P.buff; if (b && P.S) { if (b.pcrit) P.S.crit = Math.min(80, P.S.crit + b.pcrit); if (b.phpP) P.S.maxhp = Math.round(P.S.maxhp * (1 + b.phpP / 100)); } return r; }; }
{ const _gx = gainXp; gainXp = function (n) { const b = G.P && G.P.buff; return _gx.call(this, b && b.pxp ? Math.round(n * (1 + b.pxp / 100)) : n); }; }
{ const _gj = gainJobXp; gainJobXp = function (job, n) { const b = G.P && G.P.buff; return _gj.call(this, job, b && b.pjob ? Math.max(1, Math.round(n * (1 + b.pjob / 100))) : n); }; }
{ const _km = killMob; killMob = function (m) { const b = G.P && G.P.buff; if (b && b.pgold && m && m.gold) m.gold = Math.round(m.gold * (1 + b.pgold / 100)); return _km.apply(this, arguments); }; }
let plRegT = 0; V33_TICKS.push(dt => { const P = G.P; if (!P || !P.buff || !P.buff.pregen || P.dead || !P.S) return; plRegT += dt || 0; if (plRegT < 1) return; plRegT = 0; P.hp = Math.min(P.S.maxhp, P.hp + P.S.maxhp * P.buff.pregen / 100); });

// ---------- hogueras en el mundo ----------
const OF_GROUND = M => i => [T.GRASS, T.DIRT, T.SAND, T.SNOW, T.ASH, T.MUD].includes(M.ter[i]);
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  for (const tk in OF_TOWNREG) { const t = TOWNS.find(t => t.k === tk); if (!t) continue; const o = putNear(W, 'ofi_hoguera', t.x1 + 3, Math.round((t.y0 + t.y1) / 2) + 2, [[0, 0]], { xact: 'ofi_fire', reg: OF_TOWNREG[tk], tk, light: 1 }, OF_GROUND(W)); }
  for (const k of ['bosque', 'llanuras', 'colinas', 'pantano', 'picos', 'desierto', 'selva', 'cristal']) { const w = WAYSTONES.find(w => w.k === k); if (w) putNear(W, 'ofi_hoguera', w.x + 3, w.y + 2, [[0, 0]], { xact: 'ofi_fire', reg: '', light: 1 }, OF_GROUND(W)); } }; }
XACT.ofi_fire = [L2('Cocinar en la hoguera', 'Cook at the campfire'), 'food', o => plOpen(o)];
{ const _ge = genFurn2; genFurn2 = function (kind, f) { if (kind !== 'ofi_hoguera') return _ge.apply(this, arguments);
  const p = new Pix(30, 30), D = C, st = pal(['#3a3a40', '#5a5a64', '#8a8a96']); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28; p.ball(15 + Math.cos(a) * 10, 23 + Math.sin(a) * 4, 2.5, 2, st); }
  p.line(8, 25, 22, 20, WOOD[1]); p.line(8, 20, 22, 25, WOOD[2]); p.vl(4, 6, 20, IRON[1]); p.vl(26, 6, 20, IRON[1]); p.hl(4, 6, 23, IRON[2]); p.rect(11, 7, 9, 7, IRON[0]); p.hl(11, 7, 9, IRON[2]); p.rect(12, 8, 7, 2, D('#c8702a'));
  p.outline(D('#1a1010')); return { c: p.canvas(), ax: 15, ay: 28 }; }; }
// fuego animado encima de la hoguera
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || !M.isWorld) return; for (const o of M.objs) { if (o.xact !== 'ofi_fire') continue; const sx = o.px - cx, sy = o.py - cy; if (sx < -20 || sy < -40 || sx > VW + 20 || sy > VH + 20) continue;
    const t = G.t * 8 + o.tx; for (let k = 0; k < 5; k++) { const h = 6 + ((k * 7 + Math.floor(t)) % 5); ctx.fillStyle = ['#ff4a1a', '#ff8a2a', '#ffd040', '#ff6a1a', '#fff0a0'][k]; ctx.fillRect(Math.round(sx - 5 + k * 2 + Math.sin(t + k) * 0.8), Math.round(sy - 12 - h), 2, h); } } });
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl.apply(this, arguments); if (M && M.isWorld && Array.isArray(out)) for (const o of M.objs) if (o.xact === 'ofi_fire') out.push({ x: o.px, y: o.py - 14, r: 70, c: 'rgba(255,150,60,0.55)' }); return out; }; }

// ---------- ventana de cocina ----------
let PL_TAB = 'cook';
function plCanHere(d, o) { return !d[3] || d[3] === o.reg; }
function plHas(mats) { return mats.every(([id, n]) => countItem(id) >= n); }
function plOpen(o, tab) {
  if (tab) PL_TAB = tab; const P = G.P, jl = (P.jobs.cocina || { lv: 1 }).lv, C_ = ofi().cook, reg = o.reg ? OF_REG[o.reg] : L2('hoguera de camino', 'roadside campfire');
  let body = '';
  if (PL_TAB === 'cook') {
    const list = PL.slice().sort((a, b) => (plCanHere(b, o) - plCanHere(a, o)) || (plHas(b[8]) - plHas(a[8])) || a[7] - b[7]);
    body = `<div class="slist">${list.map(d => { const here = plCanHere(d, o), lvOk = jl >= PL_JLV[d[7]], has = plHas(d[8]), known = C_[d[0]];
      const mats = d[8].map(([id, n]) => `<span style="color:${countItem(id) >= n ? '#c8ffb0' : '#ffb0a0'}">${esc(ITEMS[id] ? ITEMS[id].n : id)} ${countItem(id)}/${n}</span>`).join(', ');
      return `<div class="srow">${iconHTML(['ofi', 'pl_' + d[0]], 32)}<div class="sn"><b>${esc(L2(d[1], d[2]))}${known ? ` <small>×${known}</small>` : ` <small style="color:#ffd040">${L2('nuevo', 'new')}</small>`}</b><small>${plTxt(d)} · ${L2('Cocina', 'Cooking')} ${PL_JLV[d[7]]}${d[3] ? ' · ' + esc(OF_REG[d[3]]) : ''}</small><small>${mats}</small></div><button class="btn sm ${here && lvOk && has ? 'gold' : ''}" data-plc="${d[0]}" ${here && lvOk && has ? '' : 'disabled'}>${!here ? L2('Otra región', 'Other region') : !lvOk ? L2('Nivel', 'Level') + ' ' + PL_JLV[d[7]] : L2('Cocinar', 'Cook')}</button></div>`; }).join('')}</div>`;
  } else {
    body = `<p class="hint">${L2('Ingredientes frescos para tus recetas. El pescado lo pescas tú y las hierbas las recoges.', 'Fresh ingredients for your recipes. You catch the fish and gather the herbs yourself.')}</p><div class="slist">${IG.map(([id]) => { const I = ITEMS['ig_' + id], pr = plIgPrice(); return `<div class="srow">${iconHTML(I.icon, 28)}<div class="sn"><b>${esc(I.n)}</b><small>${L2('tienes', 'you have')} ${countItem('ig_' + id)}</small></div><button class="btn sm" data-plb="${id}">×5 · ${fmt(pr * 5)}</button></div>`; }).join('')}</div>`;
  }
  openModal(`<h2>${iconHTML(['food', 3], 22)} ${L2('Hoguera', 'Campfire')} · ${esc(reg)}</h2><p class="hint">${L2('Cocina nivel', 'Cooking level')} ${jl} · ${L2('Cada reino tiene sus recetas: solo se cocinan en las hogueras de su región. Un plato perfecto (★) da un 50 % más y dura más.', 'Each kingdom has its own recipes: they can only be cooked at campfires in their region. A perfect dish (★) gives 50% more and lasts longer.')}</p>
    <div class="row"><button class="chip ${PL_TAB === 'cook' ? 'on' : ''}" data-plt="cook">🍲 ${L2('Recetas', 'Recipes')} (${Object.keys(C_).length}/${PL.length})</button><button class="chip ${PL_TAB === 'shop' ? 'on' : ''}" data-plt="shop">🧺 ${L2('Despensa', 'Pantry')}</button></div><div class="pvBody">${body}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; $$('#modal [data-plt]').forEach(b => b.onclick = () => plOpen(o, b.dataset.plt));
  $$('#modal [data-plb]').forEach(b => b.onclick = () => { const c = plIgPrice() * 5; if (P.gold < c) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } if (giveItem('ig_' + b.dataset.plb, 5, true)) { P.gold -= c; sfx('coin'); } plOpen(o); });
  $$('#modal [data-plc]').forEach(b => b.onclick = () => plCook(o, plDef(b.dataset.plc)));
}
function plIgPrice() { return Math.round(6 * (1 + G.P.lv / 40)); }
// minijuego: sirve el plato cuando la marca está en la zona dorada
function plCook(o, d) {
  if (!plHas(d[8])) return; let x = 0, v = 0.9 + d[7] * 0.15, raf = 0, done = false; const zw = 0.12 + Math.min(0.08, ((G.P.jobs.cocina || { lv: 1 }).lv) * 0.0015);
  openModal(`<h2>${iconHTML(['ofi', 'pl_' + d[0]], 26)} ${esc(L2(d[1], d[2]))}</h2><p class="hint">${L2('Pulsa «¡Servir!» cuando la marca esté en la zona dorada para un plato perfecto.', 'Press "Serve!" when the marker is in the golden zone for a perfect dish.')}</p>
    <div id="plBar" style="position:relative;height:26px;margin:.6em 0;border-radius:6px;background:linear-gradient(90deg,#5a1a10,#8a5a2a 30%,#4a8a3a 40%,#4a8a3a 60%,#8a5a2a 70%,#5a1a10)"><i id="plGold" style="position:absolute;top:0;bottom:0;left:${(50 - zw * 50).toFixed(1)}%;width:${(zw * 100).toFixed(1)}%;background:rgba(255,208,64,.85);border-radius:4px"></i><i id="plMk" style="position:absolute;top:-4px;bottom:-4px;width:4px;background:#fff;box-shadow:0 0 4px #000"></i></div>
    <div class="row"><button class="btn gold" id="plGo">${L2('¡Servir!', 'Serve!')}</button></div>`, 'party');
  const mk = $('#plMk'), t0 = performance.now(); const loop = () => { if (done || !document.getElementById('plMk')) return; x = (Math.sin((performance.now() - t0) / 1000 * v * 2.2) + 1) / 2; mk.style.left = (x * 100).toFixed(1) + '%'; raf = requestAnimationFrame(loop); }; loop();
  $('#plGo').onclick = () => { if (done) return; done = true; cancelAnimationFrame(raf); const dd = Math.abs(x - 0.5), perfect = dd <= zw / 2, ok = dd <= 0.2;
    for (const [id, n] of d[8]) takeItem(id, n); const C_ = ofi().cook, first = !C_[d[0]]; C_[d[0]] = (C_[d[0]] || 0) + 1;
    giveItem((perfect ? 'plp_' : 'pl_') + d[0], ok ? 2 : 1); gainJobXp('cocina', 8 + d[7] * 10 + (perfect ? 10 : 0)); sfx(perfect ? 'level' : 'coin');
    if (first) { toast('📖 ' + L2('¡Receta nueva: ', 'New recipe: ') + L2(d[1], d[2]) + '!', 'quest', 5); if (d[3] && typeof pvLog === 'function') pvLog(G.P.name + L2(' ha cocinado ', ' cooked ') + L2(d[1], d[2]) + L2(' por primera vez.', ' for the first time.'), '', 'good'); }
    floatText(G.P.x, G.P.y - 44, perfect ? L2('¡Perfecto!', 'Perfect!') : ok ? L2('¡Rico!', 'Tasty!') : L2('Un poco quemado', 'A bit burnt'), perfect ? '#ffd040' : ok ? '#8aff8a' : '#ffb08a', perfect);
    markDirty(true); setTimeout(() => plOpen(o), 450); };
}

// =====================================================================================
// PESCA LEGENDARIA: [id, es, en, hábitats, clima ('' = cualquiera), estación (-1 = cualquiera), horas [desde, hasta], forma, colores, bendición]
// =====================================================================================
const LEGF = [
  ['leg_rey', 'Rey de la Tormenta', 'Storm King', ['mar'], ['storm'], -1, [0, 24], 'sword', ['#2a4a8a', '#8ab0e8', '#ffd040'], ['atkP', 8]],
  ['leg_dama', 'Dama de la Niebla', 'Lady of the Mist', ['lago'], ['fog'], -1, [5, 10], 'flat', ['#c8d0e0', '#ffffff', '#8a9ab8'], ['defP', 10]],
  ['leg_koi', 'Koi Lunar', 'Moon Koi', ['lago', 'rio'], ['clear', 'cloudy'], 1, [0, 4], 'koi', ['#f8f8ff', '#ff6a3a', '#ffd040'], ['pcrit', 5]],
  ['leg_sierpe', 'Sierpe de Escarcha', 'Frost Serpent', ['hielo'], ['snow'], 0, [0, 24], 'eel', ['#6ac8f0', '#e0f8ff', '#2a6aa0'], ['phpP', 10]],
  ['leg_carpa', 'Carpa del Sol Naciente', 'Rising Sun Carp', ['rio'], ['clear', 'hot'], 2, [6, 9], 'koi', ['#ff8a1a', '#ffe040', '#e02a1a'], ['pxp', 15]],
  ['leg_voltio', 'Anguila Voltio', 'Volt Eel', ['pantano'], ['rain', 'storm'], -1, [0, 24], 'eel', ['#3a3a1a', '#ffe040', '#8ad0ff'], ['aspdP', 8]],
  ['leg_paiche', 'Paiche Ancestral', 'Ancestral Paiche', ['selva'], ['rain'], 2, [0, 24], 'long', ['#4a5a3a', '#c83a2a', '#e8d0a0'], ['phpP', 12]],
  ['leg_espejismo', 'Pez Espejismo', 'Mirage Fish', ['oasis'], ['hot', 'clear'], -1, [12, 16], 'flat', ['#ffe0a0', '#8af0ff', '#ffffff'], ['spdP', 10]],
  ['leg_prisma', 'Prisma Eterno', 'Eternal Prism', ['cristal'], [], -1, [20, 24], 'lantern', ['#b8a0ff', '#ffffff', '#ff8af0'], ['pgold', 15]],
  ['leg_eclipse', 'Devorador del Eclipse', 'Eclipse Devourer', ['eclipse'], [], -1, [22, 26], 'dragon', ['#1a0a2a', '#a040e0', '#ff4a4a'], ['atkP', 10]],
  ['leg_nhar', 'Dragón de Nhar', 'Nhar Dragon', ['nhar'], ['storm', 'wind', 'cloudy'], 3, [0, 24], 'dragon', ['#c0301a', '#ffb020', '#ffe8a0'], ['defP', 12]],
  ['leg_perla', 'Reina Perla', 'Pearl Queen', ['mar'], ['clear'], 2, [19, 22], 'round', ['#ffd0e0', '#ffffff', '#ff8ab0'], ['pregen', 1]],
];
for (const L of LEGF) it(L[0], { n: L2(L[1], L[2]), t: 'cons', fish: true, leg: 1, stack: true, tier: 12, price: 4000, icon: ['ofi', 'fx_' + L[0]], rar: 4, legB: 1 });
function legOk(L, hab) { const w = curWx(), s = calDate().season, h = ofHour(); const inH = L[6][1] > 24 ? (h >= L[6][0] || h < L[6][1] - 24) : (h >= L[6][0] && h < L[6][1]); return L[3].includes(hab) && (!L[4].length || L[4].includes(w)) && (L[5] < 0 || L[5] === s) && inH; }
function legWhen(L) { const W_ = { storm: L2('tormenta', 'storm'), fog: L2('niebla', 'fog'), clear: L2('soleado', 'sunny'), cloudy: L2('nublado', 'cloudy'), snow: L2('nieve', 'snow'), hot: L2('calor', 'heat'), rain: L2('lluvia', 'rain'), wind: L2('viento', 'wind') };
  const HB = { mar: L2('mar', 'sea'), lago: L2('lago', 'lake'), rio: L2('río', 'river'), hielo: L2('Picos Helados', 'Frozen Peaks'), pantano: L2('pantano', 'swamp'), selva: L2('selva', 'jungle'), oasis: L2('oasis', 'oasis'), cristal: L2('Valle Cristalino', 'Crystal Valley'), eclipse: L2('Tierras del Eclipse', 'Eclipse Lands'), nhar: L2('Isla de Nhar', 'Nhar Isle') };
  return [L[3].map(h => HB[h] || h).join('/'), L[4].length ? L[4].map(w => W_[w] || w).join('/') : '', L[5] >= 0 ? SEASONS[L[5]] : '', L[6][0] === 0 && L[6][1] === 24 ? '' : String(L[6][0] % 24).padStart(2, '0') + ':00–' + String(L[6][1] % 24).padStart(2, '0') + ':00'].filter(Boolean).join(' · '); }
{ const _pf = pickFish; pickFish = function (hab) { const P = G.P, lv = (P.jobs.pesca || { lv: 1 }).lv; const C_ = LEGF.filter(L => legOk(L, hab)); if (C_.length && bestTool('pesca') >= 2 && Math.random() < 0.04 + lv * 0.0008) { const L = pick(C_); return [L[0], L2(L[1], L[2]), 9, L[3], L[8][0]]; } return _pf.apply(this, arguments); }; }
{ const _fc = fishCaught; fishCaught = function (fish) { const r = _fc.apply(this, arguments); try { const id = fish && fish[0], I = ITEMS[id]; if (!I) return r; const F = ofi().fish, sz = Math.round((10 + (I.tier || 1) * 9) * (0.7 + Math.random() * 0.8) * (I.leg ? 3 : 1)), e = F[id] || [0, 0]; e[0]++; if (sz > e[1]) e[1] = sz; F[id] = e;
    if (I.leg) { banner(L2('¡PEZ LEGENDARIO!', 'LEGENDARY FISH!'), I.n + ' · ' + sz + ' cm'); sfx('boss'); if (typeof pvLog === 'function') pvLog(G.P.name + L2(' ha pescado a ', ' caught ') + I.n + ' (' + sz + ' cm).', '', 'good'); }
    else if (e[0] === 1) toast('🐟 ' + L2('Nuevo en tu colección: ', 'New in your collection: ') + I.n + ' · ' + sz + ' cm', 'quest', 4);
    markDirty(); } catch (e) { } return r; }; }
// liberar un pez legendario: invoca su espíritu, que te bendice 20 minutos
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P.inv[idx], I = s && ITEMS[s.id]; if (I && I.legB) { const L = LEGF.find(L => L[0] === s.id); if (L) { takeItem(s.id, 1); const st = {}; st[L[9][0]] = L[9][1]; addBuff(P, 'legfish', st, 1200);
      for (let k = 0; k < 24; k++) part(P.x + (Math.random() - 0.5) * 50, P.y - Math.random() * 30, { vz: 30 + Math.random() * 40, g: -20, life: 1.6, c: L[8][k % 3], s: 2 }); sfx('buff'); banner(L2('Espíritu de ', 'Spirit of ') + I.n, L2('Te bendice 20 minutos', 'Blesses you for 20 minutes')); return; } } return _ui.apply(this, arguments); }; }

// ---------- dibujo de peces (todos los peces del juego tienen su propio dibujo) ----------
const FX_SHAPE = { pezespada: 'sword', aguja: 'sword', marlin: 'sword', anguila: 'eel', morena: 'eel', pezglobo: 'round', pez_globo: 'round', pezluna: 'flat', pez_luna: 'flat', betta: 'fancy', lucio: 'long', arapaima: 'long', esturion: 'long', barracuda: 'long',
  pezlinterna: 'lantern', pezabisal: 'lantern', koi: 'koi', carpa: 'koi', caballito: 'horse', pezdragon: 'dragon', leviatan: 'dragon', pezpayaso: 'clown', piranha: 'round', atunreal: 'tuna', atun_rojo: 'tuna', manta: 'ray', raya: 'ray', calamar: 'squid', pulpo: 'squid', medusa: 'squid', pezestelar: 'fancy', pezprisma: 'flat' };
function fxShape(id) { if (FX_SHAPE[id]) return FX_SHAPE[id]; for (const k in FX_SHAPE) if (id.includes(k)) return FX_SHAPE[k]; return ['norm', 'norm', 'long', 'tuna', 'flat'][Math.floor(hash2(id.length, id.charCodeAt(0), id.charCodeAt(id.length - 1)) * 5)]; }
function shade(hex, f) { const [r, g, b] = hexRGB(hex); const m = v => clamp(Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)), 0, 255); return '#' + [m(r), m(g), m(b)].map(v => v.toString(16).padStart(2, '0')).join(''); }
function drawFish(p, shape, c1, c2, c3) {
  const D = C, b = D(c1), dk = D(shade(c1, -0.35)), lt = D(c2 || shade(c1, 0.45)), fin = D(c3 || shade(c1, -0.15)), eye = D('#101010'), wh = D('#ffffff');
  const tail = (x, y, s) => p.poly([[x, y], [x - 4 * s, y - 4], [x - 4 * s, y + 4]], fin);
  if (shape === 'eel') { for (let x = 1; x < 15; x++) { const y = 8 + Math.round(Math.sin(x * 0.7) * 2); p.rect(x, y - 1, 1, 3, b); p.set(x, y + 1, lt); } p.set(14, 7, eye); p.hl(2, 5, 10, fin); }
  else if (shape === 'round') { p.ball(8, 8, 5, 5, [dk, b, b, lt]); for (const [x, y] of [[8, 2], [3, 5], [13, 5], [2, 9], [14, 9], [5, 13], [11, 13]]) p.set(x, y, fin); p.set(11, 6, wh); p.set(11, 7, eye); tail(3, 8, 0.5); }
  else if (shape === 'flat') { p.ell(8, 8, 5, 6, b); p.ell(8, 9, 4, 3, lt); p.poly([[8, 1], [11, 3], [5, 3]], fin); p.poly([[8, 15], [11, 13], [5, 13]], fin); tail(3, 8, 0.6); p.set(11, 6, eye); }
  else if (shape === 'sword') { p.ell(8, 8, 5, 3, b); p.ell(8, 9, 4, 1.5, lt); p.hl(12, 7, 4, fin); p.poly([[6, 5], [9, 1], [10, 5]], fin); tail(4, 8, 0.8); p.set(11, 7, eye); }
  else if (shape === 'long') { p.ell(8, 8, 6.5, 2.5, b); p.hl(3, 9, 10, lt); p.hl(3, 7, 9, dk); p.poly([[7, 6], [9, 4], [10, 6]], fin); tail(2, 8, 0.4); p.set(13, 7, eye); }
  else if (shape === 'lantern') { p.ball(8, 9, 5, 4, [dk, b, b, lt]); p.line(10, 5, 13, 2, fin); p.ball(13, 2, 1.5, 1.5, [D('#ffe060'), D('#ffffa0')]); p.hl(10, 11, 3, wh); tail(3, 9, 0.5); p.set(11, 8, eye); }
  else if (shape === 'koi') { p.ell(8, 8, 5.5, 3, b); for (const [x, y] of [[6, 7], [9, 8], [7, 9]]) p.set(x, y, D(c3 || '#ff6a3a')); p.rect(8, 6, 2, 1, D(c3 || '#ff6a3a')); p.line(13, 9, 15, 11, fin); tail(3, 8, 0.8); p.set(11, 7, eye); }
  else if (shape === 'horse') { p.ell(8, 5, 2.5, 2, b); p.rect(9, 4, 4, 2, b); p.ell(7, 9, 2.5, 3, b); p.line(7, 12, 9, 14, b); p.set(10, 14, b); p.set(9, 4, eye); p.vl(5, 7, 4, fin); }
  else if (shape === 'dragon') { p.ell(8, 8, 6, 3, b); p.hl(3, 9, 10, lt); for (let x = 4; x < 12; x += 2) p.set(x, 4, fin), p.set(x, 5, fin); p.line(13, 8, 15, 6, fin); p.line(13, 9, 15, 11, fin); tail(2, 8, 0.6); p.set(11, 7, eye); }
  else if (shape === 'clown') { p.ell(8, 8, 5, 3.5, b); for (const x of [6, 10]) p.vl(x, 5, 7, wh); tail(3, 8, 0.6); p.set(12, 7, eye); }
  else if (shape === 'squid') { p.ell(8, 5, 3.5, 4.5, b); p.poly([[4, 3], [8, 0], [12, 3]], fin); for (const x of [5, 7, 9, 11]) p.line(x, 9, x + (x < 8 ? -1 : 1), 15, b); p.set(7, 6, eye); p.set(9, 6, eye); p.vl(8, 2, 5, lt); }
  else if (shape === 'ray') { p.poly([[8, 3], [15, 8], [8, 11], [1, 8]], b); p.ell(8, 8, 2, 2, lt); p.line(8, 11, 8, 15, fin); p.set(7, 6, eye); p.set(9, 6, eye); }
  else if (shape === 'fancy') { p.ell(8, 8, 4, 3, b); p.poly([[4, 8], [0, 3], [1, 14]], fin); p.poly([[7, 5], [10, 1], [11, 5]], fin); p.poly([[7, 11], [10, 15], [11, 11]], fin); p.set(10, 7, eye); }
  else if (shape === 'tuna') { p.ell(8, 8, 6, 3.5, b); p.ell(8, 10, 5, 1.5, lt); p.hl(3, 6, 9, dk); for (let x = 4; x < 11; x += 2) p.set(x, 12, D('#ffd040')); tail(2, 8, 0.6); p.set(12, 7, eye); }
  else { p.ell(8, 8, 5.5, 3, b); p.ell(8, 9.5, 4, 1.5, lt); p.poly([[6, 5], [9, 3], [10, 5]], fin); tail(3, 8, 0.7); p.set(11, 7, eye); }
  p.outline(D('#101820')); return p;
}
function fxCols(I) { const c = I.icon && typeof I.icon[1] === 'string' && I.icon[1][0] === '#' ? I.icon[1] : '#7a9ab8'; return [c, null, null]; }
const FX_LIST = []; // peces normales
{ const _bia = buildIconAtlas; buildIconAtlas = function () { for (const id in ITEMS) { const I = ITEMS[id]; if (!I.fish || I.leg) continue; if (!I.fxc) { I.fxc = fxCols(I); I.icon = ['ofi', 'fx_' + id]; } if (!FX_LIST.includes(id)) FX_LIST.push(id); } return _bia.apply(this, arguments); }; }

// =====================================================================================
// ALQUIMIA EXPERIMENTAL
// =====================================================================================
const AX = [ // [id, es, en, color, efecto, inesperado]
  ['vida', 'Poción vital', 'Vital potion', '#e02838', { heal: 0.6 }], ['mana', 'Poción arcana', 'Arcane potion', '#2a64e0', { mana: 0.6 }],
  ['furia', 'Poción de furia', 'Fury potion', '#ff4a1a', { atkP: 12 }], ['roca', 'Poción de roca', 'Rock potion', '#8a7a5a', { defP: 18 }],
  ['viento', 'Poción de viento', 'Wind potion', '#8af0d0', { spdP: 20 }], ['rafaga', 'Poción ráfaga', 'Gust potion', '#c8f080', { aspdP: 12 }],
  ['ojo', 'Ojo de halcón', 'Hawk eye', '#ffd040', { pcrit: 8 }], ['sabio', 'Poción del sabio', 'Sage potion', '#a080ff', { pxp: 20 }],
  ['fortuna', 'Poción de la fortuna', 'Fortune potion', '#ffe060', { pgold: 25 }], ['savia', 'Savia del bosque', 'Forest sap', '#6ad04a', { pregen: 0.8 }],
  ['gigante', 'Poción de gigante', 'Giant potion', '#c8702a', { defP: 30, spdP: -15 }, 1], ['pluma', 'Poción de pluma', 'Feather potion', '#ffffff', { spdP: 35, defP: -15 }, 1],
  ['bomba', 'Poción explosiva', 'Explosive potion', '#ff2a1a', { boom: 1 }, 1], ['arcoiris', 'Poción arcoíris', 'Rainbow potion', '#ff8af0', { atkP: 6, defP: 6, spdP: 6, aspdP: 6 }, 1],
  ['oficio', 'Tónico del artesano', 'Artisan tonic', '#c8a060', { pjob: 25 }], ['raro', 'Brebaje rarísimo', 'Very strange brew', '#6a8a3a', { rand: 1 }, 1],
];
for (const a of AX) it('ax_' + a[0], { n: L2(a[1], a[2]), t: 'cons', stack: true, tier: 3, price: 120, icon: ['potion2', a[3]], axp: a[0], rar: a[5] ? 2 : 1 });
function axFor(ids) { const key = ids.slice().sort().join('+'); let h = 0; for (let i = 0; i < key.length; i++) h = (h * 131 + key.charCodeAt(i)) >>> 0; return { key, a: AX[h % AX.length] }; }
function axApply(P, a, pot) { const e = a[4], st = {};
  if (e.rand) return axApply(P, AX[Math.floor(Math.random() * (AX.length - 1))], pot);
  if (e.heal) { const h = Math.round(P.S.maxhp * e.heal * pot); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 40, '+' + fmt(h), '#6aff7a'); }
  if (e.mana) { P.mp = Math.min(P.S.maxmp, P.mp + Math.round(P.S.maxmp * e.mana * pot)); }
  if (e.boom) { let n = 0; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === P.map && dist2(m.x, m.y, P.x, P.y) < 90 * 90) { hitMob(m, P.S.atk * 3 * pot, { fire: 1 }); n++; } burst(P.x, P.y - 10, 30, { sp: 120, up: 60, g: 100, life: 0.7, c: ['#ff4a1a', '#ffd040', '#3a3a3a'] }); sfx('boom'); toast(n ? L2('¡BUM! Alcanza a ', 'BOOM! Hits ') + n : L2('¡BUM! Te chamuscas las cejas.', 'BOOM! You singe your eyebrows.'), 'info'); }
  for (const k of ['atkP', 'defP', 'spdP', 'aspdP', 'pcrit', 'pxp', 'pgold', 'pregen', 'pjob']) if (e[k]) st[k] = +(e[k] * (e[k] > 0 ? pot : 1)).toFixed(1);
  if (Object.keys(st).length) addBuff(P, 'alq', st, 240);
}
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P.inv[idx], I = s && ITEMS[s.id]; if (I && I.axp) { const a = AX.find(a => a[0] === I.axp); takeItem(s.id, 1); axApply(P, a, 1 + (P.jobs.alquimia ? P.jobs.alquimia.lv / 150 : 0)); toast('⚗ ' + I.n, 'quest'); sfx('potion'); return; } return _ui.apply(this, arguments); }; }
let AX_SEL = [];
function axMats() { const P = G.P, seen = new Set(), out = []; for (const s of P.inv) { if (!s || seen.has(s.id)) continue; const I = ITEMS[s.id]; if (!I || I.t !== 'mat' || !(I.fish || /^herb|^ig_/.test(s.id) || DROPS.some(d => d[0] === s.id))) continue; seen.add(s.id); out.push(s.id); } return out; }
function axOpen() {
  const P = G.P, K = ofi().alq, mats = axMats(); AX_SEL = AX_SEL.filter(id => countItem(id) > 0);
  const known = Object.entries(K).map(([k, a]) => { const A = AX.find(x => x[0] === a); return A ? `<div class="news"><b style="color:${A[3]}">${esc(L2(A[1], A[2]))}</b> <small>${esc(k.split('+').map(id => ITEMS[id] ? ITEMS[id].n : id).join(' + '))}</small></div>` : ''; }).join('');
  openModal(`<h2>⚗ ${L2('Alquimia experimental', 'Experimental alchemy')}</h2><p class="hint">${L2('Mezcla 2 o 3 ingredientes (hierbas, botín de monstruos, peces o ingredientes de cocina). Cada mezcla da siempre la misma poción: descubre qué hace cada una. Algunas tienen efectos inesperados.', 'Mix 2 or 3 ingredients (herbs, monster loot, fish or cooking ingredients). Each mix always gives the same potion: find out what each one does. Some have unexpected effects.')}</p>
    <p><b>${L2('Caldero', 'Cauldron')}:</b> ${AX_SEL.length ? AX_SEL.map(id => `<span class="chip on" data-axr="${id}">${iconHTML(ITEMS[id].icon, 16)} ${esc(ITEMS[id].n)} ✕</span>`).join(' ') : `<i>${L2('vacío', 'empty')}</i>`}</p>
    <div class="pvBody" style="max-height:28vh"><div class="chips">${mats.map(id => `<button class="chip ${AX_SEL.includes(id) ? 'on' : ''}" data-axa="${id}">${iconHTML(ITEMS[id].icon, 16)} ${esc(ITEMS[id].n)} ${countItem(id)}</button>`).join('') || `<p class="hint">${L2('No tienes ingredientes.', 'You have no ingredients.')}</p>`}</div></div>
    <div class="row"><button class="btn gold" id="axGo" ${AX_SEL.length >= 2 ? '' : 'disabled'}>${L2('Mezclar', 'Mix')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>
    <h3>${L2('Grimorio', 'Grimoire')} (${Object.keys(K).length})</h3><div class="pvBody" style="max-height:22vh">${known || `<p class="hint">${L2('Aún no has descubierto nada.', 'Nothing discovered yet.')}</p>`}</div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal;
  $$('#modal [data-axa]').forEach(b => b.onclick = () => { const id = b.dataset.axa; if (AX_SEL.includes(id)) AX_SEL = AX_SEL.filter(x => x !== id); else if (AX_SEL.length < 3) AX_SEL.push(id); axOpen(); });
  $$('#modal [data-axr]').forEach(b => b.onclick = () => { AX_SEL = AX_SEL.filter(x => x !== b.dataset.axr); axOpen(); });
  $('#axGo').onclick = () => { if (AX_SEL.length < 2) return; const { key, a } = axFor(AX_SEL); for (const id of AX_SEL) takeItem(id, 1); const first = !K[key]; K[key] = a[0]; giveItem('ax_' + a[0], 1 + (P.jobs.alquimia && P.jobs.alquimia.lv >= 30 ? 1 : 0)); gainJobXp('alquimia', first ? 40 : 12);
    sfx(first ? 'level' : 'potion'); if (first) toast('⚗ ' + L2('¡Descubierta: ', 'Discovered: ') + L2(a[1], a[2]) + (a[5] ? L2(' (¡efecto inesperado!)', ' (unexpected effect!)') : '') + '!', 'quest', 5); markDirty(true); axOpen(); };
}
DLG_HOOKS.push((npc, opts) => { if (npc.def && npc.def.shop === 'alchemy') opts.splice(1, 0, { label: L2('Alquimia experimental', 'Experimental alchemy'), icon: ['potion2', '#a040e0'], fn: () => { closeDialog(); axOpen(); } }); });

// =====================================================================================
// ARQUEOLOGÍA (oficio nuevo): 8 yacimientos, minijuego de pincel y 8 historias que reconstruir
// =====================================================================================
const ARQ = [ // [id, waystone, es, en, piezas, historia es, historia en, color]
  ['vael', 'ruinas', 'Corona de Vael', 'Crown of Vael', 4, 'Vael fue una reina que unió a los pueblos del norte con un hilo de plata. Su corona se partió el día que el Velo se abrió por primera vez.', 'Vael was a queen who united the northern towns with a silver thread. Her crown broke the day the Veil first opened.', '#ffd040'],
  ['sierpe', 'desierto', 'Fósil de la Sierpe de Arena', 'Sand Serpent Fossil', 5, 'Hace miles de años una sierpe gigante nadaba bajo el desierto. Los nómadas de Sahrim aún dejan agua en sus huesos para tener buen viaje.', 'Thousands of years ago a giant serpent swam beneath the desert. Sahrim\'s nomads still leave water on its bones for a safe journey.', '#e8d0a0'],
  ['orco', 'colinas', 'Hacha del Primer Jefe Orco', 'Axe of the First Orc Chief', 4, 'El primer jefe orco no luchaba por conquistar: protegía las colinas de los dragones. Su hacha se enterró con él, mirando al cielo.', 'The first orc chief did not fight to conquer: he guarded the hills from dragons. His axe was buried with him, facing the sky.', '#a0a0a8'],
  ['tablilla', 'pantano', 'Tablilla Hundida', 'Sunken Tablet', 4, 'Una aldea entera se hundió en el pantano. La tablilla guarda la última canción de sus vecinos: «Que el agua recuerde nuestros nombres».', 'A whole village sank into the swamp. The tablet holds its people\'s last song: "May the water remember our names".', '#6a8a6a'],
  ['mamut', 'picos', 'Mamut de Escarcha', 'Frost Mammoth', 6, 'Los mamuts de escarcha bajaban de los picos cada invierno. El último se quedó dormido en el hielo y aún parece soñar.', 'Frost mammoths came down from the peaks every winter. The last one fell asleep in the ice and still seems to dream.', '#c8e8ff'],
  ['idolo', 'selva', 'Ídolo de Yarakai', 'Yarakai Idol', 4, 'El ídolo sonríe porque los primeros de Yarakai creían que la selva estaba viva y había que hacerla reír para que diera frutos.', 'The idol smiles because the first Yarakai believed the jungle was alive and had to be made to laugh to give fruit.', '#3aa060'],
  ['ancla', 'llanuras', 'Ancla del Primer Barco', 'Anchor of the First Ship', 4, 'Antes de que hubiera mar en las Llanuras Doradas, hubo un barco. Nadie sabe cómo llegó tierra adentro… ni quién lo trajo.', 'Before there was sea near the Golden Plains, there was a ship. No one knows how it got inland… or who brought it.', '#7a5a3a'],
  ['vinculo', 'cristal', 'Fragmento del Primer Vínculo', 'Shard of the First Bond', 5, 'El primer hilo del Vínculo no unía personas: unía a una niña con la luna. Desde entonces la luna sonríe a quien cumple sus promesas.', 'The first thread of the Bond did not tie people together: it tied a girl to the moon. Since then the moon smiles at those who keep their promises.', '#b8a0ff'],
];
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); for (const A of ARQ) { const w = WAYSTONES.find(w => w.k === A[1]); if (w) putNear(W, 'ofi_arq', w.x - 4, w.y + 3, [[0, 0], [1, 0]], { xact: 'ofi_arq', arq: A[0] }, OF_GROUND(W)); } }; }
XACT.ofi_arq = [o => { const A = ARQ.find(a => a[0] === o.arq); return L2('Yacimiento: ', 'Dig site: ') + (A ? L2(A[2], A[3]) : ''); }, 'shovel', o => arqOpen(o.arq)];
{ const _ge = genFurn2; genFurn2 = function (kind) { if (kind !== 'ofi_arq') return _ge.apply(this, arguments);
  const p = new Pix(36, 26), D = C; p.ell(18, 17, 15, 7, D('#5a3a1a')); p.ell(18, 17, 12, 5, D('#3a2410')); p.ell(18, 18, 8, 3, D('#2a1808')); p.rect(14, 15, 4, 2, D('#e8e0c8')); p.rect(20, 18, 3, 2, D('#e8e0c8'));
  for (const [x, y] of [[3, 10], [33, 10], [3, 23], [33, 23]]) { p.vl(x, y - 8, 9, WOOD[2]); p.set(x, y - 9, D('#d83a3a')); } p.line(3, 3, 33, 3, D('#e8d0a0')); p.line(3, 15, 33, 15, D('#e8d0a0')); p.line(28, 6, 32, 12, WOOD[3]); p.rect(26, 4, 4, 3, D('#c8a060'));
  p.outline(D('#1a1008')); return { c: p.canvas(), ax: 18, ay: 24 }; }; }
const ARQ_CD = 8 * 60 * 1000;
function arqOpen(id) {
  const P = G.P, O = ofi(), A = ARQ.find(a => a[0] === id), have = O.arq[id] || 0, left = (O.arqT[id] || 0) + ARQ_CD - Date.now();
  const col = ARQ.map(a => { const n = Math.min(a[4], O.arq[a[0]] || 0), done = n >= a[4]; return `<div class="news ${done ? 'good' : ''}"><b>${iconHTML(['ofi', 'rel_' + a[0]], 22)} ${esc(L2(a[2], a[3]))}</b> <small>${n}/${a[4]}</small>${done ? `<br><small>📜 ${esc(L2(a[5], a[6]))}</small>` : ''}</div>`; }).join('');
  openModal(`<h2>${iconHTML(['ofi', 'rel_' + id], 24)} ${esc(L2(A[2], A[3]))}</h2><p class="hint">${L2('Pasa el pincel por la tierra para encontrar las piezas. Tienes pocos golpes: los números te dicen cuántas piezas hay alrededor.', 'Brush the soil to find the pieces. You have few strokes: the numbers tell you how many pieces are around.')} ${L2('Piezas', 'Pieces')}: ${Math.min(have, A[4])}/${A[4]}</p>
    ${left > 0 ? `<p class="hint">⏳ ${L2('El yacimiento se está asentando. Vuelve en', 'The site is settling. Come back in')} ${Math.ceil(left / 60000)} min.</p>` : `<div class="row"><button class="btn gold" id="arqGo">${L2('Excavar', 'Excavate')}</button></div>`}
    <h3>${L2('Historia del mundo', 'History of the world')}</h3><div class="pvBody" style="max-height:34vh">${col}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; const g = $('#arqGo'); if (g) g.onclick = () => arqDig(id);
}
function arqDig(id) {
  const P = G.P, O = ofi(), A = ARQ.find(a => a[0] === id), N = 5, lv = (P.jobs.arqueologia || { lv: 1 }).lv, strokes = 9 + jobPerkSum('arqS'), grid = new Array(N * N).fill(0), seen = new Array(N * N).fill(0);
  const pieces = 2 + (Math.random() < 0.3 + lv * 0.004 ? 1 : 0); let k = 0; while (k < pieces) { const i = Math.floor(Math.random() * N * N); if (!grid[i]) { grid[i] = 2; k++; } } for (let j = 0; j < 3; j++) { const i = Math.floor(Math.random() * N * N); if (!grid[i]) grid[i] = 1; }
  let st = strokes, found = 0, coins = 0; O.arqT[id] = Date.now(); markDirty();
  const near = i => { const x = i % N, y = (i / N) | 0; let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if ((dx || dy) && xx >= 0 && yy >= 0 && xx < N && yy < N && grid[yy * N + xx] === 2) c++; } return c; };
  const draw = () => { const end = st <= 0 || found >= pieces;
    openModal(`<h2>${iconHTML(['ofi', 'rel_' + id], 22)} ${esc(L2(A[2], A[3]))}</h2><p class="hint">${L2('Golpes de pincel', 'Brush strokes')}: ${st} · ${L2('Piezas', 'Pieces')}: ${found}/${pieces}</p>
      <div style="display:grid;grid-template-columns:repeat(${N},44px);gap:4px;justify-content:center">${grid.map((v, i) => `<button class="btn sm" data-aq="${i}" style="width:44px;height:44px;padding:0;background:${seen[i] ? (v === 2 ? '#6a4a1a' : '#3a2a1a') : '#8a6a3a'}" ${seen[i] || end ? 'disabled' : ''}>${seen[i] ? (v === 2 ? iconHTML(['ofi', 'rel_' + id], 28) : v === 1 ? '🪙' : (near(i) || '')) : ''}</button>`).join('')}</div>
      <div class="row">${end ? `<button class="btn gold" id="aqOk">${L2('Guardar hallazgos', 'Keep findings')}</button>` : ''}</div>`, 'party');
    $$('#modal [data-aq]').forEach(b => b.onclick = () => { const i = +b.dataset.aq; if (seen[i] || st <= 0) return; seen[i] = 1; st--; if (grid[i] === 2) { found++; sfx('quest'); } else if (grid[i] === 1) { coins++; sfx('coin'); } else sfx('mine'); draw(); });
    const ok = $('#aqOk'); if (ok) ok.onclick = () => { const before = O.arq[id] || 0; O.arq[id] = before + found; const g = coins * Math.round(150 * (1 + P.lv / 30)); if (g) { P.gold += g; floatText(P.x, P.y - 40, '+' + fmt(g) + ' ' + L2('oro', 'gold'), '#ffd040'); }
      gainJobXp('arqueologia', 15 + found * 25); if (before < A[4] && O.arq[id] >= A[4]) { banner(L2('¡Historia reconstruida!', 'History rebuilt!'), L2(A[2], A[3])); sfx('level'); gainXp(Math.round(xpToNext(P.lv) * 0.25)); P.gold += Math.round(5000 * (1 + P.lv / 30)); if (typeof pvLog === 'function') pvLog(P.name + L2(' ha reconstruido la historia de: ', ' has rebuilt the history of: ') + L2(A[2], A[3]) + '.', '', 'good'); }
      markDirty(true); arqOpen(id); }; };
  draw();
}
addJob('arqueologia', L2('Arqueología', 'Archaeology'), 'shovel', L2('Desentierra fósiles y reliquias en 8 yacimientos y reconstruye la historia del mundo.', 'Unearth fossils and relics at 8 dig sites and rebuild the history of the world.'),
  { how: [L2('Busca los yacimientos (cuerdas rojas y un pozo) junto a las piedras de viaje de Ruinas de Vael, Desierto, Colinas, Pantano, Picos, Selva, Llanuras y Valle Cristalino. Usa el pincel donde los números indiquen piezas.', 'Find the dig sites (red ropes and a pit) next to the waystones of Vael Ruins, Desert, Hills, Swamp, Peaks, Jungle, Plains and Crystal Valley. Brush where the numbers point to pieces.'), 'Find the dig sites next to the waystones.'],
    ben: [L2('Oro, experiencia, historias del mundo y más golpes de pincel.', 'Gold, experience, world stories and more brush strokes.'), 'Gold, experience, stories.'],
    find: () => { const W = G.world, P = G.P; if (!W) return null; const L = W.objs.filter(o => o.xact === 'ofi_arq').sort((a, b) => dist2(a.tx, a.ty, P.x / 16, P.y / 16) - dist2(b.tx, b.ty, P.x / 16, P.y / 16))[0]; return L ? { loc: [L.tx, L.ty], t: L2('Yacimiento', 'Dig site'), m: 'world' } : null; } },
  [[3, '+1 golpe de pincel', '+1 brush stroke', { arqS: 1 }], [6, '+2 % de oro de los enemigos', '+2% gold from enemies', { goldP: 2 }], [10, '+1 golpe de pincel', '+1 brush stroke', { arqS: 1 }], [15, '+2 % de vida', '+2% HP', { hpP: 2 }], [20, '+1 golpe de pincel', '+1 brush stroke', { arqS: 1 }],
    [25, '+2 % de experiencia', '+2% experience', { xpP: 2 }], [30, '+1 golpe de pincel', '+1 brush stroke', { arqS: 1 }], [40, '+3 % de defensa', '+3% defence', { defP: 3 }], [50, '+2 golpes de pincel', '+2 brush strokes', { arqS: 2 }], [60, '+3 % de oro de los enemigos', '+3% gold from enemies', { goldP: 3 }]], ['shovel', 3]);

// =====================================================================================
// FORJA ARTESANAL: núcleo de mineral + temple (calidad 1-3) + runa grabada en el arma equipada
// =====================================================================================
const FG_CORE = [['ore1', 'Cobre', 'Copper', 'aspd', 4], ['ore2', 'Hierro', 'Iron', 'def', 6], ['ore3', 'Plata', 'Silver', 'crit', 3], ['ore4', 'Oro', 'Gold', 'gold', 8], ['ore5', 'Mithril', 'Mithril', 'atk', 5], ['ore6', 'Adamantita', 'Adamantite', 'hp', 7], ['ore7', 'Cristal Rúnico', 'Rune Crystal', 'mp', 10]];
const FG_RUNE = [['fuego', 'Runa de fuego', 'Fire rune', '#ff6a2a', L2('10 % de golpes queman (+30 % de daño)', '10% of hits burn (+30% damage)'), 'herb4'], ['hielo', 'Runa de hielo', 'Ice rune', '#8ad8ff', L2('Ralentiza a los enemigos', 'Slows enemies'), 'cristalhielo'],
  ['rayo', 'Runa de rayo', 'Lightning rune', '#ffe040', L2('12 % de golpes saltan a otro enemigo', '12% of hits jump to another enemy'), 'nucleo'], ['vida', 'Runa de vida', 'Life rune', '#6aff6a', L2('Recuperas el 3 % del daño a monstruos', 'Recover 3% of damage dealt to monsters'), 'herb5'],
  ['viento', 'Runa de viento', 'Wind rune', '#c8f0e0', L2('+5 % de velocidad de ataque', '+5% attack speed'), 'ala'], ['tierra', 'Runa de tierra', 'Earth rune', '#c8a060', L2('+5 % de defensa', '+5% defence'), 'hueso']];
const FG_TXT = { aspd: L2('vel. de ataque', 'attack speed'), def: L2('defensa', 'defence'), crit: L2('crítico', 'crit'), gold: L2('oro', 'gold'), atk: L2('ataque', 'attack'), hp: L2('vida', 'HP'), mp: L2('maná', 'mana') };
function fgW() { const P = G.P, e = P.equip && P.equip.weapon; return e && ITEMS[e.id] ? e : null; }
{ const _ef = equipFromInv; equipFromInv = function (idx) { const P = G.P, s = P.inv[idx], fg = s && s.fg; const r = _ef.apply(this, arguments); if (fg && s && ITEMS[s.id] && P.equip[ITEMS[s.id].slot] && P.equip[ITEMS[s.id].slot].id === s.id) { P.equip[ITEMS[s.id].slot].fg = fg; calcStats(P); } return r; }; }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs(P); const e = P && P.equip && P.equip.weapon, f = e && e.fg; if (f && P.S) { const S = P.S, c = FG_CORE.find(c => c[0] === f.core), q = [0, 0.6, 1, 1.4][f.q || 2], v = c ? c[4] * q : 0;
    if (c) { if (c[3] === 'atk') S.atk = Math.round(S.atk * (1 + v / 100)); if (c[3] === 'def') S.def = Math.round(S.def * (1 + v / 100)); if (c[3] === 'hp') S.maxhp = Math.round(S.maxhp * (1 + v / 100)); if (c[3] === 'mp') S.maxmp = Math.round(S.maxmp * (1 + v / 100)); if (c[3] === 'crit') S.crit = Math.min(80, S.crit + v); if (c[3] === 'aspd' && S.aspd) S.aspd *= 1 + v / 100; }
    if (f.rune === 'viento' && S.aspd) S.aspd *= 1.05; if (f.rune === 'tierra') S.def = Math.round(S.def * 1.05); } return r; }; }
{ const _km = killMob; killMob = function (m) { const e = fgW(), f = e && e.fg, c = f && FG_CORE.find(c => c[0] === f.core); if (c && c[3] === 'gold' && m && m.gold) m.gold = Math.round(m.gold * (1 + c[4] * [0, 0.6, 1, 1.4][f.q || 2] / 100)); return _km.apply(this, arguments); }; }
let fgBusy = false;
{ const _hm = hitMob; hitMob = function (m, base, src) { const d = _hm.apply(this, arguments); if (fgBusy || !d || !m) return d; const e = fgW(), f = e && e.fg; if (!f || !f.rune) return d; const P = G.P; fgBusy = true;
    try { if (f.rune === 'fuego' && Math.random() < 0.1 && !m.dying) { const x = Math.round(d * 0.3); m.hp -= x; floatText(m.x, m.y - 30, '🔥' + x, '#ff8a2a'); }
      else if (f.rune === 'hielo') { m.slowT = Math.max(m.slowT || 0, 1.5); if (m.slow !== undefined) m.slow = Math.max(m.slow || 0, 0.3); }
      else if (f.rune === 'rayo' && Math.random() < 0.12) { const o = G.ents.find(x => x !== m && x.type === 'mob' && !x.dying && x.map === m.map && dist2(x.x, x.y, m.x, m.y) < 80 * 80); if (o) { _hm(o, base * 0.5, {}); for (let k = 0; k < 6; k++) part(m.x + (o.x - m.x) * k / 6, m.y - 12 + (o.y - m.y) * k / 6, { life: 0.25, c: '#ffe040', s: 2 }); } }
      else if (f.rune === 'vida' && P.S) P.hp = Math.min(P.S.maxhp, P.hp + d * 0.03);
      if (m.hp <= 0 && !m.dying) killMob(m); } finally { fgBusy = false; } return d; }; }
function fgOpen() {
  const P = G.P, e = fgW(); if (!e) { toast(L2('Equipa un arma primero', 'Equip a weapon first'), 'warn'); return; } const I = ITEMS[e.id], f = e.fg || {}, cost = Math.round(800 * (1 + (I.lv || 1) / 15));
  const c = FG_CORE.find(c => c[0] === f.core), r = FG_RUNE.find(r => r[0] === f.rune);
  openModal(`<h2>${iconHTML(['anvil'], 22)} ${L2('Forja artesanal', 'Artisan forge')}</h2><p class="hint">${esc(I.n)} · ${L2('Núcleo', 'Core')}: <b>${c ? esc(L2(c[1], c[2])) + ' ' + '★'.repeat(f.q || 0) + ' (+' + (c[4] * [0, 0.6, 1, 1.4][f.q || 2]).toFixed(1) + '% ' + FG_TXT[c[3]] + ')' : L2('ninguno', 'none')}</b> · ${L2('Runa', 'Rune')}: <b>${r ? esc(L2(r[1], r[2])) : L2('ninguna', 'none')}</b></p>
    <h3>1. ${L2('Elige el núcleo y templa', 'Choose the core and temper')}</h3><p class="hint">${L2('5 minerales + oro. Después templa el metal: tres golpes en la zona roja dan 3 estrellas.', '5 ores + gold. Then temper the metal: three hits in the red zone give 3 stars.')}</p>
    <div class="slist">${FG_CORE.map(c => `<div class="srow">${iconHTML(ITEMS[c[0]].icon, 26)}<div class="sn"><b>${esc(L2(c[1], c[2]))}</b><small>+${c[4]}% ${FG_TXT[c[3]]} · ${L2('tienes', 'you have')} ${countItem(c[0])}/5</small></div><button class="btn sm" data-fgc="${c[0]}" ${countItem(c[0]) >= 5 && P.gold >= cost ? '' : 'disabled'}>${fmt(cost)}</button></div>`).join('')}</div>
    <h3>2. ${L2('Graba una runa', 'Engrave a rune')}</h3><p class="hint">${L2('Las runas solo funcionan contra monstruos. Cuestan 3 materiales y oro.', 'Runes only work against monsters. They cost 3 materials and gold.')}</p>
    <div class="slist">${FG_RUNE.map(r => `<div class="srow"><b style="color:${r[3]};font-size:1.4em;width:1.4em;text-align:center">ᚱ</b><div class="sn"><b>${esc(L2(r[1], r[2]))}</b><small>${esc(r[4])} · ${esc(ITEMS[r[5]] ? ITEMS[r[5]].n : r[5])} ${countItem(r[5])}/3</small></div><button class="btn sm" data-fgr="${r[0]}" ${countItem(r[5]) >= 3 && P.gold >= cost ? '' : 'disabled'}>${fmt(cost)}</button></div>`).join('')}</div>
    <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal;
  $$('#modal [data-fgr]').forEach(b => b.onclick = () => { const R = FG_RUNE.find(r => r[0] === b.dataset.fgr); takeItem(R[5], 3); P.gold -= cost; e.fg = Object.assign({}, e.fg || {}, { rune: R[0] }); calcStats(P); sfx('forge'); toast('ᚱ ' + L2(R[1], R[2]) + ' → ' + I.n, 'quest'); gainJobXp('herreria', 30); markDirty(true); fgOpen(); });
  $$('#modal [data-fgc]').forEach(b => b.onclick = () => fgTemper(b.dataset.fgc, cost));
}
function fgTemper(core, cost) {
  const P = G.P, e = fgW(); if (!e) return; let hits = 0, good = 0, x = 0, raf = 0; const t0 = performance.now();
  openModal(`<h2>${iconHTML(['anvil'], 22)} ${L2('Temple', 'Tempering')}</h2><p class="hint">${L2('Golpea cuando la marca pase por la zona roja (3 golpes).', 'Strike when the marker crosses the red zone (3 strikes).')}</p>
    <div style="position:relative;height:26px;margin:.6em 0;border-radius:6px;background:linear-gradient(90deg,#2a2a3a,#5a5a6a)"><i style="position:absolute;top:0;bottom:0;left:42%;width:16%;background:#e0401a;border-radius:4px"></i><i id="fgMk" style="position:absolute;top:-4px;bottom:-4px;width:4px;background:#fff"></i></div><p class="hint" id="fgSt">0/3</p><div class="row"><button class="btn gold" id="fgHit">${L2('¡Golpear!', 'Strike!')}</button></div>`, 'party');
  const loop = () => { const mk = document.getElementById('fgMk'); if (!mk) return; x = (Math.sin((performance.now() - t0) / 1000 * (2.4 + hits * 0.6)) + 1) / 2; mk.style.left = (x * 100).toFixed(1) + '%'; raf = requestAnimationFrame(loop); }; loop();
  $('#fgHit').onclick = () => { hits++; if (Math.abs(x - 0.5) <= 0.08) good++; sfx('forge'); $('#fgSt').textContent = hits + '/3 · ' + '★'.repeat(good);
    if (hits >= 3) { cancelAnimationFrame(raf); const q = Math.max(1, good); takeItem(core, 5); P.gold -= cost; e.fg = Object.assign({}, e.fg || {}, { core, q }); calcStats(P); gainJobXp('herreria', 20 + good * 15); toast('⚒ ' + L2('Núcleo templado: ', 'Core tempered: ') + '★'.repeat(q), 'quest'); markDirty(true); setTimeout(fgOpen, 350); } };
}
DLG_HOOKS.push((npc, opts) => { if (npc.def && npc.def.shop === 'smith') opts.splice(1, 0, { label: L2('Forja artesanal', 'Artisan forge'), icon: ['anvil'], fn: () => { closeDialog(); fgOpen(); } }); });

// =====================================================================================
// ICONOS (platos, ingredientes, peces y reliquias)
// =====================================================================================
UI_ICONS.push(...PL.map(d => 'ofi:pl_' + d[0]), ...IG.map(g => 'ofi:ig_' + g[0]), ...LEGF.map(L => 'ofi:fx_' + L[0]), ...ARQ.map(a => 'ofi:rel_' + a[0]));
function drawDish(p, tpl, c) { const D = C, [a, b, g] = c.map(x => D(x)), pl = D('#f4f4f0'), plD = D('#c8c8d0'), bw = D('#a86a3a'), bwD = D('#6a3a1a');
  const plate = () => { p.ell(8, 11, 7, 3.5, plD); p.ell(8, 10.5, 6.5, 3, pl); };
  if (tpl === 'bowl' || tpl === 'ceviche') { p.ell(8, 9, 6.5, 2.5, D(tpl === 'ceviche' ? '#e8e8f0' : '#f0e8d8')); p.poly([[1, 9], [15, 9], [12, 14], [4, 14]], tpl === 'ceviche' ? D('#d8d8e0') : bw); p.hl(4, 14, 8, bwD); p.ell(8, 9, 5.5, 1.8, a);
    if (tpl === 'ceviche') { for (const [x, y] of [[5, 8], [8, 9], [10, 8], [7, 8]]) p.set(x, y, D('#ffffff')); for (const [x, y] of [[6, 9], [11, 9], [9, 8]]) p.set(x, y, b); p.rect(12, 7, 2, 2, g); p.rect(3, 7, 2, 2, D('#e8803a')); p.set(13, 6, D('#8ad040')); }
    else { p.set(6, 8, b); p.set(10, 9, b); p.set(8, 8, g); } }
  else if (tpl === 'plate' || tpl === 'saltado') { plate(); p.ell(7, 9.5, 3.5, 2, a); p.ell(11, 10, 2.5, 1.5, b); p.set(6, 9, g); p.set(8, 10, g); if (tpl === 'saltado') { p.rect(9, 8, 1, 3, b); p.rect(11, 8, 1, 3, b); p.ell(4, 10, 2, 1.2, g); } }
  else if (tpl === 'fishplate') { plate(); p.ell(8, 10, 4.5, 1.8, a); p.poly([[3, 10], [1, 8], [1, 12]], a); p.set(11, 9, D('#202020')); p.hl(5, 10, 6, b); p.ell(12, 12, 1.5, 1, g); }
  else if (tpl === 'roast') { plate(); p.ball(8, 8, 4.5, 3, [D(shade(c[0], -0.3)), a, a, D(shade(c[0], 0.3))]); p.vl(12, 4, 4, b); p.set(12, 3, D('#ffffff')); p.set(4, 11, g); p.set(13, 11, g); }
  else if (tpl === 'skewer') { p.line(2, 14, 14, 2, D('#c8a070')); for (const [x, y, k] of [[5, 11, 0], [8, 8, 1], [11, 5, 0]]) p.ball(x, y, 2, 2, [D(shade(c[k], -0.3)), D(c[k]), D(shade(c[k], 0.3))]); p.ell(4, 14, 1.5, 1, g); }
  else if (tpl === 'cup' || tpl === 'drink') { if (tpl === 'drink') { p.rect(5, 4, 6, 10, D('#d8e8f0')); p.rect(6, 6, 4, 7, a); p.hl(6, 6, 4, b); p.rect(10, 3, 1, 4, g); } else { p.poly([[3, 6], [13, 6], [11, 14], [5, 14]], D('#e8f0f8')); p.rect(5, 7, 6, 6, a); p.ell(8, 6, 4, 1.5, b); p.set(8, 5, g); } }
  else if (tpl === 'cake') { p.ell(8, 12, 6, 2, plD); p.rect(3, 6, 10, 6, a); p.ell(8, 6, 5, 1.5, b); p.hl(3, 9, 10, b); p.set(8, 4, g); }
  else if (tpl === 'rings') { plate(); for (const [x, y] of [[5, 9], [10, 9], [8, 6]]) { p.ell(x, y, 2.5, 2, a); p.set(x, y, pl); } p.line(3, 11, 13, 7, b); }
  else if (tpl === 'leaf') { p.poly([[2, 11], [8, 4], [14, 11], [8, 14]], a); p.line(8, 4, 8, 14, D(shade(c[0], -0.3))); p.hl(4, 9, 8, b); p.set(8, 3, g); p.set(9, 3, g); }
  else if (tpl === 'pot') { p.ell(8, 7, 6, 2, D('#5a3a20')); p.ell(8, 7, 5, 1.5, a); p.ball(8, 10, 6, 4, [D('#5a2a10'), D('#8a4a2a'), D('#a86a3a')]); p.ell(8, 7, 5, 1.5, a); p.set(6, 7, b); p.set(9, 6, g); p.rect(1, 9, 2, 1, bwD); p.rect(13, 9, 2, 1, bwD); }
  else if (tpl === 'bread') { p.ell(8, 9, 6, 3.5, a); p.ell(8, 8, 5, 2.5, D(shade(c[0], 0.25))); p.hl(3, 10, 10, b); p.set(5, 10, g); p.set(10, 10, g); }
  else if (tpl === 'layer') { plate(); p.rect(5, 4, 6, 7, a); p.hl(5, 6, 6, b); p.hl(5, 8, 6, b); p.ell(8, 4, 3, 1, g); p.set(8, 3, D('#202020')); }
  else if (tpl === 'pie') { plate(); p.ell(8, 9, 5, 3, a); p.rect(3, 9, 11, 2, plD); p.ell(8, 9, 5, 2.5, a); for (let x = 4; x < 13; x += 2) p.set(x, 7, D(shade(c[0], -0.3))); }
  else if (tpl === 'pan') { p.ell(8, 10, 7, 4, D('#3a3a40')); p.ell(8, 9.5, 6, 3, a); for (const [x, y] of [[5, 9], [10, 10], [8, 8]]) p.ball(x, y, 1.2, 1.2, [D(shade(c[1], -0.2)), b]); p.set(12, 9, g); p.rect(14, 10, 2, 1, D('#2a2a2a')); }
  p.outline(D('#20140c')); return p; }
function drawIng(p, id, c) { const D = C, a = D(c), dk = D(shade(c, -0.35)), lt = D(shade(c, 0.4));
  if (id === 'limon') p.ball(8, 9, 5, 4.5, [dk, a, lt]); else if (id === 'aji') { p.poly([[4, 3], [11, 6], [12, 14], [6, 9]], a); p.vl(4, 1, 3, D('#3a8a3a')); }
  else if (id === 'maiz' || id === 'maizmorado') { p.ell(8, 8, 3, 6, a); for (let y = 3; y < 14; y += 2) p.hl(6, y, 4, dk); p.poly([[5, 14], [3, 6], [6, 12]], D('#6ab04a')); p.poly([[11, 14], [13, 6], [10, 12]], D('#6ab04a')); }
  else if (id === 'cebolla') { p.ball(8, 9, 5, 5, [dk, a, lt]); p.vl(8, 2, 3, D('#6ab04a')); } else if (id === 'arroz' || id === 'azucar') { p.ell(8, 11, 6, 3, D('#c8a070')); p.ell(8, 9, 5, 2.5, a); }
  else if (id === 'carne') { p.ell(8, 9, 6, 4, a); p.ell(7, 8, 3, 2, D('#e86a5a')); p.ell(12, 10, 1.5, 1.5, D('#ffffff')); } else if (id === 'pollo') { p.ball(7, 8, 4.5, 4, [dk, a, lt]); p.line(10, 11, 14, 14, D('#f8f0e0')); }
  else if (id === 'queso') { p.poly([[2, 12], [14, 12], [14, 6], [2, 9]], a); for (const [x, y] of [[5, 10], [9, 9], [12, 10]]) p.set(x, y, dk); } else if (id === 'huevo') p.ball(8, 9, 4, 5, [D('#e8e0d0'), a, D('#ffffff')]);
  else if (id === 'leche') { p.rect(5, 4, 6, 10, a); p.poly([[5, 4], [8, 1], [11, 4]], D('#3a7ad8')); p.hl(5, 8, 6, D('#3a7ad8')); } else if (id === 'platano') { p.poly([[3, 4], [12, 6], [14, 12], [10, 9]], a); p.set(3, 4, D('#3a2a1a')); }
  else if (id === 'hoja') { p.poly([[2, 13], [7, 3], [14, 2], [10, 10]], a); p.line(3, 12, 13, 3, dk); } else p.ball(8, 9, 5, 4, [dk, a, lt]);
  p.outline(D('#20140c')); return p; }
function drawRelic(p, id, c) { const D = C, a = D(c), dk = D(shade(c, -0.4)), lt = D(shade(c, 0.4));
  if (id === 'vael') { p.rect(3, 8, 10, 5, a); for (const x of [3, 7, 11]) p.poly([[x, 8], [x + 1, 3], [x + 2, 8]], a); p.set(8, 10, D('#d83a3a')); p.hl(3, 12, 10, dk); }
  else if (id === 'sierpe' || id === 'mamut') { for (let x = 2; x < 14; x += 3) p.ell(x, 8 + Math.sin(x) * 2, 1.5, 2, a); p.ball(13, 6, 2.5, 2, [dk, a, lt]); p.set(14, 6, D('#202020')); }
  else if (id === 'orco') { p.line(4, 14, 11, 3, D('#7a5a3a')); p.poly([[9, 2], [14, 4], [12, 8], [9, 6]], a); }
  else if (id === 'tablilla') { p.rect(3, 2, 10, 12, a); for (let y = 4; y < 13; y += 2) p.hl(5, y, 6, dk); }
  else if (id === 'idolo') { p.rect(4, 3, 8, 11, a); p.set(6, 6, dk); p.set(9, 6, dk); p.hl(6, 10, 4, dk); p.set(5, 9, dk); p.set(10, 9, dk); }
  else if (id === 'ancla') { p.vl(8, 2, 11, a); p.hl(5, 4, 7, a); p.line(3, 10, 8, 13, a); p.line(13, 10, 8, 13, a); p.ell(8, 2, 1.5, 1.5, a); }
  else { p.poly([[8, 1], [13, 7], [8, 15], [3, 7]], a); p.poly([[8, 1], [10, 7], [8, 13]], lt); }
  p.outline(D('#140c08')); return p; }
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'ofi') return _gi(spec); const p = new Pix(16, 16), k = String(spec[1]);
  if (k.startsWith('pl_')) { const d = plDef(k.slice(3)); if (d) return drawDish(p, d[4], d[5]); }
  if (k.startsWith('ig_')) { const g = IG.find(g => 'ig_' + g[0] === k); if (g) return drawIng(p, g[0], g[3]); }
  if (k.startsWith('rel_')) { const a = ARQ.find(a => 'rel_' + a[0] === k); if (a) return drawRelic(p, a[0], a[7]); }
  if (k.startsWith('fx_')) { const id = k.slice(3), L = LEGF.find(L => L[0] === id); if (L) return drawFish(p, L[7], L[8][0], L[8][1], L[8][2]); const I = ITEMS[id]; if (I) { const c = I.fxc || fxCols(I); return drawFish(p, fxShape(id), c[0], c[1], c[2]); } }
  return p; }; }

// =====================================================================================
// BESTIARIO: nueva sección «Peces»
// =====================================================================================
{ const _re = renderEncyclo; renderEncyclo = function (B) {
  const want = encTab === 'fish'; if (want) encTab = 'mobs'; _re(B); if (!want) { const ch = B.querySelector('.enctabs'); if (ch && !ch.querySelector('[data-enc=fish]')) { const b = document.createElement('button'); b.className = 'chip'; b.dataset.enc = 'fish'; b.textContent = '🐟 ' + L2('Peces', 'Fish'); b.onclick = () => { encTab = 'fish'; sfx('ui'); renderPanel(); }; ch.appendChild(b); } return; }
  encTab = 'fish'; const ch = B.querySelector('.enctabs'); if (ch) { ch.querySelectorAll('.chip').forEach(c => c.classList.remove('on')); const b = document.createElement('button'); b.className = 'chip on'; b.textContent = '🐟 ' + L2('Peces', 'Fish'); ch.appendChild(b); }
  const F = ofi().fish, all = FX_LIST.concat(LEGF.map(L => L[0])), got = all.filter(id => F[id]).length;
  const row = id => { const I = ITEMS[id], e = F[id], L = LEGF.find(L => L[0] === id); const hab = L ? legWhen(L) : (I.hab || []).join(', ');
    return `<div class="srow" style="${e ? '' : 'opacity:.55'}"><span style="${e ? '' : 'filter:brightness(0)'}">${iconHTML(I.icon, 48)}</span><div class="sn"><b>${e || L ? esc(I.n) : '???'}${L ? ' <small style="color:#ffd040">★ ' + L2('legendario', 'legendary') + '</small>' : ''}</b><small>${esc(hab)}</small><small>${e ? L2('Pescados', 'Caught') + ': ' + e[0] + ' · ' + L2('récord', 'record') + ' ' + e[1] + ' cm' : L2('Sin pescar', 'Not caught yet')}</small></div></div>`; };
  const box = B.querySelector('#encMobs'); if (box) box.outerHTML = `<div id="encFish"><p class="hint">${L2('Colección de peces', 'Fish collection')}: ${got}/${all.length}. ${L2('Los legendarios solo pican con cierto clima, estación y hora. Puedes cocinarlos o liberarlos para que su espíritu te bendiga.', 'Legendary fish only bite in certain weather, season and hour. You can cook them or release them so their spirit blesses you.')}</p><h3>★ ${L2('Legendarios', 'Legendary')}</h3><div class="slist">${LEGF.map(L => row(L[0])).join('')}</div><h3>${L2('Peces', 'Fish')}</h3><div class="slist">${FX_LIST.map(row).join('')}</div></div>`;
}; }

// ---------- la lupa explica lo nuevo ----------
if (JOB_GUIDE.cocina) { JOB_GUIDE.cocina.how = [L2('Cocina en las hogueras que hay fuera de cada pueblo y junto a algunas piedras de viaje (también en las posadas). La despensa de la hoguera vende los ingredientes. Cada reino tiene sus recetas.', 'Cook at the campfires outside each town and next to some waystones (also at inns). The campfire pantry sells ingredients. Each kingdom has its own recipes.'), 'Cook at campfires outside towns.']; JOB_GUIDE.cocina.ben = [L2('50 platos con efectos distintos (ataque, defensa, velocidad, crítico, vida, regeneración, experiencia, oro u oficios). Un plato perfecto da más.', '50 dishes with different effects (attack, defence, speed, crit, HP, regeneration, experience, gold or jobs). A perfect dish gives more.'), '50 dishes.']; JOB_GUIDE.cocina.find = () => { const W = G.world, P = G.P; const L = W && W.objs.filter(o => o.xact === 'ofi_fire').sort((a, b) => dist2(a.tx, a.ty, P.x / 16, P.y / 16) - dist2(b.tx, b.ty, P.x / 16, P.y / 16))[0]; return L ? { loc: [L.tx, L.ty], t: L2('Hoguera', 'Campfire'), m: 'world' } : null; }; }
if (JOB_GUIDE.pesca) JOB_GUIDE.pesca.ben = [L2('Peces para Cocina y pedidos; 12 peces legendarios que solo pican con cierto clima, estación y hora. Míralos en el Bestiario › Peces.', 'Fish for Cooking and orders; 12 legendary fish that only bite in certain weather, season and hour. See them in Bestiary › Fish.'), 'Fish and 12 legendary fish.'];
if (JOB_GUIDE.alquimia) JOB_GUIDE.alquimia.how = [L2('Usa el caldero del alquimista con hierbas, o elige «Alquimia experimental» para mezclar ingredientes y descubrir pociones nuevas.', 'Use the alchemist\'s cauldron with herbs, or choose "Experimental alchemy" to mix ingredients and discover new potions.'), 'Alchemist: experimental alchemy.'];
if (JOB_GUIDE.herreria) JOB_GUIDE.herreria.how = [L2('Lleva minerales al herrero y forja armas, armaduras y herramientas. En «Forja artesanal» eliges el núcleo del arma, la templas y le grabas runas.', 'Bring ore to the blacksmith to forge weapons, armour and tools. In "Artisan forge" you choose the weapon core, temper it and engrave runes.'), 'Blacksmith: artisan forge.'];
