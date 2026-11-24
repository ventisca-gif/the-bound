// MUESTRA TEMPORAL (no se publica): armaduras de nivel 600-700, una por clase, con estilo de los mares (inspiradas en la
// moda pirata y de la Marina, con diseños y nombres propios). Se carga encima de dist/test.html solo para la imagen.
const X7 = {
  blanco: P5(['#9a968c', '#c8c4b8', '#e8e4d8', '#f6f4ec', '#ffffff']), marino: P5(['#0a1230', '#16204a', '#223068', '#344690', '#5068b8']),
  oro: P5(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), negro: P5(['#060608', '#101014', '#1a1a20', '#26262e', '#3a3a44']),
  tormenta: P5(['#0a1838', '#14306a', '#1e4aa0', '#3a74d0', '#7ab0f0']), cuero: P5(['#2a160c', '#4a2a16', '#6a4022', '#8a5a32', '#b07a4a']),
  rojo: P5(['#3a0a10', '#6a1420', '#a01e30', '#d03a4a', '#f07a80']), rosa: P5(['#6a2a4a', '#a0406a', '#d0608a', '#ec90b0', '#fcc8da']),
  gris: P5(['#2a2a30', '#44444c', '#62626c', '#85858e', '#acacb4']), verde: P5(['#0e2a1a', '#18462a', '#24663a', '#3a8a52', '#62b078']),
  pelo: P5(['#b8b0a8', '#d8d0c8', '#ece6e0', '#f8f4f0', '#ffffff'])
};
// Guerrero · abrigo blanco de vicealmirante sobre los hombros, traje marino y charreteras doradas
fitKind('body', 'x7_almirante', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, W = X7.blanco, Gd = X7.oro;
  for (let y = ty; y < ty + th; y++) { p.set(tx0, y, W[3]); p.set(tx0 + 1, y, W[2]); p.set(R, y, W[2]); p.set(R - 1, y, W[1]); }
  for (const x of [tx0, tx0 + 1, R - 1, R]) { p.set(x, ty, Gd[3]); p.set(x, ty + 1, Gd[2]); }
  if (!up && !side) { for (let y = ty; y < ty + 3; y++) { p.set(Math.round(cx - 0.5), y, W[4]); } p.set(Math.round(cx - 0.5), ty + 3, X7.rojo[2]); for (let r = 0; r < 3; r++) p.set(Math.round(cx + 1.5), ty + 4 + r * 2, Gd[3]); }
  if (up) { for (let y = ty + 1; y < ty + th; y++) for (let x = tx0 + 2; x <= R - 2; x++) p.set(x, y, W[(x + y) % 7 ? 3 : 2]); const k = Math.round(cx - 1); p.set(k, ty + 3, X7.negro[1]); p.set(k + 1, ty + 3, X7.negro[1]); p.set(k, ty + 4, X7.negro[1]); p.set(k + 1, ty + 5, X7.negro[1]); }
  if (side) for (let y = ty; y < ty + th; y++) p.set(Math.round(cx - d * (tw / 2 - 1)), y, W[3]); });
// Mago · gabán de tormenta con rayos dorados y ribete de nube
fitKind('body', 'x7_tormenta', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, Gd = X7.oro, W = X7.blanco;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty + th - 1, W[(x & 1) ? 3 : 4]); }
  for (let y = ty + 1; y < ty + th - 1; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  const bolt = (x0) => { const pts = [[0, 0], [1, 1], [0, 2], [1, 3], [2, 4], [1, 5]]; for (const [dx, dy] of pts) if (ty + 1 + dy < ty + th - 1) p.set(x0 + dx, ty + 1 + dy, Gd[dx & 1 ? 3 : 4]); };
  if (!up && !side) { bolt(Math.round(cx - tw * 0.3)); bolt(Math.round(cx + tw * 0.12)); p.hl(Math.round(cx - 1.5), ty, 3, W[4]); } else if (up) bolt(Math.round(cx - 1)); else bolt(Math.round(cx - d));
  });
// Arquero · gabán de tirador con bandolera de balas cruzada
fitKind('body', 'x7_tirador', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, Gd = X7.oro, K = X7.negro;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!side) for (let k = 0; k < th; k++) { const x = Math.round((up ? R - 1 - k * (tw - 2) / th : tx0 + 1 + k * (tw - 2) / th)), y = ty + k; p.set(x, y, K[2]); p.set(x + 1, y, K[3]); if (k % 2 === 0 && !up) p.set(x, y - 1, Gd[3]); }
  else p.vl(Math.round(cx), ty, th, K[2]);
  if (!up && !side) { p.hl(Math.round(cx - 2), ty, 4, X7.blanco[3]); } p.hl(tx0, ty + th - 2, tw, X7.cuero[1]); p.set(Math.round(cx - 0.5), ty + th - 2, Gd[3]); });
// Asesino · traje negro de agente con cuello alto, corbata y cadena plateada
fitKind('body', 'x7_agente', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, W = X7.blanco, S = X7.gris;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!up && !side) { const dep = Math.max(3, Math.round(th * 0.45)); for (let y = ty; y < ty + dep; y++) { const w = Math.max(0, Math.round((1 - (y - ty) / dep) * 2)); for (let x = Math.round(cx - w - 0.5); x <= Math.round(cx + w - 0.5); x++) p.set(x, y, W[4]); p.set(Math.round(cx - 0.5), y, s.m[0]); }
    p.set(tx0 + 1, ty, s.m[4]); p.set(R - 1, ty, s.m[4]); for (let k = 0; k < 4; k++) p.set(Math.round(cx + 1.5 + (k >> 1)), ty + dep + k, S[k & 1 ? 3 : 4]); }
  else if (up) { p.hl(tx0 + 1, ty, tw - 2, s.m[4]); } else { p.set(Math.round(cx + d * (tw / 2 - 1)), ty, W[4]); p.set(Math.round(cx + d * (tw / 2 - 1)), ty + 1, s.m[0]); } });
// Bardo · frac del barco fantasma con chorrera blanca y flor roja en la solapa
fitKind('body', 'x7_fantasma', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, W = X7.blanco, Rr = X7.rojo;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!up && !side) { for (let y = ty; y < ty + Math.min(th - 1, 5); y++) { const w = y === ty ? 1 : 2; for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, W[(x + y) & 1 ? 3 : 4]); }
    p.set(Math.round(cx - tw / 2 + 2), ty + 2, Rr[3]); p.set(Math.round(cx - tw / 2 + 3), ty + 2, Rr[2]); p.set(Math.round(cx - tw / 2 + 2), ty + 3, Rr[1]); }
  else if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty + 1, W[4]); p.set(fx, ty + 2, W[3]); } else p.vl(Math.round(cx - 0.5), ty + Math.round(th * 0.5), Math.round(th * 0.5), s.m[0]); });
// Invocador · abrigo largo de médica de invierno con cuello de piel
fitKind('body', 'x7_invierno', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, F = X7.pelo;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty, F[(x & 1) ? 3 : 4]); p.set(x, ty + 1, F[(x & 1) ? 2 : 3]); }
  for (let y = ty + 2; y < ty + th; y++) { p.set(tx0, y, F[2]); p.set(R, y, F[1]); }
  if (!up && !side) { p.vl(Math.round(cx - 0.5), ty + 2, th - 2, F[3]); for (let r = 0; r < 3; r++) p.set(Math.round(cx + 0.5), ty + 3 + r * 2, X7.oro[3]); } });
// Hombre-pez · gi de karate cruzado con cinturón negro (piel en el escote)
fitKind('body', 'x7_gi', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, K = X7.negro, S = rmSkin(A, s);
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, s.m[3]); p.set(R, y, s.m[1]); }
  if (!up && !side) for (let y = ty; y < ty + Math.min(th - 3, 5); y++) { const w = 2 - ((y - ty) >> 1); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) if (w > 0) p.set(x, y, S[2]); p.set(Math.round(cx - w - 1), y, s.m[1]); }
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty + th - 2, K[2]); p.set(x, ty + th - 1, K[1]); } if (!up) { const kx = side ? Math.round(cx - d) : Math.round(cx + 2); for (let k = 0; k < 3; k++) p.set(kx + (k & 1), ty + th + k, K[2]); } }, { skin: true });
// sombrero de copa alto con cinta (bardo: negro y rojo; invocador: rosa con cruz blanca)
fitKind('head', 'x7_chistera', (p, A, s) => { const { hx, hy, side } = A, m = s.m, b = s.b || X7.rojo;
  roRow(p, hx - 9, hx + 9, hy - 4, m[1]); roRow(p, hx - 8, hx + 8, hy - 5, m[2]); roRect(p, hx - 5, hy - 13, 11, 8, m[2]); roRow(p, hx - 5, hx + 5, hy - 13, m[3]); for (let y = hy - 12; y < hy - 5; y++) { roSet(p, hx - 5, y, m[3]); roSet(p, hx + 5, y, m[1]); }
  roRow(p, hx - 5, hx + 5, hy - 7, b[2]); roRow(p, hx - 5, hx + 5, hy - 6, b[1]);
  if (s.cross && !side) { roRow(p, hx - 2, hx + 2, hy - 10, X7.blanco[4]); roRect(p, hx, hy - 12, 1, 5, X7.blanco[4]); roRow(p, hx - 2, hx + 2, hy - 10, X7.blanco[4]); } });
// cinta de karate en la frente con las puntas al viento
fitKind('head', 'x7_cinta', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m; roRow(p, hx - 8, hx + 8, hy - 6, m[3]); roRow(p, hx - 8, hx + 8, hy - 5, m[2]);
  const kx = up ? hx : side ? hx - d * 8 : hx + 7; if (side || up) for (let k = 0; k < 4; k++) { roSet(p, kx - (side ? d : 1) * k, hy - 5 + (k >> 1), m[k & 1 ? 2 : 3]); roSet(p, kx - (side ? d : -1) * k, hy - 4 + k, m[2]); } });
const X7_SETS = [
  ['guerrero', '⚔ Guerrero · Vicealmirante del Mar Blanco', { head: { k: 'mr_gorra', m: X7.blanco, cover: 'hat' }, body: { k: 'x7_almirante', m: X7.marino }, legs: { k: 'rm_pantalon', m: X7.marino }, feet: { k: 'boots', m: X7.negro }, back: { k: 'cape', o: X7.blanco, i: X7.marino, tr: X7.oro.slice(1) } }],
  ['mago', '🔮 Mago · Navegante de Tormentas', { head: { k: 'of_strawwide', m: X7.tormenta, s: X7.oro, cover: 'hat' }, body: { k: 'x7_tormenta', m: X7.tormenta }, legs: { k: 'rm_pantalon', m: X7.marino }, feet: { k: 'sandals', m: X7.cuero } }],
  ['arquero', '🏹 Arquero · Francotirador de Ultramar', { head: { k: 'rm_gafas', m: X7.verde, cover: 'hat' }, body: { k: 'x7_tirador', m: X7.cuero }, legs: { k: 'of_cargo', m: X7.verde }, feet: { k: 'boots', m: X7.cuero }, back: { k: 'rm_bolsa' } }],
  ['asesino', '🗡 Asesino · Agente de la Sombra Blanca', { head: { k: 'of_fedora', m: X7.gris, s: X7.negro, cover: 'hat' }, body: { k: 'x7_agente', m: X7.negro }, legs: { k: 'rm_pantalon', m: X7.negro }, feet: { k: 'rm_zapato', m: X7.negro } }],
  ['bardo', '🎻 Bardo · Caballero del Barco Fantasma', { head: { k: 'x7_chistera', m: X7.negro, b: X7.rojo, cover: 'hat' }, body: { k: 'x7_fantasma', m: X7.negro }, legs: { k: 'sy_rayas', m: X7.gris, s: X7.negro }, feet: { k: 'rm_zapato', m: X7.negro }, back: { k: 'cape', o: X7.negro, i: X7.rojo, tr: X7.oro.slice(1) } }],
  ['invocador', '🌸 Invocador · Doctora del Invierno', { head: { k: 'x7_chistera', m: X7.rosa, b: X7.marino, cross: 1, cover: 'hat' }, body: { k: 'x7_invierno', m: X7.rosa }, legs: { k: 'rm_pantalon', m: X7.marino }, feet: { k: 'boots', m: X7.blanco } }],
  ['pez', '🐟 Hombre-pez · Maestro del Karate Marino', { head: { k: 'x7_cinta', m: X7.rojo }, body: { k: 'x7_gi', m: X7.blanco }, legs: { k: 'baggy', m: X7.blanco }, feet: { k: 'sandals', m: X7.cuero } }]];
for (const [cls, , V] of X7_SETS) for (const sl in V) cosm('x7_' + cls + '_' + sl, cls + ' ' + sl, sl, () => V[sl], {});
