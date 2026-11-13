// ================= MORE MONSTER ART (expansion biomes) =================
Object.assign(SLIMEC, { arena: ['#5a3a10', '#a87a2a', '#e0b860', '#fff0b8'], cristal: ['#3a1a6a', '#7a4ad0', '#b48cff', '#f0e0ff'], eclipse: ['#0a0612', '#2a1040', '#5a2a80', '#c070ff'], selva: ['#0c3a1a', '#1a7a3a', '#4ac060', '#b8ff9a'] });
const QUADX = { jaguar: ['#3a1a06', '#7a4010', '#c0782a', '#e8a850', '#ffd890'], hiena: ['#3a2a14', '#6a5030', '#9a7a4a', '#c0a070', '#e0cca0'], ciervo: ['#1a2a5a', '#3a5aa0', '#7aa0e0', '#b8d8ff', '#ffffff'], vacio: ['#06030a', '#140a22', '#281442', '#46246a', '#7a46b0'], jabali_rey: ['#1a0e06', '#3a2010', '#5e3a1e', '#8a5a30', '#b88a5a'] };
const QSCALE = { jabali_rey: 1.7, ciervo: 1.15, vacio: 1.2, jaguar: 1.05 };
const BATPAL = { eclipse: [['#06030a', '#1a0a2a', '#3a1a5a', '#7a3ab0'], '#ffd040'], selva: [['#0c1a0a', '#1a3a14', '#2e5a22', '#4a8a36'], '#ff3a3a'] };
const GHOSTPAL = { prisma: ['#3a2a7a', '#7a6ad0', '#b8a8ff', '#f4ecff'], sombra: ['#06030a', '#1e1030', '#3c1e5a', '#7a40a0'], arena: ['#5a4020', '#a88a50', '#d8c090', '#fff4d8'] };
function genScorpion(kind, scale = 1) {
  const P = pal(typeof SCORPPAL !== 'undefined' && SCORPPAL[kind] ? SCORPPAL[kind] : kind === 'rey' ? ['#1a0606', '#4a0e0a', '#7a1a10', '#b03a1a', '#e87a3a'] : kind === 'cristal' ? ['#1a1040', '#3a2a8a', '#6a5ad0', '#a898ff', '#e8e0ff'] : ['#3a2408', '#7a5018', '#b08030', '#e0b860', '#fff0b0']);
  const gold = kind === 'rey', fw = Math.round(48 * scale), fh = Math.round(40 * scale), s = scale;
  return mobAtlas(fw, fh, (p, dir, a, f) => {
    const cx = fw / 2, base = fh - 4, side = dir === 'left', bob = a === 'walk' ? f % 2 : 0, lunge = a === 'atk' ? [0, 5, 2][f] : 0, sting = a === 'atk' ? [0, 1, 0][f] : 0;
    const by = base - 6 * s - bob * 0.5;
    // legs
    for (let k = 0; k < 4; k++) for (const sg of side ? [1] : [-1, 1]) { const lx = side ? cx - 6 * s + k * 4 * s : cx + sg * (5 + k * 1.5) * s, ph = a === 'walk' ? ((k + f) % 2) * 2 - 1 : 0; p.line(lx, by, lx + (side ? ph : sg * 4 * s), base - (k % 2), P[1]); }
    if (side) {
      const hx = cx - 10 * s - lunge; p.ball(cx + 2 * s, by - 2 * s, 9 * s, 4.5 * s, P.slice(1)); p.ball(hx + 3 * s, by - 2 * s, 5 * s, 4 * s, P.slice(1));
      // claws
      for (const o of [-2, 2]) { const clx = hx - 6 * s - lunge * 0.5, cly = by - 1 * s + o; p.line(hx, by - 1 * s, clx + 3, cly, P[2]); p.ball(clx, cly, 3 * s, 2 * s, P.slice(1)); p.set(Math.round(clx - 3 * s), Math.round(cly - 1), P[0]); }
      // tail arc up and over toward the head
      const segs = 7; for (let k = 0; k <= segs; k++) { const t = k / segs, ang = Math.PI * (0.05 + t * (0.95 + sting * 0.2)), rr = 11 * s; const tx = cx + 10 * s + Math.cos(Math.PI - ang) * -rr * 0.2 - t * 12 * s * 0.6, ty = by - 2 * s - Math.sin(ang) * rr * 1.2; p.ball(tx + 6 * s * (1 - t), ty, 2.4 * s * (1 - t * 0.3), 2.2 * s * (1 - t * 0.3), P.slice(1)); if (k === segs) { p.line(tx, ty, tx - 3 * s, ty + 3 * s, gold ? GOLD[4] : C('#2a1a10')); } }
      p.set(Math.round(hx), Math.round(by - 4 * s), C('#101010')); p.set(Math.round(hx + 2 * s), Math.round(by - 4 * s), C('#101010'));
    } else {
      p.ball(cx, by - 3 * s, 8 * s, 6 * s, P.slice(1));
      const up = dir === 'up';
      // tail rising behind
      for (let k = 0; k < 6; k++) { const ty = by - 6 * s - k * 3 * s - sting * 3, tx = cx + Math.sin(k * 0.6) * 1.5 * s; p.ball(tx, ty, 2.6 * s - k * 0.15, 2.2 * s, P.slice(1)); if (k === 5) p.line(tx, ty - 2 * s, tx + (up ? 0 : 2), ty + 3 * s, gold ? GOLD[4] : C('#2a1a10')); }
      if (!up) { for (const sg of [-1, 1]) { const clx = cx + sg * 11 * s, cly = by - 2 * s + lunge * 0.4; p.line(cx + sg * 5 * s, by - 2 * s, clx, cly, P[2]); p.ball(clx, cly, 3.2 * s, 2.6 * s, P.slice(1)); p.set(Math.round(clx), Math.round(cly + 2 * s), P[0]); } p.set(Math.round(cx - 2 * s), Math.round(by - 4 * s), C('#101010')); p.set(Math.round(cx + 2 * s), Math.round(by - 4 * s), C('#101010')); if (gold) { p.hl(Math.round(cx - 3 * s), Math.round(by - 8 * s), Math.round(6 * s), GOLD[4]); for (let k = 0; k < 3; k++) p.set(Math.round(cx - 3 * s + k * 3 * s), Math.round(by - 9 * s), GOLD[5]); } }
    }
  });
}
function genSnake(kind) {
  const P = pal(typeof SNAKEPAL !== 'undefined' && SNAKEPAL[kind] ? SNAKEPAL[kind] : kind === 'selva' ? ['#0a2a0e', '#1a5a1e', '#3a9a32', '#8ad050', '#d0f090'] : ['#3a2a0a', '#7a5a1a', '#b88a30', '#e0c070', '#fff0c0']), belly = pal(['#8a7a4a', '#c8b880', '#f0e4b8']);
  return mobAtlas(40, 34, (p, dir, a, f) => {
    const cx = 20, base = 30, side = dir === 'left', lunge = a === 'atk' ? [0, 6, 2][f] : 0, ph = (a === 'walk' ? f : a === 'idle' ? f * 0.5 : 0) * 1.4;
    if (side) { for (let k = 0; k < 18; k++) { const x = cx + 14 - k * 1.4, y = base - 2 + Math.sin(k * 0.6 + ph) * 1.5; p.ball(x, y, 2.4, 2, P.slice(1)); }
      const hx = cx - 12 - lunge, hy = base - 14 - (a === 'atk' ? 2 : 0); for (let k = 0; k < 7; k++) p.ball(cx - 10 - k * 0.3 - lunge * k / 7, base - 3 - k * 1.6, 2.5, 2.2, P.slice(1)); p.ball(hx, hy, 4.2, 3.2, P.slice(1)); p.set(hx - 2, hy - 1, C('#ffe040')); if (a === 'atk') { p.line(hx - 4, hy + 1, hx - 7, hy + 2, C('#e02040')); } }
    else { for (let k = 0; k < 20; k++) { const ang = k * 0.55 + ph * 0.3, rr = 9 - k * 0.25; p.ball(cx + Math.cos(ang) * rr, base - 4 + Math.sin(ang) * rr * 0.4, 2.6, 2.2, P.slice(1)); }
      for (let k = 0; k < 6; k++) p.ball(cx, base - 6 - k * 2, 2.6, 2.2, dir === 'up' ? P.slice(1) : [belly[0], belly[1], belly[2], belly[2]]); const hy = base - 18 - lunge * 0.6; p.ball(cx, hy, 5, 3.6, P.slice(1)); for (const sg of [-1, 1]) p.ball(cx + sg * 5, hy + 2, 2.6, 3, P.slice(0, 4));
      if (dir !== 'up') { p.set(cx - 2, hy, C('#ffe040')); p.set(cx + 2, hy, C('#ffe040')); if (a === 'atk') p.vl(cx, hy + 3, 3, C('#e02040')); } }
  });
}
function genPlant(kind) {
  const P = pal(typeof SPIDERPAL !== 'undefined' && SPIDERPAL[kind] ? SPIDERPAL[kind] : kind === 'cristal' ? ['#2a1a5a', '#5a3aa0', '#9a7ae0', '#e0d0ff'] : ['#5a0a1a', '#a01a30', '#e0405a', '#ff9ab0']), L = pal(['#0c3a12', '#1a6a20', '#3aa03a', '#8ae070']);
  return mobAtlas(40, 44, (p, dir, a, f) => {
    const cx = 20, base = 41, sway = a === 'idle' || a === 'walk' ? [0, 1, 0, -1][f % 4] : 0, open = a === 'atk' ? [3, 6, 1][f] : 2 + (f % 2);
    for (const sg of [-1, 1]) { p.poly([[cx, base], [cx + sg * 14, base - 4], [cx + sg * 8, base - 1]], L[2]); p.line(cx, base - 1, cx + sg * 13, base - 4, L[3]); }
    for (let y = base - 18; y < base; y++) { const x = cx + Math.round(Math.sin((y - base) * 0.2) * 2 + sway * (base - y) / 18); p.set(x, y, L[1]); p.set(x + 1, y, L[2]); }
    const hx = cx + sway * 2 + (dir === 'left' ? -2 : 0), hy = base - 24;
    p.ball(hx, hy - open, 9, 5, P); p.ball(hx, hy + open, 9, 4, [P[0], P[1], P[2], P[2]]);
    p.rect(hx - 7, hy - open + 2, 15, Math.max(1, open * 2 - 3), C('#3a0a14'));
    for (let k = -6; k <= 6; k += 3) { p.set(hx + k, hy - open + 3, C('#ffffff')); p.set(hx + k + 1, hy + open - 2, C('#ffffff')); }
    for (let k = -8; k <= 8; k += 4) p.set(hx + k, hy - open - 5, L[3]);
  });
}
function genSpider(kind) {
  const P = pal(kind === 'cristal' ? ['#2a1a5a', '#5a3aa0', '#9a7ae0', '#e0d0ff'] : ['#0a0a08', '#1e2414', '#34401e', '#5a6a2e']);
  return mobAtlas(40, 30, (p, dir, a, f) => {
    const cx = 20, by = 18 - (a === 'atk' ? [0, 3, 1][f] : 0);
    for (let k = 0; k < 4; k++) for (const sg of [-1, 1]) { const ph = a === 'walk' ? ((k + f) % 2) * 2 : 0; const kx = cx + sg * (6 + k * 2), ky = by - 4 - ph; p.line(cx + sg * 3, by - 1 + k * 0.5, kx, ky, P[1]); p.line(kx, ky, kx + sg * 4, by + 7 - (k % 2), P[1]); }
    p.ball(cx + (dir === 'left' ? 3 : 0), by + (dir === 'up' ? -2 : 1), 7, 5.5, P); p.ball(cx - (dir === 'left' ? 5 : 0), by - (dir === 'up' ? -3 : 3), 4, 3.5, P);
    if (dir !== 'up') { const ex = cx - (dir === 'left' ? 7 : 2); for (let k = 0; k < 4; k++) p.set(ex + k * (dir === 'left' ? 1 : 1.3), by - 4 + (k % 2), C('#ff3030')); }
    if (kind !== 'cristal') p.set(cx + 1, by + 2, C('#e02020'));
  });
}
Object.assign(HLOOKS, {
  momia: { body: 'normal', skin: pal(['#6a5a3a', '#a8987a', '#d0c4a6', '#f0e8d0']), hair: null, eyes: 'brillo', outfit: 'skeleton', weapon: null, blush: false, mono: true },
  nomada: { body: 'normal', skin: SKINS[2], hair: HAIRS.negro, hairStyle: 'short', eyes: 'cafe', outfit: 'rogue', main: pal(['#5a4a2a', '#8a7448', '#b8a070', '#dcc89a', '#f4e8c4']), sec: pal(['#4a1a06', '#7a2c0c', '#b04a1a', '#d8743a', '#f0a868']), cloth: pal(['#3a2a14', '#5a4022', '#7a5a34', '#9a7448', '#ba9060']), hat: 'bandana', hatC: pal(['#4a1a06', '#7a2c0c', '#b04a1a', '#d8743a', '#f0a868']), mask: pal(['#5a4a2a', '#8a7448', '#b8a070']), weapon: { k: 'sword', tier: 5 }, blush: false },
  lagarto: { body: 'normal', skin: pal(['#1a3a12', '#2e6a22', '#4a9a36', '#7ac85a']), hair: null, eyes: 'dorado', outfit: 'orc', bare: true, cloth: pal(['#3a2a14', '#5a4022', '#7a5a34', '#9a7448', '#ba9060']), weapon: { k: 'spear', tier: 7 }, blush: false, tusks: false },
  golemcristal: { body: 'big', skin: pal(['#2a1a5a', '#5a3aa0', '#9a7ae0', '#e0d0ff']), hair: null, eyes: 'hielo', outfit: 'orc', bare: true, cloth: pal(['#1a1040', '#3a2a8a', '#6a5ad0', '#a898ff', '#e8e0ff']), weapon: null, blush: false, mono: true },
  caballero_eclipse: { body: 'normal', skin: MSKIN.dark, hair: null, eyes: 'vacio', outfit: 'darkknight', main: pal(['#06030a', '#140a22', '#281442', '#46246a', '#7a46b0']), sec: pal(['#4a3008', '#7a5014', '#b08020', '#e0b840', '#fff0a0']), hat: 'helmet', hatC: pal(['#06030a', '#140a22', '#281442', '#46246a', '#7a46b0']), weapon: { k: 'greatsword', tier: 15 }, blush: false },
  demonio: { body: 'big', skin: pal(['#3a0606', '#7a1010', '#b02a1a', '#e05a3a']), hair: HAIRS.negro, hairStyle: 'spiky', eyes: 'vacio', outfit: 'orc', bare: true, cloth: pal(['#0a0606', '#1a0a0a', '#2a1010', '#3a1a1a', '#5a2a2a']), tusks: true, weapon: { k: 'spear', tier: 15 }, blush: false, cape: { out: pal(['#0a0204', '#1a060a', '#2e0a12', '#46101c', '#601a2a']), in: pal(['#3a0606', '#7a1010', '#b02a1a', '#e05a3a', '#ff8a6a']) } },
  renegado: { body: 'big', skin: SKINS[1], hair: HAIRS.gris, hairStyle: 'short', eyes: 'gris', beard: HAIRS.gris, outfit: 'knight', main: TIERP[4], sec: pal(['#2a0a06', '#4a140a', '#6a2010', '#8a2c1a', '#aa3a2a']), cloth: OUT.knight.cloth, cape: { out: pal(['#2a0a06', '#4a140a', '#6a2010', '#8a2c1a', '#aa3a2a']), in: pal(['#2a0a06', '#4a140a', '#6a2010', '#8a2c1a', '#aa3a2a']) }, weapon: { k: 'greatsword', tier: 4 }, blush: false },
  simio: { body: 'huge', skin: pal(['#0a1a08', '#1a3010', '#2e4a1e', '#4a6a30']), hair: pal(['#0a1a08', '#1a3010', '#2e4a1e', '#4a6a30']), hairStyle: 'spiky', eyes: 'dorado', outfit: 'orc', bare: true, cloth: pal(['#0a1a08', '#1a3010', '#2e4a1e', '#4a6a30', '#6a8a48']), weapon: { k: 'club', tier: 8 }, blush: false, mono: true, tusks: true },
  coloso: { body: 'huge', skin: pal(['#2a1a5a', '#5a3aa0', '#9a7ae0', '#e0d0ff']), hair: null, eyes: 'hielo', outfit: 'orc', bare: true, cloth: pal(['#1a1040', '#3a2a8a', '#6a5ad0', '#a898ff', '#e8e0ff']), hat: 'crown', weapon: null, blush: false, mono: true },
  eclipsor: { body: 'huge', skin: MSKIN.dark, hair: null, eyes: 'vacio', outfit: 'darkknight', main: pal(['#06030a', '#140a22', '#281442', '#46246a', '#7a46b0']), sec: pal(['#4a3008', '#7a5014', '#b08020', '#e0b840', '#fff0a0']), hat: 'horned', hatC: pal(['#4a3008', '#7a5014', '#b08020', '#e0b840', '#fff0a0', '#fffadf']), weapon: { k: 'greatsword', tier: 15 }, blush: false, cape: { out: pal(['#06030a', '#140a22', '#281442', '#46246a', '#7a46b0']), in: pal(['#4a3008', '#7a5014', '#b08020', '#e0b840', '#fff0a0']), trim: pal(['#4a3008', '#7a5014', '#b08020', '#e0b840', '#fff0a0']) } },
});
