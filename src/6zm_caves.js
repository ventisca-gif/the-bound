// ================= v3.7: CUEVAS NUEVAS (nivel 150–178) =================
// Gruta Congelada (Picos), Caverna Fúngica (Selva) y Cripta de Ámbar (Desierto). Cada una con criaturas propias,
// un jefe, un material nuevo y bloques de construcción que solo se fabrican con ese material.
// La experiencia se mantiene en la curva normal: las criaturas usan la fórmula de nivel de siempre (nada de multiplicadores extra).
BATPAL.hielo = [['#1e3a5a', '#3a6a9a', '#7ab0e0', '#d0ecff'], '#3ad0ff'];
BATPAL.espora = [['#1a0e2a', '#3a1e5a', '#6a3a9a', '#b07ae0'], '#9aff6a'];
GHOSTPAL.escarcha = ['#2a4a6a', '#6a9ac8', '#b0dcff', '#ffffff'];
GHOSTPAL.arena = ['#4a3010', '#8a6a2a', '#d0a860', '#fff0c0'];
SLIMEC.espora = ['#2a0e3a', '#5a2a8a', '#9a5ad8', '#d8b0ff'];
SCORPPAL.ambar = ['#2a1404', '#6a3a0a', '#b06a14', '#f0a830', '#ffe08a'];
HLOOKS.fungido = Object.assign({}, HLOOKS.goblin, { skin: pal(['#2a1e3a', '#4a3a6a', '#6a5a9a', '#8a7ab8', '#b0a0d8']), hat: 'straw', hatC: pal(['#3a0e4a', '#7a2a9a', '#b05ad8', '#e8a0ff']), weapon: { k: 'staff', tier: 8 }, eyes: 'brillo' });
HLOOKS.momia_ambar = Object.assign({}, HLOOKS.esqueleto, { skin: pal(['#5a4a30', '#8a7a58', '#b8a882', '#d8ccaa', '#f0e8d0']), cloth: pal(['#5a4a30', '#8a7a58', '#b8a882', '#d8ccaa', '#f0e8d0']), hat: 'bandana', hatC: pal(['#6a5a3a', '#a89a78', '#d8ccaa', '#f4ecd8']), weapon: { k: 'cane', tier: 9 }, eyes: 'brillo' });
// ---------- muñeco de nieve (sprite nuevo) ----------
function genSnowman(kind, scale = 1) {
  const S = scale, fw = Math.round(30 * S), fh = Math.round(40 * S), dark = kind === 'oscuro', rey = kind === 'rey';
  const snow = pal(dark ? ['#2a3a5a', '#4a6a90', '#7aa0c8', '#b0d0f0'] : ['#8aa0b8', '#c0d0e0', '#e4eef8', '#ffffff']);
  const scarf = pal(rey ? ['#4a0a14', '#8a1a2a', '#c83a4a', '#f07a8a'] : dark ? ['#0a0a1a', '#1a1a3a', '#2a2a5a', '#5a5a9a'] : ['#5a0a0a', '#a01a1a', '#e03a2a', '#ff8a6a']);
  return mobAtlas(fw, fh, (p, dir, a, f) => {
    const cx = fw / 2, base = fh - 3, bob = a === 'walk' ? [0, 1, 0, 1][f] : a === 'idle' ? f : 0, lean = a === 'atk' ? [0, -2, 1][f] : 0, hurt = a === 'hurt';
    const ball = (y, r) => p.ball(Math.round(cx + lean * (y < base - 14 * S ? 1 : 0)), Math.round(y), Math.round(r * S), Math.round(r * S * 0.92), snow);
    ball(base - 8 * S, 9); ball(base - 20 * S + bob, 7); const hy = base - 30 * S + bob; ball(hy, 5.5);
    // bufanda
    p.rect(Math.round(cx - 6 * S + lean), Math.round(hy + 4 * S), Math.round(12 * S), Math.max(2, Math.round(2 * S)), scarf[2]); if (dir !== 'up') p.rect(Math.round(cx + 2 * S + lean), Math.round(hy + 5 * S), Math.max(2, Math.round(3 * S)), Math.round(6 * S), scarf[1]);
    // cara
    if (dir !== 'up') { const ox = dir === 'left' ? -2 * S : 0, ey = Math.round(hy - 1 * S), coal = C(dark ? '#3ad0ff' : '#14101a');
      if (hurt) { p.set(Math.round(cx - 2 * S + ox), ey, coal); p.set(Math.round(cx + 2 * S + ox), ey + 1, coal); }
      else { p.rect(Math.round(cx - 3 * S + ox), ey, Math.max(1, Math.round(2 * S)), Math.max(1, Math.round(2 * S)), coal); if (dir !== 'left') p.rect(Math.round(cx + 1 * S + ox), ey, Math.max(1, Math.round(2 * S)), Math.max(1, Math.round(2 * S)), coal); }
      const nx = Math.round(cx + ox + (dir === 'left' ? -3 * S : 0)), ny = Math.round(hy + 1 * S); for (let k = 0; k < Math.round(4 * S); k++) p.set(nx + (dir === 'left' ? -k : 0), ny + (dir === 'left' ? 0 : Math.floor(k / 2)), C(k ? '#ff8a2a' : '#c85a10'));
      for (const b of [-6, 0, 6]) p.set(Math.round(cx + ox), Math.round(base - 20 * S + bob + b * S * 0.5), C('#14101a')); }
    // brazos de rama
    const arm = a === 'atk' ? [0, -6, -2][f] : a === 'walk' ? (f % 2) * 2 - 1 : 0, ay = Math.round(base - 21 * S + bob), br = C('#5a3a1a');
    p.line(Math.round(cx - 7 * S), ay, Math.round(cx - 13 * S), Math.round(ay - 4 * S + arm * S), br); p.line(Math.round(cx + 7 * S), ay, Math.round(cx + 13 * S), Math.round(ay - 4 * S - arm * S), br);
    if (a === 'atk' && f === 1) p.ball(Math.round(cx + 14 * S), Math.round(ay - 10 * S), Math.round(3 * S), Math.round(3 * S), snow);
    // sombrero / corona
    const ty = Math.round(hy - 5 * S);
    if (rey) { const g = GOLD; p.rect(Math.round(cx - 5 * S), ty - Math.round(3 * S), Math.round(10 * S), Math.round(3 * S), g[3]); for (let k = 0; k < 4; k++) p.vl(Math.round(cx - 5 * S + k * 3 * S), ty - Math.round(6 * S), Math.round(3 * S), g[4]); p.set(Math.round(cx), ty - Math.round(2 * S), C('#3ad0ff')); }
    else { const hc = dark ? C('#0a0a14') : C('#1a1420'); p.rect(Math.round(cx - 6 * S), ty, Math.round(12 * S), Math.max(1, Math.round(1.5 * S)), hc); p.rect(Math.round(cx - 4 * S), ty - Math.round(6 * S), Math.round(8 * S), Math.round(6 * S), hc); p.hl(Math.round(cx - 4 * S), ty - Math.round(2 * S), Math.round(8 * S), scarf[2]); }
  });
}
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art[0] === 'snowman') return getAtlas('M' + art.join(','), () => genSnowman(art[1], art[2] || 1)); return _ma(art); }; }
// ---------- materiales ----------
[['hielo_eterno', 'Hielo Eterno', ['crystal', '#9ae8ff']], ['nieve_luna', 'Nieve de Luna', ['gem', '#e8f4ff']], ['espora_lunar', 'Espora Lunar', ['core', '#b07ae0']], ['micelio', 'Micelio Brillante', ['gel', '#9aff6a']], ['ambar_antiguo', 'Ámbar Antiguo', ['gem', '#f0a830']], ['venda_eterna', 'Venda Eterna', ['cloth', '#e8dcc0']]].forEach(([id, n, icon]) => it(id, { n, t: 'mat', stack: true, tier: 12, price: 900, icon, rar: 3 }));
[['acc_invierno', 'Corona del Invierno', { atk: 760, hpB: 9000, def: 420, crit: 6 }, 162, 4, 'acc'], ['acc_micelio', 'Corazón de Micelio', { atk: 820, hpB: 11000, def: 380 }, 170, 4, 'neck'], ['acc_ambar', 'Escarabajo de Ámbar', { atk: 900, crit: 12, hpB: 12000, def: 460 }, 178, 4, 'acc']].forEach(([id, n, st, lv, rar, slot]) => it(id, Object.assign({ n, t: 'acc', slot, lv, price: 40 * lv * (rar + 1), icon: [slot === 'neck' ? 'amulet' : 'ring', rar], rar }, st)));
// ---------- criaturas ----------
Object.assign(MOBS, {
  muneco_nieve: { n: 'Muñeco de Nieve Maldito', art: ['snowman', 'nieve'], reg: ['cueva'], lv: [150, 160], hp: 1.4, atk: 1.6, def: 1.4, spd: 40, ai: 'ranged', fam: 'muneco', group: 2, drops: [['nieve_luna', 0.3], ['hielo_eterno', 0.08]] },
  muneco_oscuro: { n: 'Muñeco de Escarcha Negra', art: ['snowman', 'oscuro', 1.15], reg: ['cueva'], lv: [154, 162], hp: 1.8, atk: 1.8, def: 1.6, spd: 36, ai: 'aggro', fam: 'muneco', drops: [['hielo_eterno', 0.18], ['nieve_luna', 0.2]] },
  lobo_glacial: { n: 'Lobo Glacial', art: ['quad', 'lobohielo'], reg: ['cueva'], lv: [150, 160], hp: 1.2, atk: 1.7, def: 1.2, spd: 74, ai: 'charge', fam: 'lobo', group: 3, drops: [['pelaje', 0.4], ['hielo_eterno', 0.06]] },
  espiritu_escarcha: { n: 'Espíritu de Escarcha', art: ['ghost', 'escarcha'], reg: ['cueva'], lv: [152, 162], hp: 1.1, atk: 1.8, def: 1.1, spd: 52, ai: 'ranged', fam: 'fantasma', drops: [['ecto', 0.3], ['nieve_luna', 0.15]] },
  murci_hielo: { n: 'Murciélago de Hielo', art: ['bat', 'hielo'], reg: ['cueva'], lv: [150, 158], hp: 0.9, atk: 1.5, def: 0.9, spd: 82, ai: 'aggro', fam: 'murcielago', fly: 1, drops: [['ala', 0.3]] },
  slime_espora: { n: 'Slime de Esporas', art: ['slime', 'espora'], reg: ['cueva'], lv: [160, 168], hp: 1.4, atk: 1.6, def: 1.4, spd: 42, ai: 'aggro', fam: 'slime', poison: 1, drops: [['gel', 0.3], ['espora_lunar', 0.15]] },
  murci_espora: { n: 'Murciélago Esporado', art: ['bat', 'espora'], reg: ['cueva'], lv: [160, 168], hp: 1, atk: 1.6, def: 1, spd: 80, ai: 'aggro', fam: 'murcielago', fly: 1, group: 2, drops: [['micelio', 0.12]] },
  fungido: { n: 'Fúngido Errante', art: ['hum', 'fungido'], reg: ['cueva'], lv: [162, 170], hp: 1.6, atk: 1.8, def: 1.5, spd: 50, ai: 'ranged', fam: 'hongo', drops: [['espora_lunar', 0.25], ['micelio', 0.1]] },
  escarabajo_ambar: { n: 'Escarabajo de Ámbar', art: ['scorp', 'ambar'], reg: ['cueva'], lv: [168, 176], hp: 1.7, atk: 1.9, def: 1.9, spd: 48, ai: 'aggro', fam: 'escorpion', group: 2, drops: [['ambar_antiguo', 0.2], ['aguijon', 0.3]] },
  momia_ambar: { n: 'Momia del Ámbar', art: ['hum', 'momia_ambar'], reg: ['cueva'], lv: [168, 178], hp: 1.9, atk: 1.9, def: 1.7, spd: 44, ai: 'aggro', fam: 'esqueleto', group: 2, drops: [['venda_eterna', 0.25], ['hueso', 0.3]] },
  espectro_arena: { n: 'Espectro de Arena', art: ['ghost', 'arena'], reg: ['cueva'], lv: [170, 178], hp: 1.3, atk: 2, def: 1.3, spd: 56, ai: 'ranged', fam: 'fantasma', drops: [['ambar_antiguo', 0.12], ['ecto', 0.3]] },
});
Object.assign(BOSSES, {
  rey_invierno: { n: 'Rey del Invierno Eterno', lv: 163, art: ['snowman', 'rey', 2.2], hp: 28, atk: 2.2, def: 2.1, spd: 34, moves: ['slam', 'nova', 'summon', 'volley'], minion: 'muneco_nieve', acc: 'acc_invierno', drops: [['hielo_eterno', 1, 6], ['nieve_luna', 1, 4]], r: 30, cave: 1 },
  micelio_madre: { n: 'Micelio Primordial', lv: 171, art: ['slime', 'espora', 2.8, true], hp: 30, atk: 2.2, def: 2.2, spd: 30, moves: ['slam', 'summon', 'hop', 'nova', 'rain'], minion: 'slime_espora', acc: 'acc_micelio', drops: [['espora_lunar', 1, 6], ['micelio', 1, 4]], r: 30, cave: 1 },
  guardian_ambar: { n: 'Guardián de Ámbar', lv: 179, art: ['scorp', 'ambar', 2.4], hp: 30, atk: 2.3, def: 2.3, spd: 42, moves: ['charge', 'slam', 'volley', 'nova', 'summon'], minion: 'escarabajo_ambar', acc: 'acc_ambar', drops: [['ambar_antiguo', 1, 6], ['venda_eterna', 1, 3]], r: 30, cave: 1 },
});
Object.assign(CAVES, {
  gruta_helada: { n: 'Gruta Congelada', near: [214, 20], reg: 'picos', lv: [150, 162], floor: T.SNOW, dark: 0.5, mobs: ['muneco_nieve', 'muneco_oscuro', 'lobo_glacial', 'espiritu_escarcha', 'murci_hielo'], boss: 'rey_invierno', ores: [[11, 6]], deco: 'crystal', pool: T.WATER, seed: 5511, d: 'Bajo los Picos, el invierno nunca terminó. Los muñecos de nieve se mueven solos…' },
  caverna_fungica: { n: 'Caverna Fúngica', near: [352, 140], reg: 'selva', lv: [160, 170], floor: T.MUD, dark: 0.66, mobs: ['slime_espora', 'murci_espora', 'fungido'], boss: 'micelio_madre', ores: [[11, 5]], deco: 'mush', pool: T.WATER, seed: 6613, d: 'Hongos que brillan como lunas. Dicen que el bosque entero piensa con una sola mente.' },
  cripta_ambar: { n: 'Cripta de Ámbar', near: [300, 158], reg: 'desierto', lv: [168, 178], floor: T.SAND, dark: 0.6, mobs: ['escarabajo_ambar', 'momia_ambar', 'espectro_arena'], boss: 'guardian_ambar', ores: [[11, 6]], deco: 'mine', seed: 7717, d: 'Una cripta sellada con ámbar. Lo que quedó atrapado dentro sigue despierto.' },
});
for (const id of ['gruta_helada', 'caverna_fungica', 'cripta_ambar']) { const D = CAVES[id]; BOSSES[D.boss].where = D.n; for (const m of D.mobs) MOBS[m].where = D.n; }
{ const _fn = famName; famName = function (f) { return f === 'muneco' ? 'muñecos de nieve' : _fn(f); }; }
// bloques que solo se hacen con los materiales nuevos
Object.assign(BW_TOP, { hielo: ['#2a5a7a', '#5a9ac0', '#9ad0f0', '#e0f6ff'], ambar: ['#4a2a08', '#8a5014', '#c88a2a', '#f0c060'] });
Object.assign(BW_FACE, { hielo: ['#3a7aa0', '#6ab0d8', '#a8e0ff', '#ffffff'], ambar: ['#6a3a0a', '#a8661a', '#e0a038', '#ffd880'] });
Object.assign(BK, {
  w_hielo: { n: 'Pared de Hielo Eterno', wall: 'hielo', win: 1, cost: [['hielo_eterno', 1], ['piedra', 2]], tool: 'mineria', tier: 4, cat: 'pared', L: 1 },
  w_ambar: { n: 'Pared de Ámbar', wall: 'ambar', cost: [['ambar_antiguo', 1], ['piedra', 2]], tool: 'mineria', tier: 4, cat: 'pared', L: 1 },
  fl_hielo: { n: 'Suelo de Hielo', L: 0, cost: [['nieve_luna', 1]], tool: 'mineria', tier: 3, cat: 'suelo' },
  fl_ambar: { n: 'Suelo de Ámbar', L: 0, cost: [['ambar_antiguo', 1]], tool: 'mineria', tier: 3, cat: 'suelo' },
  lamp_espora: { n: 'Lámpara de Esporas', f: 'lamp_espora', cost: [['espora_lunar', 1], ['log', 1]], tool: 'tala', tier: 1, cat: 'deco', L: 1 },
  muneco_deco: { n: 'Muñeco de Nieve (decoración)', f: 'muneco_deco', cost: [['nieve_luna', 2]], tool: 'tala', tier: 1, cat: 'deco', L: 1 },
});
for (const k of ['w_hielo', 'w_ambar', 'fl_hielo', 'fl_ambar', 'lamp_espora', 'muneco_deco']) { BK_KEYS.push(k); it('bk_' + k, { n: BK[k].n, t: 'mat', bk: k, stack: true, tier: 1, price: 5, icon: ['bk', k] }); }
{ const _fs = floorSpr; floorSpr = function (k, v) {
  if (k !== 'fl_hielo' && k !== 'fl_ambar') return _fs(k, v); const key = k + v; if (BFL[key]) return BFL[key]; const p = new Pix(16, 16), ice = k === 'fl_hielo';
  const P4 = (ice ? ['#5a9ac0', '#8ac8e8', '#b8e8ff', '#ffffff'] : ['#8a5014', '#c88a2a', '#e8a838', '#ffe08a']).map(h => C(h));
  p.rect(0, 0, 16, 16, P4[1]); p.hl(0, 0, 16, P4[0]); p.vl(0, 0, 16, P4[0]); for (let n = 0; n < 4; n++) p.line(2 + n * 4, 14, 6 + n * 4, 2 + (v ? 2 : 0), P4[2]); p.set(4, 4, P4[3]); p.set(11, 9, P4[3]);
  return (BFL[key] = p.canvas()); }; }
{ const _g2 = genFurn2; genFurn2 = function (kind) {
  if (kind === 'lamp_espora') { const p = new Pix(14, 26); p.rect(6, 10, 2, 15, C('#c8b890')); p.ball(7, 7, 6, 5, pal(['#3a1e5a', '#6a3a9a', '#b07ae0', '#e8c8ff'])); for (const [x, y] of [[3, 6], [9, 4], [6, 9]]) p.set(x, y, C('#9aff6a')); p.outline(OUTL); return { c: p.canvas(), ax: 7, ay: 24 }; }
  if (kind === 'muneco_deco') { const a = mobAtlasFor(['snowman', 'nieve']), c = mkCanvas(a.fw, a.fh); c.getContext('2d').drawImage(a.img, 0, 0, a.fw, a.fh, 0, 0, a.fw, a.fh); return { c, ax: a.fw >> 1, ay: a.fh - 3 }; }
  return _g2(kind); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl(M, cx, cy, list); for (const d of list) if (d.k === 'furn' && d.f === 'lamp_espora' && !d.hidden) out.push({ x: d.px, y: d.py - 14, r: 50, c: 'rgba(170,110,255,0.45)' }); return out; }; }
// paredes de roca natural (no ladrillo) en las cuevas nuevas
{ const CTOP = { gruta_helada: T.SNOW, caverna_fungica: T.MUD, cripta_ambar: T.DIRT }; const _mc = makeCave; makeCave = function (id) { const M = _mc(id); const t = CTOP[id]; if (t !== undefined) { for (let i = 0; i < M.ter.length; i++) if (M.lvl[i] === 1 && M.ter[i] === T.STONE) M.ter[i] = t; M.chunks = new Map(); } return M; }; }
