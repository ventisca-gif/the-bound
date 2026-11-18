// ================= v5.20: ARMADURAS DE PERÚ, MÉXICO Y ESPAÑA (tiers 31-36), MINERALES Y ROPA DE MARINERA =================
// Seis armaduras de las referencias de Sergio, iguales para todas las clases, dibujadas con fitKind (se ajustan a las
// 8 estructuras). Se fabrican en la herrería (sin nivel de Herrería) con minerales nuevos de cada país:
//   31 Heraldo de Castilla (nivel 400)   · Mena de Toledo + Cordobán (España)
//   32 Señor de Sipán (430), 33 Guerrero Inca (440)      · Mineral de Inti (vetas del Desierto de las Lomas) + Arena de Nihil
//   34 Guerrero del Sol (460), 35 Guerrero Jaguar (470)  · Mineral de Tonatiuh (vetas del Desierto de las Ánimas) + Obsidiana de Ánima
//   36 Tercio de Toledo (490)            · Mena de Toledo (vetas de Castilla-La Mancha) + Cordobán (curtidor de Córdoba)
// El tier 31 de arma sigue siendo el arma del Lienzo Eterno; aquí solo se añade la armadura 31.
// Además: ropa de marinera (vestidos y terno con sombrero de paja), las criaturas de nivel 410-500 con flecha en la lupa
// y todas las recetas de armas y armaduras sin nivel de Herrería.

// ---------- paletas ----------
const APX = {
  oro: P5(['#5a3a0a', '#9a6a14', '#d0a030', '#f0d060', '#fff4b0']), plata: P5(['#3a3e48', '#6a707c', '#a0a8b4', '#d0d6de', '#f4f6fa']),
  rojo: P5(['#3a0a08', '#6a1410', '#9a2418', '#c8402a', '#e8704a']), naranja: P5(['#5a2a08', '#9a4a10', '#d0782a', '#f0a050', '#ffd090']),
  pluma: P5(['#1a0806', '#3a120c', '#5a1a12', '#7a2a1a', '#a04428']), turq: P5(['#0a4a4a', '#127a74', '#22b0a4', '#5ad8c8', '#b0f4ea']),
  pintura: P5(['#1e2a4a', '#2e4070', '#40609a', '#6a88c0', '#9ab0e0']), crema: P5(['#6a5a3a', '#9a8a60', '#cab890', '#eadcb8', '#fff6e0']),
  jaguar: P5(['#5a3a0a', '#9a6a1a', '#d0a040', '#ecc870', '#fae8b0']), verde: P5(['#0a2a14', '#14482a', '#1e6a3a', '#3a9a5a', '#7ad08a']),
  acero: P5(['#2a2e36', '#525a66', '#8a94a2', '#c0c8d2', '#eef2f6']), cuero: P5(['#2a160c', '#4a2a16', '#6a4022', '#8a5a32', '#b07a4a']),
  rojoH: P5(['#4a0a0e', '#8a141c', '#c0202a', '#e04a4a', '#f08080']), azulH: P5(['#0a1440', '#14246a', '#22389a', '#4a64c8', '#8aa0e8']),
  negro: P5(['#0a0a0e', '#16161c', '#24242c', '#34343e', '#4a4a56']) };
const AP4 = P => [P[1], P[2], P[3], P[4]];

// ---------- cascos y tocados ----------
fitKind('head', 'ar_sipan', (p, A, s) => { const { hx: cx, hy, headTop: top, hrx, side, up, d } = A, G_ = APX.oro;
  const fx = side ? cx - d : cx, rx = side ? 3.5 : 12, ry = 6.5, fy = top + 2;
  for (let y = Math.round(fy - ry); y <= fy; y++) for (let x = Math.floor(fx - rx); x <= Math.ceil(fx + rx); x++) { const q = ((x - fx) / rx) ** 2 + ((y - fy) / ry) ** 2; if (q > 1) continue; p.set(x, y, q > 0.8 ? G_[1] : q > 0.45 ? G_[2] : y < fy - ry * 0.55 ? G_[4] : G_[3]); }
  for (let k = -4; k <= 4; k++) { const a = -Math.PI / 2 + k * 0.33, x = Math.round(fx + Math.cos(a) * rx * 0.72), y = Math.round(fy + Math.sin(a) * ry * 0.72); if (!side || k * d >= 0) p.set(x, y, G_[1]); }
  p.hl(Math.round(cx - hrx), top + 3, Math.round(hrx * 2) + 1, G_[1]); p.hl(Math.round(cx - hrx) + 1, top + 2, Math.round(hrx * 2) - 1, G_[3]);
  if (!up && !side) { p.rect(cx - 1, top - 3, 3, 3, G_[1]); p.set(cx - 1, top - 2, G_[4]); p.set(cx + 1, top - 2, G_[4]); p.set(cx, top, G_[0]); }
  for (const sx of side ? [-d * 0.2] : [-1, 1]) p.ball(Math.round(cx + sx * (hrx + 0.5)), hy + 1, 1.8, 1.8, [G_[0], G_[1], G_[3], G_[4]]); });
fitKind('head', 'ar_inca', (p, A, s) => { const { hx: cx, hy, headTop: top, hrx, side, up, d } = A, S_ = APX.plata, G_ = APX.oro, F = APX.pluma, fy = top + 2;
  for (let k = 0; k <= 12; k++) { const a = Math.PI + 0.22 + k * (Math.PI - 0.44) / 12, sx = side ? 0.35 : 1, x0 = cx + Math.cos(a) * 4 * sx, y0 = fy + Math.sin(a) * 3, x1 = cx + Math.cos(a) * 11 * sx, y1 = fy + Math.sin(a) * 10;
    p.line(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), F[k % 2 ? 2 : 3]); p.set(Math.round(x1), Math.round(y1), F[4]); }
  p.ball(cx, top + 3, hrx + 0.5, 4.5, AP4(S_)); p.hl(Math.round(cx - hrx), top + 6, Math.round(hrx * 2) + 1, S_[1]);
  for (let x = Math.round(cx - hrx) + 1; x < cx + hrx; x += 3) p.set(x, top + 5, S_[4]);
  if (!up) p.ball(side ? cx + d * (hrx - 2) : cx, top + 3, 1.6, 1.6, AP4(G_));
  for (const sx of side ? [-d * 0.2] : [-1, 1]) p.ball(Math.round(cx + sx * (hrx + 0.5)), hy + 1, 1.8, 1.8, [G_[0], G_[1], G_[3], G_[4]]); });
fitKind('head', 'ar_sol', (p, A, s) => { const { hx: cx, hy, headTop: top, hrx, side, up, d } = A, C_ = APX.crema, T_ = APX.turq, G_ = APX.oro, fy = top + 2, sx = side ? 0.35 : 1;
  for (let k = 0; k <= 14; k++) { const a = Math.PI + 0.12 + k * (Math.PI - 0.24) / 14, x0 = cx + Math.cos(a) * 6 * sx, y0 = fy + Math.sin(a) * 5, x1 = cx + Math.cos(a) * 12.5 * sx, y1 = fy + Math.sin(a) * 8.5;
    for (const o of [0, 1]) p.line(Math.round(x0) + o, Math.round(y0), Math.round(x1) + o, Math.round(y1), k % 2 ? C_[3 + o] : T_[2 + o]); }
  for (let k = 0; k <= 10; k++) { const a = Math.PI + 0.2 + k * (Math.PI - 0.4) / 10; p.set(Math.round(cx + Math.cos(a) * 5.5 * sx), Math.round(fy + Math.sin(a) * 4.5), G_[3]); }
  p.ball(cx, top + 3, hrx + 0.3, 4, AP4(G_)); p.hl(Math.round(cx - hrx), top + 5, Math.round(hrx * 2) + 1, T_[2]);
  if (!up && !side) { p.rect(cx - 1, top + 1, 3, 3, T_[3]); p.set(cx, top + 2, C('#ff8a2a')); }
  for (const s_ of side ? [-d * 0.2] : [-1, 1]) p.ball(Math.round(cx + s_ * (hrx + 0.5)), hy + 1, 1.6, 1.6, AP4(T_)); });
fitKind('head', 'ar_jaguar', (p, A, s) => { const { hx: cx, headTop: top, hrx, side, up, d } = A, J = APX.jaguar, K = APX.negro, V = APX.verde;
  for (let k = -2; k <= 2; k++) { const x = Math.round(cx + k * 2 * (side ? 0.4 : 1)); p.vl(x, top - 4 + Math.abs(k), 4 - Math.abs(k), V[k % 2 ? 2 : 3]); p.set(x, top - 5 + Math.abs(k), V[4]); }
  const ty_ = Math.min(top + 5, A.ey - 3); p.ball(cx, top + 2.5, hrx + 1, 4.5, AP4(J));
  for (const [dx, dy] of [[-4, 0], [3, -1], [-1, 2], [5, 2], [-6, 3], [1, 0]]) { if (side && dx * d < -2) continue; const x = Math.round(cx + dx * (side ? 0.6 : 1)), y = top + dy; p.set(x, y, K[2]); p.set(x + 1, y, K[1]); }
  for (const sx of side ? [-d] : [-1, 1]) { const x = Math.round(cx + sx * 5); p.set(x, top - 3, J[3]); p.set(x, top - 2, J[2]); p.set(x + sx, top - 2, J[1]); }
  if (!up) { const x0 = side ? Math.round(cx + d * 1) : Math.round(cx - hrx) + 1, x1 = side ? Math.round(cx + d * (hrx + 1)) : Math.round(cx + hrx) - 1; for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) { p.set(x, ty_, J[1]); if (x % 2) p.set(x, ty_ + 1, C('#f4f0e4')); } p.set(side ? Math.round(cx + d * (hrx + 1)) : cx, top + 3, K[1]); } });
fitKind('head', 'ar_morion', (p, A, s) => { const { hx: cx, hy, headTop: top, hrx, side, up, d, ey } = A, S_ = APX.acero, G_ = APX.oro;
  p.ball(cx, top + 3.5, hrx + 0.5, 5, AP4(S_)); for (let y = top - 2; y <= top + 3; y++) { if (side) p.set(Math.round(cx - d * (top + 3 - y) * 0.6), y, S_[4]); else p.set(cx, y, y === top - 2 ? S_[3] : S_[4]); }
  if (side) { for (let x = -9; x <= 9; x++) p.set(Math.round(cx + x), top + 7 - (Math.abs(x) > 7 ? 1 : 0), S_[x * d > 0 ? 3 : 2]); } else { for (let x = -10; x <= 10; x++) p.set(cx + x, top + 7 - (Math.abs(x) > 8 ? 1 : 0), S_[2]); p.hl(cx - 9, top + 8, 19, S_[1]); }
  p.hl(Math.round(cx - hrx) + 1, top + 5, Math.round(hrx * 2) - 1, G_[3]);
  if (!up) for (const sx of side ? [d] : [-1, 1]) for (let y = top + 8; y <= ey + 4; y++) p.set(Math.round(cx + sx * hrx), y, S_[y % 3 ? 2 : 3]); });
fitKind('head', 'ar_capelina', (p, A, s) => { const { hx: cx, headTop: top, hrx, side, up, d, ey } = A, S_ = APX.acero, R_ = APX.rojoH;
  for (let y = top - 5; y <= top + 5; y++) { const hw = Math.min(hrx + 0.5, (y - (top - 5)) * 0.9); for (let x = Math.floor(cx - hw); x <= Math.ceil(cx + hw); x++) p.set(x, y, x < cx - hw / 2 ? S_[3] : x > cx + hw / 2 ? S_[1] : S_[2]); }
  p.set(cx, top - 6, S_[4]); for (let x = -9; x <= 9; x++) p.set(cx + x, top + 6, S_[Math.abs(x) > 7 ? 1 : 2]); p.hl(cx - 7, top + 7, 15, S_[0]);
  if (!up) for (const sx of side ? [-d] : [-1, 1]) for (let y = top + 7; y <= ey + 6; y++) { const x = Math.round(cx + sx * (hrx + 0.5)); p.set(x, y, R_[2]); p.set(x - sx, y, R_[y % 2 ? 1 : 3]); }
  else for (let y = top + 7; y <= ey + 3; y++) for (let x = Math.round(cx - hrx) + 1; x < cx + hrx; x++) p.set(x, y, R_[(y + x) % 4 ? 2 : 1]); });

// ---------- pecheras ----------
const arCollar = (p, A, P, h) => { const { tx0, tw, torsoTop: ty } = A, R = tx0 + tw - 1; for (let k = 0; k < h; k++) for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, ty + k, P[k === 0 ? 3 : (x + k) % 2 ? 2 : 1]); };
const arShoulders = (p, A, P, r) => { const { tx0, tw, torsoTop: ty, cx, side, d } = A; if (side) { p.ball(cx - 1 - d, ty + 1.5, r, r * 0.8, AP4(P)); return; } for (const sx of [tx0 - 1, tx0 + tw]) p.ball(sx, ty + 1.5, r, r * 0.8, AP4(P)); };
fitKind('body', 'ar_sipan_b', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, G_ = APX.oro, R = tx0 + tw - 1;
  for (let y = ty + 2; y < ty + th - 2; y++) for (let x = tx0; x <= R; x++) p.set(x, y, ((x >> 1) + (y >> 1)) % 2 ? G_[2] : G_[3]);
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty, APX.rojo[3]); p.set(x, ty + 1, x % 2 ? C('#f4ece0') : APX.rojo[2]); }
  arShoulders(p, A, G_, 2.4); p.hl(tx0, ty + th - 2, tw, APX.turq[2]); if (!up && !side) for (let x = tx0; x <= R; x += 2) p.set(x, ty + th - 2, G_[4]); });
fitKind('body', 'ar_inca_b', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, G_ = APX.oro, O = APX.naranja, R = tx0 + tw - 1;
  for (let x = tx0; x <= R; x++) { p.set(x, ty + 1, O[(x % 3) ? 3 : 1]); p.set(x, ty + th - 3, O[(x % 3) ? 2 : 0]); }
  if (!up && !side) { const w = Math.min(5, tw - 2), x0 = Math.round(cx - w / 2); for (let y = ty + 2; y < ty + th - 4; y++) for (let x = x0; x < x0 + w; x++) p.set(x, y, ((x - x0) + (y - ty)) % 2 ? G_[3] : G_[2]); for (let x = x0; x < x0 + w; x += 2) { p.set(x, ty + th - 4, G_[4]); p.set(x, ty + th - 3, G_[1]); } }
  for (let x = tx0; x <= R; x++) p.set(x, ty + th - 2, (x % 2) ? G_[3] : APX.rojo[3]); arShoulders(p, A, APX.rojo, 2.2); });
fitKind('body', 'ar_sol_b', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, T_ = APX.turq, G_ = APX.oro, R = tx0 + tw - 1;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty, T_[3]); p.set(x, ty + 1, (x % 3) ? T_[2] : APX.rojo[3]); p.set(x, ty + 2, (x % 2) ? G_[3] : T_[1]); }
  if (!up && !side) { p.ball(cx - 0.5, ty + th * 0.5 + 0.5, 1.8, 1.8, [C('#a03a0a'), C('#e86a1a'), C('#ffa040'), C('#fff0a0')]); }
  arShoulders(p, A, G_, 2.6); if (!side) for (const sx of [tx0 - 1, R + 1]) p.set(sx, ty + 1, T_[4]);
  p.hl(tx0, ty + th - 2, tw, G_[2]); if (!up && !side) { p.rect(cx - 1, ty + th - 3, 2, 2, APX.verde[3]); p.set(cx - 1, ty + th - 3, APX.verde[4]); } });
fitKind('body', 'ar_jaguar_b', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, J = APX.jaguar, K = APX.negro, G_ = APX.oro, R = tx0 + tw - 1;
  for (let y = ty + 3; y < ty + th - 2; y += 3) for (let x = tx0 + ((y / 3) % 2 ? 2 : 0); x < R; x += 4) { p.set(x, y, K[2]); p.set(x + 1, y, J[1]); }
  for (let x = tx0 - 2; x <= R + 2; x++) { p.set(x, ty, G_[3]); p.set(x, ty + 1, G_[2]); if ((x - tx0) % 2 === 0) p.set(x, ty + 2, G_[1]); }
  p.hl(tx0, ty + th - 2, tw, G_[2]); if (!up && !side) p.set(cx, ty + 1, APX.turq[3]); });
fitKind('body', 'ar_espana_b', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, S_ = APX.acero, G_ = APX.oro, R = tx0 + tw - 1;
  if (!up) { const rx = side ? Math.round(cx + d) : cx; for (let y = ty + 1; y < ty + th - 2; y++) { p.set(rx, y, S_[4]); if (!side) p.set(rx - 1, y, S_[3]); } if (!side) { p.line(tx0 + 1, ty + 2, cx - 2, ty + th - 4, G_[2]); p.line(R - 1, ty + 2, cx + 1, ty + th - 4, G_[2]); } }
  arShoulders(p, A, S_, 3); const gear = (x, y) => { p.ball(x, y, 1.6, 1.6, AP4(S_)); p.set(Math.round(x), Math.round(y), G_[3]); }; if (side) gear(cx - 1 - d, ty + 3); else { gear(tx0 - 1, ty + 3); gear(R + 1, ty + 3); }
  p.hl(tx0, ty + th - 2, tw, APX.cuero[2]); if (!up && !side) p.set(cx, ty + th - 2, G_[4]); });
fitKind('body', 'ar_heraldo_b', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, Rh = APX.rojoH, Bh = APX.azulH, R = tx0 + tw - 1;
  for (let y = ty + 1; y < ty + th - 1; y++) for (let x = tx0; x <= R; x++) { const left = side ? d < 0 : (up ? x >= cx : x < cx), Pp = left ? Rh : Bh; p.set(x, y, x === tx0 ? Pp[3] : x === R ? Pp[1] : Pp[2]); }
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty, Rh[3]); p.set(x, ty - 1, Rh[2]); }
  arShoulders(p, A, APX.plata, 2.2); p.hl(tx0, ty + th - 2, tw, APX.cuero[2]); if (!up && !side) p.set(cx, ty + th - 2, APX.plata[4]); });

// ---------- faldones, piernas y pies ----------
fitKind('legs', 'ar_faldon', (p, A, s) => { const { tx0, tw, cx, side, up, d, legTop, base } = A, R = tx0 + tw - 1, L = base - legTop, hem = legTop + Math.max(2, Math.round(L * (s.len || 0.5))), cols = new Set(s.m);
  if (s.spots) for (let y = legTop; y < base - 1; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y)) && (x * 7 + y * 5) % 9 === 0) p.set(x, y, s.spots[1]);
  if (s.fringe) { const k0 = legTop + Math.round(L * 0.55); for (let y = k0; y < base - 2; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) p.set(x, y, y === k0 ? s.fringe[4] : s.fringe[(x % 2) ? 1 : 2]); }
  if (s.knee) { const k = legTop + Math.round(L * 0.5); let prev = false; for (let x = 0; x < p.w; x++) { const on = cols.has(p.get(x, k)); if (on && !prev) p.set(x, k, s.m[4]); prev = on; } }
  const x0 = side ? cx - 4 : tx0 - 1, x1 = side ? cx + 3 : R + 1; for (let x = x0; x <= x1; x++) if (!uA(p.get(x, legTop - 1))) p.set(x, legTop - 1, s.s[1]);
  for (let y = legTop; y <= hem; y++) for (let x = x0; x <= x1; x++) { const half = s.s2 && !side && ((x > (x0 + x1) / 2) !== !!up), S_ = half ? s.s2 : (side && s.s2 && d > 0 ? s.s2 : s.s); let c;
    if (y === hem) c = s.pat === 'bells' ? (x % 2 ? S_[4] : S_[1]) : S_[1];
    else if (s.pat === 'stripes') c = (y - legTop) % 3 === 2 ? S_[1] : x === x0 ? S_[3] : S_[2];
    else if (s.pat === 'plates') c = (y - legTop) % 2 === 1 ? S_[2] : x === x0 ? S_[4] : S_[3];
    else if (s.pat === 'greca' && y >= hem - 2) c = (x + (y === hem - 1 ? 1 : 0)) % 3 === 0 ? s.g[4] : s.g[1];
    else c = x === x0 ? S_[3] : x === x1 ? S_[1] : S_[2];
    p.set(x, y, c); }
  if (s.pat === 'bells') for (let x = x0 + 1; x < x1; x += 2) p.set(x, hem + 1, APX.oro[3]); });

// ---------- sets por tier ----------
const ARP = {   // tier -> [clave, nombre, nivel, casco, pechera, faldón, pies, capa]
  31: ['heraldo', L2('del Heraldo de Castilla', 'of the Herald of Castile'), 400, { k: 'ar_capelina', m: APX.acero, cover: 'hat' }, { k: 'ar_heraldo_b', m: APX.cuero, s: APX.plata }, { k: 'ar_faldon', m: APX.rojoH, s: APX.rojoH, s2: APX.azulH, len: 0.55 }, { k: 'boots', m: APX.cuero }, { k: 'cape', o: APX.rojoH, i: APX.azulH, tr: APX.plata.slice(1) }],
  32: ['sipan', L2('del Señor de Sipán', 'of the Lord of Sipán'), 430, { k: 'ar_sipan', m: APX.oro, cover: 'hat' }, { k: 'ar_sipan_b', m: APX.oro, s: APX.rojo }, { k: 'ar_faldon', m: APX.cuero, s: APX.oro, len: 0.5, pat: 'plates' }, { k: 'sandals', m: APX.oro }, null],
  33: ['inca', L2('del Guerrero Inca', 'of the Inca Warrior'), 440, { k: 'ar_inca', m: APX.plata, cover: 'hat' }, { k: 'ar_inca_b', m: APX.rojo, s: APX.oro }, { k: 'ar_faldon', m: APX.rojo, s: APX.rojo, len: 0.5, pat: 'stripes', fringe: APX.naranja }, { k: 'sandals', m: APX.cuero }, { k: 'cape', o: APX.naranja, i: APX.pluma, tr: APX.oro.slice(1) }],
  34: ['sol', L2('del Guerrero del Sol', 'of the Sun Warrior'), 460, { k: 'ar_sol', m: APX.oro, cover: 'hat' }, { k: 'ar_sol_b', m: APX.pintura, s: APX.turq }, { k: 'ar_faldon', m: APX.cuero, s: APX.cuero, len: 0.55, pat: 'greca', g: APX.turq }, { k: 'sandals', m: APX.cuero }, { k: 'cape', o: APX.verde, i: APX.negro, tr: APX.turq.slice(1) }],
  35: ['jaguar', L2('del Guerrero Jaguar', 'of the Jaguar Warrior'), 470, { k: 'ar_jaguar', m: APX.jaguar, cover: 'hat' }, { k: 'ar_jaguar_b', m: APX.jaguar, s: APX.oro }, { k: 'ar_faldon', m: APX.jaguar, s: APX.crema, len: 0.45, pat: 'greca', g: APX.turq, spots: APX.negro }, { k: 'sandals', m: APX.jaguar }, null],
  36: ['toledo', L2('del Tercio de Toledo', 'of the Toledo Tercio'), 490, { k: 'ar_morion', m: APX.acero, cover: 'hat' }, { k: 'ar_espana_b', m: APX.acero, s: APX.oro }, { k: 'ar_faldon', m: APX.acero, s: APX.acero, len: 0.35, pat: 'plates', knee: true }, { k: 'sabatons', m: APX.acero }, null] };
const ARP_N = { heraldo: [L2('Capelina', 'Kettle Hat'), L2('Brigantina', 'Brigandine'), L2('Calzas y Sobreveste', 'Hose and Surcoat'), L2('Botas', 'Boots')], sipan: [L2('Tocado', 'Headdress'), L2('Pectoral de Placas', 'Plated Pectoral'), L2('Faldellín de Cascabeles', 'Belled Kilt'), L2('Sandalias de Oro', 'Gold Sandals')],
  inca: [L2('Casco de Plumas', 'Feathered Helmet'), L2('Uncu de Guerra', 'War Uncu'), L2('Faldón y Flecos', 'Kilt and Fringes'), L2('Usutas', 'Usutas')], sol: [L2('Tocado Solar', 'Sun Headdress'), L2('Pectoral de Turquesa', 'Turquoise Pectoral'), L2('Faldellín de Greca', 'Fret Kilt'), L2('Sandalias', 'Sandals')],
  jaguar: [L2('Yelmo de Jaguar', 'Jaguar Helm'), L2('Piel de Guerra', 'War Pelt'), L2('Faldellín y Patas', 'Kilt and Legs'), L2('Garras', 'Claws')], toledo: [L2('Borgoñota', 'Burgonet'), L2('Coraza', 'Cuirass'), L2('Escarcelas y Grebas', 'Tassets and Greaves'), L2('Escarpes', 'Sabatons')] };
for (const [id, n, en, col, price, d] of [['mineral_inti', 'Mineral de Inti', 'Inti Ore', '#f0c040', 9000, L2('Oro andino que brilla como el sol. Vetas del Desierto de las Lomas (Perú) y criaturas de allí.', 'Andean gold that shines like the sun. Veins in the Desert of the Lomas (Peru) and its creatures.')],
  ['mineral_tonatiuh', 'Mineral de Tonatiuh', 'Tonatiuh Ore', '#3ad8c0', 11000, L2('Turquesa y oro del Quinto Sol. Vetas del Desierto de las Ánimas (México) y criaturas de allí.', 'Turquoise and gold of the Fifth Sun. Veins in the Desert of the Souls (Mexico) and its creatures.')],
  ['mena_toledo', 'Mena de Toledo', 'Toledo Ore', '#9aa4b4', 12000, L2('Hierro de las forjas toledanas. Vetas de Castilla-La Mancha (España).', 'Iron from the Toledo forges. Veins in Castile-La Mancha (Spain).')],
  ['cordoban', 'Cordobán', 'Cordovan Leather', '#8a4a22', 15000, L2('Cuero curtido a la manera de Córdoba. Lo vende el curtidor de Andalucía.', 'Leather tanned the Córdoba way. Sold by the Andalusian tanner.')]])
  it(id, { n: L2(n, en), t: 'mat', stack: true, tier: 21, price, icon: ['gem', col], rar: 5, d });
const ARP_REC = { 31: [['mena_toledo', 6], ['cordoban', 2]], 32: [['mineral_inti', 8], ['arena_nihil', 6]], 33: [['mineral_inti', 12], ['arena_nihil', 10]], 34: [['mineral_tonatiuh', 8], ['obsidiana_anima', 6]], 35: [['mineral_tonatiuh', 12], ['obsidiana_anima', 10]], 36: [['mena_toledo', 14], ['cordoban', 6]] };
for (const t in ARP) { const [k, nm, lv] = ARP[t]; if (+t !== 31) { TIER[t] = { k, m: nm, f: nm, mp: nm, fp: nm, lv, p: +t }; TIERP[t] = APX[{ sipan: 'oro', inca: 'rojo', sol: 'turq', jaguar: 'jaguar', toledo: 'acero' }[k]]; }
  const def = 3 + lv * 1.4 + t * 2, N = ARP_N[k];
  it(`h_${t}`, { n: N[0] + ' ' + nm, t: 'armor', slot: 'head', lv, tier: +t, def: Math.round(def * 0.45), hpB: Math.round(lv * 1.5), price: Math.round(14 * Math.pow(t, 2.3)), icon: ['helm', 15], rar: 5, arp: k });
  it(`b_${t}`, { n: N[1] + ' ' + nm, t: 'armor', slot: 'body', lv, tier: +t, def: Math.round(def), hpB: Math.round(lv * 3.5), price: Math.round(20 * Math.pow(t, 2.3)), icon: ['armor', 15], rar: 5, arp: k });
  it(`l_${t}`, { n: N[2] + ' ' + nm, t: 'armor', slot: 'legs', lv, tier: +t, def: Math.round(def * 0.6), hpB: Math.round(lv * 2), price: Math.round(16 * Math.pow(t, 2.3)), icon: ['legs', 15], rar: 5, arp: k });
  it(`f_${t}`, { n: N[3] + ' ' + nm, t: 'armor', slot: 'feet', lv, tier: +t, def: Math.round(def * 0.35), spdB: 9, price: Math.round(12 * Math.pow(t, 2.3)), icon: ['boots', 15], rar: 5, arp: k });
  for (const s of ['h', 'b', 'l', 'f']) RECIPES.push({ id: `r_${s}_${t}`, job: 'herreria', out: `${s}_${t}`, n: 1, lv, jlv: 1, gold: 140000 * (t - 20), mats: ARP_REC[t], cat: 'armadura' }); }
{ const _gv = gearVis; gearVis = function (cls, slot, t) { const D = ARP[t]; if (D && slot !== 'weapon') { const i = { head: 3, body: 4, legs: 5, feet: 6 }[slot]; if (i) return Object.assign({ t }, D[i]); } return _gv.apply(this, arguments); }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, o) { const L = _hl.apply(this, arguments); const D = gear && ARP[gear.body]; if (!D || !L) return L; cos = cos || {}; const evo = app && app.evo && typeof EVO !== 'undefined' && EVO[app.evo];
    if (!(cos.back && COSM[cos.back]) && !evo) L.back = D[7] ? Object.assign({}, D[7]) : null; if (cls === 'asesino' && !(cos.back && COSM[cos.back])) L.scarf = null; return L; }; }
{ const _fi = fitItems; fitItems = function (only) { const out = _fi.apply(this, arguments); for (const c of ['guerrero', 'mago', 'arquero', 'asesino', 'bardo', 'invocador', 'pez']) for (const t of [31, 32, 33, 34, 35, 36]) for (const slot of ['head', 'body', 'legs', 'feet']) { const it_ = { id: `${c}:${slot}:${t}`, kind: 'gear', cls: c, slot, t }; if (!only || it_.id.includes(only)) out.push(it_); } return out; }; }
{ const _cg = cleanGear; cleanGear = function (g) { const o = _cg.apply(this, arguments); for (const k of ['head', 'body', 'legs', 'feet']) { const v = g && +g[k]; if (isFinite(v) && v >= 31 && v <= 36) o[k] = v | 0; } return o; }; }
// sin nivel de Herrería para fabricar armas y armaduras (Sergio, 5.20)
for (const r of RECIPES) if (r.job === 'herreria' && (r.cat === 'arma' || r.cat === 'armadura')) r.jlv = 1;

// ---------- vetas de mineral ----------
const VETA = { inti: ['mineral_inti', '#f0c040', '#fff0a0'], tona: ['mineral_tonatiuh', '#3ad8c0', '#b0fff0'], toledo: ['mena_toledo', '#8a94a6', '#e0e6ee'] };
for (const k in VETA) for (const empty of [0, 1]) XSPR['fs_veta_' + k + (empty ? '_x' : '')] = () => { const [c, g] = XC(30, 26), [, col, hi] = VETA[k]; g.fillStyle = '#4a4440'; g.beginPath(); g.ellipse(15, 17, 13, 8, 0, 0, 7); g.fill(); g.fillStyle = '#6a625a'; g.beginPath(); g.ellipse(12, 14, 9, 6, 0, 0, 7); g.fill(); g.fillStyle = '#8a8076'; g.fillRect(8, 10, 6, 2);
  if (!empty) for (const [x, y, w, h] of [[9, 13, 4, 4], [16, 11, 3, 5], [19, 16, 4, 3], [12, 18, 3, 3]]) { g.fillStyle = col; g.fillRect(x, y, w, h); g.fillStyle = hi; g.fillRect(x, y, 1, 1); } return { c, ax: 15, ay: 24 }; };
XACT.fs_veta = [o => (o.vx ? '⛏ ' + L2('Veta agotada', 'Depleted vein') : '⛏ ' + L2('Picar ', 'Mine ') + ITEMS[VETA[o.vk][0]].n), 'run', o => { const P = G.P; if (o.vx && G.t < o.vx) { toast(L2('La veta vuelve a brillar en ', 'The vein shines again in ') + Math.ceil(o.vx - G.t) + ' s', 'warn'); return; }
  if (P.lv < 400) { toast(L2('Este mineral solo lo puede picar un héroe de nivel 400 o más.', 'Only a level 400+ hero can mine this ore.'), 'warn'); return; }
  const id = VETA[o.vk][0], n = 1 + (Math.random() < 0.35 ? 1 : 0); giveItem(id, n); sfx('hit'); burst(o.px, o.py - 10, 14, { sp: 60, up: 50, g: 30, life: 0.6, c: [VETA[o.vk][1], VETA[o.vk][2], '#8a8076'] }); if (JOBS.mineria && P.jobs.mineria) gainJobXp('mineria', 60);
  o.vx = G.t + 90; o.f = 'fs_veta_' + o.vk + '_x'; markDirty(); }];
V33_TICKS.push(() => { const M = G.map; if (!M || !M.vetas) return; for (const o of M.vetas) if (o.vx && G.t >= o.vx) { o.vx = 0; o.f = 'fs_veta_' + o.vk; } });
function arVetas(M, k, pts) { M.vetas = M.vetas || []; for (const [x, y] of pts) { const p_ = freePxNear(M, x * 16, y * 16, 6); if (!p_) continue; const tx = Math.floor(p_[0] / 16), ty = Math.floor(p_[1] / 16); addObj(M, 'furn', tx, ty, { f: 'fs_veta_' + k, fp: [[0, 0]], xact: 'fs_veta', vk: k }); const ob = M.objs[M.objs.length - 1]; if (ob && ob.vk === k) M.vetas.push(ob); } }
{ const _mc = makeCombat; makeCombat = function (id) { const had = G.maps[id], M = _mc.apply(this, arguments); if (!had && M && (id === 'ln_desierto' || id === 'mx_desierto')) { const k = id === 'ln_desierto' ? 'inti' : 'tona'; arVetas(M, k, [[30, 60], [40, 90], [70, 30], [95, 80], [125, 60], [140, 30], [160, 110], [180, 90], [60, 115], [100, 120]]); } return M; }; }
// criaturas y jefes de esas zonas también sueltan el mineral
for (const [id, , , , , mat] of CB_MOBS) { const M_ = MOBS[id]; if (!M_) continue; const extra = mat === 'arena_nihil' ? 'mineral_inti' : mat === 'obsidiana_anima' ? 'mineral_tonatiuh' : null; if (extra) M_.drops = (M_.drops || []).concat([[extra, 0.06]]); }
BOSSES.cb_dunas.drops = (BOSSES.cb_dunas.drops || []).concat([['mineral_inti', 1, 6]]); BOSSES.cb_coatl.drops = (BOSSES.cb_coatl.drops || []).concat([['mineral_tonatiuh', 1, 6], ['cordoban', 0.5, 2]]);

// ---------- España: vetas de Toledo y el curtidor de Córdoba ----------
fsNpc('es_curtidor', L2('Rafael, curtidor de Córdoba', 'Rafael, Córdoba tanner'), L2('Andalucía', 'Andalusia'), 'es', 'm', 3, L2('El cordobán se curte con paciencia y zumaque. Los herreros de Toledo lo usan para las correas de sus armaduras.', 'Cordovan is tanned with patience and sumac. Toledo smiths use it for their armour straps.'));
fsNpc('es_herrero_toledo', L2('Maese Gonzalo, espadero de Toledo', 'Master Gonzalo, Toledo swordsmith'), 'Toledo', 'es', 'm', 7, L2('La mena de estas vetas hizo famosas las espadas toledanas. Con cordobán y paciencia sale la mejor armadura del reino.', 'The ore from these veins made Toledo blades famous. With cordovan and patience you get the finest armour in the realm.'));
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (npc.id === 'es_curtidor') opts.unshift({ label: '🛒 ' + ITEMS.cordoban.n + ' · 25.000 ' + L2('oro', 'gold'), icon: ['coin'], fn: () => { if (P.gold < 25000) { typeText(L2('Sin oro no hay cuero, amigo.', 'No gold, no leather, friend.')); return; } P.gold -= 25000; giveItem('cordoban', 1); sfx('coin'); markDirty(); } });
  if (npc.id === 'es_herrero_toledo') opts.unshift({ label: '⚒ ' + L2('Abrir la herrería', 'Open the forge'), icon: ['anvil'], fn: () => { closeDialog(); openCraft('herreria'); } }); });
{ const _b = esBuild; esBuild = function (M) { _b.apply(this, arguments); try { const T_ = ES_ST.find(s => s.k === 'mancha').c; arVetas(M, 'toledo', [[T_[0] - 30, T_[1] - 20], [T_[0] - 20, T_[1] + 10], [T_[0] - 8, T_[1] - 26], [T_[0] + 6, T_[1] + 18], [T_[0] + 18, T_[1] - 12], [T_[0] + 30, T_[1] + 6], [T_[0] - 34, T_[1] + 22], [T_[0] + 2, T_[1] - 4]]);
  const h = fsSp(M, 'es_herrero_toledo', T_[0], T_[1]); if (h) fsPoi(M, 'pejob', Math.round(h.x / 16), Math.round(h.y / 16), L2('Vetas de Toledo y el espadero (Mena de Toledo)', 'Toledo veins and the swordsmith (Toledo Ore)'));
  const c = fsSp(M, 'es_curtidor', 420, 546); if (c) fsPoi(M, 'peshop', Math.round(c.x / 16), Math.round(c.y / 16), L2('Curtidor de Córdoba (Cordobán)', 'Córdoba tanner (Cordovan)')); } catch (e) { console.warn('armaduras es', e); } }; }

// ---------- las criaturas de nivel 410-500 en la lupa, con flecha ----------
{ const _mw = mobWhere; mobWhere = function (k) { const z = (() => { for (const id in CB) for (const Z of CB[id].zones) if (Z.pool.includes(k)) return [id, Z]; return null; })(); if (!z) return _mw.apply(this, arguments);
  const [id, Z] = z, D = CB[id], P = G.P; if (P && P.map === id) return { loc: Z.c, m: id, t: D.n + ' · ' + L2('nivel ', 'level ') + Z.lv[0] + '-' + Z.lv[1] };
  const gate = { lima_norte: (G.maps.lima_norte && G.maps.lima_norte.cbGate) || [210, 27], japon: (G.maps.japon && G.maps.japon.cbGate) || [300, 169], mexico: [25, 71] }[D.from];
  return { loc: gate, m: D.from, t: D.n + ' (' + L2('puerta en ', 'gate in ') + { lima_norte: L2('Carabayllo, Lima Norte', 'Carabayllo, North Lima'), japon: L2('Japón, junto al aeropuerto', 'Japan, by the airport'), mexico: L2('Chihuahua, México', 'Chihuahua, Mexico') }[D.from] + ') · ' + L2('nivel ', 'level ') + Z.lv[0] + '-' + Z.lv[1] }; }; }

// ---------- ropa de marinera (Lima) ----------
fitKind('body', 'pe_saco', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1;
  if (!up && !side) { for (let y = ty; y < ty + Math.min(th - 2, 6); y++) { const hw = Math.max(0, 2 - ((y - ty) >> 1)); for (let x = cx - 1 - hw; x <= cx + hw; x++) p.set(x, y, C('#f4f4f8')); } p.vl(cx - 1, ty + 1, Math.min(th - 3, 5), m[0]); p.vl(cx, ty + 1, Math.min(th - 3, 5), m[1]);
    p.line(cx - 3, ty, cx - 1, ty + 5, m[4]); p.line(cx + 2, ty, cx, ty + 5, m[3]); p.set(cx - 1, ty + th - 4, C('#c8c8d0')); p.set(cx - 1, ty + th - 2, C('#c8c8d0')); }
  for (let x = tx0 + 1; x < R; x += 3) for (let y = ty + 2; y < ty + th - 1; y++) if (p.get(x, y) === m[2]) p.set(x, y, m[3]);
  if (side) p.set(cx + d * 2, ty + 1, C('#f4f4f8')); });
fitKind('head', 'pe_paja', (p, A, s) => { const { hx, hy } = A, m = s.m, b = s.b, by = Math.round(hy - 4);
  for (let x = hx - 12; x <= hx + 12; x++) { const e = Math.abs(x - hx); p.set(x, by, m[e > 10 ? 2 : 3]); p.set(x, by + 1, m[e > 10 ? 1 : 2]); }
  for (let y = by - 4; y < by; y++) { const hw = y === by - 4 ? 4 : 5; for (let x = hx - hw; x <= hx + hw; x++) p.set(x, y, x < hx - hw + 2 ? m[4] : x > hx + hw - 2 ? m[2] : m[3]); }
  p.hl(hx - 5, by - 1, 11, b[1]); p.hl(hx - 4, by - 4, 9, m[2]); });
const PEM = { azul: P5(['#0a1a5a', '#14309a', '#2250d0', '#4a7aec', '#9ab8ff']), azul2: P5(['#0a1a5c', '#14329c', '#2452d2', '#4c7cee', '#9cbaff']), celeste: P5(['#1a4a7a', '#2a6aa8', '#4a90d0', '#7ab4ec', '#c0e0ff']), celeste2: P5(['#1a4a7c', '#2a6caa', '#4a92d2', '#7ab6ee', '#c2e2ff']),
  rojo2: P5(['#3a060c', '#6a0e18', '#9a1a26', '#c03440', '#e06a70']), blanco: IDP.blanco, terno: P5(['#06081a', '#0e122a', '#18203e', '#243050', '#36466a']), paja: P5(['#6a5430', '#a08850', '#d0b880', '#ecdcb0', '#fff6dc']) };
const PE_MAR = [
  ['c_pe_marinera_azul_blusa', L2('Marinera azul · corpiño bordado', 'Blue marinera · embroidered bodice'), 'body', () => ({ k: 'mx_blusa', m: PEM.azul, r: PEM.azul, fl: [MXP.rosa, MXP.morado, IDP.blanco], sl: 'puff' }), 4500],
  ['c_pe_marinera_azul_falda', L2('Marinera azul · falda de volantes', 'Blue marinera · ruffled skirt'), 'legs', () => ({ k: 'mx_falda', m: PEM.azul2, ruf: PEM.azul, fl: [MXP.rosa, MXP.morado], lace: PEM.azul, long: 0.88 }), 7000],
  ['c_pe_marinera_roja_blusa', L2('Marinera roja · blusa blanca bordada', 'Red marinera · embroidered white blouse'), 'body', () => ({ k: 'mx_blusa', m: IDP.blanco, r: IDP.blanco, fl: [MXP.rojo, MXP.verde], cint: PEM.rojo2, sl: 'puff' }), 4000],
  ['c_pe_marinera_roja_falda', L2('Marinera roja · falda plisada', 'Red marinera · pleated skirt'), 'legs', () => ({ k: 'mx_falda', m: PEM.rojo2, ruf: PEM.rojo2, hb: [[1, PEM.rojo2[3]], [3, PEM.rojo2[3]]], lace: PEM.rojo2, long: 0.88 }), 6500],
  ['c_pe_marinera_celeste_blusa', L2('Marinera celeste · blusa con encaje', 'Sky-blue marinera · lace blouse'), 'body', () => ({ k: 'mx_blusa', m: PEM.celeste, r: IDP.blanco, rib: [IDP.blanco, PEM.celeste], sl: 'puff' }), 4500],
  ['c_pe_marinera_celeste_falda', L2('Marinera celeste · falda con encaje', 'Sky-blue marinera · lace skirt'), 'legs', () => ({ k: 'mx_falda', m: PEM.celeste2, ruf: PEM.celeste, hb: [[2, IDP.blanco[4]], [3, IDP.blanco[3]]], lace: IDP.blanco, long: 0.88 }), 7000],
  ['c_pe_marinera_flor', L2('Marinera · flores en el moño', 'Marinera · flowers in the bun'), 'head', () => ({ k: 'mx_flor', m: MXP.rosa, mono: MXP.amarillo }), 1200],
  ['c_pe_terno', L2('Terno de marinero (saco a rayas)', 'Marinera suit (pinstripe jacket)'), 'body', () => ({ k: 'pe_saco', m: PEM.terno }), 5000],
  ['c_pe_terno_pantalon', L2('Pantalón del terno', 'Suit trousers'), 'legs', () => ({ k: 'pants', m: PEM.terno }), 2000],
  ['c_pe_sombrero_paja', L2('Sombrero de paja de marinero', 'Marinera straw hat'), 'head', () => ({ k: 'pe_paja', m: PEM.paja, b: APX.negro }), 2500]];
for (const [id, n, slot, vis, price] of PE_MAR) { cosm(id, n, slot, vis, { src: L2('Profesora Milagros, Plaza de Armas (Lima)', 'Teacher Milagros, Plaza de Armas (Lima)') }); it('cosi_' + id, { n, t: 'cos', cos: id, price, icon: ['hanger'], rar: 3, d: L2('Ropa de marinera. Solo cambia el aspecto. Con ella ganas un 50 % más en el concurso de marinera.', 'Marinera clothing. Appearance only. With it you earn 50% more in the marinera contest.') }); COS_SHOP.push(id); }
PE_SELL.pe_marinera = PE_MAR.map(c => 'cosi_' + c[0]).concat(['cosi_c_mx_zapatos_baile']);
FS_TRAJE.pe = new Set(PE_MAR.map(c => c[0]));
FS_LOOK.pe_marinera[2] = { body: 'c_pe_marinera_azul_blusa', legs: 'c_pe_marinera_azul_falda', head: 'c_pe_marinera_flor', feet: 'c_mx_zapatos_baile' }; FS_LOOK.pe_marinero[2] = { body: 'c_pe_terno', legs: 'c_pe_terno_pantalon', head: 'c_pe_sombrero_paja', feet: 'c_mx_zapatos_baile' };
// concurso de marinera: +50 % con ropa de marinera
fsMarinera = (orig => () => { const tr = fsWearing('pe'); if (!tr) return orig(); const g0 = G.P.gold; orig(); const watch = setInterval(() => { if (!$('#modal') || $('#modal').hidden) { clearInterval(watch); const won = G.P.gold - g0; if (won > 0) { const bonus = Math.round(won * 0.5); G.P.gold += bonus; toast('🤍 ' + L2('Bonus por la ropa de marinera: +', 'Marinera clothing bonus: +') + bonus, 'quest', 3); markDirty(); } } }, 500); })(fsMarinera);

// ---------- Lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') {
  GSIS.unshift(['armaduras_pais', '🛡 ' + L2('Armaduras de Perú, México y España (nivel 400-490)', 'Peru, Mexico and Spain armour (level 400-490)'), () => [
    L2('Seis armaduras nuevas, iguales para todas las clases, en la herrería (sin nivel de Herrería):', 'Six new armour sets, the same for every class, at the blacksmith (no Smithing level needed):'),
    L2('Heraldo de Castilla (nivel 400): capelina, brigantina y sobreveste rojo y azul. Mena de Toledo + Cordobán.', 'Herald of Castile (level 400): kettle hat, brigandine and red-and-blue surcoat. Toledo Ore + Cordovan.'),
    L2('Señor de Sipán (430): tocado de oro en media luna, pectoral de placas y faldellín de cascabeles. Guerrero Inca (440): casco de plata con plumas, uncu rojo con placas de oro y capa. Mineral de Inti (vetas del Desierto de las Lomas, Perú) + Arena de Nihil.', 'Lord of Sipán (430): gold crescent headdress, plated pectoral and belled kilt. Inca Warrior (440): silver feathered helmet, red uncu with gold plates and cape. Inti Ore (veins in the Desert of the Lomas, Peru) + Nihil Sand.'),
    L2('Guerrero del Sol (460): tocado solar de rayos y turquesa, pecho pintado de azul con el sol y capa de plumas. Guerrero Jaguar (470): yelmo de jaguar, piel de guerra y faldellín de greca. Mineral de Tonatiuh (vetas del Desierto de las Ánimas, México) + Obsidiana de Ánima.', 'Sun Warrior (460): rayed turquoise sun headdress, blue-painted chest with the sun and feather cape. Jaguar Warrior (470): jaguar helm, war pelt and fret kilt. Tonatiuh Ore (veins in the Desert of the Souls, Mexico) + Soul Obsidian.'),
    L2('Tercio de Toledo (490): borgoñota, coraza grabada con rodelas y escarcelas. Mena de Toledo (vetas de Castilla-La Mancha, junto al espadero Maese Gonzalo) + Cordobán (Rafael, curtidor de Córdoba, en Andalucía).', 'Toledo Tercio (490): burgonet, etched cuirass with rondels and tassets. Toledo Ore (veins in Castile-La Mancha, by the swordsmith Master Gonzalo) + Cordovan (Rafael, the Córdoba tanner, in Andalusia).'),
    L2('Las vetas se pican desde el nivel 400 y vuelven a brillar a los 90 segundos. Las criaturas de esas zonas también sueltan el mineral. Lupa › Enemigos: las criaturas de nivel 410-500 ya tienen flecha hasta su zona.', 'Veins can be mined from level 400 and shine again after 90 seconds. Creatures in those areas also drop the ore. Magnifier › Enemies: level 410-500 creatures now have an arrow to their area.'),
    L2('Todas las armas y armaduras de la herrería se fabrican ya sin nivel de Herrería: solo piden tu nivel, oro y materiales.', 'Every weapon and armour at the blacksmith can now be made without a Smithing level: they only need your level, gold and materials.')], () => ({ loc: (G.maps.lima_norte && G.maps.lima_norte.cbGate) || [210, 27], t: L2('Desierto de las Lomas (Mineral de Inti)', 'Desert of the Lomas (Inti Ore)'), m: 'lima_norte' })]);
  GSIS.unshift(['marinera', '🤍 ' + L2('Marinera en la Plaza de Armas (Lima)', 'Marinera in the Plaza de Armas (Lima)'), () => [
    L2('La Profesora Milagros organiza el concurso de marinera en la tarima de la Plaza de Armas de Lima: juego de ritmo con pañuelo y aprendes el baile Marinera.', 'Teacher Milagros runs the marinera contest on the stage in Lima\'s Plaza de Armas: a rhythm game with a handkerchief and you learn the Marinera dance.'),
    L2('Vende la ropa: vestido azul bordado, falda roja plisada con blusa blanca, vestido celeste con encaje y flores para el moño; para los hombres, terno a rayas con su pantalón y sombrero de paja. Con ropa de marinera ganas un 50 % más en el concurso.', 'She sells the clothes: embroidered blue dress, pleated red skirt with white blouse, sky-blue lace dress and bun flowers; for men, a pinstripe suit with trousers and a straw hat. In marinera clothing you earn 50% more in the contest.')], () => ({ loc: [LM_PLAZA.cx, LM_PLAZA.y1 - 4], t: L2('Plaza de Armas', 'Plaza de Armas'), m: 'lima' })]);
  GSIS.unshift(['interfaz519', '▦ ' + L2('Atajos, transformaciones y mapas', 'Shortcuts, transformations and maps'), () => [
    L2('Botón ▦ Atajos arriba a la derecha: dentro están Mazmorras, Familia, Montura, Jugadores, Lupa, Libro, Mapa, Menú y los botones de cada zona. Brilla si algo de dentro tiene aviso.', '▦ Shortcuts button at the top right: Dungeons, Family, Mount, Players, Magnifier, Book, Map, Menu and each area\'s buttons are inside. It glows if something inside needs attention.'),
    L2('🌀 Transformaciones (dentro de Atajos): Normal, Forma Híbrida, Lobo a cuatro patas o la forma de tu subraza. Las que no tienes salen bloqueadas y dicen cómo conseguirlas.', '🌀 Transformations (inside Shortcuts): Normal, Hybrid Form, four-legged Wolf or your subrace form. The ones you lack are locked and say how to get them.'),
    L2('Mapa: las flechas pasan por los 7 mapas principales (Tierras del Vínculo, Japón, Perú, México, España, Velo Roto y Archipiélago); el botón «Mapas secundarios» muestra el resto.', 'Map: the arrows cycle the 7 main maps (Lands of the Bound, Japan, Peru, Mexico, Spain, Broken Veil and Archipelago); the «Secondary maps» button shows the rest.')], () => null]);
}
