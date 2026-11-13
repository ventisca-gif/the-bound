// ================= CAVES: underground zones entered from the world map =================
// ---------- palettes for the new cave creatures ----------
BATPAL.cueva = [['#0e0e14', '#22222e', '#3a3a4a', '#5a5a6e'], '#ffd040'];
GHOSTPAL.minero = ['#4a3410', '#a07a2a', '#e0b860', '#fff0c0'];
GHOSTPAL.abismo = ['#06101e', '#123a5a', '#2a7aa8', '#9ae0ff'];
SLIMEC.gema = ['#0a3a3a', '#1a8a7a', '#3ad8b8', '#c0fff0'];
const SPIDERPAL = { cueva: ['#120c08', '#2e2216', '#4e3a24', '#7a5e3a'], abismo: ['#04080e', '#0e2234', '#1e4a6a', '#5ab0e0'] };
const SCORPPAL = { abismo: ['#04060c', '#0e1a2e', '#1e3a5e', '#3a7ab0', '#a0e0ff'] };
const SNAKEPAL = { fuego: ['#3a0806', '#7a1a0a', '#c03a10', '#ff7a2a', '#ffd060'] };
HLOOKS.trasgo = Object.assign({}, HLOOKS.goblin, { skin: pal(['#2a2a1a', '#4a4a2a', '#6a6a3a', '#8a8a4e', '#a8a866']), hat: 'helmet', hatC: TIERP[2].concat([C('#ffe080')]), weapon: { k: 'pick', tier: 3 } });
HLOOKS.golemlava = Object.assign({}, HLOOKS.golem, { skin: pal(['#1a0806', '#3a120a', '#5a1e10', '#ff5a10', '#ffd040']), cloth: pal(['#1a0806', '#3a120a', '#5a1e10', '#8a2a14', '#ff7a2a']), eyes: 'brillo' });
HLOOKS.capataz = Object.assign({}, HLOOKS.trasgo, { body: 'big', hat: 'horned', hatC: TIERP[5].concat([C('#ffe080')]), armor: TIERP[5], weapon: { k: 'bigaxe', tier: 6 } });
HLOOKS.golemlava_b = Object.assign({}, HLOOKS.golemlava, { body: 'huge' });
// ---------- creatures ----------
Object.assign(MOBS, {
  murci_cueva: { n: 'Murciélago de las Cuevas', art: ['bat', 'cueva'], reg: ['cueva'], lv: [14, 22], hp: 0.8, atk: 1.1, def: 0.8, spd: 78, ai: 'aggro', fam: 'murcielago', fly: 1, drops: [['ala', 0.4]] },
  slime_gema: { n: 'Slime de Gemas', art: ['slime', 'gema'], reg: ['cueva'], lv: [14, 22], hp: 1.1, atk: 1, def: 1.2, spd: 40, ai: 'aggro', fam: 'slime', drops: [['gel', 0.4], ['rubi', 0.03]] },
  arana_cueva: { n: 'Araña de las Grutas', art: ['spider', 'cueva'], reg: ['cueva'], lv: [15, 22], hp: 1, atk: 1.2, def: 0.9, spd: 60, ai: 'aggro', fam: 'arana', poison: 1, group: 2, drops: [['seda', 0.4]] },
  minero_esp: { n: 'Minero Fantasma', art: ['ghost', 'minero'], reg: ['cueva'], lv: [56, 66], hp: 1.1, atk: 1.4, def: 1, spd: 50, ai: 'ranged', fam: 'fantasma', drops: [['ecto', 0.4], ['ore6', 0.15]] },
  trasgo: { n: 'Trasgo Minero', art: ['hum', 'trasgo'], reg: ['cueva'], lv: [56, 66], hp: 1.2, atk: 1.4, def: 1.3, spd: 56, ai: 'aggro', fam: 'goblin', group: 3, drops: [['oreja', 0.3], ['ore5', 0.2], ['diamante', 0.02]] },
  golem_hierro: { n: 'Gólem de Hierro', art: ['hum', 'golem'], reg: ['cueva'], lv: [58, 66], hp: 2.3, atk: 1.5, def: 2, spd: 34, ai: 'aggro', fam: 'golem', drops: [['nucleo', 0.4], ['ore6', 0.25]] },
  golem_magma: { n: 'Gólem de Magma', art: ['hum', 'golemlava'], reg: ['cueva'], lv: [84, 94], hp: 2.3, atk: 1.6, def: 1.9, spd: 36, ai: 'aggro', fam: 'golem', burn: 1, drops: [['brasa', 0.4], ['ore8', 0.2]] },
  salamandra: { n: 'Salamandra Ígnea', art: ['snake', 'fuego'], reg: ['cueva'], lv: [84, 92], hp: 1.1, atk: 1.6, def: 1, spd: 64, ai: 'charge', fam: 'serpiente', burn: 1, drops: [['brasa', 0.35], ['rubi', 0.04]] },
  arana_abismo: { n: 'Araña Abisal', art: ['spider', 'abismo'], reg: ['cueva'], lv: [128, 140], hp: 1.3, atk: 1.7, def: 1.4, spd: 64, ai: 'aggro', fam: 'arana', poison: 1, group: 2, drops: [['seda', 0.3], ['prisma', 0.2]] },
  escorp_abismo: { n: 'Escorpión Abisal', art: ['scorp', 'abismo'], reg: ['cueva'], lv: [130, 142], hp: 1.5, atk: 1.8, def: 1.7, spd: 46, ai: 'aggro', fam: 'escorpion', drops: [['aguijon', 0.3], ['opalo', 0.03]] },
  eco_abismo: { n: 'Eco del Abismo', art: ['ghost', 'abismo'], reg: ['cueva'], lv: [130, 142], hp: 1.2, atk: 1.8, def: 1.2, spd: 52, ai: 'ranged', fam: 'fantasma', drops: [['polvoestelar', 0.35]] },
});
[['acc_eco', 'Gema del Eco', { atk: 32, hpB: 320, def: 10 }, 22, 2, 'neck'], ['acc_capataz', 'Lámpara del Capataz', { atk: 130, def: 70, hpB: 1000 }, 64, 3, 'acc'], ['acc_magma', 'Corazón de Magma', { atk: 260, hpB: 2600, def: 120 }, 94, 4, 'neck'], ['acc_abismo', 'Ojo del Abismo', { atk: 560, crit: 10, hpB: 6500, def: 300 }, 142, 4, 'acc']].forEach(([id, n, st, lv, rar, slot]) => it(id, Object.assign({ n, t: 'acc', slot, lv, price: 40 * lv * (rar + 1), icon: [slot === 'neck' ? 'amulet' : 'ring', rar], rar }, st)));
Object.assign(BOSSES, {
  slime_gema_rey: { n: 'Coloso de Gemas', lv: 23, art: ['slime', 'gema', 2.4, true], hp: 30, atk: 1.4, def: 1.5, spd: 34, moves: ['slam', 'summon', 'hop', 'nova'], minion: 'slime_gema', acc: 'acc_eco', drops: [['rubi', 1, 1], ['piedra1', 0.6, 2]], r: 26, cave: 1 },
  capataz: { n: 'Capataz Espectral', lv: 66, art: ['hum', 'capataz'], hp: 26, atk: 1.8, def: 1.7, spd: 50, moves: ['charge', 'slam', 'summon', 'volley'], minion: 'trasgo', acc: 'acc_capataz', drops: [['diamante', 1, 1], ['ore6', 1, 6], ['piedra1', 1, 3]], r: 28, cave: 1 },
  golem_lava: { n: 'Gólem de Lava Ancestral', lv: 95, art: ['hum', 'golemlava_b'], hp: 26, atk: 2, def: 2, spd: 34, moves: ['slam', 'rain', 'nova', 'breath'], acc: 'acc_magma', drops: [['brasa', 1, 8], ['rubi', 1, 2], ['piedra2', 0.6, 1]], r: 30, cave: 1 },
  escorp_rey: { n: 'Emperador Abisal', lv: 143, art: ['scorp', 'abismo', 2.2], hp: 26, atk: 2.2, def: 2.1, spd: 44, moves: ['charge', 'slam', 'volley', 'nova', 'summon'], minion: 'escorp_abismo', acc: 'acc_abismo', drops: [['opalo', 1, 1], ['piedra3', 0.5, 1], ['piedra2', 1, 2]], r: 30, cave: 1 },
});
// ---------- cave definitions ----------
const CAVES = {
  cueva_eco: { n: 'Cueva del Eco', near: [50, 140], reg: 'bosque', lv: [14, 22], floor: T.DIRT, dark: 0.6, mobs: ['murci_cueva', 'slime_gema', 'arana_cueva'], boss: 'slime_gema_rey', ores: [[2, 7], [3, 3]], deco: 'mush', pool: T.WATER, seed: 1101, d: 'Una gruta húmeda donde cada sonido rebota mil veces.' },
  mina_vieja: { n: 'Mina Abandonada', at: [176, 48], reg: 'picos', lv: [56, 66], floor: T.DIRT, dark: 0.68, mobs: ['minero_esp', 'trasgo', 'golem_hierro'], boss: 'capataz', ores: [[5, 8], [6, 5], [7, 2]], deco: 'mine', seed: 2203, d: 'La vieja mina de Arxar. Dicen que los mineros nunca se fueron.' },
  grieta_magma: { n: 'Grieta de Magma', near: [230, 172], reg: 'nhar', lv: [84, 94], floor: T.ASH, dark: 0.55, mobs: ['golem_magma', 'salamandra', 'murcifuego'], boss: 'golem_lava', ores: [[8, 7], [9, 3]], deco: 'lava', pool: T.LAVA, seed: 3307, d: 'Bajo Nhar, ríos de roca fundida iluminan los túneles.' },
  abismo_cristal: { n: 'Abismo de Cristal', near: [300, 80], reg: 'cristal', lv: [130, 142], floor: T.DUSK, dark: 0.72, mobs: ['arana_abismo', 'escorp_abismo', 'eco_abismo'], boss: 'escorp_rey', ores: [[10, 7], [11, 4]], deco: 'crystal', pool: T.WATER, seed: 4409, d: 'Un abismo de cristales que cantan en la oscuridad.' },
};
for (const id in CAVES) { const D = CAVES[id]; BOSSES[D.boss].where = D.n; for (const m of D.mobs) if (MOBS[m].reg[0] === 'cueva') MOBS[m].where = D.n; }
// ---------- world entrances (called by buildWorld before nature) ----------
function placeCaves(W) {
  W.caves = [];
  for (const id in CAVES) {
    const D = CAVES[id]; let site = null;
    if (D.at) site = [D.at[0], D.at[1] - 1];
    else {
      const ok = (x, y) => { const L0 = W.lvl[W.I(x, y)]; for (let dy = -2; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const xx = x + dx, yy = y + dy; if (!W.inb(xx, yy)) return false; const i = W.I(xx, yy), t = W.ter[i]; if (SOLID_T[t] || t === T.STAIRS || t === T.BRIDGE || t === T.FARM || W.objAt[i] >= 0 || W.townAt[i] >= 0 || (W.flags[i] & 4) || W.lvl[i] !== L0 || REGIONS[W.reg[i]].k !== D.reg) return false; } return true; };
      for (let r = 0; r < 40 && !site; r++) for (let a = 0; a < 32 && !site; a++) { const x = Math.round(D.near[0] + Math.cos(a / 32 * 6.283) * r), y = Math.round(D.near[1] + Math.sin(a / 32 * 6.283) * r); if (W.inb(x, y) && ok(x, y)) site = [x, y]; }
      if (!site) continue;
      addObj(W, 'cave', site[0], site[1], { cave: id, fp: [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]] });
    }
    const [x, y] = site; W.doors.push({ x, y: y + 1, to: id, cave: 1 }); W.caves.push({ id, x, y: y + 1 });
    for (let yy = y - 3; yy <= y + 4; yy++) for (let xx = x - 4; xx <= x + 4; xx++) if (W.inb(xx, yy)) W.flags[W.I(xx, yy)] |= 16;
  }
}
// cave mouth sprite (rocky arch in the region's tones)
function genCaveMouth(v) {
  const p = new Pix(48, 40), S = pal([['#2a2622', '#433c34', '#5e554a', '#7a7062', '#968a7a'], ['#2a1206', '#4a200e', '#6a3418', '#8a4a26', '#a8643a'], ['#1a1430', '#2e2650', '#4a3e78', '#6a5aa0', '#9a8ad0']][v % 3]);
  p.ball(24, 22, 23, 17, S); for (let k = 0; k < 7; k++) p.ball(6 + k * 6, 10 + ((k * 5) % 7), 5, 4, S);
  p.ell(24, 26, 10, 12, C('#06040a')); p.rect(14, 26, 20, 14, C('#06040a')); for (let x = 15; x < 33; x += 4) p.line(x, 17 + (x % 3), x + 1, 21 + (x % 3), S[1]);
  for (const sx of [12, 35]) { p.rect(sx, 28, 2, 11, S[1]); p.set(sx, 27, S[3]); }
  if (v % 3 === 1) for (let k = 0; k < 6; k++) p.set(16 + k * 3, 39 - (k % 2), C('#ff7a2a'));
  if (v % 3 === 2) for (const [x, y] of [[8, 30], [40, 28], [5, 22], [43, 20]]) { p.rect(x, y - 4, 2, 5, C('#9ad8ff')); p.set(x, y - 5, C('#ffffff')); }
  return { c: p.canvas(), ax: 24, ay: 38 };
}
// ---------- interior generation ----------
function makeCave(id) {
  const D = CAVES[id], w = 64, h = 46, N = w * h, R = new RNG(D.seed), I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.CWALL), lvl: new Uint8Array(N), reg: new Uint8Array(N).fill(Math.max(0, REGIONS.findIndex(r => r.k === D.reg))), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: D.dark, music: 'cave', I, cave: id, camps: [] };
  const inside = (x, y) => x >= 2 && y >= 2 && x < w - 2 && y < h - 2;
  const carve = (cx, cy, r) => { for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) if (inside(x, y) && ((x - cx) ** 2 + ((y - cy) / 0.8) ** 2) <= r * r) M.ter[I(x, y)] = D.floor; };
  const ex = w >> 1, start = [ex, h - 7];
  const pts = [start]; for (let k = 0; k < 8; k++) { let p, tries = 0; do { p = [R.int(8, w - 9), R.int(6, h - 14)]; tries++; } while (tries < 40 && pts.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 13)); pts.push(p); }
  const chain = [pts[0]], rest = pts.slice(1); while (rest.length) { const l = chain[chain.length - 1]; rest.sort((a, b) => Math.hypot(a[0] - l[0], a[1] - l[1]) - Math.hypot(b[0] - l[0], b[1] - l[1])); chain.push(rest.shift()); }
  const tunnel = (a, b) => { let x = a[0], y = a[1]; for (let s = 0; s < 400; s++) { const dx = b[0] - x, dy = b[1] - y, L = Math.hypot(dx, dy); if (L < 1.5) break; x += dx / L + (R.f() - 0.5) * 1.1; y += dy / L + (R.f() - 0.5) * 1.1; carve(x, y, 1.6 + R.f() * 0.9); } };
  for (let k = 0; k < chain.length; k++) { carve(chain[k][0], chain[k][1], k === 0 ? 4 : R.int(4, 7)); if (k) tunnel(chain[k - 1], chain[k]); }
  tunnel(chain[2], chain[chain.length - 1]); // a loop so it isn't a single line
  for (let y = h - 7; y < h; y++) for (let x = ex - 1; x <= ex + 1; x++) M.ter[I(x, y)] = y === h - 1 && x !== ex ? T.CWALL : D.floor;
  for (let y = h - 3; y < h - 1; y++) { M.ter[I(ex - 2, y)] = T.CWALL; M.ter[I(ex + 2, y)] = T.CWALL; }
  M.exit = { x: ex, y: h - 1 };
  // reachable set from the entrance (used to keep pools from blocking paths)
  const reach = () => { const seen = new Uint8Array(N), q = [I(ex, h - 2)]; seen[q[0]] = 1; let n = 0; while (q.length) { const i = q.pop(); n++; const x = i % w, y = (i / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue; const j = I(xx, yy); if (!seen[j] && !SOLID_T[M.ter[j]] && M.ter[j] !== T.CWALL && M.lvl[j] === 0) { seen[j] = 1; q.push(j); } } } return { seen, n }; };
  if (D.pool) { for (let k = 0; k < 9; k++) { const c = chain[R.int(1, chain.length - 1)], px = c[0] + R.int(-4, 4), py = c[1] + R.int(-3, 3); const before = reach().n, set = []; for (let y = py - 2; y <= py + 2; y++) for (let x = px - 2; x <= px + 2; x++) if (inside(x, y) && M.ter[I(x, y)] === D.floor && (x - px) ** 2 + (y - py) ** 2 <= 3.2 + R.f() * 2) { set.push(I(x, y)); M.ter[I(x, y)] = D.pool; } if (reach().n !== before - set.length) for (const i of set) M.ter[i] = D.floor; } }
  // rock walls become raised rock with cliff faces (looks like a cave, not a dungeon)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = I(x, y); if (M.ter[i] !== T.CWALL) continue; M.lvl[i] = 1; const below = y + 1 < h ? M.ter[I(x, y + 1)] : T.CWALL; M.ter[i] = below !== T.CWALL && below !== T.FACE ? T.FACE : T.STONE; }
  for (let x = ex - 1; x <= ex + 1; x++) if (x !== ex) { M.ter[I(x, h - 1)] = T.STONE; M.lvl[I(x, h - 1)] = 1; }
  prepPalettes(M);
  initMapObjs(M);
  const free = (x, y) => inside(x, y) && M.ter[I(x, y)] === D.floor && M.lvl[I(x, y)] === 0 && M.objAt[I(x, y)] < 0 && Math.abs(x - ex) + Math.abs(y - (h - 4)) > 4;
  const nearWall = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => M.lvl[I(x + dx, y + dy)] === 1);
  const R0 = reach();
  const sp = (wall) => { for (let t = 0; t < 300; t++) { const x = R.int(3, w - 4), y = R.int(3, h - 4); if (free(x, y) && R0.seen[I(x, y)] && (!wall || nearWall(x, y))) return [x, y]; } return null; };
  for (const [tier, n] of D.ores) for (let k = 0; k < n; k++) { const s = sp(true); if (s) addObj(M, 'ore', s[0], s[1], { tier, v: R.int(0, 3), cave: 1 }); }
  const decoN = { mush: 22, mine: 14, lava: 10, crystal: 26 }[D.deco] || 12;
  for (let k = 0; k < decoN; k++) { const s = sp(true); if (!s) continue; const [x, y] = s;
    if (D.deco === 'mush') addObj(M, 'mushroom', x, y, { solid: false, glow: 1 }); else if (D.deco === 'crystal') addObj(M, 'crystal', x, y); else if (D.deco === 'mine') { if (k % 3 === 0) addObj(M, 'lantern', x, y, { kind: 0 }); else addObj(M, k % 3 === 1 ? 'crate' : 'barrel', x, y); } else addObj(M, k % 2 ? 'bones' : 'obsidian', x, y, { solid: k % 2 === 0 }); }
  for (let k = 0; k < 6; k++) { const s = sp(false); if (s) addObj(M, 'bones', s[0], s[1], { solid: false }); }
  addObj(M, 'campfire', ex + 3, h - 6); M.lights = [];
  // camps in every chamber except the entrance; the farthest chamber holds the boss
  const far = chain.slice(1).sort((a, b) => Math.hypot(b[0] - start[0], b[1] - start[1]) - Math.hypot(a[0] - start[0], a[1] - start[1]))[0];
  for (const c of chain.slice(1)) { if (c === far) continue; const mob = D.mobs[R.int(0, D.mobs.length - 1)]; M.camps.push({ x: c[0], y: c[1], mob, lv: R.int(D.lv[0], D.lv[1]), n: (MOBS[mob].group || 2) + 1, r: 3, alive: [], dead: [], L: 0 }); }
  M.bossAt = far; M.wdist = null; G.maps[id] = M; return M;
}
// ---------- spawns inside caves ----------
const CAVE_RT = {};
function caveSpawns() {
  const P = G.P, M = G.map, D = CAVES[M.id]; if (!D) return; const rt = CAVE_RT[M.id] = CAVE_RT[M.id] || { bossT: 0, boss: null };
  for (const c of M.camps) { c.alive = c.alive.filter(m => !m.remove && m.hp > 0); c.dead = c.dead.filter(t => t > G.t);
    while (c.alive.length + c.dead.length < c.n) { const a = Math.random() * 6.28, r = Math.random() * 2; let x = (c.x + Math.cos(a) * r) * 16 + 8, y = (c.y + Math.sin(a) * r) * 16 + 8; if (blockedFor(M, Math.floor(x / 16), Math.floor(y / 16), 0)) { x = c.x * 16 + 8; y = c.y * 16 + 8; } const m = spawnMob(c.mob, clamp(c.lv + Math.round((Math.random() - 0.5) * 2), 1, MAXLV), x, y, 0, c); m.map = M.id; m.home = { x: c.x * 16 + 8, y: c.y * 16 + 8 }; c.alive.push(m); } }
  if (rt.boss && (rt.boss.remove || rt.boss.dying)) { if (rt.boss.dying || rt.boss.hp <= 0) rt.bossT = G.t + 420; rt.boss = null; }
  if (!rt.boss && G.t > rt.bossT && M.bossAt) { const B = BOSSES[D.boss]; const b = spawnMob(D.boss, B.lv, M.bossAt[0] * 16 + 8, M.bossAt[1] * 16 + 8, 0, null, true); b.map = M.id; rt.boss = b; }
}
function enterCaveBanner(id) { const D = CAVES[id]; banner(D.n, 'Nivel ' + D.lv[0] + ' - ' + D.lv[1]); const P = G.P; P.ws = P.ws || {}; if (!P.ws['cv_' + id]) { P.ws['cv_' + id] = 1; toast(D.d, 'info', 5); } }
THEMES.cave = { bpm: 72, root: 45, scale: [0, 1, 3, 5, 7, 8, 10], chords: [0, 5, 6, 5], lead: 'triangle', seed: 41, drums: 1, arp: 1 };
for (const [b, id] of WS_LATE) if (BOSSES[b]) BOSSES[b].drops.push([id, 0.15, 1]);
