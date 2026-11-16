// ================= v4.96: JAPÓN (sexta parte): TAKAYAMA Y HIGASHIYAMA =================
// El mapa crece hacia el este (320 → 420 de ancho). Al otro lado del río Kamo:
//   · Takayama, pueblo de la era Edo (norte): calles de casas de madera oscura con celosías, acequias, linternas,
//     hortensias, sakagura (bodegas de sake con bola de cedro), mercado de la mañana y puesto de rickshaw.
//   · Higashiyama, Kioto antiguo (sur): calle en cuesta con terrazas, muros de piedra y escaleras que suben hasta la
//     pagoda, cerezos llorones, casas de té, sombrillas rojas y taller de cerámica.
// Trabajos y cosas que hacer SIN poder (Sergio no quiere más fuerza): conductor de rickshaw, maestro sakero, maestro del
// té y ceramista (oficios con oro y objetos para vender o decorar), mercado de la mañana. Mucha gente nueva.
// Nota: el panel del mapa de los otros mundos ya se puede ampliar (+/−) y mover con el dedo (6zt_v39.js).

const JE = { x0: 322, x1: 416, river: [317, 320], tk: { y0: 4, y1: 98 }, hi: { y0: 102, y1: 204 } };
const TK_LANES = [22, 38, 54, 70, 86], TK_ALLEYS = [340, 370, 400], HI_T = [190, 176, 162, 148, 134, 120], HI_ST = [364, 371];
JP_ZONES.unshift({ k: 'takayama', n: L2('Takayama · Pueblo Edo', 'Takayama · Edo town'), mn: 'Takayama', j: '高山', x0: 317, x1: 416, y0: 3, y1: 99 },
  { k: 'higashiyama', n: L2('Higashiyama · Kioto antiguo', 'Higashiyama · Old Kyoto'), mn: 'Higashiyama', j: '東山', x0: 317, x1: 416, y0: 100, y1: 205 });

// ---------- edificios: casas Edo (madera oscura, celosías, bola de cedro) y casas de Kioto (tejas grises, farolillos) ----------
JP_H_OF.edo = v => 60 + (v % 2) * 10; JP_H_OF.kyo = v => 56 + (v % 2) * 10; JP_ROOF.edo = ['#3a2e28', '#463830']; JP_ROOF.kyo = ['#5a6070', '#4e5462'];
const EDO_SIGN = ['酒', '味噌', '宿', '茶', '団子', '和紙', '漆', '酒蔵', '醤油', '民芸'];
function jpEdo(w, v) { const W = w * 16, H = JP_H_OF.edo(v), [c, g] = XC(W, H), R = (x, y, ww, hh, col) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); }, wd = '#3a2418', wd2 = '#4e3220', wd3 = '#6a4630';
  R(0, 18, W, H - 18, wd2); g.fillStyle = '#2a2a30'; g.beginPath(); g.moveTo(-4, 20); g.lineTo(W + 4, 20); g.lineTo(W - 2, 4); g.lineTo(2, 4); g.fill(); g.fillStyle = '#3a3a42'; for (let x = 4; x < W - 2; x += 3) g.fillRect(x, 6, 1, 13);
  // piso de arriba con celosía y alero intermedio
  R(2, 22, W - 4, 14, wd); for (let x = 3; x < W - 3; x += 2) R(x, 22, 1, 14, wd3); R(-2, 36, W + 4, 3, '#2a2a30'); R(-2, 36, W + 4, 1, '#4a4a52');
  // planta baja: celosía (kōshi), noren y puerta
  for (let x = 2; x < W - 2; x += 2) R(x, 42, 1, H - 46, wd); const nx = (W >> 1) - 9, nc = ['#1e2a5a', '#5a1e1e', '#2a4a2a', '#e8dcc0'][(v + w) % 4]; R(nx, 42, 18, 11, nc); for (let k = 1; k < 3; k++) R(nx + k * 6, 42, 1, 11, nc === '#e8dcc0' ? wd : '#e8dcc0');
  R(nx + 2, 53, 14, H - 56, '#1a120c'); if (v % 5 === 1) { g.fillStyle = '#6a7a3a'; g.beginPath(); g.arc(W - 9, 44, 6, 0, 7); g.fill(); g.fillStyle = '#4a5a2a'; for (let k = 0; k < 6; k++) g.fillRect(W - 13 + (k * 3) % 8, 40 + (k * 5) % 8, 1, 1); R(W - 10, 36, 2, 3, wd); }
  // cartel vertical de madera con letras
  const t = EDO_SIGN[(v + w) % EDO_SIGN.length]; R(3, 40, 11, t.length * 11 + 4, '#d8c8a0'); R(3, 40, 11, 1, '#f0e4c4'); jpText(g, t, 3, 41, '#1a1a1a', 10, true);
  if (v % 3 === 0) { g.fillStyle = '#ffd08a'; g.beginPath(); g.ellipse(W - 6, 40, 3, 4, 0, 0, 7); g.fill(); R(W - 8, 35, 4, 1, '#1a1a1a'); }
  R(0, H - 3, W, 3, '#5a5650'); return { c, ax: W / 2, ay: H - 1 }; }
function jpKyo(w, v) { const W = w * 16, H = JP_H_OF.kyo(v), [c, g] = XC(W, H), R = (x, y, ww, hh, col) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); }, wd = '#4a2e1e', wd2 = '#6a4430';
  R(0, 16, W, H - 16, '#e8dcc4'); g.fillStyle = '#5a6070'; g.beginPath(); g.moveTo(-5, 18); g.quadraticCurveTo(W / 2, 12, W + 5, 18); g.lineTo(W - 4, 2); g.lineTo(4, 2); g.fill(); g.fillStyle = '#6a7080'; for (let x = 4; x < W - 2; x += 3) g.fillRect(x, 4, 1, 13); R(-4, 17, W + 8, 2, '#3a4050');
  R(0, 22, W, 3, wd); for (let x = 2; x < W; x += 3) R(x, 25, 1, H - 28, wd2); R(4, 26, W - 8, 10, 'rgba(255,240,210,0.5)');
  const kind = v % 4, nx = (W >> 1) - 9; if (kind === 1) { R(nx, 38, 18, 10, '#2a5a2a'); jpText(g, '茶', nx + 4, 37, '#ffffff', 10); } else if (kind === 2) { R(nx, 38, 18, 10, '#6a3a1a'); jpText(g, '陶', nx + 4, 37, '#ffffff', 10); } else { R(nx, 38, 18, 10, ['#5a1e1e', '#1e2a5a'][v % 2]); for (let k = 1; k < 3; k++) R(nx + k * 6, 38, 1, 10, '#e8dcc0'); }
  R(nx + 2, 48, 14, H - 51, '#2a1a12'); for (const x of [3, W - 10]) { g.fillStyle = '#e8281e'; g.beginPath(); g.ellipse(x + 3, 30, 3, 5, 0, 0, 7); g.fill(); R(x + 1, 25, 4, 1, '#1a1a1a'); }
  if (kind === 3) { R(W - 18, 40, 14, H - 44, '#c8b880'); for (let k = 0; k < 3; k++) R(W - 16 + k * 4, 42, 3, 10, ['#c81e3a', '#2c4088', '#9a6ad0'][k]); }
  R(0, H - 3, W, 3, '#6a665e'); return { c, ax: W / 2, ay: H - 1 }; }
{ const _jb = jpBld; jpBld = function (key) { const [, kind, ws, vs] = key.split('_'); if (kind === 'edo') return jpEdo(+ws, +vs); if (kind === 'kyo') return jpKyo(+ws, +vs); return _jb.apply(this, arguments); }; }
{ const _bl = jpBldLights; jpBldLights = function (kind, w) { if (kind === 'edo' || kind === 'kyo') return [[0, -26, 34, 'rgba(255,190,110,0.5)']]; return _bl.apply(this, arguments); }; }

// ---------- decorado ----------
XSPR.jp_shidare = () => { const [c, g] = XC(64, 70); g.fillStyle = '#4a2e22'; g.fillRect(29, 30, 6, 40); g.fillRect(24, 36, 6, 3); g.fillRect(34, 34, 8, 3);
  for (let k = 0; k < 26; k++) { const x = 4 + (k * 37) % 56, len = 22 + (k * 13) % 26; for (let y = 10; y < 10 + len; y += 2) { g.fillStyle = ['#ffc8dc', '#f6a8c4', '#ffe0ec', '#f090b4'][(k + y) % 4]; g.fillRect(x + Math.round(Math.sin(y * 0.2 + k) * 1.5), y, 2, 2); } }
  g.fillStyle = '#ffd0e0'; g.beginPath(); g.ellipse(32, 14, 26, 10, 0, 0, 7); g.fill(); g.fillStyle = '#f6a8c4'; for (let k = 0; k < 20; k++) g.fillRect(8 + (k * 23) % 48, 6 + (k * 7) % 14, 2, 2); return { c, ax: 32, ay: 69 }; };
XSPR.jp_nodate = () => { const [c, g] = XC(40, 46); g.fillStyle = '#5a3418'; g.fillRect(19, 10, 2, 36); g.fillStyle = '#c81e1e'; g.beginPath(); g.moveTo(20, 0); g.lineTo(40, 12); g.lineTo(0, 12); g.fill(); g.fillStyle = '#e8402a'; g.beginPath(); g.moveTo(20, 1); g.lineTo(30, 7); g.lineTo(10, 7); g.fill();
  g.fillStyle = '#c81e1e'; g.fillRect(2, 32, 36, 5); g.fillStyle = '#9a1414'; g.fillRect(2, 37, 36, 2); g.fillStyle = '#5a3418'; g.fillRect(4, 39, 2, 7); g.fillRect(34, 39, 2, 7); g.fillStyle = '#4a7a3a'; g.fillRect(14, 29, 5, 3); g.fillStyle = '#f4ecd8'; g.fillRect(22, 29, 4, 3); return { c, ax: 20, ay: 45 }; };
XSPR.jp_maceta = () => { const [c, g] = XC(18, 22); g.fillStyle = '#7a5030'; g.fillRect(4, 14, 10, 8); g.fillStyle = '#9a6a3a'; g.fillRect(3, 13, 12, 2); for (let k = 0; k < 7; k++) { g.fillStyle = ['#7a8ae8', '#a07ae0', '#5aa0e8', '#c88ae0', '#f0f0ff'][k % 5]; g.beginPath(); g.arc(4 + (k * 5) % 11, 6 + (k % 3) * 3, 3, 0, 7); g.fill(); } g.fillStyle = '#3a6a2a'; g.fillRect(6, 11, 6, 3); return { c, ax: 9, ay: 21 }; };
XSPR.jp_barril = () => { const [c, g] = XC(18, 20); g.fillStyle = '#8a6a3a'; g.fillRect(2, 4, 14, 16); g.fillStyle = '#6a4a24'; g.fillRect(2, 7, 14, 1); g.fillRect(2, 15, 14, 1); g.fillStyle = '#e8dcc0'; g.fillRect(5, 9, 8, 5); jpText(g, '酒', 4, 7, '#c81e1e', 10); return { c, ax: 9, ay: 19 }; };
XSPR.jp_puente_rojo = () => { const [c, g] = XC(96, 30); g.fillStyle = '#c8281e'; g.fillRect(0, 6, 96, 3); g.fillRect(0, 20, 96, 3); for (let x = 2; x < 96; x += 12) { g.fillRect(x, 4, 3, 22); g.fillStyle = '#ffd040'; g.fillRect(x, 3, 3, 2); g.fillStyle = '#c8281e'; } g.fillStyle = '#9a1e14'; g.fillRect(0, 8, 96, 1); g.fillRect(0, 22, 96, 1); return { c, ax: 48, ay: 29 }; };
XSPR.jp_rickshaw = () => { const [c, g] = XC(40, 34); g.strokeStyle = '#2a2a30'; g.lineWidth = 2; g.beginPath(); g.arc(12, 24, 9, 0, 7); g.stroke(); g.lineWidth = 1; for (let a = 0; a < 6.28; a += 0.8) { g.beginPath(); g.moveTo(12, 24); g.lineTo(12 + Math.cos(a) * 8, 24 + Math.sin(a) * 8); g.stroke(); }
  g.fillStyle = '#1a1a22'; g.fillRect(6, 10, 18, 12); g.fillStyle = '#c81e1e'; g.fillRect(8, 14, 14, 6); g.fillStyle = '#2a2a30'; g.fillRect(4, 4, 6, 18); g.fillStyle = '#5a3418'; g.fillRect(22, 18, 18, 2); g.fillRect(38, 18, 2, 10); return { c, ax: 20, ay: 33 }; };
for (let v = 0; v < 4; v++) XSPR['jp_asaichi' + v] = () => { const [c, g] = XC(40, 34), aw = ['#c81e1e', '#2a5a2a', '#1e2a5a', '#e88a1a'][v]; for (let x = 0; x < 40; x += 5) { g.fillStyle = (x / 5) % 2 ? '#f4ecd8' : aw; g.fillRect(x, 4, 5, 6); } g.fillStyle = '#5a3418'; g.fillRect(2, 10, 2, 24); g.fillRect(36, 10, 2, 24);
  g.fillStyle = '#8a6a3a'; g.fillRect(0, 22, 40, 12); for (let x = 3; x < 37; x += 5) { g.fillStyle = [['#e8402a', '#c81e1e'], ['#5aa03a', '#e8c040'], ['#f0e0c0', '#c8a070'], ['#ff9a4a', '#e8402a']][v][x % 2]; g.beginPath(); g.arc(x + 2, 20, 2.5, 0, 7); g.fill(); } return { c, ax: 20, ay: 33 }; };

// ---------- generar la zona ----------
function jpEast(M) { const w = M.w, I = M.I, J = JP_G, inb = (x, y) => x >= 0 && y >= 0 && x < w && y < M.h, S = (x, y, k) => { if (inb(x, y)) M.jg[I(x, y)] = k; }, RG = (x0, y0, x1, y1, k) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) S(x, y, k); };
  const R = new RNG(SEED + 8404), F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {})), occ = (x, y) => !inb(x, y) || M.objAt[I(x, y)] >= 0 || SOLID_T[M.ter[I(x, y)]];
  const Fs = (f, x, y, o) => { if (occ(x, y)) return null; return F(f, x, y, null, o); }, poles = M.jpPoles = M.jpPoles || [];
  const bld = (kind, x, by, wd, v, dp, extra) => F('jpb_' + kind + '_' + wd + '_' + v, x, by, jpFp(wd, dp), Object.assign({ px: x * 16 + wd * 8, py: (by + 1) * 16 - 1, jpb: 1, jl: jpBldLights(kind, wd) }, extra || {}));
  // tierra, río y puentes
  RG(316, 3, w - 5, 205, J.GRASS); RG(JE.river[0], 3, JE.river[1], 205, J.POND); for (const [y0, y1] of [[29, 32], [125, 128], [60, 61], [186, 187]]) RG(315, y0, 322, y1, J.STONE);
  // --- Takayama ---
  RG(JE.x0, 5, JE.x1, 12, J.STONE);
  for (const ly of TK_LANES) { RG(JE.x0, ly, JE.x1, ly + 2, J.LANE); RG(JE.x0, ly + 3, JE.x1, ly + 3, J.CANAL); }
  for (const ax of TK_ALLEYS) RG(ax, 13, ax + 2, 92, J.LANE); for (const ax of TK_ALLEYS) for (const ly of TK_LANES) RG(ax, ly + 3, ax + 2, ly + 3, J.STONE);
  RG(JE.x0, 30, 323, 31, J.STONE); RG(JE.x0, 92, JE.x1, 98, J.GRASS);
  // --- Higashiyama: terrazas, muros y escaleras ---
  RG(JE.x0, 102, JE.x1, 204, J.GRASS); RG(HI_ST[0], 104, HI_ST[1], 204, J.STONE); RG(JE.x0, 186, 363, 187, J.STONE); RG(JE.x0, 126, 363, 127, J.STONE);
  for (const t of HI_T) { RG(JE.x0, t, JE.x1, t + 1, J.RET); RG(HI_ST[0], t, HI_ST[1], t + 1, J.STEP); RG(JE.x0, t - 1, JE.x1, t - 1, J.PATH); }
  RG(356, 104, 380, 117, J.STONE);
  // colisiones
  for (let y = 3; y <= 205; y++) for (let x = 315; x < w; x++) { const i = I(x, y), k = M.jg[i]; M.ter[i] = (k === J.SEA || k === J.POND || k === J.CANAL) ? T.WATER : k === J.RET ? T.IWALL : T.FLOOR; }
  // casas de Takayama (fachada al sur, junto a la calle)
  for (const ly of TK_LANES) { let x = JE.x0; while (x <= JE.x1) { if (TK_ALLEYS.some(a => x >= a && x <= a + 2)) { x++; continue; } const lim = Math.min(JE.x1, ...TK_ALLEYS.filter(a => a > x).concat([JE.x1 + 1]).map(a => a - 1)), rem = lim - x + 1; if (rem < 2) { x += rem; continue; }
    const wd = Math.min(rem, rem <= 5 ? rem : 3 + ((R.f() * 3) | 0)), v = (R.f() * 10) | 0, sake = v % 5 === 1; bld('edo', x, ly - 1, wd, v, 6); if (sake) F('jp_vacio', x + (wd >> 1), ly, null, { solid: false, xact: 'jp_sake' }); x += wd; }
    for (let x2 = JE.x0 + 2; x2 < JE.x1; x2 += 7) { if (TK_ALLEYS.some(a => x2 >= a - 1 && x2 <= a + 3)) continue; const r = R.f(); if (r < 0.35) Fs('jp_maceta', x2, ly + 2); else if (r < 0.55) Fs('jp_barril', x2, ly + 2); else if (r < 0.75) Fs('jp_farol', x2, ly + 2, { jl: [[0, -16, 26, 'rgba(255,220,140,0.5)']] }); } }
  for (let x2 = JE.x0 + 1; x2 < JE.x1; x2 += 6) { const v = ((x2 / 6) | 0) % 4; if (x2 % 12 < 6) F('jp_asaichi' + v, x2, 8, [[-1, 0], [0, 0], [1, 0]], { xact: 'jp_asaichi' }); else Fs('jp_farol', x2, 11, { jl: [[0, -16, 26, 'rgba(255,220,140,0.5)']] }); }
  F('jp_rickshaw', JE.x0 + 1, 33, [[0, 0], [1, 0]], { xact: 'jp_jinriki' }); F('jp_puente_rojo', 318, 62, [], { solid: false, px: 318 * 16 + 8, py: 62 * 16 + 4 });
  for (let n = 0; n < 40; n++) { const x = R.int(JE.x0, JE.x1), y = R.int(93, 98); Fs(R.f() < 0.5 ? 'jp_pino' : 'jp_ajisai', x, y); }
  // casas de Higashiyama a los dos lados de la cuesta, una fila por terraza
  const shops = []; HI_T.forEach((t, ti) => { for (const [x0, x1] of [[JE.x0, HI_ST[0] - 2], [HI_ST[1] + 2, JE.x1]]) { let x = x0; while (x <= x1) { const rem = x1 - x + 1; if (rem < 2) break; const wd = Math.min(rem, rem <= 5 ? rem : 3 + ((R.f() * 2) | 0)); let v = (R.f() * 8) | 0; if (x0 < HI_ST[0] && x + wd >= x1 - 4) v = (ti % 2) ? 1 : 2; bld('kyo', x, t - 2, wd, v, 5); if (x0 < HI_ST[0] && x + wd >= x1 - 4) shops.push([v % 4, x + (wd >> 1), t - 1]); x += wd; } } });
  for (const [k, x, y] of shops) if (k === 1 || k === 2) F('jp_vacio', x, y, null, { solid: false, xact: k === 1 ? 'jp_sado' : 'jp_ceramica' });
  for (let y = 106; y < 204; y += 6) { if (HI_T.some(t => y >= t - 1 && y <= t + 1)) continue; Fs(y % 12 ? 'jp_farol' : 'jp_nodate', HI_ST[0] + (y % 12 ? 0 : 1), y, { jl: [[0, -16, 26, 'rgba(255,220,140,0.5)']] }); Fs('jp_farol', HI_ST[1], y + 3, { jl: [[0, -16, 26, 'rgba(255,220,140,0.5)']] }); }
  HI_T.forEach(t => { for (const x of [HI_ST[0] - 4, HI_ST[1] + 4]) Fs('jp_shidare', x, t - 8); });
  F('jp_pagoda', 368, 112, jpFp(5, 3).map(([x, y]) => [x - 2, y]), { px: 368 * 16 + 8 }); for (const x of [359, 377]) { Fs('jp_shidare', x, 110); Fs('jp_farol', x, 115); } F('jp_torii', 368, 118, [[-1, 0], [1, 0]], { px: 368 * 16 + 8 });
  // postes con cables en la orilla del río
  for (let y = 8; y < 200; y += 10) { const o = Fs('jp_poste', 315, y); if (o) poles.push(o); }
  // gente
  const put = (id, cx, cy, rr) => { for (let t = 0; t < 60; t++) { const x = cx + R.int(-rr, rr), y = cy + R.int(-rr, rr); if (occ(x, y) || M.jg[I(x, y)] === J.GRASS) continue; spawnNPC(id, x * 16 + 8, y * 16 + 8, 'japon', { wander: 4, face: 'down' }); return; } };
  for (const [id, z] of JP_NPC3) { if (z === 'tk') put(id, 370, [9, 24, 40, 56, 72, 88][R.int(0, 5)], 40); else put(id, R.f() < 0.6 ? 367 : 340 + R.int(0, 60), 110 + R.int(0, 90), R.f() < 0.6 ? 3 : 20); }
  spawnNPC('jp_asaichi_v', (JE.x0 + 13) * 16 + 8, 10 * 16 + 8, 'japon', { face: 'down' });
  // Asakusa: cerezos a los lados de la calle Nakamise (foto de Sergio)
  for (let y = JP_ASK.y0 + 30; y < JP_ASK.y1 - 2; y += 3) { Fs('jp_sakura', JP_ASK.lane - 7, y); Fs('jp_sakura', JP_ASK.lane + 7, y); }
}
{ const _mj = makeJapan; makeJapan = function () { const had = G.maps.japon, M = _mj.apply(this, arguments); if (!had && M) { jpEast(M); M.jpPoles.sort((a, b) => a.py - b.py || a.px - b.px); } return M; }; }

// ---------- gente nueva (muchas japonesas en kimono, como en las fotos) ----------
const JL_TK = [['朝市へようこそ！', 'Asaichi e yōkoso!', '¡Bienvenido al mercado de la mañana!', 'Welcome to the morning market!'], ['さるぼぼ、かわいいでしょ？', 'Sarubobo, kawaii desho?', 'Los muñecos sarubobo traen suerte. ¿A que son monos?', 'Sarubobo dolls bring luck. Cute, right?'], ['この町は江戸時代のまま。', 'Kono machi wa Edo jidai no mama.', 'Este pueblo sigue como en la era Edo.', 'This town is still as it was in the Edo era.'], ['酒蔵の杉玉が茶色になったら、新酒の季節です。', 'Sakagura no sugidama ga chairo ni nattara, shinshu no kisetsu desu.', 'Cuando la bola de cedro de la bodega se pone marrón, el sake nuevo está listo.', 'When the brewery\'s cedar ball turns brown, the new sake is ready.']];
const JL_HI = [['おこしやす。', 'Okoshiyasu.', 'Bienvenido (así se dice en Kioto).', 'Welcome (that\'s how Kyoto says it).'], ['坂は気をつけてね。', 'Saka wa ki o tsukete ne.', 'Cuidado con la cuesta, que resbala.', 'Careful on the slope, it\'s slippery.'], ['五重塔まで、もう少し！', 'Gojūnotō made, mō sukoshi!', '¡Ya falta poco para la pagoda!', 'The pagoda is almost there!'], ['お茶はいかがですか？', 'Ocha wa ikaga desu ka?', '¿Le apetece un té?', 'Would you like some tea?']];
const JP_NPC3 = [], JP_NPC3_LOOK = {};
{ const hsF = ['mono_suelto', 'cebollas', 'media_coleta', 'coleta_anime', 'lisa_raya', 'bob_recto'], hairs = ['negro', 'castano', 'negro', 'castano', 'negro'];
  const add = (z, n, lines, ttl) => { for (let i = 0; i < n; i++) { const id = 'jp3_' + z + '_' + i, kim = i % 3 !== 2, g = kim ? 'f' : (i % 2 ? 'm' : 'f');
    NPCS[id] = { n: (kim ? L2('Paseante en kimono', 'Kimono stroller') : g === 'm' ? L2('Vecino', 'Local') : L2('Vecina', 'Local')) + ' ' + (i + 1), title: ttl, look: LK({ g }), lines: [jlTxt(lines[i % lines.length]), jlTxt(lines[(i + 2) % lines.length])], quests: [] };
    if (kim) JP_NPC3_LOOK[id] = () => [{ g: 'f', bt: i % 4, skin: i % 5 === 3 ? 1 : 0, hair: hairs[i % hairs.length], hs: jpHF(hsF[i % hsF.length]), eyes: 'cafe', top: [4, 'rojo'], bot: [2, 'rojo'], shoe: [2, 'negro'] }, setCos(KIMONO_SETS[(i * 5 + z.length) % KIMONO_SETS.length].k)];
    else JP_NPC_LOOK[id] = (i * 7 + z.length) % 16; JP_NPC3.push([id, z]); } };
  add('tk', 26, JL_TK, L2('Takayama', 'Takayama')); add('hi', 28, JL_HI, L2('Higashiyama', 'Higashiyama')); }
NPCS.jp_asaichi_v = { n: L2('Vendedora del mercado', 'Market vendor'), title: L2('Mercado de la mañana', 'Morning market'), look: LK({ g: 'f' }), lines: [jlTxt(JL_TK[0])], quests: [] }; JP_NPC_LOOK.jp_asaichi_v = 19;
{ const _na = npcAtlas; npcAtlas = function (id) { const f = JP_NPC3_LOOK[id]; if (f) return getAtlas('JP3_' + id, () => { const [a, cos] = f(); const L = heroLook('bardo', a, { weapon: 0 }, cos, {}); L.weapon = null; L.back = null; return buildAtlas(L, ['idle', 'walk'], drawHero); }); return _na.apply(this, arguments); }; }

// ---------- objetos (para vender, decorar o comer; nada de poder) ----------
it('jp_sake', { n: L2('Botella de sake de Takayama', 'Takayama sake bottle'), t: 'mat', stack: true, price: 1800, icon: ['potion', '#f4f0e0'], rar: 2, d: L2('Sake hecho por ti en la sakagura. Se vende bien.', 'Sake you brewed at the sakagura. It sells well.') });
it('jp_matcha', { n: L2('Matcha batido', 'Whisked matcha'), t: 'cons', stack: true, heal: 3000, price: 900, icon: ['drop', '#5aa03a'], rar: 1, d: L2('Té verde batido en la casa de té. Cura un poco de vida.', 'Green tea whisked at the teahouse. Heals a little HP.') });
for (const [k, n, en, pr, col] of [['cuenco1', 'Cuenco torcido', 'Wonky bowl', 800, '#a8784a'], ['cuenco2', 'Cuenco de Kioto', 'Kyoto bowl', 2500, '#5a8ab0'], ['cuenco3', 'Cuenco de maestro', 'Master\'s bowl', 6000, '#2a6a8a']]) it('jp_' + k, { n: L2(n, en), t: 'mat', stack: true, price: pr, icon: ['gem', col], rar: 2, d: L2('Cerámica hecha por ti en Higashiyama. Para vender o decorar.', 'Pottery you made in Higashiyama. To sell or decorate.') });
it('jp_sarubobo', { n: 'Sarubobo', t: 'mat', stack: true, price: 1200, icon: ['heart', '#e8402a'], rar: 2, d: L2('Muñeco rojo sin cara de Takayama. Dicen que trae buenos encuentros.', 'Faceless red doll from Takayama. They say it brings good encounters.') });
it('jp_manzana', { n: L2('Manzana de Hida', 'Hida apple'), t: 'cons', stack: true, heal: 1500, price: 300, icon: ['potion', '#e8402a'], rar: 1, d: L2('Manzana del mercado de la mañana. Cura un poco de vida.', 'Apple from the morning market. Heals a little HP.') });
it('jp_miso', { n: L2('Miso de Takayama', 'Takayama miso'), t: 'cons', stack: true, heal: 2500, price: 600, icon: ['potion2', '#a8642a'], rar: 1, d: L2('Miso casero, bueno para la sopa. Cura un poco de vida.', 'Homemade miso, good for soup. Heals a little HP.') });

// ---------- oficios nuevos (dan oro y objetos; sus ventajas no suben el poder) ----------
addJob('rickshaw', L2('Conductor de rickshaw', 'Rickshaw puller'), 'run', L2('Lleva a turistas en rickshaw por Takayama e Higashiyama.', 'Carry tourists by rickshaw around Takayama and Higashiyama.'),
  { how: [L2('Toca el rickshaw de la entrada de Takayama (junto al río). Un turista sube y te dice adónde quiere ir: una flecha te guía. Llega pronto para cobrar propina.', 'Tap the rickshaw at the Takayama entrance (by the river). A tourist gets in and tells you where to go: an arrow guides you. Arrive quickly for a tip.'), ''], ben: [L2('Oro y propinas. No da poder.', 'Gold and tips. No power.'), ''], find: () => ({ loc: [JE.x0 + 1, 33], t: L2('Rickshaw de Takayama', 'Takayama rickshaw'), m: 'japon' }) },
  [[5, '+10 % de propina', '+10% tips', { rkG: 10 }], [15, '+15 % de propina', '+15% tips', { rkG: 15 }], [30, 'Turistas que pagan el doble', 'Tourists who pay double', { rkG: 25 }]], ['run', '#e8402a']);
addJob('sakero', L2('Maestro sakero', 'Sake brewer'), 'drop', L2('Remueve el arroz en las bodegas de sake (sakagura) de Takayama.', 'Stir the rice in Takayama\'s sake breweries (sakagura).'),
  { how: [L2('Toca la puerta de una sakagura (las casas con bola de cedro verde). Remueve en el momento justo: más aciertos, mejor sake.', 'Tap the door of a sakagura (houses with a green cedar ball). Stir at the right moment: more hits, better sake.'), ''], ben: [L2('Botellas de sake para vender y oro. No da poder.', 'Sake bottles to sell and gold. No power.'), ''], find: () => ({ loc: [370, 23], t: 'Sakagura', m: 'japon' }) },
  [[5, '+1 botella a veces', '+1 bottle sometimes', { skB: 1 }], [20, 'Sake más caro', 'Pricier sake', { skG: 20 }]], ['drop', '#f4f0e0']);
addJob('sado', L2('Maestro del té', 'Tea master'), 'food', L2('Prepara matcha en la ceremonia del té de Higashiyama.', 'Prepare matcha in the Higashiyama tea ceremony.'),
  { how: [L2('Toca la casa de té (cartel 茶) en la cuesta de Higashiyama y bate el té al ritmo.', 'Tap the teahouse (sign 茶) on the Higashiyama slope and whisk the tea to the beat.'), ''], ben: [L2('Oro y matcha. No da poder.', 'Gold and matcha. No power.'), ''], find: () => ({ loc: [355, 175], t: L2('Casa de té', 'Teahouse'), m: 'japon' }) },
  [[10, '+15 % de oro', '+15% gold', { sdG: 15 }], [25, '+25 % de oro', '+25% gold', { sdG: 25 }]], ['food', '#5aa03a']);
addJob('ceramica', L2('Ceramista', 'Potter'), 'gem', L2('Modela cuencos en el torno del taller de Higashiyama.', 'Shape bowls on the wheel at the Higashiyama workshop.'),
  { how: [L2('Toca el taller (cartel 陶) en la cuesta y mantén el barro centrado en el torno.', 'Tap the workshop (sign 陶) on the slope and keep the clay centred on the wheel.'), ''], ben: [L2('Cuencos para vender o decorar. No da poder.', 'Bowls to sell or decorate. No power.'), ''], find: () => ({ loc: [355, 161], t: L2('Taller de cerámica', 'Pottery workshop'), m: 'japon' }) },
  [[10, 'Cuencos mejores', 'Better bowls', { ceQ: 1 }], [25, 'Cuencos de maestro más a menudo', 'Master bowls more often', { ceQ: 2 }]], ['gem', '#5a8ab0']);
const jpJobUp = k => { const P = G.P; P.jobs[k] = P.jobs[k] || { lv: 1, xp: 0 }; };

// ---------- rickshaw ----------
const RK_DEST = [[L2('la pagoda de Higashiyama', 'the Higashiyama pagoda'), 368, 120], [L2('el mercado de la mañana', 'the morning market'), 360, 13], [L2('el puente rojo', 'the red bridge'), 323, 62], [L2('la casa de té', 'the teahouse'), 355, 175],
  [L2('la sakagura de la calle 3', 'the brewery on street 3'), 385, 55], [L2('el pie de la cuesta', 'the foot of the slope'), 367, 200], [L2('los cerezos llorones', 'the weeping cherries'), 375, 140], [L2('la orilla del río', 'the riverside'), 323, 150]];
XACT.jp_jinriki = [() => G.P && G.P.jp && G.P.jp.rk ? L2('🛺 Dejar el rickshaw', '🛺 Leave the rickshaw') : L2('🛺 Llevar a un turista en rickshaw', '🛺 Take a tourist by rickshaw'), 'run', () => { const P = G.P; P.jp = P.jp || {}; jpJobUp('rickshaw');
  if (P.jp.rk) { P.jp.rk = null; xMsg('🛺', L2('Dejas el rickshaw en su sitio.', 'You leave the rickshaw in its place.')); return; }
  const d = RK_DEST.filter(q => Math.hypot(q[1] * 16 - P.x, q[2] * 16 - P.y) > 160)[(Math.random() * 7) | 0] || RK_DEST[0]; P.jp.rk = { x: d[1], y: d[2], n: d[0], t: G.t, i: (Math.random() * 16) | 0 };
  xMsg('🛺 ' + L2('¡Un turista sube!', 'A tourist gets in!'), L2('«Lléveme a ', '«Take me to ') + d[0] + L2(', por favor.» Sigue la flecha. Si llegas en menos de un minuto, te deja propina.', ', please.» Follow the arrow. Arrive within a minute for a tip.')); }];
V33_TICKS.push(() => { const P = G.P, R = P && P.jp && P.jp.rk; if (!R) return; if (!G.map || G.map.id !== 'japon') { P.jp.rk = null; return; } if (Math.hypot(R.x * 16 + 8 - P.x, R.y * 16 + 8 - P.y) > 30) return;
  const dt = G.t - R.t, tip = dt < 60 ? 1 + (60 - dt) / 60 : 1, gold = Math.round(1200 * tip * (1 + jobPerkSum('rkG') / 100)); P.gold += gold; P.jp.rk = null; gainJobXp('rickshaw', 60 + Math.round(40 * tip)); P.jp.rkN = (P.jp.rkN || 0) + 1; sfx('coin');
  xMsg('🛺 ' + L2('¡Llegamos!', 'We\'re here!'), L2('«¡Arigatō!» El turista baja en ', '«Arigatō!» The tourist gets off at ') + R.n + '.<br>+' + gold.toLocaleString() + L2(' de oro', ' gold') + (tip > 1 ? L2(' (con propina)', ' (with tip)') : '') + '<br><small>' + L2('Viajes: ', 'Trips: ') + P.jp.rkN + '</small>'); markDirty(); });
DL_HOOKS.push((list, cx, cy) => { const P = G.P, R = P && P.jp && P.jp.rk; if (!R || !G.map || G.map.id !== 'japon') return; const bx = P.x + (P.dir === 'left' ? 22 : P.dir === 'right' ? -22 : 0), by = P.y + (P.dir === 'up' ? 18 : P.dir === 'down' ? -14 : 2);
  list.push({ type: 'xdraw', x: bx, y: by, noShadow: true, draw: (e, a, b) => { const S = objSprite({ k: 'furn', f: 'jp_rickshaw' }), X = Math.round(bx - a), Y = Math.round(by - b); ctx.save(); ctx.translate(X, Y); if (P.dir === 'right') ctx.scale(-1, 1); ctx.drawImage(S.c, -S.ax, -S.ay); ctx.restore(); try { const A = xwAtlas(R.i, JP_APPS_W); atlasBlit(ctx, A, A.idx.idle, 0, X - A.ax + 2, Y - A.ay - 10, A.fw, A.fh); } catch (er) { } } }); });
WORLD_DRAW.push((cx, cy) => { const P = G.P, R = P && P.jp && P.jp.rk; if (!R || !G.map || G.map.id !== 'japon') return; const dx = R.x * 16 + 8 - P.x, dy = R.y * 16 + 8 - P.y, L = Math.hypot(dx, dy); if (L < 40) return; const a = Math.atan2(dy, dx), X = P.x - cx + Math.cos(a) * 34, Y = P.y - cy - 20 + Math.sin(a) * 34;
  ctx.save(); ctx.translate(X, Y); ctx.rotate(a); ctx.fillStyle = '#ffd040'; ctx.strokeStyle = '#3a2a0a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-5, -6); ctx.lineTo(-2, 0); ctx.lineTo(-5, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); });

// ---------- sakagura: remover el arroz (5 veces, en el momento justo) ----------
XACT.jp_sake = [L2('🍶 Trabajar en la sakagura', '🍶 Work at the sakagura'), 'run', () => { const P = G.P; jpJobUp('sakero'); let round = 0, hits = 0, msg = '', mT = 0, zone = 0.35 + Math.random() * 0.3; const sp = 1.2 + P.jobs.sakero.lv * 0.01;
  mgOverlay(L2('¡Remover!', 'Stir!'), { tap: () => { const pos = (Math.sin(G_t * sp * 3) + 1) / 2; if (Math.abs(pos - zone) < 0.09) { hits++; msg = L2('¡Perfecto!', 'Perfect!'); sfx('ui'); } else msg = L2('Fallo', 'Miss'); mT = 0.5; round++; zone = 0.2 + Math.random() * 0.6; },
    step: (g, tt, dt) => { G_t = tt; if (round >= 5 && mT <= 0) return false; g.fillStyle = '#3a2418'; g.fillRect(0, 0, 320, 180); g.fillStyle = '#8a6a3a'; g.beginPath(); g.ellipse(160, 120, 90, 40, 0, 0, 7); g.fill(); g.fillStyle = '#f4f0e0'; g.beginPath(); g.ellipse(160, 115, 78, 30, 0, 0, 7); g.fill();
      const pos = (Math.sin(tt * sp * 3) + 1) / 2; g.fillStyle = '#1a1a1a'; g.fillRect(40, 30, 240, 12); g.fillStyle = '#5aa03a'; g.fillRect(40 + (zone - 0.09) * 240, 30, 0.18 * 240, 12); g.fillStyle = '#ffd040'; g.fillRect(40 + pos * 240 - 2, 26, 4, 20);
      g.strokeStyle = '#c8a070'; g.lineWidth = 4; g.beginPath(); g.moveTo(160 + Math.cos(tt * 4) * 50, 110 + Math.sin(tt * 4) * 16); g.lineTo(200 + Math.cos(tt * 4) * 30, 50); g.stroke(); jpText(g, '酒蔵', 8, 6, '#ffd040', 12); jpText(g, (round + 1 > 5 ? 5 : round + 1) + '/5', 280, 6, '#ffffff', 10);
      if (mT > 0) { mT -= dt; jpText(g, msg, 160 - jpW(msg, 12) / 2, 60, '#ffffff', 12); } },
    end: () => { const n = hits >= 4 ? 3 : hits >= 2 ? 2 : hits ? 1 : 0, extra = jobPerkSum('skB') && Math.random() < 0.3 ? 1 : 0, gold = Math.round(hits * 300 * (1 + jobPerkSum('skG') / 100)); if (n + extra) giveItem('jp_sake', n + extra); P.gold += gold; gainJobXp('sakero', 40 + hits * 20); sfx('coin');
      xMsg('🍶 ' + L2('Sakagura', 'Sakagura'), L2('Aciertos: ', 'Hits: ') + hits + '/5<br>+' + (n + extra) + L2(' botellas de sake · +', ' sake bottles · +') + gold.toLocaleString() + L2(' de oro', ' gold')); markDirty(); } }); }];

// ---------- ceremonia del té (al ritmo) ----------
XACT.jp_sado = [L2('🍵 Ceremonia del té', '🍵 Tea ceremony'), 'run', () => { const P = G.P; jpJobUp('sado');
  jpRhythm({ title: '茶道', bpm: 92 + Math.min(40, P.jobs.sado.lv), lines: ['SHAKA SHAKA', 'OCHA DOZO', 'ICHI GO ICHI E', 'OISHII'], seed: P.jobs.sado.lv % 7, n: 20, col: '#5aa03a', btn: '🍵', bg: (g, tt) => { g.fillStyle = '#c8b880'; g.fillRect(0, 128, 320, 52); g.fillStyle = '#2a4a2a'; g.beginPath(); g.ellipse(160, 150, 26, 14, 0, 0, 7); g.fill(); g.fillStyle = '#7ac04a'; g.beginPath(); g.ellipse(160, 146, 20, 7, 0, 0, 7); g.fill(); g.fillStyle = '#e8dcc0'; for (let k = 0; k < 8; k++) g.fillRect(150 + k * 3 + Math.sin(tt * 12 + k) * 2, 120 + k % 2 * 3, 2, 18); },
    done: pct => { const gold = Math.round(pct * 30 * (1 + jobPerkSum('sdG') / 100)); P.gold += gold; gainJobXp('sado', 30 + Math.round(pct * 0.8)); if (pct >= 60) giveItem('jp_matcha', 1); sfx('coin'); xMsg('🍵 ' + L2('Ceremonia del té', 'Tea ceremony'), `<b>${pct} %</b><br>` + (pct >= 85 ? L2('El invitado hace una reverencia: un té perfecto.', 'The guest bows: a perfect tea.') : pct >= 60 ? L2('Buen té, con espuma fina.', 'Good tea, with fine foam.') : L2('Un poco grumoso… pero el invitado sonríe.', 'A bit lumpy… but the guest smiles.')) + '<br>+' + gold.toLocaleString() + L2(' de oro', ' gold')); markDirty(); } }); }];

// ---------- taller de cerámica: mantén el barro centrado ----------
XACT.jp_ceramica = [L2('🏺 Modelar en el torno', '🏺 Shape on the wheel'), 'run', () => { const P = G.P; jpJobUp('ceramica'); let off = 0, vel = 0, good = 0, total = 0;
  mgOverlay(L2('¡Centrar!', 'Centre!'), { tap: () => { vel -= Math.sign(off || 1) * 0.9; sfx('ui'); },
    step: (g, tt, dt) => { G_t = tt; if (tt > 10) return false; vel += (Math.random() - 0.5) * 2.2 * dt * 3 + Math.sign(off) * 0.25 * dt; vel *= 0.98; off = Math.max(-1, Math.min(1, off + vel * dt)); total += dt; if (Math.abs(off) < 0.25) good += dt;
      g.fillStyle = '#4a3a2a'; g.fillRect(0, 0, 320, 180); g.fillStyle = '#6a6a72'; g.beginPath(); g.ellipse(160, 140, 80, 18, 0, 0, 7); g.fill(); const bx = 160 + off * 60, h = 20 + good * 3; g.fillStyle = '#b8784a'; g.beginPath(); g.ellipse(bx, 128, 28, 10, 0, 0, 7); g.fill(); g.fillRect(bx - 24 + Math.abs(off) * 6, 128 - h, 48 - Math.abs(off) * 12, h); g.fillStyle = '#d89a6a'; g.beginPath(); g.ellipse(bx, 128 - h, 24 - Math.abs(off) * 6, 7, 0, 0, 7); g.fill(); g.fillStyle = '#8a5a3a'; g.beginPath(); g.ellipse(bx, 128 - h, 16, 4, 0, 0, 7); g.fill();
      g.fillStyle = 'rgba(90,200,90,0.5)'; g.fillRect(160 - 15, 160, 30, 6); g.fillStyle = '#ffd040'; g.fillRect(bx - 2, 158, 4, 10); jpText(g, '清水焼', 8, 6, '#ffd040', 12); jpText(g, Math.ceil(10 - tt) + 's', 290, 6, '#ffffff', 10); },
    end: () => { const q = good / Math.max(1, total) + jobPerkSum('ceQ') * 0.08, id = q > 0.75 ? 'jp_cuenco3' : q > 0.45 ? 'jp_cuenco2' : 'jp_cuenco1'; giveItem(id, 1); gainJobXp('ceramica', 30 + Math.round(q * 60)); sfx('coin');
      xMsg('🏺 ' + L2('Taller de cerámica', 'Pottery workshop'), L2('Centrado: ', 'Centred: ') + Math.round(q * 100) + ' %<br>' + L2('Has hecho: ', 'You made: ') + ITEMS[id].n); markDirty(); } }); }];

// ---------- mercado de la mañana ----------
XACT.jp_asaichi = [L2('🍎 Mercado de la mañana', '🍎 Morning market'), 'food', () => { const P = G.P; xMsg('🍎 ' + L2('Mercado de la mañana', 'Morning market'), L2('Productos de Hida:', 'Hida products:'), ['jp_manzana', 'jp_miso', 'jp_sarubobo'].map(id => [ITEMS[id].n + ' · ' + ITEMS[id].price.toLocaleString(), () => { if (P.gold < ITEMS[id].price) { xMsg('🍎', L2('No te llega el oro.', 'Not enough gold.')); return; } P.gold -= ITEMS[id].price; giveItem(id, 1); sfx('coin'); markDirty(); }])); }];

// ---------- mapa ----------
MAPC.jpjob = [L2('Trabajos (rickshaw, sake, té, cerámica)', 'Jobs (rickshaw, sake, tea, pottery)'), 'Jobs (rickshaw, sake, tea, pottery)', '#8ae0a0', 'book'];
JP_ROOF.edo = JP_ROOF.edo; { const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); if (!M || !M.jp) return out; const seen = {};
  for (const o of M.objs) { const t = { jp_jinriki: L2('Rickshaw (trabajo)', 'Rickshaw (job)'), jp_sake: L2('Sakagura (trabajo de sake)', 'Sakagura (sake job)'), jp_sado: L2('Casa de té (ceremonia del té)', 'Teahouse (tea ceremony)'), jp_ceramica: L2('Taller de cerámica', 'Pottery workshop') }[o.xact]; if (t && !(o.xact === 'jp_sake' && seen.sake++ > 2)) { if (o.xact === 'jp_sake') seen.sake = seen.sake || 1; out.push({ c: 'jpjob', x: o.tx, y: o.ty, t }); } if (o.xact === 'jp_asaichi' && !seen.as) { seen.as = 1; out.push({ c: 'jpfood', x: o.tx, y: o.ty, t: L2('Mercado de la mañana', 'Morning market') }); } }
  out.push({ c: 'jpsight', x: 368.5, y: 112.5, t: L2('Pagoda de Higashiyama', 'Higashiyama pagoda') }, { c: 'jpsight', x: 318.5, y: 62.5, t: L2('Puente rojo de Takayama', 'Takayama red bridge') }); return out; }; }
{ const _ov = jpOverview; jpOverview = function (M) { const c = _ov.apply(this, arguments), x = c.getContext('2d'), K = 3; for (const o of M.objs) { if (o.f === 'jp_shidare') { x.fillStyle = '#f6a8c4'; x.beginPath(); x.arc(o.tx * K + 1.5, o.ty * K - 1, 3.4, 0, 7); x.fill(); } else if (o.f === 'jp_puente_rojo') { x.fillStyle = '#c8281e'; x.fillRect((o.tx - 3) * K, o.ty * K, 6 * K, 2); } } return c; }; }

// ---------- lupa ----------
if (typeof GSIS !== 'undefined') GSIS.push(['jp_este', '🏯 ' + L2('Japón: Takayama, Higashiyama y trabajos', 'Japan: Takayama, Higashiyama and jobs'), () => [
  L2('Japón creció hacia el este, al otro lado del río (puentes desde Shinjuku y Tokio). El mapa de Japón ahora se amplía con + y − y se mueve con el dedo.', 'Japan grew east, across the river (bridges from Shinjuku and Tokyo). Japan\'s map can now be zoomed with + and − and moved with your finger.'),
  L2('Takayama · Pueblo Edo (norte): calles de casas de madera con celosías, acequias, linternas y hortensias, el mercado de la mañana (manzanas, miso y muñecos sarubobo) y el puente rojo.', 'Takayama · Edo town (north): streets of wooden lattice houses, gutters, lanterns and hydrangeas, the morning market (apples, miso and sarubobo dolls) and the red bridge.'),
  L2('Higashiyama · Kioto antiguo (sur): una cuesta con terrazas, muros de piedra y escaleras que sube hasta la pagoda, con cerezos llorones, sombrillas rojas, casas de té y mucha gente en kimono.', 'Higashiyama · Old Kyoto (south): a slope with terraces, stone walls and stairs climbing to the pagoda, with weeping cherries, red parasols, teahouses and lots of people in kimono.'),
  L2('Trabajos nuevos (dan oro y objetos, no poder): Conductor de rickshaw (lleva turistas siguiendo la flecha; propina si llegas en menos de un minuto), Maestro sakero (remueve el arroz en las sakagura de bola de cedro), Maestro del té (bate el matcha al ritmo) y Ceramista (mantén el barro centrado en el torno: cuencos para vender o decorar).', 'New jobs (gold and items, no power): Rickshaw puller (carry tourists following the arrow; tip if you arrive within a minute), Sake brewer (stir the rice in the cedar-ball sakagura), Tea master (whisk matcha to the beat) and Potter (keep the clay centred on the wheel: bowls to sell or decorate).')],
  () => ({ loc: [JE.x0 + 1, 33], t: L2('Rickshaw de Takayama', 'Takayama rickshaw'), m: 'japon' })]);
