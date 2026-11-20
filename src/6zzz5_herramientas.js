// ================= v5.64: HERRAMIENTAS EQUIPABLES, BARRA DE ABAJO NUEVA, MINERALES, MADERAS Y PECES =================
// Sergio (5.64):
// - Hachas, picos y cañas se EQUIPAN en el inventario (antes se usaba sola la mejor de la mochila).
// - Barra de abajo: 🪓 hacha · 🧪 poción · ⛏ pico · 🎣 caña · ★ casilla libre · 🎒 mochila · ⚔ arma equipada · 📖 misiones.
//   Talar, picar y pescar ya NO es automático con ⚔: se pulsa la casilla de la herramienta junto al árbol, la veta o el agua.
// - Pociones con espera de 30 s (curar, maná y tónicos por separado).
// - 7 minerales nuevos (niveles 12-18), 7 maderas nuevas, 7 hachas, 7 picos y 7 cañas para niveles altos.
//   Algunos están en Perú (Lima Norte y Cusco) y México. Tala, Minería y Pesca suben hasta el nivel 120 (+30 con maestría).
// - 40 peces nuevos (bestiario, acuario, torneo) y Don Anselmo, el cebero de Puerto Coral: lombrices, cebo dorado y peces.
// Todo sale en la Lupa › Sistemas, en «Dónde conseguir» con flecha y en el mapa.

const HB2 = { near: { tala: 0, mineria: 0, pesca: 0 }, t: 0 };
const HB_TOOLJOBS = ['tala', 'mineria', 'pesca'];
SAVEKEYS.push('tEq', 'hbFree');

// ---------- datos: minerales, maderas y herramientas nuevas ----------
// [tier, mineral (es, en), color, madera (es, en), especie, hojas, mapa, nivel del héroe]
const NV_RES = [
  [12, ['Mineral de Aurorita', 'Aurorite Ore'], ['#2a8a6a', '#5ae0b0', '#ffc8f0'], ['Tronco de Árbol Nube', 'Cloud Tree Log'], 'arbolnube', ['#3a4a6a', '#5a6a90', '#8a9ac0', '#b8c4e0', '#dce4f4', '#ffffff'], 'cielo', 170],
  [13, ['Mineral de Ceruleíta', 'Ceruleite Ore'], ['#1a5aa8', '#4aa8ff', '#d0ecff'], ['Tronco de Sauce Aurora', 'Aurora Willow Log'], 'sauceaurora', ['#0a2a3a', '#14485a', '#1e6a7a', '#2a9a9a', '#5ad0c0', '#b0fff0'], 'reino_celeste', 210],
  [14, ['Mineral de Velonita', 'Veilite Ore'], ['#5a0a1a', '#c02a3a', '#ffb0b8'], ['Tronco de Roble Velado', 'Veiled Oak Log'], 'roblevelado', ['#1a0a1a', '#2e122a', '#4a1a3a', '#6a2a4a', '#8a3a5a', '#b05a7a'], 'velo_roto', 260],
  [15, ['Mineral de Quilla', 'Quilla Ore'], ['#5a5a8a', '#b0b8f0', '#f8f8ff'], ['Tronco de Queñua', 'Queñua Log'], 'quenua', ['#2a3a1a', '#3a5222', '#4a6a2a', '#6a8a3a', '#8aa84a', '#b0c86a'], 'lima_norte', 300],
  [16, ['Cuarzo de Vinicunca', 'Vinicunca Quartz'], ['#c0402a', '#40c0a0', '#ffe060'], ['Tronco de Palo Santo', 'Palo Santo Log'], 'palosanto', ['#3a3a12', '#52521a', '#6a6a22', '#8a8a30', '#a8a842', '#cccc66'], 'cusco', 340],
  [17, ['Ópalo de Fuego', 'Fire Opal'], ['#a01a0a', '#ff5a2a', '#ffd8a0'], ['Tronco de Ahuehuete', 'Ahuehuete Log'], 'ahuehuete', ['#0a2a14', '#123a1c', '#1a4e26', '#246632', '#348040', '#4aa058'], 'mexico', 390],
  [18, ['Mineral de Tejedita', 'Weaverite Ore'], ['#2a2a2a', '#e8e8e8', '#ffd040'], ['Tronco del Árbol del Telar', 'Loom Tree Log'], 'arboltelar', ['#2a2410', '#4a3e18', '#7a6424', '#b09030', '#e0c050', '#fff0a0'], 'velo_roto', 450]];
const NV_MAPN = { cielo: ['Islas del Cielo (Celestia)', 'Sky Isles (Celestia)'], reino_celeste: ['Altavela, el Continente Celestial', 'Altavela, the Celestial Continent'], velo_roto: ['Continente del Velo Roto', 'Broken Veil Continent'], lima_norte: ['Lima Norte (Perú) · lomas', 'North Lima (Peru) · hills'], cusco: ['Cusco (Perú) · montañas', 'Cusco (Peru) · mountains'], mexico: ['México', 'Mexico'] };
const nvMapN = m => NV_MAPN[m] ? L2(NV_MAPN[m][0], NV_MAPN[m][1]) : m;
RESLV.push(78, 84, 90, 96, 102, 108, 114);
const JOB_EXT = { tala: 45, mineria: 45, pesca: 45 }; // tope 75 → 120 (+30 con maestría)
for (const [t, on, oc, ln, sp, leaf] of NV_RES) {
  ORE[t] = oc; OREN[t] = on[0].replace(/^Mineral de /, ''); LOGN[t] = ln[0].replace(/^Tronco (de |del )/, ''); WOODT[sp] = t; LEAF[sp] = pal(leaf);
  it('ore' + t, { n: L2(on[0], on[1]), t: 'mat', stack: true, tier: t, price: 5 * t * t, icon: ['ore', t], rar: t >= 16 ? 4 : 3 });
  it('log' + t, { n: L2(ln[0], ln[1]), t: 'mat', stack: true, tier: t, price: 4 * t * t, icon: ['log', t], rar: t >= 16 ? 4 : 3 });
}
// hachas y picos 7-13 (potencia 7-13) y cañas 8-14: cada una abre el siguiente nivel de recurso
const NV_TOOLS = [[7, 'Aurorita', 'Aurorite', 170, 16], [8, 'Ceruleíta', 'Ceruleite', 210, 17], [9, 'Velonita', 'Veilite', 260, 18], [10, 'Quilla', 'Quilla', 300, 19], [11, 'Vinicunca', 'Vinicunca', 340, 20], [12, 'Ópalo', 'Opal', 390, 21], [13, 'Tejedita', 'Weaverite', 450, 22]];
NV_TOOLS.forEach(([p, es, en, lv, ti], i) => {
  const rar = i >= 4 ? 4 : 3, mt = p + 4; // la herramienta de potencia p se hace con mineral y madera de nivel p+4 (los anteriores)
  it('hacha' + p, { n: L2('Hacha de ' + es, en + ' Axe'), t: 'tool', tool: 'tala', power: p, lv, price: 4000 * p * p, icon: ['axe', ti], rar });
  it('pico' + p, { n: L2('Pico de ' + es, en + ' Pickaxe'), t: 'tool', tool: 'mineria', power: p, lv, price: 4000 * p * p, icon: ['pick', ti], rar });
  it('cana' + (p + 1), { n: L2('Caña de ' + es, en + ' Rod'), t: 'tool', tool: 'pesca', power: p + 1, lv, price: 4000 * p * p, icon: ['rod', ti], rar });
  const g = 15000 * (i + 1), jl = Math.min(75, 60 + i * 3), om = mt - 1 >= 11 ? mt - 1 : 11;
  RECIPES.push({ id: 'r_hacha' + p, job: 'herreria', out: 'hacha' + p, n: 1, lv, jlv: jl, gold: g, mats: [['ore' + om, 6], ['log' + om, 8]], cat: 'herramienta' });
  RECIPES.push({ id: 'r_pico' + p, job: 'herreria', out: 'pico' + p, n: 1, lv, jlv: jl, gold: g, mats: [['ore' + om, 8], ['log' + om, 5]], cat: 'herramienta' });
  RECIPES.push({ id: 'r_cana' + (p + 1), job: 'herreria', out: 'cana' + (p + 1), n: 1, lv, jlv: jl, gold: g, mats: [['ore' + mt, 5], ['log' + mt, 6]], cat: 'herramienta' });
});
// hacha7/pico7 salen de Eclipsita/Sombra (nivel 11); el pico de nivel p abre el mineral p+5, con el que se hace el siguiente.

// ---------- 40 peces nuevos ----------
// [id, es, en, nivel, hábitats, color, forma]
const NV_FISH = [
  ['pz_corvina', 'Corvina', 'Croaker', 12, ['peru', 'mar'], '#c8b8a0', 'norm'], ['pz_lenguado', 'Lenguado', 'Sole', 12, ['peru'], '#a08a6a', 'flat'],
  ['pz_anchoveta', 'Anchoveta', 'Anchoveta', 12, ['peru'], '#8ab0c8', 'long'], ['pz_pejerrey', 'Pejerrey', 'Silverside', 12, ['peru', 'andes'], '#c8d8e8', 'long'],
  ['pz_cojinova', 'Cojinova', 'Cojinova', 13, ['peru'], '#5a7a9a', 'tuna'], ['pz_chita', 'Chita', 'Grunt', 13, ['peru'], '#6a6a7a', 'norm'],
  ['pz_carachi', 'Carachi', 'Carachi', 13, ['andes'], '#b09a5a', 'norm'], ['pz_suche', 'Suche del Titicaca', 'Titicaca Suche', 14, ['andes'], '#7a6a3a', 'eel'],
  ['pz_truchaarco', 'Trucha Arcoíris', 'Rainbow Trout', 14, ['andes', 'rio'], '#e8a0b0', 'long'], ['pz_gamitana', 'Gamitana', 'Tambaqui', 14, ['selva', 'peru'], '#3a3a3a', 'round'],
  ['pz_doncella', 'Doncella', 'Tiger Catfish', 15, ['selva'], '#c8a870', 'long'], ['pz_zungaro', 'Zúngaro', 'Jau Catfish', 16, ['selva'], '#5a4a2a', 'long'],
  ['pz_huachinango', 'Huachinango', 'Red Snapper', 12, ['mexico', 'mar'], '#e04a4a', 'norm'], ['pz_charal', 'Charal', 'Charal', 12, ['mexico'], '#d8e0e8', 'long'],
  ['pz_mojarra', 'Mojarra', 'Mojarra', 12, ['mexico', 'lago'], '#8aa0a8', 'flat'], ['pz_robalo', 'Róbalo', 'Snook', 13, ['mexico'], '#a8b8a0', 'long'],
  ['pz_totoaba', 'Totoaba', 'Totoaba', 15, ['mexico'], '#9a9aaa', 'tuna'], ['pz_ciego', 'Pez Ciego de Cenote', 'Cenote Blind Fish', 16, ['mexico'], '#f0d8e0', 'norm'],
  ['pz_marlin', 'Marlín Azul', 'Blue Marlin', 17, ['mexico', 'mar'], '#2a5ab0', 'sword'], ['pz_iwana', 'Iwana de Montaña', 'Mountain Iwana', 13, ['japon', 'rio'], '#7a8a6a', 'long'],
  ['pz_hamachi', 'Hamachi', 'Yellowtail', 13, ['japon', 'mar'], '#d8c040', 'tuna'], ['pz_tai', 'Tai Rojo', 'Red Sea Bream', 14, ['japon'], '#ff7a8a', 'norm'],
  ['pz_kinmedai', 'Kinmedai Dorado', 'Golden-eye Snapper', 15, ['japon'], '#ff4a2a', 'round'], ['pz_nube', 'Pez Nube', 'Cloud Fish', 15, ['lago'], '#e8f0ff', 'fancy'],
  ['pz_cometa', 'Pez Cometa', 'Comet Fish', 16, ['mar'], '#a0d8ff', 'fancy'], ['pz_runico', 'Pez Rúnico', 'Rune Fish', 16, ['cristal'], '#7ad0ff', 'koi'],
  ['pz_velado', 'Pez Velado', 'Veiled Fish', 17, ['eclipse'], '#6a2a7a', 'fancy'], ['pz_tejedor', 'Pez Tejedor', 'Weaver Fish', 18, ['rio', 'lago'], '#ffe08a', 'koi'],
  ['pz_glaciar', 'Pez Glaciar', 'Glacier Fish', 15, ['hielo'], '#bfe8ff', 'flat'], ['pz_ambar', 'Pez de Ámbar', 'Amber Fish', 14, ['oasis'], '#e8a030', 'round'],
  ['pz_jade', 'Pez de Jade', 'Jade Fish', 15, ['selva'], '#2ab07a', 'koi'], ['pz_relampago', 'Pez Relámpago', 'Lightning Fish', 16, ['pantano'], '#f0f060', 'eel'],
  ['pz_ceniza', 'Pez Ceniza', 'Ash Fish', 15, ['volcan', 'lava'], '#6a6a6a', 'norm'], ['pz_fenix', 'Pez Fénix', 'Phoenix Fish', 18, ['lava'], '#ff6a1a', 'dragon'],
  ['pz_sirena', 'Pez Sirena', 'Siren Fish', 17, ['mar'], '#8ae0d0', 'fancy'], ['pz_coralreal', 'Pez Coral Real', 'Royal Coral Fish', 14, ['mar'], '#ff8a6a', 'clown'],
  ['pz_ojonhar', 'Ojo de Nhar', 'Eye of Nhar', 16, ['nhar'], '#c04a2a', 'lantern'], ['pz_luciernaga', 'Pez Luciérnaga', 'Firefly Fish', 13, ['pantano'], '#a0d040', 'lantern'],
  ['pz_reloj', 'Pez Reloj', 'Clock Fish', 17, ['lago'], '#c8a040', 'round'], ['pz_kraken', 'Cría de Kraken', 'Kraken Hatchling', 18, ['mar'], '#7a2a4a', 'squid']];
for (const [id, es, en, t, hab, col, shape] of NV_FISH) { const n = L2(es, en); FISH.push([id, n, t, hab, col]); it(id, { n, t: 'mat', fish: true, stack: true, tier: t, hab, price: 6 * t * t + 4 + t * 20, icon: ['fish', col], rar: t >= 16 ? 4 : 3 }); if (typeof FX_SHAPE !== 'undefined') FX_SHAPE[id] = shape; }
// peces de siempre que también pican en los países (para que los de nivel bajo pesquen algo)
for (const f of FISH) { const add = { sardina: ['peru', 'mexico', 'japon'], lubina: ['peru', 'mexico'], trucha: ['andes', 'japon'], carpa: ['mexico', 'japon', 'andes'], perca: ['andes'], salmon: ['japon'], ma_jurel: ['peru', 'japon'], ma_dorado: ['mexico'] }[f[0]]; if (add) for (const h of add) if (!f[3].includes(h)) f[3].push(h); }
// mapas fuera del mundo donde se puede pescar con la caña (hábitat de cada uno)
const FISH_MAP = { lima: 'peru', lima_norte: 'peru', trujillo: 'peru', cusco: 'andes', machupicchu: 'andes', mexico: 'mexico', xochimilco: 'mexico', japon: 'japon' };
{ const _h = habitatAt; habitatAt = function (tx, ty) { const M = G.map; if (M && !M.isWorld && FISH_MAP[M.id]) return FISH_MAP[M.id]; return _h.apply(this, arguments); }; }

// ---------- herramienta equipada ----------
function tEq() { const P = G.P; if (!P.tEq || typeof P.tEq !== 'object') P.tEq = {}; return P.tEq; }
function hasInv(id) { return !!G.P.inv.find(s => s && s.id === id); }
function eqTool(job) { const E = tEq(), id = E[job], I = id && ITEMS[id]; if (!I || I.tool !== job || !hasInv(id)) { if (id) delete E[job]; return null; } return id; }
function bestOwnedTool(job) { let b = null; for (const s of G.P.inv) { const I = s && ITEMS[s.id]; if (I && I.t === 'tool' && I.tool === job && (I.lv || 1) <= G.P.lv && (!b || I.power > ITEMS[b].power)) b = s.id; } return b; }
function equipTool(id) { const P = G.P, I = ITEMS[id]; if (!I || I.t !== 'tool' || !HB_TOOLJOBS.includes(I.tool)) return;
  if ((I.lv || 1) > P.lv) { toast(L2('Requiere nivel ', 'Requires level ') + I.lv, 'warn'); return; }
  tEq()[I.tool] = id; sfx('equip'); toast(L2('Equipado: ', 'Equipped: ') + I.n, 'quest'); uiDirty.inv = uiDirty.hud = true; hbRefresh(); markDirty(); }
function unequipTool(job) { delete tEq()[job]; uiDirty.inv = uiDirty.hud = true; hbRefresh(); markDirty(); }
{ const _bt = bestTool; bestTool = function (job) { if (!HB_TOOLJOBS.includes(job) || !G.P) return _bt.apply(this, arguments); const id = eqTool(job); return id ? ITEMS[id].power : 0; }; }
// la primera herramienta que consigues de cada tipo se equipa sola (luego cambias tú)
{ const _gi = giveItem; giveItem = function (id) { const r = _gi.apply(this, arguments); try { const I = ITEMS[id], P = G.P; if (P && I && I.t === 'tool' && HB_TOOLJOBS.includes(I.tool)) { if (!eqTool(I.tool) && (I.lv || 1) <= P.lv) { tEq()[I.tool] = id; hbRefresh(); } else if (eqTool(I.tool) !== id) toast(L2('Nueva herramienta: equípala en el inventario para usarla.', 'New tool: equip it in the bag to use it.'), 'info'); } } catch (e) { } return r; }; }
function tEqMigrate() { const P = G.P; if (!P || !P.inv) return; for (const j of HB_TOOLJOBS) if (!eqTool(j)) { const b = bestOwnedTool(j); if (b) tEq()[j] = b; } }

// ---------- recolectar con la casilla ----------
function hbFindRes(job) { const P = G.P, M = G.map; if (!M || !M.objs || !M.objAt) return null; const tx0 = Math.floor(P.x / 16), ty0 = Math.floor((P.y - 4) / 16); let best = null, bd = 42 * 42;
  for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const i = tileAt(M, tx0 + dx, ty0 + dy); if (i < 0) continue; const oi = M.objAt[i]; if (oi == null || oi < 0) continue; const o = M.objs[oi]; if (!o || o.hidden) continue;
    const ok = job === 'tala' ? (o.k === 'tree' && !o.deco && o.st !== 'stump' && o.st !== 'sapling' && WOODT[o.sp]) : (o.k === 'ore' && o.st !== 'dep' && ORE[o.tier]); if (!ok) continue;
    const d = dist2(o.px, o.py - 6, P.x, P.y); if (d < bd) { bd = d; best = o; } }
  return best; }
function hbWaterOk(M, i) { if (i < 0) return false; const t = M.ter[i]; if (t === T.WATER || t === T.DEEP) return M.isWorld || !!FISH_MAP[M.id]; return M.isWorld && t === T.LAVA && bestTool('pesca') >= 7; }
function hbFindWater() { const P = G.P, M = G.map; if (!M || !M.ter || (!M.isWorld && !FISH_MAP[M.id])) return null; const dv = DIRV[P.dir] || [0, 1];
  for (let k = 1; k <= 2; k++) { const wx = Math.floor((P.x + dv[0] * (6 + k * 12)) / 16), wy = Math.floor((P.y - 2 + dv[1] * (4 + k * 12)) / 16); if (hbWaterOk(M, tileAt(M, wx, wy))) return [wx, wy]; }
  const tx0 = Math.floor(P.x / 16), ty0 = Math.floor((P.y - 2) / 16); for (let r = 1; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; if (hbWaterOk(M, tileAt(M, tx0 + dx, ty0 + dy))) return [tx0 + dx, ty0 + dy]; }
  return null; }
const HB_N = { tala: () => L2('hacha', 'axe'), mineria: () => L2('pico', 'pickaxe'), pesca: () => L2('caña', 'rod') };
function hbNoTool(job) { const own = bestOwnedTool(job) || G.P.inv.find(s => s && ITEMS[s.id] && ITEMS[s.id].t === 'tool' && ITEMS[s.id].tool === job);
  toast(own ? L2('Equípate un ' + HB_N[job]() + ' en el inventario (toca la herramienta › Equipar).', 'Equip an ' + HB_N[job]() + ' in the bag (tap the tool › Equip).') : L2('No tienes ' + HB_N[job]() + ': pídesela gratis a la Anciana Mira, cómprala en la tienda o fabrícala en la herrería.', 'You have no ' + HB_N[job]() + ': ask Old Mira for one, buy it at the shop or craft it at the smithy.'), 'warn', 3);
  if (own) { invFilter = 'eq'; openPanel('inv'); } }
function hbGather(job) { const P = G.P; if (!P || P.dead || G.fading) return; if (typeof $ === 'function' && $('#modal') && !$('#modal').hidden) return;
  if (job === 'pesca') { if (P.fishing) { fishAction(); return; } if (P.job) return; if (!eqTool('pesca')) { hbNoTool('pesca'); return; }
    const w = hbFindWater(); if (!w) { toast(L2('Acércate al agua (río, lago o mar) y pulsa la caña.', 'Get close to water (river, lake or sea) and tap the rod.'), 'info', 2); return; } startFishing(w[0], w[1]); return; }
  if (P.job) return; if (P.fishing) stopFishing(); if (!eqTool(job)) { hbNoTool(job); return; }
  const o = hbFindRes(job); if (!o) { toast(job === 'tala' ? L2('No hay ningún árbol cerca: acércate a uno y pulsa el hacha.', 'No tree nearby: walk up to one and tap the axe.') : L2('No hay ninguna veta cerca: acércate a una roca con mineral y pulsa el pico.', 'No ore vein nearby: walk up to an ore rock and tap the pickaxe.'), 'info', 2); return; }
  const tier = job === 'tala' ? WOODT[o.sp] : o.tier, need = RESLV[tier] || 999, tool = bestTool(job), nt = toolNeed(job, tier);
  if ((P.jobs[job] || { lv: 1 }).lv < need) { toast(L2('Requiere ', 'Requires ') + JOBS[job].n + L2(' nivel ', ' level ') + need, 'warn'); return; }
  if (tool < nt) { const nx = Object.keys(ITEMS).find(k => ITEMS[k].t === 'tool' && ITEMS[k].tool === job && ITEMS[k].power === nt); toast(L2('Necesitas una herramienta mejor (potencia ', 'You need a better tool (power ') + nt + (nx ? ': ' + ITEMS[nx].n : '') + ')', 'warn', 3); return; }
  if (o.hp === undefined || o.hp <= 0) o.hp = 3 + tier * 2;
  P.job = { kind: job, o, tier, t: 0, tool }; P.dir = dirFromVec(o.px - P.x, o.py - 6 - P.y); setAnim(P, job === 'tala' ? 'chop' : 'mine'); P.loopAnim = true; }
// ⚔ ya no tala, ni pica ni pesca (Sergio: «quita eso de automático»)
{ const _it = interactTarget; interactTarget = function () { const r = _it.apply(this, arguments); if (r && (r.kind === 'tree' || r.kind === 'ore' || r.kind === 'fish')) return null; return r; }; }
// el tutorial de las misiones de oficio habla de la casilla
const HB_JOBS = { tala: () => L2('Equípate un hacha en el inventario, acércate a un árbol y pulsa la casilla 🪓 de la barra de abajo.', 'Equip an axe in the bag, walk up to a tree and tap the 🪓 slot on the bottom bar.'),
  mineria: () => L2('Equípate un pico en el inventario, acércate a una veta de mineral y pulsa la casilla ⛏ de la barra de abajo.', 'Equip a pickaxe in the bag, walk up to an ore vein and tap the ⛏ slot on the bottom bar.'),
  pesca: () => L2('Equípate una caña en el inventario, acércate al agua y pulsa la casilla 🎣 de la barra de abajo (vuelve a pulsarla cuando pique y mantenla para recoger).', 'Equip a rod in the bag, walk up to water and tap the 🎣 slot on the bottom bar (tap again when it bites and hold to reel in).') };

// ---------- pociones: 30 s de espera (curar, maná y tónicos por separado) ----------
// 5.65: los platos y bebidas que curan también tienen espera (20 s) y ninguna cura pasa de un % de tu vida máxima
function potGroup(I) { if (!I || I.t !== 'cons') return null; const isPot = !!(I.icon && /^potion/.test(String(I.icon[0]))) || /^(pocion|eter|elixir)/.test(I.id || '');
  if ((I.food || I.plato || (I.heal && !isPot)) && (I.heal || I.mana)) return 'food'; if (I.food || I.plato) return null;
  if (I.heal || (I.p && I.k === 'heal')) return 'heal'; if (I.mana) return 'mana'; if (I.tonic || I.buffE || isPot) return 'buff'; return null; }
const POT_KEY = { heal: 'healCd', mana: 'manaCd', buff: 'buffCd', food: 'foodCd' }, POT_DUR = { heal: 30, mana: 30, buff: 30, food: 20 };
// tope de cura por uso (fracción de la vida/maná máximos): pociones 40 %, elixir 60 %, comida 25 %
function healCapK(I, g) { return (I.heal >= 99999 || I.mana >= 99999) ? 0.6 : g === 'food' ? 0.25 : 0.4; }
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P && P.inv[idx], I = s && ITEMS[s.id], g = potGroup(I); if (!g) return _ui.apply(this, arguments);
  if (I.lv && P.lv < I.lv) return _ui.apply(this, arguments);
  const left = (P[POT_KEY[g]] || 0) - G.t; if (left > 0) { toast((g === 'food' ? L2('Aún estás comiendo: ', 'Still eating: ') : L2('Poción en espera: ', 'Potion cooling down: ')) + Math.ceil(left) + ' s', 'warn', 1.2); return; }
  const k = healCapK(I, g), h0 = I.heal, m0 = I.mana, S = P.S || {};
  if (h0 && S.maxhp) I.heal = Math.max(1, Math.min(h0, Math.round(S.maxhp * k))); if (m0 && S.maxmp) I.mana = Math.max(1, Math.min(m0, Math.round(S.maxmp * k)));
  const id = s.id, before = countItem(id); let r; try { r = _ui.apply(this, arguments); } finally { if (h0 !== undefined) I.heal = h0; if (m0 !== undefined) I.mana = m0; }
  if (countItem(id) < before) P[POT_KEY[g]] = G.t + POT_DUR[g]; return r; }; }
function potLeft(id) { const P = G.P, g = potGroup(ITEMS[id]); return g ? Math.max(0, (P[POT_KEY[g]] || 0) - G.t) : 0; }

// ---------- barra de abajo ----------
const HB_SLOTS = [['hbAxe', 'tala'], ['hbPot', null], ['hbPick', 'mineria'], ['hbRod', 'pesca'], ['hbFree', null], ['hbBag', null], ['hbChar', null], ['hbBook', null]];
function hbIcon(spec) { return iconHTML(spec, 24); }
function hbRefresh() { const P = G.P; if (!P || !$('#hbAxe')) return;
  for (const [bid, job] of [['hbAxe', 'tala'], ['hbPick', 'mineria'], ['hbRod', 'pesca']]) { const b = $('#' + bid), id = eqTool(job), key = (id || '-') + (HB2.near[job] ? 1 : 0); if (b.dataset.k === key) continue; b.dataset.k = key;
    b.innerHTML = hbIcon(id ? ITEMS[id].icon : [{ tala: 'axe', mineria: 'pick', pesca: 'rod' }[job], 2]) + (id ? `<em>${ITEMS[id].power}</em>` : '<em class="hbx">!</em>'); b.classList.toggle('off', !id); b.classList.toggle('near', !!(id && HB2.near[job])); }
  const pt = $('#hbPot'), pid = P.potion && countItem(P.potion) ? P.potion : null, pk = 'p' + (pid || '');
  if (pt && pt.dataset.k !== pk) { pt.dataset.k = pk; const ex = pt.querySelector('.pcd'); pt.innerHTML = hbIcon(pid ? ITEMS[pid].icon : ['potion', '#e02838']) + '<em id="potN">0</em>'; if (ex) pt.appendChild(ex); }
  const fr = $('#hbFree'), fid = P.hbFree && ITEMS[P.hbFree] ? P.hbFree : null, fk = 'f' + (fid || '') + (fid ? countItem(fid) : '');
  if (fr && fr.dataset.k !== fk) { fr.dataset.k = fk; fr.innerHTML = fid ? hbIcon(ITEMS[fid].icon) + `<em>${countItem(fid)}</em>` : '<b class="hbplus">＋</b>'; fr.classList.toggle('off', !fid || !countItem(fid)); }
  const ch = $('#hbChar'), w = P.equip && P.equip.weapon, wk = 'w' + (w ? w.id : '');
  if (ch && ch.dataset.k !== wk) { ch.dataset.k = wk; ch.innerHTML = hbIcon(w && ITEMS[w.id] ? ITEMS[w.id].icon : ['sword', 3]); } }
function hbCdTick() { const P = G.P; if (!P) return;
  for (const [bid, id] of [['hbPot', P.potion], ['hbFree', P.hbFree]]) { const b = $('#' + bid); if (!b) continue; let o = b.querySelector('.pcd'); const left = id && ITEMS[id] ? potLeft(id) : 0;
    if (left <= 0) { if (o) o.remove(); continue; } if (!o) { o = document.createElement('span'); o.className = 'pcd'; b.appendChild(o); } o.style.setProperty('--a', Math.round(left / (POT_DUR[potGroup(ITEMS[id])] || 30) * 360) + 'deg'); const t = String(Math.ceil(left)); if (o.textContent !== t) o.textContent = t; } }
function hbFreeUse() { const P = G.P, id = P.hbFree; if (!id || !ITEMS[id]) { hbFreePick(); return; } const i = P.inv.findIndex(s => s && s.id === id); if (i < 0) { toast(L2('No te quedan: ', 'None left: ') + ITEMS[id].n + L2(' (mantén pulsado para cambiar)', ' (long-press to change)'), 'warn', 2); return; }
  const I = ITEMS[id]; if (I.t === 'tool') { equipTool(id); return; } useItem(i); uiDirty.inv = uiDirty.hud = true; hbRefresh(); }
function hbFreePick() { const P = G.P, seen = new Set(), list = []; for (const s of P.inv) { const I = s && ITEMS[s.id]; if (!I || seen.has(s.id)) continue; if (I.t === 'cons' || (I.t === 'tool' && HB_TOOLJOBS.includes(I.tool))) { seen.add(s.id); list.push(s.id); } }
  openModal(`<div class="frame"><h3>★ ${L2('Casilla libre', 'Free slot')}</h3><p class="hint">${L2('Elige qué quieres tener a mano: comida, pociones, libros, cometas, cebos… o una herramienta para cambiarla rápido. Mantén pulsada la casilla para cambiarla otra vez.', 'Choose what you want at hand: food, potions, books, kites, bait… or a tool to swap quickly. Long-press the slot to change it again.')}</p>
    <div class="slist">${list.map(id => `<div class="srow">${iconHTML(ITEMS[id].icon, 22)}<div class="sn"><b>${esc(ITEMS[id].n)}</b><small>×${countItem(id)}</small></div><button class="btn sm ${P.hbFree === id ? 'gold' : ''}" data-hbf="${id}">${P.hbFree === id ? '✓' : L2('Poner', 'Set')}</button></div>`).join('') || `<p class="hint">${L2('No tienes consumibles ni herramientas.', 'You have no consumables or tools.')}</p>`}</div>
    <div class="row">${P.hbFree ? `<button class="btn danger" id="hbfX">${L2('Vaciar casilla', 'Clear slot')}</button>` : ''}<button class="btn" id="hbfC">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#hbfC').onclick = closeModal; const x = $('#hbfX'); if (x) x.onclick = () => { P.hbFree = null; markDirty(); hbRefresh(); closeModal(); };
  $$('#modal [data-hbf]').forEach(b => b.onclick = () => { P.hbFree = b.dataset.hbf; markDirty(); hbRefresh(); closeModal(); toast('★ ' + ITEMS[P.hbFree].n, 'info'); }); }
function hbSetup() { const bar = $('#hotbar'); if (!bar || $('#hbAxe')) return;
  const mk = (id, title) => { const b = document.createElement('button'); b.className = 'hb'; b.id = id; b.title = title; b.setAttribute('aria-label', title); return b; };
  const els = { hbAxe: mk('hbAxe', L2('Hacha: talar', 'Axe: chop')), hbPick: mk('hbPick', L2('Pico: minar', 'Pickaxe: mine')), hbRod: mk('hbRod', L2('Caña: pescar', 'Rod: fish')), hbFree: mk('hbFree', L2('Casilla libre', 'Free slot')) };
  for (const [id] of HB_SLOTS) { const e = els[id] || $('#' + id); if (e) bar.appendChild(e); }
  const ch = $('#hbChar'); if (ch) { ch.title = L2('Arma equipada · Personaje', 'Equipped weapon · Character'); }
  const press = (el, down, up) => { el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); try { audioUnlock(); } catch (_) { } el.classList.add('down'); try { el.setPointerCapture(e.pointerId); } catch (_) { } down(e); }); const u = e => { el.classList.remove('down'); up && up(e); }; el.addEventListener('pointerup', u); el.addEventListener('pointercancel', u); };
  press(els.hbAxe, () => hbGather('tala')); press(els.hbPick, () => hbGather('mineria'));
  press(els.hbRod, () => { if (reel.on) { reel.hold = true; return; } hbGather('pesca'); }, () => { reel.hold = false; });
  let lp = null, lpDone = false; press(els.hbFree, () => { lpDone = false; lp = setTimeout(() => { lpDone = true; hbFreePick(); }, 550); }, e => { clearTimeout(lp); if (!lpDone && e.type === 'pointerup') hbFreeUse(); });
  document.body.classList.add('hb8'); tEqMigrate(); hbRefresh(); }
{ const _s = setupHUD; setupHUD = function () { const r = _s.apply(this, arguments); try { hbSetup(); } catch (e) { console.warn('hotbar', e); } return r; }; }
{ const st = document.createElement('style'); st.textContent = `body.hb8 #hotbar{gap:.28em;padding:.25em .35em}body.hb8 #hotbar .hb{width:3.05em;height:3.05em}body.hb8 #hotbar .hb .ico{transform:scale(.95)}
#hotbar .hb.off>.ico{opacity:.45;filter:grayscale(.6)}#hotbar .hb .hbx{color:#ff6a5a}#hotbar .hbplus{font:bold 1.5em Verdana,sans-serif;color:#ffd040;text-shadow:0 1px 0 #000}
#hotbar .hb.near{box-shadow:0 0 0 2px var(--ink),0 0 .55em .2em #ffd040;animation:hbGlow 1s ease-in-out infinite alternate}@keyframes hbGlow{from{filter:brightness(1)}to{filter:brightness(1.35)}}
#hotbar .hb{position:relative}#hotbar .hb .pcd{position:absolute;inset:0;border-radius:inherit;background:conic-gradient(rgba(0,0,0,.65) var(--a),transparent 0);display:flex;align-items:center;justify-content:center;color:#fff;font:bold 1em Verdana,sans-serif;text-shadow:0 1px 0 #000;pointer-events:none}
@media (orientation:landscape){body.hb8 #hotbar{transform:translateX(calc(-50% - 4.6em))}}@media (orientation:portrait){body.hb8 #hotbar .hb{width:2.6em;height:2.6em}}
.slot .teq{position:absolute;top:1px;right:3px;color:#7aff8a;font:bold 10px Verdana,sans-serif;text-shadow:0 1px 0 #000;pointer-events:none}`; document.head.appendChild(st); }
V33_TICKS.push(() => { const P = G.P; if (!P || !$('#hbAxe')) return; if (HB2.mig !== P) { HB2.mig = P; tEqMigrate(); } HB2.t++; if (HB2.t % 4 === 0) { try { HB2.near.tala = !!(eqTool('tala') && hbFindRes('tala')); HB2.near.mineria = !!(eqTool('mineria') && hbFindRes('mineria')); HB2.near.pesca = !!(eqTool('pesca') && !P.fishing && hbFindWater()); } catch (e) { } }
  hbRefresh(); hbCdTick(); });
// teclado (PC): Z hacha · X pico · C caña · V casilla libre
document.addEventListener('keydown', e => { if (!G.P || e.repeat || /INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) return; if (!$('#hbAxe')) return;
  if (e.code === 'KeyZ') hbGather('tala'); else if (e.code === 'KeyX') hbGather('mineria'); else if (e.code === 'KeyC') { if (reel.on) reel.hold = true; else hbGather('pesca'); } else if (e.code === 'KeyV') hbFreeUse(); });
document.addEventListener('keyup', e => { if (e.code === 'KeyC' && reel.on) reel.hold = false; });

// ---------- inventario: equipar herramientas ----------
{ const _ri = renderInv; renderInv = function (B) { const r = _ri.apply(this, arguments); try { const P = G.P, root = B || document;
  root.querySelectorAll('.slot[data-i]').forEach(b => { const s = P.inv[+b.dataset.i], I = s && ITEMS[s.id]; if (I && I.t === 'tool' && tEq()[I.tool] === s.id && !b.querySelector('.teq')) b.insertAdjacentHTML('beforeend', '<i class="teq">E</i>'); });
  const s = P.inv[invSel], I = s && ITEMS[s.id], R = root.querySelector('.invR');
  if (I && I.t === 'tool' && HB_TOOLJOBS.includes(I.tool) && R && !R.querySelector('#iteq')) { const row = R.querySelector('.row') || R, on = tEq()[I.tool] === s.id, low = (I.lv || 1) > P.lv;
    row.insertAdjacentHTML('afterbegin', `<button class="btn gold" id="iteq" ${low ? 'disabled' : ''}>${low ? L2('Requiere nivel ', 'Requires level ') + I.lv : on ? '✓ ' + L2('Equipada', 'Equipped') : L2('Equipar', 'Equip')}</button>`);
    R.querySelector('#iteq').onclick = () => { if (on) unequipTool(I.tool); else equipTool(s.id); renderPanel(); }; } } catch (e) { console.warn(e); } return r; }; }
// el botón de poción rápida sirve para cualquier poción (curar, maná o tónico)
{ const _ri = renderInv; renderInv = function (B) { const r = _ri.apply(this, arguments); try { const P = G.P, s = P.inv[invSel], I = s && ITEMS[s.id], R = (B || document).querySelector('.invR');
  if (I && potGroup(I) && !I.heal && R && !R.querySelector('#ipot')) { const row = R.querySelector('.row') || R; row.insertAdjacentHTML('beforeend', `<button class="btn" id="ipot2">${P.potion === s.id ? L2('Poción rápida ✓', 'Quick potion ✓') : L2('Usar como poción rápida', 'Use as quick potion')}</button>`); R.querySelector('#ipot2').onclick = () => { P.potion = s.id; toast(L2('Poción rápida: ', 'Quick potion: ') + I.n); hbRefresh(); renderPanel(); }; }
  if (I && R && !R.querySelector('#ihbf') && (I.t === 'cons' || (I.t === 'tool' && HB_TOOLJOBS.includes(I.tool)))) { const row = R.querySelector('.row') || R; row.insertAdjacentHTML('beforeend', `<button class="btn" id="ihbf">${P.hbFree === s.id ? '★ ' + L2('En la casilla libre', 'In the free slot') : '★ ' + L2('Poner en la casilla libre', 'Put in the free slot')}</button>`); R.querySelector('#ihbf').onclick = () => { P.hbFree = s.id; markDirty(); hbRefresh(); renderPanel(); }; }
  } catch (e) { console.warn(e); } return r; }; }
// «Vender basura» no vende la herramienta equipada
if (typeof junkList === 'function') { const _jl = junkList; junkList = function () { const r = _jl.apply(this, arguments); try { const P = G.P, E = tEq(); return r.filter(i => !(P.inv[i] && E[ITEMS[P.inv[i].id] && ITEMS[P.inv[i].id].tool] === P.inv[i].id)); } catch (e) { return r; } }; }

// ---------- colocar vetas y árboles nuevos en sus mapas ----------
const NV_AT = {}; // id de objeto → { m, loc }
// zona preferida en algunos mapas (Cusco: la Montaña de Siete Colores)
const NV_BOX = { cusco: () => (typeof CZ_VI !== 'undefined' ? CZ_VI : null) };
function nvScatter(M, n, seed, used) { const R = new RNG(seed), out = [], bx = NV_BOX[M && M.id] ? NV_BOX[M.id]() : null; if (!M || !M.ter || !M.objAt) return out;
  for (let k = 0; k < 6000 && out.length < n; k++) { const inB = bx && k < 4000, x = inB ? bx.x0 + Math.floor(R.f() * (bx.x1 - bx.x0)) : 6 + Math.floor(R.f() * (M.w - 12)), y = inB ? bx.y0 + Math.floor(R.f() * (bx.y1 - bx.y0)) : 6 + Math.floor(R.f() * (M.h - 12)), i = y * M.w + x; if (i < 0 || i >= M.ter.length) continue;
    const t = M.ter[i]; if (SOLID_T[t] || t === T.WATER || t === T.DEEP || t === T.LAVA || (M.objAt[i] >= 0) || (M.solidO && M.solidO[i]) || (M.flags && (M.flags[i] & 5))) continue;
    if (M.lvl && M.lvl[i] > 0 && M.id !== 'cielo') continue; if (M.doors && M.doors.some(d => Math.abs(d.x - x) < 3 && Math.abs(d.y - y) < 3)) continue;
    if (used.some(([a, b]) => Math.abs(a - x) < 4 && Math.abs(b - y) < 4)) continue;
    // la casilla de debajo también libre (para que se pueda llegar)
    const j = (y + 1) * M.w + x; if (j < M.ter.length && (SOLID_T[M.ter[j]] || M.objAt[j] >= 0)) continue;
    used.push([x, y]); out.push([x, y]); }
  return out; }
function nvPlace(M) { if (!M || M._nv || !M.objs) return; const list = NV_RES.filter(r => r[6] === M.id); if (!list.length) return; M._nv = 1; M._nvPoi = [];
  try { const used = []; for (const [t, , , , sp] of list) { const n = t === 18 ? 6 : 10;
      for (const [x, y] of nvScatter(M, n, 9100 + t * 31 + M.w, used)) { addObj(M, 'ore', x, y, { tier: t, nv: 1 }); }
      for (const [x, y] of nvScatter(M, n, 7700 + t * 17 + M.h, used)) { addObj(M, 'tree', x, y, { sp, nv: 1 }); }
      const o1 = M.objs.find(o => o.k === 'ore' && o.tier === t), o2 = M.objs.find(o => o.k === 'tree' && o.sp === sp);
      if (o1) { M._nvPoi.push({ c: 'nvveta', x: o1.tx, y: o1.ty, t: '⛏ ' + ITEMS['ore' + t].n }); NV_AT['ore' + t] = { m: M.id, loc: [o1.tx, o1.ty] }; }
      if (o2) { M._nvPoi.push({ c: 'nvveta', x: o2.tx, y: o2.ty, t: '🪓 ' + ITEMS['log' + t].n }); NV_AT['log' + t] = { m: M.id, loc: [o2.tx, o2.ty] }; } } } catch (e) { console.warn('nvPlace', e); } }
{ const _sm = setMap; setMap = function (M) { try { nvPlace(M); } catch (e) { } return _sm.apply(this, arguments); }; }
MAPC.nvveta = [L2('Vetas y árboles de nivel alto', 'High-level veins and trees'), 'High-level veins and trees', '#5ae0b0', 'pick'];
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); try { if (M && !M._nv && NV_RES.some(r => r[6] === M.id)) nvPlace(M); if (M && M._nvPoi && Array.isArray(out)) for (const q of M._nvPoi) out.push(Object.assign({}, q)); } catch (e) { } return out; }; }

// ---------- Don Anselmo, el cebero de Puerto Coral ----------
it('lombriz', { n: L2('Lombrices', 'Worms'), t: 'cons', stack: true, price: 20, icon: ['gel', '#d8806a'], rar: 0, d: L2('Cebo: 10 min pescando más rápido, +20 % de experiencia de Pesca y peces más grandes. También es la moneda del cebero.', 'Bait: 10 min of faster fishing, +20% Fishing XP and bigger fish. Also the bait seller\'s currency.') });
it('cebo_dorado', { n: L2('Cebo dorado', 'Golden bait'), t: 'cons', stack: true, price: 800, icon: ['gel', '#ffd040'], rar: 2, d: L2('Cebo fino: 15 min pescando mucho más rápido, +40 % de experiencia de Pesca y más peces de nivel alto.', 'Fine bait: 15 min of much faster fishing, +40% Fishing XP and more high-level fish.') });
const BAIT = { lombriz: { dur: 600, w: 0.65, xp: 20, hi: 0.25 }, cebo_dorado: { dur: 900, w: 0.45, xp: 40, hi: 0.5 } };
function baitOn() { const P = G.P, b = P && (P.buffs || []).find(b => b.id === 'cebo'); return b ? BAIT[b.st.k === 2 ? 'cebo_dorado' : 'lombriz'] : null; }
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P && P.inv[idx]; if (s && BAIT[s.id]) { const B = BAIT[s.id]; addBuff(P, 'cebo', { k: s.id === 'cebo_dorado' ? 2 : 1 }, B.dur); takeItem(s.id, 1); sfx('pickup'); toast('🪱 ' + ITEMS[s.id].n + L2(': cebo puesto (', ': bait on (') + Math.round(B.dur / 60) + ' min)', 'quest'); uiDirty.inv = uiDirty.hud = true; return; } return _ui.apply(this, arguments); }; }
{ const _sf = startFishing; startFishing = function () { const r = _sf.apply(this, arguments); const B = baitOn(), F = G.P.fishing; if (B && F && F.state === 'wait') F.t *= B.w; return r; }; }
{ const _pf = pickFish; pickFish = function (hab) { const B = baitOn(); if (B && Math.random() < B.hi) { const P = G.P, lv = (P.jobs.pesca || { lv: 1 }).lv, rod = bestTool('pesca'); const pool = FISH.filter(f => f[3].includes(hab) && RESLV[f[2]] <= lv && toolNeed('pesca', f[2]) <= rod); if (pool.length) { const mx = Math.max(...pool.map(f => f[2])), top = pool.filter(f => f[2] >= mx - 1); return pick(top); } } return _pf.apply(this, arguments); }; }
{ const _gj = gainJobXp; gainJobXp = function (job, n) { const B = job === 'pesca' && baitOn(); return _gj.call(this, job, B && n > 0 ? Math.round(n * (1 + B.xp / 100)) : n); }; }
// lombrices al talar (bajo los troncos) y al excavar
{ const _hb = jobHarvestBonus; jobHarvestBonus = function (kind) { const r = _hb.apply(this, arguments); try { if (kind === 'tala' && Math.random() < 0.15) { giveItem('lombriz', 1 + (Math.random() < 0.3 ? 1 : 0)); } } catch (e) { } return r; }; }
{ const _fd = finishDig; finishDig = function () { const r = _fd.apply(this, arguments); try { if (Math.random() < 0.25) giveItem('lombriz', 2); } catch (e) { } return r; }; }
NPCS.cebero = { n: L2('Don Anselmo', 'Old Anselmo'), title: L2('Cebero del muelle', 'Dock bait seller'), look: LK({ g: 'm', hair: HAIRS.gris, outfit: 'sailor', main: P5(['#1a2a3a', '#2a4a6a', '#3a6a8a', '#6a9ab8', '#b0d0e8']) }), lines: [L2('Con buen cebo pica hasta el pez más desconfiado. Y si me traes lombrices, te cambio peces raros para tu acuario.', 'With good bait even the wariest fish bites. Bring me worms and I\'ll trade you rare fish for your aquarium.')], quests: [] };
NPC_CAT.cebero = 'store';
let CEB_AT = null;
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); try { const t = TOWNS.find(t => t.k === 'puerto'), [x, y] = freeTileNear(W, t.x0 + 6, t.y1 - 4); W.npcDefs.push({ id: 'cebero', x, y, face: 'down' }); CEB_AT = [x, y]; } catch (e) { console.warn(e); } }; }
const CEB_TAB = { t: 'cebo' };
function cebFishPrice(id) { const I = ITEMS[id]; return { g: Math.round(I.price * 4), w: Math.max(4, Math.round(I.tier * 2.5)) }; }
function cebShop() { const P = G.P, wN = countItem('lombriz'), tab = CEB_TAB.t;
  const chips = [['cebo', '🪱 ' + L2('Cebos', 'Bait')], ['peces', '🐟 ' + L2('Peces para el acuario', 'Aquarium fish')]].map(([k, n]) => `<button class="chip ${tab === k ? 'on' : ''}" data-ct="${k}">${n}</button>`).join('');
  let body = '';
  if (tab === 'cebo') body = [['lombriz', 10, 200], ['lombriz', 50, 900], ['cebo_dorado', 1, 800], ['cebo_dorado', 5, 3600]].map(([id, n, g]) => `<div class="gsrc"><span>${iconHTML(ITEMS[id].icon, 18)} ${esc(ITEMS[id].n)} ×${n}<br><small>${esc(ITEMS[id].d)}</small></span><button class="btn sm gold" data-cb="${id},${n},${g}" ${P.gold < g ? 'disabled' : ''}>${fmt(g)} ${L2('oro', 'gold')}</button></div>`).join('')
    + `<p class="hint">${L2('También salen lombrices al talar árboles y al excavar montículos.', 'You also find worms when chopping trees and digging mounds.')}</p>`;
  else body = NV_FISH.map(f => f[0]).map(id => { const p = cebFishPrice(id), I = ITEMS[id]; return `<div class="gsrc"><span>${iconHTML(I.icon, 18)} ${esc(I.n)} <small>(${L2('nivel ', 'level ')}${I.tier})</small></span><span><button class="btn sm gold" data-cf="${id},g" ${P.gold < p.g ? 'disabled' : ''}>${fmt(p.g)} ${L2('oro', 'gold')}</button> <button class="btn sm" data-cf="${id},w" ${wN < p.w ? 'disabled' : ''}>${p.w} 🪱</button></span></div>`; }).join('');
  openModal(`<div class="frame"><h3>🎣 ${L2('Don Anselmo, el cebero', 'Old Anselmo, bait seller')}</h3><p class="hint">${L2('Tienes ', 'You have ')}${fmt(P.gold)} ${L2('oro', 'gold')} · ${wN} 🪱. ${L2('Usa el cebo desde el inventario antes de pescar.', 'Use the bait from the bag before fishing.')}</p><div class="chips">${chips}</div><div class="slist">${body}</div><div class="row"><button class="btn" id="cbX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#cbX').onclick = closeModal; $$('#modal [data-ct]').forEach(b => b.onclick = () => { CEB_TAB.t = b.dataset.ct; cebShop(); });
  $$('#modal [data-cb]').forEach(b => b.onclick = () => { const [id, n, g] = b.dataset.cb.split(','); if (P.gold < +g) return; P.gold -= +g; giveItem(id, +n); sfx('coin'); markDirty(true); cebShop(); });
  $$('#modal [data-cf]').forEach(b => b.onclick = () => { const [id, k] = b.dataset.cf.split(','), p = cebFishPrice(id); if (k === 'g') { if (P.gold < p.g) return; P.gold -= p.g; } else { if (countItem('lombriz') < p.w) return; takeItem('lombriz', p.w); } giveItem(id, 1); if (P.seen) P.seen[id] = 1; sfx('coin'); markDirty(true); cebShop(); }); }
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'cebero') return; opts.unshift({ label: '🎣 ' + L2('Cebos y peces', 'Bait and fish'), icon: ['bag'], fn: () => { closeDialog(); cebShop(); } }); });
// la tienda de herramientas vende también lombrices
try { for (const tk of ['puerto', 'albor']) if (Array.isArray(SHOPS.store[tk]) && !SHOPS.store[tk].includes('lombriz')) SHOPS.store[tk].push('lombriz'); } catch (e) { }

// ---------- Lupa: dónde conseguir (con flecha) ----------
{ const _is = itemSources; itemSources = function (id) { const r = _is.apply(this, arguments); try {
  const m = /^(ore|log)(\d+)$/.exec(id); if (m && +m[2] >= 12) { const R = NV_RES.find(x => x[0] === +m[2]), at = NV_AT[id], mapId = R[6], tl = m[1] === 'ore' ? L2('Minería (pico de potencia ', 'Mining (pickaxe power ') : L2('Tala (hacha de potencia ', 'Woodcutting (axe power ');
    const loc = at ? at.loc : null; if (loc) wpKey(loc, at.m);
    const out = [[tl + toolNeed(m[1] === 'ore' ? 'mineria' : 'tala', +m[2]) + L2(', oficio nivel ', ', job level ') + RESLV[+m[2]] + '): ' + nvMapN(mapId) + (loc ? '' : L2(' (entra una vez en ese mapa y sale la flecha)', ' (enter that map once to get the arrow)')), loc ? { loc, t: ITEMS[id].n, m: at.m } : null]];
    return out.concat(r.filter(x => !/^(Minería|Mining|Tala|Woodcutting)/.test(x[0]))); }
  if (NV_FISH.some(f => f[0] === id)) { const f = NV_FISH.find(f => f[0] === id), H = { peru: L2('Perú (costa de Lima, Lima Norte, Trujillo)', 'Peru (Lima coast, North Lima, Trujillo)'), andes: L2('Cusco y los Andes', 'Cusco and the Andes'), mexico: L2('México (costa, Xochimilco)', 'Mexico (coast, Xochimilco)'), japon: L2('Japón', 'Japan'), mar: L2('el mar', 'the sea'), rio: L2('ríos', 'rivers'), lago: L2('lagos', 'lakes'), selva: L2('la selva', 'the jungle'), cristal: L2('el Bosque de Cristal', 'the Crystal Forest'), eclipse: L2('las Tierras del Eclipse', 'the Eclipse Lands'), hielo: L2('los Picos helados', 'the frozen Peaks'), oasis: L2('el oasis del desierto', 'the desert oasis'), pantano: L2('el pantano', 'the swamp'), volcan: L2('el volcán', 'the volcano'), lava: L2('la lava (Caña Ignífuga o mejor)', 'lava (Fireproof Rod or better)'), nhar: L2('Nhar', 'Nhar') };
    const out = [[L2('Pesca (caña de potencia ', 'Fishing (rod power ') + toolNeed('pesca', f[3]) + L2(', oficio nivel ', ', job level ') + RESLV[f[3]] + '): ' + f[4].map(h => H[h] || h).join(', '), null], [L2('Don Anselmo, el cebero de Puerto Coral (oro o lombrices)', 'Old Anselmo, the bait seller in Puerto Coral (gold or worms)'), CEB_AT ? { loc: CEB_AT, t: 'Don Anselmo' } : null]];
    return out.concat(r.filter(x => !/^(Pesca en|Fish in)/.test(x[0]))); }
  if (id === 'lombriz' || id === 'cebo_dorado') return [[L2('Don Anselmo, el cebero de Puerto Coral', 'Old Anselmo, the bait seller in Puerto Coral'), CEB_AT ? { loc: CEB_AT, t: 'Don Anselmo' } : null]].concat(id === 'lombriz' ? [[L2('Al talar árboles (15 %) y excavar montículos (25 %)', 'When chopping trees (15%) and digging mounds (25%)'), null]] : []).concat(r);
  } catch (e) { console.warn(e); } return r; }; }
USO_X.lombriz = () => [L2('🪱 Cebo de pesca (úsalo antes de pescar) y moneda de Don Anselmo para comprar peces del acuario.', '🪱 Fishing bait (use it before fishing) and Old Anselmo\'s currency for aquarium fish.')];
USO_X.cebo_dorado = () => [L2('🪱 Cebo fino de pesca: más rápido, más experiencia y peces de más nivel durante 15 min.', '🪱 Fine fishing bait: faster, more XP and higher-level fish for 15 min.')];

// ---------- Lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['herram564', '🪓 ' + L2('Herramientas, barra de abajo, minerales y peces nuevos', 'Tools, bottom bar, new ores and fish'), () => [
  L2('🪓 Hachas, ⛏ picos y 🎣 cañas se equipan en el inventario: toca la herramienta › Equipar (la que tienes puesta lleva una «E»).', '🪓 Axes, ⛏ pickaxes and 🎣 rods are equipped in the bag: tap the tool › Equip (the one you wear shows an «E»).'),
  L2('▦ Barra de abajo: hacha · poción · pico · caña · ★ casilla libre · mochila · tu arma (Personaje) · misiones. La casilla brilla cuando tienes un árbol, una veta o agua al lado.', '▦ Bottom bar: axe · potion · pickaxe · rod · ★ free slot · bag · your weapon (Character) · quests. A slot glows when a tree, vein or water is next to you.'),
  L2('⚔ ya no tala ni pica ni pesca: acércate y pulsa la casilla de la herramienta. Para pescar, vuelve a pulsar la caña cuando pique y mantenla para recoger. En PC: Z hacha, X pico, C caña, V casilla libre.', '⚔ no longer chops, mines or fishes: walk up and tap the tool slot. To fish, tap the rod again when it bites and hold to reel in. On PC: Z axe, X pickaxe, C rod, V free slot.'),
  L2('★ Casilla libre: toca para usar lo que pusiste (comida, cebo, libro…); mantén pulsado para elegir otra cosa.', '★ Free slot: tap to use what you set (food, bait, book…); long-press to pick something else.'),
  L2('🧪 Pociones: 30 s de espera entre una y otra (curar, maná y tónicos van por separado). La poción rápida puede ser cualquiera.', '🧪 Potions: 30 s cooldown between uses (healing, mana and tonics are separate). The quick potion can be any of them.'),
  L2('⛏ 7 minerales y 🪵 7 maderas nuevas (nivel de oficio 78-114): Aurorita y Árbol Nube (Celestia), Ceruleíta y Sauce Aurora (Altavela), Velonita y Roble Velado (Velo Roto), Quilla y Queñua (Lima Norte, Perú), Cuarzo de Vinicunca y Palo Santo (Cusco, Perú), Ópalo de Fuego y Ahuehuete (México), Tejedita y Árbol del Telar (Velo Roto, muy raros).', '⛏ 7 new ores and 🪵 7 new woods (job level 78-114): Aurorite and Cloud Tree (Celestia), Ceruleite and Aurora Willow (Altavela), Veilite and Veiled Oak (Broken Veil), Quilla and Queñua (North Lima, Peru), Vinicunca Quartz and Palo Santo (Cusco, Peru), Fire Opal and Ahuehuete (Mexico), Weaverite and Loom Tree (Broken Veil, very rare).'),
  L2('⚒ 7 hachas, 7 picos y 7 cañas nuevas en la herrería (nivel 170-450). Cada pico abre el mineral siguiente, con el que se hace el pico de después.', '⚒ 7 new axes, 7 pickaxes and 7 rods at the smithy (level 170-450). Each pickaxe opens the next ore, which makes the following pickaxe.'),
  L2('📈 Tala, Minería y Pesca suben ahora hasta el nivel 120 (+30 con la maestría).', '📈 Woodcutting, Mining and Fishing now go up to level 120 (+30 with mastery).'),
  L2('🐟 40 peces nuevos (nivel 12-18) en el mundo, Perú, México y Japón: salen en el bestiario y van al acuario. 🎣 Don Anselmo, en el muelle de Puerto Coral, vende lombrices y cebo dorado (pescas más rápido, más experiencia y peces más grandes) y cambia peces por oro o lombrices.', '🐟 40 new fish (level 12-18) in the world, Peru, Mexico and Japan: they appear in the bestiary and go in the aquarium. 🎣 Old Anselmo, on the Puerto Coral dock, sells worms and golden bait (faster fishing, more XP and bigger fish) and trades fish for gold or worms.')
], () => CEB_AT ? { loc: CEB_AT, t: 'Don Anselmo' } : null]);
