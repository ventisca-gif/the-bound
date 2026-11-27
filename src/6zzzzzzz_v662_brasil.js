// ================= 6.62 · BRASIL: Río de Janeiro y las Cataratas del Iguazú =================
// Sergio mandó fotos: el Cristo Redentor en el Corcovado (pedestal oscuro, terraza con gente, escaleras mecánicas, toldos
// verdes), el Pan de Azúcar con el teleférico, una favela de ladrillo con tanques de agua azules, la Escalera Selarón
// (muros rojos de mosaico, escalones azules, amarillos y verdes), la playa con edificios altos y sombrillas de colores, el
// hipódromo junto a la Lagoa y las Cataratas del Iguazú con las pasarelas y el arcoíris. Pidió además «un pasto distinto».
// Tierra recién pintada por la Ventisca (como Lima, México y España): sin monstruos. Todo el suelo se pinta una sola vez
// por trozo de mapa (M.decorate); lo que se mueve (olas, teleférico, niebla, arcoíris, caballos) va en M.drawExtra.
const BR_W = 200, BR_H = 140, BR_TICKET = 2500;
const BRZ = {
  air: { x0: 172, x1: 198, y0: 4, y1: 22, term: [176, 6, 192, 9], door: [184, 10], spawn: [184, 15] },
  copa: { bld0: 94, ave: 106, cal: 110, sand: 113, sea: 124, x0: 58, x1: 199 },
  pao: { cx: 186, cy: 132, r: 8, st: [178, 115], top: [186, 129] },
  cris: { cx: 36, cy: 30, plaza: 7, stat: [36, 24] },
  fav: { x0: 66, x1: 106, y0: 30, y1: 66 },
  sel: { x0: 120, x1: 126, y0: 44, y1: 78, arch: 82 },
  lag: { cx: 170, cy: 64, rx: 11, ry: 8 }, hip: { cx: 145, cy: 64, rx: 11, ry: 6 },
  igu: { x0: 6, x1: 52, fall: 82, r0: 87, r1: 127, walk: 29, dock: [46, 125] } };
const BR_ZONES = [
  { k: 'galeao', n: L2('Aeropuerto del Galeão', 'Galeão Airport'), t: (x, y) => x >= BRZ.air.x0 && y <= BRZ.air.y1 + 2, p: [185, 12] },
  { k: 'copa', n: 'Copacabana', t: (x, y) => y >= BRZ.copa.bld0 && x >= BRZ.copa.x0, p: [128, 116] },
  { k: 'pao', n: L2('Pan de Azúcar', 'Sugarloaf Mountain'), t: (x, y) => Math.hypot(x - BRZ.pao.cx, y - BRZ.pao.cy) < 12, p: [186, 130] },
  { k: 'cristo', n: L2('Corcovado · Cristo Redentor', 'Corcovado · Christ the Redeemer'), t: (x, y) => Math.hypot(x - BRZ.cris.cx, y - BRZ.cris.cy) < 26 && y < 60, p: [36, 30] },
  { k: 'favela', n: L2('Morro (favela)', 'Morro (favela)'), t: (x, y) => x >= BRZ.fav.x0 - 2 && x <= BRZ.fav.x1 + 2 && y >= BRZ.fav.y0 - 2 && y <= BRZ.fav.y1 + 2, p: [86, 48] },
  { k: 'selaron', n: L2('Escalera Selarón · Lapa', 'Selarón Steps · Lapa'), t: (x, y) => x >= 112 && x <= 134 && y >= 40 && y <= 88, p: [123, 60] },
  { k: 'lagoa', n: L2('Lagoa e hipódromo', 'Lagoa and racecourse'), t: (x, y) => x >= 132 && x <= 183 && y >= 54 && y <= 74, p: [158, 64] },
  { k: 'iguazu', n: L2('Cataratas del Iguazú', 'Iguazu Falls'), t: (x, y) => x <= 56 && y >= 70, p: [29, 100] }];
const brZoneAt = (px, py) => { const x = px / 16, y = py / 16; return BR_ZONES.find(z => z.t(x, y)) || null; };
// ---------- mapa ----------
function makeBrasil() { if (G.maps.brasil) return G.maps.brasil; const w = BR_W, h = BR_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'brasil', w, h, ter: new Uint8Array(N).fill(T.GRASS), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, br: 1, zoneAt: brZoneAt };
  const set = (x, y, t) => { if (x >= 0 && y >= 0 && x < w && y < h) M.ter[I(x, y)] = t; }, rect = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, t); };
  const ell = (cx, cy, rx, ry, t) => { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) set(x, y, t); };
  rect(0, 0, w - 1, 0, T.CWALL); rect(0, h - 1, w - 1, h - 1, T.CWALL); rect(0, 0, 0, h - 1, T.CWALL); rect(w - 1, 0, w - 1, h - 1, T.CWALL);
  // Copacabana: edificios (sólidos), avenida, calçadão, arena y mar
  const C = BRZ.copa; rect(C.x0, C.bld0, C.x1, C.ave - 1, T.IWALL); for (let x = C.x0 + 9; x < C.x1; x += 14) rect(x, C.bld0, x + 1, C.ave - 1, T.COBBLE);   // calles hacia la avenida
  rect(C.x0, C.ave, C.x1, C.cal - 1, T.COBBLE); rect(C.x0, C.cal, C.x1, C.sand - 1, T.FLOOR); rect(C.x0, C.sand, C.x1, C.sea - 1, T.SAND); rect(C.x0, C.sea, C.x1, C.sea + 1, T.WATER); rect(C.x0, C.sea + 2, w - 2, h - 2, T.DEEP);
  // Pan de Azúcar: isla en el mar (solo se llega en teleférico)
  ell(BRZ.pao.cx, BRZ.pao.cy, BRZ.pao.r, BRZ.pao.r * 0.8, T.GRASS); ell(BRZ.pao.top[0], BRZ.pao.top[1], 3, 2, T.STONE);
  // aeropuerto
  const A = BRZ.air; rect(A.x0, A.y0, A.x1, A.y1, T.COBBLE); rect(A.term[0], A.term[1], A.term[2], A.term[3], T.IWALL); rect(A.x0, A.y0 - 2, A.x1, A.y0 - 1, T.FLOOR);
  // Corcovado: bosque, camino que sube y plaza del Cristo (el acantilado detrás es sólido)
  const K = BRZ.cris; ell(K.cx, K.cy - 9, 14, 4, T.CWALL); ell(K.cx, K.cy, K.plaza, K.plaza * 0.7, T.STONE); rect(K.stat[0] - 2, K.stat[1] - 1, K.stat[0] + 2, K.stat[1] + 1, T.IWALL);
  for (let y = K.cy + 4; y <= 60; y++) { const x = Math.round(K.cx + Math.sin(y / 5) * 4); rect(x - 1, y, x + 1, y, T.DIRT); }
  // favela: casas apiladas con callejones y escaleras entre ellas
  const F = BRZ.fav; for (let y = F.y0; y <= F.y1; y += 4) for (let x = F.x0 + ((y / 4) % 2 ? 2 : 0); x <= F.x1 - 3; x += 5) rect(x, y, x + 3, y + 2, T.IWALL);
  // Escalera Selarón (muros de mosaico sólidos a los lados) y los arcos de Lapa
  const S = BRZ.sel; rect(S.x0 - 2, S.y0, S.x0 - 1, S.y1, T.IWALL); rect(S.x1 + 1, S.y0, S.x1 + 2, S.y1, T.IWALL); rect(S.x0, S.y0, S.x1, S.y1, T.FLOOR);
  for (let x = 108; x <= 140; x += 4) rect(x, S.arch, x, S.arch + 1, T.IWALL);
  // Lagoa e hipódromo
  ell(BRZ.lag.cx, BRZ.lag.cy, BRZ.lag.rx, BRZ.lag.ry, T.WATER); ell(BRZ.lag.cx, BRZ.lag.cy, BRZ.lag.rx - 3, BRZ.lag.ry - 3, T.DEEP);
  // Iguazú: catarata (acantilado), río, pasarela de tablones sobre el agua y embarcadero
  const U = BRZ.igu; rect(U.x0, U.fall - 4, U.x1, U.r0 - 1, T.CWALL); rect(U.x0 + 2, U.r0, U.x1 - 2, U.r1, T.WATER); rect(U.x0 + 6, U.r0 + 6, U.x1 - 6, U.r1 - 6, T.DEEP);
  rect(U.walk, U.r0 + 3, U.walk + 1, U.r1 + 1, T.BRIDGE); rect(U.walk - 4, U.r0 + 2, U.walk + 5, U.r0 + 4, T.BRIDGE); rect(U.dock[0] - 2, U.dock[1] - 1, U.dock[0] + 1, U.dock[1] + 1, T.BRIDGE);
  // caminos entre zonas
  const road = (x0, y0, x1, y1) => { let x = x0, y = y0; while (x !== x1 || y !== y1) { rect(x - 1, y - 1, x + 1, y + 1, M.ter[I(x, y)] === T.GRASS ? T.DIRT : M.ter[I(x, y)]); if (x !== x1) x += Math.sign(x1 - x); else y += Math.sign(y1 - y); } };
  road(184, 23, 184, 60); road(184, 60, 140, 60); road(140, 60, 140, 92); road(110, 60, 140, 60); road(110, 60, 110, 92); road(123, 79, 123, 92); road(60, 60, 110, 60); road(36, 60, 60, 60); road(60, 60, 60, 92); road(30, 66, 60, 66); road(29, 66, 29, BRZ.igu.fall - 6);
  for (const x of [60, 110, 140]) rect(x - 1, 88, x + 1, C.bld0 - 1, T.DIRT);
  M.exit = { x: -9, y: -9 }; initMapObjs(M);
  const put = (k, x, y, o) => { if (canPlace(M, x, y)) addObj(M, k, x, y, o || {}); };
  // árboles: palmeras en la playa, selva en el Corcovado y en Iguazú
  for (let x = C.x0 + 3; x < C.x1 - 2; x += 6) put('tree', x, C.cal - 1, { sp: 'palma', deco: true });
  const R = new RNG(6620); for (let k = 0; k < 900; k++) { const x = R.int(2, w - 3), y = R.int(2, C.bld0 - 3); if (M.ter[I(x, y)] !== T.GRASS) continue; if (Math.abs(x - K.stat[0]) < 10 && y < K.cy + 2 && y > K.stat[1] - 16) continue; const z = brZoneAt(x * 16, y * 16); if (z && (z.k === 'favela' || z.k === 'lagoa' || z.k === 'selaron')) continue; const jungle = z && (z.k === 'cristo' || z.k === 'iguazu'); if (!jungle && R.f() > 0.35) continue; put('tree', x, y, { sp: R.f() < 0.4 ? 'palma' : 'roble', deco: true }); }
  for (let x = C.x0 + 6; x < C.x1 - 3; x += 17) put('stall', x, C.sand + 1, { col: ['#2a9a5a', '#f0c020', '#2a6ad0'][(x / 17 | 0) % 3], fp: [[0, 0], [1, 0], [-1, 0]] });
  for (const dx of [-5, 5]) put('stall', K.cx + dx, K.cy + 3, { col: '#1e8a4a', fp: [[0, 0], [1, 0], [-1, 0]] });   // toldos verdes del mirador
  M.decorate = (g, cx, cy) => brPaint(M, g, cx * CHP, cy * CHP);
  M.drawExtra = (cx, cy) => brLive(M, cx, cy);
  brPeople(M); G.maps.brasil = M; return M; }
// ---------- suelo y monumentos (una vez por trozo) ----------
const BR_COL = { g: ['#3aa848', '#42b452', '#36a044', '#48bc58'], blade: '#257a34', light: '#86de74', flower: ['#ffd23a', '#ff6ab0', '#ffffff'] };
function brPaint(M, g, ox, oy) { const S = 16, tx0 = ox / S, ty0 = oy / S;
  g.save(); g.translate(-ox, -oy);
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); }, I = (x, y) => y * M.w + x;
  for (let ty = ty0; ty < ty0 + CH; ty++) for (let tx = tx0; tx < tx0 + CH; tx++) { if (tx >= M.w || ty >= M.h) continue; const t = M.ter[I(tx, ty)], x = tx * S, y = ty * S, hh = hash2(tx, ty, 662);
    if (t === T.GRASS) {   // pasto tropical (nuevo): más verde y vivo, hojas largas y florecitas
      R(x, y, S, S, BR_COL.g[(hh * 4) | 0]); for (let k = 0; k < 6; k++) { const a = hash2(tx * 7 + k, ty, 663), b = hash2(tx, ty * 7 + k, 664), bx = x + ((a * 15) | 0), by = y + ((b * 14) | 0); R(bx, by, 1, 3, BR_COL.blade); R(bx + 1, by - 1, 1, 2, BR_COL.blade); R(bx, by + 3, 1, 1, BR_COL.light); }
      if (hh < 0.12) R(x + ((hh * 100) % 12 | 0) + 2, y + 6, 2, 2, BR_COL.flower[(hh * 30 | 0) % 3]); if (hh > 0.85) { R(x + 4, y + 9, 6, 1, BR_COL.light); R(x + 6, y + 8, 2, 1, BR_COL.light); } }
    else if (t === T.SAND && ty >= BRZ.copa.sand) { R(x, y, S, S, hh < 0.5 ? '#f2dca8' : '#eed6a0'); if (hh > 0.8) R(x + 5, y + 7, 2, 1, '#d8bc80'); }
    else if (t === T.FLOOR && ty >= BRZ.copa.cal && ty < BRZ.copa.sand) { R(x, y, S, S, '#f4f2ee'); for (let k = 0; k < 16; k += 2) { const yy = y + 4 + Math.sin((x + k) / 16 + (ty - BRZ.copa.cal) * 1.3) * 4; R(x + k, Math.round(yy), 2, 4, '#1e1e22'); } }
    else if (t === T.COBBLE && ty >= BRZ.copa.bld0 && ty < BRZ.copa.ave) { R(x, y, S, S, '#4a4a52'); if (tx % 2) R(x + 7, y, 2, 8, '#f0f0f0'); }
    else if (t === T.COBBLE && ty >= BRZ.copa.ave && ty < BRZ.copa.cal) { R(x, y, S, S, '#4a4a52'); if (ty === BRZ.copa.ave + 1 && tx % 3 === 0) R(x, y + 15, 10, 2, '#f0f0f0'); }
    else if (t === T.COBBLE && tx >= BRZ.air.x0 && ty <= BRZ.air.y1) { R(x, y, S, S, '#6a6a72'); if (ty === 18 && tx % 2) R(x, y + 7, 10, 2, '#f0d040'); }
    else if (t === T.FLOOR && tx >= BRZ.sel.x0 && tx <= BRZ.sel.x1 && ty >= BRZ.sel.y0 && ty <= BRZ.sel.y1) {   // escalones de mosaico
      const step = ty - BRZ.sel.y0, cols = ['#f0b020', '#2a4ac8', '#2a9a6a', '#f0b020', '#2a4ac8', '#e8e0d0']; R(x, y, S, S, cols[step % cols.length]); R(x, y + 12, S, 4, '#d8d0c0');
      for (let k = 0; k < 6; k++) R(x + ((hash2(tx * 3 + k, ty, 665) * 14) | 0), y + ((hash2(tx, ty * 3 + k, 666) * 10) | 0), 3, 2, ['#ffffff', '#1a2a6a', '#ffd870', '#3ab88a', '#c82a2a', '#7a4ac8'][k]);
      if (step === 10 && tx === BRZ.sel.x0 + 1) { g.fillStyle = '#1a2a6a'; g.font = 'bold 9px monospace'; g.fillText('ESCADARIA SELARON', x, y + 10); } if (step === 12 && tx === BRZ.sel.x0 + 1) { g.fillStyle = '#1a2a6a'; g.font = 'bold 9px monospace'; g.fillText('RIO DE JANEIRO', x + 6, y + 10); } }
    else if (t === T.IWALL) { const sel = ty >= BRZ.sel.y0 && ty <= BRZ.sel.y1 && tx >= BRZ.sel.x0 - 2 && tx <= BRZ.sel.x1 + 2; R(x, y, S, S, sel ? '#c82a1a' : '#9a9488'); if (!sel && hh > 0.5) R(x + 3, y + 6, 8, 1, '#8a8478'); }
    else if (t === T.CWALL && tx > 0 && ty > 0 && tx < M.w - 1 && ty < M.h - 1) { R(x, y, S, S, hh < 0.45 ? '#5a6a58' : hh < 0.75 ? '#2e6a36' : '#4a5a48'); R(x + ((hh * 9) | 0), y + 3, 6, 2, '#7a8a74'); if (hh > 0.6) { R(x + 2, y + 9, 5, 4, '#245a2c'); R(x + 9, y + 2, 4, 4, '#3a8a44'); } }
    else if (t === T.BRIDGE) { R(x, y, S, S, '#8a6a44'); for (let k = 0; k < 16; k += 4) R(x, y + k, S, 1, '#6a4e30'); R(x, y, 1, S, '#3a8a5a'); R(x + 15, y, 1, S, '#3a8a5a'); }
    else if (t === T.DIRT) { R(x, y, S, S, hh < 0.5 ? '#b08a5a' : '#a88252'); if (hh > 0.7) R(x + 6, y + 9, 3, 2, '#8a6a42'); } }
  // fachadas frente al mar (edificios altos, sobre las casillas sólidas)
  const C = BRZ.copa; if (oy + CHP > (C.bld0 - 8) * S && oy < C.ave * S) for (let x0 = C.x0 * S; x0 < C.x1 * S; x0 += 14 * S) { const k = (x0 / S / 14) | 0, wB = 9 * S - 4, hB = (C.ave - C.bld0) * S + 40 + (k % 4) * 28, top = C.ave * S - hB, col = ['#f0e6d0', '#e8d4b8', '#d8e4ea', '#f4ece0', '#e0d0c0', '#c8d8e8'][k % 6];
    if (x0 + wB < ox || x0 > ox + CHP) continue; R(x0, top, wB, hB, col); R(x0 + wB - 10, top, 10, hB, 'rgba(0,0,0,.10)'); R(x0, top, wB, 4, '#ffffff');
    for (let wy = top + 10; wy < C.ave * S - 26; wy += 13) for (let wx = x0 + 6; wx < x0 + wB - 14; wx += 11) { R(wx, wy, 7, 7, (wx + wy) % 3 ? '#5a8ab0' : '#8ab8d8'); R(wx, wy + 7, 7, 1, '#ffffff'); }
    R(x0 + wB / 2 - 10, C.ave * S - 20, 20, 20, '#6a4a2a'); R(x0 + 2, C.ave * S - 24, wB - 4, 3, ['#e83a3a', '#2a9a5a', '#2a6ad0', '#f0a020'][k % 4]); }
  // sombrillas y toallas
  if (oy + CHP > C.sand * S && oy < C.sea * S) for (let k = 0; k < 90; k++) { const x = C.x0 * S + 20 + ((k * 97) % ((C.x1 - C.x0) * S - 40)), y = (C.sand + 2 + (k * 7) % 9) * S; if (x < ox - 20 || x > ox + CHP + 20) continue; const c = ['#e83a3a', '#f0c020', '#2a9a5a', '#2a6ad0', '#ff6ab0'][k % 5];
    R(x - 9, y + 6, 13, 5, ['#ffffff', '#ffd040', '#5ac8ff'][k % 3]); R(x, y - 2, 1, 13, '#7a5a3a'); g.fillStyle = c; g.beginPath(); g.moveTo(x - 12, y); g.quadraticCurveTo(x, y - 12, x + 12, y); g.closePath(); g.fill(); R(x - 1, y - 9, 3, 2, '#ffffff'); }
  // terminal del aeropuerto y avión
  const A = BRZ.air; R(A.term[0] * S, A.term[1] * S - 20, (A.term[2] - A.term[0] + 1) * S, (A.term[3] - A.term[1] + 1) * S + 20, '#d8dce4'); R(A.term[0] * S, A.term[1] * S - 20, (A.term[2] - A.term[0] + 1) * S, 6, '#2a9a5a'); for (let x = A.term[0] * S + 6; x < (A.term[2] + 1) * S - 8; x += 14) R(x, A.term[1] * S, 10, 22, '#6a9ac8');
  g.fillStyle = '#1a3a7a'; g.font = 'bold 10px monospace'; g.fillText('GALEAO · RIO', A.term[0] * S + 70, A.term[1] * S - 8);
  const px = 188 * S, py = 18 * S; R(px - 40, py - 4, 80, 9, '#f4f4f8'); R(px - 6, py - 26, 14, 52, '#f4f4f8'); R(px + 36, py - 12, 6, 16, '#2a9a5a'); R(px - 36, py - 3, 70, 2, '#2a6ad0');
  // favela: casas de ladrillo y revoque apiladas, con tanques de agua azules
  const F = BRZ.fav; if (ox + CHP > F.x0 * S && ox < (F.x1 + 2) * S && oy + CHP > (F.y0 - 2) * S && oy < (F.y1 + 4) * S)
    for (let y = F.y0; y <= F.y1; y += 4) for (let x = F.x0 + ((y / 4) % 2 ? 2 : 0); x <= F.x1 - 3; x += 5) { const hh = hash2(x, y, 667), X = x * S, Y = y * S - 10, W = 4 * S, H = 3 * S + 10, brick = hh < 0.5;
      R(X, Y, W, H, brick ? '#b8643a' : ['#e8d8b8', '#9ad0c8', '#e8b8c8', '#d8d0a0'][(hh * 8 | 0) % 4]); if (brick) for (let by = Y + 2; by < Y + H; by += 4) for (let bx = X + ((by / 4) % 2 ? 0 : 3); bx < X + W; bx += 6) R(bx, by, 5, 1, '#8a4424');
      R(X, Y, W, 3, '#7a7a80'); for (let wx = X + 6; wx < X + W - 8; wx += 16) { R(wx, Y + 14, 8, 8, '#2a2a36'); R(wx, Y + 22, 8, 1, '#f0f0f0'); } R(X + W - 18, Y + H - 16, 10, 16, '#5a3a22');
      if (hh > 0.3) { R(X + 6, Y - 9, 12, 9, '#2a6ad8'); R(X + 6, Y - 9, 12, 2, '#5a9af0'); } if (hh > 0.7) { R(X + 30, Y - 7, 10, 7, '#2a6ad8'); } if (hh < 0.25) { R(X + 4, Y + 30, W - 8, 1, '#3a3a3a'); for (let k = 0; k < 4; k++) R(X + 8 + k * 12, Y + 31, 6, 7, ['#e83a3a', '#ffffff', '#2a9a5a', '#f0c020'][k]); } }
  // muros de mosaico rojo de la Selarón y los arcos de Lapa
  const Sl = BRZ.sel; for (const xs of [Sl.x0 - 2, Sl.x1 + 1]) if (ox + CHP > xs * S && ox < (xs + 2) * S) for (let ty = Sl.y0; ty <= Sl.y1; ty++) for (let k = 0; k < 10; k++) { const hh = hash2(xs + k, ty, 668); R(xs * S + ((hh * 30) | 0), ty * S + ((hash2(ty, k, 669) * 14) | 0), 5, 4, hh < 0.8 ? ['#d82a1a', '#e83a2a', '#b81e14'][k % 3] : ['#2a4ac8', '#f0c020', '#ffffff'][k % 3]); }
  if (oy + CHP > (Sl.arch - 3) * S && oy < (Sl.arch + 3) * S) { R(106 * S, (Sl.arch - 2) * S, 36 * S, 2 * S, '#f4f0e4'); for (let x = 108; x <= 140; x += 4) { R(x * S, (Sl.arch - 2) * S, S, 4 * S, '#ece6d6'); g.fillStyle = BR_COL.g[1]; g.beginPath(); g.arc((x + 2.5) * S, (Sl.arch + 2) * S, S * 1.5, Math.PI, 0); g.fill(); } }
  // hipódromo
  const Hp = BRZ.hip; if (Math.abs(ox + CHP / 2 - Hp.cx * S) < Hp.rx * S + CHP && Math.abs(oy + CHP / 2 - Hp.cy * S) < Hp.ry * S + CHP) { g.fillStyle = '#c8a070'; g.beginPath(); g.ellipse(Hp.cx * S, Hp.cy * S, Hp.rx * S, Hp.ry * S, 0, 0, 7); g.fill(); g.fillStyle = '#4ab858'; g.beginPath(); g.ellipse(Hp.cx * S, Hp.cy * S, (Hp.rx - 2) * S, (Hp.ry - 2) * S, 0, 0, 7); g.fill();
    g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.beginPath(); g.ellipse(Hp.cx * S, Hp.cy * S, (Hp.rx - 0.2) * S, (Hp.ry - 0.2) * S, 0, 0, 7); g.stroke(); g.fillStyle = '#3a9a48'; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse((Hp.cx - 6 + k * 6) * S, Hp.cy * S, 2 * S, 1.4 * S, 0, 0, 7); g.fill(); } }
  const Pa = BRZ.pao; if (Math.abs(ox + CHP / 2 - Pa.cx * S) < Pa.r * S + CHP && Math.abs(oy + CHP / 2 - Pa.cy * S) < Pa.r * S + CHP) for (let ty = Pa.cy - Pa.r; ty <= Pa.cy + Pa.r; ty++) for (let tx = Pa.cx - Pa.r; tx <= Pa.cx + Pa.r; tx++) {
    const d = Math.hypot((tx - Pa.cx) / Pa.r, (ty - Pa.cy) / (Pa.r * 0.8)); if (d > 0.95 || M.ter[I(tx, ty)] === T.STONE) continue; const hh = hash2(tx, ty, 671), x = tx * S, y = ty * S;
    R(x, y, S, S, d < 0.55 ? (hh < 0.5 ? '#8a8a84' : '#7c7c76') : hh < 0.6 ? '#3e8a48' : '#4e6a4a'); if (d < 0.55) { R(x + 3, y + ((hh * 10) | 0), 9, 1, '#9a9a94'); R(x + ((hh * 12) | 0), y + 4, 1, 7, '#6a6a64'); } else if (hh > 0.5) R(x + 5, y + 5, 4, 4, '#2e7a3a'); }
  // Corcovado: acantilado detrás, escaleras mecánicas y el Cristo Redentor sobre su pedestal oscuro
  const K = BRZ.cris; if (Math.abs(ox + CHP / 2 - K.cx * S) < 18 * S + CHP && oy < (K.cy + 8) * S && oy + CHP > (K.cy - 24) * S) { brCristo(g, K.stat[0] * S + 8, (K.stat[1] + 1) * S + 12);
    for (let k = 0; k < 6; k++) { R((K.cx + 4) * S + k * 3, (K.cy + 2) * S + k * 8, 14, 3, '#9a9aa4'); R((K.cx + 4) * S + k * 3, (K.cy + 2) * S + k * 8 + 3, 14, 1, '#4a4a54'); } }
  // Iguazú: la cascada (cortinas de agua sobre roca), la selva arriba
  const U = BRZ.igu; if (oy < U.r0 * S && oy + CHP > (U.fall - 8) * S && ox < (U.x1 + 1) * S) for (let x = U.x0 * S; x < (U.x1 + 1) * S; x += 2) { if (x < ox - 2 || x > ox + CHP + 2) continue; const hx = hash2(x, 7, 670);
    R(x, (U.fall - 6) * S, 2, 2 * S, hx < 0.5 ? '#2a7a3a' : '#3a8a4a'); R(x, (U.fall - 4) * S, 2, (U.r0 - U.fall + 4) * S, hx < 0.18 ? '#7a5a3a' : hx < 0.6 ? '#f4f8fc' : hx < 0.85 ? '#d8eaf6' : '#b8d8ee'); if (hx > 0.92) R(x, (U.fall - 4) * S, 2, 3 * S, '#6a4a2e'); }
  g.restore(); }
function brCristo(g, cx, base) { const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); }, L0 = '#f0f2ea', L1 = '#d6dace', L2c = '#b8bead', L3 = '#969e8c', L4 = '#788070';
  R(cx - 34, base - 4, 68, 8, '#8a8478'); R(cx - 24, base - 50, 48, 46, '#4a3a2e'); R(cx - 24, base - 50, 8, 46, '#5e4a3a'); R(cx + 16, base - 50, 8, 46, '#382a20'); R(cx - 28, base - 56, 56, 6, '#5a483a'); for (let k = 0; k < 4; k++) R(cx - 14 + k * 9, base - 44, 2, 34, '#382a20');   // pedestal de granito oscuro
  const ft = base - 56; for (let y = 0; y < 120; y++) { const hw = Math.round(9 + (120 - y) * 0.05 + (y > 86 ? (y - 86) * 0.2 : 0)), yy = ft - y; R(cx - hw, yy, hw * 2, 1, L1); R(cx - hw, yy, 3, 1, L0); R(cx + hw - 4, yy, 4, 1, L3); if (y % 11 < 2 && y < 80) R(cx - 2, yy, 1, 1, L3); }
  for (let k = -3; k <= 3; k++) R(cx + k * 3, ft - 40, 1, 40, k > 0 ? L3 : L2c);
  const sh = ft - 120; R(cx - 70, sh, 140, 8, L1); R(cx - 70, sh, 140, 2, L0); R(cx - 70, sh + 7, 140, 1, L4);
  for (const sg of [-1, 1]) { for (let k = 0; k < 42; k++) { const x = cx + sg * (14 + k), dr = Math.round(8 + k * 0.32); R(x, sh + 8, 1, dr, sg < 0 ? L2c : L3); } R(cx + sg * 70 - (sg > 0 ? 5 : 0), sh - 1, 5, 10, L0); }
  R(cx - 4, sh - 5, 8, 5, L2c); R(cx - 8, sh - 23, 16, 18, L1); R(cx - 8, sh - 23, 4, 18, L0); R(cx + 4, sh - 23, 4, 18, L3); R(cx - 9, sh - 26, 18, 6, L2c); R(cx - 9, sh - 20, 3, 12, L2c); R(cx + 6, sh - 20, 3, 12, L3);
  R(cx - 4, sh - 16, 2, 1, L4); R(cx + 2, sh - 16, 2, 1, L4); R(cx - 1, sh - 12, 2, 3, L3); }
// ---------- lo que se mueve (cada fotograma, solo lo visible) ----------
function brLive(M, cx, cy) { const S = 16, C = BRZ.copa, box = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), w, h); };
  const sy = C.sea * S; if (sy - cy > -20 && sy - cy < VH + 20) for (let x = Math.max(C.x0 * S, cx - 8); x < Math.min(M.w * S, cx + VW + 8); x += 8) box(x, sy + Math.sin(x / 30 + G.t * 2) * 3 - 2, 8, 3, 'rgba(255,255,255,.85)');
  // teleférico del Pan de Azúcar
  const p = BRZ.pao, a = { x: p.st[0] * S + 8, y: p.st[1] * S }, b = { x: p.top[0] * S + 8, y: p.top[1] * S - 20 }; if (Math.min(a.x, b.x) - cx < VW + 40 && Math.max(a.x, b.x) - cx > -40 && Math.min(a.y, b.y) - cy < VH + 40 && Math.max(a.y, b.y) - cy > -60) {
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x - cx, a.y - 24 - cy); ctx.lineTo(b.x - cx, b.y - cy); ctx.stroke(); if (ACT.k !== 'brtele') { const t = (G.t * 0.06) % 1; box(a.x + (b.x - a.x) * t - 5, a.y - 24 + (b.y - a.y + 24) * t, 10, 8, '#e8402a'); } box(a.x - 12, a.y - 30, 24, 30, '#d8dce4'); box(a.x - 12, a.y - 30, 24, 4, '#2a9a5a'); }
  // niebla y arcoíris de las cataratas
  const U = BRZ.igu, fy = U.r0 * S; if (fy - cy > -80 && fy - cy < VH + 80 && U.x0 * S - cx < VW) { for (let k = 0; k < 7; k++) { const x = (U.x0 + 4 + k * 6.5) * S + Math.sin(G.t * 0.7 + k) * 12, y = fy + 10 + Math.sin(G.t + k * 2) * 6, r = 50; const gr = ctx.createRadialGradient(x - cx, y - cy, 0, x - cx, y - cy, r); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(x - r - cx, y - r - cy, r * 2, r * 2); }
    ['rgba(255,60,60,.28)', 'rgba(255,170,40,.28)', 'rgba(255,240,60,.28)', 'rgba(60,220,90,.28)', 'rgba(60,140,255,.28)', 'rgba(150,80,220,.28)'].forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc((U.x0 + 23) * S - cx, fy + 160 - cy, 150 - i * 3, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }); }
  // caballos corriendo en el hipódromo
  const Hp = BRZ.hip; if (Math.abs(Hp.cx * S - cx - VW / 2) < VW && Math.abs(Hp.cy * S - cy - VH / 2) < VH) for (let k = 0; k < 4; k++) { const an = G.t * 0.5 + k * 0.35, x = Hp.cx * S + Math.cos(an) * (Hp.rx - 1) * S, y = Hp.cy * S + Math.sin(an) * (Hp.ry - 1) * S; box(x - 6, y - 4, 12, 5, ['#5a3a1a', '#2a1a10', '#8a5a2a', '#f0f0f0'][k]); box(x + (Math.sin(an) > 0 ? -7 : 5), y - 7, 3, 4, ['#5a3a1a', '#2a1a10', '#8a5a2a', '#f0f0f0'][k]); box(x - 2, y - 9, 4, 4, ['#e83a3a', '#2a6ad0', '#f0c020', '#2a9a5a'][k]); } }
// en la plaza del Cristo la cámara sube poco a poco para que se vea la estatua entera (como levantar la vista)
let BR_CAM = 0, BR_CAMA = 0;
hookBefore('updateCamera', () => { if (BR_CAMA && G.cam) { G.cam.y -= BR_CAMA; BR_CAMA = 0; } });   // quita lo del fotograma anterior (no se acumula)
hookAfter('updateCamera', () => { const M = G.map, P = G.P; if (!M || M.id !== 'brasil' || !P) { BR_CAM = 0; return; } const K = BRZ.cris, dx = P.x / 16 - K.stat[0], dy = P.y / 16 - K.stat[1];
  const want = Math.abs(dx) < 11 && dy > 0 && dy < 12 ? -175 : 0; BR_CAM += (want - BR_CAM) * 0.06; if (Math.abs(BR_CAM) > 0.5) { const y0 = G.cam.y; G.cam.y = Math.max(0, y0 + BR_CAM); BR_CAMA = G.cam.y - y0; } });
// ---------- gente (NPCs del motor), comida y puestos ----------
const BR_LOOKS = [['f', 'castano', ['#e83a5a', '#f05a7a', '#f88aa0', '#ffb0c0', '#ffd0dc']], ['m', 'negro', ['#1a6ad0', '#2a84e0', '#4a9af0', '#7ab8f8', '#a8d4ff']], ['f', 'negro', ['#f0c020', '#f8d040', '#ffe070', '#fff0a0', '#fff8d0']], ['m', 'castano', ['#2a9a5a', '#3ab46a', '#5aca84', '#84dca4', '#b0ecc4']], ['f', 'rubio', ['#ff8a3a', '#ffa05a', '#ffb87a', '#ffd0a0', '#ffe4c4']], ['m', 'rubio', ['#f4f4f4', '#e8e8e8', '#d8d8d8', '#c8c8c8', '#b8b8b8']], ['f', 'pelirrojo', ['#2a8a8a', '#3aa4a4', '#5abcbc', '#84d4d4', '#b0ecec']], ['m', 'negro', ['#f0c020', '#2a9a5a', '#2a9a5a', '#3ab46a', '#f0c020']]];
const BR_NAMES = [L2('Carioca', 'Carioca'), L2('Surfista', 'Surfer'), L2('Turista', 'Tourist'), L2('Paseante', 'Walker'), L2('Capoeirista', 'Capoeira player'), L2('Futbolista de playa', 'Beach footballer'), L2('Vecina del morro', 'Morro neighbour'), L2('Fotógrafo', 'Photographer')];
const BR_SPOTS = [['copa', 34], ['favela', 14], ['cristo', 10], ['selaron', 6], ['iguazu', 10], ['lagoa', 6]];
for (let i = 1; i <= 80; i++) { const L = BR_LOOKS[i % BR_LOOKS.length]; NPCS['br_' + i] = { n: i === 1 ? L2('Guía de Río', 'Rio guide') : BR_NAMES[i % BR_NAMES.length], title: L2('Río de Janeiro', 'Rio de Janeiro'), look: LK({ g: L[0], hairStyle: L[0] === 'f' ? 'long' : 'short', hair: HAIRS[L[1]] || HAIRS.negro, main: pal(L[2]) }), lines: [L2('Oi! ¡Bienvenido a Río!', 'Oi! Welcome to Rio!'), L2('¿Ya subiste al Corcovado?', 'Have you been up the Corcovado yet?'), L2('El atardecer en el Arpoador es el mejor del mundo.', 'Sunset at Arpoador is the best in the world.'), L2('En las cataratas te mojas sí o sí.', 'At the falls you get wet no matter what.')], quests: [] }; }
it('br_feijoada', { n: L2('Feijoada', 'Feijoada'), t: 'cons', stack: true, heal: 6000, food: 8, price: 900, icon: ['food', 1], rar: 2, d: L2('Frijoles negros con carne, arroz, farofa y naranja. El plato de los sábados en Brasil.', 'Black beans with meat, rice, farofa and orange. Brazil\'s Saturday dish.') });
it('br_paoqueijo', { n: L2('Pan de queso', 'Cheese bread'), t: 'cons', stack: true, heal: 1500, price: 150, icon: ['food', 5], rar: 1, d: L2('Pão de queijo: bolitas de queso calientes de Minas Gerais.', 'Pão de queijo: warm cheese balls from Minas Gerais.') });
it('br_acai', { n: L2('Tazón de acaí', 'Açaí bowl'), t: 'cons', stack: true, heal: 2500, mana: 1200, price: 400, icon: ['food', 2], rar: 1, d: L2('Acaí helado con plátano y granola, el clásico de la playa.', 'Frozen açaí with banana and granola, the beach classic.') });
it('br_coco', { n: L2('Agua de coco', 'Coconut water'), t: 'cons', stack: true, mana: 1800, price: 120, icon: ['potion'], rar: 1, d: L2('Coco verde helado, servido con pajita en el calçadão.', 'Cold green coconut, served with a straw on the calçadão.') });
it('br_brigadeiro', { n: L2('Brigadeiro', 'Brigadeiro'), t: 'cons', stack: true, heal: 900, price: 90, icon: ['food', 4], rar: 1, d: L2('Bolita de chocolate con granitos: el dulce de todos los cumpleaños brasileños.', 'Chocolate ball with sprinkles: the sweet of every Brazilian birthday.') });
it('br_coxinha', { n: L2('Coxinha', 'Coxinha'), t: 'cons', stack: true, heal: 1800, price: 180, icon: ['food', 3], rar: 1, d: L2('Croqueta en forma de gota rellena de pollo.', 'Teardrop-shaped croquette filled with chicken.') });
const BR_VEND = { br_vend_acai: [L2('Vendedora de acaí', 'Açaí seller'), ['br_acai', 'br_coco'], [128, 115]], br_vend_quiosque: [L2('Quiosco de la playa', 'Beach kiosk'), ['br_coco', 'br_coxinha', 'br_paoqueijo'], [150, 115]], br_vend_feijoada: [L2('Bar de feijoada', 'Feijoada bar'), ['br_feijoada', 'br_brigadeiro'], [112, 90]], br_vend_cristo: [L2('Cafetería del mirador', 'Viewpoint café'), ['br_paoqueijo', 'br_coco', 'br_brigadeiro'], [32, 33]] };
for (const id in BR_VEND) { NPCS[id] = { n: BR_VEND[id][0], title: L2('Comida de Brasil', 'Brazilian food'), look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.negro, main: pal(['#2a9a5a', '#3ab46a', '#f0c020', '#f8d040', '#ffe070']) }), lines: [L2('¡Prueba, está buenísimo!', 'Try it, it\'s delicious!')], quests: [] }; PE_SELL[id] = BR_VEND[id][1]; }
NPCS.br_taquilla = { n: L2('Mostrador del Galeão', 'Galeão desk'), title: L2('Vuelos', 'Flights'), look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.castano, main: pal(['#1a3a7a', '#26508a', '#3a6aaa', '#5488c8', '#78a8e0']) }), lines: [L2('¡Boa viagem!', 'Boa viagem!')], quests: [] };
NPCS.br_tele = { n: L2('Teleférico (Praia Vermelha)', 'Cable car (Praia Vermelha)'), title: L2('Pan de Azúcar', 'Sugarloaf'), look: LK({ g: 'm', hairStyle: 'short', hair: HAIRS.negro, main: pal(['#8a1a1a', '#a82626', '#c83434', '#e04a46', '#f06a5e']) }), lines: [L2('La vista desde arriba es inolvidable.', 'The view from the top is unforgettable.')], quests: [] };
NPCS.br_tele2 = Object.assign({}, NPCS.br_tele, { n: L2('Teleférico (cima)', 'Cable car (summit)') });
NPCS.br_barquero = { n: L2('Barquero de las cataratas', 'Falls boatman'), title: L2('Bote bajo la Garganta', 'Boat under the Throat'), look: LK({ g: 'm', hairStyle: 'short', hair: HAIRS.negro, main: pal(['#e85a1a', '#f07a2a', '#f89a4a', '#ffba6a', '#ffd89a']) }), lines: [L2('Agárrate fuerte: la corriente empuja hacia atrás.', 'Hold on tight: the current pushes you back.')], quests: [] };
NPCS.br_ceramista = { n: L2('Ceramista de Lapa', 'Lapa ceramist'), title: L2('Mosaico de la escalera', 'Stairway mosaic'), look: LK({ g: 'm', hairStyle: 'short', hair: HAIRS.blanco || HAIRS.gris, main: pal(['#c82a1a', '#e03a2a', '#f05a3a', '#f88060', '#ffa888']) }), lines: [L2('Cada azulejo lo trajo alguien de un país distinto.', 'Every tile was brought by someone from a different country.')], quests: [] };
function brPeople(M) { const R = new RNG(6621); let id = 2;
  const free = (x, y) => { for (let k = 0; k < 20; k++) { const tx = Math.round(x + (R.f() - 0.5) * 6), ty = Math.round(y + (R.f() - 0.5) * 4); if (tx > 1 && ty > 1 && tx < M.w - 1 && ty < M.h - 1 && !blockedFor(M, tx, ty, 0)) return [tx * 16 + 8, ty * 16 + 8]; } return null; };
  const a = spawnNPC('br_1', 128 * 16, (BRZ.copa.cal + 1) * 16, M.id, { face: 'down', wander: 2 });
  for (const [zk, n] of BR_SPOTS) { const z = BR_ZONES.find(q => q.k === zk); for (let k = 0; k < n && id <= 80; k++, id++) { let p = null;
    if (zk === 'copa') p = free(BRZ.copa.x0 + 4 + R.f() * (BRZ.copa.x1 - BRZ.copa.x0 - 8), BRZ.copa.cal + R.f() * 10); else p = free(z.p[0] + (R.f() - 0.5) * 14, z.p[1] + (R.f() - 0.5) * 10);
    if (p) spawnNPC('br_' + id, p[0], p[1], M.id, { face: ['down', 'left', 'right', 'up'][k % 4], wander: 3 }); } }
  for (const vid in BR_VEND) { const [x, y] = BR_VEND[vid][2]; spawnNPC(vid, x * 16 + 8, y * 16 + 8, M.id, { face: 'down', wander: 0 }); }
  spawnNPC('br_taquilla', BRZ.air.door[0] * 16 + 8, (BRZ.air.door[1] + 2) * 16, M.id, { face: 'down', wander: 0 });
  spawnNPC('br_tele', (BRZ.pao.st[0] - 2) * 16, (BRZ.pao.st[1] + 1) * 16, M.id, { face: 'down', wander: 0 });
  spawnNPC('br_tele2', (BRZ.pao.top[0] - 2) * 16, (BRZ.pao.top[1]) * 16 + 8, M.id, { face: 'down', wander: 0 });
  spawnNPC('br_barquero', (BRZ.igu.dock[0] + 2) * 16, (BRZ.igu.dock[1] - 1) * 16, M.id, { face: 'left', wander: 0 });
  spawnNPC('br_ceramista', (BRZ.sel.x0 + 3) * 16, (BRZ.sel.y1 + 2) * 16, M.id, { face: 'up', wander: 0 }); }
// ---------- viaje ----------
function goBrasil() { const P = G.P, M = makeBrasil(); if (P.map === 'world' || !P.retX) { P.retX = SA.term.door * 16 + 8; P.retY = (SA.term.y + SA.term.h + 1) * 16 + 8; }
  transition(() => { P.inside = 'brasil'; setMap(M, BRZ.air.spawn[0] * 16 + 8, BRZ.air.spawn[1] * 16, 'down'); banner(L2('¡Bem-vindo ao Brasil!', 'Bem-vindo ao Brasil!'), L2('Río de Janeiro · Aeropuerto del Galeão', 'Rio de Janeiro · Galeão Airport')); if (typeof stampAdd === 'function') try { stampAdd('m_brasil'); } catch (e) { } markDirty(true); }); }
hookAround('makeInterior', (next, id, ...a) => id === 'brasil' ? makeBrasil() : next(id, ...a));
DLG_HOOKS.push((npc, opts) => { if (!npc) return; const P = G.P;
  if (npc.id === 'ae_taquilla' || npc.id === 'pe_taquilla' || npc.id === 'mx_taquilla' || npc.id === 'es_taquilla') opts.splice(1, 0, { label: '🎫 ' + L2('Billete a Río de Janeiro · ', 'Ticket to Rio de Janeiro · ') + BR_TICKET.toLocaleString() + L2(' de oro', ' gold'), icon: ['coin'], fn: () => { if (P.aeTk === 'br') { typeText(L2('Ya tienes ese billete. Embarca por la Puerta 1.', 'You already have that ticket. Board at Gate 1.')); return; } if (P.gold < BR_TICKET) { typeText(L2('No te alcanza el oro.', 'Not enough gold.')); return; } P.gold -= BR_TICKET; P.aeTk = 'br'; sfx('coin'); markDirty(true); typeText(L2('¡Aquí tienes tu billete a Río! Embarca por la Puerta 1.', 'Here is your ticket to Rio! Board at Gate 1.')); } });
  if (npc.id === 'br_taquilla') { const fly = (dest, lab, fn) => opts.unshift({ label: '✈ ' + lab + ' · ' + BR_TICKET.toLocaleString() + L2(' de oro', ' gold'), icon: ['ways'], fn: () => { if (P.gold < BR_TICKET) { typeText(L2('No te alcanza el oro.', 'Not enough gold.')); return; } P.gold -= BR_TICKET; markDirty(true); closeDialog(); flightCine('RIO · ' + dest, fn); } });
    fly('MADRID', L2('Volar a España', 'Fly to Spain'), () => goEspana()); fly('CDMX', L2('Volar a México', 'Fly to Mexico'), () => goMexico()); fly('LIMA', L2('Volar a Lima', 'Fly to Lima'), () => goLima()); fly('ALBOR', L2('Volar a Albor', 'Fly to Albor'), () => aeArriveAlbor()); } });
XACT.ae_embarcar[2] = (orig => o => { const P = G.P, M = G.map; if (!M || !M.aeIn || P.aeTk !== 'br') return orig(o); const b = aeBoarding();
  if (!b.open) { xMsg('✈ ' + L2('Puerta 1', 'Gate 1'), L2('El avión todavía no ha llegado a la puerta. Embarque en ', 'The plane has not reached the gate yet. Boarding in ') + b.wait + L2(' segundos.', ' seconds.')); return; }
  const city = { mx: 'CDMX', pe: 'LIMA', es: 'MADRID', jp: 'TOKIO' }[M.aeIn] || 'ALBOR'; P.aeTk = null; markDirty(true); flightCine(city + ' · RIO', () => goBrasil()); })(XACT.ae_embarcar[2]);
// ---------- actividad 1: teleférico del Pan de Azúcar (viaje en la cabina por el cable) ----------
DLG_HOOKS.push((npc, opts) => { if (!npc || (npc.id !== 'br_tele' && npc.id !== 'br_tele2') || ACT.k) return; const up = npc.id === 'br_tele'; opts.unshift({ label: '🚡 ' + (up ? L2('Subir al Pan de Azúcar', 'Ride up the Sugarloaf') : L2('Bajar a la playa', 'Ride down to the beach')), cls: 'quest', icon: ['ways'], fn: () => { closeDialog(); brTele(up); } }); });
function brTele(up) { const p = BRZ.pao, a = { x: p.st[0] * 16 + 8, y: p.st[1] * 16 - 8 }, b = { x: p.top[0] * 16 + 8, y: p.top[1] * 16 + 8 }; Object.assign(ACT, { k: 'brtele', t: 0, from: up ? a : b, to: up ? b : a }); sfx('door'); banner('🚡 ' + L2('Teleférico', 'Cable car'), up ? L2('Subiendo al Pan de Azúcar…', 'Going up the Sugarloaf…') : L2('Bajando a Praia Vermelha…', 'Going down to Praia Vermelha…')); }
V33_TICKS.push(dt => { if (ACT.k !== 'brtele') return; const P = G.P, A = ACT; A.t += dt || 0.016; const k = Math.min(1, A.t / 7), e = k * k * (3 - 2 * k); P.x = A.from.x + (A.to.x - A.from.x) * e; P.y = A.from.y + (A.to.y - A.from.y) * e; P.z = Math.sin(k * Math.PI) * 40; P.dir = 'down';
  if (k >= 1) { P.z = 0; actEnd(); const S = brS(), first = !S.pao; S.pao = 1; if (first) { P.gold += 5000; banner('🚡 ' + L2('¡Cima del Pan de Azúcar!', 'Top of the Sugarloaf!'), L2('Primera vez: +5.000 de oro', 'First time: +5,000 gold')); } markDirty(true); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'brtele') return; const P = G.P, x = P.x - cx, y = P.y - cy - (P.z || 0); ctx.fillStyle = 'rgba(232,64,42,.9)'; ctx.fillRect(x - 13, y - 44, 26, 36); ctx.fillStyle = 'rgba(180,220,255,.55)'; ctx.fillRect(x - 10, y - 40, 20, 14); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x - 1, y - 52, 2, 8); });
// ---------- actividad 2: bote bajo las cataratas (la corriente te empuja; aguanta en la niebla y vuelve) ----------
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'br_barquero' || ACT.k) return; const S = brS(); opts.unshift({ label: '🚤 ' + L2('Bote bajo la Garganta del Diablo', 'Boat under the Devil\'s Throat') + (S.bote ? ' · ' + L2('récord ', 'best ') + S.bote.toFixed(1) + ' s' : ''), cls: 'quest', icon: ['ways'], fn: () => { closeDialog(); brBote(); } }); });
function brBote() { const U = BRZ.igu, P = G.P; const rocks = []; for (let k = 0; k < 9; k++) rocks.push({ x: (U.x0 + 6 + (k * 37) % (U.x1 - U.x0 - 12)) * 16, y: (U.r0 + 8 + (k * 11) % 26) * 16, r: 12 });
  Object.assign(ACT, { k: 'brbote', t: 0, x: (U.dock[0] - 4) * 16, y: U.dock[1] * 16, vx: 0, vy: 0, soak: 0, done: 0, cd: 0, rocks, onAtk: () => { if (ACT.cd > 0) return true; ACT.cd = 2.5; const jx = inp.jx || 0, jy = inp.jy || -1, L = Math.hypot(jx, jy) || 1; ACT.vx += jx / L * 120; ACT.vy += jy / L * 120; sfx('ui'); return true; } });
  banner('🚤 ' + L2('¡Al agua!', 'Into the water!'), L2('Joystick para remar. La corriente te empuja hacia atrás. Llega a la niebla bajo la cascada, aguanta 3 s y vuelve al embarcadero. ⚔ = acelerón.', 'Joystick to steer. The current pushes you back. Reach the mist under the falls, hold for 3 s and return to the dock. ⚔ = boost.')); }
V33_TICKS.push(dt => { if (ACT.k !== 'brbote') return; dt = Math.min(0.05, dt || 0.016); const P = G.P, A = ACT, U = BRZ.igu, M = G.map; if (!M || M.id !== 'brasil' || P.dead) { actEnd(); return; } A.t += dt; A.cd = Math.max(0, A.cd - dt);
  const near = Math.max(0, 1 - (A.y / 16 - U.r0) / 30); A.vx += (inp.jx || 0) * 150 * dt; A.vy += (inp.jy || 0) * 150 * dt + (20 + 110 * near) * dt; A.vx *= 1 - dt * 1.2; A.vy *= 1 - dt * 1.2; A.vx += Math.sin(G.t * 2 + A.y / 40) * 30 * dt;
  A.x = Math.max((U.x0 + 3) * 16, Math.min((U.x1 - 3) * 16, A.x + A.vx * dt)); A.y = Math.max((U.r0 + 0.5) * 16, Math.min((U.r1 - 0.5) * 16, A.y + A.vy * dt));
  for (const r of A.rocks) { const dx = A.x - r.x, dy = A.y - r.y, d = Math.hypot(dx, dy); if (d < r.r + 8) { A.x = r.x + dx / d * (r.r + 8); A.y = r.y + dy / d * (r.r + 8); A.vx = dx / d * 60; A.vy = dy / d * 60; G.shake = 2; } }
  P.x = A.x; P.y = A.y; P.dir = A.vy < -10 ? 'up' : A.vy > 10 ? 'down' : A.vx > 0 ? 'right' : 'left';
  const inMist = A.y / 16 < U.r0 + 4; if (!A.done && inMist) { A.soak += dt; if (Math.random() < 0.5) part(A.x + (Math.random() - 0.5) * 30, A.y - 20, { vz: 40, vx: (Math.random() - 0.5) * 60, g: 60, life: 0.6, c: '#e8f4ff', s: 2 }); if (A.soak >= 3) { A.done = 1; floatText(A.x, A.y - 40, L2('¡Empapado! Vuelve al embarcadero', 'Soaked! Back to the dock'), '#9ad8ff'); sfx('coin'); } } else if (!A.done) A.soak = Math.max(0, A.soak - dt * 0.5);
  mgHud(`🚤 ${A.done ? L2('¡vuelve al embarcadero!', 'back to the dock!') : L2('niebla ', 'mist ') + A.soak.toFixed(1) + '/3 s'} · ⏱ ${Math.max(0, Math.ceil(90 - A.t))}s${A.cd > 0 ? '' : ' · ⚔'}`);
  const atDock = Math.hypot(A.x - U.dock[0] * 16, A.y - U.dock[1] * 16) < 40;
  if ((A.done && atDock) || A.t >= 90) { const win = A.done && atDock, S = brS(), first = S.boteD !== calDay(); if (win) { S.boteD = calDay(); if (!S.bote || A.t < S.bote) S.bote = +A.t.toFixed(2); } const g = win ? (first ? 3000 + P.lv * 30 + Math.round(Math.max(0, 90 - A.t) * 40) : 600) : 0; P.gold += g;
    P.x = (U.dock[0] + 1) * 16; P.y = (U.dock[1] - 2) * 16; actEnd(); markDirty(true); sfx(win ? 'questdone' : 'hurt'); banner('🚤 ' + (win ? L2('¡Lo lograste!', 'You made it!') : L2('Se acabó el tiempo', 'Time is up')), win ? A.t.toFixed(1) + ' s · +' + fmt(g) + L2(' oro', ' gold') : ''); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'brbote') return; const A = ACT; for (const r of A.rocks) { ctx.fillStyle = '#5a5048'; ctx.beginPath(); ctx.ellipse(r.x - cx, r.y - cy, r.r, r.r * 0.7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(r.x - cx - r.r, r.y - cy + 4, r.r * 2, 2); }
  const x = A.x - cx, y = A.y - cy; ctx.fillStyle = '#e8601a'; ctx.beginPath(); ctx.ellipse(x, y + 2, 16, 7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 14, y + 6, 28, 2); });
hookAround('updatePlayer', (next, dt, ...a) => { if (ACT.k !== 'brbote' && ACT.k !== 'brtele') return next(dt, ...a); const P = G.P, x = P.x, y = P.y, d = P.dir; const r = next(dt, ...a); P.x = x; P.y = y; P.dir = d; return r; });
// ---------- actividad 3: mosaico de la escalera (lleva cada azulejo a su escalón del mismo color) ----------
const BR_TC = [['#f0b020', L2('amarillo', 'yellow')], ['#2a4ac8', L2('azul', 'blue')], ['#2a9a6a', L2('verde', 'green')]];
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'br_ceramista' || ACT.k) return; const S = brS(); opts.unshift({ label: '🧩 ' + L2('Devolver los azulejos caídos a la escalera', 'Put the fallen tiles back on the stairs') + (S.mosD === calDay() ? L2(' (hoy ya: premio pequeño)', ' (done today: small prize)') : ''), cls: 'quest', icon: ['gem', '#f0b020'], fn: () => { closeDialog(); brMos(); } }); });
function brMos() { const Sl = BRZ.sel, M = G.map, tiles = [], slots = [];
  for (let k = 0; k < 8; k++) { const c = k % 3, y = Sl.y0 + 3 + k * 4, x = Sl.x0 + 1 + (k * 2) % (Sl.x1 - Sl.x0 - 1); slots.push({ x: x * 16 + 8, y: y * 16 + 8, c, ok: 0 }); }
  for (let k = 0; k < 8; k++) { const c = slots[k].c; let p = null; for (let q = 0; q < 20 && !p; q++) { const tx = 112 + Math.floor(Math.random() * 24), ty = Sl.y1 + 2 + Math.floor(Math.random() * 8); if (!blockedFor(M, tx, ty, 0)) p = { x: tx * 16 + 8, y: ty * 16 + 8 }; } if (!p) p = { x: (Sl.x0 + 2) * 16, y: (Sl.y1 + 3) * 16 }; tiles.push({ x: p.x, y: p.y, c, got: 0, put: 0 }); }
  Object.assign(ACT, { k: 'brmos', t: 0, tiles, slots, hold: null, n: 0 }); banner('🧩 ' + L2('Mosaico de la Selarón', 'Selarón mosaic'), L2('Recoge un azulejo caído (al tocarlo) y llévalo a un escalón que brille con su mismo color. Solo puedes llevar uno. 2 minutos.', 'Pick up a fallen tile (by touching it) and carry it to a step glowing with the same colour. You can only carry one. 2 minutes.')); }
V33_TICKS.push(dt => { if (ACT.k !== 'brmos') return; const P = G.P, A = ACT, M = G.map; if (!M || M.id !== 'brasil' || P.dead) { actEnd(); return; } A.t += dt || 0.016;
  if (!A.hold) { const t = A.tiles.find(t => !t.got && Math.hypot(P.x - t.x, P.y - t.y) < 16); if (t) { t.got = 1; A.hold = t; sfx('ui'); floatText(P.x, P.y - 40, '🧩 ' + BR_TC[t.c][1], BR_TC[t.c][0]); } }
  else { const s = A.slots.find(s => !s.ok && Math.hypot(P.x - s.x, P.y - s.y) < 16); if (s) { if (s.c === A.hold.c) { s.ok = 1; A.hold.put = 1; A.hold = null; A.n++; sfx('coin'); burst(s.x, s.y - 4, 10, { sp: 40, up: 40, g: 60, life: 0.6, c: [BR_TC[s.c][0], '#ffffff'] }); } else if (!s.warn || G.t - s.warn > 1.5) { s.warn = G.t; floatText(s.x, s.y - 30, L2('No encaja', 'It doesn\'t fit'), '#ff8a8a'); } } }
  mgHud(`🧩 ${A.n}/8 · ${A.hold ? L2('llevas: ', 'carrying: ') + BR_TC[A.hold.c][1] : L2('busca un azulejo', 'find a tile')} · ⏱ ${Math.max(0, Math.ceil(120 - A.t))}s`);
  if (A.n >= 8 || A.t >= 120) { const S = brS(), first = S.mosD !== calDay(); S.mosD = calDay(); const g = first ? (1500 + P.lv * 20) * A.n / 8 + (A.n >= 8 ? 2000 : 0) : 100 * A.n; P.gold += Math.round(g); actEnd(); markDirty(true); sfx(A.n >= 8 ? 'questdone' : 'coin'); banner('🧩 ' + A.n + '/8', '+' + fmt(Math.round(g)) + L2(' oro', ' gold')); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'brmos') return; const A = ACT; for (const s of A.slots) { if (s.ok) continue; const a = 0.35 + 0.25 * Math.sin(G.t * 5); ctx.strokeStyle = BR_TC[s.c][0]; ctx.globalAlpha = a + 0.3; ctx.lineWidth = 2; ctx.strokeRect(s.x - 7 - cx, s.y - 7 - cy, 14, 14); ctx.globalAlpha = 1; }
  for (const t of A.tiles) { if (t.got) continue; ctx.fillStyle = BR_TC[t.c][0]; ctx.fillRect(t.x - 4 - cx, t.y - 3 - cy, 8, 6); ctx.fillStyle = '#ffffff'; ctx.fillRect(t.x - 4 - cx, t.y - 3 - cy, 8, 1); }
  if (A.hold) { const P = G.P; ctx.fillStyle = BR_TC[A.hold.c][0]; ctx.fillRect(P.x - 5 - cx, P.y - 50 - cy, 10, 8); ctx.fillStyle = '#ffffff'; ctx.fillRect(P.x - 5 - cx, P.y - 50 - cy, 10, 2); } });
// ---------- guardado, ciudad, mapa y Lupa ----------
function brS() { const P = G.P; return P.br && typeof P.br === 'object' ? P.br : (P.br = {}); }
SAVEKEYS.push('br');
if (typeof V74_CITY !== 'undefined') V74_CITY.brasil = { re: /^br_\d+$/, c: 'mx', a: 'br_1' };
hookAfter('startGame', () => { try { const P = G.P; if (P && P.inside === 'brasil' && G.map && G.map.id !== 'brasil') { const M = makeBrasil(); setMap(M, BRZ.air.spawn[0] * 16 + 8, BRZ.air.spawn[1] * 16, 'down'); } } catch (e) { errOnce('br carga', e); } });
if (typeof MAPC !== 'undefined') MAPC.br = ['Brasil', 'Brazil', '#3ad06a', 'flag'];
hookAfter('otherPOI', (out, M) => { if (!Array.isArray(out) || !M || M.id !== 'brasil') return; for (const z of BR_ZONES) out.push({ c: 'br', x: z.p[0], y: z.p[1], t: z.n });
  out.push({ c: 'br', x: BRZ.pao.st[0], y: BRZ.pao.st[1], t: '🚡 ' + L2('Teleférico al Pan de Azúcar', 'Cable car to the Sugarloaf') }); out.push({ c: 'br', x: BRZ.igu.dock[0], y: BRZ.igu.dock[1], t: '🚤 ' + L2('Bote bajo la cascada', 'Boat under the falls') }); out.push({ c: 'br', x: BRZ.sel.x0 + 3, y: BRZ.sel.y1 + 2, t: '🧩 ' + L2('Mosaico de la escalera', 'Stairway mosaic') }); });
if (typeof MAPW_LIST !== 'undefined') MAPW_LIST.push({ id: 'brasil', n: L2('Brasil · Río e Iguazú', 'Brazil · Rio and Iguazu'), mk: () => makeBrasil(), how: L2('Avión desde Albor, Lima, México o España (2.500 de oro).', 'Plane from Albor, Lima, Mexico or Spain (2,500 gold).') });
if (typeof LUPA_CIU !== 'undefined') LUPA_CIU.push(['brasil662', '🇧🇷 ' + L2('Brasil: Río de Janeiro e Iguazú', 'Brazil: Rio de Janeiro and Iguazu'), () => [
  L2('✈ Billete a Río (2.500 de oro) en las taquillas de los aeropuertos de Albor, Lima, México y España; embarca por la Puerta 1. En el Galeão, el mostrador te lleva de vuelta.', '✈ Ticket to Rio (2,500 gold) at the airport desks of Albor, Lima, Mexico and Spain; board at Gate 1. At Galeão, the desk flies you back.'),
  L2('🏖 Copacabana: edificios frente al mar, la avenida Atlântica, el calçadão de ondas blancas y negras, sombrillas, quioscos (acaí, coco, coxinha, pan de queso) y mucha gente. 🚡 El teleférico de Praia Vermelha sube al Pan de Azúcar.', '🏖 Copacabana: seafront buildings, Avenida Atlântica, the black-and-white wave calçadão, umbrellas, kiosks (açaí, coconut, coxinha, cheese bread) and lots of people. 🚡 The Praia Vermelha cable car goes up the Sugarloaf.'),
  L2('⛰ Corcovado: el camino sube por la selva hasta la plaza del Cristo Redentor (pedestal de granito, escaleras mecánicas, toldos verdes del mirador). 🏘 El morro: casas de ladrillo con tanques azules y callejones. 🧩 Lapa: la Escalera Selarón y sus arcos; ayuda al ceramista a devolver los azulejos.', '⛰ Corcovado: the path climbs through the jungle to the Christ the Redeemer square (granite pedestal, escalators, green viewpoint awnings). 🏘 The morro: brick houses with blue tanks and alleys. 🧩 Lapa: the Selarón Steps and the arches; help the ceramist put the tiles back.'),
  L2('🌈 Cataratas del Iguazú: pasarelas sobre el río hasta la Garganta, niebla y arcoíris. 🚤 El barquero te deja pilotar el bote: la corriente empuja hacia atrás; aguanta 3 s en la niebla y vuelve. 🐎 La Lagoa con el hipódromo. Comida: feijoada, brigadeiro, acaí, agua de coco.', '🌈 Iguazu Falls: walkways over the river to the Throat, mist and rainbow. 🚤 The boatman lets you pilot the boat: the current pushes back; hold 3 s in the mist and come back. 🐎 The Lagoa with the racecourse. Food: feijoada, brigadeiro, açaí, coconut water.')], () => null]);
