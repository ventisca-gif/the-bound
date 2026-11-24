// 5.98 · Villa Syrup completa (Sergio: «que Kuro suelte su ropa, sus lentes y su arma, garras para todas las clases con
// una mecánica distinta; que todos los personajes de esa isla tengan diálogos del arco; y su ropa como cosmético que se
// compra con dinero»). Ropa con fitKind y los anclajes del motor (10 estructuras, 4 direcciones); arma y efectos aparte.
const SY = {
  negro: P5(['#060608', '#101014', '#1a1a20', '#26262e', '#3a3a44']), blanco: P5(['#9a968c', '#c8c4b8', '#e8e4d8', '#f6f4ec', '#ffffff']),
  oro: P5(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), amarillo: P5(['#8a6a1a', '#c09a32', '#e0c058', '#f2dc8a', '#fff2c4']),
  celeste: P5(['#4a6a8a', '#6a8eb0', '#9ab8d4', '#c4dcec', '#e8f4fa']), marino: P5(['#0c1430', '#18224a', '#242f64', '#34427e', '#4c5c9a']),
  oliva: P5(['#3a3a1a', '#55552a', '#6e6e38', '#8a8a4c', '#a8a868']), gris: P5(['#2a2a30', '#44444c', '#62626c', '#85858e', '#acacb4']),
  morado: P5(['#1c1428', '#2a1e3c', '#3a2a52', '#4e3a6a', '#6a5288']), turquesa: P5(['#1a4a4a', '#246464', '#2e8080', '#46a0a0', '#72c4c0']),
  rojo: P5(['#3a0a10', '#5e121c', '#8a1e2a', '#b0303c', '#d85a62']), crema: P5(['#8a7a5a', '#b8a67e', '#dccaa0', '#efe2c0', '#fff6e0']),
  marron: P5(['#2e1e12', '#4a3020', '#64442c', '#80583a', '#9e7250']), verde: P5(['#1e3a14', '#2e5420', '#3e6e2c', '#56903c', '#78b054']),
  rosa: P5(['#6a2a3a', '#9a4058', '#c8607a', '#e48aa0', '#f8bccb']), naranja: P5(['#7a3408', '#b0520e', '#e07818', '#f09a3a', '#ffc070'])
};
const syPal = h => SY[h];

// ===================== PRENDAS NUEVAS (fitKind) =====================
// frac de mayordomo: chaqueta negra con camisa blanca en V, corbata y dos filas de botones (Kuro dorados, Merry chaleco gris)
fitKind('body', 'sy_frac', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1, V = s.v || SY.blanco, Gd = s.gold === false ? SY.gris : SY.oro, vest = s.vest;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  if (!up && !side) { const dep = Math.max(4, Math.round(th * 0.6));
    for (let y = ty; y < ty + dep; y++) { const w = Math.max(0, Math.round((1 - (y - ty) / dep) * (tw / 2 - 1.5)) + 1); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, (vest && y > ty + 2) ? vest[2] : V[x < cx - w + 1 ? 3 : 4]); p.set(Math.round(cx - w - 1), y, Gd[s.gold === false ? 1 : 3]); p.set(Math.round(cx + w), y, Gd[s.gold === false ? 1 : 2]); }
    for (let y = ty + 1; y < ty + Math.min(dep, 4); y++) { p.set(Math.round(cx - 0.5), y, SY.negro[1]); if (!vest) p.set(Math.round(cx + 0.5), y, SY.negro[2]); }
    for (let r = 0; r < 3; r++) { const y = ty + 2 + r * 2; if (y >= ty + th - 1) break; p.set(Math.round(cx - tw / 2 + 2), y, Gd[3]); p.set(Math.round(cx + tw / 2 - 3), y, Gd[3]); }
    p.hl(tx0, ty + th - 1, tw, m[0]); }
  else if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); for (let y = ty; y < ty + 3; y++) p.set(fx, y, V[4]); p.set(fx, ty + 1, SY.negro[1]); p.set(fx - d, ty + 4, Gd[3]); p.set(fx - d, ty + 6, Gd[3]); }
  else { p.vl(Math.round(cx - 0.5), ty + Math.round(th * 0.45), Math.max(1, Math.round(th * 0.55)), m[0]); p.hl(tx0 + 2, ty, tw - 4, V[2]); } });
// conjunto de dama: rebeca amarilla abierta sobre un vestido blanco con franja celeste
fitKind('body', 'sy_vestido', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1, W = SY.blanco, B = SY.celeste;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  if (!up && !side) { const w = Math.max(1, Math.round(tw * 0.22)); for (let y = ty + 1; y < ty + th; y++) for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, W[(x + y) % 5 === 0 ? 3 : 4]);
    const by = ty + Math.max(3, Math.round(th * 0.55)); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) { p.set(x, by, B[2]); p.set(x, ty + 1, B[3]); } for (let y = ty + 1; y < ty + th; y++) { p.set(Math.round(cx - w - 1), y, m[4]); p.set(Math.round(cx + w), y, m[2]); } }
  else if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); for (let y = ty + 1; y < ty + th; y++) p.set(fx, y, W[4]); p.set(fx, ty + Math.max(3, Math.round(th * 0.55)), B[2]); }
  else { p.hl(tx0 + 1, ty, tw - 2, m[4]); for (let y = ty + 2; y < ty + th; y += 2) p.set(Math.round(cx - 0.5), y, m[2]); } });
// gabán de hipnotista: azul marino largo, abierto, ribete dorado y camisa oliva
fitKind('body', 'sy_gaban', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1, O = SY.oliva, Gd = SY.oro;
  for (let y = ty; y < ty + th; y++) { p.set(tx0, y, Gd[2]); p.set(R, y, Gd[1]); }
  if (!up && !side) { const w = Math.max(1, Math.round(tw * 0.2)); for (let y = ty + 1; y < ty + th; y++) { for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, O[(y - ty) % 3 ? 3 : 2]); p.set(Math.round(cx - w - 1), y, Gd[3]); p.set(Math.round(cx + w), y, Gd[2]); }
    p.hl(Math.round(cx - w - 1), ty + th - 2, 2 * w + 2, SY.marron[1]); p.set(Math.round(cx - 0.5), ty + th - 2, Gd[4]); }
  else if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); for (let y = ty; y < ty + th; y++) p.set(fx, y, Gd[3]); p.set(fx - d, ty + 1, O[3]); }
  else { p.vl(Math.round(cx - 0.5), ty + 2, th - 2, m[0]); for (let x = tx0; x <= R; x += 3) p.set(x, ty + th - 1, Gd[2]); } });
// camisa holgada oscura con cuello abierto
fitKind('body', 'sy_camisa', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); } p.hl(tx0, ty + th - 1, tw, m[1]);
  if (!up && !side) { const S = rmSkin(A, s); for (let y = ty; y < ty + 3; y++) { const w = 2 - (y - ty); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, S[2]); } for (let y = ty + 3; y < ty + th - 1; y += 2) p.set(Math.round(cx - 0.5), y, m[0]); }
  else if (side) p.set(Math.round(cx + d * (tw / 2 - 1)), ty, m[4]); else p.hl(tx0 + 1, ty, tw - 2, m[4]); }, { skin: true });
// torso al aire con chaleco negro abierto y una faja amarilla enorme
fitKind('body', 'sy_faja', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, S = rmSkin(A, s), R = tx0 + tw - 1, Y = SY.amarillo, K = SY.negro, sy0 = ty + th - 3;
  for (let y = ty; y < sy0; y++) for (let x = tx0; x <= R; x++) { const edge = up || x - tx0 < 2 || R - x < 2 || side; p.set(x, y, edge ? K[x === tx0 || x === R ? 1 : 3] : S[x === tx0 + 2 ? 1 : 2]); }
  if (!up && !side) { p.set(Math.round(cx - 0.5), ty + Math.round(th * 0.45), S[0]); p.set(Math.round(cx - 3), ty + 2, S[1]); p.set(Math.round(cx + 2), ty + 2, S[1]); }
  for (let y = sy0; y < ty + th + 1; y++) for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, y, Y[y === sy0 ? 4 : y === ty + th ? 1 : (x % 3 ? 3 : 2)]);
  if (!up) { const kx = side ? Math.round(cx + d * 2) : Math.round(cx + tw * 0.25); for (let k = 0; k < 4; k++) { p.set(kx + (k & 1), ty + th + 1 + k, Y[k & 1 ? 2 : 3]); } } }, { skin: true });
// camiseta de niño con tirantes
fitKind('body', 'sy_tirantes', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1, T = s.t || SY.marron;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  const a = Math.round(cx - tw * 0.22), b = Math.round(cx + tw * 0.22) - 1;
  if (side) { p.vl(Math.round(cx), ty, th, T[2]); return; }
  p.vl(a, ty, th, T[up ? 1 : 2]); p.vl(b, ty, th, T[up ? 1 : 3]); if (up) p.line(a, ty + 2, b, ty + 5, T[1]); else { p.set(a, ty + 2, SY.oro[3]); p.set(b, ty + 2, SY.oro[3]); } });

// piernas: falda blanca a rayas celestes hasta la rodilla
fitKind('legs', 'sy_falda', (p, A, s) => { const { legTop, base, tx0, tw, side, up } = A, cols = new Set(s.m), S = s.sk || rmSkin(A, s), m = s.m, B = SY.celeste;
  const knee = legTop + Math.max(2, Math.round((base - legTop) * 0.45)), x0 = Math.round(tx0) - 1, x1 = Math.round(tx0 + tw);
  for (let y = legTop; y < base - 1; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; if (y > knee) p.set(x, y, S[Math.min(S.length - 1, Math.max(0, m.indexOf(c)))]); }
  for (let y = legTop; y <= knee; y++) { const g = (y - legTop) >> 1, a = x0 - g, b = x1 + g; for (let x = a; x <= b; x++) p.set(x, y, (x - a) % 3 === 1 ? B[2] : m[x === a ? 2 : x === b ? 2 : y === knee ? 2 : 4]); } }, { skin: true });
// pantalón corto hasta la rodilla (piernas a la vista)
fitKind('legs', 'sy_corto', (p, A, s) => { const { legTop, base } = A, cols = new Set(s.m), S = s.sk || rmSkin(A, s), knee = legTop + Math.max(2, Math.round((base - legTop) * 0.4));
  for (let y = legTop; y < base - 1; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; const k = s.m.indexOf(c);
    if (y > knee) p.set(x, y, S[Math.min(S.length - 1, Math.max(0, k))]); else if (y === knee) p.set(x, y, s.m[1]); } }, { skin: true });
// pantalón ancho a rayas verticales
fitKind('legs', 'sy_rayas', (p, A, s) => { const cols = new Set(s.m), st = s.s || SY.negro; for (const [x, y] of roLegPix(p, A, cols, A.legTop, A.base - 2)) if (x % 3 === 0) p.set(x, y, st[(y & 1) ? 1 : 2]); });

// cabeza: cuernos de carnero enroscados a los lados
fitKind('head', 'sy_cuernos', (p, A, s) => { const { hx, side, d } = A, m = s.m, sides = side ? [-d] : [-1, 1], hr = A.hrx || 6, top = A.headTop;
  for (const sg of sides) { const x0 = Math.round(hx + sg * (hr - 2)), y0 = Math.round(top + 4); // un píxel dentro de la sien: sigue tocando al escalarse a cada estructura
    const ring = [[0, 0], [0, -1], [1, -2], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 2], [1, 1], [2, 0]];
    ring.forEach(([dx, dy], i) => roSet(p, x0 + sg * dx, y0 + dy, m[i < 5 ? 3 : i < 9 ? 2 : 4])); roSet(p, x0 + sg * 2, y0 + 3, m[1]); } });
// espalda: cola de gato
fitKind('back', 'sy_cola', (p, A, s) => { const { cx, tx0, tw, torsoTop: ty, th, side, up, d } = A, m = s.m, y0 = Math.round(ty + th - 1);
  // empieza tocando el borde del torso a la altura de la cadera y se curva hacia arriba
  const x0 = up ? Math.round(cx) : side ? Math.round(cx - d * (tw / 2)) : Math.round(tx0 + tw), dir = up ? 1 : side ? -d : 1;
  const path = up ? [[0, 0], [0, 1], [1, 2], [2, 2], [3, 1], [4, 0], [4, -1], [5, -2], [5, -3], [4, -4]] : [[0, 0], [1, 0], [2, -1], [3, -2], [3, -3], [4, -4], [4, -5], [3, -6], [3, -7], [4, -8]];
  path.forEach(([dx, dy], i) => { roSet(p, x0 + dir * dx, y0 + dy, m[i === path.length - 1 ? 4 : i & 1 ? 2 : 3]); if (i > 1) roSet(p, x0 + dir * (dx + 1), y0 + dy, m[1]); }); });

// la piel viaja con la prenda para las que dejan piel a la vista (heroLook copia L.top/L.bot)
const SY_SKIN = new Set(['sy_camisa', 'sy_faja', 'sy_falda', 'sy_corto']);
{ const _hl = heroLook; heroLook = function () { const L = _hl.apply(this, arguments); try { if (!L) return L; const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c);
  if (L.top && SY_SKIN.has(L.top.k)) L.top = Object.assign({}, L.top, { sk: SK }); if (L.bot && SY_SKIN.has(L.bot.k)) L.bot = Object.assign({}, L.bot, { sk: SK }); } catch (e) { } return L; }; }
// sin mangas (faja): los brazos pasan a piel; frac: guantes blancos en las manos
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { const T = L && L.top; if (!T || !p.t) return r;
  if (T.k === 'sy_faja' && T.sk) { const S = T.sk, M = T.m; for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3) { const k = M.indexOf(p.d[i]); if (k >= 0) p.d[i] = S[Math.min(S.length - 1, Math.max(0, k))]; } }
  if (T.k === 'sy_frac' && T.gloves && p.meta) { const rows = {}; for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3 && T.m.indexOf(p.d[i]) >= 0) { const y = (i / p.w) | 0; (rows[y] = rows[y] || []).push(i); }
    const ys = Object.keys(rows).map(Number).sort((a, b) => b - a).slice(0, 2); for (const y of ys) for (const i of rows[y]) p.d[i] = SY.blanco[y === ys[0] ? 3 : 4]; } } catch (e) { } return r; }; }

// ===================== GAFAS (accesorios de cara) =====================
function syFaAdd(id, es, en, pr, draw) { faAdd(id, es, en, pr, 'gafas', draw); FA_ID[id] = FA[FA.length - 1]; }
// gafas redondas finas que brillan (se suben con la palma)
syFaAdd('fa_kuro', 'Gafas redondas del mayordomo', 'Butler’s round glasses', 6000, (p, F) => faGlasses(p, F, faC('#1a1a22'), faC('#d8ecf8'), { lens: (p, x, y, fr, gl) => { faPx(p, x, y - 1, fr); faPx(p, x + 1, y - 1, fr); faPx(p, x - 1, y, fr); faPx(p, x + 2, y, fr); faPx(p, x - 1, y + 1, fr); faPx(p, x + 2, y + 1, fr); faPx(p, x, y + 2, fr); faPx(p, x + 1, y + 2, fr); faPx(p, x, y, faC('#ffffff')); faPx(p, x + 1, y, gl); faPx(p, x, y + 1, gl); faPx(p, x + 1, y + 1, gl); } }));
// gafas de corazón oscuras del hipnotista
syFaAdd('fa_jango', 'Gafas de corazón del hipnotista', 'Hypnotist’s heart glasses', 4500, (p, F) => faGlasses(p, F, faC('#3a0a2a'), faC('#a83a7a'), { lens: (p, x, y, fr, gl) => { faPx(p, x - 1, y - 1, fr); faPx(p, x + 2, y - 1, fr); faH(p, x - 1, y, 4, gl); faH(p, x, y + 1, 2, gl); faPx(p, x - 1, y, fr); faPx(p, x + 2, y, fr); faPx(p, x, y + 2, fr); faPx(p, x + 1, y + 2, fr); faPx(p, x, y, faC('#f0a8d0')); } }));

// ===================== LOS COSMÉTICOS =====================
const SY_SRC = L2('Merry · Mansión de Kaya (Villa Syrup, Mar de Dawn)', 'Merry · Kaya’s manor (Syrup Village, Dawn Sea)');
const SY_KURO_SRC = L2('Kuro (nivel 580) en Villa Syrup: 30 % por pieza, segura a la victoria 12. Después, Merry también la vende.', 'Kuro (level 580) in Syrup Village: 30% per piece, guaranteed by win 12. Afterwards Merry sells it too.');
// [id, es, en, ranura, aspecto, precio]
const SY_SETS = [
  ['kuro', '🐾 ' + L2('Mayordomo de las Garras', 'Clawed Butler'), [
    ['c_sy_kuro_frac', 'Frac negro de mayordomo', 'Black butler’s tailcoat', 'body', () => ({ k: 'sy_frac', m: SY.negro, gloves: 1 }), 60000],
    ['c_sy_kuro_pant', 'Pantalón negro de mayordomo', 'Black butler’s trousers', 'legs', () => ({ k: 'rm_pantalon', m: SY.negro }), 30000],
    ['c_sy_kuro_zap', 'Zapatos de charol', 'Patent leather shoes', 'feet', () => ({ k: 'rm_zapato', m: SY.negro }), 20000]]],
  ['kaya', '🌼 ' + L2('Dama de la Mansión', 'Lady of the Manor'), [
    ['c_sy_kaya_vest', 'Rebeca amarilla y vestido blanco', 'Yellow cardigan and white dress', 'body', () => ({ k: 'sy_vestido', m: SY.amarillo }), 26000],
    ['c_sy_kaya_falda', 'Falda blanca a rayas celestes', 'White skirt with pale blue stripes', 'legs', () => ({ k: 'sy_falda', m: SY.blanco }), 22000],
    ['c_sy_kaya_bot', 'Botines marrones', 'Brown ankle boots', 'feet', () => ({ k: 'boots', m: SY.marron }), 14000]]],
  ['jango', '🌀 ' + L2('Hipnotista del Péndulo', 'Pendulum Hypnotist'), [
    ['c_sy_jango_som', 'Sombrero de ala ancha marino', 'Navy wide-brim hat', 'head', () => ({ k: 'of_strawwide', m: SY.marino, s: SY.oro, cover: 'hat' }), 30000],
    ['c_sy_jango_gab', 'Gabán marino con ribete dorado', 'Navy greatcoat with gold trim', 'body', () => ({ k: 'sy_gaban', m: SY.marino }), 36000],
    ['c_sy_jango_pant', 'Pantalón oliva', 'Olive trousers', 'legs', () => ({ k: 'rm_pantalon', m: SY.oliva }), 18000],
    ['c_sy_jango_bot', 'Botas negras de viaje', 'Black travel boots', 'feet', () => ({ k: 'boots', m: SY.negro }), 16000]]],
  ['merry', '🐑 ' + L2('Mayordomo Carnero', 'Ram Steward'), [
    ['c_sy_merry_cuer', 'Cuernos de carnero', 'Ram horns', 'head', () => ({ k: 'sy_cuernos', m: SY.crema }), 18000],
    ['c_sy_merry_frac', 'Frac con chaleco gris', 'Tailcoat with grey waistcoat', 'body', () => ({ k: 'sy_frac', m: SY.negro, vest: SY.gris, gold: false }), 32000],
    ['c_sy_merry_pant', 'Pantalón gris a rayas', 'Grey striped trousers', 'legs', () => ({ k: 'sy_rayas', m: SY.gris, s: SY.negro }), 20000]]],
  ['sham', '🐈 ' + L2('Gato Ligero', 'Nimble Cat'), [
    ['c_sy_sham_orejas', 'Orejas de gato moradas', 'Purple cat ears', 'head', () => ({ k: 'catears', m: SY.morado, cover: 'hat' }), 12000],
    ['c_sy_sham_camisa', 'Camisa morada holgada', 'Loose purple shirt', 'body', () => ({ k: 'sy_camisa', m: SY.morado }), 18000],
    ['c_sy_sham_corto', 'Bermuda turquesa', 'Teal knee shorts', 'legs', () => ({ k: 'sy_corto', m: SY.turquesa }), 15000],
    ['c_sy_sham_cola', 'Cola de gato', 'Cat tail', 'back', () => ({ k: 'sy_cola', m: SY.negro }), 16000]]],
  ['buchi', '🐾 ' + L2('Gato Pesado', 'Heavy Cat'), [
    ['c_sy_buchi_cap', 'Capucha negra de gato', 'Black cat hood', 'head', () => ({ k: 'wolfhood', m: SY.negro, cover: 'hat' }), 18000],
    ['c_sy_buchi_faja', 'Chaleco abierto y faja amarilla', 'Open vest and yellow sash', 'body', () => ({ k: 'sy_faja', m: SY.negro }), 22000],
    ['c_sy_buchi_pant', 'Pantalón ancho de rayas rojas', 'Wide red-striped trousers', 'legs', () => ({ k: 'sy_rayas', m: SY.rojo, s: SY.negro }), 18000],
    ['c_sy_buchi_capa', 'Capa blanca', 'White cape', 'back', () => ({ k: 'cape', o: SY.crema, i: SY.blanco, tr: SY.crema }), 24000]]],
  ['ninos', '🥕 ' + L2('Piratas Pequeños', 'Little Pirates'), [
    ['c_sy_ninjin_gorra', 'Gorra roja', 'Red cap', 'head', () => ({ k: 'cap', m: SY.rojo, cover: 'hat' }), 6000],
    ['c_sy_piman_gorro', 'Gorro verde', 'Green bucket hat', 'head', () => ({ k: 'of_bucket', m: SY.verde, cover: 'hat' }), 6000],
    ['c_sy_tama_casco', 'Casco amarillo de explorador', 'Yellow explorer helmet', 'head', () => ({ k: 'of_hardhat', m: SY.amarillo, cover: 'hat' }), 6000],
    ['c_sy_ninos_tir', 'Camiseta con tirantes', 'Tee with suspenders', 'body', () => ({ k: 'sy_tirantes', m: SY.crema, t: SY.verde }), 8000],
    ['c_sy_ninos_corto', 'Pantalón corto de aventura', 'Adventure shorts', 'legs', () => ({ k: 'sy_corto', m: SY.marron }), 8000]]]
];
const SY_IDS = [], SY_KURO = new Set();
for (const [set, title, pieces] of SY_SETS) for (const [id, es, en, slot, vis, price] of pieces) { const n = L2(es, en), src = set === 'kuro' ? SY_KURO_SRC : SY_SRC;
  cosm(id, n, slot, vis, { src }); it('cosi_' + id, { n, t: 'cos', cos: id, price, icon: ['hanger'], rar: set === 'kuro' ? 5 : 4, d: title + ' · ' + L2('cosmético, se pone en el Armario. ', 'cosmetic, wear it from the Wardrobe. ') + src });
  SY_IDS.push(id); if (set === 'kuro') SY_KURO.add(id); }
// la tienda de Merry: todo lo de la isla; lo de Kuro solo cuando ya lo venciste
const syShopList = () => SY_IDS.filter(id => !SY_KURO.has(id) || (G.P && G.P.bossKills && G.P.bossKills[SYRUP_CAPTAIN])).map(id => 'cosi_' + id);
SHOPS.symoda = { syrup: syShopList() };
DLG_HOOKS.push((npc, opts) => { if (npc && npc.id === SYRUP_MERRY) opts.unshift({ label: '👕 ' + L2('Ver la ropa de Villa Syrup', 'See the Syrup Village clothes'), icon: ['hanger'], fn: () => { closeDialog(); SHOPS.symoda.syrup = syShopList(); openShop('symoda', 'syrup'); } }); });
{ const _sp = itemSources; itemSources = function (id) { const k = String(id).replace(/^cosi_/, ''); if (SY_IDS.includes(k)) return [[SY_KURO.has(k) ? SY_KURO_SRC : SY_SRC, { loc: SYRUP_MANOR, m: 'dawn', t: 'Merry' }]]; if (id === 'fa_kuro' || id === KURO_CLAWS) return [[SY_KURO_SRC, { loc: SYRUP_KURO, m: 'dawn', t: 'Kuro' }]]; return _sp.apply(this, arguments); }; }
if (typeof townPriceMul === 'function') { const _tp = townPriceMul; townPriceMul = function (t) { return t === 'syrup' ? 1 : _tp.apply(this, arguments); }; }

// ===================== GARRAS DEL GATO (arma de Kuro, todas las clases) =====================
const KURO_CLAWS = 'w_kuro_claws';
const kuroBaseAtk = (() => { const a = Object.keys(CLASSES).map(c => (ITEMS['w_' + c + '_42'] || ITEMS['w_' + c + '_41'] || {}).atk).filter(Number.isFinite).sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : 3000; })();
it(KURO_CLAWS, { n: L2('Garras del Gato', 'Cat Claws'), t: 'weapon', slot: 'weapon', lv: 580, tier: 42, atk: Math.round(kuroBaseAtk * 1.06), price: 60000, icon: ['kuro_claws'], rar: 5, buggyClaws: true, kuroClaws: true,
  d: L2('Guantes con diez cuchillas largas. Todas las clases a nivel 580. Cada golpe son dos zarpazos rápidos; cada cuarto golpe, «Paso sin sonido»: cruzas en línea a los enemigos (×1,8) sin que te toquen.', 'Gloves with ten long blades. Every class at level 580. Each attack is two quick swipes; every fourth attack, “Silent Step”: you dash through enemies in a line (×1.8) untouchable.') });
function kuroClawIcon() { const p = new Pix(16, 16), W = SY.blanco, B = RO_SV; p.rect(3, 11, 3, 3, W[3]); p.set(3, 13, W[1]); p.set(4, 11, W[4]);
  for (let i = 0; i < 4; i++) p.line(5 + i, 11 - i, 8 + i, 5 - (i >> 1), B[i & 1 ? 2 : 3]); p.set(11, 3, B[4]); p.outline(OUTL, false); return p; }
const KURO_CLAW_PIX = kuroClawIcon();
{ const old = genIcon; genIcon = function (spec) { return spec[0] === 'kuro_claws' ? KURO_CLAW_PIX : old.apply(this, arguments); }; }
{ const old = gearTiers; gearTiers = function (P) { const out = old.apply(this, arguments); if (P.equip.weapon && P.equip.weapon.id === KURO_CLAWS) { out.kcl = 1; delete out.bcl; } return out; }; }
{ const old = cleanGear; cleanGear = function (g) { const out = old.apply(this, arguments); if (g && g.kcl === 1) out.kcl = 1; return out; }; }
{ const old = heroLook; heroLook = function (cls, app, gear) { const L = old.apply(this, arguments); if (gear && gear.kcl) L.weapon = { k: 'kuro_claws', tier: 42, dual: true }; return L; }; }
{ const old = drawWeapon; drawWeapon = function (p, W, hx, hy, ang) { if (!W || W.k !== 'kuro_claws') return old.apply(this, arguments); drawSpriteRot(p, KURO_CLAW_PIX, hx, hy, ang, [4, 12]); }; }
// el golpe: el motor llama a buggyGloveBasic para cualquier arma con buggyClaws
{ const old = buggyGloveBasic; buggyGloveBasic = function (P, ang) { if (!P.equip.weapon || P.equip.weapon.id !== KURO_CLAWS) return old.apply(this, arguments); return kuroClawBasic(P, ang); }; }
function kuroClawBasic(P, ang) { P.kuroN = (P.kuroN || 0) + 1; const M = G.map;
  if (P.kuroN % 4) { for (const [t, da] of [[0.06, -0.18], [0.15, 0.2]]) delayAct(t, () => { if (P.dead || G.map !== M) return; hitArc(P.x, P.y, ang + da, 46, 1.9, P.S.atk * 0.62, { kb: 10 });
      for (let i = -1; i <= 1; i++) addFx({ type: 'slash', x: P.x, y: P.y - 2 + i * 2, ang: ang + da + i * 0.12, arc: 1.3, r: 40 + i * 3, dur: 0.16, col: '#e8f0ff' }); sfx('slash'); }); return; }
  // Paso sin sonido
  const L = 78, dx = Math.cos(ang), dy = Math.sin(ang), ox = P.x, oy = P.y; P.ifr = Math.max(P.ifr || 0, 0.3); P.busy = Math.max(P.busy || 0, 0.25);
  floatText(P.x, P.y - 44, L2('Paso sin sonido', 'Silent Step'), '#d8e8ff'); sfx('swing');
  const hit = new Set(); for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.remove || m.map !== M.id) continue; const vx = m.x - ox, vy = m.y - oy, al = vx * dx + vy * dy, pr = Math.abs(-vx * dy + vy * dx); if (al > -6 && al < L + 10 && pr < 18 + (m.rad || 8)) hit.add(m); }
  for (let k = 0; k < 6; k++) { const x = P.x, y = P.y; if (!moveEnt(M, P, dx * L / 6, dy * L / 6)) break; addFx({ type: 'slash', x, y, ang, arc: 0.5, r: 18, dur: 0.25, col: 'rgba(200,220,255,0.7)' }); }
  delayAct(0.05, () => { for (const m of hit) if (!m.dying) { hitMob(m, P.S.atk * 1.8, { kb: 50 }); addFx({ type: 'ring', x: m.x, y: m.y, r: 16, dur: 0.3, col: '#d8e8ff' }); } if (hit.size) G.shake = Math.max(G.shake, 4); }); }

// ===================== BOTÍN DE KURO =====================
SAVEKEYS.push('kuroPity');
// [objeto, probabilidad, seguro a la victoria, ya lo tienes]
const KURO_DROPS = [
  [KURO_CLAWS, 0.20, 10, P => (P.equip.weapon && P.equip.weapon.id === KURO_CLAWS) || countItem(KURO_CLAWS) > 0],
  ['fa_kuro', 0.30, 12, P => (P.faOwn || []).includes('fa_kuro')],
  ...[...SY_KURO].map(id => ['cosi_' + id, 0.30, 12, P => (P.wardrobe || []).includes(id) || countItem('cosi_' + id) > 0])];
const kuroMissing = P => KURO_DROPS.filter(r => !r[3](P));
// objeto solo para enseñar las gafas en la barra del jefe (las gafas se guardan en P.faOwn, no en la mochila)
it('fai_kuro', { n: L2('Gafas redondas del mayordomo', 'Butler’s round glasses'), t: 'mat', price: 0, icon: ['kuro_claws'], rar: 5, d: L2('Accesorio de cara de Kuro (Armario › 👓 Cara).', 'Kuro’s face accessory (Wardrobe › 👓 Face).') });
const kuroShow = id => id === 'fa_kuro' ? 'fai_kuro' : id;
BOSS_EXTRA[SYRUP_CAPTAIN] = () => { const P = G.P; if (!P || !P.inv) return []; return kuroMissing(P).map(([id, ch, cap]) => [kuroShow(id), ch, L2('seguro en ', 'sure in ') + Math.max(1, cap - ((P.kuroPity || {})[id] || 0))]); };
{ const old = bossKilled; bossKilled = function (m) { const P = G.P, R = G.map && G.map.syrup && G.map.syrup.run, ok = m && m.mid === SYRUP_CAPTAIN && R && R.foes.includes(m); const r = old.apply(this, arguments); if (!ok) return r;
  try { P.kuroPity = P.kuroPity || {}; for (const [id, ch, cap] of kuroMissing(P)) { const n = Math.min(cap, (P.kuroPity[id] || 0) + 1); if (n < cap && Math.random() >= ch * dropEventMul()) { P.kuroPity[id] = n; continue; }
      let got = false; if (id === 'fa_kuro') { P.faOwn = P.faOwn || []; if (!P.faOwn.includes('fa_kuro')) P.faOwn.push('fa_kuro'); got = true; toast('👓 ' + L2('Gafas redondas del mayordomo (Armario › 👓 Cara)', 'Butler’s round glasses (Wardrobe › 👓 Face)'), 'quest', 5); }
      else got = giveItem(id, 1, true);
      if (got) { delete P.kuroPity[id]; lootFx(m.x, m.y, kuroShow(id)); } else P.kuroPity[id] = cap; } markDirty(true); } catch (e) { } return r; }; }
// revancha con Kuro después de la historia (para conseguir el botín)
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (!npc || npc.id !== SYRUP_KAYA || !P || !syrupWon(SYRUP_CAPTAIN, P) || !P.syrupUsopp) return; const M = G.map; if (!M || !M.syrup || M.syrup.run) return;
  opts.unshift({ label: '⚔ ' + L2('Kuro volvió a la terraza (revancha)', 'Kuro is back on the terrace (rematch)') + (kuroMissing(P).length ? ' · 🎁' : ''), icon: ['sword'], fn: () => { closeDialog(); const won = P.bossKills[SYRUP_CAPTAIN]; delete P.bossKills[SYRUP_CAPTAIN]; try { syrupStart('captain'); } finally { if (M.syrup.run) P.kuroRematch = won; else P.bossKills[SYRUP_CAPTAIN] = won; } } }); });
// si la revancha termina sin vencerlo (sales, caes o abandonas), la historia sigue como estaba
V33_TICKS.push(() => { const P = G.P; if (!P || !P.kuroRematch) return; const M = G.map, run = M && M.syrup && M.syrup.run; if (run && run.stage === 'captain' && !P.dead) return; if (!P.bossKills[SYRUP_CAPTAIN]) P.bossKills[SYRUP_CAPTAIN] = P.kuroRematch; P.kuroRematch = 0; markDirty(true); });

// ===================== DIÁLOGOS DEL ARCO =====================
// etapas: antes (village/manor/slope) · durante (forest/captain) · después (recruit/done)
const syPhase = () => { const s = syrupStage(G.P || {}); return s === 'recruit' || s === 'done' ? 2 : s === 'forest' || s === 'captain' ? 1 : 0; };
const SY_LINES = {
  [SYRUP_USOPP]: [[L2('¡Que vienen los piratas! …Esta vez no es broma, lo juro por mis ocho mil seguidores.', 'Pirates are coming! …This time it’s no joke, I swear on my eight thousand followers.'), L2('El mayordomo de Kaya habló con un tipo de sombrero en la playa. Planean algo para su herencia.', 'Kaya’s butler talked to a man in a hat on the beach. They’re planning something for her inheritance.'), L2('Nadie me cree porque miento todas las mañanas. Lo sé. Por eso tengo que pararlos yo.', 'Nobody believes me because I lie every morning. I know. That’s why I have to stop them myself.')],
    [L2('Mis piernas tiemblan, ¡pero es de la emoción! Cubriré la cuesta con mi tirachinas.', 'My legs are shaking, but from excitement! I’ll cover the slope with my slingshot.'), L2('Si Kaya despierta mañana sin saber nada de esto, habremos ganado.', 'If Kaya wakes up tomorrow knowing nothing about this, we’ll have won.')],
    [L2('Nadie del pueblo sabrá lo que pasó. Seguiré gritando mentiras por la mañana… y eso está bien.', 'Nobody in the village will know what happened. I’ll keep shouting lies in the morning… and that’s fine.'), L2('Quiero ser un guerrero valiente del mar. ¿Tienes sitio en el barco para alguien así?', 'I want to be a brave warrior of the sea. Got room on the ship for someone like that?')]],
  [SYRUP_KAYA]: [[L2('Klahadore lleva tres años cuidándome. Usopp dice cosas terribles de él… no quiero creerlas.', 'Klahadore has cared for me for three years. Usopp says terrible things about him… I don’t want to believe them.'), L2('Las historias de Usopp son lo único que me saca de esta habitación.', 'Usopp’s stories are the only thing that gets me out of this room.')],
    [L2('Merry está herido. Me dijo que el mayordomo… que Klahadore… No puede ser.', 'Merry is hurt. He told me the butler… that Klahadore… It can’t be.'), L2('Si es verdad, yo misma le pediré que se vaya de esta casa.', 'If it’s true, I’ll ask him to leave this house myself.')],
    [L2('Voy a estudiar medicina. Cuando Usopp vuelva, quiero poder curar a toda su tripulación.', 'I’m going to study medicine. When Usopp comes back, I want to be able to heal his whole crew.'), L2('El barco de Merry es mi regalo. Cuidadlo, por favor.', 'Merry’s ship is my gift. Please take care of it.')]],
  [SYRUP_MERRY]: [[L2('El señor Klahadore se sube las gafas con la palma. Nunca lo vi sonreír de verdad.', 'Mr Klahadore pushes his glasses up with his palm. I never saw him truly smile.'), L2('La señorita Kaya mejora cuando ese muchacho de la nariz larga viene a contarle historias.', 'Miss Kaya feels better whenever that long-nosed boy comes to tell her stories.')],
    [L2('Me atacó con unas garras… Era él. Proteged a la señorita, os lo ruego.', 'He attacked me with claws… It was him. Protect the young lady, I beg you.')],
    [L2('Diseñé el Going Merry con una carabela de cabeza de carnero. Que os lleve lejos.', 'I designed the Going Merry, a caravel with a ram’s head. May it carry you far.'), L2('Tengo la ropa de todos los que pasaron por esta isla. Si quieres un recuerdo, pregúntame.', 'I keep the clothes of everyone who passed through this island. If you want a keepsake, just ask.')]],
  syrup_ninjin: [[L2('¡Piratas de Usopp, en formación! …Bueno, somos tres.', 'Usopp Pirates, fall in! …Well, there are three of us.'), L2('Hoy el capitán no se rio de su mentira. Eso me da miedo.', 'Today the captain didn’t laugh at his own lie. That scares me.')],
    [L2('Fuimos a buscar al capitán al bosque y había un señor con un péndulo. ¡No lo mires!', 'We went to find the captain in the woods and there was a man with a pendulum. Don’t look at it!')],
    [L2('El capitán se va al mar. Ahora los Piratas de Usopp protegeremos el pueblo.', 'The captain is going to sea. Now the Usopp Pirates will protect the village.')]],
  syrup_piman: [[L2('Vi huellas de gato enormes en la cuesta del norte. ¡Gato gordo, gato flaco!', 'I saw huge cat prints on the north slope. Fat cat, skinny cat!')],
    [L2('¡Uno, dos… Jango! Si cuenta hasta tres, tápate los ojos.', 'One, two… Jango! If he counts to three, cover your eyes.')],
    [L2('Kaya ya puede salir al jardín. ¡Ha sido cosa nuestra! …y un poco vuestra.', 'Kaya can go out to the garden now. That was us! …and a bit you.')]],
  syrup_tamanegi: [[L2('Conozco todos los atajos. Ese de los árboles lleva directo a la mansión.', 'I know every shortcut. The one through the trees goes straight to the manor.')],
    [L2('¡El mayordomo tenía garras! ¡Diez cuchillas! Corre más que el viento.', 'The butler had claws! Ten blades! He runs faster than the wind.')],
    [L2('Guardé un pedazo de la cuesta como trofeo. Es una piedra, pero es histórica.', 'I kept a piece of the slope as a trophy. It’s a rock, but it’s historic.')]],
  syrup_meshi: [[L2('Usopp grita «piratas» cada mañana. Hoy le temblaba la voz de verdad.', 'Usopp shouts “pirates” every morning. Today his voice really trembled.')],
    [L2('Anoche se oyeron golpes por la cuesta. Usopp dijo que era una broma… otra vez.', 'Last night there were noises on the slope. Usopp said it was a joke… again.')],
    [L2('Dicen que Usopp se marcha. El pueblo va a estar muy callado por las mañanas.', 'They say Usopp is leaving. The village will be very quiet in the mornings.')]],
  syrup_west: [[L2('Dos tipos con garras bajaron por la cuesta. Uno gordo, otro con un sombrero de orejas.', 'Two clawed fellows came down the slope. A fat one and one with an eared hat.')],
    [L2('Algo enorme rodó cuesta abajo y se partió contra las rocas. Nadie quiere salir.', 'Something huge rolled down the slope and broke on the rocks. Nobody wants to go out.')],
    [L2('La cuesta vuelve a estar tranquila. Solo quedan arañazos en las piedras.', 'The slope is quiet again. Only scratches are left on the stones.')]],
  syrup_east: [[L2('Un anillo en un hilo… Lo vi brillar entre los árboles. Me quedé dormida en la silla.', 'A ring on a string… I saw it glint in the trees. I fell asleep in my chair.')],
    [L2('Hoy mis gallinas no paran de contar «uno, dos». Esto es obra de alguien.', 'Today my hens keep counting “one, two”. Someone’s behind this.')],
    [L2('Encontré un péndulo roto en el bosque. Lo enterré, por si acaso.', 'I found a broken pendulum in the woods. I buried it, just in case.')]],
  syrup_dock: [[L2('Un barco con bandera de gato y sin fanales está tras las rocas. No me gusta.', 'A ship with a cat flag and no lanterns is behind the rocks. I don’t like it.')],
    [L2('Los Piratas del Gato Negro desembarcaron en la cuesta del norte. ¡Al sur no, por suerte!', 'The Black Cat Pirates landed on the north slope. Not the south, luckily!')],
    [L2('El barco del gato se fue sin capitán. Y vosotros os lleváis el de la cabeza de carnero.', 'The cat ship left without its captain. And you’re taking the ram-headed one.')]]
};
V33_TICKS.push(() => { try { const M = G.map; if (!M || !M.syrup || G.t - (SY_LINES._t || 0) < 1.5) return; SY_LINES._t = G.t; const ph = syPhase();
  for (const id in SY_LINES) { if (id === '_t' || !NPCS[id]) continue; const L = SY_LINES[id][ph] || SY_LINES[id][0]; NPCS[id].lines = L; for (const e of G.ents) if (e.type === 'npc' && e.id === id && e.def && !e.noTalk) e.def.lines = L; } } catch (e) { } });

// las gafas de Kuro no se venden en el Armario hasta vencerlo
{ const _rw = renderWardrobe; renderWardrobe = function (B) { const r = _rw.apply(this, arguments); try { const P = G.P, b = B.querySelector('[data-faw="fa_kuro"]'); if (b && !(P.faOwn || []).includes('fa_kuro') && !(P.bossKills || {})[SYRUP_CAPTAIN]) { b.disabled = true; const sm = b.querySelector('small'); if (sm) sm.textContent = '🔒 ' + L2('Kuro (Villa Syrup)', 'Kuro (Syrup Village)'); } } catch (e) { } return r; }; }

// ---------- Lupa ----------
if (typeof LUPA_DAWN !== 'undefined') LUPA_DAWN.push(['syrup598', () => '🐾 ' + L2('Villa Syrup: botín de Kuro y ropa', 'Syrup Village: Kuro’s loot and clothes'), () => [
  L2('Kuro suelta las Garras del Gato (arma de todas las clases, 20 %, segura a la victoria 10), sus gafas redondas y su frac, pantalón y zapatos (30 % cada pieza, seguras a la 12). Revancha: habla con Kaya cuando termines la historia.', 'Kuro drops the Cat Claws (all-class weapon, 20%, guaranteed by win 10), his round glasses and his tailcoat, trousers and shoes (30% each, guaranteed by win 12). Rematch: talk to Kaya after the story.'),
  L2('Garras del Gato: cada golpe son dos zarpazos rápidos y cada cuarto golpe haces «Paso sin sonido», un tajo en línea que cruza a los enemigos (×1,8) sin recibir daño.', 'Cat Claws: each attack is two quick swipes and every fourth attack is “Silent Step”, a line slash through enemies (×1.8) while untouchable.'),
  L2('Merry (mansión de Kaya) vende la ropa de toda la isla por piezas: Dama de la Mansión, Hipnotista del Péndulo, Mayordomo Carnero, Gato Ligero, Gato Pesado y Piratas Pequeños. Lo de Kuro, cuando ya lo venciste.', 'Merry (Kaya’s manor) sells the whole island’s clothes piece by piece: Lady of the Manor, Pendulum Hypnotist, Ram Steward, Nimble Cat, Heavy Cat and Little Pirates. Kuro’s set once you have beaten him.'),
  L2('Gafas de corazón del hipnotista: Armario › 👓 Cara (4.500 de oro).', 'Hypnotist’s heart glasses: Wardrobe › 👓 Face (4,500 gold).')], () => ({ loc: SYRUP_MANOR, m: 'dawn', t: 'Merry' })]);
