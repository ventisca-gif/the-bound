// ================= v5.78: EQUIPO DE NIVEL 505-600 (tiers 37-43) =================
// 49 armaduras (7 tiers x 7 clases) y 49 armas, cada una con su propio diseño. Las armaduras se dibujan con fitKind y las
// medidas del cuerpo (se ajustan solas a las 10 estructuras); las armas se dibujan en código (mano 16 px, HD 32 px e icono)
// y usan el efecto de ataque del tier 26 con los colores de su tier. Se forjan con Maese Hilario (Tierras Tejidas).
//   37 Legado (505): un tema por clase · 38 Escarcha Eterna (520) · 39 Raíz Ancestral (535) · 40 Engranaje del Tiempo (550)
//   41 Prisma Velado (565) · 42 Fénix de Ceniza (580) · 43 Aurora Divina (600)
// Lore: el hilo aprende el patrón de lo que toca (LORE §30); Hilario forja el metal con hebras que recuerdan ese patrón.
const TJC = {
  lino: P5(['#4a3a24', '#7a6440', '#a89068', '#cdb890', '#eadcb8']), cuero: P5(['#2a160c', '#4a2a16', '#6a4022', '#8a5a32', '#b07a4a']),
  lana: P5(['#1e2432', '#344058', '#4e6080', '#7488a8', '#a8b8d0']), hoja: P5(['#14280e', '#24461a', '#3a6a2a', '#5a9a3e', '#90c868']),
  gris: P5(['#1c1c22', '#2e2e36', '#44444e', '#62626e', '#8a8a96']), rojo: P5(['#3a0a08', '#6a1410', '#a02418', '#d0402a', '#f07a5a']),
  amar: P5(['#5a3a08', '#9a6a10', '#d0a020', '#f0d050', '#fff0a0']), papel: P5(['#6a6458', '#9a9486', '#cac4b4', '#ece6d6', '#fffcf0']),
  mar: P5(['#08283a', '#104a5e', '#1a7080', '#3aa0a8', '#8ad8d8']), arena: P5(['#5a4a2a', '#8a7448', '#b8a070', '#dccaa0', '#f6ecd0']),
  obs: P5(['#08080c', '#121218', '#1e1e28', '#2e2e3a', '#464656']), lava: P5(['#5a1004', '#a02a06', '#e05a10', '#ff9a2a', '#ffe08a']),
  noche: P5(['#06081a', '#0e1230', '#1a2050', '#2c3478', '#4a56a8']), oro: P5(['#5a3a0a', '#9a6a14', '#d0a030', '#f0d060', '#fff4b0']),
  torm: P5(['#0a1a30', '#163056', '#24508a', '#3c7ac0', '#7ab0e8']), plata: P5(['#3a3e48', '#6a707c', '#a0a8b4', '#d0d6de', '#f4f6fa']),
  carm: P5(['#2a0206', '#5a0610', '#9a0e1e', '#e0203a', '#ff7088']), blanco: P5(['#7a7480', '#aca6b2', '#d4d0da', '#eeecf2', '#ffffff']),
  viol: P5(['#12061e', '#240c3a', '#3c1660', '#5e2a90', '#9a5ad0']), verdeV: P5(['#06301a', '#0a5a30', '#14a050', '#40e080', '#b0ffc8']),
  abis: P5(['#020c1a', '#061a34', '#0c2c54', '#164a7a', '#2a70a8']), bio: P5(['#044a4a', '#0a8a8a', '#20d0c8', '#70fff0', '#e0fffc']),
  coral: P5(['#4a0e1a', '#8a1e2a', '#c83a3a', '#f07060', '#ffb0a0']), hueso: P5(['#5a5040', '#8a806a', '#bab098', '#e0d8c4', '#fcf8ec']),
};
const TJ4 = P => [P[1], P[2], P[3], P[4]];
const tjSh = (p, A, P, r, oneSide) => { const { tx0, tw, torsoTop: ty, cx, side, d, up } = A; if (side) { if (oneSide === undefined || oneSide === d * (up ? -1 : 1) || true) p.ball(cx - 1 - d, ty + 1.5, r, r * 0.8, TJ4(P)); return; }
  const L = [tx0 - 1, tx0 + tw]; const which = oneSide ? [up ? L[1] : L[0]] : L; for (const sx of which) p.ball(sx, ty + 1.5, r, r * 0.8, TJ4(P)); };
const tjBelt = (p, A, P, buckle) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A; p.hl(tx0, ty + th - 2, tw, P[1]); if (buckle && !up && !side) p.set(cx, ty + th - 2, buckle); };
const tjTails = (p, A, P, len, inner, split) => { const { tx0, tw, torsoTop: ty, th, legTop, base, side, up, cx, d } = A, R = tx0 + tw - 1, y1 = Math.min(base - 1, legTop + len);
  for (let y = ty + th - 1; y < y1; y++) { const w = Math.floor((y - ty - th) / 3); if (up) { for (let x = tx0 - 1 - (w > 0 ? 1 : 0); x <= R + 1 + (w > 0 ? 1 : 0); x++) p.set(x, y, P[(x + y) % 5 ? 2 : 1]); continue; }
    if (side) { for (let i = -1; i < 4; i++) p.set(cx - d * i, y, P[i <= 0 ? 3 : 2]); continue; }
    for (let x = tx0 - 1 - (w > 0 ? 1 : 0); x <= R + 1 + (w > 0 ? 1 : 0); x++) { const c = Math.abs(x - cx + 0.5); if (split && c < 1.5) { if (inner) p.set(x, y, inner[2]); continue; } p.set(x, y, x <= tx0 - 1 ? P[3] : x >= R + 1 ? P[1] : P[2]); } }
  if (!side) p.hl(tx0 - 2, y1 - 1, tw + 4, P[1]); };
const tjHood = (p, A, P, opts = {}) => { const { hx: cx, hy, headTop: top, hrx, side, up, d, ey } = A, rx = hrx + 1.5;
  for (let y = top - 1; y <= ey + 5; y++) for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
    const q = ((x - cx) / rx) ** 2 + ((y - (top + 6)) / 8) ** 2; if (q > 1) continue;
    const inFace = !up && (side ? (x - cx) * d > -1 && y > top + 3 : Math.abs(x - cx + 0.5) < hrx - 1.5 && y > top + 3);
    if (inFace) continue; p.set(x, y, q > 0.8 ? P[1] : (x < cx - rx / 2) ? P[3] : P[2]); }
  if (!up && !side) p.hl(Math.round(cx - hrx + 1.5), top + 3, Math.round(hrx * 2 - 2), P[1]);
  if (opts.point && up) { p.set(cx, ey + 6, P[1]); p.set(cx, ey + 7, P[1]); } };

// ===================== NIVEL 500 =====================
// Guerrero · Coloso de Obsidiana: placas negras con grietas de lava, hombreras enormes, yelmo con cuernos
const tjCracks = (p, x0, y0, x1, y1, seed) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const h = (x * 73856093 ^ y * 19349663 ^ seed) >>> 0; if (h % 11 === 0) { p.set(x, y, TJC.lava[3]); if (h % 3 === 0) p.set(x + 1, y + 1, TJC.lava[2]); } } };
fitKind('body', 'tj_coloso', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, O = TJC.obs, R = tx0 + tw - 1;
  for (let y = ty + 2; y < ty + th - 2; y += 3) p.hl(tx0, y, tw, O[1]);
  if (!up && !side) { p.vl(cx - 1, ty + 1, th - 3, TJC.lava[2]); p.vl(cx, ty + 1, th - 3, TJC.lava[3]); p.ball(cx - 0.5, ty + 3, 1.5, 1.5, [TJC.lava[1], TJC.lava[2], TJC.lava[3], TJC.lava[4]]); }
  tjCracks(p, tx0, ty + 2, R, ty + th - 3, 7);
  const { torsoTop } = A; if (side) { p.ball(cx - 1 - d, ty + 1, 4, 3.2, TJ4(O)); p.set(cx - 1 - d, ty - 1, TJC.lava[3]); p.set(cx - 1 - d * 2, ty - 2, O[3]); }
  else for (const sx of [tx0 - 2, R + 2]) { p.ball(sx, ty + 1, 4, 3.2, TJ4(O)); p.hl(sx - 3, ty + 3, 7, TJC.lava[2]); const sp = sx < cx ? -1 : 1; p.set(sx + sp * 2, ty - 2, O[3]); p.set(sx + sp * 3, ty - 3, O[4]); }
  p.hl(tx0, ty + th - 2, tw, TJC.oro[2]); if (!up && !side) p.ball(cx - 0.5, ty + th - 2, 1.4, 1, TJ4(TJC.lava)); });
fitKind('head', 'tj_coloso_h', (p, A) => { const { hx: cx, hy, headTop: top, hrx, side, up, d, ey } = A, O = TJC.obs;
  p.ball(cx, top + 3.5, hrx + 1, 5.5, TJ4(O)); p.hl(Math.round(cx - hrx) - 1, top + 6, Math.round(hrx * 2) + 3, O[1]);
  if (!up && !side) { p.vl(cx, top - 1, 6, TJC.lava[3]); p.vl(cx - 1, top, 5, TJC.lava[2]); }
  for (const sx of side ? [-d] : [-1, 1]) { let x = cx + sx * (hrx - 1), y = top + 2; for (let k = 0; k < 7; k++) { x += sx * (k < 3 ? 1 : 0.4); y -= k < 3 ? 0.6 : 1.2; p.set(Math.round(x), Math.round(y), k > 4 ? TJC.lava[3] : O[3]); p.set(Math.round(x), Math.round(y) + 1, O[2]); } }
  if (!up) for (const sx of side ? [-d] : [-1, 1]) for (let y = top + 6; y <= ey + 4; y++) { p.set(Math.round(cx + sx * (hrx + 0.5)), y, O[2]); p.set(Math.round(cx + sx * (hrx + 1.5)), y, O[1]); }
  if (up) for (let y = top + 6; y <= ey + 4; y++) for (let x = Math.round(cx - hrx); x <= cx + hrx; x++) p.set(x, y, O[(x + y) % 5 ? 2 : 1]); });
fitKind('legs', 'tj_placas', (p, A, s) => { const { legTop, base } = A, cols = new Set(s.m);
  for (let y = legTop; y < base - 1; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) { if ((y - legTop) % 3 === 2) p.set(x, y, s.m[0]); else if ((x * 7 + y * 13) % 17 === 0) p.set(x, y, TJC.lava[3]); } });

// Mago · Arcanista Estelar: túnica de cielo nocturno con estrellas y constelación, cuello alto, anillo orbital
fitKind('body', 'tj_estelar', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, N = TJC.noche, R = tx0 + tw - 1;
  tjTails(p, A, N, 9, TJC.viol, !up && !side);
  const y1 = Math.min(A.base - 1, A.legTop + 9);
  for (let y = ty + 1; y < y1; y++) for (let x = tx0 - 3; x <= R + 3; x++) { const c = p.get(x, y); if ((c === N[2] || c === N[1] || c === N[3]) && ((x * 31 + y * 17) % 23 === 0)) p.set(x, y, TJC.oro[4]); }
  if (!up && !side) { p.line(tx0 + 1, ty + 3, cx - 2, ty + 6, TJC.oro[2]); p.line(cx - 2, ty + 6, tx0 + 2, ty + th - 2, TJC.oro[2]); p.set(tx0 + 1, ty + 3, TJC.oro[4]); p.set(cx - 2, ty + 6, TJC.oro[4]); p.set(tx0 + 2, ty + th - 2, TJC.oro[4]);
    for (let y = ty; y < y1; y++) { p.set(cx - 2, y, TJC.oro[3]); p.set(cx + 1, y, TJC.oro[3]); } }
  for (let x = tx0 - 2; x <= R + 2; x++) { p.set(x, ty - 1, N[3]); p.set(x, ty, TJC.oro[x % 2 ? 3 : 2]); }
  if (!side) { p.set(tx0 - 2, ty - 2, N[4]); p.set(R + 2, ty - 2, N[4]); } });
fitKind('head', 'tj_orbita', (p, A) => { const { hx: cx, headTop: top, hrx, side, up, d } = A, cy = top - 1;
  for (let a = 0; a < 40; a++) { const t = a / 40 * 6.283, x = Math.round(cx + Math.cos(t) * (side ? 5 : 9)), y = Math.round(cy + Math.sin(t) * 2.2); const back = Math.sin(t) < 0; if (back && p.get(x, y) !== 1) continue; p.set(x, y, TJC.oro[back ? 2 : 3]); }
  p.ball(Math.round(cx + (side ? d * 4 : 8)), cy + 1, 1.3, 1.3, TJ4(TJC.torm)); p.ball(Math.round(cx - (side ? d * 4 : 8)), cy - 1, 1, 1, TJ4(TJC.viol));
  if (!up) { const x = side ? Math.round(cx + d * 3) : cx; p.set(x, top + 3, TJC.oro[4]); p.set(x - 1, top + 3, TJC.oro[2]); p.set(x + 1, top + 3, TJC.oro[2]); p.set(x, top + 2, TJC.oro[2]); p.set(x, top + 4, TJC.oro[2]); } }, { float: true });

// Arquero · Halcón de la Tormenta: hombreras de plumas de acero, rayos dorados, diadema alada
fitKind('body', 'tj_halcon', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, T = TJC.torm, Pl = TJC.plata, R = tx0 + tw - 1;
  if (!up && !side) { p.ball(cx - 0.5, ty + 4, 3, 3, TJ4(Pl)); p.line(cx - 2, ty + 3, cx, ty + 5, TJC.oro[3]); p.line(cx, ty + 5, cx - 1, ty + 6, TJC.oro[3]); p.line(cx - 1, ty + 6, cx + 1, ty + 8, TJC.oro[4]); }
  const feathers = (x, sx) => { for (let k = 0; k < 4; k++) { const fx = x + sx * k, fy = ty - 1 + k; p.vl(fx, fy, 4 - (k >> 1), Pl[k % 2 ? 2 : 3]); p.set(fx, fy + 4 - (k >> 1), T[3]); } };
  if (side) feathers(cx - d * 2, -d); else { feathers(tx0 - 1, -1); feathers(R + 1, 1); }
  if (up) { p.line(tx0, ty + 2, R, ty + th - 2, TJC.cuero[3]); p.rect(R - 2, ty - 3, 3, 7, T[1]); p.hl(R - 2, ty - 3, 3, TJC.oro[3]); p.set(R - 2, ty - 4, Pl[4]); p.set(R, ty - 4, Pl[4]); }
  tjBelt(p, A, T, TJC.oro[4]); p.hl(tx0, ty + th - 3, tw, TJC.oro[2]); });
fitKind('head', 'tj_alas', (p, A) => { const { hx: cx, headTop: top, hrx, side, up, d } = A, Pl = TJC.plata;
  p.hl(Math.round(cx - hrx), top + 4, Math.round(hrx * 2) + 1, TJC.oro[2]); p.hl(Math.round(cx - hrx) + 1, top + 3, Math.round(hrx * 2) - 1, TJC.oro[3]);
  if (!up && !side) { p.ball(cx - 0.5, top + 3.5, 1.4, 1.4, TJ4(TJC.torm)); }
  for (const sx of side ? [-d] : [-1, 1]) { const x0 = Math.round(cx + sx * hrx); for (let k = 0; k < 5; k++) { const x = x0 + sx * k, y0 = top + 3 - k; p.vl(x, y0, 2 + (k >> 1), Pl[k === 4 ? 4 : 3]); p.set(x, y0 + 2 + (k >> 1), Pl[1]); } } });

// Asesino · Hoja Carmesí: traje negro con líneas carmesí que brillan, bufanda roja larga, media máscara con colmillos
fitKind('body', 'tj_carmesi', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, Cr = TJC.carm, R = tx0 + tw - 1;
  if (!side) { p.line(tx0, ty + 2, R, ty + th - 3, Cr[3]); p.line(R, ty + 2, tx0, ty + th - 3, Cr[3]); } else p.vl(cx, ty + 2, th - 4, Cr[3]);
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty - 1, Cr[x & 1 ? 3 : 2]); p.set(x, ty, Cr[x & 1 ? 2 : 1]); }
  const tail = (x, sx) => { for (let k = 0; k < 9; k++) { p.set(x + sx * (k >> 2), ty + 1 + k, Cr[k & 1 ? 2 : 3]); p.set(x + sx * (k >> 2) + sx, ty + 1 + k, Cr[1]); } };
  if (side) tail(cx - d * 2, -d); else if (up) { tail(cx - 1, 1); } else tail(R, 1);
  p.hl(tx0, ty + th - 2, tw, TJC.obs[3]); if (!up && !side) p.set(cx, ty + th - 2, Cr[4]); });
fitKind('head', 'tj_oni', (p, A) => { const { hx: cx, headTop: top, hrx, side, up, d, ey } = A; tjHood(p, A, TJC.obs, {});
  for (const sx of side ? [-d] : [-1, 1]) { const x = Math.round(cx + sx * (hrx - 2)); p.set(x, top - 1, TJC.carm[3]); p.set(x, top - 2, TJC.carm[3]); p.set(x + sx, top - 3, TJC.carm[4]); }
  if (!up) { const y0 = ey + 3; const xs = side ? [Math.round(cx), Math.round(cx + d * (hrx + 1))] : [Math.round(cx - hrx + 1), Math.round(cx + hrx - 1)];
    for (let y = y0; y <= y0 + 3; y++) for (let x = Math.min(...xs); x <= Math.max(...xs); x++) p.set(x, y, y === y0 ? TJC.obs[3] : TJC.obs[2]);
    if (!side) { for (const x of [cx - 3, cx - 1, cx + 1, cx + 3]) p.set(x, y0 + 2, TJC.papel[4]); p.hl(cx - 3, y0 + 1, 7, TJC.carm[3]); } else { p.set(Math.round(cx + d * 3), y0 + 2, TJC.papel[4]); p.set(Math.round(cx + d * 2), y0 + 1, TJC.carm[3]); } } });
fitKind('legs', 'tj_lineas', (p, A, s) => { const { legTop, base } = A, cols = new Set(s.m); for (let y = legTop + 1; y < base - 1; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y)) && !cols.has(p.get(x - 1, y))) p.set(x, y, TJC.carm[3]); });

// Bardo · Sinfonía Áurea: levita blanca con faldones, pentagrama dorado con notas, charreteras con borlas, corona de lira
fitKind('body', 'tj_sinfonia', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, B = TJC.blanco, R = tx0 + tw - 1, G_ = TJC.oro;
  const { legTop, base } = A, y1 = Math.min(base - 2, legTop + 7);
  for (let y = ty + th - 1; y < y1; y++) { if (up) { for (let x = tx0; x <= R; x++) if (Math.abs(x - cx + 0.5) > 0.6 || y < ty + th + 1) p.set(x, y, B[(x + y) % 6 ? 2 : 1]); continue; }
    if (side) { for (let i = 1; i < 4; i++) p.set(cx - d * i, y, B[i === 1 ? 3 : 2]); continue; } for (const x of [tx0, tx0 + 1, R - 1, R]) p.set(x, y, B[x === tx0 || x === R ? 2 : 3]); }
  if (!up && !side) { for (let y = ty + 1; y < ty + th - 2; y++) { p.set(cx - 1, y, TJC.noche[2]); p.set(cx, y, TJC.noche[1]); } for (let y = ty + 2; y < ty + th - 2; y += 2) { p.set(cx - 2, y, G_[4]); p.set(cx + 1, y, G_[4]); } }
  if (up || side) { for (let k = 0; k < 3; k++) p.hl(tx0 + 1, ty + 2 + k * 2, tw - 2, G_[2]); p.set(tx0 + 2, ty + 3, TJC.noche[1]); p.set(tx0 + 2, ty + 2, TJC.noche[1]); p.set(R - 3, ty + 5, TJC.noche[1]); p.set(R - 2, ty + 4, TJC.noche[1]); }
  const epa = (x) => { p.hl(x - 2, ty, 5, G_[3]); p.hl(x - 2, ty + 1, 5, G_[2]); for (let i = -2; i <= 2; i += 2) p.vl(x + i, ty + 2, 2, G_[1]); };
  if (side) epa(cx - 1 - d); else { epa(tx0 - 1); epa(R + 1); }
  p.hl(tx0, ty + th - 2, tw, G_[2]); });
fitKind('head', 'tj_lira', (p, A) => { const { hx: cx, headTop: top, hrx, side, up, d } = A, G_ = TJC.oro, V = TJC.hoja;
  for (let x = Math.round(cx - hrx + 1); x <= cx + hrx - 1; x++) { p.set(x, top + 4, V[(x % 2) ? 3 : 2]); if (x % 2 === 0) p.set(x, top + 3, V[4]); }
  if (!side) { const xs = [cx - 3, cx + 2]; for (const [i, x] of xs.entries()) { for (let y = top - 3; y <= top + 3; y++) p.set(x + (y < top - 1 ? (i ? 1 : -1) : 0), y, G_[3]); } p.hl(cx - 4, top - 3, 2, G_[4]); p.hl(cx + 3, top - 3, 2, G_[4]); p.hl(cx - 3, top + 2, 6, G_[2]); for (const x of [cx - 1, cx, cx + 1]) p.vl(x, top - 2, 4, TJC.blanco[3]); }
  else { p.vl(Math.round(cx), top - 3, 6, G_[3]); p.set(Math.round(cx - d), top - 4, G_[4]); } });

// Invocador · Señor de los Pactos: túnica violeta con ojo rúnico, cadenas, corona de hueso con tercer ojo, círculo flotante a la espalda
fitKind('body', 'tj_pactos', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, V = TJC.viol, G = TJC.verdeV, R = tx0 + tw - 1;
  tjTails(p, A, V, 9, TJC.obs, !up && !side);
  if (!side) { const cy = ty + Math.round(th / 2) - 1; for (let x = cx - 3; x <= cx + 2; x++) { const e = Math.abs(x - cx + 0.5); p.set(x, cy - (e < 2 ? 1 : 0), G[3]); p.set(x, cy + (e < 2 ? 1 : 0), G[3]); } if (!up) { p.set(cx - 1, cy, G[4]); p.set(cx, cy, TJC.obs[0]); } else { p.set(cx - 1, cy, G[2]); p.set(cx, cy, G[2]); } }
  if (!up && !side) { for (let k = 0; k < tw; k++) p.set(tx0 + k, ty + 1 + Math.round(Math.sin(k / tw * 3.14) * 2), k % 2 ? TJC.plata[3] : TJC.plata[1]); }
  for (let x = tx0 - 2; x <= R + 2; x++) p.set(x, ty, TJC.hueso[x % 2 ? 3 : 2]); if (!side) for (const x of [tx0 - 2, R + 2]) { p.set(x, ty - 1, TJC.hueso[4]); p.set(x, ty - 2, TJC.hueso[3]); }
  p.hl(tx0, ty + th - 2, tw, TJC.obs[3]); if (!up && !side) p.set(cx, ty + th - 2, G[4]); });
fitKind('head', 'tj_corona_hueso', (p, A) => { const { hx: cx, headTop: top, hrx, side, up, d } = A, Hu = TJC.hueso;
  p.hl(Math.round(cx - hrx), top + 3, Math.round(hrx * 2) + 1, Hu[2]); p.hl(Math.round(cx - hrx), top + 4, Math.round(hrx * 2) + 1, Hu[1]);
  for (let x = Math.round(cx - hrx) + 1; x < cx + hrx; x += 3) { p.set(x, top + 2, Hu[3]); p.set(x, top + 1, Hu[4]); }
  for (const sx of side ? [-d] : [-1, 1]) { let x = cx + sx * (hrx - 0.5), y = top + 3; for (let k = 0; k < 6; k++) { x += sx * (k < 2 ? 1 : 0.2); y -= k < 2 ? 0.8 : 1.2; p.set(Math.round(x), Math.round(y), Hu[k > 3 ? 4 : 3]); p.set(Math.round(x) + sx, Math.round(y) + 1, Hu[1]); } }
  if (!up) { const x = side ? Math.round(cx + d * (hrx - 2)) : cx; p.ball(x - (side ? 0 : 0.5), top + 3, 1.4, 1.3, TJ4(TJC.verdeV)); p.set(x, top + 3, TJC.obs[0]); } });
fitKind('back', 'tj_circulo', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, G = TJC.verdeV, cy = ty + 2, r = side ? 4 : 10, ry = 10;
  for (let a = 0; a < 64; a++) { const t = a / 64 * 6.283, x = Math.round(cx - 0.5 + Math.cos(t) * r), y = Math.round(cy + Math.sin(t) * ry); if (p.get(x, y) === 1) p.set(x, y, G[a % 4 ? 2 : 4]); }
  for (let a = 0; a < 6; a++) { const t = a / 6 * 6.283, x = Math.round(cx - 0.5 + Math.cos(t) * r * 0.75), y = Math.round(cy + Math.sin(t) * ry * 0.75); if (p.get(x, y) === 1) p.set(x, y, G[3]); } }, { float: true });

// Pez · Leviatán Abisal: escamas azul abismo con luces bioluminiscentes, aletas en los hombros, cresta de aleta
fitKind('body', 'tj_leviatan', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, Ab = TJC.abis, B = TJC.bio, R = tx0 + tw - 1;
  for (let y = ty + 1; y < ty + th - 1; y++) for (let x = tx0; x <= R; x++) if ((y - ty) % 2 === 0 ? (x % 2 === 0) : (x % 2 === 1)) p.set(x, y, Ab[(y - ty) % 4 < 2 ? 3 : 1]);
  for (const [dx, dy] of [[1, 3], [-2, 5], [2, 7], [-1, 1]]) if (!side || dx * d > 0) p.set(cx + dx, ty + dy, B[3]);
  const fin = (x, sx) => { for (let k = 0; k < 5; k++) { p.vl(x + sx * k, ty - 2 + k, 4 - (k >> 1), k % 2 ? B[2] : B[1]); p.set(x + sx * k, ty - 2 + k, B[4]); } };
  if (side) fin(cx - 1 - d, -d); else { fin(tx0 - 1, -1); fin(R + 1, 1); }
  for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, ty, TJC.coral[x % 2 ? 3 : 2]);
  p.hl(tx0, ty + th - 2, tw, TJC.coral[2]); if (!up && !side) p.ball(cx - 0.5, ty + th - 2, 1.3, 1, TJ4(TJC.bio)); });
fitKind('head', 'tj_cresta', (p, A) => { const { hx: cx, headTop: top, hrx, side, up, d, ey } = A, B = TJC.bio, Ab = TJC.abis;
  p.ball(cx, top + 3, hrx + 0.5, 4.5, TJ4(Ab)); p.hl(Math.round(cx - hrx), top + 5, Math.round(hrx * 2) + 1, TJC.coral[2]);
  if (side) { for (let k = 0; k < 9; k++) { const x = Math.round(cx + d * 3 - d * k), h = 5 - Math.abs(k - 3) * 0.6; p.vl(x, Math.round(top - h + 1), Math.max(1, Math.round(h)), k % 2 ? B[2] : B[3]); } }
  else { for (let y = top - 6; y <= top + 1; y++) { p.set(cx - 1, y, B[2]); p.set(cx, y, B[3]); } for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) p.vl(Math.round(cx + sx * (hrx + 1 + k * 0.5)), tjHy(A) - 1 + k, 4 - k, k % 2 ? B[1] : B[2]); }
  for (const [dx, dy] of [[-4, 2], [3, 1], [5, 3]]) if (!side || dx * d > 0) p.set(cx + dx, top + dy, B[4]); });
function tjHy(A) { return Math.round(A.hy) - 2; }


// ---------- tiers 38-43: un tema por tier y un diseño propio por clase ----------
const TJT = [
  { id: 'escarcha', n: 'Escarcha Eterna', lv: 520, m: P5(['#2a3a5a', '#4a6a96', '#7aa4cc', '#b4daf0', '#eefaff']), a: P5(['#0a1a3a', '#12306a', '#1e4ea0', '#3a7ad0', '#7ab4f0']), g: P5(['#1a6a8a', '#3aa8c8', '#7ae0f0', '#c0f8ff', '#ffffff']) },
  { id: 'raiz', n: 'Raíz Ancestral', lv: 535, m: P5(['#2a1a0e', '#4a2e18', '#6a4426', '#8a6038', '#ae8052']), a: P5(['#0e2a10', '#1a4a1c', '#2a6e2a', '#4a9a3a', '#88c860']), g: P5(['#6a3a00', '#b06a00', '#f0a020', '#ffd060', '#fff4b0']) },
  { id: 'engranaje', n: 'Engranaje del Tiempo', lv: 550, m: P5(['#3a2410', '#6a4220', '#a06a30', '#d09a4a', '#f4d08a']), a: P5(['#0a2a2a', '#124848', '#1e6e6a', '#3a9a90', '#7ad0c4']), g: P5(['#1a4a5a', '#2a8aa0', '#5ad0e0', '#a8f4ff', '#ffffff']) },
  { id: 'prisma', n: 'Prisma Velado', lv: 565, m: P5(['#4a3a6a', '#7a6aa0', '#aa9ad0', '#d8ccf0', '#fbf6ff']), a: P5(['#5a1a4a', '#902a74', '#c84aa0', '#f080c8', '#ffc0ea']), g: P5(['#1a6a7a', '#2aa8b8', '#5ae0e8', '#b0fcff', '#ffffff']) },
  { id: 'fenix', n: 'Fénix de Ceniza', lv: 580, m: P5(['#1a1616', '#2e2828', '#463e3c', '#645a56', '#8a807a']), a: P5(['#5a0a04', '#a01a08', '#e04010', '#ff8020', '#ffd060']), g: P5(['#8a2a00', '#e06000', '#ffa020', '#ffe060', '#fffce0']) },
  { id: 'aurora', n: 'Aurora Divina', lv: 600, m: P5(['#8a8496', '#b8b2c4', '#dcd8e6', '#f2f0f8', '#ffffff']), a: P5(['#5a3a0a', '#9a6a14', '#d0a030', '#f0d060', '#fff4b0']), g: P5(['#2a8a6a', '#4ad0a0', '#a0f0c8', '#f8b0e0', '#fff0fa']) },
];
const TJTI = id => TJT.findIndex(t => t.id === id);
// ---------- motivos ----------
function tjEmblem(p, x, y, T) { const g = T.g, a = T.a, m = T.m; switch (T.id) {
  case 'escarcha': for (const [dx, dy] of [[0, -2], [0, -1], [0, 1], [0, 2], [-2, 0], [-1, 0], [1, 0], [2, 0], [-1, -1], [1, 1], [1, -1], [-1, 1]]) p.set(x + dx, y + dy, Math.abs(dx) + Math.abs(dy) > 1 ? g[2] : g[3]); p.set(x, y, g[4]); break;
  case 'raiz': p.set(x, y + 2, m[1]); p.set(x, y + 1, a[2]); for (const [dx, dy] of [[-1, 0], [0, 0], [1, 0], [-1, -1], [0, -1], [0, -2], [1, -1]]) p.set(x + dx, y + dy, a[dy === -2 ? 4 : 3]); p.set(x, y, g[3]); break;
  case 'engranaje': for (let k = 0; k < 8; k++) { const t = k / 8 * 6.283; p.set(Math.round(x + Math.cos(t) * 2.2), Math.round(y + Math.sin(t) * 2.2), m[k % 2 ? 3 : 4]); } p.set(x, y, g[3]); p.set(x, y - 1, a[2]); p.set(x + 1, y, a[2]); break;
  case 'prisma': for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) + Math.abs(dy) <= 2) p.set(x + dx, y + dy, dx < 0 ? a[3] : dx > 0 ? g[2] : (dy < 0 ? m[4] : a[2])); break;
  case 'fenix': for (const [dx, dy, c] of [[0, -2, 4], [0, -1, 3], [-1, 0, 3], [0, 0, 4], [1, 0, 2], [-1, 1, 2], [0, 1, 3], [1, 1, 2], [0, 2, 1], [-1, -1, 2], [1, -2, 3]]) p.set(x + dx, y + dy, (c > 2 ? g : a)[c]); break;
  case 'aurora': p.ball(x, y, 1.6, 1.6, [a[1], a[2], a[3], a[4]]); for (let k = 0; k < 8; k++) { const t = k / 8 * 6.283; p.set(Math.round(x + Math.cos(t) * 3), Math.round(y + Math.sin(t) * 3), k % 2 ? g[3] : a[4]); } break; } }
// hombrera según el tema; sx = hacia fuera (-1 izquierda, 1 derecha)
function tjPad(p, x, y, sx, T, r) { const m = T.m, a = T.a, g = T.g; switch (T.id) {
  case 'escarcha': p.ball(x, y, r, r * 0.8, TJ4(m)); for (let k = 0; k < 3; k++) { const ox = x + sx * (k - 1) * 1.3, h = 2 + (k === 1 ? 2 : 1) + (r > 3 ? 1 : 0); for (let j = 0; j < h; j++) p.set(Math.round(ox + sx * j * 0.3), Math.round(y - r * 0.6 - j), j === h - 1 ? g[4] : g[2 + (j & 1)]); } break;
  case 'raiz': p.ball(x, y, r, r * 0.8, TJ4(m)); for (let k = -1; k <= 1; k++) p.set(Math.round(x + k), Math.round(y - r * 0.4), m[1]); p.set(Math.round(x + sx), Math.round(y - r * 0.8) - 1, a[3]); p.set(Math.round(x + sx * 2), Math.round(y - r * 0.8) - 1, a[4]); p.set(Math.round(x + sx * 2), Math.round(y - r * 0.8), a[2]); p.set(Math.round(x), Math.round(y), g[3]); break;
  case 'engranaje': for (let k = 0; k < 10; k++) { const t = k / 10 * 6.283; p.set(Math.round(x + Math.cos(t) * (r + 1)), Math.round(y + Math.sin(t) * (r + 0.6)), m[2]); } p.ball(x, y, r, r * 0.85, TJ4(m)); p.set(Math.round(x), Math.round(y), a[1]); p.set(Math.round(x) + 1, Math.round(y), g[3]); break;
  case 'prisma': for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++) for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) if (Math.abs(dx) + Math.abs(dy) * 1.2 <= r + 0.5) p.set(Math.round(x) + dx, Math.round(y) + dy, dx * sx > 0 ? a[2] : dy < 0 ? m[4] : m[3]); p.set(Math.round(x + sx * 2), Math.round(y - r - 2), g[3]); p.set(Math.round(x + sx * 2), Math.round(y - r - 3), g[4]); break;
  case 'fenix': p.ball(x, y, r * 0.8, r * 0.7, TJ4(m)); for (let k = 0; k < 4; k++) { const ang = -1.9 + sx * 0.0 + k * 0.32 * sx, len = r + 2 + (k === 1 ? 1 : 0); for (let j = 1; j <= len; j++) p.set(Math.round(x + Math.cos(-Math.PI / 2 + sx * (0.4 + k * 0.35)) * j), Math.round(y + Math.sin(-Math.PI / 2 + sx * (0.4 + k * 0.35)) * j), j > len - 2 ? g[3] : a[2 + (j & 1)]); } break;
  case 'aurora': for (let k = 0; k < 6; k++) { const t = -Math.PI / 2 + sx * (k - 2.5) * 0.45; p.set(Math.round(x + Math.cos(t) * (r + 2)), Math.round(y + Math.sin(t) * (r + 1.5)), k % 2 ? g[3] : a[4]); } p.ball(x, y, r, r * 0.8, TJ4(m)); p.hl(Math.round(x - r + 1), Math.round(y + 1), Math.round(r * 2) - 1, a[3]); break; } }
function tjPads(p, A, T, r, one) { const { tx0, tw, torsoTop: ty, cx, side, d, up } = A; if (side) { tjPad(p, cx - 1 - d, ty + 1.5, -d, T, r); return; } const R = tx0 + tw; if (one) { const left = !up; left ? tjPad(p, tx0 - 1, ty + 1.5, -1, T, r) : tjPad(p, R, ty + 1.5, 1, T, r); return; } tjPad(p, tx0 - 1, ty + 1.5, -1, T, r); tjPad(p, R, ty + 1.5, 1, T, r); }
// adorno de cabeza según el tema (arriba de la cabeza)
function tjCrest(p, A, T, big) { const { hx: cx, headTop: top, hrx, side, up, d } = A, m = T.m, a = T.a, g = T.g, s = side ? 0.45 : 1;
  switch (T.id) {
    case 'escarcha': for (const [k, h] of [[-2, 3], [-1, 5], [0, 7], [1, 5], [2, 3]]) { if (side && k * -d > 0 && k !== 0) continue; const x = Math.round(cx + k * 2.4 * s); for (let j = 0; j < h + (big ? 1 : 0); j++) p.set(x, top + 1 - j, j > h - 2 ? g[4] : g[2 + (j & 1)]); } break;
    case 'raiz': for (const sx of side ? [-d] : [-1, 1]) { let x = cx + sx * 3 * s, y = top + 1; for (let j = 0; j < 7; j++) { x += sx * (j < 3 ? 0.6 : 0.3) * (side ? 0.6 : 1); y -= 1; p.set(Math.round(x), Math.round(y), m[3]); if (j === 3) { p.set(Math.round(x) + sx * 1, Math.round(y) - 1, m[3]); p.set(Math.round(x) + sx * 2, Math.round(y) - 2, a[4]); } } p.set(Math.round(x), Math.round(y) - 1, a[3]); } break;
    case 'engranaje': { const y = top - 2, x = side ? Math.round(cx - d * 2) : cx; for (let k = 0; k < 10; k++) { const t = Math.PI + k / 9 * Math.PI; p.set(Math.round(x + Math.cos(t) * 4 * (side ? 0.6 : 1)), Math.round(y + 2 + Math.sin(t) * 4), m[k % 2 ? 2 : 4]); } p.set(x, y - 1, g[4]); p.set(x, y, a[2]); p.vl(x, y + 1, 2, m[3]); break; }
    case 'prisma': { const x = cx, y = top - 6; for (let dy = -3; dy <= 3; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) * 1.5 + Math.abs(dy) <= 3) p.set(x + dx, y + dy, dx < 0 ? a[3] : dx > 0 ? g[2] : m[4]); if (!side) { p.set(x - 6, y + 2, g[3]); p.set(x + 6, y + 3, a[3]); } break; }
    case 'fenix': for (let k = 0; k < 5; k++) { const dir = side ? -d : 0, x0 = Math.round(cx + (side ? 0 : (k - 2) * 1.6)), len = 7 - Math.abs(k - 2); for (let j = 0; j < len; j++) p.set(Math.round(x0 + dir * j * 0.5 + (side ? 0 : (k - 2) * j * 0.25)), top + 3 - j, j > len - 3 ? g[3 + (j === len - 1 ? 1 : 0)] : a[2 + (j & 1)]); } break;
    case 'aurora': { for (let k = -3; k <= 3; k++) { if (side && k * -d > 1) continue; const x = Math.round(cx + k * 2.2 * s), h = 4 - Math.abs(k) * 0.8; for (let j = 0; j < h; j++) p.set(x, top + 1 - j, j > h - 2 ? g[4] : a[3 + (j & 1)]); } p.hl(Math.round(cx - hrx + 1), top + 2, Math.round(hrx * 2) - 1, a[2]); break; } } }

// ---------- cascos base (por clase, rotan con el tier) ----------
const TJH = {
  helm(p, A, T) { const { hx: cx, headTop: top, hrx, side, up, d, ey } = A, m = T.m; p.ball(cx, top + 3.5, hrx + 1, 5.5, TJ4(m)); p.hl(Math.round(cx - hrx) - 1, top + 6, Math.round(hrx * 2) + 3, T.a[2]);
    if (!up) for (const sx of side ? [-d] : [-1, 1]) for (let y = top + 6; y <= ey + 4; y++) { p.set(Math.round(cx + sx * (hrx + 0.5)), y, m[2]); p.set(Math.round(cx + sx * (hrx + 1.5)), y, m[1]); }
    if (up) for (let y = top + 6; y <= ey + 4; y++) for (let x = Math.round(cx - hrx); x <= cx + hrx; x++) p.set(x, y, m[(x + y) % 4 ? 2 : 1]); if (!up && !side) { p.vl(cx, top + 6, 3, m[3]); } },
  helmOpen(p, A, T) { const { hx: cx, headTop: top, hrx, side, up, d } = A, m = T.m; p.ball(cx, top + 3, hrx + 0.6, 4.5, TJ4(m)); p.hl(Math.round(cx - hrx), top + 5, Math.round(hrx * 2) + 1, T.a[3]); for (let x = Math.round(cx - hrx) + 1; x < cx + hrx; x += 3) p.set(x, top + 5, T.g[3]); },
  crown(p, A, T) { const { hx: cx, headTop: top, hrx } = A, m = T.a; p.hl(Math.round(cx - hrx), top + 3, Math.round(hrx * 2) + 1, m[2]); p.hl(Math.round(cx - hrx), top + 4, Math.round(hrx * 2) + 1, m[1]); for (let x = Math.round(cx - hrx); x <= cx + hrx; x += 2) { p.set(x, top + 2, m[3]); p.set(x, top + 1, m[4]); } p.set(cx, top + 3, T.g[3]); },
  hat(p, A, T) { const { hx: cx, headTop: top, hrx, side, up, d } = A, m = T.a; for (let x = -11; x <= 11; x++) { p.set(cx + x, top + 4, m[Math.abs(x) > 9 ? 1 : 2]); p.set(cx + x, top + 5, m[1]); } const tilt = side ? -d : 1; for (let j = 0; j < 11; j++) { const w = Math.max(0, 6 - j * 0.55), x0 = cx + tilt * j * j * 0.04; for (let x = Math.floor(x0 - w); x <= Math.ceil(x0 + w); x++) p.set(x, top + 3 - j, x < x0 - w / 2 ? m[3] : x > x0 + w / 2 ? m[1] : m[2]); } p.hl(cx - 6, top + 3, 13, T.m[3]); },
  hood(p, A, T) { tjHood(p, A, T.a, {}); },
  circlet(p, A, T) { const { hx: cx, headTop: top, hrx, side, up } = A, m = T.a; p.hl(Math.round(cx - hrx), top + 4, Math.round(hrx * 2) + 1, m[3]); p.hl(Math.round(cx - hrx) + 1, top + 3, Math.round(hrx * 2) - 1, m[2]); if (!up && !side) p.ball(cx - 0.5, top + 3.5, 1.3, 1.3, TJ4(T.g)); },
  visor(p, A, T) { const { hx: cx, headTop: top, hrx, side, up, d } = A, m = T.m; p.ball(cx, top + 3, hrx + 0.6, 4.2, TJ4(m)); for (let x = Math.round(cx - hrx - 1); x <= cx + hrx + 1; x++) { if (side && (x - cx) * d < -3) continue; p.set(x, top + 5, T.g[2]); p.set(x, top + 6, T.g[1]); } },
  hoodMask(p, A, T) { const { hx: cx, side, up, d, ey, hrx } = A; tjHood(p, A, T.m, {}); if (!up) { const y0 = ey + 3, x0 = side ? Math.min(Math.round(cx), Math.round(cx + d * (hrx + 1))) : Math.round(cx - hrx + 1), x1 = side ? Math.max(Math.round(cx), Math.round(cx + d * (hrx + 1))) : Math.round(cx + hrx - 1); for (let y = y0; y <= y0 + 3; y++) for (let x = x0; x <= x1; x++) p.set(x, y, y === y0 ? T.a[3] : T.a[(x + y) % 3 ? 2 : 1]); } },
  maskBand(p, A, T) { const { hx: cx, headTop: top, hrx, side, up, d, ey } = A; p.hl(Math.round(cx - hrx), top + 4, Math.round(hrx * 2) + 1, T.a[2]); const tx = side ? Math.round(cx - d * hrx) : Math.round(cx + hrx); for (let k = 0; k < 6; k++) p.set(tx + (side ? -d : 1) * (k >> 1), top + 4 + k, T.a[k & 1 ? 1 : 3]);
    if (!up) { const y0 = ey + 3, x0 = side ? Math.min(Math.round(cx), Math.round(cx + d * (hrx + 1))) : Math.round(cx - hrx + 1), x1 = side ? Math.max(Math.round(cx), Math.round(cx + d * (hrx + 1))) : Math.round(cx + hrx - 1); for (let y = y0; y <= y0 + 3; y++) for (let x = x0; x <= x1; x++) p.set(x, y, T.m[y === y0 ? 3 : 2]); } },
  brim(p, A, T) { const { hx: cx, headTop: top, hrx, side, up, d } = A, m = T.a; for (let x = -12; x <= 12; x++) { p.set(cx + x, top + 3, m[Math.abs(x) > 10 ? 3 : 2]); p.set(cx + x, top + 4, m[1]); } for (let y = top - 2; y < top + 3; y++) for (let x = cx - 6; x <= cx + 6; x++) p.set(x, y, x < cx - 4 ? m[3] : x > cx + 4 ? m[1] : m[2]); p.hl(cx - 6, top + 2, 13, T.m[3]); const sx = side ? -d : 1; for (let j = 0; j < 8; j++) p.set(cx + sx * (5 + (j >> 1)), top + 1 - j, T.g[j > 5 ? 4 : 2 + (j & 1)]); },
  beret(p, A, T) { const { hx: cx, headTop: top, hrx, side, d } = A, m = T.a, sx = side ? -d : 1; p.ball(cx + sx * 2, top + 1.5, hrx + 1.5, 3.5, TJ4(m)); p.hl(Math.round(cx - hrx), top + 4, Math.round(hrx * 2) + 1, T.m[2]); for (let j = 0; j < 7; j++) p.set(Math.round(cx + sx * (hrx - 1 + j * 0.6)), top + 1 - j, T.g[j > 4 ? 4 : 2 + (j & 1)]); },
  veil(p, A, T) { const { hx: cx, headTop: top, hrx, side, up, d, ey } = A; for (const sx of side ? [-d] : up ? [] : [-1, 1]) for (let y = top + 3; y <= ey + 7; y++) for (let k = 0; k < 2; k++) p.set(Math.round(cx + sx * (hrx + k)), y, T.m[(y + k) % 3 ? 2 : 1]);
    if (up) for (let y = top + 3; y <= ey + 7; y++) for (let x = Math.round(cx - hrx); x <= cx + hrx; x++) p.set(x, y, T.m[(x + y) % 5 ? 2 : 3]); TJH.crown(p, A, T); },
  fin(p, A, T) { const { hx: cx, headTop: top, hrx, side, d } = A, m = T.m; p.ball(cx, top + 3, hrx + 0.5, 4.5, TJ4(m)); p.hl(Math.round(cx - hrx), top + 5, Math.round(hrx * 2) + 1, T.a[3]);
    if (!side) for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) p.vl(Math.round(cx + sx * (hrx + 1 + k * 0.6)), top + 4 + k, 4 - k, T.g[k % 2 ? 1 : 2]); else for (let k = 0; k < 3; k++) p.vl(Math.round(cx - d * (hrx + 1 + k * 0.6)), top + 4 + k, 4 - k, T.g[2]); },
};
const TJ_HEADS = { guerrero: ['helm', 'helmOpen', 'crown', 'helm', 'helmOpen', 'crown'], mago: ['hat', 'circlet', 'hood', 'hat', 'veil', 'circlet'], arquero: ['visor', 'hood', 'circlet', 'visor', 'hood', 'circlet'],
  asesino: ['hoodMask', 'maskBand', 'hoodMask', 'maskBand', 'hoodMask', 'maskBand'], bardo: ['brim', 'beret', 'circlet', 'beret', 'brim', 'crown'], invocador: ['veil', 'hood', 'crown', 'veil', 'hood', 'crown'], pez: ['fin', 'circlet', 'fin', 'helmOpen', 'fin', 'circlet'] };
for (const cls in TJ_HEADS) TJT.forEach((T, i) => fitKind('head', `tj_${cls}_${T.id}`, (p, A) => { const base = TJ_HEADS[cls][i]; const crestFirst = T.id === 'aurora'; if (crestFirst) tjCrest(p, A, T); TJH[base](p, A, T); if (!crestFirst && base !== 'hood' && base !== 'hoodMask') tjCrest(p, A, T, cls === 'guerrero'); else if (!crestFirst) tjCrest(p, A, T); }, T.id === 'prisma' || T.id === 'aurora' ? { float: true } : undefined));

// ---------- pecheras por clase ----------
const TJB = {
  guerrero(p, A, T, i) { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, m = T.m, R = tx0 + tw - 1; for (let y = ty + 2; y < ty + th - 2; y += 3) p.hl(tx0, y, tw, m[1]);
    if (!up && !side) { for (let y = ty + 1; y < ty + th - 2; y++) p.set(cx - 1 + (i & 1), y, m[4]); tjEmblem(p, cx - (i & 1 ? 0 : 1), ty + 4, T); }
    tjPads(p, A, T, 3.6); p.hl(tx0, ty + th - 2, tw, T.a[2]); if (!up && !side) p.set(cx, ty + th - 2, T.g[4]); },
  mago(p, A, T, i) { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1; tjTails(p, A, T.m, 7 + (i % 3), T.a, !up && !side && i % 2 === 0);
    if (!up && !side) { if (i % 2) for (let y = ty + 1; y < ty + th; y++) { p.set(cx - 1, y, T.a[2]); p.set(cx, y, T.a[1]); } tjEmblem(p, cx - (i % 2 ? 0 : 1), ty + 3, T); }
    if (up) tjEmblem(p, cx, ty + th + 2, T); for (let x = tx0 - 2; x <= R + 2; x++) { p.set(x, ty, T.a[x & 1 ? 3 : 2]); if (i % 3 === 1) p.set(x, ty + 1, T.a[2]); } if (i % 3 === 2) tjPads(p, A, T, 2.2); p.hl(tx0, ty + th - 2, tw, T.a[3]); },
  arquero(p, A, T, i) { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1;
    if (!side) { const a = up ? [tx0, R] : [R, tx0]; p.line(a[0], ty + 1, a[1], ty + th - 3, T.a[3]); p.line(a[0], ty + 2, a[1], ty + th - 2, T.a[1]); }
    if (!up && !side) tjEmblem(p, i % 2 ? tx0 + 2 : R - 2, ty + 3, T);
    // media capa en un hombro
    { const sxL = up ? R + 1 : tx0 - 1; if (!side) for (let y = ty; y < ty + th; y++) for (let k = 0; k < 3; k++) p.set(sxL + (up ? -k : k) * (up ? 1 : 1) * (k ? 1 : 0) - (up ? 0 : 0), y, T.m[(y + k) % 3 ? 2 : 3]); }
    tjPads(p, A, T, 2.4, true); if (up) { p.rect(R - 2, ty - 3, 3, 7, T.m[1]); p.hl(R - 2, ty - 3, 3, T.a[3]); p.set(R - 2, ty - 4, T.g[4]); p.set(R, ty - 4, T.g[3]); } tjBelt(p, A, T.m, T.g[3]); },
  asesino(p, A, T, i) { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, S = T.a;
    if (!side) { if (i % 2) { p.line(tx0, ty + 2, R, ty + th - 3, T.g[2]); p.line(R, ty + 2, tx0, ty + th - 3, T.g[2]); } else { p.vl(tx0 + 1, ty + 1, th - 3, T.g[2]); p.vl(R - 1, ty + 1, th - 3, T.g[2]); } }
    for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty - 1, S[x & 1 ? 3 : 2]); p.set(x, ty, S[x & 1 ? 2 : 1]); }
    const tail = (x, sx) => { for (let k = 0; k < 8; k++) { p.set(x + sx * (k >> 2), ty + 1 + k, S[k & 1 ? 2 : 3]); p.set(x + sx * (k >> 2) + sx, ty + 1 + k, S[1]); } }; if (side) tail(cx - d * 2, -d); else if (up) tail(cx - 1, 1); else tail(i % 2 ? tx0 : R, i % 2 ? -1 : 1);
    tjPads(p, A, T, 2, true); p.hl(tx0, ty + th - 2, tw, T.m[1]); if (!up && !side) tjEmblem(p, cx - 1, ty + th - 2, T); },
  bardo(p, A, T, i) { const { tx0, tw, torsoTop: ty, th, cx, side, up, d, legTop, base } = A, R = tx0 + tw - 1, B = T.m, y1 = Math.min(base - 2, legTop + 6);
    for (let y = ty + th - 1; y < y1; y++) { if (up) { for (let x = tx0; x <= R; x++) if (Math.abs(x - cx + 0.5) > 0.6) p.set(x, y, B[(x + y) % 6 ? 2 : 1]); continue; } if (side) { for (let k = 1; k < 4; k++) p.set(cx - d * k, y, B[k === 1 ? 3 : 2]); continue; } for (const x of [tx0, tx0 + 1, R - 1, R]) p.set(x, y, B[x === tx0 || x === R ? 2 : 3]); }
    if (!up && !side) { for (let y = ty + 1; y < ty + th - 2; y++) { p.set(cx - 1, y, T.a[1]); p.set(cx, y, T.a[2]); } for (let y = ty + 2; y < ty + th - 2; y += 2) { p.set(cx - 2, y, T.g[3]); p.set(cx + 1, y, T.g[3]); } }
    if (up) tjEmblem(p, cx, ty + 4, T); for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty - 1, T.g[x & 1 ? 4 : 3]); p.set(x, ty, T.g[x & 1 ? 3 : 2]); }
    if (i % 2) tjPads(p, A, T, 2); else { if (!side) { p.line(tx0, ty + 1, R, ty + th - 2, T.a[3]); } } p.hl(tx0, ty + th - 2, tw, T.a[2]); },
  invocador(p, A, T, i) { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1; tjTails(p, A, T.m, 8 + (i % 2), T.a, !up && !side);
    if (!side) { const cy = ty + Math.round(th / 2) - 1; for (let a = 0; a < 18; a++) { const x = Math.round(cx - 0.5 + Math.cos(a / 18 * 6.283) * 3.2), y = Math.round(cy + Math.sin(a / 18 * 6.283) * 3.2); p.set(x, y, T.g[2]); } tjEmblem(p, cx - (up ? 0 : 1), cy, T); }
    if (!up && !side) for (const x of [tx0, R]) { p.rect(x, ty + th - 1, 2, 4, T.g[4]); p.set(x, ty + th, T.a[2]); p.set(x + 1, ty + th + 2, T.a[2]); }
    for (let x = tx0 - 2; x <= R + 2; x++) p.set(x, ty, T.a[x % 2 ? 3 : 2]); if (i % 2 === 0) tjPads(p, A, T, 2.2); p.hl(tx0, ty + th - 2, tw, T.a[1]); },
  pez(p, A, T, i) { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = T.m;
    for (let y = ty + 1; y < ty + th - 1; y++) for (let x = tx0; x <= R; x++) if ((y - ty) % 2 === 0 ? x % 2 === 0 : x % 2 === 1) p.set(x, y, m[(y - ty) % 4 < 2 ? 3 : 1]);
    if (!up && !side) tjEmblem(p, cx - 1, ty + 4, T); const fin = (x, sx) => { for (let k = 0; k < 4; k++) { p.vl(x + sx * k, ty - 1 + k, 4 - (k >> 1), T.g[k % 2 ? 2 : 1]); p.set(x + sx * k, ty - 1 + k, T.g[4]); } };
    if (i % 2) { if (side) fin(cx - 1 - d, -d); else { fin(tx0 - 1, -1); fin(R + 1, 1); } } else tjPads(p, A, T, 2.6);
    for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, ty, T.a[x % 2 ? 3 : 2]); p.hl(tx0, ty + th - 2, tw, T.a[2]); for (let x = tx0 + 1; x < R; x += 3) p.set(x, ty + th - 2, C('#f4f0ff')); },
};
for (const cls in TJB) TJT.forEach((T, i) => fitKind('body', `tj_${cls}_${T.id}_b`, (p, A, s) => TJB[cls](p, A, T, i)));
// piernas: placas o franjas con el color del tema
TJT.forEach((T, i) => fitKind('legs', `tj_${T.id}_l`, (p, A, s) => { const { legTop, base } = A, cols = new Set(s.m), heavy = s.heavy;
  for (let y = legTop; y < base - 1; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) { const left = !cols.has(p.get(x - 1, y));
    if (heavy && (y - legTop) % 3 === 2) p.set(x, y, s.m[0]); else if (left && !heavy) p.set(x, y, T.a[3]); else if (y === legTop + Math.round((base - legTop) * 0.5) && heavy) p.set(x, y, T.g[3]); } }));
// espaldas especiales flotantes
TJT.forEach(T => fitKind('back', `tj_${T.id}_esp`, (p, A) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, cy = ty + 1, w = side ? 0.4 : 1;
  const put = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (p.get(x, y) === 1 || up) p.set(x, y, c); };
  if (T.id === 'engranaje') { for (let k = 0; k < 24; k++) { const t = k / 24 * 6.283, r = k % 2 ? 8 : 9; put(cx - 0.5 + Math.cos(t) * r * w, cy + Math.sin(t) * r, T.m[k % 2 ? 2 : 4]); } for (let k = 0; k < 12; k++) { const t = k / 12 * 6.283; put(cx - 0.5 + Math.cos(t) * 5 * w, cy + Math.sin(t) * 5, T.a[3]); } }
  else if (T.id === 'prisma') { for (const [dx, dy, r] of [[-10, -4, 2], [10, -2, 2], [-8, 6, 1.5], [9, 8, 1.5], [0, -10, 1.5]]) for (let yy = -Math.ceil(r * 1.5); yy <= Math.ceil(r * 1.5); yy++) for (let xx = -Math.ceil(r); xx <= Math.ceil(r); xx++) if (Math.abs(xx) / r + Math.abs(yy) / (r * 1.5) <= 1) put(cx + dx * w + xx, cy + dy + yy, xx < 0 ? T.a[3] : T.g[2]); }
  else if (T.id === 'fenix') { for (const sx of side ? [-A.d] : [-1, 1]) for (let k = 0; k < 6; k++) { const len = 9 - k, t = -0.6 + k * 0.32; for (let j = 2; j < len + 2; j++) put(cx - 0.5 + sx * Math.cos(t) * j * (side ? 0.6 : 1), cy - Math.sin(-t) * j * 0.9 + 1, j > len ? T.g[3] : T.a[2 + (j & 1)]); } }
  else if (T.id === 'aurora') { for (let k = 0; k < 40; k++) { const t = k / 40 * 6.283; put(cx - 0.5 + Math.cos(t) * 9 * w, cy - 1 + Math.sin(t) * 9, k % 3 ? T.a[3] : T.g[3]); if (k % 4 === 0) put(cx - 0.5 + Math.cos(t) * 11 * w, cy - 1 + Math.sin(t) * 11, T.a[4]); } }
  else if (T.id === 'escarcha') { for (let k = -4; k <= 4; k++) { const h = 6 - Math.abs(k); for (let j = 0; j < h; j++) put(cx - 0.5 + k * 2.2 * w, cy - 3 - j, j === h - 1 ? T.g[4] : T.g[2 + (j & 1)]); } }
  else if (T.id === 'raiz') { for (const sx of side ? [-A.d] : [-1, 1]) { let x = cx - 0.5, y = cy + 6; for (let j = 0; j < 12; j++) { x += sx * 0.8 * w; y -= 1; put(x, y, T.m[3]); if (j % 3 === 2) { put(x + sx, y - 1, T.a[3]); put(x + sx * 2, y - 1, T.a[4]); } } } } }, { float: true }));

const TJ_FEET = { guerrero: 'sabatons', mago: 'shoes', arquero: 'boots', asesino: 'boots', bardo: 'boots', invocador: 'shoes', pez: 'sandals' };
// qué lleva cada clase en la espalda: capa del tema o adorno flotante
const TJ_BACK = { guerrero: i => 'cape', mago: i => (i % 2 ? 'esp' : 'cape'), arquero: i => (i % 2 ? 'cape' : 'esp'), asesino: i => null, bardo: i => (i % 2 ? 'esp' : null), invocador: i => (i % 2 ? 'cape' : 'esp'), pez: i => (i % 2 ? 'cape' : null) };

// ---------- armas 37-43: dibujo propio por clase y tier (vertical, luego girado a la diagonal del juego) ----------
// Cada arma se dibuja derecha (empuñadura abajo) con la escala s (1 = mano de 16 px, 2 = HD de 32 px) y se gira 45°
// hacia arriba a la derecha, como las armas de la hoja de Sergio. El punto de agarre queda en ARM_PIVK16/32.
const TJ_WLEG = {   // paletas del tier 37 (legado de cada clase): metal, acento, brillo
  guerrero: { id: 'obsidiana', m: TJC.obs, a: TJC.lava, g: TJC.lava }, mago: { id: 'estelar', m: TJC.noche, a: TJC.oro, g: TJC.torm },
  arquero: { id: 'tormenta', m: TJC.plata, a: TJC.torm, g: TJC.oro }, asesino: { id: 'carmesi', m: TJC.obs, a: TJC.carm, g: TJC.carm },
  bardo: { id: 'aurea', m: TJC.blanco, a: TJC.oro, g: TJC.oro }, invocador: { id: 'pactos', m: TJC.hueso, a: TJC.viol, g: TJC.verdeV },
  pez: { id: 'abisal', m: TJC.abis, a: TJC.bio, g: TJC.coral } };
const tjWT = (cls, t) => t === 37 ? TJ_WLEG[cls] : TJT[t - 38];
const TJ_WOOD = P5(['#2a1a0e', '#4a2e18', '#6a4426', '#8a6038', '#ae8052']);
// adorno pequeño del tema (punta de báculo, pomo, extremos del arco)
function tjWGem(p, x, y, T, s, big) { const r = (big ? 2.2 : 1.4) * s, g = T.g, a = T.a, m = T.m; x = Math.round(x); y = Math.round(y);
  switch (T.id) {
    case 'escarcha': for (let k = -2; k <= 2; k++) { const h = (3 - Math.abs(k)) * s * (big ? 1.4 : 1); for (let j = 0; j < h; j++) p.set(x + k * s, y - j, j > h - 2 ? g[4] : g[2 + (j & 1)]); } p.ball(x, y + s, r, r, TJ4(g)); break;
    case 'raiz': p.ball(x, y, r, r, TJ4(g)); for (const sx of [-1, 1]) { for (let j = 0; j < 3 * s + (big ? 2 : 0); j++) p.set(x + sx * (1 + (j >> 1)), y - 1 - j, m[3]); p.set(x + sx * (2 + s), y - 2 - 2 * s, a[4]); p.set(x + sx * (1 + s), y - 2 - 2 * s, a[3]); } break;
    case 'engranaje': for (let k = 0; k < 10; k++) { const t = k / 10 * 6.283; p.set(Math.round(x + Math.cos(t) * (r + s)), Math.round(y + Math.sin(t) * (r + s)), m[k % 2 ? 2 : 4]); } p.ball(x, y, r, r, TJ4(m)); p.set(x, y, g[3]); break;
    case 'prisma': for (let dy = -Math.ceil(r * 1.6); dy <= Math.ceil(r * 1.6); dy++) for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) if (Math.abs(dx) / r + Math.abs(dy) / (r * 1.6) <= 1) p.set(x + dx, y + dy, dx < 0 ? a[3] : dx > 0 ? g[2] : m[4]); break;
    case 'fenix': for (let k = -2; k <= 2; k++) { const h = (4 - Math.abs(k)) * s * (big ? 1.3 : 1); for (let j = 0; j < h; j++) p.set(x + k * s, y - j, j > h - 2 ? g[4] : a[2 + (j & 1)]); } p.ball(x, y + s, r, r, TJ4(g)); break;
    case 'aurora': p.ball(x, y, r, r, TJ4(a)); for (let k = 0; k < 8; k++) { const t = k / 8 * 6.283; p.set(Math.round(x + Math.cos(t) * (r + 2 * s)), Math.round(y + Math.sin(t) * (r + 2 * s)), k % 2 ? g[3] : a[4]); } break;
    default: p.ball(x, y, r, r, TJ4(g)); p.set(x - 1, y - 1, g[4]); } }
// hoja recta con estilo de filo: 'straight', 'jagged', 'wavy', 'crystal'
function tjBlade(p, cx, y0, y1, w0, w1, T, style, core) { const m = T.m, len = y0 - y1;
  for (let y = y1; y <= y0; y++) { const t = (y0 - y) / len; let hw = w0 + (w1 - w0) * t; if (style === 'wavy') hw += Math.sin(t * 9) * 0.9; if (style === 'jagged' && (y % 4) === 0) hw += 1.2;
    const tip = y < y1 + 3 ? (y - y1) / 3 : 1; hw *= Math.max(0.25, tip);
    for (let x = Math.floor(cx - hw); x <= Math.ceil(cx + hw - 1); x++) { const e = (x - cx + 0.5) / Math.max(0.6, hw); let c = e < -0.45 ? m[4] : e > 0.45 ? m[1] : m[2 + (y & 1 && style === 'crystal' ? 1 : 0)]; if (style === 'crystal') c = e < 0 ? (y % 6 < 3 ? m[4] : T.a[3]) : (y % 6 < 3 ? T.g[2] : m[2]); p.set(x, y, c); }
    if (core && y > y1 + 2 && y < y0 - 1) p.set(Math.round(cx - 0.5), y, core[(y >> 1) % 2 ? 3 : 2]); } }
const TJ_WDRAW = {
  guerrero(p, T, s, i) { const cx = p.w / 2, gy = p.h - 3 * s, hilt = 5 * s, guardY = gy - hilt;
    for (let y = guardY; y <= gy + 2 * s; y++) for (let x = Math.round(cx - s); x < cx + s; x++) p.set(x, y, (y >> s) % 2 ? TJC.cuero[2] : TJC.cuero[3]);
    tjWGem(p, cx - 0.5, gy + 2 * s, T, s, false);
    const style = ['wavy', 'jagged', 'straight', 'straight', 'crystal', 'wavy', 'straight'][i], w = [2.6, 2.4, 2.2, 2.4, 2.6, 2.4, 2.8][i] * s;
    tjBlade(p, cx, guardY - s, 2 * s, w, w * 0.7, T, style, i === 0 || i === 6 ? T.a : T.g);
    if (i === 2) for (let y = guardY - 2 * s; y > 4 * s; y -= 3 * s) { p.set(Math.round(cx + w), y, T.a[3]); p.set(Math.round(cx + w) + 1, y - 1, T.a[4]); }
    if (i === 3) { tjWGem(p, cx - 0.5, guardY, T, s, true); } else { p.hl(Math.round(cx - 4 * s), guardY, Math.round(8 * s), T.a[2]); p.hl(Math.round(cx - 4 * s), guardY - 1, Math.round(8 * s), T.a[3]); if (i === 6 || i === 5) tjWGem(p, cx - 0.5, guardY - 1, T, s, false); } },
  mago(p, T, s, i) { const cx = Math.round(p.w / 2), gy = p.h - 3 * s, top = 7 * s;
    for (let y = top; y <= gy + 3 * s; y++) { p.set(cx - 1, y, (i === 1 || i === 2 ? TJ_WOOD : T.m)[2]); if (s > 1) p.set(cx, y, (i === 1 || i === 2 ? TJ_WOOD : T.m)[1]); }
    for (let y = top + 4 * s; y < gy; y += 5 * s) p.hl(cx - s, y, 2 * s, T.a[3]);
    if (i === 3) { for (let k = 0; k < 5 * s; k++) { const hw = Math.abs(k - 2.5 * s) * 0.8; p.hl(Math.round(cx - 0.5 - hw), top - 5 * s + k, Math.round(hw * 2) + 1, k < 2.5 * s ? T.g[3] : T.a[3]); } p.hl(cx - 3 * s, top - 5 * s, 6 * s, T.m[3]); p.hl(cx - 3 * s, top, 6 * s, T.m[3]); }
    else if (i === 0) { for (let a = 0; a < 24; a++) { const t = a / 24 * 6.283; p.set(Math.round(cx - 0.5 + Math.cos(t) * 4 * s), Math.round(top - 3 * s + Math.sin(t) * 4 * s), T.a[a % 3 ? 3 : 4]); } tjWGem(p, cx - 0.5, top - 3 * s, T, s, true); }
    else tjWGem(p, cx - 0.5, top - 2 * s, T, s, true); },
  arquero(p, T, s, i) { const cx = p.w / 2, h = p.h, cy = h / 2, R = h / 2 - 2 * s, bend = (i % 2 ? 3.6 : 4.4) * s;
    for (let y = 2 * s; y <= h - 2 * s; y++) { const t = (y - cy) / R, x = Math.round(cx + 1 - bend * (1 - t * t) * 0.9); p.set(x, y, Math.abs(y - cy) < 2 * s ? TJC.cuero[3] : T.m[(y >> 1) % 2 ? 3 : 2]); p.set(x - 1, y, T.m[1]); if (i === 4 && y % 3 === 0) p.set(x - 2, y, T.a[3]); }
    for (let y = 2 * s; y <= h - 2 * s; y++) p.set(Math.round(cx + 1), y, C('#e8e4d8'));
    for (const y of [2 * s, h - 2 * s]) tjWGem(p, cx + 1, y, T, s * 0.8, false); p.rect(Math.round(cx - bend * 0.9), Math.round(cy - s), 2, 2 * s, T.a[3]); },
  asesino(p, T, s, i) { const cx = p.w / 2, gy = p.h - 3 * s, hilt = 4 * s, guardY = gy - hilt;
    for (let y = guardY; y <= gy + s; y++) for (let x = Math.round(cx - s * 0.6); x < cx + s * 0.6; x++) p.set(x, y, (y >> s) % 2 ? TJC.obs[2] : T.a[1]);
    const style = ['straight', 'crystal', 'jagged', 'straight', 'crystal', 'wavy', 'straight'][i], top = p.h - 18 * s; tjBlade(p, cx, guardY - s, top, 1.9 * s, 1.1 * s, T, style, T.a);
    if (i === 5 || i === 0) for (let y = top + 2 * s; y < guardY - s; y += 3 * s) p.set(Math.round(cx + 2 * s), y, T.g[3]);
    p.hl(Math.round(cx - 3 * s), guardY, 6 * s, T.a[2]); tjWGem(p, cx - 0.5, gy + s, T, s * 0.7, false); },
  bardo(p, T, s, i) { const cx = p.w / 2, harp = i === 1 || i === 6, by = p.h - 7 * s;
    if (harp) { const x0 = Math.round(cx - 4 * s), x1 = Math.round(cx + 3 * s); for (let y = 3 * s; y < p.h - 2 * s; y++) p.set(x0, y, T.a[3]); for (let x = x0; x <= x1; x++) p.set(x, p.h - 2 * s, T.a[2]); for (let k = 0; k <= 7 * s; k++) p.set(Math.round(x0 + k), Math.round(3 * s + k * 0.4 * s / s * 1.2), T.a[4]);
      for (let x = x0 + 2; x <= x1; x += 2) for (let y = Math.round(3 * s + (x - x0) * 0.5) + 1; y < p.h - 2 * s; y++) p.set(x, y, C('#f0eadc')); tjWGem(p, x0, 3 * s, T, s, false); return; }
    for (let y = 2 * s; y < by - 3 * s; y++) { p.set(Math.round(cx - 1), y, TJ_WOOD[2]); if (s > 1) p.set(Math.round(cx), y, TJ_WOOD[1]); }
    p.ball(cx - 0.5, by, 4.6 * s, 5.2 * s, TJ4(T.m)); p.ball(cx - 0.5, by + s, 1.5 * s, 1.5 * s, [TJC.obs[0], TJC.obs[1], TJC.obs[1], TJC.obs[2]]);
    for (let y = 3 * s; y < by + 3 * s; y++) p.set(Math.round(cx - 0.5), y, y < by - s || y > by + 2 * s ? C('#f0eadc') : TJC.obs[0]);
    tjWGem(p, cx - 0.5, 2 * s, T, s * 0.8, false); if (i === 3) for (let k = 0; k < 6; k++) { const t = k / 6 * 6.283; p.set(Math.round(cx - 0.5 + Math.cos(t) * 3.3 * s), Math.round(by + Math.sin(t) * 3.8 * s), T.a[4]); } },
  invocador(p, T, s, i) { const cx = 3 * s, gy = p.h - 3 * s, top = 3 * s;
    for (let y = top; y <= gy; y++) p.set(cx, y, (i === 2 ? TJ_WOOD : T.m)[(y >> 1) % 2 ? 2 : 3]);
    const blen = 9 * s; for (let k = 0; k < blen; k++) { const t = k / blen, x = Math.round(cx + 1 + k), y = Math.round(top + 1 + Math.sin(t * Math.PI) * -2 * s + t * t * 4 * s), w = Math.max(1, Math.round((1 - t) * 2.4 * s)); for (let j = 0; j < w; j++) p.set(x, y + j, j === 0 ? T.a[4] : T.a[j === w - 1 ? 1 : 2]); }
    tjWGem(p, cx, top - s, T, s, false); if (i % 2 === 0) for (let y = top + 6 * s; y < gy - 4 * s; y += 4 * s) { p.set(cx - 1, y, T.g[3]); p.set(cx - 1, y + 1, T.g[2]); } },
  pez(p, T, s, i) { const cx = p.w / 2, gy = p.h - 3 * s;
    for (let y = gy - 2 * s; y <= gy + 2 * s; y++) p.set(Math.round(cx - 1), y, TJC.cuero[3]);
    const top = p.h - 18 * s, rib = Math.max(1, s); for (let y = top; y < gy - 2 * s; y++) { const t = (y - top) / (gy - 2 * s - top), hw = (Math.sin(t * Math.PI) * 4.2 + 0.6) * s + (i === 5 && y % 4 === 0 ? s : 0);
      for (let x = Math.floor(cx - hw); x <= Math.ceil(cx + hw * 0.6); x++) { const e = (x - cx) / hw; p.set(x, y, e < -0.6 ? T.m[4] : (x - Math.round(cx)) % (3 * rib) === 0 ? T.a[2] : T.m[e < 0 ? 3 : 2]); } }
    tjWGem(p, cx - 0.5, top + 2 * s, T, s * 0.7, false); },
};
// gira el dibujo vertical a la diagonal: (gx, gy) = agarre en la salida, (sx0, sy0) = agarre en el dibujo
function tjRot(src, out, sx0, sy0, gx, gy) { const r2 = Math.SQRT1_2;
  for (let y = 0; y < out.h; y++) for (let x = 0; x < out.w; x++) { const dx = x + 0.5 - gx, dy = y + 0.5 - gy, along = (dx - dy) * r2, perp = (dx + dy) * r2;
    const sx = Math.floor(sx0 + perp), sy = Math.floor(sy0 - along); if (sx < 0 || sy < 0 || sx >= src.w || sy >= src.h) continue; const c = src.d[sy * src.w + sx]; if (uA(c) > 100) out.d[y * out.w + x] = c; } }
const TJ_WGRIP = { guerrero: [3, 13], mago: [4.5, 11.5], arquero: [8, 8], asesino: [3, 12], bardo: [5, 11], invocador: [2.5, 13], pez: [4, 11.5] };
function tjWeaponPix(cls, t, s) { const T = tjWT(cls, t), i = t - 37, len = cls === 'arquero' ? 21 : cls === 'asesino' || cls === 'pez' ? 20 : cls === 'invocador' ? 20 : 23;
  const src = new Pix((cls === 'invocador' ? 14 : 12) * s, len * s); TJ_WDRAW[cls](src, T, s, i); src.outline(OUTL);
  const sgy = cls === 'arquero' ? src.h / 2 : src.h - 3 * s, sgx = cls === 'arquero' ? src.w / 2 : cls === 'invocador' ? 3 * s + 0.5 : src.w / 2;
  const out = new Pix(16 * s, 16 * s), [gx, gy] = TJ_WGRIP[cls]; tjRot(src, out, sgx, sgy, gx * s, gy * s); return { pix: out, piv: [gx * s, gy * s] }; }

// ---------- sets por clase y tier ----------
// 37: el legado de cada clase (un tema distinto por clase). 38-43: un tema por tier, un diseño propio por clase.
const TJ_TIERS = [37, 38, 39, 40, 41, 42, 43], TJ_LV = { 37: 505, 38: 520, 39: 535, 40: 550, 41: 565, 42: 580, 43: 600 };
const TJ_LEG = {
  guerrero: { head: { k: 'tj_coloso_h', m: TJC.obs, cover: 'hat' }, top: { k: 'tj_coloso', m: TJC.obs }, bot: { k: 'tj_placas', m: TJC.obs }, feet: { k: 'sabatons', m: TJC.obs }, back: { k: 'cape', o: TJC.obs, i: TJC.lava, tr: TJC.lava.slice(1) } },
  mago: { head: { k: 'tj_orbita', m: TJC.oro }, top: { k: 'tj_estelar', m: TJC.noche }, bot: { k: 'pants', m: TJC.noche }, feet: { k: 'shoes', m: TJC.oro }, back: { k: 'cape', o: TJC.noche, i: TJC.viol, tr: TJC.oro.slice(1) } },
  arquero: { head: { k: 'tj_alas', m: TJC.plata }, top: { k: 'tj_halcon', m: TJC.torm }, bot: { k: 'pants', m: TJC.plata }, feet: { k: 'boots', m: TJC.torm }, back: { k: 'cape', o: TJC.torm, i: TJC.plata, tr: TJC.oro.slice(1) } },
  asesino: { head: { k: 'tj_oni', m: TJC.obs, cover: 'hood' }, top: { k: 'tj_carmesi', m: TJC.obs }, bot: { k: 'tj_lineas', m: TJC.obs }, feet: { k: 'boots', m: TJC.obs }, back: null },
  bardo: { head: { k: 'tj_lira', m: TJC.oro }, top: { k: 'tj_sinfonia', m: TJC.blanco }, bot: { k: 'pants', m: TJC.noche }, feet: { k: 'boots', m: TJC.blanco }, back: null },
  invocador: { head: { k: 'tj_corona_hueso', m: TJC.hueso }, top: { k: 'tj_pactos', m: TJC.viol }, bot: { k: 'pants', m: TJC.obs }, feet: { k: 'boots', m: TJC.obs }, back: { k: 'tj_circulo' } },
  pez: { head: { k: 'tj_cresta', m: TJC.abis, cover: 'hat' }, top: { k: 'tj_leviatan', m: TJC.abis }, bot: { k: 'tj_placas', m: TJC.abis }, feet: { k: 'boots', m: TJC.abis }, back: { k: 'cape', o: TJC.abis, i: TJC.bio, tr: TJC.coral.slice(1) } } };
// nombre del aspecto de cada clase (sale en la descripción de la pieza y en la Lupa)
const TJ_SETN = {
  guerrero: [['Coloso de Obsidiana', 'Obsidian Colossus'], ['Bastión de Escarcha', 'Frost Bastion'], ['Guardián de Raíz', 'Root Guardian'], ['Coloso de Engranajes', 'Gear Colossus'], ['Égida Prismática', 'Prismatic Aegis'], ['Paladín del Fénix', 'Phoenix Paladin'], ['Campeón de la Aurora', 'Aurora Champion']],
  mago: [['Arcanista Estelar', 'Stellar Arcanist'], ['Sabio del Invierno', 'Winter Sage'], ['Druida de la Raíz', 'Root Druid'], ['Cronomante', 'Chronomancer'], ['Hechicero Prisma', 'Prism Sorcerer'], ['Piromante de Ceniza', 'Ash Pyromancer'], ['Archimago de la Aurora', 'Aurora Archmage']],
  arquero: [['Halcón de la Tormenta', 'Storm Falcon'], ['Cazador del Glaciar', 'Glacier Hunter'], ['Ranger del Bosque Viejo', 'Old Forest Ranger'], ['Tirador de Relojería', 'Clockwork Marksman'], ['Arquero del Arcoíris', 'Rainbow Archer'], ['Ala de Brasa', 'Ember Wing'], ['Flecha del Alba', 'Dawn Arrow']],
  asesino: [['Hoja Carmesí', 'Crimson Blade'], ['Filo de Hielo', 'Ice Edge'], ['Sombra del Musgo', 'Moss Shadow'], ['Mecanismo Silencioso', 'Silent Mechanism'], ['Reflejo Roto', 'Broken Reflection'], ['Ceniza Errante', 'Wandering Ash'], ['Eclipse del Alba', 'Dawn Eclipse']],
  bardo: [['Sinfonía Áurea', 'Golden Symphony'], ['Balada de Invierno', 'Winter Ballad'], ['Trovador del Roble', 'Oak Troubadour'], ['Maestro de la Caja de Música', 'Music Box Maestro'], ['Canción de Cristal', 'Crystal Song'], ['Himno del Fénix', 'Phoenix Hymn'], ['Coro de la Aurora', 'Aurora Choir']],
  invocador: [['Señor de los Pactos', 'Lord of Pacts'], ['Pactante del Frío', 'Frost Pactbinder'], ['Hierofante de la Raíz', 'Root Hierophant'], ['Relojero de Almas', 'Soul Clockmaker'], ['Vidente del Prisma', 'Prism Seer'], ['Sacerdote de Ceniza', 'Ash Priest'], ['Oráculo de la Aurora', 'Aurora Oracle']],
  pez: [['Leviatán Abisal', 'Abyssal Leviathan'], ['Narval Polar', 'Polar Narwhal'], ['Tortuga de Manglar', 'Mangrove Turtle'], ['Nautilo de Latón', 'Brass Nautilus'], ['Perla Prismática', 'Prismatic Pearl'], ['Pez Volcán', 'Volcano Fish'], ['Ballena de la Aurora', 'Aurora Whale']] };
function tjSet(cls, t) { if (!TJ_LV[t] || !TJ_LEG[cls]) return null; if (t === 37) return TJ_LEG[cls];
  const i = t - 38, T = TJT[i], hk = TJ_HEADS[cls][i], heavy = cls === 'guerrero' || cls === 'pez', b = i === 5 && cls !== 'guerrero' ? 'esp' : TJ_BACK[cls](i);
  const head = { k: `tj_${cls}_${T.id}`, m: T.m }; if (hk === 'helm' || hk === 'veil') head.cover = 'hat'; if (hk === 'hood' || hk === 'hoodMask') head.cover = 'hood';
  return { head, top: { k: `tj_${cls}_${T.id}_b`, m: T.m }, bot: { k: `tj_${T.id}_l`, m: cls === 'bardo' || cls === 'asesino' ? T.a : T.m, heavy }, feet: { k: TJ_FEET[cls], m: cls === 'guerrero' ? T.m : T.a },
    back: b === 'cape' ? { k: 'cape', o: T.a, i: T.m, tr: T.g.slice(1) } : b === 'esp' ? { k: `tj_${T.id}_esp` } : null }; }
const TJ_SLOT = { head: 'head', body: 'top', legs: 'bot', feet: 'feet' };
{ const _gv = gearVis; gearVis = function (cls, slot, t) { if (TJ_LV[t] && slot !== 'weapon') { const S_ = tjSet(cls, t), v = S_ && S_[TJ_SLOT[slot]]; if (v) return Object.assign({ t }, v); } return _gv.apply(this, arguments); }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, o) { const L = _hl.apply(this, arguments); const t = gear && +gear.body; if (!TJ_LV[t] || !L) return L; cos = cos || {};
    const S_ = tjSet(cls, t), evo = app && app.evo && typeof EVO !== 'undefined' && EVO[app.evo]; if (!S_) return L;
    if (!(cos.back && COSM[cos.back]) && !evo) L.back = S_.back ? Object.assign({}, S_.back) : null; if (cls === 'asesino' && !(cos.back && COSM[cos.back])) L.scarf = null;
    // transformado: las capuchas nuevas no esconden el pelo de la forma (pelo dorado, pelaje del lobo…); orejas, cuernos y escamas ya van encima
    if (L.sr && L.head && String(L.head.k).startsWith('tj_') && L.head.cover === 'hood') { L.head = Object.assign({}, L.head); delete L.head.cover; } return L; }; }
{ const _cg = cleanGear; cleanGear = function (g) { const o = _cg.apply(this, arguments); for (const k of ['weapon', 'head', 'body', 'legs', 'feet']) { const v = g && +g[k]; if (isFinite(v) && v >= 37 && v <= 43) o[k] = v | 0; } return o; }; }
{ const _fi = fitItems; fitItems = function (only) { const out = _fi.apply(this, arguments); for (const c of AP_CLASSES) for (const t of TJ_TIERS) for (const slot of ['head', 'body', 'legs', 'feet']) { const it_ = { id: `${c}:${slot}:${t}`, kind: 'gear', cls: c, slot, t }; if (!only || it_.id.includes(only)) out.push(it_); } return out; }; }

// ---------- tiers, objetos y recetas ----------
const TJ_TN = { 37: ['del Legado', 'of the Legacy'], 38: ['de Escarcha Eterna', 'of Eternal Frost'], 39: ['de Raíz Ancestral', 'of the Ancestral Root'], 40: ['del Engranaje del Tiempo', 'of the Gear of Time'],
  41: ['del Prisma Velado', 'of the Veiled Prism'], 42: ['del Fénix de Ceniza', 'of the Ash Phoenix'], 43: ['de la Aurora Divina', 'of the Divine Aurora'] };
const TJ_PN = [['Yelmo', 'Helm'], ['Coraza', 'Cuirass'], ['Grebas', 'Greaves'], ['Botas', 'Boots']];
// materiales: minerales nuevos (vetas de las Tierras Tejidas) y restos de los cuatro jefes
const TJ_REC = { 37: [['ore19', 10], ['hebra_suelta', 6]], 38: [['ore19', 14], ['ore20', 4], ['tj_ala_polilla', 1]], 39: [['ore20', 12], ['ore19', 6], ['tj_ala_polilla', 2]], 40: [['ore20', 14], ['ore21', 4], ['tj_nudo', 1]],
  41: [['ore21', 12], ['tj_nudo', 2], ['hebra_suelta', 10]], 42: [['ore21', 14], ['ore22', 4], ['tj_engranaje', 1]], 43: [['ore22', 14], ['tj_engranaje', 2], ['tj_hebra_silencio', 1]] };
const TJ_WN = {
  guerrero: [['Mandoble de Obsidiana', 'Obsidian Greatsword'], ['Espadón del Glaciar', 'Glacier Greatsword'], ['Hoja de Raíz Viva', 'Living Root Blade'], ['Espada de Engranajes', 'Geared Sword'], ['Hoja Prismática', 'Prismatic Blade'], ['Espada del Fénix', 'Phoenix Sword'], ['Espada del Alba Divina', 'Sword of the Divine Dawn']],
  mago: [['Báculo de las Constelaciones', 'Staff of Constellations'], ['Cetro de Escarcha', 'Frost Sceptre'], ['Báculo de Raíz Ancestral', 'Ancestral Root Staff'], ['Báculo del Reloj de Arena', 'Hourglass Staff'], ['Cetro Prisma', 'Prism Sceptre'], ['Báculo de Ceniza Ardiente', 'Burning Ash Staff'], ['Báculo de la Aurora', 'Aurora Staff']],
  arquero: [['Arco de la Tormenta', 'Storm Bow'], ['Arco del Carámbano', 'Icicle Bow'], ['Arco de Rama Viva', 'Living Branch Bow'], ['Arco de Relojería', 'Clockwork Bow'], ['Arco del Arcoíris', 'Rainbow Bow'], ['Arco de Brasas', 'Ember Bow'], ['Arco del Alba', 'Dawn Bow']],
  asesino: [['Dagas Carmesí', 'Crimson Daggers'], ['Colmillos de Hielo', 'Ice Fangs'], ['Espinas de Musgo', 'Moss Thorns'], ['Cuchillas de Resorte', 'Spring Blades'], ['Esquirlas de Espejo', 'Mirror Shards'], ['Garras de Ceniza', 'Ash Claws'], ['Dagas del Eclipse del Alba', 'Dawn Eclipse Daggers']],
  bardo: [['Lira Áurea', 'Golden Lyre'], ['Arpa de Hielo', 'Ice Harp'], ['Laúd de Roble', 'Oak Lute'], ['Laúd de Cuerda de Reloj', 'Clockspring Lute'], ['Laúd de Cristal', 'Crystal Lute'], ['Laúd del Fénix', 'Phoenix Lute'], ['Arpa de la Aurora', 'Aurora Harp']],
  invocador: [['Guadaña de los Pactos', 'Scythe of Pacts'], ['Guadaña de Escarcha', 'Frost Scythe'], ['Guadaña de Raíz', 'Root Scythe'], ['Guadaña del Péndulo', 'Pendulum Scythe'], ['Guadaña Prismática', 'Prismatic Scythe'], ['Guadaña de Ceniza', 'Ash Scythe'], ['Guadaña del Oráculo', "Oracle's Scythe"]],
  pez: [['Aletas Abisales', 'Abyssal Fins'], ['Aletas de Narval', 'Narwhal Fins'], ['Aletas de Manglar', 'Mangrove Fins'], ['Aletas de Latón', 'Brass Fins'], ['Aletas de Nácar Prisma', 'Prism Nacre Fins'], ['Aletas de Magma', 'Magma Fins'], ['Aletas de la Ballena Aurora', 'Aurora Whale Fins']] };
const TJ_TPAL = { 37: P5(['#1a1420', '#3a2a40', '#6a4a70', '#a07aa8', '#e0c8e8']), 38: TJT[0].g, 39: TJT[1].a, 40: TJT[2].m, 41: TJT[3].a, 42: TJT[4].a, 43: TJT[5].a };
for (const t of TJ_TIERS) { const lv = TJ_LV[t], [tn, te] = TJ_TN[t], nm = L2(tn, te), i = t - 37;
  TIER[t] = { k: 'tj' + t, m: nm, f: nm, mp: nm, fp: nm, lv, p: t }; TIERP[t] = TJ_TPAL[t];
  const looks = AP_CLASSES.map(c => CLASSES[c].n + ': ' + L2(TJ_SETN[c][i][0], TJ_SETN[c][i][1])).join(' · ');
  const d = L2('Armadura de las Tierras Tejidas. Cada clase la lleva con su propio diseño. ', 'Armour of the Woven Lands. Each class wears it with its own design. ') + looks;
  const def = 3 + lv * 1.4 + t * 2, price = k => Math.round(k * Math.pow(t, 2.3));
  [['h', 'head', 0.45, 1.5, 14, ['helm', 15]], ['b', 'body', 1, 3.5, 20, ['armor', 15]], ['l', 'legs', 0.6, 2, 16, ['legs', 15]], ['f', 'feet', 0.35, 0, 12, ['boots', 15]]].forEach(([s, slot, dm, hm, pk, icon], k) => {
    const o = { n: L2(TJ_PN[k][0] + ' ' + tn, TJ_PN[k][1] + ' ' + te), t: 'armor', slot, lv, tier: t, def: Math.round(def * dm), price: price(pk), icon, rar: 5, d, tj: 1 };
    if (hm) o.hpB = Math.round(lv * hm); else o.spdB = 10; it(`${s}_${t}`, o);
    RECIPES.push({ id: `r_${s}_${t}`, job: 'herreria', out: `${s}_${t}`, n: 1, lv, jlv: 1, gold: 140000 * (t - 20), mats: TJ_REC[t], cat: 'armadura' }); });
  for (const c of AP_CLASSES) { const [, , , mul] = WBASE[c === 'pez' ? 'guerrero' : c], wn = TJ_WN[c][i], id = `w_${c}_${t}`;
    it(id, { n: L2(wn[0], wn[1]), t: 'weapon', slot: 'weapon', cls: c, lv, tier: t, atk: Math.round((8 + lv * 3.1 + t * 5) * mul * (c === 'pez' ? 0.98 : 1)), crit: c === 'arquero' ? t : c === 'asesino' ? Math.round(t * 1.5) : c === 'pez' ? Math.round(t * 0.6) : 0,
      mpB: c === 'mago' || c === 'invocador' ? t * 12 : c === 'bardo' ? t * 8 : 0, price: Math.round(30 * Math.pow(t, 2.4)), icon: ['arm', c, t], rar: 5, tj: 1, d: L2('Arma de las Tierras Tejidas (', 'Weapon of the Woven Lands (') + nm + ').' });
    RECIPES.push({ id: `r_w_${c}_${t}`, job: 'herreria', out: id, n: 1, lv, jlv: 1, gold: 180000 * (t - 20), mats: TJ_REC[t], cat: 'arma', cls: c }); } }

// ---------- dibujo de las armas en la mano, en HD y en el inventario ----------
for (const c of AP_CLASSES) for (const t of TJ_TIERS) { const key = c + '_' + t; try { const a = tjWeaponPix(c, t, 1), b = tjWeaponPix(c, t, 2); ARM_HPIX[key] = a.pix; ARM_PIX[key] = a.pix; ARM_HDP[key] = b.pix; ARM_PIVK16[key] = a.piv; ARM_PIVK32[key] = b.piv; } catch (e) { console.warn('arma', key, e); } }
// efectos de ataque: el atlas del tier 26 con los colores de cada tier (fila = clase)
const TJ_ATL = {};
function tjAtlas(t) { if (TJ_ATL[t]) return TJ_ATL[t]; const src = WSPR_IMG.arm26; if (!src || !src.complete || !src.naturalWidth) return null;
  const c = mkCanvas(src.naturalWidth, src.naturalHeight), x = c.getContext('2d'); x.drawImage(src, 0, 0); const D = x.getImageData(0, 0, c.width, c.height), d = D.data, rh = c.height / 7;
  const ramps = AP_CLASSES.map(cl => { const T = tjWT(cl, t); return [T.m[1], T.a[2], T.a[3], T.g[3], T.g[4]].map(v => [uR(v), uG(v), uB(v)]); });
  for (let y = 0; y < c.height; y++) { const R = ramps[Math.min(6, Math.floor(y / rh))]; for (let xx = 0; xx < c.width; xx++) { const i = (y * c.width + xx) * 4; if (d[i + 3] < 8) continue; const l = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255 * 4, j = Math.min(3, l | 0), f = l - j;
      for (let k = 0; k < 3; k++) d[i + k] = Math.round(R[j][k] * (1 - f) + R[j + 1][k] * f); } }
  x.putImageData(D, 0, 0); const im = new Image(); im.src = c.toDataURL(); TJ_ATL[t] = im; WSPR_IMG['arm' + t] = im; return im; }
{ const _ws = wsprSetItem; wsprSetItem = function (it) { const t = it && (it.tier | 0); if (it && it.tj && TJ_LV[t] && !it.ws) { tjAtlas(t); const row = WSPR_ROW[it.cls === 'pez' ? 'pez' : it.cls]; if (WSPR_IMG['arm' + t] && row !== undefined) return { img: 'arm' + t, row, bow: row === 2, cw: ARM_CW, ch: ARM_CH, s: 2 }; } return _ws.apply(this, arguments); }; }
