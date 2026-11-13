// ================= BUILDINGS & INTERIOR ART =================
const ROOFP = {
  red: pal(['#3e1410', '#64201a', '#8c3024', '#b2462f', '#d26a46', '#ec9a6c']), blue: pal(['#10203a', '#1a3460', '#244a86', '#3062a8', '#4a80c4', '#78a8e0']),
  slate: pal(['#16192a', '#22283e', '#2e3854', '#3e4a6c', '#55648a', '#7484a8']), brown: pal(['#2a1a0e', '#40281a', '#5a3a24', '#76502f', '#93683e', '#b38654']),
  green: pal(['#10261a', '#1a3a26', '#245034', '#326a44', '#46885a', '#68a878']), purple: pal(['#1e1030', '#30184a', '#46246a', '#5e348a', '#7a4ca8', '#a07ac8']),
  sand: pal(['#5a2a10', '#7a3e1a', '#9a5428', '#ba6e38', '#d48c4e', '#ecb070']), thatch: pal(['#3a2a0e', '#5a4418', '#7a6024', '#9a7c34', '#b89a4a', '#d8bc6c'])
};
const WALLP = {
  albor: pal(['#8e7e60', '#b4a482', '#d2c4a0', '#e6dabb', '#f4ecd6']), puerto: pal(['#9a9a96', '#c2c2bc', '#dedeD8', '#efefea', '#ffffff']),
  arxar: pal(['#3a3c48', '#525562', '#6c6f7c', '#868a96', '#a6aab4']), smith: pal(['#3a3430', '#554c44', '#706458', '#8c7e70', '#a89a8a']),
  sahrim: pal(['#9a7a4e', '#c0a070', '#dcc090', '#ecd6aa', '#f8ead0']), yarakai: pal(['#4a3218', '#6a4a26', '#8a6436', '#a87e48', '#c49a60'])
};
const GLASS = pal(['#a8581c', '#e0902c', '#ffc04a', '#ffe08a', '#fff6d0']);
function drawWindow(p, x, y, w, h, box) {
  p.rect(x - 1, y - 1, w + 2, h + 2, WOOD[1]);
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { const d = Math.max(Math.abs(xx - (w - 1) / 2) / (w / 2), Math.abs(yy - (h - 1) / 2) / (h / 2)); p.set(x + xx, y + yy, GLASS[clamp(4 - Math.floor(d * 3.5), 1, 4)]); }
  p.vl(x + (w >> 1), y, h, WOOD[1]); p.hl(x, y + (h >> 1), w, WOOD[1]);
  p.hl(x - 2, y + h + 1, w + 4, WOOD[4]); p.hl(x - 2, y + h + 2, w + 4, WOOD[1]);
  if (box) { p.rect(x - 1, y + h + 3, w + 2, 3, WOOD[2]); for (let k = 0; k < w + 2; k++) { p.set(x - 1 + k, y + h + 2 - (k % 2), LEAF.bush[3 + (k % 2)]); if (k % 3 === 1) p.set(x - 1 + k, y + h + 1, C(box)); } }
}
function drawDoor(p, cx, by, dw = 12, dh = 18, col) {
  const x0 = cx - (dw >> 1), y0 = by - dh;
  p.rect(x0 - 2, y0 - 2, dw + 4, dh + 2, WOOD[0]);
  for (let y = 0; y < dh; y++) for (let x = 0; x < dw; x++) { if (y < 3 && (x === 0 || x === dw - 1) && y < 2) continue; p.set(x0 + x, y0 + y, (col || WOOD)[x % 4 === 0 ? 1 : x === 1 ? 4 : 3]); }
  p.hl(x0, y0 + 4, dw, WOOD[1]); p.hl(x0, y0 + dh - 5, dw, WOOD[1]); p.set(x0 + dw - 3, y0 + (dh >> 1) + 1, GOLD[4]); p.set(x0 + dw - 3, y0 + (dh >> 1) + 2, GOLD[2]);
  p.rect(x0 - 3, by, dw + 6, 2, STONEP[3]); p.hl(x0 - 3, by, dw + 6, STONEP[4]);
}
const SIGNICON = {
  smith: (p, x, y) => { p.line(x + 2, y + 7, x + 8, y + 1, IRON[5]); p.line(x + 8, y + 7, x + 2, y + 1, IRON[4]); p.hl(x + 1, y + 6, 3, WOOD[3]); p.hl(x + 7, y + 6, 3, WOOD[3]); },
  store: (p, x, y) => { p.ball(x + 5, y + 4, 4, 3.5, pal(['#6a4a20', '#a07838', '#d0a85a'])); p.hl(x + 3, y + 1, 5, C('#5a3a18')); p.set(x + 5, y + 4, GOLD[5]); },
  alchemy: (p, x, y) => { p.ball(x + 5, y + 5, 3.5, 3, pal(['#6a1a7a', '#a040c0', '#e090ff'])); p.rect(x + 4, y + 0, 3, 3, C('#c8e0f0')); },
  inn: (p, x, y) => { p.rect(x + 2, y + 2, 5, 6, GOLD[3]); p.rect(x + 2, y + 1, 5, 2, C('#ffffff')); p.vl(x + 7, y + 3, 3, GOLD[2]); p.set(x + 8, y + 3, GOLD[2]); p.set(x + 8, y + 5, GOLD[2]); },
  guild: (p, x, y) => { p.poly([[x + 1, y], [x + 9, y], [x + 9, y + 5], [x + 5, y + 8], [x + 1, y + 5]], C('#a01a2a')); p.vl(x + 5, y + 1, 6, GOLD[4]); p.hl(x + 3, y + 3, 5, GOLD[4]); },
  magic: (p, x, y) => { [[5, 0], [5, 8], [1, 4], [9, 4], [5, 4], [3, 2], [7, 2], [3, 6], [7, 6]].forEach(([a, b]) => p.set(x + a, y + b, C('#a0e0ff'))); p.set(x + 5, y + 4, C('#ffffff')); },
};
// spec: {w,h,style,roof,sign,chimney,gable,box}
function genBuilding(spec) {
  const R = rngFor('bld' + spec.style + spec.roof + spec.w + spec.h, spec.v || 0);
  const W = spec.w * 16, extra = spec.extra != null ? spec.extra : 14, H = spec.h * 16 + extra, OV = 4, SW = W + OV * 2;
  const p = new Pix(SW, H), wallH = spec.wallH || 34, wallTop = H - wallH, rp = ROOFP[spec.roof] || ROOFP.red, wp = WALLP[spec.style] || WALLP.albor;
  // walls
  for (let y = wallTop; y < H; y++) for (let x = OV; x < OV + W; x++) {
    let c;
    if (spec.style === 'arxar' || spec.style === 'smith') { const row = Math.floor((y - wallTop) / 5), off = (row % 2) * 5, lx = (x + off) % 10, ly = (y - wallTop) % 5; let v = 2 + (hash2(Math.floor((x + off) / 10), row, 3) < 0.4 ? 1 : 0); if (ly === 4 || lx === 0) v = 0; else if (ly === 0) v = Math.min(4, v + 1); c = wp[v]; }
    else { let v = 3 + (hash2(x >> 1, y >> 1, 7) < 0.18 ? -1 : 0) + (hash2(x, y, 9) < 0.04 ? 1 : 0); c = wp[clamp(v, 0, 4)]; }
    if (x < OV + 3) c = uMix(c, C('#ffffff'), 0.12); if (x > OV + W - 4) c = uMul(c, 0.82);
    p.set(x, y, c);
  }
  // timber frame for plaster styles
  if (spec.style === 'albor' || spec.style === 'puerto') {
    const tb = spec.style === 'puerto' ? pal(['#14243e', '#1e3a62', '#2a5288', '#3a6aaa', '#5a8ac8']) : WOOD;
    const beam = (x, y, w, h) => { for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) p.set(x + xx, y + yy, tb[xx === 0 ? 3 : yy === h - 1 ? 1 : 2]); };
    beam(OV, wallTop, 3, wallH); beam(OV + W - 3, wallTop, 3, wallH); beam(OV, wallTop, W, 3); beam(OV, wallTop + 15, W, 2);
    const nPost = Math.max(1, Math.round(W / 30)); for (let k = 1; k < nPost + 1; k++) { const x = OV + Math.round(k * W / (nPost + 1)) - 1; beam(x, wallTop, 3, wallH); if (spec.style === 'albor' && k % 2 && R.f() < 0.7) { p.line(x + 3, wallTop + 3, x + 12, wallTop + 14, tb[1]); p.line(x + 3, wallTop + 4, x + 11, wallTop + 14, tb[2]); } }
  }
  // foundation
  p.rect(OV, H - 4, W, 4, STONEP[2]); p.hl(OV, H - 4, W, STONEP[4]); for (let x = OV; x < OV + W; x += 6) p.vl(x, H - 3, 3, STONEP[1]);
  // door & windows
  const dcx = OV + (W >> 1) + (spec.doorOff || 0) * 16; drawDoor(p, dcx, H - 2, spec.big ? 16 : 12, spec.big ? 22 : 18);
  const lights = []; const winY = wallTop + 6; const wins = [];
  for (let x = OV + 10; x + 10 < OV + W - 6; x += 22) { if (Math.abs(x + 5 - dcx) < 16) continue; wins.push(x); }
  for (const x of wins) { drawWindow(p, x, winY, 10, 10, spec.box ? R.pick(['#ff6070', '#ffe060', '#c070ff', '#ffffff']) : null); lights.push([x + 5, winY + 5]); }
  // roof (hip) with tile rows
  const roofBot = wallTop + 4, rinset = Math.min(10, W * 0.08);
  for (let y = 0; y < roofBot; y++) {
    const t = y / roofBot, ins = Math.round(rinset * (1 - t)), x0 = ins, x1 = SW - ins;
    for (let x = x0; x < x1; x++) {
      const row = Math.floor((roofBot - y) / 5), ly = (roofBot - y) % 5, off = (row % 2) * 4, lx = (x + off) % 8;
      let v = 2; if (ly === 4) v = 4; else if (ly === 0) v = 0; else if (ly === 1) v = 1; if (lx === 0 && ly > 0) v = 1; if ((lx === 0 || lx === 7) && ly === 1) v = 0;
      if (x - x0 < 2) v = Math.min(5, v + 1); if (x1 - x < 3) v = Math.max(0, v - 1);
      if (y < 3) v = y === 0 ? 1 : 3;
      if (hash2(x, y, 11) < 0.03) v = Math.max(0, v - 1);
      p.set(x, y, rp[v]);
    }
  }
  p.hl(0, roofBot, SW, rp[0]); p.hl(OV, roofBot + 1, W, uMul(wp[1], 0.6)); p.hl(OV, roofBot + 2, W, uMul(wp[2], 0.75));
  // front gable
  if (spec.gable) {
    const gw = Math.min(W - 12, 40), gx = OV + (W >> 1) - (gw >> 1), gh = Math.round(gw * 0.55), gb = roofBot + 1;
    for (let y = 0; y < gh; y++) { const half = (y / gh) * (gw / 2); for (let x = Math.round(gx + gw / 2 - half); x <= Math.round(gx + gw / 2 + half); x++) p.set(x, gb - gh + y, wp[3]); }
    p.line(gx - 2, gb + 1, gx + gw / 2, gb - gh - 1, rp[4]); p.line(gx - 1, gb + 1, gx + gw / 2, gb - gh, rp[2]); p.line(gx + gw + 2, gb + 1, gx + gw / 2, gb - gh - 1, rp[1]); p.line(gx + gw + 1, gb + 1, gx + gw / 2, gb - gh, rp[2]);
    p.vl(gx + gw / 2, gb - gh + 2, gh - 2, WOOD[2]); drawWindow(p, gx + gw / 2 - 4, gb - gh + Math.round(gh * 0.45), 8, 7); lights.push([gx + gw / 2, gb - gh + Math.round(gh * 0.45) + 3]);
  }
  if (spec.chimney) { const cx = OV + Math.round(W * 0.74), cy = Math.round(roofBot * 0.18); for (let y = cy; y < cy + 16; y++) for (let x = cx; x < cx + 8; x++) p.set(x, y, (y % 4 === 3 || (x + (Math.floor(y / 4) % 2) * 2) % 4 === 0) ? C('#5a2a20') : x === cx ? C('#b05a44') : C('#8a3e2e')); p.rect(cx - 1, cy - 2, 10, 3, STONEP[3]); p.hl(cx - 1, cy - 2, 10, STONEP[5]); spec._smoke = [cx + 4, cy - 3]; }
  if (spec.sign && SIGNICON[spec.sign]) { const sx = dcx + (spec.big ? 12 : 10), sy = wallTop + 18; p.hl(sx, sy - 2, 12, IRON[2]); p.vl(sx + 3, sy - 1, 2, IRON[2]); p.vl(sx + 9, sy - 1, 2, IRON[2]); p.rect(sx, sy + 1, 13, 11, WOOD[1]); p.rect(sx + 1, sy + 2, 11, 9, WOOD[3]); SIGNICON[spec.sign](p, sx + 1, sy + 2); }
  if (spec.awning) { const ay = wallTop + 2, ac = C(spec.awning); for (let y = 0; y < 7; y++) for (let x = OV - 1; x < OV + W + 1; x++) { const st = Math.floor(x / 6) % 2; let c = st ? ac : C('#f0e8d8'); if (y > 4) c = uMul(c, 0.78); if (y === 6 && x % 6 === 3) continue; p.set(x, ay + y, c); } }
  if (spec.banner) { for (const bx of [OV + 6, OV + W - 12]) { p.rect(bx, wallTop + 3, 6, 14, C('#8a1626')); p.vl(bx + 2, wallTop + 5, 9, C('#ece4d2')); p.hl(bx, wallTop + 8, 6, C('#ece4d2')); p.set(bx, wallTop + 16, 0); p.set(bx + 5, wallTop + 16, 0); } }
  p.outline(OUTL);
  return { c: p.canvas(), ax: OV + (W >> 1), ay: H - 1, lights, smoke: spec._smoke, w: SW, h: H, door: [dcx - OV - (W >> 1), 0] };
}
function genCastle() {
  const W = 400, H = 270, p = new Pix(W, H), S = pal(['#2c2e38', '#43465a', '#5c6074', '#777c90', '#9498aa', '#b8bccc']), RF = ROOFP.blue;
  const brick = (x0, y0, w, h, lightL) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const row = Math.floor(y / 6), off = (row % 2) * 6, lx = (x + off) % 12, ly = y % 6; let v = 2 + (hash2(Math.floor((x + off) / 12), row, 5) < 0.35 ? 1 : 0); if (ly === 5 || lx === 0) v = 1; if (x - x0 < 3) v = Math.min(5, v + 1); if (x0 + w - x < 4) v = Math.max(0, v - 1); p.set(x, y, S[v]); } };
  const crenel = (x0, y0, w) => { for (let x = x0; x < x0 + w; x++) { const up = Math.floor((x - x0) / 6) % 2 === 0; for (let y = y0 - (up ? 6 : 2); y < y0; y++) p.set(x, y, S[up ? 3 : 2]); if (up) p.set(x, y0 - 6, S[5]); } };
  const tower = (cx, top, bot, r, rh) => { for (let y = top; y < bot; y++) for (let x = cx - r; x < cx + r; x++) { const t = (x - (cx - r)) / (2 * r); let v = t < 0.2 ? 4 : t < 0.45 ? 3 : t < 0.75 ? 2 : 1; const row = Math.floor(y / 6); if (y % 6 === 5 || (x + row * 5) % 11 === 0) v = Math.max(0, v - 1); p.set(x, y, S[v]); } for (let y = 0; y < rh; y++) { const half = (y / rh) * (r + 4); for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) { const t = (x - (cx - half)) / (2 * half + 0.01); p.set(x, top - rh + y, RF[t < 0.3 ? 4 : t < 0.6 ? 3 : 2 - (y % 5 === 4 ? 1 : 0)]); } } p.vl(cx, top - rh - 8, 9, IRON[3]); p.rect(cx + 1, top - rh - 8, 8, 5, C('#a01a2a')); p.set(cx + 4, top - rh - 6, C('#ece4d2')); for (let k = 0; k < 3; k++) drawWindow(p, cx - 3, top + 16 + k * 26, 6, 9); };
  // back towers
  tower(70, 60, 200, 22, 46); tower(330, 60, 200, 22, 46);
  // main keep
  brick(90, 70, 220, 190); crenel(90, 70, 220); tower(200, 26, 120, 26, 40);
  for (let k = 0; k < 5; k++) { const x = 110 + k * 42; if (k === 2) continue; drawWindow(p, x, 100, 10, 14); drawWindow(p, x, 150, 10, 14); }
  // front towers
  tower(60, 120, 268, 28, 50); tower(340, 120, 268, 28, 50);
  // gate
  const gx = 200; for (let y = 196; y < 268; y++) for (let x = gx - 22; x < gx + 22; x++) { const dy = 210 - y, dx = x - gx; if (y < 210 && dx * dx + dy * dy * 1.6 > 22 * 22) continue; p.set(x, y, C('#140e0c')); }
  for (let x = gx - 18; x < gx + 18; x += 5) for (let y = 200; y < 268; y++) if (uA(p.get(x, y))) p.set(x, y, uMix(WOOD[2], C('#140e0c'), y % 7 === 0 ? 0.6 : 0)); for (let y = 204; y < 268; y += 8) for (let x = gx - 20; x < gx + 20; x++) p.set(x, y, IRON[2]);
  for (const bx of [140, 246]) { p.rect(bx, 80, 14, 40, C('#8a1626')); p.vl(bx + 6, 86, 26, C('#ece4d2')); p.vl(bx + 7, 86, 26, C('#ece4d2')); p.hl(bx + 2, 96, 10, C('#ece4d2')); p.hl(bx, 80, 14, GOLD[4]); }
  p.outline(OUTL);
  const lights = []; for (let k = 0; k < 5; k++) if (k !== 2) { lights.push([115 + k * 42, 107]); lights.push([115 + k * 42, 157]); }
  return { c: p.canvas(), ax: 200, ay: 268, lights };
}
function genMageTower() {
  const W = 84, H = 176, p = new Pix(W, H), S = pal(['#2a2440', '#3c3458', '#524870', '#6a5e8c', '#8a7eaa', '#b0a6cc']), RF = ROOFP.purple, cx = 42;
  for (let y = 56; y < 172; y++) for (let x = 10; x < 74; x++) { const t = (x - 10) / 64; let v = t < 0.18 ? 4 : t < 0.42 ? 3 : t < 0.75 ? 2 : 1; if (y % 7 === 6 || (x + Math.floor(y / 7) * 5) % 12 === 0) v = Math.max(0, v - 1); p.set(x, y, S[v]); }
  for (let y = 0; y < 56; y++) { const half = (y / 56) * 40; for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) { const t = (x - (cx - half)) / (2 * half + 0.01); p.set(x, y + 4, RF[clamp(Math.floor((1 - t) * 4 + (y % 6 === 5 ? -1 : 0)), 0, 5)]); } }
  p.rect(6, 58, 72, 4, S[4]); p.ball(cx, 2, 3, 3, pal(['#40a0c0', '#80e0ff', '#ffffff']));
  drawWindow(p, 22, 80, 8, 12); drawWindow(p, 54, 80, 8, 12); drawWindow(p, 38, 110, 8, 12); drawDoor(p, cx, 170, 14, 22, pal(['#1a1030', '#2a1848', '#3a2460', '#4a3070', '#5a3c80']));
  p.outline(OUTL); return { c: p.canvas(), ax: cx, ay: 171, lights: [[26, 86], [58, 86], [42, 116], [42, 2]] };
}
function genGateTower() { const W = 40, H = 72, p = new Pix(W, H), S = MP[T.CWALL]; for (let y = 10; y < 70; y++) for (let x = 2; x < 38; x++) { const row = Math.floor(y / 6), off = (row % 2) * 6, lx = (x + off) % 12; let v = (y % 6 === 5 || lx === 0) ? 0 : x < 6 ? 4 : x > 33 ? 1 : 2 + (hash2(x >> 3, row, 2) < 0.3 ? 1 : 0); p.set(x, y, S[clamp(v, 0, 4)]); } for (let x = 0; x < 40; x++) { const up = Math.floor(x / 6) % 2 === 0; for (let y = up ? 2 : 6; y < 10; y++) p.set(x, y, S[up ? 3 : 2]); } drawWindow(p, 16, 26, 7, 10); p.rect(14, 48, 12, 2, IRON[2]); p.outline(OUTL); return { c: p.canvas(), ax: 20, ay: 69, lights: [[19, 31]] }; }
// ---------- interior furniture ----------
function genFurn(kind, f = 0) {
  let p, ax, ay, light;
  switch (kind) {
    case 'counter': { p = new Pix(64, 22); p.rect(0, 6, 64, 14, WOOD[2]); p.rect(0, 2, 64, 5, WOOD[4]); p.hl(0, 2, 64, WOOD[5]); p.hl(0, 7, 64, WOOD[1]); for (let x = 4; x < 64; x += 12) { p.rect(x, 9, 8, 8, WOOD[1]); p.rect(x + 1, 10, 6, 6, WOOD[3]); } p.hl(0, 19, 64, WOOD[0]); ax = 32; ay = 20; break; }
    case 'shelf': case 'potshelf': case 'bookshelf': case 'weaprack': {
      p = new Pix(32, 40); p.rect(1, 2, 30, 36, WOOD[1]); p.vl(1, 2, 36, WOOD[3]); p.vl(30, 2, 36, WOOD[0]); p.rect(1, 0, 30, 3, WOOD[4]);
      for (let s = 0; s < 3; s++) { const y = 4 + s * 12; p.rect(3, y, 26, 9, C('#2a1810')); p.hl(2, y + 9, 28, WOOD[4]); p.hl(2, y + 10, 28, WOOD[2]);
        for (let k = 0; k < 6; k++) { const x = 4 + k * 4; const R = hash2(k, s, kind.length);
          if (kind === 'potshelf') { const cc = [C('#d02a3a'), C('#3a6ad8'), C('#3ac04a'), C('#c040e0')][(k + s) % 4]; p.rect(x, y + 4, 3, 5, cc); p.set(x + 1, y + 2, C('#d8e8f0')); p.set(x + 1, y + 3, C('#d8e8f0')); p.set(x, y + 4, uMix(cc, C('#fff'), 0.5)); }
          else if (kind === 'bookshelf') { const cc = [C('#8a2a2a'), C('#2a4a8a'), C('#2a6a3a'), C('#8a6a2a'), C('#5a2a6a')][Math.floor(R * 5)]; p.rect(x, y + 1 + Math.floor(R * 2), 3, 8 - Math.floor(R * 2), cc); p.vl(x, y + 2, 6, uMix(cc, C('#fff'), 0.3)); }
          else if (kind === 'weaprack') { p.vl(x + 1, y, 9, IRON[4]); p.set(x + 1, y, IRON[5]); p.hl(x, y + 7, 3, GOLD[3]); }
          else { const cc = [C('#c8a060'), C('#a06a3a'), C('#e0d0b0'), C('#7a8a9a')][(k * 3 + s) % 4]; p.rect(x, y + 4, 3, 5, cc); p.hl(x, y + 4, 3, uMix(cc, C('#fff'), 0.3)); } } }
      ax = 16; ay = 38; break;
    }
    case 'table': { p = new Pix(32, 22); p.rect(1, 4, 30, 8, WOOD[3]); p.hl(1, 4, 30, WOOD[5]); p.hl(1, 11, 30, WOOD[1]); woodPost(p, 3, 12, 20, 2); woodPost(p, 27, 12, 20, 2); p.rect(7, 2, 4, 3, C('#e8e0d0')); p.rect(19, 1, 3, 4, C('#a05a2a')); p.set(20, 0, C('#fff0a0')); ax = 16; ay = 20; break; }
    case 'chair': { p = new Pix(12, 16); p.rect(2, 1, 8, 7, WOOD[3]); p.hl(2, 1, 8, WOOD[5]); p.rect(2, 8, 8, 3, WOOD[4]); woodPost(p, 2, 11, 15, 2); woodPost(p, 8, 11, 15, 2); ax = 6; ay = 15; break; }
    case 'bed': { p = new Pix(24, 36); p.rect(1, 2, 22, 32, WOOD[2]); p.rect(3, 4, 18, 28, C('#ece4d8')); p.rect(3, 12, 18, 20, C('#a0283a')); p.hl(3, 12, 18, C('#d04a5a')); for (let y = 15; y < 32; y += 4) p.hl(3, y, 18, C('#8a1e2e')); p.rect(5, 5, 14, 5, C('#ffffff')); p.rect(1, 0, 22, 3, WOOD[4]); ax = 12; ay = 34; break; }
    case 'fireplace': { p = new Pix(36, 36); for (let y = 2; y < 34; y++) for (let x = 1; x < 35; x++) p.set(x, y, STONEP[(y % 5 === 4 || (x + (Math.floor(y / 5) % 2) * 3) % 7 === 0) ? 1 : x < 4 ? 4 : 3]); p.rect(8, 14, 20, 18, C('#140a06')); p.rect(0, 10, 36, 4, WOOD[3]); p.hl(0, 10, 36, WOOD[5]); for (let k = 0; k < 7; k++) { const hh = 4 + ((k * 3 + f * 2) % 6); for (let y = 0; y < hh; y++) p.set(10 + k * 2.4, 30 - y, y < 2 ? C('#fff2a0') : y < hh / 2 ? C('#ffb02a') : C('#e8501a')); } p.hl(9, 31, 18, WOOD[1]); ax = 18; ay = 34; light = [18, 24]; break; }
    case 'cauldron': { p = new Pix(24, 22); p.ell(12, 13, 10, 7, IRON[1]); p.ell(12, 12, 10, 6.5, IRON[2]); p.ell(12, 8, 9, 3, IRON[3]); p.ell(12, 8, 7.5, 2.2, C('#40d060')); for (let k = 0; k < 3; k++) p.set(8 + k * 4, 7 - ((f + k) % 3), C('#a0ffa0')); p.set(6, 19, IRON[1]); p.set(18, 19, IRON[1]); for (let k = 0; k < 5; k++) p.set(8 + k * 2, 20 + (k % 2), k % 2 ? C('#ffb02a') : C('#e8501a')); ax = 12; ay = 21; light = [12, 8]; break; }
    case 'throne': { p = new Pix(34, 46); p.rect(5, 2, 24, 30, GOLD[2]); p.rect(8, 6, 18, 24, C('#8a1626')); p.vl(5, 2, 30, GOLD[4]); p.rect(3, 26, 28, 8, GOLD[3]); p.rect(6, 30, 22, 6, C('#a01a2a')); p.rect(3, 34, 28, 10, GOLD[2]); p.hl(3, 34, 28, GOLD[4]); p.ball(17, 3, 3, 3, GOLD.slice(2)); ax = 17; ay = 44; break; }
    case 'chest': { p = new Pix(18, 14); p.rect(1, 5, 16, 8, WOOD[2]); p.rect(1, 1, 16, 5, WOOD[3]); p.hl(1, 1, 16, WOOD[5]); p.hl(1, 6, 16, GOLD[3]); p.vl(4, 1, 12, GOLD[3]); p.vl(13, 1, 12, GOLD[3]); p.rect(8, 6, 2, 3, GOLD[5]); ax = 9; ay = 13; break; }
    case 'pillar': { p = new Pix(16, 44); for (let y = 4; y < 40; y++) for (let x = 3; x < 13; x++) p.set(x, y, STONEP[x < 5 ? 5 : x > 10 ? 2 : 3 + (x % 3 === 0 ? -1 : 0)]); p.rect(1, 0, 14, 4, STONEP[4]); p.rect(1, 40, 14, 4, STONEP[3]); ax = 8; ay = 43; break; }
    case 'rug': { p = new Pix(48, 30); p.rect(0, 0, 48, 30, C('#7e1f2b')); p.rect(2, 2, 44, 26, GOLD[3]); p.rect(4, 4, 40, 22, C('#a02c36')); for (let x = 6; x < 42; x += 6) p.rect(x, 13, 3, 3, GOLD[4]); ax = 24; ay = 29; break; }
    case 'board': { p = new Pix(36, 30); p.rect(1, 1, 34, 24, WOOD[1]); p.rect(3, 3, 30, 20, WOOD[3]); for (let k = 0; k < 5; k++) { const x = 5 + (k % 3) * 9, y = 5 + Math.floor(k / 3) * 9; p.rect(x, y, 7, 7, C('#efe4c8')); p.hl(x + 1, y + 2, 5, C('#8a7a5a')); p.hl(x + 1, y + 4, 4, C('#8a7a5a')); p.set(x + 3, y, C('#c02a2a')); } woodPost(p, 5, 25, 29, 2); woodPost(p, 29, 25, 29, 2); ax = 18; ay = 29; break; }
    case 'plant': return genPot('#ff6080');
    case 'barrels': { p = new Pix(28, 18); const b = genBarrel(); const x = p; const t = new Pix(14, 16); return { c: (() => { const c = mkCanvas(28, 18), cx = c.getContext('2d'); cx.drawImage(b.c, 0, 2); cx.drawImage(b.c, 13, 2); return c; })(), ax: 14, ay: 17 }; }
    case 'armorstand': { p = new Pix(18, 34); woodPost(p, 8, 10, 32, 2); p.rect(4, 30, 10, 3, WOOD[2]); p.rect(4, 10, 10, 11, IRON[3]); p.vl(4, 10, 11, IRON[5]); p.ball(9, 6, 4, 4, IRON.slice(2)); p.hl(6, 6, 6, IRON[0]); ax = 9; ay = 33; break; }
    default: { const r2 = typeof genFurn2 === 'function' ? genFurn2(kind) : null; if (r2) return r2; p = new Pix(8, 8); p.rect(0, 0, 8, 8, C('#f0f')); ax = 4; ay = 7; }
  }
  p.outline(OUTL); return { c: p.canvas(), ax, ay, light };
}
