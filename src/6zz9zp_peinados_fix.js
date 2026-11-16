// ================= v4.94: ARREGLO DE LOS 13 PEINADOS DE REFERENCIA =================
// Los peinados de 6zz9zo_peinados_ref.js se dibujan de frente con el dibujo de la referencia, pero de perfil y de espaldas
// salían con la forma clásica (sin parecerse) y seis se salían del cuadro por arriba. Aquí:
// 1) De perfil y de espaldas cada uno usa un peinado anime (AH) con la misma forma: mismas capas, largo, coletas, trenzas
//    o moño. Así se ve igual en las 4 direcciones y se adapta solo a las 8 estructuras (chica y chico).
// 2) De frente, lo que sube por encima del cuadro se encoge hacia abajo (como los sombreros altos de 6zx_fit) en vez de
//    cortarse. No se borra ni se cambia nada del dibujo original.
const REF_AH = ['despeinado', 'lobo_capas', 'liso_largo', 'coleta_anime', 'cuadrado_ondulado', 'rizos_flequillo', 'ondas_anime', 'dos_trenzas', 'coletas_bajas', 'mono_suelto', 'seda', 'bob_capas', 'cuadrado'];
// perfil y espalda con el peinado anime equivalente
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const HS = L && L.hs; if (!HS || HS.refHair === undefined || (dir !== 'left' && dir !== 'right' && dir !== 'up')) return _dh.apply(this, arguments);
  const k = REF_AH[HS.refHair]; if (!k || !AH[k]) return _dh.apply(this, arguments); const had = Object.prototype.hasOwnProperty.call(HS, 'ah'); HS.ah = k;
  try { return _dh.apply(this, arguments); } finally { if (!had) delete HS.ah; } }; }
// de frente: lo que se sale por arriba se encoge para caber
{ const _rf = drawReferenceFringe; drawReferenceFringe = function (p, id, hx, hy, rx, ry, hair, second) { const OFF = 40, W = p.w, H = p.h + OFF, buf = new Uint32Array(W * H);
  const fake = { w: W, h: H, set(x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H || !c) return; buf[y * W + x] = c; } };
  _rf(fake, id, hx, hy + OFF, rx, ry, hair, second);
  let y0 = H; for (let y = 0; y < H && y0 === H; y++) for (let x = 0; x < W; x++) if (buf[y * W + x]) { y0 = y; break; } if (y0 === H) return;
  const headTop = Math.round(hy - ry) + OFF, top = y0 - OFF;
  for (let y = 0; y < H; y++) { let dy; if (top >= 2 || y >= headTop) dy = y - OFF; else { if (y < y0) continue; dy = Math.round(2 + (y - y0) * (headTop - OFF - 2) / Math.max(1, headTop - y0)); }
    if (dy < 0 || dy >= p.h) continue; for (let x = 0; x < W; x++) { const c = buf[y * W + x]; if (c) p.set(x, dy, c); } } }; }
