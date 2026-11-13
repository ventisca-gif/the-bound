// ================= ICONS (16x16) =================
const ICON = { keys: {}, list: [], url: null, cols: 16 };
function tierPal(t) { return t <= 1 ? pal(['#3a2a1e', '#6a5038', '#8a6a48', '#a88660', '#c8a47a']) : TIERP[t]; }
function genIcon(spec) {
  const [kind, a] = spec, p = new Pix(16, 16);
  const tp = typeof a === 'number' ? tierPal(a) : null, col = typeof a === 'string' ? C(a) : null;
  const shade = (c, f) => uMul(c, f), light = c => uMix(c, C('#ffffff'), 0.45);
  switch (kind) {
    case 'sword': { for (let k = 0; k < 9; k++) { p.set(4 + k, 11 - k, tp[4]); p.set(5 + k, 11 - k, tp[2]); } p.set(13, 2, tp[4]); p.line(2, 10, 6, 14, GOLD[4]); p.line(3, 10, 6, 13, GOLD[2]); p.line(1, 14, 3, 12, WOOD[3]); p.set(1, 15, GOLD[4]); break; }
    case 'greatsword': return genIcon(['sword', a]);
    case 'wsword': { const S = WS[a]; if (!S) return genIcon(['sword', 8]); const ca = Math.cos(-0.785), sa = Math.sin(-0.785), pt = (d, o = 0) => [3.6 + ca * d - sa * o, 12.4 + sa * d + ca * o]; drawStyledBlade(p, pt, S, 0.72); break; }
    case 'lute': { const tp = tierPal(typeof a === 'number' ? a : 6), wd = pal(['#3a1e0e', '#5e3418', '#8a5428', '#b0783a', '#d8a060']); p.line(7, 9, 13, 3, wd[1]); p.line(8, 9, 14, 3, wd[2]); p.hl(12, 2, 3, tp[3]); p.set(14, 1, tp[4]); p.ball(5.5, 10.5, 4, 3.6, [wd[1], wd[2], wd[3], wd[4]]); p.set(5, 10, C('#1a0e06')); p.set(6, 10, C('#1a0e06')); p.line(4, 13, 13, 4, C('#f0e8d0')); p.set(3, 13, tp[4]); p.set(8, 13, tp[3]); break; }
    case 'scythe': { const tp = typeof a === 'number' ? tierPal(a) : pal(['#3a4a6a', '#6a8aba', '#9ac0e8', '#c8e0ff', '#ffffff']), sh = pal(['#120c10', '#24181e', '#3a2a30', '#54404a', '#705a64']); p.line(3, 15, 11, 1, sh[3]); p.line(4, 15, 12, 1, sh[1]); for (let o = 0; o < 9; o++) { const y = 1 + Math.round(o * 0.35 + o * o * 0.06); p.set(11 - o, y, tp[4]); p.set(11 - o, y + 1, tp[2]); if (o < 4) p.set(11 - o, y + 2, tp[1]); } if (typeof a === 'number' && a >= 6) { p.set(8, 3, C('#7ac8ff')); p.set(5, 5, C('#7ac8ff')); } break; }
    case 'note': { const c = col || C('#ffd040'), d = uMul(c, 0.6); p.ball(5, 12, 2.6, 2, [d, c, c, light(c)]); p.ball(11, 10, 2.6, 2, [d, c, c, light(c)]); p.vl(7, 3, 9, c); p.vl(13, 2, 8, c); p.line(7, 3, 13, 2, c); p.line(7, 4, 13, 3, c); p.line(7, 5, 13, 4, d); break; }
    case 'soul': { const c = col || C('#5ab0ff'), d = uMul(c, 0.55); p.ball(8, 7, 4.6, 4.4, [d, c, c, light(c)]); for (let y = 10; y < 15; y++) { const w = Math.max(1, 4 - (y - 10)); p.hl(8 - w + ((y & 1) ? 1 : 0), y, w * 2 - 1, y > 12 ? d : c); } p.rect(6, 6, 1, 2, C('#0a1a3a')); p.rect(9, 6, 1, 2, C('#0a1a3a')); p.set(6, 4, C('#ffffff')); break; }
    case 'staff': { p.line(3, 14, 11, 6, WOOD[3]); p.line(4, 14, 12, 6, WOOD[1]); p.ball(12, 4, 3, 3, [tp[1], tp[2], tp[3], tp[4]]); p.set(11, 3, C('#ffffff')); break; }
    case 'bow': { for (let t = -6; t <= 6; t++) { const x = 9 - Math.round(3 * (1 - (t / 6) ** 2)); p.set(x, 8 + t, tp[3]); p.set(x - 1, 8 + t, tp[1]); } p.vl(10, 2, 13, C('#e8e0d0')); p.line(4, 12, 14, 4, WOOD[3]); p.set(14, 4, C('#e8eef6')); break; }
    case 'dagger': { for (const o of [0, 5]) { p.line(3 + o, 12, 8 + o, 3, tp[4]); p.line(4 + o, 12, 9 + o, 4, tp[2]); p.hl(2 + o, 12, 4, GOLD[3]); p.set(3 + o, 14, WOOD[3]); p.set(3 + o, 13, WOOD[2]); } break; }
    case 'helm': { p.ball(8, 8, 6, 5.5, [tp[1], tp[2], tp[3], tp[4]]); p.rect(3, 9, 10, 5, tp[2]); p.hl(3, 9, 10, tp[4]); p.rect(5, 10, 6, 2, C('#140e12')); p.vl(8, 3, 6, tp[4]); break; }
    case 'armor': { p.poly([[2, 4], [6, 2], [10, 2], [14, 4], [13, 14], [3, 14]], tp[2]); p.poly([[2, 4], [6, 2], [7, 2], [5, 14], [3, 14]], tp[3]); p.vl(8, 4, 10, tp[4]); p.hl(3, 10, 10, tp[1]); p.rect(6, 1, 4, 2, tp[1]); break; }
    case 'gem': { p.poly([[4, 5], [12, 5], [15, 8], [8, 15], [1, 8]], col); p.poly([[4, 5], [8, 5], [8, 15], [1, 8]], light(col)); p.hl(1, 8, 15, shade(col, 0.75)); p.line(5, 6, 7, 6, C('#ffffff')); p.set(11, 9, shade(col, 0.5)); break; }
    case 'stone': { p.ball(8, 9, 6, 5, [shade(col, 0.35), shade(col, 0.6), col, light(col)]); for (const [x, y] of [[6, 7], [10, 9], [7, 11]]) p.set(x, y, C('#ffffff')); p.line(4, 9, 7, 6, light(col)); break; }
    case 'relic': { p.poly([[5, 2], [11, 2], [10, 5], [13, 9], [11, 14], [5, 14], [3, 9], [6, 5]], col); p.poly([[5, 2], [8, 2], [7, 14], [5, 14], [3, 9], [6, 5]], light(col)); p.hl(4, 9, 9, shade(col, 0.6)); p.hl(5, 12, 7, shade(col, 0.7)); break; }
    case 'crop': { p.ball(8, 10, 5, 4.5, [shade(col, 0.5), shade(col, 0.8), col, light(col)]); p.line(8, 6, 8, 2, C('#3a8a30')); p.line(8, 4, 11, 2, C('#5ab040')); p.line(8, 4, 5, 3, C('#5ab040')); break; }
    case 'seed': { p.poly([[3, 4], [13, 4], [12, 14], [4, 14]], C('#c8a870')); p.hl(3, 4, 11, C('#a08050')); p.rect(5, 2, 7, 2, C('#8a6a40')); p.ball(8, 9, 2.5, 2.5, [shade(col, 0.6), col, light(col)]); p.set(6, 12, C('#6a4a2a')); p.set(10, 12, C('#6a4a2a')); break; }
    case 'shovel': { p.line(3, 13, 10, 6, WOOD[3]); p.line(4, 13, 11, 6, WOOD[1]); p.line(2, 14, 4, 12, WOOD[4]); p.poly([[9, 4], [12, 1], [15, 4], [12, 7]], tp[3]); p.line(12, 1, 15, 4, tp[4]); break; }
    case 'needle': { p.line(3, 13, 13, 3, C('#d0d8e4')); p.set(12, 3, C('#ffffff')); p.ell(12, 4, 1.4, 1.4, 0); p.line(13, 3, 9, 8, C('#e03a5a')); p.line(9, 8, 5, 6, C('#e03a5a')); p.line(5, 6, 3, 10, C('#e03a5a')); break; }
    case 'amulet': { const rc = [C('#c8c8d0'), C('#6ae04a'), C('#4aa8ff'), C('#c070ff'), C('#ffb030'), C('#ff5a5a')][a] || C('#c8c8d0'); p.line(3, 2, 8, 8, GOLD[3]); p.line(13, 2, 8, 8, GOLD[3]); p.ball(8, 10, 3.6, 3.6, [shade(rc, 0.5), rc, light(rc)]); p.ell(8, 10, 4.6, 4.6, 0); p.ball(8, 10, 3.2, 3.2, [shade(rc, 0.5), rc, light(rc)]); p.set(7, 9, C('#ffffff')); break; }
    case 'paw': { const pc = C('#d8c0a0'); p.ball(8, 10, 4, 3.5, [shade(pc, 0.6), pc, light(pc)]); for (const [x, y] of [[3, 6], [6, 3], [10, 3], [13, 6]]) p.ball(x, y, 1.8, 1.8, [shade(pc, 0.6), pc, light(pc)]); break; }
    case 'flag': { p.vl(3, 1, 14, WOOD[3]); p.poly([[4, 2], [14, 4], [11, 7], [14, 10], [4, 9]], C('#c03a4a')); p.line(4, 2, 14, 4, C('#f07a80')); break; }
    case 'crown': { p.poly([[2, 6], [5, 9], [8, 4], [11, 9], [14, 6], [13, 13], [3, 13]], GOLD[3]); p.hl(3, 12, 11, GOLD[1]); p.set(8, 4, GOLD[5]); p.set(8, 10, C('#e02040')); p.set(5, 11, C('#4aa8ff')); p.set(11, 11, C('#4aa8ff')); break; }
    case 'legs': { p.rect(4, 2, 8, 3, tp[2]); p.hl(4, 2, 8, tp[4]); p.rect(4, 5, 3, 9, tp[3]); p.rect(9, 5, 3, 9, tp[1]); p.hl(4, 8, 3, tp[4]); p.hl(9, 8, 3, tp[3]); p.hl(4, 13, 3, tp[0]); p.hl(9, 13, 3, tp[0]); break; }
    case 'hanger': { p.line(2, 9, 8, 4, IRON[4]); p.line(14, 9, 8, 4, IRON[4]); p.hl(2, 10, 13, IRON[3]); p.vl(8, 1, 3, IRON[4]); p.set(9, 1, IRON[4]); p.rect(4, 11, 9, 4, C('#c03a4a')); p.hl(4, 11, 9, C('#f07a80')); break; }
    case 'boots': { p.rect(3, 3, 4, 9, tp[2]); p.rect(3, 11, 7, 3, tp[2]); p.vl(3, 3, 11, tp[4]); p.rect(9, 4, 4, 8, tp[1]); p.rect(9, 11, 6, 3, tp[1]); p.hl(3, 13, 7, tp[0]); break; }
    case 'ring': { const rc = [C('#c8c8d0'), C('#6ae04a'), C('#4aa8ff'), C('#c070ff'), C('#ffb030')][a] || C('#c8c8d0'); p.ell(8, 9, 5, 5, GOLD[3]); p.ell(8, 9, 3, 3, 0); p.set(4, 8, GOLD[5]); p.ball(8, 4, 2.6, 2.6, [shade(rc, 0.5), rc, light(rc)]); break; }
    case 'axe': { p.line(3, 14, 11, 4, WOOD[3]); p.line(4, 14, 12, 4, WOOD[1]); p.poly([[9, 2], [15, 4], [14, 9], [11, 7]], tp[3]); p.line(15, 4, 14, 9, tp[4]); break; }
    case 'pick': { p.line(4, 14, 10, 5, WOOD[3]); p.line(5, 14, 11, 5, WOOD[1]); for (let k = -5; k <= 5; k++) p.set(10 + k, 4 + Math.round(Math.abs(k) * 0.5) - (k > 0 ? 0 : 0), tp[k > 0 ? 4 : 3]); break; }
    case 'rod': { p.line(2, 14, 13, 2, WOOD[3]); p.line(3, 14, 14, 2, WOOD[1]); p.vl(14, 3, 9, C('#e8e8f0')); p.set(14, 12, C('#e8302a')); p.ell(4, 12, 1.5, 1.5, IRON[3]); break; }
    case 'log': { const B = [null, BARK.std, BARK.std, BARK.birch, BARK.dark, BARK.std, BARK.std, BARK.ash][a] || BARK.std; p.rect(2, 5, 11, 7, B[2]); p.hl(2, 5, 11, B[3]); p.hl(2, 11, 11, B[1]); p.ell(13, 8.5, 2.5, 3.5, C('#d8b07a')); p.ell(13, 8.5, 1.4, 2, C('#b08850')); if (a === 7) p.hl(4, 8, 6, C('#ff7a2a')); break; }
    case 'ore': { const oc = pal(ORE[a]); p.ball(8, 9, 6, 5, STONEP.slice(1, 5)); p.ball(6, 8, 2, 2, oc); p.ball(10, 10, 2, 1.6, oc); p.set(9, 6, oc[2]); p.set(5, 7, oc[2]); break; }
    case 'herb': { const h = HERB[a]; p.line(8, 14, 8, 6, LEAF.roble[3]); p.line(8, 10, 4, 6, LEAF.roble[4]); p.line(8, 9, 12, 5, LEAF.roble[4]); p.ball(8, 5, 2.6, 2.6, [C(h[1]), C(h[2]), C(h[3])]); p.ball(4, 6, 1.6, 1.6, [C(h[1]), C(h[2])]); p.ball(12, 5, 1.6, 1.6, [C(h[1]), C(h[2])]); break; }
    case 'fish': { const c = col; p.ell(7, 8, 5.5, 3.2, c); p.ell(7, 7, 4.5, 1.6, light(c)); p.hl(3, 10, 8, shade(c, 0.6)); p.poly([[11, 8], [15, 4], [15, 12]], shade(c, 0.8)); p.set(4, 7, C('#101010')); p.set(3, 7, C('#ffffff')); break; }
    case 'gel': { p.ball(8, 10, 6, 4.5, [shade(col, 0.5), shade(col, 0.8), col, light(col)]); p.set(5, 8, C('#ffffff')); break; }
    case 'pelt': { p.poly([[3, 3], [13, 3], [14, 7], [12, 13], [4, 13], [2, 7]], col); p.poly([[3, 3], [6, 3], [5, 13], [4, 13], [2, 7]], light(col)); for (let k = 0; k < 6; k++) p.set(4 + k * 2, 5 + (k % 3) * 3, shade(col, 0.7)); break; }
    case 'fang': { p.poly([[5, 2], [9, 3], [11, 14], [8, 13]], col); p.line(5, 2, 8, 13, light(col)); p.line(9, 3, 11, 13, shade(col, 0.7)); break; }
    case 'spore': { p.ball(8, 7, 6, 4, [shade(col, 0.5), col, light(col)]); p.rect(6, 10, 4, 5, C('#e8dcc0')); p.set(5, 5, C('#ffffff')); p.set(10, 6, C('#ffffff')); break; }
    case 'shell': { p.ball(8, 9, 6, 5, [shade(col, 0.5), col, light(col)]); for (let k = 0; k < 4; k++) p.line(8, 14, 3 + k * 3, 5, shade(col, 0.6)); break; }
    case 'ear': { p.poly([[3, 12], [6, 3], [12, 2], [10, 9], [6, 13]], col); p.line(6, 4, 9, 9, shade(col, 0.6)); break; }
    case 'cloth': { p.poly([[2, 4], [14, 3], [13, 12], [3, 13]], col); for (let y = 5; y < 12; y += 2) p.hl(3, y, 10, light(col)); break; }
    case 'wing': { p.poly([[2, 8], [14, 3], [12, 8], [14, 13]], col); p.line(2, 8, 14, 3, light(col)); p.line(2, 8, 14, 13, shade(col, 0.6)); break; }
    case 'bone': { p.line(3, 12, 12, 3, col); p.line(4, 12, 13, 3, shade(col, 0.8)); p.ball(3, 13, 2, 2, [shade(col, 0.7), col]); p.ball(13, 3, 2, 2, [shade(col, 0.7), col]); break; }
    case 'core': { p.ball(8, 8, 6, 6, [shade(col, 0.35), shade(col, 0.6), col, light(col)]); p.set(6, 5, C('#ffffff')); p.set(7, 5, C('#ffffff')); break; }
    case 'crystal': { p.poly([[8, 1], [12, 6], [8, 15], [4, 6]], col); p.poly([[8, 1], [12, 6], [8, 15]], shade(col, 0.7)); p.line(8, 2, 6, 7, C('#ffffff')); break; }
    case 'scale': { for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) p.ball(4 + j * 4 + (k % 2) * 2, 4 + k * 4, 2.6, 2.4, [shade(col, 0.5), col, light(col)]); break; }
    case 'potion': case 'potion2': { const big = kind === 'potion2'; p.rect(6, 1, 4, 3, C('#c8b090')); p.rect(7, 4, 2, 2, C('#d8e8f0')); p.ball(8, big ? 10 : 10.5, big ? 6 : 5, big ? 5.5 : 4.5, [shade(col, 0.5), shade(col, 0.8), col, light(col)]); p.set(5, 9, C('#ffffff')); p.set(5, 10, C('#ffffff')); break; }
    case 'scroll': { p.rect(3, 4, 10, 8, C('#efe4c8')); p.ell(3, 8, 1.6, 4, C('#c8b890')); p.ell(13, 8, 1.6, 4, C('#c8b890')); p.hl(5, 6, 6, col); p.hl(5, 8, 5, col); p.hl(5, 10, 6, col); break; }
    case 'food': { p.ell(8, 11, 7, 3, C('#e8e4dc')); p.ell(8, 10, 6, 2.2, C('#ffffff')); const c = [null, '#c88a4a', '#e88a6a', '#a8784a', '#d8c070', '#c8c8e8', '#e86a4a', '#e0302a'][a] || '#c88a4a'; p.ell(8, 8, 4.5, 2.5, C(c)); p.set(6, 7, light(C(c))); p.set(10, 7, C('#5aa040')); p.set(11, 6, C('#5aa040')); break; }
    case 'frag': { const c = C(['#ffd040', '#6ae04a', '#ff6a3a', '#a040e0', '#e0d8c2', '#7ad0ff', '#ff3a2a', '#ffffff'][(a - 1) % 8]); p.poly([[8, 1], [13, 7], [9, 15], [3, 9]], c); p.poly([[8, 1], [13, 7], [9, 15]], shade(c, 0.7)); p.line(8, 2, 5, 8, C('#ffffff')); break; }
    // skill / ui icons
    case 'slash': p.ell(8, 8, 6.5, 6.5, col); p.ell(9.5, 7, 6, 6, 0); p.line(3, 13, 6, 10, C('#ffffff')); break;
    case 'spin': for (let k = 0; k < 18; k++) { const an = k / 18 * Math.PI * 2, r = 3 + k * 0.25; p.set(Math.round(8 + Math.cos(an) * r), Math.round(8 + Math.sin(an) * r), k % 3 ? col : C('#ffffff')); } break;
    case 'up': p.poly([[8, 2], [14, 9], [10, 9], [10, 14], [6, 14], [6, 9], [2, 9]], col); p.line(8, 3, 3, 8, light(col)); break;
    case 'slam': p.rect(6, 1, 4, 7, IRON[4]); p.rect(4, 7, 8, 2, GOLD[3]); for (let k = 0; k < 5; k++) p.line(8, 12, 2 + k * 3, 15, col); p.hl(1, 12, 14, col); break;
    case 'shield': p.poly([[3, 2], [13, 2], [13, 8], [8, 15], [3, 8]], col); p.poly([[3, 2], [8, 2], [8, 15], [3, 8]], light(col)); p.vl(8, 3, 11, shade(col, 0.6)); break;
    case 'shout': p.poly([[2, 6], [6, 6], [11, 2], [11, 14], [6, 10], [2, 10]], col); p.line(13, 5, 15, 3, light(col)); p.line(13, 8, 15, 8, light(col)); p.line(13, 11, 15, 13, light(col)); break;
    case 'bouquet': { p.poly([[5, 9], [11, 9], [9, 15], [7, 15]], C('#f4d8e8')); p.line(7, 9, 9, 15, C('#e0a8c8')); for (const [x, y] of [[8, 9], [6, 9], [10, 9]]) p.line(8, 14, x, y, LEAF.roble[3]); for (const [x, y, c] of [[5, 5, '#ff4a6a'], [8, 3, '#ffd040'], [11, 5, '#ff8ac8'], [7, 7, '#c070ff'], [10, 7, '#ff4a6a']]) p.ball(x, y, 1.8, 1.8, [shade(C(c), 0.6), C(c), light(C(c))]); break; }
    case 'cake': { p.ell(8, 13, 7, 2, C('#e8e4dc')); p.rect(3, 7, 10, 6, C('#f8e0c8')); p.rect(3, 9, 10, 2, C('#ff8ab0')); p.hl(3, 7, 10, C('#ffffff')); p.vl(3, 7, 6, C('#ffffff')); p.ball(6, 6, 1.4, 1.4, [C('#a01020'), C('#e02838'), C('#ff8a8a')]); p.ball(10, 6, 1.4, 1.4, [C('#a01020'), C('#e02838'), C('#ff8a8a')]); p.vl(8, 2, 4, C('#8ad0ff')); p.set(8, 1, C('#ffd040')); break; }
    case 'house': { p.poly([[1, 8], [8, 1], [15, 8]], C('#c8343a')); p.hl(2, 8, 13, C('#7a1e22')); p.rect(3, 8, 10, 7, C('#f0e4cc')); p.rect(7, 10, 3, 5, WOOD[2]); p.rect(4, 10, 2, 2, C('#ffd870')); p.rect(11, 10, 1, 2, C('#ffd870')); break; }
    case 'heart': p.ball(5.5, 6, 3.5, 3.5, [shade(col, 0.6), col, light(col)]); p.ball(10.5, 6, 3.5, 3.5, [shade(col, 0.6), col, light(col)]); p.poly([[2, 7], [14, 7], [8, 14]], col); p.set(4, 4, C('#ffffff')); break;
    case 'dash': for (let k = 0; k < 3; k++) p.hl(2 + k, 4 + k * 4, 8 - k, light(col)); p.poly([[9, 3], [15, 8], [9, 13]], col); break;
    case 'drop': p.poly([[8, 1], [12, 8], [4, 8]], col); p.ball(8, 10, 4.5, 4.5, [shade(col, 0.6), col, light(col)]); p.set(6, 9, C('#ffffff')); break;
    case 'star': { const pts = []; for (let k = 0; k < 10; k++) { const an = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 3 : 7; pts.push([8 + Math.cos(an) * r, 8.5 + Math.sin(an) * r]); } p.poly(pts, col); p.set(7, 5, C('#ffffff')); break; }
    case 'fire': p.poly([[8, 1], [13, 9], [11, 14], [5, 14], [3, 9], [6, 6], [7, 9]], col); p.poly([[8, 7], [10, 11], [8, 14], [6, 11]], C('#ffe060')); break;
    case 'meteor': p.ball(10, 10, 4, 4, [C('#5a1a08'), C('#c03010'), col, C('#ffd040')]); for (let k = 0; k < 4; k++) p.line(2 + k, 2, 8 + k * 0.5, 8, C(k % 2 ? '#ffd040' : '#ff7020')); break;
    case 'nova': for (let k = 0; k < 24; k++) { const an = k / 24 * Math.PI * 2; p.set(Math.round(8 + Math.cos(an) * 6), Math.round(8 + Math.sin(an) * 6), col); if (k % 3 === 0) p.set(Math.round(8 + Math.cos(an) * 4), Math.round(8 + Math.sin(an) * 4), light(col)); } p.ball(8, 8, 2, 2, [col, light(col)]); break;
    case 'ice': p.line(2, 14, 13, 3, col); p.line(3, 14, 14, 3, light(col)); p.poly([[11, 2], [15, 1], [14, 5]], C('#ffffff')); break;
    case 'snow': for (let k = 0; k < 3; k++) { const an = k * Math.PI / 3; p.line(8 - Math.cos(an) * 6, 8 - Math.sin(an) * 6, 8 + Math.cos(an) * 6, 8 + Math.sin(an) * 6, col); } p.set(8, 8, C('#ffffff')); break;
    case 'blink': p.ball(8, 8, 6, 6, [shade(col, 0.4), shade(col, 0.7), col]); p.ball(9, 7, 3, 3, [col, light(col), C('#ffffff')]); break;
    case 'arrow': p.line(2, 14, 12, 4, WOOD[3]); p.poly([[10, 2], [15, 1], [14, 6]], col); p.line(2, 14, 4, 11, C('#e8e8e8')); p.line(2, 14, 5, 13, C('#e8e8e8')); break;
    case 'eye': p.ell(8, 8, 7, 4, C('#ffffff')); p.ball(8, 8, 3, 3, [shade(col, 0.6), col]); p.set(8, 8, C('#101010')); p.set(7, 7, C('#ffffff')); break;
    case 'rain': for (let k = 0; k < 6; k++) p.line(2 + k * 2.4, 2 + (k % 2) * 3, 2 + k * 2.4, 8 + (k % 2) * 3, col); p.hl(1, 14, 14, shade(col, 0.6)); break;
    case 'root': for (let k = 0; k < 4; k++) { p.line(2 + k * 4, 15, 4 + k * 3, 4, col); p.line(3 + k * 4, 15, 5 + k * 3, 5, shade(col, 0.6)); } break;
    case 'leaf': p.poly([[2, 14], [4, 6], [10, 2], [14, 3], [12, 10]], col); p.line(2, 14, 12, 4, shade(col, 0.6)); break;
    case 'multi': for (let k = -1; k <= 1; k++) { p.line(2, 8, 13, 8 + k * 5, col); p.set(13, 8 + k * 5, C('#ffffff')); } break;
    case 'boot': p.rect(4, 2, 5, 9, col); p.rect(4, 10, 9, 4, col); p.vl(4, 2, 12, light(col)); for (let k = 0; k < 3; k++) p.hl(10, 5 + k * 2, 4, light(col)); break;
    case 'skull': p.ball(8, 7, 5.5, 5, [shade(col, 0.7), col, light(col)]); p.rect(5, 11, 6, 3, col); p.rect(5, 6, 2, 3, C('#140a10')); p.rect(9, 6, 2, 3, C('#140a10')); p.set(6, 12, C('#140a10')); p.set(9, 12, C('#140a10')); break;
    case 'cloud': p.ball(5, 9, 4, 3.5, [shade(col, 0.6), col, light(col)]); p.ball(10, 8, 4.5, 4, [shade(col, 0.6), col, light(col)]); p.ball(8, 11, 5, 3, [shade(col, 0.6), col]); break;
    case 'talk': p.rect(2, 3, 12, 8, C('#fff8ec')); p.poly([[4, 10], [8, 10], [4, 14]], C('#fff8ec')); for (let k = 0; k < 3; k++) p.rect(4 + k * 3, 6, 2, 2, C('#4a3a2a')); break;
    case 'ways': p.poly([[5, 15], [11, 15], [10, 3], [8, 1], [6, 3]], C('#5a647e')); p.vl(8, 4, 9, C('#8ff8ff')); p.set(7, 6, C('#8ff8ff')); p.set(9, 10, C('#8ff8ff')); break;
    case 'board': p.rect(2, 2, 12, 10, WOOD[3]); p.rect(4, 4, 3, 3, C('#efe4c8')); p.rect(9, 4, 3, 4, C('#efe4c8')); p.rect(5, 8, 4, 3, C('#efe4c8')); p.vl(4, 12, 3, WOOD[2]); p.vl(11, 12, 3, WOOD[2]); break;
    case 'bag': p.ball(8, 10, 6, 5, pal(['#4a2e14', '#7a5228', '#a07038', '#c89050'])); p.rect(5, 2, 6, 4, C('#7a5228')); p.hl(4, 5, 8, C('#4a2e14')); p.set(8, 10, GOLD[4]); break;
    case 'book': p.rect(2, 2, 12, 12, C('#7a3a1a')); p.rect(4, 3, 9, 10, C('#efe4c8')); p.vl(8, 3, 10, C('#c8b890')); for (let k = 0; k < 3; k++) { p.hl(4, 5 + k * 2, 3, C('#8a7a5a')); p.hl(9, 5 + k * 2, 3, C('#8a7a5a')); } break;
    case 'map': p.poly([[1, 3], [5, 2], [10, 4], [15, 2], [15, 13], [10, 15], [5, 13], [1, 14]], C('#e8d8a8')); p.line(5, 2, 5, 13, C('#b8a878')); p.line(10, 4, 10, 15, C('#b8a878')); p.set(7, 7, C('#e02030')); p.set(12, 9, C('#3a7a2a')); break;
    case 'gear': p.ball(8, 8, 6, 6, IRON.slice(1, 5)); for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4; p.rect(Math.round(8 + Math.cos(an) * 6.5) - 1, Math.round(8 + Math.sin(an) * 6.5) - 1, 2, 2, IRON[3]); } p.ell(8, 8, 2, 2, 0); break;
    case 'coin': p.ball(8, 8, 6, 6, GOLD.slice(1)); p.vl(8, 5, 6, GOLD[1]); break;
    case 'run': { const c = C('#ffffff'); p.ball(10, 3, 1.8, 1.8, [c, c]); p.line(9, 5, 7, 10, c); p.line(8, 6, 11, 8, c); p.line(8, 6, 4, 7, c); p.line(7, 10, 10, 13, c); p.line(10, 13, 9, 15, c); p.line(7, 10, 4, 12, c); p.line(4, 12, 2, 12, c); break; }
    case 'atk': { p.line(3, 13, 12, 4, C('#ffffff')); p.line(4, 13, 13, 4, C('#c8d0e0')); p.line(3, 9, 7, 13, GOLD[4]); p.line(1, 15, 4, 12, WOOD[3]); p.set(13, 3, C('#ffffff')); break; }
    case 'anvil': p.rect(2, 4, 12, 4, IRON[3]); p.hl(2, 4, 12, IRON[5]); p.rect(6, 8, 4, 3, IRON[2]); p.rect(3, 11, 10, 3, IRON[1]); break;
    case 'chat': p.rect(1, 3, 14, 9, C('#ffffff')); p.poly([[3, 11], [7, 11], [3, 15]], C('#ffffff')); p.hl(3, 6, 10, C('#4a6aaa')); p.hl(3, 9, 7, C('#4a6aaa')); break;
    case 'users': p.ball(5, 5, 2.5, 2.5, [C('#c8e8ff'), C('#ffffff')]); p.ball(11, 5, 2.5, 2.5, [C('#c8e8ff'), C('#ffffff')]); p.ball(5, 12, 4, 3, [C('#8ab0e0'), C('#c8e8ff')]); p.ball(11, 12, 4, 3, [C('#8ab0e0'), C('#c8e8ff')]); break;
    default: p.rect(3, 3, 10, 10, C('#ff00ff'));
  }
  p.outline(OUTL); return p;
}
function iconKey(spec) { return spec.join(':'); }
const UI_ICONS = ['talk', 'axe:2', 'pick:2', 'herb:1', 'rod:2', 'ways', 'board', 'bag', 'book', 'map', 'gear', 'coin', 'run', 'atk', 'anvil', 'potion:#e02838', 'food:1', 'star:#ffd040', 'chat', 'users', 'sword:3', 'hanger', 'heart:#ff5a8a', 'house', 'bouquet', 'cake', 'soul:#5ab0ff', 'note:#ffd040', 'star:#ff8ab0', 'note:#ff7ab0', 'scythe:6', 'lute:3'];
function buildIconAtlas() {
  const specs = new Map(); const add = s => { const k = iconKey(s); if (!specs.has(k)) specs.set(k, s); };
  for (const id in ITEMS) add(ITEMS[id].icon); for (const id in SK) add([SK[id].icon[0], SK[id].icon[1]]);
  UI_ICONS.forEach(s => add(s.split(':').map((v, i) => i === 1 && /^\d+$/.test(v) ? +v : v)));
  const list = [...specs.values()], cols = 16, rows = Math.ceil(list.length / cols); const cvs = mkCanvas(cols * 16, rows * 16), x = cvs.getContext('2d');
  list.forEach((s, i) => { const p = genIcon(s); p.toCtx(x, (i % cols) * 16, Math.floor(i / cols) * 16); ICON.keys[iconKey(s)] = i; });
  ICON.list = list; ICON.cols = cols; ICON.rows = rows; ICON.url = cvs.toDataURL(); ICON.canvas = cvs;
}
function iconHTML(spec, size = 32, extra = '') {
  const i = ICON.keys[iconKey(spec)]; if (i === undefined) return `<i class="ico" style="width:${size}px;height:${size}px"></i>`;
  const s = size / 16; return `<i class="ico ${extra}" style="width:${size}px;height:${size}px;background-position:${-(i % ICON.cols) * size}px ${-Math.floor(i / ICON.cols) * size}px;background-size:${ICON.cols * size}px ${ICON.rows * size}px"></i>`;
}
