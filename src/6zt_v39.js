// ================= v3.9: mapa con tiendas y servicios, flechas entre mundos, accesorios por clase, set del Heraldo Nocturno, nuevas espadas =================
// ---------- 1. ESPADAS NUEVAS (sprites de las hojas 4 y 5) ----------
Object.assign(WS, {
  hambrienta: { n: L2('Hoja Hambrienta', 'Hungering Blade'), lv: 140, len: 16, w: 2, tw: 1, pal: ['#3a1a4a', '#7a3a9a', '#c070e0', '#f0c0ff', '#ffffff'], gp: ['#5a3a0a', '#a8701a', '#e0b040', '#ffe080', '#ffffff'], guard: 'horns', glow: '#e040ff', fx: 'life', d: L2('Una hoja maldita con fauces de luz: cada golpe le devuelve vida a quien la empuña.', 'A cursed blade with jaws of light: every hit gives life back to its wielder.') },
  eclipse: { n: L2('Espada del Eclipse', 'Eclipse Sword'), lv: 150, len: 16, w: 2, tw: 1, pal: ['#2a1a4a', '#5a3a8a', '#a080d8', '#e0d0ff', '#ffffff'], gp: ['#5a3a0a', '#a8701a', '#e0b040', '#ffe080', '#ffffff'], guard: 'sun', glow: '#ffb040', fx: 'abyss', d: L2('Forjada con la sombra del Señor del Eclipse. Su tajo deja un sol negro.', 'Forged from the shadow of the Lord of the Eclipse. Its slash leaves a black sun.') },
});
if (ITEMS.wc_guerrero) ITEMS.wc_guerrero.ws = 'hambrienta';
{ const S = WS.eclipse, base = Object.values(ITEMS).filter(i => i.slot === 'weapon' && i.cls === 'guerrero' && i.lv <= S.lv && !i.ws && !i.leg && !i.cursedW).sort((a, b) => b.lv - a.lv)[0];
  if (base) it('ws_eclipse', { n: S.n, t: 'weapon', slot: 'weapon', cls: 'guerrero', lv: S.lv, tier: base.tier, ws: 'eclipse', atk: Math.round(base.atk * 1.12), crit: 6, rar: 5, price: base.price * 3, icon: ['wsword', 'eclipse'] });
  if (BOSSES.eclipsor) BOSSES.eclipsor.drops.push(['ws_eclipse', 0.12, 1]); }
// la maldita usa la hoja "Hoja Hambrienta" y los efectos de su fila
if (WSPR2_PIX.ws_hambrienta) { WSPR2_PIX.wc_guerrero = WSPR2_PIX.ws_hambrienta; WSPR2_ROW.wc_guerrero = WSPR2_ROW.ws_hambrienta; }
// los objetos creados después de 6zh (cielo, eclipse) también usan su sprite
for (const id in WSPR2_PIX) if (ITEMS[id]) ITEMS[id].icon = ['wspr', 'id', id];
// espadas de tier 19-21 en la mano
{ const _wf = wsprForWeapon; wsprForWeapon = function (W) { if (W && W.k === 'sword' && !W.ws && !W.leg) { const t = W.tier | 0; if (t >= 19 && t <= 21 && WSPR2_PIX['w_guerrero_' + t]) return { pix: WSPR2_PIX['w_guerrero_' + t], piv: WSPR_PIVOT.sword }; } return _wf(W); }; }

// ---------- 2. BALANCE DE ACCESORIOS ----------
// los de las cuevas (v3.7) se crearon después del límite de 6zf y daban 9.000-12.000 de vida: se vuelve a aplicar el límite a todos
for (const it of Object.values(ITEMS)) { if (it.slot !== 'acc' && it.slot !== 'neck') continue; const lv = Math.max(1, it.lv || 1);
  if (it.hpB) it.hpB = Math.min(it.hpB, Math.max(300, Math.round(lv * 10))); if (it.def) it.def = Math.min(it.def, Math.max(20, Math.round(lv * 1.6))); if (it.atk) it.atk = Math.min(it.atk, Math.max(20, Math.round(lv * 2.4))); if (it.mpB) it.mpB = Math.min(it.mpB, Math.max(200, Math.round(lv * 5))); }
// accesorios de clase para el cielo (no había nada entre el nivel 178 y el 250): ataque, defensa y vida casi al tope + el extra de cada clase
const ACC_CLS = {
  guerrero: [[L2('Anillo del Bastión Alado', 'Winged Bulwark Ring'), L2('Colgante del Juramento Celeste', 'Celestial Oath Pendant')], { atk: 2.2, def: 1.6, hpB: 10 }],
  mago: [[L2('Anillo del Firmamento', 'Firmament Ring'), L2('Colgante de la Estrella Errante', 'Wandering Star Pendant')], { atk: 2.4, def: 1.4, hpB: 9, mpB: 5 }],
  arquero: [[L2('Anillo del Ojo Certero', 'True Eye Ring'), L2('Colgante del Viento Alto', 'High Wind Pendant')], { atk: 2.4, def: 1.4, hpB: 9, crit: 14 }],
  asesino: [[L2('Anillo del Filo Nublado', 'Clouded Edge Ring'), L2('Colgante de la Sombra Alada', 'Winged Shadow Pendant')], { atk: 2.4, def: 1.4, hpB: 9, crit: 18 }],
  bardo: [[L2('Anillo del Coro Alto', 'High Choir Ring'), L2('Colgante de la Última Nota', 'Last Note Pendant')], { atk: 2.2, def: 1.4, hpB: 10, mpB: 4 }],
  invocador: [[L2('Anillo de las Almas Celestes', 'Celestial Souls Ring'), L2('Colgante del Pacto Alado', 'Winged Pact Pendant')], { atk: 2.4, def: 1.4, hpB: 9, mpB: 4 }],
  pez: [[L2('Anillo de Espuma de Nube', 'Cloud Foam Ring'), L2('Colgante de la Marea Alta', 'High Tide Pendant')], { atk: 2.2, def: 1.6, hpB: 10, crit: 8 }],
};
for (const c in ACC_CLS) { if (!CLASSES[c]) continue; const [names, k] = ACC_CLS[c];
  [['acc_cielo_', 'acc', 205, 4], ['col_cielo_', 'neck', 240, 5]].forEach(([pre, slot, lv, rar], j) => { const st = {}; for (const s in k) st[s] = s === 'crit' ? k[s] : Math.round(k[s] * lv); it(pre + c, Object.assign({ n: names[j], t: 'acc', slot, lv, cls: c, price: 40 * lv * (rar + 1), icon: [slot === 'neck' ? 'amulet' : 'ring', 15], rar }, st)); }); }
{ const _os = openShop; openShop = function (kind, town) { const L = SHOPS.armor && SHOPS.armor.cielo; if (kind === 'armor' && town === 'cielo' && L && G.P) { const id = 'acc_cielo_' + G.P.cls; SHOPS.armor.cielo = L.filter(x => !/^acc_cielo_/.test(x)); if (ITEMS[id]) SHOPS.armor.cielo.push(id); } return _os(kind, town); }; }
const SKY_BOSS_IDS = ['rey_grifo_aurion', 'tifon', 'seraviel', 'telar_viviente', 'nihil'];
{ const _km = killMob; killMob = function (m) { const r = _km(m); const P = G.P; if (P && m && m.boss && P.map === 'cielo' && Math.random() < 0.25) { const id = 'col_cielo_' + P.cls; if (ITEMS[id]) { giveItem(id, 1); toast('¡' + ITEMS[id].n + '!', 'quest', 5); } } return r; }; }

// ---------- 3. SET DEL HERALDO NOCTURNO (cosmético original, hombre y mujer) ----------
const HERALD_K = P5(['#04040a', '#0c0c14', '#181822', '#262634', '#3c3c50']), HERALD_L = [C('#b8b8c8'), C('#f6f6fc')];
const HERALD_SRC = L2('Jefes de las Islas del Cielo', 'Sky Isles bosses');
cosm('c_heraldo_torso', L2('Pintura del Heraldo Nocturno', 'Night Herald Warpaint'), 'body', () => ({ k: 'warpaint', m: HERALD_K, s: HERALD_K, l: HERALD_L }), { src: L2('Telar Viviente (Islas del Cielo)', 'Living Loom (Sky Isles)') });
cosm('c_heraldo_grebas', L2('Grebas del Heraldo Nocturno', 'Night Herald Greaves'), 'legs', () => ({ k: 'greaves', m: HERALD_K, s: P5(['#5a5a6a', '#8a8a9a', '#c8c8d8', '#f0f0f8', '#ffffff']) }), { src: L2('Tifón (Islas del Cielo)', 'Typhoon (Sky Isles)') });
cosm('c_heraldo_botas', L2('Botas del Heraldo Nocturno', 'Night Herald Boots'), 'feet', () => ({ k: 'sabatons', m: HERALD_K }), { src: L2('Aurion (Islas del Cielo)', 'Aurion (Sky Isles)') });
cosm('c_heraldo_capa', L2('Capa del Heraldo Nocturno', 'Night Herald Cloak'), 'back', () => ({ k: 'cape', o: HERALD_K, i: P5(['#020206', '#06060c', '#0c0c14', '#141420', '#1e1e2c']), tr: P5(['#8a8a9a', '#b8b8c8', '#e0e0ec', '#f6f6fc', '#ffffff']) }), { src: L2('Seraviel (Islas del Cielo)', 'Seraviel (Sky Isles)') });
const HERALD_SET = ['c_heraldo_torso', 'c_heraldo_grebas', 'c_heraldo_botas', 'c_heraldo_capa'];
[['rey_grifo_aurion', 'c_heraldo_botas'], ['tifon', 'c_heraldo_grebas'], ['seraviel', 'c_heraldo_capa'], ['telar_viviente', 'c_heraldo_torso']].forEach(([b, c]) => { if (BOSSES[b]) BOSSES[b].cos = (BOSSES[b].cos || []).concat(c); });
if (BOSSES.nihil) BOSSES.nihil.cos = (BOSSES.nihil.cos || []).concat(HERALD_SET);   // Nihil puede soltar cualquier pieza que falte

// ---------- 4. MAPA: tiendas y servicios con leyenda, flechas para ver los otros mundos ----------
UI_ICONS.push('mk:horse', 'mk:train', 'mk:ship', 'mk:yacht', 'mk:airship', 'mk:law', 'mk:cave', 'mk:portal', 'mk:scis', 'mk:dive');
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'mk') return _gi(spec); const p = new Pix(16, 16), k = spec[1];
  if (k === 'horse') { p.poly([[5, 15], [6, 8], [4, 6], [2, 7], [1, 5], [4, 2], [7, 1], [10, 3], [12, 8], [12, 15]], C('#a0663a')); p.line(8, 2, 11, 9, C('#3a2010')); p.line(9, 2, 12, 9, C('#3a2010')); p.set(5, 4, C('#1a1010')); p.hl(6, 10, 5, C('#c88a52')); }
  else if (k === 'train') { p.rect(3, 3, 10, 9, C('#c03a2a')); p.rect(5, 5, 6, 3, C('#bfe8ff')); p.ball(8, 10, 1.5, 1.2, [C('#ffe060'), C('#fff8c0')]); p.rect(3, 12, 3, 2, C('#2a2a2a')); p.rect(10, 12, 3, 2, C('#2a2a2a')); p.rect(7, 1, 2, 2, C('#3a3a3a')); }
  else if (k === 'ship') { p.poly([[1, 10], [15, 10], [13, 14], [3, 14]], C('#7a4a22')); p.vl(8, 1, 10, C('#5a3a1a')); p.poly([[8, 2], [13, 9], [8, 9]], C('#f0ead8')); p.poly([[8, 3], [4, 9], [8, 9]], C('#d8d0b8')); }
  else if (k === 'yacht') { p.poly([[1, 10], [15, 9], [13, 13], [3, 13]], C('#f4f4f8')); p.hl(3, 11, 11, C('#2a6ad8')); p.rect(5, 6, 6, 3, C('#e0e8f0')); p.hl(6, 7, 4, C('#3a5a8a')); p.vl(9, 2, 4, C('#9aa6b0')); }
  else if (k === 'airship') { p.ball(8, 6, 7, 4, [C('#7a5a2a'), C('#c8a050'), C('#e8c870'), C('#fff0b0')]); p.line(4, 9, 6, 12, C('#3a2a1a')); p.line(12, 9, 10, 12, C('#3a2a1a')); p.rect(5, 12, 6, 3, C('#6a4a2a')); }
  else if (k === 'law') { const g = C('#d8b040'); p.vl(8, 2, 12, g); p.hl(2, 4, 13, g); p.line(3, 4, 1, 9, g); p.line(3, 4, 5, 9, g); p.line(13, 4, 11, 9, g); p.line(13, 4, 15, 9, g); p.hl(1, 9, 5, C('#a07a20')); p.hl(11, 9, 5, C('#a07a20')); p.hl(5, 14, 7, g); }
  else if (k === 'cave') { p.ball(8, 10, 7, 6, [C('#3a3430'), C('#5a524a'), C('#7a7066'), C('#9a9086')]); p.ball(8, 12, 3.5, 4, [C('#05040a'), C('#0a0810')]); }
  else if (k === 'portal') { p.ball(8, 8, 6, 7, [C('#3a1a6a'), C('#7a4ad0'), C('#c8a0ff'), C('#f0e0ff')]); p.ball(8, 8, 3.5, 5, [C('#0a0418'), C('#1a0a30')]); }
  else if (k === 'scis') { p.line(3, 2, 11, 11, C('#c8d0d8')); p.line(12, 2, 4, 11, C('#e8eef4')); p.ball(3, 12, 2, 2, [C('#a02a2a'), C('#ff6a6a')]); p.ball(12, 12, 2, 2, [C('#a02a2a'), C('#ff6a6a')]); }
  else if (k === 'dive') { p.ball(8, 8, 6, 6, [C('#0a3a6a'), C('#2a7ac0'), C('#6ac0f0'), C('#c0f0ff')]); p.ball(8, 8, 3, 3, [C('#8ad8ff'), C('#e0f8ff')]); p.vl(13, 2, 9, C('#f0d040')); }
  p.outline(OUTL); return p; }; }
const MAPC = {   // categoría: [ES, EN, color del borde, icono]
  smith: ['Herrería', 'Smithy', '#ff8a3a', 'anvil'], store: ['Tienda', 'Shop', '#ffd040', 'bag'], alchemy: ['Alquimia', 'Alchemy', '#ff5a6a', 'potion'],
  inn: ['Posada y taberna', 'Inn & tavern', '#d0a060', 'food'], jeweler: ['Joyería', 'Jeweler', '#9af0ff', 'ring'], tailor: ['Sastrería (cosméticos)', 'Tailor (cosmetics)', '#ff8ad0', 'hanger'],
  farm: ['Granja (semillas)', 'Farm (seeds)', '#7ad05a', 'seed'], mount: ['Monturas (establo)', 'Mounts (stable)', '#d0a050', 'mk:horse'], pet: ['Mascotas', 'Pets', '#ffb0d0', 'paw'],
  fine: ['Pagar multas (guardia)', 'Pay fines (guard)', '#ff4040', 'mk:law'], train: ['Estación de tren', 'Train station', '#e05a40', 'mk:train'], ship: ['Barcos y galeón', 'Ships & galleon', '#c8a070', 'mk:ship'],
  yacht: ['Yate', 'Yacht', '#5aa0ff', 'mk:yacht'], air: ['Aeronave (al cielo)', 'Airship (to the sky)', '#ffe080', 'mk:airship'], dive: ['Buceo', 'Diving', '#5ad0ff', 'mk:dive'],
  guild: ['Gremio', 'Guild', '#a0a0ff', 'flag'], trainer: ['Maestros de oficio', 'Job masters', '#8ae0a0', 'book'], caravan: ['Caravanas', 'Caravans', '#e0c080', 'coin'],
  barber: ['Peluquería', 'Barber', '#ff9ac0', 'mk:scis'], arena: ['Coliseo', 'Coliseum', '#ff7040', 'sword'], fest: ['Festivales', 'Festivals', '#ff70ff', 'note'],
  build: ['Obras y donaciones', 'Building & donations', '#c0a080', 'hammer'], royal: ['Reino y nobleza', 'Kingdom & nobility', '#ffd040', 'crown'], ascend: ['Ascensión y evolución', 'Ascension & evolution', '#fff0a0', 'star'],
  home: ['Casas y terrenos en venta', 'Houses & land for sale', '#8ad08a', 'house'], myhome: ['Tu casa', 'Your house', '#40ff80', 'house'], cave: ['Cuevas y mazmorras', 'Caves & dungeons', '#a09080', 'mk:cave'],
  portal: ['Portales y altares', 'Portals & altars', '#c070ff', 'mk:portal'], boss: ['Jefes', 'Bosses', '#ff40a0', 'skull'], lore: ['Estelas y pistas del lore', 'Lore stelae & clues', '#d8c8ff', 'scroll'],
};
const mapcN = k => L2(MAPC[k][0], MAPC[k][1]);
function mapIconIdx(pre) { if (ICON.keys[pre] !== undefined) return ICON.keys[pre]; for (const k in ICON.keys) if (k === pre || k.startsWith(pre + ':')) return ICON.keys[k]; return undefined; }
const NPC_CAT = { establo: 'mount', cuidadora: 'pet', taquilla: 'train', marina: 'ship', navegante: 'ship', marina_nhar: 'ship', capitan_galeon: 'ship', capitana: 'yacht', ingeniera: 'air', piloto: 'air', instructora: 'dive', moana: 'dive', nalu: 'dive',
  caravanero: 'caravan', peluquera: 'barber', lanista: 'arena', ceremonias: 'fest', oraculo: 'ascend', heraldo_corona: 'royal', heraldo_sol: 'royal', darius: 'fine', rolf: 'fine', mercader_islas: 'smith', sirena_perla: 'smith', forjador_alado: 'smith', mercader_celeste: 'store',
  reina_nerea: 'royal', capataz_mina: 'cave', espiritu_guia: 'portal', mercader_amb: 'store', mercader_nuevo: 'store', artesana_nueva: 'jeweler' };
function npcCat(id) { const D = NPCS[id]; if (!D) return null; if (NPC_CAT[id]) return NPC_CAT[id]; if (/^guardia/.test(id)) return 'fine'; if (/^maestr[oa]_/.test(id)) return 'trainer'; if (/^capataz_/.test(id)) return 'build'; if (/^evo_/.test(id)) return 'ascend';
  return { smith: 'smith', store: 'store', inn: 'inn', alchemy: 'alchemy', jeweler: 'jeweler', gems: 'jeweler', tailor: 'tailor', farm: 'farm', armor: 'smith', guild: 'guild' }[D.shop] || null; }
const DOOR_CAT = [[/^herreria_/, 'smith'], [/^tienda_brasa2$/, 'dive'], [/^tienda_/, 'store'], [/^posada_/, 'inn'], [/^alquimia_/, 'alchemy'], [/^gremio/, 'guild'], [/^castillo$/, 'royal'], [/^torre_magos$/, 'ascend']];
function townAtTile(x, y) { return TOWNS.find(t => x >= t.x0 - 3 && x <= t.x1 + 3 && y >= t.y0 - 3 && y <= t.y1 + 3); }
function worldPOI() {
  const W = G.world, out = [], P = G.P, home = typeof isHome === 'function' ? isHome : () => false;
  const where = (x, y) => { const t = townAtTile(x, y); if (t) return t.n; const r = typeof regionAt === 'function' ? regionAt(x, y) : null; return r ? r.n : ''; };
  for (const d of W.doors) { let c = null; for (const [re, k] of DOOR_CAT) if (re.test(d.to)) { c = k; break; } if (d.cave) c = 'cave'; if (!c && HOUSES[d.to]) c = home(d.to) ? 'myhome' : 'home'; if (!c && /^(tumba|mina)/.test(d.to)) c = 'cave'; if (c) out.push({ c, x: d.x, y: d.y, t: mapcN(c) + ' · ' + where(d.x, d.y) }); }
  const fines = new Set();
  for (const n of W.npcDefs) { const c = npcCat(n.id); if (!c) continue; if (c === 'fine') { const t = townAtTile(n.x, n.y), tk = t ? t.k : n.id; if (fines.has(tk)) continue; fines.add(tk); }
    if (c === 'train' && out.some(o => o.c === 'train' && Math.abs(o.x - n.x) + Math.abs(o.y - n.y) < 6)) continue;
    const D = NPCS[n.id]; out.push({ c, x: n.x, y: n.y, t: mapcN(c) + ' · ' + (D.n || '') + (where(n.x, n.y) ? ' (' + where(n.x, n.y) + ')' : '') }); }
  for (const o of W.objs) { if (o.k === 'plot' && !(P.plots && P.plots[o.pid])) { if (!out.some(q => q.c === 'home' && q.plot && Math.abs(q.x - o.tx) + Math.abs(q.y - o.ty) < 8)) out.push({ c: 'home', plot: 1, x: o.tx, y: o.ty, t: L2('Terreno en venta', 'Land for sale') + ' · ' + where(o.tx, o.ty) }); }
    else if (o.veilAltar || o.k === 'portal') out.push({ c: 'portal', x: o.tx, y: o.ty, t: (o.veilAltar ? L2('Altar del Velo (Mundo Espiritual)', 'Veil Altar (Spirit World)') : L2('Portal', 'Portal')) });
  }
  return out;
}
function otherPOI(M) {
  const out = [];
  for (const e of G.ents) { if (e.type !== 'npc' || e.map !== M.id) continue; const c = npcCat(e.id); if (!c) continue; out.push({ c, x: e.x / 16, y: e.y / 16, t: mapcN(c) + ' · ' + ((e.def && e.def.n) || '') }); }
  for (const b of M.bossAt || []) { const B = BOSSES[b.id]; if (B) out.push({ c: 'boss', x: b.x, y: b.y, t: L2('Jefe', 'Boss') + ' · ' + B.n + ' (' + L2('Nv.', 'Lv.') + ' ' + B.lv + ')' }); }
  for (const o of M.objs || []) { if (o.nereaGate) out.push({ c: 'portal', x: o.tx, y: o.ty, t: L2('Puerta de Nerea', 'Gate of Nerea') }); else if (o.nereaExit) out.push({ c: 'portal', x: o.tx, y: o.ty, t: L2('Salida al fondo marino', 'Exit to the seabed') }); else if (o.veilAltar) out.push({ c: 'portal', x: o.tx, y: o.ty, t: L2('Altar del Velo', 'Veil Altar') }); }
  if (M.id === 'cielo' && typeof SKY_PORT !== 'undefined') out.push({ c: 'air', x: SKY_PORT[0], y: SKY_PORT[1], t: L2('Puerto de la aeronave', 'Airship port') });
  if (M.port) out.push({ c: 'ship', x: M.port[0], y: M.port[1], t: L2('Puerto del galeón', 'Galleon port') });
  return out;
}
const MAPW_LIST = [
  { id: 'world', n: L2('Tierras del Vínculo', 'Lands of the Bound'), how: '' },
  { id: 'submarino', n: L2('Fondo Marino', 'Seabed'), mk: () => makeSub(), how: L2('Bucea desde una zona de buceo (Isla Brasa) con la instructora.', 'Dive from a diving spot (Isla Brasa) with the instructor.') },
  { id: 'nerea', n: L2('Nerea, la Ciudad Hundida', 'Nerea, the Sunken City'), mk: () => makeNerea(), how: L2('En el fondo marino, entra por la Puerta de Nerea.', 'On the seabed, enter through the Gate of Nerea.') },
  { id: 'archipielago', n: L2('El Archipiélago', 'The Archipelago'), mk: () => makeArchi(), how: L2('Galeón desde Puerto Coral (capitana Marina), nivel 160.', 'Galleon from Puerto Coral (Captain Marina), level 160.') },
  { id: 'cielo', n: L2('Islas del Cielo · Celestia', 'Sky Isles · Celestia'), mk: () => makeSky(), how: L2('Aeronave: habla con la ingeniera de Puerto Coral (nivel 200).', 'Airship: talk to the engineer in Puerto Coral (level 200).') },
  { id: 'espiritual', n: L2('El Velo (Mundo Espiritual)', 'The Veil (Spirit World)'), mk: () => makeSpirit(), how: L2('Altar del Velo al oeste de Albor, o al caer en combate.', 'Veil Altar west of Albor, or when you fall in battle.') },
];
let MAPW = 0, MAPF = null; const MAP_OV = {};
function mapOverview(M) {
  if (MAP_OV[M.id] && MAP_OV[M.id].w === M.w) return MAP_OV[M.id].c;
  const c = mkCanvas(M.w, M.h), x = c.getContext('2d'), id = x.createImageData(M.w, M.h), d = new Uint32Array(id.data.buffer), uw = M.sub || M.id === 'nerea';
  for (let i = 0; i < M.w * M.h; i++) { const t = M.ter[i]; let col;
    if (t === T.DEEP) col = M.sky ? C('#8ac4ec') : uw ? C('#0e2a48') : C('#1e3c6e'); else if (t === T.VOID) col = C('#0c0816'); else if (t === T.DUSK) col = C('#5a4a7a');
    else if (t === T.WATER || t === T.FALL) col = uw ? C('#1a4a6a') : C('#3a7ab8'); else if (t === T.LAVA) col = C('#e84a14'); else if (t === T.SAND) col = C('#d8c088'); else if (t === T.SNOW) col = C('#e6eef8');
    else if (t === T.DIRT || t === T.BRIDGE || t === T.PLANK) col = C('#b08a58'); else if (t === T.COBBLE || t === T.STONE) col = C('#9a948a'); else if (t === T.FACE || t === T.STAIRS) col = C('#5a4c40');
    else if (t === T.CWALL || t === T.PALI || t === T.IWALL) col = C('#6a6470'); else if (t === T.MUD) col = C('#5a4a36'); else if (t === T.ASH) col = C('#4a3e3a'); else if (t === T.FARM) col = C('#7a5a3a');
    else if (t === T.FLOOR || t === T.CARPET) col = C('#a08868'); else col = M.gpalF ? M.gpalF[i * 5 + 2] : C('#5a9a3a');
    if (M.lvl && M.lvl[i] > 0 && t !== T.WATER && t !== T.DEEP) col = uMix(col, C('#ffffff'), 0.08 * M.lvl[i]);
    const o = M.objAt ? M.objAt[i] : -1; if (o >= 0 && M.objs[o]) { const ob = M.objs[o]; if (ob.k === 'tree') col = uMul(col, 0.72); else if (ob.k === 'bld' || ob.k === 'castle') col = C('#b04a3a'); }
    d[i] = col; }
  x.putImageData(id, 0, 0); MAP_OV[M.id] = { c, w: M.w }; return c;
}
function drawPOIs(x, sc, pois, dimFn) {
  const placed = [], ic = ICON.canvas, R = 6;
  for (const q of pois) { if (MAPF && q.c !== MAPF) { q.sx = null; continue; } let px = q.x * sc, py = q.y * sc;
    for (let k = 0; k < 10 && placed.some(([a, b]) => Math.abs(a - px) < 11 && Math.abs(b - py) < 11); k++) { const ang = k * 2.4; px = q.x * sc + Math.cos(ang) * (7 + k * 2); py = q.y * sc + Math.sin(ang) * (7 + k * 2); }
    placed.push([px, py]); q.sx = px; q.sy = py; const D = MAPC[q.c];
    x.globalAlpha = dimFn && dimFn(q) ? 0.8 : 1; x.fillStyle = 'rgba(12,8,16,0.88)'; x.beginPath(); x.arc(px, py, R, 0, 7); x.fill(); x.lineWidth = 1.6; x.strokeStyle = D[2]; x.stroke();
    const i = mapIconIdx(D[3]); if (i !== undefined && ic) x.drawImage(ic, (i % ICON.cols) * 16, Math.floor(i / ICON.cols) * 16, 16, 16, Math.round(px - 5), Math.round(py - 5), 10, 10); else { x.fillStyle = D[2]; x.fillText('•', px, py + 3); } }
  x.globalAlpha = 1;
}
function legendHTML(pois) { const have = [...new Set(pois.map(q => q.c))]; return have.map(c => { const D = MAPC[c], i = mapIconIdx(D[3]); const spec = i !== undefined ? ICON.list[i] : ['bag']; return `<button class="mchip ${MAPF === c ? 'on' : ''}" data-mc="${c}" style="border-color:${D[2]}">${iconHTML(spec, 16)}<span>${esc(mapcN(c))}</span></button>`; }).join(''); }
function mapArrowsHTML() { const Wd = MAPW_LIST[MAPW]; return `<div class="mworld"><button class="marr" id="mwPrev">◀</button><div class="mwt"><b>${esc(Wd.n)}</b><small>${MAPW + 1}/${MAPW_LIST.length} · ${L2('flechas: otros mundos', 'arrows: other worlds')}</small></div><button class="marr" id="mwNext">▶</button></div>`; }
function mapWire(B, pois, sc, cvs, fallback) {
  const go = dv => { MAPW = (MAPW + dv + MAPW_LIST.length) % MAPW_LIST.length; MAPF = null; renderPanel(); };
  const a = $('#mwPrev'), b = $('#mwNext'); if (a) a.onclick = () => go(-1); if (b) b.onclick = () => go(1);
  B.querySelectorAll('[data-mc]').forEach(el => el.onclick = () => { MAPF = MAPF === el.dataset.mc ? null : el.dataset.mc; renderPanel(); });
  if (cvs) cvs.onclick = e => { const r = cvs.getBoundingClientRect(), mx = (e.clientX - r.left) * (cvs.width / r.width), my = (e.clientY - r.top) * (cvs.height / r.height); let best = null, bd = 11 * 11; for (const q of pois) { if (q.sx == null) continue; const dd = (q.sx - mx) ** 2 + (q.sy - my) ** 2; if (dd < bd) { bd = dd; best = q; } } if (best) { toast(best.t, 'info'); return; } if (fallback) fallback(e); };
}
{ const _rm = renderMap; renderMap = function (B) {
  const Wd = MAPW_LIST[MAPW] || MAPW_LIST[0];
  if (Wd.id === 'world') {
    _rm(B); const cvs = $('#wm'); if (!cvs) return; const x = cvs.getContext('2d'), sc = cvs.width / G.world.w, fb = cvs.onclick;
    const pois = worldPOI(), bits = G.P.exploredBits, W = G.world; drawPOIs(x, sc, pois, q => { const i = W.I(Math.round(q.x), Math.round(q.y)); return !(bits[i >> 3] & (1 << (i & 7))); });
    const P = G.P, px = (P.map === 'world' ? P.x : P.retX || P.x) / 16, py = (P.map === 'world' ? P.y : P.retY || P.y) / 16; x.fillStyle = '#ffffff'; x.strokeStyle = '#1a1010'; x.lineWidth = 2; x.beginPath(); x.arc(px * sc, py * sc, 5, 0, 7); x.stroke(); x.fill();
    x.font = `bold ${Math.round(9 + sc * 1.5)}px 'Pixelify Sans', monospace`; x.textAlign = 'center'; for (const t of TOWNS) { const tx = (t.x0 + t.x1) / 2 * sc, ty = ((t.y0 + t.y1) / 2 + 8) * sc; x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.95)'; x.strokeText(t.n, tx, ty); x.fillStyle = '#ffd23a'; x.fillText(t.n, tx, ty); }
    const mm = B.querySelector('.mapmain'); if (mm) mm.insertAdjacentHTML('afterbegin', mapArrowsHTML());
    const rg = B.querySelector('.mapregs'); if (rg) rg.insertAdjacentHTML('afterbegin', `<h3>${L2('Leyenda', 'Legend')}</h3><div class="mchips">${legendHTML(pois)}</div><p class="hint">${L2('Toca un icono del mapa para ver qué es. Toca una categoría para mostrar solo esa.', 'Tap a map icon to see what it is. Tap a category to show only that one.')}</p>`);
    mapWire(B, pois, sc, cvs, fb); return;
  }
  let M = G.maps[Wd.id]; try { if (!M && Wd.mk) M = Wd.mk(); } catch (e) { M = null; }
  B.innerHTML = `<div class="frame mapwrap"><div class="mapmain">${mapArrowsHTML()}<canvas id="wm"></canvas><div class="maplegend"><span><i style="background:#ffffff"></i>${L2('Tú', 'You')}</span>${G.remote.size ? `<span><i style="background:#5ae0ff"></i>${L2('Jugadores', 'Players')}</span>` : ''}</div></div><div class="mapregs"><h3>${esc(Wd.n)}</h3><p class="hint">${L2('Cómo llegar: ', 'How to get there: ')}${esc(Wd.how)}</p><div class="mchips" id="mwChips"></div><div id="mwList"></div></div></div>`;
  const cvs = $('#wm'); if (!M || !cvs) { mapWire(B, [], 1, null); return; }
  const wrap = cvs.parentElement, rw = wrap.clientWidth - 8, rh = Math.max(200, wrap.clientHeight - 70), sc = Math.max(1, Math.min(rw / M.w, rh / M.h));
  cvs.width = Math.floor(M.w * sc); cvs.height = Math.floor(M.h * sc); cvs.style.width = cvs.width + 'px'; cvs.style.height = cvs.height + 'px';
  const x = cvs.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(mapOverview(M), 0, 0, cvs.width, cvs.height); x.font = `bold ${Math.round(9 + sc)}px 'Pixelify Sans', monospace`; x.textAlign = 'center';
  if (M.id === 'cielo' && typeof SKY_ISLES !== 'undefined') for (const I of SKY_ISLES) { x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.9)'; x.strokeText(I.n, I.c[0] * sc, (I.c[1] - I.r * 0.6) * sc); x.fillStyle = '#fff4c0'; x.fillText(I.n, I.c[0] * sc, (I.c[1] - I.r * 0.6) * sc); }
  const pois = otherPOI(M); drawPOIs(x, sc, pois);
  for (const r of G.remote.values()) if (r.map === M.id) { x.fillStyle = '#5ae0ff'; x.beginPath(); x.arc(r.x / 16 * sc, r.y / 16 * sc, 4, 0, 7); x.fill(); }
  const P = G.P; if (P.map === M.id) { x.fillStyle = '#ffffff'; x.strokeStyle = '#1a1010'; x.lineWidth = 2; x.beginPath(); x.arc(P.x / 16 * sc, P.y / 16 * sc, 5, 0, 7); x.stroke(); x.fill(); }
  $('#mwChips').innerHTML = legendHTML(pois);
  $('#mwList').innerHTML = pois.filter(q => !MAPF || q.c === MAPF).map(q => `<div class="mreg">${iconHTML(ICON.list[mapIconIdx(MAPC[q.c][3])] || ['bag'], 16)} <b>${esc(q.t)}</b></div>`).join('') || `<p class="hint">${L2('Nada que marcar aquí.', 'Nothing to mark here.')}</p>`;
  mapWire(B, pois, sc, cvs);
}; }
// abrir el mapa en el mundo donde está el jugador
{ const _op = openPanel; openPanel = function (tab) { if (tab === 'map' && G.P) { const k = MAPW_LIST.findIndex(w => w.id === G.P.map); MAPW = k >= 0 ? k : 0; MAPF = null; } return _op.apply(this, arguments); }; }
{ const st = document.createElement('style'); st.textContent = `.mworld{display:flex;align-items:center;gap:6px;margin-bottom:4px}.mworld .mwt{flex:1;text-align:center;display:flex;flex-direction:column;line-height:1.1}.mworld .mwt small{opacity:.7;font-size:11px}
.marr{min-width:40px;height:34px;border-radius:8px;border:2px solid #c8a060;background:#2a1e14;color:#ffe8a0;font-size:16px;font-family:inherit}.marr:active{transform:scale(.94)}
.mchips{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.mchip{display:flex;align-items:center;gap:4px;padding:2px 6px 2px 3px;border-radius:12px;border:1.5px solid #6a5a4a;background:rgba(20,14,10,.75);color:#f0e4c8;font:inherit;font-size:11px}.mchip.on{background:#5a4020;color:#fff}`; document.head.appendChild(st); }
