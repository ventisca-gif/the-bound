// 6.30 · Ropa de los tres hermanos (Luffy, Ace y Sabo niños) · premio del recuerdo de Foosha.
// Sergio: «que te dé la ropa de ellos, las 3 igualitas… el sombrero, uno que entre en la cabeza y otro que vaya atrás por
// la espalda… toda su ropa con probabilidad al repetir la historia, prendas separadas y pity, para todas las estructuras».
// Solo cosméticos (sin estadísticas). Todo con fitKind y los anclajes del motor: sirve para todas las estructuras de
// BODY_T y las cuatro direcciones. La piel del personaje viaja en la prenda (L.top.sk / L.bot.sk).
// Premio: la primera vez, el sombrero de paja, la camiseta de Ace y la chistera de Sabo seguros. Al repetir, cada prenda
// que falte tiene un 20 % (× eventos) y es segura a las 8 repeticiones sin ella (pity propio por prenda, P.infPity).
SAVEKEYS.push('infPity');
const INFR = {
  paja: P5(['#6a4a16', '#a8802a', '#d8aa42', '#f0cc66', '#fbe6a0']), cinta: [C('#6a1410'), C('#a82a20'), C('#d04a38')],
  marino: P5(['#0c1230', '#161e48', '#222c62', '#34407e', '#4a5698']), verde: P5(['#2a3418', '#3e4c24', '#566834', '#708848', '#8ea864']),
  azul: P5(['#16306a', '#22468e', '#3260b4', '#4a7ed0', '#78a6e8']), azulc: P5(['#3a5a86', '#5a80b0', '#7ea6d4', '#a4c6ea', '#cce2f8']),
  vaquero: P5(['#1a3060', '#284a8a', '#3a64ac', '#5a84c8', '#8aaee0']), gris: P5(['#1c1c22', '#2a2a32', '#3a3a44', '#4c4c58', '#62626e']),
  negro: P5(['#060608', '#0e0e12', '#18181e', '#24242c', '#363642']), cuero: P5(['#3a2210', '#5a3618', '#7a4c24', '#9a6634', '#ba8650']),
  saco: P5(['#5a4426', '#86683e', '#ae8e5c', '#ccae7c', '#e6d2a6']), tubo: P5(['#2a2e34', '#464c54', '#6a727c', '#949ea8', '#c4ccd4']),
  blanco: P5(['#9a9a9a', '#c8c8c8', '#e8e8ea', '#f6f6f8', '#ffffff']), gafa: [C('#1a2a5a'), C('#2e56a8'), C('#6aa0e8'), C('#d8f0ff')], oro: [C('#8a6a10'), C('#d8b030'), C('#f8e070')]
};
const infSk = (A, s) => { const S = (s && s.sk) || A.sk || SKINS[0]; return Array.from(S).map(c => typeof c === 'string' ? C(c) : c); };

// ===================== CABEZA =====================
// sombrero de paja grande con cinta roja: va en la cabeza (se escala solo a cada cabeza)
fitKind('head', 'inf_paja', (p, A) => {
  const { hx, hrx, headTop, side, up } = A, top = Math.round(headTop) - 1, K = INFR.paja, R = INFR.cinta, bw = hrx + 4.5;
  // ala: más ancha que la cabeza, un poco más visible por detrás
  p.ell(hx, top + 7, bw, up ? 3 : 2.2, K[1]); p.ell(hx, top + 6.5, bw - 0.6, up ? 2.6 : 1.8, K[3]);
  for (let x = Math.round(hx - bw + 2); x <= hx + bw - 2; x += 3) p.set(x, top + 7, K[2]);
  // copa redonda
  p.ell(hx, top + 3, hrx - 0.8, 4, K[2]); p.ell(hx - 1, top + 2, hrx - 2.5, 2.6, K[3]); p.set(Math.round(hx - 2), top, K[4]); p.set(Math.round(hx - 1), top, K[4]);
  // cinta roja alrededor de la copa
  const by = top + 5; for (let x = Math.round(hx - hrx + 1); x <= hx + hrx - 1; x++) { p.set(x, by, R[1]); p.set(x, by - 1, x === Math.round(hx - hrx + 1) || side ? R[1] : R[2]); }
  if (side) p.set(Math.round(hx + (A.d || 1) * (hrx - 1)), by, R[0]);
});
// chistera negra con gafas azules en la cinta (Sabo)
fitKind('head', 'inf_copa', (p, A) => {
  const { hx, hrx, headTop, side, up, d } = A, top = Math.round(headTop) + 1, K = INFR.negro, G = INFR.gafa, cw = hrx - 1.5;
  p.ell(hx, top + 3, hrx + 3, 1.6, K[1]); p.hl(Math.round(hx - hrx - 2), top + 3, Math.round((hrx + 2) * 2) + 1, K[3]);
  for (let y = top - 9; y <= top + 2; y++) for (let x = Math.round(hx - cw); x <= Math.round(hx + cw); x++) p.set(x, y, x <= hx - cw + 1 ? K[3] : x >= hx + cw - 1 ? K[1] : K[2]);
  p.hl(Math.round(hx - cw), top - 9, Math.round(cw * 2) + 1, K[4]);
  // cinta azul oscura con las gafas
  for (let x = Math.round(hx - cw); x <= Math.round(hx + cw); x++) { p.set(x, top, G[0]); p.set(x, top + 1, G[0]); }
  if (up) { p.hl(Math.round(hx - cw), top, Math.round(cw * 2) + 1, G[1]); return; }
  const L = side ? [Math.round(hx + d * 2)] : [Math.round(hx - 2.5), Math.round(hx + 2.5)];
  for (const lx of L) { p.ell(lx, top, 2, 1.8, G[1]); p.set(lx, top, G[2]); p.set(lx - 1, top - 1, G[3]); }
  if (!side) p.set(Math.round(hx), top, INFR.tubo[3]);
});

// ===================== CUERPO =====================
// camiseta de tirantes: azul marino con «56» (Luffy) o verde con letras oscuras (Ace). Brazos al aire.
const INF_DIG = { 5: ['111', '100', '111', '001', '111'], 6: ['111', '100', '111', '101', '111'] };
fitKind('body', 'inf_tirantes', (p, A, s) => {
  const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, S = infSk(A, s), R = tx0 + tw - 1;
  // sisas: los hombros quedan al aire
  for (let y = ty; y < ty + 2; y++) { p.set(tx0, y, S[1]); p.set(R, y, S[1]); }
  if (!up && !side) {
    // escote redondo
    const w = Math.max(1, Math.round(tw * 0.18)); for (let x = Math.round(cx - w - 0.5); x <= Math.round(cx + w - 0.5); x++) { p.set(x, ty, S[2]); if (Math.abs(x - cx + 0.5) < w) p.set(x, ty + 1, S[2]); }
    if (s.v === 'luffy' && th >= 7) { const y0 = ty + 2, x0 = Math.round(cx - 3.5), W = C('#e8ecf4'); for (const [k, dig] of [[0, 5], [4, 6]]) INF_DIG[dig].forEach((row, j) => { if (y0 + j >= ty + th - 1) return; for (let i = 0; i < 3; i++) if (row[i] === '1') p.set(x0 + k + i, y0 + j, W); }); }
    if (s.v === 'ace') { const g = m[0], x = Math.round(cx - 1), y0 = ty + 2; for (const [dx, dy] of [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [2, 2], [1, 3], [0, 4], [1, 4], [2, 4], [2, 5]]) if (y0 + dy < ty + th - 1) p.set(x + dx, y0 + dy, g); }
  } else if (side) { const fx = Math.round(cx + d * (tw / 2 - 1)); p.set(fx, ty, S[2]); p.set(fx, ty + 1, S[2]); }
  else p.hl(tx0 + 2, ty, tw - 4, S[1]);
  p.hl(tx0, ty + th - 1, tw, m[1]);
}, { skin: true });
// abrigo azul largo de Sabo: camisa negra, chorrera blanca, hebilla dorada y faldones que bajan por las piernas
fitKind('body', 'inf_abrigo', (p, A, s) => {
  const { tx0, tw, torsoTop: ty, th, cx, side, up, d, legTop, base } = A, m = s.m, R = tx0 + tw - 1, W = INFR.blanco, N = INFR.negro, O = INFR.oro;
  for (let y = ty + 1; y < ty + th; y++) { p.set(tx0, y, m[3]); p.set(R, y, m[1]); }
  const tail = Math.round(legTop + (base - legTop) * 0.55);
  if (!up && !side) {
    const ow = Math.max(1, Math.round(tw * 0.16));
    for (let y = ty; y < ty + th; y++) for (let x = Math.round(cx - ow - 0.5); x <= Math.round(cx + ow - 0.5); x++) p.set(x, y, N[2]);
    for (let y = ty; y < ty + th; y++) { p.set(Math.round(cx - ow - 1.5), y, m[4]); p.set(Math.round(cx + ow + 0.5), y, m[4]); }
    for (let y = ty; y < Math.min(ty + 4, ty + th - 2); y++) for (let x = Math.round(cx - ow - 0.5); x <= Math.round(cx + ow - 0.5); x++) p.set(x, y, (x + y) % 3 === 0 ? W[1] : W[3 + ((y - ty) % 2)]);
    p.set(Math.round(cx - 0.5), ty + th - 2, O[1]); p.set(Math.round(cx + 0.5), ty + th - 2, O[2]);
    for (let y = legTop; y <= tail; y++) { p.set(tx0 - 1, y, m[3]); p.set(tx0, y, m[2]); p.set(R, y, m[1]); p.set(R + 1, y, m[0]); }
    p.set(tx0 - 1, tail, m[1]); p.set(R + 1, tail, m[0]);
  } else if (side) {
    const fx = Math.round(cx + d * (tw / 2 - 1)); for (let y = ty; y < ty + 4; y++) p.set(fx, y, W[3]); p.set(fx - d, ty + th - 2, O[1]);
    const bx = Math.round(cx - d * (tw / 2 - 3)); for (let y = legTop - 1; y <= tail; y++) { const w = 3 + Math.round((y - legTop) / 3); for (let i = 0; i < w; i++) p.set(bx - d * i, y, i === w - 1 ? m[0] : m[2]); }
  } else {
    for (let y = legTop; y <= tail; y++) for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, y, x === Math.round(cx - 0.5) ? m[0] : x <= tx0 ? m[3] : x >= R ? m[1] : m[2]);
    p.hl(tx0 - 1, tail, tw + 2, m[1]); p.hl(tx0 + 1, ty, tw - 2, m[4]);
  }
});

// ===================== PIERNAS =====================
// pantalón corto hasta la rodilla con el dobladillo vuelto (blanco en Luffy); de la rodilla para abajo, piel
fitKind('legs', 'inf_short', (p, A, s) => {
  const { legTop, base } = A, m = s.m, cols = new Set(m), S = infSk(A, s), knee = Math.round(legTop + (base - legTop) * 0.5);
  const cuff = s.v === 'luffy' ? INFR.blanco : s.v === 'sabo' ? INFR.azulc : null;
  for (let y = Math.round(legTop); y < base; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; const k = m.indexOf(c);
    if (y > knee) p.set(x, y, S[Math.min(S.length - 1, Math.max(0, k))]);
    else if (y === knee) p.set(x, y, cuff ? cuff[3] : m[4]);
    else if (y === knee - 1 && cuff) p.set(x, y, s.v === 'sabo' ? cuff[2] : cuff[4]);
    else if ((y - legTop) % 3 === 1 && k === 3) p.set(x, y, m[2]); }
}, { skin: true });

// ===================== ESPALDA =====================
// el sombrero de paja colgado a la espalda con su cordón
fitKind('back', 'inf_paja_esp', (p, A) => {
  const { cx, tw, torsoTop: ty, th, side, up, d } = A, K = INFR.paja, R = INFR.cinta;
  if (up) {
    const yc = ty + Math.round(th * 0.45), rw = tw / 2 + 3;
    p.ell(cx, yc, rw, th * 0.42, K[1]); p.ell(cx, yc - 0.5, rw - 0.8, th * 0.36, K[3]);
    p.ell(cx, yc, tw / 2 - 1, th * 0.26, K[2]); p.ell(cx - 1, yc - 1, tw / 2 - 2.5, th * 0.15, K[3]);
    for (let x = Math.round(cx - tw / 2 + 1); x <= cx + tw / 2 - 1; x++) p.set(x, Math.round(yc + th * 0.22), R[1]);
    p.line(Math.round(cx - 2), ty - 1, Math.round(cx - 3), Math.round(yc - th * 0.3), R[0]); p.line(Math.round(cx + 1), ty - 1, Math.round(cx + 2), Math.round(yc - th * 0.3), R[0]);
  } else if (side) {
    const x0 = Math.round(cx - d * (tw / 2 - 1)), yc = ty + Math.round(th * 0.45);
    for (let y = Math.round(yc - th * 0.42); y <= yc + th * 0.42; y++) for (let i = 0; i < 3; i++) p.set(x0 - d * i, y, K[i === 2 ? 2 : 3]);
    p.ell(x0 - d * 3, yc, 2, th * 0.26, K[2]); p.set(x0 - d * 3, yc + 1, R[1]); p.set(x0 - d * 4, yc + 1, R[1]);
  } else {
    // de frente asoma el ala por detrás de los hombros
    p.ell(cx, ty + 3, tw / 2 + 3.5, 2.4, K[1]); p.ell(cx, ty + 2.5, tw / 2 + 3, 1.8, K[3]);
  }
});
// el saco de Ace al hombro
fitKind('back', 'inf_saco', (p, A) => {
  const { cx, tx0, tw, torsoTop: ty, th, side, up, d } = A, K = INFR.saco;
  if (up) { const bx = Math.round(cx + tw * 0.2), by = ty + Math.round(th * 0.4); p.ball(bx, by, tw * 0.42, th * 0.45, K.slice(1)); p.rect(bx - 1, by - Math.round(th * 0.45) - 1, 3, 2, K[0]); p.line(bx, by - Math.round(th * 0.45), Math.round(cx - tw / 2 + 1), ty, K[1]); }
  else if (side) { const bx = Math.round(cx - d * (tw / 2 + 2)), by = ty + Math.round(th * 0.35); p.ball(bx, by, 3.4, th * 0.42, K.slice(1)); p.set(bx, by - Math.round(th * 0.42), K[0]); }
  else { const bx = Math.round(tx0 + tw), by = ty; p.ball(bx, by, 3.4, 3.2, K.slice(1)); p.set(bx - 1, by - 3, K[0]); }
});
// el tubo de hierro de Sabo cruzado a la espalda
fitKind('back', 'inf_tubo', (p, A) => {
  const { cx, tx0, tw, torsoTop: ty, th, side, up, d } = A, K = INFR.tubo, R = tx0 + tw - 1;
  const seg = (x0, y0, x1, y1) => { p.line(x0, y0, x1, y1, K[2]); p.line(x0 + 1, y0, x1 + 1, y1, K[1]); p.set(x0, y0, K[4]); };
  if (up) { seg(Math.round(tx0 + 1), ty + th + 2, Math.round(R + 2), ty - 6); p.hl(Math.round(R + 2), ty - 6, 3, K[3]); }
  else if (side) { const x = Math.round(cx - d * (tw / 2)); seg(x, ty + th + 1, x - d * 3, ty - 6); p.set(x - d * 4, ty - 6, K[3]); }
  else { seg(Math.round(R - 1), ty + 4, Math.round(R + 2), ty - 6); p.hl(Math.round(R + 2), ty - 6, 3, K[3]); }
});

// ===================== BRAZOS Y PIEL =====================
// tirantes: brazos al aire (Ace lleva vendas en el antebrazo); abrigo: puño claro. Las capas (p.t) dicen qué es brazo:
// el dibujo sin HD no las trae, así que se crean cuando se lleva esta ropa (como hacen el gi y las armaduras).
hookBefore('drawHero', (p, L) => { const k = L && L.top && L.top.k; if ((k === 'inf_tirantes' || k === 'inf_abrigo') && p && !p.t) { p.t = new Uint8Array(p.w * p.h); p.tg = 0; } });
hookAfter('drawHero', (r, p, L, dir, anim, f) => {
  const T = L && L.top; if (!T || !p.t || !p.meta || (T.k !== 'inf_tirantes' && T.k !== 'inf_abrigo')) return;
  const A = p.meta, M = T.m, S = infSk(A, T), rows = {};
  for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3) { const k = M.indexOf(p.d[i]); if (k < 0) continue; const y = (i / p.w) | 0; (rows[y] = rows[y] || []).push(i); if (T.k === 'inf_tirantes') p.d[i] = S[Math.min(S.length - 1, Math.max(0, k - 1))]; }
  const ys = Object.keys(rows).map(Number).sort((a, b) => b - a);
  if (T.k === 'inf_tirantes' && T.v === 'ace') for (const y of ys.slice(1, 4)) if ((y & 1) === 0 || y === ys[1]) for (const i of rows[y]) p.d[i] = INFR.blanco[3];
  if (T.k === 'inf_abrigo' && ys.length) for (const i of rows[ys[0]] || []) p.d[i] = M[4];
});
hookAfter('heroLook', L => {
  if (!L) return; const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c);
  if (L.top && L.top.k === 'inf_tirantes') L.top = Object.assign({}, L.top, { sk: SK });
  if (L.bot && L.bot.k === 'inf_short') L.bot = Object.assign({}, L.bot, { sk: SK });
});

// ===================== COSMÉTICOS Y PREMIO =====================
const INF_SRC = L2('Recuerdo de los hermanos (casa de Dadan, Villa Foosha): la primera vez caen el sombrero de paja, la camiseta de Ace y la chistera de Sabo; al repetir, 20 % por prenda y segura a las 8', 'Memory of the brothers (Dadan’s house, Foosha Village): the first time drops the straw hat, Ace’s tank top and Sabo’s top hat; on replays, 20% per piece and guaranteed by the 8th');
const INF_ROPA = [
  // [id, nombre es, nombre en, ranura, prenda, hermano]
  ['c_inf_luffy_sombrero', 'Sombrero de Paja de Luffy niño', 'Young Luffy’s Straw Hat', 'head', () => ({ k: 'inf_paja', cover: 'hat' }), 'luffy'],
  ['c_inf_luffy_sombrero_esp', 'Sombrero de Paja a la espalda', 'Straw Hat on the Back', 'back', () => ({ k: 'inf_paja_esp' }), 'luffy'],
  ['c_inf_luffy_camiseta', 'Camiseta «56» de Luffy niño', 'Young Luffy’s "56" Tank Top', 'body', () => ({ k: 'inf_tirantes', v: 'luffy', m: INFR.marino, s: INFR.marino }), 'luffy'],
  ['c_inf_luffy_short', 'Pantalón corto de Luffy niño', 'Young Luffy’s Shorts', 'legs', () => ({ k: 'inf_short', v: 'luffy', m: INFR.vaquero, s: INFR.vaquero }), 'luffy'],
  ['c_inf_luffy_sandalias', 'Sandalias de Luffy niño', 'Young Luffy’s Sandals', 'feet', () => ({ k: 'sandals', m: INFR.cuero }), 'luffy'],
  ['c_inf_ace_camiseta', 'Camiseta de tirantes de Ace niño', 'Young Ace’s Tank Top', 'body', () => ({ k: 'inf_tirantes', v: 'ace', m: INFR.verde, s: INFR.verde }), 'ace'],
  ['c_inf_ace_short', 'Pantalón corto de Ace niño', 'Young Ace’s Shorts', 'legs', () => ({ k: 'inf_short', v: 'ace', m: INFR.gris, s: INFR.gris }), 'ace'],
  ['c_inf_ace_botas', 'Botas de Ace niño', 'Young Ace’s Boots', 'feet', () => ({ k: 'boots', m: INFR.gris }), 'ace'],
  ['c_inf_ace_saco', 'Saco de Ace al hombro', 'Ace’s Shoulder Sack', 'back', () => ({ k: 'inf_saco' }), 'ace'],
  ['c_inf_sabo_sombrero', 'Chistera con gafas de Sabo niño', 'Young Sabo’s Goggled Top Hat', 'head', () => ({ k: 'inf_copa', cover: 'hat' }), 'sabo'],
  ['c_inf_sabo_abrigo', 'Abrigo azul de Sabo niño', 'Young Sabo’s Blue Coat', 'body', () => ({ k: 'inf_abrigo', m: INFR.azul, s: INFR.azul }), 'sabo'],
  ['c_inf_sabo_short', 'Pantalón corto de Sabo niño', 'Young Sabo’s Shorts', 'legs', () => ({ k: 'inf_short', v: 'sabo', m: INFR.azulc, s: INFR.azulc }), 'sabo'],
  ['c_inf_sabo_botas', 'Botas negras de Sabo niño', 'Young Sabo’s Black Boots', 'feet', () => ({ k: 'boots', m: INFR.negro }), 'sabo'],
  ['c_inf_sabo_tubo', 'Tubo de hierro de Sabo', 'Sabo’s Iron Pipe', 'back', () => ({ k: 'inf_tubo' }), 'sabo']];
for (const [id, es, en, slot, vis] of INF_ROPA) {
  cosm(id, L2(es, en), slot, vis, { src: INF_SRC });
  it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: 30000, icon: ['hanger'], rar: 5, d: L2('Cosmético de la ropa de los tres hermanos. ', 'Cosmetic from the three brothers’ clothes. ') + INF_SRC + '.' });
}
const INF_ROPA_IDS = INF_ROPA.map(r => r[0]), INF_FIRST = ['c_inf_luffy_sombrero', 'c_inf_ace_camiseta', 'c_inf_sabo_sombrero'], INF_CH = 0.20, INF_PITY = 8;
const infMiss = () => { const W = (G.P && G.P.wardrobe) || []; return INF_ROPA_IDS.filter(id => !W.includes(id)); };
const infLeft = id => Math.max(1, INF_PITY - (((G.P && G.P.infPity) || {})[id] || 0));
// lo llama el final del recuerdo; devuelve las prendas que tocaron
function infClothes(first) {
  const P = G.P; if (!P) return []; P.infPity = P.infPity && typeof P.infPity === 'object' ? P.infPity : {};
  const got = [], mul = typeof dropEventMul === 'function' ? dropEventMul() : 1;
  for (const id of infMiss()) {
    if (first) { if (INF_FIRST.includes(id)) got.push(id); continue; }
    const n = (P.infPity[id] || 0) + 1; if (n >= INF_PITY || Math.random() < INF_CH * mul) got.push(id); else P.infPity[id] = n;
  }
  for (const id of got) { delete P.infPity[id]; giveCosmetic(id, true); }
  if (got.length) setTimeout(() => { for (const id of got) toast('🧥 ' + L2('Nuevo cosmético: ', 'New cosmetic: ') + COSM[id].n, 'quest', 6); banner('🧥 ' + L2('Ropa de los hermanos', 'The brothers’ clothes'), L2('Luffy: «¡Te queda genial! ¡Shishishi!»', 'Luffy: "Looks great on you! Shishishi!"')); }, 1600);
  else if (infMiss().length) setTimeout(() => toast('🧥 ' + L2('Ropa de los hermanos: 20 % por prenda · segura en ', 'Brothers’ clothes: 20% per piece · guaranteed in ') + Math.min(...infMiss().map(infLeft)), 'info', 5), 1600);
  markDirty(true); return got;
}
hookAround('itemSources', (next, id) => INF_ROPA_IDS.includes(String(id).replace(/^cosi_/, '')) ? [[INF_SRC, { loc: INF_DOOR, m: 'dawn', t: L2('Casa de Dadan', 'Dadan’s house') }]] : next(id));
LUPA_DAWN.push(['inf_ropa630', () => '🧥 ' + L2('Ropa de los hermanos', 'The brothers’ clothes'), () => [
  L2('Cosméticos (sin estadísticas), por piezas, para todas las estructuras de cuerpo. Se ponen en el Armario.', 'Cosmetics (no stats), piece by piece, for every body structure. Wear them from the Wardrobe.'),
  INF_SRC + '.'].concat(INF_ROPA.map(([id, es, en, , , who]) => { const W = (G.P && G.P.wardrobe) || []; return (W.includes(id) ? '✅ ' : '⬜ ') + ({ luffy: 'Luffy', ace: 'Ace', sabo: 'Sabo' })[who] + ' · ' + L2(es, en) + (W.includes(id) ? '' : ' · ' + L2('segura en ', 'sure in ') + infLeft(id)); })),
  () => ({ loc: INF_DOOR, m: 'dawn', t: L2('Casa de Dadan', 'Dadan’s house') })]);
