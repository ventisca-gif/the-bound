(() => {
const H = h => C(h), PAL = a => a.map(H);
const RED = PAL(['#2a0608', '#5a1014', '#8a1e22', '#b03a36', '#d8706a']);   // sombrero y forro
const BAND = PAL(['#6a4a44', '#a88a80', '#d8c0b4', '#f0e0d4']);
const BLK = PAL(['#08070c', '#141219', '#201d28', '#2e2a38', '#403a4c']);    // negro de la ropa
const GRY = PAL(['#3a3840', '#5c5a64', '#7c7a84', '#9a98a2', '#b8b6c0']);    // capa exterior del top
const BOOT = PAL(['#2a2240', '#4a4070', '#6a5e98', '#8a80b8', '#b0a8d8']);
const GLOW = PAL(['#7a2a08', '#e0601a', '#ff9a2a', '#ffd070', '#fff4c0']);
const set = (p, x, y, c) => p.set(Math.round(x), Math.round(y), c);
const row = (p, x0, x1, y, c) => { for (let x = Math.round(x0); x <= Math.round(x1); x++) p.set(x, Math.round(y), c); };
// ---- sombrero de ala ancha con cinta cosida y gafas brillantes sobre el ala ----
fitKind('head', 'smp_hat', (p, A) => { const { hx, hy, side, up, d, headTop } = A, hr = A.hrx || 7, by = Math.round(hy - 3);
  const W = hr + 6; // ala
  for (let y = 0; y < by - 1; y++) for (let x = hx - W - 3; x <= hx + W + 3; x++) p.set(x, y, 0); // el pelo no asoma por encima del ala
  for (let x = hx - W; x <= hx + W; x++) { const e = Math.abs(x - hx) > W - 3 ? 1 : 0, t = side ? (x - hx) * d : 0; const y = by + e - (side && t > W - 4 ? 1 : 0);
    set(p, x, y, RED[1]); set(p, x, y - 1, RED[x < hx ? 3 : 2]); if (Math.abs(x - hx) < W - 1) set(p, x, y + 1, RED[0]); }
  const top = Math.round(headTop - 2), cw = hr - 1;
  for (let y = top; y < by - 1; y++) { const k = (y - top) / Math.max(1, by - 1 - top), half = Math.round(cw - 1 + k * 1.5); for (let x = hx - half; x <= hx + half; x++) set(p, x, y, RED[x === hx - half ? 3 : x === hx + half ? 1 : y === top ? 3 : 2]); }
  // cinta clara con puntadas
  for (let x = hx - cw - 1; x <= hx + cw + 1; x++) { set(p, x, by - 2, BAND[(x % 3) ? 2 : 1]); set(p, x, by - 3, BAND[(x % 3) ? 3 : 2]); }
  if (up) return;
  // gafas de cristal naranja brillante en la parte delantera del ala
  const lens = side ? [hx + d * (hr - 1)] : [hx - 3, hx + 3];
  for (const lx of lens) { row(p, lx - 1, lx + 1, by - 1, GLOW[2]); row(p, lx - 1, lx + 1, by, GLOW[1]); set(p, lx, by - 1, GLOW[4]); set(p, lx - 1, by - 2, GLOW[3]); set(p, lx + 1, by - 2, GLOW[3]); set(p, lx, by - 2, GLOW[3]); }
  if (!side) set(p, hx, by - 1, BLK[3]);
}, {});
// ---- top doble: polera negra de cuello alto y mangas negras + blusa gris encima; la polera de arriba deja un hombro al aire ----
fitKind('body', 'smp_top', (p, A) => { const { tx0, tw, torsoTop: ty, cx, side, up, d, legTop } = A, R = tx0 + tw - 1, SK = A.sk;
  const x0 = side ? cx - 3 : tx0, x1 = side ? cx + 2 : R, gy = ty + 3;   // la blusa gris empieza 3 filas bajo el cuello
  // polera negra (de arriba) en todo el torso
  for (let y = ty - 1; y < legTop; y++) for (let x = x0; x <= x1; x++) set(p, x, y, BLK[x === x0 ? 3 : x === x1 ? 1 : 2]);
  row(p, cx - 2, cx + 1, ty - 2, BLK[3]); row(p, cx - 2, cx + 1, ty - 1, BLK[4]);   // cuello alto
  // blusa gris debajo, se ve del pecho a la cintura
  for (let y = gy; y <= A.waistY + 1; y++) for (let x = x0; x <= x1; x++) set(p, x, y, GRY[x === x0 ? 4 : x === x1 ? 1 : ((x + y) % 4 === 0 ? 3 : 2)]);
  row(p, x0, x1, gy - 1, BLK[0]);                                         // borde de la polera negra sobre la gris
  // hombro al aire (el izquierdo del personaje): de frente a la derecha, de espaldas a la izquierda, de perfil al mirar a la izquierda
    // faja negra en la cintura
  row(p, x0, x1, A.waistY + 2, BLK[1]); row(p, x0, x1, A.waistY + 3, BLK[3]);
  if (up || side) return;
  // collar de cadena blanca y colgante rosa
  for (let k = -3; k <= 1; k++) set(p, cx + k, ty + (Math.abs(k + 0.5) < 2 ? 2 : 1), k % 2 ? H('#e8e8f0') : H('#b0b0c0'));
  set(p, cx - 1, ty + 3, H('#ff9ae8')); set(p, cx, ty + 3, H('#e050c0')); set(p, cx - 1, ty + 4, H('#a02a90')); set(p, cx, ty + 4, H('#a02a90'));
}, { skin: true });
// ---- capa negra con forro rojo y bordes rotos ----
fitKind('back', 'smp_cape', (p, A) => { const { cx, tw, torsoTop: ty, base, side, up, d, anim, f } = A, half0 = tw / 2, sw = anim === 'walk' ? (f % 2) : 0, bot = base + 1 - sw;
  const rag = (x, y) => y >= bot - 2 && ((x * 7 + (y - bot) * 3 + 40) % 5 < 2);
  if (up) { for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 2 + t * 4);
      for (let x = cx - hw; x < cx + hw; x++) { if (rag(x, y)) continue; set(p, x, y, x <= cx - hw + 1 || x >= cx + hw - 2 ? RED[2] : (x - cx + 41) % 4 === 0 ? BLK[1] : BLK[2]); } }
    row(p, cx - half0 - 2, cx + half0 + 1, ty - 2, RED[2]); return; }
  if (side) { for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), w = Math.round(3 + t * 6) + sw, x0 = cx - d * 2;
      for (let i = 0; i < w; i++) { const x = x0 - d * i; if (rag(x, y)) continue; set(p, x, y, i === w - 1 ? RED[3] : i === 0 ? RED[1] : (i === w - 2 ? RED[2] : BLK[2])); } } return; }
  for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 3 + t * 5);
    for (let x = cx - hw; x < cx + hw; x++) { if (rag(x, y)) continue; if (y >= A.legTop && Math.abs(x - cx + 0.5) < half0 + 1) continue; const edge = x <= cx - hw + 1 || x >= cx + hw - 2; set(p, x, y, edge ? (x <= cx - hw ? RED[1] : x >= cx + hw - 1 ? RED[1] : RED[3]) : RED[(x + y) % 4 ? 2 : 1]); } }
  // cuello alzado de la capa a los lados
  for (const sg of [-1, 1]) { const xx = Math.round(cx + sg * (half0 + 1)) - (sg > 0 ? 1 : 0); for (let k = 0; k < 3; k++) { set(p, xx + sg * k, ty - 2 - k, RED[3]); set(p, xx + sg * k, ty - 1 - k, RED[2]); } }
}, {});
// ---- falda negra larga en capas con bajo roto ----
fitKind('legs', 'smp_skirt', (p, A) => { const { tx0, tw, cx, side, up, legTop, base, anim, f } = A, R = tx0 + tw - 1, len = Math.max(2, Math.round((base - legTop) * 0.25));
  for (let y = legTop; y <= legTop + len; y++) { const e = (y - legTop) / len * 2, x0 = Math.round((side ? cx - 4 : tx0 - 1) - e), x1 = Math.round((side ? cx + 3 : R + 1) + e);
    for (let x = x0; x <= x1; x++) { if (y === legTop + len && (x + f) % 2) continue; const band = (y - legTop) % 3 === 2; set(p, x, y, band ? BLK[0] : x === x0 ? BLK[3] : x === x1 ? BLK[1] : ((x - cx + 40) % 3 === 0 ? BLK[1] : BLK[2])); } }
}, {});
// ---- botas altas hasta el muslo, morado grisáceo con cordones ----
fitKind('feet', 'smp_boots', (p, A, s) => { const { legTop, base, up, side } = A, len = Math.max(2, Math.round((base - legTop) * 0.25)), top = Math.round(legTop + len + 1), cols = new Set([...(A.sk || []), ...s.m, ...LEGP]);
  const pts = []; for (let y = top; y <= base + 1; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) pts.push([x, y]);
  const key = new Set(pts.map(q => q[0] + ',' + q[1])), has = (x, y) => key.has(x + ',' + y);
  for (const [x, y] of pts) { const l = has(x - 1, y), r = has(x + 1, y); set(p, x, y, y === top ? BOOT[4] : !l ? BOOT[3] : !r ? BOOT[1] : y >= base ? BOOT[1] : BOOT[2]);
    if (!l && y < base) set(p, x - 1, y, BOOT[0]); if (!r && y < base) set(p, x + 1, y, BOOT[0]); }
  if (!up) for (const [x, y] of pts) if (y > top && y < base - 1 && (y - top) % 2 === 1 && has(x - 1, y) && has(x + 1, y)) set(p, x, y, BOOT[4]);   // cordones
}, {});
const LEGP = PAL(['#100f14', '#17151c', '#1e1b24', '#26222e', '#2e2a36']);
// hombro al aire: la manga negra se baja del hombro izquierdo del personaje. Se pinta piel en la parte alta de ese brazo
// (capa 3 = brazo) después de dibujarlo: de frente el brazo de la derecha, de espaldas el de la izquierda, de perfil al mirar a la izquierda.
hookBefore('drawHero', (p, L) => { if (L && L.top && L.top.k === 'smp_top' && p && !p.t) { p.t = new Uint8Array(p.w * p.h); p.tg = 0; } });
hookAfter('drawHero', (r, p, L, dir) => {
  const T = L && L.top; if (!T || T.k !== 'smp_top' || !p.t || !p.meta || dir !== 'down') return;
  const A = p.meta, SK = (L.skin || []).map(c => typeof c === 'string' ? C(c) : c), cx = A.cx, pts = [];
  for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3 && T.m.includes(p.d[i])) { const x = i % p.w; if (dir === 'down' ? x >= cx : dir === 'up' ? x < cx : true) pts.push(i); }
  if (!pts.length) return; const y0 = Math.min(...pts.map(i => (i / p.w) | 0));
  for (const i of pts) { const y = (i / p.w) | 0, x = i % p.w; if (y > y0 + 1) continue; const edge = !pts.includes(i + 1); p.d[i] = y === y0 ? SK[2] : SK[edge ? 1 : 2]; }
  for (const i of pts) { const y = (i / p.w) | 0; if (y === y0 + 2) p.d[i] = BLK[0]; }   // borde de la manga caída
});
const S = (k, m) => () => ({ k, m: m || BLK, s: RED, cover: k === 'smp_hat' ? 'hat' : undefined });
cosm('c_smp_hat', 'Sombrero', 'head', S('smp_hat', RED)); cosm('c_smp_top', 'Top', 'body', S('smp_top')); cosm('c_smp_cape', 'Capa', 'back', S('smp_cape'));
cosm('c_smp_skirt', 'Falda', 'legs', S('smp_skirt', LEGP)); cosm('c_smp_boots', 'Botas', 'feet', S('smp_boots', BOOT));
})();
