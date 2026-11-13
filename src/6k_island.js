// ================= ISLA BRASA (lv 150-160): the biggest town, a volcano, a yacht, diving job, new fish =================
WALLP.brasa = pal(['#3a2622', '#5a3a30', '#7a5244', '#9a6c5a', '#c08c74']); ROOFP.lava = pal(['#1a0806', '#3a0e0a', '#6a1a10', '#a02a14', '#d8461e', '#ff8a3a']);
// ---------- creatures ----------
BATPAL.ceniza = [['#1a1414', '#3a2e2a', '#5a4a44', '#8a7a70'], '#ff7a1a'];
GHOSTPAL.brasa = ['#5a1a0a', '#b8400e', '#ff8a2a', '#ffe0a0'];
SLIMEC.brasa = ['#3a0a06', '#8a1a0a', '#e04a10', '#ffb060'];
SCORPPAL.brasa = ['#1a0604', '#4a0e08', '#8a1e0e', '#d8461e', '#ffb070'];
HLOOKS.golemobs = Object.assign({}, HLOOKS.golem, { skin: pal(['#06040a', '#140e1a', '#22182a', '#5a2a6a', '#ff7a2a']), cloth: pal(['#06040a', '#140e1a', '#22182a', '#3a2a44', '#ff5a1a']), eyes: 'brillo' });
HLOOKS.pirata = Object.assign({}, HLOOKS.bandido, { hat: 'bandana', hatC: pal(['#3a0a0a', '#7a1414', '#b02020', '#e04040', '#ff8080']), weapon: { k: 'sword', tier: 9 }, main: pal(['#1a1a2a', '#2a2a44', '#3a3a5e', '#4e4e7a', '#6a6a9a']) });
HLOOKS.titan = Object.assign({}, HLOOKS.golemlava, { body: 'huge', hat: 'horned', hatC: TIERP[12].concat([C('#fff0a0')]), weapon: { k: 'bigaxe', tier: 12 }, armor: TIERP[12] });
Object.assign(MOBS, {
  salamandra_v: { n: 'Salamandra Volcánica', art: ['snake', 'fuego'], reg: ['volcan'], lv: [150, 158], hp: 1.2, atk: 1.7, def: 1.2, spd: 66, ai: 'charge', fam: 'serpiente', burn: 1, drops: [['brasa', 0.4], ['rubi', 0.04]] },
  murci_ceniza: { n: 'Murciélago de Ceniza', art: ['bat', 'ceniza'], reg: ['volcan'], lv: [150, 156], hp: 1, atk: 1.7, def: 1, spd: 84, ai: 'aggro', fam: 'murcielago', fly: 1, drops: [['ala', 0.4]] },
  slime_brasa: { n: 'Slime de Brasa', art: ['slime', 'brasa'], reg: ['volcan'], lv: [150, 155], hp: 1.2, atk: 1.6, def: 1.3, spd: 42, ai: 'aggro', fam: 'slime', burn: 1, drops: [['gel', 0.3], ['brasa', 0.3]] },
  espiritu_brasa: { n: 'Espíritu de Brasa', art: ['ghost', 'brasa'], reg: ['volcan'], lv: [152, 160], hp: 1.2, atk: 1.9, def: 1.2, spd: 54, ai: 'ranged', fam: 'fantasma', burn: 1, drops: [['brasa', 0.3], ['polvoestelar', 0.2]] },
  golem_obs: { n: 'Gólem de Obsidiana', art: ['hum', 'golemobs'], reg: ['volcan'], lv: [155, 162], hp: 2.4, atk: 1.9, def: 2.2, spd: 36, ai: 'aggro', fam: 'golem', drops: [['ore11', 0.25], ['opalo', 0.03]] },
  escorp_brasa: { n: 'Escorpión de Brasa', art: ['scorp', 'brasa'], reg: ['volcan'], lv: [154, 162], hp: 1.5, atk: 1.9, def: 1.8, spd: 46, ai: 'aggro', fam: 'escorpion', burn: 1, drops: [['aguijon', 0.3], ['brasa', 0.2]] },
  pirata: { n: 'Pirata del Volcán', art: ['hum', 'pirata'], reg: ['volcan'], lv: [150, 160], hp: 1.4, atk: 1.8, def: 1.5, spd: 58, ai: 'aggro', fam: 'bandido', group: 3, drops: [['tela', 0.3], ['perla', 0.12], ['moneda_antigua', 0.15]] },
});
it('acc_volcanus', { n: 'Corazón del Volcán', t: 'acc', slot: 'neck', lv: 158, price: 60000, icon: ['amulet', 5], rar: 5, atk: 780, def: 480, hpB: 10000, crit: 12 });
BOSSES.volcanus = { n: 'Volcanus, Titán de Fuego', lv: 160, art: ['hum', 'titan'], hp: 28, atk: 2.4, def: 2.2, spd: 46, moves: ['slam', 'rain', 'breath', 'nova', 'charge', 'summon'], minion: 'slime_brasa', acc: 'acc_volcanus', drops: [['piedra3', 1, 3], ['opalo', 1, 2], ['perla_negra', 0.5, 1]], r: 32 };
BOSS_COS.volcanus = ['c_corona_volcan'];
// ---------- items, fish, job ----------
it('perla', { n: 'Perla', t: 'mat', stack: true, price: 900, icon: ['pearl', '#f4ecf8'], rar: 2 });
it('perla_negra', { n: 'Perla Negra', t: 'mat', stack: true, price: 6000, icon: ['pearl', '#3a2a4a'], rar: 4 });
it('coral', { n: 'Coral Rojo', t: 'mat', stack: true, price: 400, icon: ['coral', '#ff5a5a'], rar: 1 });
it('concha', { n: 'Concha Iridiscente', t: 'mat', stack: true, price: 250, icon: ['shell', 4], rar: 1 });
it('cana7', { n: 'Caña Ignífuga', t: 'tool', tool: 'pesca', power: 7, lv: 150, price: 45000, icon: ['rod', 12], rar: 4 });
it('collar_perlas', { n: 'Collar de Perlas del Mar', t: 'acc', slot: 'neck', lv: 152, price: 50000, icon: ['amulet', 4], rar: 4, hpB: 8500, def: 380, mpB: 900, atk: 420 });
RECIPES.push({ id: 'r_collar_perlas', job: 'joyeria', out: 'collar_perlas', n: 1, lv: 150, jlv: 60, gold: 30000, mats: [['perla', 6], ['perla_negra', 1], ['coral', 4]], cat: 'accesorio' });
const FISH3 = [['pezpayaso', 'Pez Payaso', 2, ['mar', 'volcan'], '#ff8a2a', 'fishr'], ['betta', 'Pez Betta', 3, ['lago'], '#c03a8a', 'fishf'], ['esturion', 'Esturión', 5, ['rio'], '#7a7a6a', 'fishl'],
  ['pezloro', 'Pez Loro', 8, ['volcan'], '#3ac8a0', 'fishr'], ['barracuda', 'Barracuda', 9, ['volcan'], '#8a9ab8', 'fishl'], ['mantarraya', 'Mantarraya', 9, ['volcan'], '#5a6a8a', 'fishm'], ['pezvela', 'Pez Vela', 10, ['volcan'], '#2a5ab0', 'fishs'], ['calamar', 'Calamar Gigante', 10, ['volcan'], '#d86a8a', 'squid'],
  ['pezbrasa', 'Pez Brasa', 9, ['lava'], '#ff5a1a', 'fishf'], ['anguilamagma', 'Anguila de Magma', 10, ['lava'], '#ff8a2a', 'fishl'], ['pezobsidiana', 'Pez Obsidiana', 11, ['lava'], '#5a2a6a', 'fishr'], ['dragonlava', 'Dragón de Lava', 11, ['lava', 'volcan'], '#ff3a1a', 'fishs']];
for (const [id, n, t, hab, col, shape] of FISH3) { FISH.push([id, n, t, hab, col]); it(id, { n, t: 'mat', fish: true, stack: true, tier: t, hab, price: 6 * t * t + 4 + (t >= 9 ? 300 : 0), icon: [shape, col], rar: t >= 10 ? 4 : t >= 8 ? 3 : t >= 5 ? 2 : 1 }); }
JOBS.buceo = { n: 'Buceo', icon: 'shell', desc: 'Bucea en los puntos de burbujas del mar: perlas, corales y tesoros hundidos. Isla Brasa tiene los mejores.' };
JOB_PERKS.buceo = [[15, 'Pulmones fuertes: buceas un 20% más rápido'], [35, 'Ojo de perla: +5% de probabilidad de Perla Negra']];
// ---------- town layout (called from buildWorld) ----------
const BRASA = { pier: [140, 196], dock: [140, 194], spring: [161, 213] };
function placeBrasa(W) {
  const L = (k, tx, ty, p) => addObj(W, k, tx, ty, p || {}), T0 = TOWNS.find(t => t.k === 'brasa');
  rectTer(W, T0.x0, T0.y0, T0.x1, T0.y1, T.GRASS); for (let y = T0.y0; y <= T0.y1; y++) for (let x = T0.x0; x <= T0.x1; x++) if (hash2(x, y, 41) < 0.25) setTer(W, x, y, T.SAND);
  rectTer(W, 146, T0.y0 - 6, 147, T0.y1 + 2, T.COBBLE, 1); rectTer(W, T0.x0, 207, T0.x1, 207, T.COBBLE, 1); rectTer(W, T0.x0, 218, T0.x1, 218, T.COBBLE, 1); circTer(W, 146.5, 213.5, 5.2, T.COBBLE);
  // pier to the north shore
  let py = T0.y0 - 1; for (; py > 180; py--) { const i = W.I(140, py); if (WATERY[W.ter[i]]) break; for (const x of [139, 140, 141]) { const j = W.I(x, py); W.ter[j] = T.COBBLE; W.flags[j] |= 1 | 4; W.lvl[j] = 0; } }
  for (let y = py; y > py - 6; y--) for (let x = 139; x <= 141; x++) { const j = W.I(x, y); W.ter[j] = T.PLANK; W.flags[j] |= 1 | 4; W.lvl[j] = 0; W.reg[j] = RI.volcan; }
  BRASA.pier = [140, py - 4]; BRASA.dock = [143, py - 4];
  const B = (x, y, w, h, spec, id) => addBuilding(W, x, y, w, h, Object.assign({ style: 'brasa', roof: 'lava' }, spec), id);
  B(122, 201, 7, 5, { sign: 'store', awning: '#e05a1a' }, 'tienda_brasa'); B(131, 201, 7, 5, { style: 'smith', roof: 'lava', sign: 'smith', chimney: true }, 'herreria_brasa');
  B(150, 201, 10, 5, { sign: 'inn', chimney: true, big: true, roof: 'thatch' }, 'posada_brasa'); B(162, 201, 7, 5, { sign: 'alchemy', box: true }, 'alquimia_brasa');
  B(122, 209, 5, 4, { box: true, v: 11 }, 'casa_b1'); B(129, 209, 5, 4, { roof: 'thatch', v: 12 }, 'casa_b2'); B(166, 209, 5, 4, { gable: true, v: 13 }, 'casa_b3'); B(154, 208, 6, 4, { sign: 'store', awning: '#1a8ab0', roof: 'thatch' }, 'tienda_brasa2');
  B(122, 220, 8, 5, { roof: 'slate', big: true }, 'gremio_brasa'); B(133, 220, 5, 4, { v: 14 }, 'casa_b4'); B(154, 220, 5, 4, { roof: 'thatch', v: 15 }, 'casa_b5'); B(160, 220, 5, 4, { gable: true, v: 16 }, 'casa_b6'); B(166, 220, 5, 4, { box: true, v: 17 }, 'casa_b7');
  L('fountain', 146, 213, { px: 146 * 16 + 16, py: 214 * 16 + 4, fp: [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1]] });
  // hot spring
  const [sx, sy] = BRASA.spring; rectTer(W, sx - 1, sy - 1, sx + 6, sy + 4, T.COBBLE); rectTer(W, sx, sy, sx + 5, sy + 3, T.WATER); for (let y = sy; y <= sy + 3; y++) for (let x = sx; x <= sx + 5; x++) W.flags[W.I(x, y)] &= ~1;
  L('spring', sx + 2, sy + 4, { solid: false });
  [[143, 210], [150, 210], [143, 217], [150, 217], [121, 207], [171, 207], [121, 218], [171, 218], [139, 199], [141, 199]].forEach(([x, y]) => L('lantern', x, y, { kind: 'wood' }));
  [[120, 214], [172, 214], [137, 212], [156, 216], [121, 226], [171, 226], [135, 226], [158, 226]].forEach(([x, y]) => L('tree', x, y, { sp: 'palma', deco: true }));
  L('bench', 143, 216); L('bench', 150, 216); L('stall', 137, 215, { col: '#e05a1a', fp: [[0, 0], [1, 0]] }); L('stall', 141, 220, { col: '#1a8ab0', fp: [[0, 0], [1, 0]] }); L('nets', 136, 199); L('barrel', 138, 199); L('crate', 142, 199);
  W.npcDefs.push({ id: 'capitana', x: 140, y: BRASA.pier[1] + 2 }, { id: 'keoni', x: 143, y: 199, face: 'down' }, { id: 'moana', x: 137, y: 199, wander: 2 }, { id: 'volcanologo', x: 171, y: 212, face: 'left' }, { id: 'banista', x: sx - 2, y: sy + 2, face: 'right' });
  // volcano east of town
  const vx = VOLC.mx, vy = VOLC.my; const fp = []; for (let dy = -4; dy <= 0; dy++) for (let dx = -7; dx <= 7; dx++) if ((dx / 7.5) ** 2 + ((dy + 2) / 3) ** 2 <= 1) fp.push([dx, dy]);
  for (let y = vy - 9; y <= vy + 5; y++) for (let x = vx - 12; x <= vx + 12; x++) if (W.inb(x, y) && dist(x, y, vx, vy) < 12) { const i = W.I(x, y); if (!WATERY[W.ter[i]]) { W.ter[i] = T.ASH; W.lvl[i] = 0; W.flags[i] |= 16; } }
  L('volcano', vx, vy, { fp });
  for (const [x, y, r] of [[vx - 9, vy + 3, 1.3], [vx + 8, vy + 4, 1.6], [vx + 3, vy + 8, 1.2]]) circTer(W, x, y, r, T.LAVA);
  for (let y = vy + 6; y <= vy + 14; y++) for (let x = vx - 6; x <= vx + 6; x++) if (W.inb(x, y)) { const i = W.I(x, y); if (!WATERY[W.ter[i]]) { if (W.ter[i] === T.LAVA) W.ter[i] = T.ASH; W.flags[i] |= 16; } }
  W.bosses.push({ id: 'volcanus', x: vx, y: vy + 10 });
}
// ---------- sprites ----------
EXTRA_SPR.volcano = () => { const f = Math.floor(G.t * 3) % 3; return spr('volc' + f, () => { const W = 260, H = 170, p = new Pix(W, H), R = new RNG(77), cx = W / 2;
  const rock = pal(['#120c0c', '#241818', '#3a2826', '#54403a', '#6e5a50']), ash = pal(['#2a2424', '#3e3434', '#544848', '#6e6060']);
  for (let y = 30; y < H; y++) { const t = (y - 30) / (H - 30), half = 22 + t * 108 + Math.sin(y * 0.3) * 2; for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) { const sx = (x - cx) / half; let v = sx < -0.3 ? 3 : sx > 0.4 ? 1 : 2; if (((x * 7 + y * 3) % 11) === 0) v = Math.max(0, v - 1); if (y > H - 14) v = Math.max(0, v - 1); p.set(x, y, rock[v]); } }
  for (let k = 0; k < 9; k++) { const x0 = cx - 18 + k * 4.5, wob = R.f() * 6; for (let y = 34; y < H - 10 - R.int(0, 60); y++) { const x = x0 + (x0 - cx) * (y - 34) / 60 + Math.sin(y * 0.15 + k + f) * 1.5 + wob; const c = ((y + f * 3) % 7 < 2) ? C('#ffe080') : y % 3 ? C('#ff6a1a') : C('#e0300e'); p.set(Math.round(x), y, c); if (k % 3 === 0) p.set(Math.round(x) + 1, y, C('#c0280c')); } }
  p.ell(cx, 32, 24, 7, C('#3a0c08')); p.ell(cx, 31, 20, 5, C('#ff5a1a')); p.ell(cx, 30, 14, 3, C('#ffd060')); p.ell(cx, 29, 7, 1.4, C('#fff0b0'));
  for (let k = 0; k < 40; k++) { const x = R.int(10, W - 10), y = R.int(80, H - 6); if (Math.abs(x - cx) < (y - 30) * 0.8) p.set(x, y, ash[R.int(0, 3)]); }
  return { c: p.canvas(), ax: W / 2, ay: H - 6 }; }); };
OBJSH.volcano = [110, 14];
EXTRA_SPR.spring = () => spr('spring', () => { const p = new Pix(16, 12); p.rect(2, 4, 12, 7, WOOD[2]); p.hl(2, 4, 12, WOOD[4]); p.rect(7, 0, 2, 4, WOOD[1]); p.rect(4, 6, 8, 3, C('#e8e0c8')); p.set(5, 7, C('#a01818')); p.set(10, 7, C('#1a5a9a')); return { c: p.canvas(), ax: 8, ay: 11 }; });
EXTRA_SPR.dive = o => { const f = Math.floor(G.t * 3 + o.tx) % 3; return spr('dive' + f, () => { const p = new Pix(18, 12); for (let k = 0; k < 3; k++) { const a = k * 2.1 + f * 0.7; p.ell(9 + Math.cos(a) * 4, 6 + Math.sin(a) * 2, 1.6, 1.4, C('#e0f8ff')); } p.ell(9, 7, 7, 3, C('#7ad0ff')); p.ell(9, 7, 5.5, 2, C('#2a7ab8')); p.set(9 + f - 1, 4, C('#ffffff')); return { c: p.canvas(), ax: 9, ay: 9 }; }); };
EXTRA_SPR.yacht = () => spr('yacht', () => { const W = 200, H = 96, p = new Pix(W, H), wh = pal(['#8a96a8', '#b8c4d4', '#dfe7f0', '#f6f9fc', '#ffffff']), bl = pal(['#0a1a3a', '#12305e', '#1e4a8a', '#2e6ab8', '#5a9ae0']);
  p.poly([[6, 62], [190, 58], [198, 64], [182, 86], [22, 86]], wh[2]); for (let x = 10; x < 190; x++) { p.set(x, 66 - Math.round(x * 0.02), bl[2]); p.set(x, 67 - Math.round(x * 0.02), bl[3]); } p.hl(24, 85, 156, wh[0]); for (let k = 0; k < 12; k++) p.ell(36 + k * 12, 75, 2, 1.6, bl[1]);
  p.rect(20, 46, 150, 14, wh[3]); p.hl(20, 46, 150, wh[4]); for (let k = 0; k < 10; k++) p.rect(28 + k * 14, 50, 9, 5, C('#1a3a5a')); for (let x = 20; x < 170; x += 4) p.vl(x, 40, 6, wh[1]); p.hl(20, 40, 150, wh[1]);
  p.rect(60, 26, 80, 14, wh[3]); p.hl(60, 26, 80, wh[4]); for (let k = 0; k < 5; k++) p.rect(66 + k * 15, 30, 10, 6, C('#2a5a8a')); p.rect(92, 10, 26, 16, wh[2]); p.rect(96, 14, 18, 5, C('#1a3a5a')); p.vl(104, 0, 10, wh[0]); p.rect(105, 1, 10, 6, C('#e03a3a')); p.hl(105, 3, 10, C('#ffffff'));
  p.ell(30, 90, 26, 3, C('#d8f0ff')); p.ell(170, 90, 30, 3, C('#d8f0ff')); return { c: p.canvas(), ax: 100, ay: 88 }; });
// icons for the new fish shapes & job items
{ const _gi = genIcon; genIcon = function (spec) { const [kind, a] = spec; const sh = ['fishr', 'fishl', 'fishf', 'fishs', 'fishm', 'squid', 'pearl', 'coral', 'shell'];
  if (!sh.includes(kind)) return _gi(spec); const p = new Pix(16, 16), c = typeof a === 'string' ? C(a) : C('#e8d0c0'), d = uMul(c, 0.6), l = uMix(c, C('#ffffff'), 0.45), eye = () => { p.set(4, 7, C('#101010')); p.set(3, 7, C('#ffffff')); };
  if (kind === 'fishr') { p.ball(7.5, 8, 5.5, 5, [d, c, c, l]); p.poly([[12, 8], [15, 4], [15, 12]], d); p.vl(8, 4, 8, l); eye(); }
  else if (kind === 'fishl') { p.ell(8, 8, 7, 2.2, c); p.hl(2, 7, 12, l); p.poly([[14, 8], [16, 5], [16, 11]], d); p.hl(4, 10, 8, d); eye(); }
  else if (kind === 'fishf') { p.ell(7, 8, 4.5, 3, c); p.poly([[10, 8], [16, 2], [16, 14]], l); p.poly([[5, 5], [9, 1], [10, 5]], d); p.poly([[5, 11], [9, 15], [10, 11]], d); eye(); }
  else if (kind === 'fishs') { p.ell(8, 9, 5.5, 2.6, c); p.line(0, 8, 3, 8, l); p.poly([[6, 6], [9, 1], [11, 7]], d); p.poly([[13, 9], [16, 5], [16, 13]], d); p.hl(4, 10, 8, l); p.set(5, 8, C('#101010')); }
  else if (kind === 'fishm') { p.poly([[8, 3], [15, 9], [8, 12], [1, 9]], c); p.poly([[8, 4], [12, 8], [8, 10], [4, 8]], l); p.line(8, 12, 9, 16, d); p.set(7, 6, C('#101010')); p.set(9, 6, C('#101010')); }
  else if (kind === 'squid') { p.ball(8, 5, 3.5, 4.5, [d, c, c, l]); for (let k = 0; k < 5; k++) p.line(5 + k * 1.5, 9, 4 + k * 2, 15, k % 2 ? d : c); p.set(7, 6, C('#101010')); p.set(9, 6, C('#101010')); }
  else if (kind === 'pearl') { p.ball(8, 9, 4.5, 4.5, [d, c, c, l]); p.set(6, 7, C('#ffffff')); p.set(7, 7, C('#ffffff')); p.poly([[2, 12], [8, 15], [14, 12], [8, 14]], C('#d8b8a8')); }
  else if (kind === 'coral') { for (const [x0, h] of [[5, 9], [8, 12], [11, 8]]) { p.vl(x0, 15 - h, h, c); p.set(x0 - 1, 15 - h + 2, c); p.set(x0 + 1, 15 - h + 4, l); p.set(x0, 15 - h, l); } p.hl(3, 15, 10, d); }
  else { const tp = tierPal(typeof a === 'number' ? a : 4); p.poly([[2, 12], [8, 2], [14, 12]], tp[3]); for (let k = 0; k < 5; k++) p.line(8, 3, 3 + k * 2.5, 12, tp[1]); p.hl(3, 12, 11, tp[4]); p.set(8, 2, C('#ffffff')); }
  return p; }; }
UI_ICONS.push('shell:2', 'pearl:#f4ecf8');
// ---------- NPCs ----------
const LKB = o => LK(Object.assign({ skin: SKINS[2], eyes: 'cafe' }, o));
Object.assign(NPCS, {
  kai: { n: 'Kai', title: 'Tendero de Puerto Brasa', look: LKB({ hair: HAIRS.negro, outfit: 'apron', main: CLOTH.naranja }), shop: 'store', lines: ['¡Aloha! Todo lo que necesitas para sobrevivir al volcán.'] },
  tama: { n: 'Tama', title: 'Herrera Volcánica', look: LKB({ hair: HAIRS.rojo, hairStyle: 'long', outfit: 'smith' }), shop: 'smith', lines: ['Aquí el fuego del volcán templa el mejor acero del mundo.'] },
  lani: { n: 'Lani', title: 'Posadera', look: LKB({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'apron', main: CLOTH.turquesa }), shop: 'inn', lines: ['Las mejores vistas al volcán… desde una hamaca.'] },
  pele: { n: 'Pele', title: 'Alquimista del Fuego', look: LKB({ hair: HAIRS.negro, hairStyle: 'long', outfit: 'robe', main: CLOTH.granate }), shop: 'alchemy', lines: ['La ceniza volcánica hace milagros en las pociones.'] },
  nalu: { n: 'Nalu', title: 'Tienda de Buceo', look: LKB({ hair: HAIRS.rubio, outfit: 'sailor' }), shop: 'store', lines: ['¿Has buceado entre los corales de la isla? ¡Es otro mundo!'] },
  capitana: { n: 'Capitana Iolani', title: 'Capitana del Yate', look: LKB({ hair: HAIRS.blanco, hairStyle: 'long', outfit: 'sailor', hat: 'bandana', hatC: CLOTH.azul }), lines: ['Mi yate, el «Estrella del Sur», es el barco más grande del mar.', 'Todos los días llevo pasajeros entre Puerto Coral y la isla.'] },
  keoni: { n: 'Keoni', title: 'Maestro Pescador', look: LKB({ hair: HAIRS.negro, outfit: 'sailor', hat: 'straw' }), lines: ['El Torneo de Pesca de la isla es leyenda. ¿Te atreves?', 'Los mejores peces nadan en la lava… si tienes la caña adecuada.'] },
  moana: { n: 'Moana', title: 'Buceadora', look: LKB({ hair: HAIRS.negro, hairStyle: 'long', outfit: 'dress', main: CLOTH.azul }), lines: ['Busca las burbujas en el agua: ahí hay perlas y tesoros.', 'Bajo el mar hay barcos hundidos llenos de oro.'] },
  volcanologo: { n: 'Dr. Ígneo', title: 'Vulcanólogo', look: LK({ hair: HAIRS.gris, beard: HAIRS.gris, outfit: 'robe', main: CLOTH.beige }), lines: ['El volcán despierta cada pocos minutos. ¡Cuidado con las rocas de lava!', 'Dicen que un titán de fuego duerme junto al cráter.'] },
  banista: { n: 'Leilani', title: 'Aguas Termales', look: LKB({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'apron', main: CLOTH.blanco }), lines: ['Un baño en las termas cura cualquier herida.'] },
  turista1: { n: 'Turista', title: 'Pasajera del yate', look: LK({ hair: HAIRS.rubio, hairStyle: 'long', outfit: 'dress', main: CLOTH.rosa }), lines: ['¡Qué crucero tan maravilloso!'] },
  turista2: { n: 'Turista', title: 'Pasajero del yate', look: LK({ hair: HAIRS.castano, outfit: 'tunic', main: CLOTH.blanco, hat: 'straw' }), lines: ['Desde la cubierta se ve el volcán echando humo.'] },
  turista3: { n: 'Turista', title: 'Pasajera del yate', look: LK({ hair: HAIRS.negro, hairStyle: 'long', outfit: 'dress', main: CLOTH.amarillo, skin: SKINS[2] }), lines: ['¡Mira, delfines!'] },
  turista4: { n: 'Marinero', title: 'Tripulación', look: LK({ hair: HAIRS.negro, outfit: 'sailor' }), lines: ['¡Todo en orden en cubierta!'] },
});
Object.assign(INT_NPC, { tienda_brasa: 'kai', herreria_brasa: 'tama', posada_brasa: 'lani', alquimia_brasa: 'pele', tienda_brasa2: 'nalu' });
SHOPS.store.brasa = ['pocion5', 'eter5', 'antidoto', 'retorno', 'cana7', 'pala5', 'hacha6', 'pico6', 'food7'].filter(i => ITEMS[i]); SHOPS.alchemy.brasa = ['pocion5', 'eter5', 'antidoto', 'elixir'].filter(i => ITEMS[i]); SHOPS.inn.brasa = ['food6', 'food7'].filter(i => ITEMS[i]); SHOPS.smith.brasa = 15;
{ const _toi = townOfInterior; townOfInterior = function (id) { if (id.includes('brasa') || id.startsWith('casa_b')) return 'brasa'; return _toi(id); }; }
TF_PAL.brasa = [CLOTH.turquesa, CLOTH.naranja, CLOTH.amarillo, CLOTH.blanco]; TF_SKIN.brasa = [2, 3];
TOWNFOLK.brasa = [['makoa', 'Makoa', 'Surfista', 0, 0, { hair: HAIRS.rubio }, ['¡Las olas de la isla son las mejores del mundo!']], ['hina', 'Hina', 'Bailarina', 1, 0, { hair: HAIRS.negro, outfit: 'dress' }, ['Esta noche hay baile junto al fuego.']], ['ikaika', 'Ikaika', 'Pescador', 0, 0, { hair: HAIRS.negro, beard: HAIRS.negro, hat: 'straw' }, ['El pez vela es tan rápido como un rayo.']], ['malia', 'Malia', 'Vendedora de cocos', 1, 0, { hair: HAIRS.castano }, ['¿Un coco fresco?']], ['nohea', 'Nohea', 'Niña', 1, 1, { hair: HAIRS.negro }, ['¡Vi un delfín saltar!']], ['koa', 'Koa', 'Niño', 0, 1, { hair: HAIRS.negro }, ['¡Algún día bajaré al cráter!']], ['akamu', 'Abuelo Akamu', 'Anciano', 0, 0, { hair: HAIRS.blanco, beard: HAIRS.blanco }, ['Cuando yo era joven, el volcán dormía.']]];
TOWNFOLK.brasa.forEach(([k, n, title, f, kid, ex, lines], i) => { const id = 'tf_' + k, pl = TF_PAL.brasa; NPCS[id] = { n, title, town: 'brasa', tf: 1, look: LK(Object.assign({ skin: SKINS[TF_SKIN.brasa[i % 2]], hairStyle: f ? 'long' : 'short', eyes: 'cafe', outfit: f ? 'dress' : 'tunic', main: pl[i % pl.length], sec: pl[(i + 1) % pl.length], body: kid ? 'small' : undefined }, ex)), lines }; TF_IDS.push(id); });
FESTS.brasa = { n: 'Fiesta del Fuego', day: 4, deco: 'bonfire', d: 'Puerto Brasa baila alrededor de las hogueras en honor al volcán.' };
// ---------- dialog options: yacht, fishing tournament, hot spring, lava rod ----------
DLG_HOOKS.push((npc, opts) => {
  const P = G.P;
  if (npc.id === 'marina') opts.push({ label: 'Viajar en el yate a Isla Brasa (300 oro)', icon: ['ways'], fn: () => { if (P.lv < 140) { typeText('La Isla Brasa es demasiado peligrosa. Vuelve cuando seas nivel 140.'); return; } if (P.gold < 300) { typeText('El pasaje cuesta 300 oro.'); return; } P.gold -= 300; closeDialog(); shipTo('brasa'); } });
  if (npc.id === 'capitana') opts.push({ label: 'Volver a Puerto Coral en el yate', icon: ['ways'], fn: () => { closeDialog(); shipTo('puerto'); } });
  if (npc.id === 'keoni') opts.push({ label: 'Torneo de Pesca', icon: ['rod', 12], fn: () => fishTourney() });
  if (npc.id === 'banista') opts.push({ label: 'Bañarse en las termas', icon: ['heart', '#ff5a8a'], fn: () => { closeDialog(); hotSpring(); } });
  if (npc.id === 'volcanologo') opts.push({ label: 'Comprar Caña Ignífuga (pesca en lava)', icon: ['rod', 12], fn: () => { if (countItem('cana7')) { typeText('Ya tienes una. ¡Pesca con cuidado en la lava!'); return; } if (P.gold < 45000) { typeText('Cuesta 45.000 oro. El material ignífugo es carísimo.'); return; } P.gold -= 45000; giveItem('cana7', 1); typeText('Con esta caña puedes pescar en los lagos de lava. ¡No toques el fuego!'); } });
});
function fishTourney() {
  const P = G.P, need = FISH3.filter(f => f[3].includes('volcan') || f[3].includes('lava')).map(f => f[0]), have = need.filter(id => countItem(id) > 0), day = calDay();
  if ((P.tourney || -1) === day) { typeText('Ya participaste hoy. ¡Vuelve mañana!'); return; }
  if (have.length < 4) { typeText('Tráeme 4 peces distintos de la isla (del mar o de la lava). Tienes ' + have.length + '/4.'); return; }
  for (const id of have.slice(0, 4)) takeItem(id, 1); P.tourney = day; P.gold += 20000; giveItem('perla_negra', 1); passEvent('fish', 1); typeText('¡Increíble pesca! Ganas el torneo: 20.000 oro y una Perla Negra.'); sfx('quest');
}
function hotSpring() { const P = G.P, d = calDay(); P.hp = P.S.maxhp; P.mp = P.S.maxmp; if (P.springDay !== d) { P.springDay = d; addBuff(P, 'termas', { defP: 10, atkP: 5 }, 600); toast('¡Relajado! +10% defensa y +5% ataque durante 10 min', 'quest'); } else toast('Vida y maná restaurados', 'info'); burst(P.x, P.y - 10, 20, { sp: 20, up: 40, g: -20, life: 1.2, c: ['#ffffff', '#d8f0ff'] }); sfx('potion'); }
// ---------- yacht & tourists ----------
let YACHT = null;
function spawnYacht() { if (YACHT && G.ents.includes(YACHT)) return; const [dx, dy] = BRASA.dock; const baseY = (dy - 1) * 16 + 30; YACHT = { type: 'deco', k2: 'yacht', map: 'world', x: (dx + 6) * 16, y: baseY - 70, dyOff: 70, noShadow: true }; G.ents.push(YACHT);
  const deck = [[-62, -46], [-24, -46], [22, -46], [6, -64]]; ['turista1', 'turista2', 'turista3', 'turista4'].forEach((id, i) => { const e = spawnNPC(id, YACHT.x + deck[i][0], baseY + deck[i][1], 'world', { face: i % 2 ? 'left' : 'down', L: -1 }); if (e) { e.scene = 1; e.yacht = 1; } }); }
// ---------- shipping ----------
{ const _st = shipTo; shipTo = function (dest) { const P = G.P; if (dest !== 'brasa') return _st(dest); transition(() => { const [x, y] = BRASA.pier; setMap(G.world, x * 16 + 8, (y + 2) * 16 + 8, 'down'); P.ws.brasa = 1; toast('Has llegado a Isla Brasa en el yate «Estrella del Sur»', 'info'); markDirty(true); }); }; }
// ---------- volcano activity: smoke & lava bombs ----------
let volcT = 20;
function islandTick(dt) {
  const P = G.P, M = G.map; if (!M || !M.isWorld || !P || P.ghost) return; spawnYacht();
  const vx = VOLC.mx * 16 + 8, vy = VOLC.my * 16 - 140, d = dist(P.x, P.y, vx, vy + 140); if (d > 900) return;
  if (Math.random() < dt * 6) part(vx + (Math.random() - 0.5) * 30, vy, { vx: (Math.random() - 0.3) * 8, vy: -4, vz: 14 + Math.random() * 10, g: -2, life: 4, c: Math.random() < 0.5 ? '#5a5050' : '#3a3434', s: 3 });
  const sp = M.objs.find(o => o.k === 'spring'); if (sp && Math.random() < dt * 5 && dist(P.x, P.y, sp.px, sp.py) < 500) part(sp.px - 8 + Math.random() * 90, sp.py - 50 + Math.random() * 50, { vz: 12, g: -6, life: 1.6, c: '#ffffff', s: 2 });
  volcT -= dt; if (volcT <= 0) { volcT = 45 + Math.random() * 30; if (d < 520) { banner('¡El volcán entra en erupción!', 'Esquiva las rocas de lava'); G.shake = 6; sfx('boom'); for (let k = 0; k < 10; k++) setTimeout(() => { if (!G.P || G.P.map !== 'world') return; const tx = G.P.x + (Math.random() - 0.5) * 160, ty = G.P.y + (Math.random() - 0.5) * 110; telegraph({ shape: 'circle', x: tx, y: ty, r: 22, dur: 1.1, col: 'rgba(255,90,20,0.25)', cb: f => { burst(tx, ty, 16, { sp: 80, up: 50, g: 140, life: 0.6, c: ['#ff5a1a', '#ffd040', '#3a1a10'] }); if (dist2(G.P.x, G.P.y, tx, ty) < 22 * 22) hurtPlayer(G.P.S.maxhp * 0.9, { burn: 1 }); } }); }, k * 350); } }
}
// ---------- diving job ----------
function placeDiveSpots(W) { const R = new RNG(SEED + 909); let n = 0;
  const near = (cx, cy, rad, cnt) => { let put = 0; for (let t = 0; t < 4000 && put < cnt; t++) { const x = cx + R.int(-rad, rad), y = cy + R.int(-rad, rad); if (!W.inb(x, y)) continue; const i = W.I(x, y); if (W.ter[i] !== T.WATER && W.ter[i] !== T.DEEP) continue; if (W.objAt[i] >= 0) continue; let shore = false; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const j = W.I(x + dx, y + dy); if (!WATERY[W.ter[j]] && !SOLID_T[W.ter[j]]) shore = true; } if (!shore) continue; addObj(W, 'dive', x, y, { solid: false, tier: cy > 190 ? 3 : 1 }); put++; n++; } };
  near(VOLC.cx, VOLC.cy, 52, 18); near(214, 140, 30, 6); near(229, 171, 22, 5); near(270, 150, 20, 4); }
function diveTarget(o) { return o.k === 'dive' && !o.hidden; }
function startDive(o) { const P = G.P; P.job = { kind: 'buceo', o, t: 0, tier: o.tier || 1 }; setAnim(P, 'gather'); P.loopAnim = true; sfx('cast'); burst(o.px, o.py - 4, 12, { sp: 30, up: 30, g: 60, life: 0.6, c: ['#d8f4ff', '#ffffff'] }); }
function updateDive(dt) { const P = G.P, J = P.job; if (!J || J.kind !== 'buceo') return false; J.t += dt; if (Math.random() < dt * 10) part(J.o.px + (Math.random() - 0.5) * 10, J.o.py - 4, { vz: 20, g: -10, life: 0.8, c: '#e0f8ff', s: 2 });
  if (J.t >= 2.6 * (perk('buceo', 15) ? 0.8 : 1)) { finishDive(J); P.job = null; setAnim(P, 'idle'); } return true; }
function finishDive(J) { const P = G.P, o = J.o, t = J.tier, lv = P.jobs.buceo.lv; o.hidden = true; o.respawn = G.t + 70;
  const r = Math.random(); let got;
  if (r < 0.02 + (t > 1 ? 0.03 : 0) + (perk('buceo', 35) ? 0.05 : 0)) got = 'perla_negra'; else if (r < 0.22 + lv * 0.002) got = 'perla'; else if (r < 0.5) got = 'coral'; else if (r < 0.75) got = 'concha'; else got = null;
  if (got) giveItem(got, 1); else { const g = Math.round((60 + lv * 20) * t * (0.6 + Math.random())); P.gold += g; toast('¡Un cofre hundido! +' + fmt(g) + ' oro', 'loot', 3); sfx('coin'); }
  if (t > 1 && Math.random() < 0.08) { const f = FISH3.filter(x => x[3].includes('volcan')); giveItem(pick2(f)[0], 1); }
  gainJobXp('buceo', 14 + t * 18); questEvent('job', { job: 'buceo', tier: t, n: 1 }); burst(o.px, o.py - 4, 16, { sp: 40, up: 40, g: 60, life: 0.6, c: ['#d8f4ff', '#ffffff', '#7ad0ff'] }); sfx('pickup'); markDirty(); }
{ const _it = interactTarget; interactTarget = function () { const r = _it(); if (r) return r; const P = G.P, M = G.map; if (!M || !M.isWorld || P.dead) return null; const dv = DIRV[P.dir];
  for (let k = 0; k <= 2; k++) { const tx = Math.floor((P.x + dv[0] * (6 + k * 12)) / 16), ty = Math.floor((P.y - 2 + dv[1] * (4 + k * 12)) / 16); for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) { const i = tileAt(M, tx + ox, ty + oy); if (i < 0) continue; const oi = M.objAt[i]; if (oi < 0) continue; const o = M.objs[oi]; if (diveTarget(o) && dist(o.px, o.py, P.x, P.y) < 40) return { kind: 'dive', o, label: 'Bucear', icon: 'shell' }; if (o.k === 'spring' && dist(o.px, o.py, P.x, P.y) < 36) return { kind: 'spring', o, label: 'Termas', icon: 'heart' }; } } return null; }; }
{ const _di = doInteract; doInteract = function () { const P = G.P; if (!P.dead && !P.job && !P.fishing) { const it = interactTarget(); if (it && it.kind === 'dive') { startDive(it.o); return; } if (it && it.kind === 'spring') { hotSpring(); return; } } return _di(); }; }
// lava fishing & island waters
{ const _ha = habitatAt; habitatAt = function (tx, ty) { const W = G.world, i = W.I(tx, ty); if (W.ter[i] === T.LAVA) return 'lava'; if (REGIONS[W.reg[i]].k === 'volcan' || ty > 190) return 'volcan'; return _ha(tx, ty); }; }
