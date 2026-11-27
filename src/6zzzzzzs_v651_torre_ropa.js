// 6.51 · Vestuario de la Torre Infinita: ropa cosmética nueva de premio (sin estadísticas).
// Sergio mandó 9 referencias de ropa (crop top con short de volantes, vestido verde de mangas abullonadas, blazer de
// espiga con camisa vaquera, chaqueta utilitaria verde oliva, gabardina, blazer de cuadros, top halter de pañuelo con
// pantalón ancho blanco, suéter de rayas con falda vaquera y gorra, conjuntos de «personalidad» y de Halloween) y pidió:
// «ropas cosméticas de premio que no repitan la ropa actual, toda en la Torre Infinita, para todas las estructuras de
// cuerpo, femenino y masculino». Todo con fitKind y los anclajes del motor (A.*): se adapta a las 22 estructuras de
// BODY_T y a las cuatro direcciones. La piel del personaje viaja en la prenda (L.top.sk / L.bot.sk) como en 6.30.
// Premio: cada 5 pisos superados (cualquier modo) sale la siguiente prenda del vestuario; los jefes de la torre dan una
// prenda que falte con un 15 % (segura a los 6 jefes sin ella). Lupa › ♾ Vestuario de la Torre.
const TW = {
  negro: P5(['#07070a', '#111116', '#1c1c24', '#2a2a34', '#3c3c48']), blanco: P5(['#a6a6ac', '#cacace', '#e6e6ea', '#f4f4f6', '#ffffff']),
  oliva: P5(['#262c14', '#38401e', '#4c5629', '#626e36', '#7c8a48']), salvia: P5(['#3c4a26', '#566a36', '#728a4a', '#8ea862', '#aac47e']),
  espiga: P5(['#3a2a20', '#56402f', '#735842', '#8e7258', '#a88c72']), vaquero: P5(['#16263e', '#22385a', '#304c76', '#446292', '#5e7eac']),
  beige: P5(['#7a6648', '#a08a66', '#c2ab84', '#d8c49e', '#ece0c2']), gris: P5(['#4a4a52', '#66666e', '#84848c', '#a2a2aa', '#c2c2c8']),
  arena: P5(['#6e6250', '#94866e', '#b4a68c', '#cec2a8', '#e4dac4']), amarillo: P5(['#8a6a10', '#b88e1c', '#e0b42e', '#f2cc4c', '#fae484']),
  marron: P5(['#3a2214', '#54321e', '#70462a', '#8c5c38', '#a8764a']), naranja: P5(['#6a2a08', '#9a4010', '#c85a1a', '#e47a30', '#f49c56']),
  cuero: P5(['#3e2412', '#5e381c', '#7e4e28', '#9e6836', '#bc8650']), mimbre: P5(['#6a5226', '#8e7038', '#b2904e', '#cead68', '#e6c888']),
  nude: P5(['#8a6a4c', '#aa8866', '#c8a682', '#dcbe9c', '#eed8bc']), azulc: P5(['#3e5a7e', '#5a7aa2', '#7a9cc4', '#9cbcdc', '#c2d8ee']),
  oro: [C('#8a6a10'), C('#d8b030'), C('#f8e070')], plata: [C('#5a5e68'), C('#9aa0ac'), C('#dce2ec')], perla: [C('#c8c2b8'), C('#ece6dc'), C('#ffffff')],
  rojo: [C('#6a1018'), C('#a82030'), C('#d84050')], girasol: [C('#a87810'), C('#f0c030'), C('#5a3410')]
};
const twSk = (A, s) => { const S = (s && s.sk) || A.sk || SKINS[0]; return Array.from(S).map(c => typeof c === 'string' ? C(c) : c); };
const twR = A => A.tx0 + A.tw - 1;
// falda/volante a la altura de la cadera: devuelve [x0, x1] de la fila y (se ensancha con e)
const twSpan = (A, e) => A.side ? [A.cx - 4 - (A.d > 0 ? e : 0), A.cx + 3 + (A.d < 0 ? e : 0)] : [A.tx0 - 1 - e, twR(A) + 1 + e];
// pinta una franja de piel en el torso (ombligo al aire) desde y0 hasta el final del torso
function twMidriff(p, A, S, y0) { const R = twR(A); for (let y = y0; y < A.torsoTop + A.th; y++) for (let x = A.tx0; x <= R; x++) if (uA(p.get(x, y))) p.set(x, y, x === A.tx0 ? S[1] : x === R ? S[1] : (A.side && (x - A.cx) * A.d > 1) ? S[3] : S[2]); }
// cuello de una camiseta/camisa que asoma (en V o redondo)
function twNeck(p, A, c, deep, round) { if (A.up) return; const { cx, torsoTop: ty } = A; if (A.side) { const fx = Math.round(cx + A.d * (A.tw / 2 - 1)); for (let y = ty; y < ty + deep; y++) p.set(fx, y, c[3]); return; }
  for (let y = 0; y < deep; y++) { const w = round ? Math.max(0, 2 - (y >> 1)) : Math.max(0, deep - y - 1) * 0.6 + 0.5; for (let x = Math.round(cx - 1 - w); x <= Math.round(cx + w); x++) p.set(x, ty + y, y === 0 ? c[4] : c[3]); } }

// ===================== CUERPO =====================
// crop top fruncido de tirantes anchos: escote recto con frunces, ombligo al aire, brazos al aire
fitKind('body', 'tw_crop', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = twR(A), m = s.m, S = twSk(A, s), bot = ty + Math.max(3, Math.round(th * 0.55));
  twMidriff(p, A, S, bot + 1);
  for (let y = ty; y <= bot; y++) for (let x = tx0; x <= R; x++) { if (!uA(p.get(x, y))) continue; p.set(x, y, y === bot ? m[1] : (!up && !side && y <= ty + 2 && (x - tx0) % 2 === 0) ? m[3] : x === tx0 ? m[3] : x === R ? m[1] : m[2]); }
  if (side) { const bx = Math.round(cx - A.d * (tw / 2 - 2)); p.set(bx, ty - 1, m[2]); return; }
  // tirantes anchos y escote recto (de frente asoma piel sobre el escote)
  if (!up) { for (let x = tx0 + 2; x <= R - 2; x++) p.set(x, ty, S[2]); p.set(tx0 + 1, ty, m[2]); p.set(tx0 + 2, ty, m[3]); p.set(R - 1, ty, m[2]); p.set(R - 2, ty, m[1]); }
  else { p.hl(tx0 + 1, ty, 2, m[2]); p.hl(R - 2, ty, 2, m[2]); }
}, { skin: true });
// vestido de mangas abullonadas con cuello alto (largo o corto) y falda de vuelo con pliegues
fitKind('body', 'tw_puff', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, legTop, base, d } = A, R = twR(A), m = s.m, end = s.v === 'corto' ? Math.round(legTop + (base - legTop) * 0.5) : base - 3;
  for (let y = legTop - 1; y <= end; y++) { const k = y - legTop + 1, e = Math.floor(k / 3), [x0, x1] = twSpan(A, e);
    for (let x = x0; x <= x1; x++) { let c = x === x0 ? m[3] : x === x1 ? m[1] : m[2]; if (k > 1 && (x - x0) % 3 === 1 && x < x1) c = m[1]; if (y === end) c = m[0]; p.set(x, y, c); } }
  // cintura fruncida
  for (let x = tx0; x <= R; x++) if (uA(p.get(x, A.waistY + 1))) p.set(x, A.waistY + 1, (x % 2) ? m[1] : m[2]);
  // cuello alto (otro tono)
  const N = s.s || m; if (side) { const x = Math.round(cx + (d > 0 ? -1 : 0)); p.set(x, ty - 1, N[2]); p.set(x + 1, ty - 1, N[3]); p.set(x, ty, N[2]); return; }
  for (let x = Math.round(cx - 2); x <= Math.round(cx + 1); x++) { p.set(x, ty - 1, N[up ? 2 : 3]); p.set(x, ty, N[2]); }
  if (!up) { p.set(Math.round(cx - 2), ty + 1, m[3]); p.set(Math.round(cx + 1), ty + 1, m[3]); if (s.v === 'corto') { p.set(Math.round(cx - 0.5), ty + 2, TW.oro[1]); p.set(Math.round(cx - 0.5), ty + 3, TW.oro[2]); } }
});
// blazer de espiga: solapas, camisa vaquera, pañuelo al cuello y pañuelo de bolsillo
fitKind('body', 'tw_blazer', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, V = s.s || TW.vaquero;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  if (up) { p.hl(tx0 + 1, ty, tw - 2, m[3]); p.hl(Math.round(cx - 2), ty - 1, 4, V[2]); return; }
  if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); for (let y = ty; y < ty + 3; y++) p.set(fx, y, V[3]); p.set(fx - d, ty + 1, m[4]); p.set(fx - d, ty + 2, m[4]); p.set(Math.round(cx - d), ty + th - 3, m[1]); return; }
  const ow = Math.max(1, Math.round(tw * 0.2));
  for (let y = ty; y < ty + th - 1; y++) { const w = Math.max(0, ow - Math.floor((y - ty) / 2)); for (let x = Math.round(cx - w - 1); x <= Math.round(cx + w); x++) p.set(x, y, V[y === ty ? 3 : 2]); if (w > 0) { p.set(Math.round(cx - w - 2), y, m[4]); p.set(Math.round(cx + w + 1), y, m[4]); } }
  // pañuelo al cuello (azul con puntos claros) y pañuelo de bolsillo
  p.set(Math.round(cx - 1), ty, V[4]); p.set(Math.round(cx), ty, V[1]); p.set(Math.round(cx - 0.5), ty + 1, V[3]);
  p.set(R - 2, ty + 3, TW.marron[3]); p.set(R - 1, ty + 3, TW.beige[4]); p.hl(R - 2, ty + 4, 2, m[0]);
  p.set(Math.round(cx), ty + th - 3, m[0]); p.set(Math.round(cx), ty + th - 2, m[0]);
});
// chaqueta utilitaria: cuello camisero, dos bolsillos de pecho con solapa, botones oscuros y camiseta blanca
fitKind('body', 'tw_utility', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, W = TW.blanco;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  if (up) { p.hl(tx0 + 1, ty, tw - 2, m[4]); p.hl(tx0 + 1, ty + 1, tw - 2, m[3]); p.vl(Math.round(cx - 0.5), ty + 2, th - 3, m[1]); return; }
  if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, W[3]); p.set(fx, ty + 1, W[2]); p.set(fx - d, ty, m[4]); p.hl(Math.min(cx, cx + d * 2), ty + 2, 2, m[1]); p.set(Math.round(cx + d), ty + 4, m[0]); return; }
  twNeck(p, A, W, 3, true); p.set(Math.round(cx - 3), ty, m[4]); p.set(Math.round(cx + 2), ty, m[4]); p.set(Math.round(cx - 3), ty + 1, m[3]); p.set(Math.round(cx + 2), ty + 1, m[3]);
  p.vl(Math.round(cx - 0.5), ty + 3, th - 3, m[1]); for (let y = ty + 4; y < ty + th - 1; y += 2) p.set(Math.round(cx + 0.5), y, m[0]);
  for (const bx of [tx0 + 1, R - 3]) { p.hl(bx, ty + 2, 3, m[4]); p.hl(bx, ty + 3, 3, m[1]); p.set(bx + 1, ty + 3, m[0]); p.hl(bx, ty + 4, 3, m[2]); }
  p.hl(tx0, ty + th - 1, tw, m[1]);
});
// gabardina: cuello ancho, doble botonadura, cinturón con hebilla y faldones hasta la rodilla; camisa celeste
fitKind('body', 'tw_trench', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d, legTop, base } = A, R = twR(A), m = s.m, Sh = s.s || TW.azulc, tail = Math.round(legTop + (base - legTop) * 0.62);
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  const belt = A.waistY + 1; for (let x = tx0; x <= R; x++) if (uA(p.get(x, belt))) p.set(x, belt, m[0]);
  if (!up && !side) {
    twNeck(p, A, Sh, 3, false); for (let y = ty; y < ty + 3; y++) { p.set(Math.round(cx - 3 + (y - ty) * 0.5), y, m[4]); p.set(Math.round(cx + 2 - (y - ty) * 0.5), y, m[4]); }
    for (let y = ty + 4; y < ty + th - 1; y += 2) { p.set(Math.round(cx - 2), y, m[0]); p.set(Math.round(cx + 1), y, m[0]); }
    p.set(Math.round(cx - 0.5), belt, TW.oro[1]); p.set(Math.round(cx + 0.5), belt, TW.oro[0]);
    for (let y = legTop; y <= tail; y++) { p.set(tx0 - 1, y, m[3]); p.set(tx0, y, m[2]); p.set(R, y, m[1]); p.set(R + 1, y, m[0]); }
    p.set(tx0 - 1, tail, m[1]); p.set(R + 1, tail, m[0]);
  } else if (side) {
    const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, Sh[3]); p.set(fx, ty + 1, m[4]); p.set(fx - d, ty, m[4]);
    const bx = Math.round(cx - d * (tw / 2 - 3)); for (let y = legTop - 1; y <= tail; y++) { const w = 3 + Math.round((y - legTop) / 3); for (let i = 0; i < w; i++) p.set(bx - d * i, y, i === w - 1 ? m[0] : m[2]); }
    p.set(fx, legTop - 1, m[2]); p.set(fx, legTop, m[1]);
  } else {
    p.hl(tx0 + 1, ty, tw - 2, m[4]); p.hl(tx0 + 1, ty + 1, tw - 2, m[3]);
    for (let y = legTop; y <= tail; y++) for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, y, x === Math.round(cx - 0.5) ? m[0] : x <= tx0 ? m[3] : x >= R ? m[1] : m[2]);
    p.hl(tx0 - 1, tail, tw + 2, m[1]); p.hl(Math.round(cx - 2), belt + 1, 4, m[0]);
  }
});
// blazer de cuadros: solapas, botones y cuadros finos oscuros; camiseta blanca debajo
fitKind('body', 'tw_plaid', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, W = TW.blanco;
  for (let y = ty + 1; y < ty + th; y++) for (let x = tx0; x <= R; x++) { const c = p.get(x, y); if (!uA(c) || m.indexOf(c) < 0) continue; if ((x - tx0) % 3 === 2 || (y - ty) % 3 === 2) p.set(x, y, m[1]); }
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[0]); }
  if (up) { p.hl(tx0 + 1, ty, tw - 2, m[3]); return; }
  if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, W[3]); p.set(fx, ty + 1, W[2]); p.set(fx - d, ty + 1, m[4]); p.set(fx - d, ty + 2, m[4]); return; }
  const ow = Math.max(1, Math.round(tw * 0.2)); for (let y = ty; y < ty + Math.min(5, th - 2); y++) { const w = Math.max(0, ow - Math.floor((y - ty) / 2)); for (let x = Math.round(cx - w - 1); x <= Math.round(cx + w); x++) p.set(x, y, W[3]); if (w > 0) { p.set(Math.round(cx - w - 2), y, m[4]); p.set(Math.round(cx + w + 1), y, m[4]); } }
  p.set(Math.round(cx - 1), ty + th - 4, m[0]); p.set(Math.round(cx - 1), ty + th - 2, m[0]); p.hl(R - 3, ty + th - 3, 3, m[0]);
});
// top halter de pañuelo cruzado al cuello: hombros, brazos y ombligo al aire
fitKind('body', 'tw_halter', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, S = twSk(A, s), bot = ty + Math.max(3, Math.round(th * 0.6));
  for (let y = ty; y < ty + th; y++) for (let x = tx0; x <= R; x++) if (uA(p.get(x, y))) p.set(x, y, x === tx0 || x === R ? S[1] : S[2]);
  // banda del pañuelo que rodea el torso (también por la espalda y de perfil)
  for (let y = ty + 2; y <= bot; y++) for (let x = tx0; x <= R; x++) if (uA(p.get(x, y))) p.set(x, y, y === bot ? m[1] : x === tx0 ? m[3] : x === R ? m[1] : m[2]);
  if (up) { p.line(Math.round(cx - 2), ty - 1, Math.round(cx), ty + 2, m[3]); p.line(Math.round(cx + 1), ty - 1, Math.round(cx - 1), ty + 2, m[2]); p.set(Math.round(cx - 0.5), ty + 3, m[4]); p.set(Math.round(cx - 1.5), ty + 4, m[3]); p.set(Math.round(cx + 0.5), ty + 4, m[3]); return; }
  if (side) { const fx = Math.round(cx + d * (tw / 2 - 2)); for (let y = ty - 1; y < ty + 2; y++) p.set(fx, y, m[3]); return; }
  // dos bandas que se cruzan en el pecho y suben al cuello
  for (let y = ty + 2; y <= bot; y++) for (let x = tx0 + 1; x < R; x++) p.set(x, y, y === bot ? m[1] : ((x + y) % 4 === 0) ? m[3] : m[2]);
  p.line(Math.round(cx - 3), ty + 2, Math.round(cx + 1), ty - 1, m[3]); p.line(Math.round(cx + 2), ty + 2, Math.round(cx - 2), ty - 1, m[2]); p.set(Math.round(cx - 0.5), ty + 3, m[4]);
}, { skin: true });
// suéter de rayas oversize (rayas negras, blancas y grises también en las mangas)
fitKind('body', 'tw_stripes', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = twR(A), m = s.m, W = TW.blanco, G_ = TW.gris;
  for (let y = ty; y < ty + th + 1; y++) for (let x = tx0 - 1; x <= R + 1; x++) { const c = p.get(x, y); if (!uA(c) || (m.indexOf(c) < 0 && (x < tx0 || x > R))) continue; const k = (y - ty) % 4; p.set(x, y, k === 1 ? W[x === tx0 ? 3 : 2] : k === 2 ? G_[2] : x === tx0 ? m[3] : m[2]); }
  for (let x = tx0; x <= R; x++) if (uA(p.get(x, ty + th))) p.set(x, ty + th, m[1]);
  if (!up && !side) { for (let x = Math.round(cx - 2); x <= Math.round(cx + 1); x++) p.set(x, ty, m[4]); }
});
// blusa amarilla de escote cuadrado y mangas cortas abullonadas
fitKind('body', 'tw_blusa', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, S = twSk(A, s);
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  p.hl(tx0, A.waistY + 1, tw, m[1]);
  if (up) return; if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, S[2]); p.set(fx, ty + 1, S[2]); return; }
  for (let y = ty; y < ty + 2; y++) for (let x = Math.round(cx - 2); x <= Math.round(cx + 1); x++) p.set(x, y, S[2]); p.hl(Math.round(cx - 3), ty + 2, 6, m[4]);
  for (let y = ty + 3; y < A.waistY; y += 2) p.set(Math.round(cx - 0.5), y, m[4]);
}, { skin: true });
// chaqueta corta negra con cremallera plateada sobre top negro; cadena en el bolsillo
fitKind('body', 'tw_cropjk', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, Pl = TW.plata, bot = ty + Math.round(th * 0.62);
  for (let y = ty + 1; y <= bot; y++) { p.set(tx0, y, m[4]); p.set(R, y, m[2]); }
  for (let x = tx0; x <= R; x++) if (uA(p.get(x, bot))) p.set(x, bot, m[4]);
  if (up) { p.hl(tx0, ty, tw, m[4]); return; }
  if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.vl(fx, ty, bot - ty, Pl[1]); return; }
  p.vl(Math.round(cx - 1), ty + 1, bot - ty - 1, Pl[1]); p.vl(Math.round(cx + 1), ty + 1, bot - ty - 1, m[0]); p.set(Math.round(cx - 3), ty, m[4]); p.set(Math.round(cx + 2), ty, m[4]);
  for (let x = tx0 + 1; x < R; x++) if ((x + bot) % 2) p.set(x, bot + 2, Pl[x % 4 === 1 ? 2 : 0]);
});
// corsé negro de escote cuadrado con cordones y mangas cortas
fitKind('body', 'tw_corset', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, S = twSk(A, s), Lc = s.s || TW.marron;
  for (let y = ty + 2; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[0]); }
  if (up) { for (let y = ty + 2; y < ty + th - 1; y++) { p.set(Math.round(cx - 1), y, (y % 2) ? Lc[3] : m[0]); p.set(Math.round(cx), y, (y % 2) ? m[0] : Lc[3]); } return; }
  if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, S[2]); for (let y = ty + 2; y < ty + th - 1; y += 2) p.set(fx - d, y, Lc[3]); return; }
  for (let x = tx0 + 2; x <= R - 2; x++) { p.set(x, ty, S[2]); p.set(x, ty + 1, (x === tx0 + 2 || x === R - 2) ? m[2] : S[2]); } p.hl(tx0 + 2, ty + 2, tw - 4, m[4]);
  for (let y = ty + 3; y < ty + th - 1; y++) { p.set(Math.round(cx - 1), y, (y % 2) ? Lc[3] : m[0]); p.set(Math.round(cx), y, (y % 2) ? m[0] : Lc[3]); }
}, { skin: true });
// vestido gótico: escote corazón, mangas cortas abullonadas, guantes largos y falda con volante blanco y abertura
fitKind('body', 'tw_goth', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, legTop, base, d } = A, R = twR(A), m = s.m, W = TW.blanco, S = twSk(A, s), end = Math.round(legTop + (base - legTop) * 0.62);
  for (let y = legTop - 1; y <= end; y++) { const k = y - legTop + 1, e = Math.floor(k / 2), [x0, x1] = twSpan(A, e);
    for (let x = x0; x <= x1; x++) { let c = x === x0 ? m[3] : x === x1 ? m[1] : m[2]; if (y >= end - 1) c = (x % 2) ? W[3] : W[2]; if (!side && !up && x === x1 - 2 && k > 2 && y < end - 1) c = S[2]; p.set(x, y, c); } }
  if (up) return; if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, S[2]); p.set(fx, ty + 1, S[2]); return; }
  for (let x = Math.round(cx - 3); x <= Math.round(cx + 2); x++) { const yy = ty + (Math.abs(x - cx + 0.5) < 1 ? 2 : 1); for (let y = ty; y <= yy; y++) p.set(x, y, S[2]); }
  p.set(Math.round(cx - 0.5), ty, m[3]); p.set(Math.round(cx - 0.5), ty - 1, m[4]); p.set(Math.round(cx - 1.5), ty - 1, m[2]); p.set(Math.round(cx + 0.5), ty - 1, m[2]);
}, { skin: true });
// blusa blanca de volantes con collar de perlas (hombros con volante)
fitKind('body', 'tw_ruffle', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, Pe = TW.perla, S = twSk(A, s);
  for (let y = ty + 2; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  for (let x = tx0 - 1; x <= R + 1; x++) if (x < tx0 || x > R || uA(p.get(x, ty + 2))) p.set(x, ty + 2, (x % 2) ? m[4] : m[2]);
  if (up) return; if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, S[2]); p.set(fx, ty + 1, S[2]); p.set(fx, ty + 3, Pe[1]); return; }
  for (let y = ty; y < ty + 2; y++) for (let x = tx0 + 1; x < R; x++) p.set(x, y, S[2]);
  for (let x = Math.round(cx - 3); x <= Math.round(cx + 2); x++) p.set(x, ty + 1, (x % 2) ? Pe[2] : Pe[0]); p.set(Math.round(cx - 0.5), ty + 3, Pe[2]); p.set(Math.round(cx - 0.5), ty + 4, Pe[1]);
  for (let y = ty + 4; y < ty + th - 1; y++) p.set(Math.round(cx - 1.5), y, (y % 2) ? m[4] : m[2]);
}, { skin: true });
// top naranja de hombros caídos con mangas acampanadas y gargantilla
fitKind('body', 'tw_offsh', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, S = twSk(A, s), N = TW.negro;
  for (let y = ty; y < ty + 2; y++) for (let x = tx0; x <= R; x++) if (uA(p.get(x, y))) p.set(x, y, S[2]);
  p.hl(tx0 - 1, ty + 2, tw + 2, m[4]); for (let y = ty + 3; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  for (let y = ty + 4; y < ty + th - 1; y += 2) p.set(Math.round(cx - 0.5), y, m[1]);
  if (up) return; if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty - 1, N[2]); return; }
  p.hl(Math.round(cx - 2), ty - 1, 4, N[2]); p.set(Math.round(cx - 0.5), ty, N[3]);
}, { skin: true });
// camiseta naranja de calabaza (cara de calabaza negra) con cuello blanco de una camiseta debajo
fitKind('body', 'tw_pumpkin', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = twR(A), m = s.m, N = TW.negro, W = TW.blanco;
  for (let y = ty + 1; y < ty + th + 1; y++) { if (uA(p.get(tx0 - 1, y)) || y > ty + 1) p.set(tx0 - 1, y, m[3]); p.set(R + 1, y, m[1]); }
  for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, ty + th, m[1]);
  if (up) { p.hl(Math.round(cx - 2), ty - 1, 4, W[3]); return; }
  if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, W[3]); p.set(fx, ty - 1, W[2]); return; }
  p.hl(Math.round(cx - 2), ty - 1, 4, W[3]); p.hl(Math.round(cx - 2), ty, 4, W[2]);
  const ey = ty + Math.round(th * 0.35), my = ty + Math.round(th * 0.6);
  for (const ex of [Math.round(cx - 3), Math.round(cx + 1)]) { p.set(ex, ey, N[1]); p.set(ex + 1, ey, N[1]); p.set(ex + (ex < cx ? 1 : 0), ey - 1, N[1]); }
  for (let x = Math.round(cx - 3); x <= Math.round(cx + 2); x++) p.set(x, my + ((x % 2) ? 0 : 1), N[1]); p.set(Math.round(cx - 3), my, N[1]); p.set(Math.round(cx + 2), my, N[1]);
});

// ===================== PIERNAS =====================
// recolorea las piernas del pantalón base: por debajo de «cut» queda la piel (shorts, minifaldas, faldas cortas)
function twLegsCut(p, A, s, cut) { const m = s.m, cols = new Set(m), S = twSk(A, s); for (let y = cut; y < A.base; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; const k = m.indexOf(c); p.set(x, y, S[Math.min(S.length - 1, Math.max(0, k))]); } }
// short negro con volantes en capas a los lados y cordón en la cintura
fitKind('legs', 'tw_ruffshort', (p, A, s) => { const { legTop, base, cx, side, up, d } = A, m = s.m, cut = Math.round(legTop + (base - legTop) * 0.36);
  twLegsCut(p, A, s, cut + 1); const [x0, x1] = twSpan(A, 0);
  for (let y = legTop; y <= cut; y++) for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 ? m[3] : x === x1 ? m[1] : m[2]);
  // volantes: dos capas que sobresalen en los lados
  for (let k = 0; k < 2; k++) { const y = legTop + 1 + k * 2; if (y > cut + 1) break; const L_ = side ? [d > 0 ? x0 - 1 : x1 + 1] : [x0 - 1, x1 + 1]; for (const x of L_) { p.set(x, y, m[3]); p.set(x, y + 1, m[1]); p.set(x + (x < cx ? -1 : 1), y + 1, m[2]); } }
  if (!up && !side) { p.set(Math.round(cx - 1), legTop, m[4]); p.set(Math.round(cx), legTop + 1, m[4]); p.set(Math.round(cx - 1), legTop + 2, m[3]); }
}, { skin: true });
// pantalón ancho blanco de tiro alto (se abre hacia los pies)
fitKind('legs', 'tw_wide', (p, A, s) => { const { legTop, base, side, up } = A, m = s.m, cols = new Set(m);
  for (let y = legTop; y < base - 1; y++) { const t = (y - legTop) / Math.max(1, base - legTop), e = t > 0.4 ? 1 : 0; if (!e) continue; for (let x = 1; x < p.w - 1; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; if (!cols.has(p.get(x - 1, y)) && !uA(p.get(x - 1, y))) p.set(x - 1, y, m[3]); if (!cols.has(p.get(x + 1, y)) && !uA(p.get(x + 1, y))) { p.set(x + 1, y, m[1]); x++; } } }
  if (!up && !side) for (let y = legTop + 1; y < base - 3; y += 3) { const row = []; for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) row.push(x); if (row.length > 4) { p.set(row[1], y, m[4]); p.set(row[row.length - 2], y, m[2]); } }
});
// minifalda vaquera negra con pespuntes blancos
fitKind('legs', 'tw_jeanskirt', (p, A, s) => { const { legTop, base, cx, side, up } = A, m = s.m, W = TW.blanco, end = Math.round(legTop + (base - legTop) * 0.4);
  twLegsCut(p, A, s, end + 1); const [x0, x1] = twSpan(A, 0);
  for (let y = legTop; y <= end; y++) for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 ? m[3] : x === x1 ? m[1] : m[2]);
  for (let x = x0; x <= x1; x++) { p.set(x, legTop, m[3]); if ((x - x0) % 2 === 0) p.set(x, end, W[1]); }
  if (!up && !side) { p.set(Math.round(cx - 0.5), legTop, W[3]); for (let y = legTop + 1; y < end; y++) p.set(Math.round(cx - 0.5), y, (y % 2) ? W[1] : m[1]); p.set(x0 + 1, legTop + 1, W[1]); p.set(x1 - 1, legTop + 1, W[1]); }
}, { skin: true });
// falda marrón con girasoles (corta, de vuelo)
fitKind('legs', 'tw_sunskirt', (p, A, s) => { const { legTop, base, side, up } = A, m = s.m, G_ = TW.girasol, end = Math.round(legTop + (base - legTop) * 0.44);
  twLegsCut(p, A, s, end + 1);
  for (let y = legTop; y <= end; y++) { const [x0, x1] = twSpan(A, (y - legTop) >> 1); for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 ? m[3] : x === x1 ? m[1] : m[2]); }
  if (up) return; const [a, b] = twSpan(A, (end - legTop) >> 1); for (let x = a + 1; x < b; x += 3) { const y = end - 1 - ((x >> 1) % 2); p.set(x, y, G_[1]); p.set(x, y - 1, G_[0]); p.set(x + (side ? 0 : 1), y, G_[2]); }
  const [c0, c1] = twSpan(A, 0); p.hl(c0, legTop, c1 - c0 + 1, m[0]);
}, { skin: true });
// falda negra de capas con cadena plateada
fitKind('legs', 'tw_layers', (p, A, s) => { const { legTop, base, side, up } = A, m = s.m, Pl = TW.plata, end = Math.round(legTop + (base - legTop) * 0.46);
  twLegsCut(p, A, s, end + 1);
  for (let y = legTop; y <= end; y++) { const tier = Math.floor((y - legTop) / Math.max(2, Math.round((end - legTop + 1) / 3))), [x0, x1] = twSpan(A, tier); for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 ? m[4] : x === x1 ? m[1] : (y === end || (y - legTop) % 3 === 2) ? m[0] : m[2]); }
  if (up) return; const [c0, c1] = twSpan(A, 0); for (let x = c0 + 1; x < c1; x++) if (x % 2) p.set(x, legTop + 1 + ((x >> 1) % 2), Pl[x % 4 === 1 ? 2 : 1]);
}, { skin: true });
// falda marrón evasé por encima de la rodilla con pliegue central
fitKind('legs', 'tw_aline', (p, A, s) => { const { legTop, base, cx, side, up } = A, m = s.m, end = Math.round(legTop + (base - legTop) * 0.52);
  twLegsCut(p, A, s, end + 1);
  for (let y = legTop; y <= end; y++) { const [x0, x1] = twSpan(A, Math.floor((y - legTop) / 3)); for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 ? m[3] : x === x1 ? m[1] : y === end ? m[1] : m[2]); }
  const [c0, c1] = twSpan(A, 0); p.hl(c0, legTop, c1 - c0 + 1, m[4]); if (!up && !side) for (let y = legTop + 2; y < end; y++) p.set(Math.round(cx - 0.5), y, m[1]);
}, { skin: true });
// pantalón negro de tiro alto con dos filas de botones
fitKind('legs', 'tw_highwaist', (p, A, s) => { const { legTop, cx, tx0, tw, side, up } = A, m = s.m, R = twR(A);
  for (let x = tx0; x <= R; x++) { if (uA(p.get(x, legTop - 1))) p.set(x, legTop - 1, m[2]); if (uA(p.get(x, legTop))) p.set(x, legTop, m[2]); } if (up) return;
  if (side) { gtSet(p, Math.round(cx + A.d), legTop, m[4]); return; } for (const bx of [Math.round(cx - 2), Math.round(cx + 1)]) { gtSet(p, bx, legTop - 1, m[4]); gtSet(p, bx, legTop + 1, m[4]); }
  for (let y = legTop + 3; y < A.base - 3; y++) gtSet(p, Math.round(cx - 0.5), y, m[1]);
});
// short negro rasgado con dobladillo deshilachado
fitKind('legs', 'tw_ripshort', (p, A, s) => { const { legTop, base, side, up } = A, m = s.m, S = twSk(A, s), cut = Math.round(legTop + (base - legTop) * 0.4), cols = new Set(m);
  twLegsCut(p, A, s, cut + 1); for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, cut))) p.set(x, cut, (x % 2) ? m[4] : m[3]);
  if (up || side) return; for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, cut - 2)) && x % 5 === 1) { p.set(x, cut - 2, S[2]); p.set(x + 1, cut - 2, S[1]); }
}, { skin: true });
// pantalón negro con cadena plateada en la cadera
fitKind('legs', 'tw_chain', (p, A, s) => { const { legTop, cx, side, up, d } = A, Pl = TW.plata, R = twR(A);
  if (up) return; if (side) { for (let k = 0; k < 4; k++) p.set(Math.round(cx - d * (1 - k * 0.5)), legTop + 1 + (k >> 1), Pl[k % 2 ? 2 : 1]); return; }
  for (let k = 0; k < 5; k++) p.set(Math.round(cx + 1 + k), legTop + 1 + Math.round(Math.sin(k * 0.9) + 1), Pl[k % 2 ? 2 : 1]); p.set(R, legTop + 1, Pl[0]);
});
// vaquero con costuras claras (para las chaquetas)
fitKind('legs', 'tw_jeans', (p, A, s) => { const { legTop, base, cx, side, up } = A, m = s.m, cols = new Set(m);
  for (let y = legTop + 2; y < base - 2; y++) { const row = []; for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) row.push(x); if (row.length < 3) continue; if (!side) { p.set(row[1], y, m[4]); p.set(row[row.length - 2], y, m[4]); } else if (y % 2) p.set(row[1], y, m[4]); }
  if (!up && !side) { p.set(Math.round(cx - 3), legTop + 1, m[4]); p.set(Math.round(cx + 2), legTop + 1, m[4]); }
});
// chino beige con raya y vuelta en el bajo
fitKind('legs', 'tw_chino', (p, A, s) => { const { legTop, base, side } = A, m = s.m, cols = new Set(m);
  for (let y = legTop + 1; y < base - 1; y++) { const row = []; for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) row.push(x); if (row.length < 4 || side) continue; const mid = row[Math.floor(row.length / 2)]; p.set(row[Math.floor(row.length * 0.25)], y, m[3]); p.set(row[Math.floor(row.length * 0.75)], y, m[3]); if (y === base - 3) for (const x of row) if (x !== mid) p.set(x, y, m[4]); }
});

// ===================== ESPALDA =====================
// mochila de cuero con correa al hombro
fitKind('back', 'tw_mochila', (p, A) => { const { cx, tx0, tw, torsoTop: ty, th, side, up, d } = A, K = TW.cuero, R = twR(A);
  if (up) { const x0 = Math.round(cx - tw * 0.35), x1 = Math.round(cx + tw * 0.35); for (let y = ty + 1; y < ty + th; y++) for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 ? K[3] : x === x1 ? K[1] : y === ty + 1 ? K[4] : K[2]); p.hl(x0, ty + 3, x1 - x0 + 1, K[1]); p.set(Math.round(cx - 0.5), ty + 4, TW.oro[1]); return; }
  if (side) { let bx = d > 0 ? tx0 - 1 : R + 1; for (let y = ty + 1; y < ty + th; y++) { let e = bx; for (let x = 0; x < p.w; x++) { const xx = d > 0 ? x : p.w - 1 - x; if (uA(p.get(xx, y))) { e = xx - d; break; } } if (d > 0 ? e < bx : e > bx) bx = e; } for (let y = ty + 1; y < ty + th; y++) for (let i = 0; i < 3; i++) p.set(bx - d * i, y, i === 2 ? K[1] : K[3 - i]); return; }
  p.line(tx0 + 1, ty, tx0 + 2, ty + th - 2, K[2]); p.line(tx0 + 2, ty, tx0 + 3, ty + th - 2, K[1]); p.set(tx0 + 2, ty + 2, TW.oro[1]);
});
// bolso de mimbre con asa de cuero (se lleva colgado del hombro, a un lado)
fitKind('back', 'tw_mimbre', (p, A) => { const { cx, tx0, tw, torsoTop: ty, th, side, up, d } = A, K = TW.mimbre, Q = TW.cuero, R = twR(A), y0 = ty + th - 1;
  const bag = (x0) => { for (let y = y0; y < y0 + 5; y++) for (let x = x0; x < x0 + 5; x++) p.set(x, y, ((x + y) % 2) ? K[3] : K[1]); p.hl(x0, y0, 5, Q[2]); p.set(x0 + 2, y0 + 1, Q[3]); };
  if (side) { const bx = d > 0 ? tx0 - 4 : R; bag(bx); p.line(Math.round(cx), ty, d > 0 ? tx0 - 2 : R + 2, y0, Q[1]); return; }
  if (up) { bag(tx0 - 3); p.line(tx0 + 1, ty, tx0 - 1, y0, Q[1]); return; }
  bag(R + 1); p.line(R - 1, ty, R + 2, y0, Q[2]);
});

// ===================== BRAZOS Y PIEL =====================
// modo de manga de cada prenda: bare = brazos al aire; short = manga corta; puff = abullonada larga con puño;
// spuff = corta abullonada; bell = acampanada; stripe = rayas; tee = corta con camiseta blanca de manga larga debajo
const TW_ARMS = { tw_crop: 'bare', tw_halter: 'bare', tw_puff: 'puff', tw_blusa: 'spuff', tw_corset: 'short', tw_goth: 'spuff', tw_ruffle: 'puff', tw_offsh: 'bell', tw_stripes: 'stripe', tw_pumpkin: 'tee' };
const TW_SKIN_TOP = new Set(['tw_crop', 'tw_halter', 'tw_blusa', 'tw_corset', 'tw_goth', 'tw_ruffle', 'tw_offsh']);
const TW_SKIN_BOT = new Set(['tw_ruffshort', 'tw_jeanskirt', 'tw_sunskirt', 'tw_layers', 'tw_aline', 'tw_ripshort']);
hookBefore('drawHero', (p, L) => { const k = L && L.top && L.top.k; if (k && TW_ARMS[k] && p && !p.t) { p.t = new Uint8Array(p.w * p.h); p.tg = 0; } });
hookAfter('drawHero', (r, p, L) => {
  const T = L && L.top, mode = T && TW_ARMS[T.k]; if (!mode || !p.t || !p.meta) return;
  const A = p.meta, M = T.m, S = twSk(A, T), cx = A.cx, rows = {};
  for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3 && M.indexOf(p.d[i]) >= 0) { const y = (i / p.w) | 0; (rows[y] = rows[y] || []).push(i); }
  const ys = Object.keys(rows).map(Number).sort((a, b) => a - b); if (!ys.length) return;
  const n = ys.length, cutShort = ys[0] + Math.max(1, Math.round(n * 0.32)), W = TW.blanco, G_ = TW.gris;
  for (const y of ys) for (const i of rows[y]) { const k = M.indexOf(p.d[i]), x = i % p.w, sk = S[Math.min(S.length - 1, Math.max(0, k - 1))];
    if (mode === 'bare') p.d[i] = sk;
    else if ((mode === 'short' || mode === 'spuff') && y > cutShort) p.d[i] = sk;
    else if (mode === 'tee' && y > cutShort) p.d[i] = W[Math.min(4, Math.max(1, k))];
    else if (mode === 'stripe') { const q = (y - ys[0]) % 4; p.d[i] = q === 1 ? W[2] : q === 2 ? G_[2] : M[Math.max(1, k)]; }
    // abullonado: la parte alta de la manga sobresale 1 px hacia fuera
    if ((mode === 'puff' || mode === 'spuff') && y <= ys[0] + Math.max(1, Math.round(n * 0.25)) && !A.side) { const o = x < cx ? -1 : 1, j = i + o; if (x + o >= 0 && x + o < p.w && !uA(p.d[j])) p.d[j] = M[o < 0 ? 3 : 1]; } }
  // puños y bordes
  const last = rows[ys[n - 1]] || [];
  if (mode === 'puff') for (const i of last) p.d[i] = M[4];
  if (mode === 'spuff' || mode === 'short') for (const i of rows[Math.min(cutShort, ys[n - 1])] || []) p.d[i] = M[mode === 'spuff' ? 4 : 1];
  if (mode === 'bell' && !A.side) { const yb = ys[n - 1]; for (const i of last) { const x = i % p.w, o = x < cx ? -1 : 1; if (x + o >= 0 && x + o < p.w && !uA(p.d[i + o])) p.d[i + o] = M[1]; if (yb + 1 < p.h && !uA(p.d[i + p.w])) p.d[i + p.w] = M[2]; } }
});
hookAfter('heroLook', L => {
  if (!L) return; const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c);
  if (L.top && (TW_SKIN_TOP.has(L.top.k) || TW_ARMS[L.top.k])) L.top = Object.assign({}, L.top, { sk: SK });
  if (L.bot && TW_SKIN_BOT.has(L.bot.k)) L.bot = Object.assign({}, L.bot, { sk: SK });
});

// ===================== VESTUARIO (premios) =====================
// orden = orden de los premios de hitos (cada 5 pisos). [id, es, en, ranura, prenda, conjunto]
const TWR_SETS = {
  noche: ['Noche de volantes', 'Ruffle night'], salvia: ['Salvia', 'Sage'], espiga: ['Caballero de espiga', 'Herringbone gentleman'], oliva: ['Utilitario oliva', 'Olive utility'],
  ciudad: ['Ciudad', 'City'], verano: ['Verano', 'Summer'], rayas: ['Rayas', 'Stripes'], girasol: ['Girasol', 'Sunflower'], fuerte: ['Carácter fuerte', 'Strong character'],
  afilado: ['Carácter afilado', 'Sharp character'], gotico: ['Gótico de volantes', 'Ruffled gothic'], perla: ['Perlas', 'Pearls'], otono: ['Otoño', 'Autumn'], calabaza: ['Calabaza', 'Pumpkin'] };
const TWR = [
  ['c_tw_crop', 'Crop top fruncido negro', 'Black ruched crop top', 'body', () => ({ k: 'tw_crop', m: TW.negro }), 'noche'],
  ['c_tw_ruffshort', 'Short de volantes negro', 'Black ruffle shorts', 'legs', () => ({ k: 'tw_ruffshort', m: TW.negro }), 'noche'],
  ['c_tw_puff', 'Vestido salvia de mangas abullonadas', 'Sage puff-sleeve dress', 'body', () => ({ k: 'tw_puff', m: TW.salvia, s: TW.oliva }), 'salvia'],
  ['c_tw_blazer', 'Blazer de espiga con pañuelo', 'Herringbone blazer and scarf', 'body', () => ({ k: 'tw_blazer', m: TW.espiga, s: TW.vaquero }), 'espiga'],
  ['c_tw_jeans', 'Vaquero de costuras claras', 'Contrast-stitch jeans', 'legs', () => ({ k: 'tw_jeans', m: TW.vaquero }), 'espiga'],
  ['c_tw_mochila', 'Mochila de cuero', 'Leather backpack', 'back', () => ({ k: 'tw_mochila' }), 'espiga'],
  ['c_tw_utility', 'Chaqueta utilitaria oliva', 'Olive utility jacket', 'body', () => ({ k: 'tw_utility', m: TW.oliva }), 'oliva'],
  ['c_tw_trench', 'Gabardina beige', 'Beige trench coat', 'body', () => ({ k: 'tw_trench', m: TW.beige, s: TW.azulc }), 'ciudad'],
  ['c_tw_chino', 'Pantalón chino beige', 'Beige chinos', 'legs', () => ({ k: 'tw_chino', m: TW.arena }), 'ciudad'],
  ['c_tw_plaid', 'Blazer de cuadros gris', 'Grey plaid blazer', 'body', () => ({ k: 'tw_plaid', m: TW.gris }), 'ciudad'],
  ['c_tw_halter', 'Top halter de pañuelo', 'Scarf halter top', 'body', () => ({ k: 'tw_halter', m: TW.arena }), 'verano'],
  ['c_tw_wide', 'Pantalón ancho blanco', 'White wide-leg trousers', 'legs', () => ({ k: 'tw_wide', m: TW.blanco }), 'verano'],
  ['c_tw_mimbre', 'Bolso de mimbre', 'Wicker bag', 'back', () => ({ k: 'tw_mimbre' }), 'verano'],
  ['c_tw_gafas', 'Gafas de sol de verano', 'Summer sunglasses', 'head', () => ({ k: 'shades', m: pal(['#1a1414', '#2a2020', '#3a2c2a', '#6a4a3a', '#c8a888']) }), 'verano'],
  ['c_tw_sandalias', 'Sandalias de tiras', 'Strappy sandals', 'feet', () => ({ k: 'sandals', m: TW.nude }), 'verano'],
  ['c_tw_stripes', 'Suéter de rayas oversize', 'Oversized striped sweater', 'body', () => ({ k: 'tw_stripes', m: TW.negro }), 'rayas'],
  ['c_tw_jeanskirt', 'Minifalda vaquera negra', 'Black denim mini skirt', 'legs', () => ({ k: 'tw_jeanskirt', m: TW.negro }), 'rayas'],
  ['c_tw_gorra', 'Gorra negra', 'Black cap', 'head', () => ({ k: 'cap', m: TW.negro, s: TW.negro, cover: 'hat' }), 'rayas'],
  ['c_tw_blusa', 'Blusa amarilla abullonada', 'Yellow puff blouse', 'body', () => ({ k: 'tw_blusa', m: TW.amarillo }), 'girasol'],
  ['c_tw_sunskirt', 'Falda de girasoles', 'Sunflower skirt', 'legs', () => ({ k: 'tw_sunskirt', m: TW.marron }), 'girasol'],
  ['c_tw_puffcorto', 'Vestido corto salvia con colgante', 'Short sage dress with pendant', 'body', () => ({ k: 'tw_puff', v: 'corto', m: TW.salvia, s: TW.salvia }), 'salvia'],
  ['c_tw_cropjk', 'Chaqueta corta negra con cadena', 'Black cropped jacket with chain', 'body', () => ({ k: 'tw_cropjk', m: TW.negro }), 'fuerte'],
  ['c_tw_layers', 'Falda negra de capas con cadena', 'Black tiered skirt with chain', 'legs', () => ({ k: 'tw_layers', m: TW.negro }), 'fuerte'],
  ['c_tw_corset', 'Corsé negro de escote cuadrado', 'Black square-neck corset', 'body', () => ({ k: 'tw_corset', m: TW.negro, s: TW.marron }), 'afilado'],
  ['c_tw_aline', 'Falda marrón evasé', 'Brown A-line skirt', 'legs', () => ({ k: 'tw_aline', m: TW.marron }), 'afilado'],
  ['c_tw_goth', 'Vestido gótico de volantes con guantes', 'Ruffled gothic dress with gloves', 'body', () => ({ k: 'tw_goth', m: TW.negro }), 'gotico'],
  ['c_tw_ruffle', 'Blusa blanca de volantes y perlas', 'White ruffle blouse with pearls', 'body', () => ({ k: 'tw_ruffle', m: TW.blanco }), 'perla'],
  ['c_tw_highwaist', 'Pantalón negro de tiro alto', 'Black high-waisted trousers', 'legs', () => ({ k: 'tw_highwaist', m: TW.negro }), 'perla'],
  ['c_tw_offsh', 'Top naranja de hombros caídos', 'Orange off-shoulder top', 'body', () => ({ k: 'tw_offsh', m: TW.naranja }), 'otono'],
  ['c_tw_ripshort', 'Short negro rasgado', 'Black ripped shorts', 'legs', () => ({ k: 'tw_ripshort', m: TW.negro }), 'otono'],
  ['c_tw_pumpkin', 'Camiseta de calabaza', 'Pumpkin tee', 'body', () => ({ k: 'tw_pumpkin', m: TW.naranja }), 'calabaza'],
  ['c_tw_chain', 'Pantalón negro con cadena', 'Black pants with chain', 'legs', () => ({ k: 'tw_chain', m: TW.negro }), 'calabaza'],
  ['c_tw_botas', 'Botines negros', 'Black ankle boots', 'feet', () => ({ k: 'boots', m: TW.negro }), 'calabaza']];
const twSetN = k => (LANG_EN ? TWR_SETS[k][1] : TWR_SETS[k][0]);
const TW_SRC = L2('Torre Infinita: una prenda cada 5 pisos superados (cualquier modo) y, de los jefes de la torre, una prenda que falte (15 %, segura a los 6 jefes)', 'Infinite Tower: one piece every 5 floors cleared (any mode) and, from tower bosses, a missing piece (15%, guaranteed by the 6th boss)');
for (const [id, es, en, slot, vis, set] of TWR) {
  cosm(id, L2(es, en), slot, vis, { src: TW_SRC, tw: set });
  it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: 40000, icon: ['hanger'], rar: 5, d: L2('Vestuario de la Torre · conjunto ', 'Tower wardrobe · set ') + twSetN(set) + '. ' + TW_SRC + '.' });
}
const TWR_IDS = TWR.map(r => r[0]), TW_STEP = 5, TW_BOSS_CH = 0.15, TW_PITY = 6;
SAVEKEYS.push('twWard');
function twSt() { const P = G.P; const S = P.twWard && typeof P.twWard === 'object' ? P.twWard : (P.twWard = {}); S.hi = S.hi | 0; S.pity = S.pity | 0; return S; }
const twMiss = () => { const W = (G.P && G.P.wardrobe) || []; return TWR_IDS.filter(id => !W.includes(id)); };
function twGive(ids, why) { const got = []; for (const id of ids) if (giveCosmetic(id, true)) got.push(id); if (!got.length) return got;
  setTimeout(() => { for (const id of got) toast('🧥 ' + L2('Vestuario de la Torre: ', 'Tower wardrobe: ') + COSM[id].n, 'quest', 6); banner('🧥 ' + L2('Vestuario de la Torre', 'Tower wardrobe'), why); }, 900); markDirty(true); return got; }
// hitos: al superar un piso múltiplo de 5 por encima del mejor hito, la siguiente prenda que falte (en orden)
hookAfter('tiCleared', () => { try { if (!TI) return; const S = twSt(), f = TI.floor; if (f % TW_STEP || f <= S.hi) return; const n = Math.floor(f / TW_STEP) - Math.floor(S.hi / TW_STEP); S.hi = f;
  const miss = twMiss(); if (!miss.length) return; twGive(miss.slice(0, Math.max(1, n)), L2('Premio del piso ', 'Floor ') + f + L2('', ' reward')); } catch (e) { if (typeof errOnce === 'function') errOnce('twHito', e); } });
// jefes de la torre: una prenda que falte al azar (15 % × eventos, segura a los 6 jefes)
hookAfter('killMob', (r, m) => { try { if (!m || !m.ti || !m.boss || !TI) return; const miss = twMiss(); if (!miss.length) return; const S = twSt(), mul = typeof dropEventMul === 'function' ? dropEventMul() : 1;
  S.pity++; if (S.pity >= TW_PITY || Math.random() < TW_BOSS_CH * mul) { S.pity = 0; twGive([miss[Math.floor(Math.random() * miss.length)]], L2('¡El jefe dejó una prenda!', 'The boss dropped a piece!')); } } catch (e) { if (typeof errOnce === 'function') errOnce('twJefe', e); } });
hookAround('itemSources', (next, id) => TWR_IDS.includes(String(id).replace(/^cosi_/, '')) ? [[TW_SRC, null]] : next(id));
// Lupa › Sistemas
function twNext() { const S = twSt(), miss = twMiss(); if (!miss.length) return L2('¡Vestuario completo!', 'Wardrobe complete!'); return L2('Siguiente premio: piso ', 'Next reward: floor ') + (Math.floor(S.hi / TW_STEP) + 1) * TW_STEP + ' · ' + COSM[miss[0]].n + ' · ' + L2('jefes: segura en ', 'bosses: sure in ') + Math.max(1, TW_PITY - S.pity); }
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_torre_ropa', '🧥 ' + L2('Vestuario de la Torre', 'Tower wardrobe'), () => {
  const W = (G.P && G.P.wardrobe) || [], have = TWR_IDS.filter(id => W.includes(id)).length;
  return [L2('Ropa cosmética (sin estadísticas) de la Torre Infinita, para todas las estructuras de cuerpo, de hombre y de mujer. Se pone en el Armario y se combina como quieras.', 'Cosmetic clothes (no stats) from the Infinite Tower, for every body structure, male and female. Wear it from the Wardrobe and mix as you like.'),
    TW_SRC + '.', '🧥 ' + have + '/' + TWR_IDS.length + ' · ' + twNext()].concat(Object.keys(TWR_SETS).map(k => { const ids = TWR.filter(r => r[5] === k); return (ids.every(r => W.includes(r[0])) ? '✅ ' : '⬜ ') + twSetN(k) + ': ' + ids.map(r => (W.includes(r[0]) ? '' : '· ') + L2(r[1], r[2])).join(', '); })); }, () => null]);
