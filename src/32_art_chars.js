// ================= CHARACTER ART (paper-doll humanoids) =================
const SKINS = [pal(['#a86e58', '#e3a98d', '#f6caaf', '#ffe4d2']), pal(['#8a5640', '#c78c6a', '#dea684', '#f2c6a4']), pal(['#5e3826', '#905c3e', '#ae7652', '#ca966c']), pal(['#3a2216', '#603c28', '#7c5036', '#98684a'])];
const MSKIN = { goblin: pal(['#2a4a1a', '#4a7a2a', '#68a03a', '#90c458']), orc: pal(['#2a3a22', '#46603a', '#628250', '#86a46c']), bone: pal(['#7a7262', '#b8b09a', '#e0d8c2', '#fffbea']), witch: pal(['#3a5a3a', '#6a8a5a', '#8aaa78', '#b0cc9a']), fur: pal(['#8a96aa', '#c4ccd8', '#e8ecf2', '#ffffff']), rock: pal(['#3a3430', '#5f554b', '#7a6f62', '#968a7b']), dark: pal(['#0c0a12', '#1c1826', '#2e2a40', '#4a4866']), ghost: pal(['#4a5a7a', '#8aa0c8', '#b8cce8', '#e8f4ff']) };
const HAIRS = { negro: pal(['#0b0a12', '#1b1828', '#2c2a42', '#4c4a6c']), castano: pal(['#2a160c', '#4a2a16', '#6e4222', '#946234']), rubio: pal(['#6a4a14', '#b08a2a', '#dcbc4a', '#f8e48a']), blanco: pal(['#5e5e70', '#a0a0b4', '#d4d4e2', '#ffffff']), rojo: pal(['#3a0a0a', '#7a1a14', '#b4321e', '#e0603a']), azul: pal(['#0c1a3a', '#1a3470', '#2c54a8', '#5a84d8']), rosa: pal(['#5a1a3a', '#a03a6a', '#d8649a', '#f8a0c8']), verde: pal(['#0c2a1a', '#1a4a2a', '#2c7040', '#4ca060']), gris: pal(['#3a3a40', '#6a6a72', '#9a9aa2', '#c8c8d0']) };
const EYEC = { rojo: '#c81e30', azul: '#2a64d4', verde: '#22a04a', dorado: '#e0a01a', violeta: '#8a3ad0', cafe: '#6e3c1c', brillo: '#ff3a3a', hielo: '#7ae0ff', vacio: '#ffe060', gris: '#7a8494', turquesa: '#1ab8b0', rosa: '#e85a9a', ambar: '#d87a12', negro: '#2a2230', blanco: '#d8e4f0', naranja: '#f07a1a', celeste: '#6ac8ff' };
const TIERP = [null, null, pal(['#3a1a0e', '#6a3418', '#9a5228', '#c87a3e', '#eaa868']), pal(['#1e1e24', '#383a44', '#565a66', '#7a7e8c', '#a4a8b4']), pal(['#141824', '#26304a', '#3a4a6e', '#56688e', '#7c92b6']), pal(['#3a3e48', '#646a78', '#9098a8', '#bcc4d2', '#e8eef6']), pal(['#4a2e0c', '#7a5014', '#ae7a20', '#dcaa36', '#fbe07a']), pal(['#0c3a40', '#14626a', '#22909a', '#46c0c8', '#a0f0f0']), pal(['#24103a', '#3e1c62', '#5e2c8e', '#844cb8', '#b88ae0']), pal(['#3a0a24', '#6a1440', '#a02060', '#d84a8a', '#ff9ac8']), pal(['#2a0606', '#5a0e0a', '#8e1a10', '#c43a1c', '#f2763a']), pal(['#3a3010', '#6a5a20', '#a89038', '#e0cc68', '#fffacc'])];
const P5 = a => pal(a);
// v4.2: estructura de la cara estilo chibi (ojos bajo el flequillo, boca y flequillo relativos al centro de la cabeza, volumen del pelo)
const FACE = { ey: 2, mouth: 4, bang: 2.5, vol: 1.1, lift: 2 };
const OUT = {
  knight: { main: P5(['#121219', '#22253a', '#363a54', '#525a7a', '#7880a4']), sec: P5(['#3a0812', '#6a1220', '#9a1c2c', '#c83444', '#e8606c']), cloth: P5(['#0e0e14', '#1a1a24', '#262634', '#363648', '#4a4a60']) },
  robe: { main: P5(['#160f30', '#251a52', '#382a76', '#52429a', '#6e5ebc']), sec: GOLD.slice(1), cloth: P5(['#2a1a10', '#4a2e1a', '#6a4426', '#8a5a34', '#a87444']) },
  ranger: { main: P5(['#10281a', '#1a4026', '#265a32', '#367842', '#4e9656']), sec: P5(['#2a1a0e', '#4a2e16', '#6a4422', '#8a5c32', '#a87644']), cloth: P5(['#8a7a5a', '#b4a47e', '#d4c69c', '#ece2c0', '#fffaea']) },
  rogue: { main: P5(['#100c14', '#1c1622', '#2a2234', '#3c3248', '#544862']), sec: P5(['#4a0810', '#7a121e', '#b01e2e', '#d83a4a', '#f26a72']), cloth: P5(['#1a1414', '#2a2020', '#3a2e2c', '#4e3e3a', '#66524c']) },
};
const BODYP = {
  normal: { fw: 48, fh: 48, hrx: 7.5, hry: 8, tw: 10, th: 8, lh: 8, lw: 3, aw: 2, al: 6 },
  small: { fw: 40, fh: 40, hrx: 6.2, hry: 5.8, tw: 8, th: 6, lh: 5, lw: 2, aw: 2, al: 5 },
  big: { fw: 64, fh: 64, hrx: 7.5, hry: 7, tw: 16, th: 12, lh: 9, lw: 5, aw: 4, al: 10 },
  huge: { fw: 88, fh: 88, hrx: 9.5, hry: 8.5, tw: 22, th: 17, lh: 12, lw: 7, aw: 6, al: 14 },
};
const ANIMS = { idle: [0, 2], walk: [2, 4], atk: [6, 4], cast: [10, 2], hurt: [12, 1], chop: [13, 3], mine: [16, 3], fish: [19, 2], gather: [21, 2], dead: [23, 1] };
const NFR = 24;
function srect(p, x, y, w, h, P, flat) {
  x = Math.round(x); y = Math.round(y);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { let v = 2; if (!flat) { if (i === 0 && w > 2) v = 3; if (i === w - 1 && w > 1) v = 1; if (j === h - 1 && h > 2) v = Math.min(v, 1); } p.set(x + i, y + j, P[v]); }
}
function thick(p, x0, y0, x1, y1, w, P) { const dx = x1 - x0, dy = y1 - y0, L = Math.max(1, Math.hypot(dx, dy)), nx = -dy / L, ny = dx / L; for (let k = 0; k < w; k++) { const o = k - (w - 1) / 2; p.line(x0 + nx * o, y0 + ny * o, x1 + nx * o, y1 + ny * o, P[k === 0 ? 3 : k === w - 1 ? 1 : 2]); } }
// ---------- weapons ----------
function drawWeapon(p, W, hx, hy, ang, phase) {
  if (!W || !W.k) return;
  const tp = TIERP[W.tier] || TIERP[3], ca = Math.cos(ang), sa = Math.sin(ang), pt = (d, o = 0) => [hx + ca * d - sa * o, hy + sa * d + ca * o];
  const k = W.k;
  if (k === 'sword' && W.ws && WS[W.ws]) { drawStyledBlade(p, pt, WS[W.ws], 1); return; }
  if (k === 'lute') {
    const bc = W.tier <= 1 ? WOOD : tp, wd = pal(['#3a1e0e', '#5e3418', '#8a5428', '#b0783a', '#d8a060']);
    for (let d = 2; d <= 11; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), wd[d % 2 ? 1 : 2]); const [x2, y2] = pt(d, 1); p.set(Math.round(x2), Math.round(y2), wd[0]); }
    for (let o = -1; o <= 2; o++) { const [x, y] = pt(12, o); p.set(Math.round(x), Math.round(y), bc[o === -1 || o === 2 ? 4 : 2]); }
    const [bx, by] = pt(-1, 0.5); p.ball(bx, by, 4, 3.4, [wd[1], wd[2], wd[3], wd[4]]); const [rx, ry] = pt(-1, 0.5); p.set(Math.round(rx), Math.round(ry), C('#1a0e06')); p.set(Math.round(rx) + 1, Math.round(ry), C('#1a0e06'));
    for (let d = -3; d <= 1; d++) { const [x, y] = pt(d, -2.6); p.set(Math.round(x), Math.round(y), bc[3]); const [x2, y2] = pt(d, 3.6); p.set(Math.round(x2), Math.round(y2), bc[2]); }
    for (let d = -3; d <= 11; d += 2) { const [x, y] = pt(d, 0.5); if (d > 1) p.set(Math.round(x), Math.round(y), C('#f0e8d0')); }
    if (W.tier >= 6) { const [gx, gy] = pt(-3, 0.5); p.set(Math.round(gx), Math.round(gy), bc[4]); }
    if (phase) { const [nx, ny] = pt(4, -5); p.set(Math.round(nx), Math.round(ny), C('#ffd040')); p.set(Math.round(nx), Math.round(ny) - 1, C('#ffd040')); p.set(Math.round(nx) + 1, Math.round(ny) - 2, C('#ffd040')); }
    return;
  }
  if (k === 'scythe') {
    const bl = W.tier <= 1 ? IRON : tp, sh = pal(['#120c10', '#24181e', '#3a2a30', '#54404a', '#705a64']), glow = W.tier >= 6;
    for (let d = -7; d <= 17; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), sh[d % 4 === 0 ? 3 : 2]); const [x2, y2] = pt(d, 1); p.set(Math.round(x2), Math.round(y2), sh[1]); }
    for (const d of [-1, 9]) { const [x, y] = pt(d, -1); p.set(Math.round(x), Math.round(y), bl[3]); const [x2, y2] = pt(d, 2); p.set(Math.round(x2), Math.round(y2), bl[3]); }
    for (let o = 1; o <= 11; o++) { const back = 0.06 * o * o, w = o < 3 ? 3 : o < 8 ? 2 : 1; for (let q = 0; q < w; q++) { const [x, y] = pt(17 - back - q, -o); p.set(Math.round(x), Math.round(y), q === 0 ? bl[4] : q === w - 1 ? bl[1] : bl[3]); } }
    const [hx2, hy2] = pt(18, 0); p.set(Math.round(hx2), Math.round(hy2), bl[4]);
    if (glow) { for (const o of [3, 6, 9]) { const [x, y] = pt(17 - 0.06 * o * o - 1, -o); p.set(Math.round(x), Math.round(y), C(W.tier >= 12 ? '#9ad8ff' : '#5ab0ff')); } const [gx, gy] = pt(16, 1); p.set(Math.round(gx), Math.round(gy), C('#7ac8ff')); }
    return;
  }
  if (k === 'sword' || k === 'greatsword') {
    const L = k === 'greatsword' ? 22 : 13, bw = k === 'greatsword' ? 3 : 2, bl = W.tier <= 1 ? pal(['#3a2a1e', '#6a5038', '#8a6a48', '#a88660', '#c8a47a']) : tp;
    for (let d = 2; d <= L; d++) { for (let o = 0; o < bw; o++) { const [x, y] = pt(d, o - (bw - 1) / 2); p.set(Math.round(x), Math.round(y), o === 0 ? bl[4] : o === bw - 1 ? bl[1] : bl[3]); } }
    const [tx, ty] = pt(L + 1); p.set(Math.round(tx), Math.round(ty), bl[4]);
    for (let o = -3; o <= 3; o++) { const [x, y] = pt(1, o); p.set(Math.round(x), Math.round(y), GOLD[o === -3 || o === 3 ? 2 : 4]); }
    for (let d = -3; d <= 0; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), WOOD[d === -3 ? 4 : 2]); }
  } else if (k === 'staff' || k === 'cane' || k === 'spear') {
    const len = k === 'cane' ? 12 : 22, back = k === 'cane' ? 2 : 7;
    for (let d = -back; d <= len - back; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), WOOD[d % 4 === 0 ? 2 : 3]); const [x2, y2] = pt(d, 1); p.set(Math.round(x2), Math.round(y2), WOOD[1]); }
    const [ox, oy] = pt(len - back + 2);
    if (k === 'staff') { const oc = W.orb ? pal(W.orb) : tp; p.ball(ox, oy, 2.6, 2.6, [oc[1], oc[2], oc[3], oc[4]]); p.set(Math.round(ox - 1), Math.round(oy - 1), C('#ffffff')); if (phase) { p.set(Math.round(ox), Math.round(oy - 4), oc[4]); p.set(Math.round(ox + 3), Math.round(oy), oc[4]); p.set(Math.round(ox - 3), Math.round(oy + 1), oc[3]); } }
    else if (k === 'spear') { for (let d = 0; d < 5; d++) { const [x, y] = pt(len - back + d); p.set(Math.round(x), Math.round(y), tp[d < 2 ? 3 : 4]); } const [a1, b1] = pt(len - back, 1.5), [a2, b2] = pt(len - back, -1.5); p.set(Math.round(a1), Math.round(b1), tp[2]); p.set(Math.round(a2), Math.round(b2), tp[3]); }
  } else if (k === 'bow') {
    const pull = phase || 0, bc = W.tier <= 1 ? WOOD : tp;
    for (let t = -8; t <= 8; t++) { const curve = 3.2 * (1 - (t / 8) * (t / 8)); const [x, y] = pt(curve + 1, t); p.set(Math.round(x), Math.round(y), bc[Math.abs(t) < 2 ? 4 : 3]); const [x2, y2] = pt(curve, t); p.set(Math.round(x2), Math.round(y2), bc[1]); }
    const [ax1, ay1] = pt(1, -8), [ax2, ay2] = pt(1, 8), [mx, my] = pt(1 - pull * 4, 0); const sc = C('#e8e0d0'); p.line(ax1, ay1, mx, my, sc); p.line(mx, my, ax2, ay2, sc);
    if (pull) { for (let d = -pull * 4 + 1; d < 9; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), d > 6 ? C('#e8e8f0') : WOOD[4]); } }
  } else if (k === 'dagger') {
    const bl = W.tier <= 1 ? IRON : tp; for (let d = 1; d <= 7; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), bl[d === 7 ? 4 : 3]); const [x2, y2] = pt(d, 0.9); if (d < 6) p.set(Math.round(x2), Math.round(y2), bl[1]); } const [g1, g2] = pt(0, -1.5), [g3, g4] = pt(0, 1.5); p.set(Math.round(g1), Math.round(g2), GOLD[3]); p.set(Math.round(g3), Math.round(g4), GOLD[3]); const [h1, h2] = pt(-2); p.set(Math.round(h1), Math.round(h2), WOOD[2]);
  } else if (k === 'axe' || k === 'pick' || k === 'club' || k === 'bigaxe') {
    const L = k === 'bigaxe' ? 18 : 11; for (let d = -2; d <= L; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), WOOD[d % 3 === 0 ? 2 : 3]); }
    const hc = W.tier ? tp : IRON;
    if (k === 'axe' || k === 'bigaxe') { const s = k === 'bigaxe' ? 2 : 1; for (let d = L - 3 * s; d <= L; d++) for (let o = 1; o <= 4 * s; o++) { const [x, y] = pt(d, o); p.set(Math.round(x), Math.round(y), hc[o >= 4 * s - 1 ? 4 : o === 1 ? 1 : 3]); } }
    else if (k === 'pick') { for (let o = -5; o <= 5; o++) { const bend = Math.abs(o) * 0.35; const [x, y] = pt(L - bend, o); p.set(Math.round(x), Math.round(y), hc[Math.abs(o) > 3 ? 4 : 3]); } }
    else { for (let d = L - 4; d <= L + 1; d++) for (let o = -2; o <= 2; o++) { const [x, y] = pt(d, o); p.set(Math.round(x), Math.round(y), WOOD[Math.abs(o) === 2 ? 1 : 3]); } }
  } else if (k === 'shovel') {
    for (let d = -2; d <= 12; d++) { const [x, y] = pt(d); p.set(Math.round(x), Math.round(y), WOOD[d % 3 === 0 ? 2 : 3]); }
    const hc = W.tier ? tp : IRON; for (let d = 12; d <= 17; d++) for (let o = -2; o <= 2; o++) { if (d === 17 && Math.abs(o) === 2) continue; const [x, y] = pt(d, o); p.set(Math.round(x), Math.round(y), hc[o === -2 ? 4 : o === 2 ? 1 : 3]); }
  } else if (k === 'rod') {
    for (let d = -2; d <= 20; d++) { const [x, y] = pt(d, d > 10 ? (d - 10) * (phase ? 0.35 : 0.08) : 0); p.set(Math.round(x), Math.round(y), d < 4 ? WOOD[2] : C('#c8a870')); } const [rx, ry] = pt(1, 1.5); p.set(Math.round(rx), Math.round(ry), IRON[4]);
  }
}
// ---------- pose ----------
function poseFor(dir, anim, f, L) {
  const ps = { bob: 0, lfx: 0, lfy: 0, rfx: 0, rfy: 0, lax: 0, lay: 0, rax: 0, ray: 0, wang: null, whand: 'r', wph: 0, crouch: 0, lean: 0, eyes: 'open', armsUp: 0, sway: 0 };
  const side = dir === 'left' || dir === 'right';
  const wk = L.weapon && L.weapon.k;
  if (anim === 'idle') { ps.bob = f % 2; ps.sway = f; }
  if (anim === 'walk') {
    const ph = [0, 1, 2, 1][f];
    ps.bob = f % 2 === 1 ? -1 : 0; ps.sway = f % 2;
    if (side) { const s = [-3, 0, 3, 0][f]; ps.lfx = s; ps.rfx = -s; ps.lfy = f === 1 ? -1 : 0; ps.rfy = f === 3 ? -1 : 0; ps.lax = -s * 0.7; ps.rax = s * 0.7; }
    else { const a = f === 0 ? 1 : f === 2 ? -1 : 0; ps.lfy = a < 0 ? -2 : 0; ps.rfy = a > 0 ? -2 : 0; ps.lay = a > 0 ? 1 : a < 0 ? -1 : 0; ps.ray = -ps.lay; }
  }
  const wpRest = { down: 1.9, up: -1.9, left: 2.6, right: 0.54 };
  const isTool = anim === 'chop' || anim === 'mine' || anim === 'fish';
  const k = isTool ? (anim === 'chop' ? 'axe' : anim === 'mine' ? 'pick' : 'rod') : wk;
  if (anim === 'atk' || anim === 'chop' || anim === 'mine') {
    const heavy = anim === 'mine';
    const arcs = {
      down: [[7, -3, -1.2], [5, 2, 0.4], [-6, 3, 2.1], [-6, 1, 2.4]], up: [[-6, -3, -2.2], [0, -4, -1.6], [6, -2, -0.6], [6, 0, -0.3]],
      left: [[4, -4, -0.9], [-4, -3, -2.6], [-6, 2, 2.6], [-5, 1, 2.2]], right: [[-4, -4, -2.24], [4, -3, -0.54], [6, 2, 0.54], [5, 1, 0.9]]
    };
    let seq = arcs[dir]; if (heavy) seq = { down: [[2, -6, -1.57], [2, -4, -1.0], [2, 2, 1.4]], up: [[0, -6, -1.57], [0, -5, -1.4], [0, -3, -1.2]], left: [[3, -6, -1.1], [-3, -4, -2.4], [-6, 1, 2.8]], right: [[-3, -6, -2.0], [3, -4, -0.7], [6, 1, 0.3]] }[dir];
    if (wk === 'bow' && anim === 'atk') { const a = { down: 1.57, up: -1.57, left: 3.14, right: 0 }[dir]; const dx = Math.round(Math.cos(a) * 4), dy = Math.round(Math.sin(a) * 4); seq = [[dx, dy, a], [dx, dy, a], [dx, dy, a], [dx, dy, a]]; ps.wph = [1, 2, 0, 0][f]; }
    if (wk === 'lute' && anim === 'atk') { const fx = { down: 2, up: 2, left: -3, right: 3 }[dir]; seq = [[fx, -1, -0.7], [fx, 0, -0.45], [fx, -1, -0.75], [fx, 0, -0.5]]; ps.wph = f & 1; ps.lax = fx > 0 ? fx - 3 : fx + 3; ps.lay = -3; }
    if (wk === 'staff' && anim === 'atk') { const a = { down: 1.2, up: -1.9, left: 2.5, right: 0.64 }[dir]; const fx = { down: 4, up: 3, left: -4, right: 4 }[dir]; seq = [[fx * 0.3, -4, -1.57], [fx, 0, a - 0.8], [fx, 1, a - 0.6], [fx * 0.5, 0, -1.4]]; ps.wph = f === 1 || f === 2 ? 1 : 0; }
    if (wk === 'dagger' && anim === 'atk') { const a = { down: 1.57, up: -1.57, left: 3.14, right: 0 }[dir]; const dx = Math.cos(a), dy = Math.sin(a); seq = [[dx * 2, dy * 2, a], [dx * 6, dy * 5, a], [dx * 2, dy * 2, a], [dx * 6, dy * 5, a]]; ps.dual = [0, 0, 1, 1][f]; }
    const s = seq[Math.min(f, seq.length - 1)];
    ps.rax = s[0]; ps.ray = s[1]; ps.wang = s[2]; ps.lean = (f === 1 ? 1 : 0);
    if (anim !== 'atk') ps.toolK = k;
  } else if (anim === 'cast') { ps.armsUp = 1; ps.rax = { down: 3, up: 0, left: -4, right: 4 }[dir]; ps.ray = -5 - f; ps.lax = { down: -3, up: 0, left: -2, right: 2 }[dir]; ps.lay = -5 - f; ps.wang = -1.57; ps.wph = 1; }
  else if (anim === 'hurt') { ps.eyes = 'hurt'; ps.lean = -1; ps.bob = 1; ps.lay = -1; ps.ray = -1; }
  else if (anim === 'fish') { const a = { down: 0.9, up: -1.2, left: -2.6, right: -0.5 }[dir]; ps.rax = { down: 2, up: 2, left: -3, right: 3 }[dir]; ps.ray = -1 + f; ps.wang = a + (f ? 0.25 : 0); ps.toolK = 'rod'; ps.wph = f; }
  else if (anim === 'gather') { ps.crouch = 2 + f; ps.rax = { down: 1, up: 0, left: -3, right: 3 }[dir]; ps.ray = 3; ps.lax = ps.rax - 1; ps.lay = 3; }
  else if (anim === 'hug' || anim === 'kiss') { const sv = dir === 'left' || dir === 'right', fw = { down: 2, up: -2, left: -5, right: 5 }[dir]; ps.noWeapon = 1; ps.wang = 0;
    if (anim === 'hug') { ps.rax = fw; ps.lax = sv ? fw + (dir === 'left' ? 1 : -1) : -fw; ps.ray = -3; ps.lay = -2; ps.lean = 1; ps.bob = f ? -1 : 0; }
    else { ps.rax = Math.round(fw * 0.6); ps.lax = sv ? ps.rax : -ps.rax; ps.ray = -5; ps.lay = -5; ps.lean = 2; ps.eyes = 'closed'; ps.bob = f ? -1 : 0; } }
  if (ps.wang === null && k) { ps.wang = wpRest[dir]; if (k === 'staff' || k === 'spear' || k === 'cane' || k === 'scythe') ps.wang = -1.57; if (k === 'lute') ps.wang = { down: -0.7, up: -2.4, left: -2.4, right: -0.7 }[dir]; if (k === 'bow') ps.wang = { down: 3.14, up: 0, left: 3.14, right: 0 }[dir]; }
  if (!ps.toolK) ps.toolK = isTool ? k : wk;
  return ps;
}
// ---------- the body ----------
function drawHumanoid(p, L, dir, anim, f) {
  const B = BODYP[L.body || 'normal'], ps = poseFor(dir, anim, f, L);
  const side = dir === 'left' || dir === 'right', flip = dir === 'right', up = dir === 'up';
  const SK = L.skin || SKINS[0], HP = L.hair, OF = L.outfit || 'tunic';
  const main = L.main || OUT.knight.main, sec = L.sec || OUT.knight.sec, cloth = L.cloth || OUT.knight.cloth;
  const cx = p.w >> 1, base = p.h - 4 + ps.crouch * 0;
  const legTop = base - B.lh + ps.crouch, torsoTop = legTop - B.th + ps.bob + ps.crouch, hy = torsoTop - B.hry + 1 - (B === BODYP.normal ? FACE.lift : 0), hx = cx + (side ? -1 : 0) + (side ? (dir === 'left' ? -ps.lean : ps.lean) : 0);
  const tx0 = cx - (side ? B.tw - 2 : B.tw) / 2, tw = side ? B.tw - 2 : B.tw;
  const TG = p.t ? (k => { p.tg = k; }) : (() => { });   // v4.0 capas para el detalle HD
  p.meta = { cx, torsoTop, tx0, tw, th: B.th, legTop, base, dir, side, up, fem: L.g === 'f' || OF === 'dress' || OF === 'witch', d: dir === 'left' ? -1 : 1, hx, hy, anim, f, npc: 1 };
  const longHair = L.hairStyle === 'long' && HP, tool = ps.toolK, W = (anim === 'chop' || anim === 'mine' || anim === 'fish') ? { k: tool, tier: L.toolTier || 2 } : L.weapon;
  // ---- helpers
  const drawLegs = () => { TG(1);
    const lw = B.lw, robe = OF === 'robe' || OF === 'dress' || OF === 'witch';
    const legs = side ? [[cx - 1 + (dir === 'left' ? 1 : -1) * ps.rfx * -1, ps.rfy, true], [cx - 1 + (dir === 'left' ? 1 : -1) * ps.lfx * -1, ps.lfy, false]] : [[cx - Math.ceil(B.tw / 2) + 1, ps.lfy, false], [cx + Math.floor(B.tw / 2) - lw, ps.rfy, false]];
    legs.forEach(([lx, ly, back], i) => {
      const xx = Math.round(side ? lx - (lw >> 1) : lx), bootP = OF === 'knight' || OF === 'guard' || OF === 'darkknight' ? main : OF === 'skeleton' ? SK : cloth;
      for (let y = legTop; y < base + ly; y++) { const isBoot = y >= base + ly - (OF === 'knight' ? 5 : 3); const P = isBoot ? (OF === 'skeleton' ? SK : (L.boots || bootP)) : (OF === 'skeleton' || OF === 'goblin' || OF === 'orc' && !L.pants ? SK : (L.pants || cloth)); for (let i2 = 0; i2 < lw; i2++) p.set(xx + i2, y, back ? P[1] : P[i2 === 0 ? 3 : i2 === lw - 1 ? 1 : 2]); }
      if (side) { p.set(xx + (dir === 'left' ? -1 : lw), base + ly - 1, (L.boots || cloth)[1]); }
    });
  };
  const drawTorso = () => { TG(2);
    const ty = torsoTop, th = B.th;
    if (OF === 'skeleton') { for (let y = ty; y < ty + th; y++) { if (y % 2 === 0) p.hl(tx0 + 1, y, tw - 2, SK[2]); p.set(cx - 1, y, SK[3]); } p.hl(tx0, ty + th - 1, tw, SK[1]); return; }
    srect(p, tx0, ty, tw, th, OF === 'goblin' || OF === 'orc' && L.bare ? SK : main);
    if (OF === 'knight' || OF === 'guard' || OF === 'darkknight') {
      if (!up) { p.hl(tx0 + 1, ty + 1, tw - 2, main[4]); p.vl(cx - (side ? 1 : 0), ty + 2, th - 3, main[3]); }
      p.hl(tx0, ty + th - 3, tw, sec[2]); p.hl(tx0, ty + th - 2, tw, sec[1]); if (!up && !side) p.set(cx, ty + th - 3, GOLD[4]);
      // pauldrons
      if (!side) { for (const sx of [tx0 - 2, tx0 + tw - 1]) { p.ball(sx + 1.5, ty + 1.5, 2.2, 2, main.slice(1)); } }
      else p.ball(cx + (dir === 'left' ? 1 : -1), ty + 1.5, 2.5, 2, main.slice(1));
      // skirt plates
      for (let i = 0; i < tw; i++) p.set(tx0 + i, ty + th, i % 3 === 2 ? main[0] : main[2]);
    } else if (OF === 'robe' || OF === 'witch' || OF === 'royal' || OF === 'elder' || OF === 'dress') {
      const hem = base - 1, flare = side ? 1 : 2;
      for (let y = ty + th - 1; y <= hem; y++) { const t = (y - (ty + th)) / (hem - ty - th + 1); const ex = Math.round(flare * t); for (let x = tx0 - ex; x < tx0 + tw + ex; x++) p.set(x, y, main[x === tx0 - ex ? 3 : x === tx0 + tw + ex - 1 ? 1 : 2 + ((x + (anim === 'walk' ? f : 0)) % 4 === 0 ? -1 : 0)]); }
      p.hl(tx0 - flare, hem, tw + flare * 2, sec[2]); if (!up) p.vl(cx - (side ? 1 : 0), ty + 1, hem - ty - 1, sec[3]);
      p.hl(tx0, ty + th - 2, tw, L.sash || sec[2]);
      if (!up && !side) { p.set(cx - 1, ty, SK[2]); p.set(cx, ty, SK[2]); p.set(cx, ty + 1, SK[1]); }
    } else if (OF === 'ranger' || OF === 'tunic' || OF === 'apron' || OF === 'smith' || OF === 'sailor') {
      if (OF === 'sailor') for (let y = ty + 1; y < ty + th - 2; y += 2) p.hl(tx0, y, tw, C('#2a4a8a'));
      if (OF === 'ranger') { if (!up) { p.vl(cx - 2, ty, th - 1, sec[3]); p.vl(cx + 1, ty, th - 1, sec[1]); } }
      if (OF === 'apron' || OF === 'smith') { if (!up) { const ap = OF === 'smith' ? pal(['#2a1a10', '#4a2e1a', '#6a4426', '#8a5a34', '#a87444']) : pal(['#8a8270', '#c8c0a8', '#e8e2d2', '#f8f4ea', '#ffffff']); srect(p, tx0 + 2, ty + 2, tw - 4, th + 2, ap); } }
      p.hl(tx0, ty + th - 2, tw, (L.belt || sec)[1]); if (!up && !side) p.set(cx, ty + th - 2, GOLD[3]);
      if (!up && !side && OF !== 'smith') { p.set(cx - 1, ty, SK[2]); p.set(cx, ty, SK[2]); }
    } else if (OF === 'rogue') {
      p.hl(tx0, ty + th - 2, tw, sec[1]); if (!up) { p.line(tx0, ty, tx0 + tw - 1, ty + th - 3, cloth[3]); }
    } else if (OF === 'orc' || OF === 'goblin') {
      if (!up && !side) { p.ball(cx - 2, ty + 3, 2, 2, SK.slice(1)); p.ball(cx + 2, ty + 3, 2, 2, SK.slice(1)); }
      p.hl(tx0, ty + th - 3, tw, cloth[1]); p.hl(tx0, ty + th - 2, tw, cloth[2]); for (let i = 0; i < tw; i += 2) p.vl(tx0 + i, ty + th - 1, 3, cloth[i % 4 ? 1 : 2]);
      if (OF === 'orc' && L.armor) { srect(p, tx0 + 1, ty, tw - 2, 5, L.armor); p.ball(tx0, ty + 1, 3, 2.5, L.armor.slice(1)); p.ball(tx0 + tw - 1, ty + 1, 3, 2.5, L.armor.slice(1)); }
    }
    if (L.btS && OF !== 'skeleton') bodyTorsoShape(p, L.btS, { tx0, ty: torsoTop, tw, th: B.th, side, up, fem: L.g === 'f' || OF === 'dress', d: dir === 'left' ? -1 : 1, m: OF === 'goblin' || OF === 'orc' && L.bare ? SK : main, legTop });
  };
  const handC = (OF === 'knight' || OF === 'darkknight' || OF === 'guard') ? main[3] : OF === 'skeleton' ? SK[2] : SK[2];
  const sleeve = OF === 'robe' || OF === 'witch' ? main : OF === 'knight' || OF === 'guard' || OF === 'darkknight' ? main : OF === 'ranger' ? cloth : OF === 'smith' || OF === 'goblin' || OF === 'orc' ? SK : OF === 'skeleton' ? SK : main;
  const drawArm = (sx, sy, dx, dy, back) => { TG(3);
    const hx2 = sx + dx, hy2 = sy + B.al + dy; const aw = B.aw;
    if (OF === 'skeleton') { p.line(sx, sy, hx2, hy2, back ? SK[1] : SK[2]); p.set(Math.round(hx2), Math.round(hy2), SK[3]); return [hx2, hy2]; }
    for (let k = 0; k < aw; k++) p.line(sx + k, sy, hx2 + k, hy2 - 1, back ? sleeve[1] : sleeve[k === 0 ? 3 : 2]);
    p.rect(Math.round(hx2), Math.round(hy2) - 1, aw, 2, back ? uMul(handC, 0.75) : handC);
    return [hx2 + aw / 2, hy2];
  };
  const drawCape = (front) => { TG(4);
    if (!L.cape) return; const co = L.cape.out, ci = L.cape.in; const top = torsoTop + 1, bot = base - 1 - (anim === 'walk' ? (f % 2) : 0);
    const trim = L.cape.trim;
    if (up) { for (let y = top; y <= bot; y++) { const t = (y - top) / (bot - top), half = Math.round(lerp(tw / 2, tw / 2 + 3, t)); for (let x = cx - half; x < cx + half; x++) { let c = co[3]; if (x <= cx - half + 1) c = co[4]; if (x >= cx + half - 2) c = co[1]; if ((x - cx + 40 + (ps.sway || 0)) % 4 === 0 && t > 0.2) c = co[2]; if (trim && (x === cx - half || x === cx + half - 1 || y >= bot - 1)) c = trim[y >= bot - 1 ? 2 : 1]; if (y === bot && (x + f) % 3 === 0) continue; p.set(x, y, c); } } p.hl(cx - tw / 2 - 1, top, tw + 2, sec[2]); }
    else if (side) { const d = dir === 'left' ? 1 : -1; for (let y = top; y <= bot; y++) { const t = (y - top) / (bot - top); const w2 = Math.round(lerp(3, 6, t)) + (anim === 'walk' ? (f % 2) : 0); const x0 = cx + d * 2; for (let i = 0; i < w2; i++) { const x = x0 + d * i; p.set(x, y, i === w2 - 1 ? co[1] : i === 0 ? ci[2] : co[2]); } } }
    else { for (let y = top + 2; y <= bot; y++) { for (const sgn of [-1, 1]) { const x = cx + sgn * (tw / 2 + 1) - (sgn > 0 ? 1 : 0); const ex = Math.round((y - top) / 6); for (let i = 0; i <= ex; i++) p.set(x + sgn * i, y, i === ex ? co[1] : ci[2]); } } }
  };
  const drawScarf = () => { TG(9);
    if (!L.scarf) return; const sc = L.scarf, y0 = torsoTop;
    if (up) { for (let y = y0; y < y0 + 12; y++) { const xx = cx + 2 + Math.round(Math.sin((y + f * 2) * 0.6) * 1); p.set(xx, y, sc[2]); p.set(xx + 1, y, sc[1]); p.set(xx - 1, y, sc[3]); } p.hl(cx - 5, y0, 10, sc[2]); }
    else if (side) { const d = dir === 'left' ? 1 : -1; for (let k = 0; k < 9; k++) { const xx = cx + d * (3 + k), yy = y0 + 1 + Math.round(k * 0.4 + Math.sin(k * 0.9 + f * 1.5) * 1); p.set(xx, yy, sc[2]); p.set(xx, yy + 1, sc[1]); } }
  };
  const drawBackHair = () => { TG(6);
    if (!longHair) return;
    const top = hy - 3, bot = torsoTop + B.th + 1 + (OF === 'robe' ? 0 : 1);
    for (let y = top; y <= bot; y++) { const t = (y - top) / (bot - top); const half = up ? Math.round(lerp(7, 4.5, t)) : Math.round(lerp(8.5, 7, t)); for (let x = hx - half; x <= hx + half - (side ? 0 : 1); x++) { if (side && (dir === 'left' ? x < hx - 1 : x > hx + 1)) continue; if (y === bot && (x + y) % 2) continue; let c = x < hx ? HP[2] : HP[1]; if ((x - hx + 30) % 3 === 0) c = HP[x < hx ? 1 : 0]; if (x === hx - half) c = HP[3]; if (up && y > top + 2 && y < top + 5 && x < hx + 2) c = HP[3]; p.set(x, y, c); } }
    if (up && L.ponytail) { for (let y = hy - 5; y < hy + 15; y++) { const w2 = y < hy ? 3 : 2; for (let x = hx - 1; x < hx - 1 + w2; x++) p.set(x + (y > hy + 8 ? (f % 2) : 0), y, x === hx - 1 ? HP[2] : HP[1]); } p.rect(hx - 2, hy - 6, 4, 2, sec[3] || C('#c02030')); p.set(hx - 3, hy - 7, sec[2]); p.set(hx + 2, hy - 7, sec[2]); }
  };
  const drawHead = () => { TG(5);
    const rx = B.hrx, ry = B.hry, sk = OF === 'skeleton' ? MSKIN.bone : SK, BTS = L.btS || {};   // v4.4 estructura de cuerpo (6zw_bodies)
    // skin
    for (let y = Math.floor(hy - ry); y <= Math.ceil(hy + ry); y++) for (let x = Math.floor(hx - rx); x <= Math.ceil(hx + rx); x++) { const dx = (x + 0.5 - hx) / rx, dy = (y + 0.5 - hy) / ry; if (BTS.jaw && dy > 0 ? Math.pow(Math.abs(dx), BTS.jaw) + Math.pow(dy, BTS.jaw) > 1 : dx * dx + dy * dy > 1) continue; let v = 2; if (dx > 0.45 || dy > 0.6) v = 1; if (dx < -0.4 && dy < 0) v = 3; p.set(x, y, sk[v]); }
    if (up) return;
    const ey = Math.round(hy) + (L.body === 'big' || L.body === 'huge' || L.body === 'small' ? 0 : FACE.ey), ec = C(EYEC[L.eyes] || EYEC.azul), ed = uMul(ec, 0.5), dark = C('#1a1220');
    if (OF === 'skeleton') { const sx = side ? [hx - 4] : [hx - 4, hx + 2]; for (const x of sx) { p.rect(x, ey - 1, 3, 3, C('#1a0e14')); p.set(x + 1, ey, C(EYEC[L.eyes] || '#ff3030')); } p.hl(hx - 3, ey + 3, side ? 3 : 6, C('#3a3028')); for (let i = 0; i < (side ? 3 : 6); i += 2) p.set(hx - 3 + i, ey + 4, C('#e0d8c2')); return; }
    const eyes = side ? [[dir === 'left' ? hx - 5 : hx + 3, 0]] : [[hx - 4 - (BTS.eg || 0), 0], [hx + 3 + (BTS.eg || 0), 1]];
    for (const [ex] of eyes) {   // v4.2 ojos 2x3 como los héroes
      if (ps.eyes === 'hurt') { p.set(ex, ey, dark); p.set(ex + 1, ey + 1, dark); p.set(ex, ey + 2, dark); continue; }
      if (ps.eyes === 'closed') { p.set(ex, ey + 1, dark); p.set(ex + 1, ey + 1, dark); continue; }
      if (L.mono) { p.rect(ex, ey, 2, 2, ec); continue; }
      if (BTS.eye) { bodyEye(p, BTS.eye, ex, ey, side ? (dir === 'left' ? ex - 1 : ex + 2) : (ex === eyes[0][0] ? ex - 1 : ex + 2), ec, HP ? HP[0] : dark, dark); continue; }
      p.set(ex, ey - 1, dark); p.set(ex + 1, ey - 1, dark); if (!side && (L.g === 'f' || OF === 'dress')) p.set(ex === hx - 4 ? ex - 1 : ex + 2, ey - 1, dark);
      p.set(ex, ey, C('#ffffff')); p.set(ex + 1, ey, ed); p.set(ex, ey + 1, ec); p.set(ex + 1, ey + 1, uMix(ed, dark, 0.5)); p.set(ex, ey + 2, uMix(ec, C('#ffffff'), 0.4)); p.set(ex + 1, ey + 2, ec);
    }
    const mo = FACE.mouth, mc = uMix(sk[1], C('#d06a6a'), 0.5);
    if (BTS.mw === 1 && !side) p.set(hx - 1, ey + mo, mc);
    else if (BTS.lip && !side) { const lc = uMix(sk[1], C('#d0485e'), 0.7); p.set(hx - 1, ey + mo, lc); p.set(hx, ey + mo, lc); }
    else if (!side) { p.set(hx - 1, ey + mo, mc); p.set(hx, ey + mo, uMix(mc, sk[2], 0.35)); if (L.blush !== false && BTS.blush !== 0) { p.set(hx - 6, ey + mo - 1, uMix(sk[2], C('#ef8a8a'), 0.55)); p.set(hx + 5, ey + mo - 1, uMix(sk[2], C('#ef8a8a'), 0.55)); } }
    else p.set(dir === 'left' ? hx - 6 : hx + 5, ey + mo, mc);
    if (L.tusks && !up) { p.set(hx - 2, ey + 3, C('#f0ead0')); p.set(hx + 2, ey + 3, C('#f0ead0')); p.set(hx - 2, ey + 2, C('#f0ead0')); p.set(hx + 2, ey + 2, C('#f0ead0')); }
    if (L.beard) { const bc = L.beard; for (let y = ey + 3; y < ey + 7; y++) for (let x = hx - 4 + (y - ey - 3) * 0.7; x <= hx + 4 - (y - ey - 3) * 0.7; x++) if (!side || (dir === 'left' ? x < hx + 1 : x > hx - 2)) p.set(Math.round(x), y, bc[(x + y) % 3 === 0 ? 1 : 2]); }
    if (L.mask) { const mw = side ? 8 : 13, mx = side ? (dir === 'left' ? hx - 7 : hx) : hx - 6; for (let y = ey + 3; y < ey + 7; y++) for (let x = mx; x < mx + mw; x++) { const dx = (x + 0.5 - hx) / B.hrx, dy = (y + 0.5 - hy) / B.hry; if (dx * dx + dy * dy > 1.05) continue; p.set(x, y, L.mask[y === ey + 3 ? 2 : 1]); } }
  };
  const drawHairFront = () => { TG(6);
    if (!HP) return;
    const nv = B === BODYP.normal ? FACE.vol : 0, rx = B.hrx + 1 + nv * 0.8, ry = B.hry + 0.6 + nv * 0.6, cyH = hy - 1.4 - nv * 0.4, style = L.hairStyle || 'short';
    for (let y = Math.floor(cyH - ry - 1); y <= Math.ceil(hy + ry + 4); y++) for (let x = Math.floor(hx - rx - 1); x <= Math.ceil(hx + rx + 1); x++) {
      const dx = (x + 0.5 - hx) / rx, dy = (y + 0.5 - cyH) / ry; let inside = dx * dx + dy * dy <= 1;
      if (style === 'spiky' && y < cyH - ry + 2 && (x % 3 === 0) && Math.abs(dx) < 0.8 && y > cyH - ry - 2) inside = true;
      if (!inside) {
        // side locks
        if (!up && (style === 'long' || style === 'bob') && y >= hy - 2 && y <= hy + (style === 'long' ? 6 : 3) && Math.abs(x + 0.5 - hx) > B.hrx - 1.5 && Math.abs(x + 0.5 - hx) < B.hrx + 1.2 && (!side || (dir === 'left' ? x > hx : x < hx))) inside = true;
        if (!inside) continue;
      }
      let isFace = false;
      if (!up) {
        const bang = Math.round(hy - 1.5 + ((Math.abs(x - hx) % 3 === 1) ? 1 : 0) + (style === 'long' ? 0.5 : 0) + (B === BODYP.normal ? FACE.bang : 0));
        if (side) { const fx = dir === 'left' ? x < hx - 1 : x > hx; if (fx && y >= bang) isFace = true; if ((dir === 'left' ? x < hx - 4 : x > hx + 3) && y >= bang - 1) isFace = true; }
        else if (y >= bang && Math.abs(x + 0.5 - hx) < B.hrx - 0.6) isFace = true;
        if (style === 'short' && !side && y >= hy + 1 + (B === BODYP.normal ? FACE.ey : 0)) isFace = true;
        if (style === 'short' && side && y >= hy + 1 + (B === BODYP.normal ? FACE.ey : 0) && (dir === 'left' ? x < hx + 2 : x > hx - 3)) isFace = true;
      }
      if (isFace) continue;
      let v = dx < 0.15 ? 2 : 1; const ny = (y + 0.5 - (cyH - ry)) / (ry * 2);
      if (ny > 0.1 && ny < 0.22 && dx < 0.45 && dx > -0.8) v = 3; if (ny > 0.22 && ny < 0.3 && dx < 0 && dx > -0.6) v = 2;
      if (dx > 0.6) v = 0; if (y > hy && (x % 3 === 0)) v = Math.max(0, v - 1);
      p.set(x, y, HP[v]);
    }
    if (!up && L.ponytail && side) { const d = dir === 'left' ? 1 : -1; for (let y = hy - 6; y < hy + 10; y++) { const xx = hx + d * (7 + Math.round((y - hy + 6) * 0.15)) + (y > hy + 4 ? (f % 2) * d : 0); p.set(xx, y, HP[1]); p.set(xx + d, y, HP[2]); } p.rect(hx + d * 6 - (d < 0 ? 2 : 0), hy - 7, 3, 2, sec[3] || C('#c02030')); }
    if (!up && !side && L.ponytail) { p.set(hx + 6, hy - 6, sec[3] || C('#c02030')); p.set(hx + 7, hy - 5, sec[2] || C('#c02030')); }
  };
  const drawHat = () => { if (typeof fitHeadLayer === 'function' && !p._fitHat && L.hat) { p._fitHat = 1; try { return fitHeadLayer(p, B, hx, hy, { k: 'npc' }, drawHat); } finally { p._fitHat = 0; } } TG(7);   // v4.5 el sombrero se ajusta a la cabeza de cada estructura
    const h = L.hat; if (!h) return; const top = hy - B.hry - 1;
    if (h === 'wizard') { const hc = L.hatC || main; const brimY = Math.round(hy - 3); p.hl(hx - 9, brimY, 18, hc[1]); p.hl(hx - 8, brimY - 1, 16, hc[2]); for (let y = 0; y < 11; y++) { const half = Math.round(lerp(6, 1, y / 11)); const lean = up ? 0 : Math.round(y * y / 30) * (side && dir === 'right' ? -1 : 1); for (let x = hx - half; x <= hx + half; x++) p.set(x + lean, brimY - 2 - y, hc[x === hx - half ? 3 : x === hx + half ? 1 : 2]); } p.hl(hx - 6, brimY - 2, 13, sec[2]); p.set(hx - 2, brimY - 3, sec[4]); }
    else if (h === 'hood') { const hc = L.hatC || main; for (let y = Math.floor(top); y <= hy + 3; y++) for (let x = hx - 8; x <= hx + 8; x++) { const dx = (x + 0.5 - hx) / 8, dy = (y + 0.5 - (hy - 1)) / 7.5; if (dx * dx + dy * dy > 1) continue; let face = false; if (!up) { if (side) face = (dir === 'left' ? x < hx - 1 : x > hx) && y > hy - 3; else face = Math.abs(x + 0.5 - hx) < 5 && y > hy - 3; } if (face) continue; p.set(x, y, hc[dx < -0.5 ? 3 : dx > 0.5 ? 1 : 2]); } if (!up) { p.hl(hx - 4, Math.round(hy - 3), side ? 4 : 9, hc[0]); } }
    else if (h === 'helmet' || h === 'horned') { const hc = L.hatC || IRON; for (let y = Math.floor(top); y <= hy + 1; y++) for (let x = hx - 8; x <= hx + 8; x++) { const dx = (x + 0.5 - hx) / 7.6, dy = (y + 0.5 - (hy - 1)) / 7; if (dx * dx + dy * dy > 1) continue; let face = !up && y > hy - 2 && (side ? (dir === 'left' ? x < hx : x > hx - 1) : Math.abs(x + 0.5 - hx) < 4.5); if (face) continue; p.set(x, y, hc[dx < -0.4 && dy < 0 ? 4 : dx > 0.5 ? 1 : 2]); } p.hl(hx - 7, Math.round(hy - 2), 15, hc[3]); if (!up && !side) p.vl(hx, Math.round(top) + 1, 5, hc[4]); if (h === 'horned') { for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { p.set(hx + s * (7 + Math.round(k * 0.5)), Math.round(top) + 3 - k, C('#e8e0c8')); p.set(hx + s * (8 + Math.round(k * 0.5)), Math.round(top) + 3 - k, C('#b8b098')); } } }
    else if (h === 'crown') { const y0 = Math.round(top) + 1; p.rect(hx - 5, y0, 11, 3, GOLD[3]); p.hl(hx - 5, y0, 11, GOLD[5]); for (const x of [-5, -2, 1, 4]) { p.set(hx + x, y0 - 1, GOLD[4]); p.set(hx + x + 1, y0 - 2, GOLD[4]); } p.set(hx, y0 + 1, C('#e02040')); }
    else if (h === 'straw') { const y0 = Math.round(hy - 4); p.ell(hx, y0 + 1, 10, 2.5, C('#c8a04a')); p.hl(hx - 9, y0 + 1, 19, C('#a8802a')); p.ell(hx, y0 - 2, 5.5, 3.5, C('#e0bc60')); p.hl(hx - 5, y0, 11, C('#a03020')); }
    else if (h === 'bandana') { const y0 = Math.round(hy - 5); for (let x = hx - 7; x <= hx + 7; x++) for (let y = y0; y < y0 + 3; y++) p.set(x, y, (L.hatC || sec)[y === y0 ? 3 : 2]); if (!side && !up) {} else { p.set(hx + (dir === 'left' ? 7 : -8), y0 + 3, (L.hatC || sec)[2]); p.set(hx + (dir === 'left' ? 8 : -9), y0 + 4, (L.hatC || sec)[1]); } }
    else if (h === 'chef') { p.ball(hx, hy - 9, 6, 4, pal(['#c8c8c8', '#f0f0f0', '#ffffff'])); p.rect(hx - 5, hy - 6, 11, 3, C('#f4f4f4')); }
  };
  const drawEars = () => { TG(5); if (L.ears !== 'pointy') return; for (const s of side ? [dir === 'left' ? 1 : -1] : [-1, 1]) { for (let k = 0; k < 4; k++) p.set(hx + s * (B.hrx + k), Math.round(hy) - k + 1, SK[k === 3 ? 3 : 2]); } };
  // shoulders / hands
  const shY = torsoTop + 1, shL = side ? cx - 1 : tx0 - B.aw, shR = side ? cx - 1 : tx0 + tw;
  let hands = {};
  const wHandFirst = up; // weapon behind body when facing up
  const drawWeaponNow = () => { TG(8); if (ps.noWeapon) return;
    if (!W || !W.k || ps.wang == null) return;
    const hh = hands.r || [cx, torsoTop + B.al]; drawWeapon(p, W, hh[0], hh[1], ps.wang, ps.wph);
    if (W.k === 'dagger' && hands.l) drawWeapon(p, W, hands.l[0], hands.l[1], ps.dual ? ps.wang : { down: 1.9, up: -1.9, left: 2.4, right: 0.7 }[dir], 0);
  };
  // ---- compose by direction
  if (up) {
    // hands precomputed for weapon behind
    hands.r = [shR + B.aw / 2 + ps.rax, shY + B.al + ps.ray]; hands.l = [shL + B.aw / 2 + ps.lax, shY + B.al + ps.lay];
    drawWeaponNow(); drawLegs(); drawTorso(); drawArm(shL, shY, ps.lax, ps.lay); drawArm(shR, shY, ps.rax, ps.ray); drawCape(); drawEars(); drawHead(); drawHairFront(); drawBackHair(); drawHat(); drawScarf();
  } else if (side) {
    const d = dir === 'left' ? -1 : 1;
    hands.l = drawArm(cx - 1 - d, shY, ps.lax, ps.lay, true);
    drawCape(); drawScarf(); drawBackHair(); drawLegs(); drawTorso(); drawEars(); drawHead(); drawHairFront(); drawHat();
    hands.r = drawArm(cx - 2, shY, ps.rax, ps.ray, false);
    drawWeaponNow();
  } else {
    drawBackHair(); drawCape(); drawLegs(); drawTorso(); hands.r = drawArm(shL, shY, ps.rax, ps.ray); hands.l = drawArm(shR, shY, ps.lax, ps.lay); drawEars(); drawHead(); drawHairFront(); drawHat(); drawWeaponNow();
  }
}
// build an atlas for a look. anims: list of anim names (default player set)
function buildAtlas(L, set, draw = drawHumanoid) {
  const B = BODYP[L.body || 'normal'], FW = B.fw, FH = B.fh; const anims = set || Object.keys(ANIMS); const N = set ? set.reduce((a, k) => a + ANIMS[k][1], 0) : NFR;
  const atlas = mkCanvas(FW * N, FH * 4), ax = atlas.getContext('2d'); const idx = {}; let col = 0;
  for (const a of anims) { idx[a] = col; col += ANIMS[a][1]; }
  DIRS.forEach((dir, di) => {
    for (const a of anims) for (let f = 0; f < ANIMS[a][1]; f++) {
      let p = new Pix(FW, FH);
      if (a === 'dead') { const q = new Pix(FW, FH); draw(q, L, 'down', 'hurt', 0); q.outline(OUTL); const r = new Pix(FW, FH); for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) { const c = q.get(x, y); if (!c) continue; const nx = FH - 1 - y + (FW - FH) / 2, ny = x + (FH - FW) / 2 + 6; r.set(nx, ny, c); } p = r; }
      else if (dir === 'right' && L.mirror !== false) { draw(p, L, 'left', a, f); p.flipX(); p.outline(OUTL, false); }
      else { draw(p, L, dir, a, f); p.outline(OUTL, false); }
      p.toCtx(ax, (idx[a] + f) * FW, di * FH);
    }
  });
  const A = { img: atlas, fw: FW, fh: FH, idx, ax: FW >> 1, ay: FH - 4 };
  if (draw === drawHero || draw === drawHumanoid || L.hd) { A.hdL = L; A.hdDraw = draw; A.hdAnims = anims; }   // v4.0: los cuadros HD se generan al verlos
  return A;
}
// presets
function classLook(cls, app, tier = 1, wtier = 1) {
  const sk = SKINS[app.skin || 0], hp = HAIRS[app.hair || 'negro'], base = { skin: sk, hair: hp, hairStyle: app.style || 'long', eyes: app.eyes || 'rojo', ponytail: (app.style || 'long') === 'long' };
  const tp = TIERP[tier];
  if (cls === 'guerrero') { const o = OUT.knight; return Object.assign(base, { outfit: 'knight', main: tp || o.main, sec: o.sec, cloth: o.cloth, boots: tp || o.main, cape: { out: P5(['#100e16', '#1c1824', '#2a2434', '#3a3246', '#4e445c']), in: o.sec, trim: o.sec }, weapon: { k: 'sword', tier: wtier } }); }
  if (cls === 'mago') { const o = OUT.robe; return Object.assign(base, { outfit: 'robe', main: o.main, sec: tp ? tp.slice(0) : o.sec, cloth: o.cloth, hat: 'wizard', hatC: o.main, weapon: { k: 'staff', tier: wtier, orb: wtier <= 1 ? ['#1a3a6a', '#2a64b0', '#4a9ae0', '#9ad8ff', '#ffffff'] : null } }); }
  if (cls === 'arquero') { const o = OUT.ranger; return Object.assign(base, { outfit: 'ranger', main: o.main, sec: tp || o.sec, cloth: o.cloth, pants: o.sec, boots: tp || o.sec, cape: { out: o.main, in: o.main }, weapon: { k: 'bow', tier: wtier } }); }
  const o = OUT.rogue; return Object.assign(base, { outfit: 'rogue', main: o.main, sec: o.sec, cloth: o.cloth, boots: tp || o.cloth, hat: 'hood', hatC: o.main, mask: o.sec, weapon: { k: 'dagger', tier: wtier }, scarf: o.sec });
}
